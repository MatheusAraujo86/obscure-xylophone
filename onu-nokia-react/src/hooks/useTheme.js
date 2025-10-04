import { useState, useEffect } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "fui";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes = ["fui", "fui-light", "dark", "dark-green", "dark-purple"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return { theme, setTheme, toggleTheme, setSpecificTheme };
};

export default useTheme;
