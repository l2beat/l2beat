Generated with discovered.json: 0x37eb9a48f2458da3de33c51be1b1a20d3ea18785

# Diff at Thu, 26 Nov 2026 15:44:16 GMT:

- id: 5bf27dc9
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1794917357

## Description

Initial discovery of Swell's swETH liquid staking: the token, its exit queue, deposit manager, repricing oracle, node operator registry and role registry, the fee auction, the LayerZero OFT lockbox, the Timelock and the multisigs.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (eth:0x00000000219ab540356cBB839Cbe05303d7705Fa) [global/DepositContract]
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract Swell Multisig (eth:0x20fDF47509C5eFC0e1101e3CE443691781C17F90) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x25EAf579cA2255fAA5463c635eec28697b5b8846) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RepricingOracle (eth:0x289d600447A74B952AD16F0BD53b8eaAac2d2D71) [sweth/RepricingOracle]
    +++ description: Entry point for the bot's balance reports. A report must be recent (at most 150 blocks old) and its new rate within 10000000000000000 (1e18 = 100%) of a reference rate computed from the same report's balances and onchain supply, so the reported validator balances themselves are not verified onchain. The external proof-of-reserves feed is eth:0x0000000000000000000000000000000000000000 (zero address = disabled). A falling rate pauses the whole system. Each report also processes the exit queue up to a request chosen by the bot.
```

```diff
+   Status: CREATED
    contract NodeOperatorRegistry (eth:0x46DdC39E780088B1B146Aba8cBBe15DC321A1A1d) [sweth/NodeOperatorRegistry]
    +++ description: Registry of node operators and their validator keys (8 operators). The platform admin adds, disables and edits operators. Each operator registers keys from its controlling address, and keys are used in order when the bot funds validators. Operators post no bond, so slashing losses fall on all token holders. Deposit signatures are not checked onchain.
```

```diff
+   Status: CREATED
    contract swEXIT (eth:0x48C11b86807627AF70a34662D4865cF854251663) [sweth/ExitQueue]
    +++ description: Exit queue of the token. A holder burns tokens for an NFT claim that records the rate at request time (0.005 to 500 tokens per request). While its whitelist is on, only whitelisted addresses can request (whitelist enabled: false). Requests are processed in order only by the oracle during a bot report, with ETH pulled from the deposit manager. A claim pays the lower of the request-time and processing-time rate. New requests and claims revert while withdrawals are paused.
```

```diff
+   Status: CREATED
    contract SwETHProxyOFT (eth:0x5C6392A69dc11f254457716c682F70e4B2ed7B05) [sweth/ProxyOFT]
    +++ description: LayerZero v1 proxy OFT. It locks the token on Ethereum when it is sent to another chain and releases it when it comes back. Its tokens on other chains are backed only by this lockbox. Its owner sets the trusted remote contracts and LayerZero configuration.
```

```diff
+   Status: CREATED
    contract AccessControlManager (eth:0x625087d72c762254a72CB22cC2ECa40da6b95EAC) [sweth/AccessControlManager]
    +++ description: Central role and pause registry for one staking system. Its token, exit queue, deposit manager, operator registry and oracle check roles here and resolve each other's and the treasury's addresses through it. Paused now: deposits false, bot functions false, operator functions false, withdrawals false.
```

```diff
+   Status: CREATED
    contract Swell Pauser Multisig (eth:0x6ad7cFCDA2CE9d9B9d310dEcB4bc16f200d3DfD7) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Swell Operations Multisig (eth:0x9522FFF064bCb2f319c330A72ee57195775168bC) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositManager (eth:0xb3D9cf8E163bbc840195a97E81F8A34E295B8f39) [sweth/DepositManager]
    +++ description: Receives all deposited ETH and is the withdrawal credential of every validator (0x010000000000000000000000b3d9cf8e163bbc840195a97e81f8a34e295b8f39), so exited and skimmed validator ETH returns here. ETH leaves only to new validators, when the bot funds the next registered keys (the call reverts if the deposit root changed since the bot read it, and ETH reserved for queued exits stays), or to the exit queue.
```

```diff
+   Status: CREATED
    contract Timelock (eth:0xbA829003e6b5dD858fbed3945719939a6DC3073b) [sweth/Timelock]
    +++ description: Compound-style timelock. Its admin queues transactions that can execute after 7d and within a grace period. The delay and admin can only be changed through the timelock itself.
```

```diff
+   Status: CREATED
    contract FeeFlowController (eth:0xf17b581496bc2669ce0931FAcAA1ADe35029E85D) [sweth/FeeFlowController]
    +++ description: Fee sink. Fee tokens collect here and are sold in repeated Dutch auctions: the buyer pays the current price in the payment token, which goes to eth:0x000000000000000000000000000000000000dEaD, and receives the whole balance. Each auction's price falls to zero over 1209600 seconds.
```

```diff
+   Status: CREATED
    contract swETH (eth:0xf951E335afb289353dc249e82926178EaC7DEd78) [sweth/swETH]
    +++ description: Liquid staking token. Anyone can deposit ETH unless deposits are paused or the whitelist is on (whitelist enabled: false). Tokens are minted at the current rate, and the ETH is forwarded to the deposit manager in the same call. The ETH value per token changes only when the oracle reprices it: each update may move it by at most 10000000000000000 (1e18 = 100%), at least 3600 seconds apart. Each reprice mints a share of the reported rewards as new tokens for node operators and the treasury.
```
