import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Componente para alternar entre temas dark e light com variantes
 */
function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [showOptions, setShowOptions] = useState(false);

    const themes = [
        { id: 'dark', name: 'Padrão', icon: '◪' },
        { id: 'dark-cyan', name: 'Escuro Ciano', icon: '◘' },
        { id: 'dark-blue', name: 'Escuro Azul', icon: '◙' },
        { id: 'dark-peach', name: 'Escuro Pêssego', icon: '◗' },
        { id: 'dark-purple', name: 'Escuro Roxo', icon: '◖' },
        { id: 'dark-green', name: 'Escuro Verde', icon: '◕' },
        { id: 'light', name: 'Claro Verde', icon: '◯' },
        { id: 'light-cyan', name: 'Claro Ciano', icon: '◈' },
        { id: 'light-blue', name: 'Claro Azul', icon: '◇' },
        { id: 'light-peach', name: 'Claro Pêssego', icon: '◊' },
        { id: 'light-purple', name: 'Claro Roxo', icon: '◆' }
    ];

    const currentTheme = themes.find(t => t.id === theme) || themes[0];

    const handleThemeChange = (themeId) => {
        setTheme(themeId);
        setShowOptions(false);
    };

    return (
        <div className="theme-selector">
            <button
                className="theme-toggle"
                onClick={() => setShowOptions(!showOptions)}
                title="Selecionar tema"
                aria-label="Selecionar tema"
            >
                <span className="theme-toggle-icon">
                    {currentTheme.icon}
                </span>
                <span className="theme-toggle-text">
                    {currentTheme.name}
                </span>
            </button>
            
            {showOptions && (
                <div className="theme-options">
                    {themes.map((themeOption) => (
                        <button
                            key={themeOption.id}
                            className={`theme-option ${theme === themeOption.id ? 'active' : ''}`}
                            onClick={() => handleThemeChange(themeOption.id)}
                        >
                            <span className="theme-option-icon">{themeOption.icon}</span>
                            <span className="theme-option-name">{themeOption.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ThemeToggle;