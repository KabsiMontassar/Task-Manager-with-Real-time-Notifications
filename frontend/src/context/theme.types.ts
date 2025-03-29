import { createContext } from 'react';
export type ThemeType = 'Light' | 'Ash' | 'Dark' | 'Oxyn';

export interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const themeOptions: ThemeType[] = ['Light', 'Ash', 'Dark', 'Oxyn'];