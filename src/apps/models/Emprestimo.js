const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class Emprestimo extends Model {
    static init(sequelize) {
        super.init(
            {
                usuario_id: Sequelize.INTEGER,
                exemplar_id: Sequelize.INTEGER,
                renovacoes: Sequelize.INTEGER,
                
                data_retirada: {
                    type: Sequelize.DATE,
                    allowNull: false
                },

                data_prevista_devolucao: {
                    type: Sequelize.DATE,
                    allowNull: false
                },

                data_devolucao: {
                    type: Sequelize.DATE,
                    allowNull: true
                },

                status: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: 'ativo'
                },

            },
            {
                sequelize,
                tableName: 'emprestimos',
            }
        );

        return this;
    }
}

module.exports = Emprestimo;