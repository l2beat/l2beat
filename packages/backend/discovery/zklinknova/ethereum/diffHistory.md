Generated with discovered.json: 0xaf2aa8acf3242c7ea466c9adf4e46b5b5631c8b2

# Diff at Fri, 09 Aug 2024 12:03:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20389275
- current block number: 20389275

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389275 (main branch discovery), not current.

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      assignedPermissions.upgrade.9:
-        "0x803460416C2682Ac54FccF03eF77b10A12f2809b"
+        "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"
      assignedPermissions.upgrade.8:
-        "0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002"
+        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
      assignedPermissions.upgrade.7:
-        "0x83Bc7394738A7A084081aF22EEC0051908c0055c"
+        "0x986c905087a663db3C81ad319b94c1E9dd388e92"
      assignedPermissions.upgrade.6:
-        "0x986c905087a663db3C81ad319b94c1E9dd388e92"
+        "0x83Bc7394738A7A084081aF22EEC0051908c0055c"
      assignedPermissions.upgrade.5:
-        "0x273D59aed2d793167c162E64b9162154B07583C0"
+        "0x803460416C2682Ac54FccF03eF77b10A12f2809b"
      assignedPermissions.upgrade.4:
-        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
+        "0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D"
      assignedPermissions.upgrade.3:
-        "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"
+        "0x5fD9F73286b7E8683Bab45019C94553b93e015Cf"
      assignedPermissions.upgrade.1:
-        "0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D"
+        "0x273D59aed2d793167c162E64b9162154B07583C0"
      assignedPermissions.upgrade.0:
-        "0x5fD9F73286b7E8683Bab45019C94553b93e015Cf"
+        "0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002"
    }
```

Generated with discovered.json: 0xb371747445419ec29fa13f67744c8632cccd2814

# Diff at Fri, 09 Aug 2024 10:13:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20389275
- current block number: 20389275

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389275 (main branch discovery), not current.

```diff
    contract EthereumProxyAdmin (0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xAd16eDCF7DEB7e90096A259c81269d811544B6B6"]
      assignedPermissions.upgrade:
+        ["0xAd16eDCF7DEB7e90096A259c81269d811544B6B6"]
    }
```

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002","0x273D59aed2d793167c162E64b9162154B07583C0","0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158","0x5fD9F73286b7E8683Bab45019C94553b93e015Cf","0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D","0x803460416C2682Ac54FccF03eF77b10A12f2809b","0x83Bc7394738A7A084081aF22EEC0051908c0055c","0x986c905087a663db3C81ad319b94c1E9dd388e92","0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269","0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"]
      assignedPermissions.upgrade:
+        ["0x5fD9F73286b7E8683Bab45019C94553b93e015Cf","0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D","0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158","0xeCD189e0f390826E137496a4e4a23ACf76c942Ab","0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269","0x273D59aed2d793167c162E64b9162154B07583C0","0x986c905087a663db3C81ad319b94c1E9dd388e92","0x83Bc7394738A7A084081aF22EEC0051908c0055c","0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002","0x803460416C2682Ac54FccF03eF77b10A12f2809b"]
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0x1429d9ddac3ecc8a4b4dc214718d0c0d33972334

# Diff at Fri, 26 Jul 2024 07:37:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20289552
- current block number: 20389275

## Description

The ScrollL1Gateway admin and owner are changed from the zkLinkNova deployer to the EthereumOwner MS. The same MS is already owner and admin of all other gateways on ethereum.

## Watched changes

```diff
    contract ScrollL1Gateway (0x986c905087a663db3C81ad319b94c1E9dd388e92) {
    +++ description: None
      values.$admin:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      values.owner:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      assignedPermissions.admin.9:
+        "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"
      assignedPermissions.admin.8:
-        "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"
+        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
      assignedPermissions.admin.7:
-        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
+        "0x986c905087a663db3C81ad319b94c1E9dd388e92"
      values.$multisigThreshold:
-        "6 of 8 (75%)"
+        "5 of 8 (63%)"
      values.getThreshold:
-        6
+        5
    }
```

Generated with discovered.json: 0x35ed1bc9d854f4ae1497773397ef884bc0f57ae9

# Diff at Fri, 05 Jul 2024 13:17:46 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20240549

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Arbitrator (0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumL1Gateway (0x273D59aed2d793167c162E64b9162154B07583C0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthereumProxyAdmin (0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlastL1Gateway (0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseL1Gateway (0x4eEA93966AA5cd658225E0D43b665A5a491d2b7E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0x5fD9F73286b7E8683Bab45019C94553b93e015Cf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MantaL1Gateway (0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismL1Gateway (0x668e8F67adB8219e1816C2E5bBEa055A78AF3026)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LineaL1Gateway (0x803460416C2682Ac54FccF03eF77b10A12f2809b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthereumL1Gateway (0x83Bc7394738A7A084081aF22EEC0051908c0055c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollL1Gateway (0x986c905087a663db3C81ad319b94c1E9dd388e92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0xAd16eDCF7DEB7e90096A259c81269d811544B6B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MantleL1Gateway (0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EraL1Gateway (0xeCD189e0f390826E137496a4e4a23ACf76c942Ab)
    +++ description: None
```
