const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class AuthenticationController {
    async authentication(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
            }

            const usuario = await Usuario.findOne({ where: { email } });

            if (!usuario || !(await usuario.verificarSenha(senha))) {
                return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
            }

            const token = jwt.sign(
                { id: usuario.id, perfil: usuario.perfil },
                process.env.HASH_BCRYPT,
                { expiresIn: '7d' }
            );

            return res.status(200).json({ usuario, token });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: 'Erro ao autenticar' });
        }
    }
}

module.exports = new AuthenticationController();