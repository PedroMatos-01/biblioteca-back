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

    async store(req, res) {
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

    async delete(req, res) {
        const exemplar = await Exemplar.findByPk(req.params.id);
        if (!exemplar) {
            return res.status(404).json({ erro: 'Exemplar não encontrado' });
        }
        await exemplar.destroy();
        return res.status(204).send();
    }
}


module.exports = new ExemplarController();