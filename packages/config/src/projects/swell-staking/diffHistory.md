Generated with discovered.json: 0x466a6ba7c7664d7f6ee3e4cd4988df784bafaa3a

# Diff at Tue, 27 Oct 2026 14:45:07 GMT:

- id: c04d6c2a
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1793112241

## Description

Initial discovery of Swell's swETH (liquid staking) and rswETH (liquid restaking): the two tokens, their exit queues, deposit managers, repricing oracles, node operator registries and role registries, the EigenLayer restaking accounts' manager and beacon, the fee auction, the two LayerZero OFT lockboxes, and the shared Timelock and multisigs. EigenLayer core and the per-account StakerProxy clones are not crawled.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (eth:0x00000000219ab540356cBB839Cbe05303d7705Fa) [global/DepositContract]
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract StakerProxy (eth:0x0790A0f0E0232855D4aC62beBC5C8745f150E555) [swell-staking/StakerProxy]
    +++ description: Implementation of the restaking accounts behind the beacon. Each account owns one EigenPod; ETH it receives can only be sent to the deposit manager.
```

```diff
+   Status: CREATED
    contract RswETHOFTAdapter (eth:0x1486D39646cdee84619bd05997319545A8575079) [layerzero/OFTAdapter]
    +++ description: An OApp in the LayerZero protocol that adapts an existing ERC20 token into the OFT standard. Its owner can configure peers and LayerZero security settings for connected routes.
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
    contract swETHRepricingOracle (eth:0x289d600447A74B952AD16F0BD53b8eaAac2d2D71) [swell-staking/RepricingOracle]
    +++ description: Entry point for the bot's balance reports. A report must be recent (at most 150 blocks old) and its new rate within 10000000000000000 (1e18 = 100%) of a reference rate computed from the same report's balances and on-chain supply, so the reported validator balances themselves are not verified on-chain. The external proof-of-reserves feed is eth:0x0000000000000000000000000000000000000000 (zero address = disabled). A falling rate pauses the whole system. Each report also processes the exit queue up to a request chosen by the bot.
```

```diff
+   Status: CREATED
    contract swETHNodeOperatorRegistry (eth:0x46DdC39E780088B1B146Aba8cBBe15DC321A1A1d) [swell-staking/NodeOperatorRegistry]
    +++ description: Registry of node operators and their validator keys (8 operators). The platform admin adds, disables and edits operators; each operator registers keys from its controlling address, and keys are used in order when the bot funds validators. Operators post no bond, so slashing losses fall on all token holders. Deposit signatures are not checked on-chain.
```

```diff
+   Status: CREATED
    contract swEXIT (eth:0x48C11b86807627AF70a34662D4865cF854251663) [swell-staking/ExitQueue]
    +++ description: Exit queue of the token. A holder burns tokens for an NFT claim that records the rate at request time (5000000000000000 to 500000000000000000000 tokens per request, 18 decimals). Requests are processed in order only by the oracle during a bot report, with ETH pulled from the deposit manager; a claim pays the lower of the request-time and processing-time rate. New requests and claims revert while withdrawals are paused.
```

```diff
+   Status: CREATED
    contract rswEXIT (eth:0x58749C46Ffe97e4d79508a2C781C440f4756f064) [swell-staking/ExitQueue]
    +++ description: Exit queue of the token. A holder burns tokens for an NFT claim that records the rate at request time (5000000000000000 to 500000000000000000000 tokens per request, 18 decimals). Requests are processed in order only by the oracle during a bot report, with ETH pulled from the deposit manager; a claim pays the lower of the request-time and processing-time rate. New requests and claims revert while withdrawals are paused.
```

```diff
+   Status: CREATED
    contract SwETHProxyOFT (eth:0x5C6392A69dc11f254457716c682F70e4B2ed7B05) [swell-staking/ProxyOFT]
    +++ description: LayerZero v1 proxy OFT. It locks the token on Ethereum when it is sent to another chain and releases it when it comes back; tokens on other chains are backed only by this lockbox. Its owner sets the trusted remote contracts and LayerZero configuration.
```

```diff
+   Status: CREATED
    contract rswETHDepositManager (eth:0x5e6342D8090665bE14eeB8154c8a87B7249a4889) [swell-staking/RestakingDepositManager]
    +++ description: Receives all deposited ETH. ETH leaves to the EigenLayerManager when the bot funds validators whose withdrawal credential is a restaking account's EigenPod, to the exit queue, or, through a legacy bot function, to validators withdrawing to this contract's own EigenPod eth:0x8d0B4dfCcc8B2A268486d9754b135d8aD1Ee7258. Deposits of other liquid staking tokens mint at a rate from a provider set by the platform admin. ETH reserved for queued exits stays.
```

```diff
+   Status: CREATED
    contract swETHAccessControlManager (eth:0x625087d72c762254a72CB22cC2ECa40da6b95EAC) [swell-staking/AccessControlManager]
    +++ description: Central role and pause registry for one staking system. Every contract of the system checks roles here and resolves the token, exit queue, deposit manager, operator registry and treasury addresses through it. Paused now: deposits true, bot functions true, operator functions false, withdrawals true.
```

```diff
+   Status: CREATED
    contract Swell Pauser Multisig (eth:0x6ad7cFCDA2CE9d9B9d310dEcB4bc16f200d3DfD7) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract rswETHAccessControlManager (eth:0x796592b2092F7E150C48643dA19Dd2F28be3333F) [swell-staking/RestakingAccessControlManager]
    +++ description: Central role and pause registry for the restaking system. Every contract of the system checks roles here and resolves the token, exit queue, deposit manager, operator registry and treasury addresses through it. Paused now: deposits true, bot functions true, operator functions false, withdrawals true.
```

```diff
+   Status: CREATED
    contract Swell Operations Multisig (eth:0x9522FFF064bCb2f319c330A72ee57195775168bC) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract rswETHNodeOperatorRegistry (eth:0xAae0B305B3F1edDE7B11b680d4FA9252F7a1c524) [swell-staking/RestakingNodeOperatorRegistry]
    +++ description: Registry of node operators and their validator keys (9 operators). The operator registry maintainer adds, disables and edits operators; each operator registers keys from its controlling address, and keys are used in order when the bot funds validators. Operators post no bond, so slashing losses fall on all token holders. Deposit signatures are not checked on-chain.
```

```diff
+   Status: CREATED
    contract swETHDepositManager (eth:0xb3D9cf8E163bbc840195a97E81F8A34E295B8f39) [swell-staking/DepositManager]
    +++ description: Receives all deposited ETH and is the withdrawal credential of every validator (0x010000000000000000000000b3d9cf8e163bbc840195a97e81f8a34e295b8f39), so exited and skimmed validator ETH returns here. ETH leaves only to new validators, when the bot funds the next registered keys (the call reverts if the deposit root changed since the bot read it, and ETH reserved for queued exits stays), or to the exit queue.
```

```diff
+   Status: CREATED
    contract Timelock (eth:0xbA829003e6b5dD858fbed3945719939a6DC3073b) [swell-staking/Timelock]
    +++ description: Compound-style timelock. Its admin queues transactions that can execute after 7d and within a grace period; the delay and admin can only be changed through the timelock itself.
```

```diff
+   Status: CREATED
    contract EigenLayerManager (eth:0xC94CfFD5249Df4008a043EE61e13f19AF16d0936) [swell-staking/EigenLayerManager]
    +++ description: Manages the restaking accounts (40 so far), each a beacon proxy that owns one EigenPod. The bot stakes deposit manager ETH into validators whose withdrawal credential is an account's EigenPod. EigenLayer withdrawals return ETH to the account, and only the bot can send it on, to the deposit manager. Every account accepts signatures from eth:0x174Ae6eBFf5E678a1BeE298E1fF7dF799C7c1A08 as its own (EIP-1271).
```

```diff
+   Status: CREATED
    contract rswETHRepricingOracle (eth:0xd5A73c748449a45CC7D9f21c7ed3aB9eB3D2e959) [swell-staking/ForceableRepricingOracle]
    +++ description: Entry point for the bot's balance reports. A report must be recent (at most 150 blocks old) and its new rate within 10000000000000000 (1e18 = 100%) of a reference rate computed from the same report's balances and on-chain supply, so the reported validator balances themselves are not verified on-chain. The external proof-of-reserves feed is eth:0x0000000000000000000000000000000000000000 (zero address = disabled). A falling rate pauses the whole system. Each report also processes the exit queue up to a request chosen by the bot. A snapshot admin can force a report that skips the pause, freshness and reference-rate checks and does not pause on a falling rate.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xD750B84845f1cAdfEAc63f96Ec74635e949bFd14) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakerProxyBeacon (eth:0xE194661251877A69a1282bd0B2D344cCBA06E8aE) [swell-staking/StakerProxyBeacon]
    +++ description: Beacon holding the implementation of every restaking account (eth:0x0790A0f0E0232855D4aC62beBC5C8745f150E555). Its owner, the EigenLayerManager, upgrades all accounts at once through a platform-admin call.
```

```diff
+   Status: CREATED
    contract FeeFlowController (eth:0xf17b581496bc2669ce0931FAcAA1ADe35029E85D) [swell-staking/FeeFlowController]
    +++ description: Fee sink. Fee tokens collect here and are sold in repeated Dutch auctions: the buyer pays the current price in the payment token, which goes to eth:0x000000000000000000000000000000000000dEaD, and receives the whole balance. Each auction's price falls to zero over 1209600 seconds.
```

```diff
+   Status: CREATED
    contract swETH (eth:0xf951E335afb289353dc249e82926178EaC7DEd78) [swell-staking/swETH]
    +++ description: Liquid staking token. Anyone can deposit ETH unless the whitelist is on (whitelist enabled: false); tokens are minted at the current rate and the ETH is forwarded to the deposit manager in the same call. The ETH value per token changes only when the oracle reprices it: each update may move it by at most 10000000000000000 (1e18 = 100%), at least 3600 seconds apart. Each reprice mints a share of the reported rewards as new tokens for node operators and the treasury.
```

```diff
+   Status: CREATED
    contract rswETH (eth:0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0) [swell-staking/rswETH]
    +++ description: Liquid staking token. Anyone can deposit ETH unless the whitelist is on (whitelist enabled: false); tokens are minted at the current rate and the ETH is forwarded to the deposit manager in the same call. The ETH value per token changes only when the oracle reprices it: each update may move it by at most 10000000000000000 (1e18 = 100%), at least 3600 seconds apart. Each reprice mints a share of the reported rewards as new tokens for node operators and the treasury.
```
