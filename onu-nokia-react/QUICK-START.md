# Guia Rápido - Novas Funcionalidades

## Sistema de Notificações Toast

### Uso Básico

```jsx
import { useToast } from "../hooks/useToast";

function MeuComponente() {
  const { success, error, warning, info } = useToast();

  const salvarDados = async () => {
    try {
      // Sua lógica aqui
      await api.salvar(dados);
      success("Dados salvos com sucesso!");
    } catch (err) {
      error("Erro ao salvar: " + err.message);
    }
  };

  return <button onClick={salvarDados}>Salvar</button>;
}
```

### Exemplos Práticos

```jsx
// Sucesso
success("ONT provisionada com sucesso!");

// Erro
error("Falha ao conectar com a ONT");

// Aviso
warning("Verifique os dados antes de continuar");

// Informação
info("Processando solicitação...");

// Com duração customizada (em milissegundos)
success("Mensagem", 5000); // 5 segundos
```

---

## Atalhos de Teclado

### Atalhos Disponíveis

| Tecla        | Ação                      |
| ------------ | ------------------------- |
| **Ctrl + 1** | Pesquisar Cliente         |
| **Ctrl + 2** | Provisionar Cliente       |
| **Ctrl + 3** | Provisionar ONT Telefonia |
| **Ctrl + 4** | Bridge ONT Nokia          |
| **Ctrl + 5** | Configurar Wi-Fi          |
| **Ctrl + 6** | Configurar Telefone       |
| **Ctrl + 7** | Alterar VLAN PPPOE        |
| **Ctrl + 8** | Alterar Senha Web         |
| **Ctrl + 9** | Conferência de Caixa      |
| **Ctrl + 0** | Outras Opções             |
| **Ctrl + B** | Abrir/Fechar Menu         |
| **ESC**      | Fechar Menu               |

### Adicionar Novos Atalhos

Se precisar adicionar atalhos específicos em um componente:

```jsx
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

function MeuComponente() {
  const shortcuts = {
    "ctrl+s": salvarFormulario,
    "ctrl+enter": enviarDados,
    escape: fecharModal,
  };

  useKeyboardShortcuts(shortcuts);

  // ...
}
```

---

## Context API

### Acessar Dados Globais

```jsx
import { useAppContext } from "../context/AppContext";

function MeuComponente() {
  const {
    posicaoData, // Dados da posição do cliente
    setActiveComponent, // Mudar componente ativo
    handlePosicaoChange, // Atualizar posição
    sidebarOpen, // Estado da sidebar
    toggleSidebar, // Alternar sidebar
    closeSidebar, // Fechar sidebar
  } = useAppContext();

  // Usar os dados
  console.log(posicaoData.inputSlot);
  console.log(posicaoData.inputGpon);
  console.log(posicaoData.inputIndex);

  // Navegar para outro componente
  const irParaWifi = () => {
    setActiveComponent("wifi");
  };

  return (
    <div>
      <button onClick={irParaWifi}>Configurar Wi-Fi</button>
    </div>
  );
}
```

---

## 🎨 Loading Personalizado

O componente de loading já está integrado com lazy loading. Para usar em outras situações:

```jsx
import Loading from "../components/Loading";

function MeuComponente() {
  const [carregando, setCarregando] = useState(false);

  if (carregando) {
    return <Loading message="Carregando dados da ONT..." />;
  }

  return <div>Conteúdo</div>;
}
```

---

## Dicas de Performance

### 1. Usar useCallback para funções

```jsx
import { useCallback } from "react";

const handleClick = useCallback(() => {
  // Sua lógica
}, [dependencias]);
```

### 2. Usar useMemo para cálculos pesados

```jsx
import { useMemo } from "react";

const dadosProcessados = useMemo(() => {
  return dados.map((item) => processarItem(item));
}, [dados]);
```

### 3. Evitar re-renders desnecessários

```jsx
import { memo } from "react";

const MeuComponente = memo(({ props }) => {
  return <div>{props}</div>;
});
```

---

## Exemplos de Integração

### Exemplo 1: Formulário com Toast

```jsx
function FormularioONT() {
  const { success, error } = useToast();
  const { posicaoData } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/ont", {
        method: "POST",
        body: JSON.stringify({ ...posicaoData, ...formData }),
      });

      if (response.ok) {
        success("ONT configurada com sucesso!");
      } else {
        error("Falha ao configurar ONT");
      }
    } catch (err) {
      error("Erro de conexão: " + err.message);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Exemplo 2: Navegação com Feedback

```jsx
function MenuCustomizado() {
  const { setActiveComponent } = useAppContext();
  const { info } = useToast();

  const navegarPara = (componente, nome) => {
    setActiveComponent(componente);
    info(`Navegando para ${nome}...`);
  };

  return (
    <button onClick={() => navegarPara("wifi", "Configuração Wi-Fi")}>
      Wi-Fi
    </button>
  );
}
```

### Exemplo 3: Validação com Toast

```jsx
function ValidarDados() {
  const { warning } = useToast();
  const { posicaoData } = useAppContext();

  const validar = () => {
    if (!posicaoData.inputSlot) {
      warning("Por favor, preencha o slot!");
      return false;
    }
    if (!posicaoData.inputGpon) {
      warning("Por favor, preencha o GPON!");
      return false;
    }
    return true;
  };

  return <button onClick={validar}>Validar</button>;
}
```

---

## Troubleshooting

### Toast não aparece?

Verifique se está importando corretamente:

```jsx
import { useToast } from "../hooks/useToast";
```

### Context retorna undefined?

Certifique-se que o componente está dentro do `<AppProvider>` no `main.jsx`

### Atalhos não funcionam?

Verifique se não há conflitos com atalhos do navegador

---

## Links Úteis

- [Documentação Completa](./IMPROVEMENTS.md)
- [Atalhos de Teclado](./KEYBOARD-SHORTCUTS.md)
- [Exemplo de Toast](./src/examples/ToastExample.jsx)

---

**Desenvolvido por Matheus & Esteban**
