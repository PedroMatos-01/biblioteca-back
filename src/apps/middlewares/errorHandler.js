module.exports = (erro, req, res, next) => {

  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido' });
  }

  if (erro.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({ erro: 'Operação não permitida: existem registros vinculados' });
  }


  if (erro.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ erro: 'Registro duplicado' });
  }

  const status = erro.status || 500;
  if (status >= 500) console.error(erro);

  return res.status(status).json({
    erro: status >= 500 ? 'Erro interno do servidor' : erro.message,
  });
};module.exports = (erro, req, res, next) => {
 
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido' });
  }


  if (erro.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({ erro: 'Operação não permitida: existem registros vinculados' });
  }


  if (erro.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ erro: 'Registro duplicado' });
  }

  const status = erro.status || 500;
  if (status >= 500) console.error(erro);

  return res.status(status).json({
    erro: status >= 500 ? 'Erro interno do servidor' : erro.message,
  });
};