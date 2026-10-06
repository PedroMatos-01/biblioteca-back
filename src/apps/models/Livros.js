const Sequelize = require ('sequelize');
const { Model } = require ('sequelize');

class Livros extends Model{
    static init(sequelize){
        super.init(
            {
                titulo:Sequelize.STRING,
                autor:Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        return this;
    }
}


module.exports = Livros ;