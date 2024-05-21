Generated with discovered.json: 0xaf54a96131f4555110c26941ac4b68c40625933a

# Diff at Tue, 14 May 2024 07:08:06 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0dcad16d442c9306c666eb55cc246f5202105346 block: 12908240
- current block number: 14440563

## Description

This update extends the sequencer-only window for degen chain by 1000x to 1000d. (MaxTimeVariation.delayBlocks, maxTimeVariation.delaySeconds)
Context: Big chain reorg on the L2, no batches posted for the last ~30h.

## Watched changes

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: None
      values.maxTimeVariation.2:
-        86400
+        86400000
      values.maxTimeVariation.0:
-        5760
+        3456000
    }
```

Generated with discovered.json: 0xb10226147642416599acfd9706b5734973b04a80

# Diff at Mon, 08 Apr 2024 19:50:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 12908240

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Inbox (0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x23b0348788b96ee1cE4e7DdED4AC2A99de516F51)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x23D6786f56eb33313a2F3393012e29631f63C914)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x351089AaF039aF15bb601e695A30D515963D29Af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UTBDecent (0x43019F8BE1F192587883b67dEA2994999f5a2de2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x766DD3A13d17C6D175975C89225bde89F052dBc4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupOwnerMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x915322CB7Ef079d9d9B97ffEEB63BbfB5c94c096)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x961eF021A56EC0A051BaA4B3419A4412caFC8fbF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xa7F215B5fC21e19C4e17E4915CA69740CE2916Af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xaA3A7A2ec2477A61082E1C41a2c6710587917028)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0xB546310EA2De84220811a03BCD5CeE96D251fA7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xd063bb4EB74f813b1A0D9208Da100E3c08D9d4C9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xe63ddb12FBb6211a73F12a4367b10dA0834B82da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xFB48D385Fa3da33762B350e1d705b9E46054E677)
    +++ description: None
```
