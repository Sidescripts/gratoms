
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('investmentplans', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      min_amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
        validate: {
          min: 0.00000001,
        },
      },
      max_amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
        validate: {
          min: 0.00000001,
        },
      },
      duration_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      roi_percentage: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
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
          fields: ['is_active'],
        },
        {
          fields: ['name'],
        },
      ],
      paranoid: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('investmentplans');
  },
};