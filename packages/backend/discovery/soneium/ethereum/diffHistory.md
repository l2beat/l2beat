Generated with discovered.json: 0x016ba5982ef0aba702c30e84511699e6675d454d

# Diff at Tue, 04 Feb 2025 12:32:41 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21731591
- current block number: 21731591

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21731591 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SoneiumMultisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x7f784522bcae3935cf3c5c9c9779c6560eb9c2ef

# Diff at Mon, 27 Jan 2025 12:04:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 21679918
- current block number: 21715739

## Description

Soneium external bridge gov change.

## Watched changes

```diff
    contract L1OpUSDCBridgeAdapter (0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb) {
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
      values.$admin:
-        "0x448dAe9299366ff611678fdA2f3a386791C95d41"
+        "0xE7c9a9DddAb8a384c38D721DE64E4222Fe76DF75"
      values.owner:
-        "0x448dAe9299366ff611678fdA2f3a386791C95d41"
+        "0xE7c9a9DddAb8a384c38D721DE64E4222Fe76DF75"
    }
```

Generated with discovered.json: 0x8730e527cd5a87ec57ec483c285c96d2fc30707a

# Diff at Wed, 22 Jan 2025 12:20:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 21637001
- current block number: 21679918

## Description

MS member changes.

## Watched changes

```diff
    contract SoneiumMultisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
      values.$members.4:
-        "0x48FF760E582c3740336656349684b4FD4c6ED88F"
+        "0xba1a565d2bF6D27F451a459308f423219478c5cB"
      values.$members.3:
-        "0x127Bae6Fc751dC92111a359500ae91EB437f3dCb"
+        "0xD6db4b8aD9b8BD4665B968fab017ffEAb546F94a"
      values.$members.2:
-        "0x83cC8195856b0463dEd5f052021009b7985FDa2C"
+        "0xb9269f274E7Edc73bf3d923E347d0784e4a5e452"
      values.$members.1:
-        "0xEc33045FA66cF43E9b5b9F332dc124dbc71c0917"
+        "0x420537Ec5e82CDE86f04F3d61F3aD56F7c7dD32B"
      values.$members.0:
-        "0x2b3Aa0Dc0622eFb9426F5A44015aE9151Bd8224C"
+        "0x94e9Ef16A9eF6C37164A7BCA6CFb03b52d23AF7E"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x0bf578323590845037f9bf560f3aed23eb097384

# Diff at Tue, 21 Jan 2025 11:19:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@0da84acc479f34212f2c8133869a3eef33d46ecc block: 21637001
- current block number: 21637001

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637001 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions:
-        [{"permission":"guard","from":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]}]
      issuedPermissions:
+        [{"permission":"configure","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."}]
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","from":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","description":"takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.via.0.condition:
+        "not revoked by the Security Council"
      issuedPermissions.0.to:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      issuedPermissions.0.via.2:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}
      issuedPermissions.0.via.1.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.0.condition:
+        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.via.1.condition:
+        "not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
+        "not revoked by the Security Council"
    }
```

Generated with discovered.json: 0x173647e6bffec7726d89f9bcd1b4fd7cd6f3c888

# Diff at Mon, 20 Jan 2025 11:10:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637001
- current block number: 21637001

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637001 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      directlyReceivedPermissions.0.from:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract SoneiumMultisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      receivedPermissions.0.from:
+        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
    }
```

```diff
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.0.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
    }
```

```diff
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      receivedPermissions.10.from:
+        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      receivedPermissions.9.target:
-        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      receivedPermissions.9.from:
+        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      receivedPermissions.8.target:
-        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      receivedPermissions.8.from:
+        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      receivedPermissions.7.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.7.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.6.target:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      receivedPermissions.6.from:
+        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      receivedPermissions.5.target:
-        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      receivedPermissions.5.from:
+        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      receivedPermissions.4.target:
-        "0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522"
      receivedPermissions.4.from:
+        "0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522"
      receivedPermissions.3.target:
-        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      receivedPermissions.3.from:
+        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      receivedPermissions.2.target:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      receivedPermissions.2.from:
+        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      receivedPermissions.1.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.1.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.target:
-        "0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
      receivedPermissions.0.from:
+        "0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
      directlyReceivedPermissions.1.target:
-        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      directlyReceivedPermissions.1.from:
+        "0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a"
      directlyReceivedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.0.from:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    contract AnchorStateRegistry (0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.1.target:
-        "0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1"
      issuedPermissions.1.to:
+        "0x6776BE80dBAda6A02B5F2095cF13734ac303B8d1"
      issuedPermissions.0.target:
-        "0x509182eC226b3B71D36A3255A80EF0b1A9D43033"
      issuedPermissions.0.to:
+        "0x509182eC226b3B71D36A3255A80EF0b1A9D43033"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      directlyReceivedPermissions.8.from:
+        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      directlyReceivedPermissions.7.target:
-        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      directlyReceivedPermissions.7.from:
+        "0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F"
      directlyReceivedPermissions.6.target:
-        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      directlyReceivedPermissions.6.from:
+        "0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf"
      directlyReceivedPermissions.5.target:
-        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      directlyReceivedPermissions.5.from:
+        "0x88e529A6ccd302c948689Cd5156C83D4614FAE92"
      directlyReceivedPermissions.4.target:
-        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      directlyReceivedPermissions.4.from:
+        "0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3"
      directlyReceivedPermissions.3.target:
-        "0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522"
      directlyReceivedPermissions.3.from:
+        "0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522"
      directlyReceivedPermissions.2.target:
-        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      directlyReceivedPermissions.2.from:
+        "0x5933e323bE8896DfaCd1cD671442F27dAA10a053"
      directlyReceivedPermissions.1.target:
-        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      directlyReceivedPermissions.1.from:
+        "0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0"
      directlyReceivedPermissions.0.target:
-        "0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
      directlyReceivedPermissions.0.from:
+        "0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.3.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.1.target:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.target:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    contract DelayedWETH (0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      directlyReceivedPermissions.0.from:
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
    contract AddressManager (0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions.0.target:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      directlyReceivedPermissions.0.from:
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x8387f14109ac505e99b3e77a20086e5357c48219

# Diff at Thu, 16 Jan 2025 10:14:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 21631401
- current block number: 21631401

## Description

Add decoding of absolute prestate hashes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21631401 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x42D15f045159Ce4adE9EDC7da5704eF36056c936) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
+        "v1.3.1 (govApproved)"
      fieldMeta:
+        {"absolutePrestateDecoded":{"description":"Prestate tag for known prestates."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x0386cde2f2b1bde1189ac9c9b7d66774e6260eca778223def326bfe680c14ab9":"v1.4.1-rc.2 (cannon64)","0x03045fd433fb5391c40751939d7cb5e9dfe83cf156f9395566a311e7fe9d3aa2":"v1.4.1-rc.2","0x03b7eaa4e3cbce90381921a4b48008f4769871d64f93d113fcadca08ecee503b":"v1.4.0 (cannon64)","0x03f89406817db1ed7fd8b31e13300444652cdb0b9c509a674de43483b2f83568":"v1.4.0 (govApproved)","0x0348ce2059f718af75729c2c56860551b46b665956a641b3cb2cd51e50b7b725":"v1.4.0-rc.2 (cannon64)","0x0364e4e72922e7d649338f558f8a14b50ca31922a1484e73ea03987fb1516095":"v1.4.0-rc.2","0x032e5d6119ee983cb87deae3eef16ea6086f2347433c99f1820d60f36a24a6e6":"v1.4.0-rc.1 (cannon64)","0x03925193e3e89f87835bbdf3a813f60b2aa818a36bbe71cd5d8fd7e79f5e8afe":"v1.4.0-rc.1","0x03c50b9fd04bdadc228205f340767bbf2d01a030aec39903120d3559d94bb8cc":"v1.3.1-ink","0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c":"v1.3.1 (govApproved)","0x03e806a2859a875267a563462a06d4d1d1b455a9efee959a46e21e54b6caf69a":"v1.3.1-rc.1","0x030de10d9da911a2b180ecfae2aeaba8758961fc28262ce989458c6f9a547922":"v1.3.0-rc.3","0x0385c3f8ee78491001d92b90b07d0cf387b7b52ab9b83b4d87c994e92cf823ba":"v1.3.0-rc.2","0x0367c4aa897bffbded0b523f277ca892298dc3c691baf37bc2099b86024f9673":"v1.3.0-rc.1","0x03617abec0b255dc7fc7a0513a2c2220140a1dcd7a1c8eca567659bd67e05cea":"v1.2.0 (govApproved)","0x03e69d3de5155f4a80da99dd534561cbddd4f9dd56c9ecc704d6886625711d2b":"v1.1.0","0x0398bdd93e2e9313befdf82beb709da6a4daf35ce1abb42d8a998ec9bc1c572e":"v1.0.1","0x037ef3c1a487960b0e633d3e513df020c43432769f41a634d18a9595cbf53c55":"v1.0.0 (govApproved)","0x034c8cc69f22c35ae386a97136715dd48aaf97fd190942a111bfa680c2f2f421":"v0.3.0","0x031e3b504740d0b1264e8cf72b6dde0d497184cfb3f98e451c6be8b33bd3f808":"v0.2.0","0x038942ec840131a63c49fa514a3f0577ae401fd5584d56ad50cdf5a8b41d4538":"v0.1.0","0x03babef4b4c6d866d56e6356d961839fd9475931d11e0ea507420a87b0cadbdd":"v0.0.1"}}]
    }
```

Generated with discovered.json: 0x47e1ac6530ee74ed0306f6733efac8f0134cbf55

# Diff at Wed, 15 Jan 2025 17:33:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 21631401

## Description

First discovery of Soneium.

## Initial discovery

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x42D15f045159Ce4adE9EDC7da5704eF36056c936)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SoneiumMultisig (0x509182eC226b3B71D36A3255A80EF0b1A9D43033)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x512A3d2c7a43BD9261d2B8E8C9c70D4bd4D503C0)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x5933e323bE8896DfaCd1cD671442F27dAA10a053)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x61f89A381E0BE13BD8Ab356cf4B7301BC97d7522)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x7A8Ed66B319911A0F3E7288BDdAB30d9c0C875c3)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0x88e529A6ccd302c948689Cd5156C83D4614FAE92)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x89889B569c3a505f3640ee1Bd0ac1D557f436D2a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x9AEA1FD851b63d57Ba4Fc556B0e0c170126C9EAf)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract AddressManager (0xB24bFEeCE1B3b7A44559F4Cbc21BeD312b130b70)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc1047e30EFC9E172cFe7aa0219895B6a43fC415F)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OpUSDCBridgeAdapter (0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb)
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xeb9bf100225c214Efc3E7C651ebbaDcF85177607)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```
