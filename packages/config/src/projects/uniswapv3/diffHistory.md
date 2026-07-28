Generated with discovered.json: 0x2cc089fdba615c2b276fa8db68b94cbd48e2ad12

# Diff at Tue, 28 Jul 2026 08:31:27 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1785227424

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Permit2 (eth:0x000000000022D473030F116dDEE9F6B43aC78BA3) [uniswapv3/Permit2]
    +++ description: Canonical signature-based token approval hub (same CREATE2 address on every chain where deployed). Users grant it one ERC20 approval per token, then authorize spenders via time- and amount-bounded signed permits, revocable via lockdown. Immutable and ownerless; any spender with a valid permit can pull the permitted amount.
```

```diff
+   Status: CREATED
    contract Firepit (eth:0x0D5Cd355e2aBEB8fb1552F56c965B867346d6721) [uniswapv3/Firepit]
    +++ description: The UNI burn engine: anyone can send the threshold amount of UNI (currently 4,000) to the 0xdead address and in exchange release up to 20 chosen token balances from the TokenJar to themselves. The thresholdSetter (the Timelock) can change the threshold.
```

```diff
+   Status: CREATED
    contract Timelock (eth:0x1a9C8182C09F50C8318d769245beA52c32BE35BC) [uniswapv3/Timelock]
    +++ description: Compound-style timelock and the executive account of Uniswap governance: it is the UNI minter, the owner of the V3OpenFeeAdapter (and through it the v3 factory), the v4 PoolManager owner, and the TokenJar owner. Every queued transaction waits the fixed delay (2d) and expires after the grace period (14d). Its admin is the GovernorBravo proxy, so only passed proposals can queue actions; there is no emergency bypass.
```

```diff
+   Status: CREATED
    contract UNIToken (eth:0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984) [uniswapv3/Uni]
    +++ description: The UNI governance token (ERC20 with checkpoint voting). 1B initial supply; the minter (the Timelock) can mint at most 2% of supply per year, at most once every 365 days. Votes count only when delegated.
```

```diff
+   Status: CREATED
    contract UniswapV3Factory (eth:0x1F98431c8aD98523631AE4a59f267346ea31F984) [uniswapv3/UniswapV3Factory]
    +++ description: Deploys Uniswap v3 pools: anyone can create one pool per token pair and enabled fee tier, at a CREATE2 address deterministic in (token0, token1, fee). Immutable. Its owner holds exactly three powers: enable new fee tiers (irreversible), call setFeeProtocol/collectProtocol on pools, and transfer the owner role. It cannot modify, pause, or upgrade deployed pools.
```

```diff
+   Status: CREATED
    contract GovernorBravo (eth:0x408ED6354d4973f66138C91495F2f2FCbd8724C3) [uniswapv3/GovernorBravoDelegator]
    +++ description: The governance proxy where UNI holders vote. Proposals need the proposalThreshold in delegated UNI, then pass votingDelay, votingPeriod (quorum required), and queue into the Timelock. Its admin (the Timelock) can swap the implementation, so governance logic is upgradeable - only via a passed proposal.
```

```diff
+   Status: CREATED
    contract GovernorBravoDelegate (eth:0x53a328F4086d7C0F1Fa19e594c9b842125263026) [uniswapv3/GovernorBravoDelegate]
    +++ description: Implementation logic behind the GovernorBravoDelegator proxy. Read through the proxy for live values; the values on this address itself are uninitialized storage.
```

```diff
+   Status: CREATED
    contract UniversalRouter (eth:0x66a9893cC07D91D95644AEDD05D03f95e1dBA8Af) [uniswapv3/UniversalRouter]
    +++ description: Uniswap's current entrypoint router: executes a caller-supplied command list (v2/v3/v4 swaps, Permit2 transfers, WETH wrapping, sweeps) in one transaction. Immutable and unprivileged; the canonical Permit2 spender. Routes are computed off-chain by the caller - the contract performs no routing.
```

```diff
+   Status: CREATED
    contract SwapRouter02 (eth:0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45) [uniswapv3/SwapRouter02]
    +++ description: Second-generation swap router covering both v2 and v3 pools with multicall batching. Immutable and unprivileged: it only moves funds of callers who approved it, along routes the caller encodes.
```

```diff
+   Status: CREATED
    contract UniswapV3Pool_USDC_WETH_005 (eth:0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640) [uniswapv3/UniswapV3Pool]
    +++ description: A concentrated-liquidity AMM pool for one token pair at one fee tier, deployed by the factory and fully immutable: no owner, no pause, no upgrade path. LPs provide liquidity on tick ranges; swap fees accrue to in-range positions. The factory owner can divert up to 1/4 of the swap fee per side as protocol fee. Also a TWAP oracle whose observation buffer anyone can grow.
```

```diff
+   Status: CREATED
    contract NonfungiblePositionManager (eth:0xC36442b4a4522E871399CD717aBDD847Ab11FE88) [uniswapv3/NonfungiblePositionManager]
    +++ description: Wraps pool positions into ERC721 NFTs: it is the pool-level owner of the wrapped positions and tracks each tokenId's range, liquidity, and fees, so NFT holders manage and collect through it. Immutable and unprivileged: no special rights in the pools, which can equally be used directly.
```

```diff
+   Status: CREATED
    contract UniswapV3Pool_WBTC_WETH_03 (eth:0xCBCdF9626bC03E24f779434178A73a0B4bad62eD) [uniswapv3/UniswapV3Pool]
    +++ description: A concentrated-liquidity AMM pool for one token pair at one fee tier, deployed by the factory and fully immutable: no owner, no pause, no upgrade path. LPs provide liquidity on tick ranges; swap fees accrue to in-range positions. The factory owner can divert up to 1/4 of the swap fee per side as protocol fee. Also a TWAP oracle whose observation buffer anyone can grow.
```

```diff
+   Status: CREATED
    contract SwapRouter (eth:0xE592427A0AEce92De3Edee1F18E0157C05861564) [uniswapv3/SwapRouter]
    +++ description: The original v3 swap router (single- and multi-hop exact-input/exact-output over v3 pools). Immutable and unprivileged; executes whatever route the caller encodes. Superseded by SwapRouter02 and the UniversalRouter but usable forever.
```

```diff
+   Status: CREATED
    contract V3OpenFeeAdapter (eth:0xf2371551Fe3937Db7c750f4DfABe5c2fFFdcBf5A) [uniswapv3/V3OpenFeeAdapter]
    +++ description: Owns the UniswapV3Factory since the UNIfication proposal. Governance (owner and feeSetter, both the Timelock) sets the protocol-fee schedule: a global default, per-tier defaults, and per-pool overrides, each 0 or between 1/10 and 1/4 of LP fees per side. Anyone can push the configured fee onto pools and collect accrued protocol fees, which go only to the TokenJar. The owner can also enable new fee tiers and transfer factory ownership.
```

```diff
+   Status: CREATED
    contract TokenJar (eth:0xf38521f130fcCF29dB1961597bc5d2B60F995f85) [uniswapv3/TokenJar]
    +++ description: Escrow for collected protocol fees (tokens swept from v3 pools via the V3OpenFeeAdapter, and from v4). Only the releaser (the Firepit) can move funds out; the owner (the Timelock) can replace the releaser, redirecting all accumulated and future fees.
```
