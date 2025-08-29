// js/models/Usuario.js

export class Usuario {
  constructor(nome, matricula) {
    this.nome = nome;
    this.matricula = matricula; // Identificador único do usuário
    this._historicoEmprestimos = []; // Atributo "privado" para o histórico
  }

  /**
   * Adiciona um livro ao histórico de empréstimos do usuário.
   * Este método garante que o histórico só seja modificado de forma controlada.
   * @param {Livro} livro O livro que foi emprestado.
   */
  adicionarAoHistorico(livro) {
    this._historicoEmprestimos.push({
      titulo: livro.titulo,
      isbn: livro.isbn,
      dataEmprestimo: new Date().toLocaleDateString("pt-BR"),
    });
  }

  /**
   * Getter para acessar o histórico de forma segura (somente leitura).
   */
  get historico() {
    return [...this._historicoEmprestimos]; // Retorna uma cópia para proteger o original
  }
}
