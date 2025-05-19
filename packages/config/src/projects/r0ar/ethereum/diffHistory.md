Generated with discovered.json: 0x0eccd24d86a21ff5ad4fedb09925ed974eef2d1a

# Diff at Thu, 08 May 2025 10:03:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22195184
- current block number: 22195184

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

```diff
    contract FaultDisputeGame (0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0x6e8bad4ae53c0f84e645dc27db973a34d04f61bb

# Diff at Tue, 06 May 2025 10:56:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 22195184
- current block number: 22195184

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    EOA  (0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x30bab02e4514dd91c43e1924be73206ce8cd1e7f

# Diff at Tue, 29 Apr 2025 08:19:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22195184
- current block number: 22195184

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x87aab081Ac9F8ce80fb048f23280DF019036BA1d","via":[]},{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract DelayedWETH (0x465833609d9ff2Cb9A070b0d71b700F318C97293) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","description":"can pull funds from the contract in case of emergency.","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"}]},{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract AddressManager (0x66e58c9D0b42110E956F54aA850C0d629f4B56C5) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","description":"set and change address mappings.","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract L1StandardBridge (0x683ca289a8418Cb090E42929A73a263d7b81DfC2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract SystemConfig (0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xF263a0AA8aFEaA7d516B596d49d7BA6C0FeB102c","via":[]},{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract SuperchainConfig (0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x87aab081Ac9F8ce80fb048f23280DF019036BA1d","via":[]},{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract L2OutputOracle (0xb7850CFa577332EB839840e1411962AC3Dd2f183) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x79DdF0745D14783cDC2a05624c585Ddce07F4A02","via":[]},{"permission":"propose","to":"0x8B72aB0D35F87e0f56D9805031D7CDfA13D1C71F","via":[]},{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract AnchorStateRegistry (0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract DisputeGameFactory (0xF014d8028A7028352baD6226A4894Ae596e2846c) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

Generated with discovered.json: 0x2432c4861b0b30d531ba6ddfeddecc60a2c4c3e5

# Diff at Fri, 11 Apr 2025 13:16:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22195184
- current block number: 22195184

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03ee2917da962ec266b091f4b62121dc9682bb0db534633707325339f99ee405:
+        "v1.5.1-rc.1 (cannon64)"
      usedTypes.0.arg.0x0354eee87a1775d96afee8977ef6d5d6bd3612b256170952a01bf1051610ee01:
+        "v1.5.1-rc.1"
      usedTypes.0.arg.0x039970872142f48b189d18dcbc03a3737338d098b0101713dc2d6710f9deb5ef:
+        "v1.5.0 (cannon64)"
      usedTypes.0.arg.0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9:
+        "v1.5.0"
      usedTypes.0.arg.0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37:
+        "v1.4.0-unichain"
    }
```

```diff
    contract FaultDisputeGame (0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03ee2917da962ec266b091f4b62121dc9682bb0db534633707325339f99ee405:
+        "v1.5.1-rc.1 (cannon64)"
      usedTypes.0.arg.0x0354eee87a1775d96afee8977ef6d5d6bd3612b256170952a01bf1051610ee01:
+        "v1.5.1-rc.1"
      usedTypes.0.arg.0x039970872142f48b189d18dcbc03a3737338d098b0101713dc2d6710f9deb5ef:
+        "v1.5.0 (cannon64)"
      usedTypes.0.arg.0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9:
+        "v1.5.0"
      usedTypes.0.arg.0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37:
+        "v1.4.0-unichain"
    }
```

Generated with discovered.json: 0x5ae255fc5aab3c872cee00c686ef93b0f65b4bab

# Diff at Fri, 04 Apr 2025 11:53:00 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 22195184

## Description

Standard op chain.

## Initial discovery

```diff
+   Status: CREATED
    contract PreimageOracle (0x192668f6b57DeB9D46e6DE87caD7065a052fe1b4)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x465833609d9ff2Cb9A070b0d71b700F318C97293)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x5b0e75a52862881b4077C865B244CC17cD2b531b)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract AddressManager (0x66e58c9D0b42110E956F54aA850C0d629f4B56C5)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x683ca289a8418Cb090E42929A73a263d7b81DfC2)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract MIPS (0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xb7850CFa577332EB839840e1411962AC3Dd2f183)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xF014d8028A7028352baD6226A4894Ae596e2846c)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xf758e2272FCe1330d8a1De38D5128A47B4041752)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```
