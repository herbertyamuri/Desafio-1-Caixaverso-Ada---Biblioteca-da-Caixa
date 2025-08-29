import { Autor } from "./Autor.js";

export class Livro {
  constructor(titulo, autor, anoPublicacao, genero, isbn) {
    // 1. Sua validação, garantindo que nenhum campo é nulo. Excelente!
    if (!titulo || !autor || !anoPublicacao || !genero || !isbn) {
      throw new Error("Todos os campos para criar um livro são obrigatórios.");
    }

    // 2. Nossa validação de TIPO, garantindo que 'autor' é o objeto correto.
    if (!(autor instanceof Autor)) {
      throw new Error(
        "O autor fornecido precisa ser uma instância da classe Autor."
      );
    }

    this.titulo = titulo;
    this.autor = autor;
    this.anoPublicacao = anoPublicacao;
    this.genero = genero;
    this.isbn = isbn;
    this._disponivel = true;
  }

  get disponivel() {
    return this._disponivel;
  }

  emprestar() {
    if (!this._disponivel) {
      // Usando console.warn para um aviso, não um erro crítico.
      console.warn(
        `O livro "${this.titulo}" não está disponível para empréstimo.`
      );
      return false;
    }
    this._disponivel = false;
    return true;
  }

  devolver() {
    if (this._disponivel) {
      console.warn(`O livro "${this.titulo}" já se encontra disponível.`);
      return false;
    }
    this._disponivel = true;
    console.log(`Livro "${this.titulo}" devolvido com sucesso.`);
    return true;
  }
}
