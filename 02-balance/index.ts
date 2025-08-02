import { rpc, singer } from "../client.js";
// 这里没什么东西  主要是要看一下 client 的实现 创建rpc 和 wss 客户端
const balance = await rpc.getBalance(singer.address).send();
console.log("余额", balance);
