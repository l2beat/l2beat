Generated with discovered.json: 0xe59fe25b1d184c00660b389ff8563d949a6d4dbc

# Diff at Fri, 07 Mar 2025 13:54:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 21965148
- current block number: 21995407

## Description

Some admin / owner permissions moved from EOA to 3/3 Safe (Lightlink is moving to an op stack deployment).

## Watched changes

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$admin:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.owner:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$admin:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.owner:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.$admin:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
      values.owner:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
+        "0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7"
    }
```

```diff
+   Status: CREATED
    contract LightLinkMultisig2 (0x8D43A0d17F9883ED0b2Ddf89761d3cc74a5fC6C7)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/LightLinkMultisig2/Safe.sol     | 1088 ++++++++++++++++++++
 .../.flat/LightLinkMultisig2/SafeProxy.p.sol       |   37 +
 2 files changed, 1125 insertions(+)
```

Generated with discovered.json: 0x13930dbbea129921bcf7b679eb9666e1091da8b7

# Diff at Tue, 04 Mar 2025 10:39:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21965148
- current block number: 21965148

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21965148 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      sinceBlock:
+        20019970
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      sinceBlock:
+        20019967
    }
```

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      sinceBlock:
+        17924532
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      sinceBlock:
+        17924604
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      sinceBlock:
+        17924561
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      sinceBlock:
+        17924631
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      sinceBlock:
+        20019964
    }
```

```diff
    contract RLPReader (0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2) {
    +++ description: None
      sinceBlock:
+        20019965
    }
```

Generated with discovered.json: 0x41fbeddb0beeaaa5231b6983d4e63632ac9f9313

# Diff at Mon, 03 Mar 2025 08:56:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f23dcb100957b0b121d62148a4d586788383af80 block: 21635772
- current block number: 21965148

## Description

Bridge paused, all ETH moved into a multisig. Probably connected to them [moving their infra to the op stack fork](https://x.com/LightLinkChain/status/1895145558777491655).

Put project under review and added warning.

## Watched changes

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      values.getTransactionCount:
-        20
+        22
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      values.isPaused:
-        false
+        true
    }
```

Generated with discovered.json: 0xbbcde6f4cf20ea4afecee0a70bd58d5420735883

# Diff at Mon, 20 Jan 2025 11:09:41 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21635772
- current block number: 21635772

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635772 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
      issuedPermissions.0.to:
+        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
      issuedPermissions.0.to:
+        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
    }
```

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      receivedPermissions.2.target:
-        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
      receivedPermissions.2.from:
+        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
      receivedPermissions.1.target:
-        "0x624631881655a310adcF0d1336658Cc977609b72"
      receivedPermissions.1.from:
+        "0x624631881655a310adcF0d1336658Cc977609b72"
      receivedPermissions.0.target:
-        "0x3ca373F5ecB92ac762f9876f6e773082A4589995"
      receivedPermissions.0.from:
+        "0x3ca373F5ecB92ac762f9876f6e773082A4589995"
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
      issuedPermissions.0.to:
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
      issuedPermissions.0.to:
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
      issuedPermissions.0.to:
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
      issuedPermissions.0.to:
+        "0xcc90c738acfc1695D19336Bc3E392a46234112BF"
    }
```

Generated with discovered.json: 0xd22ac770c67618fe25028f67511a3b768170cfb9

# Diff at Thu, 16 Jan 2025 08:12:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a739892e4565ca2cf8f67abed360c494a770dcea block: 21422626
- current block number: 21635772

## Description

challengeWindow (the effective challenge period) increased to 5d.

## Watched changes

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.challengeWindow:
-        259200
+        432000
      values.finalizationSeconds:
-        432000
+        604800
    }
```

Generated with discovered.json: 0x42d845827fac948c43b2b8dc33a91a58b310e9ae

# Diff at Mon, 21 Oct 2024 11:07:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20685269
- current block number: 20685269

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20685269 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"]
      values.$pastUpgrades.1.1:
-        ["0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"]
+        "0x4395a7f970de1003c82254f83fbf42c5f11a97842d23ff171be9d0d6c683010b"
      values.$pastUpgrades.0.2:
+        ["0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"]
      values.$pastUpgrades.0.1:
-        ["0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"]
+        "0x84c616f81289c7637be644c43b7a1bf740daa615896f9bb9d141c3d383c4b6f1"
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x79B3E839333a74137e78b0DaF84FC12512a8c704"]
      values.$pastUpgrades.0.1:
-        ["0x79B3E839333a74137e78b0DaF84FC12512a8c704"]
+        "0x777ffc74cdda4dadf5067e5736ed319792fa6e37c5eab24573e3fd01f33e2334"
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x468b89D930ca7974196D7195033600B658011756"]
      values.$pastUpgrades.0.1:
-        ["0x468b89D930ca7974196D7195033600B658011756"]
+        "0xa5257a1dff2fd90764950a9d0b5767fcf4d7a9d1fb7d27084ccfc03b78e947d2"
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E"]
      values.$pastUpgrades.0.1:
-        ["0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E"]
+        "0xd39a80831c0c0fdc27b6e030d6e1a393b0d3cbc0f8b9d22d0fa2046b33e2fc76"
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E"]
      values.$pastUpgrades.0.1:
-        ["0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E"]
+        "0x2a6786734b18517394bf675986e76ba59c82e093d87180792e3f5287c98af7a0"
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xeFE38Bd58ADDf23eFab1FFa16312030384929289"]
      values.$pastUpgrades.1.1:
-        ["0xeFE38Bd58ADDf23eFab1FFa16312030384929289"]
+        "0xcc066ac45b2d6527afdb41a5254a2093bcbc6d8e7d8571f6139b08db97f6e50b"
      values.$pastUpgrades.0.2:
+        ["0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"]
      values.$pastUpgrades.0.1:
-        ["0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"]
+        "0x39c4618d14675071a6b0f6183c7cf605373987d3ed2677426598aa67e5d15e56"
    }
```

Generated with discovered.json: 0x85b4f192d1b2fba467c4bb6306bd5a80063c3804

# Diff at Mon, 14 Oct 2024 10:52:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20685269
- current block number: 20685269

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20685269 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      sourceHashes:
+        ["0x7e52f67f6162bc66d00626c817dcd5b11c2189fcf7bf5efcd32fd0821c22c0ad","0x90fc7abf9460afe3940188c51d98ab5da40ece530f7fc0e6e10c459a1b7f35f5"]
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      sourceHashes:
+        ["0x7e52f67f6162bc66d00626c817dcd5b11c2189fcf7bf5efcd32fd0821c22c0ad","0x219c5860c98ee65c799aa9b6549168915088c6de2369583a157ee3a60cf65b47"]
    }
```

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      sourceHashes:
+        ["0x4bbdb661859a4bbfa25496630a4c393bc0999fe0bdf4910997d7c098294d19e6"]
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      sourceHashes:
+        ["0x271f364b7e28b516246603be8769c5002d3e585faea009e131bf170f073129e8","0x71f4b3f45f14bd6064069c36b9bb52b9b3efa4e4b40344614eaad2e50f5b78c6"]
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      sourceHashes:
+        ["0xb5af2f6166dd24adeb4b7faf21f2bbfc8512fe699c249b64b565127766ff6e3d","0xc12eca0e011860efa4f71723a172994a15e062d037a0d89ef36b5aed423fb37a"]
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      sourceHashes:
+        ["0x271f364b7e28b516246603be8769c5002d3e585faea009e131bf170f073129e8","0xc53e364c720158d2d3f89d1c4ffb1a3550689489699dfdaca67ee8a51967c9cc"]
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      sourceHashes:
+        ["0x7e52f67f6162bc66d00626c817dcd5b11c2189fcf7bf5efcd32fd0821c22c0ad","0x7c0a4f7fb2f2948ffde2e5550debf14c02fa682bec9a57aac718daf43c80c2c7"]
    }
```

```diff
    contract RLPReader (0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2) {
    +++ description: None
      sourceHashes:
+        ["0xa54be4566b369d95be75b2911bdb9216ec62e1bc5dc86dff8ec6bcff42c7ec28"]
    }
```

Generated with discovered.json: 0x91707214dfe048181dad5534da69db6b710d6c12

# Diff at Tue, 01 Oct 2024 10:52:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20685269
- current block number: 20685269

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20685269 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:32:23.000Z",["0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"]],["2024-09-05T13:35:35.000Z",["0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"]]]
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:31:47.000Z",["0x79B3E839333a74137e78b0DaF84FC12512a8c704"]]]
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-16T03:06:47.000Z",["0x468b89D930ca7974196D7195033600B658011756"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-16T02:57:47.000Z",["0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-16T03:12:11.000Z",["0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:31:11.000Z",["0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"]],["2024-09-05T13:31:35.000Z",["0xeFE38Bd58ADDf23eFab1FFa16312030384929289"]]]
    }
```

Generated with discovered.json: 0x3e7db4030a9e68b02999c798868fa8c2066511dc

# Diff at Thu, 05 Sep 2024 15:26:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d01da0bcdde8e77051659c9718e449a44f5f957a block: 20117905
- current block number: 20685269

## Description

Small upgrade:

### Challenge.sol
- new `finalizationSeconds()` returns challengePeriod + challengeWindow

### CanonicalStateChain.sol
- new `OutputProposed` event for each new output root (on `pushBlock()`)
- `output root = keccack(version_hash || keccack(state_root || withdrawal_root || latest_block_hash))`
- new `getL2Output()` returns outputRoot, timestamp

## Watched changes

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.$implementation:
-        "0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"
+        "0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"
      values.$upgradeCount:
-        1
+        2
      values.finalizationSeconds:
+        432000
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      values.$implementation:
-        "0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"
+        "0xeFE38Bd58ADDf23eFab1FFa16312030384929289"
      values.$upgradeCount:
-        1
+        2
      values.startingTimestamp:
+        1717522271
    }
```

## Source code changes

```diff
.../CanonicalStateChain/CanonicalStateChain.sol    | 37 ++++++++++++++++++++--
 .../Challenge/Challenge.sol                        |  5 +++
 2 files changed, 40 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x6d6b9df731962a3b59a97d94d7b57792794c1bed

# Diff at Fri, 30 Aug 2024 07:53:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xbfab149ef568896625f0220e4db9c67e96c97804

# Diff at Fri, 23 Aug 2024 09:52:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xeedfb4ae7298c593a94252f1f8cb181c45cee40c

# Diff at Wed, 21 Aug 2024 10:03:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xcc90c738acfc1695D19336Bc3E392a46234112BF","via":[]}]
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xcc90c738acfc1695D19336Bc3E392a46234112BF","via":[]}]
    }
```

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x3ca373F5ecB92ac762f9876f6e773082A4589995","0x624631881655a310adcF0d1336658Cc977609b72","0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x3ca373F5ecB92ac762f9876f6e773082A4589995","via":[]},{"permission":"upgrade","target":"0x624631881655a310adcF0d1336658Cc977609b72","via":[]},{"permission":"upgrade","target":"0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9","via":[]}]
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3345702FeA1669Efa1e085610A62F89d159Bc0c8","via":[]}]
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3345702FeA1669Efa1e085610A62F89d159Bc0c8","via":[]}]
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3345702FeA1669Efa1e085610A62F89d159Bc0c8","via":[]}]
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xcc90c738acfc1695D19336Bc3E392a46234112BF","via":[]}]
    }
```

Generated with discovered.json: 0xf9ba057c7ad16038bcecbd934f422fb7841592e2

# Diff at Fri, 09 Aug 2024 12:00:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x624631881655a310adcF0d1336658Cc977609b72"
+        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
      assignedPermissions.upgrade.1:
-        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
+        "0x624631881655a310adcF0d1336658Cc977609b72"
    }
```

Generated with discovered.json: 0xc83644e57cef1e7beae3dfcb0e282d087d0f16b1

# Diff at Fri, 09 Aug 2024 10:10:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3ca373F5ecB92ac762f9876f6e773082A4589995","0x624631881655a310adcF0d1336658Cc977609b72","0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"]
      assignedPermissions.upgrade:
+        ["0x3ca373F5ecB92ac762f9876f6e773082A4589995","0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9","0x624631881655a310adcF0d1336658Cc977609b72"]
    }
```

Generated with discovered.json: 0x2053af4a0dff819953516c381e96cf97096d863a

# Diff at Tue, 18 Jun 2024 09:58:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e3611555e0b885dd86d383737fd13f2f80d29e5d block: 20083371
- current block number: 20117905

## Description

Introduce the LightLink proxy type.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20083371 (main branch discovery), not current.

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      upgradeability.type:
-        "EIP1967 proxy"
+        "LightLink proxy"
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      upgradeability.type:
-        "EIP1967 proxy"
+        "LightLink proxy"
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      upgradeability.type:
-        "EIP1967 proxy"
+        "LightLink proxy"
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

Generated with discovered.json: 0x5b0656336e187bb0466ffcb9ed0d53058db03a56

# Diff at Thu, 13 Jun 2024 14:03:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@9b539b55e8e7d4d20892b6f527f5c9e27bd65f80 block: 20061082
- current block number: 20083371

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20061082 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.daNamespace:
-        ["0x00","0x00000000000000000000000000000000000000000000000000000000"]
+        {"version":"0x00","id":"0x00000000000000000000000000000000000000000000000000000000"}
    }
```

```diff
    contract Multisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      name:
-        "Multisig"
+        "LightLinkMultisig"
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      values.getValidators.4:
-        ["0xc8225cA10F570d4d7aD6cdb6F0bfEb683dc7C938",40]
+        {"addr":"0xc8225cA10F570d4d7aD6cdb6F0bfEb683dc7C938","power":40}
      values.getValidators.3:
-        ["0xaB0DDC4B1Fc1F24D4F7F67ab87B5dD8e5e0c5AC9",40]
+        {"addr":"0xaB0DDC4B1Fc1F24D4F7F67ab87B5dD8e5e0c5AC9","power":40}
      values.getValidators.2:
-        ["0xB44C32Dd1ec374224eED43FD827EBE64db16b0df",20]
+        {"addr":"0xB44C32Dd1ec374224eED43FD827EBE64db16b0df","power":20}
      values.getValidators.1:
-        ["0x6f933814903561F79137099587737DFB24c6E86D",20]
+        {"addr":"0x6f933814903561F79137099587737DFB24c6E86D","power":20}
      values.getValidators.0:
-        ["0x12eCE4AA73ee8ea958bE327daE41Dd785c997118",40]
+        {"addr":"0x12eCE4AA73ee8ea958bE327daE41Dd785c997118","power":40}
    }
```

Generated with discovered.json: 0x9ed1eacb739e181fea2cb650b2ef14492f71700c

# Diff at Mon, 10 Jun 2024 11:17:41 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 20061082

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Multisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RLPReader (0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2)
    +++ description: None
```
