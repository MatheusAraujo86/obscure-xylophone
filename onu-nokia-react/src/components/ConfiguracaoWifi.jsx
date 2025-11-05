import { useState } from 'react';
import {
    alterarNomeDaRede,
    alterarSenhaDaRede,
    alterarNomeESenhaDaRede
} from '../services/wifiService';
import {
    areAllNumeric,
    validateRequiredFields,
    validateWifiPassword,
    copyToClipboard
} from '../utils/validation';
import { useSweetAlert } from '../hooks/useSweetAlert';
import HelpModal from './HelpModal';

/**
 * Componente para configurar rede Wi-Fi
 */
function ConfiguracaoWifi({ posicaoData }) {
    const [wifiData, setWifiData] = useState({
        nomeRede: '',
        senhaRede: ''
    });
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    
    const { showSuccessAlert, showErrorAlert } = useSweetAlert();

    // Dados de ajuda dos comandos
    const helpCommands = [
        {
            title: "CONFIGURAR REDE Wi-Fi",
            items: [
                {
                    name: "Nome da Rede Wi-Fi",
                    description: "Irá inserir o nome desejado da rede Wi-Fi."
                },
                {
                    name: "Senha da Rede Wi-Fi",
                    description: "Irá inserir a senha desejada do Wi-Fi."
                }
            ]
        },
        {
            title: "COMANDOS",
            items: [
                {
                    name: "Deletar Nome e Senha do Wi-Fi",
                    command: "DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-4;\nDLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-6;",
                    explanation: "Deleta o nome e senha do Wi-Fi atuais antes de configurar novos valores."
                },
                {
                    name: "Configurar Nome do Wi-Fi",
                    command: 'ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-4::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID,PARAMVALUE="Nome da Rede Wi-Fi";\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-6::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.SSID,PARAMVALUE="Nome da Rede Wi-Fi_5G";',
                    explanation: "Configura o nome do Wi-Fi para as redes 2.4GHz e 5GHz."
                },
                {
                    name: "Configurar Senha do Wi-Fi",
                    command: 'DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-5;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-7;\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-5::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey,PARAMVALUE="Senha da Rede Wi-Fi";\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-7::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.PreSharedKey,PARAMVALUE="Senha da Rede Wi-Fi";',
                    explanation: "Configura a senha do Wi-Fi para as redes 2.4GHz e 5GHz."
                }
            ]
        }
    ];

    const handleInputChange = (field, value) => {
        setWifiData({ ...wifiData, [field]: value });
    };

    const validatePosition = () => {
        const { inputSlot, inputGpon, inputIndex } = posicaoData;
        
        if (!areAllNumeric([inputSlot, inputGpon, inputIndex])) {
            showErrorAlert('Por favor, insira apenas números nos campos slot, pon, posição');
            return false;
        }

        const validation = validateRequiredFields([
            { value: inputSlot, name: 'Slot' },
            { value: inputGpon, name: 'Porta PON' },
            { value: inputIndex, name: 'Posição' }
        ]);

        if (!validation.isValid) {
            showErrorAlert('É necessário preencher os campos de posição (Slot, Porta, Posição)');
            return false;
        }

        return true;
    };

    const executeWifiCommand = async (commandFunction, requiredFields = []) => {
        try {
            if (!validatePosition()) return;

            // Validar campos obrigatórios específicos
            if (requiredFields.length > 0) {
                const fieldsToValidate = requiredFields.map(field => ({
                    value: wifiData[field],
                    name: field === 'nomeRede' ? 'Nome da rede' : 'Senha da rede'
                }));

                const validation = validateRequiredFields(fieldsToValidate);
                if (!validation.isValid) {
                    showErrorAlert(`É necessário preencher o campo: ${validation.emptyField}`);
                    return;
                }

                // Validar senha se necessário
                if (requiredFields.includes('senhaRede') && !validateWifiPassword(wifiData.senhaRede)) {
                    showErrorAlert('A senha deve conter pelo menos 8 caracteres.');
                    return;
                }
            }

            const commandData = {
                ...posicaoData,
                ...wifiData
            };

            const comando = commandFunction(commandData);
            const result = await copyToClipboard(comando);
            
            if (result.success) {
                showSuccessAlert();
                console.log('Comando copiado:', comando);
            } else {
                showErrorAlert("Erro ao copiar comando para a área de transferência.");
            }
        } catch (error) {
            console.error('Erro ao configurar Wi-Fi:', error);
            showErrorAlert("Erro ao configurar rede Wi-Fi.");
        }
    };

    const handleAlterarNome = () => {
        executeWifiCommand(alterarNomeDaRede, ['nomeRede']);
    };

    const handleAlterarSenha = () => {
        executeWifiCommand(alterarSenhaDaRede, ['senhaRede']);
    };

    const handleAlterarNomeESenha = () => {
        executeWifiCommand(alterarNomeESenhaDaRede, ['nomeRede', 'senhaRede']);
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
                    <span className="icon">◈</span>
                    <h3>CONFIGURAR REDE Wi-Fi</h3>
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
                    <label htmlFor="nomeRede">Nome da Rede Wi-Fi</label>
                    <input
                        id="nomeRede"
                        type="text"
                        className="form-input"
                        value={wifiData.nomeRede}
                        onChange={(e) => handleInputChange('nomeRede', e.target.value)}
                        placeholder="Nome da rede Wi-Fi"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="senhaRede">Senha da Rede Wi-Fi</label>
                    <input
                        id="senhaRede"
                        type="text"
                        className="form-input"
                        value={wifiData.senhaRede}
                        onChange={(e) => handleInputChange('senhaRede', e.target.value)}
                        placeholder="Senha da rede Wi-Fi"
                    />
                </div>
                <div className="button-group">
                    <button
                        type="button"
                        className="btn btn-primary btn-full"
                        onClick={handleAlterarNomeESenha}
                    >
                        ALTERAR NOME E SENHA
                    </button>
                    
                    <button
                        type="button"
                        className="btn btn-secondary btn-full"
                        onClick={handleAlterarNome}
                    >
                        ALTERAR APENAS NOME
                    </button>
                    
                    <button
                        type="button"
                        className="btn btn-secondary btn-full"
                        onClick={handleAlterarSenha}
                    >
                        ALTERAR APENAS SENHA
                    </button>
                </div>
            </form>
        </div>
        </>
    );
}

export default ConfiguracaoWifi;