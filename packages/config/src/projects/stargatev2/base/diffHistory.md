Generated with discovered.json: 0x36669f0d0f09c85e88b997fd811413beeff28f1e

# Diff at Tue, 04 Mar 2025 10:40:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 26369623
- current block number: 26369623

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26369623 (main branch discovery), not current.

```diff
    contract StargatePoolUSDC (0x27a16dc786820B16E5c9028b75B99F6f604b5d26) {
    +++ description: None
      sinceBlock:
+        15023835
    }
```

```diff
    contract TokenMessaging (0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47) {
    +++ description: None
      sinceBlock:
+        15023838
    }
```

```diff
    contract StargatePoolNative (0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7) {
    +++ description: None
      sinceBlock:
+        15023831
    }
```

Generated with discovered.json: 0xa82bd43f0541946d04ac6d4e41241204fd143ce0

# Diff at Fri, 14 Feb 2025 10:23:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 15999031
- current block number: 26369623

## Description

Deficit config adjustements affecting fee calculation.

## Watched changes

```diff
    contract StargatePoolUSDC (0x27a16dc786820B16E5c9028b75B99F6f604b5d26) {
    +++ description: None
      values.deficitOffset:
-        0
+        25000000000000
    }
```

```diff
    contract StargatePoolNative (0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7) {
    +++ description: None
      values.deficitOffset:
-        0
+        "11500000000000000000000"
    }
```

Generated with discovered.json: 0xe1acfdafd466c89fdb3ecd43dfba0bd606e2c5de

# Diff at Mon, 14 Oct 2024 10:59:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 15999031
- current block number: 15999031

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15999031 (main branch discovery), not current.

```diff
    contract StargatePoolUSDC (0x27a16dc786820B16E5c9028b75B99F6f604b5d26) {
    +++ description: None
      sourceHashes:
+        ["0x0ef9b0bca6f74cd24daa9d50e734dfec2ecbc71cef5b209fa0c0f93561ad2640"]
    }
```

```diff
    contract TokenMessaging (0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47) {
    +++ description: None
      sourceHashes:
+        ["0xd0e407d7588e82d593435d256d12b9da5c2c70686a62e24948a96fcbc1a463b4"]
    }
```

```diff
    contract StargatePoolNative (0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7) {
    +++ description: None
      sourceHashes:
+        ["0x63ac97930921267a1251904351ae2409e0d62d3d3c3fcb2ed7bc1fc4775321f7"]
    }
```

Generated with discovered.json: 0xcbf45fae64e65f7d3bc806dc7d893d9aff9d8a7a

# Diff at Tue, 30 Jul 2024 11:17:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 15999031
- current block number: 15999031

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15999031 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47) {
    +++ description: None
      fieldMeta:
+        {"maxAssetId":{"description":"The highest currently registered assetID"}}
    }
```

Generated with discovered.json: 0x1b27a25209fd93eeee4d00680fd033045fbcf3e4

# Diff at Wed, 19 Jun 2024 08:57:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 15303298
- current block number: 15999031

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15303298 (main branch discovery), not current.

```diff
    contract StargatePoolUSDC (0x27a16dc786820B16E5c9028b75B99F6f604b5d26) {
    +++ description: None
      values.getAddressConfig:
-        ["0x08ed1d79D509A6f1020685535028ae60C144441E","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0xd47b03ee6d86Cf251ee7860FB2ACf9f91B9fD4d7","0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47","0x12dC9256Acc9895B076f6638D628382881e62CeE","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x08ed1d79D509A6f1020685535028ae60C144441E","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0xd47b03ee6d86Cf251ee7860FB2ACf9f91B9fD4d7","tokenMessaging":"0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47","creditMessaging":"0x12dC9256Acc9895B076f6638D628382881e62CeE","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract TokenMessaging (0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47) {
    +++ description: None
      values.oAppVersion:
-        [1,2]
+        {"senderVersion":1,"receiverVersion":2}
    }
```

```diff
    contract StargatePoolNative (0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7) {
    +++ description: None
      values.getAddressConfig:
-        ["0x17E450Be3Ba9557F2378E20d64AD417E59Ef9A34","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0xd47b03ee6d86Cf251ee7860FB2ACf9f91B9fD4d7","0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47","0x12dC9256Acc9895B076f6638D628382881e62CeE","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x17E450Be3Ba9557F2378E20d64AD417E59Ef9A34","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0xd47b03ee6d86Cf251ee7860FB2ACf9f91B9fD4d7","tokenMessaging":"0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47","creditMessaging":"0x12dC9256Acc9895B076f6638D628382881e62CeE","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

Generated with discovered.json: 0xb1244e45db017f97d27c28923728bbe322066f7a

# Diff at Mon, 03 Jun 2024 06:25:32 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 15303298

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract StargatePoolUSDC (0x27a16dc786820B16E5c9028b75B99F6f604b5d26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessaging (0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolNative (0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7)
    +++ description: None
```
