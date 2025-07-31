Generated with discovered.json: 0x59582ad02e59a23c611488c833f46fc6e8f2472c

# Diff at Thu, 31 Jul 2025 10:51:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@07319d194d312aca8103826b7db44d44613cc7fa block: 1752074075
- current timestamp: 1752074075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752074075 (main branch discovery), not current.

```diff
    contract TokenMessagingBase (0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47) {
    +++ description: None
      name:
-        "TokenMessaging"
+        "TokenMessagingBase"
    }
```

Generated with discovered.json: 0x7fedefb53025da7603b638ba63b5bd1103a5a990

# Diff at Mon, 14 Jul 2025 12:47:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 31337375
- current block number: 31337375

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 31337375 (main branch discovery), not current.

```diff
    contract StargatePoolUSDC (0x27a16dc786820B16E5c9028b75B99F6f604b5d26) {
    +++ description: None
      address:
-        "0x27a16dc786820B16E5c9028b75B99F6f604b5d26"
+        "base:0x27a16dc786820B16E5c9028b75B99F6f604b5d26"
      values.burnAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "base:0x1a44076050125825900e736c501f859c50fE728c"
      values.getAddressConfig.feeLib:
-        "0x08ed1d79D509A6f1020685535028ae60C144441E"
+        "base:0x08ed1d79D509A6f1020685535028ae60C144441E"
      values.getAddressConfig.planner:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "base:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
      values.getAddressConfig.treasurer:
-        "0xd47b03ee6d86Cf251ee7860FB2ACf9f91B9fD4d7"
+        "base:0xd47b03ee6d86Cf251ee7860FB2ACf9f91B9fD4d7"
      values.getAddressConfig.tokenMessaging:
-        "0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47"
+        "base:0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47"
      values.getAddressConfig.creditMessaging:
-        "0x12dC9256Acc9895B076f6638D628382881e62CeE"
+        "base:0x12dC9256Acc9895B076f6638D628382881e62CeE"
      values.getAddressConfig.lzToken:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.lpToken:
-        "0x53983F31E8E0D0c3Fd0b8d85654989A1336317d7"
+        "base:0x53983F31E8E0D0c3Fd0b8d85654989A1336317d7"
      values.owner:
-        "0x81EAb64E630C4a2E3E849268A6B64cb76D1C8109"
+        "base:0x81EAb64E630C4a2E3E849268A6B64cb76D1C8109"
      values.token:
-        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
+        "base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
      implementationNames.0x27a16dc786820B16E5c9028b75B99F6f604b5d26:
-        "StargatePoolUSDC"
      implementationNames.base:0x27a16dc786820B16E5c9028b75B99F6f604b5d26:
+        "StargatePoolUSDC"
    }
```

```diff
    contract TokenMessaging (0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47) {
    +++ description: None
      address:
-        "0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47"
+        "base:0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "base:0x1a44076050125825900e736c501f859c50fE728c"
      values.oApp:
-        "0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47"
+        "base:0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47"
      values.owner:
-        "0x81EAb64E630C4a2E3E849268A6B64cb76D1C8109"
+        "base:0x81EAb64E630C4a2E3E849268A6B64cb76D1C8109"
      values.planner:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "base:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
      values.pools.0:
-        "0x27a16dc786820B16E5c9028b75B99F6f604b5d26"
+        "base:0x27a16dc786820B16E5c9028b75B99F6f604b5d26"
      values.pools.1:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.pools.2:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.pools.3:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.pools.4:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.pools.5:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.pools.6:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.pools.7:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.pools.8:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.pools.9:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.pools.10:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.pools.11:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.pools.12:
-        "0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7"
+        "base:0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      implementationNames.0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47:
-        "TokenMessaging"
      implementationNames.base:0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47:
+        "TokenMessaging"
    }
```

```diff
    contract StargatePoolNative (0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7) {
    +++ description: None
      address:
-        "0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7"
+        "base:0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "base:0x1a44076050125825900e736c501f859c50fE728c"
      values.getAddressConfig.feeLib:
-        "0x17E450Be3Ba9557F2378E20d64AD417E59Ef9A34"
+        "base:0x17E450Be3Ba9557F2378E20d64AD417E59Ef9A34"
      values.getAddressConfig.planner:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "base:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
      values.getAddressConfig.treasurer:
-        "0xd47b03ee6d86Cf251ee7860FB2ACf9f91B9fD4d7"
+        "base:0xd47b03ee6d86Cf251ee7860FB2ACf9f91B9fD4d7"
      values.getAddressConfig.tokenMessaging:
-        "0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47"
+        "base:0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47"
      values.getAddressConfig.creditMessaging:
-        "0x12dC9256Acc9895B076f6638D628382881e62CeE"
+        "base:0x12dC9256Acc9895B076f6638D628382881e62CeE"
      values.getAddressConfig.lzToken:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.lpToken:
-        "0x98fB8522d891F43B771e2d27367b41Ba138D0B80"
+        "base:0x98fB8522d891F43B771e2d27367b41Ba138D0B80"
      values.owner:
-        "0x81EAb64E630C4a2E3E849268A6B64cb76D1C8109"
+        "base:0x81EAb64E630C4a2E3E849268A6B64cb76D1C8109"
      values.token:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      implementationNames.0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7:
-        "StargatePoolNative"
      implementationNames.base:0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7:
+        "StargatePoolNative"
    }
```

```diff
    EOA  (0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5) {
    +++ description: None
      address:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "base:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
    }
```

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

Generated with discovered.json: 0x2d57d0d7abe109a044415c610eab0c48bf9f88b7

# Diff at Mon, 09 Jun 2025 10:36:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7cc006dadcc55e6cce3be3eb03d491835943fb43 block: 30899167
- current block number: 31337375

## Description

config: add stargate pool shapes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30899167 (main branch discovery), not current.

```diff
    contract StargatePoolUSDC (0x27a16dc786820B16E5c9028b75B99F6f604b5d26) {
    +++ description: None
      template:
+        "stargate/StargatePoolUSDC"
    }
```

```diff
    contract StargatePoolNative (0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7) {
    +++ description: None
      template:
+        "stargate/StargatePoolNative"
    }
```

Generated with discovered.json: 0x75085d144ac06f3e84ed7d43448fe85ede0e1e7b

# Diff at Mon, 26 May 2025 15:50:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 29878348
- current block number: 30742564

## Description

deficit offset removed (fee related).

## Watched changes

```diff
    contract StargatePoolUSDC (0x27a16dc786820B16E5c9028b75B99F6f604b5d26) {
    +++ description: None
      values.deficitOffset:
-        1000000000000
+        0
    }
```

```diff
    contract StargatePoolNative (0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7) {
    +++ description: None
      values.deficitOffset:
-        "460000000000000000000"
+        0
    }
```

Generated with discovered.json: 0xac55385308557df1f3e9db47394c550d58fa6fa0

# Diff at Tue, 06 May 2025 15:41:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f365211458ce8b1ced035f6b5e4a56c9f10d2546 block: 26369623
- current block number: 29878348

## Description

Modified liquidity parameter deficitOffset for native and USDC pools.

## Watched changes

```diff
    contract StargatePoolUSDC (0x27a16dc786820B16E5c9028b75B99F6f604b5d26) {
    +++ description: None
      values.deficitOffset:
-        25000000000000
+        1000000000000
    }
```

```diff
    contract StargatePoolNative (0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7) {
    +++ description: None
      values.deficitOffset:
-        "11500000000000000000000"
+        "460000000000000000000"
    }
```

Generated with discovered.json: 0x9cee406ae5914e47050c51bbbed2d8059623e2e5

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
