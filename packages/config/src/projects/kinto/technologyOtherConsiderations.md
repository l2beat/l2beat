The Kinto L2 node is a fork of Arbitrum's geth implementation with notable changes to the state transition function.
A valid state transition in Kinto [disallows all transactions by EOAs](https://github.com/KintoXYZ/kinto-go-ethereum/blob/7aba9b812a82d9339d29a2345946c3d7030a0377/core/kinto_hardfork_7.go#L58) and new contract creation, unless specifically whitelisted.
The current whitelist is sourced directly from the KintoAppRegistry smart contract on Kinto L2, and can be modified by the L2 governance.
This setup effectively enforces smart wallet use because the auxiliary contracts of the standard KintoWallet smart wallet (like the EntryPoint and the KintoWalletFactory) are whitelisted.

The KYC validation is part of the KintoWallet signature verification. Since all users must use the same implementation of this smart wallet, all user transactions on Kinto check for an up-to-date KYC flag, and are dropped in case the check fails.
