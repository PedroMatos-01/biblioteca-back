const Usuario = require('../models/Usuario');

class UsuarioController {
    async create(req, res) {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: 'Nome, e-mail e senha são obrigatórios'
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({
                erro: 'A senha deve ter pelo menos 6 caracteres'
            });
        }

        const jaExiste = await Usuario.findOne({ where: { email } });
        if (jaExiste) {
            return res.status(409).json({ erro: 'E-mail já cadastrado' });
        }

        const usuario = await Usuario.create({
            nome, email, senha, perfil: 'leitor'
        });

        return res.status(201).json(usuario);
    }

    async me(req, res) {
        const usuario = await Usuario.findByPk(req.usuarioId);

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        return res.json(usuario);
    }

    async index(req, res) {
        const usuarios = await Usuario.findAll();
        return res.json(usuarios);
    }

    async updatePerfil(req, res) {
        const { id } = req.params;
        const { perfil } = req.body;

        if (!['leitor', 'administrador'].includes(perfil)) {
            return res.status(400).json({ erro: 'Perfil inválido' });
        }

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        usuario.perfil = perfil;
        await usuario.save();

        return res.json(usuario);
    }

    async delete(req, res) {
        const { id } = req.params;
        const ehOProprio = Number(id) === req.usuarioId;
        const ehAdmin = req.perfil === 'administrador';

        if (!ehOProprio && !ehAdmin) {
            return res.status(403).json({ erro: 'Você não pode excluir este usuário' });
        }

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        await usuario.destroy();
        return res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
    }
}

module.exports = new UsuarioController();