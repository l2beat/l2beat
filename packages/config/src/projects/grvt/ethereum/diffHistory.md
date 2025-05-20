Generated with discovered.json: 0x1428a138ccaf5a1535f70496453755dcd1bf28b1

# Diff at Mon, 19 May 2025 15:25:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2ba4be7822b161a6616bac837b3f7f03225f5cb9 block: 22181511
- current block number: 22517885

## Description

v27 upgrade to standard contracts. Same filterer.

## Watched changes

```diff
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.2:
+        {"_protocolVersion":107374182400,"_upgradeTimestamp":1729793768}
      values.upgradeTimestamps.1._protocolVersion:
-        107374182400
+        115964116992
      values.upgradeTimestamps.1._upgradeTimestamp:
-        1729793768
+        1738089540
    }
```

```diff
-   Status: DELETED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
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
+        ["2025-03-24T09:29:47.000Z","0xd442b78fb0d2ccccea791f60de88cc4d7214fff454429c552be59c8778cbb9f3",["0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb","0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1","0x36b026c39125964D99596CE302866B5A59E4dE27","0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"]]
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
-        "0xd442b78fb0d2ccccea791f60de88cc4d7214fff454429c552be59c8778cbb9f3"
+        "2025-05-19T07:17:59.000Z"
      values.$pastUpgrades.3.0:
-        "2025-03-24T09:29:47.000Z"
+        "0xf21daa11dac7aa6d48bcf8f8d76d8c43900db3022d183389a8e16858cabdd0cb"
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
      values.getL2SystemContractsUpgradeBatchNumber:
-        0
+        3199
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        3199
      values.getL2SystemContractsUpgradeTxHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x7ead5e3e088ce4a6d739a729550f453bdc83ca10104b1916d9b0ee8722946d4a"
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
.../projects/grvt/ethereum/.flat/DualVerifier.sol  |   97 ++
 .../GrvtZkEvm/AdminFacet.1.sol                     |   37 +-
 .../GrvtZkEvm/ExecutorFacet.4.sol                  |   82 +-
 .../GrvtZkEvm/GettersFacet.2.sol                   |   27 +-
 .../GrvtZkEvm/MailboxFacet.3.sol                   |   74 +-
 .../grvt/ethereum/.flat/L1VerifierFflonk.sol       | 1605 ++++++++++++++++++++
 .../Verifier.sol => .flat/L1VerifierPlonk.sol}     |   12 +-
 7 files changed, 1885 insertions(+), 49 deletions(-)
```

Generated with discovered.json: 0x92f03103ce71842d490e6ea177798d9bd96f2888

# Diff at Tue, 29 Apr 2025 08:19:17 GMT:

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
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"interact","to":"0xE17aeD2fC55f4A876315376ffA49FE6358113a65","description":"address is part of the GRVTTransactionFilterer whitelist.","via":[]},{"permission":"interact","to":"0xe81d64195072e4d09639b31Abb257d0096FEa9d1","description":"address is part of the GRVTTransactionFilterer whitelist.","via":[]},{"permission":"interact","to":"0xF29bFff344c7ef0186432fE30C39fda0cca0550b","description":"address is part of the GRVTTransactionFilterer whitelist.","via":[]},{"permission":"interact","to":"0xF29bFff344c7ef0186432fE30C39fda0cca0550b","description":"manage the whitelist of addresses.","via":[]},{"permission":"upgrade","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","via":[]}]
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0x0b114d4675Cb79507e68F2616c93e124122c6ef0","via":[]},{"permission":"validateZkStack","to":"0x58D14960E0a2be353eDdE61ad719196A2b816522","via":[]}]
    }
```

```diff
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"interact","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","description":"set the conversion factor for gas token deposits.","via":[]}]
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0x0b114d4675Cb79507e68F2616c93e124122c6ef0","via":[]},{"permission":"validateZkStack","to":"0x58D14960E0a2be353eDdE61ad719196A2b816522","via":[]}]
    }
```

```diff
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65) {
    +++ description: Checks the signature of the DepositApprover for each deposit and, on succeeding, forwards the user's funds and bridging request to the L1SharedBridge contract to deposit to GRVT.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5c8de5821dd9263F124E8ddbff11C3368Ff86a37","description":"approve deposits to GRVT via the GRVTBridgeProxy.","via":[]},{"permission":"upgrade","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","via":[]}]
    }
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","via":[{"address":"0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"}]},{"permission":"interact","to":"0x3Cd52B238Ac856600b22756133eEb31ECb25109a","description":"define addresses that can send transactions from L1 to L2 (e.g. for deposits, withdrawals, queued transactions). This is enforced in the Mailbox Facet.","via":[]},{"permission":"interact","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]}]
    }
```

Generated with discovered.json: 0x9ec2e3090f263db0a1a6ce50d2fcae75094a5a7f

# Diff at Thu, 10 Apr 2025 14:42:31 GMT:

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

Generated with discovered.json: 0x2c68d59676d6e26963c7ef7de137e4755139ceb2

# Diff at Wed, 02 Apr 2025 15:08:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6d66206526294fb00e0c08e8ff3bf70febdc1aaa block: 22122838
- current block number: 22181511

## Description

shared zk stack contracts upgraded to v26: config related changes for all children chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122838 (main branch discovery), not current.

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
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
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
      directlyReceivedPermissions.0.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      template:
-        "shared-zk-stack/Diamond_v26"
+        "shared-zk-stack/v26/Diamond"
      issuedPermissions.3.description:
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
+   Status: CREATED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

Generated with discovered.json: 0x31ee62342498fd2d767adb9b16770c250b4a50ac

# Diff at Tue, 25 Mar 2025 10:35:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 22022296
- current block number: 22122838

## Description

Upgrade diamond to protocol v26.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: Implements the ZK proof verification logic.
```

```diff
    contract undefined (0x0b114d4675Cb79507e68F2616c93e124122c6ef0) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"}
    }
```

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      values.accessControl.L2_TX_SENDER_ROLE.members.4:
+        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
      values.accessControl.L2_TX_SENDER_ROLE.members.3:
-        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
+        "0xe81d64195072e4d09639b31Abb257d0096FEa9d1"
      values.accessControl.L2_TX_SENDER_ROLE.members.2:
-        "0xe81d64195072e4d09639b31Abb257d0096FEa9d1"
+        "0xF29bFff344c7ef0186432fE30C39fda0cca0550b"
      values.accessControl.L2_TX_SENDER_ROLE.members.1:
-        "0xF29bFff344c7ef0186432fE30C39fda0cca0550b"
+        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.whitelistedSender.4:
+        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
      values.whitelistedSender.3:
-        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
+        "0xe81d64195072e4d09639b31Abb257d0096FEa9d1"
      values.whitelistedSender.2:
-        "0xe81d64195072e4d09639b31Abb257d0096FEa9d1"
+        "0xF29bFff344c7ef0186432fE30C39fda0cca0550b"
      values.whitelistedSender.1:
-        "0xF29bFff344c7ef0186432fE30C39fda0cca0550b"
+        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
    }
```

```diff
    contract undefined (0x58D14960E0a2be353eDdE61ad719196A2b816522) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"}
    }
```

```diff
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.1:
+        {"_protocolVersion":107374182400,"_upgradeTimestamp":1729793768}
      values.upgradeTimestamps.0._protocolVersion:
-        107374182400
+        111669149696
      values.upgradeTimestamps.0._upgradeTimestamp:
-        1729793768
+        1738089540
    }
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
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
      issuedPermissions.3:
+        {"permission":"interact","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"}]}
      issuedPermissions.2.to:
-        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
+        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      issuedPermissions.2.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock."
      issuedPermissions.2.via.0:
-        {"address":"0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"}
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
+        ["2025-03-24T09:29:47.000Z","0xd442b78fb0d2ccccea791f60de88cc4d7214fff454429c552be59c8778cbb9f3",["0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb","0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1","0x36b026c39125964D99596CE302866B5A59E4dE27","0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"]]
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
-        ["0x3Cd52B238Ac856600b22756133eEb31ECb25109a"]
      values.validators.1:
+        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      values.getBaseTokenAssetId:
+        "0x655d55f4565c6519b560cef52332055302203549acc24d046264c1271fa724ae"
      values.getChainId:
+        325
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
+        "0x3Cd52B238Ac856600b22756133eEb31ECb25109a"
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
.../GrvtZkEvm/AdminFacet.1.sol                     | 1442 ++++++++++++-
 .../GrvtZkEvm/ExecutorFacet.4.sol                  | 2016 ++++++++++++++----
 .../GrvtZkEvm/GettersFacet.2.sol                   | 1153 +++++++++-
 .../GrvtZkEvm/MailboxFacet.3.sol                   | 2195 ++++++++++++++------
 .../grvt/ethereum/.flat/ValidatorTimelock.sol      |  504 +++++
 .../{.flat@22022296 => .flat}/Verifier.sol         |   41 +-
 6 files changed, 6181 insertions(+), 1170 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22022296 (main branch discovery), not current.

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      name:
-        "ValidatorTimelock"
+        "ValidatorTimelock2"
    }
```

Generated with discovered.json: 0x1b611db648a694ed5552389c7be622b6c9215dc0

# Diff at Wed, 19 Mar 2025 13:04:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 22022296
- current block number: 22022296

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22022296 (main branch discovery), not current.

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x2892a8fc5f323c958c841449cd16773c98bc45ad

# Diff at Tue, 11 Mar 2025 08:00:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 21766583
- current block number: 22022296

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
 .../.flat@21766583/Guardians.sol => /dev/null      | 1439 --------------------
 .../ProtocolUpgradeHandler.sol => /dev/null        |  605 --------
 .../SecurityCouncil.sol => /dev/null               | 1389 -------------------
 4 files changed, 4666 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766583 (main branch discovery), not current.

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

Generated with discovered.json: 0x9a924385421b3c06b52864bd53a7e362ac4f4ae8

# Diff at Tue, 04 Mar 2025 10:39:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766583
- current block number: 21766583

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766583 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      sinceBlock:
+        21081436
    }
```

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
    +++ description: None
      sinceBlock:
+        20996715
    }
```

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      sinceBlock:
+        21313725
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
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
      sinceBlock:
+        21120440
    }
```

```diff
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65) {
    +++ description: Checks the signature of the DepositApprover for each deposit and, on succeeding, forwards the user's funds and bridging request to the L1SharedBridge contract to deposit to GRVT.
      sinceBlock:
+        21313725
    }
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sinceBlock:
+        21168735
    }
```

```diff
    contract Governance (0xe81d64195072e4d09639b31Abb257d0096FEa9d1) {
    +++ description: None
      sinceBlock:
+        21134244
    }
```

Generated with discovered.json: 0xb4ccceda7a88f6c1ffe15e503a5b93b50e7b57df

# Diff at Wed, 26 Feb 2025 10:32:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21766583
- current block number: 21766583

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766583 (main branch discovery), not current.

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
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xb9820f9ab3e1cdab970adef05c2dae9bea612da9

# Diff at Tue, 04 Feb 2025 12:31:32 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766583
- current block number: 21766583

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766583 (main branch discovery), not current.

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
    +++ description: None
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      issuedPermissions.3.permission:
-        "configure"
+        "interact"
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
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
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65) {
    +++ description: Checks the signature of the DepositApprover for each deposit and, on succeeding, forwards the user's funds and bridging request to the L1SharedBridge contract to deposit to GRVT.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Governance (0xe81d64195072e4d09639b31Abb257d0096FEa9d1) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x5e7644ba5c5277c6b612c7bfcf928d88f1fa0d3d

# Diff at Mon, 03 Feb 2025 14:33:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21736827
- current block number: 21766583

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
discovery. Values are for block 21736827 (main branch discovery), not current.

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.priorityQueueFrontOperation:
-        {"canonicalTxHash":"0x89614d1f53e5c4a5098d1b40b2fcf90dd3c43651d7197412f44ba5b1c992cf0e","expirationTimestamp":1738163327,"layer2Tip":0}
    }
```

Generated with discovered.json: 0x9af4c4f1901a058700e83194bd3e21459018cb4e

# Diff at Thu, 30 Jan 2025 10:43:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2da0612158e4fa23c41926c49e88a7b955a8c5dc block: 21721209
- current block number: 21736827

## Description

upgrade completed.

## Watched changes

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.getL2SystemContractsUpgradeBatchNumber:
-        533
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        533
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xd3086b71c95ce83e7f3d30ab1890ada2334695a05b65715e56f42d96b22c8674"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xd736970d8df850999330f41ea339a8663e282877

# Diff at Wed, 29 Jan 2025 09:51:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5741cb966172a3b26ba8279dd9fe4323805a53c2 block: 21721209
- current block number: 21721209

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21721209 (main branch discovery), not current.

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","via":[]}
      issuedPermissions.3.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.3.to:
-        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
+        "0xF29bFff344c7ef0186432fE30C39fda0cca0550b"
      issuedPermissions.3.description:
+        "manage the whitelist of addresses."
    }
```

Generated with discovered.json: 0x828b4c785ebeb4d554e814ff682f6c733052cd6d

# Diff at Tue, 28 Jan 2025 06:33:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21629172
- current block number: 21721209

## Description

upgrade to protocol version 25 (see zksync era for changelog).

discodrive!

## Watched changes

```diff
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.0:
+        {"_protocolVersion":107374182400,"_upgradeTimestamp":1729793768}
    }
```

```diff
-   Status: DELETED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: Implements the ZK proof verification logic.
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
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
+        ["2025-01-28T05:38:11.000Z","0x733c89da487edb502dc65f5115ada9cef6b44128a85cf36adbde4821e13abe31",["0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a","0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9","0x5575218cECd370E1d630d1AdB03c254B0B376821","0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"]]
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
+        533
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        533
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
+   Status: CREATED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: Implements the ZK proof verification logic.
```

## Source code changes

```diff
.../GrvtZkEvm/AdminFacet.1.sol                     | 166 +++++++---
 .../GrvtZkEvm/ExecutorFacet.4.sol                  | 343 ++++++++++++++-------
 .../GrvtZkEvm/GettersFacet.2.sol                   | 117 +++++--
 .../GrvtZkEvm/MailboxFacet.3.sol                   | 255 +++++++++++----
 4 files changed, 627 insertions(+), 254 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629172 (main branch discovery), not current.

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"upgrade","from":"0xE17aeD2fC55f4A876315376ffA49FE6358113a65"}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0x3Cd52B238Ac856600b22756133eEb31ECb25109a"}
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.from:
-        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
+        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
      receivedPermissions.1.description:
+        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
      receivedPermissions.1.via:
+        [{"address":"0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"}]
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.from:
-        "0x3Cd52B238Ac856600b22756133eEb31ECb25109a"
+        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
      receivedPermissions.0.description:
+        "set the conversion factor for gas token deposits."
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"}]
    }
```

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      issuedPermissions.3:
+        {"permission":"upgrade","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","via":[]}
      issuedPermissions.2:
+        {"permission":"configure","to":"0xF29bFff344c7ef0186432fE30C39fda0cca0550b","description":"address is part of the GRVTTransactionFilterer whitelist.","via":[]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0xe81d64195072e4d09639b31Abb257d0096FEa9d1","description":"address is part of the GRVTTransactionFilterer whitelist.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
+        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
      issuedPermissions.0.description:
+        "address is part of the GRVTTransactionFilterer whitelist."
      values.acAdmin:
+        ["0xF29bFff344c7ef0186432fE30C39fda0cca0550b"]
      values.whitelistedSender:
+        ["0xe81d64195072e4d09639b31Abb257d0096FEa9d1","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xE17aeD2fC55f4A876315376ffA49FE6358113a65","0xF29bFff344c7ef0186432fE30C39fda0cca0550b"]
      severity:
+        "HIGH"
      receivedPermissions:
+        [{"permission":"configure","from":"0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E","description":"define addresses that can send transactions from L1 to L2 (e.g. for deposits, withdrawals, queued transactions). This is enforced in the Mailbox Facet."}]
    }
```

```diff
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      issuedPermissions:
+        [{"permission":"configure","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","description":"set the conversion factor for gas token deposits.","via":[]}]
      directlyReceivedPermissions:
+        [{"permission":"configure","from":"0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."}]
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
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65) {
    +++ description: Checks the signature of the DepositApprover for each deposit and, on succeeding, forwards the user's funds and bridging request to the L1SharedBridge contract to deposit to GRVT.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
+        "0x5c8de5821dd9263F124E8ddbff11C3368Ff86a37"
      issuedPermissions.0.description:
+        "approve deposits to GRVT via the GRVTBridgeProxy."
      description:
+        "Checks the signature of the DepositApprover for each deposit and, on succeeding, forwards the user's funds and bridging request to the L1SharedBridge contract to deposit to GRVT."
      receivedPermissions:
+        [{"permission":"configure","from":"0x3Cd52B238Ac856600b22756133eEb31ECb25109a","description":"address is part of the GRVTTransactionFilterer whitelist."}]
    }
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
+++ description: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2.
+++ severity: HIGH
      values.txFilterer.0:
-        {"oldTransactionFilterer":"0x0000000000000000000000000000000000000000","newTransactionFilterer":"0x3Cd52B238Ac856600b22756133eEb31ECb25109a"}
+        "0x3Cd52B238Ac856600b22756133eEb31ECb25109a"
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
+        [{"permission":"configure","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"}]},{"permission":"configure","to":"0x3Cd52B238Ac856600b22756133eEb31ECb25109a","description":"define addresses that can send transactions from L1 to L2 (e.g. for deposits, withdrawals, queued transactions). This is enforced in the Mailbox Facet.","via":[]},{"permission":"configure","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]}]
    }
```

```diff
    contract Governance (0xe81d64195072e4d09639b31Abb257d0096FEa9d1) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x3Cd52B238Ac856600b22756133eEb31ECb25109a","description":"address is part of the GRVTTransactionFilterer whitelist."}]
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h.
```

Generated with discovered.json: 0x8389fd0febf49490dfb76c31b368eb6fbf1d8530

# Diff at Mon, 20 Jan 2025 11:09:34 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21629172
- current block number: 21629172

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629172 (main branch discovery), not current.

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
      receivedPermissions.1.from:
+        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
      receivedPermissions.0.target:
-        "0x3Cd52B238Ac856600b22756133eEb31ECb25109a"
      receivedPermissions.0.from:
+        "0x3Cd52B238Ac856600b22756133eEb31ECb25109a"
    }
```

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
      issuedPermissions.0.to:
+        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
    }
```

```diff
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
      issuedPermissions.0.to:
+        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
    }
```

Generated with discovered.json: 0x0b37aeb60b3c8badba363a35a5d7211e4895cd5c

# Diff at Wed, 15 Jan 2025 10:05:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21593895
- current block number: 21629172

## Description

Ignore GRVT token.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21593895 (main branch discovery), not current.

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"upgrade","target":"0xE17aeD2fC55f4A876315376ffA49FE6358113a65"}
      receivedPermissions.1.target:
-        "0xAB3B124052F0389D1cbED221d912026Ac995bb95"
+        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
    }
```

```diff
-   Status: DELETED
    contract GRVTBaseToken (0xAB3B124052F0389D1cbED221d912026Ac995bb95)
    +++ description: None
```

Generated with discovered.json: 0x01760da7c2e999a872c59c95cea8d1bfdf8fc730

# Diff at Fri, 10 Jan 2025 11:53:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21593895

## Description

Initial discovery of a standard ZK stack Validium.

## Initial discovery

```diff
+   Status: CREATED
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GRVTBaseToken (0xAB3B124052F0389D1cbED221d912026Ac995bb95)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0xe81d64195072e4d09639b31Abb257d0096FEa9d1)
    +++ description: None
```
