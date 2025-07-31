Generated with discovered.json: 0xeae209be187a35030a81c6811cec0c845d4281c6

# Diff at Thu, 31 Jul 2025 10:25:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fc6aee0100bcf523dbfb20b1884ed98a8717207a block: 1748579591
- current timestamp: 1753944307

## Description

v28 upgrade to standard contracts.

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
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
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
      values.$pastUpgrades.6:
+        ["2025-07-30T07:52:47.000Z","0x8428717649285a036a7d0463dad7fbec8f244330ddf804401480f369a76e3ecd",["eth:0x431449e2a28A69122860A4956A3f7191eE15aFBC","eth:0xae5cbB5f70e134668a13d7C8EcEF5e9E6FffCF22","eth:0x365D0ae3ECA13004daf2A4ba1501c01AaEbb4fec","eth:0x2f116b9033d88Bb3Cf64C371AE5458fbA22BA39A"]]
      values.$upgradeCount:
-        6
+        7
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
.../{.flat@1748579591 => .flat}/CronosZkEvm/AdminFacet.1.sol   |  2 +-
 .../CronosZkEvm/ExecutorFacet.4.sol                            |  2 +-
 .../{.flat@1748579591 => .flat}/CronosZkEvm/GettersFacet.2.sol |  2 +-
 .../{.flat@1748579591 => .flat}/CronosZkEvm/MailboxFacet.3.sol |  2 +-
 .../ethereum/{.flat@1748579591 => .flat}/DualVerifier.sol      |  2 +-
 .../ethereum/{.flat@1748579591 => .flat}/L1VerifierFflonk.sol  |  6 +++---
 .../ethereum/{.flat@1748579591 => .flat}/L1VerifierPlonk.sol   | 10 +++++-----
 7 files changed, 13 insertions(+), 13 deletions(-)
```

Generated with discovered.json: 0x844a544e4be4cd7ffb0b0002615c1e09d9a0ea9d

# Diff at Mon, 14 Jul 2025 12:47:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22593193
- current block number: 22593193

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22593193 (main branch discovery), not current.

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
    EOA  (0x149f3850AcfC5caa3ecF31dCF922A75eD2944a5e) {
    +++ description: None
      address:
-        "0x149f3850AcfC5caa3ecF31dCF922A75eD2944a5e"
+        "eth:0x149f3850AcfC5caa3ecF31dCF922A75eD2944a5e"
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
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
      address:
-        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
+        "eth:0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xE9A03EB4C2262A7d01981cAD1f2c1FFa05CB64Fb"
+        "eth:0xE9A03EB4C2262A7d01981cAD1f2c1FFa05CB64Fb"
      values.$members.1:
-        "0x5628D5EF2bAd701617b4003F6a2e34eeB89F2ADa"
+        "eth:0x5628D5EF2bAd701617b4003F6a2e34eeB89F2ADa"
      values.$members.2:
-        "0xc7e3F37766627b5DAF734f5bb5e43Ae9327011D8"
+        "eth:0xc7e3F37766627b5DAF734f5bb5e43Ae9327011D8"
      implementationNames.0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x5628D5EF2bAd701617b4003F6a2e34eeB89F2ADa) {
    +++ description: None
      address:
-        "0x5628D5EF2bAd701617b4003F6a2e34eeB89F2ADa"
+        "eth:0x5628D5EF2bAd701617b4003F6a2e34eeB89F2ADa"
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
-        "0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122"
+        "eth:0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122"
      values.validatorsVTL.1:
-        "0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7"
+        "eth:0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7"
      implementationNames.0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E:
-        "ValidatorTimelock"
      implementationNames.eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E:
+        "ValidatorTimelock"
    }
```

```diff
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      address:
-        "0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
+        "eth:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
      values.acAdmins.0:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "eth:0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.acAdmins.1:
-        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
+        "eth:0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.acAdmins.2:
-        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
+        "eth:0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
      values.accessControl.ADMIN.members.0:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "eth:0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.ADMIN.members.1:
-        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
+        "eth:0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.ADMIN.members.2:
-        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
+        "eth:0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
      values.accessControl.ORACLE.members.0:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "eth:0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.ORACLE.members.1:
-        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
+        "eth:0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.UPGRADER.members.0:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "eth:0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.UPGRADER.members.1:
-        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
+        "eth:0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.UPGRADER.members.2:
-        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
+        "eth:0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
      values.accessControl.FEE_ADMIN.members.0:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "eth:0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.FEE_ADMIN.members.1:
-        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
+        "eth:0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.FEE_ADMIN.members.2:
-        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
+        "eth:0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
      implementationNames.0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4:
-        "CronosZkEVMAdmin"
      implementationNames.eth:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4:
+        "CronosZkEVMAdmin"
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      address:
-        "0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "eth:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
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
-        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
+        "eth:0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
      values.$pastUpgrades.2.2.1:
-        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
+        "eth:0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
      values.$pastUpgrades.2.2.2:
-        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
+        "eth:0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
      values.$pastUpgrades.2.2.3:
-        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
+        "eth:0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
      values.$pastUpgrades.3.2.0:
-        "0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
+        "eth:0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
      values.$pastUpgrades.3.2.1:
-        "0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
+        "eth:0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
      values.$pastUpgrades.3.2.2:
-        "0x5575218cECd370E1d630d1AdB03c254B0B376821"
+        "eth:0x5575218cECd370E1d630d1AdB03c254B0B376821"
      values.$pastUpgrades.3.2.3:
-        "0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
+        "eth:0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
      values.$pastUpgrades.4.2.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "eth:0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
      values.$pastUpgrades.4.2.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "eth:0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
      values.$pastUpgrades.4.2.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "eth:0x36b026c39125964D99596CE302866B5A59E4dE27"
      values.$pastUpgrades.4.2.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "eth:0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
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
-        "0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
+        "eth:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
      values.getBaseToken:
-        "0x28Ff2E4dD1B58efEB0fC138602A28D5aE81e44e2"
+        "eth:0x28Ff2E4dD1B58efEB0fC138602A28D5aE81e44e2"
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
-        "0xA8998F231a660Eca365B382943c71ad9b7619139"
+        "eth:0xA8998F231a660Eca365B382943c71ad9b7619139"
      values.getVerifier:
-        "0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
+        "eth:0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0"
      values.validators.0:
-        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "eth:0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
      values.validators.1:
-        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      implementationNames.0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc:
-        "DiamondProxy"
      implementationNames.0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4:
-        "AdminFacet"
      implementationNames.0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4:
-        "GettersFacet"
      implementationNames.0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f:
-        "MailboxFacet"
      implementationNames.0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490:
-        "ExecutorFacet"
      implementationNames.eth:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc:
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
    EOA  (0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7) {
    +++ description: None
      address:
-        "0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7"
+        "eth:0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7"
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
-        "0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122"
+        "eth:0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122"
      values.validatorsVTL.1:
-        "0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7"
+        "eth:0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7"
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
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      address:
-        "0xA8998F231a660Eca365B382943c71ad9b7619139"
+        "eth:0xA8998F231a660Eca365B382943c71ad9b7619139"
      values.owner:
-        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
+        "eth:0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xA8998F231a660Eca365B382943c71ad9b7619139:
-        "TransactionFiltererDenyList"
      implementationNames.eth:0xA8998F231a660Eca365B382943c71ad9b7619139:
+        "TransactionFiltererDenyList"
    }
```

```diff
    EOA  (0xAaC5b858d10107900e642681a97887D33FC3c9E9) {
    +++ description: None
      address:
-        "0xAaC5b858d10107900e642681a97887D33FC3c9E9"
+        "eth:0xAaC5b858d10107900e642681a97887D33FC3c9E9"
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
    EOA  (0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122) {
    +++ description: None
      address:
-        "0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122"
+        "eth:0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122"
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      address:
-        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
+        "eth:0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xE9A03EB4C2262A7d01981cAD1f2c1FFa05CB64Fb"
+        "eth:0xE9A03EB4C2262A7d01981cAD1f2c1FFa05CB64Fb"
      values.$members.1:
-        "0xAaC5b858d10107900e642681a97887D33FC3c9E9"
+        "eth:0xAaC5b858d10107900e642681a97887D33FC3c9E9"
      values.$members.2:
-        "0xc7e3F37766627b5DAF734f5bb5e43Ae9327011D8"
+        "eth:0xc7e3F37766627b5DAF734f5bb5e43Ae9327011D8"
      values.$members.3:
-        "0x5628D5EF2bAd701617b4003F6a2e34eeB89F2ADa"
+        "eth:0x5628D5EF2bAd701617b4003F6a2e34eeB89F2ADa"
      values.$members.4:
-        "0x149f3850AcfC5caa3ecF31dCF922A75eD2944a5e"
+        "eth:0x149f3850AcfC5caa3ecF31dCF922A75eD2944a5e"
      implementationNames.0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xc7e3F37766627b5DAF734f5bb5e43Ae9327011D8) {
    +++ description: None
      address:
-        "0xc7e3F37766627b5DAF734f5bb5e43Ae9327011D8"
+        "eth:0xc7e3F37766627b5DAF734f5bb5e43Ae9327011D8"
    }
```

```diff
    EOA  (0xE9A03EB4C2262A7d01981cAD1f2c1FFa05CB64Fb) {
    +++ description: None
      address:
-        "0xE9A03EB4C2262A7d01981cAD1f2c1FFa05CB64Fb"
+        "eth:0xE9A03EB4C2262A7d01981cAD1f2c1FFa05CB64Fb"
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
    EOA  (0xfD7a03Cdb68E6488F950108A4d24f15519b87339) {
    +++ description: None
      address:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "eth:0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
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
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc)
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
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b)
    +++ description: None
```

Generated with discovered.json: 0x89daec23618a99960e12ca7255d61f099ecda098

# Diff at Fri, 04 Jul 2025 12:18:56 GMT:

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
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
+        "eth:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
      receivedPermissions.0.from:
-        "ethereum:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "eth:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
+        "eth:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
    }
```

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "eth:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
    }
```

```diff
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "eth:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
    }
```

```diff
    EOA  (0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7) {
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
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.from:
-        "ethereum:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "eth:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "eth:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
    }
```

```diff
    EOA  (0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122) {
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
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
+        "eth:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
      receivedPermissions.0.from:
-        "ethereum:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "eth:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
      receivedPermissions.1.from:
-        "ethereum:0xA8998F231a660Eca365B382943c71ad9b7619139"
+        "eth:0xA8998F231a660Eca365B382943c71ad9b7619139"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
+        "eth:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
    }
```

```diff
    EOA  (0xfD7a03Cdb68E6488F950108A4d24f15519b87339) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
+        "eth:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
      receivedPermissions.0.from:
-        "ethereum:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "eth:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
+        "eth:0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
    }
```

Generated with discovered.json: 0x3721e99f4721d8232a2d52b78255c45344abc2b8

# Diff at Thu, 03 Jul 2025 10:57:02 GMT:

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

Generated with discovered.json: 0xbf00e0835a896ff936f684a40e7e6b623726d37f

# Diff at Wed, 25 Jun 2025 07:14:25 GMT:

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
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
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

Generated with discovered.json: 0x402dbd90004a3398cf926ff50d70011cd535edfd

# Diff at Fri, 30 May 2025 04:33:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22181510
- current block number: 22593193

## Description

v27 upgrade to standard contracts.

## Watched changes

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.1:
-        "0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f"
+        "0xbc2380479529743c27e6ab96cdf08210319fadcbca0856cf50c6b1b54bf8437f"
      sourceHashes.0:
-        "0xbceaa498ea422a98ec91f01d7b76774610e543c9efd855141de933065f32b308"
+        "0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f"
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
      values.$pastUpgrades.5:
+        ["2024-07-30T16:30:35.000Z","0x98231507bfbba69996de5a8572d8f83ccf9756be6232d3f9431e2fc68c98d58b",["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]]
      values.$pastUpgrades.3.2:
-        "0x98231507bfbba69996de5a8572d8f83ccf9756be6232d3f9431e2fc68c98d58b"
+        ["0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb","0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1","0x36b026c39125964D99596CE302866B5A59E4dE27","0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"]
      values.$pastUpgrades.3.1:
-        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
+        "2025-03-26T09:58:23.000Z"
      values.$pastUpgrades.3.0:
-        "2024-07-30T16:30:35.000Z"
+        "0x8a8381da196ef20e8eb6868cdfff6f518ea9affc197a6ba7e607e9bd52947d3a"
      values.$pastUpgrades.2.2.3:
-        "0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"
+        "0x26b9a55DaBab9A8e74815A9D6Cd7F74AC0d7215f"
      values.$pastUpgrades.2.2.2:
-        "0x36b026c39125964D99596CE302866B5A59E4dE27"
+        "0x05DeB01AaDB6C98F8B78a1F9A81ccd68Ac4d70d4"
      values.$pastUpgrades.2.2.1:
-        "0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1"
+        "0xF2C9D38D16c7A7Dc9aA4F743Fce024354d9c19B4"
      values.$pastUpgrades.2.2.0:
-        "0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb"
+        "0x0A7C1b8D56BE02d9731e3A764107602f8F6dd490"
      values.$pastUpgrades.2.1:
-        "2025-03-26T09:58:23.000Z"
+        "0xe90b1302fcd633e9c1158daba6a6f05512efb7bc437b79eeb4f1a87d52dda076"
      values.$pastUpgrades.2.0:
-        "0x8a8381da196ef20e8eb6868cdfff6f518ea9affc197a6ba7e607e9bd52947d3a"
+        "2025-05-28T08:07:23.000Z"
      values.$upgradeCount:
-        5
+        6
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
.../CronosZkEvm/AdminFacet.1.sol                   |   37 +-
 .../CronosZkEvm/ExecutorFacet.4.sol                |   82 +-
 .../CronosZkEvm/GettersFacet.2.sol                 |   27 +-
 .../CronosZkEvm/MailboxFacet.3.sol                 |   74 +-
 .../cronoszkevm/ethereum/.flat/DualVerifier.sol    |   97 ++
 .../ethereum/.flat/L1VerifierFflonk.sol            | 1605 ++++++++++++++++++++
 .../Verifier.sol => .flat/L1VerifierPlonk.sol}     |   12 +-
 7 files changed, 1885 insertions(+), 49 deletions(-)
```

Generated with discovered.json: 0x704cfdb38ac807d4eab497be6d6858d2f5675a11

# Diff at Tue, 27 May 2025 08:30:33 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22181510
- current block number: 22181510

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22181510 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
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

Generated with discovered.json: 0x23343b73dda09204f30f0a873a9e9f5fc6fee181

# Diff at Fri, 23 May 2025 09:41:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22181510
- current block number: 22181510

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22181510 (main branch discovery), not current.

```diff
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getAdmin"
      directlyReceivedPermissions.0.role:
+        ".acAdmins"
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
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".getAdmin"
    }
```

```diff
    EOA  (0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7) {
    +++ description: None
      receivedPermissions.1.role:
+        ".validatorsVTL"
      receivedPermissions.0.role:
+        ".validatorsVTL"
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
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getTransactionFilterer"
    }
```

```diff
    EOA  (0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122) {
    +++ description: None
      receivedPermissions.1.role:
+        ".validatorsVTL"
      receivedPermissions.0.role:
+        ".validatorsVTL"
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      receivedPermissions.1.role:
+        ".getAdmin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".acAdmins"
    }
```

```diff
    EOA  (0xfD7a03Cdb68E6488F950108A4d24f15519b87339) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getAdmin"
      directlyReceivedPermissions.0.role:
+        ".acAdmins"
    }
```

Generated with discovered.json: 0xc1c4e78a9b24826e3e44d510f2f60a307161c767

# Diff at Tue, 29 Apr 2025 08:19:17 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22181510
- current block number: 22181510

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22181510 (main branch discovery), not current.

```diff
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7","via":[]},{"permission":"validateZkStack","to":"0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122","via":[]}]
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]},{"permission":"interact","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"interact","to":"0xA8998F231a660Eca365B382943c71ad9b7619139","description":"define addresses that can send transactions from L1 to L2 (e.g. for deposits, withdrawals, queued transactions). This is enforced in the Mailbox Facet.","via":[]},{"permission":"interact","to":"0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]},{"permission":"interact","to":"0xfD7a03Cdb68E6488F950108A4d24f15519b87339","description":"manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]}]
    }
```

```diff
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      issuedPermissions:
-        [{"permission":"validateZkStack","to":"0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7","via":[]},{"permission":"validateZkStack","to":"0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122","via":[]}]
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"interact","to":"0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b","description":"manage the blacklist of addresses in the TransactionFilterer.","via":[]}]
    }
```

Generated with discovered.json: 0x4da8b5e0b5278a43d994053f56422af32a5d1b54

# Diff at Thu, 10 Apr 2025 14:42:20 GMT:

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

Generated with discovered.json: 0xb6325967d5e6c6964d73a43ab98e401eca04bb19

# Diff at Wed, 02 Apr 2025 15:08:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6d66206526294fb00e0c08e8ff3bf70febdc1aaa block: 22144857
- current block number: 22181510

## Description

shared zk stack contracts upgraded to v26: config related changes for all children chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22144857 (main branch discovery), not current.

```diff
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
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
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      directlyReceivedPermissions.0.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      template:
-        "shared-zk-stack/Diamond_v26"
+        "shared-zk-stack/v26/Diamond"
      issuedPermissions.5.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
      issuedPermissions.4.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
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
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      receivedPermissions.1.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

```diff
    contract undefined (0xfD7a03Cdb68E6488F950108A4d24f15519b87339) {
    +++ description: None
      receivedPermissions.0.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "manage fees, apply predefined upgrades, manage censorship through a TransactionFilterer, set DA mode, migrate the chain to whitelisted settlement layers (Chain Admin role)."
    }
```

```diff
+   Status: CREATED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

Generated with discovered.json: 0x91dbb8733e55245490020e9b1db9887f027db0fe

# Diff at Fri, 28 Mar 2025 10:40:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@279f845afa28d7cd0a0fe99f5744c0fe98cd5c86 block: 22022296
- current block number: 22144857

## Description

v26 upgrade.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: Implements the ZK proof verification logic.
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
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
      issuedPermissions.5:
+        {"permission":"interact","to":"0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]}
      issuedPermissions.4.to:
-        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
+        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
      issuedPermissions.3.to:
-        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      issuedPermissions.2.to:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      issuedPermissions.2.description:
-        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
+        "commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock."
      issuedPermissions.2.via.0:
-        {"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}
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
      values.$pastUpgrades.4:
+        ["2024-07-30T16:30:35.000Z","0x98231507bfbba69996de5a8572d8f83ccf9756be6232d3f9431e2fc68c98d58b",["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]]
      values.$pastUpgrades.2.2:
-        "0x98231507bfbba69996de5a8572d8f83ccf9756be6232d3f9431e2fc68c98d58b"
+        ["0xEaedCF01c0B01C1a10b74cB0A2cDeF78a9540cdb","0x95C45F931946C97D10D9d6e859Fe8D62785ed3C1","0x36b026c39125964D99596CE302866B5A59E4dE27","0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800"]
      values.$pastUpgrades.2.1:
-        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
+        "2025-03-26T09:58:23.000Z"
      values.$pastUpgrades.2.0:
-        "2024-07-30T16:30:35.000Z"
+        "0x8a8381da196ef20e8eb6868cdfff6f518ea9affc197a6ba7e607e9bd52947d3a"
      values.$upgradeCount:
-        4
+        5
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
-        ["0xA8998F231a660Eca365B382943c71ad9b7619139"]
      values.validators.1:
+        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      values.getBaseTokenAssetId:
+        "0x6ecd2c6d40ee7219f2e91c863d83d919c56dc87d93915f68b90119ab5fd25c42"
      values.getChainId:
+        388
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
+        "0xA8998F231a660Eca365B382943c71ad9b7619139"
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
    contract undefined (0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"}
    }
```

```diff
    contract undefined (0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"validateZkStack","from":"0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"}
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
.../CronosZkEvm/AdminFacet.1.sol                   | 1442 ++++++++++++-
 .../CronosZkEvm/ExecutorFacet.4.sol                | 2016 ++++++++++++++----
 .../CronosZkEvm/GettersFacet.2.sol                 | 1153 +++++++++-
 .../CronosZkEvm/MailboxFacet.3.sol                 | 2195 ++++++++++++++------
 .../ethereum/.flat/ValidatorTimelock.sol           |  504 +++++
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

Generated with discovered.json: 0x26e41d58817dac1ef7e59bd2050df6860b31ef5d

# Diff at Wed, 19 Mar 2025 13:04:31 GMT:

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
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x08b88911d2d568b183784c6aa64fea47c7526529

# Diff at Tue, 11 Mar 2025 08:00:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 21766582
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
 .../.flat@21766582/Guardians.sol => /dev/null      | 1439 --------------------
 .../ProtocolUpgradeHandler.sol => /dev/null        |  605 --------
 .../SecurityCouncil.sol => /dev/null               | 1389 -------------------
 4 files changed, 4666 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766582 (main branch discovery), not current.

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

Generated with discovered.json: 0xb5c0ee9ad913e7e2e814bee0bd66e309bcb85f53

# Diff at Tue, 04 Mar 2025 10:39:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766582
- current block number: 21766582

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766582 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      sinceBlock:
+        21081436
    }
```

```diff
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
      sinceBlock:
+        20524449
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
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      sinceBlock:
+        20802749
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sinceBlock:
+        20420571
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      sinceBlock:
+        20416268
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      sinceBlock:
+        20422122
    }
```

Generated with discovered.json: 0xe52421a90156d2ee27c54185a116f07ed7990a52

# Diff at Wed, 26 Feb 2025 10:32:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21766582
- current block number: 21766582

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766582 (main branch discovery), not current.

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
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x6accf4d7afa41a9022fa986a7a65ece23100f835

# Diff at Tue, 04 Feb 2025 12:30:55 GMT:

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
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
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
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions.4.permission:
-        "configure"
+        "interact"
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
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x5be1bc8e4d51f2f88d9da52f09f3bb1f5ca6b1de

# Diff at Mon, 03 Feb 2025 14:33:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21721078
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
discovery. Values are for block 21721078 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.priorityQueueFrontOperation:
-        {"canonicalTxHash":"0x8a73a91142980f05c9e362c18105924b03a060a64713514f9078ed67f4dd4ceb","expirationTimestamp":1737962003,"layer2Tip":0}
    }
```

Generated with discovered.json: 0x4fd34a1498fdc78348d91472ab608bb4dac4cb3c

# Diff at Tue, 28 Jan 2025 06:34:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21686341
- current block number: 21721078

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21686341 (main branch discovery), not current.

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
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]
    }
```

```diff
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      values.acAdmins:
+        ["0xfD7a03Cdb68E6488F950108A4d24f15519b87339","0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce","0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"]
      directlyReceivedPermissions:
+        [{"permission":"configure","from":"0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."}]
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
+++ description: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2.
+++ severity: HIGH
      values.txFilterer.0:
-        {"oldTransactionFilterer":"0x0000000000000000000000000000000000000000","newTransactionFilterer":"0xA8998F231a660Eca365B382943c71ad9b7619139"}
+        "0xA8998F231a660Eca365B382943c71ad9b7619139"
      fieldMeta.txFilterer.description:
-        "Optional: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
+        "This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
      fieldMeta.getProtocolVersion.description:
-        "Protocol version, increments with each protocol change"
+        "Protocol version, increments with each protocol upgrade."
      fieldMeta.getVerifierParams.description:
-        "Verifier parameters used for proving batches"
+        "Verifier parameters used for proving batches."
      template:
+        "shared-zk-stack/Diamond"
      description:
+        "The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions."
      issuedPermissions:
+        [{"permission":"configure","to":"0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]},{"permission":"configure","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"configure","to":"0xA8998F231a660Eca365B382943c71ad9b7619139","description":"define addresses that can send transactions from L1 to L2 (e.g. for deposits, withdrawals, queued transactions). This is enforced in the Mailbox Facet.","via":[]},{"permission":"configure","to":"0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]},{"permission":"configure","to":"0xfD7a03Cdb68E6488F950108A4d24f15519b87339","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]}]
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      severity:
+        "HIGH"
      issuedPermissions:
+        [{"permission":"configure","to":"0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b","description":"manage the blacklist of addresses in the TransactionFilterer.","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","from":"0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc","description":"define addresses that can send transactions from L1 to L2 (e.g. for deposits, withdrawals, queued transactions). This is enforced in the Mailbox Facet."}]
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]},{"permission":"configure","from":"0xA8998F231a660Eca365B382943c71ad9b7619139","description":"manage the blacklist of addresses in the TransactionFilterer."}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h.
```

Generated with discovered.json: 0x5e8e0d515eadb4b77c41c006266778320ea52b99

# Diff at Thu, 23 Jan 2025 09:37:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c34926fa70131af78b4ff8ff2873e9c9f24dfc80 block: 21678734
- current block number: 21686341

## Description

Upgrade to v25 completed.

## Watched changes

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.getL2SystemContractsUpgradeBatchNumber:
-        268
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        268
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xd3086b71c95ce83e7f3d30ab1890ada2334695a05b65715e56f42d96b22c8674"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x05741105616b1542773967c3b52b45948335239c

# Diff at Wed, 22 Jan 2025 08:09:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 20876242
- current block number: 21678734

## Description

Upgrade to the known protocol version 25! ['protocol defence' upgrade](https://github.com/matter-labs/era-contracts/pull/774).

This upgrade brings formatting, gas optimizations and other minor changes.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
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
      values.$pastUpgrades.3:
+        ["2025-01-22T06:36:23.000Z","0x2784286656e572cfe0abf2117628fdc5a6cd12e5c060de171c54063b273bc216",["0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a","0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9","0x5575218cECd370E1d630d1AdB03c254B0B376821","0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"]]
      values.$upgradeCount:
-        3
+        4
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
+        268
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        268
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
.../CronosZkEvm/AdminFacet.1.sol                   | 166 +++++++---
 .../CronosZkEvm/ExecutorFacet.4.sol                | 343 ++++++++++++++-------
 .../CronosZkEvm/GettersFacet.2.sol                 | 117 +++++--
 .../CronosZkEvm/MailboxFacet.3.sol                 | 255 +++++++++++----
 4 files changed, 627 insertions(+), 254 deletions(-)
```

Generated with discovered.json: 0x1c20d7dcd3a263db0150479e60f7450583ebe9a6

# Diff at Mon, 21 Oct 2024 11:25:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20876242
- current block number: 20876242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20876242 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
      values.$pastUpgrades.2.1:
-        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
+        "0xe5711797fb601abc2d70e9265a897ba5a16a10125a9cadbd616f938592604fe7"
      values.$pastUpgrades.1.2:
+        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
      values.$pastUpgrades.1.1:
-        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
+        "0x98231507bfbba69996de5a8572d8f83ccf9756be6232d3f9431e2fc68c98d58b"
      values.$pastUpgrades.0.2:
+        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
      values.$pastUpgrades.0.1:
-        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
+        "0x98231507bfbba69996de5a8572d8f83ccf9756be6232d3f9431e2fc68c98d58b"
    }
```

Generated with discovered.json: 0x243a772d8506e5a22a9027dd476db25c8e6edf7c

# Diff at Mon, 14 Oct 2024 10:50:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20876242
- current block number: 20876242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20876242 (main branch discovery), not current.

```diff
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      sourceHashes:
+        ["0xe77f0ac44ab78d4c02668f0f81051a448ab8a4b96343747f6bd1143acc7748a8"]
    }
```

```diff
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604) {
    +++ description: None
      sourceHashes:
+        ["0xb36dfb10be7530bb56af796b85f6c84bf90513603fe59c2f7f0d78fc2a9a9235"]
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      sourceHashes:
+        ["0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f","0x9ae32beaa5dc29055f75d3cd08fbec35ed3eee3e2ff35de263a78f7d63c610f9","0xd272def5b4e3f0a68e3019d7d40675ca6d3e3fc35500e9aafe864bce8c697de2","0x419cee160f60572fc9189007ec7c1e3c13e54d80bf1e78f837bc8fa001519685","0xe521f6bd6250a2c92af323768ad8a2274cc334725b5ed8960d8421f063fc3285"]
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      sourceHashes:
+        ["0x69b34ba871ceb0dbecab437be2d0701a5d768bb541a738bb3a7d2883d10a403e"]
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x87ece57be9c4c765e7d3656e3fbcff36d397e2ca

# Diff at Wed, 02 Oct 2024 07:13:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@97b544adfba04e970ecc4cdd40ee3ff679944269 block: 20862570
- current block number: 20876242

## Description

upgradeChainFromVersion() called, upgrading to protocol version 103079215106. This is the latest version used by ZKsync Era, effectively bringing no changes for CronosZkEvm since the postUpgradeCalldata is empty and the diamond implementations are the same as last version. (Era used this upgrade to change an admin) Upgrader role is given to the old Admin EOA (no net perm changes).

## Watched changes

```diff
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      values.accessControl.UPGRADER.members.2:
+        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.$pastUpgrades.2:
+        ["2024-10-02T06:36:11.000Z",["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]]
      values.$upgradeCount:
-        2
+        3
+++ description: Protocol version, increments with each protocol change
+++ severity: MEDIUM
      values.getProtocolVersion:
-        103079215105
+        103079215106
      values.getSemverProtocolVersion.2:
-        1
+        2
    }
```

Generated with discovered.json: 0x94fa59118b88752205637a2b6454460d2c28b0da

# Diff at Tue, 01 Oct 2024 10:50:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20862570
- current block number: 20862570

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20862570 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-30T16:30:35.000Z",["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]],["2024-07-30T16:30:35.000Z",["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xab96172d00f6f2326ada7aab90076ea973d78e84

# Diff at Mon, 30 Sep 2024 09:28:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@eec6993b988ab9a9f325d04da2e9717ed24ad0b9 block: 20777184
- current block number: 20862570

## Description

CronosZkEVMAdmin upgrade: New IChainAdmin interface with multicall ability, thus fully inheriting the ChainAdmin permissions in the Diamond. Project config updated, transactionFilterer permissions added.

## Watched changes

```diff
-   Status: DELETED
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC)
    +++ description: None
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.getAdmin:
-        "0x66eF951aEC26987915582340bCAA569E5Be67cDC"
+        "0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
    }
```

```diff
+   Status: CREATED
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4)
    +++ description: None
```

## Source code changes

```diff
.../.flat/CronosChainAdminMultisig/GnosisSafe.sol  | 953 +++++++++++++++++++++
 .../CronosChainAdminMultisig/GnosisSafeProxy.p.sol |  35 +
 .../{.flat@20777184 => .flat}/CronosZkEVMAdmin.sol |  60 +-
 3 files changed, 1047 insertions(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777184 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce)
    +++ description: None
```

```diff
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC) {
    +++ description: None
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"ADMIN":{"adminRole":"ADMIN","members":["0xfD7a03Cdb68E6488F950108A4d24f15519b87339","0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"]},"ORACLE":{"adminRole":"ADMIN","members":["0xfD7a03Cdb68E6488F950108A4d24f15519b87339","0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"]},"UPGRADER":{"adminRole":"ADMIN","members":["0xfD7a03Cdb68E6488F950108A4d24f15519b87339","0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"]},"FEE_ADMIN":{"adminRole":"ADMIN","members":["0xfD7a03Cdb68E6488F950108A4d24f15519b87339","0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"]}}
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      name:
-        "DenyListOwnerMultisig"
+        "TxFiltererOwnerMultisig"
    }
```

Generated with discovered.json: 0x6000c0e91f82353e42d690f3d482b9e384a2c0b3

# Diff at Wed, 18 Sep 2024 11:29:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14dc1d5395aaa4aca4e79a08fd6132e42e3cf1a4 block: 20668550
- current block number: 20777184

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20668550 (main branch discovery), not current.

```diff
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
      name:
-        "AdminMultisig"
+        "CronosChainAdminMultisig"
    }
```

Generated with discovered.json: 0x4af2a68368669c3387c20071a4d0fb5d972fe239

# Diff at Mon, 16 Sep 2024 13:59:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bb1c8d62bd8e55be7219cbf896b4a8459c92e616 block: 20668550
- current block number: 20668550

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20668550 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.validators.0:
+        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
    }
```

Generated with discovered.json: 0x5333e854a4b470f861b576eb3371fac75b833932

# Diff at Fri, 23 Aug 2024 07:26:48 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@08f0832a5dea29e7c493cd50bda4bf1729aa03ae block: 20568367
- current block number: 20589800

## Description

Verified the bridge proxy contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20568367 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      unverified:
-        true
    }
```

Generated with discovered.json: 0x0c856d0648b71a8d06b5926a3ea8934df46b90ee

# Diff at Tue, 20 Aug 2024 07:33:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@5417c4717b5cefeed17cd8419a7eb2dda22d4206 block: 20532448
- current block number: 20568367

## Description

Added discovery of DA mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532448 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.daMode:
+        1
    }
```

Generated with discovered.json: 0xa58f80eeae7359035a0c626cbe9fb22ebc0858be

# Diff at Thu, 15 Aug 2024 07:10:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9a07aead4b3726cc622f66fe9a15e06e63af7acd block: 20525613
- current block number: 20532448

## Description

The pending owner now became an actual owner. No pending owner currently.

## Watched changes

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      values.owner:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
      values.pendingOwner:
-        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
+        "0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xf60327b26a1b02b58bfd289f249ed0d4831ec61f

# Diff at Wed, 14 Aug 2024 08:16:16 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e32dcc268a9af9f45ad205490c9d650c487e04f1 block: 20512726
- current block number: 20525613

## Description

All roles have been revoked from the EOA and a multisig (2/3) has been granted those roles.
A pending owner is added to TransactionFiltererDenyList, which is just a step in their ownership transfer process, it will become the actual owner once the entire process is completed.

## Watched changes

```diff
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC) {
    +++ description: None
      values.accessControl.ADMIN.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.ADMIN.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.ORACLE.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.ORACLE.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.UPGRADER.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.UPGRADER.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.FEE_ADMIN.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.FEE_ADMIN.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
    }
```

```diff
+   Status: CREATED
    contract AdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DenyListOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/AdminMultisig/GnosisSafe.sol    | 952 +++++++++++++++++++++
 .../.flat/AdminMultisig/GnosisSafeProxy.p.sol      |  34 +
 .../.flat/DenyListOwnerMultisig/GnosisSafe.sol     | 952 +++++++++++++++++++++
 .../DenyListOwnerMultisig/GnosisSafeProxy.p.sol    |  34 +
 4 files changed, 1972 insertions(+)
```

Generated with discovered.json: 0xce3cf2924b53d3ff2bfa12c6d3eacfed4b824720

# Diff at Mon, 12 Aug 2024 13:07:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@bafa261ae877bba9966845f4d250f5cbb9d4f6d2 block: 20482316
- current block number: 20512726

## Description

A second EOA is given multiple roles, now there are two EOAs with those.

## Watched changes

```diff
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC) {
    +++ description: None
      values.accessControl.ADMIN.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.ORACLE.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.UPGRADER.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.FEE_ADMIN.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
    }
```

Generated with discovered.json: 0x5a8ff11be549135c8b8b49f5bff96cb47ab97132

# Diff at Thu, 08 Aug 2024 07:17:33 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@5a17db968badca34a66703637dabf76a313bb43e block: 20469638
- current block number: 20482316

## Description

Updated base token gas multiplier.

## Watched changes

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.baseTokenGasPriceMultiplierNominator:
-        40000
+        25000
    }
```

Generated with discovered.json: 0x682e63ce64e58a5524b7f506518c01daf6f57142

# Diff at Thu, 01 Aug 2024 08:25:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@295430f331b68784c13ccda9222bc78df1e833c5 block: 20425837
- current block number: 20432488

## Description

Cronoszkevm is still on block 1 (verified).
Local Admin role (see ZKsync Era diagrams) is changed from an EOA to a contract `CronosZkEVMAdmin` which allows for splitting of the Admin's permissions via accessControl. Currently all roles are given to the `0x143524d0ac8D7f35a2133b6B0a7567e0E3393137` EOA.

## Watched changes

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.getAdmin:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0x66eF951aEC26987915582340bCAA569E5Be67cDC"
      values.getL2SystemContractsUpgradeBatchNumber:
-        1
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        1
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xd05d194051ec55ccc2207d19499a7959c87327586d85b0914684b0f3319cbeff"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/CronosZkEVMAdmin.sol            | 2352 ++++++++++++++++++++
 1 file changed, 2352 insertions(+)
```

Generated with discovered.json: 0x7e266a80639b119ebd450a36cc47e5254bba527a

# Diff at Wed, 31 Jul 2024 10:08:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20425837

## Description

Initial discovery:
ZK stack chain in ValidiumMode (`getPubdataPricingMode : 1`) sharing the STM, ValidatorTimelock, Verifier and all diamond facet implementations with ZKsync Era.
DiamondProxy not yet verified which is not really a problem for our discovery?. Admin EOA so far (for the non-shared parts). BaseToken is zkCRO.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139)
    +++ description: None
```
