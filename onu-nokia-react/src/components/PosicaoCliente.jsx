import { useState } from 'react';

/**
 * Componente para capturar a posição do cliente (Slot, Porta PON, Posição ONT)
 */
function PosicaoCliente({ onPosicaoChange }) {
    const [posicao, setPosicao] = useState({
        inputSlot: '',
        inputGpon: '',
        inputIndex: ''
    });

    const handleInputChange = (field, value) => {
        let processedValue = value;
        
        // Aplicar validação numérica baseada no script.js original
        switch (field) {
            case 'inputSlot':
                // Remove tudo que não for número e limita a 2 caracteres
                processedValue = value.replace(/\D/g, "").slice(0, 2);
                break;
            case 'inputGpon':
                // Remove tudo que não for número e limita a 2 caracteres
                processedValue = value.replace(/\D/g, "").slice(0, 2);
                break;
            case 'inputIndex':
                // Remove tudo que não for número e limita a 3 caracteres
                processedValue = value.replace(/\D/g, "").slice(0, 3);
                break;
            default:
                processedValue = value;
        }
        
        const newPosicao = { ...posicao, [field]: processedValue };
        setPosicao(newPosicao);
        if (onPosicaoChange) {
            onPosicaoChange(newPosicao);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <span className="icon">◎</span>
                <h3>POSIÇÃO DO CLIENTE</h3>
            </div>
            <form className="form">
                <div className="form-group">
                    <label htmlFor="inputSlot">Slot GPON</label>
                    <input
                        id="inputSlot"
                        type="tel"
                        className="form-input"
                        value={posicao.inputSlot}
                        onChange={(e) => handleInputChange('inputSlot', e.target.value)}
                        placeholder="Slot GPON"
                        maxLength="2"
                        pattern="[0-9]{1,2}"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="inputGpon">Porta PON</label>
                    <input
                        id="inputGpon"
                        type="tel"
                        className="form-input"
                        value={posicao.inputGpon}
                        onChange={(e) => handleInputChange('inputGpon', e.target.value)}
                        placeholder="Porta PON"
                        maxLength="2"
                        pattern="[0-9]{1,2}"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="inputIndex">Posição da ONT</label>
                    <input
                        id="inputIndex"
                        type="tel"
                        className="form-input"
                        value={posicao.inputIndex}
                        onChange={(e) => handleInputChange('inputIndex', e.target.value)}
                        placeholder="Posição da ONT"
                        maxLength="3"
                        pattern="[0-9]{1,3}"
                    />
                </div>
            </form>
        </div>
    );
}

export default PosicaoCliente;