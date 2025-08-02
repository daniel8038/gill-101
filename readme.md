这是一个 solana 交互的教程，因为 solana/web3js 现在已经发布第二版 solana/kit。

不过这里，不讲 solana/kit 而是 gill 。 后续我会再单独写一份 solana/kit 的。

gill 的 typescript 的类型处理是有点难受的，动不动就是类型问题。

Gill 是一个建立在 SolanaKit 基础上的 JavaScript 客户端库，同样用于与 Solana 区块链交互，但它通过改进命名、简化的 API 和额外的功能（如交易构建器和调试模式）来优化开发者体验。换句话说，Gill 是基于 SolanaKit 构建的，依赖 SolanaKit 的核心功能，同时在其基础上增加了额外的便利性和功能

这里会按照 Chainbuff 社区的教程列表进行编写

这里的所有私钥相关的都是演示的，不会涉及真实资金。所以才会上传 github ，没有写入 gitignore

codama 命令

npx codama run js
npx tsx generate.ts
