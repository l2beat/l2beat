Generated with discovered.json: 0x3defdc19a728cd3223bef1b0370c6f8c3240e0a6

# Diff at Wed, 21 Aug 2024 10:04:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19532020
- current block number: 19532020

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532020 (main branch discovery), not current.

```diff
    contract BridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e","0x88ad09518695c6c3712AC10a214bE5109a655671","0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e","via":[]},{"permission":"upgrade","target":"0x88ad09518695c6c3712AC10a214bE5109a655671","via":[]},{"permission":"upgrade","target":"0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064","via":[]}]
    }
```

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6","via":[]}]
    }
```

```diff
    contract MultiTokenMediator (0x88ad09518695c6c3712AC10a214bE5109a655671) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6","via":[]}]
    }
```

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6","via":[]}]
    }
```

Generated with discovered.json: 0xe76748f22ba77b904cf9cdcd9d9464425b23c7b0

# Diff at Fri, 09 Aug 2024 12:00:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19532020
- current block number: 19532020

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532020 (main branch discovery), not current.

```diff
    contract BridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e"
+        "0x88ad09518695c6c3712AC10a214bE5109a655671"
      assignedPermissions.upgrade.0:
-        "0x88ad09518695c6c3712AC10a214bE5109a655671"
+        "0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e"
    }
```

Generated with discovered.json: 0xcfbe371f193e5b314a3e419e60f80ce4fdae47ce

# Diff at Fri, 09 Aug 2024 10:10:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19532020
- current block number: 19532020

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532020 (main branch discovery), not current.

```diff
    contract BridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e","0x88ad09518695c6c3712AC10a214bE5109a655671","0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064"]
      assignedPermissions.upgrade:
+        ["0x88ad09518695c6c3712AC10a214bE5109a655671","0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e","0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064"]
      values.$multisigThreshold:
-        "8 of 16 (50%)"
      values.getOwners:
-        ["0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43","0xb8173f558f75EE263013fd6294177bf75279a21e","0xDdf2d07267EAF2cE3E13ee4319bE1F34D55ed992","0xAC0622953d25e1a6c4e0f32Ffc1A9C1cE350B60E","0x86Da253817DC599059e3AD5A1F098F7b96aBf34c","0x1685324Bf373670ad5C9c56bd88A1dc1C063b0f9","0x0101016044726994aFd16f4A99f0d960090D35e7","0x5b10cE4DDD27F57d4D432D409A5321219cbA7893","0xc44caeb7F0724A156806664d2361fD6f32a2d2C8","0x839395e20bbB182fa440d08F850E6c7A8f6F0780","0xd945325557f1FB4374fBf10Ae86D385632Df870A","0x10DD75875a2a8a284529Ae7223B1aCE410d606bd","0x80BA18503a1Fa16Ea22F3ef1Af23e2994EaC1d97","0xd26a3F686D43f2A62BA9eaE2ff77e9f516d945B9","0x57B11cC8F93f2cfeC4c1C5B95213f17cAD81332B","0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"]
      values.getThreshold:
-        8
      values.$members:
+        ["0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43","0xb8173f558f75EE263013fd6294177bf75279a21e","0xDdf2d07267EAF2cE3E13ee4319bE1F34D55ed992","0xAC0622953d25e1a6c4e0f32Ffc1A9C1cE350B60E","0x86Da253817DC599059e3AD5A1F098F7b96aBf34c","0x1685324Bf373670ad5C9c56bd88A1dc1C063b0f9","0x0101016044726994aFd16f4A99f0d960090D35e7","0x5b10cE4DDD27F57d4D432D409A5321219cbA7893","0xc44caeb7F0724A156806664d2361fD6f32a2d2C8","0x839395e20bbB182fa440d08F850E6c7A8f6F0780","0xd945325557f1FB4374fBf10Ae86D385632Df870A","0x10DD75875a2a8a284529Ae7223B1aCE410d606bd","0x80BA18503a1Fa16Ea22F3ef1Af23e2994EaC1d97","0xd26a3F686D43f2A62BA9eaE2ff77e9f516d945B9","0x57B11cC8F93f2cfeC4c1C5B95213f17cAD81332B","0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"]
      values.$threshold:
+        8
      values.multisigThreshold:
+        "8 of 16 (50%)"
    }
```

```diff
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 3 (33%)"
      values.getOwners:
-        ["0x2408F8a0475D3823A1F4A4bfD86B2a4B80E6eDB6","0x61F4aE313592714f0557E0B4edd1641ACB394422","0x3b3Cd747Ab7bf2BE3b950693deeDe8a0B96C4fF0"]
      values.getThreshold:
-        1
      values.$members:
+        ["0x2408F8a0475D3823A1F4A4bfD86B2a4B80E6eDB6","0x61F4aE313592714f0557E0B4edd1641ACB394422","0x3b3Cd747Ab7bf2BE3b950693deeDe8a0B96C4fF0"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 3 (33%)"
    }
```

Generated with discovered.json: 0x0cd69e978a5eff25b091cf90b91a4f2916c6f3f1

# Diff at Tue, 30 Jul 2024 11:13:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 19532020
- current block number: 19532020

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532020 (main branch discovery), not current.

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
      fieldMeta:
+        {"validatorList":{"severity":"MEDIUM","description":"Array of the signers in the validator multisig"}}
    }
```

Generated with discovered.json: 0xabc1571e97c6a3fd09f23adee4c8f5d92b0c464e

# Diff at Thu, 28 Mar 2024 10:29:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19425639
- current block number: 19532020

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19425639 (main branch discovery), not current.

```diff
    contract BridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      upgradeability.threshold:
+        "8 of 16 (50%)"
    }
```

```diff
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 3 (33%)"
    }
```

Generated with discovered.json: 0x4a5fcb93fb7311213ea7220e147822bc75feeef4

# Diff at Wed, 13 Mar 2024 10:45:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@569d0a5fb269e21eeb1e6c7fdb1a2848a0c6fda7 block: 18825546
- current block number: 19425639

## Description

One validator of the 8 in the multisig is changed.

## Watched changes

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
+++ description: Array of the signers in the validator multisig
+++ type: PERMISSION
+++ severity: MEDIUM
      values.validatorList.0:
-        "0xfDBf5711f77B97EA7F1f812832884c7328a682eC"
+        "0x456c255A8BC1F33778603A2a48Eb6B0C69F4d48E"
    }
```

Generated with discovered.json: 0x7e766748f218a7a95313663407b4d0b507548a58

# Diff at Wed, 20 Dec 2023 07:11:37 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@66449a15ea740d012130a024e5e0daa7f431f04b

## Description

Change in the required block confirmations of Arbitrary Message Bridge - the number of block confirmations oracle will wait before processing passed messages has been increased.

## Watched changes

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
      values.requiredBlockConfirmations:
-        100
+        130
    }
```
