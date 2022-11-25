import {
  Text,
  Button,
  StackProps,
  forwardRef,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

const Balance = forwardRef<StackProps, "div">((props, ref) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const checkBalance = useCallback(async () => {
    if (!publicKey) {
      throw new WalletNotConnectedError() && alert("Wallet not connected");
    }

    const balance = await connection.getBalance(publicKey);
    const balanceSOL = (balance / LAMPORTS_PER_SOL).toFixed(2);
    setBalance(parseFloat(balanceSOL));
  }, [connection, publicKey]);

  useEffect(() => {
    checkBalance();
  }, [publicKey, checkBalance]);

  const airdropSol = useCallback(async () => {
    if (!publicKey) {
      throw new WalletNotConnectedError() && alert("Wallet not connected");
    }
    setIsLoading(true);

    try {
      const sig = await connection.requestAirdrop(
        publicKey,
        2 * LAMPORTS_PER_SOL, // max airdrop at max 2 SOL in one transaction
      );
      await connection.confirmTransaction(sig);
      await checkBalance();
      toast({
        title: "Airdrop Success",
        description: "2 SOL has been airdropped to your wallet",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Airdrop Failed",
        description: "Something went wrong, please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, checkBalance, toast]);

  return (
    <VStack gap={8} ref={ref} {...props}>
      <Text fontSize="lg" fontWeight="semibold">
        Current Balance: {balance} SOL
      </Text>
      <Button onClick={airdropSol} isLoading={isLoading}>
        Airdrop 2 SOL
      </Button>
    </VStack>
  );
});

export default Balance;
