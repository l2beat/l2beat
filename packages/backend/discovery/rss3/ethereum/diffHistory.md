Generated with discovered.json: 0x606ecfcb4ae720b9aa388d092f89a7e59b79e51c

# Diff at Tue, 08 Oct 2024 16:28:48 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 19918622
- current block number: 20920298

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19918622 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1075B29e5F7a911128C77F3989702E150C988904) {
    +++ description: None
      directlyReceivedPermissions.3.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract SuperchainConfig (0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
+        "opstack/SuperchainConfigFake"
      descriptions:
+        ["This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      categories:
+        ["Upgrades&Governance"]
    }
```

```diff
    contract L1StandardBridge (0x4cbab69108Aa72151EDa5A3c164eA86845f18438) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

```diff
    contract OptimismPortal (0x6A12432491bbbE8d3babf75F759766774C778Db4) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract SystemConfig (0x80e73D6BfC73c567032304C3891a06c2d9954d09) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x8AC80fa0993D95C9d6B8Cb494E561E6731038941","via":[{"address":"0x1075B29e5F7a911128C77F3989702E150C988904","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0x8AC80fa0993D95C9d6B8Cb494E561E6731038941"
+        "0xC4878516C198a919566773797e24af20DfdE6272"
      issuedPermissions.0.via.0:
-        {"address":"0x1075B29e5F7a911128C77F3989702E150C988904","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract L1CrossDomainMessenger (0x892CAa506c86C5101f5eC11C6f09589c9dC8A85C) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941) {
    +++ description: None
      receivedPermissions.3.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1ERC721Bridge (0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract L2OutputOracle (0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

Generated with discovered.json: 0x41b63f5f532e94826eab047f8afbd6c401831328

# Diff at Tue, 01 Oct 2024 10:54:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19918622
- current block number: 19918622

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19918622 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x1D89222C28C3ba471be822203998f27Df4727C0b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T01:05:47.000Z",["0xa5a46DAaDAF1b2ae96F6FE85Ae81470126967A0E"]]]
    }
```

```diff
    contract SuperchainConfig (0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T01:05:35.000Z",["0x314774a6Cfc3838E5a5a1DE3723EEa995aAD4e8f"]]]
    }
```

```diff
    contract L1StandardBridge (0x4cbab69108Aa72151EDa5A3c164eA86845f18438) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x6A12432491bbbE8d3babf75F759766774C778Db4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T01:05:59.000Z",["0xc5b17F1DF579D033DB17174B837fe4D2dF05b050"]]]
    }
```

```diff
    contract SystemConfig (0x80e73D6BfC73c567032304C3891a06c2d9954d09) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T01:05:47.000Z",["0x164883d49DaEe18b3D621A24560D9bcD19Ad5407"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x892CAa506c86C5101f5eC11C6f09589c9dC8A85C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T01:05:59.000Z",["0x4795EaC1a2581F2Db6419203D063711C5a90aD50"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T01:05:47.000Z",["0xf3EF9B6eE32366A625d84910c53eB20024043A70"]]]
    }
```

```diff
    contract L2OutputOracle (0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-08T01:05:59.000Z",["0x5Fe6BFbb2C2c78c0baF0bFbb86420903E2E9f8a5"]]]
    }
```

Generated with discovered.json: 0xa7e13a53a879a34654aed3ae57687f6621e32bca

# Diff at Sun, 08 Sep 2024 17:19:36 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 19918622
- current block number: 19918622

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19918622 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1075B29e5F7a911128C77F3989702E150C988904) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x8AC80fa0993D95C9d6B8Cb494E561E6731038941","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03"},{"permission":"upgrade","target":"0x1D89222C28C3ba471be822203998f27Df4727C0b"},{"permission":"upgrade","target":"0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A"},{"permission":"upgrade","target":"0x4cbab69108Aa72151EDa5A3c164eA86845f18438"},{"permission":"upgrade","target":"0x6A12432491bbbE8d3babf75F759766774C778Db4"},{"permission":"upgrade","target":"0x80e73D6BfC73c567032304C3891a06c2d9954d09"},{"permission":"upgrade","target":"0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8"},{"permission":"upgrade","target":"0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03"},{"permission":"upgrade","target":"0x1D89222C28C3ba471be822203998f27Df4727C0b"},{"permission":"upgrade","target":"0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A"},{"permission":"upgrade","target":"0x4cbab69108Aa72151EDa5A3c164eA86845f18438"},{"permission":"upgrade","target":"0x6A12432491bbbE8d3babf75F759766774C778Db4"},{"permission":"upgrade","target":"0x80e73D6BfC73c567032304C3891a06c2d9954d09"},{"permission":"upgrade","target":"0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8"},{"permission":"upgrade","target":"0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10"}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x1D89222C28C3ba471be822203998f27Df4727C0b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1075B29e5F7a911128C77F3989702E150C988904"
+        "0x8AC80fa0993D95C9d6B8Cb494E561E6731038941"
      issuedPermissions.0.via.0:
+        {"address":"0x1075B29e5F7a911128C77F3989702E150C988904","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1075B29e5F7a911128C77F3989702E150C988904"
+        "0x8AC80fa0993D95C9d6B8Cb494E561E6731038941"
      issuedPermissions.0.via.0:
+        {"address":"0x1075B29e5F7a911128C77F3989702E150C988904","delay":0}
    }
```

```diff
    contract L1StandardBridge (0x4cbab69108Aa72151EDa5A3c164eA86845f18438) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1075B29e5F7a911128C77F3989702E150C988904"
+        "0x8AC80fa0993D95C9d6B8Cb494E561E6731038941"
      issuedPermissions.0.via.0:
+        {"address":"0x1075B29e5F7a911128C77F3989702E150C988904","delay":0}
    }
```

```diff
    contract OptimismPortal (0x6A12432491bbbE8d3babf75F759766774C778Db4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1075B29e5F7a911128C77F3989702E150C988904"
+        "0x8AC80fa0993D95C9d6B8Cb494E561E6731038941"
      issuedPermissions.0.via.0:
+        {"address":"0x1075B29e5F7a911128C77F3989702E150C988904","delay":0}
    }
```

```diff
    contract AddressManager (0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1075B29e5F7a911128C77F3989702E150C988904"
+        "0x8AC80fa0993D95C9d6B8Cb494E561E6731038941"
      issuedPermissions.0.via.0:
+        {"address":"0x1075B29e5F7a911128C77F3989702E150C988904","delay":0}
    }
```

```diff
    contract SystemConfig (0x80e73D6BfC73c567032304C3891a06c2d9954d09) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1075B29e5F7a911128C77F3989702E150C988904"
+        "0x8AC80fa0993D95C9d6B8Cb494E561E6731038941"
      issuedPermissions.0.via.0:
+        {"address":"0x1075B29e5F7a911128C77F3989702E150C988904","delay":0}
    }
```

```diff
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x1075B29e5F7a911128C77F3989702E150C988904, inheriting its permissions."]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10","via":[{"address":"0x1075B29e5F7a911128C77F3989702E150C988904"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8","via":[{"address":"0x1075B29e5F7a911128C77F3989702E150C988904"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x80e73D6BfC73c567032304C3891a06c2d9954d09","via":[{"address":"0x1075B29e5F7a911128C77F3989702E150C988904"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x6A12432491bbbE8d3babf75F759766774C778Db4","via":[{"address":"0x1075B29e5F7a911128C77F3989702E150C988904"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x4cbab69108Aa72151EDa5A3c164eA86845f18438","via":[{"address":"0x1075B29e5F7a911128C77F3989702E150C988904"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A","via":[{"address":"0x1075B29e5F7a911128C77F3989702E150C988904"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x1D89222C28C3ba471be822203998f27Df4727C0b","via":[{"address":"0x1075B29e5F7a911128C77F3989702E150C988904"}]}
      receivedPermissions.0.target:
-        "0x1075B29e5F7a911128C77F3989702E150C988904"
+        "0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03"
      receivedPermissions.0.via:
+        [{"address":"0x1075B29e5F7a911128C77F3989702E150C988904"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x1075B29e5F7a911128C77F3989702E150C988904"}]
    }
```

```diff
    contract L1ERC721Bridge (0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1075B29e5F7a911128C77F3989702E150C988904"
+        "0x8AC80fa0993D95C9d6B8Cb494E561E6731038941"
      issuedPermissions.0.via.0:
+        {"address":"0x1075B29e5F7a911128C77F3989702E150C988904","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1075B29e5F7a911128C77F3989702E150C988904"
+        "0x8AC80fa0993D95C9d6B8Cb494E561E6731038941"
      issuedPermissions.0.via.0:
+        {"address":"0x1075B29e5F7a911128C77F3989702E150C988904","delay":0}
    }
```

Generated with discovered.json: 0xbd6a2b8c24451b33c76dff8a55868616679feab0

# Diff at Fri, 30 Aug 2024 07:57:41 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19918622
- current block number: 19918622

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19918622 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1075B29e5F7a911128C77F3989702E150C988904) {
    +++ description: None
      receivedPermissions.7.via:
-        []
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
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941) {
    +++ description: It can act on behalf of 0x1075B29e5F7a911128C77F3989702E150C988904, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x8820e1df46deadbe8dc596af1bed82d9a9531578

# Diff at Fri, 23 Aug 2024 09:54:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19918622
- current block number: 19918622

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19918622 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x1D89222C28C3ba471be822203998f27Df4727C0b) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SuperchainConfig (0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0x4cbab69108Aa72151EDa5A3c164eA86845f18438) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x6A12432491bbbE8d3babf75F759766774C778Db4) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x80e73D6BfC73c567032304C3891a06c2d9954d09) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xa155401972955992bb59a29a1611b9066d037e29

# Diff at Wed, 21 Aug 2024 10:05:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19918622
- current block number: 19918622

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19918622 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1075B29e5F7a911128C77F3989702E150C988904) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1D89222C28C3ba471be822203998f27Df4727C0b","0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A","0x4cbab69108Aa72151EDa5A3c164eA86845f18438","0x6A12432491bbbE8d3babf75F759766774C778Db4","0x80e73D6BfC73c567032304C3891a06c2d9954d09","0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8","0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10"],"configure":["0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x8AC80fa0993D95C9d6B8Cb494E561E6731038941","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03","via":[]},{"permission":"upgrade","target":"0x1D89222C28C3ba471be822203998f27Df4727C0b","via":[]},{"permission":"upgrade","target":"0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A","via":[]},{"permission":"upgrade","target":"0x4cbab69108Aa72151EDa5A3c164eA86845f18438","via":[]},{"permission":"upgrade","target":"0x6A12432491bbbE8d3babf75F759766774C778Db4","via":[]},{"permission":"upgrade","target":"0x80e73D6BfC73c567032304C3891a06c2d9954d09","via":[]},{"permission":"upgrade","target":"0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8","via":[]},{"permission":"upgrade","target":"0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x1D89222C28C3ba471be822203998f27Df4727C0b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1075B29e5F7a911128C77F3989702E150C988904","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1075B29e5F7a911128C77F3989702E150C988904","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x4cbab69108Aa72151EDa5A3c164eA86845f18438) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1075B29e5F7a911128C77F3989702E150C988904","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x6A12432491bbbE8d3babf75F759766774C778Db4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1075B29e5F7a911128C77F3989702E150C988904","via":[]}]
    }
```

```diff
    contract AddressManager (0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x1075B29e5F7a911128C77F3989702E150C988904","via":[]}]
    }
```

```diff
    contract SystemConfig (0x80e73D6BfC73c567032304C3891a06c2d9954d09) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1075B29e5F7a911128C77F3989702E150C988904","via":[]}]
    }
```

```diff
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941) {
    +++ description: It can act on behalf of 0x1075B29e5F7a911128C77F3989702E150C988904, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x1075B29e5F7a911128C77F3989702E150C988904"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x1075B29e5F7a911128C77F3989702E150C988904","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1075B29e5F7a911128C77F3989702E150C988904","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1075B29e5F7a911128C77F3989702E150C988904","via":[]}]
    }
```

Generated with discovered.json: 0x8f77c054bc29debe4770507a3950fbc1937eb613

# Diff at Fri, 09 Aug 2024 12:01:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19918622
- current block number: 19918622

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19918622 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1075B29e5F7a911128C77F3989702E150C988904) {
    +++ description: None
      assignedPermissions.upgrade.6:
-        "0x80e73D6BfC73c567032304C3891a06c2d9954d09"
+        "0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10"
      assignedPermissions.upgrade.5:
-        "0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10"
+        "0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8"
      assignedPermissions.upgrade.4:
-        "0x6A12432491bbbE8d3babf75F759766774C778Db4"
+        "0x80e73D6BfC73c567032304C3891a06c2d9954d09"
      assignedPermissions.upgrade.3:
-        "0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A"
+        "0x6A12432491bbbE8d3babf75F759766774C778Db4"
      assignedPermissions.upgrade.2:
-        "0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8"
+        "0x4cbab69108Aa72151EDa5A3c164eA86845f18438"
      assignedPermissions.upgrade.1:
-        "0x4cbab69108Aa72151EDa5A3c164eA86845f18438"
+        "0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A"
    }
```

Generated with discovered.json: 0x2df3d0243a85d5ee807aaadb8416bb012401fafd

# Diff at Fri, 09 Aug 2024 10:11:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19918622
- current block number: 19918622

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19918622 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1075B29e5F7a911128C77F3989702E150C988904) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1D89222C28C3ba471be822203998f27Df4727C0b","0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A","0x4cbab69108Aa72151EDa5A3c164eA86845f18438","0x6A12432491bbbE8d3babf75F759766774C778Db4","0x80e73D6BfC73c567032304C3891a06c2d9954d09","0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8","0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10"]
      assignedPermissions.owner:
-        ["0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03"]
      assignedPermissions.upgrade:
+        ["0x1D89222C28C3ba471be822203998f27Df4727C0b","0x4cbab69108Aa72151EDa5A3c164eA86845f18438","0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8","0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A","0x6A12432491bbbE8d3babf75F759766774C778Db4","0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10","0x80e73D6BfC73c567032304C3891a06c2d9954d09"]
      assignedPermissions.configure:
+        ["0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03"]
    }
```

```diff
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941) {
    +++ description: It can act on behalf of 0x1075B29e5F7a911128C77F3989702E150C988904, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x1075B29e5F7a911128C77F3989702E150C988904"]
      assignedPermissions.configure:
+        ["0x1075B29e5F7a911128C77F3989702E150C988904"]
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xc06d32F7C20f100C7b8657dE2b24f201A46BC3DD","0xEE52b76e6A9F6eA669F8A99bb63b113819cDCbEF","0x70f8b7f14eA00209A70a926134B86E5eb9f4317f","0xf877475092Dc23AD9d367B27D48645d56564D310","0xF209b7Bbadf8d9518a822aEaa7119B38b17377A7"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xc06d32F7C20f100C7b8657dE2b24f201A46BC3DD","0xEE52b76e6A9F6eA669F8A99bb63b113819cDCbEF","0x70f8b7f14eA00209A70a926134B86E5eb9f4317f","0xf877475092Dc23AD9d367B27D48645d56564D310","0xF209b7Bbadf8d9518a822aEaa7119B38b17377A7"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xee4f6be5b2d5f05f7142e38e8024cc140d32c88f

# Diff at Thu, 18 Jul 2024 10:33:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19918622
- current block number: 19918622

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19918622 (main branch discovery), not current.

```diff
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x1075B29e5F7a911128C77F3989702E150C988904, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x9963e2a9b04d67dd01372b53ad8c847f8a21bd3e

# Diff at Wed, 03 Apr 2024 08:59:57 GMT:

- author: maciekop (<maciej.opala@l2beat.com>)
- comparing to: main@34d9eb99e785ccac44323b84405d78f9783b5cc2 block: 19538724
- current block number: 19574205

## Description

Rediscovery with new field added (upgradeability.threshold)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19538724 (main branch discovery), not current.

```diff
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x44381074df3e7dfeb3cd439c907c54ebb8ccef93

# Diff at Thu, 28 Mar 2024 10:04:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 19531894

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1075B29e5F7a911128C77F3989702E150C988904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x1D89222C28C3ba471be822203998f27Df4727C0b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x3e5FaB39eD4eFB4fc29A5201059AE819f2f0418A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x4cbab69108Aa72151EDa5A3c164eA86845f18438)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x6A12432491bbbE8d3babf75F759766774C778Db4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x75D340E5BF2eAbC39A04AF4229Ce7875B4A73B03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x80e73D6BfC73c567032304C3891a06c2d9954d09)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x892CAa506c86C5101f5eC11C6f09589c9dC8A85C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RSS3Multisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x938D0Bb4B584d4F6f793fCB7808cA2Eea15B69A8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10)
    +++ description: None
```
