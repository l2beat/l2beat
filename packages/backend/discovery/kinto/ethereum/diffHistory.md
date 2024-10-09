Generated with discovered.json: 0xc9ebd71070ff948b0a129e8de7fc00d4f4883ce3

# Diff at Tue, 01 Oct 2024 10:51:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842784
- current block number: 20842784

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842784 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-12T12:55:35.000Z",["0x925eC66892261203536a4aede9CA8e8D0feeA4ad"]],["2024-03-13T12:31:35.000Z",["0x31a20f10c846BD3Ed41c6c05c340bFD7A57ECADA"]],["2024-03-15T01:29:11.000Z",["0xE3641CbDAc5477C350c8FeAAF52Ddc021451A2aA"]],["2024-03-26T06:51:23.000Z",["0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"]],["2024-05-21T00:55:23.000Z",["0x3636617973f25a512676cb06876f0C885568664a"]],["2024-05-22T00:09:11.000Z",["0x0210AE8703F8c9A88D7050825bd8001E359CB4BA"]],["2024-05-22T02:17:11.000Z",["0x270f25127D7C48c956459e113aa81615CC30AeE2"]],["2024-06-22T21:24:59.000Z",["0xEEe82E92bA40A694409B4BDa3D7426188c61163e"]],["2024-07-22T20:12:59.000Z",["0x23559eB4Ad22c31940a929958B104821126F35b7"]],["2024-08-06T21:07:23.000Z",["0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"]],["2024-09-26T17:41:47.000Z",["0x21D3921B50617BDef223207118950B0b577e4007"]]]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]]]
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]],["2024-06-27T16:39:47.000Z",["0x122B88885F1f365B69CAd38B167B039fEd0Ba096"]]]
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]]]
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T03:06:35.000Z",["0xf43bce5D32742FFC862eA182b0b5544CbDBB0F02"]]]
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]]]
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]],["2024-05-03T15:22:59.000Z",["0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"]],["2024-05-08T00:06:47.000Z",["0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"]]]
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T03:06:35.000Z",["0x6525137BfF366fbc0A89E3e5A4d244B5A0090a6D"]]]
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-15T02:37:35.000Z",["0x873484Ba63353C8b71210ce123B465512d408B27"]],["2024-06-27T16:39:47.000Z",["0x57411f5BA52531e8199066bC8EC650470A744883"]]]
    }
```

Generated with discovered.json: 0x3b19a1236807f46f2117249263404871458f5451

# Diff at Fri, 27 Sep 2024 15:14:59 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20756734
- current block number: 20842784

## Description

Bridger upgrade: Formatting, libraries, removal of a USDM curve pool slot and Solv SFT wrapper.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$implementation:
-        "0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"
+        "0x21D3921B50617BDef223207118950B0b577e4007"
      values.$upgradeCount:
-        10
+        11
      values.SOLV_SFT_WRAP_ROUTER:
-        "0x6Ea88D4D0c4bC06F6A51f427eF295c93e10D0b36"
+        "0xe9eD7530427Cb41A56C9e004e00e074cCc168C44"
      values.usdmCurvePool:
-        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../{.flat@20756734 => .flat}/Bridger/Bridger.sol  | 1909 +++-----------------
 1 file changed, 228 insertions(+), 1681 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20756734 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xe37f1f654e8ff1efaa734238d523de5b48be6763

# Diff at Sun, 15 Sep 2024 14:53:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20654590
- current block number: 20756734

## Description

One validator added (funded by kintoxyz.eth), one BridgerOwnerMultisig signer removed.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.setValidatorCount:
-        1
+        2
      values.validators.1:
+        "0x944eB0a2829A859959586b10D54229278534a696"
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.$members.5:
-        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
      values.$members.4:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "0xc31C4549356d46c37021393EeEb6f704B38061eC"
      values.$members.3:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.$members.2:
-        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.$members.1:
-        "0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x6b0d48950c5ffab4b06009b6671f2315fd96d1b6

# Diff at Sun, 01 Sep 2024 08:42:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20484220
- current block number: 20654590

## Description

Using new wasmModuleRoot mapping.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xeb81ebff50359a2acec8320c194a837f9672e694

# Diff at Fri, 30 Aug 2024 07:53:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
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
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x1496ad7673a5d3547a95cfdeba4706a84444cf4a

# Diff at Fri, 23 Aug 2024 09:52:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$upgradeCount:
+        10
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xeaa6de643e6af66cd4217f876215b1d79da67240

# Diff at Wed, 21 Aug 2024 10:03:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82","via":[]}]
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","0x655761AD5FC251F414D6993A73184B0669F278c8","0x7870D5398DB488c669B406fBE57b8d05b6A35e42","0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","via":[]},{"permission":"upgrade","target":"0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","via":[]},{"permission":"upgrade","target":"0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","via":[]},{"permission":"upgrade","target":"0x655761AD5FC251F414D6993A73184B0669F278c8","via":[]},{"permission":"upgrade","target":"0x7870D5398DB488c669B406fBE57b8d05b6A35e42","via":[]},{"permission":"upgrade","target":"0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","via":[]},{"permission":"upgrade","target":"0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","via":[]},{"permission":"upgrade","target":"0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","via":[]},{"permission":"upgrade","target":"0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0f1b7bd7762662B23486320AA91F30312184f70C"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0f1b7bd7762662B23486320AA91F30312184f70C","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74C717C01425eb475A5fC55d2A4a9045fC9800df","via":[]}]
    }
```

Generated with discovered.json: 0x5fd3c00bb4357b64ecd40c9e374080c1d9ce1921

# Diff at Fri, 09 Aug 2024 11:59:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
+        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
      assignedPermissions.upgrade.7:
-        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
+        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      assignedPermissions.upgrade.6:
-        "0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"
+        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
      assignedPermissions.upgrade.5:
-        "0xBFfaA85c1756472fFC37e6D172A7eC0538C14474"
+        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
      assignedPermissions.upgrade.4:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
+        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      assignedPermissions.upgrade.2:
-        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
+        "0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F"
      assignedPermissions.upgrade.1:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
+        "0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"
      assignedPermissions.upgrade.0:
-        "0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB"
+        "0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F"
    }
```

Generated with discovered.json: 0x109d4e2634a7d8f01619e5caf084ca35e1c2640c

# Diff at Fri, 09 Aug 2024 10:09:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20484220
- current block number: 20484220

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20484220 (main branch discovery), not current.

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0x94561e98DD5E55271f91A103e4979aa6C493745E"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"]
      assignedPermissions.upgrade:
+        ["0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11"]
    }
```

```diff
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a","0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","0x655761AD5FC251F414D6993A73184B0669F278c8","0x7870D5398DB488c669B406fBE57b8d05b6A35e42","0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a"]
      assignedPermissions.upgrade:
+        ["0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB","0x7870D5398DB488c669B406fBE57b8d05b6A35e42","0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F","0x655761AD5FC251F414D6993A73184B0669F278c8","0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60","0xBFfaA85c1756472fFC37e6D172A7eC0538C14474","0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a","0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F","0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a"]
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0f1b7bd7762662B23486320AA91F30312184f70C"]
      assignedPermissions.upgrade:
+        ["0x0f1b7bd7762662B23486320AA91F30312184f70C"]
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0x5D973Ea995d14799E528B14472346bfDE21eAe2e","0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x94561e98DD5E55271f91A103e4979aa6C493745E","0xc31C4549356d46c37021393EeEb6f704B38061eC"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x5D973Ea995d14799E528B14472346bfDE21eAe2e","0x78C0Ea07874F4C1Cd97cc14aE343b1ae85982259","0x08E674c4538caE03B6c05405881dDCd95DcaF5a8","0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B","0x94561e98DD5E55271f91A103e4979aa6C493745E","0xc31C4549356d46c37021393EeEb6f704B38061eC"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x5358410234a44c12d83a38d894732c1ce46d329c

# Diff at Thu, 08 Aug 2024 13:39:47 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@55033526285d11b30f44e7cea5874c4f4d65ed80 block: 20383066
- current block number: 20484220

## Description

Users can deposit stUSD from Arbitrum on Kinto, they've added new logic to swap this to USDC or USDA before bridging.
Now using 0x AllowanceHolder contract to set allowances for token swap.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$implementation:
-        "0x23559eB4Ad22c31940a929958B104821126F35b7"
+        "0x47e28e296BE2EE69b4579d5eecbABA38217a2b03"
      values.swapRouter:
-        "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"
+        "0x0000000000001fF3684f28c67538d4D072C22734"
      values.angleSwapper:
+        "0xD253b62108d1831aEd298Fc2434A5A8e4E418053"
      values.stUSD:
+        "0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776"
      values.USDA:
+        "0x0000206329b97DB379d5E1Bf586BbDB969C63274"
    }
```

## Source code changes

```diff
.../{.flat@20383066 => .flat}/Bridger/Bridger.sol  | 31 ++++++++++++++++++++--
 1 file changed, 29 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x21d17cece14cfa4ac60bf5716ed635ed9071d73c

# Diff at Tue, 30 Jul 2024 11:12:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20383066
- current block number: 20383066

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20383066 (main branch discovery), not current.

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xa42788482c8e1ace73e574337062d675b58d5479

# Diff at Thu, 25 Jul 2024 10:48:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@42efd1ab55ccb369bfc0edad188854abb104aaef block: 20367973
- current block number: 20383066

## Description

Kinto sends blobs, tracked txs added.

## Watched changes

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.postsBlobs:
-        false
+        true
    }
```

Generated with discovered.json: 0x9590eb8caf62006f1a01c0e27a62734ce8c11f6c

# Diff at Tue, 23 Jul 2024 08:16:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a7fe674fdf7aafe1f69f1463836cac0d7e337d34 block: 20362833
- current block number: 20367973

## Description

The bridger (gateway) is upgraded to support a new asset (solvBTC) which can be wrapped from WBTC.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      values.$implementation:
-        "0xEEe82E92bA40A694409B4BDa3D7426188c61163e"
+        "0x23559eB4Ad22c31940a929958B104821126F35b7"
      values.SOLV_BTC:
+        "0x3647c54c4c2C65bC7a2D63c0Da2809B399DBBDC0"
      values.SOLV_BTC_POOL_ID:
+        "0x488def4a346b409d5d57985a160cd216d29d4f555e1b716df4e04e2374d2d9f6"
      values.SOLV_SFT_WRAP_ROUTER:
+        "0x6Ea88D4D0c4bC06F6A51f427eF295c93e10D0b36"
      values.WBTC:
+        "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
    }
```

## Source code changes

```diff
.../{.flat@20362833 => .flat}/Bridger/Bridger.sol  | 54 +++++++++++++++++-----
 1 file changed, 42 insertions(+), 12 deletions(-)
```

Generated with discovered.json: 0x87c5c2e00532cf5609ebd2a87ccf20e1d7afef8c

# Diff at Fri, 19 Jul 2024 08:55:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e818aac724e8e67da6b05262134684a79d6fb217 block: 20324731
- current block number: 20339515

## Description

wasmModuleRoot updated. Like before, this is not a root that we have seen before. Related to the [HF 5 Mainnet](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/6) and [HF 6 Mainnet](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/9).

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x89e305433a6403ac5e73b659b16ccaa2ed796cf6cd6fcb46e72c7d865a8ec6ae"
+        "0x2ca63ffd73f314d60f8d672954389881918100435f27fd4193becb12310d7faa"
    }
```

Generated with discovered.json: 0xf35de91de6d8a18812a6d9c106abeff0880f2aef

# Diff at Wed, 17 Jul 2024 07:24:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f46e1b9319335587ca32b6e85f9d2f0c7ab7a729 block: 20210980
- current block number: 20324731

## Description

Use the new handler to check if it's posting blobs.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20210980 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      values.postsBlobs:
+        false
    }
```

Generated with discovered.json: 0xbb4b529ff5b280dc70aa4cf09e5651f5f00363fb

# Diff at Mon, 01 Jul 2024 10:10:33 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@0e7b6918e773793a1ad0061ea07b42646c37a13d block: 20177353
- current block number: 20210980

## Description

ChallengeManager.sol: added function to make challengeManager aware of the new OneStepProver contracts after updating to 4844.

OneStepProverHostIo.sol: added support for reading preimage from blobs.

SequencerInbox.sol: Added support for blobs posting (addSequencerL2BatchFromBlobs), and a for a batch poster manager that has the ability to change the batch poster addresses.

It is not posting data to blobs yet.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x6948185c62070f9523a93664e8d064627f65830fd308af5e82f21292a2060fb8"
+        "0x89e305433a6403ac5e73b659b16ccaa2ed796cf6cd6fcb46e72c7d865a8ec6ae"
    }
```

```diff
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    +++ description: None
      upgradeability.implementation:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x122B88885F1f365B69CAd38B167B039fEd0Ba096"
      implementations.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x122B88885F1f365B69CAd38B167B039fEd0Ba096"
      values.osp:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0x8B02a8B985a81f96e49B8289FF60847FC6020e51"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    +++ description: None
      upgradeability.implementation:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x57411f5BA52531e8199066bC8EC650470A744883"
      implementations.0:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x57411f5BA52531e8199066bC8EC650470A744883"
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        false
      values.reader4844:
+        "0x434345973Ebf8249398E1EeB03A62bE418B48a05"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
+   Status: CREATED
    contract  (0x434345973Ebf8249398E1EeB03A62bE418B48a05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x6c4322e9A0478CA7aDd30e561f96af379D3A22Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x76f72B8eFDA2DCDD3fB5A8c16d576c25eD43D645)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x8B02a8B985a81f96e49B8289FF60847FC6020e51)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xba9D43FA3576bc40f13cb0731D770d1e510EdE46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf09Bc0285055BEA82165cA3F54054aa88BB3C169)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

Generated with discovered.json: 0xd28981bbb340b8d7f4a0a3cc529555b09df580e4

# Diff at Mon, 24 Jun 2024 08:19:51 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b54e27671cccd831f2f6414fffe3bd374840c6b7 block: 19976230
- current block number: 20160306

## Description

The Bridger (Gateway) contract is upgraded to support new assets (USDM) and deposit by PERMIT2 (`depositPermit2()` function). USDM is now also a supported finalAsset (outcoming asset) for swapping through the Bridger.

The Socket escrow for USDM is not yet used and will be added as soon as it has TVL.



## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.implementation:
-        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
+        "0xEEe82E92bA40A694409B4BDa3D7426188c61163e"
      implementations.0:
-        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
+        "0xEEe82E92bA40A694409B4BDa3D7426188c61163e"
      values.l2Vault:
-        "0x26181Dfc530d96523350e895180b09BAf3d816a0"
      values.PERMIT2:
+        "0x000000000022D473030F116dDEE9F6B43aC78BA3"
      values.USDC:
+        "0x0000000000000000000000000000000000000000"
      values.USDM:
+        "0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C"
      values.usdmCurvePool:
+        "0x0000000000000000000000000000000000000000"
      values.wUSDM:
+        "0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812"
    }
```

## Source code changes

```diff
.../{.flat@19976230 => .flat}/Bridger/Bridger.sol  | 439 +++++++++++++++++----
 1 file changed, 359 insertions(+), 80 deletions(-)
```

Generated with discovered.json: 0x8ab0d2106a1286e919f74644647a18bfdb886090

# Diff at Wed, 29 May 2024 14:51:45 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19929993
- current block number: 19976230

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19929993 (main branch discovery), not current.

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82"
    }
```

Generated with discovered.json: 0x5bb6fb6f0a3145d9c836665d91d5d854ec30ae16

# Diff at Wed, 22 May 2024 15:45:03 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d8b1d401a7eb2fd4dbc2edda92ae733061915c30 block: 19919191
- current block number: 19926394

## Description

The Bridger is upgraded to a new implementation. Currently there are no funds in it as the prelaunch-farm (Engen) has concluded and assets were [bridged](https://etherscan.io/tx/0xbbdbbf2f7ddd1ac994d9a96b2da163e72339866dee3dbac7004fe4a64ee26f92) via socket to the Kinto L2.

### Bridger.sol

The logic of the Bridger is still a Gateway contract to the Kinto L2. As the prelaunch phase has concluded, ERC-20 tokens can now be deposited to the Bridger and are bridged directly to the L2, so the Bridger will not escrow assets anymore. It also now uses a 0x exchange proxy to swap into 'final assets' before depositing. Final assets for Kinto can be defined by the depositer and can also be the inputAsset, in which case no swap is performed and the asset is bridged directly. The bridge address is supplied with the call to `depositERC20()`.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.implementation:
-        "0x3636617973f25a512676cb06876f0C885568664a"
+        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
      implementations.0:
-        "0x3636617973f25a512676cb06876f0C885568664a"
+        "0x270f25127D7C48c956459e113aa81615CC30AeE2"
      values.exchangeProxy:
-        "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"
      values.sDAI:
-        "0x83F20F44975D03b1b09e64809B757c47f942BEeA"
      values.swapsEnabled:
-        true
      values.weETH:
-        "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee"
      values.swapRouter:
+        "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"
    }
```

```diff
-   Status: DELETED
    contract ZeroEx (0xDef1C0ded9bec7F1a1670819833240f027b25EfF)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@19919191 => .flat}/Bridger/Bridger.sol  | 1090 ++++++++++----------
 .../.flat@19919191/ZeroEx.sol => /dev/null         |  729 -------------
 2 files changed, 532 insertions(+), 1287 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19919191 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract ZeroEx (0xDef1C0ded9bec7F1a1670819833240f027b25EfF)
    +++ description: None
```

Generated with discovered.json: 0x1db08e3c132170b88ae88bdd175985aafd322d25

# Diff at Tue, 21 May 2024 15:32:00 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d10db8000986dcc20fb2efb94c0e0636ac38fa21 block: 19888796
- current block number: 19919191

## Description

The Bridger contract (pre-launch escrow for Kinto) is upgraded: The hardcoded orbitstack-native bridges are removed and the bridgeDeposits() function is modified to allow bridging via arbitrary bridges. Kinto will use socket as an external bridge for their L2 and the assets currently locked in the Bridger contract.

## Watched changes

```diff
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C) {
    +++ description: None
      upgradeability.implementation:
-        "0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"
+        "0x3636617973f25a512676cb06876f0C885568664a"
      implementations.0:
-        "0x989b9f407687DA3050C957CfeF5E6c18BeE7cb9F"
+        "0x3636617973f25a512676cb06876f0C885568664a"
      values.L1GatewayRouter:
-        "0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60"
      values.standardGateway:
-        "0x7870D5398DB488c669B406fBE57b8d05b6A35e42"
      derivedName:
-        "BridgerV4"
+        "Bridger"
    }
```

## Source code changes

```diff
.../BridgerV4.sol => .flat/Bridger/Bridger.sol}    | 5518 ++++++++++----------
 1 file changed, 2757 insertions(+), 2761 deletions(-)
```

Generated with discovered.json: 0x76f1e50a00a33e6f1eb3cc4ddf6d1768e457194b

# Diff at Fri, 17 May 2024 09:28:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cf6498d339a075296e717008e17a69561c236726 block: 19883606
- current block number: 19888796

## Description

The wasmModuleRoot changes to a new value (which is not known in our ArbOS history). Looking at the Kinto Github repo, this is the [Hardfork #4 upgrade](https://github.com/ConstellationCrypto/kinto-go-ethereum/pull/4).
Changes are mainly related to the integration of the Socket bridge contracts in preparation for the May 22nd 'full mainnet launch'.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf456393bd4b205d2f7b147d355c42ba852ff31527380884720bb4059ae731169"
+        "0x6948185c62070f9523a93664e8d064627f65830fd308af5e82f21292a2060fb8"
    }
```

Generated with discovered.json: 0xd5b099929f8b81f2ec7e02982922564807216015

# Diff at Thu, 16 May 2024 06:39:47 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@814c482c2be2428b2782bc85afecccac8c999b5e block: 19830808
- current block number: 19880804

## Description

New signer added to the ExecutorMultisig (Rollup owner): `0x08E674c4538caE03B6c05405881dDCd95DcaF5a8`

## Watched changes

```diff
    contract ExecutorMultisig (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 4 (75%)"
+        "3 of 5 (60%)"
      values.getOwners.4:
+        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
      values.getOwners.3:
-        "0x94561e98DD5E55271f91A103e4979aa6C493745E"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.getOwners.2:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.getOwners.1:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
      values.getOwners.0:
-        "0xc1f4D15C16A1f3555E0a5F7AeFD1e17AD4aaf40B"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
    }
```

Generated with discovered.json: 0x7b73332ba44977745e2bfdaabbe0a1aaf9f426ed

# Diff at Thu, 09 May 2024 06:51:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3bba0812727b9105a3f44fe55a68572c804b992 block: 19809397
- current block number: 19830808

## Description

The Inbox contract is upgraded with a minor change:

The l2AllowList that gets checked by the `whenRefundAddressAllowed` modifier is now settable by the owner or rollup contract whereas it was hardcoded before.

## Watched changes

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      upgradeability.implementation:
-        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
+        "0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"
      implementations.0:
-        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
+        "0xc235c5194f2404234fc7C99b4dd15289BB735Cf5"
    }
```

## Source code changes

```diff
.../Inbox/implementation/meta.txt                       |  2 +-
 .../src/nitro-contracts/bridge/AbsInbox.sol             | 17 +++++++++--------
 .../implementation/src/nitro-contracts/bridge/Inbox.sol |  1 -
 3 files changed, 10 insertions(+), 10 deletions(-)
```

Generated with discovered.json: 0x94bafe549ae45883fd41860a1577ce9a7ed8a42c

# Diff at Mon, 06 May 2024 06:56:42 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@91ddfe46c9a8cff7aff522924d50fd166a15932b block: 19776768
- current block number: 19809397

## Description

The Inbox implementation is upgraded with very minor changes:
- Modifier `whenRefundAddressAllowed` added (ensures that both `excessFeeRefundAddress` and `callValueRefundAddress` match the msg.sender unless they are whitelisted in `isAllowed`)
- `whenRefundAddressAllowed` is used by `createRetryableTicket()` and `createUnsafeRetryableTicket()`
- Formatting and import folder structure

## Watched changes

```diff
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    +++ description: None
      upgradeability.implementation:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
      implementations.0:
-        "0x1162084C3C6575121146582Db5BE43189e8CEe6b"
+        "0x518465d9f81bDE1e573f9bD2a6761F8ADaAFe73e"
    }
```

## Source code changes

```diff
.../proxy/utils/Initializable.sol => /dev/null     |  80 ------
 .../lib/nitro-contracts}/src/bridge/IBridge.sol    |  22 ++
 .../src/bridge/IDelayedMessageProvider.sol         |   0
 .../lib/nitro-contracts}/src/bridge/IEthBridge.sol |   0
 .../lib/nitro-contracts}/src/bridge/IInbox.sol     |   0
 .../lib/nitro-contracts}/src/bridge/IInboxBase.sol |   0
 .../lib/nitro-contracts}/src/bridge/IOwnable.sol   |   0
 .../src/bridge/ISequencerInbox.sol                 |  91 +++++--
 .../src/libraries/AddressAliasHelper.sol           |   0
 .../src/libraries/DelegateCallAware.sol            |   0
 .../lib/nitro-contracts}/src/libraries/Error.sol   |  27 +-
 .../nitro-contracts/src/libraries/IGasRefunder.sol |  14 +
 .../src/libraries/MessageTypes.sol                 |   0
 .../nitro-contracts}/src/precompiles/ArbSys.sol    |   0
 .../contracts/proxy/utils/Initializable.sol        | 166 ++++++++++++
 .../contracts}/security/PausableUpgradeable.sol    |  34 ++-
 .../contracts}/utils/AddressUpgradeable.sol        |  74 ++++--
 .../contracts}/utils/ContextUpgradeable.sol        |   0
 .../contracts}/utils/StorageSlotUpgradeable.sol    |  60 ++++-
 .../Inbox/implementation/meta.txt                  |   2 +-
 .../src/libraries/IGasRefunder.sol => /dev/null    |  39 ---
 .../src/nitro-contracts}/bridge/AbsInbox.sol       | 199 +++++++--------
 .../src/nitro-contracts}/bridge/Inbox.sol          | 281 ++++++++++-----------
 23 files changed, 651 insertions(+), 438 deletions(-)
```

Generated with discovered.json: 0x4c11e99e03b2ae08fd367a9e6d1d673f2cfe3fff

# Diff at Wed, 01 May 2024 17:27:29 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7dc564dd4cc2215657e1e7bd8648e6b99a23a992 block: 19624549
- current block number: 19776768

## Description

One signer of the BridgerOwnerMultisig is replaced.

## Watched changes

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.getOwners.2:
-        "0xA20684BE1d0f5Ef96F8771A747fe5861D3F0FA07"
+        "0x08E674c4538caE03B6c05405881dDCd95DcaF5a8"
    }
```

Generated with discovered.json: 0x68af6aeb80b2dc820bf7190868730a2f8750fb79

# Diff at Wed, 03 Apr 2024 14:05:05 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@66b605e31075e304396e566f31130e883d656762 block: 19531637
- current block number: 19575719

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: None
      values.wasmModuleRoot:
-        "0xd2d42f1e7b5ea262991c3fd1fc7ed3dde4b21c28d3a7edec49f7c4fb51c03f73"
+        "0xf456393bd4b205d2f7b147d355c42ba852ff31527380884720bb4059ae731169"
    }
```

```diff
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82) {
    +++ description: None
      values.nonce:
-        70
+        71
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531637 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "ExecutorMultisig"
      values.nonce:
-        3
    }
```

```diff
+   Status: CREATED
    contract Bridger (0x0f1b7bd7762662B23486320AA91F30312184f70C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x7870D5398DB488c669B406fBE57b8d05b6A35e42)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xD9041DeCaDcBA88844b373e7053B4AC7A3390D60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgerOwnerMultisig (0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82)
    +++ description: None
```

Generated with discovered.json: 0x53029a74a02a35a658c77a12c8fb1aed6b7fee64

# Diff at Thu, 28 Mar 2024 09:12:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19432708
- current block number: 19531637

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19432708 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x2a8f9804aa4d0e1c2654291b4dc0c829b5c12d40

# Diff at Thu, 14 Mar 2024 10:39:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@24c5721630392f8b6f59093376472db03d18b2c2 block: 19339792
- current block number: 19432708

## Description

Upgrade: Changed WASM module root hash of the RollupProxy contract.
Context: Kinto is currently in review.

## Watched changes

```diff
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    +++ description: None
      values.nonce:
-        2
+        3
    }
```

```diff
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    +++ description: None
      values.wasmModuleRoot:
-        "0x1024d5971f781dd930c46b5fb6fb571e6af9f31b5dc191b82e82036c207cc968"
+        "0xd2d42f1e7b5ea262991c3fd1fc7ed3dde4b21c28d3a7edec49f7c4fb51c03f73"
    }
```

Generated with discovered.json: 0x6bf630000a540615c26b6e131a88c1214fde842c

# Diff at Fri, 01 Mar 2024 10:41:16 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19339792

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x17Eb10e12a78f986C78F973Fc70eD88072B33B7d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x52EcE832AF3DF3125BbfD6423E0425dB3fA99D3F) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x59B851c8b1643e0735Ec3F2f0e528f3d89c3408a) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x6228e2FB8C561f1a5A963039Bc38Eb6D539A1A7F) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x655761AD5FC251F414D6993A73184B0669F278c8) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x74C717C01425eb475A5fC55d2A4a9045fC9800df) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xBFfaA85c1756472fFC37e6D172A7eC0538C14474) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xF4Ef823D57819AC7202a081A5B49376BD28E7b3a) {
    }
```
