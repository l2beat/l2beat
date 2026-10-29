Generated with discovered.json: 0x72bc39e654d382396eede84fe1d6ec71a1be3cba

# Diff at Thu, 29 Oct 2026 17:33:43 GMT:

- id: 488ff7a1
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1793192557

## Description

Initial discovery of Whitechain, an OP Stack L2 on op-contracts v8.0.0 (Upgrade 20) with the custom gas token feature enabled and the super permissioned game (type 5) respected.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x0390F00fD57E771Afa19630B4ad8CE68ddA73506) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x0665f74e013b7FCcfDa6dAF8951bAf3C982a3864) [opstack/OptimismPortal2]
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the SuperPermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0x149a093e8Fe94610586e068739E929723Ac0Cd1A) [opstack/OptimismMintableERC20Factory]
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x1D761826ad3098D10f6dDfbd143957Aaf2b6e50C) [opstack/SystemConfig]
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x1De4f415Dc5bF6e458Cf32d13452c24A35Ec90e3) [opstack/DisputeGameFactory_v2]
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them. This variant exposes per-type reads only; the legacy array views (gameImpls[], initBonds[]) were removed in the new implementation.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x35aB61eE5D1C2319d1822A7bE1b6B3FaE98AD886) [opstack/SuperchainConfigFake_expiry]
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
```

```diff
+   Status: CREATED
    contract Whitechain Multisig 1 (eth:0x568440132075d4E1c3E42111EF561636f4956eAd) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0x589cD6dEd71Cf4867351E86507A1Ce81Bde0Bc9C) [opstack/L1CrossDomainMessenger]
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract Whitechain Multisig 3 (eth:0x5918870d5391e0610d7624837cABEd9d4AbEeeE0) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperPermissionedDisputeGame (eth:0x5C3eb47cB0174aea522a2a9Ae79487139A53D691) [opstack/SuperPermissionedDisputeGame]
    +++ description: Logic of the permissioned dispute game introduced in Upgrade 20. Only the proposer configured in the DisputeGameFactory can create games of this type, and each one commits to a super root anchored to an L2 timestamp. Unlike the permissioned game it replaces, it runs no VM and exposes no challenger, bond, clock or absolute prestate: validity is governed by the AnchorStateRegistry and the Guardian.
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0x7b806b8A81Ba1D4d2Df62180147e40F32f1eeb49) [opstack/AddressManager]
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x7b854CBa91d3B788bc311e2326E203C0f46dB3Fe) [opstack/L1ERC721Bridge]
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x7e954f20F24b7988EA966C4E7880fe6D21dCc2D9) [opstack/L1StandardBridge]
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x860801a7766859B82b0B572f75a56d4D3903B23a) [opstack/AnchorStateRegistry_post20]
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. This variant stores respectedGameType, retirementTimestamp, and disputeGameFinalityDelaySeconds locally and drops the legacy *FromGame fields, since the AggregateVerifier model does not expose vm()/weth()/absolutePrestate() on its game implementation.
```

```diff
+   Status: CREATED
    contract Whitechain Multisig 2 (eth:0x8da4Ce0f49E472fb6F892c779b3E63C7a55B23aF) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x9419a57179dEF1FBdb8e7859756e85ad0ae396c7) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x99BbebAea69666405A8e19dF5d185fecC6BF46Fe) [opstack/DelayedWETH]
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```
