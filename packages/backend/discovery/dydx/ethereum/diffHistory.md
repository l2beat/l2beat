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
