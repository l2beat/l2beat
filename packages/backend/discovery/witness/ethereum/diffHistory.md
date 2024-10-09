Generated with discovered.json: 0x3ad1b7270bd819edbd72f9605339686123daf078

# Diff at Tue, 01 Oct 2024 11:11:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20491473
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-16T17:25:35.000Z",["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]]]
    }
```

```diff
    contract WitnessValidiumDAC (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-17T13:16:47.000Z",["0xD26B535AD58715C4c2ffFAC32908b13674533DAe"]]]
    }
```

Generated with discovered.json: 0x80d8a3f66e17cb6df64a6af23c10be1daef3ba35

# Diff at Fri, 30 Aug 2024 08:01:32 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20491473
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x088e3ecdf1574281e29e37f18dea9d047be38167

# Diff at Fri, 23 Aug 2024 09:56:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20491473
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract WitnessValidiumDAC (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xe99b8fe427a0d86279c4ec8bdd9d8466c20318a1

# Diff at Wed, 21 Aug 2024 10:06:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20491473
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8","via":[]}]
    }
```

```diff
    contract WitnessValidiumDAC (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039","via":[]}]
    }
```

Generated with discovered.json: 0x59ef717b76a2844895f5f850987f4c52c6485b60

# Diff at Fri, 09 Aug 2024 13:54:41 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@55033526285d11b30f44e7cea5874c4f4d65ed80 block: 20325237
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325237 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"]
      assignedPermissions.upgrade:
+        ["0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"]
    }
```

```diff
    contract WitnessValidiumDAC (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: None
      name:
-        "PolygonDataCommittee"
+        "WitnessValidiumDAC"
    }
```

Generated with discovered.json: 0xe01dbf6fba9a674051395a58baf4f5ada5c931b9

# Diff at Wed, 17 Jul 2024 09:05:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20325237

## Description

Initial discovery: PolygonCDK type RollupType 4 Validium with identical code compared to AstarZkEVM. Permissions structure is like XLayer.

## Initial discovery

```diff
+   Status: CREATED
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8)
    +++ description: None
```
