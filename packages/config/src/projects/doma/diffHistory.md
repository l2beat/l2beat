Generated with discovered.json: 0x2bc9893c94ca80a730119c2c615087947a1d3fd2

# Diff at Thu, 26 Nov 2026 18:06:46 GMT:

- id: aab587f1
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@19a3e421c28364d0b3fbae939e5b34aa5bea4896 block: 1794868463
- current timestamp: 1795716090

## Description

SuperchainConfig (Conduit's local fork): Conduit Multisig 1 upgraded it 2.4.2 → 2.5.0, the same code OP Mainnet's SuperchainConfig runs since Upgrade 21. It only adds an `isLocalOrGlobalPaused` view ([diff](https://disco.l2beat.com/diff/eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550/eth:0xA303a644cfbC0c34f6a9dBEaFdebA4C967EA01e7)).

## Watched changes

```diff
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      sourceHashes.1:
-        "0x2cd597b7305a446a1df355e6909cbd75fe38aa045faf4876a8e5496eebc1734f"
+        "0x16be77d04285e6ef110e395e6664cfa03f06bc550200439779c0b90c43ac3de9"
      values.$implementation:
-        "eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550"
+        "eth:0xA303a644cfbC0c34f6a9dBEaFdebA4C967EA01e7"
      values.$pastUpgrades.10:
+        ["2026-11-25T13:40:35.000Z","0x6d8148efbf5f2d5ec205081d9be3aed63b654c94310d7c3d20e6c387d091f2f4",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.11:
+        ["2026-11-25T13:40:35.000Z","0x6d8148efbf5f2d5ec205081d9be3aed63b654c94310d7c3d20e6c387d091f2f4",["eth:0x5570b1f2b97B1E35b5C6f9Ee76f6cf02c9917504"]]
      values.$pastUpgrades.12:
+        ["2026-11-25T13:40:35.000Z","0x6d8148efbf5f2d5ec205081d9be3aed63b654c94310d7c3d20e6c387d091f2f4",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.13:
+        ["2026-11-25T13:40:35.000Z","0x6d8148efbf5f2d5ec205081d9be3aed63b654c94310d7c3d20e6c387d091f2f4",["eth:0x5570b1f2b97B1E35b5C6f9Ee76f6cf02c9917504"]]
      values.$pastUpgrades.14:
+        ["2026-11-25T13:40:35.000Z","0x6d8148efbf5f2d5ec205081d9be3aed63b654c94310d7c3d20e6c387d091f2f4",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.15:
+        ["2026-11-25T13:40:35.000Z","0x6d8148efbf5f2d5ec205081d9be3aed63b654c94310d7c3d20e6c387d091f2f4",["eth:0xA303a644cfbC0c34f6a9dBEaFdebA4C967EA01e7"]]
      values.$pastUpgrades.16:
+        ["2026-11-25T13:40:35.000Z","0x6d8148efbf5f2d5ec205081d9be3aed63b654c94310d7c3d20e6c387d091f2f4",["eth:0x2476c911E6D4D9411E677D8Faf15a64ac1fDEEe8"]]
      values.$pastUpgrades.17:
+        ["2026-11-25T13:40:35.000Z","0x6d8148efbf5f2d5ec205081d9be3aed63b654c94310d7c3d20e6c387d091f2f4",["eth:0xA303a644cfbC0c34f6a9dBEaFdebA4C967EA01e7"]]
      values.$upgradeCount:
-        10
+        18
      values.version:
-        "2.4.2"
+        "2.5.0"
      implementationNames.eth:0xE4F9779ab53070a55db24dFAeFf9AF147c6ED550:
-        "SuperchainConfig"
      implementationNames.eth:0xA303a644cfbC0c34f6a9dBEaFdebA4C967EA01e7:
+        "SuperchainConfig"
    }
```

## Source code changes

```diff
.../SuperchainConfig/SuperchainConfig.sol          | 23 ++++++++++++++++------
 1 file changed, 17 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0x44c1be11706fb9be6de8ca601bff5d21ad6fe738

# Diff at Mon, 16 Nov 2026 22:36:18 GMT:

- id: cb9ee66f
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@33953ebfd29755f915c8500adce5cced0fbc9449 block: 1793363627
- current timestamp: 1794868463

## Description

Conduit Multisig 1: member removed; threshold 4/11 → 4/10.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.8:
-        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x53ddd10772fd0df8e4b001fc53d3106af095c0c7

# Diff at Fri, 30 Oct 2026 12:35:14 GMT:

- id: 48cd210a
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1793363627

## Description

Initial discovery of Doma, an OP Stack Optimium (Celestia DA) by D3 operated by Conduit.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC) [opstack/SuperchainConfigFake_expiry]
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x0A6b12690b6edAf39D0193C816d0ec3CA35F9c15) [opstack/AnchorStateRegistry_post20]
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. This variant stores respectedGameType, retirementTimestamp, and disputeGameFinalityDelaySeconds locally and drops the legacy *FromGame fields, since the AggregateVerifier model does not expose vm()/weth()/absolutePrestate() on its game implementation.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x14Ea6ADD7fA61001bD2e38100BFdF2cD710E44D9) [opstack/OptimismPortal2]
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1E1d73536A081Ef2F355d29794547a9770Aeb1E0) [opstack/PreimageOracle]
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0x27490c846c60e11c1FF9b734619497a82fBdE515) [opstack/L1CrossDomainMessenger]
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x4927063fC57Ecd9cf87F0adAdB17D559DdD52c79) [opstack/DelayedWETH]
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0x576726bFf2F27Fc792CcB54309A47AB990aE6b0b) [opstack/AddressManager]
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x609Df4AE1f9f2E9d81d357C0a205A9e8d8d03F28) [opstack/DisputeGameFactory_v2]
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them. This variant exposes per-type reads only; the legacy array views (gameImpls[], initBonds[]) were removed in the new implementation.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x61BCFA6D6712A551b61307B079Ed7F6Df970E13e) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (eth:0xaCc005DCd857B401e4732E6F7837135A22825cfA) [opstack/MIPS]
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0xbaedB5B6Da67F96b4125F17dD92F618696494bd3) [opstack/L1StandardBridge]
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0xC5A1385705CCf92B48A4796117196503Af569960) [opstack/SystemConfig]
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0xcc3596c53E644649CA6894Cdcc53b6bd660D3934) [opstack/L1ERC721Bridge]
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0xCC8FbdCDD32C44F57091205B2056F70b88D04138) [opstack/OptimismMintableERC20Factory]
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xe1dFFCBE4e22B813F26d2106D943C102e7cAb87e) [opstack/PermissionedDisputeGame]
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```
