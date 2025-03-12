Generated with discovered.json: 0xe55f0b76cbb78522792c7737cc3448105e1ebfd9

# Diff at Thu, 06 Mar 2025 14:23:44 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 311763335
- current block number: 311763335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 311763335 (main branch discovery), not current.

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x588536590ab8f4b8686048a4a37fab4be1acea17

# Diff at Thu, 06 Mar 2025 09:39:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 311763335
- current block number: 311763335

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 311763335 (main branch discovery), not current.

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f","0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xD17550876106645988051ffDd31dFc3cDaA29F9c"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xd97a06af3c8440752b7b963c7ade7b37850ea172

# Diff at Tue, 04 Mar 2025 10:40:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 311763335
- current block number: 311763335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 311763335 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        159001296
    }
```

```diff
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        159001296
    }
```

```diff
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802957
    }
```

```diff
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4) {
    +++ description: None
      sinceBlock:
+        159001296
    }
```

```diff
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802857
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        150599283
    }
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        159001296
    }
```

```diff
    contract RollupEventInbox (0x8987777757a91Ed09912D7A5B8430bbAC2cf153C) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        159001296
    }
```

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        159001296
    }
```

```diff
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        159001296
    }
```

```diff
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802990
    }
```

```diff
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802923
    }
```

```diff
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        159001296
    }
```

```diff
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802890
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        159001296
    }
```

Generated with discovered.json: 0x71a846e87d73fd70a834ebac0584c601b05a41bd

# Diff at Mon, 03 Mar 2025 09:15:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f23dcb100957b0b121d62148a4d586788383af80 block: 287772645
- current block number: 311763335

## Description

Minor upgrade of SequencerInbox and Inbox contracts to new versions with minimal diff to known versions.

## Watched changes

```diff
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"
+        "0x84cd273689e720a0b7c657b57d9fb127684f3abb87fc4b337a2f0decd9464120"
      values.$implementation:
-        "0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"
+        "0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"
      values.$pastUpgrades.1:
+        ["2025-03-03T05:22:43.000Z","0xbae64b5a7223e9cf01a270c58a776e2fed92644fe0bb85855be7a805d40008b2",["0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"
+        "0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"
      values.$pastUpgrades.2:
+        ["2025-03-03T05:22:43.000Z","0xbae64b5a7223e9cf01a270c58a776e2fed92644fe0bb85855be7a805d40008b2",["0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"]]
      values.$upgradeCount:
-        2
+        3
    }
```

## Source code changes

```diff
.../{.flat@287772645 => .flat}/Inbox/Inbox.sol     | 52 +++++++++++++++++-----
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++---
 2 files changed, 59 insertions(+), 17 deletions(-)
```

Generated with discovered.json: 0xefe3f9bd28bef2209986d82e75019d6fe9589d2e

# Diff at Fri, 21 Feb 2025 14:12:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 287772645
- current block number: 287772645

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287772645 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x38920c3172a22779e3add3c3466e04b32d50659f

# Diff at Tue, 04 Feb 2025 12:33:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 287772645
- current block number: 287772645

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287772645 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x7d78ced168233df643cecfe0af09dc59b87871d7

# Diff at Mon, 20 Jan 2025 11:10:32 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 287772645
- current block number: 287772645

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287772645 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      directlyReceivedPermissions.2.target:
-        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      directlyReceivedPermissions.2.from:
+        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      directlyReceivedPermissions.1.target:
-        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      directlyReceivedPermissions.1.from:
+        "0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1"
      directlyReceivedPermissions.0.target:
-        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
      directlyReceivedPermissions.0.from:
+        "0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4"
    }
```

```diff
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
    }
```

```diff
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      directlyReceivedPermissions.6.from:
+        "0xfb27e42E964F3364630F76D62EB295ae792BD4FA"
      directlyReceivedPermissions.5.target:
-        "0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
      directlyReceivedPermissions.5.from:
+        "0xE8c7770db364e57b2A4f5344d51b7f490aE9163A"
      directlyReceivedPermissions.4.target:
-        "0xD17550876106645988051ffDd31dFc3cDaA29F9c"
      directlyReceivedPermissions.4.from:
+        "0xD17550876106645988051ffDd31dFc3cDaA29F9c"
      directlyReceivedPermissions.3.target:
-        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      directlyReceivedPermissions.3.from:
+        "0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1"
      directlyReceivedPermissions.2.target:
-        "0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
      directlyReceivedPermissions.2.from:
+        "0x8987777757a91Ed09912D7A5B8430bbAC2cf153C"
      directlyReceivedPermissions.1.target:
-        "0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
      directlyReceivedPermissions.1.from:
+        "0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f"
      directlyReceivedPermissions.0.target:
-        "0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
      directlyReceivedPermissions.0.from:
+        "0x10083F68A4aEC72c567661616bd6036D3a6d1B36"
    }
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xa213e1A202C49C4AC17C43Fc57aA469ebd897F40"
      issuedPermissions.2.to:
+        "0xa213e1A202C49C4AC17C43Fc57aA469ebd897F40"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupEventInbox (0x8987777757a91Ed09912D7A5B8430bbAC2cf153C) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
    }
```

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
    }
```

```diff
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
    }
```

```diff
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xCa9c24bf165D375A62E62b9fb8F138E19A957Aa9"
      issuedPermissions.0.target:
-        "0xa91279538ADfcD8E47ec74e50Cd02d9498cD039a"
      issuedPermissions.0.to:
+        "0xa91279538ADfcD8E47ec74e50Cd02d9498cD039a"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

Generated with discovered.json: 0x9e6a649da14b6bc374a767216c7649533830d309

# Diff at Wed, 08 Jan 2025 10:44:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287772645
- current block number: 287772645

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287772645 (main branch discovery), not current.

```diff
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x27bd9a7f1bc751713e3f219e572f72c52f375dbb

# Diff at Mon, 23 Dec 2024 12:51:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 281500429
- current block number: 287772645

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 281500429 (main branch discovery), not current.

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x9a66bc07a25b43b4c12b94cbc3b159d078b9d47e

# Diff at Thu, 05 Dec 2024 12:00:30 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 281500429
- current block number: 281500429

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 281500429 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x44f4c1b24e8af572b96658927b1f6c9452d50a10

# Diff at Thu, 05 Dec 2024 05:54:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 280604955
- current block number: 281500429

## Description

ArbOS v32 upgrade to known contracts.

## Watched changes

```diff
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      values.$implementation.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
      values.$implementation.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
      values.$pastUpgrades.1:
+        ["2024-12-05T04:29:03.000Z","0xdaae549a35b2064e654124fc32994920b8bdd00e742f59008a9525b89c73d43d",["0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446","0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
      values.$pastUpgrades.2:
+        ["2024-12-05T04:29:03.000Z","0xdaae549a35b2064e654124fc32994920b8bdd00e742f59008a9525b89c73d43d",["0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"]]
      values.$pastUpgrades.1:
+        ["2024-12-05T02:15:22.000Z","0x8a0aa7e1ead9754bdbb27cba33355e9af40b996a929c359b5d9eefc4ff193649",["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]]
      values.$upgradeCount:
-        1
+        3
      values.osp:
-        "0x99a2A31300816C1FA3f40818AC9280fe7271F878"
+        "0xD89d54007079071cBA859127318b9F34eeB78049"
    }
```

```diff
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"
+        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
      values.$implementation:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"
      values.$pastUpgrades.1:
+        ["2024-12-05T02:15:22.000Z","0x8a0aa7e1ead9754bdbb27cba33355e9af40b996a929c359b5d9eefc4ff193649",["0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"]]
      values.$upgradeCount:
-        1
+        2
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        false
      values.reader4844:
+        "0x0000000000000000000000000000000000000000"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++---
 .../OneStepProofEntry.sol                          | 485 ++++++++--
 .../{.flat@280604955 => .flat}/OneStepProver0.sol  | 765 +++++++++++-----
 .../OneStepProverHostIo.sol                        | 999 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 +++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 +++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++---
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++----
 9 files changed, 3374 insertions(+), 1106 deletions(-)
```

Generated with discovered.json: 0x3045a66e02138f41fe484915d98e2223fb801650

# Diff at Mon, 02 Dec 2024 15:21:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 280604955

## Description

Initial discovery of a standard orbit stack L3 with EOA admin.

## Initial discovery

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x10083F68A4aEC72c567661616bd6036D3a6d1B36)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x18BB8310E3a3DF4EFcCb6B3E9AeCB8bE6d4af07f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x37119EAcFBc1c83DDAf80F6705b6B19630C101C4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x73CA76d9B04661604fF950fB8DBc9f18F1B853f1)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x8987777757a91Ed09912D7A5B8430bbAC2cf153C)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0xB0EC3C1368AF7d9C2CAE6B7f8E022Cc14d59D2b1)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract Outbox (0xD17550876106645988051ffDd31dFc3cDaA29F9c)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xE8c7770db364e57b2A4f5344d51b7f490aE9163A)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xfb27e42E964F3364630F76D62EB295ae792BD4FA)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```
