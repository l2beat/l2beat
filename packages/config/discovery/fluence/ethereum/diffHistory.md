Generated with discovered.json: 0x38d7cb6adfc8dec39d60d3767566a9374108b950

# Diff at Fri, 07 Mar 2025 09:14:54 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21895095
- current block number: 21994038

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895095 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x5c8d9d4e5b98a890da7eb3a2db7b6e25fe7b33f2

# Diff at Thu, 06 Mar 2025 09:39:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21895095
- current block number: 21895095

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895095 (main branch discovery), not current.

```diff
    contract Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95","0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x50Df2E43aDefee3b6510b637697d30e7dc155e13"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xea30807906a1922cf77c25f8a44c357c0ee40fce

# Diff at Tue, 04 Mar 2025 10:39:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21895095
- current block number: 21895095

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895095 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569170
    }
```

```diff
    contract Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        20425137
    }
```

```diff
    contract ProxyAdmin (0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790) {
    +++ description: None
      sinceBlock:
+        20425137
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
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        20425137
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
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569167
    }
```

```diff
    contract Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        20425137
    }
```

```diff
    contract ERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        20425140
    }
```

```diff
    contract Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        20425137
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        20425137
    }
```

```diff
    contract RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        20425137
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
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sinceBlock:
+        19521321
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
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        20425137
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        20425137
    }
```

```diff
    contract GatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        20425140
    }
```

Generated with discovered.json: 0xed972fda10a18a5a895356b635af14bbcc5d7cf4

# Diff at Thu, 27 Feb 2025 11:45:40 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21895095
- current block number: 21895095

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895095 (main branch discovery), not current.

```diff
    contract Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract ERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1OrbitERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract GatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1OrbitGatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

Generated with discovered.json: 0x2ccab5c9573672a6b0c3bdc59126be89c7356b40

# Diff at Fri, 21 Feb 2025 13:45:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21628392
- current block number: 21895095

## Description

Add operator addresses.
Config related: Set orbit stack contract categories.

## Watched changes

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}]}
      issuedPermissions.4:
+        {"permission":"sequence","to":"0xf244224843657bb59A6456754992Ea973655D918","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]}
      issuedPermissions.3:
+        {"permission":"sequence","to":"0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]}
      issuedPermissions.2:
+        {"permission":"sequence","to":"0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.to:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
      issuedPermissions.1.via.1:
-        {"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}
      issuedPermissions.1.via.0:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.to:
-        "0xAec3997252d4F9Cd92Cc49be2e8068e23065665a"
+        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
      values.batchPosters.4:
+        "0xf244224843657bb59A6456754992Ea973655D918"
      values.batchPosters.3:
+        "0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325"
      values.batchPosters.2:
+        "0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e"
      values.batchPosters.1:
+        "0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
      values.batchPosters.0:
-        "0xAec3997252d4F9Cd92Cc49be2e8068e23065665a"
+        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6:
+        {"permission":"validate","to":"0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.5:
+        {"permission":"validate","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.4:
+        {"permission":"validate","to":"0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.3:
+        {"permission":"validate","to":"0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.2.to:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        3
      values.stakerCount:
-        1
+        2
      values.validators.4:
+        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
      values.validators.3:
+        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
      values.validators.2:
+        "0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
      values.validators.1:
+        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
      values.validators.0:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628392 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

Generated with discovered.json: 0xe455b275da5573d6986c7d6fe9f4e08a120916a6

# Diff at Tue, 04 Feb 2025 12:31:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21628392
- current block number: 21628392

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628392 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x04738e37860f895095793c4d8be068b8b077e546

# Diff at Mon, 20 Jan 2025 11:09:30 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628392
- current block number: 21628392

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628392 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ProxyAdmin (0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      directlyReceivedPermissions.8.from:
+        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      directlyReceivedPermissions.7.target:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      directlyReceivedPermissions.7.from:
+        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      directlyReceivedPermissions.6.target:
-        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      directlyReceivedPermissions.6.from:
+        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      directlyReceivedPermissions.5.target:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      directlyReceivedPermissions.5.from:
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      directlyReceivedPermissions.4.target:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      directlyReceivedPermissions.4.from:
+        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      directlyReceivedPermissions.3.target:
-        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      directlyReceivedPermissions.3.from:
+        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      directlyReceivedPermissions.2.target:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      directlyReceivedPermissions.2.from:
+        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      directlyReceivedPermissions.1.target:
-        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      directlyReceivedPermissions.1.from:
+        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      directlyReceivedPermissions.0.target:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      directlyReceivedPermissions.0.from:
+        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      directlyReceivedPermissions.2.target:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.2.from:
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.1.target:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.1.from:
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.0.target:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      directlyReceivedPermissions.0.from:
+        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
    }
```

```diff
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      receivedPermissions.10.from:
+        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      receivedPermissions.9.target:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.9.from:
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.8.target:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      receivedPermissions.8.from:
+        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      receivedPermissions.7.target:
-        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      receivedPermissions.7.from:
+        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      receivedPermissions.6.target:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.6.from:
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.5.target:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      receivedPermissions.5.from:
+        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      receivedPermissions.4.target:
-        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      receivedPermissions.4.from:
+        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      receivedPermissions.3.target:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      receivedPermissions.3.from:
+        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      receivedPermissions.2.target:
-        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      receivedPermissions.2.from:
+        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      receivedPermissions.1.target:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      receivedPermissions.1.from:
+        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      receivedPermissions.0.target:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.0.from:
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.0.target:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      directlyReceivedPermissions.0.from:
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.target:
-        "0xAec3997252d4F9Cd92Cc49be2e8068e23065665a"
      issuedPermissions.0.to:
+        "0xAec3997252d4F9Cd92Cc49be2e8068e23065665a"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
      issuedPermissions.2.to:
+        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0x7bb1e93ccb9eb686cc6ff833cde3635272aca7e0

# Diff at Wed, 15 Jan 2025 07:29:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21465176
- current block number: 21628392

## Description

Two signers added to Gelato MS, now 4/10.

## Watched changes

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.7:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.6:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.5:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.4:
-        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
+        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.3:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.2:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.$members.1:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.0:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0xa28b9655c364794cce276b17f69be431671b18cd

# Diff at Wed, 08 Jan 2025 10:44:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465176
- current block number: 21465176

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465176 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xde147673c5c765ebf4d721f2f95ea3f88ba51588

# Diff at Mon, 23 Dec 2024 12:27:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21365584
- current block number: 21465176

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21365584 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x99e3dc72514eb973705c06743bfaf25897146ab4

# Diff at Mon, 09 Dec 2024 14:36:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02974be0caac873bba9178e618086aa67aaf0b90 block: 21285836
- current block number: 21365584

## Description

Replace Upgrader EOA with Gelato Multisig.

## Watched changes

```diff
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.0:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.1.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
-        {"permission":"validate","target":"0x505aFCB1502aa5589e4b5F948275100551E79b7b","via":[]}
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "validate"
      issuedPermissions.2.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
      issuedPermissions.2.via.0:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0xe0c7728a837b0a8873fad914c75f0694ffa12dd6

# Diff at Fri, 06 Dec 2024 08:09:42 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21285836
- current block number: 21285836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285836 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xf63388a5c33dffe61ccdfb809ec05fc8da5ce1b6

# Diff at Fri, 29 Nov 2024 11:28:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21285836
- current block number: 21285836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285836 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x5dbb652288446df9c587ed6d23724e9f0ab385a2

# Diff at Fri, 29 Nov 2024 09:31:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21285836
- current block number: 21285836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285836 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd","via":[{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"},{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}]}
      receivedPermissions.9.target:
-        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.9.via.1:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      receivedPermissions.9.via.0.address:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.8.target:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      receivedPermissions.8.via.1:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      receivedPermissions.8.via.0.address:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.7.target:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      receivedPermissions.6.target:
-        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.5.target:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      receivedPermissions.4.target:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      receivedPermissions.3.target:
-        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
+        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      receivedPermissions.2.target:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
+        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      receivedPermissions.1.target:
-        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
+        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.0.via.1:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      receivedPermissions.0.via.0.address:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","target":"0x505aFCB1502aa5589e4b5F948275100551E79b7b","via":[]}
      issuedPermissions.3.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.3.target:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.3.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.target:
-        "0x0000000000000000000000000000000000000000"
+        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
      issuedPermissions.0.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0xb1461e556fc13132b9ea66329c0ded9de9b5f5c4

# Diff at Thu, 28 Nov 2024 11:15:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21270981
- current block number: 21285836

## Description

Gelato MS added as second executor.

## Watched changes

```diff
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"validate","target":"0x505aFCB1502aa5589e4b5F948275100551E79b7b","via":[]}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GelatoMultisig/GnosisSafe.sol   | 953 +++++++++++++++++++++
 .../.flat/GelatoMultisig/GnosisSafeProxy.p.sol     |  35 +
 2 files changed, 988 insertions(+)
```

Generated with discovered.json: 0x23eeabd5772a47856f34b6f15686a7c5ec0c5b4f

# Diff at Tue, 26 Nov 2024 09:19:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2a3b80d2c777b6125ac0d9d7c441cf8578a57a5f block: 21128887
- current block number: 21270981

## Description

ArbOS v32 upgrade to known contracts.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.1:
+        ["2024-11-25T14:08:23.000Z","0x788c3362a0afa116cef977fba73d4b39186dd5f4222f594b31469c115499acbc",["0x02E05A9245C5853f895daDcc3A8216C953C8736B"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
-        {"permission":"upgrade","target":"0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"}
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "upgrade"
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
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
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
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
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0x0000000000000000000000000000000000000000"
      issuedPermissions.0.via.0:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$pastUpgrades.1:
+        ["2024-11-25T14:08:23.000Z","0x788c3362a0afa116cef977fba73d4b39186dd5f4222f594b31469c115499acbc",["0x9B56A789fEDD5df27dBaB53b085F7157397cA17D","0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"]]
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
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
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
 .../{.flat@21128887 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

Generated with discovered.json: 0x7eb381761b7d1025a73c07541c04a05e5424be41

# Diff at Fri, 15 Nov 2024 08:18:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21128887
- current block number: 21128887

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21128887 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
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
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0xBc54708fB6C6C97086e3f6554a517DE5EF16c304","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}]}
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
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
      issuedPermissions.0.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      template:
+        "orbitstack/GatewayRouter"
      displayName:
+        "GatewayRouter"
      description:
+        "This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging."
    }
```

Generated with discovered.json: 0x8e49aa93da332bcc7872bd4ace5e1d57eb67e23e

# Diff at Wed, 06 Nov 2024 13:24:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21128887

## Description

Standard orbit stack anytrust 1/2 optimium with naughty eoa admin (0.96 alienx similarity).

## Initial discovery

```diff
+   Status: CREATED
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7)
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e)
    +++ description: None
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
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd)
    +++ description: None
```
