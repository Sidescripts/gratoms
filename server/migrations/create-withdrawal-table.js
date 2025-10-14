
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('withdrawals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 1000.00,
        },
      },
      withdrawalMethod: {
        type: Sequelize.ENUM('BTC', 'ETH', 'USDT', 'LTC', 'BCH', 'BNB', 'DOGE', 'DASH'),
        defaultValue: 'BTC',
        allowNull: false,
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'completed', 'failed'),
        defaultValue: 'pending',
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      walletAddress: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }, {
      indexes: [
        {
          unique: true,
          fields: ['transaction_id'],
        },
        {
          fields: ['userId'],
        },
        {
          fields: ['withdrawalMethod'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['createdAt'],
        },
      ],
      paranoid: true,
    });

    // Add foreign key constraint explicitly
    await queryInterface.addConstraint('withdrawals', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_withdrawals_userId',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove foreign key constraint first
    await queryInterface.removeConstraint('withdrawals', 'fk_withdrawals_userId');

    // Drop the table
    await queryInterface.dropTable('withdrawals');
  },
};
