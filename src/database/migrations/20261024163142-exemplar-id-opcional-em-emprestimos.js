'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('emprestimos', 'exemplar_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('emprestimos', {
      fields: ['exemplar_id'],
      type: 'foreign key',
      name: 'fk_emprestimos_exemplar',
      references: { table: 'exemplares', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint('emprestimos', 'fk_emprestimos_exemplar');
  },
};