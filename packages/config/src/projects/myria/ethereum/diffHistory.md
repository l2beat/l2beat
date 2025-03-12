Generated with discovered.json: 0xbdec75f6afd7c3099bed083c601dfa32c06ddf64

# Diff at Tue, 11 Mar 2025 16:09:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b567159bfa1d1fb03ba2dbc6915b5acc47e00c0 block: 21981354
- current block number: 21981354

## Description

config: starknet/ex operator role description updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981354 (main branch discovery), not current.

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.3.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

```diff
    contract undefined (0xe997ece81cb8A686206ea6042886B594Ecf6DdED) {
    +++ description: None
      receivedPermissions.0.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

Generated with discovered.json: 0x8793bbea8c28cc8e9f9b669ecf1c6a9d57e2bbe5

# Diff at Thu, 06 Mar 2025 15:19:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21981354
- current block number: 21981354

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981354 (main branch discovery), not current.

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

Generated with discovered.json: 0x1e0d2e411d59bc47f4f8fd104817eb937dd925c1

# Diff at Wed, 05 Mar 2025 14:43:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e85261cbf7cfc5afeac755b44f9df82c8a3c4ba block: 19825378
- current block number: 21981354

## Description

discodrive sn stack and starkex chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825378 (main branch discovery), not current.

```diff
    contract DACommittee (0x1e601435E181423e7A8430813d7500012a6169cB) {
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
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0xc49Ec6Bb817E17a9Ca5B738ca330db403cc74245","delay":1209600,"via":[]}
      issuedPermissions.3:
+        {"permission":"operateStarknet","to":"0xe997ece81cb8A686206ea6042886B594Ecf6DdED","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0xc49Ec6Bb817E17a9Ca5B738ca330db403cc74245","description":"manage the token admin role.","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0x86ED881374a81efcc1Aa9f82cA9740B40F0FCbfe","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      values.OPERATORS:
-        ["0xe997ece81cb8A686206ea6042886B594Ecf6DdED"]
      values.operators:
+        ["0xe997ece81cb8A686206ea6042886B594Ecf6DdED"]
      values.tokenAdmins:
+        ["0x86ED881374a81efcc1Aa9f82cA9740B40F0FCbfe"]
      values.UPGRADE_DELAY_SLOT:
+        "0xc21dbb3089fcb2c4f4c6a67854ab4db2b0f233ea4b21b21f912d52d18fc5db1f"
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

Generated with discovered.json: 0x9f5e9f3cddf47344648bc82c491729f577db975c

# Diff at Tue, 04 Mar 2025 10:39:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19825378
- current block number: 19825378

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825378 (main branch discovery), not current.

```diff
    contract Committee (0x1e601435E181423e7A8430813d7500012a6169cB) {
    +++ description: None
      sinceBlock:
+        15270396
    }
```

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: None
      sinceBlock:
+        15270396
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

Generated with discovered.json: 0x3eaa7ca9cc4996643e9194f67356a566177604cc

# Diff at Mon, 20 Jan 2025 11:09:47 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19825378
- current block number: 19825378

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825378 (main branch discovery), not current.

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc49Ec6Bb817E17a9Ca5B738ca330db403cc74245"
      issuedPermissions.0.to:
+        "0xc49Ec6Bb817E17a9Ca5B738ca330db403cc74245"
    }
```

Generated with discovered.json: 0xbc99c544c041bd987b8d15cc4a88f3775b34c172

# Diff at Mon, 21 Oct 2024 11:07:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19825378
- current block number: 19825378

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825378 (main branch discovery), not current.

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.2.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0xef968f08903be797a0aca5d870844606dcbeccdfc6dc2048760a3d2893df109b"
      values.$pastUpgrades.1.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.1.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0xe47b5e4556898d3425bf25bde5aed3073ed121e3d3fb5f0deb6a8924e2ad2845"
      values.$pastUpgrades.0.2:
+        ["0xe6785C3AfF4292C9d7c6b039f649672C45CAfFee","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x4b9b30e6E135d5e39345a03F381D9c704b2Af010","0x07228f73AA048f67893F4b966D1D09783EdD8764","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.0.1:
-        ["0xe6785C3AfF4292C9d7c6b039f649672C45CAfFee","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x4b9b30e6E135d5e39345a03F381D9c704b2Af010","0x07228f73AA048f67893F4b966D1D09783EdD8764","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x2e4c35995431d1de222814e766a3eb776fa77066848149094160572235bcba55"
    }
```

Generated with discovered.json: 0xd5761175f4aada9dc978af2802bc95edf2067cad

# Diff at Mon, 14 Oct 2024 10:53:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19825378
- current block number: 19825378

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825378 (main branch discovery), not current.

```diff
    contract Committee (0x1e601435E181423e7A8430813d7500012a6169cB) {
    +++ description: None
      sourceHashes:
+        ["0xbd4b616703456361720d7aaaa8a8d995f0efbd262e650ecd109f807107476380"]
    }
```

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: None
      sourceHashes:
+        ["0x2c95972415c771f5ef6d71449bae168597b6c35245fbe8769425e5c9c753e918","0xadae235d029868dddc287e823167705942660a99a9154a4e487f5dfb4ddd01c9","0x70e4767336d4a44ecedb78b7cef6dc2810f5d8bc87a46c360083e65af451cb97","0x75d386d73767f57d5f11c11f7bf837a48cd417754eea559931fc98a96ef34152","0x0e101cfdb791ca1a86402273377c7da5e67225cf5799ac2f51d9a940227ee6be","0x7d557870276c694154e12790f8c0c09930c8c75320f470c47b67968bffd536a6","0x2a703c051ff2524868f044282fc50b01913736a92f794b64b31bd31363cd3fca","0xd5b06286e3bf5dccd0bb360c8cc876aec0a2ce288120d9f83dec45fa47c1aabc"]
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

Generated with discovered.json: 0x18c728120589fa80aa049b3459d26fb2938215ce

# Diff at Tue, 01 Oct 2024 10:53:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825378
- current block number: 19825378

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825378 (main branch discovery), not current.

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-03T16:03:31.000Z",["0xe6785C3AfF4292C9d7c6b039f649672C45CAfFee","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x4b9b30e6E135d5e39345a03F381D9c704b2Af010","0x07228f73AA048f67893F4b966D1D09783EdD8764","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2022-09-01T12:47:25.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2023-03-21T09:58:35.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]]]
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x36196e5a191a8d39b3b65b86afc061f97b73a8bc

# Diff at Wed, 21 Aug 2024 10:04:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825378
- current block number: 19825378

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825378 (main branch discovery), not current.

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc49Ec6Bb817E17a9Ca5B738ca330db403cc74245","via":[]}]
    }
```

Generated with discovered.json: 0x2b8036c2369ffbe8483ab62cdf43daf6efee87fb

# Diff at Wed, 08 May 2024 12:36:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624868
- current block number: 19825378

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624868 (main branch discovery), not current.

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x1e601435E181423e7A8430813d7500012a6169cB"
+        ["0x1e601435E181423e7A8430813d7500012a6169cB"]
      values.getRegisteredVerifiers:
-        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
+        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
    }
```

Generated with discovered.json: 0xfb8d7562beb0fe5517082d3cc03af394f25f544e

# Diff at Wed, 10 Apr 2024 11:15:51 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 17039298
- current block number: 19624868

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17039298 (main branch discovery), not current.

```diff
    contract StarkExchange (0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x1e601435E181423e7A8430813d7500012a6169cB"]
+        "0x1e601435E181423e7A8430813d7500012a6169cB"
      values.getRegisteredVerifiers:
-        ["0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"]
+        "0x5339AB7557b3152b91A57D10B0Caf5da88Db5143"
    }
```

Generated with discovered.json: 0x640439e81ad77a8134dbc8fd6a153a004af2bb5a
