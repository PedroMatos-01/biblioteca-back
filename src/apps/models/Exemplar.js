const Sequelize = require ('sequelize');
const { Model } = require ('sequelize');

class Exemplar extends Model{
    static init(sequelize){
        super.init(
            {
                codigo: Sequelize.STRING,
                status:Sequelize.STRING,
                livro_id:Sequelize.INTEGER,

            },
            {
                sequelize,
            }
        );
        return this;
    }
}


module.exports = Exemplar ;