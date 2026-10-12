Each Safe account is a proxy of an immutable implementation with no owner, and keeps its own owners, threshold and settings. Anyone can create an account through any version's factory, which sets it up in the same transaction.

### Transactions

A transaction executes once enough owners, the threshold, have signed it, and anyone can submit it. Signatures cover the account's nonce, so a transaction cannot be replayed. A signature can come from a key, from a contract owner through EIP-1271, or from an onchain approval.

A transaction can also be a delegatecall, which runs another contract's code inside the account. Safe's libraries use this to batch transactions, deploy contracts and sign messages. A delegatecall can also rewrite the account's settings.

### Modules, guards and the fallback handler

- **Modules** can execute transactions without owner signatures. From v{{v150}}, a module guard can check and reject them.
- **A guard** checks owner transactions and can reject them, including the one that would remove it. From v{{v141}} it must declare the guard interface, while v{{v130}} accepts any address, so a wrong one locks the account.
- **The fallback handler** answers calls the account does not implement. The default one lets the account receive ERC-721, ERC-1155 and ERC-777 tokens and answer EIP-1271 signature checks.

### Upgrades

No upgrade applies to all accounts. Only an account's owners can move it to another implementation, through a delegatecall.

### Offchain services

The Safe{Wallet} interface and the Safe transaction service, both run by Safe Labs, help owners collect signatures. They are optional: any tool that can call the account works.

### L2 variants

Each version's L2 variant also emits an event for every executed transaction, so Safe activity can be indexed on chains without transaction tracing.
