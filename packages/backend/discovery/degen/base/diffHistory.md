Generated with discovered.json: 0xddc12255500e0fbe5ca82374453223d4a0fa8aab

# Diff at Wed, 16 Oct 2024 11:45:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20331015
- current block number: 20331015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331015 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xFB48D385Fa3da33762B350e1d705b9E46054E677","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0xFB48D385Fa3da33762B350e1d705b9E46054E677"
+        "0xa3582189403F67a9CDB1CE0Ac066c954FFd3f205"
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x1BCdC0eCc1e4A31E5dB0542f81895d8319A757Ca","via":[]}
    }
```

Generated with discovered.json: 0x3bae1d4f8abf395fb7111029f73fc9644f3fa265

# Diff at Mon, 14 Oct 2024 10:59:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20331015
- current block number: 20331015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331015 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract ValidatorUtils (0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract OneStepProverMemory (0x2Bb71AE6f5Bb52de5F535efD804e156ed2a35a8f) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2) {
    +++ description: None
      sourceHashes:
+        ["0xdf38c41dfed5147dbd3a1a8d8947ff056a36aa5d6232aa2c5c9dd2b5f4d1ca42"]
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract OneStepProverMath (0x764cDAAc715ef3e29B3c8D28A1261AD9B7eD206D) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract RollupOwnerMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract ValidatorWalletCreator (0xB546310EA2De84220811a03BCD5CeE96D251fA7D) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract OneStepProver0 (0xBa04bD4aDa714b0cb3B87784dc9F20620aF37428) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract OneStepProofEntry (0xC17A41629Cd100c74B1Bed7b49D2E0517EfDeaeb) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

```diff
    contract OneStepProverHostIo (0xF4AA217a96c205df7B0D081DC95385B701eFE9b0) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

Generated with discovered.json: 0x9305ee48207cf473c0977937e5b32f5025047bfb

# Diff at Tue, 01 Oct 2024 11:13:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20331015
- current block number: 20331015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331015 (main branch discovery), not current.

```diff
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0xcA00Db0289131B71A6624f62666bd54305697BB2"]]]
    }
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"]],["2024-07-02T00:12:17.000Z",["0x98DB769A9E15D66EA04665da0dF616596c296BA8"]]]
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"]],["2024-07-02T00:12:17.000Z",["0x377A5b786E94cAcdcB2B309451C373c8F2166A79"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x4326B3755539d35b0A8846bF9b33982A8eA42c93"]]]
    }
```

```diff
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x3C4DF76De31816443C207E49F9fE48737C8F2746"]]]
    }
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x3A59b13eB3F661DE35a1e203Bd12b3B4123976cf","0xB7202d306936B79Ba29907b391faA87D3BEec33A"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0x20fA6358f89Ed16d48F6588a8f500887354Ff56c"]]]
    }
```

```diff
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-10T16:17:21.000Z",["0xc00336Cdf86AE7AD58D8773B0114082C190D28D5"]]]
    }
```

Generated with discovered.json: 0x044d6e7fe4fe9e38553717547bdc6f8635e51bdf

# Diff at Fri, 27 Sep 2024 15:37:03 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 16561766
- current block number: 20331015

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x64af12a25354a086a656231a452f885e6d32d619

# Diff at Sun, 01 Sep 2024 08:47:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 16561766
- current block number: 16561766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16561766 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "ArbOS v20 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

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
