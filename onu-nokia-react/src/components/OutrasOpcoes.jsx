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
    const { showSuccessAlert, showErrorAlert, showConfirmAlert, showInfoAlert } = useSweetAlert();

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

    // Funções de consulta do Bridge ONT Nokia
    const getPath = () => {
        const { inputSlot, inputGpon, inputIndex } = posicaoData;
        // Para as consultas, vamos usar valores padrão para cardType e portaLan
        const cardType = '1'; // Card padrão
        const portaLan = '1'; // Porta LAN padrão
        
        if (!inputSlot || !inputGpon || !inputIndex) {
            return null;
        }
        
        return `${inputSlot}/${inputGpon}/${inputIndex}/${cardType}/${portaLan}`;
    };

    const handleVerificarVlan = async () => {
        const path = getPath();
        if (!path) {
            showErrorAlert("⚠️ Preencha todos os campos: Slot, PON e Posição.");
            return;
        }
        const comando = `info configure bridge port 1/1/${path}`;
        const result = await copyToClipboard(comando);
        
        if (result.success) {
            showInfoAlert("Comando para verificar VLAN copiado!");
        } else {
            showErrorAlert("Erro ao copiar comando.");
        }
    };

    const handleVerificarVelocidade = async () => {
        const path = getPath();
        if (!path) {
            showErrorAlert("⚠️ Preencha todos os campos: Slot, PON e Posição.");
            return;
        }
        const comando = `show interface port uni:1/1/${path} detail`;
        const result = await copyToClipboard(comando);
        
        if (result.success) {
            showInfoAlert("Comando para verificar velocidade copiado!");
        } else {
            showErrorAlert("Erro ao copiar comando.");
        }
    };

    const handleVerificarIpPppoe = async () => {
        const username = prompt("Digite o usuário PPPoE para verificar o IP:");
        if (!username) {
            showErrorAlert("Usuário PPPoE não informado.");
            return;
        }
        const comando = `show subscriber pppoe username ${username}`;
        const result = await copyToClipboard(comando);
        
        if (result.success) {
            showInfoAlert("Comando para verificar IP do PPPoE copiado!");
        } else {
            showErrorAlert("Erro ao copiar comando.");
        }
    };

    const handleVerificarPppoeDoIp = async () => {
        const ip = prompt("Digite o IP para verificar qual PPPoE está vinculado:");
        if (!ip) {
            showErrorAlert("IP não informado.");
            return;
        }
        const comando = `show subscriber pppoe ip-address ${ip}`;
        const result = await copyToClipboard(comando);
        
        if (result.success) {
            showInfoAlert(`Comando para verificar PPPoE do IP ${ip} copiado!`);
        } else {
            showErrorAlert("Erro ao copiar comando.");
        }
    };

    // Handlers existentes
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
            
            <form className="form">
                {/* Seção de Consultas Bridge ONT */}
                <div className="form-group">
                    <label>Consultas Bridge ONT</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleVerificarVlan}
                        >
                            ◊ Verificar VLAN
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleVerificarVelocidade}
                        >
                            ◐ Verificar Velocidade
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleVerificarIpPppoe}
                        >
                            ◎ Verificar IP PPPoE
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleVerificarPppoeDoIp}
                        >
                            ◯ Verificar PPPoE do IP
                        </button>
                    </div>
                </div>

                {/* Seção de Operações Principais */}
                <div className="form-group">
                    <label>Operações</label>
                    <button
                        type="button"
                        className="btn btn-primary btn-full"
                        onClick={handlePesquisarPON}
                    >
                        ◈ PESQUISAR PON
                    </button>
                </div>
                
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-primary btn-full"
                        onClick={handlePesquisarAlarmes}
                    >
                        ◐ PESQUISAR ALARMES
                    </button>
                </div>
                
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-warning btn-full"
                        onClick={handleReiniciarONU}
                    >
                        ◎ REINICIAR ONU
                    </button>
                </div>
                
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-primary btn-full"
                        onClick={handleONUSolicitandoProvisionamento}
                    >
                        ◊ ONU SOLICITANDO PROVISIONAMENTO
                    </button>
                </div>
                
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-primary btn-full"
                        onClick={handleVerificarFibra}
                    >
                        ◇ VERIFICAR FIBRA
                    </button>
                </div>
                
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-danger btn-full"
                        onClick={handleDesprovisionarONU}
                    >
                        ◆ DESPROVISIONAR ONU
                    </button>
                </div>
            </form>
        </div>
    );
}

export default OutrasOpcoes;