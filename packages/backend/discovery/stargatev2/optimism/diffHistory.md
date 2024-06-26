Generated with discovered.json: 0xf94ef1b6b79919a30fad19c7f7d95d3a941adcf7

# Diff at Wed, 19 Jun 2024 08:57:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 120831122
- current block number: 121594324

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 120831122 (main branch discovery), not current.

```diff
    contract StargatePoolMigratable (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      values.getAddressConfig:
-        ["0x3da4f8E456AC648c489c286B99Ca37B666be7C4C","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x644abb1e17291b4403966119d15Ab081e4a487e9","0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","0xda82A31dF339BfDF0123661134b4DB63Cb1706f5","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x3da4f8E456AC648c489c286B99Ca37B666be7C4C","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x644abb1e17291b4403966119d15Ab081e4a487e9","tokenMessaging":"0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","creditMessaging":"0xda82A31dF339BfDF0123661134b4DB63Cb1706f5","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract StargatePoolUSDC (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      values.getAddressConfig:
-        ["0x1F605162282570dFa6255D27895587f4117F52FA","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x644abb1e17291b4403966119d15Ab081e4a487e9","0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","0xda82A31dF339BfDF0123661134b4DB63Cb1706f5","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x1F605162282570dFa6255D27895587f4117F52FA","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x644abb1e17291b4403966119d15Ab081e4a487e9","tokenMessaging":"0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","creditMessaging":"0xda82A31dF339BfDF0123661134b4DB63Cb1706f5","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract StargatePoolNative (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      values.getAddressConfig:
-        ["0x80F755e3091b2Ad99c08Da8D13E9C7635C1b8161","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x644abb1e17291b4403966119d15Ab081e4a487e9","0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","0xda82A31dF339BfDF0123661134b4DB63Cb1706f5","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x80F755e3091b2Ad99c08Da8D13E9C7635C1b8161","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x644abb1e17291b4403966119d15Ab081e4a487e9","tokenMessaging":"0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","creditMessaging":"0xda82A31dF339BfDF0123661134b4DB63Cb1706f5","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract TokenMessaging (0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6) {
    +++ description: None
      values.oAppVersion:
-        [1,2]
+        {"senderVersion":1,"receiverVersion":2}
    }
```

Generated with discovered.json: 0x564e6558b2ec07a11ecf284f1ec1be33c7e39187

# Diff at Sat, 01 Jun 2024 16:56:52 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 120831122

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract StargatePoolMigratable (0x19cFCE47eD54a88614648DC3f19A5980097007dD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolUSDC (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolNative (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessaging (0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6)
    +++ description: None
```
