Generated with discovered.json: 0x947491dcbcecfc25c6effb9ff344b6b2c44662f7

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
