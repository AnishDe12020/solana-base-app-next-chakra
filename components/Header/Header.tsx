import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { HStack, IconButton, useColorMode } from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack
      as="nav"
      px={[8, 16, 24]}
      py={6}
      justifyContent="end"
      alignItems="center"
      gap={4}
    >
      <IconButton
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        aria-label={
          colorMode === "light" ? "Switch to dark mode" : "Switch to light mode"
        }
        onClick={toggleColorMode}
      />

      <WalletMultiButton />
    </HStack>
  );
};

export default Header;
