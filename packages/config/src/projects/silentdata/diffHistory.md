Generated with discovered.json: 0x89705bc7279aa7ac2586bfcfb89080275f1a2d73

# Diff at Mon, 15 Sep 2025 09:50:48 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@37882e40cb6029f3a2ae2bb177048e3e846b833d block: 1756971267
- current timestamp: 1756971267

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756971267 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0x139Cf05B34D0EC49D3BFB9704EC4cEbA6ae95dD1) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.gameImpls.2:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.gameImpls.3:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x0d448f8b121efd5c2c043d4f0a3cdfab442f0d56

# Diff at Thu, 04 Sep 2025 07:35:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1756971267

## Description

Initial discovery:
- standard op stack deployment (all template code)
- permissioned opfp
- all-EOA admins
- no DA (no activity/rpc)

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0x00e3001F111ba89F20a8336Bb986a78d8f734E7E)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x139Cf05B34D0EC49D3BFB9704EC4cEbA6ae95dD1)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0x1B99b322085dA031e68C1202fdB756b3FFbaC7A6)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x1ffFf41f5E6384D6737D27B1F471E69212150e55)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x2DDf646eaaac38AEA031268a07de4E9ff1D967bd)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0x3131b01DF2F9eF6F42113090Edead5c97612c473)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x50F08E501f8A9D124eaB4990b057fDEfE3F6ae3E)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x5c3Efe3cA554816E9960C02AE3B4EB3A9a8D2E16)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x74A3065E6A4FFAA07dAC542E28452995f3c32EeA)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xa78F3521D5aDF038826f0FE3e809DF64Ec8a241D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (eth:0xaA59A0777648BC75cd10364083e878c1cCd6112a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0xCcd285b1ccf1cdaB36Da995B9fC68870E287694E)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xd8eAb3ed39Df0afB9BFD853f49637F7E73963966)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0xDD05146D14613BDC6a6cad371d15f1aE4269480e)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0xe97d73B0079e04f4ea4162b9173604a6213eF158)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```
