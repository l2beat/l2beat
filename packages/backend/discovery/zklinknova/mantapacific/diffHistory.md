Generated with discovered.json: 0x48419a5f8e0ba246d12e03416531dc7bf1666e92

# Diff at Fri, 30 Aug 2024 08:18:00 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 2775705
- current block number: 2775705

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 2775705 (main branch discovery), not current.

```diff
    contract MantaProxyAdmin (0x01aFbE3D5DC8A0C8271de9bCB091224f037EfE05) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract MantaOwner (0x6ed8745d9ad0EE1fEeB060d63c7cf78A7E4c2dE3) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xc6a57a74888bec5bfd5711e822644f1288c9ee3a

# Diff at Fri, 23 Aug 2024 10:04:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 2775705
- current block number: 2775705

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 2775705 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0x44a65dc12865A1e5249b45b4868f32b0E37168FF) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract MantaL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

Generated with discovered.json: 0xfd83ed71bd8a078fd622c1de22d19854c253cf0a

# Diff at Wed, 21 Aug 2024 10:09:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 2775705
- current block number: 2775705

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 2775705 (main branch discovery), not current.

```diff
    contract MantaProxyAdmin (0x01aFbE3D5DC8A0C8271de9bCB091224f037EfE05) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x44a65dc12865A1e5249b45b4868f32b0E37168FF"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x44a65dc12865A1e5249b45b4868f32b0E37168FF","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0x44a65dc12865A1e5249b45b4868f32b0E37168FF) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x01aFbE3D5DC8A0C8271de9bCB091224f037EfE05","via":[]}]
    }
```

```diff
    contract MantaOwner (0x6ed8745d9ad0EE1fEeB060d63c7cf78A7E4c2dE3) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xD784d7128B46B60Ca7d8BdC17dCEC94917455657","0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xD784d7128B46B60Ca7d8BdC17dCEC94917455657","via":[]},{"permission":"upgrade","target":"0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0","via":[]}]
    }
```

```diff
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6ed8745d9ad0EE1fEeB060d63c7cf78A7E4c2dE3","via":[]}]
    }
```

```diff
    contract MantaL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x6ed8745d9ad0EE1fEeB060d63c7cf78A7E4c2dE3","via":[]}]
    }
```

Generated with discovered.json: 0x4d5d69268c2ca065474e71d7ff199b2301573618

# Diff at Fri, 09 Aug 2024 10:15:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 2775705
- current block number: 2775705

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 2775705 (main branch discovery), not current.

```diff
    contract MantaProxyAdmin (0x01aFbE3D5DC8A0C8271de9bCB091224f037EfE05) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x44a65dc12865A1e5249b45b4868f32b0E37168FF"]
      assignedPermissions.upgrade:
+        ["0x44a65dc12865A1e5249b45b4868f32b0E37168FF"]
    }
```

```diff
    contract MantaOwner (0x6ed8745d9ad0EE1fEeB060d63c7cf78A7E4c2dE3) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xD784d7128B46B60Ca7d8BdC17dCEC94917455657","0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"]
      assignedPermissions.upgrade:
+        ["0xD784d7128B46B60Ca7d8BdC17dCEC94917455657","0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0"]
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.$members:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xC75EFCffEE930706daec5CaCA012551f6a1845D7"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0xf6aa6335d2d9c7bfd38d9bd5081837c100dc94a7

# Diff at Fri, 26 Jul 2024 08:03:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 2708488
- current block number: 2775705

## Description

Apparently a threshold change, but the contract is still unverified. (partial match source available on blockscout)

## Watched changes

```diff
    contract MantaOwner (0x6ed8745d9ad0EE1fEeB060d63c7cf78A7E4c2dE3) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 8 (75%)"
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0x4e01f9510bb002c5303c9be45611bc4e29f50750

# Diff at Thu, 04 Jul 2024 14:14:21 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 2587849

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract MantaProxyAdmin (0x01aFbE3D5DC8A0C8271de9bCB091224f037EfE05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x44a65dc12865A1e5249b45b4868f32b0E37168FF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MantaOwner (0x6ed8745d9ad0EE1fEeB060d63c7cf78A7E4c2dE3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0xD784d7128B46B60Ca7d8BdC17dCEC94917455657)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MantaL2Gateway (0xe946aBB40928326ce5bFF303E7B8f0f253EA39D0)
    +++ description: None
```
