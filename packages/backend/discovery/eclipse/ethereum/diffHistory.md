Generated with discovered.json: 0xe365aa15021cbf0ff69ff4c2eece6610f7372029

# Diff at Tue, 01 Oct 2024 10:50:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20775895
- current block number: 20775895

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775895 (main branch discovery), not current.

```diff
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-28T04:33:47.000Z",["0x338017E0f208b4EAF8Cd4BbDc8bdabEFd0e39bE9"]]]
    }
```

```diff
    contract Mailbox (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-28T04:37:47.000Z",["0x4ceF0fA54dC06CE0eA198DAb2F57D28A9deE712B"]]]
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-28T04:29:47.000Z",["0xa8E15d2B1bf6B0Fd3Bc9Ead06323c0730b67f8d4"]]]
    }
```

Generated with discovered.json: 0x0dab860a3d1959578632c86c3612ba6ead88f75b

# Diff at Wed, 18 Sep 2024 07:09:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@eb7065b62e0bf0e8e364b8897a969ab444bac4b4 block: 20756723
- current block number: 20775895

## Description

One signer removed from TreasuryOwner.

## Watched changes

```diff
    contract TreasuryOwner (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      values.$members.5:
-        "0x3392fd462d9710Fbf3A5703818b9920C119DC080"
      values.$members.4:
-        "0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
+        "0x3392fd462d9710Fbf3A5703818b9920C119DC080"
      values.$members.3:
-        "0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
+        "0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
      values.$members.2:
-        "0x33440E53476B855A56B831e7924B5aa123981726"
+        "0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 6 (33%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x06a3749952a97dd4187d39d935b01415ee491f40

# Diff at Sun, 15 Sep 2024 14:50:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20663231
- current block number: 20756723

## Description

Add two signers to the TreasuryOwner MS.

## Watched changes

```diff
    contract TreasuryOwner (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      values.$members.5:
+        "0x3392fd462d9710Fbf3A5703818b9920C119DC080"
      values.$members.4:
+        "0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
      values.$members.3:
-        "0x3392fd462d9710Fbf3A5703818b9920C119DC080"
+        "0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
      values.$members.2:
-        "0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
+        "0x33440E53476B855A56B831e7924B5aa123981726"
      values.$members.1:
-        "0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
+        "0x0706Ffc1722D53a85ba90f32807880ccee968Fed"
      values.$members.0:
-        "0x33440E53476B855A56B831e7924B5aa123981726"
+        "0xd0615B1D3F24f691153C076d45104eEd3eF8cDb5"
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "2 of 6 (33%)"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x0706Ffc1722D53a85ba90f32807880ccee968Fed)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GnosisSafe/GnosisSafe.sol       | 953 +++++++++++++++++++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |  35 +
 2 files changed, 988 insertions(+)
```

Generated with discovered.json: 0xd1d58883cb0cfd0b397d67fe177e27bc062d5ed2

# Diff at Mon, 02 Sep 2024 14:35:26 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@0161d2234a9db923bf3750678040cdffe671cd56 block: 20590601
- current block number: 20663231

## Description

Discovery of newly verified contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20590601 (main branch discovery), not current.

```diff
    contract TreasuryOwner (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      name:
-        "EclipseMultisig"
+        "TreasuryOwner"
    }
```

```diff
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      name:
-        "Contract3"
+        "EtherBridge"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x4720342419C1D316B948690d12C86D5b485C64E0"]}}
    }
```

```diff
    contract Mailbox (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      name:
-        "Contract1"
+        "Mailbox"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x4720342419C1D316B948690d12C86D5b485C64E0"]},"TRUSTED_RELAYER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x4720342419C1D316B948690d12C86D5b485C64E0"]},"MODULE_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1"]}}
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      name:
-        "Contract2"
+        "Treasury"
    }
```

```diff
+   Status: CREATED
    contract AuthorityMultisig (0x4720342419C1D316B948690d12C86D5b485C64E0)
    +++ description: None
```

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
