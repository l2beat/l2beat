Generated with discovered.json: 0x809b23b3c983d8f92860d90b98fd91ff50a86b14

# Diff at Fri, 09 Aug 2024 10:12:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20325237
- current block number: 20325237

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
