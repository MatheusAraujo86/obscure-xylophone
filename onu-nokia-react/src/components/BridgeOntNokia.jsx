import { useState, useEffect } from 'react';
import { useSweetAlert } from '../hooks/useSweetAlert';
import { copyToClipboard } from '../utils/validation';

/**
 * Componente para configuração de Bridge ONT Nokia
 */
function BridgeOntNokia({ posicaoData }) {
    const [bridgeData, setBridgeData] = useState({
        tipoBridge: 'rede', // Valor padrão como no script original
        portaLan: '1',
        cardType: '1',
        inputDesc1: '',
        inputDesc2: '',
        inputSernum: '',
        vlan: ''
    });

    const [comandos, setComandos] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { showSuccessAlert, showErrorAlert, showInfoAlert } = useSweetAlert();

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

    // VLANs de Rede
    const vlansRede = {
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

    // VLANs de VoIP
    const vlansVoip = {
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

    const handleInputChange = (field, value) => {
        let processedValue = value;

        // Regras específicas para cada campo
        switch (field) {
            case 'inputDesc1':
                processedValue = value.toUpperCase().replace(/\s+/g, "_").slice(0, 46);
                break;
            case 'inputDesc2':
                if (value.includes("-")) {
                    processedValue = value.toUpperCase().replace(/\s+/g, "-").slice(0, 22);
                } else {
                    processedValue = value.toLowerCase().replace(/\s+/g, "-").slice(0, 22);
                }
                break;
            case 'inputSernum':
                processedValue = value.toUpperCase();
                if (!processedValue.startsWith("ALCL:")) {
                    processedValue = processedValue.replace(/^ALCL:?/, "ALCL:");
                }
                processedValue = processedValue.slice(0, 13);
                break;
        }

        setBridgeData({ ...bridgeData, [field]: processedValue });
    };

    const handleVerificarMac = async () => {
        const { inputSlot, inputGpon, inputIndex } = posicaoData;
        const { cardType, portaLan } = bridgeData;
        
        if (!inputSlot || !inputGpon || !inputIndex) {
            showErrorAlert("⚠️ Preencha todos os campos: Slot, PON e Posição.");
            return;
        }
        
        const comando = `show vlan bridge-port-fdb 1/1/${inputSlot}/${inputGpon}/${inputIndex}/${cardType}/${portaLan}`;
        const result = await copyToClipboard(comando);
        
        if (result.success) {
            showInfoAlert("Comando para verificar MAC copiado!");
        } else {
            showErrorAlert("Erro ao copiar comando.");
        }
    };

    // Atualizar VLANs quando tipo de bridge muda ou componente monta
    useEffect(() => {
        if (bridgeData.tipoBridge && getVlanOptions().length > 0) {
            // Auto-seleciona a primeira VLAN quando tipo muda
            const firstVlan = getVlanOptions()[0]?.value;
            if (firstVlan && bridgeData.vlan !== firstVlan) {
                setBridgeData(prev => ({ ...prev, vlan: firstVlan }));
            }
        }
    }, [bridgeData.tipoBridge]);

    const getVlanOptions = () => {
        if (!bridgeData.tipoBridge) return [];
        
        const vlans = bridgeData.tipoBridge === 'voip' ? vlansVoip : vlansRede;
        
        return cidades.map(cidade => ({
            label: cidade,
            value: vlans[cidade],
            display: `${vlans[cidade]} — VLAN de ${cidade}`
        }));
    };

    const gerarComandos = () => {
        const { inputSlot, inputGpon, inputIndex } = posicaoData;
        const { tipoBridge, portaLan, cardType, inputDesc1, inputDesc2, inputSernum, vlan } = bridgeData;

        if (!tipoBridge) {
            showErrorAlert("Selecione o tipo de bridge (rede ou voip).");
            return;
        }

        if (!inputSlot || !inputGpon || !inputIndex || !inputSernum) {
            showErrorAlert("Preencha Slot, Porta PON, Posição da ONT e S°NUMBER (sernum).");
            return;
        }

        const upstreamQueue = (tipoBridge === "voip") ? "5" : "0";

        const comandosGerados = `
1° PASSO -> DESPROVISIONAR ONT:
configure equipment ont interface 1/1/${inputSlot}/${inputGpon}/${inputIndex} admin-state down
configure equipment ont no interface 1/1/${inputSlot}/${inputGpon}/${inputIndex}

2° PASSO -> PROVISIONAR ONT:
configure equipment ont interface 1/1/${inputSlot}/${inputGpon}/${inputIndex} sw-ver-pland auto desc1 ${inputDesc1} desc2 ${inputDesc2} sernum ${inputSernum} subslocid WILDCARD fec-up disable optics-hist enable sw-dnload-version disabled voip-allowed veip log-auth-pwd plain:** pland-cfgfile1 auto dnload-cfgfile1 auto planned-us-rate nominal-line-rate

configure equipment ont interface 1/1/${inputSlot}/${inputGpon}/${inputIndex} admin-state up

3° PASSO -> PORTA BRIDGE:
configure equipment ont slot 1/1/${inputSlot}/${inputGpon}/${inputIndex}/${cardType} planned-card-type ethernet plndnumdataports 4 plndnumvoiceports 0 admin-state up

configure qos interface 1/1/${inputSlot}/${inputGpon}/${inputIndex}/${cardType}/${portaLan} upstream-queue ${upstreamQueue} bandwidth-profile name:HSI_1G_UP 

configure interface port uni:1/1/${inputSlot}/${inputGpon}/${inputIndex}/${cardType}/${portaLan} admin-up
configure bridge port 1/1/${inputSlot}/${inputGpon}/${inputIndex}/${cardType}/${portaLan} max-unicast-mac 12 max-committed-mac 1
configure bridge port 1/1/${inputSlot}/${inputGpon}/${inputIndex}/${cardType}/${portaLan} vlan-id ${vlan}
configure bridge port 1/1/${inputSlot}/${inputGpon}/${inputIndex}/${cardType}/${portaLan} pvid ${vlan}

4° PASSO -> Comando TL1:
ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-30::::PARAMNAME=InternetGatewayDevice.X_ASB_COM_EthPort.EthPort.${portaLan}.isTr069Domain,PARAMVALUE=false;
        `.trim();

        setComandos(comandosGerados);
        setShowModal(true);
        showSuccessAlert("Comandos gerados com sucesso!");
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            showSuccessAlert("Comandos copiados para área de transferência!");
        }).catch(() => {
            showErrorAlert("Erro ao copiar comando.");
        });
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="card">
            <div className="card-header">
                <span className="icon">◪</span>
                <h3>BRIDGE ONT NOKIA</h3>
            </div>
            
            <form className="form">
                <div className="form-group">
                    <label htmlFor="tipoBridge">Tipo de Bridge</label>
                    <select 
                        id="tipoBridge"
                        className="form-input"
                        value={bridgeData.tipoBridge}
                        onChange={(e) => handleInputChange('tipoBridge', e.target.value)}
                    >
                        <option value="">-- Selecione --</option>
                        <option value="rede">Bridge de Rede</option>
                        <option value="voip">Bridge de VoIP</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="portaLan">Porta LAN</label>
                    <select 
                        id="portaLan"
                        className="form-input"
                        value={bridgeData.portaLan}
                        onChange={(e) => handleInputChange('portaLan', e.target.value)}
                    >
                        <option value="1">LAN 1</option>
                        <option value="2">LAN 2</option>
                        <option value="3">LAN 3</option>
                        <option value="4">LAN 4</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="cardType">Card Type</label>
                    <select 
                        id="cardType"
                        className="form-input"
                        value={bridgeData.cardType}
                        onChange={(e) => handleInputChange('cardType', e.target.value)}
                    >
                        <option value="1">Card 1</option>
                        <option value="14">Card 14</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="inputDesc1">Descrição 1 (desc1)</label>
                    <input
                        id="inputDesc1"
                        type="text"
                        className="form-input"
                        value={bridgeData.inputDesc1}
                        onChange={(e) => handleInputChange('inputDesc1', e.target.value)}
                        placeholder="Nome Completo do Cliente"
                        maxLength="46"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="inputDesc2">Descrição 2 (desc2)</label>
                    <input
                        id="inputDesc2"
                        type="text"
                        className="form-input"
                        value={bridgeData.inputDesc2}
                        onChange={(e) => handleInputChange('inputDesc2', e.target.value)}
                        placeholder="CTO ou PPPoE"
                        maxLength="22"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="inputSernum">S°NUMBER (sernum)</label>
                    <input
                        id="inputSernum"
                        type="text"
                        className="form-input"
                        value={bridgeData.inputSernum}
                        onChange={(e) => handleInputChange('inputSernum', e.target.value)}
                        placeholder="ALCL da ONT"
                        maxLength="13"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="provVLAN">VLAN Utilizada</label>
                    <select 
                        id="provVLAN"
                        className="form-input"
                        value={bridgeData.vlan}
                        onChange={(e) => handleInputChange('vlan', e.target.value)}
                        disabled={!bridgeData.tipoBridge}
                    >
                        <option value="">
                            {!bridgeData.tipoBridge ? 
                                "-- Selecione primeiro o tipo de bridge --" : 
                                "-- Selecione a VLAN --"
                            }
                        </option>
                        {getVlanOptions().map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.display}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-secondary btn-full"
                        onClick={handleVerificarMac}
                    >
                        ◈ Verificar MAC
                    </button>
                </div>

                <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={gerarComandos}
                >
                    ◪ Gerar Comandos
                </button>
            </form>

            {/* Modal de Comandos */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Comandos Gerados</h3>
                            <button className="modal-close" onClick={closeModal}>
                                ◈
                            </button>
                        </div>
                        <div className="modal-body">
                            <textarea
                                className="modal-textarea"
                                value={comandos}
                                readOnly
                                rows="20"
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    copyToClipboard(comandos);
                                }}
                            >
                                ◇ Copiar Comandos
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={closeModal}
                            >
                                ◆ Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BridgeOntNokia;