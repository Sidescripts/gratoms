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
            const totalROI = parseFloat(investment.amount) * roiPercentage;
            const dailyRoi = totalROI / durationDays;

            const currentBalanceNum = parseFloat(investment.user.walletBalance) || 0;
            const currentRevenueNum = parseFloat(investment.user.revenue) || 0;

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
              const newBalanceNum = currentBalanceNum + roiAmountNum;
              const newRevenueNum = currentRevenueNum + roiAmountNum;

              logger.info(`Balance calculation debug:`, {
                investmentId: investment.id,
                userId: investment.userId,
                currentBalance: currentBalanceNum,
                currentRevenue: currentRevenueNum,
                roiAmount: roiAmountNum,
                calculatedNewBalance: newBalanceNum,
                calculatedNewRevenue: newRevenueNum,
                daysElapsed,
                durationDays,
                isLastDay
              });

              // Update user walletBalance and revenue
              await User.increment(
                { 
                  walletBalance: roiAmountNum,
                  revenue: roiAmountNum
                },
                { where: { id: investment.user.id } }
              );
              await Transaction.create({
                  userId: investment.user.id,
                  investmentId: investment.id,
                  amount: roiAmountNum,
                  type: 'ROI Credit',
                  description: `Daily ROI for ${investment.investmentPlan.name} investment`,
                  transactionId: `txn_${uuidv4()}`,
              });

              // Update investment with last ROI accrual date
              await investment.update({
                payout_date: todayStart // Tracks last daily ROI accrual
              });

              if (isLastDay) {
                await investment.update({
                  status: 'completed',
                  actual_roi: totalROI,
                  payout_date: endDate
                });
                logger.info(`✅ Completed investment ${investment.id} on last day`);
              } else {
                logger.info(`💸 Accrued daily ROI of ${roiAmountNum} for investment ${investment.id} (day ${daysElapsed}/${durationDays})`);
              }

              // Send ROI accrual email outside transaction to avoid rollback
              try {
                await EmailTemplate.roiAccrualEmail({
                  email: investment.user.email,
                  planName: investment.investmentPlan.name,
                  roiAmount: roiAmountNum,
                  date: todayStart,
                  investmentId: investment.transaction_id,
                });
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
            attributes: ['roi_percentage']
          }]
        });

        for (const investment of overdueInvestments) {
          try {
            const roiPercentage = investment.investmentPlan.roi_percentage / 100;
            const roiAmount = parseFloat(investment.amount) * roiPercentage;
            const roiAmountNum = parseFloat(roiAmount.toFixed(2));

            logger.info(`Balance calculation debug (overdue):`, {
              investmentId: investment.id,
              userId: investment.userId,
              currentBalance: investment.user.walletBalance,
              currentRevenue: investment.user.revenue,
              roiAmount: roiAmountNum
            });

            await User.increment(
              { 
                walletBalance: roiAmountNum,
                revenue: roiAmountNum
              },
              { where: { id: investment.user.id } }
            );

            await Transaction.create({
                userId: investment.user.id,
                investmentId: investment.id,
                amount: roiAmountNum,
                type: 'ROI Credit',
                description: `Overdue ROI for ${investment.investmentPlan.name} investment`,
                transactionId: `txn_${uuidv4()}`,
              });


            await investment.update({
              status: 'completed',
              actual_roi: roiAmountNum,
              payout_date: now
            });

            result.processed++;
            logger.info(`💸 Paid overdue full ROI of ${roiAmountNum} to user ${investment.user.username} (${investment.user.id})`);

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

