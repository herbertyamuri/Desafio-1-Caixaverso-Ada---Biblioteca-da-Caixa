// js/services/StorageService.js

export class StorageService {
  /**
   * Salva os dados no localStorage.
   * @param {string} chave A chave sob a qual os dados serão armazenados.
   * @param {any} dados Os dados a serem salvos (geralmente um array de objetos).
   */
  static salvar(chave, dados) {
    try {
      const dadosString = JSON.stringify(dados);
      localStorage.setItem(chave, dadosString);
    } catch (error) {
      console.error(`Erro ao salvar dados para a chave "${chave}":`, error);
    }
  }

  /**
   * Carrega os dados do localStorage.
   * @param {string} chave A chave da qual os dados serão carregados.
   * @returns {any[] | null} Retorna os dados como um array de objetos, ou um array vazio se nada for encontrado.
   */
  static carregar(chave) {
    try {
      const dadosString = localStorage.getItem(chave);
      if (dadosString) {
        return JSON.parse(dadosString);
      }
      return []; // Retorna um array vazio se não houver nada salvo
    } catch (error) {
      console.error(`Erro ao carregar dados da chave "${chave}":`, error);
      return [];
    }
  }
}
