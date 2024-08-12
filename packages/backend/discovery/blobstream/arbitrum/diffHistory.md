Generated with discovered.json: 0x4c7a20502a211b09faf6b16b6ceec3ab43466504

# Diff at Fri, 09 Aug 2024 10:13:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 208089280
- current block number: 208089280

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract BlobstreamXMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x91D456f83f4a117B07866fdEdC29306f7E974e15","0x793979789Ec179183E396e76c1e241bE0c9eE899","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x91D456f83f4a117B07866fdEdC29306f7E974e15","0x793979789Ec179183E396e76c1e241bE0c9eE899","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract SuccinctMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x4fca5e622ef070699be15d6c5c980cac2309d296

# Diff at Tue, 30 Jul 2024 11:17:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 208089280
- current block number: 208089280

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      fieldMeta:
+        {"headerRangeProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX."},"nextHeaderProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX."}}
    }
```

Generated with discovered.json: 0x7285e99c4ab1b39cc0094977b44e197d8e3bfdec

# Diff at Sun, 05 May 2024 12:28:41 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@306760396dc5133ea2ec932bf81b9f36e88dbdd3 block: 197829534
- current block number: 208089280

## Description

A prover / relayer is added to the Succictgateway. It is whitelisted for both functionIds (headerRange and nextHeader) of BlobstreamX.
Same change as on Base.

## Watched changes

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

```diff
    contract BlobstreamXMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: Admin of the BlobstreamX contract. VerifierOwner of the BlobstreamX functionIDs in the SuccinctGateway.
      values.nonce:
-        6
+        7
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 197829534 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.headerRangeProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.headerRangeVerifierOwner:
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.nextHeaderProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.nextHeaderVerifierOwner:
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
    }
```

```diff
    contract GnosisSafeL2 (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "BlobstreamXMultisig"
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

Generated with discovered.json: 0xa83178f53f6a63952fe8b5488d76a52bd121cead

# Diff at Fri, 05 Apr 2024 11:41:00 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6e27442909c4cbe26f03c6413f64274ff68aa0d7 block: 197243619
- current block number: 197829534

## Description

No changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 197243619 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
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

Generated with discovered.json: 0x2990628bad137a08bd1e6cf7186a0989a1dc8319

# Diff at Wed, 03 Apr 2024 18:46:58 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 197243619

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997)
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
    contract FunctionVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C)
    +++ description: None
```
