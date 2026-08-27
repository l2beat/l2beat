# Architecture

The bridge deploys a central `Bridge` contract on Base that combines an arbitrary message bridge and a lock-and-mint token bridge between Base and Solana. Base-native assets (ETH and ERC20s) bridged to Solana are escrowed in the `Bridge` itself, while Solana-native assets (SOL and SPL tokens) are represented on Base as `CrossChainERC20` tokens that the `Bridge` mints and burns. Only the Base side is analyzed here: the Solana bridge program is referenced solely by its pubkey (`REMOTE_BRIDGE`), and custody of assets bridged from Solana lives on Solana, outside the scope of this review.

# Message lifecycle

Outgoing (Base to Solana): `bridgeToken()` and `bridgeCall()` serialize Solana instructions, escrow or burn the asset, and append the message hash to an onchain merkle mountain range accumulator that offchain infrastructure relays to Solana. For Base-native ERC20s, amounts are truncated to the remote token's decimals via a registered scalar and any dust is refunded. No protocol fee is charged onchain.

Incoming (Solana to Base): validators observe Solana offchain and co-sign batches of message hashes. Anyone can submit a signed batch to `BridgeValidator.registerMessages()`, and once registered, anyone can execute the messages via `Bridge.relayMessages()`. A message either mints/releases tokens (`Transfer`), executes an arbitrary call through the sender's `Twin` account (`Call`), or both (`TransferAndCall`). Failed executions are recorded and can be retried permissionlessly. A special message type sent by the Solana bridge program itself registers new wrapped-SPL token routes and their decimal scalars on Base.

# Crosschain validation

There are no fraud proofs, validity proofs or light clients on the Base side: message validity rests entirely on two signature quorums that must both be met for each attested batch — {{baseQuorum}} "Base validators" and {{partnerQuorum}} partner signers listed in the `SignerRegistry`. If these two validator groups collude, they can freely mint unbacked wrapped tokens, drain the escrowed Base-native assets, and execute arbitrary calls through any user's `Twin` account.

The Base validator set and both thresholds are fixed: the `BridgeValidator` exposes no functions to change them and its proxy has no admin. The partner signer set, in contrast, can be changed at any time by its owner — the same `RBACTimelock` (minimum delay {{timelockDelay}}) that administers Chainlink's CCIP contracts on Base, placing the partner validator side under Chainlink's CCIP governance (tracked in our CCIP review).

# Wrapped tokens and Twin accounts

`CrossChainERC20` tokens are deployed permissionlessly through the `CrossChainERC20Factory` as beacon proxies, all pointing to the shared `CrossChainERC20Beacon`. Each Solana address similarly gets a deterministic `Twin` beacon proxy pointing to the shared `TwinBeacon`, which acts as its account abstraction on Base and executes arbitrary calls on its behalf. The owner of the two beacons can re-point their implementation in a single transaction, instantly replacing the code of every wrapped token (e.g. SOL, JitoSOL) and every Twin account on Base.

# Pausing

{{guardianCount}} guardian account(s) can pause and unpause the bridge at any time. Pausing blocks outgoing messages, incoming relays and new message attestations; already-attested messages also cannot be executed while paused.

# Upgradeability and governance

A single EOA is simultaneously the admin of the `Bridge` proxy, the owner of the `Bridge` (granting and revoking guardians), and the owner of both beacons. It can therefore upgrade the bridge escrow, all wrapped tokens and all Twin accounts without any delay or notice. The `BridgeValidator` and `CrossChainERC20Factory` proxies have no admin and cannot be upgraded.
