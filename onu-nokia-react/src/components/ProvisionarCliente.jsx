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
import HelpModal from './HelpModal';

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
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    
    const { showSuccessAlert, showErrorAlert } = useSweetAlert();

    // Dados de ajuda dos comandos
    const helpCommands = [
        {
            title: "PROVISIONAR CLIENTE",
            items: [
                {
                    name: "Descrição 1 (desc1)",
                    description: "Nome completo do cliente."
                },
                {
                    name: "Descrição 2 (desc2)",
                    description: "Coloque a CTO, caso não tenha, coloque o PPPoE."
                },
                {
                    name: "S°NUMBER (sernum)",
                    description: "Número de serial da ONT, como é Nokia, ALCL."
                },
                {
                    name: "Usuário PPPOE",
                    description: "Colocar o usuário PPPoE do cliente."
                },
                {
                    name: "Senha PPPOE",
                    description: "Colocar a senha do PPPoE do cliente."
                },
                {
                    name: "VLAN",
                    description: "Selecione a VLAN da cidade em que a ONT se encontra."
                }
            ]
        },
        {
            title: "PROVISIONAR ONU - COMANDOS",
            items: [
                {
                    name: "Criar e Definir Padrões da ONT",
                    command: 'ENT-ONT::ONT-1-1-1-1-1::::DESC1="Descrição 1 (desc1)",DESC2="Descrição 2 (desc2)",SERNUM="S°NUMBER (sernum)",SWVERPLND=AUTO,OPTICSHIST=ENABLE,PLNDCFGFILE1=AUTO,DLCFGFILE1=AUTO,VOIPALLOWED=VEIP;',
                    explanation: "Cria e define os padrões da ONT com descrições, número de série e configurações básicas."
                },
                {
                    name: "Ativar a ONT",
                    command: "ED-ONT::ONT-1-1-1-1-1:::::IS;",
                    explanation: "Ativa a ONT para operação."
                },
                {
                    name: "Criar Interface Lógica (ONTCARD)",
                    command: "ENT-ONTCARD::ONTCARD-1-1-1-1-1-14:::VEIP,1,0::IS;",
                    explanation: "Cria a interface lógica (ONTCARD) VEIP."
                },
                {
                    name: "Criar Porta Lógica (LOGPORT/Ethernet UNI)",
                    command: "ENT-LOGPORT::ONTL2UNI-1-1-1-1-1-14-1:::;",
                    explanation: "Cria a porta lógica Ethernet UNI."
                },
                {
                    name: "Ativar Interface VEIP",
                    command: "ED-ONTVEIP::ONTVEIP-1-1-1-1-1-14-1:::::IS;",
                    explanation: "Ativa a interface VEIP da ONT."
                },
                {
                    name: "Aplicar Perfil QoS de Upload",
                    command: "SET-QOS-USQUEUE::ONTL2UNIQ-1-1-1-1-1-14-1-0::::USBWPROFNAME=HSI_1G_UP;",
                    explanation: "Aplica o perfil QoS de upload (1 Gbps)."
                },
                {
                    name: "Limitar MACs Permitidos",
                    command: "SET-VLANPORT::ONTL2UNI-1-1-1-1-1-14-1:::MAXNUCMACADR=4,CMITMAXNUMMACADDR=1;",
                    explanation: "Limita o número de MACs permitidos na porta."
                },
                {
                    name: "Configurar VLAN",
                    command: 'ENT-VLANEGPORT::ONTL2UNI-1-1-1-1-1-14-1:::0,"VLAN":PORTTRANSMODE=SINGLETAGGED;\nENT-VLANEGPORT::ONTL2UNI-1-1-1-1-1-14-1:::0,777:PORTTRANSMODE=SINGLETAGGED;',
                    explanation: "Configura as VLANs para a porta (VLAN selecionada e VLAN 777)."
                },
                {
                    name: "Definir VLAN na WAN da ONT",
                    command: 'ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-1::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.X_CT-COM_WANGponLinkConfig.VLANIDMark,PARAMVALUE="VLAN";',
                    explanation: "Define a VLAN usada na interface WAN da ONT."
                },
                {
                    name: "Configurar Senha e Usuário PPPoE",
                    command: 'ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-2::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Username,PARAMVALUE="Usuário PPPOE";\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-3::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Password,PARAMVALUE="Senha PPPOE";',
                    explanation: "Configura o usuário e senha PPPoE para autenticação."
                },
                {
                    name: "Configurar Senha WEB",
                    command: 'ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-8::::PARAMNAME=InternetGatewayDevice.X_Authentication.WebAccount.Password,PARAMVALUE="S°NUMBER (sernum)";\nENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-1-1-1-9::::PARAMNAME=InternetGatewayDevice.X_Authentication.Account.Password,PARAMVALUE="S°NUMBER (sernum)";',
                    explanation: "Configura a senha de acesso web da ONT usando o número de série."
                }
            ]
        }
    ];

    const handleInputChange = (field, value) => {
        let processedValue = value;

        // Regras específicas para cada campo (mesmo padrão do BridgeOntNokia)
        switch (field) {
            case 'provNome': // Descrição 1 (desc1)
                processedValue = value.toUpperCase().replace(/\s+/g, "_").slice(0, 46);
                break;
            case 'provCaixa': // Descrição 2 (desc2)
                if (value.includes("-")) {
                    processedValue = value.toUpperCase().replace(/\s+/g, "-").slice(0, 22);
                } else {
                    processedValue = value.toLowerCase().replace(/\s+/g, "-").slice(0, 22);
                }
                break;
            case 'provAlcl': // S°NUMBER (sernum)
                processedValue = value.toUpperCase();
                break;
        }

        setProvData({ ...provData, [field]: processedValue });
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

            // Validar PPPoE: Se um campo for preenchido, o outro também deve ser
            if ((provPppoe && !provPass) || (!provPppoe && provPass)) {
                showErrorAlert("Se informar dados de PPPoE, preencha tanto o Usuário quanto a Senha.");
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
        <>
            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                commands={helpCommands}
            />
            <div className="card">
                <div className="card-header">
                    <span className="icon">◯</span>
                    <h3>PROVISIONAR CLIENTE</h3>
                    <button
                        type="button"
                        className="help-button"
                        onClick={() => setIsHelpModalOpen(true)}
                        title="Ajuda sobre comandos"
                    >
                        ?
                    </button>
                </div>
            <form className="form">
                <div className="form-group">
                    <label htmlFor="provNome">Descrição 1 (desc1)</label>
                    <input
                        id="provNome"
                        type="text"
                        className="form-input"
                        value={provData.provNome}
                        onChange={(e) => handleInputChange('provNome', e.target.value)}
                        placeholder="Nome Completo do Cliente"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="provCaixa">Descrição 2 (desc2)</label>
                    <input
                        id="provCaixa"
                        type="text"
                        className="form-input"
                        value={provData.provCaixa}
                        onChange={(e) => handleInputChange('provCaixa', e.target.value)}
                        placeholder="CTO ou PPPoE"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="provAlcl">S°NUMBER (sernum)</label>
                    <input
                        id="provAlcl"
                        type="text"
                        className="form-input"
                        value={provData.provAlcl}
                        onChange={(e) => handleInputChange('provAlcl', e.target.value)}
                        placeholder="ALCL da ONT"
                        maxLength="12"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="provPppoe">Usuário PPPOE (Opcional)</label>
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
                    <label htmlFor="provPass">Senha PPPOE (Opcional)</label>
                    <input
                        id="provPass"
                        type="text"
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
                    ◯ PROVISIONAR ONU
                </button>
            </form>
        </div>
        </>
    );
}

export default ProvisionarCliente;