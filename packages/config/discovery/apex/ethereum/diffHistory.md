Generated with discovered.json: 0x8846183834460efea98f88f83e68c7c5e23344c1

# Diff at Thu, 06 Mar 2025 15:18:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21981180
- current block number: 21981180

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981180 (main branch discovery), not current.

```diff
    contract FinalizableGpsFactAdapterUSDT (0x40e1e5Ece49A878062fA9F87eA6dc81281098B22) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`770346231394331402493200980986217737662224545740427952627288191358999988146`).
      values.programHashMapped:
-        "770346231394331402493200980986217737662224545740427952627288191358999988146"
+        "ApeX-USDT"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"15787695375210609250491147414005894154890873413229882671403677761527504080":"Starknet Aggregator (since v0.13.3)","2397984267054479079853548842566103781972463965746662494980785692480538410509":"StarkNet OS (Starknet)","853638403225561750106379562222782223909906501242604214771127703946595519856":"StarkNet OS (Paradex)","3383082961563516565935611087683915026448707331436034043529592588079494402084":"StarkNet OS (old Paradex, old StarkNet)","3485280386001712778192330279103973322645241679001461923469191557000342180556":"StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)","770346231394331402493200980986217737662224545740427952627288191358999988146":"ApeX-USDT","3174901404014912024702042974619036870715605532092680335571201877913899936957":"StarkEx Spot v4.0 (RhinoFi, Sorare)","16830627573509542901909952446321116535677491650708854009406762893086223513":"StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)","2530337539466159944237001094809327283009177793361359619481044346150483328860":"ApeX-USDC 20250130","3114724292040200590153042023978438629733352741898912919152162079752811928849":"StarkEx Perp v2.0 ApeX-USDC","217719352201300445998518619904782191262194843262573339166404641663770051805":"StarkNet (old)","3003515909324298587247571665454372831319437787162989623104387385306791861180":"StarkNet (old)","1161178844461337253856226043908368523817098764221830529880464854589141231910":"StarkNet Aggregator (old)","1921772108187713503530008849184725638117898887391063185252422808224349294626":"StarkNet (old)","3258367057337572248818716706664617507069572185152472699066582725377748079373":"StarkNet (old)","407700941260678649793204927710478760533239334662847444187959202896452163393":"StarkNet (old)","1865367024509426979036104162713508294334262484507712987283009063059134893433":"StarkNet (old)","54878256403880350656938046611252303365750679698042371543935159963667935317":"StarkNet (old)","2479841346739966073527450029179698923866252973805981504232089731754042431018":"StarkNet (old)","109586309220455887239200613090920758778188956576212125550190099009305121410":"StarkNet (old)"}}]
    }
```

```diff
    contract FinalizableGpsFactAdapterUSDC (0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`).
      values.programHashMapped:
-        "2530337539466159944237001094809327283009177793361359619481044346150483328860"
+        "ApeX-USDC 20250130"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"15787695375210609250491147414005894154890873413229882671403677761527504080":"Starknet Aggregator (since v0.13.3)","2397984267054479079853548842566103781972463965746662494980785692480538410509":"StarkNet OS (Starknet)","853638403225561750106379562222782223909906501242604214771127703946595519856":"StarkNet OS (Paradex)","3383082961563516565935611087683915026448707331436034043529592588079494402084":"StarkNet OS (old Paradex, old StarkNet)","3485280386001712778192330279103973322645241679001461923469191557000342180556":"StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)","770346231394331402493200980986217737662224545740427952627288191358999988146":"ApeX-USDT","3174901404014912024702042974619036870715605532092680335571201877913899936957":"StarkEx Spot v4.0 (RhinoFi, Sorare)","16830627573509542901909952446321116535677491650708854009406762893086223513":"StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)","2530337539466159944237001094809327283009177793361359619481044346150483328860":"ApeX-USDC 20250130","3114724292040200590153042023978438629733352741898912919152162079752811928849":"StarkEx Perp v2.0 ApeX-USDC","217719352201300445998518619904782191262194843262573339166404641663770051805":"StarkNet (old)","3003515909324298587247571665454372831319437787162989623104387385306791861180":"StarkNet (old)","1161178844461337253856226043908368523817098764221830529880464854589141231910":"StarkNet Aggregator (old)","1921772108187713503530008849184725638117898887391063185252422808224349294626":"StarkNet (old)","3258367057337572248818716706664617507069572185152472699066582725377748079373":"StarkNet (old)","407700941260678649793204927710478760533239334662847444187959202896452163393":"StarkNet (old)","1865367024509426979036104162713508294334262484507712987283009063059134893433":"StarkNet (old)","54878256403880350656938046611252303365750679698042371543935159963667935317":"StarkNet (old)","2479841346739966073527450029179698923866252973805981504232089731754042431018":"StarkNet (old)","109586309220455887239200613090920758778188956576212125550190099009305121410":"StarkNet (old)"}}]
    }
```

Generated with discovered.json: 0xe01ed88a8c2c5e4a75f6d5a2943b57db15ad9e02

# Diff at Wed, 05 Mar 2025 14:51:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e85261cbf7cfc5afeac755b44f9df82c8a3c4ba block: 21872281
- current block number: 21981180

## Description

discodrive starkex chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872281 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract AggregationRouterV4 (0x1111111254fb6c44bAC0beD2854e76F90643097d)
    +++ description: None
```

```diff
    contract CommitteeUSDC (0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4) {
    +++ description: Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 3.
      template:
+        "starkex/Committee"
      displayName:
+        "DACommittee"
      description:
+        "Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 3."
      fieldMeta:
+        {"constructorArgs":{"description":"Includes DAC members and threshold."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
-   Status: DELETED
    contract MultiSigPoolUSDT (0x379c15156B527D6E693bED60d1FBb44CE46046b8)
    +++ description: None
```

```diff
    contract FinalizableGpsFactAdapterUSDT (0x40e1e5Ece49A878062fA9F87eA6dc81281098B22) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`770346231394331402493200980986217737662224545740427952627288191358999988146`).
      values.programHashMapped:
+        "770346231394331402493200980986217737662224545740427952627288191358999988146"
      template:
+        "starkex/GpsFactRegistryAdapter"
      displayName:
+        "GpsFactRegistryAdapter"
      description:
+        "Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`770346231394331402493200980986217737662224545740427952627288191358999988146`)."
    }
```

```diff
-   Status: DELETED
    contract AggregationRouterV4Owner (0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1)
    +++ description: None
```

```diff
    contract CommitteeUSDT (0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800) {
    +++ description: Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 3.
      template:
+        "starkex/Committee"
      displayName:
+        "DACommittee"
      description:
+        "Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 3."
      fieldMeta:
+        {"constructorArgs":{"description":"Includes DAC members and threshold."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract StarkPerpetualUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      name:
-        "StarkExchangeUSDC"
+        "StarkPerpetualUSDC"
      issuedPermissions.8:
+        {"permission":"upgrade","to":"0xef75e1199B0599BA823b7770AcE8eb34864a1D55","delay":1209600,"via":[]}
      issuedPermissions.7:
+        {"permission":"upgrade","to":"0xC532d2976209A56DdF4a99B844130f7c0daCa7B6","delay":1209600,"via":[]}
      issuedPermissions.6:
+        {"permission":"operateStarknet","to":"0x78e802d42Bbc1834f962A11B54e0F8e07f52d4Fb","via":[]}
      issuedPermissions.5:
+        {"permission":"operateStarknet","to":"0x5751a83170BeA11fE7CdA5D599B04153C021f21A","via":[]}
      issuedPermissions.4:
+        {"permission":"interact","to":"0xef75e1199B0599BA823b7770AcE8eb34864a1D55","description":"manage the token admin role.","via":[]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0xC532d2976209A56DdF4a99B844130f7c0daCa7B6","description":"manage the token admin role.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0x5751a83170BeA11fE7CdA5D599B04153C021f21A","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "governStarknet"
      issuedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      values.OPERATORS:
-        ["0x5751a83170BeA11fE7CdA5D599B04153C021f21A","0x78e802d42Bbc1834f962A11B54e0F8e07f52d4Fb"]
      values.operators:
+        ["0x5751a83170BeA11fE7CdA5D599B04153C021f21A","0x78e802d42Bbc1834f962A11B54e0F8e07f52d4Fb"]
      values.tokenAdmins:
+        ["0x5751a83170BeA11fE7CdA5D599B04153C021f21A"]
      template:
+        "starkex/StarkPerpetual"
      displayName:
+        "StarkPerpetual"
      description:
+        "Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles."
      fieldMeta:
+        {"$admin":{"severity":"HIGH","description":"Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts."},"isFinalized":{"severity":"HIGH","description":"Finalizes most of the configuration of the contract, which cannot be changed afterwards (only thorugh an upgrade)."},"DEPOSIT_CANCEL_DELAY":{"description":"The time delay required before canceled deposits to the L2 can be reclaimed."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract PerpetualEscapeVerifier (0xaadFdB9CAc145c65f2284fBe24600d07fb37F7BD) {
    +++ description: Special verifier for the escape() function.
      description:
+        "Special verifier for the escape() function."
    }
```

```diff
-   Status: DELETED
    contract TransferRegistry (0xBE9a129909EbCb954bC065536D2bfAfBd170d27A)
    +++ description: None
```

```diff
    contract ApexAdminMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      name:
-        "PerpetualGovernanceMultisig"
+        "ApexAdminMultisig"
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb","delay":1209600}
      receivedPermissions.1:
+        {"permission":"interact","from":"0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb","description":"manage the token admin role."}
      receivedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      severity:
+        "HIGH"
    }
```

```diff
    contract StarkPerpetualUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      name:
-        "StarkExchangeUSDT"
+        "StarkPerpetualUSDT"
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0x53c6Ec9640761c669B800088F097E01A8207Ac8b","delay":1209600,"via":[]}
      issuedPermissions.4:
+        {"permission":"operateStarknet","to":"0x5751a83170BeA11fE7CdA5D599B04153C021f21A","via":[]}
      issuedPermissions.3:
+        {"permission":"operateStarknet","to":"0x552aA2EBA4B0c5b9B8b4b22507189a7af4198169","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0x5751a83170BeA11fE7CdA5D599B04153C021f21A","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0x53c6Ec9640761c669B800088F097E01A8207Ac8b","description":"manage the token admin role.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      values.OPERATORS:
-        ["0x5751a83170BeA11fE7CdA5D599B04153C021f21A","0x552aA2EBA4B0c5b9B8b4b22507189a7af4198169"]
      values.operators:
+        ["0x5751a83170BeA11fE7CdA5D599B04153C021f21A","0x552aA2EBA4B0c5b9B8b4b22507189a7af4198169"]
      values.tokenAdmins:
+        ["0x5751a83170BeA11fE7CdA5D599B04153C021f21A"]
      template:
+        "starkex/StarkPerpetual"
      displayName:
+        "StarkPerpetual"
      description:
+        "Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles."
      fieldMeta:
+        {"$admin":{"severity":"HIGH","description":"Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts."},"isFinalized":{"severity":"HIGH","description":"Finalizes most of the configuration of the contract, which cannot be changed afterwards (only thorugh an upgrade)."},"DEPOSIT_CANCEL_DELAY":{"description":"The time delay required before canceled deposits to the L2 can be reclaimed."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract FinalizableGpsFactAdapterUSDC (0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`).
      values.programHashMapped:
+        "2530337539466159944237001094809327283009177793361359619481044346150483328860"
      template:
+        "starkex/GpsFactRegistryAdapter"
      displayName:
+        "GpsFactRegistryAdapter"
      description:
+        "Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`)."
    }
```

```diff
-   Status: DELETED
    contract MultiSigPoolUSDC (0xe95b3Dc78c0881dEa17A69BaFC6cFeB8d891e9DE)
    +++ description: None
```

Generated with discovered.json: 0xb2d8a3bc5dc64199033f1cb7a91245e8f27c5e20

# Diff at Tue, 04 Mar 2025 10:38:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21872281
- current block number: 21872281

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872281 (main branch discovery), not current.

```diff
    contract AggregationRouterV4 (0x1111111254fb6c44bAC0beD2854e76F90643097d) {
    +++ description: None
      sinceBlock:
+        13556016
    }
```

```diff
    contract CommitteeUSDC (0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4) {
    +++ description: None
      sinceBlock:
+        16233442
    }
```

```diff
    contract MultiSigPoolUSDT (0x379c15156B527D6E693bED60d1FBb44CE46046b8) {
    +++ description: None
      sinceBlock:
+        18475677
    }
```

```diff
    contract FinalizableGpsFactAdapterUSDT (0x40e1e5Ece49A878062fA9F87eA6dc81281098B22) {
    +++ description: None
      sinceBlock:
+        18377195
    }
```

```diff
    contract AggregationRouterV4Owner (0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1) {
    +++ description: None
      sinceBlock:
+        11502031
    }
```

```diff
    contract CommitteeUSDT (0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800) {
    +++ description: None
      sinceBlock:
+        18377195
    }
```

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      sinceBlock:
+        15322967
    }
```

```diff
    contract PerpetualEscapeVerifier (0xaadFdB9CAc145c65f2284fBe24600d07fb37F7BD) {
    +++ description: None
      sinceBlock:
+        15322966
    }
```

```diff
    contract TransferRegistry (0xBE9a129909EbCb954bC065536D2bfAfBd170d27A) {
    +++ description: None
      sinceBlock:
+        11899719
    }
```

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      sinceBlock:
+        16282082
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      sinceBlock:
+        18377191
    }
```

```diff
    contract FinalizableGpsFactAdapterUSDC (0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953) {
    +++ description: None
      sinceBlock:
+        15396280
    }
```

```diff
    contract MultiSigPoolUSDC (0xe95b3Dc78c0881dEa17A69BaFC6cFeB8d891e9DE) {
    +++ description: None
      sinceBlock:
+        15414333
    }
```

Generated with discovered.json: 0x38230bf391f21e818fe4fcf5837049e6204e1609

# Diff at Tue, 18 Feb 2025 09:12:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aff7e43e1c06f559de916763e04088cc23b3e08e block: 21736735
- current block number: 21872281

## Description

Minor upgrade to the StarkExchangeUSDC contract which is an implementation of StarkEx Perpetual.

Two new asset IDs are added:
- NON_UNIQUE_MINTABLE_ASSET_ID_FLAG (ERC-1155)
- MINTABLE_ERC20_ASSET_ID_FLAG (ERC-20)

## Watched changes

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      sourceHashes.5:
-        "0x0c38b010717f86413abfb52412e5eb50b689b8d172e8c39ef81fc428fe5a1e52"
+        "0xe29824efd6d907d93d9b4b2b0737630ab974bce5e0017cb1459975c66a798280"
      sourceHashes.4:
-        "0xb8c0122f24ea2e559e908278def38aa80b6cd27b39b2d74402dbf5ba2585c7c5"
+        "0xdfa7b8bf4884e9f9933980cec5bcf744d2e522c291ed2a383c140cfb8c795f29"
      sourceHashes.3:
-        "0x473fc9765112e835124640cb91a4642354e09e94f92462929139d9ab5b6ddcf4"
+        "0xb5161e812087e15dd53a4c29ab296ade613b540445f7d1eb470de4f81a9c555c"
      sourceHashes.2:
-        "0x5ebd3f192c54b3d36f0d57e1cb14f418ae69a1694f7dc7d19d006883fc89e525"
+        "0xf6d00f2bc5db71a79b854049b38819f78c8fbbd98dcc2e4555f70946f6e58069"
      sourceHashes.1:
-        "0x758db67adde840068b01898c25f007a0d0549aaf9d431c2e0ae77ae4c2c56b33"
+        "0xc8c9c0e9c5171cb82b707e7e4b4ea80d427ba6f1dc21fc604efdce0ffa40323d"
      values.$implementation.4:
-        "0x34E7cfedF99995A47B3e3D0AB88ba67072B55035"
+        "0x31e2d974BaC547101413c24C23443AD488423f64"
      values.$implementation.3:
-        "0xdD5f42B087C1D2F73a2b443249b7D3DbE148a859"
+        "0x45de249eEa8f9CDB70943B17CceDeb42F5BA0175"
      values.$implementation.2:
-        "0x564EA75a26Dc0Bb5c5033B4752f88953A25AD058"
+        "0x1BC9C618B7FA6b5EfAAD31DC801eB55c608B9310"
      values.$implementation.1:
-        "0x533a7f4bE5453513049EB94A2b115F2CcE161dce"
+        "0x540Ad8576d2F90f28994ab001622F964945854A8"
      values.$implementation.0:
-        "0xdD813397b79f8df581eEb0c4B8aB72304c528396"
+        "0x8C43C9bec15d82D153C52518030e0a9590ABD35d"
      values.$pastUpgrades.4:
+        ["2025-02-17T09:39:23.000Z","0x7c6ca54630321bc1f0e2ad0b68972ec3f6efaab449f09839ef612f90d4292bdd",["0x8C43C9bec15d82D153C52518030e0a9590ABD35d","0x540Ad8576d2F90f28994ab001622F964945854A8","0x1BC9C618B7FA6b5EfAAD31DC801eB55c608B9310","0x45de249eEa8f9CDB70943B17CceDeb42F5BA0175","0x31e2d974BaC547101413c24C23443AD488423f64"]]
      values.$upgradeCount:
-        4
+        5
      values.implementation:
-        "0xdD813397b79f8df581eEb0c4B8aB72304c528396"
+        "0x8C43C9bec15d82D153C52518030e0a9590ABD35d"
      values.VERSION:
-        "3.1.0"
+        "3.2.0"
    }
```

## Source code changes

```diff
.../StarkExchangeUSDC/AllVerifiers.2.sol           | 10 +++-
 .../StarkExchangeUSDC/PerpetualForcedActions.5.sol | 10 +++-
 .../StarkExchangeUSDC/PerpetualState.4.sol         | 19 +++++--
 .../PerpetualTokensAndRamping.3.sol                | 60 +++++++++++++++++-----
 .../StarkExchangeUSDC/StarkPerpetual.1.sol         |  4 +-
 5 files changed, 84 insertions(+), 19 deletions(-)
```

Generated with discovered.json: 0x60aa51d35bfba3889065a02bfb6a3aa5df5a52fa

# Diff at Thu, 30 Jan 2025 10:24:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2da0612158e4fa23c41926c49e88a7b955a8c5dc block: 19825348
- current block number: 21736735

## Description

Updates progHash, not found online, added to the library.

## Watched changes

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      values.globalConfigurationHash:
-        "0x01897348c8e7a04145727a7d369a76c01711a828d58afeca4c3e7d86596b85ba"
+        "0x0274c9dc2096cfe79c5f28f5bfb3a95b3bd0692430b4f9ba79f871068611804a"
    }
```

```diff
    contract FinalizableGpsFactAdapterUSDC (0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953) {
    +++ description: None
      values.programHash:
-        "3114724292040200590153042023978438629733352741898912919152162079752811928849"
+        "2530337539466159944237001094809327283009177793361359619481044346150483328860"
    }
```

Generated with discovered.json: 0x9efaa4125824a49cd3c3eba891f97f65c0d9b99f

# Diff at Mon, 20 Jan 2025 11:09:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19825348
- current block number: 19825348

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      issuedPermissions.1.target:
-        "0xef75e1199B0599BA823b7770AcE8eb34864a1D55"
      issuedPermissions.1.to:
+        "0xef75e1199B0599BA823b7770AcE8eb34864a1D55"
      issuedPermissions.0.target:
-        "0xC532d2976209A56DdF4a99B844130f7c0daCa7B6"
      issuedPermissions.0.to:
+        "0xC532d2976209A56DdF4a99B844130f7c0daCa7B6"
    }
```

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb"
      receivedPermissions.0.from:
+        "0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb"
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x53c6Ec9640761c669B800088F097E01A8207Ac8b"
      issuedPermissions.0.to:
+        "0x53c6Ec9640761c669B800088F097E01A8207Ac8b"
    }
```

Generated with discovered.json: 0xe06d77b380a3f56ed87b20ba833abdbccfef43cc

# Diff at Mon, 21 Oct 2024 11:04:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0xdD813397b79f8df581eEb0c4B8aB72304c528396","0x533a7f4bE5453513049EB94A2b115F2CcE161dce","0x564EA75a26Dc0Bb5c5033B4752f88953A25AD058","0xdD5f42B087C1D2F73a2b443249b7D3DbE148a859","0x34E7cfedF99995A47B3e3D0AB88ba67072B55035"]
      values.$pastUpgrades.3.1:
-        ["0xdD813397b79f8df581eEb0c4B8aB72304c528396","0x533a7f4bE5453513049EB94A2b115F2CcE161dce","0x564EA75a26Dc0Bb5c5033B4752f88953A25AD058","0xdD5f42B087C1D2F73a2b443249b7D3DbE148a859","0x34E7cfedF99995A47B3e3D0AB88ba67072B55035"]
+        "0x40b1d2a6419d7e69d4a0d7f779548c138795c3649099f68fc5b2d7e6dca9b28b"
      values.$pastUpgrades.2.2:
+        ["0xdD813397b79f8df581eEb0c4B8aB72304c528396","0x533a7f4bE5453513049EB94A2b115F2CcE161dce","0x564EA75a26Dc0Bb5c5033B4752f88953A25AD058","0xdD5f42B087C1D2F73a2b443249b7D3DbE148a859","0x34E7cfedF99995A47B3e3D0AB88ba67072B55035"]
      values.$pastUpgrades.2.1:
-        ["0xdD813397b79f8df581eEb0c4B8aB72304c528396","0x533a7f4bE5453513049EB94A2b115F2CcE161dce","0x564EA75a26Dc0Bb5c5033B4752f88953A25AD058","0xdD5f42B087C1D2F73a2b443249b7D3DbE148a859","0x34E7cfedF99995A47B3e3D0AB88ba67072B55035"]
+        "0x57d264627a2d18fbee29c402a3e48fe53c496ce51ea140adc194ab2cc9b235f4"
      values.$pastUpgrades.1.2:
+        ["0x67bC2461000cfbe67e9b623EC8B460168BdEC5F0","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x8f62a4a85B64dF803FDB644a1c7F595BFC6fF8dA","0xBdc6c96D298408415Ac70D334BedEbc8862B3C41","0xf1f087A5da4c5938E3ee091Edeea4f773fe203CA"]
      values.$pastUpgrades.1.1:
-        ["0x67bC2461000cfbe67e9b623EC8B460168BdEC5F0","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x8f62a4a85B64dF803FDB644a1c7F595BFC6fF8dA","0xBdc6c96D298408415Ac70D334BedEbc8862B3C41","0xf1f087A5da4c5938E3ee091Edeea4f773fe203CA"]
+        "0x4d944148289a3ce02380ec7819dcddd59c6c75bc53b98a4442a174d5a92ff14f"
      values.$pastUpgrades.0.2:
+        ["0x67bC2461000cfbe67e9b623EC8B460168BdEC5F0","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x8f62a4a85B64dF803FDB644a1c7F595BFC6fF8dA","0xBdc6c96D298408415Ac70D334BedEbc8862B3C41","0xf1f087A5da4c5938E3ee091Edeea4f773fe203CA"]
      values.$pastUpgrades.0.1:
-        ["0x67bC2461000cfbe67e9b623EC8B460168BdEC5F0","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x8f62a4a85B64dF803FDB644a1c7F595BFC6fF8dA","0xBdc6c96D298408415Ac70D334BedEbc8862B3C41","0xf1f087A5da4c5938E3ee091Edeea4f773fe203CA"]
+        "0x6c8b4e4fc51235fe438779e444c7f6b8332ad8e3ea371cee73974ca4c5b9de8f"
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x3167617e913BF59afb90e5ec1A7B32D4Ea03eae4","0x5a50e280883B1FB39Aa04Eb263BCA47630D17D8E","0x3F3A131caB7eb5b4EAE9497Bebb9E06bE80F2809","0x5BfbE850d18b73ed98FB830e0A5E9F4970Bb93dA","0x229BbdF97eBc4993efe1433c0ae4A0bE79A4fe21"]
      values.$pastUpgrades.1.1:
-        ["0x3167617e913BF59afb90e5ec1A7B32D4Ea03eae4","0x5a50e280883B1FB39Aa04Eb263BCA47630D17D8E","0x3F3A131caB7eb5b4EAE9497Bebb9E06bE80F2809","0x5BfbE850d18b73ed98FB830e0A5E9F4970Bb93dA","0x229BbdF97eBc4993efe1433c0ae4A0bE79A4fe21"]
+        "0xa56eaf93de66cd491d4e4ca0997883d927848861429ba5b3ae64b6652d4cee52"
      values.$pastUpgrades.0.2:
+        ["0x3167617e913BF59afb90e5ec1A7B32D4Ea03eae4","0x5a50e280883B1FB39Aa04Eb263BCA47630D17D8E","0x3F3A131caB7eb5b4EAE9497Bebb9E06bE80F2809","0x5BfbE850d18b73ed98FB830e0A5E9F4970Bb93dA","0x229BbdF97eBc4993efe1433c0ae4A0bE79A4fe21"]
      values.$pastUpgrades.0.1:
-        ["0x3167617e913BF59afb90e5ec1A7B32D4Ea03eae4","0x5a50e280883B1FB39Aa04Eb263BCA47630D17D8E","0x3F3A131caB7eb5b4EAE9497Bebb9E06bE80F2809","0x5BfbE850d18b73ed98FB830e0A5E9F4970Bb93dA","0x229BbdF97eBc4993efe1433c0ae4A0bE79A4fe21"]
+        "0x27741474cceaf88b1e1c14ae8b6f39e6f538352db3d214e3c74abbf812dcb8d9"
    }
```

Generated with discovered.json: 0x095714c935e124eb021116635a30c35871ec51cb

# Diff at Mon, 14 Oct 2024 10:49:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract AggregationRouterV4 (0x1111111254fb6c44bAC0beD2854e76F90643097d) {
    +++ description: None
      sourceHashes:
+        ["0xcf1a7058461495ed508bbdc19356705fd4208d5522d226052109f79f3b1c07a3"]
    }
```

```diff
    contract CommitteeUSDC (0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4) {
    +++ description: None
      sourceHashes:
+        ["0x581fe96c5df565dd8524d044e5dcfdad1b613513021dce348f4c85f8c881a7b5"]
    }
```

```diff
    contract MultiSigPoolUSDT (0x379c15156B527D6E693bED60d1FBb44CE46046b8) {
    +++ description: None
      sourceHashes:
+        ["0x641d1fce90ca144fc5ced3c8ee055f6876620610fc3afa756a5dc174f53963d3"]
    }
```

```diff
    contract FinalizableGpsFactAdapterUSDT (0x40e1e5Ece49A878062fA9F87eA6dc81281098B22) {
    +++ description: None
      sourceHashes:
+        ["0x395444e8f8af03cea56ff4137d997fc94a06817d06cea35a2b467a45c6ee136b"]
    }
```

```diff
    contract AggregationRouterV4Owner (0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract CommitteeUSDT (0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800) {
    +++ description: None
      sourceHashes:
+        ["0xab5a8f616268fb3ec919ff2c4566b29938a53013be74e966348bf881eecd4c0a"]
    }
```

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      sourceHashes:
+        ["0xb5e622bd6406dd3d2188cae22f160599ee0953d520795bb86831c4c266e45587","0x758db67adde840068b01898c25f007a0d0549aaf9d431c2e0ae77ae4c2c56b33","0x5ebd3f192c54b3d36f0d57e1cb14f418ae69a1694f7dc7d19d006883fc89e525","0x473fc9765112e835124640cb91a4642354e09e94f92462929139d9ab5b6ddcf4","0xb8c0122f24ea2e559e908278def38aa80b6cd27b39b2d74402dbf5ba2585c7c5","0x0c38b010717f86413abfb52412e5eb50b689b8d172e8c39ef81fc428fe5a1e52"]
    }
```

```diff
    contract PerpetualEscapeVerifier (0xaadFdB9CAc145c65f2284fBe24600d07fb37F7BD) {
    +++ description: None
      sourceHashes:
+        ["0xb56ab8d20ca2ce7897c0448957f5ad2bb634a2019411b1cb0453afe5c86f4f5f"]
    }
```

```diff
    contract TransferRegistry (0xBE9a129909EbCb954bC065536D2bfAfBd170d27A) {
    +++ description: None
      sourceHashes:
+        ["0xca65c90eab3222ece5205fccdae3a20a07419751133d38894a85db4802060a14"]
    }
```

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      sourceHashes:
+        ["0xfd5ac94c5a362e7426efd613abbaca3b838cf7f6089b44d9c0d4f675ca4467b3","0xc8c9c0e9c5171cb82b707e7e4b4ea80d427ba6f1dc21fc604efdce0ffa40323d","0xf6d00f2bc5db71a79b854049b38819f78c8fbbd98dcc2e4555f70946f6e58069","0xb60327bf3481ca8d5ad46cb4fcec2f2db0b7d9eaa2cc0479fda600eb1021de93","0xdfa7b8bf4884e9f9933980cec5bcf744d2e522c291ed2a383c140cfb8c795f29","0xe29824efd6d907d93d9b4b2b0737630ab974bce5e0017cb1459975c66a798280"]
    }
```

```diff
    contract FinalizableGpsFactAdapterUSDC (0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953) {
    +++ description: None
      sourceHashes:
+        ["0x395444e8f8af03cea56ff4137d997fc94a06817d06cea35a2b467a45c6ee136b"]
    }
```

```diff
    contract MultiSigPoolUSDC (0xe95b3Dc78c0881dEa17A69BaFC6cFeB8d891e9DE) {
    +++ description: None
      sourceHashes:
+        ["0x331aa6df8abe04615c862e5d29cee5ef8b680ab3d244de1399ca760503ebe945"]
    }
```

Generated with discovered.json: 0x178e64287c3e8af6289050a0c0e1dcf63b924ab0

# Diff at Tue, 01 Oct 2024 10:49:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-11T21:07:19.000Z",["0x67bC2461000cfbe67e9b623EC8B460168BdEC5F0","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x8f62a4a85B64dF803FDB644a1c7F595BFC6fF8dA","0xBdc6c96D298408415Ac70D334BedEbc8862B3C41","0xf1f087A5da4c5938E3ee091Edeea4f773fe203CA"]],["2022-08-23T13:51:05.000Z",["0x67bC2461000cfbe67e9b623EC8B460168BdEC5F0","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x8f62a4a85B64dF803FDB644a1c7F595BFC6fF8dA","0xBdc6c96D298408415Ac70D334BedEbc8862B3C41","0xf1f087A5da4c5938E3ee091Edeea4f773fe203CA"]],["2022-12-22T08:17:35.000Z",["0xdD813397b79f8df581eEb0c4B8aB72304c528396","0x533a7f4bE5453513049EB94A2b115F2CcE161dce","0x564EA75a26Dc0Bb5c5033B4752f88953A25AD058","0xdD5f42B087C1D2F73a2b443249b7D3DbE148a859","0x34E7cfedF99995A47B3e3D0AB88ba67072B55035"]],["2023-01-06T06:29:35.000Z",["0xdD813397b79f8df581eEb0c4B8aB72304c528396","0x533a7f4bE5453513049EB94A2b115F2CcE161dce","0x564EA75a26Dc0Bb5c5033B4752f88953A25AD058","0xdD5f42B087C1D2F73a2b443249b7D3DbE148a859","0x34E7cfedF99995A47B3e3D0AB88ba67072B55035"]]]
      values.$upgradeCount:
+        4
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-18T12:19:47.000Z",["0x3167617e913BF59afb90e5ec1A7B32D4Ea03eae4","0x5a50e280883B1FB39Aa04Eb263BCA47630D17D8E","0x3F3A131caB7eb5b4EAE9497Bebb9E06bE80F2809","0x5BfbE850d18b73ed98FB830e0A5E9F4970Bb93dA","0x229BbdF97eBc4993efe1433c0ae4A0bE79A4fe21"]],["2023-11-28T15:26:47.000Z",["0x3167617e913BF59afb90e5ec1A7B32D4Ea03eae4","0x5a50e280883B1FB39Aa04Eb263BCA47630D17D8E","0x3F3A131caB7eb5b4EAE9497Bebb9E06bE80F2809","0x5BfbE850d18b73ed98FB830e0A5E9F4970Bb93dA","0x229BbdF97eBc4993efe1433c0ae4A0bE79A4fe21"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xea67e288a5b4518cce9d44247359a2886d5cd8ef

# Diff at Fri, 30 Aug 2024 07:51:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x4667d97d555c55a259262c565872eac34b1528da

# Diff at Wed, 21 Aug 2024 10:01:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC532d2976209A56DdF4a99B844130f7c0daCa7B6","via":[]},{"permission":"upgrade","target":"0xef75e1199B0599BA823b7770AcE8eb34864a1D55","via":[]}]
    }
```

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb","via":[]}]
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x53c6Ec9640761c669B800088F097E01A8207Ac8b","via":[]}]
    }
```

Generated with discovered.json: 0xb43b38464018b222160218080718d20095921320

# Diff at Fri, 09 Aug 2024 10:08:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract AggregationRouterV4Owner (0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0xB1A308e7F02798377b7acF685E997E3D774c5863","0x3A6ED6885608Ead8174789a81Eb2B05600ca89F8","0x2BB718a3986C36c6E02D8d15cdA4370820D08169"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xB1A308e7F02798377b7acF685E997E3D774c5863","0x3A6ED6885608Ead8174789a81Eb2B05600ca89F8","0x2BB718a3986C36c6E02D8d15cdA4370820D08169"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb"]
      assignedPermissions.upgrade:
+        ["0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb"]
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0x22c89137525b593Dd2A18434348b550ffA5984Fe","0xef75e1199B0599BA823b7770AcE8eb34864a1D55"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x22c89137525b593Dd2A18434348b550ffA5984Fe","0xef75e1199B0599BA823b7770AcE8eb34864a1D55"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

Generated with discovered.json: 0xd876b97495cd92f29c9969cd6abbb7e64b6e83c5

# Diff at Thu, 18 Jul 2024 10:29:31 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      assignedPermissions:
+        {"admin":["0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb"]}
    }
```

Generated with discovered.json: 0xcdbbaf68b28da1e22c57df19c736fdedc8a4eb72

# Diff at Wed, 08 May 2024 12:30:13 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624842
- current block number: 19825348

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624842 (main branch discovery), not current.

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4"
+        ["0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4"]
      values.getRegisteredVerifiers:
-        "0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953"
+        ["0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953"]
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800"
+        ["0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800"]
      values.getRegisteredVerifiers:
-        "0x40e1e5Ece49A878062fA9F87eA6dc81281098B22"
+        ["0x40e1e5Ece49A878062fA9F87eA6dc81281098B22"]
    }
```

Generated with discovered.json: 0xe502ced95cc56e356340ce6c4f72089b3662254c

# Diff at Wed, 10 Apr 2024 11:10:55 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19531421
- current block number: 19624842

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531421 (main branch discovery), not current.

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4"]
+        "0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4"
      values.getRegisteredVerifiers:
-        ["0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953"]
+        "0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953"
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800"]
+        "0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800"
      values.getRegisteredVerifiers:
-        ["0x40e1e5Ece49A878062fA9F87eA6dc81281098B22"]
+        "0x40e1e5Ece49A878062fA9F87eA6dc81281098B22"
    }
```

Generated with discovered.json: 0x3e398c9a07a24393eda56ca1d029dddcdaafbc5b

# Diff at Thu, 28 Mar 2024 08:29:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 18685523
- current block number: 19531421

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18685523 (main branch discovery), not current.

```diff
    contract AggregationRouterV4Owner (0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 2 (100%)"
    }
```

Generated with discovered.json: 0x0fa337b45cd76773ae656410f777bdb702845b4e

# Diff at Thu, 30 Nov 2023 16:11:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@86509954e727fb4deae9efbdf805e6bb714a43c5

## Description

Upgrade delay for USDT StarkEx has been changed from 0 to 14 days.

## Watched changes

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
      upgradeability.upgradeDelay:
-        0
+        1209600
      values.getUpgradeActivationDelay:
-        0
+        1209600
    }
```

# Diff at Thu, 23 Nov 2023 15:27:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2ff45714640abe4c50d283967078888d4af81d78

## Description

Apex is enabling USDT as an additional collateral for their perpetual pairs.
Previously only USDC was available. Technically StarkEx system for perpetuals
doesn't support multiple collaterals, so Apex will be running 2 independent
StarkEx instances. This also means that there will be no interoperability
between them and between -USDC and -USDT perpetual pairs. Also parameters
of each system can differ.

## Watched changes

```diff
+   Status: CREATED
    contract MultiSigPoolUSDT (0x379c15156B527D6E693bED60d1FBb44CE46046b8) {
    }
```

```diff
+   Status: CREATED
    contract FinalizableGpsFactAdapterUSDT (0x40e1e5Ece49A878062fA9F87eA6dc81281098B22) {
    }
```

```diff
+   Status: CREATED
    contract CommitteeUSDT (0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800) {
    }
```

```diff
+   Status: CREATED
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    }
```

## Source code changes

```diff
.../ethereum/.code/CommitteeUSDT/Committee.sol     | 100 +++++
 .../ethereum/.code/CommitteeUSDT/FactRegistry.sol  |  58 +++
 .../.code/CommitteeUSDT/IAvailabilityVerifier.sol  |  24 ++
 .../ethereum/.code/CommitteeUSDT/IFactRegistry.sol |  39 ++
 .../.code/CommitteeUSDT/IQueryableFactRegistry.sol |  30 ++
 .../apex/ethereum/.code/CommitteeUSDT/Identity.sol |  24 ++
 .../apex/ethereum/.code/CommitteeUSDT/meta.txt     |   2 +
 .../FinalizableGpsFactAdapterUSDT/Finalizable.sol  |  42 ++
 .../FinalizableGpsFactAdapter.sol                  |  40 ++
 .../GpsFactRegistryAdapter.sol                     |  57 +++
 .../IFactRegistry.sol                              |  39 ++
 .../IQueryableFactRegistry.sol                     |  30 ++
 .../FinalizableGpsFactAdapterUSDT/Identity.sol     |  24 ++
 .../SimpleAdminable.sol                            |  71 ++++
 .../.code/FinalizableGpsFactAdapterUSDT/meta.txt   |   2 +
 .../@openzeppelin/contracts/interfaces/IERC20.sol  |   6 +
 .../contracts/security/ReentrancyGuard.sol         |  77 ++++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |  78 ++++
 .../token/ERC20/extensions/IERC20Permit.sol        |  60 +++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 143 +++++++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++++++
 .../@openzeppelin/contracts/utils/Strings.sol      |  85 ++++
 .../contracts/utils/cryptography/ECDSA.sol         | 217 ++++++++++
 .../@openzeppelin/contracts/utils/math/Math.sol    | 339 +++++++++++++++
 .../contracts/utils/math/SafeMath.sol              | 215 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/core/MultiSigPool.sol                | 380 +++++++++++++++++
 .../contracts/interfaces/IAggregationExecutor.sol  |   5 +
 .../contracts/interfaces/IAggregationRouterV4.sol  |  31 ++
 .../contracts/interfaces/IFactRegister.sol         |  13 +
 .../contracts/interfaces/IStarkEx.sol              |  44 ++
 .../contracts/interfaces/IWETH.sol                 |   9 +
 .../apex/ethereum/.code/MultiSigPoolUSDT/meta.txt  |   2 +
 .../implementation-1/Addresses.sol                 |  58 +++
 .../implementation-1/BlockDirectCall.sol           |  36 ++
 .../implementation-1/Governance.sol                | 123 ++++++
 .../implementation-1/GovernanceStorage.sol         |  26 ++
 .../implementation-1/IDispatcherBase.sol           |  37 ++
 .../implementation-1/Identity.sol                  |  24 ++
 .../implementation-1/MGovernance.sol               |  29 ++
 .../implementation-1/MainDispatcher.sol            |  84 ++++
 .../implementation-1/MainDispatcherBase.sol        | 232 +++++++++++
 .../implementation-1/MainStorage.sol               | 136 ++++++
 .../implementation-1/PerpetualStorage.sol          |  46 ++
 .../implementation-1/ProxyStorage.sol              |  38 ++
 .../implementation-1/StarkExTypes.sol              |  32 ++
 .../implementation-1/StarkPerpetual.sol            |  78 ++++
 .../implementation-1/SubContractor.sol             |  33 ++
 .../StarkExchangeUSDT/implementation-1/meta.txt    |   2 +
 .../implementation-2/Addresses.sol                 |  58 +++
 .../implementation-2/AllVerifiers.sol              |  56 +++
 .../implementation-2/ApprovalChain.sol             | 130 ++++++
 .../implementation-2/AvailabilityVerifiers.sol     |  72 ++++
 .../implementation-2/Freezable.sol                 |  72 ++++
 .../implementation-2/Governance.sol                | 123 ++++++
 .../implementation-2/GovernanceStorage.sol         |  26 ++
 .../implementation-2/IFactRegistry.sol             |  39 ++
 .../implementation-2/IQueryableFactRegistry.sol    |  30 ++
 .../implementation-2/Identity.sol                  |  24 ++
 .../implementation-2/LibConstants.sol              |  69 +++
 .../implementation-2/MApprovalChain.sol            |  74 ++++
 .../implementation-2/MFreezable.sol                |  47 +++
 .../implementation-2/MGovernance.sol               |  29 ++
 .../implementation-2/MainGovernance.sol            |  82 ++++
 .../implementation-2/MainStorage.sol               | 136 ++++++
 .../implementation-2/ProxyStorage.sol              |  38 ++
 .../implementation-2/StarkExTypes.sol              |  32 ++
 .../implementation-2/SubContractor.sol             |  33 ++
 .../implementation-2/Verifiers.sol                 |  65 +++
 .../StarkExchangeUSDT/implementation-2/meta.txt    |   2 +
 .../implementation-3/AcceptModifications.sol       | 123 ++++++
 .../implementation-3/Addresses.sol                 |  58 +++
 .../implementation-3/Deposits.sol                  | 409 ++++++++++++++++++
 .../implementation-3/ERC721Receiver.sol            |  48 +++
 .../implementation-3/Freezable.sol                 |  72 ++++
 .../implementation-3/Governance.sol                | 123 ++++++
 .../implementation-3/GovernanceStorage.sol         |  26 ++
 .../implementation-3/IERC1155.sol                  | 138 ++++++
 .../StarkExchangeUSDT/implementation-3/IERC20.sol  |  43 ++
 .../implementation-3/IERC721Receiver.sol           |  26 ++
 .../implementation-3/Identity.sol                  |  24 ++
 .../implementation-3/KeyGetters.sol                |  60 +++
 .../implementation-3/LibConstants.sol              |  69 +++
 .../implementation-3/MAcceptModifications.sol      |  42 ++
 .../implementation-3/MDeposits.sol                 |  34 ++
 .../implementation-3/MFreezable.sol                |  47 +++
 .../implementation-3/MGovernance.sol               |  29 ++
 .../implementation-3/MKeyGetters.sol               |  35 ++
 .../implementation-3/MTokenAssetData.sol           |  54 +++
 .../implementation-3/MTokenQuantization.sol        |  34 ++
 .../implementation-3/MTokenTransfers.sol           |  47 +++
 .../implementation-3/MainGovernance.sol            |  82 ++++
 .../implementation-3/MainStorage.sol               | 136 ++++++
 .../implementation-3/PerpetualStorage.sol          |  46 ++
 .../implementation-3/PerpetualTokenRegister.sol    |  60 +++
 .../implementation-3/PerpetualTokensAndRamping.sol |  70 ++++
 .../implementation-3/ProxyStorage.sol              |  38 ++
 .../implementation-3/StarkExTypes.sol              |  32 ++
 .../implementation-3/SubContractor.sol             |  33 ++
 .../implementation-3/TokenAssetData.sol            | 205 +++++++++
 .../implementation-3/TokenQuantization.sol         |  54 +++
 .../implementation-3/TokenRegister.sol             | 136 ++++++
 .../implementation-3/TokenTransfers.sol            | 269 ++++++++++++
 .../implementation-3/Withdrawals.sol               | 211 ++++++++++
 .../StarkExchangeUSDT/implementation-3/meta.txt    |   2 +
 .../implementation-4/AcceptModifications.sol       | 123 ++++++
 .../implementation-4/ActionHash.sol                |  61 +++
 .../implementation-4/Addresses.sol                 |  58 +++
 .../implementation-4/Configuration.sol             | 117 ++++++
 .../implementation-4/ForcedTradeActionState.sol    | 150 +++++++
 .../ForcedWithdrawalActionState.sol                |  63 +++
 .../implementation-4/Freezable.sol                 |  72 ++++
 .../implementation-4/Governance.sol                | 123 ++++++
 .../implementation-4/GovernanceStorage.sol         |  26 ++
 .../implementation-4/IFactRegistry.sol             |  39 ++
 .../implementation-4/Identity.sol                  |  24 ++
 .../implementation-4/LibConstants.sol              |  69 +++
 .../implementation-4/MAcceptModifications.sol      |  42 ++
 .../implementation-4/MForcedTradeActionState.sol   |  73 ++++
 .../MForcedWithdrawalActionState.sol               |  45 ++
 .../implementation-4/MFreezable.sol                |  47 +++
 .../implementation-4/MGovernance.sol               |  29 ++
 .../implementation-4/MOperator.sol                 |  37 ++
 .../implementation-4/MStateRoot.sol                |  57 +++
 .../implementation-4/MTokenQuantization.sol        |  34 ++
 .../implementation-4/MainGovernance.sol            |  82 ++++
 .../implementation-4/MainStorage.sol               | 136 ++++++
 .../OnchainDataFactTreeEncoder.sol                 |  65 +++
 .../implementation-4/Operator.sol                  |  48 +++
 .../implementation-4/PerpetualConstants.sol        |  29 ++
 .../implementation-4/PerpetualEscapes.sol          |  66 +++
 .../implementation-4/PerpetualState.sol            | 107 +++++
 .../implementation-4/PerpetualStorage.sol          |  46 ++
 .../implementation-4/ProgramOutputOffsets.sol      |  65 +++
 .../implementation-4/ProxyStorage.sol              |  38 ++
 .../implementation-4/StarkExOperator.sol           |  34 ++
 .../implementation-4/StarkExTypes.sol              |  32 ++
 .../implementation-4/StateRoot.sol                 |  98 +++++
 .../implementation-4/SubContractor.sol             |  33 ++
 .../implementation-4/TokenQuantization.sol         |  54 +++
 .../implementation-4/UpdatePerpetualState.sol      | 459 ++++++++++++++++++++
 .../implementation-4/VerifyFactChain.sol           |  38 ++
 .../StarkExchangeUSDT/implementation-4/meta.txt    |   2 +
 .../implementation-5/ActionHash.sol                |  61 +++
 .../implementation-5/Addresses.sol                 |  58 +++
 .../StarkExchangeUSDT/implementation-5/ECDSA.sol   |  71 ++++
 .../implementation-5/EllipticCurve.sol             | 464 +++++++++++++++++++++
 .../implementation-5/ForcedTradeActionState.sol    | 150 +++++++
 .../implementation-5/ForcedTrades.sol              | 197 +++++++++
 .../ForcedWithdrawalActionState.sol                |  63 +++
 .../implementation-5/ForcedWithdrawals.sol         |  70 ++++
 .../implementation-5/Freezable.sol                 |  72 ++++
 .../implementation-5/Governance.sol                | 123 ++++++
 .../implementation-5/GovernanceStorage.sol         |  26 ++
 .../implementation-5/Identity.sol                  |  24 ++
 .../implementation-5/KeyGetters.sol                |  60 +++
 .../implementation-5/LibConstants.sol              |  69 +++
 .../implementation-5/MForcedTradeActionState.sol   |  73 ++++
 .../MForcedWithdrawalActionState.sol               |  45 ++
 .../implementation-5/MFreezable.sol                |  47 +++
 .../implementation-5/MGovernance.sol               |  29 ++
 .../implementation-5/MKeyGetters.sol               |  35 ++
 .../implementation-5/MainGovernance.sol            |  82 ++++
 .../implementation-5/MainStorage.sol               | 136 ++++++
 .../implementation-5/PerpetualConstants.sol        |  29 ++
 .../implementation-5/PerpetualForcedActions.sol    |  66 +++
 .../implementation-5/PerpetualStorage.sol          |  46 ++
 .../implementation-5/ProxyStorage.sol              |  38 ++
 .../implementation-5/StarkExTypes.sol              |  32 ++
 .../implementation-5/SubContractor.sol             |  33 ++
 .../StarkExchangeUSDT/implementation-5/Users.sol   | 113 +++++
 .../StarkExchangeUSDT/implementation-5/meta.txt    |   2 +
 .../.code/StarkExchangeUSDT/proxy/Addresses.sol    |  58 +++
 .../.code/StarkExchangeUSDT/proxy/Governance.sol   | 123 ++++++
 .../StarkExchangeUSDT/proxy/GovernanceStorage.sol  |  26 ++
 .../.code/StarkExchangeUSDT/proxy/MGovernance.sol  |  29 ++
 .../.code/StarkExchangeUSDT/proxy/Proxy.sol        | 330 +++++++++++++++
 .../StarkExchangeUSDT/proxy/ProxyGovernance.sol    |  82 ++++
 .../.code/StarkExchangeUSDT/proxy/ProxyStorage.sol |  38 ++
 .../.code/StarkExchangeUSDT/proxy/StorageSlots.sol |  52 +++
 .../.code/StarkExchangeUSDT/proxy/meta.txt         |   2 +
 181 files changed, 13514 insertions(+)
```
