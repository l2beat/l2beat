Generated with discovered.json: 0x937e404ba297fbfb94889f05b61e540e22850fd3

# Diff at Tue, 07 Oct 2025 09:46:20 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@5e88ba37ad7744f9d7831779a58849b5d00ec673 block: 1759389007
- current timestamp: 1759830313

## Description

Two members removed from multisig.

## Watched changes

```diff
    contract Caldera Multisig 3 (eth:0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      values.$members.5:
-        "eth:0x2F2d46D3dD36c8d1ae2Cb81c0cD2c05C68DBA675"
      values.$members.7:
-        "eth:0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.multisigThreshold:
-        "4 of 9 (44%)"
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0xdd2f21e07062df7ed55d00075d37eca35aab1c12

# Diff at Thu, 02 Oct 2025 07:11:23 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@b1cfb9bd1821e27488215e4364f565cfd7d54c2e block: 1759250628
- current timestamp: 1759389007

## Description

Caldera multisig members decrease.

## Watched changes

```diff
    contract Caldera Multisig 3 (eth:0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      values.$members.9:
-        "eth:0xbf853295743511e8DC5F03809d209C33fC136d24"
      values.$members.10:
-        "eth:0x15D5fF2dEc328a1cF3D64413caaBdcE29bff050A"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x242513a505a4a430e41860f95796631db9a7cd75

# Diff at Tue, 30 Sep 2025 16:44:53 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c66a02d28b2467edd595f8a8468988549dd6d3cf block: 1758875907
- current timestamp: 1759250628

## Description

Caldera multisig threshold increase.

## Watched changes

```diff
    contract Caldera Multisig 3 (eth:0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      values.$members.0:
+        "eth:0x62ea938a30826c8794C8B8BbA775B91cAE3B849A"
      values.$members.1:
+        "eth:0xe5219fe14E2FD520Ff80be036790913053d1575d"
      values.$members.2:
+        "eth:0xEC114946E7213d113c9B9481028271B5E9e09371"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x26431edf943e946a1fc5a659b0fa7e2fb974528f

# Diff at Fri, 26 Sep 2025 13:01:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1758875907
- current timestamp: 1758875907

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1758875907 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x9134609b749a8be55e36e9ad30a58a6c2f0d9979

# Diff at Fri, 26 Sep 2025 08:39:33 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@331e0b266e6f6c50461cccad15ef48f094014214 block: 1755010019
- current timestamp: 1758875907

## Description

Caldera multisig threshold change.

## Watched changes

```diff
    contract Caldera Multisig 3 (eth:0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      values.$members.0:
+        "eth:0x9e14B1baFCEB80B67934aBE4fB00a7291aCfBcD0"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x53df136351044c7d33b99b4de45d93d6ea3aec62

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xefc9c5c52d0ede30c81e1ccc8d398f6db96ab80d

# Diff at Mon, 11 Aug 2025 11:13:48 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1753200503
- current timestamp: 1754910804

## Description

Caldera MS: 2 members removed.

## Watched changes

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      values.$members.6:
-        "eth:0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
      values.$members.7:
-        "eth:0xb004d94314a34627C09E4b8f83D9E7420d99BbFC"
      values.multisigThreshold:
-        "4 of 9 (44%)"
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x72818f60d65817f8bfdb46b6c8c32839cc605be2

# Diff at Tue, 22 Jul 2025 16:09:00 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 22231616
- current block number: 22975810

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

Generated with discovered.json: 0x7686f61ff15806424f5383b1eab00db1e14e78ac

# Diff at Mon, 14 Jul 2025 12:45:30 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22231616
- current block number: 22231616

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22231616 (main branch discovery), not current.

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
    contract OneStepProverMath (0x171c845f3229D6625bcdBcfB39BF53Fe15D2E4de) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x171c845f3229D6625bcdBcfB39BF53Fe15D2E4de"
+        "eth:0x171c845f3229D6625bcdBcfB39BF53Fe15D2E4de"
      implementationNames.0x171c845f3229D6625bcdBcfB39BF53Fe15D2E4de:
-        "OneStepProverMath"
      implementationNames.eth:0x171c845f3229D6625bcdBcfB39BF53Fe15D2E4de:
+        "OneStepProverMath"
    }
```

```diff
    contract OneStepProverHostIo (0x1E0fAE2d6Ca225903B81b742813E98CDBaD20037) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x1E0fAE2d6Ca225903B81b742813E98CDBaD20037"
+        "eth:0x1E0fAE2d6Ca225903B81b742813E98CDBaD20037"
      implementationNames.0x1E0fAE2d6Ca225903B81b742813E98CDBaD20037:
-        "OneStepProverHostIo"
      implementationNames.eth:0x1E0fAE2d6Ca225903B81b742813E98CDBaD20037:
+        "OneStepProverHostIo"
    }
```

```diff
    EOA  (0x23b6bFACe63BFa288783b8344574c75b78FaEd59) {
    +++ description: None
      address:
-        "0x23b6bFACe63BFa288783b8344574c75b78FaEd59"
+        "eth:0x23b6bFACe63BFa288783b8344574c75b78FaEd59"
    }
```

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "eth:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      values.$admin:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      values.$implementation:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "eth:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
      values.$pastUpgrades.0.2.0:
-        "0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
+        "eth:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
+        "eth:0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
+        "eth:0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0xe4F99a0734C87C298d73C161F54874225E416997"
+        "eth:0xe4F99a0734C87C298d73C161F54874225E416997"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
+        "eth:0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
+        "eth:0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0xe4F99a0734C87C298d73C161F54874225E416997"
+        "eth:0xe4F99a0734C87C298d73C161F54874225E416997"
      values.rollup:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      values.sequencerInbox:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
+        "eth:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      implementationNames.0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F:
-        "Bridge"
      implementationNames.eth:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F:
+        "Bridge"
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      implementationNames.0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF:
-        "ValidatorUtils"
      implementationNames.eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF:
+        "ValidatorUtils"
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
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
+        "eth:0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      values.$admin:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      values.$implementation:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.$pastUpgrades.0.2.0:
-        "0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
+        "eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"
      values.bridge:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "eth:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      values.rollup:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      implementationNames.0x3401eafd7Ceb84265B2cC4252155e12B446E7c57:
-        "TransparentUpgradeableProxy"
      implementationNames.0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
-        "RollupEventInbox"
      implementationNames.eth:0x3401eafd7Ceb84265B2cC4252155e12B446E7c57:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494:
+        "RollupEventInbox"
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
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      values.$admin:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      values.$implementation.0:
-        "0x107CbCe233467652E8a69E8555E58DA7AeF0bFa5"
+        "eth:0x107CbCe233467652E8a69E8555E58DA7AeF0bFa5"
      values.$implementation.1:
-        "0x4fd44C320f28e9cdB7CF0f5490434494Fbd4c7B4"
+        "eth:0x4fd44C320f28e9cdB7CF0f5490434494Fbd4c7B4"
      values.$pastUpgrades.0.2.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "eth:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
      values.$pastUpgrades.0.2.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "eth:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.$pastUpgrades.1.2.0:
-        "0x107CbCe233467652E8a69E8555E58DA7AeF0bFa5"
+        "eth:0x107CbCe233467652E8a69E8555E58DA7AeF0bFa5"
      values.$pastUpgrades.1.2.1:
-        "0x4fd44C320f28e9cdB7CF0f5490434494Fbd4c7B4"
+        "eth:0x4fd44C320f28e9cdB7CF0f5490434494Fbd4c7B4"
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.bridge:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "eth:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      values.challengeManager:
-        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
+        "eth:0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      values.inbox:
-        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
+        "eth:0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      values.loserStakeEscrow:
-        "0xAe2032b4bfB56B70d48B314A71e0462346c122b0"
+        "eth:0xAe2032b4bfB56B70d48B314A71e0462346c122b0"
      values.outbox:
-        "0xe4F99a0734C87C298d73C161F54874225E416997"
+        "eth:0xe4F99a0734C87C298d73C161F54874225E416997"
      values.owner:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      values.rollupEventInbox:
-        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
+        "eth:0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      values.sequencerInbox:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
+        "eth:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
+        "eth:0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
      values.validatorUtils:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      values.validatorWalletCreator:
-        "0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
+        "eth:0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
      implementationNames.0x3AAfe635FCfA0E5C19C9368ab5eb384277836006:
-        "RollupProxy"
      implementationNames.0x107CbCe233467652E8a69E8555E58DA7AeF0bFa5:
-        "RollupAdminLogic"
      implementationNames.0x4fd44C320f28e9cdB7CF0f5490434494Fbd4c7B4:
-        "RollupUserLogic"
      implementationNames.eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006:
+        "RollupProxy"
      implementationNames.eth:0x107CbCe233467652E8a69E8555E58DA7AeF0bFa5:
+        "RollupAdminLogic"
      implementationNames.eth:0x4fd44C320f28e9cdB7CF0f5490434494Fbd4c7B4:
+        "RollupUserLogic"
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      values.$admin:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      values.$implementation:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.$pastUpgrades.0.2.0:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
+        "eth:0x2bf43034b9559643e986A2fE3cE015a18247b904"
      values.executors.0:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
+        "eth:0x2bf43034b9559643e986A2fE3cE015a18247b904"
      implementationNames.0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "UpgradeExecutor"
      implementationNames.eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "UpgradeExecutor"
    }
```

```diff
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
+        "eth:0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      values.$admin:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      values.$implementation:
-        "0x745fdabB168b7bdEe3801a37093C3A3c3230c50b"
+        "eth:0x745fdabB168b7bdEe3801a37093C3A3c3230c50b"
      values.$pastUpgrades.0.2.0:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "eth:0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      values.$pastUpgrades.1.2.0:
-        "0x745fdabB168b7bdEe3801a37093C3A3c3230c50b"
+        "eth:0x745fdabB168b7bdEe3801a37093C3A3c3230c50b"
      values.bridge:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "eth:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      values.osp:
-        "0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349"
+        "eth:0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349"
      values.resultReceiver:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      values.sequencerInbox:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
+        "eth:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      implementationNames.0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757:
-        "TransparentUpgradeableProxy"
      implementationNames.0x745fdabB168b7bdEe3801a37093C3A3c3230c50b:
-        "ChallengeManager"
      implementationNames.eth:0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x745fdabB168b7bdEe3801a37093C3A3c3230c50b:
+        "ChallengeManager"
    }
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
+        "eth:0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      values.$admin:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      values.$implementation:
-        "0x580b0Bf8bf47C338105166857cd9921EbF928B12"
+        "eth:0x580b0Bf8bf47C338105166857cd9921EbF928B12"
      values.$pastUpgrades.0.2.0:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "eth:0x1162084C3C6575121146582Db5BE43189e8CEe6b"
      values.$pastUpgrades.1.2.0:
-        "0x580b0Bf8bf47C338105166857cd9921EbF928B12"
+        "eth:0x580b0Bf8bf47C338105166857cd9921EbF928B12"
      values.bridge:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "eth:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      values.getProxyAdmin:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      values.sequencerInbox:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
+        "eth:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      implementationNames.0x7EF9d2fe20307165599101e93Ea05b04d46Af159:
-        "TransparentUpgradeableProxy"
      implementationNames.0x580b0Bf8bf47C338105166857cd9921EbF928B12:
-        "Inbox"
      implementationNames.eth:0x7EF9d2fe20307165599101e93Ea05b04d46Af159:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x580b0Bf8bf47C338105166857cd9921EbF928B12:
+        "Inbox"
    }
```

```diff
    contract OneStepProverMemory (0x8C07c8F36764962C43eb9A6D50426C652185c51D) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x8C07c8F36764962C43eb9A6D50426C652185c51D"
+        "eth:0x8C07c8F36764962C43eb9A6D50426C652185c51D"
      implementationNames.0x8C07c8F36764962C43eb9A6D50426C652185c51D:
-        "OneStepProverMemory"
      implementationNames.eth:0x8C07c8F36764962C43eb9A6D50426C652185c51D:
+        "OneStepProverMemory"
    }
```

```diff
    contract OneStepProver0 (0xa27dAF09D3a1d36e40316e38078FAF8bbBf3a12f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xa27dAF09D3a1d36e40316e38078FAF8bbBf3a12f"
+        "eth:0xa27dAF09D3a1d36e40316e38078FAF8bbBf3a12f"
      implementationNames.0xa27dAF09D3a1d36e40316e38078FAF8bbBf3a12f:
-        "OneStepProver0"
      implementationNames.eth:0xa27dAF09D3a1d36e40316e38078FAF8bbBf3a12f:
+        "OneStepProver0"
    }
```

```diff
    EOA  (0xAe2032b4bfB56B70d48B314A71e0462346c122b0) {
    +++ description: None
      address:
-        "0xAe2032b4bfB56B70d48B314A71e0462346c122b0"
+        "eth:0xAe2032b4bfB56B70d48B314A71e0462346c122b0"
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
    contract ProxyAdmin (0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235) {
    +++ description: None
      address:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      values.owner:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      implementationNames.0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235:
-        "ProxyAdmin"
      implementationNames.eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235:
+        "ProxyAdmin"
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
    EOA  (0xd4D2F3cB313e59A34089F6635c5c1c6145298640) {
    +++ description: None
      address:
-        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
+        "eth:0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
+        "eth:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      values.$admin:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      values.$implementation:
-        "0x6B292d1d4D38653b4F1D6De41c6be198371C5af1"
+        "eth:0x6B292d1d4D38653b4F1D6De41c6be198371C5af1"
      values.$pastUpgrades.0.2.0:
-        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
+        "eth:0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
      values.$pastUpgrades.1.2.0:
-        "0x6B292d1d4D38653b4F1D6De41c6be198371C5af1"
+        "eth:0x6B292d1d4D38653b4F1D6De41c6be198371C5af1"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0x23b6bFACe63BFa288783b8344574c75b78FaEd59"
+        "eth:0x23b6bFACe63BFa288783b8344574c75b78FaEd59"
      values.bridge:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "eth:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      values.reader4844:
-        "0x1fc9dBd52D420a5C4c6A2de4B1D1B380D1De4D53"
+        "eth:0x1fc9dBd52D420a5C4c6A2de4B1D1B380D1De4D53"
      values.rollup:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      implementationNames.0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6B292d1d4D38653b4F1D6De41c6be198371C5af1:
-        "SequencerInbox"
      implementationNames.eth:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6B292d1d4D38653b4F1D6De41c6be198371C5af1:
+        "SequencerInbox"
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
    contract OneStepProofEntry (0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349"
+        "eth:0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349"
      values.prover0:
-        "0xa27dAF09D3a1d36e40316e38078FAF8bbBf3a12f"
+        "eth:0xa27dAF09D3a1d36e40316e38078FAF8bbBf3a12f"
      values.proverHostIo:
-        "0x1E0fAE2d6Ca225903B81b742813E98CDBaD20037"
+        "eth:0x1E0fAE2d6Ca225903B81b742813E98CDBaD20037"
      values.proverMath:
-        "0x171c845f3229D6625bcdBcfB39BF53Fe15D2E4de"
+        "eth:0x171c845f3229D6625bcdBcfB39BF53Fe15D2E4de"
      values.proverMem:
-        "0x8C07c8F36764962C43eb9A6D50426C652185c51D"
+        "eth:0x8C07c8F36764962C43eb9A6D50426C652185c51D"
      implementationNames.0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349:
-        "OneStepProofEntry"
      implementationNames.eth:0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349:
+        "OneStepProofEntry"
    }
```

```diff
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0xe4F99a0734C87C298d73C161F54874225E416997"
+        "eth:0xe4F99a0734C87C298d73C161F54874225E416997"
      values.$admin:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      values.$implementation:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
      values.$pastUpgrades.0.2.0:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
      values.bridge:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "eth:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      implementationNames.0xe4F99a0734C87C298d73C161F54874225E416997:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC:
-        "Outbox"
      implementationNames.eth:0xe4F99a0734C87C298d73C161F54874225E416997:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC:
+        "Outbox"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x171c845f3229D6625bcdBcfB39BF53Fe15D2E4de)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x1E0fAE2d6Ca225903B81b742813E98CDBaD20037)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8C07c8F36764962C43eb9A6D50426C652185c51D)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xa27dAF09D3a1d36e40316e38078FAF8bbBf3a12f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

Generated with discovered.json: 0xfea31ad4af2d5f1c5bd0549554b685bf7078b38b

# Diff at Fri, 04 Jul 2025 12:19:11 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22231616
- current block number: 22231616

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22231616 (main branch discovery), not current.

```diff
    EOA  (0x23b6bFACe63BFa288783b8344574c75b78FaEd59) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
+        "eth:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
    }
```

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.0.from:
-        "ethereum:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.1.via.1.address:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      receivedPermissions.1.from:
-        "ethereum:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "eth:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      receivedPermissions.2.via.1.address:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      receivedPermissions.2.from:
-        "ethereum:0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
+        "eth:0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.3.from:
-        "ethereum:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.4.via.1.address:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      receivedPermissions.4.from:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.5.via.1.address:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      receivedPermissions.5.from:
-        "ethereum:0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
+        "eth:0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      receivedPermissions.6.via.1.address:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      receivedPermissions.6.from:
-        "ethereum:0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
+        "eth:0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      receivedPermissions.7.via.1.address:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      receivedPermissions.7.from:
-        "ethereum:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
+        "eth:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      receivedPermissions.8.via.1.address:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      receivedPermissions.8.from:
-        "ethereum:0xe4F99a0734C87C298d73C161F54874225E416997"
+        "eth:0xe4F99a0734C87C298d73C161F54874225E416997"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "ethereum:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "eth:0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
    }
```

```diff
    contract ProxyAdmin (0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "eth:0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
+        "eth:0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "eth:0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
+        "eth:0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
+        "eth:0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
+        "eth:0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xe4F99a0734C87C298d73C161F54874225E416997"
+        "eth:0xe4F99a0734C87C298d73C161F54874225E416997"
    }
```

```diff
    EOA  (0xd4D2F3cB313e59A34089F6635c5c1c6145298640) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "eth:0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
    }
```

Generated with discovered.json: 0x4c2b4afac524138600af2584d1896ca6f2f67f90

# Diff at Wed, 18 Jun 2025 12:23:30 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22231616
- current block number: 22231616

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22231616 (main branch discovery), not current.

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xc65d8a43b443824634497d45a627464a5a14f755

# Diff at Tue, 27 May 2025 08:28:06 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22231616
- current block number: 22231616

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22231616 (main branch discovery), not current.

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.1:
-        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
+        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.0:
-        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
+        "0x86c7032e0f4b5468f1eb92c79b73ab4c7f053fc7bdfc88fdd360e2fe7baa1072"
    }
```

Generated with discovered.json: 0x313cd64b58f62042e16f658cd276434a84a3947f

# Diff at Fri, 23 May 2025 09:41:00 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22231616
- current block number: 22231616

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22231616 (main branch discovery), not current.

```diff
    EOA  (0x23b6bFACe63BFa288783b8344574c75b78FaEd59) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235) {
    +++ description: None
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0xd4D2F3cB313e59A34089F6635c5c1c6145298640) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

Generated with discovered.json: 0xc5c1d499ceca1fc6f43db8d9b58a07788e6d5bac

# Diff at Fri, 02 May 2025 17:24:03 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22231616
- current block number: 22231616

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22231616 (main branch discovery), not current.

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x6b384403bf668cbbcdfcade6ecaecd56def1dabc

# Diff at Tue, 29 Apr 2025 08:19:07 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22231616
- current block number: 22231616

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22231616 (main branch discovery), not current.

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}]},{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}]},{"permission":"validate","to":"0xd4D2F3cB313e59A34089F6635c5c1c6145298640","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x23b6bFACe63BFa288783b8344574c75b78FaEd59","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

```diff
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"},{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"}]}]
    }
```

Generated with discovered.json: 0xcc2537f7daba62f767d964e418c3a0c88fcf69ab

# Diff at Wed, 09 Apr 2025 13:22:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@45b707d5b88f76d72dd5f8252dbef76321c2f829 block: 21917027
- current block number: 22231616

## Description

Upgrade to ArbOS v32.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      sourceHashes.1:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      sourceHashes.0:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      values.$implementation.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x4fd44C320f28e9cdB7CF0f5490434494Fbd4c7B4"
      values.$implementation.0:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x107CbCe233467652E8a69E8555E58DA7AeF0bFa5"
      values.$pastUpgrades.1:
+        ["2024-05-16T04:46:47.000Z","0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]
      values.$pastUpgrades.0.2:
-        "2024-05-16T04:46:47.000Z"
+        "2025-04-07T19:36:59.000Z"
      values.$pastUpgrades.0.1:
-        "0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10"
+        "0xc2be8923b1e282245bf9396df6ce3d92ae3a1ff495d21847090c31165ef57c1c"
      values.$pastUpgrades.0.0.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x4fd44C320f28e9cdB7CF0f5490434494Fbd4c7B4"
      values.$pastUpgrades.0.0.0:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x107CbCe233467652E8a69E8555E58DA7AeF0bFa5"
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
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
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
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.0:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x745fdabB168b7bdEe3801a37093C3A3c3230c50b"
      values.$pastUpgrades.1:
+        ["2024-05-16T04:46:47.000Z","0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10",["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]]
      values.$pastUpgrades.0.2:
-        "2024-05-16T04:46:47.000Z"
+        "2025-04-07T19:36:59.000Z"
      values.$pastUpgrades.0.1:
-        "0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10"
+        "0xc2be8923b1e282245bf9396df6ce3d92ae3a1ff495d21847090c31165ef57c1c"
      values.$pastUpgrades.0.0.0:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x745fdabB168b7bdEe3801a37093C3A3c3230c50b"
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x99872d99b7163c705118e0a168f99728c3c7089581779077707271cdaad30be3"
+        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
      sourceHashes.0:
-        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
+        "0x84cd273689e720a0b7c657b57d9fb127684f3abb87fc4b337a2f0decd9464120"
      values.$implementation:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x580b0Bf8bf47C338105166857cd9921EbF928B12"
      values.$pastUpgrades.1:
+        ["2024-05-16T04:46:47.000Z","0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10",["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]]
      values.$pastUpgrades.0.2:
-        "2024-05-16T04:46:47.000Z"
+        "0x5703e61666c0026973520711926fa609a6a3f6223a2f38340ba241cb527649d5"
      values.$pastUpgrades.0.1:
-        "0xfbd9b814ebadbe634d86f5d37bf0a54e6c7fcae5a7e2824e99dcf4d7caea1b10"
+        "2025-04-07T20:17:35.000Z"
      values.$pastUpgrades.0.0.0:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x580b0Bf8bf47C338105166857cd9921EbF928B12"
      values.$upgradeCount:
-        1
+        2
    }
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
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x958985cf2c54f99ba4a599221A8090C1F9Cee9A5"
+        "0x6B292d1d4D38653b4F1D6De41c6be198371C5af1"
      values.$pastUpgrades.1:
+        ["2025-04-07T20:17:35.000Z","0x5703e61666c0026973520711926fa609a6a3f6223a2f38340ba241cb527649d5",["0x6B292d1d4D38653b4F1D6De41c6be198371C5af1"]]
      values.$upgradeCount:
-        1
+        2
      values.reader4844:
-        "0x7Deda2425eC2d4EA0DF689A78de2fBF002075576"
+        "0x1fc9dBd52D420a5C4c6A2de4B1D1B380D1De4D53"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x171c845f3229D6625bcdBcfB39BF53Fe15D2E4de)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x1E0fAE2d6Ca225903B81b742813E98CDBaD20037)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8C07c8F36764962C43eb9A6D50426C652185c51D)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xa27dAF09D3a1d36e40316e38078FAF8bbBf3a12f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xd8D0422128f4dEf4D057507f30Fc3e7Bd1A6c349)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../{.flat@21917027 => .flat}/Inbox/Inbox.sol      |  52 +-
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@21917027 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 .../SequencerInbox/SequencerInbox.sol              |  24 +-
 10 files changed, 2825 insertions(+), 962 deletions(-)
```

Generated with discovered.json: 0xf24dd5d8251128aad867298ba98a2f704c342a41

# Diff at Thu, 06 Mar 2025 09:39:04 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21917027
- current block number: 21917027

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21917027 (main branch discovery), not current.

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x7EF9d2fe20307165599101e93Ea05b04d46Af159","0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xe4F99a0734C87C298d73C161F54874225E416997"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xc3644c1c0984a75fbd51f039fe5de497ad0f6e7c

# Diff at Tue, 04 Mar 2025 10:39:29 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21917027
- current block number: 21917027

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21917027 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432744
    }
```

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        19880244
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
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      sinceBlock:
+        20367195
    }
```

```diff
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        19880244
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        19880244
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        19880244
    }
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432745
    }
```

```diff
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        19880244
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432741
    }
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        19880244
    }
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432742
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        19432743
    }
```

```diff
    contract ProxyAdmin (0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235) {
    +++ description: None
      sinceBlock:
+        19880244
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        19880244
    }
```

```diff
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        19880244
    }
```

Generated with discovered.json: 0xbd6d68723431410a08bddcd2525d5a5601ecc450

# Diff at Mon, 24 Feb 2025 15:18:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cfe18eb30997850b8abc4c6e718cd2a363aa4309 block: 21465199
- current block number: 21917027

## Description

renamed MS (shared with form network).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      name:
-        "OevNetworkMultisig"
+        "Caldera Multisig 3"
    }
```

Generated with discovered.json: 0xd6c69a3365cd3663635a5b16282b262477eed477

# Diff at Fri, 21 Feb 2025 14:09:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21465199
- current block number: 21465199

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x37267e28d60ea16156b62033be683eb7cdb85564

# Diff at Thu, 20 Feb 2025 12:22:40 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 21465199
- current block number: 21465199

## Description

Config related: Bold templates added

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x98e9d5b0705cd2c5813d9ebaf061dcc9d222157c

# Diff at Tue, 04 Feb 2025 12:31:45 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21465199
- current block number: 21465199

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x648ab6277397e52860bc2efa0ad22ff97ca2f2c9

# Diff at Mon, 20 Jan 2025 11:09:49 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21465199
- current block number: 21465199

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
    }
```

```diff
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xe4F99a0734C87C298d73C161F54874225E416997"
      receivedPermissions.8.from:
+        "0xe4F99a0734C87C298d73C161F54874225E416997"
      receivedPermissions.7.target:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      receivedPermissions.7.from:
+        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      receivedPermissions.6.target:
-        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      receivedPermissions.6.from:
+        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      receivedPermissions.5.target:
-        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      receivedPermissions.5.from:
+        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      receivedPermissions.4.target:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.4.from:
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.3.target:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.3.from:
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.2.target:
-        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      receivedPermissions.2.from:
+        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      receivedPermissions.1.target:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      receivedPermissions.1.from:
+        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      receivedPermissions.0.target:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.0.from:
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      directlyReceivedPermissions.0.target:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      directlyReceivedPermissions.0.from:
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
    }
```

```diff
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
      issuedPermissions.2.to:
+        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      directlyReceivedPermissions.2.target:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      directlyReceivedPermissions.2.from:
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      directlyReceivedPermissions.1.target:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      directlyReceivedPermissions.1.from:
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      directlyReceivedPermissions.0.target:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      directlyReceivedPermissions.0.from:
+        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
    }
```

```diff
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
    }
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
    }
```

```diff
    contract ProxyAdmin (0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xe4F99a0734C87C298d73C161F54874225E416997"
      directlyReceivedPermissions.6.from:
+        "0xe4F99a0734C87C298d73C161F54874225E416997"
      directlyReceivedPermissions.5.target:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      directlyReceivedPermissions.5.from:
+        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      directlyReceivedPermissions.4.target:
-        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      directlyReceivedPermissions.4.from:
+        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      directlyReceivedPermissions.3.target:
-        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      directlyReceivedPermissions.3.from:
+        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      directlyReceivedPermissions.2.target:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      directlyReceivedPermissions.2.from:
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      directlyReceivedPermissions.1.target:
-        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      directlyReceivedPermissions.1.from:
+        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      directlyReceivedPermissions.0.target:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      directlyReceivedPermissions.0.from:
+        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.target:
-        "0x23b6bFACe63BFa288783b8344574c75b78FaEd59"
      issuedPermissions.0.to:
+        "0x23b6bFACe63BFa288783b8344574c75b78FaEd59"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
    }
```

Generated with discovered.json: 0xfed2d74e40b4bff64279012db52073c5841b8996

# Diff at Wed, 08 Jan 2025 10:44:53 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465199
- current block number: 21465199

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465199 (main branch discovery), not current.

```diff
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x9e8a3b4eded4d77378c5f3038445c1e36dadde19

# Diff at Mon, 23 Dec 2024 12:31:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21313475
- current block number: 21465199

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21313475 (main branch discovery), not current.

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xee1b60ed8d7d1a850b28afb307fc8586f8d71fa2

# Diff at Fri, 06 Dec 2024 08:09:47 GMT:

- chain: ethereum
- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21313475
- current block number: 21313475

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21313475 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x59718eeed34401dc97056fdc6f4647e14d993ae4

# Diff at Mon, 02 Dec 2024 07:57:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0cac24376573663e0a362b2f340a124e5238a2bc block: 21084619
- current block number: 21313475

## Description

Remove one MS signer.

## Watched changes

```diff
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      values.$members.6:
-        "0x15D5fF2dEc328a1cF3D64413caaBdcE29bff050A"
      values.$members.5:
-        "0xb004d94314a34627C09E4b8f83D9E7420d99BbFC"
+        "0x15D5fF2dEc328a1cF3D64413caaBdcE29bff050A"
      values.$members.4:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
+        "0xb004d94314a34627C09E4b8f83D9E7420d99BbFC"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0xc63d92dea2764c18b13e58ecca29f80fa58fb025

# Diff at Fri, 29 Nov 2024 11:28:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21084619
- current block number: 21084619

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084619 (main branch discovery), not current.

```diff
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xdbdcaab6357f615a9b80deb5f15bb6dce478bb7b

# Diff at Fri, 15 Nov 2024 08:18:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21084619
- current block number: 21084619

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084619 (main branch discovery), not current.

```diff
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0}]}
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
-        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.0.via.0:
+        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x09a596b323acf8d9759963ac35076444a3585e63

# Diff at Mon, 04 Nov 2024 07:57:52 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21084619
- current block number: 21084619

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21084619 (main branch discovery), not current.

```diff
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xe4F99a0734C87C298d73C161F54874225E416997","via":[{"address":"0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"},{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}]}
      receivedPermissions.7.target:
-        "0xe4F99a0734C87C298d73C161F54874225E416997"
+        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
      receivedPermissions.6.target:
-        "0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7"
+        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
      receivedPermissions.5.target:
-        "0x7EF9d2fe20307165599101e93Ea05b04d46Af159"
+        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
      receivedPermissions.4.target:
-        "0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757"
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.3.target:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.3.via.1:
-        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}
      receivedPermissions.3.via.0.address:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.2.target:
-        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
+        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
      receivedPermissions.2.via.1:
+        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}
      receivedPermissions.2.via.0.address:
-        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
+        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
      receivedPermissions.1.target:
-        "0x3401eafd7Ceb84265B2cC4252155e12B446E7c57"
+        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd"
+        "0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"
      receivedPermissions.0.via.1:
-        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"}
      receivedPermissions.0.via.0.address:
-        "0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235"
+        "0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
+        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
      issuedPermissions.2.via.0:
-        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xd4D2F3cB313e59A34089F6635c5c1c6145298640"
+        "0x2bf43034b9559643e986A2fE3cE015a18247b904"
      issuedPermissions.1.via.0:
+        {"address":"0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x3AAfe635FCfA0E5C19C9368ab5eb384277836006"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x897f4c13409d49ae727c1f15bf64d9ea95dfa1e4

# Diff at Thu, 31 Oct 2024 09:08:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21084619

## Description

Initial discovery of a standard orbit stack optimium. (`xchain => oevnetwork @ 1.00`)

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0x2403Dd9dFa12255Be8f42bc1e644733c9b2d10Dd)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OevNetworkMultisig (0x2bf43034b9559643e986A2fE3cE015a18247b904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x3401eafd7Ceb84265B2cC4252155e12B446E7c57)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x3AAfe635FCfA0E5C19C9368ab5eb384277836006)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x566e4dA579fd344DF9fbC2Cbf4014faD41DCA0eA)
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x59F75d2730a6a505c3C12b797cE2e7Bdb0C11757)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x7EF9d2fe20307165599101e93Ea05b04d46Af159)
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
    contract ProxyAdmin (0xb6fbC59CF12d77C35d58B82Deee76cfc934F1235)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xD5dD6114a5DC6d1352C0EE47Cbed6a1807F079c7)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract Outbox (0xe4F99a0734C87C298d73C161F54874225E416997)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

