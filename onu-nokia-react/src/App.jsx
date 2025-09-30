import { useState } from 'react';
import './App.css';
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
import ThemeToggle from './components/ThemeToggle';
import DarkVeilDemo from './components/DarkVeilDemo';

function App() {
  const [posicaoData, setPosicaoData] = useState({
    inputSlot: '',
    inputGpon: '',
    inputIndex: ''
  });

  const [activeComponent, setActiveComponent] = useState('pesquisar');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePosicaoChange = (newPosicao) => {
    setPosicaoData(newPosicao);
  };

  const menuItems = [
    { id: 'pesquisar', label: 'Pesquisar Cliente', icon: '◯' },
    { id: 'provisionar', label: 'Provisionar Cliente', icon: '◯' },
    { id: 'bridge', label: 'Bridge ONT Nokia', icon: '◪' },
    { id: 'wifi', label: 'Configurar Wi-Fi', icon: '◈' },
    { id: 'telefone', label: 'Configurar Telefone', icon: '◐' },
    { id: 'vlan', label: 'Alterar VLAN PPPOE', icon: '◊' },
    { id: 'senha', label: 'Alterar Senha Web', icon: '◇' },
    { id: 'conferencia', label: 'Conferência de Caixa', icon: '◎' },
    { id: 'darkveil', label: 'DarkVeil Demo', icon: '🌌' },
    { id: 'outras', label: 'Outras Opções', icon: '◆' }
  ];

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'pesquisar':
        return <PesquisaCliente />;
      case 'provisionar':
        return <ProvisionarCliente posicaoData={posicaoData} />;
      case 'bridge':
        return <BridgeOntNokia posicaoData={posicaoData} />;
      case 'wifi':
        return <ConfiguracaoWifi posicaoData={posicaoData} />;
      case 'telefone':
        return <ConfiguracaoTelefone posicaoData={posicaoData} />;
      case 'vlan':
        return <AlterarVlanPppoe posicaoData={posicaoData} />;
      case 'senha':
        return <AlterarSenhaWeb posicaoData={posicaoData} />;
      case 'conferencia':
        return <ConferenciaCaixa />;
      case 'darkveil':
        return <DarkVeilDemo />;
      case 'outras':
        return <OutrasOpcoes posicaoData={posicaoData} />;
      default:
        return <PesquisaCliente />;
    }
  };

  return (
    <div className="app-container">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      <header className="header">
        <div className="toolbar">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          
        </div>
      </header>

      <div className="app-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <nav className="sidebar-nav">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`sidebar-item ${activeComponent === item.id ? 'sidebar-item-active' : ''}`}
                onClick={() => {
                  setActiveComponent(item.id);
                  setSidebarOpen(false);
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

        {/* Main Content */}
        <main className={`main-content ${activeComponent === 'conferencia' || activeComponent === 'darkveil' ? 'main-content-full' : ''}`}>
          {/* Posição do Cliente - Condicional */}
          {activeComponent !== 'conferencia' && activeComponent !== 'darkveil' && (
            <div className="fixed-section">
              <PosicaoCliente onPosicaoChange={handlePosicaoChange} />
            </div>
          )}

          {/* Componente ativo */}
          <div className={`dynamic-section ${activeComponent === 'conferencia' || activeComponent === 'darkveil' ? 'dynamic-section-full' : ''}`}>
            {renderActiveComponent()}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-title">【 DESENVOLVIDO POR 】</div>
          <div className="footer-authors">◈ Matheus ◊ Esteban ◈</div>
          <div className="footer-subtitle">━━━━━ SISTEMA DE CONTROLE ONT ━━━━━</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
