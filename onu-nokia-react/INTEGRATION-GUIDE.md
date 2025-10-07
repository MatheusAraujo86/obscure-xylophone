# 🔧 Guia de Integração - Componentes Existentes

## Como integrar Toast nos componentes existentes

Este guia mostra como adicionar notificações Toast aos seus componentes atuais.

---

## 📋 Template Básico

### Antes (sem Toast):

```jsx
function MeuComponente() {
  const handleSubmit = async () => {
    const response = await fetch("/api/dados");
    console.log("Sucesso!"); // ❌ Usuário não vê feedback
  };

  return <button onClick={handleSubmit}>Enviar</button>;
}
```

### Depois (com Toast):

```jsx
import { useToast } from "../hooks/useToast";

function MeuComponente() {
  const { success, error } = useToast(); // ✅ Adicione esta linha

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/dados");
      success("Dados enviados com sucesso!"); // ✅ Feedback visual
    } catch (err) {
      error("Erro ao enviar: " + err.message); // ✅ Mostra erro
    }
  };

  return <button onClick={handleSubmit}>Enviar</button>;
}
```

---

## 🎯 Exemplos por Componente

### 1. PesquisaCliente.jsx

```jsx
import { useToast } from '../hooks/useToast';

export default function PesquisaCliente() {
  const { success, error, info } = useToast();

  const buscarCliente = async (serial) => {
    info('Buscando cliente...');

    try {
      const response = await fetch(`/api/cliente/${serial}`);

      if (response.ok) {
        const data = await response.json();
        success('Cliente encontrado!');
        return data;
      } else {
        error('Cliente não encontrado');
      }
    } catch (err) {
      error('Erro na busca: ' + err.message);
    }
  };

  return (
    // seu JSX aqui
  );
}
```

### 2. ProvisionarCliente.jsx

```jsx
import { useToast } from '../hooks/useToast';
import { useAppContext } from '../context/AppContext';

export default function ProvisionarCliente() {
  const { success, error, warning } = useToast();
  const { posicaoData } = useAppContext();

  const provisionar = async () => {
    // Validação
    if (!posicaoData.inputSlot) {
      warning('Por favor, preencha o slot!');
      return;
    }

    try {
      const response = await fetch('/api/provisionar', {
        method: 'POST',
        body: JSON.stringify(posicaoData)
      });

      if (response.ok) {
        success('Cliente provisionado com sucesso! ✅');
      } else {
        error('Falha ao provisionar cliente');
      }
    } catch (err) {
      error('Erro de conexão: ' + err.message);
    }
  };

  return (
    // seu JSX aqui
  );
}
```

### 3. ConfiguracaoWifi.jsx

```jsx
import { useToast } from '../hooks/useToast';
import { useAppContext } from '../context/AppContext';

export default function ConfiguracaoWifi() {
  const { success, error, warning } = useToast();
  const { posicaoData } = useAppContext();

  const configurarWifi = async (ssid, senha) => {
    // Validação
    if (senha.length < 8) {
      warning('Senha deve ter no mínimo 8 caracteres!');
      return;
    }

    try {
      const response = await fetch('/api/wifi', {
        method: 'POST',
        body: JSON.stringify({ ssid, senha, ...posicaoData })
      });

      if (response.ok) {
        success(`Wi-Fi "${ssid}" configurado com sucesso! 📶`);
      } else {
        error('Falha ao configurar Wi-Fi');
      }
    } catch (err) {
      error('Erro ao configurar: ' + err.message);
    }
  };

  return (
    // seu JSX aqui
  );
}
```

### 4. AlterarSenhaWeb.jsx

```jsx
import { useToast } from '../hooks/useToast';

export default function AlterarSenhaWeb() {
  const { success, error, warning } = useToast();

  const validarSenha = (senha, confirmarSenha) => {
    if (!senha) {
      warning('Digite a nova senha');
      return false;
    }

    if (senha !== confirmarSenha) {
      error('As senhas não coincidem!');
      return false;
    }

    if (senha.length < 6) {
      warning('Senha deve ter no mínimo 6 caracteres');
      return false;
    }

    return true;
  };

  const alterarSenha = async (senha, confirmarSenha) => {
    if (!validarSenha(senha, confirmarSenha)) return;

    try {
      const response = await fetch('/api/senha', {
        method: 'PUT',
        body: JSON.stringify({ senha })
      });

      if (response.ok) {
        success('Senha alterada com sucesso! 🔐');
      } else {
        error('Falha ao alterar senha');
      }
    } catch (err) {
      error('Erro: ' + err.message);
    }
  };

  return (
    // seu JSX aqui
  );
}
```

### 5. ConferenciaCaixa.jsx

```jsx
import { useToast } from '../hooks/useToast';

export default function ConferenciaCaixa() {
  const { success, error, info } = useToast();

  const conferirItem = (item) => {
    info(`Conferindo: ${item.nome}`);
    // lógica de conferência
  };

  const finalizarConferencia = async (itens) => {
    if (itens.length === 0) {
      error('Nenhum item para conferir!');
      return;
    }

    try {
      const response = await fetch('/api/conferencia', {
        method: 'POST',
        body: JSON.stringify({ itens })
      });

      if (response.ok) {
        success(`Conferência finalizada! ${itens.length} itens verificados ✅`);
      } else {
        error('Falha ao finalizar conferência');
      }
    } catch (err) {
      error('Erro: ' + err.message);
    }
  };

  return (
    // seu JSX aqui
  );
}
```

---

## 🎨 Mensagens Criativas

### Exemplos de mensagens para cada tipo:

#### ✅ Success

```jsx
success("ONT provisionada com sucesso! 🎉");
success("Wi-Fi configurado! 📶");
success("Dados salvos com sucesso! ✅");
success("Senha alterada! 🔐");
success("Telefone configurado! 📞");
```

#### ❌ Error

```jsx
error("Falha ao conectar com a ONT");
error("Erro ao salvar dados");
error("Não foi possível alterar a VLAN");
error("Serial inválido ou não encontrado");
error("Tempo de conexão excedido");
```

#### ⚠️ Warning

```jsx
warning("Preencha todos os campos obrigatórios!");
warning("Serial já existe no sistema");
warning("Senha muito fraca, use caracteres especiais");
warning("VLAN fora do intervalo permitido (1-4094)");
warning("Verifique os dados antes de continuar");
```

#### ℹ️ Info

```jsx
info("Processando solicitação...");
info("Buscando informações da ONT...");
info("Aguarde, conectando...");
info("Verificando disponibilidade...");
info("Salvando configurações...");
```

---

## 🔄 Substituindo SweetAlert2

Se você está usando SweetAlert2 em algum lugar, pode migrar para Toast:

### Antes (SweetAlert2):

```jsx
import Swal from "sweetalert2";

Swal.fire({
  icon: "success",
  title: "Sucesso!",
  text: "Dados salvos",
});
```

### Depois (Toast):

```jsx
import { useToast } from "../hooks/useToast";

const { success } = useToast();
success("Dados salvos com sucesso!");
```

**Vantagens do Toast:**

- ✅ Mais leve
- ✅ Não bloqueia a tela
- ✅ Melhor UX
- ✅ Mais rápido
- ✅ Design integrado

---

## 📊 Checklist de Integração

Para cada componente, siga este checklist:

### [ ] 1. Importar o hook

```jsx
import { useToast } from "../hooks/useToast";
```

### [ ] 2. Usar no componente

```jsx
const { success, error, warning, info } = useToast();
```

### [ ] 3. Adicionar em operações assíncronas

```jsx
try {
  // operação
  success("Sucesso!");
} catch (err) {
  error("Erro: " + err.message);
}
```

### [ ] 4. Adicionar em validações

```jsx
if (!campo) {
  warning("Campo obrigatório!");
  return;
}
```

### [ ] 5. Adicionar em feedbacks informativos

```jsx
info("Processando...");
```

---

## 🎯 Onde Adicionar Toast

### ✅ Adicione Toast em:

- ✅ Submissão de formulários
- ✅ Chamadas de API
- ✅ Validações de dados
- ✅ Operações de salvamento
- ✅ Operações de exclusão
- ✅ Operações de atualização
- ✅ Confirmações de ação
- ✅ Avisos ao usuário
- ✅ Estados de carregamento importantes

### ❌ Evite Toast para:

- ❌ Hover em elementos
- ❌ Cada tecla digitada
- ❌ Mudanças de estado muito frequentes
- ❌ Validações em tempo real (use messages inline)

---

## 🚀 Exemplo Completo de Migração

### Componente Original:

```jsx
function ProvisionarOntTelefonia({ posicaoData }) {
  const [loading, setLoading] = useState(false);

  const provisionar = async () => {
    setLoading(true);

    const response = await fetch("/api/provisionar-telefonia", {
      method: "POST",
      body: JSON.stringify(posicaoData),
    });

    if (response.ok) {
      console.log("Provisionado!");
    } else {
      console.log("Erro!");
    }

    setLoading(false);
  };

  return <button onClick={provisionar}>Provisionar</button>;
}
```

### Componente Melhorado:

```jsx
import { useToast } from "../hooks/useToast";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";

function ProvisionarOntTelefonia() {
  const { success, error, warning, info } = useToast();
  const { posicaoData } = useAppContext();
  const [loading, setLoading] = useState(false);

  const validarDados = () => {
    if (!posicaoData.inputSlot) {
      warning("Preencha o slot!");
      return false;
    }
    if (!posicaoData.inputGpon) {
      warning("Preencha o GPON!");
      return false;
    }
    return true;
  };

  const provisionar = async () => {
    if (!validarDados()) return;

    setLoading(true);
    info("Provisionando telefonia...");

    try {
      const response = await fetch("/api/provisionar-telefonia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(posicaoData),
      });

      if (response.ok) {
        const data = await response.json();
        success(`Telefonia provisionada! Ramal: ${data.ramal} 📞`);
      } else {
        const errorData = await response.json();
        error(errorData.message || "Falha ao provisionar");
      }
    } catch (err) {
      error("Erro de conexão: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={provisionar} disabled={loading}>
      {loading ? "Provisionando..." : "Provisionar"}
    </button>
  );
}

export default ProvisionarOntTelefonia;
```

---

## 💡 Dicas Finais

1. **Seja específico nas mensagens**

   ```jsx
   // ❌ Genérico
   success("Sucesso!");

   // ✅ Específico
   success('Wi-Fi "MinhaRede" configurado com sucesso!');
   ```

2. **Use emojis para melhor UX**

   ```jsx
   success("ONT provisionada! 🎉");
   error("Falha na conexão 🔌");
   warning("Atenção! ⚠️");
   info("Processando... ⏳");
   ```

3. **Mensagens curtas e claras**

   ```jsx
   // ❌ Muito longa
   success(
     "A operação de provisionamento da ONT foi concluída com sucesso e todos os dados foram salvos corretamente no sistema"
   );

   // ✅ Concisa
   success("ONT provisionada com sucesso!");
   ```

4. **Contextualize erros**
   ```jsx
   catch (err) {
     error(`Erro ao provisionar: ${err.message}`);
   }
   ```

---

**Pronto para integrar! 🚀**

_Documentação criada por Matheus & Esteban_
