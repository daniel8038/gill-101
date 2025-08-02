这个没什么好写的

如果是估算,gill 给写好了封装

```ts
const estimateAndUpdateCUs = estimateAndUpdateProvisoryComputeUnitLimitFactory(
  estimateComputeUnitLimitFactory({ rpc })
);
```

如果是自己添加就是

```ts
const transaction = createTransaction({
  feePayer: signer,
  version: "legacy",
  // 硬编码
  computeUnitLimit: 50000,
  computeUnitPrice: 50000,
  //
  instructions: [
    getCreateAssociatedTokenIdempotentInstruction({
      mint,
      payer: signer,
      tokenProgram,
      owner: destination,
      ata: destinationAta,
    }),
    getTransferInstruction({
      source: sourceAta,
      authority: signer,
      destination: destinationAta,
      amount: 1000n,
    }),
  ],
  latestBlockhash,
});
```

<!-- 其实上边的就是这样的原理 -->
<!-- 这是源代码 -->
<!-- https://github.com/DecalLabs/gill/blob/master/packages/gill/src/core/create-transaction.ts#L79 -->

```ts
const transaction = createTransaction({
  feePayer: signer,
  version: "legacy",
  instructions: [
    // 硬编码
    getSetComputeUnitLimitInstruction({ units: 5000 }),
    getSetComputeUnitPriceInstruction({ microLamports: 5000 }),
    //
    getCreateAssociatedTokenIdempotentInstruction({
      mint,
      payer: signer,
      tokenProgram,
      owner: destination,
      ata: destinationAta,
    }),
    getTransferInstruction({
      source: sourceAta,
      authority: signer,
      destination: destinationAta,
      amount: 1000n,
    }),
  ],
  latestBlockhash,
});
```
