Generated with discovered.json: 0x69b4ca88a08532e5b927f8070fe227027e5c3602

# Diff at Fri, 30 Aug 2024 07:52:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20590601
- current block number: 20590601

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20590601 (main branch discovery), not current.

```diff
    contract EclipseMultisig (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x0af9f27d0573e340b5d12bb19153c66199e89538

# Diff at Fri, 23 Aug 2024 10:14:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@80160913ce929ca5561025619766d621d08704f0 block: 20512023
- current block number: 20590601

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512023 (main branch discovery), not current.

```diff
    contract Contract3 (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      unverified:
-        true
      values.$upgradeCount:
+        1
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.ETHER_BRIDGE_ID:
+        "0x0bcb6b0b9168c058e28754b0255038028ff8515b5755d989d746fdd8b8f11d7e"
      values.getVersionComponents:
+        {"major":1,"minor":0,"patch":0}
      values.MIN_DEPOSIT:
+        2000000000000000
      values.paused:
+        false
      values.proxiableUUID:
+        "EXPECT_REVERT"
      values.UPGRADE_INTERFACE_VERSION:
+        "5.0.0"
    }
```

```diff
    contract Contract1 (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      unverified:
-        true
      values.$upgradeCount:
+        1
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.getVersionComponents:
+        {"major":1,"minor":0,"patch":0}
      values.MODULE_ROLE:
+        "0x5098275140f5753db46c42f6e139939968848633a1298402189fdfdafa69b453"
      values.proxiableUUID:
+        "EXPECT_REVERT"
      values.TRUSTED_RELAYER_ROLE:
+        "0xe8a0628d2ba937241981f34311d9db59dd5cf223365e8b6132bca13fc7ae519c"
      values.UPGRADE_INTERFACE_VERSION:
+        "5.0.0"
    }
```

```diff
    contract Contract2 (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      unverified:
-        true
      values.$upgradeCount:
+        1
      values.getVersionComponents:
+        {"major":1,"minor":0,"patch":0}
      values.owner:
+        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.paused:
+        false
      values.pendingOwner:
+        "0x0000000000000000000000000000000000000000"
      values.proxiableUUID:
+        "EXPECT_REVERT"
      values.UPGRADE_INTERFACE_VERSION:
+        "5.0.0"
    }
```

Generated with discovered.json: 0xe03dfb2a6dd1ed68503a47ad387a81dd44c5be5d

# Diff at Wed, 21 Aug 2024 10:02:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20512023
- current block number: 20512023

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512023 (main branch discovery), not current.

```diff
    contract EclipseMultisig (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xD7E4b67E735733aC98a88F13d087D8aac670E644"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xD7E4b67E735733aC98a88F13d087D8aac670E644","via":[]}]
    }
```

```diff
    contract Contract3 (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract Contract1 (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract Contract2 (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC","via":[]}]
    }
```

Generated with discovered.json: 0xf211bfdcc94c6dd53cc0a2e3c91beb23eb9c3024

# Diff at Mon, 12 Aug 2024 10:45:43 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20512023

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract EclipseMultisig (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contract3 (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contract1 (0xb23B2492f7A9631104A5877F7FFA00633660968d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contract2 (0xD7E4b67E735733aC98a88F13d087D8aac670E644)
    +++ description: None
```
