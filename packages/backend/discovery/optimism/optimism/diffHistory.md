Generated with discovered.json: 0xc3527c08f9f1468797be981c8cc9c3858d6d3d87

# Diff at Tue, 01 Oct 2024 11:13:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-14T00:00:01.000Z",["0xb528D11cC114E026F138fE568744c6D45ce6Da7A"]],["2024-07-10T16:00:01.000Z",["0xa919894851548179A0750865e7974DA599C0Fac7"]]]
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-10-04T21:36:13.000Z",["0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"]]]
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-14T00:00:01.000Z",["0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"]]]
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-27T22:05:33.000Z",["0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13"]]]
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-27T22:05:33.000Z",["0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088"]]]
    }
```

```diff
-   Status: DELETED
    contract OldQuixoticNFTBridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D)
    +++ description: None
```

Generated with discovered.json: 0xde56736763a79673334ff3f954cd27f22d15ce8c

# Diff at Sun, 08 Sep 2024 17:20:14 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}
      issuedPermissions.0.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000002"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000007"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000000F"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000010"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000011"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000012"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000013"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000014"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000015"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000016"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000017"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000019"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000001A"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000020"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000021"}]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000002"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000007"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000000F"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000010"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000011"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000012"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000013"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000014"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000015"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000016"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000017"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000019"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000001A"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000020"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000021"}]
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

Generated with discovered.json: 0xbe928e4bf99a8230745afc52ef46b7b67ad76946

# Diff at Fri, 30 Aug 2024 08:07:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      receivedPermissions.15.via:
-        []
      receivedPermissions.14.via:
-        []
      receivedPermissions.13.via:
-        []
      receivedPermissions.12.via:
-        []
      receivedPermissions.11.via:
-        []
      receivedPermissions.10.via:
-        []
      receivedPermissions.9.via:
-        []
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
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

Generated with discovered.json: 0xdf61d13f6212a4e33bf5f8853829cc02df1c0ad6

# Diff at Fri, 23 Aug 2024 09:58:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xd085c9f1c61827b17645b6775951134a35698f7d

# Diff at Wed, 21 Aug 2024 10:08:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4200000000000000000000000000000000000002","0x4200000000000000000000000000000000000007","0x420000000000000000000000000000000000000F","0x4200000000000000000000000000000000000010","0x4200000000000000000000000000000000000011","0x4200000000000000000000000000000000000012","0x4200000000000000000000000000000000000013","0x4200000000000000000000000000000000000014","0x4200000000000000000000000000000000000015","0x4200000000000000000000000000000000000016","0x4200000000000000000000000000000000000017","0x4200000000000000000000000000000000000018","0x4200000000000000000000000000000000000019","0x420000000000000000000000000000000000001A","0x4200000000000000000000000000000000000020","0x4200000000000000000000000000000000000021"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000002","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000007","via":[]},{"permission":"upgrade","target":"0x420000000000000000000000000000000000000F","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000010","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000011","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000012","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000013","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000014","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000015","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000016","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000017","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000019","via":[]},{"permission":"upgrade","target":"0x420000000000000000000000000000000000001A","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000020","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000021","via":[]}]
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

Generated with discovered.json: 0x11c5d304eee079e826c09a6ecd7d7e7a37dc2150

# Diff at Fri, 09 Aug 2024 12:04:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      assignedPermissions.upgrade.15:
-        "0x4200000000000000000000000000000000000018"
+        "0x4200000000000000000000000000000000000021"
      assignedPermissions.upgrade.14:
-        "0x4200000000000000000000000000000000000007"
+        "0x4200000000000000000000000000000000000020"
      assignedPermissions.upgrade.13:
-        "0x4200000000000000000000000000000000000016"
+        "0x420000000000000000000000000000000000001A"
      assignedPermissions.upgrade.12:
-        "0x4200000000000000000000000000000000000010"
+        "0x4200000000000000000000000000000000000019"
      assignedPermissions.upgrade.11:
-        "0x4200000000000000000000000000000000000019"
+        "0x4200000000000000000000000000000000000018"
      assignedPermissions.upgrade.10:
-        "0x4200000000000000000000000000000000000020"
+        "0x4200000000000000000000000000000000000017"
      assignedPermissions.upgrade.9:
-        "0x4200000000000000000000000000000000000021"
+        "0x4200000000000000000000000000000000000016"
      assignedPermissions.upgrade.7:
-        "0x4200000000000000000000000000000000000017"
+        "0x4200000000000000000000000000000000000014"
      assignedPermissions.upgrade.6:
-        "0x420000000000000000000000000000000000000F"
+        "0x4200000000000000000000000000000000000013"
      assignedPermissions.upgrade.5:
-        "0x4200000000000000000000000000000000000011"
+        "0x4200000000000000000000000000000000000012"
      assignedPermissions.upgrade.4:
-        "0x4200000000000000000000000000000000000014"
+        "0x4200000000000000000000000000000000000011"
      assignedPermissions.upgrade.3:
-        "0x4200000000000000000000000000000000000012"
+        "0x4200000000000000000000000000000000000010"
      assignedPermissions.upgrade.2:
-        "0x420000000000000000000000000000000000001A"
+        "0x420000000000000000000000000000000000000F"
      assignedPermissions.upgrade.1:
-        "0x4200000000000000000000000000000000000002"
+        "0x4200000000000000000000000000000000000007"
      assignedPermissions.upgrade.0:
-        "0x4200000000000000000000000000000000000013"
+        "0x4200000000000000000000000000000000000002"
    }
```

Generated with discovered.json: 0x521f8577f44a3d19e4a94182cca9f6b70e4e26a0

# Diff at Fri, 09 Aug 2024 10:14:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x3041BA32f451F5850c147805F5521AC206421623","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0xdb203D7f00fF435dA107543B33495f9cA2c484C6","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x3041BA32f451F5850c147805F5521AC206421623","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0xdb203D7f00fF435dA107543B33495f9cA2c484C6","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4200000000000000000000000000000000000002","0x4200000000000000000000000000000000000007","0x420000000000000000000000000000000000000F","0x4200000000000000000000000000000000000010","0x4200000000000000000000000000000000000011","0x4200000000000000000000000000000000000012","0x4200000000000000000000000000000000000013","0x4200000000000000000000000000000000000014","0x4200000000000000000000000000000000000015","0x4200000000000000000000000000000000000016","0x4200000000000000000000000000000000000017","0x4200000000000000000000000000000000000018","0x4200000000000000000000000000000000000019","0x420000000000000000000000000000000000001A","0x4200000000000000000000000000000000000020","0x4200000000000000000000000000000000000021"]
      assignedPermissions.upgrade:
+        ["0x4200000000000000000000000000000000000013","0x4200000000000000000000000000000000000002","0x420000000000000000000000000000000000001A","0x4200000000000000000000000000000000000012","0x4200000000000000000000000000000000000014","0x4200000000000000000000000000000000000011","0x420000000000000000000000000000000000000F","0x4200000000000000000000000000000000000017","0x4200000000000000000000000000000000000015","0x4200000000000000000000000000000000000021","0x4200000000000000000000000000000000000020","0x4200000000000000000000000000000000000019","0x4200000000000000000000000000000000000010","0x4200000000000000000000000000000000000016","0x4200000000000000000000000000000000000007","0x4200000000000000000000000000000000000018"]
    }
```

Generated with discovered.json: 0xbb4c91641c0bf25a3e6c9e69893a5e2edc9eb451

# Diff at Fri, 12 Jul 2024 11:52:45 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d6f7bd1c3a10712b93b6891cc6ca39616765a983 block: 121899221
- current block number: 122593187

## Description

The changes are due to the [OP Mainnet 'Fjord' upgrade](https://gov.optimism.io/t/upgrade-proposal-9-fjord-network-upgrade/8236).

The GasPriceOracle predeploy is changed to use a FastLZ-based compression estimator for gas price estimation. (compare [the spec](https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/fjord/exec-engine.md#fees))

## Watched changes

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      values.$implementation:
-        "0xb528D11cC114E026F138fE568744c6D45ce6Da7A"
+        "0xa919894851548179A0750865e7974DA599C0Fac7"
      values.baseFeeScalar:
-        1368
+        5227
      values.version:
-        "1.2.0"
+        "1.3.0"
      values.isFjord:
+        true
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.baseFeeScalar:
-        1368
+        5227
    }
```

## Source code changes

```diff
.../GasPriceOracle/GasPriceOracle.sol              | 558 ++++++++++++++++++---
 1 file changed, 493 insertions(+), 65 deletions(-)
```

Generated with discovered.json: 0x010f9329c5b32c1c688ec638d3dd7adefe490a80

# Diff at Wed, 26 Jun 2024 10:20:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb9200e010745e10244c0b3851b3acf21fe41f31 block: 121593875
- current block number: 121899221

## Description

Ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 121593875 (main branch discovery), not current.

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      values.totalProcessed:
-        "1928902844154653024561"
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      values.totalProcessed:
-        "11679962820116169091101"
    }
```

Generated with discovered.json: 0xc5eed77bd737b6f96961ef8ac1380b3dcfc065b1

# Diff at Tue, 11 Jun 2024 10:11:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a747b8f93a46c87e2494c6adb06df4640d08444 block: 121202053
- current block number: 121250937

## Description

The ProxyAdmin owner is now the same as L1 (but aliased).

## Watched changes

```diff
-   Status: DELETED
    contract InternalProxyAdminOwnerMultisig1 (0x28B1eE885034ccD2d5Fa228a9A3157390D27177C)
    +++ description: None
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      values.owner:
-        "0x7871d1187A97cbbE40710aC119AA3d412944e4Fe"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
-   Status: DELETED
    contract L2ProxyAdminOwner (0x7871d1187A97cbbE40710aC119AA3d412944e4Fe)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafeL2.sol => /dev/null                  | 1031 --------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 .../GnosisSafeL2.sol => /dev/null                  | 1031 --------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 4 files changed, 2130 deletions(-)
```

Generated with discovered.json: 0xf3841b075c5c5f1392147ee9bf27462c6692ba7e

# Diff at Mon, 10 Jun 2024 07:01:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@023db9216bab49e9b3ffde0e43664e3e63c60fcf block: 120992980
- current block number: 121202053

## Description

Ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 120992980 (main branch discovery), not current.

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      values.totalProcessed:
-        "3495563082937265797169"
    }
```

Generated with discovered.json: 0xa1d57f190fbdfb73f7171e0322ccf7bddd4a21c9

# Diff at Wed, 05 Jun 2024 10:52:26 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 120992980

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract InternalProxyAdminOwnerMultisig1 (0x28B1eE885034ccD2d5Fa228a9A3157390D27177C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GasPriceOracle (0x420000000000000000000000000000000000000F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2StandardBridge (0x4200000000000000000000000000000000000010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1BlockNumber (0x4200000000000000000000000000000000000013)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseFeeVault (0x4200000000000000000000000000000000000019)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1FeeVault (0x420000000000000000000000000000000000001A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SchemaRegistry (0x4200000000000000000000000000000000000020)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EAS (0x4200000000000000000000000000000000000021)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPToken (0x4200000000000000000000000000000000000042)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OldQuixoticNFTBridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ProxyAdminOwner (0x7871d1187A97cbbE40710aC119AA3d412944e4Fe)
    +++ description: None
```
