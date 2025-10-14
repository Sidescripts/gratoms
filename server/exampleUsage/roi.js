
const { Transaction, Investment, InvestmentPlan } = require('../../model');

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

module.exports = TransactionController;