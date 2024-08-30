Generated with discovered.json: 0xe467baf95b5f718e49acff35c18c812a7734b1a1

# Diff at Fri, 30 Aug 2024 08:17:18 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
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

Generated with discovered.json: 0x86e9eec8f7b534fe319d4db68658bca42263d1da

# Diff at Fri, 23 Aug 2024 09:57:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        2
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x8d6095a9902b66ecc06ccc7e8f8d5407c9ad37ac

# Diff at Wed, 21 Aug 2024 13:25:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@63cb0bd5d55a6dfae0e2e22590983dd8344be4a3 block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBhPN6Tq6nXoJS041bPwKYcDeU1Y84s1URBM4MJHKup49TzNB/23scWwhETSvpAl1RnMwh0S/Z+LZ8UGFWlLYmquyJi5weYTsMF6rChTnuZnqY4I1zQZPemy5hK0sIJDlQaqb/llv/8ujT5q3p4DhBLXZ3eIUMcXs4j7F+QMNZyO87mbTnrulLiPfZbAno1SKg8k2Q76fbNPQs76GK4aseCPeA5hPguvjijDIqDVK5Ffz/PhQ6nap8K6UlApBm+CMBIOmAP9IdMyAVs+wirhgMvR88+JVhoMW9kU3F90bWks78tHYqASrw/lXBFI8TgiGhlvvsmUJAC3dyzjccjMyO0M05JjmM1i8bkAdYuCWRF0KV63rABVXUAFGtKAzrLPpw=="]
    }
```

Generated with discovered.json: 0x77a061391a6039ae3efe993ae4e1ab8a163f49d3

# Diff at Wed, 21 Aug 2024 10:07:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xD34F3a11F10DB069173b32d84F02eDA578709143"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xD34F3a11F10DB069173b32d84F02eDA578709143","via":[]}]
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","via":[]}]
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7","0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221","0x67812161Bbb6aCF891aA6028BC614a660961ceD8","0x766DD3A13d17C6D175975C89225bde89F052dBc4","0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","0xaA3A7A2ec2477A61082E1C41a2c6710587917028","0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7","via":[]},{"permission":"upgrade","target":"0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221","via":[]},{"permission":"upgrade","target":"0x67812161Bbb6aCF891aA6028BC614a660961ceD8","via":[]},{"permission":"upgrade","target":"0x766DD3A13d17C6D175975C89225bde89F052dBc4","via":[]},{"permission":"upgrade","target":"0xaA3A7A2ec2477A61082E1C41a2c6710587917028","via":[]},{"permission":"upgrade","target":"0xe63ddb12FBb6211a73F12a4367b10dA0834B82da","via":[]},{"permission":"upgrade","target":"0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","via":[]}]
    }
```

Generated with discovered.json: 0x42498c92216e6594ae1bda52616be9869e95612f

# Diff at Fri, 09 Aug 2024 12:04:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      assignedPermissions.upgrade.6:
-        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
+        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
      assignedPermissions.upgrade.5:
-        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
+        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
      assignedPermissions.upgrade.4:
-        "0xaA3A7A2ec2477A61082E1C41a2c6710587917028"
+        "0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C"
      assignedPermissions.upgrade.3:
-        "0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"
+        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
      assignedPermissions.upgrade.2:
-        "0x766DD3A13d17C6D175975C89225bde89F052dBc4"
+        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
      assignedPermissions.upgrade.1:
-        "0x67812161Bbb6aCF891aA6028BC614a660961ceD8"
+        "0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"
    }
```

Generated with discovered.json: 0x8178c9209560a365645d3c44be2d9ad89087b2b1

# Diff at Fri, 09 Aug 2024 10:14:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract RollupOwnerMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xD34F3a11F10DB069173b32d84F02eDA578709143"]
      assignedPermissions.upgrade:
+        ["0xD34F3a11F10DB069173b32d84F02eDA578709143"]
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7","0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221","0x67812161Bbb6aCF891aA6028BC614a660961ceD8","0x766DD3A13d17C6D175975C89225bde89F052dBc4","0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","0xaA3A7A2ec2477A61082E1C41a2c6710587917028","0xe63ddb12FBb6211a73F12a4367b10dA0834B82da"]
      assignedPermissions.upgrade:
+        ["0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7","0x67812161Bbb6aCF891aA6028BC614a660961ceD8","0x766DD3A13d17C6D175975C89225bde89F052dBc4","0xe63ddb12FBb6211a73F12a4367b10dA0834B82da","0xaA3A7A2ec2477A61082E1C41a2c6710587917028","0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C","0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221"]
    }
```

Generated with discovered.json: 0x8cc1d487e65c0f4c0d373d60068076cd3c22e2a4

# Diff at Tue, 30 Jul 2024 11:17:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x80ba39fc47a3d18884f115b7ce7c8571d3d07e0e

# Diff at Tue, 02 Jul 2024 09:34:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6e87a8f437fbb4bda4cdabd5107dd1f20f111445 block: 16316538
- current block number: 16561766

## Description

Degen is upgraded to [ArbOS Version 20 "Atlas"](https://forum.arbitrum.foundation/t/aip-arbos-version-20-atlas/20957).
This upgrade comes with blobs support (but Degen is an L3 on Base) and was reviewed thoroughly in `packages/backend/discovery/arbitrum/ethereum/diffHistory.md` at "Diff at Fri, 22 Mar 2024 07:51:09 GMT:".

TLDR of changes:
- SequencerInbox changes are related to blobs support
- Critical values like maxTimeVariation in the SequencerInbox (self sequencing delay) stay the same
- ChallengeManager is the same except for pointing to new OneStepProof contract

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x23D6786f56eb33313a2F3393012e29631f63C914)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x351089AaF039aF15bb601e695A30D515963D29Af)
    +++ description: None
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      upgradeability.implementation:
-        "0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"
+        "0x98DB769A9E15D66EA04665da0dF616596c296BA8"
      implementations.0:
-        "0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"
+        "0x98DB769A9E15D66EA04665da0dF616596c296BA8"
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
+        "0xB48E4A4B8EC04c9F1819302FD370f5B3797c638C"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      upgradeability.implementation:
-        "0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"
+        "0x377A5b786E94cAcdcB2B309451C373c8F2166A79"
      implementations.0:
-        "0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"
+        "0x377A5b786E94cAcdcB2B309451C373c8F2166A79"
      values.osp:
-        "0x351089AaF039aF15bb601e695A30D515963D29Af"
+        "0xC17A41629Cd100c74B1Bed7b49D2E0517EfDeaeb"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x915322CB7Ef079d9d9B97ffEEB63BbfB5c94c096)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x961eF021A56EC0A051BaA4B3419A4412caFC8fbF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xa7F215B5fC21e19C4e17E4915CA69740CE2916Af)
    +++ description: None
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x2Bb71AE6f5Bb52de5F535efD804e156ed2a35a8f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x764cDAAc715ef3e29B3c8D28A1261AD9B7eD206D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xB48E4A4B8EC04c9F1819302FD370f5B3797c638C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xBa04bD4aDa714b0cb3B87784dc9F20620aF37428)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xC17A41629Cd100c74B1Bed7b49D2E0517EfDeaeb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xF4AA217a96c205df7B0D081DC95385B701eFE9b0)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

Generated with discovered.json: 0x603758207c23fada073f1e40b7c71acf33515b0a

# Diff at Tue, 11 Jun 2024 13:15:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 15021326
- current block number: 15661159

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15021326 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [3456000,48,86400000,3600]
+        {"delayBlocks":3456000,"futureBlocks":48,"delaySeconds":86400000,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xc30d97b2c62e49cb891cf19047ba38cb3a0d7615

# Diff at Mon, 27 May 2024 17:47:10 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@dbc274621a752b9a0e3943e430166c617d1edd06 block: 14543033
- current block number: 15021326

## Description

Updated the SequencerInbox template, no onchain changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14543033 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
    }
```

Generated with discovered.json: 0xaf54a96131f4555110c26941ac4b68c40625933a

# Diff at Tue, 14 May 2024 07:08:06 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0dcad16d442c9306c666eb55cc246f5202105346 block: 12908240
- current block number: 14440563

## Description

This update extends the sequencer-only window for degen chain by 1000x to 1000d. (MaxTimeVariation.delayBlocks, maxTimeVariation.delaySeconds)
Context: Big chain reorg on the L2, no batches posted for the last ~30h.

## Watched changes

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: None
      values.maxTimeVariation.2:
-        86400
+        86400000
      values.maxTimeVariation.0:
-        5760
+        3456000
    }
```

Generated with discovered.json: 0xb10226147642416599acfd9706b5734973b04a80

# Diff at Mon, 08 Apr 2024 19:50:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 12908240

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x23D6786f56eb33313a2F3393012e29631f63C914)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x351089AaF039aF15bb601e695A30D515963D29Af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupOwnerMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x915322CB7Ef079d9d9B97ffEEB63BbfB5c94c096)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x961eF021A56EC0A051BaA4B3419A4412caFC8fbF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xa7F215B5fC21e19C4e17E4915CA69740CE2916Af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0xB546310EA2De84220811a03BCD5CeE96D251fA7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xd063bb4EB74f813b1A0D9208Da100E3c08D9d4C9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677)
    +++ description: None
```
