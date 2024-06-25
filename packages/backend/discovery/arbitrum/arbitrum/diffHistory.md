Generated with discovered.json: 0xea57e846c103c00f51719d02e72fe54941b10b02

# Diff at Mon, 24 Jun 2024 10:18:00 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b54e27671cccd831f2f6414fffe3bd374840c6b7 block: 213445891
- current block number: 225188961

## Description

Scheduled SC threshold increase is executed.

## Watched changes

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      upgradeability.threshold:
-        "7 of 12 (58%)"
+        "9 of 12 (75%)"
      values.getThreshold:
-        7
+        9
    }
```

Generated with discovered.json: 0xedcb031a30b4bdc43edf5e8acb9624b656a40898

# Diff at Tue, 21 May 2024 06:31:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fb4c64221d00d53ed6ec1609ef10dc99f1842087 block: 208388457
- current block number: 213445891

## Description

Execution of the biannual security council elections referenced in the last update.

## Watched changes

```diff
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.getOwners.10:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getOwners.9:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.8:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.7:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.6:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.5:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.4:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getOwners.3:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.getOwners.2:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
      values.getOwners.1:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
      values.getOwners.0:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
    }
```

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.getOwners.10:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getOwners.9:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.8:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.7:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.6:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.5:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.4:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getOwners.3:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.getOwners.2:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
      values.getOwners.1:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
      values.getOwners.0:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
    }
```

Generated with discovered.json: 0xe5a979cc7f1e23c4acc6a3510dc4a992f0ff176a

# Diff at Mon, 06 May 2024 09:22:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@22b41765601210ab9db53f4371a852edbfa067ea block: 195078255
- current block number: 208388457

## Description

The biannual security council elections are executed with a familiar figure (`0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae`) having been re-elected.

## Watched changes

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.11:
-        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.10:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.9:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.8:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.7:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.6:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.getSecondCohort.5:
-        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getSecondCohort.4:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
      values.getSecondCohort.3:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
      values.getSecondCohort.2:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
      values.getSecondCohort.1:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
      values.getSecondCohort.0:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.updateNonce:
-        1
+        2
    }
```

Generated with discovered.json: 0x719eea4074a6b7d15e0c5fa005f4a80d040398ef

# Diff at Thu, 28 Mar 2024 11:36:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 189651036
- current block number: 195078255

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 189651036 (main branch discovery), not current.

```diff
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      upgradeability.threshold:
+        "9 of 12 (75%)"
    }
```

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      upgradeability.threshold:
+        "7 of 12 (58%)"
    }
```

Generated with discovered.json: 0x6cd94aaadac1762751f4e95ba2a134f51e1b436b

# Diff at Tue, 12 Mar 2024 14:47:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@28a94a6f03cba215bffdba08f227fba4f8d9ef95 block: 132779316
- current block number: 189651036

## Description

The security council is swapped for two new cohorts.
Context: First Arbitrum security council elections in september 2023.

## Watched changes

```diff
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.getOwners.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.3:
-        "0x8688515028955734350067695939423222009623"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
    }
```

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.getOwners.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.3:
-        "0x8688515028955734350067695939423222009623"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.nonce:
-        2
+        4
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      values.getBothCohorts.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getBothCohorts.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getBothCohorts.3:
-        "0x8688515028955734350067695939423222009623"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getBothCohorts.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getBothCohorts.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getFirstCohort.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getFirstCohort.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getFirstCohort.3:
-        "0x8688515028955734350067695939423222009623"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getFirstCohort.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getFirstCohort.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.updateNonce:
-        0
+        1
    }
```

Generated with discovered.json: 0x527a540ef29193002240152e1304597d1758aa55

# Diff at Wed, 20 Sep 2023 09:16:00 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@

## Watched changes

```diff
+   Status: CREATED
    contract L2CustomGateway (0x096760F208390250649E3e8763348E783AEF5562) {
    }
```

```diff
+   Status: CREATED
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    }
```

```diff
+   Status: CREATED
    contract L2CoreTimelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    }
```

```diff
+   Status: CREATED
    contract StandardArbERC20 (0x3f770Ac673856F105b586bb393d122721265aD46) {
    }
```

```diff
+   Status: CREATED
    contract BeaconProxyFactory (0x3fE38087A94903A9D946fa1915e1772fe611000f) {
    }
```

```diff
+   Status: CREATED
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    }
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecRouteBuilder (0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a) {
    }
```

```diff
+   Status: CREATED
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    }
```

```diff
+   Status: CREATED
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    }
```

```diff
+   Status: CREATED
    contract SecurityCouncilMemberSyncAction (0x9BF7b8884Fa381a45f8CB2525905fb36C996297a) {
    }
```

```diff
+   Status: CREATED
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    }
```

```diff
+   Status: CREATED
    contract L2TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    }
```

```diff
+   Status: CREATED
    contract L2ReverseCustomGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    }
```

```diff
+   Status: CREATED
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333) {
    }
```

```diff
+   Status: CREATED
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    }
```

```diff
+   Status: CREATED
    contract FixedDelegateErc20Wallet (0xF3FC178157fb3c87548bAA86F9d24BA38E649B58) {
    }
```
