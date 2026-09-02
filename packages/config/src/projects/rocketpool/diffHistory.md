Generated with discovered.json: 0x440d0a7312828eea233c2cd7d46abd4397019314

# Diff at Wed, 02 Sep 2026 11:24:50 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1788348224

## Description

Initial discovery of Rocket Pool. RocketStorage is the only seed; every other contract is resolved from its name hash in that registry.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (eth:0x00000000219ab540356cBB839Cbe05303d7705Fa) [global/DepositContract]
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract RocketDAONodeTrustedActions (eth:0x029d946F28F93399a5b0D09c879FC8c94E596AEb) [rocketpool/RocketDAONodeTrustedActions]
    +++ description: Executes the membership changes the oracle set has voted for: accepting an invitation against a posted bond, leaving and reclaiming the bond, being removed with an optional fine, and the challenge process that removes a member who stops responding.
```

```diff
+   Status: CREATED
    contract RocketMinipoolDelegate (eth:0x03d30466d199Ef540823fe2a22CAE2E3b9343bb0) [rocketpool/RocketMinipoolDelegate]
    +++ description: Shared implementation behind every legacy validator contract. It holds the operator's bond and the matched pooled ETH, tracks the validator's lifecycle, and splits withdrawals between the operator and the pool by the commission recorded at creation. Distributing the contract's balance is open to any caller while the validator is staking; only distributing an already-dissolved contract is restricted to the operator. An absent operator therefore cannot hold the pooled share.
```

```diff
+   Status: CREATED
    contract RocketAuctionManager (eth:0x1a2F00D187C9388fDa3Bf2dc46a6b4740849EcCE) [rocketpool/RocketAuctionManager]
    +++ description: Dutch auction that sells collateral tokens seized from node operators back for ETH, returning the ETH to the pool. Lot creation and bidding are permissionless when their flags are on, and the price decays from a governed starting ratio to a governed reserve ratio over a fixed number of blocks. Both flags are on the security council's allowlist.
```

```diff
+   Status: CREATED
    contract RocketMegapoolProxy (eth:0x1B389D76a04d01026c5f5B0a125D4CCF26F9cd51) [rocketpool/RocketMegapoolProxy]
    +++ description: Proxy base each node operator's pooled validator contract runs. It delegates to the shared implementation resolved from the registry; the operator chooses whether to track the latest implementation or stay on the current one, within an expiry after which tracking resumes. The copy registered here is the uninitialised template.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolSettingsInflation (eth:0x1d4AAEaE7C8b75a8e5ab589a84516853DBDdd735) [rocketpool/RocketDAOProtocolSettingsInflation]
    +++ description: Parameters of collateral-token issuance: the per-interval rate and the start time of the first interval. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketStorage (eth:0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46) [rocketpool/RocketStorage]
    +++ description: Eternal-storage registry and the root of the protocol. It holds every protocol variable in typed key-value maps and is the only contract with persistent state; the logic contracts are stateless and read and write through it. Each logic contract is registered under the hash of its name, so repointing a name in a single write moves every caller to a new implementation on its next call. Write access is limited to addresses flagged as registered contracts, which means the registry itself imposes no delay: any delay comes from the contract performing the write. Registered names are not enumerable on-chain, so discovery resolves each one by calling the address lookup with its name hash.
```

```diff
+   Status: CREATED
    contract RocketNetworkBalances (eth:0x1D9F14C6Bfd8358b589964baD8665AdD248E9473) [rocketpool/RocketNetworkBalances]
    +++ description: Balance oracle. Members of the oracle set submit the network's total ETH, its staked ETH, and the liquid staking token supply for a block; a report is written once submissions reach 51% of the set, and anyone can finalise a report that has already reached that share. The liquid staking token divides the two written values to get its redemption price, so this is the contract that sets that price. Three bounds apply: a report may not land until almost a full reporting interval of 1d has passed since the last one, the price may move by at most 2% per report, and reporting can be switched off by the setting below. Nothing here expires: if reporting stops, the last report stands indefinitely and the price stops tracking validator rewards.
```

```diff
+   Status: CREATED
    contract RocketDAOProposal (eth:0x1e94e6131Ba5B4F193d2A1067517136C52ddF102) [rocketpool/RocketDAOProposal]
    +++ description: Shared proposal store for the two member-based bodies, the oracle set and the security council. It records the payload, the vote counts, and the schedule, and executes the payload against the proposing body once the vote count reaches the required threshold. A proposal becomes executable the instant it reaches its threshold, so the voting window is an upper bound, not a delay.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolSettingsDeposit (eth:0x227BE8dD01DF8ad9BED0178e4F8cEC2996C5c365) [rocketpool/RocketDAOProtocolSettingsDeposit]
    +++ description: Parameters of the user deposit path: whether deposits and assignment are enabled, the minimum deposit, the pool size cap, the deposit fee, and how many validators one deposit may fund. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketNetworkPrices (eth:0x25E54Bf48369b8FB25bB79d3a3Ff7F3BA448E382) [rocketpool/RocketNetworkPrices]
    +++ description: Price oracle for the collateral token. Members of the oracle set submit a price for a block and it is written once submissions reach the network consensus share; anyone can finalise a report that already has that share. The price governs how much collateral a node operator must hold and what its stake is worth in auctions; it does not enter the liquid staking token's redemption price. Reporting can be switched off by a governed setting.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolProposal (eth:0x2D627A50Dc1C4EDa73E42858E8460b0eCF300b25) [rocketpool/RocketDAOProtocolProposal]
    +++ description: Voting machine for token-holder governance. Voting power is proven optimistically: a proposer posts a bond and a claimed voting-power tree, which anyone can challenge within a challenge window by posting their own bond, and an unanswered challenge defeats the proposal and forfeits the proposer's bond. Voting runs in two phases; a proposal needs 15% support to pass and can be blocked by 20% of voting power voting against it outright. A passed proposal has 28d to execute.
```

```diff
+   Status: CREATED
    contract RocketDAOSecurityProposals (eth:0x334B9B1a6F9d7531efb13746482ff40f1c2a0c4e) [rocketpool/RocketDAOSecurityProposals]
    +++ description: Proposal front end for the security council, limited to an explicit allowlist of settings. Every write checks a per-setting allow flag in the registry and reverts if it is not set, so the council can only touch keys that token-holder governance has opened to it; which keys are open is registry state, read from the chain at discovery time as one flag per setting. A numeric setting on the list is additionally capped by the executing code. A proposal here becomes executable the moment it reaches quorum, with no delay of its own.
```

```diff
+   Status: CREATED
    contract RocketNodeDistributorDelegate (eth:0x35A85d4c115801395e6E3abAa784Fb05826f129D) [rocketpool/RocketNodeDistributorDelegate]
    +++ description: Shared implementation behind each node operator's fee-splitting proxy. Distribution is permissionless and pays the operator and the pool by the split recorded on-chain; nobody can redirect a share.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolSettingsAuction (eth:0x364F989A3C9a1F66cB51b9043680974eA08C0d18) [rocketpool/RocketDAOProtocolSettingsAuction]
    +++ description: Parameters of the collateral auction: whether lots may be created and bid on, lot size bounds, duration, and the starting and reserve price ratios. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketVault (eth:0x3bDC69C4E5e13E52A65f5583c23EFB9636b469d6) [rocketpool/RocketVault]
    +++ description: Custody contract for the protocol's pooled ETH and ERC-20 balances. Balances are booked against the *name* of the registered contract that deposited them, and a registered contract can only withdraw, transfer, or burn against its own name; anyone can deposit. The registry refuses to repoint this name, so the address holding the funds cannot be changed, but a contract that is upgraded inherits the balance booked to the name it replaced.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolSettingsMegapool (eth:0x40628FAAc22383327b9f7bBc86CD1857050A2dCe) [rocketpool/RocketDAOProtocolSettingsMegapool]
    +++ description: Parameters of the pooled validator contracts: penalty ceiling and threshold, dissolve timing and penalty, late-notification fine, and the delays after which anyone may distribute. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract AddressQueueStorage (eth:0x44E31944E1A6F3b8F805E105B130F8bdb7E2EBd8) [rocketpool/AddressQueueStorage]
    +++ description: FIFO queue of addresses kept in the shared registry, with a capacity bound per queue. Only registered contracts can write.
```

```diff
+   Status: CREATED
    contract RocketHotfixNodeFee (eth:0x4640b8610f3eFdeb8d44834ADb3228d0E79eaa09) [rocketpool/RocketHotfixNodeFee]
    +++ description: One-shot migration job. It was registered as a protocol contract so that it could write to the shared registry, ran once, and latched a flag that makes a second run revert. It is still registered, so it still holds registry write access, but every entry point it exposes is now either gated by that flag or bounded to repairing existing bookkeeping.
```

```diff
+   Status: CREATED
    contract LinkedListStorage (eth:0x52590E8aaC140E2020f8F51695719922ebcCb6D6) [rocketpool/LinkedListStorage]
    +++ description: Doubly linked list kept in the shared registry, used for queues that must support removal from the middle. Only registered contracts can write.
```

```diff
+   Status: CREATED
    contract RocketMinipoolBase (eth:0x560656C8947564363497E9C78A8BDEff8d3EFF33) [rocketpool/RocketMinipoolBase]
    +++ description: Proxy base every legacy validator contract runs. It delegates to a shared implementation resolved from the registry; the validator's owner chooses whether to track the latest implementation or pin the one they upgraded to, and can roll back one version. The copy registered here is the uninitialised template, so its own slots are empty.
```

```diff
+   Status: CREATED
    contract RocketNetworkSnapshotsTime (eth:0x569F5b3024054AB4049A50df223a747AFE18a891) [rocketpool/RocketNetworkSnapshotsTime]
    +++ description: Timestamp-indexed history of protocol values, used for the rolling windows that bound penalties. Only registered contracts can append, and entries are append-only.
```

```diff
+   Status: CREATED
    contract RocketUpgradeOneDotFour (eth:0x5b3B5C76391662e56d0ff72F31B89C409316c8Ba) [rocketpool/RocketUpgradeOneDotFour]
    +++ description: One-shot migration job. It was registered as a protocol contract so that it could write to the shared registry, ran once, and latched a flag that makes a second run revert. It is still registered, so it still holds registry write access, but every entry point it exposes is now either gated by that flag or bounded to repairing existing bookkeeping.
```

```diff
+   Status: CREATED
    contract RocketUpgradeOneDotThree (eth:0x5dC69083B68CDb5c9ca492A0A5eC581e529fb73C) [rocketpool/RocketUpgradeOneDotThree]
    +++ description: One-shot migration job. It was registered as a protocol contract so that it could write to the shared registry, ran once, and latched a flag that makes a second run revert. It is still registered, so it still holds registry write access, but every entry point it exposes is now either gated by that flag or bounded to repairing existing bookkeeping.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolSettingsNetwork (eth:0x67Fd03a5095197D1aD1F932BC55E022C420b1153) [rocketpool/RocketDAOProtocolSettingsNetwork]
    +++ description: Network-wide parameters: the oracle consensus share, reporting frequencies and switches, the cap on how far the redemption price may move per report, the commission bounds and demand range, the revenue split, and the target redemption buffer. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketNodeDeposit (eth:0x6B13698c306a297Fee1383cdC2c65d63781D2D47) [rocketpool/RocketNodeDeposit]
    +++ description: Takes a node operator's own ETH bond and creates the validator that the pooled deposit is matched against. The bond size is fixed by governed settings, and the operator's ETH and the pooled ETH are held by the validator contract, not by the operator.
```

```diff
+   Status: CREATED
    contract SecurityCouncilSafe (eth:0x6C565aF34f15dE064b56afEdF7B0F59C15bB20FE) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RocketDAONodeTrustedSettingsRewards (eth:0x7322c24752f79c05FFD1E2a6FCB97020C1C264F1) [rocketpool/RocketDAONodeTrustedSettingsRewards]
    +++ description: Per-network switches for where reward claims may be directed. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketMinipoolFactory (eth:0x7B8c48256CaF462670f84c7e849cab216922B8D3) [rocketpool/RocketMinipoolFactory]
    +++ description: Deploys legacy validator contracts as minimal proxies at addresses derived from the operator address and a salt, so the address is known before deployment. Only a registered contract can deploy one.
```

```diff
+   Status: CREATED
    contract RocketDAOSecurity (eth:0x84aE6D61Df5c6ba7196b5C76Bcb112B8a689aD37) [rocketpool/RocketDAOSecurity]
    +++ description: Membership register for the security council. Seats currently filled: 1. Each seat carries one vote and a proposal passes once votes for it reach 0.51. Members post no bond. Membership is set by RPL governance, not by the council itself.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolSettingsRewards (eth:0x8857610Ba0A7caFD4dBE1120bfF03E9c74fc4124) [rocketpool/RocketDAOProtocolSettingsRewards]
    +++ description: Parameters of the reward periods: the period length, the number of periods in a claim interval, and the split of issuance between node operators, the oracle set, and the treasury. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketUpgradeOneDotFourDissolveHotfix (eth:0x91003AD0e47d3B963467A22f2a42F92fdc161d22) [rocketpool/RocketUpgradeOneDotFourDissolveHotfix]
    +++ description: One-shot migration job. It was registered as a protocol contract so that it could write to the shared registry, ran once, and latched a flag that makes a second run revert. It is still registered, so it still holds registry write access, but every entry point it exposes is now either gated by that flag or bounded to repairing existing bookkeeping.
```

```diff
+   Status: CREATED
    contract RocketDAONodeTrustedUpgrade (eth:0x9290AA076a2F1418a4E414E3D83AE03cA8E1ad10) [rocketpool/RocketDAONodeTrustedUpgrade]
    +++ description: The only path that changes which code the protocol runs. A passed oracle-set proposal records a pending change here rather than applying it; the change becomes applicable after 7d and, until then, the security council can cancel it. Once the delay has run and the change was not cancelled, any oracle-set member applies it. A fixed list of names is refused outright: the custody contract, the token contracts, the beacon-chain deposit contract, and the penalty-cap contract. Registering an entirely new name is allowed and grants that address write access to the registry, which is how the exclusion list is worked around. The bootstrap account had an immediate path here; it is permanently closed.
```

```diff
+   Status: CREATED
    contract RocketDAOSecurityUpgrade (eth:0x950BaF0358164339114914169BF16754789B5Dc4) [rocketpool/RocketDAOSecurityUpgrade]
    +++ description: Veto lever over pending contract changes. A council member proposes a veto against a change that is still inside its waiting period; the veto passes at 33% of the council's seats and takes effect as soon as it reaches that threshold, so it always lands inside the window. A vetoed change can never be applied. This contract can only cancel changes; it cannot make one.
```

```diff
+   Status: CREATED
    contract RocketNetworkVoting (eth:0x994A9C49230FEC0c127B8F42D6c5288F02610AeD) [rocketpool/RocketNetworkVoting]
    +++ description: Computes an address's voting power at a past block from its staked collateral and its share of the validator bond, and records vote delegation. It reads the snapshot history rather than holding balances of its own.
```

```diff
+   Status: CREATED
    contract RocketUpgradeOneDotTwo (eth:0x9a0b5d3101d111EA0edD573d45ef2208CC97984a) [rocketpool/RocketUpgradeOneDotTwo]
    +++ description: One-shot migration job. It was registered as a protocol contract so that it could write to the shared registry, ran once, and latched a flag that makes a second run revert. It is still registered, so it still holds registry write access, but every entry point it exposes is now either gated by that flag or bounded to repairing existing bookkeeping.
```

```diff
+   Status: CREATED
    contract RocketNetworkRevenues (eth:0x9D9708dA8E0200Dd8Dd9ad09e0AAf184Ad260842) [rocketpool/RocketNetworkRevenues]
    +++ description: Time-weighted record of how staking revenue is split between node operators, the depositors, and the governance voter share. Only a registered pooled validator contract or the security-council proposal contract can write here, and the council's write is bounded by the guardrails checked in that contract.
```

```diff
+   Status: CREATED
    contract RocketMinipoolQueue (eth:0x9e966733e3E9BFA56aF95f762921859417cF6FaA) [rocketpool/RocketMinipoolQueue]
    +++ description: Queue of legacy validator contracts waiting for pooled ETH. Entry and exit are driven by registered contracts only.
```

```diff
+   Status: CREATED
    contract RocketMegapoolPenalties (eth:0xa2afC3C2d8ea4eBdbE925cADe17c29517630e6aB) [rocketpool/RocketMegapoolPenalties]
    +++ description: Penalty voting for the pooled per-node validator contracts. Members of the oracle set submit an ETH amount against one node's contract; it is applied once submissions reach 51% of the set. Each penalty is capped at 612 ETH, and the same cap is enforced as a running total over a rolling window whose length is a constant in the contract's code. A penalty reduces the node operator's share, not the pooled depositors'.
```

```diff
+   Status: CREATED
    contract RocketMinipoolStatus (eth:0xa52451b9d25EEf02BE42B3A8161A18f947F8A6a5) [rocketpool/RocketMinipoolStatus]
    +++ description: Oracle-set entry point for marking a legacy validator contract withdrawable and for scrubbing one whose withdrawal credentials do not match before it is funded. The scrub window is a governed setting and is the check that stops an operator pointing pooled ETH at credentials they control.
```

```diff
+   Status: CREATED
    contract RocketDAONodeTrustedSettingsProposals (eth:0xAD038f8994a6bd51C8A72D3721CEd83401D4d2b0) [rocketpool/RocketDAONodeTrustedSettingsProposals]
    +++ description: Parameters of oracle-set proposals: the cooldown between one member's proposals, the delay before voting opens, the voting window, and the execution window. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketTokenRETH (eth:0xae78736Cd615f374D3085123A210448E74Fc6393) [rocketpool/RocketTokenRETH]
    +++ description: Liquid staking token (rETH). Minting is restricted to the deposit-pool contract. Burning is open to any holder with no admin gate and no pause switch, but it pays out only from the ETH held here plus the deposit pool's unassigned surplus, so large redemptions depend on that buffer rather than on the staked balance. The redemption price is the ratio of two values written by the balance oracle, so this contract asserts no price of its own and has no staleness check. Governance targets a buffer of 1% of the token's backing. Transfers are blocked for a configured number of blocks after the holder deposits, currently 0. The registry refuses to repoint this name, so the token address is fixed.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolSettingsMinipool (eth:0xaeF94C3650AA13d7A2456477fc374a16b94B9152) [rocketpool/RocketDAOProtocolSettingsMinipool]
    +++ description: Parameters of the legacy validator contracts: launch timeout, bond-reduction and withdrawable-submission switches, and the window in which anyone may distribute. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolSettingsNode (eth:0xb02B883303e658Ddcd58D3871Dc4Ca0C91f0fc9D) [rocketpool/RocketDAOProtocolSettingsNode]
    +++ description: Parameters for node operators: whether registration and node deposits are enabled, bond sizes, the minimum collateral stake, the unstaking waiting period, and the cap on stake that counts toward voting power. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketDAONodeTrustedProposals (eth:0xb0ec3F657ef43A615aB480FA8D5A53BF2c2f05d5) [rocketpool/RocketDAONodeTrustedProposals]
    +++ description: Proposal front end for the oracle set. Only a seated member can propose, and only after a per-member cooldown; voting opens after a delay and runs for a fixed window, with one vote per member. A passed proposal can invite, remove, or fine a member, change the oracle set's own settings, or schedule a contract upgrade. It cannot move funds.
```

```diff
+   Status: CREATED
    contract RocketPoolTokenFixedSupply (eth:0xB4EFd85c19999D84251304bDA99E90B92300Bd93) [rocketpool/RocketPoolToken]
    +++ description: Superseded fixed-supply ERC-20 (RPL), kept only so holders can still swap into its successor. Its owner can register a sale agent that mints, but minting asserts that total supply stays within the hard cap and 0 of the cap is left, so no further issuance is possible. The registry refuses to repoint this name.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolActions (eth:0xB50d513de40eE70A662c39207b4382a693f9e08D) [rocketpool/RocketDAOProtocolActions]
    +++ description: Placeholder action contract for token-holder governance; it exposes no privileged action in this deployment.
```

```diff
+   Status: CREATED
    contract RocketDAONodeTrusted (eth:0xb8e783882b11Ff4f6Cef3C501EA0f4b960152cc9) [rocketpool/RocketDAONodeTrusted]
    +++ description: Membership register for the oracle set: the permissioned group that reports the network balances, the collateral price, and the rewards tree, votes on penalties, and is the only body that can approve a contract upgrade. Seats currently filled: 10. Each seat carries one vote and a proposal passes once votes for it reach 5.1. Membership is bonded: joining locks 1,750 collateral tokens, which a passed kick proposal can fine. The bootstrap account could once seat members directly; that path is permanently closed.
```

```diff
+   Status: CREATED
    contract RocketUpgradeOneDotThreeDotOne (eth:0xc2C81454427b1E53Fdf5d3B45561e3c18F90f9eD) [rocketpool/RocketUpgradeOneDotThreeDotOne]
    +++ description: One-shot migration job. It was registered as a protocol contract so that it could write to the shared registry, ran once, and latched a flag that makes a second run revert. It is still registered, so it still holds registry write access, but every entry point it exposes is now either gated by that flag or bounded to repairing existing bookkeeping.
```

```diff
+   Status: CREATED
    contract RocketUpgradeOneDotOne (eth:0xC680a22b4F03977f69b51A09f3Dbe922eb77C8FE) [rocketpool/RocketUpgradeOneDotOne]
    +++ description: One-shot migration job. It was registered as a protocol contract so that it could write to the shared registry, ran once, and latched a flag that makes a second run revert. It is still registered, so it still holds registry write access, but every entry point it exposes is now either gated by that flag or bounded to repairing existing bookkeeping.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolSettingsSecurity (eth:0xC9D771AaF504F33bB3C8a7E67eA9f1881F837cFf) [rocketpool/RocketDAOProtocolSettingsSecurity]
    +++ description: Parameters of the security council and of the upgrade path: council quorum and vote, action, and execution windows, the waiting period between an approved upgrade and its application, and the share of the council needed to cancel one. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketMegapoolDelegate (eth:0xca3DD4bee7C174903dBF66c3897c27E9ADaAEBdD) [rocketpool/RocketMegapoolDelegate]
    +++ description: Shared implementation behind every node operator's pooled validator contract. One contract holds many validators for one operator, keeping the operator bond and the matched pooled ETH separate in its accounting. Exits and final balances are proven against beacon-chain state rather than asserted by a reporter. Splitting the balance is open to any caller; only moving the operator's own share out is restricted to the operator, so an absent operator cannot withhold the pooled share.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocol (eth:0xCaC25e88276A333cF9d4196d112D93af67ef809A) [rocketpool/RocketDAOProtocol]
    +++ description: Entry point of token-holder governance and the holder of the retired bootstrap powers. While bootstrap mode was engaged the bootstrap account could set any protocol parameter, spend the treasury, and seat or remove security-council members on its own. Bootstrap mode is now permanently disabled, so every one of those functions reverts and the same actions are reachable only through a passed token-holder proposal.
```

```diff
+   Status: CREATED
    contract RocketRewardsPool (eth:0xCba5951fc706Fc783b7C142DaE8576Ebe29c41FD) [rocketpool/RocketRewardsPool]
    +++ description: Accrues the token inflation and the pooled ETH rewards for each reward period and records the tree that splits them. A period is closed when submissions from the oracle set reach the network consensus share; anyone can finalise a submission that already has it. The tree itself is computed off-chain, so the oracle set is trusted for its contents; the totals it can distribute are bounded by what has accrued.
```

```diff
+   Status: CREATED
    contract RocketDepositPool (eth:0xCE15294273CFb9D9b628F4D61636623decDF4fdC) [rocketpool/RocketDepositPool]
    +++ description: Entry point for user deposits and the queue that matches them to validators. A deposit is permissionless while the deposit flag is on; it must be at least 0.01 ETH, must leave the pool within the 6,000,000 ETH cap after queue assignments, pays a fee of 0.05% of the amount, and mints the liquid staking token for the remainder. Deposited ETH is held by the custody contract under this contract's name until it is assigned to a validator or withdrawn back as redemption collateral.
```

```diff
+   Status: CREATED
    contract RocketNodeManager (eth:0xcf2d76A7499d3acB5A22ce83c027651e8d76e250) [rocketpool/RocketNodeManager]
    +++ description: Register of node operators. It records registration, the operator's withdrawal address for ETH and for the collateral token, timezone, smoothing-pool membership, and the address of the operator's pooled validator contract. Changing a withdrawal address is a two-step confirm, so a mistyped address cannot strand the operator. New registrations are currently false.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolProposals (eth:0xcf7F6E23cD8189B7F56b14F66e11241C8ac0F03b) [rocketpool/RocketDAOProtocolProposals]
    +++ description: Executes what token-holder governance has voted for: setting any protocol parameter, splitting the reward inflation between claimant groups, spending the treasury as a one-off or as a recurring payment stream, and seating, removing, or replacing security-council members. It has no upgrade entry point, so token holders cannot change which code the protocol runs.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolVerifier (eth:0xd1f7e573cdC64FC0B201ca37aB50bC7Dd880040A) [rocketpool/RocketDAOProtocolVerifier]
    +++ description: Fraud-proof referee for the voting-power trees used by token-holder governance. A proposer stakes 100 collateral tokens on a claimed tree; any address can stake 10 to challenge a node of it, and the proposer must answer within 30m or the proposal is defeated and the bonds are transferred to the challengers. Nobody is trusted to assert the tree; the bonds and the response deadline are what make it binding.
```

```diff
+   Status: CREATED
    contract RocketTokenRPL (eth:0xD33526068D116cE69F19A9ee46F0bd304F21A51f) [rocketpool/RocketTokenRPL]
    +++ description: Inflationary collateral and governance token (RPL). New supply is issued by a permissionless call that mints the accrued amount to the rewards contract at a fixed rate of 1.0001336806171135 per interval of 1d; there is no privileged minter and no cap. It also swaps a fixed-supply predecessor token in at one to one, burning the token received. The registry refuses to repoint this name.
```

```diff
+   Status: CREATED
    contract AddressSetStorage (eth:0xD4ae2511dF21F367792bA4D67c6eb032171c6a16) [rocketpool/AddressSetStorage]
    +++ description: Set of addresses with O(1) membership, index lookup, and removal, kept in the shared registry. Only registered contracts can write.
```

```diff
+   Status: CREATED
    contract RocketSmoothingPool (eth:0xd4E96eF8eee8678dBFf4d535E033Ed1a4F7605b7) [rocketpool/RocketSmoothingPool]
    +++ description: Holds the block-proposal income of operators who opted into pooled rewards. It only accepts ETH and lets a registered contract withdraw it; the split back to operators is decided by the periodic rewards tree, not here.
```

```diff
+   Status: CREATED
    contract RocketMegapoolFactory (eth:0xD5bffeaa9f373B9C367132772FAA0b88e3F0E38b) [rocketpool/RocketMegapoolFactory]
    +++ description: Deploys one pooled validator contract per node operator, at an address derived from the operator address, and holds the implementation those proxies delegate to.
```

```diff
+   Status: CREATED
    contract RocketDAONodeTrustedSettingsMembers (eth:0xdA1AB39e62E0A5297AF44C7064E501b0613f0D01) [rocketpool/RocketDAONodeTrustedSettingsMembers]
    +++ description: Parameters of oracle-set membership: the bond a member must post, the quorum, the cost and timing of a liveness challenge, and the unbonded-validator allowance. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketMinipoolBondReducer (eth:0xDe8Ab526b19FCA2D5a57c4A78b698041717BE591) [rocketpool/RocketMinipoolBondReducer]
    +++ description: Lets a node operator lower the bond on an existing legacy validator, inside a governed window and only while the feature flag is on. A quorum of the oracle set can cancel a pending reduction during the window, which is the check against an operator reducing their own exposure without exiting.
```

```diff
+   Status: CREATED
    contract RocketNodeDistributorFactory (eth:0xe228017f77B3E0785e794e4c0a8A6b935bB4037C) [rocketpool/RocketNodeDistributorFactory]
    +++ description: Deploys one minimal proxy per node operator, at an address derived from the operator's address, to split the fee-recipient income of that operator's legacy validators between the operator and the pool. The proxy code is fixed in this contract.
```

```diff
+   Status: CREATED
    contract RocketNetworkSnapshots (eth:0xe37F2d9dFb7397caF671DF5190a5dFB601028f17) [rocketpool/RocketNetworkSnapshots]
    +++ description: Block-indexed history of protocol values, used so a vote can be settled against the state at the block a proposal was made. Only registered contracts can append, and entries are append-only.
```

```diff
+   Status: CREATED
    contract RocketMerkleDistributorMainnet (eth:0xE4E2612EE8d7fdc8518Faea85770A3b9c886E2f5) [rocketpool/RocketMerkleDistributorMainnet]
    +++ description: Claim contract for the periodic rewards tree. Anyone can claim on behalf of a node operator with a valid proof, and the proceeds always go to that operator's recorded withdrawal address, so a claim cannot be redirected. Roots are relayed only by the rewards contract.
```

```diff
+   Status: CREATED
    contract RocketDAONodeTrustedSettingsMinipool (eth:0xE535fA45e12d748393C117C6D8EEBe1a7D124d95) [rocketpool/RocketDAONodeTrustedSettingsMinipool]
    +++ description: Parameters the oracle set applies to validator contracts: the scrub window before funding, whether a scrub is penalised, and the window and quorum for cancelling a bond reduction. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketMinipoolManager (eth:0xe54B8C641fd96dE5D6747f47C19964c6b824D62C) [rocketpool/RocketMinipoolManager]
    +++ description: Register of the legacy one-validator-per-contract deployments: creation, status counts, public-key mapping, and destruction. Individual validator contracts are not listed here because there are tens of thousands of them and they share one implementation.
```

```diff
+   Status: CREATED
    contract RocketMinipoolPenalty (eth:0xE64AC47b6e2FEcfCDEA35147Fe61af9894A06ba6) [rocketpool/RocketMinipoolPenalty]
    +++ description: Cap on how much of a legacy validator contract's rewards the oracle set's penalty vote can divert. The cap lives in this contract's own storage rather than in the registry, deliberately putting it out of the oracle set's reach, and the registry refuses to repoint this name. Only the bootstrap account can change it, with no delay and no upper bound in the code. The effective penalty for a validator contract is the smaller of the cap and the voted rate, so a cap of zero disables legacy penalties entirely. The cap currently reads 0%.
```

```diff
+   Status: CREATED
    contract BeaconStateVerifier (eth:0xE9a114c50f26001443B91079Ab5573a90D2D8469) [rocketpool/BeaconStateVerifier]
    +++ description: Verifies Merkle proofs against beacon-chain state roots obtained from the consensus-layer block-root precompile. It has no owner and no configurable trust root, so validator lifecycle facts are proven rather than reported.
```

```diff
+   Status: CREATED
    contract RocketDAOSecurityActions (eth:0xeaa442dF4Bb5394c66C8024eFb4979bEc89Eb59a) [rocketpool/RocketDAOSecurityActions]
    +++ description: Executes security-council membership changes: accepting an invitation, leaving, and being removed. Invitations and removals originate from token-holder governance.
```

```diff
+   Status: CREATED
    contract RocketNetworkPenalties (eth:0xeD0493DE30e82bE7C16C8925C7204CE9D1136B3a) [rocketpool/RocketNetworkPenalties]
    +++ description: Penalty voting for the legacy per-validator contracts. Members of the oracle set submit a penalty against one validator contract and a rate is recorded once submissions reach the governed share. The effect is capped separately by the penalty-cap contract, which is outside this registry's reach.
```

```diff
+   Status: CREATED
    contract RocketNodeStaking (eth:0xedFc7DCaE43fF954577a2875a9D805874490eE3E) [rocketpool/RocketNodeStaking]
    +++ description: Holds node operators' collateral-token stake. Staking and unstaking are open to the operator or their designated collateral withdrawal address; unstaking is a two-step withdrawal with a 28d waiting period. The stake is not inert: any registered contract can lock, burn, or transfer it, and a legacy validator contract can slash it, so an operator's collateral is exposed to whatever code is registered at those names.
```

```diff
+   Status: CREATED
    contract RocketMegapoolManager (eth:0xf2CCd522Ba5fFEda28fe0389963845D61F342034) [rocketpool/RocketMegapoolManager]
    +++ description: Global index of validators across all pooled validator contracts, and the entry point for the beacon-state proofs that record a validator staking, exiting, or failing to exit. Anyone can submit a valid proof; the checks are cryptographic, not permissioned.
```

```diff
+   Status: CREATED
    contract RocketDAOProtocolSettingsProposals (eth:0xf6ad771dfB1cd10c66F688E251b5E5c21cbfDF81) [rocketpool/RocketDAOProtocolSettingsProposals]
    +++ description: Parameters of token-holder governance: proposal and challenge bonds, the challenge period, the vote delay and the two voting phases, the quorum and veto quorum, and the execution window. Values live in the shared registry, not here; this contract is the typed accessor and the only writer is a passed governance proposal.
```

```diff
+   Status: CREATED
    contract RocketNetworkFees (eth:0xf824e2d69dc7e7c073162C2bdE87dA4746d27a0f) [rocketpool/RocketNetworkFees]
    +++ description: Derives the commission a new validator is created with from how full the deposit pool is relative to a governed demand range, between a governed minimum and maximum. It is pure arithmetic over governed settings; nobody sets the number directly.
```

```diff
+   Status: CREATED
    contract RocketClaimDAO (eth:0xfB2F2Ab63DCf412ced6cdE5f4f809215ed0c81aa) [rocketpool/RocketClaimDAO]
    +++ description: Treasury spender. It can make a one-off payment or open a recurring payment stream to a named recipient, and it pays out of the custody contract. Only an executed token-holder proposal can create or change a payment; claiming an already-approved balance is permissionless.
```
