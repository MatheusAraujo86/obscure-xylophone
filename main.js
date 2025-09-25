let inputSlot, inputGpon, inputIndex, ProvNOME, ProvCAIXA, ProvALCL, ProvPPPOE, ProvPASS,altVlan,altPppoe,altpass,nomeRede,senhaRede,altSenhaOnu,inputPesquisaAlcl,inputPesquisaNome,inputSenhaSIP,inputUsuarioSIP,inputPortaTelefone;

function capturaInputs() {
    inputSlot = document.getElementById("inputSlot").value;
    inputGpon = document.getElementById("inputGpon").value;
    inputIndex = document.getElementById("inputIndex").value;
    ProvNOME = document.getElementById("ProvNOME").value;
    ProvCAIXA = document.getElementById("ProvCAIXA").value;
    ProvALCL = document.getElementById("ProvALCL").value;
    
    ProvPPPOE = document.getElementById("ProvPPPOE").value;
    ProvPASS = document.getElementById("ProvPASS").value;
    ProvVLAN = document.getElementById("ProvVLAN").value;

    // vareaveis alterar vlan e pppoe
    altPppoe = document.getElementById("inputAlterarPPPOE").value;
    altpass = document.getElementById("inputAlterarSenha").value;

    nomeRede = document.getElementById("inputAlterarNomeWifi").value;
    senhaRede = document.getElementById("inputAlterarNomeSenha").value;
    
    altSenhaOnu =  document.getElementById("inputAlterarAlclONU").value;

    inputPesquisaAlcl =  document.getElementById("pesquisarALCL").value;
    inputPesquisaNome =  document.getElementById("pesquisarNOME").value;

    inputSenhaSIP =  document.getElementById("inputSenhaSIP").value;
    inputUsuarioSIP =  document.getElementById("inputUsuarioSIP").value;
    capPortTelefonica = document.getElementById("portaTelefonica").value;


}


const inputsInsertData = {
    inputSlot: document.getElementById("inputSlot"),
    inputGpon: document.getElementById("inputGpon"),
    inputIndex: document.getElementById("inputIndex"),
    ProvNOME: document.getElementById("ProvNOME"),
    ProvCAIXA: document.getElementById("ProvCAIXA"),
    ProvALCL: document.getElementById("ProvALCL"),
    
    ProvPPPOE: document.getElementById("ProvPPPOE"),
    ProvPASS: document.getElementById("ProvPASS"),
    ProvVLAN: document.getElementById("ProvVLAN"),

    // vareaveis alterar vlan e pppoe
    altPppoe: document.getElementById("inputAlterarPPPOE"),
    altpass: document.getElementById("inputAlterarSenha"),

    nomeRede: document.getElementById("inputAlterarNomeWifi"),
    senhaRede: document.getElementById("inputAlterarNomeSenha"),
    
    altSenhaOnu:  document.getElementById("inputAlterarAlclONU"),

    inputPesquisaAlcl:  document.getElementById("pesquisarALCL"),
    inputPesquisaNome:  document.getElementById("pesquisarNOME"),

    inputSenhaSIP:  document.getElementById("inputSenhaSIP"),
    inputUsuarioSIP:  document.getElementById("inputUsuarioSIP"),
    capPortTelefonica: document.getElementById("portaTelefonica"),
}
function capturaValorVlan (){
    capturaInputs();
    let selectElement = document.getElementById('ProvVLAN');
    let selectedValue = selectElement.value;
    return selectedValue;
}

function capturaValorVlan2 (){
    capturaInputs();
    let selectElement = document.getElementById('ProvVLAN2');
    let selectedValue = selectElement.value;
    return selectedValue;
}


function capturaValorPortaTelefonica (){
    capturaInputs();
    let selectElement = document.getElementById('portaTelefonica');
    let selectedValue = selectElement.value;
    return selectedValue;
}

function alerta(){
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Salvo na area de transferencia",
        showConfirmButton: false,
        timer: 1500
      });
}
function isNumeric(value) {
    return /^\d+$/.test(value);
}

function verificaInputsSlotGponIndex(){
    if (![inputSlot, inputGpon, inputIndex].every(isNumeric)) {
        alert('Por favor, insira apenas números. nos campos slot, pon, posição');
        return;
    };
}
    
function ProvONU() {
    capturaInputs()
    isNumeric();
     // Converte o valor do campo ALCL para caixa alta
    let comandoProvisionar = `ENT-ONT::ONT-1-1- ${inputSlot}-${inputGpon}-${inputIndex}::::DESC1="${ProvNOME}",DESC2="${ProvCAIXA}",SERNUM="${ProvALCL}",SWVERPLND=AUTO,OPTICSHIST=ENABLE,PLNDCFGFILE1=AUTO,DLCFGFILE1=AUTO,VOIPALLOWED=VEIP;ED-ONT::ONT-1-1-${inputSlot}-${inputGpon}-${inputIndex}:::::IS;ENT-ONTCARD::ONTCARD-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14:::VEIP,1,0::IS;ENT-LOGPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::;ED-ONTVEIP::ONTVEIP-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::::IS;SET-QOS-USQUEUE::ONTL2UNIQ-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1-0::::USBWPROFNAME=HSI_1G_UP;SET-VLANPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::MAXNUCMACADR=4,CMITMAXNUMMACADDR=1;ENT-VLANEGPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::0,${capturaValorVlan()}:PORTTRANSMODE=SINGLETAGGED;ENT-VLANEGPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::0,777:PORTTRANSMODE=SINGLETAGGED;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-1::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.X_CT-COM_WANGponLinkConfig.VLANIDMark,PARAMVALUE=${capturaValorVlan()};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-2::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Username,PARAMVALUE="${ProvPPPOE}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-3::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Password,PARAMVALUE="${ProvPASS}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-8::::PARAMNAME=InternetGatewayDevice.X_Authentication.WebAccount.Password,PARAMVALUE="${ProvALCL}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-9::::PARAMNAME=InternetGatewayDevice.X_Authentication.Account.Password,PARAMVALUE="${ProvALCL}";`
        // verifica se os inputs slot,porta e index são numéricos
        verificaInputsSlotGponIndex();
        // Verifica se todos os campos necessários estão preenchidos
        let requiredFields = [
            { value: inputSlot, element: document.getElementById('input1') },
            { value: inputGpon, element: document.getElementById('input2') },
            { value: inputIndex, element: document.getElementById('input3') },
            { value: ProvNOME, element: document.getElementById('ProvNOME') },
            { value: ProvCAIXA, element: document.getElementById('ProvCAIXA') },
            { value: ProvALCL, element: document.getElementById('ProvALCL') },
            { value: ProvPPPOE, element: document.getElementById('ProvPPPOE') },
            { value: ProvVLAN, element: document.getElementById('ProvVLAN') }
        ];

        for (let field of requiredFields) {
            if (field.value.trim() === '') {
                alert('É necessário preencher todos os campos para provisionar um equipamento.');
                field.element.focus();
                return;
            }
        }


        if (ProvALCL.length !== 12) {
            alert("Por favor, insira um código ALCL válido com 12 caracteres."); 
            return;    
        }
       
       
         // Copia o comando para a área de transferência
        navigator.clipboard.writeText(comandoProvisionar)
                .then(() => {
                    alerta(); // Supondo que 'alerta' seja uma função definida em outro lugar
                    console.log('Texto copiado para a área de transferência:', comandoProvisionar);
                })
                .catch(err => {
                    console.error('Erro ao copiar texto: ', err);
                });

    
};

function buttonPESQUISA() {
    capturaInputs()
    
    if(inputPesquisaNome != ""){
        let comandoAlterar =`show equipment ont status pon | match exact:${inputPesquisaNome}`
        navigator.clipboard.writeText(comandoAlterar)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandoAlterar);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandoAlterar);

        return;
    }else if(inputPesquisaAlcl != ""){
        inputPesquisaAlcl.trim();
        if (inputPesquisaAlcl.length !== 12) {
            alert("Por favor, insira um código ALCL válido com 12 caracteres.");
            return;
        }else{
            let formattedALCL = inputPesquisaAlcl.substring(0, 4) + ':' + inputPesquisaAlcl.substring(4);
            let command = `show equipment ont index sn:${formattedALCL}`;
            navigator.clipboard.writeText(command)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', command);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(command);
        }   
    }
    
    function formatALCL() {
        // Capturar o valor do input
        inputPesquisaAlcl.trim();

        // Validar o input para garantir que tem pelo menos 12 caracteres
        if (inputPesquisaAlcl.length !== 12) {
            alert("Por favor, insira um código ALCL válido com 12 caracteres.");
            return;
        }

        // Inserir os dois pontos na posição correta
        let formattedALCL = inputPesquisaAlcl.substring(0, 4) + ':' + inputPesquisaAlcl.substring(4);

        // Montar a string final para a consulta
        let command = `show equipment ont index sn:${formattedALCL}`;

        // Exibir ou utilizar o comando conforme necessário
        console.log(command);
        alert(command); // Apenas para demonstração
    }


//     function pesquisarPorAlcl(){
//         let trataALCL = inputPesquisaAlcl;
//         console.log(trataALCL);
//         let  comandoAlterar = `show equipment ont index sn:ALCL:FCB0A020`
//         return trataALCL
//     }
//    pesquisarPorAlcl()
}
function verificarFibra(){
    capturaInputs();
    isNumeric();
    const comandOptics = `show equipment ont optics 1/1/${inputSlot}/${inputGpon}/${inputIndex}`
    if (![inputSlot, inputGpon,inputIndex].every(isNumeric)) {
        alert('Por favor, insira apenas números. nos campos slot, pon, posição');
        return;
    }
    if (inputSlot == "" || inputGpon == "" || inputIndex =="") {
        window.alert(`é necessário adicionar Slot e Pon e posição para pesquisar a fibra`)
        return;
    } else {
        navigator.clipboard.writeText(comandOptics)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandOptics);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandOptics);
    };

}
const buttonPESQUISAPON = () => {
    capturaInputs();
    isNumeric();
    const comandPON = `show equipment ont status pon 1/1/${inputSlot}/${inputGpon}`
    

    if (inputSlot == "" || inputGpon == "") {
        window.alert(`é necessário adicionar Slot e Porta para pesquisar a PON`)
        return;
    } else {
        navigator.clipboard.writeText(comandPON)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandPON);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandPON);
    };
};

function buttonALARM() {
    capturaInputs();
    isNumeric();
    let pesquisaAlarmes = `show equipment ont operational-data 1/1/${inputSlot}/${inputGpon}/${inputIndex} detail`

    if (![inputSlot, inputGpon, inputIndex].every(isNumeric)) {
        alert('Por favor, insira apenas números. nos campos slot, pon, posição');
        return;
    }
    
    if (inputSlot == "" || inputGpon == "" || inputIndex =="") {
        window.alert(`é necessário adicionar Slot e Porta e Posição para pesquisar os alarmes`)
        return;
    } else {
        navigator.clipboard.writeText(pesquisaAlarmes)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', pesquisaAlarmes);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(pesquisaAlarmes);
    };
};

function desprovisionarONU(){
    capturaInputs()
    isNumeric();
    let comandoDesprovisionar =`ED-ONT::ONT-1-1-${inputSlot}-${inputGpon}-${inputIndex}:::::OOS;DLT-ONT::ONT-1-1-${inputSlot}-${inputGpon}-${inputIndex}::;`

    if (![inputSlot, inputGpon, inputIndex].every(isNumeric)) {
        alert('Por favor, insira apenas números. nos campos slot, pon, posição');
        return;
    }
    
    if (inputSlot == "" || inputGpon == "" || inputIndex =="") {
        window.alert(`é necessário adicionar Slot e Porta e Posição para desprovisionar a ONU`)
        return;
    } else {
        navigator.clipboard.writeText(comandoDesprovisionar)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandoDesprovisionar);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandoDesprovisionar);
    };
}

function alterarVlanPppoe(){
    capturaInputs()
    capturaValorVlan2();
    isNumeric();
    let comandoAlterar = `DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-1;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-2;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-3;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-1::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.X_CT-COM_WANGponLinkConfig.VLANIDMark,PARAMVALUE=${capturaValorVlan2()};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-2::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Username,PARAMVALUE="${altPppoe}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-3::::PARAMNAME=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Password,PARAMVALUE="${altpass}";`
    
    if (![inputSlot, inputGpon, inputIndex].every(isNumeric)) {
        alert('Por favor, insira apenas números. nos campos slot, pon, posição');
        return;
    }
    if (inputSlot == "" || inputGpon == "" || inputIndex =="" || altPppoe == '' || altpass == '') {
        window.alert(`é necessário adicionar Slot,Pon,Index,PPPOE:nome e senha,VLAN`)
        return;
    } else {
        navigator.clipboard.writeText(comandoAlterar)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandoAlterar);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandoAlterar);
    };
}

function alterarNomeESenhaDaRede(){
    capturaInputs()
    isNumeric();

    if (![inputSlot, inputGpon, inputIndex].every(isNumeric)) {
        alert('Por favor, insira apenas números. nos campos slot, pon, posição');
        return;
    }
    let comandoAlterar = `DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-4;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-5;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-6;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-7;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-4::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID,PARAMVALUE="${nomeRede}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-5::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey,PARAMVALUE="${senhaRede}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-6::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.SSID,PARAMVALUE="${nomeRede}_5G";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-7::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.PreSharedKey,PARAMVALUE="${senhaRede}";`

    if (inputSlot == "" || inputGpon == "" || inputIndex =="" || nomeRede == '' || senhaRede == '') {
        window.alert(`é necessário adicionar Slot,Porta,Index, nome e senha para alterar`)
        return;
    }else if(senhaRede.length < 8){
        alert('A senha deve conter pelo menos 8 caracteres.');
        return;
    } 
     else {
        navigator.clipboard.writeText(comandoAlterar)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandoAlterar);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandoAlterar);
    };
}

function alterarSenhaDaRede(){
    capturaInputs()
    isNumeric();

    if (![inputSlot, inputGpon, inputIndex].every(isNumeric)) {
        alert('Por favor, insira apenas números. nos campos slot, pon, posição');
        return;
    }
    let comandoAlterar = `DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-5;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-7;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-5::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey,PARAMVALUE="${senhaRede}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-7::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.PreSharedKey.1.PreSharedKey,PARAMVALUE="${senhaRede}";`
    if (inputSlot == "" || inputGpon == "" || inputIndex =="" || senhaRede == '') {
        window.alert(`é necessário adicionar Slot,Porta,Index e senha para alterar`)
        return;
    } else if(senhaRede.length < 8){
        alert('A senha deve conter pelo menos 8 caracteres.');
        return;
    } else{
        navigator.clipboard.writeText(comandoAlterar)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandoAlterar);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandoAlterar);
    };
}


function alterarNomeDaRede(){
    capturaInputs()
    isNumeric();

    if (![inputSlot, inputGpon, inputIndex].every(isNumeric)) {
        alert('Por favor, insira apenas números. nos campos slot, pon, posição');
        return;
    }
    let comandoAlterar = `DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-4;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-6;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-4::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID,PARAMVALUE="${nomeRede}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-6::::PARAMNAME=InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.SSID,PARAMVALUE="${nomeRede}_5G";`
    if (inputSlot == "" || inputGpon == "" || inputIndex =="") {
        window.alert(`é necessário adicionar Slot,Porta,Index e senha para alterar`)
        return;
    } else if(nomeRede == ''){
        window.alert('é necessario adicionar o novo nome da rede')
    }
    else{
        navigator.clipboard.writeText(comandoAlterar)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandoAlterar);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandoAlterar);
    };
}



function alterarSenhaOnu(){
    capturaInputs();
    isNumeric();

    if (![inputSlot, inputGpon, inputIndex].every(isNumeric)) {
        alert('Por favor, insira apenas números. nos campos slot, pon, posição');
        return;
    }
    let comandoAlterar = `DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-8;DLT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-9;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-8::::PARAMNAME=InternetGatewayDevice.X_Authentication.WebAccount.Password,PARAMVALUE="${altSenhaOnu}";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-9::::PARAMNAME=InternetGatewayDevice.X_Authentication.Account.Password,PARAMVALUE="${altSenhaOnu}";`
    
    if (inputSlot == "" || inputGpon == "" || inputIndex == "" || altSenhaOnu == "") {
        window.alert("É necessário adicionar Slot, Porta, Index e senha (ALCL) para alterar");
    } else {
        if (altSenhaOnu.length !== 12) {
            alert("Por favor, insira um código ALCL válido com 12 caracteres.");
        } else {
            navigator.clipboard.writeText(comandoAlterar)
                .then(() => {
                    alerta();
                    console.log('Texto copiado para a área de transferência:', comandoAlterar);
                })
                .catch(err => {
                    console.error('Erro ao copiar texto: ', err);
                });
        }
    }
    
}

function reiniciarONU(){
    isNumeric();

    if (![inputSlot, inputGpon, inputIndex].every(isNumeric)) {
        alert('Por favor, insira apenas números. nos campos slot, pon, posição');
        return;
    }
    capturaInputs();
    let comandoAlterar = `
    INIT-SYS::ONT-1-1-${inputSlot}-${inputGpon}-${inputIndex}:::11;
    `
    if (inputSlot == "" || inputGpon == "" || inputIndex =="") {
        window.alert(`é necessário adicionar Slot,Porta,Index para reiniciar a ONU`)
        return;
    } else {
        navigator.clipboard.writeText(comandoAlterar)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandoAlterar);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandoAlterar);
    };
}

function onuSolicitandoProvisionamento(){

    capturaInputs();
    let comandoAlterar = `show pon unprovision-onu` 

    navigator.clipboard.writeText(comandoAlterar)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandoAlterar);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandoAlterar);
}


function provisionarTelefone(){
    capturaInputs()
    isNumeric();
    if (![inputSlot, inputGpon, inputIndex].every(isNumeric)) {
        alert('Por favor, insira apenas números. nos campos slot, pon, posição');
        return;
    }
    let portaTelefonica = capturaValorPortaTelefonica()
    console.log()

   if(inputSlot == "" || inputGpon =="" || inputIndex ==""){
    window.alert(`é necessário adicionar Slot,Porta,Index para reiniciar a ONU`)
    return;
   }
   if(portaTelefonica == "1"){
        let comandoAlterar  = `SET-QOS-USQUEUE::ONTL2UNIQ-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1-5::::USBWPROFNAME=HSI_1G_UP;ENT-VLANEGPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::0,300:PORTTRANSMODE=SINGLETAGGED;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-10::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-11::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-12::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-13::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.UserAgentDomain,PARAMVALUE="sip.solucaonetwork.com";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.Enable,PARAMVALUE=Enabled;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-15::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.DirectoryNumber,PARAMVALUE=${inputUsuarioSIP};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-16::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.SIP.AuthUserName,PARAMVALUE=${inputUsuarioSIP};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-17::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.SIP.AuthPassword,PARAMVALUE=${inputSenhaSIP};`
    navigator.clipboard.writeText(comandoAlterar)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandoAlterar);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandoAlterar);
        return;
    }else if(portaTelefonica == 2){
        let comandoAlterar  = `SET-QOS-USQUEUE::ONTL2UNIQ-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1-5::::USBWPROFNAME=HSI_1G_UP;ENT-VLANEGPORT::ONTL2UNI-1-1-${inputSlot}-${inputGpon}-${inputIndex}-14-1:::0,300:PORTTRANSMODE=SINGLETAGGED;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-23::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.OutboundProxy,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-24::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.ProxyServer,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-25::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.RegistrarServer,PARAMVALUE=10.255.0.1;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-26::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.SIP.UserAgentDomain,PARAMVALUE="sip.solucaonetwork.com";ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-27::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.Enable,PARAMVALUE=Enabled;ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-28::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.DirectoryNumber,PARAMVALUE=${inputUsuarioSIP};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-29::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.SIP.AuthUserName,PARAMVALUE=${inputUsuarioSIP};ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${inputSlot}-${inputGpon}-${inputIndex}-30::::PARAMNAME=InternetGatewayDevice.Services.VoiceService.1.VoiceProfile.1.Line.${portaTelefonica}.SIP.AuthPassword,PARAMVALUE=${inputSenhaSIP};`
    
        navigator.clipboard.writeText(comandoAlterar)
            .then(() => {
                alerta()
                console.log('Texto copiado para a área de transferência:', comandoAlterar);
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

        navigator.clipboard.writeText(comandoAlterar);
        return;
    }else{
        window.alert("insira uma porta de telefone valida 1 ou 2, necessário inserir Slot e Porta e Posição ")
    }
    
}

function testBridge(){
    capturaInputs();
    let port;
    let comando = `

        configure equipment ont interface 1/1/${inputSlot}/${inputGpon}/${inputIndex}sw-ver-pland auto desc1 SITELBRA_SISTEMA_DE_TELECOMUNICAES_DO_BRASIL_LTDA desc2 sitelbrasltda43 sernum ALCL:B3FA5C55 subslocid WILDCARD fec-up disable optics-hist enable sw-dnload-version disabled voip-allowed veip log-auth-pwd plain:** pland-cfgfile1 auto dnload-cfgfile1 auto planned-us-rate nominal-line-rate

        configure equipment ont interface 1/1/${inputSlot}/${inputGpon}/${inputIndex} admin-state up


        configure equipment ont slot 1/1/${inputSlot}/${inputGpon}/${inputIndex}/${port} planned-card-type ethernet plndnumdataports ${port} plndnumvoiceports 0 admin-state up

        configure qos interface 1/1/${inputSlot}/${inputGpon}/${inputIndex}/1/${port} upstream-queue 0 bandwidth-profile name:HSI_1G_UP
        configure interface port uni:1/1/${inputSlot}/${inputGpon}/${inputIndex}/1/${port} admin-up		
        configure bridge port 1/1/${inputSlot}/${inputGpon}/${inputIndex}/1/${port} max-unicast-mac 12 max-committed-mac 1		
        configure bridge port 1/1/${inputSlot}/${inputGpon}/${inputIndex}/1/${port} vlan-id 2821
        configure bridge port 1/1/${inputSlot}/${inputGpon}/${inputIndex}/1/${port} pvid 2821

            
            `
}