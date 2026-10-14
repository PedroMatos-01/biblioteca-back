const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não informado' });
    }

    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ erro: 'Token mal formatado' });
    }

    try {
        const payload = jwt.verify(token, process.env.HASH_BCRYPT);

        req.usuarioId = payload.id;
        req.perfil = payload.perfil;

        return next();
    } catch (erro) {
        console.error(erro.message);
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
};