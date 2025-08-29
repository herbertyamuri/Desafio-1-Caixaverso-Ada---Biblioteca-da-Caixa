// js/models/Professor.js
import { Usuario } from "./Usuario.js";

export class Professor extends Usuario {
  constructor(nome, matricula, departamento) {
    super(nome, matricula);
    this.departamento = departamento;
  }
}
