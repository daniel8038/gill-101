import {
  generateKeyPair,
  generateKeyPairSigner,
  generateExtractableKeyPair,
  generateExtractableKeyPairSigner,
  createNoopSigner,
  createPrivateKeyFromBytes,
  extractBytesFromKeyPair,
  extractBytesFromKeyPairSigner,
  createKeyPairSignerFromBytes,
  KeyPairSigner,
} from "gill";
import { exportCryptoKey } from "../utils.js";

// 关于wallet 或者 singer 的方法就这几个，文档明确说明Extractable的方式 谨慎使用  所以业务一般使用 generateKeyPairSigner
// 生成密钥对
const { privateKey, publicKey } = await generateKeyPair();
console.log("---------------generateKeyPair-----------------");
console.log("generateKeyPair", publicKey, privateKey);
// 生成singer 对象
console.log("---------------generateKeyPairSigner-----------------");
const singer = await generateKeyPairSigner();
console.log("generateKeyPairSigner", singer);

//////////////////////////////////////
//////////////以下是可提取私钥的////////
/////////////////////////////////////
console.log("---------------extractableSinger-----------------");
const singerExtractable = await generateExtractableKeyPairSigner();

const data = await exportCryptoKey(singerExtractable);
console.log("钱包公钥:", data.publicKey);
console.log("钱包私钥:", data.privateKey);

// 其实gill已经帮我们封装好了这些 工具函数
const keyPairBytes = await extractBytesFromKeyPairSigner(singerExtractable);
console.log("钱包私钥Bytes:", keyPairBytes);
