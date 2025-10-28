Generated with discovered.json: 0x65425454db7e98b4a83fae5de7b48d625bdd18f2

# Diff at Mon, 27 Oct 2025 08:03:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e31499883253bb2b7c36fe0654ea187cfa3ca612 block: 1752073991
- current timestamp: 1761552123

## Description

config: dvn template matches.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752073991 (main branch discovery), not current.

```diff
    contract DVN (eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5) {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      template:
+        "layerzero/DVN"
      description:
+        "Defines the logic that validates LayerZero Packets for this DVN."
    }
```

```diff
-   Status: DELETED
    contract DVNFeeLib (eth:0xa7b5189bcA84Cd304D8553977c7C614329750d99)
    +++ description: None
```

```diff
    contract Google Cloud Oracle (eth:0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      template:
+        "layerzero/DVN"
      description:
+        "Defines the logic that validates LayerZero Packets for this DVN."
    }
```

```diff
-   Status: DELETED
    contract VerifierFeeLib (eth:0xdeA04ef31C4B4FDf31CB58923F37869739280d49)
    +++ description: None
```

Generated with discovered.json: 0x2d453ac620fe726bf76a3780915063a511bea041

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x5b28248f7606bf1c504eaaea33e1ef88d9ce1f00

# Diff at Mon, 14 Jul 2025 12:45:22 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22882445
- current block number: 22882445

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22882445 (main branch discovery), not current.

```diff
    contract FPValidator (0x07245eEa05826F5984c7c3C8F478b04892e4df89) {
    +++ description: None
      address:
-        "0x07245eEa05826F5984c7c3C8F478b04892e4df89"
+        "eth:0x07245eEa05826F5984c7c3C8F478b04892e4df89"
      values.stargateBridgeAddress:
-        "0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97"
+        "eth:0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97"
      values.stargateTokenAddress:
-        "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6"
+        "eth:0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6"
      implementationNames.0x07245eEa05826F5984c7c3C8F478b04892e4df89:
-        "FPValidator"
      implementationNames.eth:0x07245eEa05826F5984c7c3C8F478b04892e4df89:
+        "FPValidator"
    }
```

```diff
    EOA  (0x0cb72C1F6a36c225A7E2B21712E8853A4A1acc47) {
    +++ description: None
      address:
-        "0x0cb72C1F6a36c225A7E2B21712E8853A4A1acc47"
+        "eth:0x0cb72C1F6a36c225A7E2B21712E8853A4A1acc47"
    }
```

```diff
    EOA  (0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b) {
    +++ description: None
      address:
-        "0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
+        "eth:0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
    }
```

```diff
    EOA  (0x18A5Af69DfC02dc950f7534Ae97A180F34B75d7a) {
    +++ description: None
      address:
-        "0x18A5Af69DfC02dc950f7534Ae97A180F34B75d7a"
+        "eth:0x18A5Af69DfC02dc950f7534Ae97A180F34B75d7a"
    }
```

```diff
    contract GnosisSafe (0x19565F4771843467aAD632d6B56c75396785b06C) {
    +++ description: None
      address:
-        "0x19565F4771843467aAD632d6B56c75396785b06C"
+        "eth:0x19565F4771843467aAD632d6B56c75396785b06C"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x18A5Af69DfC02dc950f7534Ae97A180F34B75d7a"
+        "eth:0x18A5Af69DfC02dc950f7534Ae97A180F34B75d7a"
      values.$members.1:
-        "0x8c2641b5915171845EfDdC9fcAc20427B9347fF4"
+        "eth:0x8c2641b5915171845EfDdC9fcAc20427B9347fF4"
      values.$members.2:
-        "0x3CA9A84E7c91F2167007cAce3017BaD23D2b14BC"
+        "eth:0x3CA9A84E7c91F2167007cAce3017BaD23D2b14BC"
      values.$members.3:
-        "0xAC0248e9C78774bA0ef9E71B1Ce1393a10C17E3C"
+        "eth:0xAC0248e9C78774bA0ef9E71B1Ce1393a10C17E3C"
      implementationNames.0x19565F4771843467aAD632d6B56c75396785b06C:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x19565F4771843467aAD632d6B56c75396785b06C:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract BobaEscrow1 (0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55) {
    +++ description: None
      address:
-        "0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55"
+        "eth:0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55"
      implementationNames.0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55:
-        "Lib_ResolvedDelegateProxy"
      implementationNames.eth:0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55:
+        "Lib_ResolvedDelegateProxy"
    }
```

```diff
    EOA  (0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d) {
    +++ description: None
      address:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "eth:0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
    }
```

```diff
    contract ProxyAdmin (0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b) {
    +++ description: None
      address:
-        "0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b"
+        "eth:0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b"
      values.owner:
-        "0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8"
+        "eth:0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8"
      implementationNames.0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b:
-        "ProxyAdmin"
      implementationNames.eth:0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1) {
    +++ description: None
      address:
-        "0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1"
+        "eth:0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1"
    }
```

```diff
    EOA  (0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437) {
    +++ description: None
      address:
-        "0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
+        "eth:0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
    }
```

```diff
    EOA  (0x3205aFb074BECbEaB6D13Ef835b48789EbfAB60c) {
    +++ description: None
      address:
-        "0x3205aFb074BECbEaB6D13Ef835b48789EbfAB60c"
+        "eth:0x3205aFb074BECbEaB6D13Ef835b48789EbfAB60c"
    }
```

```diff
    EOA  (0x34Eb88EAD486A09CAcD8DaBe013682Dc5F1DC41D) {
    +++ description: None
      address:
-        "0x34Eb88EAD486A09CAcD8DaBe013682Dc5F1DC41D"
+        "eth:0x34Eb88EAD486A09CAcD8DaBe013682Dc5F1DC41D"
    }
```

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      address:
-        "0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d"
+        "eth:0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d"
      values.owner:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      values.uln:
-        "0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
+        "eth:0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
      implementationNames.0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d:
-        "TreasuryV2"
      implementationNames.eth:0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d:
+        "TreasuryV2"
    }
```

```diff
    EOA  (0x39f86ECef62c5bcE23428d6b7c7050D9Ecb0e346) {
    +++ description: None
      address:
-        "0x39f86ECef62c5bcE23428d6b7c7050D9Ecb0e346"
+        "eth:0x39f86ECef62c5bcE23428d6b7c7050D9Ecb0e346"
    }
```

```diff
    EOA  (0x3c1Cb7D4c0ce0dc72eDc7Ea06acC866e62a8f1d8) {
    +++ description: None
      address:
-        "0x3c1Cb7D4c0ce0dc72eDc7Ea06acC866e62a8f1d8"
+        "eth:0x3c1Cb7D4c0ce0dc72eDc7Ea06acC866e62a8f1d8"
    }
```

```diff
    EOA  (0x3CA9A84E7c91F2167007cAce3017BaD23D2b14BC) {
    +++ description: None
      address:
-        "0x3CA9A84E7c91F2167007cAce3017BaD23D2b14BC"
+        "eth:0x3CA9A84E7c91F2167007cAce3017BaD23D2b14BC"
    }
```

```diff
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859) {
    +++ description: None
      address:
-        "0x462F7eC57C6492B983a8C8322B4369a7f149B859"
+        "eth:0x462F7eC57C6492B983a8C8322B4369a7f149B859"
      values.stargateBridgeAddress:
-        "0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97"
+        "eth:0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97"
      values.stargateTokenAddress:
-        "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6"
+        "eth:0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6"
      implementationNames.0x462F7eC57C6492B983a8C8322B4369a7f149B859:
-        "MPTValidator01"
      implementationNames.eth:0x462F7eC57C6492B983a8C8322B4369a7f149B859:
+        "MPTValidator01"
    }
```

```diff
    contract  (0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034) {
    +++ description: None
      address:
-        "0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034"
+        "eth:0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034"
      values.$admin:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
+        "eth:0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      values.$implementation:
-        "0x154c7B3Eee18ABCFaede98fae00e58e7737d96dE"
+        "eth:0x154c7B3Eee18ABCFaede98fae00e58e7737d96dE"
      implementationNames.0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034:
-        "OptimizedTransparentUpgradeableProxy"
      implementationNames.0x154c7B3Eee18ABCFaede98fae00e58e7737d96dE:
-        ""
      implementationNames.eth:0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034:
+        "OptimizedTransparentUpgradeableProxy"
      implementationNames.eth:0x154c7B3Eee18ABCFaede98fae00e58e7737d96dE:
+        ""
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      address:
-        "0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
+        "eth:0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
      values.endpoint:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.layerZeroToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.nonceContract:
-        "0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068"
+        "eth:0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068"
      values.owner:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      values.treasuryContract:
-        "0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d"
+        "eth:0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d"
      implementationNames.0x4D73AdB72bC3DD368966edD0f0b2148401A178E2:
-        "UltraLightNodeV2"
      implementationNames.eth:0x4D73AdB72bC3DD368966edD0f0b2148401A178E2:
+        "UltraLightNodeV2"
    }
```

```diff
    contract UsdcEscrow (0x4F52b41a778761bd2EEa5b7b7ed8cBDAA02cEF3E) {
    +++ description: None
      address:
-        "0x4F52b41a778761bd2EEa5b7b7ed8cBDAA02cEF3E"
+        "eth:0x4F52b41a778761bd2EEa5b7b7ed8cBDAA02cEF3E"
      values.lzEndpoint:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.owner:
-        "0x19565F4771843467aAD632d6B56c75396785b06C"
+        "eth:0x19565F4771843467aAD632d6B56c75396785b06C"
      values.precrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.token:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x4F52b41a778761bd2EEa5b7b7ed8cBDAA02cEF3E:
-        "ProxyERC20"
      implementationNames.eth:0x4F52b41a778761bd2EEa5b7b7ed8cBDAA02cEF3E:
+        "ProxyERC20"
    }
```

```diff
    contract EuraEscrow (0x4Fa745FCCC04555F2AFA8874cd23961636CdF982) {
    +++ description: None
      address:
-        "0x4Fa745FCCC04555F2AFA8874cd23961636CdF982"
+        "eth:0x4Fa745FCCC04555F2AFA8874cd23961636CdF982"
      values.$admin:
-        "0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b"
+        "eth:0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b"
      values.$implementation:
-        "0xd735611AE930D2fd3788AAbf7696e6D8f664d15e"
+        "eth:0xd735611AE930D2fd3788AAbf7696e6D8f664d15e"
      values.$pastUpgrades.0.2.0:
-        "0xd735611AE930D2fd3788AAbf7696e6D8f664d15e"
+        "eth:0xd735611AE930D2fd3788AAbf7696e6D8f664d15e"
      values.canonicalToken:
-        "0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8"
+        "eth:0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8"
      values.lzEndpoint:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.treasury:
-        "0x8667DBEBf68B0BFa6Db54f550f41Be16c4067d60"
+        "eth:0x8667DBEBf68B0BFa6Db54f550f41Be16c4067d60"
      implementationNames.0x4Fa745FCCC04555F2AFA8874cd23961636CdF982:
-        "TransparentUpgradeableProxy"
      implementationNames.0xd735611AE930D2fd3788AAbf7696e6D8f664d15e:
-        "LayerZeroBridge"
      implementationNames.eth:0x4Fa745FCCC04555F2AFA8874cd23961636CdF982:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xd735611AE930D2fd3788AAbf7696e6D8f664d15e:
+        "LayerZeroBridge"
    }
```

```diff
    EOA  (0x565cFd7224bbc2a81a6e2a1464892ecB27efB070) {
    +++ description: None
      address:
-        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
+        "eth:0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
    }
```

```diff
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      address:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "eth:0x5a54fe5234E811466D5366846283323c954310B2"
      values.$admin:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
+        "eth:0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      values.$implementation:
-        "0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"
+        "eth:0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"
      values.$pastUpgrades.0.2.0:
-        "0xccEf13cFEB6873c167f62A365548A57C9ed29DC5"
+        "eth:0xccEf13cFEB6873c167f62A365548A57C9ed29DC5"
      values.$pastUpgrades.1.2.0:
-        "0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"
+        "eth:0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"
      implementationNames.0x5a54fe5234E811466D5366846283323c954310B2:
-        "OptimizedTransparentUpgradeableProxy"
      implementationNames.0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1:
-        ""
      implementationNames.eth:0x5a54fe5234E811466D5366846283323c954310B2:
+        "OptimizedTransparentUpgradeableProxy"
      implementationNames.eth:0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1:
+        ""
    }
```

```diff
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068) {
    +++ description: None
      address:
-        "0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068"
+        "eth:0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068"
      values.endpoint:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      implementationNames.0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068:
-        "NonceContract"
      implementationNames.eth:0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068:
+        "NonceContract"
    }
```

```diff
    EOA  (0x5bC6AA6ad117A8B50ABf9E1658971f5DA1968c5c) {
    +++ description: None
      address:
-        "0x5bC6AA6ad117A8B50ABf9E1658971f5DA1968c5c"
+        "eth:0x5bC6AA6ad117A8B50ABf9E1658971f5DA1968c5c"
    }
```

```diff
    contract GnosisSafe (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      address:
-        "0x65bb797c2B9830d891D87288F029ed8dACc19705"
+        "eth:0x65bb797c2B9830d891D87288F029ed8dACc19705"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
+        "eth:0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
      values.$members.1:
-        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
+        "eth:0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
      values.$members.2:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "eth:0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
      values.$members.3:
-        "0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523"
+        "eth:0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523"
      values.$members.4:
-        "0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326"
+        "eth:0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326"
      values.$members.5:
-        "0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"
+        "eth:0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"
      implementationNames.0x65bb797c2B9830d891D87288F029ed8dACc19705:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x65bb797c2B9830d891D87288F029ed8dACc19705:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      address:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.defaultReceiveLibraryAddress:
-        "0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
+        "eth:0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
      values.defaultSendLibrary:
-        "0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
+        "eth:0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
      values.libraryLookup.0:
-        "0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C"
+        "eth:0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C"
      values.libraryLookup.1:
-        "0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
+        "eth:0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
      values.libraryLookup.2:
-        "0xbE4fB271cfB7bcbB47EA9573321c7bfe309fc220"
+        "eth:0xbE4fB271cfB7bcbB47EA9573321c7bfe309fc220"
      values.libraryLookup.3:
-        "0xD231084BfB234C107D3eE2b22F97F3346fDAF705"
+        "eth:0xD231084BfB234C107D3eE2b22F97F3346fDAF705"
      values.libraryLookup.4:
-        "0x245B6e8FFE9ea5Fc301e32d16F66bD4C2123eEfC"
+        "eth:0x245B6e8FFE9ea5Fc301e32d16F66bD4C2123eEfC"
      values.owner:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      implementationNames.0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675:
-        "Endpoint"
      implementationNames.eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675:
+        "Endpoint"
    }
```

```diff
    contract  (0x6BD792911F4B3714E88FbDf32B351632e7d22c70) {
    +++ description: None
      address:
-        "0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
+        "eth:0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
      values.$admin:
-        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
+        "eth:0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
      values.$implementation:
-        "0x61Ab01Ce58D1dFf3562bb25870020d555e39D849"
+        "eth:0x61Ab01Ce58D1dFf3562bb25870020d555e39D849"
      implementationNames.0x6BD792911F4B3714E88FbDf32B351632e7d22c70:
-        "OptimizedTransparentUpgradeableProxy"
      implementationNames.0x61Ab01Ce58D1dFf3562bb25870020d555e39D849:
-        ""
      implementationNames.eth:0x6BD792911F4B3714E88FbDf32B351632e7d22c70:
+        "OptimizedTransparentUpgradeableProxy"
      implementationNames.eth:0x61Ab01Ce58D1dFf3562bb25870020d555e39D849:
+        ""
    }
```

```diff
    contract BobaEscrow3 (0x6F537839714761388B6d7ED61Bc09579d5dA2F41) {
    +++ description: None
      address:
-        "0x6F537839714761388B6d7ED61Bc09579d5dA2F41"
+        "eth:0x6F537839714761388B6d7ED61Bc09579d5dA2F41"
      implementationNames.0x6F537839714761388B6d7ED61Bc09579d5dA2F41:
-        "Lib_ResolvedDelegateProxy"
      implementationNames.eth:0x6F537839714761388B6d7ED61Bc09579d5dA2F41:
+        "Lib_ResolvedDelegateProxy"
    }
```

```diff
    contract StoneEscrow (0x7122985656e38BDC0302Db86685bb972b145bD3C) {
    +++ description: None
      address:
-        "0x7122985656e38BDC0302Db86685bb972b145bD3C"
+        "eth:0x7122985656e38BDC0302Db86685bb972b145bD3C"
      values.lzEndpoint:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.minter:
-        "0xEc306E46549A7E8f4fCE823D3058f2D134133B17"
+        "eth:0xEc306E46549A7E8f4fCE823D3058f2D134133B17"
      values.owner:
-        "0x83000EF01eD5C15462ef20066091Abd3654e523f"
+        "eth:0x83000EF01eD5C15462ef20066091Abd3654e523f"
      values.precrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.token:
-        "0x7122985656e38BDC0302Db86685bb972b145bD3C"
+        "eth:0x7122985656e38BDC0302Db86685bb972b145bD3C"
      implementationNames.0x7122985656e38BDC0302Db86685bb972b145bD3C:
-        "Stone"
      implementationNames.eth:0x7122985656e38BDC0302Db86685bb972b145bD3C:
+        "Stone"
    }
```

```diff
    EOA  (0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e) {
    +++ description: None
      address:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "eth:0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
    }
```

```diff
    EOA  (0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5) {
    +++ description: None
      address:
-        "0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5"
+        "eth:0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5"
    }
```

```diff
    EOA  (0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e) {
    +++ description: None
      address:
-        "0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
+        "eth:0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
    }
```

```diff
    EOA  (0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523) {
    +++ description: None
      address:
-        "0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523"
+        "eth:0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523"
    }
```

```diff
    EOA  (0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8) {
    +++ description: None
      address:
-        "0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8"
+        "eth:0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8"
    }
```

```diff
    EOA  (0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326) {
    +++ description: None
      address:
-        "0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326"
+        "eth:0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326"
    }
```

```diff
    EOA  (0x83000EF01eD5C15462ef20066091Abd3654e523f) {
    +++ description: None
      address:
-        "0x83000EF01eD5C15462ef20066091Abd3654e523f"
+        "eth:0x83000EF01eD5C15462ef20066091Abd3654e523f"
    }
```

```diff
    EOA  (0x8A7f7C5b556B1298a74c0e89df46Eba117A2F6c1) {
    +++ description: None
      address:
-        "0x8A7f7C5b556B1298a74c0e89df46Eba117A2F6c1"
+        "eth:0x8A7f7C5b556B1298a74c0e89df46Eba117A2F6c1"
    }
```

```diff
    EOA  (0x8c2641b5915171845EfDdC9fcAc20427B9347fF4) {
    +++ description: None
      address:
-        "0x8c2641b5915171845EfDdC9fcAc20427B9347fF4"
+        "eth:0x8c2641b5915171845EfDdC9fcAc20427B9347fF4"
    }
```

```diff
    EOA  (0x8f02b4a44Eacd9b8eE7739aa0BA58833DD45d002) {
    +++ description: None
      address:
-        "0x8f02b4a44Eacd9b8eE7739aa0BA58833DD45d002"
+        "eth:0x8f02b4a44Eacd9b8eE7739aa0BA58833DD45d002"
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      address:
-        "0x902F09715B6303d4173037652FA7377e5b98089E"
+        "eth:0x902F09715B6303d4173037652FA7377e5b98089E"
      values.$admin:
-        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
+        "eth:0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
      values.$implementation:
-        "0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
+        "eth:0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
      values.$pastUpgrades.0.2.0:
-        "0x4E341b9Cf90514A5b7dfec2c9A1f20AA4514C260"
+        "eth:0x4E341b9Cf90514A5b7dfec2c9A1f20AA4514C260"
      values.$pastUpgrades.1.2.0:
-        "0xDD55F55CB9a39EF1eed4Ee1a84EE1b7411bE306a"
+        "eth:0xDD55F55CB9a39EF1eed4Ee1a84EE1b7411bE306a"
      values.$pastUpgrades.2.2.0:
-        "0x9512a85438606dEdE54297634dEd7C7C0c231874"
+        "eth:0x9512a85438606dEdE54297634dEd7C7C0c231874"
      values.$pastUpgrades.3.2.0:
-        "0xaF34771b16960ea77484A866a34CCDAFDc913D9C"
+        "eth:0xaF34771b16960ea77484A866a34CCDAFDc913D9C"
      values.$pastUpgrades.4.2.0:
-        "0x8775e9D584008f84daFe7abe75a62f6C91491027"
+        "eth:0x8775e9D584008f84daFe7abe75a62f6C91491027"
      values.$pastUpgrades.5.2.0:
-        "0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
+        "eth:0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
      implementationNames.0x902F09715B6303d4173037652FA7377e5b98089E:
-        "OptimizedTransparentUpgradeableProxy"
      implementationNames.0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f:
-        ""
      implementationNames.eth:0x902F09715B6303d4173037652FA7377e5b98089E:
+        "OptimizedTransparentUpgradeableProxy"
      implementationNames.eth:0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f:
+        ""
    }
```

```diff
    contract WagmiEscrow (0x92CC36D66e9d739D50673d1f27929a371FB83a67) {
    +++ description: None
      address:
-        "0x92CC36D66e9d739D50673d1f27929a371FB83a67"
+        "eth:0x92CC36D66e9d739D50673d1f27929a371FB83a67"
      values.lzEndpoint:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.owner:
-        "0xe9Fb0C2206B53d3e76C88Da58790f7fe9A45b373"
+        "eth:0xe9Fb0C2206B53d3e76C88Da58790f7fe9A45b373"
      values.precrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.token:
-        "0x92CC36D66e9d739D50673d1f27929a371FB83a67"
+        "eth:0x92CC36D66e9d739D50673d1f27929a371FB83a67"
      implementationNames.0x92CC36D66e9d739D50673d1f27929a371FB83a67:
-        "WagmiToken"
      implementationNames.eth:0x92CC36D66e9d739D50673d1f27929a371FB83a67:
+        "WagmiToken"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      address:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
+        "eth:0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      values.owner:
-        "0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8"
+        "eth:0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8"
      implementationNames.0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8:
-        "ProxyAdmin"
      implementationNames.eth:0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8:
+        "ProxyAdmin"
    }
```

```diff
    contract DVN (0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5) {
    +++ description: None
      address:
-        "0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"
+        "eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"
      values.priceFeed:
-        "0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
+        "eth:0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
      values.workerFeeLib:
-        "0xa7b5189bcA84Cd304D8553977c7C614329750d99"
+        "eth:0xa7b5189bcA84Cd304D8553977c7C614329750d99"
      implementationNames.0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5:
-        "DVN"
      implementationNames.eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5:
+        "DVN"
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      address:
-        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
+        "eth:0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
      values.owner:
-        "0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5"
+        "eth:0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5"
      implementationNames.0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9:
-        "ProxyAdmin"
      implementationNames.eth:0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xA7499Aa6464c078EeB940da2fc95C6aCd010c3Cc) {
    +++ description: None
      address:
-        "0xA7499Aa6464c078EeB940da2fc95C6aCd010c3Cc"
+        "eth:0xA7499Aa6464c078EeB940da2fc95C6aCd010c3Cc"
    }
```

```diff
    contract DVNFeeLib (0xa7b5189bcA84Cd304D8553977c7C614329750d99) {
    +++ description: None
      address:
-        "0xa7b5189bcA84Cd304D8553977c7C614329750d99"
+        "eth:0xa7b5189bcA84Cd304D8553977c7C614329750d99"
      values.owner:
-        "0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6"
+        "eth:0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6"
      implementationNames.0xa7b5189bcA84Cd304D8553977c7C614329750d99:
-        "DVNFeeLib"
      implementationNames.eth:0xa7b5189bcA84Cd304D8553977c7C614329750d99:
+        "DVNFeeLib"
    }
```

```diff
    EOA  (0xAC0248e9C78774bA0ef9E71B1Ce1393a10C17E3C) {
    +++ description: None
      address:
-        "0xAC0248e9C78774bA0ef9E71B1Ce1393a10C17E3C"
+        "eth:0xAC0248e9C78774bA0ef9E71B1Ce1393a10C17E3C"
    }
```

```diff
    contract Stargate Token (0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6) {
    +++ description: None
      address:
-        "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6"
+        "eth:0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6"
      values.endpoint:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.owner:
-        "0x65bb797c2B9830d891D87288F029ed8dACc19705"
+        "eth:0x65bb797c2B9830d891D87288F029ed8dACc19705"
      implementationNames.0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6:
-        "StargateToken"
      implementationNames.eth:0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6:
+        "StargateToken"
    }
```

```diff
    contract BobaEscrow2 (0xB0003eB166654f7e57c0463F8D1a438eB238c490) {
    +++ description: None
      address:
-        "0xB0003eB166654f7e57c0463F8D1a438eB238c490"
+        "eth:0xB0003eB166654f7e57c0463F8D1a438eB238c490"
      implementationNames.0xB0003eB166654f7e57c0463F8D1a438eB238c490:
-        "Lib_ResolvedDelegateProxy"
      implementationNames.eth:0xB0003eB166654f7e57c0463F8D1a438eB238c490:
+        "Lib_ResolvedDelegateProxy"
    }
```

```diff
    EOA  (0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6) {
    +++ description: None
      address:
-        "0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6"
+        "eth:0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6"
    }
```

```diff
    EOA  (0xB9d9BBB9087eE8996Ce24970a3a50924581291FF) {
    +++ description: None
      address:
-        "0xB9d9BBB9087eE8996Ce24970a3a50924581291FF"
+        "eth:0xB9d9BBB9087eE8996Ce24970a3a50924581291FF"
    }
```

```diff
    contract LayerZero Multisig (0xBe010A7e3686FdF65E93344ab664D065A0B02478) {
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
      address:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      values.$members.0:
-        "0x0cb72C1F6a36c225A7E2B21712E8853A4A1acc47"
+        "eth:0x0cb72C1F6a36c225A7E2B21712E8853A4A1acc47"
      values.$members.1:
-        "0x5bC6AA6ad117A8B50ABf9E1658971f5DA1968c5c"
+        "eth:0x5bC6AA6ad117A8B50ABf9E1658971f5DA1968c5c"
      values.$members.2:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "eth:0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.3:
-        "0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
+        "eth:0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
      values.$members.4:
-        "0xe67DB04d7eFF4e9ec282eD929632D4FF058112d7"
+        "eth:0xe67DB04d7eFF4e9ec282eD929632D4FF058112d7"
      values.getExecutors.0:
-        "0x39f86ECef62c5bcE23428d6b7c7050D9Ecb0e346"
+        "eth:0x39f86ECef62c5bcE23428d6b7c7050D9Ecb0e346"
      implementationNames.0xBe010A7e3686FdF65E93344ab664D065A0B02478:
-        "OneSig"
      implementationNames.eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478:
+        "OneSig"
    }
```

```diff
    contract Google Cloud Oracle (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      address:
-        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
+        "eth:0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.priceFeed:
-        "0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
+        "eth:0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
      values.workerFeeLib:
-        "0xdeA04ef31C4B4FDf31CB58923F37869739280d49"
+        "eth:0xdeA04ef31C4B4FDf31CB58923F37869739280d49"
      implementationNames.0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc:
-        "VerifierNetwork"
      implementationNames.eth:0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc:
+        "VerifierNetwork"
    }
```

```diff
    contract GnosisSafe (0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8) {
    +++ description: None
      address:
-        "0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8"
+        "eth:0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xA7499Aa6464c078EeB940da2fc95C6aCd010c3Cc"
+        "eth:0xA7499Aa6464c078EeB940da2fc95C6aCd010c3Cc"
      values.$members.1:
-        "0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1"
+        "eth:0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1"
      values.$members.2:
-        "0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
+        "eth:0x0D61C8b6CA9669A36F351De3AE335e9689dd9C5b"
      values.$members.3:
-        "0x8f02b4a44Eacd9b8eE7739aa0BA58833DD45d002"
+        "eth:0x8f02b4a44Eacd9b8eE7739aa0BA58833DD45d002"
      values.$members.4:
-        "0x34Eb88EAD486A09CAcD8DaBe013682Dc5F1DC41D"
+        "eth:0x34Eb88EAD486A09CAcD8DaBe013682Dc5F1DC41D"
      values.$members.5:
-        "0xf8b3b2aE2C97799249874A32f033b931e59fc349"
+        "eth:0xf8b3b2aE2C97799249874A32f033b931e59fc349"
      implementationNames.0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      address:
-        "0xdeA04ef31C4B4FDf31CB58923F37869739280d49"
+        "eth:0xdeA04ef31C4B4FDf31CB58923F37869739280d49"
      implementationNames.0xdeA04ef31C4B4FDf31CB58923F37869739280d49:
-        "VerifierFeeLib"
      implementationNames.eth:0xdeA04ef31C4B4FDf31CB58923F37869739280d49:
+        "VerifierFeeLib"
    }
```

```diff
    EOA  (0xe67DB04d7eFF4e9ec282eD929632D4FF058112d7) {
    +++ description: None
      address:
-        "0xe67DB04d7eFF4e9ec282eD929632D4FF058112d7"
+        "eth:0xe67DB04d7eFF4e9ec282eD929632D4FF058112d7"
    }
```

```diff
    contract GnosisSafe (0xe9Fb0C2206B53d3e76C88Da58790f7fe9A45b373) {
    +++ description: None
      address:
-        "0xe9Fb0C2206B53d3e76C88Da58790f7fe9A45b373"
+        "eth:0xe9Fb0C2206B53d3e76C88Da58790f7fe9A45b373"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x3205aFb074BECbEaB6D13Ef835b48789EbfAB60c"
+        "eth:0x3205aFb074BECbEaB6D13Ef835b48789EbfAB60c"
      values.$members.1:
-        "0xB9d9BBB9087eE8996Ce24970a3a50924581291FF"
+        "eth:0xB9d9BBB9087eE8996Ce24970a3a50924581291FF"
      values.$members.2:
-        "0x8A7f7C5b556B1298a74c0e89df46Eba117A2F6c1"
+        "eth:0x8A7f7C5b556B1298a74c0e89df46Eba117A2F6c1"
      values.$members.3:
-        "0x3c1Cb7D4c0ce0dc72eDc7Ea06acC866e62a8f1d8"
+        "eth:0x3c1Cb7D4c0ce0dc72eDc7Ea06acC866e62a8f1d8"
      implementationNames.0xe9Fb0C2206B53d3e76C88Da58790f7fe9A45b373:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xe9Fb0C2206B53d3e76C88Da58790f7fe9A45b373:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract LinkEscrow (0xEe381e476b4335B8584A2026f3E845edaC2c69de) {
    +++ description: None
      address:
-        "0xEe381e476b4335B8584A2026f3E845edaC2c69de"
+        "eth:0xEe381e476b4335B8584A2026f3E845edaC2c69de"
      values.lzEndpoint:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.owner:
-        "0x19565F4771843467aAD632d6B56c75396785b06C"
+        "eth:0x19565F4771843467aAD632d6B56c75396785b06C"
      values.precrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.token:
-        "0x514910771AF9Ca656af840dff83E8264EcF986CA"
+        "eth:0x514910771AF9Ca656af840dff83E8264EcF986CA"
      implementationNames.0xEe381e476b4335B8584A2026f3E845edaC2c69de:
-        "ProxyERC20"
      implementationNames.eth:0xEe381e476b4335B8584A2026f3E845edaC2c69de:
+        "ProxyERC20"
    }
```

```diff
    EOA  (0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0) {
    +++ description: None
      address:
-        "0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"
+        "eth:0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"
    }
```

```diff
    EOA  (0xf8b3b2aE2C97799249874A32f033b931e59fc349) {
    +++ description: None
      address:
-        "0xf8b3b2aE2C97799249874A32f033b931e59fc349"
+        "eth:0xf8b3b2aE2C97799249874A32f033b931e59fc349"
    }
```

```diff
+   Status: CREATED
    contract FPValidator (0x07245eEa05826F5984c7c3C8F478b04892e4df89)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x19565F4771843467aAD632d6B56c75396785b06C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BobaEscrow1 (0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UsdcEscrow (0x4F52b41a778761bd2EEa5b7b7ed8cBDAA02cEF3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EuraEscrow (0x4Fa745FCCC04555F2AFA8874cd23961636CdF982)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x65bb797c2B9830d891D87288F029ed8dACc19705)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x6BD792911F4B3714E88FbDf32B351632e7d22c70)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BobaEscrow3 (0x6F537839714761388B6d7ED61Bc09579d5dA2F41)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StoneEscrow (0x7122985656e38BDC0302Db86685bb972b145bD3C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WagmiEscrow (0x92CC36D66e9d739D50673d1f27929a371FB83a67)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DVN (0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DVNFeeLib (0xa7b5189bcA84Cd304D8553977c7C614329750d99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Stargate Token (0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BobaEscrow2 (0xB0003eB166654f7e57c0463F8D1a438eB238c490)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Multisig (0xBe010A7e3686FdF65E93344ab664D065A0B02478)
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
```

```diff
+   Status: CREATED
    contract Google Cloud Oracle (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xe9Fb0C2206B53d3e76C88Da58790f7fe9A45b373)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LinkEscrow (0xEe381e476b4335B8584A2026f3E845edaC2c69de)
    +++ description: None
```

Generated with discovered.json: 0x7aad6d28a62fba104e052ba794751543edff44bc

# Diff at Wed, 09 Jul 2025 15:13:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d05d4ec9af28b2df4e687d7b7676cddffcae6887 block: 22824232
- current block number: 22882445

## Description

Update LZ Multisig to a custom multisig contract that allows offchain signing with multichain onchain execution.

## Watched changes

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      values.owner:
-        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
+        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      values.owner:
-        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
+        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
    }
```

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      values.owner:
-        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
+        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
    }
```

```diff
-   Status: DELETED
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Multisig (0xBe010A7e3686FdF65E93344ab664D065A0B02478)
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
```

## Source code changes

```diff
.../LayerZero Multisig/GnosisSafe.sol => /dev/null |  953 -------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../ethereum/.flat/LayerZero Multisig.sol          | 1396 ++++++++++++++++++++
 3 files changed, 1396 insertions(+), 988 deletions(-)
```

Generated with discovered.json: 0x70b28918e9981910ba86532dfa0cc69d54649a9f

# Diff at Fri, 04 Jul 2025 12:19:08 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22824232
- current block number: 22824232

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22824232 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x4Fa745FCCC04555F2AFA8874cd23961636CdF982"
+        "eth:0x4Fa745FCCC04555F2AFA8874cd23961636CdF982"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034"
+        "eth:0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034"
      receivedPermissions.1.from:
-        "ethereum:0x5a54fe5234E811466D5366846283323c954310B2"
+        "eth:0x5a54fe5234E811466D5366846283323c954310B2"
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
+        "eth:0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
      receivedPermissions.1.from:
-        "ethereum:0x902F09715B6303d4173037652FA7377e5b98089E"
+        "eth:0x902F09715B6303d4173037652FA7377e5b98089E"
    }
```

Generated with discovered.json: 0x957e8da9e671b7cfdf1d6f270a5fa3770f8b3d4b

# Diff at Tue, 01 Jul 2025 11:56:42 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@835b5bf291c209782da0924189d08305334497d4 block: 22567714
- current block number: 22824232

## Description

add one signer to the LZ v1 DVN (quorum still 1).

## Watched changes

```diff
    contract DVN (0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5) {
    +++ description: None
      values.signerSize:
-        3
+        4
    }
```

Generated with discovered.json: 0x4ca0e4d3b0e5a52e5fe650e54226de379750d1d0

# Diff at Mon, 26 May 2025 15:00:00 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 21995383
- current block number: 22567714

## Description

common dvn fee lib verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995383 (main branch discovery), not current.

```diff
    contract DVNFeeLib (0xa7b5189bcA84Cd304D8553977c7C614329750d99) {
    +++ description: None
      name:
-        ""
+        "DVNFeeLib"
      unverified:
-        true
      values.owner:
+        "0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6"
      implementationNames.0xa7b5189bcA84Cd304D8553977c7C614329750d99:
-        ""
+        "DVNFeeLib"
      sourceHashes:
+        ["0x6ec0f4e740bc8ed51419c1f4c51da9549aaa3185e6ecc9e613470b90854e4830"]
    }
```

Generated with discovered.json: 0x0157b2205d2e7e3473003cec4ce1a5c129a86e9d

# Diff at Fri, 23 May 2025 09:40:59 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21995383
- current block number: 21995383

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995383 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x9d5f83996871c648f4bf97820515251a7cc59e35

# Diff at Tue, 29 Apr 2025 08:19:06 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21995383
- current block number: 21995383

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995383 (main branch discovery), not current.

```diff
    contract  (0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","via":[]}]
    }
```

```diff
    contract EuraEscrow (0x4Fa745FCCC04555F2AFA8874cd23961636CdF982) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b","via":[]}]
    }
```

```diff
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","via":[]}]
    }
```

```diff
    contract  (0x6BD792911F4B3714E88FbDf32B351632e7d22c70) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9","via":[]}]
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9","via":[]}]
    }
```

Generated with discovered.json: 0x8b50199d6444a9f9b2263b1b66757575f4023271

# Diff at Fri, 07 Mar 2025 13:45:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 21723814
- current block number: 21995383

## Description

DVN / Verifier for ZKsync Era added.

## Watched changes

```diff
+   Status: CREATED
    contract DVN (0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xa7b5189bcA84Cd304D8553977c7C614329750d99)
    +++ description: None
```

## Source code changes

```diff
.../lzomnichain/ethereum/.flat/DVN.sol             | 2116 ++++++++++++++++++++
 1 file changed, 2116 insertions(+)
```

Generated with discovered.json: 0x563d1c3b6a1e7b96711ecf73b11827c2d3f7ae58

# Diff at Tue, 04 Mar 2025 10:39:24 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21723814
- current block number: 21723814

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723814 (main branch discovery), not current.

```diff
    contract FPValidator (0x07245eEa05826F5984c7c3C8F478b04892e4df89) {
    +++ description: None
      sinceBlock:
+        15757967
    }
```

```diff
    contract GnosisSafe (0x19565F4771843467aAD632d6B56c75396785b06C) {
    +++ description: None
      sinceBlock:
+        16363222
    }
```

```diff
    contract BobaEscrow1 (0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55) {
    +++ description: None
      sinceBlock:
+        15522081
    }
```

```diff
    contract ProxyAdmin (0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b) {
    +++ description: None
      sinceBlock:
+        13472909
    }
```

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      sinceBlock:
+        15416287
    }
```

```diff
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859) {
    +++ description: None
      sinceBlock:
+        15416264
    }
```

```diff
    contract  (0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034) {
    +++ description: None
      sinceBlock:
+        16050867
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      sinceBlock:
+        15416271
    }
```

```diff
    contract UsdcEscrow (0x4F52b41a778761bd2EEa5b7b7ed8cBDAA02cEF3E) {
    +++ description: None
      sinceBlock:
+        15719673
    }
```

```diff
    contract EuraEscrow (0x4Fa745FCCC04555F2AFA8874cd23961636CdF982) {
    +++ description: None
      sinceBlock:
+        15133087
    }
```

```diff
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      sinceBlock:
+        15416736
    }
```

```diff
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068) {
    +++ description: None
      sinceBlock:
+        15398311
    }
```

```diff
    contract GnosisSafe (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      sinceBlock:
+        14402408
    }
```

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      sinceBlock:
+        14388880
    }
```

```diff
    contract  (0x6BD792911F4B3714E88FbDf32B351632e7d22c70) {
    +++ description: None
      sinceBlock:
+        16050424
    }
```

```diff
    contract BobaEscrow3 (0x6F537839714761388B6d7ED61Bc09579d5dA2F41) {
    +++ description: None
      sinceBlock:
+        15372766
    }
```

```diff
    contract StoneEscrow (0x7122985656e38BDC0302Db86685bb972b145bD3C) {
    +++ description: None
      sinceBlock:
+        18203782
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      sinceBlock:
+        15416448
    }
```

```diff
    contract WagmiEscrow (0x92CC36D66e9d739D50673d1f27929a371FB83a67) {
    +++ description: None
      sinceBlock:
+        17621321
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      sinceBlock:
+        15410443
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      sinceBlock:
+        14388905
    }
```

```diff
    contract Stargate Token (0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6) {
    +++ description: None
      sinceBlock:
+        14402855
    }
```

```diff
    contract BobaEscrow2 (0xB0003eB166654f7e57c0463F8D1a438eB238c490) {
    +++ description: None
      sinceBlock:
+        15435468
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      sinceBlock:
+        14457816
    }
```

```diff
    contract Google Cloud Oracle (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sinceBlock:
+        18095084
    }
```

```diff
    contract GnosisSafe (0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8) {
    +++ description: None
      sinceBlock:
+        13931946
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sinceBlock:
+        18095085
    }
```

```diff
    contract GnosisSafe (0xe9Fb0C2206B53d3e76C88Da58790f7fe9A45b373) {
    +++ description: None
      sinceBlock:
+        13398698
    }
```

```diff
    contract LinkEscrow (0xEe381e476b4335B8584A2026f3E845edaC2c69de) {
    +++ description: None
      sinceBlock:
+        15584943
    }
```

Generated with discovered.json: 0x05da60f726ccbb7d82985cabfaef1547144b915b

# Diff at Tue, 28 Jan 2025 15:08:02 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 21465397
- current block number: 21723814

## Description

LayerZero MS update: members swapped and new member added (now 3/5).

## Watched changes

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      values.$members.4:
+        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.3:
-        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
+        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
      values.$members.2:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
      values.$members.1:
-        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
+        "0x112c737AeEbD2E52DEb9ff5c9c19497F1A1777b0"
      values.$members.0:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0xB981a2664f5f547291Df5F8dCD4505f7015912CF"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x2b12cd4ffa330aa40eb1e438a58a3298877a892f

# Diff at Mon, 20 Jan 2025 11:09:43 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21465397
- current block number: 21465397

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465397 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x4Fa745FCCC04555F2AFA8874cd23961636CdF982"
      receivedPermissions.0.from:
+        "0x4Fa745FCCC04555F2AFA8874cd23961636CdF982"
    }
```

```diff
    contract  (0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      issuedPermissions.0.to:
+        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
    }
```

```diff
    contract EuraEscrow (0x4Fa745FCCC04555F2AFA8874cd23961636CdF982) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b"
      issuedPermissions.0.to:
+        "0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b"
    }
```

```diff
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      issuedPermissions.0.to:
+        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
    }
```

```diff
    contract  (0x6BD792911F4B3714E88FbDf32B351632e7d22c70) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
      issuedPermissions.0.to:
+        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
      issuedPermissions.0.to:
+        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
      receivedPermissions.1.from:
+        "0x5a54fe5234E811466D5366846283323c954310B2"
      receivedPermissions.0.target:
-        "0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034"
      receivedPermissions.0.from:
+        "0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034"
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x902F09715B6303d4173037652FA7377e5b98089E"
      receivedPermissions.1.from:
+        "0x902F09715B6303d4173037652FA7377e5b98089E"
      receivedPermissions.0.target:
-        "0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
      receivedPermissions.0.from:
+        "0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
    }
```

Generated with discovered.json: 0x410eb4f6436db82029982f1794ec6bc6a83bb320

# Diff at Thu, 12 Dec 2024 18:08:36 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21041947
- current block number: 21388117

## Description

Ignoring not needed escrow values. Multisig member change.

## Watched changes

```diff
    contract GnosisSafe (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      values.$members.4:
-        "0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4"
+        "0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326"
    }
```

Generated with discovered.json: 0x4481d66b3b2a8e9bc49fb1b508992c43956e02ce

# Diff at Tue, 10 Dec 2024 11:30:40 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21041947
- current block number: 21041947

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041947 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract GnosisSafe (0x19565F4771843467aAD632d6B56c75396785b06C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BobaEscrow1 (0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UsdcEscrow (0x4F52b41a778761bd2EEa5b7b7ed8cBDAA02cEF3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EuraEscrow (0x4Fa745FCCC04555F2AFA8874cd23961636CdF982)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x65bb797c2B9830d891D87288F029ed8dACc19705)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BobaEscrow3 (0x6F537839714761388B6d7ED61Bc09579d5dA2F41)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StoneEscrow (0x7122985656e38BDC0302Db86685bb972b145bD3C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WagmiEscrow (0x92CC36D66e9d739D50673d1f27929a371FB83a67)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Stargate Token (0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BobaEscrow2 (0xB0003eB166654f7e57c0463F8D1a438eB238c490)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xe9Fb0C2206B53d3e76C88Da58790f7fe9A45b373)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LinkEscrow (0xEe381e476b4335B8584A2026f3E845edaC2c69de)
    +++ description: None
```

Generated with discovered.json: 0x461b7ab44573856f6462740311f04b5bb9800026

# Diff at Fri, 25 Oct 2024 10:11:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20240876
- current block number: 21041947

## Description

Signer change.

## Watched changes

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      values.$members.4:
-        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
      values.$members.3:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
      values.$members.2:
-        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
+        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.1:
-        "0xe095F2590eF1Ab39601445025847Ed8E4B40D687"
+        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x41805171699b025416485d2cfc592ad2b664f9e9

# Diff at Mon, 21 Oct 2024 11:07:30 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20240876
- current block number: 20240876

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240876 (main branch discovery), not current.

```diff
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"]
      values.$pastUpgrades.1.1:
-        ["0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"]
+        "0x9b7aa9602e9b7c0835daf01b281300d8ca0a51e42942ab9bda92104e05b118c5"
      values.$pastUpgrades.0.2:
+        ["0xccEf13cFEB6873c167f62A365548A57C9ed29DC5"]
      values.$pastUpgrades.0.1:
-        ["0xccEf13cFEB6873c167f62A365548A57C9ed29DC5"]
+        "0x552bd37cf291bcc16f62985e1c87e65f26e063eefbbbbf0c7874517af2356d59"
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"]
      values.$pastUpgrades.5.1:
-        ["0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"]
+        "0x73b24db83de84a82dae12cc42405822b258a762a7c18206498f869be5d676866"
      values.$pastUpgrades.4.2:
+        ["0x8775e9D584008f84daFe7abe75a62f6C91491027"]
      values.$pastUpgrades.4.1:
-        ["0x8775e9D584008f84daFe7abe75a62f6C91491027"]
+        "0x432c0e623817af575b5382c38b9bd117f34da874f0f4c9a3f170e74d6a71cd8f"
      values.$pastUpgrades.3.2:
+        ["0xaF34771b16960ea77484A866a34CCDAFDc913D9C"]
      values.$pastUpgrades.3.1:
-        ["0xaF34771b16960ea77484A866a34CCDAFDc913D9C"]
+        "0x26f56a3da2382a89bead8d00ea9e93ed15f4fd83627a31c5721dcebe690a1f73"
      values.$pastUpgrades.2.2:
+        ["0x9512a85438606dEdE54297634dEd7C7C0c231874"]
      values.$pastUpgrades.2.1:
-        ["0x9512a85438606dEdE54297634dEd7C7C0c231874"]
+        "0x1605419ac94c967804d0d4c2b809620b593fea2c47f3fc2f3f2a8cf677da7551"
      values.$pastUpgrades.1.2:
+        ["0xDD55F55CB9a39EF1eed4Ee1a84EE1b7411bE306a"]
      values.$pastUpgrades.1.1:
-        ["0xDD55F55CB9a39EF1eed4Ee1a84EE1b7411bE306a"]
+        "0x368b49a019b69220edb9dfcedf34c3b9354a56bed285e21b897e8523237270c9"
      values.$pastUpgrades.0.2:
+        ["0x4E341b9Cf90514A5b7dfec2c9A1f20AA4514C260"]
      values.$pastUpgrades.0.1:
-        ["0x4E341b9Cf90514A5b7dfec2c9A1f20AA4514C260"]
+        "0x665e97daa183fb3d57ee6aac0438d555feeeb570b782e03e7b972919aa57212f"
    }
```

Generated with discovered.json: 0x7d2b2d2307f32190c145f7fbd063f98e3ca503b9

# Diff at Mon, 14 Oct 2024 10:52:46 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20240876
- current block number: 20240876

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240876 (main branch discovery), not current.

```diff
    contract FPValidator (0x07245eEa05826F5984c7c3C8F478b04892e4df89) {
    +++ description: None
      sourceHashes:
+        ["0x0d505ac1b08cd930c4b902daa632eaa029531d5c1aa50c45169b63c310b2da62"]
    }
```

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      sourceHashes:
+        ["0x8b908351f18fdaeaf600ae46ef1450c535f741fc95bb25acade77f8b59fdc168"]
    }
```

```diff
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859) {
    +++ description: None
      sourceHashes:
+        ["0x965651ae50a316c3ab842d2c8c9242c34d6e40eefa61f7c731bba9a1faf2ccea"]
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      sourceHashes:
+        ["0x38c85ab54f670eaa1fc2b351aee39913bc12e2b26c460ee31cf89d3f1f7d59b9"]
    }
```

```diff
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068) {
    +++ description: None
      sourceHashes:
+        ["0x895867397d61409de8476975bae4d871fec1c289e52fe97b31872726808dae38"]
    }
```

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      sourceHashes:
+        ["0x945c3299d0cf62b9ea7a77d6328295d54327299d6a153e1e7b48d85fa9b77215"]
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      sourceHashes:
+        ["0xeb95d39e1b35f76b6331da863f87bf2e148dd21abf5666590443b65f6a125630"]
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      sourceHashes:
+        ["0xeb95d39e1b35f76b6331da863f87bf2e148dd21abf5666590443b65f6a125630"]
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Google Cloud Oracle (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sourceHashes:
+        ["0x1be31a02ca7158d467a49eeb964f0f8aa1d1e74019df854c1881d89d51260701"]
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sourceHashes:
+        ["0x37e1cee9d0a4ad6ebb439d27dbbf23925fcd9f9c0d5b43a33a6335e62b54d18c"]
    }
```

Generated with discovered.json: 0x709d038c6ca7491e6240bf5c938c0167150929dd

# Diff at Tue, 01 Oct 2024 10:52:25 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20240876
- current block number: 20240876

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240876 (main branch discovery), not current.

```diff
    contract  (0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-02-08T19:58:23.000Z",["0xccEf13cFEB6873c167f62A365548A57C9ed29DC5"]],["2023-04-27T02:38:47.000Z",["0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"]]]
    }
```

```diff
    contract  (0x6BD792911F4B3714E88FbDf32B351632e7d22c70) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-11-21T22:41:47.000Z",["0x4E341b9Cf90514A5b7dfec2c9A1f20AA4514C260"]],["2023-02-03T23:06:47.000Z",["0xDD55F55CB9a39EF1eed4Ee1a84EE1b7411bE306a"]],["2023-04-23T04:37:11.000Z",["0x9512a85438606dEdE54297634dEd7C7C0c231874"]],["2023-06-26T23:20:23.000Z",["0xaF34771b16960ea77484A866a34CCDAFDc913D9C"]],["2023-09-20T19:37:35.000Z",["0x8775e9D584008f84daFe7abe75a62f6C91491027"]],["2023-09-22T14:15:59.000Z",["0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"]]]
    }
```

Generated with discovered.json: 0x16abf8d382c8b10a78fe11288882b102a7aa52cc

# Diff at Fri, 30 Aug 2024 07:53:35 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20240876
- current block number: 20240876

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240876 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xbd36d8b3d06a28ea5000ddc93956324414aefe42

# Diff at Fri, 23 Aug 2024 09:53:11 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20240876
- current block number: 20240876

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240876 (main branch discovery), not current.

```diff
    contract  (0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract  (0x6BD792911F4B3714E88FbDf32B351632e7d22c70) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

Generated with discovered.json: 0x7c01f2d993443a5fa5610e6d3a7e5bb66f860eba

# Diff at Wed, 21 Aug 2024 10:03:56 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20240876
- current block number: 20240876

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240876 (main branch discovery), not current.

```diff
    contract  (0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","via":[]}]
    }
```

```diff
    contract TSS Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","via":[]}]
    }
```

```diff
    contract  (0x6BD792911F4B3714E88FbDf32B351632e7d22c70) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9","via":[]}]
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034","0x5a54fe5234E811466D5366846283323c954310B2"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034","via":[]},{"permission":"upgrade","target":"0x5a54fe5234E811466D5366846283323c954310B2","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x6BD792911F4B3714E88FbDf32B351632e7d22c70","0x902F09715B6303d4173037652FA7377e5b98089E"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x6BD792911F4B3714E88FbDf32B351632e7d22c70","via":[]},{"permission":"upgrade","target":"0x902F09715B6303d4173037652FA7377e5b98089E","via":[]}]
    }
```

Generated with discovered.json: 0xf4d19db2374533a1cf361613897f876cdf990cde

# Diff at Fri, 09 Aug 2024 12:00:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20240876
- current block number: 20240876

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240876 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
+        "0x902F09715B6303d4173037652FA7377e5b98089E"
      assignedPermissions.upgrade.0:
-        "0x902F09715B6303d4173037652FA7377e5b98089E"
+        "0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
    }
```

Generated with discovered.json: 0x17df32ebab05c5ede0291d88fd38cf78b50634ff

# Diff at Fri, 09 Aug 2024 10:10:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20240876
- current block number: 20240876

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240876 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034","0x5a54fe5234E811466D5366846283323c954310B2"]
      assignedPermissions.upgrade:
+        ["0x4Bc7eDc45dF6F225a67680Bc2345fa9B516Aa034","0x5a54fe5234E811466D5366846283323c954310B2"]
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x6BD792911F4B3714E88FbDf32B351632e7d22c70","0x902F09715B6303d4173037652FA7377e5b98089E"]
      assignedPermissions.upgrade:
+        ["0x902F09715B6303d4173037652FA7377e5b98089E","0x6BD792911F4B3714E88FbDf32B351632e7d22c70"]
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0xb9d37feb31e1e672c5b7bd8379dcef6615da5818

# Diff at Fri, 05 Jul 2024 14:23:52 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@111fee0655d72e75c60324b920975e421fd852f7 block: 20182032
- current block number: 20240876

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20182032 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x9bfAc7947FC1b64aA9F12b24EcD519DaEcEf3Ba5)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113)
    +++ description: None
```

Generated with discovered.json: 0x34d9396a3bcf50e098b21165ae5389dc533447d3

# Diff at Wed, 03 Apr 2024 10:34:18 GMT:

- chain: ethereum
- author: maciekop (<maciej.opala@l2beat.com>)
- comparing to: main@34d9eb99e785ccac44323b84405d78f9783b5cc2 block: 19538717
- current block number: 19574671

## Description

Rediscovery with new field added (upgradeability.threshold)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19538717 (main branch discovery), not current.

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0xf2d39df396b183b3610044e7bb5141e027e860a2

# Diff at Thu, 14 Mar 2024 13:13:44 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3ffa91064379f34a2916a1ad4e93791b752e7e9e block: 19375406
- current block number: 19433467

## Description

New PriceFeed Oracle implementation has been deployed. Nothing that would affect protocol security has been changed.

## Watched changes

```diff
    contract  (0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113) {
    +++ description: None
      upgradeability.implementation:
-        "0xF641db6860FD5f6643D05bD75405a2586a63a141"
+        "0x13dff8847EA170eBb8439ce732c0A14Bb49fDd92"
      implementations.0:
-        "0xF641db6860FD5f6643D05bD75405a2586a63a141"
+        "0x13dff8847EA170eBb8439ce732c0A14Bb49fDd92"
    }
```

## Source code changes

```diff
.../-0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113/implementation/meta.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0xda3cc4720e1c29605c8d6d14ab6edbc84189ed92

# Diff at Wed, 06 Mar 2024 10:03:37 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@1a2512004b35590384683b93c95d8ec95426d2a6 block: 19063596
- current block number: 19375406

## Description

Added v2 contracts to libraryLookup

## Watched changes

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      values.latestVersion:
-        3
+        5
      values.libraryLookup[4]:
+        "0x245B6e8FFE9ea5Fc301e32d16F66bD4C2123eEfC"
      values.libraryLookup[3]:
+        "0xD231084BfB234C107D3eE2b22F97F3346fDAF705"
    }
```

```diff
    contract Google Cloud Oracle (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      values.defaultMultiplierBps:
-        12000
+        12100
    }
```

Generated with discovered.json: 0xebc82979bda498ab81875303e9baa1a185f9b2db

# Diff at Mon, 22 Jan 2024 16:58:34 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@f58cc44bf923844f52038487bcd5a563329f4b43 block: 18941390
- current block number: 19063596

## Description

Default lib switched to FPValidator.
New path-ways added.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap.234:
+        20
      values.defaultAdapterParams.234:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.101.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.101.outboundProofType:
-        1
+        2
      values.defaultAppConfig.102.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.102.outboundProofType:
-        1
+        2
      values.defaultAppConfig.106.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.106.outboundProofType:
-        1
+        2
      values.defaultAppConfig.109.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.109.outboundProofType:
-        1
+        2
      values.defaultAppConfig.110.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.110.outboundProofType:
-        1
+        2
      values.defaultAppConfig.111.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.111.outboundProofType:
-        1
+        2
      values.defaultAppConfig.112.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.112.outboundProofType:
-        1
+        2
      values.defaultAppConfig.115.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.115.outboundProofType:
-        1
+        2
      values.defaultAppConfig.116.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.116.outboundProofType:
-        1
+        2
      values.defaultAppConfig.126.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.126.outboundProofType:
-        1
+        2
      values.defaultAppConfig.234:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.inboundProofLibrary.234:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.supportedOutboundProof.234:
+        2
      values.ulnLookup.234:
+        "0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981"
    }
```

# Diff at Fri, 05 Jan 2024 13:32:55 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@9b1911b38ffdc811ae8c1518aae762bfe4831370 block: 18671199
- current block number: 18941390

## Description

Removed the INBOUND_PROOF_LIBRARIES for a more detailed field.

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18671199 (main branch discovery), not current.

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.INBOUND_PROOF_LIBRARIES:
-        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
    }
```

```diff
-   Status: DELETED
    contract Stargate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    }
```

```diff
-   Status: DELETED
    contract StargateToken (0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6) {
    }
```

```diff
+   Status: CREATED
    contract FPValidator (0x07245eEa05826F5984c7c3C8F478b04892e4df89) {
    }
```

```diff
+   Status: CREATED
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859) {
    }
```

# Diff at Tue, 28 Nov 2023 16:07:09 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@049dc0679d8762dc52199c99e9e62ba7cb396a7b

## Description

New remote chains added: 217, 218, 230. One of the owners in the Stargate Multisig has changed.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap.217:
+        20
      values.chainAddressSizeMap.218:
+        20
      values.chainAddressSizeMap.230:
+        20
      values.defaultAdapterParams.217:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.218:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.230:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.217:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.218:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.230:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.inboundProofLibrary.217:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.218:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.230:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.supportedOutboundProof.217:
+        [1,2]
      values.supportedOutboundProof.218:
+        [1,2]
      values.supportedOutboundProof.230:
+        2
      values.ulnLookup.217:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.218:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.230:
+        "0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981"
    }
```

```diff
    contract Stargate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
      values.getOwners.2:
-        "0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1"
+        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
      values.getOwners.1:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
      values.getOwners.0:
-        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
+        "0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
    }
```

# Diff at Tue, 07 Nov 2023 10:45:37 GMT:

- chain: ethereum
- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@1272f95e37268203d1aa19a319b3dff48af9c73c

## Description

### Changes to config

Added a `relayer` field in `defaultAppConfig` in `UltraLightNodeV2`. Added several new remote chains.

### Changes on contracts

New Oracle has been added. Several new remote chains have been added. Default oracle for some remote chains has been changed to the new oracle.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap.148:
+        20
      values.chainAddressSizeMap.182:
+        20
      values.chainAddressSizeMap.210:
+        20
      values.chainAddressSizeMap.211:
+        20
      values.chainAddressSizeMap.212:
+        20
      values.chainAddressSizeMap.213:
+        20
      values.chainAddressSizeMap.214:
+        20
      values.chainAddressSizeMap.215:
+        20
      values.chainAddressSizeMap.216:
+        20
      values.defaultAdapterParams.148:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.182:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.210:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.211:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.212:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.213:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.214:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.215:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.216:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.101.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.102.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.106.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.109.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.110.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.111.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.112.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.116.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.125.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.126.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.145.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.175.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.183.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.184.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.148:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.182:
+        {"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.210:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.211:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.212:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.213:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.214:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.215:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.216:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.inboundProofLibrary.148:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.182:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.210:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.211:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.212:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.213:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.214:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.215:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.216:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.supportedOutboundProof.148:
+        2
      values.supportedOutboundProof.182:
+        2
      values.supportedOutboundProof.210:
+        [1,2]
      values.supportedOutboundProof.211:
+        [1,2]
      values.supportedOutboundProof.212:
+        [1,2]
      values.supportedOutboundProof.213:
+        [1,2]
      values.supportedOutboundProof.214:
+        [1,2]
      values.supportedOutboundProof.215:
+        [1,2]
      values.supportedOutboundProof.216:
+        [1,2]
      values.ulnLookup.148:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.182:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.210:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.211:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.212:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.213:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.214:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.215:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.216:
+        "0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098"
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
      upgradeability.implementation:
-        "0xaF34771b16960ea77484A866a34CCDAFDc913D9C"
+        "0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
      implementations.0:
-        "0xaF34771b16960ea77484A866a34CCDAFDc913D9C"
+        "0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
    }
```

```diff
+   Status: CREATED
    contract  (0x9bfAc7947FC1b64aA9F12b24EcD519DaEcEf3Ba5) {
    }
```

```diff
+   Status: CREATED
    contract  (0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113) {
    }
```

```diff
+   Status: CREATED
    contract Google Cloud Oracle (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    }
```

```diff
+   Status: CREATED
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    }
```

## Source code changes

```diff
.../contracts/MessagingStructs.sol                 |  25 +
 .../contracts/interfaces/ILayerZeroEndpointV2.sol  |  80 ++++
 .../contracts/interfaces/IMessageLib.sol           |  46 ++
 .../contracts/interfaces/IMessageLibManager.sol    |  73 +++
 .../contracts/interfaces/IMessagingChannel.sol     |  33 ++
 .../contracts/interfaces/IMessagingComposer.sol    |  19 +
 .../contracts/interfaces/IMessagingContext.sol     |   9 +
 .../lz-evm-protocol-v2/contracts/libs/Errors.sol   |  56 +++
 .../interfaces/ILayerZeroUltraLightNodeV2.sol      |  83 ++++
 .../contracts/access/AccessControl.sol             | 248 ++++++++++
 .../contracts/access/IAccessControl.sol            |  88 ++++
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 ++++
 .../@openzeppelin/contracts/security/Pausable.sol  | 105 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../@openzeppelin/contracts/utils/Strings.sol      |  85 ++++
 .../contracts/utils/cryptography/ECDSA.sol         | 217 +++++++++
 .../contracts/utils/introspection/ERC165.sol       |  29 ++
 .../contracts/utils/introspection/IERC165.sol      |  25 +
 .../@openzeppelin/contracts/utils/math/Math.sol    | 339 ++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/MessageLibBase.sol                   | 170 +++++++
 .../.code/Google Cloud Oracle/contracts/Worker.sol | 142 ++++++
 .../contracts/interfaces/ILayerZeroExecutor.sol    |  29 ++
 .../contracts/interfaces/ILayerZeroTreasury.sol    |   7 +
 .../contracts/interfaces/IWorker.sol               |  20 +
 .../Google Cloud Oracle/contracts/uln/MultiSig.sol |  78 ++++
 .../contracts/uln/VerifierNetwork.sol              | 346 ++++++++++++++
 .../uln/interfaces/ILayerZeroVerifier.sol          |  34 ++
 .../contracts/uln/interfaces/IUltraLightNode.sol   |  13 +
 .../contracts/uln/interfaces/IVerifier.sol         |  25 +
 .../contracts/uln/interfaces/IVerifierFeeLib.sol   |  28 ++
 .../ethereum/.code/Google Cloud Oracle/meta.txt    |   2 +
 .../LayerZero Relayer/implementation/meta.txt      |   2 +-
 .../contracts/libs/CalldataBytesLib.sol            |  58 +++
 .../lz-evm-protocol-v2/contracts/libs/Errors.sol   |  56 +++
 .../contracts/messagelib/libs/BitMaps.sol          |  24 +
 .../contracts/utils/introspection/ERC165.sol       |  29 ++
 .../contracts/utils/introspection/IERC165.sol      |  25 +
 .../contracts/interfaces/ILayerZeroPriceFeed.sol   |  57 +++
 .../contracts/interfaces/IWorker.sol               |  20 +
 .../contracts/uln/VerifierFeeLib.sol               | 137 ++++++
 .../uln/interfaces/ILayerZeroVerifier.sol          |  34 ++
 .../contracts/uln/interfaces/IVerifier.sol         |  25 +
 .../contracts/uln/interfaces/IVerifierFeeLib.sol   |  28 ++
 .../contracts/uln/libs/VerifierOptions.sol         | 177 +++++++
 .../ethereum/.code/VerifierFeeLib/meta.txt         |   2 +
 .../solidity-bytes-utils/contracts/BytesLib.sol    | 510 +++++++++++++++++++++
 .../implementation/meta.txt                        |   2 +-
 .../lzomnichain/ethereum/.code/meta.txt            |   2 +
 .../{.code@18163835 => .code}/proxy/meta.txt       |   2 +-
 .../openzeppelin/interfaces/draft-IERC1822.sol     |  20 +
 .../openzeppelin/proxy/ERC1967/ERC1967Proxy.sol    |  33 ++
 .../openzeppelin/proxy/ERC1967/ERC1967Upgrade.sol  | 182 ++++++++
 .../proxy/openzeppelin/proxy/Proxy.sol             |  37 +-
 .../proxy/openzeppelin/proxy/beacon/IBeacon.sol    |  16 +
 .../proxy/openzeppelin/utils/Address.sol           | 127 ++++-
 .../.code/proxy/openzeppelin/utils/StorageSlot.sol |  84 ++++
 .../proxy/OptimizedTransparentUpgradeableProxy.sol |  60 ++-
 58 files changed, 4278 insertions(+), 75 deletions(-)
```

