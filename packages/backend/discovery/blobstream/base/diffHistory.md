Generated with discovered.json: 0x734b2dd3dab2dd46bab0bed01d775d4c066bddd1

# Diff at Thu, 02 May 2024 15:09:09 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f48906dbf2827724edb3f6c606a2b88427c1e712 block: 12726128
- current block number: 13936597

## Description

A prover / relayer is added to the Succictgateway. It is whitelisted for both functionIds (headerRange and nextHeader) of BlobstreamX.
Same change as on Arbitrum.

## Watched changes

```diff
    contract BlobstreamXMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: Admin of the BlobstreamX contract. VerifierOwner of the BlobstreamX functionIDs in the SuccinctGateway.
      values.nonce:
-        6
+        7
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.headerRangeProvers.1:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.nextHeaderProvers.1:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 12726128 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract FunctionVerifier (0x294A466b50672029D0a8d7ad7E00AEfDeaE9f529)
    +++ description: None
```

```diff
    contract GnosisSafeL2 (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "BlobstreamXMultisig"
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      values.headerRangeVerifier:
-        "0x294A466b50672029D0a8d7ad7E00AEfDeaE9f529"
+        "0xF2415C44F47983F7dD22003B46A034B1F1d04e44"
      values.nextHeaderVerifier:
-        "0xeEadfac6E689443d237B10F78e8424579e2e0177"
+        "0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.headerRangeProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.headerRangeVerifierOwner:
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.nextHeaderProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.nextHeaderVerifierOwner:
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
    }
```

```diff
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "SuccinctMultisig"
    }
```

```diff
-   Status: DELETED
    contract FunctionVerifier (0xeEadfac6E689443d237B10F78e8424579e2e0177)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0xF2415C44F47983F7dD22003B46A034B1F1d04e44)
    +++ description: None
```

Generated with discovered.json: 0xf4ce8849740c932ad0e0f9eb9bc6e239c3ae5dd0

# Diff at Thu, 04 Apr 2024 14:40:31 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0a9c7969ad2049584096c517179c4a4990f064bd block: 12672692
- current block number: 12726128

## Description

Threshold config related change. Onchain unchanged.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 12672692 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x2aff9bf22d03c54504e3e165ecb551663cc6317b

# Diff at Wed, 03 Apr 2024 08:59:00 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 12672692

## Description

Initial discovery

## Initial discovery

```diff
+   Status: CREATED
    contract FunctionVerifier (0x294A466b50672029D0a8d7ad7E00AEfDeaE9f529)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0xeEadfac6E689443d237B10F78e8424579e2e0177)
    +++ description: None
```
