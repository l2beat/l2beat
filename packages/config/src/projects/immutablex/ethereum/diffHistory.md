Generated with discovered.json: 0x3cd2700fd6a41993b5728b1766a1e928eed465cf

# Diff at Tue, 11 Mar 2025 16:09:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b567159bfa1d1fb03ba2dbc6915b5acc47e00c0 block: 21995398
- current block number: 21995398

## Description

config: starknet/ex operator role description updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995398 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.4.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

```diff
    contract undefined (0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e) {
    +++ description: None
      receivedPermissions.0.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

Generated with discovered.json: 0xe88a958e4eedd69310bf4ad0e6cff1c13071b0f6

# Diff at Fri, 07 Mar 2025 13:48:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 21981175
- current block number: 21995398

## Description

MS: single member change.

## Watched changes

```diff
    contract IMXAdminMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      values.$members.5:
-        "0xbD8Dc294478ec4dAd9f1b4596bf275f4d0309817"
+        "0xb3538EDB1cD74AE43e0aD25eac6F03553657E3fB"
    }
```

Generated with discovered.json: 0xe701381bf94f5120bc4d92ab3b175a717573316d

# Diff at Thu, 06 Mar 2025 15:18:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21981175
- current block number: 21981175

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981175 (main branch discovery), not current.

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      values.programHashMapped:
-        "3485280386001712778192330279103973322645241679001461923469191557000342180556"
+        "StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"15787695375210609250491147414005894154890873413229882671403677761527504080":"Starknet Aggregator (since v0.13.3)","2397984267054479079853548842566103781972463965746662494980785692480538410509":"StarkNet OS (Starknet)","853638403225561750106379562222782223909906501242604214771127703946595519856":"StarkNet OS (Paradex)","3383082961563516565935611087683915026448707331436034043529592588079494402084":"StarkNet OS (old Paradex, old StarkNet)","3485280386001712778192330279103973322645241679001461923469191557000342180556":"StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)","770346231394331402493200980986217737662224545740427952627288191358999988146":"ApeX-USDT","3174901404014912024702042974619036870715605532092680335571201877913899936957":"StarkEx Spot v4.0 (RhinoFi, Sorare)","16830627573509542901909952446321116535677491650708854009406762893086223513":"StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)","2530337539466159944237001094809327283009177793361359619481044346150483328860":"ApeX-USDC 20250130","3114724292040200590153042023978438629733352741898912919152162079752811928849":"StarkEx Perp v2.0 ApeX-USDC","217719352201300445998518619904782191262194843262573339166404641663770051805":"StarkNet (old)","3003515909324298587247571665454372831319437787162989623104387385306791861180":"StarkNet (old)","1161178844461337253856226043908368523817098764221830529880464854589141231910":"StarkNet Aggregator (old)","1921772108187713503530008849184725638117898887391063185252422808224349294626":"StarkNet (old)","3258367057337572248818716706664617507069572185152472699066582725377748079373":"StarkNet (old)","407700941260678649793204927710478760533239334662847444187959202896452163393":"StarkNet (old)","1865367024509426979036104162713508294334262484507712987283009063059134893433":"StarkNet (old)","54878256403880350656938046611252303365750679698042371543935159963667935317":"StarkNet (old)","2479841346739966073527450029179698923866252973805981504232089731754042431018":"StarkNet (old)","109586309220455887239200613090920758778188956576212125550190099009305121410":"StarkNet (old)"}}]
    }
```

Generated with discovered.json: 0x504ae4df134fe60e0f152d6708a4e38d557d6af0

# Diff at Wed, 05 Mar 2025 14:07:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e85261cbf7cfc5afeac755b44f9df82c8a3c4ba block: 21387345
- current block number: 21981175

## Description

discodrive starkExes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387345 (main branch discovery), not current.

```diff
    contract DACommittee (0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295) {
    +++ description: Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 5.
      name:
-        "Committee"
+        "DACommittee"
      template:
+        "starkex/Committee"
      description:
+        "Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 5."
      fieldMeta:
+        {"constructorArgs":{"description":"Includes DAC members and threshold."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: Helper contract for registering limit orders from L1.
      template:
+        "starkex/OrderRegistry"
      description:
+        "Helper contract for registering limit orders from L1."
    }
```

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0xD2C37fC6fD89563187f3679304975655e448D192","delay":1209600,"via":[]}
      issuedPermissions.4:
+        {"permission":"operateStarknet","to":"0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e","via":[]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0xeDb0219557ba13816f1dEb7fA54688362B05A5aE","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0xD2C37fC6fD89563187f3679304975655e448D192","description":"manage the token admin role.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      values.OPERATORS:
-        ["0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e"]
      values.operators:
+        ["0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e"]
      values.tokenAdmins:
+        ["0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A","0xeDb0219557ba13816f1dEb7fA54688362B05A5aE"]
      values.UPGRADE_DELAY_SLOT:
+        "0xc21dbb3089fcb2c4f4c6a67854ab4db2b0f233ea4b21b21f912d52d18fc5db1f"
      fieldMeta.$admin:
+        {"severity":"HIGH","description":"Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts."}
      fieldMeta.isFinalized:
+        {"severity":"HIGH","description":"Finalizes most of the configuration of the contract, which cannot be changed afterwards (only thorugh an upgrade)."}
      template:
+        "starkex/StarkExchange"
      description:
+        "Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      values.programHashMapped:
+        "3485280386001712778192330279103973322645241679001461923469191557000342180556"
      template:
+        "starkex/GpsFactRegistryAdapter"
      description:
+        "Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`)."
    }
```

```diff
    contract IMXAdminMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      name:
-        "IMXProxyGovernanceMultisig2"
+        "IMXAdminMultisig"
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0x5FDCCA53617f4d2b9134B29090C87D01058e27e9","delay":1209600}
      receivedPermissions.1:
+        {"permission":"interact","from":"0x5FDCCA53617f4d2b9134B29090C87D01058e27e9","description":"manage the token admin role."}
      receivedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      severity:
+        "HIGH"
    }
```

Generated with discovered.json: 0x297af54cd97a1a67d5d6d63d86f444685b6a6f23

# Diff at Tue, 04 Mar 2025 10:39:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21387345
- current block number: 21387345

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387345 (main branch discovery), not current.

```diff
    contract Committee (0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295) {
    +++ description: None
      sinceBlock:
+        12107592
    }
```

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: None
      sinceBlock:
+        12831566
    }
```

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      sinceBlock:
+        12011518
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: None
      sinceBlock:
+        13849860
    }
```

```diff
    contract IMXProxyGovernanceMultisig2 (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      sinceBlock:
+        18816399
    }
```

Generated with discovered.json: 0x0dc28e635561479f5220d2326f983a93cc261f35

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
