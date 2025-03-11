Generated with discovered.json: 0x1a09076cc325795293a9cf9aa2f16de40ad848eb

# Diff at Tue, 04 Mar 2025 10:39:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21937191
- current block number: 21937191

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21937191 (main branch discovery), not current.

```diff
    contract HomeUpgradeBeacon (0x101a39eA1143cb252fc8093847399046fc35Db89) {
    +++ description: None
      sinceBlock:
+        13692067
    }
```

```diff
    contract ReplicaBeaconProxy (0x27658c5556A9a57f96E69Bbf6d3B8016f001a785) {
    +++ description: None
      sinceBlock:
+        13692126
    }
```

```diff
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    +++ description: None
      sinceBlock:
+        13643255
    }
```

```diff
    contract GovernanceUpgradeBeacon (0x4d89F34dB307015F8002F97c1d100d84e3AFb76c) {
    +++ description: None
      sinceBlock:
+        13692072
    }
```

```diff
    contract UpgradeBeaconController (0x4F50a7081792063693F46A6402390b9647562457) {
    +++ description: None
      sinceBlock:
+        13692049
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x4fc16De11deAc71E8b2Db539d82d93BE4b486892) {
    +++ description: None
      sinceBlock:
+        13692228
    }
```

```diff
    contract UpdaterManager (0x81B97dfBB743c343983e9bE7B863dB636DbD7373) {
    +++ description: None
      sinceBlock:
+        13692055
    }
```

```diff
    contract XAppConnectionManager (0x8A926cE79f83A5A4C234BeE93feAFCC85b1E40cD) {
    +++ description: None
      sinceBlock:
+        13692061
    }
```

```diff
    contract ReplicaUpgradeBeacon (0xA734EDE8229970776e1B68085D579b6b6E97dAd4) {
    +++ description: None
      sinceBlock:
+        13692126
    }
```

```diff
    contract HomeBeaconProxy (0xa73a3a74C7044B5411bD61E1990618A1400DA379) {
    +++ description: None
      sinceBlock:
+        13692067
    }
```

```diff
    contract BridgeUpgradeBeacon (0xB6bB41B1fb8c381b002C405B8abB5D1De0C0abFE) {
    +++ description: None
      sinceBlock:
+        13692228
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94) {
    +++ description: None
      sinceBlock:
+        13692072
    }
```

Generated with discovered.json: 0xdd49557a814fe3a97b52c050bfe10c1af8176d3b

# Diff at Mon, 20 Jan 2025 11:09:50 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20878317
- current block number: 20878317

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878317 (main branch discovery), not current.

```diff
    contract ReplicaBeaconProxy (0x27658c5556A9a57f96E69Bbf6d3B8016f001a785) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4F50a7081792063693F46A6402390b9647562457"
      issuedPermissions.0.to:
+        "0x4F50a7081792063693F46A6402390b9647562457"
    }
```

```diff
    contract UpgradeBeaconController (0x4F50a7081792063693F46A6402390b9647562457) {
    +++ description: None
      receivedPermissions.3.target:
-        "0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94"
      receivedPermissions.3.from:
+        "0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94"
      receivedPermissions.2.target:
-        "0xa73a3a74C7044B5411bD61E1990618A1400DA379"
      receivedPermissions.2.from:
+        "0xa73a3a74C7044B5411bD61E1990618A1400DA379"
      receivedPermissions.1.target:
-        "0x4fc16De11deAc71E8b2Db539d82d93BE4b486892"
      receivedPermissions.1.from:
+        "0x4fc16De11deAc71E8b2Db539d82d93BE4b486892"
      receivedPermissions.0.target:
-        "0x27658c5556A9a57f96E69Bbf6d3B8016f001a785"
      receivedPermissions.0.from:
+        "0x27658c5556A9a57f96E69Bbf6d3B8016f001a785"
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x4fc16De11deAc71E8b2Db539d82d93BE4b486892) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4F50a7081792063693F46A6402390b9647562457"
      issuedPermissions.0.to:
+        "0x4F50a7081792063693F46A6402390b9647562457"
    }
```

```diff
    contract HomeBeaconProxy (0xa73a3a74C7044B5411bD61E1990618A1400DA379) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4F50a7081792063693F46A6402390b9647562457"
      issuedPermissions.0.to:
+        "0x4F50a7081792063693F46A6402390b9647562457"
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4F50a7081792063693F46A6402390b9647562457"
      issuedPermissions.0.to:
+        "0x4F50a7081792063693F46A6402390b9647562457"
    }
```

Generated with discovered.json: 0xd70f3e03b931320be480aab4b075c448cf8a19ba

# Diff at Mon, 21 Oct 2024 11:08:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20878317
- current block number: 20878317

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878317 (main branch discovery), not current.

```diff
    contract ReplicaBeaconProxy (0x27658c5556A9a57f96E69Bbf6d3B8016f001a785) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x8F6b6aDB49cDCa3b9F6947F61a1201242C3d827F"]
      values.$pastUpgrades.1.1:
-        ["0x8F6b6aDB49cDCa3b9F6947F61a1201242C3d827F"]
+        "0x5fe6682f80c14c3a3d5475428af5100ac95e11c060a155c2fb588cff1da4ebe7"
      values.$pastUpgrades.0.2:
+        ["0xCBe8b8C4Fe6590BB59d1507dE7f252AF3E621E58"]
      values.$pastUpgrades.0.1:
-        ["0xCBe8b8C4Fe6590BB59d1507dE7f252AF3E621E58"]
+        "0xdd7c4c8cd11347c5801a27705f6fe9e6327d4604aa420ac82411d682529494bc"
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x4fc16De11deAc71E8b2Db539d82d93BE4b486892) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x688A54c4b1C5b917154Ea2f61B8A4A4CbDfF4738"]
      values.$pastUpgrades.0.1:
-        ["0x688A54c4b1C5b917154Ea2f61B8A4A4CbDfF4738"]
+        "0xa5c19932611d4fe9d7a7e54261c31a089b922c0dfbe4f484b9f9628ad55b4f66"
    }
```

```diff
    contract HomeBeaconProxy (0xa73a3a74C7044B5411bD61E1990618A1400DA379) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xfc6E146384b5c65f372d5b20537F3e8727aD3723"]
      values.$pastUpgrades.0.1:
-        ["0xfc6E146384b5c65f372d5b20537F3e8727aD3723"]
+        "0x7a32e92f8a9a755261c146eebf6ce93a371e4fbb7290b0c3bebf88fd6e6a2b64"
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xe552861e90a42ddDC66b508A18a85bCEAbFcB835"]
      values.$pastUpgrades.0.1:
-        ["0xe552861e90a42ddDC66b508A18a85bCEAbFcB835"]
+        "0x47acb921f524b315e263bf26feaa0b8b2241f1bfaca4d0a01a52ab444ca21c5d"
    }
```

Generated with discovered.json: 0x42520886def9b6e1fe4aa2117a56a7cbfacf52d0

# Diff at Mon, 14 Oct 2024 10:53:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20878317
- current block number: 20878317

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878317 (main branch discovery), not current.

```diff
    contract HomeUpgradeBeacon (0x101a39eA1143cb252fc8093847399046fc35Db89) {
    +++ description: None
      sourceHashes:
+        ["0x22841c972728a5327e28da1a887ae68b6db4dc5f1d658e516abcba1a265b21d8"]
    }
```

```diff
    contract ReplicaBeaconProxy (0x27658c5556A9a57f96E69Bbf6d3B8016f001a785) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388","0x3fa6a34a243dd0723157d70d7d21fc377ce2b0f38dea55d089556c264972063f"]
    }
```

```diff
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GovernanceUpgradeBeacon (0x4d89F34dB307015F8002F97c1d100d84e3AFb76c) {
    +++ description: None
      sourceHashes:
+        ["0x22841c972728a5327e28da1a887ae68b6db4dc5f1d658e516abcba1a265b21d8"]
    }
```

```diff
    contract UpgradeBeaconController (0x4F50a7081792063693F46A6402390b9647562457) {
    +++ description: None
      sourceHashes:
+        ["0x12e387edec9bf90c8c2ee351a4b607488ae3e01f861eb7dabbf3e4fdd078ad48"]
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x4fc16De11deAc71E8b2Db539d82d93BE4b486892) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388","0x5bd24b5259f733f1cb0c93cd38718fd109ef8701385499565ac77523dac5dfd7"]
    }
```

```diff
    contract UpdaterManager (0x81B97dfBB743c343983e9bE7B863dB636DbD7373) {
    +++ description: None
      sourceHashes:
+        ["0x4ac3e27d1d1ef6c9a05335874ae7286f305ae29a71c239cd1095617d01efbaf0"]
    }
```

```diff
    contract XAppConnectionManager (0x8A926cE79f83A5A4C234BeE93feAFCC85b1E40cD) {
    +++ description: None
      sourceHashes:
+        ["0xb64e5af8c508ce86c29728805a64c3b45bf37a0a28c4ea602902a3e23de80dfd"]
    }
```

```diff
    contract ReplicaUpgradeBeacon (0xA734EDE8229970776e1B68085D579b6b6E97dAd4) {
    +++ description: None
      sourceHashes:
+        ["0x22841c972728a5327e28da1a887ae68b6db4dc5f1d658e516abcba1a265b21d8"]
    }
```

```diff
    contract HomeBeaconProxy (0xa73a3a74C7044B5411bD61E1990618A1400DA379) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388","0xd4e593cba02e81da0882f30e09e38c2015c6f635b3911e27d19b579b1b92eba5"]
    }
```

```diff
    contract BridgeUpgradeBeacon (0xB6bB41B1fb8c381b002C405B8abB5D1De0C0abFE) {
    +++ description: None
      sourceHashes:
+        ["0x22841c972728a5327e28da1a887ae68b6db4dc5f1d658e516abcba1a265b21d8"]
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94) {
    +++ description: None
      sourceHashes:
+        ["0xbe5d364ff65b55d089681036cc772258083d96100d71309b7cd76d6f69ced388","0xfe51330f918cf664ca579984982dbeeab54d9a2461dcd1938ff2d46b9c77b306"]
    }
```

Generated with discovered.json: 0xec58ac97c0167d5fe9923d5d2baff04c7e4ac2b8

# Diff at Tue, 01 Oct 2024 10:53:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20311133
- current block number: 20311133

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311133 (main branch discovery), not current.

```diff
    contract ReplicaBeaconProxy (0x27658c5556A9a57f96E69Bbf6d3B8016f001a785) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-26T21:29:33.000Z",["0xCBe8b8C4Fe6590BB59d1507dE7f252AF3E621E58"]],["2022-02-02T23:08:45.000Z",["0x8F6b6aDB49cDCa3b9F6947F61a1201242C3d827F"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x4fc16De11deAc71E8b2Db539d82d93BE4b486892) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-26T21:52:29.000Z",["0x688A54c4b1C5b917154Ea2f61B8A4A4CbDfF4738"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract HomeBeaconProxy (0xa73a3a74C7044B5411bD61E1990618A1400DA379) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-26T21:14:43.000Z",["0xfc6E146384b5c65f372d5b20537F3e8727aD3723"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-26T21:15:47.000Z",["0xe552861e90a42ddDC66b508A18a85bCEAbFcB835"]]]
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xd1c06785083b2baae35e3b0a6005bcac42cf81b8

# Diff at Fri, 30 Aug 2024 07:54:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20311133
- current block number: 20311133

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311133 (main branch discovery), not current.

```diff
    contract UpgradeBeaconController (0x4F50a7081792063693F46A6402390b9647562457) {
    +++ description: None
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xb691fea728efe0b3ca04b660a443e02c04d66969

# Diff at Wed, 21 Aug 2024 10:04:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20311133
- current block number: 20311133

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311133 (main branch discovery), not current.

```diff
    contract ReplicaBeaconProxy (0x27658c5556A9a57f96E69Bbf6d3B8016f001a785) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4F50a7081792063693F46A6402390b9647562457","via":[]}]
    }
```

```diff
    contract UpgradeBeaconController (0x4F50a7081792063693F46A6402390b9647562457) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x27658c5556A9a57f96E69Bbf6d3B8016f001a785","0x4fc16De11deAc71E8b2Db539d82d93BE4b486892","0xa73a3a74C7044B5411bD61E1990618A1400DA379","0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x27658c5556A9a57f96E69Bbf6d3B8016f001a785","via":[]},{"permission":"upgrade","target":"0x4fc16De11deAc71E8b2Db539d82d93BE4b486892","via":[]},{"permission":"upgrade","target":"0xa73a3a74C7044B5411bD61E1990618A1400DA379","via":[]},{"permission":"upgrade","target":"0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94","via":[]}]
    }
```

```diff
    contract BridgeRouterBeaconProxy (0x4fc16De11deAc71E8b2Db539d82d93BE4b486892) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4F50a7081792063693F46A6402390b9647562457","via":[]}]
    }
```

```diff
    contract HomeBeaconProxy (0xa73a3a74C7044B5411bD61E1990618A1400DA379) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4F50a7081792063693F46A6402390b9647562457","via":[]}]
    }
```

```diff
    contract GovernanceRouterBeaconProxy (0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4F50a7081792063693F46A6402390b9647562457","via":[]}]
    }
```

Generated with discovered.json: 0x361bba8b22d4fbe45d4f6ed5c4d163be2c9665f2

# Diff at Fri, 09 Aug 2024 12:00:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20311133
- current block number: 20311133

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311133 (main branch discovery), not current.

```diff
    contract UpgradeBeaconController (0x4F50a7081792063693F46A6402390b9647562457) {
    +++ description: None
      assignedPermissions.upgrade.3:
-        "0xa73a3a74C7044B5411bD61E1990618A1400DA379"
+        "0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94"
      assignedPermissions.upgrade.2:
-        "0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94"
+        "0xa73a3a74C7044B5411bD61E1990618A1400DA379"
    }
```

Generated with discovered.json: 0xd31d855c922f921d764b8f36251763b2f255f896

# Diff at Fri, 09 Aug 2024 10:11:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20311133
- current block number: 20311133

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311133 (main branch discovery), not current.

```diff
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0xFCcD3516d6BB62b009088aDae1E349430dDF6e77","0x63c079444e07D82d33399DE7D56d6E48740494c7","0xa725898D6F73C512f803B564A89DFbd96cF298EC","0xd85DC9A21378EF738A248236E970c2e0be89C9c2","0xeE2b1e23e71052860C14f69E84AAF78478606D63","0x7d7cd2ED526F99D05A05a93CCf42C1ADdBe78552","0x7519Db53B63d72721470319A5F4462D587Bb3008"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xFCcD3516d6BB62b009088aDae1E349430dDF6e77","0x63c079444e07D82d33399DE7D56d6E48740494c7","0xa725898D6F73C512f803B564A89DFbd96cF298EC","0xd85DC9A21378EF738A248236E970c2e0be89C9c2","0xeE2b1e23e71052860C14f69E84AAF78478606D63","0x7d7cd2ED526F99D05A05a93CCf42C1ADdBe78552","0x7519Db53B63d72721470319A5F4462D587Bb3008"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract UpgradeBeaconController (0x4F50a7081792063693F46A6402390b9647562457) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x27658c5556A9a57f96E69Bbf6d3B8016f001a785","0x4fc16De11deAc71E8b2Db539d82d93BE4b486892","0xa73a3a74C7044B5411bD61E1990618A1400DA379","0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94"]
      assignedPermissions.upgrade:
+        ["0x27658c5556A9a57f96E69Bbf6d3B8016f001a785","0x4fc16De11deAc71E8b2Db539d82d93BE4b486892","0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94","0xa73a3a74C7044B5411bD61E1990618A1400DA379"]
    }
```

Generated with discovered.json: 0xe8a5954f2f6314cdde947a285a82dc54525aad41

# Diff at Thu, 28 Mar 2024 10:31:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19218300
- current block number: 19532028

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19218300 (main branch discovery), not current.

```diff
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x49181e4503e9468845b1d08bde6efff7f7601e23

# Diff at Fri, 13 Oct 2023 07:04:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@28e18077472448efd6132e6ee714b582cc1ee80b

## Description

Newly created contracts are the result of rediscovering the `upgradeBeacon` address.

## Watched changes

```diff
+   Status: CREATED
    contract HomeUpgradeBeacon (0x101a39eA1143cb252fc8093847399046fc35Db89) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceUpgradeBeacon (0x4d89F34dB307015F8002F97c1d100d84e3AFb76c) {
    }
```

```diff
+   Status: CREATED
    contract ReplicaUpgradeBeacon (0xA734EDE8229970776e1B68085D579b6b6E97dAd4) {
    }
```

```diff
+   Status: CREATED
    contract BridgeUpgradeBeacon (0xB6bB41B1fb8c381b002C405B8abB5D1De0C0abFE) {
    }
```

# Diff at Mon, 09 Oct 2023 13:00:07 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Added config.

## Watched changes

```diff
+   Status: CREATED
    contract ReplicaBeaconProxy (0x27658c5556A9a57f96E69Bbf6d3B8016f001a785) {
    }
```

```diff
+   Status: CREATED
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconController (0x4F50a7081792063693F46A6402390b9647562457) {
    }
```

```diff
+   Status: CREATED
    contract BridgeRouterBeaconProxy (0x4fc16De11deAc71E8b2Db539d82d93BE4b486892) {
    }
```

```diff
+   Status: CREATED
    contract UpdaterManager (0x81B97dfBB743c343983e9bE7B863dB636DbD7373) {
    }
```

```diff
+   Status: CREATED
    contract XAppConnectionManager (0x8A926cE79f83A5A4C234BeE93feAFCC85b1E40cD) {
    }
```

```diff
+   Status: CREATED
    contract HomeBeaconProxy (0xa73a3a74C7044B5411bD61E1990618A1400DA379) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceRouterBeaconProxy (0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94) {
    }
```
