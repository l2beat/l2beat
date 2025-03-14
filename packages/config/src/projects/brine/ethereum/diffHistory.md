Generated with discovered.json: 0x795eefa700c10209ae764999452b569aa602f223

# Diff at Tue, 11 Mar 2025 16:09:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b567159bfa1d1fb03ba2dbc6915b5acc47e00c0 block: 21981345
- current block number: 21981345

## Description

config: starknet/ex operator role description updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981345 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.3.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

```diff
    contract undefined (0xc3a27F45015E2c36ce3cC78c662c5f259c26Cf25) {
    +++ description: None
      receivedPermissions.0.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

Generated with discovered.json: 0x929bd1440f3e60e1f0acdd71002862922e3e3b67

# Diff at Thu, 06 Mar 2025 15:18:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21981345
- current block number: 21981345

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981345 (main branch discovery), not current.

```diff
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`16830627573509542901909952446321116535677491650708854009406762893086223513`).
      values.programHashMapped:
-        "16830627573509542901909952446321116535677491650708854009406762893086223513"
+        "StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"15787695375210609250491147414005894154890873413229882671403677761527504080":"Starknet Aggregator (since v0.13.3)","2397984267054479079853548842566103781972463965746662494980785692480538410509":"StarkNet OS (Starknet)","853638403225561750106379562222782223909906501242604214771127703946595519856":"StarkNet OS (Paradex)","3383082961563516565935611087683915026448707331436034043529592588079494402084":"StarkNet OS (old Paradex, old StarkNet)","3485280386001712778192330279103973322645241679001461923469191557000342180556":"StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)","770346231394331402493200980986217737662224545740427952627288191358999988146":"ApeX-USDT","3174901404014912024702042974619036870715605532092680335571201877913899936957":"StarkEx Spot v4.0 (RhinoFi, Sorare)","16830627573509542901909952446321116535677491650708854009406762893086223513":"StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)","2530337539466159944237001094809327283009177793361359619481044346150483328860":"ApeX-USDC 20250130","3114724292040200590153042023978438629733352741898912919152162079752811928849":"StarkEx Perp v2.0 ApeX-USDC","217719352201300445998518619904782191262194843262573339166404641663770051805":"StarkNet (old)","3003515909324298587247571665454372831319437787162989623104387385306791861180":"StarkNet (old)","1161178844461337253856226043908368523817098764221830529880464854589141231910":"StarkNet Aggregator (old)","1921772108187713503530008849184725638117898887391063185252422808224349294626":"StarkNet (old)","3258367057337572248818716706664617507069572185152472699066582725377748079373":"StarkNet (old)","407700941260678649793204927710478760533239334662847444187959202896452163393":"StarkNet (old)","1865367024509426979036104162713508294334262484507712987283009063059134893433":"StarkNet (old)","54878256403880350656938046611252303365750679698042371543935159963667935317":"StarkNet (old)","2479841346739966073527450029179698923866252973805981504232089731754042431018":"StarkNet (old)","109586309220455887239200613090920758778188956576212125550190099009305121410":"StarkNet (old)"}}]
    }
```

Generated with discovered.json: 0x097769a31c7e6f6f27670be45218e46fd7ebf208

# Diff at Wed, 05 Mar 2025 14:55:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e85261cbf7cfc5afeac755b44f9df82c8a3c4ba block: 19825361
- current block number: 21981345

## Description

discodrive sn stack and starkex chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825361 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0x303775491494a08b07365938787274F742a81F63","via":[]}
      issuedPermissions.3:
+        {"permission":"operateStarknet","to":"0xc3a27F45015E2c36ce3cC78c662c5f259c26Cf25","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0x4a5e124201c38bf7a618388A8185D3f5C8E9133f","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0x303775491494a08b07365938787274F742a81F63","description":"manage the token admin role.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      values.getActionCount:
-        6
      values.getAssetInfo:
-        []
      values.initializerSize:
-        0
      values.OPERATORS:
-        ["0xc3a27F45015E2c36ce3cC78c662c5f259c26Cf25"]
      values.operators:
+        ["0xc3a27F45015E2c36ce3cC78c662c5f259c26Cf25"]
      values.tokenAdmins:
+        ["0x4a5e124201c38bf7a618388A8185D3f5C8E9133f"]
      template:
+        "starkex/StarkExchange"
      description:
+        "Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles."
      fieldMeta:
+        {"$admin":{"severity":"HIGH","description":"Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts."},"isFinalized":{"severity":"HIGH","description":"Finalizes most of the configuration of the contract, which cannot be changed afterwards (only thorugh an upgrade)."},"DEPOSIT_CANCEL_DELAY":{"description":"The time delay required before canceled deposits to the L2 can be reclaimed."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract DACommittee (0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446) {
    +++ description: Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 2.
      name:
-        "Committee"
+        "DACommittee"
      template:
+        "starkex/Committee"
      description:
+        "Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 2."
      fieldMeta:
+        {"constructorArgs":{"description":"Includes DAC members and threshold."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`16830627573509542901909952446321116535677491650708854009406762893086223513`).
      values.programHashMapped:
+        "16830627573509542901909952446321116535677491650708854009406762893086223513"
      template:
+        "starkex/GpsFactRegistryAdapter"
      description:
+        "Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`16830627573509542901909952446321116535677491650708854009406762893086223513`)."
    }
```

```diff
    contract OrderRegistry (0x806d435a82B0381bD884540c2235147c13B97fe6) {
    +++ description: Helper contract for registering limit orders from L1.
      template:
+        "starkex/OrderRegistry"
      description:
+        "Helper contract for registering limit orders from L1."
    }
```

Generated with discovered.json: 0x37a91c5fcd7430c1e72cc1bc1ad58deae4c53a22

# Diff at Tue, 04 Mar 2025 10:39:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19825361
- current block number: 19825361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825361 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      sinceBlock:
+        15114701
    }
```

```diff
    contract Committee (0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446) {
    +++ description: None
      sinceBlock:
+        15121893
    }
```

```diff
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    +++ description: None
      sinceBlock:
+        15114702
    }
```

```diff
    contract OrderRegistry (0x806d435a82B0381bD884540c2235147c13B97fe6) {
    +++ description: None
      sinceBlock:
+        15114702
    }
```

Generated with discovered.json: 0xb689c8f0cff8ccccc7fe454d166177d8a5e5b75f

# Diff at Mon, 20 Jan 2025 11:09:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19825361
- current block number: 19825361

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825361 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x303775491494a08b07365938787274F742a81F63"
      issuedPermissions.0.to:
+        "0x303775491494a08b07365938787274F742a81F63"
    }
```

Generated with discovered.json: 0x6a5c488540d21df3c349e3b326ae65c77a6354fe

# Diff at Mon, 21 Oct 2024 11:04:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19825361
- current block number: 19825361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825361 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.1.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x0ba3606ba4b0ec058a8fe2dfe68bd4f35a321771db1494d350192b5e3025dfb8"
      values.$pastUpgrades.0.2:
+        ["0xe6785C3AfF4292C9d7c6b039f649672C45CAfFee","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x4b9b30e6E135d5e39345a03F381D9c704b2Af010","0x07228f73AA048f67893F4b966D1D09783EdD8764","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.0.1:
-        ["0xe6785C3AfF4292C9d7c6b039f649672C45CAfFee","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x4b9b30e6E135d5e39345a03F381D9c704b2Af010","0x07228f73AA048f67893F4b966D1D09783EdD8764","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0xbb2c1a2af8cd1610e653c265b6e395bbea1bcea66006673a094a3d7e966a190c"
    }
```

Generated with discovered.json: 0x87900c833381285086b631152b970e673c2a54d5

# Diff at Mon, 14 Oct 2024 10:50:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19825361
- current block number: 19825361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825361 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      sourceHashes:
+        ["0x2c95972415c771f5ef6d71449bae168597b6c35245fbe8769425e5c9c753e918","0xadae235d029868dddc287e823167705942660a99a9154a4e487f5dfb4ddd01c9","0x70e4767336d4a44ecedb78b7cef6dc2810f5d8bc87a46c360083e65af451cb97","0x75d386d73767f57d5f11c11f7bf837a48cd417754eea559931fc98a96ef34152","0x0e101cfdb791ca1a86402273377c7da5e67225cf5799ac2f51d9a940227ee6be","0x7d557870276c694154e12790f8c0c09930c8c75320f470c47b67968bffd536a6","0x2a703c051ff2524868f044282fc50b01913736a92f794b64b31bd31363cd3fca","0xd5b06286e3bf5dccd0bb360c8cc876aec0a2ce288120d9f83dec45fa47c1aabc"]
    }
```

```diff
    contract Committee (0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446) {
    +++ description: None
      sourceHashes:
+        ["0xb7173602faa329abf6af13a2dca4512d58504df7a9a3beace2a8a0470b416b02"]
    }
```

```diff
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    +++ description: None
      sourceHashes:
+        ["0x3c0fff412189244728e9be021e2c7a1084326cc80e71f930221094909caafec0"]
    }
```

```diff
    contract OrderRegistry (0x806d435a82B0381bD884540c2235147c13B97fe6) {
    +++ description: None
      sourceHashes:
+        ["0x1e28fda3c245bc1fc13d0ddc7b108be510d1e0220fc67552921c87724bb45a4c"]
    }
```

Generated with discovered.json: 0x441862f1677fe5a1358fc0a21c1e038d22ae088b

# Diff at Tue, 01 Oct 2024 10:50:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825361
- current block number: 19825361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825361 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-07-10T11:43:26.000Z",["0xe6785C3AfF4292C9d7c6b039f649672C45CAfFee","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x4b9b30e6E135d5e39345a03F381D9c704b2Af010","0x07228f73AA048f67893F4b966D1D09783EdD8764","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2022-09-01T15:17:55.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xba8ebbc521de98ddec0177eb0e97b0f968d4f095

# Diff at Wed, 21 Aug 2024 10:02:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825361
- current block number: 19825361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825361 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x303775491494a08b07365938787274F742a81F63","via":[]}]
    }
```

Generated with discovered.json: 0xfc7f9a53cff53777cd8c3d6de98e1616a725c704

# Diff at Wed, 08 May 2024 12:32:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624845
- current block number: 19825361

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624845 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446"
+        ["0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446"]
      values.getRegisteredVerifiers:
-        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
+        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
    }
```

Generated with discovered.json: 0xbad77bab912db96aa0e8e1ba2bd66b2579a0d2af

# Diff at Wed, 10 Apr 2024 11:11:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19531506
- current block number: 19624845

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531506 (main branch discovery), not current.

```diff
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446"]
+        "0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446"
      values.getRegisteredVerifiers:
-        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
+        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
    }
```

Generated with discovered.json: 0xb5850ddd61b2f05649c4fc15cdc1a99a42517d3d

# Diff at Wed, 06 Mar 2024 14:41:28 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cea88c5f3ff85fed5d72dadc72ae50315d0808d6 block: 18983727
- current block number: 19376792

## Description

Added the SHARP shared module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18983727 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6)
    +++ description: None
```

Generated with discovered.json: 0x0cd8c4cfa2d1f43c4656c004415ecaf6cdd32409

# Diff at Thu, 11 Jan 2024 12:36:15 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- current block number: 18983651

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    }
```

```diff
+   Status: CREATED
    contract Committee (0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446) {
    }
```

```diff
+   Status: CREATED
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    }
```

```diff
+   Status: CREATED
    contract OrderRegistry (0x806d435a82B0381bD884540c2235147c13B97fe6) {
    }
```
