Generated with discovered.json: 0xbd84259d2e240ee993e809379bcbf35df6bc53ce

# Diff at Mon, 14 Jul 2025 12:46:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 32674389
- current block number: 32674389

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 32674389 (main branch discovery), not current.

```diff
    EOA  (0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3) {
    +++ description: None
      address:
-        "0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3"
+        "base:0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3"
    }
```

```diff
    EOA  (0x0860399cF761dCcfB9897C8F91CAdc32a9B3E70d) {
    +++ description: None
      address:
-        "0x0860399cF761dCcfB9897C8F91CAdc32a9B3E70d"
+        "base:0x0860399cF761dCcfB9897C8F91CAdc32a9B3E70d"
    }
```

```diff
    EOA  (0x099f352107a4F61B28687B0CFDb613cF24593466) {
    +++ description: None
      address:
-        "0x099f352107a4F61B28687B0CFDb613cF24593466"
+        "base:0x099f352107a4F61B28687B0CFDb613cF24593466"
    }
```

```diff
    EOA  (0x1347D2C792fC0962022B36e6D6d7dc521676c187) {
    +++ description: None
      address:
-        "0x1347D2C792fC0962022B36e6D6d7dc521676c187"
+        "base:0x1347D2C792fC0962022B36e6D6d7dc521676c187"
    }
```

```diff
    EOA  (0x158bc73B1f7a246939644c6Fc77d1e2Ef4F9e9a1) {
    +++ description: None
      address:
-        "0x158bc73B1f7a246939644c6Fc77d1e2Ef4F9e9a1"
+        "base:0x158bc73B1f7a246939644c6Fc77d1e2Ef4F9e9a1"
    }
```

```diff
    EOA  (0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE) {
    +++ description: None
      address:
-        "0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE"
+        "base:0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE"
    }
```

```diff
    contract TokenMessenger (0x1682Ae6375C4E4A97e4B583BC394c861A46D8962) {
    +++ description: Part of CCTP
      address:
-        "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962"
+        "base:0x1682Ae6375C4E4A97e4B583BC394c861A46D8962"
      values.localMessageTransmitter:
-        "0xAD09780d193884d503182aD4588450C416D6F9D4"
+        "base:0xAD09780d193884d503182aD4588450C416D6F9D4"
      values.localMinter:
-        "0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
+        "base:0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
      values.owner:
-        "0x1347D2C792fC0962022B36e6D6d7dc521676c187"
+        "base:0x1347D2C792fC0962022B36e6D6d7dc521676c187"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x1cF9a51D9bFee6C582653A3dcA3c4Db34faA31a7"
+        "base:0x1cF9a51D9bFee6C582653A3dcA3c4Db34faA31a7"
      implementationNames.0x1682Ae6375C4E4A97e4B583BC394c861A46D8962:
-        "TokenMessenger"
      implementationNames.base:0x1682Ae6375C4E4A97e4B583BC394c861A46D8962:
+        "TokenMessenger"
    }
```

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      address:
-        "0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
+        "base:0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
    }
```

```diff
    EOA  (0x1cF9a51D9bFee6C582653A3dcA3c4Db34faA31a7) {
    +++ description: None
      address:
-        "0x1cF9a51D9bFee6C582653A3dcA3c4Db34faA31a7"
+        "base:0x1cF9a51D9bFee6C582653A3dcA3c4Db34faA31a7"
    }
```

```diff
    contract MasterMinter (0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1) {
    +++ description: Manager contract for minter management [sic].
      address:
-        "0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1"
+        "base:0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1"
      values.getMinterManager:
-        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
+        "base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
      values.owner:
-        "0xb5bff84d169a72e76e94eC950da51Bac90b60284"
+        "base:0xb5bff84d169a72e76e94eC950da51Bac90b60284"
      implementationNames.0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1:
-        "MasterMinter"
      implementationNames.base:0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1:
+        "MasterMinter"
    }
```

```diff
    EOA  (0x24253f1CA7540CfCb3DdDa890d3b94434786E379) {
    +++ description: None
      address:
-        "0x24253f1CA7540CfCb3DdDa890d3b94434786E379"
+        "base:0x24253f1CA7540CfCb3DdDa890d3b94434786E379"
    }
```

```diff
    EOA  (0x244df059d103347a054487Da7f8D42d52Cb29A55) {
    +++ description: None
      address:
-        "0x244df059d103347a054487Da7f8D42d52Cb29A55"
+        "base:0x244df059d103347a054487Da7f8D42d52Cb29A55"
    }
```

```diff
    contract TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d) {
    +++ description: Part of CCTP
      address:
-        "0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
+        "base:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
      values.$admin:
-        "0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
+        "base:0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
      values.$implementation:
-        "0x555E272506C06e7E559d57418563742AFE363ec8"
+        "base:0x555E272506C06e7E559d57418563742AFE363ec8"
      values.$pastUpgrades.0.2.0:
-        "0x555E272506C06e7E559d57418563742AFE363ec8"
+        "base:0x555E272506C06e7E559d57418563742AFE363ec8"
      values.admin:
-        "0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
+        "base:0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
      values.denylister:
-        "0x8C598734ea0e10Da19e654251Fd4A6C14AB4F556"
+        "base:0x8C598734ea0e10Da19e654251Fd4A6C14AB4F556"
      values.feeRecipient:
-        "0xDB03303F417A5eF98680FECde60c1e0701F3b6f3"
+        "base:0xDB03303F417A5eF98680FECde60c1e0701F3b6f3"
      values.implementation:
-        "0x555E272506C06e7E559d57418563742AFE363ec8"
+        "base:0x555E272506C06e7E559d57418563742AFE363ec8"
      values.localMessageTransmitter:
-        "0x81D40F21F12A8F0E3252Bccb954D722d4c464B64"
+        "base:0x81D40F21F12A8F0E3252Bccb954D722d4c464B64"
      values.localMinter:
-        "0xfd78EE919681417d192449715b2594ab58f5D002"
+        "base:0xfd78EE919681417d192449715b2594ab58f5D002"
      values.owner:
-        "0x24253f1CA7540CfCb3DdDa890d3b94434786E379"
+        "base:0x24253f1CA7540CfCb3DdDa890d3b94434786E379"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x2f86c55c0557788c8b1AbC2685f14ED6be68F3A5"
+        "base:0x2f86c55c0557788c8b1AbC2685f14ED6be68F3A5"
      implementationNames.0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d:
-        "AdminUpgradableProxy"
      implementationNames.0x555E272506C06e7E559d57418563742AFE363ec8:
-        "TokenMessengerV2"
      implementationNames.base:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d:
+        "AdminUpgradableProxy"
      implementationNames.base:0x555E272506C06e7E559d57418563742AFE363ec8:
+        "TokenMessengerV2"
    }
```

```diff
    EOA  (0x2f86c55c0557788c8b1AbC2685f14ED6be68F3A5) {
    +++ description: None
      address:
-        "0x2f86c55c0557788c8b1AbC2685f14ED6be68F3A5"
+        "base:0x2f86c55c0557788c8b1AbC2685f14ED6be68F3A5"
    }
```

```diff
    EOA  (0x3170a0717c6Dbb0d565143FdC3801Fcda57f6293) {
    +++ description: None
      address:
-        "0x3170a0717c6Dbb0d565143FdC3801Fcda57f6293"
+        "base:0x3170a0717c6Dbb0d565143FdC3801Fcda57f6293"
    }
```

```diff
    EOA  (0x336C02D3e3c759160E1E44fF0247f87F63086495) {
    +++ description: None
      address:
-        "0x336C02D3e3c759160E1E44fF0247f87F63086495"
+        "base:0x336C02D3e3c759160E1E44fF0247f87F63086495"
    }
```

```diff
    EOA  (0x397729229B3d824Ca1B93e6E25e7CB197973df33) {
    +++ description: None
      address:
-        "0x397729229B3d824Ca1B93e6E25e7CB197973df33"
+        "base:0x397729229B3d824Ca1B93e6E25e7CB197973df33"
    }
```

```diff
    EOA  (0x3ABd6f64A422225E61E435baE41db12096106df7) {
    +++ description: None
      address:
-        "0x3ABd6f64A422225E61E435baE41db12096106df7"
+        "base:0x3ABd6f64A422225E61E435baE41db12096106df7"
    }
```

```diff
    EOA  (0x3B5821672AF876193bBce324d93b13c3D753D2A8) {
    +++ description: None
      address:
-        "0x3B5821672AF876193bBce324d93b13c3D753D2A8"
+        "base:0x3B5821672AF876193bBce324d93b13c3D753D2A8"
    }
```

```diff
    EOA  (0x3c5D61bD70F4099DdB19405f647584Cc117b65E6) {
    +++ description: None
      address:
-        "0x3c5D61bD70F4099DdB19405f647584Cc117b65E6"
+        "base:0x3c5D61bD70F4099DdB19405f647584Cc117b65E6"
    }
```

```diff
    EOA  (0x4273C43e14888ae07FB3a850c1C7c596C607d50d) {
    +++ description: None
      address:
-        "0x4273C43e14888ae07FB3a850c1C7c596C607d50d"
+        "base:0x4273C43e14888ae07FB3a850c1C7c596C607d50d"
    }
```

```diff
    EOA  (0x44c035FC20bC8cF5A43c4f3637AF390d5A6F3AdA) {
    +++ description: None
      address:
-        "0x44c035FC20bC8cF5A43c4f3637AF390d5A6F3AdA"
+        "base:0x44c035FC20bC8cF5A43c4f3637AF390d5A6F3AdA"
    }
```

```diff
    EOA  (0x468f6f91D1264B1ab4ddD517c2F3770AE85021d8) {
    +++ description: None
      address:
-        "0x468f6f91D1264B1ab4ddD517c2F3770AE85021d8"
+        "base:0x468f6f91D1264B1ab4ddD517c2F3770AE85021d8"
    }
```

```diff
    EOA  (0x474E914026f8C1e1A8FAC9FE0b31BCF2fa5f96A1) {
    +++ description: None
      address:
-        "0x474E914026f8C1e1A8FAC9FE0b31BCF2fa5f96A1"
+        "base:0x474E914026f8C1e1A8FAC9FE0b31BCF2fa5f96A1"
    }
```

```diff
    EOA  (0x47506C6d44e42B0621001E4a93E3A055BBb267A2) {
    +++ description: None
      address:
-        "0x47506C6d44e42B0621001E4a93E3A055BBb267A2"
+        "base:0x47506C6d44e42B0621001E4a93E3A055BBb267A2"
    }
```

```diff
    EOA  (0x4d15e70518A20Fc8828b5C3853f32e35238d0b77) {
    +++ description: None
      address:
-        "0x4d15e70518A20Fc8828b5C3853f32e35238d0b77"
+        "base:0x4d15e70518A20Fc8828b5C3853f32e35238d0b77"
    }
```

```diff
    EOA  (0x4d91619a02B55a817930f22C444560933dabF7Cd) {
    +++ description: None
      address:
-        "0x4d91619a02B55a817930f22C444560933dabF7Cd"
+        "base:0x4d91619a02B55a817930f22C444560933dabF7Cd"
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      address:
-        "0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
+        "base:0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
    }
```

```diff
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) {
    +++ description: None
      address:
-        "0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
+        "base:0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "base:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3"
+        "base:0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3"
      values.$members.1:
-        "0x397729229B3d824Ca1B93e6E25e7CB197973df33"
+        "base:0x397729229B3d824Ca1B93e6E25e7CB197973df33"
      values.$members.2:
-        "0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE"
+        "base:0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE"
      values.$members.3:
-        "0xab7C7E7ac51f70dd959f3541316dBd715773158B"
+        "base:0xab7C7E7ac51f70dd959f3541316dBd715773158B"
      values.$members.4:
-        "0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
+        "base:0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
      values.$members.5:
-        "0x244df059d103347a054487Da7f8D42d52Cb29A55"
+        "base:0x244df059d103347a054487Da7f8D42d52Cb29A55"
      values.$members.6:
-        "0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
+        "base:0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
      values.$members.7:
-        "0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
+        "base:0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
      values.$members.8:
-        "0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
+        "base:0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
      values.GnosisSafe_modules.0:
-        "0x362DBD4Ff662b2E2b05b9cEDC91da2Dd2c655b26"
+        "base:0x362DBD4Ff662b2E2b05b9cEDC91da2Dd2c655b26"
      implementationNames.0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.base:0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971:
+        "SafeProxy"
      implementationNames.base:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    EOA  (0x52Ed4cBff8DcE6A19748043F3240ec03c834bCeF) {
    +++ description: None
      address:
-        "0x52Ed4cBff8DcE6A19748043F3240ec03c834bCeF"
+        "base:0x52Ed4cBff8DcE6A19748043F3240ec03c834bCeF"
    }
```

```diff
    EOA  (0x530d3F8C38C262a619C2686A7f1481815a5e6f92) {
    +++ description: None
      address:
-        "0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
+        "base:0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
    }
```

```diff
    EOA  (0x617a3582bf134fe8eC600fF04A194604DcFB5Aab) {
    +++ description: None
      address:
-        "0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
+        "base:0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
    }
```

```diff
    EOA  (0x67745b6Dcc3B4a1d52ce28119A5d59884E681228) {
    +++ description: None
      address:
-        "0x67745b6Dcc3B4a1d52ce28119A5d59884E681228"
+        "base:0x67745b6Dcc3B4a1d52ce28119A5d59884E681228"
    }
```

```diff
    EOA  (0x6A8b792DB7C6Cff061f721c5F3791A654ee1c9c6) {
    +++ description: None
      address:
-        "0x6A8b792DB7C6Cff061f721c5F3791A654ee1c9c6"
+        "base:0x6A8b792DB7C6Cff061f721c5F3791A654ee1c9c6"
    }
```

```diff
    EOA  (0x6AC8d65Dc698aE07263E3A98Aa698C33060b4A13) {
    +++ description: None
      address:
-        "0x6AC8d65Dc698aE07263E3A98Aa698C33060b4A13"
+        "base:0x6AC8d65Dc698aE07263E3A98Aa698C33060b4A13"
    }
```

```diff
    EOA  (0x6b0c900D12721B9C8Ab48A798C2e5c87B08bbf0b) {
    +++ description: None
      address:
-        "0x6b0c900D12721B9C8Ab48A798C2e5c87B08bbf0b"
+        "base:0x6b0c900D12721B9C8Ab48A798C2e5c87B08bbf0b"
    }
```

```diff
    EOA  (0x725b06F73ff761eF5390e39315e2BfbF60d33F96) {
    +++ description: None
      address:
-        "0x725b06F73ff761eF5390e39315e2BfbF60d33F96"
+        "base:0x725b06F73ff761eF5390e39315e2BfbF60d33F96"
    }
```

```diff
    EOA  (0x75edf81947e2b1616c2Affdf0524d0b657c34DEf) {
    +++ description: None
      address:
-        "0x75edf81947e2b1616c2Affdf0524d0b657c34DEf"
+        "base:0x75edf81947e2b1616c2Affdf0524d0b657c34DEf"
    }
```

```diff
    contract MessageTransmitterV2 (0x81D40F21F12A8F0E3252Bccb954D722d4c464B64) {
    +++ description: Part of CCTP
      address:
-        "0x81D40F21F12A8F0E3252Bccb954D722d4c464B64"
+        "base:0x81D40F21F12A8F0E3252Bccb954D722d4c464B64"
      values.$admin:
-        "0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
+        "base:0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
      values.$implementation:
-        "0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
+        "base:0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
      values.$pastUpgrades.0.2.0:
-        "0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
+        "base:0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
      values.admin:
-        "0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
+        "base:0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
      values.attesterManager:
-        "0xDf265e0329F6A08a772B48191b33bDC624499b84"
+        "base:0xDf265e0329F6A08a772B48191b33bDC624499b84"
      values.getEnabledAttester.0:
-        "0x725b06F73ff761eF5390e39315e2BfbF60d33F96"
+        "base:0x725b06F73ff761eF5390e39315e2BfbF60d33F96"
      values.getEnabledAttester.1:
-        "0x52Ed4cBff8DcE6A19748043F3240ec03c834bCeF"
+        "base:0x52Ed4cBff8DcE6A19748043F3240ec03c834bCeF"
      values.implementation:
-        "0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
+        "base:0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
      values.owner:
-        "0x9c563B7B08C5506C4aae279E1f66658D5f9fD7B8"
+        "base:0x9c563B7B08C5506C4aae279E1f66658D5f9fD7B8"
      values.pauser:
-        "0x47506C6d44e42B0621001E4a93E3A055BBb267A2"
+        "base:0x47506C6d44e42B0621001E4a93E3A055BBb267A2"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x75edf81947e2b1616c2Affdf0524d0b657c34DEf"
+        "base:0x75edf81947e2b1616c2Affdf0524d0b657c34DEf"
      implementationNames.0x81D40F21F12A8F0E3252Bccb954D722d4c464B64:
-        "AdminUpgradableProxy"
      implementationNames.0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3:
-        "MessageTransmitterV2"
      implementationNames.base:0x81D40F21F12A8F0E3252Bccb954D722d4c464B64:
+        "AdminUpgradableProxy"
      implementationNames.base:0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3:
+        "MessageTransmitterV2"
    }
```

```diff
    contract USD Coin Token (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) {
    +++ description: None
      address:
-        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
+        "base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
      values.$admin:
-        "0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
+        "base:0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
      values.$implementation:
-        "0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
+        "base:0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
      values.$pastUpgrades.0.2.0:
-        "0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
+        "base:0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
      values.admin:
-        "0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
+        "base:0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
      values.blacklister:
-        "0x4d15e70518A20Fc8828b5C3853f32e35238d0b77"
+        "base:0x4d15e70518A20Fc8828b5C3853f32e35238d0b77"
      values.implementation:
-        "0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
+        "base:0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
      values.masterMinter:
-        "0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1"
+        "base:0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.0:
-        "0xF91f1865F1570953A99cc9Bc037b9aF6f4Fd9A9C"
+        "base:0xF91f1865F1570953A99cc9Bc037b9aF6f4Fd9A9C"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.1:
-        "0x9066d3cF60D9f7B705026417E8E533b424Bc3d48"
+        "base:0x9066d3cF60D9f7B705026417E8E533b424Bc3d48"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.2:
-        "0x880AD1D79c50f9FA0050CDdAd139E52e06B9C725"
+        "base:0x880AD1D79c50f9FA0050CDdAd139E52e06B9C725"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.3:
-        "0xaac391f166f33CdaEfaa4AfA6616A3BEA66B694d"
+        "base:0xaac391f166f33CdaEfaa4AfA6616A3BEA66B694d"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.4:
-        "0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
+        "base:0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.5:
-        "0x3B5821672AF876193bBce324d93b13c3D753D2A8"
+        "base:0x3B5821672AF876193bBce324d93b13c3D753D2A8"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.6:
-        "0x6A8b792DB7C6Cff061f721c5F3791A654ee1c9c6"
+        "base:0x6A8b792DB7C6Cff061f721c5F3791A654ee1c9c6"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.7:
-        "0xfE9Ffb577ad5B21c01f81c283075647085dD97f8"
+        "base:0xfE9Ffb577ad5B21c01f81c283075647085dD97f8"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.8:
-        "0xaD72249C80699ABc2eAeD5c66B0300F8631Fca96"
+        "base:0xaD72249C80699ABc2eAeD5c66B0300F8631Fca96"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.9:
-        "0x4d91619a02B55a817930f22C444560933dabF7Cd"
+        "base:0x4d91619a02B55a817930f22C444560933dabF7Cd"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.10:
-        "0x3170a0717c6Dbb0d565143FdC3801Fcda57f6293"
+        "base:0x3170a0717c6Dbb0d565143FdC3801Fcda57f6293"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.11:
-        "0xfd78EE919681417d192449715b2594ab58f5D002"
+        "base:0xfd78EE919681417d192449715b2594ab58f5D002"
      values.owner:
-        "0x3ABd6f64A422225E61E435baE41db12096106df7"
+        "base:0x3ABd6f64A422225E61E435baE41db12096106df7"
      values.pauser:
-        "0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4"
+        "base:0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4"
      values.rescuer:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      implementationNames.0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913:
-        "FiatTokenProxy"
      implementationNames.0x2Ce6311ddAE708829bc0784C967b7d77D19FD779:
-        "FiatTokenV2_2"
      implementationNames.base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913:
+        "FiatTokenProxy"
      implementationNames.base:0x2Ce6311ddAE708829bc0784C967b7d77D19FD779:
+        "FiatTokenV2_2"
    }
```

```diff
    EOA  (0x880AD1D79c50f9FA0050CDdAd139E52e06B9C725) {
    +++ description: None
      address:
-        "0x880AD1D79c50f9FA0050CDdAd139E52e06B9C725"
+        "base:0x880AD1D79c50f9FA0050CDdAd139E52e06B9C725"
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      address:
-        "0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
+        "base:0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
    }
```

```diff
    EOA  (0x8C598734ea0e10Da19e654251Fd4A6C14AB4F556) {
    +++ description: None
      address:
-        "0x8C598734ea0e10Da19e654251Fd4A6C14AB4F556"
+        "base:0x8C598734ea0e10Da19e654251Fd4A6C14AB4F556"
    }
```

```diff
    EOA  (0x9066d3cF60D9f7B705026417E8E533b424Bc3d48) {
    +++ description: None
      address:
-        "0x9066d3cF60D9f7B705026417E8E533b424Bc3d48"
+        "base:0x9066d3cF60D9f7B705026417E8E533b424Bc3d48"
    }
```

```diff
    contract GnosisSafeL2 (0x92A19381444A001d62cE67BaFF066fA1111d7202) {
    +++ description: None
      address:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
+        "base:0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
      values.$members.1:
-        "0xab7C7E7ac51f70dd959f3541316dBd715773158B"
+        "base:0xab7C7E7ac51f70dd959f3541316dBd715773158B"
      values.$members.2:
-        "0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
+        "base:0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
      values.$members.3:
-        "0x336C02D3e3c759160E1E44fF0247f87F63086495"
+        "base:0x336C02D3e3c759160E1E44fF0247f87F63086495"
      values.$members.4:
-        "0x6AC8d65Dc698aE07263E3A98Aa698C33060b4A13"
+        "base:0x6AC8d65Dc698aE07263E3A98Aa698C33060b4A13"
      values.$members.5:
-        "0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
+        "base:0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
      values.$members.6:
-        "0x244df059d103347a054487Da7f8D42d52Cb29A55"
+        "base:0x244df059d103347a054487Da7f8D42d52Cb29A55"
      values.$members.7:
-        "0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
+        "base:0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
      implementationNames.0x92A19381444A001d62cE67BaFF066fA1111d7202:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.base:0x92A19381444A001d62cE67BaFF066fA1111d7202:
+        "GnosisSafeProxy"
      implementationNames.base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x9c563B7B08C5506C4aae279E1f66658D5f9fD7B8) {
    +++ description: None
      address:
-        "0x9c563B7B08C5506C4aae279E1f66658D5f9fD7B8"
+        "base:0x9c563B7B08C5506C4aae279E1f66658D5f9fD7B8"
    }
```

```diff
    EOA  (0xA40b230899aab50669d69C1030eE11Af3Eac786F) {
    +++ description: None
      address:
-        "0xA40b230899aab50669d69C1030eE11Af3Eac786F"
+        "base:0xA40b230899aab50669d69C1030eE11Af3Eac786F"
    }
```

```diff
    EOA  (0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4) {
    +++ description: None
      address:
-        "0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
+        "base:0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
    }
```

```diff
    EOA  (0xA9946e4dCfE522482A317f21feF7b2AFa5051B98) {
    +++ description: None
      address:
-        "0xA9946e4dCfE522482A317f21feF7b2AFa5051B98"
+        "base:0xA9946e4dCfE522482A317f21feF7b2AFa5051B98"
    }
```

```diff
    EOA  (0xaac391f166f33CdaEfaa4AfA6616A3BEA66B694d) {
    +++ description: None
      address:
-        "0xaac391f166f33CdaEfaa4AfA6616A3BEA66B694d"
+        "base:0xaac391f166f33CdaEfaa4AfA6616A3BEA66B694d"
    }
```

```diff
    EOA  (0xab7C7E7ac51f70dd959f3541316dBd715773158B) {
    +++ description: None
      address:
-        "0xab7C7E7ac51f70dd959f3541316dBd715773158B"
+        "base:0xab7C7E7ac51f70dd959f3541316dBd715773158B"
    }
```

```diff
    contract MessageTransmitter (0xAD09780d193884d503182aD4588450C416D6F9D4) {
    +++ description: Part of CCTP
      address:
-        "0xAD09780d193884d503182aD4588450C416D6F9D4"
+        "base:0xAD09780d193884d503182aD4588450C416D6F9D4"
      values.attesterManager:
-        "0xA40b230899aab50669d69C1030eE11Af3Eac786F"
+        "base:0xA40b230899aab50669d69C1030eE11Af3Eac786F"
      values.getEnabledAttester.0:
-        "0xb0Ea8E1bE37F346C7EA7ec708834D0db18A17361"
+        "base:0xb0Ea8E1bE37F346C7EA7ec708834D0db18A17361"
      values.getEnabledAttester.1:
-        "0xE2fEfe09E74b921CbbFF229E7cD40009231501CA"
+        "base:0xE2fEfe09E74b921CbbFF229E7cD40009231501CA"
      values.owner:
-        "0x4273C43e14888ae07FB3a850c1C7c596C607d50d"
+        "base:0x4273C43e14888ae07FB3a850c1C7c596C607d50d"
      values.pauser:
-        "0x0860399cF761dCcfB9897C8F91CAdc32a9B3E70d"
+        "base:0x0860399cF761dCcfB9897C8F91CAdc32a9B3E70d"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x099f352107a4F61B28687B0CFDb613cF24593466"
+        "base:0x099f352107a4F61B28687B0CFDb613cF24593466"
      implementationNames.0xAD09780d193884d503182aD4588450C416D6F9D4:
-        "MessageTransmitter"
      implementationNames.base:0xAD09780d193884d503182aD4588450C416D6F9D4:
+        "MessageTransmitter"
    }
```

```diff
    EOA  (0xaD72249C80699ABc2eAeD5c66B0300F8631Fca96) {
    +++ description: None
      address:
-        "0xaD72249C80699ABc2eAeD5c66B0300F8631Fca96"
+        "base:0xaD72249C80699ABc2eAeD5c66B0300F8631Fca96"
    }
```

```diff
    EOA  (0xb0Ea8E1bE37F346C7EA7ec708834D0db18A17361) {
    +++ description: None
      address:
-        "0xb0Ea8E1bE37F346C7EA7ec708834D0db18A17361"
+        "base:0xb0Ea8E1bE37F346C7EA7ec708834D0db18A17361"
    }
```

```diff
    EOA  (0xb5bff84d169a72e76e94eC950da51Bac90b60284) {
    +++ description: None
      address:
-        "0xb5bff84d169a72e76e94eC950da51Bac90b60284"
+        "base:0xb5bff84d169a72e76e94eC950da51Bac90b60284"
    }
```

```diff
    EOA  (0xce96ae6De784181d8Eb2639F1E347fD40b4fD403) {
    +++ description: None
      address:
-        "0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
+        "base:0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
    }
```

```diff
    EOA  (0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4) {
    +++ description: None
      address:
-        "0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4"
+        "base:0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4"
    }
```

```diff
    contract Wrapped OETH Token (0xD8724322f44E5c58D7A815F542036fb17DbbF839) {
    +++ description: None
      address:
-        "0xD8724322f44E5c58D7A815F542036fb17DbbF839"
+        "base:0xD8724322f44E5c58D7A815F542036fb17DbbF839"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xF66886e242e20cAb2496AF1d411eBcFb73440270"
+        "base:0xF66886e242e20cAb2496AF1d411eBcFb73440270"
      values.$pastUpgrades.0.2.0:
-        "0xF66886e242e20cAb2496AF1d411eBcFb73440270"
+        "base:0xF66886e242e20cAb2496AF1d411eBcFb73440270"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      values.accessControl.BURNER_ROLE.members.0:
-        "0x1e89F91Ee35D7d21c8e8238c79146daF7aB8Bb94"
+        "base:0x1e89F91Ee35D7d21c8e8238c79146daF7aB8Bb94"
      values.accessControl.MINTER_ROLE.members.0:
-        "0x1e89F91Ee35D7d21c8e8238c79146daF7aB8Bb94"
+        "base:0x1e89F91Ee35D7d21c8e8238c79146daF7aB8Bb94"
      values.admin:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      values.governor:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      values.implementation:
-        "0xF66886e242e20cAb2496AF1d411eBcFb73440270"
+        "base:0xF66886e242e20cAb2496AF1d411eBcFb73440270"
      implementationNames.0xD8724322f44E5c58D7A815F542036fb17DbbF839:
-        "BridgedBaseWOETHProxy"
      implementationNames.0xF66886e242e20cAb2496AF1d411eBcFb73440270:
-        "BridgedWOETH"
      implementationNames.base:0xD8724322f44E5c58D7A815F542036fb17DbbF839:
+        "BridgedBaseWOETHProxy"
      implementationNames.base:0xF66886e242e20cAb2496AF1d411eBcFb73440270:
+        "BridgedWOETH"
    }
```

```diff
    EOA  (0xDB03303F417A5eF98680FECde60c1e0701F3b6f3) {
    +++ description: None
      address:
-        "0xDB03303F417A5eF98680FECde60c1e0701F3b6f3"
+        "base:0xDB03303F417A5eF98680FECde60c1e0701F3b6f3"
    }
```

```diff
    EOA  (0xDf265e0329F6A08a772B48191b33bDC624499b84) {
    +++ description: None
      address:
-        "0xDf265e0329F6A08a772B48191b33bDC624499b84"
+        "base:0xDf265e0329F6A08a772B48191b33bDC624499b84"
    }
```

```diff
    EOA  (0xE2fEfe09E74b921CbbFF229E7cD40009231501CA) {
    +++ description: None
      address:
-        "0xE2fEfe09E74b921CbbFF229E7cD40009231501CA"
+        "base:0xE2fEfe09E74b921CbbFF229E7cD40009231501CA"
    }
```

```diff
    contract TokenMinter (0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6) {
    +++ description: Part of CCTP: Used for automated access control for minting.
      address:
-        "0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
+        "base:0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
      values.localTokenMessenger:
-        "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962"
+        "base:0x1682Ae6375C4E4A97e4B583BC394c861A46D8962"
      values.owner:
-        "0x44c035FC20bC8cF5A43c4f3637AF390d5A6F3AdA"
+        "base:0x44c035FC20bC8cF5A43c4f3637AF390d5A6F3AdA"
      values.pauser:
-        "0x6b0c900D12721B9C8Ab48A798C2e5c87B08bbf0b"
+        "base:0x6b0c900D12721B9C8Ab48A798C2e5c87B08bbf0b"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x468f6f91D1264B1ab4ddD517c2F3770AE85021d8"
+        "base:0x468f6f91D1264B1ab4ddD517c2F3770AE85021d8"
      values.tokenController:
-        "0x67745b6Dcc3B4a1d52ce28119A5d59884E681228"
+        "base:0x67745b6Dcc3B4a1d52ce28119A5d59884E681228"
      implementationNames.0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6:
-        "TokenMinter"
      implementationNames.base:0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6:
+        "TokenMinter"
    }
```

```diff
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f) {
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
      address:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
+        "base:0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.cancellerAC.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.executorAC.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.executorAC.1:
-        "0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
+        "base:0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
      values.proposerAC.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.timelockAdminAC.0:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      implementationNames.0xf817cb3092179083c48c014688D98B72fB61464f:
-        "Timelock"
      implementationNames.base:0xf817cb3092179083c48c014688D98B72fB61464f:
+        "Timelock"
    }
```

```diff
    EOA  (0xF91f1865F1570953A99cc9Bc037b9aF6f4Fd9A9C) {
    +++ description: None
      address:
-        "0xF91f1865F1570953A99cc9Bc037b9aF6f4Fd9A9C"
+        "base:0xF91f1865F1570953A99cc9Bc037b9aF6f4Fd9A9C"
    }
```

```diff
    contract TokenMinterV2 (0xfd78EE919681417d192449715b2594ab58f5D002) {
    +++ description: Part of CCTP: Used for automated access control for minting.
      address:
-        "0xfd78EE919681417d192449715b2594ab58f5D002"
+        "base:0xfd78EE919681417d192449715b2594ab58f5D002"
      values.localTokenMessenger:
-        "0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
+        "base:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
      values.owner:
-        "0x3c5D61bD70F4099DdB19405f647584Cc117b65E6"
+        "base:0x3c5D61bD70F4099DdB19405f647584Cc117b65E6"
      values.pauser:
-        "0x474E914026f8C1e1A8FAC9FE0b31BCF2fa5f96A1"
+        "base:0x474E914026f8C1e1A8FAC9FE0b31BCF2fa5f96A1"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x158bc73B1f7a246939644c6Fc77d1e2Ef4F9e9a1"
+        "base:0x158bc73B1f7a246939644c6Fc77d1e2Ef4F9e9a1"
      values.tokenController:
-        "0xA9946e4dCfE522482A317f21feF7b2AFa5051B98"
+        "base:0xA9946e4dCfE522482A317f21feF7b2AFa5051B98"
      implementationNames.0xfd78EE919681417d192449715b2594ab58f5D002:
-        "TokenMinterV2"
      implementationNames.base:0xfd78EE919681417d192449715b2594ab58f5D002:
+        "TokenMinterV2"
    }
```

```diff
    EOA  (0xfE9Ffb577ad5B21c01f81c283075647085dD97f8) {
    +++ description: None
      address:
-        "0xfE9Ffb577ad5B21c01f81c283075647085dD97f8"
+        "base:0xfE9Ffb577ad5B21c01f81c283075647085dD97f8"
    }
```

```diff
+   Status: CREATED
    contract TokenMessenger (0x1682Ae6375C4E4A97e4B583BC394c861A46D8962)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract MasterMinter (0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1)
    +++ description: Manager contract for minter management [sic].
```

```diff
+   Status: CREATED
    contract TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitterV2 (0x81D40F21F12A8F0E3252Bccb954D722d4c464B64)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract USD Coin Token (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x92A19381444A001d62cE67BaFF066fA1111d7202)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitter (0xAD09780d193884d503182aD4588450C416D6F9D4)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract Wrapped OETH Token (0xD8724322f44E5c58D7A815F542036fb17DbbF839)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMinter (0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

```diff
+   Status: CREATED
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f)
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
```

```diff
+   Status: CREATED
    contract TokenMinterV2 (0xfd78EE919681417d192449715b2594ab58f5D002)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

Generated with discovered.json: 0x384c3cebac32ee6107ba75b1812789a57904ea43

# Diff at Thu, 10 Jul 2025 15:33:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f69ff944dc2501a54a7c05f54d37308d5262553d block: 30861907
- current block number: 32674389

## Description

update: added base bridge module and new member to wOETH timelock executor

## Watched changes

```diff
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) {
    +++ description: None
      values.$members.0:
+        "0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3"
      values.GnosisSafe_modules.0:
+        "0x362DBD4Ff662b2E2b05b9cEDC91da2Dd2c655b26"
      values.multisigThreshold:
-        "2 of 8 (25%)"
+        "2 of 9 (22%)"
    }
```

Generated with discovered.json: 0x24c1af6fd42636d6f810aea4b17d8392c472ab48

# Diff at Thu, 05 Jun 2025 08:23:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae074e39e9b50cc71e360e470589f9a084de5fa2 block: 30861907
- current block number: 30861907

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30861907 (main branch discovery), not current.

```diff
    contract Wrapped OETH Token (0xD8724322f44E5c58D7A815F542036fb17DbbF839) {
    +++ description: None
      name:
-        "BridgedWOETH"
+        "Wrapped OETH Token"
    }
```

Generated with discovered.json: 0x3477e4b5a945e52074a7d7f9480e52a0b7f6f7c0

# Diff at Wed, 28 May 2025 13:56:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@498e4fbc23b0148c96248f03ca33a8415e632b71 block: 30000033
- current block number: 30000033

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30000033 (main branch discovery), not current.

```diff
    contract USD Coin Token (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) {
    +++ description: None
      name:
-        "USDC"
+        "USD Coin Token"
    }
```

Generated with discovered.json: 0x400d2c89f7570138ebdc91281c6c8540a96d8249

# Diff at Fri, 23 May 2025 09:41:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 30000033
- current block number: 30000033

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30000033 (main branch discovery), not current.

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract MasterMinter (0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1) {
    +++ description: Manager contract for minter management [sic].
      receivedPermissions.0.role:
+        ".masterMinter"
    }
```

```diff
    EOA  (0x3ABd6f64A422225E61E435baE41db12096106df7) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x4d15e70518A20Fc8828b5C3853f32e35238d0b77) {
    +++ description: None
      receivedPermissions.0.role:
+        ".blacklister"
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) {
    +++ description: None
      receivedPermissions.1.role:
+        ".executorAC"
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".executorAC"
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract GnosisSafeL2 (0x92A19381444A001d62cE67BaFF066fA1111d7202) {
    +++ description: None
      receivedPermissions.3.description:
-        "execute transactions that are ready."
+        "propose transactions."
      receivedPermissions.3.role:
+        ".proposerAC"
      receivedPermissions.2.description:
-        "propose transactions."
+        "execute transactions that are ready."
      receivedPermissions.2.role:
+        ".executorAC"
      receivedPermissions.1.role:
+        ".cancellerAC"
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".executorAC"
    }
```

```diff
    EOA  (0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4) {
    +++ description: None
      receivedPermissions.0.role:
+        ".pauser"
    }
```

```diff
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f) {
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

Generated with discovered.json: 0x2e7e8b0583e68462b41c5cd78fc1539f0bc69067

# Diff at Wed, 14 May 2025 14:02:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3e40b87963942c5b1b364373f150a7eda9e4eccd block: 30000033
- current block number: 30000033

## Description

Max upgrade count flag updated (after change to algo to scope per chain).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30000033 (main branch discovery), not current.

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x56abde3df0f324e57d99b3857374b0b30e20a7d8

# Diff at Fri, 09 May 2025 11:17:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b9a3516de49f42efd9d26f04918d74a8d92c6204 block: 29954366
- current block number: 30000033

## Description

Config related

## Watched changes

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29954366 (main branch discovery), not current.

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0xbf1c451828d56226072770fb89846bb5ceda8951

# Diff at Thu, 08 May 2025 09:54:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 29913123
- current block number: 29954366

## Description

Config related.

## Watched changes

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29913123 (main branch discovery), not current.

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x31e13bb4c6faec9367fc5399fb95b07b9e6d911b

# Diff at Wed, 07 May 2025 11:00:13 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@370d0c8c1e8a1a622701270cc075f9413ad76ecd block: 29519230
- current block number: 29913123

## Description

EOAs with admin permissions identified due to a change in config.

## Watched changes

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29519230 (main branch discovery), not current.

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x55af5c03fcf94e5fda07992b99df0ddead10fdc3

# Diff at Tue, 29 Apr 2025 08:19:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 29519230
- current block number: 29519230

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29519230 (main branch discovery), not current.

```diff
    contract TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d) {
    +++ description: Part of CCTP
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x88acF681fb9a1DFcE5ac83391991895C54CF24cc","via":[]}]
    }
```

```diff
    contract MessageTransmitterV2 (0x81D40F21F12A8F0E3252Bccb954D722d4c464B64) {
    +++ description: Part of CCTP
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x19b4B317E6Ea4643f1507c372630483092D0AbFf","via":[]}]
    }
```

```diff
    contract USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"interact","to":"0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1","description":"manage minter addresses.","via":[]},{"permission":"interact","to":"0x3ABd6f64A422225E61E435baE41db12096106df7","description":"manage all critical roles like pausers, blacklisters, minters, rescuer.","via":[]},{"permission":"interact","to":"0x4d15e70518A20Fc8828b5C3853f32e35238d0b77","description":"blacklist addresses, freezing any interactions with the USDC token for them.","via":[]},{"permission":"interact","to":"0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4","description":"pause the USDC token (no transfers, mints, burns).","via":[]},{"permission":"upgrade","to":"0x4fc7850364958d97B4d3f5A08f79db2493f8cA44","via":[]}]
    }
```

```diff
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f) {
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971","delay":172800,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0xf817cb3092179083c48c014688D98B72fB61464f","delay":172800}]},{"permission":"interact","to":"0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","delay":172800,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0xf817cb3092179083c48c014688D98B72fB61464f","delay":172800}]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","description":"propose transactions.","via":[]}]
    }
```

Generated with discovered.json: 0x74a967b8211eef7064cd2c104a9230c4829c608f

# Diff at Mon, 28 Apr 2025 09:27:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@abb69590061038da05feece26d3be8369d45e4a9 block: 29215620
- current block number: 29519230

## Description

Add USDC and CCTP v1 and v2 on base.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29215620 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract TokenMessenger (0x1682Ae6375C4E4A97e4B583BC394c861A46D8962)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract MasterMinter (0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1)
    +++ description: Manager contract for minter management [sic].
```

```diff
+   Status: CREATED
    contract TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract MessageTransmitterV2 (0x81D40F21F12A8F0E3252Bccb954D722d4c464B64)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitter (0xAD09780d193884d503182aD4588450C416D6F9D4)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract TokenMinter (0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

```diff
+   Status: CREATED
    contract TokenMinterV2 (0xfd78EE919681417d192449715b2594ab58f5D002)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

Generated with discovered.json: 0x7373a5757b7ceead98f064f6c18a00ae87108903

# Diff at Mon, 21 Apr 2025 08:01:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 29215620

## Description

add wOETH (CCIP) discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x92A19381444A001d62cE67BaFF066fA1111d7202)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgedWOETH (0xD8724322f44E5c58D7A815F542036fb17DbbF839)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f)
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
```
