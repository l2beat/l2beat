Generated with discovered.json: 0xdac14234517154e9209b31d6e21375e7677bb120

# Diff at Tue, 29 Apr 2025 08:19:18 GMT:

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
-        [{"permission":"validateZkStack","to":"0x0F9B807d5B0cE12450059B425Dc35C727D65CB2F","via":[]},{"permission":"validateZkStack","to":"0x479B7c95b9509E1A834C994fc94e3581aA8A73B9","via":[]}]
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0x0F9B807d5B0cE12450059B425Dc35C727D65CB2F","via":[]},{"permission":"validateZkStack","to":"0x479B7c95b9509E1A834C994fc94e3581aA8A73B9","via":[]}]
    }
```

```diff
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions:
-        [{"permission":"interact","to":"0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","via":[{"address":"0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"}]},{"permission":"interact","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]}]
    }
```

Generated with discovered.json: 0x8bc1d3fa3136a2b73701e409cafff257cafc6f5e

# Diff at Thu, 10 Apr 2025 14:43:35 GMT:

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

Generated with discovered.json: 0xe532b7b91532d83195a93b79982bb2393eaa411f

# Diff at Wed, 02 Apr 2025 15:08:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6d66206526294fb00e0c08e8ff3bf70febdc1aaa block: 22166665
- current block number: 22181511

## Description

shared zk stack contracts upgraded to v26: config related changes for all children chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22166665 (main branch discovery), not current.

```diff
    contract Zeronetwork Multisig (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9) {
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
    contract ZeroNetworkZkEvmAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3) {
    +++ description: None
      directlyReceivedPermissions.0.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

```diff
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9) {
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

Generated with discovered.json: 0xda250aeb147e2d12030fdd14d0d65e0e459ab755

# Diff at Mon, 31 Mar 2025 11:41:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 22123319
- current block number: 22166665

## Description

upgrade to v26 complete.

## Watched changes

```diff
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.getL2SystemContractsUpgradeBatchNumber:
-        763
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        763
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xdf9f31f2c741079bb3163405a2cf374b4d6537a0a32bdd5262211d30091b51f1"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.isPriorityQueueActive:
-        true
+        false
    }
```

Generated with discovered.json: 0xd9cec0387d7aa8f0f5200233a97ab531d0459ac8

# Diff at Tue, 25 Mar 2025 10:42:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 22022298
- current block number: 22123319

## Description

Upgrade the diamond to v26.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: Implements the ZK proof verification logic.
```

```diff
    contract undefined (0x0F9B807d5B0cE12450059B425Dc35C727D65CB2F) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"}
    }
```

```diff
    contract undefined (0x479B7c95b9509E1A834C994fc94e3581aA8A73B9) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"}
    }
```

```diff
    contract ZeroNetworkZkEvmAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.1:
+        {"_protocolVersion":111669149696,"_upgradeTimestamp":0}
    }
```

```diff
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9) {
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
+        {"permission":"interact","to":"0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"}]}
      issuedPermissions.1.to:
-        "0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9"
+        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      issuedPermissions.1.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock."
      issuedPermissions.1.via.0:
-        {"address":"0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"}
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
+        ["2025-01-15T23:48:47.000Z","0x43cc00fd7fc4cf95a1b1c73c015e995b9bd30b63f94d9c41a9ff5f6dc9a30f2f",["0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a","0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9","0x5575218cECd370E1d630d1AdB03c254B0B376821","0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"]]
      values.$pastUpgrades.2.2:
-        "2025-01-15T23:48:47.000Z"
+        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
      values.$pastUpgrades.2.1:
-        ["0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a","0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9","0x5575218cECd370E1d630d1AdB03c254B0B376821","0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"]
+        "0xa728db44825fd6e5aa33e91df199018db55a3c7376d49526abdd06402e24a5af"
      values.$pastUpgrades.2.0:
-        "0x43cc00fd7fc4cf95a1b1c73c015e995b9bd30b63f94d9c41a9ff5f6dc9a30f2f"
+        "2024-10-18T16:28:35.000Z"
      values.$pastUpgrades.0.2.3:
-        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
+        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
      values.$pastUpgrades.0.2.2:
-        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
+        "0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.$pastUpgrades.0.2.1:
-        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
+        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.$pastUpgrades.0.2.0:
-        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
+        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.$pastUpgrades.0.1:
-        "0xa728db44825fd6e5aa33e91df199018db55a3c7376d49526abdd06402e24a5af"
+        "2025-03-24T23:58:59.000Z"
      values.$pastUpgrades.0.0:
-        "2024-10-18T16:28:35.000Z"
+        "0x73c01b2ffc860cbae069cb2079376603a8a05aa57c005e8ab74b858353827f87"
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
      values.getL2SystemContractsUpgradeBatchNumber:
-        0
+        763
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        763
      values.getL2SystemContractsUpgradeTxHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0xdf9f31f2c741079bb3163405a2cf374b4d6537a0a32bdd5262211d30091b51f1"
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
+        543210
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
+        true
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
.../ethereum/.flat/ValidatorTimelock.sol           |  504 +++++
 .../{.flat@22022298 => .flat}/Verifier.sol         |   41 +-
 .../ZeroNetworkZkEvm/AdminFacet.1.sol              | 1442 ++++++++++++-
 .../ZeroNetworkZkEvm/ExecutorFacet.4.sol           | 2016 ++++++++++++++----
 .../ZeroNetworkZkEvm/GettersFacet.2.sol            | 1153 +++++++++-
 .../ZeroNetworkZkEvm/MailboxFacet.3.sol            | 2195 ++++++++++++++------
 6 files changed, 6181 insertions(+), 1170 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22022298 (main branch discovery), not current.

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      name:
-        "ValidatorTimelock"
+        "ValidatorTimelock2"
    }
```

Generated with discovered.json: 0xb11fce21896c6574ae0ce438eb299f53a41f2567

# Diff at Tue, 18 Mar 2025 08:14:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22022298
- current block number: 22022298

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22022298 (main branch discovery), not current.

```diff
    contract Zeronetwork Multisig (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9) {
    +++ description: None
      name:
-        "ZeroNetworkChainAdminMultisig"
+        "Zeronetwork Multisig"
    }
```

Generated with discovered.json: 0xee5a8630d1865f0572a9a8c0e41fa5ead72eb987

# Diff at Tue, 11 Mar 2025 08:00:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 21766584
- current block number: 22022298

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
 .../.flat@21766584/Guardians.sol => /dev/null      | 1439 --------------------
 .../ProtocolUpgradeHandler.sol => /dev/null        |  605 --------
 .../SecurityCouncil.sol => /dev/null               | 1389 -------------------
 4 files changed, 4666 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766584 (main branch discovery), not current.

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

Generated with discovered.json: 0x9e4a4daf0ac1e86fc7da2541efbefff0b84b0f10

# Diff at Tue, 04 Mar 2025 10:40:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766584
- current block number: 21766584

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766584 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      sinceBlock:
+        21081436
    }
```

```diff
    contract ZeroNetworkChainAdminMultisig (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9) {
    +++ description: None
      sinceBlock:
+        20966635
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
    contract ZeroNetworkZkEvmAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3) {
    +++ description: None
      sinceBlock:
+        20978324
    }
```

```diff
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sinceBlock:
+        20993644
    }
```

Generated with discovered.json: 0x280700c3602bd5fde3249d171c28aef8fa02e95c

# Diff at Wed, 26 Feb 2025 10:33:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21766584
- current block number: 21766584

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766584 (main branch discovery), not current.

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
    contract ZeroNetworkZkEvmAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3) {
    +++ description: None
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xe953c01ba76e73c41aaf0d0465c722a00481c129

# Diff at Tue, 04 Feb 2025 12:33:35 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766584
- current block number: 21766584

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766584 (main branch discovery), not current.

```diff
    contract ZeroNetworkChainAdminMultisig (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9) {
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
    contract ZeroNetworkZkEvmAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xe3ad03d4b50a61fcd073c01eebf1d8f079ce1e14

# Diff at Mon, 03 Feb 2025 14:33:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21717100
- current block number: 21766584

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
discovery. Values are for block 21717100 (main branch discovery), not current.

```diff
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.priorityQueueFrontOperation:
-        {"canonicalTxHash":"0x739c9c6fc58dff1a1a7c7d6523f9d7a24169585daa56081294258b01bf6a07f2","expirationTimestamp":1737929579,"layer2Tip":0}
    }
```

Generated with discovered.json: 0xaa1504cafbd3c60cf1b1ab8d224d5a855cb05648

# Diff at Tue, 28 Jan 2025 06:34:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21643075
- current block number: 21717100

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21643075 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      template:
+        "shared-zk-stack/Verifier"
      description:
+        "Implements the ZK proof verification logic."
    }
```

```diff
    contract ZeroNetworkChainAdminMultisig (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"}]
    }
```

```diff
    contract ZeroNetworkZkEvmAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"configure","from":"0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."}]
    }
```

```diff
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9) {
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
+        [{"permission":"configure","to":"0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"}]},{"permission":"configure","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]}]
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h.
```

Generated with discovered.json: 0x096276bf47fe0662e7b13e891c951db44428de7c

# Diff at Fri, 17 Jan 2025 08:39:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@684bb8793c10fca3b27baef551e527bab3fa9d01 block: 21635860
- current block number: 21643075

## Description

Upgrade succeeded.

## Watched changes

```diff
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9) {
    +++ description: None
      values.getL2SystemContractsUpgradeBatchNumber:
-        544
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        544
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xd3086b71c95ce83e7f3d30ab1890ada2334695a05b65715e56f42d96b22c8674"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x7b0af260425de30b0e854d299e07bc093703a3dd

# Diff at Thu, 16 Jan 2025 08:29:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a739892e4565ca2cf8f67abed360c494a770dcea block: 21630377
- current block number: 21635860

## Description

Upgrade to protocol version 25 (defence upgrade).

## Watched changes

```diff
-   Status: DELETED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
    contract ZeroNetworkZkEvmAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.0:
+        {"_protocolVersion":107374182400,"_upgradeTimestamp":1736978400}
    }
```

```diff
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9) {
    +++ description: None
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
+        ["2025-01-15T23:48:47.000Z","0x43cc00fd7fc4cf95a1b1c73c015e995b9bd30b63f94d9c41a9ff5f6dc9a30f2f",["0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a","0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9","0x5575218cECd370E1d630d1AdB03c254B0B376821","0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"]]
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
+        544
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        544
      values.getL2SystemContractsUpgradeTxHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0xd3086b71c95ce83e7f3d30ab1890ada2334695a05b65715e56f42d96b22c8674"
+++ description: Protocol version, increments with each protocol change
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
+   Status: CREATED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: None
```

## Source code changes

```diff
.../ZeroNetworkZkEvm/AdminFacet.1.sol              | 166 +++++++---
 .../ZeroNetworkZkEvm/ExecutorFacet.4.sol           | 343 ++++++++++++++-------
 .../ZeroNetworkZkEvm/GettersFacet.2.sol            | 117 +++++--
 .../ZeroNetworkZkEvm/MailboxFacet.3.sol            | 255 +++++++++++----
 4 files changed, 627 insertions(+), 254 deletions(-)
```

Generated with discovered.json: 0xfae790f95f68e2a766e63e93ae8362497e94e2db

# Diff at Wed, 13 Nov 2024 10:34:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21178205

## Description

First zk stack rollup apart from ZKsync era. Uses the shared bridge, shared contracts and shared diamond implementation of the elastic chain. Gas token is ETH.

## Initial discovery

```diff
+   Status: CREATED
    contract ZeroNetworkChainAdminMultisig (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZeroNetworkZkEvmAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZeroNetworkZkEvm (0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9)
    +++ description: None
```
