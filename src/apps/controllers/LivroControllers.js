
const Livros = require('../models/Livros');
class LivroController {

    async index(req, res) {
        const livros = await Livros.findAll();
        return res.json(livros);
    }

    async show(req,res) {
        const livro = await Livros.findByPk(req.params.id);
        if (!livro) {
            return res.status(404).json({erro: 'Livro nao encontrado'});
        }
        return res.json(livro);
    }

    async store(req,res){
        const { titulo , autor } = req.body;
        if(!titulo || !autor){
            return res.status(400).json({
                erro: 'titulo e autor tem que ser preechidos'
            });
        }
        const livro = await Livros.create({ titulo, autor});
        return res.status(201).json(livro);
    }

    async update(req,res) {
        const livro = await Livros.findByPk(req.params.id);
        if(!livro){
            return res.status(404).json({
                erro:'Livro nao encontrado'
            })
        }
        await livro.update(req.body);
        return res.json(livro);
    }

    async delete(req,res){
        const livro = await Livros.findByPk(req.params.id);
        if (!livro) {
            return res.status(404).json({ erro: 'Livro não encontrado' });
        }
        await livro.destroy();
        return res.status(204).send();
    }
}


module.exports = new LivroController();