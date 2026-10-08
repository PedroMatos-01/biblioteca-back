'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up : async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        },
        nome: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false, unique: true },
        senha_hash: { type: Sequelize.STRING, allowNull: false },
        perfil: {
          type: Sequelize.ENUM('leitor', 'administrador'),
          allowNull: false,
          defaultValue: 'leitor',
        },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
      });
    },
  down : async (queryInterface) => {
    await queryInterface.dropTable('usuarios');
  },
};
