import React, { createContext, useState, useContext, useEffect } from 'react';
import { themes } from './ThemeContextUtils'; // Import your theme colors
type ThemeType = 'Light' | 'Ash' | 'Dark' | 'Oxyn';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('Light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeType;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
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
