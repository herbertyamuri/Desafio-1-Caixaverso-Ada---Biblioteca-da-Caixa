// js/main.js
import { Biblioteca } from "./Biblioteca.js";
import { Aluno } from "./models/Aluno.js";
import { Professor } from "./models/Professor.js";
import { Admin } from "./models/Admin.js";

// Função para popular o sistema com dados iniciais
function popularDadosIniciais(biblioteca) {
  // Cadastrar Autores
  biblioteca.cadastrarAutor("Miguel de Cervantes", "Espanhol", 1547);
  biblioteca.cadastrarAutor("Charles Dickens", "Inglês", 1812);
  biblioteca.cadastrarAutor("J.R.R. Tolkien", "Inglês", 1892);

  // Cadastrar Livros
  biblioteca.cadastrarLivro(
    "Dom Quixote",
    "Miguel de Cervantes",
    1605,
    "Romance",
    "978-8535914902"
  );
  biblioteca.cadastrarLivro(
    "Um Conto de Duas Cidades",
    "Charles Dickens",
    1859,
    "Ficção Histórica",
    "978-0141439600"
  );
  biblioteca.cadastrarLivro(
    "O Senhor dos Anéis",
    "J.R.R. Tolkien",
    1954,
    "Fantasia",
    "978-0618640157"
  );

  // Cadastrar Usuários
  const admin = new Admin("Helena Torres", "ADMIN-001");
  const aluno1 = new Aluno(
    "Carlos Andrade",
    "MAT-202501",
    "Engenharia de Software"
  );
  const aluno2 = new Aluno("Beatriz Costa", "MAT-202502", "Design Digital");
  const professor = new Professor(
    "Dr. Ricardo Neves",
    "PROF-199801",
    "Ciência da Computação"
  );

  biblioteca._usuarios.push(admin, aluno1, aluno2, professor);
  biblioteca._salvarDados(); // Salva os novos usuários

  console.log("Sistema populado com dados iniciais.");
}

// --- PONTO DE ENTRADA DA APLICAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Instancia a biblioteca. O construtor já tenta carregar os dados.
  const biblioteca = new Biblioteca();

  // 2. Verifica se a biblioteca está vazia (primeira execução)
  if (
    biblioteca.listarLivros().length === 0 &&
    biblioteca.listarAutores().length === 0
  ) {
    console.log(
      "Nenhum dado encontrado. Populando o sistema com dados iniciais..."
    );
    popularDadosIniciais(biblioteca);
  } else {
    console.log("Dados carregados do localStorage com sucesso.");
  }

  // 3. Expõe a instância da biblioteca no objeto window para ser acessível pelo console
  window.biblioteca = biblioteca;

  console.log(
    "Bem-vindo à Biblioteca da Caixa! A instância 'biblioteca' está disponível no console."
  );
  console.log(
    "Experimente: biblioteca.listarLivros() ou biblioteca.listarUsuarios()"
  );
});
