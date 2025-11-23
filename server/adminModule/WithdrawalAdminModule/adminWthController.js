// controllers/adminWithdrawalController.js
const { Withdrawal, User, sequelize } = require('../../model');
const { handleValidationErrors, sendErrorResponse } = require('../../utils/commonUtils');

const adminWithdrawalController = {
    // Get all withdrawals with filtering options
    getAllWithdrawals: async (req, res) => {
        try {
            const validationError = handleValidationErrors(req);
            if (validationError) return validationError;

            const { status, userId } = req.query;
            
            // Build where clause for filtering
            const whereClause = {};
            if (status) whereClause.status = status;
            if (userId) whereClause.userId = userId;

            const withdrawals = await Withdrawal.findAll({
                attributes: [
                    'id',
                    'transaction_id',
                    'amount',
                    'withdrawalMethod',
                    'walletAddress',
                    'status',
                    'createdAt',
                    'processed_at',
                    'completed_at',
                    'userId'
                ],
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'email', 'username'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            return res.status(200).json({
                success: true,
                message: withdrawals.length ? 'Withdrawals retrieved successfully' : 'No withdrawals found',
                data: {
                    withdrawals: withdrawals,
                    total: withdrawals.length
                },
            });
        } catch (error) {
            console.error('Get all withdrawals error:', error);
            return sendErrorResponse(res, 500, 'Failed to retrieve withdrawals', error);
        }
    },

    updateWithdrawalStatus: async (req, res) => {
        
        try {
            const { withdrawalId } = req.params;
            const { status } = req.body; // withdrawalMethod from frontend is IGNORED for security
    
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required',
                });
            }
    
            const validStatuses = ['confirmed', 'completed', 'failed', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
                });
            }
    
            const withdrawal = await Withdrawal.findByPk(withdrawalId, {
                include: [{ model: User, as: 'user', attributes: ['id', 'walletBalance', 'btcBal', 'ethBal', 'usdtBal'] }]});
    
            if (!withdrawal) {
                
                return res.status(404).json({ success: false, message: 'Withdrawal not found' });
            }
    
            if (!['pending', 'confirmed'].includes(withdrawal.status)) {
                
                return res.status(400).json({
                    success: false,
                    message: `Withdrawal cannot be updated from ${withdrawal.status} status`,
                });
            }
    
            const user = withdrawal.user;
    
            const updateData = {
                status,
                processed_at: new Date()
            };
            if (status === 'completed') {
                updateData.completed_at = new Date();
            }
    
            // Only refund on failed/rejected
            if (status === 'failed' || status === 'rejected') {
                const method = (withdrawal.withdrawalMethod || withdrawal.method || '').trim().toUpperCase();
    
                let incrementFields = { walletBalance: withdrawal.amount };
    
                if (method.includes('BTC')) incrementFields = { btcBal: withdrawal.amount };
                else if (method.includes('ETH')) incrementFields = { ethBal: withdrawal.amount };
                else if (method.includes('USDT')) incrementFields = { usdtBal: withdrawal.amount };
    
                await user.increment(incrementFields);
            }
    
            // Actually update with correct status
            await withdrawal.update(updateData);
    

    
            // Send email (fire and forget)
            setImmediate(() => {
                // send email logic
                console.log(`Withdrawal ${withdrawalId} ${status} for ${user.email}`);
            });
    
            return res.status(200).json({
                success: true,
                message: `Withdrawal ${status} successfully`,
                data: withdrawal.reload()
            });
    
        } catch (error) {
           
            console.error('Update withdrawal status error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update withdrawal status',
                error: error.message
            });
        }
    },


    // Get withdrawal statistics for admin dashboard
    getWithdrawalStats: async (req, res) => {
        try {
            const validationError = handleValidationErrors(req);
            if (validationError) return validationError;

            const stats = await Withdrawal.findAll({
                attributes: [
                    'status',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                    [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
                ],
                group: ['status'],
            });

            const totalWithdrawals = await Withdrawal.count();
            const totalAmount = await Withdrawal.sum('amount');

            return res.status(200).json({
                success: true,
                message: 'Withdrawal statistics retrieved successfully',
                data: {
                    stats: stats,
                    totalWithdrawals: totalWithdrawals,
                    totalAmount: totalAmount || 0
                },
            });
        } catch (error) {
            console.error('Get withdrawal stats error:', error);
            return sendErrorResponse(res, 500, 'Failed to retrieve withdrawal statistics', error);
        }
    },
};

module.exports = adminWithdrawalController;