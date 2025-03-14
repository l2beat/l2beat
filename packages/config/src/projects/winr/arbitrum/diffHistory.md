Generated with discovered.json: 0x29741e2e0c248234bd7e32ff2bcb92e25ed8904a

# Diff at Thu, 06 Mar 2025 14:25:18 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 305988230
- current block number: 305988230

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305988230 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x2fa921f9b0d6a355fc589c5e1eb0f870f9d8d056

# Diff at Thu, 06 Mar 2025 09:39:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 305988230
- current block number: 305988230

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305988230 (main branch discovery), not current.

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42","0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xBA99217992620b76aae0D574c70bD313B30D3D1d"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x8a2d8cf24bd994603ab787d1ae4872d4a2f07fae

# Diff at Tue, 04 Mar 2025 10:40:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 305988230
- current block number: 305988230

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305988230 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        211603139
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        211603139
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
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        211603139
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
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      sinceBlock:
+        155965667
    }
```

```diff
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a) {
    +++ description: None
      sinceBlock:
+        211603139
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        211603139
    }
```

```diff
    contract WinrFastconfirmerMultisig (0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4) {
    +++ description: None
      sinceBlock:
+        305331967
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        211603139
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        211603139
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
    contract RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        211603139
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        211603139
    }
```

```diff
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802890
    }
```

Generated with discovered.json: 0x0310de51db7e12047796e75aeaa276a7a4fc2df7

# Diff at Thu, 27 Feb 2025 11:47:38 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 305988230
- current block number: 305988230

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305988230 (main branch discovery), not current.

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

Generated with discovered.json: 0x9a090604fb314b0accec1491c16f0b16a3b1ab2c

# Diff at Fri, 21 Feb 2025 14:12:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 305988230
- current block number: 305988230

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305988230 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ERC20Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x39f8a3a7cb98d17221e8745782206be915c2219f

# Diff at Fri, 14 Feb 2025 13:33:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 298397636
- current block number: 305988230

## Description

Fastconfirmer added, minimum assertion set to 1 block.

## Watched changes

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","to":"0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"}]}
      issuedPermissions.3:
+        {"permission":"validate","to":"0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.to:
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.via.0:
+        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}
      issuedPermissions.1.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.1.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.permission:
-        "interact"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0.address:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
+++ description: Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. 
      values.minimumAssertionPeriod:
-        75
+        1
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        2
      values.validators.1:
+        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
      values.validators.0:
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
+        "0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
    }
```

```diff
+   Status: CREATED
    contract WinrFastconfirmerMultisig (0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4)
    +++ description: None
```

## Source code changes

```diff
.../WinrFastconfirmerMultisig/GnosisSafeL2.sol     | 1032 ++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 2 files changed, 1067 insertions(+)
```

Generated with discovered.json: 0x32529d0dfbff1c372c0dafeee03154a1ac447424

# Diff at Tue, 04 Feb 2025 12:33:58 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 298397636
- current block number: 298397636

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298397636 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
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

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x32cce396247b2a884b03c604b202defb01099ddd

# Diff at Thu, 23 Jan 2025 10:01:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c34926fa70131af78b4ff8ff2873e9c9f24dfc80 block: 296027530
- current block number: 298397636

## Description

ArbOs v32 upgrade to known contracts, no fastconfirmer set.

## Watched changes

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"
+        "0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
      values.$pastUpgrades.1:
+        ["2025-01-22T18:17:09.000Z","0xf99dd58af041164dc6a225a760822c2d28d41e836754dd84eefd9e4445a49791",["0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8"
+        "0xD89d54007079071cBA859127318b9F34eeB78049"
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
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
+        ["2025-01-22T18:17:09.000Z","0xf99dd58af041164dc6a225a760822c2d28d41e836754dd84eefd9e4445a49791",["0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446","0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"]]
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
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
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
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446)
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
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@296027530 => .flat}/OneStepProver0.sol  | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

Generated with discovered.json: 0x144f8daf39e61a8e3cbf2323877d0ffa7d911e08

# Diff at Mon, 20 Jan 2025 11:10:35 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 296027530
- current block number: 296027530

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 296027530 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
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
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
      issuedPermissions.2.to:
+        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
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
    contract ERC20Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
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
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      receivedPermissions.8.from:
+        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      receivedPermissions.7.target:
-        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      receivedPermissions.7.from:
+        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      receivedPermissions.6.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.6.from:
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.5.target:
-        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      receivedPermissions.5.from:
+        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      receivedPermissions.4.target:
-        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      receivedPermissions.4.from:
+        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      receivedPermissions.3.target:
-        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      receivedPermissions.3.from:
+        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      receivedPermissions.2.target:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.2.from:
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.1.target:
-        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      receivedPermissions.1.from:
+        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      receivedPermissions.0.target:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.0.from:
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      directlyReceivedPermissions.0.from:
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      directlyReceivedPermissions.6.from:
+        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      directlyReceivedPermissions.5.target:
-        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      directlyReceivedPermissions.5.from:
+        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      directlyReceivedPermissions.4.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      directlyReceivedPermissions.4.from:
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      directlyReceivedPermissions.3.target:
-        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      directlyReceivedPermissions.3.from:
+        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      directlyReceivedPermissions.2.target:
-        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      directlyReceivedPermissions.2.from:
+        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      directlyReceivedPermissions.1.target:
-        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      directlyReceivedPermissions.1.from:
+        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      directlyReceivedPermissions.0.target:
-        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      directlyReceivedPermissions.0.from:
+        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
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
-        "0x1A48A9e82dDb9cd157a67493Cc5E246D0cDd8307"
      issuedPermissions.0.to:
+        "0x1A48A9e82dDb9cd157a67493Cc5E246D0cDd8307"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ERC20Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
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
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
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
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.2.from:
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.1.target:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.1.from:
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      directlyReceivedPermissions.0.from:
+        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
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
    contract ERC20Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
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

Generated with discovered.json: 0xa3f69488451e8b0abe452b9fde3f2a215482af1f

# Diff at Thu, 16 Jan 2025 12:45:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 287773478
- current block number: 296027530

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

Generated with discovered.json: 0x8c5b02b5e8971bf6a5a837a3e5dfbe0dd67861f6

# Diff at Wed, 08 Jan 2025 10:45:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287773478
- current block number: 287773478

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287773478 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x22efdea3d60bcbda8329bb4b1bd96720a6048916

# Diff at Mon, 23 Dec 2024 12:55:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 278534982
- current block number: 287773478

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278534982 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x94d2b8a64be99c328ae50979cd25ccf476590736

# Diff at Thu, 05 Dec 2024 12:03:13 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 278534982
- current block number: 278534982

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278534982 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x2d9ecf49087973742d1ee6e7e3362c1cb943f1a3

# Diff at Fri, 29 Nov 2024 11:28:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 278534982
- current block number: 278534982

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278534982 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
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

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x1728f89b140ed4a3c5987d2081a514739f39b473

# Diff at Wed, 27 Nov 2024 13:45:26 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3b9391cfe483e60a1853eeae6e47b4de475aac4e block: 269235450
- current block number: 278534982

## Description

Move to discoverydriven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269235450 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      displayName:
+        "Inbox"
    }
```

```diff
    contract ERC20Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      displayName:
+        "Outbox"
    }
```

```diff
    contract ERC20Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      displayName:
+        "Bridge"
    }
```

Generated with discovered.json: 0x6cac5b3fe80b7480ca7a97dd119e9891188696c9

# Diff at Fri, 15 Nov 2024 08:18:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 269235450
- current block number: 269235450

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269235450 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0}]}
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
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.0:
+        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

Generated with discovered.json: 0xa08f18c7789ba3492d37c76ba2a278a62c79e52c

# Diff at Mon, 04 Nov 2024 08:10:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 269235450
- current block number: 269235450

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269235450 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
      issuedPermissions.2.via.0:
-        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.0:
+        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]}
      receivedPermissions.7.target:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
+        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      receivedPermissions.6.target:
-        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.5.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      receivedPermissions.4.target:
-        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
+        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      receivedPermissions.3.target:
-        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      receivedPermissions.2.target:
-        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.2.via.1:
-        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}
      receivedPermissions.2.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.1.target:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      receivedPermissions.1.via.1:
+        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}
      receivedPermissions.1.via.0.address:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.0.via.1:
-        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}
      receivedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [5760,48,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x1277bbdfb18440f2be6d2b2885177fa2da68f65e

# Diff at Wed, 30 Oct 2024 13:14:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 268839923
- current block number: 269235450

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

Generated with discovered.json: 0x5745d27debfd01722979e1e671aa8138e70e20cc

# Diff at Tue, 29 Oct 2024 13:22:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 267471744
- current block number: 268839923

## Description

Update challenge period to 1h.

## Watched changes

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s).
      values.confirmPeriodBlocks:
-        40320
+        300
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471744 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x6dbe7f6968298a514868837f6eddbe60c2492aa3

# Diff at Tue, 29 Oct 2024 08:54:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 267471744
- current block number: 267471744

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471744 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.2.via.0:
+        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0}
    }
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0x2633ea91d15BeE85105C9b27E068f406F2F36a4a","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0xBA99217992620b76aae0D574c70bD313B30D3D1d","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"},{"permission":"upgrade","target":"0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0xBA99217992620b76aae0D574c70bD313B30D3D1d","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"}
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

Generated with discovered.json: 0xa4c1ed93e4544fadc551fcef0b269c5e8d4f0723

# Diff at Mon, 28 Oct 2024 14:09:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 267471744
- current block number: 267471744

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471744 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"]
    }
```

Generated with discovered.json: 0xac49af87c43f25ba2147d90879a7b47005138502

# Diff at Fri, 25 Oct 2024 10:05:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 264379343
- current block number: 267471744

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379343 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"},{"permission":"upgrade","target":"0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"},{"permission":"upgrade","target":"0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"},{"permission":"upgrade","target":"0xBA99217992620b76aae0D574c70bD313B30D3D1d"},{"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"},{"permission":"upgrade","target":"0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"},{"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"},{"permission":"upgrade","target":"0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"},{"permission":"upgrade","target":"0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"},{"permission":"upgrade","target":"0xBA99217992620b76aae0D574c70bD313B30D3D1d"},{"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"},{"permission":"upgrade","target":"0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"},{"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"}]
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.1.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xBA99217992620b76aae0D574c70bD313B30D3D1d","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"}
      receivedPermissions.0.target:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      receivedPermissions.0.via:
+        [{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

Generated with discovered.json: 0x3c3833144cd0f8ce4b0ac00962bdfb6279c176f7

# Diff at Wed, 23 Oct 2024 14:37:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 264379343
- current block number: 264379343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379343 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v20 wasmModuleRoot"
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
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
```

```diff
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
    }
```

Generated with discovered.json: 0xba79d90bfa299979a78b2babe4e629a4c70f2027

# Diff at Mon, 21 Oct 2024 12:51:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 264379343
- current block number: 264379343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379343 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0xeccf11b5757373e91841845caa4191147f137fb2

# Diff at Mon, 21 Oct 2024 11:13:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 264379343
- current block number: 264379343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379343 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]
      values.$pastUpgrades.0.1:
-        ["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
      values.$pastUpgrades.0.1:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"]
      values.$pastUpgrades.0.1:
-        ["0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
      values.$pastUpgrades.0.1:
-        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"]
      values.$pastUpgrades.0.1:
-        ["0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

Generated with discovered.json: 0xeda2de9d24f5e9c147da761055ac44819320a1e3

# Diff at Wed, 16 Oct 2024 11:44:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 264379343
- current block number: 264379343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379343 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e","via":[]}
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0x1A48A9e82dDb9cd157a67493Cc5E246D0cDd8307"
    }
```

Generated with discovered.json: 0x66b77d12751a018b1ea8760b08851019d46b97ca

# Diff at Wed, 16 Oct 2024 10:19:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b6ff61526cf3d704839d0155008ae72cc9070de8 block: 262718848
- current block number: 264379343

## Description

Rename shared Conduit MS.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262718848 (main branch discovery), not current.

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      name:
-        "WinrMultisig"
+        "ConduitMultisig2"
    }
```

Generated with discovered.json: 0x3bb8c4e52d94ba51f6b905d4110e2925ba2a9a30

# Diff at Mon, 14 Oct 2024 10:59:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 262718848
- current block number: 262718848

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262718848 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
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
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
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
    contract WinrMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

```diff
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

Generated with discovered.json: 0xb45c598cff89f47d8c91b6f97e76d89807592643

# Diff at Fri, 11 Oct 2024 14:19:22 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 262718848

## Description

Standard Orbit stack Optimium, .97 similar to PoP Boss. Shared Admin Multisig with ProofOfPlay Chains!

## Initial discovery

```diff
+   Status: CREATED
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WinrMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA)
    +++ description: None
```
