Generated with discovered.json: 0x072b8b9c07171a111281e41b75a8fedecf099538

# Diff at Tue, 11 Jun 2024 13:36:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b9a39f700e84af1cffa010ce0e20e64b23a4c64 block: 216517911
- current block number: 220744194

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 216517911 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2) {
    +++ description: None
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0x24600adb45f0c6eae937f6012d3edc349679be18

# Diff at Thu, 30 May 2024 07:15:16 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8ee20b59ba673583fee7d27bf530e9908ec4d483 block: 214575697
- current block number: 216517911

## Description

EOA removed from executor, Caldera Multisig is now the only upgrade executor.

## Watched changes

```diff
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x37918579d1Ef6E5e7D8aF19375dF53c60d790ef6"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 214575697 (main branch discovery), not current.

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.nonce:
-        1
    }
```

Generated with discovered.json: 0xaeff0ff09760399fcb811931e82568d3e968fb35

# Diff at Fri, 24 May 2024 14:47:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ecd40c9c4c424d8e9d4fb926e97ec9da24272f20 block: 213847288
- current block number: 214575697

## Description

Ignored the feeOwner Multisig for the MOLTEN token.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 213847288 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0xFF93c3662B447Ec4577B51b08C6689A5518417D9)
    +++ description: None
```

Generated with discovered.json: 0x88f7271bdc94a8918dadae580fdd5b16a6b44397

# Diff at Wed, 22 May 2024 11:01:31 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 213847288

## Description

Initial discovery: Orbit stack L3 on Arbitrum with AnyTrust DA, custom native token, upgradable by admin EOA and Caldera Multisig.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x0f28D76Ec5c62b502625351726b4A3E3F54FF5F0)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x0fFe9ACC296ddd4De5F616Aa482C99fA4b41A3E2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x235000876bd58336C802B3546Fc0250f285fCc79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Molten Token (0x66E535e8D2ebf13F49F3D49e5c50395a97C137b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x7BB97862CA342B5fbe2AE2cF2E954F6327f587b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8Ab2f49A085490c1592325eE32B6e6a4DA35D238)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x92ff91308F5f1036435f23c2F4F136Bb7475425d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x9676D55Ccd46ce72235b16bA645008D1D3350B14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xAeAe9616A02dA527FceA2AC444EC918C7BfB9CdF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xb255de22d39a26D4CbcAFd6Cf660ccaCa047e95B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xE1d32C985825562edAa906fAC39295370Db72195)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xFF93c3662B447Ec4577B51b08C6689A5518417D9)
    +++ description: None
```
