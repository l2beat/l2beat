Generated with discovered.json: 0xf42dc14f4e4858d796377c70f6d0a321f76c9dd3

# Diff at Fri, 07 Mar 2025 09:07:54 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21915758
- current block number: 21994003

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915758 (main branch discovery), not current.

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x933176dec5491640a983da4592010eb7d777cde5

# Diff at Thu, 06 Mar 2025 09:39:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21915758
- current block number: 21915758

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915758 (main branch discovery), not current.

```diff
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x97FdC935c5E25613AA13a054C7Aa71cf751DB495","0xdE3fdE71a026236b6b5C35505643FF4155EAb20D"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x86153d065892502be5ed74c8e292add6c612d546

# Diff at Tue, 04 Mar 2025 10:39:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21915758
- current block number: 21915758

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915758 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569170
    }
```

```diff
    contract ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        20694023
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
    contract ProxyAdmin (0x305042e5A81424f2f824f93Ff2195b5712D7dE14) {
    +++ description: None
      sinceBlock:
+        20684364
    }
```

```diff
    contract Outbox (0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        20684364
    }
```

```diff
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        20684364
    }
```

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        20684364
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
    contract Inbox (0x97FdC935c5E25613AA13a054C7Aa71cf751DB495) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        20684364
    }
```

```diff
    contract GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        20694023
    }
```

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        20684364
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
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        20684364
    }
```

```diff
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        20684364
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
    contract RollupEventInbox (0xdE3fdE71a026236b6b5C35505643FF4155EAb20D) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        20684364
    }
```

```diff
    contract EverclearFastconfirmerMultisig (0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501) {
    +++ description: None
      sinceBlock:
+        21629179
    }
```

Generated with discovered.json: 0x4987400112786d04d96ddc734ebcd43c817884c8

# Diff at Thu, 27 Feb 2025 11:45:39 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21915758
- current block number: 21915758

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915758 (main branch discovery), not current.

```diff
    contract ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1ERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1GatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

Generated with discovered.json: 0xa1cf207dc503e5c19de501e9b901396fc2701876

# Diff at Mon, 24 Feb 2025 15:36:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cfe18eb30997850b8abc4c6e718cd2a363aa4309 block: 21895088
- current block number: 21915758

## Description

Config: added a single caldera multisig name.

## Watched changes

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.stakerCount:
-        1
+        2
    }
```

Generated with discovered.json: 0x3506c4f88a509f4c5d98320e433248d956ec6894

# Diff at Fri, 21 Feb 2025 13:43:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21635740
- current block number: 21895088

## Description

Add validators and batch posters.
Config related: Set orbit stack contract categories.

## Watched changes

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]}
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
-        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}
      issuedPermissions.1.via.0:
-        {"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"}
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.to:
-        "0x54F9375F5a6CEA1eECc561FC7f309aD8Cb633Ef9"
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
-        "0x54F9375F5a6CEA1eECc561FC7f309aD8Cb633Ef9"
+        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.8:
+        {"permission":"validate","to":"0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501"}]}
      issuedPermissions.7:
+        {"permission":"validate","to":"0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.6:
+        {"permission":"validate","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.5:
+        {"permission":"validate","to":"0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.4.to:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
+        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
      issuedPermissions.4.via.0:
-        {"address":"0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501"}
      issuedPermissions.3.to:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
      issuedPermissions.0.to:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
+        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        2
+        4
      values.validators.5:
+        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
      values.validators.4:
+        "0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501"
      values.validators.3:
+        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
      values.validators.2:
+        "0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
      values.validators.1:
-        "0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501"
+        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
      values.validators.0:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
    }
```

```diff
    contract EverclearFastconfirmerMultisig (0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501) {
    +++ description: None
      values.$members.0:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
+        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635740 (main branch discovery), not current.

```diff
    contract L1ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract Outbox (0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Inbox (0x97FdC935c5E25613AA13a054C7Aa71cf751DB495) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xa8e2aae19ea0e33916f87cc23d32f2b9187a9fe6

# Diff at Tue, 04 Feb 2025 12:31:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21635740
- current block number: 21635740

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635740 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
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
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.1.to:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.via.0.address:
-        "0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      issuedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0.address:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501"
    }
```

Generated with discovered.json: 0x82338d5e9dc53e59c83548472b8bc98caf78f611

# Diff at Mon, 20 Jan 2025 11:09:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21635740
- current block number: 21635740

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635740 (main branch discovery), not current.

```diff
    contract L1ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5) {
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
    contract ProxyAdmin (0x305042e5A81424f2f824f93Ff2195b5712D7dE14) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xdE3fdE71a026236b6b5C35505643FF4155EAb20D"
      directlyReceivedPermissions.8.from:
+        "0xdE3fdE71a026236b6b5C35505643FF4155EAb20D"
      directlyReceivedPermissions.7.target:
-        "0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8"
      directlyReceivedPermissions.7.from:
+        "0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8"
      directlyReceivedPermissions.6.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      directlyReceivedPermissions.6.from:
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      directlyReceivedPermissions.5.target:
-        "0xA880b3fC75928695ac75e06793277aC4bEA84a3E"
      directlyReceivedPermissions.5.from:
+        "0xA880b3fC75928695ac75e06793277aC4bEA84a3E"
      directlyReceivedPermissions.4.target:
-        "0x97FdC935c5E25613AA13a054C7Aa71cf751DB495"
      directlyReceivedPermissions.4.from:
+        "0x97FdC935c5E25613AA13a054C7Aa71cf751DB495"
      directlyReceivedPermissions.3.target:
-        "0x7B0517E0104dB60198f9d573C0aB8d480207827E"
      directlyReceivedPermissions.3.from:
+        "0x7B0517E0104dB60198f9d573C0aB8d480207827E"
      directlyReceivedPermissions.2.target:
-        "0x4eb4fB614e1aa3634513319F4Ec7334bC4321356"
      directlyReceivedPermissions.2.from:
+        "0x4eb4fB614e1aa3634513319F4Ec7334bC4321356"
      directlyReceivedPermissions.1.target:
-        "0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa"
      directlyReceivedPermissions.1.from:
+        "0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa"
      directlyReceivedPermissions.0.target:
-        "0x149e3df73d9D48cb6573555De9256cc1456F50B5"
      directlyReceivedPermissions.0.from:
+        "0x149e3df73d9D48cb6573555De9256cc1456F50B5"
    }
```

```diff
    contract Outbox (0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa) {
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
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
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
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
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
-        "0x54F9375F5a6CEA1eECc561FC7f309aD8Cb633Ef9"
      issuedPermissions.0.to:
+        "0x54F9375F5a6CEA1eECc561FC7f309aD8Cb633Ef9"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract Inbox (0x97FdC935c5E25613AA13a054C7Aa71cf751DB495) {
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
    contract L1GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E) {
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

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
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
-        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
      directlyReceivedPermissions.2.from:
+        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
      directlyReceivedPermissions.1.target:
-        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
      directlyReceivedPermissions.1.from:
+        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
      directlyReceivedPermissions.0.target:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
      directlyReceivedPermissions.0.from:
+        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xdE3fdE71a026236b6b5C35505643FF4155EAb20D"
      receivedPermissions.10.from:
+        "0xdE3fdE71a026236b6b5C35505643FF4155EAb20D"
      receivedPermissions.9.target:
-        "0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8"
      receivedPermissions.9.from:
+        "0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8"
      receivedPermissions.8.target:
-        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
      receivedPermissions.8.from:
+        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
      receivedPermissions.7.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      receivedPermissions.7.from:
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      receivedPermissions.6.target:
-        "0xA880b3fC75928695ac75e06793277aC4bEA84a3E"
      receivedPermissions.6.from:
+        "0xA880b3fC75928695ac75e06793277aC4bEA84a3E"
      receivedPermissions.5.target:
-        "0x97FdC935c5E25613AA13a054C7Aa71cf751DB495"
      receivedPermissions.5.from:
+        "0x97FdC935c5E25613AA13a054C7Aa71cf751DB495"
      receivedPermissions.4.target:
-        "0x7B0517E0104dB60198f9d573C0aB8d480207827E"
      receivedPermissions.4.from:
+        "0x7B0517E0104dB60198f9d573C0aB8d480207827E"
      receivedPermissions.3.target:
-        "0x4eb4fB614e1aa3634513319F4Ec7334bC4321356"
      receivedPermissions.3.from:
+        "0x4eb4fB614e1aa3634513319F4Ec7334bC4321356"
      receivedPermissions.2.target:
-        "0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa"
      receivedPermissions.2.from:
+        "0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa"
      receivedPermissions.1.target:
-        "0x149e3df73d9D48cb6573555De9256cc1456F50B5"
      receivedPermissions.1.from:
+        "0x149e3df73d9D48cb6573555De9256cc1456F50B5"
      receivedPermissions.0.target:
-        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
      receivedPermissions.0.from:
+        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
      directlyReceivedPermissions.0.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      directlyReceivedPermissions.0.from:
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4.target:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
      issuedPermissions.4.via.0.delay:
-        0
      issuedPermissions.4.via.0.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.to:
+        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
      issuedPermissions.3.to:
+        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.target:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.via.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.to:
+        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
      issuedPermissions.1.description:
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
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
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8) {
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
    contract RollupEventInbox (0xdE3fdE71a026236b6b5C35505643FF4155EAb20D) {
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
    contract EverclearFastconfirmerMultisig (0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
      directlyReceivedPermissions.1.from:
+        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
      directlyReceivedPermissions.0.target:
-        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
      directlyReceivedPermissions.0.from:
+        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
    }
```

Generated with discovered.json: 0x4a0220baa025798329703571e77dd1381ec0f589

# Diff at Thu, 16 Jan 2025 08:05:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a739892e4565ca2cf8f67abed360c494a770dcea block: 21628389
- current block number: 21635740

## Description

Fastconfirmer added, minimum assertion period reduced to 1 block. This single EOA can push malicious state and withdraw from that state in the next block.

## Watched changes

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","target":"0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA","via":[{"address":"0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]}
      issuedPermissions.3:
+        {"permission":"validate","target":"0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA","via":[]}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0:
+        {"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0}
      issuedPermissions.1.permission:
-        "upgrade"
+        "fastconfirm"
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
      issuedPermissions.1.via.0.address:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501"
      issuedPermissions.1.via.0.description:
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501"
+++ description: Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. 
      values.minimumAssertionPeriod:
-        75
+        1
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        2
      values.validators.1:
+        "0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501"
    }
```

```diff
+   Status: CREATED
    contract EverclearFastconfirmerMultisig (0xE1Fc24fef87bC5Af6024a8A0c12d7B835E497501)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafeL2.sol                               | 1032 ++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 2 files changed, 1067 insertions(+)
```

Generated with discovered.json: 0x953ce27630bc06d272a14b1ea19b6c5bda740a3f

# Diff at Wed, 15 Jan 2025 07:28:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21471461
- current block number: 21628389

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

Generated with discovered.json: 0x90fc529b58b455b2841378316e854f905fcd6a5e

# Diff at Wed, 08 Jan 2025 10:44:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21471461
- current block number: 21471461

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21471461 (main branch discovery), not current.

```diff
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xaabce4f94461ae606fc51cfc9055ea64e36a36ca

# Diff at Tue, 24 Dec 2024 09:33:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8f52aa11293aef791f10e1b8317bef0d461a04f9 block: 21365577
- current block number: 21471461

## Description

Config related: Add Celestia Nitro wmroot.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21365577 (main branch discovery), not current.

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x70577b3b7afc5e6c9421ace624a53a1285bbce62

# Diff at Mon, 09 Dec 2024 14:35:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02974be0caac873bba9178e618086aa67aaf0b90 block: 21292447
- current block number: 21365577

## Description

Replace Upgrader EOA with Gelato Multisig.

## Watched changes

```diff
    contract L1ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
      issuedPermissions.0.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract Outbox (0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
      issuedPermissions.0.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
      issuedPermissions.0.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
      issuedPermissions.1.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract Inbox (0x97FdC935c5E25613AA13a054C7Aa71cf751DB495) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
      issuedPermissions.0.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
      issuedPermissions.0.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
      issuedPermissions.0.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.0:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
-        {"permission":"validate","target":"0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA","via":[]}
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "validate"
      issuedPermissions.2.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
      issuedPermissions.2.via.0:
-        {"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0}
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
      issuedPermissions.0.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract RollupEventInbox (0xdE3fdE71a026236b6b5C35505643FF4155EAb20D) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
      issuedPermissions.0.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0xc4807a293802c40069467738275df419f6a86dc7

# Diff at Fri, 06 Dec 2024 08:09:42 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21292447
- current block number: 21292447

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292447 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xd507ccf17eaf44b7e801b39ab38e42315297298d

# Diff at Fri, 29 Nov 2024 11:28:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21292447
- current block number: 21292447

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292447 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
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
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xeafd586f0336244f6eee4fb29be5b3bb2633048a

# Diff at Fri, 29 Nov 2024 09:31:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21285826
- current block number: 21292447

## Description

Config related: remove manual template override.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285826 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

Generated with discovered.json: 0xe3eeae3684811a5e3b038ccce833717156ba7770

# Diff at Thu, 28 Nov 2024 11:13:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21270973
- current block number: 21285826

## Description

Gelato MS added as executor (EOA not removed).

## Watched changes

```diff
    contract L1ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
    }
```

```diff
    contract Outbox (0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
    }
```

```diff
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
    }
```

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
    }
```

```diff
    contract Inbox (0x97FdC935c5E25613AA13a054C7Aa71cf751DB495) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
    }
```

```diff
    contract L1GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
    }
```

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","target":"0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA","via":[]}
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0}]}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.2.via.0:
+        {"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0}
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
    }
```

```diff
    contract RollupEventInbox (0xdE3fdE71a026236b6b5C35505643FF4155EAb20D) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0},{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}]}
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

Generated with discovered.json: 0x4d83a1af7c41cfaab8d1a3739515d60c40b65589

# Diff at Tue, 26 Nov 2024 09:17:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2a3b80d2c777b6125ac0d9d7c441cf8578a57a5f block: 21092372
- current block number: 21270973

## Description

Upgrade to known ArbOS v32 contracts. Move to discodriven data.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
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
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$pastUpgrades.1:
+        ["2024-11-25T12:55:35.000Z","0x9a5e07856d252a3376d12373ee34a5e7cff6060657e9475f57201705a6ccdb66",["0x9B56A789fEDD5df27dBaB53b085F7157397cA17D","0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"]]
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
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.1:
+        ["2024-11-25T12:55:35.000Z","0x9a5e07856d252a3376d12373ee34a5e7cff6060657e9475f57201705a6ccdb66",["0x02E05A9245C5853f895daDcc3A8216C953C8736B"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
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
 .../{.flat@21092372 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

Generated with discovered.json: 0xf26c12ad0159a69a958f1496b02f299f7e8c522b

# Diff at Fri, 15 Nov 2024 08:18:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21092372
- current block number: 21092372

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21092372 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract Inbox (0x97FdC935c5E25613AA13a054C7Aa71cf751DB495) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract L1GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E) {
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
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0}]}
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
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.0.via.0:
+        {"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract RollupEventInbox (0xdE3fdE71a026236b6b5C35505643FF4155EAb20D) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

Generated with discovered.json: 0xd880be6fbbfa86fed842d132d6e0e440b729db17

# Diff at Mon, 04 Nov 2024 07:55:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21092372
- current block number: 21092372

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21092372 (main branch discovery), not current.

```diff
    contract L1ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5) {
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
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [28800,300,345600,3600]
+        {"delayBlocks":28800,"futureBlocks":300,"delaySeconds":345600,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0","via":[{"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
+        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
      issuedPermissions.2.via.0:
-        {"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.1.via.0:
+        {"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0xe47eb468cb441f91945fc700b15dd996b82d9ed3

# Diff at Fri, 01 Nov 2024 11:04:02 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21041834
- current block number: 21092372

## Description

Discovery refresh to apply template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041834 (main branch discovery), not current.

```diff
    contract Outbox (0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x2e83f802dcc038573e0142b3dbee48590c366549

# Diff at Tue, 29 Oct 2024 13:07:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041834
- current block number: 21041834

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041834 (main branch discovery), not current.

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0x60c398cef2c64b9a7677092c39326e28b9d905fa

# Diff at Tue, 29 Oct 2024 08:01:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041834
- current block number: 21041834

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041834 (main branch discovery), not current.

```diff
    contract L1ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.0.via.1:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
    }
```

```diff
    contract Outbox (0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.0.via.1:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
    }
```

```diff
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.0.via.1:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
    }
```

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.1.via.1:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
    }
```

```diff
    contract Inbox (0x97FdC935c5E25613AA13a054C7Aa71cf751DB495) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.0.via.1:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
    }
```

```diff
    contract L1GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.0.via.1:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
    }
```

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.0.via.1:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x149e3df73d9D48cb6573555De9256cc1456F50B5","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]},{"permission":"upgrade","target":"0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]},{"permission":"upgrade","target":"0x4eb4fB614e1aa3634513319F4Ec7334bC4321356","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]},{"permission":"upgrade","target":"0x7B0517E0104dB60198f9d573C0aB8d480207827E","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]},{"permission":"upgrade","target":"0x97FdC935c5E25613AA13a054C7Aa71cf751DB495","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]},{"permission":"upgrade","target":"0xA880b3fC75928695ac75e06793277aC4bEA84a3E","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]},{"permission":"upgrade","target":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]},{"permission":"upgrade","target":"0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"},{"permission":"upgrade","target":"0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]},{"permission":"upgrade","target":"0xdE3fdE71a026236b6b5C35505643FF4155EAb20D","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"}
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.2.via.0:
+        {"address":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","delay":0}
    }
```

```diff
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.0.via.1:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
    }
```

```diff
    contract RollupEventInbox (0xdE3fdE71a026236b6b5C35505643FF4155EAb20D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"
      issuedPermissions.0.via.1:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
    }
```

Generated with discovered.json: 0xaed1807fe72e213f44a9de427349eed57c77d9d3

# Diff at Mon, 28 Oct 2024 14:03:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041834
- current block number: 21041834

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041834 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x98a426C8ED821cAaef1b4BF7D29b514dcef970C0"]
    }
```

Generated with discovered.json: 0x93c028a81066a301242f64d1f8cd974cb8d14889

# Diff at Fri, 25 Oct 2024 09:48:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20942187
- current block number: 21041834

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942187 (main branch discovery), not current.

```diff
    contract L1ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      issuedPermissions.0.via.0:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x305042e5A81424f2f824f93Ff2195b5712D7dE14) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x149e3df73d9D48cb6573555De9256cc1456F50B5"},{"permission":"upgrade","target":"0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa"},{"permission":"upgrade","target":"0x4eb4fB614e1aa3634513319F4Ec7334bC4321356"},{"permission":"upgrade","target":"0x7B0517E0104dB60198f9d573C0aB8d480207827E"},{"permission":"upgrade","target":"0x97FdC935c5E25613AA13a054C7Aa71cf751DB495"},{"permission":"upgrade","target":"0xA880b3fC75928695ac75e06793277aC4bEA84a3E"},{"permission":"upgrade","target":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"},{"permission":"upgrade","target":"0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8"},{"permission":"upgrade","target":"0xdE3fdE71a026236b6b5C35505643FF4155EAb20D"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x149e3df73d9D48cb6573555De9256cc1456F50B5"},{"permission":"upgrade","target":"0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa"},{"permission":"upgrade","target":"0x4eb4fB614e1aa3634513319F4Ec7334bC4321356"},{"permission":"upgrade","target":"0x7B0517E0104dB60198f9d573C0aB8d480207827E"},{"permission":"upgrade","target":"0x97FdC935c5E25613AA13a054C7Aa71cf751DB495"},{"permission":"upgrade","target":"0xA880b3fC75928695ac75e06793277aC4bEA84a3E"},{"permission":"upgrade","target":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"},{"permission":"upgrade","target":"0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8"},{"permission":"upgrade","target":"0xdE3fdE71a026236b6b5C35505643FF4155EAb20D"}]
    }
```

```diff
    contract Outbox (0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      issuedPermissions.0.via.0:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
    }
```

```diff
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      issuedPermissions.0.via.0:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
    }
```

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      issuedPermissions.1.via.0:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
    }
```

```diff
    contract Inbox (0x97FdC935c5E25613AA13a054C7Aa71cf751DB495) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      issuedPermissions.0.via.0:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
    }
```

```diff
    contract L1GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      issuedPermissions.0.via.0:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      issuedPermissions.0.via.0:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xdE3fdE71a026236b6b5C35505643FF4155EAb20D","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xA880b3fC75928695ac75e06793277aC4bEA84a3E","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x97FdC935c5E25613AA13a054C7Aa71cf751DB495","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x7B0517E0104dB60198f9d573C0aB8d480207827E","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x4eb4fB614e1aa3634513319F4Ec7334bC4321356","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa","via":[{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]}
      receivedPermissions.0.target:
-        "0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C"
+        "0x149e3df73d9D48cb6573555De9256cc1456F50B5"
      receivedPermissions.0.via:
+        [{"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14"}]
    }
```

```diff
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      issuedPermissions.0.via.0:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
    }
```

```diff
    contract RollupEventInbox (0xdE3fdE71a026236b6b5C35505643FF4155EAb20D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
      issuedPermissions.0.via.0:
+        {"address":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","delay":0}
    }
```

Generated with discovered.json: 0xdfda5f8f304c5c3862103918616141c32e007765

# Diff at Wed, 23 Oct 2024 14:35:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20942187
- current block number: 20942187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942187 (main branch discovery), not current.

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
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
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
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B"
+        "0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA"
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
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

Generated with discovered.json: 0x089f053397970cd38d9e07198e064d488d02ed35

# Diff at Mon, 21 Oct 2024 12:44:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20942187
- current block number: 20942187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942187 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0xdb51f41be43171c895000c5c0f85c8f7f5b9a6be

# Diff at Mon, 21 Oct 2024 11:06:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20942187
- current block number: 20942187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942187 (main branch discovery), not current.

```diff
    contract L1ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
      values.$pastUpgrades.0.1:
-        ["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]
+        "0x1ccda98503a48db780b2e4c89ab94895dad577f97b38b13b499ba27b82cec911"
    }
```

```diff
    contract Outbox (0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0x68a58ddd9f1327bfd263dc7af326d6011c85c374c3b02df82ebff50f9640b6b6"
    }
```

```diff
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
      values.$pastUpgrades.0.1:
-        ["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]
+        "0x68a58ddd9f1327bfd263dc7af326d6011c85c374c3b02df82ebff50f9640b6b6"
    }
```

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]
      values.$pastUpgrades.0.1:
-        ["0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"]
+        "0x68a58ddd9f1327bfd263dc7af326d6011c85c374c3b02df82ebff50f9640b6b6"
    }
```

```diff
    contract Inbox (0x97FdC935c5E25613AA13a054C7Aa71cf751DB495) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
      values.$pastUpgrades.0.1:
-        ["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]
+        "0x68a58ddd9f1327bfd263dc7af326d6011c85c374c3b02df82ebff50f9640b6b6"
    }
```

```diff
    contract L1GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
      values.$pastUpgrades.0.1:
-        ["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]
+        "0x1ccda98503a48db780b2e4c89ab94895dad577f97b38b13b499ba27b82cec911"
    }
```

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0x68a58ddd9f1327bfd263dc7af326d6011c85c374c3b02df82ebff50f9640b6b6"
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x68a58ddd9f1327bfd263dc7af326d6011c85c374c3b02df82ebff50f9640b6b6"
    }
```

```diff
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
      values.$pastUpgrades.0.1:
-        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
+        "0x68a58ddd9f1327bfd263dc7af326d6011c85c374c3b02df82ebff50f9640b6b6"
    }
```

```diff
    contract RollupEventInbox (0xdE3fdE71a026236b6b5C35505643FF4155EAb20D) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
      values.$pastUpgrades.0.1:
-        ["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]
+        "0x68a58ddd9f1327bfd263dc7af326d6011c85c374c3b02df82ebff50f9640b6b6"
    }
```

Generated with discovered.json: 0x990de6573bfdaf2241eadd21e7039b0c2422c822

# Diff at Wed, 16 Oct 2024 11:36:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20942187
- current block number: 20942187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942187 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x305042e5A81424f2f824f93Ff2195b5712D7dE14","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x305042e5A81424f2f824f93Ff2195b5712D7dE14"
+        "0x54F9375F5a6CEA1eECc561FC7f309aD8Cb633Ef9"
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0xA7275dd18Fe2BFd9A85c8BCd197ea3dE9a6cA6AA","via":[]}
    }
```

Generated with discovered.json: 0x49247bed5382a55c6d3f136f5b34cd10a16790d5

# Diff at Mon, 14 Oct 2024 10:51:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20942187
- current block number: 20942187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942187 (main branch discovery), not current.

```diff
    contract L1ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x12b277cae4866b3d1f1772fcb7f861dc23247452179f0736c9dbe7012f6c14f6"]
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
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract ProxyAdmin (0x305042e5A81424f2f824f93Ff2195b5712D7dE14) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract Outbox (0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x28eec040eca7563195b19e22e11429d0f977820bfb60ac52e567ffde3c92cf77"]
    }
```

```diff
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xb920455f1e366c7a89719abdd8d8174e4e7d353f2d4b7dea11b0571bf9526eae"]
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
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
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
    contract Inbox (0x97FdC935c5E25613AA13a054C7Aa71cf751DB495) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"]
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
    contract L1GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x61cc407871b0c56af41887c99354633d150e4586f0a6d237c6efd10966b17bd7"]
    }
```

```diff
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract RollupEventInbox (0xdE3fdE71a026236b6b5C35505643FF4155EAb20D) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcd37abd5bdcc8c37cbf37dcfa4889d5b238388344d913b3a48914f659e0d627b"]
    }
```

Generated with discovered.json: 0x37470f235f16775703e00e24b79e0307b9da0689

# Diff at Fri, 11 Oct 2024 11:49:58 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 20942187

## Description

Standard Orbit stack Optimium (AnyTrust, ArbOS 20). For example, 100% code identical to l3x.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x149e3df73d9D48cb6573555De9256cc1456F50B5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
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
    contract ProxyAdmin (0x305042e5A81424f2f824f93Ff2195b5712D7dE14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x38fB6Ad5908f61dC0bCeffbeDf4Bf781CbeA22Aa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x4eb4fB614e1aa3634513319F4Ec7334bC4321356)
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
    contract SequencerInbox (0x7B0517E0104dB60198f9d573C0aB8d480207827E)
    +++ description: State batches / commitments get posted here.
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
    contract Inbox (0x97FdC935c5E25613AA13a054C7Aa71cf751DB495)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xA880b3fC75928695ac75e06793277aC4bEA84a3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xb0d7A2d1eBA69dbcff839037D060E4f8B5c4431B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xc6CAd31D83E33Fc8fBc855f36ef9Cb2fCE070f5C)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xCdA94226d0BAFA963D6011fb2A06dEc7333646e8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xdE3fdE71a026236b6b5C35505643FF4155EAb20D)
    +++ description: None
```
