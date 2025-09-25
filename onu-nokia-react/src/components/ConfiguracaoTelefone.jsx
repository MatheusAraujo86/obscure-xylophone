import { useState } from 'react';
import { provisionarTelefone } from '../services/phoneService';
import {
    areAllNumeric,
    validateRequiredFields,
    copyToClipboard,
    PHONE_PORTS
} from '../utils/validation';
import { useSweetAlert } from '../hooks/useSweetAlert';

/**
 * Componente para configurar telefone
 */
function ConfiguracaoTelefone({ posicaoData }) {
    const [phoneData, setPhoneData] = useState({
        portaTelefonica: '1',
        inputUsuarioSIP: '',
        inputSenhaSIP: ''
    });
    
    const { showSuccessAlert, showErrorAlert } = useSweetAlert();

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
        <div className="card">
            <div className="card-header">
                <span className="icon">📞</span>
                <h3>CONFIGURAR TELEFONE</h3>
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
                        type="password"
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
                    📞 Configurar telefone
                </button>
            </form>
        </div>
    );
}

export default ConfiguracaoTelefone;