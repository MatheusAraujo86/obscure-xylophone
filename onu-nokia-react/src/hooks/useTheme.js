import { useState, useEffect } from "react";

/**
 * Hook para gerenciar tema da aplicação (dark/light com variantes)
 */
export const useTheme = () => {
  // Temas disponíveis
  const availableThemes = [
    "dark",
    "dark-cyan",
    "dark-blue",
    "dark-peach",
    "dark-purple",
    "dark-green",
    "light",
    "light-cyan",
    "light-blue",
    "light-peach",
    "light-purple",
  ];

  // Verifica se há um tema salvo no localStorage, senão usa 'dark' como padrão
  const [theme, setThemeState] = useState(() => {
    const savedTheme = localStorage.getItem("nokia-ont-theme");
    return availableThemes.includes(savedTheme) ? savedTheme : "dark";
  });

  // Atualiza o atributo data-theme no body e root, e salva no localStorage
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nokia-ont-theme", theme);
  }, [theme]);

  // Função para alternar entre temas (dark <-> light)
  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Função para definir um tema específico
  const setTheme = (newTheme) => {
    if (availableThemes.includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    availableThemes,
    isDark: theme === "dark",
    isLight: theme.startsWith("light"),
  };
};
