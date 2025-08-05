这一节是讲实际的程序交互，把前边的知识应用一下。之后继续讲 alt 地址查找表。

首先我们要看 solana 官方对[交易和指令](https://www.solana-cn.com/SolanaBasic/000.html#%E4%BA%A4%E6%98%93)的解释

所以我们要做成一笔交易的步骤就是：

组装交易结构->进行交易签名->发送交易到 rpc 节点

这一点对于所有链都一样，都是这样的步骤。所以研究一条链的交互，摸通基础的知识之后，首先要去学习的就是如何组装交易对象。

其实在之前啊，使用 solana/web3js 的时候，通常是用 @coral-xyz/anchor 这个库进行配合开发程序的交互的。在 gill 这个库中，推荐是使用 codama 进行配合使用。codama 会根据你提供的自动为你生成相关的交互代码，我们就从他生成的代码来学习如何进行程序交互。

[codama 使用教程](https://www.quicknode.com/guides/solana-development/anchor/codama-client)

在 generated 中是使用 pumpfun 的 IDL 生成的代码，我们来研究他的 buy 方法的交互。学习他的代码。

# 基础知识

在开始之前那，我们要记住一个基础的知识：

solana 的交易或者说指令是并行的，solana 会检查指令账户的依赖关系，或者说交易涉及的 accounts 的依赖关系，如果互不依赖，solana 会使用不同的线程执行这些交易，互不阻塞。有依赖关系的就按照顺序执行。这也是 solana 交易速度快的一个重要原因

其实这个每条链都一样，你要执行交易的话要让 rpc 知道你要交互哪一个程序，哪一个函数，提供了那些参数。在根据每条链不同的性质，提供额外的不同的数据。

在官方文档可以看到一个 instruction 包含

· program_id：所针对的程序的 id

· accounts：需要读或写的全部账户组成的数组

· instruction_data：向指定程序所传输的数据的字节码

- instruction_data 就是，告诉区块链交互程序的哪一个指令，提供了哪些参数。

  - 这通常是一个字节数组（ReadonlyUint8Array），包含：指令签名：一个固定长度的字节序列（通常 8 字节），用于标识指令类型（例如 [102, 6, 61, 18, 1, 218, 235, 234] 表示 Buy 指令）。

  ```ts
  export const BUY_DISCRIMINATOR = new Uint8Array([
    102, 6, 61, 18, 1, 218, 235, 234,
  ]);
  ```

  - 参数数据：指令所需的具体参数，例如代币数量、价格等，序列化后附加在签名之后。

- 如果你是 evm 开发者的话，你可以从 calldata 方面理解 instruction_data

  - 函数选择器：函数签名的 Keccak-256 哈希的前 4 个字节，例如 transfer(address, uint256) 的选择器是 0xa9059cbb。
  - 参数数据：按 ABI（Application Binary Interface）规范编码的参数，例如接收者地址和转账金额。

那这里我们就知道了，一个交易的基础知识，也知道了 instruction 都包含什么。下边就需要在实践中理解交易中的数据的生成。

# buy-instruction

我们先看 IDL,这里很明显可以看出一个 buy 交易都需要什么数据，discriminator 字段就是之前说的，指令标识符。accounts 就是这个 buy 所涉及到的账户。args 就是这个 buy 指令所需要的参数了。

```json
 {
      "name": "buy",
      "docs": ["Buys tokens from a bonding curve."],
      "discriminator": [102, 6, 61, 18, 1, 218, 235, 234],
      "accounts": [
        {
          "name": "global",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [103, 108, 111, 98, 97, 108]
              }
            ]
          }
        },
        // ......这里还有很多 直接省略了
        ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "max_sol_cost",
          "type": "u64"
        }
      ]
    },
```

IDL 了解之后就可以开始逐步的完成这个 buy 交易的代码了。

## helper function

```ts
// fixEncoderSize这个函数是 从一个getBytesEncoder 编码器，创建一个新的并且输出长度最多为 fixedBytes: 8 的解析器
// helper.ts  文件你可以执行测试
function getBuyDiscriminatorBytes() {
  return fixEncoderSize(getBytesEncoder(), 8).encode(BUY_DISCRIMINATOR);
}
// 这个就是编码了 也就是编码成 InstructionData 对于evm的话就是 calldata
function getBuyInstructionDataEncoder(): FixedSizeEncoder<BuyInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([
      ["discriminator", fixEncoderSize(getBytesEncoder(), 8)],
      ["amount", getU64Encoder()],
      ["maxSolCost", getU64Encoder()],
    ]),
    (value) => ({ ...value, discriminator: BUY_DISCRIMINATOR })
  );
}
// 这个是解码 将InstructionData 解码成可读的数据结构
function getBuyInstructionDataDecoder(): FixedSizeDecoder<BuyInstructionData> {
  return getStructDecoder([
    ["discriminator", fixDecoderSize(getBytesDecoder(), 8)],
    ["amount", getU64Decoder()],
    ["maxSolCost", getU64Decoder()],
  ]);
}
// 同时具有解码和编码的功能
export function getBuyInstructionDataCodec(): FixedSizeCodec<
  BuyInstructionDataArgs,
  BuyInstructionData
> {
  return combineCodec(
    getBuyInstructionDataEncoder(),
    getBuyInstructionDataDecoder()
  );
}
```

上边这些 helper function 可以帮助我们更好的处理 InstructionData，之后就到了重要的一步 构建 buy 交易的 Instruction 了

也就是这三部分：

- program_id：所针对的程序的 id 

- accounts：需要读或写的全部账户组成的数组

- instruction_data：向指定程序所传输的数据的字节码

