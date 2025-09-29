/**
 * Serviço para gerenciar operações relacionadas a equipamentos ONT Nokia
 */

/**
 * Provisiona uma nova ONT apenas com telefonia (sem PPPoE)
 * @param {Object} data - Dados da ONT para telefonia
 * @param {string} data.slot - Slot GPON
 * @param {string} data.gpon - Porta PON
 * @param {string} data.index - Posição da ONT
 * @param {string} data.desc1 - Nome do cliente
 * @param {string} data.desc2 - Localização/Referência
 * @param {string} data.sernum - Serial Number
 * @param {string} data.telefone - Número do telefone
 * @param {string} data.senhaVoip - Senha VoIP
 * @returns {Object} Objetos com comandos separados
 */
export function provisionarONTTelefonia(data) {
  const {
    slot,
    gpon,
    index,
    desc1,
    desc2,
    sernum,
    telefone,
    senhaVoip,
    vlanInternet,
    vlanTelefonia,
  } = data;

  const comandos1 = `ENT-ONT::ONT-1-1-${slot}-${gpon}-${index}::::DESC1="${desc1}",DESC2="${desc2}",SERNUM="${sernum}",SWVERPLND=AUTO,OPTICSHIST=ENABLE,PLNDCFGFILE1=AUTO,DLCFGFILE1=AUTO,VOIPALLOWED=VEIP;ED-ONT::ONT-1-1-${slot}-${gpon}-${index}:::::IS;ENT-ONTCARD::ONTCARD-1-1-${slot}-${gpon}-${index}-14:::VEIP,1,0::IS;ENT-LOGPORT::ONTL2UNI-1-1-${slot}-${gpon}-${index}-14-1:::;ED-ONTVEIP::ONTVEIP-1-1-${slot}-${gpon}-${index}-14-1:::::IS;SET-QOS-USQUEUE::ONTL2UNIQ-1-1-${slot}-${gpon}-${index}-14-1-0::::USBWPROFNAME=HSI_1G_UP;SET-VLANPORT::ONTL2UNI-1-1-${slot}-${gpon}-${index}-14-1:::MAXNUCMACADR=4,CMITMAXNUMMACADDR=1;ENT-VLANEGPORT::ONTL2UNI-1-1-${slot}-${gpon}-${index}-14-1:::0,${vlanInternet}:PORTTRANSMODE=SINGLETAGGED;ENT-VLANEGPORT::ONTL2UNI-1-1-${slot}-${gpon}-${index}-14-1:::0,${vlanTelefonia}:PORTTRANSMODE=SINGLETAGGED;`;

  const comandos2 = `SET-QOS-USQUEUE::ONTL2UNIQ-1-1-${slot}-${gpon}-${index}-14-1-5::::USBWPROFNAME=HSI_1G_UP;ENT-VLANEGPORT::ONTL2UNI-1-1-${slot}-${gpon}-${index}-14-1:::0,${vlanTelefonia}:PORTTRANSMODE=SINGLETAGGED;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${slot}-${gpon}-${index}-10::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${slot}-${gpon}-${index}-11::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${slot}-${gpon}-${index}-12::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${slot}-${gpon}-${index}-13::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.UserAgentDomain,PARAMVALUE="sip.solucaonetwork.com";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${slot}-${gpon}-${index}-14::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.Enable,PARAMVALUE=Enabled;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${slot}-${gpon}-${index}-15::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.DirectoryNumber,PARAMVALUE=${telefone};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${slot}-${gpon}-${index}-16::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthUserName,PARAMVALUE=${telefone};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${slot}-${gpon}-${index}-17::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.1.SIP.AuthPassword,PARAMVALUE=${senhaVoip};`;

  return { comandos1, comandos2 };
}

/**
 * Provisiona uma nova ONT
 * @param {Object} data - Dados da ONT
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @param {string} data.provNome - Nome do cliente
 * @param {string} data.provCaixa - Caixa e Porta
 * @param {string} data.provAlcl - ALCL
 * @param {string} data.provPppoe - Usuário PPPOE
 * @param {string} data.provPass - Senha PPPOE
 * @param {string} data.vlan - VLAN selecionada
 * @returns {string} Comando para provisionar a ONT
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
 * Desprovisiona uma ONT
 * @param {Object} data - Dados da ONT
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @returns {string} Comando para desprovisionar a ONT
 */
export function desprovisionarONU(data) {
  const { inputSlot, inputGpon, inputIndex } = data;
  return `ED-ONT::ONT-1-1-${inputSlot}-${inputGpon}-${inputIndex}:::::OOS;DLT-ONT::ONT-1-1-${inputSlot}-${inputGpon}-${inputIndex}::;`;
}

/**
 * Reinicia uma ONT
 * @param {Object} data - Dados da ONT
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @returns {string} Comando para reiniciar a ONT
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
 * Verifica fibra da ONT
 * @param {Object} data - Dados da ONT
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
 * Pesquisa alarmes da ONT
 * @param {Object} data - Dados da ONT
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
 * Retorna comando para listar ONTs solicitando provisionamento
 * @returns {string} Comando para listar ONTs não provisionadas
 */
export function onuSolicitandoProvisionamento() {
  return "show pon unprovision-onu";
}
