import React, { createContext, useState, useContext, useEffect } from 'react';

type ThemeType = 'Light' | 'Ash' | 'Dark' | 'Oxyn';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const themes = {
  "Light": {
    dark: "#F3F3F4",
    light: "#FBFBFB",
    fontColor: "#333339"
  },
  "Ash": {
    dark: "#28282D",
    light: "#333339",
    fontColor: "#D8D8DB"
  },
  "Dark": {
    dark: "#121214",
    light: "#202024",
    fontColor: "#D8D8DB"
  },
  "Oxyn": {
    dark: "#000000",
    light: "#0C0C0E",
    fontColor: "#D8D8DB"
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('Light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeType;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme colors dynamically to the body
    const root = document.documentElement;
    const themeColors = themes[theme];
    if (themeColors) {
      root.style.setProperty('--dark-color', themeColors.dark);
      root.style.setProperty('--light-color', themeColors.light);
      root.style.setProperty('--font-color', themeColors.fontColor);
    }
  }, [theme]);

  const updateTheme = (newTheme: ThemeType) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
