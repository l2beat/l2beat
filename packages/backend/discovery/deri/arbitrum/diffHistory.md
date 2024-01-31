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
