import { useState, useEffect } from "react";

/**
 * Hook para gerenciar tema da aplicação (dark/light)
 */
export const useTheme = () => {
  // Verifica se há um tema salvo no localStorage, senão usa 'dark' como padrão
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("nokia-onu-theme");
    return savedTheme || "dark";
  });

  // Atualiza o atributo data-theme no body e root, e salva no localStorage
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nokia-onu-theme", theme);
  }, [theme]);

  // Função para alternar entre temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Função para definir um tema específico
  const setSpecificTheme = (newTheme) => {
    if (newTheme === "dark" || newTheme === "light") {
      setTheme(newTheme);
    }
  };

  return {
    theme,
    toggleTheme,
    setSpecificTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
};
