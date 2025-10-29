Generated with discovered.json: 0x756132367f875e7f48402cb5cd76f09373ab3422

# Diff at Tue, 28 Oct 2025 09:03:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@090e135db1084f4a9678d6bf1cb0ff5e854903ea block: 1761220486
- current timestamp: 1761640428

## Description

standard v29 upgrade. updated trackedtxs.

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
    contract AbstractZkEvm (eth:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
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
      values.$pastUpgrades.8:
+        ["2025-10-27T21:48:47.000Z","0x1e0981b58494e533e348c55373907e8d29a478dd38d081c3e1f4e0213339008c",["eth:0x37CefD5b44c131FEf27e9Bc542e5B77A177A7253","eth:0x1666124221622eb6154306Ea9BA87043e8be88B2","eth:0x1e34aB39a9682149165ddeCc0583d238A5448B45","eth:0x0597CaA8A823A699d7CD9E62B5E5d4153FF82691"]]
      values.$upgradeCount:
-        8
+        9
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
-        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      values.validators.1:
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
    contract ValidatorTimelock (eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
-   Status: DELETED
    contract ValidatorTimelock (eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
    contract ChainAdmin (eth:0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: A governance proxy that lets eth:0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063 act through it.
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.5:
+        {"_protocolVersion":124554051586,"_upgradeTimestamp":1761224400}
    }
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
.../AbstractZkEvm/AdminFacet.1.sol                 |   68 +-
 .../AbstractZkEvm/ExecutorFacet.4.sol              |  437 +++--
 .../AbstractZkEvm/GettersFacet.2.sol               |   43 +-
 .../AbstractZkEvm/MailboxFacet.3.sol               | 1318 ++++++++-------
 .../L1VerifierFflonk.sol                           |  101 +-
 .../L1VerifierPlonk.sol                            |    8 +-
 .../TransparentUpgradeableProxy.p.sol              |  729 +++++++++
 .../.flat/ValidatorTimelock/ValidatorTimelock.sol  | 1679 ++++++++++++++++++++
 .../dev/null                                       |  541 -------
 .../dev/null                                       |  504 ------
 10 files changed, 3656 insertions(+), 1772 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761220486 (main branch discovery), not current.

```diff
    contract ValidatorTimelock (eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      name:
-        "ValidatorTimelock2"
+        "ValidatorTimelock"
      values.validatorsVTL:
-        ["eth:0x54aB716D465be3D5EEca64E63ac0048D7a81659a","eth:0x11805594be0229EF08429D775AF0c55f7c4535dE"]
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract ValidatorTimelock (eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      values.validatorsVTL:
-        ["eth:0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807","eth:0x4b2d036D2c27192549ad5A2F2D9875E1843833De"]
    }
```

Generated with discovered.json: 0xba9f7eece7d1726202b6d3c42564ba4807802c05

# Diff at Fri, 24 Oct 2025 09:13:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@11b074f59e0a769fa3d144569b93ef0f7ba1e44f block: 1759399643
- current timestamp: 1761220486

## Description

Config: add da vali comment.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759399643 (main branch discovery), not current.

```diff
    contract AbstractZkEvm (eth:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      fieldMeta.getDAValidatorPair.description:
+        "l1da, l2da"
    }
```

```diff
    contract Abstract Multisig (eth:0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063) {
    +++ description: None
      receivedPermissions.0.description:
-        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+        "administrate operator roles for this chain in the ValidatorTimelock, manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

```diff
    contract ChainAdmin (eth:0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: A governance proxy that lets eth:0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063 act through it.
      directlyReceivedPermissions.0.description:
-        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+        "administrate operator roles for this chain in the ValidatorTimelock, manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
      description:
+        "A governance proxy that lets eth:0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063 act through it."
    }
```

```diff
    EOA  (eth:0xfa96A3Da88f201433911bEFf3Ecc434CB1222731) {
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

Generated with discovered.json: 0x5f76981481b5c9c3b883c7dc46d83bc1715a540e

# Diff at Thu, 02 Oct 2025 10:08:26 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@b23cca5eaec9eb1fac489dca92defc845d56598a block: 1755156245
- current timestamp: 1759399643

## Description

Multisig rotation.

## Watched changes

```diff
    contract Safe (eth:0x325407EEC948b97429068AF0cd8A8D95F06315a4) {
    +++ description: None
      values.$members.4:
-        "eth:0x45CC620803974f13a0f1A11517685581FF098000"
+        "eth:0xFa700392b4B2223356401eDb1AA51665CC4bD9A4"
    }
```

Generated with discovered.json: 0x0224b142d3a4aba7e13b084073cf96646823280d

# Diff at Wed, 03 Sep 2025 15:51:48 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1755156245
- current timestamp: 1755156245

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755156245 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference BridgeHub (eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0x3846c3A30E62075Fa916216b35EF04B8F53931f6)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0x438Df339934B6Fb9dA8E0DC6f0Ba0bca22B8A7b5)
    +++ description: None
```

```diff
+   Status: CREATED
    reference RollupL1DAValidator (eth:0x72213dfe8CA61B0A782970dCFebFb877778f9119)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xafc7805c640C4A9E5D28f6A5Eae23b50e59B831c)
    +++ description: None
```

```diff
+   Status: CREATED
    reference ChainTypeManager (eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xCe20135Ac0253650E28Ea14911c69F1fADD8b06f)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xdF28907A6A272fa06333a197d7F0379A0f8f00aa)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xe2eB80C72Fa12Ba50B3bD6545709DC153D5b26D2)
    +++ description: None
```

```diff
+   Status: CREATED
    reference ProtocolUpgradeHandler (eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0xfa96A3Da88f201433911bEFf3Ecc434CB1222731)
    +++ description: None
```

Generated with discovered.json: 0x6940c0974becbdd64ace0cd778cdfc35e06defa2

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x3d4ecfdbceef7a0cb814a8efeae7245fa86eea12

# Diff at Thu, 14 Aug 2025 07:24:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bb183c2683f26f56fd8ffd0aa2b3153a631241cb block: 1753944307
- current timestamp: 1755156245

## Description

upgrade to standard protocol v28.1.

## Watched changes

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.$pastUpgrades.7:
+        ["2025-08-12T17:03:11.000Z","0x6748f394d7dbce205a1a2b85f8d2896ae4d6e68653193498b54ad6d3e18ef194",["eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC","eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22","eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec","eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"]]
      values.$upgradeCount:
-        7
+        8
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
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
```

```diff
-   Status: DELETED
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.4:
+        {"_protocolVersion":120259084289,"_upgradeTimestamp":1754911800}
    }
```

```diff
-   Status: DELETED
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
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
.../ethereum/{.flat@1753944307 => .flat}/L1VerifierFflonk.sol     | 4 ++--
 .../ethereum/{.flat@1753944307 => .flat}/L1VerifierPlonk.sol      | 8 ++++----
 2 files changed, 6 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0x646e2f7a58bdf8fae7f8043441257f064da960f0

# Diff at Mon, 14 Jul 2025 12:47:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22865542
- current block number: 22865542

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22865542 (main branch discovery), not current.

```diff
    contract Safe (0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB) {
    +++ description: None
      address:
-        "0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB"
+        "eth:0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x277D26a45Add5775F21256159F089769892CEa5B"
+        "eth:0x277D26a45Add5775F21256159F089769892CEa5B"
      values.$members.1:
-        "0xc12F6A2D93C0788366FC91aeBf21b33CCCb0c0d8"
+        "eth:0xc12F6A2D93C0788366FC91aeBf21b33CCCb0c0d8"
      values.$members.2:
-        "0xE57e5D24660d83bf8A40Ca2269d31D4A2F4F3C47"
+        "eth:0xE57e5D24660d83bf8A40Ca2269d31D4A2F4F3C47"
      values.$members.3:
-        "0x3846c3A30E62075Fa916216b35EF04B8F53931f6"
+        "eth:0x3846c3A30E62075Fa916216b35EF04B8F53931f6"
      implementationNames.0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x11805594be0229EF08429D775AF0c55f7c4535dE) {
    +++ description: None
      address:
-        "0x11805594be0229EF08429D775AF0c55f7c4535dE"
+        "eth:0x11805594be0229EF08429D775AF0c55f7c4535dE"
    }
```

```diff
    EOA  (0x1CdfBDED92D46261837827607e674110Ca5a0575) {
    +++ description: None
      address:
-        "0x1CdfBDED92D46261837827607e674110Ca5a0575"
+        "eth:0x1CdfBDED92D46261837827607e674110Ca5a0575"
    }
```

```diff
    EOA  (0x23F48e7BF163941Ebeb7a6106B8ac712a8c54f75) {
    +++ description: None
      address:
-        "0x23F48e7BF163941Ebeb7a6106B8ac712a8c54f75"
+        "eth:0x23F48e7BF163941Ebeb7a6106B8ac712a8c54f75"
    }
```

```diff
    EOA  (0x277D26a45Add5775F21256159F089769892CEa5B) {
    +++ description: None
      address:
-        "0x277D26a45Add5775F21256159F089769892CEa5B"
+        "eth:0x277D26a45Add5775F21256159F089769892CEa5B"
    }
```

```diff
    EOA  (0x28228243eb37cd1754c85980c6F6Ce697d2a1332) {
    +++ description: None
      address:
-        "0x28228243eb37cd1754c85980c6F6Ce697d2a1332"
+        "eth:0x28228243eb37cd1754c85980c6F6Ce697d2a1332"
    }
```

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      address:
-        "0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
+        "eth:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
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
      values.$pastUpgrades.4.2.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.4.2.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.4.2.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.4.2.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.5.2.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.5.2.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.5.2.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.5.2.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.6.2.0:
-        "0x431449e2a28A69122860A4956A3f7191eE15aFBC"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.$pastUpgrades.6.2.1:
-        "0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.$pastUpgrades.6.2.2:
-        "0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.$pastUpgrades.6.2.3:
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
-        "0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
+        "eth:0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
      values.getBaseToken:
-        "0x0000000000000000000000000000000000000001"
+        "eth:0x0000000000000000000000000000000000000001"
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
-        "0xfa96A3Da88f201433911bEFf3Ecc434CB1222731"
+        "eth:0xfa96A3Da88f201433911bEFf3Ecc434CB1222731"
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
-        "0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
+        "eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
      values.validators.0:
-        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      values.validators.1:
-        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      implementationNames.0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9:
-        "DiamondProxy"
      implementationNames.0x431449e2a28A69122860A4956A3f7191eE15aFBC:
-        "AdminFacet"
      implementationNames.0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
-        "GettersFacet"
      implementationNames.0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
-        "MailboxFacet"
      implementationNames.0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
-        "ExecutorFacet"
      implementationNames.eth:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9:
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
    contract Safe (0x325407EEC948b97429068AF0cd8A8D95F06315a4) {
    +++ description: None
      address:
-        "0x325407EEC948b97429068AF0cd8A8D95F06315a4"
+        "eth:0x325407EEC948b97429068AF0cd8A8D95F06315a4"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xfBbBa4FbAA3A99bA842924d4c47C14d6d61D9615"
+        "eth:0xfBbBa4FbAA3A99bA842924d4c47C14d6d61D9615"
      values.$members.1:
-        "0x23F48e7BF163941Ebeb7a6106B8ac712a8c54f75"
+        "eth:0x23F48e7BF163941Ebeb7a6106B8ac712a8c54f75"
      values.$members.2:
-        "0x4d64Ff9c7aB6F4Dc6dD7D9438BCBA70e3E094e3E"
+        "eth:0x4d64Ff9c7aB6F4Dc6dD7D9438BCBA70e3E094e3E"
      values.$members.3:
-        "0xa925fac7B26C2959b5d55173B21CAc5729372459"
+        "eth:0xa925fac7B26C2959b5d55173B21CAc5729372459"
      values.$members.4:
-        "0x45CC620803974f13a0f1A11517685581FF098000"
+        "eth:0x45CC620803974f13a0f1A11517685581FF098000"
      implementationNames.0x325407EEC948b97429068AF0cd8A8D95F06315a4:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x325407EEC948b97429068AF0cd8A8D95F06315a4:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807) {
    +++ description: None
      address:
-        "0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807"
+        "eth:0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807"
    }
```

```diff
    EOA  (0x45CC620803974f13a0f1A11517685581FF098000) {
    +++ description: None
      address:
-        "0x45CC620803974f13a0f1A11517685581FF098000"
+        "eth:0x45CC620803974f13a0f1A11517685581FF098000"
    }
```

```diff
    EOA  (0x4b2d036D2c27192549ad5A2F2D9875E1843833De) {
    +++ description: None
      address:
-        "0x4b2d036D2c27192549ad5A2F2D9875E1843833De"
+        "eth:0x4b2d036D2c27192549ad5A2F2D9875E1843833De"
    }
```

```diff
    EOA  (0x4d64Ff9c7aB6F4Dc6dD7D9438BCBA70e3E094e3E) {
    +++ description: None
      address:
-        "0x4d64Ff9c7aB6F4Dc6dD7D9438BCBA70e3E094e3E"
+        "eth:0x4d64Ff9c7aB6F4Dc6dD7D9438BCBA70e3E094e3E"
    }
```

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
    EOA  (0x54aB716D465be3D5EEca64E63ac0048D7a81659a) {
    +++ description: None
      address:
-        "0x54aB716D465be3D5EEca64E63ac0048D7a81659a"
+        "eth:0x54aB716D465be3D5EEca64E63ac0048D7a81659a"
    }
```

```diff
    contract Safe (0x57533344e91d29f927AAEBee364A33633Bd205Ab) {
    +++ description: None
      address:
-        "0x57533344e91d29f927AAEBee364A33633Bd205Ab"
+        "eth:0x57533344e91d29f927AAEBee364A33633Bd205Ab"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xafc7805c640C4A9E5D28f6A5Eae23b50e59B831c"
+        "eth:0xafc7805c640C4A9E5D28f6A5Eae23b50e59B831c"
      values.$members.1:
-        "0xdF28907A6A272fa06333a197d7F0379A0f8f00aa"
+        "eth:0xdF28907A6A272fa06333a197d7F0379A0f8f00aa"
      values.$members.2:
-        "0xCe20135Ac0253650E28Ea14911c69F1fADD8b06f"
+        "eth:0xCe20135Ac0253650E28Ea14911c69F1fADD8b06f"
      implementationNames.0x57533344e91d29f927AAEBee364A33633Bd205Ab:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x57533344e91d29f927AAEBee364A33633Bd205Ab:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract Safe (0x58536761C97F5037931b56efeE922471add0eEe8) {
    +++ description: None
      address:
-        "0x58536761C97F5037931b56efeE922471add0eEe8"
+        "eth:0x58536761C97F5037931b56efeE922471add0eEe8"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xe2eB80C72Fa12Ba50B3bD6545709DC153D5b26D2"
+        "eth:0xe2eB80C72Fa12Ba50B3bD6545709DC153D5b26D2"
      values.$members.1:
-        "0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553"
+        "eth:0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553"
      values.$members.2:
-        "0xbB943Cf3c5b90f2eD04F53658CCA49286601e808"
+        "eth:0xbB943Cf3c5b90f2eD04F53658CCA49286601e808"
      implementationNames.0x58536761C97F5037931b56efeE922471add0eEe8:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x58536761C97F5037931b56efeE922471add0eEe8:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
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
-        "0x54aB716D465be3D5EEca64E63ac0048D7a81659a"
+        "eth:0x54aB716D465be3D5EEca64E63ac0048D7a81659a"
      values.validatorsVTL.1:
-        "0x11805594be0229EF08429D775AF0c55f7c4535dE"
+        "eth:0x11805594be0229EF08429D775AF0c55f7c4535dE"
      implementationNames.0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E:
-        "ValidatorTimelock"
      implementationNames.eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E:
+        "ValidatorTimelock"
    }
```

```diff
    EOA  (0x77D1124E9061d238430Df3F4311111BDf69a4CFA) {
    +++ description: None
      address:
-        "0x77D1124E9061d238430Df3F4311111BDf69a4CFA"
+        "eth:0x77D1124E9061d238430Df3F4311111BDf69a4CFA"
    }
```

```diff
    contract Safe (0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892) {
    +++ description: None
      address:
-        "0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892"
+        "eth:0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x438Df339934B6Fb9dA8E0DC6f0Ba0bca22B8A7b5"
+        "eth:0x438Df339934B6Fb9dA8E0DC6f0Ba0bca22B8A7b5"
      values.$members.1:
-        "0x28228243eb37cd1754c85980c6F6Ce697d2a1332"
+        "eth:0x28228243eb37cd1754c85980c6F6Ce697d2a1332"
      implementationNames.0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract Abstract Multisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063) {
    +++ description: None
      address:
-        "0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063"
+        "eth:0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x57533344e91d29f927AAEBee364A33633Bd205Ab"
+        "eth:0x57533344e91d29f927AAEBee364A33633Bd205Ab"
      values.$members.1:
-        "0xFC84E99984A3526dea97c408f5991A5E099f3Da2"
+        "eth:0xFC84E99984A3526dea97c408f5991A5E099f3Da2"
      values.$members.2:
-        "0x58536761C97F5037931b56efeE922471add0eEe8"
+        "eth:0x58536761C97F5037931b56efeE922471add0eEe8"
      values.$members.3:
-        "0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB"
+        "eth:0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB"
      values.$members.4:
-        "0x1CdfBDED92D46261837827607e674110Ca5a0575"
+        "eth:0x1CdfBDED92D46261837827607e674110Ca5a0575"
      values.$members.5:
-        "0x325407EEC948b97429068AF0cd8A8D95F06315a4"
+        "eth:0x325407EEC948b97429068AF0cd8A8D95F06315a4"
      values.$members.6:
-        "0x77D1124E9061d238430Df3F4311111BDf69a4CFA"
+        "eth:0x77D1124E9061d238430Df3F4311111BDf69a4CFA"
      values.$members.7:
-        "0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892"
+        "eth:0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892"
      implementationNames.0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
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
-        "0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807"
+        "eth:0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807"
      values.validatorsVTL.1:
-        "0x4b2d036D2c27192549ad5A2F2D9875E1843833De"
+        "eth:0x4b2d036D2c27192549ad5A2F2D9875E1843833De"
      implementationNames.0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
-        "ValidatorTimelock"
      implementationNames.eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
+        "ValidatorTimelock"
    }
```

```diff
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
      address:
-        "0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
+        "eth:0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
      values.owner:
-        "0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063"
+        "eth:0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.tokenMultiplierSetter:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661:
-        "ChainAdmin"
      implementationNames.eth:0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661:
+        "ChainAdmin"
    }
```

```diff
    EOA  (0xa925fac7B26C2959b5d55173B21CAc5729372459) {
    +++ description: None
      address:
-        "0xa925fac7B26C2959b5d55173B21CAc5729372459"
+        "eth:0xa925fac7B26C2959b5d55173B21CAc5729372459"
    }
```

```diff
    EOA  (0xbB943Cf3c5b90f2eD04F53658CCA49286601e808) {
    +++ description: None
      address:
-        "0xbB943Cf3c5b90f2eD04F53658CCA49286601e808"
+        "eth:0xbB943Cf3c5b90f2eD04F53658CCA49286601e808"
    }
```

```diff
    EOA  (0xc12F6A2D93C0788366FC91aeBf21b33CCCb0c0d8) {
    +++ description: None
      address:
-        "0xc12F6A2D93C0788366FC91aeBf21b33CCCb0c0d8"
+        "eth:0xc12F6A2D93C0788366FC91aeBf21b33CCCb0c0d8"
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
    EOA  (0xE57e5D24660d83bf8A40Ca2269d31D4A2F4F3C47) {
    +++ description: None
      address:
-        "0xE57e5D24660d83bf8A40Ca2269d31D4A2F4F3C47"
+        "eth:0xE57e5D24660d83bf8A40Ca2269d31D4A2F4F3C47"
    }
```

```diff
    EOA  (0xfBbBa4FbAA3A99bA842924d4c47C14d6d61D9615) {
    +++ description: None
      address:
-        "0xfBbBa4FbAA3A99bA842924d4c47C14d6d61D9615"
+        "eth:0xfBbBa4FbAA3A99bA842924d4c47C14d6d61D9615"
    }
```

```diff
    EOA  (0xFC84E99984A3526dea97c408f5991A5E099f3Da2) {
    +++ description: None
      address:
-        "0xFC84E99984A3526dea97c408f5991A5E099f3Da2"
+        "eth:0xFC84E99984A3526dea97c408f5991A5E099f3Da2"
    }
```

```diff
+   Status: CREATED
    contract Safe (0x0807C9f0247084cf1C5aB86A8fb00e7c70Cd27eB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract Safe (0x325407EEC948b97429068AF0cd8A8D95F06315a4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
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
    contract L1VerifierPlonk (0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract Safe (0x79CF3eCF9Bbfd793d8Be62ED44D98d9AfA657892)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Abstract Multisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0xD5dBE903F5382B052317D326FA1a7B63710C6a5b)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

Generated with discovered.json: 0x2b5735a347ef0aaf74ec50f3980c981c0bef4d73

# Diff at Mon, 07 Jul 2025 06:30:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1a6f89d35120c5c65bf077ab92a9ca72da48080d block: 22593193
- current block number: 22865542

## Description

Standard zk stack v28 upgrade.

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
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
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
      values.$pastUpgrades.6:
+        ["2025-07-01T19:26:35.000Z","0x5baabf6f89fd91775efbaa3fcf547e344999ed8550560828e6d02511c220b7bc",["0x431449e2a28A69122860A4956A3f7191eE15aFBC","0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22","0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec","0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"]]
      values.$upgradeCount:
-        6
+        7
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
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.3:
+        {"_protocolVersion":120259084288,"_upgradeTimestamp":1750942800}
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
.../{.flat@22593193 => .flat}/AbstractZkEvm/AdminFacet.1.sol   |  2 +-
 .../AbstractZkEvm/ExecutorFacet.4.sol                          |  2 +-
 .../{.flat@22593193 => .flat}/AbstractZkEvm/GettersFacet.2.sol |  2 +-
 .../{.flat@22593193 => .flat}/AbstractZkEvm/MailboxFacet.3.sol |  2 +-
 .../ethereum/{.flat@22593193 => .flat}/DualVerifier.sol        |  2 +-
 .../ethereum/{.flat@22593193 => .flat}/L1VerifierFflonk.sol    |  6 +++---
 .../ethereum/{.flat@22593193 => .flat}/L1VerifierPlonk.sol     | 10 +++++-----
 7 files changed, 13 insertions(+), 13 deletions(-)
```

Generated with discovered.json: 0xb69f789e0bd3acece858106fad608084f9dad920

# Diff at Fri, 04 Jul 2025 12:18:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22593193
- current block number: 22593193

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593193 (main branch discovery), not current.

```diff
    EOA  (0x11805594be0229EF08429D775AF0c55f7c4535dE) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
    }
```

```diff
    EOA  (0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
    EOA  (0x4b2d036D2c27192549ad5A2F2D9875E1843833De) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
    EOA  (0x54aB716D465be3D5EEca64E63ac0048D7a81659a) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
+        "eth:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
    }
```

```diff
    contract Abstract Multisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
+        "eth:0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
      receivedPermissions.0.from:
-        "ethereum:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
+        "eth:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
+        "eth:0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
+        "eth:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
    }
```

```diff
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
+        "eth:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
    }
```

Generated with discovered.json: 0xd5dde17a6ec246cd55397464e4abc5600d3e3d7b

# Diff at Thu, 03 Jul 2025 10:57:01 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fa3b82adfb9dedeb2acea8fde7b79e65d59fb2b6 block: 22593193
- current block number: 22593193

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593193 (main branch discovery), not current.

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

Generated with discovered.json: 0x2fe94c1e7e1068fa985579ca4b22f1d3ec6b2cad

# Diff at Wed, 25 Jun 2025 07:14:17 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22593193
- current block number: 22593193

## Description

Config: rename, tidy template folders. unhide the L1NativeTokenVault.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593193 (main branch discovery), not current.

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      template:
-        "shared-zk-stack/v26/Diamond"
+        "shared-zk-stack/Diamond"
    }
```

Generated with discovered.json: 0x4ca4ad9c493b6efc0ff8d7091a8e4d362e6e618e

# Diff at Fri, 30 May 2025 04:33:20 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22496279
- current block number: 22593193

## Description

validators rotated.

## Watched changes

```diff
    EOA  (0x11805594be0229EF08429D775AF0c55f7c4535dE) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564","role":".validatorsVTL"}
    }
```

```diff
    EOA  (0x54aB716D465be3D5EEca64E63ac0048D7a81659a) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564","role":".validatorsVTL"}
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      values.validatorsVTL.1:
-        "0x11805594be0229EF08429D775AF0c55f7c4535dE"
+        "0x4b2d036D2c27192549ad5A2F2D9875E1843833De"
      values.validatorsVTL.0:
-        "0x54aB716D465be3D5EEca64E63ac0048D7a81659a"
+        "0x415Ed64D42BC0c37AeaAEf79AA767d963Ef38807"
    }
```

Generated with discovered.json: 0xea39ebbd4aa22732a5b9cea7d4e94889568b6bd9

# Diff at Tue, 27 May 2025 08:30:33 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22496279
- current block number: 22496279

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22496279 (main branch discovery), not current.

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.4:
-        "0xb3038139dce45f6c1aaedbfb1b321c230301b2d004da109b39a17d827c6b0e4f"
      sourceHashes.3:
-        "0x1f9f7cd43747f5bcf879d544be0baca967245540e70592112cdc90c360f30486"
      sourceHashes.2:
-        "0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f"
      sourceHashes.1:
-        "0xab7812fa82c483b781aee4c2339b860fcdee4033de1e243370a77a20fc353ddc"
+        "0xbc2380479529743c27e6ab96cdf08210319fadcbca0856cf50c6b1b54bf8437f"
      sourceHashes.0:
-        "0xca793d2e01bb37722ba48f56662e8602e693d6808ed9587867c2bac43c3dec25"
+        "0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f"
    }
```

Generated with discovered.json: 0xbea867b915598897cf6607a51232c2a9fb5b6019

# Diff at Fri, 23 May 2025 09:41:09 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22496279
- current block number: 22496279

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22496279 (main branch discovery), not current.

```diff
    EOA  (0x11805594be0229EF08429D775AF0c55f7c4535dE) {
    +++ description: None
      receivedPermissions.1.role:
+        ".validatorsVTL"
      receivedPermissions.0.role:
+        ".validatorsVTL"
    }
```

```diff
    EOA  (0x54aB716D465be3D5EEca64E63ac0048D7a81659a) {
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
    contract Abstract Multisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getAdmin"
      directlyReceivedPermissions.0.role:
+        ".owner"
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
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".getAdmin"
    }
```

Generated with discovered.json: 0xe2d0389a305066196f1800063716aa9a764d054c

# Diff at Fri, 16 May 2025 14:39:40 GMT:

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43865580b95b7ff3abb4f43944aed50cc5d69ee3 block: 22367139
- current block number: 22466280

## Description

Abstract sub-MS member changes.

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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

- chain: ethereum
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

Generated with discovered.json: 0xd27d9aae2ae8ab317eba8791b291c763642d0fa4

# Diff at Fri, 31 Jan 2025 11:50:46 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 54952331

## Description

Empty, see comment in config.jsonc

Generated with discovered.json: 0x462241a0f97be04c623bbc09f1d40025f82626b6

# Diff at Tue, 28 Jan 2025 08:21:03 GMT:

- chain: ethereum
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

