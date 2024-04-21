Generated with discovered.json: 0x7f162218174b3f92e9abc658d954d551e7cb002c

# Diff at Sun, 21 Apr 2024 14:24:12 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@262f9e3e98ac8a85b09235e0b440b48e826f1f9f block: 19531460
- current block number: 19704353

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB) {
    +++ description: None
      upgradeability.type:
-        "immutable"
+        "EIP1967 proxy"
      upgradeability.implementation:
+        "0xfaE274B77BA59f001196689f93E9e73693866f4a"
      upgradeability.admin:
+        "0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc"
      errors:
-        {"batcherHash":"Execution reverted","opStackDA":"Dependency error: Execution reverted","sequencerInbox":"Dependency error: Execution reverted"}
      derivedName:
-        "Proxy"
+        "SystemConfig"
      implementations:
+        ["0xfaE274B77BA59f001196689f93E9e73693866f4a"]
      values:
+        {"BATCH_INBOX_SLOT":"0x71ac12829d66ee73d8d95bff50b3589745ce57edae70a3fb111a2342464dc597","batcherHash":"0xe1B64045351B0B6e9821F19b39f81bc4711D2230","batchInbox":"0xfFF0000000000000000000000000000000000288","gasLimit":30000000,"L1_CROSS_DOMAIN_MESSENGER_SLOT":"0x383f291819e6d54073bc9a648251d97421076bdd101933c0c022219ce9580636","L1_ERC_721_BRIDGE_SLOT":"0x46adcbebc6be8ce551740c29c47c8798210f23f7f4086c41752944352568d5a7","L1_STANDARD_BRIDGE_SLOT":"0x9904ba90dde5696cda05c9e0dab5cbaa0fea005ace4d11218a02ac668dad6376","l1CrossDomainMessenger":"0x6D4528d192dB72E282265D6092F4B872f9Dff69e","l1ERC721Bridge":"0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e","l1StandardBridge":"0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00","L2_OUTPUT_ORACLE_SLOT":"0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815","l2OutputOracle":"0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741","minimumGasLimit":21000000,"opStackDA":{"isSomeTxsLengthEqualToCelestiaDAExample":false,"isSequencerSendingBlobTx":true},"OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT":"0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c","OPTIMISM_PORTAL_SLOT":"0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac","optimismMintableERC20Factory":"0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3","optimismPortal":"0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e","overhead":2100,"owner":"0x56121a8612474C3eB65D69a3b871f284705b9bC4","resourceConfig":[20000000,10,8,1000000000,1000000,"340282366920938463463374607431768211455"],"scalar":1000000,"sequencerInbox":"0xfFF0000000000000000000000000000000000288","START_BLOCK_SLOT":"0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f","startBlock":19670770,"UNSAFE_BLOCK_SIGNER_SLOT":"0x65a7ed542fb37fe237fdfbdd70b31598523fe5b32879e307bae27a0bd9581c08","unsafeBlockSigner":"0x077D266f9A3907837e716894517a12D1FD16Ac0a","version":"1.12.0","VERSION":0}
    }
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x4d898F66327Fa050131A17ed17a39EBeCC81f0c3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BobaMultisig (0x56121a8612474C3eB65D69a3b871f284705b9bC4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x6D4528d192dB72E282265D6092F4B872f9Dff69e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6e598cec2701FfAA3c06175dc3Af0317a749a0Dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x7B02D13904D8e6E0f0Efaf756aB14Cb0FF21eE7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x996ffD627901f10C80A7d4B72A12316D2e77c076)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xA6Ad22bb0E73DEF40a24E510cFbc93807d8bf87e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        | 422 ++++++++++++++++++
 .../implementation/contracts/base/Executor.sol     |  27 ++
 .../contracts/base/FallbackManager.sol             |  53 +++
 .../implementation/contracts/base/GuardManager.sol |  50 +++
 .../contracts/base/ModuleManager.sol               | 133 ++++++
 .../implementation/contracts/base/OwnerManager.sol | 149 +++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 ++
 .../contracts/external/GnosisSafeMath.sol          |  54 +++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../.code/BobaMultisig/implementation/meta.txt     |   2 +
 .../.code/BobaMultisig/proxy/GnosisSafeProxy.sol   | 155 +++++++
 .../ethereum/.code/BobaMultisig/proxy/meta.txt     |   2 +
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/utils/Address.sol                    |   0
 .../contracts/utils/math/Math.sol                  |   0
 .../contracts/utils/math/SignedMath.sol            |   0
 .../contracts/access/OwnableUpgradeable.sol        |  95 ++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++
 .../contracts/utils/ContextUpgradeable.sol         |  37 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |   0
 .../L1CrossDomainMessenger/implementation/meta.txt |   2 +
 .../src/L1/L1CrossDomainMessenger.sol              |  80 ++++
 .../implementation/src/L1/L2OutputOracle.sol       | 316 +++++++++++++
 .../implementation/src/L1/OptimismPortal.sol       | 432 ++++++++++++++++++
 .../implementation/src/L1/ResourceMetering.sol     | 161 +++++++
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/L1/SystemConfig.sol         | 366 +++++++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation}/src/libraries/Burn.sol         |   0
 .../implementation/src/libraries/Bytes.sol         | 144 ++++++
 .../implementation/src/libraries/Constants.sol     |  50 +++
 .../implementation/src/libraries/Encoding.sol      | 176 ++++++++
 .../implementation/src/libraries/Hashing.sol       | 124 ++++++
 .../implementation/src/libraries/Predeploys.sol    | 113 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/libraries/rlp/RLPReader.sol | 261 +++++++++++
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 +++++++
 .../src/libraries/trie/MerkleTrie.sol              | 220 +++++++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |  49 +++
 .../src/universal/CrossDomainMessenger.sol         | 405 +++++++++++++++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/vendor/AddressAliasHelper.sol              |  43 ++
 .../@openzeppelin/contracts/access/Ownable.sol     |  68 +++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../libraries/resolver/Lib_AddressManager.sol      |  95 ++++
 .../resolver/Lib_ResolvedDelegateProxy.sol         |  74 ++++
 .../.code/L1CrossDomainMessenger/proxy/meta.txt    |   2 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/token/ERC20/ERC20.sol                | 383 ++++++++++++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++
 .../token/ERC20/extensions/IERC20Metadata.sol      |  28 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 +++++
 .../contracts/token/ERC721/IERC721.sol             | 143 ++++++
 .../token/ERC721/extensions/IERC721Enumerable.sol  |  29 ++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/Context.sol                    |  24 +
 .../utils/introspection/ERC165Checker.sol          | 123 ++++++
 .../contracts/utils/introspection/IERC165.sol      |  25 ++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../.code/L1ERC721Bridge/implementation/meta.txt   |   2 +
 .../implementation/src/L1/L1ERC721Bridge.sol       | 121 +++++
 .../implementation/src/L1/ResourceMetering.sol     | 162 +++++++
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/L2/L2ERC721Bridge.sol       | 126 ++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Encoding.sol      | 176 ++++++++
 .../implementation/src/libraries/Hashing.sol       | 124 ++++++
 .../implementation/src/libraries/Predeploys.sol    | 113 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 +++++++
 .../src/universal/CrossDomainMessenger.sol         | 406 +++++++++++++++++
 .../implementation/src/universal/ERC721Bridge.sol  | 195 ++++++++
 .../src/universal/IOptimismMintableERC20.sol       |  31 ++
 .../src/universal/IOptimismMintableERC721.sol      |  48 ++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/universal/OptimismMintableERC20.sol        | 140 ++++++
 .../src/universal/StandardBridge.sol               | 489 +++++++++++++++++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../ethereum/.code/L1ERC721Bridge/proxy/meta.txt   |   2 +
 .../proxy}/src/L1/ResourceMetering.sol             |   0
 .../proxy}/src/libraries/Arithmetic.sol            |   0
 .../L1ERC721Bridge/proxy/src/libraries/Burn.sol    |  32 ++
 .../proxy}/src/libraries/Constants.sol             |   0
 .../L1ERC721Bridge/proxy}/src/universal/Proxy.sol  |   0
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/token/ERC20/ERC20.sol                | 383 ++++++++++++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++
 .../token/ERC20/extensions/IERC20Metadata.sol      |  28 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 +++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/Context.sol                    |  24 +
 .../utils/introspection/ERC165Checker.sol          | 123 ++++++
 .../contracts/utils/introspection/IERC165.sol      |  25 ++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../.code/L1StandardBridge/implementation/meta.txt |   2 +
 .../implementation/src/L1/L1StandardBridge.sol     | 328 ++++++++++++++
 .../implementation/src/L1/ResourceMetering.sol     | 161 +++++++
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  50 +++
 .../implementation/src/libraries/Encoding.sol      | 176 ++++++++
 .../implementation/src/libraries/Hashing.sol       | 124 ++++++
 .../implementation/src/libraries/Predeploys.sol    | 113 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 +++++++
 .../src/universal/CrossDomainMessenger.sol         | 405 +++++++++++++++++
 .../src/universal/IOptimismMintableERC20.sol       |  31 ++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/universal/OptimismMintableERC20.sol        | 140 ++++++
 .../src/universal/StandardBridge.sol               | 488 ++++++++++++++++++++
 .../contracts/chugsplash/L1ChugSplashProxy.sol     | 357 +++++++++++++++
 .../interfaces/iL1ChugSplashDeployer.sol           |  14 +
 .../ethereum/.code/L1StandardBridge/proxy/meta.txt |   2 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../.code/L2OutputOracle/implementation/meta.txt   |   2 +
 .../implementation/src/L1/L2OutputOracle.sol       | 317 +++++++++++++
 .../implementation/src/L1/ResourceMetering.sol     | 162 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../ethereum/.code/L2OutputOracle/proxy/meta.txt   |   2 +
 .../proxy/src/L1/ResourceMetering.sol              | 160 +++++++
 .../proxy/src/libraries/Arithmetic.sol             |  28 ++
 .../L2OutputOracle/proxy/src/libraries/Burn.sol    |  32 ++
 .../proxy/src/libraries/Constants.sol              |  46 ++
 .../L2OutputOracle/proxy/src/universal/Proxy.sol   | 168 +++++++
 .../@openzeppelin/contracts/access/Ownable.sol     |  68 +++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../libraries/resolver/Lib_AddressManager.sol      |  95 ++++
 .../ethereum/.code/Lib_AddressManager/meta.txt     |   2 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/token/ERC20/ERC20.sol                | 383 ++++++++++++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++
 .../token/ERC20/extensions/IERC20Metadata.sol      |  28 ++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/Context.sol                    |  24 +
 .../contracts/utils/introspection/IERC165.sol      |  25 ++
 .../implementation/meta.txt                        |   2 +
 .../src/universal/IOptimismMintableERC20.sol       |  31 ++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/universal/OptimismMintableERC20.sol        | 140 ++++++
 .../src/universal/OptimismMintableERC20Factory.sol | 132 ++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../OptimismMintableERC20Factory/proxy/meta.txt    |   2 +
 .../proxy/src/L1/ResourceMetering.sol              | 160 +++++++
 .../proxy/src/libraries/Arithmetic.sol             |  28 ++
 .../proxy/src/libraries/Burn.sol                   |  32 ++
 .../proxy/src/libraries/Constants.sol              |  46 ++
 .../proxy/src/universal/Proxy.sol                  | 168 +++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/access/OwnableUpgradeable.sol        |  95 ++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++
 .../contracts/utils/ContextUpgradeable.sol         |  37 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../.code/OptimismPortal/implementation/meta.txt   |   2 +
 .../implementation/src/L1/L2OutputOracle.sol       | 317 +++++++++++++
 .../implementation/src/L1/OptimismPortal.sol       | 433 ++++++++++++++++++
 .../implementation/src/L1/ResourceMetering.sol     | 162 +++++++
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/L1/SystemConfig.sol         | 367 ++++++++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Bytes.sol         | 144 ++++++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Encoding.sol      | 176 ++++++++
 .../implementation/src/libraries/Hashing.sol       | 124 ++++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/libraries/rlp/RLPReader.sol | 262 +++++++++++
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 +++++++
 .../src/libraries/trie/MerkleTrie.sol              | 220 +++++++++
 .../src/libraries/trie/SecureMerkleTrie.sol        |  49 +++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/vendor/AddressAliasHelper.sol              |  43 ++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../ethereum/.code/OptimismPortal/proxy/meta.txt   |   2 +
 .../proxy/src/L1/ResourceMetering.sol              | 160 +++++++
 .../proxy/src/libraries/Arithmetic.sol             |  28 ++
 .../OptimismPortal/proxy/src/libraries/Burn.sol    |  32 ++
 .../proxy/src/libraries/Constants.sol              |  46 ++
 .../OptimismPortal/proxy/src/universal/Proxy.sol   | 168 +++++++
 .../ProxyAdmin/contracts/legacy/AddressManager.sol |  64 +++
 .../contracts/legacy/L1ChugSplashProxy.sol         | 289 ++++++++++++
 .../.code/ProxyAdmin/contracts/universal/Proxy.sol | 217 +++++++++
 .../ProxyAdmin/contracts/universal/ProxyAdmin.sol  | 254 +++++++++++
 .../bobanetwork/ethereum/.code/ProxyAdmin/meta.txt |   2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 ++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../.code/SuperchainConfig/implementation/meta.txt |   2 +
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../ethereum/.code/SuperchainConfig/proxy/meta.txt |   2 +
 .../proxy/src/L1/ResourceMetering.sol              | 160 +++++++
 .../proxy/src/libraries/Arithmetic.sol             |  28 ++
 .../SuperchainConfig/proxy/src/libraries/Burn.sol  |  32 ++
 .../proxy/src/libraries/Constants.sol              |  46 ++
 .../SuperchainConfig/proxy/src/universal/Proxy.sol | 168 +++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/access/OwnableUpgradeable.sol        |  95 ++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++
 .../contracts/utils/ContextUpgradeable.sol         |  37 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../.code/SystemConfig/implementation/meta.txt     |   2 +
 .../implementation/src/L1/ResourceMetering.sol     | 162 +++++++
 .../implementation/src/L1/SystemConfig.sol         | 367 ++++++++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 ++
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++
 .../contracts/utils/math/Math.sol                  | 226 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 +++++++++++++++
 .../SystemConfig/proxy}/meta.txt                   |   0
 .../SystemConfig/proxy/src/L1/ResourceMetering.sol | 160 +++++++
 .../proxy/src/libraries/Arithmetic.sol             |  28 ++
 .../SystemConfig/proxy/src/libraries/Burn.sol      |  32 ++
 .../SystemConfig/proxy/src/libraries/Constants.sol |  46 ++
 .../SystemConfig/proxy/src/universal/Proxy.sol     | 168 +++++++
 287 files changed, 35220 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531460 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger_2 (0x12Acf6E3ca96A60fBa0BBFd14D2Fe0EB6ae47820)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SCCStorageContainerBatches (0x13992B9f327faCA11568BE18a8ad3E9747e87d93)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CTCStorageContainerBatches (0x17148284d2da2f38c96346f1776C1BF7D7691231)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Proxy__L1LiquidityPoolArguments (0x1A26ef6575B7BBB864d984D9255C069F6c361a14)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1MultiMessageRelayerFast (0x2d6134Ac3e480fBDD263B7163d333dCA285f9622)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CTCQueue (0x5f003030884B3a105809a0Eb0C0C28Ac40ECCD8d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1MultiMessageRelayer (0x5fD2CF99586B9D92f56CbaD0A3Ea4DF256A0070B)
    +++ description: None
```

```diff
-   Status: DELETED
    contract BondManager (0x60660e6CDEb423cf847dD11De4C473130D65b627)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger_1 (0x6D4528d192dB72E282265D6092F4B872f9Dff69e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AddressManager (0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1NFTBridge (0xbF313aD6e476FF4ab6c01B76DfC74A47f2c9a582)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Lib_ResolvedDelegateProxy (0xC891F466e53f40603250837282eAE4e22aD5b088)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1LiquidityPool (0xd24484926f1d130778B9ebd7ec594548b2D53CB1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1StandardBridge (0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StateCommitmentChain (0xdE7355C971A5B733fe2133753Abd7e5441d441Ec)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CanonicalTransactionChain (0xfBd2541e316948B259264c02f370eD088E04c3Db)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x158Fd5715F16Ac1F2Dc959A299B383aAaf9B59EB)
    +++ description: None
```

Generated with discovered.json: 0x4115d59c156d818c65d985580ac465151edf6d9d

# Diff at Tue, 26 Sep 2023 13:56:38 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract StateCommitmentChain (0xdE7355C971A5B733fe2133753Abd7e5441d441Ec) {
      values.deletedStateBatches:
+        []
    }
```
