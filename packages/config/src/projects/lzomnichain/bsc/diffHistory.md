Generated with discovered.json: 0x05b36b6154631bd4c24d989a0f6e009d84778e06

# Diff at Tue, 04 Mar 2025 10:41:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 40976255
- current block number: 40976255

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40976255 (main branch discovery), not current.

```diff
    contract FPValidator (0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6) {
    +++ description: None
      sinceBlock:
+        22214736
    }
```

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      sinceBlock:
+        20783075
    }
```

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      sinceBlock:
+        16070466
    }
```

```diff
    contract Endpoint (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      sinceBlock:
+        16070442
    }
```

```diff
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859) {
    +++ description: None
      sinceBlock:
+        20783071
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      sinceBlock:
+        20783073
    }
```

```diff
    contract  (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      sinceBlock:
+        20785459
    }
```

```diff
    contract  (0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C) {
    +++ description: None
      sinceBlock:
+        29447446
    }
```

```diff
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068) {
    +++ description: None
      sinceBlock:
+        20700392
    }
```

```diff
    contract  (0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D) {
    +++ description: None
      sinceBlock:
+        23375394
    }
```

```diff
    contract  (0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b) {
    +++ description: None
      sinceBlock:
+        29447450
    }
```

```diff
    contract LayerZero Multisig (0x8D452629c5FfCDDE407069da48c096e1F8beF22c) {
    +++ description: None
      sinceBlock:
+        16320592
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      sinceBlock:
+        20756603
    }
```

```diff
    contract RelayerV2 (0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182) {
    +++ description: None
      sinceBlock:
+        20784014
    }
```

```diff
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sinceBlock:
+        31576791
    }
```

```diff
    contract RelayerV2Radar (0xde19274c009A22921E3966a1Ec868cEba40A5DaC) {
    +++ description: None
      sinceBlock:
+        23373734
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sinceBlock:
+        31576793
    }
```

Generated with discovered.json: 0x6d044cbda9a70dc7ffd810d2fed128ac555f19e6

# Diff at Mon, 20 Jan 2025 11:10:44 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 40976255
- current block number: 40976255

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40976255 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xde19274c009A22921E3966a1Ec868cEba40A5DaC"
      receivedPermissions.1.from:
+        "0xde19274c009A22921E3966a1Ec868cEba40A5DaC"
      receivedPermissions.0.target:
-        "0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"
      receivedPermissions.0.from:
+        "0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"
    }
```

```diff
    contract  (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      issuedPermissions.0.to:
+        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
    }
```

```diff
    contract  (0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b"
      receivedPermissions.0.from:
+        "0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b"
    }
```

```diff
    contract  (0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      issuedPermissions.0.to:
+        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
    }
```

```diff
    contract  (0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C"
      issuedPermissions.0.to:
+        "0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D"
      receivedPermissions.1.from:
+        "0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D"
      receivedPermissions.0.target:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
      receivedPermissions.0.from:
+        "0x5a54fe5234E811466D5366846283323c954310B2"
    }
```

```diff
    contract RelayerV2 (0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x38dE71124f7a447a01D67945a51eDcE9FF491251"
      issuedPermissions.0.to:
+        "0x38dE71124f7a447a01D67945a51eDcE9FF491251"
    }
```

```diff
    contract RelayerV2Radar (0xde19274c009A22921E3966a1Ec868cEba40A5DaC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x38dE71124f7a447a01D67945a51eDcE9FF491251"
      issuedPermissions.0.to:
+        "0x38dE71124f7a447a01D67945a51eDcE9FF491251"
    }
```

Generated with discovered.json: 0xda7515f9d119365da0086b44c4ea64beda3df514

# Diff at Mon, 21 Oct 2024 11:14:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 40976255
- current block number: 40976255

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40976255 (main branch discovery), not current.

```diff
    contract  (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x47bc8fb02aA30f7ec413f60aFD2C90D8ee96B583"]
      values.$pastUpgrades.1.1:
-        ["0x47bc8fb02aA30f7ec413f60aFD2C90D8ee96B583"]
+        "0xf63ed6dc94a1fbfba0050f3fd911a2783aadb094b645eb3b4eeb3d155a06427c"
      values.$pastUpgrades.0.2:
+        ["0xf75C2919c8fddF9D6f34531EBDC7Ad28E1a192e2"]
      values.$pastUpgrades.0.1:
-        ["0xf75C2919c8fddF9D6f34531EBDC7Ad28E1a192e2"]
+        "0x31f47a097b7bd9f63239dbc3fa2e1c2557c61434ca6afdb25b4561eee80007b4"
    }
```

```diff
    contract  (0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x893BB42a352CA8Ee8bCb58348455DD3966368737"]
      values.$pastUpgrades.2.1:
-        ["0x893BB42a352CA8Ee8bCb58348455DD3966368737"]
+        "0xfd690c14f615eced61d756cd43013ce3409f77b4875d6268a67884501ca4d29e"
      values.$pastUpgrades.1.2:
+        ["0xa79dE9B3409361Cd3367856b5Fa9BC258C1f9F0F"]
      values.$pastUpgrades.1.1:
-        ["0xa79dE9B3409361Cd3367856b5Fa9BC258C1f9F0F"]
+        "0xc270073cd459d99b6a86001e756530ae0c22761bf47e42089bdfae585e9f2443"
      values.$pastUpgrades.0.2:
+        ["0x23768Cfd95B699d9B772ce042e490F9deA5ae6d6"]
      values.$pastUpgrades.0.1:
-        ["0x23768Cfd95B699d9B772ce042e490F9deA5ae6d6"]
+        "0x89dde5652c34f71e7337186bea268a09a9caa409ea40edb4bcf61f5483c8f67b"
    }
```

```diff
    contract RelayerV2 (0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0x7701C12D268847dB94bbF37A4C4af53Bb6bAF8B0"]
      values.$pastUpgrades.5.1:
-        ["0x7701C12D268847dB94bbF37A4C4af53Bb6bAF8B0"]
+        "0x14c6afd1411f336c05539d9bcc5c1b9d79babf7de84343615816229cd1c25371"
      values.$pastUpgrades.4.2:
+        ["0x26fdA154E76e53F078e7096459d9132542db3b9d"]
      values.$pastUpgrades.4.1:
-        ["0x26fdA154E76e53F078e7096459d9132542db3b9d"]
+        "0x47a7ec5b68119851c4f03560f3aaed318454b512a7a5ad2235a54fad20205fe7"
      values.$pastUpgrades.3.2:
+        ["0x92B9a8278ce3a1E17C66B3a6B61d807b2616bcED"]
      values.$pastUpgrades.3.1:
-        ["0x92B9a8278ce3a1E17C66B3a6B61d807b2616bcED"]
+        "0x8ecbced18a0e42909acc3cdae10feca174cf9b3bed09cee3b43cf09b069fb792"
      values.$pastUpgrades.2.2:
+        ["0x1a9a68b8Af58eA2b9130622e3bEA2373AaA79EFa"]
      values.$pastUpgrades.2.1:
-        ["0x1a9a68b8Af58eA2b9130622e3bEA2373AaA79EFa"]
+        "0x6f17740ee2451bdc90723be62bd6c5bf2896e27c2656aa442f8b1abe86dc6862"
      values.$pastUpgrades.1.2:
+        ["0x48486ECbB22Ca392f99C21FF02f6106580f526F8"]
      values.$pastUpgrades.1.1:
-        ["0x48486ECbB22Ca392f99C21FF02f6106580f526F8"]
+        "0x836cf185eb81a7c91b2aaea511c9f1a87ce030596f1f750848666ae37b8f9e4d"
      values.$pastUpgrades.0.2:
+        ["0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907"]
      values.$pastUpgrades.0.1:
-        ["0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907"]
+        "0xc8142d7bedc7b69fc6946c60bfe7920560036a570ab9b1a0dbd80611d3013db6"
    }
```

Generated with discovered.json: 0x7e438dfd22241d621e50034437b93bdb757186ca

# Diff at Mon, 14 Oct 2024 11:00:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 40976255
- current block number: 40976255

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40976255 (main branch discovery), not current.

```diff
    contract FPValidator (0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6) {
    +++ description: None
      sourceHashes:
+        ["0x0d505ac1b08cd930c4b902daa632eaa029531d5c1aa50c45169b63c310b2da62"]
    }
```

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      sourceHashes:
+        ["0x8b908351f18fdaeaf600ae46ef1450c535f741fc95bb25acade77f8b59fdc168"]
    }
```

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      sourceHashes:
+        ["0xeb95d39e1b35f76b6331da863f87bf2e148dd21abf5666590443b65f6a125630"]
    }
```

```diff
    contract Endpoint (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      sourceHashes:
+        ["0x945c3299d0cf62b9ea7a77d6328295d54327299d6a153e1e7b48d85fa9b77215"]
    }
```

```diff
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859) {
    +++ description: None
      sourceHashes:
+        ["0x965651ae50a316c3ab842d2c8c9242c34d6e40eefa61f7c731bba9a1faf2ccea"]
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      sourceHashes:
+        ["0x38c85ab54f670eaa1fc2b351aee39913bc12e2b26c460ee31cf89d3f1f7d59b9"]
    }
```

```diff
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068) {
    +++ description: None
      sourceHashes:
+        ["0x895867397d61409de8476975bae4d871fec1c289e52fe97b31872726808dae38"]
    }
```

```diff
    contract LayerZero Multisig (0x8D452629c5FfCDDE407069da48c096e1F8beF22c) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      sourceHashes:
+        ["0xeb95d39e1b35f76b6331da863f87bf2e148dd21abf5666590443b65f6a125630"]
    }
```

```diff
    contract RelayerV2 (0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182) {
    +++ description: None
      sourceHashes:
+        ["0x2cffb288804b4b9aa5855910610b396abe44ded0ad8ed35981ed74d056ae8ba1","0x09e8ef64d88f50d1728775b0716905d15bbe17af7dad266027d75f85e6276d49"]
    }
```

```diff
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sourceHashes:
+        ["0x1be31a02ca7158d467a49eeb964f0f8aa1d1e74019df854c1881d89d51260701"]
    }
```

```diff
    contract RelayerV2Radar (0xde19274c009A22921E3966a1Ec868cEba40A5DaC) {
    +++ description: None
      sourceHashes:
+        ["0x2cffb288804b4b9aa5855910610b396abe44ded0ad8ed35981ed74d056ae8ba1","0xb04546b4c05b8647cba50bd7560426e2d11b5b874b85b0f0b61dad7221bf0558"]
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sourceHashes:
+        ["0x37e1cee9d0a4ad6ebb439d27dbbf23925fcd9f9c0d5b43a33a6335e62b54d18c"]
    }
```

Generated with discovered.json: 0xc23597de36404eeaff36e475d2ed0e3ffc459f01

# Diff at Fri, 11 Oct 2024 07:38:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@52c209ecd27d1a92626074299e0545e15598d287 block: 40976255
- current block number: 40976255

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40976255 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract  (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-02-08T19:55:32.000Z",["0xf75C2919c8fddF9D6f34531EBDC7Ad28E1a192e2"]],["2023-04-27T02:37:47.000Z",["0x47bc8fb02aA30f7ec413f60aFD2C90D8ee96B583"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract  (0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract  (0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D) {
    +++ description: None
      values.$pastUpgrades:
+        []
      values.$upgradeCount:
+        0
    }
```

```diff
    contract  (0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-26T19:44:20.000Z",["0x23768Cfd95B699d9B772ce042e490F9deA5ae6d6"]],["2024-03-11T19:12:16.000Z",["0xa79dE9B3409361Cd3367856b5Fa9BC258C1f9F0F"]],["2024-07-04T23:52:09.000Z",["0x893BB42a352CA8Ee8bCb58348455DD3966368737"]]]
      values.$upgradeCount:
+        3
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract RelayerV2 (0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-11-21T22:34:18.000Z",["0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907"]],["2023-02-03T23:05:57.000Z",["0x48486ECbB22Ca392f99C21FF02f6106580f526F8"]],["2023-04-23T04:35:55.000Z",["0x1a9a68b8Af58eA2b9130622e3bEA2373AaA79EFa"]],["2023-06-26T23:18:31.000Z",["0x92B9a8278ce3a1E17C66B3a6B61d807b2616bcED"]],["2023-09-20T19:37:03.000Z",["0x26fdA154E76e53F078e7096459d9132542db3b9d"]],["2023-09-22T14:16:28.000Z",["0x7701C12D268847dB94bbF37A4C4af53Bb6bAF8B0"]]]
      values.$upgradeCount:
+        6
    }
```

```diff
    contract RelayerV2Radar (0xde19274c009A22921E3966a1Ec868cEba40A5DaC) {
    +++ description: None
      values.$pastUpgrades:
+        []
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x06adb74bf2c673203740b9848c03ad712e3fc804

# Diff at Wed, 21 Aug 2024 10:08:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 40976255
- current block number: 40976255

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40976255 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182","0xde19274c009A22921E3966a1Ec868cEba40A5DaC"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182","via":[]},{"permission":"upgrade","target":"0xde19274c009A22921E3966a1Ec868cEba40A5DaC","via":[]}]
    }
```

```diff
    contract  (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","via":[]}]
    }
```

```diff
    contract  (0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b","via":[]}]
    }
```

```diff
    contract  (0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","via":[]}]
    }
```

```diff
    contract  (0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5a54fe5234E811466D5366846283323c954310B2","0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5a54fe5234E811466D5366846283323c954310B2","via":[]},{"permission":"upgrade","target":"0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D","via":[]}]
    }
```

```diff
    contract RelayerV2 (0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x38dE71124f7a447a01D67945a51eDcE9FF491251","via":[]}]
    }
```

```diff
    contract RelayerV2Radar (0xde19274c009A22921E3966a1Ec868cEba40A5DaC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x38dE71124f7a447a01D67945a51eDcE9FF491251","via":[]}]
    }
```

Generated with discovered.json: 0x989723e580e035014b042ac30edb985ca782df73

# Diff at Fri, 09 Aug 2024 12:04:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 40976255
- current block number: 40976255

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40976255 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"
+        "0xde19274c009A22921E3966a1Ec868cEba40A5DaC"
      assignedPermissions.upgrade.0:
-        "0xde19274c009A22921E3966a1Ec868cEba40A5DaC"
+        "0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D"
      assignedPermissions.upgrade.0:
-        "0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D"
+        "0x5a54fe5234E811466D5366846283323c954310B2"
    }
```

Generated with discovered.json: 0x643daee66bd5274f967931893046cd0bca947e65

# Diff at Fri, 09 Aug 2024 10:14:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 40976255
- current block number: 40976255

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40976255 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182","0xde19274c009A22921E3966a1Ec868cEba40A5DaC"]
      assignedPermissions.upgrade:
+        ["0xde19274c009A22921E3966a1Ec868cEba40A5DaC","0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"]
    }
```

```diff
    contract  (0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b"]
      assignedPermissions.upgrade:
+        ["0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b"]
    }
```

```diff
    contract LayerZero Multisig (0x8D452629c5FfCDDE407069da48c096e1F8beF22c) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 6 (33%)"
      values.getOwners:
-        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD","0xf1f5E3777a3ADBe6f3289AD6b21eae6427dfb553"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD","0xf1f5E3777a3ADBe6f3289AD6b21eae6427dfb553"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 6 (33%)"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5a54fe5234E811466D5366846283323c954310B2","0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D"]
      assignedPermissions.upgrade:
+        ["0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D","0x5a54fe5234E811466D5366846283323c954310B2"]
    }
```

Generated with discovered.json: 0x690fd1fb3eb6327d1d4d8286d043875f0dae22cb

# Diff at Tue, 30 Jul 2024 11:17:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 40608530
- current block number: 40608530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40608530 (main branch discovery), not current.

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      sinceTimestamp:
+        1661528751
    }
```

```diff
    contract  (0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D) {
    +++ description: None
      sinceTimestamp:
+        1669425920
    }
```

```diff
    contract  (0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b) {
    +++ description: None
      sinceTimestamp:
+        1687808660
    }
```

```diff
    contract RelayerV2Radar (0xde19274c009A22921E3966a1Ec868cEba40A5DaC) {
    +++ description: None
      sinceTimestamp:
+        1669420588
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sinceTimestamp:
+        1694218841
    }
```

Generated with discovered.json: 0x8fe45198b647c38683f2c74bf8414b652634a968

# Diff at Fri, 19 Jul 2024 11:57:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@744d4e1fec0be9972ab7fde1dd4cc0ba0c91a28c block: 37363085
- current block number: 40608530

## Description

Upgrade to an unverified implementation.

## Watched changes

```diff
    contract  (0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b) {
    +++ description: None
      values.$implementation:
-        "0xa79dE9B3409361Cd3367856b5Fa9BC258C1f9F0F"
+        "0x893BB42a352CA8Ee8bCb58348455DD3966368737"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 37363085 (main branch discovery), not current.

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      sinceTimestamp:
-        1661528751
    }
```

```diff
    contract  (0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D) {
    +++ description: None
      sinceTimestamp:
-        1669425920
    }
```

```diff
    contract  (0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b) {
    +++ description: None
      sinceTimestamp:
-        1687808660
    }
```

```diff
    contract RelayerV2Radar (0xde19274c009A22921E3966a1Ec868cEba40A5DaC) {
    +++ description: None
      sinceTimestamp:
-        1669420588
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sinceTimestamp:
-        1694218841
    }
```

Generated with discovered.json: 0x942f30327f95f9cafe897c7cddc575a78c3c6558

# Diff at Thu, 18 Jul 2024 10:35:18 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 37363085
- current block number: 37363085

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 37363085 (main branch discovery), not current.

```diff
    contract FPValidator (0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6) {
    +++ description: None
      upgradeability:
-        {"type":"immutable"}
      values.$immutable:
+        true
    }
```

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      upgradeability:
-        {"type":"immutable"}
      values.$immutable:
+        true
    }
```

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      upgradeability:
-        {"type":"immutable"}
      values.$immutable:
+        true
    }
```

```diff
    contract Endpoint (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      upgradeability:
-        {"type":"immutable"}
      values.$immutable:
+        true
    }
```

```diff
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859) {
    +++ description: None
      upgradeability:
-        {"type":"immutable"}
      values.$immutable:
+        true
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      upgradeability:
-        {"type":"immutable"}
      values.$immutable:
+        true
    }
```

```diff
    contract  (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      upgradeability:
-        {"type":"EIP1967 proxy","implementation":"0x47bc8fb02aA30f7ec413f60aFD2C90D8ee96B583","admin":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"}
      implementations:
-        ["0x47bc8fb02aA30f7ec413f60aFD2C90D8ee96B583"]
      proxyType:
+        "EIP1967 proxy"
      values:
+        {"$admin":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","$implementation":"0x47bc8fb02aA30f7ec413f60aFD2C90D8ee96B583"}
    }
```

```diff
    contract  (0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C) {
    +++ description: None
      upgradeability:
-        {"type":"immutable"}
      values:
+        {"$immutable":true}
    }
```

```diff
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068) {
    +++ description: None
      upgradeability:
-        {"type":"immutable"}
      values.$immutable:
+        true
    }
```

```diff
    contract  (0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D) {
    +++ description: None
      upgradeability:
-        {"type":"EIP1967 proxy","implementation":"0xc9A227D0319f42e8C5997BD639a5286642474849","admin":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"}
      implementations:
-        ["0xc9A227D0319f42e8C5997BD639a5286642474849"]
      proxyType:
+        "EIP1967 proxy"
      values:
+        {"$admin":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","$implementation":"0xc9A227D0319f42e8C5997BD639a5286642474849"}
    }
```

```diff
    contract  (0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b) {
    +++ description: None
      upgradeability:
-        {"type":"EIP1967 proxy","implementation":"0xa79dE9B3409361Cd3367856b5Fa9BC258C1f9F0F","admin":"0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C"}
      implementations:
-        ["0xa79dE9B3409361Cd3367856b5Fa9BC258C1f9F0F"]
      proxyType:
+        "EIP1967 proxy"
      values:
+        {"$admin":"0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C","$implementation":"0xa79dE9B3409361Cd3367856b5Fa9BC258C1f9F0F"}
    }
```

```diff
    contract LayerZero Multisig (0x8D452629c5FfCDDE407069da48c096e1F8beF22c) {
    +++ description: None
      upgradeability:
-        {"type":"gnosis safe","masterCopy":"0x3E5c63644E683549055b9Be8653de26E0B4CD36E","modules":[],"threshold":"2 of 6 (33%)"}
      implementations:
-        ["0x3E5c63644E683549055b9Be8653de26E0B4CD36E"]
      values.$immutable:
+        false
      values.$implementation:
+        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$multisigThreshold:
+        "2 of 6 (33%)"
      values.GnosisSafe_modules:
+        []
      proxyType:
+        "gnosis safe"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      upgradeability:
-        {"type":"immutable"}
      values.$immutable:
+        true
    }
```

```diff
    contract RelayerV2 (0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182) {
    +++ description: None
      upgradeability:
-        {"type":"EIP1967 proxy","implementation":"0x7701C12D268847dB94bbF37A4C4af53Bb6bAF8B0","admin":"0x38dE71124f7a447a01D67945a51eDcE9FF491251"}
      implementations:
-        ["0x7701C12D268847dB94bbF37A4C4af53Bb6bAF8B0"]
      values.$admin:
+        "0x38dE71124f7a447a01D67945a51eDcE9FF491251"
      values.$implementation:
+        "0x7701C12D268847dB94bbF37A4C4af53Bb6bAF8B0"
      proxyType:
+        "EIP1967 proxy"
    }
```

```diff
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      upgradeability:
-        {"type":"immutable"}
      values.$immutable:
+        true
    }
```

```diff
    contract RelayerV2Radar (0xde19274c009A22921E3966a1Ec868cEba40A5DaC) {
    +++ description: None
      upgradeability:
-        {"type":"EIP1967 proxy","implementation":"0x8363302080e711E0CAb978C081b9e69308d49808","admin":"0x38dE71124f7a447a01D67945a51eDcE9FF491251"}
      implementations:
-        ["0x8363302080e711E0CAb978C081b9e69308d49808"]
      values.$admin:
+        "0x38dE71124f7a447a01D67945a51eDcE9FF491251"
      values.$implementation:
+        "0x8363302080e711E0CAb978C081b9e69308d49808"
      proxyType:
+        "EIP1967 proxy"
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      upgradeability:
-        {"type":"immutable"}
      values:
+        {"$immutable":true}
    }
```

Generated with discovered.json: 0x87eaeae369ba3b1cc410a44f0cce5b34424f3cfa

# Diff at Thu, 28 Mar 2024 12:03:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 37334769
- current block number: 37363085

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 37334769 (main branch discovery), not current.

```diff
    contract LayerZero Multisig (0x8D452629c5FfCDDE407069da48c096e1F8beF22c) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 6 (33%)"
    }
```

Generated with discovered.json: 0x0134498f1b3f721c8991a776286b33b07e30bbcc

# Diff at Wed, 27 Mar 2024 12:07:22 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@d53834b65ee1cdf52eb5d460179c975873642177 block: 36963441
- current block number: 37334769

## Description

RelayerV2 got verified.
Ignored stargate and related pools from being discovered.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 36963441 (main branch discovery), not current.

```diff
    contract  (0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182) {
    +++ description: None
      name:
-        ""
+        "RelayerV2"
      unverified:
-        true
      values:
+        {"AIRDROP_GAS_LIMIT":10000,"fpBytes":160,"mptOverhead":500,"multiplierBps":12000,"owner":"0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","paused":false,"priceFeed":"0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b","stargateBridgeAddr":"0x6694340fc020c5E6B96567843da2df01b2CE1eb6","stargateBridgeAddress":"0x0000000000000000000000000000000000000000","stargateComposer":"0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9","uln":"0x4D73AdB72bC3DD368966edD0f0b2148401A178E2","validateProofBytes":164}
    }
```

```diff
    contract  (0xde19274c009A22921E3966a1Ec868cEba40A5DaC) {
    +++ description: None
      name:
-        ""
+        "RelayerV2Radar"
      unverified:
-        true
      values:
+        {"owner":"0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","paused":false,"relayerV2":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182","stargateBridgeAddress":"0x0000000000000000000000000000000000000000","uln":"0xF487E8D03CDa77Ce9a66B35220D6cBB95d4C2877"}
    }
```

Generated with discovered.json: 0xe669a6ddb3ce1b73e2a5e475a0aa9b5fe0c2175c

# Diff at Thu, 14 Mar 2024 13:54:24 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3ffa91064379f34a2916a1ad4e93791b752e7e9e block: 36728945
- current block number: 36963441

## Description

New PriceFeed Oracle implementation has been deployed. Nothing that would affect protocol security has been changed.

## Watched changes

```diff
    contract  (0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b) {
    +++ description: None
      upgradeability.implementation:
-        "0x23768Cfd95B699d9B772ce042e490F9deA5ae6d6"
+        "0xa79dE9B3409361Cd3367856b5Fa9BC258C1f9F0F"
      implementations.0:
-        "0x23768Cfd95B699d9B772ce042e490F9deA5ae6d6"
+        "0xa79dE9B3409361Cd3367856b5Fa9BC258C1f9F0F"
    }
```

## Source code changes

```diff
.../-0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b/implementation/meta.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0xf1deebe4e4f496f539ecac2f289a0b5400b6652f

# Diff at Wed, 06 Mar 2024 10:04:33 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@1a2512004b35590384683b93c95d8ec95426d2a6 block: 35473523
- current block number: 36728945

## Description

Added v2 contracts to libraryLookup

## Watched changes

```diff
    contract Endpoint (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      values.latestVersion:
-        3
+        5
      values.libraryLookup[4]:
+        "0xff3da3a1cd39Bbaeb8D7cB2deB83EfC065CBb38F"
      values.libraryLookup[3]:
+        "0xfCCE712C9be5A78FE5f842008e0ed7af59455278"
    }
```

```diff
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      values.defaultMultiplierBps:
-        12000
+        12100
    }
```

Generated with discovered.json: 0xd9b13b3cd935828899e6cd44c8a21037f7f2bca2

# Diff at Mon, 22 Jan 2024 17:50:53 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@f58cc44bf923844f52038487bcd5a563329f4b43 block: 35098616
- current block number: 35473523

## Description

Default lib switched to FPValidator.
New path-ways added.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap.234:
+        20
      values.defaultAdapterParams.234:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.101.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.101.outboundProofType:
-        1
+        2
      values.defaultAppConfig.102.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.102.outboundProofType:
-        1
+        2
      values.defaultAppConfig.106.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.106.outboundProofType:
-        1
+        2
      values.defaultAppConfig.109.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.109.outboundProofType:
-        1
+        2
      values.defaultAppConfig.110.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.110.outboundProofType:
-        1
+        2
      values.defaultAppConfig.111.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.111.outboundProofType:
-        1
+        2
      values.defaultAppConfig.112.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.112.outboundProofType:
-        1
+        2
      values.defaultAppConfig.115.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.115.outboundProofType:
-        1
+        2
      values.defaultAppConfig.126.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.126.outboundProofType:
-        1
+        2
      values.defaultAppConfig.234:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.inboundProofLibrary.234:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.supportedOutboundProof.234:
+        2
      values.ulnLookup.234:
+        "0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981"
    }
```

# Diff at Tue, 09 Jan 2024 16:42:57 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@0b578574e6a64020b5157f700c09de14e6b3eed3 block: 30528470
- current block number: 35098616

## Description

Unified configurations across L2s. Few new remote chains configurations added. Relayer implementation changed.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap.150:
+        20
      values.chainAddressSizeMap.182:
+        20
      values.chainAddressSizeMap.196:
+        20
      values.chainAddressSizeMap.197:
+        20
      values.chainAddressSizeMap.198:
+        20
      values.chainAddressSizeMap.199:
+        20
      values.chainAddressSizeMap.202:
+        20
      values.chainAddressSizeMap.210:
+        20
      values.chainAddressSizeMap.211:
+        20
      values.chainAddressSizeMap.212:
+        20
      values.chainAddressSizeMap.213:
+        20
      values.chainAddressSizeMap.214:
+        20
      values.chainAddressSizeMap.215:
+        20
      values.chainAddressSizeMap.216:
+        20
      values.chainAddressSizeMap.217:
+        20
      values.chainAddressSizeMap.218:
+        20
      values.chainAddressSizeMap.230:
+        20
      values.defaultAdapterParams.167.proofType:
-        2
+        1
      values.defaultAdapterParams.150:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.182:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.196:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.197:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.198:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.199:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.202:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.210:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.211:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.212:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.213:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.214:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.215:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.216:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.217:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.218:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.230:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.101.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.102.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.106.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.108.inboundBlockConfirm:
-        500000
+        260
      values.defaultAppConfig.109.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.110.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.111.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.112.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.116.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.116.outboundProofType:
-        1
+        2
      values.defaultAppConfig.116.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.125.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.126.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.145.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.175.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.183.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.184.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.150:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.182:
+        {"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.196:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.197:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.198:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.199:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.202:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.210:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.211:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.212:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.213:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.214:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.215:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.216:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.217:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.218:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.defaultAppConfig.230:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}
      values.inboundProofLibrary.150:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.182:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.196:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.197:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.198:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.199:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.202:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.210:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.211:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.212:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.213:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.214:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.215:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.216:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.217:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.218:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.inboundProofLibrary.230:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]
      values.supportedOutboundProof.167:
-        2
+        [2,1]
      values.supportedOutboundProof.150:
+        2
      values.supportedOutboundProof.182:
+        2
      values.supportedOutboundProof.196:
+        [1,2]
      values.supportedOutboundProof.197:
+        [1,2]
      values.supportedOutboundProof.198:
+        [1,2]
      values.supportedOutboundProof.199:
+        [1,2]
      values.supportedOutboundProof.202:
+        [1,2]
      values.supportedOutboundProof.210:
+        [1,2]
      values.supportedOutboundProof.211:
+        [1,2]
      values.supportedOutboundProof.212:
+        [1,2]
      values.supportedOutboundProof.213:
+        [1,2]
      values.supportedOutboundProof.214:
+        [1,2]
      values.supportedOutboundProof.215:
+        [1,2]
      values.supportedOutboundProof.216:
+        [1,2]
      values.supportedOutboundProof.217:
+        [1,2]
      values.supportedOutboundProof.218:
+        [1,2]
      values.supportedOutboundProof.230:
+        2
      values.ulnLookup.150:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.182:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.196:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.197:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.198:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.199:
+        "0x0000000000000000000000005b19bd330a84c049b62d5b0fc2ba120217a18c1c"
      values.ulnLookup.202:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.210:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.211:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.212:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.213:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.214:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.215:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.216:
+        "0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098"
      values.ulnLookup.217:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.218:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.230:
+        "0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981"
    }
```

```diff
    contract  (0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182) {
      upgradeability.implementation:
-        "0x92B9a8278ce3a1E17C66B3a6B61d807b2616bcED"
+        "0x7701C12D268847dB94bbF37A4C4af53Bb6bAF8B0"
      implementations.0:
-        "0x92B9a8278ce3a1E17C66B3a6B61d807b2616bcED"
+        "0x7701C12D268847dB94bbF37A4C4af53Bb6bAF8B0"
    }
```

```diff
+   Status: CREATED
    contract  (0x5b3b51F830A79a250808f080e0e8dB08BAdf2D1C) {
    }
```

```diff
+   Status: CREATED
    contract  (0x7A50b180265eb5347Ce7b92224F0B0Cd6cE0493b) {
    }
```

```diff
+   Status: CREATED
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    }
```

```diff
+   Status: CREATED
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    }
```

## Source code changes

```diff
.../{.code@30528470 => .code}/ProxyAdmin/meta.txt  |   2 +-
 .../contracts/libs/CalldataBytesLib.sol            |  58 +++
 .../lz-evm-protocol-v2/contracts/libs/Errors.sol   |  56 +++
 .../contracts/messagelib/libs/BitMaps.sol          |  24 +
 .../contracts/utils/introspection/ERC165.sol       |  29 ++
 .../contracts/utils/introspection/IERC165.sol      |  25 +
 .../contracts/interfaces/ILayerZeroPriceFeed.sol   |  57 +++
 .../contracts/interfaces/IWorker.sol               |  20 +
 .../contracts/uln/VerifierFeeLib.sol               | 137 ++++++
 .../uln/interfaces/ILayerZeroVerifier.sol          |  34 ++
 .../contracts/uln/interfaces/IVerifier.sol         |  25 +
 .../contracts/uln/interfaces/IVerifierFeeLib.sol   |  28 ++
 .../contracts/uln/libs/VerifierOptions.sol         | 177 +++++++
 .../lzomnichain/bsc/.code/VerifierFeeLib/meta.txt  |   2 +
 .../solidity-bytes-utils/contracts/BytesLib.sol    | 510 +++++++++++++++++++++
 .../contracts/MessagingStructs.sol                 |  25 +
 .../contracts/interfaces/ILayerZeroEndpointV2.sol  |  80 ++++
 .../contracts/interfaces/IMessageLib.sol           |  46 ++
 .../contracts/interfaces/IMessageLibManager.sol    |  73 +++
 .../contracts/interfaces/IMessagingChannel.sol     |  33 ++
 .../contracts/interfaces/IMessagingComposer.sol    |  19 +
 .../contracts/interfaces/IMessagingContext.sol     |   9 +
 .../lz-evm-protocol-v2/contracts/libs/Errors.sol   |  56 +++
 .../interfaces/ILayerZeroUltraLightNodeV2.sol      |  83 ++++
 .../contracts/access/AccessControl.sol             | 248 ++++++++++
 .../contracts/access/IAccessControl.sol            |  88 ++++
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 ++++
 .../@openzeppelin/contracts/security/Pausable.sol  | 105 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../@openzeppelin/contracts/utils/Strings.sol      |  85 ++++
 .../contracts/utils/cryptography/ECDSA.sol         | 217 +++++++++
 .../contracts/utils/introspection/ERC165.sol       |  29 ++
 .../contracts/utils/introspection/IERC165.sol      |  25 +
 .../@openzeppelin/contracts/utils/math/Math.sol    | 339 ++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../VerifierNetwork/contracts/MessageLibBase.sol   | 170 +++++++
 .../bsc/.code/VerifierNetwork/contracts/Worker.sol | 142 ++++++
 .../contracts/interfaces/ILayerZeroExecutor.sol    |  29 ++
 .../contracts/interfaces/ILayerZeroTreasury.sol    |   7 +
 .../contracts/interfaces/IWorker.sol               |  20 +
 .../VerifierNetwork/contracts/uln/MultiSig.sol     |  78 ++++
 .../contracts/uln/VerifierNetwork.sol              | 346 ++++++++++++++
 .../uln/interfaces/ILayerZeroVerifier.sol          |  34 ++
 .../contracts/uln/interfaces/IUltraLightNode.sol   |  13 +
 .../contracts/uln/interfaces/IVerifier.sol         |  25 +
 .../contracts/uln/interfaces/IVerifierFeeLib.sol   |  28 ++
 .../lzomnichain/bsc/.code/VerifierNetwork/meta.txt |   2 +
 .../implementation/meta.txt                        |   2 +-
 .../lzomnichain/bsc/.code/meta.txt                 |   2 +
 .../bsc/{.code@30528470 => .code}/proxy/meta.txt   |   2 +-
 .../openzeppelin/interfaces/draft-IERC1822.sol     |  20 +
 .../openzeppelin/proxy/ERC1967/ERC1967Proxy.sol    |  33 ++
 .../openzeppelin/proxy/ERC1967/ERC1967Upgrade.sol  | 182 ++++++++
 .../proxy/openzeppelin/proxy/Proxy.sol             |  37 +-
 .../proxy/openzeppelin/proxy/beacon/IBeacon.sol    |  16 +
 .../proxy/openzeppelin/utils/Address.sol           | 127 ++++-
 .../.code/proxy/openzeppelin/utils/StorageSlot.sol |  84 ++++
 .../proxy/OptimizedTransparentUpgradeableProxy.sol |  60 ++-
 58 files changed, 4278 insertions(+), 75 deletions(-)
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 30528470 (main branch discovery), not current.

```diff
    contract Endpoint (0x3c2269811836af69497E5F486A85D7316753cf62) {
      values.libraryLookup:
+        ["0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675","0x4D73AdB72bC3DD368966edD0f0b2148401A178E2","0xF487E8D03CDa77Ce9a66B35220D6cBB95d4C2877"]
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap:
+        {"101":20,"102":20,"106":20,"108":32,"109":20,"110":20,"111":20,"112":20,"114":20,"115":20,"116":20,"125":20,"126":20,"138":20,"145":20,"149":20,"151":20,"153":20,"155":20,"156":20,"158":20,"159":20,"165":20,"166":20,"167":20,"173":20,"175":20,"176":20,"177":20,"181":20,"183":20,"184":20}
      values.defaultAdapterParams:
+        {"101":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"102":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"106":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"108":{"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000000009c4"},"109":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"110":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"111":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"112":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"114":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"115":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"116":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"125":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"126":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"138":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"145":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"149":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"151":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"153":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"155":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"156":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"158":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"159":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"165":{"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000003d0900"},"166":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"167":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"173":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"175":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"176":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"177":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"181":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"183":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"184":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}}
      values.defaultAppConfig:
+        {"1":{"inboundProofLib":1,"inboundBlockConfirm":15,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D","relayer":"0xde19274c009A22921E3966a1Ec868cEba40A5DaC"},"12":{"inboundProofLib":1,"inboundBlockConfirm":5,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D","relayer":"0xde19274c009A22921E3966a1Ec868cEba40A5DaC"},"101":{"inboundProofLib":1,"inboundBlockConfirm":15,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"102":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"106":{"inboundProofLib":1,"inboundBlockConfirm":12,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"108":{"inboundProofLib":1,"inboundBlockConfirm":500000,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"109":{"inboundProofLib":1,"inboundBlockConfirm":512,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"110":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"111":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"112":{"inboundProofLib":1,"inboundBlockConfirm":5,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"114":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"115":{"inboundProofLib":1,"inboundBlockConfirm":10,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"116":{"inboundProofLib":1,"inboundBlockConfirm":5,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"125":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"126":{"inboundProofLib":1,"inboundBlockConfirm":10,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"138":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"145":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"149":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"151":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"153":{"inboundProofLib":2,"inboundBlockConfirm":21,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"155":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"156":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"158":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"159":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"165":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"166":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"167":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"173":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"175":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"176":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"177":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"181":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"183":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"},"184":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182"}}
      values.inboundProofLibrary:
+        {"1":"0x462F7eC57C6492B983a8C8322B4369a7f149B859","12":"0x462F7eC57C6492B983a8C8322B4369a7f149B859","101":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"102":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"106":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"108":"0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6","109":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"110":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"111":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"112":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"114":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"115":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"116":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"125":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"126":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"138":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"145":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"149":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"151":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"153":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"155":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"156":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"158":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"159":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"165":"0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6","166":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"167":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"173":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"175":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"176":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"177":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"181":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"183":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"],"184":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6"]}
      values.supportedOutboundProof:
+        {"1":1,"12":1,"101":[1,2],"102":[1,2],"106":[1,2],"108":2,"109":[1,2],"110":[1,2],"111":[1,2],"112":[1,2],"114":[1,2],"115":[1,2],"116":[1,2],"125":[1,2],"126":[1,2],"138":2,"145":2,"149":2,"151":2,"153":2,"155":2,"156":2,"158":2,"159":[1,2],"165":2,"166":2,"167":2,"173":[1,2],"175":[1,2],"176":2,"177":2,"181":2,"183":2,"184":2}
      values.ulnLookup:
+        {"101":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","102":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","106":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","108":"0x54ad3d30af77b60d939ae356e6606de9a4da67583f02b962d2d3f2e481484e90","109":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","110":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","111":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","112":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","114":"0x000000000000000000000000bb2753c1b940363d278c81d6402fa89e79ab4ebc","115":"0x000000000000000000000000658fd63dca9378e3b7deb49463d0b25336433f91","116":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","125":"0x000000000000000000000000377530cda84dfb2673bf4d145dcf0c4d7fdcb5b6","126":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","138":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","145":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","149":"0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098","151":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","153":"0x00000000000000000000000066a71dcef29a0ffbdbe3c6a460a3b5bc225cd675","155":"0x00000000000000000000000066a71dcef29a0ffbdbe3c6a460a3b5bc225cd675","156":"0x00000000000000000000000026b24e76226d982e362c4662c5f272a16b22e991","158":"0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098","159":"0x000000000000000000000000c1b15d3b262beec0e3565c11c9e0f6134bdacb36","165":"0x000000000000000000000000042b8289c97896529ec2fe49ba1a8b9c956a86cc","166":"0x0000000000000000000000006f475642a6e85809b1c36fa62763669b1b48dd5b","167":"0x000000000000000000000000e9ba4c1e76d874a43942718dafc96009ec9d9917","173":"0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098","175":"0x0000000000000000000000002d61dcdd36f10b22176e0433b86f74567d529aaa","176":"0x0000000000000000000000000be3818b1c495bbd44b6579f6d0a4bea1bcbff8a","177":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","181":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","183":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","184":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"}
    }
```

```diff
    contract GnosisSafeL2 (0x8D452629c5FfCDDE407069da48c096e1F8beF22c) {
      name:
-        "GnosisSafeL2"
+        "LayerZero Multisig"
      derivedName:
+        "GnosisSafeL2"
    }
```

```diff
+   Status: CREATED
    contract FPValidator (0x28A5536cA9F36c45A9d2AC8d2B62Fc46Fde024B6) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    }
```

```diff
+   Status: CREATED
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859) {
    }
```

```diff
+   Status: CREATED
    contract  (0x5a54fe5234E811466D5366846283323c954310B2) {
    }
```

```diff
+   Status: CREATED
    contract  (0x5e603Fe3FBDa423D4AFc82e80F59AE8a041Ac35D) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    }
```

```diff
+   Status: CREATED
    contract  (0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182) {
    }
```

```diff
+   Status: CREATED
    contract  (0xde19274c009A22921E3966a1Ec868cEba40A5DaC) {
    }
```
