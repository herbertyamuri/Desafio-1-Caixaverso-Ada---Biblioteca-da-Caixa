export class Autor {
  constructor(nome, nacionalidade, anoNascimento) {
    if (!nome || !nacionalidade || !anoNascimento) {
      throw new Error("Todos os campos são obrigatórios");
    }
    this.nome = nome;
    this.nacionalidade = nacionalidade;
    this.anoNascimento = anoNascimento;
  }
}
