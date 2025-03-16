Generated with discovered.json: 0xc72d7cda4308ed6917d6d48bfbf475b3dfed471b

# Diff at Fri, 07 Mar 2025 09:15:46 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21915819
- current block number: 21994043

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915819 (main branch discovery), not current.

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xb01f65884fe035d6803702b048640f531f2e298d

# Diff at Thu, 06 Mar 2025 09:39:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21915819
- current block number: 21915819

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915819 (main branch discovery), not current.

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x8592Ca44dE1D354A20F75160F5602E5933D33761"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xfa92201c644add16ff7ae60d0ed8e1f27728a758

# Diff at Tue, 04 Mar 2025 10:39:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21915819
- current block number: 21915819

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915819 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569170
    }
```

```diff
    contract RealFastConfirmerMultisig (0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50) {
    +++ description: None
      sinceBlock:
+        21092332
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
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        19446518
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        19446518
    }
```

```diff
    contract GatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        19468287
    }
```

```diff
    contract SwapManager (0x4AC36E1Fa7daBeFEc885f30B163c571080b2c335) {
    +++ description: Performs swaps via Curve or UniswapV3 to serve instant withdrawals from the reETH RealVault.
      sinceBlock:
+        19869596
    }
```

```diff
    contract RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        19446518
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        19446518
    }
```

```diff
    contract StrategyManager (0x5Cba18d504D4158dC1A18C5Dc6BB2a30B230DdD8) {
    +++ description: A gateway contract that manages strategies for assets that are deposited to the AssetsVault. From a user PoV this happens when bridging to the L2.
      sinceBlock:
+        19869596
    }
```

```diff
    contract Minter (0x655756824385F8903AC8cFDa17B656cc26f7C7da) {
    +++ description: None
      sinceBlock:
+        19443364
    }
```

```diff
    contract LidoStEthStrategy (0x679D4C1cC6855C57726BEA1784F578315d6431f6) {
    +++ description: None
      sinceBlock:
+        19869596
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        19446518
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
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
      sinceBlock:
+        19446518
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
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: A Routing contract to the standard orbit stack bridge of the L2.
      sinceBlock:
+        19856851
    }
```

```diff
    contract Real (0xC0Cc5eA00cAe0894B441E3B5a3Bb57aa92F15421) {
    +++ description: None
      sinceBlock:
+        19443364
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        19446518
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
    contract RealStrategiesMultisig (0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4) {
    +++ description: None
      sinceBlock:
+        19836249
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        19446518
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        19446518
    }
```

```diff
    contract AssetsVault (0xf985E2c73d74BefF3C8c16EFC4fa5ab4cfb62294) {
    +++ description: This escrow contract receives ETH that users bridge to Re.al L2. This ETH is then converted to yielding assets using the StrategyManager.
      sinceBlock:
+        19869596
    }
```

```diff
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: This contract is responsible for managing deposit, withdrawal, and settlement processes for the assets backing reETH using the ERC4626 (tokenized vault) standard.
      sinceBlock:
+        19869596
    }
```

```diff
    contract ERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        19468287
    }
```

Generated with discovered.json: 0x932ad670d74b596b6bab1abbb1a92fcda1ca21fc

# Diff at Thu, 27 Feb 2025 11:46:24 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21915819
- current block number: 21915819

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21915819 (main branch discovery), not current.

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract GatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1OrbitGatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

```diff
    contract RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract ERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1OrbitERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

Generated with discovered.json: 0x6b44e146fcfe164dcf21b64c7c2a4563e07e8c5b

# Diff at Mon, 24 Feb 2025 15:37:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cfe18eb30997850b8abc4c6e718cd2a363aa4309 block: 21895114
- current block number: 21915819

## Description

Config: added a single caldera multisig name.

## Watched changes

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.stakerCount:
-        1
+        2
    }
```

Generated with discovered.json: 0x5223b2f00175d1c1b9d960e53148a5b581bdc794

# Diff at Fri, 21 Feb 2025 13:49:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21628399
- current block number: 21895114

## Description

Add operator addresses.

## Watched changes

```diff
    contract RealFastConfirmerMultisig (0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50) {
    +++ description: None
      values.$members.0:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"},{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]}
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
-        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}
      issuedPermissions.1.via.0:
-        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.to:
-        "0x0e00df1afC8574762Ac4C4D8E5D1a19bD6A8Fa2E"
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
-        "0x0e00df1afC8574762Ac4C4D8E5D1a19bD6A8Fa2E"
+        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.8:
+        {"permission":"validate","to":"0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.7:
+        {"permission":"validate","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.6:
+        {"permission":"validate","to":"0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.5:
+        {"permission":"validate","to":"0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50"}]}
      issuedPermissions.4.to:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
      issuedPermissions.4.via.0:
-        {"address":"0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50"}
      issuedPermissions.3.to:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
      issuedPermissions.0.to:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        2
+        4
      values.validators.5:
+        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
      values.validators.4:
+        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
      values.validators.3:
+        "0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
      values.validators.2:
+        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
      values.validators.1:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628399 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ERC20Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xee6b315bd34db150ff15f1334c696053f032fee8

# Diff at Tue, 04 Feb 2025 12:31:55 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21628399
- current block number: 21628399

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628399 (main branch discovery), not current.

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.1.to:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.via.0.address:
-        "0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0.address:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50"
    }
```

```diff
    contract RealStrategiesMultisig (0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: This contract is responsible for managing deposit, withdrawal, and settlement processes for the assets backing reETH using the ERC4626 (tokenized vault) standard.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xe1cdbbf0af1ed4b72a0bf0a16ef01c4d9a976ad0

# Diff at Mon, 20 Jan 2025 11:09:57 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628399
- current block number: 21628399

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628399 (main branch discovery), not current.

```diff
    contract RealFastConfirmerMultisig (0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      directlyReceivedPermissions.1.from:
+        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      directlyReceivedPermissions.0.target:
-        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      directlyReceivedPermissions.0.from:
+        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
    }
```

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
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
    contract ERC20Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
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
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
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
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
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
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
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
-        "0x0e00df1afC8574762Ac4C4D8E5D1a19bD6A8Fa2E"
      issuedPermissions.0.to:
+        "0x0e00df1afC8574762Ac4C4D8E5D1a19bD6A8Fa2E"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ERC20Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
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
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xfC89B875970122E24C6C5ADd4Dea139443943ea7"
      directlyReceivedPermissions.8.from:
+        "0xfC89B875970122E24C6C5ADd4Dea139443943ea7"
      directlyReceivedPermissions.7.target:
-        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
      directlyReceivedPermissions.7.from:
+        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
      directlyReceivedPermissions.6.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      directlyReceivedPermissions.6.from:
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      directlyReceivedPermissions.5.target:
-        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
      directlyReceivedPermissions.5.from:
+        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
      directlyReceivedPermissions.4.target:
-        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
      directlyReceivedPermissions.4.from:
+        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
      directlyReceivedPermissions.3.target:
-        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
      directlyReceivedPermissions.3.from:
+        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
      directlyReceivedPermissions.2.target:
-        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
      directlyReceivedPermissions.2.from:
+        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
      directlyReceivedPermissions.1.target:
-        "0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"
      directlyReceivedPermissions.1.from:
+        "0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"
      directlyReceivedPermissions.0.target:
-        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
      directlyReceivedPermissions.0.from:
+        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xfC89B875970122E24C6C5ADd4Dea139443943ea7"
      receivedPermissions.10.from:
+        "0xfC89B875970122E24C6C5ADd4Dea139443943ea7"
      receivedPermissions.9.target:
-        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
      receivedPermissions.9.from:
+        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
      receivedPermissions.8.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      receivedPermissions.8.from:
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      receivedPermissions.7.target:
-        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      receivedPermissions.7.from:
+        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      receivedPermissions.6.target:
-        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
      receivedPermissions.6.from:
+        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
      receivedPermissions.5.target:
-        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
      receivedPermissions.5.from:
+        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
      receivedPermissions.4.target:
-        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
      receivedPermissions.4.from:
+        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
      receivedPermissions.3.target:
-        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
      receivedPermissions.3.from:
+        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
      receivedPermissions.2.target:
-        "0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"
      receivedPermissions.2.from:
+        "0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"
      receivedPermissions.1.target:
-        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
      receivedPermissions.1.from:
+        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
      receivedPermissions.0.target:
-        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      receivedPermissions.0.from:
+        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      directlyReceivedPermissions.0.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      directlyReceivedPermissions.0.from:
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: A Routing contract to the standard orbit stack bridge of the L2.
      issuedPermissions.0.target:
-        "0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3"
      issuedPermissions.0.to:
+        "0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3"
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4.target:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
      issuedPermissions.4.via.0.delay:
-        0
      issuedPermissions.4.via.0.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.to:
+        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
      issuedPermissions.3.to:
+        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.target:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.via.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.to:
+        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
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
    contract RealStrategiesMultisig (0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1"
      receivedPermissions.1.from:
+        "0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1"
      receivedPermissions.0.target:
-        "0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1"
      receivedPermissions.0.from:
+        "0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1"
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
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
-        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      directlyReceivedPermissions.2.from:
+        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      directlyReceivedPermissions.1.target:
-        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      directlyReceivedPermissions.1.from:
+        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      directlyReceivedPermissions.0.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
      directlyReceivedPermissions.0.from:
+        "0xB032ff02cd6425e4b816137207AA8560932180f1"
    }
```

```diff
    contract ERC20Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
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
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: This contract is responsible for managing deposit, withdrawal, and settlement processes for the assets backing reETH using the ERC4626 (tokenized vault) standard.
      issuedPermissions.1.target:
-        "0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4"
      issuedPermissions.1.to:
+        "0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4"
      issuedPermissions.0.target:
-        "0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4"
      issuedPermissions.0.to:
+        "0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4"
      issuedPermissions.0.description:
+        "can manage asset strategies and fees for the user's funds backing reETH."
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
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

Generated with discovered.json: 0x2cdf65ac9a9d3249249fee3dab8ee47bafe73710

# Diff at Wed, 15 Jan 2025 07:30:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21465235
- current block number: 21628399

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

Generated with discovered.json: 0x4617278ba7be320dc5132aaf4eeb0b4c7ed70905

# Diff at Wed, 08 Jan 2025 10:44:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465235
- current block number: 21465235

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465235 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xc96c15b64220f7725032ef3594e8cda8c68c0995

# Diff at Mon, 23 Dec 2024 12:38:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21170377
- current block number: 21465235

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21170377 (main branch discovery), not current.

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x463345164468438bf4e9281ee3edd3e8dfcbde4c

# Diff at Thu, 05 Dec 2024 11:51:54 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21170377
- current block number: 21170377

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21170377 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xcbe47a833379dc84f08b86bfa7c56764e163a4e9

# Diff at Fri, 29 Nov 2024 11:28:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21170377
- current block number: 21170377

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21170377 (main branch discovery), not current.

```diff
    contract RealFastConfirmerMultisig (0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      directlyReceivedPermissions.0.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
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
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
      issuedPermissions.1.via.0.address:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50"
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.target:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.0.address:
-        "0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.0.via.0.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x9b46125245f1b0e152aa781e476241138df94215

# Diff at Fri, 29 Nov 2024 09:31:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21170377
- current block number: 21170377

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21170377 (main branch discovery), not current.

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xfC89B875970122E24C6C5ADd4Dea139443943ea7","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]}
      receivedPermissions.9.target:
-        "0xfC89B875970122E24C6C5ADd4Dea139443943ea7"
+        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
      receivedPermissions.8.target:
-        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      receivedPermissions.7.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      receivedPermissions.7.via.1:
-        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}
      receivedPermissions.7.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      receivedPermissions.6.target:
-        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
+        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
      receivedPermissions.6.via.1:
+        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}
      receivedPermissions.6.via.0.address:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xB032ff02cd6425e4b816137207AA8560932180f1"
      receivedPermissions.5.target:
-        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
+        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
      receivedPermissions.4.target:
-        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
+        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
      receivedPermissions.3.target:
-        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
+        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
      receivedPermissions.2.target:
-        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
+        "0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"
      receivedPermissions.1.target:
-        "0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"
+        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
+        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      receivedPermissions.0.via.1:
-        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}
      receivedPermissions.0.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","target":"0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62","via":[{"address":"0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]}
      issuedPermissions.3.via.0:
-        {"address":"0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0:
+        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","delay":0}
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xb223560da599927ce0060db1122bdd0282e3ad09

# Diff at Fri, 15 Nov 2024 08:18:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21170377
- current block number: 21170377

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21170377 (main branch discovery), not current.

```diff
    contract RealFastConfirmerMultisig (0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50) {
    +++ description: None
      directlyReceivedPermissions.2:
-        {"permission":"propose","target":"0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a","description":"can submit state roots to the RollupProxy contract on the host chain."}
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "validate"
      directlyReceivedPermissions.1.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      directlyReceivedPermissions.0.permission:
-        "challenge"
+        "configure"
      directlyReceivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.5:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","delay":0}]}
      issuedPermissions.4:
-        {"permission":"propose","target":"0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62","via":[{"address":"0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50","delay":0,"description":"can submit state roots to the RollupProxy contract on the host chain."}]}
      issuedPermissions.3.permission:
-        "propose"
+        "validate"
      issuedPermissions.3.via.0:
+        {"address":"0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}
      issuedPermissions.2.permission:
-        "configure"
+        "validate"
      issuedPermissions.2.via.0:
-        {"address":"0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50","delay":0,"description":"a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."}
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.0.address:
-        "0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.1.via.0.description:
-        "can challenge state roots on the host chain."
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.via.0:
+        {"address":"0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50","delay":0,"description":"a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."}
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

Generated with discovered.json: 0x78cce8e61f9b802afaaf60507b4c29b4f224b541

# Diff at Tue, 12 Nov 2024 08:22:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f2ba58e4822d6e1b44bf8df4bcf234795de075a7 block: 21135466
- current block number: 21170377

## Description

Added permission resolution for the RealVault contract (underlying assets management).

Rest config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21135466 (main branch discovery), not current.

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
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
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
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
    contract RealStrategiesMultisig (0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4) {
    +++ description: None
      name:
-        "EscrowMultisig"
+        "RealStrategiesMultisig"
      receivedPermissions:
+        [{"permission":"configure","target":"0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1","description":"can manage asset strategies and fees for the user's funds backing reETH."},{"permission":"upgrade","target":"0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1"}]
    }
```

```diff
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: This contract is responsible for managing deposit, withdrawal, and settlement processes for the assets backing reETH using the ERC4626 (tokenized vault) standard.
      issuedPermissions:
+        [{"permission":"configure","target":"0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4","via":[]},{"permission":"upgrade","target":"0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4","via":[]}]
    }
```

Generated with discovered.json: 0xc7b1ff5e59690ffc663e377ed6ac3259f717f0ba

# Diff at Thu, 07 Nov 2024 11:26:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e983273bf2ca9304e4b729faaddf20acae0f6c19 block: 21093375
- current block number: 21135466

## Description

Move to discoveryDriven data, add fastConfirmer permission. Re.al uses a 1/1 fast-confirmer validator with a 12s minimum assertion period.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21093375 (main branch discovery), not current.

```diff
    contract RealFastConfirmerMultisig (0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "RealFastConfirmerMultisig"
      directlyReceivedPermissions.2:
+        {"permission":"propose","target":"0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a","description":"can submit state roots to the RollupProxy contract on the host chain."}
      directlyReceivedPermissions.1.permission:
-        "propose"
+        "configure"
      directlyReceivedPermissions.1.description:
-        "can submit state roots to the RollupProxy contract on the host chain."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

```diff
    contract ERC20Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      displayName:
+        "Bridge"
    }
```

```diff
    contract SwapManager (0x4AC36E1Fa7daBeFEc885f30B163c571080b2c335) {
    +++ description: Performs swaps via Curve or UniswapV3 to serve instant withdrawals from the reETH RealVault.
      description:
+        "Performs swaps via Curve or UniswapV3 to serve instant withdrawals from the reETH RealVault."
    }
```

```diff
    contract StrategyManager (0x5Cba18d504D4158dC1A18C5Dc6BB2a30B230DdD8) {
    +++ description: A gateway contract that manages strategies for assets that are deposited to the AssetsVault. From a user PoV this happens when bridging to the L2.
      description:
+        "A gateway contract that manages strategies for assets that are deposited to the AssetsVault. From a user PoV this happens when bridging to the L2."
    }
```

```diff
    contract ERC20Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      displayName:
+        "Outbox"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10:
-        {"permission":"upgrade","target":"0xfC89B875970122E24C6C5ADd4Dea139443943ea7","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]}
      receivedPermissions.9.target:
-        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
+        "0xfC89B875970122E24C6C5ADd4Dea139443943ea7"
      receivedPermissions.8.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
      receivedPermissions.7.target:
-        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      receivedPermissions.7.via.1:
+        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}
      receivedPermissions.7.via.0.address:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xB032ff02cd6425e4b816137207AA8560932180f1"
      receivedPermissions.6.target:
-        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
+        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      receivedPermissions.6.via.1:
-        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}
      receivedPermissions.6.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      receivedPermissions.5.target:
-        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
+        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
      receivedPermissions.4.target:
-        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
+        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
      receivedPermissions.3.target:
-        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
+        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
      receivedPermissions.2.target:
-        "0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"
+        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
      receivedPermissions.1.target:
-        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
+        "0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"
      receivedPermissions.0.permission:
-        "configure"
+        "upgrade"
      receivedPermissions.0.target:
-        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
+        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.via.1:
+        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}
      receivedPermissions.0.via.0.address:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xB032ff02cd6425e4b816137207AA8560932180f1"
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: A Routing contract to the standard orbit stack bridge of the L2.
      description:
+        "A Routing contract to the standard orbit stack bridge of the L2."
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
      issuedPermissions.2.via.0.address:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50"
      issuedPermissions.2.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
-        {"permission":"upgrade","target":"0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"}
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "upgrade"
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ERC20Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      displayName:
+        "Inbox"
    }
```

```diff
    contract AssetsVault (0xf985E2c73d74BefF3C8c16EFC4fa5ab4cfb62294) {
    +++ description: This escrow contract receives ETH that users bridge to Re.al L2. This ETH is then converted to yielding assets using the StrategyManager.
      description:
+        "This escrow contract receives ETH that users bridge to Re.al L2. This ETH is then converted to yielding assets using the StrategyManager."
    }
```

```diff
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: This contract is responsible for managing deposit, withdrawal, and settlement processes for the assets backing reETH using the ERC4626 (tokenized vault) standard.
      description:
+        "This contract is responsible for managing deposit, withdrawal, and settlement processes for the assets backing reETH using the ERC4626 (tokenized vault) standard."
    }
```

Generated with discovered.json: 0x138be24d02ed5beac9fd4c3a5f0fd32b6c279e45

# Diff at Mon, 04 Nov 2024 07:59:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21093375
- current block number: 21093375

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21093375 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
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
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xfC89B875970122E24C6C5ADd4Dea139443943ea7","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]}
      receivedPermissions.9.target:
-        "0xfC89B875970122E24C6C5ADd4Dea139443943ea7"
+        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
      receivedPermissions.8.target:
-        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      receivedPermissions.7.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      receivedPermissions.7.via.1:
-        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}
      receivedPermissions.7.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      receivedPermissions.6.target:
-        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
+        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
      receivedPermissions.6.via.1:
+        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}
      receivedPermissions.6.via.0.address:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xB032ff02cd6425e4b816137207AA8560932180f1"
      receivedPermissions.5.target:
-        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
+        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
      receivedPermissions.4.target:
-        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
+        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
      receivedPermissions.3.target:
-        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
+        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
      receivedPermissions.2.target:
-        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
+        "0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"
      receivedPermissions.1.target:
-        "0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"
+        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
+        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
      receivedPermissions.0.via.1:
-        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}
      receivedPermissions.0.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.5:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","delay":0}]}
      issuedPermissions.4.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.4.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
      issuedPermissions.4.via.0.address:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50"
      issuedPermissions.4.via.0.description:
+        "can submit state roots to the RollupProxy contract on the host chain."
      issuedPermissions.3.via.0:
-        {"address":"0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50","delay":0,"description":"can submit state roots to the RollupProxy contract on the host chain."}
      issuedPermissions.2.permission:
-        "propose"
+        "configure"
      issuedPermissions.2.target:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0:
+        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x4cc68bc7c1a5480b147fdc6b691675ebfdeb7344

# Diff at Fri, 01 Nov 2024 14:25:31 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078401
- current block number: 21093375

## Description

Upgrades to the latest [ArbOS v32](https://docs.arbitrum.io/run-arbitrum-node/arbos-releases/arbos32).

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.2:
+        ["2024-10-30T18:24:35.000Z","0xf18555dd5a5c4707f15cd5aa6dedd147bc01eb9212ff4d0e2751fc8ee97f8761",["0x02E05A9245C5853f895daDcc3A8216C953C8736B"]]
      values.$upgradeCount:
-        2
+        3
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
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      issuedPermissions.4:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","delay":0}]}
      issuedPermissions.3:
+        {"permission":"propose","target":"0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62","via":[{"address":"0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50","delay":0,"description":"can submit state roots to the RollupProxy contract on the host chain."}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
      issuedPermissions.2.via.0:
-        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "challenge"
      issuedPermissions.1.via.0:
+        {"address":"0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50","delay":0,"description":"can challenge state roots on the host chain."}
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$pastUpgrades.1:
+        ["2024-10-30T18:24:35.000Z","0xf18555dd5a5c4707f15cd5aa6dedd147bc01eb9212ff4d0e2751fc8ee97f8761",["0x9B56A789fEDD5df27dBaB53b085F7157397cA17D","0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
      values.minimumAssertionPeriod:
-        75
+        1
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        2
      values.validators.1:
+        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
      values.validators.0:
-        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+        "0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x118Ab5501564F1Cfa755d0b3070874a26c1C3A50)
    +++ description: None
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
.../ChallengeManager/ChallengeManager.sol          |  404 +++++---
 .../ethereum/.flat/GnosisSafeL2/GnosisSafeL2.sol   | 1032 ++++++++++++++++++++
 .../.flat/GnosisSafeL2/GnosisSafeProxy.p.sol       |   35 +
 .../OneStepProofEntry.sol                          |  485 +++++++--
 .../{.flat@21078401 => .flat}/OneStepProver0.sol   |  765 ++++++++++-----
 .../OneStepProverHostIo.sol                        |  892 ++++++++++++++---
 .../OneStepProverMath.sol                          |   65 +-
 .../OneStepProverMemory.sol                        |  315 ++++--
 .../RollupProxy/RollupAdminLogic.1.sol             |  370 ++++---
 .../RollupProxy/RollupUserLogic.2.sol              |  415 +++++---
 10 files changed, 3833 insertions(+), 945 deletions(-)
```

Generated with discovered.json: 0x0a2eded6f4f7cc7bd24174294248cd8914809553

# Diff at Wed, 30 Oct 2024 12:17:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 21041849
- current block number: 21078401

## Description

Upgrade to ArbOS v20 on known L1 contracts and GelatoMultisig changes.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"
+        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
      values.$implementation:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      values.$pastUpgrades.1:
+        ["2024-10-30T09:43:11.000Z","0xaf5b759f18a6b1150b87e3c0e93270201a165763e4f2d42d75bec75ab7f258bf",["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"
+        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
      values.$implementation:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
      values.$pastUpgrades.1:
+        ["2024-10-30T09:43:11.000Z","0xaf5b759f18a6b1150b87e3c0e93270201a165763e4f2d42d75bec75ab7f258bf",["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]]
      values.$upgradeCount:
-        1
+        2
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
+        [5760,48,86400,3600]
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
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.8:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.7:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.6:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.5:
-        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$threshold:
-        6
+        4
      values.multisigThreshold:
-        "6 of 9 (67%)"
+        "4 of 8 (50%)"
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v11 wasmModuleRoot"
+        "ArbOS v20 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
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

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

Generated with discovered.json: 0xa5b3daef192cd8af98f03ff6c587a0f3efadda12

# Diff at Tue, 29 Oct 2024 13:16:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041849
- current block number: 21041849

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041849 (main branch discovery), not current.

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      template:
+        "orbitstack/ERC20Gateway"
      displayName:
+        "ERC20Gateway"
      description:
+        "Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract."
    }
```

Generated with discovered.json: 0x0d7820aa837ddb2a5abc836ad54d314dc1e41e6d

# Diff at Tue, 29 Oct 2024 08:05:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041849
- current block number: 21041849

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041849 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]},{"permission":"upgrade","target":"0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]},{"permission":"upgrade","target":"0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]},{"permission":"upgrade","target":"0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]},{"permission":"upgrade","target":"0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]},{"permission":"upgrade","target":"0x8592Ca44dE1D354A20F75160F5602E5933D33761","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]},{"permission":"upgrade","target":"0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a","via":[{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]},{"permission":"upgrade","target":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]},{"permission":"upgrade","target":"0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]},{"permission":"upgrade","target":"0xfC89B875970122E24C6C5ADd4Dea139443943ea7","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"},{"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"}]
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0:
+        {"address":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]},{"permission":"upgrade","target":"0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]},{"permission":"upgrade","target":"0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]},{"permission":"upgrade","target":"0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]},{"permission":"upgrade","target":"0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]},{"permission":"upgrade","target":"0x8592Ca44dE1D354A20F75160F5602E5933D33761","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]},{"permission":"upgrade","target":"0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"},{"permission":"upgrade","target":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]},{"permission":"upgrade","target":"0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]},{"permission":"upgrade","target":"0xfC89B875970122E24C6C5ADd4Dea139443943ea7","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"}
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
    }
```

Generated with discovered.json: 0x191e7286d16fdef1055ef9ae00f22a539463f2ce

# Diff at Mon, 28 Oct 2024 14:05:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041849
- current block number: 21041849

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041849 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"]
    }
```

Generated with discovered.json: 0xe50290e5c2ee53513c5d9c57c560ce7803175079

# Diff at Fri, 25 Oct 2024 09:51:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20941805
- current block number: 21041849

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941805 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.0.via.0:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.0.via.0:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.0.via.0:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.0.via.0:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.1.via.0:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.0.via.0:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"},{"permission":"upgrade","target":"0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"},{"permission":"upgrade","target":"0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"},{"permission":"upgrade","target":"0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"},{"permission":"upgrade","target":"0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"},{"permission":"upgrade","target":"0x8592Ca44dE1D354A20F75160F5602E5933D33761"},{"permission":"upgrade","target":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"},{"permission":"upgrade","target":"0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"},{"permission":"upgrade","target":"0xfC89B875970122E24C6C5ADd4Dea139443943ea7"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"},{"permission":"upgrade","target":"0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03"},{"permission":"upgrade","target":"0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"},{"permission":"upgrade","target":"0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"},{"permission":"upgrade","target":"0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"},{"permission":"upgrade","target":"0x8592Ca44dE1D354A20F75160F5602E5933D33761"},{"permission":"upgrade","target":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"},{"permission":"upgrade","target":"0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"},{"permission":"upgrade","target":"0xfC89B875970122E24C6C5ADd4Dea139443943ea7"}]
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.0.via.0:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xfC89B875970122E24C6C5ADd4Dea139443943ea7","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x8592Ca44dE1D354A20F75160F5602E5933D33761","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03","via":[{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]}
      receivedPermissions.0.target:
-        "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"
+        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
      receivedPermissions.0.via:
+        [{"address":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xB032ff02cd6425e4b816137207AA8560932180f1"}]
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.0.via.0:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      issuedPermissions.0.via.0:
+        {"address":"0xB032ff02cd6425e4b816137207AA8560932180f1","delay":0}
    }
```

Generated with discovered.json: 0x25542af5901e6cfa980ffc3ee92ce45007150d8d

# Diff at Wed, 23 Oct 2024 14:36:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20941805
- current block number: 20941805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941805 (main branch discovery), not current.

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
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
    }
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
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
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
-   Status: DELETED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v11 wasmModuleRoot"
+        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v11 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
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

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

Generated with discovered.json: 0x3e022d3a7109d1a1efadcbab9be9d416a7ea6ba8

# Diff at Mon, 21 Oct 2024 12:47:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20941805
- current block number: 20941805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941805 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0x8f82bc93903bfee84f9dd779c5efb202554a3ca5

# Diff at Mon, 21 Oct 2024 11:09:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20941805
- current block number: 20941805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941805 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
      values.$pastUpgrades.0.1:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]
      values.$pastUpgrades.0.1:
-        ["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]
+        "0x816e110bc6a5c398f160b13e96856e756ea11282881dcb718e95efe00bd1fb7e"
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
      values.$pastUpgrades.0.1:
-        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
      values.$pastUpgrades.0.1:
-        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x19431dc37098877486532250FB3158140717C00C"]
      values.$pastUpgrades.0.1:
-        ["0x19431dc37098877486532250FB3158140717C00C"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x977cA9732E618D32552BA16a52f258cEFadf970a"]
      values.$pastUpgrades.0.1:
-        ["0x977cA9732E618D32552BA16a52f258cEFadf970a"]
+        "0xff78834db538bd6b5be8abf30e32fd3861100c0fbde76f7c11b1cd1a3a2d6c0f"
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
      values.$pastUpgrades.0.1:
-        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
+        "0xba3fd77d6025e002501d3e0e0a2bb7326be1d2b9d45a15a0a8f51d412783180d"
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]
      values.$pastUpgrades.0.1:
-        ["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]
+        "0x816e110bc6a5c398f160b13e96856e756ea11282881dcb718e95efe00bd1fb7e"
    }
```

Generated with discovered.json: 0xf55d6fcfc19e4943a8ebdad9c3c6847efdd03f9a

# Diff at Wed, 16 Oct 2024 11:39:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20941805
- current block number: 20941805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941805 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0xB032ff02cd6425e4b816137207AA8560932180f1"
+        "0x0e00df1afC8574762Ac4C4D8E5D1a19bD6A8Fa2E"
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x4b8Fbc3006F256dd470B070d6c70fAb413Fceb62","via":[]}
    }
```

Generated with discovered.json: 0xb085b6a914c777e4a67d0bafce9fe842720533bd

# Diff at Mon, 14 Oct 2024 10:54:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20941805
- current block number: 20941805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941805 (main branch discovery), not current.

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
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"]
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
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
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x33422e0ac90902db5dad442b006c9df60e262556d8ad286808d133b5429a3eb0"]
    }
```

```diff
    contract SwapManager (0x4AC36E1Fa7daBeFEc885f30B163c571080b2c335) {
    +++ description: None
      sourceHashes:
+        ["0x2c2f591c433021e5d54b67a3354fdc84c7f692a02fa61ec538dd633e890c4ad7"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"]
    }
```

```diff
    contract StrategyManager (0x5Cba18d504D4158dC1A18C5Dc6BB2a30B230DdD8) {
    +++ description: None
      sourceHashes:
+        ["0x6c6e93784f31191cf2b9284f57d6baac2bb7aef141c3482e250edade70dfa4be"]
    }
```

```diff
    contract Minter (0x655756824385F8903AC8cFDa17B656cc26f7C7da) {
    +++ description: None
      sourceHashes:
+        ["0x426161bad834d6302cbb3deabf564724483a57f7cdcdd24427d7dd9ea6405056"]
    }
```

```diff
    contract LidoStEthStrategy (0x679D4C1cC6855C57726BEA1784F578315d6431f6) {
    +++ description: None
      sourceHashes:
+        ["0xc18d8670e65f3ea1dc2fe9ee3114bfad504f6ee8998a9f9d6f79cc971a03814a"]
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
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
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: None
      sourceHashes:
+        ["0xd1f7ca44e10a593bfb38d908f60152c671082099b46d925d37a1eeba4f33bfda","0xaeb5734c5862ad1b95a66ae767bb08920938ed5de5fd7455221098e0d37c44dd"]
    }
```

```diff
    contract Real (0xC0Cc5eA00cAe0894B441E3B5a3Bb57aa92F15421) {
    +++ description: None
      sourceHashes:
+        ["0xf263e5f0d820b658ef0dd05015c2b4b333f38c76fcee96b52b307a19e0654162"]
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract EscrowMultisig (0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
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
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract AssetsVault (0xf985E2c73d74BefF3C8c16EFC4fa5ab4cfb62294) {
    +++ description: None
      sourceHashes:
+        ["0x530019aa460a94ec770462491a461be4caebfe1a7a4e9adc91beb51d7a98187c"]
    }
```

```diff
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: None
      sourceHashes:
+        ["0x3a95f1a37b3000abfc131510d1895ebfa14d26888610509cb2dd8ff7ffe4c81c"]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x17c9d8bf5017982cb88ab1d4f22a085c097ab9c7a910fa109fe9e7204840bef8"]
    }
```

Generated with discovered.json: 0x98a0771c749aa0ed8dc3faf94a63cc876be2d3a1

# Diff at Fri, 11 Oct 2024 10:33:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8f7c5fd25193054458be38552e62a708c480b2c8 block: 20842802
- current block number: 20941805

## Description

Gelato MS signer removed, one DAC member added, one changed.

## Watched changes

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.membersCount:
-        1
+        2
      values.dacKeyset.blsSignatures.1:
+        "YBRYWM3r9QjDsxiTYDBsz7DLQsSk8ww7UeuNmhhAa+Spo31J5lWspLpAwHynMqRoDRkEg0bP1Y6Wivt1kwBOM2fDRs97y2vUB/OQpju9aok8WdBTJ16K9sM6Hlv0bT62ChK2Otjpjug8u839aoVPAZhojuYmW1hslHipM/JqYlCaVwHlB1hyp4kc8v230j6I6gsE1Bw1WMvxVXbP05bXwnO7ZIM+dQugQFWoDDZOS1HMIY+I9B+389vkEFGkjF8CPw5uGnIgdhabcqQFRkceDLVb7vMqJGgf/Oi4nKy6CKEJILwsf+grAdHY1MDDpe0WWRJflAnSemnZbpCaGqIEY1sEE/69idZuSbuqiHtmU0AGWcFcngv+WFjfG6Xr1V1tRw=="
      values.dacKeyset.blsSignatures.0:
-        "YAWa/w4rq6sHO4ozBBwPL3un0A6NDa3V163lAXaJmPZmihk4ntRlBqwcjz3Hq2NJWgcMOYyZicf+cyzYzT33XiJRcNMidWZ04qP6b7ZRHZh7R0p+YycNLqBxfRdNtllWJglg7ynQO4Suel9bqlzc+0Yq8ZuoHTHJXVVd4psJariQ/dNE16NqExPpV/jfJdFVThaAoNqowj5K/bl0VWEKPzxnf4ttwFM38wnUOIvmNHvVOREbkiWzus6H/6B7Cl7BygWo5cs97lUTeMuatpIqR/yNw352EkRLOLrmFTrg36zV9F8jebStSVDZ3M002mBH1gpxq5pQFaCb0lpXE0vmB08dfg7jS6KWU/OMlLZzVPk2DVKhkqtpDC5JAMkRNxrwfQ=="
+        "YBJCXtJZAUzwENdMJDCrgB6pWhA4ldiCFRNdySmzbLpcXriGq7NeKGLHyW5RcbP49QLgp7h9Asr+8KEc4coM7E0hRWXz6pU6W/rGUBAM1F0BtZNWdVQIp45BfwocbS4wxBWylr0ibVn8sJhVWG5uOY0kF0EddnVBElucIld+gTUyuTcNNKTHUqC1RdOI91XkKAC28qY5HGhdk41zEU8swBwjAIKmUbg+fcrKyxy/hs8OmySPr9YmPKnEv42CR0O0oBnadp/8W8WVrJRit2jwBQAXxLj52BxnGJkRA6x0DLkM+mXhU0ASMQB3EcWz5UaMZBfSXy4taHskYoDrqicHh5CCEAq7KoWive1o/stdn9VfnaGNL+uUqhGPg6Qbr/+oMw=="
      values.keySetUpdates:
-        1
+        2
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.7:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.6:
-        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.multisigThreshold:
-        "6 of 10 (60%)"
+        "6 of 9 (67%)"
    }
```

Generated with discovered.json: 0xee942efa816220afd64b71592d5a041bf9650916

# Diff at Tue, 01 Oct 2024 10:54:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842802
- current block number: 20842802

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842802 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]]]
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-19T10:45:59.000Z",["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]]]
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x873484Ba63353C8b71210ce123B465512d408B27"]]]
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x19431dc37098877486532250FB3158140717C00C"]]]
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-12T22:14:35.000Z",["0x977cA9732E618D32552BA16a52f258cEFadf970a"]]]
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-16T09:18:35.000Z",["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]]]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-19T10:45:59.000Z",["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]]]
    }
```

Generated with discovered.json: 0x65ccc72ab6014fe3fdbc6824de1013570c9429ec

# Diff at Fri, 27 Sep 2024 15:18:29 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20633391
- current block number: 20842802

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20633391 (main branch discovery), not current.

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x29d3a7c6ec57a2c415f3375adfd1052bf227e620

# Diff at Sun, 01 Sep 2024 08:45:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20633391
- current block number: 20633391

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20633391 (main branch discovery), not current.

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "ArbOS v11 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x36a7562dc5538d8037bacad46306a73e0429934c

# Diff at Fri, 30 Aug 2024 07:56:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20633391
- current block number: 20633391

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20633391 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
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
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x594138a401633a165837723395004aa9fb61155f

# Diff at Thu, 29 Aug 2024 09:37:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8d42e344df72950493a6d9b63b8f4e541ef02586 block: 20583702
- current block number: 20633391

## Description

Ignore value.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583702 (main branch discovery), not current.

```diff
    contract LidoStEthStrategy (0x679D4C1cC6855C57726BEA1784F578315d6431f6) {
    +++ description: None
      values.getClaimableValue:
-        0
    }
```

Generated with discovered.json: 0x4d09ed055a70a73ffb88d198d954094ad2231aad

# Diff at Fri, 23 Aug 2024 09:54:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20583702
- current block number: 20583702

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583702 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x087ca83faaa7bd2b28e9b1196e8275034badbc7e

# Diff at Thu, 22 Aug 2024 11:00:15 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 20177361
- current block number: 20583702

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177361 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YAWa/w4rq6sHO4ozBBwPL3un0A6NDa3V163lAXaJmPZmihk4ntRlBqwcjz3Hq2NJWgcMOYyZicf+cyzYzT33XiJRcNMidWZ04qP6b7ZRHZh7R0p+YycNLqBxfRdNtllWJglg7ynQO4Suel9bqlzc+0Yq8ZuoHTHJXVVd4psJariQ/dNE16NqExPpV/jfJdFVThaAoNqowj5K/bl0VWEKPzxnf4ttwFM38wnUOIvmNHvVOREbkiWzus6H/6B7Cl7BygWo5cs97lUTeMuatpIqR/yNw352EkRLOLrmFTrg36zV9F8jebStSVDZ3M002mBH1gpxq5pQFaCb0lpXE0vmB08dfg7jS6KWU/OMlLZzVPk2DVKhkqtpDC5JAMkRNxrwfQ=="]
    }
```

Generated with discovered.json: 0x5cb8daed8dec2a3d20c721b8c5162895bd4f6215

# Diff at Wed, 21 Aug 2024 10:05:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20177361
- current block number: 20177361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177361 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d","0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03","0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18","0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C","0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0","0x8592Ca44dE1D354A20F75160F5602E5933D33761","0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","0xfC89B875970122E24C6C5ADd4Dea139443943ea7"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d","via":[]},{"permission":"upgrade","target":"0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03","via":[]},{"permission":"upgrade","target":"0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18","via":[]},{"permission":"upgrade","target":"0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C","via":[]},{"permission":"upgrade","target":"0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0","via":[]},{"permission":"upgrade","target":"0x8592Ca44dE1D354A20F75160F5602E5933D33761","via":[]},{"permission":"upgrade","target":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","via":[]},{"permission":"upgrade","target":"0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","via":[]},{"permission":"upgrade","target":"0xfC89B875970122E24C6C5ADd4Dea139443943ea7","via":[]}]
    }
```

```diff
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3","via":[]}]
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a","via":[]}]
    }
```

```diff
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB032ff02cd6425e4b816137207AA8560932180f1","via":[]}]
    }
```

Generated with discovered.json: 0xe7343f6f8e6e545996a3973fa66c8d60871b1fa2

# Diff at Fri, 09 Aug 2024 12:01:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20177361
- current block number: 20177361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177361 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
+        "0xfC89B875970122E24C6C5ADd4Dea139443943ea7"
      assignedPermissions.upgrade.7:
-        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
+        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
      assignedPermissions.upgrade.6:
-        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
+        "0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"
      assignedPermissions.upgrade.5:
-        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
+        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
      assignedPermissions.upgrade.4:
-        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
+        "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0"
      assignedPermissions.upgrade.3:
-        "0x8592Ca44dE1D354A20F75160F5602E5933D33761"
+        "0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C"
      assignedPermissions.upgrade.2:
-        "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11"
+        "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18"
      assignedPermissions.upgrade.0:
-        "0xfC89B875970122E24C6C5ADd4Dea139443943ea7"
+        "0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d"
    }
```

Generated with discovered.json: 0x0677537fb87c8ddc24eb032687875994d450b561

# Diff at Fri, 09 Aug 2024 10:11:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20177361
- current block number: 20177361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177361 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d","0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03","0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18","0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C","0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0","0x8592Ca44dE1D354A20F75160F5602E5933D33761","0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a","0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","0xfC89B875970122E24C6C5ADd4Dea139443943ea7"]
      assignedPermissions.upgrade:
+        ["0xfC89B875970122E24C6C5ADd4Dea139443943ea7","0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03","0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11","0x8592Ca44dE1D354A20F75160F5602E5933D33761","0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18","0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C","0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0","0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d","0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a"]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 10 (60%)"
      values.getOwners:
-        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.getThreshold:
-        6
      values.$members:
+        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 10 (60%)"
    }
```

```diff
    contract EscrowMultisig (0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 5 (80%)"
      values.getOwners:
-        ["0x240B5E0746eda8cBc137Fc67210532a1D2B5b82A","0xf16Df80dBA33bB54018F99A3679801Bc9cA14Fe0","0x6bD40C6f7849160FE217D07a73E15f4ef8222283","0xFbce8758DBF56d574A80fa3A6AB27275a8F1EF6A","0x7cFaD85633CD000c83Fcf99a678044dDC14125bD"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x240B5E0746eda8cBc137Fc67210532a1D2B5b82A","0xf16Df80dBA33bB54018F99A3679801Bc9cA14Fe0","0x6bD40C6f7849160FE217D07a73E15f4ef8222283","0xFbce8758DBF56d574A80fa3A6AB27275a8F1EF6A","0x7cFaD85633CD000c83Fcf99a678044dDC14125bD"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 5 (80%)"
    }
```

```diff
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"]
      assignedPermissions.upgrade:
+        ["0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a"]
    }
```

Generated with discovered.json: 0xcaf569c377b5fb07061abd15c9ea763eddb1f7b9

# Diff at Tue, 30 Jul 2024 11:13:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20177361
- current block number: 20177361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177361 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x637b326a46fbeff53da8fd4fb944e684358001e5

# Diff at Wed, 12 Jun 2024 04:47:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b9a39f700e84af1cffa010ce0e20e64b23a4c64 block: 20032983
- current block number: 20073454

## Description

Two previously-unverified contracts are now verified. 
The only registered strategy backing reETH is currently depositing ETH into Lido and holding stETH. There is a SwapManager that serves instant withdrawals through Curve and Uniswap.

All escrowing and strategy-related contracts have a new Multisig as governance, but the ownership transfer is still pending. (the EOA Warning is now removed).

## Watched changes

```diff
    contract SwapManager (0x4AC36E1Fa7daBeFEc885f30B163c571080b2c335) {
    +++ description: None
      values.owner:
-        "0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3"
+        "0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4"
    }
```

```diff
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: None
      values.owner:
-        "0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3"
+        "0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4"
      values.proposal:
-        "0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3"
+        "0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4"
    }
```

```diff
+   Status: CREATED
    contract EscrowMultisig (0xD47E2043C1eCbeF215D89EE667D09A7aA56823d4)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/EscrowMultisig/GnosisSafe.sol   | 952 +++++++++++++++++++++
 .../.flat/EscrowMultisig/GnosisSafeProxy.p.sol     |  34 +
 2 files changed, 986 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032983 (main branch discovery), not current.

```diff
    contract StrategyManager (0x5Cba18d504D4158dC1A18C5Dc6BB2a30B230DdD8) {
    +++ description: None
      unverified:
-        true
      values:
+        {"assetsVault":"0xf985E2c73d74BefF3C8c16EFC4fa5ab4cfb62294","getAllStrategiesValue":"311079739008922993052","getAllStrategyPendingValue":0,"getStrategies":{"addrs":["0x679D4C1cC6855C57726BEA1784F578315d6431f6"],"allocations":[1000000]},"getTotalInvestedValue":{"_value":"311079739008922993052","strategiesValue":["311079739008922993052"]},"realVault":"0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1"}
    }
```

```diff
    contract  (0x679D4C1cC6855C57726BEA1784F578315d6431f6) {
    +++ description: None
      name:
-        ""
+        "LidoStEthStrategy"
      unverified:
-        true
      values:
+        {"getClaimableValue":0,"getInvestedValue":"311079739008922993052","getStETHWithdrawalStatus":{"requestIds":[],"statuses":[]},"getTotalValue":"311079739008922993052","governance":"0xeB658c4Ea908aC4dAF9c309D8f883d6aD758b3A3","manager":"0x5Cba18d504D4158dC1A18C5Dc6BB2a30B230DdD8","MAX_STETH_WITHDRAWAL_AMOUNT":"1000000000000000000000","MIN_STETH_WITHDRAWAL_AMOUNT":100,"name":"Lido Investment Strategy","STETH":"0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84","stETHWithdrawalQueue":"0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1","swapManager":"0x4AC36E1Fa7daBeFEc885f30B163c571080b2c335","WETH9":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","WSTETH":"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"}
    }
```

```diff
+   Status: CREATED
    contract SwapManager (0x4AC36E1Fa7daBeFEc885f30B163c571080b2c335)
    +++ description: None
```

Generated with discovered.json: 0x862f9fa7833edb8299291eee9bf9ae8db2c2ef87

# Diff at Thu, 06 Jun 2024 13:07:44 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@2df820b7859b4cc22d454496f119009c157cc438 block: 20030638
- current block number: 20032983

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20030638 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0) {
    +++ description: State batches / commitments get posted here.
      template:
+        "orbitstack/SequencerInbox"
    }
```

```diff
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      template:
+        "orbitstack/RollupProxy"
    }
```

Generated with discovered.json: 0x412c3152a7e9266e259ca114662031a4d33f2e21

# Diff at Thu, 06 Jun 2024 05:15:31 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@508157754f563221cb69d9a7257ec7bb4f731937 block: 20025625
- current block number: 20030638

## Description

Reconfigured discovery to ignore token related values.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20025625 (main branch discovery), not current.

```diff
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: None
      values.getVaultAvailableAmount:
-        [0,"310422643444773035033"]
      values.latestRoundID:
-        17
      values.withdrawAmountDust:
-        0
    }
```

Generated with discovered.json: 0xd8292d70fd71441d43b5cde9d3e77785b0a78059

# Diff at Wed, 05 Jun 2024 12:27:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 20025625

## Description

Initial discovery: Orbit stack L2 by Gelato RaaS with AnyTrust 1/1 DAC. The custom native token is backed by  LSTs and the according Vaults are EOA-governed. (strategyManager unverified)

## Initial discovery

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
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract StrategyManager (0x5Cba18d504D4158dC1A18C5Dc6BB2a30B230DdD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Minter (0x655756824385F8903AC8cFDa17B656cc26f7C7da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x679D4C1cC6855C57726BEA1784F578315d6431f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
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
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Real (0xC0Cc5eA00cAe0894B441E3B5a3Bb57aa92F15421)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AssetsVault (0xf985E2c73d74BefF3C8c16EFC4fa5ab4cfb62294)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7)
    +++ description: None
```
