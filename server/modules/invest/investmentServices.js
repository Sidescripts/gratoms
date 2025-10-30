const { Investment, InvestmentPlan, User, Transaction } = require('../../model');
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
        logger.debug(`🔍 Processing daily ROI accrual as of: ${now.toISOString()}`);

        // Find active investments that are ongoing
        const activeInvestments = await Investment.findAll({
          where: {
            status: 'active',
            start_date: { [Op.lte]: now }, // Started
            end_date: { [Op.gte]: now }    // Not yet ended
          },
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'walletBalance', 'revenue', 'username']
          }, {
            model: InvestmentPlan,
            as: 'investmentPlan',
            attributes: ['roi_percentage', 'duration_days']
          }]
        });

        logger.debug(`📊 Found ${activeInvestments.length} active investments for daily ROI accrual`);

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

            // Calculate daily ROI based on percentage
            const durationDays = Math.ceil((endDate - startDate) / ONE_DAY_MS);
            const roiPercentage = investment.investmentPlan.roi_percentage / 100; // e.g., 10% -> 0.1
            const totalROI = parseFloat(investment.amount) * roiPercentage * durationDays;
            const dailyRoi = totalROI / durationDays;

            // Check last ROI accrual date
            let lastRoiAccrual = investment.payout_date ? new Date(investment.payout_date) : new Date(startDate);
            if (isNaN(lastRoiAccrual.getTime())) {
              lastRoiAccrual = new Date(startDate);
            }

            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0); // Start of today

            // Only accrue if a new day has started
            if (todayStart > lastRoiAccrual) {
              const startDay = new Date(startDate);
              startDay.setHours(0, 0, 0, 0);
              const daysElapsed = Math.floor((todayStart - startDay) / ONE_DAY_MS) + 1;

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

              const roiAmountNum = parseFloat(amountToAdd.toFixed(2)); // Round to 2 decimals

              // Get the asset type from the investment
              const assetType = investment.asset; // This should be 'BTC', 'ETH', etc.
              
              if (!assetType) {
                throw new Error(`No asset type found for investment ${investment.id}`);
              }

              // Update user walletBalance and revenue for daily ROI (DAILY UPDATE)
              await User.increment(
                { 
                  walletBalance: roiAmountNum,
                  revenue: roiAmountNum
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

              // Update investment with last ROI accrual date
              await investment.update({
                payout_date: todayStart // Tracks last daily ROI accrual
              });

              if (isLastDay) {
                // Get user to update specific asset balance (ONLY ON LAST DAY)
                const user = await User.findByPk(investment.user.id);
                if (!user) {
                  throw new Error(`User not found for investment ${investment.id}`);
                }

                // Calculate total amount to add to asset balance (initial investment + total revenue)
                const investmentAmount = parseFloat(investment.amount);
                const totalRevenue = totalROI; // Total ROI over the entire period
                const totalAssetAmount = investmentAmount + totalRevenue;

                // Update the specific asset balance (ONLY ON LAST DAY)
                const currentAssetBalance = user[`${assetType.toLowerCase()}Bal`] || 0;
                const newAssetBalance = parseFloat(currentAssetBalance) + totalAssetAmount;
                
                await user.increment({
                  [`${assetType.toLowerCase()}Bal`]: newAssetBalance,
                  walletBalance: investmentAmount
                }); 

                // await user.update({
                //   [`${assetType.toLowerCase()}Bal`]: newAssetBalance
                // });

                // Create transaction for capital return to asset balance
                await Transaction.create({
                  userId: investment.user.id,
                  investmentId: investment.id,
                  amount: totalAssetAmount,
                  type: 'Asset Balance Credit',
                  description: `Capital return + total ROI credited to ${assetType} balance for ${investment.investmentPlan.name} investment`,
                  transactionId: `txn_${uuidv4()}`,
                  asset: assetType
                });

                // Mark investment as completed
                await investment.update({
                  status: 'completed',
                  actual_roi: totalROI,
                  payout_date: endDate
                });

                logger.info(`✅ Completed investment ${investment.id} on last day, credited ${totalAssetAmount} ${assetType} (capital: ${investmentAmount} + ROI: ${totalRevenue}) to asset balance`);
              } else {
                logger.info(`💸 Accrued daily ROI of ${roiAmountNum} to wallet for investment ${investment.id} (day ${daysElapsed}/${durationDays})`);
              }

              // Send ROI accrual email outside transaction to avoid rollback
              try {
                const userEmail = investment.user?.email;
                if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
                  logger.error(`Invalid or missing email for investment ${investment.id}: ${userEmail}`);
                  return;
                }
                logger.debug('Investment data before email:', {
                  id: investment.id,
                  email: userEmail,
                  transactionId: investment.transaction_id
                });
                await EmailTemplate.roiAccrualEmail({
                  email: userEmail,
                  planName: investment.investmentPlan?.name || 'Unknown Plan',
                  roiAmount: roiAmountNum,
                  date: todayStart,
                  transactionId: investment.transaction_id
                });
                logger.info(`ROI email sent for investment ${investment.id}`);
              } catch (emailError) {
                logger.error(`Failed to send daily ROI email for investment ${investment.id}:`, emailError);
              }
              result.processed++;
            } else {
              logger.debug(`⏭️ Skipping investment ${investment.id}: Already accrued for today`);
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
            attributes: ['id', 'walletBalance', 'revenue', 'username']
          }, {
            model: InvestmentPlan,
            as: 'investmentPlan',
            attributes: ['roi_percentage', 'duration_days']
          }]
        });

        for (const investment of overdueInvestments) {
          try {
            const roiPercentage = investment.investmentPlan.roi_percentage / 100;
            const duration = investment.investmentPlan.duration_days;
            const roiAmount = parseFloat(investment.amount) * roiPercentage * duration;
            const roiAmountNum = parseFloat(roiAmount.toFixed(2));

            // Get the asset type from the investment
            const assetType = investment.asset;
            
            if (!assetType) {
              throw new Error(`No asset type found for overdue investment ${investment.id}`);
            }

            const user = await User.findByPk(investment.user.id);
            if (!user) {
              throw new Error(`User not found for overdue investment ${investment.id}`);
            }

            logger.info(`Balance calculation debug (overdue):`, {
              investmentId: investment.id,
              userId: investment.userId,
              assetType: assetType,
              currentAssetBalance: user[`${assetType.toLowerCase()}Bal`],
              currentRevenue: user.revenue,
              roiAmount: roiAmountNum
            });

            // Update user walletBalance and revenue for ROI (DAILY STYLE - but for overdue)
            await User.increment(
              { 
                walletBalance: roiAmountNum,
                revenue: roiAmountNum
              },
              { where: { id: investment.user.id } }
            );

            // Calculate total amount for asset balance (initial investment + total revenue)
            const investmentAmount = parseFloat(investment.amount);
            const totalAssetAmount = investmentAmount + roiAmountNum;

            // Update the specific asset balance (ONLY FOR OVERDUE COMPLETION)
            const currentAssetBalance = user[`${assetType.toLowerCase()}Bal`] || 0;
            const newAssetBalance = parseFloat(currentAssetBalance) + totalAssetAmount;
            
            // await user.update({
            //   [`${assetType.toLowerCase()}Bal`]: newAssetBalance
            // });
            await user.increment({
              [`${assetType.toLowerCase()}Bal`]: newAssetBalance,
              walletBalance: investmentAmount
            });

            // Create transaction for ROI
            await Transaction.create({
              userId: investment.user.id,
              investmentId: investment.id,
              amount: roiAmountNum,
              type: 'ROI Credit',
              description: `Overdue ROI for ${investment.investmentPlan.name} investment in ${assetType}`,
              transactionId: `txn_${uuidv4()}`,
              asset: assetType
            });

            // Create transaction for asset balance credit
            await Transaction.create({
              userId: investment.user.id,
              investmentId: investment.id,
              amount: totalAssetAmount,
              type: 'Asset Balance Credit',
              description: `Capital return + total ROI credited to ${assetType} balance for overdue ${investment.investmentPlan.name} investment`,
              transactionId: `txn_${uuidv4()}`,
              asset: assetType
            });

            // Mark investment as completed
            await investment.update({
              status: 'completed',
              actual_roi: roiAmountNum,
              payout_date: now
            });

            result.processed++;
            logger.info(`💸 Paid overdue full ROI of ${roiAmountNum} to wallet and credited ${totalAssetAmount} ${assetType} (capital + ROI) to asset balance for user ${investment.user.username} (${investment.user.id})`);

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