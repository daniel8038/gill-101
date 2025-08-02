import bs58 from "bs58";
import { type KeyPairSigner } from "gill";

// 这里是简单说明一下这里是如何处理的 源码是在 https://github.com/DecalLabs/gill/blob/50982c2721ba1e05e9f0981065c6fcc07dee9528/packages/gill/src/core/keypairs-extractable.ts#L55C23-L55C46
// 资料是在 https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey
export async function exportCryptoKey(singer: KeyPairSigner<string>) {
  // 这里其实 第一步是要做判断 是否为可提取的密钥  不过这就是个简单的解释  就不做这个判断了  业务里也不自己写 会直接使用 gill的方法
  const keyPair = singer.keyPair;
  const [publicBuffer, privateKeyJwk] = await Promise.all([
    crypto.subtle.exportKey("raw", keyPair.publicKey),
    crypto.subtle.exportKey("jwk", keyPair.privateKey),
  ]);
  if (!privateKeyJwk.d) throw new Error("Failed to get private key bytes");

  const formatPublic = bs58.encode(new Uint8Array(publicBuffer));
  const fullBytes = new Uint8Array([
    ...Buffer.from(privateKeyJwk.d, "base64"),
    ...new Uint8Array(publicBuffer),
  ]);
  const formatPrivate = bs58.encode(fullBytes);
  return {
    privateKey: formatPrivate,
    publicKey: formatPublic,
    address: singer.address,
  };
}
