Generated with discovered.json: 0x43606223bd0bdc6b8ada4165d50927e40ed86f34

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
