Generated with discovered.json: 0x3c4821d41420fdbdd4e995dffb0bed68e0e30f3a

# Diff at Fri, 09 Aug 2024 10:11:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"]
      assignedPermissions.upgrade:
+        ["0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"]
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x07390626b8Bc2C04b1D93c7D246A0629198D7868","0x383c03c4EfF819E73409DbC690755a9992393814","0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","0x672109752635177ebcb17F2C7e04575A709014BD","0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","0x728B406A4809118533D96bB3b5C50712C99d8Fa5","0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"]
      assignedPermissions.upgrade:
+        ["0x672109752635177ebcb17F2C7e04575A709014BD","0x383c03c4EfF819E73409DbC690755a9992393814","0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","0x07390626b8Bc2C04b1D93c7D246A0629198D7868","0xFd9f59554351122b231F832a0e0A1aBb0604D7fd","0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","0x728B406A4809118533D96bB3b5C50712C99d8Fa5"]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 10 (60%)"
      values.getOwners:
-        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.getThreshold:
-        6
      values.$members:
+        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 10 (60%)"
    }
```

Generated with discovered.json: 0xd206dd3f29a9b75aa36f6be5a5e3aa295ba9c145

# Diff at Tue, 30 Jul 2024 11:14:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xc4f473c42277bdd183e49089b1b3413cc298b04b

# Diff at Wed, 05 Jun 2024 08:43:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@3a08c61f892fdbd930567c41f50f427b83391859 block: 19973435
- current block number: 20024504

## Description

Same Multisig as in new re.al L2, deployed by gelato deployer.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19973435 (main branch discovery), not current.

```diff
    contract ReyaMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "ReyaMultisig"
+        "GelatoMultisig"
    }
```

Generated with discovered.json: 0x365b8f59f73971268b17211f32b838a2f592af96

# Diff at Wed, 29 May 2024 05:29:13 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca8b8ea4d1ba80d5f20f68bede9336b90b01434 block: 19926951
- current block number: 19973435

## Description

The EOA is removed from EXECUTOR_ROLE.members. The rollup can now be upgraded by the 6/10 Reya Multisig only.

## Watched changes

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x91Ef6E02740bDcc9dB248F995c7f394D7617d7a1"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ReyaMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      upgradeability.threshold:
-        "5 of 9 (56%)"
+        "6 of 10 (60%)"
      values.getOwners.9:
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.getOwners.8:
-        "0xebD4919C075417a86F19713dADe101852867A04F"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.getOwners.7:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.getOwners.6:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
      values.getOwners.5:
-        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
+        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
      values.getOwners.4:
-        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
+        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
      values.getOwners.3:
-        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
+        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.getOwners.2:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.getOwners.1:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.getOwners.0:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.getThreshold:
-        5
+        6
      values.nonce:
-        0
+        4
    }
```

Generated with discovered.json: 0x940faef00f64ffdef8e782429009677653fbae56

# Diff at Wed, 22 May 2024 17:36:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eae7b47a410c2b8cc7e6a7d7a0bc841a31c6e83 block: 19883593
- current block number: 19926951

## Description

A new Executor is added (a multisig) but the old EOA admin is still not removed.

## Watched changes

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
+   Status: CREATED
    contract ReyaMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/ReyaMultisig/GnosisSafe.sol     | 952 +++++++++++++++++++++
 .../.flat/ReyaMultisig/GnosisSafeProxy.p.sol       |  34 +
 2 files changed, 986 insertions(+)
```

Generated with discovered.json: 0x5664902f67add10c7d67f86c907fb3ea7ec5ecd3

# Diff at Tue, 14 May 2024 09:35:12 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@c3f1e2e18f153bc7ee23c0dd431182773076cc43 block: 19789584
- current block number: 19867390

## Description

The challenge period (`confirmPeriodBlocks`) is increased from 30m and now matches the self-propose (`VALIDATOR_AFK_BLOCKS`) delay of 6d 8h.

## Watched changes

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: None
      values.confirmPeriodBlocks:
-        150
+        45818
    }
```

Generated with discovered.json: 0x5b3d003cfab482308ba681b8eecea5562a2b9df5

# Diff at Fri, 03 May 2024 12:27:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19789584

## Description

Initial discovery for Reya network (Orbit stack L2). 1.0 code similarity (identical) to popapex L3 when excluding the socket vault and Mulltisig.

## Initial discovery

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SocketVault_Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd)
    +++ description: None
```
