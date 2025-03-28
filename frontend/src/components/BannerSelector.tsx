import { useState, useEffect } from "react";
import {
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Icon,
    Tooltip,
} from "@chakra-ui/react";
import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";

// Define banner types
type BannerType = "Breezy" | "Particles" | "Pattern" | "Hexagon";

const BannerSelector = ({
    setBanner,
}: {
    setBanner: React.Dispatch<React.SetStateAction<BannerType>>;
}) => {
    const BannersMain: BannerType[] = ["Breezy", "Particles", "Pattern", "Hexagon"];
    const [selectedBanner, setSelectedBanner] = useState<BannerType>("Particles");

    useEffect(() => {
        const storedTheme = localStorage.getItem("Banner") as BannerType;
        if (storedTheme) {
            setSelectedBanner(storedTheme);
            setBanner(storedTheme);
        } else {
            setSelectedBanner("Particles");
            setBanner("Particles");
        }
    }, [setBanner]);

    const handleBannerChange = (Banner: BannerType) => {
        localStorage.setItem("Banner", Banner);
        setSelectedBanner(Banner);
        setBanner(Banner);
    };

    return (
        <Box position="absolute" top={5} left={5} zIndex={9999}>
            <Menu>
                <Tooltip label="Select Banner">
                    <MenuButton  as={IconButton} icon={<ChevronDownIcon />} 
                 
                      rounded="full"
                        colorScheme="teal"
                    />
                        
                </Tooltip>
                <MenuList zIndex={9999}>
                    {BannersMain.map((Banner) => (
                        <MenuItem key={Banner} onClick={() => handleBannerChange(Banner)}>
                            {Banner}
                            {selectedBanner === Banner && (
                                <Icon as={CheckIcon} color="teal.500" ml="auto" />
                            )}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </Box>
    );
};

export default BannerSelector;
