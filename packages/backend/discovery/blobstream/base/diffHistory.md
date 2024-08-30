Generated with discovered.json: 0x2e20fdb3b63a27ab6fc81362f871f62463707849

# Diff at Fri, 23 Aug 2024 09:57:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x804c9139ebaa21377c708ddf285fb1ef9f61c6dd

# Diff at Wed, 21 Aug 2024 10:07:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x8a16c522e63785ff3d9daf2c6fe3cfa751a29239

# Diff at Fri, 09 Aug 2024 10:13:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract BlobstreamXMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x793979789Ec179183E396e76c1e241bE0c9eE899","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x91D456f83f4a117B07866fdEdC29306f7E974e15"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x793979789Ec179183E396e76c1e241bE0c9eE899","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x91D456f83f4a117B07866fdEdC29306f7E974e15"]
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

Generated with discovered.json: 0x9d5433ede5f09e4abfa6b2718f3d959c01c645fa

# Diff at Tue, 30 Jul 2024 11:17:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      fieldMeta:
+        {"headerRangeProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX."},"nextHeaderProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX."}}
    }
```

Generated with discovered.json: 0x4b9f511ca9887f4a75d7e433e5398f5d19058446

# Diff at Sun, 05 May 2024 12:23:55 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@306760396dc5133ea2ec932bf81b9f36e88dbdd3 block: 12726128
- current block number: 14061228

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
