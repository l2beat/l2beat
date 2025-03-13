Generated with discovered.json: 0x0f234cfbb3453922189a476af47dd83e2fbeea04

# Diff at Tue, 04 Mar 2025 10:41:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 15810734
- current block number: 15810734

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15810734 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x5f688F563Dc16590e570f97b542FA87931AF2feD) {
    +++ description: None
      sinceBlock:
+        4931061
    }
```

```diff
    contract StargatePoolNative (0x81F6138153d473E8c5EcebD3DC8Cd4903506B075) {
    +++ description: None
      sinceBlock:
+        4931059
    }
```

Generated with discovered.json: 0x718f6bdcc8d35ad33f6b991df5eb04c479fdfde7

# Diff at Fri, 14 Feb 2025 10:23:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 5996230
- current block number: 15810734

## Description

Deficit config adjustements affecting fee calculation.

## Watched changes

```diff
    contract StargatePoolNative (0x81F6138153d473E8c5EcebD3DC8Cd4903506B075) {
    +++ description: None
      values.deficitOffset:
-        0
+        "8000000000000000000000"
    }
```

Generated with discovered.json: 0x39bd075a11228decbc46a4eb74f8995fe9867d67

# Diff at Mon, 14 Oct 2024 11:00:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 5996230
- current block number: 5996230

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 5996230 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x5f688F563Dc16590e570f97b542FA87931AF2feD) {
    +++ description: None
      sourceHashes:
+        ["0xd0e407d7588e82d593435d256d12b9da5c2c70686a62e24948a96fcbc1a463b4"]
    }
```

```diff
    contract StargatePoolNative (0x81F6138153d473E8c5EcebD3DC8Cd4903506B075) {
    +++ description: None
      sourceHashes:
+        ["0x63ac97930921267a1251904351ae2409e0d62d3d3c3fcb2ed7bc1fc4775321f7"]
    }
```

Generated with discovered.json: 0x6b33ea4c115fa68ba7eda275e12d454e462cb1aa

# Diff at Tue, 30 Jul 2024 11:17:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 5996230
- current block number: 5996230

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 5996230 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x5f688F563Dc16590e570f97b542FA87931AF2feD) {
    +++ description: None
      fieldMeta:
+        {"maxAssetId":{"description":"The highest currently registered assetID"}}
    }
```

Generated with discovered.json: 0x46e368545e7982f758599d0a32f0635aaa23594c

# Diff at Mon, 03 Jun 2024 13:44:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 5124561

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract TokenMessaging (0x5f688F563Dc16590e570f97b542FA87931AF2feD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolNative (0x81F6138153d473E8c5EcebD3DC8Cd4903506B075)
    +++ description: None
```
