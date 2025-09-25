/**
 * Serviço para gerenciar operações relacionadas a equipamentos ONU Nokia
 */

/**
 * Provisiona uma nova ONU
 * @param {Object} data - Dados da ONU
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @param {string} data.provNome - Nome do cliente
 * @param {string} data.provCaixa - Caixa e Porta
 * @param {string} data.provAlcl - ALCL
 * @param {string} data.provPppoe - Usuário PPPOE
 * @param {string} data.provPass - Senha PPPOE
 * @param {string} data.vlan - VLAN selecionada
 * @returns {string} Comando para provisionar a ONU
 */
export function provisionarONU(data) {
  const {
    inputSlot,
    inputGpon,
    inputIndex,
    provNome,
    provCaixa,
    provAlcl,
    provPppoe,
    provPass,
    vlan,
  } = data;

  return `ENT-ONT::ONT-1-1-${inputSlot}-${inputGpon}-${inputIndex}::::DESC1="${provNome}",DESC2="${provCaixa}",SERNUM="${provAlcl}",SWVERPLND=AUTO,OPTICSHIST=ENABLE,PLNDCFGFILE1=AUTO,DLCFGFILE1=AUTO,VOIPALLOWED=VEIP;ED-ONT::ONT-1-1-${inputSlot}-${inputGpon}-${inputIndex}:::::IS;ENT-ONTCARD::ONTCARD-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14:::VEIP,1,0::IS;ENT-LOGPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::;ED-ONTVEIP::ONTVEIP-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::::IS;SET-QOS-USQUEUE::ONTL2UNIQ-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1-0::::USBWPROFNAME=HSI_1G_UP;SET-VLANPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::MAXNUCMACADR=4,CMITMAXNUMMACADDR=1;ENT-VLANEGPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::0,${vlan}:PORTTRANSMODE=SINGLETAGGED;ENT-VLANEGPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::0,777:PORTTRANSMODE=SINGLETAGGED;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-1::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.X_CT-COM_WANGponLinkConfig.VLANIDMark,PARAMVALUE=${vlan};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-2::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Username,PARAMVALUE="${provPppoe}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-3::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Password,PARAMVALUE="${provPass}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-8::::PARAMNAME=InternetGatewayDevice.X_Authentication.WebAccount.Password,PARAMVALUE="${provAlcl}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-9::::PARAMNAME=InternetGatewayDevice.X_Authentication.Account.Password,PARAMVALUE="${provAlcl}";`;
}

/**
 * Desprovisiona uma ONU
 * @param {Object} data - Dados da ONU
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @returns {string} Comando para desprovisionar a ONU
 */
export function desprovisionarONU(data) {
  const { inputSlot, inputGpon, inputIndex } = data;
  return `ED-ONT::ONT-1-1-${inputSlot}-${inputGpon}-${inputIndex}:::::OOS;DLT-ONT::ONT-1-1-${inputSlot}-${inputGpon}-${inputIndex}::;`;
}

/**
 * Reinicia uma ONU
 * @param {Object} data - Dados da ONU
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @returns {string} Comando para reiniciar a ONU
 */
export function reiniciarONU(data) {
  const { inputSlot, inputGpon, inputIndex } = data;
  return `INIT-SYS::ONT-1-1-${inputSlot}-${inputGpon}-${inputIndex}:::11;`;
}

/**
 * Pesquisa cliente por nome
 * @param {string} nome - Nome do cliente
 * @returns {string} Comando para pesquisar por nome
 */
export function pesquisarPorNome(nome) {
  return `show equipment ont status pon | match exact:${nome}`;
}

/**
 * Pesquisa cliente por ALCL
 * @param {string} alcl - ALCL do cliente
 * @returns {string} Comando para pesquisar por ALCL
 */
export function pesquisarPorAlcl(alcl) {
  const formattedALCL = alcl.substring(0, 4) + ":" + alcl.substring(4);
  return `show equipment ont index sn:${formattedALCL}`;
}

/**
 * Verifica fibra da ONU
 * @param {Object} data - Dados da ONU
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @returns {string} Comando para verificar fibra
 */
export function verificarFibra(data) {
  const { inputSlot, inputGpon, inputIndex } = data;
  return `show equipment ont optics 1/1/${inputSlot}/${inputGpon}/${inputIndex}`;
}

/**
 * Pesquisa PON inteira
 * @param {Object} data - Dados da PON
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @returns {string} Comando para pesquisar PON
 */
export function pesquisarPON(data) {
  const { inputSlot, inputGpon } = data;
  return `show equipment ont status pon 1/1/${inputSlot}/${inputGpon}`;
}

/**
 * Pesquisa alarmes da ONU
 * @param {Object} data - Dados da ONU
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @returns {string} Comando para pesquisar alarmes
 */
export function pesquisarAlarmes(data) {
  const { inputSlot, inputGpon, inputIndex } = data;
  return `show equipment ont operational-data 1/1/${inputSlot}/${inputGpon}/${inputIndex} detail`;
}

/**
 * Retorna comando para listar ONUs solicitando provisionamento
 * @returns {string} Comando para listar ONUs não provisionadas
 */
export function onuSolicitandoProvisionamento() {
  return "show pon unprovision-onu";
}
