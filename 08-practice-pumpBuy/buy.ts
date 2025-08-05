import {
  combineCodec,
  fixDecoderSize,
  fixEncoderSize,
  getAddressEncoder,
  getBytesDecoder,
  getBytesEncoder,
  getProgramDerivedAddress,
  getStructDecoder,
  getStructEncoder,
  getU64Decoder,
  getU64Encoder,
  transformEncoder,
  type Address,
  type FixedSizeCodec,
  type FixedSizeDecoder,
  type FixedSizeEncoder,
} from "gill";
import type {
  BuyAsyncInput,
  BuyInput,
  BuyInstruction,
  BuyInstructionData,
  BuyInstructionDataArgs,
  ResolvedAccount,
} from "./type.js";
import { expectAddress, getAccountMetaFactory } from "./utils.js";
// 可以先了解下  chainbuff的solana/web3js的buffer的那篇文章  这里的很多函数 其实只是在做 序列化 和 反序列化  人话就是：可读化 和 不可读化
// 确定指令标识符 这里在IDL 中可以找到 自己找找看吧 discriminator 字段
export const BUY_DISCRIMINATOR = new Uint8Array([
  102, 6, 61, 18, 1, 218, 235, 234,
]);

export const PUMP_PROGRAM_ADDRESS =
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P" as Address<"6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P">;

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
    (value) => ({
      ...value,
      discriminator: new Uint8Array([102, 6, 61, 18, 1, 218, 235, 234]),
    })
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

// input就是需要的 accounts config 就是配置程序地址 但是其实没必要  因为地址会使用常量进行配置
export async function getBuyInstructionAsync<
  TAccountGlobal extends string,
  TAccountFeeRecipient extends string,
  TAccountMint extends string,
  TAccountBondingCurve extends string,
  TAccountAssociatedBondingCurve extends string,
  TAccountAssociatedUser extends string,
  TAccountUser extends string,
  TAccountSystemProgram extends string,
  TAccountTokenProgram extends string,
  TAccountCreatorVault extends string,
  TAccountEventAuthority extends string,
  TAccountProgram extends string,
  TAccountGlobalVolumeAccumulator extends string,
  TAccountUserVolumeAccumulator extends string,
  TProgramAddress extends Address = typeof PUMP_PROGRAM_ADDRESS
>(
  input: BuyAsyncInput<
    TAccountGlobal,
    TAccountFeeRecipient,
    TAccountMint,
    TAccountBondingCurve,
    TAccountAssociatedBondingCurve,
    TAccountAssociatedUser,
    TAccountUser,
    TAccountSystemProgram,
    TAccountTokenProgram,
    TAccountCreatorVault,
    TAccountEventAuthority,
    TAccountProgram,
    TAccountGlobalVolumeAccumulator,
    TAccountUserVolumeAccumulator
  >,
  config?: { programAddress?: TProgramAddress }
) {
  // Program address.
  const programAddress = config?.programAddress ?? PUMP_PROGRAM_ADDRESS;
  // Original accounts. 这是我们应该设置的所有的accounts 并且是所需要的格式  一共14个 你可以在IDL中查看
  const originalAccounts = {
    global: { value: input.global ?? null, isWritable: false },
    feeRecipient: { value: input.feeRecipient ?? null, isWritable: true },
    mint: { value: input.mint ?? null, isWritable: false },
    bondingCurve: { value: input.bondingCurve ?? null, isWritable: true },
    associatedBondingCurve: {
      value: input.associatedBondingCurve ?? null,
      isWritable: true,
    },
    associatedUser: { value: input.associatedUser ?? null, isWritable: true },
    user: { value: input.user ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    creatorVault: { value: input.creatorVault ?? null, isWritable: true },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    program: { value: input.program ?? null, isWritable: false },
    globalVolumeAccumulator: {
      value: input.globalVolumeAccumulator ?? null,
      isWritable: true,
    },
    userVolumeAccumulator: {
      value: input.userVolumeAccumulator ?? null,
      isWritable: true,
    },
  };
  //
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;
  // Original args.
  const args = { ...input };
  // codama 与 @coral-xyz/anchor 不同的是 @coral-xyz/anchor把这些给封装起来了 codama是直接可以看到这些账户的处理
  // 处理没有提供的账户 其实这里的一些账户一般来说 项目方是不会更改的 不会有频繁的变动 所以直接设置一个常量 在input传入就行 就省去了计算PDA的时间
  // 从这一个简单的函数就可以看出 只要是PDA的账户 在这里都可以处理 只要参数足够 所以我们只要input里有不是pda的和生产pda的必要参数就够了
  // 当然你是可以直接在外部进行获取的 获取之后保存在一个json文件或者数据库 那下次就可以直接从缓存中获取  也是不需要计算的
  if (!accounts.global.value) {
    accounts.global.value = await getProgramDerivedAddress({
      programAddress: programAddress,
      seeds: [
        // 序列化 为标准形式
        getBytesEncoder().encode(new Uint8Array([103, 108, 111, 98, 97, 108])),
      ],
    });
  }
  if (!accounts.bondingCurve.value) {
    accounts.bondingCurve.value = await getProgramDerivedAddress({
      programAddress,
      seeds: [
        getBytesEncoder().encode(
          new Uint8Array([
            98, 111, 110, 100, 105, 110, 103, 45, 99, 117, 114, 118, 101,
          ])
        ),
        getAddressEncoder().encode(expectAddress(accounts.mint.value)),
      ],
    });
  }
  if (!accounts.associatedBondingCurve.value) {
    accounts.associatedBondingCurve.value = await getProgramDerivedAddress({
      programAddress:
        "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL" as Address<"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL">,
      seeds: [
        getAddressEncoder().encode(expectAddress(accounts.bondingCurve.value)),
        getBytesEncoder().encode(
          new Uint8Array([
            6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206, 235,
            121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140, 245, 133,
            126, 255, 0, 169,
          ])
        ),
        getAddressEncoder().encode(expectAddress(accounts.mint.value)),
      ],
    });
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value =
      "11111111111111111111111111111111" as Address<"11111111111111111111111111111111">;
  }
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value =
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" as Address<"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA">;
  }
  if (!accounts.eventAuthority.value) {
    accounts.eventAuthority.value = await getProgramDerivedAddress({
      programAddress,
      seeds: [
        getBytesEncoder().encode(
          new Uint8Array([
            95, 95, 101, 118, 101, 110, 116, 95, 97, 117, 116, 104, 111, 114,
            105, 116, 121,
          ])
        ),
      ],
    });
  }
  if (!accounts.globalVolumeAccumulator.value) {
    accounts.globalVolumeAccumulator.value = await getProgramDerivedAddress({
      programAddress,
      seeds: [
        getBytesEncoder().encode(
          new Uint8Array([
            103, 108, 111, 98, 97, 108, 95, 118, 111, 108, 117, 109, 101, 95,
            97, 99, 99, 117, 109, 117, 108, 97, 116, 111, 114,
          ])
        ),
      ],
    });
  }
  if (!accounts.userVolumeAccumulator.value) {
    accounts.userVolumeAccumulator.value = await getProgramDerivedAddress({
      programAddress,
      seeds: [
        getBytesEncoder().encode(
          new Uint8Array([
            117, 115, 101, 114, 95, 118, 111, 108, 117, 109, 101, 95, 97, 99,
            99, 117, 109, 117, 108, 97, 116, 111, 114,
          ])
        ),
        getAddressEncoder().encode(expectAddress(accounts.user.value)),
      ],
    });
  }
  // 从上边的代码可以看到 codama的生成的PDA获取的代码是不包含 seeds 有"path": "bonding_curve.creator" 这种字段的
  // 然后缺少的账户有不是PDA的 feeRecipient mint associatedUser user creatorVault program  creatorVault其实就是在bonding_curve账户的数据里
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  const instruction = {
    accounts: [
      // getAccountMeta 就是生成 account必要的格式  singer 就添加 singer：true 这种
      getAccountMeta(accounts.global),
      getAccountMeta(accounts.feeRecipient),
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.bondingCurve),
      getAccountMeta(accounts.associatedBondingCurve),
      getAccountMeta(accounts.associatedUser),
      getAccountMeta(accounts.user),
      getAccountMeta(accounts.systemProgram),
      getAccountMeta(accounts.tokenProgram),
      getAccountMeta(accounts.creatorVault),
      getAccountMeta(accounts.eventAuthority),
      getAccountMeta(accounts.program),
      getAccountMeta(accounts.globalVolumeAccumulator),
      getAccountMeta(accounts.userVolumeAccumulator),
    ],
    programAddress,
    data: getBuyInstructionDataEncoder().encode(args as BuyInstructionDataArgs),
  } as BuyInstruction<
    TProgramAddress,
    TAccountGlobal,
    TAccountFeeRecipient,
    TAccountMint,
    TAccountBondingCurve,
    TAccountAssociatedBondingCurve,
    TAccountAssociatedUser,
    TAccountUser,
    TAccountSystemProgram,
    TAccountTokenProgram,
    TAccountCreatorVault,
    TAccountEventAuthority,
    TAccountProgram,
    TAccountGlobalVolumeAccumulator,
    TAccountUserVolumeAccumulator
  >;

  return instruction;
}
