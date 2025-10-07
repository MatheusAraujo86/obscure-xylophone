import './App.css';
import { useAppContext } from './context/AppContext';
import ThemeToggle from './components/ThemeToggle';
import PosicaoCliente from './components/PosicaoCliente';
// import PesquisaCliente from './components/PesquisaCliente';

function TestApp() {
  try {
    const { 
      posicaoData, 
      handlePosicaoChange, 
      activeComponent, 
      setActiveComponent 
    } = useAppContext();

    console.log('TestApp renderizando, activeComponent:', activeComponent);

    return (
      <div className="app-container">
        <ThemeToggle />
        
        <header className="header">
          <h1>Sistema ONT - Modo Teste (PesquisaCliente comentado)</h1>
        </header>

        <div className="app-layout">
          <main className="main-content">
            <div className="fixed-section">
              <PosicaoCliente onPosicaoChange={handlePosicaoChange} />
            </div>
            
            <div className="dynamic-section">
              <div className="card">
                <h3>PesquisaCliente está causando erro</h3>
                <p>Vou investigar o componente PesquisaCliente</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro no TestApp:', error);
    return (
      <div className="app-container">
        <h1>Erro!</h1>
        <p>{error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }
}

export default TestApp;
