Generated with discovered.json: 0xd02bd71165e220e5eba7fa5d06458390b3ec4243

# Diff at Wed, 19 Jun 2024 08:56:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 217346877
- current block number: 223440408

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 217346877 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      values.oAppVersion:
-        [1,2]
+        {"senderVersion":1,"receiverVersion":2}
    }
```

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      values.getAddressConfig:
-        ["0xda82A31dF339BfDF0123661134b4DB63Cb1706f5","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","0x19cFCE47eD54a88614648DC3f19A5980097007dD","0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0xda82A31dF339BfDF0123661134b4DB63Cb1706f5","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","tokenMessaging":"0x19cFCE47eD54a88614648DC3f19A5980097007dD","creditMessaging":"0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract StargatePoolMigratable (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      values.getAddressConfig:
-        ["0x1F605162282570dFa6255D27895587f4117F52FA","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","0x19cFCE47eD54a88614648DC3f19A5980097007dD","0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x1F605162282570dFa6255D27895587f4117F52FA","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","tokenMessaging":"0x19cFCE47eD54a88614648DC3f19A5980097007dD","creditMessaging":"0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      values.getAddressConfig:
-        ["0x80F755e3091b2Ad99c08Da8D13E9C7635C1b8161","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","0x19cFCE47eD54a88614648DC3f19A5980097007dD","0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x80F755e3091b2Ad99c08Da8D13E9C7635C1b8161","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","tokenMessaging":"0x19cFCE47eD54a88614648DC3f19A5980097007dD","creditMessaging":"0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

Generated with discovered.json: 0xeff7c3c3afb58423406f923c724b4a1a75004850

# Diff at Sat, 01 Jun 2024 16:57:06 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 217346877

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolMigratable (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3)
    +++ description: None
```
