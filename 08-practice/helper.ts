import { fixEncoderSize, getBytesEncoder, type ReadonlyUint8Array } from "gill";
import type { BuyInstructionDataArgs } from "./type.js";
import {
  BUY_DISCRIMINATOR,
  getBuyInstructionDataCodec,
  getBuyInstructionDataDecoder,
  getBuyInstructionDataEncoder,
} from "./buy.js";
import bs58 from "bs58";
// 你可以这样尝试下会有什么不同
// fixEncoderSize(getBytesEncoder(), 8).encode(BUY_DISCRIMINATOR)
const buyDiscriminatorBytes = fixEncoderSize(getBytesEncoder(), 8).encode(
  new Uint8Array([11, 102, 6, 61, 18, 1, 218, 235, 234, 11])
);
console.log(buyDiscriminatorBytes);

// 这里就可以看出 什么是 序列化 和 反序列化了  编码 和 解码
const args = {
  amount: 1,
  maxSolCost: 1,
};
const buyInstructionData = getBuyInstructionDataEncoder().encode(
  args as BuyInstructionDataArgs
);
console.log(buyInstructionData);
const buyInstructionDataDecode =
  getBuyInstructionDataDecoder().decode(buyInstructionData);
console.log(args, buyInstructionDataDecode);

// 其实也可以自己写一个通用解码函数  毕竟都是根据 字段的字节数进行偏移 找出对应数据的对应位置 然后进行解码
// 当然这里就是简单的说明  肯定是 codama生成的更加的完善
const BUY_INSTRUCTION_FIELDS = [
  // 这里就不需要了 因为固定的就是8字节
  // ["discriminator", { fieldType: "bytes", size: 8, value: BUY_DISCRIMINATOR }],
  ["amount", "u64"],
  ["maxSolCost", "u64"],
];
function decodeInstructionData(fields: any, data: Buffer) {
  let offset = 8;
  let parsedData: any = {};
  for (const [fieldName, fieldType] of fields) {
    if (fieldType === "pubkey") {
      const value = data.subarray(offset, offset + 32);
      parsedData[fieldName] = bs58.encode(value) as any;
      offset += 32;
    } else if (fieldType === "u64" || fieldType === "i64") {
      const value = data.readBigUInt64LE(offset);
      parsedData[fieldName] = Number(value) as any;
      offset += 8;
    } else if (fieldType === "u16") {
      const value = data.readUInt16LE(offset);
      parsedData[fieldName] = value as any;
      offset += 2;
    } else if (fieldType === "u8") {
      const value = data.readUInt8(offset);
      parsedData[fieldName] = value as any;
      offset += 1;
    } else if (fieldType === "pubkey[8]") {
      const pubkeyArray: string[] = [];
      for (let i = 0; i < 8; i++) {
        const value = data.subarray(offset, offset + 32);
        pubkeyArray.push(bs58.encode(value));
        offset += 32;
      }
      parsedData[fieldName] = pubkeyArray as any;
    }
  }
  return parsedData;
}
console.log(
  decodeInstructionData(BUY_INSTRUCTION_FIELDS, Buffer.from(buyInstructionData))
);