Generated with discovered.json: 0xcfa6483322dedf93564648f119e500d2ff23dea2

# Diff at Wed, 04 Sep 2024 08:07:09 GMT:

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
