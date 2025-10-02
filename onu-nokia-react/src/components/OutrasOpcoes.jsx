import { useState } from 'react';
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
    
    // Estados para controlar os modais
    const [modalPppoeUser, setModalPppoeUser] = useState({ isOpen: false, inputValue: '' });
    const [modalPppoeIp, setModalPppoeIp] = useState({ isOpen: false, inputValue: '' });
    const [modalVelocidade, setModalVelocidade] = useState({ isOpen: false, inputValue: '' });

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

    const handleVerificarVelocidade = async () => {
        setModalVelocidade({ isOpen: true, inputValue: '' });
    };

    const handleConfirmVelocidade = async () => {
        const ppoe = modalVelocidade.inputValue.trim();
        if (!ppoe) {
            showErrorAlert("Usuário PPPoE não informado.");
            return;
        }
        
        setModalVelocidade({ isOpen: false, inputValue: '' });

        const comando = `show network-access aaa subscribers username ${ppoe}`;
        const result = await copyToClipboard(comando);
        
        if (result.success) {
            showInfoAlert("Comando para verificar velocidade copiado!");
        } else {
            showErrorAlert("Erro ao copiar comando.");
        }
    };

    const handleVerificarIpPppoe = async () => {
        setModalPppoeUser({ isOpen: true, inputValue: '' });
    };

    const handleConfirmPppoeUser = async () => {
        const username = modalPppoeUser.inputValue.trim();
        if (!username) {
            showErrorAlert("Usuário PPPoE não informado.");
            return;
        }
        
        setModalPppoeUser({ isOpen: false, inputValue: '' });
        
        const comando = `show subscriber user-name ${username}`;
        const result = await copyToClipboard(comando);
        
        if (result.success) {
            showInfoAlert("Comando para verificar IP do PPPoE copiado!");
        } else {
            showErrorAlert("Erro ao copiar comando.");
        }
    };

    const handleVerificarPppoeDoIp = async () => {
        setModalPppoeIp({ isOpen: true, inputValue: '' });
    };

    const handleConfirmPppoeIp = async () => {
        const ip = modalPppoeIp.inputValue.trim();
        if (!ip) {
            showErrorAlert("IP não informado.");
            return;
        }
        
        setModalPppoeIp({ isOpen: false, inputValue: '' });
        
        const comando = `show subscriber address ${ip}`;
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
        <>
            {/* Modal para inserir PPPoE para verificar velocidade */}
            {modalVelocidade.isOpen && (
                <div className="modal-overlay" onClick={() => setModalVelocidade({ isOpen: false, inputValue: '' })}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Verificar Velocidade</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setModalVelocidade({ isOpen: false, inputValue: '' })}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="pppoeVelocidade">Digite o usuário PPPoE:</label>
                            <input
                                id="pppoeVelocidade"
                                type="text"
                                className="form-input"
                                value={modalVelocidade.inputValue}
                                onChange={(e) => setModalVelocidade(prev => ({ ...prev, inputValue: e.target.value }))}
                                placeholder="Usuário PPPoE"
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && handleConfirmVelocidade()}
                            />
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setModalVelocidade({ isOpen: false, inputValue: '' })}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={handleConfirmVelocidade}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para inserir usuário PPPoE */}
            {modalPppoeUser.isOpen && (
                <div className="modal-overlay" onClick={() => setModalPppoeUser({ isOpen: false, inputValue: '' })}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Verificar IP do PPPoE</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setModalPppoeUser({ isOpen: false, inputValue: '' })}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="pppoeUser">Digite o usuário PPPoE:</label>
                            <input
                                id="pppoeUser"
                                type="text"
                                className="form-input"
                                value={modalPppoeUser.inputValue}
                                onChange={(e) => setModalPppoeUser(prev => ({ ...prev, inputValue: e.target.value }))}
                                placeholder="Usuário PPPoE"
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && handleConfirmPppoeUser()}
                            />
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setModalPppoeUser({ isOpen: false, inputValue: '' })}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={handleConfirmPppoeUser}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para inserir IP */}
            {modalPppoeIp.isOpen && (
                <div className="modal-overlay" onClick={() => setModalPppoeIp({ isOpen: false, inputValue: '' })}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Verificar PPPoE do IP</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setModalPppoeIp({ isOpen: false, inputValue: '' })}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="pppoeIp">Digite o IP:</label>
                            <input
                                id="pppoeIp"
                                type="text"
                                className="form-input"
                                value={modalPppoeIp.inputValue}
                                onChange={(e) => setModalPppoeIp(prev => ({ ...prev, inputValue: e.target.value }))}
                                placeholder="Endereço IP"
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && handleConfirmPppoeIp()}
                            />
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setModalPppoeIp({ isOpen: false, inputValue: '' })}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={handleConfirmPppoeIp}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            onClick={handleVerificarVelocidade}
                        >
                            ◐ Verificar Velocidade
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleVerificarIpPppoe}
                        >
                            ◎ Verificar IP do PPPoE
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
        </>
    );
}

export default OutrasOpcoes;