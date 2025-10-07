Generated with discovered.json: 0x2e2a0b21b07f403c4743efa9cd259ecc6abd559e

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xdd1d9609c5de3f9155e5de642123c037f615b110

# Diff at Mon, 14 Jul 2025 12:45:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 20675914
- current block number: 20675914

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675914 (main branch discovery), not current.

```diff
    EOA  (0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57) {
    +++ description: None
      address:
-        "0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57"
+        "eth:0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57"
    }
```

```diff
    contract EthCrossChainManager (0x14413419452Aaf089762A0c5e95eD2A13bBC488C) {
    +++ description: Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs.
      address:
-        "0x14413419452Aaf089762A0c5e95eD2A13bBC488C"
+        "eth:0x14413419452Aaf089762A0c5e95eD2A13bBC488C"
      values.EthCrossChainDataAddress:
-        "0xcF2afe102057bA5c16f899271045a0A37fCb10f2"
+        "eth:0xcF2afe102057bA5c16f899271045a0A37fCb10f2"
      values.owner:
-        "0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
+        "eth:0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
      values.whiteLister:
-        "0x5De690a2f2b290E3De4F60c01CD2Be78C91A4e1E"
+        "eth:0x5De690a2f2b290E3De4F60c01CD2Be78C91A4e1E"
      implementationNames.0x14413419452Aaf089762A0c5e95eD2A13bBC488C:
-        "EthCrossChainManager"
      implementationNames.eth:0x14413419452Aaf089762A0c5e95eD2A13bBC488C:
+        "EthCrossChainManager"
    }
```

```diff
    contract Lock Proxy 1 (0x250e76987d838a75310c34bf422ea9f1AC4Cc906) {
    +++ description: None
      address:
-        "0x250e76987d838a75310c34bf422ea9f1AC4Cc906"
+        "eth:0x250e76987d838a75310c34bf422ea9f1AC4Cc906"
      values.managerProxyContract:
-        "0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
+        "eth:0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
      values.owner:
-        "0xB9078AC14fc8B9181B02368bA4E34DA53Bf43D02"
+        "eth:0xB9078AC14fc8B9181B02368bA4E34DA53Bf43D02"
      implementationNames.0x250e76987d838a75310c34bf422ea9f1AC4Cc906:
-        "LockProxy"
      implementationNames.eth:0x250e76987d838a75310c34bf422ea9f1AC4Cc906:
+        "LockProxy"
    }
```

```diff
    contract Lock Proxy 3 (0x3Ee764C95e9d2264DE3717a4CB45BCd3c5F00035) {
    +++ description: None
      address:
-        "0x3Ee764C95e9d2264DE3717a4CB45BCd3c5F00035"
+        "eth:0x3Ee764C95e9d2264DE3717a4CB45BCd3c5F00035"
      values.managerProxyContract:
-        "0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
+        "eth:0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
      values.owner:
-        "0x52D858ef5e0A768C80C38617eB8a7680f4D4d459"
+        "eth:0x52D858ef5e0A768C80C38617eB8a7680f4D4d459"
      implementationNames.0x3Ee764C95e9d2264DE3717a4CB45BCd3c5F00035:
-        ""
      implementationNames.eth:0x3Ee764C95e9d2264DE3717a4CB45BCd3c5F00035:
+        ""
    }
```

```diff
    contract Lock Proxy 7 (0x51ba447DaD1de30b91286471BcB570F69ECE968D) {
    +++ description: None
      address:
-        "0x51ba447DaD1de30b91286471BcB570F69ECE968D"
+        "eth:0x51ba447DaD1de30b91286471BcB570F69ECE968D"
      values.managerProxyContract:
-        "0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
+        "eth:0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
      values.owner:
-        "0xB9078AC14fc8B9181B02368bA4E34DA53Bf43D02"
+        "eth:0xB9078AC14fc8B9181B02368bA4E34DA53Bf43D02"
      implementationNames.0x51ba447DaD1de30b91286471BcB570F69ECE968D:
-        "LockProxy"
      implementationNames.eth:0x51ba447DaD1de30b91286471BcB570F69ECE968D:
+        "LockProxy"
    }
```

```diff
    EOA  (0x52D858ef5e0A768C80C38617eB8a7680f4D4d459) {
    +++ description: None
      address:
-        "0x52D858ef5e0A768C80C38617eB8a7680f4D4d459"
+        "eth:0x52D858ef5e0A768C80C38617eB8a7680f4D4d459"
    }
```

```diff
    contract Lock Proxy 4 (0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868) {
    +++ description: None
      address:
-        "0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868"
+        "eth:0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868"
      values.managerProxyContract:
-        "0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
+        "eth:0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
      values.owner:
-        "0xeF86b2c8740518548ae449c4C3892B4be0475d8c"
+        "eth:0xeF86b2c8740518548ae449c4C3892B4be0475d8c"
      implementationNames.0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868:
-        "LockProxy"
      implementationNames.eth:0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868:
+        "LockProxy"
    }
```

```diff
    contract EthCrossChainManagerProxy (0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb) {
    +++ description: Used to proxy requests from LockProxy to EthCrossChainManager and to pause/unpause it.
      address:
-        "0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
+        "eth:0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
      values.getEthCrossChainManager:
-        "0x14413419452Aaf089762A0c5e95eD2A13bBC488C"
+        "eth:0x14413419452Aaf089762A0c5e95eD2A13bBC488C"
      values.owner:
-        "0xdf408d52A717F7CF0c629CF8a8807f2455eAa671"
+        "eth:0xdf408d52A717F7CF0c629CF8a8807f2455eAa671"
      implementationNames.0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb:
-        "EthCrossChainManagerProxy"
      implementationNames.eth:0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb:
+        "EthCrossChainManagerProxy"
    }
```

```diff
    EOA  (0x5De690a2f2b290E3De4F60c01CD2Be78C91A4e1E) {
    +++ description: None
      address:
-        "0x5De690a2f2b290E3De4F60c01CD2Be78C91A4e1E"
+        "eth:0x5De690a2f2b290E3De4F60c01CD2Be78C91A4e1E"
    }
```

```diff
    contract Lock Proxy 6 (0x669E211454Ee9AAaf4C229A8985F5D20D3B5d1BC) {
    +++ description: None
      address:
-        "0x669E211454Ee9AAaf4C229A8985F5D20D3B5d1BC"
+        "eth:0x669E211454Ee9AAaf4C229A8985F5D20D3B5d1BC"
      implementationNames.0x669E211454Ee9AAaf4C229A8985F5D20D3B5d1BC:
-        ""
      implementationNames.eth:0x669E211454Ee9AAaf4C229A8985F5D20D3B5d1BC:
+        ""
    }
```

```diff
    EOA  (0x68BaeABc5Df1C6014F59bdFFCdc357bE3539b725) {
    +++ description: None
      address:
-        "0x68BaeABc5Df1C6014F59bdFFCdc357bE3539b725"
+        "eth:0x68BaeABc5Df1C6014F59bdFFCdc357bE3539b725"
    }
```

```diff
    contract Lock Proxy 2 (0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54) {
    +++ description: None
      address:
-        "0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54"
+        "eth:0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54"
      values.managerProxyContract:
-        "0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
+        "eth:0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
      values.owner:
-        "0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57"
+        "eth:0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57"
      implementationNames.0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54:
-        "LockProxyWithLP"
      implementationNames.eth:0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54:
+        "LockProxyWithLP"
    }
```

```diff
    contract PolyWrapper (0x81910675DbaF69deE0fD77570BFD07f8E436386A) {
    +++ description: None
      address:
-        "0x81910675DbaF69deE0fD77570BFD07f8E436386A"
+        "eth:0x81910675DbaF69deE0fD77570BFD07f8E436386A"
      values.feeCollector:
-        "0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57"
+        "eth:0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57"
+++ description: These addresses can escrow funds for the bridge.
+++ severity: HIGH
      values.lockProxyIndexMap.0:
-        "0x250e76987d838a75310c34bf422ea9f1AC4Cc906"
+        "eth:0x250e76987d838a75310c34bf422ea9f1AC4Cc906"
+++ description: These addresses can escrow funds for the bridge.
+++ severity: HIGH
      values.lockProxyIndexMap.1:
-        "0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54"
+        "eth:0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54"
+++ description: These addresses can escrow funds for the bridge.
+++ severity: HIGH
      values.lockProxyIndexMap.2:
-        "0x3Ee764C95e9d2264DE3717a4CB45BCd3c5F00035"
+        "eth:0x3Ee764C95e9d2264DE3717a4CB45BCd3c5F00035"
+++ description: These addresses can escrow funds for the bridge.
+++ severity: HIGH
      values.lockProxyIndexMap.3:
-        "0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868"
+        "eth:0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868"
+++ description: These addresses can escrow funds for the bridge.
+++ severity: HIGH
      values.lockProxyIndexMap.4:
-        "0xf6378141BC900020a438F3914e4C3ceA29907b27"
+        "eth:0xf6378141BC900020a438F3914e4C3ceA29907b27"
+++ description: These addresses can escrow funds for the bridge.
+++ severity: HIGH
      values.lockProxyIndexMap.5:
-        "0x669E211454Ee9AAaf4C229A8985F5D20D3B5d1BC"
+        "eth:0x669E211454Ee9AAaf4C229A8985F5D20D3B5d1BC"
+++ description: These addresses can escrow funds for the bridge.
+++ severity: HIGH
      values.lockProxyIndexMap.6:
-        "0x51ba447DaD1de30b91286471BcB570F69ECE968D"
+        "eth:0x51ba447DaD1de30b91286471BcB570F69ECE968D"
+++ description: These addresses can escrow funds for the bridge.
+++ severity: HIGH
      values.lockProxyIndexMap.7:
-        "0xead16Ae2c301C48Ea011A36Eef9337507673DFc0"
+        "eth:0xead16Ae2c301C48Ea011A36Eef9337507673DFc0"
      values.owner:
-        "0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57"
+        "eth:0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57"
      implementationNames.0x81910675DbaF69deE0fD77570BFD07f8E436386A:
-        "PolyWrapper"
      implementationNames.eth:0x81910675DbaF69deE0fD77570BFD07f8E436386A:
+        "PolyWrapper"
    }
```

```diff
    EOA  (0xB9078AC14fc8B9181B02368bA4E34DA53Bf43D02) {
    +++ description: None
      address:
-        "0xB9078AC14fc8B9181B02368bA4E34DA53Bf43D02"
+        "eth:0xB9078AC14fc8B9181B02368bA4E34DA53Bf43D02"
    }
```

```diff
    contract EthCrossChainData (0xcF2afe102057bA5c16f899271045a0A37fCb10f2) {
    +++ description: Used to store Keepers’ signatures and other parameters used by EthCrossChainManager.
      address:
-        "0xcF2afe102057bA5c16f899271045a0A37fCb10f2"
+        "eth:0xcF2afe102057bA5c16f899271045a0A37fCb10f2"
      values.owner:
-        "0x14413419452Aaf089762A0c5e95eD2A13bBC488C"
+        "eth:0x14413419452Aaf089762A0c5e95eD2A13bBC488C"
      implementationNames.0xcF2afe102057bA5c16f899271045a0A37fCb10f2:
-        "EthCrossChainData"
      implementationNames.eth:0xcF2afe102057bA5c16f899271045a0A37fCb10f2:
+        "EthCrossChainData"
    }
```

```diff
    EOA  (0xdf408d52A717F7CF0c629CF8a8807f2455eAa671) {
    +++ description: None
      address:
-        "0xdf408d52A717F7CF0c629CF8a8807f2455eAa671"
+        "eth:0xdf408d52A717F7CF0c629CF8a8807f2455eAa671"
    }
```

```diff
    contract Lock Proxy 8 (0xead16Ae2c301C48Ea011A36Eef9337507673DFc0) {
    +++ description: None
      address:
-        "0xead16Ae2c301C48Ea011A36Eef9337507673DFc0"
+        "eth:0xead16Ae2c301C48Ea011A36Eef9337507673DFc0"
      values.managerProxyContract:
-        "0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
+        "eth:0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
      values.owner:
-        "0x68BaeABc5Df1C6014F59bdFFCdc357bE3539b725"
+        "eth:0x68BaeABc5Df1C6014F59bdFFCdc357bE3539b725"
      implementationNames.0xead16Ae2c301C48Ea011A36Eef9337507673DFc0:
-        "LockProxy"
      implementationNames.eth:0xead16Ae2c301C48Ea011A36Eef9337507673DFc0:
+        "LockProxy"
    }
```

```diff
    EOA  (0xeF86b2c8740518548ae449c4C3892B4be0475d8c) {
    +++ description: None
      address:
-        "0xeF86b2c8740518548ae449c4C3892B4be0475d8c"
+        "eth:0xeF86b2c8740518548ae449c4C3892B4be0475d8c"
    }
```

```diff
    contract Lock Proxy 5 (0xf6378141BC900020a438F3914e4C3ceA29907b27) {
    +++ description: None
      address:
-        "0xf6378141BC900020a438F3914e4C3ceA29907b27"
+        "eth:0xf6378141BC900020a438F3914e4C3ceA29907b27"
      values.managerProxyContract:
-        "0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
+        "eth:0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb"
      values.owner:
-        "0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57"
+        "eth:0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57"
      implementationNames.0xf6378141BC900020a438F3914e4C3ceA29907b27:
-        "LockProxy"
      implementationNames.eth:0xf6378141BC900020a438F3914e4C3ceA29907b27:
+        "LockProxy"
    }
```

```diff
+   Status: CREATED
    contract EthCrossChainManager (0x14413419452Aaf089762A0c5e95eD2A13bBC488C)
    +++ description: Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs.
```

```diff
+   Status: CREATED
    contract Lock Proxy 1 (0x250e76987d838a75310c34bf422ea9f1AC4Cc906)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lock Proxy 3 (0x3Ee764C95e9d2264DE3717a4CB45BCd3c5F00035)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lock Proxy 7 (0x51ba447DaD1de30b91286471BcB570F69ECE968D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lock Proxy 4 (0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthCrossChainManagerProxy (0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb)
    +++ description: Used to proxy requests from LockProxy to EthCrossChainManager and to pause/unpause it.
```

```diff
+   Status: CREATED
    contract Lock Proxy 6 (0x669E211454Ee9AAaf4C229A8985F5D20D3B5d1BC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lock Proxy 2 (0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolyWrapper (0x81910675DbaF69deE0fD77570BFD07f8E436386A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthCrossChainData (0xcF2afe102057bA5c16f899271045a0A37fCb10f2)
    +++ description: Used to store Keepers’ signatures and other parameters used by EthCrossChainManager.
```

```diff
+   Status: CREATED
    contract Lock Proxy 8 (0xead16Ae2c301C48Ea011A36Eef9337507673DFc0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lock Proxy 5 (0xf6378141BC900020a438F3914e4C3ceA29907b27)
    +++ description: None
```

Generated with discovered.json: 0xc87e6b853f81d67370e6bb3d157da6a5e4055f47

# Diff at Mon, 12 May 2025 13:48:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e7801928b60345a3e550e0f818e51329f969ff6f block: 20675914
- current block number: 20675914

## Description

remove medium severity

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675914 (main branch discovery), not current.

```diff
    contract PolyWrapper (0x81910675DbaF69deE0fD77570BFD07f8E436386A) {
    +++ description: None
      fieldMeta.lockProxyIndexMap.severity:
-        "MEDIUM"
+        "HIGH"
    }
```

Generated with discovered.json: 0xbeceed5539acd44bf19c2c34ed8aeb0f58a167dd

# Diff at Tue, 04 Mar 2025 10:39:38 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20675914
- current block number: 20675914

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675914 (main branch discovery), not current.

```diff
    contract EthCrossChainManager (0x14413419452Aaf089762A0c5e95eD2A13bBC488C) {
    +++ description: Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs.
      sinceBlock:
+        13440588
    }
```

```diff
    contract Lock Proxy 1 (0x250e76987d838a75310c34bf422ea9f1AC4Cc906) {
    +++ description: None
      sinceBlock:
+        10785630
    }
```

```diff
    contract Lock Proxy 3 (0x3Ee764C95e9d2264DE3717a4CB45BCd3c5F00035) {
    +++ description: None
      sinceBlock:
+        14716305
    }
```

```diff
    contract Lock Proxy 7 (0x51ba447DaD1de30b91286471BcB570F69ECE968D) {
    +++ description: None
      sinceBlock:
+        17961570
    }
```

```diff
    contract Lock Proxy 4 (0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868) {
    +++ description: None
      sinceBlock:
+        15788266
    }
```

```diff
    contract EthCrossChainManagerProxy (0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb) {
    +++ description: Used to proxy requests from LockProxy to EthCrossChainManager and to pause/unpause it.
      sinceBlock:
+        10650143
    }
```

```diff
    contract Lock Proxy 6 (0x669E211454Ee9AAaf4C229A8985F5D20D3B5d1BC) {
    +++ description: None
      sinceBlock:
+        17832183
    }
```

```diff
    contract Lock Proxy 2 (0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54) {
    +++ description: None
      sinceBlock:
+        14066867
    }
```

```diff
    contract PolyWrapper (0x81910675DbaF69deE0fD77570BFD07f8E436386A) {
    +++ description: None
      sinceBlock:
+        14066885
    }
```

```diff
    contract EthCrossChainData (0xcF2afe102057bA5c16f899271045a0A37fCb10f2) {
    +++ description: Used to store Keepers’ signatures and other parameters used by EthCrossChainManager.
      sinceBlock:
+        10649082
    }
```

```diff
    contract Lock Proxy 8 (0xead16Ae2c301C48Ea011A36Eef9337507673DFc0) {
    +++ description: None
      sinceBlock:
+        19458874
    }
```

```diff
    contract Lock Proxy 5 (0xf6378141BC900020a438F3914e4C3ceA29907b27) {
    +++ description: None
      sinceBlock:
+        16024409
    }
```

Generated with discovered.json: 0xc457a7a31de0c3a641a3e428e8494978672e6b86

# Diff at Mon, 21 Oct 2024 12:47:23 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20675914
- current block number: 20675914

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675914 (main branch discovery), not current.

```diff
    contract EthCrossChainManager (0x14413419452Aaf089762A0c5e95eD2A13bBC488C) {
    +++ description: Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs.
      descriptions:
-        ["Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs."]
      description:
+        "Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs."
    }
```

```diff
    contract EthCrossChainManagerProxy (0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb) {
    +++ description: Used to proxy requests from LockProxy to EthCrossChainManager and to pause/unpause it.
      descriptions:
-        ["Used to proxy requests from LockProxy to EthCrossChainManager and to pause/unpause it."]
      description:
+        "Used to proxy requests from LockProxy to EthCrossChainManager and to pause/unpause it."
    }
```

```diff
    contract EthCrossChainData (0xcF2afe102057bA5c16f899271045a0A37fCb10f2) {
    +++ description: Used to store Keepers’ signatures and other parameters used by EthCrossChainManager.
      descriptions:
-        ["Used to store Keepers’ signatures and other parameters used by EthCrossChainManager."]
      description:
+        "Used to store Keepers’ signatures and other parameters used by EthCrossChainManager."
    }
```

Generated with discovered.json: 0x4b3a04870aef5f52d2f16cbb234f123bfb3e4069

# Diff at Mon, 14 Oct 2024 10:54:28 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20675914
- current block number: 20675914

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675914 (main branch discovery), not current.

```diff
    contract EthCrossChainManager (0x14413419452Aaf089762A0c5e95eD2A13bBC488C) {
    +++ description: Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs.
      sourceHashes:
+        ["0x221889e435e2f64e82619837d394394a6179db1932bfbbdedc0782fe358dffda"]
    }
```

```diff
    contract Lock Proxy 1 (0x250e76987d838a75310c34bf422ea9f1AC4Cc906) {
    +++ description: None
      sourceHashes:
+        ["0x2d120f7fb68dde6641e58f5786c8afcdb63926871f15f20ea7f9da917c31e255"]
    }
```

```diff
    contract Lock Proxy 7 (0x51ba447DaD1de30b91286471BcB570F69ECE968D) {
    +++ description: None
      sourceHashes:
+        ["0xed38088fe5df0eccdb8a218a37c99e8a09d2a807286624e96a1d50b4f6e57620"]
    }
```

```diff
    contract Lock Proxy 4 (0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868) {
    +++ description: None
      sourceHashes:
+        ["0xed38088fe5df0eccdb8a218a37c99e8a09d2a807286624e96a1d50b4f6e57620"]
    }
```

```diff
    contract EthCrossChainManagerProxy (0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb) {
    +++ description: Used to proxy requests from LockProxy to EthCrossChainManager and to pause/unpause it.
      sourceHashes:
+        ["0x59a4969b8c2f837444e679b13cbaec4730cc5ffe789f3e3e7b038b7e8d4a79d5"]
    }
```

```diff
    contract Lock Proxy 2 (0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54) {
    +++ description: None
      sourceHashes:
+        ["0x51007159d79f6f899952b6b5996a46b210e9b041665c5da2408c4f528b000bc3"]
    }
```

```diff
    contract PolyWrapper (0x81910675DbaF69deE0fD77570BFD07f8E436386A) {
    +++ description: None
      sourceHashes:
+        ["0xfbfc2095ce2f12ed5539dc7b6b1ee656eaf477f144685f6bb185c9aa8d6b4d42"]
    }
```

```diff
    contract EthCrossChainData (0xcF2afe102057bA5c16f899271045a0A37fCb10f2) {
    +++ description: Used to store Keepers’ signatures and other parameters used by EthCrossChainManager.
      sourceHashes:
+        ["0xd8a7f029fa8e1dabfbc9c64632f1959334147be1d784e585f99ad1e307ba11f7"]
    }
```

```diff
    contract Lock Proxy 8 (0xead16Ae2c301C48Ea011A36Eef9337507673DFc0) {
    +++ description: None
      sourceHashes:
+        ["0xba13e21f4e7ec8692a18d58c1a21540ef7c2bcfd9a72466af608976c7bc65081"]
    }
```

```diff
    contract Lock Proxy 5 (0xf6378141BC900020a438F3914e4C3ceA29907b27) {
    +++ description: None
      sourceHashes:
+        ["0xed38088fe5df0eccdb8a218a37c99e8a09d2a807286624e96a1d50b4f6e57620"]
    }
```

Generated with discovered.json: 0xcfa6483322dedf93564648f119e500d2ff23dea2

# Diff at Wed, 04 Sep 2024 08:07:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@878a951312cec062f5003f6749f781861b0cdba1 block: 20661268
- current block number: 20675914

## Description

Polynetwork bridge unpaused.

## Watched changes

```diff
    contract EthCrossChainManager (0x14413419452Aaf089762A0c5e95eD2A13bBC488C) {
    +++ description: Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs.
      values.paused:
-        true
+        false
    }
```

```diff
    contract EthCrossChainManagerProxy (0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb) {
    +++ description: Used to proxy requests from LockProxy to EthCrossChainManager and to pause/unpause it.
      values.paused:
-        true
+        false
    }
```

```diff
    contract EthCrossChainData (0xcF2afe102057bA5c16f899271045a0A37fCb10f2) {
    +++ description: Used to store Keepers’ signatures and other parameters used by EthCrossChainManager.
      values.paused:
-        true
+        false
    }
```

Generated with discovered.json: 0x865a8e739118900548347a9154da2e4a57703a09

# Diff at Mon, 02 Sep 2024 07:03:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fcb30f6c613b5454aa9ecdec05a118442e9dc7b block: 19940448
- current block number: 20661268

## Description

Bridge paused. Frontend will reflect this change.

## Watched changes

```diff
    contract EthCrossChainManager (0x14413419452Aaf089762A0c5e95eD2A13bBC488C) {
    +++ description: Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs.
      values.paused:
-        false
+        true
    }
```

```diff
    contract EthCrossChainManagerProxy (0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb) {
    +++ description: Used to proxy requests from LockProxy to EthCrossChainManager and to pause/unpause it.
      values.paused:
-        false
+        true
    }
```

```diff
    contract EthCrossChainData (0xcF2afe102057bA5c16f899271045a0A37fCb10f2) {
    +++ description: Used to store Keepers’ signatures and other parameters used by EthCrossChainManager.
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x1eba1523db535adcb520ecfc6989d6e1d9640800

# Diff at Tue, 30 Jul 2024 11:13:44 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 19940448
- current block number: 19940448

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19940448 (main branch discovery), not current.

```diff
    contract PolyWrapper (0x81910675DbaF69deE0fD77570BFD07f8E436386A) {
    +++ description: None
      fieldMeta:
+        {"lockProxyIndexMap":{"severity":"MEDIUM","description":"These addresses can escrow funds for the bridge."},"maxLockProxyIndex":{"severity":"LOW","description":"This is the number of lockProxy escrows registered in the bridge."}}
    }
```

Generated with discovered.json: 0x7a229cb612879eb7a330917e436b17362aaf241f

# Diff at Fri, 24 May 2024 14:51:03 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f82fa5e0969368ec249757214bf5b6997bebaa2d block: 19916953
- current block number: 19940448

## Description

Bridge is unpaused, will be reflected on the frontend.

## Watched changes

```diff
    contract EthCrossChainManager (0x14413419452Aaf089762A0c5e95eD2A13bBC488C) {
    +++ description: Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs.
      values.paused:
-        true
+        false
    }
```

```diff
    contract EthCrossChainManagerProxy (0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb) {
    +++ description: Used to proxy requests from LockProxy to EthCrossChainManager and to pause/unpause it.
      values.paused:
-        true
+        false
    }
```

```diff
    contract EthCrossChainData (0xcF2afe102057bA5c16f899271045a0A37fCb10f2) {
    +++ description: Used to store Keepers’ signatures and other parameters used by EthCrossChainManager.
      values.paused:
-        true
+        false
    }
```

Generated with discovered.json: 0x36183146b8e88cb6bc51dac6938cd3feddbbfa87

# Diff at Tue, 21 May 2024 08:01:02 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@c267ddeeb7465be57e3dbf6f73034309ff1087de block: 19581852
- current block number: 19916953

## Description

The EthCrossChainManager and EthCrossChainData are paused via the EthCrossChainManagerProxy.
May also be related to Poly Bridge [not accepting new deployments](https://x.com/PolyNetwork2/status/1778012918941892984) (though still servicing existing customers).

## Watched changes

```diff
    contract EthCrossChainManager (0x14413419452Aaf089762A0c5e95eD2A13bBC488C) {
    +++ description: Contract responsible for building cross-chain messages and validating incoming messages, including Merkle proofs.
      values.paused:
-        false
+        true
    }
```

```diff
    contract EthCrossChainManagerProxy (0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb) {
    +++ description: Used to proxy requests from LockProxy to EthCrossChainManager and to pause/unpause it.
      values.paused:
-        false
+        true
    }
```

```diff
    contract EthCrossChainData (0xcF2afe102057bA5c16f899271045a0A37fCb10f2) {
    +++ description: Used to store Keepers’ signatures and other parameters used by EthCrossChainManager.
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x9919c7a3a6ddca6c86cf7ac5d34ab31f6e4d13b1

# Diff at Thu, 04 Apr 2024 10:37:44 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4ff6489fa765a813647beab5080893a273f211d1 block: 17990915
- current block number: 19581852

## Description

A new lockProxy (escrow) is added to the main bridge contract.

## Watched changes

```diff
    contract PolyWrapper (0x81910675DbaF69deE0fD77570BFD07f8E436386A) {
    +++ description: None
+++ description: These addresses can escrow funds for the bridge.
+++ severity: MEDIUM
      values.lockProxyIndexMap.7:
+        "0xead16Ae2c301C48Ea011A36Eef9337507673DFc0"
+++ description: This is the number of lockProxy escrows registered in the bridge.
+++ severity: LOW
      values.maxLockProxyIndex:
-        7
+        8
    }
```

```diff
+   Status: CREATED
    contract Lock Proxy 8 (0xead16Ae2c301C48Ea011A36Eef9337507673DFc0)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.code/Lock Proxy 8/LockProxy.sol      | 1384 ++++++++++++++++++++
 .../ethereum/.code/Lock Proxy 8/meta.txt           |    2 +
 2 files changed, 1386 insertions(+)
```

