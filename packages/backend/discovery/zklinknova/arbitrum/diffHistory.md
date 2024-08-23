Generated with discovered.json: 0x4fb288a3d6eccd2f8d0f1933ef73cb56b5a01660

# Diff at Fri, 23 Aug 2024 09:57:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 236183206
- current block number: 236183206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 236183206 (main branch discovery), not current.

```diff
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0xf5ed5654a4bf603d5d83fd21c51942d132645e0c

# Diff at Wed, 21 Aug 2024 10:07:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 236183206
- current block number: 236183206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 236183206 (main branch discovery), not current.

```diff
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585","via":[]}]
    }
```

```diff
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F","via":[]}]
    }
```

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x7bd79DEd935B542fb22c74305a4d2A293C18483a","0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x7bd79DEd935B542fb22c74305a4d2A293C18483a","via":[]},{"permission":"upgrade","target":"0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48698A17D193bFc882395AC06a1DEdbb222F2917","via":[]}]
    }
```

```diff
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F","via":[]}]
    }
```

Generated with discovered.json: 0xd0c699fa1ecd3ab39127652bf279e28e11fb35e4

# Diff at Fri, 09 Aug 2024 12:03:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 236183206
- current block number: 236183206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 236183206 (main branch discovery), not current.

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x7bd79DEd935B542fb22c74305a4d2A293C18483a"
+        "0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"
      assignedPermissions.upgrade.0:
-        "0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"
+        "0x7bd79DEd935B542fb22c74305a4d2A293C18483a"
    }
```

Generated with discovered.json: 0x95ee912601a055d0374480a11c0f88d66cf984e0

# Diff at Fri, 09 Aug 2024 10:13:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 236183206
- current block number: 236183206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 236183206 (main branch discovery), not current.

```diff
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585"]
      assignedPermissions.upgrade:
+        ["0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585"]
    }
```

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x7bd79DEd935B542fb22c74305a4d2A293C18483a","0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A"]
      assignedPermissions.upgrade:
+        ["0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A","0x7bd79DEd935B542fb22c74305a4d2A293C18483a"]
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0x597584cf793814ce5a34508814da3c40519a17dd

# Diff at Fri, 26 Jul 2024 08:09:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 231384315
- current block number: 236183206

## Description

The admin / owner MS threshold is lowered to 5/8.

## Watched changes

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 8 (75%)"
+        "5 of 8 (63%)"
      values.getThreshold:
-        6
+        5
    }
```

Generated with discovered.json: 0x85cbc6a4cd4dcbb2283e6b810b1867b8faaeacc6

# Diff at Thu, 04 Jul 2024 14:08:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 228694559

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A)
    +++ description: None
```
