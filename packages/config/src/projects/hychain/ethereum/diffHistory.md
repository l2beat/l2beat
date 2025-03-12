Generated with discovered.json: 0xed05fcad6180afd74d9d39db0aa34d77f9380e9c

# Diff at Thu, 06 Mar 2025 09:39:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21465186
- current block number: 21465186

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465186 (main branch discovery), not current.

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xD6c596b7ca17870DD50D322393deCE6C2085a116","0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x9310425a281cd36107705c4f25924ef6b40f756a

# Diff at Tue, 04 Mar 2025 10:39:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21465186
- current block number: 21465186

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465186 (main branch discovery), not current.

```diff
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        19366012
    }
```

```diff
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18736135
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
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18736121
    }
```

```diff
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F) {
    +++ description: None
      sinceBlock:
+        19366012
    }
```

```diff
    contract RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        19366012
    }
```

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        19366012
    }
```

```diff
    contract HychainMultisig (0x798Fa726f0B4DF564681446D051b344E3FE4a6ca) {
    +++ description: None
      sinceBlock:
+        19557598
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        19366012
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18736126
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        19366012
    }
```

```diff
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18736130
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        19366012
    }
```

```diff
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        19366012
    }
```

```diff
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18736117
    }
```

```diff
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        19366012
    }
```

Generated with discovered.json: 0x37b44da96766ca1e370cd6f81f18cfe4c19fccf4

# Diff at Thu, 27 Feb 2025 11:45:47 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21465186
- current block number: 21465186

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465186 (main branch discovery), not current.

```diff
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

Generated with discovered.json: 0x1ef5480f20d7c17508c44a54e6befbda47875bbd

# Diff at Fri, 21 Feb 2025 14:07:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21465186
- current block number: 21465186

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465186 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x3b63166799ecf8097cede8f879e0f64ea25373f5

# Diff at Thu, 20 Feb 2025 12:20:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 21465186
- current block number: 21465186

## Description

Config related: Bold templates added

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465186 (main branch discovery), not current.

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xa29c6743ba6e402ad9d2decd5c4f520b7aa752a5

# Diff at Tue, 04 Feb 2025 12:31:33 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21465186
- current block number: 21465186

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465186 (main branch discovery), not current.

```diff
    contract HychainMultisig (0x798Fa726f0B4DF564681446D051b344E3FE4a6ca) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x87b238bb5a1c976380c812e83187af26ba873805

# Diff at Mon, 20 Jan 2025 11:09:35 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21465186
- current block number: 21465186

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465186 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
    }
```

```diff
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"
      directlyReceivedPermissions.6.from:
+        "0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"
      directlyReceivedPermissions.5.target:
-        "0xD6c596b7ca17870DD50D322393deCE6C2085a116"
      directlyReceivedPermissions.5.from:
+        "0xD6c596b7ca17870DD50D322393deCE6C2085a116"
      directlyReceivedPermissions.4.target:
-        "0xaF5800ADF22301968613c37DA9C3C2a486eA915A"
      directlyReceivedPermissions.4.from:
+        "0xaF5800ADF22301968613c37DA9C3C2a486eA915A"
      directlyReceivedPermissions.3.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      directlyReceivedPermissions.3.from:
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      directlyReceivedPermissions.2.target:
-        "0x73C6af7029E714DFf1F1554F88b79B335011Da68"
      directlyReceivedPermissions.2.from:
+        "0x73C6af7029E714DFf1F1554F88b79B335011Da68"
      directlyReceivedPermissions.1.target:
-        "0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048"
      directlyReceivedPermissions.1.from:
+        "0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048"
      directlyReceivedPermissions.0.target:
-        "0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"
      directlyReceivedPermissions.0.from:
+        "0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"
    }
```

```diff
    contract ERC20RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
    }
```

```diff
    contract ERC20Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
    }
```

```diff
    contract HychainMultisig (0x798Fa726f0B4DF564681446D051b344E3FE4a6ca) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"
      receivedPermissions.8.from:
+        "0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"
      receivedPermissions.7.target:
-        "0xD6c596b7ca17870DD50D322393deCE6C2085a116"
      receivedPermissions.7.from:
+        "0xD6c596b7ca17870DD50D322393deCE6C2085a116"
      receivedPermissions.6.target:
-        "0xaF5800ADF22301968613c37DA9C3C2a486eA915A"
      receivedPermissions.6.from:
+        "0xaF5800ADF22301968613c37DA9C3C2a486eA915A"
      receivedPermissions.5.target:
-        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
      receivedPermissions.5.from:
+        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
      receivedPermissions.4.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      receivedPermissions.4.from:
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      receivedPermissions.3.target:
-        "0x73C6af7029E714DFf1F1554F88b79B335011Da68"
      receivedPermissions.3.from:
+        "0x73C6af7029E714DFf1F1554F88b79B335011Da68"
      receivedPermissions.2.target:
-        "0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048"
      receivedPermissions.2.from:
+        "0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048"
      receivedPermissions.1.target:
-        "0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"
      receivedPermissions.1.from:
+        "0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"
      receivedPermissions.0.target:
-        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
      receivedPermissions.0.from:
+        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
      directlyReceivedPermissions.0.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      directlyReceivedPermissions.0.from:
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      directlyReceivedPermissions.2.target:
-        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
      directlyReceivedPermissions.2.from:
+        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
      directlyReceivedPermissions.1.target:
-        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
      directlyReceivedPermissions.1.from:
+        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
      directlyReceivedPermissions.0.target:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
      directlyReceivedPermissions.0.from:
+        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3.target:
-        "0xf0DDa810ed19bb640f2A03e8382814e3f0D36e13"
      issuedPermissions.3.to:
+        "0xf0DDa810ed19bb640f2A03e8382814e3f0D36e13"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0x88781Fb85EA68bd5B8bE4C1C0c1ED94f4fd35647"
      issuedPermissions.2.to:
+        "0x88781Fb85EA68bd5B8bE4C1C0c1ED94f4fd35647"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.target:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.target:
-        "0xC1d59449a546bA80d332De629724df8e9A9e9584"
      issuedPermissions.0.to:
+        "0xC1d59449a546bA80d332De629724df8e9A9e9584"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ERC20Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
    }
```

```diff
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
    }
```

Generated with discovered.json: 0xf1881bfd84dd30c6e9939e4a973abafc5d58c26e

# Diff at Wed, 08 Jan 2025 10:44:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465186
- current block number: 21465186

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465186 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xa70dc72edb8dc18caf34e71db50d659a31d74c63

# Diff at Mon, 23 Dec 2024 12:29:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21272771
- current block number: 21465186

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21272771 (main branch discovery), not current.

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x14284eac296180d9fe3cb6f8ef7ebde365ecf724

# Diff at Fri, 06 Dec 2024 08:09:43 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21272771
- current block number: 21272771

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21272771 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x9d1d74f47e0adf0a6528b1f8f54919a0905b8423

# Diff at Fri, 29 Nov 2024 11:28:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21272771
- current block number: 21272771

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21272771 (main branch discovery), not current.

```diff
    contract HychainMultisig (0x798Fa726f0B4DF564681446D051b344E3FE4a6ca) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

Generated with discovered.json: 0x0ee93f9b08e843913565359c4f4c4058b5ac18b3

# Diff at Wed, 27 Nov 2024 13:20:35 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3b9391cfe483e60a1853eeae6e47b4de475aac4e block: 21041836
- current block number: 21272771

## Description

Move to discodriven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041836 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      displayName:
+        "Outbox"
    }
```

```diff
    contract ERC20Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      displayName:
+        "Bridge"
    }
```

```diff
    contract ERC20Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      displayName:
+        "Inbox"
    }
```

Generated with discovered.json: 0x697622368c046d70f4a6215cc396c5da499a2ca0

# Diff at Fri, 15 Nov 2024 08:18:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21041836
- current block number: 21041836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041836 (main branch discovery), not current.

```diff
    contract ERC20RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048) {
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
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.5:
-        {"permission":"upgrade","target":"0x798Fa726f0B4DF564681446D051b344E3FE4a6ca","via":[{"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","delay":0}]}
      issuedPermissions.4:
-        {"permission":"propose","target":"0xf0DDa810ed19bb640f2A03e8382814e3f0D36e13","via":[]}
      issuedPermissions.3.permission:
-        "propose"
+        "validate"
      issuedPermissions.3.target:
-        "0x88781Fb85EA68bd5B8bE4C1C0c1ED94f4fd35647"
+        "0xf0DDa810ed19bb640f2A03e8382814e3f0D36e13"
      issuedPermissions.2.permission:
-        "configure"
+        "validate"
      issuedPermissions.2.target:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
+        "0x88781Fb85EA68bd5B8bE4C1C0c1ED94f4fd35647"
      issuedPermissions.2.via.0:
-        {"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0xf0DDa810ed19bb640f2A03e8382814e3f0D36e13"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.1.via.0:
+        {"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","delay":0}
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x88781Fb85EA68bd5B8bE4C1C0c1ED94f4fd35647"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.0:
+        {"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

Generated with discovered.json: 0x6e32a3817c44223f35256892c6f73cb5f66f37d9

# Diff at Mon, 04 Nov 2024 07:56:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21041836
- current block number: 21041836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041836 (main branch discovery), not current.

```diff
    contract HychainMultisig (0x798Fa726f0B4DF564681446D051b344E3FE4a6ca) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"},{"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}]}
      receivedPermissions.7.target:
-        "0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"
+        "0xD6c596b7ca17870DD50D322393deCE6C2085a116"
      receivedPermissions.6.target:
-        "0xD6c596b7ca17870DD50D322393deCE6C2085a116"
+        "0xaF5800ADF22301968613c37DA9C3C2a486eA915A"
      receivedPermissions.5.target:
-        "0xaF5800ADF22301968613c37DA9C3C2a486eA915A"
+        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
      receivedPermissions.5.via.1:
-        {"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}
      receivedPermissions.5.via.0.address:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      receivedPermissions.4.target:
-        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      receivedPermissions.4.via.1:
+        {"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}
      receivedPermissions.4.via.0.address:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
      receivedPermissions.3.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0x73C6af7029E714DFf1F1554F88b79B335011Da68"
      receivedPermissions.2.target:
-        "0x73C6af7029E714DFf1F1554F88b79B335011Da68"
+        "0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048"
      receivedPermissions.1.target:
-        "0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048"
+        "0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"
+        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
      receivedPermissions.0.via.1:
-        {"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}
      receivedPermissions.0.via.0.address:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.5:
+        {"permission":"upgrade","target":"0x798Fa726f0B4DF564681446D051b344E3FE4a6ca","via":[{"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","delay":0}]}
      issuedPermissions.4.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.4.target:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
+        "0xf0DDa810ed19bb640f2A03e8382814e3f0D36e13"
      issuedPermissions.4.via.0:
-        {"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","delay":0}
      issuedPermissions.3.target:
-        "0xf0DDa810ed19bb640f2A03e8382814e3f0D36e13"
+        "0x88781Fb85EA68bd5B8bE4C1C0c1ED94f4fd35647"
      issuedPermissions.2.permission:
-        "propose"
+        "configure"
      issuedPermissions.2.target:
-        "0x88781Fb85EA68bd5B8bE4C1C0c1ED94f4fd35647"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.2.via.0:
+        {"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x12f55eb2484efc6ceaf144e336342172c7f2050f

# Diff at Tue, 29 Oct 2024 13:07:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041836
- current block number: 21041836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041836 (main branch discovery), not current.

```diff
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0x841c99d607e4e2b5ef340477ea694be1e4612526

# Diff at Tue, 29 Oct 2024 08:02:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041836
- current block number: 21041836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041836 (main branch discovery), not current.

```diff
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
    }
```

```diff
    contract ERC20RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
    }
```

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
    }
```

```diff
    contract HychainMultisig (0x798Fa726f0B4DF564681446D051b344E3FE4a6ca) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"},{"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}]},{"permission":"upgrade","target":"0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"},{"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}]},{"permission":"upgrade","target":"0x73C6af7029E714DFf1F1554F88b79B335011Da68","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"},{"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}]},{"permission":"upgrade","target":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"},{"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}]},{"permission":"upgrade","target":"0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B","via":[{"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}]},{"permission":"upgrade","target":"0xaF5800ADF22301968613c37DA9C3C2a486eA915A","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"},{"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}]},{"permission":"upgrade","target":"0xD6c596b7ca17870DD50D322393deCE6C2085a116","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"},{"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}]},{"permission":"upgrade","target":"0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"},{"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"}]
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]},{"permission":"upgrade","target":"0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]},{"permission":"upgrade","target":"0x73C6af7029E714DFf1F1554F88b79B335011Da68","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]},{"permission":"upgrade","target":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]},{"permission":"upgrade","target":"0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"},{"permission":"upgrade","target":"0xaF5800ADF22301968613c37DA9C3C2a486eA915A","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]},{"permission":"upgrade","target":"0xD6c596b7ca17870DD50D322393deCE6C2085a116","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]},{"permission":"upgrade","target":"0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"}
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.4.via.0:
+        {"address":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","delay":0}
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.1.via.1:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
    }
```

```diff
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
    }
```

```diff
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      issuedPermissions.0.via.1:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
    }
```

Generated with discovered.json: 0xb537dbe57d573aff09c4c57eea65a7d414beaa42

# Diff at Mon, 28 Oct 2024 14:19:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041836
- current block number: 21041836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041836 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"]
    }
```

Generated with discovered.json: 0x28f76ccab7c5f03f6046362450c67070b20dc3ff

# Diff at Fri, 25 Oct 2024 09:49:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20842790
- current block number: 21041836

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842790 (main branch discovery), not current.

```diff
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      issuedPermissions.0.via.0:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"},{"permission":"upgrade","target":"0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048"},{"permission":"upgrade","target":"0x73C6af7029E714DFf1F1554F88b79B335011Da68"},{"permission":"upgrade","target":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"},{"permission":"upgrade","target":"0xaF5800ADF22301968613c37DA9C3C2a486eA915A"},{"permission":"upgrade","target":"0xD6c596b7ca17870DD50D322393deCE6C2085a116"},{"permission":"upgrade","target":"0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"},{"permission":"upgrade","target":"0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048"},{"permission":"upgrade","target":"0x73C6af7029E714DFf1F1554F88b79B335011Da68"},{"permission":"upgrade","target":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"},{"permission":"upgrade","target":"0xaF5800ADF22301968613c37DA9C3C2a486eA915A"},{"permission":"upgrade","target":"0xD6c596b7ca17870DD50D322393deCE6C2085a116"},{"permission":"upgrade","target":"0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      issuedPermissions.0.via.0:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
    }
```

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      issuedPermissions.0.via.0:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      issuedPermissions.0.via.0:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xD6c596b7ca17870DD50D322393deCE6C2085a116","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xaF5800ADF22301968613c37DA9C3C2a486eA915A","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x73C6af7029E714DFf1F1554F88b79B335011Da68","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048","via":[{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]}
      receivedPermissions.0.target:
-        "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"
+        "0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"
      receivedPermissions.0.via:
+        [{"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"}]
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      issuedPermissions.1.via.0:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
    }
```

```diff
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      issuedPermissions.0.via.0:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
    }
```

```diff
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      issuedPermissions.0.via.0:
+        {"address":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","delay":0}
    }
```

Generated with discovered.json: 0x329eeee4eea4fb6c7f5d9ccb83700195a4a701f3

# Diff at Wed, 23 Oct 2024 14:35:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20842790
- current block number: 20842790

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842790 (main branch discovery), not current.

```diff
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
```

```diff
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
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
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.4:
+        {"permission":"upgrade","target":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","via":[]}
      issuedPermissions.3:
+        {"permission":"propose","target":"0xf0DDa810ed19bb640f2A03e8382814e3f0D36e13","via":[]}
      issuedPermissions.2.permission:
-        "validate"
+        "propose"
      issuedPermissions.2.target:
-        "0xf0DDa810ed19bb640f2A03e8382814e3f0D36e13"
+        "0x88781Fb85EA68bd5B8bE4C1C0c1ED94f4fd35647"
      issuedPermissions.1.permission:
-        "validate"
+        "challenge"
      issuedPermissions.1.target:
-        "0x88781Fb85EA68bd5B8bE4C1C0c1ED94f4fd35647"
+        "0xf0DDa810ed19bb640f2A03e8382814e3f0D36e13"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0x88781Fb85EA68bd5B8bE4C1C0c1ED94f4fd35647"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v11.1 wasmModuleRoot"
+        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v11.1 wasmModuleRoot"
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
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

Generated with discovered.json: 0x7a2056067cec5d52c1b8a63b2e738a3fb55fdf0d

# Diff at Mon, 21 Oct 2024 12:44:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20842790
- current block number: 20842790

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842790 (main branch discovery), not current.

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0x2e2ccb062618084cea0ee4ea3d78b42c66ea381c

# Diff at Mon, 21 Oct 2024 11:06:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20842790
- current block number: 20842790

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842790 (main branch discovery), not current.

```diff
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x19431dc37098877486532250FB3158140717C00C"]
      values.$pastUpgrades.0.1:
-        ["0x19431dc37098877486532250FB3158140717C00C"]
+        "0x0189408056104b3ae135806be8f29175efe35f6ca587fbd540dd95d16bb1482c"
    }
```

```diff
    contract ERC20RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
      values.$pastUpgrades.0.1:
-        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
+        "0x0189408056104b3ae135806be8f29175efe35f6ca587fbd540dd95d16bb1482c"
    }
```

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
      values.$pastUpgrades.0.1:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0x0189408056104b3ae135806be8f29175efe35f6ca587fbd540dd95d16bb1482c"
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0x0189408056104b3ae135806be8f29175efe35f6ca587fbd540dd95d16bb1482c"
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x0189408056104b3ae135806be8f29175efe35f6ca587fbd540dd95d16bb1482c"
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
      values.$pastUpgrades.0.1:
-        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
+        "0x0189408056104b3ae135806be8f29175efe35f6ca587fbd540dd95d16bb1482c"
    }
```

```diff
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
      values.$pastUpgrades.0.1:
-        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
+        "0x0189408056104b3ae135806be8f29175efe35f6ca587fbd540dd95d16bb1482c"
    }
```

```diff
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
+        "0x0189408056104b3ae135806be8f29175efe35f6ca587fbd540dd95d16bb1482c"
    }
```

Generated with discovered.json: 0x656ba8b98c3dfc43b45f23aecf3badca47240abb

# Diff at Wed, 16 Oct 2024 11:36:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20842790
- current block number: 20842790

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842790 (main branch discovery), not current.

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.2:
+        {"permission":"validate","target":"0xf0DDa810ed19bb640f2A03e8382814e3f0D36e13","via":[]}
      issuedPermissions.1:
+        {"permission":"validate","target":"0x88781Fb85EA68bd5B8bE4C1C0c1ED94f4fd35647","via":[]}
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x4C5984E3841790335E6DC2e7ed92802FbF8a300F"
+        "0xC1d59449a546bA80d332De629724df8e9A9e9584"
    }
```

Generated with discovered.json: 0x0d238c0c349a1f55f08528fc1921fb332d38ebf2

# Diff at Mon, 14 Oct 2024 10:51:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20842790
- current block number: 20842790

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842790 (main branch discovery), not current.

```diff
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
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
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

```diff
    contract HychainMultisig (0x798Fa726f0B4DF564681446D051b344E3FE4a6ca) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: None
      sourceHashes:
+        ["0x0a8f8db8198082757cc8145891c633c20ed4313dab05beab40618258e534a1e8"]
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
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"]
    }
```

```diff
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"]
    }
```

Generated with discovered.json: 0xa8e5129ed237bd434b44539658b3007bbe0c2216

# Diff at Tue, 01 Oct 2024 10:51:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842790
- current block number: 20842790

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842790 (main branch discovery), not current.

```diff
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-05T02:34:47.000Z",["0x19431dc37098877486532250FB3158140717C00C"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-05T02:34:47.000Z",["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]]]
    }
```

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-05T02:34:47.000Z",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]]
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-05T02:34:47.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-03-05T02:34:47.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-03-05T02:34:47.000Z",["0x873484Ba63353C8b71210ce123B465512d408B27"]]]
    }
```

```diff
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-05T02:34:47.000Z",["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]]]
    }
```

```diff
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-05T02:34:47.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]]]
    }
```

Generated with discovered.json: 0x84cedf8f51a93125425a05c5b54f98293858684e

# Diff at Fri, 27 Sep 2024 15:15:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20583935
- current block number: 20842790

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583935 (main branch discovery), not current.

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x962ff1ddd9674aedc5d8e9a35e8a10faa962ff19

# Diff at Sun, 01 Sep 2024 08:45:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20583935
- current block number: 20583935

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583935 (main branch discovery), not current.

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
+        "ArbOS v11.1 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x3237194f6dc60e7c4f9d8d8fea14bd87179f4989

# Diff at Fri, 30 Aug 2024 07:53:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20583935
- current block number: 20583935

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583935 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F) {
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

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xa965bd7cb474213d074174f2b220512996a58619

# Diff at Fri, 23 Aug 2024 09:52:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20583935
- current block number: 20583935

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583935 (main branch discovery), not current.

```diff
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xa78d0dfbe50014a7f18693014e9aa908aa232e31

# Diff at Thu, 22 Aug 2024 11:47:04 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 20177349
- current block number: 20583935

## Description

New handler now fetching BLS signature keys of DAC members. EOA that can upgrade is removed.

## Watched changes

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x42875471D43d54B538B333F041E75a9a45Bf3Aa0"
+        "0x798Fa726f0B4DF564681446D051b344E3FE4a6ca"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177349 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBW51S21zw469kP9ztjGZG61FtnLVawzRnntDkNwhMaUIo8nNAU/FcH4LgPayQ60cQtu1MiKT+Vd2p0a0czxeoy4tLpnskmTMxhtCmxYNHNoQCmPW92k7OEnUnu84140NQmLidPlrteSkBwZeQVbOkNqMRkvGw6OCb2QmMk6cmqtxVmAvUeTKdM98+TqdJXuwwxR8YtxeKR4EI5ErnhcNRXpgNUpATc1o+aRjy1TvZZgE1FhIcKmOQSSly1JdiDYAQD3sYcPPX4ywtlJgDz723s71zVCSkJ7l/uFLH6M4HJbaMFCgv+bdf+cu5ZNEKPgpRIPtNWxMLXi/rE8o3H+0JZCs1B3LZsWBbfOtc4bhvvCkxBzdJI1ddqoVxbdzdkzDg=="]
    }
```

Generated with discovered.json: 0x4d122288ae295fc07f06e793fca6cfbe7e019162

# Diff at Wed, 21 Aug 2024 10:03:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20177349
- current block number: 20177349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177349 (main branch discovery), not current.

```diff
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd","0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048","0x73C6af7029E714DFf1F1554F88b79B335011Da68","0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","0xD6c596b7ca17870DD50D322393deCE6C2085a116","0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e","0xaF5800ADF22301968613c37DA9C3C2a486eA915A"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd","via":[]},{"permission":"upgrade","target":"0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048","via":[]},{"permission":"upgrade","target":"0x73C6af7029E714DFf1F1554F88b79B335011Da68","via":[]},{"permission":"upgrade","target":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","via":[]},{"permission":"upgrade","target":"0xaF5800ADF22301968613c37DA9C3C2a486eA915A","via":[]},{"permission":"upgrade","target":"0xD6c596b7ca17870DD50D322393deCE6C2085a116","via":[]},{"permission":"upgrade","target":"0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","via":[]}]
    }
```

```diff
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B","via":[]}]
    }
```

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","via":[]}]
    }
```

```diff
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","via":[]}]
    }
```

```diff
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4C5984E3841790335E6DC2e7ed92802FbF8a300F","via":[]}]
    }
```

Generated with discovered.json: 0xb0297799aaad5b4e119c315a84ae50643a15cb65

# Diff at Fri, 09 Aug 2024 11:59:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20177349
- current block number: 20177349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177349 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F) {
    +++ description: None
      assignedPermissions.upgrade.6:
-        "0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"
+        "0xaF5800ADF22301968613c37DA9C3C2a486eA915A"
      assignedPermissions.upgrade.5:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"
      assignedPermissions.upgrade.4:
-        "0xaF5800ADF22301968613c37DA9C3C2a486eA915A"
+        "0xD6c596b7ca17870DD50D322393deCE6C2085a116"
      assignedPermissions.upgrade.3:
-        "0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      assignedPermissions.upgrade.2:
-        "0xD6c596b7ca17870DD50D322393deCE6C2085a116"
+        "0x73C6af7029E714DFf1F1554F88b79B335011Da68"
      assignedPermissions.upgrade.0:
-        "0x73C6af7029E714DFf1F1554F88b79B335011Da68"
+        "0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"
    }
```

Generated with discovered.json: 0xcd774a3cda56f993e964a044bac1adca6e983a6a

# Diff at Fri, 09 Aug 2024 10:09:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20177349
- current block number: 20177349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177349 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd","0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048","0x73C6af7029E714DFf1F1554F88b79B335011Da68","0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","0xD6c596b7ca17870DD50D322393deCE6C2085a116","0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e","0xaF5800ADF22301968613c37DA9C3C2a486eA915A"]
      assignedPermissions.upgrade:
+        ["0x73C6af7029E714DFf1F1554F88b79B335011Da68","0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048","0xD6c596b7ca17870DD50D322393deCE6C2085a116","0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd","0xaF5800ADF22301968613c37DA9C3C2a486eA915A","0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"]
    }
```

```diff
    contract HychainMultisig (0x798Fa726f0B4DF564681446D051b344E3FE4a6ca) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x42875471D43d54B538B333F041E75a9a45Bf3Aa0","0x356000Cec4fC967f8FC372381D983426760A0391","0x9A80c6437ad9b6E7a1608814cBab93dEeecf388a","0xF77010B8a68512c67bBca86ef39BeA6B3c064423","0xe8417C755391Ea9c0D4Bf50f764275574125B32f"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x42875471D43d54B538B333F041E75a9a45Bf3Aa0","0x356000Cec4fC967f8FC372381D983426760A0391","0x9A80c6437ad9b6E7a1608814cBab93dEeecf388a","0xF77010B8a68512c67bBca86ef39BeA6B3c064423","0xe8417C755391Ea9c0D4Bf50f764275574125B32f"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"]
      assignedPermissions.upgrade:
+        ["0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"]
    }
```

Generated with discovered.json: 0x9f1c99d8297e3df592325c90270985a3a8be22e9

# Diff at Tue, 30 Jul 2024 11:11:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20177349
- current block number: 20177349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177349 (main branch discovery), not current.

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0x9a88870fbfc85475568a386fb1fd26a961e6bd6a

# Diff at Wed, 19 Jun 2024 08:44:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 19968589
- current block number: 20124667

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19968589 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0x365ff8f6ff141602e7c18f1af69df509bf520b3b

# Diff at Tue, 28 May 2024 13:13:22 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19968589

## Description

Initial discovery: Orbit stack L2 with Admin EOA, 1/1 AnyTrust DA

## Initial discovery

```diff
+   Status: CREATED
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
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
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HychainMultisig (0x798Fa726f0B4DF564681446D051b344E3FE4a6ca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e)
    +++ description: None
```
