# Gerenciador ONU Nokia - React + Material UI

Sistema de gerenciamento para equipamentos ONU Nokia desenvolvido em React com Material UI.

## 🎯 Funcionalidades

### 📍 Posição do Cliente

- Captura Slot GPON, Porta PON e Posição da ONT
- Compartilha dados com todos os outros componentes

### 🔍 Pesquisa de Cliente

- Pesquisa por nome do cliente
- Pesquisa por código ALCL (12 caracteres)
- Validação automática de formato

### ⚙️ Outras Operações

- Pesquisa da PON inteira
- Verificação de alarmes
- Reinicialização de ONU
- Listagem de ONUs para provisionar
- Verificação de fibra
- Desprovisionamento de ONU

### 👤 Provisionar Cliente

- Cadastro completo de novos clientes
- Seleção de VLAN por região
- Configuração de PPPOE
- Validações de ALCL

### 📶 Configuração Wi-Fi

- Alteração de nome da rede
- Alteração de senha (mínimo 8 caracteres)
- Configuração simultânea de nome e senha
- Suporte a redes 2.4GHz e 5GHz

### 📞 Configuração de Telefone

- Configuração SIP para portas 1 e 2
- Usuário e senha SIP
- Integração com servidor de telefonia

### 🔧 Alterações Avançadas

- Modificação de VLAN e PPPOE
- Alteração de senha de acesso web
- Validações robustas

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca principal
- **Material UI** - Interface moderna e responsiva
- **Vite** - Build tool rápida
- **SweetAlert2** - Notificações elegantes
- **Emotion** - Styling system

## 🎨 Design System

### Tema Escuro

- Cores primárias: Azul (#2196F3) e Laranja (#FF9800)
- Fundo escuro (#212121) para conforto visual
- Componentes Paper com elevação 3
- Ícones descritivos para cada funcionalidade

### Componentes Material UI

- **TextField** - Inputs com labels flutuantes
- **Button** - Botões com ícones e cores semânticas
- **Paper** - Cartões com sombra e padding
- **AppBar** - Barra superior com gradient
- **Grid** - Layout responsivo 12 colunas

## 📱 Responsividade

- **Desktop**: 3 colunas (md=4)
- **Tablet**: 2 colunas adaptáveis
- **Mobile**: 1 coluna (xs=12)

## 🔒 Validações

- Campos numéricos (Slot, PON, Posição)
- ALCL de 12 caracteres
- Senhas Wi-Fi mínimo 8 caracteres
- Campos obrigatórios
- Validação de portas telefônicas

## 🎯 Usabilidade

- **Auto-cópia**: Comandos copiados automaticamente
- **Notificações**: Feedback visual com SweetAlert2
- **Confirmações**: Diálogos para ações críticas
- **Estados**: Loading e erro tratados
- **Acessibilidade**: Labels e ARIA adequados

## 🏗️ Arquitetura

```
src/
├── components/          # Componentes React
├── services/           # Lógica de negócio
├── hooks/             # Hooks customizados
├── utils/             # Funções utilitárias
└── theme.js           # Configuração Material UI
```

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📋 Dependências Principais

```json
{
  "@mui/material": "^5.x",
  "@emotion/react": "^11.x",
  "@emotion/styled": "^11.x",
  "@mui/icons-material": "^5.x",
  "sweetalert2": "^11.x",
  "react": "^19.x",
  "vite": "^7.x"
}
```

## 👥 Desenvolvido por

- **Higor Brito**
- **Vitor Odorico**

---

© 2024 Solução Network. Sistema de gerenciamento ONU Nokia.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
