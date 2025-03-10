Generated with discovered.json: 0x6b3255da188718543973a1b1dfbd02c8a7597553

# Diff at Tue, 04 Mar 2025 10:40:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 305943129
- current block number: 305943129

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305943129 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      sinceBlock:
+        215658770
    }
```

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      sinceBlock:
+        215658702
    }
```

```diff
    contract StargatePoolMigratable (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      sinceBlock:
+        215658745
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      sinceBlock:
+        215658734
    }
```

Generated with discovered.json: 0x982358c1af2dfb055951961248fb16a5aa699dd2

# Diff at Fri, 14 Feb 2025 10:23:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 223440408
- current block number: 305943129

## Description

Deficit config adjustements affecting fee calculation.

## Watched changes

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      values.deficitOffset:
-        0
+        "15000000000000000000000"
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      values.deficitOffset:
-        0
+        50000000000000
    }
```

Generated with discovered.json: 0xca45510cadc304383d6833f32cb256416280101d

# Diff at Mon, 14 Oct 2024 10:59:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 223440408
- current block number: 223440408

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 223440408 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      sourceHashes:
+        ["0xd0e407d7588e82d593435d256d12b9da5c2c70686a62e24948a96fcbc1a463b4"]
    }
```

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      sourceHashes:
+        ["0x63ac97930921267a1251904351ae2409e0d62d3d3c3fcb2ed7bc1fc4775321f7"]
    }
```

```diff
    contract StargatePoolMigratable (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      sourceHashes:
+        ["0xad746913c310c0ee643e98f0a0f4bc6095877e7c82e0779cb5d5e852e0e12c8d"]
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      sourceHashes:
+        ["0x0ef9b0bca6f74cd24daa9d50e734dfec2ecbc71cef5b209fa0c0f93561ad2640"]
    }
```

Generated with discovered.json: 0x7559bc174f0a386821108794c4238dd4aa0e7dd4

# Diff at Tue, 30 Jul 2024 11:17:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 223440408
- current block number: 223440408

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 223440408 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      fieldMeta:
+        {"maxAssetId":{"description":"The highest currently registered assetID"}}
    }
```

Generated with discovered.json: 0xe9d32b44d18541b13a2f27fbd00584de6c3aec89

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
