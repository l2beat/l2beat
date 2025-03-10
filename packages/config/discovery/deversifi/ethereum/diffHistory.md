Generated with discovered.json: 0x0bf04d67476f91cbddbc88ea64ddefdb51ac9442

# Diff at Thu, 06 Mar 2025 15:18:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21981331
- current block number: 21981331

## Description

### Update on 10 Mar 2025:

Rhino.fi upgrades their core contract to a simple withdraw contract that [transfered all funds to a multisig](https://etherscan.io/tx/0x9c1692398b107161c7af2c1c02316d449bdf03b15e84b69170373b2864dba754) (labeled Rhino.fi treasury on etherscan). The current app.rhino.fi frontend points to new onchain escrows which act as simple EOA bridge escrows.

On telegram their team promises a withdraw-only function to be deployed later today. We will keep the projects page up until we can link there.

### 06 Mar 2025 Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981331 (main branch discovery), not current.

```diff
    contract GpsFactRegistryAdapter (0x3b1298395290Bb7924F0Fcc176DECF3B4879FE73) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3174901404014912024702042974619036870715605532092680335571201877913899936957`).
      values.programHashMapped:
-        "3174901404014912024702042974619036870715605532092680335571201877913899936957"
+        "StarkEx Spot v4.0 (RhinoFi, Sorare)"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"15787695375210609250491147414005894154890873413229882671403677761527504080":"Starknet Aggregator (since v0.13.3)","2397984267054479079853548842566103781972463965746662494980785692480538410509":"StarkNet OS (Starknet)","853638403225561750106379562222782223909906501242604214771127703946595519856":"StarkNet OS (Paradex)","3383082961563516565935611087683915026448707331436034043529592588079494402084":"StarkNet OS (old Paradex, old StarkNet)","3485280386001712778192330279103973322645241679001461923469191557000342180556":"StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)","770346231394331402493200980986217737662224545740427952627288191358999988146":"ApeX-USDT","3174901404014912024702042974619036870715605532092680335571201877913899936957":"StarkEx Spot v4.0 (RhinoFi, Sorare)","16830627573509542901909952446321116535677491650708854009406762893086223513":"StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)","2530337539466159944237001094809327283009177793361359619481044346150483328860":"ApeX-USDC 20250130","3114724292040200590153042023978438629733352741898912919152162079752811928849":"StarkEx Perp v2.0 ApeX-USDC","217719352201300445998518619904782191262194843262573339166404641663770051805":"StarkNet (old)","3003515909324298587247571665454372831319437787162989623104387385306791861180":"StarkNet (old)","1161178844461337253856226043908368523817098764221830529880464854589141231910":"StarkNet Aggregator (old)","1921772108187713503530008849184725638117898887391063185252422808224349294626":"StarkNet (old)","3258367057337572248818716706664617507069572185152472699066582725377748079373":"StarkNet (old)","407700941260678649793204927710478760533239334662847444187959202896452163393":"StarkNet (old)","1865367024509426979036104162713508294334262484507712987283009063059134893433":"StarkNet (old)","54878256403880350656938046611252303365750679698042371543935159963667935317":"StarkNet (old)","2479841346739966073527450029179698923866252973805981504232089731754042431018":"StarkNet (old)","109586309220455887239200613090920758778188956576212125550190099009305121410":"StarkNet (old)"}}]
    }
```

Generated with discovered.json: 0xe953c279913af902a7ef54acde5c3400ad4ef411

# Diff at Wed, 05 Mar 2025 14:40:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e85261cbf7cfc5afeac755b44f9df82c8a3c4ba block: 20640703
- current block number: 21981331

## Description

discodrive sn stack and starkex chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640703 (main branch discovery), not current.

```diff
    contract DACommittee (0x28780349A33eEE56bb92241bAAB8095449e24306) {
    +++ description: Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 4.
      name:
-        "Committee"
+        "DACommittee"
      template:
+        "starkex/Committee"
      description:
+        "Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 4."
      fieldMeta:
+        {"constructorArgs":{"description":"Includes DAC members and threshold."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract GpsFactRegistryAdapter (0x3b1298395290Bb7924F0Fcc176DECF3B4879FE73) {
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
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: Helper contract for registering limit orders from L1.
      template:
+        "starkex/OrderRegistry"
      description:
+        "Helper contract for registering limit orders from L1."
    }
```

```diff
-   Status: DELETED
    contract DeversiFiTreasuryMultisig (0x520Cf70a2D0B3dfB7386A2Bc9F800321F62a5c3a)
    +++ description: None
```

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0xCCa5De1e10c05c50C51ac551D9182cd31aca1889","delay":259200,"via":[]}
      issuedPermissions.4:
+        {"permission":"operateStarknet","to":"0x8A6c80Aab6497E2DB35817817b593b79D78f6ae5","via":[]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0xCCa5De1e10c05c50C51ac551D9182cd31aca1889","description":"manage the token admin role.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0xb49e8CeD039CD6eC5881Beb29C4993031A6CcAC4","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0x8fDEC5EE435501571034A78a7F3AA167185969b3","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      values.OPERATORS:
-        ["0x8A6c80Aab6497E2DB35817817b593b79D78f6ae5"]
      values.operators:
+        ["0x8A6c80Aab6497E2DB35817817b593b79D78f6ae5"]
      values.tokenAdmins:
+        ["0x8fDEC5EE435501571034A78a7F3AA167185969b3","0xb49e8CeD039CD6eC5881Beb29C4993031A6CcAC4"]
      template:
+        "starkex/StarkExchangeOld"
      description:
+        "Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles."
      fieldMeta:
+        {"$admin":{"severity":"HIGH","description":"Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts."},"isFinalized":{"severity":"HIGH","description":"Finalizes most of the configuration of the contract, which cannot be changed afterwards (only thorugh an upgrade)."},"DEPOSIT_CANCEL_DELAY":{"description":"The time delay required before canceled deposits to the L2 can be reclaimed."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RhinofiAdminMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: None
      name:
-        "GovernanceMultisig"
+        "RhinofiAdminMultisig"
      description:
-        "This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge."
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b","delay":259200}
      receivedPermissions.1:
+        {"permission":"interact","from":"0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b","description":"manage the token admin role."}
      receivedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      fieldMeta:
-        {"getOwners":{"severity":"LOW","description":"Signers of the Multisig","type":"PERMISSION"},"getThreshold":{"severity":"HIGH","description":"Threshold of the Multisig","type":"PERMISSION"}}
      severity:
+        "HIGH"
    }
```

Generated with discovered.json: 0x096f62ec82f5b2c114ca38e4c1eb89268c0faf3f

# Diff at Tue, 04 Mar 2025 10:39:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20640703
- current block number: 20640703

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640703 (main branch discovery), not current.

```diff
    contract Committee (0x28780349A33eEE56bb92241bAAB8095449e24306) {
    +++ description: None
      sinceBlock:
+        11125447
    }
```

```diff
    contract GpsFactRegistryAdapter (0x3b1298395290Bb7924F0Fcc176DECF3B4879FE73) {
    +++ description: None
      sinceBlock:
+        17868827
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
    contract DeversiFiTreasuryMultisig (0x520Cf70a2D0B3dfB7386A2Bc9F800321F62a5c3a) {
    +++ description: None
      sinceBlock:
+        9125981
    }
```

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      sinceBlock:
+        10141009
    }
```

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      sinceBlock:
+        17188210
    }
```

Generated with discovered.json: 0xcf4dfa83635d7492a8e727a8609fad68ee0c2d1a

# Diff at Mon, 20 Jan 2025 11:09:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20640703
- current block number: 20640703

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640703 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCCa5De1e10c05c50C51ac551D9182cd31aca1889"
      issuedPermissions.0.to:
+        "0xCCa5De1e10c05c50C51ac551D9182cd31aca1889"
    }
```

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      receivedPermissions.0.target:
-        "0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b"
      receivedPermissions.0.from:
+        "0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b"
    }
```

Generated with discovered.json: 0x7425257eafa8808f2a9ef7c56d8b3b7f4dda9284

# Diff at Mon, 20 Jan 2025 09:24:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 20640703
- current block number: 20640703

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640703 (main branch discovery), not current.

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      fieldMeta.getOwners.type:
+        "PERMISSION"
      fieldMeta.getThreshold.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0x3fecf8693e8f367272c311041880c272398285bb

# Diff at Mon, 21 Oct 2024 12:43:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20640703
- current block number: 20640703

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640703 (main branch discovery), not current.

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      descriptions:
-        ["This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge."]
      description:
+        "This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge."
    }
```

Generated with discovered.json: 0x496ceb1508cd3a15b24a56bb4dec770960b7df9d

# Diff at Mon, 21 Oct 2024 11:05:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20640703
- current block number: 20640703

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640703 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      values.$pastUpgrades.16.2:
+        ["0x29Db022dbc824b78A0dA699a77E3d177f08A1191","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x5524cB52490e01CBa4EB64F230CC661780cB6298","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.16.1:
-        ["0x29Db022dbc824b78A0dA699a77E3d177f08A1191","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x5524cB52490e01CBa4EB64F230CC661780cB6298","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x4ed46e53b7228bbd7a377396a6dbb032beeb1296affd055462911dd323afa3f8"
      values.$pastUpgrades.15.2:
+        ["0xc392DD8edAd534266cbf2817ee01dC68193DE23d","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x654cEF88e1EDD4B5a6d10815439768c60ca109a1","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.15.1:
-        ["0xc392DD8edAd534266cbf2817ee01dC68193DE23d","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x654cEF88e1EDD4B5a6d10815439768c60ca109a1","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x7a7d7077267911d53481a49e72985aac941d7f1fde534926da902666729ce24d"
      values.$pastUpgrades.14.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.14.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x7c39229a92109c6dea7b9d16b8e0128d4316cede0fca1d7300cf5e49a508043d"
      values.$pastUpgrades.13.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.13.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x2581316c7e3de05782eb37313851dd4d61395c832bf4a4e24f3298c6161047d3"
      values.$pastUpgrades.12.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.12.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x202f69895d6438cdc5d2816418e9e57291a5d45446b54304bfcda28464e60887"
      values.$pastUpgrades.11.2:
+        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
      values.$pastUpgrades.11.1:
-        ["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]
+        "0x35440a57c7d3ff276dddadfb339dd5cf14353c95f8a68203e4fc128a09b8773d"
      values.$pastUpgrades.10.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.10.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x35440a57c7d3ff276dddadfb339dd5cf14353c95f8a68203e4fc128a09b8773d"
      values.$pastUpgrades.9.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.9.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x044173077b541f16085d2e55e145bdf4a0a7159ded50ae346d931c380e79e64d"
      values.$pastUpgrades.8.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.8.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x575752cbf39cd864a43bb8496414cf52cf265670d0de8af26b8b6d0470a8afec"
      values.$pastUpgrades.7.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.7.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x4e66dd5619e7acc4e878c68ab25350d41c38d4d2339a34a19dbdb5a40377dff8"
      values.$pastUpgrades.6.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.6.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x679e92bfb784e59895fd71b8803906ed7adb74cec288d66d41050ef4c0aaa3c4"
      values.$pastUpgrades.5.2:
+        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
      values.$pastUpgrades.5.1:
-        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
+        "0x0512cdb0c725a846ab22ecc1a19a023b62444816a860ecdcbd26afed1421dadd"
      values.$pastUpgrades.4.2:
+        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
      values.$pastUpgrades.4.1:
-        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
+        "0xd7add75484f4ae4c369be403c7c94a1b9589266fd3f44ecfa5f4522dd41dc727"
      values.$pastUpgrades.3.2:
+        ["0x7D2375a873CF858f02F97F40CbBBc03293f9A055","0x3Ba4D737e64b50d26dd594a7c5BcC0131E4C5d11","0xf677a1E6261e55C1f3C33D6C9FCf20b476D57713","0xb2B3c885C6E2D72E0bc28e944Ff3f67c236c7e69"]
      values.$pastUpgrades.3.1:
-        ["0x7D2375a873CF858f02F97F40CbBBc03293f9A055","0x3Ba4D737e64b50d26dd594a7c5BcC0131E4C5d11","0xf677a1E6261e55C1f3C33D6C9FCf20b476D57713","0xb2B3c885C6E2D72E0bc28e944Ff3f67c236c7e69"]
+        "0xdf3ea6ba0901e47d804e717046e1b1b9861e6082930c682aa0e300293c71b571"
      values.$pastUpgrades.2.2:
+        ["0x18a5452117714ccE0d8FaECeFDFdB4783140AF74","0x3Ba4D737e64b50d26dd594a7c5BcC0131E4C5d11","0xFD64579fbf48702B3Dbd4e5bb451ab29FDd588dD","0xb2B3c885C6E2D72E0bc28e944Ff3f67c236c7e69"]
      values.$pastUpgrades.2.1:
-        ["0x18a5452117714ccE0d8FaECeFDFdB4783140AF74","0x3Ba4D737e64b50d26dd594a7c5BcC0131E4C5d11","0xFD64579fbf48702B3Dbd4e5bb451ab29FDd588dD","0xb2B3c885C6E2D72E0bc28e944Ff3f67c236c7e69"]
+        "0x28e50d1e59f0a7dfa9fe177195bdc47eed90db11773d2ce4c34beaf277db8c5f"
      values.$pastUpgrades.1.2:
+        ["0x63A995cfB3Badabe007263917024369529BaF26f","0x3Ba4D737e64b50d26dd594a7c5BcC0131E4C5d11","0x2Bb72fc643c1AbaC80392b19D12c68027a944470","0xb2B3c885C6E2D72E0bc28e944Ff3f67c236c7e69"]
      values.$pastUpgrades.1.1:
-        ["0x63A995cfB3Badabe007263917024369529BaF26f","0x3Ba4D737e64b50d26dd594a7c5BcC0131E4C5d11","0x2Bb72fc643c1AbaC80392b19D12c68027a944470","0xb2B3c885C6E2D72E0bc28e944Ff3f67c236c7e69"]
+        "0xaa2d2b00a0c72056946b6c0e7e656602ded829fda99e4506c78bb6569ac55eba"
      values.$pastUpgrades.0.2:
+        ["0xab4cB335Bc7eE587Ebc07c2445Dc2807bEBE973e"]
      values.$pastUpgrades.0.1:
-        ["0xab4cB335Bc7eE587Ebc07c2445Dc2807bEBE973e"]
+        "0x717f978da7127c0340327351275f626c281515e116e0e9d8d62236cf651f4653"
    }
```

Generated with discovered.json: 0xe0988fdd6989c21b01a27b944407bd8b2490446b

# Diff at Mon, 14 Oct 2024 10:50:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20640703
- current block number: 20640703

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640703 (main branch discovery), not current.

```diff
    contract Committee (0x28780349A33eEE56bb92241bAAB8095449e24306) {
    +++ description: None
      sourceHashes:
+        ["0x83a4f7af4e5a371aadb57903aed1b1f96556a0b3eb4665044a65ad8f70a89edc"]
    }
```

```diff
    contract GpsFactRegistryAdapter (0x3b1298395290Bb7924F0Fcc176DECF3B4879FE73) {
    +++ description: None
      sourceHashes:
+        ["0x3c0fff412189244728e9be021e2c7a1084326cc80e71f930221094909caafec0"]
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
    contract DeversiFiTreasuryMultisig (0x520Cf70a2D0B3dfB7386A2Bc9F800321F62a5c3a) {
    +++ description: None
      sourceHashes:
+        ["0x379cacebf61f1aa488b2a43b02fff3f8d7835d9dca8f342a13570553219e6e8c"]
    }
```

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      sourceHashes:
+        ["0x46eae4f2e7b6b0f5096ba403f113ff3c86205368a36af081ab280441d64942fc","0xa6841fa395d89b246e6ab746f0501d13a8c570e1c9fa282241c39b48c738067c","0x70e4767336d4a44ecedb78b7cef6dc2810f5d8bc87a46c360083e65af451cb97","0x86d6fa45382a22e80ccfc3c25098fbb8d33ef8ae32da21e4fe8257f0caf8c114","0x0e101cfdb791ca1a86402273377c7da5e67225cf5799ac2f51d9a940227ee6be","0x7d557870276c694154e12790f8c0c09930c8c75320f470c47b67968bffd536a6","0x2a703c051ff2524868f044282fc50b01913736a92f794b64b31bd31363cd3fca","0xd5b06286e3bf5dccd0bb360c8cc876aec0a2ce288120d9f83dec45fa47c1aabc"]
    }
```

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x892b57a5c51efa33135fb2afe99b1b125aa235fd

# Diff at Tue, 01 Oct 2024 10:50:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20640703
- current block number: 20640703

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640703 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2020-05-26T11:16:50.000Z",["0xab4cB335Bc7eE587Ebc07c2445Dc2807bEBE973e"]],["2020-12-02T07:18:47.000Z",["0x63A995cfB3Badabe007263917024369529BaF26f","0x3Ba4D737e64b50d26dd594a7c5BcC0131E4C5d11","0x2Bb72fc643c1AbaC80392b19D12c68027a944470","0xb2B3c885C6E2D72E0bc28e944Ff3f67c236c7e69"]],["2021-01-04T07:16:37.000Z",["0x18a5452117714ccE0d8FaECeFDFdB4783140AF74","0x3Ba4D737e64b50d26dd594a7c5BcC0131E4C5d11","0xFD64579fbf48702B3Dbd4e5bb451ab29FDd588dD","0xb2B3c885C6E2D72E0bc28e944Ff3f67c236c7e69"]],["2021-01-21T07:40:38.000Z",["0x7D2375a873CF858f02F97F40CbBBc03293f9A055","0x3Ba4D737e64b50d26dd594a7c5BcC0131E4C5d11","0xf677a1E6261e55C1f3C33D6C9FCf20b476D57713","0xb2B3c885C6E2D72E0bc28e944Ff3f67c236c7e69"]],["2021-08-18T07:47:40.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2021-09-09T13:16:44.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2021-12-15T08:08:11.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2022-01-04T12:03:18.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2022-02-02T15:39:33.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2023-07-26T15:11:11.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2023-08-08T08:32:11.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2023-08-08T08:32:11.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2023-08-10T07:28:59.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2023-08-13T15:01:59.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2024-03-25T15:35:47.000Z",["0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2024-03-28T20:37:47.000Z",["0xc392DD8edAd534266cbf2817ee01dC68193DE23d","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x654cEF88e1EDD4B5a6d10815439768c60ca109a1","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]],["2024-08-26T15:52:35.000Z",["0x29Db022dbc824b78A0dA699a77E3d177f08A1191","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x5524cB52490e01CBa4EB64F230CC661780cB6298","0x67e198743BC19fa4757720eDd0e769f8291e1F1D","0x613ee54C54D5548627064B4D648942bF3648f376","0xb2ED005D0278179001a49a9969BB22BA8e98f31F","0xB5353268d8d4D711a92cb838F8fEDFC2A66E50Db"]]]
      values.$upgradeCount:
+        17
    }
```

Generated with discovered.json: 0xf262a64a3850dbfb866758c225175dd7ba5b3789

# Diff at Fri, 30 Aug 2024 10:09:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@78fe1115153efe3e1ba2014fd74329156dca3951 block: 20633317
- current block number: 20640703

## Description

Admin EOA removed after our ping.

## Watched changes

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xCCa5De1e10c05c50C51ac551D9182cd31aca1889","via":[]}
      issuedPermissions.0.target:
-        "0x3a74010f2b37C02A249bd539EaE6b90Ba7CcD8aA"
+        "0xCCa5De1e10c05c50C51ac551D9182cd31aca1889"
      values.$admin:
-        ["0x3a74010f2b37C02A249bd539EaE6b90Ba7CcD8aA","0xCCa5De1e10c05c50C51ac551D9182cd31aca1889"]
+        "0xCCa5De1e10c05c50C51ac551D9182cd31aca1889"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20633317 (main branch discovery), not current.

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xd3cb0c967e7f0f853d636259b32a7bdf6de9801d

# Diff at Thu, 29 Aug 2024 09:22:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae2eef5fb76c32f2e57d2f78a8a0f4686592fe8b block: 19825372
- current block number: 20633317

## Description

This minor upgrade of StarkExchange.sol and TokensAndRamping.sol adds the ability to withdraw even for blocklisted owner keys after a CLEARANCE_DELAY hardcoded to 2 weeks. This can only be done by the BlockAdmin (hardcoded to DeversiFiTreasuryMultisig).

Furthermore two signers of the GovernanceMultisig are rotated.

A redWarning is added due to EOA Admin (was missed in the past).

## Watched changes

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      values.$implementation.2:
-        "0x654cEF88e1EDD4B5a6d10815439768c60ca109a1"
+        "0x5524cB52490e01CBa4EB64F230CC661780cB6298"
      values.$implementation.0:
-        "0xc392DD8edAd534266cbf2817ee01dC68193DE23d"
+        "0x29Db022dbc824b78A0dA699a77E3d177f08A1191"
      values.implementation:
-        "0xc392DD8edAd534266cbf2817ee01dC68193DE23d"
+        "0x29Db022dbc824b78A0dA699a77E3d177f08A1191"
      values.VERSION:
-        "4.5.2-bl"
+        "4.5.3-blc"
    }
```

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      values.$members.5:
-        "0xe0fE5b38C52A83308bEC9242d768441025DBB4D8"
+        "0x8501cFEE1715F5BC771cC65997F2A655f234e9Ef"
      values.$members.0:
-        "0x94aa58E38ac22518Cf0E267cd062Ed7E78eA958E"
+        "0x6Db55792263D558d9c98B740f8cB5E8a2e02Ec05"
    }
```

## Source code changes

```diff
.../StarkExchange/StarkExchange.1.sol              | 16 ++--
 .../StarkExchange/TokensAndRamping.3.sol           | 88 ++++++++++++++++++++--
 2 files changed, 89 insertions(+), 15 deletions(-)
```

Generated with discovered.json: 0x7b68025e5a9b3890af9387a25144eda5f8e9ec59

# Diff at Wed, 21 Aug 2024 10:02:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825372
- current block number: 19825372

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825372 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3a74010f2b37C02A249bd539EaE6b90Ba7CcD8aA","via":[]},{"permission":"upgrade","target":"0xCCa5De1e10c05c50C51ac551D9182cd31aca1889","via":[]}]
    }
```

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      assignedPermissions:
-        {"upgrade":["0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b","via":[]}]
    }
```

Generated with discovered.json: 0x178744cd356eb31e7b50a829cd9c0849148680ce

# Diff at Fri, 09 Aug 2024 10:09:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19825372
- current block number: 19825372

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825372 (main branch discovery), not current.

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      assignedPermissions.admin:
-        ["0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b"]
      assignedPermissions.upgrade:
+        ["0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b"]
      values.$multisigThreshold:
-        "4 of 6 (67%)"
+++ description: Signers of the Multisig
+++ severity: LOW
      values.getOwners:
-        ["0x94aa58E38ac22518Cf0E267cd062Ed7E78eA958E","0x478615F37FcCB0DF69C191a8674233f6899D092e","0x0fa6bf3377Cfa276d9d7122c09C187e5e8ef1C59","0x611F96c83fE0A30B504Ee2C6a2Cae890e620bA35","0x445EEDE2681116Dd94C8D5Bfab73283B3ef1f6f3","0xe0fE5b38C52A83308bEC9242d768441025DBB4D8"]
+++ description: Threshold of the Multisig
+++ severity: HIGH
      values.getThreshold:
-        4
      values.$members:
+        ["0x94aa58E38ac22518Cf0E267cd062Ed7E78eA958E","0x478615F37FcCB0DF69C191a8674233f6899D092e","0x0fa6bf3377Cfa276d9d7122c09C187e5e8ef1C59","0x611F96c83fE0A30B504Ee2C6a2Cae890e620bA35","0x445EEDE2681116Dd94C8D5Bfab73283B3ef1f6f3","0xe0fE5b38C52A83308bEC9242d768441025DBB4D8"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x83ca8c055d1a8555877725d7e9f5fec6a1553ed7

# Diff at Tue, 30 Jul 2024 11:11:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 19825372
- current block number: 19825372

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825372 (main branch discovery), not current.

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      fieldMeta:
+        {"getOwners":{"severity":"LOW","description":"Signers of the Multisig"},"getThreshold":{"severity":"HIGH","description":"Threshold of the Multisig"}}
    }
```

Generated with discovered.json: 0xffb7fd8ba83b7d701327b0733f3f80e093661103

# Diff at Thu, 18 Jul 2024 10:30:41 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19825372
- current block number: 19825372

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825372 (main branch discovery), not current.

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      assignedPermissions:
+        {"admin":["0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b"]}
    }
```

Generated with discovered.json: 0x694214ed17ed4f9ea12cd7d368bd65206c17ad4a

# Diff at Wed, 08 May 2024 12:34:48 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19633312
- current block number: 19825372

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19633312 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x28780349A33eEE56bb92241bAAB8095449e24306"
+        ["0x28780349A33eEE56bb92241bAAB8095449e24306"]
      values.getRegisteredVerifiers:
-        "0x3b1298395290Bb7924F0Fcc176DECF3B4879FE73"
+        ["0x3b1298395290Bb7924F0Fcc176DECF3B4879FE73"]
    }
```

Generated with discovered.json: 0x0d1e449278ed05d1d56565abc9e7ab02753d7344

# Diff at Thu, 11 Apr 2024 15:36:59 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cc71817cfbb5ff597a4f1c538bce1e61b485c754 block: 19531530
- current block number: 19633312

## Description

### Blocklist added

- This implementation upgrade (Starkexchange.sol^4.5.2-bl and TokensAndRamping.sol^2024_3) adds support for a Blocklist that can be managed by the BlockAdmin. The BlockAdmin can block and unblock addresses from withdraw()ing funds on L1. The BlockAdmin is hardcoded to the deversifi Treasury Multisig `0x520Cf70a2D0B3dfB7386A2Bc9F800321F62a5c3a` and cannot be changed.
- Imports now get pulled from a folder structure but logic stays the same. (reason for the small diffs all over the place)

## Watched changes

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      upgradeability.implementation:
-        "0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583"
+        "0xc392DD8edAd534266cbf2817ee01dC68193DE23d"
      upgradeability.facets.StarkWare_TokensAndRamping_2022_2:
-        "0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb"
      upgradeability.facets.StarkWare_TokensAndRamping_2024_3:
+        "0x654cEF88e1EDD4B5a6d10815439768c60ca109a1"
      implementations.2:
-        "0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb"
+        "0x654cEF88e1EDD4B5a6d10815439768c60ca109a1"
      implementations.0:
-        "0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583"
+        "0xc392DD8edAd534266cbf2817ee01dC68193DE23d"
      values.implementation:
-        "0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583"
+        "0xc392DD8edAd534266cbf2817ee01dC68193DE23d"
      values.VERSION:
-        "4.5.1"
+        "4.5.2-bl"
    }
```

## Source code changes

```diff
.../StarkExchange/implementation-1/meta.txt        |  2 +-
 .../src/components}/GovernanceStorage.sol          |  4 +-
 .../contracts/src/components}/MainStorage.sol      | 11 ++++--
 .../contracts/src/interfaces}/BlockDirectCall.sol  |  2 +-
 .../contracts/src/interfaces}/IDispatcherBase.sol  |  2 +-
 .../contracts/src/interfaces}/Identity.sol         |  2 +-
 .../contracts/src/interfaces}/MGovernance.sol      |  2 +-
 .../contracts/src/interfaces}/MainDispatcher.sol   |  6 +--
 .../src/interfaces}/MainDispatcherBase.sol         | 10 ++---
 .../contracts/src/interfaces}/SubContractor.sol    |  4 +-
 .../contracts/src/libraries}/Common.sol            |  2 +-
 .../contracts/src/starkex}/StarkExchange.sol       | 18 ++++-----
 .../contracts/src/upgrade}/ProxyStorage.sol        |  4 +-
 .../StarkExchange/implementation-3/meta.txt        |  2 +-
 .../contracts/src/components}/ActionHash.sol       |  6 +--
 .../contracts/src/components}/ERC1155Receiver.sol  |  4 +-
 .../contracts/src/components}/ERC721Receiver.sol   |  4 +-
 .../contracts/src/components}/Freezable.sol        | 10 ++---
 .../contracts/src/components}/Governance.sol       |  4 +-
 .../src/components}/GovernanceStorage.sol          |  4 +-
 .../contracts/src/components}/KeyGetters.sol       |  6 +--
 .../contracts/src/components}/MainGovernance.sol   |  6 +--
 .../contracts/src/components}/MainStorage.sol      | 11 ++++--
 .../contracts/src/components}/TokenRegister.sol    | 12 +++---
 .../contracts/src/components}/TokenTransfers.sol   | 14 +++----
 .../src/interactions}/AcceptModifications.sol      | 10 ++---
 .../contracts/src/interactions/Blocklist.sol       | 40 +++++++++++++++++++
 .../contracts/src/interactions}/Deposits.sol       | 20 +++++-----
 .../contracts/src/interactions}/TokenAssetData.sol | 10 ++---
 .../src/interactions}/TokenQuantization.sol        |  6 +--
 .../contracts/src/interactions}/Withdrawals.sol    | 26 +++++++------
 .../contracts/src/interfaces}/Identity.sol         |  2 +-
 .../src/interfaces}/MAcceptModifications.sol       |  2 +-
 .../contracts/src/interfaces/MBlocklist.sol        | 45 ++++++++++++++++++++++
 .../contracts/src/interfaces}/MDeposits.sol        |  2 +-
 .../contracts/src/interfaces}/MFreezable.sol       |  2 +-
 .../contracts/src/interfaces}/MGovernance.sol      |  2 +-
 .../contracts/src/interfaces}/MKeyGetters.sol      |  2 +-
 .../contracts/src/interfaces}/MTokenAssetData.sol  |  2 +-
 .../src/interfaces}/MTokenQuantization.sol         |  2 +-
 .../contracts/src/interfaces}/MTokenTransfers.sol  |  2 +-
 .../contracts/src/interfaces}/SubContractor.sol    |  4 +-
 .../contracts/src/libraries}/Common.sol            |  2 +-
 .../contracts/src/libraries}/LibConstants.sol      |  2 +-
 .../src/starkex/components}/StarkExStorage.sol     |  4 +-
 .../interactions}/StarkExForcedActionState.sol     |  8 ++--
 .../interfaces}/MStarkExForcedActionState.sol      |  2 +-
 .../toplevel_subcontracts}/TokensAndRamping.sol    | 39 ++++++++++---------
 .../contracts/src/tokens/ERC1155}/IERC1155.sol     |  2 +-
 .../src/tokens/ERC1155}/IERC1155Receiver.sol       |  2 +-
 .../contracts/src/tokens/ERC20}/IERC20.sol         |  2 +-
 .../src/tokens/ERC721}/IERC721Receiver.sol         |  2 +-
 .../contracts/src/upgrade}/ProxyStorage.sol        |  4 +-
 53 files changed, 248 insertions(+), 152 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531530 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x28780349A33eEE56bb92241bAAB8095449e24306"]
+        "0x28780349A33eEE56bb92241bAAB8095449e24306"
      values.getRegisteredVerifiers:
-        ["0x3b1298395290Bb7924F0Fcc176DECF3B4879FE73"]
+        "0x3b1298395290Bb7924F0Fcc176DECF3B4879FE73"
    }
```

```diff
+   Status: CREATED
    contract DeversiFiTreasuryMultisig (0x520Cf70a2D0B3dfB7386A2Bc9F800321F62a5c3a)
    +++ description: None
```

Generated with discovered.json: 0x4b6fe18ad8f293504a0a33f9c42978bb3a90f0b0

# Diff at Thu, 28 Mar 2024 08:50:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19512697
- current block number: 19531530

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19512697 (main branch discovery), not current.

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0xa8a01225c5752db0370ec77705d39bcb620fa9a0

# Diff at Mon, 25 Mar 2024 16:34:55 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e6ff14fa637ed6c3a674ff43e070f1cf65f4aa1e block: 19485578
- current block number: 19512697

## Description

The upgrade delay of the StarkExchange escrow is reduced from 14 to 3 days. This is the delay after which the Governors can upgrade the implementation.

## Watched changes

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      upgradeability.upgradeDelay:
-        1209600
+        259200
    }
```

Generated with discovered.json: 0xa561735c000067bf6baa50f29262ba681f1a87f8

# Diff at Thu, 21 Mar 2024 21:03:02 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@173befb1ef4ba15605c92f5f89227f2ffd2af3eb block: 19481771
- current block number: 19485578

## Description

Remove three signers and raise threshold. The gov multisig is now 4/6.

## Watched changes

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.8:
-        "0x0405107a60391Eb51821be373ff978115Ee58488"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.7:
-        "0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.6:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+++ description: Threshold of the Multisig
+++ type: PERMISSION
+++ severity: HIGH
      values.getThreshold:
-        2
+        4
    }
```

Generated with discovered.json: 0x18bf4f662d02fa88c9f4ffe7a437d3a8cb716f2a

# Diff at Thu, 21 Mar 2024 08:12:23 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@fae0f54992a5b56e7393c77915df2eef2a6dd0bf block: 17968886
- current block number: 19481771

## Description

Add 6 signers to the Governance Multisig, which is now 2/9.

## Watched changes

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.8:
+        "0x0405107a60391Eb51821be373ff978115Ee58488"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.7:
+        "0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.6:
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.5:
+        "0xe0fE5b38C52A83308bEC9242d768441025DBB4D8"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.4:
+        "0x445EEDE2681116Dd94C8D5Bfab73283B3ef1f6f3"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.3:
+        "0x611F96c83fE0A30B504Ee2C6a2Cae890e620bA35"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.2:
-        "0x0405107a60391Eb51821be373ff978115Ee58488"
+        "0x0fa6bf3377Cfa276d9d7122c09C187e5e8ef1C59"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.1:
-        "0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"
+        "0x478615F37FcCB0DF69C191a8674233f6899D092e"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.0:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x94aa58E38ac22518Cf0E267cd062Ed7E78eA958E"
    }
```

Generated with discovered.json: 0x2b4f4061348e353e029e23053815e06089f74a92
