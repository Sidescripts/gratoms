'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('investments', 'asset', {
      type: Sequelize.STRING(10),
      allowNull: false,
      validate: {
        isIn: [['BTC', 'ETH', 'USDT', 'LTC', 'BCH', 'BNB', 'DOGE', 'DASH']]
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('investments', 'asset');
  }
};