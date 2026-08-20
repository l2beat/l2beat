Lido is Ethereum’s largest liquid staking protocol. Users deposit ETH and receive stETH, a rebasing ERC-20 whose balance equals `shares × shareRate`, so its total supply tracks the protocol’s total pooled ETH — currently about 9.5M ETH. wstETH is an immutable, adminless wrapper where 1 wstETH permanently equals one stETH share; its value changes only through the stETH contract it points to.

### Staking and node operators

Deposited ETH is buffered in the Lido contract, then routed by the StakingRouter across four staking modules — the curated Node Operators Registry, Simple DVT, the permissionless Community Staking Module, and the MaxEB Curated Module v2. Withdrawal credentials for pooled validators are set by the router to the protocol’s WithdrawalVault, not by operators, so operators can never redirect user principal. Their misbehavior can only degrade yield (socialized to stETH holders), is increasingly bonded (CSM/CMv2), and their validators can be force-exited via EIP-7002.

### The oracle and the EL↔CL boundary

Because validator balances, exits and slashings live on the consensus layer, Lido bridges that boundary two ways: a 9-member oracle committee (quorum 5 of 9, the same members across all consensus instances) that reports aggregate balances and drives the daily rebase and withdrawal finalization; and trustless EIP-4788 beacon-root proofs for facts about specific validators. A malicious oracle quorum is bounded by the OracleReportSanityChecker (for example ≤0.075% rebase per report and ≤3.6% consensus-layer balance decrease over a 36-day window) — it can degrade or freeze, but principal theft is tightly bounded. If the oracle committee stops reporting, rebases and withdrawal finalization stop.

### Deposits, DSM and withdrawals

New validator deposits flow only through the Deposit Security Module: 6 guardians (quorum 4) sign the current deposit root to guard against the deposit-frontrunning attack, and any single guardian can pause deposits. Withdrawals are requested into the WithdrawalQueue (minting an unstETH NFT) and can only be finalized inside the oracle report, paying the lesser of the rate at request time and the report’s share rate.

### stVaults (Lido V3)

Isolated StakingVaults let operators mint stETH against 0x02-credential collateral, over-collateralized per tier, capped at 10% of stETH shares per vault and a global 30% external-ratio cap in the Lido contract. Bad debt can only be socialized to stETH holders through a role-gated committee process with an LDO objection window.

### Governance and Dual Governance

Every protocol-critical action is controlled by the Lido DAO and must pass Dual Governance: Aragon Voting proposes, and execution flows through a timelock (3-day submit + 1-day schedule minimum) to the DAO Agent, which is proxy-admin of the entire protocol. stETH and wstETH holders can veto by locking ≥1% of supply in the signalling Escrow, and rage-quit at ≥10% to exit before a contested proposal executes. A time-boxed emergency committee set can freeze execution or, until 2027-06-20, reset governance to a no-veto fallback. Because the DAO can re-point the whole protocol by swapping the LidoLocator implementation, the ultimate trust assumption is the DAO acting through Dual Governance’s economic-veto timelock.
