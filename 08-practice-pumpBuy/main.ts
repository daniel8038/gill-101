import {
  estimateAndUpdateCUs,
  rpc,
  sendAndConfirmTransaction,
  signer,
} from "../client.js";
import { getBuyInstructionAsync, PUMP_PROGRAM_ADDRESS } from "./buy.js";
import { fetchGlobal } from "../generated/accounts/global.js";
import { fetchBondingCurve } from "../generated/accounts/bondingCurve.js";
import {
  address,
  createTransaction,
  getAddressEncoder,
  getBytesEncoder,
  getExplorerLink,
  getProgramDerivedAddress,
  getSignatureFromTransaction,
  LAMPORTS_PER_SOL,
  signTransactionMessageWithSigners,
  type Address,
} from "gill";
import {
  getAssociatedTokenAccountAddress,
  getCreateAssociatedTokenIdempotentInstruction,
  TOKEN_2022_PROGRAM_ADDRESS,
  TOKEN_PROGRAM_ADDRESS,
} from "gill/programs";
import { expectAddress } from "./utils.js";
// 我们在开发网进行测试
async function main() {
  const MINT = address("HMyMJYYaKVyetLLtfYU1m6QrexpMyswPa6Tewpdx5b9R");
  const mint_use_ata = await getAssociatedTokenAccountAddress(MINT, signer);

  // feeRecipient 这个地址是在global账户里的 也可以直接使用常量
  const [globalAccountAddress] = await getProgramDerivedAddress({
    programAddress: PUMP_PROGRAM_ADDRESS,
    seeds: [
      getBytesEncoder().encode(new Uint8Array([103, 108, 111, 98, 97, 108])),
    ],
  });
  const globalData = await fetchGlobal(rpc, globalAccountAddress);

  const [bondingCurveAddress] = await getProgramDerivedAddress({
    programAddress: PUMP_PROGRAM_ADDRESS,
    seeds: [
      getBytesEncoder().encode(
        new Uint8Array([
          98, 111, 110, 100, 105, 110, 103, 45, 99, 117, 114, 118, 101,
        ])
      ),
      getAddressEncoder().encode(expectAddress(MINT)),
    ],
  });
  const bondingCurveData = await fetchBondingCurve(rpc, bondingCurveAddress);
  console.log(bondingCurveData.data.complete);
  const [creatorVault] = await getProgramDerivedAddress({
    programAddress: PUMP_PROGRAM_ADDRESS,
    seeds: [
      getBytesEncoder().encode(
        new Uint8Array([
          99, 114, 101, 97, 116, 111, 114, 45, 118, 97, 117, 108, 116,
        ])
      ),
      getAddressEncoder().encode(expectAddress(bondingCurveData.data.creator)),
    ],
  });
  // 这还是可以的 给出必要的账户就行
  const buyInstruction = await getBuyInstructionAsync({
    feeRecipient: globalData.data.feeRecipient,
    mint: MINT,
    associatedUser: mint_use_ata,
    user: signer,
    creatorVault: creatorVault,
    program: PUMP_PROGRAM_ADDRESS,
    amount: 3336380356192,
    maxSolCost: 1 * LAMPORTS_PER_SOL,
    global: globalAccountAddress,
    bondingCurve: bondingCurveAddress,
  });
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const transactionMessage = createTransaction({
    feePayer: signer,
    version: 0,
    instructions: [
      // 我们需要先使用这个函数处理 用户的ATA
      // 这里有一个问题极其恶心
      //  getAssociatedTokenAccountAddress这个函数默认使用的 TOKEN_PROGRAM_ADDRESS 作为 tokenProgram
      //  但是getCreateAssociatedTokenIdempotentInstruction 去看了源码 才看见 他使用的是 TOKEN_2022_PROGRAM_ADDRESS
      //  就导致了 ATA 一直报错 seeds 不对  我以为他们是默认是一样的......
      // 'Program log: AnchorError caused by account: associated_user. Error Code: AccountNotInitialized. Error Number: 3012. Error Message: The program expected this account to be already initialized.',
      getCreateAssociatedTokenIdempotentInstruction({
        payer: signer,
        ata: mint_use_ata,
        owner: signer.address,
        mint: MINT,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      }),
      buyInstruction,
    ],
    latestBlockhash,
  });
  const transactionMessageWithCus = await estimateAndUpdateCUs(
    transactionMessage
  );

  const signedTransaction = await signTransactionMessageWithSigners(
    transactionMessageWithCus
  );
  console.log(
    "Explorer:",
    getExplorerLink({
      cluster: "devnet",
      transaction: getSignatureFromTransaction(signedTransaction),
    })
  );

  await sendAndConfirmTransaction(signedTransaction);
}
//
//explorer.solana.com/tx/nGWPusCWDYRNNQnUx4xMxaZw1Ttg7uxaFJgstW9W8QV5W9qRtazMUoTDkp7ERNRde1MnGw4gpcCGDuizebmqbuq?cluster=devnet
Explorer: https: main().catch((err) => {
  console.log(err.cause);
  console.error(err);
});
