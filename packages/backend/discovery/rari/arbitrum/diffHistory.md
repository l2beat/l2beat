Generated with discovered.json: 0xf4c7de4e63faa0e95375faaf8fabc87536305ac6

# Diff at Fri, 09 Aug 2024 12:03:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
+        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
      assignedPermissions.upgrade.6:
-        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
+        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
      assignedPermissions.upgrade.5:
-        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
+        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
      assignedPermissions.upgrade.4:
-        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
+        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
      assignedPermissions.upgrade.3:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
      assignedPermissions.upgrade.2:
-        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
+        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
      assignedPermissions.upgrade.1:
-        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
+        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
      assignedPermissions.upgrade.0:
-        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

Generated with discovered.json: 0x4a8453a62c7fc12e782d443529e018fd6be64469

# Diff at Fri, 09 Aug 2024 10:13:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x139C5A235632EDdad741ff380112B3161d31a21C","0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","0x2623C144B4d167f70893f6A8968B98c89a6C5F97","0x37e60F80d921dc5E7f501a7130F31f6548dBa564","0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","0x8bE956aB42274056ef4471BEb211b33e258b7324","0x91591BB66075BCfF94AA128B003134165C3Ab83a","0xA436f1867adD490BF1530c636f2FB090758bB6B3","0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"]
      assignedPermissions.upgrade:
+        ["0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","0x8bE956aB42274056ef4471BEb211b33e258b7324","0x37e60F80d921dc5E7f501a7130F31f6548dBa564","0x139C5A235632EDdad741ff380112B3161d31a21C","0x2623C144B4d167f70893f6A8968B98c89a6C5F97","0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","0xA436f1867adD490BF1530c636f2FB090758bB6B3","0x91591BB66075BCfF94AA128B003134165C3Ab83a","0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"]
    }
```

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"]
      assignedPermissions.upgrade:
+        ["0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"]
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e","0x356000Cec4fC967f8FC372381D983426760A0391","0xB2a5970fB30dc34AD65c914db855766ea62f1f41"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e","0x356000Cec4fC967f8FC372381D983426760A0391","0xB2a5970fB30dc34AD65c914db855766ea62f1f41"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x20f3c50552659ed011da4be3c62d336825b82a6c

# Diff at Tue, 30 Jul 2024 11:17:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x5465f341f7b7aa6a63ebf9ecba0d04be5c822285

# Diff at Tue, 11 Jun 2024 12:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 216538110
- current block number: 220728802

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 216538110 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.maxTimeVariation:
-        [5760,48,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xf4333c87d49f3dd17aadb8228ce984c5c5117ffd

# Diff at Thu, 30 May 2024 08:40:04 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8465affce30f3ceba1fcd6e8fe7a47fd51c7c62f block: 213233578
- current block number: 216538110

## Description

The Admin EOA is removed, Caldera MS is the only upgrade executor.

## Watched changes

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xBA739a061291E9aec6422BdAD3E9D48d4f7aA552"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

Generated with discovered.json: 0xf6c4a97980541fc70a3ad7b3ee2b52fa9338e04f

# Diff at Mon, 20 May 2024 15:20:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@97bea89f161f8e4e9ebb3b4ef7fb3fcb3f90924f block: 211899420
- current block number: 213233578

## Description

Discovery of Molten L3 by Caldera showed that `0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF` is likely a Caldera Multisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 211899420 (main branch discovery), not current.

```diff
    contract UpgradeExecutorMemberGnosisSafeL2 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      name:
-        "UpgradeExecutorMemberGnosisSafeL2"
+        "Caldera Multisig"
    }
```

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
