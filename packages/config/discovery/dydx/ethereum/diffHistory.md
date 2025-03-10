Generated with discovered.json: 0xdfdc800c18573ed0b64012a9b2651d33bc4e7ee9

# Diff at Thu, 06 Mar 2025 15:18:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21343041
- current block number: 21343041

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21343041 (main branch discovery), not current.

```diff
    contract FinalizableGpsFactAdapter (0xF23754231BC4cE8C8E92C3bADfB37d922d46053C) {
    +++ description: Adapter between the core contract and the 0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3. Stores the Cairo programHash (`3022993219738828102988654230098311570191704199468817569337520096526584973032`).
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"15787695375210609250491147414005894154890873413229882671403677761527504080":"Starknet Aggregator (since v0.13.3)","2397984267054479079853548842566103781972463965746662494980785692480538410509":"StarkNet OS (Starknet)","853638403225561750106379562222782223909906501242604214771127703946595519856":"StarkNet OS (Paradex)","3383082961563516565935611087683915026448707331436034043529592588079494402084":"StarkNet OS (old Paradex, old StarkNet)","3485280386001712778192330279103973322645241679001461923469191557000342180556":"StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)","770346231394331402493200980986217737662224545740427952627288191358999988146":"ApeX-USDT","3174901404014912024702042974619036870715605532092680335571201877913899936957":"StarkEx Spot v4.0 (RhinoFi, Sorare)","16830627573509542901909952446321116535677491650708854009406762893086223513":"StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)","2530337539466159944237001094809327283009177793361359619481044346150483328860":"ApeX-USDC 20250130","3114724292040200590153042023978438629733352741898912919152162079752811928849":"StarkEx Perp v2.0 ApeX-USDC","217719352201300445998518619904782191262194843262573339166404641663770051805":"StarkNet (old)","3003515909324298587247571665454372831319437787162989623104387385306791861180":"StarkNet (old)","1161178844461337253856226043908368523817098764221830529880464854589141231910":"StarkNet Aggregator (old)","1921772108187713503530008849184725638117898887391063185252422808224349294626":"StarkNet (old)","3258367057337572248818716706664617507069572185152472699066582725377748079373":"StarkNet (old)","407700941260678649793204927710478760533239334662847444187959202896452163393":"StarkNet (old)","1865367024509426979036104162713508294334262484507712987283009063059134893433":"StarkNet (old)","54878256403880350656938046611252303365750679698042371543935159963667935317":"StarkNet (old)","2479841346739966073527450029179698923866252973805981504232089731754042431018":"StarkNet (old)","109586309220455887239200613090920758778188956576212125550190099009305121410":"StarkNet (old)"}}]
    }
```

Generated with discovered.json: 0xb844bd6d912312c4ed9b9b2cba006df5f01d5c34

# Diff at Wed, 05 Mar 2025 14:58:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e85261cbf7cfc5afeac755b44f9df82c8a3c4ba block: 21343041
- current block number: 21343041

## Description

discodrive sn stack and starkex chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21343041 (main branch discovery), not current.

```diff
    contract FinalizableGpsFactAdapter (0xF23754231BC4cE8C8E92C3bADfB37d922d46053C) {
    +++ description: Adapter between the core contract and the 0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3. Stores the Cairo programHash (`3022993219738828102988654230098311570191704199468817569337520096526584973032`).
      values.programHashMapped:
+        "3022993219738828102988654230098311570191704199468817569337520096526584973032"
      template:
+        "starkex/GpsFactRegistryAdapter"
      displayName:
+        "GpsFactRegistryAdapter"
      description:
+        "Adapter between the core contract and the 0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3. Stores the Cairo programHash (`3022993219738828102988654230098311570191704199468817569337520096526584973032`)."
    }
```

Generated with discovered.json: 0xca660cc957c983c4624df9c0a50391be04f085a2

# Diff at Tue, 04 Mar 2025 10:39:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21343041
- current block number: 21343041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21343041 (main branch discovery), not current.

```diff
    contract MerkleDistributor (0x01d3348601968aB85b4bb028979006eac235a588) {
    +++ description: None
      sinceBlock:
+        12931482
    }
```

```diff
    contract CpuFrilessVerifier (0x04D4E67F8B6c67D63219Cd088bC45E8e89fE6D73) {
    +++ description: None
      sinceBlock:
+        11813202
    }
```

```diff
    contract CpuOods (0x0c6dEc0B366b1bb4C14597cf1Da8b4af2E7799b5) {
    +++ description: None
      sinceBlock:
+        11813198
    }
```

```diff
    contract MerkleStatementContract (0x0d62bac5c346c78DC1b27107CAbC5F4DE057a830) {
    +++ description: None
      sinceBlock:
+        11813198
    }
```

```diff
    contract ClaimsProxy (0x0fd829C3365A225FB9226e75c97c3A114bD3199e) {
    +++ description: None
      sinceBlock:
+        12931509
    }
```

```diff
    contract PedersenHashPointsYColumn (0x0fED12bD8B1B11c629001c436b90bcd99F4Fec92) {
    +++ description: None
      sinceBlock:
+        11813192
    }
```

```diff
    contract CairoBootloaderProgram (0x1dd8945200f5a09D6Fe0ed68494c2ac41cd02E2D) {
    +++ description: None
      sinceBlock:
+        11813182
    }
```

```diff
    contract CpuConstraintPoly (0x1F5459AA7857291112A8172ae1328248948d9d13) {
    +++ description: None
      sinceBlock:
+        11813186
    }
```

```diff
    contract TreasuryProxyAdmin (0x40D6992cbd03E0DC1c2DE9606D29Cb245E737a5d) {
    +++ description: None
      sinceBlock:
+        12931441
    }
```

```diff
    contract WrappedEthereumDydxToken (0x46b2DeAe6eFf3011008EA27EA36b7c27255ddFA9) {
    +++ description: None
      sinceBlock:
+        18112365
    }
```

```diff
    contract CpuFrilessVerifier (0x4922f8750DFd040954b44F23980160342e308863) {
    +++ description: None
      sinceBlock:
+        11813200
    }
```

```diff
    contract EcdsaPointsXColumn (0x52c4bb16FbA75f6EBD672568267BC334255Fb3c5) {
    +++ description: None
      sinceBlock:
+        11813192
    }
```

```diff
    contract LiquidityStaking (0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941) {
    +++ description: None
      sinceBlock:
+        12931493
    }
```

```diff
    contract PerpetualEscapeVerifier (0x626211C1e9BC633f4D342Af99f4E8bc93f11F3DD) {
    +++ description: None
      sinceBlock:
+        12424523
    }
```

```diff
    contract TreasuryBridge (0x639192D54431F8c816368D3FB4107Bc168d0E871) {
    +++ description: None
      sinceBlock:
+        12931442
    }
```

```diff
    contract ShortTimelockExecutor (0x64c7d40c07EFAbec2AafdC243bF59eaF2195c6dc) {
    +++ description: None
      sinceBlock:
+        12816312
    }
```

```diff
    contract SafetyModule (0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC) {
    +++ description: None
      sinceBlock:
+        12931454
    }
```

```diff
    contract SafetyModuleProxyAdmin (0x6aaD0BCfbD91963Cf2c8FB042091fd411FB05b3C) {
    +++ description: None
      sinceBlock:
+        12931449
    }
```

```diff
    contract MerkleDistributorProxyAdmin (0x6C5cd3aD7A16Ae207D221908E6b997d9B0DcD7b0) {
    +++ description: None
      sinceBlock:
+        12931480
    }
```

```diff
    contract DydxGovernor (0x7E9B1672616FF6D6629Ef2879419aaE79A9018D2) {
    +++ description: None
      sinceBlock:
+        12816310
    }
```

```diff
    contract GpsStatementVerifier (0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3) {
    +++ description: None
      sinceBlock:
+        12013702
    }
```

```diff
    contract Committee (0x8A8E80e0762243f0df39f2847808B7F6D62e2bb1) {
    +++ description: None
      sinceBlock:
+        11834295
    }
```

```diff
    contract DydxToken (0x92D6C1e31e14520e676a687F0a93788B716BEff5) {
    +++ description: None
      sinceBlock:
+        12809555
    }
```

```diff
    contract ChainlinkAdapter (0x99B0599952a4FD2d1A1561Fa4C010827EaD30354) {
    +++ description: None
      sinceBlock:
+        12931491
    }
```

```diff
    contract PedersenHashPointsXColumn (0x9Bcf13C6b68450B427bfa86698D61901A8a3456D) {
    +++ description: None
      sinceBlock:
+        11813187
    }
```

```diff
    contract PriorityExecutor (0xa306989BA6BcacdECCf3C0614FfF2B8C668e3CaE) {
    +++ description: None
      sinceBlock:
+        12931528
    }
```

```diff
    contract LiquidityStakingProxyAdmin (0xAc5D8bCD13da463bea96c75f9085c4e40037F790) {
    +++ description: None
      sinceBlock:
+        12931492
    }
```

```diff
    contract TreasuryVester (0xb9431E19B29B952d9358025f680077C3Fd37292f) {
    +++ description: None
      sinceBlock:
+        12931477
    }
```

```diff
    contract GovernanceStrategyV2 (0xc2f5F3505910Da80F0592a3Cc023881C50b16505) {
    +++ description: None
      sinceBlock:
+        18112366
    }
```

```diff
    contract EcdsaPointsYColumn (0xD14fd39630Ec941C3bA6C791E3af9E0027013A15) {
    +++ description: None
      sinceBlock:
+        11813192
    }
```

```diff
    contract StarkPerpetual (0xD54f502e184B6B739d7D27a6410a67dc462D69c8) {
    +++ description: None
      sinceBlock:
+        11834295
    }
```

```diff
    contract MerklePauserExecutor (0xd98e7A71BacB6F11438A8271dDB2EFd7f9361F52) {
    +++ description: None
      sinceBlock:
+        12816315
    }
```

```diff
    contract CpuFrilessVerifier (0xeCa5Da0287D407a23f7c0a13a9AAD87c7fBC10A3) {
    +++ description: None
      sinceBlock:
+        12013692
    }
```

```diff
    contract LongTimelockExecutor (0xEcaE9BF44A21d00E2350a42127A377Bf5856d84B) {
    +++ description: None
      sinceBlock:
+        12816311
    }
```

```diff
    contract MemoryPageFactRegistry (0xEfbCcE4659db72eC6897F46783303708cf9ACef8) {
    +++ description: None
      sinceBlock:
+        11813182
    }
```

```diff
    contract FinalizableGpsFactAdapter (0xF23754231BC4cE8C8E92C3bADfB37d922d46053C) {
    +++ description: None
      sinceBlock:
+        17065528
    }
```

```diff
    contract FriStatementContract (0xf6b83CcaDeee478FC372AF6ca7069b14FBc5E1B1) {
    +++ description: None
      sinceBlock:
+        11813198
    }
```

```diff
    contract StarkExRemoverGovernorV2 (0xFCAac0F14deA11eDe11Afcb875f29130e1ad5ec0) {
    +++ description: None
      sinceBlock:
+        12946416
    }
```

Generated with discovered.json: 0x5db33511cf5bddbb87778a1a432d9dc05a2a4d36

# Diff at Mon, 20 Jan 2025 11:09:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21343041
- current block number: 21343041

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21343041 (main branch discovery), not current.

```diff
    contract MerkleDistributor (0x01d3348601968aB85b4bb028979006eac235a588) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6C5cd3aD7A16Ae207D221908E6b997d9B0DcD7b0"
      issuedPermissions.0.to:
+        "0x6C5cd3aD7A16Ae207D221908E6b997d9B0DcD7b0"
    }
```

```diff
    contract TreasuryProxyAdmin (0x40D6992cbd03E0DC1c2DE9606D29Cb245E737a5d) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x639192D54431F8c816368D3FB4107Bc168d0E871"
      receivedPermissions.0.from:
+        "0x639192D54431F8c816368D3FB4107Bc168d0E871"
    }
```

```diff
    contract LiquidityStaking (0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xAc5D8bCD13da463bea96c75f9085c4e40037F790"
      issuedPermissions.0.to:
+        "0xAc5D8bCD13da463bea96c75f9085c4e40037F790"
    }
```

```diff
    contract TreasuryBridge (0x639192D54431F8c816368D3FB4107Bc168d0E871) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x40D6992cbd03E0DC1c2DE9606D29Cb245E737a5d"
      issuedPermissions.0.to:
+        "0x40D6992cbd03E0DC1c2DE9606D29Cb245E737a5d"
    }
```

```diff
    contract SafetyModule (0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6aaD0BCfbD91963Cf2c8FB042091fd411FB05b3C"
      issuedPermissions.0.to:
+        "0x6aaD0BCfbD91963Cf2c8FB042091fd411FB05b3C"
    }
```

```diff
    contract SafetyModuleProxyAdmin (0x6aaD0BCfbD91963Cf2c8FB042091fd411FB05b3C) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC"
      receivedPermissions.0.from:
+        "0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC"
    }
```

```diff
    contract MerkleDistributorProxyAdmin (0x6C5cd3aD7A16Ae207D221908E6b997d9B0DcD7b0) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x01d3348601968aB85b4bb028979006eac235a588"
      receivedPermissions.0.from:
+        "0x01d3348601968aB85b4bb028979006eac235a588"
    }
```

```diff
    contract PriorityExecutor (0xa306989BA6BcacdECCf3C0614FfF2B8C668e3CaE) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xD54f502e184B6B739d7D27a6410a67dc462D69c8"
      receivedPermissions.0.from:
+        "0xD54f502e184B6B739d7D27a6410a67dc462D69c8"
    }
```

```diff
    contract LiquidityStakingProxyAdmin (0xAc5D8bCD13da463bea96c75f9085c4e40037F790) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941"
      receivedPermissions.0.from:
+        "0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941"
    }
```

```diff
    contract StarkPerpetual (0xD54f502e184B6B739d7D27a6410a67dc462D69c8) {
    +++ description: None
      issuedPermissions.1.target:
-        "0xFCAac0F14deA11eDe11Afcb875f29130e1ad5ec0"
      issuedPermissions.1.to:
+        "0xFCAac0F14deA11eDe11Afcb875f29130e1ad5ec0"
      issuedPermissions.0.target:
-        "0xa306989BA6BcacdECCf3C0614FfF2B8C668e3CaE"
      issuedPermissions.0.to:
+        "0xa306989BA6BcacdECCf3C0614FfF2B8C668e3CaE"
    }
```

```diff
    contract StarkExRemoverGovernorV2 (0xFCAac0F14deA11eDe11Afcb875f29130e1ad5ec0) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xD54f502e184B6B739d7D27a6410a67dc462D69c8"
      receivedPermissions.0.from:
+        "0xD54f502e184B6B739d7D27a6410a67dc462D69c8"
    }
```

Generated with discovered.json: 0xeddfee2f0ff6ab6de42da0af973f6412cb1837c8

# Diff at Thu, 31 Oct 2024 10:41:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f409157dbd8c6fad51290f20e7bd5692f0556969 block: 19825321
- current block number: 21085080

## Description

The escape hatch is open and the according verifier operational. Link to escape hatch added to header warn.

## Watched changes

```diff
    contract PerpetualEscapeVerifier (0x626211C1e9BC633f4D342Af99f4E8bc93f11F3DD) {
    +++ description: None
      values.hasRegisteredFact:
-        false
+        true
    }
```

```diff
    contract StarkPerpetual (0xD54f502e184B6B739d7D27a6410a67dc462D69c8) {
    +++ description: None
      values.isFrozen:
-        false
+        true
    }
```

Generated with discovered.json: 0x7780590b4658612b530c90e48534c4a9252e1135

# Diff at Mon, 21 Oct 2024 11:05:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19825321
- current block number: 19825321

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825321 (main branch discovery), not current.

```diff
    contract TreasuryBridge (0x639192D54431F8c816368D3FB4107Bc168d0E871) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x8d0051943D4c72aF12D638c6b7253C71929A910A"]
      values.$pastUpgrades.0.1:
-        ["0x8d0051943D4c72aF12D638c6b7253C71929A910A"]
+        "0x311ad16a59e2d62bc8c610bd8c2d47d3f26e552c5bab68838b7486698f9a137b"
    }
```

```diff
    contract SafetyModule (0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x31D76F5Db8F40D28886Bf00F3be5F157472Bf77A"]
      values.$pastUpgrades.1.1:
-        ["0x31D76F5Db8F40D28886Bf00F3be5F157472Bf77A"]
+        "0xfd332147899fd3ef1db62f262ffae92bbd7d18a5ed4e142eb0407a173dbf0453"
      values.$pastUpgrades.0.2:
+        ["0xD249aD8fA4646C303028a8d29cf8568A38897C55"]
      values.$pastUpgrades.0.1:
-        ["0xD249aD8fA4646C303028a8d29cf8568A38897C55"]
+        "0xbca63ca6821699890dc34d4ff8b9831dd6bd20f41eedb70bfefec31ad9b7f013"
    }
```

```diff
    contract StarkPerpetual (0xD54f502e184B6B739d7D27a6410a67dc462D69c8) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0x2C0df87E073755139101b35c0A51e065291cc2d3","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0x3FeD7bF5Bf3E738bc30fBe61B048fDcb82368545","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]
      values.$pastUpgrades.4.1:
-        ["0x2C0df87E073755139101b35c0A51e065291cc2d3","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0x3FeD7bF5Bf3E738bc30fBe61B048fDcb82368545","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]
+        "0x54001ec3a6332a404afa3e6b70de80d8469f3142c4a7b6b0baeaa851ca56064c"
      values.$pastUpgrades.3.2:
+        ["0x2C0df87E073755139101b35c0A51e065291cc2d3","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0x3FeD7bF5Bf3E738bc30fBe61B048fDcb82368545","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]
      values.$pastUpgrades.3.1:
-        ["0x2C0df87E073755139101b35c0A51e065291cc2d3","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0x3FeD7bF5Bf3E738bc30fBe61B048fDcb82368545","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]
+        "0x924fbc366dc7cfee30d285cdd1f5c085a817f423bc0b6f50107f7c8eaf87cd42"
      values.$pastUpgrades.2.2:
+        ["0x0a5a7A738528af22B4f5cfE70E5A1e07A2cfE643","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0xEbfeA8AC94FbEEcEe91d457D8cBd3b047bFd2481","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]
      values.$pastUpgrades.2.1:
-        ["0x0a5a7A738528af22B4f5cfE70E5A1e07A2cfE643","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0xEbfeA8AC94FbEEcEe91d457D8cBd3b047bFd2481","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]
+        "0x8a86108de24d120fd24b1636b3d23354261ab90ee7061af8b52ba4aca9aa56fd"
      values.$pastUpgrades.1.2:
+        ["0x0a5a7A738528af22B4f5cfE70E5A1e07A2cfE643","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0xEbfeA8AC94FbEEcEe91d457D8cBd3b047bFd2481","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]
      values.$pastUpgrades.1.1:
-        ["0x0a5a7A738528af22B4f5cfE70E5A1e07A2cfE643","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0xEbfeA8AC94FbEEcEe91d457D8cBd3b047bFd2481","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]
+        "0xaff60291482d6cc8ed96ed1357406e2871c5ca6df04df4185e2657a60c7a24b5"
      values.$pastUpgrades.0.2:
+        ["0x0a5a7A738528af22B4f5cfE70E5A1e07A2cfE643","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0xEbfeA8AC94FbEEcEe91d457D8cBd3b047bFd2481","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]
      values.$pastUpgrades.0.1:
-        ["0x0a5a7A738528af22B4f5cfE70E5A1e07A2cfE643","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0xEbfeA8AC94FbEEcEe91d457D8cBd3b047bFd2481","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]
+        "0xc477cce8447884f1eb5a9bef79b5dd898fffbc81475b07a7d0fa82d2c1d91e4c"
    }
```

Generated with discovered.json: 0x3d39ce076a2d38d3609fe3fc8527f5a130c6c129

# Diff at Mon, 14 Oct 2024 10:50:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19825321
- current block number: 19825321

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825321 (main branch discovery), not current.

```diff
    contract MerkleDistributor (0x01d3348601968aB85b4bb028979006eac235a588) {
    +++ description: None
      sourceHashes:
+        ["0x5e3d09f8089d63a7a6d8546086c617af3d5dd46af7590b5ef30cc4ca39754dda","0x5eb26cee90dca2178b42fc264fc447af3272c9c84f97decb89285baa230ed77b"]
    }
```

```diff
    contract CpuFrilessVerifier (0x04D4E67F8B6c67D63219Cd088bC45E8e89fE6D73) {
    +++ description: None
      sourceHashes:
+        ["0x4ed0a8fed2fb6b8cc5ecf363781107f0fea73b810fb2a78b6ff0e7565fac2f62"]
    }
```

```diff
    contract CpuOods (0x0c6dEc0B366b1bb4C14597cf1Da8b4af2E7799b5) {
    +++ description: None
      sourceHashes:
+        ["0xc9f95b23f16315cabf114838b357854b67aa18bffeb85f3e4763dd0b2ebdac5b"]
    }
```

```diff
    contract MerkleStatementContract (0x0d62bac5c346c78DC1b27107CAbC5F4DE057a830) {
    +++ description: None
      sourceHashes:
+        ["0xa671d6ba3e3803dbd31bbc7ade04cc66b5b41ef6553c5efe6b8645e4d2ea6030"]
    }
```

```diff
    contract ClaimsProxy (0x0fd829C3365A225FB9226e75c97c3A114bD3199e) {
    +++ description: None
      sourceHashes:
+        ["0x14247f67293c931189c2f13126a402c94b2afb17f22e034e27562a726393e921"]
    }
```

```diff
    contract PedersenHashPointsYColumn (0x0fED12bD8B1B11c629001c436b90bcd99F4Fec92) {
    +++ description: None
      sourceHashes:
+        ["0x05c19e648542d62b4ddf24a4fa4c15a3a6e25cd850736e41c5544eb570a9f2a2"]
    }
```

```diff
    contract CairoBootloaderProgram (0x1dd8945200f5a09D6Fe0ed68494c2ac41cd02E2D) {
    +++ description: None
      sourceHashes:
+        ["0x910ee17561c1bd968dbc0547bafcc9e8321d4ee336392525c0956ec59c94b799"]
    }
```

```diff
    contract CpuConstraintPoly (0x1F5459AA7857291112A8172ae1328248948d9d13) {
    +++ description: None
      sourceHashes:
+        ["0xeda6df888e68f267f04ff010db56b1a7b83756e14076d73718df7d33b1e2ae41"]
    }
```

```diff
    contract TreasuryProxyAdmin (0x40D6992cbd03E0DC1c2DE9606D29Cb245E737a5d) {
    +++ description: None
      sourceHashes:
+        ["0xe1359792802f19276b6aa89d864b80a04eeaad44be992fe8e81aba9feec27af4"]
    }
```

```diff
    contract WrappedEthereumDydxToken (0x46b2DeAe6eFf3011008EA27EA36b7c27255ddFA9) {
    +++ description: None
      sourceHashes:
+        ["0xece96853a5bdf87e554329700585a08c5c2cd492e0bd37f88d30bc44e530cc74"]
    }
```

```diff
    contract CpuFrilessVerifier (0x4922f8750DFd040954b44F23980160342e308863) {
    +++ description: None
      sourceHashes:
+        ["0x40ad0c189ae6d45546284ca7cfba8a4147e474ac91828f587c736afe8ef3a668"]
    }
```

```diff
    contract EcdsaPointsXColumn (0x52c4bb16FbA75f6EBD672568267BC334255Fb3c5) {
    +++ description: None
      sourceHashes:
+        ["0x412fb414e7fea74325d60a077f704a49cf6d23a7a1d43c9fd09be7e9a4e5e76f"]
    }
```

```diff
    contract LiquidityStaking (0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941) {
    +++ description: None
      sourceHashes:
+        ["0x5e3d09f8089d63a7a6d8546086c617af3d5dd46af7590b5ef30cc4ca39754dda","0x0111ff9c30eb270b8df99390defd855542974eb8a6a6200212cee243a9ba9679"]
    }
```

```diff
    contract PerpetualEscapeVerifier (0x626211C1e9BC633f4D342Af99f4E8bc93f11F3DD) {
    +++ description: None
      sourceHashes:
+        ["0x684921b3b4e6212f66865889daeb916ea5de2487eb8558ef4ef000b6fb159b35"]
    }
```

```diff
    contract TreasuryBridge (0x639192D54431F8c816368D3FB4107Bc168d0E871) {
    +++ description: None
      sourceHashes:
+        ["0x5e3d09f8089d63a7a6d8546086c617af3d5dd46af7590b5ef30cc4ca39754dda","0xa1f45598b0f289ead20121783ac8f948cb7005845b5646ab5b8918e8252d2644"]
    }
```

```diff
    contract ShortTimelockExecutor (0x64c7d40c07EFAbec2AafdC243bF59eaF2195c6dc) {
    +++ description: None
      sourceHashes:
+        ["0x2b69eb06923cd9704b99e54ed0d1294ea96da2ec719476b1f93b1d9176b6fe98"]
    }
```

```diff
    contract SafetyModule (0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC) {
    +++ description: None
      sourceHashes:
+        ["0x5e3d09f8089d63a7a6d8546086c617af3d5dd46af7590b5ef30cc4ca39754dda","0x57553f9e7638b7b9c78914908fedcfd695b2973d1860afc5395c8328e8a55a1d"]
    }
```

```diff
    contract SafetyModuleProxyAdmin (0x6aaD0BCfbD91963Cf2c8FB042091fd411FB05b3C) {
    +++ description: None
      sourceHashes:
+        ["0xe1359792802f19276b6aa89d864b80a04eeaad44be992fe8e81aba9feec27af4"]
    }
```

```diff
    contract MerkleDistributorProxyAdmin (0x6C5cd3aD7A16Ae207D221908E6b997d9B0DcD7b0) {
    +++ description: None
      sourceHashes:
+        ["0xe1359792802f19276b6aa89d864b80a04eeaad44be992fe8e81aba9feec27af4"]
    }
```

```diff
    contract DydxGovernor (0x7E9B1672616FF6D6629Ef2879419aaE79A9018D2) {
    +++ description: None
      sourceHashes:
+        ["0x2fe37952f2fff616157e00a7389810ee76f2ee19c2fd0449571e0c362f030aa1"]
    }
```

```diff
    contract GpsStatementVerifier (0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3) {
    +++ description: None
      sourceHashes:
+        ["0xfe731822f194cf686e57ab136911f5128f6262c4ecadef68cee6eba0751ca77b"]
    }
```

```diff
    contract Committee (0x8A8E80e0762243f0df39f2847808B7F6D62e2bb1) {
    +++ description: None
      sourceHashes:
+        ["0xca16a90f8e3d769dcf7c193aade241726dd9cca439bdf131740e54b7725ee599"]
    }
```

```diff
    contract DydxToken (0x92D6C1e31e14520e676a687F0a93788B716BEff5) {
    +++ description: None
      sourceHashes:
+        ["0xa1c6b779016519cd0e36109115853fdb48caef5ca257585e2ff61ca5a6e990c6"]
    }
```

```diff
    contract ChainlinkAdapter (0x99B0599952a4FD2d1A1561Fa4C010827EaD30354) {
    +++ description: None
      sourceHashes:
+        ["0x3450d9fd6eeaee34343e727534e9aef6f035cc7b19eab0f5690268f9ddd379d6"]
    }
```

```diff
    contract PedersenHashPointsXColumn (0x9Bcf13C6b68450B427bfa86698D61901A8a3456D) {
    +++ description: None
      sourceHashes:
+        ["0x6eb94f42b6ee59326d27f5ec055a5872adf1df7825af5df411459832c72ba175"]
    }
```

```diff
    contract PriorityExecutor (0xa306989BA6BcacdECCf3C0614FfF2B8C668e3CaE) {
    +++ description: None
      sourceHashes:
+        ["0x5e7ffe4bf5cc430b1f4d7ee4515f29578b78793ea6192f9c9015849f1a25b493"]
    }
```

```diff
    contract LiquidityStakingProxyAdmin (0xAc5D8bCD13da463bea96c75f9085c4e40037F790) {
    +++ description: None
      sourceHashes:
+        ["0xe1359792802f19276b6aa89d864b80a04eeaad44be992fe8e81aba9feec27af4"]
    }
```

```diff
    contract TreasuryVester (0xb9431E19B29B952d9358025f680077C3Fd37292f) {
    +++ description: None
      sourceHashes:
+        ["0xaf50c3a07aac286f2f2dd23fc63624b681a2aadccbf3a8629dc58d9316cddd23"]
    }
```

```diff
    contract GovernanceStrategyV2 (0xc2f5F3505910Da80F0592a3Cc023881C50b16505) {
    +++ description: None
      sourceHashes:
+        ["0xee1844f59c7ff492ee5430d8673a00537a966cb0de1e21ec8c8ff1adf630e0af"]
    }
```

```diff
    contract EcdsaPointsYColumn (0xD14fd39630Ec941C3bA6C791E3af9E0027013A15) {
    +++ description: None
      sourceHashes:
+        ["0x16786b57094cb8c3157552703287a310748c4453d743f9f2fa22adc7a6bf991c"]
    }
```

```diff
    contract StarkPerpetual (0xD54f502e184B6B739d7D27a6410a67dc462D69c8) {
    +++ description: None
      sourceHashes:
+        ["0xcbc560d276343abe292d73f08cd9006d7faaf560c300a437744a6e8646c9baa6","0x74ee5c93d85e8e3f9a076d643a1f10dbc07160631e7b7ddf00cf54b7f4218bd8","0x30ebdecf2dc34bef72c4db7e2fc3ed61f8f12fd248455fda41cadfc6076c4ab5","0x2ca4953b47f855531afeb05271bc0a2a40ef59696a328130b04419b2ffab757a","0x55d6a4cd67a46f33d25cf27c466b0794bf83409eefb65aa00799943d4519273f","0x78eb03e490fcb196d0b884db041c442d39699b0f0434493a89834ad53949e95d"]
    }
```

```diff
    contract MerklePauserExecutor (0xd98e7A71BacB6F11438A8271dDB2EFd7f9361F52) {
    +++ description: None
      sourceHashes:
+        ["0x2b69eb06923cd9704b99e54ed0d1294ea96da2ec719476b1f93b1d9176b6fe98"]
    }
```

```diff
    contract CpuFrilessVerifier (0xeCa5Da0287D407a23f7c0a13a9AAD87c7fBC10A3) {
    +++ description: None
      sourceHashes:
+        ["0x0b61340aa73762dba13146142086ff4fbd1b253748bc6c19238d628db084e076"]
    }
```

```diff
    contract LongTimelockExecutor (0xEcaE9BF44A21d00E2350a42127A377Bf5856d84B) {
    +++ description: None
      sourceHashes:
+        ["0x2b69eb06923cd9704b99e54ed0d1294ea96da2ec719476b1f93b1d9176b6fe98"]
    }
```

```diff
    contract MemoryPageFactRegistry (0xEfbCcE4659db72eC6897F46783303708cf9ACef8) {
    +++ description: None
      sourceHashes:
+        ["0x1a064332cbf420353ceab684146a9c730873a5617ce302e26a88da05ea14b449"]
    }
```

```diff
    contract FinalizableGpsFactAdapter (0xF23754231BC4cE8C8E92C3bADfB37d922d46053C) {
    +++ description: None
      sourceHashes:
+        ["0x395444e8f8af03cea56ff4137d997fc94a06817d06cea35a2b467a45c6ee136b"]
    }
```

```diff
    contract FriStatementContract (0xf6b83CcaDeee478FC372AF6ca7069b14FBc5E1B1) {
    +++ description: None
      sourceHashes:
+        ["0x193add6f23ec1dadc0f158bf31a76ebee58c7f4c229944b80585c7abf71b4d2d"]
    }
```

```diff
    contract StarkExRemoverGovernorV2 (0xFCAac0F14deA11eDe11Afcb875f29130e1ad5ec0) {
    +++ description: None
      sourceHashes:
+        ["0x7ee1d0e428b5a170c7e988d1e0e774b05e9cba8e2678f9837e51ee50555c5065"]
    }
```

Generated with discovered.json: 0x0e9639e40e05d87045bb595dfc07d60697877ea9

# Diff at Tue, 01 Oct 2024 10:50:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825321
- current block number: 19825321

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825321 (main branch discovery), not current.

```diff
    contract MerkleDistributor (0x01d3348601968aB85b4bb028979006eac235a588) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract LiquidityStaking (0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract TreasuryBridge (0x639192D54431F8c816368D3FB4107Bc168d0E871) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-20T13:04:23.000Z",["0x8d0051943D4c72aF12D638c6b7253C71929A910A"]]]
    }
```

```diff
    contract SafetyModule (0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-08-03T08:06:30.000Z",["0xD249aD8fA4646C303028a8d29cf8568A38897C55"]],["2021-11-20T04:36:32.000Z",["0x31D76F5Db8F40D28886Bf00F3be5F157472Bf77A"]]]
    }
```

```diff
    contract StarkPerpetual (0xD54f502e184B6B739d7D27a6410a67dc462D69c8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-02-11T08:54:42.000Z",["0x0a5a7A738528af22B4f5cfE70E5A1e07A2cfE643","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0xEbfeA8AC94FbEEcEe91d457D8cBd3b047bFd2481","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]],["2021-02-11T15:51:49.000Z",["0x0a5a7A738528af22B4f5cfE70E5A1e07A2cfE643","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0xEbfeA8AC94FbEEcEe91d457D8cBd3b047bFd2481","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]],["2021-03-16T13:44:41.000Z",["0x0a5a7A738528af22B4f5cfE70E5A1e07A2cfE643","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0xEbfeA8AC94FbEEcEe91d457D8cBd3b047bFd2481","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]],["2021-05-13T08:12:15.000Z",["0x2C0df87E073755139101b35c0A51e065291cc2d3","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0x3FeD7bF5Bf3E738bc30fBe61B048fDcb82368545","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]],["2023-04-30T05:12:23.000Z",["0x2C0df87E073755139101b35c0A51e065291cc2d3","0x5d8cC5659db74EEbF19aA2Bb39973F9339012AC5","0x3FeD7bF5Bf3E738bc30fBe61B048fDcb82368545","0xDF9c117Cad37F2ED8C99E36A40317D8CC340D4a0","0xc43f5526124877F9125E3B48101DcA6D7c6B4Ea3"]]]
      values.$upgradeCount:
+        5
    }
```

Generated with discovered.json: 0x55fe5c6d1d28cf7f14e44089e6d8c4b4d222d35f

# Diff at Fri, 30 Aug 2024 07:52:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19825321
- current block number: 19825321

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825321 (main branch discovery), not current.

```diff
    contract TreasuryProxyAdmin (0x40D6992cbd03E0DC1c2DE9606D29Cb245E737a5d) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SafetyModuleProxyAdmin (0x6aaD0BCfbD91963Cf2c8FB042091fd411FB05b3C) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract MerkleDistributorProxyAdmin (0x6C5cd3aD7A16Ae207D221908E6b997d9B0DcD7b0) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract PriorityExecutor (0xa306989BA6BcacdECCf3C0614FfF2B8C668e3CaE) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract LiquidityStakingProxyAdmin (0xAc5D8bCD13da463bea96c75f9085c4e40037F790) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract StarkExRemoverGovernorV2 (0xFCAac0F14deA11eDe11Afcb875f29130e1ad5ec0) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x0794ca23bd2d6a3c4675bf3c358b89f0cff77214

# Diff at Fri, 23 Aug 2024 09:52:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19825321
- current block number: 19825321

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825321 (main branch discovery), not current.

```diff
    contract MerkleDistributor (0x01d3348601968aB85b4bb028979006eac235a588) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract LiquidityStaking (0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract TreasuryBridge (0x639192D54431F8c816368D3FB4107Bc168d0E871) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SafetyModule (0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xa18e92967da60de60ca8b04f516d152e40628390

# Diff at Wed, 21 Aug 2024 10:02:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825321
- current block number: 19825321

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825321 (main branch discovery), not current.

```diff
    contract MerkleDistributor (0x01d3348601968aB85b4bb028979006eac235a588) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6C5cd3aD7A16Ae207D221908E6b997d9B0DcD7b0","via":[]}]
    }
```

```diff
    contract TreasuryProxyAdmin (0x40D6992cbd03E0DC1c2DE9606D29Cb245E737a5d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x639192D54431F8c816368D3FB4107Bc168d0E871"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x639192D54431F8c816368D3FB4107Bc168d0E871","via":[]}]
    }
```

```diff
    contract LiquidityStaking (0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xAc5D8bCD13da463bea96c75f9085c4e40037F790","via":[]}]
    }
```

```diff
    contract TreasuryBridge (0x639192D54431F8c816368D3FB4107Bc168d0E871) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x40D6992cbd03E0DC1c2DE9606D29Cb245E737a5d","via":[]}]
    }
```

```diff
    contract SafetyModule (0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6aaD0BCfbD91963Cf2c8FB042091fd411FB05b3C","via":[]}]
    }
```

```diff
    contract SafetyModuleProxyAdmin (0x6aaD0BCfbD91963Cf2c8FB042091fd411FB05b3C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC","via":[]}]
    }
```

```diff
    contract MerkleDistributorProxyAdmin (0x6C5cd3aD7A16Ae207D221908E6b997d9B0DcD7b0) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x01d3348601968aB85b4bb028979006eac235a588"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x01d3348601968aB85b4bb028979006eac235a588","via":[]}]
    }
```

```diff
    contract PriorityExecutor (0xa306989BA6BcacdECCf3C0614FfF2B8C668e3CaE) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xD54f502e184B6B739d7D27a6410a67dc462D69c8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xD54f502e184B6B739d7D27a6410a67dc462D69c8","via":[]}]
    }
```

```diff
    contract LiquidityStakingProxyAdmin (0xAc5D8bCD13da463bea96c75f9085c4e40037F790) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941","via":[]}]
    }
```

```diff
    contract StarkPerpetual (0xD54f502e184B6B739d7D27a6410a67dc462D69c8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa306989BA6BcacdECCf3C0614FfF2B8C668e3CaE","via":[]},{"permission":"upgrade","target":"0xFCAac0F14deA11eDe11Afcb875f29130e1ad5ec0","via":[]}]
    }
```

```diff
    contract StarkExRemoverGovernorV2 (0xFCAac0F14deA11eDe11Afcb875f29130e1ad5ec0) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xD54f502e184B6B739d7D27a6410a67dc462D69c8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xD54f502e184B6B739d7D27a6410a67dc462D69c8","via":[]}]
    }
```

Generated with discovered.json: 0x01ddf9fb0521dd7cf449d64ab4fac456ef66eb69

# Diff at Fri, 09 Aug 2024 10:09:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19825321
- current block number: 19825321

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825321 (main branch discovery), not current.

```diff
    contract TreasuryProxyAdmin (0x40D6992cbd03E0DC1c2DE9606D29Cb245E737a5d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x639192D54431F8c816368D3FB4107Bc168d0E871"]
      assignedPermissions.upgrade:
+        ["0x639192D54431F8c816368D3FB4107Bc168d0E871"]
    }
```

```diff
    contract SafetyModuleProxyAdmin (0x6aaD0BCfbD91963Cf2c8FB042091fd411FB05b3C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC"]
      assignedPermissions.upgrade:
+        ["0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC"]
    }
```

```diff
    contract MerkleDistributorProxyAdmin (0x6C5cd3aD7A16Ae207D221908E6b997d9B0DcD7b0) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x01d3348601968aB85b4bb028979006eac235a588"]
      assignedPermissions.upgrade:
+        ["0x01d3348601968aB85b4bb028979006eac235a588"]
    }
```

```diff
    contract PriorityExecutor (0xa306989BA6BcacdECCf3C0614FfF2B8C668e3CaE) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xD54f502e184B6B739d7D27a6410a67dc462D69c8"]
      assignedPermissions.upgrade:
+        ["0xD54f502e184B6B739d7D27a6410a67dc462D69c8"]
    }
```

```diff
    contract LiquidityStakingProxyAdmin (0xAc5D8bCD13da463bea96c75f9085c4e40037F790) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941"]
      assignedPermissions.upgrade:
+        ["0x5Aa653A076c1dbB47cec8C1B4d152444CAD91941"]
    }
```

```diff
    contract StarkExRemoverGovernorV2 (0xFCAac0F14deA11eDe11Afcb875f29130e1ad5ec0) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xD54f502e184B6B739d7D27a6410a67dc462D69c8"]
      assignedPermissions.upgrade:
+        ["0xD54f502e184B6B739d7D27a6410a67dc462D69c8"]
    }
```

Generated with discovered.json: 0xf46c9af487d6268172f589cc81d7da9158d29efa

# Diff at Thu, 18 Jul 2024 10:30:44 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19825321
- current block number: 19825321

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825321 (main branch discovery), not current.

```diff
    contract PriorityExecutor (0xa306989BA6BcacdECCf3C0614FfF2B8C668e3CaE) {
    +++ description: None
      assignedPermissions:
+        {"admin":["0xD54f502e184B6B739d7D27a6410a67dc462D69c8"]}
    }
```

Generated with discovered.json: 0xc451776acd16cd4a023e980afd2fd3d73f69a7d9

# Diff at Wed, 08 May 2024 12:25:13 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624796
- current block number: 19825321

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624796 (main branch discovery), not current.

```diff
    contract StarkPerpetual (0xD54f502e184B6B739d7D27a6410a67dc462D69c8) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x8A8E80e0762243f0df39f2847808B7F6D62e2bb1"
+        ["0x8A8E80e0762243f0df39f2847808B7F6D62e2bb1"]
      values.getRegisteredVerifiers:
-        "0xF23754231BC4cE8C8E92C3bADfB37d922d46053C"
+        ["0xF23754231BC4cE8C8E92C3bADfB37d922d46053C"]
    }
```

Generated with discovered.json: 0xc99c96ccdee46279467f59ebecd40cffddcb5dbe

# Diff at Wed, 10 Apr 2024 11:02:23 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19161886
- current block number: 19624796

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19161886 (main branch discovery), not current.

```diff
    contract StarkPerpetual (0xD54f502e184B6B739d7D27a6410a67dc462D69c8) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x8A8E80e0762243f0df39f2847808B7F6D62e2bb1"]
+        "0x8A8E80e0762243f0df39f2847808B7F6D62e2bb1"
      values.getRegisteredVerifiers:
-        ["0xF23754231BC4cE8C8E92C3bADfB37d922d46053C"]
+        "0xF23754231BC4cE8C8E92C3bADfB37d922d46053C"
    }
```

Generated with discovered.json: 0x250622e4d8e1b0176f61c77ff080fe9e9d5b9b25

# Diff at Wed, 10 Jan 2024 08:28:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@47499b2e645343d8fd16b1ecc8f9d4e11fbc57a1 block: 18969236
- current block number: 18975357

## Description

Changes necessary for diff history module.

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18969236 (main branch discovery), not current.

```diff
    contract StarkPerpetual (0xD54f502e184B6B739d7D27a6410a67dc462D69c8) {
      values.identify:
-        "StarkWare_PerpetualTokensAndRamping_2020_1"
    }
```

# Diff at Tue, 09 Jan 2024 11:54:37 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@75d008bcf5c1a0074ab8238c64ea85119a5c1f0e block: 18282753
- current block number: 18969236

## Description

Implementation of [Proposal DIP-29](https://dydx.community/dashboard/proposal/16)
intended to bridge ethDYDX tokens from Treasury on Ethereum to dYdX Chain.

## Watched changes

```diff
    contract Treasury (0x639192D54431F8c816368D3FB4107Bc168d0E871) {
      name:
-        "Treasury"
+        "TreasuryBridge"
      upgradeability.implementation:
-        "0x0AdA60E07717Ab19E4A466f5f0ac68A66e3995Ce"
+        "0x8d0051943D4c72aF12D638c6b7253C71929A910A"
      implementations.0:
-        "0x0AdA60E07717Ab19E4A466f5f0ac68A66e3995Ce"
+        "0x8d0051943D4c72aF12D638c6b7253C71929A910A"
      values.BRIDGE:
+        "0x46b2DeAe6eFf3011008EA27EA36b7c27255ddFA9"
      values.BURN_ADDRESS:
+        "0x0000000000000000000000000000000000000001"
      values.TREASURY_VESTER:
+        "0xb9431E19B29B952d9358025f680077C3Fd37292f"
    }
```

```diff
    contract TreasuryVester (0xb9431E19B29B952d9358025f680077C3Fd37292f) {
      values.recipient:
-        "0x639192D54431F8c816368D3FB4107Bc168d0E871"
+        "0x0000000000000000000000000000000000000001"
    }
```

## Source code changes

```diff
.../Treasury/implementation/meta.txt => /dev/null  |  2 -
 .../treasury/Treasury.sol => /dev/null             | 54 ------------
 .../dependencies/open-zeppelin/Address.sol         |  0
 .../dependencies/open-zeppelin/Context.sol         |  0
 .../open-zeppelin/OwnableUpgradeable.sol           |  0
 .../dependencies/open-zeppelin/SafeERC20.sol       |  0
 .../dependencies/open-zeppelin/SafeMath.sol        |  0
 .../implementation/governance/bridge/IBridge.sol   | 38 +++++++++
 .../implementation/interfaces/IERC20.sol           |  2 +-
 .../.code/TreasuryBridge/implementation/meta.txt   |  2 +
 .../implementation/treasury/Treasury.sol           | 65 +++++++++++++++
 .../implementation/treasury/TreasuryBridge.sol     | 84 +++++++++++++++++++
 .../implementation/treasury/TreasuryVester.sol     | 96 ++++++++++++++++++++++
 .../utils/VersionedInitializable.sol               |  0
 .../TreasuryBridge}/proxy/Address.sol              |  0
 .../proxy/AdminUpgradeabilityProxy.sol             |  0
 .../proxy/BaseAdminUpgradeabilityProxy.sol         |  0
 .../proxy/BaseUpgradeabilityProxy.sol              |  0
 .../InitializableAdminUpgradeabilityProxy.sol      |  0
 .../proxy/InitializableUpgradeabilityProxy.sol     |  0
 .../TreasuryBridge}/proxy/Proxy.sol                |  0
 .../TreasuryBridge}/proxy/UpgradeabilityProxy.sol  |  0
 .../TreasuryBridge}/proxy/meta.txt                 |  0
 23 files changed, 286 insertions(+), 57 deletions(-)
```

# Diff at Thu, 05 Oct 2023 07:17:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bd8583bb786deb2218b31cd53ffe833ba3b0b72a

## Description

Proposal: <https://dydx.community/dashboard/proposal/15>

TLDR: added wethDYDX in the calculation of governance power. wethDYDX is a token minted by locking Ethereum DYDX tokens (called ethDYDX) permanently which will be later bridged to the dYdX Chain. wethDYDX is a transferrable ERC20. Does this mean that tokens will get duplicated?

We don't have a specific section on the website to specify this information, but we will soon with the Governance section, so I'll wait before adding anything to the project page.

## Watched changes

```diff
    contract DydxGovernor (0x7E9B1672616FF6D6629Ef2879419aaE79A9018D2) {
      values.getGovernanceStrategy:
-        "0x90Dfd35F4a0BB2d30CDf66508085e33C353475D9"
+        "0xc2f5F3505910Da80F0592a3Cc023881C50b16505"
    }
```

```diff
-   Status: DELETED
    contract GovernanceStrategy (0x90Dfd35F4a0BB2d30CDf66508085e33C353475D9) {
    }
```

```diff
+   Status: CREATED
    contract WrappedEthereumDydxToken (0x46b2DeAe6eFf3011008EA27EA36b7c27255ddFA9) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceStrategyV2 (0xc2f5F3505910Da80F0592a3Cc023881C50b16505) {
    }
```

# Diff at Tue, 26 Sep 2023 11:49:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract SafetyModule (0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC) {
      values.slashings:
+        []
    }
```
