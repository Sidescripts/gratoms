const { Investment, InvestmentPlan, User, Transaction } = require('../../model');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const EmailTemplate = require("./investEmail");

function InvestmentController() {
  return {
    // User: Invest in a plan
    createInvestment: async function(req, res) {
      try {
        // Input validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
            success: false,
            errors: errors.array() 
          });
        }

        const { paymentMethod, amount, name, id } = req.body;
        const userId = req.user.id;

        // Check for existing active investment
        const existingInvestment = await Investment.findOne({
          where: {
            userId: userId,
            status: 'active'
          }
        });

        if (existingInvestment) {
          return res.status(400).json({
            success: false,
            error: 'User already has an active investment'
          });
        }

        // Find investment plan
        const plan = await InvestmentPlan.findOne({ where: { id } });
        if (!plan) {
          return res.status(404).json({ 
            success: false, 
            error: 'Investment plan not found' 
          });
        }

        // Validate required fields
        if (!amount || !name || !id) {
          return res.status(400).json({
            success: false,
            error: 'All values are required'
          });
        }

        // Validate amount is a positive number
        if (amount <= 0) {
          return res.status(400).json({
            success: false,
            error: 'Amount must be a positive value'
          });
        }

        // Validate plan status
        if (!plan.is_active) {
          return res.status(400).json({ 
            success: false,
            error: 'Investment plan is inactive' 
          });
        }

        // Validate amount range
        if (amount < plan.min_amount) {
          return res.status(400).json({ 
            success: false,
            error: `Amount must be at least ${plan.min_amount}` 
          });
        }

        if (amount > plan.max_amount) {
          return res.status(400).json({ 
            success: false,
            error: `Amount cannot exceed ${plan.max_amount}` 
          });
        }

        // Check user balance
        const user = await User.findByPk(userId, {
          attributes: [
            'id', 
            'walletBalance', 
            'totalRevenue', 
            'email',
            'btcBal',
            'ethBal',
            'usdtBal',
            'revenue'
          ],
        });

        if (!user) {
          return res.status(404).json({ 
            success: false,
            error: 'User not found' 
          });
        }

        // Validate balance based on payment method
        let sufficientBalance = false;
        switch (paymentMethod) {
          case 'btc':
            sufficientBalance = user.btcBal >= amount;
            break;
          case 'eth':
            sufficientBalance = user.ethBal >= amount;
            break;
          case 'usdt':
            sufficientBalance = user.usdtBal >= amount;
            break;
          default:
            return res.status(400).json({ 
              success: false,
              error: 'Invalid payment method' 
            });
        }

        if (!sufficientBalance) {
          return res.status(400).json({ 
            success: false,
            error: `Insufficient ${paymentMethod.toUpperCase()} balance` 
          });
        }

        // Reset revenue
        await User.update(
          { revenue: 0.0 },
          { where: { id: userId } }
        );

        // Calculate expected ROI as a percentage
        const roiPercentage = plan.roi_percentage / 100; // e.g., 10% -> 0.1
        const expectedROI = amount * roiPercentage; // ROI amount only
        // If you want the total (principal + ROI), use:
        // const expectedROI = amount + (amount * roiPercentage);

        // Create investment record
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.duration_days);

        const investment = await Investment.create({
          amount,
          expected_roi: expectedROI,
          status: 'active',
          start_date: startDate,
          end_date: endDate,
          transaction_id: `rev_${uuidv4()}`,
          userId,
          planName: plan.name,
          InvestmentPlanId: id
        });

        // Update user wallet balance based on payment method
        switch (paymentMethod) {
          case 'btc':
            await User.update({
              btcBal: user.btcBal - amount,
              walletBalance: user.walletBalance - amount,
              totalRevenue: user.totalRevenue + amount
            }, { where: { id: userId } });
            break;
          case 'eth':
            await User.update({
                walletBalance: user.walletBalance - amount,
                ethBal: user.ethBal - amount,
              totalRevenue: user.totalRevenue + amount
            }, { where: { id: userId } });
            break;
          case 'usdt':
            await User.update({
              usdtBal: user.usdtBal - amount,
              walletBalance: user.walletBalance - amount,
              totalRevenue: user.totalRevenue + amount
            }, { where: { id: userId } });
            break;
        }

        // Send investment confirmation email
        try {
          await EmailTemplate.investmentEmail({
            email: user.email,
            planName: plan.name,
            amount: investment.amount,
            duration: plan.duration_days,
            endDate: endDate,
            investmentId: investment.transaction_id,
            status: investment.status
          });
        } catch (emailError) {
          console.error("Failed to send investment email:", emailError);
        }

        return res.status(201).json({
          success: true,
          message: 'Investment created successfully',
          data: investment
        });

      } catch (error) {
        console.error('Create investment error:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to create investment' 
        });
      }
    },

    // Get user investments
    getUserInvestments: async function(req, res) {
      try {
        const userId = req.user.id;

        const investments = await Investment.findAll({
          where: { userId },
          include: [{
            model: InvestmentPlan,
            as: 'investmentPlan',
            attributes: ['name', 'roi_percentage', 'duration_days']
          }],
          order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({ success: true, investments });

      } catch (error) {
        console.error('Get investments error:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to fetch investments' 
        });
      }
    },

    // Get single investment
    getSingleInvestment: async function(req, res) {
      try {
        const { id } = req.params;
        const userId = req.user.id;

        const investment = await Investment.findOne({
          where: { 
            id: id,
            userId: userId 
          },
          include: [{
            model: InvestmentPlan,
            as: 'investmentPlan'
          }]
        });

        if (!investment) {
          return res.status(404).json({ 
            success: false,
            error: 'Investment not found' 
          });
        }

        return res.status(200).json({ 
          success: true, 
          investment 
        });

      } catch (error) {
        console.error('Error fetching investment:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Server error' 
        });
      }
    }
  };
}

function TransactionController() {
  return {
    // Get user's transaction history
    getTransactionHistory: async function(req, res) {
      try {
        const userId = req.user.id;

        const transactions = await Transaction.findAll({
          where: { userId },
          include: [{
            model: Investment,
            as: 'investment',
            attributes: ['id', 'planName'],
            include: [{
              model: InvestmentPlan,
              as: 'investmentPlan',
              attributes: ['name']
            }]
          }],
          order: [['createdAt', 'DESC']],
          limit: 100, // Optional: limit to recent 100 transactions
        });

        return res.status(200).json({
          success: true,
          transactions
        });

      } catch (error) {
        console.error('Get transaction history error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch transaction history'
        });
      }
    }
  };
}

module.exports = {InvestmentController, TransactionController};