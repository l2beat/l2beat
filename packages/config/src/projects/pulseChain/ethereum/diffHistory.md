Generated with discovered.json: 0x6fd5e3f1518980c5084a038589c68e077b350567

# Diff at Mon, 14 Jul 2025 12:45:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22431228
- current block number: 22431228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22431228 (main branch discovery), not current.

```diff
    EOA  (0x0Fb17ADb94627EeA37BB7EF12f85aB4590e3805F) {
    +++ description: None
      address:
-        "0x0Fb17ADb94627EeA37BB7EF12f85aB4590e3805F"
+        "eth:0x0Fb17ADb94627EeA37BB7EF12f85aB4590e3805F"
    }
```

```diff
    EOA  (0x13A9594a2696D3c35F9D6E4Be6b332f699C57801) {
    +++ description: None
      address:
-        "0x13A9594a2696D3c35F9D6E4Be6b332f699C57801"
+        "eth:0x13A9594a2696D3c35F9D6E4Be6b332f699C57801"
    }
```

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      address:
-        "0x1715a3E4A142d8b698131108995174F37aEBA10D"
+        "eth:0x1715a3E4A142d8b698131108995174F37aEBA10D"
      values.$admin:
-        "0x13A9594a2696D3c35F9D6E4Be6b332f699C57801"
+        "eth:0x13A9594a2696D3c35F9D6E4Be6b332f699C57801"
      values.$implementation:
-        "0xB7DF1E00ae030e966E635ede273625240546B873"
+        "eth:0xB7DF1E00ae030e966E635ede273625240546B873"
      values.$pastUpgrades.0.2.0:
-        "0xB7DF1E00ae030e966E635ede273625240546B873"
+        "eth:0xB7DF1E00ae030e966E635ede273625240546B873"
      values.bridgeContract:
-        "0xd0764FAe29E0a6a96fF685f71CfC685456D5636c"
+        "eth:0xd0764FAe29E0a6a96fF685f71CfC685456D5636c"
      values.implementation:
-        "0xB7DF1E00ae030e966E635ede273625240546B873"
+        "eth:0xB7DF1E00ae030e966E635ede273625240546B873"
      values.mediatorContractOnOtherSide:
-        "0x4fD0aaa7506f3d9cB8274bdB946Ec42A1b8751Ef"
+        "eth:0x4fD0aaa7506f3d9cB8274bdB946Ec42A1b8751Ef"
      values.owner:
-        "0x610094aB29D1bf683719d2Ce3495d8635A47bfc6"
+        "eth:0x610094aB29D1bf683719d2Ce3495d8635A47bfc6"
      values.tokenFactory:
-        "0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02"
+        "eth:0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02"
      values.upgradeabilityOwner:
-        "0x13A9594a2696D3c35F9D6E4Be6b332f699C57801"
+        "eth:0x13A9594a2696D3c35F9D6E4Be6b332f699C57801"
      implementationNames.0x1715a3E4A142d8b698131108995174F37aEBA10D:
-        "EternalStorageProxy"
      implementationNames.0xB7DF1E00ae030e966E635ede273625240546B873:
-        "ForeignOmnibridge"
      implementationNames.eth:0x1715a3E4A142d8b698131108995174F37aEBA10D:
+        "EternalStorageProxy"
      implementationNames.eth:0xB7DF1E00ae030e966E635ede273625240546B873:
+        "ForeignOmnibridge"
    }
```

```diff
    EOA  (0x1daD947dD181fAa6c751ec14e2683e0A8fE2bf8c) {
    +++ description: None
      address:
-        "0x1daD947dD181fAa6c751ec14e2683e0A8fE2bf8c"
+        "eth:0x1daD947dD181fAa6c751ec14e2683e0A8fE2bf8c"
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: Custom multisignature contract for Validator addresses.
      address:
-        "0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d"
+        "eth:0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d"
      values.$admin:
-        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
+        "eth:0xDf5d165A7EB95D26355c56d53799B7da1240e585"
      values.$implementation:
-        "0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"
+        "eth:0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"
+++ description: Array of the signers in the validator multisig
      values.$members.0:
-        "0xf6ab64f43F3f9eB88c9D99D119F26Ece13843FC0"
+        "eth:0xf6ab64f43F3f9eB88c9D99D119F26Ece13843FC0"
+++ description: Array of the signers in the validator multisig
      values.$members.1:
-        "0x1daD947dD181fAa6c751ec14e2683e0A8fE2bf8c"
+        "eth:0x1daD947dD181fAa6c751ec14e2683e0A8fE2bf8c"
+++ description: Array of the signers in the validator multisig
      values.$members.2:
-        "0xd4Aa3dFe78D2B77C5A5618B9E85D1141f2b48fbD"
+        "eth:0xd4Aa3dFe78D2B77C5A5618B9E85D1141f2b48fbD"
+++ description: Array of the signers in the validator multisig
      values.$members.3:
-        "0xfB18Da3bCA8057eB05aab6e77a32925949093533"
+        "eth:0xfB18Da3bCA8057eB05aab6e77a32925949093533"
+++ description: Array of the signers in the validator multisig
      values.$members.4:
-        "0xe158313e347ED8d52e9FBfF7aE5000aEAbDDbeDa"
+        "eth:0xe158313e347ED8d52e9FBfF7aE5000aEAbDDbeDa"
+++ description: Array of the signers in the validator multisig
      values.$members.5:
-        "0x5ECfE77502317F3677f23C3b8Ab17929ACE3D74E"
+        "eth:0x5ECfE77502317F3677f23C3b8Ab17929ACE3D74E"
+++ description: Array of the signers in the validator multisig
      values.$members.6:
-        "0xFE9a08BB3ce6C1946c40b8767feF2F97B400dd2C"
+        "eth:0xFE9a08BB3ce6C1946c40b8767feF2F97B400dd2C"
+++ description: Array of the signers in the validator multisig
      values.$members.7:
-        "0xe3B95d0143956A8E643FA29a0795FC4162A41F69"
+        "eth:0xe3B95d0143956A8E643FA29a0795FC4162A41F69"
      values.$pastUpgrades.0.2.0:
-        "0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"
+        "eth:0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"
      values.F_ADDR:
-        "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
+        "eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
      values.implementation:
-        "0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"
+        "eth:0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"
      values.owner:
-        "0x3eA02EF8A3956f69D23B5B30327E0F5e352E513f"
+        "eth:0x3eA02EF8A3956f69D23B5B30327E0F5e352E513f"
      values.upgradeabilityOwner:
-        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
+        "eth:0xDf5d165A7EB95D26355c56d53799B7da1240e585"
      implementationNames.0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d:
-        "EternalStorageProxy"
      implementationNames.0x95B303987A60C71504D99Aa1b13B4DA07b0790ab:
-        "BridgeValidators"
      implementationNames.eth:0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d:
+        "EternalStorageProxy"
      implementationNames.eth:0x95B303987A60C71504D99Aa1b13B4DA07b0790ab:
+        "BridgeValidators"
    }
```

```diff
    EOA  (0x30e22ab6e6B576e6A9c5dD73191237a9A5c72539) {
    +++ description: None
      address:
-        "0x30e22ab6e6B576e6A9c5dD73191237a9A5c72539"
+        "eth:0x30e22ab6e6B576e6A9c5dD73191237a9A5c72539"
    }
```

```diff
    EOA  (0x3eA02EF8A3956f69D23B5B30327E0F5e352E513f) {
    +++ description: None
      address:
-        "0x3eA02EF8A3956f69D23B5B30327E0F5e352E513f"
+        "eth:0x3eA02EF8A3956f69D23B5B30327E0F5e352E513f"
    }
```

```diff
    EOA  (0x4fD0aaa7506f3d9cB8274bdB946Ec42A1b8751Ef) {
    +++ description: None
      address:
-        "0x4fD0aaa7506f3d9cB8274bdB946Ec42A1b8751Ef"
+        "eth:0x4fD0aaa7506f3d9cB8274bdB946Ec42A1b8751Ef"
    }
```

```diff
    EOA  (0x5ECfE77502317F3677f23C3b8Ab17929ACE3D74E) {
    +++ description: None
      address:
-        "0x5ECfE77502317F3677f23C3b8Ab17929ACE3D74E"
+        "eth:0x5ECfE77502317F3677f23C3b8Ab17929ACE3D74E"
    }
```

```diff
    EOA  (0x610094aB29D1bf683719d2Ce3495d8635A47bfc6) {
    +++ description: None
      address:
-        "0x610094aB29D1bf683719d2Ce3495d8635A47bfc6"
+        "eth:0x610094aB29D1bf683719d2Ce3495d8635A47bfc6"
    }
```

```diff
    contract WETHOmnibridgeRouter (0x8AC4ae65b3656e26dC4e0e69108B392283350f55) {
    +++ description: None
      address:
-        "0x8AC4ae65b3656e26dC4e0e69108B392283350f55"
+        "eth:0x8AC4ae65b3656e26dC4e0e69108B392283350f55"
      values.bridge:
-        "0x1715a3E4A142d8b698131108995174F37aEBA10D"
+        "eth:0x1715a3E4A142d8b698131108995174F37aEBA10D"
      values.owner:
-        "0x610094aB29D1bf683719d2Ce3495d8635A47bfc6"
+        "eth:0x610094aB29D1bf683719d2Ce3495d8635A47bfc6"
      implementationNames.0x8AC4ae65b3656e26dC4e0e69108B392283350f55:
-        "WETHOmnibridgeRouter"
      implementationNames.eth:0x8AC4ae65b3656e26dC4e0e69108B392283350f55:
+        "WETHOmnibridgeRouter"
    }
```

```diff
    contract TokenFactory (0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02) {
    +++ description: None
      address:
-        "0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02"
+        "eth:0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02"
      values.owner:
-        "0x610094aB29D1bf683719d2Ce3495d8635A47bfc6"
+        "eth:0x610094aB29D1bf683719d2Ce3495d8635A47bfc6"
      values.tokenImage:
-        "0xA1077a294dDE1B09bB078844df40758a5D0f9a27"
+        "eth:0xA1077a294dDE1B09bB078844df40758a5D0f9a27"
      implementationNames.0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02:
-        "TokenFactory"
      implementationNames.eth:0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02:
+        "TokenFactory"
    }
```

```diff
    contract PermittableToken (0xA1077a294dDE1B09bB078844df40758a5D0f9a27) {
    +++ description: None
      address:
-        "0xA1077a294dDE1B09bB078844df40758a5D0f9a27"
+        "eth:0xA1077a294dDE1B09bB078844df40758a5D0f9a27"
      values.bridgeContract:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x30e22ab6e6B576e6A9c5dD73191237a9A5c72539"
+        "eth:0x30e22ab6e6B576e6A9c5dD73191237a9A5c72539"
      implementationNames.0xA1077a294dDE1B09bB078844df40758a5D0f9a27:
-        "PermittableToken"
      implementationNames.eth:0xA1077a294dDE1B09bB078844df40758a5D0f9a27:
+        "PermittableToken"
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      address:
-        "0xd0764FAe29E0a6a96fF685f71CfC685456D5636c"
+        "eth:0xd0764FAe29E0a6a96fF685f71CfC685456D5636c"
      values.$admin:
-        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
+        "eth:0xDf5d165A7EB95D26355c56d53799B7da1240e585"
      values.$implementation:
-        "0xe98699957d3504aCD57ffF861E4b77b57eB02467"
+        "eth:0xe98699957d3504aCD57ffF861E4b77b57eB02467"
      values.$pastUpgrades.0.2.0:
-        "0xe98699957d3504aCD57ffF861E4b77b57eB02467"
+        "eth:0xe98699957d3504aCD57ffF861E4b77b57eB02467"
      values.implementation:
-        "0xe98699957d3504aCD57ffF861E4b77b57eB02467"
+        "eth:0xe98699957d3504aCD57ffF861E4b77b57eB02467"
      values.messageSender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x0Fb17ADb94627EeA37BB7EF12f85aB4590e3805F"
+        "eth:0x0Fb17ADb94627EeA37BB7EF12f85aB4590e3805F"
      values.upgradeabilityOwner:
-        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
+        "eth:0xDf5d165A7EB95D26355c56d53799B7da1240e585"
      values.validatorContract:
-        "0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d"
+        "eth:0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d"
      implementationNames.0xd0764FAe29E0a6a96fF685f71CfC685456D5636c:
-        "EternalStorageProxy"
      implementationNames.0xe98699957d3504aCD57ffF861E4b77b57eB02467:
-        "ForeignAMB"
      implementationNames.eth:0xd0764FAe29E0a6a96fF685f71CfC685456D5636c:
+        "EternalStorageProxy"
      implementationNames.eth:0xe98699957d3504aCD57ffF861E4b77b57eB02467:
+        "ForeignAMB"
    }
```

```diff
    EOA  (0xd4Aa3dFe78D2B77C5A5618B9E85D1141f2b48fbD) {
    +++ description: None
      address:
-        "0xd4Aa3dFe78D2B77C5A5618B9E85D1141f2b48fbD"
+        "eth:0xd4Aa3dFe78D2B77C5A5618B9E85D1141f2b48fbD"
    }
```

```diff
    EOA  (0xDf5d165A7EB95D26355c56d53799B7da1240e585) {
    +++ description: None
      address:
-        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
+        "eth:0xDf5d165A7EB95D26355c56d53799B7da1240e585"
    }
```

```diff
    EOA  (0xe158313e347ED8d52e9FBfF7aE5000aEAbDDbeDa) {
    +++ description: None
      address:
-        "0xe158313e347ED8d52e9FBfF7aE5000aEAbDDbeDa"
+        "eth:0xe158313e347ED8d52e9FBfF7aE5000aEAbDDbeDa"
    }
```

```diff
    EOA  (0xe3B95d0143956A8E643FA29a0795FC4162A41F69) {
    +++ description: None
      address:
-        "0xe3B95d0143956A8E643FA29a0795FC4162A41F69"
+        "eth:0xe3B95d0143956A8E643FA29a0795FC4162A41F69"
    }
```

```diff
    EOA  (0xf6ab64f43F3f9eB88c9D99D119F26Ece13843FC0) {
    +++ description: None
      address:
-        "0xf6ab64f43F3f9eB88c9D99D119F26Ece13843FC0"
+        "eth:0xf6ab64f43F3f9eB88c9D99D119F26Ece13843FC0"
    }
```

```diff
    EOA  (0xfB18Da3bCA8057eB05aab6e77a32925949093533) {
    +++ description: None
      address:
-        "0xfB18Da3bCA8057eB05aab6e77a32925949093533"
+        "eth:0xfB18Da3bCA8057eB05aab6e77a32925949093533"
    }
```

```diff
    EOA  (0xFE9a08BB3ce6C1946c40b8767feF2F97B400dd2C) {
    +++ description: None
      address:
-        "0xFE9a08BB3ce6C1946c40b8767feF2F97B400dd2C"
+        "eth:0xFE9a08BB3ce6C1946c40b8767feF2F97B400dd2C"
    }
```

```diff
+   Status: CREATED
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d)
    +++ description: Custom multisignature contract for Validator addresses.
```

```diff
+   Status: CREATED
    contract WETHOmnibridgeRouter (0x8AC4ae65b3656e26dC4e0e69108B392283350f55)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenFactory (0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermittableToken (0xA1077a294dDE1B09bB078844df40758a5D0f9a27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c)
    +++ description: None
```

Generated with discovered.json: 0x9c7bb8d744322ef006dc6239a2d751abce2b3bfe

# Diff at Fri, 04 Jul 2025 12:19:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22431228
- current block number: 22431228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22431228 (main branch discovery), not current.

```diff
    EOA  (0x13A9594a2696D3c35F9D6E4Be6b332f699C57801) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1715a3E4A142d8b698131108995174F37aEBA10D"
+        "eth:0x1715a3E4A142d8b698131108995174F37aEBA10D"
    }
```

```diff
    EOA  (0x3eA02EF8A3956f69D23B5B30327E0F5e352E513f) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d"
+        "eth:0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d"
    }
```

```diff
    EOA  (0xDf5d165A7EB95D26355c56d53799B7da1240e585) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d"
+        "eth:0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d"
      receivedPermissions.1.from:
-        "ethereum:0xd0764FAe29E0a6a96fF685f71CfC685456D5636c"
+        "eth:0xd0764FAe29E0a6a96fF685f71CfC685456D5636c"
    }
```

Generated with discovered.json: 0x963bcc130668df953151b88f1f9320b691866610

# Diff at Fri, 23 May 2025 09:41:02 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22431228
- current block number: 22431228

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22431228 (main branch discovery), not current.

```diff
    EOA  (0x13A9594a2696D3c35F9D6E4Be6b332f699C57801) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0x3eA02EF8A3956f69D23B5B30327E0F5e352E513f) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xDf5d165A7EB95D26355c56d53799B7da1240e585) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x71190e20f56abf162eedc997048474553205c043

# Diff at Wed, 07 May 2025 10:36:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0ad97a28a4acd494070977b13284d597fbcc6048 block: 17968825
- current block number: 22431228

## Description

Config: Using template for BridgeValidators.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: Custom multisignature contract for Validator addresses.
      values.requiredSignatures:
-        5
      values.validatorList:
-        ["0xf6ab64f43F3f9eB88c9D99D119F26Ece13843FC0","0x1daD947dD181fAa6c751ec14e2683e0A8fE2bf8c","0xd4Aa3dFe78D2B77C5A5618B9E85D1141f2b48fbD","0xfB18Da3bCA8057eB05aab6e77a32925949093533","0xe158313e347ED8d52e9FBfF7aE5000aEAbDDbeDa","0x5ECfE77502317F3677f23C3b8Ab17929ACE3D74E","0xFE9a08BB3ce6C1946c40b8767feF2F97B400dd2C","0xe3B95d0143956A8E643FA29a0795FC4162A41F69"]
+++ description: Array of the signers in the validator multisig
      values.$members:
+        ["0xfB18Da3bCA8057eB05aab6e77a32925949093533","0xe3B95d0143956A8E643FA29a0795FC4162A41F69","0xd4Aa3dFe78D2B77C5A5618B9E85D1141f2b48fbD","0xe158313e347ED8d52e9FBfF7aE5000aEAbDDbeDa","0xf6ab64f43F3f9eB88c9D99D119F26Ece13843FC0","0x5ECfE77502317F3677f23C3b8Ab17929ACE3D74E","0x1daD947dD181fAa6c751ec14e2683e0A8fE2bf8c","0xFE9a08BB3ce6C1946c40b8767feF2F97B400dd2C"]
      values.$threshold:
+        5
      template:
+        "gnosisbridge/BridgeValidators"
      description:
+        "Custom multisignature contract for Validator addresses."
      fieldMeta:
+        {"$members":{"description":"Array of the signers in the validator multisig"}}
    }
```

```diff
    EOA  (0x3eA02EF8A3956f69D23B5B30327E0F5e352E513f) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d","description":"change the threshold and manage signers."}]
    }
```

Generated with discovered.json: 0x4544bdca3cb385027bdf882fe00a9617eedc7418

# Diff at Tue, 06 May 2025 10:56:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 17968825
- current block number: 17968825

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    EOA  (0xDf5d165A7EB95D26355c56d53799B7da1240e585) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x04d61cc532635df5a295bcd100a6826315304df1

# Diff at Tue, 29 Apr 2025 08:19:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 17968825
- current block number: 17968825

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13A9594a2696D3c35F9D6E4Be6b332f699C57801","via":[]}]
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xDf5d165A7EB95D26355c56d53799B7da1240e585","via":[]}]
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xDf5d165A7EB95D26355c56d53799B7da1240e585","via":[]}]
    }
```

Generated with discovered.json: 0xe039dd867d6dcb0b82f8400d41f3a1c43c282b08

# Diff at Tue, 04 Mar 2025 10:39:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 17968825
- current block number: 17968825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      sinceBlock:
+        17264177
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      sinceBlock:
+        17264119
    }
```

```diff
    contract WETHOmnibridgeRouter (0x8AC4ae65b3656e26dC4e0e69108B392283350f55) {
    +++ description: None
      sinceBlock:
+        17264181
    }
```

```diff
    contract TokenFactory (0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02) {
    +++ description: None
      sinceBlock:
+        17264180
    }
```

```diff
    contract PermittableToken (0xA1077a294dDE1B09bB078844df40758a5D0f9a27) {
    +++ description: None
      sinceBlock:
+        17264179
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      sinceBlock:
+        17264125
    }
```

Generated with discovered.json: 0xde4fc0e1dfafc4585656de553fe80eb2b90d5044

# Diff at Mon, 20 Jan 2025 11:09:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 17968825
- current block number: 17968825

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x13A9594a2696D3c35F9D6E4Be6b332f699C57801"
      issuedPermissions.0.to:
+        "0x13A9594a2696D3c35F9D6E4Be6b332f699C57801"
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
      issuedPermissions.0.to:
+        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
      issuedPermissions.0.to:
+        "0xDf5d165A7EB95D26355c56d53799B7da1240e585"
    }
```

Generated with discovered.json: 0xf195418290605b2f8608811074bc6b0b502fd6b2

# Diff at Mon, 21 Oct 2024 11:09:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 17968825
- current block number: 17968825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xB7DF1E00ae030e966E635ede273625240546B873"]
      values.$pastUpgrades.0.1:
-        ["0xB7DF1E00ae030e966E635ede273625240546B873"]
+        "0x210fa683ddb0e587885dea0582bc328b80b7a87d700a10cc7a81f6fa1cf9612b"
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"]
      values.$pastUpgrades.0.1:
-        ["0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"]
+        "0x91a1946de8485c208882fb51238a8771821502849535a638f25651804f3ef0d4"
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xe98699957d3504aCD57ffF861E4b77b57eB02467"]
      values.$pastUpgrades.0.1:
-        ["0xe98699957d3504aCD57ffF861E4b77b57eB02467"]
+        "0x5d1c2bd55b6e6af2311067e52dd8a45a69550547c71593ad890f1d8e63caaf04"
    }
```

Generated with discovered.json: 0xbc4c45ad8463cf6f70308707832accb0aaacde19

# Diff at Mon, 14 Oct 2024 10:54:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 17968825
- current block number: 17968825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      sourceHashes:
+        ["0x10e99708bf71d6d77c20b34a6e991e6ca7487e63931b612a5224d32ca72b63b5","0x9720f814127b9abe2e0b23ce0cf1e96d96219277e21d382e52407db172c73c76"]
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      sourceHashes:
+        ["0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705","0x5568dae309b68b3870831f43f7a6eb3459ab46bee27f0f282f5b9a0b2f2ed720"]
    }
```

```diff
    contract WETHOmnibridgeRouter (0x8AC4ae65b3656e26dC4e0e69108B392283350f55) {
    +++ description: None
      sourceHashes:
+        ["0x55a672aa33e48959212349f94f7522a8a142bc17931854f79636d4564226b7b3"]
    }
```

```diff
    contract TokenFactory (0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02) {
    +++ description: None
      sourceHashes:
+        ["0xc3fc18a2178145d16d7d8d6b50d97b6d7a405421b3fae66cdeb31fb52f4e7eed"]
    }
```

```diff
    contract PermittableToken (0xA1077a294dDE1B09bB078844df40758a5D0f9a27) {
    +++ description: None
      sourceHashes:
+        ["0x064c46a3015079f17e93b171ff684cda28a0ecdbd55ecec09c4ddf50e0a5c312"]
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      sourceHashes:
+        ["0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705","0x580afb6cca5222e2dcaa0dcab547ed491b14414cabd97992abf96566d6af0fa0"]
    }
```

Generated with discovered.json: 0xdafcff2418ce79240e6f5112b9e474a45b6f8530

# Diff at Tue, 01 Oct 2024 10:54:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 17968825
- current block number: 17968825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-05-15T09:06:11.000Z",["0xB7DF1E00ae030e966E635ede273625240546B873"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-05-15T08:53:47.000Z",["0x95B303987A60C71504D99Aa1b13B4DA07b0790ab"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-05-15T08:54:59.000Z",["0xe98699957d3504aCD57ffF861E4b77b57eB02467"]]]
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x0027368754e67eb6f3a8865e8d0107ea1cb073f1

# Diff at Wed, 21 Aug 2024 10:05:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 17968825
- current block number: 17968825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17968825 (main branch discovery), not current.

```diff
    contract ForeignOmnibridge (0x1715a3E4A142d8b698131108995174F37aEBA10D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x13A9594a2696D3c35F9D6E4Be6b332f699C57801","via":[]}]
    }
```

```diff
    contract BridgeValidators (0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xDf5d165A7EB95D26355c56d53799B7da1240e585","via":[]}]
    }
```

```diff
    contract ForeignAMB (0xd0764FAe29E0a6a96fF685f71CfC685456D5636c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xDf5d165A7EB95D26355c56d53799B7da1240e585","via":[]}]
    }
```

Generated with discovered.json: 0x11fbf7a8ab731d6cd4f4de7209749df77ac4e6d2

