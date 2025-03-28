import { Box, Circle, Tooltip, Icon } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { themes } from '../design/Themes';
import { useTheme } from '../../context/ThemeContext';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  type ThemeType = 'Light' | 'Ash' | 'Dark' | 'Oxyn';
  const themesMain: ThemeType[] = ['Light', 'Ash', 'Dark', 'Oxyn'];

  return (
    <Box p={3} position="absolute" top={5} right={0} display="flex" gap={3}>
      {themesMain.map((themeOption) => (
        <Tooltip key={themeOption} label={themeOption}>
          <Box position="relative">
            <Circle
              size="60px"
              bg={`conic-gradient(from 45deg, ${
                themeOption === 'Light'
                  ? themes['Light'].dark
                  : themeOption === 'Ash'
                  ? themes['Ash'].light
                  : themeOption === 'Dark'
                  ? themes['Dark'].light
                  : themes['Oxyn'].light
              } 0deg 180deg, ${
                themeOption === 'Light'
                  ? themes['Light'].light
                  : themeOption === 'Ash'
                  ? themes['Ash'].dark
                  : themeOption === 'Dark'
                  ? themes['Dark'].dark
                  : themes['Oxyn'].dark
              } 180deg)`}
              border={theme === themeOption ? '3px solid teal' : '2px solid gray'}
              onClick={() => setTheme(themeOption)}
              cursor="pointer"
              transition="0.2s ease-in-out"
              _hover={{ transform: 'scale(1.1)' }}
            />
            {theme === themeOption && (
              <Icon
                as={CheckIcon}
                color="white"
                position="absolute"
                top="0px"
                right="0px"
                bg="teal.500"
                borderRadius="full"
                p="3px"
                boxSize="20px"
              />
            )}
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
};

export default ThemeSelector;
