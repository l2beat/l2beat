Generated with discovered.json: 0x1f980080e30a2867a91fab80512c9f507530ccd4

# Diff at Tue, 18 Feb 2025 13:31:26 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 7734100

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x22373Ed2aD10C50E7f4eAE45c7E46E22140AAb0A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x2e459f61F52dC4DfC97f108834A447F75e576feC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x3C42e5DA2836E3A3BC7a3F46A7715af20bF74673)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x54CE6E25aE6442016D1D82446b7E7212E13D9e9A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x677c646c0bB767Bd7f689bff1BF229368E84a97a)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x693A3faC81fb0996a742EF8DE54A819a60317B79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x772755f7030B928515C4EAc629A39ACb094ead75)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x78983Bb6ee4c33393cca109C01C795EAb4a8e5d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x797E3FC145681ca8149aBd966DdD420AEe725155)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x9845eb6113cBDAc99B9Db72aFE1D44F0c88FC913)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SafeL2 (0x989BD78804828FEc351dbCAc34b192cA42f617e0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x9aA23B21D76B3397A831e500449a28A9EbD31260)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xA06dB2d01e043Ea6B02ba667d8C0Be9d260165c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (0xAdC43a81DfA5bD1cB5b52aA46Da717440eF35a09)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xc268dB9935c2630D7BCedf9Ee7D1AA1160fD6238)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SafeL2 (0xC2D223BAaE38847847Cc757805f0c66E95A7cb05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xD8EcCA4148DC70ac0852C159a1F59c47A0431AFA)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xDBf00e6c7cf61e82E67390D9eD198C83094CF6C7)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xeF6FFbC1f895083c953fa36c6F6f41121bce474D)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xF2542473944b5CE199F2444A3c97C1EcAD486347)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```
