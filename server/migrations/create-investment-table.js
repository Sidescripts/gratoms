
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('investments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      planName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
        validate: {
          min: 0.00000001,
        },
      },
      expected_roi: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      actual_roi: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'pending'),
        defaultValue: 'active',
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      payout_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
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
      InvestmentPlanId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'investmentplans',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
          fields: ['userId'],
        },
        {
          fields: ['InvestmentPlanId'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['end_date'],
        },
      ],
      paranoid: true,
    });

    // Add foreign key constraints explicitly
    await queryInterface.addConstraint('investments', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_investments_userId',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('investments', {
      fields: ['InvestmentPlanId'],
      type: 'foreign key',
      name: 'fk_investments_InvestmentPlanId',
      references: {
        table: 'investmentplans',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove foreign key constraints first
    await queryInterface.removeConstraint('investments', 'fk_investments_userId');
    await queryInterface.removeConstraint('investments', 'fk_investments_InvestmentPlanId');

    // Drop the table
    await queryInterface.dropTable('investments');
  },
};
