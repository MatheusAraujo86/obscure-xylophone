# 🔮 Nokia ONU Manager | Cyberpunk Tech

<div align="center">

![Nokia ONU](https://img.shields.io/badge/Nokia-ONU_Manager-00FFFF?style=for-the-badge&logo=nokia&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Cyberpunk_Theme-1572B6?style=for-the-badge&logo=css3&logoColor=white)

_A futuristic cyberpunk-themed management system for Nokia ONU devices_

[🚀 Live Demo](#-getting-started) • [📖 Features](#-features) • [🛠️ Installation](#-installation) • [🎨 Screenshots](#-screenshots)

---

</div>

## ✨ Overview

**Nokia ONU Manager** is a cutting-edge web application designed for managing Nokia Optical Network Unit (ONU) devices with a stunning cyberpunk aesthetic. Built with modern React technology, it provides network administrators with powerful tools to configure, monitor, and troubleshoot Nokia ONU equipment through an intuitive, neon-lit interface.

## 🚀 Features

### 🔍 **Client Management**

- **Advanced Client Search**: Locate clients by various parameters
- **Client Positioning**: Real-time slot/GPON/index tracking
- **Comprehensive Client Data**: View detailed client information

### ⚙️ **Device Configuration**

- **Client Provisioning/Deprovisioning**: Complete lifecycle management
- **Wi-Fi Configuration**: Manage wireless settings and credentials
- **Phone Configuration**: VoIP and landline setup
- **VLAN/PPPoE Management**: Network layer configuration
- **Web Access Control**: Admin password and access management

### 📊 **Advanced Tools**

- **Box Conference System**: Compare before/after tables
- **Difference Detection**: Automatic highlighting of changes
- **Down Clients Tracking**: Monitor offline devices
- **Data Export/Import**: Backup and restore configurations

### 🎨 **Cyberpunk UI/UX**

- **Neon Color Scheme**: Cyan (#00FFFF) and Magenta (#FF00FF) accents
- **Glow Effects**: Dynamic lighting and shadow effects
- **Futuristic Typography**: Orbitron and Roboto Mono fonts
- **Animated Elements**: Smooth transitions and hover effects
- **Responsive Design**: Mobile and desktop optimized

## 🛠️ Tech Stack

| Technology      | Version | Purpose                   |
| --------------- | ------- | ------------------------- |
| **React**       | 18.3.1  | Frontend framework        |
| **Vite**        | 7.1.7   | Build tool and dev server |
| **CSS3**        | Custom  | Cyberpunk styling system  |
| **SweetAlert2** | 11.23.0 | Enhanced notifications    |
| **ESLint**      | 9.36.0  | Code quality and linting  |

## 📁 Project Structure

```
onu-nokia-react/
├── 📁 public/
│   ├── cyberpunk-favicon.svg     # Custom cyberpunk favicon
│   └── vite.svg
├── 📁 src/
│   ├── 📁 components/
│   │   ├── PosicaoCliente.jsx    # Client positioning
│   │   ├── PesquisaCliente.jsx   # Client search
│   │   ├── ProvisionarCliente.jsx # Client provisioning
│   │   ├── ConfiguracaoWifi.jsx  # Wi-Fi setup
│   │   ├── ConfiguracaoTelefone.jsx # Phone config
│   │   ├── AlterarVlanPppoe.jsx  # VLAN management
│   │   ├── AlterarSenhaWeb.jsx   # Web access
│   │   └── ConferenciaCaixa.jsx  # Box conference tool
│   ├── 📁 hooks/
│   │   └── useSweetAlert.js      # Custom alert hook
│   ├── 📁 services/
│   │   ├── onuService.js         # ONU API calls
│   │   ├── phoneService.js       # Phone services
│   │   └── wifiService.js        # Wi-Fi services
│   ├── 📁 utils/
│   │   └── validation.js         # Input validation
│   ├── App.jsx                   # Main application
│   ├── App.css                   # Global cyberpunk styles
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Base styles
├── index.html                    # HTML template
├── package.json                  # Dependencies
└── vite.config.js               # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MatheusAraujo86/obscure-xylophone.git
   cd onu-nokia-react
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🎮 Usage Guide

### 🔧 **Basic Workflow**

1. **Client Positioning**: Set slot, GPON, and index parameters
2. **Search Client**: Use the search functionality to locate devices
3. **Configure Services**: Set up Wi-Fi, phone, or network settings
4. **Monitor Status**: Track client status and connectivity
5. **Run Conference**: Compare configuration tables for troubleshooting

### 📊 **Box Conference Tool**

The Conference tool allows you to:

- Compare "before" and "after" configuration tables
- Automatically detect differences between states
- Track clients that went offline ("down")
- Store and manage difference history
- Export comparison results

### 🎨 **UI Navigation**

- **Sidebar Menu**: Access all tools and configurations
- **Fixed Positioning**: Client position remains visible across tools
- **Full-Width Mode**: Conference tool automatically expands for better visibility
- **Responsive Design**: Works on mobile and desktop devices

## 🎨 Screenshots

_Screenshots would be added here showing the cyberpunk interface, different tools, and the conference system in action_

## 🧪 Testing

```bash
# Run linting
npm run lint

# Check for code issues
npm run lint:fix
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and follow the cyberpunk design system
4. **Test thoroughly**: Ensure all features work correctly
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### 🎨 Design Guidelines

- Maintain the cyberpunk aesthetic (cyan/magenta color scheme)
- Use Orbitron/Roboto Mono fonts for consistency
- Include glow effects and smooth animations
- Ensure responsive design principles

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Higor Brito & Matheus Araujo**

- GitHub: [@MatheusAraujo86](https://github.com/MatheusAraujo86)
- Company: Solução Network

## 🙏 Acknowledgments

- Nokia for ONU technology and documentation
- React team for the amazing framework
- Vite for lightning-fast development experience
- Cyberpunk aesthetic inspiration from futuristic design trends

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the Issues tab** for existing solutions
2. **Create a new issue** with detailed information
3. **Include system information** and error messages
4. **Describe the expected vs actual behavior**

---

<div align="center">

**Made with ❤️ and lots of ⚡ neon lights**

_Transform your Nokia ONU management experience with cyberpunk style!_ 🔮

</div>
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
