import { useState } from 'react';
import { alterarSenhaOnu } from '../services/wifiService';
import {
    areAllNumeric,
    validateRequiredFields,
    validateAlcl,
    copyToClipboard
} from '../utils/validation';
import { useSweetAlert } from '../hooks/useSweetAlert';
import HelpModal from './HelpModal';

/**
 * Componente para alterar senha de acesso web da ONT
 */
function AlterarSenhaWeb({ posicaoData }) {
    const [senhaWeb, setSenhaWeb] = useState('');
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    
    const { showSuccessAlert, showErrorAlert } = useSweetAlert();

    // Dados de ajuda dos comandos
    const helpCommands = [
        {
            title: "ALTERAR SENHA DE ACESSO WEB",
            items: [
                {
                    name: "S°NUMBER (sernum)",
                    description: "Número de serial da ONT",
                    explanation: "Como é Nokia, use o formato ALCL."
                }
            ]
        },
        {
            title: "COMANDOS",
            items: [
                {
                    name: "Deletar Usuário e Senha Atuais",
                    command: "DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-8;\nDLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-9;",
                    explanation: "Deleta o usuário e senha atuais da ONT antes de configurar novos valores."
                },
                {
                    name: "Configurar Usuário e Senha Novos",
                    command: 'ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-8::::PARAMNAME=InternetGatewayDevice.X_Authentication.WebAccount.Password,PARAMVALUE="S°NUMBER (sernum)";\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-9::::PARAMNAME=InternetGatewayDevice.X_Authentication.Account.Password,PARAMVALUE="S°NUMBER (sernum)";',
                    explanation: "Configura o usuário e senha novos usando o número de série da ONT (ALCL)."
                }
            ]
        }
    ];

    const handleInputChange = (value) => {
        // Converter para maiúscula e limitar a 12 caracteres
        const processedValue = value.toUpperCase().slice(0, 12);
        setSenhaWeb(processedValue);
    };

    const handleAlterarSenhaWeb = async () => {
        try {
            // Verificar se posicaoData existe
            if (!posicaoData) {
                showErrorAlert('Dados de posição não encontrados. Verifique se os campos Slot, PON e Posição estão preenchidos.');
                return;
            }

            const { inputSlot, inputGpon, inputIndex } = posicaoData;

            // Verificar se os campos de posição existem
            if (!inputSlot || !inputGpon || !inputIndex) {
                showErrorAlert('Por favor, preencha os campos de posição (Slot, PON, Posição) no componente superior.');
                return;
            }

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
                { value: senhaWeb, name: 'S°NUMBER (sernum)' }
            ];

            const validation = validateRequiredFields(requiredFields);
            if (!validation.isValid) {
                showErrorAlert(`É necessário preencher o campo: ${validation.emptyField}`);
                return;
            }

            // Validar ALCL - deve ter exatamente 12 caracteres
            if (!validateAlcl(senhaWeb)) {
                showErrorAlert(`ALCL deve ter exatamente 12 caracteres. Atual: ${senhaWeb.length} caracteres.`);
                return;
            }

            const commandData = {
                inputSlot,
                inputGpon,
                inputIndex,
                altSenhaOnu: senhaWeb
            };

            const comando = alterarSenhaOnu(commandData);
            const result = await copyToClipboard(comando);
            
            if (result.success) {
                showSuccessAlert();
                console.log('Comando copiado:', comando);
                
                // Limpar formulário após sucesso
                setSenhaWeb('');
            } else {
                showErrorAlert("Erro ao copiar comando para a área de transferência.");
            }
        } catch (error) {
            console.error('Erro ao alterar senha web:', error);
            showErrorAlert("Erro ao alterar senha de acesso web.");
        }
    };

    return (
        <>
            {/* Modal de Ajuda */}
            <HelpModal 
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                commands={helpCommands}
            />

            <div className="card">
                <div className="card-header">
                    <span className="icon">◇</span>
                    <h3>ALTERAR SENHA DE ACESSO WEB</h3>
                    <button 
                        type="button"
                        className="help-button"
                        onClick={() => setIsHelpModalOpen(true)}
                        title="Ajuda sobre comandos"
                        aria-label="Abrir ajuda sobre comandos"
                    >
                        ?
                    </button>
                </div>
                <form className="form">
                    <div className="form-group">
                        <label htmlFor="senhaWeb">S°NUMBER (sernum)</label>
                        <input
                            id="senhaWeb"
                            type="text"
                            className="form-input"
                            value={senhaWeb}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="ALCL da ONT"
                            maxLength="12"
                        />
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary btn-full"
                        onClick={handleAlterarSenhaWeb}
                    >
                        ◪ Alterar senha web
                    </button>
                </form>
            </div>
        </>
    );
}

export default AlterarSenhaWeb;