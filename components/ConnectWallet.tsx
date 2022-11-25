import {
  ButtonProps,
  chakra,
  useColorModeValue,
  forwardRef,
} from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const ConnectWallet = forwardRef<ButtonProps, "button">((props, ref) => {
  const ChakraConnectWallet = chakra(WalletMultiButton, {
    baseStyle: {
      height: "40px",
      backgroundColor: useColorModeValue("purple.600", "purple.700"),
      _hover: {
        backgroundColor: useColorModeValue("purple.700", "purple.800"),
      },
    },
  });
  return <ChakraConnectWallet ref={ref} {...props} />;
});

export default ConnectWallet;
