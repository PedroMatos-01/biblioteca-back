# Sistema de Biblioteca-back

Escolhi fazer um sistema de biblioteca porque é um tema que me chama atenção e que eu ja queria ter feito antes em C++. Me inspirei no sistema que biblioteca que a UFLA utiliza, e minha ideia é construir uma versão simplificada das funções principais que um sistema desse tipo tem, pensada para a biblioteca de uma universidade.

O sistema tem dois tipos de usuario. O leitor (aluno) consulta o catálogo, ve se o livro esta disponível, pega livros emprestados renova e acompanha seus prazos. O administrador (bibliotecario) cadastra os livros, controla o estoque e registra as retiradas e devoluções. Se um livro é devolvido depois do prazo, o sistema calcula uma multa pelos dias de atraso. 

## Modelagem inicial 
```mermaid
classDiagram
    class Usuario {
        -int id_usuario
        -string nome
        -string email
        -string senhaHash
        +login()
    }
    class Leitor {
        +consultarCatalogo()
        +solicitarEmprestimo()
        +renovar()
    }
    class Administrador {
        +cadastrarLivro()
        +cadastrarExemplar()
        +registrarDevolucao()
        +cadastrarAdministrador()
    }
    class Livro {
        -int id_livro
        -string titulo
        -string autor
        +exemplaresDisponiveis()
    }
    class Exemplar {
        -int id_exemplar
        -string codigo
        -string status
        +verificarDisponibilidade()
    }
    class Emprestimo {
        -int id_emprestimo
        -date dataRetirada
        -date dataPrevista
        -date dataDevolucao
        -int renovacoes
        -decimal valorMulta
        +renovar()
        +devolver()
        +calcularMulta()
    }

    Usuario <|-- Leitor
    Usuario <|-- Administrador
    Usuario "1" --> "0..*" Emprestimo 
    Livro "1" --> "0..*" Exemplar 
    Exemplar "1" --> "0..*" Emprestimo 
```