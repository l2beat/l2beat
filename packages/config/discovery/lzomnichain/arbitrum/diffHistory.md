Generated with discovered.json: 0x2570a2075e7f53b6ff1a3984b6ae50691d475552

# Diff at Fri, 07 Mar 2025 13:45:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 300193052
- current block number: 313205484

## Description

DVN / Verifier for ZKsync Era added.

## Watched changes

```diff
+   Status: CREATED
    contract  (0x6a4C9096F162f0ab3C0517B0a40dc1CE44785e16)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DVN (0xa7b5189bcA84Cd304D8553977c7C614329750d99)
    +++ description: None
```

## Source code changes

```diff
.../lzomnichain/arbitrum/.flat/DVN.sol             | 2116 ++++++++++++++++++++
 1 file changed, 2116 insertions(+)
```

Generated with discovered.json: 0xd0918a8a920fc2a1dd8b3fd1668f3f050a157653

# Diff at Tue, 04 Mar 2025 10:40:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 300193052
- current block number: 300193052

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 300193052 (main branch discovery), not current.

```diff
    contract  (0x177d36dBE2271A4DdB2Ad8304d82628eb921d790) {
    +++ description: None
      sinceBlock:
+        21432305
    }
```

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      sinceBlock:
+        21426807
    }
```

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      sinceBlock:
+        7920349
    }
```

```diff
    contract Endpoint (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      sinceBlock:
+        7920157
    }
```

```diff
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859) {
    +++ description: None
      sinceBlock:
+        21426785
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      sinceBlock:
+        21426799
    }
```

```diff
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068) {
    +++ description: None
      sinceBlock:
+        21083158
    }
```

```diff
    contract FPValidator (0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B) {
    +++ description: None
      sinceBlock:
+        30331127
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      sinceBlock:
+        21273027
    }
```

```diff
    contract  (0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f) {
    +++ description: None
      sinceBlock:
+        21439748
    }
```

```diff
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sinceBlock:
+        129337490
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sinceBlock:
+        129337500
    }
```

```diff
    contract LayerZero Multisig (0xFE22f5D2755b06b9149656C5793Cb15A08d09847) {
    +++ description: None
      sinceBlock:
+        8434100
    }
```

Generated with discovered.json: 0xb16883d5da1c64b92ce4efdb52d65092026056d0

# Diff at Tue, 28 Jan 2025 15:08:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 266783049
- current block number: 300193052

## Description

LayerZero MS update: members swapped and new member added (now 3/5).

## Watched changes

```diff
    contract LayerZero Multisig (0xFE22f5D2755b06b9149656C5793Cb15A08d09847) {
    +++ description: None
      values.$members.4:
-        "0xf1f5E3777a3ADBe6f3289AD6b21eae6427dfb553"
+        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.3:
-        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
+        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
      values.$members.2:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
      values.$members.1:
-        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
+        "0x112c737AeEbD2E52DEb9ff5c9c19497F1A1777b0"
      values.$members.0:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0xB981a2664f5f547291Df5F8dCD4505f7015912CF"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xd4414642455094af5b6475913f8b040f2081495f

# Diff at Mon, 20 Jan 2025 11:10:31 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 266783049
- current block number: 266783049

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 266783049 (main branch discovery), not current.

```diff
    contract  (0x177d36dBE2271A4DdB2Ad8304d82628eb921d790) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x38dE71124f7a447a01D67945a51eDcE9FF491251"
      issuedPermissions.0.to:
+        "0x38dE71124f7a447a01D67945a51eDcE9FF491251"
    }
```

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"
      receivedPermissions.0.from:
+        "0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
      receivedPermissions.0.from:
+        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
    }
```

```diff
    contract  (0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      issuedPermissions.0.to:
+        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
    }
```

Generated with discovered.json: 0x59b3af394a7efb9f024dc4617c1c0157e0d9b755

# Diff at Wed, 23 Oct 2024 10:03:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 229043861
- current block number: 266783049

## Description

LayerZero Multisig: One signer removed.

## Watched changes

```diff
    contract LayerZero Multisig (0xFE22f5D2755b06b9149656C5793Cb15A08d09847) {
    +++ description: None
      values.$members.5:
-        "0xf1f5E3777a3ADBe6f3289AD6b21eae6427dfb553"
      values.$members.4:
-        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
+        "0xf1f5E3777a3ADBe6f3289AD6b21eae6427dfb553"
      values.$members.3:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
      values.$members.2:
-        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
+        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.1:
-        "0xe095F2590eF1Ab39601445025847Ed8E4B40D687"
+        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
      values.multisigThreshold:
-        "2 of 6 (33%)"
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x79508e1e3387b0d8540fac4638bb11435edae5bf

# Diff at Mon, 21 Oct 2024 11:13:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 229043861
- current block number: 229043861

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229043861 (main branch discovery), not current.

```diff
    contract  (0x177d36dBE2271A4DdB2Ad8304d82628eb921d790) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0xf77a80851c7f40492eB7a5f1e7d92411ae8962a4"]
      values.$pastUpgrades.5.1:
-        ["0xf77a80851c7f40492eB7a5f1e7d92411ae8962a4"]
+        "0x245b00f9b3122f884fab65f33d34eebc5a8dc28bedeec9c846b7aeaa747727b5"
      values.$pastUpgrades.4.2:
+        ["0xfa88d35D00ccD0011451BeEED8b7ed10406085dF"]
      values.$pastUpgrades.4.1:
-        ["0xfa88d35D00ccD0011451BeEED8b7ed10406085dF"]
+        "0xa48c01101b3a427a3fefad54dbd7c94c4728f09d6586895fefc0df967577c5a3"
      values.$pastUpgrades.3.2:
+        ["0x11bA0F5c3832044A416B2E177EA773eceBCCEE1f"]
      values.$pastUpgrades.3.1:
-        ["0x11bA0F5c3832044A416B2E177EA773eceBCCEE1f"]
+        "0x6cbfa262e23b4628a541e1466ec14394822ac4398e7bc91dc63ee6de55f24f61"
      values.$pastUpgrades.2.2:
+        ["0x6Af32CFE419c2a01f303F89168e7596fFE3442ae"]
      values.$pastUpgrades.2.1:
-        ["0x6Af32CFE419c2a01f303F89168e7596fFE3442ae"]
+        "0x57f0cd21f82949e530b7b84351c7bca672a1635be572dddc759c417841cfa3ba"
      values.$pastUpgrades.1.2:
+        ["0xe70cA542A9f2D932aD34efE3a681D83828452666"]
      values.$pastUpgrades.1.1:
-        ["0xe70cA542A9f2D932aD34efE3a681D83828452666"]
+        "0xc313d5cf904b74d579398fffa83333b6dbf161e8b63a4fb1360a0a1f6c7e0f13"
      values.$pastUpgrades.0.2:
+        ["0x8Ee02736F8a0c28164a20c25f3d199a74DF7F24B"]
      values.$pastUpgrades.0.1:
-        ["0x8Ee02736F8a0c28164a20c25f3d199a74DF7F24B"]
+        "0x1de53bb39a943c384f3eb2a943dd8a307891cd3ca3de47a4a63f9851d9ade73f"
    }
```

```diff
    contract  (0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x86591701001B3a5cf901Ed55062c7ECe7B00Cb19"]
      values.$pastUpgrades.1.1:
-        ["0x86591701001B3a5cf901Ed55062c7ECe7B00Cb19"]
+        "0x57244cbe7840a1c6100d51f5c32193738a8c2c5fcf554bf49188c54a4e38b954"
      values.$pastUpgrades.0.2:
+        ["0x866544B491cb508a91A117aDEA4853851eE048F5"]
      values.$pastUpgrades.0.1:
-        ["0x866544B491cb508a91A117aDEA4853851eE048F5"]
+        "0xa080e59e9b1dc6872ead4ecb989f000736be6069f5ba1a8dc621a18530e3c928"
    }
```

Generated with discovered.json: 0x1e79c0406e6da88baeb0beb93114e8e7bb5308a6

# Diff at Mon, 14 Oct 2024 10:58:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 229043861
- current block number: 229043861

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229043861 (main branch discovery), not current.

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
    contract FPValidator (0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B) {
    +++ description: None
      sourceHashes:
+        ["0x0d505ac1b08cd930c4b902daa632eaa029531d5c1aa50c45169b63c310b2da62"]
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
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sourceHashes:
+        ["0x1be31a02ca7158d467a49eeb964f0f8aa1d1e74019df854c1881d89d51260701"]
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sourceHashes:
+        ["0x37e1cee9d0a4ad6ebb439d27dbbf23925fcd9f9c0d5b43a33a6335e62b54d18c"]
    }
```

```diff
    contract LayerZero Multisig (0xFE22f5D2755b06b9149656C5793Cb15A08d09847) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

Generated with discovered.json: 0x0960f7e9f36c600069a361541da5d2fbe3c3cd1c

# Diff at Tue, 01 Oct 2024 11:12:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 229043861
- current block number: 229043861

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229043861 (main branch discovery), not current.

```diff
    contract  (0x177d36dBE2271A4DdB2Ad8304d82628eb921d790) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-11-21T22:26:43.000Z",["0x8Ee02736F8a0c28164a20c25f3d199a74DF7F24B"]],["2023-02-03T23:02:06.000Z",["0xe70cA542A9f2D932aD34efE3a681D83828452666"]],["2023-04-23T04:33:42.000Z",["0x6Af32CFE419c2a01f303F89168e7596fFE3442ae"]],["2023-06-26T23:11:56.000Z",["0x11bA0F5c3832044A416B2E177EA773eceBCCEE1f"]],["2023-09-20T19:30:37.000Z",["0xfa88d35D00ccD0011451BeEED8b7ed10406085dF"]],["2023-09-22T14:17:38.000Z",["0xf77a80851c7f40492eB7a5f1e7d92411ae8962a4"]]]
    }
```

```diff
    contract  (0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-02-08T19:49:07.000Z",["0x866544B491cb508a91A117aDEA4853851eE048F5"]],["2023-04-27T02:32:50.000Z",["0x86591701001B3a5cf901Ed55062c7ECe7B00Cb19"]]]
    }
```

Generated with discovered.json: 0xe4579d56a1ff310e001984069f90a94653868c9f

# Diff at Fri, 30 Aug 2024 08:06:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 229043861
- current block number: 229043861

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229043861 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x402b98ce2355725e2059d0c0543e87201d756d3e

# Diff at Fri, 23 Aug 2024 09:57:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 229043861
- current block number: 229043861

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229043861 (main branch discovery), not current.

```diff
    contract  (0x177d36dBE2271A4DdB2Ad8304d82628eb921d790) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract  (0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xdf2b842498198d1f53c6c833fc85455b29057aaa

# Diff at Wed, 21 Aug 2024 10:07:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 229043861
- current block number: 229043861

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229043861 (main branch discovery), not current.

```diff
    contract  (0x177d36dBE2271A4DdB2Ad8304d82628eb921d790) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x38dE71124f7a447a01D67945a51eDcE9FF491251","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","via":[]}]
    }
```

```diff
    contract  (0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","via":[]}]
    }
```

Generated with discovered.json: 0x41251d2e52aa3aa9134744867d1f54d2b9608cf2

# Diff at Fri, 09 Aug 2024 10:13:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 229043861
- current block number: 229043861

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 229043861 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"]
      assignedPermissions.upgrade:
+        ["0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"]
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"]
      assignedPermissions.upgrade:
+        ["0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"]
    }
```

```diff
    contract LayerZero Multisig (0xFE22f5D2755b06b9149656C5793Cb15A08d09847) {
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

Generated with discovered.json: 0xced0fea8eed179d2ecd08497b8e8511326e3e930

# Diff at Fri, 05 Jul 2024 14:32:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@111fee0655d72e75c60324b920975e421fd852f7 block: 197126643
- current block number: 229043861

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 197126643 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x9c8D8A224545c15024cB50C7c02cf3EA9AA1bF36)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xa5D625ea24F5aDecB7234Dc62767e18486ed684c)
    +++ description: None
```

Generated with discovered.json: 0xbc5b31cee27978e8f24097fe3c9c810316c10c6b

# Diff at Wed, 03 Apr 2024 10:38:41 GMT:

- author: maciekop (<maciej.opala@l2beat.com>)
- comparing to: main@34d9eb99e785ccac44323b84405d78f9783b5cc2 block: 195390045
- current block number: 197126643

## Description

Rediscovery with new field added (upgradeability.threshold)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 195390045 (main branch discovery), not current.

```diff
    contract LayerZero Multisig (0xFE22f5D2755b06b9149656C5793Cb15A08d09847) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 6 (33%)"
    }
```

Generated with discovered.json: 0xc432e0a710a9db01167ba5f9315cb81a49f3675c

# Diff at Thu, 14 Mar 2024 13:16:53 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3ffa91064379f34a2916a1ad4e93791b752e7e9e block: 187635660
- current block number: 190294110

## Description

New PriceFeed Oracle implementation has been deployed. Nothing that would affect protocol security has been changed.

## Watched changes

```diff
    contract  (0x9c8D8A224545c15024cB50C7c02cf3EA9AA1bF36) {
    +++ description: None
      upgradeability.implementation:
-        "0x689b871494cdbC9062dFAFF357f5225f94A31F15"
+        "0xbDb07dC145386e3A1Ab553CBc0dc383c06420769"
      implementations.0:
-        "0x689b871494cdbC9062dFAFF357f5225f94A31F15"
+        "0xbDb07dC145386e3A1Ab553CBc0dc383c06420769"
    }
```

## Source code changes

```diff
.../-0x9c8D8A224545c15024cB50C7c02cf3EA9AA1bF36/implementation/meta.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x8f564e924c696de6bfcffd9cbfdd5766db55bb31

# Diff at Wed, 06 Mar 2024 10:03:56 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@1a2512004b35590384683b93c95d8ec95426d2a6 block: 173078316
- current block number: 187635660

## Description

Added v2 contracts to libraryLookup

## Watched changes

```diff
    contract Endpoint (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      values.latestVersion:
-        2
+        4
      values.libraryLookup[3]:
+        "0xe4DD168822767C4342e54e6241f0b91DE0d3c241"
      values.libraryLookup[2]:
+        "0x5cDc927876031B4Ef910735225c425A7Fc8efed9"
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

Generated with discovered.json: 0xfade3659ca05af16babf43cf19c5ae0235d2db41

# Diff at Mon, 22 Jan 2024 17:01:57 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@f58cc44bf923844f52038487bcd5a563329f4b43 block: 168740974
- current block number: 173078316

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
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.inboundProofLibrary.234:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.supportedOutboundProof.234:
+        2
      values.ulnLookup.234:
+        "0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981"
    }
```

# Diff at Tue, 09 Jan 2024 16:43:12 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@0b578574e6a64020b5157f700c09de14e6b3eed3 block: 117399533
- current block number: 168740974

## Description

Implementation of some contract changed. Default Oracles on many chains changed. Few new remote chains configuration appeared.

## Watched changes

```diff
    contract  (0x177d36dBE2271A4DdB2Ad8304d82628eb921d790) {
      upgradeability.implementation:
-        "0x11bA0F5c3832044A416B2E177EA773eceBCCEE1f"
+        "0xf77a80851c7f40492eB7a5f1e7d92411ae8962a4"
      implementations.0:
-        "0x11bA0F5c3832044A416B2E177EA773eceBCCEE1f"
+        "0xf77a80851c7f40492eB7a5f1e7d92411ae8962a4"
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap.150:
+        20
      values.chainAddressSizeMap.153:
+        20
      values.chainAddressSizeMap.182:
+        20
      values.chainAddressSizeMap.195:
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
      values.defaultAdapterParams.153:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.182:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.195:
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
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.102.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.106.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.108.inboundBlockConfirm:
-        500000
+        260
      values.defaultAppConfig.109.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.110.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.111.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.112.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.116.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.116.outboundProofType:
-        1
+        2
      values.defaultAppConfig.116.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.125.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.126.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.145.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.175.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.183.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.184.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.150:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.153:
+        {"inboundProofLib":2,"inboundBlockConfirm":21,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.182:
+        {"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.195:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.196:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.197:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.198:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.199:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.202:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.210:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.211:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.212:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.213:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.214:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.215:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.216:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.217:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.218:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.230:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.inboundProofLibrary.150:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.153:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.182:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.195:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.196:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.197:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.198:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.199:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.202:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.210:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.211:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.212:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.213:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.214:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.215:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.216:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.217:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.218:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.230:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.supportedOutboundProof.167:
-        2
+        [2,1]
      values.supportedOutboundProof.150:
+        2
      values.supportedOutboundProof.153:
+        2
      values.supportedOutboundProof.182:
+        2
      values.supportedOutboundProof.195:
+        [1,2]
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
      values.ulnLookup.153:
+        "0x00000000000000000000000066a71dcef29a0ffbdbe3c6a460a3b5bc225cd675"
      values.ulnLookup.182:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.195:
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
+   Status: CREATED
    contract  (0x9c8D8A224545c15024cB50C7c02cf3EA9AA1bF36) {
    }
```

```diff
+   Status: CREATED
    contract  (0xa5D625ea24F5aDecB7234Dc62767e18486ed684c) {
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
 .../arbitrum/.code/VerifierFeeLib/meta.txt         |   2 +
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
 .../.code/VerifierNetwork/contracts/Worker.sol     | 142 ++++++
 .../contracts/interfaces/ILayerZeroExecutor.sol    |  29 ++
 .../contracts/interfaces/ILayerZeroTreasury.sol    |   7 +
 .../contracts/interfaces/IWorker.sol               |  20 +
 .../VerifierNetwork/contracts/uln/MultiSig.sol     |  78 ++++
 .../contracts/uln/VerifierNetwork.sol              | 346 ++++++++++++++
 .../uln/interfaces/ILayerZeroVerifier.sol          |  34 ++
 .../contracts/uln/interfaces/IUltraLightNode.sol   |  13 +
 .../contracts/uln/interfaces/IVerifier.sol         |  25 +
 .../contracts/uln/interfaces/IVerifierFeeLib.sol   |  28 ++
 .../arbitrum/.code/VerifierNetwork/meta.txt        |   2 +
 .../implementation/meta.txt                        |   2 +-
 .../lzomnichain/arbitrum/.code/meta.txt            |   2 +
 .../{.code@117399533 => .code}/proxy/meta.txt      |   2 +-
 .../.code/proxy/openzeppelin/access/Ownable.sol    |  76 +++
 .../openzeppelin/interfaces/draft-IERC1822.sol     |  20 +
 .../openzeppelin/proxy/ERC1967/ERC1967Proxy.sol    |  33 ++
 .../openzeppelin/proxy/ERC1967/ERC1967Upgrade.sol  | 182 ++++++++
 .../proxy/openzeppelin/proxy/Proxy.sol             |  37 +-
 .../openzeppelin/proxy/beacon/BeaconProxy.sol      |  62 +++
 .../proxy/openzeppelin/proxy/beacon/IBeacon.sol    |  16 +
 .../proxy/beacon/UpgradeableBeacon.sol             |  66 +++
 .../openzeppelin/proxy/transparent/ProxyAdmin.sol  |  84 ++++
 .../transparent/TransparentUpgradeableProxy.sol    | 125 +++++
 .../openzeppelin/proxy/utils/Initializable.sol     |  80 ++++
 .../openzeppelin/proxy/utils/UUPSUpgradeable.sol   |  95 ++++
 .../proxy/openzeppelin/utils/Address.sol           | 127 ++++-
 .../.code/proxy/openzeppelin/utils/Context.sol     |  24 +
 .../.code/proxy/openzeppelin/utils/StorageSlot.sol |  84 ++++
 .../proxy/OptimizedTransparentUpgradeableProxy.sol |  60 ++-
 65 files changed, 4889 insertions(+), 74 deletions(-)
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 117399533 (main branch discovery), not current.

```diff
    contract Endpoint (0x3c2269811836af69497E5F486A85D7316753cf62) {
      values.libraryLookup:
+        ["0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675","0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"]
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap:
+        {"101":20,"102":20,"106":20,"108":32,"109":20,"110":20,"111":20,"112":20,"114":20,"115":20,"116":20,"125":20,"126":20,"138":20,"145":20,"151":20,"154":20,"155":20,"156":20,"158":20,"159":20,"161":20,"165":20,"166":20,"167":20,"173":20,"175":20,"176":20,"177":20,"181":20,"183":20,"184":20}
      values.defaultAdapterParams:
+        {"101":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"102":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"106":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"108":{"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000000009c4"},"109":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"110":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"111":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"112":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"114":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"115":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"116":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"125":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"126":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"138":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"145":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"151":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"154":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"155":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"156":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"158":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"159":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"161":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"165":{"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000003d0900"},"166":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"167":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"173":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"175":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"176":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"177":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"181":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"183":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"184":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}}
      values.defaultAppConfig:
+        {"101":{"inboundProofLib":1,"inboundBlockConfirm":15,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"102":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"106":{"inboundProofLib":1,"inboundBlockConfirm":12,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"108":{"inboundProofLib":1,"inboundBlockConfirm":500000,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"109":{"inboundProofLib":1,"inboundBlockConfirm":512,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"110":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"111":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"112":{"inboundProofLib":1,"inboundBlockConfirm":5,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"114":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"115":{"inboundProofLib":1,"inboundBlockConfirm":10,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"116":{"inboundProofLib":1,"inboundBlockConfirm":5,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"125":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"126":{"inboundProofLib":1,"inboundBlockConfirm":10,"outboundProofType":1,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"138":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"145":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"151":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"154":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"155":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"156":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"158":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"159":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"161":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"165":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"166":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"167":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"173":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"175":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"176":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"177":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"181":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"183":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"},"184":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}}
      values.inboundProofLibrary:
+        {"101":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"102":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"106":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"108":"0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B","109":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"110":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"111":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"112":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"114":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"115":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"116":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"125":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"126":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"138":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"145":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"151":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"154":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"155":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"156":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"158":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"159":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"161":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"165":"0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B","166":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"167":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"173":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"175":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"176":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"177":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"181":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"183":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"],"184":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]}
      values.supportedOutboundProof:
+        {"101":[1,2],"102":[1,2],"106":[1,2],"108":2,"109":[1,2],"110":[1,2],"111":[1,2],"112":[1,2],"114":[1,2],"115":[1,2],"116":[1,2],"125":[1,2],"126":[1,2],"138":2,"145":2,"151":2,"154":2,"155":2,"156":2,"158":2,"159":[1,2],"161":[1,2],"165":2,"166":2,"167":2,"173":[1,2],"175":[1,2],"176":2,"177":2,"181":2,"183":2,"184":2}
      values.ulnLookup:
+        {"101":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","102":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","106":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","108":"0x54ad3d30af77b60d939ae356e6606de9a4da67583f02b962d2d3f2e481484e90","109":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","110":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","111":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","112":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","114":"0x000000000000000000000000bb2753c1b940363d278c81d6402fa89e79ab4ebc","115":"0x000000000000000000000000658fd63dca9378e3b7deb49463d0b25336433f91","116":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","125":"0x000000000000000000000000377530cda84dfb2673bf4d145dcf0c4d7fdcb5b6","126":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","138":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","145":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","151":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","154":"0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981","155":"0x00000000000000000000000066a71dcef29a0ffbdbe3c6a460a3b5bc225cd675","156":"0x00000000000000000000000026b24e76226d982e362c4662c5f272a16b22e991","158":"0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098","159":"0x000000000000000000000000c1b15d3b262beec0e3565c11c9e0f6134bdacb36","161":"0x00000000000000000000000041bdb4aa4a63a5b2efc531858d3118392b1a1c3d","165":"0x000000000000000000000000042b8289c97896529ec2fe49ba1a8b9c956a86cc","166":"0x0000000000000000000000006f475642a6e85809b1c36fa62763669b1b48dd5b","167":"0x000000000000000000000000e9ba4c1e76d874a43942718dafc96009ec9d9917","173":"0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098","175":"0x0000000000000000000000002d61dcdd36f10b22176e0433b86f74567d529aaa","176":"0x0000000000000000000000000be3818b1c495bbd44b6579f6d0a4bea1bcbff8a","177":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","181":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","183":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","184":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"}
    }
```

```diff
    contract GnosisSafeL2 (0xFE22f5D2755b06b9149656C5793Cb15A08d09847) {
      name:
-        "GnosisSafeL2"
+        "LayerZero Multisig"
      derivedName:
+        "GnosisSafeL2"
    }
```

```diff
+   Status: CREATED
    contract  (0x177d36dBE2271A4DdB2Ad8304d82628eb921d790) {
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
    contract FPValidator (0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    }
```

```diff
+   Status: CREATED
    contract  (0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f) {
    }
```
