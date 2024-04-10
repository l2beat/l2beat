Generated with discovered.json: 0x0663df39f5325d336e38a6d1e1075581abfb9cf5

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
