const Usuario = require ('../models/Usuario');

class UsuarioController{
    async create(req, res) {
            try {
                const { nome, email, senha} = req.body;

                if (!nome || !email || !senha) {
                    return res.status(400).json({
                        erro: 'Nome, e-mail e senha são obrigatórios'
                    });
                }

                const jaExiste = await Usuario.findOne({ where: { email } });
                if (jaExiste) {
                    return res.status(400).json({
                        erro: 'E-mail já cadastrado'
                    });
                }

                const usuario = await Usuario.create({
                    nome, email, senha, perfil: 'leitor'
                });

                return res.status(201).json(usuario);
            } catch (erro) {
                console.error(erro);
                return res.status(500).json({
                    erro: 'Erro ao cadastrar usuário'
                });
            }
    }
    
    async me(req, res) {
        try {
            const usuario = await Usuario.findByPk(req.usuarioId);
            if (!usuario) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }
            return res.json(usuario);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: 'Erro ao buscar usuário' });
        }
    }


    async index(req, res) {
        try {
            const usuarios = await Usuario.findAll();
            return res.json(usuarios);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: 'Erro ao listar usuários' });
        }
    }

    async updatePerfil(req, res) {
        try {
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
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: 'Erro ao atualizar perfil' });
        }
    }


    async delete(req, res) {
        try {
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
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: 'Erro ao excluir usuário' });
        }
    }

}

module.exports = new UsuarioController();