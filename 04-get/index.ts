import {
  address,
  commitmentComparator,
  createSolanaRpc,
  lamports,
  LAMPORTS_PER_SOL,
  type Base64EncodedBytes,
  type Base58EncodedBytes,
  type Signature,
} from "gill";
import bs58 from "bs58";
import { rpc } from "../client.js";
// https://solana.com/ja/docs/rpc/http  方法都在这里
// 1. getSlot
const slot = await rpc.getSlot().send();
console.log(`当前slot: ${slot.toString()}\n`);

// 2. getBalance
// const { value: balance } = await rpc
//   .getBalance(address("CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1"))
//   .send();
// console.log(`J1to1余额: ${balance / lamports(BigInt(LAMPORTS_PER_SOL))} SOL\n`);

// 3. getTokenAccountBalance
// const { value: tokenAccountBalance } = await rpc
//   .getTokenAccountBalance(
//     address("48gpnn8nsmkvkgso7462Z1nFhUrprGQ71u1YLBPzizbY")
//   )
//   .send();
// console.log(`token账户余额: ${JSON.stringify(tokenAccountBalance)}\n`);

// 4. getFirstAvailableBlock
// const firstAvailableBlock = await rpc.getFirstAvailableBlock().send();
// console.log(`首个可用区块: ${firstAvailableBlock}\n`);

// 5. getLatestBlockhash
// const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
// console.log(`最新区块哈希: ${latestBlockhash.blockhash}\n`);

// 6. getParsedAccountInfo
// const { value: parsedAccountInfo } = await rpc
//   .getAccountInfo(address("8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj"))
//   .send();
// console.log("已解析的账户信息：", parsedAccountInfo);

// 7. getParsedTransaction
// const parsedTransaction = await rpc
//   .getTransaction(
//     "2BWvZ6bdEAiHe3oDmafpdJoRhFwxDUAdauMPbDWQs1LwBZWzG5w4jrLtWY6P8G1ky4VcSrqRMmZVbFeDUCpcNZLW" as Signature,
//     {
//       maxSupportedTransactionVersion: 0,
//       encoding: "jsonParsed",
//     }
//   )
//   .send();
// console.log(
//   `已解析的交易:`,
//   parsedTransaction?.blockTime
//   //   parsedTransaction?.transaction
// );

// 8. getSignaturesForAddress
// const signatures = await rpc
//   .getSignaturesForAddress(
//     address("Vote111111111111111111111111111111111111111"),
//     {
//       limit: 3,
//     }
//   )
//   .send();
// console.log(`最近的3笔交易签名: `, signatures);

// 9. getTokenAccountsByOwner 返回代币持有者的所有 SPL 代币账户
// const { value: tokenAccountsByOwner } = await rpc
//   .getTokenAccountsByOwner(
//     address("AMHc45Z7NJCiyQ3Zn1bvgY953AzLQqDm3s6he9VruBLe"),
//     {
//       mint: address("59XSiYRqUp1UTv3BGWz4jucpTAGkq3pzLQMAxKBBnQzp"),
//     },
//     { encoding: "jsonParsed" }
//   )
//   .send();
// console.log(
//   `token账户:`,
//   tokenAccountsByOwner[0].account.data.parsed.info.tokenAmount
// );

// 10. getTokenLargestAccounts
// const tokenLargestAccounts = await rpc
//   .getTokenLargestAccounts(
//     address("59XSiYRqUp1UTv3BGWz4jucpTAGkq3pzLQMAxKBBnQzp")
//   )
//   .send();
// console.log(`20个token最大持有者账户:`, tokenLargestAccounts);

// 11. getTokenSupply
// const { value: supplyInfo } = await rpc
//   .getTokenSupply(address("59XSiYRqUp1UTv3BGWz4jucpTAGkq3pzLQMAxKBBnQzp"))
//   .send();
// console.log(`Total supply: `, supplyInfo.uiAmountString);

// 12. getProgramAccounts 提供的程序返回 Pubkey 拥有的所有帐户

let program = address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const mainNetRpcClient = createSolanaRpc("...");
let accounts = await mainNetRpcClient
  .getProgramAccounts(program, {
    encoding: "base58",
    filters: [
      {
        dataSize: BigInt(165),
      },
      {
        memcmp: {
          offset: 32n,
          bytes: "CDNcMNZAPmpoiqquyHaQ89wYLWtfDhHpii2JZntFf7Qh",
        },
      },
    ],
  })
  .send();
console.log("前3个账户:", accounts);
