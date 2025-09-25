import { useState } from 'react';
import { alterarSenhaOnu } from '../services/wifiService';
import {
    areAllNumeric,
    validateRequiredFields,
    validateAlcl,
    copyToClipboard
} from '../utils/validation';
import { useSweetAlert } from '../hooks/useSweetAlert';

/**
 * Componente para alterar senha de acesso web da ONU
 */
function AlterarSenhaWeb({ posicaoData }) {
    const [senhaWeb, setSenhaWeb] = useState('');
    
    const { showSuccessAlert, showErrorAlert } = useSweetAlert();

    const handleAlterarSenhaWeb = async () => {
        try {
            const { inputSlot, inputGpon, inputIndex } = posicaoData;

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
                { value: senhaWeb, name: 'Senha Web (ALCL)' }
            ];

            const validation = validateRequiredFields(requiredFields);
            if (!validation.isValid) {
                showErrorAlert(`É necessário preencher o campo: ${validation.emptyField}`);
                return;
            }

            // Validar ALCL
            if (!validateAlcl(senhaWeb)) {
                showErrorAlert("Por favor, insira um código ALCL válido com 12 caracteres.");
                return;
            }

            const commandData = {
                inputSlot,
                inputGpon,
                inputIndex,
                altSenhaOnu: senhaWeb.toUpperCase()
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
        <div className="card">
            <div className="card-header">
                <span className="icon">🔒</span>
                <h3>ALTERAR SENHA DE ACESSO WEB</h3>
            </div>
            <form className="form">
                <div className="form-group">
                    <label htmlFor="senhaWeb">Senha Web (ALCL)</label>
                    <input
                        id="senhaWeb"
                        type="password"
                        className="form-input"
                        value={senhaWeb}
                        onChange={(e) => setSenhaWeb(e.target.value)}
                        placeholder="Adicione a senha web (ALCL)"
                        maxLength="12"
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={handleAlterarSenhaWeb}
                >
                    🔒 Alterar senha web
                </button>
            </form>
        </div>
    );
}

export default AlterarSenhaWeb;