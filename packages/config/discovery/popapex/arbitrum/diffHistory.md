Generated with discovered.json: 0xe39fb0771d67556f715e383d19aae746487226c5

# Diff at Thu, 06 Mar 2025 14:23:58 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 298723571
- current block number: 298723571

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298723571 (main branch discovery), not current.

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x53190aefc4a92c1a716814852a01adc5b72907fd

# Diff at Thu, 06 Mar 2025 09:39:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 298723571
- current block number: 298723571

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298723571 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","0x7b18A3073774e00C072DeBd390ed6fE4251493A7"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x2d5b2c841db3102afda6034617dad7903bee6be9

# Diff at Tue, 04 Mar 2025 10:40:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 298723571
- current block number: 298723571

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298723571 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        183097524
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        183097524
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
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        183097524
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
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        183097524
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
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      sinceBlock:
+        155965667
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        183097524
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        183097524
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        183097524
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        183097524
    }
```

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
    +++ description: None
      sinceBlock:
+        183097524
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
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802890
    }
```

Generated with discovered.json: 0x89976ef1dda01e5e6006caf7418fbc5d469aa125

# Diff at Fri, 21 Feb 2025 14:12:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 298723571
- current block number: 298723571

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298723571 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x8c8a113d16c5a895ed3b9d3a27ca19bb944bccc2

# Diff at Tue, 04 Feb 2025 12:33:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 298723571
- current block number: 298723571

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298723571 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xba74a73ea9b49cdfbd1178f815c113e2852efae9

# Diff at Fri, 24 Jan 2025 08:31:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fff69b1db37918a5360f1e3b59d2f37be25d166f block: 296027251
- current block number: 298723571

## Description

Upgrade to ArbOS v32, all known contracts, no fastConfirmer.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
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
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      values.$implementation.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
      values.$implementation.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
      values.$pastUpgrades.1:
+        ["2025-01-23T20:27:56.000Z","0x56b66d94dbb3f279ed32b857ad068fd5a3091613410bcbefce338883af855e17",["0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446","0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v10.2 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
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
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"
+        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
      values.$implementation:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"
      values.$pastUpgrades.1:
+        ["2025-01-23T20:27:56.000Z","0x56b66d94dbb3f279ed32b857ad068fd5a3091613410bcbefce338883af855e17",["0x18ed2d5bF7c5943bFd20a2995b9879E30c9E8dDa"]]
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
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
      values.$pastUpgrades.2:
+        ["2025-01-23T20:27:56.000Z","0x56b66d94dbb3f279ed32b857ad068fd5a3091613410bcbefce338883af855e17",["0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"]]
      values.$pastUpgrades.1:
+        ["2025-01-23T20:27:56.000Z","0x56b66d94dbb3f279ed32b857ad068fd5a3091613410bcbefce338883af855e17",["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]]
      values.$upgradeCount:
-        1
+        3
      values.osp:
-        "0x99a2A31300816C1FA3f40818AC9280fe7271F878"
+        "0xD89d54007079071cBA859127318b9F34eeB78049"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
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
 .../{.flat@296027251 => .flat}/OneStepProver0.sol  | 765 +++++++++++-----
 .../OneStepProverHostIo.sol                        | 999 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 +++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 +++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++---
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++----
 9 files changed, 3374 insertions(+), 1106 deletions(-)
```

Generated with discovered.json: 0x00c05ebce7e63efb7dceb06ed1a8e431c6043509

# Diff at Mon, 20 Jan 2025 11:10:33 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 296027251
- current block number: 296027251

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 296027251 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      directlyReceivedPermissions.2.target:
-        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
      directlyReceivedPermissions.2.from:
+        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
      directlyReceivedPermissions.1.target:
-        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
      directlyReceivedPermissions.1.from:
+        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
      directlyReceivedPermissions.0.target:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
      directlyReceivedPermissions.0.from:
+        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xD09d81aaA88E0e0EfCF91B0C96779E6B164A1A00"
      issuedPermissions.2.to:
+        "0xD09d81aaA88E0e0EfCF91B0C96779E6B164A1A00"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1"
      receivedPermissions.8.from:
+        "0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1"
      receivedPermissions.7.target:
-        "0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"
      receivedPermissions.7.from:
+        "0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"
      receivedPermissions.6.target:
-        "0xa58F38102579dAE7C584850780dDA55744f67DF1"
      receivedPermissions.6.from:
+        "0xa58F38102579dAE7C584850780dDA55744f67DF1"
      receivedPermissions.5.target:
-        "0x7b18A3073774e00C072DeBd390ed6fE4251493A7"
      receivedPermissions.5.from:
+        "0x7b18A3073774e00C072DeBd390ed6fE4251493A7"
      receivedPermissions.4.target:
-        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
      receivedPermissions.4.from:
+        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
      receivedPermissions.3.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      receivedPermissions.3.from:
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      receivedPermissions.2.target:
-        "0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"
      receivedPermissions.2.from:
+        "0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"
      receivedPermissions.1.target:
-        "0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"
      receivedPermissions.1.from:
+        "0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"
      receivedPermissions.0.target:
-        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
      receivedPermissions.0.from:
+        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
      directlyReceivedPermissions.0.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      directlyReceivedPermissions.0.from:
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.target:
-        "0x139aC582825DD6A9b9D6A6a64f1bE149C84e0d03"
      issuedPermissions.0.to:
+        "0x139aC582825DD6A9b9D6A6a64f1bE149C84e0d03"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1"
      directlyReceivedPermissions.6.from:
+        "0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1"
      directlyReceivedPermissions.5.target:
-        "0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"
      directlyReceivedPermissions.5.from:
+        "0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"
      directlyReceivedPermissions.4.target:
-        "0xa58F38102579dAE7C584850780dDA55744f67DF1"
      directlyReceivedPermissions.4.from:
+        "0xa58F38102579dAE7C584850780dDA55744f67DF1"
      directlyReceivedPermissions.3.target:
-        "0x7b18A3073774e00C072DeBd390ed6fE4251493A7"
      directlyReceivedPermissions.3.from:
+        "0x7b18A3073774e00C072DeBd390ed6fE4251493A7"
      directlyReceivedPermissions.2.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      directlyReceivedPermissions.2.from:
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      directlyReceivedPermissions.1.target:
-        "0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"
      directlyReceivedPermissions.1.from:
+        "0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"
      directlyReceivedPermissions.0.target:
-        "0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"
      directlyReceivedPermissions.0.from:
+        "0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"
    }
```

Generated with discovered.json: 0xdced76a296c44f21842125f1b5778cef3d475836

# Diff at Thu, 16 Jan 2025 12:44:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 287772924
- current block number: 296027251

## Description

ConduitMultisig2 signer change.

## Watched changes

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.8:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.7:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.6:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.5:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.3:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.2:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.1:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 8 (25%)"
+        "3 of 9 (33%)"
    }
```

Generated with discovered.json: 0x6d1aaaadfce800cf0037e68a2a5bdbcd2eeda096

# Diff at Wed, 08 Jan 2025 10:45:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287772924
- current block number: 287772924

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287772924 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x0f7beb172ab2406543612f097a2858bec4ebcca7

# Diff at Mon, 23 Dec 2024 12:53:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 279491368
- current block number: 287772924

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279491368 (main branch discovery), not current.

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x96e512b6439b57d26e1336d75f7c1c562984eb93

# Diff at Thu, 05 Dec 2024 12:01:32 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 279491368
- current block number: 279491368

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279491368 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xace9fe760d137bcf4a790cfad18dcd1acfe8f8fd

# Diff at Fri, 29 Nov 2024 11:28:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 279491368
- current block number: 279491368

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279491368 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x7e5ece2b8157a9feff5572dff35a7ad47cd51bfa

# Diff at Fri, 15 Nov 2024 08:18:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 269948275
- current block number: 269948275

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269948275 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","delay":0}]}
      issuedPermissions.2.permission:
-        "propose"
+        "validate"
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0xD09d81aaA88E0e0EfCF91B0C96779E6B164A1A00"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.0:
+        {"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

Generated with discovered.json: 0xa90a42c80da5f13f96007851559da7dda67cc9ab

# Diff at Mon, 04 Nov 2024 08:08:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 269948275
- current block number: 269948275

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269948275 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x65AD139061B3f6DDb16170a07b925337ddf42407"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "0xD09d81aaA88E0e0EfCF91B0C96779E6B164A1A00"
      issuedPermissions.2.via.0:
-        {"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xD09d81aaA88E0e0EfCF91B0C96779E6B164A1A00"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.0:
+        {"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"},{"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}]}
      receivedPermissions.7.target:
-        "0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1"
+        "0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"
      receivedPermissions.6.target:
-        "0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"
+        "0xa58F38102579dAE7C584850780dDA55744f67DF1"
      receivedPermissions.5.target:
-        "0xa58F38102579dAE7C584850780dDA55744f67DF1"
+        "0x7b18A3073774e00C072DeBd390ed6fE4251493A7"
      receivedPermissions.4.target:
-        "0x7b18A3073774e00C072DeBd390ed6fE4251493A7"
+        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
      receivedPermissions.4.via.1:
-        {"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}
      receivedPermissions.4.via.0.address:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      receivedPermissions.3.target:
-        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      receivedPermissions.3.via.1:
+        {"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}
      receivedPermissions.3.via.0.address:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
      receivedPermissions.2.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"
      receivedPermissions.1.target:
-        "0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"
+        "0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"
+        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
      receivedPermissions.0.via.1:
-        {"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}
      receivedPermissions.0.via.0.address:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x94612007fb78aadd0f27b4b86a33d4d2757f5a52

# Diff at Fri, 01 Nov 2024 14:59:16 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 269235285
- current block number: 269948275

## Description

Discovery refresh to apply template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269235285 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

Generated with discovered.json: 0xb81b85611a1ab787ea3500bc1eb6779e3639a650

# Diff at Wed, 30 Oct 2024 13:14:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 267471118
- current block number: 269235285

## Description

Conduit MS2: Signer added.

## Watched changes

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.7:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.3:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.2:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.1:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.0:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "2 of 7 (29%)"
+        "2 of 8 (25%)"
    }
```

Generated with discovered.json: 0x125bda7be00a464a23f17fd1a3b3ca87c795fccb

# Diff at Tue, 29 Oct 2024 13:22:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 267471118
- current block number: 267471118

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471118 (main branch discovery), not current.

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0x371c082c1d6622b701a09b1cb6366bfcc36dfd36

# Diff at Tue, 29 Oct 2024 08:52:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 267471118
- current block number: 267471118

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471118 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
    }
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]},{"permission":"upgrade","target":"0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]},{"permission":"upgrade","target":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]},{"permission":"upgrade","target":"0x65AD139061B3f6DDb16170a07b925337ddf42407"},{"permission":"upgrade","target":"0x7b18A3073774e00C072DeBd390ed6fE4251493A7","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]},{"permission":"upgrade","target":"0xa58F38102579dAE7C584850780dDA55744f67DF1","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]},{"permission":"upgrade","target":"0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]},{"permission":"upgrade","target":"0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x65AD139061B3f6DDb16170a07b925337ddf42407"}
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.2.via.0:
+        {"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","delay":0}
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"},{"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}]},{"permission":"upgrade","target":"0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"},{"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}]},{"permission":"upgrade","target":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"},{"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}]},{"permission":"upgrade","target":"0x65AD139061B3f6DDb16170a07b925337ddf42407","via":[{"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}]},{"permission":"upgrade","target":"0x7b18A3073774e00C072DeBd390ed6fE4251493A7","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"},{"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}]},{"permission":"upgrade","target":"0xa58F38102579dAE7C584850780dDA55744f67DF1","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"},{"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}]},{"permission":"upgrade","target":"0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"},{"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}]},{"permission":"upgrade","target":"0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"},{"address":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"}]
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.1:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
    }
```

Generated with discovered.json: 0x02a5135744b52fd7f535f726fbb70964dc16bc08

# Diff at Mon, 28 Oct 2024 14:08:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 267471118
- current block number: 267471118

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471118 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"]
    }
```

Generated with discovered.json: 0x02849cba0ed1456fa693ec1b45e5d5cae1025915

# Diff at Fri, 25 Oct 2024 10:03:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 264379051
- current block number: 267471118

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379051 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      issuedPermissions.0.via.0:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      issuedPermissions.0.via.0:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      issuedPermissions.0.via.0:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xa58F38102579dAE7C584850780dDA55744f67DF1","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x7b18A3073774e00C072DeBd390ed6fE4251493A7","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x65AD139061B3f6DDb16170a07b925337ddf42407"}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2","via":[{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]}
      receivedPermissions.0.target:
-        "0x65AD139061B3f6DDb16170a07b925337ddf42407"
+        "0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"
      receivedPermissions.0.via:
+        [{"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d"}]
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      issuedPermissions.0.via.0:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      issuedPermissions.1.via.0:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      issuedPermissions.0.via.0:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      issuedPermissions.0.via.0:
+        {"address":"0xCC6f49cff395c4d160C61112522700dcB007c41d","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"},{"permission":"upgrade","target":"0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"},{"permission":"upgrade","target":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"},{"permission":"upgrade","target":"0x7b18A3073774e00C072DeBd390ed6fE4251493A7"},{"permission":"upgrade","target":"0xa58F38102579dAE7C584850780dDA55744f67DF1"},{"permission":"upgrade","target":"0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"},{"permission":"upgrade","target":"0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"},{"permission":"upgrade","target":"0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"},{"permission":"upgrade","target":"0x3d0b021E1d2A8747411E3724d5165716B35448f3"},{"permission":"upgrade","target":"0x7b18A3073774e00C072DeBd390ed6fE4251493A7"},{"permission":"upgrade","target":"0xa58F38102579dAE7C584850780dDA55744f67DF1"},{"permission":"upgrade","target":"0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"},{"permission":"upgrade","target":"0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1"}]
    }
```

Generated with discovered.json: 0xed385941411c07bcb9dfd7de4def9f868c0a82da

# Diff at Wed, 23 Oct 2024 14:36:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 264379051
- current block number: 264379051

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379051 (main branch discovery), not current.

```diff
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0xD09d81aaA88E0e0EfCF91B0C96779E6B164A1A00"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v10.2 wasmModuleRoot"
+        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v10.2 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
-   Status: DELETED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

Generated with discovered.json: 0xffc6c02e08ac24cb8a2b82934b4cc4710fb78eae

# Diff at Mon, 21 Oct 2024 12:51:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 264379051
- current block number: 264379051

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379051 (main branch discovery), not current.

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0x3e537c34d12e799f6de64825c273c49e33b9904a

# Diff at Mon, 21 Oct 2024 11:13:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 264379051
- current block number: 264379051

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379051 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]
      values.$pastUpgrades.0.1:
-        ["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]
+        "0x2b3afe91774ac66b00b40909ee92830313aea5687731aa8ba10f0dfc47af7046"
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0x2b3afe91774ac66b00b40909ee92830313aea5687731aa8ba10f0dfc47af7046"
    }
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x2b3afe91774ac66b00b40909ee92830313aea5687731aa8ba10f0dfc47af7046"
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
+        "0x2b3afe91774ac66b00b40909ee92830313aea5687731aa8ba10f0dfc47af7046"
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]
      values.$pastUpgrades.0.1:
-        ["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]
+        "0x2b3afe91774ac66b00b40909ee92830313aea5687731aa8ba10f0dfc47af7046"
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0x2b3afe91774ac66b00b40909ee92830313aea5687731aa8ba10f0dfc47af7046"
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x09824fe72BFF474d16D9c2774432E381BBD60662"]
      values.$pastUpgrades.0.1:
-        ["0x09824fe72BFF474d16D9c2774432E381BBD60662"]
+        "0x2b3afe91774ac66b00b40909ee92830313aea5687731aa8ba10f0dfc47af7046"
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]
      values.$pastUpgrades.0.1:
-        ["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]
+        "0x2b3afe91774ac66b00b40909ee92830313aea5687731aa8ba10f0dfc47af7046"
    }
```

Generated with discovered.json: 0xfd2e22f7396e26f246d186e1d6fff1d980869626

# Diff at Wed, 16 Oct 2024 11:44:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 264379051
- current block number: 264379051

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379051 (main branch discovery), not current.

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0xD09d81aaA88E0e0EfCF91B0C96779E6B164A1A00","via":[]}
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0xCC6f49cff395c4d160C61112522700dcB007c41d"
+        "0x139aC582825DD6A9b9D6A6a64f1bE149C84e0d03"
    }
```

Generated with discovered.json: 0xefa474e7b8d1e018d9d6af654ee73a6fad4ffb60

# Diff at Wed, 16 Oct 2024 10:18:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b6ff61526cf3d704839d0155008ae72cc9070de8 block: 257933943
- current block number: 264379051

## Description

Rename shared Conduit MS.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257933943 (main branch discovery), not current.

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      name:
-        "ProofOfPlayMultisig"
+        "ConduitMultisig2"
    }
```

Generated with discovered.json: 0x37c7142290adc7a48301d3acfb724e6436db0b61

# Diff at Mon, 14 Oct 2024 10:58:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 257933943
- current block number: 257933943

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257933943 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xb920455f1e366c7a89719abdd8d8174e4e7d353f2d4b7dea11b0571bf9526eae"]
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x28eec040eca7563195b19e22e11429d0f977820bfb60ac52e567ffde3c92cf77"]
    }
```

```diff
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract ProofOfPlayMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcd37abd5bdcc8c37cbf37dcfa4889d5b238388344d913b3a48914f659e0d627b"]
    }
```

```diff
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: None
      sourceHashes:
+        ["0x0a8f8db8198082757cc8145891c633c20ed4313dab05beab40618258e534a1e8"]
    }
```

```diff
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"]
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"]
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"]
    }
```

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

Generated with discovered.json: 0xe8312e5cc211b8e0d24dba5fd8759431cbd3c25d

# Diff at Tue, 01 Oct 2024 11:12:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 257933943
- current block number: 257933943

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257933943 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-21T19:17:28.000Z",["0xB23214f241bdEb275f7dCBfbb1EA79349101d4B0"]]]
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-21T19:17:28.000Z",["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]]]
    }
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-21T19:17:28.000Z",["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-02-21T19:17:28.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-21T19:17:28.000Z",["0xF40C24bA346aA459ED28e196D4A46Cf17174bD6C"]]]
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-02-21T19:17:28.000Z",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]]]
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-21T19:17:28.000Z",["0x09824fe72BFF474d16D9c2774432E381BBD60662"]]]
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-21T19:17:28.000Z",["0x8f6406781cC955398C45a48DcEfeEBDb2c8e2CaA"]]]
    }
```

Generated with discovered.json: 0x39da3902e7f06bcfa9503292aeee6a04f4ec03c0

# Diff at Fri, 27 Sep 2024 15:31:42 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 247928599
- current block number: 257933943

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 247928599 (main branch discovery), not current.

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xbcfaab9a138fe87074b8ac2be28866fc3b31b12d

# Diff at Sun, 01 Sep 2024 08:47:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 247928599
- current block number: 247928599

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 247928599 (main branch discovery), not current.

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "ArbOS v10.2 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xac4b6088d34dc34524b09b78f8191d068d9146a9

# Diff at Thu, 29 Aug 2024 11:59:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32afcfdfd1c9c51d8abb3a0fa5eb61a730d56efd block: 245518206
- current block number: 247928599

## Description

Renamed MS to match the other ProofofPlay chain.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245518206 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProofOfPlayMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      name:
-        "RollupOwnerMultisig"
+        "ProofOfPlayMultisig"
    }
```

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
    +++ description: None
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

Generated with discovered.json: 0xd054a9d3c596c9edfe30f897e6e43e7946db9136

# Diff at Fri, 23 Aug 2024 09:57:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 245518206
- current block number: 245518206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245518206 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x5438f384651127233b0db8a2cbbe28df1822844e

# Diff at Thu, 22 Aug 2024 11:53:21 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 227940683
- current block number: 245518206

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 227940683 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBhPN6Tq6nXoJS041bPwKYcDeU1Y84s1URBM4MJHKup49TzNB/23scWwhETSvpAl1RnMwh0S/Z+LZ8UGFWlLYmquyJi5weYTsMF6rChTnuZnqY4I1zQZPemy5hK0sIJDlQaqb/llv/8ujT5q3p4DhBLXZ3eIUMcXs4j7F+QMNZyO87mbTnrulLiPfZbAno1SKg8k2Q76fbNPQs76GK4aseCPeA5hPguvjijDIqDVK5Ffz/PhQ6nap8K6UlApBm+CMBIOmAP9IdMyAVs+wirhgMvR88+JVhoMW9kU3F90bWks78tHYqASrw/lXBFI8TgiGhlvvsmUJAC3dyzjccjMyO0M05JjmM1i8bkAdYuCWRF0KV63rABVXUAFGtKAzrLPpw=="]
    }
```

Generated with discovered.json: 0xa8209a96e3752d62cde36dc6ed2aa5c3e5245dc2

# Diff at Wed, 21 Aug 2024 10:07:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 227940683
- current block number: 227940683

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 227940683 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x65AD139061B3f6DDb16170a07b925337ddf42407"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x65AD139061B3f6DDb16170a07b925337ddf42407","via":[]}]
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6","0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2","0x3d0b021E1d2A8747411E3724d5165716B35448f3","0x7b18A3073774e00C072DeBd390ed6fE4251493A7","0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","0xa58F38102579dAE7C584850780dDA55744f67DF1","0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6","via":[]},{"permission":"upgrade","target":"0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2","via":[]},{"permission":"upgrade","target":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","via":[]},{"permission":"upgrade","target":"0x7b18A3073774e00C072DeBd390ed6fE4251493A7","via":[]},{"permission":"upgrade","target":"0xa58F38102579dAE7C584850780dDA55744f67DF1","via":[]},{"permission":"upgrade","target":"0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea","via":[]},{"permission":"upgrade","target":"0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","via":[]}]
    }
```

Generated with discovered.json: 0x4fabc42e972dfa99c7913dccc810f9b4efe3c921

# Diff at Fri, 09 Aug 2024 12:03:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 227940683
- current block number: 227940683

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 227940683 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
    +++ description: None
      assignedPermissions.upgrade.5:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0xa58F38102579dAE7C584850780dDA55744f67DF1"
      assignedPermissions.upgrade.4:
-        "0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"
+        "0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1"
      assignedPermissions.upgrade.2:
-        "0xa58F38102579dAE7C584850780dDA55744f67DF1"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      assignedPermissions.upgrade.1:
-        "0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"
+        "0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"
      assignedPermissions.upgrade.0:
-        "0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1"
+        "0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"
    }
```

Generated with discovered.json: 0x7a55753f31915e09aae3c80098862f1672b455c3

# Diff at Fri, 09 Aug 2024 10:13:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 227940683
- current block number: 227940683

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 227940683 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x65AD139061B3f6DDb16170a07b925337ddf42407"]
      assignedPermissions.upgrade:
+        ["0x65AD139061B3f6DDb16170a07b925337ddf42407"]
    }
```

```diff
    contract RollupOwnerMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 7 (29%)"
      values.getOwners:
-        ["0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 7 (29%)"
    }
```

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6","0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2","0x3d0b021E1d2A8747411E3724d5165716B35448f3","0x7b18A3073774e00C072DeBd390ed6fE4251493A7","0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","0xa58F38102579dAE7C584850780dDA55744f67DF1","0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"]
      assignedPermissions.upgrade:
+        ["0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6","0xa58F38102579dAE7C584850780dDA55744f67DF1","0x7b18A3073774e00C072DeBd390ed6fE4251493A7","0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2","0x3d0b021E1d2A8747411E3724d5165716B35448f3","0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"]
    }
```

Generated with discovered.json: 0x4a76c38705724982b53501f82ac8c5e1eed883d5

# Diff at Tue, 30 Jul 2024 11:17:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 227940683
- current block number: 227940683

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 227940683 (main branch discovery), not current.

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0x7f495d60ba2b5843bf91df294dd17fdcc76a0c62

# Diff at Tue, 02 Jul 2024 09:38:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6e87a8f437fbb4bda4cdabd5107dd1f20f111445 block: 225981315
- current block number: 227940683

## Description

Three new signers are added to the popapex OwnerMultisig.

## Watched changes

```diff
    contract RollupOwnerMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      upgradeability.threshold:
-        "2 of 4 (50%)"
+        "2 of 7 (29%)"
      values.getOwners.6:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.5:
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.4:
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getOwners.0:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

Generated with discovered.json: 0x4220660393dd05d99d4710998df879bf64a48ba1

# Diff at Tue, 11 Jun 2024 12:22:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 215638376
- current block number: 220726400

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 215638376 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [3456000,48,86400000,3600]
+        {"delayBlocks":3456000,"futureBlocks":48,"delaySeconds":86400000,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xf80bfbaf3a649ffd7309eb20265b40f764614b4a

# Diff at Mon, 27 May 2024 17:45:02 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@dbc274621a752b9a0e3943e430166c617d1edd06 block: 211899531
- current block number: 215638376

## Description

Updated the SequencerInbox template, no onchain changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 211899531 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
    }
```

Generated with discovered.json: 0x9fe3796691c10ec5795e696f3f364bf5faed7778

# Diff at Tue, 14 May 2024 07:19:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0dcad16d442c9306c666eb55cc246f5202105346 block: 203714971
- current block number: 211101547

## Description


This update extends the sequencer-only window for Proof of Play Apex chain by 1000x to 1000d. (MaxTimeVariation.delayBlocks, maxTimeVariation.delaySeconds)
Context: [Reorg on popapex](https://twitter.com/conduitxyz/status/1790065376975552549). No batches posted for the last ~35h, similar problem to Degen chain.

## Watched changes

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: None
      values.maxTimeVariation.2:
-        86400
+        86400000
      values.maxTimeVariation.0:
-        5760
+        3456000
    }
```

Generated with discovered.json: 0xf50c4fdab7cd8deba39e9b78f4634254f949bf52

# Diff at Thu, 11 Apr 2024 14:11:27 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 199929429

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupOwnerMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```
