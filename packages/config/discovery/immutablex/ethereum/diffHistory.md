Generated with discovered.json: 0xe4a647504fe6fa323901307285f4cae97e4f58ba

# Diff at Mon, 20 Jan 2025 11:09:36 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21387345
- current block number: 21387345

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387345 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD2C37fC6fD89563187f3679304975655e448D192"
      issuedPermissions.0.to:
+        "0xD2C37fC6fD89563187f3679304975655e448D192"
    }
```

```diff
    contract IMXProxyGovernanceMultisig2 (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
      receivedPermissions.0.from:
+        "0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
    }
```

Generated with discovered.json: 0xbd9548fa6861c96f6b104fd0b3ea89441ae80b15

# Diff at Thu, 12 Dec 2024 15:33:43 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21334467
- current block number: 21387345

## Description

Removed Multisig1 as admin of StarkExchange, now admin is only Multisig2.

## Watched changes

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xD2C37fC6fD89563187f3679304975655e448D192","via":[]}
      issuedPermissions.0.target:
-        "0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91"
+        "0xD2C37fC6fD89563187f3679304975655e448D192"
      values.$admin:
-        ["0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91","0xD2C37fC6fD89563187f3679304975655e448D192"]
+        "0xD2C37fC6fD89563187f3679304975655e448D192"
    }
```

```diff
-   Status: DELETED
    contract IMXProxyGovernanceMultisig1 (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafe.sol => /dev/null                    | 953 ---------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |  35 -
 2 files changed, 988 deletions(-)
```

Generated with discovered.json: 0x05d320eff815b3c241c92574418be87d8d86f1d6

# Diff at Thu, 05 Dec 2024 06:21:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 19910271
- current block number: 21334467

## Description

Second Governor MS added.

## Watched changes

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xD2C37fC6fD89563187f3679304975655e448D192","via":[]}
      values.$admin:
-        "0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91"
+        ["0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91","0xD2C37fC6fD89563187f3679304975655e448D192"]
    }
```

```diff
+   Status: CREATED
    contract IMXProxyGovernanceMultisig2 (0xD2C37fC6fD89563187f3679304975655e448D192)
    +++ description: None
```

## Source code changes

```diff
.../IMXProxyGovernanceMultisig2/GnosisSafe.sol     | 953 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |  35 +
 2 files changed, 988 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract IMXProxyGovernanceMultisig1 (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      name:
-        "ProxyGovernanceMultisig"
+        "IMXProxyGovernanceMultisig1"
    }
```

Generated with discovered.json: 0xd4d8b2065a48ffd2e041bd13b7f423fd023fda45

# Diff at Mon, 21 Oct 2024 11:06:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.7.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x3425fd24435e4aefdb08f3970e61e446eb5d21a1e0c916d1ba9331b060b72192"
      values.$pastUpgrades.6.2:
+        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
      values.$pastUpgrades.6.1:
-        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
+        "0x658a93571ca9733ba346bd746790a6d07821d86c89fd90809e85bf7f2f8d9797"
      values.$pastUpgrades.5.2:
+        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
      values.$pastUpgrades.5.1:
-        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
+        "0xeaa0efb3937eee43c1083cc776d5033b131e6ef12ba0d0646db1b34e600847cd"
      values.$pastUpgrades.4.2:
+        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
      values.$pastUpgrades.4.1:
-        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
+        "0x26fb60bb6b5ff3ef22cd959d007588f7410586499870411cfddc2759b97d44d6"
      values.$pastUpgrades.3.2:
+        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
      values.$pastUpgrades.3.1:
-        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
+        "0x9e8cc538b40a70723a287ece3ecb4e6aafbbde0e04f621124df6e4c2d7995dc7"
      values.$pastUpgrades.2.2:
+        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
      values.$pastUpgrades.2.1:
-        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
+        "0x79f72bef0984e3ae76ab638c078f92f1a0d4ad2a289b8a91e072d81f77d505ce"
      values.$pastUpgrades.1.2:
+        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
      values.$pastUpgrades.1.1:
-        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
+        "0xf42d8fc579401fc76769bf63ba72f7277aac976aeb2a4cd3eca899ca08de7c20"
      values.$pastUpgrades.0.2:
+        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
      values.$pastUpgrades.0.1:
-        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
+        "0x9b57c19aa91cc17c9487085b68532cd65d1e4c263b5928f14c03a9d36c9097df"
    }
```

Generated with discovered.json: 0x0b4eae0728c45a50319f9711c9d0ad57226b99eb

# Diff at Mon, 14 Oct 2024 10:51:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract Committee (0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295) {
    +++ description: None
      sourceHashes:
+        ["0x83a4f7af4e5a371aadb57903aed1b1f96556a0b3eb4665044a65ad8f70a89edc"]
    }
```

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: None
      sourceHashes:
+        ["0x1e28fda3c245bc1fc13d0ddc7b108be510d1e0220fc67552921c87724bb45a4c"]
    }
```

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      sourceHashes:
+        ["0xc527211f14e6fa12809b6b7ec28c6757daa907478cefeb1b8835ee7d47139bf7","0x54407214d4211e41ecb742c3df7564e352844c1f5da38ef2e206b0465bd5345b","0x497eebe95d8d7611823ffcb6cc098a9c3c71e91941026f2b4c4989d6f9fa944d","0x452c4b92e2f090f2979fe1dec4ee28bf8b9c431b96b67966a3c2279f9e332684","0xf615d0291aa23f36d8cb749e3950b549d57d38bfef0c342331d0cedd7d769026","0x7e358cdedbf8af25ae12a5fe965db091c7751aafa68c2460ab43e81a8eb364b9","0x105353ea24f9e10459c2487f227bc285c4ca2317fac8e12a8b936bc92329aea5","0x93b21bfbef09c4e60d6a17309877245220508c54478159a8f2b9dbfb60576c4b"]
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: None
      sourceHashes:
+        ["0x3c0fff412189244728e9be021e2c7a1084326cc80e71f930221094909caafec0"]
    }
```

```diff
    contract ProxyGovernanceMultisig (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0xca735c63b7c72599c497b10a305c0858711760e9

# Diff at Tue, 01 Oct 2024 10:51:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-03-10T15:13:08.000Z",["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]],["2021-03-16T18:04:39.000Z",["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]],["2021-03-25T11:24:15.000Z",["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]],["2021-03-26T08:01:31.000Z",["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]],["2021-08-31T08:15:29.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2021-09-09T16:30:02.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2022-01-13T08:08:51.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2024-05-20T06:39:35.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]]]
      values.$upgradeCount:
+        8
    }
```

Generated with discovered.json: 0x3803430281e1224e46d9b971d95cb2ce6d05b9b8

# Diff at Fri, 30 Aug 2024 07:53:08 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract ProxyGovernanceMultisig (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x26682f220e653dc661816cc24fdd06627bcf798a

# Diff at Wed, 21 Aug 2024 10:03:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91","via":[]}]
    }
```

```diff
    contract ProxyGovernanceMultisig (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5FDCCA53617f4d2b9134B29090C87D01058e27e9","via":[]}]
    }
```

Generated with discovered.json: 0xc6b0a2b8d66394ef77e047fdc18f73f07d67997b

# Diff at Fri, 09 Aug 2024 10:09:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract ProxyGovernanceMultisig (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"]
      assignedPermissions.upgrade:
+        ["0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"]
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x59232aC80E6d403b6381393e52f4665ECA328558","0x0405107a60391Eb51821be373ff978115Ee58488","0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x59232aC80E6d403b6381393e52f4665ECA328558","0x0405107a60391Eb51821be373ff978115Ee58488","0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xbf9e7b973e90203b4d7681284b5a42431294f2e7

# Diff at Tue, 30 Jul 2024 11:12:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      fieldMeta:
+        {"DEPOSIT_CANCEL_DELAY":{"description":"The time delay required before canceled deposits to the L2 can be reclaimed."}}
    }
```

Generated with discovered.json: 0x31ba0c8d41aae8b994281974a65468f6448d1593

# Diff at Mon, 20 May 2024 09:34:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7e20051208df39f6d4f6d35a22cb1356bd1b211c block: 19825366
- current block number: 19910271

## Description

Starkex diamond contracts are upgraded to [version 4.0.1](https://github.com/starkware-libs/starkex-contracts/releases).

- Removed the need to register users (Registration is now only required for deposit cancellation and escape flows.)
- Slight change to the way the hash message for on-chain registration is calculated.

### AllVerifiers.2.sol

- formatting
- uncheckedTokenContractCall() removed

### TokensAndRamping.3.sol

Change to the way the hash message for on-chain registration is calculated. (ownerKey vs ethKey)

- formatting
- withdrawTo(), withdrawNftTo(), is now withdraw(), withdrawNft()
- EllipticCurve lib added
- registerUser() is now registerAdddress() and using `ECDSA.verify`
- starkKey is now ownerKey

### Other diamond facets

- formatting and minor changes

### DepositCancelDelay

- Reduced from 3 days to 2 days.

## Watched changes

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      upgradeability.implementation:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      upgradeability.facets.StarkWare_AllVerifiers_2020_1:
-        "0xF65C115efd24102315Af53f84aD65aD240bc9D57"
+        "0x62BCA4DB742A99c834e2c24b609656A70EA25379"
      upgradeability.facets.StarkWare_TokensAndRamping_2020_1:
-        "0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
+        "0x8536850750956c2FEebeCAB786d82271a5467687"
      upgradeability.facets.StarkWare_StarkExState_2021_1:
-        "0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
+        "0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
      upgradeability.facets.StarkWare_ForcedActions_2020_1:
-        "0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
+        "0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
      upgradeability.facets.StarkWare_OnchainVaults_2021_1:
-        "0x2D542881E93491e765E5110c1e373FC2968E720A"
+        "0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
      upgradeability.facets.StarkWare_ProxyUtils_2021_1:
-        "0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
+        "0xB3788a88F063B217227E27ae16Ba550db3132bE6"
      implementations.6:
-        "0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
+        "0xB3788a88F063B217227E27ae16Ba550db3132bE6"
      implementations.5:
-        "0x2D542881E93491e765E5110c1e373FC2968E720A"
+        "0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
      implementations.4:
-        "0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
+        "0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
      implementations.3:
-        "0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
+        "0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
      implementations.2:
-        "0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
+        "0x8536850750956c2FEebeCAB786d82271a5467687"
      implementations.1:
-        "0xF65C115efd24102315Af53f84aD65aD240bc9D57"
+        "0x62BCA4DB742A99c834e2c24b609656A70EA25379"
      implementations.0:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
+++ description: The time delay required before canceled deposits to the L2 can be reclaimed.
      values.DEPOSIT_CANCEL_DELAY:
-        259200
+        172800
      values.implementation:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      values.VERSION:
-        "3.0.3"
+        "4.0.1"
    }
```

## Source code changes

```diff
.../StarkExchange/AllVerifiers.2.sol               |  301 ++---
 .../StarkExchange/ForcedActions.5.sol              |  291 ++---
 .../StarkExchange/OnchainVaults.6.sol              |  349 +++---
 .../StarkExchange/ProxyUtils.7.sol                 |  124 +-
 .../StarkExchange/StarkExState.4.sol               |  631 ++++------
 .../StarkExchange/StarkExchange.1.sol              |  272 ++---
 .../StarkExchange/TokensAndRamping.3.sol           | 1245 ++++++++++++--------
 7 files changed, 1565 insertions(+), 1648 deletions(-)
```

Generated with discovered.json: 0x8a763974559283af9b7c5b24360ce3bc57897fa7

# Diff at Wed, 08 May 2024 12:33:48 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624857
- current block number: 19825366

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624857 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"
+        ["0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"]
      values.getRegisteredVerifiers:
-        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
+        ["0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"]
    }
```

Generated with discovered.json: 0x7e2b16f28a98ef801db7980deb7a3a2b67443f77

# Diff at Wed, 10 Apr 2024 11:13:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19531600
- current block number: 19624857

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531600 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"]
+        "0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"
      values.getRegisteredVerifiers:
-        ["0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"]
+        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
    }
```

Generated with discovered.json: 0x53e73e587add20d50b8d83a526d3972896bd2f2e

# Diff at Thu, 28 Mar 2024 09:04:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 18263193
- current block number: 19531600

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18263193 (main branch discovery), not current.

```diff
    contract ProxyGovernanceMultisig (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xc73beedc2abdbc04f79f75ef808ea7a26804e89f

# Diff at Mon, 02 Oct 2023 13:37:55 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract GnosisSafe (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
      name:
-        "GnosisSafe"
+        "ProxyGovernanceMultisig"
      derivedName:
+        "GnosisSafe"
    }
```
