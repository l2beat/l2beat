Generated with discovered.json: 0xf7fb7f83bf7de129d4215d9d4d56037bafd44bf7

# Diff at Thu, 28 Mar 2024 10:28:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19488869
- current block number: 19532012

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19488869 (main branch discovery), not current.

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      upgradeability.threshold:
+        "9 of 12 (75%)"
    }
```

Generated with discovered.json: 0xdab66b0648ddfea385056c8353105da61cbb132b

# Diff at Fri, 22 Mar 2024 08:07:54 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@173befb1ef4ba15605c92f5f89227f2ffd2af3eb block: 19390070
- current block number: 19488869

## Description

- added a batchPosterManager multisig. It can update whether an address is authorized to be a batch poster at the sequencer inbox. The DAO still has the same ability to revoke the Sequencer role; i.e., the DAO could update the batch poster manager (along with any batch posters).
- changed SequencerInbox implementation - added flag readers. The data posted has initial bytes used as certificate for certain flags, such as to show the data has used a certain merkelization strategy, or compression scheme: https://github.com/OffchainLabs/nitro/blob/69de0603abf6f900a4128cab7933df60cad54ded/arbstate/das_reader.go
- added check if sequencerInbox is deployed on an Arbitrum chain (for L3s?). If data is posted with eip4844 format, since EIP 4844 is not supported on Arbitrum chains, it will revert.
- set the batch poster manager multisig that can rotate batcher keys.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMath (0x1efb116EBC38CE895Eb2E5e009234E0E0836f2F5)
    +++ description: None
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      upgradeability.implementation:
-        "0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"
+        "0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"
      implementations.0:
-        "0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"
+        "0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"
      values.maxTimeVariation.3:
-        3600
+        768
      values.maxTimeVariation.1:
-        12
+        64
      values.batchPosterManager:
+        "0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        false
      values.maxDataSize:
+        117964
      values.reader4844:
+        "0xb5f6951AB2504442c3F6dD37fF1E1D1d253C5097"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x7a6C0503107858f82a790E481024134092e19979)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x7AdcA86896c4220f19B2f7f9746e7A99E57B0Fc5)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x8323B58C522690E6aFae94044825F0c79A93d236)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x9CBC3F14a57CE6eAD0e770F528E2f1E8b8C37613)
    +++ description: None
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: None
      upgradeability.implementation:
-        "0x7a18bB9DbAF1202F3fc977e42E3C360d522e4566"
+        "0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"
      implementations.0:
-        "0x7a18bB9DbAF1202F3fc977e42E3C360d522e4566"
+        "0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"
      values.osp:
-        "0x7AdcA86896c4220f19B2f7f9746e7A99E57B0Fc5"
+        "0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e"
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: None
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x221CCc45985Fdd24e33c3f19c6b7D48C02d5DCAa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xA174e12Ff8C6b18B37fecA77d6d350D89379A58C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xb5f6951AB2504442c3F6dD37fF1E1D1d253C5097)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xb602D056BD6BA78c3A320660d1a45D1cc8bbD3ED)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xd7f12E7418B007Ad7A5c7ACBbF460D3Cfe92A63e)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++
 .../implementation/contracts/base/Executor.sol     |  27 +
 .../contracts/base/FallbackManager.sol             |  53 ++
 .../implementation/contracts/base/GuardManager.sol |  50 ++
 .../contracts/base/ModuleManager.sol               | 133 +++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 ++
 .../contracts/external/GnosisSafeMath.sol          |  54 ++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 155 ++++++
 .../BatchPosterManagerMultisig/proxy/meta.txt      |   2 +
 .../ChallengeManager/implementation/meta.txt       |   2 +-
 .../implementation/src/bridge/IBridge.sol          | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../implementation/src/bridge/IOwnable.sol         |   5 +-
 .../implementation/src/bridge/ISequencerInbox.sol  | 215 ++++++--
 .../implementation/src/challenge/ChallengeLib.sol  |   2 +-
 .../src/challenge/ChallengeManager.sol             |  19 +-
 .../src/challenge/IChallengeManager.sol            |   4 +-
 .../src/challenge/IChallengeResultReceiver.sol     |   2 +-
 .../implementation/src/libraries/Constants.sol     |   8 +-
 .../src/libraries/DelegateCallAware.sol            |   2 +-
 .../implementation/src/libraries/Error.sol         | 167 +++++-
 .../implementation/src/libraries/IGasRefunder.sol  |  26 +-
 .../implementation/src/osp/IOneStepProofEntry.sol  |   2 +-
 .../implementation/src/osp/IOneStepProver.sol      |   3 +-
 .../src/state/Deserialize.sol => /dev/null         | 302 -----------
 .../implementation/src/state/GlobalState.sol       |   9 +-
 .../implementation/src/state/Instructions.sol      |   2 +-
 .../implementation/src/state/Machine.sol           |   2 +-
 .../src/state/MerkleProof.sol => /dev/null         |  99 ----
 .../implementation/src/state/Module.sol            |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../implementation/src/state/StackFrame.sol        |   2 +-
 .../implementation/src/state/Value.sol             |   2 +-
 .../implementation/src/state/ValueArray.sol        |   2 +-
 .../implementation/src/state/ValueStack.sol        |   2 +-
 .../OneStepProofEntry/meta.txt                     |   2 +-
 .../OneStepProofEntry/src/bridge/IBridge.sol       | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProofEntry/src/bridge/IOwnable.sol      |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../src/osp/IOneStepProofEntry.sol                 |   2 +-
 .../OneStepProofEntry/src/osp/IOneStepProver.sol   |   3 +-
 .../src/osp/OneStepProofEntry.sol                  |   2 +-
 .../OneStepProofEntry/src/state/Deserialize.sol    |   4 +-
 .../OneStepProofEntry/src/state/GlobalState.sol    |   9 +-
 .../OneStepProofEntry/src/state/Instructions.sol   |   2 +-
 .../OneStepProofEntry/src/state/Machine.sol        |   2 +-
 .../OneStepProofEntry/src/state/MerkleProof.sol    |   2 +-
 .../OneStepProofEntry/src/state/Module.sol         |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProofEntry/src/state/StackFrame.sol     |   2 +-
 .../OneStepProofEntry/src/state/Value.sol          |   2 +-
 .../OneStepProofEntry/src/state/ValueArray.sol     |   2 +-
 .../OneStepProofEntry/src/state/ValueStack.sol     |   2 +-
 .../OneStepProver0/meta.txt                        |   2 +-
 .../OneStepProver0/src/bridge/IBridge.sol          | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProver0/src/bridge/IOwnable.sol         |   5 +-
 .../OneStepProver0/src/bridge/ISequencerInbox.sol  | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../OneStepProver0/src/libraries/IGasRefunder.sol  |  26 +-
 .../OneStepProver0/src/osp/IOneStepProver.sol      |   3 +-
 .../OneStepProver0/src/osp/OneStepProver0.sol      |   2 +-
 .../OneStepProver0/src/state/Deserialize.sol       |   4 +-
 .../OneStepProver0/src/state/GlobalState.sol       |   9 +-
 .../OneStepProver0/src/state/Instructions.sol      |   2 +-
 .../OneStepProver0/src/state/Machine.sol           |   2 +-
 .../OneStepProver0/src/state/MerkleProof.sol       |   2 +-
 .../OneStepProver0/src/state/Module.sol            |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProver0/src/state/StackFrame.sol        |   2 +-
 .../OneStepProver0/src/state/Value.sol             |   2 +-
 .../OneStepProver0/src/state/ValueArray.sol        |   2 +-
 .../OneStepProver0/src/state/ValueStack.sol        |   2 +-
 .../OneStepProverHostIo/meta.txt                   |   2 +-
 .../OneStepProverHostIo/src/bridge/IBridge.sol     | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProverHostIo/src/bridge/IOwnable.sol    |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../OneStepProverHostIo/src/bridge/Messages.sol    |   2 +-
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../OneStepProverHostIo/src/osp/IOneStepProver.sol |   3 +-
 .../src/osp/OneStepProverHostIo.sol                | 110 +++-
 .../OneStepProverHostIo/src/state/Deserialize.sol  |   4 +-
 .../OneStepProverHostIo/src/state/GlobalState.sol  |   9 +-
 .../OneStepProverHostIo/src/state/Instructions.sol |   2 +-
 .../OneStepProverHostIo/src/state/Machine.sol      |   2 +-
 .../OneStepProverHostIo/src/state/MerkleProof.sol  |   2 +-
 .../OneStepProverHostIo/src/state/Module.sol       |   6 +-
 .../OneStepProverHostIo/src/state/ModuleMemory.sol |  11 +-
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProverHostIo/src/state/StackFrame.sol   |   2 +-
 .../OneStepProverHostIo/src/state/Value.sol        |   2 +-
 .../OneStepProverHostIo/src/state/ValueArray.sol   |   2 +-
 .../OneStepProverHostIo/src/state/ValueStack.sol   |   2 +-
 .../OneStepProverMath/meta.txt                     |   2 +-
 .../OneStepProverMath/src/bridge/IBridge.sol       | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProverMath/src/bridge/IOwnable.sol      |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../OneStepProverMath/src/osp/IOneStepProver.sol   |   3 +-
 .../src/osp/OneStepProverMath.sol                  |   2 +-
 .../OneStepProverMath/src/state/Deserialize.sol    |   4 +-
 .../OneStepProverMath/src/state/GlobalState.sol    |   9 +-
 .../OneStepProverMath/src/state/Instructions.sol   |   2 +-
 .../OneStepProverMath/src/state/Machine.sol        |   2 +-
 .../OneStepProverMath/src/state/MerkleProof.sol    |   2 +-
 .../OneStepProverMath/src/state/Module.sol         |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProverMath/src/state/StackFrame.sol     |   2 +-
 .../OneStepProverMath/src/state/Value.sol          |   2 +-
 .../OneStepProverMath/src/state/ValueArray.sol     |   2 +-
 .../OneStepProverMath/src/state/ValueStack.sol     |   2 +-
 .../OneStepProverMemory/meta.txt                   |   2 +-
 .../OneStepProverMemory/src/bridge/IBridge.sol     | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProverMemory/src/bridge/IOwnable.sol    |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../OneStepProverMemory/src/osp/IOneStepProver.sol |   3 +-
 .../src/osp/OneStepProverMemory.sol                |   3 +-
 .../OneStepProverMemory/src/state/Deserialize.sol  |   4 +-
 .../OneStepProverMemory/src/state/GlobalState.sol  |   9 +-
 .../OneStepProverMemory/src/state/Instructions.sol |   2 +-
 .../OneStepProverMemory/src/state/Machine.sol      |   2 +-
 .../OneStepProverMemory/src/state/MerkleProof.sol  |   2 +-
 .../OneStepProverMemory/src/state/Module.sol       |   6 +-
 .../OneStepProverMemory/src/state/ModuleMemory.sol |  11 +-
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProverMemory/src/state/StackFrame.sol   |   2 +-
 .../OneStepProverMemory/src/state/Value.sol        |   2 +-
 .../OneStepProverMemory/src/state/ValueArray.sol   |   2 +-
 .../OneStepProverMemory/src/state/ValueStack.sol   |   2 +-
 .../SequencerInbox/implementation/meta.txt         |   2 +-
 .../implementation/src/bridge/IBridge.sol          |  41 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../implementation/src/bridge/IERC20Bridge.sol     |  37 ++
 .../src/bridge/IInbox.sol => /dev/null             | 193 -------
 .../implementation/src/bridge/IInboxBase.sol       |  86 +++
 .../implementation/src/bridge/IOutbox.sol          |  12 +-
 .../implementation/src/bridge/IOwnable.sol         |   2 +-
 .../implementation/src/bridge/ISequencerInbox.sol  | 117 ++++-
 .../implementation/src/bridge/Messages.sol         |   2 +-
 .../implementation/src/bridge/SequencerInbox.sol   | 582 ++++++++++++++++-----
 .../implementation/src/challenge/ChallengeLib.sol  |   2 +-
 .../src/challenge/IChallengeManager.sol            |   2 +-
 .../src/challenge/IChallengeResultReceiver.sol     |   2 +-
 .../src/libraries/ArbitrumChecker.sol              |  16 +
 .../src/libraries/Constants.sol => /dev/null       |  13 -
 .../src/libraries/DelegateCallAware.sol            |   2 +-
 .../implementation/src/libraries/Error.sol         |  51 +-
 .../src/libraries/GasRefundEnabled.sol             |  52 ++
 .../implementation/src/libraries/IGasRefunder.sol  |  30 +-
 .../implementation/src/libraries/IReader4844.sol   |  13 +
 .../implementation/src/libraries/MessageTypes.sol  |   2 +-
 .../implementation/src/osp/IOneStepProofEntry.sol  |   2 +-
 .../implementation/src/osp/IOneStepProver.sol      |   3 +-
 .../implementation/src/precompiles/ArbGasInfo.sol  | 152 ++++++
 .../implementation/src/precompiles/ArbSys.sol      | 152 ++++++
 .../implementation/src/rollup/IRollupCore.sol      |  19 +-
 .../src/rollup/IRollupEventInbox.sol               |   6 +-
 .../implementation/src/rollup/IRollupLogic.sol     | 136 +----
 .../implementation/src/rollup/Node.sol             |  16 +-
 .../src/rollup/RollupLib.sol => /dev/null          | 151 ------
 .../src/state/Deserialize.sol => /dev/null         | 302 -----------
 .../implementation/src/state/GlobalState.sol       |   2 +-
 .../implementation/src/state/Instructions.sol      |   2 +-
 .../implementation/src/state/Machine.sol           |   2 +-
 .../src/state/MerkleProof.sol => /dev/null         |  99 ----
 .../implementation/src/state/Module.sol            |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../implementation/src/state/StackFrame.sol        |   2 +-
 .../implementation/src/state/Value.sol             |   2 +-
 .../implementation/src/state/ValueArray.sol        |   2 +-
 .../implementation/src/state/ValueStack.sol        |   2 +-
 .../null => discovery/nova/ethereum/.code/meta.txt |   2 +
 196 files changed, 4487 insertions(+), 2845 deletions(-)
```

Generated with discovered.json: 0xce1846ca8a71c542f62d345e25419cdb72e8f071

# Diff at Fri, 08 Mar 2024 11:12:54 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- comparing to: main@f09f798ebd2ae57f4c76e08114d608edf0a51c7b block: 19132347
- current block number: 19390070

## Description

The ArbitrumDACKeysetHandler has been changed in a way to make values more readable. No values were changed inside smart contracts, only the handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19132347 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      values.dacKeyset.threshold:
-        2
      values.dacKeyset.keyCount:
-        6
      values.dacKeyset.requiredSignatures:
+        5
      values.dacKeyset.membersCount:
+        6
    }
```

Generated with discovered.json: 0x11137089528e466103478529e9825c95fb2f9c20

# Diff at Thu, 01 Feb 2024 08:18:12 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 18564156
- current block number: 19132347

## Description

Add the SequencerInboxVersion handler. Updated OS version to ArbOS 11. Added other useful handlers.

## Watched changes

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
      values.dacKeyset.keyCount:
-        8
+        6
      values.keySetUpdates:
-        10
+        11
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
      values.getOwners.0:
-        "0x702105E66C468b5191553702cD6BF3D6Bbfa4C6b"
+        "0x375906ADFD34D93236084F462BB2dB0D92129Fe1"
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
      values.wasmModuleRoot:
-        "0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3"
+        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18564156 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
      values.batchPosters:
+        ["0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D","0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc"]
      values.dacKeyset:
+        {"threshold":2,"keyCount":8}
      values.keySetUpdates:
+        10
      values.sequencerVersion:
+        "0x88"
      derivedName:
+        "SequencerInbox"
    }
```

```diff
    contract ArbitrumProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
      name:
-        "ArbitrumProxy"
+        "RollupProxy"
      values.challenges:
+        []
      values.setValidatorCount:
+        6
      values.validators:
+        ["0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4","0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23","0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3","0x3B0369CAD35d257793F51c28213a4Cf4001397AC","0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76","0x610Aa279989F440820e14248BD3879B148717974","0x658e8123722462F888b6fa01a7dbcEFe1D6DD709","0xAB1A39332e934300eBCc57B5f95cA90631a347FF","0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB","0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87","0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"]
      derivedName:
+        "ArbitrumProxy"
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    }
```

```diff
+   Status: CREATED
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    }
```

# Diff at Mon, 13 Nov 2023 16:26:39 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: master@a45348c9ae2e765b872be3f217168f73b62d35a6

## Description

Some of the Security Council members were replaced.

Names of the owners of the EOAs listed below were manually found on public Arbitrum forums,
so they may be incorrect.

Removed EOAs:

- 0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF (Mo Dong?)
- 0x0E5011001cF9c89b0259BC3B050785067495eBf5 (Diane Dai?)
- 0x8688515028955734350067695939423222009623 (Celeb Lau?)
- 0x88910996671162953E89DdcE5C8137f9077da217 (??)
- 0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5 (Bryan Pellegrino?)

Added EOAs:

- 0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3 (Patrick McCorry?)
- 0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed (0xhombre?)
- 0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF (John Morrow?)
- 0xb07dc9103328A51128bC6Cc1049d1137035f5E28 (Omer Goldberg?)
- 0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23 (Matt Fiebach?)

## Watched changes

```diff
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
      values.getOwners.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.3:
-        "0x8688515028955734350067695939423222009623"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
    }
```

# Diff at Fri, 22 Sep 2023 07:25:53 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@3a33c063dab8666dc32b4ec15a81995020325b49

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      upgradeability.implementation:
-        "0x962d70fc48F3465404bC77B03f104746B25a1d1b"
+        "0x61dC65001A8De4138DAD5167e43FF0FB0AB8D3B3"
    }
```
