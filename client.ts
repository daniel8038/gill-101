import {
  createSolanaClient,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  type SolanaClusterMoniker,
  
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import {
  estimateAndUpdateProvisoryComputeUnitLimitFactory,
  estimateComputeUnitLimitFactory,
} from "gill/programs";
const cluster: SolanaClusterMoniker = "devnet";
// 这里是createSolanaClient 自动把 https 转为 wss来处理 订阅的
// urlOrMoniker.protocol = urlOrMoniker.protocol.replace('http', 'ws');
// https://github.com/DecalLabs/gill/blob/50982c2721ba1e05e9f0981065c6fcc07dee9528/packages/gill/src/core/create-solana-client.ts#L63
const {
  rpc,
  rpcSubscriptions,
  sendAndConfirmTransaction,
  simulateTransaction,
} = createSolanaClient({
  urlOrMoniker: cluster,
});
// 也可单独创建
// const rpc = createSolanaRpc("http://localhost:8899");
// const rpcSubscriptions = createSolanaRpcSubscriptions("ws://localhost:8900");
const singer = await loadKeypairSignerFromFile("keypair.json");
const estimateAndUpdateCUs = estimateAndUpdateProvisoryComputeUnitLimitFactory(
  estimateComputeUnitLimitFactory({ rpc })
);

export {
  rpc,
  rpcSubscriptions,
  singer,
  sendAndConfirmTransaction,
  simulateTransaction,
  estimateAndUpdateCUs,
};
