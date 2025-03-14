Generated with discovered.json: 0x5a730eafd09825961d739269b16d495693da1ab3

# Diff at Tue, 04 Mar 2025 10:40:12 GMT:

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
