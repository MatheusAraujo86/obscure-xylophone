/**
 * Serviço para gerenciar configurações de rede Wi-Fi da ONT
 */

/**
 * Altera o nome da rede Wi-Fi
 * @param {Object} data - Dados da configuração
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @param {string} data.nomeRede - Novo nome da rede
 * @returns {string} Comando para alterar nome da rede
 */
export function alterarNomeDaRede(data) {
  const { inputSlot, inputGpon, inputIndex, nomeRede } = data;

  return `DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-4;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-6;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-4::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID,PARAMVALUE="${nomeRede}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-6::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.SSID,PARAMVALUE="${nomeRede}_5G";`;
}

/**
 * Altera a senha da rede Wi-Fi
 * @param {Object} data - Dados da configuração
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @param {string} data.senhaRede - Nova senha da rede
 * @returns {string} Comando para alterar senha da rede
 */
export function alterarSenhaDaRede(data) {
  const { inputSlot, inputGpon, inputIndex, senhaRede } = data;

  return `DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-5;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-7;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-5::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey,PARAMVALUE="${senhaRede}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-7::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.PreSharedKey,PARAMVALUE="${senhaRede}";`;
}

/**
 * Altera nome e senha da rede Wi-Fi
 * @param {Object} data - Dados da configuração
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @param {string} data.nomeRede - Novo nome da rede
 * @param {string} data.senhaRede - Nova senha da rede
 * @returns {string} Comando para alterar nome e senha da rede
 */
export function alterarNomeESenhaDaRede(data) {
  const { inputSlot, inputGpon, inputIndex, nomeRede, senhaRede } = data;

  return `DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-4;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-5;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-6;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-7;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-4::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID,PARAMVALUE="${nomeRede}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-5::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey,PARAMVALUE="${senhaRede}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-6::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.SSID,PARAMVALUE="${nomeRede}_5G";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-7::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.PreSharedKey,PARAMVALUE="${senhaRede}";`;
}

/**
 * Altera VLAN e PPPOE
 * @param {Object} data - Dados da configuração
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @param {string} data.altPppoe - Novo usuário PPPOE
 * @param {string} data.altpass - Nova senha PPPOE
 * @param {string} data.vlan - Nova VLAN
 * @returns {string} Comando para alterar VLAN e PPPOE
 */
export function alterarVlanPppoe(data) {
  const { inputSlot, inputGpon, inputIndex, altPppoe, altpass, vlan } = data;

  return `DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-1;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-2;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-3;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-1::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.X_CT-COM_WANGponLinkConfig.VLANIDMark,PARAMVALUE=${vlan};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-2::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Username,PARAMVALUE="${altPppoe}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-3::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Password,PARAMVALUE="${altpass}";`;
}

/**
 * Altera senha de acesso web da ONT
 * @param {Object} data - Dados da configuração
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @param {string} data.altSenhaOnu - Nova senha (ALCL)
 * @returns {string} Comando para alterar senha da ONT
 */
export function alterarSenhaOnu(data) {
  const { inputSlot, inputGpon, inputIndex, altSenhaOnu } = data;

  return `DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-8;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-9;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-8::::PARAMNAME=InternetGatewayDevice.X_Authentication.WebAccount.Password,PARAMVALUE="${altSenhaOnu}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-9::::PARAMNAME=InternetGatewayDevice.X_Authentication.Account.Password,PARAMVALUE="${altSenhaOnu}";`;
}
