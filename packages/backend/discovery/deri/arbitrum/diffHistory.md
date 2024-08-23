Generated with discovered.json: 0x082a9dc9e95e59430bfdc0aab062be8c0bc2b95d

# Diff at Fri, 23 Aug 2024 09:57:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x9e7e79dbcf4fc4ea17cca06cf332f58122be081e

# Diff at Wed, 21 Aug 2024 10:07:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x846387C3D6001F74170455B1074D01f05eB3067a"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x846387C3D6001F74170455B1074D01f05eB3067a","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","0x383eFE8D410285c5CbE1B4F296022640759aA834","0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","0xB155C77a440DA7c282993a89FeA609598293017A","0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99","0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77","0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","via":[]},{"permission":"upgrade","target":"0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","via":[]},{"permission":"upgrade","target":"0x383eFE8D410285c5CbE1B4F296022640759aA834","via":[]},{"permission":"upgrade","target":"0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","via":[]},{"permission":"upgrade","target":"0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99","via":[]},{"permission":"upgrade","target":"0xB155C77a440DA7c282993a89FeA609598293017A","via":[]},{"permission":"upgrade","target":"0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","via":[]},{"permission":"upgrade","target":"0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77","via":[]},{"permission":"upgrade","target":"0xe507b9EF563DB6CcFDcE270160C50b2005BeED20","via":[]},{"permission":"upgrade","target":"0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","via":[]}]
    }
```

```diff
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

```diff
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91","via":[]}]
    }
```

Generated with discovered.json: 0x2aab07ef6adb3058696ac916f69da4793cd641b9

# Diff at Fri, 09 Aug 2024 12:03:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      assignedPermissions.upgrade.9:
-        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
+        "0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
      assignedPermissions.upgrade.8:
-        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
+        "0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"
      assignedPermissions.upgrade.7:
-        "0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"
+        "0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
      assignedPermissions.upgrade.6:
-        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
+        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
      assignedPermissions.upgrade.5:
-        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
+        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
      assignedPermissions.upgrade.4:
-        "0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad"
+        "0xB155C77a440DA7c282993a89FeA609598293017A"
      assignedPermissions.upgrade.2:
-        "0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0"
+        "0x383eFE8D410285c5CbE1B4F296022640759aA834"
      assignedPermissions.upgrade.1:
-        "0xB155C77a440DA7c282993a89FeA609598293017A"
+        "0x0fF7A97caAb356c5507e5355b6819CB8b93d5591"
      assignedPermissions.upgrade.0:
-        "0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99"
+        "0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9"
    }
```

Generated with discovered.json: 0x448ab3892e6e2b00aa9721e63a903c212de796a4

# Diff at Fri, 09 Aug 2024 10:13:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x846387C3D6001F74170455B1074D01f05eB3067a"]
      assignedPermissions.upgrade:
+        ["0x846387C3D6001F74170455B1074D01f05eB3067a"]
    }
```

```diff
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","0x383eFE8D410285c5CbE1B4F296022640759aA834","0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","0xB155C77a440DA7c282993a89FeA609598293017A","0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99","0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77","0xe507b9EF563DB6CcFDcE270160C50b2005BeED20"]
      assignedPermissions.upgrade:
+        ["0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99","0xB155C77a440DA7c282993a89FeA609598293017A","0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0","0xA597e0212971e65f53f288Ff1fFd26A6C8201f83","0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad","0x0fF7A97caAb356c5507e5355b6819CB8b93d5591","0x383eFE8D410285c5CbE1B4F296022640759aA834","0xe507b9EF563DB6CcFDcE270160C50b2005BeED20","0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9","0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77"]
    }
```

Generated with discovered.json: 0xf721fad0b314e573e4c0338c87ab1580d694b2c9

# Diff at Tue, 30 Jul 2024 11:17:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 225980981
- current block number: 225980981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225980981 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xac28f1bc3422f4ba43579353bad7acf4da24aa51

# Diff at Tue, 11 Jun 2024 12:06:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 215490223
- current block number: 220722589

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 215490223 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    +++ description: None
      values.maxTimeVariation:
-        [5760,48,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xe27c45aa1fa1e8e953b3fd2fd42d53e971cb449f

# Diff at Mon, 27 May 2024 07:16:25 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e3af44de7f5996e5fc7d7b401325abe876105664 block: 214125753
- current block number: 215490223

## Description

Back to the initial required stake of 0,1 ETH.

## Watched changes

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.currentRequiredStake:
-        "300000000000000000"
+        "100000000000000000"
    }
```

Generated with discovered.json: 0x13f3e1cccf1d53a54a60f806647a4ca27d876af9

# Diff at Thu, 23 May 2024 06:41:36 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@45012f9c9629c7256c2c901ee618dd1c18eaaafa block: 211900051
- current block number: 214125753

## Description

The required stake is raised from 0.1 to 0.3 ETH. There is only one whitelisted validator who has 0.1 stake and as not confirmed any node since May-21-2024 09:09:22 AM.

## Watched changes

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.currentRequiredStake:
-        "100000000000000000"

          100000000000000000
+        "300000000000000000"
    }
```

Generated with discovered.json: 0xefe932767cda34d32df48f810919d7198c6c2a82

# Diff at Wed, 31 Jan 2024 08:03:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@367f818d32ce6c1ab18696a1cbeb7a6f368b6d78 block: 175727823
- current block number: 175989340

## Description

Start tracking the keySetUpdates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 175727823 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
      values.keySetUpdates:
+        0
    }
```

Generated with discovered.json: 0xceb17155dd0178eaeb49f0f0c13d6765f1491c4a

# Diff at Tue, 30 Jan 2024 13:08:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@ceb6abb9c987b0d53dd547a79c3ebbf3480a024b block: 173375251
- current block number: 175727823

## Description

Add the SequencerInboxVersion handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 173375251 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
      values.sequencerVersion:
+        "0x00"
    }
```

Generated with discovered.json: 0xfea566360a1afd0474f5cc2e97609a3eb1dbaa61

# Diff at Tue, 23 Jan 2024 13:55:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 168378561
- current block number: 173375251

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 168378561 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
      values.validators:
+        ["0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0"]
    }
```

```diff
    contract SequencerInbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
      values.batchPosters:
+        ["0x02c903F5c76F3f00c1F659702Bd76DF30470bBEE"]
    }
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    }
```

# Diff at Mon, 08 Jan 2024 15:22:41 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3ee3c075ee99707d8392a73b092ed24eeb24866f block: 159392469
- current block number: 168378561

## Description

Executors and stake escrow contracts have been updated. At this point we're not displaying any info yet (ts is empty).

## Watched changes

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xD1C955A1544cF449F4a8463E9fE2AC4Ff0798E05"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
      values.loserStakeEscrow:
-        "0xE6Deca8779AAd0F8C96Dd843F77BF2a55ea2F402"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 159392469 (main branch discovery), not current.

```diff
    contract Inbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
      name:
-        "Inbox"
+        "SequencerInbox"
    }
```

# Diff at Tue, 12 Dec 2023 13:17:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    }
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    }
```
