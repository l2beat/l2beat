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
