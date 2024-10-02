Generated with discovered.json: 0x3aed990e161bdbbb55fac56b8fe41bb206646174

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
