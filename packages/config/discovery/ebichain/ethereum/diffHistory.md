Generated with discovered.json: 0x4d71f6c286584f9defb4a0b8d447217f379b036d

# Diff at Thu, 06 Mar 2025 09:38:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21637075
- current block number: 21637075

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f","0x191738BDecD7f73a79F64D689cf91ef873fb4172"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x487a8f7e7487d62013a513e9e362828b8259147b

# Diff at Tue, 04 Mar 2025 10:39:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21637075
- current block number: 21637075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0D51c6664A773873971336850C51A5caE8e63e89) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        19683918
    }
```

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432744
    }
```

```diff
    contract RollupEventInbox (0x191738BDecD7f73a79F64D689cf91ef873fb4172) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        19683918
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
    contract ProxyAdmin (0x3b7F26ED562e21277c86ea0Ce40BC914653a3555) {
    +++ description: None
      sinceBlock:
+        19683918
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432745
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432741
    }
```

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        19683918
    }
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432742
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432743
    }
```

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        19683918
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        19683918
    }
```

```diff
    contract Inbox (0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        19683918
    }
```

```diff
    contract Outbox (0xf2dC65BdDb21c5DCC070067434D34a342907b5aE) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        19683918
    }
```

```diff
    contract ChallengeManager (0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        19683918
    }
```

Generated with discovered.json: 0x8d22a9c7ca948e89fef095c62950c3748e74e287

# Diff at Fri, 21 Feb 2025 14:06:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21637075
- current block number: 21637075

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0D51c6664A773873971336850C51A5caE8e63e89) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract Inbox (0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract Outbox (0xf2dC65BdDb21c5DCC070067434D34a342907b5aE) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x3129847104d40cd156778118c54f2956aa6a488f

# Diff at Thu, 20 Feb 2025 12:20:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 21637075
- current block number: 21637075

## Description

Config related: Bold templates added

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x9e8b243e2b7b2b7cf996ce5d4dbec3082d769845

# Diff at Tue, 04 Feb 2025 12:30:58 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637075
- current block number: 21637075

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xfe1395ab4950b62d46064a847af3dde4e7d707c7

# Diff at Mon, 20 Jan 2025 11:09:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637075
- current block number: 21637075

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637075 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0D51c6664A773873971336850C51A5caE8e63e89) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x11AaeeDd19D4daf99925231b982CA0A35F77d812"
      issuedPermissions.0.to:
+        "0x11AaeeDd19D4daf99925231b982CA0A35F77d812"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract RollupEventInbox (0x191738BDecD7f73a79F64D689cf91ef873fb4172) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract ProxyAdmin (0x3b7F26ED562e21277c86ea0Ce40BC914653a3555) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
      directlyReceivedPermissions.6.from:
+        "0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
      directlyReceivedPermissions.5.target:
-        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      directlyReceivedPermissions.5.from:
+        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      directlyReceivedPermissions.4.target:
-        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      directlyReceivedPermissions.4.from:
+        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      directlyReceivedPermissions.3.target:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      directlyReceivedPermissions.3.from:
+        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      directlyReceivedPermissions.2.target:
-        "0x73CF739b0233027cd516998e177d473D0a45E037"
      directlyReceivedPermissions.2.from:
+        "0x73CF739b0233027cd516998e177d473D0a45E037"
      directlyReceivedPermissions.1.target:
-        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      directlyReceivedPermissions.1.from:
+        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      directlyReceivedPermissions.0.target:
-        "0x0D51c6664A773873971336850C51A5caE8e63e89"
      directlyReceivedPermissions.0.from:
+        "0x0D51c6664A773873971336850C51A5caE8e63e89"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
      receivedPermissions.8.from:
+        "0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81"
      receivedPermissions.7.target:
-        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      receivedPermissions.7.from:
+        "0xf2dC65BdDb21c5DCC070067434D34a342907b5aE"
      receivedPermissions.6.target:
-        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      receivedPermissions.6.from:
+        "0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f"
      receivedPermissions.5.target:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.5.from:
+        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      receivedPermissions.4.target:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      receivedPermissions.4.from:
+        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      receivedPermissions.3.target:
-        "0x73CF739b0233027cd516998e177d473D0a45E037"
      receivedPermissions.3.from:
+        "0x73CF739b0233027cd516998e177d473D0a45E037"
      receivedPermissions.2.target:
-        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      receivedPermissions.2.from:
+        "0x191738BDecD7f73a79F64D689cf91ef873fb4172"
      receivedPermissions.1.target:
-        "0x0D51c6664A773873971336850C51A5caE8e63e89"
      receivedPermissions.1.from:
+        "0x0D51c6664A773873971336850C51A5caE8e63e89"
      receivedPermissions.0.target:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      receivedPermissions.0.from:
+        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      directlyReceivedPermissions.0.target:
-        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
      directlyReceivedPermissions.0.from:
+        "0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C"
    }
```

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x101d02006885979D2F32284c5847dF8616C24436"
      issuedPermissions.2.to:
+        "0x101d02006885979D2F32284c5847dF8616C24436"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      directlyReceivedPermissions.2.target:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      directlyReceivedPermissions.2.from:
+        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      directlyReceivedPermissions.1.target:
-        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      directlyReceivedPermissions.1.from:
+        "0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90"
      directlyReceivedPermissions.0.target:
-        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
      directlyReceivedPermissions.0.from:
+        "0x3b7F26ED562e21277c86ea0Ce40BC914653a3555"
    }
```

```diff
    contract Inbox (0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract Outbox (0xf2dC65BdDb21c5DCC070067434D34a342907b5aE) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract ChallengeManager (0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

Generated with discovered.json: 0xbdd7b780393272d48ae7ccdc1669ebf6f3e3a75a

# Diff at Thu, 16 Jan 2025 12:34:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21465150
- current block number: 21637075

## Description

ConduitMultisig signer changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.8:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.7:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.3:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.2:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.1:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x9f379face9012161867791d7119cb664b0fec1e9

# Diff at Wed, 08 Jan 2025 10:44:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465150
- current block number: 21465150

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465150 (main branch discovery), not current.

```diff
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x8c7d1779cfd9a671fb707d7b91d5aba79b61e164

# Diff at Mon, 23 Dec 2024 12:22:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21335967
- current block number: 21465150

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21335967 (main branch discovery), not current.

```diff
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x89adeb7ae8ea1d5645a2889bcc63f6c0170cec74

# Diff at Fri, 06 Dec 2024 08:09:41 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- current block number: 21335967

## Description

Initial discovery of a standard orbit stack Optimium.

## Initial discovery

```diff
+   Status: CREATED
    contract SequencerInbox (0x0D51c6664A773873971336850C51A5caE8e63e89)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x191738BDecD7f73a79F64D689cf91ef873fb4172)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3b7F26ED562e21277c86ea0Ce40BC914653a3555)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0x73CF739b0233027cd516998e177d473D0a45E037)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (0xaA9904D4d4261dc0f927306f3f5c74439eBa0b90)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xe3826907ed4f0A4F3D05d6CF5B0B8dCde91d6e0C)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract Inbox (0xeb8307Fc8c1bEe7DfDCedf7e8c85778a81CB150f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Outbox (0xf2dC65BdDb21c5DCC070067434D34a342907b5aE)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xf39A1d1Bf489bA959ca6A0e6Fa4A1887Fe526c81)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```
