Generated with discovered.json: 0x9bef2c3a881643b91efd62d012a10d55d9face55

# Diff at Tue, 04 Mar 2025 10:40:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21845003
- current block number: 21845003

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21845003 (main branch discovery), not current.

```diff
    contract DeleteIdentitiesVerifierLookupTable (0x39CcB3b670651a14da8b3835f42924f49C2C5986) {
    +++ description: None
      sinceBlock:
+        18987060
    }
```

```diff
    contract RegisterIdentitiesVerifierLookupTable (0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49) {
    +++ description: None
      sinceBlock:
+        17584527
    }
```

```diff
    contract DeleteVerifierSize100 (0x43B68ccBa7FC726540768fD1537c3179283140ed) {
    +++ description: None
      sinceBlock:
+        18987089
    }
```

```diff
    contract RegisterVerifierSize100 (0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258) {
    +++ description: None
      sinceBlock:
+        18967237
    }
```

```diff
    contract DeleteVerifierSize10 (0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1) {
    +++ description: None
      sinceBlock:
+        18987084
    }
```

```diff
    contract SemaphoreVerifier (0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5) {
    +++ description: None
      sinceBlock:
+        17584544
    }
```

```diff
    contract RegisterVerifierSize1200 (0xE44c83b9e1971A24EC698829297A0C4026B0CeF9) {
    +++ description: None
      sinceBlock:
+        18967248
    }
```

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      sinceBlock:
+        17636832
    }
```

```diff
    contract RegisterVerifierSize600 (0xFC1c26E964F791f81a33F49D91f79456891AA1c1) {
    +++ description: None
      sinceBlock:
+        18967244
    }
```

Generated with discovered.json: 0x7c9073b2478d0121e3cf233495042b32825b4004

# Diff at Fri, 14 Feb 2025 13:29:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 20922333
- current block number: 21845003

## Description

WorldIdIdentityManager2 admin, owner change (EOA).

## Watched changes

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      issuedPermissions.0.to:
-        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
+        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
      values.$admin:
-        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
+        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
      values.owner:
-        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
+        "0x96d55BD9c8C4706FED243c1e15825FF7854920fA"
    }
```

Generated with discovered.json: 0xef2da8c67b30bebcbc8f5c89fe5d1ad362505ddb

# Diff at Mon, 20 Jan 2025 11:10:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20922333
- current block number: 20922333

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20922333 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      issuedPermissions.0.target:
-        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
      issuedPermissions.0.to:
+        "0x9ad4EFAF9E326c17c3A7be6F5D167843Af0eb30A"
    }
```

Generated with discovered.json: 0xe57cdfb253e9f9f96688d6d9863edf4538e94063

# Diff at Mon, 21 Oct 2024 12:50:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20922333
- current block number: 20922333

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20922333 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      descriptions:
-        ["Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs."]
      description:
+        "Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs."
    }
```

Generated with discovered.json: 0x5f2e4f8fabff5372f3bcb234859ea159a0784373

# Diff at Mon, 21 Oct 2024 11:12:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20922333
- current block number: 20922333

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20922333 (main branch discovery), not current.

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      values.$pastUpgrades.2.2:
+        ["0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd"]
      values.$pastUpgrades.2.1:
-        ["0x521e8FB3A32Ea44237DC8b1E506dd78accFDf8Bd"]
+        "0xda23d7a260d4bee338a99c4c9c1cd82f329f2ac151286487c66681ea4a0ae5e6"
      values.$pastUpgrades.1.2:
+        ["0x2Ad412A1dF96434Eed0779D2dB4A8694a06132f8"]
      values.$pastUpgrades.1.1:
-        ["0x2Ad412A1dF96434Eed0779D2dB4A8694a06132f8"]
+        "0xaa68dea1046df37d3b0f21db95cfaa44fc4e1d01dcc523379270251989283dcb"
      values.$pastUpgrades.0.2:
+        ["0xa3cD15EBed6075E33a54483C59818bC43D57c556"]
      values.$pastUpgrades.0.1:
-        ["0xa3cD15EBed6075E33a54483C59818bC43D57c556"]
+        "0x0af02107fe8622db5d846e8d391b550adba8fd06dd3382b7296f5168b6308be3"
    }
```

Generated with discovered.json: 0x5bbd3c94b69fded49e2906cf815436af4c48c01a

# Diff at Mon, 14 Oct 2024 10:57:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20922333
- current block number: 20922333

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20922333 (main branch discovery), not current.

```diff
    contract DeleteIdentitiesVerifierLookupTable (0x39CcB3b670651a14da8b3835f42924f49C2C5986) {
    +++ description: None
      sourceHashes:
+        ["0x39eb56f7878719eefdfb5cc208bbd36b80989adf0ba642e7d2359973d08c8934"]
    }
```

```diff
    contract RegisterIdentitiesVerifierLookupTable (0x4055B6d4018e92e4d000865e61e87B57A4E5Ab49) {
    +++ description: None
      sourceHashes:
+        ["0x39eb56f7878719eefdfb5cc208bbd36b80989adf0ba642e7d2359973d08c8934"]
    }
```

```diff
    contract DeleteVerifierSize100 (0x43B68ccBa7FC726540768fD1537c3179283140ed) {
    +++ description: None
      sourceHashes:
+        ["0xc2565a490312be5d6a5b12bcb700c6fa795caab49384ab6d23343096134df95f"]
    }
```

```diff
    contract RegisterVerifierSize100 (0xb5f23A0c92F2f4aeE506FA3B1Cc2813820d13258) {
    +++ description: None
      sourceHashes:
+        ["0x7c8adbb6efe5b3350d779e102d5ae78fd639c4f8ceefafea77344463d5d8cc94"]
    }
```

```diff
    contract DeleteVerifierSize10 (0xCA7d6822b9c6913B1A1416cE30eF14c4e7f0bFb1) {
    +++ description: None
      sourceHashes:
+        ["0x82f68854d52503cd6c6f6ff3c97b47515d8e5b65abc2950508e18059dff0692f"]
    }
```

```diff
    contract SemaphoreVerifier (0xcDBbcd1cb0B642F8E324aB29C73A967b0C80Bad5) {
    +++ description: None
      sourceHashes:
+        ["0xb9149eadedcff671edd3913162a49203e7f35036cb983413e363562d5974f4b3"]
    }
```

```diff
    contract RegisterVerifierSize1200 (0xE44c83b9e1971A24EC698829297A0C4026B0CeF9) {
    +++ description: None
      sourceHashes:
+        ["0xbd34cc0d432d6d6834f925e6553abb9510b448b0eb25d2e40263813ad71f6f86"]
    }
```

```diff
    contract WorldIdIdentityManager2 (0xf7134CE138832c1456F2a91D64621eE90c2bddEa) {
    +++ description: Does what it says: Manages identities for Worldcoin. The identityOperator can register or delete identities by submitting zk proofs.
      sourceHashes:
+        ["0x3821412640509152c25bca5507532d7472607cede582ce50994edf3261f0ea9c","0xcac9e734a4cccc40bec37b5168f307cca5054c69434c136f131ee1ee0a6a555d"]
    }
```

```diff
    contract RegisterVerifierSize600 (0xFC1c26E964F791f81a33F49D91f79456891AA1c1) {
    +++ description: None
      sourceHashes:
+        ["0xca7e21152b6ce21c64fdb15e8d8e9ac03809d3f499f232454a62e8060acbc3b9"]
    }
```

Generated with discovered.json: 0xc090690b6d65a34a13d7d0538b596ee5b61993d7

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
