/**
 * Sanitiza um CPF removendo caracteres especiais como pontos e traços
 * @param {string} cpf - CPF a ser sanitizado
 * @returns {string} - CPF sanitizado contendo apenas números
 */
export const sanitizeCPF = (cpf: string): string => {
  if (!cpf) return '';
  // Remove todos os caracteres que não sejam dígitos
  return cpf.replace(/\D/g, '');
};

/**
 * Valida se um CPF tem 11 dígitos após sanitização
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - True se o CPF for válido, false caso contrário
 */
export const isValidCPF = (cpf: string): boolean => {
  const sanitizedCPF = sanitizeCPF(cpf);
  return sanitizedCPF.length === 11 && !isNaN(Number(sanitizedCPF));
};

/**
 * Formata um CPF para o padrão XXX.XXX.XXX-XX
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} - CPF formatado
 */
export const formatCPF = (cpf: string): string => {
  const sanitizedCPF = sanitizeCPF(cpf);
  if (sanitizedCPF.length !== 11) {
    return cpf; // Retorna o valor original se não tiver 11 dígitos
  }
  // Formata como XXX.XXX.XXX-XX
  return sanitizedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};
