import {
  address,
  generateKeyPair,
  generateKeyPairSigner,
  lamports,
  LAMPORTS_PER_SOL,
  createTransactionMessage,
  createTransaction,
  signTransactionMessageWithSigners,
  getExplorerLink,
} from "gill";
import { getSetComputeUnitPriceInstruction } from "gill/programs";
import { getTransferSolInstruction } from "@solana-program/system";

import {
  rpc,
  sendAndConfirmTransaction,
  simulateTransaction,
  singer,
} from "../client.js";

const recipinet = await generateKeyPairSigner();

const transferInstruction = getTransferSolInstruction({
  source: singer,
  destination: recipinet.address,
  amount: lamports(BigInt(LAMPORTS_PER_SOL / 100)),
});
const latestBlockhash = await rpc.getLatestBlockhash().send();
const transactionMessage = createTransaction({
  version: 0,
  feePayer: singer,
  instructions: [
    getSetComputeUnitPriceInstruction({ microLamports: 5000n }),
    transferInstruction,
  ],
  latestBlockhash: latestBlockhash.value,
});
const signTx = await signTransactionMessageWithSigners(transactionMessage);

let signature = await sendAndConfirmTransaction(signTx);

console.log("\nExplorer Link (for creating the mint):");
console.log(
  getExplorerLink({
    cluster: "devnet",
    transaction: signature,
  })
);
