Generated with discovered.json: 0x896562db29c17ca0f822bd2070e7268a404e8a74

# Diff at Tue, 01 Oct 2024 11:12:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 257933728
- current block number: 257933728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257933728 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0x1d182075d07744D71E37f77f1654165f6DAFad08"]]]
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0x2675b9DEb473ECaC13ddd71dF8A0Ef13FeF6a75D"]]]
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:38.000Z",["0x652F65f950b71d7aD04AffB1725F43786ed5f6Cc"]]]
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]]]
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0xf2bCB26dbb571EBC82CFAe6453AeF0DE90d93421"]]]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:38.000Z",["0x922db00d292477AD99Ef8A0c41101a664Ee79D2b"]]]
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0xCa2F31F3C6553c2FD9897f7AA464406a431959A9"]]]
    }
```

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-02T00:51:22.000Z",["0xC5Db571093C4600559e239497d147476F7543b15"]]]
    }
```

Generated with discovered.json: 0xd74f98a205e5c853c34d969598ca00f8cd51b914

# Diff at Fri, 27 Sep 2024 15:30:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 256797668
- current block number: 257933728

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 256797668 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xba6a9ba9b733cfed127cd2188fd6eea93c30037a

# Diff at Tue, 24 Sep 2024 08:12:58 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3382cfb14234950671011f2a61630973cab3e07 block: 225981159
- current block number: 256797668

## Description

Caldera MS on Arbi: 1 signer changed.

## Watched changes

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.3:
-        "0xB2a5970fB30dc34AD65c914db855766ea62f1f41"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.2:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
      values.$members.1:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
+        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.$members.0:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0xbf853295743511e8DC5F03809d209C33fC136d24"
    }
```

Generated with discovered.json: 0x396dbde7598716830ae0950812ba7f7f7fe96109

# Diff at Sun, 01 Sep 2024 08:47:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
+        "ArbOS v11.1 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x65389223029fbada5686bfc2dce5f92ea305bbef

# Diff at Fri, 30 Aug 2024 08:06:14 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
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
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xe9be18e14677ae9bcdff86d79534c490f09bb6bf

# Diff at Fri, 23 Aug 2024 09:57:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xb39bef3c35391edda9446e65d14c1a5acebc4ab3

# Diff at Wed, 21 Aug 2024 13:25:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@63cb0bd5d55a6dfae0e2e22590983dd8344be4a3 block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      values.dacKeyset.blsSignatures:
+        ["YAqQTw4ByRTsc9900Jqz1uF86NCR0qf4Qorr6m+4UMuebljjJmkm9ao1wgU9YMVsiAQiJZW5V0wv3eSEoHEOfpL4KesBDWtj3Dxlie526tY8MGcEruvE+/+yWenFV64DjgSIEgMvQWcMEnYuBeuIcPq3iFWoPlZ5xjrFq3TC3pg/4vNdHyraTaGAoSE1kpr95QJjp3pjuOh8EpCD1i4skjJP4YVjtsui7a8t3s8TTwTo3QYk/HTPLAJ8e15iBTin/xcbxa8wfNTBespH4pXgIQBYT/M2kyNWURyaJGz/Uk0ecJPEVtTwNPedztrARTHgkAiCDWd63/ekdUN0plGc8G4aWWg/MJN1X3UZwSUf5Z6PIG/9qtBgtijcxx2UvCjvyw=="]
    }
```

Generated with discovered.json: 0x0fbfa465bbc1eba2c39fe107cabcbe8b0672d5d5

# Diff at Wed, 21 Aug 2024 10:07:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2","0x235000876bd58336C802B3546Fc0250f285fCc79","0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80","0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1","0x92ff91308F5f1036435f23c2F4F136Bb7475425d","0x9676D55Ccd46ce72235b16bA645008D1D3350B14","0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF","0xE1d32C985825562edAa906fAC39295370Db72195","0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2","via":[]},{"permission":"upgrade","target":"0x235000876bd58336C802B3546Fc0250f285fCc79","via":[]},{"permission":"upgrade","target":"0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80","via":[]},{"permission":"upgrade","target":"0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1","via":[]},{"permission":"upgrade","target":"0x92ff91308F5f1036435f23c2F4F136Bb7475425d","via":[]},{"permission":"upgrade","target":"0x9676D55Ccd46ce72235b16bA645008D1D3350B14","via":[]},{"permission":"upgrade","target":"0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF","via":[]},{"permission":"upgrade","target":"0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B","via":[]},{"permission":"upgrade","target":"0xE1d32C985825562edAa906fAC39295370Db72195","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

```diff
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238","via":[]}]
    }
```

Generated with discovered.json: 0x0c198c0def2d92502a576841ad8a5c77b78a0363

# Diff at Fri, 09 Aug 2024 12:03:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
+        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
      assignedPermissions.upgrade.7:
-        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
+        "0xE1d32C985825562edAa906fAC39295370Db72195"
      assignedPermissions.upgrade.6:
-        "0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"
+        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
      assignedPermissions.upgrade.4:
-        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
+        "0x92ff91308F5f1036435f23c2F4F136Bb7475425d"
      assignedPermissions.upgrade.3:
-        "0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF"
+        "0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"
      assignedPermissions.upgrade.2:
-        "0xE1d32C985825562edAa906fAC39295370Db72195"
+        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
      assignedPermissions.upgrade.1:
-        "0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80"
+        "0x235000876bd58336C802B3546Fc0250f285fCc79"
      assignedPermissions.upgrade.0:
-        "0x235000876bd58336C802B3546Fc0250f285fCc79"
+        "0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2"
    }
```

Generated with discovered.json: 0x7f1bf0cfbd22aee2122754741c7e873764ddcca0

# Diff at Fri, 09 Aug 2024 10:13:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e","0x356000Cec4fC967f8FC372381D983426760A0391","0xB2a5970fB30dc34AD65c914db855766ea62f1f41"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e","0x356000Cec4fC967f8FC372381D983426760A0391","0xB2a5970fB30dc34AD65c914db855766ea62f1f41"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2","0x235000876bd58336C802B3546Fc0250f285fCc79","0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80","0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1","0x92ff91308F5f1036435f23c2F4F136Bb7475425d","0x9676D55Ccd46ce72235b16bA645008D1D3350B14","0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF","0xE1d32C985825562edAa906fAC39295370Db72195","0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B"]
      assignedPermissions.upgrade:
+        ["0x235000876bd58336C802B3546Fc0250f285fCc79","0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80","0xE1d32C985825562edAa906fAC39295370Db72195","0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF","0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2","0x9676D55Ccd46ce72235b16bA645008D1D3350B14","0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B","0x92ff91308F5f1036435f23c2F4F136Bb7475425d","0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1"]
    }
```

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"]
      assignedPermissions.upgrade:
+        ["0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0"]
    }
```

Generated with discovered.json: 0x70f3318df0a0eef88a6ef52907f9b9604e1d9995

# Diff at Tue, 30 Jul 2024 11:17:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 225981159
- current block number: 225981159

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981159 (main branch discovery), not current.

```diff
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xf0ee6b5c575977659b49d2f3bf15e9614d99cb03

# Diff at Tue, 11 Jun 2024 13:36:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b9a39f700e84af1cffa010ce0e20e64b23a4c64 block: 216517911
- current block number: 220744194

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 216517911 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0x24600adb45f0c6eae937f6012d3edc349679be18

# Diff at Thu, 30 May 2024 07:15:16 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8ee20b59ba673583fee7d27bf530e9908ec4d483 block: 214575697
- current block number: 216517911

## Description

EOA removed from executor, Caldera Multisig is now the only upgrade executor.

## Watched changes

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x37918579d1Ef6E5e7D8aF19375dF53c60d790ef6"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 214575697 (main branch discovery), not current.

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.nonce:
-        1
    }
```

Generated with discovered.json: 0xaeff0ff09760399fcb811931e82568d3e968fb35

# Diff at Fri, 24 May 2024 14:47:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ecd40c9c4c424d8e9d4fb926e97ec9da24272f20 block: 213847288
- current block number: 214575697

## Description

Ignored the feeOwner Multisig for the MOLTEN token.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 213847288 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0xFF93c3662B447Ec4577B51b08C6689A5518417D9)
    +++ description: None
```

Generated with discovered.json: 0x88f7271bdc94a8918dadae580fdd5b16a6b44397

# Diff at Wed, 22 May 2024 11:01:31 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 213847288

## Description

Initial discovery: Orbit stack L3 on Arbitrum with AnyTrust DA, custom native token, upgradable by admin EOA and Caldera Multisig.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Molten Token (0x66E535e8D2ebf13F49F3D49e5c50395a97C137b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xFF93c3662B447Ec4577B51b08C6689A5518417D9)
    +++ description: None
```
