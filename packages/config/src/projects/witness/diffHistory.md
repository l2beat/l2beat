Generated with discovered.json: 0x7ad5c8fca6afec87cdd89ce3cf13b2531e12ccb8

# Diff at Wed, 03 Sep 2025 15:51:55 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1738234259
- current timestamp: 1738234259

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1738234259 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference PolygonSharedBridge (eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    reference PolygonRollupManager (eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    reference PolygonGlobalExitRootV2 (eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

Generated with discovered.json: 0xda4983c11d9c5d6cb5d1172f2415eaf4017ad6b7

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xa7862a8f8f508263e718eff405139316e5a1abdd

# Diff at Mon, 14 Jul 2025 12:46:41 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21736867
- current block number: 21736867

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

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
    EOA  (0x353800524721e11B453f73f523dD8840c215a213) {
    +++ description: None
      address:
-        "0x353800524721e11B453f73f523dD8840c215a213"
+        "eth:0x353800524721e11B453f73f523dD8840c215a213"
    }
```

```diff
    contract Validium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: The main system contract defining the witnesschain Layer 2 logic. Entry point for sequencing batches.
      address:
-        "0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+        "eth:0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
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
-        "0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b"
+        "eth:0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b"
      values.bridgeAddress:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.dataAvailabilityProtocol:
-        "0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
+        "eth:0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
+++ description: If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone.
+++ severity: HIGH
      values.forceBatchAddress:
-        "0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b"
+        "eth:0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b"
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
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pol:
-        "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
+        "eth:0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
      values.rollupManager:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.trustedSequencer:
-        "0x353800524721e11B453f73f523dD8840c215a213"
+        "eth:0x353800524721e11B453f73f523dD8840c215a213"
      implementationNames.0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238:
-        "PolygonTransparentProxy"
      implementationNames.0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C:
-        "PolygonValidiumStorageMigration"
      implementationNames.eth:0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238:
+        "PolygonTransparentProxy"
      implementationNames.eth:0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C:
+        "PolygonValidiumStorageMigration"
    }
```

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
    +++ description: None
      address:
-        "0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"
+        "eth:0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"
      values.owner:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
+        "eth:0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
      implementationNames.0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039:
-        "ProxyAdmin"
      implementationNames.eth:0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039:
+        "ProxyAdmin"
    }
```

```diff
    contract PolygonDataCommittee (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      address:
-        "0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
+        "eth:0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
      values.$admin:
-        "0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"
+        "eth:0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"
      values.$implementation:
-        "0xD26B535AD58715C4c2ffFAC32908b13674533DAe"
+        "eth:0xD26B535AD58715C4c2ffFAC32908b13674533DAe"
      values.$pastUpgrades.0.2.0:
-        "0xD26B535AD58715C4c2ffFAC32908b13674533DAe"
+        "eth:0xD26B535AD58715C4c2ffFAC32908b13674533DAe"
      values.members.0.addr:
-        "0xcc543F5a2052eDf584216093A0547c4Acd84B80b"
+        "eth:0xcc543F5a2052eDf584216093A0547c4Acd84B80b"
      values.members.1.addr:
-        "0xef5F06e5C0493601829DacFA23f2fe30303b0166"
+        "eth:0xef5F06e5C0493601829DacFA23f2fe30303b0166"
      values.owner:
-        "0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b"
+        "eth:0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b"
      implementationNames.0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8:
-        "TransparentUpgradeableProxy"
      implementationNames.0xD26B535AD58715C4c2ffFAC32908b13674533DAe:
-        "PolygonDataCommittee"
      implementationNames.eth:0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xD26B535AD58715C4c2ffFAC32908b13674533DAe:
+        "PolygonDataCommittee"
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
    EOA  (0xcc543F5a2052eDf584216093A0547c4Acd84B80b) {
    +++ description: None
      address:
-        "0xcc543F5a2052eDf584216093A0547c4Acd84B80b"
+        "eth:0xcc543F5a2052eDf584216093A0547c4Acd84B80b"
    }
```

```diff
    EOA  (0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b) {
    +++ description: None
      address:
-        "0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b"
+        "eth:0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b"
    }
```

```diff
    EOA  (0xef5F06e5C0493601829DacFA23f2fe30303b0166) {
    +++ description: None
      address:
-        "0xef5F06e5C0493601829DacFA23f2fe30303b0166"
+        "eth:0xef5F06e5C0493601829DacFA23f2fe30303b0166"
    }
```

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
```

```diff
+   Status: CREATED
    contract Validium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238)
    +++ description: The main system contract defining the witnesschain Layer 2 logic. Entry point for sequencing batches.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8)
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
```

Generated with discovered.json: 0x6a05b7c1a334d0289458d57f81981559aea43482

# Diff at Fri, 04 Jul 2025 12:19:27 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 21736867
- current block number: 21736867

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    EOA  (0x353800524721e11B453f73f523dD8840c215a213) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+        "eth:0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
    }
```

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
+        "eth:0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
    }
```

```diff
    EOA  (0xb8605297399baEb6628C9E8F5D3E52A056492cfe) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"
+        "eth:0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"
      receivedPermissions.0.from:
-        "ethereum:0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
+        "eth:0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"
+        "eth:0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"
    }
```

```diff
    EOA  (0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+        "eth:0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
      receivedPermissions.1.from:
-        "ethereum:0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
+        "eth:0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238"
      receivedPermissions.2.from:
-        "ethereum:0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
+        "eth:0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
    }
```

Generated with discovered.json: 0x328857ac3c6113ab8ef01fea66ff7c2bdc746291

# Diff at Fri, 23 May 2025 09:41:07 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21736867
- current block number: 21736867

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    EOA  (0x353800524721e11B453f73f523dD8840c215a213) {
    +++ description: None
      receivedPermissions.0.role:
+        ".trustedSequencer"
    }
```

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
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
    EOA  (0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b) {
    +++ description: None
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.role:
+        ".admin"
      receivedPermissions.0.role:
+        ".forceBatchAddress"
    }
```

Generated with discovered.json: 0x6d4c1e63eaa2932c0db812b2550b5b97840fdac6

# Diff at Tue, 06 May 2025 10:56:59 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 21736867
- current block number: 21736867

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    EOA  (0xb8605297399baEb6628C9E8F5D3E52A056492cfe) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x6e5f24d2e11ed2d83d3d057eefd84b34d6741204

# Diff at Tue, 29 Apr 2025 08:19:15 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21736867
- current block number: 21736867

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    contract Validium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: The main system contract defining the witnesschain Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions:
-        [{"permission":"interact","to":"0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"interact","to":"0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x353800524721e11B453f73f523dD8840c215a213","via":[]}]
    }
```

```diff
    contract PolygonDataCommittee (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      issuedPermissions:
-        [{"permission":"interact","to":"0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b","description":"manage the members of the data availability committee and the threshold for valid commitments.","via":[]},{"permission":"upgrade","to":"0xb8605297399baEb6628C9E8F5D3E52A056492cfe","via":[{"address":"0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"}]}]
    }
```

Generated with discovered.json: 0xe55fc5e613096cc5fec9b0993aefd5463dfb161a

# Diff at Thu, 24 Apr 2025 10:31:16 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 21736867
- current block number: 21736867

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      values.members.1:
-        ["https://witnesschain-da-2.eu-north-2.gateway.fm/","0xef5F06e5C0493601829DacFA23f2fe30303b0166"]
+        {"url":"https://witnesschain-da-2.eu-north-2.gateway.fm/","addr":"0xef5F06e5C0493601829DacFA23f2fe30303b0166"}
      values.members.0:
-        ["https://witnesschain-da-1.eu-north-2.gateway.fm/","0xcc543F5a2052eDf584216093A0547c4Acd84B80b"]
+        {"url":"https://witnesschain-da-1.eu-north-2.gateway.fm/","addr":"0xcc543F5a2052eDf584216093A0547c4Acd84B80b"}
    }
```

Generated with discovered.json: 0xb759955217c52ccc0c2b35f015714a2c86a4d427

# Diff at Thu, 10 Apr 2025 14:43:32 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 21736867
- current block number: 21736867

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    contract Validium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: The main system contract defining the witnesschain Layer 2 logic. Entry point for sequencing batches.
      displayName:
-        "PolygonZkEVM"
    }
```

Generated with discovered.json: 0x8d99b7e69070fcf57144e5a43e2fde91d82d4c5f

# Diff at Wed, 19 Mar 2025 13:05:53 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21736867
- current block number: 21736867

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    contract undefined (0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x1eb54eccfd1d71148feda313767e4f53cee8801d

# Diff at Tue, 04 Mar 2025 10:40:12 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21736867
- current block number: 21736867

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      sinceBlock:
+        19505052
    }
```

```diff
    contract Validium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: The main system contract defining the witnesschain Layer 2 logic. Entry point for sequencing batches.
      sinceBlock:
+        20105830
    }
```

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
    +++ description: None
      sinceBlock:
+        20111746
    }
```

```diff
    contract PolygonDataCommittee (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      sinceBlock:
+        20111747
    }
```

Generated with discovered.json: 0x90cf74911be7bedcfb29fcf9737021f1af458799

# Diff at Thu, 27 Feb 2025 11:47:06 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21736867
- current block number: 21736867

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

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

Generated with discovered.json: 0x08ac9a845f005dded69f042fc44863d9867bbd70

# Diff at Wed, 26 Feb 2025 10:33:15 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21736867
- current block number: 21736867

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Validium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: The main system contract defining the witnesschain Layer 2 logic. Entry point for sequencing batches.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract PolygonDataCommittee (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x4b9eafde878f941500e5648b663ccf6a5191fe3e

# Diff at Tue, 04 Feb 2025 12:33:23 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21736867
- current block number: 21736867

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    contract Validium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: The main system contract defining the witnesschain Layer 2 logic. Entry point for sequencing batches.
      unverified:
-        true
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

```diff
    contract PolygonDataCommittee (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xb1fa8d245ec1fa27b719524d33d7b0ebdf6ba96e

# Diff at Mon, 03 Feb 2025 09:15:11 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a86862ef704cb8a38295607226918095f937c05b block: 21736867
- current block number: 21736867

## Description

discodrive polygoncdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      template:
+        "polygon-cdk/Verifier"
      displayName:
+        "Verifier"
      description:
+        "Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager."
    }
```

```diff
    contract Validium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: The main system contract defining the witnesschain Layer 2 logic. Entry point for sequencing batches.
      name:
-        "WitnessValidium"
+        "Validium"
      sourceHashes:
-        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
      unverified:
+        true
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the witnesschain Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"configure","to":"0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"configure","to":"0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x353800524721e11B453f73f523dD8840c215a213","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

```diff
    contract PolygonDataCommittee (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      name:
-        "WitnessValidiumDAC"
+        "PolygonDataCommittee"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xb8605297399baEb6628C9E8F5D3E52A056492cfe","via":[{"address":"0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
+        "0xd0676f1Ee81d7C6fe9B0F2EEf9FF74C3E984f94b"
      issuedPermissions.0.via.0:
-        {"address":"0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"}
      issuedPermissions.0.description:
+        "manage the members of the data availability committee and the threshold for valid commitments."
      template:
+        "polygon-cdk/PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1)."
    }
```

Generated with discovered.json: 0x891f78b7a61900f72e2156241c12d1ab3bcc144e

# Diff at Fri, 31 Jan 2025 10:39:42 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@1884091a71fcb92cb6288cb0a888c91dde4c71c7 block: 21736867
- current block number: 21736867

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736867 (main branch discovery), not current.

```diff
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

Generated with discovered.json: 0x78986379d539a0aa69ee08fbe20a6905566ab50a

# Diff at Thu, 30 Jan 2025 10:51:15 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2da0612158e4fa23c41926c49e88a7b955a8c5dc block: 21715800
- current block number: 21736867

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715800 (main branch discovery), not current.

```diff
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: None
      sourceHashes:
-        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
      unverified:
+        true
    }
```

Generated with discovered.json: 0x3085d9b67acb58b979c0dcf47d1a8c4a37ec9a67

# Diff at Wed, 29 Jan 2025 09:52:46 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5741cb966172a3b26ba8279dd9fe4323805a53c2 block: 21715800
- current block number: 21715800

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715800 (main branch discovery), not current.

```diff
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

Generated with discovered.json: 0xa22d730af5e1ef0045336b06c63ea3af81de8bf6

# Diff at Mon, 27 Jan 2025 12:16:15 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 20491473
- current block number: 21715800

## Description

Proxy somehow became unverified.

More interestingly, this chain is dead, no batch commits for 40 days, archiving.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: None
      sourceHashes:
-        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
      unverified:
+        true
    }
```

Generated with discovered.json: 0xf62412de983d39a423fea62956f99ee7593c1cb0

# Diff at Mon, 20 Jan 2025 11:10:20 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20491473
- current block number: 20491473

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
      directlyReceivedPermissions.0.from:
+        "0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"
    }
```

```diff
    contract WitnessValidiumDAC (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
    }
```

Generated with discovered.json: 0xabc32f3951e6bd9a2e3f05ec1b7c75f304ff3f33

# Diff at Mon, 21 Oct 2024 11:11:58 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20491473
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
      values.$pastUpgrades.0.1:
-        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
+        "0x059ddb2af7337bacc9f85aed058936b67c1c439d56744b05336952c1792d811d"
    }
```

```diff
    contract WitnessValidiumDAC (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xD26B535AD58715C4c2ffFAC32908b13674533DAe"]
      values.$pastUpgrades.0.1:
-        ["0xD26B535AD58715C4c2ffFAC32908b13674533DAe"]
+        "0x189f2f8a9bf53ece3537b3b9a10ec0a98d7e6b506c2fa368cf818e2344f7b9ad"
    }
```

Generated with discovered.json: 0xe0f2ad519ae3b885e1dc02dddc8d26cc6be82757

# Diff at Mon, 14 Oct 2024 10:57:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20491473
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: None
      sourceHashes:
+        ["0x0bc67d276b40b2ba13903d94fd6c25ae4d3d5162bc942763c418afdc11bc9b32"]
    }
```

```diff
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: None
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"}]
    }
```

```diff
    contract WitnessValidiumDAC (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039"
+        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
      issuedPermissions.0.via.0:
+        {"address":"0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0xf7c38d00c4b6000f1840ed38f9ae99d753da8ac69ee1b6ac9ed614f2b60d470f"]
    }
```

Generated with discovered.json: 0xa7c36a4bae4181515b08dacc2bc51d002b761e8d

# Diff at Tue, 01 Oct 2024 11:11:47 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20491473
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-16T17:25:35.000Z",["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]]]
    }
```

```diff
    contract WitnessValidiumDAC (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-17T13:16:47.000Z",["0xD26B535AD58715C4c2ffFAC32908b13674533DAe"]]]
    }
```

Generated with discovered.json: 0x80d8a3f66e17cb6df64a6af23c10be1daef3ba35

# Diff at Fri, 30 Aug 2024 08:01:32 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20491473
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x088e3ecdf1574281e29e37f18dea9d047be38167

# Diff at Fri, 23 Aug 2024 09:56:20 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20491473
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract WitnessValidiumDAC (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xe99b8fe427a0d86279c4ec8bdd9d8466c20318a1

# Diff at Wed, 21 Aug 2024 10:06:31 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20491473
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491473 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8","via":[]}]
    }
```

```diff
    contract WitnessValidiumDAC (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039","via":[]}]
    }
```

Generated with discovered.json: 0x59ef717b76a2844895f5f850987f4c52c6485b60

# Diff at Fri, 09 Aug 2024 13:54:41 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@55033526285d11b30f44e7cea5874c4f4d65ed80 block: 20325237
- current block number: 20491473

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325237 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"]
      assignedPermissions.upgrade:
+        ["0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8"]
    }
```

```diff
    contract WitnessValidiumDAC (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8) {
    +++ description: None
      name:
-        "PolygonDataCommittee"
+        "WitnessValidiumDAC"
    }
```

Generated with discovered.json: 0xe01dbf6fba9a674051395a58baf4f5ada5c931b9

# Diff at Wed, 17 Jul 2024 09:05:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20325237

## Description

Initial discovery: PolygonCDK type RollupType 4 Validium with identical code compared to AstarZkEVM. Permissions structure is like XLayer.

## Initial discovery

```diff
+   Status: CREATED
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WitnessValidium (0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8cC10554B5C7D322E6a7F33CBb584c7C5fdBA039)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0xB0FD8Ba20B1C178b14Dd2a02f4e72c03fdA626f8)
    +++ description: None
```

