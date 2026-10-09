Generated with discovered.json: 0x18167243febf4015d7e041e511b33de0a9d4924b

# Diff at Fri, 09 Oct 2026 09:35:24 GMT:

- id: 60470d30
- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1791537166

## Description

Initial discovery of Uniswap V2: the factory, two representative pairs, Router02, and the governance and protocol fee contracts it shares with Uniswap V3.

## Initial discovery

```diff
+   Status: CREATED
    contract UniswapV2Pair_WETH_USDT (eth:0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852) [uniswapv2/UniswapV2Pair]
    +++ description: A constant-product AMM pool for one token pair, deployed by the factory and fully immutable: no owner, no pause, no upgrade path. Swaps pay a 0.3% fee to liquidity providers. If the factory has a protocol fee recipient set, the pair mints it 1/6 of those fees as LP tokens. Also a cumulative-price oracle anyone can read.
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
    contract GovernorBravo (eth:0x408ED6354d4973f66138C91495F2f2FCbd8724C3) [uniswapv3/GovernorBravoDelegate]
    +++ description: Upgradeable Governor Bravo governance proxy. Holders with more than the current proposal threshold of 1,000,000 UNI can create proposals. Voting begins 13,140 blocks after proposal creation and lasts 40,320 blocks; success requires more for-votes than against-votes and at least 40,000,000 UNI voting for. Successful proposals are queued in the configured timelock. The proxy admin can replace the implementation or nominate a new admin.
```

```diff
+   Status: CREATED
    contract UniswapV2Factory (eth:0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f) [uniswapv2/UniswapV2Factory]
    +++ description: Deploys Uniswap v2 pairs: anyone can create one pair per token pair, at a CREATE2 address deterministic in the two tokens. Immutable. Its fee setter can switch a protocol fee on or off by choosing its recipient, and can hand the setter role to another address. It cannot modify, pause, or upgrade deployed pairs, or touch their funds.
```

```diff
+   Status: CREATED
    contract UniswapV2Router02 (eth:0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D) [uniswapv2/UniswapV2Router02]
    +++ description: Stateless periphery that routes swaps and liquidity changes through Uniswap v2 pairs. Immutable, with no owner, and it holds no user funds between transactions.
```

```diff
+   Status: CREATED
    contract UniswapV2Pair_USDC_WETH (eth:0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc) [uniswapv2/UniswapV2Pair]
    +++ description: A constant-product AMM pool for one token pair, deployed by the factory and fully immutable: no owner, no pause, no upgrade path. Swaps pay a 0.3% fee to liquidity providers. If the factory has a protocol fee recipient set, the pair mints it 1/6 of those fees as LP tokens. Also a cumulative-price oracle anyone can read.
```

```diff
+   Status: CREATED
    contract TokenJar (eth:0xf38521f130fcCF29dB1961597bc5d2B60F995f85) [uniswapv3/TokenJar]
    +++ description: Token escrow whose releaser can transfer held balances. The owner can replace the releaser, changing who controls accumulated and future deposits.
```
