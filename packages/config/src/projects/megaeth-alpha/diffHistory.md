Generated with discovered.json: 0xe7f942cc26d5a552b84b6f6e795167b910deb623

# Diff at Thu, 13 Nov 2025 19:10:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1763060967

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0x9754fD3D63B3EAC3fd62b6D54DE4f61b00D6E0Df)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xB2E4D20ECF58f2cE6a8d3bf0c982c2c77BE42152)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```
