import React, { useState, useEffect } from 'react';
import { ThemeContext, ThemeType } from './theme.types';
import { themes } from './ThemeContextUtils';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('Light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeType;
    if (storedTheme && themes[storedTheme]) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const themeColors = themes[theme];
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.toLowerCase()}-color`, value);
    });
  }, [theme]);

  const updateTheme = (newTheme: ThemeType) => {
    if (themes[newTheme]) {
      localStorage.setItem('theme', newTheme);
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};