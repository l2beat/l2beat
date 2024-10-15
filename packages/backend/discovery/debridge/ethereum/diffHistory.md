Generated with discovered.json: 0x038ed0c796a80592082c759749567fe7fae25f98

# Diff at Mon, 14 Oct 2024 10:50:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xcd8bce7612cc46b4eb6dae7d913880fdd47ee8fcd03d90bd5d99fe145638685c"]
    }
```

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0x90a8fe0eeb8f61a691fd579cb10499f4fd9167497e9aeab3b1ce4f6427fabc96"]
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xd67e23441d8b22dcf363c048ad14a86a4de64b242cb242fd7ef0fa11da2cb6ff"]
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xbda27aaf69ce4f365f73f0436a7e06bffede3a693579569ec42ae41718b94c75"]
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xc18d3818f9e809ced3dcce60fbe4287220ce2fced4f6c66711de5e704738bb9a"]
    }
```

```diff
    contract DeBridgeToken (0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B) {
    +++ description: None
      sourceHashes:
+        ["0x13def2c5fc95163873f1d15d260b9e03ac811bd830b6ed282e527268e3ca7759"]
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      sourceHashes:
+        ["0x31b987ba8db4fc147856ec1375d9df4f40d58c4dc97e16be5b38ee2e3c3cc6f9"]
    }
```

Generated with discovered.json: 0xcc37d0b5927f57a7bfcca5b67187d28a067d781f

# Diff at Tue, 01 Oct 2024 10:50:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T15:36:30.000Z",["0xB1A20D1c885fd775df97396397d6f8F07Abdd20D"]],["2021-12-16T14:53:55.000Z",["0xFCe0502293dCacbFc2d663f7814b2771dEcfd576"]],["2022-01-18T09:29:57.000Z",["0x51bFD427D06B2a5FC3588f9d023994A9f70e0Ce0"]],["2022-02-16T13:27:21.000Z",["0xc8550d85759BAbE6851235212563Fa2Ff04961BF"]],["2022-03-15T12:17:48.000Z",["0x24455aa55DED7728783c9474bE8eA2f5C935f8EB"]],["2022-12-15T10:58:59.000Z",["0x797161BCC625155D2302251404ccB93c2632658e"]]]
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T20:43:22.000Z",["0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"]]]
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T23:54:37.000Z",["0x4e446b6Cf4d127827c83Ca0c848Db0B43841c391"]],["2022-01-18T09:32:02.000Z",["0xd5317E82BFEFf70b4773f0fcab5e2ABFA3c7D63b"]],["2022-02-16T12:55:04.000Z",["0x752A9e96e8683400ae238270C97c1D0160861fEF"]],["2022-05-02T14:08:42.000Z",["0x0C4B79205F6Cc20c0E0201b61b99e77F3CE3B67A"]],["2022-05-19T13:24:39.000Z",["0xe5a04b307B31Af07F4DfCaA840952Ff7d3845c7e"]],["2022-05-28T12:04:47.000Z",["0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"]]]
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T22:58:34.000Z",["0x2a3e72eD893b5958690e16c3BBe1BD92137b6250"]],["2021-12-17T11:09:26.000Z",["0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"]]]
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-23T07:17:24.000Z",["0x27406EbF0b76923d93b4C6c6224bCaB7fFf11f87"]],["2022-02-16T12:53:26.000Z",["0x37a52ddb753c924f8C914de65ef00b5210Caa83C"]]]
    }
```

Generated with discovered.json: 0x7d79e2d69c93c74c05856e4aaf1e5fa49701aa6e

# Diff at Fri, 30 Aug 2024 07:51:51 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      receivedPermissions.4.via:
-        []
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

Generated with discovered.json: 0xde56002fbef5f5aaa8156ca51c09c6a39036544e

# Diff at Fri, 23 Aug 2024 09:51:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x4ddc94444b30e4de717b40d2aa458862856ca290

# Diff at Wed, 21 Aug 2024 10:02:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","via":[]},{"permission":"upgrade","target":"0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","via":[]},{"permission":"upgrade","target":"0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","via":[]},{"permission":"upgrade","target":"0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","via":[]},{"permission":"upgrade","target":"0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636","via":[]}]
    }
```

Generated with discovered.json: 0x7a5b0751cc93b478d827595729c278e302cbf4b0

# Diff at Fri, 09 Aug 2024 11:59:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
+        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
      assignedPermissions.upgrade.3:
-        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
+        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      assignedPermissions.upgrade.2:
-        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
+        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      assignedPermissions.upgrade.1:
-        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
+        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
    }
```

Generated with discovered.json: 0xe26b5f1f4100a80a7834bb9a137a63ab5b73bf24

# Diff at Fri, 09 Aug 2024 10:09:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5","0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D","0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C","0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1","0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7","0x6f572a24c5C009fC8C844Fab5352edf79F132FBD","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.getThreshold:
-        5
      values.$members:
+        ["0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5","0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D","0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C","0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1","0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7","0x6f572a24c5C009fC8C844Fab5352edf79F132FBD","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"]
      assignedPermissions.upgrade:
+        ["0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636","0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"]
    }
```

Generated with discovered.json: 0x34f9ac97eab2ad6732a9a06b5a7ee8bd82790948

# Diff at Thu, 28 Mar 2024 08:50:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 18168455
- current block number: 19531527

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18168455 (main branch discovery), not current.

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 8 (63%)"
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xa161a29a73bdb10e32f48033bfc0773a2c051c5b
