const { asyncHandler, NotFoundError, InsufficientFundsError } = require('./middleware/errorHandler');
const { Investment, User } = require('./models');

exports.createInvestment = asyncHandler(async (req, res) => {
  const { amount, planId } = req.body;
  const userId = req.user.id;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.balance < amount) {
    throw new InsufficientFundsError();
  }

  const investment = await Investment.create({
    userId,
    planId,
    amount,
    status: 'active'
  });

  res.status(201).json({
    success: true,
    data: investment
  });
});