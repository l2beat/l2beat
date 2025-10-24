Generated with discovered.json: 0x8930130052b1a64ae22e3c9fbe44ec2ecdf00100

# Diff at Fri, 24 Oct 2025 09:13:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@11b074f59e0a769fa3d144569b93ef0f7ba1e44f block: 1753944354
- current timestamp: 1753944354

## Description

Config: add da vali comment.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753944354 (main branch discovery), not current.

```diff
    contract TreasureChainAdminMultisig (eth:0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      receivedPermissions.0.description:
-        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+        "administrate operator roles for this chain in the ValidatorTimelock, manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

```diff
    contract TreasureZkEvm (eth:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      fieldMeta.getDAValidatorPair.description:
+        "l1da, l2da"
    }
```

```diff
    contract TreasureZkEvmAdmin (eth:0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: A governance proxy that lets eth:0x282370D1e925ee897CB29Cb3beC13aAe0743067C act through it.
      directlyReceivedPermissions.0.description:
-        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+        "administrate operator roles for this chain in the ValidatorTimelock, manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
      description:
+        "A governance proxy that lets eth:0x282370D1e925ee897CB29Cb3beC13aAe0743067C act through it."
    }
```

Generated with discovered.json: 0x38bf125c86feb7160211b50edf29725fe853cd4a

# Diff at Wed, 03 Sep 2025 15:51:41 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1753944354
- current timestamp: 1753944354

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753944354 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference BridgeHub (eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: None
```

```diff
+   Status: CREATED
    reference ChainTypeManager (eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C)
    +++ description: None
```

```diff
+   Status: CREATED
    reference ProtocolUpgradeHandler (eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3)
    +++ description: None
```

Generated with discovered.json: 0x48fe38d92444ca9a46504266ec390e21aa483a5d

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x7f665885c1c5e439a744732b5d4f23b6db63f041

# Diff at Mon, 14 Jul 2025 12:47:17 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22593197
- current block number: 22593197

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593197 (main branch discovery), not current.

```diff
    EOA  (0x18c16E72CAa10D2Ce13E4b61bfC51AB93B7e92f0) {
    +++ description: None
      address:
-        "0x18c16E72CAa10D2Ce13E4b61bfC51AB93B7e92f0"
+        "eth:0x18c16E72CAa10D2Ce13E4b61bfC51AB93B7e92f0"
    }
```

```diff
    EOA  (0x1c68007a9A7E5Adc862da9b54938112352B97f17) {
    +++ description: None
      address:
-        "0x1c68007a9A7E5Adc862da9b54938112352B97f17"
+        "eth:0x1c68007a9A7E5Adc862da9b54938112352B97f17"
    }
```

```diff
    EOA  (0x1ee4324F7BD44A4c7c335C2D4e758639B60E8726) {
    +++ description: None
      address:
-        "0x1ee4324F7BD44A4c7c335C2D4e758639B60E8726"
+        "eth:0x1ee4324F7BD44A4c7c335C2D4e758639B60E8726"
    }
```

```diff
    EOA  (0x2572835e02b59078711aa0800490e80975e4169d) {
    +++ description: None
      address:
-        "0x2572835e02b59078711aa0800490e80975e4169d"
+        "eth:0x2572835e02b59078711aa0800490e80975e4169d"
    }
```

```diff
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      address:
-        "0x282370D1e925ee897CB29Cb3beC13aAe0743067C"
+        "eth:0x282370D1e925ee897CB29Cb3beC13aAe0743067C"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x1c68007a9A7E5Adc862da9b54938112352B97f17"
+        "eth:0x1c68007a9A7E5Adc862da9b54938112352B97f17"
      values.$members.1:
-        "0xBAe65c4bA62799F68817Cbb2bB353Da4572C23Ae"
+        "eth:0xBAe65c4bA62799F68817Cbb2bB353Da4572C23Ae"
      values.$members.2:
-        "0x1ee4324F7BD44A4c7c335C2D4e758639B60E8726"
+        "eth:0x1ee4324F7BD44A4c7c335C2D4e758639B60E8726"
      values.$members.3:
-        "0x58244EA236D2ff57c023A4028E228f77dc328894"
+        "eth:0x58244EA236D2ff57c023A4028E228f77dc328894"
      values.$members.4:
-        "0x18c16E72CAa10D2Ce13E4b61bfC51AB93B7e92f0"
+        "eth:0x18c16E72CAa10D2Ce13E4b61bfC51AB93B7e92f0"
      implementationNames.0x282370D1e925ee897CB29Cb3beC13aAe0743067C:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x282370D1e925ee897CB29Cb3beC13aAe0743067C:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283) {
    +++ description: None
      address:
-        "0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"
+        "eth:0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"
    }
```

```diff
    EOA  (0x58244EA236D2ff57c023A4028E228f77dc328894) {
    +++ description: None
      address:
-        "0x58244EA236D2ff57c023A4028E228f77dc328894"
+        "eth:0x58244EA236D2ff57c023A4028E228f77dc328894"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      address:
-        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.validatorsVTL.0:
-        "0x2572835e02b59078711aa0800490e80975e4169d"
+        "eth:0x2572835e02b59078711aa0800490e80975e4169d"
      values.validatorsVTL.1:
-        "0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"
+        "eth:0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"
      implementationNames.0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E:
-        "ValidatorTimelock"
      implementationNames.eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E:
+        "ValidatorTimelock"
    }
```

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      address:
-        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
+        "eth:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
      values.$implementation.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "eth:0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.$implementation.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "eth:0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.$implementation.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "eth:0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.$implementation.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "eth:0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
      values.$pastUpgrades.0.2.0:
-        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
+        "eth:0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
      values.$pastUpgrades.0.2.1:
-        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
+        "eth:0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
      values.$pastUpgrades.0.2.2:
-        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
+        "eth:0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
      values.$pastUpgrades.0.2.3:
-        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
+        "eth:0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
      values.$pastUpgrades.1.2.0:
-        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
+        "eth:0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
      values.$pastUpgrades.1.2.1:
-        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
+        "eth:0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
      values.$pastUpgrades.1.2.2:
-        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
+        "eth:0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
      values.$pastUpgrades.1.2.3:
-        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
+        "eth:0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
      values.$pastUpgrades.2.2.0:
-        "0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
+        "eth:0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
      values.$pastUpgrades.2.2.1:
-        "0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
+        "eth:0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
      values.$pastUpgrades.2.2.2:
-        "0x5575218cECd370E1d630d1AdB03c254B0B376821"
+        "eth:0x5575218cECd370E1d630d1AdB03c254B0B376821"
      values.$pastUpgrades.2.2.3:
-        "0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
+        "eth:0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
      values.$pastUpgrades.3.2.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "eth:0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.$pastUpgrades.3.2.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "eth:0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.$pastUpgrades.3.2.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "eth:0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.$pastUpgrades.3.2.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "eth:0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
      values.facetAddresses.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "eth:0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.facetAddresses.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "eth:0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.facetAddresses.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "eth:0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.facetAddresses.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "eth:0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
      values.facets.0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x36b026c39125964D99596CE302866B5A59E4dE27:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.eth:0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.eth:0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.eth:0x36b026c39125964D99596CE302866B5A59E4dE27:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.eth:0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
+++ severity: HIGH
      values.getAdmin:
-        "0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
+        "eth:0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
      values.getBaseToken:
-        "0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A"
+        "eth:0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A"
      values.getBridgehub:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.getChainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+++ severity: HIGH
      values.getDAValidatorPair.0:
-        "0x907b30407249949521Bf0c89A43558dae200146A"
+        "eth:0x907b30407249949521Bf0c89A43558dae200146A"
+++ severity: HIGH
      values.getDAValidatorPair.1:
-        "0xFa30EAe30351A83809657299F6Cad9557c232e8C"
+        "eth:0xFa30EAe30351A83809657299F6Cad9557c232e8C"
+++ severity: HIGH
      values.getPendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getSettlementLayer:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2.
+++ severity: HIGH
      values.getTransactionFilterer:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getVerifier:
-        "0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5"
+        "eth:0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5"
      values.validators.0:
-        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      values.validators.1:
-        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      implementationNames.0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879:
-        "DiamondProxy"
      implementationNames.0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb:
-        "AdminFacet"
      implementationNames.0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1:
-        "GettersFacet"
      implementationNames.0x36b026c39125964D99596CE302866B5A59E4dE27:
-        "MailboxFacet"
      implementationNames.0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800:
-        "ExecutorFacet"
      implementationNames.eth:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879:
+        "DiamondProxy"
      implementationNames.eth:0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb:
+        "AdminFacet"
      implementationNames.eth:0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1:
+        "GettersFacet"
      implementationNames.eth:0x36b026c39125964D99596CE302866B5A59E4dE27:
+        "MailboxFacet"
      implementationNames.eth:0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800:
+        "ExecutorFacet"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      address:
-        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      values.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validatorsVTL.0:
-        "0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"
+        "eth:0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"
      values.validatorsVTL.1:
-        "0x2572835e02b59078711aa0800490e80975e4169d"
+        "eth:0x2572835e02b59078711aa0800490e80975e4169d"
      implementationNames.0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
-        "ValidatorTimelock"
      implementationNames.eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
+        "ValidatorTimelock"
    }
```

```diff
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A) {
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
      address:
-        "0x907b30407249949521Bf0c89A43558dae200146A"
+        "eth:0x907b30407249949521Bf0c89A43558dae200146A"
      implementationNames.0x907b30407249949521Bf0c89A43558dae200146A:
-        "ValidiumL1DAValidator"
      implementationNames.eth:0x907b30407249949521Bf0c89A43558dae200146A:
+        "ValidiumL1DAValidator"
    }
```

```diff
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
      address:
-        "0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
+        "eth:0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
      values.owner:
-        "0x282370D1e925ee897CB29Cb3beC13aAe0743067C"
+        "eth:0x282370D1e925ee897CB29Cb3beC13aAe0743067C"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.tokenMultiplierSetter:
-        "0xdd2B80c477CF2f660A1Eda0FeCBD0291caE43216"
+        "eth:0xdd2B80c477CF2f660A1Eda0FeCBD0291caE43216"
      implementationNames.0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871:
-        "ChainAdmin"
      implementationNames.eth:0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871:
+        "ChainAdmin"
    }
```

```diff
    EOA  (0xBAe65c4bA62799F68817Cbb2bB353Da4572C23Ae) {
    +++ description: None
      address:
-        "0xBAe65c4bA62799F68817Cbb2bB353Da4572C23Ae"
+        "eth:0xBAe65c4bA62799F68817Cbb2bB353Da4572C23Ae"
    }
```

```diff
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5) {
    +++ description: Implements the ZK proof verification logic.
      address:
-        "0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5"
+        "eth:0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5"
      implementationNames.0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5:
-        "Verifier"
      implementationNames.eth:0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5:
+        "Verifier"
    }
```

```diff
    EOA  (0xdd2B80c477CF2f660A1Eda0FeCBD0291caE43216) {
    +++ description: None
      address:
-        "0xdd2B80c477CF2f660A1Eda0FeCBD0291caE43216"
+        "eth:0xdd2B80c477CF2f660A1Eda0FeCBD0291caE43216"
    }
```

```diff
    EOA  (0xFa30EAe30351A83809657299F6Cad9557c232e8C) {
    +++ description: None
      address:
-        "0xFa30EAe30351A83809657299F6Cad9557c232e8C"
+        "eth:0xFa30EAe30351A83809657299F6Cad9557c232e8C"
    }
```

```diff
+   Status: CREATED
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

```diff
+   Status: CREATED
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```

Generated with discovered.json: 0x52d4695a9dbd75436b56fab6bdab08554807254f

# Diff at Fri, 04 Jul 2025 12:19:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22593197
- current block number: 22593197

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593197 (main branch discovery), not current.

```diff
    EOA  (0x2572835e02b59078711aa0800490e80975e4169d) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      receivedPermissions.1.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
+        "eth:0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
      receivedPermissions.0.from:
-        "ethereum:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
+        "eth:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
+        "eth:0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
    }
```

```diff
    EOA  (0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      receivedPermissions.1.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
+        "eth:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
+        "eth:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
    }
```

```diff
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
+        "eth:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
    }
```

```diff
    EOA  (0xdd2B80c477CF2f660A1Eda0FeCBD0291caE43216) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
+        "eth:0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
    }
```

Generated with discovered.json: 0x92ec27d55583885ea4e74b2f297d81bb46cee59f

# Diff at Thu, 03 Jul 2025 10:57:05 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fa3b82adfb9dedeb2acea8fde7b79e65d59fb2b6 block: 22593197
- current block number: 22593197

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593197 (main branch discovery), not current.

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

Generated with discovered.json: 0x3f482d93f07132a52aebd9c106b011c6cbe37a9f

# Diff at Wed, 25 Jun 2025 07:17:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22593197
- current block number: 22593197

## Description

Config: rename, tidy template folders. unhide the L1NativeTokenVault.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593197 (main branch discovery), not current.

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      template:
-        "shared-zk-stack/v26/Diamond"
+        "shared-zk-stack/Diamond"
    }
```

```diff
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A) {
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
      template:
-        "shared-zk-stack/v26/ValidiumL1DAValidator"
+        "shared-zk-stack/ValidiumL1DAValidator"
    }
```

```diff
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5) {
    +++ description: Implements the ZK proof verification logic.
      template:
-        "shared-zk-stack/Verifier"
+        "shared-zk-stack/old/Verifier"
    }
```

Generated with discovered.json: 0xfceecf6ccd5affa2ee8310a49cdcb06a02648dc8

# Diff at Tue, 27 May 2025 08:30:47 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22181511
- current block number: 22181511

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22181511 (main branch discovery), not current.

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.4:
-        "0xf3a1cb3dd9315b2dfa9e9aca6d6b09e987a1eb463588f115e2eb142eaa2a4ac6"
      sourceHashes.3:
-        "0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f"
      sourceHashes.2:
-        "0x28719e86c8042765405cbb88205d1fb130f39f3bb0923afe7fef6dd5ef798c31"
      sourceHashes.1:
-        "0x396f0e8e4bc223f186f87b7eabf2f4b537ce84f8515aa16c86400c4f10af79b1"
+        "0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f"
      sourceHashes.0:
-        "0x8337740067b4f9278182a83ca83d62ca2611966b8beca6e0a49394204c8f74da"
+        "0xbceaa498ea422a98ec91f01d7b76774610e543c9efd855141de933065f32b308"
    }
```

Generated with discovered.json: 0x5dcfbb1116b18c5eee7c6990a671c98316f31e41

# Diff at Fri, 23 May 2025 09:41:10 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22181511
- current block number: 22181511

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22181511 (main branch discovery), not current.

```diff
    EOA  (0x2572835e02b59078711aa0800490e80975e4169d) {
    +++ description: None
      receivedPermissions.1.role:
+        ".validatorsVTL"
      receivedPermissions.0.role:
+        ".validatorsVTL"
    }
```

```diff
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getAdmin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283) {
    +++ description: None
      receivedPermissions.1.role:
+        ".validatorsVTL"
      receivedPermissions.0.role:
+        ".validatorsVTL"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".getAdmin"
    }
```

```diff
    EOA  (0xdd2B80c477CF2f660A1Eda0FeCBD0291caE43216) {
    +++ description: None
      receivedPermissions.0.role:
+        ".tokenMultiplierSetter"
    }
```

Generated with discovered.json: 0x956a763b4a527a18c5ee69ef0a819b2e8e2aeb75

# Diff at Tue, 29 Apr 2025 08:19:18 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22181511
- current block number: 22181511

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22181511 (main branch discovery), not current.

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0x2572835e02b59078711aa0800490e80975e4169d","via":[]},{"permission":"validateZkStack","to":"0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283","via":[]}]
    }
```

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions:
-        [{"permission":"interact","to":"0x282370D1e925ee897CB29Cb3beC13aAe0743067C","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","via":[{"address":"0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"}]},{"permission":"interact","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]}]
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0x2572835e02b59078711aa0800490e80975e4169d","via":[]},{"permission":"validateZkStack","to":"0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283","via":[]}]
    }
```

```diff
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"interact","to":"0xdd2B80c477CF2f660A1Eda0FeCBD0291caE43216","description":"set the conversion factor for gas token deposits.","via":[]}]
    }
```

Generated with discovered.json: 0xab70c8cc85a23de22e88a2ff62b5a13a6a5069a6

# Diff at Thu, 10 Apr 2025 14:43:30 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22181511
- current block number: 22181511

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22181511 (main branch discovery), not current.

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

Generated with discovered.json: 0x26d3418ec3181147fe27131e546d74fd210f35f3

# Diff at Wed, 02 Apr 2025 15:08:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6d66206526294fb00e0c08e8ff3bf70febdc1aaa block: 22166647
- current block number: 22181511

## Description

shared zk stack contracts upgraded to v26: config related changes for all children chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22166647 (main branch discovery), not current.

```diff
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      receivedPermissions.0.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
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
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      template:
-        "shared-zk-stack/Diamond_v26"
+        "shared-zk-stack/v26/Diamond"
      issuedPermissions.2.description:
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
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
      directlyReceivedPermissions.0.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

```diff
+   Status: CREATED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

Generated with discovered.json: 0x13f31cbed3d6947ca257fe22573dcb11b2e85e98

# Diff at Mon, 31 Mar 2025 11:37:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 22144911
- current block number: 22166647

## Description

MS signer change.

## Watched changes

```diff
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      values.$members.5:
-        "0x18c16E72CAa10D2Ce13E4b61bfC51AB93B7e92f0"
      values.$members.4:
-        "0x1ee4324F7BD44A4c7c335C2D4e758639B60E8726"
+        "0x18c16E72CAa10D2Ce13E4b61bfC51AB93B7e92f0"
      values.$members.3:
-        "0xe25AdA29FA5873A24afEe1342422BD14e5809e03"
+        "0x1ee4324F7BD44A4c7c335C2D4e758639B60E8726"
      values.multisigThreshold:
-        "4 of 6 (67%)"
+        "4 of 5 (80%)"
    }
```

Generated with discovered.json: 0x7f656144255621f3b3621c08e047a79825515103

# Diff at Fri, 28 Mar 2025 10:52:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@279f845afa28d7cd0a0fe99f5744c0fe98cd5c86 block: 22022297
- current block number: 22144911

## Description

v26 upgrade.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: Implements the ZK proof verification logic.
```

```diff
    contract undefined (0x2572835e02b59078711aa0800490e80975e4169d) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"}
    }
```

```diff
    contract undefined (0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"}
    }
```

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
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
+        {"permission":"interact","to":"0x282370D1e925ee897CB29Cb3beC13aAe0743067C","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"}]}
      issuedPermissions.1.to:
-        "0x282370D1e925ee897CB29Cb3beC13aAe0743067C"
+        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      issuedPermissions.1.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock."
      issuedPermissions.1.via.0:
-        {"address":"0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"}
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
+        ["2025-03-25T20:10:23.000Z","0x0d39b66c0a194ce268eba8ea2883828caacbc62cb41ff972cea629bcb7ccd696",["0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb","0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1","0x36b026c39125964D99596CE302866B5A59E4dE27","0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"]]
      values.$upgradeCount:
-        3
+        4
      values.daMode:
-        1
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
+        "0x550294b5414f0e3416c764c5efc683ead2dd861c5a5bb23fb53f5aac8797882d"
      values.getChainId:
+        61166
      values.getChainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+++ severity: HIGH
      values.getDAValidatorPair:
+        ["0x907b30407249949521Bf0c89A43558dae200146A","0xFa30EAe30351A83809657299F6Cad9557c232e8C"]
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
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.1:
+        {"_protocolVersion":107374182400,"_upgradeTimestamp":1738591200}
      values.upgradeTimestamps.0._protocolVersion:
-        107374182400
+        111669149696
      values.upgradeTimestamps.0._upgradeTimestamp:
-        1738591200
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
.../TreasureZkEvm/AdminFacet.1.sol                 | 1442 ++++++++++++-
 .../TreasureZkEvm/ExecutorFacet.4.sol              | 2016 ++++++++++++++----
 .../TreasureZkEvm/GettersFacet.2.sol               | 1153 +++++++++-
 .../TreasureZkEvm/MailboxFacet.3.sol               | 2195 ++++++++++++++------
 .../treasure/ethereum/.flat/ValidatorTimelock.sol  |  504 +++++
 .../{.flat@22022297 => .flat}/Verifier.sol         |   41 +-
 6 files changed, 6181 insertions(+), 1170 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22022297 (main branch discovery), not current.

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      name:
-        "ValidatorTimelock"
+        "ValidatorTimelock2"
    }
```

Generated with discovered.json: 0x03cd2764263a8c115c5680d4487cf55396371999

# Diff at Tue, 11 Mar 2025 08:00:26 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 21786543
- current block number: 22022297

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
 .../.flat@21786543/Guardians.sol => /dev/null      | 1439 --------------------
 .../ProtocolUpgradeHandler.sol => /dev/null        |  605 --------
 .../SecurityCouncil.sol => /dev/null               | 1389 -------------------
 4 files changed, 4666 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786543 (main branch discovery), not current.

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

Generated with discovered.json: 0x89523c4d4a59bd6bcf78288121221b158a3f501b

# Diff at Tue, 04 Mar 2025 10:40:11 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21786543
- current block number: 21786543

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786543 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      sinceBlock:
+        21081436
    }
```

```diff
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      sinceBlock:
+        21273741
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
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sinceBlock:
+        21236684
    }
```

```diff
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
      sinceBlock:
+        21182547
    }
```

Generated with discovered.json: 0x23b5ef04ac3ef5830ceae9e2a6847196b40fd3e3

# Diff at Wed, 26 Feb 2025 10:33:15 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21786543
- current block number: 21786543

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786543 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
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
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0xab5c09bf1ea40eac3fa111bc574e9096fadbb5eb

# Diff at Thu, 06 Feb 2025 09:24:01 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21778554
- current block number: 21786543

## Description

Upgrade successful.

## Watched changes

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.getL2SystemContractsUpgradeBatchNumber:
-        278
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        278
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xd3086b71c95ce83e7f3d30ab1890ada2334695a05b65715e56f42d96b22c8674"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xf5379ae2693ce0bafa4a5d797ddeb380251d1c15

# Diff at Wed, 05 Feb 2025 06:38:42 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@24a3610845e7ae2b3cc2daf90feff25e498e4068 block: 21766600
- current block number: 21778554

## Description

v25 upgrade.

## Watched changes

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.4:
-        "0xe521f6bd6250a2c92af323768ad8a2274cc334725b5ed8960d8421f063fc3285"
+        "0xdf47c6cd4fcffcfa4a670e1544e2391acc365cd7fd9b8e7583d58b28dff50c40"
      sourceHashes.3:
-        "0x419cee160f60572fc9189007ec7c1e3c13e54d80bf1e78f837bc8fa001519685"
+        "0x91db58e4059dfed7357e56dac17d2963c6f9cfb540f527988ed25172251a2584"
      sourceHashes.2:
-        "0xd272def5b4e3f0a68e3019d7d40675ca6d3e3fc35500e9aafe864bce8c697de2"
+        "0x981d4f2ae5949ab33c6ba83f6446595d3b853bf6f7157884304445d70b185374"
      sourceHashes.1:
-        "0x9ae32beaa5dc29055f75d3cd08fbec35ed3eee3e2ff35de263a78f7d63c610f9"
+        "0x081a1805983e86cd6a80ed48c012c26bf9a39473c0f1e69b357afff240f027a0"
      values.$implementation.3:
-        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
+        "0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
      values.$implementation.2:
-        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
+        "0x5575218cECd370E1d630d1AdB03c254B0B376821"
      values.$implementation.1:
-        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
+        "0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
      values.$implementation.0:
-        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
+        "0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
      values.$pastUpgrades.2:
+        ["2025-02-04T16:27:35.000Z","0xa72f2fd2292abc5f4823ba17a3e1e622f71778d2e308b7da8b3d4bfc3d8f6f8f",["0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a","0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9","0x5575218cECd370E1d630d1AdB03c254B0B376821","0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"]]
      values.$upgradeCount:
-        2
+        3
      values.facetAddresses.3:
-        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
+        "0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
      values.facetAddresses.2:
-        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
+        "0x5575218cECd370E1d630d1AdB03c254B0B376821"
      values.facetAddresses.1:
-        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
+        "0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
      values.facetAddresses.0:
-        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
+        "0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
      values.facets.0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a:
-        ["acceptAdmin()","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","freezeDiamond()","setPendingAdmin(address)","setPorterAvailability(bool)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)","setTokenMultiplier(uint128,uint128)","setTransactionFilterer(address)","setValidator(address,bool)","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))"]
      values.facets.0xE60E94fCCb18a81D501a38959E532C0A85A1be89:
-        ["baseTokenGasPriceMultiplierDenominator()","baseTokenGasPriceMultiplierNominator()","facetAddress(bytes4)","facetAddresses()","facetFunctionSelectors(address)","facets()","getAdmin()","getBaseToken()","getBaseTokenBridge()","getBridgehub()","getFirstUnprocessedPriorityTx()","getL2BootloaderBytecodeHash()","getL2DefaultAccountBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","getL2SystemContractsUpgradeBlockNumber()","getL2SystemContractsUpgradeTxHash()","getPendingAdmin()","getPriorityQueueSize()","getPriorityTxMaxGasLimit()","getProtocolVersion()","getPubdataPricingMode()","getSemverProtocolVersion()","getStateTransitionManager()","getTotalBatchesCommitted()","getTotalBatchesExecuted()","getTotalBatchesVerified()","getTotalBlocksCommitted()","getTotalBlocksExecuted()","getTotalBlocksVerified()","getTotalPriorityTxs()","getVerifier()","getVerifierParams()","isDiamondStorageFrozen()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","isFunctionFreezable(bytes4)","isValidator(address)","l2LogsRootHash(uint256)","priorityQueueFrontOperation()","storedBatchHash(uint256)","storedBlockHash(uint256)"]
      values.facets.0xCDB6228b616EEf8Df47D69A372C4f725C43e718C:
-        ["bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","transferEthToSharedBridge()"]
      values.facets.0xaD193aDe635576d8e9f7ada71Af2137b16c64075:
-        ["commitBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","commitBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","executeBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","executeBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","proveBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","proveBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","revertBatches(uint256)","revertBatchesSharedBridge(uint256,uint256)"]
      values.facets.0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a:
+        ["acceptAdmin()","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","freezeDiamond()","setPendingAdmin(address)","setPorterAvailability(bool)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)","setTokenMultiplier(uint128,uint128)","setTransactionFilterer(address)","setValidator(address,bool)","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))"]
      values.facets.0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9:
+        ["baseTokenGasPriceMultiplierDenominator()","baseTokenGasPriceMultiplierNominator()","facetAddress(bytes4)","facetAddresses()","facetFunctionSelectors(address)","facets()","getAdmin()","getBaseToken()","getBaseTokenBridge()","getBridgehub()","getFirstUnprocessedPriorityTx()","getL2BootloaderBytecodeHash()","getL2DefaultAccountBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","getL2SystemContractsUpgradeBlockNumber()","getL2SystemContractsUpgradeTxHash()","getPendingAdmin()","getPriorityQueueSize()","getPriorityTxMaxGasLimit()","getProtocolVersion()","getPubdataPricingMode()","getSemverProtocolVersion()","getStateTransitionManager()","getTotalBatchesCommitted()","getTotalBatchesExecuted()","getTotalBatchesVerified()","getTotalBlocksCommitted()","getTotalBlocksExecuted()","getTotalBlocksVerified()","getTotalPriorityTxs()","getVerifier()","getVerifierParams()","isDiamondStorageFrozen()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","isFunctionFreezable(bytes4)","isValidator(address)","l2LogsRootHash(uint256)","priorityQueueFrontOperation()","storedBatchHash(uint256)","storedBlockHash(uint256)"]
      values.facets.0x5575218cECd370E1d630d1AdB03c254B0B376821:
+        ["bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","transferEthToSharedBridge()"]
      values.facets.0xBB13642F795014E0EAC2b0d52ECD5162ECb66712:
+        ["commitBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","commitBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","executeBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","executeBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","proveBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","proveBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","revertBatches(uint256)","revertBatchesSharedBridge(uint256,uint256)"]
      values.getL2BootloaderBytecodeHash:
-        "0x010008e742608b21bf7eb23c1a9d0602047e3618b464c9b59c0fba3b3d7ab66e"
+        "0x010008c3be57ae5800e077b6c2056d9d75ad1a7b4f0ce583407961cc6fe0b678"
      values.getL2DefaultAccountBytecodeHash:
-        "0x01000563374c277a2c1e34659a2a1e87371bb6d852ce142022d497bfb50b9e32"
+        "0x0100055dba11508480be023137563caec69debc85f826cb3a4b68246a7cabe30"
      values.getL2SystemContractsUpgradeBatchNumber:
-        0
+        278
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        278
      values.getL2SystemContractsUpgradeTxHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0xd3086b71c95ce83e7f3d30ab1890ada2334695a05b65715e56f42d96b22c8674"
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: MEDIUM
      values.getProtocolVersion:
-        103079215106
+        107374182400
      values.getSemverProtocolVersion.2:
-        2
+        0
      values.getSemverProtocolVersion.1:
-        24
+        25
      values.getVerifier:
-        "0x70F3FBf8a427155185Ec90BED8a3434203de9604"
+        "0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66"
    }
```

```diff
-   Status: DELETED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: Implements the ZK proof verification logic.
```

```diff
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.0:
+        {"_protocolVersion":107374182400,"_upgradeTimestamp":1738591200}
    }
```

```diff
+   Status: CREATED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: Implements the ZK proof verification logic.
```

## Source code changes

```diff
.../TreasureZkEvm/AdminFacet.1.sol                 | 166 +++++++---
 .../TreasureZkEvm/ExecutorFacet.4.sol              | 343 ++++++++++++++-------
 .../TreasureZkEvm/GettersFacet.2.sol               | 117 +++++--
 .../TreasureZkEvm/MailboxFacet.3.sol               | 255 +++++++++++----
 4 files changed, 627 insertions(+), 254 deletions(-)
```

Generated with discovered.json: 0x0cd04922869ef5f7414d375f23e478a6b383f3be

# Diff at Tue, 04 Feb 2025 12:33:21 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766600
- current block number: 21766600

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766600 (main branch discovery), not current.

```diff
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      receivedPermissions.0.permission:
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
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
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
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x0cffc2c13837b37b58435d580a91809ba661c1f7

# Diff at Mon, 03 Feb 2025 14:33:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21717208
- current block number: 21766600

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
discovery. Values are for block 21717208 (main branch discovery), not current.

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.priorityQueueFrontOperation:
-        {"canonicalTxHash":"0xe5068578ffb5612cdfe2e99c7ee71413497b9c68ad0244e0f4ea4435d8345868","expirationTimestamp":1737921623,"layer2Tip":0}
    }
```

Generated with discovered.json: 0xd09537797ee729ec421099be3d81b58c5055f728

# Diff at Fri, 31 Jan 2025 11:51:23 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 54952364

## Description

Empty, see comment in config.jsonc

Generated with discovered.json: 0xa00d77eb51ceec77be0cffacb8e02aa22a7018d7

# Diff at Tue, 28 Jan 2025 06:34:22 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21585285
- current block number: 21717208

## Description

discodrive!

## Watched changes

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.baseTokenGasPriceMultiplierDenominator:
-        15677
+        10629
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21585285 (main branch discovery), not current.

```diff
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"}]
    }
```

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      fieldMeta.txFilterer.description:
-        "Optional: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
+        "This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
      fieldMeta.getProtocolVersion.description:
-        "Protocol version, increments with each protocol change"
+        "Protocol version, increments with each protocol upgrade."
      fieldMeta.getVerifierParams.description:
-        "Verifier parameters used for proving batches"
+        "Verifier parameters used for proving batches."
      fieldMeta.daMode:
-        {"description":"0 = rollup; 1 = Validium"}
      template:
+        "shared-zk-stack/Diamond"
      description:
+        "The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions."
      issuedPermissions:
+        [{"permission":"configure","to":"0x282370D1e925ee897CB29Cb3beC13aAe0743067C","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"}]},{"permission":"configure","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]}]
    }
```

```diff
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604) {
    +++ description: Implements the ZK proof verification logic.
      template:
+        "shared-zk-stack/Verifier"
      description:
+        "Implements the ZK proof verification logic."
    }
```

```diff
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      issuedPermissions:
+        [{"permission":"configure","to":"0xdd2B80c477CF2f660A1Eda0FeCBD0291caE43216","description":"set the conversion factor for gas token deposits.","via":[]}]
      directlyReceivedPermissions:
+        [{"permission":"configure","from":"0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."}]
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h.
```

Generated with discovered.json: 0x9ccc58c9872fd26aaf70224eff95e611fe660852

# Diff at Thu, 09 Jan 2025 06:58:54 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edc6acaed84d40aabd5185e0a0b5ebaf1c90143b block: 21429089
- current block number: 21585285

## Description

TreasureChainAdminMultisig signers added, threshold increased.

## Watched changes

```diff
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      values.$members.5:
+        "0x18c16E72CAa10D2Ce13E4b61bfC51AB93B7e92f0"
      values.$members.4:
+        "0x58244EA236D2ff57c023A4028E228f77dc328894"
      values.$members.3:
-        "0x18c16E72CAa10D2Ce13E4b61bfC51AB93B7e92f0"
+        "0x1ee4324F7BD44A4c7c335C2D4e758639B60E8726"
      values.$members.2:
-        "0x58244EA236D2ff57c023A4028E228f77dc328894"
+        "0xBAe65c4bA62799F68817Cbb2bB353Da4572C23Ae"
      values.$members.1:
-        "0x1ee4324F7BD44A4c7c335C2D4e758639B60E8726"
+        "0xe25AdA29FA5873A24afEe1342422BD14e5809e03"
      values.$members.0:
-        "0xBAe65c4bA62799F68817Cbb2bB353Da4572C23Ae"
+        "0x1c68007a9A7E5Adc862da9b54938112352B97f17"
      values.$threshold:
-        2
+        4
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0xd294c53381a2cd4212e1f30f4ce84c5251a3360b

# Diff at Thu, 12 Dec 2024 11:05:27 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 21386011

## Description

Initial discovery of a standard zk stack validium.

## Initial discovery

```diff
+   Status: CREATED
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871)
    +++ description: None
```

