Generated with discovered.json: 0x99ebcf0ad52a4b2262f7f7a3c78012109623925e

# Diff at Mon, 10 Mar 2025 16:53:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef4d1036423fe7d398c41e6cf238a209cc1ff8f3 block: 21988484
- current block number: 21988484

## Description

changed EOA signer of the Kinto SecurityCouncil.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21988484 (main branch discovery), not current.

```diff
    contract KintsugiFoundation (0x94561e98DD5E55271f91A103e4979aa6C493745E) {
    +++ description: None
      name:
-        "MamoriLabs2"
+        "KintsugiFoundation"
    }
```

Generated with discovered.json: 0x4d18726190c34736596855ef23ed853f1b25431c

# Diff at Fri, 07 Mar 2025 09:06:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21872461
- current block number: 21988484

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872461 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x350bab3c23cf9ecee648af508bd14b5cc255e8fe

# Diff at Thu, 06 Mar 2025 09:39:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21872461
- current block number: 21872461

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872461 (main branch discovery), not current.

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x655761AD5FC251F414D6993A73184B0669F278c8"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x7e4c189edbbafb3e8c4f992b91ca6b2102ede1cd

# Diff at Tue, 04 Mar 2025 10:39:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21872461
- current block number: 21872461

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872461 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' defined by the admin before bridging them to the L2. It does not have a function to bridge via the canonical bridge and uses the external socket bridge by default.
      sinceBlock:
+        19419135
    }
```

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      sinceBlock:
+        18772804
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        18736154
    }
```

```diff
    contract OneStepProver0 (0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21049963
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        18788587
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        18788587
    }
```

```diff
    contract OneStepProverHostIo (0x551E2501074D80E22c5FfB69b5fd8ba2939593b7) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21049966
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        18788587
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        18788587
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        18788587
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      sinceBlock:
+        18788587
    }
```

```diff
    contract OneStepProverMemory (0x778ca912Bd8b35dDA84852B47BA8624e08f640A6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21049964
    }
```

```diff
    contract ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        18788729
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        18788587
    }
```

```diff
    contract OneStepProverMath (0xacED35d61f71A804E7627b5622c267C8Ac31d38e) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21049965
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        18788587
    }
```

```diff
    contract GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        18788729
    }
```

```diff
    contract TurnkeyMultisig (0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1) {
    +++ description: None
      sinceBlock:
+        20465349
    }
```

```diff
    contract OneStepProofEntry (0xEd696D87C351C2ef687c1c484c3e297B276a40d1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21049967
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      sinceBlock:
+        16818229
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        18788587
    }
```

Generated with discovered.json: 0xac84dc83f9b9b311f6d34f246f5deb527c133141

# Diff at Thu, 27 Feb 2025 11:45:51 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21872461
- current block number: 21872461

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872461 (main branch discovery), not current.

```diff
    contract ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1ERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1GatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

Generated with discovered.json: 0x0ae6a9ab2d2bc26891a7a947c598d990fe1274b7

# Diff at Fri, 21 Feb 2025 14:07:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21872461
- current block number: 21872461

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872461 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xb1e39ae79dd1d7444cfd8587ae5a4704d8b6b32b

# Diff at Tue, 18 Feb 2025 09:51:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aff7e43e1c06f559de916763e04088cc23b3e08e block: 21786850
- current block number: 21872461

## Description

Change descriptions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786850 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' defined by the admin before bridging them to the L2. It does not have a function to bridge via the canonical bridge and uses the external socket bridge by default.
      description:
-        "Bridger gateway that can swap assets to 'L2 final assets' before bridging them to the L2."
+        "Bridger gateway that can swap assets to 'L2 final assets' defined by the admin before bridging them to the L2. It does not have a function to bridge via the canonical bridge and uses the external socket bridge by default."
    }
```

Generated with discovered.json: 0xa8e9417b7e0bc31807c08e40571ed161fafa578a

# Diff at Tue, 04 Feb 2025 12:31:35 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21580548
- current block number: 21580548

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21580548 (main branch discovery), not current.

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x4e8a5917ca4010498cbdaea6d35e04be8e1b2abb

# Diff at Mon, 20 Jan 2025 11:09:38 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21580548
- current block number: 21580548

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21580548 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' before bridging them to the L2.
      issuedPermissions.0.target:
-        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
      issuedPermissions.0.to:
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      receivedPermissions.10.from:
+        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      receivedPermissions.9.target:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      receivedPermissions.9.from:
+        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      receivedPermissions.8.target:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      receivedPermissions.8.from:
+        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      receivedPermissions.7.target:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      receivedPermissions.7.from:
+        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      receivedPermissions.6.target:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      receivedPermissions.6.from:
+        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      receivedPermissions.5.target:
-        "0x655761AD5FC251F414D6993A73184B0669F278c8"
      receivedPermissions.5.from:
+        "0x655761AD5FC251F414D6993A73184B0669F278c8"
      receivedPermissions.4.target:
-        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      receivedPermissions.4.from:
+        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      receivedPermissions.3.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.3.from:
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.2.target:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      receivedPermissions.2.from:
+        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      receivedPermissions.1.target:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      receivedPermissions.1.from:
+        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      receivedPermissions.0.target:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      receivedPermissions.0.from:
+        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      directlyReceivedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      directlyReceivedPermissions.0.from:
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6.target:
-        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      issuedPermissions.6.to:
+        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      issuedPermissions.6.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.5.target:
-        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.5.to:
+        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.5.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.target:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.4.to:
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
      issuedPermissions.3.to:
+        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      issuedPermissions.2.to:
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      directlyReceivedPermissions.2.target:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      directlyReceivedPermissions.2.from:
+        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      directlyReceivedPermissions.1.target:
-        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      directlyReceivedPermissions.1.from:
+        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      directlyReceivedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
      directlyReceivedPermissions.0.from:
+        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      directlyReceivedPermissions.8.from:
+        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      directlyReceivedPermissions.7.target:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      directlyReceivedPermissions.7.from:
+        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      directlyReceivedPermissions.6.target:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      directlyReceivedPermissions.6.from:
+        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      directlyReceivedPermissions.5.target:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      directlyReceivedPermissions.5.from:
+        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      directlyReceivedPermissions.4.target:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      directlyReceivedPermissions.4.from:
+        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      directlyReceivedPermissions.3.target:
-        "0x655761AD5FC251F414D6993A73184B0669F278c8"
      directlyReceivedPermissions.3.from:
+        "0x655761AD5FC251F414D6993A73184B0669F278c8"
      directlyReceivedPermissions.2.target:
-        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      directlyReceivedPermissions.2.from:
+        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      directlyReceivedPermissions.1.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      directlyReceivedPermissions.1.from:
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      directlyReceivedPermissions.0.target:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      directlyReceivedPermissions.0.from:
+        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x0f1b7bd7762662B23486320AA91F30312184f70C"
      receivedPermissions.0.from:
+        "0x0f1b7bd7762662B23486320AA91F30312184f70C"
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.target:
-        "0xe27f3f6db6824def1738b2aACe2672aC59046a39"
      issuedPermissions.0.to:
+        "0xe27f3f6db6824def1738b2aACe2672aC59046a39"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

Generated with discovered.json: 0x8abec7e3e2c14bde6444aebb74e4f595650e4ad1

# Diff at Mon, 13 Jan 2025 09:02:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@c91b831cf8a00067e27832808851565a41cd3489 block: 21580548
- current block number: 21580548

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21580548 (main branch discovery), not current.

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      references:
+        [{"text":"Security Council members - Kinto Docs","href":"https://docs.kinto.xyz/kinto-the-modular-exchange/security-kyc-aml/security-council"}]
    }
```

Generated with discovered.json: 0x5c17c6f6b6df18d014267565224c68e1ed6b123f

# Diff at Wed, 08 Jan 2025 15:07:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21465190
- current block number: 21580548

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465190 (main branch discovery), not current.

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xaf1f741d783c99544b3ee4356dd1103cdb0cbc23

# Diff at Mon, 23 Dec 2024 12:29:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21429443
- current block number: 21465190

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21429443 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x2bd708fab05955301c1f1d6ccf735f064a471fbd

# Diff at Wed, 18 Dec 2024 12:34:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 21394564
- current block number: 21429443

## Description

Minor Bridger upgrade, notably adding a `rescueToken` function callable by the owner that does what it says (Bridger does not usually escrow funds, it behaves like a router).

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' before bridging them to the L2.
      sourceHashes.1:
-        "0xe7c2c13ea3945f7f426234c719fd1c436d2f5e0152427b80b30ca059c9f2f4e5"
+        "0xe2aec4572349f66126b1ebb9d5e63c56d78d4655c3d036b5fdcd621c052125e5"
      values.$implementation:
-        "0x21D3921B50617BDef223207118950B0b577e4007"
+        "0xae2F80339Bdd9bd384502A62aEe956eAbF3796e6"
      values.$pastUpgrades.11:
+        ["2024-12-17T00:38:35.000Z","0x9e8c1bcb81d01c1d3ed8c7f0b34ac033d5838e341641a809a6a1ad101139e118",["0xae2F80339Bdd9bd384502A62aEe956eAbF3796e6"]]
      values.$upgradeCount:
-        11
+        12
    }
```

## Source code changes

```diff
.../{.flat@21394564 => .flat}/Bridger/Bridger.sol  | 27 ++++++++++++++++++++--
 1 file changed, 25 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x8a5f69d0cb6b892ebfd38ca8887bac3224e03da8

# Diff at Fri, 06 Dec 2024 08:09:46 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21292450
- current block number: 21292450

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292450 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x03b98aeda868be755255be5223959d487b50d46a

# Diff at Fri, 29 Nov 2024 11:28:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21292450
- current block number: 21292450

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292450 (main branch discovery), not current.

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xe77bfb77ccf4aca1b091e7011b0da9adf61d2352

# Diff at Fri, 29 Nov 2024 09:31:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21184697
- current block number: 21292450

## Description

Config related: remove manual template override.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184697 (main branch discovery), not current.

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xabb1318f80d8c295e4a215849d988bb001cf62b9

# Diff at Fri, 15 Nov 2024 08:18:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21184697
- current block number: 21184697

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184697 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.11:
-        {"permission":"upgrade","target":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0}]}
      issuedPermissions.10:
-        {"permission":"propose","target":"0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f","via":[]}
      issuedPermissions.9:
-        {"permission":"propose","target":"0x944eB0a2829A859959586b10D54229278534a696","via":[]}
      issuedPermissions.8:
-        {"permission":"propose","target":"0x64Cf65036a76E3827e448cadbc53D31EefDCE04a","via":[]}
      issuedPermissions.7:
-        {"permission":"propose","target":"0x58028fFbc25aE2e12b96276bDB125955F41D41f3","via":[]}
      issuedPermissions.6.permission:
-        "propose"
+        "validate"
      issuedPermissions.6.target:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      issuedPermissions.5.permission:
-        "configure"
+        "validate"
      issuedPermissions.5.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
+        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.5.via.0:
-        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      issuedPermissions.4.permission:
-        "challenge"
+        "validate"
      issuedPermissions.4.target:
-        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.3.permission:
-        "challenge"
+        "validate"
      issuedPermissions.3.target:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
      issuedPermissions.2.permission:
-        "challenge"
+        "validate"
      issuedPermissions.2.target:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.1.via.0:
+        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0}
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.0:
+        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      template:
+        "orbitstack/GatewayRouter"
      displayName:
+        "GatewayRouter"
      description:
+        "This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging."
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x5e0d12e936795301883225446f95128f6b80979d

# Diff at Thu, 14 Nov 2024 08:19:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 21141407
- current block number: 21184697

## Description

Staker count drops to 1 as the 'defensive' validators are not actively staking on new nodes anymore.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.stakerCount:
-        3
+        1
    }
```

Generated with discovered.json: 0xbadecc0125ffd00ab33a489de1190ff6975a4ada

# Diff at Fri, 08 Nov 2024 07:24:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@53988239f42edde0275ed92d8f3ada4279354f7d block: 21123028
- current block number: 21141407

## Description

The initial diverging node is now [rejected](https://etherscan.io/tx/0xeddeaed1b11b112b6131993a9a9149297d280312fed6969176249949bc3e3158) and the losing validator churned (un-zombified). Since they stay whitelisted as a validator and are not a zombie anymore, they can propose/challenge again whenever needed.

During the challenge, all validators except hypernative took part, Kinto says they were in 'watchtower' mode and not defensive.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.zombieAddress.0:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      values.zombieCount:
-        1
+        0
      values.zombieLatestStakedNode.0:
-        2167
    }
```

Generated with discovered.json: 0x07e8c632515ec118c973e23cff33a07ec4c18e27

# Diff at Tue, 05 Nov 2024 17:46:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e08cb5c139f2a262ed7108b412a045efba3a7db3 block: 21112607
- current block number: 21123028

## Description

The challenge launched by the ankr validator [has timed out](https://etherscan.io/tx/0xfed67894cc32ef8e161ca5449ae804d81ba3a9a439584495cc695e9446f8f07a) in favor of the asserter `0x64cf65036a76e3827e448cadbc53d31eefdce04a`, against ankr challenger. The 0.1 stake of the challenger is split 50/50 between the winning staker and the loserStakeEscrow `0x09d34b74cd8b1c4394a3cd9630e1ba027e6ed4f5`. The ankr staker has to re-stake at least 0.05 ETH to participate again.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.stakerCount:
-        4
+        3
      values.totalWithdrawableFunds:
-        0
+        "50000000000000000"
      values.zombieAddress.0:
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      values.zombieCount:
-        0
+        1
      values.zombieLatestStakedNode.0:
+        2167
    }
```

Generated with discovered.json: 0x6bc8292f5b020163c8b5587c4141fe8dc2dddbc5

# Diff at Mon, 04 Nov 2024 07:56:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21098438
- current block number: 21112607

## Description

Kinto Decentralization upgrade:

### Stage 1 TODO:
Guarantee a KintoWallet user on L2 to be able to exit their funds. Context:
- kinto-geth [censors all EOA->contract calls on L2](https://github.com/KintoXYZ/kinto-go-ethereum/blob/kinto/core/kinto.go#L23C53-L23C95) and forces users into smartWallet usage
- KintoWallet is upgradeable: `isKYC` flag can be changed by actors more centralized than SC
- KintoWallet verifies `isKYC` on every transaction

### Security Council
The multisig at `0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d` has the EXECUTOR_ROLE and meets the minimum requirements for a Security Council. Members are published [here](https://docs.kinto.xyz/kinto-the-safe-l2/security-kyc-aml/security-council) (5 external members, including Caldera).
- Kinto Foundation: `0x08E674c4538caE03B6c05405881dDCd95DcaF5a8`
- Mamori Labs: `0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B`, `0x94561e98DD5E55271f91A103e4979aa6C493745E`
- Caldera: `0x356000Cec4fC967f8FC372381D983426760A0391`
- Hypernative: `0x082CBA3929aD00EbB6d81ebE57B0BD24fBF3Fc6B`
- Venn/Ironblocks: `0xe52957E92a372d5a3B544F4C329b606f1A1b4bD2`
- Turnkey: `0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1`
- Certora: `0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621`

### Validators
There are 5 validators in total, published [here](https://docs.kinto.xyz/kinto-the-safe-l2/security-kyc-aml/kinto-validators) and ran by:
- Caldera: `0x64Cf65036a76E3827e448cadbc53D31EefDCE04a` (main proposer)
- Mamori Labs: `0x944eB0a2829A859959586b10D54229278534a696`
- Ankr: `0x2bfDA59220413DEd39dD0E443620b5277EcE6348` (started a challenge due to late software update)
- Hypernative: `0x58028fFbc25aE2e12b96276bDB125955F41D41f3`
- Venn: `0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f`

## Watched changes

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.$members.8:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.7:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.6:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.multisigThreshold:
-        "6 of 9 (67%)"
+        "6 of 8 (75%)"
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.lastStakeBlock:
-        21084338
+        21107949
      values.stakerCount:
-        3
+        4
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21098438 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: Bridger gateway that can swap assets to 'L2 final assets' before bridging them to the L2.
      description:
+        "Bridger gateway that can swap assets to 'L2 final assets' before bridging them to the L2."
    }
```

```diff
    contract Kinto SecurityCouncil (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      name:
-        "ExecutorMultisig"
+        "Kinto SecurityCouncil"
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]}
      receivedPermissions.9.target:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      receivedPermissions.8.target:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
+        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      receivedPermissions.7.target:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      receivedPermissions.6.target:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      receivedPermissions.5.target:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
+        "0x655761AD5FC251F414D6993A73184B0669F278c8"
      receivedPermissions.4.target:
-        "0x655761AD5FC251F414D6993A73184B0669F278c8"
+        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      receivedPermissions.3.target:
-        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.2.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
      receivedPermissions.1.target:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+        "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"
      receivedPermissions.1.via.1:
-        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}
      receivedPermissions.1.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy_fastConfirm"
+        "orbitstack/RollupProxy"
      issuedPermissions.5.target:
-        "0x0000000000000000000000000000000000000000"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.5.via.0:
+        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      fieldMeta.minimumAssertionPeriod:
-        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      template:
+        "orbitstack/ERC20Gateway"
      displayName:
+        "ERC20Gateway"
      description:
+        "Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract."
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract TurnkeyMultisig (0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "TurnkeyMultisig"
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x1678709304c14f7d103f4788317c363a2345037b

# Diff at Sat, 02 Nov 2024 07:22:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@93f317513d51e26ce3003e34f6a9147b7f41eb7a block: 21077256
- current block number: 21098438

## Description

Challenge undergoing awaiting oneStepProver resolution. Also updated discovery for template. Kinto on telegram confirmed that this challenge was the result of ankr (the 0x2bfDA validator) did not upgrade their software in time for the HF 7 and thus challenged a correct state.

The ExecutorMultisig is being transformed into a SecurityCouncil with 5 public external members. It is currently 6/9 and would need one less Kinto-owned signer to meet the requirements.

## Watched changes

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.$members.8:
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.7:
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.6:
+        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.$members.5:
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.$members.4:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
      values.$members.3:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x082CBA3929aD00EbB6d81ebE57B0BD24fBF3Fc6B"
      values.$members.2:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0xe52957E92a372d5a3B544F4C329b606f1A1b4bD2"
      values.$members.1:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x5FB5040dfC5B8b9Ea40dFBd881188Ec85cDC0621"
      values.$members.0:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1"
      values.$threshold:
-        3
+        6
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "6 of 9 (67%)"
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Emitted on createChallenge() in RollupUserLogic.
      values.challenges.0:
+        {"challengeIndex":1,"asserter":"0x64Cf65036a76E3827e448cadbc53D31EefDCE04a","challenger":"0x2bfDA59220413DEd39dD0E443620b5277EcE6348","challengedNode":2161}
      values.lastStakeBlock:
-        18788889
+        21084338
      values.stakerCount:
-        1
+        3
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      values.totalChallengesCreated:
-        0
+        1
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xD98B32e5D0Dcb5853e498225a15447a59b7a40e1)
    +++ description: None
```

## Source code changes

```diff
.../kinto/ethereum/.flat/GnosisSafe/GnosisSafe.sol | 953 +++++++++++++++++++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |  35 +
 2 files changed, 988 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21077256 (main branch discovery), not current.

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x52d0651024635a16526a05f5d48aebc82c5b2ed9

# Diff at Wed, 30 Oct 2024 08:26:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@133f6bdd684278299c8df162b697d52fa91f3aef block: 21041838
- current block number: 21077256

## Description

Kinto [HF 7 upgrade](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/11). Kinto uses a custom wasmModuleRoot but this upgrade loosely corresponds to ArbOS v32 in that L1 contract implementations are the same.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      issuedPermissions.11:
+        {"permission":"upgrade","target":"0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0}]}
      issuedPermissions.10.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.10.target:
-        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
+        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      issuedPermissions.10.via.0:
-        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0}
      issuedPermissions.9.target:
-        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
+        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.8.target:
-        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.7.target:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
      issuedPermissions.6.target:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      issuedPermissions.5.permission:
-        "propose"
+        "configure"
      issuedPermissions.5.target:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+        "0x0000000000000000000000000000000000000000"
      issuedPermissions.3.target:
-        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
+        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.2.target:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.1.target:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0xa6f528c65569d903C20e7D2639ad343128B4FD27"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x27Bb05e547CfC9b874f18b0F6F3FB62A58Be9CdB"
      values.$pastUpgrades.1:
+        ["2024-10-30T01:29:35.000Z","0x81ed45f10aa3c6062d1d3ce5c6a2763c4e88e93e51d35665e94e33b2b04627ad",["0x27Bb05e547CfC9b874f18b0F6F3FB62A58Be9CdB","0xa6f528c65569d903C20e7D2639ad343128B4FD27"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "0x2ca63ffd73f314d60f8d672954389881918100435f27fd4193becb12310d7faa"
+        "0x58a9512cf4096461f866446387e845c6573856ef603bba4e24cb1d89630a675c"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        3
+        4
      values.validators.3:
-        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
+        "0x944eB0a2829A859959586b10D54229278534a696"
      values.validators.2:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      values.validators.1:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x58028fFbc25aE2e12b96276bDB125955F41D41f3"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x2ca63ffd73f314d60f8d672954389881918100435f27fd4193becb12310d7faa"
+        "0x58a9512cf4096461f866446387e845c6573856ef603bba4e24cb1d89630a675c"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x122B88885F1f365B69CAd38B167B039fEd0Ba096"
+        "0xd14D9d4c8985763B5037A4f253977e059385660c"
      values.$pastUpgrades.2:
+        ["2024-10-30T01:29:35.000Z","0x81ed45f10aa3c6062d1d3ce5c6a2763c4e88e93e51d35665e94e33b2b04627ad",["0xd14D9d4c8985763B5037A4f253977e059385660c"]]
      values.$upgradeCount:
-        2
+        3
      values.osp:
-        "0x8B02a8B985a81f96e49B8289FF60847FC6020e51"
+        "0xEd696D87C351C2ef687c1c484c3e297B276a40d1"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x6c4322e9A0478CA7aDd30e561f96af379D3A22Bb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x76f72B8eFDA2DCDD3fB5A8c16d576c25eD43D645)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x8B02a8B985a81f96e49B8289FF60847FC6020e51)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xba9D43FA3576bc40f13cb0731D770d1e510EdE46)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xf09Bc0285055BEA82165cA3F54054aa88BB3C169)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x2C1e1A31d2bC26f7BE3CAB5Cb0806641847B3C59)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x551E2501074D80E22c5FfB69b5fd8ba2939593b7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x778ca912Bd8b35dDA84852B47BA8624e08f640A6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xacED35d61f71A804E7627b5622c267C8Ac31d38e)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xEd696D87C351C2ef687c1c484c3e297B276a40d1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@21041838 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041838 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

Generated with discovered.json: 0x3d4a97f1ffb587553e5572d43ef81d50b919d48e

# Diff at Tue, 29 Oct 2024 08:02:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041838
- current block number: 21041838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041838 (main branch discovery), not current.

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","via":[{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]},{"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"},{"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"}]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.10.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.10.via.0:
+        {"address":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","delay":0}
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"},{"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]},{"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"}
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.0.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"
      issuedPermissions.1.via.1:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
    }
```

Generated with discovered.json: 0xb66e356473635b36069ee03955ded08d7f2bc796

# Diff at Mon, 28 Oct 2024 14:04:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041838
- current block number: 21041838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041838 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d"]
    }
```

Generated with discovered.json: 0xc9b0b420e73c45bd6dbaa74f69368a5a774ee486

# Diff at Fri, 25 Oct 2024 09:49:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20948097
- current block number: 21041838

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","via":[{"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]}
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df"}]
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"},{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"},{"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8"},{"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42"},{"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"},{"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"},{"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"},{"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"},{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"},{"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"},{"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8"},{"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42"},{"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"},{"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"},{"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"},{"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"}]
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.0.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      issuedPermissions.1.via.0:
+        {"address":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","delay":0}
    }
```

Generated with discovered.json: 0x48006feea057b24b4c2f65488f24dcc9d1ae7006

# Diff at Wed, 23 Oct 2024 14:36:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20948097
- current block number: 20948097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x434345973Ebf8249398E1EeB03A62bE418B48a05)
    +++ description: None
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.10:
+        {"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[]}
      issuedPermissions.9:
+        {"permission":"propose","target":"0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f","via":[]}
      issuedPermissions.8:
+        {"permission":"propose","target":"0x9A6a3354Ea78572EDB7df8458911e1ceD733c224","via":[]}
      issuedPermissions.7:
+        {"permission":"propose","target":"0x944eB0a2829A859959586b10D54229278534a696","via":[]}
      issuedPermissions.6:
+        {"permission":"propose","target":"0x64Cf65036a76E3827e448cadbc53D31EefDCE04a","via":[]}
      issuedPermissions.5.permission:
-        "validate"
+        "propose"
      issuedPermissions.5.target:
-        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
      issuedPermissions.4.permission:
-        "validate"
+        "challenge"
      issuedPermissions.4.target:
-        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
+        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      issuedPermissions.3.permission:
-        "validate"
+        "challenge"
      issuedPermissions.3.target:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
      issuedPermissions.2.permission:
-        "validate"
+        "challenge"
      issuedPermissions.2.target:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x944eB0a2829A859959586b10D54229278534a696"
      issuedPermissions.1.permission:
-        "validate"
+        "challenge"
      issuedPermissions.1.target:
-        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "0x2ca63ffd73f314d60f8d672954389881918100435f27fd4193becb12310d7faa"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract OneStepProverHostIo (0x6c4322e9A0478CA7aDd30e561f96af379D3A22Bb) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProver0 (0x76f72B8eFDA2DCDD3fB5A8c16d576c25eD43D645) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProofEntry (0x8B02a8B985a81f96e49B8289FF60847FC6020e51) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
    contract OneStepProverMath (0xba9D43FA3576bc40f13cb0731D770d1e510EdE46) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMemory (0xf09Bc0285055BEA82165cA3F54054aa88BB3C169) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.dacKeyset:
+        {"requiredSignatures":0,"membersCount":0,"blsSignatures":[]}
      template:
+        "orbitstack/SequencerInbox"
      description:
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0xd38da817903eba7857f27e7dba72621771ae1d41

# Diff at Mon, 21 Oct 2024 12:45:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20948097
- current block number: 20948097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0x3a855e798a59f810b47e7da042f4e8821fe930ae

# Diff at Mon, 21 Oct 2024 11:06:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20948097
- current block number: 20948097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$pastUpgrades.10.2:
+        ["0x21D3921B50617BDef223207118950B0b577e4007"]
      values.$pastUpgrades.10.1:
-        ["0x21D3921B50617BDef223207118950B0b577e4007"]
+        "0x31a2c058d7ce91c9d1b526764cf6442a45bdf662d2725bf8535a167303250bec"
      values.$pastUpgrades.9.2:
+        ["0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"]
      values.$pastUpgrades.9.1:
-        ["0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"]
+        "0x07dac4c8df3e4fbc7619636522e7f893296c5ef9a7dd3b5a28976d5eedf09fd4"
      values.$pastUpgrades.8.2:
+        ["0x23559eB4Ad22c31940a929958B104821126F35b7"]
      values.$pastUpgrades.8.1:
-        ["0x23559eB4Ad22c31940a929958B104821126F35b7"]
+        "0x0298ee3f7f0e0ebb53b19939a06453013a051923a1f27e59362d93ec2012fc3f"
      values.$pastUpgrades.7.2:
+        ["0xEEe82E92bA40A694409B4BDa3D7426188c61163e"]
      values.$pastUpgrades.7.1:
-        ["0xEEe82E92bA40A694409B4BDa3D7426188c61163e"]
+        "0xf174716076d1373e6ee74c5f2afc7aea9de184deb45b3c992d873160c0bf5355"
      values.$pastUpgrades.6.2:
+        ["0x270f25127D7C48c956459e113aa81615CC30AeE2"]
      values.$pastUpgrades.6.1:
-        ["0x270f25127D7C48c956459e113aa81615CC30AeE2"]
+        "0xa99267f3208e313084784d7da895d88acd4a86001483566f21f3073e0ee13039"
      values.$pastUpgrades.5.2:
+        ["0x0210AE8703F8c9A88D7050825bd8001E359CB4BA"]
      values.$pastUpgrades.5.1:
-        ["0x0210AE8703F8c9A88D7050825bd8001E359CB4BA"]
+        "0x80b6eb0ef3cabe648cfb4cd49f4c6efbdb3283f04682065f99f4c871c8315839"
      values.$pastUpgrades.4.2:
+        ["0x3636617973f25a512676cb06876f0C885568664a"]
      values.$pastUpgrades.4.1:
-        ["0x3636617973f25a512676cb06876f0C885568664a"]
+        "0xe8481050b8e1b2d41d1e79a89d004596c9f1ed6293e2a0b07e295d7104b72108"
      values.$pastUpgrades.3.2:
+        ["0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"]
      values.$pastUpgrades.3.1:
-        ["0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"]
+        "0x1b0c58c017710ce99817ef751625accd468c9661ecff7984680eaf6e2150d968"
      values.$pastUpgrades.2.2:
+        ["0xE3641CbDAc5477C350c8FeAAF52Ddc021451A2aA"]
      values.$pastUpgrades.2.1:
-        ["0xE3641CbDAc5477C350c8FeAAF52Ddc021451A2aA"]
+        "0xd52c14d572e45c1bd011844d136b7c492fc5ecb802e1c50f850c6662f3a7fccf"
      values.$pastUpgrades.1.2:
+        ["0x31a20f10c846BD3Ed41c6c05c340bFD7A57ECADA"]
      values.$pastUpgrades.1.1:
-        ["0x31a20f10c846BD3Ed41c6c05c340bFD7A57ECADA"]
+        "0xa1780c4191178aef57f3fc1a9d38a431d46fa163ed0436c839afade5dc91328e"
      values.$pastUpgrades.0.2:
+        ["0x925eC66892261203536a4aede9CA8e8D0feeA4ad"]
      values.$pastUpgrades.0.1:
-        ["0x925eC66892261203536a4aede9CA8e8D0feeA4ad"]
+        "0x5fe42b41ba3aafb36ec09d39284fdfc0d6df534b81488c7382ee8418fe620e62"
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x122B88885F1f365B69CAd38B167B039fEd0Ba096"]
      values.$pastUpgrades.1.1:
-        ["0x122B88885F1f365B69CAd38B167B039fEd0Ba096"]
+        "0x9226b704344df97784d15fc6cdbcfef620f393011c803879e7ec2e8c875665b0"
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
      values.$pastUpgrades.0.1:
-        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
+        "0xff7d995569e4a00193462406da253b8fb2fa14e8fddf5f79bed51180e6099c54"
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"]
      values.$pastUpgrades.2.1:
-        ["0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"]
+        "0xec98dd39612eb11b2d7e15fc9961c34aba0796fd078989942636728ebeb888e3"
      values.$pastUpgrades.1.2:
+        ["0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"]
      values.$pastUpgrades.1.1:
-        ["0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"]
+        "0x3ad996252ae2a17bb0e7b5ec38eee0d104fd097da479cb3911b34d925f1750d7"
      values.$pastUpgrades.0.2:
+        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
      values.$pastUpgrades.0.1:
-        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
      values.$pastUpgrades.0.1:
-        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
+        "0xff7d995569e4a00193462406da253b8fb2fa14e8fddf5f79bed51180e6099c54"
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x57411f5BA52531e8199066bC8EC650470A744883"]
      values.$pastUpgrades.1.1:
-        ["0x57411f5BA52531e8199066bC8EC650470A744883"]
+        "0x9226b704344df97784d15fc6cdbcfef620f393011c803879e7ec2e8c875665b0"
      values.$pastUpgrades.0.2:
+        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
      values.$pastUpgrades.0.1:
-        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
+        "0xd51bb4d6150d5fbaa61cf5281598b18c4efba4284aecb4420fc8d834dba357d8"
    }
```

Generated with discovered.json: 0xbd508c70095d27f69d033fd7031dfcd8338fbce0

# Diff at Wed, 16 Oct 2024 11:36:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20948097
- current block number: 20948097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.5:
+        {"permission":"validate","target":"0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f","via":[]}
      issuedPermissions.4:
+        {"permission":"validate","target":"0x9A6a3354Ea78572EDB7df8458911e1ceD733c224","via":[]}
      issuedPermissions.3:
+        {"permission":"validate","target":"0x944eB0a2829A859959586b10D54229278534a696","via":[]}
      issuedPermissions.2:
+        {"permission":"validate","target":"0x64Cf65036a76E3827e448cadbc53D31EefDCE04a","via":[]}
      issuedPermissions.1:
+        {"permission":"validate","target":"0x2bfDA59220413DEd39dD0E443620b5277EcE6348","via":[]}
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x74C717C01425eb475A5fC55d2A4a9045fC9800df"
+        "0xe27f3f6db6824def1738b2aACe2672aC59046a39"
    }
```

Generated with discovered.json: 0x8c48ccf731dd277fbf745171c42c8df88267f82b

# Diff at Mon, 14 Oct 2024 10:52:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20948097
- current block number: 20948097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20948097 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      sourceHashes:
+        ["0xeeb4c186c20cc83c0dc547c387bbb8738f8a0b213ed2e8ecb325ad9326c326bc","0xe7c2c13ea3945f7f426234c719fd1c436d2f5e0152427b80b30ca059c9f2f4e5"]
    }
```

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcd37abd5bdcc8c37cbf37dcfa4889d5b238388344d913b3a48914f659e0d627b"]
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x28eec040eca7563195b19e22e11429d0f977820bfb60ac52e567ffde3c92cf77"]
    }
```

```diff
    contract OneStepProverHostIo (0x6c4322e9A0478CA7aDd30e561f96af379D3A22Bb) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract OneStepProver0 (0x76f72B8eFDA2DCDD3fB5A8c16d576c25eD43D645) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x12b277cae4866b3d1f1772fcb7f861dc23247452179f0736c9dbe7012f6c14f6"]
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xb920455f1e366c7a89719abdd8d8174e4e7d353f2d4b7dea11b0571bf9526eae"]
    }
```

```diff
    contract OneStepProofEntry (0x8B02a8B985a81f96e49B8289FF60847FC6020e51) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract OneStepProverMath (0xba9D43FA3576bc40f13cb0731D770d1e510EdE46) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x457c34030000c1767f1ef518c365b671181e9e701db9642be8572edc1c44068c"]
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x61cc407871b0c56af41887c99354633d150e4586f0a6d237c6efd10966b17bd7"]
    }
```

```diff
    contract OneStepProverMemory (0xf09Bc0285055BEA82165cA3F54054aa88BB3C169) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

Generated with discovered.json: 0x994037948ef2900c64ad0927c5c60625d918ad6a

# Diff at Sat, 12 Oct 2024 07:41:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@86ddd4ba846ebcaec5953fa3bbd1a66f324e7175 block: 20842784
- current block number: 20948097

## Description

Add 3 new validators. (Total vali count is 5 now)

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.setValidatorCount:
-        2
+        3
      values.validators.4:
+        "0xe528E74302FFCF6F9F6a1c973968d98F0fDbad8f"
      values.validators.3:
+        "0x9A6a3354Ea78572EDB7df8458911e1ceD733c224"
      values.validators.2:
+        "0x944eB0a2829A859959586b10D54229278534a696"
      values.validators.1:
-        "0x944eB0a2829A859959586b10D54229278534a696"
+        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
      values.validators.0:
-        "0x64Cf65036a76E3827e448cadbc53D31EefDCE04a"
+        "0x2bfDA59220413DEd39dD0E443620b5277EcE6348"
    }
```

Generated with discovered.json: 0x8ddb56eb447e9f62e0031486081732d2d537625f

# Diff at Tue, 01 Oct 2024 10:51:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842784
- current block number: 20842784

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842784 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-12T12:55:35.000Z",["0x925eC66892261203536a4aede9CA8e8D0feeA4ad"]],["2024-03-13T12:31:35.000Z",["0x31a20f10c846BD3Ed41c6c05c340bFD7A57ECADA"]],["2024-03-15T01:29:11.000Z",["0xE3641CbDAc5477C350c8FeAAF52Ddc021451A2aA"]],["2024-03-26T06:51:23.000Z",["0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"]],["2024-05-21T00:55:23.000Z",["0x3636617973f25a512676cb06876f0C885568664a"]],["2024-05-22T00:09:11.000Z",["0x0210AE8703F8c9A88D7050825bd8001E359CB4BA"]],["2024-05-22T02:17:11.000Z",["0x270f25127D7C48c956459e113aa81615CC30AeE2"]],["2024-06-22T21:24:59.000Z",["0xEEe82E92bA40A694409B4BDa3D7426188c61163e"]],["2024-07-22T20:12:59.000Z",["0x23559eB4Ad22c31940a929958B104821126F35b7"]],["2024-08-06T21:07:23.000Z",["0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"]],["2024-09-26T17:41:47.000Z",["0x21D3921B50617BDef223207118950B0b577e4007"]]]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]]]
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]],["2024-06-27T16:39:47.000Z",["0x122B88885F1f365B69CAd38B167B039fEd0Ba096"]]]
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]]]
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T03:06:35.000Z",["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]]]
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]]]
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]],["2024-05-03T15:22:59.000Z",["0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"]],["2024-05-08T00:06:47.000Z",["0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"]]]
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T03:06:35.000Z",["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]]]
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x873484Ba63353C8b71210ce123B465512d408B27"]],["2024-06-27T16:39:47.000Z",["0x57411f5BA52531e8199066bC8EC650470A744883"]]]
    }
```

Generated with discovered.json: 0x3b19a1236807f46f2117249263404871458f5451

# Diff at Fri, 27 Sep 2024 15:14:59 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20756734
- current block number: 20842784

## Description

Bridger upgrade: Formatting, libraries, removal of a USDM curve pool slot and Solv SFT wrapper.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$implementation:
-        "0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"
+        "0x21D3921B50617BDef223207118950B0b577e4007"
      values.$upgradeCount:
-        10
+        11
      values.SOLV_SFT_WRAP_ROUTER:
-        "0x6Ea88D4D0c4bC06F6A51f427eF295c93e10D0b36"
+        "0xe9eD7530427Cb41A56C9e004e00e074cCc168C44"
      values.usdmCurvePool:
-        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../{.flat@20756734 => .flat}/Bridger/Bridger.sol  | 1909 +++-----------------
 1 file changed, 228 insertions(+), 1681 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20756734 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xe37f1f654e8ff1efaa734238d523de5b48be6763

# Diff at Sun, 15 Sep 2024 14:53:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20654590
- current block number: 20756734

## Description

One validator added (funded by kintoxyz.eth), one BridgerOwnerMultisig signer removed.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.setValidatorCount:
-        1
+        2
      values.validators.1:
+        "0x944eB0a2829A859959586b10D54229278534a696"
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.$members.5:
-        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
      values.$members.4:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
      values.$members.3:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.2:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.$members.1:
-        "0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x6b0d48950c5ffab4b06009b6671f2315fd96d1b6

# Diff at Sun, 01 Sep 2024 08:42:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20484220
- current block number: 20654590

## Description

Using new wasmModuleRoot mapping.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xeb81ebff50359a2acec8320c194a837f9672e694

# Diff at Fri, 30 Aug 2024 07:53:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      receivedPermissions.8.via:
-        []
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
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x1496ad7673a5d3547a95cfdeba4706a84444cf4a

# Diff at Fri, 23 Aug 2024 09:52:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$upgradeCount:
+        10
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xeaa6de643e6af66cd4217f876215b1d79da67240

# Diff at Wed, 21 Aug 2024 10:03:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82","via":[]}]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","0x655761AD5FC251F414D6993A73184B0669F278c8","0x7870D5398DB488c669B406fBE57b8d05b6A35e42","0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","via":[]},{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[]},{"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","via":[]},{"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8","via":[]},{"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42","via":[]},{"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","via":[]},{"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","via":[]},{"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","via":[]},{"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0f1b7bd7762662B23486320AA91F30312184f70C"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0f1b7bd7762662B23486320AA91F30312184f70C","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

Generated with discovered.json: 0x5fd3c00bb4357b64ecd40c9e374080c1d9ce1921

# Diff at Fri, 09 Aug 2024 11:59:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      assignedPermissions.upgrade.7:
-        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
+        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      assignedPermissions.upgrade.6:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      assignedPermissions.upgrade.5:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      assignedPermissions.upgrade.4:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
+        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      assignedPermissions.upgrade.2:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      assignedPermissions.upgrade.1:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      assignedPermissions.upgrade.0:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
    }
```

Generated with discovered.json: 0x109d4e2634a7d8f01619e5caf084ca35e1c2640c

# Diff at Fri, 09 Aug 2024 10:09:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"]
      assignedPermissions.upgrade:
+        ["0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"]
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","0x655761AD5FC251F414D6993A73184B0669F278c8","0x7870D5398DB488c669B406fBE57b8d05b6A35e42","0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"]
      assignedPermissions.upgrade:
+        ["0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","0x7870D5398DB488c669B406fBE57b8d05b6A35e42","0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","0x655761AD5FC251F414D6993A73184B0669F278c8","0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"]
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0f1b7bd7762662B23486320AA91F30312184f70C"]
      assignedPermissions.upgrade:
+        ["0x0f1b7bd7762662B23486320AA91F30312184f70C"]
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0x5D973Ea995d14799E528B14472346bfDE21eAe2e","0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x94561e98DD5E55271f91A103e4979aa6C493745E","0xc31C4549356d46c37021393EeEb6f704B38061eC"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x5D973Ea995d14799E528B14472346bfDE21eAe2e","0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x94561e98DD5E55271f91A103e4979aa6C493745E","0xc31C4549356d46c37021393EeEb6f704B38061eC"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x5358410234a44c12d83a38d894732c1ce46d329c

# Diff at Thu, 08 Aug 2024 13:39:47 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@55033526285d11b30f44e7cea5874c4f4d65ed80 block: 20383066
- current block number: 20484220

## Description

Users can deposit stUSD from Arbitrum on Kinto, they've added new logic to swap this to USDC or USDA before bridging.
Now using 0x AllowanceHolder contract to set allowances for token swap.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$implementation:
-        "0x23559eB4Ad22c31940a929958B104821126F35b7"
+        "0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"
      values.swapRouter:
-        "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"
+        "0x0000000000001fF3684f28c67538d4D072C22734"
      values.angleSwapper:
+        "0xD253b62108d1831aEd298Fc2434A5A8e4E418053"
      values.stUSD:
+        "0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776"
      values.USDA:
+        "0x0000206329b97DB379d5E1Bf586BbDB969C63274"
    }
```

## Source code changes

```diff
.../{.flat@20383066 => .flat}/Bridger/Bridger.sol  | 31 ++++++++++++++++++++--
 1 file changed, 29 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x21d17cece14cfa4ac60bf5716ed635ed9071d73c

# Diff at Tue, 30 Jul 2024 11:12:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20383066
- current block number: 20383066

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20383066 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xa42788482c8e1ace73e574337062d675b58d5479

# Diff at Thu, 25 Jul 2024 10:48:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@42efd1ab55ccb369bfc0edad188854abb104aaef block: 20367973
- current block number: 20383066

## Description

Kinto sends blobs, tracked txs added.

## Watched changes

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.postsBlobs:
-        false
+        true
    }
```

Generated with discovered.json: 0x9590eb8caf62006f1a01c0e27a62734ce8c11f6c

# Diff at Tue, 23 Jul 2024 08:16:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a7fe674fdf7aafe1f69f1463836cac0d7e337d34 block: 20362833
- current block number: 20367973

## Description

The bridger (gateway) is upgraded to support a new asset (solvBTC) which can be wrapped from WBTC.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$implementation:
-        "0xEEe82E92bA40A694409B4BDa3D7426188c61163e"
+        "0x23559eB4Ad22c31940a929958B104821126F35b7"
      values.SOLV_BTC:
+        "0x3647c54c4c2C65bC7a2D63c0Da2809B399DBBDC0"
      values.SOLV_BTC_POOL_ID:
+        "0x488def4a346b409d5d57985a160cd216d29d4f555e1b716df4e04e2374d2d9f6"
      values.SOLV_SFT_WRAP_ROUTER:
+        "0x6Ea88D4D0c4bC06F6A51f427eF295c93e10D0b36"
      values.WBTC:
+        "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
    }
```

## Source code changes

```diff
.../{.flat@20362833 => .flat}/Bridger/Bridger.sol  | 54 +++++++++++++++++-----
 1 file changed, 42 insertions(+), 12 deletions(-)
```

Generated with discovered.json: 0x87c5c2e00532cf5609ebd2a87ccf20e1d7afef8c

# Diff at Fri, 19 Jul 2024 08:55:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e818aac724e8e67da6b05262134684a79d6fb217 block: 20324731
- current block number: 20339515

## Description

wasmModuleRoot updated. Like before, this is not a root that we have seen before. Related to the [HF 5 Mainnet](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/6) and [HF 6 Mainnet](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/9).

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x89e305433a6403ac5e73b659b16ccaa2ed796cf6cd6fcb46e72c7d865a8ec6ae"
+        "0x2ca63ffd73f314d60f8d672954389881918100435f27fd4193becb12310d7faa"
    }
```

Generated with discovered.json: 0xf35de91de6d8a18812a6d9c106abeff0880f2aef

# Diff at Wed, 17 Jul 2024 07:24:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f46e1b9319335587ca32b6e85f9d2f0c7ab7a729 block: 20210980
- current block number: 20324731

## Description

Use the new handler to check if it's posting blobs.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20210980 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.postsBlobs:
+        false
    }
```

Generated with discovered.json: 0xbb4b529ff5b280dc70aa4cf09e5651f5f00363fb

# Diff at Mon, 01 Jul 2024 10:10:33 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@0e7b6918e773793a1ad0061ea07b42646c37a13d block: 20177353
- current block number: 20210980

## Description

ChallengeManager.sol: added function to make challengeManager aware of the new OneStepProver contracts after updating to 4844.

OneStepProverHostIo.sol: added support for reading preimage from blobs.

SequencerInbox.sol: Added support for blobs posting (addSequencerL2BatchFromBlobs), and a for a batch poster manager that has the ability to change the batch poster addresses.

It is not posting data to blobs yet.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x6948185c62070f9523a93664e8d064627f65830fd308af5e82f21292a2060fb8"
+        "0x89e305433a6403ac5e73b659b16ccaa2ed796cf6cd6fcb46e72c7d865a8ec6ae"
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      upgradeability.implementation:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x122B88885F1f365B69CAd38B167B039fEd0Ba096"
      implementations.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x122B88885F1f365B69CAd38B167B039fEd0Ba096"
      values.osp:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x8B02a8B985a81f96e49B8289FF60847FC6020e51"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      upgradeability.implementation:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x57411f5BA52531e8199066bC8EC650470A744883"
      implementations.0:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x57411f5BA52531e8199066bC8EC650470A744883"
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
+        "0x434345973Ebf8249398E1EeB03A62bE418B48a05"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
+   Status: CREATED
    contract  (0x434345973Ebf8249398E1EeB03A62bE418B48a05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x6c4322e9A0478CA7aDd30e561f96af379D3A22Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x76f72B8eFDA2DCDD3fB5A8c16d576c25eD43D645)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x8B02a8B985a81f96e49B8289FF60847FC6020e51)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xba9D43FA3576bc40f13cb0731D770d1e510EdE46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf09Bc0285055BEA82165cA3F54054aa88BB3C169)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

Generated with discovered.json: 0xd28981bbb340b8d7f4a0a3cc529555b09df580e4

# Diff at Mon, 24 Jun 2024 08:19:51 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b54e27671cccd831f2f6414fffe3bd374840c6b7 block: 19976230
- current block number: 20160306

## Description

The Bridger (Gateway) contract is upgraded to support new assets (USDM) and deposit by PERMIT2 (`depositPermit2()` function). USDM is now also a supported finalAsset (outcoming asset) for swapping through the Bridger.

The Socket escrow for USDM is not yet used and will be added as soon as it has TVL.



## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.implementation:
-        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
+        "0xEEe82E92bA40A694409B4BDa3D7426188c61163e"
      implementations.0:
-        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
+        "0xEEe82E92bA40A694409B4BDa3D7426188c61163e"
      values.l2Vault:
-        "0x26181Dfc530d96523350e895180b09BAf3d816a0"
      values.PERMIT2:
+        "0x000000000022D473030F116dDEE9F6B43aC78BA3"
      values.USDC:
+        "0x0000000000000000000000000000000000000000"
      values.USDM:
+        "0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C"
      values.usdmCurvePool:
+        "0x0000000000000000000000000000000000000000"
      values.wUSDM:
+        "0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812"
    }
```

## Source code changes

```diff
.../{.flat@19976230 => .flat}/Bridger/Bridger.sol  | 439 +++++++++++++++++----
 1 file changed, 359 insertions(+), 80 deletions(-)
```

Generated with discovered.json: 0x8ab0d2106a1286e919f74644647a18bfdb886090

# Diff at Wed, 29 May 2024 14:51:45 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19929993
- current block number: 19976230

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19929993 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

Generated with discovered.json: 0x5bb6fb6f0a3145d9c836665d91d5d854ec30ae16

# Diff at Wed, 22 May 2024 15:45:03 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d8b1d401a7eb2fd4dbc2edda92ae733061915c30 block: 19919191
- current block number: 19926394

## Description

The Bridger is upgraded to a new implementation. Currently there are no funds in it as the prelaunch-farm (Engen) has concluded and assets were [bridged](https://etherscan.io/tx/0xbbdbbf2f7ddd1ac994d9a96b2da163e72339866dee3dbac7004fe4a64ee26f92) via socket to the Kinto L2.

### Bridger.sol

The logic of the Bridger is still a Gateway contract to the Kinto L2. As the prelaunch phase has concluded, ERC-20 tokens can now be deposited to the Bridger and are bridged directly to the L2, so the Bridger will not escrow assets anymore. It also now uses a 0x exchange proxy to swap into 'final assets' before depositing. Final assets for Kinto can be defined by the depositer and can also be the inputAsset, in which case no swap is performed and the asset is bridged directly. The bridge address is supplied with the call to `depositERC20()`.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.implementation:
-        "0x3636617973f25a512676cb06876f0C885568664a"
+        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
      implementations.0:
-        "0x3636617973f25a512676cb06876f0C885568664a"
+        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
      values.exchangeProxy:
-        "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"
      values.sDAI:
-        "0x83F20F44975D03b1b09e64809B757c47f942BEeA"
      values.swapsEnabled:
-        true
      values.weETH:
-        "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee"
      values.swapRouter:
+        "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"
    }
```

```diff
-   Status: DELETED
    contract ZeroEx (0xDef1C0ded9bec7F1a1670819833240f027b25EfF)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@19919191 => .flat}/Bridger/Bridger.sol  | 1090 ++++++++++----------
 .../.flat@19919191/ZeroEx.sol => /dev/null         |  729 -------------
 2 files changed, 532 insertions(+), 1287 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19919191 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract ZeroEx (0xDef1C0ded9bec7F1a1670819833240f027b25EfF)
    +++ description: None
```

Generated with discovered.json: 0x1db08e3c132170b88ae88bdd175985aafd322d25

# Diff at Tue, 21 May 2024 15:32:00 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d10db8000986dcc20fb2efb94c0e0636ac38fa21 block: 19888796
- current block number: 19919191

## Description

The Bridger contract (pre-launch escrow for Kinto) is upgraded: The hardcoded orbitstack-native bridges are removed and the bridgeDeposits() function is modified to allow bridging via arbitrary bridges. Kinto will use socket as an external bridge for their L2 and the assets currently locked in the Bridger contract.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.implementation:
-        "0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"
+        "0x3636617973f25a512676cb06876f0C885568664a"
      implementations.0:
-        "0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"
+        "0x3636617973f25a512676cb06876f0C885568664a"
      values.L1GatewayRouter:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      values.standardGateway:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      derivedName:
-        "BridgerV4"
+        "Bridger"
    }
```

## Source code changes

```diff
.../BridgerV4.sol => .flat/Bridger/Bridger.sol}    | 5518 ++++++++++----------
 1 file changed, 2757 insertions(+), 2761 deletions(-)
```

Generated with discovered.json: 0x76f1e50a00a33e6f1eb3cc4ddf6d1768e457194b

# Diff at Fri, 17 May 2024 09:28:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cf6498d339a075296e717008e17a69561c236726 block: 19883606
- current block number: 19888796

## Description

The wasmModuleRoot changes to a new value (which is not known in our ArbOS history). Looking at the Kinto Github repo, this is the [Hardfork #4 upgrade](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/4).
Changes are mainly related to the integration of the Socket bridge contracts in preparation for the May 22nd 'full mainnet launch'.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf456393bd4b205d2f7b147d355c42ba852ff31527380884720bb4059ae731169"
+        "0x6948185c62070f9523a93664e8d064627f65830fd308af5e82f21292a2060fb8"
    }
```

Generated with discovered.json: 0xd5b099929f8b81f2ec7e02982922564807216015

# Diff at Thu, 16 May 2024 06:39:47 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@814c482c2be2428b2782bc85afecccac8c999b5e block: 19830808
- current block number: 19880804

## Description

New signer added to the ExecutorMultisig (Rollup owner): `0x08E674c4538caE03B6c05405881dDCd95DcaF5a8`

## Watched changes

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 4 (75%)"
+        "3 of 5 (60%)"
      values.getOwners.4:
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.getOwners.3:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.getOwners.2:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.getOwners.1:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.getOwners.0:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
    }
```

Generated with discovered.json: 0x7b73332ba44977745e2bfdaabbe0a1aaf9f426ed

# Diff at Thu, 09 May 2024 06:51:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3bba0812727b9105a3f44fe55a68572c804b992 block: 19809397
- current block number: 19830808

## Description

The Inbox contract is upgraded with a minor change:

The l2AllowList that gets checked by the `whenRefundAddressAllowed` modifier is now settable by the owner or rollup contract whereas it was hardcoded before.

## Watched changes

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      upgradeability.implementation:
-        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
+        "0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"
      implementations.0:
-        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
+        "0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"
    }
```

## Source code changes

```diff
.../Inbox/implementation/meta.txt                       |  2 +-
 .../src/nitro-contracts/bridge/AbsInbox.sol             | 17 +++++++++--------
 .../implementation/src/nitro-contracts/bridge/Inbox.sol |  1 -
 3 files changed, 10 insertions(+), 10 deletions(-)
```

Generated with discovered.json: 0x94bafe549ae45883fd41860a1577ce9a7ed8a42c

# Diff at Mon, 06 May 2024 06:56:42 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@91ddfe46c9a8cff7aff522924d50fd166a15932b block: 19776768
- current block number: 19809397

## Description

The Inbox implementation is upgraded with very minor changes:
- Modifier `whenRefundAddressAllowed` added (ensures that both `excessFeeRefundAddress` and `callValueRefundAddress` match the msg.sender unless they are whitelisted in `isAllowed`)
- `whenRefundAddressAllowed` is used by `createRetryableTicket()` and `createUnsafeRetryableTicket()`
- Formatting and import folder structure

## Watched changes

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      upgradeability.implementation:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
      implementations.0:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
    }
```

## Source code changes

```diff
.../proxy/utils/Initializable.sol => /dev/null     |  80 ------
 .../lib/nitro-contracts}/src/bridge/IBridge.sol    |  22 ++
 .../src/bridge/IDelayedMessageProvider.sol         |   0
 .../lib/nitro-contracts}/src/bridge/IEthBridge.sol |   0
 .../lib/nitro-contracts}/src/bridge/IInbox.sol     |   0
 .../lib/nitro-contracts}/src/bridge/IInboxBase.sol |   0
 .../lib/nitro-contracts}/src/bridge/IOwnable.sol   |   0
 .../src/bridge/ISequencerInbox.sol                 |  91 +++++--
 .../src/libraries/AddressAliasHelper.sol           |   0
 .../src/libraries/DelegateCallAware.sol            |   0
 .../lib/nitro-contracts}/src/libraries/Error.sol   |  27 +-
 .../nitro-contracts/src/libraries/IGasRefunder.sol |  14 +
 .../src/libraries/MessageTypes.sol                 |   0
 .../nitro-contracts}/src/precompiles/ArbSys.sol    |   0
 .../contracts/proxy/utils/Initializable.sol        | 166 ++++++++++++
 .../contracts}/security/PausableUpgradeable.sol    |  34 ++-
 .../contracts}/utils/AddressUpgradeable.sol        |  74 ++++--
 .../contracts}/utils/ContextUpgradeable.sol        |   0
 .../contracts}/utils/StorageSlotUpgradeable.sol    |  60 ++++-
 .../Inbox/implementation/meta.txt                  |   2 +-
 .../src/libraries/IGasRefunder.sol => /dev/null    |  39 ---
 .../src/nitro-contracts}/bridge/AbsInbox.sol       | 199 +++++++--------
 .../src/nitro-contracts}/bridge/Inbox.sol          | 281 ++++++++++-----------
 23 files changed, 651 insertions(+), 438 deletions(-)
```

Generated with discovered.json: 0x4c11e99e03b2ae08fd367a9e6d1d673f2cfe3fff

# Diff at Wed, 01 May 2024 17:27:29 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7dc564dd4cc2215657e1e7bd8648e6b99a23a992 block: 19624549
- current block number: 19776768

## Description

One signer of the BridgerOwnerMultisig is replaced.

## Watched changes

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.getOwners.2:
-        "0xA20684BE1d0f5Ef96F8771A747fe5861D3F0FA07"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
    }
```

Generated with discovered.json: 0x68af6aeb80b2dc820bf7190868730a2f8750fb79

# Diff at Wed, 03 Apr 2024 14:05:05 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@66b605e31075e304396e566f31130e883d656762 block: 19531637
- current block number: 19575719

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: None
      values.wasmModuleRoot:
-        "0xd2d42f1e7b5ea262991c3fd1fc7ed3dde4b21c28d3a7edec49f7c4fb51c03f73"
+        "0xf456393bd4b205d2f7b147d355c42ba852ff31527380884720bb4059ae731169"
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.nonce:
-        70
+        71
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531637 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "ExecutorMultisig"
      values.nonce:
-        3
    }
```

```diff
+   Status: CREATED
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82)
    +++ description: None
```

Generated with discovered.json: 0x53029a74a02a35a658c77a12c8fb1aed6b7fee64

# Diff at Thu, 28 Mar 2024 09:12:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19432708
- current block number: 19531637

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19432708 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x2a8f9804aa4d0e1c2654291b4dc0c829b5c12d40

# Diff at Thu, 14 Mar 2024 10:39:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@24c5721630392f8b6f59093376472db03d18b2c2 block: 19339792
- current block number: 19432708

## Description

Upgrade: Changed WASM module root hash of the RollupProxy contract.
Context: Kinto is currently in review.

## Watched changes

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.nonce:
-        2
+        3
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: None
      values.wasmModuleRoot:
-        "0x1024d5971f781dd930c46b5fb6fb571e6af9f31b5dc191b82e82036c207cc968"
+        "0xd2d42f1e7b5ea262991c3fd1fc7ed3dde4b21c28d3a7edec49f7c4fb51c03f73"
    }
```

Generated with discovered.json: 0x6bf630000a540615c26b6e131a88c1214fde842c

# Diff at Fri, 01 Mar 2024 10:41:16 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19339792

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    }
```
