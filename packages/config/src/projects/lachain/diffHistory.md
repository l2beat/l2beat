Generated with discovered.json: 0xdd7e0b9fad5066ab8f3fb637733de37d8b1b3a46

# Diff at Tue, 28 Oct 2025 09:16:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@090e135db1084f4a9678d6bf1cb0ff5e854903ea block: 1753944315
- current timestamp: 1761642941

## Description

config related: something to do with the shared modules work imo.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753944315 (main branch discovery), not current.

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

Generated with discovered.json: 0x94b9933b0303be53a3b7c55c3163fe9cb8afd9b9

# Diff at Fri, 24 Oct 2025 09:13:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@11b074f59e0a769fa3d144569b93ef0f7ba1e44f block: 1753944315
- current timestamp: 1753944315

## Description

Config: add da vali comment.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753944315 (main branch discovery), not current.

```diff
    contract zkVmDiamond (eth:0x742A28e22277945BBAAa34810393bf6e8512576C) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      fieldMeta.getDAValidatorPair.description:
+        "l1da, l2da"
    }
```

```diff
    contract Safe (eth:0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE) {
    +++ description: None
      receivedPermissions.0.description:
-        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+        "administrate operator roles for this chain in the ValidatorTimelock, manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

```diff
    contract ChainAdminOwnable (eth:0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD) {
    +++ description: A governance proxy that lets eth:0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE act through it.
      directlyReceivedPermissions.0.description:
-        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
+        "administrate operator roles for this chain in the ValidatorTimelock, manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
      description:
+        "A governance proxy that lets eth:0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE act through it."
    }
```

Generated with discovered.json: 0xcc4ef285a01dc1a1109db17f47cb20b595ed2f4f

# Diff at Wed, 03 Sep 2025 15:52:16 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1753944315
- current timestamp: 1753944315

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753944315 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference BridgeHub (eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: None
```

```diff
+   Status: CREATED
    reference RollupL1DAValidator (eth:0x72213dfe8CA61B0A782970dCFebFb877778f9119)
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

```diff
+   Status: CREATED
    reference  (eth:0xfa96A3Da88f201433911bEFf3Ecc434CB1222731)
    +++ description: None
```

Generated with discovered.json: 0xda21abceda3caee941507d77aa436780e1b81044

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x6024f8ab803ee55578d41cb67a40c231330f22c2

# Diff at Tue, 15 Jul 2025 09:59:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22896151
- current block number: 22923843

## Description

standard zk stack v28 upgrade.

## Watched changes

```diff
-   Status: DELETED
    contract DualVerifier (0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or eth:0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type.
```

```diff
-   Status: DELETED
    contract L1VerifierFflonk (0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
    contract zkVmDiamond (0x742A28e22277945BBAAa34810393bf6e8512576C) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.$implementation.0:
-        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.$implementation.1:
-        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.$implementation.2:
-        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.$implementation.3:
-        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.$pastUpgrades.4:
+        ["2025-07-12T18:52:59.000Z","0x36697c871bb555b46ae5ca1aff3370b229c719fe883cf56edd1749c8ca4b3913",["eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC","eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22","eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec","eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"]]
      values.$upgradeCount:
-        4
+        5
      values.facetAddresses.0:
-        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC"
      values.facetAddresses.1:
-        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22"
      values.facetAddresses.2:
-        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec"
      values.facetAddresses.3:
-        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"
      values.facets.eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A:
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
-        "eth:0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
+        "eth:0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579"
      implementationNames.eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
-        "AdminFacet"
      implementationNames.eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
-        "GettersFacet"
      implementationNames.eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
-        "MailboxFacet"
      implementationNames.eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
-        "ExecutorFacet"
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
-   Status: DELETED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract DualVerifier (0x53F5DE9De3B2DA90633a2c74BEb3b9912cdd1579)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b or eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1 depending on the supplied proof type.
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
.../ethereum/{.flat@22896151 => .flat}/DualVerifier.sol        |  2 +-
 .../ethereum/{.flat@22896151 => .flat}/L1VerifierFflonk.sol    |  6 +++---
 .../ethereum/{.flat@22896151 => .flat}/L1VerifierPlonk.sol     | 10 +++++-----
 .../{.flat@22896151 => .flat}/zkVmDiamond/AdminFacet.1.sol     |  2 +-
 .../{.flat@22896151 => .flat}/zkVmDiamond/ExecutorFacet.4.sol  |  2 +-
 .../{.flat@22896151 => .flat}/zkVmDiamond/GettersFacet.2.sol   |  2 +-
 .../{.flat@22896151 => .flat}/zkVmDiamond/MailboxFacet.3.sol   |  2 +-
 7 files changed, 13 insertions(+), 13 deletions(-)
```

Generated with discovered.json: 0x5e924d25cd5bc84e3b196c216b2f007d4d08414d

# Diff at Mon, 14 Jul 2025 12:47:16 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22896151
- current block number: 22896151

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22896151 (main branch discovery), not current.

```diff
    EOA  (0x00A74411DDBC50C04353543d5D3f4296936DA645) {
    +++ description: None
      address:
-        "0x00A74411DDBC50C04353543d5D3f4296936DA645"
+        "eth:0x00A74411DDBC50C04353543d5D3f4296936DA645"
    }
```

```diff
    EOA  (0x067823401127CA6647481C68011805B90D42231E) {
    +++ description: None
      address:
-        "0x067823401127CA6647481C68011805B90D42231E"
+        "eth:0x067823401127CA6647481C68011805B90D42231E"
    }
```

```diff
    contract DualVerifier (0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0) {
    +++ description: A router contract for verifiers. Routes verification requests to eth:0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or eth:0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type.
      address:
-        "0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
+        "eth:0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
      description:
-        "A router contract for verifiers. Routes verification requests to 0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or 0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type."
+        "A router contract for verifiers. Routes verification requests to eth:0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or eth:0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type."
      values.FFLONK_VERIFIER:
-        "0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF"
+        "eth:0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF"
      values.PLONK_VERIFIER:
-        "0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e"
+        "eth:0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e"
      implementationNames.0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0:
-        "DualVerifier"
      implementationNames.eth:0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0:
+        "DualVerifier"
    }
```

```diff
    contract L1VerifierFflonk (0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF) {
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
      address:
-        "0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF"
+        "eth:0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF"
      implementationNames.0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF:
-        "L1VerifierFflonk"
      implementationNames.eth:0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF:
+        "L1VerifierFflonk"
    }
```

```diff
    EOA  (0x23ceC92F92bde95e401f0a2b50b072A6069dFBd5) {
    +++ description: None
      address:
-        "0x23ceC92F92bde95e401f0a2b50b072A6069dFBd5"
+        "eth:0x23ceC92F92bde95e401f0a2b50b072A6069dFBd5"
    }
```

```diff
    EOA  (0x27251a0185F0354C7D5BF0aF5fAA1A384712C6bd) {
    +++ description: None
      address:
-        "0x27251a0185F0354C7D5BF0aF5fAA1A384712C6bd"
+        "eth:0x27251a0185F0354C7D5BF0aF5fAA1A384712C6bd"
    }
```

```diff
    EOA  (0x34b6Ca118e1e665Ff4583c39615d864aD2C19c7A) {
    +++ description: None
      address:
-        "0x34b6Ca118e1e665Ff4583c39615d864aD2C19c7A"
+        "eth:0x34b6Ca118e1e665Ff4583c39615d864aD2C19c7A"
    }
```

```diff
    EOA  (0x5b72e13f78FEB8f5b44392f2e32940D4f37FA313) {
    +++ description: None
      address:
-        "0x5b72e13f78FEB8f5b44392f2e32940D4f37FA313"
+        "eth:0x5b72e13f78FEB8f5b44392f2e32940D4f37FA313"
    }
```

```diff
    EOA  (0x5CA3F8EEBa12D83408fc097c2dAd79212456F20F) {
    +++ description: None
      address:
-        "0x5CA3F8EEBa12D83408fc097c2dAd79212456F20F"
+        "eth:0x5CA3F8EEBa12D83408fc097c2dAd79212456F20F"
    }
```

```diff
    contract zkVmDiamond (0x742A28e22277945BBAAa34810393bf6e8512576C) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      address:
-        "0x742A28e22277945BBAAa34810393bf6e8512576C"
+        "eth:0x742A28e22277945BBAAa34810393bf6e8512576C"
      values.$implementation.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$implementation.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$implementation.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$implementation.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.0.2.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "eth:0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.$pastUpgrades.0.2.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "eth:0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.$pastUpgrades.0.2.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "eth:0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.$pastUpgrades.0.2.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "eth:0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
      values.$pastUpgrades.1.2.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "eth:0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.$pastUpgrades.1.2.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "eth:0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.$pastUpgrades.1.2.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "eth:0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.$pastUpgrades.1.2.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "eth:0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
      values.$pastUpgrades.2.2.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "eth:0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.$pastUpgrades.2.2.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "eth:0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.$pastUpgrades.2.2.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "eth:0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.$pastUpgrades.2.2.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "eth:0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
      values.$pastUpgrades.3.2.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.3.2.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.3.2.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.3.2.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.facetAddresses.0:
-        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
+        "eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.facetAddresses.1:
-        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
+        "eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.facetAddresses.2:
-        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
+        "eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.facetAddresses.3:
-        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
+        "eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.facets.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
-        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
-        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
-        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
-        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
      values.facets.eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
+        ["acceptAdmin()","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))","setPorterAvailability(bool)","setTransactionFilterer(address)","setTokenMultiplier(uint128,uint128)","freezeDiamond()","genesisUpgrade(address,address,bytes,bytes[])","forwardedBridgeMint(bytes,bool)","prepareChainCommitment()","setValidator(address,bool)","setPendingAdmin(address)","allowEvmEmulation()","setDAValidatorPair(address,address)","forwardedBridgeBurn(address,address,bytes)","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","makePermanentRollup()","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","forwardedBridgeRecoverFailedTransfer(uint256,bytes32,address,bytes)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)"]
      values.facets.eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
+        ["getPubdataPricingMode()","getPriorityTxMaxGasLimit()","getTotalBlocksCommitted()","getVerifierParams()","baseTokenGasPriceMultiplierDenominator()","getTransactionFilterer()","isDiamondStorageFrozen()","getProtocolVersion()","getChainId()","getBridgehub()","getTotalBlocksExecuted()","getPriorityTreeRoot()","getVerifier()","facetAddresses()","getDAValidatorPair()","getPriorityQueueSize()","getSettlementLayer()","getAdmin()","storedBlockHash(uint256)","getFirstUnprocessedPriorityTx()","facets()","getL2SystemContractsUpgradeTxHash()","isPriorityQueueActive()","getChainTypeManager()","getBaseTokenAssetId()","getBaseToken()","l2LogsRootHash(uint256)","getL2SystemContractsUpgradeBlockNumber()","getTotalPriorityTxs()","facetFunctionSelectors(address)","getTotalBlocksVerified()","storedBatchHash(uint256)","getTotalBatchesExecuted()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","facetAddress(bytes4)","getPendingAdmin()","getL2BootloaderBytecodeHash()","getTotalBatchesCommitted()","getL2EvmEmulatorBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","isFunctionFreezable(bytes4)","baseTokenGasPriceMultiplierNominator()","getTotalBatchesVerified()","getPriorityTreeStartIndex()","getSemverProtocolVersion()","isValidator(address)","getL2DefaultAccountBytecodeHash()"]
      values.facets.eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
+        ["proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","proveL2LeafInclusion(uint256,uint256,bytes32,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","requestL2TransactionToGatewayMailbox(uint256,bytes32,uint64)","requestL2ServiceTransaction(address,bytes)","bridgehubRequestL2TransactionOnGateway(bytes32,uint64)","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])"]
      values.facets.eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
+        ["revertBatchesSharedBridge(uint256,uint256)","proveBatchesSharedBridge(uint256,uint256,uint256,bytes)","commitBatchesSharedBridge(uint256,uint256,uint256,bytes)","executeBatchesSharedBridge(uint256,uint256,uint256,bytes)"]
+++ severity: HIGH
      values.getAdmin:
-        "0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
+        "eth:0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
      values.getBaseToken:
-        "0x0Df3a853e4B604fC2ac0881E9Dc92db27fF7f51b"
+        "eth:0x0Df3a853e4B604fC2ac0881E9Dc92db27fF7f51b"
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
-        "0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
+        "eth:0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
      values.validators.0:
-        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      implementationNames.0x742A28e22277945BBAAa34810393bf6e8512576C:
-        "DiamondProxy"
      implementationNames.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
-        "AdminFacet"
      implementationNames.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
-        "GettersFacet"
      implementationNames.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
-        "MailboxFacet"
      implementationNames.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
-        "ExecutorFacet"
      implementationNames.eth:0x742A28e22277945BBAAa34810393bf6e8512576C:
+        "DiamondProxy"
      implementationNames.eth:0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
+        "AdminFacet"
      implementationNames.eth:0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
+        "GettersFacet"
      implementationNames.eth:0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
+        "MailboxFacet"
      implementationNames.eth:0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
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
-        "0xB66d4AF4E96bF96026454A6A150EDD2CE55E9E67"
+        "eth:0xB66d4AF4E96bF96026454A6A150EDD2CE55E9E67"
      values.validatorsVTL.1:
-        "0xDAC936134633C309BA831239e5e25Cfe5094b229"
+        "eth:0xDAC936134633C309BA831239e5e25Cfe5094b229"
      implementationNames.0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
-        "ValidatorTimelock"
      implementationNames.eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564:
+        "ValidatorTimelock"
    }
```

```diff
    contract Safe (0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE) {
    +++ description: None
      address:
-        "0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE"
+        "eth:0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x067823401127CA6647481C68011805B90D42231E"
+        "eth:0x067823401127CA6647481C68011805B90D42231E"
      values.$members.1:
-        "0x5CA3F8EEBa12D83408fc097c2dAd79212456F20F"
+        "eth:0x5CA3F8EEBa12D83408fc097c2dAd79212456F20F"
      values.$members.2:
-        "0x5b72e13f78FEB8f5b44392f2e32940D4f37FA313"
+        "eth:0x5b72e13f78FEB8f5b44392f2e32940D4f37FA313"
      values.$members.3:
-        "0x23ceC92F92bde95e401f0a2b50b072A6069dFBd5"
+        "eth:0x23ceC92F92bde95e401f0a2b50b072A6069dFBd5"
      values.$members.4:
-        "0x9850b4F631F1cae37bb1C42C8004ffc2Cd31DcBe"
+        "eth:0x9850b4F631F1cae37bb1C42C8004ffc2Cd31DcBe"
      values.$members.5:
-        "0x00A74411DDBC50C04353543d5D3f4296936DA645"
+        "eth:0x00A74411DDBC50C04353543d5D3f4296936DA645"
      values.$members.6:
-        "0x34b6Ca118e1e665Ff4583c39615d864aD2C19c7A"
+        "eth:0x34b6Ca118e1e665Ff4583c39615d864aD2C19c7A"
      implementationNames.0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x9850b4F631F1cae37bb1C42C8004ffc2Cd31DcBe) {
    +++ description: None
      address:
-        "0x9850b4F631F1cae37bb1C42C8004ffc2Cd31DcBe"
+        "eth:0x9850b4F631F1cae37bb1C42C8004ffc2Cd31DcBe"
    }
```

```diff
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e) {
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
      address:
-        "0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e"
+        "eth:0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e"
      implementationNames.0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e:
-        "L1VerifierPlonk"
      implementationNames.eth:0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e:
+        "L1VerifierPlonk"
    }
```

```diff
    EOA  (0xB66d4AF4E96bF96026454A6A150EDD2CE55E9E67) {
    +++ description: None
      address:
-        "0xB66d4AF4E96bF96026454A6A150EDD2CE55E9E67"
+        "eth:0xB66d4AF4E96bF96026454A6A150EDD2CE55E9E67"
    }
```

```diff
    contract ChainAdminOwnable (0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD) {
    +++ description: None
      address:
-        "0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
+        "eth:0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
      values.owner:
-        "0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE"
+        "eth:0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.tokenMultiplierSetter:
-        "0x27251a0185F0354C7D5BF0aF5fAA1A384712C6bd"
+        "eth:0x27251a0185F0354C7D5BF0aF5fAA1A384712C6bd"
      implementationNames.0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD:
-        "ChainAdminOwnable"
      implementationNames.eth:0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD:
+        "ChainAdminOwnable"
    }
```

```diff
    EOA  (0xDAC936134633C309BA831239e5e25Cfe5094b229) {
    +++ description: None
      address:
-        "0xDAC936134633C309BA831239e5e25Cfe5094b229"
+        "eth:0xDAC936134633C309BA831239e5e25Cfe5094b229"
    }
```

```diff
+   Status: CREATED
    contract DualVerifier (0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0)
    +++ description: A router contract for verifiers. Routes verification requests to eth:0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or eth:0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract zkVmDiamond (0x742A28e22277945BBAAa34810393bf6e8512576C)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract Safe (0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract ChainAdminOwnable (0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD)
    +++ description: None
```

Generated with discovered.json: 0x3e81b28325c7ff3142d0a905d05f0ee7b5ee1b35

# Diff at Fri, 11 Jul 2025 13:12:11 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6f02976fdd9466dab085b947bf3c4d28ccef1010 block: 22593196
- current block number: 22896151

## Description

v28 upgrade planned.

## Watched changes

```diff
    contract ChainAdminOwnable (0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.2:
+        {"_protocolVersion":120259084288,"_upgradeTimestamp":1752159600}
    }
```

Generated with discovered.json: 0x2ec15ec764ca035425b81ac0c096959a217e37c3

# Diff at Fri, 04 Jul 2025 12:19:06 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22593196
- current block number: 22593196

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593196 (main branch discovery), not current.

```diff
    EOA  (0x27251a0185F0354C7D5BF0aF5fAA1A384712C6bd) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
+        "eth:0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0x742A28e22277945BBAAa34810393bf6e8512576C"
+        "eth:0x742A28e22277945BBAAa34810393bf6e8512576C"
    }
```

```diff
    contract Safe (0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
+        "eth:0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
      receivedPermissions.0.from:
-        "ethereum:0x742A28e22277945BBAAa34810393bf6e8512576C"
+        "eth:0x742A28e22277945BBAAa34810393bf6e8512576C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
+        "eth:0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
    }
```

```diff
    EOA  (0xB66d4AF4E96bF96026454A6A150EDD2CE55E9E67) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
    contract ChainAdminOwnable (0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x742A28e22277945BBAAa34810393bf6e8512576C"
+        "eth:0x742A28e22277945BBAAa34810393bf6e8512576C"
    }
```

```diff
    EOA  (0xDAC936134633C309BA831239e5e25Cfe5094b229) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

Generated with discovered.json: 0xf7de585e97c60b9fe28ce372ab3a65d3c97a2a1f

# Diff at Wed, 25 Jun 2025 07:14:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22593196
- current block number: 22593196

## Description

Config: rename, tidy template folders. unhide the L1NativeTokenVault.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593196 (main branch discovery), not current.

```diff
    contract zkVmDiamond (0x742A28e22277945BBAAa34810393bf6e8512576C) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      template:
-        "shared-zk-stack/v26/Diamond"
+        "shared-zk-stack/Diamond"
    }
```

Generated with discovered.json: 0xf5b4a212f5b6993bdee4b437e72120cfe29ef431

# Diff at Fri, 30 May 2025 04:38:38 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22574469
- current block number: 22593196

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract zkVmDiamond (0x742A28e22277945BBAAa34810393bf6e8512576C) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.0:
-        "0xbceaa498ea422a98ec91f01d7b76774610e543c9efd855141de933065f32b308"
+        "0xbc2380479529743c27e6ab96cdf08210319fadcbca0856cf50c6b1b54bf8437f"
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
      values.$pastUpgrades.3:
+        ["2025-04-11T18:48:47.000Z","0xe2beab76f0b037d55d5bb75beca94db53fce7655340bf463e2f884aa600780fd",["0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb","0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1","0x36b026c39125964D99596CE302866B5A59E4dE27","0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"]]
      values.$pastUpgrades.0.2.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.0.2.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.0.2.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.0.2.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.0.1:
-        "2025-04-11T18:48:47.000Z"
+        "2025-05-27T14:50:35.000Z"
      values.$pastUpgrades.0.0:
-        "0xe2beab76f0b037d55d5bb75beca94db53fce7655340bf463e2f884aa600780fd"
+        "0x41608f3a9087d7437d7bfd8ef533217782493c95d5fa43762e45e4498bd05e21"
      values.$upgradeCount:
-        3
+        4
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
.../lachain/ethereum/.flat/DualVerifier.sol        |   97 ++
 .../lachain/ethereum/.flat/L1VerifierFflonk.sol    | 1605 ++++++++++++++++++++
 .../Verifier.sol => .flat/L1VerifierPlonk.sol}     |   12 +-
 .../zkVmDiamond/AdminFacet.1.sol                   |   37 +-
 .../zkVmDiamond/ExecutorFacet.4.sol                |   82 +-
 .../zkVmDiamond/GettersFacet.2.sol                 |   27 +-
 .../zkVmDiamond/MailboxFacet.3.sol                 |   74 +-
 7 files changed, 1885 insertions(+), 49 deletions(-)
```

Generated with discovered.json: 0x37978aacef9de3e58c3d5adc966aee685ee8b9fb

# Diff at Tue, 27 May 2025 15:29:45 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 60986426

## Description

Provide description of changes. This section will be preserved.

Generated with discovered.json: 0x638710fcd49a37a710b8444f21cd0549b25b6c31

# Diff at Tue, 27 May 2025 15:29:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22574469

## Description

Initial discovery of a standard zk stack chain (v26).

## Initial discovery

```diff
+   Status: CREATED
    contract zkVmDiamond (0x742A28e22277945BBAAa34810393bf6e8512576C)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract Safe (0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainAdminOwnable (0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```

