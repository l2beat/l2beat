Generated with discovered.json: 0xe2d0389a305066196f1800063716aa9a764d054c

# Diff at Fri, 16 May 2025 14:39:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e002413ca40890ffd9150afa1422bcb6338725ba block: 22480258
- current block number: 22496279

## Description

abstract emergency upgrade via zk stack:

emergency upgrade did not change any contract source code, but included an unverified contract that helped change a single state var in the diamond during diamondCut
https://dashboard.tenderly.co/tx/0xcaefda7f4c6e29f90b34a0b68817feeb9fac3da2cb66538ea15fbeed434a7201/state-diff

which bumped the totalBatchesVerified from `16528` to `16529`

the validator then resumed [executing the unproven batch](https://app.blocksec.com/explorer/tx/eth/0x96ddbadf9200634d4b8151f0236d3ff2676e61c54bb9af78de4fbd32a8e3331b) and [proving](https://app.blocksec.com/explorer/tx/eth/0x70c0de3eb6aa60b538e5894e5d390d5bc73d6c14e59932e26cce85f9de142c5c)/[executing](https://app.blocksec.com/explorer/tx/eth/0x1fb7232e9a17cb396851dcb7f1a85411ad07e4032913906474036ef37c4476a9) subsequent batches

sub MS signer change.

## Watched changes

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.$pastUpgrades.5:
+        ["2025-05-16T12:59:47.000Z","0xcaefda7f4c6e29f90b34a0b68817feeb9fac3da2cb66538ea15fbeed434a7201",["0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4","0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4","0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f","0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"]]
      values.$upgradeCount:
-        5
+        6
    }
```

```diff
    contract Safe (0x58536761C97F5037931b56efeE922471add0eEe8) {
    +++ description: None
      values.$members.2:
+        "0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553"
      values.$members.1:
-        "0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553"
+        "0xbB943Cf3c5b90f2eD04F53658CCA49286601e808"
      values.$members.0:
-        "0xbB943Cf3c5b90f2eD04F53658CCA49286601e808"
+        "0xe2eB80C72Fa12Ba50B3bD6545709DC153D5b26D2"
      values.multisigThreshold:
-        "1 of 2 (50%)"
+        "1 of 3 (33%)"
    }
```

Generated with discovered.json: 0x144db679b1977ccd06a5afed570ace0a53bfc723

# Diff at Wed, 14 May 2025 08:36:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@03d2420745f9fd123e05c87dd48abe70f160c805 block: 22466280
- current block number: 22480258

## Description

v27 upgrade to standard contracts/verifiers.

## Watched changes

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.4:
-        "0xf3a1cb3dd9315b2dfa9e9aca6d6b09e987a1eb463588f115e2eb142eaa2a4ac6"
+        "0xb3038139dce45f6c1aaedbfb1b321c230301b2d004da109b39a17d827c6b0e4f"
      sourceHashes.3:
-        "0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f"
+        "0x1f9f7cd43747f5bcf879d544be0baca967245540e70592112cdc90c360f30486"
      sourceHashes.2:
-        "0x28719e86c8042765405cbb88205d1fb130f39f3bb0923afe7fef6dd5ef798c31"
+        "0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f"
      sourceHashes.1:
-        "0x396f0e8e4bc223f186f87b7eabf2f4b537ce84f8515aa16c86400c4f10af79b1"
+        "0xab7812fa82c483b781aee4c2339b860fcdee4033de1e243370a77a20fc353ddc"
      sourceHashes.0:
-        "0x8337740067b4f9278182a83ca83d62ca2611966b8beca6e0a49394204c8f74da"
+        "0xca793d2e01bb37722ba48f56662e8602e693d6808ed9587867c2bac43c3dec25"
      values.$implementation.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$implementation.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$implementation.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$implementation.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.4:
+        ["2025-03-25T22:04:47.000Z","0xe27e320246920e2b0a486e2f09ef847d15e79b1364930ba960f158fa8d05f9ca",["0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb","0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1","0x36b026c39125964D99596CE302866B5A59E4dE27","0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"]]
      values.$pastUpgrades.3.2.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.3.2.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.3.2.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.3.2.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.3.1:
-        "0xe27e320246920e2b0a486e2f09ef847d15e79b1364930ba960f158fa8d05f9ca"
+        "0xc63fb7bdd8acc5852d262a14f0630fbf0a1a00b48890f389adad34ced6bfd241"
      values.$pastUpgrades.3.0:
-        "2025-03-25T22:04:47.000Z"
+        "2025-05-12T19:40:11.000Z"
      values.$upgradeCount:
-        4
+        5
      values.facetAddresses.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.facetAddresses.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.facetAddresses.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.facetAddresses.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.facets.0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x36b026c39125964D99596CE302866B5A59E4dE27:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.getL2BootloaderBytecodeHash:
-        "0x0100088580465d88420e6369230ee94a32ff356dbcdd407a4be49fc8009b2a81"
+        "0x0100087fe7df1cf5616646f85bd5eebc8efe5d8deac4d85bea9b9aefd88803dd"
      values.getL2DefaultAccountBytecodeHash:
-        "0x010004dbf8be36c421254d005352f8245146906919be0099e8a50d0e78df85e0"
+        "0x0100050bf9baf9d08e5d3c037f8d8b486076de7e6dceb3f3fc0989ea2c99cd67"
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        111669149696
+        115964116992
      values.getSemverProtocolVersion.0:
-        26
+        27
      values.getVerifier:
-        "0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5"
+        "0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
      values.getL2EvmEmulatorBytecodeHash:
+        "0x01000bbb8116fe7bdf690c19740ea350375426cec23f4f1f69a12fdc58adc9ba"
      implementationNames.0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb:
-        "AdminFacet"
      implementationNames.0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1:
-        "GettersFacet"
      implementationNames.0x36b026c39125964D99596CE302866B5A59E4dE27:
-        "MailboxFacet"
      implementationNames.0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800:
-        "ExecutorFacet"
      implementationNames.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
+        "AdminFacet"
      implementationNames.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
+        "GettersFacet"
      implementationNames.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
+        "MailboxFacet"
      implementationNames.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
+        "ExecutorFacet"
    }
```

```diff
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.2:
+        {"_protocolVersion":107374182400,"_upgradeTimestamp":1736866800}
      values.upgradeTimestamps.1._protocolVersion:
-        107374182400
+        115964116992
      values.upgradeTimestamps.1._upgradeTimestamp:
-        1736866800
+        1747029600
    }
```

```diff
-   Status: DELETED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```

```diff
+   Status: CREATED
    contract DualVerifier (0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0)
    +++ description: A router contract for verifiers. Routes verification requests to 0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or 0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

## Source code changes

```diff
.../AbstractZkEvm/AdminFacet.1.sol                 |   37 +-
 .../AbstractZkEvm/ExecutorFacet.4.sol              |   82 +-
 .../AbstractZkEvm/GettersFacet.2.sol               |   27 +-
 .../AbstractZkEvm/MailboxFacet.3.sol               |   74 +-
 .../abstract/ethereum/.flat/DualVerifier.sol       |   97 ++
 .../abstract/ethereum/.flat/L1VerifierFflonk.sol   | 1605 ++++++++++++++++++++
 .../Verifier.sol => .flat/L1VerifierPlonk.sol}     |   12 +-
 7 files changed, 1885 insertions(+), 49 deletions(-)
```

Generated with discovered.json: 0xc71a501d48f53213c790a3384e7b43fa16bf7ecd

# Diff at Mon, 12 May 2025 09:21:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43865580b95b7ff3abb4f43944aed50cc5d69ee3 block: 22367139
- current block number: 22466280

## Description

Abtract sub-MS member changes.

## Watched changes

```diff
    contract Safe (0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB) {
    +++ description: None
      values.$members.3:
+        "0x3846c3A30E62075Fa916216b35EF04B8F53931f6"
      values.$members.2:
-        "0x3846c3A30E62075Fa916216b35EF04B8F53931f6"
+        "0x277D26a45Add5775F21256159F089769892CEa5B"
      values.$threshold:
-        1
+        2
      values.multisigThreshold:
-        "1 of 3 (33%)"
+        "2 of 4 (50%)"
    }
```

```diff
    contract Safe (0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892) {
    +++ description: None
      values.$members.1:
+        "0x438Df339934B6Fb9dA8E0DC6f0Ba0bca22B8A7b5"
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "1 of 2 (50%)"
    }
```

Generated with discovered.json: 0x48f0bb29b3e1b19d5a722d7cf4d8f7bb626c0461

# Diff at Tue, 29 Apr 2025 08:19:17 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22367139
- current block number: 22367139

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22367139 (main branch discovery), not current.

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","via":[{"address":"0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"}]},{"permission":"interact","to":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]}]
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0x11805594be0229EF08429D775AF0c55f7c4535dE","via":[]},{"permission":"validateZkStack","to":"0x54aB716D465be3D5EEca64E63ac0048D7a81659a","via":[]}]
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0x11805594be0229EF08429D775AF0c55f7c4535dE","via":[]},{"permission":"validateZkStack","to":"0x54aB716D465be3D5EEca64E63ac0048D7a81659a","via":[]}]
    }
```

Generated with discovered.json: 0xcc6496972856f452c631e6878547c31ddb5da86f

# Diff at Mon, 28 Apr 2025 11:05:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 22243944
- current block number: 22367139

## Description

MS signer change.

## Watched changes

```diff
    contract Safe (0x58536761C97F5037931b56efeE922471add0eEe8) {
    +++ description: None
      values.$members.1:
+        "0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553"
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "1 of 2 (50%)"
    }
```

```diff
    contract Abstract Multisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063) {
    +++ description: None
      values.$members.11:
-        "0x1CdfBDED92D46261837827607e674110Ca5a0575"
      values.$members.10:
-        "0xFC84E99984A3526dea97c408f5991A5E099f3Da2"
      values.$members.9:
-        "0x57533344e91d29f927AAEBee364A33633Bd205Ab"
      values.$members.8:
-        "0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892"
      values.$members.7:
-        "0x58536761C97F5037931b56efeE922471add0eEe8"
+        "0x1CdfBDED92D46261837827607e674110Ca5a0575"
      values.$members.6:
-        "0xB9f0C247cF1aB4a7F36974CB0A64244Ed4D017FE"
+        "0xFC84E99984A3526dea97c408f5991A5E099f3Da2"
      values.$members.5:
-        "0x325407EEC948b97429068AF0cd8A8D95F06315a4"
+        "0x57533344e91d29f927AAEBee364A33633Bd205Ab"
      values.$members.4:
-        "0xe7ea5B62F939611D11C0Ce7606B001207870C704"
+        "0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892"
      values.$members.3:
-        "0x80B9ee57A93d7Ff0B588682d3df0713489dC1b74"
+        "0x58536761C97F5037931b56efeE922471add0eEe8"
      values.$members.2:
-        "0x77D1124E9061d238430Df3F4311111BDf69a4CFA"
+        "0x325407EEC948b97429068AF0cd8A8D95F06315a4"
      values.$members.1:
-        "0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB"
+        "0x77D1124E9061d238430Df3F4311111BDf69a4CFA"
      values.$members.0:
-        "0x41c1d613dbE28dAab73b7Dc0003Da124924a56f0"
+        "0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 8 (50%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243944 (main branch discovery), not current.

```diff
    contract Abstract Multisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063) {
    +++ description: None
      name:
-        "AbstractChainAdminMultisig"
+        "Abstract Multisig"
    }
```

Generated with discovered.json: 0x3aac8b1b25ca713cdd09e03811d1bda4eb47516b

# Diff at Fri, 11 Apr 2025 06:36:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 22181510
- current block number: 22243944

## Description

MS signer change.

## Watched changes

```diff
    contract AbstractChainAdminMultisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063) {
    +++ description: None
      values.$members.11:
+        "0x1CdfBDED92D46261837827607e674110Ca5a0575"
      values.$members.10:
+        "0xFC84E99984A3526dea97c408f5991A5E099f3Da2"
      values.$members.9:
+        "0x57533344e91d29f927AAEBee364A33633Bd205Ab"
      values.$members.8:
+        "0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892"
      values.$members.7:
+        "0x58536761C97F5037931b56efeE922471add0eEe8"
      values.$members.6:
+        "0xB9f0C247cF1aB4a7F36974CB0A64244Ed4D017FE"
      values.$members.5:
+        "0x325407EEC948b97429068AF0cd8A8D95F06315a4"
      values.$members.4:
+        "0xe7ea5B62F939611D11C0Ce7606B001207870C704"
      values.$members.3:
-        "0xB9f0C247cF1aB4a7F36974CB0A64244Ed4D017FE"
+        "0x80B9ee57A93d7Ff0B588682d3df0713489dC1b74"
      values.$members.2:
-        "0xe7ea5B62F939611D11C0Ce7606B001207870C704"
+        "0x77D1124E9061d238430Df3F4311111BDf69a4CFA"
      values.$members.1:
-        "0x80B9ee57A93d7Ff0B588682d3df0713489dC1b74"
+        "0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB"
      values.$threshold:
-        2
+        4
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "4 of 12 (33%)"
    }
```

```diff
+   Status: CREATED
    contract Safe (0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x325407EEC948b97429068AF0cd8A8D95F06315a4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x57533344e91d29f927AAEBee364A33633Bd205Ab)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x58536761C97F5037931b56efeE922471add0eEe8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892)
    +++ description: None
```

## Source code changes

```diff
.../Safe.sol                                       |    0
 .../SafeProxy.p.sol                                |    0
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 12 files changed, 5625 insertions(+)
```

Generated with discovered.json: 0xc50137333d1456b4d679eb6cfabd17ad44785c4d

# Diff at Thu, 10 Apr 2025 14:42:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22181510
- current block number: 22181510

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22181510 (main branch discovery), not current.

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

Generated with discovered.json: 0xeb269644e590ca70111d77cb4c69a7f2643c89b3

# Diff at Wed, 02 Apr 2025 15:08:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6d66206526294fb00e0c08e8ff3bf70febdc1aaa block: 22144881
- current block number: 22181510

## Description

shared zk stack contracts upgraded to v26: config related changes for all children chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22144881 (main branch discovery), not current.

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      template:
-        "shared-zk-stack/Diamond_v26"
+        "shared-zk-stack/v26/Diamond"
      issuedPermissions.1.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+++ description: true means that the DA mode cannot be changed to Validium in the future. compliant DAValidator pairs for the permanent rollup mode are defined/enforced by the RollupDAManager contract.
+++ severity: HIGH
      values.isPermanentRollup:
+        0
      values.isPermanentRollupString:
+        "."
      fieldMeta.IsPorterAvailableStatus:
+        {"severity":"HIGH","description":"zkPorter is a volition-like contruction and changes the zk proof input requirements."}
      fieldMeta.isPermanentRollup:
+        {"severity":"HIGH","description":"true means that the DA mode cannot be changed to Validium in the future. compliant DAValidator pairs for the permanent rollup mode are defined/enforced by the RollupDAManager contract."}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":".","1":". isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future."}}]
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      category.name:
-        "Shared Infrastructure"
+        "Spam"
      category.priority:
-        4
+        -1
    }
```

```diff
    contract AbstractChainAdminMultisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063) {
    +++ description: None
      receivedPermissions.0.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

```diff
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
      directlyReceivedPermissions.0.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

Generated with discovered.json: 0xeef165374050cf21a75dbfe9fd523ad139cb7adb

# Diff at Fri, 28 Mar 2025 10:44:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@279f845afa28d7cd0a0fe99f5744c0fe98cd5c86 block: 22022295
- current block number: 22144881

## Description

v26 upgrade.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: Implements the ZK proof verification logic.
```

```diff
    contract undefined (0x11805594be0229EF08429D775AF0c55f7c4535dE) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"}
    }
```

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      template:
-        "shared-zk-stack/Diamond"
+        "shared-zk-stack/Diamond_v26"
      sourceHashes.4:
-        "0xdf47c6cd4fcffcfa4a670e1544e2391acc365cd7fd9b8e7583d58b28dff50c40"
+        "0xf3a1cb3dd9315b2dfa9e9aca6d6b09e987a1eb463588f115e2eb142eaa2a4ac6"
      sourceHashes.3:
-        "0x91db58e4059dfed7357e56dac17d2963c6f9cfb540f527988ed25172251a2584"
+        "0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f"
      sourceHashes.2:
-        "0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f"
+        "0x28719e86c8042765405cbb88205d1fb130f39f3bb0923afe7fef6dd5ef798c31"
      sourceHashes.1:
-        "0x981d4f2ae5949ab33c6ba83f6446595d3b853bf6f7157884304445d70b185374"
+        "0x396f0e8e4bc223f186f87b7eabf2f4b537ce84f8515aa16c86400c4f10af79b1"
      sourceHashes.0:
-        "0x081a1805983e86cd6a80ed48c012c26bf9a39473c0f1e69b357afff240f027a0"
+        "0x8337740067b4f9278182a83ca83d62ca2611966b8beca6e0a49394204c8f74da"
      description:
-        "The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions."
+        "The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions."
      issuedPermissions.2:
+        {"permission":"interact","to":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]}
      values.$implementation.3:
-        "0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
+        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
      values.$implementation.2:
-        "0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
+        "0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.$implementation.1:
-        "0x5575218cECd370E1d630d1AdB03c254B0B376821"
+        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.$implementation.0:
-        "0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
+        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.$pastUpgrades.3:
+        ["2025-03-25T22:04:47.000Z","0xe27e320246920e2b0a486e2f09ef847d15e79b1364930ba960f158fa8d05f9ca",["0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb","0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1","0x36b026c39125964D99596CE302866B5A59E4dE27","0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"]]
      values.$upgradeCount:
-        3
+        4
      values.daMode:
-        0
      values.facetAddresses.3:
-        "0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
+        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
      values.facetAddresses.2:
-        "0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
+        "0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.facetAddresses.1:
-        "0x5575218cECd370E1d630d1AdB03c254B0B376821"
+        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.facetAddresses.0:
-        "0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
+        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.facets.0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a:
-        ["acceptAdmin()","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","freezeDiamond()","setPendingAdmin(address)","setPorterAvailability(bool)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)","setTokenMultiplier(uint128,uint128)","setTransactionFilterer(address)","setValidator(address,bool)","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))"]
      values.facets.0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9:
-        ["baseTokenGasPriceMultiplierDenominator()","baseTokenGasPriceMultiplierNominator()","facetAddress(bytes4)","facetAddresses()","facetFunctionSelectors(address)","facets()","getAdmin()","getBaseToken()","getBaseTokenBridge()","getBridgehub()","getFirstUnprocessedPriorityTx()","getL2BootloaderBytecodeHash()","getL2DefaultAccountBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","getL2SystemContractsUpgradeBlockNumber()","getL2SystemContractsUpgradeTxHash()","getPendingAdmin()","getPriorityQueueSize()","getPriorityTxMaxGasLimit()","getProtocolVersion()","getPubdataPricingMode()","getSemverProtocolVersion()","getStateTransitionManager()","getTotalBatchesCommitted()","getTotalBatchesExecuted()","getTotalBatchesVerified()","getTotalBlocksCommitted()","getTotalBlocksExecuted()","getTotalBlocksVerified()","getTotalPriorityTxs()","getVerifier()","getVerifierParams()","isDiamondStorageFrozen()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","isFunctionFreezable(bytes4)","isValidator(address)","l2LogsRootHash(uint256)","priorityQueueFrontOperation()","storedBatchHash(uint256)","storedBlockHash(uint256)"]
      values.facets.0x5575218cECd370E1d630d1AdB03c254B0B376821:
-        ["bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","transferEthToSharedBridge()"]
      values.facets.0xBB13642F795014E0EAC2b0d52ECD5162ECb66712:
-        ["commitBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","commitBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","executeBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","executeBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","proveBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","proveBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","revertBatches(uint256)","revertBatchesSharedBridge(uint256,uint256)"]
      values.facets.0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x36b026c39125964D99596CE302866B5A59E4dE27:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.getBaseTokenBridge:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      values.getL2BootloaderBytecodeHash:
-        "0x010008c3be57ae5800e077b6c2056d9d75ad1a7b4f0ce583407961cc6fe0b678"
+        "0x0100088580465d88420e6369230ee94a32ff356dbcdd407a4be49fc8009b2a81"
      values.getL2DefaultAccountBytecodeHash:
-        "0x0100055dba11508480be023137563caec69debc85f826cb3a4b68246a7cabe30"
+        "0x010004dbf8be36c421254d005352f8245146906919be0099e8a50d0e78df85e0"
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        107374182400
+        111669149696
      values.getSemverProtocolVersion.0:
-        25
+        26
      values.getStateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.getVerifier:
-        "0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66"
+        "0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5"
      values.txFilterer:
-        []
      values.validators.1:
+        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      values.getBaseTokenAssetId:
+        "0x05e1c3ae4b9732444ae25217ac7666e46fa365fee1768de00c9fcb65532b7609"
      values.getChainId:
+        2741
      values.getChainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+++ severity: HIGH
      values.getDAValidatorPair:
+        ["0x72213dfe8CA61B0A782970dCFebFb877778f9119","0xfa96A3Da88f201433911bEFf3Ecc434CB1222731"]
      values.getSettlementLayer:
+        "0x0000000000000000000000000000000000000000"
+++ description: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2.
+++ severity: HIGH
      values.getTransactionFilterer:
+        "0x0000000000000000000000000000000000000000"
      values.isPriorityQueueActive:
+        false
      fieldMeta.txFilterer:
-        {"severity":"HIGH","description":"This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."}
      fieldMeta.getProtocolVersion.severity:
-        "MEDIUM"
+        "HIGH"
      fieldMeta.getAdmin:
+        {"severity":"HIGH"}
      fieldMeta.getTransactionFilterer:
+        {"severity":"HIGH","description":"This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."}
      fieldMeta.getDAValidatorPair:
+        {"severity":"HIGH"}
      fieldMeta.getPendingAdmin:
+        {"severity":"HIGH"}
      fieldMeta.getPubdataPricingMode:
+        {"severity":"HIGH","description":"0 - Rollup, 1 - Validium"}
    }
```

```diff
    contract undefined (0x54aB716D465be3D5EEca64E63ac0048D7a81659a) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"}
    }
```

```diff
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.1:
+        {"_protocolVersion":107374182400,"_upgradeTimestamp":1736866800}
      values.upgradeTimestamps.0._protocolVersion:
-        107374182400
+        111669149696
      values.upgradeTimestamps.0._upgradeTimestamp:
-        1736866800
+        1742454000
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```

## Source code changes

```diff
.../AbstractZkEvm/AdminFacet.1.sol                 | 1442 ++++++++++++-
 .../AbstractZkEvm/ExecutorFacet.4.sol              | 2016 ++++++++++++++----
 .../AbstractZkEvm/GettersFacet.2.sol               | 1153 +++++++++-
 .../AbstractZkEvm/MailboxFacet.3.sol               | 2195 ++++++++++++++------
 .../abstract/ethereum/.flat/ValidatorTimelock.sol  |  504 +++++
 .../{.flat@22022295 => .flat}/Verifier.sol         |   41 +-
 6 files changed, 6181 insertions(+), 1170 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22022295 (main branch discovery), not current.

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      name:
-        "ValidatorTimelock"
+        "ValidatorTimelock2"
    }
```

Generated with discovered.json: 0x71caa3ef1c641deb6530e0b1af7132e4fefc7167

# Diff at Tue, 11 Mar 2025 08:00:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 21916825
- current block number: 22022295

## Description

ValidatorTimelock governance transfer for ZIP 5.

## Watched changes

```diff
-   Status: DELETED
    contract undefined (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: None
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      values.owner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
-   Status: DELETED
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897)
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
```

```diff
-   Status: DELETED
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D)
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
```

```diff
-   Status: DELETED
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888)
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
```

```diff
-   Status: DELETED
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29)
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
```

## Source code changes

```diff
.../EmergencyUpgradeBoard.sol => /dev/null         | 1233 -----------------
 .../.flat@21916825/Guardians.sol => /dev/null      | 1439 --------------------
 .../ProtocolUpgradeHandler.sol => /dev/null        |  605 --------
 .../SecurityCouncil.sol => /dev/null               | 1389 -------------------
 4 files changed, 4666 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916825 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract undefined (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897)
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D)
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
```

```diff
+   Status: CREATED
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888)
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
```

```diff
+   Status: CREATED
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29)
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
```

Generated with discovered.json: 0x6c85adabf4b3c15a547b4f4ab8bc9502120b10eb

# Diff at Tue, 04 Mar 2025 10:38:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21916825
- current block number: 21916825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916825 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      sinceBlock:
+        21081436
    }
```

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sinceBlock:
+        21027786
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      sinceBlock:
+        20019826
    }
```

```diff
    contract AbstractChainAdminMultisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063) {
    +++ description: None
      sinceBlock:
+        21036380
    }
```

```diff
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
      sinceBlock:
+        20978253
    }
```

Generated with discovered.json: 0xdb7cc6850350590965bcde75c50fbebbf5702fc4

# Diff at Wed, 26 Feb 2025 10:31:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21916825
- current block number: 21916825

## Description

config related: added categories for zk stack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916825 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0x9a6f831ae3123d5ecdb31f15fe417f81d204c7c3

# Diff at Tue, 04 Feb 2025 12:30:43 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766582
- current block number: 21766582

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766582 (main branch discovery), not current.

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AbstractChainAdminMultisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x674c6922ca8e75284a49d609c7a653e7fd981967

# Diff at Mon, 03 Feb 2025 14:33:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21721728
- current block number: 21766582

## Description

[ZIP-002] 'Reduce the execution delay from 21 hours to 3 hours' executed.

## Watched changes

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      description:
-        "Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h."
+        "Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h."
      values.executionDelay:
-        75600
+        10800
      values.executionDelay_fmt:
-        "21h"
+        "3h"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21721728 (main branch discovery), not current.

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.priorityQueueFrontOperation:
-        {"canonicalTxHash":"0x2fd072c69ab58c22ba7eb15cfd5ffa2ac2254fb0d049d065ad3bad87f16948f2","expirationTimestamp":1737973871,"layer2Tip":0}
    }
```

Generated with discovered.json: 0x462241a0f97be04c623bbc09f1d40025f82626b6

# Diff at Tue, 28 Jan 2025 08:21:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21721728

## Description

Initial discovery: ZK stack rollup on known protocol version 25 (latest) contracts with ETH as gasToken. TxFilterer not deployed.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: Implements the ZK proof verification logic.
```

```diff
+   Status: CREATED
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9)
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h.
```

```diff
+   Status: CREATED
    contract AbstractChainAdminMultisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661)
    +++ description: None
```
