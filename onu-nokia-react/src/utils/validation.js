/**
 * Funções utilitárias para validações e operações comuns
 */

/**
 * Verifica se um valor é numérico
 * @param {string} value - Valor a ser verificado
 * @returns {boolean} True se for numérico
 */
export function isNumeric(value) {
  return /^\d+$/.test(value);
}

/**
 * Verifica se todos os valores em um array são numéricos
 * @param {Array} values - Array de valores para verificar
 * @returns {boolean} True se todos forem numéricos
 */
export function areAllNumeric(values) {
  return values.every((value) => isNumeric(value));
}

/**
 * Valida se o ALCL tem 12 caracteres
 * @param {string} alcl - Código ALCL
 * @returns {boolean} True se for válido
 */
export function validateAlcl(alcl) {
  return alcl && alcl.trim().length === 12;
}

/**
 * Valida se a senha Wi-Fi tem pelo menos 8 caracteres
 * @param {string} senha - Senha Wi-Fi
 * @returns {boolean} True se for válida
 */
export function validateWifiPassword(senha) {
  return senha && senha.length >= 8;
}

/**
 * Verifica se todos os campos obrigatórios estão preenchidos
 * @param {Array} fields - Array de objetos com value e nome do campo
 * @returns {Object} { isValid: boolean, emptyField: string }
 */
export function validateRequiredFields(fields) {
  for (let field of fields) {
    if (!field.value || field.value.trim() === "") {
      return { isValid: false, emptyField: field.name };
    }
  }
  return { isValid: true };
}

/**
 * Copia texto para a área de transferência
 * @param {string} text - Texto a ser copiado
 * @returns {Promise} Promise que resolve quando o texto é copiado
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    console.error("Erro ao copiar texto: ", err);
    return { success: false, error: err };
  }
}

/**
 * Formata ALCL para pesquisa (adiciona dois pontos na posição 4)
 * @param {string} alcl - Código ALCL
 * @returns {string} ALCL formatado
 */
export function formatAlclForSearch(alcl) {
  if (!alcl || alcl.length < 4) return alcl;
  return alcl.substring(0, 4) + ":" + alcl.substring(4);
}

/**
 * Lista de VLANs disponíveis
 */
export const VLANS = [
  { value: "2800", label: "VLAN de NOVA ANDRADINA - MS" },
  { value: "2710", label: "VLAN de MANDAGUAÇU - PR" },
  { value: "2820", label: "VLAN de NOVA ESPERANÇA - PR" },
  { value: "2714", label: "VLAN de TERRA RICA - PR" },
  { value: "2821", label: "VLAN de PAIÇANDU - PR" },
  { value: "2700", label: "VLAN de PARANAVAÍ - PR" },
  { value: "2760", label: "VLAN de MARINGÁ - PR" },
  { value: "3050", label: "VLAN de NOVA ALIANÇA - PR" },
  { value: "2750", label: "VLAN de DOURADOS - MS" },
  { value: "2869", label: "VLAN de IVINHEMA - MS" },
  { value: "2825", label: "VLAN de BAYTAPORÃ - MS" },
];

/**
 * Opções de portas telefônicas
 */
export const PHONE_PORTS = [
  { value: "1", label: "PORTA 1" },
  { value: "2", label: "PORTA 2" },
];
