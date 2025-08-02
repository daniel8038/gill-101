// 在这里官方文档写了关于token的操作  我们这里只学习转移就好了
// https://github.com/DecalLabs/gill/tree/master/examples/tokens/src
import {
  address,
  createTransaction,
  getExplorerLink,
  getSignatureFromTransaction,
  signTransactionMessageWithSigners,
} from "gill";
import {
  getAssociatedTokenAccountAddress,
  getCreateAssociatedTokenIdempotentInstruction,
  getTransferInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "gill/programs/token";
import {
  estimateAndUpdateCUs,
  rpc,
  sendAndConfirmTransaction,
  signer,
} from "../client.js";
import { getSetComputeUnitLimitInstruction, getSetComputeUnitPriceInstruction } from "gill/programs";

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const mint = address("HwxZNMkZbZMeiu9Xnmc6Rg8jYgNsJB47jwabHGUebW4F");
const tokenProgram = TOKEN_PROGRAM_ADDRESS;

const destination = address("nick6zJc6HpW3kfBm4xS2dmbuVRyb5F3AnUvj5ymzR5");
// 查询对方的ATA 也就是对方的token账户  注意这里是查询 因为 ATA 也算是PDA  可以提前知道派生地址是多少
const destinationAta = await getAssociatedTokenAccountAddress(
  mint,
  destination,
  tokenProgram
);
// 查询自己的token账户
const sourceAta = await getAssociatedTokenAccountAddress(
  mint,
  signer,
  tokenProgram
);
//创建指令
const transaction = createTransaction({
  feePayer: signer,
  version: "legacy",
  instructions: [
    // create idempotent will gracefully fail if the ata already exists. this is the gold standard!
    //如果 ATA 账户不存在: 这个指令会成功创建一个新的 ATA 账户。
    //如果 ATA 账户已经存在: 这个指令会优雅地失败，并且不会导致整个交易回滚。链上程序会检测到账户已存在，然后直接跳过创建步骤，交易会继续执行下一个指令
    // 这里其实就是根据我们之前查出来的 destinationAta ，判断对方是否有这个账户 没有就为其创建 不然转不了
    // 不必检查自己的ATA了 毕竟是转移token  有token 就必定有ATA 没必要检查
    getCreateAssociatedTokenIdempotentInstruction({
      mint,
      payer: signer,
      tokenProgram,
      owner: destination,
      ata: destinationAta,
    }),
    getTransferInstruction({
      source: sourceAta,
      authority: signer,
      destination: destinationAta,
      amount: 1000n,
    }),
  ],
  latestBlockhash,
});
const transactionMessageWithCUs = await estimateAndUpdateCUs(transaction);
console.log("transactionMessageWithCUs", transactionMessageWithCUs);
const signedTransaction = await signTransactionMessageWithSigners(
  transactionMessageWithCUs
);

console.log(
  "Explorer:",
  getExplorerLink({
    cluster: "devnet",
    transaction: getSignatureFromTransaction(signedTransaction),
  })
);

await sendAndConfirmTransaction(signedTransaction);
// 这里的代码就是这样 但是我测试网没有token  就不测试了  这代码也是直接从官方拿的 我加了个cu估算
