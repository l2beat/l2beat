Generated with discovered.json: 0xd84ec34915d811dc69124d18ec71e94a2b42b9fa

# Diff at Tue, 17 Sep 2024 09:53:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a17234c1dfeb209a9842df2b454c07e2b8da435d block: 20475247
- current block number: 20769555

## Description

DeputyGuardianModule upgrade: `setAnchorState()` is now callable by the deputy guardian.

## Watched changes

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.GnosisSafe_modules.0:
-        "0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

## Source code changes

```diff
.../DeputyGuardianModule.sol                         | 20 ++++++++++++++++++--
 1 file changed, 18 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x3097550011aa805b2c77b8c91d7e28b69e1fb2ef

# Diff at Thu, 12 Sep 2024 15:37:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@e6761599b8d9e0b597372bb0e9ca885e08af7101 block: 20475247
- current block number: 20475247

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475247 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      roles:
+        ["Challenger"]
      receivedPermissions:
+        [{"permission":"configure","target":"0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."}]
    }
```

```diff
    contract SystemConfig (0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
-        {"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","delay":0}
    }
```

Generated with discovered.json: 0xa5e55f52c69fd1e6fb0e19f71b9d1422d95b73a5

# Diff at Sun, 08 Sep 2024 17:24:33 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20475247
- current block number: 20475247

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475247 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","delay":0}
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      descriptions:
-        ["Liveness Guard of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - used to remove members inactive for 98d."]
    }
```

```diff
    contract ProxyAdmin (0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xd4b1EC0DEc3C7F12abD3ec27B7514880ae1C3a37"},{"permission":"upgrade","target":"0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730"},{"permission":"upgrade","target":"0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426"},{"permission":"upgrade","target":"0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956"},{"permission":"upgrade","target":"0x50D700e97967F9115e3f999bDB263d69F6704680"},{"permission":"upgrade","target":"0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3"},{"permission":"upgrade","target":"0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xd4b1EC0DEc3C7F12abD3ec27B7514880ae1C3a37"},{"permission":"upgrade","target":"0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730"},{"permission":"upgrade","target":"0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426"},{"permission":"upgrade","target":"0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956"},{"permission":"upgrade","target":"0x50D700e97967F9115e3f999bDB263d69F6704680"},{"permission":"upgrade","target":"0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA"}]
    }
```

```diff
    contract L2OutputOracle (0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","delay":0}
    }
```

```diff
    contract OptimismPortal (0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x50D700e97967F9115e3f999bDB263d69F6704680) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","delay":0}
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99, inheriting its permissions.","It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."]
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA","via":[{"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x50D700e97967F9115e3f999bDB263d69F6704680","via":[{"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956","via":[{"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426","via":[{"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730","via":[{"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"}]}
      receivedPermissions.1.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.1.via:
+        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      receivedPermissions.0.target:
-        "0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"
+        "0xd4b1EC0DEc3C7F12abD3ec27B7514880ae1C3a37"
      receivedPermissions.0.via:
+        [{"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"},{"permission":"act","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
    }
```

```diff
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      descriptions.0:
-        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A (the deputy guardian) to act on behalf of the Gnosis Safe."
+        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
    }
```

```diff
    contract L1StandardBridge (0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract SystemConfig (0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.target:
-        "0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","delay":0}
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      descriptions:
-        ["Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8."]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      descriptions:
-        ["Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2."]
    }
```

```diff
    contract AddressManager (0xd4b1EC0DEc3C7F12abD3ec27B7514880ae1C3a37) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","delay":0}
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

Generated with discovered.json: 0x4e1fb70bba8cd4576881e25cff5644f2a66b152f

# Diff at Fri, 30 Aug 2024 07:53:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20475247
- current block number: 20475247

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475247 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x78d46cf743e2cd7c036b680014a771e9a8c2afa2

# Diff at Fri, 23 Aug 2024 09:53:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20475247
- current block number: 20475247

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475247 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2OutputOracle (0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract OptimismPortal (0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1ERC721Bridge (0x50D700e97967F9115e3f999bDB263d69F6704680) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SystemConfig (0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0xf165fc44a83c4d984c902d5760269e0bc33e6245

# Diff at Wed, 21 Aug 2024 10:04:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20475247
- current block number: 20475247

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475247 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730","0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426","0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956","0x50D700e97967F9115e3f999bDB263d69F6704680","0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3","0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA"],"configure":["0xd4b1EC0DEc3C7F12abD3ec27B7514880ae1C3a37"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xd4b1EC0DEc3C7F12abD3ec27B7514880ae1C3a37","via":[]},{"permission":"upgrade","target":"0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730","via":[]},{"permission":"upgrade","target":"0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426","via":[]},{"permission":"upgrade","target":"0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956","via":[]},{"permission":"upgrade","target":"0x50D700e97967F9115e3f999bDB263d69F6704680","via":[]},{"permission":"upgrade","target":"0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3","via":[]},{"permission":"upgrade","target":"0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x50D700e97967F9115e3f999bDB263d69F6704680) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"],"configure":["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F","via":[]},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","via":[]},{"permission":"configure","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","via":[]}]
    }
```

```diff
    contract SystemConfig (0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract AddressManager (0xd4b1EC0DEc3C7F12abD3ec27B7514880ae1C3a37) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","via":[]}]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

Generated with discovered.json: 0x82f1bf4cffe09fef2be93ad95a768e03591b1ee6

# Diff at Fri, 09 Aug 2024 12:00:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20475247
- current block number: 20475247

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475247 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.5:
-        "0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426"
+        "0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA"
      assignedPermissions.upgrade.4:
-        "0x50D700e97967F9115e3f999bDB263d69F6704680"
+        "0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3"
      assignedPermissions.upgrade.3:
-        "0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3"
+        "0x50D700e97967F9115e3f999bDB263d69F6704680"
      assignedPermissions.upgrade.1:
-        "0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730"
+        "0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426"
      assignedPermissions.upgrade.0:
-        "0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA"
+        "0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730"
    }
```

Generated with discovered.json: 0x281bbbc6a492982b6d2a4ce3c804af467de68bcc

# Diff at Fri, 09 Aug 2024 10:10:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20475247
- current block number: 20475247

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475247 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract ProxyAdmin (0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730","0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426","0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956","0x50D700e97967F9115e3f999bDB263d69F6704680","0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3","0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA"]
      assignedPermissions.owner:
-        ["0xd4b1EC0DEc3C7F12abD3ec27B7514880ae1C3a37"]
      assignedPermissions.upgrade:
+        ["0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA","0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730","0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956","0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3","0x50D700e97967F9115e3f999bDB263d69F6704680","0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426"]
      assignedPermissions.configure:
+        ["0xd4b1EC0DEc3C7F12abD3ec27B7514880ae1C3a37"]
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"]
      assignedPermissions.owner:
-        ["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]
      assignedPermissions.upgrade:
+        ["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"]
      assignedPermissions.configure:
+        ["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]
      assignedPermissions.configure:
+        ["0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99","0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8.
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2.
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$multisigThreshold:
-        "10 of 13 (77%)"
      values.getOwners:
-        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.getThreshold:
-        10
      values.$members:
+        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.$threshold:
+        10
      values.multisigThreshold:
+        "10 of 13 (77%)"
    }
```

Generated with discovered.json: 0x870d6c7a754a5bcbffe4b621d30a51aae4a943c0

# Diff at Wed, 07 Aug 2024 07:37:59 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@47685977ba2390a8eafac8e0d4cac7c81dff5758 block: 20211468
- current block number: 20475247

## Description

The ProxyAdmin owner is changed to SuperchainProxyAdminOwner and Conduit Multisig is removed.

## Watched changes

```diff
    contract ProxyAdmin (0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99, inheriting its permissions."]
      assignedPermissions:
-        {"owner":["0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"]}
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      descriptions.1:
+        "It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."
      descriptions.0:
-        "It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."
+        "It can act on behalf of 0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99, inheriting its permissions."
      assignedPermissions.owner.1:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      assignedPermissions.owner.0:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99"
    }
```

Generated with discovered.json: 0x199be30271bcf1d7a24543f3499a53336e5857d9

# Diff at Tue, 30 Jul 2024 11:12:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20211468
- current block number: 20211468

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211468 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0xc077a0f745782d216f312414167ad14d22631217

# Diff at Thu, 18 Jul 2024 10:31:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20211468
- current block number: 20211468

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211468 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: None
      values.livenessInterval:
-        8467200
+        "98d"
      template:
+        "gnosisSafeModules/LivenessModule"
      descriptions:
+        ["used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"]
    }
```

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      roles:
+        ["Guardian"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x0a47A44f1B2bb753474f8c830322554A96C9934D) {
    +++ description: None
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      descriptions:
+        ["Liveness Guard of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - used to remove members inactive for 98d."]
    }
```

```diff
    contract ProxyAdmin (0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract L2OutputOracle (0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426) {
    +++ description: None
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract OptimismPortal (0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956) {
    +++ description: None
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99, inheriting its permissions."]
    }
```

```diff
    contract L1ERC721Bridge (0x50D700e97967F9115e3f999bDB263d69F6704680) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."]
    }
```

```diff
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8) {
    +++ description: None
      template:
+        "gnosisSafeModules/DeputyGuardianModule"
      descriptions:
+        ["allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A (the deputy guardian) to act on behalf of the Gnosis Safe."]
    }
```

```diff
    contract L1StandardBridge (0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3) {
    +++ description: None
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract SystemConfig (0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA) {
    +++ description: None
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      descriptions:
+        ["Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8."]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: None
      template:
+        "opstack/SuperchainConfig"
      descriptions:
+        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      categories:
+        ["Upgrades&Governance"]
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      descriptions:
+        ["Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2."]
    }
```

Generated with discovered.json: 0x8ac7122549441d15e2f7c93a7e6c36129570212d

# Diff at Fri, 28 Jun 2024 07:30:12 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@555efdd96fadc389c2c70beacf820125fbb25a7d block: 20073647
- current block number: 20188697

## Description

Nonce of foundation multisig increased, after executing transaction to change the owner of the SystemConfig contract.

## Watched changes

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.nonce:
-        92
+        93
    }
```

Generated with discovered.json: 0x8e61c63a5c06891e4e1ca96a1aab8b6950378f96

# Diff at Wed, 12 Jun 2024 05:26:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@09246cd19afe46cf207c325923fef8f51d581735 block: 19927710
- current block number: 20073647

## Description

Changes due to Superchain permissions upgrade: 
- Security Council MS threshold raised
- Liveness and DeputyGuardian modules added
- Guardian (proxy)MS added

## Watched changes

```diff
    contract OptimismPortal (0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956) {
    +++ description: None
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.GUARDIAN:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: None
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      upgradeability.modules.0:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      upgradeability.threshold:
-        "4 of 13 (31%)"
+        "10 of 13 (77%)"
      values.getThreshold:
-        4
+        10
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8)
    +++ description: None
```

## Source code changes

```diff
.../metal/ethereum/.flat/DeputyGuardianModule.sol  | 139 +++
 .../ethereum/.flat/GuardianMultisig/GnosisSafe.sol | 952 +++++++++++++++++++++
 .../.flat/GuardianMultisig/GnosisSafeProxy.p.sol   |  34 +
 .../metal/ethereum/.flat/LivenessGuard.sol         | 581 +++++++++++++
 .../metal/ethereum/.flat/LivenessModule.sol        | 257 ++++++
 5 files changed, 1963 insertions(+)
```

Generated with discovered.json: 0x8dec339792c43552cd08684a21063ee4be3d8342

# Diff at Wed, 22 May 2024 20:09:29 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918744
- current block number: 19927710

## Description

ConduitMultisig update.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.5:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.getOwners.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0x945f32bd03147da666809aa29cce279673ba1992

# Diff at Tue, 21 May 2024 14:01:54 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19781431
- current block number: 19918744

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19781431 (main branch discovery), not current.

```diff
    contract MetalMultisig (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      name:
-        "MetalMultisig"
+        "GnosisSafe"
    }
```

```diff
    contract ProxyAdminOwner (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ProxyAdminOwner"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x9bd81dfc1056a71d240cdbab98badebd5ecd7362

# Diff at Wed, 24 Apr 2024 05:49:16 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- current block number: 19723257

## Description

Initial discovery: Normal OP stack rollup with superchain config.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x0a47A44f1B2bb753474f8c830322554A96C9934D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x1aaab4E20d2e4Bb992b5BCA2125e8bd3588c8730)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x37Ff0ae34dadA1A95A4251d10ef7Caa868c7AC99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MetalMultisig (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdminOwner (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x50D700e97967F9115e3f999bDB263d69F6704680)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x7BD909970B0EEdcF078De6Aeff23ce571663b8aA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xd4b1EC0DEc3C7F12abD3ec27B7514880ae1C3a37)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```
