Generated with discovered.json: 0x962292c57ef2125a0b9e511b8eb8d3f0d5143f10

# Diff at Fri, 06 Feb 2026 11:34:34 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@36cf41246c06744c0f4e408f68eca2253bec6f39 block: 1768909466
- current timestamp: 1770376622

## Description

Updated verifier to an unverified smart contract, also updated chain creation params on ADI's chain type manager:
https://tools.l2beat.com/decoder-new/?hash=0x83c8f3f7619c6bb27a46696734863f97b0824bfd8dc68d0db491c25050f4073a&data=AwA.

## Watched changes

```diff
    contract Diamond (eth:0x0583Ef2B6416cb7B287406438B940E4d99680C5B) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.$pastUpgrades.4:
+        ["2026-02-05T09:58:23.000Z","0x3837cd476c7e8b1131d519f1dd8aed9cb1fbd779716260b0ff79196520f81b21",["eth:0xf9DD56364E3878056654C756cEBA692e577f8466","eth:0xB0D33d94aD4048070f510eF0086F12d20595dd07","eth:0xFA565846c217Bc0bA0f75027D4eECccdD68a9708","eth:0x56767eB2E3197A1dfa030faaD4A65cF38E807c81"]]
      values.$upgradeCount:
-        4
+        5
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        128849018880
+        128849018881
      values.getSemverProtocolVersion.2:
-        0
+        1
      values.getVerifier:
-        "eth:0x6Fd373b9470976Ec561F54664f931733C6149852"
+        "eth:0x5E7cF1C310F9E0BF8DbFe70D5cC8021a2109D0AE"
    }
```

```diff
    contract ZKsyncOSChainTypeManager (eth:0x08A1D2962fC29AA46e869A1E7561112cc1026EfA) {
    +++ description: [FORK] This contract is not the standard hub contract from the Elastic network but a local fork for ADI chain. Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,30,1.
      description:
-        "[FORK] This contract is not the standard hub contract from the Elastic network but a local fork for ADI chain. Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,30,0."
+        "[FORK] This contract is not the standard hub contract from the Elastic network but a local fork for ADI chain. Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,30,1."
      values.getSemverProtocolVersion.2:
-        0
+        1
      values.initialCutHash:
-        "0x28f0af46a96ece2c72a1a7c9c9bfe937162082c4b8925da3b8621599b2869cf5"
+        "0xedf457bf18d9feac26a2fb4a43686971a5eb0f0e21d80393cc8118ecaff31e29"
      values.protocolVersion:
-        128849018880
+        128849018881
      values.storedBatchZero:
-        "0x492e189b00c1e79ab2da8e9475e345cbc4ad91b89650d086d956f2dd58ce2d89"
+        "0x18bd4bd6909643336ab04fcab99eff346bc4e74799aeeb2ed809341e3a1df6f9"
    }
```

```diff
    contract ChainAdminOwnable (eth:0x0a8a2473cc5731575a94f58F470851Bc6695B5B8) {
    +++ description: A governance proxy that lets eth:0xF50293Ac52f987122DcD67Eda0cFb34E9d7a0Cf9 act through it.
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.2:
+        {"_protocolVersion":128849018881,"_upgradeTimestamp":0}
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.3:
+        {"_protocolVersion":128849018881,"_upgradeTimestamp":1}
    }
```

```diff
-   Status: DELETED
    contract ZKsyncOSDualVerifier (eth:0x6Fd373b9470976Ec561F54664f931733C6149852)
    +++ description: A router contract for verifiers. Routes verification requests to THE PLONK VERIFIER ONLY depending on the supplied proof version.
```

```diff
    contract Governance (eth:0x8253F33026c49A430963FE3991441c02175bda95) {
    +++ description: Allows scheduling transparent and shadow proposals, 'securityCouncil' role can execute without delay.
+++ description: Number of executed proposals
      values.executedCount:
-        7
+        8
+++ description: Number of scheduled transparent proposals
      values.scheduledTransparentCount:
-        7
+        8
    }
```

```diff
-   Status: DELETED
    contract ZKsyncOSVerifierPlonk (eth:0x84871A20Cd4DB1Ac1Db641841Fc7d900e230F92D)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
-   Status: DELETED
    contract ZKsyncOSVerifierFflonk (eth:0xF6b3708BE4192CE4526c2F87D4c3eABA79230E6A)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract ADI DialVerifier (eth:0x5E7cF1C310F9E0BF8DbFe70D5cC8021a2109D0AE)
    +++ description: None
```

## Source code changes

```diff
.../ZKsyncOSDualVerifier.sol => /dev/null          |  268 ---
 .../ZKsyncOSVerifierFflonk.sol => /dev/null        | 1622 -------------------
 .../ZKsyncOSVerifierPlonk.sol => /dev/null         | 1703 --------------------
 3 files changed, 3593 deletions(-)
```

Generated with discovered.json: 0x308c486a8e152da9ab3dbdbb55fd440a7bf5e292

# Diff at Tue, 20 Jan 2026 16:30:05 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@a5d37b36a43301b2def017b94f066897f111cc32 block: 1766054776
- current timestamp: 1768909466

## Description

Upgraded Diamond to version 30.0. This includes:

- Admin facet minor refactor https://disco.l2beat.com/diff/eth:0x8C653b99f18Eb3bAb927519990bfC281500b0De6/eth:0xf9DD56364E3878056654C756cEBA692e577f8466
- Getters facet minor refactor: https://disco.l2beat.com/diff/eth:0x1807f10E686E5Cd6A655cF7343f093a7372cAf34/eth:0xFA565846c217Bc0bA0f75027D4eECccdD68a9708
- Mailbox facet minor refactor: https://disco.l2beat.com/diff/eth:0x3Be4B380F277Cb02dF56712667f7F8FA1Ca1536d/eth:0xB0D33d94aD4048070f510eF0086F12d20595dd07
- Executor facet: https://disco.l2beat.com/diff/eth:0x6fB87A1dd4DE3bDbB96f2FA9ac7FCb74b7d4C792/eth:0x56767eB2E3197A1dfa030faaD4A65cF38E807c81. More explicit DA handling for zksync OS chains.
- ChainTypeManager minor refactor: https://disco.l2beat.com/diff/eth:0x191D1D51a9CBe988E69ad3D27eFab60663e5ed61/eth:0x721e27269ce348F71bdAAd7B7b033Afa60e404e0
- L1GenesisUpgrade minor refactor: https://disco.l2beat.com/diff/eth:0x5C9B360aB320a23692c9E81006ddB15de991ab65/eth:0x03174e2BE35A2Dd4380c93385181B1299949eE28
- ValidatorTimelock minor refactor: https://disco.l2beat.com/diff/eth:0x406f329645E323B1bd1C020a219e30E6DAf4f899/eth:0x6CB28384f21B18924FA312AA2E10D4E813e66263
- RollupDAManager minor refactor: https://disco.l2beat.com/diff/eth:0x96A4B3Dd2F3cd3717b7D0c9d1aF8e110CAaD787e/eth:0x57B05e2394B3A12708C552A891f8b0f93645EdEA

AFAI can see the main change is the introduction of explicit L2DACommitmentScheme and DA handling for zksync OS chains.

## Watched changes

```diff
    contract Diamond (eth:0x0583Ef2B6416cb7B287406438B940E4d99680C5B) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.1:
-        "0x76fff5526d80b9fe957c75fa758aa5c38311d3267060edefc11f4b9aac8c5c34"
+        "0x33ec87bcda0bcb30b842846b09d0c7c222129732c34db1ae495d82f3daccadb0"
      values.$implementation.0:
-        "eth:0x8C653b99f18Eb3bAb927519990bfC281500b0De6"
+        "eth:0xf9DD56364E3878056654C756cEBA692e577f8466"
      values.$implementation.1:
-        "eth:0x1807f10E686E5Cd6A655cF7343f093a7372cAf34"
+        "eth:0xB0D33d94aD4048070f510eF0086F12d20595dd07"
      values.$implementation.2:
-        "eth:0x3Be4B380F277Cb02dF56712667f7F8FA1Ca1536d"
+        "eth:0xFA565846c217Bc0bA0f75027D4eECccdD68a9708"
      values.$implementation.3:
-        "eth:0x6fB87A1dd4DE3bDbB96f2FA9ac7FCb74b7d4C792"
+        "eth:0x56767eB2E3197A1dfa030faaD4A65cF38E807c81"
      values.$pastUpgrades.3:
+        ["2026-01-20T08:50:23.000Z","0x5a347ad3e11919a37fd5cc2e3f933678ebbbf11b6bcd4f2e1cf6f9f80b6e7462",["eth:0xf9DD56364E3878056654C756cEBA692e577f8466","eth:0xB0D33d94aD4048070f510eF0086F12d20595dd07","eth:0xFA565846c217Bc0bA0f75027D4eECccdD68a9708","eth:0x56767eB2E3197A1dfa030faaD4A65cF38E807c81"]]
      values.$upgradeCount:
-        3
+        4
      values.facetAddresses.0:
-        "eth:0x8C653b99f18Eb3bAb927519990bfC281500b0De6"
+        "eth:0xf9DD56364E3878056654C756cEBA692e577f8466"
      values.facetAddresses.1:
-        "eth:0x1807f10E686E5Cd6A655cF7343f093a7372cAf34"
+        "eth:0xB0D33d94aD4048070f510eF0086F12d20595dd07"
      values.facetAddresses.2:
-        "eth:0x3Be4B380F277Cb02dF56712667f7F8FA1Ca1536d"
+        "eth:0xFA565846c217Bc0bA0f75027D4eECccdD68a9708"
      values.facetAddresses.3:
-        "eth:0x6fB87A1dd4DE3bDbB96f2FA9ac7FCb74b7d4C792"
+        "eth:0x56767eB2E3197A1dfa030faaD4A65cF38E807c81"
      values.facets.eth:0x8C653b99f18Eb3bAb927519990bfC281500b0De6:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","getRollupDAManager()","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.eth:0x1807f10E686E5Cd6A655cF7343f093a7372cAf34:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.eth:0x3Be4B380F277Cb02dF56712667f7F8FA1Ca1536d:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2MessageInclusionShared(uint256,uint256,uint256,(uint16,address,bytes),bytes32[])","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusionShared(uint256,uint256,uint256,bytes32,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])","proveL2LogInclusionShared(uint256,uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])"]
      values.facets.eth:0x6fB87A1dd4DE3bDbB96f2FA9ac7FCb74b7d4C792:
-        ["precommitSharedBridge(address,uint256,bytes)","commitBatchesSharedBridge(address,uint256,uint256,bytes)","executeBatchesSharedBridge(address,uint256,uint256,bytes)","revertBatchesSharedBridge(address,uint256)","proveBatchesSharedBridge(address,uint256,uint256,bytes)"]
      values.facets.eth:0xf9DD56364E3878056654C756cEBA692e577f8466:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","setDAValidatorPair(address,uint8)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","getRollupDAManager()","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.eth:0xB0D33d94aD4048070f510eF0086F12d20595dd07:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2MessageInclusionShared(uint256,uint256,uint256,(uint16,address,bytes),bytes32[])","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusionShared(uint256,uint256,uint256,bytes32,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])","proveL2LogInclusionShared(uint256,uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])"]
      values.facets.eth:0xFA565846c217Bc0bA0f75027D4eECccdD68a9708:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.eth:0x56767eB2E3197A1dfa030faaD4A65cF38E807c81:
+        ["precommitSharedBridge(address,uint256,bytes)","commitBatchesSharedBridge(address,uint256,uint256,bytes)","executeBatchesSharedBridge(address,uint256,uint256,bytes)","revertBatchesSharedBridge(address,uint256)","proveBatchesSharedBridge(address,uint256,uint256,bytes)"]
+++ description: l1da, l2da
+++ severity: HIGH
      values.getDAValidatorPair.0:
-        "eth:0x45D594304087A359dC60a502f5c35d62DfeCDDA7"
+        "eth:0xFB630a206E6D7485cB9DFa929859E1a977F0a211"
+++ description: l1da, l2da
+++ severity: HIGH
      values.getDAValidatorPair.1:
-        "eth:0x7eDcafE015D1F66f5dc8eB419d0deA445b9b7F49"
+        4
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        124554051584
+        128849018880
      values.getRollupDAManager:
-        "eth:0x96A4B3Dd2F3cd3717b7D0c9d1aF8e110CAaD787e"
+        "eth:0x57B05e2394B3A12708C552A891f8b0f93645EdEA"
      values.getSemverProtocolVersion.1:
-        29
+        30
      values.getVerifier:
-        "eth:0x28E31e2B74bc38c6cd58CF282807fCBa8C00C529"
+        "eth:0x6Fd373b9470976Ec561F54664f931733C6149852"
      implementationNames.eth:0x8C653b99f18Eb3bAb927519990bfC281500b0De6:
-        "AdminFacet"
      implementationNames.eth:0x1807f10E686E5Cd6A655cF7343f093a7372cAf34:
-        "GettersFacet"
      implementationNames.eth:0x3Be4B380F277Cb02dF56712667f7F8FA1Ca1536d:
-        "MailboxFacet"
      implementationNames.eth:0x6fB87A1dd4DE3bDbB96f2FA9ac7FCb74b7d4C792:
-        "ExecutorFacet"
      implementationNames.eth:0xf9DD56364E3878056654C756cEBA692e577f8466:
+        "AdminFacet"
      implementationNames.eth:0xB0D33d94aD4048070f510eF0086F12d20595dd07:
+        "MailboxFacet"
      implementationNames.eth:0xFA565846c217Bc0bA0f75027D4eECccdD68a9708:
+        "GettersFacet"
      implementationNames.eth:0x56767eB2E3197A1dfa030faaD4A65cF38E807c81:
+        "ExecutorFacet"
    }
```

```diff
    contract ZKsyncOSChainTypeManager (eth:0x08A1D2962fC29AA46e869A1E7561112cc1026EfA) {
    +++ description: [FORK] This contract is not the standard hub contract from the Elastic network but a local fork for ADI chain. Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,30,0.
      name:
-        "ChainTypeManager"
+        "ZKsyncOSChainTypeManager"
      sourceHashes.1:
-        "0x02b4caf5d4d2907355dd4d367636aba133b66f2d7152f316ff2b714915c26d61"
+        "0xce7505b0d1b5400403ca2c4d2c36a9e7cc633e215f5da2ab4d2256a0389e7dad"
      description:
-        "[FORK] This contract is not the standard hub contract from the Elastic network but a local fork for ADI chain. Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,29,0."
+        "[FORK] This contract is not the standard hub contract from the Elastic network but a local fork for ADI chain. Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,30,0."
      values.$implementation:
-        "eth:0x191D1D51a9CBe988E69ad3D27eFab60663e5ed61"
+        "eth:0x721e27269ce348F71bdAAd7B7b033Afa60e404e0"
      values.$pastUpgrades.1:
+        ["2026-01-20T08:29:47.000Z","0x9443189514311b66d96da238adb1a18e3043616a45b62a6e99cd6f64b5996e81",["eth:0x721e27269ce348F71bdAAd7B7b033Afa60e404e0"]]
      values.$upgradeCount:
-        1
+        2
      values.getSemverProtocolVersion.1:
-        29
+        30
      values.initialCutHash:
-        "0x104e964adff545a2d8c61cde628773c8206571f2cd9bcc1910a692c5edffe612"
+        "0x28f0af46a96ece2c72a1a7c9c9bfe937162082c4b8925da3b8621599b2869cf5"
      values.initialForceDeploymentHash:
-        "0xe4631d0e46e6d7cc59d51a81acdc97e93aff07a859e12706b5ad2601501e36f5"
+        "0xb17899fd9e58ac2342eee6c162a433bd929224f181a7ad5e30d8e33e27d8fab2"
      values.l1GenesisUpgrade:
-        "eth:0x5C9B360aB320a23692c9E81006ddB15de991ab65"
+        "eth:0x03174e2BE35A2Dd4380c93385181B1299949eE28"
      values.protocolVersion:
-        124554051584
+        128849018880
      implementationNames.eth:0x191D1D51a9CBe988E69ad3D27eFab60663e5ed61:
-        "ChainTypeManager"
      implementationNames.eth:0x721e27269ce348F71bdAAd7B7b033Afa60e404e0:
+        "ZKsyncOSChainTypeManager"
    }
```

```diff
    contract ChainAdminOwnable (eth:0x0a8a2473cc5731575a94f58F470851Bc6695B5B8) {
    +++ description: A governance proxy that lets eth:0xF50293Ac52f987122DcD67Eda0cFb34E9d7a0Cf9 act through it.
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.0:
+        {"_protocolVersion":128849018880,"_upgradeTimestamp":0}
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.1:
+        {"_protocolVersion":128849018880,"_upgradeTimestamp":1}
    }
```

```diff
-   Status: DELETED
    contract DualVerifier (eth:0x28E31e2B74bc38c6cd58CF282807fCBa8C00C529)
    +++ description: A router contract for verifiers. Routes verification requests to the corresponding fflonk or plonk verifiers depending on the supplied proof type and version.
```

```diff
-   Status: DELETED
    contract RollupL1DAValidator (eth:0x45D594304087A359dC60a502f5c35d62DfeCDDA7)
    +++ description: Contract that verifies the data availability of ethereum calldata and blobs. Can be used by ZK stack rollups as the L1 part of a DAValidator pair.
```

```diff
-   Status: DELETED
    contract L1GenesisUpgrade (eth:0x5C9B360aB320a23692c9E81006ddB15de991ab65)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

```diff
-   Status: DELETED
    contract L1VerifierFflonk (eth:0x60aDfa0b7dEd57e0f1e251417769B6dbd1056208)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
    contract Governance (eth:0x8253F33026c49A430963FE3991441c02175bda95) {
    +++ description: Allows scheduling transparent and shadow proposals, 'securityCouncil' role can execute without delay.
+++ description: Number of executed proposals
      values.executedCount:
-        6
+        7
+++ description: Number of scheduled transparent proposals
      values.scheduledTransparentCount:
-        6
+        7
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x57B05e2394B3A12708C552A891f8b0f93645EdEA","description":"manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode).","role":".owner"}
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0x96A4B3Dd2F3cd3717b7D0c9d1aF8e110CAaD787e","description":"manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode).","role":".owner"}
    }
```

```diff
-   Status: DELETED
    contract L1VerifierPlonk (eth:0x8F870CF6621AEaF6026dFfc77f484FdAb370c4Ba)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
-   Status: DELETED
    contract RollupDAManager (eth:0x96A4B3Dd2F3cd3717b7D0c9d1aF8e110CAaD787e)
    +++ description: Simple registry for allowed DA address pairs for the 'rollup' data availability mode (can be permanently enforced with isPermanentRollup=true). Rollup DA address pairs (especially the L1 part) usually point to contracts that validate if data was made available on Ethereum.
```

```diff
    contract ValidatorTimelock (eth:0xE28cAc160C2a79dFA1fbd2169AC5fa5d061cf186) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
      sourceHashes.1:
-        "0x61d15f463b4112c36915d9f1a8016942addb43b4300b197971ab5d4e00eeb2d6"
+        "0x48e14ef8734c4e2891920ea10bac8fb0c1d36e0a18c1e38ec85253ee2be5056d"
      values.$implementation:
-        "eth:0x406f329645E323B1bd1C020a219e30E6DAf4f899"
+        "eth:0x6CB28384f21B18924FA312AA2E10D4E813e66263"
      values.$pastUpgrades.1:
+        ["2026-01-20T08:29:47.000Z","0x9443189514311b66d96da238adb1a18e3043616a45b62a6e99cd6f64b5996e81",["eth:0x6CB28384f21B18924FA312AA2E10D4E813e66263"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.eth:0x406f329645E323B1bd1C020a219e30E6DAf4f899:
-        "ValidatorTimelock"
      implementationNames.eth:0x6CB28384f21B18924FA312AA2E10D4E813e66263:
+        "ValidatorTimelock"
    }
```

```diff
+   Status: CREATED
    contract L1GenesisUpgrade (eth:0x03174e2BE35A2Dd4380c93385181B1299949eE28)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

```diff
+   Status: CREATED
    contract RollupDAManager (eth:0x57B05e2394B3A12708C552A891f8b0f93645EdEA)
    +++ description: Simple registry for allowed DA validators for different data availability modes. Scheme 3 is used by default RollupL1DAValidator, the commitment includes EIP-4844 blobs data. Scheme 4 is used only for ZKsyncOS, it is keccak of blob versioned hashes filled with pubdata.
```

```diff
+   Status: CREATED
    contract ZKsyncOSDualVerifier (eth:0x6Fd373b9470976Ec561F54664f931733C6149852)
    +++ description: A router contract for verifiers. Routes verification requests to THE PLONK VERIFIER ONLY depending on the supplied proof version.
```

```diff
+   Status: CREATED
    contract ZKsyncOSVerifierPlonk (eth:0x84871A20Cd4DB1Ac1Db641841Fc7d900e230F92D)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract ZKsyncOSVerifierFflonk (eth:0xF6b3708BE4192CE4526c2F87D4c3eABA79230E6A)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract BlobsL1DAValidatorZKsyncOS (eth:0xFB630a206E6D7485cB9DFa929859E1a977F0a211)
    +++ description: DA verifier specifically for zksync OS chains. It keeps track of blob versioned hashes and checks if blob with particular hash was published.
```

## Source code changes

```diff
.../adi/.flat/BlobsL1DAValidatorZKsyncOS.sol       |  126 +
 .../Diamond/AdminFacet.1.sol                       |   60 +-
 .../Diamond/ExecutorFacet.4.sol                    |  105 +-
 .../Diamond/GettersFacet.3.sol}                    |   24 +-
 .../Diamond/MailboxFacet.2.sol}                    |   37 +-
 .../.flat@1766054776/DualVerifier.sol => /dev/null |  198 --
 .../L1GenesisUpgrade.sol                           |   25 +-
 .../RollupDAManager.sol                            |   50 +-
 .../RollupL1DAValidator.sol => /dev/null           |  337 ---
 .../ValidatorTimelock/ValidatorTimelock.sol        |   34 +-
 .../TransparentUpgradeableProxy.p.sol              |    0
 .../ZKsyncOSChainTypeManager.sol}                  | 2416 ++++++++++----------
 .../projects/adi/.flat/ZKsyncOSDualVerifier.sol    |  268 +++
 .../ZKsyncOSVerifierFflonk.sol}                    |    2 +-
 .../ZKsyncOSVerifierPlonk.sol}                     |   10 +-
 15 files changed, 1868 insertions(+), 1824 deletions(-)
```

Generated with discovered.json: 0xb31d2340e7dc3edc6713fd3604b876232964b7bd

# Diff at Fri, 19 Dec 2025 13:22:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1766054776

## Description

Initial disco for ADI chain. Diff from zksync2:

- BridgeHub: no serious changes (https://disco.l2beat.com/diff/eth:0xc89423b4909080fB8F8A43dF5E1C27001e55C24B/eth:0xcf1c73439c85f7eB9d4439dAf398Fd6392d176E6)
- L1MessageRoot: no serious changes (https://disco.l2beat.com/diff/eth:0x669ed5BB1377C917333e7d4223ce3419EE4099fD/eth:0x5BaC331B75f3bF88148bfb0be2a76be4FBb05417)
- L1ChainAssetHandler: no serious changes (https://disco.l2beat.com/diff/eth:0xaa180C70126f751C164465638770B865965A744B/eth:0x0C06695f21B118a9A10101D303f00575A566D1A0)
- L1NativeTokenVault: no serious changes (https://disco.l2beat.com/diff/eth:0x8E1C5A8c5d8C33ed0eC756d6f4006f2D875bA083/eth:0x2FC2a2dB562046C732d3aB0f4e1c1F62C3eE8e3E)
- L1AssetRouter: no serious changes (https://disco.l2beat.com/diff/eth:0x2386Bc2E26f39b72f0D4FDE0c07D68e4eEFfC725/eth:0x47eec6F57c7E84391Ba6C9Ac976537d0DB0bb257)
- L1GenesisUpgrade: minor changes due to adding zksync OS (https://disco.l2beat.com/diff/eth:0x390bc10e854e137d2625573272b3fEe2C615eBA4/eth:0x5C9B360aB320a23692c9E81006ddB15de991ab65)
- ServerNotifier: added tracking of scheduled protocol upgrade timestamps (https://disco.l2beat.com/diff/eth:0x555D040F4A089D1dF14B372a87C5aF8FA37BDB7A/eth:0xDc64B98F394A8bf980F777631352029C9114e2e6)
- ValidatorTimelock: cosmetic diff (https://disco.l2beat.com/diff/eth:0x6086051f93412F550C0820e76f0fbE85F64C7ef8/eth:0x406f329645E323B1bd1C020a219e30E6DAf4f899)
- ChainTypeManager: removed one minor genesis state check (https://disco.l2beat.com/diff/eth:0x4aB7204e4205c96C32E23ADa9191720976dC084f/eth:0x191D1D51a9CBe988E69ad3D27eFab60663e5ed61)
- Diamond proxy: cleaned up errors (https://disco.l2beat.com/diff/eth:0x32400084C286CF3E17e7B677ea9583e60a000324/eth:0x0583Ef2B6416cb7B287406438B940E4d99680C5B)
- Admin, Getters facets: added zksync OS flag and two new tx types: priority and upgrade (https://disco.l2beat.com/diff/eth:0x37CefD5b44c131FEf27e9Bc542e5B77A177A7253/eth:0x8C653b99f18Eb3bAb927519990bfC281500b0De6, https://disco.l2beat.com/diff/eth:0x1666124221622eb6154306Ea9BA87043e8be88B2/eth:0x1807f10E686E5Cd6A655cF7343f093a7372cAf34)
- Mailbox facet: modified minimal trx gas computation for zksyncOS (https://disco.l2beat.com/diff/eth:0x1e34aB39a9682149165ddeCc0583d238A5448B45/eth:0x3Be4B380F277Cb02dF56712667f7F8FA1Ca1536d)
- Executor facet: added logic to commit batches with zksyncOS (https://disco.l2beat.com/diff/eth:0x0597CaA8A823A699d7CD9E62B5E5d4153FF82691/eth:0x6fB87A1dd4DE3bDbB96f2FA9ac7FCb74b7d4C792)
- DualVerifier: added owner to add and remove plonk and fflonk verifiers with different versions (https://disco.l2beat.com/diff/eth:0x4d335C5C08FEc91a39965351AbB6E315ad2e9ff3/eth:0x28E31e2B74bc38c6cd58CF282807fCBa8C00C529)

Has Governance contract that is set as owner for many contracts, allows transparent and shadow proposals.

## Initial discovery

```diff
+   Status: CREATED
    contract Diamond (eth:0x0583Ef2B6416cb7B287406438B940E4d99680C5B)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract ChainTypeManager (eth:0x08A1D2962fC29AA46e869A1E7561112cc1026EfA)
    +++ description: [FORK] This contract is not the standard hub contract from the Elastic network but a local fork for ADI chain. Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,29,0.
```

```diff
+   Status: CREATED
    contract L1NativeTokenVault (eth:0x0A0F8912162Ff83A036883dbaDA42efF647a3065)
    +++ description: Canonical central asset escrow for all ZK stack chains.
```

```diff
+   Status: CREATED
    contract ChainAdminOwnable (eth:0x0a8a2473cc5731575a94f58F470851Bc6695B5B8)
    +++ description: A governance proxy that lets eth:0xF50293Ac52f987122DcD67Eda0cFb34E9d7a0Cf9 act through it.
```

```diff
+   Status: CREATED
    contract DualVerifier (eth:0x28E31e2B74bc38c6cd58CF282807fCBa8C00C529)
    +++ description: A router contract for verifiers. Routes verification requests to the corresponding fflonk or plonk verifiers depending on the supplied proof type and version.
```

```diff
+   Status: CREATED
    contract ChainAdminOwnable (eth:0x2d6E82F1f8fba89a67cc8d742B12633db4732Ca7)
    +++ description: A governance proxy that lets eth:0xB272B188855128c10a933Edb62CC64c22B1f3754 act through it.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x34f56Ba641aC59E897c6179ffeCAe9769fbfC90C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupL1DAValidator (eth:0x45D594304087A359dC60a502f5c35d62DfeCDDA7)
    +++ description: Contract that verifies the data availability of ethereum calldata and blobs. Can be used by ZK stack rollups as the L1 part of a DAValidator pair.
```

```diff
+   Status: CREATED
    contract L1GenesisUpgrade (eth:0x5C9B360aB320a23692c9E81006ddB15de991ab65)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

```diff
+   Status: CREATED
    contract L1Nullifier (eth:0x5E5a72077dFB354Dfe61200b8f31fa491F9B9Cea)
    +++ description: Contract responsible for bookkeeping L1 bridging transactions. Used to finalize withdrawals and reclaim failed deposits. Does not escrow funds.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (eth:0x60aDfa0b7dEd57e0f1e251417769B6dbd1056208)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract L1MessageRoot (eth:0x783e8Cb57366888F84d815fd53c3aeE99b2d6d37)
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
```

```diff
+   Status: CREATED
    contract BridgeHub (eth:0x7a38c18a229Ef8a0AE7104Ba272A46280f2d59Cb)
    +++ description: [FORK] This contract is not the standard hub contract from the Elastic network but a local fork for ADI chain. The main registry (hub) for chain contracts (supports more than ADI chain) and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x8140aBB60c9AfB5241D90af948Cfa7644b2D3217)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (eth:0x8253F33026c49A430963FE3991441c02175bda95)
    +++ description: Allows scheduling transparent and shadow proposals, 'securityCouncil' role can execute without delay.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (eth:0x8F870CF6621AEaF6026dFfc77f484FdAb370c4Ba)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract L1ChainAssetHandler (eth:0x924E0145347243a94C5C69e372Ca52c77f8e6CF1)
    +++ description: Specialized contract for managing chain assets, i.e. chain migrations.
```

```diff
+   Status: CREATED
    contract RollupDAManager (eth:0x96A4B3Dd2F3cd3717b7D0c9d1aF8e110CAaD787e)
    +++ description: Simple registry for allowed DA address pairs for the 'rollup' data availability mode (can be permanently enforced with isPermanentRollup=true). Rollup DA address pairs (especially the L1 part) usually point to contracts that validate if data was made available on Ethereum.
```

```diff
+   Status: CREATED
    contract CTMDeploymentTracker (eth:0xaCD4a320f8a45abE71756B85DF519201d041EA5f)
    +++ description: Asset deployment tracker where the 'asset' is a ChainTypeManager. The registering of asset IDs for ChainTypeManagers is necessary to be able to migrate them to a given settlement layer, for example the Gateway.
```

```diff
+   Status: CREATED
    contract ADI Multisig 2 (eth:0xB272B188855128c10a933Edb62CC64c22B1f3754)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ServerNotifier (eth:0xd477bd7f14F9A26ebd51827EFB1d40a41f71b70C)
    +++ description: A simple contract that can be called by the ChainAdmin to emit notifications about chain migrations.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (eth:0xE28cAc160C2a79dFA1fbd2169AC5fa5d061cf186)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 0s.
```

```diff
+   Status: CREATED
    contract L1AssetRouter (eth:0xf25227EFAD2046d19777A4CA540b5C016Df7fe7A)
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
```

```diff
+   Status: CREATED
    contract ADI Multisig 1 (eth:0xF50293Ac52f987122DcD67Eda0cFb34E9d7a0Cf9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (eth:0xfA8B5EA9b8d36a72Eb0ba66Cc7aBc83d9deeC3B8)
    +++ description: Legacy bridge for depositing ERC20 tokens to ADI Chain.
```
