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
        const newPosicao = { ...posicao, [field]: value };
        setPosicao(newPosicao);
        if (onPosicaoChange) {
            onPosicaoChange(newPosicao);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <span className="icon">📍</span>
                <h3>POSIÇÃO DO CLIENTE</h3>
            </div>
            <form className="form">
                <div className="form-group">
                    <label htmlFor="inputSlot">Slot GPON</label>
                    <input
                        id="inputSlot"
                        type="text"
                        className="form-input"
                        value={posicao.inputSlot}
                        onChange={(e) => handleInputChange('inputSlot', e.target.value)}
                        placeholder="Slot GPON"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="inputGpon">Porta PON</label>
                    <input
                        id="inputGpon"
                        type="text"
                        className="form-input"
                        value={posicao.inputGpon}
                        onChange={(e) => handleInputChange('inputGpon', e.target.value)}
                        placeholder="Porta PON"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="inputIndex">Posição da ONT</label>
                    <input
                        id="inputIndex"
                        type="text"
                        className="form-input"
                        value={posicao.inputIndex}
                        onChange={(e) => handleInputChange('inputIndex', e.target.value)}
                        placeholder="Posição da ONT"
                    />
                </div>
            </form>
        </div>
    );
}

export default PosicaoCliente;