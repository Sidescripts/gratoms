'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('deposits', {
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
          min: 200.00,
        },
      },
      asset: {
        type: Sequelize.STRING(10),
        allowNull: false,
        validate: {
          isIn: [['BTC', 'ETH', 'USDT', 'LTC', 'BCH', 'BNB', 'DOGE', 'DASH']],
        },
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
          model: 'Users', // Note: Sequelize uses PascalCase for table names
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
          fields: ['asset'],
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
    await queryInterface.addConstraint('deposits', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_deposits_userId',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop foreign key constraint first
    await queryInterface.removeConstraint('deposits', 'fk_deposits_userId');

    // Drop the table
    await queryInterface.dropTable('deposits');
  },
};