# Architecture

A central `Bridge` contract on Base combines an arbitrary message bridge and a lock-and-mint token bridge with Solana: Base-native assets (ETH, ERC20s) are escrowed in the `Bridge`, Solana-native assets (SOL, SPL tokens) are minted as `CrossChainERC20` tokens. Only the Base side is analyzed here; the Solana bridge program and its custody are out of scope.

# Message lifecycle

Outgoing messages escrow or burn the asset and are appended to an onchain merkle mountain range accumulator that offchain infrastructure relays to Solana. Incoming messages must first be attested in the `BridgeValidator`; anyone can then execute them via `Bridge.relayMessages()`, which mints or releases tokens, executes arbitrary calls through the sender's `Twin` account, or both. Failed executions can be retried permissionlessly.

# Crosschain validation

There are no fraud proofs, validity proofs or light clients: message validity rests entirely on two signature quorums that must both be met — {{baseQuorum}} "Base validators" and {{partnerQuorum}} partner signers listed in the `SignerRegistry`. If these two groups collude, they can mint unbacked tokens, drain the escrow, and act through any user's `Twin` account. The Base validator set and both thresholds are fixed (no setter functions, no proxy admin), while the partner signer set is managed by the same `RBACTimelock` (minimum delay {{timelockDelay}}) that administers Chainlink's CCIP contracts on Base (tracked in our CCIP review).

# Wrapped tokens and Twin accounts

`CrossChainERC20` tokens are deployed permissionlessly through a factory as beacon proxies, minted and burned only by the `Bridge`. Each Solana address gets a deterministic `Twin` beacon proxy that executes arbitrary calls on its behalf on Base.

# Pausing

{{guardianCount}} guardian account(s) can pause and unpause the bridge at any time, blocking outgoing messages, attestations and message execution.

# Upgradeability and governance

A single EOA is the admin of the `Bridge` proxy, the owner of the `Bridge` (managing guardians), and the owner of both beacons — it can upgrade the escrow and replace the code of every wrapped token and every `Twin` account without delay. The `BridgeValidator` and `CrossChainERC20Factory` proxies have no admin and cannot be upgraded.
