Generated with discovered.json: 0x0d09212794aadddae7d7e7ef86b10f9eea867c0a

# Diff at Tue, 04 Mar 2025 10:40:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20311131
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
      sinceBlock:
+        11841962
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      sinceBlock:
+        11841962
    }
```

```diff
    contract ZkSyncCommitBlock (0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157) {
    +++ description: None
      sinceBlock:
+        11841959
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      sinceBlock:
+        11841962
    }
```

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      sinceBlock:
+        11841962
    }
```

```diff
    contract ZkSyncExit (0x8A1DBf1C32A4f5AfBD70D778F25FBEed7Cc881e5) {
    +++ description: None
      sinceBlock:
+        11841961
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      sinceBlock:
+        11841962
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      sinceBlock:
+        11841962
    }
```

Generated with discovered.json: 0x314a5a5990f8f8d4800eeb6bbf318a1eb48c1b4c

# Diff at Mon, 20 Jan 2025 11:10:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20311131
- current block number: 20311131

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311131 (main branch discovery), not current.

```diff
    contract Governance (0x02ecef526f806f06357659fFD14834fe82Ef4B04) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
      issuedPermissions.0.to:
+        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
    }
```

```diff
    contract Verifier (0x27C229937745d697d28FC7853d1bFEA7331Edf56) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
      issuedPermissions.0.to:
+        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
    }
```

```diff
    contract PairManager (0x661121AE41edE3f6FECDed922c59acC19A3ea9B3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
      issuedPermissions.0.to:
+        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
    }
```

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      receivedPermissions.4.target:
-        "0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
      receivedPermissions.4.from:
+        "0x961369d347EF7A6896BDD39cBE2B89e3911f521f"
      receivedPermissions.3.target:
-        "0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
      receivedPermissions.3.from:
+        "0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad"
      receivedPermissions.2.target:
-        "0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
      receivedPermissions.2.from:
+        "0x661121AE41edE3f6FECDed922c59acC19A3ea9B3"
      receivedPermissions.1.target:
-        "0x27C229937745d697d28FC7853d1bFEA7331Edf56"
      receivedPermissions.1.from:
+        "0x27C229937745d697d28FC7853d1bFEA7331Edf56"
      receivedPermissions.0.target:
-        "0x02ecef526f806f06357659fFD14834fe82Ef4B04"
      receivedPermissions.0.from:
+        "0x02ecef526f806f06357659fFD14834fe82Ef4B04"
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
      issuedPermissions.0.to:
+        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
    }
```

```diff
    contract VerifierExit (0x961369d347EF7A6896BDD39cBE2B89e3911f521f) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
      issuedPermissions.0.to:
+        "0x714B2D10210f2A3a7AA614F949259C87613689aB"
    }
```

Generated with discovered.json: 0x058a15acf81e695fd70095ddcb4cd99b7adc56bd

# Diff at Mon, 14 Oct 2024 10:58:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20311131
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
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xdefeaa4f5c4b5e82fe2f743a1c06665f15c301ff4d76a526669ac3fb869d5869"]
    }
```

```diff
    contract ZkSyncCommitBlock (0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157) {
    +++ description: None
      sourceHashes:
+        ["0x423fde4a6b6351d8f7f10a2e073dedc2c2250adb57d53e7cb226a30202e62863"]
    }
```

```diff
    contract UpgradeGatekeeper (0x714B2D10210f2A3a7AA614F949259C87613689aB) {
    +++ description: None
      sourceHashes:
+        ["0x1359a771e28c9c71730920ab6bee9509009c60908022ff865419a483f74f702b"]
    }
```

```diff
    contract ZkSync (0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0x86daad8532338dd22b2ad525c7955746dab5c88fca7bbd2e1a7fc07f47b2c5e3"]
    }
```

Generated with discovered.json: 0xa6acd0a48cb14d2675d11fff53d19842f0b19bf2

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

