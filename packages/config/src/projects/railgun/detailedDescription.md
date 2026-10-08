Railgun is a shielded ledger on Ethereum. Users shield tokens into encrypted notes, transfer them privately and unshield them to any address. zk-SNARK proofs keep sender, recipient, token and amount hidden. DeFi calls go through the RelayAdapt contract, which unshields tokens, runs the calls and shields the results back in one transaction.

### Privacy considerations

[Broadcasters](https://docs.railgun.org/developer-guide/wallet/transactions/unshielding) submit private transactions and pay their gas. Wallets reach them over the [Waku network](https://blog.waku.org/2024-04-26-railgun-case-study/). Practical privacy also depends on the timing and amounts of shields and unshields, see [OPSEC best practice](/publications/privacy-best-practices).

Railgun names no reference wallet, so the privacy ratings on this page assume [RailOxide](https://github.com/triamazikamno/railoxide). It routes all traffic through built-in Tor and builds Private Proofs of Innocence (PPoI) from a local copy of the lists. Other wallets likely leak significantly more.

### Fees

Shields pay a protocol fee of {{shieldFee}} and unshields {{unshieldFee}}, both to the Railgun Treasury. The NFT fee is {{nftFee}}. Broadcasters charge their own fee per transaction.

### Compliance

Screening happens offchain. A [PPoI](https://docs.railgun.org/wiki/assurance/private-proofs-of-innocence) proves that a note descends only from shields a list provider accepted. The default list screens shields with Chainalysis's sanctions API. Broadcasters on Ethereum require a PPoI, self-broadcasting skips the check. Users can also share a read-only viewing key that discloses all their private transactions.

### Anonymity set

Each token has its own anonymity set. Private transfers between users mix their notes within it.
