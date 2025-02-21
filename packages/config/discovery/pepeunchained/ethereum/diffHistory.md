Generated with discovered.json: 0x1cd2a791abac22641990769d932f5e15038678ac

# Diff at Fri, 21 Feb 2025 11:15:31 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 21894348

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x0be0a010a8695f3a7415f34285Aabe6be220326e)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x120ffE893423e51409f57DE02c5263D43717D639)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract MIPS (0x1f76E3002f0Adc7BE52091c419B8E23D19a2e2a8)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x25CBeDa9431863B5dF4CBA6C3B78dBCED3bFb7F1)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x2B6110342f3C326a848cC41a3BFEcCEfD12D639F)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x4e0371A2fCCf4CCC68217134bADa77914b50B7DD)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x9D8d6cF1a45f8767Aba634Ac2d6eBBFf0296EaAd)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xe8B32cB7069BbF51Fa9aC2EFdD4C1Bbef7db709C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```
