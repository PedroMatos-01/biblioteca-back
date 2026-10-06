
const Livros = require('../models/Livros');
//const Exemplar = require('../models/Exemplar');
class LivroController {
    async create(req, res) {
        const livro = await Livros.create(req.body);
        return res.send({ livro });
    }
}

module.exports = new LivroController();