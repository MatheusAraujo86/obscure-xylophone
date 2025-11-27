import { useMemo, lazy, Suspense } from 'react';
import './App.css';
import { useAppContext } from './context/AppContext';
import { menuItems } from './config/menuItems';
import { useToast } from './hooks/useToast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import ToastContainer from './components/ToastContainer';
import Logo from './components/Logo';
import PosicaoCliente from './components/PosicaoCliente';
import Loading from './components/Loading';

// Lazy loading dos componentes principais
const PesquisaCliente = lazy(() => import('./components/PesquisaCliente'));
const OutrasOpcoes = lazy(() => import('./components/OutrasOpcoes'));
const ProvisionarCliente = lazy(() => import('./components/ProvisionarCliente'));
const ConfiguracaoWifi = lazy(() => import('./components/ConfiguracaoWifi'));
const ConfiguracaoTelefone = lazy(() => import('./components/ConfiguracaoTelefone'));
const AlterarVlanPppoe = lazy(() => import('./components/AlterarVlanPppoe'));
const AlterarSenhaWeb = lazy(() => import('./components/AlterarSenhaWeb'));
const ConferenciaCaixa = lazy(() => import('./components/ConferenciaCaixa'));
const BridgeOntNokia = lazy(() => import('./components/BridgeOntNokia'));

function App() {
  const { 
    posicaoData, 
    handlePosicaoChange, 
    activeComponent, 
    setActiveComponent, 
    sidebarOpen, 
    toggleSidebar, 
    closeSidebar 
  } = useAppContext();

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

  // Função para renderizar componente ativo com memoização
  const renderActiveComponent = useMemo(() => {
    const componentProps = { posicaoData };
    
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
  }, [activeComponent, posicaoData]);

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
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
            <Suspense fallback={<Loading />}>
              {renderActiveComponent}
            </Suspense>
          </div>

          {/* Footer integrado ao grid */}
          <div className="footer-integrated">
            <div className="footer-content">
              <div className="footer-logo">
                <Logo size={50} showTitle={false} />
              </div>
              <div className="footer-title">Desenvolvido pelo Suporte Técnico</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
