Generated with discovered.json: 0x543c8a86aa7df627c29938cc4f8a27a64758d15b

# Diff at Mon, 24 Aug 2026 10:11:33 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1787566228

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract PoolManager (eth:0x000000000004444c5dc75cB358380D2e3dE08A90) [uniswapv4/PoolManager]
    +++ description: Uniswap v4 core: a non-upgradeable singleton that holds every v4 pool as a storage entry keyed by its currency pair, LP fee, tick spacing, and hook address. Anyone can create a pool with any static LP fee up to 100%, or a dynamic fee controlled by the pool's hook. All interactions run inside a lock that settles only net token amounts at the end of each transaction (flash accounting). The owner's only powers are replacing the protocol fee controller and transferring the owner role; the controller can set protocol fees on pools, hard-capped in code at 0.1% per swap direction, and collect the accrued fees.
```

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
    contract V4FeePolicy (eth:0x1cd822b70a0591420F65E94b9B3A0D0b0fB3a314) [uniswapv4/V4FeePolicy]
    +++ description: Computes the protocol fee for Uniswap v4 pools. Hookless pools are priced from a piecewise-linear schedule of their LP fee (the fee buckets); hooked pools pay a fee only if their hook is classified - by the fee setter directly, or through self-reported flag rules - into a family with a configured fee. The fee setter configures the schedule and classifications; the owner can replace the fee setter.
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
    contract UniversalRouter (eth:0x66a9893cC07D91D95644AEDD05D03f95e1dBA8Af) [uniswapv3/UniversalRouter]
    +++ description: Command-based router that executes caller-supplied operations such as v2/v3/v4 swaps, Permit2 transfers, WETH wrapping, and token sweeps in one transaction. Immutable and unprivileged; routes are computed off-chain by the caller.
```

```diff
+   Status: CREATED
    contract V4FeeAdapter (eth:0x89A5D5bF00a27D55c02951E49078a5C5771051dB) [uniswapv4/V4FeeAdapter]
    +++ description: Protocol fee controller for a configured Uniswap v4 pool manager. Anyone can ask it to apply the protocol fee computed by the configured policy contract to a pool, and to collect accrued protocol fees to its fixed recipient. The fee setter can override the fee for individual pools; the owner can replace the policy contract and the fee setter.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xbd123D5b1E148266154F5722C1d059D70059Cf93) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract PositionManager (eth:0xbD216513d74C8cf14cf4747E6AaA6420FF64ee9e) [uniswapv4/PositionManager]
    +++ description: Uniswap v4 periphery: represents v4 liquidity positions as ERC-721 NFTs and batches liquidity operations against the configured pool manager, pulling tokens through Permit2. It has no owner and no special privileges in the core.
```

```diff
+   Status: CREATED
    contract PositionDescriptor (eth:0xd1428Ba554F4C8450b763a0B2040A4935c63f06C) [uniswapv4/PositionDescriptor]
    +++ description: Renders the metadata and SVG image (tokenURI) of Uniswap v4 position NFTs. It takes no part in pool accounting and cannot affect funds.
```

```diff
+   Status: CREATED
    contract TokenJar (eth:0xf38521f130fcCF29dB1961597bc5d2B60F995f85) [uniswapv3/TokenJar]
    +++ description: Token escrow whose releaser can transfer held balances. The owner can replace the releaser, changing who controls accumulated and future deposits.
```
