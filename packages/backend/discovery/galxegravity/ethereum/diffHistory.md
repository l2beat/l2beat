Generated with discovered.json: 0x82bc8471f41c6240516a31b5529eef006d79dbc6

# Diff at Fri, 30 Aug 2024 07:52:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20625620
- current block number: 20625620

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20625620 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xa5D23c69894241825dAffB570c3c742C0F52df96) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xBbc3872E30C91ef69336937838c2a283F79f7E68) {
    +++ description: None
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
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

Generated with discovered.json: 0xc7acb2befe9083dfedc5577e5e02e82195d49d0a

# Diff at Wed, 28 Aug 2024 07:33:59 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- current block number: 20625620

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Outbox (0x1153a1e4B1523DFf36f77d696bd6eBF2B0e7DAbF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
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
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x68466622Aae5a9Ffd02530247d75Dd107f06B333)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x7983403dDA368AA7d67145a9b81c5c517F364c42)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x7AD2a94BefF3294a31894cFb5ba4206957a53c19)
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
    contract SequencerInbox (0x8D99372612e8cFE7163B1a453831Bc40eAeb3cF3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: None
```

```diff
+   Status: CREATED
    contract G (0x9C7BEBa8F6eF6643aBd725e45a4E8387eF260649)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0xa24eDA32bb36171a6c34CBB4B56f89FF7B8fD49A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xa5D23c69894241825dAffB570c3c742C0F52df96)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xBbc3872E30C91ef69336937838c2a283F79f7E68)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xf993AF239770932A0EDaB88B6A5ba3708Bd58239)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```
