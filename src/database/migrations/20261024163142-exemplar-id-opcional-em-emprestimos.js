'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("emprestimos", "NOME_DA_FK_QUE_VOCE_ANOTOU");

    await queryInterface.changeColumn("emprestimos", "exemplar_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "exemplares", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down() {
  },
};