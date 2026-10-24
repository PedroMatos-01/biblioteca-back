const Exemplar = require("../models/Exemplar");
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
  try {
    if (request.perfil !== "administrador") {
      return response.status(403).json({
        mensagem: "Apenas administradores podem excluir livros"
      });
    }

    const livro = await Livros.findByPk(request.params.id);

    if (!livro) {
      return response.status(404).json({ mensagem: "Livro nao encontrado" });
    }

    const quantidadeExemplares = await Exemplar.count({
      where: { livro_id: livro.id }
    });

    if (quantidadeExemplares > 0) {
      return response.status(409).json({
        mensagem: "Remova os exemplares antes de excluir o livro"
      });
    }

    await livro.destroy();
    return response.status(204).send();
  } catch (erro) {
    console.error(erro);
    return response.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
}


module.exports = new LivroController();