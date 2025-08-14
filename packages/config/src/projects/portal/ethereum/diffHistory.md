Generated with discovered.json: 0x566e847432a2483edce010406e0656a0e1bc6e5a

# Diff at Mon, 14 Jul 2025 12:45:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22865659
- current block number: 22865659

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22865659 (main branch discovery), not current.

```diff
    EOA  (0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e) {
    +++ description: None
      address:
-        "0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e"
+        "eth:0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e"
    }
```

```diff
    contract TokenImplementation (0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6) {
    +++ description: None
      address:
-        "0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6"
+        "eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6"
      values.eip712Domain.domainVerifyingContract:
-        "0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6"
+        "eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6"
      values.owner:
-        "0xe00a8a3c66071B44C3aBdFd947Eaa1eA1D70dC6e"
+        "eth:0xe00a8a3c66071B44C3aBdFd947Eaa1eA1D70dC6e"
      implementationNames.0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6:
-        "TokenImplementation"
      implementationNames.eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6:
+        "TokenImplementation"
    }
```

```diff
    EOA  (0x107A0086b32d7A0977926A205131d8731D39cbEB) {
    +++ description: None
      address:
-        "0x107A0086b32d7A0977926A205131d8731D39cbEB"
+        "eth:0x107A0086b32d7A0977926A205131d8731D39cbEB"
    }
```

```diff
    EOA  (0x114De8460193bdf3A2fCf81f86a09765F4762fD1) {
    +++ description: None
      address:
-        "0x114De8460193bdf3A2fCf81f86a09765F4762fD1"
+        "eth:0x114De8460193bdf3A2fCf81f86a09765F4762fD1"
    }
```

```diff
    EOA  (0x11b39756C042441BE6D8650b69b54EbE715E2343) {
    +++ description: None
      address:
-        "0x11b39756C042441BE6D8650b69b54EbE715E2343"
+        "eth:0x11b39756C042441BE6D8650b69b54EbE715E2343"
    }
```

```diff
    EOA  (0x15e7cAF07C4e3DC8e7C469f92C8Cd88FB8005a20) {
    +++ description: None
      address:
-        "0x15e7cAF07C4e3DC8e7C469f92C8Cd88FB8005a20"
+        "eth:0x15e7cAF07C4e3DC8e7C469f92C8Cd88FB8005a20"
    }
```

```diff
    EOA  (0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8) {
    +++ description: None
      address:
-        "0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8"
+        "eth:0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8"
    }
```

```diff
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911) {
    +++ description: None
      address:
-        "0x27428DD2d3DD32A4D7f7C497eAaa23130d894911"
+        "eth:0x27428DD2d3DD32A4D7f7C497eAaa23130d894911"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x90995DBd1aae85872451b50A569dE947D34ac4ee"
+        "eth:0x90995DBd1aae85872451b50A569dE947D34ac4ee"
      values.$pastUpgrades.0.2.0:
-        "0x25688636CEc6CE0F1434b1e7dd0A223F3f258336"
+        "eth:0x25688636CEc6CE0F1434b1e7dd0A223F3f258336"
      values.$pastUpgrades.1.2.0:
-        "0x00337a31aEE3Ed37f5D5FBF892031d0090Da2EeF"
+        "eth:0x00337a31aEE3Ed37f5D5FBF892031d0090Da2EeF"
      values.$pastUpgrades.2.2.0:
-        "0x90995DBd1aae85872451b50A569dE947D34ac4ee"
+        "eth:0x90995DBd1aae85872451b50A569dE947D34ac4ee"
      values.getDefaultDeliveryProvider:
-        "0x7A0a53847776f7e94Cc35742971aCb2217b0Db81"
+        "eth:0x7A0a53847776f7e94Cc35742971aCb2217b0Db81"
      implementationNames.0x27428DD2d3DD32A4D7f7C497eAaa23130d894911:
-        "SimpleProxy"
      implementationNames.0x90995DBd1aae85872451b50A569dE947D34ac4ee:
-        "WormholeRelayer"
      implementationNames.eth:0x27428DD2d3DD32A4D7f7C497eAaa23130d894911:
+        "SimpleProxy"
      implementationNames.eth:0x90995DBd1aae85872451b50A569dE947D34ac4ee:
+        "WormholeRelayer"
    }
```

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: None
      address:
-        "0x3ee18B2214AFF97000D974cf647E7C347E8fa585"
+        "eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x381752f5458282d317d12C30D2Bd4D6E1FD8841e"
+        "eth:0x381752f5458282d317d12C30D2Bd4D6E1FD8841e"
      values.$pastUpgrades.0.2.0:
-        "0x51e9027eaBE500466cAA0F4Be882afC4446C4eFE"
+        "eth:0x51e9027eaBE500466cAA0F4Be882afC4446C4eFE"
      values.$pastUpgrades.1.2.0:
-        "0x6c4c12987303b2c94b2C76c612Fc5F4D2F0360F7"
+        "eth:0x6c4c12987303b2c94b2C76c612Fc5F4D2F0360F7"
      values.$pastUpgrades.2.2.0:
-        "0x67145cdb0d69678e9c48106F646C1b7ef69813A4"
+        "eth:0x67145cdb0d69678e9c48106F646C1b7ef69813A4"
      values.$pastUpgrades.3.2.0:
-        "0x91175AEE6dAc41B9C1f749ded077568aD93B84Ca"
+        "eth:0x91175AEE6dAc41B9C1f749ded077568aD93B84Ca"
      values.$pastUpgrades.4.2.0:
-        "0xB203b2057E2F08aDCE8F73Cc99709Ffdd8EDffEa"
+        "eth:0xB203b2057E2F08aDCE8F73Cc99709Ffdd8EDffEa"
      values.$pastUpgrades.5.2.0:
-        "0x76364611e457b1f97cd58FfC332DDC7561a193F6"
+        "eth:0x76364611e457b1f97cd58FfC332DDC7561a193F6"
      values.$pastUpgrades.6.2.0:
-        "0xfA71B241B168d2876722c6D8856d3E4F311B8C1e"
+        "eth:0xfA71B241B168d2876722c6D8856d3E4F311B8C1e"
      values.$pastUpgrades.7.2.0:
-        "0xADE06bc75Dc1FC3fB7442e0CFb8Ca544B23aF789"
+        "eth:0xADE06bc75Dc1FC3fB7442e0CFb8Ca544B23aF789"
      values.$pastUpgrades.8.2.0:
-        "0x299b4F6066d231521d11FAE8331fb1A4fe794F58"
+        "eth:0x299b4F6066d231521d11FAE8331fb1A4fe794F58"
      values.$pastUpgrades.9.2.0:
-        "0x381752f5458282d317d12C30D2Bd4D6E1FD8841e"
+        "eth:0x381752f5458282d317d12C30D2Bd4D6E1FD8841e"
      values.implementation:
-        "0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6"
+        "eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6"
      values.tokenImplementation:
-        "0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6"
+        "eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6"
      values.WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.wormhole:
-        "0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B"
+        "eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B"
      implementationNames.0x3ee18B2214AFF97000D974cf647E7C347E8fa585:
-        "TokenBridge"
      implementationNames.0x381752f5458282d317d12C30D2Bd4D6E1FD8841e:
-        "BridgeImplementation"
      implementationNames.eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585:
+        "TokenBridge"
      implementationNames.eth:0x381752f5458282d317d12C30D2Bd4D6E1FD8841e:
+        "BridgeImplementation"
    }
```

```diff
    EOA  (0x53207E216540125e322CdA8A693b0b89576DEb46) {
    +++ description: None
      address:
-        "0x53207E216540125e322CdA8A693b0b89576DEb46"
+        "eth:0x53207E216540125e322CdA8A693b0b89576DEb46"
    }
```

```diff
    EOA  (0x54Ce5B4D348fb74B958e8966e2ec3dBd4958a7cd) {
    +++ description: None
      address:
-        "0x54Ce5B4D348fb74B958e8966e2ec3dBd4958a7cd"
+        "eth:0x54Ce5B4D348fb74B958e8966e2ec3dBd4958a7cd"
    }
```

```diff
    EOA  (0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3) {
    +++ description: None
      address:
-        "0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3"
+        "eth:0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3"
    }
```

```diff
    EOA  (0x59278F587D4cFcDCbbc08019060be7231c37ddc2) {
    +++ description: None
      address:
-        "0x59278F587D4cFcDCbbc08019060be7231c37ddc2"
+        "eth:0x59278F587D4cFcDCbbc08019060be7231c37ddc2"
    }
```

```diff
    EOA  (0x5E1487F35515d02A92753504a8D75471b9f49EdB) {
    +++ description: None
      address:
-        "0x5E1487F35515d02A92753504a8D75471b9f49EdB"
+        "eth:0x5E1487F35515d02A92753504a8D75471b9f49EdB"
    }
```

```diff
    EOA  (0x6FbEBc898F403E4773E95feB15E80C9A99c8348d) {
    +++ description: None
      address:
-        "0x6FbEBc898F403E4773E95feB15E80C9A99c8348d"
+        "eth:0x6FbEBc898F403E4773E95feB15E80C9A99c8348d"
    }
```

```diff
    contract NFTBridge (0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE) {
    +++ description: None
      address:
-        "0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE"
+        "eth:0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x3e41904B3766F4cCEb145Cc53D75fEB61722a96C"
+        "eth:0x3e41904B3766F4cCEb145Cc53D75fEB61722a96C"
      values.$pastUpgrades.0.2.0:
-        "0xeF31003B774B45963FEa40bdF8653994f991AeAa"
+        "eth:0xeF31003B774B45963FEa40bdF8653994f991AeAa"
      values.$pastUpgrades.1.2.0:
-        "0x19AA39217dE9F568cdEb4141be1654670862a596"
+        "eth:0x19AA39217dE9F568cdEb4141be1654670862a596"
      values.$pastUpgrades.2.2.0:
-        "0x516f156987fb1C7763b31EA0e8a07d23077f7e04"
+        "eth:0x516f156987fb1C7763b31EA0e8a07d23077f7e04"
      values.$pastUpgrades.3.2.0:
-        "0x29C502cF186012734c5F8861C4004C27c55578df"
+        "eth:0x29C502cF186012734c5F8861C4004C27c55578df"
      values.$pastUpgrades.4.2.0:
-        "0x3e41904B3766F4cCEb145Cc53D75fEB61722a96C"
+        "eth:0x3e41904B3766F4cCEb145Cc53D75fEB61722a96C"
      values.implementation:
-        "0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc"
+        "eth:0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc"
      values.tokenImplementation:
-        "0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc"
+        "eth:0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc"
      values.wormhole:
-        "0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B"
+        "eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B"
      implementationNames.0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE:
-        "NFTBridgeEntrypoint"
      implementationNames.0x3e41904B3766F4cCEb145Cc53D75fEB61722a96C:
-        "NFTBridgeImplementation"
      implementationNames.eth:0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE:
+        "NFTBridgeEntrypoint"
      implementationNames.eth:0x3e41904B3766F4cCEb145Cc53D75fEB61722a96C:
+        "NFTBridgeImplementation"
    }
```

```diff
    EOA  (0x71AA1BE1D36CaFE3867910F99C09e347899C19C3) {
    +++ description: None
      address:
-        "0x71AA1BE1D36CaFE3867910F99C09e347899C19C3"
+        "eth:0x71AA1BE1D36CaFE3867910F99C09e347899C19C3"
    }
```

```diff
    EOA  (0x74a3bf913953D695260D88BC1aA25A4eeE363ef0) {
    +++ description: None
      address:
-        "0x74a3bf913953D695260D88BC1aA25A4eeE363ef0"
+        "eth:0x74a3bf913953D695260D88BC1aA25A4eeE363ef0"
    }
```

```diff
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81) {
    +++ description: None
      address:
-        "0x7A0a53847776f7e94Cc35742971aCb2217b0Db81"
+        "eth:0x7A0a53847776f7e94Cc35742971aCb2217b0Db81"
      values.$admin:
-        "0x59278F587D4cFcDCbbc08019060be7231c37ddc2"
+        "eth:0x59278F587D4cFcDCbbc08019060be7231c37ddc2"
      values.$implementation:
-        "0x0b89ccD6b803CCEC4f0E0fBeFAeE1f7d16e734e2"
+        "eth:0x0b89ccD6b803CCEC4f0E0fBeFAeE1f7d16e734e2"
      values.$pastUpgrades.0.2.0:
-        "0xedd08D4363820603fb1B261F7667B8ee170c37a5"
+        "eth:0xedd08D4363820603fb1B261F7667B8ee170c37a5"
      values.$pastUpgrades.1.2.0:
-        "0x401d3A2ec0a071e2A8f8Fc9B4C69313C1a04540c"
+        "eth:0x401d3A2ec0a071e2A8f8Fc9B4C69313C1a04540c"
      values.$pastUpgrades.2.2.0:
-        "0x0b89ccD6b803CCEC4f0E0fBeFAeE1f7d16e734e2"
+        "eth:0x0b89ccD6b803CCEC4f0E0fBeFAeE1f7d16e734e2"
      values.coreRelayer:
-        "0x27428DD2d3DD32A4D7f7C497eAaa23130d894911"
+        "eth:0x27428DD2d3DD32A4D7f7C497eAaa23130d894911"
      values.getRewardAddress:
-        "0x53207E216540125e322CdA8A693b0b89576DEb46"
+        "eth:0x53207E216540125e322CdA8A693b0b89576DEb46"
      values.owner:
-        "0x59278F587D4cFcDCbbc08019060be7231c37ddc2"
+        "eth:0x59278F587D4cFcDCbbc08019060be7231c37ddc2"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pricingWallet:
-        "0xE8af07A8Eff87B99B7C8C2c18ea95a1FE86D0ACD"
+        "eth:0xE8af07A8Eff87B99B7C8C2c18ea95a1FE86D0ACD"
      values.rewardAddress:
-        "0x53207E216540125e322CdA8A693b0b89576DEb46"
+        "eth:0x53207E216540125e322CdA8A693b0b89576DEb46"
      implementationNames.0x7A0a53847776f7e94Cc35742971aCb2217b0Db81:
-        "DeliveryProviderProxy"
      implementationNames.0x0b89ccD6b803CCEC4f0E0fBeFAeE1f7d16e734e2:
-        "DeliveryProviderImplementation"
      implementationNames.eth:0x7A0a53847776f7e94Cc35742971aCb2217b0Db81:
+        "DeliveryProviderProxy"
      implementationNames.eth:0x0b89ccD6b803CCEC4f0E0fBeFAeE1f7d16e734e2:
+        "DeliveryProviderImplementation"
    }
```

```diff
    EOA  (0x8192b6E7387CCd768277c17DAb1b7a5027c0b3Cf) {
    +++ description: None
      address:
-        "0x8192b6E7387CCd768277c17DAb1b7a5027c0b3Cf"
+        "eth:0x8192b6E7387CCd768277c17DAb1b7a5027c0b3Cf"
    }
```

```diff
    EOA  (0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2) {
    +++ description: None
      address:
-        "0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2"
+        "eth:0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2"
    }
```

```diff
    contract WormholeCore (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      address:
-        "0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B"
+        "eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x3c3d457f1522D3540AB3325Aa5f1864E34cBA9D0"
+        "eth:0x3c3d457f1522D3540AB3325Aa5f1864E34cBA9D0"
      values.$pastUpgrades.0.2.0:
-        "0x736D2A394f7810C17b3c6fEd017d5BC7D60c077d"
+        "eth:0x736D2A394f7810C17b3c6fEd017d5BC7D60c077d"
      values.$pastUpgrades.1.2.0:
-        "0x8C0041566e0bc27Efe285a9E98D0B4217a46809c"
+        "eth:0x8C0041566e0bc27Efe285a9E98D0B4217a46809c"
      values.$pastUpgrades.2.2.0:
-        "0x3c3d457f1522D3540AB3325Aa5f1864E34cBA9D0"
+        "eth:0x3c3d457f1522D3540AB3325Aa5f1864E34cBA9D0"
      values.guardianSet.keys.0:
-        "0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3"
+        "eth:0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3"
      values.guardianSet.keys.1:
-        "0xfF6CB952589BDE862c25Ef4392132fb9D4A42157"
+        "eth:0xfF6CB952589BDE862c25Ef4392132fb9D4A42157"
      values.guardianSet.keys.2:
-        "0x114De8460193bdf3A2fCf81f86a09765F4762fD1"
+        "eth:0x114De8460193bdf3A2fCf81f86a09765F4762fD1"
      values.guardianSet.keys.3:
-        "0x107A0086b32d7A0977926A205131d8731D39cbEB"
+        "eth:0x107A0086b32d7A0977926A205131d8731D39cbEB"
      values.guardianSet.keys.4:
-        "0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2"
+        "eth:0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2"
      values.guardianSet.keys.5:
-        "0x11b39756C042441BE6D8650b69b54EbE715E2343"
+        "eth:0x11b39756C042441BE6D8650b69b54EbE715E2343"
      values.guardianSet.keys.6:
-        "0x54Ce5B4D348fb74B958e8966e2ec3dBd4958a7cd"
+        "eth:0x54Ce5B4D348fb74B958e8966e2ec3dBd4958a7cd"
      values.guardianSet.keys.7:
-        "0x15e7cAF07C4e3DC8e7C469f92C8Cd88FB8005a20"
+        "eth:0x15e7cAF07C4e3DC8e7C469f92C8Cd88FB8005a20"
      values.guardianSet.keys.8:
-        "0x74a3bf913953D695260D88BC1aA25A4eeE363ef0"
+        "eth:0x74a3bf913953D695260D88BC1aA25A4eeE363ef0"
      values.guardianSet.keys.9:
-        "0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e"
+        "eth:0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e"
      values.guardianSet.keys.10:
-        "0xAF45Ced136b9D9e24903464AE889F5C8a723FC14"
+        "eth:0xAF45Ced136b9D9e24903464AE889F5C8a723FC14"
      values.guardianSet.keys.11:
-        "0xf93124b7c738843CBB89E864c862c38cddCccF95"
+        "eth:0xf93124b7c738843CBB89E864c862c38cddCccF95"
      values.guardianSet.keys.12:
-        "0xD2CC37A4dc036a8D232b48f62cDD4731412f4890"
+        "eth:0xD2CC37A4dc036a8D232b48f62cDD4731412f4890"
      values.guardianSet.keys.13:
-        "0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811"
+        "eth:0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811"
      values.guardianSet.keys.14:
-        "0x71AA1BE1D36CaFE3867910F99C09e347899C19C3"
+        "eth:0x71AA1BE1D36CaFE3867910F99C09e347899C19C3"
      values.guardianSet.keys.15:
-        "0x8192b6E7387CCd768277c17DAb1b7a5027c0b3Cf"
+        "eth:0x8192b6E7387CCd768277c17DAb1b7a5027c0b3Cf"
      values.guardianSet.keys.16:
-        "0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8"
+        "eth:0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8"
      values.guardianSet.keys.17:
-        "0x5E1487F35515d02A92753504a8D75471b9f49EdB"
+        "eth:0x5E1487F35515d02A92753504a8D75471b9f49EdB"
      values.guardianSet.keys.18:
-        "0x6FbEBc898F403E4773E95feB15E80C9A99c8348d"
+        "eth:0x6FbEBc898F403E4773E95feB15E80C9A99c8348d"
      implementationNames.0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B:
-        "Wormhole"
      implementationNames.0x3c3d457f1522D3540AB3325Aa5f1864E34cBA9D0:
-        "Implementation"
      implementationNames.eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B:
+        "Wormhole"
      implementationNames.eth:0x3c3d457f1522D3540AB3325Aa5f1864E34cBA9D0:
+        "Implementation"
    }
```

```diff
    contract CircleIntegration (0xAaDA05BD399372f0b0463744C09113c137636f6a) {
    +++ description: None
      address:
-        "0xAaDA05BD399372f0b0463744C09113c137636f6a"
+        "eth:0xAaDA05BD399372f0b0463744C09113c137636f6a"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x37f26277B1927c6bEDbD94e5C21C337A706af31c"
+        "eth:0x37f26277B1927c6bEDbD94e5C21C337A706af31c"
      values.$pastUpgrades.0.2.0:
-        "0x52e3C3D0Ca2fa372263289836c4E258C34a4523B"
+        "eth:0x52e3C3D0Ca2fa372263289836c4E258C34a4523B"
      values.$pastUpgrades.1.2.0:
-        "0x37f26277B1927c6bEDbD94e5C21C337A706af31c"
+        "eth:0x37f26277B1927c6bEDbD94e5C21C337A706af31c"
      values.circleBridge:
-        "0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
+        "eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
      values.circleTokenMinter:
-        "0xc4922d64a24675E16e1586e3e3Aa56C06fABe907"
+        "eth:0xc4922d64a24675E16e1586e3e3Aa56C06fABe907"
      values.circleTransmitter:
-        "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81"
+        "eth:0x0a992d191DEeC32aFe36203Ad87D7d289a738F81"
      values.wormhole:
-        "0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B"
+        "eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B"
      implementationNames.0xAaDA05BD399372f0b0463744C09113c137636f6a:
-        "CircleIntegrationProxy"
      implementationNames.0x37f26277B1927c6bEDbD94e5C21C337A706af31c:
-        "CircleIntegrationImplementation"
      implementationNames.eth:0xAaDA05BD399372f0b0463744C09113c137636f6a:
+        "CircleIntegrationProxy"
      implementationNames.eth:0x37f26277B1927c6bEDbD94e5C21C337A706af31c:
+        "CircleIntegrationImplementation"
    }
```

```diff
    EOA  (0xAF45Ced136b9D9e24903464AE889F5C8a723FC14) {
    +++ description: None
      address:
-        "0xAF45Ced136b9D9e24903464AE889F5C8a723FC14"
+        "eth:0xAF45Ced136b9D9e24903464AE889F5C8a723FC14"
    }
```

```diff
    EOA  (0xD2CC37A4dc036a8D232b48f62cDD4731412f4890) {
    +++ description: None
      address:
-        "0xD2CC37A4dc036a8D232b48f62cDD4731412f4890"
+        "eth:0xD2CC37A4dc036a8D232b48f62cDD4731412f4890"
    }
```

```diff
    EOA  (0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811) {
    +++ description: None
      address:
-        "0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811"
+        "eth:0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811"
    }
```

```diff
    EOA  (0xe00a8a3c66071B44C3aBdFd947Eaa1eA1D70dC6e) {
    +++ description: None
      address:
-        "0xe00a8a3c66071B44C3aBdFd947Eaa1eA1D70dC6e"
+        "eth:0xe00a8a3c66071B44C3aBdFd947Eaa1eA1D70dC6e"
    }
```

```diff
    EOA  (0xE8af07A8Eff87B99B7C8C2c18ea95a1FE86D0ACD) {
    +++ description: None
      address:
-        "0xE8af07A8Eff87B99B7C8C2c18ea95a1FE86D0ACD"
+        "eth:0xE8af07A8Eff87B99B7C8C2c18ea95a1FE86D0ACD"
    }
```

```diff
    contract NFTImplementation (0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc) {
    +++ description: None
      address:
-        "0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc"
+        "eth:0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc:
-        "NFTImplementation"
      implementationNames.eth:0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc:
+        "NFTImplementation"
    }
```

```diff
    EOA  (0xf93124b7c738843CBB89E864c862c38cddCccF95) {
    +++ description: None
      address:
-        "0xf93124b7c738843CBB89E864c862c38cddCccF95"
+        "eth:0xf93124b7c738843CBB89E864c862c38cddCccF95"
    }
```

```diff
    EOA  (0xfF6CB952589BDE862c25Ef4392132fb9D4A42157) {
    +++ description: None
      address:
-        "0xfF6CB952589BDE862c25Ef4392132fb9D4A42157"
+        "eth:0xfF6CB952589BDE862c25Ef4392132fb9D4A42157"
    }
```

```diff
+   Status: CREATED
    contract TokenImplementation (0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NFTBridge (0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WormholeCore (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CircleIntegration (0xAaDA05BD399372f0b0463744C09113c137636f6a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NFTImplementation (0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc)
    +++ description: None
```

Generated with discovered.json: 0xf71739e5f801415ded7233d58a1c8e0df389301e

# Diff at Mon, 07 Jul 2025 06:54:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1a6f89d35120c5c65bf077ab92a9ca72da48080d block: 20089055
- current block number: 22865659

## Description

Someone [initialized](https://etherscan.io/tx/0x261d7ca1a3326f4fe9a27cca14c2e6b225285bf2f4c34f3993685f1c0cd54678) the reference implementation for portal wrapped tokens. the initializer is public. this should have no effect because this contract's state is not used.

## Watched changes

```diff
    contract TokenImplementation (0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6) {
    +++ description: None
      values.chainId:
-        0
+        1
      values.decimals:
-        0
+        8
      values.DOMAIN_SEPARATOR:
-        "0x0cf2c709fa7ea9acd67676f52f3dbf86e5aff34b6cdc82219ec4212ea2e0569f"
+        "0x1c8e76e5f40d08a95d7af41535ef711c3020f4c03c197e1c5c46b8d4295e427e"
      values.eip712Domain.domainName:
-        ""
+        "Wormhole"
      values.eip712Domain.domainSalt:
-        "0xbf53adb76067fdab0d008aef3ad8b28bbb63c2ce4c2b63394ede73f01a70c865"
+        "0xc2e0a663467400f3348de72376f987f67f07ee0c9108ac366a3d1a6134ad0c68"
      values.name:
-        ""
+        "Wormhole"
      values.nativeContract:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x3ee18b2214aff97000d974cf647e7c347e8fa585000000000000000000000000"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "0xe00a8a3c66071B44C3aBdFd947Eaa1eA1D70dC6e"
      values.symbol:
-        ""
+        "WORM"
      values.totalSupply:
-        0
+        10000000
    }
```

Generated with discovered.json: 0x4da52a37cd6a44b01d4307b4b4d6ad0e67f25aa5

# Diff at Fri, 04 Jul 2025 12:19:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 20089055
- current block number: 20089055

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    EOA  (0x59278F587D4cFcDCbbc08019060be7231c37ddc2) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x7A0a53847776f7e94Cc35742971aCb2217b0Db81"
+        "eth:0x7A0a53847776f7e94Cc35742971aCb2217b0Db81"
    }
```

Generated with discovered.json: 0xd03f9d6c12a76048c73bcad389d1ab32277c03fc

# Diff at Fri, 23 May 2025 09:41:02 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 20089055
- current block number: 20089055

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    EOA  (0x59278F587D4cFcDCbbc08019060be7231c37ddc2) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0xfeb214fd9473624f4ec0f77090c322a1c409dba9

# Diff at Tue, 06 May 2025 10:56:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 20089055
- current block number: 20089055

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    EOA  (0x59278F587D4cFcDCbbc08019060be7231c37ddc2) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x0bd5c5b60bf21e72410d837b843931c97f7f89f8

# Diff at Tue, 29 Apr 2025 08:19:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 20089055
- current block number: 20089055

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x59278F587D4cFcDCbbc08019060be7231c37ddc2","via":[]}]
    }
```

Generated with discovered.json: 0x01464473ab99ac0c83c64f16af5f3e837440bdd1

# Diff at Thu, 24 Apr 2025 10:30:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 20089055
- current block number: 20089055

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    contract WormholeCore (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      values.guardianSet:
-        [["0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3","0xfF6CB952589BDE862c25Ef4392132fb9D4A42157","0x114De8460193bdf3A2fCf81f86a09765F4762fD1","0x107A0086b32d7A0977926A205131d8731D39cbEB","0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2","0x11b39756C042441BE6D8650b69b54EbE715E2343","0x54Ce5B4D348fb74B958e8966e2ec3dBd4958a7cd","0x15e7cAF07C4e3DC8e7C469f92C8Cd88FB8005a20","0x74a3bf913953D695260D88BC1aA25A4eeE363ef0","0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e","0xAF45Ced136b9D9e24903464AE889F5C8a723FC14","0xf93124b7c738843CBB89E864c862c38cddCccF95","0xD2CC37A4dc036a8D232b48f62cDD4731412f4890","0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811","0x71AA1BE1D36CaFE3867910F99C09e347899C19C3","0x8192b6E7387CCd768277c17DAb1b7a5027c0b3Cf","0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8","0x5E1487F35515d02A92753504a8D75471b9f49EdB","0x6FbEBc898F403E4773E95feB15E80C9A99c8348d"],0]
+        {"keys":["0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3","0xfF6CB952589BDE862c25Ef4392132fb9D4A42157","0x114De8460193bdf3A2fCf81f86a09765F4762fD1","0x107A0086b32d7A0977926A205131d8731D39cbEB","0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2","0x11b39756C042441BE6D8650b69b54EbE715E2343","0x54Ce5B4D348fb74B958e8966e2ec3dBd4958a7cd","0x15e7cAF07C4e3DC8e7C469f92C8Cd88FB8005a20","0x74a3bf913953D695260D88BC1aA25A4eeE363ef0","0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e","0xAF45Ced136b9D9e24903464AE889F5C8a723FC14","0xf93124b7c738843CBB89E864c862c38cddCccF95","0xD2CC37A4dc036a8D232b48f62cDD4731412f4890","0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811","0x71AA1BE1D36CaFE3867910F99C09e347899C19C3","0x8192b6E7387CCd768277c17DAb1b7a5027c0b3Cf","0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8","0x5E1487F35515d02A92753504a8D75471b9f49EdB","0x6FbEBc898F403E4773E95feB15E80C9A99c8348d"],"expirationTime":0}
    }
```

Generated with discovered.json: 0x29c73ed8ab1760b804677ef8b48cf102930bb813

# Diff at Tue, 04 Mar 2025 10:39:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20089055
- current block number: 20089055

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    contract TokenImplementation (0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6) {
    +++ description: None
      sinceBlock:
+        15569178
    }
```

```diff
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911) {
    +++ description: None
      sinceBlock:
+        17494020
    }
```

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: None
      sinceBlock:
+        13217349
    }
```

```diff
    contract NFTBridge (0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE) {
    +++ description: None
      sinceBlock:
+        13268501
    }
```

```diff
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81) {
    +++ description: None
      sinceBlock:
+        17493968
    }
```

```diff
    contract WormholeCore (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      sinceBlock:
+        12959638
    }
```

```diff
    contract CircleIntegration (0xAaDA05BD399372f0b0463744C09113c137636f6a) {
    +++ description: None
      sinceBlock:
+        17089754
    }
```

```diff
    contract NFTImplementation (0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc) {
    +++ description: None
      sinceBlock:
+        13268489
    }
```

Generated with discovered.json: 0x3e1ea88de5dacd730a1b3a4a3d912bd4e4ad1508

# Diff at Mon, 20 Jan 2025 11:09:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20089055
- current block number: 20089055

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x59278F587D4cFcDCbbc08019060be7231c37ddc2"
      issuedPermissions.0.to:
+        "0x59278F587D4cFcDCbbc08019060be7231c37ddc2"
    }
```

Generated with discovered.json: 0x356d6ac9bb74828f79dc795e7ae2762a43041475

# Diff at Thu, 28 Nov 2024 11:02:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 20089055
- current block number: 20089055

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract NFTBridge (0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract WormholeCore (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract CircleIntegration (0xAaDA05BD399372f0b0463744C09113c137636f6a) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x193f931744e3195cd6d90e4cce41c7f88d142f1b

# Diff at Mon, 21 Oct 2024 11:09:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20089055
- current block number: 20089055

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x90995DBd1aae85872451b50A569dE947D34ac4ee"]
      values.$pastUpgrades.2.1:
-        ["0x90995DBd1aae85872451b50A569dE947D34ac4ee"]
+        "0x1bb74012ac308d136388b6e5c7dc8cd86e50e7e68cbc468c7a872cb79bbdb54f"
      values.$pastUpgrades.1.2:
+        ["0x00337a31aEE3Ed37f5D5FBF892031d0090Da2EeF"]
      values.$pastUpgrades.1.1:
-        ["0x00337a31aEE3Ed37f5D5FBF892031d0090Da2EeF"]
+        "0x4ee56249f741ef28f4180f1b47a3f524e988d0f4dd58d18f18c41b88ba77513d"
      values.$pastUpgrades.0.2:
+        ["0x25688636CEc6CE0F1434b1e7dd0A223F3f258336"]
      values.$pastUpgrades.0.1:
-        ["0x25688636CEc6CE0F1434b1e7dd0A223F3f258336"]
+        "0x4ee56249f741ef28f4180f1b47a3f524e988d0f4dd58d18f18c41b88ba77513d"
    }
```

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: None
      values.$pastUpgrades.9.2:
+        ["0x381752f5458282d317d12C30D2Bd4D6E1FD8841e"]
      values.$pastUpgrades.9.1:
-        ["0x381752f5458282d317d12C30D2Bd4D6E1FD8841e"]
+        "0x5423123fcd6beecabec2a2b7d37596af24fcc91a4a64b8c0156579d3c58ef1a7"
      values.$pastUpgrades.8.2:
+        ["0x299b4F6066d231521d11FAE8331fb1A4fe794F58"]
      values.$pastUpgrades.8.1:
-        ["0x299b4F6066d231521d11FAE8331fb1A4fe794F58"]
+        "0xf7f4e4b0a70a1f043074418fe6a394d05c0438e0a79f40000fdd8b648ce2e473"
      values.$pastUpgrades.7.2:
+        ["0xADE06bc75Dc1FC3fB7442e0CFb8Ca544B23aF789"]
      values.$pastUpgrades.7.1:
-        ["0xADE06bc75Dc1FC3fB7442e0CFb8Ca544B23aF789"]
+        "0xb2146071324342840895340d0937e72c79e662a406d08bdca2c4452ea988dda3"
      values.$pastUpgrades.6.2:
+        ["0xfA71B241B168d2876722c6D8856d3E4F311B8C1e"]
      values.$pastUpgrades.6.1:
-        ["0xfA71B241B168d2876722c6D8856d3E4F311B8C1e"]
+        "0x681919e52611294f53e270f03a6615fe624deebfba3aa6de7bc842bd64b1d3b9"
      values.$pastUpgrades.5.2:
+        ["0x76364611e457b1f97cd58FfC332DDC7561a193F6"]
      values.$pastUpgrades.5.1:
-        ["0x76364611e457b1f97cd58FfC332DDC7561a193F6"]
+        "0x3bd3c23ca32a38b5ca289b6b72585a7ea8432510c4bad5ad6f99ba2a672fae02"
      values.$pastUpgrades.4.2:
+        ["0xB203b2057E2F08aDCE8F73Cc99709Ffdd8EDffEa"]
      values.$pastUpgrades.4.1:
-        ["0xB203b2057E2F08aDCE8F73Cc99709Ffdd8EDffEa"]
+        "0xbaee117671f50a2ab1b37a6cfdd96cae9210311fc37feca9b9fdf18c69ed4943"
      values.$pastUpgrades.3.2:
+        ["0x91175AEE6dAc41B9C1f749ded077568aD93B84Ca"]
      values.$pastUpgrades.3.1:
-        ["0x91175AEE6dAc41B9C1f749ded077568aD93B84Ca"]
+        "0xd52dad3dcd2412fed086ff08a67b8169ba84be9b4ab20c4ec779057e41664d67"
      values.$pastUpgrades.2.2:
+        ["0x67145cdb0d69678e9c48106F646C1b7ef69813A4"]
      values.$pastUpgrades.2.1:
-        ["0x67145cdb0d69678e9c48106F646C1b7ef69813A4"]
+        "0xda175307299342c37d73da16d4ff725efc2548646b354a436f13cf9d7294dc9c"
      values.$pastUpgrades.1.2:
+        ["0x6c4c12987303b2c94b2C76c612Fc5F4D2F0360F7"]
      values.$pastUpgrades.1.1:
-        ["0x6c4c12987303b2c94b2C76c612Fc5F4D2F0360F7"]
+        "0x581152516c6f4e1cc2acd6d1ad5372bd0325835fb53086f364f487086f42223e"
      values.$pastUpgrades.0.2:
+        ["0x51e9027eaBE500466cAA0F4Be882afC4446C4eFE"]
      values.$pastUpgrades.0.1:
-        ["0x51e9027eaBE500466cAA0F4Be882afC4446C4eFE"]
+        "0x581152516c6f4e1cc2acd6d1ad5372bd0325835fb53086f364f487086f42223e"
    }
```

```diff
    contract NFTBridge (0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0x3e41904B3766F4cCEb145Cc53D75fEB61722a96C"]
      values.$pastUpgrades.4.1:
-        ["0x3e41904B3766F4cCEb145Cc53D75fEB61722a96C"]
+        "0x109eb543ddab9e000e44c0c65f5b9ea1e14a0167ae79997b5413d1edd618af23"
      values.$pastUpgrades.3.2:
+        ["0x29C502cF186012734c5F8861C4004C27c55578df"]
      values.$pastUpgrades.3.1:
-        ["0x29C502cF186012734c5F8861C4004C27c55578df"]
+        "0xa4b9b97cff3216131a9c9993b1b1e63ad1cc2c3ea4a07c68ebdf6f2deca55156"
      values.$pastUpgrades.2.2:
+        ["0x516f156987fb1C7763b31EA0e8a07d23077f7e04"]
      values.$pastUpgrades.2.1:
-        ["0x516f156987fb1C7763b31EA0e8a07d23077f7e04"]
+        "0xeb3961df5f626e674d19bc89bf8e00fd79ad74c2bb87fb697179e19c4a44da7d"
      values.$pastUpgrades.1.2:
+        ["0x19AA39217dE9F568cdEb4141be1654670862a596"]
      values.$pastUpgrades.1.1:
-        ["0x19AA39217dE9F568cdEb4141be1654670862a596"]
+        "0x530e89e24dbc466ca0f0f34d3ecebe95b826aff05bd3ed1987339a56abb6e322"
      values.$pastUpgrades.0.2:
+        ["0xeF31003B774B45963FEa40bdF8653994f991AeAa"]
      values.$pastUpgrades.0.1:
-        ["0xeF31003B774B45963FEa40bdF8653994f991AeAa"]
+        "0x530e89e24dbc466ca0f0f34d3ecebe95b826aff05bd3ed1987339a56abb6e322"
    }
```

```diff
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x0b89ccD6b803CCEC4f0E0fBeFAeE1f7d16e734e2"]
      values.$pastUpgrades.2.1:
-        ["0x0b89ccD6b803CCEC4f0E0fBeFAeE1f7d16e734e2"]
+        "0x3e54828f7538d9259f50addac33d3779a48a72f1ac3cedffa062cf89b1351e41"
      values.$pastUpgrades.1.2:
+        ["0x401d3A2ec0a071e2A8f8Fc9B4C69313C1a04540c"]
      values.$pastUpgrades.1.1:
-        ["0x401d3A2ec0a071e2A8f8Fc9B4C69313C1a04540c"]
+        "0xda80ae732c6c6567b33ce8805c12ba5c1b21d3094ea8eb272bd51157419ed219"
      values.$pastUpgrades.0.2:
+        ["0xedd08D4363820603fb1B261F7667B8ee170c37a5"]
      values.$pastUpgrades.0.1:
-        ["0xedd08D4363820603fb1B261F7667B8ee170c37a5"]
+        "0xda80ae732c6c6567b33ce8805c12ba5c1b21d3094ea8eb272bd51157419ed219"
    }
```

```diff
    contract WormholeCore (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x3c3d457f1522D3540AB3325Aa5f1864E34cBA9D0"]
      values.$pastUpgrades.2.1:
-        ["0x3c3d457f1522D3540AB3325Aa5f1864E34cBA9D0"]
+        "0x02b94b33becc2fd94e42d4e2142cec7d83b8212f642516abccea0462391b676a"
      values.$pastUpgrades.1.2:
+        ["0x8C0041566e0bc27Efe285a9E98D0B4217a46809c"]
      values.$pastUpgrades.1.1:
-        ["0x8C0041566e0bc27Efe285a9E98D0B4217a46809c"]
+        "0x9a85c37061db3244e4415d27436128423592b52700a5bb3f11cf3c05bc555bba"
      values.$pastUpgrades.0.2:
+        ["0x736D2A394f7810C17b3c6fEd017d5BC7D60c077d"]
      values.$pastUpgrades.0.1:
-        ["0x736D2A394f7810C17b3c6fEd017d5BC7D60c077d"]
+        "0x01b299d4b52d7df2504157717a895ec5bbe3277038c8918f379997e82c54cd47"
    }
```

```diff
    contract CircleIntegration (0xAaDA05BD399372f0b0463744C09113c137636f6a) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x37f26277B1927c6bEDbD94e5C21C337A706af31c"]
      values.$pastUpgrades.1.1:
-        ["0x37f26277B1927c6bEDbD94e5C21C337A706af31c"]
+        "0x036aa3cc2247feeac78205c83e7c33fe937b7c40d0b193c6135dd3d8e8b0f49b"
      values.$pastUpgrades.0.2:
+        ["0x52e3C3D0Ca2fa372263289836c4E258C34a4523B"]
      values.$pastUpgrades.0.1:
-        ["0x52e3C3D0Ca2fa372263289836c4E258C34a4523B"]
+        "0x036aa3cc2247feeac78205c83e7c33fe937b7c40d0b193c6135dd3d8e8b0f49b"
    }
```

Generated with discovered.json: 0x6d9d19c6a6b0a928aea4d4f9cd7f00c7dda9b372

# Diff at Mon, 14 Oct 2024 10:54:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20089055
- current block number: 20089055

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    contract TokenImplementation (0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6) {
    +++ description: None
      sourceHashes:
+        ["0xbc51a6f7503c2dccc97bd5b0fe777fa354d9c7f8a017bffcdb16119f293f0619"]
    }
```

```diff
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911) {
    +++ description: None
      sourceHashes:
+        ["0xd3fe13cb32b323dcf9f1e5c9c334577136633345e2d376340b4cd18d44231968","0x54a3c2ca728fd6aafdaa31a7f0d44cffbdfaa544fba87e938e3447de88b9f006"]
    }
```

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: None
      sourceHashes:
+        ["0x7576cd5bf86b934451cc67ed4b42d74b94ea9ecd6e990ec3dca27d9d339c35cd","0x06093cab28394b5790c0a8281474cd818235258958a294ecad796fb89e7d017c"]
    }
```

```diff
    contract NFTBridge (0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE) {
    +++ description: None
      sourceHashes:
+        ["0x5314b46db0c40bea82cf9911a6e5095ae83c56a23e45191a1768a647210cc2b6","0xe8f857d15277c4009dd17c5e936579a00645b4b99609769258bc629c3ea1821b"]
    }
```

```diff
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81) {
    +++ description: None
      sourceHashes:
+        ["0xa69df53f9d2492a90cb9aeda1ddfd617ce00c5c63dfc2d2baa0413a87ffaf34c","0x8c018dd994ea0c4acd43c9628405cfd46ff5a65f234b1ea8c7e765983f49c6b3"]
    }
```

```diff
    contract WormholeCore (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      sourceHashes:
+        ["0xbc0d1c916444d8aca6243193c89589feac3c1a53cef31ddc8516d094fc6d33bd","0xb51bdb80364d69b22f5cafd3aee42a605a60f5fc3116509bea8352fbfa04c532"]
    }
```

```diff
    contract CircleIntegration (0xAaDA05BD399372f0b0463744C09113c137636f6a) {
    +++ description: None
      sourceHashes:
+        ["0xf187201e5a871c786c5af625380fa89f1c530c0458b5b697b29219ed50cf0ea8","0xc5187968f2cb1166db32924199e148c88684177ee3c51e0b7ceb5905febb2bcd"]
    }
```

```diff
    contract NFTImplementation (0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc) {
    +++ description: None
      sourceHashes:
+        ["0xbd754d5f19a23f887be96d26d6641438fa86acafaf29bb3828188cef3fd571e6"]
    }
```

Generated with discovered.json: 0x5761ecd4e31ad63de2d327a5cfd3d99b1109591d

# Diff at Tue, 01 Oct 2024 10:54:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20089055
- current block number: 20089055

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-16T17:56:23.000Z",["0x25688636CEc6CE0F1434b1e7dd0A223F3f258336"]],["2023-06-16T17:56:23.000Z",["0x00337a31aEE3Ed37f5D5FBF892031d0090Da2EeF"]],["2023-11-16T18:42:23.000Z",["0x90995DBd1aae85872451b50A569dE947D34ac4ee"]]]
    }
```

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-09-13T12:26:07.000Z",["0x51e9027eaBE500466cAA0F4Be882afC4446C4eFE"]],["2021-09-13T12:26:07.000Z",["0x6c4c12987303b2c94b2C76c612Fc5F4D2F0360F7"]],["2021-11-01T16:56:25.000Z",["0x67145cdb0d69678e9c48106F646C1b7ef69813A4"]],["2022-01-27T16:35:52.000Z",["0x91175AEE6dAc41B9C1f749ded077568aD93B84Ca"]],["2022-07-08T17:04:13.000Z",["0xB203b2057E2F08aDCE8F73Cc99709Ffdd8EDffEa"]],["2022-08-24T17:35:44.000Z",["0x76364611e457b1f97cd58FfC332DDC7561a193F6"]],["2022-09-01T14:23:24.000Z",["0xfA71B241B168d2876722c6D8856d3E4F311B8C1e"]],["2022-09-12T15:54:42.000Z",["0xADE06bc75Dc1FC3fB7442e0CFb8Ca544B23aF789"]],["2022-09-20T16:24:59.000Z",["0x299b4F6066d231521d11FAE8331fb1A4fe794F58"]],["2023-10-17T19:13:23.000Z",["0x381752f5458282d317d12C30D2Bd4D6E1FD8841e"]]]
    }
```

```diff
    contract NFTBridge (0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-09-21T10:10:43.000Z",["0xeF31003B774B45963FEa40bdF8653994f991AeAa"]],["2021-09-21T10:10:43.000Z",["0x19AA39217dE9F568cdEb4141be1654670862a596"]],["2022-03-08T21:44:45.000Z",["0x516f156987fb1C7763b31EA0e8a07d23077f7e04"]],["2022-07-08T17:03:44.000Z",["0x29C502cF186012734c5F8861C4004C27c55578df"]],["2022-09-12T15:55:50.000Z",["0x3e41904B3766F4cCEb145Cc53D75fEB61722a96C"]]]
    }
```

```diff
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-16T17:45:59.000Z",["0xedd08D4363820603fb1B261F7667B8ee170c37a5"]],["2023-06-16T17:45:59.000Z",["0x401d3A2ec0a071e2A8f8Fc9B4C69313C1a04540c"]],["2023-11-07T19:13:23.000Z",["0x0b89ccD6b803CCEC4f0E0fBeFAeE1f7d16e734e2"]]]
    }
```

```diff
    contract WormholeCore (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-08-04T16:10:44.000Z",["0x736D2A394f7810C17b3c6fEd017d5BC7D60c077d"]],["2022-07-08T17:04:44.000Z",["0x8C0041566e0bc27Efe285a9E98D0B4217a46809c"]],["2022-09-12T15:52:42.000Z",["0x3c3d457f1522D3540AB3325Aa5f1864E34cBA9D0"]]]
    }
```

```diff
    contract CircleIntegration (0xAaDA05BD399372f0b0463744C09113c137636f6a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-04-20T19:28:23.000Z",["0x52e3C3D0Ca2fa372263289836c4E258C34a4523B"]],["2023-04-20T19:28:23.000Z",["0x37f26277B1927c6bEDbD94e5C21C337A706af31c"]]]
    }
```

Generated with discovered.json: 0x3ddb411f820e2d4832e562c7966815312b87b793

# Diff at Fri, 23 Aug 2024 09:54:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20089055
- current block number: 20089055

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: None
      values.$upgradeCount:
+        10
    }
```

```diff
    contract NFTBridge (0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE) {
    +++ description: None
      values.$upgradeCount:
+        5
    }
```

```diff
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract WormholeCore (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract CircleIntegration (0xAaDA05BD399372f0b0463744C09113c137636f6a) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x6b4e35209d4e94bb9bd966e6b2072940333f8e2e

# Diff at Wed, 21 Aug 2024 10:05:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20089055
- current block number: 20089055

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20089055 (main branch discovery), not current.

```diff
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract NFTBridge (0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x59278F587D4cFcDCbbc08019060be7231c37ddc2","via":[]}]
    }
```

```diff
    contract WormholeCore (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract CircleIntegration (0xAaDA05BD399372f0b0463744C09113c137636f6a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x3c1630a3dcc12c334c569fe47532236fab1d60a4

# Diff at Fri, 14 Jun 2024 09:10:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e0044dca50e937818bd705c0a4de3d1abb379fad block: 19697841
- current block number: 20089055

## Description

Add Wormhole Relayer, NFTBridge and Circle adapter.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19697841 (main branch discovery), not current.

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: None
      values.WETH:
+        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    }
```

```diff
    contract Wormhole (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      name:
-        "Wormhole"
+        "WormholeCore"
    }
```

```diff
+   Status: CREATED
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NFTBridge (0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CircleIntegration (0xAaDA05BD399372f0b0463744C09113c137636f6a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NFTImplementation (0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc)
    +++ description: None
```

Generated with discovered.json: 0xcdb93f13e524a5818a8fc4185305b9a8371e08bf

# Diff at Sat, 20 Apr 2024 16:33:52 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@262f9e3e98ac8a85b09235e0b440b48e826f1f9f block: 18483329
- current block number: 19697841

## Description

A Guardian is replaced. (Guardians are permissioned actors for bridging transfer signatures and SC upgrades)

## Watched changes

```diff
    contract Wormhole (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      values.getCurrentGuardianSetIndex:
-        3
+        4
      values.guardianSet.0.0:
-        "0x58CC3AE5C097b213cE3c81979e1B9f9570746AA5"
+        "0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3"
    }
```

Generated with discovered.json: 0x8bf5589032a5a15f5c7fe123d36f5db04cb97ef4

# Diff at Thu, 02 Nov 2023 08:52:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@370ecaf744134c819956061d3c2a56bca3cd1087

## Description

Now emits an event (event TransferRedeemed) upon token transfer completion by the bridge. The `initialize()` function of the BridgeImplementation has been gutted and now does nothing. Because of that it seems like the current version of the code is incapable of changing the implementation address of the TokenContract. The `IWormhole.sol` interface has been expanded by additional functions and events plus the structs that were in `Structs.sol` have been moved to it as well.

## Watched changes

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
      upgradeability.implementation:
-        "0x299b4F6066d231521d11FAE8331fb1A4fe794F58"
+        "0x381752f5458282d317d12C30D2Bd4D6E1FD8841e"
      implementations.0:
-        "0x299b4F6066d231521d11FAE8331fb1A4fe794F58"
+        "0x381752f5458282d317d12C30D2Bd4D6E1FD8841e"
    }
```

## Source code changes

```diff
.../contracts/Structs.sol => /dev/null             |  40 -------
 .../implementation/contracts/bridge/Bridge.sol     |  15 +++
 .../contracts/bridge/BridgeGetters.sol             |   7 +-
 .../contracts/bridge/BridgeImplementation.sol      |  39 -------
 .../contracts/bridge/BridgeSetters.sol             |   1 +
 .../contracts/bridge/interfaces/IWETH.sol          |  11 ++
 .../contracts/interfaces/IWormhole.sol             | 126 ++++++++++++++++++---
 .../TokenBridge/implementation/meta.txt            |   2 +-
 8 files changed, 142 insertions(+), 99 deletions(-)
```
