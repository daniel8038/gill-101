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
  prependTransactionMessageInstruction,
} from "gill";
import {
  estimateAndUpdateProvisoryComputeUnitLimitFactory,
  estimateComputeUnitLimitFactory,
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "gill/programs";
import { getTransferSolInstruction } from "@solana-program/system";

import {
  estimateAndUpdateCUs,
  rpc,
  sendAndConfirmTransaction,
  simulateTransaction,
  signer,
} from "../client.js";

const recipinet = await generateKeyPairSigner();

const transferInstruction = getTransferSolInstruction({
  source: signer,
  destination: recipinet.address,
  amount: lamports(BigInt(LAMPORTS_PER_SOL / 100)),
});
const latestBlockhash = await rpc.getLatestBlockhash().send();
const transactionMessage = createTransaction({
  version: 0,
  feePayer: signer,
  instructions: [
    getSetComputeUnitPriceInstruction({ microLamports: 5000n }),
    transferInstruction,
  ],
  latestBlockhash: latestBlockhash.value,
});

const transactionMessageWithCUs = await estimateAndUpdateCUs(
  transactionMessage
);

console.log("transactionMessageWithCUs", transactionMessageWithCUs);
const signTx = await signTransactionMessageWithSigners(
  transactionMessageWithCUs
);

// 优化CU
let signature = await sendAndConfirmTransaction(signTx);

console.log("\nExplorer Link (for creating the mint):");
console.log(
  getExplorerLink({
    cluster: "devnet",
    transaction: signature,
  })
);
