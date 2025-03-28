import { useState, useEffect } from "react";
import { Box, Circle, Tooltip, Icon } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { themes } from "./design/Themes";

type ThemeType = "Light" | "Ash" | "Dark" | "Oxyn";

const ThemeSelector = ({
  setTheme,
}: {
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
}) => {
  const themesMain: ThemeType[] = ["Light", "Ash", "Dark", "Oxyn"];
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>("Light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as ThemeType;
    if (storedTheme) {
      setSelectedTheme(storedTheme);
      setTheme(storedTheme);
    } else {
      setSelectedTheme("Light");
      setTheme("Light");
    }
  }, [setTheme]);

  const handleThemeChange = (theme: ThemeType) => {
    localStorage.setItem("theme", theme);
    setSelectedTheme(theme);
    setTheme(theme);
  };

  return (
    <Box p={3} position="absolute" top={5} right={0} display="flex" gap={3}>
      {themesMain.map((theme) => (
        <Tooltip key={theme} label={theme}>
          <Box position="relative">
            {/* Theme Circle */}
            <Circle
              size="60px"
              bg={`conic-gradient(from 45deg, ${
                theme === "Light"
                  ? themes["Light"].dark
                  : theme === "Ash"
                  ? themes["Ash"].light
                  : theme === "Dark"
                  ? themes["Dark"].light
                  : themes["Oxyn"].light
              } 0deg 180deg, ${
                theme === "Light"
                  ? themes["Light"].light
                  : theme === "Ash"
                  ? themes["Ash"].dark
                  : theme === "Dark"
                  ? themes["Dark"].dark
                  : themes["Oxyn"].dark
              } 180deg)`}
              border={selectedTheme === theme ? "3px solid teal" : "2px solid gray"}
              onClick={() => handleThemeChange(theme)}
              cursor="pointer"
              transition="0.2s ease-in-out"
              _hover={{ transform: "scale(1.1)" }}
            />

            {/* Checkmark Icon (Visible only when selected) */}
            {selectedTheme === theme && (
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
