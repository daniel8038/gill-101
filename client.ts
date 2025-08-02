import {
  createSolanaClient,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  SolanaClusterMoniker,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
const cluster: SolanaClusterMoniker = "devnet";
// 这里是createSolanaClient 自动把 https 转为 wss来处理 订阅的
// urlOrMoniker.protocol = urlOrMoniker.protocol.replace('http', 'ws');
// https://github.com/DecalLabs/gill/blob/50982c2721ba1e05e9f0981065c6fcc07dee9528/packages/gill/src/core/create-solana-client.ts#L63
const { rpc, rpcSubscriptions } = createSolanaClient({
  urlOrMoniker: cluster,
});
// 也可单独创建
// createSolanaRpc("http");
// createSolanaRpcSubscriptions("wss:");
const singer = await loadKeypairSignerFromFile("keypair.json");

export { rpc, rpcSubscriptions, singer };
