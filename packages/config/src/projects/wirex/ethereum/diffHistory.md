Generated with discovered.json: 0x6e1e6d5aa893f72bc0b4c495b637f9b94ab5f009

# Diff at Mon, 14 Jul 2025 12:46:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22187530
- current block number: 22187530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22187530 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      address:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81"
      implementationNames.0x0775e11309d75aA6b0967917fB0213C5673eDf81:
-        "FflonkVerifier"
      implementationNames.eth:0x0775e11309d75aA6b0967917fB0213C5673eDf81:
+        "FflonkVerifier"
    }
```

```diff
    EOA  (0x0AE999d2d668f12f2b46C4Fd3e13A32D478A9164) {
    +++ description: None
      address:
-        "0x0AE999d2d668f12f2b46C4Fd3e13A32D478A9164"
+        "eth:0x0AE999d2d668f12f2b46C4Fd3e13A32D478A9164"
    }
```

```diff
    contract ProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      address:
-        "0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"
+        "eth:0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"
      values.owner:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
+        "eth:0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
      implementationNames.0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78:
-        "ProxyAdmin"
      implementationNames.eth:0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x57d836bD4834bc2DB8C3F9Eb769cEbC0d93E6986) {
    +++ description: None
      address:
-        "0x57d836bD4834bc2DB8C3F9Eb769cEbC0d93E6986"
+        "eth:0x57d836bD4834bc2DB8C3F9Eb769cEbC0d93E6986"
    }
```

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      address:
-        "0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
+        "eth:0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
      values.$admin:
-        "0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"
+        "eth:0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"
      values.$implementation:
-        "0xAce9269EaC3419937093154dea0AD44C36Df6963"
+        "eth:0xAce9269EaC3419937093154dea0AD44C36Df6963"
      values.$pastUpgrades.0.2.0:
-        "0xAce9269EaC3419937093154dea0AD44C36Df6963"
+        "eth:0xAce9269EaC3419937093154dea0AD44C36Df6963"
      values.members.0.addr:
-        "0x57d836bD4834bc2DB8C3F9Eb769cEbC0d93E6986"
+        "eth:0x57d836bD4834bc2DB8C3F9Eb769cEbC0d93E6986"
      values.members.1.addr:
-        "0xee754f8Da8e2D8F0F97f6EBe1554390c0266d4d0"
+        "eth:0xee754f8Da8e2D8F0F97f6EBe1554390c0266d4d0"
      values.owner:
-        "0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
+        "eth:0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
      implementationNames.0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5:
-        "TransparentUpgradeableProxy"
      implementationNames.0xAce9269EaC3419937093154dea0AD44C36Df6963:
-        "PolygonDataCommittee"
      implementationNames.eth:0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xAce9269EaC3419937093154dea0AD44C36Df6963:
+        "PolygonDataCommittee"
    }
```

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      address:
-        "0x78253E2E6120164bd826668A4C96Db20f78A94c9"
+        "eth:0x78253E2E6120164bd826668A4C96Db20f78A94c9"
      values.$admin:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.$implementation:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+        "eth:0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
      values.$pastUpgrades.0.2.0:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+        "eth:0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
      values.admin:
-        "0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
+        "eth:0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
      values.bridgeAddress:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.dataAvailabilityProtocol:
-        "0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
+        "eth:0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
+++ description: If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone.
+++ severity: HIGH
      values.forceBatchAddress:
-        "0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A"
+        "eth:0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A"
      values.gasTokenAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.GLOBAL_EXIT_ROOT_MANAGER_L2:
-        "0xa40D5f56745a118D0906a34E69aeC8C0Db1cB8fA"
+        "eth:0xa40D5f56745a118D0906a34E69aeC8C0Db1cB8fA"
      values.globalExitRootManager:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      values.pendingAdmin:
-        "0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
+        "eth:0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
      values.pol:
-        "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
+        "eth:0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
      values.rollupManager:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.trustedSequencer:
-        "0x0AE999d2d668f12f2b46C4Fd3e13A32D478A9164"
+        "eth:0x0AE999d2d668f12f2b46C4Fd3e13A32D478A9164"
      implementationNames.0x78253E2E6120164bd826668A4C96Db20f78A94c9:
-        "PolygonTransparentProxy"
      implementationNames.0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C:
-        "PolygonValidiumStorageMigration"
      implementationNames.eth:0x78253E2E6120164bd826668A4C96Db20f78A94c9:
+        "PolygonTransparentProxy"
      implementationNames.eth:0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C:
+        "PolygonValidiumStorageMigration"
    }
```

```diff
    EOA  (0xb8605297399baEb6628C9E8F5D3E52A056492cfe) {
    +++ description: None
      address:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
+        "eth:0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
    }
```

```diff
    EOA  (0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD) {
    +++ description: None
      address:
-        "0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
+        "eth:0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
    }
```

```diff
    EOA  (0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A) {
    +++ description: None
      address:
-        "0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A"
+        "eth:0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A"
    }
```

```diff
    EOA  (0xee754f8Da8e2D8F0F97f6EBe1554390c0266d4d0) {
    +++ description: None
      address:
-        "0xee754f8Da8e2D8F0F97f6EBe1554390c0266d4d0"
+        "eth:0xee754f8Da8e2D8F0F97f6EBe1554390c0266d4d0"
    }
```

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5)
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
```

```diff
+   Status: CREATED
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9)
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
```

Generated with discovered.json: 0xbb9bda1197c0054137d64f025e159cc3d8b7edb1

# Diff at Fri, 04 Jul 2025 12:19:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22187530
- current block number: 22187530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22187530 (main branch discovery), not current.

```diff
    EOA  (0x0AE999d2d668f12f2b46C4Fd3e13A32D478A9164) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x78253E2E6120164bd826668A4C96Db20f78A94c9"
+        "eth:0x78253E2E6120164bd826668A4C96Db20f78A94c9"
    }
```

```diff
    contract ProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
+        "eth:0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
    }
```

```diff
    EOA  (0xb8605297399baEb6628C9E8F5D3E52A056492cfe) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"
+        "eth:0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"
      receivedPermissions.0.from:
-        "ethereum:0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
+        "eth:0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"
+        "eth:0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"
    }
```

```diff
    EOA  (0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
+        "eth:0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
      receivedPermissions.1.from:
-        "ethereum:0x78253E2E6120164bd826668A4C96Db20f78A94c9"
+        "eth:0x78253E2E6120164bd826668A4C96Db20f78A94c9"
    }
```

```diff
    EOA  (0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x78253E2E6120164bd826668A4C96Db20f78A94c9"
+        "eth:0x78253E2E6120164bd826668A4C96Db20f78A94c9"
    }
```

Generated with discovered.json: 0x5515be5c0000a126351e18d1aa5b923669011bf8

# Diff at Fri, 23 May 2025 09:41:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22187530
- current block number: 22187530

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22187530 (main branch discovery), not current.

```diff
    EOA  (0x0AE999d2d668f12f2b46C4Fd3e13A32D478A9164) {
    +++ description: None
      receivedPermissions.0.role:
+        ".trustedSequencer"
    }
```

```diff
    contract ProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0xb8605297399baEb6628C9E8F5D3E52A056492cfe) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD) {
    +++ description: None
      receivedPermissions.1.role:
+        ".admin"
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A) {
    +++ description: None
      receivedPermissions.0.role:
+        ".forceBatchAddress"
    }
```

Generated with discovered.json: 0xddbf4237ea0a8dc90036b7be225301e1641f9002

# Diff at Tue, 06 May 2025 10:56:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 22187530
- current block number: 22187530

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22187530 (main branch discovery), not current.

```diff
    EOA  (0xb8605297399baEb6628C9E8F5D3E52A056492cfe) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0xb6b6783d2aef88fe58cf5747ed12c192e33b5bc4

# Diff at Tue, 29 Apr 2025 08:19:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22187530
- current block number: 22187530

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22187530 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      issuedPermissions:
-        [{"permission":"interact","to":"0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD","description":"manage the members of the data availability committee and the threshold for valid commitments.","via":[]},{"permission":"upgrade","to":"0xb8605297399baEb6628C9E8F5D3E52A056492cfe","via":[{"address":"0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"}]}]
    }
```

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions:
-        [{"permission":"interact","to":"0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"interact","to":"0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x0AE999d2d668f12f2b46C4Fd3e13A32D478A9164","via":[]}]
    }
```

Generated with discovered.json: 0x159ac2c3000d7e845d3924a0212c44b5bee16fa8

# Diff at Thu, 24 Apr 2025 10:31:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 22187530
- current block number: 22187530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22187530 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      values.members.1:
-        ["https://dac2.wirexpaychain.zeeve.online","0xee754f8Da8e2D8F0F97f6EBe1554390c0266d4d0"]
+        {"url":"https://dac2.wirexpaychain.zeeve.online","addr":"0xee754f8Da8e2D8F0F97f6EBe1554390c0266d4d0"}
      values.members.0:
-        ["https://dac.wirexpaychain.zeeve.online","0x57d836bD4834bc2DB8C3F9Eb769cEbC0d93E6986"]
+        {"url":"https://dac.wirexpaychain.zeeve.online","addr":"0x57d836bD4834bc2DB8C3F9Eb769cEbC0d93E6986"}
    }
```

Generated with discovered.json: 0x3357802216bc5d73e12eb1c83d68dd743d5d81aa

# Diff at Thu, 10 Apr 2025 14:43:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22187530
- current block number: 22187530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22187530 (main branch discovery), not current.

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      displayName:
-        "PolygonZkEVM"
    }
```

Generated with discovered.json: 0x9f2750eac76ead5098bb7f90b40546469fc0a7c7

# Diff at Thu, 03 Apr 2025 09:36:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ad19dfb413ff34348157f743c194a146b6447e05 block: 21766767
- current block number: 22187530

## Description

DAC and rpc changes (project is archived).

## Watched changes

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      issuedPermissions.0.to:
-        "0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A"
+        "0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
      values.committeeHash:
-        "0xe6f885fcfef296a71bcc466caa039d3a8e72b1c43f5b110d5045776b5680750b"
+        "0xe27c1d4c1b3048b06294d26a28223926b5bdc4efe8e725b8c59e95a92c88b397"
      values.members.1.1:
-        "https://pay-chain-da-1.eu-central-6.gateway.fm/"
+        "0xee754f8Da8e2D8F0F97f6EBe1554390c0266d4d0"
      values.members.1.0:
-        "0xCEb82CC6e0C2541a19E4b6E2DBF237fF2d8E96f8"
+        "https://dac2.wirexpaychain.zeeve.online"
      values.members.0.1:
-        "https://pay-chain-da-2.eu-central-6.gateway.fm/"
+        "0x57d836bD4834bc2DB8C3F9Eb769cEbC0d93E6986"
      values.members.0.0:
-        "0xBf5B50887F0B2b3160A3a097EBA4edEd8A9dDed1"
+        "https://dac.wirexpaychain.zeeve.online"
      values.owner:
-        "0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A"
+        "0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
    }
```

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions.2.to:
-        "0x49a191471F248f7c86cA29477e6E969970BaEAdA"
+        "0x0AE999d2d668f12f2b46C4Fd3e13A32D478A9164"
      issuedPermissions.1.to:
-        "0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A"
+        "0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
      values.admin:
-        "0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A"
+        "0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "0xe218f50Aa347687E449B8FCcAc81B6Fbe27C7aDD"
      values.trustedSequencer:
-        "0x49a191471F248f7c86cA29477e6E969970BaEAdA"
+        "0x0AE999d2d668f12f2b46C4Fd3e13A32D478A9164"
      values.trustedSequencerURL:
-        "https://pay-chain-sequencer.eu-central-6.gateway.fm/"
+        "https://rpc.wirexpaychain.com"
    }
```

```diff
    contract undefined (0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"interact","from":"0x78253E2E6120164bd826668A4C96Db20f78A94c9","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches."}
      receivedPermissions.1:
-        {"permission":"interact","from":"0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5","description":"manage the members of the data availability committee and the threshold for valid commitments."}
    }
```

Generated with discovered.json: 0x6e575cd99e9acb959b88c556424e9b27de2deb31

# Diff at Wed, 19 Mar 2025 13:05:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21766767
- current block number: 21766767

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766767 (main branch discovery), not current.

```diff
    contract undefined (0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x2940267a95e4620401ba378407c2c70898d7f0e9

# Diff at Tue, 04 Mar 2025 10:40:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766767
- current block number: 21766767

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766767 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      sinceBlock:
+        19505052
    }
```

```diff
    contract ProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      sinceBlock:
+        20270515
    }
```

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      sinceBlock:
+        20270516
    }
```

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      sinceBlock:
+        20232613
    }
```

Generated with discovered.json: 0x37490b7438d38c5274263a2ceb43d97803f7d6ba

# Diff at Thu, 27 Feb 2025 11:47:06 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21766767
- current block number: 21766767

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766767 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "FflonkVerifier"
+        "Verifier"
      displayName:
-        "Verifier"
    }
```

Generated with discovered.json: 0x85f0ba3baae963c17c0ecd202de2d7b36cc8fc33

# Diff at Wed, 26 Feb 2025 10:33:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21766767
- current block number: 21766767

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766767 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x8998cc447ebe71b90e2965bfb4c9f86e6ee4af83

# Diff at Tue, 04 Feb 2025 12:33:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766767
- current block number: 21766767

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766767 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xd7f87508fd92685be6282803ba7c198e613b7502

# Diff at Mon, 03 Feb 2025 09:09:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a86862ef704cb8a38295607226918095f937c05b block: 21744311
- current block number: 21744311

## Description

discodrive polygoncdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744311 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "Verifier"
+        "FflonkVerifier"
      template:
+        "polygon-cdk/Verifier"
      displayName:
+        "Verifier"
      description:
+        "Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager."
    }
```

```diff
    contract ProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      name:
-        "DACProxyAdmin"
+        "ProxyAdmin"
      displayName:
-        "ProxyAdmin"
    }
```

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      name:
-        "WirexPayChainDAC"
+        "PolygonDataCommittee"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xb8605297399baEb6628C9E8F5D3E52A056492cfe","via":[{"address":"0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
+        "0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A"
      issuedPermissions.0.via.0:
-        {"address":"0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"}
      issuedPermissions.0.description:
+        "manage the members of the data availability committee and the threshold for valid commitments."
      template:
+        "polygon-cdk/PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1)."
    }
```

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      name:
-        "WirexPayChainValidium"
+        "Validium"
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"configure","to":"0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"configure","to":"0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x49a191471F248f7c86cA29477e6E969970BaEAdA","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

Generated with discovered.json: 0xb1c46d9bf0ddb845aa2e66e34c6d27da840081fa

# Diff at Mon, 20 Jan 2025 11:10:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628493
- current block number: 21628493

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628493 (main branch discovery), not current.

```diff
    contract DACProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
      directlyReceivedPermissions.0.from:
+        "0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
    }
```

```diff
    contract WirexPayChainDAC (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
    }
```

Generated with discovered.json: 0xda273b56a8732f100bfe957628930f248386445c

# Diff at Wed, 15 Jan 2025 07:48:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 20677136
- current block number: 21628493

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20677136 (main branch discovery), not current.

```diff
    contract DACProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x3748c865fbc30f1a153a66160d6761d3ab9c5596

# Diff at Mon, 21 Oct 2024 11:11:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20677136
- current block number: 20677136

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20677136 (main branch discovery), not current.

```diff
    contract WirexPayChainDAC (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xAce9269EaC3419937093154dea0AD44C36Df6963"]
      values.$pastUpgrades.0.1:
-        ["0xAce9269EaC3419937093154dea0AD44C36Df6963"]
+        "0xf72b5eafd4612b45278a8d49041d0736c6c4a6de6069160dec9a086e08027762"
    }
```

```diff
    contract WirexPayChainValidium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
      values.$pastUpgrades.0.1:
-        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
+        "0xb727fee71f71c51e9d5fe335b8c6382b80f576364002f5986149004578a16af9"
    }
```

Generated with discovered.json: 0xa95a7e97b3b97875a1638147c61c6d243f153a4a

# Diff at Mon, 14 Oct 2024 10:57:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20677136
- current block number: 20677136

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20677136 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: None
      sourceHashes:
+        ["0x0bc67d276b40b2ba13903d94fd6c25ae4d3d5162bc942763c418afdc11bc9b32"]
    }
```

```diff
    contract DACProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"}]
    }
```

```diff
    contract WirexPayChainDAC (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"
+        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
      issuedPermissions.0.via.0:
+        {"address":"0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0xf7c38d00c4b6000f1840ed38f9ae99d753da8ac69ee1b6ac9ed614f2b60d470f"]
    }
```

```diff
    contract WirexPayChainValidium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: None
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

Generated with discovered.json: 0x39961efda43844f0cba42161f343746d162f8572

# Diff at Tue, 01 Oct 2024 11:11:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20677136
- current block number: 20677136

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20677136 (main branch discovery), not current.

```diff
    contract WirexPayChainDAC (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-09T17:46:23.000Z",["0xAce9269EaC3419937093154dea0AD44C36Df6963"]]]
    }
```

```diff
    contract WirexPayChainValidium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-04T10:40:23.000Z",["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]]]
    }
```

Generated with discovered.json: 0x6dbe8280005c0dd93f94d92e6c37c6e4ec7c7721

# Diff at Wed, 04 Sep 2024 12:11:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20677136

## Description

Initial discovery: Type 4 polygonCDK Validium with shared verifier and main contract implementation. No TVL tracking yet due to shared bridge.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DACProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WirexPayChainDAC (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WirexPayChainValidium (0x78253E2E6120164bd826668A4C96Db20f78A94c9)
    +++ description: None
```
