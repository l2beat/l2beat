Generated with discovered.json: 0xf752e8896ca15b4542b0ac086ddafa9399ce8234

# Diff at Tue, 02 Jul 2024 09:34:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6e87a8f437fbb4bda4cdabd5107dd1f20f111445 block: 16316538
- current block number: 16561766

## Description

Degen is upgraded to [ArbOS Version 20 "Atlas"](https://forum.arbitrum.foundation/t/aip-arbos-version-20-atlas/20957).
This upgrade comes with blobs support (but Degen is an L3 on Base) and was reviewed thoroughly in `packages/backend/discovery/arbitrum/ethereum/diffHistory.md` at "Diff at Fri, 22 Mar 2024 07:51:09 GMT:".

TLDR of changes:
- SequencerInbox changes are related to blobs support
- Critical values like maxTimeVariation in the SequencerInbox (self sequencing delay) stay the same
- ChallengeManager is the same except for pointing to new OneStepProof contract

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x23D6786f56eb33313a2F3393012e29631f63C914)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x351089AaF039aF15bb601e695A30D515963D29Af)
    +++ description: None
```

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      upgradeability.implementation:
-        "0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"
+        "0x98DB769A9E15D66EA04665da0dF616596c296BA8"
      implementations.0:
-        "0x5ad3e9141D0EAd2132afFF0CD74487964cE9135A"
+        "0x98DB769A9E15D66EA04665da0dF616596c296BA8"
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        true
      values.reader4844:
+        "0xB48E4A4B8EC04c9F1819302FD370f5B3797c638C"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
    contract ChallengeManager (0x67812161Bbb6aCF891aA6028BC614a660961ceD8) {
    +++ description: None
      upgradeability.implementation:
-        "0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"
+        "0x377A5b786E94cAcdcB2B309451C373c8F2166A79"
      implementations.0:
-        "0x9Db0bB898C500DD84C7c7bd7fFFFE914569a6677"
+        "0x377A5b786E94cAcdcB2B309451C373c8F2166A79"
      values.osp:
-        "0x351089AaF039aF15bb601e695A30D515963D29Af"
+        "0xC17A41629Cd100c74B1Bed7b49D2E0517EfDeaeb"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x915322CB7Ef079d9d9B97ffEEB63BbfB5c94c096)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x961eF021A56EC0A051BaA4B3419A4412caFC8fbF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xa7F215B5fC21e19C4e17E4915CA69740CE2916Af)
    +++ description: None
```

```diff
    contract RollupProxy (0xD34F3a11F10DB069173b32d84F02eDA578709143) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x2Bb71AE6f5Bb52de5F535efD804e156ed2a35a8f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x764cDAAc715ef3e29B3c8D28A1261AD9B7eD206D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xB48E4A4B8EC04c9F1819302FD370f5B3797c638C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xBa04bD4aDa714b0cb3B87784dc9F20620aF37428)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xC17A41629Cd100c74B1Bed7b49D2E0517EfDeaeb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xF4AA217a96c205df7B0D081DC95385B701eFE9b0)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

Generated with discovered.json: 0x603758207c23fada073f1e40b7c71acf33515b0a

# Diff at Tue, 11 Jun 2024 13:15:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 15021326
- current block number: 15661159

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15021326 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [3456000,48,86400000,3600]
+        {"delayBlocks":3456000,"futureBlocks":48,"delaySeconds":86400000,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xc30d97b2c62e49cb891cf19047ba38cb3a0d7615

# Diff at Mon, 27 May 2024 17:47:10 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@dbc274621a752b9a0e3943e430166c617d1edd06 block: 14543033
- current block number: 15021326

## Description

Updated the SequencerInbox template, no onchain changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14543033 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221) {
    +++ description: State batches / commitments get posted here.
      values.IS_HARDCODED_SEQUENCER_BATCH_POSTER:
-        false
    }
```

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
