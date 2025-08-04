import {
  combineCodec,
  fixDecoderSize,
  fixEncoderSize,
  getBytesDecoder,
  getBytesEncoder,
  getStructDecoder,
  getStructEncoder,
  getU64Decoder,
  getU64Encoder,
  transformEncoder,
  type FixedSizeCodec,
  type FixedSizeDecoder,
  type FixedSizeEncoder,
} from "gill";
import type { BuyInstructionData, BuyInstructionDataArgs } from "./type.js";
// 可以先了解下  chainbuff的solana/web3js的buffer的那篇文章  这里的很多函数 其实只是在做 序列化 和 反序列化  人话就是：可读化 和 不可读化
// 确定指令标识符 这里在IDL 中可以找到 自己找找看吧 discriminator 字段
export const BUY_DISCRIMINATOR = new Uint8Array([
  102, 6, 61, 18, 1, 218, 235, 234,
]);

// 这里就是确保我们的BUY_DISCRIMINATOR 是一个正确的格式
// 这里有一个fixEncoderSize源码链接，其实是接受一个 Encoder 编码器，然后和一个fixedBytes，返回一个新的编码器 之后输出字节数组的固定长度为fixedBytes的
// https://github.com/anza-xyz/kit/blob/9205484d33af9426fc9de9594bab204b8f954faf/packages/codecs-core/src/fix-codec-size.ts#L47
// 之后一般不会在涉及到 solana/kit中的源码的 解释，直接AI就好。解释过多会显得冗长
export function getBuyDiscriminatorBytes() {
  return fixEncoderSize(getBytesEncoder(), 8).encode(BUY_DISCRIMINATOR);
}
// 下边的这两个函数根据返回的类型就可以看出 返回的是特定结构的 编码器 和 解码器  其实自己写代码的时候直接设置一个函数返回直接的数据就好了  但是codama生成的代码是不好改的 这里就原模原样的不做更改了  你可以直接自己尝试 接受一个 args 返回一个数据 而不是编码器
// 这里其实又是返回的一个编码器 helper.ts 中查看使用方式
export function getBuyInstructionDataEncoder(): FixedSizeEncoder<BuyInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([
      ["discriminator", fixEncoderSize(getBytesEncoder(), 8)],
      ["amount", getU64Encoder()],
      ["maxSolCost", getU64Encoder()],
    ]),
    (value) => ({ ...value, discriminator: BUY_DISCRIMINATOR })
  );
}
// 这里就是解码了 helper.ts 中查看使用方式 也有自己定义一个解码的通用函数
export function getBuyInstructionDataDecoder(): FixedSizeDecoder<BuyInstructionData> {
  return getStructDecoder([
    ["discriminator", fixDecoderSize(getBytesDecoder(), 8)],
    ["amount", getU64Decoder()],
    ["maxSolCost", getU64Decoder()],
  ]);
}
// 这个函数就是将编码器和解码器合成一个 既可以编码也可以解码  不做过多解释了
export function getBuyInstructionDataCodec(): FixedSizeCodec<
  BuyInstructionDataArgs,
  BuyInstructionData
> {
  return combineCodec(
    getBuyInstructionDataEncoder(),
    getBuyInstructionDataDecoder()
  );
}
