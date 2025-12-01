const { Investment, User,  InvestmentPlan,Transaction} = require('../../model');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');
const { v4: uuidv4 } = require('uuid');
const EmailTemplate = require("./accuralEmail");


function ROIService() {
  return {
    processCompletedInvestments: async function() {
      const result = { processed: 0, failed: 0, errors: [] };
      
      try {
        const now = new Date();
        logger.debug(`🔍 Looking for active investments for daily ROI accrual as of: ${now.toISOString()}`);

        // Find active investments that are ongoing or ending
        const activeInvestments = await Investment.findAll({
          where: {
            status: 'active',
            start_date: { [Op.lte]: now }, // Started
            end_date: { [Op.gte]: now }    // Not yet ended (for accrual during period)
          },
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'walletBalance', 'revenue', 'username']
          },{
            model: InvestmentPlan,
            as: 'investmentPlan',
            attributes: ['roi_percentage', 'duration_days', 'name'] // ADDED NAME HERE
          }]
        });

        logger.debug(`📊 Found ${activeInvestments.length} active investments to check for daily accrual`);

        // One day in milliseconds
        const ONE_DAY_MS = 1000 * 60 * 60 * 24;

        // Process each investment
        for (const investment of activeInvestments) {
          try {
            const startDate = new Date(investment.start_date);
            const endDate = new Date(investment.end_date);

            // Validate dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              throw new Error(`Invalid start_date or end_date for investment ${investment.id}`);
            }

            const durationDays = Math.ceil((endDate - startDate) / ONE_DAY_MS);
            const roiPercentage = investment.investmentPlan.roi_percentage / 100;
            const totalROI = parseFloat(investment.amount) * roiPercentage * durationDays;
            const dailyRoi = totalROI / durationDays;

            // Determine last payout date (repurposing payout_date as last_daily_payout_date; null means start_date)
            let lastPayoutDate = investment.payout_date ? new Date(investment.payout_date) : new Date(startDate);
            if (isNaN(lastPayoutDate.getTime())) {
              lastPayoutDate = new Date(startDate);
            }

            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0); // Start of today

            // Check if a new day has started since last payout
            if (todayStart > lastPayoutDate) {
              // Calculate days elapsed since start (for logging/validation)
              const startDay = new Date(startDate);
              startDay.setHours(0, 0, 0, 0);
              const daysElapsed = Math.floor((todayStart - startDay) / ONE_DAY_MS) + 1;

              // Create a new Date object for endDate to avoid modifying the original
              const endDateStartOfDay = new Date(endDate);
              endDateStartOfDay.setHours(0, 0, 0, 0);
              const isLastDay = todayStart.getTime() >= endDateStartOfDay.getTime();
              let amountToAdd = dailyRoi;
              
              if (isLastDay) {
                // Ensure full remaining ROI is paid on last day
                const totalDue = totalROI;
                const alreadyPaid = dailyRoi * (daysElapsed - 1);
                amountToAdd = Math.max(totalDue - alreadyPaid, dailyRoi);
              }

              const roiAmountNum = parseFloat(amountToAdd.toFixed(2));

              // Get the asset type from the investment
              const assetType = investment.asset;
              
              if (!assetType) {
                throw new Error(`No asset type found for investment ${investment.id}`);
              }

              // Update both walletBalance and revenue
              await User.increment(
                { 
                  walletBalance: roiAmountNum,
                  revenue: roiAmountNum,
                  [`${assetType.toLowerCase()}Bal`]: roiAmountNum

                },
                { where: { id: investment.user.id } }
              );

              // Create transaction for ROI
              await Transaction.create({
                userId: investment.user.id,
                investmentId: investment.id,
                amount: roiAmountNum,
                type: 'ROI Credit',
                description: `Daily ROI for ${investment.investmentPlan.name} investment in ${assetType}`,
                transactionId: `txn_${uuidv4()}`,
                asset: assetType
              });


              // Update investment: set payout_date to today (as last_daily_payout)
              await investment.update({
                payout_date: todayStart // Repurposed as last_daily_payout_date
              });

              if (isLastDay) {
                // Get user to update specific asset balance (ONLY ON LAST DAY)
                const user = await User.findByPk(investment.user.id);
                if (!user) {
                  throw new Error(`User not found for investment ${investment.id}`);
                }

                // Calculate total amount to add to asset balance (initial investment + total revenue)
                const investmentAmount = parseFloat(investment.amount);
                const totalAssetAmount = investmentAmount + totalROI;

                // Update the specific asset balance (ONLY ON LAST DAY)
                await User.increment({
                  [`${assetType.toLowerCase()}Bal`]: totalAssetAmount,
                  walletBalance: investmentAmount
                }, { where: { id: investment.user.id } });

                // Mark investment as completed
                await investment.update({
                  status: 'completed',
                  actual_roi: totalROI,
                  payout_date: endDate
                });

                // Create transaction for capital return to asset balance
                await Transaction.create({
                  userId: investment.user.id,
                  investmentId: investment.id,
                  amount: totalAssetAmount,
                  type: 'ROI Credit',
                  description: `Capital return + total ROI credited to ${assetType} balance for ${investment.investmentPlan.name} investment`,
                  transactionId: `txn_${uuidv4()}`,
                  asset: assetType
                });

                logger.info(`✅ Completed investment ${investment.id} on last day, credited ${totalAssetAmount} ${assetType} (capital: ${investmentAmount} + ROI: ${totalROI}) to asset balance`);
              } else {
                logger.info(`💸 Accrued daily ROI of ${roiAmountNum} to wallet for investment ${investment.id} (day ${daysElapsed}/${durationDays})`);
              }

              // Send ROI accrual email
              try {
                const userEmail = investment.user.email;
                console.log(userEmail)
                if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
                  logger.error(`Invalid or missing email for investment ${investment.id}: ${userEmail}`);
                } else {
                  await EmailTemplate.roiAccrualEmail({
                    email: userEmail,
                    planName: investment.investmentPlan.name,
                    roiAmount: roiAmountNum,
                    date: todayStart,
                    transactionId: investment.transaction_id
                  });
                  logger.info(`📧 ROI email sent for investment ${investment.id}`);
                }
              } catch (emailError) {
                logger.error(`❌ Failed to send daily ROI email for investment ${investment.id}:`, emailError);
                // Don't fail the entire process due to email error
              }

              result.processed++;
              
            } else {
              logger.debug(`⏭️ Skipping ${investment.id}: Already accrued for today`);
            }

          } catch (error) {
            result.failed++;
            result.errors.push({
              investment_id: investment.id,
              user_id: investment.user.id,
              error: error.message
            });
            
            logger.error(`❌ Failed to process investment ${investment.id}:`, error);
          }
        }

        // Handle overdue investments
        const overdueInvestments = await Investment.findAll({
            where: {
              status: 'active',
              end_date: { [Op.lt]: now }
            },
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'walletBalance', 'revenue', 'username', 'email']
            }, {
              model: InvestmentPlan,
              as: 'investmentPlan',
              attributes: ['roi_percentage', 'duration_days', 'name']
            }]
        });
        logger.debug(`📊 Found ${overdueInvestments.length} overdue investments`);

        for (const investment of overdueInvestments) {
          try {
            const endDate = new Date(investment.end_date);
            if (isNaN(endDate.getTime())) {
              throw new Error(`Invalid end_date for overdue investment ${investment.id}`);
            }
            const roiPercentage = investment.investmentPlan.roi_percentage / 100;
            const duration = investment.investmentPlan.duration_days;
            const roiAmount = parseFloat(investment.amount) * roiPercentage * duration;
            const roiAmountNum = parseFloat(roiAmount.toFixed(2));

            // Get the asset type from the investment
            const assetType = investment.asset;
            
            if (!assetType) {
              throw new Error(`No asset type found for overdue investment ${investment.id}`);
            }

            logger.info(`Balance calculation debug (overdue):`, {
                investmentId: investment.id,
                userId: investment.userId,
                currentBalance: investment.user.walletBalance,
                currentRevenue: investment.user.revenue,
                roiAmount: roiAmount
            });


            // Update user walletBalance and revenue for ROI
            await User.increment(
              { 
                walletBalance: roiAmountNum,
                revenue: roiAmountNum
              },
              { where: { id: investment.user.id } }
            );
            

            const investmentAmount = parseFloat(investment.amount);
            const totalAssetAmount = investmentAmount + roiAmountNum;

            // Update the specific asset balance
            await User.increment({
              [`${assetType.toLowerCase()}Bal`]: totalAssetAmount,
              walletBalance: investmentAmount
            }, { where: { id: investment.user.id } });

            // Mark investment as completed
            await investment.update({
              status: 'completed',
              actual_roi: roiAmountNum,
              payout_date: now
            });

            // Create transaction for the completion
            await Transaction.create({
              userId: investment.user.id,
              investmentId: investment.id,
              amount: totalAssetAmount,
              type: 'ROI Credit',
              description: `Completed overdue investment - Capital + ROI credited to ${assetType} balance`,
              transactionId: `txn_${uuidv4()}`,
              asset: assetType
            });
            
            result.processed++;
            
            logger.info(`💸 Paid overdue full ROI of ${roiAmount} to user ${investment.user.username} (${investment.user.id})`);

          } catch (error) {
            result.failed++;
            result.errors.push({
              investment_id: investment.id,
              user_id: investment.user.id,
              error: error.message
            });
            
            logger.error(`❌ Failed to process overdue investment ${investment.id}:`, error);
          }
        }

        return result;

      } catch (error) {
        logger.error('❌ ROI processing error:', error);
        result.errors.push({ error: error.message });
        return result;
      }
    },
  };
}

module.exports = { 
  ROIService: ROIService(),
  processCompletedInvestments: ROIService().processCompletedInvestments
};