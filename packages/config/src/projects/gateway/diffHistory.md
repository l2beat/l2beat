Generated with discovered.json: 0x5185cf613a03f1b8682b445d84ca58147d2dbe47

# Diff at Tue, 28 Oct 2025 09:19:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@090e135db1084f4a9678d6bf1cb0ff5e854903ea block: 1761288563
- current timestamp: 1761643087

## Description

abstract operators added (we might want to remove the full accesscontrol from the template).

## Watched changes

```diff
    contract ValidatorTimelock (eth:0x2e5110cF18678Ec99818bFAa849B8C881744b776) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      values.accessControl.eth:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9:
+        {"PRECOMMITTER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807","eth:0x4b2d036D2c27192549ad5A2F2D9875E1843833De"]},"COMMITTER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807","eth:0x4b2d036D2c27192549ad5A2F2D9875E1843833De"]},"REVERTER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807","eth:0x4b2d036D2c27192549ad5A2F2D9875E1843833De"]},"PROVER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807","eth:0x4b2d036D2c27192549ad5A2F2D9875E1843833De"]},"EXECUTOR_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807","eth:0x4b2d036D2c27192549ad5A2F2D9875E1843833De"]}}
      values.accessControl.eth:0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3:
+        {"PRECOMMITTER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xCD0b5A01Abe9C14f6EFbC610C02ECf0FB69855dA","eth:0x78325837C780788Ce6afF7883FdF68890010Fe30"]},"COMMITTER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xCD0b5A01Abe9C14f6EFbC610C02ECf0FB69855dA","eth:0x78325837C780788Ce6afF7883FdF68890010Fe30"]},"REVERTER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xCD0b5A01Abe9C14f6EFbC610C02ECf0FB69855dA","eth:0x78325837C780788Ce6afF7883FdF68890010Fe30"]},"PROVER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xCD0b5A01Abe9C14f6EFbC610C02ECf0FB69855dA","eth:0x78325837C780788Ce6afF7883FdF68890010Fe30"]},"EXECUTOR_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xCD0b5A01Abe9C14f6EFbC610C02ECf0FB69855dA","eth:0x78325837C780788Ce6afF7883FdF68890010Fe30"]}}
    }
```

Generated with discovered.json: 0x47d226337fdb0a1ac0c52df595a5911818e662a2

# Diff at Fri, 24 Oct 2025 09:13:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@11b074f59e0a769fa3d144569b93ef0f7ba1e44f block: 1761059926
- current timestamp: 1761288563

## Description

v29 upgrade. see also the [zksync2 upgrade](../zksync2/diffHistory.md#diff-at-thu-23-oct-2025-114536-gmt) which uses the same version.

Config: add da vali comment.

## Watched changes

```diff
-   Status: DELETED
    contract L1VerifierFflonk (eth:0x1AC4F629Fdc77A7700B68d03bF8D1A53f2210911)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
-   Status: DELETED
    contract L1VerifierPlonk (eth:0x2db2ffdecb7446aaab01FAc3f4D55863db3C5bd6)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
    contract Gateway (eth:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Gateway settlement layer. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. Bridging transactions that target L2s settling on the Gateway are routed through this contract and proofs are aggregated on L1. Data availability for rollups on the Gateway is provided by the Gateway operators sending the data together with Gateway data.. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      sourceHashes.1:
-        "0xbc2380479529743c27e6ab96cdf08210319fadcbca0856cf50c6b1b54bf8437f"
+        "0xc7513302e4e09efc907df5e645d9f8037b1d02409f9a9089f61061c8951ef1ff"
      values.$implementation.0:
-        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x37CefD5b44c131FEf27e9Bc542e5B77A177A7253"
      values.$implementation.1:
-        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0x1666124221622eb6154306Ea9BA87043e8be88B2"
      values.$implementation.2:
-        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x1e34aB39a9682149165ddeCc0583d238A5448B45"
      values.$implementation.3:
-        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
+        "eth:0x0597CaA8A823A699d7CD9E62B5E5d4153FF82691"
      values.$pastUpgrades.5:
+        ["2025-10-21T15:51:47.000Z","0x27fd96c74019b58215b95c28a1cb8bc66491d2684759965fe079a812b7209f5c",["eth:0x37CefD5b44c131FEf27e9Bc542e5B77A177A7253","eth:0x1666124221622eb6154306Ea9BA87043e8be88B2","eth:0x1e34aB39a9682149165ddeCc0583d238A5448B45","eth:0x0597CaA8A823A699d7CD9E62B5E5d4153FF82691"]]
      values.$upgradeCount:
-        5
+        6
      values.facetAddresses.0:
-        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x37CefD5b44c131FEf27e9Bc542e5B77A177A7253"
      values.facetAddresses.1:
-        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0x1666124221622eb6154306Ea9BA87043e8be88B2"
      values.facetAddresses.2:
-        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x1e34aB39a9682149165ddeCc0583d238A5448B45"
      values.facetAddresses.3:
-        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
+        "eth:0x0597CaA8A823A699d7CD9E62B5E5d4153FF82691"
      values.facets.eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.eth:0x37CefD5b44c131FEf27e9Bc542e5B77A177A7253:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","getRollupDAManager()","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.eth:0x1666124221622eb6154306Ea9BA87043e8be88B2:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.eth:0x1e34aB39a9682149165ddeCc0583d238A5448B45:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2MessageInclusionShared(uint256,uint256,uint256,(uint16,address,bytes),bytes32[])","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusionShared(uint256,uint256,uint256,bytes32,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])","proveL2LogInclusionShared(uint256,uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])"]
      values.facets.eth:0x0597CaA8A823A699d7CD9E62B5E5d4153FF82691:
+        ["precommitSharedBridge(address,uint256,bytes)","commitBatchesSharedBridge(address,uint256,uint256,bytes)","executeBatchesSharedBridge(address,uint256,uint256,bytes)","revertBatchesSharedBridge(address,uint256)","proveBatchesSharedBridge(address,uint256,uint256,bytes)"]
      values.getL2BootloaderBytecodeHash:
-        "0x0100085f9382a7928dd83bfc529121827b5f29f18b9aa10d18aa68e1be7ddc35"
+        "0x01000911c4db4fe62c98e180cfa7e9b3a22fb15f505905d4bf36192f481551e6"
      values.getL2DefaultAccountBytecodeHash:
-        "0x010005f72e443c94460f4583fb38ef5d0c5cd9897021c41df840f91465c0392e"
+        "0x010005f73e7c299ed73db937843643bdc276cbc2cc8596287e1e0cf3afc60252"
      values.getL2EvmEmulatorBytecodeHash:
-        "0x01000d83e0329d9144ad041430fafcbc2b388e5434db8cb8a96e80157738a1da"
+        "0x01000d8bae37b82f311186426184866498b357f41d7a02ced11f3e3fbfbacd63"
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        120259084289
+        124554051586
      values.getSemverProtocolVersion.1:
-        28
+        29
      values.getSemverProtocolVersion.2:
-        1
+        2
      values.getVerifier:
-        "eth:0xD71DDC9956781bf07DbFb9fCa891f971dbE9868A"
+        "eth:0x4d335C5C08FEc91a39965351AbB6E315ad2e9ff3"
      values.validators.0:
-        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x2e5110cF18678Ec99818bFAa849B8C881744b776"
      values.getRollupDAManager:
+        "eth:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
      implementationNames.eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC:
-        "AdminFacet"
      implementationNames.eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
-        "GettersFacet"
      implementationNames.eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
-        "MailboxFacet"
      implementationNames.eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
-        "ExecutorFacet"
      implementationNames.eth:0x37CefD5b44c131FEf27e9Bc542e5B77A177A7253:
+        "AdminFacet"
      implementationNames.eth:0x1666124221622eb6154306Ea9BA87043e8be88B2:
+        "GettersFacet"
      implementationNames.eth:0x1e34aB39a9682149165ddeCc0583d238A5448B45:
+        "MailboxFacet"
      implementationNames.eth:0x0597CaA8A823A699d7CD9E62B5E5d4153FF82691:
+        "ExecutorFacet"
    }
```

```diff
-   Status: DELETED
    contract ValidatorTimelock (eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
-   Status: DELETED
    contract DualVerifier (eth:0xD71DDC9956781bf07DbFb9fCa891f971dbE9868A)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0x1AC4F629Fdc77A7700B68d03bF8D1A53f2210911 or eth:0x2db2ffdecb7446aaab01FAc3f4D55863db3C5bd6 depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (eth:0x2e5110cF18678Ec99818bFAa849B8C881744b776)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract DualVerifier (eth:0x4d335C5C08FEc91a39965351AbB6E315ad2e9ff3)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD324a7c8556A059371B207fB96FD77bE24E2042c or eth:0xe201837d151E5aC33Af3305f287Ad6F6a7Dfccd7 depending on the supplied proof type.
```

```diff
+   Status: CREATED
    reference ProxyAdmin (eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (eth:0xD324a7c8556A059371B207fB96FD77bE24E2042c)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (eth:0xe201837d151E5aC33Af3305f287Ad6F6a7Dfccd7)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    reference RollupDAManager (eth:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45)
    +++ description: None
```

## Source code changes

```diff
.../Gateway/AdminFacet.1.sol                       |   68 +-
 .../Gateway/ExecutorFacet.4.sol                    |  437 +++--
 .../Gateway/GettersFacet.2.sol                     |   43 +-
 .../Gateway/MailboxFacet.3.sol                     | 1318 ++++++++-------
 .../L1VerifierFflonk.sol                           |  101 +-
 .../L1VerifierPlonk.sol                            |    8 +-
 .../TransparentUpgradeableProxy.p.sol              |  729 +++++++++
 .../.flat/ValidatorTimelock/ValidatorTimelock.sol  | 1679 ++++++++++++++++++++
 .../ValidatorTimelock.sol => /dev/null             |  504 ------
 9 files changed, 3656 insertions(+), 1231 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761059926 (main branch discovery), not current.

```diff
    EOA  (eth:0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281) {
    +++ description: None
      type:
-        "Reference"
+        "EOA"
      targetType:
-        "EOA"
      targetProject:
-        "shared-zk-stack"
      proxyType:
+        "EOA"
    }
```

```diff
    contract Gateway (eth:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Gateway settlement layer. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. Bridging transactions that target L2s settling on the Gateway are routed through this contract and proofs are aggregated on L1. Data availability for rollups on the Gateway is provided by the Gateway operators sending the data together with Gateway data.. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      fieldMeta.getDAValidatorPair.description:
+        "l1da, l2da"
    }
```

```diff
    contract ValidatorTimelock (eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      values.validatorsVTL:
-        ["eth:0x14F19299476664665eDa17DBb7dA7e62E3253aa8","eth:0x7d95f0B9D3383D58E39a75a67760aA2153D355A2"]
    }
```

```diff
    contract ChainAdminOwnable (eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3) {
    +++ description: A governance proxy that lets eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828 act through it.
      receivedPermissions.1.description:
-        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+        "administrate operator roles for this chain in the ValidatorTimelock, manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
      description:
+        "A governance proxy that lets eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828 act through it."
    }
```

Generated with discovered.json: 0x61ce273baf85b046b7c6e86ed458766f3f1d1996

# Diff at Tue, 21 Oct 2025 15:19:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d52ad2c1af6ac3243376427c1aab587fd7b34800 block: 1760603795
- current timestamp: 1761059926

## Description

upgrade scheduled.

## Watched changes

```diff
    contract ChainAdminOwnable (eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.1:
+        {"_protocolVersion":124554051586,"_upgradeTimestamp":1760949000}
    }
```

Generated with discovered.json: 0x871c3ad38d2c5cae67b269ec6fdf4c7698238eb2

# Diff at Mon, 08 Sep 2025 14:38:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@48f0161c75908020b4454ff29490575d534b39f4 block: 1756731927
- current timestamp: 1757342233

## Description

New whitelisted sender: EOA (https://etherscan.io/address/0x5555555590930f501c88B73Ea43B3EEb5A71643c#tokentxns)

## Watched changes

```diff
    contract GatewayTransactionFilterer (eth:0x5540DE94485dB078025318428F813C5d88215823) {
    +++ description: A contract implementing the ITransactionFilterer interface, filtering with a configurable whitelist of sender addresses and a blacklist of target contract addresses. Chain migration transactions are generally whitelisted. The filter lists are managed by the owner (eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3).
+++ description: Addresses that are whitelisted as senders for requestL2Transaction() calls.
      values.whitelistedSenders.3:
+        "eth:0x5555555590930f501c88B73Ea43B3EEb5A71643c"
    }
```

Generated with discovered.json: 0x6b624b17da9f9f2cea345be2a09e07da8ab9beae

# Diff at Wed, 03 Sep 2025 15:52:19 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1756731927
- current timestamp: 1756731927

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756731927 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference BridgeHub (eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: None
```

```diff
+   Status: CREATED
    reference Matter Labs Multisig (eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281)
    +++ description: None
```

```diff
+   Status: CREATED
    reference RollupL1DAValidator (eth:0x72213dfe8CA61B0A782970dCFebFb877778f9119)
    +++ description: None
```

```diff
+   Status: CREATED
    reference L1AssetRouter (eth:0x8829AD80E425C646DAB305381ff105169FeEcE56)
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

Generated with discovered.json: 0x9b6009906d2afa39dd2668dbd6f61076237f2ffb

# Diff at Mon, 01 Sep 2025 13:06:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7eff8455e0ad9da942f60c025235f897aa05b120 block: 1756373713
- current timestamp: 1756731927

## Description

VTL validators rotated.

## Watched changes

```diff
    contract ValidatorTimelock (eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      values.validatorsVTL.0:
-        "eth:0xbF4c6806d1fF930B5bEcab99b93c5355bD08fFfE"
      values.validatorsVTL.1:
-        "eth:0xcEB302741E355E7Cf30b8479b7aD104d0C171EBF"
    }
```

Generated with discovered.json: 0x50c44ee4315ccb059099380f7f5e84eb91ceb4a2

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x9872f8126013e8e9110cecbbb68f0b6a317d9751

# Diff at Thu, 28 Aug 2025 09:36:30 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6a10f3ca78fe03a4e4a056c347e2b62212e8db09 block: 1754119529
- current timestamp: 1756373713

## Description

New validator added.

## Watched changes

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      values.validatorsVTL.2:
+        "eth:0x14F19299476664665eDa17DBb7dA7e62E3253aa8"
      values.validatorsVTL.3:
+        "eth:0x7d95f0B9D3383D58E39a75a67760aA2153D355A2"
    }
```

Generated with discovered.json: 0x7d092f89fc0801a1e7477e121a7de738b947d282

# Diff at Sat, 02 Aug 2025 07:32:17 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3d59e2b466fd3c111ff4d5621a7f80de65b0b3d5 block: 1754053524
- current timestamp: 1754119529

## Description

Emergency upgrade to [protocol version v28.1](https://app.blocksec.com/explorer/tx/eth/0x3c27a371dbd4f6b0d97a87f950065eb48db3c51ae4e962d1b6b4d4e32d2fbdb1), which only affects the verifiers and is only activated for zksync era and gateway so far.

diff fflonk: https://disco.l2beat.com/diff/eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b/eth:0x1AC4F629Fdc77A7700B68d03bF8D1A53f2210911
diff plonk: https://disco.l2beat.com/diff/eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1/eth:0x2db2ffdecb7446aaab01FAc3f4D55863db3C5bd6

## Watched changes

```diff
-   Status: DELETED
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
```

```diff
-   Status: DELETED
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
    contract Gateway (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Gateway settlement layer. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. Bridging transactions that target L2s settling on the Gateway are routed through this contract and proofs are aggregated on L1. Data availability for rollups on the Gateway is provided by the Gateway operators sending the data together with Gateway data.. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      values.$pastUpgrades.4:
+        ["2025-08-01T21:35:23.000Z","0xf2ec87ad88d9cf5a66fbd2ba7a5c1c1df026f8641e705f9bed91c52107ad9630",["eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC","eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22","eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec","eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"]]
      values.$upgradeCount:
-        4
+        5
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        120259084288
+        120259084289
      values.getSemverProtocolVersion.2:
-        0
+        1
      values.getVerifier:
-        "eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
+        "eth:0xD71DDC9956781bf07DbFb9fCa891f971dbE9868A"
    }
```

```diff
-   Status: DELETED
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
    contract ChainAdminOwnable (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.0:
+        {"_protocolVersion":120259084289,"_upgradeTimestamp":0}
    }
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0x1AC4F629Fdc77A7700B68d03bF8D1A53f2210911)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0x2db2ffdecb7446aaab01FAc3f4D55863db3C5bd6)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract DualVerifier (0xD71DDC9956781bf07DbFb9fCa891f971dbE9868A)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0x1AC4F629Fdc77A7700B68d03bF8D1A53f2210911 or eth:0x2db2ffdecb7446aaab01FAc3f4D55863db3C5bd6 depending on the supplied proof type.
```

## Source code changes

```diff
.../ethereum/{.flat@1754053524 => .flat}/L1VerifierFflonk.sol     | 4 ++--
 .../ethereum/{.flat@1754053524 => .flat}/L1VerifierPlonk.sol      | 8 ++++----
 2 files changed, 6 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0xf25e1df4d338661f17a5c23bacc5c5186fccd7ae

# Diff at Fri, 01 Aug 2025 13:11:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@802242fc2209399893865092b1048d583aafc2bb block: 1753972641
- current timestamp: 1754053524

## Description

config: give the gateway diamond a more distinct description.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753972641 (main branch discovery), not current.

```diff
    contract Gateway (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Gateway settlement layer. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. Bridging transactions that target L2s settling on the Gateway are routed through this contract and proofs are aggregated on L1. Data availability for rollups on the Gateway is provided by the Gateway operators sending the data together with Gateway data.. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      description:
-        "The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future."
+        "The main contract defining the Gateway settlement layer. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. Bridging transactions that target L2s settling on the Gateway are routed through this contract and proofs are aggregated on L1. Data availability for rollups on the Gateway is provided by the Gateway operators sending the data together with Gateway data.. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future."
    }
```

Generated with discovered.json: 0x857fcd32ab3681b55a1725a9174a9ace0befcfe9

# Diff at Thu, 31 Jul 2025 15:03:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2ac2488a487f63fe85e66406479661b19d8a457e block: 1751365391
- current timestamp: 1753972641

## Description

config: demote the gateway validator permission to not show as a role on the zksync2 proj page.

## Source code changes

```diff
.../{.flat@1751365391/Gateway => .flat/DiamondProxy}/AdminFacet.1.sol     | 0
 .../{.flat@1751365391/Gateway => .flat/DiamondProxy}/DiamondProxy.p.sol   | 0
 .../{.flat@1751365391/Gateway => .flat/DiamondProxy}/ExecutorFacet.4.sol  | 0
 .../{.flat@1751365391/Gateway => .flat/DiamondProxy}/GettersFacet.2.sol   | 0
 .../{.flat@1751365391/Gateway => .flat/DiamondProxy}/MailboxFacet.3.sol   | 0
 5 files changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1751365391 (main branch discovery), not current.

```diff
    contract Gateway (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      name:
-        "DiamondProxy"
+        "Gateway"
    }
```

```diff
    EOA  (0xbF4c6806d1fF930B5bEcab99b93c5355bD08fFfE) {
    +++ description: None
      receivedPermissions.0.description:
+        "call the functions to commit, prove, execute and revert L2 batches through the ValidatorTimelock in the Gateway Diamond contract. Since this chain settles on the Gateway, the operator trust assumptions expand to these additional operators."
      receivedPermissions.0.permission:
-        "validateZkStack"
+        "interact"
    }
```

```diff
    EOA  (0xcEB302741E355E7Cf30b8479b7aD104d0C171EBF) {
    +++ description: None
      receivedPermissions.0.description:
+        "call the functions to commit, prove, execute and revert L2 batches through the ValidatorTimelock in the Gateway Diamond contract. Since this chain settles on the Gateway, the operator trust assumptions expand to these additional operators."
      receivedPermissions.0.permission:
-        "validateZkStack"
+        "interact"
    }
```

Generated with discovered.json: 0x57a31048986479dce5296ecd7eb2ed179fc5cbf4

# Diff at Thu, 31 Jul 2025 15:03:08 GMT:

- chain: gateway
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1753972641

## Description

Initial gateway L2 disco. Era fully uses L1 governance via l2 aliases.

## Initial discovery

```diff
+   Status: CREATED
    contract L1Messenger (0x0000000000000000000000000000000000008008)
    +++ description: System contract implementing public L2->L1 messaging functionality. Part of the canonical bridge.
```

Generated with discovered.json: 0xcb0fcb81c175a0ab7c702ba2e407e7fb47e3424b

# Diff at Mon, 14 Jul 2025 12:45:07 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22823769
- current block number: 22823769

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22823769 (main branch discovery), not current.

```diff
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579) {
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
      address:
-        "0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
+        "eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
      description:
-        "A router contract for verifiers. Routes verification requests to 0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or 0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type."
+        "A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type."
      values.FFLONK_VERIFIER:
-        "0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
+        "eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
      values.PLONK_VERIFIER:
-        "0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
+        "eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
      implementationNames.0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579:
-        "DualVerifier"
      implementationNames.eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579:
+        "DualVerifier"
    }
```

```diff
    contract GatewayTransactionFilterer (0x5540DE94485dB078025318428F813C5d88215823) {
    +++ description: A contract implementing the ITransactionFilterer interface, filtering with a configurable whitelist of sender addresses and a blacklist of target contract addresses. Chain migration transactions are generally whitelisted. The filter lists are managed by the owner (eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3).
      address:
-        "0x5540DE94485dB078025318428F813C5d88215823"
+        "eth:0x5540DE94485dB078025318428F813C5d88215823"
      description:
-        "A contract implementing the ITransactionFilterer interface, filtering with a configurable whitelist of sender addresses and a blacklist of target contract addresses. Chain migration transactions are generally whitelisted. The filter lists are managed by the owner (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3)."
+        "A contract implementing the ITransactionFilterer interface, filtering with a configurable whitelist of sender addresses and a blacklist of target contract addresses. Chain migration transactions are generally whitelisted. The filter lists are managed by the owner (eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3)."
      values.$admin:
-        "0x6B0d492D08d436d3BBC7Cc873C03002686Aef734"
+        "eth:0x6B0d492D08d436d3BBC7Cc873C03002686Aef734"
      values.$implementation:
-        "0xcb4B0E49CeaF3fB98CD375B3D2A1cbF4dD85fBde"
+        "eth:0xcb4B0E49CeaF3fB98CD375B3D2A1cbF4dD85fBde"
      values.$pastUpgrades.0.2.0:
-        "0xcb4B0E49CeaF3fB98CD375B3D2A1cbF4dD85fBde"
+        "eth:0xcb4B0E49CeaF3fB98CD375B3D2A1cbF4dD85fBde"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.0:
-        "0x65e424504400d8923BD19dde480919a4C19adcD3"
+        "eth:0x65e424504400d8923BD19dde480919a4C19adcD3"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.1:
-        "0xcbd7298D64d7855C5a5736B4D8c5650aeA829214"
+        "eth:0xcbd7298D64d7855C5a5736B4D8c5650aeA829214"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.2:
-        "0x63825fc80a4B8d96EE99d37E958a3A5B01b995D9"
+        "eth:0x63825fc80a4B8d96EE99d37E958a3A5B01b995D9"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.3:
-        "0xb742F4d52F6A5e98F11EAc60A7f75Acee534B831"
+        "eth:0xb742F4d52F6A5e98F11EAc60A7f75Acee534B831"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.4:
-        "0xA7F2EDAcDcc54a9c711639eEe9d0b27C96F0F3B6"
+        "eth:0xA7F2EDAcDcc54a9c711639eEe9d0b27C96F0F3B6"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.5:
-        "0x4659780be9E0863eFB2BAE5DD77E31e371f2d3C8"
+        "eth:0x4659780be9E0863eFB2BAE5DD77E31e371f2d3C8"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.6:
-        "0xa365401Dc76d077c702965ECc39CfbfE436A6167"
+        "eth:0xa365401Dc76d077c702965ECc39CfbfE436A6167"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.7:
-        "0x7f124F72fB4f978798ffdedAD3332b0ce750F399"
+        "eth:0x7f124F72fB4f978798ffdedAD3332b0ce750F399"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.8:
-        "0xEE7f08400FDa3A46D32Ae78eBEC2D3841CeC53b7"
+        "eth:0xEE7f08400FDa3A46D32Ae78eBEC2D3841CeC53b7"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.9:
-        "0x0ba2a65bb5CaB6b4b4CA797C4Aa825118a6A2A63"
+        "eth:0x0ba2a65bb5CaB6b4b4CA797C4Aa825118a6A2A63"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.10:
-        "0x69653a812038424290EFd0e7Ae8DcFB2Bbf9c9b2"
+        "eth:0x69653a812038424290EFd0e7Ae8DcFB2Bbf9c9b2"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.11:
-        "0x540E6ED9FC06dFCbf0a38Dcc7Ed7Ea3F56C551de"
+        "eth:0x540E6ED9FC06dFCbf0a38Dcc7Ed7Ea3F56C551de"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.12:
-        "0x6655933e34d8FD8f6d2CC7d5175bFC06112B7474"
+        "eth:0x6655933e34d8FD8f6d2CC7d5175bFC06112B7474"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.13:
-        "0x0000000000000000000000000000000000008006"
+        "eth:0x0000000000000000000000000000000000008006"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.14:
-        "0x000000000000000000000000000000000000800f"
+        "eth:0x000000000000000000000000000000000000800f"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.15:
-        "0x0000000000000000000000000000000000008014"
+        "eth:0x0000000000000000000000000000000000008014"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.16:
-        "0x0000000000000000000000000000000000010000"
+        "eth:0x0000000000000000000000000000000000010000"
+++ description: Addresses that are blacklisted as target contracts for requestL2Transaction() calls.
      values.blacklistedContracts.17:
-        "0x0000000000000000000000000000000000010001"
+        "eth:0x0000000000000000000000000000000000010001"
      values.BRIDGE_HUB:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.L1_ASSET_ROUTER:
-        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "eth:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.owner:
-        "0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
+        "eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: Addresses that are whitelisted as senders for requestL2Transaction() calls.
      values.whitelistedSenders.0:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+++ description: Addresses that are whitelisted as senders for requestL2Transaction() calls.
      values.whitelistedSenders.1:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+++ description: Addresses that are whitelisted as senders for requestL2Transaction() calls.
      values.whitelistedSenders.2:
-        "0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
+        "eth:0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
      implementationNames.0x5540DE94485dB078025318428F813C5d88215823:
-        "TransparentUpgradeableProxy"
      implementationNames.0xcb4B0E49CeaF3fB98CD375B3D2A1cbF4dD85fBde:
-        "GatewayTransactionFilterer"
      implementationNames.eth:0x5540DE94485dB078025318428F813C5d88215823:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xcb4B0E49CeaF3fB98CD375B3D2A1cbF4dD85fBde:
+        "GatewayTransactionFilterer"
    }
```

```diff
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1) {
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
      address:
-        "0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
+        "eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1"
      implementationNames.0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1:
-        "L1VerifierPlonk"
      implementationNames.eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1:
+        "L1VerifierPlonk"
    }
```

```diff
    contract ProxyAdmin (0x6B0d492D08d436d3BBC7Cc873C03002686Aef734) {
    +++ description: None
      address:
-        "0x6B0d492D08d436d3BBC7Cc873C03002686Aef734"
+        "eth:0x6B0d492D08d436d3BBC7Cc873C03002686Aef734"
      values.owner:
-        "0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
+        "eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
      implementationNames.0x6B0d492D08d436d3BBC7Cc873C03002686Aef734:
-        "ProxyAdmin"
      implementationNames.eth:0x6B0d492D08d436d3BBC7Cc873C03002686Aef734:
+        "ProxyAdmin"
    }
```

```diff
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      address:
-        "0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
+        "eth:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
      values.$implementation.0:
-        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.$implementation.1:
-        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.$implementation.2:
-        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.$implementation.3:
-        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
+        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.$pastUpgrades.0.2.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.0.2.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.0.2.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.0.2.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.1.2.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.1.2.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.1.2.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.1.2.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.2.2.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.2.2.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.2.2.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.2.2.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.3.2.0:
-        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.$pastUpgrades.3.2.1:
-        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.$pastUpgrades.3.2.2:
-        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.$pastUpgrades.3.2.3:
-        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
+        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.facetAddresses.0:
-        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.facetAddresses.1:
-        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.facetAddresses.2:
-        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.facetAddresses.3:
-        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
+        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.facets.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
+++ severity: HIGH
      values.getAdmin:
-        "0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
+        "eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
      values.getBaseToken:
-        "0x66A5cFB2e9c529f14FE6364Ad1075dF3a649C0A5"
+        "eth:0x66A5cFB2e9c529f14FE6364Ad1075dF3a649C0A5"
      values.getBridgehub:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.getChainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+++ severity: HIGH
      values.getDAValidatorPair.0:
-        "0x72213dfe8CA61B0A782970dCFebFb877778f9119"
+        "eth:0x72213dfe8CA61B0A782970dCFebFb877778f9119"
+++ severity: HIGH
      values.getDAValidatorPair.1:
-        "0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281"
+        "eth:0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281"
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
-        "0x5540DE94485dB078025318428F813C5d88215823"
+        "eth:0x5540DE94485dB078025318428F813C5d88215823"
      values.getVerifier:
-        "0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
+        "eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
      values.validators.0:
-        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      implementationNames.0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9:
-        "DiamondProxy"
      implementationNames.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
-        "AdminFacet"
      implementationNames.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
-        "GettersFacet"
      implementationNames.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
-        "MailboxFacet"
      implementationNames.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
-        "ExecutorFacet"
      implementationNames.eth:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9:
+        "DiamondProxy"
      implementationNames.eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        "AdminFacet"
      implementationNames.eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        "GettersFacet"
      implementationNames.eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        "MailboxFacet"
      implementationNames.eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
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
-        "0xbF4c6806d1fF930B5bEcab99b93c5355bD08fFfE"
+        "eth:0xbF4c6806d1fF930B5bEcab99b93c5355bD08fFfE"
      values.validatorsVTL.1:
-        "0xcEB302741E355E7Cf30b8479b7aD104d0C171EBF"
+        "eth:0xcEB302741E355E7Cf30b8479b7aD104d0C171EBF"
      implementationNames.0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
-        "ValidatorTimelock"
      implementationNames.eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
+        "ValidatorTimelock"
    }
```

```diff
    EOA  (0xbF4c6806d1fF930B5bEcab99b93c5355bD08fFfE) {
    +++ description: None
      address:
-        "0xbF4c6806d1fF930B5bEcab99b93c5355bD08fFfE"
+        "eth:0xbF4c6806d1fF930B5bEcab99b93c5355bD08fFfE"
    }
```

```diff
    EOA  (0xcEB302741E355E7Cf30b8479b7aD104d0C171EBF) {
    +++ description: None
      address:
-        "0xcEB302741E355E7Cf30b8479b7aD104d0C171EBF"
+        "eth:0xcEB302741E355E7Cf30b8479b7aD104d0C171EBF"
    }
```

```diff
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b) {
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
      address:
-        "0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
+        "eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b"
      implementationNames.0xD5dBE903F5382B052317D326FA1a7B63710C6a5b:
-        "L1VerifierFflonk"
      implementationNames.eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b:
+        "L1VerifierFflonk"
    }
```

```diff
    EOA  (0xFC0cB5F27C8d27E9Ddf76b8A0adA9806227bA6a9) {
    +++ description: None
      address:
-        "0xFC0cB5F27C8d27E9Ddf76b8A0adA9806227bA6a9"
+        "eth:0xFC0cB5F27C8d27E9Ddf76b8A0adA9806227bA6a9"
    }
```

```diff
    contract ChainAdminOwnable (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3) {
    +++ description: None
      address:
-        "0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
+        "eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
      values.owner:
-        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
+        "eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.tokenMultiplierSetter:
-        "0xFC0cB5F27C8d27E9Ddf76b8A0adA9806227bA6a9"
+        "eth:0xFC0cB5F27C8d27E9Ddf76b8A0adA9806227bA6a9"
      implementationNames.0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3:
-        "ChainAdminOwnable"
      implementationNames.eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3:
+        "ChainAdminOwnable"
    }
```

```diff
+   Status: CREATED
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract GatewayTransactionFilterer (0x5540DE94485dB078025318428F813C5d88215823)
    +++ description: A contract implementing the ITransactionFilterer interface, filtering with a configurable whitelist of sender addresses and a blacklist of target contract addresses. Chain migration transactions are generally whitelisted. The filter lists are managed by the owner (eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3).
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6B0d492D08d436d3BBC7Cc873C03002686Aef734)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract ChainAdminOwnable (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3)
    +++ description: None
```

Generated with discovered.json: 0x93908b186378e2c67fb1e31aa7b01f9c6d940194

# Diff at Fri, 04 Jul 2025 12:19:01 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22823769
- current block number: 22823769

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22823769 (main branch discovery), not current.

```diff
    contract GatewayTransactionFilterer (0x5540DE94485dB078025318428F813C5d88215823) {
    +++ description: A contract implementing the ITransactionFilterer interface, filtering with a configurable whitelist of sender addresses and a blacklist of target contract addresses. Chain migration transactions are generally whitelisted. The filter lists are managed by the owner (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3).
      receivedPermissions.0.from:
-        "ethereum:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
+        "eth:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
    }
```

```diff
    contract ProxyAdmin (0x6B0d492D08d436d3BBC7Cc873C03002686Aef734) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x5540DE94485dB078025318428F813C5d88215823"
+        "eth:0x5540DE94485dB078025318428F813C5d88215823"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
+        "eth:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
    }
```

```diff
    EOA  (0xbF4c6806d1fF930B5bEcab99b93c5355bD08fFfE) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
    EOA  (0xcEB302741E355E7Cf30b8479b7aD104d0C171EBF) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
    EOA  (0xFC0cB5F27C8d27E9Ddf76b8A0adA9806227bA6a9) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
+        "eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
    }
```

```diff
    contract ChainAdminOwnable (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5540DE94485dB078025318428F813C5d88215823"
+        "eth:0x5540DE94485dB078025318428F813C5d88215823"
      receivedPermissions.1.from:
-        "ethereum:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
+        "eth:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x6B0d492D08d436d3BBC7Cc873C03002686Aef734"
+        "eth:0x6B0d492D08d436d3BBC7Cc873C03002686Aef734"
      receivedPermissions.2.from:
-        "ethereum:0x5540DE94485dB078025318428F813C5d88215823"
+        "eth:0x5540DE94485dB078025318428F813C5d88215823"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x6B0d492D08d436d3BBC7Cc873C03002686Aef734"
+        "eth:0x6B0d492D08d436d3BBC7Cc873C03002686Aef734"
    }
```

Generated with discovered.json: 0x78b1acbc48c240441c578997b2ca20d11ec995ee

# Diff at Tue, 01 Jul 2025 10:23:20 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6dae2e2c6da3c994ad2a4e3a50e7430960cb763e block: 22796528
- current block number: 22823769

## Description

upgrade v28 completed.

## Watched changes

```diff
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      values.getL2SystemContractsUpgradeBatchNumber:
-        43
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        43
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0x6e60bd0408b14d086d55f00ff7313e9826e748a6fddf5cda55ae2883321c9804"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x6eab51acdb3ad4d61ff0650de53c7b0913501585

# Diff at Fri, 27 Jun 2025 14:59:56 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0486f9e4c91d499528f32792e73e81ff4cc57d2c block: 22738078
- current block number: 22796528

## Description

v28 standard upgrade (see era, shared-zk-stack).

## Watched changes

```diff
-   Status: DELETED
    contract DualVerifier (0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0)
    +++ description: A router contract for verifiers. Routes verification requests to 0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or 0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type.
```

```diff
-   Status: DELETED
    contract L1VerifierFflonk (0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      values.$implementation.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.$implementation.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.$implementation.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.$implementation.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.$pastUpgrades.3:
+        ["2025-06-26T16:22:35.000Z","0x5f1399621fcffa2658239a9192558bec47602896daa235483f85067cc011a45a",["0x431449e2a28A69122860A4956A3f7191eE15aFBC","0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22","0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec","0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"]]
      values.$upgradeCount:
-        3
+        4
      values.facetAddresses.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.facetAddresses.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.facetAddresses.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.facetAddresses.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.facets.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.getL2BootloaderBytecodeHash:
-        "0x0100087fe7df1cf5616646f85bd5eebc8efe5d8deac4d85bea9b9aefd88803dd"
+        "0x0100085f9382a7928dd83bfc529121827b5f29f18b9aa10d18aa68e1be7ddc35"
      values.getL2DefaultAccountBytecodeHash:
-        "0x0100050bf9baf9d08e5d3c037f8d8b486076de7e6dceb3f3fc0989ea2c99cd67"
+        "0x010005f72e443c94460f4583fb38ef5d0c5cd9897021c41df840f91465c0392e"
      values.getL2EvmEmulatorBytecodeHash:
-        "0x01000bbb8116fe7bdf690c19740ea350375426cec23f4f1f69a12fdc58adc9ba"
+        "0x01000d83e0329d9144ad041430fafcbc2b388e5434db8cb8a96e80157738a1da"
      values.getL2SystemContractsUpgradeBatchNumber:
-        0
+        43
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        43
      values.getL2SystemContractsUpgradeTxHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x6e60bd0408b14d086d55f00ff7313e9826e748a6fddf5cda55ae2883321c9804"
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: HIGH
      values.getProtocolVersion:
-        115964116992
+        120259084288
      values.getSemverProtocolVersion.1:
-        27
+        28
      values.getVerifier:
-        "0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
+        "0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
      implementationNames.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
-        "AdminFacet"
      implementationNames.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
-        "GettersFacet"
      implementationNames.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
-        "MailboxFacet"
      implementationNames.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
-        "ExecutorFacet"
      implementationNames.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        "AdminFacet"
      implementationNames.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        "GettersFacet"
      implementationNames.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        "MailboxFacet"
      implementationNames.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
+        "ExecutorFacet"
    }
```

```diff
-   Status: DELETED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579)
    +++ description: A router contract for verifiers. Routes verification requests to 0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or 0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

## Source code changes

```diff
.../{.flat@22738078 => .flat}/DiamondProxy/AdminFacet.1.sol    |  2 +-
 .../{.flat@22738078 => .flat}/DiamondProxy/ExecutorFacet.4.sol |  2 +-
 .../{.flat@22738078 => .flat}/DiamondProxy/GettersFacet.2.sol  |  2 +-
 .../{.flat@22738078 => .flat}/DiamondProxy/MailboxFacet.3.sol  |  2 +-
 .../ethereum/{.flat@22738078 => .flat}/DualVerifier.sol        |  2 +-
 .../ethereum/{.flat@22738078 => .flat}/L1VerifierFflonk.sol    |  6 +++---
 .../ethereum/{.flat@22738078 => .flat}/L1VerifierPlonk.sol     | 10 +++++-----
 7 files changed, 13 insertions(+), 13 deletions(-)
```

Generated with discovered.json: 0xcf60be930319c2e83ee13993ca0f1a6780b17770

# Diff at Wed, 25 Jun 2025 07:14:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22738078
- current block number: 22738078

## Description

Config: rename, tidy template folders. unhide the L1NativeTokenVault.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22738078 (main branch discovery), not current.

```diff
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      template:
-        "shared-zk-stack/v26/Diamond"
+        "shared-zk-stack/Diamond"
    }
```

Generated with discovered.json: 0x375546bdc127d4e1f68be9040e673df8fdf0c43c

# Diff at Thu, 19 Jun 2025 11:07:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5c484ae81a750a81728eec4c46d10685ad38407 block: 22730620
- current block number: 22738078

## Description

ProxyAdmin verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22730620 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x6B0d492D08d436d3BBC7Cc873C03002686Aef734) {
    +++ description: None
      name:
-        ""
+        "ProxyAdmin"
      unverified:
-        true
      receivedPermissions:
-        [{"permission":"upgrade","from":"ethereum:0x5540DE94485dB078025318428F813C5d88215823","role":"admin"}]
      values.owner:
+        "0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
      implementationNames.0x6B0d492D08d436d3BBC7Cc873C03002686Aef734:
-        ""
+        "ProxyAdmin"
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x04a556db1ea1a651e1174247090ad4c7105b455feab1a9672d5c4cd113b9ff0b"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"ethereum:0x5540DE94485dB078025318428F813C5d88215823","role":"admin"}]
    }
```

```diff
    contract ChainAdminOwnable (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"upgrade","from":"ethereum:0x5540DE94485dB078025318428F813C5d88215823","role":"admin","via":[{"address":"ethereum:0x6B0d492D08d436d3BBC7Cc873C03002686Aef734"}]}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"ethereum:0x6B0d492D08d436d3BBC7Cc873C03002686Aef734","role":".owner"}]
    }
```

Generated with discovered.json: 0x16a40b9ae239421428e117587de1a7f7c23fece6

# Diff at Wed, 18 Jun 2025 10:18:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22593194
- current block number: 22730620

## Description

new txfilterer added. can filter by sender, target contract and migration tx type.

## Watched changes

```diff
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      values.getL2SystemContractsUpgradeBatchNumber:
-        1
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        1
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xa9b4530ef32386347fc9c2fe1b2f3e73b31ae3b31ce973dcb88c71c377f1b4dc"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
+++ description: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2.
+++ severity: HIGH
      values.getTransactionFilterer:
-        "0x9B30061D077476a8B7e1b68c3da844Ed5FdE0432"
+        "0x5540DE94485dB078025318428F813C5d88215823"
    }
```

```diff
-   Status: DELETED
    contract InitiialGatewayTransactionFilterer (0x9B30061D077476a8B7e1b68c3da844Ed5FdE0432)
    +++ description: A contract implementing the ITransactionFilterer interface, able to whitelist transactions based on sender addresses only. The whitelist is managed by the owner (0x043DA37F21c4C83b97b546724c75600c2D0C9E16).
```

```diff
    contract ChainAdminOwnable (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"ethereum:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","role":".getAdmin"}
      receivedPermissions.0.from:
-        "ethereum:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
+        "ethereum:0x5540DE94485dB078025318428F813C5d88215823"
      receivedPermissions.0.description:
-        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+        "manage filter lists."
      receivedPermissions.0.role:
-        ".getAdmin"
+        ".owner"
    }
```

```diff
+   Status: CREATED
    contract GatewayTransactionFilterer (0x5540DE94485dB078025318428F813C5d88215823)
    +++ description: A contract implementing the ITransactionFilterer interface, filtering with a configurable whitelist of sender addresses and a blacklist of target contract addresses. Chain migration transactions are generally whitelisted. The filter lists are managed by the owner (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3).
```

```diff
+   Status: CREATED
    contract  (0x6B0d492D08d436d3BBC7Cc873C03002686Aef734)
    +++ description: None
```

## Source code changes

```diff
.../GatewayTransactionFilterer.sol                 | 652 ++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              | 729 +++++++++++++++++++++
 .../dev/null                                       | 187 ------
 3 files changed, 1381 insertions(+), 187 deletions(-)
```

Generated with discovered.json: 0xbb2ee47191ef303413b3a7a7969060ac8887516c

# Diff at Wed, 28 May 2025 11:33:03 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@13b95854804f5ec749939a5230d24dfeedf19d1e block: 22572509
- current block number: 22572509

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22572509 (main branch discovery), not current.

```diff
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
      sourceHashes.4:
-        "0xc18e3ec7d4fda7be44236a2bff585089b85466b00d09a1c3a2529c604f99143b"
      sourceHashes.3:
-        "0xb3038139dce45f6c1aaedbfb1b321c230301b2d004da109b39a17d827c6b0e4f"
      sourceHashes.2:
-        "0x1f9f7cd43747f5bcf879d544be0baca967245540e70592112cdc90c360f30486"
      sourceHashes.1:
-        "0xab7812fa82c483b781aee4c2339b860fcdee4033de1e243370a77a20fc353ddc"
+        "0xc18e3ec7d4fda7be44236a2bff585089b85466b00d09a1c3a2529c604f99143b"
      sourceHashes.0:
-        "0xca793d2e01bb37722ba48f56662e8602e693d6808ed9587867c2bac43c3dec25"
+        "0xbc2380479529743c27e6ab96cdf08210319fadcbca0856cf50c6b1b54bf8437f"
    }
```

Generated with discovered.json: 0x2959f22728090692581419e3e7609f98d713673d

# Diff at Tue, 27 May 2025 07:40:21 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22572509

## Description

initial discovery of the gateway rollup: future settlement layer for zksync

## Initial discovery

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
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract InitiialGatewayTransactionFilterer (0x9B30061D077476a8B7e1b68c3da844Ed5FdE0432)
    +++ description: A contract implementing the ITransactionFilterer interface, able to whitelist transactions based on sender addresses only. The whitelist is managed by the owner (0x043DA37F21c4C83b97b546724c75600c2D0C9E16).
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract ChainAdminOwnable (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3)
    +++ description: None
```

