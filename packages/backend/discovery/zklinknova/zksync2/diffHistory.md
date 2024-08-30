Generated with discovered.json: 0x646d06402506bb9ff77fdb6a25ccc86a7a71e41f

# Diff at Fri, 30 Aug 2024 08:18:08 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 40563041
- current block number: 40563041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40563041 (main branch discovery), not current.

```diff
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x2a41feed6d324facc8ab3cc75595c1826d676167

# Diff at Fri, 23 Aug 2024 10:04:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 40563041
- current block number: 40563041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40563041 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract zkLink (0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0xa61b7eed3c4f548f19043a311599895f4e12d72b

# Diff at Wed, 21 Aug 2024 10:09:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 40563041
- current block number: 40563041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40563041 (main branch discovery), not current.

```diff
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98","via":[]}]
    }
```

```diff
    contract zkLink (0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3334552599C9aA1FE08CfF276A02033FF37646ca","via":[]}]
    }
```

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08","via":[]}]
    }
```

Generated with discovered.json: 0x5a2da4664d1fdf7f031ace8c5c557531374754ab

# Diff at Fri, 09 Aug 2024 10:15:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 40563041
- current block number: 40563041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40563041 (main branch discovery), not current.

```diff
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A"]
      assignedPermissions.upgrade:
+        ["0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A"]
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"]
      assignedPermissions.upgrade:
+        ["0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"]
    }
```

Generated with discovered.json: 0x809763bec8085ad7f96fd287369ad8a7647a56b2

# Diff at Tue, 30 Jul 2024 11:18:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 38562106
- current block number: 38562106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 38562106 (main branch discovery), not current.

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      unverified:
-        true
      values.owner:
+        "0x3334552599C9aA1FE08CfF276A02033FF37646ca"
    }
```

Generated with discovered.json: 0x9c38ef301be16ede2a03d4ef7be10db31587c37d

# Diff at Mon, 08 Jul 2024 11:13:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 38562106

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98)
    +++ description: None
```
