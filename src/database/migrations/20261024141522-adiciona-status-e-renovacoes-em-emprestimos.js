'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("emprestimos", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "ativo",
    });

    await queryInterface.addColumn("emprestimos", "renovacoes", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn("emprestimos", "renovacoes");
    await queryInterface.removeColumn("emprestimos", "status");
  },
};
