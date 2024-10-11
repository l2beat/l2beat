Generated with discovered.json: 0x197b8087d7d616c860207059a5c16396da01fe1c

# Diff at Tue, 01 Oct 2024 10:53:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20826378
- current block number: 20826378

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826378 (main branch discovery), not current.

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-08-14T16:32:47.000Z",["0xB6cD7eD75c008d0033ED241872639a1D8a35020a"]]]
    }
```

Generated with discovered.json: 0x93694ce8fa8ba9c589bf7831a22fdc813a009529

# Diff at Wed, 25 Sep 2024 08:18:25 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e8c4fe6b10f7918ebbd761bc35018ba84053b08c block: 20756756
- current block number: 20826378

## Description

Two new circuitIDs added.

## Watched changes

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      values.getCircuitIds.4:
+        "0xce48e1cc84d60e97002a3a2cf4922518d29807902411c8fab5717ba51e0a3fa4"
      values.getCircuitIds.3:
+        "0x6dd87ed53c75bcf4b71ea175076439d03ce87fd155ef425a77f53b8e95c60e38"
    }
```

Generated with discovered.json: 0xcd08c465cd0b402f9140081649f6f0509db9da75

# Diff at Fri, 06 Sep 2024 11:07:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@08a747098d22564c3a0b869c0a20851bf283bd07 block: 20670228
- current block number: 20691150

## Description

A new (third) circuit is registered and can be used for proving.

## Watched changes

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      values.getCircuitIds.2:
+        "0x20dca5aeaaa412308a341546b48893f6c4c8f3b5b2774ccbd46e95a9bde9f03b"
    }
```

Generated with discovered.json: 0xa9e947b219ad4875433807857044c6c4adaeb3b7

# Diff at Mon, 02 Sep 2024 11:30:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20662597

## Description

Initial Discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NebraOwner (0xb463603469Bf31f189E3F6625baf8378880Df14e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xE990F8e3505391d2b42C80683d403A8371Ee88B9)
    +++ description: None
```
