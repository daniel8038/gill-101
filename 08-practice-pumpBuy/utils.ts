import {
  AccountRole,
  upgradeRoleToSigner,
  isTransactionSigner as kitIsTransactionSigner,
  type AccountMeta,
  type AccountSignerMeta,
  type Address,
  type ProgramDerivedAddress,
  type TransactionSigner,
} from "gill";
import type { ResolvedAccount } from "./type.js";

// check address
export function expectAddress<T extends string = string>(
  value:
    | Address<T>
    | ProgramDerivedAddress<T>
    | TransactionSigner<T>
    | null
    | undefined
): Address<T> {
  if (!value) {
    throw new Error("Expected a Address.");
  }
  if (typeof value === "object" && "address" in value) {
    return value.address;
  }
  if (Array.isArray(value)) {
    return value[0];
  }
  return value as Address<T>;
}

/**
 * 这是一个工厂函数，返回一个函数，用于生成 AccountMeta 或 AccountSignerMeta
 * @param programAddress
 * @param optionalAccountStrategy optionalAccountStrategy: "omitted" | "programId": 一个字符串枚举，决定当账户值缺失时如何处理。选项有："omitted": 如果账户值为空，则返回 undefined。
 * "programId": 如果账户值为空，则返回一个只读的 AccountMeta，使用 programAddress 作为地址。
 * @returns
 */
export function getAccountMetaFactory(
  programAddress: Address,
  optionalAccountStrategy: "omitted" | "programId"
) {
  return (
    account: ResolvedAccount
  ): AccountMeta | AccountSignerMeta | undefined => {
    // 返回一个冻结的对象（Object.freeze 确保不可变）
    if (!account.value) {
      if (optionalAccountStrategy === "omitted") return;
      return Object.freeze({
        address: programAddress,
        role: AccountRole.READONLY,
      });
    }

    const writableRole = account.isWritable
      ? AccountRole.WRITABLE
      : AccountRole.READONLY;
    return Object.freeze({
      address: expectAddress(account.value),
      role: isTransactionSigner(account.value)
        ? upgradeRoleToSigner(writableRole)
        : writableRole,
      ...(isTransactionSigner(account.value) ? { signer: account.value } : {}),
    });
  };
}
export function isTransactionSigner<TAddress extends string = string>(
  value:
    | Address<TAddress>
    | ProgramDerivedAddress<TAddress>
    | TransactionSigner<TAddress>
): value is TransactionSigner<TAddress> {
  return (
    !!value &&
    typeof value === "object" &&
    "address" in value &&
    kitIsTransactionSigner(value)
  );
}
