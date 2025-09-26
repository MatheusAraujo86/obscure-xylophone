// =====================
// script.js
// =====================


// Lista (ordem) das cidades/labels que aparecem no select
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


// Mapeamento das VLANs de REDE (valores originais do seu HTML)
const vlansRede = {
  "NOVA ANDRADINA - MS": "2800",
  "MANDAGUAÇU - PR":    "2710",
  "NOVA ESPERANÇA - PR": "2820",
  "TERRA RICA - PR":     "2714",
  "PAIÇANDU - PR":       "2821",
  "PARANAVAÍ - PR":      "2700",
  "MARINGÁ - PR":        "2760",
  "NOVA ALIANÇA - PR":   "3050",
  "DOURADOS - MS":       "2750",
  "IVINHEMA - MS":       "2869",
  "BAYTAPORÃ - MS":      "2825"
};


// Mapeamento das VLANs de VOIP
const vlansVoip = {
  "NOVA ANDRADINA - MS": "300",
  "MANDAGUAÇU - PR":    "300",
  "NOVA ESPERANÇA - PR": "300",
  "TERRA RICA - PR":     "300",
  "PAIÇANDU - PR":       "300",
  "PARANAVAÍ - PR":      "300",
  "MARINGÁ - PR":        "300",
  "NOVA ALIANÇA - PR":   "201",
  "DOURADOS - MS":       "300",
  "IVINHEMA - MS":       "300",
  "BAYTAPORÃ - MS":      "300"
};


// Função que atualiza o select de VLANs de acordo com o tipo selecionado
function atualizarVlans() {
  const tipo = document.getElementById("tipoBridge").value; // 'rede' | 'voip' | ''
  const select = document.getElementById("ProvVLAN");


  // Limpa
  select.innerHTML = "";


  // Se não escolheu tipo, não popula (ou popula com REDE por padrão)
  if (!tipo) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "-- Selecione primeiro o tipo de bridge --";
    select.appendChild(opt);
    return;
  }


  // Preenche na ordem do array "cidades"
  cidades.forEach(label => {
    const valorRede = vlansRede[label];
    const valorVoip = vlansVoip[label];
    // se voip não estiver definido, faz fallback para rede
    const chosenValue = (tipo === "voip") ? (valorVoip ?? valorRede) : valorRede;

    const option = document.createElement("option");
    option.value = chosenValue;
    option.textContent = `${chosenValue} — VLAN de ${label}`;
    select.appendChild(option);
  });
}


// Função que monta e exibe os comandos (chamada pelo botão "Gerar Comandos")
function gerarComandos() {
  const tipo = document.getElementById("tipoBridge").value; // rede ou voip
  const slot = document.getElementById("inputSlot").value.trim();
  const pon = document.getElementById("inputGpon").value.trim();
  const pos = document.getElementById("inputIndex").value.trim();
  const portaLAN = document.getElementById("portaLan").value;
  const cardType = document.getElementById("CardType").value;
  const desc1 = document.getElementById("inputDesc1").value.trim();
  const desc2 = document.getElementById("inputDesc2").value.trim();
  const sernum = document.getElementById("inputSernum").value.trim();
  const vlan = document.getElementById("ProvVLAN").value;


  // validação básica
  if (!tipo) return alert("Selecione o tipo de bridge (rede ou voip).");
  if (!slot || !pon || !pos || !sernum) return alert("Preencha Slot, Porta PON, Posição da ONT e S°NUMBER (sernum).");

  const upstreamQueue = (tipo === "voip") ? "5" : "0";

  const comandos = `
1° PASSO -> DESPROVISIONAR ONT:
configure equipment ont interface 1/1/${slot}/${pon}/${pos} admin-state down
configure equipment ont no interface 1/1/${slot}/${pon}/${pos}

2° PASSO -> PROVISIONAR ONT:
configure equipment ont interface 1/1/${slot}/${pon}/${pos} sw-ver-pland auto desc1 ${desc1} desc2 ${desc2} sernum ${sernum} subslocid WILDCARD fec-up disable optics-hist enable sw-dnload-version disabled voip-allowed veip log-auth-pwd plain:** pland-cfgfile1 auto dnload-cfgfile1 auto planned-us-rate nominal-line-rate

configure equipment ont interface 1/1/${slot}/${pon}/${pos} admin-state up

3° PASSO -> PORTA BRIDGE:
configure equipment ont slot 1/1/${slot}/${pon}/${pos}/${cardType} planned-card-type ethernet plndnumdataports 4 plndnumvoiceports 0 admin-state up

configure qos interface 1/1/${slot}/${pon}/${pos}/${cardType}/${portaLAN} upstream-queue ${upstreamQueue} bandwidth-profile name:HSI_1G_UP 

configure interface port uni:1/1/${slot}/${pon}/${pos}/${cardType}/${portaLAN} admin-up
configure bridge port 1/1/${slot}/${pon}/${pos}/${cardType}/${portaLAN} max-unicast-mac 12 max-committed-mac 1
configure bridge port 1/1/${slot}/${pon}/${pos}/${cardType}/${portaLAN} vlan-id ${vlan}
configure bridge port 1/1/${slot}/${pon}/${pos}/${cardType}/${portaLAN} pvid ${vlan}

4° PASSO -> Comando TL1:
ENT-HGUTR069-SPARAM::HGUTR069SPARAM-1-1-${slot}-${pon}-${pos}-30::::PARAMNAME=InternetGatewayDevice.X_ASB_COM_EthPort.EthPort.${portaLAN}.isTr069Domain,PARAMVALUE=false;
  `.trim();

  document.getElementById("output").value = comandos;
}


// Popula o select com REDE por padrão ao abrir (opcional)
window.addEventListener("DOMContentLoaded", () => {
  // Se quiser que a página abra sem nada selecionado, comente a próxima linha
  document.getElementById("tipoBridge").value = "rede";
  atualizarVlans();
});

// Função para realizar as consultas de MAC e VLAN apenas quando as informações estiverem completas
function getPath() {
  let slot = document.getElementById("inputSlot").value.trim();
  let pon = document.getElementById("inputGpon").value.trim();
  let pos = document.getElementById("inputIndex").value.trim();
  let cardType = document.getElementById("CardType").value.trim();
  let portaLAN = document.getElementById("portaLan").value.trim();

  // Verifica se algum campo está vazio
  if (!slot || !pon || !pos || !cardType || !portaLAN) {
    return null; // retorna nulo se tiver incompleto
  }

  return `${slot}/${pon}/${pos}/${cardType}/${portaLAN}`;
}

function verificarMac() {
  let path = getPath();
  if (!path) {
    alert("⚠️ Preencha todos os campos: Slot, PON, Posição, CardType e PortaLAN.");
    return;
  }
  let comando = `info configure equipment ont interface 1/1/${path}`;
  navigator.clipboard.writeText(comando);
  alert("Comando de MAC copiado:\n\n" + comando);
}

function verificarVlan() {
  let path = getPath();
  if (!path) {
    alert("⚠️ Preencha todos os campos: Slot, PON, Posição, CardType e PortaLAN.");
    return;
  }
  let comando = `info configure bridge port 1/1/${path}`;
  navigator.clipboard.writeText(comando);
  alert("Comando de VLAN copiado:\n\n" + comando);
}

// Regra para forçar ALCL:XXXXXXXX
document.getElementById("inputSernum").addEventListener("input", function() {
  // força maiúsculo
  let valor = this.value.toUpperCase();

  // garante prefixo ALCL:
  if (!valor.startsWith("ALCL:")) {
    valor = valor.replace(/^ALCL:?/, "ALCL:"); 
  }

  // remove qualquer caractere extra depois dos 8 últimos
  valor = valor.slice(0, 13);

  this.value = valor;
});
 

// Força o campo Desc1 a ficar sempre em MAIÚSCULO, substituir espaços por "_" e limitar a 42 caracteres
document.getElementById("inputDesc1").addEventListener("input", function() {
  this.value = this.value.toUpperCase().replace(/\s+/g, "_").slice(0, 46);
});


// Força o campo Desc2 a ficar sempre em MAIÚSCULO (se tiver "-") ou minúsculo (se for PPPoE),
// substitui espaços por "-" e limita a 16 caracteres
document.getElementById("inputDesc2").addEventListener("input", function() {
  let valor = this.value;

  if (valor.includes("-")) {
    // Caso seja um código (já tem "-")
    this.value = valor.toUpperCase().replace(/\s+/g, "-").slice(0, 22);
  } else {
    // Caso seja PPPoE (sem "-")
    this.value = valor.toLowerCase().replace(/\s+/g, "-").slice(0, 22);
  }
});


// Regras para limitar e deixar somente a discagem de números nos inputs
function limitarNumeros(id, max) {
  const campo = document.getElementById(id);
  campo.addEventListener("input", function() {
    // remove tudo que não for número
    this.value = this.value.replace(/\D/g, ""); 
    // limita o tamanho
    this.value = this.value.slice(0, max); 
  });
}

// Aplicar
limitarNumeros("inputSlot", 2);
limitarNumeros("inputGpon", 2);
limitarNumeros("inputIndex", 3);



