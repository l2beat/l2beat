Generated with discovered.json: 0x6f91cfd9809161d39ed0afdf82df03bb7b4cbfa6

# Diff at Wed, 18 Dec 2024 12:02:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 21387924
- current block number: 21429285

## Description

Member changes in the GnosisBridgeGovernanceMultisig and config related changes due to using discovery in the xdai.ts file.

## Watched changes

```diff
    contract GnosisBridgeGovernanceMultisig (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      values.$members.4:
-        "0x86Da253817DC599059e3AD5A1F098F7b96aBf34c"
+        "0xA07888742c18d7e658132AE0148fF205fFF46481"
      values.$members.3:
-        "0xAC0622953d25e1a6c4e0f32Ffc1A9C1cE350B60E"
+        "0xf59E447E97bC03c2B0C5719e2E551F0B15b724e5"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387924 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SDaiForeignBridge (0x166124b75c798Cedf1B43655E9B5284eBd5203DB)
    +++ description: None
```

```diff
    contract GnosisBridgeGovernanceMultisig (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "GnosisBridgeGovernanceMultisig"
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016"},{"permission":"upgrade","target":"0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E"}]
    }
```

```diff
    contract SDaiForeignBridge (0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016) {
    +++ description: None
      name:
-        "EternalStorageProxy"
+        "SDaiForeignBridge"
      sourceHashes.1:
+        "0xc9e17870eb8594989459b35217d292000a746beaf237f82e703d3de4b55cc4d2"
      values.$immutable:
-        true
      values.$admin:
+        "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6"
      values.$implementation:
+        "0x166124b75c798Cedf1B43655E9B5284eBd5203DB"
      values.$pastUpgrades:
+        [["2018-10-08T19:50:23.000Z","0x01d8eeea7ea146970fb4fbe8991d6118f8f41a779b06c69041d32362575f1eda",["0x710d6eC2b0948dEf1f423Ec77B51b6a55847D2C5"]],["2018-12-19T12:49:42.000Z","0x29fdf4418b3ab5b5380e7ad0259278b1bbab18e121438c9c9d69ac6091f44a00",["0x0D3726e5a9f37234D6B55216fC971D30F150a60F"]],["2019-12-25T13:53:49.000Z","0x003ae91dc06c549cc28cdf47294abeb545577e119b98f6b6e631940a744a3356",["0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59"]],["2020-03-31T11:16:05.000Z","0x9f50cee64b4e729b7bd61630ed174ea3c7e47e3db1403d9828a9736b2ad7ce79",["0xd40355B17643Bc26554c9A9BBC95b5CAbd92C2CD"]],["2020-04-16T15:59:27.000Z","0xd0c3c92c94e05bc71256055ce8c4c993e047f04e04f3283a04e4cb077b71f6c6",["0x83c2E0E3B5328E599a3cBa95d97090fA7d0FDE8b"]],["2020-05-12T14:05:38.000Z","0x0f8ee640cb733e48ef1011554cb36945492f8cd40b5111417d1f54f30633f986",["0x7E7669bdff02F2eE75b68B91FB81c2B38F9228C2"]],["2021-10-06T18:49:32.000Z","0xb4afa1efcf12ba7907458062704efcc5658af3da5d36a4b4d4035af431d9df19",["0xEeE4f8dB4410beBD74A76cB711D096c5E66d0473"]],["2023-09-20T07:33:35.000Z","0x291d48fdfd430165b2b7f62c3ae806ea28ab34b4dc8a2e4d7d01693f19b780c9",["0x166124b75c798Cedf1B43655E9B5284eBd5203DB"]]]
      values.$upgradeCount:
+        8
      values.dailyLimit:
+        "10000000000000000000000000"
      values.daiToken:
+        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.decimalShift:
+        0
      values.deployedAtBlock:
+        6478428
      values.erc20token:
+        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.executionDailyLimit:
+        "15000000000000000000000000"
      values.executionMaxPerTx:
+        "10000000000000000000000000"
      values.gasPrice:
+        100000000000
      values.getBridgeInterfacesVersion:
+        {"major":6,"minor":1,"patch":0}
      values.getBridgeMode:
+        "0x18762d46"
      values.getTrustedForwarder:
+        "0x0000000000000000000000000000000000000000"
      values.isInitialized:
+        true
      values.maxPerTx:
+        "9999999000000000000000000"
      values.minPerTx:
+        5000000000000000
      values.owner:
+        "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6"
      values.requiredBlockConfirmations:
+        20
      values.requiredSignatures:
+        4
      values.sDaiToken:
+        "0x83F20F44975D03b1b09e64809B757c47f942BEeA"
      values.validatorContract:
+        "0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E"
      values.versionRecipient:
+        "1.0.1"
      proxyType:
+        "Eternal Storage proxy"
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6","via":[]}]
    }
```

```diff
-   Status: DELETED
    contract BridgeValidators (0x6943A218d58135793F1FE619414eD476C37ad65a)
    +++ description: None
```

```diff
    contract BridgeValidators (0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E) {
    +++ description: None
      name:
-        "EternalStorageProxy"
+        "BridgeValidators"
      sourceHashes.1:
+        "0x7123b263360e368977fbfb7da550817b9a4807849090a69d6415b0b1bb33b398"
      values.$immutable:
-        true
      values.$admin:
+        "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6"
      values.$implementation:
+        "0x6943A218d58135793F1FE619414eD476C37ad65a"
      values.$pastUpgrades:
+        [["2018-10-08T19:48:08.000Z","0x6dbedab00bc4840c459ba44c856c3aa1e7be5acd0c4a4602620a457979e7c4ee",["0xd760E016226836cC02E329aDDBB6821945Dd5100"]],["2019-12-25T13:53:35.000Z","0x721841ce7ca52a0a5ed23f1f4093fdd1dac4e538bcace263f0b59008885d2f34",["0x6943A218d58135793F1FE619414eD476C37ad65a"]]]
      values.$upgradeCount:
+        2
      values.deployedAtBlock:
+        6478417
      values.F_ADDR:
+        "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
      values.getBridgeValidatorsInterfacesVersion:
+        {"major":2,"minor":3,"patch":0}
      values.isInitialized:
+        true
      values.owner:
+        "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6"
      values.requiredSignatures:
+        4
      values.validatorCount:
+        7
      values.validatorList:
+        ["0x90776017057b84bc47D7e7383b65C463C80a6cdd","0xfA98B60E02A61B6590f073cAD56e68326652d094","0x97630E2aE609D4104aBdA91F3066C556403182dd","0x587C0d02B40822f15f05301d87c16f6a08AaDDde","0x1312E98995bbCc30fc63Db3cef807e20CDd33dca","0x4D1c96B9A49C4469A0b720a22b74b034EDdFe051","0xc073C8E5ED9Aa11CF6776C69b3e13b259Ba9F506"]
      proxyType:
+        "Eternal Storage proxy"
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6","via":[]}]
    }
```

Generated with discovered.json: 0x227de913d600b776722a499b77bc8ba64c111766

# Diff at Thu, 12 Dec 2024 17:29:54 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21322860
- current block number: 21387924

## Description

Ignored not needed values in config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21322860 (main branch discovery), not current.

```diff
    contract SDaiForeignBridge (0x166124b75c798Cedf1B43655E9B5284eBd5203DB) {
    +++ description: None
      values.getCurrentDay:
-        20060
    }
```

```diff
-   Status: DELETED
    contract Dai (0x6B175474E89094C44Da98b954EedeAC495271d0F)
    +++ description: None
```

```diff
    contract Comptroller (0xBafE01ff935C7305907c33BF824352eE5979B526) {
    +++ description: None
      values.getBlockNumber:
-        21322860
    }
```

```diff
    contract DaiForeignBridge (0xEeE4f8dB4410beBD74A76cB711D096c5E66d0473) {
    +++ description: None
      values.getCurrentDay:
-        20060
    }
```

Generated with discovered.json: 0x7e2a76a2b707f8d16d1b9e334b34309d5e86b767

# Diff at Tue, 03 Dec 2024 15:42:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 21322860

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract SDaiForeignBridge (0x166124b75c798Cedf1B43655E9B5284eBd5203DB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Unitroller (0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EternalStorageProxy (0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeValidators (0x6943A218d58135793F1FE619414eD476C37ad65a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Dai (0x6B175474E89094C44Da98b954EedeAC495271d0F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0x6d903f6003cca6255D85CcA4D3B5E5146dC33925)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovernorBravoDelegate (0x6F6e4785c97885d26466945055d4Ae8931bE6f7a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Comptroller (0xBafE01ff935C7305907c33BF824352eE5979B526)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Comp (0xc00e94Cb662C3520282E6f5717214004A7f26888)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovernorBravoDelegator (0xc0Da02939E1441F497fd74F78cE7Decb17B66529)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EternalStorageProxy (0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DaiForeignBridge (0xEeE4f8dB4410beBD74A76cB711D096c5E66d0473)
    +++ description: None
```
