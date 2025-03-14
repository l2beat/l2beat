Generated with discovered.json: 0xa54309035c45ea225485df3a6b4a78fea241c68a

# Diff at Thu, 06 Mar 2025 14:21:06 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 287770407
- current block number: 287770407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x3d5f54e1900076824a77019a9d8c3b8a1929de6c

# Diff at Thu, 06 Mar 2025 09:39:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 287770407
- current block number: 287770407

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x1B98e4ED82Ee1a91A65a38C690e2266364064D15","0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F","0x04577832300ca28cE7e21ddEC3E304af8739710c"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x205f47214926ce6401e1822a95daedec87803877

# Diff at Tue, 04 Mar 2025 10:40:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 287770407
- current block number: 287770407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        247653199
    }
```

```diff
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507) {
    +++ description: None
      sinceBlock:
+        247653199
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      sinceBlock:
+        259640900
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        247653199
    }
```

```diff
    contract OneStepProverHostIo (0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        240992264
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        247653199
    }
```

```diff
    contract OneStepProverMemory (0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        240991609
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        247653199
    }
```

```diff
    contract OneStepProverMath (0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        240991948
    }
```

```diff
    contract OneStepProver0 (0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        240991280
    }
```

```diff
    contract OneStepProofEntry (0xa3180c7a17dd46DEf808477093592D8231e024a8) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        240992619
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        247653199
    }
```

```diff
    contract ValidatorUtils (0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        240994094
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        247653199
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        247653199
    }
```

```diff
    contract RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        247653199
    }
```

Generated with discovered.json: 0x97f5701ff28642e0a8a7b5c5293263fb55c15de6

# Diff at Thu, 27 Feb 2025 11:47:20 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 287770407
- current block number: 287770407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

Generated with discovered.json: 0xa70cc9affaa2eea3c0fa14034bbf6a81c7ab19ab

# Diff at Fri, 21 Feb 2025 14:12:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 287770407
- current block number: 287770407

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xbe0cde1a26716d6b434e0b35b44cfa057d8430c5

# Diff at Tue, 04 Feb 2025 12:33:46 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 287770407
- current block number: 287770407

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xf5c710feb7246afcd7c7f163c168a7ae730c99be

# Diff at Mon, 20 Jan 2025 11:10:27 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 287770407
- current block number: 287770407

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
    }
```

```diff
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
      directlyReceivedPermissions.6.from:
+        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
      directlyReceivedPermissions.5.target:
-        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      directlyReceivedPermissions.5.from:
+        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      directlyReceivedPermissions.4.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      directlyReceivedPermissions.4.from:
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      directlyReceivedPermissions.3.target:
-        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      directlyReceivedPermissions.3.from:
+        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      directlyReceivedPermissions.2.target:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      directlyReceivedPermissions.2.from:
+        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      directlyReceivedPermissions.1.target:
-        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      directlyReceivedPermissions.1.from:
+        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      directlyReceivedPermissions.0.target:
-        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      directlyReceivedPermissions.0.from:
+        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
      receivedPermissions.8.from:
+        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
      receivedPermissions.7.target:
-        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      receivedPermissions.7.from:
+        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      receivedPermissions.6.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.6.from:
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.5.target:
-        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      receivedPermissions.5.from:
+        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      receivedPermissions.4.target:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      receivedPermissions.4.from:
+        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      receivedPermissions.3.target:
-        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      receivedPermissions.3.from:
+        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      receivedPermissions.2.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.2.from:
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.1.target:
-        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      receivedPermissions.1.from:
+        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      receivedPermissions.0.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.0.from:
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      directlyReceivedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      directlyReceivedPermissions.0.from:
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
      issuedPermissions.2.to:
+        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ERC20Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
    }
```

```diff
    contract ERC20Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      directlyReceivedPermissions.2.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      directlyReceivedPermissions.2.from:
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      directlyReceivedPermissions.1.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      directlyReceivedPermissions.1.from:
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      directlyReceivedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      directlyReceivedPermissions.0.from:
+        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.1.target:
-        "0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
      issuedPermissions.1.to:
+        "0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.target:
-        "0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
      issuedPermissions.0.to:
+        "0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
      issuedPermissions.0.description:
+        "Add/remove batchPosters (Sequencers)."
    }
```

```diff
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
    }
```

Generated with discovered.json: 0x5292f048d45d18abb5264c287697164a34a32402

# Diff at Wed, 08 Jan 2025 10:44:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287770407
- current block number: 287770407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xe053fb77ee9f9a3f836f3a6257cfaf665e3c767c

# Diff at Mon, 23 Dec 2024 12:42:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 279474286
- current block number: 287770407

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279474286 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x90319b12d430dde70561631298a17d10e7bb7430

# Diff at Thu, 05 Dec 2024 11:53:38 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 279474286
- current block number: 279474286

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279474286 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x05b8b11b44ab1d943d7a501c8d9254e2bc52047d

# Diff at Fri, 29 Nov 2024 11:28:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 279474286
- current block number: 279474286

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279474286 (main branch discovery), not current.

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0},{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
+        "0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
      issuedPermissions.1.via.1:
-        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.1.via.0:
-        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0}
      issuedPermissions.0.permission:
-        "sequence"
+        "configure"
      issuedPermissions.0.target:
-        "0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
+        "0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
    }
```

Generated with discovered.json: 0x074b9d9bdd7cad50bfcff3657c16294b351517c0

# Diff at Fri, 29 Nov 2024 09:31:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 276713373
- current block number: 279474286

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 276713373 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      template:
+        "orbitstack/Inbox"
      displayName:
+        "Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
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
    contract ERC20Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      template:
+        "orbitstack/Outbox"
      displayName:
+        "Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract ERC20Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      template:
+        "orbitstack/Bridge"
      displayName:
+        "Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

Generated with discovered.json: 0xc2fa9c9d82bedfa50bbda3ddb073feb6a87bda6c

# Diff at Thu, 21 Nov 2024 07:27:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 267469765
- current block number: 276713373

## Description

Config related: new gnosisSafe template match.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      values.getOwners:
-        ["0x83F58bBB1a940E364ED2dE775D1FD5218135cCE3","0x651cF50272Ffa8f6D954080DF743410Bb0aa7AFa","0x8765bb776b00A14198025283988c23F72D330E2a","0x65c10dD3d50B10D0E1Bb459675b03367B1b52eD1"]
      values.getThreshold:
-        3
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0xb9db02fba53339cc04259d6fa9097baff18c1fd6

# Diff at Fri, 15 Nov 2024 08:18:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 267469765
- current block number: 267469765

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0}]}
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
-        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.0:
+        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x7bf0b52d291db056a359381c3bd5955bccabbe97

# Diff at Mon, 04 Nov 2024 08:01:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 267469765
- current block number: 267469765

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]}
      receivedPermissions.7.target:
-        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
+        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      receivedPermissions.6.target:
-        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.5.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      receivedPermissions.4.target:
-        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
+        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      receivedPermissions.3.target:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
+        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      receivedPermissions.2.target:
-        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.2.via.1:
-        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}
      receivedPermissions.2.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.1.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      receivedPermissions.1.via.1:
+        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}
      receivedPermissions.1.via.0.address:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.0.via.1:
-        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}
      receivedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
+        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
      issuedPermissions.2.via.0:
-        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.1.via.0:
+        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x374de579AE15aD59eD0519aeAf1A23F348Df259c"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [21600,300,259200,3600]
+        {"delayBlocks":21600,"futureBlocks":300,"delaySeconds":259200,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x85e26b018da19de74dbfdc844443b962fbbdb130

# Diff at Tue, 29 Oct 2024 13:21:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 267469765
- current block number: 267469765

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

```diff
    contract OneStepProverHostIo (0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMemory (0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProver0 (0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProofEntry (0xa3180c7a17dd46DEf808477093592D8231e024a8) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

Generated with discovered.json: 0x2944d42233ebc4561c3b3b82d3fab00ae2be2e2c

# Diff at Tue, 29 Oct 2024 08:07:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 267469765
- current block number: 267469765

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1B98e4ED82Ee1a91A65a38C690e2266364064D15","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0x374de579AE15aD59eD0519aeAf1A23F348Df259c","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0x4F405BA65291063d8A524c2bDf55d4e67405c2aF","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.2.via.0:
+        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0}
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x1B98e4ED82Ee1a91A65a38C690e2266364064D15","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0x374de579AE15aD59eD0519aeAf1A23F348Df259c"},{"permission":"upgrade","target":"0x4F405BA65291063d8A524c2bDf55d4e67405c2aF","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x374de579AE15aD59eD0519aeAf1A23F348Df259c"}
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.1.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

Generated with discovered.json: 0xf89287829e91ea572dde1335bc3afae5324b76f4

# Diff at Mon, 28 Oct 2024 14:06:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 267469765
- current block number: 267469765

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"]
    }
```

Generated with discovered.json: 0x6c2421e82c77596a559199e11d14e0f104365a4e

# Diff at Fri, 25 Oct 2024 09:57:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 266079510
- current block number: 267469765

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 266079510 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"},{"permission":"upgrade","target":"0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"},{"permission":"upgrade","target":"0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"},{"permission":"upgrade","target":"0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"},{"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72"},{"permission":"upgrade","target":"0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"},{"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"},{"permission":"upgrade","target":"0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"},{"permission":"upgrade","target":"0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"},{"permission":"upgrade","target":"0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"},{"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72"},{"permission":"upgrade","target":"0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"},{"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"}]
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x4F405BA65291063d8A524c2bDf55d4e67405c2aF","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x374de579AE15aD59eD0519aeAf1A23F348Df259c"}
      receivedPermissions.0.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      receivedPermissions.0.via:
+        [{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.1.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

```diff
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

Generated with discovered.json: 0xc140122f6b4e53c6f7636034411904ecd847ca68

# Diff at Wed, 23 Oct 2024 14:36:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 266079510
- current block number: 266079510

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 266079510 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "0x5b82aa008989d331bf6f3cf75b85a04c9ee809447c19b85fecaf3b7d749a6576"
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
    contract ValidatorWalletCreator (0x5a6C98F6A60BDC02cE4d8AD43b4Fc88Fe5b38856)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x91f0A93A188d1516193032A687533C97D634f9F4)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

Generated with discovered.json: 0x3048b114ae09b50403471f3a605b6c74a439e0e7

# Diff at Mon, 21 Oct 2024 12:51:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 266079510
- current block number: 266079510

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 266079510 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0x9e9bcb5dfaf58c045fbb12a94c85d7030dceac20

# Diff at Mon, 21 Oct 2024 11:29:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@89bb82544503b2bb7544ceb7dedf56a03e0c5339 block: 266079510
- current block number: 266079510

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 266079510 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xCd26Db56B29e88b5394063aEA727DB1a03E961a7"]
      values.$pastUpgrades.0.1:
-        ["0xCd26Db56B29e88b5394063aEA727DB1a03E961a7"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x2733fc1C97f6562466E9B29D64bCc6dC833cC88d","0x230cf5A0FE4cC58deaf8a147A42ACF3f3C20A8C4"]
      values.$pastUpgrades.0.1:
-        ["0x2733fc1C97f6562466E9B29D64bCc6dC833cC88d","0x230cf5A0FE4cC58deaf8a147A42ACF3f3C20A8C4"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x4D92EE5cCA2A93b30549a6398C063861F18B6726"]
      values.$pastUpgrades.0.1:
-        ["0x4D92EE5cCA2A93b30549a6398C063861F18B6726"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x20B3C55fe4ecd989beB56E13b2A726110f0c3619"]
      values.$pastUpgrades.0.1:
-        ["0x20B3C55fe4ecd989beB56E13b2A726110f0c3619"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6Feb471ce7D32ee16047F1A983ac4f592df96526"]
      values.$pastUpgrades.0.1:
-        ["0x6Feb471ce7D32ee16047F1A983ac4f592df96526"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xdbE68E9e47c4AC96Ab1300902b4B87A7E6470786"]
      values.$pastUpgrades.0.1:
-        ["0xdbE68E9e47c4AC96Ab1300902b4B87A7E6470786"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x51120FA6D564A70E9F80874c0a55A4ee0c7396Fe"]
      values.$pastUpgrades.0.1:
-        ["0x51120FA6D564A70E9F80874c0a55A4ee0c7396Fe"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xF088dccfD7d39b24Ce0D4c91a4fEC3F56e3DBC96"]
      values.$pastUpgrades.0.1:
-        ["0xF088dccfD7d39b24Ce0D4c91a4fEC3F56e3DBC96"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

Generated with discovered.json: 0xd6fa4a4ad8fc42903fa2372bb7a447c0dd4cbe1d

# Diff at Mon, 21 Oct 2024 08:58:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 266079510

## Description

Standard Orbit stack AnyTrust optimium with APE gas token and max supply premint (bridged via LayerZero) on L3.

## Initial discovery

```diff
+   Status: CREATED
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x5a6C98F6A60BDC02cE4d8AD43b4Fc88Fe5b38856)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x91f0A93A188d1516193032A687533C97D634f9F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xa3180c7a17dd46DEf808477093592D8231e024a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F)
    +++ description: None
```
