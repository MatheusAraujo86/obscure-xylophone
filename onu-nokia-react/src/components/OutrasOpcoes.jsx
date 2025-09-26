import {
    pesquisarPON,
    pesquisarAlarmes,
    reiniciarONU,
    onuSolicitandoProvisionamento,
    verificarFibra,
    desprovisionarONU
} from '../services/onuService';
import { areAllNumeric, copyToClipboard } from '../utils/validation';
import { useSweetAlert } from '../hooks/useSweetAlert';

/**
 * Componente com opções adicionais para gerenciamento da ONU
 */
function OutrasOpcoes({ posicaoData }) {
    const { showSuccessAlert, showErrorAlert, showConfirmAlert } = useSweetAlert();

    const executeCommand = async (commandFunction, requiredFields = []) => {
        try {
            // Validar campos numéricos se necessário
            if (requiredFields.length > 0) {
                const values = requiredFields.map(field => posicaoData[field] || '');
                
                if (!areAllNumeric(values)) {
                    showErrorAlert('Por favor, insira apenas números nos campos slot, pon, posição');
                    return;
                }

                // Verificar se os campos obrigatórios estão preenchidos
                const emptyFields = values.some(value => value.trim() === '');
                if (emptyFields) {
                    showErrorAlert('Por favor, preencha todos os campos obrigatórios');
                    return;
                }
            }

            const comando = commandFunction(posicaoData);
            const result = await copyToClipboard(comando);
            
            if (result.success) {
                showSuccessAlert();
                console.log('Comando copiado:', comando);
            } else {
                showErrorAlert("Erro ao copiar comando para a área de transferência.");
            }
        } catch (error) {
            console.error('Erro ao executar comando:', error);
            showErrorAlert("Erro ao executar operação.");
        }
    };

    const handlePesquisarPON = () => {
        executeCommand(pesquisarPON, ['inputSlot', 'inputGpon']);
    };

    const handlePesquisarAlarmes = () => {
        executeCommand(pesquisarAlarmes, ['inputSlot', 'inputGpon', 'inputIndex']);
    };

    const handleReiniciarONU = () => {
        showConfirmAlert(
            'ATENÇÃO: Esta ação irá reiniciar a ONU. Tem certeza que deseja continuar?',
            () => executeCommand(reiniciarONU, ['inputSlot', 'inputGpon', 'inputIndex'])
        );
    };

    const handleVerificarFibra = () => {
        executeCommand(verificarFibra, ['inputSlot', 'inputGpon', 'inputIndex']);
    };

    const handleDesprovisionarONU = () => {
        showConfirmAlert(
            'ATENÇÃO: Esta ação irá desprovisionar a ONU. Tem certeza que deseja continuar?',
            () => executeCommand(desprovisionarONU, ['inputSlot', 'inputGpon', 'inputIndex'])
        );
    };

    const handleONUSolicitandoProvisionamento = async () => {
        try {
            const comando = onuSolicitandoProvisionamento();
            const result = await copyToClipboard(comando);
            
            if (result.success) {
                showSuccessAlert();
                console.log('Comando copiado:', comando);
            } else {
                showErrorAlert("Erro ao copiar comando para a área de transferência.");
            }
        } catch (error) {
            console.error('Erro ao executar comando:', error);
            showErrorAlert("Erro ao executar operação.");
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <span className="icon">◆</span>
                <h3>OUTRAS OPÇÕES</h3>
            </div>
            <div className="button-group">
                <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={handlePesquisarPON}
                >
                    ◈ PESQUISAR PON
                </button>
                
                <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={handlePesquisarAlarmes}
                >
                    ◐ PESQUISAR ALARMES
                </button>
                
                <button
                    type="button"
                    className="btn btn-warning btn-full"
                    onClick={handleReiniciarONU}
                >
                    ◎ REINICIAR ONU
                </button>
                
                <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={handleONUSolicitandoProvisionamento}
                >
                    ◊ ONU SOLICITANDO PROVISIONAMENTO
                </button>
                
                <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={handleVerificarFibra}
                >
                    ◇ VERIFICAR FIBRA
                </button>
                
                <button
                    type="button"
                    className="btn btn-danger btn-full"
                    onClick={handleDesprovisionarONU}
                >
                    ◆ DESPROVISIONAR ONU
                </button>
            </div>
        </div>
    );
}

export default OutrasOpcoes;