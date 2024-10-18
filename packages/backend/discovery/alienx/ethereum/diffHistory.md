Generated with discovered.json: 0x4b549bcf8a5f614c62b674f27a1457df6be631f1

# Diff at Thu, 17 Oct 2024 07:37:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@af2175400fb2c7ba9b7bb17a24e2dd044854ff56 block: 20978034
- current block number: 20978034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20978034 (main branch discovery), not current.

```diff
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x32AD06477129F4470294Fbaf11C0FC682d92E4A3","via":[]}
    }
```

```diff
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x123C1E324BC742295B4278B41C4E33831C77655C","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x123C1E324BC742295B4278B41C4E33831C77655C"
+        "0xff309E0c74874a3efeAAff630A818fd9c6DE4f25"
    }
```

Generated with discovered.json: 0x3ae97e6a18d9914764bc738786a89e8a01a0a902

# Diff at Wed, 16 Oct 2024 12:11:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20978034

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract RollupEventInbox (0x01c1Be00BA202332a1A9244D2C36f51B8C2aA84b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x123C1E324BC742295B4278B41C4E33831C77655C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x19a6Ffc45dDe55D93c99114ddC3b277025e5fDf3)
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
    contract AlienXMultisig (0x32f6CAE58A89aA7c91D736Bb1100E377C570bb27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x6fa8b24c85409A4fcb541c9964766862aA007f39)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x7b0159484f5cb4F3D4bb496A2eD7A01F409e70D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7Deda2425eC2d4EA0DF689A78de2fBF002075576)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xb7d188eb30e7984f93Bec34Ee8b45A148bd594C6)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract Outbox (0xCA2AA2AA53C2225849Cc711FD472E4D2bFcD634b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xD4972734Ed659c03ca3e476e06Fc6f016397dfD4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xeA685ba6f0C3ec5e7891C17CfFBD009EbAdC9E49)
    +++ description: None
```
