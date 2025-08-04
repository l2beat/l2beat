Generated with discovered.json: 0xca360d7eda5cf90f13e3daffcd0ed5cd0ddbba56

# Diff at Tue, 22 Jul 2025 13:53:10 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@713d113ee2954529e09a88c55545a95e9ba43ca7 block: 21981677
- current block number: 22975137

## Description

Updated Fflonk verifier in the initial addresses to the correct one.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981677 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
```

```diff
+   Status: CREATED
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D)
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
```

Generated with discovered.json: 0x64f03cddcc01172c4d5cc6d2655b2e487708a527

# Diff at Mon, 14 Jul 2025 12:45:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21981677
- current block number: 21981677

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981677 (main branch discovery), not current.

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
    EOA  (0x258862dec9a77db57b398c441390783293E2a7A1) {
    +++ description: None
      address:
-        "0x258862dec9a77db57b398c441390783293E2a7A1"
+        "eth:0x258862dec9a77db57b398c441390783293E2a7A1"
    }
```

```diff
    contract PolygonDataCommittee (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      address:
-        "0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8"
+        "eth:0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8"
      values.$admin:
-        "0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"
+        "eth:0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"
      values.$implementation:
-        "0x2Db26DD090aDf2CC23C3506cB2F0646c517C93fB"
+        "eth:0x2Db26DD090aDf2CC23C3506cB2F0646c517C93fB"
      values.$pastUpgrades.0.2.0:
-        "0x2Db26DD090aDf2CC23C3506cB2F0646c517C93fB"
+        "eth:0x2Db26DD090aDf2CC23C3506cB2F0646c517C93fB"
      values.members.0.addr:
-        "0xf1cACD549400824D54c8794e63C5368C296FDA00"
+        "eth:0xf1cACD549400824D54c8794e63C5368C296FDA00"
      values.members.1.addr:
-        "0xF2cF1EEe5A4B71CEc8cFA16791f72b03bFD00e18"
+        "eth:0xF2cF1EEe5A4B71CEc8cFA16791f72b03bFD00e18"
      values.owner:
-        "0x258862dec9a77db57b398c441390783293E2a7A1"
+        "eth:0x258862dec9a77db57b398c441390783293E2a7A1"
      implementationNames.0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2Db26DD090aDf2CC23C3506cB2F0646c517C93fB:
-        "PolygonDataCommittee"
      implementationNames.eth:0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x2Db26DD090aDf2CC23C3506cB2F0646c517C93fB:
+        "PolygonDataCommittee"
    }
```

```diff
    EOA  (0x8F2D2Da3044B0A1ea54Ee26F7fe376cD9ec4393F) {
    +++ description: None
      address:
-        "0x8F2D2Da3044B0A1ea54Ee26F7fe376cD9ec4393F"
+        "eth:0x8F2D2Da3044B0A1ea54Ee26F7fe376cD9ec4393F"
    }
```

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      address:
-        "0x92726F7dE49300DBdb60930066bc1d0803c0740B"
+        "eth:0x92726F7dE49300DBdb60930066bc1d0803c0740B"
      values.$admin:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.$implementation:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.$pastUpgrades.0.2.0:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+        "eth:0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
      values.$pastUpgrades.1.2.0:
-        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.admin:
-        "0x258862dec9a77db57b398c441390783293E2a7A1"
+        "eth:0x258862dec9a77db57b398c441390783293E2a7A1"
      values.bridgeAddress:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.dataAvailabilityProtocol:
-        "0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8"
+        "eth:0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8"
+++ description: If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone.
+++ severity: HIGH
      values.forceBatchAddress:
-        "0x258862dec9a77db57b398c441390783293E2a7A1"
+        "eth:0x258862dec9a77db57b398c441390783293E2a7A1"
      values.gasTokenAddress:
-        "0xD9343a049D5DBd89CD19DC6BcA8c48fB3a0a42a7"
+        "eth:0xD9343a049D5DBd89CD19DC6BcA8c48fB3a0a42a7"
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
-        "0x8F2D2Da3044B0A1ea54Ee26F7fe376cD9ec4393F"
+        "eth:0x8F2D2Da3044B0A1ea54Ee26F7fe376cD9ec4393F"
      implementationNames.0x92726F7dE49300DBdb60930066bc1d0803c0740B:
-        "PolygonTransparentProxy"
      implementationNames.0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F:
-        "PolygonValidiumEtrog"
      implementationNames.eth:0x92726F7dE49300DBdb60930066bc1d0803c0740B:
+        "PolygonTransparentProxy"
      implementationNames.eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F:
+        "PolygonValidiumEtrog"
    }
```

```diff
    contract ProxyAdmin (0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a) {
    +++ description: None
      address:
-        "0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"
+        "eth:0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"
      values.owner:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
+        "eth:0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
      implementationNames.0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a:
-        "ProxyAdmin"
      implementationNames.eth:0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a:
+        "ProxyAdmin"
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
    EOA  (0xf1cACD549400824D54c8794e63C5368C296FDA00) {
    +++ description: None
      address:
-        "0xf1cACD549400824D54c8794e63C5368C296FDA00"
+        "eth:0xf1cACD549400824D54c8794e63C5368C296FDA00"
    }
```

```diff
    EOA  (0xF2cF1EEe5A4B71CEc8cFA16791f72b03bFD00e18) {
    +++ description: None
      address:
-        "0xF2cF1EEe5A4B71CEc8cFA16791f72b03bFD00e18"
+        "eth:0xF2cF1EEe5A4B71CEc8cFA16791f72b03bFD00e18"
    }
```

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8)
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
```

```diff
+   Status: CREATED
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B)
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a)
    +++ description: None
```

Generated with discovered.json: 0xa9b263aeca382d86b922d316ea880b3bf927e996

# Diff at Fri, 04 Jul 2025 12:19:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 21981677
- current block number: 21981677

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981677 (main branch discovery), not current.

```diff
    EOA  (0x258862dec9a77db57b398c441390783293E2a7A1) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8"
+        "eth:0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8"
      receivedPermissions.1.from:
-        "ethereum:0x92726F7dE49300DBdb60930066bc1d0803c0740B"
+        "eth:0x92726F7dE49300DBdb60930066bc1d0803c0740B"
      receivedPermissions.2.from:
-        "ethereum:0x92726F7dE49300DBdb60930066bc1d0803c0740B"
+        "eth:0x92726F7dE49300DBdb60930066bc1d0803c0740B"
    }
```

```diff
    EOA  (0x8F2D2Da3044B0A1ea54Ee26F7fe376cD9ec4393F) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x92726F7dE49300DBdb60930066bc1d0803c0740B"
+        "eth:0x92726F7dE49300DBdb60930066bc1d0803c0740B"
    }
```

```diff
    contract ProxyAdmin (0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8"
+        "eth:0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8"
    }
```

```diff
    EOA  (0xb8605297399baEb6628C9E8F5D3E52A056492cfe) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"
+        "eth:0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"
      receivedPermissions.0.from:
-        "ethereum:0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8"
+        "eth:0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"
+        "eth:0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"
    }
```

Generated with discovered.json: 0xf82ecb630c98e0d21524af39ae8b6045ec8090ef

# Diff at Fri, 23 May 2025 09:40:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21981677
- current block number: 21981677

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981677 (main branch discovery), not current.

```diff
    EOA  (0x258862dec9a77db57b398c441390783293E2a7A1) {
    +++ description: None
      receivedPermissions.2.role:
+        ".admin"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".forceBatchAddress"
    }
```

```diff
    EOA  (0x8F2D2Da3044B0A1ea54Ee26F7fe376cD9ec4393F) {
    +++ description: None
      receivedPermissions.0.role:
+        ".trustedSequencer"
    }
```

```diff
    contract ProxyAdmin (0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a) {
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

Generated with discovered.json: 0x0fd297051c1fbdef0bfca248227eef5ba51c8394

# Diff at Tue, 06 May 2025 10:56:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 21981677
- current block number: 21981677

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981677 (main branch discovery), not current.

```diff
    EOA  (0xb8605297399baEb6628C9E8F5D3E52A056492cfe) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x050e09fb8bd8b381be22676403f3eb8e9c0a8b3a

# Diff at Tue, 29 Apr 2025 08:19:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21981677
- current block number: 21981677

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981677 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      issuedPermissions:
-        [{"permission":"interact","to":"0x258862dec9a77db57b398c441390783293E2a7A1","description":"manage the members of the data availability committee and the threshold for valid commitments.","via":[]},{"permission":"upgrade","to":"0xb8605297399baEb6628C9E8F5D3E52A056492cfe","via":[{"address":"0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"}]}]
    }
```

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions:
-        [{"permission":"interact","to":"0x258862dec9a77db57b398c441390783293E2a7A1","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"interact","to":"0x258862dec9a77db57b398c441390783293E2a7A1","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x8F2D2Da3044B0A1ea54Ee26F7fe376cD9ec4393F","via":[]}]
    }
```

Generated with discovered.json: 0xc84e03c6da834aa3bbe391b4aa5da3c0f1b546b5

# Diff at Thu, 24 Apr 2025 10:30:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 21981677
- current block number: 21981677

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981677 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      values.members.1:
-        ["https://prism-da-2.eu-north-2.gateway.fm/","0xf1cACD549400824D54c8794e63C5368C296FDA00"]
+        {"url":"https://prism-da-1.eu-north-2.gateway.fm/","addr":"0xF2cF1EEe5A4B71CEc8cFA16791f72b03bFD00e18"}
      values.members.0:
-        ["https://prism-da-1.eu-north-2.gateway.fm/","0xF2cF1EEe5A4B71CEc8cFA16791f72b03bFD00e18"]
+        {"url":"https://prism-da-2.eu-north-2.gateway.fm/","addr":"0xf1cACD549400824D54c8794e63C5368C296FDA00"}
    }
```

Generated with discovered.json: 0x77d780f19ae4c3edad1919d89cef8d0eb6d38e2e

# Diff at Thu, 10 Apr 2025 14:42:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 21981677
- current block number: 21981677

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981677 (main branch discovery), not current.

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      displayName:
-        "PolygonZkEVM"
    }
```

Generated with discovered.json: 0x191025c95e4a39d36993863ed810d49fb6130559

# Diff at Wed, 19 Mar 2025 13:04:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21981677
- current block number: 21981677

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981677 (main branch discovery), not current.

```diff
    contract undefined (0x258862dec9a77db57b398c441390783293E2a7A1) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x23c88fa4ca2634d75f5cd153d42ffa8f96e5388b

# Diff at Thu, 06 Mar 2025 15:18:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21764836
- current block number: 21981677

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Watched changes

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      sourceHashes.1:
-        "0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"
+        "0x78d1eb2b96633fb1f594ef672a3791fa85a077fe0cf415ef79d93bc9a2aebd9c"
      values.$implementation:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.$pastUpgrades.1:
+        ["2025-03-05T12:12:47.000Z","0xc376c3725fb986eead241c5b7663e6e081f66b92984bc4b3f0c08d23a0101a35",["0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"]]
      values.$upgradeCount:
-        1
+        2
      derivedName:
-        "PolygonValidiumStorageMigration"
+        "PolygonValidiumEtrog"
    }
```

## Source code changes

```diff
.../Validium/PolygonValidiumEtrog.sol}             | 203 +++++++++++----------
 1 file changed, 111 insertions(+), 92 deletions(-)
```

Generated with discovered.json: 0xd002180745803850fbaa75f1c68b02af67455bd6

# Diff at Tue, 04 Mar 2025 10:39:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21764836
- current block number: 21764836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21764836 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      sinceBlock:
+        19505052
    }
```

```diff
    contract PolygonDataCommittee (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      sinceBlock:
+        20234353
    }
```

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      sinceBlock:
+        20183666
    }
```

```diff
    contract ProxyAdmin (0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a) {
    +++ description: None
      sinceBlock:
+        20234352
    }
```

Generated with discovered.json: 0x84b25f7e83bd6b9bf49ae097b00c9cab20148727

# Diff at Thu, 27 Feb 2025 11:45:57 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21764836
- current block number: 21764836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21764836 (main branch discovery), not current.

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

Generated with discovered.json: 0x9281631086bea2c2187c57b993e756484782f94d

# Diff at Wed, 26 Feb 2025 10:32:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21764836
- current block number: 21764836

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21764836 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract PolygonDataCommittee (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x3b97f93a3bd06060e37b48d338dea3ab8adf93ce

# Diff at Mon, 10 Feb 2025 19:04:12 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21764836
- current block number: 21764836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21764836 (main branch discovery), not current.

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      unverified:
-        true
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

Generated with discovered.json: 0xb1bc4c159db77c4c914dc9753bc98947bbd8d353

# Diff at Tue, 04 Feb 2025 12:31:40 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21764836
- current block number: 21764836

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21764836 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xe3bb100bb57af825e84bb319822dc5d1bb5e612e

# Diff at Mon, 03 Feb 2025 09:09:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a86862ef704cb8a38295607226918095f937c05b block: 21738270
- current block number: 21764836

## Description

discodrive polygoncdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21738270 (main branch discovery), not current.

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
    contract PolygonDataCommittee (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      name:
-        "LumiaDAC"
+        "PolygonDataCommittee"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xb8605297399baEb6628C9E8F5D3E52A056492cfe","via":[{"address":"0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
+        "0x258862dec9a77db57b398c441390783293E2a7A1"
      issuedPermissions.0.via.0:
-        {"address":"0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"}
      issuedPermissions.0.description:
+        "manage the members of the data availability committee and the threshold for valid commitments."
      template:
+        "polygon-cdk/PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1)."
    }
```

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      name:
-        "LumiaValidium"
+        "Validium"
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"configure","to":"0x258862dec9a77db57b398c441390783293E2a7A1","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"configure","to":"0x258862dec9a77db57b398c441390783293E2a7A1","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x8F2D2Da3044B0A1ea54Ee26F7fe376cD9ec4393F","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

```diff
    contract ProxyAdmin (0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a) {
    +++ description: None
      name:
-        "DACProxyAdmin"
+        "ProxyAdmin"
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xce8e32942820a66922c47e088dc4fb412ee0c1a7

# Diff at Thu, 30 Jan 2025 15:33:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21738270

## Description

Initial discovery: PolygonCDK type 4 validium (DAC) with custom gastoken LUMIA.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LumiaDAC (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LumiaValidium (0x92726F7dE49300DBdb60930066bc1d0803c0740B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DACProxyAdmin (0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a)
    +++ description: None
```
