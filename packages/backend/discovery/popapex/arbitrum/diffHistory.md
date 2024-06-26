Generated with discovered.json: 0x04c4d00a8772236129c4ae5c164e1146c832e394

# Diff at Tue, 11 Jun 2024 12:22:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 215638376
- current block number: 220726400

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 215638376 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [3456000,48,86400000,3600]
+        {"delayBlocks":3456000,"futureBlocks":48,"delaySeconds":86400000,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xf80bfbaf3a649ffd7309eb20265b40f764614b4a

# Diff at Mon, 27 May 2024 17:45:02 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@dbc274621a752b9a0e3943e430166c617d1edd06 block: 211899531
- current block number: 215638376

## Description

Updated the SequencerInbox template, no onchain changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 211899531 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: State batches / commitments get posted here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
    }
```

Generated with discovered.json: 0x9fe3796691c10ec5795e696f3f364bf5faed7778

# Diff at Tue, 14 May 2024 07:19:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0dcad16d442c9306c666eb55cc246f5202105346 block: 203714971
- current block number: 211101547

## Description


This update extends the sequencer-only window for Proof of Play Apex chain by 1000x to 1000d. (MaxTimeVariation.delayBlocks, maxTimeVariation.delaySeconds)
Context: [Reorg on popapex](https://twitter.com/conduitxyz/status/1790065376975552549). No batches posted for the last ~35h, similar problem to Degen chain.

## Watched changes

```diff
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1) {
    +++ description: None
      values.maxTimeVariation.2:
-        86400
+        86400000
      values.maxTimeVariation.0:
-        5760
+        3456000
    }
```

Generated with discovered.json: 0xf50c4fdab7cd8deba39e9b78f4634254f949bf52

# Diff at Thu, 11 Apr 2024 14:11:27 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 199929429

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Bridge (0x074fFD20C6D8865752C997f4980Cf70F2a3Fbac6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x0cD85675897B7020d7121e63AB250d3F47ff3Ff2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x3d0b021E1d2A8747411E3724d5165716B35448f3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x65AD139061B3f6DDb16170a07b925337ddf42407)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupOwnerMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x7b18A3073774e00C072DeBd390ed6fE4251493A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xa58F38102579dAE7C584850780dDA55744f67DF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xaF57dD96a0c0E8757329D55C56De6eC50Aac73Ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xC3874bE54E3f25BBC6B4fB582654fd9294f485a1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCC6f49cff395c4d160C61112522700dcB007c41d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```
