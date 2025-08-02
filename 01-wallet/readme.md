gill 有一个特性：[默认不可提取](https://gill.site/docs/getting-started/signers#non-extractable-by-default)，所以那再 gengrate.ts 文件里也可看到，输出的是一个对象，没有 2mWNaEKEJrtB1rEvHsFx8aFDZo6UAG9Em9xt79xAZQfoDHFZt2D2YHj6Wa72uFezFw 这种格式的输出，也没有 ArrayBuffer 那样的。

涉及的方法，就这些。

```ts
// 这里的方法也不是很重要 主要是了解 singer 对象，和 这个 可提取的特性
import {
  generateKeyPair,
  generateKeyPairSigner,
  generateExtractableKeyPair,
  generateExtractableKeyPairSigner,
  createNoopSigner,
  createPrivateKeyFromBytes,
} from "gill";
// 更多的应该使用 这里的封装好的工具函数  这里就没有必要去讲了 看函数命名都知道是干嘛的
import {
  loadKeypairFromEnvironment,
  loadKeypairFromEnvironmentBase58,
  loadKeypairFromFile,
  loadKeypairSignerFromEnvironment,
  loadKeypairSignerFromEnvironmentBase58,
  loadKeypairSignerFromFile,
  saveKeypairSignerToEnvFile,
  saveKeypairSignerToFile,
  saveKeypairToEnvFile,
  saveKeypairToFile,
} from "gill/node";
```

在 generate.ts 文件中执行相应的函数的时候，你会发现输出的并不是 solana/web3js 那种 Bytes，这里变成了一个对象

```ts
 {
  address: 'C83WCN3sD6vSxiGSY6GDyCdbMKqnvpMV9fAW92XfgVHs',
  keyPair: [Object: null prototype] {
    privateKey: CryptoKey {
      type: 'private',
      extractable: false,
      algorithm: { name: 'Ed25519' },
      usages: [ 'sign' ]
    },
    publicKey: CryptoKey {
      type: 'public',
      extractable: true,
      algorithm: { name: 'Ed25519' },
      usages: [ 'verify' ]
    }
  },
  signMessages: [Function: signMessages],
  signTransactions: [Function: signTransactions]
}
```

extractable 就是 gill 说的可提取了，为 false 的属性是提取不出私钥的

具体的代码可以看[这里](https://github.com/DecalLabs/gill/blob/50982c2721ba1e05e9f0981065c6fcc07dee9528/packages/gill/src/core/keypairs-extractable.ts#L55C23-L55C46)

`assertKeyPairIsExtractable(keypair);`就是判断 extractable 是否为 true 的否则直接报错，当前没有这个在执行 exportKey 的时候一样会报错的 `InvalidAccessException: key is not extractable`

我们可以自己写一个

```ts
async function exportCryptoKey(singer: KeyPairSigner<string>) {
  // 这里其实 第一步是要做判断 是否为可提取的密钥  不过这就是个简单的解释  就不做这个判断了  业务里也不自己写 会直接使用 gill的方法
  const keyPair = singer.keyPair;
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey 这里是crypto的资料
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
```

关于钱包的就这么多了，其实没什么可以学的，在使用的时候还是加载一个 Singer 对象，用于签名什么的，也比较方便
