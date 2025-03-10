Generated with discovered.json: 0xf5bb34194f1ba245fa68a68406b69300d994b674

# Diff at Tue, 04 Mar 2025 10:40:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 131964914
- current block number: 131964914

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 131964914 (main branch discovery), not current.

```diff
    contract StargatePoolMigratable (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      sinceBlock:
+        120619124
    }
```

```diff
    contract StargatePoolUSDC (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      sinceBlock:
+        120619120
    }
```

```diff
    contract StargatePoolNative (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      sinceBlock:
+        120619116
    }
```

```diff
    contract TokenMessaging (0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6) {
    +++ description: None
      sinceBlock:
+        120619127
    }
```

Generated with discovered.json: 0x6c1efd0b8352484276f7aee323d18962af735f0a

# Diff at Fri, 14 Feb 2025 10:23:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 121594324
- current block number: 131964914

## Description

Deficit config adjustements affecting fee calculation.

## Watched changes

```diff
    contract StargatePoolUSDC (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      values.deficitOffset:
-        0
+        20000000000000
    }
```

```diff
    contract StargatePoolNative (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      values.deficitOffset:
-        0
+        "10000000000000000000000"
    }
```

Generated with discovered.json: 0x134087d1fcf3d608fd7594a01201ff2006d88c20

# Diff at Mon, 14 Oct 2024 11:00:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 121594324
- current block number: 121594324

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 121594324 (main branch discovery), not current.

```diff
    contract StargatePoolMigratable (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      sourceHashes:
+        ["0xad746913c310c0ee643e98f0a0f4bc6095877e7c82e0779cb5d5e852e0e12c8d"]
    }
```

```diff
    contract StargatePoolUSDC (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      sourceHashes:
+        ["0x0ef9b0bca6f74cd24daa9d50e734dfec2ecbc71cef5b209fa0c0f93561ad2640"]
    }
```

```diff
    contract StargatePoolNative (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      sourceHashes:
+        ["0x63ac97930921267a1251904351ae2409e0d62d3d3c3fcb2ed7bc1fc4775321f7"]
    }
```

```diff
    contract TokenMessaging (0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6) {
    +++ description: None
      sourceHashes:
+        ["0xd0e407d7588e82d593435d256d12b9da5c2c70686a62e24948a96fcbc1a463b4"]
    }
```

Generated with discovered.json: 0xc06182dd7701255295ca6a4cf2fa3ad0b3353b57

# Diff at Tue, 30 Jul 2024 11:18:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 121594324
- current block number: 121594324

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 121594324 (main branch discovery), not current.

```diff
    contract TokenMessaging (0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6) {
    +++ description: None
      fieldMeta:
+        {"maxAssetId":{"description":"The highest currently registered assetID"}}
    }
```

Generated with discovered.json: 0xcf80147b08109a31af791b260b43264da263fd73

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
