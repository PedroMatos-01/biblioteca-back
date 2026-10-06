const Sequelize = require('sequelize');
const Livros = require('../apps/models/Livros');
const Exemplar = require('../apps/models/Exemplar');

const models = [Livros,Exemplar];
const databaseConfig  = require('../configs/db');

class Database {
    constructor(){
        this.init();
    }

    init() {
        this.connection = new Sequelize (databaseConfig);

        models.map((model) => model.init(this.connection));
    }
}

module.exports = new Database();