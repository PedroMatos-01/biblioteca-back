const Livros = require('../models/Livros');
const Exemplar = require('../models/Exemplar');

class ExemplarController {
    async index(req, res) {
        const exemplares = await Exemplar.findAll({
            where: { livro_id: req.params.livro_id },
        });
        return res.json(exemplares);
    }

    async show(req, res) {
        const exemplar = await Exemplar.findByPk(req.params.id);
        if (!exemplar) {
            return res.status(404).json({ erro: 'Exemplar não encontrado' });
        }
        return res.json(exemplar);
    }

    async create(req, res) {
        const { livro_id } = req.params;
        const { codigo } = req.body;
        if (!codigo) {
            return res.status(400).json({ erro: 'codigo é obrigatório' });
        }
        const livro = await Livros.findByPk(livro_id);
        if (!livro) {
            return res.status(404).json({ erro: 'Livro não encontrado' });
        }
        const exemplar = await Exemplar.create({ codigo, livro_id });
        return res.status(201).json(exemplar);
    }

    async update(req, res) {
        const exemplar = await Exemplar.findByPk(req.params.id);
        if (!exemplar) {
            return res.status(404).json({ erro: 'Exemplar não encontrado' });
        }
        await exemplar.update(req.body);
        return res.json(exemplar);
    }

async delete(request, response) {
  try {
    if (request.perfil !== "administrador") {
      return response.status(403).json({
        mensagem: "Apenas administradores podem excluir exemplares",
      });
    }

    const exemplar = await Exemplar.findByPk(request.params.id);

    if (!exemplar) {
      return response.status(404).json({ mensagem: "Exemplar nao encontrado" });
    }

    if (exemplar.status !== "disponivel") {
      return response.status(409).json({
        mensagem: "Apenas exemplares disponiveis podem ser excluidos",
      });
    }

    await exemplar.destroy();
    return response.status(204).send();
  } catch (erro) {
    console.error(erro);
    return response.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
}


module.exports = new ExemplarController();