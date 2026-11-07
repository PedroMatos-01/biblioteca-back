'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const [existe] = await queryInterface.sequelize.query(
      "SELECT id FROM usuarios WHERE email = 'adm@exemplo.com' LIMIT 1"
    );
    if (existe.length > 0) return;

    await queryInterface.bulkInsert('usuarios', [{
      nome: 'Administrador',
      email: 'adm@exemplo.com',
      senha_hash: await bcrypt.hash('123456', 8),
      perfil: 'administrador',
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('usuarios', { email: 'adm@exemplo.com' });
  },
};