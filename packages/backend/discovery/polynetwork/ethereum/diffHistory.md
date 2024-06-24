Generated with discovered.json: 0x9d20595d6d303d75ced5c196ae7743c139121741

# Diff at Fri, 24 May 2024 14:51:03 GMT:

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

Generated with discovered.json: 0x48e744ad6d796aa184a485345c92fe404879996d
