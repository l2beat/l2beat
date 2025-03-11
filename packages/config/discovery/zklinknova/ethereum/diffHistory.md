Generated with discovered.json: 0x6bbdcd5f5082dac2e9d760e5597a1cbd05321ea8

# Diff at Tue, 11 Mar 2025 08:13:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 22017779
- current block number: 22022360

## Description

proxyadmin template match.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22017779 (main branch discovery), not current.

```diff
    contract EthereumProxyAdmin (0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0xAd16eDCF7DEB7e90096A259c81269d811544B6B6"}]
      template:
+        "global/ProxyAdmin"
      displayName:
+        "ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0xAd16eDCF7DEB7e90096A259c81269d811544B6B6"}]
    }
```

```diff
    contract L1ERC20Bridge (0xAd16eDCF7DEB7e90096A259c81269d811544B6B6) {
    +++ description: None
      issuedPermissions.0.to:
-        "0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2"
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      issuedPermissions.0.via.0:
+        {"address":"0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2"}
    }
```

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"}
      receivedPermissions.9.from:
-        "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"
+        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
      receivedPermissions.8.from:
-        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
+        "0xAd16eDCF7DEB7e90096A259c81269d811544B6B6"
      receivedPermissions.8.via:
+        [{"address":"0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2"}]
    }
```

Generated with discovered.json: 0x0341f6d547f9a6cf03408dc3b24fe59a8ea8f6d7

# Diff at Tue, 04 Mar 2025 10:40:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20675743
- current block number: 20675743

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675743 (main branch discovery), not current.

```diff
    contract Arbitrator (0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002) {
    +++ description: None
      sinceBlock:
+        19338591
    }
```

```diff
    contract ArbitrumL1Gateway (0x273D59aed2d793167c162E64b9162154B07583C0) {
    +++ description: None
      sinceBlock:
+        19339109
    }
```

```diff
    contract EthereumProxyAdmin (0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2) {
    +++ description: None
      sinceBlock:
+        19340260
    }
```

```diff
    contract BlastL1Gateway (0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158) {
    +++ description: None
      sinceBlock:
+        19433179
    }
```

```diff
    contract BaseL1Gateway (0x4eEA93966AA5cd658225E0D43b665A5a491d2b7E) {
    +++ description: None
      sinceBlock:
+        19488957
    }
```

```diff
    contract zkLink (0x5fD9F73286b7E8683Bab45019C94553b93e015Cf) {
    +++ description: None
      sinceBlock:
+        19338891
    }
```

```diff
    contract MantaL1Gateway (0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D) {
    +++ description: None
      sinceBlock:
+        19339083
    }
```

```diff
    contract OptimismL1Gateway (0x668e8F67adB8219e1816C2E5bBEa055A78AF3026) {
    +++ description: None
      sinceBlock:
+        19488695
    }
```

```diff
    contract LineaL1Gateway (0x803460416C2682Ac54FccF03eF77b10A12f2809b) {
    +++ description: None
      sinceBlock:
+        19339075
    }
```

```diff
    contract EthereumL1Gateway (0x83Bc7394738A7A084081aF22EEC0051908c0055c) {
    +++ description: None
      sinceBlock:
+        19338906
    }
```

```diff
    contract ScrollL1Gateway (0x986c905087a663db3C81ad319b94c1E9dd388e92) {
    +++ description: None
      sinceBlock:
+        20059964
    }
```

```diff
    contract L1ERC20Bridge (0xAd16eDCF7DEB7e90096A259c81269d811544B6B6) {
    +++ description: None
      sinceBlock:
+        19340260
    }
```

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      sinceBlock:
+        17961693
    }
```

```diff
    contract MantleL1Gateway (0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269) {
    +++ description: None
      sinceBlock:
+        19339092
    }
```

```diff
    contract EraL1Gateway (0xeCD189e0f390826E137496a4e4a23ACf76c942Ab) {
    +++ description: None
      sinceBlock:
+        19339104
    }
```

Generated with discovered.json: 0x3c6126e41dbb1f79a6c1d220043ed99d9a115b72

# Diff at Mon, 20 Jan 2025 11:10:24 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20675743
- current block number: 20675743

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675743 (main branch discovery), not current.

```diff
    contract Arbitrator (0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      issuedPermissions.0.to:
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract ArbitrumL1Gateway (0x273D59aed2d793167c162E64b9162154B07583C0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      issuedPermissions.0.to:
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract EthereumProxyAdmin (0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xAd16eDCF7DEB7e90096A259c81269d811544B6B6"
      receivedPermissions.0.from:
+        "0xAd16eDCF7DEB7e90096A259c81269d811544B6B6"
    }
```

```diff
    contract BlastL1Gateway (0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      issuedPermissions.0.to:
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract BaseL1Gateway (0x4eEA93966AA5cd658225E0D43b665A5a491d2b7E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
      issuedPermissions.0.to:
+        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
    }
```

```diff
    contract zkLink (0x5fD9F73286b7E8683Bab45019C94553b93e015Cf) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      issuedPermissions.0.to:
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract MantaL1Gateway (0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      issuedPermissions.0.to:
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract OptimismL1Gateway (0x668e8F67adB8219e1816C2E5bBEa055A78AF3026) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
      issuedPermissions.0.to:
+        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
    }
```

```diff
    contract LineaL1Gateway (0x803460416C2682Ac54FccF03eF77b10A12f2809b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      issuedPermissions.0.to:
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract EthereumL1Gateway (0x83Bc7394738A7A084081aF22EEC0051908c0055c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      issuedPermissions.0.to:
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract ScrollL1Gateway (0x986c905087a663db3C81ad319b94c1E9dd388e92) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      issuedPermissions.0.to:
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract L1ERC20Bridge (0xAd16eDCF7DEB7e90096A259c81269d811544B6B6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2"
      issuedPermissions.0.to:
+        "0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2"
    }
```

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      receivedPermissions.9.target:
-        "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"
      receivedPermissions.9.from:
+        "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"
      receivedPermissions.8.target:
-        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
      receivedPermissions.8.from:
+        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
      receivedPermissions.7.target:
-        "0x986c905087a663db3C81ad319b94c1E9dd388e92"
      receivedPermissions.7.from:
+        "0x986c905087a663db3C81ad319b94c1E9dd388e92"
      receivedPermissions.6.target:
-        "0x83Bc7394738A7A084081aF22EEC0051908c0055c"
      receivedPermissions.6.from:
+        "0x83Bc7394738A7A084081aF22EEC0051908c0055c"
      receivedPermissions.5.target:
-        "0x803460416C2682Ac54FccF03eF77b10A12f2809b"
      receivedPermissions.5.from:
+        "0x803460416C2682Ac54FccF03eF77b10A12f2809b"
      receivedPermissions.4.target:
-        "0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D"
      receivedPermissions.4.from:
+        "0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D"
      receivedPermissions.3.target:
-        "0x5fD9F73286b7E8683Bab45019C94553b93e015Cf"
      receivedPermissions.3.from:
+        "0x5fD9F73286b7E8683Bab45019C94553b93e015Cf"
      receivedPermissions.2.target:
-        "0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158"
      receivedPermissions.2.from:
+        "0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158"
      receivedPermissions.1.target:
-        "0x273D59aed2d793167c162E64b9162154B07583C0"
      receivedPermissions.1.from:
+        "0x273D59aed2d793167c162E64b9162154B07583C0"
      receivedPermissions.0.target:
-        "0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002"
      receivedPermissions.0.from:
+        "0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002"
    }
```

```diff
    contract MantleL1Gateway (0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      issuedPermissions.0.to:
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract EraL1Gateway (0xeCD189e0f390826E137496a4e4a23ACf76c942Ab) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      issuedPermissions.0.to:
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

Generated with discovered.json: 0x2cf5da8910ffaaa3a29a7ac751dafede8f61ba2d

# Diff at Mon, 21 Oct 2024 11:24:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20675743
- current block number: 20675743

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675743 (main branch discovery), not current.

```diff
    contract Arbitrator (0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x7a0Bb4805EcB7fD3C8DAbbE4AFa0E91cB1761E34"]
      values.$pastUpgrades.2.1:
-        ["0x7a0Bb4805EcB7fD3C8DAbbE4AFa0E91cB1761E34"]
+        "0xee6a34e852c4927c2afcf361307e2245771cf97a2e57f02f46ce8e9dfdd4771f"
      values.$pastUpgrades.1.2:
+        ["0xb3EE39F57d96C3F2A5ab3886572dDc4EA34B529a"]
      values.$pastUpgrades.1.1:
-        ["0xb3EE39F57d96C3F2A5ab3886572dDc4EA34B529a"]
+        "0xd9a9e46b9d7321babc6608896c2d2438db12c25b92e96b39a705384560e4d67c"
      values.$pastUpgrades.0.2:
+        ["0xD2b679671354087ead3C683F48da4b738f0fC675"]
      values.$pastUpgrades.0.1:
-        ["0xD2b679671354087ead3C683F48da4b738f0fC675"]
+        "0x4982bb48f0071f234c1708804bd549ccb1b79f3eafdad5cdf644aeb3f9078553"
    }
```

```diff
    contract ArbitrumL1Gateway (0x273D59aed2d793167c162E64b9162154B07583C0) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xF69302b6fF21116F9266bFA2fbE4ee23f6292875"]
      values.$pastUpgrades.1.1:
-        ["0xF69302b6fF21116F9266bFA2fbE4ee23f6292875"]
+        "0x57a6a5ba63d2b0b231901f39e869036ada97f0c769faca33f45fcce37eb21aad"
      values.$pastUpgrades.0.2:
+        ["0xa005091c98e6793b90E1340Bbd36C5d6De36fB60"]
      values.$pastUpgrades.0.1:
-        ["0xa005091c98e6793b90E1340Bbd36C5d6De36fB60"]
+        "0x8ff3969fc5600c4a0f42b86a858be420ac1eb3005ca3a5766fa04844dd8cbfa1"
    }
```

```diff
    contract BlastL1Gateway (0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x01334Df58feE28db184ae9D11467F38F7437FD80"]
      values.$pastUpgrades.1.1:
-        ["0x01334Df58feE28db184ae9D11467F38F7437FD80"]
+        "0xee6a34e852c4927c2afcf361307e2245771cf97a2e57f02f46ce8e9dfdd4771f"
      values.$pastUpgrades.0.2:
+        ["0x1DFF9a84A7Df94084995cAE2feac4a31fBCf4c9E"]
      values.$pastUpgrades.0.1:
-        ["0x1DFF9a84A7Df94084995cAE2feac4a31fBCf4c9E"]
+        "0x5d17ffa3cd6b87a4abf52debbd5348ecdd275b5d20733277c7ac517cfa61f901"
    }
```

```diff
    contract BaseL1Gateway (0x4eEA93966AA5cd658225E0D43b665A5a491d2b7E) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x0C25f3ACCB17a9D60408D1c79bD7218073DAd518"]
      values.$pastUpgrades.0.1:
-        ["0x0C25f3ACCB17a9D60408D1c79bD7218073DAd518"]
+        "0x93767478c99ec84e15e69f2f18adb4fef4e1017c524c44088168d95d60d17419"
    }
```

```diff
    contract zkLink (0x5fD9F73286b7E8683Bab45019C94553b93e015Cf) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xeaC8E6c1acBabC7135Fc8357FF2D718a36177Ab7"]
      values.$pastUpgrades.2.1:
-        ["0xeaC8E6c1acBabC7135Fc8357FF2D718a36177Ab7"]
+        "0xee6a34e852c4927c2afcf361307e2245771cf97a2e57f02f46ce8e9dfdd4771f"
      values.$pastUpgrades.1.2:
+        ["0xCC8256b3eBF21e27f04E360eED012f5752c1F5DD"]
      values.$pastUpgrades.1.1:
-        ["0xCC8256b3eBF21e27f04E360eED012f5752c1F5DD"]
+        "0x6fb95bcc6d76a0ad1a5f53b1bf99fb6e40672ac789e931d5565691f473d13ced"
      values.$pastUpgrades.0.2:
+        ["0xA89aa7e3D34516EAB7129E401215d5d1239Ce715"]
      values.$pastUpgrades.0.1:
-        ["0xA89aa7e3D34516EAB7129E401215d5d1239Ce715"]
+        "0xbe3c99c5f0c926495895beed70b15cbc9fe4dfb1b541d08d1c4f9b6c7ff59ce5"
    }
```

```diff
    contract MantaL1Gateway (0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x6d6Ce5A491cC2BE2f56AA02aa68AaE8acE927962"]
      values.$pastUpgrades.1.1:
-        ["0x6d6Ce5A491cC2BE2f56AA02aa68AaE8acE927962"]
+        "0xb5a1a3bd4ba7f9fb2d0f3d22755881f2d6998f9dfaf6f70194659f71aedf86b8"
      values.$pastUpgrades.0.2:
+        ["0x161f4BAAb4052f20F5f4347eC4422556aA0477f0"]
      values.$pastUpgrades.0.1:
-        ["0x161f4BAAb4052f20F5f4347eC4422556aA0477f0"]
+        "0x4edc02a8e19662c19aa6263b39b11c5faa8be3312a83505f79e1c64352b20c53"
    }
```

```diff
    contract OptimismL1Gateway (0x668e8F67adB8219e1816C2E5bBEa055A78AF3026) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2e8AD1434663b209EE59eF1a6612114239F4a190"]
      values.$pastUpgrades.0.1:
-        ["0x2e8AD1434663b209EE59eF1a6612114239F4a190"]
+        "0x70ae3fc5f6442e19741bfcf455957088729aee976bb1b80d7224c4a37d2ce6bd"
    }
```

```diff
    contract LineaL1Gateway (0x803460416C2682Ac54FccF03eF77b10A12f2809b) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xD2ED3FA35be899fe850075946Fc7320bB4c18C29"]
      values.$pastUpgrades.1.1:
-        ["0xD2ED3FA35be899fe850075946Fc7320bB4c18C29"]
+        "0x2010b0544391cadef00257da2bf40d85288c1fc2bcc63e611cf89f5bd8e1d951"
      values.$pastUpgrades.0.2:
+        ["0x67EBB0b6273A2e5728410Af81609226A96ACcb3e"]
      values.$pastUpgrades.0.1:
-        ["0x67EBB0b6273A2e5728410Af81609226A96ACcb3e"]
+        "0x01bb57dff1464aa31b2871caddf2cd239068df11076fea2d6e041275eb5fc701"
    }
```

```diff
    contract EthereumL1Gateway (0x83Bc7394738A7A084081aF22EEC0051908c0055c) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x65c7B3E1B877131986247B49474834b0347eF332"]
      values.$pastUpgrades.2.1:
-        ["0x65c7B3E1B877131986247B49474834b0347eF332"]
+        "0xee6a34e852c4927c2afcf361307e2245771cf97a2e57f02f46ce8e9dfdd4771f"
      values.$pastUpgrades.1.2:
+        ["0x240cfBdb89eBc09b678b24ba5d640A27B7D3051b"]
      values.$pastUpgrades.1.1:
-        ["0x240cfBdb89eBc09b678b24ba5d640A27B7D3051b"]
+        "0x50a3b1abdbfb058cd85b72555a8734666f7b05f5ca0c1abd82559c61b54f237e"
      values.$pastUpgrades.0.2:
+        ["0x87743f9CccA4a6DFbFfB2856dC6839b1919a43FB"]
      values.$pastUpgrades.0.1:
-        ["0x87743f9CccA4a6DFbFfB2856dC6839b1919a43FB"]
+        "0x20bb9ab00c3acf52a01d22bb87c0af9ba1195ba50291c21cfc581322057d1ba4"
    }
```

```diff
    contract ScrollL1Gateway (0x986c905087a663db3C81ad319b94c1E9dd388e92) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xdB97dBF9c0A20aA8B4787563B6bE04e83E7ECDFB"]
      values.$pastUpgrades.0.1:
-        ["0xdB97dBF9c0A20aA8B4787563B6bE04e83E7ECDFB"]
+        "0x380f252111050403dc380bc5b2b0f894555743e4bcec985e41602b9abb40e2de"
    }
```

```diff
    contract L1ERC20Bridge (0xAd16eDCF7DEB7e90096A259c81269d811544B6B6) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x3203E813930bD710043c1d899fE38dD359307352"]
      values.$pastUpgrades.1.1:
-        ["0x3203E813930bD710043c1d899fE38dD359307352"]
+        "0xc9c60ef44c8cef2b33a3f0af91e3d064ea479d616c1aafd9d2535cc377be0382"
      values.$pastUpgrades.0.2:
+        ["0xc271a8e9eB2b10FCDe1709D76de6681249669D2e"]
      values.$pastUpgrades.0.1:
-        ["0xc271a8e9eB2b10FCDe1709D76de6681249669D2e"]
+        "0x185cdd8d3ef12b9ccfb69bde86098b46813cd9c97ceda3d290a008be59c7fd19"
    }
```

```diff
    contract MantleL1Gateway (0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xe98EDDAd1f49abc7586eE516d019D834FBDc2951"]
      values.$pastUpgrades.1.1:
-        ["0xe98EDDAd1f49abc7586eE516d019D834FBDc2951"]
+        "0x36b3bf7e49f03b37dc4fc5ffc4086d6a93dfea8536e80ffde066de879db7f2cd"
      values.$pastUpgrades.0.2:
+        ["0xa86ef37098C0507196A5f411AfFbf8f51FCe9637"]
      values.$pastUpgrades.0.1:
-        ["0xa86ef37098C0507196A5f411AfFbf8f51FCe9637"]
+        "0x373a2fba4cbf35d0dbe1e93d4c3d3a5cec9853c84b81b6088f3aa6990f22f4f1"
    }
```

```diff
    contract EraL1Gateway (0xeCD189e0f390826E137496a4e4a23ACf76c942Ab) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0x59Ad3580c9e0992D474954327f5879AF5B3e4a22"]
      values.$pastUpgrades.3.1:
-        ["0x59Ad3580c9e0992D474954327f5879AF5B3e4a22"]
+        "0xee6a34e852c4927c2afcf361307e2245771cf97a2e57f02f46ce8e9dfdd4771f"
      values.$pastUpgrades.2.2:
+        ["0x8915B1750f337342F2b6A2eF1BF12e279e3b497E"]
      values.$pastUpgrades.2.1:
-        ["0x8915B1750f337342F2b6A2eF1BF12e279e3b497E"]
+        "0x337b3879d9a4e751f6aff14cdb948d3b5cb63cbb60233cbd789adca9205d4aaa"
      values.$pastUpgrades.1.2:
+        ["0x04bF7cf48a68dfC744fc22662B90e2ecaf14D716"]
      values.$pastUpgrades.1.1:
-        ["0x04bF7cf48a68dfC744fc22662B90e2ecaf14D716"]
+        "0xc24ab17a2b61d12b44999bbb861baf3f0f73b59881c80fae8c9763f83c7d1219"
      values.$pastUpgrades.0.2:
+        ["0xFF2568C81453a0741b1b97f3Fe598B07a927d79E"]
      values.$pastUpgrades.0.1:
-        ["0xFF2568C81453a0741b1b97f3Fe598B07a927d79E"]
+        "0xa8070c4addf0258525ca69e13ee1d2d7a5098c0a7ffd29ec28f1920f4fc465b8"
    }
```

Generated with discovered.json: 0xa0a5e09f5db3e17be3c9659d71a2185b495553ae

# Diff at Mon, 14 Oct 2024 10:58:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20675743
- current block number: 20675743

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675743 (main branch discovery), not current.

```diff
    contract Arbitrator (0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0xff7b9bda4ccb0ae0e1775f82206c54ef89c794f6b4ffa42edbb65996bf7d0e8c"]
    }
```

```diff
    contract ArbitrumL1Gateway (0x273D59aed2d793167c162E64b9162154B07583C0) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x9158bf76b126cdaa6a8fe310085a77d400ab2458c21f79e637846d8bc3cc2a13"]
    }
```

```diff
    contract EthereumProxyAdmin (0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2) {
    +++ description: None
      sourceHashes:
+        ["0x8fd8f837bb320bd2a7463c103bea2ff207b0969b5795f320a6c868858aa92074"]
    }
```

```diff
    contract BlastL1Gateway (0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0xc39118a9cebca411d42cb5759e7387270a0a8472860288b0e01aa3235777afe5"]
    }
```

```diff
    contract BaseL1Gateway (0x4eEA93966AA5cd658225E0D43b665A5a491d2b7E) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x9487f6c6e032e98bef376a27f09d5a3e8c83a059eaf6d8b092c80138cb37459f"]
    }
```

```diff
    contract zkLink (0x5fD9F73286b7E8683Bab45019C94553b93e015Cf) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x9d3b6cf7c8756dc6cce424dc754ed146f84d3201e5223d47b0a4fcd994a76a7f"]
    }
```

```diff
    contract MantaL1Gateway (0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0xb3ae8d5bec68fa0994192ecdc4f2ad4126bb1ef22051378f5b605d59193955e4"]
    }
```

```diff
    contract OptimismL1Gateway (0x668e8F67adB8219e1816C2E5bBEa055A78AF3026) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x9487f6c6e032e98bef376a27f09d5a3e8c83a059eaf6d8b092c80138cb37459f"]
    }
```

```diff
    contract LineaL1Gateway (0x803460416C2682Ac54FccF03eF77b10A12f2809b) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x7f9e12d70f78945c6ea417774b5faf2e0a78ed4fbbdcaec591bf123428f28197"]
    }
```

```diff
    contract EthereumL1Gateway (0x83Bc7394738A7A084081aF22EEC0051908c0055c) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x6f5cdba451da8c1759148644f4daf8344ed2853d765413e18cd2fcf662f4694a"]
    }
```

```diff
    contract ScrollL1Gateway (0x986c905087a663db3C81ad319b94c1E9dd388e92) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x91cc3c90f1b2c05558c8c2f9575ffcc8f7cb39a023073a028d6b6abb3986d601"]
    }
```

```diff
    contract L1ERC20Bridge (0xAd16eDCF7DEB7e90096A259c81269d811544B6B6) {
    +++ description: None
      sourceHashes:
+        ["0x8c407edc4ac1fa1cea2c45903e2cf0158906a2ff39fc2eb92aca3ca9f0d43ed8","0xcabc91ee17e9a771bb999a95f4705966cf206325fc82ac15d440c8b6086f9679"]
    }
```

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract MantleL1Gateway (0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0xb3ae8d5bec68fa0994192ecdc4f2ad4126bb1ef22051378f5b605d59193955e4"]
    }
```

```diff
    contract EraL1Gateway (0xeCD189e0f390826E137496a4e4a23ACf76c942Ab) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x070067bfd007d5f15c96e1e404a8b9b5eab4a2616d8ea8ebeab0a22f58262461"]
    }
```

Generated with discovered.json: 0x9281dc62a7c1cbfda3c467c88bf7126945197cb9

# Diff at Tue, 01 Oct 2024 11:12:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20675743
- current block number: 20675743

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675743 (main branch discovery), not current.

```diff
    contract Arbitrator (0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T06:39:59.000Z",["0xD2b679671354087ead3C683F48da4b738f0fC675"]],["2024-03-09T10:40:35.000Z",["0xb3EE39F57d96C3F2A5ab3886572dDc4EA34B529a"]],["2024-04-20T12:21:59.000Z",["0x7a0Bb4805EcB7fD3C8DAbbE4AFa0E91cB1761E34"]]]
    }
```

```diff
    contract ArbitrumL1Gateway (0x273D59aed2d793167c162E64b9162154B07583C0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T08:23:35.000Z",["0xa005091c98e6793b90E1340Bbd36C5d6De36fB60"]],["2024-03-09T10:43:11.000Z",["0xF69302b6fF21116F9266bFA2fbE4ee23f6292875"]]]
    }
```

```diff
    contract BlastL1Gateway (0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-14T12:14:35.000Z",["0x1DFF9a84A7Df94084995cAE2feac4a31fBCf4c9E"]],["2024-04-20T12:21:59.000Z",["0x01334Df58feE28db184ae9D11467F38F7437FD80"]]]
    }
```

```diff
    contract BaseL1Gateway (0x4eEA93966AA5cd658225E0D43b665A5a491d2b7E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T08:24:47.000Z",["0x0C25f3ACCB17a9D60408D1c79bD7218073DAd518"]]]
    }
```

```diff
    contract zkLink (0x5fD9F73286b7E8683Bab45019C94553b93e015Cf) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T07:39:59.000Z",["0xA89aa7e3D34516EAB7129E401215d5d1239Ce715"]],["2024-03-09T10:10:11.000Z",["0xCC8256b3eBF21e27f04E360eED012f5752c1F5DD"]],["2024-04-20T12:21:59.000Z",["0xeaC8E6c1acBabC7135Fc8357FF2D718a36177Ab7"]]]
    }
```

```diff
    contract MantaL1Gateway (0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T08:18:23.000Z",["0x161f4BAAb4052f20F5f4347eC4422556aA0477f0"]],["2024-03-09T10:47:11.000Z",["0x6d6Ce5A491cC2BE2f56AA02aa68AaE8acE927962"]]]
    }
```

```diff
    contract OptimismL1Gateway (0x668e8F67adB8219e1816C2E5bBEa055A78AF3026) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T07:31:47.000Z",["0x2e8AD1434663b209EE59eF1a6612114239F4a190"]]]
    }
```

```diff
    contract LineaL1Gateway (0x803460416C2682Ac54FccF03eF77b10A12f2809b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T08:16:47.000Z",["0x67EBB0b6273A2e5728410Af81609226A96ACcb3e"]],["2024-03-09T10:45:11.000Z",["0xD2ED3FA35be899fe850075946Fc7320bB4c18C29"]]]
    }
```

```diff
    contract EthereumL1Gateway (0x83Bc7394738A7A084081aF22EEC0051908c0055c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T07:42:59.000Z",["0x87743f9CccA4a6DFbFfB2856dC6839b1919a43FB"]],["2024-03-09T10:41:35.000Z",["0x240cfBdb89eBc09b678b24ba5d640A27B7D3051b"]],["2024-04-20T12:21:59.000Z",["0x65c7B3E1B877131986247B49474834b0347eF332"]]]
    }
```

```diff
    contract ScrollL1Gateway (0x986c905087a663db3C81ad319b94c1E9dd388e92) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-10T07:33:11.000Z",["0xdB97dBF9c0A20aA8B4787563B6bE04e83E7ECDFB"]]]
    }
```

```diff
    contract L1ERC20Bridge (0xAd16eDCF7DEB7e90096A259c81269d811544B6B6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T12:15:23.000Z",["0xc271a8e9eB2b10FCDe1709D76de6681249669D2e"]],["2024-04-04T06:23:47.000Z",["0x3203E813930bD710043c1d899fE38dD359307352"]]]
    }
```

```diff
    contract MantleL1Gateway (0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T08:20:11.000Z",["0xa86ef37098C0507196A5f411AfFbf8f51FCe9637"]],["2024-03-09T10:46:11.000Z",["0xe98EDDAd1f49abc7586eE516d019D834FBDc2951"]]]
    }
```

```diff
    contract EraL1Gateway (0xeCD189e0f390826E137496a4e4a23ACf76c942Ab) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T08:22:35.000Z",["0xFF2568C81453a0741b1b97f3Fe598B07a927d79E"]],["2024-03-05T07:02:23.000Z",["0x04bF7cf48a68dfC744fc22662B90e2ecaf14D716"]],["2024-03-09T10:44:11.000Z",["0x8915B1750f337342F2b6A2eF1BF12e279e3b497E"]],["2024-04-20T12:21:59.000Z",["0x59Ad3580c9e0992D474954327f5879AF5B3e4a22"]]]
    }
```

Generated with discovered.json: 0x724ebaf74ecc31838a2726032cc7f4dbf1157f46

# Diff at Wed, 04 Sep 2024 07:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@878a951312cec062f5003f6749f781861b0cdba1 block: 20389275
- current block number: 20675743

## Description

Set forwardFeeAllocator to EthereumOwner MS. (And withdraw 15 ETH of fees). The forwardFee consists of fees paid to 'validators' for `requestL2Transaction()`. One signer of EthereumOwner MS is changed.

## Watched changes

```diff
    contract zkLink (0x5fD9F73286b7E8683Bab45019C94553b93e015Cf) {
    +++ description: None
      values.forwardFeeAllocator:
-        "0x0000000000000000000000000000000000000000"
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      values.$members.5:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
      values.$members.4:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "0xC75EFCffEE930706daec5CaCA012551f6a1845D7"
      values.$members.3:
-        "0xC75EFCffEE930706daec5CaCA012551f6a1845D7"
+        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
      values.$members.2:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
      values.$members.1:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
      values.$members.0:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
    }
```

Generated with discovered.json: 0x8a30aed7137282cb4bd3ba55a944b709fc7b8a1f

# Diff at Fri, 30 Aug 2024 08:01:44 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20389275
- current block number: 20389275

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389275 (main branch discovery), not current.

```diff
    contract EthereumProxyAdmin (0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      receivedPermissions.9.via:
-        []
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x3b88e8afdd381e9d7f2f7e669da66f71644d3f2a

# Diff at Fri, 23 Aug 2024 09:56:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20389275
- current block number: 20389275

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389275 (main branch discovery), not current.

```diff
    contract Arbitrator (0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract ArbitrumL1Gateway (0x273D59aed2d793167c162E64b9162154B07583C0) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract BlastL1Gateway (0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract BaseL1Gateway (0x4eEA93966AA5cd658225E0D43b665A5a491d2b7E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract zkLink (0x5fD9F73286b7E8683Bab45019C94553b93e015Cf) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract MantaL1Gateway (0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract OptimismL1Gateway (0x668e8F67adB8219e1816C2E5bBEa055A78AF3026) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract LineaL1Gateway (0x803460416C2682Ac54FccF03eF77b10A12f2809b) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract EthereumL1Gateway (0x83Bc7394738A7A084081aF22EEC0051908c0055c) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract ScrollL1Gateway (0x986c905087a663db3C81ad319b94c1E9dd388e92) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Bridge (0xAd16eDCF7DEB7e90096A259c81269d811544B6B6) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract MantleL1Gateway (0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract EraL1Gateway (0xeCD189e0f390826E137496a4e4a23ACf76c942Ab) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

Generated with discovered.json: 0x8d6ddf15c40cfd5925b8a53c7bea3c0cf263e367

# Diff at Wed, 21 Aug 2024 10:06:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20389275
- current block number: 20389275

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389275 (main branch discovery), not current.

```diff
    contract Arbitrator (0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb4D755E3b8735314147b9bB146327C269701E2D","via":[]}]
    }
```

```diff
    contract ArbitrumL1Gateway (0x273D59aed2d793167c162E64b9162154B07583C0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb4D755E3b8735314147b9bB146327C269701E2D","via":[]}]
    }
```

```diff
    contract EthereumProxyAdmin (0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xAd16eDCF7DEB7e90096A259c81269d811544B6B6"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xAd16eDCF7DEB7e90096A259c81269d811544B6B6","via":[]}]
    }
```

```diff
    contract BlastL1Gateway (0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb4D755E3b8735314147b9bB146327C269701E2D","via":[]}]
    }
```

```diff
    contract BaseL1Gateway (0x4eEA93966AA5cd658225E0D43b665A5a491d2b7E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9","via":[]}]
    }
```

```diff
    contract zkLink (0x5fD9F73286b7E8683Bab45019C94553b93e015Cf) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb4D755E3b8735314147b9bB146327C269701E2D","via":[]}]
    }
```

```diff
    contract MantaL1Gateway (0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb4D755E3b8735314147b9bB146327C269701E2D","via":[]}]
    }
```

```diff
    contract OptimismL1Gateway (0x668e8F67adB8219e1816C2E5bBEa055A78AF3026) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9","via":[]}]
    }
```

```diff
    contract LineaL1Gateway (0x803460416C2682Ac54FccF03eF77b10A12f2809b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb4D755E3b8735314147b9bB146327C269701E2D","via":[]}]
    }
```

```diff
    contract EthereumL1Gateway (0x83Bc7394738A7A084081aF22EEC0051908c0055c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb4D755E3b8735314147b9bB146327C269701E2D","via":[]}]
    }
```

```diff
    contract ScrollL1Gateway (0x986c905087a663db3C81ad319b94c1E9dd388e92) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb4D755E3b8735314147b9bB146327C269701E2D","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0xAd16eDCF7DEB7e90096A259c81269d811544B6B6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2","via":[]}]
    }
```

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002","0x273D59aed2d793167c162E64b9162154B07583C0","0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158","0x5fD9F73286b7E8683Bab45019C94553b93e015Cf","0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D","0x803460416C2682Ac54FccF03eF77b10A12f2809b","0x83Bc7394738A7A084081aF22EEC0051908c0055c","0x986c905087a663db3C81ad319b94c1E9dd388e92","0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269","0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002","via":[]},{"permission":"upgrade","target":"0x273D59aed2d793167c162E64b9162154B07583C0","via":[]},{"permission":"upgrade","target":"0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158","via":[]},{"permission":"upgrade","target":"0x5fD9F73286b7E8683Bab45019C94553b93e015Cf","via":[]},{"permission":"upgrade","target":"0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D","via":[]},{"permission":"upgrade","target":"0x803460416C2682Ac54FccF03eF77b10A12f2809b","via":[]},{"permission":"upgrade","target":"0x83Bc7394738A7A084081aF22EEC0051908c0055c","via":[]},{"permission":"upgrade","target":"0x986c905087a663db3C81ad319b94c1E9dd388e92","via":[]},{"permission":"upgrade","target":"0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269","via":[]},{"permission":"upgrade","target":"0xeCD189e0f390826E137496a4e4a23ACf76c942Ab","via":[]}]
    }
```

```diff
    contract MantleL1Gateway (0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb4D755E3b8735314147b9bB146327C269701E2D","via":[]}]
    }
```

```diff
    contract EraL1Gateway (0xeCD189e0f390826E137496a4e4a23ACf76c942Ab) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb4D755E3b8735314147b9bB146327C269701E2D","via":[]}]
    }
```

Generated with discovered.json: 0xaf2aa8acf3242c7ea466c9adf4e46b5b5631c8b2

# Diff at Fri, 09 Aug 2024 12:03:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20389275
- current block number: 20389275

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389275 (main branch discovery), not current.

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      assignedPermissions.upgrade.9:
-        "0x803460416C2682Ac54FccF03eF77b10A12f2809b"
+        "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"
      assignedPermissions.upgrade.8:
-        "0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002"
+        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
      assignedPermissions.upgrade.7:
-        "0x83Bc7394738A7A084081aF22EEC0051908c0055c"
+        "0x986c905087a663db3C81ad319b94c1E9dd388e92"
      assignedPermissions.upgrade.6:
-        "0x986c905087a663db3C81ad319b94c1E9dd388e92"
+        "0x83Bc7394738A7A084081aF22EEC0051908c0055c"
      assignedPermissions.upgrade.5:
-        "0x273D59aed2d793167c162E64b9162154B07583C0"
+        "0x803460416C2682Ac54FccF03eF77b10A12f2809b"
      assignedPermissions.upgrade.4:
-        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
+        "0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D"
      assignedPermissions.upgrade.3:
-        "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"
+        "0x5fD9F73286b7E8683Bab45019C94553b93e015Cf"
      assignedPermissions.upgrade.1:
-        "0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D"
+        "0x273D59aed2d793167c162E64b9162154B07583C0"
      assignedPermissions.upgrade.0:
-        "0x5fD9F73286b7E8683Bab45019C94553b93e015Cf"
+        "0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002"
    }
```

Generated with discovered.json: 0xb371747445419ec29fa13f67744c8632cccd2814

# Diff at Fri, 09 Aug 2024 10:13:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20389275
- current block number: 20389275

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389275 (main branch discovery), not current.

```diff
    contract EthereumProxyAdmin (0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xAd16eDCF7DEB7e90096A259c81269d811544B6B6"]
      assignedPermissions.upgrade:
+        ["0xAd16eDCF7DEB7e90096A259c81269d811544B6B6"]
    }
```

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002","0x273D59aed2d793167c162E64b9162154B07583C0","0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158","0x5fD9F73286b7E8683Bab45019C94553b93e015Cf","0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D","0x803460416C2682Ac54FccF03eF77b10A12f2809b","0x83Bc7394738A7A084081aF22EEC0051908c0055c","0x986c905087a663db3C81ad319b94c1E9dd388e92","0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269","0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"]
      assignedPermissions.upgrade:
+        ["0x5fD9F73286b7E8683Bab45019C94553b93e015Cf","0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D","0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158","0xeCD189e0f390826E137496a4e4a23ACf76c942Ab","0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269","0x273D59aed2d793167c162E64b9162154B07583C0","0x986c905087a663db3C81ad319b94c1E9dd388e92","0x83Bc7394738A7A084081aF22EEC0051908c0055c","0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002","0x803460416C2682Ac54FccF03eF77b10A12f2809b"]
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0x1429d9ddac3ecc8a4b4dc214718d0c0d33972334

# Diff at Fri, 26 Jul 2024 07:37:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20289552
- current block number: 20389275

## Description

The ScrollL1Gateway admin and owner are changed from the zkLinkNova deployer to the EthereumOwner MS. The same MS is already owner and admin of all other gateways on ethereum.

## Watched changes

```diff
    contract ScrollL1Gateway (0x986c905087a663db3C81ad319b94c1E9dd388e92) {
    +++ description: None
      values.$admin:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
      values.owner:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "0xdb4D755E3b8735314147b9bB146327C269701E2D"
    }
```

```diff
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D) {
    +++ description: None
      assignedPermissions.admin.9:
+        "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"
      assignedPermissions.admin.8:
-        "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab"
+        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
      assignedPermissions.admin.7:
-        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
+        "0x986c905087a663db3C81ad319b94c1E9dd388e92"
      values.$multisigThreshold:
-        "6 of 8 (75%)"
+        "5 of 8 (63%)"
      values.getThreshold:
-        6
+        5
    }
```

Generated with discovered.json: 0x35ed1bc9d854f4ae1497773397ef884bc0f57ae9

# Diff at Fri, 05 Jul 2024 13:17:46 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20240549

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Arbitrator (0x1Ee09A2cAa0813A5183f90F5a6d0E4871f4C6002)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumL1Gateway (0x273D59aed2d793167c162E64b9162154B07583C0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthereumProxyAdmin (0x315255c1bA35A1DdAc48CF054bc4e3a0929160b2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlastL1Gateway (0x41FaF46Ca4Dfd912B65B66D29BdD432782BB1158)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseL1Gateway (0x4eEA93966AA5cd658225E0D43b665A5a491d2b7E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0x5fD9F73286b7E8683Bab45019C94553b93e015Cf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MantaL1Gateway (0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismL1Gateway (0x668e8F67adB8219e1816C2E5bBEa055A78AF3026)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LineaL1Gateway (0x803460416C2682Ac54FccF03eF77b10A12f2809b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthereumL1Gateway (0x83Bc7394738A7A084081aF22EEC0051908c0055c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollL1Gateway (0x986c905087a663db3C81ad319b94c1E9dd388e92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0xAd16eDCF7DEB7e90096A259c81269d811544B6B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthereumOwner (0xdb4D755E3b8735314147b9bB146327C269701E2D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MantleL1Gateway (0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EraL1Gateway (0xeCD189e0f390826E137496a4e4a23ACf76c942Ab)
    +++ description: None
```
