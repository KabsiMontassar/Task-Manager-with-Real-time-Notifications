import { useState, useEffect } from 'react';
import { Box, Circle, Tooltip } from '@chakra-ui/react';
import {themes} from './design/Themes';
type ThemeType = 'Light' | 'Ash' | 'Dark' | 'Oxyn';

const ThemeSelector = ({ setTheme }: { setTheme: React.Dispatch<React.SetStateAction<ThemeType>> }) => {
  const themesMain: ThemeType[] = ['Light', 'Ash', 'Dark', 'Oxyn'];
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('Light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeType;
    if (storedTheme) {
      setSelectedTheme(storedTheme);
      setTheme(storedTheme);
    } else {
      setSelectedTheme('Light');
      setTheme('Light');
    }
  }, [setTheme]);

  const handleThemeChange = (theme: ThemeType) => {
    localStorage.setItem('theme', theme);
    setSelectedTheme(theme);
    setTheme(theme);
  };

  return (
    <Box  p={3} position="absolute" top={5} right={0} display="flex" gap={3}>
      {themesMain.map((theme) => (
        <Tooltip key={theme} label={theme}>
          <Circle
            size="60px"
            bg={`conic-gradient(from 45deg, ${
              theme === 'Light' ? themes['Light'].dark : theme === 'Ash' ? themes['Ash'].light : theme === 'Dark' ? themes['Dark'].light : themes['Oxyn'].light
            } 0deg 180deg, ${
              theme === 'Light' ? themes['Light'].light : theme === 'Ash' ? themes['Ash'].dark : theme === 'Dark' ? themes['Dark'].dark : themes['Oxyn'].dark
            } 180deg)`}
            border={theme === selectedTheme ? '3px solid teal' : 'none'}
            onClick={() => handleThemeChange(theme)}
            cursor="pointer"
            style={{
              clipPath: 'circle(50% at 50% 50%)',
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

export default ThemeSelector;