module.exports = (...perfilPermitido) => (req, res, next) => {
    if (!perfilPermitido.includes(req.perfil)) {
        return res.status(403).json({ erro: 'Acesso negado para o seu perfil' });
    }
    return next();
};