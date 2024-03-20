Generated with discovered.json: 0xc9d1fbc1a9147a6b42e379d18dc691e2e6e62438

# Diff at Wed, 20 Mar 2024 16:17:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@88f881ab370a6b85fd531f2bc620891afd1f41bb block: 19469245
- current block number: 19477042

## Description

Removed from discovery not utilized old contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19469245 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract TssGroupManager (0x399ca67660B79F7aA8A7Efd5BEF9836A4c19CACF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TssStakingSlashing (0x78CF48880E9e1b3ab209779c0D8A76f611e53e81)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TssDelegationSlasher (0x910265C29c099eAc87EF6d374b6f3bE45B516EB7)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TssDelegationManager (0xA90FCe37D274e673f3850b835F18790542b1755d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TssDelegation (0xd4B5E3D46D202C3523C3Ad89dfe74eC272BFC96A)
    +++ description: None
```

Generated with discovered.json: 0x69e2aa7bef3e340dd92701d3a1b540b16e9354b4

# Diff at Tue, 19 Mar 2024 14:00:41 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ed3dd09f83459eadf3704e0797de8bbf1ae98817 block: 18469566
- current block number: 19469245

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
-   Status: DELETED
    contract BondManager (0x31aBe1c466C2A8b95fd84258dD1471472979B650)
    +++ description: None
```

```diff
-   Status: DELETED
    contract VerifierEntry (0x3F77D44E1789D47e076a4d5f2779a1fCAb821C2a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x47336ae44F573a7C3C41a9ae04A9D48E5dFD8f8E)
    +++ description: None
```

```diff
    contract L1CrossDomainMessenger (0x676A795fe6E43C17c668de16730c3F690FEB7120) {
    +++ description: None
      upgradeability.implementation:
-        "0x4692363048d0F32a2dE7816860D48fff0c61B24B"
+        "0xb8DE82551fA4BA3bE4B3d9097763EDBeED541308"
      implementations.0:
-        "0x4692363048d0F32a2dE7816860D48fff0c61B24B"
+        "0xb8DE82551fA4BA3bE4B3d9097763EDBeED541308"
      values.getPauseOwner:
-        "0x2F44BD2a54aC3fB20cd7783cF94334069641daC9"
      values.libAddressManager:
-        "0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42"
      values.owner:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      values.paused:
-        false
      values.HASH_MESSAGE_BASE_GAS:
+        800
      values.HASH_MESSAGE_GAS_PER_BYTE:
+        2
      values.L1_MNT_ADDRESS:
+        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
      values.MESSAGE_VERSION:
+        1
      values.MIN_GAS_CALLDATA_OVERHEAD:
+        16
      values.MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR:
+        63
      values.MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR:
+        64
      values.OTHER_MESSENGER:
+        "0x4200000000000000000000000000000000000007"
      values.PORTAL:
+        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
      values.RELAY_CALL_OVERHEAD:
+        40000
      values.RELAY_CONSTANT_OVERHEAD:
+        200000
      values.RELAY_GAS_CHECK_BUFFER:
+        55000
      values.RELAY_RESERVED_GAS:
+        90000
      values.version:
+        "1.5.0"
    }
```

```diff
    contract AddressManager (0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42) {
    +++ description: None
      values.BondManager:
-        "0x31aBe1c466C2A8b95fd84258dD1471472979B650"
+        "0x0000000000000000000000000000000000000000"
      values.FraudVerifier:
-        "0x2F44BD2a54aC3fB20cd7783cF94334069641daC9"
+        "0x0000000000000000000000000000000000000000"
      values.L1CrossDomainMessenger:
-        "0x4692363048d0F32a2dE7816860D48fff0c61B24B"
+        "0xb8DE82551fA4BA3bE4B3d9097763EDBeED541308"
      values.owner:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0xca35F8338054739D138884685e08b39EE2217794"
      values.proposer:
-        "0xD1328C9167e0693B689b5aa5a024379d4e437858"
+        "0x0000000000000000000000000000000000000000"
      values.sequencer:
-        "0x2F6AFE2E3feA041b892a6e240Fd1A0E5b51e8376"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x84A628347537d4900a0b720Ee294445F90c3887a)
    +++ description: None
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: None
      upgradeability.implementation:
-        "0x6B6e0dC564d4603452E40752ecDAa0e9630B38A2"
+        "0xb4133552BA49dFb60DA6eb5cA0102d0f94ce071f"
      upgradeability.admin:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0xca35F8338054739D138884685e08b39EE2217794"
      implementations.0:
-        "0x6B6e0dC564d4603452E40752ecDAa0e9630B38A2"
+        "0xb4133552BA49dFb60DA6eb5cA0102d0f94ce071f"
      values.l1MantleAddress:
-        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
      values.L1_MNT_ADDRESS:
+        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
      values.MESSENGER:
+        "0x676A795fe6E43C17c668de16730c3F690FEB7120"
      values.OTHER_BRIDGE:
+        "0x4200000000000000000000000000000000000010"
      values.version:
+        "1.1.0"
    }
```

```diff
-   Status: DELETED
    contract AssertionMap (0xa0d79E982bfD3C2ccD09D2E374ddC75fe328f317)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Rollup (0xD1328C9167e0693B689b5aa5a024379d4e437858)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794)
    +++ description: None
```

## Source code changes

```diff
.../L1/fraud-proof/AssertionMap.sol => /dev/null   |  153 ---
 .../fraud-proof/libraries/Errors.sol => /dev/null  |   40 -
 .../implementation/meta.txt => /dev/null           |    2 -
 .../proxy/ERC1967/ERC1967Proxy.sol => /dev/null    |   32 -
 .../proxy/ERC1967/ERC1967Upgrade.sol => /dev/null  |  193 ---
 .../contracts/proxy/Proxy.sol => /dev/null         |   85 --
 .../proxy/beacon/IBeacon.sol => /dev/null          |   15 -
 .../contracts/utils/StorageSlot.sol => /dev/null   |   83 --
 .../TransparentUpgradeableProxy.sol => /dev/null   |  124 --
 .../AssertionMap/proxy/meta.txt => /dev/null       |    2 -
 .../L1/verification/BondManager.sol => /dev/null   |   33 -
 .../L1/verification/IBondManager.sol => /dev/null  |   13 -
 .../resolver/Lib_AddressManager.sol => /dev/null   |   61 -
 .../resolver/Lib_AddressResolver.sol => /dev/null  |   40 -
 .../BondManager/meta.txt => /dev/null              |    2 -
 .../implementation/contracts/GnosisSafe.sol        |    0
 .../implementation/contracts/base/Executor.sol     |    0
 .../contracts/base/FallbackManager.sol             |    0
 .../implementation/contracts/base/GuardManager.sol |    0
 .../contracts/base/ModuleManager.sol               |    0
 .../implementation/contracts/base/OwnerManager.sol |    0
 .../implementation/contracts/common/Enum.sol       |    0
 .../contracts/common/EtherPaymentFallback.sol      |    0
 .../contracts/common/SecuredTokenTransfer.sol      |    0
 .../contracts/common/SelfAuthorized.sol            |    0
 .../contracts/common/SignatureDecoder.sol          |    0
 .../implementation/contracts/common/Singleton.sol  |    0
 .../contracts/common/StorageAccessible.sol         |    0
 .../contracts/external/GnosisSafeMath.sol          |    0
 .../contracts/interfaces/ISignatureValidator.sol   |    0
 .../GnosisSafe}/implementation/meta.txt            |    0
 .../GnosisSafe}/proxy/GnosisSafeProxy.sol          |    0
 .../GnosisSafe}/proxy/meta.txt                     |    0
 .../proxy/meta.txt => /dev/null                    |    2 -
 .../contracts/GnosisSafe.sol => /dev/null          |  422 ------
 .../contracts/base/Executor.sol => /dev/null       |   27 -
 .../base/FallbackManager.sol => /dev/null          |   53 -
 .../contracts/base/GuardManager.sol => /dev/null   |   50 -
 .../contracts/base/ModuleManager.sol => /dev/null  |  133 --
 .../contracts/base/OwnerManager.sol => /dev/null   |  149 ---
 .../contracts/common/Enum.sol => /dev/null         |    8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |   13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |   35 -
 .../common/SelfAuthorized.sol => /dev/null         |   16 -
 .../common/SignatureDecoder.sol => /dev/null       |   36 -
 .../contracts/common/Singleton.sol => /dev/null    |   11 -
 .../common/StorageAccessible.sol => /dev/null      |   47 -
 .../external/GnosisSafeMath.sol => /dev/null       |   54 -
 .../ISignatureValidator.sol => /dev/null           |   20 -
 .../implementation/meta.txt => /dev/null           |    2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         |  155 ---
 .../contracts/GnosisSafe.sol => /dev/null          |  422 ------
 .../contracts/base/Executor.sol => /dev/null       |   27 -
 .../base/FallbackManager.sol => /dev/null          |   53 -
 .../contracts/base/GuardManager.sol => /dev/null   |   50 -
 .../contracts/base/ModuleManager.sol => /dev/null  |  133 --
 .../contracts/base/OwnerManager.sol => /dev/null   |  149 ---
 .../contracts/common/Enum.sol => /dev/null         |    8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |   13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |   35 -
 .../common/SelfAuthorized.sol => /dev/null         |   16 -
 .../common/SignatureDecoder.sol => /dev/null       |   36 -
 .../contracts/common/Singleton.sol => /dev/null    |   11 -
 .../common/StorageAccessible.sol => /dev/null      |   47 -
 .../external/GnosisSafeMath.sol => /dev/null       |   54 -
 .../ISignatureValidator.sol => /dev/null           |   20 -
 .../implementation/meta.txt => /dev/null           |    2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         |  155 ---
 .../proxy/meta.txt => /dev/null                    |    2 -
 .../security/PausableUpgradeable.sol => /dev/null  |  117 --
 .../ReentrancyGuardUpgradeable.sol => /dev/null    |   75 --
 .../contracts/L1/L1CrossDomainMessenger.sol        |  299 +++++
 .../implementation/contracts/L1/L2OutputOracle.sol |  350 +++++
 .../implementation/contracts/L1/OptimismPortal.sol |  552 ++++++++
 .../contracts/L1/ResourceMetering.sol              |  188 +++
 .../implementation/contracts/L1/SystemConfig.sol   |  319 +++++
 .../IL1CrossDomainMessenger.sol => /dev/null       |   63 -
 .../L1CrossDomainMessenger.sol => /dev/null        |  401 ------
 .../ICanonicalTransactionChain.sol => /dev/null    |  179 ---
 .../rollup/IChainStorageContainer.sol => /dev/null |   67 -
 .../rollup/IStateCommitmentChain.sol => /dev/null  |  101 --
 .../contracts/L2/L2CrossDomainMessenger.sol        |  307 +++++
 .../contracts/L2/L2ToL1MessagePasser.sol           |  164 +++
 .../contracts/libraries/Arithmetic.sol             |   48 +
 .../implementation/contracts/libraries/Burn.sol    |   42 +
 .../implementation/contracts/libraries/Bytes.sol}  |   99 +-
 .../contracts/libraries/Constants.sol              |   49 +
 .../contracts/libraries/Encoding.sol               |  169 +++
 .../implementation/contracts/libraries/Hashing.sol |  177 +++
 .../contracts/libraries/Predeploys.sol             |  119 ++
 .../contracts/libraries/SafeCall.sol               |  160 +++
 .../implementation/contracts/libraries/Types.sol   |   90 ++
 .../bridge/ICrossDomainMessenger.sol => /dev/null  |   43 -
 .../bridge/Lib_CrossDomainUtils.sol => /dev/null   |   31 -
 .../libraries/codec/Lib_BVMCodec.sol => /dev/null  |  145 ---
 .../constants/Lib_DefaultValues.sol => /dev/null   |   12 -
 .../Lib_PredeployAddresses.sol => /dev/null        |   22 -
 .../resolver/Lib_AddressManager.sol => /dev/null   |   61 -
 .../resolver/Lib_AddressResolver.sol => /dev/null  |   40 -
 .../libraries/rlp/Lib_RLPReader.sol => /dev/null   |  388 ------
 .../libraries/rlp/Lib_RLPWriter.sol => /dev/null   |  208 ---
 .../contracts/libraries/rlp/RLPReader.sol          |  359 ++++++
 .../contracts/libraries/rlp}/RLPWriter.sol         |   10 +-
 .../libraries/trie/Lib_MerkleTrie.sol => /dev/null |  304 -----
 .../trie/Lib_SecureMerkleTrie.sol => /dev/null     |   66 -
 .../contracts/libraries/trie/MerkleTrie.sol        |  288 +++++
 .../contracts/libraries/trie/SecureMerkleTrie.sol  |   64 +
 .../utils/Lib_Bytes32Utils.sol => /dev/null        |   47 -
 .../contracts/universal/CrossDomainMessenger.sol   |  598 +++++++++
 .../contracts/universal/IOptimismMintableERC20.sol |   34 +
 .../contracts/universal/OptimismMintableERC20.sol  |  149 +++
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../contracts/vendor}/AddressAliasHelper.sol       |    2 +-
 .../L1CrossDomainMessenger/implementation/meta.txt |    2 +-
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/token/ERC20/ERC20.sol  |  383 ++++++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |   39 +-
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 +
 .../contracts/token/ERC20/utils/SafeERC20.sol      |   18 +
 .../@openzeppelin/contracts/utils/Address.sol      |   26 +-
 .../@openzeppelin/contracts/utils/Context.sol      |    1 +
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 ++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../@openzeppelin/contracts/utils/math/Math.sol    |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../access/OwnableUpgradeable.sol                  |    0
 .../proxy/utils/Initializable.sol                  |    0
 .../utils/AddressUpgradeable.sol                   |    0
 .../utils/ContextUpgradeable.sol                   |    0
 .../solmate/src/utils/FixedPointMathLib.sol        |  366 ++++++
 .../contracts/L1/L1StandardBridge.sol              |  896 +++++++++++++
 .../contracts/L1/ResourceMetering.sol              |  188 +++
 .../L1/messaging/IL1ERC20Bridge.sol => /dev/null   |  124 --
 .../messaging/IL1StandardBridge.sol => /dev/null   |   75 --
 .../L1/messaging/L1StandardBridge.sol => /dev/null |  298 -----
 .../contracts/L2/L2StandardBridge.sol              |  711 ++++++++++
 .../L2/messaging/IL2ERC20Bridge.sol => /dev/null   |  108 --
 .../contracts/libraries/Arithmetic.sol             |   48 +
 .../implementation/contracts/libraries/Burn.sol    |   42 +
 .../contracts/libraries/Constants.sol              |   49 +
 .../contracts/libraries/Encoding.sol               |  169 +++
 .../implementation/contracts/libraries/Hashing.sol |  177 +++
 .../contracts/libraries/Predeploys.sol             |  119 ++
 .../contracts/libraries/SafeCall.sol               |  160 +++
 .../implementation/contracts/libraries/Types.sol   |   90 ++
 .../bridge/CrossDomainEnabled.sol => /dev/null     |   83 --
 .../bridge/ICrossDomainMessenger.sol => /dev/null  |   43 -
 .../Lib_PredeployAddresses.sol => /dev/null        |   22 -
 .../contracts/libraries/rlp}/RLPWriter.sol         |   10 +-
 .../contracts/universal/CrossDomainMessenger.sol   |  598 +++++++++
 .../contracts/universal/IOptimismMintableERC20.sol |   34 +
 .../contracts/universal/OptimismMintableERC20.sol  |  149 +++
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../contracts/universal/StandardBridge.sol         |  643 ++++++++++
 .../L1StandardBridge/implementation/meta.txt       |    2 +-
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/token/ERC20/ERC20.sol  |  383 ++++++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |   39 +-
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 +
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../@openzeppelin/contracts/utils/Address.sol      |   26 +-
 .../@openzeppelin/contracts/utils/Context.sol      |    1 +
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 ++
 .../utils/introspection/ERC165Checker.sol          |  123 ++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../@openzeppelin/contracts/utils/math/Math.sol    |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../proxy/utils/Initializable.sol                  |    0
 .../utils/AddressUpgradeable.sol                   |    0
 .../solmate/src/utils/FixedPointMathLib.sol        |  366 ++++++
 .../implementation/contracts/L1/L2OutputOracle.sol |  350 +++++
 .../implementation/contracts/libraries/Types.sol   |   90 ++
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../.code/L2OutputOracle/implementation/meta.txt   |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/utils/Address.sol      |   26 +-
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 ++
 .../proxy/contracts/universal/Proxy.sol            |  217 ++++
 .../ethereum/.code/L2OutputOracle/proxy/meta.txt   |    2 +
 .../implementation/contracts/L1/L2OutputOracle.sol |  350 +++++
 .../implementation/contracts/L1/OptimismPortal.sol |  552 ++++++++
 .../contracts/L1/ResourceMetering.sol              |  188 +++
 .../implementation/contracts/L1/SystemConfig.sol   |  319 +++++
 .../contracts/libraries/Arithmetic.sol             |   48 +
 .../implementation/contracts/libraries/Burn.sol    |   42 +
 .../implementation/contracts/libraries/Bytes.sol}  |   99 +-
 .../contracts/libraries/Constants.sol              |   49 +
 .../contracts/libraries/Encoding.sol               |  169 +++
 .../implementation/contracts/libraries/Hashing.sol |  177 +++
 .../contracts/libraries/SafeCall.sol               |  160 +++
 .../implementation/contracts/libraries/Types.sol   |   90 ++
 .../contracts/libraries/rlp/RLPReader.sol          |  359 ++++++
 .../contracts/libraries/rlp/RLPWriter.sol}         |   69 +-
 .../contracts/libraries/trie/MerkleTrie.sol        |  288 +++++
 .../contracts/libraries/trie/SecureMerkleTrie.sol  |   64 +
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../contracts/vendor/AddressAliasHelper.sol        |   43 +
 .../.code/OptimismPortal/implementation/meta.txt   |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |   82 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 +
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../@openzeppelin/contracts/utils/Address.sol      |   26 +-
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 ++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../access/OwnableUpgradeable.sol                  |    0
 .../proxy/utils/Initializable.sol                  |    0
 .../utils/AddressUpgradeable.sol                   |    0
 .../utils/ContextUpgradeable.sol                   |    0
 .../solmate/src/utils/FixedPointMathLib.sol        |  366 ++++++
 .../proxy/contracts/universal/Proxy.sol            |  217 ++++
 .../ethereum/.code/OptimismPortal/proxy/meta.txt   |    2 +
 .../contracts/legacy/AddressManager.sol            |   64 +
 .../contracts/legacy/L1ChugSplashProxy.sol         |  289 +++++
 .../contracts/universal/Proxy.sol                  |  217 ++++
 .../contracts/universal/ProxyAdmin.sol             |  254 ++++
 .../meta.txt                                       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   26 +-
 .../@openzeppelin/contracts/utils/Context.sol      |    1 +
 .../contracts/access/Ownable.sol => /dev/null      |   71 -
 .../L1/fraud-proof/AssertionMap.sol => /dev/null   |  153 ---
 .../L1/fraud-proof/IRollup.sol => /dev/null        |  254 ----
 .../L1/fraud-proof/Rollup.sol => /dev/null         |  642 ----------
 .../L1/fraud-proof/RollupLib.sol => /dev/null      |   39 -
 .../L1/fraud-proof/WhiteList.sol => /dev/null      |   96 --
 .../challenge/Challenge.sol => /dev/null           |  301 -----
 .../challenge/ChallengeLib.sol => /dev/null        |   63 -
 .../challenge/IChallenge.sol => /dev/null          |  121 --
 .../libraries/BytesLib.sol => /dev/null            |  494 -------
 .../libraries/DeserializationLib.sol => /dev/null  |   37 -
 .../fraud-proof/libraries/Errors.sol => /dev/null  |   40 -
 .../libraries/MerkleLib.sol => /dev/null           | 1354 --------------------
 .../libraries/RLPReader.sol => /dev/null           |  369 ------
 .../verifier/IVerifier.sol => /dev/null            |   28 -
 .../verifier/IVerifierEntry.sol => /dev/null       |   30 -
 .../verifier/libraries/BloomLib.sol => /dev/null   |   72 --
 .../libraries/EVMTypesLib.sol => /dev/null         |  141 --
 .../verifier/libraries/MemoryLib.sol => /dev/null  |  311 -----
 .../libraries/OneStepProof.sol => /dev/null        |  598 ---------
 .../libraries/VerificationContext.sol => /dev/null |  122 --
 .../libraries/codec/Lib_BVMCodec.sol => /dev/null  |  145 ---
 .../resolver/Lib_AddressManager.sol => /dev/null   |   61 -
 .../resolver/Lib_AddressResolver.sol => /dev/null  |   40 -
 .../libraries/rlp/Lib_RLPReader.sol => /dev/null   |  388 ------
 .../utils/Lib_Bytes32Utils.sol => /dev/null        |   47 -
 .../Rollup/implementation/meta.txt => /dev/null    |    2 -
 .../proxy/ERC1967/ERC1967Proxy.sol => /dev/null    |   32 -
 .../proxy/ERC1967/ERC1967Upgrade.sol => /dev/null  |  193 ---
 .../contracts/proxy/Proxy.sol => /dev/null         |   85 --
 .../proxy/beacon/IBeacon.sol => /dev/null          |   15 -
 .../contracts/utils/StorageSlot.sol => /dev/null   |   83 --
 .../TransparentUpgradeableProxy.sol => /dev/null   |  124 --
 .../Rollup/proxy/meta.txt => /dev/null             |    2 -
 .../contracts/L1/ResourceMetering.sol              |  188 +++
 .../implementation/contracts/L1/SystemConfig.sol   |  319 +++++
 .../contracts/libraries/Arithmetic.sol             |   48 +
 .../implementation/contracts/libraries/Burn.sol    |   42 +
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../.code/SystemConfig/implementation/meta.txt     |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  222 ++++
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 ++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../access/OwnableUpgradeable.sol}                 |   44 +-
 .../proxy/utils/Initializable.sol                  |    0
 .../utils/AddressUpgradeable.sol                   |    0
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../solmate/src/utils/FixedPointMathLib.sol        |  366 ++++++
 .../proxy/contracts/universal/Proxy.sol            |  217 ++++
 .../ethereum/.code/SystemConfig/proxy/meta.txt     |    2 +
 .../libraries/BytesLib.sol => /dev/null            |  494 -------
 .../libraries/DeserializationLib.sol => /dev/null  |   37 -
 .../libraries/MerkleLib.sol => /dev/null           | 1354 --------------------
 .../libraries/RLPReader.sol => /dev/null           |  369 ------
 .../verifier/IVerifier.sol => /dev/null            |   28 -
 .../verifier/IVerifierEntry.sol => /dev/null       |   30 -
 .../verifier/VerifierEntry.sol => /dev/null        |  106 --
 .../verifier/libraries/BloomLib.sol => /dev/null   |   72 --
 .../libraries/EVMTypesLib.sol => /dev/null         |  141 --
 .../verifier/libraries/MemoryLib.sol => /dev/null  |  311 -----
 .../libraries/OneStepProof.sol => /dev/null        |  598 ---------
 .../verifier/libraries/Params.sol => /dev/null     |   78 --
 .../libraries/VerificationContext.sol => /dev/null |  122 --
 .../implementation/meta.txt => /dev/null           |    2 -
 .../proxy/ERC1967/ERC1967Proxy.sol => /dev/null    |   32 -
 .../proxy/ERC1967/ERC1967Upgrade.sol => /dev/null  |  193 ---
 .../contracts/proxy/Proxy.sol => /dev/null         |   85 --
 .../proxy/beacon/IBeacon.sol => /dev/null          |   15 -
 .../contracts/utils/StorageSlot.sol => /dev/null   |   83 --
 .../TransparentUpgradeableProxy.sol => /dev/null   |  124 --
 .../VerifierEntry/proxy/meta.txt => /dev/null      |    2 -
 295 files changed, 20015 insertions(+), 17512 deletions(-)
```

Generated with discovered.json: 0x1b3cadc80c62eb2f9d718b15120e4a03fa6ec7dd

# Diff at Tue, 31 Oct 2023 10:41:08 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9fa31f2a6274083dfe7f01b69d1220921459db02

## Description

Change in Owner2Multisig owner.

## Watched changes

```diff
    contract Owner2Multisig (0x2F44BD2a54aC3fB20cd7783cF94334069641daC9) {
      values.getOwners.2:
-        "0x895562F29cd2d6B46Da776B3a7778f77E99DbDEE"
+        "0x5a021DC06A9630bb56099b8aEdfaDC2dEa7eB317"
      values.getOwners.1:
-        "0x5a021DC06A9630bb56099b8aEdfaDC2dEa7eB317"
+        "0x207E804758e28F2b3fD6E4219671B327100b82f8"
      values.getOwners.0:
-        "0x207E804758e28F2b3fD6E4219671B327100b82f8"
+        "0xC37642355c18ec9c3b3268AAC67e33516aa115eb"
    }
```
