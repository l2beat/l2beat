Generated with discovered.json: 0x6c0c8592bf943e0e6ac53a856e71cd3db5157814

# Diff at Tue, 22 Jul 2025 13:54:56 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@713d113ee2954529e09a88c55545a95e9ba43ca7 block: 22397534
- current block number: 22975146

## Description

Updated Fflonk verifier in the initial addresses to the correct one.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397534 (main branch discovery), not current.

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

Generated with discovered.json: 0x1f730a21e9de2bef611b5ab993bdfaad573dcdb6

# Diff at Mon, 14 Jul 2025 12:46:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22397534
- current block number: 22397534

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397534 (main branch discovery), not current.

```diff
    EOA  (0x07389Ba04a3D39c04BAf605bF9d254B5EB0bC3e0) {
    +++ description: None
      address:
-        "0x07389Ba04a3D39c04BAf605bF9d254B5EB0bC3e0"
+        "eth:0x07389Ba04a3D39c04BAf605bF9d254B5EB0bC3e0"
    }
```

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
    EOA  (0x113958b2E9FFDECC74EEDb206A12b5f1168164fb) {
    +++ description: None
      address:
-        "0x113958b2E9FFDECC74EEDb206A12b5f1168164fb"
+        "eth:0x113958b2E9FFDECC74EEDb206A12b5f1168164fb"
    }
```

```diff
    EOA  (0x121EA966b6AA6A361CD4c0b01cb39C6dc65e1b71) {
    +++ description: None
      address:
-        "0x121EA966b6AA6A361CD4c0b01cb39C6dc65e1b71"
+        "eth:0x121EA966b6AA6A361CD4c0b01cb39C6dc65e1b71"
    }
```

```diff
    contract PolygonDataCommittee (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 3/2).
      address:
-        "0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
+        "eth:0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
      values.$admin:
-        "0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"
+        "eth:0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"
      values.$implementation:
-        "0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608"
+        "eth:0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608"
      values.$pastUpgrades.0.2.0:
-        "0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608"
+        "eth:0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608"
      values.members.0.addr:
-        "0x07389Ba04a3D39c04BAf605bF9d254B5EB0bC3e0"
+        "eth:0x07389Ba04a3D39c04BAf605bF9d254B5EB0bC3e0"
      values.members.1.addr:
-        "0x113958b2E9FFDECC74EEDb206A12b5f1168164fb"
+        "eth:0x113958b2E9FFDECC74EEDb206A12b5f1168164fb"
      values.members.2.addr:
-        "0x88eb99475d70cCdB891171344c7Ee90688Fa134c"
+        "eth:0x88eb99475d70cCdB891171344c7Ee90688Fa134c"
      values.owner:
-        "0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
+        "eth:0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
      implementationNames.0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A:
-        "TransparentUpgradeableProxy"
      implementationNames.0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608:
-        "PolygonDataCommittee"
      implementationNames.eth:0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608:
+        "PolygonDataCommittee"
    }
```

```diff
    contract ProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1) {
    +++ description: None
      address:
-        "0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"
+        "eth:0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"
      values.owner:
-        "0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
+        "eth:0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
      implementationNames.0x3F74698A4ADb075c0501DF739745ACA55Ae543a1:
-        "ProxyAdmin"
      implementationNames.eth:0x3F74698A4ADb075c0501DF739745ACA55Ae543a1:
+        "ProxyAdmin"
    }
```

```diff
    contract Validium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: The main system contract defining the silicon-zk Layer 2 logic. Entry point for sequencing batches.
      address:
-        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        "eth:0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
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
-        "0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
+        "eth:0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
      values.bridgeAddress:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.dataAvailabilityProtocol:
-        "0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
+        "eth:0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
+++ description: If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone.
+++ severity: HIGH
      values.forceBatchAddress:
-        "0x121EA966b6AA6A361CD4c0b01cb39C6dc65e1b71"
+        "eth:0x121EA966b6AA6A361CD4c0b01cb39C6dc65e1b71"
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
-        "0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
+        "eth:0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
      values.pol:
-        "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
+        "eth:0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
      values.rollupManager:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.trustedSequencer:
-        "0x47ed9538faA1522be7abD8a8BCAEc8d9C04Ed60D"
+        "eth:0x47ed9538faA1522be7abD8a8BCAEc8d9C04Ed60D"
      implementationNames.0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB:
-        "PolygonTransparentProxy"
      implementationNames.0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F:
-        "PolygonValidiumEtrog"
      implementationNames.eth:0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB:
+        "PolygonTransparentProxy"
      implementationNames.eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F:
+        "PolygonValidiumEtrog"
    }
```

```diff
    EOA  (0x47ed9538faA1522be7abD8a8BCAEc8d9C04Ed60D) {
    +++ description: None
      address:
-        "0x47ed9538faA1522be7abD8a8BCAEc8d9C04Ed60D"
+        "eth:0x47ed9538faA1522be7abD8a8BCAEc8d9C04Ed60D"
    }
```

```diff
    EOA  (0x88eb99475d70cCdB891171344c7Ee90688Fa134c) {
    +++ description: None
      address:
-        "0x88eb99475d70cCdB891171344c7Ee90688Fa134c"
+        "eth:0x88eb99475d70cCdB891171344c7Ee90688Fa134c"
    }
```

```diff
    EOA  (0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7) {
    +++ description: None
      address:
-        "0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
+        "eth:0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
    }
```

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A)
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 3/2).
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Validium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB)
    +++ description: The main system contract defining the silicon-zk Layer 2 logic. Entry point for sequencing batches.
```

Generated with discovered.json: 0x0ab04b19723a821ca217804e3cee6a9ecc171f07

# Diff at Fri, 04 Jul 2025 12:19:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22397534
- current block number: 22397534

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397534 (main branch discovery), not current.

```diff
    EOA  (0x121EA966b6AA6A361CD4c0b01cb39C6dc65e1b71) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        "eth:0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
    }
```

```diff
    contract ProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
+        "eth:0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
    }
```

```diff
    EOA  (0x47ed9538faA1522be7abD8a8BCAEc8d9C04Ed60D) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        "eth:0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
    }
```

```diff
    EOA  (0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
+        "eth:0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
      receivedPermissions.1.from:
-        "ethereum:0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        "eth:0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"
+        "eth:0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"
      receivedPermissions.2.from:
-        "ethereum:0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
+        "eth:0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"
+        "eth:0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"
    }
```

Generated with discovered.json: 0x5d96cdc5893a07864467c1eca1ee212deddcf5c6

# Diff at Fri, 23 May 2025 09:41:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22397534
- current block number: 22397534

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397534 (main branch discovery), not current.

```diff
    EOA  (0x121EA966b6AA6A361CD4c0b01cb39C6dc65e1b71) {
    +++ description: None
      receivedPermissions.0.role:
+        ".forceBatchAddress"
    }
```

```diff
    contract ProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0x47ed9538faA1522be7abD8a8BCAEc8d9C04Ed60D) {
    +++ description: None
      receivedPermissions.0.role:
+        ".trustedSequencer"
    }
```

```diff
    EOA  (0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7) {
    +++ description: None
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.from:
-        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
+        "0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
      receivedPermissions.2.description:
-        "set core system parameters like the trusted sequencer and manage forced transactions/batches."
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.2.via:
+        [{"address":"0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"}]
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
+        "0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB"
      receivedPermissions.1.via:
-        [{"address":"0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"}]
      receivedPermissions.1.description:
+        "set core system parameters like the trusted sequencer and manage forced transactions/batches."
      receivedPermissions.1.role:
+        ".admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xe87bfae82c39b8f88dc8284ab4147645803b19fd

# Diff at Tue, 06 May 2025 10:56:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 22397534
- current block number: 22397534

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397534 (main branch discovery), not current.

```diff
    EOA  (0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x4af048fa907bfda5ed2a1ff350ddd97ce6a75e18

# Diff at Fri, 02 May 2025 17:24:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 21766766
- current block number: 22397534

## Description

Upgrade to known source: validium type 7 (latest validium). Updated sequencer url.

## Watched changes

```diff
    contract Validium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: The main system contract defining the silicon-zk Layer 2 logic. Entry point for sequencing batches.
      sourceHashes.1:
-        "0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"
+        "0x78d1eb2b96633fb1f594ef672a3791fa85a077fe0cf415ef79d93bc9a2aebd9c"
      values.$implementation:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.$pastUpgrades.1:
+        ["2025-04-29T13:09:35.000Z","0xdadc987a1a0f2da5a24bcf9c6958c3e4bbe015686cfd2f954ba4f3ee4884dc07",["0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"]]
      values.$upgradeCount:
-        1
+        2
      values.trustedSequencerURL:
-        "http://sequencer.silicon.network:8123"
+        "https://rpc.silicon.network"
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

Generated with discovered.json: 0xca8c220898a117ef7f8a6b327dce62eb51d1692d

# Diff at Tue, 29 Apr 2025 08:19:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21766766
- current block number: 21766766

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766766 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 3/2).
      issuedPermissions:
-        [{"permission":"interact","to":"0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7","description":"manage the members of the data availability committee and the threshold for valid commitments.","via":[]},{"permission":"upgrade","to":"0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7","via":[{"address":"0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"}]}]
    }
```

```diff
    contract Validium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: The main system contract defining the silicon-zk Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions:
-        [{"permission":"interact","to":"0x121EA966b6AA6A361CD4c0b01cb39C6dc65e1b71","description":"sole address that can force batches.","via":[]},{"permission":"interact","to":"0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"sequence","to":"0x47ed9538faA1522be7abD8a8BCAEc8d9C04Ed60D","via":[]}]
    }
```

Generated with discovered.json: 0xdb469a019ccf8d75ae2e8d365966cfbf6e62db12

# Diff at Thu, 24 Apr 2025 10:30:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 21766766
- current block number: 21766766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766766 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 3/2).
      values.members.2:
-        ["http://da2.silicon.network:8444","0x88eb99475d70cCdB891171344c7Ee90688Fa134c"]
+        {"url":"http://da2.silicon.network:8444","addr":"0x88eb99475d70cCdB891171344c7Ee90688Fa134c"}
      values.members.1:
-        ["http://silicon-mainnet-da-3.nodeinfra.com:8444","0x07389Ba04a3D39c04BAf605bF9d254B5EB0bC3e0"]
+        {"url":"http://da1.silicon.network:8444","addr":"0x113958b2E9FFDECC74EEDb206A12b5f1168164fb"}
      values.members.0:
-        ["http://da1.silicon.network:8444","0x113958b2E9FFDECC74EEDb206A12b5f1168164fb"]
+        {"url":"http://silicon-mainnet-da-3.nodeinfra.com:8444","addr":"0x07389Ba04a3D39c04BAf605bF9d254B5EB0bC3e0"}
    }
```

Generated with discovered.json: 0x7fda88dffb4e775f0674b352ac22b1e389237ead

# Diff at Thu, 10 Apr 2025 14:43:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 21766766
- current block number: 21766766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766766 (main branch discovery), not current.

```diff
    contract Validium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: The main system contract defining the silicon-zk Layer 2 logic. Entry point for sequencing batches.
      displayName:
-        "PolygonZkEVM"
    }
```

Generated with discovered.json: 0x78f496a41665f5cc37b25b0e205db5d89d9a2808

# Diff at Wed, 19 Mar 2025 13:05:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21766766
- current block number: 21766766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766766 (main branch discovery), not current.

```diff
    contract undefined (0x121EA966b6AA6A361CD4c0b01cb39C6dc65e1b71) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xd158840f8a00cf7fc8645f902ff0817bb6c3df02

# Diff at Tue, 04 Mar 2025 10:39:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766766
- current block number: 21766766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766766 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      sinceBlock:
+        19505052
    }
```

```diff
    contract PolygonDataCommittee (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 3/2).
      sinceBlock:
+        20578326
    }
```

```diff
    contract ProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1) {
    +++ description: None
      sinceBlock:
+        20578325
    }
```

```diff
    contract Validium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: The main system contract defining the silicon-zk Layer 2 logic. Entry point for sequencing batches.
      sinceBlock:
+        20572039
    }
```

Generated with discovered.json: 0xea4d92847d2f00d6c0c6998eb72d734abeb5c465

# Diff at Thu, 27 Feb 2025 11:46:39 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21766766
- current block number: 21766766

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766766 (main branch discovery), not current.

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

Generated with discovered.json: 0x5c33254f40d986a8d5629bc381a8c90af4839978

# Diff at Wed, 26 Feb 2025 10:33:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21766766
- current block number: 21766766

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766766 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract PolygonDataCommittee (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 3/2).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Validium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: The main system contract defining the silicon-zk Layer 2 logic. Entry point for sequencing batches.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x11a50e9af306320f73f9c72d27a78d56847353d6

# Diff at Tue, 04 Feb 2025 12:32:36 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766766
- current block number: 21766766

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766766 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 3/2).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Validium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: The main system contract defining the silicon-zk Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xbd2cc4f95d141fd4e51c89301c7ab06a492e7f5b

# Diff at Mon, 03 Feb 2025 09:09:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a86862ef704cb8a38295607226918095f937c05b block: 21744175
- current block number: 21744175

## Description

discodrive polygoncdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744175 (main branch discovery), not current.

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
    contract PolygonDataCommittee (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 3/2).
      name:
-        "SiliconDAC"
+        "PolygonDataCommittee"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7","via":[{"address":"0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"}
      issuedPermissions.0.description:
+        "manage the members of the data availability committee and the threshold for valid commitments."
      template:
+        "polygon-cdk/PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 3/2)."
    }
```

```diff
    contract ProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1) {
    +++ description: None
      name:
-        "DACProxyAdmin"
+        "ProxyAdmin"
      displayName:
-        "ProxyAdmin"
    }
```

```diff
    contract Validium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: The main system contract defining the silicon-zk Layer 2 logic. Entry point for sequencing batches.
      name:
-        "SiliconValidium"
+        "Validium"
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the silicon-zk Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"configure","to":"0x121EA966b6AA6A361CD4c0b01cb39C6dc65e1b71","description":"sole address that can force batches.","via":[]},{"permission":"configure","to":"0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"sequence","to":"0x47ed9538faA1522be7abD8a8BCAEc8d9C04Ed60D","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

Generated with discovered.json: 0xb14ae424f86bb39f0dba3f094679923b8974709c

# Diff at Mon, 20 Jan 2025 11:10:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628488
- current block number: 21628488

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628488 (main branch discovery), not current.

```diff
    contract SiliconDAC (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
    }
```

```diff
    contract DACProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
      directlyReceivedPermissions.0.from:
+        "0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
    }
```

Generated with discovered.json: 0x6423bc1c15bb92d059efe23e320a4cec0f2c1dd7

# Diff at Wed, 15 Jan 2025 07:48:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 20783770
- current block number: 21628488

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20783770 (main branch discovery), not current.

```diff
    contract DACProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x2b8632604e7d35a2da4a5e94f58b96b40b5c5c51

# Diff at Mon, 21 Oct 2024 11:10:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20783770
- current block number: 20783770

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20783770 (main branch discovery), not current.

```diff
    contract SiliconDAC (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608"]
      values.$pastUpgrades.0.1:
-        ["0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608"]
+        "0xee62b099c28e601917f60c0abff8441d48a2e7aee41711ff89a9ae0cc2fc647c"
    }
```

```diff
    contract SiliconValidium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
      values.$pastUpgrades.0.1:
-        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
+        "0xc47c5c6b0ea1740437487c101b78895a761501a35bfa97a77d79e803151ccf41"
    }
```

Generated with discovered.json: 0xb1b4c87ab571797807e79aed98859f9e281950c7

# Diff at Mon, 14 Oct 2024 10:55:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20783770
- current block number: 20783770

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20783770 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: None
      sourceHashes:
+        ["0x0bc67d276b40b2ba13903d94fd6c25ae4d3d5162bc942763c418afdc11bc9b32"]
    }
```

```diff
    contract SiliconDAC (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"
+        "0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
      issuedPermissions.0.via.0:
+        {"address":"0x3F74698A4ADb075c0501DF739745ACA55Ae543a1","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0xf7c38d00c4b6000f1840ed38f9ae99d753da8ac69ee1b6ac9ed614f2b60d470f"]
    }
```

```diff
    contract DACProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"}]
    }
```

```diff
    contract SiliconValidium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: None
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

Generated with discovered.json: 0x354389dbc886521e157175c6f68986d5d3ec26d4

# Diff at Tue, 01 Oct 2024 10:55:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20783770
- current block number: 20783770

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20783770 (main branch discovery), not current.

```diff
    contract SiliconDAC (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-08-21T16:55:59.000Z",["0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608"]]]
    }
```

```diff
    contract SiliconValidium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-08-20T19:52:11.000Z",["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]]]
    }
```

Generated with discovered.json: 0x9487c18c1d17b81e0e06559883359d3be5b8dd21

# Diff at Thu, 19 Sep 2024 09:33:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20783770

## Description

Initial discovery of a standard type 4 PolygonCDK validium. LocalAdmin / Chain Owner is an EOA.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SiliconDAC (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DACProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SiliconValidium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB)
    +++ description: None
```
