Generated with discovered.json: 0x8396918b08f37fcb72fbdcea51ded3941aa2cb28

# Diff at Fri, 23 Aug 2024 09:58:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 122588960
- current block number: 122588960

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122588960 (main branch discovery), not current.

```diff
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract OptimismL2Gateway (0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xc5b39424495a8c0ac94d36d9f41f211f96b4c40b

# Diff at Wed, 21 Aug 2024 10:08:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 122588960
- current block number: 122588960

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122588960 (main branch discovery), not current.

```diff
    contract OptimismOwner (0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b","via":[]}]
    }
```

```diff
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4","via":[]}]
    }
```

```diff
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5Bd51296423A9079b931414C1De65e7057326EaA"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5Bd51296423A9079b931414C1De65e7057326EaA","via":[]}]
    }
```

```diff
    contract OptimismL2Gateway (0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9","via":[]}]
    }
```

Generated with discovered.json: 0x515218ccc8a2023cbc1df91afe6d29537249c724

# Diff at Fri, 09 Aug 2024 10:14:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 122588960
- current block number: 122588960

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122588960 (main branch discovery), not current.

```diff
    contract OptimismOwner (0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b"]
      assignedPermissions.upgrade:
+        ["0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b"]
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0xF801886AE2e127A269B0F11892edb54F692d02dF","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0xF801886AE2e127A269B0F11892edb54F692d02dF","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5Bd51296423A9079b931414C1De65e7057326EaA"]
      assignedPermissions.upgrade:
+        ["0x5Bd51296423A9079b931414C1De65e7057326EaA"]
    }
```

Generated with discovered.json: 0xa51534df8bfe3518dad65a0bf2236ff93765bf84

# Diff at Thu, 04 Jul 2024 14:10:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 122251717

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismOwner (0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismL2Gateway (0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c)
    +++ description: None
```
