/**
 * Serviço para gerenciar configurações de telefone da ONT
 */

/**
 * Provisiona telefone na porta 1 ou 2
 * @param {Object} data - Dados da configuração do telefone
 * @param {string} data.inputSlot - Slot GPON
 * @param {string} data.inputGpon - Porta PON
 * @param {string} data.inputIndex - Posição da ONT
 * @param {string} data.portaTelefonica - Porta do telefone (1 ou 2)
 * @param {string} data.inputUsuarioSIP - Usuário SIP
 * @param {string} data.inputSenhaSIP - Senha SIP
 * @returns {string} Comando para configurar telefone
 */
export function provisionarTelefone(data) {
  const {
    inputSlot,
    inputGpon,
    inputIndex,
    portaTelefonica,
    inputUsuarioSIP,
    inputSenhaSIP,
  } = data;

  if (portaTelefonica === "1") {
    return `SET-QOS-USQUEUE::ONTL2UNIQ-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1-5::::USBWPROFNAME=HSI_1G_UP;ENT-VLANEGPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::0,300:PORTTRANSMODE=SINGLETAGGED;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-10::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-11::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-12::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-13::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.UserAgentDomain,PARAMVALUE="sip.solucaonetwork.com";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.Enable,PARAMVALUE=Enabled;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-15::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.DirectoryNumber,PARAMVALUE=${inputUsuarioSIP};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-16::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.SIP.AuthUserName,PARAMVALUE=${inputUsuarioSIP};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-17::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.SIP.AuthPassword,PARAMVALUE=${inputSenhaSIP};`;
  } else if (portaTelefonica === "2") {
    return `SET-QOS-USQUEUE::ONTL2UNIQ-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1-5::::USBWPROFNAME=HSI_1G_UP;ENT-VLANEGPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::0,300:PORTTRANSMODE=SINGLETAGGED;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-23::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-24::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-25::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-26::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.UserAgentDomain,PARAMVALUE="sip.solucaonetwork.com";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-27::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.Enable,PARAMVALUE=Enabled;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-28::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.DirectoryNumber,PARAMVALUE=${inputUsuarioSIP};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-29::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.SIP.AuthUserName,PARAMVALUE=${inputUsuarioSIP};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-30::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.SIP.AuthPassword,PARAMVALUE=${inputSenhaSIP};`;
  }

  throw new Error("Porta de telefone inválida. Deve ser 1 ou 2.");
}
