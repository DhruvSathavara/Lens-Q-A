import { sendTx } from "../services/ethers-service";
import { pollUntilIndexed } from "./has-transaction-been-indexed";

 

export const sendTransaction = async (transactionParameters) => {
  const txHash = await sendTx(transactionParameters); 
  await pollUntilIndexed(txHash); 
}