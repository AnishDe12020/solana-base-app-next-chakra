import {
  VStack,
  useColorModeValue,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Button,
  useToast,
  forwardRef,
  StackProps,
} from "@chakra-ui/react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useCallback, useState } from "react";

const TransactionComponent = forwardRef<StackProps, "div">((props, ref) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(
    "8Dyk53RrtmN3MshQxxWdfTRco9sQJzUHSqkUg8chbe88",
  );
  const [amount, setAmount] = useState(0.1);

  const toast = useToast();

  const sendSOL = useCallback(async () => {
    if (!publicKey) {
      throw new WalletNotConnectedError() && alert("Wallet not connected");
    }

    setIsLoading(true);
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(address), // replace the publickey with desred secondary wallet
          lamports: amount * LAMPORTS_PER_SOL, // transfering 1 SOL
        }),
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");
      console.log(
        `Transaction confirmed: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      );
      toast({
        title: "Transaction Success",
        description: "Transaction",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Transfer Failed",
        description: "Something went wrong, please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey, toast, address, sendTransaction, amount]);

  return (
    <VStack
      bg={useColorModeValue("gray.200", "gray.700")}
      rounded="xl"
      ref={ref}
      {...props}
    >
      <FormControl>
        <FormLabel>Solana Address</FormLabel>
        <Input
          placeholder="Solana Address"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />
        <FormHelperText>
          The public address of the wallet you want to send SOL to
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Amount</FormLabel>
        <Input
          placeholder="Amount"
          onChange={(e) => setAmount(Number(e.target.value))}
          value={amount}
        />
        <FormHelperText>The amount of SOL you want to send</FormHelperText>
      </FormControl>

      <Button isLoading={isLoading} onClick={sendSOL}>
        Send SOL
      </Button>
    </VStack>
  );
});

export default TransactionComponent;
