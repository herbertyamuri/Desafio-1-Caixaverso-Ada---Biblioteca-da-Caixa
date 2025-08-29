// js/Biblioteca.js

import { StorageService } from "./services/StorageService.js";
import { Livro } from "./models/Livro.js";
import { Autor } from "./models/Autor.js";
import { Aluno } from "./models/Aluno.js";
import { Professor } from "./models/Professor.js";
import { Admin } from "./models/Admin.js";

export class Biblioteca {
  constructor() {
    this._autores = [];
    this._livros = [];
    this._usuarios = [];
    this._carregarDados();
  }

  // --- MÉTODOS DE GERENCIAMENTO DE DADOS (CARREGAR E SALVAR) ---

  _salvarDados() {
    StorageService.salvar("autores", this._autores);
    // Salvamos uma versão simplificada dos livros e usuários para evitar circularidade
    StorageService.salvar(
      "livros",
      this._livros.map((livro) => ({
        ...livro,
        autor: { nome: livro.autor.nome }, // Salva apenas o nome do autor para referência
      }))
    );
    StorageService.salvar("usuarios", this._usuarios);
  }

  _carregarDados() {
    const autoresData = StorageService.carregar("autores") || [];
    this._autores = autoresData.map(
      (data) => new Autor(data.nome, data.nacionalidade, data.anoNascimento)
    );

    const usuariosData = StorageService.carregar("usuarios") || [];
    this._usuarios = usuariosData.map((data) => {
      let usuario;
      if (data.curso) {
        usuario = new Aluno(data.nome, data.matricula, data.curso);
      } else if (data.departamento) {
        usuario = new Professor(data.nome, data.matricula, data.departamento);
      } else {
        // Assumimos que, se não for aluno nem professor, é admin
        usuario = new Admin(data.nome, data.matricula);
      }
      // Restaura o histórico do usuário
      usuario._historicoEmprestimos = data._historicoEmprestimos || [];
      return usuario;
    });

    const livrosData = StorageService.carregar("livros") || [];
    this._livros = livrosData
      .map((data) => {
        const autor = this._encontrarAutorPorNome(data.autor.nome);
        if (!autor) return null; // Se o autor não for encontrado, não podemos recriar o livro

        const livro = new Livro(
          data.titulo,
          autor,
          data.anoPublicacao,
          data.genero,
          data.isbn
        );
        livro._disponivel = data._disponivel; // Restaura o estado de disponibilidade
        return livro;
      })
      .filter((livro) => livro !== null); // Remove quaisquer livros nulos caso o autor não tenha sido encontrado
  }

  // --- MÉTODOS DE BUSCA PRIVADOS ---
  _encontrarLivroPorIsbn(isbn) {
    return this._livros.find((livro) => livro.isbn === isbn);
  }

  _encontrarUsuarioPorMatricula(matricula) {
    return this._usuarios.find((usuario) => usuario.matricula === matricula);
  }

  _encontrarAutorPorNome(nome) {
    return this._autores.find((autor) => autor.nome === nome);
  }

  // --- MÉTODOS PÚBLICOS PARA CADASTRO ---
  cadastrarAutor(nome, nacionalidade, anoNascimento) {
    if (!this._encontrarAutorPorNome(nome)) {
      const novoAutor = new Autor(nome, nacionalidade, anoNascimento);
      this._autores.push(novoAutor);
      this._salvarDados();
      console.log(`Autor "${nome}" cadastrado com sucesso.`);
      return novoAutor;
    }
    console.warn(`Autor com o nome "${nome}" já existe.`);
  }

  cadastrarLivro(titulo, nomeAutor, anoPublicacao, genero, isbn) {
    const autor = this._encontrarAutorPorNome(nomeAutor);
    if (!autor) {
      console.error(
        `Falha ao cadastrar livro: Autor "${nomeAutor}" não encontrado.`
      );
      return;
    }
    if (!this._encontrarLivroPorIsbn(isbn)) {
      const novoLivro = new Livro(titulo, autor, anoPublicacao, genero, isbn);
      this._livros.push(novoLivro);
      this._salvarDados();
      console.log(`Livro "${titulo}" cadastrado com sucesso.`);
      return novoLivro;
    }
    console.warn(`Livro com o ISBN "${isbn}" já existe.`);
  }
  editarLivro(isbn, dadosParaAtualizar) {
    const livro = this._encontrarLivroPorIsbn(isbn);

    if (!livro) {
      console.error(`Edição falhou: Livro com ISBN "${isbn}" não encontrado.`);
      return false;
    }

    // Atualiza os campos simples que foram fornecidos no objeto
    if (dadosParaAtualizar.titulo) {
      livro.titulo = dadosParaAtualizar.titulo;
    }
    if (dadosParaAtualizar.anoPublicacao) {
      livro.anoPublicacao = dadosParaAtualizar.anoPublicacao;
    }
    if (dadosParaAtualizar.genero) {
      livro.genero = dadosParaAtualizar.genero;
    }

    // Tratamento especial para atualizar o autor, pois precisamos da instância da classe Autor
    if (dadosParaAtualizar.nomeAutor) {
      const novoAutor = this._encontrarAutorPorNome(
        dadosParaAtualizar.nomeAutor
      );
      if (novoAutor) {
        livro.autor = novoAutor;
      } else {
        // Avisa o usuário que o autor não foi encontrado, mas não impede a edição de outros campos
        console.warn(
          `Aviso na edição: Autor "${dadosParaAtualizar.nomeAutor}" não encontrado. O autor do livro não foi alterado.`
        );
      }
    }

    this._salvarDados();
    console.log(
      `Livro "${livro.titulo}" (ISBN: ${isbn}) foi atualizado com sucesso.`
    );
    return true;
  }
  // --- MÉTODOS DE LISTAGEM ---
  listarLivros() {
    console.table(
      this._livros.map((livro) => ({
        Titulo: livro.titulo,
        Autor: livro.autor.nome,
        Disponivel: livro.disponivel,
        ISBN: livro.isbn,
      }))
    );
    return this._livros;
  }

  listarUsuarios() {
    console.table(this._usuarios);
    return this._usuarios;
  }

  listarAutores() {
    console.table(this._autores);
    return this._autores;
  }

  // --- MÉTODOS DE OPERAÇÃO DA BIBLIOTECA ---
  emprestarLivro(isbn, matriculaUsuario) {
    const livro = this._encontrarLivroPorIsbn(isbn);
    const usuario = this._encontrarUsuarioPorMatricula(matriculaUsuario);

    if (!livro) {
      console.error("Empréstimo falhou: Livro não encontrado.");
      return;
    }
    if (!usuario) {
      console.error("Empréstimo falhou: Usuário não encontrado.");
      return;
    }

    if (livro.emprestar()) {
      usuario.adicionarAoHistorico(livro);
      this._salvarDados();
      console.log(
        `Empréstimo do livro "${livro.titulo}" para "${usuario.nome}" realizado com sucesso.`
      );
    }
  }

  devolverLivro(isbn) {
    const livro = this._encontrarLivroPorIsbn(isbn);
    if (!livro) {
      console.error("Devolução falhou: Livro não encontrado.");
      return;
    }
    if (livro.devolver()) {
      this._salvarDados();
    }
  }

  // --- MÉTODOS DE EXCLUSÃO (REQUEREM ADMIN) ---
  excluirLivro(isbn, adminExecutor) {
    if (!(adminExecutor instanceof Admin)) {
      console.error(
        "Acesso negado. Apenas administradores podem excluir livros."
      );
      return;
    }
    const index = this._livros.findIndex((livro) => livro.isbn === isbn);
    if (index !== -1) {
      const tituloRemovido = this._livros[index].titulo;
      this._livros.splice(index, 1);
      this._salvarDados();
      console.log(
        `Livro "${tituloRemovido}" (ISBN: ${isbn}) foi excluído por ${adminExecutor.nome}.`
      );
    } else {
      console.error(
        `Exclusão falhou: Livro com ISBN "${isbn}" não encontrado.`
      );
    }
  }
}
