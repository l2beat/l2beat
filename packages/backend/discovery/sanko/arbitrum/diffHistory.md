Generated with discovered.json: 0x75d47a0556cc401ed7f7dbc3eafd6a8c8334e173

# Diff at Tue, 01 Oct 2024 15:47:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 257934843
- current block number: 259311792

## Description

Upgrade of SequencerInbox and OSP to newer versions that are known from other orbit chains. No overall logic / config changes.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615)
    +++ description: None
```

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      values.$implementation:
-        "0x935239e066F4F449D87D600e6d7c1a4F24c50f97"
+        "0x63AB51383384a09734b8B8F6646647213bdD54aC"
      values.$pastUpgrades.1:
+        ["2024-09-30T15:15:30.000Z",["0x63AB51383384a09734b8B8F6646647213bdD54aC"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4"
+        "0xc78778b1D7416FB8211e864dBA3e277DF39f2c71"
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      values.$implementation:
-        "0x1d182075d07744D71E37f77f1654165f6DAFad08"
+        "0x083c2b4D0C745224E8E484Dfd41eDC9b19f21Feb"
      values.$pastUpgrades.1:
+        ["2024-09-30T15:15:30.000Z",["0x083c2b4D0C745224E8E484Dfd41eDC9b19f21Feb"]]
      values.$upgradeCount:
-        1
+        2
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
+        [17280,48,86400,3600]
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
+        "0x0000000000000000000000000000000000000000"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x19c077b3269D988f87DBe3E0FAE2937a3aA37De4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x6322893cf9Eb2A7cF5A2C34bd7cC77064e8fB9BE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xc78778b1D7416FB8211e864dBA3e277DF39f2c71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xdeC2bEA51D608C1Fb2cCBC4F654eE0ffF848A73d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xF0981852f26053B6506582f819b54cF2DD6b8cC3)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257934843 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]]]
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0x1d182075d07744D71E37f77f1654165f6DAFad08"]]]
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0xC5Db571093C4600559e239497d147476F7543b15"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0xf2bCB26dbb571EBC82CFAe6453AeF0DE90d93421"]]]
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0xCa2F31F3C6553c2FD9897f7AA464406a431959A9"]]]
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0x2675b9DEb473ECaC13ddd71dF8A0Ef13FeF6a75D"]]]
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]]]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:50:11.000Z",["0x922db00d292477AD99Ef8A0c41101a664Ee79D2b"]]]
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:50:11.000Z",["0x652F65f950b71d7aD04AffB1725F43786ed5f6Cc"]],["2024-04-26T01:40:32.000Z",["0xF5CE2B2a046f5C5440506F76d512375fdB301BCa"]]]
    }
```

Generated with discovered.json: 0xdefe742156380a642fd956abd8d242a3e8c303c9

# Diff at Fri, 27 Sep 2024 15:35:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 251657470
- current block number: 257934843

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 251657470 (main branch discovery), not current.

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x74b0beb0abc992d417da24b1ff59a3d9ceb344f1

# Diff at Mon, 09 Sep 2024 08:41:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 245517194
- current block number: 251657470

## Description

Caldera MS removed, replaced with Sanko MS. 

## Watched changes

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
    }
```

```diff
+   Status: CREATED
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafeL2 => .flat/Sanko Multisig}/GnosisSafeL2.sol                | 0
 .../GnosisSafeL2 => .flat/Sanko Multisig}/GnosisSafeProxy.p.sol           | 0
 2 files changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245517194 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      name:
-        "Caldera Multisig"
+        "GnosisSafeL2"
    }
```

Generated with discovered.json: 0xb5b2f9e2382bd174b88d32f20268a9fd54527f71

# Diff at Sun, 01 Sep 2024 08:47:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 245517194
- current block number: 245517194

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245517194 (main branch discovery), not current.

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "ArbOS v20 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xc08a0d9fd89c733b1d8bac192fea931a191d1775

# Diff at Fri, 30 Aug 2024 08:06:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 245517194
- current block number: 245517194

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245517194 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
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

Generated with discovered.json: 0x8e2926a79308fc7816dd77e1498aadb82ef7eced

# Diff at Fri, 23 Aug 2024 09:57:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 245517194
- current block number: 245517194

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245517194 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xc77904e8ef816c1aa450a3fcf65347323acdae8e

# Diff at Thu, 22 Aug 2024 11:49:26 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 225981699
- current block number: 245517194

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBM8WH8fzFQs+IXcFMBei3c0fIp6lNYHAw/kaFJEygDiksyqeAE8rWf9HA5OoHsDVwOYrnfZkCSfRjlLEtBaTLPJaU4OfE2N0XzEuRdxmwEVPRO8Ju8IlyFtNyIBAKq3DwF4EqTAXqxCxd05xmmFGkPNkmF6206kv7VGp0cXmEinXf5so12V3pnb+pePP3e3pRhRfu19/rZzXtMJNE55U37hH3VFCC+y13NNoeNqQztRRsroRtQQ9czMa042Zwd0BRluNTa40csEMom/D0Y6o/4cMf7At3G6VYIGy7z/0twDSmhRVXe2xpVJqbxEsTkdyxRPFelDCvZeylRxtN9NHo+BXbvoBUToQDeizLpx2f1hdlggZUI4y+QIN/VJ6h0x3A=="]
    }
```

Generated with discovered.json: 0xeec169759f57f04759521544c5b81c1001656759

# Diff at Wed, 21 Aug 2024 10:07:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4","via":[]}]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","via":[]}]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1f269F38196484ef81e58C0144AaD2c5F6394bB4","0x24B68936C13A414cd91437aE7AA730321B9ff159","0x2f285781B8d58678a3483de52D618198E4d27532","0x365ce7234CE515c2e0139f3578b6c5989da1a863","0x575d32f7ff0C72921645e302cb14d2757E300786","0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","0xb4951c0C41CFceB0D195A95FE66280457A80a990"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1f269F38196484ef81e58C0144AaD2c5F6394bB4","via":[]},{"permission":"upgrade","target":"0x24B68936C13A414cd91437aE7AA730321B9ff159","via":[]},{"permission":"upgrade","target":"0x2f285781B8d58678a3483de52D618198E4d27532","via":[]},{"permission":"upgrade","target":"0x365ce7234CE515c2e0139f3578b6c5989da1a863","via":[]},{"permission":"upgrade","target":"0x575d32f7ff0C72921645e302cb14d2757E300786","via":[]},{"permission":"upgrade","target":"0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","via":[]},{"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","via":[]},{"permission":"upgrade","target":"0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","via":[]},{"permission":"upgrade","target":"0xb4951c0C41CFceB0D195A95FE66280457A80a990","via":[]}]
    }
```

Generated with discovered.json: 0x17ac8a625d8cf7d8442095aae327f6eefb847783

# Diff at Fri, 09 Aug 2024 12:03:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
+        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
      assignedPermissions.upgrade.7:
-        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
+        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
      assignedPermissions.upgrade.5:
-        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
+        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
      assignedPermissions.upgrade.4:
-        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
+        "0x575d32f7ff0C72921645e302cb14d2757E300786"
      assignedPermissions.upgrade.3:
-        "0x575d32f7ff0C72921645e302cb14d2757E300786"
+        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
      assignedPermissions.upgrade.2:
-        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
+        "0x2f285781B8d58678a3483de52D618198E4d27532"
      assignedPermissions.upgrade.1:
-        "0x2f285781B8d58678a3483de52D618198E4d27532"
+        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
      assignedPermissions.upgrade.0:
-        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
+        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
    }
```

Generated with discovered.json: 0x1c5e2ffa8aba3e9f8f984b010b0cd98e616488b0

# Diff at Fri, 09 Aug 2024 10:13:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

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
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"]
      assignedPermissions.upgrade:
+        ["0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"]
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1f269F38196484ef81e58C0144AaD2c5F6394bB4","0x24B68936C13A414cd91437aE7AA730321B9ff159","0x2f285781B8d58678a3483de52D618198E4d27532","0x365ce7234CE515c2e0139f3578b6c5989da1a863","0x575d32f7ff0C72921645e302cb14d2757E300786","0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","0xb4951c0C41CFceB0D195A95FE66280457A80a990"]
      assignedPermissions.upgrade:
+        ["0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","0x2f285781B8d58678a3483de52D618198E4d27532","0xb4951c0C41CFceB0D195A95FE66280457A80a990","0x575d32f7ff0C72921645e302cb14d2757E300786","0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","0x365ce7234CE515c2e0139f3578b6c5989da1a863","0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","0x24B68936C13A414cd91437aE7AA730321B9ff159","0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"]
    }
```

Generated with discovered.json: 0x4e6ead28c89bb9e104634cba78309db5c44c49bb

# Diff at Tue, 30 Jul 2024 11:17:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x7497b2e8794633fb72d194a2e0f416633fb08a18

# Diff at Tue, 11 Jun 2024 13:11:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 216537364
- current block number: 220737963

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 216537364 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xb8105dfaa96d42cb3168bb8035f98564cbe6a158

# Diff at Thu, 30 May 2024 08:36:56 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8465affce30f3ceba1fcd6e8fe7a47fd51c7c62f block: 215641876
- current block number: 216537364

## Description

The Admin EOA is removed, Caldera MS is the only upgrade executor.

## Watched changes

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xe8216687Ef40C65F64D6dcd335b0aaab4A1Bc400"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

Generated with discovered.json: 0x4d6ff733355fea27e32d71c819ef65601a504b1b

# Diff at Mon, 27 May 2024 17:59:42 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 215641876

## Description

Initial discovery: Orbit stack L3 with AnyTrust 1/1 DAC and ArbOS v10.2. Native L3 token is DMT.

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
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706)
    +++ description: None
```
