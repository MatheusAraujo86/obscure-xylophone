import { useState } from 'react';
import { provisionarONTTelefonia } from '../services/onuService';
import { 
    areAllNumeric, 
    validateAlcl, 
    validateRequiredFields, 
    copyToClipboard 
} from '../utils/validation';
import { useSweetAlert } from '../hooks/useSweetAlert';

/**
 * Componente para provisionar ONT apenas com telefonia
 */
function ProvisionarOntTelefonia({ posicaoData }) {
    // Lista de cidades
    const cidades = [
        "NOVA ANDRADINA - MS",
        "MANDAGUAÇU - PR", 
        "NOVA ESPERANÇA - PR",
        "TERRA RICA - PR",
        "PAIÇANDU - PR",
        "PARANAVAÍ - PR",
        "MARINGÁ - PR",
        "NOVA ALIANÇA - PR",
        "DOURADOS - MS",
        "IVINHEMA - MS",
        "BAYTAPORÃ - MS"
    ];

    // VLANs de Internet (Rede)
    const vlansInternet = {
        "NOVA ANDRADINA - MS": "2800",
        "MANDAGUAÇU - PR": "2710",
        "NOVA ESPERANÇA - PR": "2820",
        "TERRA RICA - PR": "2714",
        "PAIÇANDU - PR": "2821",
        "PARANAVAÍ - PR": "2700",
        "MARINGÁ - PR": "2760",
        "NOVA ALIANÇA - PR": "3050",
        "DOURADOS - MS": "2750",
        "IVINHEMA - MS": "2869",
        "BAYTAPORÃ - MS": "2825"
    };

    // VLANs de Telefonia (VoIP) - Mesmo padrão do BridgeOntNokia
    const vlansTelefonia = {
        "NOVA ANDRADINA - MS": "300",
        "MANDAGUAÇU - PR": "300",
        "NOVA ESPERANÇA - PR": "300",
        "TERRA RICA - PR": "300",
        "PAIÇANDU - PR": "300",
        "PARANAVAÍ - PR": "300",
        "MARINGÁ - PR": "300",
        "NOVA ALIANÇA - PR": "201",
        "DOURADOS - MS": "300",
        "IVINHEMA - MS": "300",
        "BAYTAPORÃ - MS": "300"
    };
    const [telefoniaData, setTelefoniaData] = useState({
        desc1: '',
        desc2: '', 
        sernum: '',
        telefone: '',
        senhaVoip: '',
        cidadeSelecionada: ''
    });
    
    const { showSuccessAlert, showErrorAlert } = useSweetAlert();

    const getVlanOptions = () => {
        return cidades.map(cidade => ({
            label: cidade,
            valueInternet: vlansInternet[cidade],
            valueTelefonia: vlansTelefonia[cidade],
            display: `Internet: ${vlansInternet[cidade]} | Telefonia: ${vlansTelefonia[cidade]} — ${cidade}`
        }));
    };

    const getVlansFromCidade = (cidade) => {
        return {
            vlanInternet: vlansInternet[cidade] || '2800',
            vlanTelefonia: vlansTelefonia[cidade] || '300'
        };
    };

    const handleInputChange = (field, value) => {
        let processedValue = value;

        // Regras específicas para cada campo (mesmo padrão do BridgeOntNokia)
        switch (field) {
            case 'desc1': // Descrição 1 (desc1)
                processedValue = value.toUpperCase().replace(/\s+/g, "_").slice(0, 46);
                break;
            case 'desc2': // Descrição 2 (desc2)
                if (value.includes("-")) {
                    processedValue = value.toUpperCase().replace(/\s+/g, "-").slice(0, 22);
                } else {
                    processedValue = value.toLowerCase().replace(/\s+/g, "-").slice(0, 22);
                }
                break;
            case 'sernum': // S°NUMBER (sernum)
                processedValue = value.toUpperCase();
                break;
        }

        setTelefoniaData({ ...telefoniaData, [field]: processedValue });
    };

    const handleProvisionar = async () => {
        try {
            // Verificar se posicaoData existe
            if (!posicaoData) {
                showErrorAlert('Dados de posição não encontrados. Verifique se os campos Slot, PON e Posição estão preenchidos.');
                return;
            }

            const { inputSlot, inputGpon, inputIndex } = posicaoData;
            const { desc1, desc2, sernum, telefone, senhaVoip, cidadeSelecionada } = telefoniaData;

            // Verificar se os campos de posição existem
            if (!inputSlot || !inputGpon || !inputIndex) {
                showErrorAlert('Por favor, preencha os campos de posição (Slot, PON, Posição) no componente superior.');
                return;
            }

            // Obter VLANs baseadas na cidade selecionada
            const { vlanInternet, vlanTelefonia } = getVlansFromCidade(cidadeSelecionada);

            // Validar campos numéricos (posição + VLANs são automaticamente válidas)
            if (!areAllNumeric([inputSlot, inputGpon, inputIndex])) {
                showErrorAlert('Por favor, insira apenas números nos campos slot, pon, posição');
                return;
            }

            // Validar ALCL
            if (!validateAlcl(sernum)) {
                showErrorAlert('ALCL deve ter exatamente 12 caracteres');
                return;
            }

            // Validar campos obrigatórios
            const requiredFields = [
                { value: inputSlot, name: 'Slot' },
                { value: inputGpon, name: 'Porta PON' },
                { value: inputIndex, name: 'Posição' },
                { value: desc1, name: 'Descrição 1' },
                { value: desc2, name: 'Descrição 2' },
                { value: sernum, name: 'ALCL' },
                { value: telefone, name: 'Número do Telefone' },
                { value: senhaVoip, name: 'Senha VoIP' },
                { value: cidadeSelecionada, name: 'Cidade/VLANs' }
            ];

            const validation = validateRequiredFields(requiredFields);
            if (!validation.isValid) {
                showErrorAlert(`Por favor, preencha o campo: ${validation.emptyField}`);
                return;
            }

            // Gerar comandos
            const comandos = provisionarONTTelefonia({
                slot: inputSlot,
                gpon: inputGpon, 
                index: inputIndex,
                desc1,
                desc2,
                sernum,
                telefone,
                senhaVoip,
                vlanInternet,
                vlanTelefonia
            });

            if (!comandos || !comandos.comandos1 || !comandos.comandos2) {
                showErrorAlert('Erro ao gerar comandos de provisionamento');
                return;
            }

            const comandosCompletos = comandos.comandos1 + comandos.comandos2;
            
            // Copiar para clipboard
            const result = await copyToClipboard(comandosCompletos);
            if (result.success) {
                showSuccessAlert('Comandos de provisionamento copiados para a área de transferência!');
            } else {
                showErrorAlert('Erro ao copiar comandos para a área de transferência');
                console.error('Erro no clipboard:', result.error);
            }

        } catch (error) {
            console.error('Erro ao provisionar ONT:', error);
            showErrorAlert('Erro ao provisionar ONT: ' + error.message);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <span className="icon">◐</span>
                <h3>PROVISIONAR ONT - APENAS TELEFONIA</h3>
            </div>
            <form className="form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="desc1">Descrição 1 (desc1)</label>
                        <input
                            id="desc1"
                            type="text"
                            className="form-input"
                            value={telefoniaData.desc1}
                            onChange={(e) => handleInputChange('desc1', e.target.value)}
                            placeholder="Nome Completo do Cliente"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="desc2">Descrição 2 (desc2)</label>
                        <input
                            id="desc2"
                            type="text"
                            className="form-input"
                            value={telefoniaData.desc2}
                            onChange={(e) => handleInputChange('desc2', e.target.value)}
                            placeholder="CTO ou PPPoE"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="sernum">S°NUMBER (sernum)</label>
                        <input
                            id="sernum"
                            type="text"
                            className="form-input"
                            value={telefoniaData.sernum}
                            onChange={(e) => handleInputChange('sernum', e.target.value)}
                            placeholder="ALCL da ONT"
                            maxLength="12"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefone">Número do Telefone</label>
                        <input
                            id="telefone"
                            type="text"
                            className="form-input"
                            value={telefoniaData.telefone}
                            onChange={(e) => handleInputChange('telefone', e.target.value)}
                            placeholder="99999999"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="senhaVoip">Senha VoIP</label>
                    <input
                        id="senhaVoip"
                        type="password"
                        className="form-input"
                        value={telefoniaData.senhaVoip}
                        onChange={(e) => handleInputChange('senhaVoip', e.target.value)}
                        placeholder="Senha para autenticação VoIP"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cidadeSelecionada">VLANs por Cidade</label>
                    <select 
                        id="cidadeSelecionada"
                        className="form-input"
                        value={telefoniaData.cidadeSelecionada}
                        onChange={(e) => handleInputChange('cidadeSelecionada', e.target.value)}
                    >
                        <option value="">-- Selecione a cidade --</option>
                        {getVlanOptions().map((option, index) => (
                            <option key={index} value={option.label}>
                                {option.display}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="button-group">
                    <button
                        type="button"
                        className="btn btn-primary btn-full"
                        onClick={handleProvisionar}
                    >
                        PROVISIONAR ONT TELEFONIA
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProvisionarOntTelefonia;