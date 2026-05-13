Generated with discovered.json: 0x9835ad948b4707b3b61c7546a569e2613936126c

# Diff at Wed, 13 May 2026 21:59:23 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1778709498

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x0B95fF1d1B113bac3E29Ac0BBF2089126C9aE81A) [opstack/AnchorStateRegistry_post13]
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract MainchainBridgeManager (eth:0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x3a63087B36Ad5a2fD89C7C8517832dE067Fe4959) [opstack/L1ERC721Bridge]
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x45dA2CD511DA5FEAa535eBF166E628314a65843a) [opstack/DisputeGameFactory]
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x502e993a5aFC9fE59b00B07ee500729D71092E34) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0x51639D151456d0384285C6974e441A5D2B784B7D) [opstack/OptimismMintableERC20Factory]
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0x58bf355C5d4EdFc723eF89d99582ECCfd143266A) [opstack/PermissionedDisputeGame]
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract MainchainGateway (eth:0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x652CD53eCf9466E5Fb00D0E11d6CBf6469a56D77) [opstack/OptimismPortal2]
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x69Fcd2E75af364295EaF48Dc058338F80CFfb434) [opstack/DelayedWETH]
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0x6FFbcf498CcF81111f397fa6065dEA13A47E573C) [opstack/AddressManager]
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x757077Ddf12B652430DCE8fF3e4c749F5Ca861fC) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x85Ce2Ccef125aa8d018c298d5eA0f2FB5E5063c1) [opstack/L1StandardBridge]
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0xc4f4F908C36C8119f1FBd52CebbDB30C6f2a23C1) [opstack/SystemConfig]
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract ETHLockbox (eth:0xDD42F308E85dE1Bd2590Fa8d0C97AB2dFc830242) [opstack/ETHLockbox]
    +++ description: A simple escrow contract storing ETH for the canonical bridge.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0xEE552e802A50d855bD08E93dfcc69228FC7B9E2c) [opstack/SuperchainConfigFake_expiry]
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
```

```diff
+   Status: CREATED
    contract PauseEnforcer (eth:0xF184a6Cd470Cac2CF5cD4fBa34e20D482D6A6062) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0xF9aD628d9F907ad5d46Ab80100dacDf09EAc9A8e) [opstack/L1CrossDomainMessenger]
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
