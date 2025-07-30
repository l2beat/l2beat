Generated with discovered.json: 0x18fc0c0c7a6981e46375628bce6f819aedab2315

# Diff at Mon, 14 Jul 2025 12:46:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22774947
- current block number: 22774947

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22774947 (main branch discovery), not current.

```diff
    EOA  (0x129A94208bb3030D809c36849d43b50d13e0cACf) {
    +++ description: None
      address:
-        "0x129A94208bb3030D809c36849d43b50d13e0cACf"
+        "eth:0x129A94208bb3030D809c36849d43b50d13e0cACf"
    }
```

```diff
    EOA  (0x49015545B46B07082bd7faf2633643eae87710EC) {
    +++ description: None
      address:
-        "0x49015545B46B07082bd7faf2633643eae87710EC"
+        "eth:0x49015545B46B07082bd7faf2633643eae87710EC"
    }
```

```diff
    EOA  (0x4cbCa28910376fb203188acC5fCdDc8F3b91c4B0) {
    +++ description: None
      address:
-        "0x4cbCa28910376fb203188acC5fCdDc8F3b91c4B0"
+        "eth:0x4cbCa28910376fb203188acC5fCdDc8F3b91c4B0"
    }
```

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      address:
-        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+        "eth:0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
      values.$admin:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.$implementation:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.$pastUpgrades.0.2.0:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.admin:
-        "0x49015545B46B07082bd7faf2633643eae87710EC"
+        "eth:0x49015545B46B07082bd7faf2633643eae87710EC"
      values.bridgeAddress:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.dataAvailabilityProtocol:
-        "0xB408a216927d31A27fd96176dbF1B825630f0301"
+        "eth:0xB408a216927d31A27fd96176dbF1B825630f0301"
+++ description: If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone.
+++ severity: HIGH
      values.forceBatchAddress:
-        "0x49015545B46B07082bd7faf2633643eae87710EC"
+        "eth:0x49015545B46B07082bd7faf2633643eae87710EC"
      values.gasTokenAddress:
-        "0x03Be5C903c727Ee2C8C4e9bc0AcC860Cca4715e2"
+        "eth:0x03Be5C903c727Ee2C8C4e9bc0AcC860Cca4715e2"
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
-        "0x129A94208bb3030D809c36849d43b50d13e0cACf"
+        "eth:0x129A94208bb3030D809c36849d43b50d13e0cACf"
      implementationNames.0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789:
-        "PolygonTransparentProxy"
      implementationNames.0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F:
-        "PolygonValidiumEtrog"
      implementationNames.eth:0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789:
+        "PolygonTransparentProxy"
      implementationNames.eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F:
+        "PolygonValidiumEtrog"
    }
```

```diff
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      address:
-        "0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
+        "eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D"
      implementationNames.0x9B9671dB83CfcB4508bF361942488C5cA2b1286D:
-        "FflonkVerifier_12"
      implementationNames.eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D:
+        "FflonkVerifier_12"
    }
```

```diff
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      address:
-        "0xB408a216927d31A27fd96176dbF1B825630f0301"
+        "eth:0xB408a216927d31A27fd96176dbF1B825630f0301"
      values.$admin:
-        "0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"
+        "eth:0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"
      values.$implementation:
-        "0x0f32d8C0eB1cE4C5FFb1A6C4bb3b879D2184Ed11"
+        "eth:0x0f32d8C0eB1cE4C5FFb1A6C4bb3b879D2184Ed11"
      values.$pastUpgrades.0.2.0:
-        "0x0f32d8C0eB1cE4C5FFb1A6C4bb3b879D2184Ed11"
+        "eth:0x0f32d8C0eB1cE4C5FFb1A6C4bb3b879D2184Ed11"
      values.members.0.addr:
-        "0x4cbCa28910376fb203188acC5fCdDc8F3b91c4B0"
+        "eth:0x4cbCa28910376fb203188acC5fCdDc8F3b91c4B0"
      values.owner:
-        "0x49015545B46B07082bd7faf2633643eae87710EC"
+        "eth:0x49015545B46B07082bd7faf2633643eae87710EC"
      implementationNames.0xB408a216927d31A27fd96176dbF1B825630f0301:
-        "TransparentUpgradeableProxy"
      implementationNames.0x0f32d8C0eB1cE4C5FFb1A6C4bb3b879D2184Ed11:
-        "PolygonDataCommittee"
      implementationNames.eth:0xB408a216927d31A27fd96176dbF1B825630f0301:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x0f32d8C0eB1cE4C5FFb1A6C4bb3b879D2184Ed11:
+        "PolygonDataCommittee"
    }
```

```diff
    contract ProxyAdmin (0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b) {
    +++ description: None
      address:
-        "0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"
+        "eth:0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"
      values.owner:
-        "0x49015545B46B07082bd7faf2633643eae87710EC"
+        "eth:0x49015545B46B07082bd7faf2633643eae87710EC"
      implementationNames.0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b:
-        "ProxyAdmin"
      implementationNames.eth:0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b:
+        "ProxyAdmin"
    }
```

```diff
+   Status: CREATED
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789)
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
```

```diff
+   Status: CREATED
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D)
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301)
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b)
    +++ description: None
```

Generated with discovered.json: 0xdc3ca9bc5d4bd22f151374acd46f55b1c050d849

# Diff at Fri, 04 Jul 2025 12:19:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22774947
- current block number: 22774947

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22774947 (main branch discovery), not current.

```diff
    EOA  (0x129A94208bb3030D809c36849d43b50d13e0cACf) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+        "eth:0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
    }
```

```diff
    EOA  (0x49015545B46B07082bd7faf2633643eae87710EC) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+        "eth:0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
      receivedPermissions.1.from:
-        "ethereum:0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+        "eth:0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
      receivedPermissions.2.from:
-        "ethereum:0xB408a216927d31A27fd96176dbF1B825630f0301"
+        "eth:0xB408a216927d31A27fd96176dbF1B825630f0301"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"
+        "eth:0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"
      receivedPermissions.3.from:
-        "ethereum:0xB408a216927d31A27fd96176dbF1B825630f0301"
+        "eth:0xB408a216927d31A27fd96176dbF1B825630f0301"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"
+        "eth:0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"
    }
```

```diff
    contract ProxyAdmin (0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xB408a216927d31A27fd96176dbF1B825630f0301"
+        "eth:0xB408a216927d31A27fd96176dbF1B825630f0301"
    }
```

Generated with discovered.json: 0xea4f4488ab2f4e528de09a2ea0449e0a3edd63c6

# Diff at Fri, 23 May 2025 09:41:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22208591
- current block number: 22208591

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208591 (main branch discovery), not current.

```diff
    EOA  (0x129A94208bb3030D809c36849d43b50d13e0cACf) {
    +++ description: None
      receivedPermissions.0.role:
+        ".trustedSequencer"
    }
```

```diff
    EOA  (0x49015545B46B07082bd7faf2633643eae87710EC) {
    +++ description: None
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.3.from:
-        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
+        "0xB408a216927d31A27fd96176dbF1B825630f0301"
      receivedPermissions.3.description:
-        "set core system parameters like the trusted sequencer and manage forced transactions/batches."
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.3.via:
+        [{"address":"0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0xB408a216927d31A27fd96176dbF1B825630f0301"
+        "0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789"
      receivedPermissions.2.via:
-        [{"address":"0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"}]
      receivedPermissions.2.description:
+        "set core system parameters like the trusted sequencer and manage forced transactions/batches."
      receivedPermissions.2.role:
+        ".admin"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".forceBatchAddress"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x2b8c16c5cf524e97352682d52720d344646cc0a5

# Diff at Tue, 06 May 2025 10:56:58 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 22208591
- current block number: 22208591

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208591 (main branch discovery), not current.

```diff
    EOA  (0x49015545B46B07082bd7faf2633643eae87710EC) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x5d56bd0d33a0a356cf7e43acb97ecebc57271b4b

# Diff at Tue, 29 Apr 2025 08:19:14 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22208591
- current block number: 22208591

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208591 (main branch discovery), not current.

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions:
-        [{"permission":"interact","to":"0x49015545B46B07082bd7faf2633643eae87710EC","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"interact","to":"0x49015545B46B07082bd7faf2633643eae87710EC","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x129A94208bb3030D809c36849d43b50d13e0cACf","via":[]}]
    }
```

```diff
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      issuedPermissions:
-        [{"permission":"interact","to":"0x49015545B46B07082bd7faf2633643eae87710EC","description":"manage the members of the data availability committee and the threshold for valid commitments.","via":[]},{"permission":"upgrade","to":"0x49015545B46B07082bd7faf2633643eae87710EC","via":[{"address":"0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"}]}]
    }
```

Generated with discovered.json: 0xe0a5cb6193bc16f41087ed371f0b454baf40d9bf

# Diff at Thu, 24 Apr 2025 10:31:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 22208591
- current block number: 22208591

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208591 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      values.members.0:
-        ["https://dac.ternoa-mainnet.zeeve.online","0x4cbCa28910376fb203188acC5fCdDc8F3b91c4B0"]
+        {"url":"https://dac.ternoa-mainnet.zeeve.online","addr":"0x4cbCa28910376fb203188acC5fCdDc8F3b91c4B0"}
    }
```

Generated with discovered.json: 0x4e0c1e28ca95053064654d4076b29d9d631f4b55

# Diff at Thu, 10 Apr 2025 14:43:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22208591
- current block number: 22208591

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208591 (main branch discovery), not current.

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      displayName:
-        "PolygonZkEVM"
    }
```

Generated with discovered.json: 0xdd1caef02796c9a0262e3047a044d23ca6b9ab50

# Diff at Sun, 06 Apr 2025 08:11:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 21766747
- current block number: 22208591

## Description

contract verified :)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766747 (main branch discovery), not current.

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      unverified:
-        true
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x78d1eb2b96633fb1f594ef672a3791fa85a077fe0cf415ef79d93bc9a2aebd9c"]
    }
```

Generated with discovered.json: 0x4434b95040fb5f31f0f7fb7755f17bed966c9596

# Diff at Wed, 19 Mar 2025 13:05:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21766747
- current block number: 21766747

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766747 (main branch discovery), not current.

```diff
    contract undefined (0x49015545B46B07082bd7faf2633643eae87710EC) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x372c580edeedc5f7b74903984a1194757f74b676

# Diff at Tue, 04 Mar 2025 10:40:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766747
- current block number: 21766747

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766747 (main branch discovery), not current.

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      sinceBlock:
+        21522690
    }
```

```diff
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      sinceBlock:
+        20984421
    }
```

```diff
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      sinceBlock:
+        21537112
    }
```

```diff
    contract ProxyAdmin (0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b) {
    +++ description: None
      sinceBlock:
+        21537111
    }
```

Generated with discovered.json: 0xc1aeae51448e7ac640898f12e80515704e86b0c2

# Diff at Thu, 27 Feb 2025 11:47:00 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21766747
- current block number: 21766747

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766747 (main branch discovery), not current.

```diff
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "FflonkVerifier_12"
+        "Verifier"
      displayName:
-        "Verifier"
    }
```

Generated with discovered.json: 0x135eaa654289aa343cefa6d6b39481e9737a8e01

# Diff at Wed, 26 Feb 2025 10:33:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21766747
- current block number: 21766747

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766747 (main branch discovery), not current.

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract FflonkVerifier_12 (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x44dae61cab9273f3c07e57a2c1ab3983c9b76401

# Diff at Tue, 04 Feb 2025 12:33:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766747
- current block number: 21766747

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766747 (main branch discovery), not current.

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x0ecedcc2986ca4d00bba8eed5c77c24d5a5d8f65

# Diff at Mon, 03 Feb 2025 15:04:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21737758
- current block number: 21766747

## Description

Shape match bug fixd (override) and reported to tooooling.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21737758 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CapsuleCoin (0x03Be5C903c727Ee2C8C4e9bc0AcC860Cca4715e2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonEcosystemToken (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"configure","to":"0x49015545B46B07082bd7faf2633643eae87710EC","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"configure","to":"0x49015545B46B07082bd7faf2633643eae87710EC","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x129A94208bb3030D809c36849d43b50d13e0cACf","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

Generated with discovered.json: 0x65133cd49cd7c93be5bb74e300a20b9eee1dfc29

# Diff at Mon, 03 Feb 2025 09:09:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a86862ef704cb8a38295607226918095f937c05b block: 21737758
- current block number: 21737758

## Description

discodrive polygoncdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21737758 (main branch discovery), not current.

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: None
      name:
-        "TernoaValidium"
+        "Validium"
    }
```

```diff
    contract FflonkVerifier_12 (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "Verifier"
+        "FflonkVerifier_12"
      template:
+        "polygon-cdk/Verifier"
      displayName:
+        "Verifier"
      description:
+        "Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager."
    }
```

```diff
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      name:
-        "TernoaDAC"
+        "PolygonDataCommittee"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x49015545B46B07082bd7faf2633643eae87710EC","via":[{"address":"0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"}
      issuedPermissions.0.description:
+        "manage the members of the data availability committee and the threshold for valid commitments."
      template:
+        "polygon-cdk/PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1)."
    }
```

```diff
    contract ProxyAdmin (0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b) {
    +++ description: None
      name:
-        "DACProxyAdmin"
+        "ProxyAdmin"
      displayName:
-        "ProxyAdmin"
    }
```

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CapsuleCoin (0x03Be5C903c727Ee2C8C4e9bc0AcC860Cca4715e2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonEcosystemToken (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

Generated with discovered.json: 0xfef5aedf4f37dbc35548c8879144d6664ca58e56

# Diff at Thu, 30 Jan 2025 13:51:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21737758

## Description

Initial discovery: Type 7 polygon CDK validium (DAC) with custom gas token: CAPS.

## Initial discovery

```diff
+   Status: CREATED
    contract TernoaValidium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TernoaDAC (0xB408a216927d31A27fd96176dbF1B825630f0301)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DACProxyAdmin (0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b)
    +++ description: None
```
