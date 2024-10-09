Generated with discovered.json: 0x9af3b2d64815c50e0e3683c47cd8509f413ae863

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
