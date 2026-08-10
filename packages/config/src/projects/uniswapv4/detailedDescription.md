Uniswap v4 is a concentrated-liquidity AMM. All pools live inside one immutable contract, the PoolManager: it has no admin, no pause switch, no upgrade path, and user funds sit nowhere else. Anyone can create a pool for any token pair. A pool can be created with a hook, an external contract the pool calls on swaps and liquidity changes. A hookless pool has the same trust profile as earlier Uniswap versions; a hooked pool additionally trusts the hook's code and its controller. The UniversalRouter and PositionManager are optional periphery that hold no user funds; any contract can use the PoolManager directly.

UNI governance, acting through a {{timelockDelayDays}}-day timelock, has one power over pools: a protocol fee on swaps, hard-capped in code at 0.1% per swap direction. The fee a pool is charged scales with its own LP fee (detailed below); pools with hooks are currently exempt. Governance cannot upgrade or pause pools, move funds, or censor swaps or pool creation.

### What changed from v3

- **One contract instead of pool contracts.** A pool is a storage entry in the PoolManager, identified by its two currencies, LP fee, tick spacing, and hook address - change any of these and it is a different pool.
- **Flash accounting.** Every interaction runs inside a lock: the caller performs any number of swaps, liquidity changes, and donations across any pools, and only net balance deltas settle at the end; the transaction reverts unless all deltas reach zero. Multi-hop trades move no intermediate tokens.
- **Pool creation is fully permissionless.** Any pair, any static LP fee from 0 to 100%, any tick spacing within code bounds. A pool can instead use a dynamic fee set by its hook, even per swap.
- **Hooks** (next section): optional per-pool contracts that customize behavior - the main new trust dimension.
- **The oracle was dropped.** A v4 pool has a price oracle only if its hook implements one.
- **The protocol fee flipped sides.** v3's fee switch took a share of LP fees; v4's fee is added on top of the LP fee on the swap's input.
- **Convenience features:** balances can be held inside the PoolManager as transferable ERC-6909 claims, and pools use native ETH without wrapping.

Concentrated liquidity itself is unchanged: providers commit capital to tick ranges and earn the pool's LP fee while the price is in range.

### Hooks

A hook is bound to its pool permanently at creation. Its capabilities are encoded in the lowest bits of its own address, fixed and publicly readable. Before/after callbacks can reject swaps, deposits, or withdrawals; return-delta callbacks can take or add token amounts (for swaps, at most the swap amount) - this is how hook fees work. A hook cannot touch other pools, break settlement, or change protocol fees. Within its own pools it can censor, reprice, or extract, and the hook contract itself may be owned, upgradeable, or unverified. Assessing a v4 position means assessing its hook.

### Providing liquidity

Liquidity providers usually mint through the PositionManager, which represents each position as an ERC-721 NFT and pulls tokens through Permit2. It is not a chokepoint: positions can be managed directly against the PoolManager, so no periphery contract can freeze or take them. What can stand between an LP and their funds is the pool's hook - on pools whose hook intercepts liquidity operations, a withdrawal only succeeds if the hook lets it through.

### Swapping

Swaps normally go through the UniversalRouter, which also reaches v2 and v3 pools and can use Permit2 instead of ERC-20 allowances. Routes are computed off-chain and never verified on-chain, so the signed slippage bound is the only protection. Contracts can swap against the PoolManager without a router.

### Governance and the protocol fee

Protocol control sits with UNI holders. Proposals to GovernorBravo require {{proposalThreshold}} UNI of delegated votes; voting starts {{votingDelayBlocks}} blocks later, runs for {{votingPeriodBlocks}} blocks, and passing requires a majority with at least {{quorumVotes}} UNI in favor. Passed proposals queue in the Timelock and execute {{timelockDelayDays}} days later. The Timelock is also the UNI minter, capped at {{uniMintCap}}% per mint with a minimum interval of {{uniMintInterval}}.

The protocol fee is exercised through the PoolManager owner role. Unlike v3's fee switch, which took a share of LP fees, the v4 fee is added on top of the LP fee on each swap's input.

The fee is switched on. The PoolManager's fee controller, the V4FeeAdapter, charges hookless pools in proportion to their LP fee - {{feeExample005}} per direction on a 0.05% pool, {{feeExample03}} on a 0.3% pool, the full 0.1% from {{feeSaturationTier}} up. Hooked pools currently pay {{hookedPoolFee}} unless governance classifies their hook as fee-bearing. Anyone can apply the scheduled fee to a pool and sweep accrued fees to the TokenJar, whose address is hardcoded.

Collected fees accumulate in the TokenJar, and the only way out is through the Firepit: anyone can burn a set amount of UNI (sent permanently to 0xdead) to release the jar's balances. After the timelock, governance can replace any piece of this fee path - the policy, the fee setter, the controller, or the releaser - but none of it can touch liquidity providers' principal.

Governance cannot upgrade or pause the PoolManager, change a live pool's fee, tick spacing, or hook, block a swap, or stop pool creation. Its only upgrade power is the PositionDescriptor, which renders position-NFT images and takes no part in accounting.
