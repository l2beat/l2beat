Generated with discovered.json: 0xf4a2ba2fd94a56f138e3f7046ea71111b26ee9aa

# Diff at Tue, 28 Jan 2025 15:41:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@74b593a4e23a0f1eeb37e9554e9a6178c76f8286 block: 21715800
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
