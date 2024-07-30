Generated with discovered.json: 0xea0c6c59d41b988559f9d01b80708452703288ef

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
