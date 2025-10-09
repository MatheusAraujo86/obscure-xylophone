import { useMemo } from 'react';
import './App.css';
import { useAppContext } from './context/AppContext';
import { menuItems } from './config/menuItems';
import { useToast } from './hooks/useToast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import ThemeToggle from './components/ThemeToggle';
import ToastContainer from './components/ToastContainer';
import Logo from './components/Logo';
import PosicaoCliente from './components/PosicaoCliente';
import PesquisaCliente from './components/PesquisaCliente';
import OutrasOpcoes from './components/OutrasOpcoes';
import ProvisionarCliente from './components/ProvisionarCliente';
import ConfiguracaoWifi from './components/ConfiguracaoWifi';
import ConfiguracaoTelefone from './components/ConfiguracaoTelefone';
import AlterarVlanPppoe from './components/AlterarVlanPppoe';
import AlterarSenhaWeb from './components/AlterarSenhaWeb';
import ConferenciaCaixa from './components/ConferenciaCaixa';
import BridgeOntNokia from './components/BridgeOntNokia';

function App() {
  console.log('App iniciando...');
  
  const { 
    posicaoData, 
    handlePosicaoChange, 
    activeComponent, 
    setActiveComponent, 
    sidebarOpen, 
    toggleSidebar, 
    closeSidebar 
  } = useAppContext();

  console.log('Context carregado, activeComponent:', activeComponent);

  const { toasts, removeToast, success, error, info } = useToast();

  // Atalhos de teclado com useMemo para evitar recriação
  const shortcuts = useMemo(() => ({
    'ctrl+1': () => setActiveComponent('pesquisar'),
    'ctrl+2': () => setActiveComponent('provisionar'),
    'ctrl+3': () => setActiveComponent('bridge'),
    'ctrl+4': () => setActiveComponent('wifi'),
    'ctrl+5': () => setActiveComponent('telefone'),
    'ctrl+6': () => setActiveComponent('vlan'),
    'ctrl+7': () => setActiveComponent('senha'),
    'ctrl+8': () => setActiveComponent('conferencia'),
    'ctrl+9': () => setActiveComponent('outras'),
    'ctrl+b': toggleSidebar,
    'escape': closeSidebar,
  }), [setActiveComponent, toggleSidebar, closeSidebar]);

  useKeyboardShortcuts(shortcuts);

  // Função para renderizar componente ativo
  const renderActiveComponent = () => {
    console.log('Renderizando componente:', activeComponent);
    const componentProps = { posicaoData };
    
    try {
      switch (activeComponent) {
        case 'pesquisar':
          return <PesquisaCliente />;
        case 'provisionar':
          return <ProvisionarCliente {...componentProps} />;
        case 'bridge':
          return <BridgeOntNokia {...componentProps} />;
        case 'wifi':
          return <ConfiguracaoWifi {...componentProps} />;
        case 'telefone':
          return <ConfiguracaoTelefone {...componentProps} />;
        case 'vlan':
          return <AlterarVlanPppoe {...componentProps} />;
        case 'senha':
          return <AlterarSenhaWeb {...componentProps} />;
        case 'conferencia':
          return <ConferenciaCaixa />;
        case 'outras':
          return <OutrasOpcoes {...componentProps} />;
        default:
          return <PesquisaCliente />;
      }
    } catch (error) {
      console.error('Erro ao renderizar componente:', error);
      return <div>Erro ao carregar componente: {error.message}</div>;
    }
  };

  console.log('Antes do return do App');

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      <header className="header">
        <div className="toolbar">
          <button 
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          
        </div>
      </header>

      <div className="app-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <nav className="sidebar-nav">
            {menuItems.map(item => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  className={`sidebar-item ${activeComponent === item.id ? 'sidebar-item-active' : ''}`}
                  onClick={() => setActiveComponent(item.id)}
                  aria-label={item.label}
                >
                  <span className="sidebar-icon"><IconComponent /></span>
                  <span className="sidebar-label">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

        {/* Main Content */}
        <main className={`main-content ${activeComponent === 'conferencia' ? 'main-content-full' : ''}`}>
          {/* Posição do Cliente - Condicional */}
          {activeComponent !== 'conferencia' && (
            <div className="fixed-section">
              <PosicaoCliente onPosicaoChange={handlePosicaoChange} />
            </div>
          )}

          {/* Componente ativo */}
          <div className={`dynamic-section ${activeComponent === 'conferencia' ? 'dynamic-section-full' : ''}`}>
            {renderActiveComponent()}
          </div>

          {/* Footer integrado ao grid */}
          <div className="footer-integrated">
            <div className="footer-content">
              <div className="footer-logo">
                <Logo size={50} showTitle={false} />
              </div>
              <div className="footer-title">【 DESENVOLVIDO POR 】</div>
              <div className="footer-authors">◈ Matheus ◊ Esteban ◈</div>
              <div className="footer-subtitle">━━━━━ SISTEMA DE CONTROLE ONT ━━━━━</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
