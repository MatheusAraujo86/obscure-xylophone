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
        { id: 'light', name: 'Verde Claro', icon: '◯' },
        { id: 'dark-green', name: 'Verde Escuro', icon: '◕' },
        { id: 'light-cyan', name: 'Ciano Claro', icon: '◈' },
        { id: 'dark-cyan', name: 'Ciano Escuro', icon: '◘' },
        { id: 'light-blue', name: 'Azul Claro', icon: '◇' },
        { id: 'dark-blue', name: 'Azul Escuro', icon: '◙' },
        { id: 'light-flamengo', name: 'Vermelho Claro', icon: '◊' },
        { id: 'dark-flamengo', name: 'Vermelho Escuro', icon: '◗' },
        { id: 'light-purple', name: 'Roxo Claro', icon: '◆' },
        { id: 'dark-purple', name: 'Roxo Escuro', icon: '◖' }
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