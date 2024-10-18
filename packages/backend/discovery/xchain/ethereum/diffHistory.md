Generated with discovered.json: 0xf190cdf0690aff41c935a082d8c444f6fa8ffffa

# Diff at Wed, 16 Oct 2024 11:43:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20977673
- current block number: 20977673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977673 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x22010F5C4c106dfBaffec780196d2F691860Ff62","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x22010F5C4c106dfBaffec780196d2F691860Ff62"
+        "0x74978411BbBCbC466e79fb855DAe981997100deB"
    }
```

```diff
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x115B6563C9237B1Ff6f9E2B2a825B210ECDE021e","via":[]}
    }
```

Generated with discovered.json: 0x98c08a0bc05af5509c46803eaccbb3ef230cae4b

# Diff at Wed, 16 Oct 2024 10:58:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20977673

## Description

Standard Orbit stack Optimium by Conduit (AnyTrust 1/1).

## Initial discovery

```diff
+   Status: CREATED
    contract Outbox (0x0b8071337dcB089478Ea740efC10904d9F359141)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x20195677a6De5f0f7dF4e21cE48F0D24e5477110)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x22010F5C4c106dfBaffec780196d2F691860Ff62)
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
    contract Bridge (0x2Be65c5b58F78B02AB5c0e798A9ffC181703D3C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x47861E0419BE83d0175818a09221B6DF2EFD7793)
    +++ description: State batches / commitments get posted here.
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
    contract RollupEventInbox (0x6c8faa6b06d4bDD5Af628ac28954736a0fC0BD6b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
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
    contract ChallengeManager (0xC0880Eea7Ad1B28a39344D48B411bC96f3daf60D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xE961Ef06c26D0f032F0298c97C41e648d3bb715a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xeb61c3FA03544021cf76412eFb9D0Ce7D8c0290d)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```
