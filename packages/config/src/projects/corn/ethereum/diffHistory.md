Generated with discovered.json: 0xc9a51e9fcbc7205b757edbf58a52de73406d9f4f

# Diff at Thu, 08 May 2025 08:23:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 21993984
- current block number: 22437609

## Description

Standard Orbit upgrade with minor changes.

## Watched changes

```diff
    contract Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xb2c117c2e00734a82fe4ab27d5fe91a6e152c06bbcdbf83db021ad32b6be3e60"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0x85a77E293a81d4C35F304951e41378E5e43d1f53"
+        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.$pastUpgrades.1:
+        ["2025-05-06T17:15:47.000Z","0xaa90fa8f865acd5f13e46ab7aa76d3eee29a749c04601905433d8229ef00cd6e",["0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.0x85a77E293a81d4C35F304951e41378E5e43d1f53:
-        "ERC20Inbox"
      implementationNames.0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4:
+        "ERC20Inbox"
    }
```

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x46FaF6838Bbf770986f073348D41881D5e54Fb0F"
+        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.$pastUpgrades.1:
+        ["2025-05-06T17:15:47.000Z","0xaa90fa8f865acd5f13e46ab7aa76d3eee29a749c04601905433d8229ef00cd6e",["0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"]]
      values.$upgradeCount:
-        1
+        2
      values.reader4844:
-        "0xf15a3c17FE45415acE1bBb87157487B9a3F50169"
+        "0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
      implementationNames.0x46FaF6838Bbf770986f073348D41881D5e54Fb0F:
-        "SequencerInbox"
      implementationNames.0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18:
+        "SequencerInbox"
    }
```

## Source code changes

```diff
.../{.flat@21993984 => .flat}/Inbox/ERC20Inbox.sol | 16 +++++++++++++--
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++++++++++-------
 2 files changed, 31 insertions(+), 9 deletions(-)
```

Generated with discovered.json: 0xcf135926c39513d2dce814b8a9f99029e0a8583f

# Diff at Fri, 02 May 2025 17:23:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 21993984
- current block number: 21993984

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21993984 (main branch discovery), not current.

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x82bb4cb0bc9d3efca470065ff5c4d9f9fd852b62

# Diff at Tue, 29 Apr 2025 08:19:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21993984
- current block number: 21993984

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21993984 (main branch discovery), not current.

```diff
    contract Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x9298413c781c241aF6F6733b7df00De5D4A42D93","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"validate","to":"0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

```diff
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCff1ad9f09b32252171207e8525c90B18D4E2C7D","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"},{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"}]}]
    }
```

Generated with discovered.json: 0x065e55fd47dc370d30fbfcac7d1aa4f53804ff5e

# Diff at Fri, 07 Mar 2025 09:06:24 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21642560
- current block number: 21993984

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xa18be53e91c11cef124bc91cc5e6b4edc9d9c742

# Diff at Thu, 06 Mar 2025 09:38:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21642560
- current block number: 21642560

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x37693F11f3D724E55D0B03D5F328D8202C913243","0x6282197777e7c318C7209bd7059110886aa429C6","0xde43165ED9d31CcF94747227aA1F3B98B3adf6d2"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x28267fb5261f1cf2cb4b6cb78f50528a33246a59

# Diff at Tue, 04 Mar 2025 10:39:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21642560
- current block number: 21642560

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract wBTC Escrow (0x00943b11764176C3a8323aEFCBd6fE70CFb6272d) {
    +++ description: None
      sinceBlock:
+        21379583
    }
```

```diff
    contract OneStepProverMath (0x036147913eEb42E97790F9a693246c8444290AB6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20643936
    }
```

```diff
    contract OneStepProverMemory (0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20643935
    }
```

```diff
    contract OneStepProverHostIo (0x231173CC90cB8486A7dbD1733B5105254316D50A) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20643937
    }
```

```diff
    contract Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        21221163
    }
```

```diff
    contract Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        21221163
    }
```

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        21221163
    }
```

```diff
    contract Governor (0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5) {
    +++ description: None
      sinceBlock:
+        21181998
    }
```

```diff
    contract RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        21221163
    }
```

```diff
    contract OneStepProver0 (0x72b55c2C38EadE57C10047746632A369A060A46E) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20643934
    }
```

```diff
    contract Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        21221163
    }
```

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        21221163
    }
```

```diff
    contract ValidatorUtils (0x84eA2523b271029FFAeB58fc6E6F1435a280db44) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        20643951
    }
```

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        21221163
    }
```

```diff
    contract cbBTC Escrow (0x957C9DC25DE6B8E46a7Fa0D081bA749DD005B54f) {
    +++ description: None
      sinceBlock:
+        21379628
    }
```

```diff
    contract OneStepProofEntry (0x9f403f2054736884518E6D3f510C02f5959BDCC6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20643940
    }
```

```diff
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        21221163
    }
```

```diff
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D) {
    +++ description: None
      sinceBlock:
+        21279265
    }
```

```diff
    contract ProxyAdmin (0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84) {
    +++ description: None
      sinceBlock:
+        21221163
    }
```

Generated with discovered.json: 0x825d3bcfe48ba33283bfcae2434c7fccfbb0abb7

# Diff at Thu, 27 Feb 2025 11:45:30 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21642560
- current block number: 21642560

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

Generated with discovered.json: 0xc8a98993923ec1439f24823bbabca70aba8b90fb

# Diff at Fri, 21 Feb 2025 14:05:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21642560
- current block number: 21642560

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x059e71adb7c6e745f4047b4ed6381737f91155d8

# Diff at Tue, 04 Feb 2025 12:30:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21642560
- current block number: 21642560

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x5da5dc1f20979aadd4859719f78f9c530a2f1341

# Diff at Mon, 20 Jan 2025 11:09:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21642560
- current block number: 21642560

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21642560 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
    }
```

```diff
    contract ERC20Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
    }
```

```diff
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.target:
-        "0x9298413c781c241aF6F6733b7df00De5D4A42D93"
      issuedPermissions.0.to:
+        "0x9298413c781c241aF6F6733b7df00De5D4A42D93"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ERC20RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
    }
```

```diff
    contract ERC20Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
    }
```

```diff
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42"
      issuedPermissions.2.to:
+        "0xe9D1e89A73D7608a45F3cDb5a898dFd9E3A3Ba42"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      directlyReceivedPermissions.2.target:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      directlyReceivedPermissions.2.from:
+        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      directlyReceivedPermissions.1.target:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      directlyReceivedPermissions.1.from:
+        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      directlyReceivedPermissions.0.target:
-        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
      directlyReceivedPermissions.0.from:
+        "0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"
    }
```

```diff
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCff1ad9f09b32252171207e8525c90B18D4E2C7D"
    }
```

```diff
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
      receivedPermissions.8.from:
+        "0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
      receivedPermissions.7.target:
-        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.7.from:
+        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      receivedPermissions.6.target:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      receivedPermissions.6.from:
+        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      receivedPermissions.5.target:
-        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      receivedPermissions.5.from:
+        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      receivedPermissions.4.target:
-        "0x6282197777e7c318C7209bd7059110886aa429C6"
      receivedPermissions.4.from:
+        "0x6282197777e7c318C7209bd7059110886aa429C6"
      receivedPermissions.3.target:
-        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      receivedPermissions.3.from:
+        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      receivedPermissions.2.target:
-        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
      receivedPermissions.2.from:
+        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
      receivedPermissions.1.target:
-        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
      receivedPermissions.1.from:
+        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
      receivedPermissions.0.target:
-        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      receivedPermissions.0.from:
+        "0x828C71bc1D7A34F32FfA624240633b6B7272C3D6"
      directlyReceivedPermissions.0.target:
-        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      directlyReceivedPermissions.0.from:
+        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
    }
```

```diff
    contract ProxyAdmin (0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
      directlyReceivedPermissions.6.from:
+        "0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8"
      directlyReceivedPermissions.5.target:
-        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      directlyReceivedPermissions.5.from:
+        "0x8672705351C81f40B55b1ac2A1998de66166d0eA"
      directlyReceivedPermissions.4.target:
-        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      directlyReceivedPermissions.4.from:
+        "0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C"
      directlyReceivedPermissions.3.target:
-        "0x6282197777e7c318C7209bd7059110886aa429C6"
      directlyReceivedPermissions.3.from:
+        "0x6282197777e7c318C7209bd7059110886aa429C6"
      directlyReceivedPermissions.2.target:
-        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      directlyReceivedPermissions.2.from:
+        "0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA"
      directlyReceivedPermissions.1.target:
-        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
      directlyReceivedPermissions.1.from:
+        "0x37693F11f3D724E55D0B03D5F328D8202C913243"
      directlyReceivedPermissions.0.target:
-        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
      directlyReceivedPermissions.0.from:
+        "0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d"
    }
```

Generated with discovered.json: 0x0bf4b7796c85f7f1c9e3aa37d977f8bd319452c5

# Diff at Fri, 17 Jan 2025 06:56:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1d87738af0941aaf4af591699a4b95396cfa786d block: 21629156
- current block number: 21642560

## Description

Initial discovery: standard orbit stack optimium with known shapes except for a slightly modified bridge that supports custom gastokens.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629156 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Bitcorn (0x386E7A3a0c0919c9d53c3b04FF67E73Ff9e45Fb6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ReadLib1002 (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92)
    +++ description: None
```

```diff
    contract CornMultisig (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D) {
    +++ description: None
      name:
-        "Safe"
+        "CornMultisig"
      receivedPermissions:
+        [{"permission":"configure","target":"0x828C71bc1D7A34F32FfA624240633b6B7272C3D6","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x37693F11f3D724E55D0B03D5F328D8202C913243","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x6282197777e7c318C7209bd7059110886aa429C6","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x828C71bc1D7A34F32FfA624240633b6B7272C3D6","via":[{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0x8672705351C81f40B55b1ac2A1998de66166d0eA","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]},{"permission":"upgrade","target":"0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8","via":[{"address":"0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84"},{"address":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x8672705351C81f40B55b1ac2A1998de66166d0eA"}]
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x036147913eEb42E97790F9a693246c8444290AB6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x231173CC90cB8486A7dbD1733B5105254316D50A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x2a3C554f212E3e0c78eaF0808f5313A10542dA2d)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x37693F11f3D724E55D0B03D5F328D8202C913243)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x4ad144ea249A98F77e0b78104D3B6eB6cd3a76DA)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x6282197777e7c318C7209bd7059110886aa429C6)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72b55c2C38EadE57C10047746632A369A060A46E)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x7E31f112d340a4D0cB0e4bD82f2853089d1bF10C)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x828C71bc1D7A34F32FfA624240633b6B7272C3D6)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x84eA2523b271029FFAeB58fc6E6F1435a280db44)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x8672705351C81f40B55b1ac2A1998de66166d0eA)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x9f403f2054736884518E6D3f510C02f5959BDCC6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xBb309FFFC24F77927d7C4eb86BaA67D8f9dC0EB8)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xEE9924C5fd94601C80fF8010f577C9f7f3C20B84)
    +++ description: None
```

Generated with discovered.json: 0x539edf4d8f84184928279511f53706754239dfe1

# Diff at Thu, 09 Jan 2025 10:59:48 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 21586482

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract wBTC Escrow (0x00943b11764176C3a8323aEFCBd6fE70CFb6272d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bitcorn (0x386E7A3a0c0919c9d53c3b04FF67E73Ff9e45Fb6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governor (0x515C7d8Fcb950f8b030ac08C994b37b4b8F3F7B5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReadLib1002 (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract cbBTC Escrow (0x957C9DC25DE6B8E46a7Fa0D081bA749DD005B54f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0xCff1ad9f09b32252171207e8525c90B18D4E2C7D)
    +++ description: None
```
