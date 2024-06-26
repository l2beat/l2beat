Generated with discovered.json: 0xcc673138af48d16757f6966ebaee432bb682be6e

# Diff at Wed, 19 Jun 2024 09:05:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 6236827
- current block number: 6694912

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 6236827 (main branch discovery), not current.

```diff
    contract StargatePoolUSDC (0x3Fc69CC4A842838bCDC9499178740226062b14E4) {
    +++ description: None
      values.getAddressConfig:
-        ["0x503C5cFEa3477E0A576C8Cf5354023854b7A06Ff","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a","0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038","0x4694900bDbA99Edf07A2E46C4093f88F9106a90D","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x503C5cFEa3477E0A576C8Cf5354023854b7A06Ff","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a","tokenMessaging":"0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038","creditMessaging":"0x4694900bDbA99Edf07A2E46C4093f88F9106a90D","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract TokenMessaging (0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038) {
    +++ description: None
      values.oAppVersion:
-        [1,2]
+        {"senderVersion":1,"receiverVersion":2}
    }
```

```diff
    contract StargatePoolNative (0xC2b638Cb5042c1B3c5d5C969361fB50569840583) {
    +++ description: None
      values.getAddressConfig:
-        ["0x2A6c43e0DBDCde23d40c82F45682BC6D8A6dB219","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a","0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038","0x4694900bDbA99Edf07A2E46C4093f88F9106a90D","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x2A6c43e0DBDCde23d40c82F45682BC6D8A6dB219","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a","tokenMessaging":"0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038","creditMessaging":"0x4694900bDbA99Edf07A2E46C4093f88F9106a90D","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

Generated with discovered.json: 0x16b04cb2d5efecae87a9d19bcdbb08338b7ac17f

# Diff at Mon, 03 Jun 2024 11:10:21 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 6236827

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract StargatePoolUSDC (0x3Fc69CC4A842838bCDC9499178740226062b14E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessaging (0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolNative (0xC2b638Cb5042c1B3c5d5C969361fB50569840583)
    +++ description: None
```
