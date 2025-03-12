Generated with discovered.json: 0x5a93af8e06e6a0e2025ca5ca08eb4b723e085cf3

# Diff at Wed, 12 Mar 2025 08:49:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f5d64c565c3cc90f1414096f72fffbafe42bc364 block: 21465432
- current block number: 22029694

## Description

MS signer change.

## Watched changes

```diff
-   Status: DELETED
    contract undefined (0x17816E9A858b161c3E37016D139cf618056CaCD4)
    +++ description: None
```

```diff
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a) {
    +++ description: None
      values.$members.2:
-        "0x17816E9A858b161c3E37016D139cf618056CaCD4"
+        "0x13E83b0423534Eb6D542237F590096CEE5077056"
    }
```

```diff
+   Status: CREATED
    contract undefined (0x13E83b0423534Eb6D542237F590096CEE5077056)
    +++ description: None
```

Generated with discovered.json: 0x42b49955412b8d516daa3a80f1caf6d22622a737

# Diff at Thu, 06 Mar 2025 09:39:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21465432
- current block number: 21465432

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465432 (main branch discovery), not current.

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x12485B9d469c1D51d05b5C39e009D50eF0170cF7","0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x3de7456d9e449ff69c3f06c78eb85dcab66b5568

# Diff at Tue, 04 Mar 2025 10:39:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21465432
- current block number: 21465432

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465432 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        18913722
    }
```

```diff
    contract L1WethGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      sinceBlock:
+        18913805
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
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a) {
    +++ description: None
      sinceBlock:
+        17970145
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        18913722
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
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        18913722
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
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        18913722
    }
```

```diff
    contract GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        18913805
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        18913722
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
      sinceBlock:
+        18913722
    }
```

```diff
    contract ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        18913805
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
    contract CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      sinceBlock:
+        18913805
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        18913722
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        18913722
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        18913722
    }
```

Generated with discovered.json: 0x5a55f25b4f3f6c164be598e34c4dbbca253fa629

# Diff at Thu, 27 Feb 2025 11:46:17 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21465432
- current block number: 21465432

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465432 (main branch discovery), not current.

```diff
    contract GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1GatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

```diff
    contract ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1ERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      name:
-        "L1CustomGateway"
+        "CustomGateway"
      displayName:
-        "CustomGateway"
    }
```

Generated with discovered.json: 0xac455b58e723f9375fd059acb4bfed963e143c5c

# Diff at Fri, 21 Feb 2025 14:09:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21465432
- current block number: 21465432

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465432 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0x3a28247fb81176c092640d36235c5c40e29c98b8

# Diff at Thu, 20 Feb 2025 12:22:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 21465432
- current block number: 21465432

## Description

Config related: Bold templates added

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465432 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x231de671e9b4458e95ba2de14f17be9a4d8b48d1

# Diff at Tue, 04 Feb 2025 12:31:51 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21465432
- current block number: 21465432

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465432 (main branch discovery), not current.

```diff
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x0f7f0f9f9b5e669c79ce4fb89fdcb087f333b520

# Diff at Mon, 20 Jan 2025 11:09:53 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21465432
- current block number: 21465432

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465432 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.0.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

```diff
    contract L1WethGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      issuedPermissions.1.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.0.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

```diff
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a) {
    +++ description: None
      receivedPermissions.12.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      receivedPermissions.12.from:
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      receivedPermissions.11.target:
-        "0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"
      receivedPermissions.11.from:
+        "0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"
      receivedPermissions.10.target:
-        "0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"
      receivedPermissions.10.from:
+        "0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"
      receivedPermissions.9.target:
-        "0xa1c86E2362dba0525075622af6d5f739B1304D45"
      receivedPermissions.9.from:
+        "0xa1c86E2362dba0525075622af6d5f739B1304D45"
      receivedPermissions.8.target:
-        "0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"
      receivedPermissions.8.from:
+        "0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"
      receivedPermissions.7.target:
-        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
      receivedPermissions.7.from:
+        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
      receivedPermissions.6.target:
-        "0x5D657b905275F36AD62C3d5C36966975613aFB96"
      receivedPermissions.6.from:
+        "0x5D657b905275F36AD62C3d5C36966975613aFB96"
      receivedPermissions.5.target:
-        "0x5a961c7D162195a9Dc5a357Cc168b0694283382E"
      receivedPermissions.5.from:
+        "0x5a961c7D162195a9Dc5a357Cc168b0694283382E"
      receivedPermissions.4.target:
-        "0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"
      receivedPermissions.4.from:
+        "0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"
      receivedPermissions.3.target:
-        "0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"
      receivedPermissions.3.from:
+        "0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"
      receivedPermissions.2.target:
-        "0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"
      receivedPermissions.2.from:
+        "0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"
      receivedPermissions.1.target:
-        "0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"
      receivedPermissions.1.from:
+        "0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"
      receivedPermissions.0.target:
-        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
      receivedPermissions.0.from:
+        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
      directlyReceivedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      directlyReceivedPermissions.0.from:
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.0.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

```diff
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.0.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.0.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.0.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4.target:
-        "0xcCE420Beb5a68091572A1cd860e10aE3Ce286FeA"
      issuedPermissions.4.to:
+        "0xcCE420Beb5a68091572A1cd860e10aE3Ce286FeA"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.2.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.1.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
      directlyReceivedPermissions.10.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      directlyReceivedPermissions.10.from:
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      directlyReceivedPermissions.9.target:
-        "0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"
      directlyReceivedPermissions.9.from:
+        "0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"
      directlyReceivedPermissions.8.target:
-        "0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"
      directlyReceivedPermissions.8.from:
+        "0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"
      directlyReceivedPermissions.7.target:
-        "0xa1c86E2362dba0525075622af6d5f739B1304D45"
      directlyReceivedPermissions.7.from:
+        "0xa1c86E2362dba0525075622af6d5f739B1304D45"
      directlyReceivedPermissions.6.target:
-        "0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"
      directlyReceivedPermissions.6.from:
+        "0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"
      directlyReceivedPermissions.5.target:
-        "0x5D657b905275F36AD62C3d5C36966975613aFB96"
      directlyReceivedPermissions.5.from:
+        "0x5D657b905275F36AD62C3d5C36966975613aFB96"
      directlyReceivedPermissions.4.target:
-        "0x5a961c7D162195a9Dc5a357Cc168b0694283382E"
      directlyReceivedPermissions.4.from:
+        "0x5a961c7D162195a9Dc5a357Cc168b0694283382E"
      directlyReceivedPermissions.3.target:
-        "0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"
      directlyReceivedPermissions.3.from:
+        "0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"
      directlyReceivedPermissions.2.target:
-        "0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"
      directlyReceivedPermissions.2.from:
+        "0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"
      directlyReceivedPermissions.1.target:
-        "0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"
      directlyReceivedPermissions.1.from:
+        "0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"
      directlyReceivedPermissions.0.target:
-        "0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"
      directlyReceivedPermissions.0.from:
+        "0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.1.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.0.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

```diff
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.1.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.0.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.3.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.3.via.1.delay:
-        0
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.2.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.1.target:
-        "0x7a6BD06483710252d807bE205255E69490efca3A"
      issuedPermissions.1.to:
+        "0x7a6BD06483710252d807bE205255E69490efca3A"
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.target:
-        "0x40acDc94a00b33151B40763b3Fed7C46fF639Df4"
      issuedPermissions.0.to:
+        "0x40acDc94a00b33151B40763b3Fed7C46fF639Df4"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.0.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.0.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      directlyReceivedPermissions.2.target:
-        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
      directlyReceivedPermissions.2.from:
+        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
      directlyReceivedPermissions.1.target:
-        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
      directlyReceivedPermissions.1.from:
+        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
      directlyReceivedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
      directlyReceivedPermissions.0.from:
+        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
    }
```

Generated with discovered.json: 0x69864634c6c67ce7eb294882226894100f912ae2

# Diff at Wed, 08 Jan 2025 10:44:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465432
- current block number: 21465432

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465432 (main branch discovery), not current.

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xc85af047797565706ff0e99cfcb114258548f572

# Diff at Mon, 23 Dec 2024 13:19:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21179544
- current block number: 21465432

## Description

Config related: Added Celestia Nitro wmroot.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21179544 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x92617cb6a6a58e236380d62e3d027067c08ad12a

# Diff at Fri, 06 Dec 2024 08:09:48 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21179544
- current block number: 21179544

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21179544 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x14d1d9fd9c74ec7dfc9f98139fd84b896d0e837d

# Diff at Fri, 29 Nov 2024 11:28:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21179544
- current block number: 21179544

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21179544 (main branch discovery), not current.

```diff
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xc82f54ff19715e3c445a18fff400886d896c3dfa

# Diff at Fri, 15 Nov 2024 08:18:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21179544
- current block number: 21179544

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21179544 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.5:
-        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0}]}
      issuedPermissions.4.permission:
-        "upgrade"
+        "validate"
      issuedPermissions.4.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
+        "0xcCE420Beb5a68091572A1cd860e10aE3Ce286FeA"
      issuedPermissions.4.via.0:
-        {"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0}
      issuedPermissions.3.permission:
-        "propose"
+        "upgrade"
      issuedPermissions.3.target:
-        "0xcCE420Beb5a68091572A1cd860e10aE3Ce286FeA"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.3.via.0:
+        {"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0}
      issuedPermissions.2.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.2.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.2.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0xcCE420Beb5a68091572A1cd860e10aE3Ce286FeA"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.0:
+        {"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

Generated with discovered.json: 0x6cc6f9bd60cdcbd5c240fb1fff6c1becc859e653

# Diff at Wed, 13 Nov 2024 15:04:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 21093350
- current block number: 21179544

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21093350 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract L1WethGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      name:
-        "L1WETHGateway"
+        "L1WethGateway"
    }
```

```diff
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
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
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      template:
+        "orbitstack/CustomGateway"
      displayName:
+        "CustomGateway"
      description:
+        "Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability."
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
    }
```

Generated with discovered.json: 0x3601e7f6cd1f8ce8a1d1eca2b887c669e87ea6c1

# Diff at Mon, 04 Nov 2024 07:59:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21093350
- current block number: 21093350

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21093350 (main branch discovery), not current.

```diff
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"upgrade","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]}
      receivedPermissions.11.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"
      receivedPermissions.10.target:
-        "0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"
+        "0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"
      receivedPermissions.9.target:
-        "0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"
+        "0xa1c86E2362dba0525075622af6d5f739B1304D45"
      receivedPermissions.8.target:
-        "0xa1c86E2362dba0525075622af6d5f739B1304D45"
+        "0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"
      receivedPermissions.7.target:
-        "0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"
+        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
      receivedPermissions.7.via.1:
-        {"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}
      receivedPermissions.7.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      receivedPermissions.6.target:
-        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
+        "0x5D657b905275F36AD62C3d5C36966975613aFB96"
      receivedPermissions.6.via.1:
+        {"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}
      receivedPermissions.6.via.0.address:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
      receivedPermissions.5.target:
-        "0x5D657b905275F36AD62C3d5C36966975613aFB96"
+        "0x5a961c7D162195a9Dc5a357Cc168b0694283382E"
      receivedPermissions.4.target:
-        "0x5a961c7D162195a9Dc5a357Cc168b0694283382E"
+        "0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"
      receivedPermissions.3.target:
-        "0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"
+        "0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"
      receivedPermissions.2.target:
-        "0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"
+        "0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"
      receivedPermissions.1.target:
-        "0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"
+        "0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"
+        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
      receivedPermissions.0.via.1:
-        {"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}
      receivedPermissions.0.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.5:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0}]}
      issuedPermissions.4:
+        {"permission":"upgrade","target":"0x19293FBec52F94165f903708a74513Dd6dFedd0a","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0}]}
      issuedPermissions.3.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.3.target:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xcCE420Beb5a68091572A1cd860e10aE3Ce286FeA"
      issuedPermissions.3.via.0:
-        {"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0}
      issuedPermissions.2.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.2.target:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      issuedPermissions.2.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xcCE420Beb5a68091572A1cd860e10aE3Ce286FeA"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.1.via.0:
+        {"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
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
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x05150e9c3ef94fb052861fbfa8039e3f72eeb858

# Diff at Fri, 01 Nov 2024 14:23:55 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21041856
- current block number: 21093350

## Description

Discovery refresh to apply template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041856 (main branch discovery), not current.

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

Generated with discovered.json: 0x0343d5884b7994a136a93b1909d37643d637bbe2

# Diff at Tue, 29 Oct 2024 13:15:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041856
- current block number: 21041856

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041856 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0x900a3496f192a3a640a34e86dfcb482b6d928a41

# Diff at Tue, 29 Oct 2024 08:04:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041856
- current block number: 21041856

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041856 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0},{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}]}
      issuedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
    }
```

```diff
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0},{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}]}
      issuedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
    }
```

```diff
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x12485B9d469c1D51d05b5C39e009D50eF0170cF7","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]},{"permission":"upgrade","target":"0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]},{"permission":"upgrade","target":"0x28c32059d7e6147cf5257DFC127f7258beA1cdf4","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]},{"permission":"upgrade","target":"0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]},{"permission":"upgrade","target":"0x5a961c7D162195a9Dc5a357Cc168b0694283382E","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]},{"permission":"upgrade","target":"0x5D657b905275F36AD62C3d5C36966975613aFB96","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]},{"permission":"upgrade","target":"0x6594085ca55a2B3a5fAD1C57A270D060eEa99877","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]},{"permission":"upgrade","target":"0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]},{"permission":"upgrade","target":"0xa1c86E2362dba0525075622af6d5f739B1304D45","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]},{"permission":"upgrade","target":"0xb4795A0edae98d7820C37F06f6b858e7acb51DF8","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]},{"permission":"upgrade","target":"0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]},{"permission":"upgrade","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"},{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0},{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}]}
      issuedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
    }
```

```diff
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0},{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}]}
      issuedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
    }
```

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0},{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}]}
      issuedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0},{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}]}
      issuedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0}]}
      issuedPermissions.2.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.2.via.0:
+        {"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0}
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0},{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}]}
      issuedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
    }
```

```diff
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0},{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}]}
      issuedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0},{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}]}
      issuedPermissions.2.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.2.via.1:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      issuedPermissions.2.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0},{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}]}
      issuedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","via":[{"address":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","delay":0},{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}]}
      issuedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
      issuedPermissions.0.via.1:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x12485B9d469c1D51d05b5C39e009D50eF0170cF7","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]},{"permission":"upgrade","target":"0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]},{"permission":"upgrade","target":"0x28c32059d7e6147cf5257DFC127f7258beA1cdf4","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]},{"permission":"upgrade","target":"0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]},{"permission":"upgrade","target":"0x5a961c7D162195a9Dc5a357Cc168b0694283382E","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]},{"permission":"upgrade","target":"0x5D657b905275F36AD62C3d5C36966975613aFB96","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]},{"permission":"upgrade","target":"0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"},{"permission":"upgrade","target":"0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]},{"permission":"upgrade","target":"0xa1c86E2362dba0525075622af6d5f739B1304D45","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]},{"permission":"upgrade","target":"0xb4795A0edae98d7820C37F06f6b858e7acb51DF8","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]},{"permission":"upgrade","target":"0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]},{"permission":"upgrade","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"}
    }
```

Generated with discovered.json: 0x636f6fcb302c5443d2ded05a91a24fe6f84f797c

# Diff at Mon, 28 Oct 2024 14:05:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041856
- current block number: 21041856

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041856 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x19293FBec52F94165f903708a74513Dd6dFedd0a"]
    }
```

Generated with discovered.json: 0x968a88b2073525782e9d5e028b27dd6996e0704b

# Diff at Fri, 25 Oct 2024 09:54:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20842798
- current block number: 21041856

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842798 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      issuedPermissions.0.via.0:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
    }
```

```diff
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      issuedPermissions.0.via.0:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      issuedPermissions.0.via.0:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
    }
```

```diff
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      issuedPermissions.0.via.0:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
    }
```

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      issuedPermissions.0.via.0:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      issuedPermissions.0.via.0:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"},{"permission":"upgrade","target":"0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"},{"permission":"upgrade","target":"0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"},{"permission":"upgrade","target":"0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"},{"permission":"upgrade","target":"0x5a961c7D162195a9Dc5a357Cc168b0694283382E"},{"permission":"upgrade","target":"0x5D657b905275F36AD62C3d5C36966975613aFB96"},{"permission":"upgrade","target":"0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"},{"permission":"upgrade","target":"0xa1c86E2362dba0525075622af6d5f739B1304D45"},{"permission":"upgrade","target":"0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"},{"permission":"upgrade","target":"0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"},{"permission":"upgrade","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"},{"permission":"upgrade","target":"0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"},{"permission":"upgrade","target":"0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"},{"permission":"upgrade","target":"0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"},{"permission":"upgrade","target":"0x5a961c7D162195a9Dc5a357Cc168b0694283382E"},{"permission":"upgrade","target":"0x5D657b905275F36AD62C3d5C36966975613aFB96"},{"permission":"upgrade","target":"0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"},{"permission":"upgrade","target":"0xa1c86E2362dba0525075622af6d5f739B1304D45"},{"permission":"upgrade","target":"0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"},{"permission":"upgrade","target":"0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"},{"permission":"upgrade","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"}]
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      issuedPermissions.0.via.0:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
    }
```

```diff
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      issuedPermissions.0.via.0:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      issuedPermissions.2.via.0:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      issuedPermissions.0.via.0:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      issuedPermissions.0.via.0:
+        {"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","delay":0}
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xb4795A0edae98d7820C37F06f6b858e7acb51DF8","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xa1c86E2362dba0525075622af6d5f739B1304D45","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x5D657b905275F36AD62C3d5C36966975613aFB96","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x5a961c7D162195a9Dc5a357Cc168b0694283382E","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x28c32059d7e6147cf5257DFC127f7258beA1cdf4","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d","via":[{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]}
      receivedPermissions.0.target:
-        "0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"
+        "0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"
      receivedPermissions.0.via:
+        [{"address":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"}]
    }
```

Generated with discovered.json: 0xbc60c8c4d461994cce50474261d4f6a480f2aa2c

# Diff at Wed, 23 Oct 2024 14:36:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20842798
- current block number: 20842798

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842798 (main branch discovery), not current.

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
-   Status: DELETED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
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
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0xcCE420Beb5a68091572A1cd860e10aE3Ce286FeA"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v31 wasmModuleRoot"
+        "0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v31 wasmModuleRoot"
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
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
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

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

Generated with discovered.json: 0x0ca993c2d9a8d1b0a5c38c492ef03ce2759a0472

# Diff at Mon, 21 Oct 2024 12:47:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20842798
- current block number: 20842798

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842798 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0x6ec6d30eecf1f01bbfd69ca8340cd6edad6eab36

# Diff at Mon, 21 Oct 2024 11:08:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20842798
- current block number: 20842798

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842798 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
      values.$pastUpgrades.0.1:
-        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
+        "0x56a0bbc36c0e79b2338cddce3f80c7998dd0f526d885a6b1aa827543769619df"
    }
```

```diff
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xa86996bED19547f7dEf22a087dD61b5F9Fb6C684"]
      values.$pastUpgrades.0.1:
-        ["0xa86996bED19547f7dEf22a087dD61b5F9Fb6C684"]
+        "0x13cbbc1a526c431bc86f883ba14816912d3f1a6f92105d2c34a08c15d806ffa4"
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
      values.$pastUpgrades.1.1:
-        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
+        "0xaa0434ce70e52e72a359fc871e5285e8504dc1e24c28b3882f85c603465e88ff"
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
+        "0x56a0bbc36c0e79b2338cddce3f80c7998dd0f526d885a6b1aa827543769619df"
    }
```

```diff
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0x56a0bbc36c0e79b2338cddce3f80c7998dd0f526d885a6b1aa827543769619df"
    }
```

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0x56a0bbc36c0e79b2338cddce3f80c7998dd0f526d885a6b1aa827543769619df"
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
      values.$pastUpgrades.0.1:
-        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
+        "0x13cbbc1a526c431bc86f883ba14816912d3f1a6f92105d2c34a08c15d806ffa4"
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x56a0bbc36c0e79b2338cddce3f80c7998dd0f526d885a6b1aa827543769619df"
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
      values.$pastUpgrades.0.1:
-        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
+        "0x13cbbc1a526c431bc86f883ba14816912d3f1a6f92105d2c34a08c15d806ffa4"
    }
```

```diff
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xedB05ED1a37750833fBE85b808c872D841d00859"]
      values.$pastUpgrades.0.1:
-        ["0xedB05ED1a37750833fBE85b808c872D841d00859"]
+        "0x13cbbc1a526c431bc86f883ba14816912d3f1a6f92105d2c34a08c15d806ffa4"
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]
      values.$pastUpgrades.2.1:
-        ["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]
+        "0x2f5db148c87e87a1670b52d003d051efecdfb606bc0b265f36d7bfeb9977601e"
      values.$pastUpgrades.1.2:
+        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
      values.$pastUpgrades.1.1:
-        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
+        "0xaa0434ce70e52e72a359fc871e5285e8504dc1e24c28b3882f85c603465e88ff"
      values.$pastUpgrades.0.2:
+        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
      values.$pastUpgrades.0.1:
-        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
+        "0x56a0bbc36c0e79b2338cddce3f80c7998dd0f526d885a6b1aa827543769619df"
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0x56a0bbc36c0e79b2338cddce3f80c7998dd0f526d885a6b1aa827543769619df"
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0x56a0bbc36c0e79b2338cddce3f80c7998dd0f526d885a6b1aa827543769619df"
    }
```

Generated with discovered.json: 0xd3d0a9a02626d8f526e3be925c9dc81daaeb5784

# Diff at Wed, 16 Oct 2024 11:39:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20842798
- current block number: 20842798

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842798 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0xcCE420Beb5a68091572A1cd860e10aE3Ce286FeA","via":[]}
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}
      issuedPermissions.1:
+        {"permission":"sequence","target":"0x7a6BD06483710252d807bE205255E69490efca3A","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d"
+        "0x40acDc94a00b33151B40763b3Fed7C46fF639Df4"
    }
```

Generated with discovered.json: 0x7b867d5d7368e182d23751657f7e6e351568223c

# Diff at Mon, 14 Oct 2024 10:54:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20842798
- current block number: 20842798

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842798 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"]
    }
```

```diff
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x486a6ad1cedca553753b8d912f0cd16058ebb0ce6aa547072fb76288e0d23a84"]
    }
```

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
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
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcd37abd5bdcc8c37cbf37dcfa4889d5b238388344d913b3a48914f659e0d627b"]
    }
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xb920455f1e366c7a89719abdd8d8174e4e7d353f2d4b7dea11b0571bf9526eae"]
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x61cc407871b0c56af41887c99354633d150e4586f0a6d237c6efd10966b17bd7"]
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x12b277cae4866b3d1f1772fcb7f861dc23247452179f0736c9dbe7012f6c14f6"]
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
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
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x8d9e1660cd96605e8727f611f7b96ef82ad6cd8a76db94cd253b74cddd1c6bce"]
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x28eec040eca7563195b19e22e11429d0f977820bfb60ac52e567ffde3c92cf77"]
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

Generated with discovered.json: 0x3185ad87b5a2caf25a9e28ad993c2550b251e340

# Diff at Tue, 01 Oct 2024 10:54:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842798
- current block number: 20842798

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842798 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-01T16:18:59.000Z",["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]]]
    }
```

```diff
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-01T16:35:35.000Z",["0xa86996bED19547f7dEf22a087dD61b5F9Fb6C684"]]]
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-01T16:18:59.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]],["2024-04-10T17:26:11.000Z",["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]]]
    }
```

```diff
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-01T16:18:59.000Z",["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]]]
    }
```

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-01T16:18:59.000Z",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]]]
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-01T16:35:35.000Z",["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]]]
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-01-01T16:18:59.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-01T16:35:35.000Z",["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]]]
    }
```

```diff
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-01T16:35:35.000Z",["0xedB05ED1a37750833fBE85b808c872D841d00859"]]]
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-01T16:18:59.000Z",["0x873484Ba63353C8b71210ce123B465512d408B27"]],["2024-04-10T17:26:11.000Z",["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]],["2024-05-01T19:48:35.000Z",["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]]]
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-01T16:18:59.000Z",["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]]]
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-01T16:18:59.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

Generated with discovered.json: 0xd5da3238a98b6bb75172e763fdcaaa6304a97e06

# Diff at Fri, 27 Sep 2024 15:17:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20711478
- current block number: 20842798

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20711478 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xad2104162b7b0ea2e26cc67df7a5f5c5021f6be0

# Diff at Mon, 09 Sep 2024 07:12:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20661240
- current block number: 20711478

## Description

Parallel had a 11d gap between batches delivered to the SequencerInbox. The sequencer-only window was 2d, so `forceInclusion()` should have been possible. (nobody used it)

The proposer was active and has a much longer max inactivity before allowing self-proposing (~12d).

Paradex is currently using the ArbOS 31 wasmmoduleroot but not the new ChallengeManager nor the OSP contracts seen in Arbitrum.

## Watched changes

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.postsBlobs:
-        true
+        false
    }
```

Generated with discovered.json: 0x1c45b4656a74dcf9c9576a9c54e54d4bf837d034

# Diff at Mon, 02 Sep 2024 06:58:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fcb30f6c613b5454aa9ecdec05a118442e9dc7b block: 20654582
- current block number: 20661240

## Description

One of the two (!) upgrade admin EOA's is removed.

## Watched changes

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.2:
-        "0x7AC5Af3cb1F05aC5301E5589e8bE097247C5456b"
    }
```

Generated with discovered.json: 0x014a2cd73b33f516dfdef1c258f6b9d4423dac12

# Diff at Sun, 01 Sep 2024 08:40:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20539980
- current block number: 20654582

## Description

Using new wasmModuleRoot mapping.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20539980 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69"
+        "ArbOS v31 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xe3d0d6d996e6fdd3690509e7e92e0ab82ace65b9

# Diff at Fri, 30 Aug 2024 07:54:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20539980
- current block number: 20539980

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20539980 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
      receivedPermissions.10.via:
-        []
      receivedPermissions.9.via:
-        []
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
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x1dfd8b37479f560f094449e283d0a9f0aac33b1a

# Diff at Fri, 23 Aug 2024 09:54:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20539980
- current block number: 20539980

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20539980 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xdda61d1a155212fa60df4e0d224f59446d09bb28

# Diff at Wed, 21 Aug 2024 10:04:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20539980
- current block number: 20539980

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20539980 (main branch discovery), not current.

```diff
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x12485B9d469c1D51d05b5C39e009D50eF0170cF7","0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d","0x28c32059d7e6147cf5257DFC127f7258beA1cdf4","0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2","0x5D657b905275F36AD62C3d5C36966975613aFB96","0x5a961c7D162195a9Dc5a357Cc168b0694283382E","0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d","0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3","0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","0xa1c86E2362dba0525075622af6d5f739B1304D45","0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x12485B9d469c1D51d05b5C39e009D50eF0170cF7","via":[]},{"permission":"upgrade","target":"0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d","via":[]},{"permission":"upgrade","target":"0x28c32059d7e6147cf5257DFC127f7258beA1cdf4","via":[]},{"permission":"upgrade","target":"0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2","via":[]},{"permission":"upgrade","target":"0x5a961c7D162195a9Dc5a357Cc168b0694283382E","via":[]},{"permission":"upgrade","target":"0x5D657b905275F36AD62C3d5C36966975613aFB96","via":[]},{"permission":"upgrade","target":"0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d","via":[]},{"permission":"upgrade","target":"0xa1c86E2362dba0525075622af6d5f739B1304D45","via":[]},{"permission":"upgrade","target":"0xb4795A0edae98d7820C37F06f6b858e7acb51DF8","via":[]},{"permission":"upgrade","target":"0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3","via":[]},{"permission":"upgrade","target":"0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x6594085ca55a2B3a5fAD1C57A270D060eEa99877","via":[]}]
    }
```

Generated with discovered.json: 0x988841d109efe1870589b323c698b053c09d834f

# Diff at Fri, 16 Aug 2024 08:25:27 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@7273b1decf2b7a03e4f10ec7b42f94fa80b3c5ba block: 20511119
- current block number: 20539980

## Description

The futureBlocks value enforces a max block height that a batch can be posted relative to the current block (likewise with futureSeconds). A small value for future blocks means that a relatively small L1 reorg can cause an otherwise valid batch to revert. They increased is to 96, or three epochs. The futureSeconds value is set to correspond to the new futureBlocks value. The delay is also changed - it's the delay time between tx submission and ability to do force inclusion on the L1. Compared to Arbitrum One all of the delays are higher here.

## Watched changes

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.maxTimeVariation.delayBlocks:
-        5760
+        11520
      values.maxTimeVariation.futureBlocks:
-        48
+        96
      values.maxTimeVariation.delaySeconds:
-        86400
+        172800
      values.maxTimeVariation.futureSeconds:
-        3600
+        7200
    }
```

Generated with discovered.json: 0x9da8d6602f5bc8018ec9a4e1c2db4df4e1a2ec4c

# Diff at Mon, 12 Aug 2024 07:44:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@78984bd9166a6a2ef87dc311b2392c9536e24795 block: 20475140
- current block number: 20511119

## Description

Parallel is posting blobs again, for some reason they switched to calldata a while ago but they are back to blobs now.

## Watched changes

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.postsBlobs:
-        false
+        true
    }
```

Generated with discovered.json: 0xcbf2f32feebbf2f97fa124b0bc96bcd11183af12

# Diff at Fri, 09 Aug 2024 12:01:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20475140
- current block number: 20475140

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475140 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
      assignedPermissions.upgrade.9:
-        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
+        "0xa1c86E2362dba0525075622af6d5f739B1304D45"
      assignedPermissions.upgrade.8:
-        "0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"
+        "0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89"
      assignedPermissions.upgrade.7:
-        "0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"
+        "0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"
      assignedPermissions.upgrade.6:
-        "0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3"
+        "0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"
      assignedPermissions.upgrade.5:
-        "0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"
+        "0x5a961c7D162195a9Dc5a357Cc168b0694283382E"
      assignedPermissions.upgrade.3:
-        "0x5a961c7D162195a9Dc5a357Cc168b0694283382E"
+        "0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2"
      assignedPermissions.upgrade.2:
-        "0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"
+        "0x28c32059d7e6147cf5257DFC127f7258beA1cdf4"
      assignedPermissions.upgrade.1:
-        "0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d"
+        "0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d"
      assignedPermissions.upgrade.0:
-        "0xa1c86E2362dba0525075622af6d5f739B1304D45"
+        "0x12485B9d469c1D51d05b5C39e009D50eF0170cF7"
    }
```

Generated with discovered.json: 0x56dc3e54b9d63be5f7b93cdb889a811be10e81be

# Diff at Fri, 09 Aug 2024 10:11:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20475140
- current block number: 20475140

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475140 (main branch discovery), not current.

```diff
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xb6559478b59836376dA9937c4C697dDb21779E49","0x9EBe5cabad9748263DbE1304064AdAb285c0f515","0x17816E9A858b161c3E37016D139cf618056CaCD4","0x0049FAB7f5dD1F26F057BD5d972Ffc6ba3c349Dd","0x909e36B512Ed45250fdff513523119d825647695"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xb6559478b59836376dA9937c4C697dDb21779E49","0x9EBe5cabad9748263DbE1304064AdAb285c0f515","0x17816E9A858b161c3E37016D139cf618056CaCD4","0x0049FAB7f5dD1F26F057BD5d972Ffc6ba3c349Dd","0x909e36B512Ed45250fdff513523119d825647695"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x12485B9d469c1D51d05b5C39e009D50eF0170cF7","0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d","0x28c32059d7e6147cf5257DFC127f7258beA1cdf4","0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2","0x5D657b905275F36AD62C3d5C36966975613aFB96","0x5a961c7D162195a9Dc5a357Cc168b0694283382E","0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d","0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3","0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","0xa1c86E2362dba0525075622af6d5f739B1304D45","0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"]
      assignedPermissions.upgrade:
+        ["0xa1c86E2362dba0525075622af6d5f739B1304D45","0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d","0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d","0x5a961c7D162195a9Dc5a357Cc168b0694283382E","0x5D657b905275F36AD62C3d5C36966975613aFB96","0x28c32059d7e6147cf5257DFC127f7258beA1cdf4","0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3","0x12485B9d469c1D51d05b5C39e009D50eF0170cF7","0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2","0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89","0xb4795A0edae98d7820C37F06f6b858e7acb51DF8"]
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"]
      assignedPermissions.upgrade:
+        ["0x6594085ca55a2B3a5fAD1C57A270D060eEa99877"]
    }
```

Generated with discovered.json: 0xfd62887005a3835fad303d8d0fc8ae3fc92ff078

# Diff at Wed, 07 Aug 2024 07:16:47 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@47685977ba2390a8eafac8e0d4cac7c81dff5758 block: 20469265
- current block number: 20475140

## Description

New batch poster address is added.

## Watched changes

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.batchPosters.1:
+        "0x7a6BD06483710252d807bE205255E69490efca3A"
      values.setIsBatchPosterCount:
-        3
+        4
    }
```

Generated with discovered.json: 0x92bed3f93bb7b3a89690079407db0bd44b17e955

# Diff at Tue, 06 Aug 2024 11:35:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@636940e9998601360990d4bbb59e5d257345bee1 block: 20454427
- current block number: 20469265

## Description

Conduit multisig is removed from permissions and replaced by an EOA. The single validator is replaced.
There is one batch posted with calldata and the Sequencer only window is increased and then reset again to the old value. (`maxTimeVariation.delaySeconds`)
The wasmModuleRoot is changed to the ArbOS 31 root. ([compare Nitro GH repo](https://github.com/OffchainLabs/nitro/blob/7defbd2f59ffc53229eddaa5d6588e1a81ed90ff/Dockerfile#L220))

## Watched changes

```diff
-   Status: DELETED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.lastStakeBlock:
-        18914041
+        20468408
      values.setValidatorCount:
-        1
+        2
      values.stakerCount:
-        1
+        2
      values.validators.0:
-        "0x56D33424edb428744597Ec02571f14B50a33b7de"
+        "0xcCE420Beb5a68091572A1cd860e10aE3Ce286FeA"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69"
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.batchPosters.0:
-        "0x5eAD389b57d533A94a0eacd570Dc1CC59C25F2D4"
+        "0x40acDc94a00b33151B40763b3Fed7C46fF639Df4"
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        true
+        false
      values.postsBlobs:
-        true
+        false
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.2:
-        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
+        "0x7AC5Af3cb1F05aC5301E5589e8bE097247C5456b"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

## Source code changes

```diff
.../ConduitMultisig/GnosisSafe.sol => /dev/null    | 952 ---------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |  34 -
 2 files changed, 986 deletions(-)
```

Generated with discovered.json: 0x81a29071fa30ab118e27cf7bf790151320c2728c

# Diff at Sun, 04 Aug 2024 09:55:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14945a4ebc63b3db3867f33067f31f159fedd9a9 block: 20324735
- current block number: 20454427

## Description

A second Multisig is added as UpgradeExecutor.
Furthermore, the UpgradeExecutor was EOA-governed since Jan 2024 by `0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C`.

## Watched changes

```diff
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.2:
+        "0x19293FBec52F94165f903708a74513Dd6dFedd0a"
    }
```

```diff
+   Status: CREATED
    contract ParallelMultisig (0x19293FBec52F94165f903708a74513Dd6dFedd0a)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/ParallelMultisig/GnosisSafe.sol | 952 +++++++++++++++++++++
 .../.flat/ParallelMultisig/GnosisSafeProxy.p.sol   |  34 +
 2 files changed, 986 insertions(+)
```

Generated with discovered.json: 0xa983c9d48afcdea5e41c24942fc90aaf13668f51

# Diff at Tue, 30 Jul 2024 11:13:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20324735
- current block number: 20324735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20324735 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x4d5085741f2009ce78422ded5a756a7c74b2e406

# Diff at Wed, 17 Jul 2024 07:24:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f46e1b9319335587ca32b6e85f9d2f0c7ab7a729 block: 20177357
- current block number: 20324735

## Description

Use the new handler to check if it's posting blobs.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177357 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.postsBlobs:
+        true
    }
```

Generated with discovered.json: 0x9a0d2512e77fef680460ede048f4a59c646bd608

# Diff at Wed, 26 Jun 2024 08:15:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1ee82e236b3e4d3c84f7f57d45b355aba70df5e7 block: 19927721
- current block number: 20174601

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927721 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      values.maxTimeVariation:
-        [5760,48,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0x50dc4b63edf931cc0b129c091769d15c9d631876

# Diff at Wed, 22 May 2024 20:11:52 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918791
- current block number: 19927721

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

Generated with discovered.json: 0x3b4a0f59eae8e09d6bb2504085ccc013ca253e95

# Diff at Tue, 21 May 2024 14:11:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19883602
- current block number: 19918791

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19883602 (main branch discovery), not current.

```diff
    contract OwnerMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "OwnerMultisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x9499a161dab92924ef2ab20a6556f1aa1fc54d83

# Diff at Thu, 02 May 2024 08:17:10 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@306760396dc5133ea2ec932bf81b9f36e88dbdd3 block: 19630573
- current block number: 19781186

## Description

The implementation of SequencerInbox was upgraded to a differenct contract with identical code.
This was done to change the immutable boolean `isUsingFeeToken` to false. This immutable should indeed be false on ethereum mainnet as it signifies the base L1 using a custom fee token. (Used as a check for `submitBatchSpendingReport()` function that is needed for fee sequencer fee reimbursement)

## Watched changes

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      upgradeability.implementation:
-        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
+        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
      implementations.0:
-        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
+        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
      values.isUsingFeeToken:
-        true
+        false
    }
```

## Source code changes

```diff
.../{.code@19630573 => .code}/SequencerInbox/implementation/meta.txt    | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x40ee005b1b236066f02ef1c4a0f5dfd9252b45d3

# Diff at Thu, 11 Apr 2024 06:24:39 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@379d5924e19a3a6dfc1858baca3e1ce1c43bfe6f block: 19532058
- current block number: 19630573

## Description

### New deploys

OneStepProofEntry, OneStepProverHostIo, OneStepProverMath, OneStepProver0, OneStepProverMemory are redeployed and Reader4844 is added to be compatible with EIP-4844.

- OneStepProverHostIo: Compatibility with EIP-4844, most updates are KZG-related in function `executeReadPreImage()`; new function `modExp256()`
- Reader4844.sol: New unverified contract with the functions `getBlobBaseFee()`, `getDataHashes()` for reading blob data (hashes) (info from its interface)

### SequencerInbox

In general most updates are EIP-4844 related, also the new role `batchPosterManager` is added and there are new checks regarding native tokens.

- Batch data flag-based decoding refined for blobs: `DATA_AUTHENTICATED_FLAG`, `BROTLI_MESSAGE_HEADER_FLAG`, `DAS_MESSAGE_HEADER_FLAG`, `DATA_BLOB_HEADER_FLAG`, `TREE_DAS_MESSAGE_HEADER_FLAG`, `ZERO_HEAVY_MESSAGE_HEADER_FLAG`
- new `batchPosterManager` functions and role: Can change the Sequencer addresses. (allows key rotation of batch posters)
- new `addSequencerL2BatchFromOrigin()` (with added `prevMessageCount, newMessageCount` in sig, old signature without them is now deprecated), `addSequencerL2BatchFromBlobs()`
- Gas refunds fetch blob price from Reader4844
- Rollup owner can update rollup address
- SequencerInbox contructor reverts if host chain is Arbitrum because blobs are not supported there
  - Checks for fee token usage and reverts if the native token is not ETH
- `forceInclusion()` now does not change the sequencer message count
- IBridge interface is introduced to use the vars TimeBounds and BatchDataLocation
- Hashing functions for blobs vs. calldata
- Time variation boundaries for batch posting vs. force inclusion -> format change

### Changed wasmModuleRoot

Upgrade L2 system to [ArbOS Version 20 "Atlas"](https://forum.arbitrum.foundation/t/aip-arbos-version-20-atlas/20957)

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    +++ description: None
      upgradeability.implementation:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      implementations.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      values.osp:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    +++ description: None
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
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
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    +++ description: None
      upgradeability.implementation:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
      implementations.0:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        true
      values.reader4844:
+        "0x7Deda2425eC2d4EA0DF689A78de2fBF002075576"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
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

## Source code changes

```diff
.../meta.txt                                       |   0
 .../meta.txt                                       |   2 +
 .../ChallengeManager/implementation/meta.txt       |   2 +-
 .../implementation/src/bridge/IBridge.sol          |  22 +
 .../implementation/src/bridge/ISequencerInbox.sol  |  91 +++-
 .../src/challenge/ChallengeManager.sol             |   6 +
 .../implementation/src/libraries/Error.sol         |  27 +-
 .../implementation/src/libraries/IGasRefunder.sol  |  25 -
 .../OneStepProofEntry/meta.txt                     |   2 +-
 .../OneStepProofEntry/src/bridge/IBridge.sol       |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../OneStepProver0/meta.txt                        |   2 +-
 .../OneStepProver0/src/bridge/IBridge.sol          |  22 +
 .../OneStepProver0/src/bridge/ISequencerInbox.sol  |  91 +++-
 .../OneStepProver0/src/libraries/IGasRefunder.sol  |  25 -
 .../OneStepProverHostIo/meta.txt                   |   2 +-
 .../OneStepProverHostIo/src/bridge/IBridge.sol     |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../src/osp/OneStepProverHostIo.sol                | 107 +++-
 .../OneStepProverMath/meta.txt                     |   2 +-
 .../OneStepProverMath/src/bridge/IBridge.sol       |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../OneStepProverMemory/meta.txt                   |   2 +-
 .../OneStepProverMemory/src/bridge/IBridge.sol     |  22 +
 .../src/bridge/ISequencerInbox.sol                 |  91 +++-
 .../src/libraries/IGasRefunder.sol                 |  25 -
 .../SequencerInbox/implementation/meta.txt         |   2 +-
 .../implementation/src/bridge/IBridge.sol          |  22 +
 .../implementation/src/bridge/IERC20Bridge.sol     |  37 ++
 .../implementation/src/bridge/ISequencerInbox.sol  |  91 +++-
 .../implementation/src/bridge/SequencerInbox.sol   | 578 ++++++++++++++++-----
 .../implementation/src/libraries/Error.sol         |  27 +-
 .../src/libraries/GasRefundEnabled.sol             |  52 ++
 .../implementation/src/libraries/IGasRefunder.sol  |  25 -
 .../implementation/src/libraries/IReader4844.sol   |  13 +
 .../implementation/src/precompiles/ArbGasInfo.sol  |  20 +
 39 files changed, 1358 insertions(+), 491 deletions(-)
```

Generated with discovered.json: 0x3234178d91d403e54fbe5caf0f912f14a404a51e

# Diff at Thu, 28 Mar 2024 10:37:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19125146
- current block number: 19532058

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19125146 (main branch discovery), not current.

```diff
    contract OwnerMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x01fbed9cb33e2f0bf40c3c67a6a73b1e5c4000da

# Diff at Wed, 31 Jan 2024 08:01:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@367f818d32ce6c1ab18696a1cbeb7a6f368b6d78 block: 19119505
- current block number: 19125146

## Description

Start tracking the keySetUpdates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19119505 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
      values.keySetUpdates:
+        0
    }
```

Generated with discovered.json: 0x5cf12304ad462ca8b57812f5d60a6a7fbd19058d

# Diff at Tue, 30 Jan 2024 13:05:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@ceb6abb9c987b0d53dd547a79c3ebbf3480a024b block: 19075194
- current block number: 19119505

## Description

Add the SequencerInboxVersion handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19075194 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
      values.sequencerVersion:
+        "0x00"
    }
```

Generated with discovered.json: 0x616619b46862d7649368c11858319d5e420f5791

# Diff at Wed, 24 Jan 2024 08:06:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bef03f2ccf4bccd5d53aa62da5612827a762973f block: 19069632
- current block number: 19075194

## Description

Contracts have been verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19069632 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverMemory"
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverMath"
    }
```

```diff
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverHostIo"
    }
```

```diff
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProver0"
    }
```

# Diff at Tue, 23 Jan 2024 13:21:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 19032900
- current block number: 19069632

## Description

Added discovery of rollup validators.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19032900 (main branch discovery), not current.

```diff
    contract  (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
      name:
-        ""
+        "OneStepProverMemory"
      derivedName:
+        ""
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
      values.validators:
+        ["0x56D33424edb428744597Ec02571f14B50a33b7de"]
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
      derivedName:
+        "ProxyAdmin"
    }
```

```diff
    contract  (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
      name:
-        ""
+        "OneStepProverMath"
      derivedName:
+        ""
    }
```

```diff
    contract  (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
      name:
-        ""
+        "OneStepProverHostIo"
      derivedName:
+        ""
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
      values.batchPosters:
+        ["0x5eAD389b57d533A94a0eacd570Dc1CC59C25F2D4"]
    }
```

```diff
    contract  (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
      name:
-        ""
+        "OneStepProver0"
      derivedName:
+        ""
    }
```

# Diff at Thu, 18 Jan 2024 09:37:21 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0cb1eb82b45ad89a272a3c1b8f8f24ae020627cc block: 18962479
- current block number: 19032900

## Description

Ignore nonce of GnosisSafe multisig

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18962479 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
      name:
-        "GnosisSafe"
+        "OwnerMultisig"
      values.nonce:
-        9
      derivedName:
+        "GnosisSafe"
    }
```

# Diff at Mon, 08 Jan 2024 13:05:46 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 18962479

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
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    }
```

```diff
+   Status: CREATED
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    }
```

```diff
+   Status: CREATED
    contract  (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract  (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    }
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    }
```

```diff
+   Status: CREATED
    contract  (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```
