Generated with discovered.json: 0x419a5f8c8a1533591a7c7ef0a882e595b03f5ea6

# Diff at Fri, 07 Mar 2025 13:46:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 67252326
- current block number: 68758698

## Description

DVN / Verifier for ZKsync Era added.

## Watched changes

```diff
+   Status: CREATED
    contract  (0x28af4dADbc5066e994986E8bb105240023dC44B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DVN (0x31F748a368a893Bdb5aBB67ec95F232507601A73)
    +++ description: None
```

## Source code changes

```diff
.../lzomnichain/polygonpos/.flat/DVN.sol           | 2116 ++++++++++++++++++++
 1 file changed, 2116 insertions(+)
```

Generated with discovered.json: 0xe3a72993c94c963e313e3861a6fc09c4db5bcac1

# Diff at Tue, 04 Mar 2025 10:42:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 67252326
- current block number: 67252326

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 67252326 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      sinceBlock:
+        25956331
    }
```

```diff
    contract Endpoint (0x3c2269811836af69497E5F486A85D7316753cf62) {
    +++ description: None
      sinceBlock:
+        25956313
    }
```

```diff
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859) {
    +++ description: None
      sinceBlock:
+        32347187
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      sinceBlock:
+        32347190
    }
```

```diff
    contract  (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      sinceBlock:
+        32350256
    }
```

```diff
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068) {
    +++ description: None
      sinceBlock:
+        32239033
    }
```

```diff
    contract TreasuryV2 (0x5f3481F45A3926A136D3dEE078e14D5353C13f2D) {
    +++ description: None
      sinceBlock:
+        32347277
    }
```

```diff
    contract  (0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f) {
    +++ description: None
      sinceBlock:
+        32348358
    }
```

```diff
    contract FPValidator (0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59) {
    +++ description: None
      sinceBlock:
+        34400446
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      sinceBlock:
+        32314028
    }
```

```diff
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sinceBlock:
+        47313269
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sinceBlock:
+        47313273
    }
```

```diff
    contract LayerZero Multisig (0xF1a5F92F5F89e8b539136276f827BF1648375312) {
    +++ description: None
      sinceBlock:
+        26282881
    }
```

Generated with discovered.json: 0xb58f09db09217f6a5389db34805593d13644f372

# Diff at Tue, 28 Jan 2025 15:16:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 63387369
- current block number: 67252326

## Description

LayerZero MS update: members swapped and new member added (now 3/5).

## Watched changes

```diff
    contract LayerZero Multisig (0xF1a5F92F5F89e8b539136276f827BF1648375312) {
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

Generated with discovered.json: 0x7a7512b85289f0992b4d8780b34b06b515641e23

# Diff at Mon, 20 Jan 2025 11:10:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 63387369
- current block number: 63387369

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 63387369 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"
      receivedPermissions.0.from:
+        "0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"
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
    contract  (0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x38dE71124f7a447a01D67945a51eDcE9FF491251"
      issuedPermissions.0.to:
+        "0x38dE71124f7a447a01D67945a51eDcE9FF491251"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
      receivedPermissions.0.from:
+        "0x5a54fe5234E811466D5366846283323c954310B2"
    }
```

Generated with discovered.json: 0x4d815532d2e8814350416590f4f755d5984d8264

# Diff at Wed, 23 Oct 2024 10:04:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 58991670
- current block number: 63387369

## Description

LayerZero Multisig: One signer removed.

## Watched changes

```diff
    contract LayerZero Multisig (0xF1a5F92F5F89e8b539136276f827BF1648375312) {
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

Generated with discovered.json: 0x2a871c444216f5cb6d01222120d183ca837e06fa

# Diff at Mon, 21 Oct 2024 11:15:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 58991670
- current block number: 58991670

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 58991670 (main branch discovery), not current.

```diff
    contract  (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x674875DB7a89C7676188DCB590498DEC7AED7881"]
      values.$pastUpgrades.1.1:
-        ["0x674875DB7a89C7676188DCB590498DEC7AED7881"]
+        "0xe08863ce61ceaf5b618aa93cb465acb88b347c1ef229324d156ba68b131d9c12"
      values.$pastUpgrades.0.2:
+        ["0xf618dAe6049AEB8348A509dfd73cd7f823FA1DC1"]
      values.$pastUpgrades.0.1:
-        ["0xf618dAe6049AEB8348A509dfd73cd7f823FA1DC1"]
+        "0x320d934ba618cc616e523a7113e01deea3d391da4abcd80c298dabcc0209442c"
    }
```

```diff
    contract  (0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0x6963Cc1424FCAa13356cE04be0AC5ddf03E3e3B9"]
      values.$pastUpgrades.4.1:
-        ["0x6963Cc1424FCAa13356cE04be0AC5ddf03E3e3B9"]
+        "0x903f6edc7f463f0aada96119acd6451cc7fa245756a8f8226cb9748e6edbcdb1"
      values.$pastUpgrades.3.2:
+        ["0x63FDE6562629e98fB5E0C2C374CC5f25A492Ee38"]
      values.$pastUpgrades.3.1:
-        ["0x63FDE6562629e98fB5E0C2C374CC5f25A492Ee38"]
+        "0x8186c39cfe84586f02ab6599fdbbe3c8408a021048e90fcf51062fc0e5592da1"
      values.$pastUpgrades.2.2:
+        ["0x443CAa8CD23D8CC1e04B3Ce897822AEa6ad3EbDA"]
      values.$pastUpgrades.2.1:
-        ["0x443CAa8CD23D8CC1e04B3Ce897822AEa6ad3EbDA"]
+        "0x9d32dce73e1149535ebabdcd6c7405abcebe542571eebca2dc9518980b90f11e"
      values.$pastUpgrades.1.2:
+        ["0x4E0b66a662b659898eBFD403623EA55f5a2BF495"]
      values.$pastUpgrades.1.1:
-        ["0x4E0b66a662b659898eBFD403623EA55f5a2BF495"]
+        "0x1138839d0cce8718f2075bac227590dc76a737251fb5980e06faa230247080ae"
      values.$pastUpgrades.0.2:
+        ["0x35e1752B043fcc0A0c4478ce8dE062DbF27511B6"]
      values.$pastUpgrades.0.1:
-        ["0x35e1752B043fcc0A0c4478ce8dE062DbF27511B6"]
+        "0xdf99a2c06f342c7c92802995ad51f3824970b27c9b96dbe540e5901796e33447"
    }
```

Generated with discovered.json: 0xf17ca6dbd9d1689ae2361538093511d949a42511

# Diff at Mon, 14 Oct 2024 11:00:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 58991670
- current block number: 58991670

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 58991670 (main branch discovery), not current.

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
    contract TreasuryV2 (0x5f3481F45A3926A136D3dEE078e14D5353C13f2D) {
    +++ description: None
      sourceHashes:
+        ["0x8b908351f18fdaeaf600ae46ef1450c535f741fc95bb25acade77f8b59fdc168"]
    }
```

```diff
    contract FPValidator (0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59) {
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
    contract LayerZero Multisig (0xF1a5F92F5F89e8b539136276f827BF1648375312) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

Generated with discovered.json: 0x5a00c95216d319703f95d90ee76e0172c6894ab8

# Diff at Tue, 01 Oct 2024 11:14:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 58991670
- current block number: 58991670

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 58991670 (main branch discovery), not current.

```diff
    contract  (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-02-08T19:53:29.000Z",["0xf618dAe6049AEB8348A509dfd73cd7f823FA1DC1"]],["2023-04-27T02:35:03.000Z",["0x674875DB7a89C7676188DCB590498DEC7AED7881"]]]
    }
```

```diff
    contract  (0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-02-03T23:03:03.000Z",["0x35e1752B043fcc0A0c4478ce8dE062DbF27511B6"]],["2023-04-23T05:13:41.000Z",["0x4E0b66a662b659898eBFD403623EA55f5a2BF495"]],["2023-06-26T23:14:21.000Z",["0x443CAa8CD23D8CC1e04B3Ce897822AEa6ad3EbDA"]],["2023-09-20T20:10:21.000Z",["0x63FDE6562629e98fB5E0C2C374CC5f25A492Ee38"]],["2023-09-22T14:14:50.000Z",["0x6963Cc1424FCAa13356cE04be0AC5ddf03E3e3B9"]]]
    }
```

Generated with discovered.json: 0x914b66a21c375d439e2eff84ca21be658d0d151f

# Diff at Fri, 30 Aug 2024 08:17:34 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 58991670
- current block number: 58991670

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 58991670 (main branch discovery), not current.

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

Generated with discovered.json: 0x405926a822975f71924ee0046bb9b7e16dea6a51

# Diff at Fri, 23 Aug 2024 09:58:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 58991670
- current block number: 58991670

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 58991670 (main branch discovery), not current.

```diff
    contract  (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract  (0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f) {
    +++ description: None
      values.$upgradeCount:
+        5
    }
```

Generated with discovered.json: 0x936c404c8e7b9650eb00faa2ba0c336318e63e34

# Diff at Wed, 21 Aug 2024 10:08:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 58991670
- current block number: 58991670

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 58991670 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f","via":[]}]
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
    contract  (0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x38dE71124f7a447a01D67945a51eDcE9FF491251","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5a54fe5234E811466D5366846283323c954310B2"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5a54fe5234E811466D5366846283323c954310B2","via":[]}]
    }
```

Generated with discovered.json: 0x1f5b4201214543c49fe7bc5ca52d46e9de73f3c2

# Diff at Fri, 09 Aug 2024 10:14:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 58991670
- current block number: 58991670

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 58991670 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"]
      assignedPermissions.upgrade:
+        ["0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"]
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5a54fe5234E811466D5366846283323c954310B2"]
      assignedPermissions.upgrade:
+        ["0x5a54fe5234E811466D5366846283323c954310B2"]
    }
```

```diff
    contract LayerZero Multisig (0xF1a5F92F5F89e8b539136276f827BF1648375312) {
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

Generated with discovered.json: 0x883edd40f235c9a0018d596058e909a15049b541

# Diff at Fri, 05 Jul 2024 14:35:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@111fee0655d72e75c60324b920975e421fd852f7 block: 55210144
- current block number: 58991670

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 55210144 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x119C04C4E60158fa69eCf4cdDF629D09719a7572)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x6d65a44Bd6Cfe1a8b2E816c918Dd83a6b04c8DEe)
    +++ description: None
```

Generated with discovered.json: 0x3272f1088a45e0ae8fbc0ee37b0f88092cfc1e7f

# Diff at Fri, 29 Mar 2024 10:00:27 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@fb81931df1e69bb68ad02bc55a22b788201dd072 block: 54650344
- current block number: 55210144

## Description

Config change

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 54650344 (main branch discovery), not current.

```diff
    contract LayerZero Multisig (0xF1a5F92F5F89e8b539136276f827BF1648375312) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 6 (33%)"
    }
```

Generated with discovered.json: 0x34094c8161f4f14bd2f6c0f4d89b6da4e11a1fa1

# Diff at Thu, 14 Mar 2024 14:01:10 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3ffa91064379f34a2916a1ad4e93791b752e7e9e block: 54329188
- current block number: 54650344

## Description

New PriceFeed Oracle implementation has been deployed. Nothing that would affect protocol security has been changed.

## Watched changes

```diff
    contract  (0x119C04C4E60158fa69eCf4cdDF629D09719a7572) {
    +++ description: None
      upgradeability.implementation:
-        "0x8042425b53DC6a475cb4e62778A5E17F55f2188d"
+        "0x7Acc1C37DA3B9117E947e80325AD18d6F8Fc6d82"
      implementations.0:
-        "0x8042425b53DC6a475cb4e62778A5E17F55f2188d"
+        "0x7Acc1C37DA3B9117E947e80325AD18d6F8Fc6d82"
    }
```

## Source code changes

```diff
.../-0x119C04C4E60158fa69eCf4cdDF629D09719a7572/implementation/meta.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x85c09570ded6400f4d0d56c3526975f8d661839f

# Diff at Wed, 06 Mar 2024 10:05:40 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@1a2512004b35590384683b93c95d8ec95426d2a6 block: 52626877
- current block number: 54329188

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
+        "0x3823094993190Fbb3bFABfEC8365b8C18517566F"
      values.libraryLookup[2]:
+        "0x5727E81A40015961145330D91cC27b5E189fF3e1"
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

Generated with discovered.json: 0x8004109ae45088cf5f445903c1dc9ac8c5bedc6a

# Diff at Mon, 22 Jan 2024 17:10:47 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@f58cc44bf923844f52038487bcd5a563329f4b43 block: 52128611
- current block number: 52626877

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
      values.defaultAppConfig.116.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.116.outboundProofType:
-        1
+        2
      values.defaultAppConfig.126.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.126.outboundProofType:
-        1
+        2
      values.defaultAppConfig.234:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.inboundProofLibrary.234:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.supportedOutboundProof.234:
+        2
      values.ulnLookup.234:
+        "0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981"
    }
```

# Diff at Tue, 09 Jan 2024 16:43:54 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@0b578574e6a64020b5157f700c09de14e6b3eed3 block: 45856553
- current block number: 52128611

## Description

Unified configurations across L2s. Few new remote chains configurations added. Relayer implementation changed

## Watched changes

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap.150:
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
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.182:
+        {"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.195:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.196:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.197:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.198:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.199:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.202:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.210:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.211:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.212:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.213:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.214:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.215:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.216:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.217:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.218:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.defaultAppConfig.230:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}
      values.inboundProofLibrary.150:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.182:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.195:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.196:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.197:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.198:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.199:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.202:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.210:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.211:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.212:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.213:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.214:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.215:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.216:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.217:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.218:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.inboundProofLibrary.230:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]
      values.supportedOutboundProof.167:
-        2
+        [2,1]
      values.supportedOutboundProof.150:
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
    contract  (0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f) {
      upgradeability.implementation:
-        "0x443CAa8CD23D8CC1e04B3Ce897822AEa6ad3EbDA"
+        "0x6963Cc1424FCAa13356cE04be0AC5ddf03E3e3B9"
      implementations.0:
-        "0x443CAa8CD23D8CC1e04B3Ce897822AEa6ad3EbDA"
+        "0x6963Cc1424FCAa13356cE04be0AC5ddf03E3e3B9"
    }
```

```diff
+   Status: CREATED
    contract  (0x119C04C4E60158fa69eCf4cdDF629D09719a7572) {
    }
```

```diff
+   Status: CREATED
    contract  (0x6d65a44Bd6Cfe1a8b2E816c918Dd83a6b04c8DEe) {
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
 .../polygon-pos/.code/VerifierFeeLib/meta.txt      |   2 +
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
 .../polygon-pos/.code/VerifierNetwork/meta.txt     |   2 +
 .../implementation/meta.txt                        |   2 +-
 .../lzomnichain/polygon-pos/.code/meta.txt         |   2 +
 .../{.code@45856553 => .code}/proxy/meta.txt       |   2 +-
 .../proxy/openzeppelin/access/Ownable.sol          |  29 +-
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
 65 files changed, 4832 insertions(+), 84 deletions(-)
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 45856553 (main branch discovery), not current.

```diff
    contract Endpoint (0x3c2269811836af69497E5F486A85D7316753cf62) {
      values.libraryLookup:
+        ["0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675","0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"]
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap:
+        {"101":20,"102":20,"106":20,"108":32,"109":20,"110":20,"111":20,"112":20,"114":20,"115":20,"116":20,"125":20,"126":20,"138":20,"145":20,"151":20,"153":20,"155":20,"156":20,"158":20,"159":20,"165":20,"166":20,"167":20,"173":20,"175":20,"176":20,"177":20,"181":20,"183":20,"184":20}
      values.defaultAdapterParams:
+        {"101":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"102":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"106":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"108":{"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000000009c4"},"109":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"110":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"111":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"112":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"114":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"115":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"116":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"125":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"126":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"138":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"145":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"151":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"153":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"155":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"156":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"158":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"159":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"165":{"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000003d0900"},"166":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"167":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"173":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"175":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"176":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"177":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"181":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"183":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"184":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}}
      values.defaultAppConfig:
+        {"101":{"inboundProofLib":1,"inboundBlockConfirm":15,"outboundProofType":1,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"102":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":1,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"106":{"inboundProofLib":1,"inboundBlockConfirm":12,"outboundProofType":1,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"108":{"inboundProofLib":1,"inboundBlockConfirm":500000,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"109":{"inboundProofLib":1,"inboundBlockConfirm":512,"outboundProofType":1,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"110":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":1,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"111":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"112":{"inboundProofLib":1,"inboundBlockConfirm":5,"outboundProofType":1,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"114":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":1,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"115":{"inboundProofLib":1,"inboundBlockConfirm":10,"outboundProofType":1,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"116":{"inboundProofLib":1,"inboundBlockConfirm":5,"outboundProofType":1,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"125":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"126":{"inboundProofLib":1,"inboundBlockConfirm":10,"outboundProofType":1,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"138":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"145":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"151":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"153":{"inboundProofLib":2,"inboundBlockConfirm":21,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"155":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"156":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"158":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"159":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"165":{"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"166":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"167":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"173":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"175":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"176":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"177":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"181":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"183":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"},"184":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":512,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f"}}
      values.inboundProofLibrary:
+        {"101":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"102":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"106":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"108":"0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59","109":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"110":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"111":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"112":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"114":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"115":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"116":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"125":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"126":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"138":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"145":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"151":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"153":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"155":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"156":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"158":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"159":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"165":"0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59","166":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"167":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"173":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"175":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"176":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"177":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"181":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"183":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"],"184":["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59"]}
      values.supportedOutboundProof:
+        {"101":[1,2],"102":[1,2],"106":[1,2],"108":2,"109":[1,2],"110":[1,2],"111":[1,2],"112":[1,2],"114":[1,2],"115":[1,2],"116":[1,2],"125":[1,2],"126":[1,2],"138":2,"145":2,"151":2,"153":2,"155":2,"156":2,"158":2,"159":[1,2],"165":2,"166":2,"167":2,"173":[1,2],"175":[1,2],"176":2,"177":2,"181":2,"183":2,"184":2}
      values.ulnLookup:
+        {"101":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","102":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","106":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","108":"0x54ad3d30af77b60d939ae356e6606de9a4da67583f02b962d2d3f2e481484e90","109":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","110":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","111":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","112":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","114":"0x000000000000000000000000bb2753c1b940363d278c81d6402fa89e79ab4ebc","115":"0x000000000000000000000000658fd63dca9378e3b7deb49463d0b25336433f91","116":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","125":"0x000000000000000000000000377530cda84dfb2673bf4d145dcf0c4d7fdcb5b6","126":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","138":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","145":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","151":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","153":"0x00000000000000000000000066a71dcef29a0ffbdbe3c6a460a3b5bc225cd675","155":"0x00000000000000000000000066a71dcef29a0ffbdbe3c6a460a3b5bc225cd675","156":"0x00000000000000000000000026b24e76226d982e362c4662c5f272a16b22e991","158":"0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098","159":"0x000000000000000000000000c1b15d3b262beec0e3565c11c9e0f6134bdacb36","165":"0x000000000000000000000000042b8289c97896529ec2fe49ba1a8b9c956a86cc","166":"0x0000000000000000000000006f475642a6e85809b1c36fa62763669b1b48dd5b","167":"0x000000000000000000000000e9ba4c1e76d874a43942718dafc96009ec9d9917","173":"0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098","175":"0x0000000000000000000000002d61dcdd36f10b22176e0433b86f74567d529aaa","176":"0x0000000000000000000000000be3818b1c495bbd44b6579f6d0a4bea1bcbff8a","177":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","181":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","183":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","184":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"}
    }
```

```diff
    contract GnosisSafeL2 (0xF1a5F92F5F89e8b539136276f827BF1648375312) {
      name:
-        "GnosisSafeL2"
+        "LayerZero Multisig"
      derivedName:
+        "GnosisSafeL2"
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
    contract  (0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f) {
    }
```

```diff
+   Status: CREATED
    contract FPValidator (0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    }
```
