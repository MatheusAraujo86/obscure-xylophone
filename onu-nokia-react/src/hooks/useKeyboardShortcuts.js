import { useEffect } from "react";

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Constrói a chave baseada nos modificadores pressionados
      const modifiers = [];
      if (e.ctrlKey) modifiers.push("ctrl");
      if (e.altKey) modifiers.push("alt");
      if (e.shiftKey) modifiers.push("shift");

      const key =
        modifiers.length > 0
          ? `${modifiers.join("+")}+${e.key.toLowerCase()}`
          : e.key.toLowerCase();

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
};
