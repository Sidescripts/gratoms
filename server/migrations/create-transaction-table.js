'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      investmentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'investments',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      type: {
        type: Sequelize.ENUM('ROI Credit', 'Investment', 'Withdrawal', 'Deposit'),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      indexes: [
        {
          fields: ['userId'],
        },
        {
          fields: ['investmentId'],
        },
        {
          fields: ['type'],
        },
        {
          unique: true,
          fields: ['transactionId'],
        },
      ],
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('transactions', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_transactions_userId',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('transactions', {
      fields: ['investmentId'],
      type: 'foreign key',
      name: 'fk_transactions_investmentId',
      references: {
        table: 'investments',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove foreign keys first
    await queryInterface.removeConstraint('transactions', 'fk_transactions_userId');
    await queryInterface.removeConstraint('transactions', 'fk_transactions_investmentId');
    
    // Drop table
    await queryInterface.dropTable('transactions');
  },
};