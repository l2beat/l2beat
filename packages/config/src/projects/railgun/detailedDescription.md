Railgun is a non-custodial privacy protocol on Ethereum built around encrypted UTXO-style private balances rather than fixed-denomination pools. This design enables in-protocol transfers of shielded tokens and interactions with DeFi smart contracts on L1.

A shield transaction moves assets from a public address on Ethereum into the Railgun contract and creates encrypted commitments in a Merkle-tree state. Later private transfers or unshields use zk-SNARK proofs to spend those commitments without revealing the sender, recipient, token type, or amount. Notes created by deposits and private transactions represents ownership of tokens in Railgun, users must keep them secret and make sure the notes are not lost.

Railgun supports private transfers and cross-contract interactions without fragmenting liquidity across denominations. DeFi calls can be executed through the RelayAdapt contract, which temporarily unshields tokens to Ethereum L1, performs a sequence of contract calls, and shields the resulting assets back into Railgun in a single transaction (facilitated by a relayer).

Railgun has a DAO governed by holders of the RAIL token. The DAO has the authority to arbitrarily change the logic of the protocol and its shielded tokens.

### Privacy considerations

Railgun protocol supports [relayed withdrawals](https://docs.railgun.org/developer-guide/wallet/transactions/unshielding), in which a relayer (called a broadcaster in Railgun ecosystem) processes withdrawals on the user's behalf for a fee, which enables sending funds to fresh addresses. Transactions from private addresses can be sent through relayers over the [Waku network](https://blog.waku.org/2024-04-26-railgun-case-study/), which increases network-level privacy. Railgun allows interactions between shielded tokens and DeFi, which allows depositing and withdrawing different tokens.

Practical privacy also depends on the timing and amounts of deposits and withdrawals, as well as RPC providers used to send transactions and query the public blockchain state. Syncing a railgun wallet requires a user to make heavy rpc queries because they need to scan all deposits to the protocol to track their own balance. Running a full node or trusted rpc is recommended. Users are advised to research the best OPSEC practices. Users are advised to research [OPSEC best practice](/publications/privacy-best-practices).

### Fees

There are mandatory onchain protocol fees of {{shieldFee}} for shields and {{unshieldFee}} for unshields. The NFT fee field is currently set to {{nftFee}}. Shield and unshield fees are sent to the Railgun Treasury.

Relayers can charge additional offchain fees for submitting transactions on a user's behalf. These relayer fees are not set by the core protocol contracts.

### Compliance

Railgun protocol does not enforce any compliance measures. However it allows using [Private Proof of Innocence](https://docs.railgun.org/wiki/assurance/private-proofs-of-innocence)(PPoI), which can attest to the origin and history of shielded tokens. Relayers and some wallets require a valid PPoI for their services, but they are not generally enforced.

Additionally, Railgun users can share a read-only viewing key to expose all sent and received private transactions, if required by a regulator or enforcer. 
### Anonymity set

Because Railgun allows private transfers, optional PPoIs that can be enforced by relayers, and interactions with DeFi, its anonymity set depends on many details. A withdrawal from Railgun could be connected with a deposit of another token, or could not correspond to any deposit if a user received a private transfer from another user. The anonymity set, in the best case, corresponds to the set of all Railgun users.
