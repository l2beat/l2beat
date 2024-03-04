Generated with discovered.json: 0x1e9f26865d3ec0429a0cda6113646e364c3281df

# Diff at Mon, 04 Mar 2024 10:56:28 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@46496e7b791dcbec71231179f69ae70b677b485e block: 19340848
- current block number: 19361335

## Description

Blast is using different Yield Providers and generally invests token deposits
to a bridge on L1. We should in the future discover different yield providers
but this will require discovery improvements. Right now the decision is made
to treat minted tokens on BLAST as externally bridged given fundamentally different
risk profile of these tokens.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19340848 (main branch discovery), not current.

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      name:
-        "Bridge"
+        "LaunchBridge"
      values.getMainnetBridge:
+        "0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115"
    }
```

```diff
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE) {
    +++ description: None
      values.availableBalance:
-        "5089206326412676222939"
      values.getLastCheckpointId:
-        5
      values.getLastFinalizedRequestId:
-        42
      values.getLastRequestId:
-        314
      values.getLockedBalance:
-        "7273904440000000000000"
      values.getProviderInfoAt:
-        [["0xa9a273106b6a6346a0d4fadf546958a10e831e1594b2598065098554b0f8b5d6","0x4316A00D31da1313617DbB04fD92F9fF8D1aF7Db","494025835709703704601078",0,"493983307705724120970957","494025835709703704601078","42528003979583630121"]]
      values.tokenBalance:
-        "12363110766412676222939"
      values.totalProviderValue:
-        "494025835709703704601078"
      values.totalValue:
-        "499115042036116380824017"
      values.unfinalizedRequestNumber:
-        272
    }
```

```diff
+   Status: CREATED
    contract USDYieldManager (0xa230285d5683C74935aD14c446e137c8c8828438)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Insurance (0xBbE2cd60BD30Ef2aaceFD74C3199282ee35fBBa6)
    +++ description: None
```

Generated with discovered.json: 0xd7b5a29c6417765e76a8c2a625f2d82edd1e9d72

# Diff at Fri, 01 Mar 2024 14:14:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b9ede39955273871351ca0f0c491301537f7a861 block: 19260868
- current block number: 19340848

## Description

Mainnet launch, the config is not yet complete. Assume that the project after
this commit is in under-review state.

## Watched changes

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      values.isTransitionEnabled:
-        false
+        true
      values.paused:
-        false
+        true
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x0Ec68c5B10F21EFFb74f2A5C61DFe6b08C0Db6Cb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x364289230b8cc7d9120eF962AF37ebCFe23cE883)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1BlastBridge (0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlastMultisig (0x4f72ee94B8ba3Be7F886565d3583A7F636c58B05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5531DcfF39EC1ec727C4c5D2fc49835368F805a9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x697402166Fbf2F22E970df8a6486Ef171dbfc524)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x6B916DcCa661d23794e78509723A6f4348564847)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x826D1B0D4111Ad9146Eb8941D7Ca2B6a44215c76)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ETHYieldManager (0x98078db053902644191f93988341E31289E1C8FE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xa45A0c7C47DB8C6e99b2d7C4939F7f7Cf69C8975)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Insurance (0xcFF70D7F37b1EBeE89c08E485f08ACAB5f6ff873)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xE064B565Cf2A312a3e66Fe4118890583727380C0)
    +++ description: None
```

## Source code changes

```diff
.../contracts/access/Ownable.sol                   |   83 ++
 .../contracts/utils/Context.sol                    |   24 +
 .../blast/ethereum/.code/AddressManager/meta.txt   |    2 +
 .../AddressManager/src/legacy/AddressManager.sol   |   46 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../.code/BlastMultisig/implementation/meta.txt    |    2 +
 .../.code/BlastMultisig/proxy/GnosisSafeProxy.sol  |  155 +++
 .../ethereum/.code/BlastMultisig/proxy/meta.txt    |    2 +
 .../contracts/interfaces/IERC20.sol                |    6 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Strings.sol                    |   75 ++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SafeCast.sol              | 1135 ++++++++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  367 +++++++
 .../contracts/access/Ownable2StepUpgradeable.sol   |   71 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../lib/solmate/src/tokens/ERC20.sol               |  206 ++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  129 +++
 .../.code/ETHYieldManager/implementation/meta.txt  |    2 +
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  490 +++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../implementation/src/L2/Blast.sol                |  336 ++++++
 .../ETHYieldManager/implementation/src/L2/Gas.sol  |  329 ++++++
 .../implementation/src/L2/Shares.sol               |  129 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPReader.sol |  262 +++++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/libraries/trie/MerkleTrie.sol              |  220 ++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/mainnet-bridge/DelegateCalls.sol           |   48 +
 .../src/mainnet-bridge/ETHYieldManager.sol         |   50 +
 .../src/mainnet-bridge/USDConversions.sol          |  218 ++++
 .../src/mainnet-bridge/YieldManager.sol            |  421 ++++++++
 .../withdrawal-queue/WithdrawalQueue.sol           |  442 ++++++++
 .../yield-providers/YieldProvider.sol              |  183 ++++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/vendor/AddressAliasHelper.sol              |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/ETHYieldManager/proxy/meta.txt  |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/legacy/L1ChugSplashProxy.sol         |  232 ++++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../ETHYieldManager/proxy/src/libraries/Burn.sol   |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../contracts/interfaces/IERC20.sol                |    6 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Strings.sol                    |   75 ++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SafeCast.sol              | 1135 ++++++++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  367 +++++++
 .../contracts/access/Ownable2StepUpgradeable.sol   |   71 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../lib/solmate/src/tokens/ERC20.sol               |  206 ++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  129 +++
 .../.code/Insurance/implementation/meta.txt        |    2 +
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  490 +++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../Insurance/implementation/src/L2/Blast.sol      |  336 ++++++
 .../.code/Insurance/implementation/src/L2/Gas.sol  |  329 ++++++
 .../Insurance/implementation/src/L2/Shares.sol     |  129 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   52 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPReader.sol |  262 +++++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/libraries/trie/MerkleTrie.sol              |  220 ++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/mainnet-bridge/DelegateCalls.sol           |   48 +
 .../src/mainnet-bridge/ETHYieldManager.sol         |   50 +
 .../src/mainnet-bridge/Insurance.sol               |   63 ++
 .../src/mainnet-bridge/USDConversions.sol          |  218 ++++
 .../src/mainnet-bridge/YieldManager.sol            |  421 ++++++++
 .../withdrawal-queue/WithdrawalQueue.sol           |  442 ++++++++
 .../yield-providers/YieldProvider.sol              |  183 ++++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/vendor/AddressAliasHelper.sol              |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../blast/ethereum/.code/Insurance/proxy/meta.txt  |    2 +
 .../Insurance/proxy/src/L1/ResourceMetering.sol    |  162 +++
 .../proxy/src/legacy/L1ChugSplashProxy.sol         |  232 ++++
 .../Insurance/proxy/src/libraries/Arithmetic.sol   |   28 +
 .../.code/Insurance/proxy/src/libraries/Burn.sol   |   32 +
 .../Insurance/proxy/src/libraries/Constants.sol    |   50 +
 .../contracts/interfaces/IERC20.sol                |    6 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/ERC20.sol                |  383 +++++++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/Strings.sol                    |   75 ++
 .../utils/introspection/ERC165Checker.sol          |  123 +++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SafeCast.sol              | 1135 ++++++++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  367 +++++++
 .../contracts/access/Ownable2StepUpgradeable.sol   |   71 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/interfaces/IERC5267Upgradeable.sol   |   28 +
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/token/ERC20/ERC20Upgradeable.sol     |  377 +++++++
 .../contracts/token/ERC20/IERC20Upgradeable.sol    |   78 ++
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../ERC20/extensions/IERC20PermitUpgradeable.sol   |   60 ++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../contracts/utils/CountersUpgradeable.sol        |   43 +
 .../contracts/utils/StringsUpgradeable.sol         |   85 ++
 .../utils/cryptography/ECDSAUpgradeable.sol        |  217 ++++
 .../utils/cryptography/EIP712Upgradeable.sol       |  205 ++++
 .../contracts/utils/math/MathUpgradeable.sol       |  339 ++++++
 .../contracts/utils/math/SignedMathUpgradeable.sol |   43 +
 .../lib/solmate/src/tokens/ERC20.sol               |  206 ++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  129 +++
 .../.code/L1BlastBridge/implementation/meta.txt    |    2 +
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  490 +++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../L1BlastBridge/implementation/src/L2/Blast.sol  |  336 ++++++
 .../src/L2/ERC20PermitUpgradeable.sol              |  118 ++
 .../implementation/src/L2/ERC20Rebasing.sol        |  415 +++++++
 .../L1BlastBridge/implementation/src/L2/Gas.sol    |  329 ++++++
 .../L1BlastBridge/implementation/src/L2/Shares.sol |  129 +++
 .../L1BlastBridge/implementation/src/L2/USDB.sol   |  116 ++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPReader.sol |  262 +++++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/libraries/trie/MerkleTrie.sol              |  220 ++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/mainnet-bridge/DelegateCalls.sol           |   48 +
 .../src/mainnet-bridge/ETHYieldManager.sol         |   50 +
 .../src/mainnet-bridge/L1BlastBridge.sol           |  319 ++++++
 .../src/mainnet-bridge/L2BlastBridge.sol           |   87 ++
 .../src/mainnet-bridge/USDConversions.sol          |  218 ++++
 .../src/mainnet-bridge/USDYieldManager.sol         |   66 ++
 .../src/mainnet-bridge/YieldManager.sol            |  421 ++++++++
 .../withdrawal-queue/WithdrawalQueue.sol           |  442 ++++++++
 .../yield-providers/YieldProvider.sol              |  183 ++++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../src/universal/IOptimismMintableERC20.sol       |   31 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  138 +++
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/universal/StandardBridge.sol               |  482 +++++++++
 .../src/vendor/AddressAliasHelper.sol              |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/L1BlastBridge/proxy/meta.txt    |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/legacy/L1ChugSplashProxy.sol         |  232 ++++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../L1BlastBridge/proxy/src/libraries/Burn.sol     |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../contracts/interfaces/IERC20.sol                |    6 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Strings.sol                    |   75 ++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SafeCast.sol              | 1135 ++++++++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  367 +++++++
 .../contracts/access/Ownable2StepUpgradeable.sol   |   71 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../lib/solmate/src/tokens/ERC20.sol               |  206 ++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  129 +++
 .../L1CrossDomainMessenger/implementation/meta.txt |    2 +
 .../src/L1/L1CrossDomainMessenger.sol              |  186 ++++
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  490 +++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../implementation/src/L2/Blast.sol                |  336 ++++++
 .../implementation/src/L2/Gas.sol                  |  329 ++++++
 .../implementation/src/L2/Shares.sol               |  129 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   52 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPReader.sol |  262 +++++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/libraries/trie/MerkleTrie.sol              |  220 ++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/mainnet-bridge/DelegateCalls.sol           |   48 +
 .../src/mainnet-bridge/ETHYieldManager.sol         |   50 +
 .../src/mainnet-bridge/USDConversions.sol          |  218 ++++
 .../src/mainnet-bridge/YieldManager.sol            |  421 ++++++++
 .../withdrawal-queue/WithdrawalQueue.sol           |  442 ++++++++
 .../yield-providers/YieldProvider.sol              |  183 ++++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/vendor/AddressAliasHelper.sol              |   43 +
 .../contracts/access/Ownable.sol                   |   83 ++
 .../contracts/utils/Context.sol                    |   24 +
 .../.code/L1CrossDomainMessenger/proxy/meta.txt    |    2 +
 .../proxy/src/legacy/AddressManager.sol            |   46 +
 .../proxy/src/legacy/ResolvedDelegateProxy.sol     |   52 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC721/IERC721.sol             |  143 +++
 .../token/ERC721/extensions/IERC721Enumerable.sol  |   29 +
 .../contracts/utils/Address.sol                    |  222 ++++
 .../utils/introspection/ERC165Checker.sol          |  123 +++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../.code/L1ERC721Bridge/implementation/meta.txt   |    2 +
 .../implementation/src/L1/L1ERC721Bridge.sol       |  105 ++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L2/L2ERC721Bridge.sol       |  122 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../implementation/src/universal/ERC721Bridge.sol  |  174 +++
 .../src/universal/IOptimismMintableERC721.sol      |   48 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/L1ERC721Bridge/proxy/meta.txt   |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../L1ERC721Bridge/proxy/src/libraries/Burn.sol    |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../L1ERC721Bridge/proxy/src/universal/Proxy.sol   |  168 +++
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/ERC20.sol                |  383 +++++++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/Strings.sol                    |   75 ++
 .../utils/introspection/ERC165Checker.sol          |  123 +++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../.code/L1StandardBridge/implementation/meta.txt |    2 +
 .../implementation/src/L1/L1StandardBridge.sol     |  338 ++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../src/universal/IOptimismMintableERC20.sol       |   31 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  138 +++
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/universal/StandardBridge.sol               |  482 +++++++++
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/L1StandardBridge/proxy/meta.txt |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/legacy/L1ChugSplashProxy.sol         |  232 ++++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../L1StandardBridge/proxy/src/libraries/Burn.sol  |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../.code/L2OutputOracle/implementation/meta.txt   |    2 +
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/L2OutputOracle/proxy/meta.txt   |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../L2OutputOracle/proxy/src/libraries/Burn.sol    |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../L2OutputOracle/proxy/src/universal/Proxy.sol   |  168 +++
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/ERC20.sol                |  383 +++++++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/Strings.sol                    |   75 ++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../implementation/meta.txt                        |    2 +
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../src/universal/IOptimismMintableERC20.sol       |   31 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  138 +++
 .../src/universal/OptimismMintableERC20Factory.sol |  122 +++
 .../implementation/src/universal/Semver.sol        |   40 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../OptimismMintableERC20Factory/proxy/meta.txt    |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../proxy/src/libraries/Burn.sol                   |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../proxy/src/universal/Proxy.sol                  |  168 +++
 .../contracts/interfaces/IERC20.sol                |    6 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Strings.sol                    |   75 ++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SafeCast.sol              | 1135 ++++++++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  367 +++++++
 .../contracts/access/Ownable2StepUpgradeable.sol   |   71 ++
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../lib/solmate/src/tokens/ERC20.sol               |  206 ++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  129 +++
 .../.code/OptimismPortal/implementation/meta.txt   |    2 +
 .../implementation/src/L1/L2OutputOracle.sol       |  304 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  490 +++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../OptimismPortal/implementation/src/L2/Blast.sol |  336 ++++++
 .../OptimismPortal/implementation/src/L2/Gas.sol   |  329 ++++++
 .../implementation/src/L2/Shares.sol               |  129 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Encoding.sol      |  136 +++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |   95 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPReader.sol |  262 +++++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/libraries/trie/MerkleTrie.sol              |  220 ++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/mainnet-bridge/DelegateCalls.sol           |   48 +
 .../src/mainnet-bridge/ETHYieldManager.sol         |   50 +
 .../src/mainnet-bridge/USDConversions.sol          |  218 ++++
 .../src/mainnet-bridge/YieldManager.sol            |  421 ++++++++
 .../withdrawal-queue/WithdrawalQueue.sol           |  442 ++++++++
 .../yield-providers/YieldProvider.sol              |  183 ++++
 .../src/universal/CrossDomainMessenger.sol         |  389 +++++++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../implementation/src/universal/Semver.sol        |   40 +
 .../src/vendor/AddressAliasHelper.sol              |   43 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/OptimismPortal/proxy/meta.txt   |    2 +
 .../proxy/src/L1/ResourceMetering.sol              |  162 +++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../OptimismPortal/proxy/src/libraries/Burn.sol    |   32 +
 .../proxy/src/libraries/Constants.sol              |   50 +
 .../OptimismPortal/proxy/src/universal/Proxy.sol   |  168 +++
 .../contracts/access/Ownable.sol                   |   83 ++
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../blast/ethereum/.code/ProxyAdmin/meta.txt       |    2 +
 .../.code/ProxyAdmin/src/L1/ResourceMetering.sol   |  162 +++
 .../.code/ProxyAdmin/src/legacy/AddressManager.sol |   46 +
 .../ProxyAdmin/src/legacy/L1ChugSplashProxy.sol    |  232 ++++
 .../.code/ProxyAdmin/src/libraries/Arithmetic.sol  |   28 +
 .../.code/ProxyAdmin/src/libraries/Burn.sol        |   32 +
 .../.code/ProxyAdmin/src/libraries/Constants.sol   |   50 +
 .../.code/ProxyAdmin/src/universal/Proxy.sol       |  168 +++
 .../.code/ProxyAdmin/src/universal/ProxyAdmin.sol  |  203 ++++
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/access/OwnableUpgradeable.sol        |   95 ++
 .../contracts/proxy/utils/Initializable.sol        |  166 +++
 .../contracts/utils/AddressUpgradeable.sol         |  244 +++++
 .../contracts/utils/ContextUpgradeable.sol         |   37 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../.code/SystemConfig/implementation/meta.txt     |    2 +
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  371 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   50 +
 .../implementation/src/libraries/Storage.sol       |   69 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/SystemConfig/proxy/meta.txt     |    2 +
 .../SystemConfig/proxy/src/L1/ResourceMetering.sol |  162 +++
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../SystemConfig/proxy/src/libraries/Burn.sol      |   32 +
 .../SystemConfig/proxy/src/libraries/Constants.sol |   50 +
 .../SystemConfig/proxy/src/universal/Proxy.sol     |  168 +++
 537 files changed, 82096 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19260868 (main branch discovery), not current.

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    +++ description: None
      values.getMainnetBridge:
-        "EXPECT_REVERT"
    }
```

Generated with discovered.json: 0x73efb82f36e49271fe84dbc69b985b3c4af9f14f

# Diff at Mon, 19 Feb 2024 09:23:53 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@0a522442e2dd6f9a3312ee296e595da0691fa23a block: 18771421
- current block number: 19260868

## Description

The implementation is upgraded. See Diff below for the changes.

## Watched changes

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
      upgradeability.implementation:
-        "0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"
+        "0x0bD88b59D580549285f0A207Db5F06bf24a8e561"
      implementations.0:
-        "0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"
+        "0x0bD88b59D580549285f0A207Db5F06bf24a8e561"
      values.proposedBridgeReadyAt:
-        0
      values.proposedMainnetBridge:
-        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
      values.proposedUpgrade:
-        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
      values.proposedUpgradeReadyAt:
-        0
    }
```

## Source code changes

```diff
.../contracts/token/ERC20/IERC20.sol               |   8 +-
 .../ERC20/extensions/IERC20Permit.sol => /dev/null |  60 -------
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  58 ++++++-
 .../Bridge/implementation/meta.txt                 |   2 +-
 .../Bridge/implementation/src/LaunchBridge_v3.sol} | 179 +++++++--------------
 .../implementation/src/libraries/Predeploys.sol    |  95 +++++++++++
 6 files changed, 215 insertions(+), 187 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18771421 (main branch discovery), not current.

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
      values.getMainnetBridge:
+        "EXPECT_REVERT"
    }
```

Generated with discovered.json: 0xe9cebe22717eca176ca67be9ef1b813fd5ffaa20

# Diff at Tue, 12 Dec 2023 16:53:48 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@695bd005662e55af5dd20ff984779cea92a8a968

## Description

Change in the Bridge implementation. A 24h timelock is introduced on Admin Proxy updates and Bridge Transition updates. The update proposals can be created by the owner and canceled by the owner if not executed yet. Updates that do not go through the timelock will now revert.

Users can now withdraw in two cases:

- While there is an active proposal for upgrade/transition. In that case users will lose their points.
- After the contract has expired (currently set to 1 June 2024)

Other changes: The \_moveETH and \_moveUSD functions are refactored to return the assets value (previously executing the transfer), the actual transfer to the new bridge is now done within the transition function.

## Watched changes

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
      upgradeability.implementation:
-        "0xa01Def05A37850b2e13C8c839AA268845Df14276"
+        "0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"
      implementations.0:
-        "0xa01Def05A37850b2e13C8c839AA268845Df14276"
+        "0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"
      values.proposedBridgeReadyAt:
+        0
      values.proposedMainnetBridge:
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
      values.proposedUpgrade:
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
      values.proposedUpgradeReadyAt:
+        0
    }
```

## Source code changes

```diff
.../Bridge/implementation/meta.txt                 |   2 +-
 .../src/launch-bridge}/LaunchBridge.sol            | 178 ++++++++++++++++++---
 2 files changed, 161 insertions(+), 19 deletions(-)
```

# Diff at Mon, 04 Dec 2023 15:05:33 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@982648829699454aa19300c012f060616045a3f0

## Description

Change in BridgeOwner (multisig) owners.

## Watched changes

```diff
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
      values.getOwners.0:
-        "0x59cDa1e234505D460c972e58452c0A6d8e14a5Ce"
+        "0x49d495DE356259458120bfd7bCB463CFb6D6c6BA"
    }
```

# Diff at Tue, 21 Nov 2023 08:08:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
+   Status: CREATED
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    }
```

```diff
+   Status: CREATED
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
    }
```
