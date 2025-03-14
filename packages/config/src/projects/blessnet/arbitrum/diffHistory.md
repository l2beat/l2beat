Generated with discovered.json: 0x97fd8913fb01b97fbbc67a11f2f54b2ef349a624

# Diff at Thu, 06 Mar 2025 14:21:28 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 308389533
- current block number: 308389533

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308389533 (main branch discovery), not current.

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x52d77bfb12bfa7d9637ac04870fd38c26829a49b

# Diff at Thu, 06 Mar 2025 09:39:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 308389533
- current block number: 308389533

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308389533 (main branch discovery), not current.

```diff
    contract Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x46B6462301182B393ac5f014779687d3B6d4FB57","0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x477b30be05c4f1dc48cb881f319737733325fc5d

# Diff at Tue, 04 Mar 2025 10:40:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 308389533
- current block number: 308389533

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308389533 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x089E12e795b3292BcC16f29817bE124C720615b0) {
    +++ description: None
      sinceBlock:
+        307810635
    }
```

```diff
    contract OneStepProofEntry (0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264456669
    }
```

```diff
    contract OneStepProver0 (0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264456643
    }
```

```diff
    contract Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        240884142
    }
```

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        240884142
    }
```

```diff
    contract OneStepProverHostIo (0x3537Ab400c0275c93569d2c505ADb72804985393) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264456662
    }
```

```diff
    contract Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        240884142
    }
```

```diff
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      sinceBlock:
+        268984071
    }
```

```diff
    contract RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        240884142
    }
```

```diff
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        240884142
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
    contract OneStepProverMemory (0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264456649
    }
```

```diff
    contract ValidatorUtils (0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        224300853
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        240884142
    }
```

```diff
    contract OneStepProverMath (0xbBe221554441F1d2d5A963A67789ce5893dCf451) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264456655
    }
```

```diff
    contract Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        240884142
    }
```

```diff
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b) {
    +++ description: None
      sinceBlock:
+        240884142
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        240884142
    }
```

Generated with discovered.json: 0x5ca5b98b16cb13c7462efb657c468157b8aff6cb

# Diff at Thu, 27 Feb 2025 11:47:22 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 308389533
- current block number: 308389533

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308389533 (main branch discovery), not current.

```diff
    contract Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

Generated with discovered.json: 0xf76ceec34efab8b820bf6d548bdadd938f094895

# Diff at Fri, 21 Feb 2025 14:12:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 305262432
- current block number: 308389533

## Description

Config related: Change some severities and add templates.

## Watched changes

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.7:
+        {"permission":"validate","to":"0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.6.to:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.5.to:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.4.to:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.3.to:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x089E12e795b3292BcC16f29817bE124C720615b0"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        3
+        4
      values.validators.4:
+        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      values.validators.3:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      values.validators.2:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      values.validators.1:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      values.validators.0:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x089E12e795b3292BcC16f29817bE124C720615b0"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x089E12e795b3292BcC16f29817bE124C720615b0)
    +++ description: None
```

## Source code changes

```diff
.../arbitrum/.flat/GnosisSafeL2/GnosisSafeL2.sol   | 1032 ++++++++++++++++++++
 .../.flat/GnosisSafeL2/GnosisSafeProxy.p.sol       |   35 +
 2 files changed, 1067 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305262432 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ERC20Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.latestConfirmed:
+        {"severity":"HIGH","description":"Was dead, now alive? Remove headerWarn if yes."}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x87f82d7e0ed70c354beb52e5014a0188de5db681

# Diff at Sun, 09 Feb 2025 08:48:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 302816612
- current block number: 304208966

## Description

Increase stake requirement (for orbit validators).

## Watched changes

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.currentRequiredStake:
-        "300000000000000000"
+        "500000000000000000"
    }
```

Generated with discovered.json: 0x09e958ab16068dbfc6aefa91ed1dcefd93f10d2e

# Diff at Wed, 05 Feb 2025 07:24:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@24a3610845e7ae2b3cc2daf90feff25e498e4068 block: 301169405
- current block number: 302816612

## Description

Increase stake requirement (for orbit validators) by 50%.

## Watched changes

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.currentRequiredStake:
-        "200000000000000000"
+        "300000000000000000"
    }
```

Generated with discovered.json: 0xc02bc721274adb26749f9e07433b8298f8caa435

# Diff at Tue, 04 Feb 2025 12:33:53 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 301169405
- current block number: 301169405

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 301169405 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.0.permission:
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

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.1.to:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
      issuedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
    }
```

Generated with discovered.json: 0x7998bcee94bba4214905ed60316b03ee7c4c0dca

# Diff at Fri, 31 Jan 2025 11:51:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@84b1296dd423a2ef9361874d922cd6911109ba10 block: 287770706
- current block number: 301169405

## Description

Stake for validators doubled, currently there are 4 on the whitelist.

## Watched changes

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.currentRequiredStake:
-        "100000000000000000"
+        "200000000000000000"
    }
```

Generated with discovered.json: 0x7cf62a85adea8167176ea9fddb84e1168b9915ac

# Diff at Mon, 20 Jan 2025 11:10:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 287770706
- current block number: 287770706

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770706 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB) {
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
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.target:
-        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
      issuedPermissions.1.to:
+        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.target:
-        "0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
      issuedPermissions.0.to:
+        "0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
      issuedPermissions.0.description:
+        "Add/remove batchPosters (Sequencers)."
    }
```

```diff
    contract ERC20Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57) {
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
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.1.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.0.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.0.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
    }
```

```diff
    contract ERC20RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4) {
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
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A) {
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
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.8.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.7.target:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      receivedPermissions.7.from:
+        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      receivedPermissions.6.target:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.6.from:
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.5.target:
-        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      receivedPermissions.5.from:
+        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      receivedPermissions.4.target:
-        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      receivedPermissions.4.from:
+        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      receivedPermissions.3.target:
-        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
      receivedPermissions.3.from:
+        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
      receivedPermissions.2.target:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
      receivedPermissions.2.from:
+        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
      receivedPermissions.1.target:
-        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      receivedPermissions.1.from:
+        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      receivedPermissions.0.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.0.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.0.target:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      directlyReceivedPermissions.0.from:
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
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
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.2.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.1.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.1.from:
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      directlyReceivedPermissions.0.target:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      directlyReceivedPermissions.0.from:
+        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
    }
```

```diff
    contract ERC20Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
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
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      directlyReceivedPermissions.6.from:
+        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      directlyReceivedPermissions.5.target:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      directlyReceivedPermissions.5.from:
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      directlyReceivedPermissions.4.target:
-        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      directlyReceivedPermissions.4.from:
+        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      directlyReceivedPermissions.3.target:
-        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      directlyReceivedPermissions.3.from:
+        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      directlyReceivedPermissions.2.target:
-        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
      directlyReceivedPermissions.2.from:
+        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
      directlyReceivedPermissions.1.target:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
      directlyReceivedPermissions.1.from:
+        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
      directlyReceivedPermissions.0.target:
-        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      directlyReceivedPermissions.0.from:
+        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6.target:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      issuedPermissions.6.to:
+        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      issuedPermissions.6.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.5.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.5.to:
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.5.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.target:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.4.to:
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.3.to:
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.1.to:
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.1.description:
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
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

Generated with discovered.json: 0xb827403261fa344892c6584af82352f123740e0c

# Diff at Wed, 08 Jan 2025 10:44:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287770706
- current block number: 287770706

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770706 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x455058f7931fabfc43de3dc00adcc7f231bb5506

# Diff at Mon, 23 Dec 2024 12:43:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 275817298
- current block number: 287770706

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817298 (main branch discovery), not current.

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x1dac45538c7773c1994e133b7fa8a9d7ed9fb199

# Diff at Thu, 05 Dec 2024 11:55:18 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 275817298
- current block number: 275817298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817298 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x70fcf8c7290d5f3b5b69bc20ecada2d67f7a26e0

# Diff at Fri, 29 Nov 2024 11:28:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 275817298
- current block number: 275817298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817298 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0},{"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
      issuedPermissions.1.via.1:
-        {"address":"0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b","delay":0}
      issuedPermissions.1.via.0:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}
      issuedPermissions.0.permission:
-        "sequence"
+        "configure"
      issuedPermissions.0.target:
-        "0xa0899d20D9665EB0FfE311A395FCd481bF38A5Ff"
+        "0xED64BaA244A1Ba3e91bBA2712004b1732078EC4D"
    }
```

```diff
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      receivedPermissions.0.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.1.target:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.1.via.0:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      issuedPermissions.0.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.0.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0,"description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0xe21f77939a0f885e34e6c1f072076979f9a711e4

# Diff at Fri, 29 Nov 2024 09:31:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 275817298
- current block number: 275817298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 275817298 (main branch discovery), not current.

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xF9327276c0E0d255543C095AC6D243B555e645D9","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}]}
      receivedPermissions.7.target:
-        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
+        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
      receivedPermissions.7.via.1:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
      receivedPermissions.7.via.0.address:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
      receivedPermissions.6.target:
-        "0xC1bf6E0Ac80e92A331c4D448652C4824D4195459"
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.5.target:
-        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
+        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
      receivedPermissions.4.target:
-        "0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A"
+        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
      receivedPermissions.3.target:
-        "0x67B01721383baedF4b27B745bf533F6F7bDc4AE4"
+        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
      receivedPermissions.2.target:
-        "0x46B6462301182B393ac5f014779687d3B6d4FB57"
+        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
      receivedPermissions.1.target:
-        "0x1e751242C9CE10E165969EeD91E5D98587904aad"
+        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB"
+        "0xF9327276c0E0d255543C095AC6D243B555e645D9"
      receivedPermissions.0.via.1:
-        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"}
      receivedPermissions.0.via.0.address:
-        "0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b"
+        "0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xF9327276c0E0d255543C095AC6D243B555e645D9"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6:
+        {"permission":"validate","target":"0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9","via":[]}
      issuedPermissions.5.target:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
      issuedPermissions.4.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.3.target:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.2.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xf51f16b4c673509075e65ad9b16a469486062035

# Diff at Mon, 18 Nov 2024 16:54:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b54f69b0d6666908da980a31e5f52da87009f1ab block: 272297655
- current block number: 275817298

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

Generated with discovered.json: 0xc1c8c787d4349fb65902fc9d8e50fa3b53599d8f

# Diff at Fri, 15 Nov 2024 08:18:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 272297655
- current block number: 272297655

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 272297655 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"propose","target":"0xF9327276c0E0d255543C095AC6D243B555e645D9","description":"can submit state roots to the RollupProxy contract on the host chain."}
      receivedPermissions.1.permission:
-        "configure"
+        "validate"
      receivedPermissions.1.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      receivedPermissions.0.permission:
-        "challenge"
+        "configure"
      receivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

```diff
    contract ERC20RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.9:
-        {"permission":"upgrade","target":"0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF","via":[{"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}]}
      issuedPermissions.8:
-        {"permission":"propose","target":"0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9","via":[]}
      issuedPermissions.7:
-        {"permission":"propose","target":"0x571D6CA61B979A967E055696c822CF8C928d3556","via":[]}
      issuedPermissions.6:
-        {"permission":"propose","target":"0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De","via":[]}
      issuedPermissions.5.permission:
-        "propose"
+        "validate"
      issuedPermissions.5.target:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
      issuedPermissions.4.permission:
-        "configure"
+        "validate"
      issuedPermissions.3.permission:
-        "challenge"
+        "validate"
      issuedPermissions.3.target:
-        "0x82Bc29d2a230d99261CFF7Dab9dAB27649784Fd9"
+        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
      issuedPermissions.2.permission:
-        "challenge"
+        "validate"
      issuedPermissions.2.target:
-        "0x571D6CA61B979A967E055696c822CF8C928d3556"
+        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x3D5cFeB6C99343793a8E112dF7D6c331F48e22De"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      issuedPermissions.1.via.0:
+        {"address":"0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3","delay":0}
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x27752e6B947e777E894c1b7E574Ca7593d6F2C49"
+        "0x571D6CA61B979A967E055696c822CF8C928d3556"
    }
```

Generated with discovered.json: 0x559fb671bc7d281ff267dd97b4968edd6835ec80

# Diff at Fri, 08 Nov 2024 11:02:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 272297655

## Description

Initial discovery of a standard Orbit stack Optimium with 3/3 DAC and 3/3 fastconfirmer MS.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x0BEfa8F5F1e3bf8e02d874375A43EA75AeD9CD39)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x0Ecfe9f90a06F74935f751077E24C2057B7C9a2f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x12c0163237819Eb81c469F71Ea0672e3e8dbF6dB)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x1e751242C9CE10E165969EeD91E5D98587904aad)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x3537Ab400c0275c93569d2c505ADb72804985393)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x46B6462301182B393ac5f014779687d3B6d4FB57)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract BlessnetFastconfirmerMultisig (0x571D6CA61B979A967E055696c822CF8C928d3556)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x67B01721383baedF4b27B745bf533F6F7bDc4AE4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x6f857Cfcb32951cE5A6fAD7B809af8Bcbc3d551A)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8711CA24591aEF3bEEC3A9cB9CE41939822366f3)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9A3464863213C218D7cb7BaA6e69C0461E0Cbc08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xa5e62aAC82Af6dA4Fd23ca5219132a7D941B4fe3)
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xbBe221554441F1d2d5A963A67789ce5893dCf451)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0xC1bf6E0Ac80e92A331c4D448652C4824D4195459)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xf201805BD417f9E0d229A0C379c3e5B91bf18A8b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xF9327276c0E0d255543C095AC6D243B555e645D9)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```
