import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
export const ThemeContext = createContext();

// Available themes
const themes = {
  light: {
    name: "light",
    backgroundColor: "bg-white",
    textColor: "text-gray-900",
    secondaryBackgroundColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  dark: {
    name: "dark",
    backgroundColor: "bg-gray-900",
    textColor: "text-gray-100",
    secondaryBackgroundColor: "bg-gray-800",
    borderColor: "border-gray-700",
  },
};

// Provider component
export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference stored in localStorage
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme && ["light", "dark"].includes(storedTheme)) {
      return storedTheme;
    }

    // Check for system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    // Default to light theme
    return "light";
  };

  const [currentTheme, setCurrentTheme] = useState(getInitialTheme);

  // Apply theme to document body
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light-mode", "dark-mode");
    root.classList.add(`${currentTheme}-mode`);

    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Set a specific theme
  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[currentTheme],
        isDark: currentTheme === "dark",
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
