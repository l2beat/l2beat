Generated with discovered.json: 0xf9c20f9cb11432b4350e8509740de3aa5ecd5bf6

# Diff at Fri, 30 Aug 2024 07:54:34 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20632523
- current block number: 20632523

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20632523 (main branch discovery), not current.

```diff
    contract PolygonMultisig (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x87bd68e8b7de7276e23bb72fe0e2044d41e2bc45

# Diff at Wed, 28 Aug 2024 19:13:34 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@ec0c665426c9791ef4860f527c8da5a8193eb4c2 block: 20225285
- current block number: 20613284

## Description

- TimeLock removed
- WithdrawManager implementation changed. New implementation is the same but broken into multiple files
- ERC20PredicateBurnOnly and ERC721PredicateBurnOnly implementation changed. New implementation is the same but broken into multiple files

## Watched changes

```diff
-   Status: DELETED
    contract ERC20PredicateBurnOnly (0x158d5fa3Ef8e4dDA8a5367deCF76b94E7efFCe95)
    +++ description: None
```

```diff
    contract WithdrawManager (0x2A88696e0fFA76bAA1338F2C74497cC013495922) {
    +++ description: None
      values.$implementation:
-        "0x4ef5123a30e4CFeC02B3E2F5Ce97F1328B29f7de"
+        "0xA376680d32Cece9756D9f1087318400DA2fd83dF"
      values.implementation:
-        "0x4ef5123a30e4CFeC02B3E2F5Ce97F1328B29f7de"
+        "0xA376680d32Cece9756D9f1087318400DA2fd83dF"
      values.owner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract Registry (0x33a02E6cC863D393d6Bf231B697b82F6e499cA71) {
    +++ description: None
      values.erc20Predicate:
-        "0x158d5fa3Ef8e4dDA8a5367deCF76b94E7efFCe95"
+        "0x626fb210bf50e201ED62cA2705c16DE2a53DC966"
      values.erc721Predicate:
-        "0x54150f44c785D412Ec262fe895Cc3B689c72F49B"
+        "0x36C2503d53C6948331144b85D1e74a3B96731d1b"
    }
```

```diff
    contract DepositManager (0x401F6c983eA34274ec46f84D70b31C151321188b) {
    +++ description: None
      values.owner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
-   Status: DELETED
    contract ERC721PredicateBurnOnly (0x54150f44c785D412Ec262fe895Cc3B689c72F49B)
    +++ description: None
```

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.owner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract EventsHub (0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.$admin:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
      values.owner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract Governance (0x6e7a5820baD6cebA8Ef5ea69c0C92EbbDAc9CE48) {
    +++ description: None
      values.owner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
    contract RootChain (0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287) {
    +++ description: None
      values.owner:
-        "0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

```diff
-   Status: DELETED
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf)
    +++ description: None
```

```diff
    contract PolygonMultisig (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","via":[]},{"permission":"upgrade","target":"0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b","via":[]}]
    }
```

```diff
+   Status: CREATED
    contract ERC721PredicateBurnOnly (0x36C2503d53C6948331144b85D1e74a3B96731d1b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20PredicateBurnOnly (0x626fb210bf50e201ED62cA2705c16DE2a53DC966)
    +++ description: None
```

## Source code changes

```diff
.../ERC20PredicateBurnOnly.sol                     | 248 ++++----
 .../ERC721PredicateBurnOnly.sol                    | 248 ++++----
 .../.flat@20225285/Timelock.sol => /dev/null       | 675 ---------------------
 .../WithdrawManager/WithdrawManager.sol            | 250 ++++----
 4 files changed, 440 insertions(+), 981 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20225285 (main branch discovery), not current.

```diff
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf) {
    +++ description: None
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_ADMIN_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf"]},"PROPOSER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"]},"EXECUTOR_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"]}}
    }
```

```diff
-   Status: DELETED
    contract ChildChain (0xD9c7C4ED4B66858301D0cb28Cc88bf655Fe34861)
    +++ description: None
```

Generated with discovered.json: 0xe81ad4d54530e669f2658e5e9f14d93720cdc4d6

# Diff at Wed, 21 Aug 2024 10:05:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20225285
- current block number: 20225285

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20225285 (main branch discovery), not current.

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract EventsHub (0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf","via":[]}]
    }
```

```diff
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","via":[]},{"permission":"upgrade","target":"0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b","via":[]}]
    }
```

Generated with discovered.json: 0x199409bcd8981fe3897a373cb7225bfa1cbf939d

# Diff at Fri, 09 Aug 2024 10:11:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20225285
- current block number: 20225285

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20225285 (main branch discovery), not current.

```diff
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b"]
      assignedPermissions.upgrade:
+        ["0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908","0x6dF5CB08d3f0193C768C8A01f42ac4424DC5086b"]
    }
```

```diff
    contract PolygonMultisig (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c) {
    +++ description: None
      values.$multisigThreshold:
-        "5 of 9 (56%)"
      values.getOwners:
-        ["0xA7499Aa6464c078EeB940da2fc95C6aCd010c3Cc","0x1aE033D45ce93bbB0dDBF71a0Da9de01FeFD8529","0x0D2600C228D9Bcc9757B64bBb232F86A912B7b03","0xD0FD9303fe99EdFAF5eD4A2c1657a347d8053C9a","0x39415255619783A2E71fcF7d8f708A951d92e1b6","0xb771380f912E4b5F6beDdf81314C383c13F16ab5","0x803B74766D8f79195D4DaeCF6f2aac31Dba78F25","0x80D63799b1e08a80f73FB7a83264b5c31600bF3a","0x8Eab5aEfe2755E1bAD2052944Ea096AEbdA1d602"]
      values.getThreshold:
-        5
      values.$members:
+        ["0xA7499Aa6464c078EeB940da2fc95C6aCd010c3Cc","0x1aE033D45ce93bbB0dDBF71a0Da9de01FeFD8529","0x0D2600C228D9Bcc9757B64bBb232F86A912B7b03","0xD0FD9303fe99EdFAF5eD4A2c1657a347d8053C9a","0x39415255619783A2E71fcF7d8f708A951d92e1b6","0xb771380f912E4b5F6beDdf81314C383c13F16ab5","0x803B74766D8f79195D4DaeCF6f2aac31Dba78F25","0x80D63799b1e08a80f73FB7a83264b5c31600bF3a","0x8Eab5aEfe2755E1bAD2052944Ea096AEbdA1d602"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 9 (56%)"
    }
```

Generated with discovered.json: 0xed3aa3c565c91510f50d9325c0b9a9ee0859554d

# Diff at Wed, 03 Jul 2024 10:08:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@630eced58a4371f4873c6b323d9fb5123fad28ef block: 20175250
- current block number: 20225285

## Description

The StakingInfo owner is changed from an EOA to the Polygon Multisig.

## Watched changes

```diff
    contract StakingInfo (0xa59C847Bd5aC0172Ff4FE912C5d29E5A71A7512B) {
    +++ description: None
      values.owner:
-        "0xA2D9846c352cA61dCb20D6AaD40Cec1d1b228a78"
+        "0xFa7D2a996aC6350f4b56C043112Da0366a59b74c"
    }
```

Generated with discovered.json: 0xfa4e15c7558a27920cf19b49d048b4c4be1aa237

# Diff at Wed, 26 Jun 2024 10:26:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb9200e010745e10244c0b3851b3acf21fe41f31 block: 20074008
- current block number: 20175250

## Description

The implementation of the GnosisSafe is upgraded to version 1.3.0.

## Watched changes

```diff
    contract PolygonMultisig (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c) {
    +++ description: None
      upgradeability.masterCopy:
-        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
+        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      implementations.0:
-        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
+        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.domainSeparator:
-        "0x3bc292918071cc597c13d3994268d3c83097b8388d750481c8cbce67a284ed5c"
+        "0x1fedebc30994a7dba640edeed88b9bdc774c9f02b3797c8a6d3a2f17399477f4"
      values.getModules:
-        []
      values.NAME:
-        "Gnosis Safe"
      values.VERSION:
-        "1.1.1"
+        "1.3.0"
      values.getChainId:
+        1
    }
```

## Source code changes

```diff
.../PolygonMultisig/GnosisSafe.sol                 | 932 ++++++++++-----------
 1 file changed, 463 insertions(+), 469 deletions(-)
```

Generated with discovered.json: 0xf7806ebb4570b80f3d514eaa745f9513c916922d

# Diff at Thu, 28 Mar 2024 10:42:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19062081
- current block number: 19532081

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19062081 (main branch discovery), not current.

```diff
    contract PolygonMultisig (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 9 (56%)"
    }
```

Generated with discovered.json: 0xc98f0f6737b75737ee15b9427cbc769043d95fa8

# Diff at Mon, 22 Jan 2024 11:48:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@7755f153438c1f16773ba6733cfa3a8c8bc0a394 block: 18769796
- current block number: 19062081

## Description

Last checkpoint that had the old hash: 0x9b2c468c4ec0c6758e6918697490eb41ce9c90eaed3d243c93b27359d36672ae
Transaction that changed the stateRoot: 0x57e1fc189829809677179955a38eab74311309c872c995834e93fd153efa31ba

Changed the Merkle Root that allows for withdrawing the Heimdall fee.
This root is not used in any other place, it's just for claiming the Heimdall fee.
Nobody in the history of this contract nobody ever claimed any Heimdall fee.
See `function claimFee(uint256 accumFeeAmount, uint256 index, bytes memory proof)` for how the claiming works.

## Watched changes

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
      values.accountStateRoot:
-        "0x85d7a8f1697e2a84910d571af5875abfdb954c6050766f6866a6bb9fc7c660ca"
+        "0x008cac7abbedf34deff1dedf34b09ccab63cc457993151a7f50e54c12174ad25"
    }
```

```diff
    contract StakingInfo (0xa59C847Bd5aC0172Ff4FE912C5d29E5A71A7512B) {
      values.getAccountStateRoot:
-        "0x85d7a8f1697e2a84910d571af5875abfdb954c6050766f6866a6bb9fc7c660ca"
+        "0x008cac7abbedf34deff1dedf34b09ccab63cc457993151a7f50e54c12174ad25"
    }
```

# Diff at Tue, 12 Dec 2023 11:26:42 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@2ec8dba108b989e6a3eeb24eb8893e578f713ddf

## Description

New validator has staked and is added to the validator set (now 105).

## Watched changes

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
      values.currentValidatorSetSize:
-        104
+        105
    }
```

# Diff at Tue, 12 Dec 2023 07:22:28 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@fdc867519c9c4b27d1a45a5037b5ab0509a4a2f8

## Description

One validator has unstaked from StakeManager and is removed from the validator set (now 104).

## Watched changes

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
      values.currentValidatorSetSize:
-        105
+        104
    }
```

# Diff at Tue, 17 Oct 2023 07:23:03 GMT:

- author: Amin Latifi (<a.latifi.al@gmail.com>)
- comparing to: main@728cab1f84974b0904f30f151656c2139f01af97

## Description

A new validator is added to the StakeManager validators set.

## Watched changes

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
      values.currentValidatorSetSize:
-        104
+        105
      values.validatorThreshold:
-        104
+        105
    }
```

# Diff at Mon, 02 Oct 2023 13:53:03 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
      values.currentValidatorSetSize:
-        103
+        104
      values.validatorThreshold:
-        103
+        104
    }
```
