Generated with discovered.json: 0x62a9e85c8c821179ea4b4c1aeb029e9fba4761b9

# Diff at Wed, 29 Jul 2026 09:24:41 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1785227424

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Permit2 (eth:0x000000000022D473030F116dDEE9F6B43aC78BA3) [uniswapv3/Permit2]
    +++ description: Signature-based token approval hub. Users grant it one ERC20 approval per token, then authorize spenders via time- and amount-bounded signed permits, revocable via lockdown. Immutable and ownerless; any spender with a valid permit can pull the permitted amount.
```

```diff
+   Status: CREATED
    contract Firepit (eth:0x0D5Cd355e2aBEB8fb1552F56c965B867346d6721) [uniswapv3/Firepit]
    +++ description: Burn-and-release contract: anyone can transfer the configured threshold (currently 4,000 UNI) to a fixed burn address and release selected balances from its token jar to a chosen recipient. The threshold setter can change the threshold, including to zero, and the owner can replace the threshold setter.
```

```diff
+   Status: CREATED
    contract Timelock (eth:0x1a9C8182C09F50C8318d769245beA52c32BE35BC) [uniswapv3/Timelock]
    +++ description: Compound-style timelock. Its admin can queue, cancel, and execute transactions. A queued transaction becomes executable after 2d and remains executable for a 14d grace period. The delay can be changed only through the timelock itself and must remain between 2d and 1mo. After the one-time admin initialization path has been used, changing the admin requires a timelocked self-call; there is no emergency bypass.
```

```diff
+   Status: CREATED
    contract UNIToken (eth:0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984) [uniswapv3/Uni]
    +++ description: ERC20 governance token with checkpoint voting. Its constructor mints a fixed initial supply; the minter can mint at most 2% of supply per mint, with a minimum interval of 1y. Votes count only when delegated.
```

```diff
+   Status: CREATED
    contract UniswapV3Factory (eth:0x1F98431c8aD98523631AE4a59f267346ea31F984) [uniswapv3/UniswapV3Factory]
    +++ description: Deploys Uniswap v3 pools: anyone can create one pool per token pair and enabled fee tier, at a CREATE2 address deterministic in (token0, token1, fee). Immutable. Its owner holds exactly three powers: enable new fee tiers (irreversible), call setFeeProtocol/collectProtocol on pools, and transfer the owner role. It cannot modify, pause, or upgrade deployed pools.
```

```diff
+   Status: CREATED
    contract GovernorBravo (eth:0x408ED6354d4973f66138C91495F2f2FCbd8724C3) [uniswapv3/GovernorBravoDelegate]
    +++ description: Upgradeable Governor Bravo governance proxy. Holders with more than the current proposal threshold of 1,000,000 UNI can create proposals. Voting begins 13,140 blocks after proposal creation and lasts 40,320 blocks; success requires more for-votes than against-votes and at least 40,000,000 UNI voting for. Successful proposals are queued in the configured timelock. The proxy admin can replace the implementation or nominate a new admin.
```

```diff
+   Status: CREATED
    contract UniversalRouter (eth:0x66a9893cC07D91D95644AEDD05D03f95e1dBA8Af) [uniswapv3/UniversalRouter]
    +++ description: Command-based router that executes caller-supplied operations such as v2/v3/v4 swaps, Permit2 transfers, WETH wrapping, and token sweeps in one transaction. Immutable and unprivileged; routes are computed off-chain by the caller.
```

```diff
+   Status: CREATED
    contract SwapRouter02 (eth:0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45) [uniswapv3/SwapRouter02]
    +++ description: Swap router covering both v2 and v3 pools with multicall batching. Immutable and unprivileged: it only moves funds of callers who approved it, along routes the caller encodes.
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
    +++ description: V3 swap router supporting single- and multi-hop exact-input and exact-output swaps. Immutable and unprivileged; it executes the route encoded by the caller.
```

```diff
+   Status: CREATED
    contract V3OpenFeeAdapter (eth:0xf2371551Fe3937Db7c750f4DfABe5c2fFFdcBf5A) [uniswapv3/V3OpenFeeAdapter]
    +++ description: Adapter for administering a configured Uniswap v3 factory. While it holds the factory owner role, anyone can ask it to apply configured protocol fees to pools or collect accrued fees to its fixed recipient. The fee setter controls global, per-tier, and per-pool fee settings; the owner can replace the fee setter, enable factory fee tiers, or transfer factory ownership.
```

```diff
+   Status: CREATED
    contract TokenJar (eth:0xf38521f130fcCF29dB1961597bc5d2B60F995f85) [uniswapv3/TokenJar]
    +++ description: Token escrow whose releaser can transfer held balances. The owner can replace the releaser, changing who controls accumulated and future deposits.
```
