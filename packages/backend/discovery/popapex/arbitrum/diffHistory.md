Generated with discovered.json: 0x39da3902e7f06bcfa9503292aeee6a04f4ec03c0

# Diff at Fri, 27 Sep 2024 15:31:42 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 247928599
- current block number: 257933943

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 247928599 (main branch discovery), not current.

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xbcfaab9a138fe87074b8ac2be28866fc3b31b12d

# Diff at Sun, 01 Sep 2024 08:47:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 247928599
- current block number: 247928599

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 247928599 (main branch discovery), not current.

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "ArbOS v10.2 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xac4b6088d34dc34524b09b78f8191d068d9146a9

# Diff at Thu, 29 Aug 2024 11:59:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32afcfdfd1c9c51d8abb3a0fa5eb61a730d56efd block: 245518206
- current block number: 247928599

## Description

Renamed MS to match the other ProofofPlay chain.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245518206 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProofOfPlayMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      name:
-        "RollupOwnerMultisig"
+        "ProofOfPlayMultisig"
    }
```

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
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

Generated with discovered.json: 0xd054a9d3c596c9edfe30f897e6e43e7946db9136

# Diff at Fri, 23 Aug 2024 09:57:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 245518206
- current block number: 245518206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245518206 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x5438f384651127233b0db8a2cbbe28df1822844e

# Diff at Thu, 22 Aug 2024 11:53:21 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 227940683
- current block number: 245518206

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 227940683 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBhPN6Tq6nXoJS041bPwKYcDeU1Y84s1URBM4MJHKup49TzNB/23scWwhETSvpAl1RnMwh0S/Z+LZ8UGFWlLYmquyJi5weYTsMF6rChTnuZnqY4I1zQZPemy5hK0sIJDlQaqb/llv/8ujT5q3p4DhBLXZ3eIUMcXs4j7F+QMNZyO87mbTnrulLiPfZbAno1SKg8k2Q76fbNPQs76GK4aseCPeA5hPguvjijDIqDVK5Ffz/PhQ6nap8K6UlApBm+CMBIOmAP9IdMyAVs+wirhgMvR88+JVhoMW9kU3F90bWks78tHYqASrw/lXBFI8TgiGhlvvsmUJAC3dyzjccjMyO0M05JjmM1i8bkAdYuCWRF0KV63rABVXUAFGtKAzrLPpw=="]
    }
```

Generated with discovered.json: 0xa8209a96e3752d62cde36dc6ed2aa5c3e5245dc2

# Diff at Wed, 21 Aug 2024 10:07:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 227940683
- current block number: 227940683

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 227940683 (main branch discovery), not current.

```diff
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x65AD139061B3f6DDb16170a07b925337ddf42407"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x65AD139061B3f6DDb16170a07b925337ddf42407","via":[]}]
    }
```

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC6f49cff395c4d160C61112522700dcB007c41d","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6","0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2","0x3d0b021E1d2A8747411E3724d5165716B35448f3","0x7b18A3073774e00C072DeBd390ed6fE4251493A7","0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","0xa58F38102579dAE7C584850780dDA55744f67DF1","0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6","via":[]},{"permission":"upgrade","target":"0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2","via":[]},{"permission":"upgrade","target":"0x3d0b021E1d2A8747411E3724d5165716B35448f3","via":[]},{"permission":"upgrade","target":"0x7b18A3073774e00C072DeBd390ed6fE4251493A7","via":[]},{"permission":"upgrade","target":"0xa58F38102579dAE7C584850780dDA55744f67DF1","via":[]},{"permission":"upgrade","target":"0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea","via":[]},{"permission":"upgrade","target":"0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","via":[]}]
    }
```

Generated with discovered.json: 0x4fabc42e972dfa99c7913dccc810f9b4efe3c921

# Diff at Fri, 09 Aug 2024 12:03:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 227940683
- current block number: 227940683

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 227940683 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
    +++ description: None
      assignedPermissions.upgrade.5:
-        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
+        "0xa58F38102579dAE7C584850780dDA55744f67DF1"
      assignedPermissions.upgrade.4:
-        "0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"
+        "0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1"
      assignedPermissions.upgrade.2:
-        "0xa58F38102579dAE7C584850780dDA55744f67DF1"
+        "0x3d0b021E1d2A8747411E3724d5165716B35448f3"
      assignedPermissions.upgrade.1:
-        "0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"
+        "0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2"
      assignedPermissions.upgrade.0:
-        "0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1"
+        "0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6"
    }
```

Generated with discovered.json: 0x7a55753f31915e09aae3c80098862f1672b455c3

# Diff at Fri, 09 Aug 2024 10:13:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 227940683
- current block number: 227940683

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 227940683 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x65AD139061B3f6DDb16170a07b925337ddf42407"]
      assignedPermissions.upgrade:
+        ["0x65AD139061B3f6DDb16170a07b925337ddf42407"]
    }
```

```diff
    contract RollupOwnerMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 7 (29%)"
      values.getOwners:
-        ["0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 7 (29%)"
    }
```

```diff
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6","0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2","0x3d0b021E1d2A8747411E3724d5165716B35448f3","0x7b18A3073774e00C072DeBd390ed6fE4251493A7","0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","0xa58F38102579dAE7C584850780dDA55744f67DF1","0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"]
      assignedPermissions.upgrade:
+        ["0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1","0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6","0xa58F38102579dAE7C584850780dDA55744f67DF1","0x7b18A3073774e00C072DeBd390ed6fE4251493A7","0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2","0x3d0b021E1d2A8747411E3724d5165716B35448f3","0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea"]
    }
```

Generated with discovered.json: 0x4a76c38705724982b53501f82ac8c5e1eed883d5

# Diff at Tue, 30 Jul 2024 11:17:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 227940683
- current block number: 227940683

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 227940683 (main branch discovery), not current.

```diff
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0x7f495d60ba2b5843bf91df294dd17fdcc76a0c62

# Diff at Tue, 02 Jul 2024 09:38:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6e87a8f437fbb4bda4cdabd5107dd1f20f111445 block: 225981315
- current block number: 227940683

## Description

Three new signers are added to the popapex OwnerMultisig.

## Watched changes

```diff
    contract RollupOwnerMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      upgradeability.threshold:
-        "2 of 4 (50%)"
+        "2 of 7 (29%)"
      values.getOwners.6:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.5:
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.4:
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getOwners.0:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

Generated with discovered.json: 0x4220660393dd05d99d4710998df879bf64a48ba1

# Diff at Tue, 11 Jun 2024 12:22:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 215638376
- current block number: 220726400

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 215638376 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [3456000,48,86400000,3600]
+        {"delayBlocks":3456000,"futureBlocks":48,"delaySeconds":86400000,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xf80bfbaf3a649ffd7309eb20265b40f764614b4a

# Diff at Mon, 27 May 2024 17:45:02 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@dbc274621a752b9a0e3943e430166c617d1edd06 block: 211899531
- current block number: 215638376

## Description

Updated the SequencerInbox template, no onchain changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 211899531 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
    }
```

Generated with discovered.json: 0x9fe3796691c10ec5795e696f3f364bf5faed7778

# Diff at Tue, 14 May 2024 07:19:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0dcad16d442c9306c666eb55cc246f5202105346 block: 203714971
- current block number: 211101547

## Description


This update extends the sequencer-only window for Proof of Play Apex chain by 1000x to 1000d. (MaxTimeVariation.delayBlocks, maxTimeVariation.delaySeconds)
Context: [Reorg on popapex](https://twitter.com/conduitxyz/status/1790065376975552549). No batches posted for the last ~35h, similar problem to Degen chain.

## Watched changes

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: None
      values.maxTimeVariation.2:
-        86400
+        86400000
      values.maxTimeVariation.0:
-        5760
+        3456000
    }
```

Generated with discovered.json: 0xf50c4fdab7cd8deba39e9b78f4634254f949bf52

# Diff at Thu, 11 Apr 2024 14:11:27 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 199929429

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupOwnerMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```
