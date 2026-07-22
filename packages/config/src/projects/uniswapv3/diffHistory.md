Generated with discovered.json: 0x694a2e487ce49a8da45e2b5c5602cdbe1ce49e8d

# Diff at Thu, 16 Jul 2026 23:49:16 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1784245693

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Permit2 (eth:0x000000000022D473030F116dDEE9F6B43aC78BA3) [uniswapv3/Permit2]
    +++ description: Canonical signature-based token approval hub (same address on all chains, deployed via CREATE2). Users grant it a one-time ERC20 approval, then issue time-bounded, amount-bounded, spender-bounded permits by signature (SignatureTransfer for one-offs, AllowanceTransfer for standing allowances that can be revoked via lockdown). Immutable and ownerless; the risk it concentrates is that any spender a user signs a permit for can pull the permitted amount while it is valid.
```

```diff
+   Status: CREATED
    contract Firepit (eth:0x0D5Cd355e2aBEB8fb1552F56c965B867346d6721) [uniswapv3/Firepit]
    +++ description: The UNI burn engine: anyone can transfer the threshold amount of UNI (currently 4,000) to the 0xdead burn address and in exchange release up to 20 chosen asset balances from the TokenJar to themselves. Searchers arbitrage accumulated fees against the UNI burn cost, so protocol fees are continuously converted into UNI burned. The thresholdSetter (the Timelock) can retune the threshold.
```

```diff
+   Status: CREATED
    contract Timelock (eth:0x1a9C8182C09F50C8318d769245beA52c32BE35BC) [uniswapv3/Timelock]
    +++ description: Compound-style timelock and the executive account of Uniswap governance: it is the UNI minter, the owner of the V3OpenFeeAdapter (and through it the v3 factory), the v4 PoolManager owner, and the TokenJar owner. Every queued transaction waits the fixed delay (2 days) and expires after the grace period (14 days). Its admin is the GovernorBravo proxy, so only passed proposals can queue actions; there is no emergency bypass.
```

```diff
+   Status: CREATED
    contract UNIToken (eth:0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984) [uniswapv3/Uni]
    +++ description: The UNI governance token (ERC20 with delegation-based checkpoint voting). Fixed 1B initial supply; the minter (the governance Timelock) can mint at most 2% of the supply per year, no earlier than once every 365 days. Votes must be self-delegated or delegated to count. Token balances at a past block, via delegated checkpoints, are what GovernorBravo counts for proposals and voting.
```

```diff
+   Status: CREATED
    contract UniswapV3Factory (eth:0x1F98431c8aD98523631AE4a59f267346ea31F984) [uniswapv3/UniswapV3Factory]
    +++ description: Deploys Uniswap v3 pools and holds the protocol-level knobs. Anyone can create a pool for any token pair at an enabled fee tier; each pool is deployed via CREATE2, so its address is deterministic in (token0, token1, fee). The factory itself is immutable and its owner holds only two powers: enabling new fee tiers (fee/tickSpacing combinations, irreversible once added) and being the sole address allowed to call setFeeProtocol/collectProtocol on every pool. It cannot modify, pause, or upgrade existing pools.
```

```diff
+   Status: CREATED
    contract GovernorBravo (eth:0x408ED6354d4973f66138C91495F2f2FCbd8724C3) [uniswapv3/GovernorBravoDelegator]
    +++ description: The governance proxy: UNI holders vote here. Proposals need the proposalThreshold in delegated UNI to submit, then pass through votingDelay, votingPeriod (with quorumVotes required), and finally queue into the 2-day Timelock before execution. The delegator's admin (the Timelock itself) can swap the GovernorBravoDelegate implementation, so governance logic is upgradeable, but only via a passed proposal.
```

```diff
+   Status: CREATED
    contract GovernorBravoDelegate (eth:0x53a328F4086d7C0F1Fa19e594c9b842125263026) [uniswapv3/GovernorBravoDelegate]
    +++ description: Implementation logic behind the GovernorBravoDelegator proxy. Read through the proxy for live values; the values on this address itself are uninitialized storage.
```

```diff
+   Status: CREATED
    contract UniversalRouter (eth:0x66a9893cC07D91D95644AEDD05D03f95e1dBA8Af) [uniswapv3/UniversalRouter]
    +++ description: Uniswap's current entrypoint router: executes a caller-supplied bytecode-like command list (v2/v3/v4 swaps, Permit2 transfers, WETH wrapping, sweeps) in one transaction. It is immutable and unprivileged, and is the canonical spender that users approve via Permit2. It executes whatever route the calling frontend or aggregator computed off-chain; the contract itself performs no routing.
```

```diff
+   Status: CREATED
    contract SwapRouter02 (eth:0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45) [uniswapv3/SwapRouter02]
    +++ description: Second-generation swap router that can route a single trade across both Uniswap v2 and v3 pools and supports multicall batching with permits. Immutable, stateless between transactions, and unprivileged: it only moves funds of callers who approved it, along routes the caller encodes.
```

```diff
+   Status: CREATED
    contract UniswapV3Pool_USDC_WETH_005 (eth:0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640) [uniswapv3/UniswapV3Pool]
    +++ description: A concentrated-liquidity AMM pool for one token pair at one fee tier, deployed by the factory and fully immutable: no owner, no pause, no upgrade path. LPs provide liquidity on price ranges expressed as ticks; the pool tracks the current price as sqrtPriceX96 in slot0 and crosses initialized ticks as swaps move the price. Swap fees accrue to in-range positions; if the protocol fee is switched on (factory owner only), up to 1/4 of the swap fee per side is diverted to protocolFees for collection by the factory owner. Each pool also embeds a TWAP oracle: a ring buffer of price observations whose cardinality anyone can grow by paying the gas.
```

```diff
+   Status: CREATED
    contract NonfungiblePositionManager (eth:0xC36442b4a4522E871399CD717aBDD847Ab11FE88) [uniswapv3/NonfungiblePositionManager]
    +++ description: Periphery contract that wraps raw pool positions into ERC721 NFTs. It is the registered owner of the underlying positions in the pools and tracks each tokenId's range, liquidity, and uncollected fees; the NFT holder can add/remove liquidity and collect fees. Immutable and unprivileged: it holds no special rights in the pools, and interacting with pools directly (without the NFT wrapper) is equally possible.
```

```diff
+   Status: CREATED
    contract UniswapV3Pool_WBTC_WETH_03 (eth:0xCBCdF9626bC03E24f779434178A73a0B4bad62eD) [uniswapv3/UniswapV3Pool]
    +++ description: A concentrated-liquidity AMM pool for one token pair at one fee tier, deployed by the factory and fully immutable: no owner, no pause, no upgrade path. LPs provide liquidity on price ranges expressed as ticks; the pool tracks the current price as sqrtPriceX96 in slot0 and crosses initialized ticks as swaps move the price. Swap fees accrue to in-range positions; if the protocol fee is switched on (factory owner only), up to 1/4 of the swap fee per side is diverted to protocolFees for collection by the factory owner. Each pool also embeds a TWAP oracle: a ring buffer of price observations whose cardinality anyone can grow by paying the gas.
```

```diff
+   Status: CREATED
    contract SwapRouter (eth:0xE592427A0AEce92De3Edee1F18E0157C05861564) [uniswapv3/SwapRouter]
    +++ description: The original v3 swap router (single- and multi-hop exactInput/exactOutput over v3 pools). Immutable, stateless between transactions, and unprivileged; it executes whatever route the caller encodes and pays pools via the swap callback. Superseded by SwapRouter02 and the UniversalRouter but still functional forever.
```

```diff
+   Status: CREATED
    contract V3OpenFeeAdapter (eth:0xf2371551Fe3937Db7c750f4DfABe5c2fFFdcBf5A) [uniswapv3/V3OpenFeeAdapter]
    +++ description: Owns the UniswapV3Factory since the UNIfication proposal and operationalizes the protocol fee switch. Governance (owner and feeSetter, both the Timelock) sets the fee schedule: a global default, per-fee-tier defaults, and per-pool overrides, each encoding the 4-bit per-side protocol fee (0 or 1/4..1/10 of LP fees; current default 68 = 1/4 both sides). Anyone can then permissionlessly push the configured fee onto any pool (triggerFeeUpdate) and collect accrued protocol fees, which are hardcoded to go to the TokenJar. The owner can also still enable new fee tiers and transfer factory ownership onward.
```

```diff
+   Status: CREATED
    contract TokenJar (eth:0xf38521f130fcCF29dB1961597bc5d2B60F995f85) [uniswapv3/TokenJar]
    +++ description: Escrow for collected protocol fees (arbitrary ERC20s and ETH swept from v3 pools via the V3OpenFeeAdapter and from v4). Only the releaser (the Firepit) can move funds out; the owner (the Timelock) can replace the releaser, which is the lever governance would use to redirect the fee stream.
```
