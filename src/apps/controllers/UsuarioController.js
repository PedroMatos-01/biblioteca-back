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

}

module.exports = new UsuarioController();