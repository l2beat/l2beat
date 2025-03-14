Generated with discovered.json: 0x83d953382f841d7fd377047f490d5ba670b26d0a

# Diff at Fri, 07 Mar 2025 09:16:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21723964
- current block number: 21994049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723964 (main branch discovery), not current.

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x0fd9d34c1fe8388380d38f386589db3429bf66b9

# Diff at Thu, 06 Mar 2025 09:39:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21723964
- current block number: 21723964

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723964 (main branch discovery), not current.

```diff
    contract Bridge (0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xE961Ef06c26D0f032F0298c97C41e648d3bb715a","0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x0b8071337dcB089478Ea740efC10904d9F359141"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xec2ecb5d0a3b00810d4a20e70ad83939cb12d963

# Diff at Tue, 04 Mar 2025 10:40:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21723964
- current block number: 21723964

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723964 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569170
    }
```

```diff
    contract Outbox (0x0b8071337dcB089478Ea740efC10904d9F359141) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        19934834
    }
```

```diff
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569168
    }
```

```diff
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        19934834
    }
```

```diff
    contract ProxyAdmin (0x22010F5C4c106dfBaffec780196d2F691860Ff62) {
    +++ description: None
      sinceBlock:
+        19934834
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
    contract Bridge (0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        19934834
    }
```

```diff
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569167
    }
```

```diff
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        19934834
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
    contract RollupEventInbox (0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        19934834
    }
```

```diff
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569171
    }
```

```diff
    contract ChallengeManager (0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        19934834
    }
```

```diff
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569169
    }
```

```diff
    contract Inbox (0xE961Ef06c26D0f032F0298c97C41e648d3bb715a) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        19934834
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        19934834
    }
```

Generated with discovered.json: 0xd3dff395b1b8cc7449ad2e0183f20dec6f30e56a

# Diff at Fri, 21 Feb 2025 14:11:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21723964
- current block number: 21723964

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723964 (main branch discovery), not current.

```diff
    contract Outbox (0x0b8071337dcB089478Ea740efC10904d9F359141) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract Bridge (0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ChallengeManager (0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Inbox (0xE961Ef06c26D0f032F0298c97C41e648d3bb715a) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x945b534d3f355f8b726d6ae1c5e14ea8088fc6ca

# Diff at Tue, 04 Feb 2025 12:33:24 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21723964
- current block number: 21723964

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723964 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xaf5a22d240bf882f61ee24fa7b0d4e6d1cbee9f4

# Diff at Tue, 28 Jan 2025 15:38:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 21637090
- current block number: 21723964

## Description

Standard upgrade to ArbOS v32 (known contracts).

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.1:
+        ["2025-01-27T14:42:23.000Z","0xd42a54d12572f4bf947d60e6a7d18eec03dab7c27774141a243e1d2bcb329dd9",["0x02E05A9245C5853f895daDcc3A8216C953C8736B"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
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
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$pastUpgrades.1:
+        ["2025-01-27T14:42:23.000Z","0xd42a54d12572f4bf947d60e6a7d18eec03dab7c27774141a243e1d2bcb329dd9",["0x9B56A789fEDD5df27dBaB53b085F7157397cA17D","0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"]]
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
+   Status: CREATED
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@21637090 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

Generated with discovered.json: 0xa53e79cf0404be623ea265493d4c3cdf3d5e41f0

# Diff at Mon, 20 Jan 2025 11:10:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637090
- current block number: 21637090

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637090 (main branch discovery), not current.

```diff
    contract Outbox (0x0b8071337dcB089478Ea740efC10904d9F359141) {
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
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
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
-        "0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"
      directlyReceivedPermissions.2.from:
+        "0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"
      directlyReceivedPermissions.1.target:
-        "0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"
      directlyReceivedPermissions.1.from:
+        "0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"
      directlyReceivedPermissions.0.target:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
      directlyReceivedPermissions.0.from:
+        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
    }
```

```diff
    contract ProxyAdmin (0x22010F5C4c106dfBaffec780196d2F691860Ff62) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xE961Ef06c26D0f032F0298c97C41e648d3bb715a"
      directlyReceivedPermissions.6.from:
+        "0xE961Ef06c26D0f032F0298c97C41e648d3bb715a"
      directlyReceivedPermissions.5.target:
-        "0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D"
      directlyReceivedPermissions.5.from:
+        "0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D"
      directlyReceivedPermissions.4.target:
-        "0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b"
      directlyReceivedPermissions.4.from:
+        "0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b"
      directlyReceivedPermissions.3.target:
-        "0x47861E0419BE83d0175818a09221B6DF2EFD7793"
      directlyReceivedPermissions.3.from:
+        "0x47861E0419BE83d0175818a09221B6DF2EFD7793"
      directlyReceivedPermissions.2.target:
-        "0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1"
      directlyReceivedPermissions.2.from:
+        "0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1"
      directlyReceivedPermissions.1.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      directlyReceivedPermissions.1.from:
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      directlyReceivedPermissions.0.target:
-        "0x0b8071337dcB089478Ea740efC10904d9F359141"
      directlyReceivedPermissions.0.from:
+        "0x0b8071337dcB089478Ea740efC10904d9F359141"
    }
```

```diff
    contract Bridge (0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1) {
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
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
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
-        "0x74978411BbBCbC466e79fb855DAe981997100deB"
      issuedPermissions.0.to:
+        "0x74978411BbBCbC466e79fb855DAe981997100deB"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"
      receivedPermissions.8.from:
+        "0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"
      receivedPermissions.7.target:
-        "0xE961Ef06c26D0f032F0298c97C41e648d3bb715a"
      receivedPermissions.7.from:
+        "0xE961Ef06c26D0f032F0298c97C41e648d3bb715a"
      receivedPermissions.6.target:
-        "0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D"
      receivedPermissions.6.from:
+        "0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D"
      receivedPermissions.5.target:
-        "0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b"
      receivedPermissions.5.from:
+        "0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b"
      receivedPermissions.4.target:
-        "0x47861E0419BE83d0175818a09221B6DF2EFD7793"
      receivedPermissions.4.from:
+        "0x47861E0419BE83d0175818a09221B6DF2EFD7793"
      receivedPermissions.3.target:
-        "0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1"
      receivedPermissions.3.from:
+        "0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1"
      receivedPermissions.2.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      receivedPermissions.2.from:
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      receivedPermissions.1.target:
-        "0x0b8071337dcB089478Ea740efC10904d9F359141"
      receivedPermissions.1.from:
+        "0x0b8071337dcB089478Ea740efC10904d9F359141"
      receivedPermissions.0.target:
-        "0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"
      receivedPermissions.0.from:
+        "0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"
      directlyReceivedPermissions.0.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      directlyReceivedPermissions.0.from:
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
    }
```

```diff
    contract RollupEventInbox (0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b) {
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
    contract ChallengeManager (0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D) {
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

```diff
    contract Inbox (0xE961Ef06c26D0f032F0298c97C41e648d3bb715a) {
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
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x115B6563C9237B1Ff6f9E2B2a825B210ECDE021e"
      issuedPermissions.2.to:
+        "0x115B6563C9237B1Ff6f9E2B2a825B210ECDE021e"
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

Generated with discovered.json: 0x91b87fa9ced327fd168934f21dd57b7627c0a2d7

# Diff at Thu, 16 Jan 2025 12:38:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21465246
- current block number: 21637090

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

Generated with discovered.json: 0x079a78df82375da6ae460d7818ccea079bcccff7

# Diff at Wed, 08 Jan 2025 10:44:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465246
- current block number: 21465246

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465246 (main branch discovery), not current.

```diff
    contract Bridge (0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x68fa27c22bc84d69cb2700c5fc273f12d196f95d

# Diff at Mon, 23 Dec 2024 12:41:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21292533
- current block number: 21465246

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292533 (main branch discovery), not current.

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x3e1c3e24cab24e878b53534cc353056644a14466

# Diff at Thu, 05 Dec 2024 11:52:45 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21292533
- current block number: 21292533

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292533 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x486a804ef06aa05bafb514e070dc1f9d445fd423

# Diff at Fri, 29 Nov 2024 11:28:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21292533
- current block number: 21292533

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292533 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

Generated with discovered.json: 0x5c4879f6c32b8b1f0925a5997497864642a99d1c

# Diff at Fri, 15 Nov 2024 08:18:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21093452
- current block number: 21093452

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21093452 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract RollupEventInbox (0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract Inbox (0xE961Ef06c26D0f032F0298c97C41e648d3bb715a) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110","delay":0}]}
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
-        "0x115B6563C9237B1Ff6f9E2B2a825B210ECDE021e"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0x3420198a5c9ec0faad6b5bc649ed2692d3faf608

# Diff at Mon, 04 Nov 2024 08:00:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21093452
- current block number: 21093452

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21093452 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
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
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d","via":[{"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}]}
      receivedPermissions.7.target:
-        "0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"
+        "0xE961Ef06c26D0f032F0298c97C41e648d3bb715a"
      receivedPermissions.7.via.1:
+        {"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}
      receivedPermissions.7.via.0.address:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
+        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
      receivedPermissions.6.target:
-        "0xE961Ef06c26D0f032F0298c97C41e648d3bb715a"
+        "0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D"
      receivedPermissions.5.target:
-        "0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D"
+        "0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b"
      receivedPermissions.4.target:
-        "0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b"
+        "0x47861E0419BE83d0175818a09221B6DF2EFD7793"
      receivedPermissions.3.target:
-        "0x47861E0419BE83d0175818a09221B6DF2EFD7793"
+        "0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1"
      receivedPermissions.2.target:
-        "0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      receivedPermissions.1.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
+        "0x0b8071337dcB089478Ea740efC10904d9F359141"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x0b8071337dcB089478Ea740efC10904d9F359141"
+        "0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"
      receivedPermissions.0.via.1:
-        {"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}
      receivedPermissions.0.via.0.address:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x115B6563C9237B1Ff6f9E2B2a825B210ECDE021e"
      issuedPermissions.2.via.0:
-        {"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0x115B6563C9237B1Ff6f9E2B2a825B210ECDE021e"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0:
+        {"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0xfd2cbee683c93bb056e217b72fecce008982026a

# Diff at Fri, 01 Nov 2024 14:40:34 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078680
- current block number: 21093452

## Description

Discovery refresh to apply template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078680 (main branch discovery), not current.

```diff
    contract Outbox (0x0b8071337dcB089478Ea740efC10904d9F359141) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x1ede9e149ee2e9d93ad6ab5e75ce12ff88804498

# Diff at Wed, 30 Oct 2024 13:13:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 21041874
- current block number: 21078680

## Description

Conduit MS: Signer added.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.7:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.6:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.5:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.4:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.3:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.2:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.1:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.0:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0xdcb42ced4ccd0550ca20f6dc3b36dcda08c65a8d

# Diff at Tue, 29 Oct 2024 13:19:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041874
- current block number: 21041874

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041874 (main branch discovery), not current.

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0xe08c40df397806c3eb5d5d232f73c7f36047409b

# Diff at Tue, 29 Oct 2024 08:07:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041874
- current block number: 21041874

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041874 (main branch discovery), not current.

```diff
    contract Outbox (0x0b8071337dcB089478Ea740efC10904d9F359141) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
    }
```

```diff
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0b8071337dcB089478Ea740efC10904d9F359141","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]},{"permission":"upgrade","target":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]},{"permission":"upgrade","target":"0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]},{"permission":"upgrade","target":"0x47861E0419BE83d0175818a09221B6DF2EFD7793","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]},{"permission":"upgrade","target":"0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]},{"permission":"upgrade","target":"0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]},{"permission":"upgrade","target":"0xE961Ef06c26D0f032F0298c97C41e648d3bb715a","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]},{"permission":"upgrade","target":"0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"}
    }
```

```diff
    contract Bridge (0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
    }
```

```diff
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.1:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0b8071337dcB089478Ea740efC10904d9F359141","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"},{"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}]},{"permission":"upgrade","target":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"},{"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}]},{"permission":"upgrade","target":"0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"},{"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}]},{"permission":"upgrade","target":"0x47861E0419BE83d0175818a09221B6DF2EFD7793","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"},{"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}]},{"permission":"upgrade","target":"0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"},{"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}]},{"permission":"upgrade","target":"0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"},{"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}]},{"permission":"upgrade","target":"0xE961Ef06c26D0f032F0298c97C41e648d3bb715a","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"},{"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}]},{"permission":"upgrade","target":"0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d","via":[{"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"}]
    }
```

```diff
    contract RollupEventInbox (0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
    }
```

```diff
    contract ChallengeManager (0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
    }
```

```diff
    contract Inbox (0xE961Ef06c26D0f032F0298c97C41e648d3bb715a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.1:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0:
+        {"address":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110","delay":0}
    }
```

Generated with discovered.json: 0x00d7e71ababec0b0da7d8031a20ffd3f25a7a21b

# Diff at Mon, 28 Oct 2024 14:06:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041874
- current block number: 21041874

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041874 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"]
    }
```

Generated with discovered.json: 0xff2eaaf16e988bb1822c85e0d7f07f3c03e6ed8a

# Diff at Fri, 25 Oct 2024 09:56:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20977673
- current block number: 21041874

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977673 (main branch discovery), not current.

```diff
    contract Outbox (0x0b8071337dcB089478Ea740efC10904d9F359141) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      issuedPermissions.0.via.0:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      issuedPermissions.0.via.0:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xE961Ef06c26D0f032F0298c97C41e648d3bb715a","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x47861E0419BE83d0175818a09221B6DF2EFD7793","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110","via":[{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]}
      receivedPermissions.0.target:
-        "0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d"
+        "0x0b8071337dcB089478Ea740efC10904d9F359141"
      receivedPermissions.0.via:
+        [{"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x22010F5C4c106dfBaffec780196d2F691860Ff62"}]
    }
```

```diff
    contract ProxyAdmin (0x22010F5C4c106dfBaffec780196d2F691860Ff62) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0b8071337dcB089478Ea740efC10904d9F359141"},{"permission":"upgrade","target":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"},{"permission":"upgrade","target":"0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1"},{"permission":"upgrade","target":"0x47861E0419BE83d0175818a09221B6DF2EFD7793"},{"permission":"upgrade","target":"0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b"},{"permission":"upgrade","target":"0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D"},{"permission":"upgrade","target":"0xE961Ef06c26D0f032F0298c97C41e648d3bb715a"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0b8071337dcB089478Ea740efC10904d9F359141"},{"permission":"upgrade","target":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"},{"permission":"upgrade","target":"0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1"},{"permission":"upgrade","target":"0x47861E0419BE83d0175818a09221B6DF2EFD7793"},{"permission":"upgrade","target":"0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b"},{"permission":"upgrade","target":"0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D"},{"permission":"upgrade","target":"0xE961Ef06c26D0f032F0298c97C41e648d3bb715a"}]
    }
```

```diff
    contract Bridge (0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      issuedPermissions.0.via.0:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
    }
```

```diff
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      issuedPermissions.1.via.0:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
    }
```

```diff
    contract RollupEventInbox (0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      issuedPermissions.0.via.0:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
    }
```

```diff
    contract ChallengeManager (0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      issuedPermissions.0.via.0:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
    }
```

```diff
    contract Inbox (0xE961Ef06c26D0f032F0298c97C41e648d3bb715a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
      issuedPermissions.0.via.0:
+        {"address":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","delay":0}
    }
```

Generated with discovered.json: 0xf02ca9d95fc7496d2f8756fd2f0b38e4abffa1f7

# Diff at Wed, 23 Oct 2024 14:36:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20977673
- current block number: 20977673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977673 (main branch discovery), not current.

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
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
-   Status: DELETED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
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
    contract ChallengeManager (0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x20195677a6De5f0f7dF4e21cE48F0D24e5477110","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x20195677a6De5f0f7dF4e21cE48F0D24e5477110"
+        "0x115B6563C9237B1Ff6f9E2B2a825B210ECDE021e"
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

Generated with discovered.json: 0x3426cc0d9a5c9673e31fc40e1ffd585f6457ae14

# Diff at Mon, 21 Oct 2024 12:50:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20977673
- current block number: 20977673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977673 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0xea9fb54d6ba3151f1ef04acbaba86e364d3ea4b9

# Diff at Mon, 21 Oct 2024 11:12:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20977673
- current block number: 20977673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977673 (main branch discovery), not current.

```diff
    contract Outbox (0x0b8071337dcB089478Ea740efC10904d9F359141) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0x07ff03aac60a3749cb5933d26f371a1d9956dcd6a045c719a91159c8b8d5e976"
    }
```

```diff
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0x07ff03aac60a3749cb5933d26f371a1d9956dcd6a045c719a91159c8b8d5e976"
    }
```

```diff
    contract Bridge (0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0x07ff03aac60a3749cb5933d26f371a1d9956dcd6a045c719a91159c8b8d5e976"
    }
```

```diff
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.1.2:
+        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
      values.$pastUpgrades.1.1:
-        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
+        "0xc0e712054d68a04705baff16b7a9a90250799a1747911b98720cdb6c41d64b68"
      values.$pastUpgrades.0.2:
+        ["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]
      values.$pastUpgrades.0.1:
-        ["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]
+        "0x07ff03aac60a3749cb5933d26f371a1d9956dcd6a045c719a91159c8b8d5e976"
    }
```

```diff
    contract RollupEventInbox (0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0x07ff03aac60a3749cb5933d26f371a1d9956dcd6a045c719a91159c8b8d5e976"
    }
```

```diff
    contract ChallengeManager (0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
      values.$pastUpgrades.0.1:
-        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
+        "0x07ff03aac60a3749cb5933d26f371a1d9956dcd6a045c719a91159c8b8d5e976"
    }
```

```diff
    contract Inbox (0xE961Ef06c26D0f032F0298c97C41e648d3bb715a) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
      values.$pastUpgrades.0.1:
-        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
+        "0x07ff03aac60a3749cb5933d26f371a1d9956dcd6a045c719a91159c8b8d5e976"
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x07ff03aac60a3749cb5933d26f371a1d9956dcd6a045c719a91159c8b8d5e976"
    }
```

Generated with discovered.json: 0x120814a1099c68ac0d803b18fcb0c4876340cee7

# Diff at Wed, 16 Oct 2024 11:43:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20977673
- current block number: 20977673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977673 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x74978411BbBCbC466e79fb855DAe981997100deB"
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x115B6563C9237B1Ff6f9E2B2a825B210ECDE021e","via":[]}
    }
```

Generated with discovered.json: 0x98c08a0bc05af5509c46803eaccbb3ef230cae4b

# Diff at Wed, 16 Oct 2024 10:58:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20977673

## Description

Standard Orbit stack Optimium by Conduit (AnyTrust 1/1).

## Initial discovery

```diff
+   Status: CREATED
    contract Outbox (0x0b8071337dcB089478Ea740efC10904d9F359141)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x22010F5C4c106dfBaffec780196d2F691860Ff62)
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
    contract Bridge (0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b)
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

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xE961Ef06c26D0f032F0298c97C41e648d3bb715a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```
