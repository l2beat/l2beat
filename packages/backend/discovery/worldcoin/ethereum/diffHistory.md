Generated with discovered.json: 0xa1c1dcd068e7ac61421a444b4c574a09b2331940

# Diff at Wed, 29 May 2024 15:05:45 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19831219
- current block number: 19976298

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831219 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
    }
```

Generated with discovered.json: 0x2ba241edec2c6159161163d4edcd345d773b403a

# Diff at Thu, 09 May 2024 08:14:02 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19831219

## Description

Added worldcoin discovery. In particular this is needed for the ZK Catalog.

## Initial discovery

```diff
+   Status: CREATED
    contract DeleteIdentitiesVerifierLookupTable (0x39CcB3b670651a14da8b3835f42924f49C2C5986)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterIdentitiesVerifierLookupTable (0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeleteVerifierSize100 (0x43B68ccBa7FC726540768fD1537c3179283140ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterVerifierSize100 (0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeleteVerifierSize10 (0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SemaphoreVerifier (0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterVerifierSize1200 (0xE44c83b9e1971A24EC698829297A0C4026B0CeF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegisterVerifierSize600 (0xFC1c26E964F791f81a33F49D91f79456891AA1c1)
    +++ description: None
```
