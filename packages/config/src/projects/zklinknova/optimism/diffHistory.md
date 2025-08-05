Generated with discovered.json: 0xfcc5dfb8c2f941716113c58af4bbe3fb002a0bcd

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
    contract OptimismzkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      name:
-        "zkLink"
+        "OptimismzkLink"
    }
```

```diff
    contract OptimismL1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA) {
    +++ description: None
      name:
-        "L1ERC20Bridge"
+        "OptimismL1ERC20Bridge"
    }
```

Generated with discovered.json: 0x900fcd8607e80cd106ad86ce45d715008957a51a

# Diff at Mon, 14 Jul 2025 12:47:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 133041012
- current block number: 133041012

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 133041012 (main branch discovery), not current.

```diff
    EOA  (0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9) {
    +++ description: None
      address:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "oeth:0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
    }
```

```diff
    contract OptimismOwner (0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9) {
    +++ description: None
      address:
-        "0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
+        "oeth:0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "oeth:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
+        "oeth:0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
      values.$members.1:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "oeth:0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
      values.$members.2:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "oeth:0xF801886AE2e127A269B0F11892edb54F692d02dF"
      values.$members.3:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "oeth:0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
      values.$members.4:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "oeth:0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
      values.$members.5:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "oeth:0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
      values.$members.6:
-        "0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
+        "oeth:0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
      values.$members.7:
-        "0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
+        "oeth:0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
      implementationNames.0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.oeth:0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9:
+        "GnosisSafeProxy"
      implementationNames.oeth:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9) {
    +++ description: None
      address:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "oeth:0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
    }
```

```diff
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      address:
-        "0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b"
+        "oeth:0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b"
      values.$admin:
-        "0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
+        "oeth:0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
      values.$implementation:
-        "0xe71A6Cfb42D0398f6d6aeD8a19987C83bbE3B86E"
+        "oeth:0xe71A6Cfb42D0398f6d6aeD8a19987C83bbE3B86E"
      values.$pastUpgrades.0.2.0:
-        "0xebdA7f097EF976e8E82FA11F05ef1906f3068105"
+        "oeth:0xebdA7f097EF976e8E82FA11F05ef1906f3068105"
      values.$pastUpgrades.1.2.0:
-        "0xe71A6Cfb42D0398f6d6aeD8a19987C83bbE3B86E"
+        "oeth:0xe71A6Cfb42D0398f6d6aeD8a19987C83bbE3B86E"
      values.forwardFeeAllocator:
-        "0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
+        "oeth:0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
      values.gateway:
-        "0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c"
+        "oeth:0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c"
      values.getGateway:
-        "0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c"
+        "oeth:0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c"
      values.getGovernor:
-        "0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
+        "oeth:0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
      values.owner:
-        "0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
+        "oeth:0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
      implementationNames.0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b:
-        "ERC1967Proxy"
      implementationNames.0xe71A6Cfb42D0398f6d6aeD8a19987C83bbE3B86E:
-        "ZkLink"
      implementationNames.oeth:0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b:
+        "ERC1967Proxy"
      implementationNames.oeth:0xe71A6Cfb42D0398f6d6aeD8a19987C83bbE3B86E:
+        "ZkLink"
    }
```

```diff
    EOA  (0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5) {
    +++ description: None
      address:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "oeth:0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
    }
```

```diff
    contract L1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA) {
    +++ description: None
      address:
-        "0x5Bd51296423A9079b931414C1De65e7057326EaA"
+        "oeth:0x5Bd51296423A9079b931414C1De65e7057326EaA"
      values.$admin:
-        "0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"
+        "oeth:0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"
      values.$implementation:
-        "0x21Fe89FfB96d4092b42c8ab35dcFEee50a86C3B8"
+        "oeth:0x21Fe89FfB96d4092b42c8ab35dcFEee50a86C3B8"
      values.$pastUpgrades.0.2.0:
-        "0x683669E5B6cDc6636673a5f7ddB68E20812216F5"
+        "oeth:0x683669E5B6cDc6636673a5f7ddB68E20812216F5"
      values.$pastUpgrades.1.2.0:
-        "0x21Fe89FfB96d4092b42c8ab35dcFEee50a86C3B8"
+        "oeth:0x21Fe89FfB96d4092b42c8ab35dcFEee50a86C3B8"
      values.l2Bridge:
-        "0x6aAdaA7Bf9F5283cAF3eb2E40573D1A4d02C8B15"
+        "oeth:0x6aAdaA7Bf9F5283cAF3eb2E40573D1A4d02C8B15"
      values.l2TokenBeacon:
-        "0xC9c41965710Dcc1434A7B7d44dAf6A4418E2C27d"
+        "oeth:0xC9c41965710Dcc1434A7B7d44dAf6A4418E2C27d"
      implementationNames.0x5Bd51296423A9079b931414C1De65e7057326EaA:
-        "TransparentUpgradeableProxy"
      implementationNames.0x21Fe89FfB96d4092b42c8ab35dcFEee50a86C3B8:
-        "L1ERC20Bridge"
      implementationNames.oeth:0x5Bd51296423A9079b931414C1De65e7057326EaA:
+        "TransparentUpgradeableProxy"
      implementationNames.oeth:0x21Fe89FfB96d4092b42c8ab35dcFEee50a86C3B8:
+        "L1ERC20Bridge"
    }
```

```diff
    EOA  (0x6aAdaA7Bf9F5283cAF3eb2E40573D1A4d02C8B15) {
    +++ description: None
      address:
-        "0x6aAdaA7Bf9F5283cAF3eb2E40573D1A4d02C8B15"
+        "oeth:0x6aAdaA7Bf9F5283cAF3eb2E40573D1A4d02C8B15"
    }
```

```diff
    EOA  (0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10) {
    +++ description: None
      address:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "oeth:0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
    }
```

```diff
    EOA  (0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db) {
    +++ description: None
      address:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "oeth:0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
    }
```

```diff
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4) {
    +++ description: None
      address:
-        "0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"
+        "oeth:0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"
      values.owner:
-        "0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
+        "oeth:0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
      implementationNames.0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4:
-        "ProxyAdmin"
      implementationNames.oeth:0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4:
+        "ProxyAdmin"
    }
```

```diff
    contract OptimismL2Gateway (0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c) {
    +++ description: None
      address:
-        "0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c"
+        "oeth:0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c"
      values.$admin:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "oeth:0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
      values.$implementation:
-        "0x3C3f4b866f8c6F0D2c912feE36D5Ad337a9AA98e"
+        "oeth:0x3C3f4b866f8c6F0D2c912feE36D5Ad337a9AA98e"
      values.$pastUpgrades.0.2.0:
-        "0x3C3f4b866f8c6F0D2c912feE36D5Ad337a9AA98e"
+        "oeth:0x3C3f4b866f8c6F0D2c912feE36D5Ad337a9AA98e"
      values.getRemoteGateway:
-        "0x668e8F67adB8219e1816C2E5bBEa055A78AF3026"
+        "oeth:0x668e8F67adB8219e1816C2E5bBEa055A78AF3026"
      values.MESSAGE_SERVICE:
-        "0x4200000000000000000000000000000000000007"
+        "oeth:0x4200000000000000000000000000000000000007"
      values.owner:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "oeth:0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
      values.ZKLINK:
-        "0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b"
+        "oeth:0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b"
      implementationNames.0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c:
-        "ERC1967Proxy"
      implementationNames.0x3C3f4b866f8c6F0D2c912feE36D5Ad337a9AA98e:
-        "OptimismL2Gateway"
      implementationNames.oeth:0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c:
+        "ERC1967Proxy"
      implementationNames.oeth:0x3C3f4b866f8c6F0D2c912feE36D5Ad337a9AA98e:
+        "OptimismL2Gateway"
    }
```

```diff
    EOA  (0xC9c41965710Dcc1434A7B7d44dAf6A4418E2C27d) {
    +++ description: None
      address:
-        "0xC9c41965710Dcc1434A7B7d44dAf6A4418E2C27d"
+        "oeth:0xC9c41965710Dcc1434A7B7d44dAf6A4418E2C27d"
    }
```

```diff
    EOA  (0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5) {
    +++ description: None
      address:
-        "0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
+        "oeth:0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
    }
```

```diff
    EOA  (0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5) {
    +++ description: None
      address:
-        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
+        "oeth:0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
    }
```

```diff
    EOA  (0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92) {
    +++ description: None
      address:
-        "0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
+        "oeth:0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
    }
```

```diff
    EOA  (0xF801886AE2e127A269B0F11892edb54F692d02dF) {
    +++ description: None
      address:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "oeth:0xF801886AE2e127A269B0F11892edb54F692d02dF"
    }
```

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

Generated with discovered.json: 0xbddaa93f509b712c0f23d1051c536da16f19f1e6

# Diff at Fri, 04 Jul 2025 12:19:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 133041012
- current block number: 133041012

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 133041012 (main branch discovery), not current.

```diff
    contract OptimismOwner (0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9) {
    +++ description: None
      receivedPermissions.0.from:
-        "optimism:0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b"
+        "oeth:0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b"
      receivedPermissions.1.via.0.address:
-        "optimism:0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"
+        "oeth:0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"
      receivedPermissions.1.from:
-        "optimism:0x5Bd51296423A9079b931414C1De65e7057326EaA"
+        "oeth:0x5Bd51296423A9079b931414C1De65e7057326EaA"
      directlyReceivedPermissions.0.from:
-        "optimism:0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"
+        "oeth:0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"
    }
```

```diff
    EOA  (0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9) {
    +++ description: None
      receivedPermissions.0.from:
-        "optimism:0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c"
+        "oeth:0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c"
    }
```

```diff
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "optimism:0x5Bd51296423A9079b931414C1De65e7057326EaA"
+        "oeth:0x5Bd51296423A9079b931414C1De65e7057326EaA"
    }
```

Generated with discovered.json: 0xc1e61ab6f4e52b5081e6a264f79be6ff5a21fba0

# Diff at Fri, 23 May 2025 09:41:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 133041012
- current block number: 133041012

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 133041012 (main branch discovery), not current.

```diff
    contract OptimismOwner (0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x1ca5426a409ba18a753aa6c5156106c19d80ec05

# Diff at Tue, 29 Apr 2025 08:19:31 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 133041012
- current block number: 133041012

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 133041012 (main branch discovery), not current.

```diff
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9","via":[{"address":"0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"}]}]
    }
```

```diff
    contract OptimismL2Gateway (0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9","via":[]}]
    }
```

Generated with discovered.json: 0x089808f694055a1a43aca5ca4d5cd729f6bac7d0

# Diff at Thu, 10 Apr 2025 14:43:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 133041012
- current block number: 133041012

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 133041012 (main branch discovery), not current.

```diff
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x7958651df6cefab3f877a52c33d50f0969bfa147

# Diff at Tue, 11 Mar 2025 08:13:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 133013374
- current block number: 133041012

## Description

proxyadmin template match.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 133013374 (main branch discovery), not current.

```diff
    contract OptimismOwner (0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"upgrade","from":"0x5Bd51296423A9079b931414C1De65e7057326EaA","via":[{"address":"0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"}]}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"}]
    }
```

```diff
    contract L1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"
+        "0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
      issuedPermissions.0.via.0:
+        {"address":"0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"}
    }
```

```diff
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x5Bd51296423A9079b931414C1De65e7057326EaA"}]
      template:
+        "global/ProxyAdmin"
      displayName:
+        "ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x5Bd51296423A9079b931414C1De65e7057326EaA"}]
    }
```

Generated with discovered.json: 0x02cf017dbd09638578826e1417623dde29e92dd1

# Diff at Mon, 10 Mar 2025 16:52:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef4d1036423fe7d398c41e6cf238a209cc1ff8f3 block: 124973335
- current block number: 133013374

## Description

zklink core contract paused. this only prevents deposits/ on the affected chains.

## Watched changes

```diff
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x1ee9479542f8e165cc0d73e94bb15b320bcbd35b

# Diff at Tue, 04 Mar 2025 10:40:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 124973335
- current block number: 124973335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 124973335 (main branch discovery), not current.

```diff
    contract OptimismOwner (0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9) {
    +++ description: None
      sinceBlock:
+        108503592
    }
```

```diff
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      sinceBlock:
+        117746854
    }
```

```diff
    contract L1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA) {
    +++ description: None
      sinceBlock:
+        117748367
    }
```

```diff
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4) {
    +++ description: None
      sinceBlock:
+        117748367
    }
```

```diff
    contract OptimismL2Gateway (0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c) {
    +++ description: None
      sinceBlock:
+        117746900
    }
```

Generated with discovered.json: 0xf6a85b69338095742fdf4ed0e0a0e9acb44a4647

# Diff at Mon, 20 Jan 2025 11:10:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 124973335
- current block number: 124973335

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 124973335 (main branch discovery), not current.

```diff
    contract OptimismOwner (0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b"
      receivedPermissions.0.from:
+        "0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b"
    }
```

```diff
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
      issuedPermissions.0.to:
+        "0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
    }
```

```diff
    contract L1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"
      issuedPermissions.0.to:
+        "0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4"
    }
```

```diff
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x5Bd51296423A9079b931414C1De65e7057326EaA"
      receivedPermissions.0.from:
+        "0x5Bd51296423A9079b931414C1De65e7057326EaA"
    }
```

```diff
    contract OptimismL2Gateway (0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
      issuedPermissions.0.to:
+        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
    }
```

Generated with discovered.json: 0x660acb97b745e14abe5d3ece3752f83631e48bbb

# Diff at Mon, 21 Oct 2024 11:14:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 124973335
- current block number: 124973335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 124973335 (main branch discovery), not current.

```diff
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xe71A6Cfb42D0398f6d6aeD8a19987C83bbE3B86E"]
      values.$pastUpgrades.1.1:
-        ["0xe71A6Cfb42D0398f6d6aeD8a19987C83bbE3B86E"]
+        "0xc9ff607b3fb208f26fadc47cde08c41273c79039e1f7bf2c9f5313d4b3869107"
      values.$pastUpgrades.0.2:
+        ["0xebdA7f097EF976e8E82FA11F05ef1906f3068105"]
      values.$pastUpgrades.0.1:
-        ["0xebdA7f097EF976e8E82FA11F05ef1906f3068105"]
+        "0x412ad99eb52f12520a7367ec39f9b56a06e25aa1b17847dbe23f6700baa4bfaa"
    }
```

```diff
    contract L1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x21Fe89FfB96d4092b42c8ab35dcFEee50a86C3B8"]
      values.$pastUpgrades.1.1:
-        ["0x21Fe89FfB96d4092b42c8ab35dcFEee50a86C3B8"]
+        "0x5154061f44b9d3baf51c0211c4a0126b47486e3e06d89006106034afd62e24f8"
      values.$pastUpgrades.0.2:
+        ["0x683669E5B6cDc6636673a5f7ddB68E20812216F5"]
      values.$pastUpgrades.0.1:
-        ["0x683669E5B6cDc6636673a5f7ddB68E20812216F5"]
+        "0x965f198c04e811f47221086ef6452f50af7e949ff2f5bb10125ba1a516999e44"
    }
```

```diff
    contract OptimismL2Gateway (0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x3C3f4b866f8c6F0D2c912feE36D5Ad337a9AA98e"]
      values.$pastUpgrades.0.1:
-        ["0x3C3f4b866f8c6F0D2c912feE36D5Ad337a9AA98e"]
+        "0x2da77621f5936cebac55ac1c25951289f2aad1fae1a7a0ccb8388b2332f804e4"
    }
```

Generated with discovered.json: 0xac2bac7da476091f0ae776db784c603caa226b1c

# Diff at Mon, 14 Oct 2024 11:00:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 124973335
- current block number: 124973335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 124973335 (main branch discovery), not current.

```diff
    contract OptimismOwner (0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x9d3b6cf7c8756dc6cce424dc754ed146f84d3201e5223d47b0a4fcd994a76a7f"]
    }
```

```diff
    contract L1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA) {
    +++ description: None
      sourceHashes:
+        ["0x8c407edc4ac1fa1cea2c45903e2cf0158906a2ff39fc2eb92aca3ca9f0d43ed8","0xcabc91ee17e9a771bb999a95f4705966cf206325fc82ac15d440c8b6086f9679"]
    }
```

```diff
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4) {
    +++ description: None
      sourceHashes:
+        ["0x8fd8f837bb320bd2a7463c103bea2ff207b0969b5795f320a6c868858aa92074"]
    }
```

```diff
    contract OptimismL2Gateway (0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x650e6121058aa74419a8d997f6cf169c5bb82b7e6302193672de5f10c1c1e561"]
    }
```

Generated with discovered.json: 0x4530b258d40ebe165cca891aa6dbddbecdd3ab09

# Diff at Tue, 01 Oct 2024 11:13:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 124973335
- current block number: 124973335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 124973335 (main branch discovery), not current.

```diff
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T07:28:05.000Z",["0xebdA7f097EF976e8E82FA11F05ef1906f3068105"]],["2024-04-18T13:21:33.000Z",["0xe71A6Cfb42D0398f6d6aeD8a19987C83bbE3B86E"]]]
    }
```

```diff
    contract L1ERC20Bridge (0x5Bd51296423A9079b931414C1De65e7057326EaA) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T08:18:31.000Z",["0x683669E5B6cDc6636673a5f7ddB68E20812216F5"]],["2024-04-04T06:24:53.000Z",["0x21Fe89FfB96d4092b42c8ab35dcFEee50a86C3B8"]]]
    }
```

```diff
    contract OptimismL2Gateway (0xaD5d729291C0d6A299E370814CA6Ce1c8C25b51c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T07:29:37.000Z",["0x3C3f4b866f8c6F0D2c912feE36D5Ad337a9AA98e"]]]
    }
```

Generated with discovered.json: 0x9eeff892b00d665fd1fedef86725b3eb91163a99

# Diff at Thu, 05 Sep 2024 14:10:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d01da0bcdde8e77051659c9718e449a44f5f957a block: 124918219
- current block number: 124973335

## Description

Fee withdrawer changed to OptimismOwner.

## Watched changes

```diff
    contract zkLink (0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b) {
    +++ description: None
      values.forwardFeeAllocator:
-        "0x0000000000000000000000000000000000000000"
+        "0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9"
    }
```

Generated with discovered.json: 0x7d50bd948c12967a5ab1bedb727d6805415e08c2

# Diff at Wed, 04 Sep 2024 07:33:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@878a951312cec062f5003f6749f781861b0cdba1 block: 122588960
- current block number: 124918219

## Description

One signer is added to OptimismOwner MS (and threshold increased to 5/8).

## Watched changes

```diff
    contract OptimismOwner (0x2c3FF918E3925CC3ba95f41307D1cfBEFDF93dB9) {
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

Generated with discovered.json: 0x4581d4cb0934e9444a32da90225c8625ce71e03e

# Diff at Fri, 30 Aug 2024 08:09:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 122588960
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
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract OptimismProxyAdmin (0xA688B4E1375Ed6b9129dF4959da4a271B33e50a4) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

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
