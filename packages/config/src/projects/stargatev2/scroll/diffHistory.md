Generated with discovered.json: 0xcd9e8aa221f0ed7cacd49ade7e6154ddff62c241

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
    contract TokenMessagingScroll (0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038) {
    +++ description: None
      name:
-        "TokenMessaging"
+        "TokenMessagingScroll"
    }
```

Generated with discovered.json: 0xfef8ec8db60829a4a2694cc2b84ffc45a29f7c87

# Diff at Mon, 14 Jul 2025 12:47:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 16325944
- current block number: 16325944

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16325944 (main branch discovery), not current.

```diff
    contract StargatePoolUSDC (0x3Fc69CC4A842838bCDC9499178740226062b14E4) {
    +++ description: None
      address:
-        "0x3Fc69CC4A842838bCDC9499178740226062b14E4"
+        "scr:0x3Fc69CC4A842838bCDC9499178740226062b14E4"
      values.burnAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "scr:0x1a44076050125825900e736c501f859c50fE728c"
      values.getAddressConfig.feeLib:
-        "0x503C5cFEa3477E0A576C8Cf5354023854b7A06Ff"
+        "scr:0x503C5cFEa3477E0A576C8Cf5354023854b7A06Ff"
      values.getAddressConfig.planner:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "scr:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
      values.getAddressConfig.treasurer:
-        "0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a"
+        "scr:0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a"
      values.getAddressConfig.tokenMessaging:
-        "0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038"
+        "scr:0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038"
      values.getAddressConfig.creditMessaging:
-        "0x4694900bDbA99Edf07A2E46C4093f88F9106a90D"
+        "scr:0x4694900bDbA99Edf07A2E46C4093f88F9106a90D"
      values.getAddressConfig.lzToken:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.lpToken:
-        "0x1eA77149Dfd4C80A753aaa39AaFC22453aefcc99"
+        "scr:0x1eA77149Dfd4C80A753aaa39AaFC22453aefcc99"
      values.owner:
-        "0xC02c4Ac2DBaA4eC11C306dDb0ABab5b421bd19fB"
+        "scr:0xC02c4Ac2DBaA4eC11C306dDb0ABab5b421bd19fB"
      values.token:
-        "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
+        "scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
      implementationNames.0x3Fc69CC4A842838bCDC9499178740226062b14E4:
-        "StargatePoolUSDC"
      implementationNames.scr:0x3Fc69CC4A842838bCDC9499178740226062b14E4:
+        "StargatePoolUSDC"
    }
```

```diff
    contract TokenMessaging (0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038) {
    +++ description: None
      address:
-        "0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038"
+        "scr:0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "scr:0x1a44076050125825900e736c501f859c50fE728c"
      values.oApp:
-        "0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038"
+        "scr:0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038"
      values.owner:
-        "0xC02c4Ac2DBaA4eC11C306dDb0ABab5b421bd19fB"
+        "scr:0xC02c4Ac2DBaA4eC11C306dDb0ABab5b421bd19fB"
      values.planner:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "scr:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
      values.pools.0:
-        "0x3Fc69CC4A842838bCDC9499178740226062b14E4"
+        "scr:0x3Fc69CC4A842838bCDC9499178740226062b14E4"
      values.pools.1:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.pools.2:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.pools.3:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.pools.4:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.pools.5:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.pools.6:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.pools.7:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.pools.8:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.pools.9:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.pools.10:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.pools.11:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.pools.12:
-        "0xC2b638Cb5042c1B3c5d5C969361fB50569840583"
+        "scr:0xC2b638Cb5042c1B3c5d5C969361fB50569840583"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      implementationNames.0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038:
-        "TokenMessaging"
      implementationNames.scr:0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038:
+        "TokenMessaging"
    }
```

```diff
    contract StargatePoolNative (0xC2b638Cb5042c1B3c5d5C969361fB50569840583) {
    +++ description: None
      address:
-        "0xC2b638Cb5042c1B3c5d5C969361fB50569840583"
+        "scr:0xC2b638Cb5042c1B3c5d5C969361fB50569840583"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "scr:0x1a44076050125825900e736c501f859c50fE728c"
      values.getAddressConfig.feeLib:
-        "0x2A6c43e0DBDCde23d40c82F45682BC6D8A6dB219"
+        "scr:0x2A6c43e0DBDCde23d40c82F45682BC6D8A6dB219"
      values.getAddressConfig.planner:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "scr:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
      values.getAddressConfig.treasurer:
-        "0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a"
+        "scr:0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a"
      values.getAddressConfig.tokenMessaging:
-        "0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038"
+        "scr:0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038"
      values.getAddressConfig.creditMessaging:
-        "0x4694900bDbA99Edf07A2E46C4093f88F9106a90D"
+        "scr:0x4694900bDbA99Edf07A2E46C4093f88F9106a90D"
      values.getAddressConfig.lzToken:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.lpToken:
-        "0x73424Acc8749b5c76c7AbBB1B17D1F18Ce0Bb092"
+        "scr:0x73424Acc8749b5c76c7AbBB1B17D1F18Ce0Bb092"
      values.owner:
-        "0xC02c4Ac2DBaA4eC11C306dDb0ABab5b421bd19fB"
+        "scr:0xC02c4Ac2DBaA4eC11C306dDb0ABab5b421bd19fB"
      values.token:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      implementationNames.0xC2b638Cb5042c1B3c5d5C969361fB50569840583:
-        "StargatePoolNative"
      implementationNames.scr:0xC2b638Cb5042c1B3c5d5C969361fB50569840583:
+        "StargatePoolNative"
    }
```

```diff
    EOA  (0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5) {
    +++ description: None
      address:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "scr:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
    }
```

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

Generated with discovered.json: 0x4064d11d50a28d51a240b85c57880658f2536cd1

# Diff at Mon, 09 Jun 2025 10:36:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7cc006dadcc55e6cce3be3eb03d491835943fb43 block: 16093852
- current block number: 16325944

## Description

config: add stargate pool shapes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16093852 (main branch discovery), not current.

```diff
    contract StargatePoolUSDC (0x3Fc69CC4A842838bCDC9499178740226062b14E4) {
    +++ description: None
      template:
+        "stargate/StargatePoolUSDC"
    }
```

```diff
    contract StargatePoolNative (0xC2b638Cb5042c1B3c5d5C969361fB50569840583) {
    +++ description: None
      template:
+        "stargate/StargatePoolNative"
    }
```

Generated with discovered.json: 0x830272cac4d7df63ae1078b2901d30f2372351e6

# Diff at Fri, 30 May 2025 06:49:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 15243619
- current block number: 16093852

## Description

deficitOffset removed (fee related).

## Watched changes

```diff
    contract StargatePoolNative (0xC2b638Cb5042c1B3c5d5C969361fB50569840583) {
    +++ description: None
      values.deficitOffset:
-        "280000000000000000000"
+        0
    }
```

Generated with discovered.json: 0x608bfabfb1990fa09f54c80f403b4289079aaf6c

# Diff at Tue, 06 May 2025 15:41:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f365211458ce8b1ced035f6b5e4a56c9f10d2546 block: 13418769
- current block number: 15243619

## Description

Modified liquidity parameter deficitOffset for native and USDC pools.

## Watched changes

```diff
    contract StargatePoolNative (0xC2b638Cb5042c1B3c5d5C969361fB50569840583) {
    +++ description: None
      values.deficitOffset:
-        "7000000000000000000000"
+        "280000000000000000000"
    }
```

Generated with discovered.json: 0x353a211ec57bff3b3b404b8ba45fd8a1a8df5c02

# Diff at Tue, 04 Mar 2025 10:42:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 13418769
- current block number: 13418769

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 13418769 (main branch discovery), not current.

```diff
    contract StargatePoolUSDC (0x3Fc69CC4A842838bCDC9499178740226062b14E4) {
    +++ description: None
      sinceBlock:
+        6044867
    }
```

```diff
    contract TokenMessaging (0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038) {
    +++ description: None
      sinceBlock:
+        6044870
    }
```

```diff
    contract StargatePoolNative (0xC2b638Cb5042c1B3c5d5C969361fB50569840583) {
    +++ description: None
      sinceBlock:
+        6044864
    }
```

Generated with discovered.json: 0x95bcd41295300487776a2a249f7437269d0a0cf3

# Diff at Fri, 14 Feb 2025 10:24:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 6694912
- current block number: 13418769

## Description

Deficit config adjustments affecting fee calculation.

## Watched changes

```diff
    contract StargatePoolNative (0xC2b638Cb5042c1B3c5d5C969361fB50569840583) {
    +++ description: None
      values.deficitOffset:
-        0
+        "7000000000000000000000"
    }
```

Generated with discovered.json: 0x20fde0f6b968744ad0afd150bbdcd06eacc746b4

# Diff at Mon, 14 Oct 2024 11:01:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 6694912
- current block number: 6694912

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 6694912 (main branch discovery), not current.

```diff
    contract StargatePoolUSDC (0x3Fc69CC4A842838bCDC9499178740226062b14E4) {
    +++ description: None
      sourceHashes:
+        ["0x0ef9b0bca6f74cd24daa9d50e734dfec2ecbc71cef5b209fa0c0f93561ad2640"]
    }
```

```diff
    contract TokenMessaging (0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038) {
    +++ description: None
      sourceHashes:
+        ["0xd0e407d7588e82d593435d256d12b9da5c2c70686a62e24948a96fcbc1a463b4"]
    }
```

```diff
    contract StargatePoolNative (0xC2b638Cb5042c1B3c5d5C969361fB50569840583) {
    +++ description: None
      sourceHashes:
+        ["0x63ac97930921267a1251904351ae2409e0d62d3d3c3fcb2ed7bc1fc4775321f7"]
    }
```

Generated with discovered.json: 0x5f1f695ec3c289c60391e21cb85c92052dd1abd8

# Diff at Tue, 30 Jul 2024 11:18:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 6694912
- current block number: 6694912

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 6694912 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x4e422B0aCb2Bd7e3aC70B5c0E5eb806e86a94038) {
    +++ description: None
      fieldMeta:
+        {"maxAssetId":{"description":"The highest currently registered assetID"}}
    }
```

Generated with discovered.json: 0x80c923d2c5bd9bd1bddbac9a3c1f0675e8523f3d

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
