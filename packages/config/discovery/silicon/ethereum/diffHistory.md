Generated with discovered.json: 0x6874609fab6decf339f41ba3a521fed1bbab7d6c

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
