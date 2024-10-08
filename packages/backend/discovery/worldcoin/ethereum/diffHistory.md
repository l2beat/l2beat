Generated with discovered.json: 0x325f7b9ddc6138a776bf39b0e2db43ff11188bf9

# Diff at Tue, 08 Oct 2024 17:23:55 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 20432514
- current block number: 20922333

## Description

New identityOperator EOA.

## Watched changes

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
+++ description: Can call functions (manage identities) in the WorldIdIdentityManager2 implementation
      values.identityOperator:
-        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
+        "0xE2DA046340e00264C4F0443243a0565007AE08AC"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432514 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      descriptions:
+        ["Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs."]
      fieldMeta:
+        {"identityOperator":{"description":"Can call functions (manage identities) in the WorldIdIdentityManager2 implementation"}}
    }
```

Generated with discovered.json: 0x96a26211df9aa68ac085af198ba101729d6b20bd

# Diff at Tue, 01 Oct 2024 11:11:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20432514
- current block number: 20432514

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432514 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-06T19:19:11.000Z",["0xa3cD15EBed6075E33a54483C59818bC43D57c556"]],["2023-08-18T17:12:23.000Z",["0x2Ad412A1dF96434Eed0779D2dB4A8694a06132f8"]],["2024-01-12T00:00:23.000Z",["0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd"]]]
    }
```

Generated with discovered.json: 0x2e81c05e7db49aa9410691675b939ba0db695cff

# Diff at Fri, 23 Aug 2024 09:56:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20432514
- current block number: 20432514

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432514 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x3a4b62d77db367c176ad873c3200e8296ef4b785

# Diff at Wed, 21 Aug 2024 10:06:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20432514
- current block number: 20432514

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432514 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A","via":[]}]
    }
```

Generated with discovered.json: 0x3759828a64294cbc3e7886ec2441fb2de28e4ea2

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
