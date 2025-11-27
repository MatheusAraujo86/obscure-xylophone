import { useState, useEffect } from "react";

export const useTheme = () => {
  // Tema fixo: dark-green
  const [theme] = useState("dark-green");

  useEffect(() => {
    // Remove o atributo data-theme já que não precisamos mais
    document.documentElement.removeAttribute("data-theme");
    document.body.removeAttribute("data-theme");
  }, []);

  // Funções vazias para manter compatibilidade
  const toggleTheme = () => {};
  const setTheme = () => {};
  const setSpecificTheme = () => {};

  return { theme, setTheme, toggleTheme, setSpecificTheme };
};

export default useTheme;
