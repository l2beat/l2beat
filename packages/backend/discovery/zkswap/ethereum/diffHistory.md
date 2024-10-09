Generated with discovered.json: 0x601d0fef009579ac77452aa8d53c157913066743

# Diff at Tue, 01 Oct 2024 11:12:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x76a9a2242f64c827abfaf6f2abd9f1c64031b4ec

# Diff at Fri, 30 Aug 2024 08:01:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
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

Generated with discovered.json: 0xe74ba57deee6e3f77678c790ebf779a239d8bd32

# Diff at Fri, 23 Aug 2024 09:56:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x8fa4e1346136bd222c7037e70a14118ed8ccd319

# Diff at Wed, 21 Aug 2024 10:07:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x02ecef526f806f06357659fFD14834fe82Ef4B04","0x27C229937745d697d28FC7853d1bFEA7331Edf56","0x661121AE41edE3f6FECDed922c59acC19A3ea9B3","0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad","0x961369d347EF7A6896BDD39cBE2B89e3911f521f"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x02ecef526f806f06357659fFD14834fe82Ef4B04","via":[]},{"permission":"upgrade","target":"0x27C229937745d697d28FC7853d1bFEA7331Edf56","via":[]},{"permission":"upgrade","target":"0x661121AE41edE3f6FECDed922c59acC19A3ea9B3","via":[]},{"permission":"upgrade","target":"0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad","via":[]},{"permission":"upgrade","target":"0x961369d347EF7A6896BDD39cBE2B89e3911f521f","via":[]}]
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x714B2D10210f2A3a7AA614F949259C87613689aB","via":[]}]
    }
```

Generated with discovered.json: 0x0a81d4628ddafebcfee55fda9e3fc6dec4821551

# Diff at Fri, 09 Aug 2024 12:03:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0x27C229937745d697d28FC7853d1bFEA7331Edf56"
+        "0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
      assignedPermissions.upgrade.3:
-        "0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
+        "0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
      assignedPermissions.upgrade.2:
-        "0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
+        "0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
      assignedPermissions.upgrade.1:
-        "0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
+        "0x27C229937745d697d28FC7853d1bFEA7331Edf56"
    }
```

Generated with discovered.json: 0xee68fa5ea0013ed1c8d23010fa3e4aab47604ba3

# Diff at Fri, 09 Aug 2024 10:13:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20311131
- current block number: 20311131

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x02ecef526f806f06357659fFD14834fe82Ef4B04","0x27C229937745d697d28FC7853d1bFEA7331Edf56","0x661121AE41edE3f6FECDed922c59acC19A3ea9B3","0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad","0x961369d347EF7A6896BDD39cBE2B89e3911f521f"]
      assignedPermissions.upgrade:
+        ["0x02ecef526f806f06357659fFD14834fe82Ef4B04","0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad","0x961369d347EF7A6896BDD39cBE2B89e3911f521f","0x661121AE41edE3f6FECDed922c59acC19A3ea9B3","0x27C229937745d697d28FC7853d1bFEA7331Edf56"]
    }
```

Generated with discovered.json: 0xd2c24cd05e33d7aa72ce69207779cd8fc184fdb9

