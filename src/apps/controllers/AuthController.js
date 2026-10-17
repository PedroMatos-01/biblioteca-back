const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const crypto = require('crypto');
const { Op } = require('sequelize');
const mailer = require('../../utils/mailer');

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



    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ erro: 'E-mail é obrigatório' });
            }
            const usuario = await Usuario.findOne({ where: { email } });
            if (usuario) {
                const token = crypto.randomBytes(32).toString('hex');
                usuario.reset_token_hash = crypto.createHash('sha256').update(token).digest('hex');
                usuario.reset_token_expires = new Date(Date.now() + 30 * 60 * 1000);
                await usuario.save();
                await mailer.sendResetPassword(usuario.email, usuario.nome, token);
            }

            return res.status(200).json({
                mensagem: 'Se o e-mail estiver cadastrado, você receberá as instruções.',
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: 'Erro ao solicitar recuperação de senha' });
        }
    }

    async resetPassword(req, res) {
        try {
            const { token, novaSenha } = req.body;
            if (!token || !novaSenha) {
                return res.status(400).json({ erro: 'Token e nova senha são obrigatórios' });
            }
            if (novaSenha.length < 6) {
                return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
            }
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            const usuario = await Usuario.findOne({
                where: {
                    reset_token_hash: tokenHash,
                    reset_token_expires: { [Op.gt]: new Date() },
                },
            });

            if (!usuario) {
                return res.status(400).json({ erro: 'Token inválido ou expirado' });
            }
            usuario.senha = novaSenha; 
            usuario.reset_token_hash = null;
            usuario.reset_token_expires = null;
            await usuario.save();
            return res.status(200).json({ mensagem: 'Senha redefinida com sucesso' });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: 'Erro ao redefinir senha' });
        }
    }
}

module.exports = new AuthenticationController();