import { useState } from 'react';
import { provisionarTelefone } from '../services/phoneService';
import {
    areAllNumeric,
    validateRequiredFields,
    copyToClipboard,
    PHONE_PORTS
} from '../utils/validation';
import { useSweetAlert } from '../hooks/useSweetAlert';
import HelpModal from './HelpModal';

/**
 * Componente para configurar telefone
 */
function ConfiguracaoTelefone({ posicaoData }) {
    const [phoneData, setPhoneData] = useState({
        portaTelefonica: '1',
        inputUsuarioSIP: '',
        inputSenhaSIP: ''
    });
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    
    const { showSuccessAlert, showErrorAlert } = useSweetAlert();

    // Dados de ajuda dos comandos
    const helpCommands = [
        {
            title: "CONFIGURAR TELEFONE",
            items: [
                {
                    name: "Porta do Telefone",
                    description: "Selecionar a porta FXS onde será configurado o telefone (1 ou 2)."
                },
                {
                    name: "Usuário SIP",
                    description: "Número fixo do cliente, encontrado no Sipulse."
                },
                {
                    name: "Senha SIP",
                    description: "Senha do cliente, também é encontrada no Sipulse."
                }
            ]
        },
        {
            title: "COMANDOS",
            items: [
                {
                    name: "Habilitar Porta e VLAN",
                    command: "SET-QOS-USQUEUE::ONTL2UNIQ-1-1-1-1-1-14-1-5::::USBWPROFNAME=HSI_1G_UP;\nENT-VLANEGPORT::ONTL2UNI-1-1-1-1-1-14-1:::0,\"VLAN\":PORTTRANSMODE=SINGLETAGGED;",
                    explanation: "Habilita porta e VLAN para o serviço de telefonia."
                },
                {
                    name: "Configurar Servidor SIP",
                    command: 'ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-10::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy,PARAMVALUE=10.255.0.1;\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-11::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer,PARAMVALUE=10.255.0.1;\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-12::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer,PARAMVALUE=10.255.0.1;\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-13::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.UserAgentDomain,PARAMVALUE="sip.solucaonetwork.com";',
                    explanation: "Configura o servidor SIP com os endereços de proxy, registrar e domínio."
                },
                {
                    name: "Configurar Linha do Cliente",
                    command: 'ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-14::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line."Porta do Telefone".Enable,PARAMVALUE=Enabled;\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-15::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line."Porta do Telefone".DirectoryNumber,PARAMVALUE="Usuário SIP";\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-16::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line."Porta do Telefone".SIP.AuthUserName,PARAMVALUE="Usuário SIP";\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-17::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line."Porta do Telefone".SIP.AuthPassword,PARAMVALUE="Senha SIP";',
                    explanation: "Configura a linha do cliente com usuário e senha SIP na porta selecionada."
                }
            ]
        }
    ];

    const handleInputChange = (field, value) => {
        setPhoneData({ ...phoneData, [field]: value });
    };

    const handleConfigurarTelefone = async () => {
        try {
            const { inputSlot, inputGpon, inputIndex } = posicaoData;
            const { portaTelefonica, inputUsuarioSIP, inputSenhaSIP } = phoneData;

            // Validar campos numéricos
            if (!areAllNumeric([inputSlot, inputGpon, inputIndex])) {
                showErrorAlert('Por favor, insira apenas números nos campos slot, pon, posição');
                return;
            }

            // Validar campos obrigatórios
            const requiredFields = [
                { value: inputSlot, name: 'Slot' },
                { value: inputGpon, name: 'Porta PON' },
                { value: inputIndex, name: 'Posição' },
                { value: inputUsuarioSIP, name: 'Usuário SIP' },
                { value: inputSenhaSIP, name: 'Senha SIP' }
            ];

            const validation = validateRequiredFields(requiredFields);
            if (!validation.isValid) {
                showErrorAlert(`É necessário preencher o campo: ${validation.emptyField}`);
                return;
            }

            // Validar porta telefônica
            if (!['1', '2'].includes(portaTelefonica)) {
                showErrorAlert("Porta de telefone inválida. Deve ser 1 ou 2.");
                return;
            }

            const commandData = {
                inputSlot,
                inputGpon,
                inputIndex,
                portaTelefonica,
                inputUsuarioSIP,
                inputSenhaSIP
            };

            const comando = provisionarTelefone(commandData);
            const result = await copyToClipboard(comando);
            
            if (result.success) {
                showSuccessAlert();
                console.log('Comando copiado:', comando);
                
                // Limpar formulário após sucesso
                setPhoneData({
                    portaTelefonica: '1',
                    inputUsuarioSIP: '',
                    inputSenhaSIP: ''
                });
            } else {
                showErrorAlert("Erro ao copiar comando para a área de transferência.");
            }
        } catch (error) {
            console.error('Erro ao configurar telefone:', error);
            showErrorAlert("Erro ao configurar telefone.");
        }
    };

    return (
        <>
            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                commands={helpCommands}
            />
            <div className="card">
                <div className="card-header">
                    <span className="icon">◐</span>
                    <h3>CONFIGURAR TELEFONE</h3>
                    <button
                        type="button"
                        className="help-button"
                        onClick={() => setIsHelpModalOpen(true)}
                        title="Ajuda sobre comandos"
                    >
                        ?
                    </button>
                </div>
            <form className="form">
                <div className="form-group">
                    <label htmlFor="portaTelefonica">Porta do Telefone</label>
                    <select
                        id="portaTelefonica"
                        className="form-select"
                        value={phoneData.portaTelefonica}
                        onChange={(e) => handleInputChange('portaTelefonica', e.target.value)}
                    >
                        {PHONE_PORTS.map(port => (
                            <option key={port.value} value={port.value}>
                                {port.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="inputUsuarioSIP">Usuário SIP</label>
                    <input
                        id="inputUsuarioSIP"
                        type="text"
                        className="form-input"
                        value={phoneData.inputUsuarioSIP}
                        onChange={(e) => handleInputChange('inputUsuarioSIP', e.target.value)}
                        placeholder="Usuário SIP"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="inputSenhaSIP">Senha SIP</label>
                    <input
                        id="inputSenhaSIP"
                        type="text"
                        className="form-input"
                        value={phoneData.inputSenhaSIP}
                        onChange={(e) => handleInputChange('inputSenhaSIP', e.target.value)}
                        placeholder="Senha SIP"
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={handleConfigurarTelefone}
                >
                    ◯ Configurar telefone
                </button>
            </form>
        </div>
        </>
    );
}

export default ConfiguracaoTelefone;