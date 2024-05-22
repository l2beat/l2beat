Generated with discovered.json: 0x7245a07dfe953ecc4b697834241e5f6b302ccc1e

# Diff at Thu, 25 Apr 2024 21:21:55 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2f1b03dc8e8dfe5c4e9bc475f6f9be6019a2af1c block: 198865244
- current block number: 204795680

## Description

A new UpgradeExecutor member was added (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF).
It's a "3 of 4" GnosisSafe.

## Watched changes

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutorMemberGnosisSafeL2 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |  86 +++++
 .../implementation/contracts/base/Executor.sol     |  27 ++
 .../contracts/base/FallbackManager.sol             |  53 +++
 .../implementation/contracts/base/GuardManager.sol |  50 +++
 .../contracts/base/ModuleManager.sol               | 133 +++++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 +++
 .../contracts/external/GnosisSafeMath.sol          |  54 +++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 159 ++++++++
 .../proxy/meta.txt                                 |   2 +
 19 files changed, 1323 insertions(+)
```

Generated with discovered.json: 0x58d524aecf6116a452095502141368395422d8e5

# Diff at Fri, 08 Mar 2024 11:14:21 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- comparing to: main@f09f798ebd2ae57f4c76e08114d608edf0a51c7b block: 176692309
- current block number: 188309907

## Description

The ArbitrumDACKeysetHandler has been changed in a way to make values more readable. No values were changed inside smart contracts, only the handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 176692309 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.dacKeyset.threshold:
-        1
      values.dacKeyset.keyCount:
-        1
      values.dacKeyset.requiredSignatures:
+        1
      values.dacKeyset.membersCount:
+        1
    }
```

Generated with discovered.json: 0xa08f831bc81ba1e8dad6f27521784d8cb90e1c41

# Diff at Fri, 02 Feb 2024 11:06:01 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d4d9bc19cc4a1e4baaadb947f4ad7e44e6c21ac9 block: 175360077
- current block number: 176692309

## Description

Discover the `dacKeyset`.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 175360077 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
      unverified:
-        true
      derivedName:
-        ""
+        "RollupProxy"
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
      values.dacKeyset:
+        {"threshold":1,"keyCount":1}
      values.sequencerVersion:
+        "0x88"
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    }
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    }
```

Generated with discovered.json: 0x051400056af9aa68473df479ec67cf59fdd332a9

# Diff at Mon, 29 Jan 2024 10:52:51 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 175360077

## Description

Add RARI chain config.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    }
```

```diff
+   Status: CREATED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706) {
    }
```
