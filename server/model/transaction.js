const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,           // ✅ UUID only
        defaultValue: DataTypes.UUIDV4, // ✅ UUID only
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,  // ✅ UUID
        allowNull: false,
    },
    investmentId: {
        type: DataTypes.UUID,  // ✅ FIXED: UUID instead of INTEGER
        allowNull: true,
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
        min: 0,
        },
    },
    type: {
        type: DataTypes.ENUM('ROI Credit', 'Investment', 'Withdrawal', 'Deposit'),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    }, {
    tableName: 'transactions',
    timestamps: true,
    updatedAt: false, // No updatedAt column needed
    });

    return Transaction;
}