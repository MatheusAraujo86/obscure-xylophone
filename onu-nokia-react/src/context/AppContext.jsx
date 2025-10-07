import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [posicaoData, setPosicaoData] = useState({
    inputSlot: '',
    inputGpon: '',
    inputIndex: ''
  });

  const [activeComponent, setActiveComponent] = useState('pesquisar');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePosicaoChange = useCallback((newPosicao) => {
    setPosicaoData(newPosicao);
  }, []);

  const handleSetActiveComponent = useCallback((componentId) => {
    setActiveComponent(componentId);
    setSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const value = {
    posicaoData,
    setPosicaoData,
    handlePosicaoChange,
    activeComponent,
    setActiveComponent: handleSetActiveComponent,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    closeSidebar
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
