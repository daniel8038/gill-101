import {
  address,
  commitmentComparator,
  createSolanaRpc,
  lamports,
  LAMPORTS_PER_SOL,
  type Base64EncodedBytes,
  type Base58EncodedBytes,
  type Signature,
  fetchEncodedAccount,
} from "gill";
import bs58 from "bs58";
import { rpc } from "../client.js";
import {
  TOKEN_2022_PROGRAM_ADDRESS,
  TOKEN_PROGRAM_ADDRESS,
} from "gill/programs";
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
// const accountToFetch = address("8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj");
// const account = await fetchEncodedAccount(rpc, accountToFetch);
// console.log("已解析的账户信息：", account);
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
const mainNetRpcClient = createSolanaRpc(
  "https://delicate-bitter-meadow.solana-mainnet.quiknode.pro/cfcf4b66ee16de962b28fb9cbed2a2cd66ed5329/"
);
const { value: tokenAccountsByOwner } = await mainNetRpcClient
  .getTokenAccountsByOwner(
    address("8D4SDVbJJs8huNCRAxbSrCpnJFgZ7ahajCbrsBqLK3CP"),
    {
      programId: TOKEN_PROGRAM_ADDRESS,
    },
    { encoding: "jsonParsed" }
  )
  .send();
const { value: tokenAccountsByOwner_2022 } = await mainNetRpcClient
  .getTokenAccountsByOwner(
    address("8D4SDVbJJs8huNCRAxbSrCpnJFgZ7ahajCbrsBqLK3CP"),
    {
      programId: TOKEN_2022_PROGRAM_ADDRESS,
    },
    { encoding: "jsonParsed" }
  )
  .send();
// CDNcMNZAPmpoiqquyHaQ89wYLWtfDhHpii2JZntFf7Qh 21
// 8D4SDVbJJs8huNCRAxbSrCpnJFgZ7ahajCbrsBqLK3CP 6
console.log(
  `token账户:`,
  tokenAccountsByOwner.length + tokenAccountsByOwner_2022.length
);

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

// let program = address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
// const mainNetRpcClient = createSolanaRpc("...");
// let accounts = await mainNetRpcClient
//   .getProgramAccounts(program, {
//     encoding: "base58",
//     filters: [
//       {
//         dataSize: BigInt(165),
//       },
//       {
//         memcmp: {
//           offset: 32n,
//           bytes: "CDNcMNZAPmpoiqquyHaQ89wYLWtfDhHpii2JZntFf7Qh",
//         },
//       },
//     ],
//   })
//   .send();
// console.log(accounts);
