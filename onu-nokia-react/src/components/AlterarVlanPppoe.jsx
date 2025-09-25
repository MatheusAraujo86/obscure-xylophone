import { useState } from 'react';
import { alterarVlanPppoe } from '../services/wifiService';
import {
    areAllNumeric,
    validateRequiredFields,
    copyToClipboard,
    VLANS
} from '../utils/validation';
import { useSweetAlert } from '../hooks/useSweetAlert';

/**
 * Componente para alterar VLAN e PPPOE
 */
function AlterarVlanPppoe({ posicaoData }) {
    const [vlanPppoeData, setVlanPppoeData] = useState({
        altPppoe: '',
        altpass: '',
        vlan: '2800' // valor padrão
    });
    
    const { showSuccessAlert, showErrorAlert } = useSweetAlert();

    const handleInputChange = (field, value) => {
        setVlanPppoeData({ ...vlanPppoeData, [field]: value });
    };

    const handleAlterarVlanPppoe = async () => {
        try {
            const { inputSlot, inputGpon, inputIndex } = posicaoData;
            const { altPppoe, altpass, vlan } = vlanPppoeData;

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
                { value: altPppoe, name: 'Usuário PPPOE' },
                { value: altpass, name: 'Senha PPPOE' },
                { value: vlan, name: 'VLAN' }
            ];

            const validation = validateRequiredFields(requiredFields);
            if (!validation.isValid) {
                showErrorAlert(`É necessário preencher o campo: ${validation.emptyField}`);
                return;
            }

            const commandData = {
                inputSlot,
                inputGpon,
                inputIndex,
                altPppoe,
                altpass,
                vlan
            };

            const comando = alterarVlanPppoe(commandData);
            const result = await copyToClipboard(comando);
            
            if (result.success) {
                showSuccessAlert();
                console.log('Comando copiado:', comando);
                
                // Limpar formulário após sucesso
                setVlanPppoeData({
                    altPppoe: '',
                    altpass: '',
                    vlan: '2800'
                });
            } else {
                showErrorAlert("Erro ao copiar comando para a área de transferência.");
            }
        } catch (error) {
            console.error('Erro ao alterar VLAN e PPPOE:', error);
            showErrorAlert("Erro ao alterar VLAN e PPPOE.");
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <span className="icon">🔑</span>
                <h3>ALTERAR VLAN PPPOE</h3>
            </div>
            <form className="form">
                <div className="form-group">
                    <label htmlFor="altPppoe">Usuário PPPOE</label>
                    <input
                        id="altPppoe"
                        type="text"
                        className="form-input"
                        value={vlanPppoeData.altPppoe}
                        onChange={(e) => handleInputChange('altPppoe', e.target.value)}
                        placeholder="Usuário PPPOE"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="altpass">Senha PPPOE</label>
                    <input
                        id="altpass"
                        type="password"
                        className="form-input"
                        value={vlanPppoeData.altpass}
                        onChange={(e) => handleInputChange('altpass', e.target.value)}
                        placeholder="Senha PPPOE"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="vlan">VLAN</label>
                    <select
                        id="vlan"
                        className="form-select"
                        value={vlanPppoeData.vlan}
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
                    className="btn btn-primary btn-full"
                    onClick={handleAlterarVlanPppoe}
                >
                    🔑 Alterar VLAN e PPPOE
                </button>
            </form>
        </div>
    );
}

export default AlterarVlanPppoe;