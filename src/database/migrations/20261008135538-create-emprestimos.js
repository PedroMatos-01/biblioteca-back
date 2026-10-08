'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up : async (queryInterface, Sequelize)=> {
    await queryInterface.createTable('emprestimos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      exemplar_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'exemplares', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      data_retirada: { type: Sequelize.DATE, allowNull: false },
      data_prevista_devolucao: { type: Sequelize.DATE, allowNull: false },
      data_devolucao: { type: Sequelize.DATE, allowNull: true },
      valor_multa: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down : async (queryInterface) => {
    await queryInterface.dropTable('emprestimo');
  }
};
