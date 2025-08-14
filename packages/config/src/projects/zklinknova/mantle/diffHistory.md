Generated with discovered.json: 0x7f6383df6807dc7b72f68f898d5eb29f7628e6a4

# Diff at Thu, 31 Jul 2025 10:58:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@07319d194d312aca8103826b7db44d44613cc7fa block: 1753687799
- current timestamp: 1753687799

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753687799 (main branch discovery), not current.

```diff
    contract MantleL1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2) {
    +++ description: None
      name:
-        "L1ERC20Bridge"
+        "MantleL1ERC20Bridge"
    }
```

```diff
    contract MantlezkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      name:
-        "zkLink"
+        "MantlezkLink"
    }
```

Generated with discovered.json: 0xa89eba0b715cc0b589dd3a097adb2b5b007c8318

# Diff at Mon, 14 Jul 2025 12:47:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 81058973
- current block number: 81058973

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81058973 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      address:
-        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
+        "mantle:0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "mantle:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
+        "mantle:0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
      values.$members.1:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "mantle:0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
      values.$members.2:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "mantle:0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
      values.$members.3:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "mantle:0xF801886AE2e127A269B0F11892edb54F692d02dF"
      values.$members.4:
-        "0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
+        "mantle:0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
      values.$members.5:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "mantle:0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
      values.$members.6:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "mantle:0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
      values.$members.7:
-        "0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
+        "mantle:0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
      implementationNames.0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.mantle:0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60:
+        "GnosisSafeProxy"
      implementationNames.mantle:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x21194Efd1D913Bc8D62F1ED9467aA0cA2a257FCe) {
    +++ description: None
      address:
-        "0x21194Efd1D913Bc8D62F1ED9467aA0cA2a257FCe"
+        "mantle:0x21194Efd1D913Bc8D62F1ED9467aA0cA2a257FCe"
    }
```

```diff
    EOA  (0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9) {
    +++ description: None
      address:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "mantle:0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
    }
```

```diff
    EOA  (0x321Ce902eDFC6466B224ce5D9A7Bc16858855272) {
    +++ description: None
      address:
-        "0x321Ce902eDFC6466B224ce5D9A7Bc16858855272"
+        "mantle:0x321Ce902eDFC6466B224ce5D9A7Bc16858855272"
    }
```

```diff
    EOA  (0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5) {
    +++ description: None
      address:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "mantle:0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
    }
```

```diff
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2) {
    +++ description: None
      address:
-        "0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2"
+        "mantle:0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2"
      values.$admin:
-        "0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82"
+        "mantle:0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82"
      values.$implementation:
-        "0x7769C18828569692Dfb65affa0856533613ea458"
+        "mantle:0x7769C18828569692Dfb65affa0856533613ea458"
      values.$pastUpgrades.0.2.0:
-        "0xbfa352a683D82a04233Cc45AC1308621BA63283f"
+        "mantle:0xbfa352a683D82a04233Cc45AC1308621BA63283f"
      values.$pastUpgrades.1.2.0:
-        "0x7769C18828569692Dfb65affa0856533613ea458"
+        "mantle:0x7769C18828569692Dfb65affa0856533613ea458"
      values.l2Bridge:
-        "0x321Ce902eDFC6466B224ce5D9A7Bc16858855272"
+        "mantle:0x321Ce902eDFC6466B224ce5D9A7Bc16858855272"
      values.l2TokenBeacon:
-        "0x21194Efd1D913Bc8D62F1ED9467aA0cA2a257FCe"
+        "mantle:0x21194Efd1D913Bc8D62F1ED9467aA0cA2a257FCe"
      implementationNames.0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7769C18828569692Dfb65affa0856533613ea458:
-        "L1ERC20Bridge"
      implementationNames.mantle:0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2:
+        "TransparentUpgradeableProxy"
      implementationNames.mantle:0x7769C18828569692Dfb65affa0856533613ea458:
+        "L1ERC20Bridge"
    }
```

```diff
    EOA  (0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10) {
    +++ description: None
      address:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "mantle:0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
    }
```

```diff
    EOA  (0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db) {
    +++ description: None
      address:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "mantle:0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
    }
```

```diff
    EOA  (0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5) {
    +++ description: None
      address:
-        "0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
+        "mantle:0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
    }
```

```diff
    EOA  (0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5) {
    +++ description: None
      address:
-        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
+        "mantle:0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
    }
```

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      address:
-        "0xD784d7128B46B60Ca7d8BdC17dCEC94917455657"
+        "mantle:0xD784d7128B46B60Ca7d8BdC17dCEC94917455657"
      values.$admin:
-        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
+        "mantle:0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
      values.$implementation:
-        "0x0C04046546C46652969Aa9eB4BFB758cFDf1e821"
+        "mantle:0x0C04046546C46652969Aa9eB4BFB758cFDf1e821"
      values.$pastUpgrades.0.2.0:
-        "0x5715Dec4cd747675E47b969D3a15aab909b8ce05"
+        "mantle:0x5715Dec4cd747675E47b969D3a15aab909b8ce05"
      values.$pastUpgrades.1.2.0:
-        "0x85079cb83B6cadba34e64bc0f24493F49D8b1F4e"
+        "mantle:0x85079cb83B6cadba34e64bc0f24493F49D8b1F4e"
      values.$pastUpgrades.2.2.0:
-        "0xa8486096C719024D4eB2262A45AAc5cA8A256Cd6"
+        "mantle:0xa8486096C719024D4eB2262A45AAc5cA8A256Cd6"
      values.$pastUpgrades.3.2.0:
-        "0x0C04046546C46652969Aa9eB4BFB758cFDf1e821"
+        "mantle:0x0C04046546C46652969Aa9eB4BFB758cFDf1e821"
      values.forwardFeeAllocator:
-        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
+        "mantle:0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
      values.gateway:
-        "0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"
+        "mantle:0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"
      values.getGateway:
-        "0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"
+        "mantle:0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"
      values.getGovernor:
-        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
+        "mantle:0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
      values.owner:
-        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
+        "mantle:0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
      implementationNames.0xD784d7128B46B60Ca7d8BdC17dCEC94917455657:
-        "ERC1967Proxy"
      implementationNames.0x0C04046546C46652969Aa9eB4BFB758cFDf1e821:
-        "ZkLink"
      implementationNames.mantle:0xD784d7128B46B60Ca7d8BdC17dCEC94917455657:
+        "ERC1967Proxy"
      implementationNames.mantle:0x0C04046546C46652969Aa9eB4BFB758cFDf1e821:
+        "ZkLink"
    }
```

```diff
    EOA  (0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92) {
    +++ description: None
      address:
-        "0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
+        "mantle:0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
    }
```

```diff
    contract MantleL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0) {
    +++ description: None
      address:
-        "0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"
+        "mantle:0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"
      values.$admin:
-        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
+        "mantle:0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
      values.$implementation:
-        "0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"
+        "mantle:0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"
      values.$pastUpgrades.0.2.0:
-        "0x55fa5276c44c1B465196898b144524C9c852235E"
+        "mantle:0x55fa5276c44c1B465196898b144524C9c852235E"
      values.$pastUpgrades.1.2.0:
-        "0x09CB6C5A235939258e3F6Ae2989cf6f26EeE1c72"
+        "mantle:0x09CB6C5A235939258e3F6Ae2989cf6f26EeE1c72"
      values.$pastUpgrades.2.2.0:
-        "0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"
+        "mantle:0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"
      values.ethToken:
-        "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
+        "mantle:0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
      values.getRemoteGateway:
-        "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
+        "mantle:0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269"
      values.MESSAGE_SERVICE:
-        "0x4200000000000000000000000000000000000007"
+        "mantle:0x4200000000000000000000000000000000000007"
      values.owner:
-        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
+        "mantle:0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
      values.ZKLINK:
-        "0xD784d7128B46B60Ca7d8BdC17dCEC94917455657"
+        "mantle:0xD784d7128B46B60Ca7d8BdC17dCEC94917455657"
      implementationNames.0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0:
-        "ERC1967Proxy"
      implementationNames.0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D:
-        "MantleL2Gateway"
      implementationNames.mantle:0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0:
+        "ERC1967Proxy"
      implementationNames.mantle:0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D:
+        "MantleL2Gateway"
    }
```

```diff
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82) {
    +++ description: None
      address:
-        "0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82"
+        "mantle:0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82"
      values.owner:
-        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
+        "mantle:0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
      implementationNames.0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82:
-        "ProxyAdmin"
      implementationNames.mantle:0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xF801886AE2e127A269B0F11892edb54F692d02dF) {
    +++ description: None
      address:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "mantle:0xF801886AE2e127A269B0F11892edb54F692d02dF"
    }
```

```diff
+   Status: CREATED
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MantleL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82)
    +++ description: None
```

Generated with discovered.json: 0x01e77a77007f3ab3e9f41dee9fdf767ffacedd9a

# Diff at Fri, 04 Jul 2025 13:17:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f3be48c7969ce9c9727876024c540666c2956e91 block: 81058973
- current block number: 81058973

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 81058973 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      sourceHashes.0:
-        "0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5"
+        "0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff"
      implementationNames.0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60:
-        "SafeProxy"
+        "GnosisSafeProxy"
    }
```

Generated with discovered.json: 0xbc8527043577a887e2a08f57dda91ca40aa65648

# Diff at Wed, 18 Jun 2025 12:24:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 80670848
- current block number: 81058973

## Description

config: wasmmoduleroot map updated.

## Watched changes

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      sourceHashes.0:
-        "0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff"
+        "0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5"
      implementationNames.0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60:
-        "GnosisSafeProxy"
+        "SafeProxy"
    }
```

Generated with discovered.json: 0xc8f4a269e311ca5e1327403aeac60fd55590e4bc

# Diff at Wed, 11 Jun 2025 10:36:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9d1575fea6364921032f9ded0a049bdf9fc57604 block: 80670848
- current block number: 80670848

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 80670848 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      sourceHashes.0:
-        "0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5"
+        "0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff"
      implementationNames.0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60:
-        "SafeProxy"
+        "GnosisSafeProxy"
    }
```

Generated with discovered.json: 0x1face9b0e1b5c077a88bec89a53cd80caa9b9d2f

# Diff at Mon, 09 Jun 2025 12:27:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7cc006dadcc55e6cce3be3eb03d491835943fb43 block: 79284086
- current block number: 80670848

## Description

zklinknova mantleOwner changed.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 79284086 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      sourceHashes.0:
-        "0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff"
+        "0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5"
      implementationNames.0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60:
-        "GnosisSafeProxy"
+        "SafeProxy"
    }
```

Generated with discovered.json: 0xe5f58b19f3cbfd46b90229e35f0c3829207e95e2

# Diff at Fri, 23 May 2025 09:41:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 79284086
- current block number: 79284086

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 79284086 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x573240a65a69f458ead5d4dbcccba4c302a843a1

# Diff at Wed, 07 May 2025 07:57:33 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0ad97a28a4acd494070977b13284d597fbcc6048 block: 79197162
- current block number: 79197162

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 79197162 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      sourceHashes.0:
-        "0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5"
+        "0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff"
    }
```

Generated with discovered.json: 0xae5bb250ba72f80ef3048f766dc1f27c207b9b57

# Diff at Tue, 06 May 2025 09:44:40 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@76bab41abbae565c3c67522863645fa6d26e7444 block: 76775244
- current block number: 79197162

## Description

The diff is config related, no actual changes onchain.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76775244 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      sourceHashes.0:
-        "0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff"
+        "0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5"
    }
```

Generated with discovered.json: 0x661e07bde6fc86520a834e6a556e290b8f08d154

# Diff at Tue, 29 Apr 2025 08:19:30 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 76775244
- current block number: 76775244

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76775244 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60","via":[{"address":"0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82"}]}]
    }
```

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60","via":[]}]
    }
```

```diff
    contract MantleL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60","via":[]}]
    }
```

Generated with discovered.json: 0x82d1ba230441954820fcc2e165e39dc940cd1c32

# Diff at Thu, 10 Apr 2025 14:44:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 76775244
- current block number: 76775244

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76775244 (main branch discovery), not current.

```diff
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x4457bcd41aeedc73b499763b165e4da844b60e87

# Diff at Tue, 11 Mar 2025 08:13:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 76747606
- current block number: 76775244

## Description

proxyadmin template match.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 76747606 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"}
      receivedPermissions.1.from:
-        "0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"
+        "0xD784d7128B46B60Ca7d8BdC17dCEC94917455657"
      receivedPermissions.0.from:
-        "0xD784d7128B46B60Ca7d8BdC17dCEC94917455657"
+        "0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2"
      receivedPermissions.0.via:
+        [{"address":"0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82"}]
    }
```

```diff
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82"
+        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
      issuedPermissions.0.via.0:
+        {"address":"0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82"}
    }
```

```diff
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2"}]
      template:
+        "global/ProxyAdmin"
      displayName:
+        "ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2"}]
    }
```

Generated with discovered.json: 0xf9ed2842d0c2587223c2fc614cbe18fe032c9645

# Diff at Mon, 10 Mar 2025 16:52:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef4d1036423fe7d398c41e6cf238a209cc1ff8f3 block: 68652420
- current block number: 76747606

## Description

zklink core contract paused. this only prevents deposits/ on the affected chains.

## Watched changes

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x426d4813917798363d8fc2c0fd461a9c8241bd1c

# Diff at Tue, 04 Mar 2025 10:42:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 68652420
- current block number: 68652420

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 68652420 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      sinceBlock:
+        60705516
    }
```

```diff
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2) {
    +++ description: None
      sinceBlock:
+        58697615
    }
```

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      sinceBlock:
+        58659816
    }
```

```diff
    contract MantleL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0) {
    +++ description: None
      sinceBlock:
+        58659973
    }
```

```diff
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82) {
    +++ description: None
      sinceBlock:
+        58697615
    }
```

Generated with discovered.json: 0x859c735004e6c2ceff7e740235165b73c2650565

# Diff at Mon, 20 Jan 2025 11:10:48 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 68652420
- current block number: 68652420

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 68652420 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"
      receivedPermissions.1.from:
+        "0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"
      receivedPermissions.0.target:
-        "0xD784d7128B46B60Ca7d8BdC17dCEC94917455657"
      receivedPermissions.0.from:
+        "0xD784d7128B46B60Ca7d8BdC17dCEC94917455657"
    }
```

```diff
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82"
      issuedPermissions.0.to:
+        "0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82"
    }
```

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
      issuedPermissions.0.to:
+        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
    }
```

```diff
    contract MantleL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
      issuedPermissions.0.to:
+        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
    }
```

```diff
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2"
      receivedPermissions.0.from:
+        "0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2"
    }
```

Generated with discovered.json: 0xd8a73abecba50c00c11c92e618c031e5c99a7d6d

# Diff at Mon, 21 Oct 2024 11:15:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 68652420
- current block number: 68652420

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 68652420 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x7769C18828569692Dfb65affa0856533613ea458"]
      values.$pastUpgrades.1.1:
-        ["0x7769C18828569692Dfb65affa0856533613ea458"]
+        "0xed9f3f5842ead3da2348d8edfbcacf5bf0572cc53ec3443c5229c23845d63f9c"
      values.$pastUpgrades.0.2:
+        ["0xbfa352a683D82a04233Cc45AC1308621BA63283f"]
      values.$pastUpgrades.0.1:
-        ["0xbfa352a683D82a04233Cc45AC1308621BA63283f"]
+        "0xaf05aafd35db4063ec7549aeed61f0a2ced59a80c34aefe1a2f7e0de6a1ac7c8"
    }
```

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0x0C04046546C46652969Aa9eB4BFB758cFDf1e821"]
      values.$pastUpgrades.3.1:
-        ["0x0C04046546C46652969Aa9eB4BFB758cFDf1e821"]
+        "0x10bb5a3d57fc38cfc2e56d9046c00aba1a47fe4ad38162ba0a5ec19c6b2cc6e7"
      values.$pastUpgrades.2.2:
+        ["0xa8486096C719024D4eB2262A45AAc5cA8A256Cd6"]
      values.$pastUpgrades.2.1:
-        ["0xa8486096C719024D4eB2262A45AAc5cA8A256Cd6"]
+        "0xecf1785a348ae45261abf6f4bc82163701840e4740a5c104f036305677d800e8"
      values.$pastUpgrades.1.2:
+        ["0x85079cb83B6cadba34e64bc0f24493F49D8b1F4e"]
      values.$pastUpgrades.1.1:
-        ["0x85079cb83B6cadba34e64bc0f24493F49D8b1F4e"]
+        "0x0f8754436aa05997946fd34f1a0573cb22a6c27181af505cb4d4121723bdd1cd"
      values.$pastUpgrades.0.2:
+        ["0x5715Dec4cd747675E47b969D3a15aab909b8ce05"]
      values.$pastUpgrades.0.1:
-        ["0x5715Dec4cd747675E47b969D3a15aab909b8ce05"]
+        "0x6a00d05f32d4cad32533eacc6bfe09f424002d60b1474ec6d9615d7ad7f86abe"
    }
```

```diff
    contract MantleL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"]
      values.$pastUpgrades.2.1:
-        ["0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"]
+        "0x10bb5a3d57fc38cfc2e56d9046c00aba1a47fe4ad38162ba0a5ec19c6b2cc6e7"
      values.$pastUpgrades.1.2:
+        ["0x09CB6C5A235939258e3F6Ae2989cf6f26EeE1c72"]
      values.$pastUpgrades.1.1:
-        ["0x09CB6C5A235939258e3F6Ae2989cf6f26EeE1c72"]
+        "0xd264b50869bc4bd7d2c3ad80541399bc5a1963aa4ef010ea40e699ab0a56a9a7"
      values.$pastUpgrades.0.2:
+        ["0x55fa5276c44c1B465196898b144524C9c852235E"]
      values.$pastUpgrades.0.1:
-        ["0x55fa5276c44c1B465196898b144524C9c852235E"]
+        "0xdb5d3920a2bbd9c5a3d97b54c227aa56d0f555060a03d7212a0d05b4239ec0f9"
    }
```

Generated with discovered.json: 0x729919227ea660a71791fef4d4111da16ef2aa8c

# Diff at Mon, 14 Oct 2024 11:00:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 68652420
- current block number: 68652420

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 68652420 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2) {
    +++ description: None
      sourceHashes:
+        ["0x8c407edc4ac1fa1cea2c45903e2cf0158906a2ff39fc2eb92aca3ca9f0d43ed8","0xcabc91ee17e9a771bb999a95f4705966cf206325fc82ac15d440c8b6086f9679"]
    }
```

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0xce3f5eaddd62b6c043d92c0ff2cc4eed6369114f68e9d57c1b76f3d26dd29fa2"]
    }
```

```diff
    contract MantleL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0xf74567f04dfc1337e1295ac8ee70891c3e1543ec852c2205630c0bcc4e0b6a19"]
    }
```

```diff
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82) {
    +++ description: None
      sourceHashes:
+        ["0x8fd8f837bb320bd2a7463c103bea2ff207b0969b5795f320a6c868858aa92074"]
    }
```

Generated with discovered.json: 0x0850f56469deb78be9412ff020fedbe0f4b8dfe5

# Diff at Tue, 01 Oct 2024 11:14:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 68652420
- current block number: 68652420

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 68652420 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T12:41:47.000Z",["0xbfa352a683D82a04233Cc45AC1308621BA63283f"]],["2024-04-04T06:27:28.000Z",["0x7769C18828569692Dfb65affa0856533613ea458"]]]
    }
```

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T07:48:29.000Z",["0x5715Dec4cd747675E47b969D3a15aab909b8ce05"]],["2024-03-09T10:15:53.000Z",["0x85079cb83B6cadba34e64bc0f24493F49D8b1F4e"]],["2024-04-22T02:31:22.000Z",["0xa8486096C719024D4eB2262A45AAc5cA8A256Cd6"]],["2024-05-03T09:09:50.000Z",["0x0C04046546C46652969Aa9eB4BFB758cFDf1e821"]]]
    }
```

```diff
    contract MantleL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T07:49:58.000Z",["0x55fa5276c44c1B465196898b144524C9c852235E"]],["2024-03-09T10:51:51.000Z",["0x09CB6C5A235939258e3F6Ae2989cf6f26EeE1c72"]],["2024-05-03T09:09:50.000Z",["0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"]]]
    }
```

Generated with discovered.json: 0x3f175e737441e0168f3f17bb38ed09bb8523ebc9

# Diff at Wed, 04 Sep 2024 07:32:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@878a951312cec062f5003f6749f781861b0cdba1 block: 66927056
- current block number: 68652420

## Description

Set forwardFeeAllocator to MantleOwner MS. The forwardFee consists of fees paid to 'validators' for `requestL2Transaction()`.

## Watched changes

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      values.forwardFeeAllocator:
-        "0x0000000000000000000000000000000000000000"
+        "0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60"
    }
```

Generated with discovered.json: 0x3df07a64992ffdc4f0c99745024eacb4dc59de4d

# Diff at Fri, 30 Aug 2024 08:17:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 66927056
- current block number: 66927056

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 66927056 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x89518b8861a7b468c0a794b437d67c3362083723

# Diff at Fri, 23 Aug 2024 09:58:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 66927056
- current block number: 66927056

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 66927056 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract MantleL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x6d7752a9faa6ff12dbe96d4f680ce3ca3308fce1

# Diff at Wed, 21 Aug 2024 10:08:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 66927056
- current block number: 66927056

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 66927056 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xD784d7128B46B60Ca7d8BdC17dCEC94917455657","0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xD784d7128B46B60Ca7d8BdC17dCEC94917455657","via":[]},{"permission":"upgrade","target":"0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82","via":[]}]
    }
```

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60","via":[]}]
    }
```

```diff
    contract MantleL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60","via":[]}]
    }
```

```diff
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2","via":[]}]
    }
```

Generated with discovered.json: 0xb3abeaadde332589421296e5a42eef7517e05214

# Diff at Fri, 09 Aug 2024 10:14:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 66927056
- current block number: 66927056

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 66927056 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xD784d7128B46B60Ca7d8BdC17dCEC94917455657","0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"]
      assignedPermissions.upgrade:
+        ["0xD784d7128B46B60Ca7d8BdC17dCEC94917455657","0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"]
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5","0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
-        5
      values.$members:
+        ["0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5","0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

```diff
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2"]
      assignedPermissions.upgrade:
+        ["0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2"]
    }
```

Generated with discovered.json: 0xdb8ff93053129b28521c5831fc3d87d513d1428e

# Diff at Fri, 26 Jul 2024 09:00:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 66795905
- current block number: 66927056

## Description

One signer is added to the Owner MS, and the threshold is increased to 5.

## Watched changes

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 7 (57%)"
+        "5 of 8 (63%)"
      values.getOwners.7:
+        "0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
      values.getOwners.6:
-        "0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
+        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
      values.getOwners.5:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
      values.getOwners.4:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
      values.getOwners.3:
-        "0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
+        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
      values.getOwners.2:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
      values.getOwners.1:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
      values.getOwners.0:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
      values.getThreshold:
-        4
+        5
    }
```

Generated with discovered.json: 0xab25db57124d1d2d28a30d457b8e868e0416a172

# Diff at Tue, 23 Jul 2024 08:08:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1286bb7168d7a169aadeaa92b326e3a5a9f00bf4 block: 66630033
- current block number: 66795905

## Description

Change the explorer from blockscout to etherscan like for Mantle.
The source is verified on both but only Etherscan one returns a correct result.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 66630033 (main branch discovery), not current.

```diff
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60) {
    +++ description: None
      unverified:
-        true
      values.domainSeparator:
+        "0x8ebc72747d383ee6fea9342b35202682cad3166f782cebee00f825155d20b2e4"
      values.getChainId:
+        5000
      values.getOwners:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
+        4
      values.VERSION:
+        "1.3.0"
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x3ac15f495d5328c8ecd593969f7928413892579e

# Diff at Thu, 04 Jul 2024 14:11:04 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 65985974

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract MantleOwner (0x1aB4D3cfcCCB28DBc8993454f461f3565281BB60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MantleL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MantleProxyAdmin (0xeAe8e5180EAE503E4Ffef2F5D48E20164eD41b82)
    +++ description: None
```
