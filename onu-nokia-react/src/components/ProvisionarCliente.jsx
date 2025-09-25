import { useState } from 'react';
import { provisionarONU } from '../services/onuService';
import { 
    areAllNumeric, 
    validateAlcl, 
    validateRequiredFields, 
    copyToClipboard,
    VLANS 
} from '../utils/validation';
import { useSweetAlert } from '../hooks/useSweetAlert';

/**
 * Componente para provisionar cliente
 */
function ProvisionarCliente({ posicaoData }) {
    const [provData, setProvData] = useState({
        provNome: '',
        provAlcl: '',
        provCaixa: '',
        provPppoe: '',
        provPass: '',
        vlan: '2800' // valor padrão
    });
    
    const { showSuccessAlert, showErrorAlert } = useSweetAlert();

    const handleInputChange = (field, value) => {
        setProvData({ ...provData, [field]: value });
    };

    const handleProvisionar = async () => {
        try {
            const { inputSlot, inputGpon, inputIndex } = posicaoData;
            const { provNome, provAlcl, provCaixa, provPppoe, provPass, vlan } = provData;

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
                { value: provNome, name: 'Nome do cliente' },
                { value: provCaixa, name: 'Caixa e Porta' },
                { value: provAlcl, name: 'ALCL' },
                { value: provPppoe, name: 'Usuário PPPOE' },
                { value: provPass, name: 'Senha PPPOE' },
                { value: vlan, name: 'VLAN' }
            ];

            const validation = validateRequiredFields(requiredFields);
            if (!validation.isValid) {
                showErrorAlert(`É necessário preencher o campo: ${validation.emptyField}`);
                return;
            }

            // Validar ALCL
            if (!validateAlcl(provAlcl)) {
                showErrorAlert("Por favor, insira um código ALCL válido com 12 caracteres.");
                return;
            }

            const commandData = {
                inputSlot,
                inputGpon,
                inputIndex,
                provNome,
                provCaixa,
                provAlcl: provAlcl.toUpperCase(),
                provPppoe,
                provPass,
                vlan
            };

            const comando = provisionarONU(commandData);
            const result = await copyToClipboard(comando);
            
            if (result.success) {
                showSuccessAlert();
                console.log('Comando copiado:', comando);
                
                // Limpar formulário após sucesso
                setProvData({
                    provNome: '',
                    provAlcl: '',
                    provCaixa: '',
                    provPppoe: '',
                    provPass: '',
                    vlan: '2800'
                });
            } else {
                showErrorAlert("Erro ao copiar comando para a área de transferência.");
            }
        } catch (error) {
            console.error('Erro ao provisionar:', error);
            showErrorAlert("Erro ao provisionar cliente.");
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <span className="icon">👤</span>
                <h3>PROVISIONAR CLIENTE</h3>
            </div>
            <form className="form">
                <div className="form-group">
                    <label htmlFor="provNome">Nome do Cliente</label>
                    <input
                        id="provNome"
                        type="text"
                        className="form-input"
                        value={provData.provNome}
                        onChange={(e) => handleInputChange('provNome', e.target.value)}
                        placeholder="Nome do cliente"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="provAlcl">ALCL</label>
                    <input
                        id="provAlcl"
                        type="text"
                        className="form-input"
                        value={provData.provAlcl}
                        onChange={(e) => handleInputChange('provAlcl', e.target.value)}
                        placeholder="Novo ALCL"
                        maxLength="12"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="provCaixa">Caixa e Porta</label>
                    <input
                        id="provCaixa"
                        type="text"
                        className="form-input"
                        value={provData.provCaixa}
                        onChange={(e) => handleInputChange('provCaixa', e.target.value)}
                        placeholder="Caixa e Porta"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="provPppoe">Usuário PPPOE</label>
                    <input
                        id="provPppoe"
                        type="text"
                        className="form-input"
                        value={provData.provPppoe}
                        onChange={(e) => handleInputChange('provPppoe', e.target.value)}
                        placeholder="Usuário PPPOE"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="provPass">Senha PPPOE</label>
                    <input
                        id="provPass"
                        type="password"
                        className="form-input"
                        value={provData.provPass}
                        onChange={(e) => handleInputChange('provPass', e.target.value)}
                        placeholder="Senha PPPOE"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="vlan">VLAN</label>
                    <select
                        id="vlan"
                        className="form-select"
                        value={provData.vlan}
                        onChange={(e) => handleInputChange('vlan', e.target.value)}
                    >
                        {VLANS.map(vlan => (
                            <option key={vlan.value} value={vlan.value}>
                                {vlan.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="button"
                    className="btn btn-primary btn-full btn-large"
                    onClick={handleProvisionar}
                >
                    👤 PROVISIONAR ONU
                </button>
            </form>
        </div>
    );
}

export default ProvisionarCliente;