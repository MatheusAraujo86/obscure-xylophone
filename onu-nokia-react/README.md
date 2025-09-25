# 🔮 Nokia ONU Manager | Cyberpunk Tech

<div align="center">

![Nokia ONU](https://img.shields.io/badge/Nokia-ONU_Manager-00FFFF?style=for-the-badge&logo=nokia&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222222?style=for-the-badge&logo=github&logoColor=white)

_A futuristic cyberpunk-themed management system for Nokia ONU devices_

[🚀 Live Demo](https://MatheusAraujo86.github.io/obscure-xylophone/) • [📖 Features](#-features) • [🛠️ Installation](#-installation) • [🌐 Deploy](#-github-pages-deployment)

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

| Technology       | Version | Purpose                   |
| ---------------- | ------- | ------------------------- |
| **React**        | 18.3.1  | Frontend framework        |
| **Vite**         | 7.1.7   | Build tool and dev server |
| **CSS3**         | Custom  | Cyberpunk styling system  |
| **SweetAlert2**  | 11.23.0 | Enhanced notifications    |
| **ESLint**       | 9.36.0  | Code quality and linting  |
| **GitHub Pages** | -       | Static site hosting       |

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

# Deploy to GitHub Pages
npm run deploy
```

## 🌐 GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages. Here's how to set it up:

### **🤖 Automatic Deployment (Recommended)**

1. **Enable GitHub Pages**:

   - Go to your repository Settings → Pages
   - Under "Source", select **"GitHub Actions"**
   - Save the configuration

2. **Push to main/master branch**:

   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin master
   ```

3. **Access your live site**:
   ```
   🌍 https://MatheusAraujo86.github.io/obscure-xylophone/
   ```

### **🔧 Manual Deployment**

If you prefer manual deployment:

```bash
# Build and deploy manually
npm run deploy
```

### **⚙️ Configuration Details**

- **Base URL**: `/obscure-xylophone/` (configured in `vite.config.js`)
- **Build Output**: `dist/` folder
- **GitHub Action**: `.github/workflows/deploy.yml`
- **Node Version**: 18 (specified in workflow)
- **Deployment Branch**: `gh-pages` (auto-created)

### **🛠️ Troubleshooting GitHub Pages**

If you encounter deployment issues:

1. **Check GitHub Actions tab** for build/deployment status
2. **Ensure Pages is enabled** in repository settings
3. **Verify base URL** matches your repository name in `vite.config.js`
4. **Check build logs** for any compilation errors
5. **Wait 5-10 minutes** for DNS propagation

```bash
# Test build locally before deploying
npm run build
npm run preview
```

### **📋 Step-by-Step GitHub Pages Setup**

1. Fork/Clone this repository
2. Go to **Settings** → **Pages**
3. Select **"GitHub Actions"** as source
4. Push any changes to trigger deployment
5. Visit your live site at the provided URL
6. ✨ Enjoy your cyberpunk ONU manager!

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

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build and test locally
npm run build && npm run preview
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
- GitHub Pages for free hosting
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

**🌍 [View Live Demo](https://MatheusAraujo86.github.io/obscure-xylophone/)**

</div>
