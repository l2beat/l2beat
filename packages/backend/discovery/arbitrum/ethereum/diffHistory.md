Generated with discovered.json: 0x3ea08e093c4fc78a79b685a42dbbadc7258c49c0

# Diff at Fri, 22 Mar 2024 07:51:09 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@173befb1ef4ba15605c92f5f89227f2ffd2af3eb block: 19419824
- current block number: 19488784

## Description

- changed futureBlocks from 12 to 64, changed futureSeconds from 3600 to 768. The futureBlocks value in the the SequencerInbox enforces a max block height that a batch can be posted relative to the current block (likewise with futureSeconds). A small value for future blocks means that a relatively small L1 reorg can cause an otherwise valid batch to revert. The increase to 64, two epochs, is in line with Ethereum’s finality guarantees. The futureSeconds value is set to correspond to the new futureBlocks value (64*12s).
- added a batchPosterManager multisig. It can update whether an address is authorized to be a batch poster at the sequencer inbox. The DAO still has the same ability to revoke the Sequencer role; i.e., the DAO could update the batch poster manager (along with any batch posters).
- updated wasmModuleRoot to ArbOS v20. List of changes:
https://forum.arbitrum.foundation/t/aip-arbos-version-20-atlas/20957
- redeployed OneStepProofEntry, OneStepProverHostIo, OneStepProverMath, OneStepProver0, OneStepProverMemory to be compatible with EIP-4844
- changed ChallengeManager implementation 
      - set the new OneStepProver for EIP-4844
- changed SequencerInbox implementation
      - added flag readers. The data posted has initial bytes used as certificate for certain flags, such as to show the data has used a certain merkelization strategy, or compression scheme: https://github.com/OffchainLabs/nitro/blob/69de0603abf6f900a4128cab7933df60cad54ded/arbstate/das_reader.go 
      - removed already deprecated function 
      - added check if sequencerInbox is deployed on an Arbitrum chain (for L3s?). If data is posted with eip4844 format, since EIP 4844 is not supported on Arbitrum chains, it will revert.
      - set the batch poster manager multisig that can rotate batcher keys. 
- timelock transactions:
      - arbitrum:
            - AIP1Point2Action.perform
            - AIP4Action.perform
            - GovernanceChainSCMgmtActivationAction.perform
            - UpdateGasChargeAction.perform
            - SetSweepReceiverAction.perform
            - SecurityCouncilMemberSyncAction.perform
            - SetArbOS11VersionAction.perform
            - NomineeGovernorV2UpgradeAction.perform
            - SetArbOS20VersionAction
            - ArbOneSetAtlasL1PricingRewardAction
            - ArbOneSetAtlasMinBaseFeeAction
      - ethereum:
            - L1SCMgmtActivationAction.perform
            - UpdateL1CoreTimelockAction.perform
            - SecurityCouncilMemberSyncAction.perform
            - AddNovaKeysetAction.perform
            - SetArbOneArbOS11ModuleRootAciton.perform
            - SetNovaArbOS11ModuleRootAction.perform
            - AIPSetSequencerInboxMaxTimeVariationArbOneAction
            - AIPSetSequencerInboxMaxTimeVariationNovaAction
            - ArbOneAIP4844Action
            - ArbOneSetBatchPosterManagerAction
            - NovaSetBatchPosterManagerAction
      - nova: 
            - NonGovernanceChainSCMgmtActivationAction.perfom
            - SecurityCouncilMemberSyncAction
            - SetArbOS11VersionAction
            - NovaAIP4844Action
            - SetArbOS20VersionAction

## Watched changes

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
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
    contract OneStepProofEntry (0x3E1f62AA8076000c3218493FE3e0Ae40bcB9A1DF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x499A4f574f2e4F8837E242adEc86223Ef7DeEfcC)
    +++ description: None
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    +++ description: None
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xb556F3Bb0FdCFeAf81a1c393e024a69a3327B676)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0xb965b08A826D4C7634e0Df4c5eF5E1d1f9b5D13A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xd315Ac3a82E8EDAA84b347F478e0F59801747970)
    +++ description: None
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
    +++ description: None
      upgradeability.implementation:
-        "0x1c78B622961f27Ccc2f9BA65E2ba5d5eB301a445"
+        "0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"
      implementations.0:
-        "0x1c78B622961f27Ccc2f9BA65E2ba5d5eB301a445"
+        "0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"
      values.osp:
-        "0x3E1f62AA8076000c3218493FE3e0Ae40bcB9A1DF"
+        "0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e"
    }
```

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.27:
+        {"id":"0xdda98e62c0827b0ea976efa9fa7eab4086f6ecc5aa6715e02868bb2972b12cad","decoded":{"chain":"arbitrum","contractName":"ArbOneSetAtlasMinBaseFeeAction","function":"perform","inputs":[],"address":"0x849E360a247132F961c9CBE95Ba39106c72e1268","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000849e360a247132f961c9cbe95ba39106c72e126800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
      values.scheduledTransactions.26:
+        {"id":"0xdda98e62c0827b0ea976efa9fa7eab4086f6ecc5aa6715e02868bb2972b12cad","decoded":{"chain":"arbitrum","contractName":"ArbOneSetAtlasL1PricingRewardAction","function":"perform","inputs":[],"address":"0x36D0170D92F66e8949eB276C3AC4FEA64f83704d","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"},"raw":{"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000036d0170d92f66e8949eb276c3ac4fea64f83704d00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}}
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
 .../implementation/src/bridge/IBridge.sol          |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../implementation/src/bridge/IOwnable.sol         |   2 +-
 .../implementation/src/bridge/ISequencerInbox.sol  | 124 ++++-
 .../implementation/src/challenge/ChallengeLib.sol  |   2 +-
 .../src/challenge/ChallengeManager.sol             |  19 +-
 .../src/challenge/IChallengeManager.sol            |   4 +-
 .../src/challenge/IChallengeResultReceiver.sol     |   2 +-
 .../implementation/src/libraries/Constants.sol     |   8 +-
 .../src/libraries/DelegateCallAware.sol            |   2 +-
 .../implementation/src/libraries/Error.sol         |  60 ++-
 .../implementation/src/libraries/IGasRefunder.sol  |  24 +-
 .../implementation/src/osp/IOneStepProofEntry.sol  |   2 +-
 .../implementation/src/osp/IOneStepProver.sol      |   3 +-
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
 .../OneStepProofEntry/meta.txt                     |   2 +-
 .../OneStepProofEntry/src/bridge/IBridge.sol       |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../OneStepProofEntry/src/bridge/IOwnable.sol      |   2 +-
 .../src/bridge/ISequencerInbox.sol                 | 124 ++++-
 .../src/libraries/IGasRefunder.sol                 |  24 +-
 .../src/osp/IOneStepProofEntry.sol                 |   2 +-
 .../OneStepProofEntry/src/osp/IOneStepProver.sol   |   3 +-
 .../src/osp/OneStepProofEntry.sol                  |   2 +-
 .../OneStepProofEntry/src/state/Deserialize.sol    |   4 +-
 .../OneStepProofEntry/src/state/GlobalState.sol    |   2 +-
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
 .../OneStepProver0/src/bridge/IBridge.sol          |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../OneStepProver0/src/bridge/IOwnable.sol         |   2 +-
 .../OneStepProver0/src/bridge/ISequencerInbox.sol  | 124 ++++-
 .../OneStepProver0/src/libraries/IGasRefunder.sol  |  24 +-
 .../OneStepProver0/src/osp/IOneStepProver.sol      |   3 +-
 .../OneStepProver0/src/osp/OneStepProver0.sol      |   2 +-
 .../OneStepProver0/src/state/Deserialize.sol       |   4 +-
 .../OneStepProver0/src/state/GlobalState.sol       |   2 +-
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
 .../OneStepProverHostIo/src/bridge/IBridge.sol     |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../OneStepProverHostIo/src/bridge/IOwnable.sol    |   2 +-
 .../src/bridge/ISequencerInbox.sol                 | 124 ++++-
 .../OneStepProverHostIo/src/bridge/Messages.sol    |   2 +-
 .../src/libraries/IGasRefunder.sol                 |  24 +-
 .../OneStepProverHostIo/src/osp/IOneStepProver.sol |   3 +-
 .../src/osp/OneStepProverHostIo.sol                | 110 +++-
 .../OneStepProverHostIo/src/state/Deserialize.sol  |   4 +-
 .../OneStepProverHostIo/src/state/GlobalState.sol  |   2 +-
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
 .../OneStepProverMath/src/bridge/IBridge.sol       |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../OneStepProverMath/src/bridge/IOwnable.sol      |   2 +-
 .../src/bridge/ISequencerInbox.sol                 | 124 ++++-
 .../src/libraries/IGasRefunder.sol                 |  24 +-
 .../OneStepProverMath/src/osp/IOneStepProver.sol   |   3 +-
 .../src/osp/OneStepProverMath.sol                  |   2 +-
 .../OneStepProverMath/src/state/Deserialize.sol    |   4 +-
 .../OneStepProverMath/src/state/GlobalState.sol    |   2 +-
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
 .../OneStepProverMemory/src/bridge/IBridge.sol     |  48 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../OneStepProverMemory/src/bridge/IOwnable.sol    |   2 +-
 .../src/bridge/ISequencerInbox.sol                 | 124 ++++-
 .../src/libraries/IGasRefunder.sol                 |  24 +-
 .../OneStepProverMemory/src/osp/IOneStepProver.sol |   3 +-
 .../src/osp/OneStepProverMemory.sol                |   3 +-
 .../OneStepProverMemory/src/state/Deserialize.sol  |   4 +-
 .../OneStepProverMemory/src/state/GlobalState.sol  |   2 +-
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
 .../arbitrum/ethereum/.code/meta.txt               |   2 +
 191 files changed, 3654 insertions(+), 2259 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19419824 (main branch discovery), not current.

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.25.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.25.value:
-        0
      values.scheduledTransactions.25.data:
-        "0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.25.delay:
-        259200
      values.scheduledTransactions.25.decoded:
+        {"chain":"nova","address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"}
      values.scheduledTransactions.25.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.24.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.24.value:
-        0
      values.scheduledTransactions.24.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.24.delay:
-        259200
      values.scheduledTransactions.24.decoded:
+        {"chain":"arbitrum","contractName":"SetArbOS20VersionAction","function":"perform","inputs":[],"address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.24.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.23.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.23.value:
-        0
      values.scheduledTransactions.23.data:
-        "0x1cff79cd000000000000000000000000501f30810d2b0eaec15cc3785dbb29e4a8a92a7000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.23.delay:
-        259200
      values.scheduledTransactions.23.decoded:
+        {"chain":"ethereum","contractName":"NovaSetBatchPosterManagerAction","function":"perform","inputs":[],"address":"0x501f30810D2b0EaEC15Cc3785dBB29e4a8a92a70","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.23.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000501f30810d2b0eaec15cc3785dbb29e4a8a92a7000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.22.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.22.value:
-        0
      values.scheduledTransactions.22.data:
-        "0x1cff79cd000000000000000000000000874356173cfd6c739aeab1f5abfb5f3afb3d4d3300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.22.delay:
-        259200
      values.scheduledTransactions.22.decoded:
+        {"chain":"ethereum","contractName":"NovaAIP4844Action","function":"perform","inputs":[],"address":"0x874356173CFd6C739aeab1F5ABfB5F3AFB3d4d33","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.22.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000874356173cfd6c739aeab1f5abfb5f3afb3d4d3300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.21.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.21.value:
-        0
      values.scheduledTransactions.21.data:
-        "0x1cff79cd000000000000000000000000ce0af261eb511cb41b8d0a2e31df80ba37e265ab00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.21.delay:
-        259200
      values.scheduledTransactions.21.decoded:
+        {"chain":"ethereum","contractName":"ArbOneSetBatchPosterManagerAction","function":"perform","inputs":[],"address":"0xCe0aF261EB511CB41b8D0A2e31DF80BA37e265aB","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.21.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000ce0af261eb511cb41b8d0a2e31df80ba37e265ab00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.20.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.20.value:
-        0
      values.scheduledTransactions.20.data:
-        "0x1cff79cd00000000000000000000000076d8e97cd4514bebbc21d2044ff4a8d9ea1f0cc400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.20.delay:
-        259200
      values.scheduledTransactions.20.decoded:
+        {"chain":"ethereum","contractName":"ArbOneAIP4844Action","function":"perform","inputs":[],"address":"0x76D8e97Cd4514bebBc21d2044fF4a8d9eA1f0CC4","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.20.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000076d8e97cd4514bebbc21d2044ff4a8d9ea1f0cc400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.19.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.19.value:
-        0
      values.scheduledTransactions.19.data:
-        "0x1cff79cd00000000000000000000000047a85c0a118127f3968a6a1a61e2a326517540d400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.19.delay:
-        259200
      values.scheduledTransactions.19.decoded:
+        {"chain":"ethereum","contractName":"AIPSetSequencerInboxMaxTimeVariationNovaAction","function":"perform","inputs":[],"address":"0x47a85C0a118127F3968A6A1A61e2a326517540D4","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.19.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000047a85c0a118127f3968a6a1a61e2a326517540d400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.18.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.18.value:
-        0
      values.scheduledTransactions.18.data:
-        "0x1cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.18.delay:
-        259200
      values.scheduledTransactions.18.decoded:
+        {"chain":"ethereum","contractName":"AIPSetSequencerInboxMaxTimeVariationArbOneAction","function":"perform","inputs":[],"address":"0x3E313Eeed58E851CA3841C6109697B9eb35C7726","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.18.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.17.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.17.value:
-        0
      values.scheduledTransactions.17.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000d9a2e0e5d7509f0bf1b2d33884f8c1b4d449087900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.17.delay:
-        259200
      values.scheduledTransactions.17.decoded:
+        {"chain":"arbitrum","contractName":"NomineeGovernorV2UpgradeAction","function":"perform","inputs":[],"address":"0xd9a2e0E5d7509F0BF1B2d33884F8C1b4D4490879","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.17.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000d9a2e0e5d7509f0bf1b2d33884f8c1b4d449087900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.16.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.16.value:
-        0
      values.scheduledTransactions.16.data:
-        "0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000005357f4d3e8f8250a77bcddd5e58886ad1358220c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.16.delay:
-        259200
      values.scheduledTransactions.16.decoded:
+        {"chain":"nova","address":"0x5357f4D3e8f8250A77bcddd5E58886AD1358220c","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"}
      values.scheduledTransactions.16.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000005357f4d3e8f8250a77bcddd5e58886ad1358220c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.15.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.15.value:
-        0
      values.scheduledTransactions.15.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000f6c7dc6eae78abf2f32df899654ca425dfa9948100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.15.delay:
-        259200
      values.scheduledTransactions.15.decoded:
+        {"chain":"arbitrum","contractName":"SetArbOS11VersionAction","function":"perform","inputs":[],"address":"0xF6c7Dc6eaE78aBF2f32df899654ca425Dfa99481","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.15.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000f6c7dc6eae78abf2f32df899654ca425dfa9948100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.14.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.14.value:
-        0
      values.scheduledTransactions.14.data:
-        "0x1cff79cd00000000000000000000000054c2c372943572ac2a8e84d502ebc13f14b6224600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.14.delay:
-        259200
      values.scheduledTransactions.14.decoded:
+        {"chain":"ethereum","contractName":"SetNovaArbOS11ModuleRootAction","function":"perform","inputs":[],"address":"0x54c2C372943572Ac2a8E84D502ebc13F14B62246","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.14.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000054c2c372943572ac2a8e84d502ebc13f14b6224600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.13.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.13.value:
-        0
      values.scheduledTransactions.13.data:
-        "0x1cff79cd0000000000000000000000003b70f2da6f3b01f9a53dcbcb3e59ad3ad8bed92400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.13.delay:
-        259200
      values.scheduledTransactions.13.decoded:
+        {"chain":"ethereum","contractName":"SetArbOneArbOS11ModuleRootAciton","function":"perform","inputs":[],"address":"0x3b70f2Da6F3b01F9a53dCBcB3e59AD3ad8bed924","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.13.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003b70f2da6f3b01f9a53dcbcb3e59ad3ad8bed92400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.12.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.12.value:
-        0
      values.scheduledTransactions.12.data:
-        "0x1cff79cd000000000000000000000000def5cfe3246882bc7f65f9346a8b974ba27d3f4e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.12.delay:
-        259200
      values.scheduledTransactions.12.decoded:
+        {"chain":"ethereum","contractName":"AddNovaKeysetAction","function":"perform","inputs":[],"address":"0xDef5CfE3246882BC7f65F9346a8b974BA27D3F4E","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.12.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000def5cfe3246882bc7f65f9346a8b974ba27d3f4e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.11.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.11.value:
-        0
      values.scheduledTransactions.11.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.11.delay:
-        259200
      values.scheduledTransactions.11.decoded:
+        {"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.11.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.10.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.10.value:
-        0
      values.scheduledTransactions.10.data:
-        "0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.10.delay:
-        259200
      values.scheduledTransactions.10.decoded:
+        {"chain":"nova","address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"}
      values.scheduledTransactions.10.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.9.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.9.value:
-        0
      values.scheduledTransactions.9.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.9.delay:
-        259200
      values.scheduledTransactions.9.decoded:
+        {"chain":"arbitrum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.9.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.8.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.8.value:
-        0
      values.scheduledTransactions.8.data:
-        "0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.8.delay:
-        259200
      values.scheduledTransactions.8.decoded:
+        {"chain":"ethereum","contractName":"SecurityCouncilMemberSyncAction","function":"perform","inputs":[{"name":"_securityCouncil","value":"0xF06E95eF589D9c38af242a8AAee8375f14023F85"},{"name":"_updatedMembers","value":["0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0x566a07C3c932aE6AF74d77c29e5c30D8B1853710","0x5280406912EB8Ec677Df66C326BE48f938DC2e44","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF","0xf6B6F07862A02C85628B3A9688beae07fEA9C863","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]},{"name":"_nonce","value":1}],"address":"0x9BF7b8884Fa381a45f8CB2525905fb36C996297a","calldata":"0x536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf09","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.8.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.7.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.7.value:
-        0
      values.scheduledTransactions.7.data:
-        "0x1cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.7.delay:
-        259200
      values.scheduledTransactions.7.decoded:
+        {"chain":"ethereum","contractName":"UpdateL1CoreTimelockAction","function":"perform","inputs":[],"address":"0xBabA4DAf5800B9746f58C724F05E03880850D578","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.7.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.6.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.6.value:
-        0
      values.scheduledTransactions.6.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.6.delay:
-        259200
      values.scheduledTransactions.6.decoded:
+        {"chain":"arbitrum","contractName":"SetSweepReceiverAction","function":"perform","inputs":[],"address":"0xBabA4DAf5800B9746f58C724F05E03880850D578","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.6.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.5.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.5.value:
-        0
      values.scheduledTransactions.5.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000007b1247f443359d1447cf25e73380bc9b99f2628f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.5.delay:
-        259200
      values.scheduledTransactions.5.decoded:
+        {"chain":"arbitrum","contractName":"UpdateGasChargeAction","function":"perform","inputs":[],"address":"0x7B1247f443359d1447Cf25e73380Bc9b99F2628f","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.5.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000007b1247f443359d1447cf25e73380bc9b99f2628f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.4.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.4.value:
-        0
      values.scheduledTransactions.4.data:
-        "0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.4.delay:
-        259200
      values.scheduledTransactions.4.decoded:
+        {"chain":"nova","address":"0x22EC545357162C342F643bDdb2eD4c3FB6B42eb0","calldata":"0xb147f40c","executor":"0x86a02dD71363c440b21F4c0E5B2Ad01Ffe1A7482","inboxOnEthereum":"0xc4448b71118c9071Bcb9734A0EAc55D18A153949"}
      values.scheduledTransactions.4.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.3.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.3.value:
-        0
      values.scheduledTransactions.3.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000001015c1ae166c4c39d18a1151b7029bac1530c9aa00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.3.delay:
-        259200
      values.scheduledTransactions.3.decoded:
+        {"chain":"arbitrum","contractName":"GovernanceChainSCMgmtActivationAction","function":"perform","inputs":[],"address":"0x1015c1Ae166C4C39D18a1151b7029bAC1530c9aa","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.3.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000001015c1ae166c4c39d18a1151b7029bac1530c9aa00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.2.target:
-        "0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"
      values.scheduledTransactions.2.value:
-        0
      values.scheduledTransactions.2.data:
-        "0x1cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.2.delay:
-        259200
      values.scheduledTransactions.2.decoded:
+        {"chain":"ethereum","contractName":"L1SCMgmtActivationAction","function":"perform","inputs":[],"address":"0x22EC545357162C342F643bDdb2eD4c3FB6B42eb0","calldata":"0xb147f40c","executor":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"}
      values.scheduledTransactions.2.raw:
+        {"target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.1.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.1.value:
-        0
      values.scheduledTransactions.1.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000085792f6bf346e3bfd3a275318add2c44a105844700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.1.delay:
-        259200
      values.scheduledTransactions.1.decoded:
+        {"chain":"arbitrum","contractName":"AIP4Action","function":"perform","inputs":[],"address":"0x85792f6BF346e3Bfd3A275318aDd2c44A1058447","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.1.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000085792f6bf346e3bfd3a275318add2c44a105844700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.0.target:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.scheduledTransactions.0.value:
-        0
      values.scheduledTransactions.0.data:
-        "0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000006274106eedd4848371d2c09e0352d67b795ed51600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      values.scheduledTransactions.0.delay:
-        259200
      values.scheduledTransactions.0.decoded:
+        {"chain":"arbitrum","contractName":"AIP1Point2Action","function":"perform","inputs":[],"address":"0x6274106eedD4848371D2C09e0352d67B795ED516","calldata":"0xb147f40c","executor":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","inboxOnEthereum":"0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"}
      values.scheduledTransactions.0.raw:
+        {"target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000006274106eedd4848371d2c09e0352d67b795ed51600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
    }
```

Generated with discovered.json: 0x36d7536b6e26bf57903930da87521158a9d1c787

# Diff at Tue, 12 Mar 2024 15:15:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@800d2d30954e8bfb14ad062b9806c50997706541 block: 19140307
- current block number: 19419824

## Description

Multiple transactions have been scheduled in L1ArbitrumTimelock as part of the
following approved governance proposals:

- id: 0xe4f8...: [Changes to the Constitution and the Security Council Election Process](https://www.tally.xyz/gov/arbitrum/proposal/28300903567340237987946172947371304329455149918972967618773111648600015289785) - Proposed on: Feb 7th, 2024
  - Add an additional 7 day window for contenders to add themselves before voting starts.
  - Only allow contenders to add themselves by signature, ensuring they are an EOA that can sign on all chains.
- id: 0x0b8dc...: [AIP: ArbOS 20 “Atlas” - Arbitrum Support for Dencun + Batch Poster Improvements](https://www.tally.xyz/gov/arbitrum/proposal/46905320292877192134536823079608810426433248493109520384601548724615383601450) - Proposed on: Feb 14th, 2024
  - Support posting batches of transactions as blobs to L1 Ethereum
  - Enable partial support for Dencun Execution Layer
  - Batch Poster Manager and Sequencer Inbox Finality Fix

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      values.scheduledTransactions.25:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.24:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.23:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000501f30810d2b0eaec15cc3785dbb29e4a8a92a7000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.22:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000874356173cfd6c739aeab1f5abfb5f3afb3d4d3300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.21:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000ce0af261eb511cb41b8d0a2e31df80ba37e265ab00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.20:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000076d8e97cd4514bebbc21d2044ff4a8d9ea1f0cc400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.19:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000047a85c0a118127f3968a6a1a61e2a326517540d400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.18:
+        {"id":"0x0b8dc4a8b99d2302c77e4eaeb1b06dd4038dd796bd8e5016dcb292018543ef91","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003e313eeed58e851ca3841c6109697b9eb35c772600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions.17:
+        {"id":"0xe4f81d02f2581e9b7a8815af6925d3c277859994fde496629554989b7c91d254","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000d9a2e0e5d7509f0bf1b2d33884f8c1b4d449087900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
    }
```

Generated with discovered.json: 0x8719a11829c6e6325ba2ef228b77a827c2cacf3a

# Diff at Fri, 02 Feb 2024 11:08:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d4d9bc19cc4a1e4baaadb947f4ad7e44e6c21ac9 block: 19119504
- current block number: 19140307

## Description

The nonce is now ignored. Start tracking the keySetUpdates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19119504 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
      values.keySetUpdates:
+        0
    }
```

```diff
    contract GnosisSafe (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
      name:
-        "GnosisSafe"
+        "ValidatorOwnerMultisig"
      derivedName:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x64a4811e26385036e4496726627304e6f3ddd353

# Diff at Tue, 30 Jan 2024 13:04:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@ceb6abb9c987b0d53dd547a79c3ebbf3480a024b block: 19069754
- current block number: 19119504

## Description

Add the SequencerInboxVersion handler.
ArbOS11 Upgrade.

## Watched changes

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
      values.wasmModuleRoot:
-        "0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3"
+        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19069754 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
      values.sequencerVersion:
+        "0x00"
    }
```

Generated with discovered.json: 0xe996eeb6cd08d695db9b13369e8aded556ec9bb2

# Diff at Tue, 23 Jan 2024 13:46:20 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 18691623
- current block number: 19069754

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract GnosisSafe (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
      values.getOwners.0:
-        "0x702105E66C468b5191553702cD6BF3D6Bbfa4C6b"
+        "0x375906ADFD34D93236084F462BB2dB0D92129Fe1"
      values.nonce:
-        170
+        179
    }
```

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      values.scheduledTransactions[16]:
+        {"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000005357f4d3e8f8250a77bcddd5e58886ad1358220c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[15]:
+        {"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000f6c7dc6eae78abf2f32df899654ca425dfa9948100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[14]:
+        {"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000054c2c372943572ac2a8e84d502ebc13f14b6224600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[13]:
+        {"id":"0xbcda99fe98a7c479aafb3eb3eab0f154f9fdd169f28c11adf6eefda3bef7c04e","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000003b70f2da6f3b01f9a53dcbcb3e59ad3ad8bed92400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18691623 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
      values.batchPosters:
+        ["0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D","0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc"]
    }
```

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
      values.validators:
+        ["0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4","0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78","0x610Aa279989F440820e14248BD3879B148717974","0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104","0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398","0x7CF3d537733F6Ba4183A833c9B021265716cE9d0","0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5","0xAB1A39332e934300eBCc57B5f95cA90631a347FF","0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0","0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5","0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E","0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b"]
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0ea6999172c1B4563695F76A52de73c848587b17) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3f92814930f43c6a1C6B133E5945E7B3338F33a6) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4561A4cDA2CB8a61ED023785bc1817fdf685dcb3) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x509E3CDc218d163DB9A03678107b72e00163b061) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78) {
    }
```

```diff
+   Status: CREATED
    contract Validator (0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x7CF3d537733F6Ba4183A833c9B021265716cE9d0) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xAb33350E0319466A81D2AE6DC5CdF2518123f766) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCcadc6B174BEcf31a35b818373e90391971a1C0c) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b) {
    }
```

# Diff at Fri, 24 Nov 2023 10:04:53 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@34d3533152f3f3d3d80344ca84d4d9a3744c3f17

## Description

New scheduled transaction - there is a DAC update about to be executed by the Upgrade Executer with a delay of 72 hours. It will call the perform() function of the AddNovaKeysetAction (0xDef5CfE3246882BC7f65F9346a8b974BA27D3F4E) contract to add a new keyset as valid batch submitter for Arbitrum Nova. That's related to Security Council's decision to remove Reddit from the Data Availability Committee (DAC) since they plan on winding down their Arbitrum Nova DAC infrastructure, and also remove Offchain Labs secondary key from the DAC.

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      values.scheduledTransactions[12]:
+        {"id":"0x492a8fccff029378b8566bdb6157123d1626cbfe2530a9b1f0ad5df688c10471","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000def5cfe3246882bc7f65f9346a8b974ba27d3f4e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}
    }
```

# Diff at Mon, 13 Nov 2023 15:23:11 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@a45348c9ae2e765b872be3f217168f73b62d35a6

## Description

Transactions were executed via L1ArbitrumTimelock to replace some of the Security Council members.

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
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      values.scheduledTransactions[11]:
+        {"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000add68bcb0f66878ab9d37a447c7b9067c5dfa94100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[10]:
+        {"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000c232ee726e3c51b86778bb4dbe61c52cc07a60f300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[9]:
+        {"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002841cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000423552c0f05baccac5bfa91c6dcf1dc53a0a164100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200}
      values.scheduledTransactions[8]:
+        {"id":"0x4de857395557aa68ca8e4ac5c12a0a8427b39b01c33e27882d473c25ed69cd93","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd0000000000000000000000009bf7b8884fa381a45f8cb2525905fb36c996297a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000204536d8944000000000000000000000000f06e95ef589d9c38af242a8aaee8375f14023f8500000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000003bd8e2ac65ad6f0f094ba6766cbd9484ab49ef23000000000000000000000000f8e1492255d9428c2fc20a98a1deb1215c8ffefd000000000000000000000000b07dc9103328a51128bc6cc1049d1137035f5e280000000000000000000000003e286452b1c66abb08eb5494c3894f40ab5a59af000000000000000000000000b71ca4ffbb7b58d75ba29891ab45e9dc12b444ed0000000000000000000000008f10e3413586c4a8dcfce19d009872b19e9cd8e3000000000000000000000000566a07c3c932ae6af74d77c29e5c30d8b18537100000000000000000000000005280406912eb8ec677df66c326be48f938dc2e440000000000000000000000000275b3d54a5ddbf8205a75984796efe8b7357bae0000000000000000000000005a1fd562271aac2dadb51baab7760b949d9d81df000000000000000000000000f6b6f07862a02c85628b3a9688beae07fea9c863000000000000000000000000475816ca2a31d601b4e336f5c2418a67978abf0900000000000000000000000000000000000000000000000000000000","delay":259200}
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
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

# Diff at Tue, 26 Sep 2023 07:54:37 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
      values.challenges:
+        []
    }
```

```diff
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
      derivedName:
+        "ChallengeManager"
    }
```

# Diff at Fri, 22 Sep 2023 09:02:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3a33c063dab8666dc32b4ec15a81995020325b49

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      values.scheduledTransactions:
+        [{"id":"0x85368b7ca2ee99b3d479ddff6298f69f0ce7d35227a731b70e8bc689074ba0af","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000006274106eedd4848371d2c09e0352d67b795ed51600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x6f801c57f0acf08c9688585c8b1cbb4b36f7053267befee7b2ee996b58592f2f","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000085792f6bf346e3bfd3a275318add2c44a105844700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000001015c1ae166c4c39d18a1151b7029bac1530c9aa00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x0a0e8ebc47cd2cc5c020dc6a52e1c0c349165c7133547d811956c973e6b03ee2","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x000000000000000000000000c4448b71118c9071bcb9734a0eac55d18a15394900000000000000000000000086a02dd71363c440b21f4c0e5b2ad01ffe1a748200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000022ec545357162c342f643bddb2ed4c3fb6b42eb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000007b1247f443359d1447cf25e73380bc9b99f2628f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","target":"0xa723C008e76E379c55599D2E4d93879BeaFDa79C","value":0,"data":"0x0000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":259200},{"id":"0x57ae5d951014e5b6dad9718af7c1b2fd41172f8957de355c15fbdd9a6e28395f","target":"0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","value":0,"data":"0x1cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c00000000000000000000000000000000000000000000000000000000","delay":259200}]
    }
```

# Diff at Thu, 21 Sep 2023 14:53:24 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@7579713bbe334d225f845fec749fd69636fe060a

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      upgradeability.implementation:
-        "0x962d70fc48F3465404bC77B03f104746B25a1d1b"
+        "0x61dC65001A8De4138DAD5167e43FF0FB0AB8D3B3"
    }
```
