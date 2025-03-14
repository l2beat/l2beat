Generated with discovered.json: 0x2cd6fc4f74d8f66fcb2a47e4de2b23b9b3619bf3

# Diff at Thu, 06 Mar 2025 14:26:52 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 25463362
- current block number: 25463362

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x37f94d354ded45f5d4d32e073183f67ad34e944b

# Diff at Thu, 06 Mar 2025 09:39:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 25463362
- current block number: 25463362

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f","0x6D67FD4af128eAb051EE8976e6aa65664A4806EE"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xbdcf85c8c0718c16e0f03db8ccaa3bde3ab05d9a

# Diff at Tue, 04 Mar 2025 10:40:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 25463362
- current block number: 25463362

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract OneStepProver0 (0x109b5d31a5D431B856Ae30E121A1e04302bA9872) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18118849
    }
```

```diff
    contract GnosisSafeL2 (0x327b96a94763c50D5EC56D79a0324f5eb9527306) {
    +++ description: None
      sinceBlock:
+        22453856
    }
```

```diff
    contract Inbox (0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        21464498
    }
```

```diff
    contract SequencerInbox (0x400f7c5DaC37aAEe3cE007e43Db54424414743f5) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        21464498
    }
```

```diff
    contract OneStepProverHostIo (0x55c6253DB419EDaE4A3d86e44064a4A5f1422751) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18118909
    }
```

```diff
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        21464498
    }
```

```diff
    contract OneStepProverMemory (0x696FC111c7a3E31951426660a0B1da9396056a29) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18118869
    }
```

```diff
    contract RollupEventInbox (0x6D67FD4af128eAb051EE8976e6aa65664A4806EE) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        21464498
    }
```

```diff
    contract Outbox (0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        21464498
    }
```

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      sinceBlock:
+        21811174
    }
```

```diff
    contract ChallengeManager (0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        21464498
    }
```

```diff
    contract OneStepProofEntry (0x9464dC1403b83432e573f4ff20ba4aF58De59226) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18118929
    }
```

```diff
    contract UpgradeExecutor (0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        21464498
    }
```

```diff
    contract Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        21464498
    }
```

```diff
    contract ValidatorUtils (0xa51F58cdE1955754329E071626C7e74d860C0406) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        18119011
    }
```

```diff
    contract ProxyAdmin (0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD) {
    +++ description: None
      sinceBlock:
+        21464498
    }
```

```diff
    contract OneStepProverMath (0xbB13eB1C56cf1408f657c6f3d56eFf188665B896) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18118889
    }
```

Generated with discovered.json: 0x5a79f6f561d2c480ce439f4967ff9be0107770f5

# Diff at Thu, 27 Feb 2025 11:47:45 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 25463362
- current block number: 25463362

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract Inbox (0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract RollupEventInbox (0x6D67FD4af128eAb051EE8976e6aa65664A4806EE) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Outbox (0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

Generated with discovered.json: 0xd8e055291d07bab82ff8d8e5a788063e607f28c7

# Diff at Fri, 21 Feb 2025 14:13:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 25463362
- current block number: 25463362

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0x400f7c5DaC37aAEe3cE007e43Db54424414743f5) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ERC20Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x6631c3812f7b0813ade0b17f84eb1674a66b2b6f

# Diff at Tue, 04 Feb 2025 12:34:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 25463362
- current block number: 25463362

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.2.to:
-        "0x97B942C591C484bBdDBb1cd04560924cf8a8fe3f"
+        "0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7"
      issuedPermissions.2.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.2.via.0.address:
-        "0x327b96a94763c50D5EC56D79a0324f5eb9527306"
+        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.to:
-        "0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
+        "0x97B942C591C484bBdDBb1cd04560924cf8a8fe3f"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0.address:
-        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
+        "0x327b96a94763c50D5EC56D79a0324f5eb9527306"
    }
```

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x553b6c797cdaa6d3e4461b0047c0d0e9f3c03bb5

# Diff at Fri, 24 Jan 2025 10:54:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 25463362

## Description

Initial discovery: standard v32 AnyTrust (with fastconfirmer) orbit stack with custom gasToken GHST.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProver0 (0x109b5d31a5D431B856Ae30E121A1e04302bA9872)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x327b96a94763c50D5EC56D79a0324f5eb9527306)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x400f7c5DaC37aAEe3cE007e43Db54424414743f5)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x55c6253DB419EDaE4A3d86e44064a4A5f1422751)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x696FC111c7a3E31951426660a0B1da9396056a29)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x6D67FD4af128eAb051EE8976e6aa65664A4806EE)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x9464dC1403b83432e573f4ff20ba4aF58De59226)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0xa51F58cdE1955754329E071626C7e74d860C0406)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xbB13eB1C56cf1408f657c6f3d56eFf188665B896)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
