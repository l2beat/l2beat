Generated with discovered.json: 0x9d20a45aef54e0a11919ca39a3300349b4e5abdd

# Diff at Wed, 04 Sep 2024 07:32:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@878a951312cec062f5003f6749f781861b0cdba1 block: 17596075
- current block number: 19322901

## Description

Add one signer to the MS, increase threshold to 5/8.

## Watched changes

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      values.$members.7:
+        "0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
      values.$members.6:
-        "0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
+        "0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
      values.$members.5:
-        "0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
+        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
      values.$members.4:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
      values.$members.3:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
      values.$members.2:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
      values.$members.1:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
      values.$members.0:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
      values.$threshold:
-        4
+        5
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0x086346a6cadc0dd620fa64682a084e9fbf6c4c5a

# Diff at Fri, 30 Aug 2024 08:17:27 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 17596075
- current block number: 17596075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17596075 (main branch discovery), not current.

```diff
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xdc59fa8ac919c4ce129af4e5c7295cba97e1ad8b

# Diff at Fri, 23 Aug 2024 09:57:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 17596075
- current block number: 17596075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17596075 (main branch discovery), not current.

```diff
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xc9e4ea4138df34eb0d2b8fb49cfc888beea54032

# Diff at Wed, 21 Aug 2024 10:08:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 17596075
- current block number: 17596075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17596075 (main branch discovery), not current.

```diff
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE","via":[]}]
    }
```

```diff
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x80d12A78EfE7604F00ed07aB2f16F643301674D5"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x80d12A78EfE7604F00ed07aB2f16F643301674D5","via":[]}]
    }
```

```diff
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C","via":[]}]
    }
```

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd","via":[]}]
    }
```

Generated with discovered.json: 0x4347b60465d4f469d7a829995eb1b4548deaf759

# Diff at Fri, 09 Aug 2024 10:14:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 17596075
- current block number: 17596075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17596075 (main branch discovery), not current.

```diff
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x80d12A78EfE7604F00ed07aB2f16F643301674D5"]
      assignedPermissions.upgrade:
+        ["0x80d12A78EfE7604F00ed07aB2f16F643301674D5"]
    }
```

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd"]
      assignedPermissions.upgrade:
+        ["0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd"]
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

Generated with discovered.json: 0x48895f2e81c94c737dd2f79015ae61f53db17593

# Diff at Fri, 26 Jul 2024 08:11:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 16993704
- current block number: 17596075

## Description

Base admin / owner MS threshold is lowered to 4/7.

## Watched changes

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      values.$multisigThreshold:
-        "5 of 7 (71%)"
+        "4 of 7 (57%)"
      values.getThreshold:
-        5
+        4
    }
```

Generated with discovered.json: 0xd40a7f76a3c835dc8caeb94c859893b3483f8a4b

# Diff at Thu, 04 Jul 2024 14:09:20 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 16656405

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C)
    +++ description: None
```
