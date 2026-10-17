'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
        await queryInterface.addColumn('usuarios', 'reset_token_hash', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('usuarios', 'reset_token_expires', {
            type: Sequelize.DATE,
            allowNull: true,
        });
  },

  async down (queryInterface) {
        await queryInterface.removeColumn('usuarios', 'reset_token_expires');
        await queryInterface.removeColumn('usuarios', 'reset_token_hash');
    },
};

