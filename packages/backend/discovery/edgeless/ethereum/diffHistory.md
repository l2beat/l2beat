Generated with discovered.json: 0xd95e04e8f33d8addf6aaf80373b407f19d99d992

# Diff at Tue, 01 Oct 2024 10:51:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842587
- current block number: 20842587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842587 (main branch discovery), not current.

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-21T22:38:59.000Z",["0x121892C0620E349723dfd3E1535cD668CD414dfD"]]]
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x19431dc37098877486532250FB3158140717C00C"]]]
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:59.000Z",["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]]]
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]]
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-21T22:39:23.000Z",["0xE4E2BBaCAb9bE9258D7cf3eF9D993cfA81a55356"]]]
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]]]
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:59.000Z",["0x688c7b64776421668a91Ed4D23554d78626c8E69"]]]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:59.000Z",["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]]]
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-24T07:16:11.000Z",["0xfF03657dCe3c3EAE996Bf82fD41572D47D049747"]]]
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-21T22:39:59.000Z",["0xaD69577988FD1fF2F265C0B46E45fbC722F4Cf4c"]]]
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]]]
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x873484Ba63353C8b71210ce123B465512d408B27"]]]
    }
```

Generated with discovered.json: 0xe1624081c5527701dc14035960585b6ecb14985f

# Diff at Fri, 27 Sep 2024 14:36:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20583954
- current block number: 20842587

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583954 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x442c8408e7f3d863f8dd0e28bf4a02a1fb0471e1

# Diff at Sun, 01 Sep 2024 08:44:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20583954
- current block number: 20583954

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583954 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
+        "ArbOS v11.1 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xc3a6477e24d09efc9815b42caa67a39295b9b063

# Diff at Fri, 30 Aug 2024 07:52:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20583954
- current block number: 20583954

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583954 (main branch discovery), not current.

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      receivedPermissions.9.via:
-        []
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
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
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
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xe4f0454b71485d75b4e952e6d2d3bceb4b4c91af

# Diff at Fri, 23 Aug 2024 09:52:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20583954
- current block number: 20583954

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583954 (main branch discovery), not current.

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x7c6e21bcaa06a1abcbe3ba796420b651e7919971

# Diff at Thu, 22 Aug 2024 11:51:34 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 20525344
- current block number: 20583954

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20525344 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBL4joOU9aS9yzzZL/uE5mvNkreZ1bz331f4bv8mEqfsvCxuG47A9V5948qg/7skexRhdRYgoiIqMyuiIl0LeFyeUCmcD9BXhi7lco4q5PzJHaHHHxnJofKncKT5wMziqBkzFLoIWLXhoE6j8BOUfOX7EQqnOCSJjqq7hnj7o307gKWrNw63l9XD4Aulzw+MoxTzxDEL8CLA71jp+2d6r6lesVtk4+IAd4CLOgysC0hJhSyRajOlq/r0LKtgFs7NNwMuFf8pzp6DHy7QirCbP1KOtDE813xW3lt2tEL0tb3kWbQUasHSPdsPYFS8v21RXg7Htow2LF7asLJtYnKmzGEN2D4pJq5+hJbJxATrO7aq3XrctjBLSWhrtIwjIVcNwg=="]
    }
```

Generated with discovered.json: 0x66d33384f719296a382ae511ccfc3184ec4fe4ec

# Diff at Wed, 21 Aug 2024 10:02:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20525344
- current block number: 20525344

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20525344 (main branch discovery), not current.

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5e8749760c5051fF80b73319cCf4d05ef9959563","0x6B595398152999bBc759D5D8ed8169793F915488","0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","0x893057442A952E3254CA53d007AD6BBB502f557e","0x99790790B030CF116efed1c7577e2262072EfCc9","0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","0xc213d433802ea473e23623476b26FB12e9B4eFe6","0xf51551afD112a50Fc5EDa0454111078fE6E6096E"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5e8749760c5051fF80b73319cCf4d05ef9959563","via":[]},{"permission":"upgrade","target":"0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","via":[]},{"permission":"upgrade","target":"0x6B595398152999bBc759D5D8ed8169793F915488","via":[]},{"permission":"upgrade","target":"0x893057442A952E3254CA53d007AD6BBB502f557e","via":[]},{"permission":"upgrade","target":"0x99790790B030CF116efed1c7577e2262072EfCc9","via":[]},{"permission":"upgrade","target":"0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","via":[]},{"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","via":[]},{"permission":"upgrade","target":"0xf51551afD112a50Fc5EDa0454111078fE6E6096E","via":[]},{"permission":"upgrade","target":"0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","via":[]},{"permission":"upgrade","target":"0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","via":[]}]
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","0x7E0bc314535f430122caFEF18eAbd508d62934bf","0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","via":[]},{"permission":"upgrade","target":"0x7E0bc314535f430122caFEF18eAbd508d62934bf","via":[]},{"permission":"upgrade","target":"0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","via":[]},{"permission":"upgrade","target":"0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b","via":[]}]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x890025891508a463A636f81D2f532a97210240de"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x890025891508a463A636f81D2f532a97210240de","via":[]}]
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

Generated with discovered.json: 0xf68de6fda4db9aeaadbbad8a5d10b29255daddd8

# Diff at Wed, 14 Aug 2024 07:23:14 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e32dcc268a9af9f45ad205490c9d650c487e04f1 block: 20318530
- current block number: 20525344

## Description

The EOA that was able to execute upgrades was removed. Now there's only the 3/4 multisig left.

## Watched changes

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xa43ce4721Ac0faB33E8636e0DDB55E76e3EFF461"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
    }
```

Generated with discovered.json: 0x7458ebca3950e7d7a4d2441bdab89761c5e16de1

# Diff at Fri, 09 Aug 2024 11:59:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20318530
- current block number: 20318530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20318530 (main branch discovery), not current.

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      assignedPermissions.upgrade.9:
-        "0x893057442A952E3254CA53d007AD6BBB502f557e"
+        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
      assignedPermissions.upgrade.8:
-        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      assignedPermissions.upgrade.7:
-        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
+        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
      assignedPermissions.upgrade.5:
-        "0x6B595398152999bBc759D5D8ed8169793F915488"
+        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
      assignedPermissions.upgrade.4:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x99790790B030CF116efed1c7577e2262072EfCc9"
      assignedPermissions.upgrade.3:
-        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
+        "0x893057442A952E3254CA53d007AD6BBB502f557e"
      assignedPermissions.upgrade.2:
-        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
+        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
      assignedPermissions.upgrade.1:
-        "0x99790790B030CF116efed1c7577e2262072EfCc9"
+        "0x6B595398152999bBc759D5D8ed8169793F915488"
      assignedPermissions.upgrade.0:
-        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
+        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227"
+        "0x7E0bc314535f430122caFEF18eAbd508d62934bf"
      assignedPermissions.upgrade.0:
-        "0x7E0bc314535f430122caFEF18eAbd508d62934bf"
+        "0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227"
    }
```

Generated with discovered.json: 0x6904195e587c378f852b66fd64ec149869508185

# Diff at Fri, 09 Aug 2024 10:09:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20318530
- current block number: 20318530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20318530 (main branch discovery), not current.

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5e8749760c5051fF80b73319cCf4d05ef9959563","0x6B595398152999bBc759D5D8ed8169793F915488","0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","0x893057442A952E3254CA53d007AD6BBB502f557e","0x99790790B030CF116efed1c7577e2262072EfCc9","0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","0xc213d433802ea473e23623476b26FB12e9B4eFe6","0xf51551afD112a50Fc5EDa0454111078fE6E6096E"]
      assignedPermissions.upgrade:
+        ["0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","0x99790790B030CF116efed1c7577e2262072EfCc9","0xf51551afD112a50Fc5EDa0454111078fE6E6096E","0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","0xc213d433802ea473e23623476b26FB12e9B4eFe6","0x6B595398152999bBc759D5D8ed8169793F915488","0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","0x5e8749760c5051fF80b73319cCf4d05ef9959563","0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","0x893057442A952E3254CA53d007AD6BBB502f557e"]
    }
```

```diff
    contract ExecutorMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0xA61A62352FAF6AD883A8D36975cf39cDEB477D25","0xC616EA9D34ec12D6879A9DE7910CA9Bf5f28C9E7"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0xA61A62352FAF6AD883A8D36975cf39cDEB477D25","0xC616EA9D34ec12D6879A9DE7910CA9Bf5f28C9E7"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","0x7E0bc314535f430122caFEF18eAbd508d62934bf","0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"]
      assignedPermissions.upgrade:
+        ["0x7E0bc314535f430122caFEF18eAbd508d62934bf","0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"]
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x890025891508a463A636f81D2f532a97210240de"]
      assignedPermissions.upgrade:
+        ["0x890025891508a463A636f81D2f532a97210240de"]
    }
```

Generated with discovered.json: 0x0c9702e1fa67068c11beb0c68343eb720b10fa4f

# Diff at Tue, 30 Jul 2024 11:11:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20318530
- current block number: 20318530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20318530 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0x851dddada727016068d89b57be2a2b27fd730c3c

# Diff at Tue, 16 Jul 2024 10:40:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20318530

## Description

Orbit chain with investment strategies baked in the deposit contract.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227)
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
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExecutorMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9)
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
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WrappedToken (0xcD0aa40948c662dEDd9F157085fd6369A255F2f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086)
    +++ description: State batches / commitments get posted here.
```
