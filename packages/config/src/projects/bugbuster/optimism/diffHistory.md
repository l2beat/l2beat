Generated with discovered.json: 0x9b66088a58f4ca149d063249fff96a652a414490

# Diff at Tue, 04 Mar 2025 10:40:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 125928338
- current block number: 125928338

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 125928338 (main branch discovery), not current.

```diff
    contract History (0x04395d494624D2B6e30C0dfDB74498a2839f805d) {
    +++ description: None
      sinceBlock:
+        121950726
    }
```

```diff
    contract BugBuster (0x3FF5C7383F614256053c3F6B86A47bA974937299) {
    +++ description: None
      sinceBlock:
+        125600141
    }
```

```diff
    contract Authority (0x4246F5b1E52Fef1C52c96a9b1B679AE818d4fb35) {
    +++ description: None
      sinceBlock:
+        121950726
    }
```

```diff
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768) {
    +++ description: None
      sinceBlock:
+        107432991
    }
```

```diff
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB) {
    +++ description: None
      sinceBlock:
+        107432999
    }
```

Generated with discovered.json: 0x6501bd3170a1b94606441125e6b0d50d385e27d4

# Diff at Mon, 14 Oct 2024 10:59:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 125928338
- current block number: 125928338

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 125928338 (main branch discovery), not current.

```diff
    contract History (0x04395d494624D2B6e30C0dfDB74498a2839f805d) {
    +++ description: None
      sourceHashes:
+        ["0x10336484f22cf6f3d30e974fe43a4aa644807bee582c7ee3c03b116024554eaa"]
    }
```

```diff
    contract BugBuster (0x3FF5C7383F614256053c3F6B86A47bA974937299) {
    +++ description: None
      sourceHashes:
+        ["0x4ea587588e6035764e827917418aee9c41a353454a7a13fe807ca56724350d47"]
    }
```

```diff
    contract Authority (0x4246F5b1E52Fef1C52c96a9b1B679AE818d4fb35) {
    +++ description: None
      sourceHashes:
+        ["0xe4cf627ec9b7ed3b6b18711555d50a7002525d34e84a6242a2b1bd41aedb2f11"]
    }
```

```diff
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768) {
    +++ description: None
      sourceHashes:
+        ["0x3bfaa3fe125375dfb9181df0c144cda2b17aa368e57292e88d6258c4aafe51ed"]
    }
```

```diff
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB) {
    +++ description: None
      sourceHashes:
+        ["0x0cb29769a693a89712c9c05a29f52a6e610ed38585db5d66f1fc56118e39493d"]
    }
```

Generated with discovered.json: 0xa5f15b4ed10bd06bfa754fc05d5a8cf72d0be2c6

# Diff at Fri, 27 Sep 2024 16:44:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@98e7ecc4d6c0db1985b809fcd6d7cdf4fe04997c block: 124709499
- current block number: 125928338

## Description

Bug buster was redeployed to bring a bounty for the latest solidity compiler version(v0.8.27). New CartesiDAPP(Bugbuster) added to discovery (code-identical except for compiler version).

## Watched changes

```diff
+   Status: CREATED
    contract History (0x04395d494624D2B6e30C0dfDB74498a2839f805d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BugBuster (0x3FF5C7383F614256053c3F6B86A47bA974937299)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Authority (0x4246F5b1E52Fef1C52c96a9b1B679AE818d4fb35)
    +++ description: None
```

## Source code changes

```diff
.../bugbuster/optimism/.flat/Authority.sol         |  202 ++++
 .../bugbuster/optimism/.flat/BugBuster.sol         | 1122 ++++++++++++++++++++
 .../bugbuster/optimism/.flat/History.sol           |  247 +++++
 3 files changed, 1571 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 124709499 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract History (0x04395d494624D2B6e30C0dfDB74498a2839f805d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Authority (0x4246F5b1E52Fef1C52c96a9b1B679AE818d4fb35)
    +++ description: None
```

```diff
-   Status: DELETED
    contract BugBuster (0x9cb6C6E904cE6BF3Ca6d0002b9629acce74Ea89b)
    +++ description: None
```

Generated with discovered.json: 0x8cb2d514045a21dcb252e80f1880055b9e6a2591

# Diff at Fri, 30 Aug 2024 11:36:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 124709499

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract History (0x04395d494624D2B6e30C0dfDB74498a2839f805d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Authority (0x4246F5b1E52Fef1C52c96a9b1B679AE818d4fb35)
    +++ description: None
```

```diff
+   Status: CREATED
    contract InputBox (0x59b22D57D4f067708AB0c00552767405926dc768)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Portal (0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BugBuster (0x9cb6C6E904cE6BF3Ca6d0002b9629acce74Ea89b)
    +++ description: None
```
