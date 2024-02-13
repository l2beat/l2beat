Generated with discovered.json: 0x97edc1be390c5077c5863e2ba3fff282032ffa3f

# Diff at Mon, 12 Feb 2024 14:33:24 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@129897f96b3abfd4a0b655fc3454caadeba39bdc block: 19183671
- current block number: 19212561

## Description

Bridges have been updated to support a new message format that includes the token address in the payload.

## Watched changes

```diff
    contract WBTCBridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.governors:
-        ["0xfdF3E24BD26368512C5F65959BBB668d3338f994","0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
      errors:
+        {"governors":"Cannot find a matching method for isGovernor"}
    }
```

```diff
    contract FXSBridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract ETHBridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
      upgradeability.implementation:
-        "0x455603AD9ae671F6c1f0f746F24d7904cA603581"
+        "0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"
      implementations.0:
-        "0x455603AD9ae671F6c1f0f746F24d7904cA603581"
+        "0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"
      values.bridgedToken:
-        "0x0000000000000000000000000000000000000000"
+        "0x0000000000000000000000000000000000455448"
      values.governors:
-        ["0x6A03F3F0943eb686a4EF94e7B6f6CA3332580b5C","0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]
      values.identify:
-        "StarkWare_StarknetEthBridge_2023_1"
+        "StarkWare_StarknetEthBridge_2.0_4"
      values.implementation:
-        "0x455603AD9ae671F6c1f0f746F24d7904cA603581"
+        "0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
      errors:
+        {"governors":"Cannot find a matching method for isGovernor"}
    }
```

```diff
    contract USDTBridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.governors:
-        ["0x3ADfc0aBd0eBD4e61281d991F87134eE3231dB13","0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
      errors:
+        {"governors":"Cannot find a matching method for isGovernor"}
    }
```

```diff
    contract wstETHBridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
      upgradeability.implementation:
-        "0xEf3525a1081a4cf6f76E0B202a575195cEE083a2"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0xEf3525a1081a4cf6f76E0B202a575195cEE083a2"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.governors:
-        ["0x5751a83170BeA11fE7CdA5D599B04153C021f21A"]
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2022_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0xEf3525a1081a4cf6f76E0B202a575195cEE083a2"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
      errors:
+        {"governors":"Cannot find a matching method for isGovernor"}
    }
```

```diff
    contract rETHBridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.governors:
-        ["0x5751a83170BeA11fE7CdA5D599B04153C021f21A"]
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
      errors:
+        {"governors":"Cannot find a matching method for isGovernor"}
    }
```

```diff
    contract sfrxETHBridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract FRAXBridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract LUSDBridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract USDCBridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.governors:
-        ["0xe8e9E69511BaaFC826953fC93cdf1ED6d3B63c53","0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
      errors:
+        {"governors":"Cannot find a matching method for isGovernor"}
    }
```

```diff
    contract UNIBridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

## Source code changes

```diff
.../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../ETHBridge/implementation/meta.txt              |   2 +-
 .../ETHBridge/implementation/src/solidity/Fees.sol |  44 ++
 .../src/solidity/IStarkgateBridge.sol}             |  23 +-
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity}/StarknetEthBridge.sol            |  45 +-
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth}/CairoConstants.sol        |   4 +-
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces}/BlockDirectCall.sol       |   6 +-
 .../solidity/interfaces}/ContractInitializer.sol   |   4 +-
 .../starkware/solidity/interfaces}/Identity.sol    |   4 +-
 .../solidity/interfaces}/ProxySupport.sol          |  19 +-
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries}/Addresses.sol    |   4 +-
 .../starkware/solidity/libraries}/NamedStorage.sol |  56 +-
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries}/Transfers.sol    |  32 +-
 .../starkware/solidity/tokens/ERC20}/IERC20.sol    |   4 +-
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity}/IStarknetMessaging.sol      |  12 +-
 .../solidity}/IStarknetMessagingEvents.sol         |   4 +-
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../FRAXBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol}             |  23 +-
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth}/CairoConstants.sol        |   4 +-
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces}/BlockDirectCall.sol       |   6 +-
 .../solidity/interfaces}/ContractInitializer.sol   |   4 +-
 .../starkware/solidity/interfaces}/Identity.sol    |   4 +-
 .../solidity/interfaces}/ProxySupport.sol          |  19 +-
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries}/Addresses.sol    |   4 +-
 .../starkware/solidity/libraries}/NamedStorage.sol |  56 +-
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries}/Transfers.sol    |  32 +-
 .../starkware/solidity/tokens/ERC20}/IERC20.sol    |   4 +-
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity}/IStarknetMessaging.sol      |  12 +-
 .../solidity}/IStarknetMessagingEvents.sol         |   4 +-
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../FXSBridge/implementation/meta.txt              |   2 +-
 .../FXSBridge/implementation/src/solidity/Fees.sol |  44 ++
 .../src/solidity/IStarkgateBridge.sol}             |  23 +-
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth}/CairoConstants.sol        |   4 +-
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces}/BlockDirectCall.sol       |   6 +-
 .../solidity/interfaces}/ContractInitializer.sol   |   4 +-
 .../starkware/solidity/interfaces}/Identity.sol    |   4 +-
 .../solidity/interfaces}/ProxySupport.sol          |  19 +-
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries}/Addresses.sol    |   4 +-
 .../starkware/solidity/libraries}/NamedStorage.sol |  56 +-
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries}/Transfers.sol    |  32 +-
 .../starkware/solidity/tokens/ERC20}/IERC20.sol    |   4 +-
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity}/IStarknetMessaging.sol      |  12 +-
 .../solidity}/IStarknetMessagingEvents.sol         |   4 +-
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../LUSDBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol}             |  23 +-
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth}/CairoConstants.sol        |   4 +-
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces}/BlockDirectCall.sol       |   6 +-
 .../solidity/interfaces}/ContractInitializer.sol   |   4 +-
 .../starkware/solidity/interfaces}/Identity.sol    |   4 +-
 .../solidity/interfaces}/ProxySupport.sol          |  19 +-
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries}/Addresses.sol    |   4 +-
 .../starkware/solidity/libraries}/NamedStorage.sol |  56 +-
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries}/Transfers.sol    |  32 +-
 .../starkware/solidity/tokens/ERC20}/IERC20.sol    |   4 +-
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity}/IStarknetMessaging.sol      |  12 +-
 .../solidity}/IStarknetMessagingEvents.sol         |   4 +-
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../UNIBridge/implementation/meta.txt              |   2 +-
 .../UNIBridge/implementation/src/solidity/Fees.sol |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../implementation/IERC20.sol => /dev/null         |  43 --
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../implementation/Transfers.sol => /dev/null      |  77 ---
 .../USDCBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../implementation/IERC20.sol => /dev/null         |  43 --
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../implementation/Transfers.sol => /dev/null      |  77 ---
 .../USDTBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../implementation/IERC20.sol => /dev/null         |  43 --
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../implementation/Transfers.sol => /dev/null      |  77 ---
 .../WBTCBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../implementation/IERC20.sol => /dev/null         |  43 --
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../implementation/Transfers.sol => /dev/null      |  77 ---
 .../rETHBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../implementation/IERC20.sol => /dev/null         |  43 --
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../implementation/Transfers.sol => /dev/null      |  77 ---
 .../sfrxETHBridge/implementation/meta.txt          |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  42 --
 .../BlockDirectCall.sol => /dev/null               |  21 -
 .../implementation/CairoConstants.sol => /dev/null |   7 -
 .../ContractInitializer.sol => /dev/null           |  38 --
 .../GenericGovernance.sol => /dev/null             |  42 --
 .../implementation/Governance.sol => /dev/null     | 108 ----
 .../implementation/IERC20.sol => /dev/null         |  28 -
 .../IStarknetMessaging.sol => /dev/null            |  54 --
 .../IStarknetMessagingEvents.sol => /dev/null      |  51 --
 .../implementation/Identity.sol => /dev/null       |   9 -
 .../implementation/MGovernance.sol => /dev/null    |  14 -
 .../implementation/NamedStorage.sol => /dev/null   | 105 ----
 .../implementation/ProxySupport.sol => /dev/null   |  78 ---
 .../StarknetBridgeConstants.sol => /dev/null       |  12 -
 .../StarknetERC20Bridge.sol => /dev/null           |  28 -
 .../StarknetTokenBridge.sol => /dev/null           | 240 --------
 .../StarknetTokenStorage.sol => /dev/null          |  70 ---
 .../implementation/Transfers.sol => /dev/null      |  62 ---
 .../wstETHBridge/implementation/meta.txt           |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 488 files changed, 30848 insertions(+), 11207 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19183671 (main branch discovery), not current.

```diff
    contract LORDS Bridge (0x023A2aAc5d0fa69E3243994672822BA43E34E5C9) {
      name:
-        "LORDS Bridge"
+        "LORDSBridge"
    }
```

```diff
    contract DAI Bridge (0x0437465dfb5B79726e35F08559B0cBea55bb585C) {
      name:
-        "DAI Bridge"
+        "DAIBridge"
    }
```

```diff
    contract WBTC Bridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
      name:
-        "WBTC Bridge"
+        "WBTCBridge"
    }
```

```diff
    contract FXS Bridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
      name:
-        "FXS Bridge"
+        "FXSBridge"
    }
```

```diff
    contract Proxy Multisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
      name:
-        "Proxy Multisig"
+        "ProxyMultisig"
    }
```

```diff
    contract Implementation Multisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
      name:
-        "Implementation Multisig"
+        "ImplementationMultisig"
    }
```

```diff
    contract ETH Bridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
      name:
-        "ETH Bridge"
+        "ETHBridge"
    }
```

```diff
    contract USDT Bridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
      name:
-        "USDT Bridge"
+        "USDTBridge"
    }
```

```diff
    contract wstETH Bridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
      name:
-        "wstETH Bridge"
+        "wstETHBridge"
    }
```

```diff
    contract rETH Bridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
      name:
-        "rETH Bridge"
+        "rETHBridge"
    }
```

```diff
    contract sfrxETH Bridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
      name:
-        "sfrxETH Bridge"
+        "sfrxETHBridge"
    }
```

```diff
    contract FRAX Bridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
      name:
-        "FRAX Bridge"
+        "FRAXBridge"
    }
```

```diff
    contract LUSD Bridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
      name:
-        "LUSD Bridge"
+        "LUSDBridge"
    }
```

```diff
    contract USDC Bridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      name:
-        "USDC Bridge"
+        "USDCBridge"
    }
```

```diff
    contract UNI Bridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
      name:
-        "UNI Bridge"
+        "UNIBridge"
    }
```

Generated with discovered.json: 0x2e28a72d29a4cc1e4344de73fd939abf00e284ab

# Diff at Thu, 08 Feb 2024 13:13:55 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9ecce2dd03460fdede9f1111a19bff138d54ce28 block: 19025063
- current block number: 19183671

## Description

The upgrade delays for multiple bridge contracts (WBTC, ETH, USDT, USDC) are changed to 0.

## Watched changes

```diff
    contract WBTC Bridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
      upgradeability.upgradeDelay:
-        604800
+        0
      values.getUpgradeActivationDelay:
-        604800
+        0
    }
```

```diff
    contract ETH Bridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
      upgradeability.upgradeDelay:
-        604800
+        0
      values.getUpgradeActivationDelay:
-        604800
+        0
    }
```

```diff
    contract USDT Bridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
      upgradeability.upgradeDelay:
-        604800
+        0
      values.getUpgradeActivationDelay:
-        604800
+        0
    }
```

```diff
    contract USDC Bridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      upgradeability.upgradeDelay:
-        604800
+        0
      values.getUpgradeActivationDelay:
-        604800
+        0
    }
```

Generated with discovered.json: 0x08a0364947864d1363efada15e024f5fb8769f76

# Diff at Wed, 17 Jan 2024 07:18:24 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e7e7682db5966865697553171159822c2ec0248f block: 19012236
- current block number: 19025063

## Description

Change in the USDC Bridge proxy governors - a new address is added.

## Watched changes

```diff
    contract USDC Bridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      upgradeability.proxyGovernance[1]:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      upgradeability.proxyGovernance.0:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
+        "0xf5EF70bb0975cAF85461523e0cB3910c35cb30b4"
    }
```

# Diff at Mon, 15 Jan 2024 12:19:39 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@7146ff49765d6596dfb78aa68e5c4cee6f5f4642 block: 18940875
- current block number: 19012236

## Description

The program hash and config hash are updated (with transactions 0xd15e25aaac8f634fcbe599fe0f47959d087dac5674091e12fc5a5a9808899f46 and 0x28a355fcc9228ed719110e075a3071d20446cfaff5ece324839429680fc87cf4). One of the USDC Bridge proxy governors has been removed.

## Watched changes

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
      values.configHash:
-        "671483050609816861429812414688707376174032882875357307847551691140236175837"
+        "2590421891839256512113614983194993186457498815986333310670788206383913888162"
      values.programHash:
-        "54878256403880350656938046611252303365750679698042371543935159963667935317"
+        "2479841346739966073527450029179698923866252973805981504232089731754042431018"
    }
```

```diff
    contract USDC Bridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      upgradeability.proxyGovernance[1]:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      upgradeability.proxyGovernance.0:
-        "0xf5EF70bb0975cAF85461523e0cB3910c35cb30b4"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

# Diff at Tue, 19 Dec 2023 15:34:07 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@66449a15ea740d012130a024e5e0daa7f431f04b

## Description

Updated Starknet program hash.
The hash can be found by looking at the transactions of one of the Starknet Implementation Governors - 0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd. The tx hash is 0x4131a969982ec958490e399653f84bb356e4c282376320b1d6d2e6cc195597ef.

## Watched changes

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
      values.programHash:
-        "1865367024509426979036104162713508294334262484507712987283009063059134893433"
+        "54878256403880350656938046611252303365750679698042371543935159963667935317"
    }
```

# Diff at Mon, 18 Dec 2023 14:44:24 GMT:

- author: maciekzygmunt (<maciekzygmunt@interia.pl>)
- comparing to: main@4b160bc70449af36363ff58bf34ad3610acc00ff

## Description

Few new escrows have been added, to track the balances of the new tokens.

The TVL limits on all StarGate Bridge contracts have been lifted (set to very high number).

New owner (EOA) has been added to Implementation Multisig, now it's 2/5.

## Watched changes

```diff
    contract WBTC Bridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
      values.maxTotalBalance:
-        20000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract FXS Bridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
      values.maxTotalBalance:
-        "2000000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract Implementation Multisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
      values.getOwners[4]:
+        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.getOwners.3:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.getOwners.2:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.getOwners.1:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
      values.getOwners.0:
-        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
+        "0x804d60CB1ade94511f7915A2062948685Ca8C81f"
    }
```

```diff
    contract ETH Bridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
      values.maxTotalBalance:
-        "150000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract USDT Bridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
      values.maxTotalBalance:
-        20000000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract wstETH Bridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
      values.maxTotalBalance:
-        "5000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract rETH Bridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
      values.maxTotalBalance:
-        "10000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract sfrxETH Bridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
      values.maxTotalBalance:
-        "5000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract FRAX Bridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
      values.maxTotalBalance:
-        "10000000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract LUSD Bridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
      values.maxTotalBalance:
-        "3000000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract USDC Bridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      values.maxTotalBalance:
-        40000000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract UNI Bridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
      values.maxTotalBalance:
-        "10000000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

# Diff at Wed, 22 Nov 2023 11:30:11 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@a260f672297f7e3c229fd7a1940da6abc97c3816

## Description

A new owner is added to the BridgeMultisig and the threshold is changed to 2, which makes it a 2/4 Multisig. A new owner is also added to Proxy Multisig (now a 2/4 Multisig) and to Implementation Multisig (now a 2/4 Multisig).

## Watched changes

```diff
    contract BridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
      values.getOwners[3]:
+        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.getOwners.2:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.getOwners.1:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.getOwners.0:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"
      values.getThreshold:
-        1
+        2
    }
```

```diff
    contract Proxy Multisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
      values.getOwners[3]:
+        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.getOwners.2:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.getOwners.1:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.getOwners.0:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
    }
```

```diff
    contract Implementation Multisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
      values.getOwners[3]:
+        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.getOwners.2:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.getOwners.1:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.getOwners.0:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
    }
```
