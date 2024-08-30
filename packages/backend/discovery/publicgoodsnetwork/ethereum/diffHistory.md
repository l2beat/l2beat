Generated with discovered.json: 0x79706732aca64cb15250b825f8ca1de7058f06dc

# Diff at Fri, 30 Aug 2024 07:54:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x26350be1f4dd7125f2b882747aae2f09a4f6485d

# Diff at Fri, 23 Aug 2024 09:54:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x5f699be0a8d5eb5b06d9d59e455e8037f12fd2da

# Diff at Wed, 21 Aug 2024 10:05:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract AddressManager (0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9","0xA38d0c4E6319F9045F20318BA5f04CDe94208608","0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"],"configure":["0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e","via":[]},{"permission":"upgrade","target":"0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9","via":[]},{"permission":"upgrade","target":"0xA38d0c4E6319F9045F20318BA5f04CDe94208608","via":[]},{"permission":"upgrade","target":"0xb26Fd985c5959bBB382BAFdD0b879E149e48116c","via":[]},{"permission":"upgrade","target":"0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

Generated with discovered.json: 0x0c82b153ac9329e004dc15fd4291b1a2d2eedb2e

# Diff at Fri, 09 Aug 2024 12:01:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      assignedPermissions.upgrade.3:
-        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
+        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      assignedPermissions.upgrade.2:
-        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
+        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
      assignedPermissions.upgrade.1:
-        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
+        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
      assignedPermissions.upgrade.0:
-        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
+        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
    }
```

Generated with discovered.json: 0x2dde3e18ce3318c8e84e469024888c3ce773e843

# Diff at Fri, 09 Aug 2024 10:11:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x39E13D1AB040F6EA58CE19998edCe01B3C365f84) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0xc2E2B715d9e302947Ec7e312fd2384b5a1296099"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0xc2E2B715d9e302947Ec7e312fd2384b5a1296099"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4, inheriting its permissions.
      assignedPermissions.owner:
-        ["0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"]
      assignedPermissions.configure:
+        ["0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"]
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9","0xA38d0c4E6319F9045F20318BA5f04CDe94208608","0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"]
      assignedPermissions.owner:
-        ["0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"]
      assignedPermissions.upgrade:
+        ["0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","0xb26Fd985c5959bBB382BAFdD0b879E149e48116c","0xA38d0c4E6319F9045F20318BA5f04CDe94208608","0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"]
      assignedPermissions.configure:
+        ["0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"]
    }
```

Generated with discovered.json: 0xd5f006f56c4e046475e5e1ef80c9497d3e20979b

# Diff at Thu, 18 Jul 2024 10:32:47 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x9f89d7f2e2eea063f495cce35514380d49633a2d

# Diff at Wed, 22 May 2024 20:13:12 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918775
- current block number: 19927728

## Description

ConduitMultisig update.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.5:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.getOwners.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0x6a8679c1d8f1ec1bdccf53951f97bb3436ba5889

# Diff at Tue, 21 May 2024 14:08:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19532103
- current block number: 19918775

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532103 (main branch discovery), not current.

```diff
    contract PGNMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "PGNMultisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x3af74a028f093464bb45449bfbbc2725da130630

# Diff at Thu, 28 Mar 2024 10:46:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19412045
- current block number: 19532103

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19412045 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x39E13D1AB040F6EA58CE19998edCe01B3C365f84) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract PGNMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x5295b6a71b2ec6aa8e0b2c6b1e45e44d73aafded

# Diff at Mon, 11 Mar 2024 13:08:12 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176788
- current block number: 19412045

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176788 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x4910121fd83e64fa0992aec7f3e348c3682f484b

# Diff at Wed, 07 Feb 2024 14:04:28 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175197
- current block number: 19176788

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175197 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.sequencerInbox:
+        "0xC1B90E1e459aBBDcEc4DCF90dA45ba077d83BFc5"
    }
```

Generated with discovered.json: 0xd087db262c876ac1e8569f8dfae22c3d82d65a41

# Diff at Wed, 07 Feb 2024 08:42:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090323
- current block number: 19175197

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090323 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        true
    }
```

Generated with discovered.json: 0x2ea26678bb8058c9f76cb5359240833a22025e41

# Diff at Fri, 26 Jan 2024 10:56:51 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 18927684
- current block number: 19090323

## Description

Added opStackDa handler

## Watched changes

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
+        true
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18927684 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":false,"isSomeTxsLengthEqualToCelestiaDAExample":false}
    }
```

Generated with discovered.json: 0x6aa5358cf6c02ec15a51221026873cf8df87d220

# Diff at Wed, 03 Jan 2024 15:21:30 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e8eb03b39061a86a8ec01e26d970e40d080ad225

## Description

One owner is removed and another is added to PGNMultiSig.

## Watched changes

```diff
    contract PGNMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
      values.getOwners.4:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.3:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.2:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.1:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.0:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

# Diff at Tue, 26 Sep 2023 09:36:43 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
      values.deletedOutputs:
+        []
    }
```
