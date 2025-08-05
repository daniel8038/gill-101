import type {
  AccountMeta,
  AccountSignerMeta,
  Address,
  Instruction,
  InstructionWithAccounts,
  InstructionWithData,
  ProgramDerivedAddress,
  ReadonlyAccount,
  ReadonlyUint8Array,
  TransactionSigner,
  WritableAccount,
  WritableSignerAccount,
} from "gill";
import type { PUMP_PROGRAM_ADDRESS } from "./buy.js";

export type BuyInstructionDataArgs = {
  amount: number | bigint;
  maxSolCost: number | bigint;
};
export type BuyInstructionData = {
  discriminator: ReadonlyUint8Array;
  amount: bigint;
  maxSolCost: bigint;
};
export type BuyInput<
  TAccountGlobal extends string = string,
  TAccountFeeRecipient extends string = string,
  TAccountMint extends string = string,
  TAccountBondingCurve extends string = string,
  TAccountAssociatedBondingCurve extends string = string,
  TAccountAssociatedUser extends string = string,
  TAccountUser extends string = string,
  TAccountSystemProgram extends string = string,
  TAccountTokenProgram extends string = string,
  TAccountCreatorVault extends string = string,
  TAccountEventAuthority extends string = string,
  TAccountProgram extends string = string,
  TAccountGlobalVolumeAccumulator extends string = string,
  TAccountUserVolumeAccumulator extends string = string
> = {
  global: Address<TAccountGlobal>;
  feeRecipient: Address<TAccountFeeRecipient>;
  mint: Address<TAccountMint>;
  bondingCurve: Address<TAccountBondingCurve>;
  associatedBondingCurve: Address<TAccountAssociatedBondingCurve>;
  associatedUser: Address<TAccountAssociatedUser>;
  user: TransactionSigner<TAccountUser>;
  systemProgram?: Address<TAccountSystemProgram>;
  tokenProgram?: Address<TAccountTokenProgram>;
  creatorVault: Address<TAccountCreatorVault>;
  eventAuthority: Address<TAccountEventAuthority>;
  program: Address<TAccountProgram>;
  globalVolumeAccumulator: Address<TAccountGlobalVolumeAccumulator>;
  userVolumeAccumulator: Address<TAccountUserVolumeAccumulator>;
  amount: BuyInstructionDataArgs["amount"];
  maxSolCost: BuyInstructionDataArgs["maxSolCost"];
};
export type BuyAsyncInput<
  TAccountGlobal extends string = string,
  TAccountFeeRecipient extends string = string,
  TAccountMint extends string = string,
  TAccountBondingCurve extends string = string,
  TAccountAssociatedBondingCurve extends string = string,
  TAccountAssociatedUser extends string = string,
  TAccountUser extends string = string,
  TAccountSystemProgram extends string = string,
  TAccountTokenProgram extends string = string,
  TAccountCreatorVault extends string = string,
  TAccountEventAuthority extends string = string,
  TAccountProgram extends string = string,
  TAccountGlobalVolumeAccumulator extends string = string,
  TAccountUserVolumeAccumulator extends string = string
> = {
  global?: Address<TAccountGlobal>;
  feeRecipient: Address<TAccountFeeRecipient>;
  mint: Address<TAccountMint>;
  bondingCurve?: Address<TAccountBondingCurve>;
  associatedBondingCurve?: Address<TAccountAssociatedBondingCurve>;
  associatedUser: Address<TAccountAssociatedUser>;
  user: TransactionSigner<TAccountUser>;
  systemProgram?: Address<TAccountSystemProgram>;
  tokenProgram?: Address<TAccountTokenProgram>;
  creatorVault: Address<TAccountCreatorVault>;
  eventAuthority?: Address<TAccountEventAuthority>;
  program: Address<TAccountProgram>;
  globalVolumeAccumulator?: Address<TAccountGlobalVolumeAccumulator>;
  userVolumeAccumulator?: Address<TAccountUserVolumeAccumulator>;
  amount: BuyInstructionDataArgs["amount"];
  maxSolCost: BuyInstructionDataArgs["maxSolCost"];
};
export type ResolvedAccount<
  T extends string = string,
  U extends
    | Address<T>
    | ProgramDerivedAddress<T>
    | TransactionSigner<T>
    | null = Address<T> | ProgramDerivedAddress<T> | TransactionSigner<T> | null
> = {
  isWritable: boolean;
  value: U;
};
export type BuyInstruction<
  TProgram extends string = typeof PUMP_PROGRAM_ADDRESS,
  TAccountGlobal extends string | AccountMeta<string> = string,
  TAccountFeeRecipient extends string | AccountMeta<string> = string,
  TAccountMint extends string | AccountMeta<string> = string,
  TAccountBondingCurve extends string | AccountMeta<string> = string,
  TAccountAssociatedBondingCurve extends string | AccountMeta<string> = string,
  TAccountAssociatedUser extends string | AccountMeta<string> = string,
  TAccountUser extends string | AccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | AccountMeta<string> = "11111111111111111111111111111111",
  TAccountTokenProgram extends
    | string
    | AccountMeta<string> = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  TAccountCreatorVault extends string | AccountMeta<string> = string,
  TAccountEventAuthority extends string | AccountMeta<string> = string,
  TAccountProgram extends string | AccountMeta<string> = string,
  TAccountGlobalVolumeAccumulator extends string | AccountMeta<string> = string,
  TAccountUserVolumeAccumulator extends string | AccountMeta<string> = string,
  TRemainingAccounts extends readonly AccountMeta<string>[] = []
> = Instruction<TProgram> &
  InstructionWithData<ReadonlyUint8Array> &
  InstructionWithAccounts<
    [
      TAccountGlobal extends string
        ? ReadonlyAccount<TAccountGlobal>
        : TAccountGlobal,
      TAccountFeeRecipient extends string
        ? WritableAccount<TAccountFeeRecipient>
        : TAccountFeeRecipient,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountBondingCurve extends string
        ? WritableAccount<TAccountBondingCurve>
        : TAccountBondingCurve,
      TAccountAssociatedBondingCurve extends string
        ? WritableAccount<TAccountAssociatedBondingCurve>
        : TAccountAssociatedBondingCurve,
      TAccountAssociatedUser extends string
        ? WritableAccount<TAccountAssociatedUser>
        : TAccountAssociatedUser,
      TAccountUser extends string
        ? WritableSignerAccount<TAccountUser> & AccountSignerMeta<TAccountUser>
        : TAccountUser,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountTokenProgram extends string
        ? ReadonlyAccount<TAccountTokenProgram>
        : TAccountTokenProgram,
      TAccountCreatorVault extends string
        ? WritableAccount<TAccountCreatorVault>
        : TAccountCreatorVault,
      TAccountEventAuthority extends string
        ? ReadonlyAccount<TAccountEventAuthority>
        : TAccountEventAuthority,
      TAccountProgram extends string
        ? ReadonlyAccount<TAccountProgram>
        : TAccountProgram,
      TAccountGlobalVolumeAccumulator extends string
        ? WritableAccount<TAccountGlobalVolumeAccumulator>
        : TAccountGlobalVolumeAccumulator,
      TAccountUserVolumeAccumulator extends string
        ? WritableAccount<TAccountUserVolumeAccumulator>
        : TAccountUserVolumeAccumulator,
      ...TRemainingAccounts
    ]
  >;
