const Exemplar = require("../models/Exemplar");
const Livros = require('../models/Livros');
const { buscarLivroPorIsbn } = require('../../services/openLibraryService');

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

    async create(req,res){
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


    async delete(request, response) {
        const livro = await Livros.findByPk(request.params.id);

        if (!livro) {
            return response.status(404).json({ erro: "Livro nao encontrado" });
        }

        const quantidadeExemplares = await Exemplar.count({
            where: { livro_id: livro.id }
        });

        if (quantidadeExemplares > 0) {
            return response.status(409).json({
            erro: "Remova os exemplares antes de excluir o livro"
            });
        }

        await livro.destroy();
        return response.status(204).send();
    }




async createPorIsbn(req, res) {
    const { isbn } = req.body;
    if (!isbn) {
        return res.status(400).json({ erro: 'isbn tem que ser preenchido' });
    }

    const isbnLimpo = String(isbn).replace(/[-\s]/g, '');

    const existente = await Livros.findOne({ where: { isbn: isbnLimpo } });
    if (existente) {
        return res.status(409).json({ erro: 'Livro ja cadastrado com esse isbn' });
    }

    let dados;
    try {
        dados = await buscarLivroPorIsbn(isbnLimpo);
    } catch (erro) {
        console.error(erro);
        return res.status(502).json({ erro: 'Erro ao consultar a Open Library' });
    }

    if (!dados) {
        return res.status(404).json({ erro: 'Isbn nao encontrado na Open Library' });
    }
    if (!dados.titulo || !dados.autor) {
        return res.status(422).json({
          erro: 'A Open Library nao retornou titulo e autor completos'
        });
    }

    const livro = await Livros.create({
        titulo: dados.titulo,
        autor: dados.autor,
        isbn: isbnLimpo,
        capa: dados.capa,
    });
    return res.status(201).json(livro);
}

}


module.exports = new LivroController();