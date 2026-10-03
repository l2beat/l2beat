Panther Protocol is a shielded pool with private transfers and in-pool swaps, designed around built-in compliance. Assets are held by a single Vault contract per chain, while user balances live as encrypted UTXOs in Merkle trees. Every action inside the pool is proven with a Groth16 zero-knowledge proof.

### Accounts and Zones

Before using the pool, a user registers a zAccount. The master EOA signs the account's BabyJubJub spending and reading keys, and the registration publicly links that EOA to the zAccount ID. To activate the zAccount, the user proves in zero knowledge that they hold a KYC attestation signed by a trust provider approved for their zone. Each zAccount expires after the zone's KYC period and must be renewed with a fresh attestation.

Each zone defines the rules that the circuits enforce for its users:
- The trust providers whose KYC and KYT signatures are accepted.
- Maximum deposit, withdrawal and internal transfer amounts, and a rolling limit per time period.
- A zAccount blacklist.
- The data escrow key every transaction is encrypted to.

### Transactions

A single transaction type covers deposits, withdrawals and internal transfers, spending up to two UTXOs and creating up to two new ones. Deposits and withdrawals need a Know-Your-Transaction (KYT) signature from a trust provider over the sender, receiver, token and amount. Swaps route assets from the Vault through a whitelisted Uniswap V3 or Quickswap plugin and back into the Vault, creating a new shielded UTXO for the output.

New UTXOs are either inserted immediately into the small taxi tree, or queued and later batch-inserted into the bus tree by permissionless miners, who submit a SNARK proof of the update and earn ZKP rewards.

A protocol fee of {{protocolFee}} is charged on withdrawals. KYT, KYC and miner fees are paid in shielded ZKP. Users also accrue Panther Reward Points (PRP) inside their zAccount, which can be converted to ZKP through an in-pool AMM.

Transactions can be sent from any EOA, or through Panther's ERC-4337 account and paymaster, which hides the sending EOA and is repaid in ZKP from inside the proof.

### Privacy considerations

Deposits and withdrawals are public: the depositor or recipient address, token and amount are visible onchain, and each is signed by a KYT provider. Internal transfers only publish commitments, nullifiers and ciphertexts. Swaps publish the tokens, amounts and route.

Panther is designed for selective disclosure. Every transaction carries a ciphertext, verified inside the proof, that encrypts the asset, the sender zAccount, the amounts and the recipients' keys to the zone's data escrow operator. The ephemeral key needed to decrypt it is encrypted separately to the DAO and to the zone operator. Revealing a transaction therefore requires the escrow operator together with either the DAO or the zone operator.
