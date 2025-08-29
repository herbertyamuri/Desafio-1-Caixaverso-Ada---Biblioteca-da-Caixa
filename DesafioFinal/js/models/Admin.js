// js/models/Admin.js
import { Usuario } from "./Usuario.js";

export class Admin extends Usuario {
  constructor(nome, matricula) {
    // A matrícula para o admin pode ser algo padrão, como 'ADMIN-001'
    super(nome, matricula);
  }
}
