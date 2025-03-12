Generated with discovered.json: 0x7db162ab756dfa738b6a1703dcfd1a2649bc78e9

# Diff at Thu, 06 Mar 2025 14:22:55 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 287771173
- current block number: 287771173

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771173 (main branch discovery), not current.

```diff
    contract RollupProxy (0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x32a94b037567c2b57e91644a2f7571f2ead1a175

# Diff at Thu, 06 Mar 2025 09:39:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 287771173
- current block number: 287771173

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771173 (main branch discovery), not current.

```diff
    contract Bridge (0x2Bb27ECb6531B8978E1aFe0288C2cbC6505Ff5b7) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x1c37A831e405e2F3dd76eb8C9ecE483370D53AfE","0xBB769cAfc77b8Eadbcdeb8FAAE7369F9df244754"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x38Cb5EfbCb3e8783abbBb00210522586e79Ea1D8"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x075157e6730528ec4daf4403637797c7735a149c

# Diff at Tue, 04 Mar 2025 10:40:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 287771173
- current block number: 287771173

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771173 (main branch discovery), not current.

```diff
    contract CustomGateway (0x0bFd15d408c856aA5CC65f49B3A1d4441D9Cb11e) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      sinceBlock:
+        167185951
    }
```

```diff
    contract ERC20Gateway (0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        167185951
    }
```

```diff
    contract Inbox (0x1c37A831e405e2F3dd76eb8C9ecE483370D53AfE) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        167185206
    }
```

```diff
    contract Bridge (0x2Bb27ECb6531B8978E1aFe0288C2cbC6505Ff5b7) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        167185206
    }
```

```diff
    contract Outbox (0x38Cb5EfbCb3e8783abbBb00210522586e79Ea1D8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        167185206
    }
```

```diff
    contract SequencerInbox (0x51a68C63669109BED585347B847c23DcA1cF9713) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        167185206
    }
```

```diff
    contract RollupProxy (0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        167185206
    }
```

```diff
    contract UpgradeExecutor (0x65e556838D665e04737Be37816d12Fae633c7d83) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        167185206
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
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      sinceBlock:
+        187813903
    }
```

```diff
    contract OneStepProver0 (0x95C8bB5D2039e9A8Aeed92DdCCdFbA283A6084Ad) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        280243096
    }
```

```diff
    contract ChallengeManager (0x9Df55ed5546D9837E28f95f22daA66383957b16f) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        167185206
    }
```

```diff
    contract RollupEventInbox (0xBB769cAfc77b8Eadbcdeb8FAAE7369F9df244754) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        167185206
    }
```

```diff
    contract OneStepProverMemory (0xC0FCF2284a31f051253a4db86213EAaDC09f3791) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        280243103
    }
```

```diff
    contract OneStepProverMath (0xd87B426d53B17BeEe316D262aA81cdDBaA96C826) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        280243109
    }
```

```diff
    contract ProxyAdmin (0xDAa72c39422ad709DDd609e12E75A13267474347) {
    +++ description: None
      sinceBlock:
+        167185206
    }
```

```diff
    contract GatewayRouter (0xE72E807A72c7D36717a3ea9e7668ea690A2bf0E1) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        167185951
    }
```

```diff
    contract OneStepProofEntry (0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        280243122
    }
```

```diff
    contract OneStepProverHostIo (0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        280243116
    }
```

Generated with discovered.json: 0x2fe3af78d7bcbc6e8026243ba446b906dd58c44a

# Diff at Thu, 27 Feb 2025 11:47:27 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 287771173
- current block number: 287771173

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771173 (main branch discovery), not current.

```diff
    contract CustomGateway (0x0bFd15d408c856aA5CC65f49B3A1d4441D9Cb11e) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      name:
-        "L1OrbitCustomGateway"
+        "CustomGateway"
      displayName:
-        "CustomGateway"
    }
```

```diff
    contract ERC20Gateway (0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1OrbitERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract Inbox (0x1c37A831e405e2F3dd76eb8C9ecE483370D53AfE) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract Bridge (0x2Bb27ECb6531B8978E1aFe0288C2cbC6505Ff5b7) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract Outbox (0x38Cb5EfbCb3e8783abbBb00210522586e79Ea1D8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract RollupEventInbox (0xBB769cAfc77b8Eadbcdeb8FAAE7369F9df244754) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract GatewayRouter (0xE72E807A72c7D36717a3ea9e7668ea690A2bf0E1) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1OrbitGatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

Generated with discovered.json: 0x987522c08ff669c3f4fbb31acbcc4c5982354822

# Diff at Fri, 21 Feb 2025 14:12:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 287771173
- current block number: 287771173

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771173 (main branch discovery), not current.

```diff
    contract L1OrbitCustomGateway (0x0bFd15d408c856aA5CC65f49B3A1d4441D9Cb11e) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract L1OrbitERC20Gateway (0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Inbox (0x1c37A831e405e2F3dd76eb8C9ecE483370D53AfE) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Bridge (0x2Bb27ECb6531B8978E1aFe0288C2cbC6505Ff5b7) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0x38Cb5EfbCb3e8783abbBb00210522586e79Ea1D8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0x51a68C63669109BED585347B847c23DcA1cF9713) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x65e556838D665e04737Be37816d12Fae633c7d83) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ChallengeManager (0x9Df55ed5546D9837E28f95f22daA66383957b16f) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xE72E807A72c7D36717a3ea9e7668ea690A2bf0E1) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

Generated with discovered.json: 0x5117094341f610ff41b0b1bea8d42fb2e71b48db

# Diff at Tue, 04 Feb 2025 12:33:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 287771173
- current block number: 287771173

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771173 (main branch discovery), not current.

```diff
    contract RollupProxy (0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x65e556838D665e04737Be37816d12Fae633c7d83) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xa64e4a6c5141f0a3e01d4f7948ab2469611f4692

# Diff at Mon, 20 Jan 2025 11:10:30 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 287771173
- current block number: 287771173

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771173 (main branch discovery), not current.

```diff
    contract L1OrbitCustomGateway (0x0bFd15d408c856aA5CC65f49B3A1d4441D9Cb11e) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract L1OrbitERC20Gateway (0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract ERC20Inbox (0x1c37A831e405e2F3dd76eb8C9ecE483370D53AfE) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract ERC20Bridge (0x2Bb27ECb6531B8978E1aFe0288C2cbC6505Ff5b7) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract ERC20Outbox (0x38Cb5EfbCb3e8783abbBb00210522586e79Ea1D8) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract SequencerInbox (0x51a68C63669109BED585347B847c23DcA1cF9713) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.target:
-        "0x7dA2598c1AfCA5Cb0149904Cd55C7b08647e091a"
      issuedPermissions.0.to:
+        "0x7dA2598c1AfCA5Cb0149904Cd55C7b08647e091a"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract RollupProxy (0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x3fFbA7F56fd346765077678d3e5BEdDC195FC774"
      issuedPermissions.2.to:
+        "0x3fFbA7F56fd346765077678d3e5BEdDC195FC774"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x65e556838D665e04737Be37816d12Fae633c7d83) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      directlyReceivedPermissions.2.target:
-        "0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A"
      directlyReceivedPermissions.2.from:
+        "0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A"
      directlyReceivedPermissions.1.target:
-        "0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A"
      directlyReceivedPermissions.1.from:
+        "0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A"
      directlyReceivedPermissions.0.target:
-        "0xDAa72c39422ad709DDd609e12E75A13267474347"
      directlyReceivedPermissions.0.from:
+        "0xDAa72c39422ad709DDd609e12E75A13267474347"
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.11.target:
-        "0xE72E807A72c7D36717a3ea9e7668ea690A2bf0E1"
      receivedPermissions.11.from:
+        "0xE72E807A72c7D36717a3ea9e7668ea690A2bf0E1"
      receivedPermissions.10.target:
-        "0xBB769cAfc77b8Eadbcdeb8FAAE7369F9df244754"
      receivedPermissions.10.from:
+        "0xBB769cAfc77b8Eadbcdeb8FAAE7369F9df244754"
      receivedPermissions.9.target:
-        "0x9Df55ed5546D9837E28f95f22daA66383957b16f"
      receivedPermissions.9.from:
+        "0x9Df55ed5546D9837E28f95f22daA66383957b16f"
      receivedPermissions.8.target:
-        "0x65e556838D665e04737Be37816d12Fae633c7d83"
      receivedPermissions.8.from:
+        "0x65e556838D665e04737Be37816d12Fae633c7d83"
      receivedPermissions.7.target:
-        "0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A"
      receivedPermissions.7.from:
+        "0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A"
      receivedPermissions.6.target:
-        "0x51a68C63669109BED585347B847c23DcA1cF9713"
      receivedPermissions.6.from:
+        "0x51a68C63669109BED585347B847c23DcA1cF9713"
      receivedPermissions.5.target:
-        "0x38Cb5EfbCb3e8783abbBb00210522586e79Ea1D8"
      receivedPermissions.5.from:
+        "0x38Cb5EfbCb3e8783abbBb00210522586e79Ea1D8"
      receivedPermissions.4.target:
-        "0x2Bb27ECb6531B8978E1aFe0288C2cbC6505Ff5b7"
      receivedPermissions.4.from:
+        "0x2Bb27ECb6531B8978E1aFe0288C2cbC6505Ff5b7"
      receivedPermissions.3.target:
-        "0x1c37A831e405e2F3dd76eb8C9ecE483370D53AfE"
      receivedPermissions.3.from:
+        "0x1c37A831e405e2F3dd76eb8C9ecE483370D53AfE"
      receivedPermissions.2.target:
-        "0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae"
      receivedPermissions.2.from:
+        "0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae"
      receivedPermissions.1.target:
-        "0x0bFd15d408c856aA5CC65f49B3A1d4441D9Cb11e"
      receivedPermissions.1.from:
+        "0x0bFd15d408c856aA5CC65f49B3A1d4441D9Cb11e"
      receivedPermissions.0.target:
-        "0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A"
      receivedPermissions.0.from:
+        "0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A"
      directlyReceivedPermissions.0.target:
-        "0x65e556838D665e04737Be37816d12Fae633c7d83"
      directlyReceivedPermissions.0.from:
+        "0x65e556838D665e04737Be37816d12Fae633c7d83"
    }
```

```diff
    contract ChallengeManager (0x9Df55ed5546D9837E28f95f22daA66383957b16f) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract ERC20RollupEventInbox (0xBB769cAfc77b8Eadbcdeb8FAAE7369F9df244754) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
    contract ProxyAdmin (0xDAa72c39422ad709DDd609e12E75A13267474347) {
    +++ description: None
      directlyReceivedPermissions.9.target:
-        "0xE72E807A72c7D36717a3ea9e7668ea690A2bf0E1"
      directlyReceivedPermissions.9.from:
+        "0xE72E807A72c7D36717a3ea9e7668ea690A2bf0E1"
      directlyReceivedPermissions.8.target:
-        "0xBB769cAfc77b8Eadbcdeb8FAAE7369F9df244754"
      directlyReceivedPermissions.8.from:
+        "0xBB769cAfc77b8Eadbcdeb8FAAE7369F9df244754"
      directlyReceivedPermissions.7.target:
-        "0x9Df55ed5546D9837E28f95f22daA66383957b16f"
      directlyReceivedPermissions.7.from:
+        "0x9Df55ed5546D9837E28f95f22daA66383957b16f"
      directlyReceivedPermissions.6.target:
-        "0x65e556838D665e04737Be37816d12Fae633c7d83"
      directlyReceivedPermissions.6.from:
+        "0x65e556838D665e04737Be37816d12Fae633c7d83"
      directlyReceivedPermissions.5.target:
-        "0x51a68C63669109BED585347B847c23DcA1cF9713"
      directlyReceivedPermissions.5.from:
+        "0x51a68C63669109BED585347B847c23DcA1cF9713"
      directlyReceivedPermissions.4.target:
-        "0x38Cb5EfbCb3e8783abbBb00210522586e79Ea1D8"
      directlyReceivedPermissions.4.from:
+        "0x38Cb5EfbCb3e8783abbBb00210522586e79Ea1D8"
      directlyReceivedPermissions.3.target:
-        "0x2Bb27ECb6531B8978E1aFe0288C2cbC6505Ff5b7"
      directlyReceivedPermissions.3.from:
+        "0x2Bb27ECb6531B8978E1aFe0288C2cbC6505Ff5b7"
      directlyReceivedPermissions.2.target:
-        "0x1c37A831e405e2F3dd76eb8C9ecE483370D53AfE"
      directlyReceivedPermissions.2.from:
+        "0x1c37A831e405e2F3dd76eb8C9ecE483370D53AfE"
      directlyReceivedPermissions.1.target:
-        "0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae"
      directlyReceivedPermissions.1.from:
+        "0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae"
      directlyReceivedPermissions.0.target:
-        "0x0bFd15d408c856aA5CC65f49B3A1d4441D9Cb11e"
      directlyReceivedPermissions.0.from:
+        "0x0bFd15d408c856aA5CC65f49B3A1d4441D9Cb11e"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xE72E807A72c7D36717a3ea9e7668ea690A2bf0E1) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

Generated with discovered.json: 0x7a8a3d7003d7a9b33a94da401213f8895b941c1c

# Diff at Wed, 08 Jan 2025 10:44:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287771173
- current block number: 287771173

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287771173 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x2Bb27ECb6531B8978E1aFe0288C2cbC6505Ff5b7) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xe84ac59c7aae26c8be0adbe28615537294435923

# Diff at Mon, 23 Dec 2024 12:46:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 280508832
- current block number: 287771173

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 280508832 (main branch discovery), not current.

```diff
    contract RollupProxy (0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x50595dbb57f63530a30be0f1013a97633c3793fe

# Diff at Thu, 05 Dec 2024 11:57:42 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 280508832
- current block number: 280508832

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 280508832 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xbcce5aabeaf6c8ce3da2ba827a63f470c60c4a97

# Diff at Mon, 02 Dec 2024 08:37:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0cac24376573663e0a362b2f340a124e5238a2bc block: 275817544
- current block number: 280508832

## Description

ArbOS v32 upgrade to known contracts.

## Watched changes

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
    contract SequencerInbox (0x51a68C63669109BED585347B847c23DcA1cF9713) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"
+        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
      values.$implementation:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "0x15Edf46734defab7F874E17FbC3A01fadC2FD5D6"
      values.$pastUpgrades.1:
+        ["2024-12-01T13:03:39.000Z","0xa6db4d21fc7341b13cc52767db9d6b4c0e82b3639dbebe226183bbcd5f1e5e39",["0x15Edf46734defab7F874E17FbC3A01fadC2FD5D6"]]
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
+        true
      values.reader4844:
+        "0x0000000000000000000000000000000000000000"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
    contract RollupProxy (0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A) {
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
+        "0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1"
      values.$implementation.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x31c97a0A216CCd730bd8ab3ecAA97eACbA27b11a"
      values.$pastUpgrades.1:
+        ["2024-12-01T19:16:27.000Z","0xf4d368e322103e127ae7c7141a8678c149cd3103ee13c3e607aa1d235014bcd3",["0x31c97a0A216CCd730bd8ab3ecAA97eACbA27b11a","0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1"]]
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
    contract UpgradeExecutor (0x65e556838D665e04737Be37816d12Fae633c7d83) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
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
    contract ChallengeManager (0x9Df55ed5546D9837E28f95f22daA66383957b16f) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0xa8Ae2ed62A978e2108a1C7CBfdb43a5CBfdd2aD0"
      values.$pastUpgrades.2:
+        ["2024-12-01T19:16:27.000Z","0xf4d368e322103e127ae7c7141a8678c149cd3103ee13c3e607aa1d235014bcd3",["0xa8Ae2ed62A978e2108a1C7CBfdb43a5CBfdd2aD0"]]
      values.$pastUpgrades.1:
+        ["2024-12-01T13:03:39.000Z","0xa6db4d21fc7341b13cc52767db9d6b4c0e82b3639dbebe226183bbcd5f1e5e39",["0xf2078f19A9322E2e0Dfd02839C7D74215F2E7512"]]
      values.$upgradeCount:
-        1
+        3
      values.osp:
-        "0x99a2A31300816C1FA3f40818AC9280fe7271F878"
+        "0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x95C8bB5D2039e9A8Aeed92DdCCdFbA283A6084Ad)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xC0FCF2284a31f051253a4db86213EAaDC09f3791)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xd87B426d53B17BeEe316D262aA81cdDBaA96C826)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++---
 .../OneStepProofEntry.sol                          | 485 ++++++++--
 .../{.flat@275817544 => .flat}/OneStepProver0.sol  | 765 +++++++++++-----
 .../OneStepProverHostIo.sol                        | 999 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 +++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 +++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++---
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++----
 9 files changed, 3374 insertions(+), 1106 deletions(-)
```

Generated with discovered.json: 0x11b7f50d149722a211c7fa7fac84a518f69a33bd

# Diff at Fri, 29 Nov 2024 11:28:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 275817544
- current block number: 275817544

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817544 (main branch discovery), not current.

```diff
    contract RollupProxy (0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0x65e556838D665e04737Be37816d12Fae633c7d83) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x9b31c9c7947aeb6b53c21f2b82120c5f4382d65a

# Diff at Mon, 18 Nov 2024 16:55:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b54f69b0d6666908da980a31e5f52da87009f1ab block: 272011240
- current block number: 275817544

## Description

Caldera MS member removed.

## Watched changes

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.4:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.3:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0xbf4bc44444ac9a79ff26762491016a7571669e4b

# Diff at Fri, 15 Nov 2024 08:18:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 272011240
- current block number: 272011240

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 272011240 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51a68C63669109BED585347B847c23DcA1cF9713) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract RollupProxy (0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0x65e556838D665e04737Be37816d12Fae633c7d83","delay":0}]}
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
-        "0x3fFbA7F56fd346765077678d3e5BEdDC195FC774"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.0:
+        {"address":"0x65e556838D665e04737Be37816d12Fae633c7d83","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0x65e556838D665e04737Be37816d12Fae633c7d83) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
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

Generated with discovered.json: 0xda00db1923a8d519691f957946a25e10e52b5e43

# Diff at Thu, 07 Nov 2024 15:02:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 272011240

## Description

Initial discovery of a standard Orbit stack Optimium (anyTrust 1/1) with custom gas token (INJ) that is not added because it is arbitrarily minted on Arbitrum One (not bridged from Ethereum).

## Initial discovery

```diff
+   Status: CREATED
    contract L1OrbitCustomGateway (0x0bFd15d408c856aA5CC65f49B3A1d4441D9Cb11e)
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x1c37A831e405e2F3dd76eb8C9ecE483370D53AfE)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x2Bb27ECb6531B8978E1aFe0288C2cbC6505Ff5b7)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x38Cb5EfbCb3e8783abbBb00210522586e79Ea1D8)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x51a68C63669109BED585347B847c23DcA1cF9713)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x60A85a4C9F8Bdb92FAaFdb4eC98Ce4F4173e213A)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x65e556838D665e04737Be37816d12Fae633c7d83)
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
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
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x9Df55ed5546D9837E28f95f22daA66383957b16f)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0xBB769cAfc77b8Eadbcdeb8FAAE7369F9df244754)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xDAa72c39422ad709DDd609e12E75A13267474347)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xE72E807A72c7D36717a3ea9e7668ea690A2bf0E1)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```
