Generated with discovered.json: 0xb0297799aaad5b4e119c315a84ae50643a15cb65

# Diff at Fri, 09 Aug 2024 11:59:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20177349
- current block number: 20177349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177349 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F) {
    +++ description: None
      assignedPermissions.upgrade.6:
-        "0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"
+        "0xaF5800ADF22301968613c37DA9C3C2a486eA915A"
      assignedPermissions.upgrade.5:
-        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
+        "0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"
      assignedPermissions.upgrade.4:
-        "0xaF5800ADF22301968613c37DA9C3C2a486eA915A"
+        "0xD6c596b7ca17870DD50D322393deCE6C2085a116"
      assignedPermissions.upgrade.3:
-        "0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"
+        "0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881"
      assignedPermissions.upgrade.2:
-        "0xD6c596b7ca17870DD50D322393deCE6C2085a116"
+        "0x73C6af7029E714DFf1F1554F88b79B335011Da68"
      assignedPermissions.upgrade.0:
-        "0x73C6af7029E714DFf1F1554F88b79B335011Da68"
+        "0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd"
    }
```

Generated with discovered.json: 0xcd774a3cda56f993e964a044bac1adca6e983a6a

# Diff at Fri, 09 Aug 2024 10:09:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20177349
- current block number: 20177349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177349 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd","0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048","0x73C6af7029E714DFf1F1554F88b79B335011Da68","0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","0xD6c596b7ca17870DD50D322393deCE6C2085a116","0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e","0xaF5800ADF22301968613c37DA9C3C2a486eA915A"]
      assignedPermissions.upgrade:
+        ["0x73C6af7029E714DFf1F1554F88b79B335011Da68","0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048","0xD6c596b7ca17870DD50D322393deCE6C2085a116","0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd","0xaF5800ADF22301968613c37DA9C3C2a486eA915A","0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881","0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e"]
    }
```

```diff
    contract HychainMultisig (0x798Fa726f0B4DF564681446D051b344E3FE4a6ca) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x42875471D43d54B538B333F041E75a9a45Bf3Aa0","0x356000Cec4fC967f8FC372381D983426760A0391","0x9A80c6437ad9b6E7a1608814cBab93dEeecf388a","0xF77010B8a68512c67bBca86ef39BeA6B3c064423","0xe8417C755391Ea9c0D4Bf50f764275574125B32f"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x42875471D43d54B538B333F041E75a9a45Bf3Aa0","0x356000Cec4fC967f8FC372381D983426760A0391","0x9A80c6437ad9b6E7a1608814cBab93dEeecf388a","0xF77010B8a68512c67bBca86ef39BeA6B3c064423","0xe8417C755391Ea9c0D4Bf50f764275574125B32f"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"]
      assignedPermissions.upgrade:
+        ["0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B"]
    }
```

Generated with discovered.json: 0x9f1c99d8297e3df592325c90270985a3a8be22e9

# Diff at Tue, 30 Jul 2024 11:11:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20177349
- current block number: 20177349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177349 (main branch discovery), not current.

```diff
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0x9a88870fbfc85475568a386fb1fd26a961e6bd6a

# Diff at Wed, 19 Jun 2024 08:44:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 19968589
- current block number: 20124667

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19968589 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0x365ff8f6ff141602e7c18f1af69df509bf520b3b

# Diff at Tue, 28 May 2024 13:13:22 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19968589

## Description

Initial discovery: Orbit stack L2 with Admin EOA, 1/1 AnyTrust DA

## Initial discovery

```diff
+   Status: CREATED
    contract Outbox (0x0389E24A4Bc96518169f83F50FCDdA442dD8eAFd)
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
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4C5984E3841790335E6DC2e7ed92802FbF8a300F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x617f70525Dc4D2BBbd6ADFd3781DbEAe5C8F0048)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x73C6af7029E714DFf1F1554F88b79B335011Da68)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HychainMultisig (0x798Fa726f0B4DF564681446D051b344E3FE4a6ca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x88d3f3F43Ecd46635bd9f546bE7C4d52eBc20881)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
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
    contract SequencerInbox (0xaF5800ADF22301968613c37DA9C3C2a486eA915A)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract Inbox (0xD6c596b7ca17870DD50D322393deCE6C2085a116)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xE8AcC0E28a82a26D498f2C66B64C56B9Ef996c2e)
    +++ description: None
```
