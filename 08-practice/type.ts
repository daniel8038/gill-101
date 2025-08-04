import type { ReadonlyUint8Array } from "gill";

export type BuyInstructionDataArgs = {
  amount: number | bigint;
  maxSolCost: number | bigint;
};
export type BuyInstructionData = {
  discriminator: ReadonlyUint8Array;
  amount: bigint;
  maxSolCost: bigint;
};
