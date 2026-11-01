async function buscarLivroPorIsbn(isbn) {
  const chave = `ISBN:${isbn}`;
  const url = `https://openlibrary.org/api/books?bibkeys=${chave}&format=json&jscmd=data`;

  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error('Não foi possível consultar a Open Library');
  }

  const dados = await resposta.json();
  const livro = dados[chave];

  if (!livro) {
    return null; // ISBN não encontrado
  }

  return {
    titulo: livro.title,
    autor: livro.authors ? livro.authors.map((a) => a.name).join(', ') : null,
    capa: livro.cover ? livro.cover.medium : null,
  };
}

module.exports = { buscarLivroPorIsbn };