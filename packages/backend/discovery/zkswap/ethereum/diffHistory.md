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

