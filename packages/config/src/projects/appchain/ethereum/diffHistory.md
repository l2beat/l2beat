Generated with discovered.json: 0x4361d2c63395be7206bb2101a4089e7e9bdef594

# Diff at Tue, 22 Jul 2025 16:08:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 22779991
- current block number: 22975805

## Description

Caldera MS 3 signers added.

## Watched changes

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      values.$members.0:
+        "eth:0xc4548687682246e5B6ee8f914635c9f47836eDFe"
      values.$members.1:
+        "eth:0x2F2d46D3dD36c8d1ae2Cb81c0cD2c05C68DBA675"
      values.$members.2:
+        "eth:0xe62a4A1e6D237d6fc40d88F819D5cE580a996A6b"
      values.multisigThreshold:
-        "4 of 6 (67%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0xde037af32457564ffc6369eb84189598325d0f08

# Diff at Mon, 14 Jul 2025 12:44:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22779991
- current block number: 22779991

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22779991 (main branch discovery), not current.

```diff
    contract Inbox (0x010aDE5d8F9DC340531140802438798C189c36E0) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x010aDE5d8F9DC340531140802438798C189c36E0"
+        "eth:0x010aDE5d8F9DC340531140802438798C189c36E0"
      values.$admin:
-        "0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      values.$implementation:
-        "0x74110Fb401469FEA31A10680e28c9C4c17aFdd36"
+        "eth:0x74110Fb401469FEA31A10680e28c9C4c17aFdd36"
      values.$pastUpgrades.0.2.0:
-        "0x0e76997707dd87D80d39597e3D2253453A3A02Fc"
+        "eth:0x0e76997707dd87D80d39597e3D2253453A3A02Fc"
      values.$pastUpgrades.1.2.0:
-        "0x74110Fb401469FEA31A10680e28c9C4c17aFdd36"
+        "eth:0x74110Fb401469FEA31A10680e28c9C4c17aFdd36"
      values.bridge:
-        "0x19df42E085e2c3fC4497172E412057F54D9f013E"
+        "eth:0x19df42E085e2c3fC4497172E412057F54D9f013E"
      values.getProxyAdmin:
-        "0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      values.sequencerInbox:
-        "0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
+        "eth:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
      implementationNames.0x010aDE5d8F9DC340531140802438798C189c36E0:
-        "TransparentUpgradeableProxy"
      implementationNames.0x74110Fb401469FEA31A10680e28c9C4c17aFdd36:
-        "Inbox"
      implementationNames.eth:0x010aDE5d8F9DC340531140802438798C189c36E0:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x74110Fb401469FEA31A10680e28c9C4c17aFdd36:
+        "Inbox"
    }
```

```diff
    EOA  (0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A) {
    +++ description: None
      address:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "eth:0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
    }
```

```diff
    EOA  (0x15D5fF2dEc328a1cF3D64413caaBdcE29bff050A) {
    +++ description: None
      address:
-        "0x15D5fF2dEc328a1cF3D64413caaBdcE29bff050A"
+        "eth:0x15D5fF2dEc328a1cF3D64413caaBdcE29bff050A"
    }
```

```diff
    contract Outbox (0x190C720892d0786BF75B77B4acD21c726ea8FDEd) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
+        "eth:0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
      values.$admin:
-        "0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      values.$implementation:
-        "0xf2078f19A9322E2e0Dfd02839C7D74215F2E7512"
+        "eth:0xf2078f19A9322E2e0Dfd02839C7D74215F2E7512"
      values.$pastUpgrades.0.2.0:
-        "0xf2078f19A9322E2e0Dfd02839C7D74215F2E7512"
+        "eth:0xf2078f19A9322E2e0Dfd02839C7D74215F2E7512"
      values.bridge:
-        "0x19df42E085e2c3fC4497172E412057F54D9f013E"
+        "eth:0x19df42E085e2c3fC4497172E412057F54D9f013E"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x28293c7855797B0441000EF144119727f3cBCA9B"
+        "eth:0x28293c7855797B0441000EF144119727f3cBCA9B"
      implementationNames.0x190C720892d0786BF75B77B4acD21c726ea8FDEd:
-        "TransparentUpgradeableProxy"
      implementationNames.0xf2078f19A9322E2e0Dfd02839C7D74215F2E7512:
-        "Outbox"
      implementationNames.eth:0x190C720892d0786BF75B77B4acD21c726ea8FDEd:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xf2078f19A9322E2e0Dfd02839C7D74215F2E7512:
+        "Outbox"
    }
```

```diff
    contract Bridge (0x19df42E085e2c3fC4497172E412057F54D9f013E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x19df42E085e2c3fC4497172E412057F54D9f013E"
+        "eth:0x19df42E085e2c3fC4497172E412057F54D9f013E"
      values.$admin:
-        "0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      values.$implementation:
-        "0x480214c3B0707a1e083A3Ae97209FCb671471109"
+        "eth:0x480214c3B0707a1e083A3Ae97209FCb671471109"
      values.$pastUpgrades.0.2.0:
-        "0x480214c3B0707a1e083A3Ae97209FCb671471109"
+        "eth:0x480214c3B0707a1e083A3Ae97209FCb671471109"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x010aDE5d8F9DC340531140802438798C189c36E0"
+        "eth:0x010aDE5d8F9DC340531140802438798C189c36E0"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
+        "eth:0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
+        "eth:0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x010aDE5d8F9DC340531140802438798C189c36E0"
+        "eth:0x010aDE5d8F9DC340531140802438798C189c36E0"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
+        "eth:0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
+        "eth:0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
      values.rollup:
-        "0x28293c7855797B0441000EF144119727f3cBCA9B"
+        "eth:0x28293c7855797B0441000EF144119727f3cBCA9B"
      values.sequencerInbox:
-        "0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
+        "eth:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
      implementationNames.0x19df42E085e2c3fC4497172E412057F54D9f013E:
-        "TransparentUpgradeableProxy"
      implementationNames.0x480214c3B0707a1e083A3Ae97209FCb671471109:
-        "Bridge"
      implementationNames.eth:0x19df42E085e2c3fC4497172E412057F54D9f013E:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x480214c3B0707a1e083A3Ae97209FCb671471109:
+        "Bridge"
    }
```

```diff
    contract RollupEventInbox (0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
+        "eth:0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
      values.$admin:
-        "0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      values.$implementation:
-        "0x1c48b5526071EB2c89ccA3F8afC061b12944eED5"
+        "eth:0x1c48b5526071EB2c89ccA3F8afC061b12944eED5"
      values.$pastUpgrades.0.2.0:
-        "0x1c48b5526071EB2c89ccA3F8afC061b12944eED5"
+        "eth:0x1c48b5526071EB2c89ccA3F8afC061b12944eED5"
      values.bridge:
-        "0x19df42E085e2c3fC4497172E412057F54D9f013E"
+        "eth:0x19df42E085e2c3fC4497172E412057F54D9f013E"
      values.rollup:
-        "0x28293c7855797B0441000EF144119727f3cBCA9B"
+        "eth:0x28293c7855797B0441000EF144119727f3cBCA9B"
      implementationNames.0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1c48b5526071EB2c89ccA3F8afC061b12944eED5:
-        "RollupEventInbox"
      implementationNames.eth:0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x1c48b5526071EB2c89ccA3F8afC061b12944eED5:
+        "RollupEventInbox"
    }
```

```diff
    contract RollupProxy (0x28293c7855797B0441000EF144119727f3cBCA9B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x28293c7855797B0441000EF144119727f3cBCA9B"
+        "eth:0x28293c7855797B0441000EF144119727f3cBCA9B"
      values.$admin:
-        "0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      values.$implementation.0:
-        "0xD6DC5196b9E1c3fcA62CCDA876ebFFb3eDA384Ea"
+        "eth:0xD6DC5196b9E1c3fcA62CCDA876ebFFb3eDA384Ea"
      values.$implementation.1:
-        "0xa8Ae2ed62A978e2108a1C7CBfdb43a5CBfdd2aD0"
+        "eth:0xa8Ae2ed62A978e2108a1C7CBfdb43a5CBfdd2aD0"
      values.$pastUpgrades.0.2.0:
-        "0xD6DC5196b9E1c3fcA62CCDA876ebFFb3eDA384Ea"
+        "eth:0xD6DC5196b9E1c3fcA62CCDA876ebFFb3eDA384Ea"
      values.$pastUpgrades.0.2.1:
-        "0xa8Ae2ed62A978e2108a1C7CBfdb43a5CBfdd2aD0"
+        "eth:0xa8Ae2ed62A978e2108a1C7CBfdb43a5CBfdd2aD0"
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.bridge:
-        "0x19df42E085e2c3fC4497172E412057F54D9f013E"
+        "eth:0x19df42E085e2c3fC4497172E412057F54D9f013E"
      values.challengeManager:
-        "0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C"
+        "eth:0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C"
      values.inbox:
-        "0x010aDE5d8F9DC340531140802438798C189c36E0"
+        "eth:0x010aDE5d8F9DC340531140802438798C189c36E0"
      values.loserStakeEscrow:
-        "0x4fb280195D13e352CE8a9b9b0B41f3e3756066A4"
+        "eth:0x4fb280195D13e352CE8a9b9b0B41f3e3756066A4"
      values.outbox:
-        "0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
+        "eth:0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
      values.owner:
-        "0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      values.rollupEventInbox:
-        "0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
+        "eth:0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
      values.sequencerInbox:
-        "0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
+        "eth:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0xef6Ef32bcC96B9D94f50A51A42dB4825D6337780"
+        "eth:0xef6Ef32bcC96B9D94f50A51A42dB4825D6337780"
      values.validatorUtils:
-        "0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1"
+        "eth:0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1"
      values.validatorWalletCreator:
-        "0x6FB4500c12E1303aD174085FDEce0a097f578ED7"
+        "eth:0x6FB4500c12E1303aD174085FDEce0a097f578ED7"
      implementationNames.0x28293c7855797B0441000EF144119727f3cBCA9B:
-        "RollupProxy"
      implementationNames.0xD6DC5196b9E1c3fcA62CCDA876ebFFb3eDA384Ea:
-        "RollupAdminLogic"
      implementationNames.0xa8Ae2ed62A978e2108a1C7CBfdb43a5CBfdd2aD0:
-        "RollupUserLogic"
      implementationNames.eth:0x28293c7855797B0441000EF144119727f3cBCA9B:
+        "RollupProxy"
      implementationNames.eth:0xD6DC5196b9E1c3fcA62CCDA876ebFFb3eDA384Ea:
+        "RollupAdminLogic"
      implementationNames.eth:0xa8Ae2ed62A978e2108a1C7CBfdb43a5CBfdd2aD0:
+        "RollupUserLogic"
    }
```

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      address:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
+        "eth:0x2bf43034b9559643e986A2fE3cE015a18247b904"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "eth:0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.$members.1:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "eth:0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.2:
-        "0xbf853295743511e8DC5F03809d209C33fC136d24"
+        "eth:0xbf853295743511e8DC5F03809d209C33fC136d24"
      values.$members.3:
-        "0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
+        "eth:0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
      values.$members.4:
-        "0xb004d94314a34627C09E4b8f83D9E7420d99BbFC"
+        "eth:0xb004d94314a34627C09E4b8f83D9E7420d99BbFC"
      values.$members.5:
-        "0x15D5fF2dEc328a1cF3D64413caaBdcE29bff050A"
+        "eth:0x15D5fF2dEc328a1cF3D64413caaBdcE29bff050A"
      implementationNames.0x2bf43034b9559643e986A2fE3cE015a18247b904:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x2bf43034b9559643e986A2fE3cE015a18247b904:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA Caldera (0x356000Cec4fC967f8FC372381D983426760A0391) {
    +++ description: None
      address:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "eth:0x356000Cec4fC967f8FC372381D983426760A0391"
    }
```

```diff
    EOA  (0x4fb280195D13e352CE8a9b9b0B41f3e3756066A4) {
    +++ description: None
      address:
-        "0x4fb280195D13e352CE8a9b9b0B41f3e3756066A4"
+        "eth:0x4fb280195D13e352CE8a9b9b0B41f3e3756066A4"
    }
```

```diff
    contract OneStepProofEntry (0x5F8FE936F629AF71e7af6C7844692f98019d6163) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x5F8FE936F629AF71e7af6C7844692f98019d6163"
+        "eth:0x5F8FE936F629AF71e7af6C7844692f98019d6163"
      values.prover0:
-        "0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69"
+        "eth:0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69"
      values.proverHostIo:
-        "0xd79fd59b73c814D9607aB93C4A1aDCea06F91692"
+        "eth:0xd79fd59b73c814D9607aB93C4A1aDCea06F91692"
      values.proverMath:
-        "0xFe53F58bAd7B83B01C47CC86471507911263ac91"
+        "eth:0xFe53F58bAd7B83B01C47CC86471507911263ac91"
      values.proverMem:
-        "0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f"
+        "eth:0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f"
      implementationNames.0x5F8FE936F629AF71e7af6C7844692f98019d6163:
-        "OneStepProofEntry"
      implementationNames.eth:0x5F8FE936F629AF71e7af6C7844692f98019d6163:
+        "OneStepProofEntry"
    }
```

```diff
    contract EspressoTEEVerifier (0x64189bd57B1b281C9EC3f5295B75797ddcB1572c) {
    +++ description: The Espresso TEE verifier is used by the SequencerInbox contract to verify the batch attestations signed by the TEE.
      address:
-        "0x64189bd57B1b281C9EC3f5295B75797ddcB1572c"
+        "eth:0x64189bd57B1b281C9EC3f5295B75797ddcB1572c"
      values.owner:
-        "0xDA8E38FEf4d5cF1997061e51945775a393E4965B"
+        "eth:0xDA8E38FEf4d5cF1997061e51945775a393E4965B"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.quoteVerifier:
-        "0x816ADa3B63F3c643fb04152eA32B58Db89aadd89"
+        "eth:0x816ADa3B63F3c643fb04152eA32B58Db89aadd89"
      implementationNames.0x64189bd57B1b281C9EC3f5295B75797ddcB1572c:
-        "EspressoTEEVerifier"
      implementationNames.eth:0x64189bd57B1b281C9EC3f5295B75797ddcB1572c:
+        "EspressoTEEVerifier"
    }
```

```diff
    contract UpgradeExecutor (0x7c4e8195FB560D1557C52f051dCdA4724a2894b3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      values.$admin:
-        "0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      values.$implementation:
-        "0x31c97a0A216CCd730bd8ab3ecAA97eACbA27b11a"
+        "eth:0x31c97a0A216CCd730bd8ab3ecAA97eACbA27b11a"
      values.$pastUpgrades.0.2.0:
-        "0x31c97a0A216CCd730bd8ab3ecAA97eACbA27b11a"
+        "eth:0x31c97a0A216CCd730bd8ab3ecAA97eACbA27b11a"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
+        "eth:0x2bf43034b9559643e986A2fE3cE015a18247b904"
      values.executors.0:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
+        "eth:0x2bf43034b9559643e986A2fE3cE015a18247b904"
      implementationNames.0x7c4e8195FB560D1557C52f051dCdA4724a2894b3:
-        "TransparentUpgradeableProxy"
      implementationNames.0x31c97a0A216CCd730bd8ab3ecAA97eACbA27b11a:
-        "UpgradeExecutor"
      implementationNames.eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x31c97a0A216CCd730bd8ab3ecAA97eACbA27b11a:
+        "UpgradeExecutor"
    }
```

```diff
    contract SequencerInbox (0x8045B2aa6b823CbA8f99ef3D3404F711619d3473) {
    +++ description: The Espresso TEE sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
+        "eth:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
      values.$admin:
-        "0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      values.$implementation:
-        "0x2948690217F3C2fDD6166343da8A7Ac2B7f5c134"
+        "eth:0x2948690217F3C2fDD6166343da8A7Ac2B7f5c134"
      values.$pastUpgrades.0.2.0:
-        "0xA9e877a129d0b77d11876184fe6eE38A7CeAffc8"
+        "eth:0xA9e877a129d0b77d11876184fe6eE38A7CeAffc8"
      values.$pastUpgrades.1.2.0:
-        "0x5EE6B586F1F8651dFd5432DEcd6D4dF1EbAdD203"
+        "eth:0x5EE6B586F1F8651dFd5432DEcd6D4dF1EbAdD203"
      values.$pastUpgrades.2.2.0:
-        "0x2948690217F3C2fDD6166343da8A7Ac2B7f5c134"
+        "eth:0x2948690217F3C2fDD6166343da8A7Ac2B7f5c134"
      values.batchPosterManager:
-        "0xC5dD640885cE582464e2fCa7b169581417822e6C"
+        "eth:0xC5dD640885cE582464e2fCa7b169581417822e6C"
      values.batchPosters.0:
-        "0xC5dD640885cE582464e2fCa7b169581417822e6C"
+        "eth:0xC5dD640885cE582464e2fCa7b169581417822e6C"
      values.bridge:
-        "0x19df42E085e2c3fC4497172E412057F54D9f013E"
+        "eth:0x19df42E085e2c3fC4497172E412057F54D9f013E"
      values.espressoTEEVerifier:
-        "0x64189bd57B1b281C9EC3f5295B75797ddcB1572c"
+        "eth:0x64189bd57B1b281C9EC3f5295B75797ddcB1572c"
      values.reader4844:
-        "0x988d097EcB1d416ff9b0f2E4D8cEC4661F9E1871"
+        "eth:0x988d097EcB1d416ff9b0f2E4D8cEC4661F9E1871"
      values.rollup:
-        "0x28293c7855797B0441000EF144119727f3cBCA9B"
+        "eth:0x28293c7855797B0441000EF144119727f3cBCA9B"
      implementationNames.0x8045B2aa6b823CbA8f99ef3D3404F711619d3473:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2948690217F3C2fDD6166343da8A7Ac2B7f5c134:
-        "SequencerInbox"
      implementationNames.eth:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x2948690217F3C2fDD6166343da8A7Ac2B7f5c134:
+        "SequencerInbox"
    }
```

```diff
    contract QuoteVerifier (0x816ADa3B63F3c643fb04152eA32B58Db89aadd89) {
    +++ description: The QuoteVerifier contract is used by the EspressoTEEVerifier to verify the validity of the TEE quote. It references a PCCSRouter (eth:0xe20C4d54afBbea5123728d5b7dAcD9CB3c65C39a), an access point for Intel SGX 'collateral', crucial references of which some modular contracts are unverified.
      address:
-        "0x816ADa3B63F3c643fb04152eA32B58Db89aadd89"
+        "eth:0x816ADa3B63F3c643fb04152eA32B58Db89aadd89"
      description:
-        "The QuoteVerifier contract is used by the EspressoTEEVerifier to verify the validity of the TEE quote. It references a PCCSRouter (0xe20C4d54afBbea5123728d5b7dAcD9CB3c65C39a), an access point for Intel SGX 'collateral', crucial references of which some modular contracts are unverified."
+        "The QuoteVerifier contract is used by the EspressoTEEVerifier to verify the validity of the TEE quote. It references a PCCSRouter (eth:0xe20C4d54afBbea5123728d5b7dAcD9CB3c65C39a), an access point for Intel SGX 'collateral', crucial references of which some modular contracts are unverified."
      values.P256_VERIFIER:
-        "0xc2b78104907F722DABAc4C69f826a522B2754De4"
+        "eth:0xc2b78104907F722DABAc4C69f826a522B2754De4"
      values.pccsRouter:
-        "0xe20C4d54afBbea5123728d5b7dAcD9CB3c65C39a"
+        "eth:0xe20C4d54afBbea5123728d5b7dAcD9CB3c65C39a"
      implementationNames.0x816ADa3B63F3c643fb04152eA32B58Db89aadd89:
-        "V3QuoteVerifier"
      implementationNames.eth:0x816ADa3B63F3c643fb04152eA32B58Db89aadd89:
+        "V3QuoteVerifier"
    }
```

```diff
    contract ValidatorUtils (0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1"
+        "eth:0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1"
      implementationNames.0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1:
-        "ValidatorUtils"
      implementationNames.eth:0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1:
+        "ValidatorUtils"
    }
```

```diff
    EOA  (0xb004d94314a34627C09E4b8f83D9E7420d99BbFC) {
    +++ description: None
      address:
-        "0xb004d94314a34627C09E4b8f83D9E7420d99BbFC"
+        "eth:0xb004d94314a34627C09E4b8f83D9E7420d99BbFC"
    }
```

```diff
    contract ChallengeManager (0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C"
+        "eth:0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C"
      values.$admin:
-        "0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      values.$implementation:
-        "0xE97d5ae76694836D2e016D80469B45D7aFb2ebaB"
+        "eth:0xE97d5ae76694836D2e016D80469B45D7aFb2ebaB"
      values.$pastUpgrades.0.2.0:
-        "0xE97d5ae76694836D2e016D80469B45D7aFb2ebaB"
+        "eth:0xE97d5ae76694836D2e016D80469B45D7aFb2ebaB"
      values.bridge:
-        "0x19df42E085e2c3fC4497172E412057F54D9f013E"
+        "eth:0x19df42E085e2c3fC4497172E412057F54D9f013E"
      values.osp:
-        "0x5F8FE936F629AF71e7af6C7844692f98019d6163"
+        "eth:0x5F8FE936F629AF71e7af6C7844692f98019d6163"
      values.resultReceiver:
-        "0x28293c7855797B0441000EF144119727f3cBCA9B"
+        "eth:0x28293c7855797B0441000EF144119727f3cBCA9B"
      values.sequencerInbox:
-        "0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
+        "eth:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
      implementationNames.0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C:
-        "TransparentUpgradeableProxy"
      implementationNames.0xE97d5ae76694836D2e016D80469B45D7aFb2ebaB:
-        "ChallengeManager"
      implementationNames.eth:0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xE97d5ae76694836D2e016D80469B45D7aFb2ebaB:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0xbf853295743511e8DC5F03809d209C33fC136d24) {
    +++ description: None
      address:
-        "0xbf853295743511e8DC5F03809d209C33fC136d24"
+        "eth:0xbf853295743511e8DC5F03809d209C33fC136d24"
    }
```

```diff
    EOA  (0xC5dD640885cE582464e2fCa7b169581417822e6C) {
    +++ description: None
      address:
-        "0xC5dD640885cE582464e2fCa7b169581417822e6C"
+        "eth:0xC5dD640885cE582464e2fCa7b169581417822e6C"
    }
```

```diff
    EOA  (0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9) {
    +++ description: None
      address:
-        "0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
+        "eth:0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
    }
```

```diff
    contract OneStepProverHostIo (0xd79fd59b73c814D9607aB93C4A1aDCea06F91692) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xd79fd59b73c814D9607aB93C4A1aDCea06F91692"
+        "eth:0xd79fd59b73c814D9607aB93C4A1aDCea06F91692"
      implementationNames.0xd79fd59b73c814D9607aB93C4A1aDCea06F91692:
-        "OneStepProverHostIo"
      implementationNames.eth:0xd79fd59b73c814D9607aB93C4A1aDCea06F91692:
+        "OneStepProverHostIo"
    }
```

```diff
    EOA  (0xDA8E38FEf4d5cF1997061e51945775a393E4965B) {
    +++ description: None
      address:
-        "0xDA8E38FEf4d5cF1997061e51945775a393E4965B"
+        "eth:0xDA8E38FEf4d5cF1997061e51945775a393E4965B"
    }
```

```diff
    EOA  (0xef6Ef32bcC96B9D94f50A51A42dB4825D6337780) {
    +++ description: None
      address:
-        "0xef6Ef32bcC96B9D94f50A51A42dB4825D6337780"
+        "eth:0xef6Ef32bcC96B9D94f50A51A42dB4825D6337780"
    }
```

```diff
    contract ProxyAdmin (0xF025D25aE360D0D33a275dF74863CCc6600E6f8E) {
    +++ description: None
      address:
-        "0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      values.owner:
-        "0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      implementationNames.0xF025D25aE360D0D33a275dF74863CCc6600E6f8E:
-        "ProxyAdmin"
      implementationNames.eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E:
+        "ProxyAdmin"
    }
```

```diff
    contract OneStepProverMemory (0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f"
+        "eth:0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f"
      implementationNames.0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f:
-        "OneStepProverMemory"
      implementationNames.eth:0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f:
+        "OneStepProverMemory"
    }
```

```diff
    contract OneStepProverMath (0xFe53F58bAd7B83B01C47CC86471507911263ac91) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xFe53F58bAd7B83B01C47CC86471507911263ac91"
+        "eth:0xFe53F58bAd7B83B01C47CC86471507911263ac91"
      implementationNames.0xFe53F58bAd7B83B01C47CC86471507911263ac91:
-        "OneStepProverMath"
      implementationNames.eth:0xFe53F58bAd7B83B01C47CC86471507911263ac91:
+        "OneStepProverMath"
    }
```

```diff
    contract OneStepProver0 (0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69"
+        "eth:0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69"
      implementationNames.0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69:
-        "OneStepProver0"
      implementationNames.eth:0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69:
+        "OneStepProver0"
    }
```

```diff
+   Status: CREATED
    contract Inbox (0x010aDE5d8F9DC340531140802438798C189c36E0)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Outbox (0x190C720892d0786BF75B77B4acD21c726ea8FDEd)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract Bridge (0x19df42E085e2c3fC4497172E412057F54D9f013E)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x28293c7855797B0441000EF144119727f3cBCA9B)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x5F8FE936F629AF71e7af6C7844692f98019d6163)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EspressoTEEVerifier (0x64189bd57B1b281C9EC3f5295B75797ddcB1572c)
    +++ description: The Espresso TEE verifier is used by the SequencerInbox contract to verify the batch attestations signed by the TEE.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x7c4e8195FB560D1557C52f051dCdA4724a2894b3)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x8045B2aa6b823CbA8f99ef3D3404F711619d3473)
    +++ description: The Espresso TEE sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract QuoteVerifier (0x816ADa3B63F3c643fb04152eA32B58Db89aadd89)
    +++ description: The QuoteVerifier contract is used by the EspressoTEEVerifier to verify the validity of the TEE quote. It references a PCCSRouter (eth:0xe20C4d54afBbea5123728d5b7dAcD9CB3c65C39a), an access point for Intel SGX 'collateral', crucial references of which some modular contracts are unverified.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xd79fd59b73c814D9607aB93C4A1aDCea06F91692)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF025D25aE360D0D33a275dF74863CCc6600E6f8E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xFe53F58bAd7B83B01C47CC86471507911263ac91)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

Generated with discovered.json: 0x8f2cf33e064c742833cba4879927aa04745b0a6f

# Diff at Fri, 04 Jul 2025 12:18:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22779991
- current block number: 22779991

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22779991 (main branch discovery), not current.

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      receivedPermissions.0.from:
-        "ethereum:0x28293c7855797B0441000EF144119727f3cBCA9B"
+        "eth:0x28293c7855797B0441000EF144119727f3cBCA9B"
      receivedPermissions.1.via.1.address:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      receivedPermissions.1.from:
-        "ethereum:0x010aDE5d8F9DC340531140802438798C189c36E0"
+        "eth:0x010aDE5d8F9DC340531140802438798C189c36E0"
      receivedPermissions.2.via.1.address:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      receivedPermissions.2.from:
-        "ethereum:0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
+        "eth:0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
      receivedPermissions.3.via.1.address:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      receivedPermissions.3.from:
-        "ethereum:0x19df42E085e2c3fC4497172E412057F54D9f013E"
+        "eth:0x19df42E085e2c3fC4497172E412057F54D9f013E"
      receivedPermissions.4.via.1.address:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      receivedPermissions.4.from:
-        "ethereum:0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
+        "eth:0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      receivedPermissions.5.from:
-        "ethereum:0x28293c7855797B0441000EF144119727f3cBCA9B"
+        "eth:0x28293c7855797B0441000EF144119727f3cBCA9B"
      receivedPermissions.6.via.1.address:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      receivedPermissions.6.from:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      receivedPermissions.7.via.1.address:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      receivedPermissions.7.from:
-        "ethereum:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
+        "eth:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
      receivedPermissions.8.via.1.address:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      receivedPermissions.8.from:
-        "ethereum:0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C"
+        "eth:0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
    }
```

```diff
    contract UpgradeExecutor (0x7c4e8195FB560D1557C52f051dCdA4724a2894b3) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "ethereum:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
+        "eth:0xF025D25aE360D0D33a275dF74863CCc6600E6f8E"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x28293c7855797B0441000EF144119727f3cBCA9B"
+        "eth:0x28293c7855797B0441000EF144119727f3cBCA9B"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x28293c7855797B0441000EF144119727f3cBCA9B"
+        "eth:0x28293c7855797B0441000EF144119727f3cBCA9B"
    }
```

```diff
    EOA  (0xC5dD640885cE582464e2fCa7b169581417822e6C) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
+        "eth:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
      receivedPermissions.1.from:
-        "ethereum:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
+        "eth:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
    }
```

```diff
    EOA  (0xef6Ef32bcC96B9D94f50A51A42dB4825D6337780) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x28293c7855797B0441000EF144119727f3cBCA9B"
+        "eth:0x28293c7855797B0441000EF144119727f3cBCA9B"
    }
```

```diff
    contract ProxyAdmin (0xF025D25aE360D0D33a275dF74863CCc6600E6f8E) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x010aDE5d8F9DC340531140802438798C189c36E0"
+        "eth:0x010aDE5d8F9DC340531140802438798C189c36E0"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
+        "eth:0x190C720892d0786BF75B77B4acD21c726ea8FDEd"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x19df42E085e2c3fC4497172E412057F54D9f013E"
+        "eth:0x19df42E085e2c3fC4497172E412057F54D9f013E"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
+        "eth:0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
+        "eth:0x7c4e8195FB560D1557C52f051dCdA4724a2894b3"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
+        "eth:0x8045B2aa6b823CbA8f99ef3D3404F711619d3473"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C"
+        "eth:0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C"
    }
```

Generated with discovered.json: 0x6b05dfaf4d603392a19d51bf0c0f68ddfc6c6df5

# Diff at Wed, 25 Jun 2025 07:34:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22665848
- current block number: 22779991

## Description

mrenclave changes: hash of enclave's code and initial data.

## Watched changes

```diff
    contract EspressoTEEVerifier (0x64189bd57B1b281C9EC3f5295B75797ddcB1572c) {
    +++ description: The Espresso TEE verifier is used by the SequencerInbox contract to verify the batch attestations signed by the TEE.
+++ description: Identifier of the TEE code used (hash of enclave's code and initial data).
      values.mrEnclaves.2:
+        "0x1e4d5d3272ba669d22fe4d06d004df616172fb6425946dcf7dc39a031f91018f"
    }
```

Generated with discovered.json: 0xaee4bf132045c9c55658511cf483a8464e088fa2

# Diff at Wed, 18 Jun 2025 12:22:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22665848
- current block number: 22665848

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22665848 (main branch discovery), not current.

```diff
    contract RollupProxy (0x28293c7855797B0441000EF144119727f3cBCA9B) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x735cbcc29e932a0a4fade8af5a5e90c2b0eafa78

# Diff at Mon, 09 Jun 2025 08:58:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7cc006dadcc55e6cce3be3eb03d491835943fb43 block: 22623572
- current block number: 22665848

## Description

New MrEnclave (code /init data on the TEE changed).

## Watched changes

```diff
    contract EspressoTEEVerifier (0x64189bd57B1b281C9EC3f5295B75797ddcB1572c) {
    +++ description: The Espresso TEE verifier is used by the SequencerInbox contract to verify the batch attestations signed by the TEE.
+++ description: Identifier of the TEE code used (hash of enclave's code and initial data).
      values.mrEnclaves.1:
+        "0x7479bcebe47fb96bc3246fc30363eb438316736c49225b77667e6bdb961c0177"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22623572 (main branch discovery), not current.

```diff
    contract EspressoTEEVerifier (0x64189bd57B1b281C9EC3f5295B75797ddcB1572c) {
    +++ description: The Espresso TEE verifier is used by the SequencerInbox contract to verify the batch attestations signed by the TEE.
      fieldMeta:
+        {"mrEnclaves":{"description":"Identifier of the TEE code used (hash of enclave's code and initial data)."},"mrSigners":{"description":"Hash of the signer's public key (who signed the code running on the TEE)."}}
    }
```

Generated with discovered.json: 0x472d524045dc782d30bd1e31419a1954850c0c72

# Diff at Tue, 03 Jun 2025 11:45:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22623572

## Description

intial discovery of an orbit stack chain with espresso sequencing and anytrust DA.

## Initial discovery

```diff
+   Status: CREATED
    contract Inbox (0x010aDE5d8F9DC340531140802438798C189c36E0)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Outbox (0x190C720892d0786BF75B77B4acD21c726ea8FDEd)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract Bridge (0x19df42E085e2c3fC4497172E412057F54D9f013E)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x269F6f6FC8177a5A8c475AE0e2487508634EC8Ed)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x28293c7855797B0441000EF144119727f3cBCA9B)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x5F8FE936F629AF71e7af6C7844692f98019d6163)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EspressoTEEVerifier (0x64189bd57B1b281C9EC3f5295B75797ddcB1572c)
    +++ description: The Espresso TEE verifier is used by the SequencerInbox contract to verify the batch attestations signed by the TEE.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x7c4e8195FB560D1557C52f051dCdA4724a2894b3)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x8045B2aa6b823CbA8f99ef3D3404F711619d3473)
    +++ description: The Espresso TEE sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract QuoteVerifier (0x816ADa3B63F3c643fb04152eA32B58Db89aadd89)
    +++ description: The QuoteVerifier contract is used by the EspressoTEEVerifier to verify the validity of the TEE quote. It references a PCCSRouter (0xe20C4d54afBbea5123728d5b7dAcD9CB3c65C39a), an access point for Intel SGX 'collateral', crucial references of which some modular contracts are unverified.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0xA79305c7D5Ad6F8AF0292c863957a2488F13f0d1)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xB9B007aE55B81dd1498Bc500a54ad9Ae53234c9C)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xd79fd59b73c814D9607aB93C4A1aDCea06F91692)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF025D25aE360D0D33a275dF74863CCc6600E6f8E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf6a307A5868eB9c4a00F5efbD1EF8462AC63783f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xFe53F58bAd7B83B01C47CC86471507911263ac91)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xFe95b1f7cf7D7D14E9e38dEE0EFE1c9D3AaA3e69)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
