Generated with discovered.json: 0xf56d0a6a1f34ce5332c84ffc90345031e988ab7e

# Diff at Tue, 11 Mar 2025 16:09:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b567159bfa1d1fb03ba2dbc6915b5acc47e00c0 block: 21981156
- current block number: 21981156

## Description

config: starknet/ex operator role description updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981156 (main branch discovery), not current.

```diff
    contract undefined (0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6) {
    +++ description: None
      receivedPermissions.0.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

```diff
    contract undefined (0x63881ac44293E22F3c3183a0C4113586ABb3e653) {
    +++ description: None
      receivedPermissions.0.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.7.permission:
-        "operateStarknet"
+        "operateStarkEx"
      issuedPermissions.6.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

Generated with discovered.json: 0x05734b41eaf16f17e62c200acf0bdc95eee8cc0c

# Diff at Thu, 06 Mar 2025 15:20:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21981156
- current block number: 21981156

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981156 (main branch discovery), not current.

```diff
    contract GpsFactRegistryAdapter (0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3174901404014912024702042974619036870715605532092680335571201877913899936957`).
      values.programHashMapped:
-        "3174901404014912024702042974619036870715605532092680335571201877913899936957"
+        "StarkEx Spot v4.0 (RhinoFi, Sorare)"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"15787695375210609250491147414005894154890873413229882671403677761527504080":"Starknet Aggregator (since v0.13.3)","2397984267054479079853548842566103781972463965746662494980785692480538410509":"StarkNet OS (Starknet)","853638403225561750106379562222782223909906501242604214771127703946595519856":"StarkNet OS (Paradex)","3383082961563516565935611087683915026448707331436034043529592588079494402084":"StarkNet OS (old Paradex, old StarkNet)","3485280386001712778192330279103973322645241679001461923469191557000342180556":"StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)","770346231394331402493200980986217737662224545740427952627288191358999988146":"ApeX-USDT","3174901404014912024702042974619036870715605532092680335571201877913899936957":"StarkEx Spot v4.0 (RhinoFi, Sorare)","16830627573509542901909952446321116535677491650708854009406762893086223513":"StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)","2530337539466159944237001094809327283009177793361359619481044346150483328860":"ApeX-USDC 20250130","3114724292040200590153042023978438629733352741898912919152162079752811928849":"StarkEx Perp v2.0 ApeX-USDC","217719352201300445998518619904782191262194843262573339166404641663770051805":"StarkNet (old)","3003515909324298587247571665454372831319437787162989623104387385306791861180":"StarkNet (old)","1161178844461337253856226043908368523817098764221830529880464854589141231910":"StarkNet Aggregator (old)","1921772108187713503530008849184725638117898887391063185252422808224349294626":"StarkNet (old)","3258367057337572248818716706664617507069572185152472699066582725377748079373":"StarkNet (old)","407700941260678649793204927710478760533239334662847444187959202896452163393":"StarkNet (old)","1865367024509426979036104162713508294334262484507712987283009063059134893433":"StarkNet (old)","54878256403880350656938046611252303365750679698042371543935159963667935317":"StarkNet (old)","2479841346739966073527450029179698923866252973805981504232089731754042431018":"StarkNet (old)","109586309220455887239200613090920758778188956576212125550190099009305121410":"StarkNet (old)"}}]
    }
```

Generated with discovered.json: 0xb53fb2e7bc77c2fd7775a69ba0588b477507df91

# Diff at Wed, 05 Mar 2025 14:06:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e85261cbf7cfc5afeac755b44f9df82c8a3c4ba block: 19825381
- current block number: 21981156

## Description

discodrive sn stack and starkex chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

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
    contract DACommittee (0x879cD57975d596004863D30c59d579ef78BBbe32) {
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
    contract GpsFactRegistryAdapter (0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3174901404014912024702042974619036870715605532092680335571201877913899936957`).
      values.programHashMapped:
+        "3174901404014912024702042974619036870715605532092680335571201877913899936957"
      template:
+        "starkex/GpsFactRegistryAdapter"
      description:
+        "Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3174901404014912024702042974619036870715605532092680335571201877913899936957`)."
    }
```

```diff
    contract SorareAdminMultisig (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "SorareAdminMultisig"
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0xF5C9F957705bea56a7e806943f98F7777B995826","delay":1209600}
      receivedPermissions.1:
+        {"permission":"interact","from":"0xF5C9F957705bea56a7e806943f98F7777B995826","description":"manage the token admin role."}
      receivedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      severity:
+        "HIGH"
    }
```

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.9:
+        {"permission":"upgrade","to":"0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B","delay":1209600,"via":[]}
      issuedPermissions.8:
+        {"permission":"upgrade","to":"0x5918481F777dBe437De249492B90AffB4e655de4","delay":1209600,"via":[]}
      issuedPermissions.7:
+        {"permission":"operateStarknet","to":"0x63881ac44293E22F3c3183a0C4113586ABb3e653","via":[]}
      issuedPermissions.6:
+        {"permission":"operateStarknet","to":"0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6","via":[]}
      issuedPermissions.5:
+        {"permission":"interact","to":"0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B","description":"manage the token admin role.","via":[]}
      issuedPermissions.4:
+        {"permission":"interact","to":"0xA5dAd8339d9279c2F16d02F2e903AB4B79a72815","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0x7F6d06eCd94bD899872cd2768e41B7d33EC13e19","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0x5918481F777dBe437De249492B90AffB4e655de4","description":"manage the token admin role.","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "governStarknet"
      issuedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      values.OPERATORS:
-        ["0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6","0x63881ac44293E22F3c3183a0C4113586ABb3e653"]
      values.operators:
+        ["0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6","0x63881ac44293E22F3c3183a0C4113586ABb3e653"]
      values.tokenAdmins:
+        ["0xA5dAd8339d9279c2F16d02F2e903AB4B79a72815","0x7F6d06eCd94bD899872cd2768e41B7d33EC13e19"]
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

Generated with discovered.json: 0x47f3d91bd805df050a6434bd478d9051a72f3720

# Diff at Tue, 04 Mar 2025 10:40:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: None
      sinceBlock:
+        12831566
    }
```

```diff
    contract Committee (0x879cD57975d596004863D30c59d579ef78BBbe32) {
    +++ description: None
      sinceBlock:
+        13165081
    }
```

```diff
    contract GpsFactRegistryAdapter (0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1) {
    +++ description: None
      sinceBlock:
+        16818452
    }
```

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      sinceBlock:
+        16834095
    }
```

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      sinceBlock:
+        12831579
    }
```

Generated with discovered.json: 0x5a2880ad682fcca5e0a4afd7d85a3dbd50a256e9

# Diff at Mon, 20 Jan 2025 11:10:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19825381
- current block number: 19825381

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xF5C9F957705bea56a7e806943f98F7777B995826"
      receivedPermissions.0.from:
+        "0xF5C9F957705bea56a7e806943f98F7777B995826"
    }
```

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      issuedPermissions.1.target:
-        "0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B"
      issuedPermissions.1.to:
+        "0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B"
      issuedPermissions.0.target:
-        "0x5918481F777dBe437De249492B90AffB4e655de4"
      issuedPermissions.0.to:
+        "0x5918481F777dBe437De249492B90AffB4e655de4"
    }
```

Generated with discovered.json: 0x80f724bf090f36244560d33d99e9ada1ee9f4817

# Diff at Mon, 21 Oct 2024 11:10:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      values.$pastUpgrades.10.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.10.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0xc8cd48c9ba8aeff7d0832707ffd07829cfa03e32108f69184b12d3f4dfce9506"
      values.$pastUpgrades.9.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.9.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x20e32fd5434e9ff5fb030bd6a42d62a0827d0692600cb084f294bf9534e764b0"
      values.$pastUpgrades.8.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.8.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x451e60d8e7c176588763097ad90ac39b74379fa15b66a9e82b17c8876e726c9b"
      values.$pastUpgrades.7.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.7.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x1e3c7e7455b03587bf7358f91df9c0180a46fdca04e7319e92cd7be93006da90"
      values.$pastUpgrades.6.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.6.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x1f43e53b394f1fa8ea3c70d941c07ede120baecc024aff03b39b401977a83814"
      values.$pastUpgrades.5.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.5.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x823a4f9509effa14b4560117a1bae7348d352f1a6cde174aa8117af85aa238ba"
      values.$pastUpgrades.4.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.4.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0xcd456864796a62ff92d2edd58c10165b4a90d29539f16696ba96f3fd87de7960"
      values.$pastUpgrades.3.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.3.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x0beae1d64f579787e365d3a33dfe2d88b2e5bc10df71c8c411d8e5ea9c268401"
      values.$pastUpgrades.2.2:
+        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
      values.$pastUpgrades.2.1:
-        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
+        "0x142bdcaf57cdb74a2828011c3b5d066b9ef73210eca9538c43cb27e70c16e6af"
      values.$pastUpgrades.1.2:
+        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
      values.$pastUpgrades.1.1:
-        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
+        "0x9285c2e269ca580e3c078f6e7aa2f4e87c367a34ed2d51c81fa2dbf96fabd25e"
      values.$pastUpgrades.0.2:
+        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
      values.$pastUpgrades.0.1:
-        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
+        "0xe2ec50ba9067943e14a3c85524aba01510bcdb20170a83b1e2835dd5f701774d"
    }
```

Generated with discovered.json: 0xb70ce90e9d446b3e8772f4012c8c82318e131f49

# Diff at Mon, 14 Oct 2024 10:56:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: None
      sourceHashes:
+        ["0x1e28fda3c245bc1fc13d0ddc7b108be510d1e0220fc67552921c87724bb45a4c"]
    }
```

```diff
    contract Committee (0x879cD57975d596004863D30c59d579ef78BBbe32) {
    +++ description: None
      sourceHashes:
+        ["0xbd4b616703456361720d7aaaa8a8d995f0efbd262e650ecd109f807107476380"]
    }
```

```diff
    contract GpsFactRegistryAdapter (0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1) {
    +++ description: None
      sourceHashes:
+        ["0x3c0fff412189244728e9be021e2c7a1084326cc80e71f930221094909caafec0"]
    }
```

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      sourceHashes:
+        ["0x945d79fba7fe6f3e3e40f582b69b67983dbd63977e2fce47328aa12e16175fd7","0xadae235d029868dddc287e823167705942660a99a9154a4e487f5dfb4ddd01c9","0x70e4767336d4a44ecedb78b7cef6dc2810f5d8bc87a46c360083e65af451cb97","0x75d386d73767f57d5f11c11f7bf837a48cd417754eea559931fc98a96ef34152","0x0e101cfdb791ca1a86402273377c7da5e67225cf5799ac2f51d9a940227ee6be","0x7d557870276c694154e12790f8c0c09930c8c75320f470c47b67968bffd536a6","0x2a703c051ff2524868f044282fc50b01913736a92f794b64b31bd31363cd3fca","0xd5b06286e3bf5dccd0bb360c8cc876aec0a2ce288120d9f83dec45fa47c1aabc"]
    }
```

Generated with discovered.json: 0x16cf6d4855daeaf39b3d88cbd4c4fe416093489b

# Diff at Tue, 01 Oct 2024 10:55:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-07-15T12:35:27.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2021-09-05T10:29:04.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2021-09-05T21:56:06.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2021-12-06T14:14:16.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2021-12-19T09:58:01.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2022-01-05T20:34:03.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2022-09-08T22:38:37.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2023-03-13T09:40:23.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2023-03-13T11:06:35.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2023-03-15T11:55:47.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2023-04-09T08:13:35.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]]]
      values.$upgradeCount:
+        11
    }
```

Generated with discovered.json: 0x3176c16108faf976af48414d7ea20a898ca14509

# Diff at Fri, 30 Aug 2024 08:01:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xe2c0ead4c004895b10243ab9c395650acc346721

# Diff at Wed, 21 Aug 2024 10:05:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xF5C9F957705bea56a7e806943f98F7777B995826"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xF5C9F957705bea56a7e806943f98F7777B995826","via":[]}]
    }
```

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5918481F777dBe437De249492B90AffB4e655de4","via":[]},{"permission":"upgrade","target":"0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B","via":[]}]
    }
```

Generated with discovered.json: 0xe5ece2e9f5ffb282153154a14ce8ec8b44dfdc3c

# Diff at Fri, 09 Aug 2024 10:12:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xF5C9F957705bea56a7e806943f98F7777B995826"]
      assignedPermissions.upgrade:
+        ["0xF5C9F957705bea56a7e806943f98F7777B995826"]
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x0405107a60391Eb51821be373ff978115Ee58488","0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8","0x59232aC80E6d403b6381393e52f4665ECA328558"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x0405107a60391Eb51821be373ff978115Ee58488","0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8","0x59232aC80E6d403b6381393e52f4665ECA328558"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x5997a7007bc82890b897625d799a049dfc967bbc

# Diff at Thu, 18 Jul 2024 10:33:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      assignedPermissions:
+        {"admin":["0xF5C9F957705bea56a7e806943f98F7777B995826"]}
    }
```

Generated with discovered.json: 0xe1e57471108cba8fef54c3e5b37e123b2f2601ae

# Diff at Wed, 08 May 2024 12:36:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624875
- current block number: 19825381

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624875 (main branch discovery), not current.

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x879cD57975d596004863D30c59d579ef78BBbe32"
+        ["0x879cD57975d596004863D30c59d579ef78BBbe32"]
      values.getRegisteredVerifiers:
-        "0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"
+        ["0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"]
    }
```

Generated with discovered.json: 0x8802eb4ba9b21d4d40b220a280fa7f5d41020b63

# Diff at Wed, 10 Apr 2024 11:17:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19532199
- current block number: 19624875

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532199 (main branch discovery), not current.

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x879cD57975d596004863D30c59d579ef78BBbe32"]
+        "0x879cD57975d596004863D30c59d579ef78BBbe32"
      values.getRegisteredVerifiers:
-        ["0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"]
+        "0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"
    }
```

Generated with discovered.json: 0xe8d8e3d4b8d168bfd406a7b9c31e4c9230626381

# Diff at Thu, 28 Mar 2024 11:06:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 17412704
- current block number: 19532199

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17412704 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x67d53290cfc3cda8c8abe277975b804ba4a48718
