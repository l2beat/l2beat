## Diff at Fri, 22 Sep 2023 11:25:03 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@1312187d41931ca505cc65eca063068109ff1771

```diff
-   Status: DELETED
    contract FflonkVerifier (0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9) {
    }
```

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      upgradeability.implementation:
-        "0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"
+        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
      values.forkID:
-        4
+        5
      values.rollupVerifier:
-        "0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9"
+        "0x21f65deadb3b85082BA99766f323bEA90eb5a3D6"
      values.lastVerifiedBatchBeforeUpgrade:
+        813266
      values.version:
+        1
      values.VERSION_BEFORE_UPGRADE:
+        0
      derivedName:
-        "PolygonZkEVM"
+        "PolygonZkEVMUpgraded"
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x21f65deadb3b85082BA99766f323bEA90eb5a3D6) {
    }
```
