Railgun lets you shield tokens on Ethereum, send them privately to other Railgun users, use them in DeFi and unshield them to any address. Sender, recipient, token and amount stay hidden inside the pool, including which shield funds which unshield. Shields and unshields are public.

No operator holds a key into the pool. RAIL stakers govern the core contract through a DAO, whose upgrades wait {{executionDelay}}. Leaving is permissionless: you can submit your own unshield at any time.

### Architecture

Balances are encrypted notes in a public tree of commitments. Spending a note publishes its nullifier, and a zk-SNARK proves the spend without revealing which note it was. Each note is encrypted to the recipient's 0zk address.

### Flow

1. **Shield.** You send tokens to the pool, which creates a note for your 0zk address. Your address, token and amount are public.
2. **Transfer.** Your wallet proves the spend locally. A [broadcaster](https://docs.railgun.org/developer-guide/wallet/transactions/unshielding), reached over the [Waku network](https://blog.waku.org/2024-04-26-railgun-case-study/), submits it and pays the gas for a fee paid in a private note.
3. **DeFi.** The RelayAdapt contract unshields tokens, runs the calls and shields the results back in one transaction. Tokens and amounts of the calls are public.
4. **Unshield.** The pool pays out to any address. Recipient, token and amount are public.

### Keys

Your wallet derives spending and viewing keys from a recovery phrase. You can share a read-only viewing key, which discloses all your private transactions.

### App

Railgun names no reference wallet, so the ratings assume [RailOxide](https://github.com/triamazikamno/railoxide). It routes all traffic through built-in Tor and builds Private Proofs of Innocence (PPoI) from a local copy of the lists. Other wallets likely leak significantly more.

### Compliance

Screening happens offchain. A [PPoI](https://docs.railgun.org/wiki/assurance/private-proofs-of-innocence) proves that a note descends only from shields a list provider accepted. The default list screens shields with Chainalysis's sanctions API. Broadcasters on Ethereum require a PPoI, and a transaction you submit yourself skips the check.

### Fees

Shields pay a protocol fee of {{shieldFee}} and unshields {{unshieldFee}}, both to the Railgun Treasury. The NFT fee is {{nftFee}}. Broadcasters charge their own fee per transaction.

### Anonymity set

Each token has its own anonymity set. Private transfers between users mix their notes within it.
