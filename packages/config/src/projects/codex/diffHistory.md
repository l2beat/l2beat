Generated with discovered.json: 0xaea601cd8d770d131d71e0718d5990314ad1e433

# Diff at Fri, 30 Oct 2026 12:35:11 GMT:

- id: 1b9d53c6
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1793363627

## Description

Initial discovery of Codex, an OP Stack rollup by Codex operated by Conduit.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC) [opstack/SuperchainConfigFake_expiry]
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1E1d73536A081Ef2F355d29794547a9770Aeb1E0) [opstack/PreimageOracle]
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0x2506277D5Ebcda7D9a53728FB3272C007646294c) [opstack/L1CrossDomainMessenger]
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x39655086EE0576E918228525EF1473BD28A74Ead) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x49FeCE81C4cd766e171cCB06E8c8a210495Dda11) [opstack/L1ERC721Bridge]
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x4A7aF09921118d0983EA61d69d2Bcdb540a6eF3e) [opstack/AnchorStateRegistry_post20]
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. This variant stores respectedGameType, retirementTimestamp, and disputeGameFinalityDelaySeconds locally and drops the legacy *FromGame fields, since the AggregateVerifier model does not expose vm()/weth()/absolutePrestate() on its game implementation.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x52759C07A759c81BAab28AE1BE5A19e6450959bD) [opstack/OptimismPortal2]
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x6A3855dc26e2beA8Ac73f82Cda79f3808B6C6F6C) [opstack/DisputeGameFactory_v2]
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them. This variant exposes per-type reads only; the legacy array views (gameImpls[], initBonds[]) were removed in the new implementation.
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x8158147fdc49839fa2ef6eE39fB6bbC39EEC42A6) [opstack/SystemConfig]
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x817285C393923BA047f41281c9d52d1A2b24419C) [opstack/DelayedWETH]
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0x95e35F6395918c8D1487B01669215cfDAfE4d815) [opstack/OptimismMintableERC20Factory]
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0xa6b1A05a592719B0C8a70c69eac114C48410aDE4) [opstack/L1StandardBridge]
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
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
    contract AddressManager (eth:0xBc2270903C82F80D028B08E49cd1923797DC7283) [opstack/AddressManager]
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xe1dFFCBE4e22B813F26d2106D943C102e7cAb87e) [opstack/PermissionedDisputeGame]
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```
