import { useTheme } from '../hooks/useTheme';

/**
 * Componente para alternar entre temas dark e light
 */
function ThemeToggle() {
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Alterar para tema ${isDark ? 'claro' : 'escuro'}`}
            aria-label={`Alterar para tema ${isDark ? 'claro' : 'escuro'}`}
        >
            <span className="theme-toggle-icon">
                {isDark ? '◯' : '◪'}
            </span>
            <span className="theme-toggle-text">
                {isDark ? 'Light' : 'Dark'}
            </span>
        </button>
    );
}

export default ThemeToggle;