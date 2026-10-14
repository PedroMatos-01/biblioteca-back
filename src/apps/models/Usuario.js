const Sequelize = require ('sequelize');
const { Model } = require ('sequelize');
const bcrypt = require('bcryptjs');

class Usuario extends Model{
    static init(sequelize){
        super.init(
            {
                nome: Sequelize.STRING,
                email: Sequelize.STRING,
                senha: Sequelize.VIRTUAL,
                senha_hash: Sequelize.STRING,
                perfil: Sequelize.STRING,
            },
            {
                sequelize,
                tableName: 'usuarios',
            }
        );
        
        this.addHook('beforeSave', async (usuario) => {
            if (usuario.senha) {
                usuario.senha_hash = await bcrypt.hash(usuario.senha, 8);
            }
        });

        return this;
    }
    verificarSenha(senhaDigitada) {
        return bcrypt.compare(senhaDigitada, this.senha_hash);
    }

    toJSON() {
        const valores = { ...this.get() };
        delete valores.senha;
        delete valores.senha_hash;   // faltava remover o hash da resposta
        return valores;
    }
}



module.exports = Usuario ;