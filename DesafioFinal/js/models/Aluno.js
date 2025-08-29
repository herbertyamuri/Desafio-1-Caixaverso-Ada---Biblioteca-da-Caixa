// js/models/Aluno.js
import { Usuario } from "./Usuario.js";

export class Aluno extends Usuario {
  constructor(nome, matricula, curso) {
    super(nome, matricula); // Chama o construtor da classe mãe (Usuario)
    this.curso = curso;
  }
}
