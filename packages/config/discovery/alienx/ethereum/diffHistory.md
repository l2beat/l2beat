Generated with discovered.json: 0x7fbb28ab4b4291ebdfef008bcab78a8fe53dd5f3

# Diff at Thu, 06 Mar 2025 09:38:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21465135
- current block number: 21465135

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465135 (main branch discovery), not current.

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1","0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x7651e5a0475d34ff2ee5700b1d9e1c2eb0f1fa4d

# Diff at Tue, 04 Mar 2025 10:38:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21465135
- current block number: 21465135

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465135 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        20028914
    }
```

```diff
    contract ProxyAdmin (0x123C1E324BC742295B4278B41C4E33831C77655C) {
    +++ description: None
      sinceBlock:
+        20028914
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
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        20028914
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
    contract AlienXMultisig (0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27) {
    +++ description: None
      sinceBlock:
+        20036681
    }
```

```diff
    contract ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        20028916
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
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        20028914
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        20028914
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
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        20028914
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
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        20028914
    }
```

```diff
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        20028914
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        20028914
    }
```

```diff
    contract GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        20028916
    }
```

Generated with discovered.json: 0x9b97c03827de8ddcabd05478e0aea2618e16c848

# Diff at Thu, 27 Feb 2025 11:45:12 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21465135
- current block number: 21465135

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465135 (main branch discovery), not current.

```diff
    contract ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1ERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1GatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

Generated with discovered.json: 0x91b78c17d717392f16fb81091d298a056775a922

# Diff at Fri, 21 Feb 2025 14:04:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21465135
- current block number: 21465135

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465135 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

Generated with discovered.json: 0x086737256a3c543221ff2d98989115e9c33cea75

# Diff at Thu, 20 Feb 2025 12:20:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 21465135
- current block number: 21465135

## Description

Config related: Bold templates added

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465135 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x8d786771598541f7e9b6f3076895712983866dbd

# Diff at Tue, 04 Feb 2025 12:30:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21465135
- current block number: 21465135

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465135 (main branch discovery), not current.

```diff
    contract AlienXMultisig (0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xe4a3433ee5790a3f78bc672c9613264276147bc4

# Diff at Mon, 20 Jan 2025 11:09:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21465135
- current block number: 21465135

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465135 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
    }
```

```diff
    contract ProxyAdmin (0x123C1E324BC742295B4278B41C4E33831C77655C) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49"
      directlyReceivedPermissions.8.from:
+        "0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49"
      directlyReceivedPermissions.7.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      directlyReceivedPermissions.7.from:
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      directlyReceivedPermissions.6.target:
-        "0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b"
      directlyReceivedPermissions.6.from:
+        "0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b"
      directlyReceivedPermissions.5.target:
-        "0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6"
      directlyReceivedPermissions.5.from:
+        "0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6"
      directlyReceivedPermissions.4.target:
-        "0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1"
      directlyReceivedPermissions.4.from:
+        "0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1"
      directlyReceivedPermissions.3.target:
-        "0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c"
      directlyReceivedPermissions.3.from:
+        "0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c"
      directlyReceivedPermissions.2.target:
-        "0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D"
      directlyReceivedPermissions.2.from:
+        "0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D"
      directlyReceivedPermissions.1.target:
-        "0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3"
      directlyReceivedPermissions.1.from:
+        "0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3"
      directlyReceivedPermissions.0.target:
-        "0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"
      directlyReceivedPermissions.0.from:
+        "0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"
    }
```

```diff
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
    }
```

```diff
    contract AlienXMultisig (0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49"
      receivedPermissions.10.from:
+        "0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49"
      receivedPermissions.9.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      receivedPermissions.9.from:
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      receivedPermissions.8.target:
-        "0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b"
      receivedPermissions.8.from:
+        "0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b"
      receivedPermissions.7.target:
-        "0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6"
      receivedPermissions.7.from:
+        "0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6"
      receivedPermissions.6.target:
-        "0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1"
      receivedPermissions.6.from:
+        "0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1"
      receivedPermissions.5.target:
-        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
      receivedPermissions.5.from:
+        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
      receivedPermissions.4.target:
-        "0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c"
      receivedPermissions.4.from:
+        "0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c"
      receivedPermissions.3.target:
-        "0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D"
      receivedPermissions.3.from:
+        "0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D"
      receivedPermissions.2.target:
-        "0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3"
      receivedPermissions.2.from:
+        "0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3"
      receivedPermissions.1.target:
-        "0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"
      receivedPermissions.1.from:
+        "0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"
      receivedPermissions.0.target:
-        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
      receivedPermissions.0.from:
+        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
      directlyReceivedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      directlyReceivedPermissions.0.from:
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
    }
```

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x32AD06477129F4470294Fbaf11C0FC682d92E4A3"
      issuedPermissions.2.to:
+        "0x32AD06477129F4470294Fbaf11C0FC682d92E4A3"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.target:
-        "0xff309E0c74874a3efeAAff630A818fd9c6DE4f25"
      issuedPermissions.0.to:
+        "0xff309E0c74874a3efeAAff630A818fd9c6DE4f25"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      directlyReceivedPermissions.2.target:
-        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
      directlyReceivedPermissions.2.from:
+        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
      directlyReceivedPermissions.1.target:
-        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
      directlyReceivedPermissions.1.from:
+        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
      directlyReceivedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
      directlyReceivedPermissions.0.from:
+        "0x123C1E324BC742295B4278B41C4E33831C77655C"
    }
```

```diff
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
    }
```

Generated with discovered.json: 0x7ad67885b326ac9f6163bda5d1d64f6d78493e3e

# Diff at Wed, 08 Jan 2025 10:44:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465135
- current block number: 21465135

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465135 (main branch discovery), not current.

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xfb5ec7e4841c0e9b2cc72edbbd3b45d1f3a5eab1

# Diff at Mon, 23 Dec 2024 12:18:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21292097
- current block number: 21465135

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292097 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x6bae4aab0fd04073bc6f6e9e1e613a366b3bbaec

# Diff at Fri, 06 Dec 2024 08:09:25 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21292097
- current block number: 21292097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292097 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xd5060eddd4a8ea1e2f91ce5e55da27357e2c48af

# Diff at Fri, 29 Nov 2024 11:28:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21292097
- current block number: 21292097

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292097 (main branch discovery), not current.

```diff
    contract AlienXMultisig (0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xb4c6543a3afefe90d395a5aed1b62c6bd9a9cb87

# Diff at Fri, 15 Nov 2024 08:18:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21092323
- current block number: 21092323

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21092323 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27","via":[{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","delay":0}]}
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
-        "0x32AD06477129F4470294Fbaf11C0FC682d92E4A3"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.0:
+        {"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      template:
+        "orbitstack/GatewayRouter"
      displayName:
+        "GatewayRouter"
      description:
+        "This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging."
    }
```

Generated with discovered.json: 0x71025f01e4c383d230c5fae81e7fcb4d1cf17314

# Diff at Mon, 04 Nov 2024 07:52:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21092323
- current block number: 21092323

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21092323 (main branch discovery), not current.

```diff
    contract AlienXMultisig (0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]}
      receivedPermissions.9.target:
-        "0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      receivedPermissions.8.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b"
      receivedPermissions.7.target:
-        "0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b"
+        "0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6"
      receivedPermissions.6.target:
-        "0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6"
+        "0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1"
      receivedPermissions.5.target:
-        "0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1"
+        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
      receivedPermissions.5.via.1:
-        {"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}
      receivedPermissions.5.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      receivedPermissions.4.target:
-        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
+        "0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c"
      receivedPermissions.4.via.1:
+        {"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}
      receivedPermissions.4.via.0.address:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x123C1E324BC742295B4278B41C4E33831C77655C"
      receivedPermissions.3.target:
-        "0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c"
+        "0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D"
      receivedPermissions.2.target:
-        "0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D"
+        "0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3"
      receivedPermissions.1.target:
-        "0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3"
+        "0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"
+        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
      receivedPermissions.0.via.1:
-        {"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}
      receivedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D) {
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
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27","via":[{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
+        "0x32AD06477129F4470294Fbaf11C0FC682d92E4A3"
      issuedPermissions.2.via.0:
-        {"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0x32AD06477129F4470294Fbaf11C0FC682d92E4A3"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.1.via.0:
+        {"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x6fa8b24c85409A4fcb541c9964766862aA007f39"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xcfc7df214e60980531b8c905d428d75fb426b21a

# Diff at Fri, 01 Nov 2024 10:53:17 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21041821
- current block number: 21092323

## Description

Discovery refresh to apply template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041821 (main branch discovery), not current.

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

Generated with discovered.json: 0x464d01a064eb5d0b56a3f2535fec015193f39308

# Diff at Tue, 29 Oct 2024 13:03:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041821
- current block number: 21041821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041821 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0xfbc923157283cedfa6cf697e0f851d4e9e5fa8c4

# Diff at Tue, 29 Oct 2024 08:00:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041821
- current block number: 21041821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041821 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract AlienXMultisig (0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0x6fa8b24c85409A4fcb541c9964766862aA007f39","via":[{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]},{"permission":"upgrade","target":"0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"},{"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"}]
    }
```

```diff
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.2.via.0:
+        {"address":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","delay":0}
    }
```

```diff
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.1.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0x6fa8b24c85409A4fcb541c9964766862aA007f39"},{"permission":"upgrade","target":"0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]},{"permission":"upgrade","target":"0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x6fa8b24c85409A4fcb541c9964766862aA007f39"}
    }
```

```diff
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"
      issuedPermissions.0.via.1:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
    }
```

Generated with discovered.json: 0xe6b57eac191061745308953dfb0ddad5ef4db053

# Diff at Mon, 28 Oct 2024 14:02:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041821
- current block number: 21041821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041821 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27"]
    }
```

Generated with discovered.json: 0x7c354fa429f1e25edfa1eac091199c855d159e5f

# Diff at Fri, 25 Oct 2024 09:46:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20978034
- current block number: 21041821

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20978034 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x123C1E324BC742295B4278B41C4E33831C77655C) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"},{"permission":"upgrade","target":"0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3"},{"permission":"upgrade","target":"0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D"},{"permission":"upgrade","target":"0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c"},{"permission":"upgrade","target":"0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1"},{"permission":"upgrade","target":"0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6"},{"permission":"upgrade","target":"0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b"},{"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"},{"permission":"upgrade","target":"0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"},{"permission":"upgrade","target":"0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3"},{"permission":"upgrade","target":"0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D"},{"permission":"upgrade","target":"0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c"},{"permission":"upgrade","target":"0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1"},{"permission":"upgrade","target":"0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6"},{"permission":"upgrade","target":"0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b"},{"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"},{"permission":"upgrade","target":"0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49"}]
    }
```

```diff
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.1.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x6fa8b24c85409A4fcb541c9964766862aA007f39"}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3","via":[{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]}
      receivedPermissions.0.target:
-        "0x6fa8b24c85409A4fcb541c9964766862aA007f39"
+        "0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b"
      receivedPermissions.0.via:
+        [{"address":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x123C1E324BC742295B4278B41C4E33831C77655C"}]
    }
```

```diff
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
      issuedPermissions.0.via.0:
+        {"address":"0x123C1E324BC742295B4278B41C4E33831C77655C","delay":0}
    }
```

Generated with discovered.json: 0x7ad7b73adf62efe2a689688e95627fa697620665

# Diff at Wed, 23 Oct 2024 14:35:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20978034
- current block number: 20978034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20978034 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
-   Status: DELETED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4"
+        "0x32AD06477129F4470294Fbaf11C0FC682d92E4A3"
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
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract  (0x7Deda2425eC2d4EA0DF689A78de2fBF002075576)
    +++ description: None
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
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
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

Generated with discovered.json: 0x73484f151cda51a5594d004e178a69a21c972c87

# Diff at Mon, 21 Oct 2024 12:42:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20978034
- current block number: 20978034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20978034 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0xde6c1c418e4bb201a4227a9ce0cd92542eec2c0f

# Diff at Mon, 21 Oct 2024 11:03:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20978034
- current block number: 20978034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20978034 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
      values.$pastUpgrades.0.1:
-        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
      values.$pastUpgrades.0.1:
-        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
+        "0xd7b6177a4e6d17be7a14c12889419d2036c4b7142a0d5c0af2171b3dc32d0e79"
    }
```

```diff
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
      values.$pastUpgrades.0.1:
-        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]
      values.$pastUpgrades.0.1:
-        ["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0x2354475e39b5213a11adcb6975753f0f2ccdf077de37b09e59216b55a2c1fda7"
    }
```

```diff
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
      values.$pastUpgrades.0.1:
-        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
+        "0xd7b6177a4e6d17be7a14c12889419d2036c4b7142a0d5c0af2171b3dc32d0e79"
    }
```

Generated with discovered.json: 0x4b549bcf8a5f614c62b674f27a1457df6be631f1

# Diff at Thu, 17 Oct 2024 07:37:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@af2175400fb2c7ba9b7bb17a24e2dd044854ff56 block: 20978034
- current block number: 20978034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20978034 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x32AD06477129F4470294Fbaf11C0FC682d92E4A3","via":[]}
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x123C1E324BC742295B4278B41C4E33831C77655C","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xff309E0c74874a3efeAAff630A818fd9c6DE4f25"
    }
```

Generated with discovered.json: 0x3ae97e6a18d9914764bc738786a89e8a01a0a902

# Diff at Wed, 16 Oct 2024 12:11:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20978034

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x123C1E324BC742295B4278B41C4E33831C77655C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AlienXMultisig (0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7Deda2425eC2d4EA0DF689A78de2fBF002075576)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49)
    +++ description: None
```
