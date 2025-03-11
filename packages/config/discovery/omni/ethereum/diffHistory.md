Generated with discovered.json: 0xec3682f6f47fd625806a10d787c071b2a904874e

# Diff at Thu, 06 Mar 2025 15:19:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21744158
- current block number: 21981875

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Watched changes

```diff
    contract HashiManager (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9) {
    +++ description: None
      values.adapters.0:
-        "0x3A259A51D200d902AC25BE2005d95EADA6a1bfc5"
+        "0xCEb436489e9C6d9E4Db76145A6CCE2a06411ea0A"
    }
```

Generated with discovered.json: 0x50a086bdf86b2f41065d6a596c34836168a3c496

# Diff at Tue, 04 Mar 2025 10:39:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21744158
- current block number: 21744158

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744158 (main branch discovery), not current.

```diff
    contract OmniBridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      sinceBlock:
+        10925774
    }
```

```diff
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43) {
    +++ description: None
      sinceBlock:
+        17420395
    }
```

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
    +++ description: None
      sinceBlock:
+        9298324
    }
```

```diff
    contract Safe (0x670a3e447F4DE92C012777Ac5591D81E12aD0957) {
    +++ description: None
      sinceBlock:
+        20977347
    }
```

```diff
    contract TokenFactory (0x71d5ba4e37de72415F685490B684538Aae8f0424) {
    +++ description: None
      sinceBlock:
+        13421129
    }
```

```diff
    contract PermittableToken (0x7c24d0061b484B267F286aa2DCe891220Db254b3) {
    +++ description: None
      sinceBlock:
+        13421099
    }
```

```diff
    contract AAVEInterestERC20 (0x87D48c565D0D85770406D248efd7dc3cbd41e729) {
    +++ description: None
      sinceBlock:
+        13421159
    }
```

```diff
    contract MultiTokenMediator (0x88ad09518695c6c3712AC10a214bE5109a655671) {
    +++ description: None
      sinceBlock:
+        10590093
    }
```

```diff
    contract HashiManager (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9) {
    +++ description: None
      sinceBlock:
+        20724523
    }
```

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
      sinceBlock:
+        9298314
    }
```

Generated with discovered.json: 0x5f57255303c11288cadec2af83c32902817b8a8e

# Diff at Fri, 31 Jan 2025 11:17:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@84b1296dd423a2ef9361874d922cd6911109ba10 block: 21679341
- current block number: 21744158

## Description

OmniBridgeGovernance MS changes (4 signers changed).

## Watched changes

```diff
    contract OmniBridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      values.$members.15:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "0x544cE64C3Fc6Da72CEB2456CC4cF19E7c7972eFA"
      values.$members.13:
-        "0xd26a3F686D43f2A62BA9eaE2ff77e9f516d945B9"
+        "0xb2a33ae0E07fD2ca8DBdE9545F6ce0b3234dc4e8"
      values.$members.6:
-        "0x0101016044726994aFd16f4A99f0d960090D35e7"
+        "0xcF9ebF877688Ed88a7479A6e63457Fd78D4275cE"
      values.$members.5:
-        "0x1685324Bf373670ad5C9c56bd88A1dc1C063b0f9"
+        "0x329c54289Ff5D6B7b7daE13592C6B1EDA1543eD4"
    }
```

Generated with discovered.json: 0x69bf6a8d9d63f7e172c9d0d2971df516db7d1429

# Diff at Wed, 22 Jan 2025 10:10:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 21579380
- current block number: 21679341

## Description

sub-MS owner change.

## Watched changes

```diff
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43) {
    +++ description: None
      values.$members.2:
-        "0x3b3Cd747Ab7bf2BE3b950693deeDe8a0B96C4fF0"
+        "0x52F05Eff62fC36c83d840D9684daCAD3be43D8bf"
    }
```

Generated with discovered.json: 0xe2d1d68cc760157d9da2710a3ea1520096eff046

# Diff at Mon, 20 Jan 2025 11:09:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21579380
- current block number: 21579380

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579380 (main branch discovery), not current.

```diff
    contract OmniBridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      receivedPermissions.2.target:
-        "0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064"
      receivedPermissions.2.from:
+        "0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064"
      receivedPermissions.1.target:
-        "0x88ad09518695c6c3712AC10a214bE5109a655671"
      receivedPermissions.1.from:
+        "0x88ad09518695c6c3712AC10a214bE5109a655671"
      receivedPermissions.0.target:
-        "0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e"
      receivedPermissions.0.from:
+        "0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e"
    }
```

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6"
      issuedPermissions.0.to:
+        "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6"
    }
```

```diff
    contract MultiTokenMediator (0x88ad09518695c6c3712AC10a214bE5109a655671) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6"
      issuedPermissions.0.to:
+        "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6"
    }
```

```diff
    contract HashiManager (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x30Fb61178F39c0452cED4AD9A7FEC3344CB10B2E"
      issuedPermissions.0.to:
+        "0x30Fb61178F39c0452cED4AD9A7FEC3344CB10B2E"
    }
```

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6"
      issuedPermissions.0.to:
+        "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6"
    }
```

Generated with discovered.json: 0x3cf15bbf09c942810f45bdc12b41ad94c8b309bb

# Diff at Mon, 20 Jan 2025 09:25:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21579380
- current block number: 21579380

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579380 (main branch discovery), not current.

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
      fieldMeta.validatorList.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0xb29db7782b209f4c6705d03393b3d8139a13f482

# Diff at Wed, 08 Jan 2025 11:13:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21428761
- current block number: 21579380

## Description

New expected adapters hash, Hashi still optional.

## Watched changes

```diff
    contract HashiManager (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9) {
    +++ description: None
      values.expectedAdaptersHash:
-        "0x1f8c600da3ac9efbad8aeccc97ebbdc71e7f928fbc2589cd663f5063c0f4af52"
+        "0x0a74748a93656acd952c12f9e5b2b6a3eead25ba1c94ffa6ddb26f454a179cae"
    }
```

Generated with discovered.json: 0xa110d151b4ecd24c5245269a01c27963881e38cb

# Diff at Wed, 18 Dec 2024 10:36:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 21071443
- current block number: 21428761

## Description

The requiredBlockConfirmations of the bridge are raised to 175.

Two OmniBridgeGovernance MS members are changed.

The expectedAdaptersHash of the HashiManager changed without our discovery recognizing the change in adapters. For ref: [Tenderly trace of setting the two adapters](https://dashboard.tenderly.co/tx/mainnet/0xc45be0d0becee51c0d8985169217231ddfdc2d1f62b5961b0eb04e04c6605bde) `0x7606e9d8655e48159e7bec8541c2e71a7aa3e418` (LayerZero) and `0xcbb5c5e8b7ae3fc01eeb2c8fecdc609df7d21a19` ([DendrETH](https://github.com/metacraft-labs/DendrETH)) while we still discover only `0x3A259A51D200d902AC25BE2005d95EADA6a1bfc5` for the `adapters` value. Looking at the code, this is apparently how the HashiManager contract is supposed to work as it does not save new adapter addresses when setting a new expected adapters hash.

Hashi is still optional for bridging (`HASHI_IS_MANDATORY=false`).

## Watched changes

```diff
    contract OmniBridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      values.$members.4:
-        "0x86Da253817DC599059e3AD5A1F098F7b96aBf34c"
+        "0xA07888742c18d7e658132AE0148fF205fFF46481"
      values.$members.3:
-        "0xAC0622953d25e1a6c4e0f32Ffc1A9C1cE350B60E"
+        "0xf59E447E97bC03c2B0C5719e2E551F0B15b724e5"
    }
```

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
    +++ description: None
      values.requiredBlockConfirmations:
-        130
+        175
    }
```

```diff
    contract HashiManager (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9) {
    +++ description: None
      values.expectedAdaptersHash:
-        "0x6b603f4a7f51661e39122b2cc2745ffbc56eca92e59f655d365cd5170d930c0a"
+        "0x1f8c600da3ac9efbad8aeccc97ebbdc71e7f928fbc2589cd663f5063c0f4af52"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21071443 (main branch discovery), not current.

```diff
    contract OmniBridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      name:
-        "BridgeGovernance"
+        "OmniBridgeGovernance"
    }
```

```diff
    contract HashiManager (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9) {
    +++ description: None
      values.AdaptersFromStorage:
+        "0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x67450b31edfaadab300dc80a39f10000188eee25

# Diff at Tue, 03 Dec 2024 13:12:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@62514a3ae1e0d198a488f9c1029dd57ab15c60f6 block: 21071443
- current block number: 21071443

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21071443 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43)
    +++ description: None
```

Generated with discovered.json: 0x800925fe243370aecbf94f1313ff3237591234ee

# Diff at Tue, 29 Oct 2024 12:59:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041846
- current block number: 21071443

## Description

Ignore sub-multisigs of the BridgeGovernance Multisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041846 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43)
    +++ description: None
```

Generated with discovered.json: 0x2a4d2c101e242cfadd5cb5292326be1710a212e5

# Diff at Fri, 25 Oct 2024 09:51:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20985714
- current block number: 21041846

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20985714 (main branch discovery), not current.

```diff
    contract Safe (0x670a3e447F4DE92C012777Ac5591D81E12aD0957) {
    +++ description: None
      values.getOwners:
-        ["0xeca6EAa2C77d8f0aA9247e681C64455deAae51aC","0x0577FEC70907676039f7DAF961F8A44bda3Ea9Af","0xB1dD1828794075f7521365163A93DE9e68e3c49f","0x9bd93c5ad5e0a6be890c82FD77eE42ce8B642eF8"]
      values.getThreshold:
-        2
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x6554f78511be3b9326eecbd80904fa96fd8bb1bd

# Diff at Mon, 21 Oct 2024 11:08:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20985714
- current block number: 20985714

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20985714 (main branch discovery), not current.

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0x098f51bdfb5D6d319DD4FDf06b64773d25bD1316"]
      values.$pastUpgrades.5.1:
-        ["0x098f51bdfb5D6d319DD4FDf06b64773d25bD1316"]
+        "0x3ef23ae6e10cbe0bf6b08df489a829047fa8d1376f2aa2f079cdce9a9342d086"
      values.$pastUpgrades.4.2:
+        ["0x82B67a43b69914E611710C62e629dAbB2f7AC6AB"]
      values.$pastUpgrades.4.1:
-        ["0x82B67a43b69914E611710C62e629dAbB2f7AC6AB"]
+        "0x41b432a66ed945c9d33c0e77de7e9523bb216e421b27b8f3e4e8dbef34b4f5cd"
      values.$pastUpgrades.3.2:
+        ["0x872796bf7Fe754754d2BEE2c66D7de9B04a5C943"]
      values.$pastUpgrades.3.1:
-        ["0x872796bf7Fe754754d2BEE2c66D7de9B04a5C943"]
+        "0x0508a2fb3129be470493478041780a59632d56a5fb131ec1c11b23702a904d7e"
      values.$pastUpgrades.2.2:
+        ["0x54c6dFBB807BE694841A0F1B84CbC49D8FC98ed7"]
      values.$pastUpgrades.2.1:
-        ["0x54c6dFBB807BE694841A0F1B84CbC49D8FC98ed7"]
+        "0xd0b4d072c9581c7cbbb900287a915e644d0d9c2f3fc8d19cf6ab1424037388b4"
      values.$pastUpgrades.1.2:
+        ["0x2946f6D458F8Cf8723A1d9e95043831D3937461e"]
      values.$pastUpgrades.1.1:
-        ["0x2946f6D458F8Cf8723A1d9e95043831D3937461e"]
+        "0x4401dfe716f0d2cfa06849f179b07cc7783caaea862dc10839a331aa7ad10ab3"
      values.$pastUpgrades.0.2:
+        ["0xe804Fe5Fb14B02aba636f37Fb6E1c7a08b2f4B16"]
      values.$pastUpgrades.0.1:
-        ["0xe804Fe5Fb14B02aba636f37Fb6E1c7a08b2f4B16"]
+        "0x16056cbaad7fb4412c05b045351e3c9f62215cd6ffc867a59ac1db8f7a5092cf"
    }
```

```diff
    contract MultiTokenMediator (0x88ad09518695c6c3712AC10a214bE5109a655671) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0x8eB3b7D8498a6716904577b2579e1c313d48E347"]
      values.$pastUpgrades.5.1:
-        ["0x8eB3b7D8498a6716904577b2579e1c313d48E347"]
+        "0x0fa2767b8bd06816aef104d1a04362f06aba8c814e1444c08838db0973ace594"
      values.$pastUpgrades.4.2:
+        ["0x7bFF37bda2318125C6B895d4f2B50Bcd9E0cC40e"]
      values.$pastUpgrades.4.1:
-        ["0x7bFF37bda2318125C6B895d4f2B50Bcd9E0cC40e"]
+        "0x50ec5688352357ed3c2ad7f4913dbc005a04e44528ccc7101a4457d58610947d"
      values.$pastUpgrades.3.2:
+        ["0xB0a18F960221c6D56871c29e5dD7b838E79c2E94"]
      values.$pastUpgrades.3.1:
-        ["0xB0a18F960221c6D56871c29e5dD7b838E79c2E94"]
+        "0xf8b984ed23d53276bcf228d3f114d5e2d982887d5d5941f900e066003eeeb361"
      values.$pastUpgrades.2.2:
+        ["0x5275e7264AB0Bb75D970E7442De0Aadd0C0b85ae"]
      values.$pastUpgrades.2.1:
-        ["0x5275e7264AB0Bb75D970E7442De0Aadd0C0b85ae"]
+        "0xc54efc1f3d91454efd7957372f2fa4421f545b9a9e56eb4240000496b7a52177"
      values.$pastUpgrades.1.2:
+        ["0x4B86181abcAeFc008B561E27C0aee64Bb5eB8dBe"]
      values.$pastUpgrades.1.1:
-        ["0x4B86181abcAeFc008B561E27C0aee64Bb5eB8dBe"]
+        "0x11417a1a4415db5eca2fadc6b2b5d0df882c7d731a1e7252ce10d98e0cfe6d9d"
      values.$pastUpgrades.0.2:
+        ["0x280f04a988513610584057Bf3fDE1f56f4d22CA9"]
      values.$pastUpgrades.0.1:
-        ["0x280f04a988513610584057Bf3fDE1f56f4d22CA9"]
+        "0xb389acafc31832156fe9bca8d22b47ef91396dd7661d4c318b6de25bc11b4694"
    }
```

```diff
    contract HashiManager (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x159B36Ed5BA327fd269Fb93c75918257DCfe686d"]
      values.$pastUpgrades.0.1:
-        ["0x159B36Ed5BA327fd269Fb93c75918257DCfe686d"]
+        "0x69c009512506e9271ad25755cb5b08957bfdae68032d37fb696ce69c89c70bc0"
    }
```

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xD83893F31AA1B6B9D97C9c70D3492fe38D24d218"]
      values.$pastUpgrades.0.1:
-        ["0xD83893F31AA1B6B9D97C9c70D3492fe38D24d218"]
+        "0x78da167ac224bb9190c7cddd1d294be2bce23d1120a4e20de50641f2c60f7870"
    }
```

Generated with discovered.json: 0x8db36f8a28e4dfc08625523e162b7da728fe4be0

# Diff at Thu, 17 Oct 2024 13:55:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b22da46ad96e1d0cb3e7d83e3293eb7b76990953 block: 20878347
- current block number: 20985714

## Description

Optional Hashi module (see older diffs below) adds a new owner Multisig and a new target adapter on gnosischain.

## Watched changes

```diff
-   Status: DELETED
    contract HashiOwnerMS (0x933d5CD392CDA19b481071a4aaf5Bc34324AB9a5)
    +++ description: None
```

```diff
    contract HashiManager (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9) {
    +++ description: None
      values.adapters.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x3A259A51D200d902AC25BE2005d95EADA6a1bfc5"
      values.expectedAdaptersHash:
-        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
+        "0x6b603f4a7f51661e39122b2cc2745ffbc56eca92e59f655d365cd5170d930c0a"
      values.owner:
-        "0x933d5CD392CDA19b481071a4aaf5Bc34324AB9a5"
+        "0x670a3e447F4DE92C012777Ac5591D81E12aD0957"
    }
```

```diff
+   Status: CREATED
    contract Safe (0x670a3e447F4DE92C012777Ac5591D81E12aD0957)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafe.sol => .flat/Safe/Safe.sol}         | 685 ++++++++++++---------
 .../Safe/SafeProxy.p.sol}                          |  10 +-
 2 files changed, 416 insertions(+), 279 deletions(-)
```

Generated with discovered.json: 0x868877ebf4194c312afb3c7cc6ea072a27f9b6d5

# Diff at Mon, 14 Oct 2024 10:53:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20878347
- current block number: 20878347

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878347 (main branch discovery), not current.

```diff
    contract BridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
    +++ description: None
      sourceHashes:
+        ["0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705","0xd9dd29f51753144909a424e20a1281bc15263ea2de2f5f028666b183b00d5fc3"]
    }
```

```diff
    contract TokenFactory (0x71d5ba4e37de72415F685490B684538Aae8f0424) {
    +++ description: None
      sourceHashes:
+        ["0xc3fc18a2178145d16d7d8d6b50d97b6d7a405421b3fae66cdeb31fb52f4e7eed"]
    }
```

```diff
    contract PermittableToken (0x7c24d0061b484B267F286aa2DCe891220Db254b3) {
    +++ description: None
      sourceHashes:
+        ["0x064c46a3015079f17e93b171ff684cda28a0ecdbd55ecec09c4ddf50e0a5c312"]
    }
```

```diff
    contract AAVEInterestERC20 (0x87D48c565D0D85770406D248efd7dc3cbd41e729) {
    +++ description: None
      sourceHashes:
+        ["0xe9dafd12a790c5d8c0d3d444fdcfe8d4a6eed9555ba260f7ac7aa5590fba07ca"]
    }
```

```diff
    contract MultiTokenMediator (0x88ad09518695c6c3712AC10a214bE5109a655671) {
    +++ description: None
      sourceHashes:
+        ["0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705","0xb84afd7276ac99834f5104f7c4f890572ffc31fadd9629aabd82017025e7ada2"]
    }
```

```diff
    contract HashiOwnerMS (0x933d5CD392CDA19b481071a4aaf5Bc34324AB9a5) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract HashiManager (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9) {
    +++ description: None
      sourceHashes:
+        ["0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705","0x824f58e3acf3f9403dc26549af4869336347109f24d07d82aa11897bed907b17"]
    }
```

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
      sourceHashes:
+        ["0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705","0x0ff53e04cc715e56805825c7eb45af72110792ad606dbfd4a97db98dfb75e6f7"]
    }
```

Generated with discovered.json: 0x4262e512e3864b6ddccec6b83a098abac2faa184

# Diff at Wed, 02 Oct 2024 14:15:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871607
- current block number: 20878347

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871607 (main branch discovery), not current.

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
    +++ description: None
      values.$pastUpgrades:
+        [["2020-01-17T10:56:41.000Z",["0xe804Fe5Fb14B02aba636f37Fb6E1c7a08b2f4B16"]],["2020-07-06T21:51:30.000Z",["0x2946f6D458F8Cf8723A1d9e95043831D3937461e"]],["2020-08-02T22:22:52.000Z",["0x54c6dFBB807BE694841A0F1B84CbC49D8FC98ed7"]],["2020-12-06T21:52:03.000Z",["0x872796bf7Fe754754d2BEE2c66D7de9B04a5C943"]],["2021-10-04T11:04:06.000Z",["0x82B67a43b69914E611710C62e629dAbB2f7AC6AB"]],["2024-09-23T08:55:47.000Z",["0x098f51bdfb5D6d319DD4FDf06b64773d25bD1316"]]]
      values.$upgradeCount:
+        6
    }
```

```diff
    contract MultiTokenMediator (0x88ad09518695c6c3712AC10a214bE5109a655671) {
    +++ description: None
      values.$pastUpgrades:
+        [["2020-08-04T00:31:58.000Z",["0x280f04a988513610584057Bf3fDE1f56f4d22CA9"]],["2020-08-22T21:44:00.000Z",["0x4B86181abcAeFc008B561E27C0aee64Bb5eB8dBe"]],["2020-08-27T21:37:25.000Z",["0x5275e7264AB0Bb75D970E7442De0Aadd0C0b85ae"]],["2020-12-06T21:53:07.000Z",["0xB0a18F960221c6D56871c29e5dD7b838E79c2E94"]],["2021-03-15T12:56:56.000Z",["0x7bFF37bda2318125C6B895d4f2B50Bcd9E0cC40e"]],["2021-10-15T18:59:03.000Z",["0x8eB3b7D8498a6716904577b2579e1c313d48E347"]]]
      values.$upgradeCount:
+        6
    }
```

```diff
    contract HashiManager (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-09-11T02:56:11.000Z",["0x159B36Ed5BA327fd269Fb93c75918257DCfe686d"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
      values.$pastUpgrades:
+        [["2020-01-17T10:54:27.000Z",["0xD83893F31AA1B6B9D97C9c70D3492fe38D24d218"]]]
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x1ee6e62af8033db28f96636fad340c2ee316efcf

# Diff at Tue, 01 Oct 2024 15:42:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 20814221
- current block number: 20871607

## Description

Fix Hashi EternalProxy. No changes on FE because Hashi is still optional (see previous update below).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20814221 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract HashiManager (0x159B36Ed5BA327fd269Fb93c75918257DCfe686d)
    +++ description: None
```

```diff
    contract HashiManager (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9) {
    +++ description: None
      name:
-        "EternalStorageProxy"
+        "HashiManager"
      values.$immutable:
-        true
      values.$admin:
+        "0x30Fb61178F39c0452cED4AD9A7FEC3344CB10B2E"
      values.$implementation:
+        "0x159B36Ed5BA327fd269Fb93c75918257DCfe686d"
      values.adapters:
+        ["0x0000000000000000000000000000000000000000"]
      values.deployedAtBlock:
+        0
      values.expectedAdaptersHash:
+        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
      values.expectedThreshold:
+        1
      values.isInitialized:
+        true
      values.owner:
+        "0x933d5CD392CDA19b481071a4aaf5Bc34324AB9a5"
      values.reporters:
+        ["0x0000000000000000000000000000000000000000"]
      values.targetAddress:
+        "0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59"
      values.targetChainId:
+        100
      values.threshold:
+        1
      values.yaho:
+        "0xbAE4Ebbf42815BB9Bc3720267Ea4496277d60DB8"
      values.yaru:
+        "0x30f64a297cc66a873FB603d1e89D5891962C25ba"
      proxyType:
+        "Eternal Storage proxy"
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x30Fb61178F39c0452cED4AD9A7FEC3344CB10B2E","via":[]}]
    }
```

```diff
+   Status: CREATED
    contract HashiOwnerMS (0x933d5CD392CDA19b481071a4aaf5Bc34324AB9a5)
    +++ description: None
```

Generated with discovered.json: 0x8f49e53941fb4c3ff0d7384b60069a702bf5c035

# Diff at Mon, 23 Sep 2024 15:37:51 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3382cfb14234950671011f2a61630973cab3e07 block: 20792026
- current block number: 20814221

## Description

ForeignAMB implementation change: Adds opt-in [Hashi](https://crosschain-alliance.gitbook.io/hashi) support for message sending / encoding and message receiving / validation. Hashi is a block header and message aggregator across chains that has a configurable threshold over various message sources after which to consider a message / blockHash valid. (Current threshold is 1)

This is added strictly on top of the existing message infra, which means that as long as `HASHI_IS_ENABLED=true`, all incoming messages will be validated as usual and, additionally, by Hashi. The Hashi validation result is purely informational while `HASHI_IS_MANDATORY=false`. (In the `true` case execution is only possible with successful Hashi validation) The Hashi settings and validation take place via a separate contract (HashiManager). Outgoing messages are emitted both as usual and via Hashi AMB.

One signer of the BridgeValidators is removed, effectively replacing it by the new external Hashi validator. (This one being optional as long as `HASHI_IS_MANDATORY=false`)

As this current setup has no practical impact and [there is a later upgrade planned to fully support Hashi](https://forum.gnosis.io/t/gip-93-should-gnosisdao-support-the-integration-of-hashi-within-gnosis-chains-canonical-bridges/8245/7), there are currently no description changes needed.

## Watched changes

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
    +++ description: None
      values.$implementation:
-        "0x82B67a43b69914E611710C62e629dAbB2f7AC6AB"
+        "0x098f51bdfb5D6d319DD4FDf06b64773d25bD1316"
      values.implementation:
-        "0x82B67a43b69914E611710C62e629dAbB2f7AC6AB"
+        "0x098f51bdfb5D6d319DD4FDf06b64773d25bD1316"
      values.version:
-        5
+        6
      values.HASHI_IS_ENABLED:
+        true
      values.HASHI_IS_MANDATORY:
+        false
      values.hashiManager:
+        "0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9"
    }
```

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
      values.validatorCount:
-        8
+        7
+++ description: Array of the signers in the validator multisig
+++ severity: MEDIUM
      values.validatorList.7:
-        "0x105CD22eD3D089Bf5589C59b452f9dE0796Ca52d"
+++ description: Array of the signers in the validator multisig
+++ severity: MEDIUM
      values.validatorList.6:
-        "0x459A3bd49F1ff109bc90b76125533699AaAAf9A6"
+        "0x105CD22eD3D089Bf5589C59b452f9dE0796Ca52d"
+++ description: Array of the signers in the validator multisig
+++ severity: MEDIUM
      values.validatorList.5:
-        "0x258667E543C913264388B33328337257aF208a8f"
+        "0x459A3bd49F1ff109bc90b76125533699AaAAf9A6"
+++ description: Array of the signers in the validator multisig
+++ severity: MEDIUM
      values.validatorList.4:
-        "0x674c97db4cE6caC04A124d745979f3E4cBa0E9f0"
+        "0x258667E543C913264388B33328337257aF208a8f"
+++ description: Array of the signers in the validator multisig
+++ severity: MEDIUM
      values.validatorList.3:
-        "0xbDc141c8D2343f33F40Cb9edD601CcF460CD0dDe"
+        "0x674c97db4cE6caC04A124d745979f3E4cBa0E9f0"
+++ description: Array of the signers in the validator multisig
+++ severity: MEDIUM
      values.validatorList.2:
-        "0xfA98B60E02A61B6590f073cAD56e68326652d094"
+        "0xbDc141c8D2343f33F40Cb9edD601CcF460CD0dDe"
+++ description: Array of the signers in the validator multisig
+++ severity: MEDIUM
      values.validatorList.1:
-        "0x3e0A20099626F3d4d4Ea7B0cE0330e88d1Fe65D6"
+        "0xfA98B60E02A61B6590f073cAD56e68326652d094"
+++ description: Array of the signers in the validator multisig
+++ severity: MEDIUM
      values.validatorList.0:
-        "0x456c255A8BC1F33778603A2a48Eb6B0C69F4d48E"
+        "0x3e0A20099626F3d4d4Ea7B0cE0330e88d1Fe65D6"
    }
```

```diff
+   Status: CREATED
    contract HashiManager (0x159B36Ed5BA327fd269Fb93c75918257DCfe686d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EternalStorageProxy (0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9)
    +++ description: None
```

## Source code changes

```diff
.../omni/ethereum/.flat/EternalStorageProxy.sol    | 264 +++++++++++++++++++++
 .../ForeignAMB/ForeignAMB.sol                      | 159 ++++++++++++-
 .../omni/ethereum/.flat/HashiManager.sol           | 195 +++++++++++++++
 3 files changed, 608 insertions(+), 10 deletions(-)
```

Generated with discovered.json: 0x3713c8bf50673886b0fd11fc68ecbca0759d4b77

# Diff at Fri, 20 Sep 2024 13:14:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c1f8c9b7beabeba1a847fb9e1064a356593cfe16 block: 19532020
- current block number: 20792026

## Description

Signer change.

## Watched changes

```diff
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43) {
    +++ description: None
      values.$members.1:
-        "0x61F4aE313592714f0557E0B4edd1641ACB394422"
+        "0xc84233E1AfEdF8EC408C3F1b422044CFcf83361A"
    }
```

Generated with discovered.json: 0x7db7faa99cf21679c738058c218b7760a0938288

# Diff at Fri, 30 Aug 2024 07:54:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19532020
- current block number: 19532020

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532020 (main branch discovery), not current.

```diff
    contract BridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x3defdc19a728cd3223bef1b0370c6f8c3240e0a6

# Diff at Wed, 21 Aug 2024 10:04:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19532020
- current block number: 19532020

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532020 (main branch discovery), not current.

```diff
    contract BridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e","0x88ad09518695c6c3712AC10a214bE5109a655671","0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e","via":[]},{"permission":"upgrade","target":"0x88ad09518695c6c3712AC10a214bE5109a655671","via":[]},{"permission":"upgrade","target":"0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064","via":[]}]
    }
```

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6","via":[]}]
    }
```

```diff
    contract MultiTokenMediator (0x88ad09518695c6c3712AC10a214bE5109a655671) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6","via":[]}]
    }
```

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6","via":[]}]
    }
```

Generated with discovered.json: 0xe76748f22ba77b904cf9cdcd9d9464425b23c7b0

# Diff at Fri, 09 Aug 2024 12:00:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19532020
- current block number: 19532020

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532020 (main branch discovery), not current.

```diff
    contract BridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e"
+        "0x88ad09518695c6c3712AC10a214bE5109a655671"
      assignedPermissions.upgrade.0:
-        "0x88ad09518695c6c3712AC10a214bE5109a655671"
+        "0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e"
    }
```

Generated with discovered.json: 0xcfbe371f193e5b314a3e419e60f80ce4fdae47ce

# Diff at Fri, 09 Aug 2024 10:10:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19532020
- current block number: 19532020

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532020 (main branch discovery), not current.

```diff
    contract BridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e","0x88ad09518695c6c3712AC10a214bE5109a655671","0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064"]
      assignedPermissions.upgrade:
+        ["0x88ad09518695c6c3712AC10a214bE5109a655671","0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e","0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064"]
      values.$multisigThreshold:
-        "8 of 16 (50%)"
      values.getOwners:
-        ["0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43","0xb8173f558f75EE263013fd6294177bf75279a21e","0xDdf2d07267EAF2cE3E13ee4319bE1F34D55ed992","0xAC0622953d25e1a6c4e0f32Ffc1A9C1cE350B60E","0x86Da253817DC599059e3AD5A1F098F7b96aBf34c","0x1685324Bf373670ad5C9c56bd88A1dc1C063b0f9","0x0101016044726994aFd16f4A99f0d960090D35e7","0x5b10cE4DDD27F57d4D432D409A5321219cbA7893","0xc44caeb7F0724A156806664d2361fD6f32a2d2C8","0x839395e20bbB182fa440d08F850E6c7A8f6F0780","0xd945325557f1FB4374fBf10Ae86D385632Df870A","0x10DD75875a2a8a284529Ae7223B1aCE410d606bd","0x80BA18503a1Fa16Ea22F3ef1Af23e2994EaC1d97","0xd26a3F686D43f2A62BA9eaE2ff77e9f516d945B9","0x57B11cC8F93f2cfeC4c1C5B95213f17cAD81332B","0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"]
      values.getThreshold:
-        8
      values.$members:
+        ["0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43","0xb8173f558f75EE263013fd6294177bf75279a21e","0xDdf2d07267EAF2cE3E13ee4319bE1F34D55ed992","0xAC0622953d25e1a6c4e0f32Ffc1A9C1cE350B60E","0x86Da253817DC599059e3AD5A1F098F7b96aBf34c","0x1685324Bf373670ad5C9c56bd88A1dc1C063b0f9","0x0101016044726994aFd16f4A99f0d960090D35e7","0x5b10cE4DDD27F57d4D432D409A5321219cbA7893","0xc44caeb7F0724A156806664d2361fD6f32a2d2C8","0x839395e20bbB182fa440d08F850E6c7A8f6F0780","0xd945325557f1FB4374fBf10Ae86D385632Df870A","0x10DD75875a2a8a284529Ae7223B1aCE410d606bd","0x80BA18503a1Fa16Ea22F3ef1Af23e2994EaC1d97","0xd26a3F686D43f2A62BA9eaE2ff77e9f516d945B9","0x57B11cC8F93f2cfeC4c1C5B95213f17cAD81332B","0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"]
      values.$threshold:
+        8
      values.multisigThreshold:
+        "8 of 16 (50%)"
    }
```

```diff
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 3 (33%)"
      values.getOwners:
-        ["0x2408F8a0475D3823A1F4A4bfD86B2a4B80E6eDB6","0x61F4aE313592714f0557E0B4edd1641ACB394422","0x3b3Cd747Ab7bf2BE3b950693deeDe8a0B96C4fF0"]
      values.getThreshold:
-        1
      values.$members:
+        ["0x2408F8a0475D3823A1F4A4bfD86B2a4B80E6eDB6","0x61F4aE313592714f0557E0B4edd1641ACB394422","0x3b3Cd747Ab7bf2BE3b950693deeDe8a0B96C4fF0"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 3 (33%)"
    }
```

Generated with discovered.json: 0x0cd69e978a5eff25b091cf90b91a4f2916c6f3f1

# Diff at Tue, 30 Jul 2024 11:13:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 19532020
- current block number: 19532020

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532020 (main branch discovery), not current.

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
      fieldMeta:
+        {"validatorList":{"severity":"MEDIUM","description":"Array of the signers in the validator multisig"}}
    }
```

Generated with discovered.json: 0xabc1571e97c6a3fd09f23adee4c8f5d92b0c464e

# Diff at Thu, 28 Mar 2024 10:29:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19425639
- current block number: 19532020

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19425639 (main branch discovery), not current.

```diff
    contract BridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      upgradeability.threshold:
+        "8 of 16 (50%)"
    }
```

```diff
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 3 (33%)"
    }
```

Generated with discovered.json: 0x4a5fcb93fb7311213ea7220e147822bc75feeef4

# Diff at Wed, 13 Mar 2024 10:45:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@569d0a5fb269e21eeb1e6c7fdb1a2848a0c6fda7 block: 18825546
- current block number: 19425639

## Description

One validator of the 8 in the multisig is changed.

## Watched changes

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
+++ description: Array of the signers in the validator multisig
+++ type: PERMISSION
+++ severity: MEDIUM
      values.validatorList.0:
-        "0xfDBf5711f77B97EA7F1f812832884c7328a682eC"
+        "0x456c255A8BC1F33778603A2a48Eb6B0C69F4d48E"
    }
```

Generated with discovered.json: 0x7e766748f218a7a95313663407b4d0b507548a58

# Diff at Wed, 20 Dec 2023 07:11:37 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@66449a15ea740d012130a024e5e0daa7f431f04b

## Description

Change in the required block confirmations of Arbitrary Message Bridge - the number of block confirmations oracle will wait before processing passed messages has been increased.

## Watched changes

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
      values.requiredBlockConfirmations:
-        100
+        130
    }
```
