import {
  address,
  commitmentComparator,
  createSolanaClient,
  type SolanaClusterMoniker,
} from "gill";
const cluster: SolanaClusterMoniker = "mainnet";
const { rpcSubscriptions } = createSolanaClient({
  urlOrMoniker: cluster,
});
// it 旨在实现 Solana RPC WebSocket 方法文档中记录的所有 RPC 订阅方法
async function main() {
  // 1. onAccountChange
  //   const accountsNotifications = await rpcSubscriptions
  //     .accountNotifications(
  //       address("orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8"),
  //       {
  //         commitment: "confirmed",
  //       }
  //     )
  //     .subscribe({ abortSignal: AbortSignal.timeout(10_000) });
  //   for await (const accountsNotification of accountsNotifications) {
  //     console.log("账户变化", accountsNotification.value);
  //   }
  // 2. onLogs
  const allLog = await rpcSubscriptions
    .logsNotifications(
      { mentions: [address("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P")] },
      { commitment: "finalized" }
    )
    .subscribe({ abortSignal: new AbortController().signal });
  for await (const log of allLog) {
    console.log("订阅事务日志 pupmfun tx signature", log.value.logs);
  }
  // 3. slot
  //   const slotNotifications = await rpcSubscriptions
  //     .slotNotifications()
  //     .subscribe({ abortSignal: AbortSignal.timeout(10_000) });
  //   for await (const slotNotification of slotNotifications) {
  //     console.log("The network has advanced to slot", slotNotification.slot);
  //   }
  // 4. program 订阅该程序以在指定程序拥有的帐户的 lamport 或数据发生变化时接收通知
  //   const programAccount = await rpcSubscriptions
  //     .programNotifications(
  //       address("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"),
  //       { commitment: "confirmed" }
  //     )
  //     .subscribe({ abortSignal: new AbortController().signal });
  //   for await (const log of programAccount) {
  //     console.log(" lamport 或数据发生变化时接收通知", log.value.account);
  //   }
}

main();
