Generated with discovered.json: 0x139c50529ebd2f94061ad8d7223efed5d5e9b76c

# Diff at Mon, 14 Jul 2025 12:45:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22882451
- current block number: 22882451

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22882451 (main branch discovery), not current.

```diff
    EOA  (0x00F6D2b4B69Ce697f913Da16A9D73283dc4C78F2) {
    +++ description: None
      address:
-        "0x00F6D2b4B69Ce697f913Da16A9D73283dc4C78F2"
+        "eth:0x00F6D2b4B69Ce697f913Da16A9D73283dc4C78F2"
    }
```

```diff
    EOA  (0x016B9F17C65d55Fd3b6b7A8d112df1A7Ef73A1a2) {
    +++ description: None
      address:
-        "0x016B9F17C65d55Fd3b6b7A8d112df1A7Ef73A1a2"
+        "eth:0x016B9F17C65d55Fd3b6b7A8d112df1A7Ef73A1a2"
    }
```

```diff
    contract WTIA_OFTAdapter (0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2) {
    +++ description: None
      address:
-        "0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2"
+        "eth:0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2"
      values.composeMsgSender:
-        "0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2"
+        "eth:0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2"
+        "eth:0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2"
      values.owner:
-        "0x1964f3Eaf7d8fca7E559468a384453d2d8490744"
+        "eth:0x1964f3Eaf7d8fca7E559468a384453d2d8490744"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2:
-        "WTIA_OFTAdapter"
      implementationNames.eth:0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2:
+        "WTIA_OFTAdapter"
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
    EOA  (0x1082E92A0b92e15212fD5879C1dd672AB548302c) {
    +++ description: None
      address:
-        "0x1082E92A0b92e15212fD5879C1dd672AB548302c"
+        "eth:0x1082E92A0b92e15212fD5879C1dd672AB548302c"
    }
```

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      address:
-        "0x173272739Bd7Aa6e4e214714048a9fE699453059"
+        "eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"
      values.$admin:
-        "0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3"
+        "eth:0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3"
      values.$implementation:
-        "0xfE9AB78eD4f9f3DbB168d9f5E5213d78605C9805"
+        "eth:0xfE9AB78eD4f9f3DbB168d9f5E5213d78605C9805"
      values.$pastUpgrades.0.2.0:
-        "0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"
+        "eth:0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"
      values.$pastUpgrades.1.2.0:
-        "0xDaC2d26317C42ae3CB21357B73404120E1dA4232"
+        "eth:0xDaC2d26317C42ae3CB21357B73404120E1dA4232"
      values.$pastUpgrades.2.2.0:
-        "0xfE9AB78eD4f9f3DbB168d9f5E5213d78605C9805"
+        "eth:0xfE9AB78eD4f9f3DbB168d9f5E5213d78605C9805"
      implementationNames.0x173272739Bd7Aa6e4e214714048a9fE699453059:
-        "OptimizedTransparentUpgradeableProxy"
      implementationNames.0xfE9AB78eD4f9f3DbB168d9f5E5213d78605C9805:
-        ""
      implementationNames.eth:0x173272739Bd7Aa6e4e214714048a9fE699453059:
+        "OptimizedTransparentUpgradeableProxy"
      implementationNames.eth:0xfE9AB78eD4f9f3DbB168d9f5E5213d78605C9805:
+        ""
    }
```

```diff
    contract TBankOFT (0x1762c17f671FA27cE6C59256f5F28242de9274d0) {
    +++ description: None
      address:
-        "0x1762c17f671FA27cE6C59256f5F28242de9274d0"
+        "eth:0x1762c17f671FA27cE6C59256f5F28242de9274d0"
      values.composeMsgSender:
-        "0x1762c17f671FA27cE6C59256f5F28242de9274d0"
+        "eth:0x1762c17f671FA27cE6C59256f5F28242de9274d0"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x1762c17f671FA27cE6C59256f5F28242de9274d0"
+        "eth:0x1762c17f671FA27cE6C59256f5F28242de9274d0"
      values.owner:
-        "0x33C78a4EBE7950277B0Ba8b8F4C66526db73C502"
+        "eth:0x33C78a4EBE7950277B0Ba8b8F4C66526db73C502"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x1762c17f671FA27cE6C59256f5F28242de9274d0:
-        "TBankOFT"
      implementationNames.eth:0x1762c17f671FA27cE6C59256f5F28242de9274d0:
+        "TBankOFT"
    }
```

```diff
    contract TRESTLE_OFTAdapter (0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E) {
    +++ description: None
      address:
-        "0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E"
+        "eth:0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E"
+        "eth:0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E"
      values.owner:
-        "0x1964f3Eaf7d8fca7E559468a384453d2d8490744"
+        "eth:0x1964f3Eaf7d8fca7E559468a384453d2d8490744"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E:
-        "TRESTLE_OFTAdapter"
      implementationNames.eth:0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E:
+        "TRESTLE_OFTAdapter"
    }
```

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: None
      address:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.blockedLibrary:
-        "0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862"
+        "eth:0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862"
      values.defaultReceiveLib_rsETH.lib:
-        "0xc02Ab410f0734EFa3F14628780e6e695156024C2"
+        "eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2"
+++ description: The default send lib can be different for every OApp. In practice it is the same for most OApps. Should be reviewed if changed.
+++ severity: HIGH
      values.defaultSendLib_ENA:
-        "0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1"
+        "eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1"
+++ description: All registered libraries in the Ethereum LZ Endpoint. Index 0 is the blockedLibrary, 1 and 2 are send and receive. Send- and ReceiveLibraries define the messaging framework (that can be further configured by the OApp owner). A new MessageLibrary should be thoroughly reviewed, especially if it is set as the default Library in new OApps.
+++ severity: HIGH
      values.getRegisteredLibraries.0:
-        "0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862"
+        "eth:0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862"
+++ description: All registered libraries in the Ethereum LZ Endpoint. Index 0 is the blockedLibrary, 1 and 2 are send and receive. Send- and ReceiveLibraries define the messaging framework (that can be further configured by the OApp owner). A new MessageLibrary should be thoroughly reviewed, especially if it is set as the default Library in new OApps.
+++ severity: HIGH
      values.getRegisteredLibraries.1:
-        "0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1"
+        "eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1"
+++ description: All registered libraries in the Ethereum LZ Endpoint. Index 0 is the blockedLibrary, 1 and 2 are send and receive. Send- and ReceiveLibraries define the messaging framework (that can be further configured by the OApp owner). A new MessageLibrary should be thoroughly reviewed, especially if it is set as the default Library in new OApps.
+++ severity: HIGH
      values.getRegisteredLibraries.2:
-        "0xc02Ab410f0734EFa3F14628780e6e695156024C2"
+        "eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2"
+++ description: All registered libraries in the Ethereum LZ Endpoint. Index 0 is the blockedLibrary, 1 and 2 are send and receive. Send- and ReceiveLibraries define the messaging framework (that can be further configured by the OApp owner). A new MessageLibrary should be thoroughly reviewed, especially if it is set as the default Library in new OApps.
+++ severity: HIGH
      values.getRegisteredLibraries.3:
-        "0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D"
+        "eth:0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D"
      values.getSendContext.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.lzToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.nativeToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      implementationNames.0x1a44076050125825900e736c501f859c50fE728c:
-        "EndpointV2"
      implementationNames.eth:0x1a44076050125825900e736c501f859c50fE728c:
+        "EndpointV2"
    }
```

```diff
    contract BlockedMessageLib (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      address:
-        "0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862"
+        "eth:0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862"
      implementationNames.0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862:
-        "BlockedMessageLib"
      implementationNames.eth:0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862:
+        "BlockedMessageLib"
    }
```

```diff
    contract DineroOFTLockbox (0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208) {
    +++ description: None
      address:
-        "0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208"
+        "eth:0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208"
      values.composeMsgSender:
-        "0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208"
+        "eth:0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208"
+        "eth:0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208"
      values.owner:
-        "0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e"
+        "eth:0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208:
-        "DineroOFTLockbox"
      implementationNames.eth:0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208:
+        "DineroOFTLockbox"
    }
```

```diff
    EOA  (0x1e56cAa34ae155aB8AfAB2D1e2A37580a04A494C) {
    +++ description: None
      address:
-        "0x1e56cAa34ae155aB8AfAB2D1e2A37580a04A494C"
+        "eth:0x1e56cAa34ae155aB8AfAB2D1e2A37580a04A494C"
    }
```

```diff
    contract StakedFraxEtherOFTAdapter (0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A) {
    +++ description: None
      address:
-        "0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A"
+        "eth:0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A"
      values.composeMsgSender:
-        "0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A"
+        "eth:0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A"
+        "eth:0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A:
-        "StakedFraxEtherOFTAdapter"
      implementationNames.eth:0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A:
+        "StakedFraxEtherOFTAdapter"
    }
```

```diff
    contract StakedUSDeOFTAdapter (0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2) {
    +++ description: None
      address:
-        "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"
+        "eth:0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"
      values.composeMsgSender:
-        "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"
+        "eth:0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"
+        "eth:0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"
      values.owner:
-        "0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862"
+        "eth:0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rateLimiter:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2:
-        "StakedUSDeOFTAdapter"
      implementationNames.eth:0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2:
+        "StakedUSDeOFTAdapter"
    }
```

```diff
    contract FraxSharesOFTAdapter (0x23432452B720C80553458496D4D9d7C5003280d0) {
    +++ description: None
      address:
-        "0x23432452B720C80553458496D4D9d7C5003280d0"
+        "eth:0x23432452B720C80553458496D4D9d7C5003280d0"
      values.composeMsgSender:
-        "0x23432452B720C80553458496D4D9d7C5003280d0"
+        "eth:0x23432452B720C80553458496D4D9d7C5003280d0"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x23432452B720C80553458496D4D9d7C5003280d0"
+        "eth:0x23432452B720C80553458496D4D9d7C5003280d0"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x23432452B720C80553458496D4D9d7C5003280d0:
-        "FraxSharesOFTAdapter"
      implementationNames.eth:0x23432452B720C80553458496D4D9d7C5003280d0:
+        "FraxSharesOFTAdapter"
    }
```

```diff
    contract EvmZkMptValidator (0x276816F1931aFac123BdaeA54afF02BE6fd73e14) {
    +++ description: None
      address:
-        "0x276816F1931aFac123BdaeA54afF02BE6fd73e14"
+        "eth:0x276816F1931aFac123BdaeA54afF02BE6fd73e14"
      implementationNames.0x276816F1931aFac123BdaeA54afF02BE6fd73e14:
-        "EvmZkMptValidator"
      implementationNames.eth:0x276816F1931aFac123BdaeA54afF02BE6fd73e14:
+        "EvmZkMptValidator"
    }
```

```diff
    contract HorizenDVN (0x380275805876Ff19055EA900CDb2B46a94ecF20D) {
    +++ description: None
      address:
-        "0x380275805876Ff19055EA900CDb2B46a94ecF20D"
+        "eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D"
      values.priceFeed:
-        "0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
+        "eth:0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
      values.workerFeeLib:
-        "0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB"
+        "eth:0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB"
      implementationNames.0x380275805876Ff19055EA900CDb2B46a94ecF20D:
-        "DVN"
      implementationNames.eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D:
+        "DVN"
    }
```

```diff
    contract EvmMptValidator (0x38C967856d17E900042Af447B3346bfF26C8ed4B) {
    +++ description: None
      address:
-        "0x38C967856d17E900042Af447B3346bfF26C8ed4B"
+        "eth:0x38C967856d17E900042Af447B3346bfF26C8ed4B"
      implementationNames.0x38C967856d17E900042Af447B3346bfF26C8ed4B:
-        "EvmMptValidator"
      implementationNames.eth:0x38C967856d17E900042Af447B3346bfF26C8ed4B:
+        "EvmMptValidator"
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
    contract USDT0DVN (0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2) {
    +++ description: None
      address:
-        "0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2"
+        "eth:0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2"
      values.getSigners.0:
-        "0xB88dca912E27EB7929a145458B99649C1120fE6b"
+        "eth:0xB88dca912E27EB7929a145458B99649C1120fE6b"
      values.getSigners.1:
-        "0x016B9F17C65d55Fd3b6b7A8d112df1A7Ef73A1a2"
+        "eth:0x016B9F17C65d55Fd3b6b7A8d112df1A7Ef73A1a2"
      values.priceFeed:
-        "0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
+        "eth:0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
      values.workerFeeLib:
-        "0x7087B8011caC9541b388B639a1460D9cbA4eA0A2"
+        "eth:0x7087B8011caC9541b388B639a1460D9cbA4eA0A2"
      implementationNames.0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2:
-        "DVN"
      implementationNames.eth:0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2:
+        "DVN"
    }
```

```diff
    contract CyberTokenAdapter (0x3d2fe83ea885C2E43A422C82C738847669708210) {
    +++ description: None
      address:
-        "0x3d2fe83ea885C2E43A422C82C738847669708210"
+        "eth:0x3d2fe83ea885C2E43A422C82C738847669708210"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x3d2fe83ea885C2E43A422C82C738847669708210"
+        "eth:0x3d2fe83ea885C2E43A422C82C738847669708210"
      values.owner:
-        "0x455DB34c99A866489F3ac63fa2F068c726BC286b"
+        "eth:0x455DB34c99A866489F3ac63fa2F068c726BC286b"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x3d2fe83ea885C2E43A422C82C738847669708210:
-        "CyberTokenAdapter"
      implementationNames.eth:0x3d2fe83ea885C2E43A422C82C738847669708210:
+        "CyberTokenAdapter"
    }
```

```diff
    contract MysoOFTAdapter (0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6) {
    +++ description: None
      address:
-        "0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6"
+        "eth:0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6"
+        "eth:0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6"
      values.owner:
-        "0xF3E76af90A74fE743db172996db484052e2bC61f"
+        "eth:0xF3E76af90A74fE743db172996db484052e2bC61f"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6:
-        "MysoOFTAdapter"
      implementationNames.eth:0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6:
+        "MysoOFTAdapter"
    }
```

```diff
    EOA  (0x4192D72c281dB0eF10464dD274EE583C33256ac5) {
    +++ description: None
      address:
-        "0x4192D72c281dB0eF10464dD274EE583C33256ac5"
+        "eth:0x4192D72c281dB0eF10464dD274EE583C33256ac5"
    }
```

```diff
    EOA  (0x488A3d37442F583c1c0a356118d1d6181b22434c) {
    +++ description: None
      address:
-        "0x488A3d37442F583c1c0a356118d1d6181b22434c"
+        "eth:0x488A3d37442F583c1c0a356118d1d6181b22434c"
    }
```

```diff
    contract ProxyAdmin (0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc) {
    +++ description: None
      address:
-        "0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc"
+        "eth:0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc"
      values.owner:
-        "0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8"
+        "eth:0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8"
      implementationNames.0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc:
-        "ProxyAdmin"
      implementationNames.eth:0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc:
+        "ProxyAdmin"
    }
```

```diff
    contract Safe (0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8) {
    +++ description: None
      address:
-        "0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8"
+        "eth:0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x4192D72c281dB0eF10464dD274EE583C33256ac5"
+        "eth:0x4192D72c281dB0eF10464dD274EE583C33256ac5"
      values.$members.1:
-        "0x7D8e979dcC6EC933c70FBe28B2B7700907D2aFEA"
+        "eth:0x7D8e979dcC6EC933c70FBe28B2B7700907D2aFEA"
      values.$members.2:
-        "0x488A3d37442F583c1c0a356118d1d6181b22434c"
+        "eth:0x488A3d37442F583c1c0a356118d1d6181b22434c"
      values.$members.3:
-        "0x00F6D2b4B69Ce697f913Da16A9D73283dc4C78F2"
+        "eth:0x00F6D2b4B69Ce697f913Da16A9D73283dc4C78F2"
      values.$members.4:
-        "0x5F0DcA105195Bd58277aa4b4CABC90a791E1b982"
+        "eth:0x5F0DcA105195Bd58277aa4b4CABC90a791E1b982"
      implementationNames.0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract ENAOFTAdapter (0x58538e6A46E07434d7E7375Bc268D3cb839C0133) {
    +++ description: None
      address:
-        "0x58538e6A46E07434d7E7375Bc268D3cb839C0133"
+        "eth:0x58538e6A46E07434d7E7375Bc268D3cb839C0133"
      values.composeMsgSender:
-        "0x58538e6A46E07434d7E7375Bc268D3cb839C0133"
+        "eth:0x58538e6A46E07434d7E7375Bc268D3cb839C0133"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x58538e6A46E07434d7E7375Bc268D3cb839C0133"
+        "eth:0x58538e6A46E07434d7E7375Bc268D3cb839C0133"
      values.owner:
-        "0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862"
+        "eth:0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rateLimiter:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x58538e6A46E07434d7E7375Bc268D3cb839C0133:
-        "ENAOFTAdapter"
      implementationNames.eth:0x58538e6A46E07434d7E7375Bc268D3cb839C0133:
+        "ENAOFTAdapter"
    }
```

```diff
    contract LayerZeroDVN (0x589dEDbD617e0CBcB916A9223F4d1300c294236b) {
    +++ description: None
      address:
-        "0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
+        "eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
      values.priceFeed:
-        "0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
+        "eth:0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
      values.workerFeeLib:
-        "0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b"
+        "eth:0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b"
      implementationNames.0x589dEDbD617e0CBcB916A9223F4d1300c294236b:
-        "DVN"
      implementationNames.eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b:
+        "DVN"
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
    contract USDeOFTAdapter (0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34) {
    +++ description: None
      address:
-        "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
+        "eth:0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
      values.composeMsgSender:
-        "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
+        "eth:0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
+        "eth:0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
      values.owner:
-        "0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862"
+        "eth:0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rateLimiter:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34:
-        "USDeOFTAdapter"
      implementationNames.eth:0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34:
+        "USDeOFTAdapter"
    }
```

```diff
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056) {
    +++ description: None
      address:
-        "0x5ebB3f2feaA15271101a927869B3A56837e73056"
+        "eth:0x5ebB3f2feaA15271101a927869B3A56837e73056"
      values.owner:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      implementationNames.0x5ebB3f2feaA15271101a927869B3A56837e73056:
-        "Treasury"
      implementationNames.eth:0x5ebB3f2feaA15271101a927869B3A56837e73056:
+        "Treasury"
    }
```

```diff
    EOA  (0x5F0DcA105195Bd58277aa4b4CABC90a791E1b982) {
    +++ description: None
      address:
-        "0x5F0DcA105195Bd58277aa4b4CABC90a791E1b982"
+        "eth:0x5F0DcA105195Bd58277aa4b4CABC90a791E1b982"
    }
```

```diff
    contract ParamOFTAdapter (0x6182995916d79DeDb60db1570776F9994fCdCA0a) {
    +++ description: None
      address:
-        "0x6182995916d79DeDb60db1570776F9994fCdCA0a"
+        "eth:0x6182995916d79DeDb60db1570776F9994fCdCA0a"
      values.composeMsgSender:
-        "0x6182995916d79DeDb60db1570776F9994fCdCA0a"
+        "eth:0x6182995916d79DeDb60db1570776F9994fCdCA0a"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x6182995916d79DeDb60db1570776F9994fCdCA0a"
+        "eth:0x6182995916d79DeDb60db1570776F9994fCdCA0a"
      values.owner:
-        "0x3B89fC2918D9F25977d6F85C13ff2395ba2f8022"
+        "eth:0x3B89fC2918D9F25977d6F85C13ff2395ba2f8022"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x6182995916d79DeDb60db1570776F9994fCdCA0a:
-        "ParamOFTAdapter"
      implementationNames.eth:0x6182995916d79DeDb60db1570776F9994fCdCA0a:
+        "ParamOFTAdapter"
    }
```

```diff
    contract OAdapterUpgradeable (0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee) {
    +++ description: None
      address:
-        "0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee"
+        "eth:0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee"
      values.$admin:
-        "0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc"
+        "eth:0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc"
      values.$implementation:
-        "0xCD979B10A55FCdAC23ec785CE3066c6ef8a479A4"
+        "eth:0xCD979B10A55FCdAC23ec785CE3066c6ef8a479A4"
      values.$pastUpgrades.0.2.0:
-        "0xCD979B10A55FCdAC23ec785CE3066c6ef8a479A4"
+        "eth:0xCD979B10A55FCdAC23ec785CE3066c6ef8a479A4"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee"
+        "eth:0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee"
      values.owner:
-        "0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8"
+        "eth:0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee:
-        "TransparentUpgradeableProxy"
      implementationNames.0xCD979B10A55FCdAC23ec785CE3066c6ef8a479A4:
-        "OAdapterUpgradeable"
      implementationNames.eth:0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xCD979B10A55FCdAC23ec785CE3066c6ef8a479A4:
+        "OAdapterUpgradeable"
    }
```

```diff
    contract  (0x7087B8011caC9541b388B639a1460D9cbA4eA0A2) {
    +++ description: None
      address:
-        "0x7087B8011caC9541b388B639a1460D9cbA4eA0A2"
+        "eth:0x7087B8011caC9541b388B639a1460D9cbA4eA0A2"
      implementationNames.0x7087B8011caC9541b388B639a1460D9cbA4eA0A2:
-        ""
      implementationNames.eth:0x7087B8011caC9541b388B639a1460D9cbA4eA0A2:
+        ""
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
    contract ReadLib1002 (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D) {
    +++ description: None
      address:
-        "0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D"
+        "eth:0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D"
      values.getTreasuryAndNativeFeeCap.0:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      implementationNames.0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D:
-        "ReadLib1002"
      implementationNames.eth:0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D:
+        "ReadLib1002"
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
    EOA  (0x7Af345AD8c2E7372C5aCEaAf86Bda08676e3d634) {
    +++ description: None
      address:
-        "0x7Af345AD8c2E7372C5aCEaAf86Bda08676e3d634"
+        "eth:0x7Af345AD8c2E7372C5aCEaAf86Bda08676e3d634"
    }
```

```diff
    EOA  (0x7D8e979dcC6EC933c70FBe28B2B7700907D2aFEA) {
    +++ description: None
      address:
-        "0x7D8e979dcC6EC933c70FBe28B2B7700907D2aFEA"
+        "eth:0x7D8e979dcC6EC933c70FBe28B2B7700907D2aFEA"
    }
```

```diff
    contract MyOFTAdapter (0x801642B6efB861fE624dAD704b7A747779d9B433) {
    +++ description: None
      address:
-        "0x801642B6efB861fE624dAD704b7A747779d9B433"
+        "eth:0x801642B6efB861fE624dAD704b7A747779d9B433"
      values.composeMsgSender:
-        "0x801642B6efB861fE624dAD704b7A747779d9B433"
+        "eth:0x801642B6efB861fE624dAD704b7A747779d9B433"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x801642B6efB861fE624dAD704b7A747779d9B433"
+        "eth:0x801642B6efB861fE624dAD704b7A747779d9B433"
      values.owner:
-        "0x21FE3e26E824783cA7E374355A8D30Ae8BBf6E37"
+        "eth:0x21FE3e26E824783cA7E374355A8D30Ae8BBf6E37"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x801642B6efB861fE624dAD704b7A747779d9B433:
-        "MyOFTAdapter"
      implementationNames.eth:0x801642B6efB861fE624dAD704b7A747779d9B433:
+        "MyOFTAdapter"
    }
```

```diff
    contract RSETH_OFTAdapter (0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3) {
    +++ description: None
      address:
-        "0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3"
+        "eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3"
      values.composeMsgSender:
-        "0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3"
+        "eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3"
+        "eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3"
      values.owner:
-        "0xCbcdd778AA25476F203814214dD3E9b9c46829A1"
+        "eth:0xCbcdd778AA25476F203814214dD3E9b9c46829A1"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3:
-        "RSETH_OFTAdapter"
      implementationNames.eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3:
+        "RSETH_OFTAdapter"
    }
```

```diff
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24) {
    +++ description: None
      address:
-        "0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"
+        "eth:0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"
      values.$admin:
-        "0xe16d201cA134345601631D327a971A3741646B0d"
+        "eth:0xe16d201cA134345601631D327a971A3741646B0d"
      values.$implementation:
-        "0xdFf54e8d2B31A197DC5859739E7177AA31fC3390"
+        "eth:0xdFf54e8d2B31A197DC5859739E7177AA31fC3390"
      values.$pastUpgrades.0.2.0:
-        "0x156C3E0384459E07Dca7849b79196FbC5877dc3A"
+        "eth:0x156C3E0384459E07Dca7849b79196FbC5877dc3A"
      values.$pastUpgrades.1.2.0:
-        "0xcb75F0dFFf5c5046CAA9dB1DE56645a962FeFFc2"
+        "eth:0xcb75F0dFFf5c5046CAA9dB1DE56645a962FeFFc2"
      values.$pastUpgrades.2.2.0:
-        "0xdFf54e8d2B31A197DC5859739E7177AA31fC3390"
+        "eth:0xdFf54e8d2B31A197DC5859739E7177AA31fC3390"
      values.defaultTxValidator:
-        "0x38C967856d17E900042Af447B3346bfF26C8ed4B"
+        "eth:0x38C967856d17E900042Af447B3346bfF26C8ed4B"
      values.defaultZkValidator:
-        "0x276816F1931aFac123BdaeA54afF02BE6fd73e14"
+        "eth:0x276816F1931aFac123BdaeA54afF02BE6fd73e14"
      values.layerZeroEndpointV1:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.layerZeroEndpointV2:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.owner:
-        "0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7"
+        "eth:0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7"
      values.sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x8ddF05F9A5c488b4973897E278B58895bF87Cb24:
-        "TransparentUpgradeableProxy"
      implementationNames.0xdFf54e8d2B31A197DC5859739E7177AA31fC3390:
-        "ZkBridgeOracleV2"
      implementationNames.eth:0x8ddF05F9A5c488b4973897E278B58895bF87Cb24:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xdFf54e8d2B31A197DC5859739E7177AA31fC3390:
+        "ZkBridgeOracleV2"
    }
```

```diff
    contract DVNFeeLib (0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB) {
    +++ description: None
      address:
-        "0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB"
+        "eth:0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB"
      values.owner:
-        "0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6"
+        "eth:0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6"
      implementationNames.0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB:
-        "DVNFeeLib"
      implementationNames.eth:0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB:
+        "DVNFeeLib"
    }
```

```diff
    EOA  (0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327) {
    +++ description: None
      address:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "eth:0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      address:
-        "0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3"
+        "eth:0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3"
      values.owner:
-        "0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5"
+        "eth:0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5"
      implementationNames.0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3:
-        "ProxyAdmin"
      implementationNames.eth:0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3:
+        "ProxyAdmin"
    }
```

```diff
    contract GnosisSafe (0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7) {
    +++ description: None
      address:
-        "0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7"
+        "eth:0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xd1846C61A063edA820305A5e568A12a570420cf6"
+        "eth:0xd1846C61A063edA820305A5e568A12a570420cf6"
      values.$members.1:
-        "0x1e56cAa34ae155aB8AfAB2D1e2A37580a04A494C"
+        "eth:0x1e56cAa34ae155aB8AfAB2D1e2A37580a04A494C"
      values.$members.2:
-        "0xF94b16157948E10597481Da0523927c8BA0bd182"
+        "eth:0xF94b16157948E10597481Da0523927c8BA0bd182"
      values.$members.3:
-        "0x7Af345AD8c2E7372C5aCEaAf86Bda08676e3d634"
+        "eth:0x7Af345AD8c2E7372C5aCEaAf86Bda08676e3d634"
      values.$members.4:
-        "0x1082E92A0b92e15212fD5879C1dd672AB548302c"
+        "eth:0x1082E92A0b92e15212fD5879C1dd672AB548302c"
      implementationNames.0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract WooTokenOFTAdapter (0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711) {
    +++ description: None
      address:
-        "0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711"
+        "eth:0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711"
+        "eth:0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711"
      values.owner:
-        "0x155EEF9731aFf5aE6cB2741F7bEC0f005037aCB0"
+        "eth:0x155EEF9731aFf5aE6cB2741F7bEC0f005037aCB0"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711:
-        "WooTokenOFTAdapter"
      implementationNames.eth:0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711:
+        "WooTokenOFTAdapter"
    }
```

```diff
    contract DVNFeeLib (0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b) {
    +++ description: None
      address:
-        "0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b"
+        "eth:0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b"
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "eth:0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
      implementationNames.0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b:
-        "DVNFeeLib"
      implementationNames.eth:0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b:
+        "DVNFeeLib"
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
    EOA  (0xB88dca912E27EB7929a145458B99649C1120fE6b) {
    +++ description: None
      address:
-        "0xB88dca912E27EB7929a145458B99649C1120fE6b"
+        "eth:0xB88dca912E27EB7929a145458B99649C1120fE6b"
    }
```

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: None
      address:
-        "0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1"
+        "eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1"
      values.defaultExecutor_ENA.executor:
-        "0x173272739Bd7Aa6e4e214714048a9fE699453059"
+        "eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"
      values.owner:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      values.treasury:
-        "0x5ebB3f2feaA15271101a927869B3A56837e73056"
+        "eth:0x5ebB3f2feaA15271101a927869B3A56837e73056"
      values.ulnConfig_CYBER.requiredDVNs.0:
-        "0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
+        "eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
      values.ulnConfig_CYBER.requiredDVNs.1:
-        "0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"
+        "eth:0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"
      values.ulnConfig_ENA.requiredDVNs.0:
-        "0x380275805876Ff19055EA900CDb2B46a94ecF20D"
+        "eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D"
      values.ulnConfig_ENA.requiredDVNs.1:
-        "0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
+        "eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
      values.ulnConfig_sfrxETH.requiredDVNs.0:
-        "0x380275805876Ff19055EA900CDb2B46a94ecF20D"
+        "eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D"
      values.ulnConfig_sfrxETH.requiredDVNs.1:
-        "0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
+        "eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
      values.ulnConfig_USDT0.requiredDVNs.0:
-        "0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2"
+        "eth:0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2"
      values.ulnConfig_USDT0.requiredDVNs.1:
-        "0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
+        "eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
      implementationNames.0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1:
-        "SendUln302"
      implementationNames.eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1:
+        "SendUln302"
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
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2) {
    +++ description: None
      address:
-        "0xc02Ab410f0734EFa3F14628780e6e695156024C2"
+        "eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2"
      values.owner:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      implementationNames.0xc02Ab410f0734EFa3F14628780e6e695156024C2:
-        "ReceiveUln302"
      implementationNames.eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2:
+        "ReceiveUln302"
    }
```

```diff
    contract CyberTokenAdapter (0xCB07992DE144bDeE56fDb66Fff2454B43243b052) {
    +++ description: None
      address:
-        "0xCB07992DE144bDeE56fDb66Fff2454B43243b052"
+        "eth:0xCB07992DE144bDeE56fDb66Fff2454B43243b052"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0xCB07992DE144bDeE56fDb66Fff2454B43243b052"
+        "eth:0xCB07992DE144bDeE56fDb66Fff2454B43243b052"
      values.owner:
-        "0x455DB34c99A866489F3ac63fa2F068c726BC286b"
+        "eth:0x455DB34c99A866489F3ac63fa2F068c726BC286b"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xCB07992DE144bDeE56fDb66Fff2454B43243b052:
-        "CyberTokenAdapter"
      implementationNames.eth:0xCB07992DE144bDeE56fDb66Fff2454B43243b052:
+        "CyberTokenAdapter"
    }
```

```diff
    EOA  (0xd1846C61A063edA820305A5e568A12a570420cf6) {
    +++ description: None
      address:
-        "0xd1846C61A063edA820305A5e568A12a570420cf6"
+        "eth:0xd1846C61A063edA820305A5e568A12a570420cf6"
    }
```

```diff
    contract GoogleCloudDVN (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
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
    contract KinetixFinanceTokenOFTAdapter (0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf) {
    +++ description: None
      address:
-        "0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf"
+        "eth:0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf"
+        "eth:0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf"
      values.owner:
-        "0x58591456DD9FEdf8F629819F88cC02F4C6e9Aeb9"
+        "eth:0x58591456DD9FEdf8F629819F88cC02F4C6e9Aeb9"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf:
-        "KinetixFinanceTokenOFTAdapter"
      implementationNames.eth:0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf:
+        "KinetixFinanceTokenOFTAdapter"
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
    contract ZkBridgeAdmin (0xe16d201cA134345601631D327a971A3741646B0d) {
    +++ description: None
      address:
-        "0xe16d201cA134345601631D327a971A3741646B0d"
+        "eth:0xe16d201cA134345601631D327a971A3741646B0d"
      values.owner:
-        "0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7"
+        "eth:0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7"
      implementationNames.0xe16d201cA134345601631D327a971A3741646B0d:
-        "ZkBridgeAdmin"
      implementationNames.eth:0xe16d201cA134345601631D327a971A3741646B0d:
+        "ZkBridgeAdmin"
    }
```

```diff
    contract StakedFraxOFTAdapter (0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E) {
    +++ description: None
      address:
-        "0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E"
+        "eth:0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E"
      values.composeMsgSender:
-        "0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E"
+        "eth:0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E"
+        "eth:0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E:
-        "StakedFraxOFTAdapter"
      implementationNames.eth:0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E:
+        "StakedFraxOFTAdapter"
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
    contract MaviaOFTAdapter (0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D) {
    +++ description: None
      address:
-        "0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D"
+        "eth:0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D"
      values.composeMsgSender:
-        "0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D"
+        "eth:0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D"
+        "eth:0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D"
      values.owner:
-        "0xEd43EaA4ADd5FCBf009e3E2d362a217745A11Cf3"
+        "eth:0xEd43EaA4ADd5FCBf009e3E2d362a217745A11Cf3"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D:
-        "MaviaOFTAdapter"
      implementationNames.eth:0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D:
+        "MaviaOFTAdapter"
    }
```

```diff
    EOA  (0xF94b16157948E10597481Da0523927c8BA0bd182) {
    +++ description: None
      address:
-        "0xF94b16157948E10597481Da0523927c8BA0bd182"
+        "eth:0xF94b16157948E10597481Da0523927c8BA0bd182"
    }
```

```diff
    contract EtherFiOFTAdapter (0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D) {
    +++ description: None
      address:
-        "0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D"
+        "eth:0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "eth:0x1a44076050125825900e736c501f859c50fE728c"
      values.msgInspector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.oApp:
-        "0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D"
+        "eth:0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D"
      values.owner:
-        "0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"
+        "eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D:
-        "EtherFiOFTAdapter"
      implementationNames.eth:0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D:
+        "EtherFiOFTAdapter"
    }
```

```diff
+   Status: CREATED
    contract WTIA_OFTAdapter (0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TBankOFT (0x1762c17f671FA27cE6C59256f5F28242de9274d0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TRESTLE_OFTAdapter (0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlockedMessageLib (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DineroOFTLockbox (0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakedFraxEtherOFTAdapter (0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakedUSDeOFTAdapter (0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FraxSharesOFTAdapter (0x23432452B720C80553458496D4D9d7C5003280d0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EvmZkMptValidator (0x276816F1931aFac123BdaeA54afF02BE6fd73e14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HorizenDVN (0x380275805876Ff19055EA900CDb2B46a94ecF20D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EvmMptValidator (0x38C967856d17E900042Af447B3346bfF26C8ed4B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDT0DVN (0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CyberTokenAdapter (0x3d2fe83ea885C2E43A422C82C738847669708210)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MysoOFTAdapter (0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ENAOFTAdapter (0x58538e6A46E07434d7E7375Bc268D3cb839C0133)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZeroDVN (0x589dEDbD617e0CBcB916A9223F4d1300c294236b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDeOFTAdapter (0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ParamOFTAdapter (0x6182995916d79DeDb60db1570776F9994fCdCA0a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OAdapterUpgradeable (0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7087B8011caC9541b388B639a1460D9cbA4eA0A2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReadLib1002 (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MyOFTAdapter (0x801642B6efB861fE624dAD704b7A747779d9B433)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RSETH_OFTAdapter (0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DVNFeeLib (0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WooTokenOFTAdapter (0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DVNFeeLib (0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Multisig (0xBe010A7e3686FdF65E93344ab664D065A0B02478)
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
```

```diff
+   Status: CREATED
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CyberTokenAdapter (0xCB07992DE144bDeE56fDb66Fff2454B43243b052)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GoogleCloudDVN (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KinetixFinanceTokenOFTAdapter (0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkBridgeAdmin (0xe16d201cA134345601631D327a971A3741646B0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakedFraxOFTAdapter (0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaviaOFTAdapter (0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiOFTAdapter (0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D)
    +++ description: None
```

Generated with discovered.json: 0x6d316016a1480c6308a9f431aee1ef502609276f

# Diff at Wed, 09 Jul 2025 15:14:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d05d4ec9af28b2df4e687d7b7676cddffcae6887 block: 22567567
- current block number: 22882451

## Description

Update LZ Multisig to a custom multisig contract that allows offchain signing with multichain onchain execution.

## Watched changes

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: None
      values.owner:
-        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
+        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
    }
```

```diff
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056) {
    +++ description: None
      values.owner:
-        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
+        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
    }
```

```diff
    contract ReadLib1002 (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D) {
    +++ description: None
      values.owner:
-        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
+        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
    }
```

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: None
      values.owner:
-        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
+        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
    }
```

```diff
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2) {
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

Generated with discovered.json: 0x2f433ba41facf1feb4301062b9f5fb65958748ea

# Diff at Fri, 04 Jul 2025 12:19:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22567567
- current block number: 22567567

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567567 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee"
+        "eth:0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee"
    }
```

```diff
    contract Safe (0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc"
+        "eth:0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc"
      receivedPermissions.0.from:
-        "ethereum:0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee"
+        "eth:0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc"
+        "eth:0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc"
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x173272739Bd7Aa6e4e214714048a9fE699453059"
+        "eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"
    }
```

```diff
    contract ZkBridgeAdmin (0xe16d201cA134345601631D327a971A3741646B0d) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"
+        "eth:0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"
    }
```

Generated with discovered.json: 0x9c0ef060a34b43ddaa006405cc6fce2889bcaed4

# Diff at Mon, 26 May 2025 14:31:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 22174829
- current block number: 22567567

## Description

common dvn fee lib verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22174829 (main branch discovery), not current.

```diff
    contract DVNFeeLib (0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB) {
    +++ description: None
      name:
-        ""
+        "DVNFeeLib"
      unverified:
-        true
      values.owner:
+        "0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6"
      implementationNames.0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB:
-        ""
+        "DVNFeeLib"
      sourceHashes:
+        ["0x6ec0f4e740bc8ed51419c1f4c51da9549aaa3185e6ecc9e613470b90854e4830"]
    }
```

```diff
    contract DVNFeeLib (0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b) {
    +++ description: None
      name:
-        ""
+        "DVNFeeLib"
      unverified:
-        true
      values.owner:
+        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
      implementationNames.0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b:
-        ""
+        "DVNFeeLib"
      sourceHashes:
+        ["0x6ec0f4e740bc8ed51419c1f4c51da9549aaa3185e6ecc9e613470b90854e4830"]
    }
```

Generated with discovered.json: 0x6e02d898be8eec9cb7813626fa85fcbddc076b66

# Diff at Fri, 23 May 2025 09:40:58 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22174829
- current block number: 22174829

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22174829 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract Safe (0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract ZkBridgeAdmin (0xe16d201cA134345601631D327a971A3741646B0d) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x77a791f0fc886d26edf7f4abba6ce1b93fc6138d

# Diff at Tue, 06 May 2025 13:32:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@09b97f14e3365304f798b0b4fc6971d693d1eb2f block: 22174829
- current block number: 22174829

## Description

ethereum

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22174829 (main branch discovery), not current.

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      name:
-        ""
+        "LayerZero Executor"
    }
```

Generated with discovered.json: 0xff729e031a9e3a88bdce85906c003455ab7068db

# Diff at Tue, 29 Apr 2025 08:19:05 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22174829
- current block number: 22174829

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22174829 (main branch discovery), not current.

```diff
    contract  (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3","via":[]}]
    }
```

```diff
    contract OAdapterUpgradeable (0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8","via":[{"address":"0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc"}]}]
    }
```

```diff
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xe16d201cA134345601631D327a971A3741646B0d","via":[]}]
    }
```

Generated with discovered.json: 0xcde83e025e3f3be2a1f67950ef9306f141c9def1

# Diff at Thu, 24 Apr 2025 10:30:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 22174829
- current block number: 22174829

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22174829 (main branch discovery), not current.

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: None
+++ description: The default receive lib can be different for every OApp. In practice it is the same for most OApps. Should be reviewed if changed.
+++ severity: HIGH
      values.defaultReceiveLib_rsETH:
-        ["0xc02Ab410f0734EFa3F14628780e6e695156024C2",true]
+        {"lib":"0xc02Ab410f0734EFa3F14628780e6e695156024C2","isDefault":true}
    }
```

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: None
+++ description: The default executor can be different for every OApp. In practice it is the same for most OApps. (LayerZero Executor) Should be reviewed if changed.
+++ severity: HIGH
      values.defaultExecutor_ENA:
-        [10000,"0x173272739Bd7Aa6e4e214714048a9fE699453059"]
+        {"maxMessageSize":10000,"executor":"0x173272739Bd7Aa6e4e214714048a9fE699453059"}
+++ description: The verification config of the CYBEROFTAdapter for all messages coming from BSC. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])
      values.ulnConfig_CYBER:
-        [15,2,0,0,["0x589dEDbD617e0CBcB916A9223F4d1300c294236b","0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"],[]]
+        {"confirmations":15,"requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["0x589dEDbD617e0CBcB916A9223F4d1300c294236b","0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"],"optionalDVNs":[]}
+++ description: The verification config of the ENAOFTAdapter for all messages coming from Arbitrum. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])
      values.ulnConfig_ENA:
-        [15,2,0,0,["0x380275805876Ff19055EA900CDb2B46a94ecF20D","0x589dEDbD617e0CBcB916A9223F4d1300c294236b"],[]]
+        {"confirmations":15,"requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["0x380275805876Ff19055EA900CDb2B46a94ecF20D","0x589dEDbD617e0CBcB916A9223F4d1300c294236b"],"optionalDVNs":[]}
+++ description: The verification config of the sfrxETHOFTAdapter for all messages coming from Arbitrum. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])
      values.ulnConfig_sfrxETH:
-        [15,2,0,0,["0x380275805876Ff19055EA900CDb2B46a94ecF20D","0x589dEDbD617e0CBcB916A9223F4d1300c294236b"],[]]
+        {"confirmations":15,"requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["0x380275805876Ff19055EA900CDb2B46a94ecF20D","0x589dEDbD617e0CBcB916A9223F4d1300c294236b"],"optionalDVNs":[]}
+++ description: The verification config of the USDT0OFTAdapter for all messages coming from Arbitrum. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])
      values.ulnConfig_USDT0:
-        [15,2,0,0,["0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2","0x589dEDbD617e0CBcB916A9223F4d1300c294236b"],[]]
+        {"confirmations":15,"requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2","0x589dEDbD617e0CBcB916A9223F4d1300c294236b"],"optionalDVNs":[]}
    }
```

Generated with discovered.json: 0xbfb2c8c436d4d43b9767005df6943ba704382723

# Diff at Tue, 01 Apr 2025 15:04:02 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@f9040ac0c636567fba2ad99e659d24ebe375cafa block: 22094603
- current block number: 22174829

## Description

Added USDT0 OFT adapter as escrow and USDT0 DVN info.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22094603 (main branch discovery), not current.

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: None
+++ description: The verification config of the USDT0OFTAdapter for all messages coming from Arbitrum. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])
      values.ulnConfig_USDT0:
+        [15,["0x589dEDbD617e0CBcB916A9223F4d1300c294236b","0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2"],[],0,0,2]
      fieldMeta.ulnConfig_USDT0:
+        {"description":"The verification config of the USDT0OFTAdapter for all messages coming from Arbitrum. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])"}
    }
```

```diff
+   Status: CREATED
    contract USDT0DVN (0x3b0531eB02Ab4aD72e7a531180beeF9493a00dD2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4de7096B2131E84Fd6b2042AD8cd9B4E43F728Fc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x4DFF9b5b0143E642a3F63a5bcf2d1C328e600bf8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OAdapterUpgradeable (0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7087B8011caC9541b388B639a1460D9cbA4eA0A2)
    +++ description: None
```

Generated with discovered.json: 0x61d82678bad9c62034ffdba044e3f7c607c8695b

# Diff at Fri, 21 Mar 2025 10:19:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4eed3e556a58bb9ab448d141c0407f67ca3ce31 block: 22045242
- current block number: 22094603

## Description

Owner change for random token adapter.

## Watched changes

```diff
    contract CyberTokenAdapter (0xCB07992DE144bDeE56fDb66Fff2454B43243b052) {
    +++ description: None
      values.owner:
-        "0x7884f7F04F994da14302a16Cf15E597e31eebECf"
+        "0x455DB34c99A866489F3ac63fa2F068c726BC286b"
    }
```

Generated with discovered.json: 0x5d4301e07fa70e8853b02d925cae2853bcc70efa

# Diff at Fri, 14 Mar 2025 12:53:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a22da884d1a9470186e80799bc96392136af1fbe block: 21943925
- current block number: 22045242

## Description

Owner change.

## Watched changes

```diff
    contract CyberTokenAdapter (0xCB07992DE144bDeE56fDb66Fff2454B43243b052) {
    +++ description: None
      values.owner:
-        "0x455DB34c99A866489F3ac63fa2F068c726BC286b"
+        "0x7884f7F04F994da14302a16Cf15E597e31eebECf"
    }
```

Generated with discovered.json: 0xe05d209a6ca56eb19a8a09230ba7f6528cd1e894

# Diff at Thu, 06 Mar 2025 15:18:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21943925
- current block number: 21943925

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21943925 (main branch discovery), not current.

```diff
    contract BlockedMessageLib (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      name:
-        ""
+        "BlockedMessageLib"
      unverified:
-        true
      values.messageLibType:
+        2
      values.version:
+        {"major":"18446744073709551615","minor":255,"endpointVersion":2}
      sourceHashes:
+        ["0xf00c4e5b1b0f8da8f50ec8b06aa9f6c7275c5f03398e8b607c0ed093e7c4fe40"]
    }
```

Generated with discovered.json: 0x5006145c4f11b6071c929e8e8d3da0eb73ad406c

# Diff at Tue, 04 Mar 2025 11:25:54 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21943925
- current block number: 21943925

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21943925 (main branch discovery), not current.

```diff
    contract  (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      name:
-        "BlockedMessageLib"
+        ""
      sourceHashes:
-        ["0xf00c4e5b1b0f8da8f50ec8b06aa9f6c7275c5f03398e8b607c0ed093e7c4fe40"]
      values.messageLibType:
-        2
      values.version:
-        {"major":"18446744073709551615","minor":255,"endpointVersion":2}
      unverified:
+        true
    }
```

Generated with discovered.json: 0x670bd134ce0dddd064f85983e268df9a193a9747

# Diff at Tue, 04 Mar 2025 10:39:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21943925
- current block number: 21943925

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21943925 (main branch discovery), not current.

```diff
    contract WTIA_OFTAdapter (0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2) {
    +++ description: None
      sinceBlock:
+        19398639
    }
```

```diff
    contract  (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      sinceBlock:
+        19093746
    }
```

```diff
    contract TBankOFT (0x1762c17f671FA27cE6C59256f5F28242de9274d0) {
    +++ description: None
      sinceBlock:
+        19341581
    }
```

```diff
    contract TRESTLE_OFTAdapter (0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E) {
    +++ description: None
      sinceBlock:
+        19941017
    }
```

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: None
      sinceBlock:
+        19093715
    }
```

```diff
    contract BlockedMessageLib (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      sinceBlock:
+        19093715
    }
```

```diff
    contract DineroOFTLockbox (0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208) {
    +++ description: None
      sinceBlock:
+        19330462
    }
```

```diff
    contract StakedFraxEtherOFTAdapter (0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A) {
    +++ description: None
      sinceBlock:
+        19471548
    }
```

```diff
    contract StakedUSDeOFTAdapter (0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2) {
    +++ description: None
      sinceBlock:
+        19392822
    }
```

```diff
    contract FraxSharesOFTAdapter (0x23432452B720C80553458496D4D9d7C5003280d0) {
    +++ description: None
      sinceBlock:
+        19471501
    }
```

```diff
    contract EvmZkMptValidator (0x276816F1931aFac123BdaeA54afF02BE6fd73e14) {
    +++ description: None
      sinceBlock:
+        21077569
    }
```

```diff
    contract HorizenDVN (0x380275805876Ff19055EA900CDb2B46a94ecF20D) {
    +++ description: None
      sinceBlock:
+        19109198
    }
```

```diff
    contract EvmMptValidator (0x38C967856d17E900042Af447B3346bfF26C8ed4B) {
    +++ description: None
      sinceBlock:
+        21077568
    }
```

```diff
    contract CyberTokenAdapter (0x3d2fe83ea885C2E43A422C82C738847669708210) {
    +++ description: None
      sinceBlock:
+        19966610
    }
```

```diff
    contract MysoOFTAdapter (0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6) {
    +++ description: None
      sinceBlock:
+        19724628
    }
```

```diff
    contract ENAOFTAdapter (0x58538e6A46E07434d7E7375Bc268D3cb839C0133) {
    +++ description: None
      sinceBlock:
+        19621397
    }
```

```diff
    contract LayerZeroDVN (0x589dEDbD617e0CBcB916A9223F4d1300c294236b) {
    +++ description: None
      sinceBlock:
+        19093742
    }
```

```diff
    contract USDeOFTAdapter (0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34) {
    +++ description: None
      sinceBlock:
+        19392586
    }
```

```diff
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056) {
    +++ description: None
      sinceBlock:
+        19093724
    }
```

```diff
    contract ParamOFTAdapter (0x6182995916d79DeDb60db1570776F9994fCdCA0a) {
    +++ description: None
      sinceBlock:
+        19922710
    }
```

```diff
    contract ReadLib1002 (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D) {
    +++ description: None
      sinceBlock:
+        21094853
    }
```

```diff
    contract MyOFTAdapter (0x801642B6efB861fE624dAD704b7A747779d9B433) {
    +++ description: None
      sinceBlock:
+        19430083
    }
```

```diff
    contract RSETH_OFTAdapter (0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3) {
    +++ description: None
      sinceBlock:
+        19166120
    }
```

```diff
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24) {
    +++ description: None
      sinceBlock:
+        19294337
    }
```

```diff
    contract  (0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB) {
    +++ description: None
      sinceBlock:
+        19109197
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      sinceBlock:
+        19093732
    }
```

```diff
    contract GnosisSafe (0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7) {
    +++ description: None
      sinceBlock:
+        19296636
    }
```

```diff
    contract WooTokenOFTAdapter (0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711) {
    +++ description: None
      sinceBlock:
+        19769079
    }
```

```diff
    contract  (0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b) {
    +++ description: None
      sinceBlock:
+        19093741
    }
```

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: None
      sinceBlock:
+        19093729
    }
```

```diff
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2) {
    +++ description: None
      sinceBlock:
+        19093731
    }
```

```diff
    contract CyberTokenAdapter (0xCB07992DE144bDeE56fDb66Fff2454B43243b052) {
    +++ description: None
      sinceBlock:
+        20081436
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
    contract GoogleCloudDVN (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sinceBlock:
+        18095084
    }
```

```diff
    contract KinetixFinanceTokenOFTAdapter (0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf) {
    +++ description: None
      sinceBlock:
+        19889373
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
    contract ZkBridgeAdmin (0xe16d201cA134345601631D327a971A3741646B0d) {
    +++ description: None
      sinceBlock:
+        19291481
    }
```

```diff
    contract StakedFraxOFTAdapter (0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E) {
    +++ description: None
      sinceBlock:
+        19471547
    }
```

```diff
    contract MaviaOFTAdapter (0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D) {
    +++ description: None
      sinceBlock:
+        19294730
    }
```

```diff
    contract EtherFiOFTAdapter (0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D) {
    +++ description: None
      sinceBlock:
+        19630191
    }
```

Generated with discovered.json: 0x8655f685e513a1f4afef472be4a47ec129a1c889

# Diff at Fri, 28 Feb 2025 09:24:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a673c79f7be232b805781e844ed3929c5c5bb288 block: 21910109
- current block number: 21943925

## Description

BlockedMessageLib verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21910109 (main branch discovery), not current.

```diff
    contract BlockedMessageLib (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      name:
-        ""
+        "BlockedMessageLib"
      unverified:
-        true
      values.messageLibType:
+        2
      values.version:
+        {"major":"18446744073709551615","minor":255,"endpointVersion":2}
      sourceHashes:
+        ["0xf00c4e5b1b0f8da8f50ec8b06aa9f6c7275c5f03398e8b607c0ed093e7c4fe40"]
    }
```

Generated with discovered.json: 0x84f31a7ab770e0165f9cd087e6de64edcdd466d9

# Diff at Thu, 27 Feb 2025 11:45:54 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21910109
- current block number: 21910109

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21910109 (main branch discovery), not current.

```diff
    contract  (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      name:
-        "BlockedMessageLib"
+        ""
      sourceHashes:
-        ["0xf00c4e5b1b0f8da8f50ec8b06aa9f6c7275c5f03398e8b607c0ed093e7c4fe40"]
      values.messageLibType:
-        2
      values.version:
-        {"major":"18446744073709551615","minor":255,"endpointVersion":2}
      unverified:
+        true
    }
```

Generated with discovered.json: 0x18f71c002c81ae000bb4ca18f2aa1acd3b230aed

# Diff at Wed, 12 Feb 2025 10:38:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21736831
- current block number: 21829857

## Description

BlockedMessageLib is now verified. A library that blocks any messages that specify it as required.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736831 (main branch discovery), not current.

```diff
    contract BlockedMessageLib (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      name:
-        ""
+        "BlockedMessageLib"
      unverified:
-        true
      values.messageLibType:
+        2
      values.version:
+        {"major":"18446744073709551615","minor":255,"endpointVersion":2}
      sourceHashes:
+        ["0xf00c4e5b1b0f8da8f50ec8b06aa9f6c7275c5f03398e8b607c0ed093e7c4fe40"]
    }
```

Generated with discovered.json: 0x8d08cb88bfc390ce887a6133ae3357b6620f2ede

# Diff at Thu, 30 Jan 2025 11:09:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2da0612158e4fa23c41926c49e88a7b955a8c5dc block: 21723792
- current block number: 21736831

## Description

DVN in ulnConfig for sfrxETH changed: Google Cloud replaced with Horizen.

## Watched changes

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: None
+++ description: The verification config of the sfrxETHOFTAdapter for all messages coming from Arbitrum. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])
      values.ulnConfig_sfrxETH.4.1:
-        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
+        "0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
+++ description: The verification config of the sfrxETHOFTAdapter for all messages coming from Arbitrum. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])
      values.ulnConfig_sfrxETH.4.0:
-        "0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
+        "0x380275805876Ff19055EA900CDb2B46a94ecF20D"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723792 (main branch discovery), not current.

```diff
    contract HorizenDVN (0x380275805876Ff19055EA900CDb2B46a94ecF20D) {
    +++ description: None
      name:
-        "DVN"
+        "HorizenDVN"
    }
```

Generated with discovered.json: 0x6db8d30c7c448a7921f171e4a4ca093a4f1b08f9

# Diff at Tue, 28 Jan 2025 15:04:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 21387348
- current block number: 21723792

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

Generated with discovered.json: 0xf536f7bfc336f80cd9d5643513263143b83a7d2e

# Diff at Mon, 20 Jan 2025 11:09:41 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21387348
- current block number: 21387348

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387348 (main branch discovery), not current.

```diff
    contract  (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3"
      issuedPermissions.0.to:
+        "0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3"
    }
```

```diff
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe16d201cA134345601631D327a971A3741646B0d"
      issuedPermissions.0.to:
+        "0xe16d201cA134345601631D327a971A3741646B0d"
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x173272739Bd7Aa6e4e214714048a9fE699453059"
      receivedPermissions.0.from:
+        "0x173272739Bd7Aa6e4e214714048a9fE699453059"
    }
```

```diff
    contract ZkBridgeAdmin (0xe16d201cA134345601631D327a971A3741646B0d) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"
      receivedPermissions.0.from:
+        "0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"
    }
```

Generated with discovered.json: 0x4c2ba200f4be2c36d2f0705ec8b9c7823d73a211

# Diff at Thu, 12 Dec 2024 15:37:10 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21334435
- current block number: 21387348

## Description

Changed WooTokenOFTAdapter owner to Multisig, previously an EOA.

## Watched changes

```diff
    contract WooTokenOFTAdapter (0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711) {
    +++ description: None
      values.owner:
-        "0xc031C368b51c28266396273b0C6ce2489b00969d"
+        "0x155EEF9731aFf5aE6cB2741F7bEC0f005037aCB0"
    }
```

Generated with discovered.json: 0x563823d469aa3d17fd321481192440eeea736a11

# Diff at Thu, 05 Dec 2024 06:15:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 21279524
- current block number: 21334435

## Description

Woo OFT token admin change.

## Watched changes

```diff
    contract WooTokenOFTAdapter (0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711) {
    +++ description: None
      values.owner:
-        "0x155EEF9731aFf5aE6cB2741F7bEC0f005037aCB0"
+        "0xc031C368b51c28266396273b0C6ce2489b00969d"
    }
```

Generated with discovered.json: 0xe6e432dff3e86ca742b1e87d73800934d44f40c8

# Diff at Wed, 27 Nov 2024 13:56:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3b9391cfe483e60a1853eeae6e47b4de475aac4e block: 21184706
- current block number: 21279524

## Description

Owner for WOO changed two times. The intermediate owner EOA was https://etherscan.io/address/0xc031C368b51c28266396273b0C6ce2489b00969d who changed some peers and configs.

## Watched changes

```diff
    contract WooTokenOFTAdapter (0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711) {
    +++ description: None
      values.owner:
-        "0x39e4fac1A21AE1D8c76B0ac52aC0417398fE738d"
+        "0x155EEF9731aFf5aE6cB2741F7bEC0f005037aCB0"
    }
```

Generated with discovered.json: 0xf8073d8b8ed50a1a342d050ed69f56f9f7dc70f9

# Diff at Thu, 14 Nov 2024 08:21:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 21121843
- current block number: 21184706

## Description

Polyhedra DVN contract upgraded, new verifiers linked.

## Watched changes

```diff
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24) {
    +++ description: None
      sourceHashes.1:
-        "0x28e4c0a9b19237dbabd13c2ff57934b80b69c88954b99bd66c38e3626a030b26"
+        "0x7b47ae15df80519afbed6bca2472ab35b7e20938dfc898ececbbb6d1c7a369a0"
      values.$implementation:
-        "0xcb75F0dFFf5c5046CAA9dB1DE56645a962FeFFc2"
+        "0xdFf54e8d2B31A197DC5859739E7177AA31fC3390"
      values.$pastUpgrades.2:
+        ["2024-11-12T05:45:11.000Z","0xc8f7a01b73f35e11ca4263d71196b6490da462b11cda69f32b53f91177b9b04f",["0xdFf54e8d2B31A197DC5859739E7177AA31fC3390"]]
      values.$upgradeCount:
-        2
+        3
      values.MESSAGE_TOPIC_V1:
-        "0x3dc6f2ede34d1db05729bbb76e5efd17ec1bc83f98f665e7fba0596dca438b96"
      values.MESSAGE_TOPIC_V2:
-        "0x1ab700d4ced0c005b164c0f789fd09fcbb0156d4c2041b8a3bfbcd961cd1567f"
      values.mptValidator:
-        "0x8022ceAa2771FdC188a6f3c783e7207F53B121D2"
      values.zkMptValidator:
-        "0x4b9D6177a832376867F1723158BD6eF5E9c7fc5f"
      values.defaultTxValidator:
+        "0x38C967856d17E900042Af447B3346bfF26C8ed4B"
      values.defaultZkValidator:
+        "0x276816F1931aFac123BdaeA54afF02BE6fd73e14"
      values.sender:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract EvmZkMptValidator (0x276816F1931aFac123BdaeA54afF02BE6fd73e14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EvmMptValidator (0x38C967856d17E900042Af447B3346bfF26C8ed4B)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/EvmMptValidator.sol             | 723 +++++++++++++++++++++
 .../ethereum/.flat/EvmZkMptValidator.sol           | 287 ++++++++
 .../PolyhedraDVN/ZkBridgeOracleV2.sol              | 687 +++++---------------
 3 files changed, 1164 insertions(+), 533 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21121843 (main branch discovery), not current.

```diff
    contract ReadLib1002 (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D) {
    +++ description: None
      name:
-        ""
+        "ReadLib1002"
      unverified:
-        true
      values.getTreasuryAndNativeFeeCap:
+        ["0x0000000000000000000000000000000000000000",450000000000000]
      values.messageLibType:
+        2
      values.owner:
+        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
      values.version:
+        {"major":10,"minor":0,"endpointVersion":2}
      sourceHashes:
+        ["0xf7800be6fd99520201da1404c35bac8a1ed826bbc2134f0a77547e0d7a74c9c1"]
    }
```

Generated with discovered.json: 0xf47e257a4f963ed5e4deb297ed84e0342635cca1

# Diff at Tue, 05 Nov 2024 13:48:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21027620
- current block number: 21121843

## Description

A new unverified send- or receive library is added by the LayerZeroMultisig, but not yet used for the monitored OApps, nor as default, nor is it described in the docs.

This is a good example of an attack we would not notice because we cannot monitor all OApps and if someone is using this new library for any of them.

Also, the unverified LayerZero Executor is upgraded.

## Watched changes

```diff
    contract  (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      values.$implementation:
-        "0xDaC2d26317C42ae3CB21357B73404120E1dA4232"
+        "0xfE9AB78eD4f9f3DbB168d9f5E5213d78605C9805"
      values.$pastUpgrades.2:
+        ["2024-11-01T19:07:23.000Z","0x8714871659f7ff2feb7968256c3baf39e5cdbe9160f36649f8a530a536456ed5",["0xfE9AB78eD4f9f3DbB168d9f5E5213d78605C9805"]]
      values.$upgradeCount:
-        2
+        3
    }
```

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: None
+++ description: All registered libraries in the Ethereum LZ Endpoint. Index 0 is the blockedLibrary, 1 and 2 are send and receive. Send- and ReceiveLibraries define the messaging framework (that can be further configured by the OApp owner). A new MessageLibrary should be thoroughly reviewed, especially if it is set as the default Library in new OApps.
+++ severity: HIGH
      values.getRegisteredLibraries.3:
+        "0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D"
    }
```

```diff
+   Status: CREATED
    contract  (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D)
    +++ description: None
```

Generated with discovered.json: 0xfd72ec3cb3bb0bba544ff22a06ddb27c3f7c7e0e

# Diff at Wed, 23 Oct 2024 10:15:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 20240831
- current block number: 21027620

## Description

LayerZero Multisig: One signer removed.

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

Generated with discovered.json: 0xd7465e1528846b3a3991dade354c65420c16f019

# Diff at Mon, 21 Oct 2024 11:07:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20240831
- current block number: 20240831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240831 (main branch discovery), not current.

```diff
    contract  (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xDaC2d26317C42ae3CB21357B73404120E1dA4232"]
      values.$pastUpgrades.1.1:
-        ["0xDaC2d26317C42ae3CB21357B73404120E1dA4232"]
+        "0x22c22ee402c4be83ef7c851992c3125008be9ee0a39c0d83cf6be91a0506f7c4"
      values.$pastUpgrades.0.2:
+        ["0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"]
      values.$pastUpgrades.0.1:
-        ["0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"]
+        "0x5df683475486093be4a4f92d6f7c47548d3bf38e1a39e25bf0028353f83d4a2b"
    }
```

```diff
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xcb75F0dFFf5c5046CAA9dB1DE56645a962FeFFc2"]
      values.$pastUpgrades.1.1:
-        ["0xcb75F0dFFf5c5046CAA9dB1DE56645a962FeFFc2"]
+        "0xb44d10c422927d170b63ff39214aec136115e4fb60ac93abd4c8c9598f06a115"
      values.$pastUpgrades.0.2:
+        ["0x156C3E0384459E07Dca7849b79196FbC5877dc3A"]
      values.$pastUpgrades.0.1:
-        ["0x156C3E0384459E07Dca7849b79196FbC5877dc3A"]
+        "0xa4e1836bf1b83f9b018b33923bd8df6152b08b6ab94860e3cf51c563711ca18c"
    }
```

Generated with discovered.json: 0xaea213a98e3dcd72a1f40e74546d57deebfb1b83

# Diff at Mon, 14 Oct 2024 10:52:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20240831
- current block number: 20240831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240831 (main branch discovery), not current.

```diff
    contract WTIA_OFTAdapter (0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2) {
    +++ description: None
      sourceHashes:
+        ["0xc645ae3293eef96881a8a34ad011853701ce0fc0f84f1e16be21348243dc23cd"]
    }
```

```diff
    contract TBankOFT (0x1762c17f671FA27cE6C59256f5F28242de9274d0) {
    +++ description: None
      sourceHashes:
+        ["0xba83e8b07a793eb94956a82d951d156b8192e46d2ec4a546c0582ec3012caca4"]
    }
```

```diff
    contract TRESTLE_OFTAdapter (0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E) {
    +++ description: None
      sourceHashes:
+        ["0x545dea510da54ad1f4ef1409aa1b7b6c39ffa522331dfcfdbaba275722af5b12"]
    }
```

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: None
      sourceHashes:
+        ["0x399160e7d36a21fca31097d7875daed8f421f788b77f2a71974d51938c3ea520"]
    }
```

```diff
    contract DineroOFTLockbox (0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208) {
    +++ description: None
      sourceHashes:
+        ["0xd0900deb37eddc5cdfd57b8661fdc3ce4992abe9370076218206793aa712f44c"]
    }
```

```diff
    contract StakedFraxEtherOFTAdapter (0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A) {
    +++ description: None
      sourceHashes:
+        ["0x4a403198a2a3bcd35a947c909f95e42965212a8cfee7b7f0a492a81b290343cb"]
    }
```

```diff
    contract StakedUSDeOFTAdapter (0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2) {
    +++ description: None
      sourceHashes:
+        ["0x24c3e4cbee746bcb3966b274859dcf02dd148b892f0b42a8ce393052c55e2066"]
    }
```

```diff
    contract FraxSharesOFTAdapter (0x23432452B720C80553458496D4D9d7C5003280d0) {
    +++ description: None
      sourceHashes:
+        ["0x3bced0e183d2d8be858477bfefec195b6ff414c579fba5e35fc6ba6f67dd7296"]
    }
```

```diff
    contract DVN (0x380275805876Ff19055EA900CDb2B46a94ecF20D) {
    +++ description: None
      sourceHashes:
+        ["0x67b975b3ef00e71be27727f49933e41872aa848504565806e3e3482a2245f99c"]
    }
```

```diff
    contract CyberTokenAdapter (0x3d2fe83ea885C2E43A422C82C738847669708210) {
    +++ description: None
      sourceHashes:
+        ["0xe07dd12133eb1c78e9a2cb67f7cb405dbbedc163d62174b5ffe3357666572473"]
    }
```

```diff
    contract MysoOFTAdapter (0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6) {
    +++ description: None
      sourceHashes:
+        ["0x89688d13ddfdb2a91fb45b3eac55658cc0cd5b58fd0924e24cad003ba9b04758"]
    }
```

```diff
    contract ENAOFTAdapter (0x58538e6A46E07434d7E7375Bc268D3cb839C0133) {
    +++ description: None
      sourceHashes:
+        ["0x40d7122474d8afc304e108f00e9254fe8ef72f42c28ee634f42aa1ea6b8499cf"]
    }
```

```diff
    contract LayerZeroDVN (0x589dEDbD617e0CBcB916A9223F4d1300c294236b) {
    +++ description: None
      sourceHashes:
+        ["0x67b975b3ef00e71be27727f49933e41872aa848504565806e3e3482a2245f99c"]
    }
```

```diff
    contract USDeOFTAdapter (0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34) {
    +++ description: None
      sourceHashes:
+        ["0xccd3f36cc1147f6282362915f6dfbd4ad890475203975c33b3733ee32c3f75cf"]
    }
```

```diff
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056) {
    +++ description: None
      sourceHashes:
+        ["0x79f573a9d94def8dc0b4319d44595f806685b0ca5875891eff1ed40a9ff6b6e0"]
    }
```

```diff
    contract ParamOFTAdapter (0x6182995916d79DeDb60db1570776F9994fCdCA0a) {
    +++ description: None
      sourceHashes:
+        ["0xf5e370b31bd00c58182289a46e61d7a01400ad2073e75d0d64108c27cbfebf8f"]
    }
```

```diff
    contract MyOFTAdapter (0x801642B6efB861fE624dAD704b7A747779d9B433) {
    +++ description: None
      sourceHashes:
+        ["0x8f58c00c46fa24ad1de2834e09eb6c9113cb1bd0f3f93e317d41848b4267aed5"]
    }
```

```diff
    contract RSETH_OFTAdapter (0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3) {
    +++ description: None
      sourceHashes:
+        ["0x846cd86e3fbb7c7164e6107fcf83b92b24b0f4cf399c4b7b39e01cc88f44c91a"]
    }
```

```diff
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x28e4c0a9b19237dbabd13c2ff57934b80b69c88954b99bd66c38e3626a030b26"]
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      sourceHashes:
+        ["0x130b90ae0c02f239d1ce8b414a1a9a49d97708bb4f07d7e9c69af4f7c8a8f5bc"]
    }
```

```diff
    contract GnosisSafe (0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract WooTokenOFTAdapter (0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711) {
    +++ description: None
      sourceHashes:
+        ["0xf00fd4e6de8da1f5359ed1cbafdbeaf3ca5063b2099fd4eb70d150876d908e33"]
    }
```

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: None
      sourceHashes:
+        ["0x159d8f84a5100285a7401e1ccb3d40a64fe944d9beb951c81749de40279a5876"]
    }
```

```diff
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2) {
    +++ description: None
      sourceHashes:
+        ["0x3904c78c7b0abf91f9544ebb9f08f2d2bc83028df65c912a7f7a6ca1ca109dde"]
    }
```

```diff
    contract CyberTokenAdapter (0xCB07992DE144bDeE56fDb66Fff2454B43243b052) {
    +++ description: None
      sourceHashes:
+        ["0xdce3b87706451ccc7b085067f6799a004de54f2f3a9a58acc51b736e8c5b50c5"]
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
    contract GoogleCloudDVN (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    +++ description: None
      sourceHashes:
+        ["0x1be31a02ca7158d467a49eeb964f0f8aa1d1e74019df854c1881d89d51260701"]
    }
```

```diff
    contract KinetixFinanceTokenOFTAdapter (0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf) {
    +++ description: None
      sourceHashes:
+        ["0xbdb5d856720cc4b696952d51301dd3c0e81cff33f44b2b099679d8fe2d343861"]
    }
```

```diff
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    +++ description: None
      sourceHashes:
+        ["0x37e1cee9d0a4ad6ebb439d27dbbf23925fcd9f9c0d5b43a33a6335e62b54d18c"]
    }
```

```diff
    contract ZkBridgeAdmin (0xe16d201cA134345601631D327a971A3741646B0d) {
    +++ description: None
      sourceHashes:
+        ["0x062ac536d5e166756d049e5291a179675915fffdd3c12bd2d98cc2d83f77403c"]
    }
```

```diff
    contract StakedFraxOFTAdapter (0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E) {
    +++ description: None
      sourceHashes:
+        ["0x4e7c9ed835cefe312e55b3bec6bd77fca1a30058b4bb1a6b1d32ce2968bd0e3e"]
    }
```

```diff
    contract MaviaOFTAdapter (0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D) {
    +++ description: None
      sourceHashes:
+        ["0xa6367e87486cfaf6777e95cef7398c1ad3fc2c50bdbdec7e25af7d2494eb448f"]
    }
```

```diff
    contract EtherFiOFTAdapter (0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D) {
    +++ description: None
      sourceHashes:
+        ["0xfc3378db03fff87c68201589b229f1bb65fea0d487f8f4e41aa8f0381a7e0465"]
    }
```

Generated with discovered.json: 0x3b28c41548de3136a11febbba6178e14a440d00e

# Diff at Tue, 01 Oct 2024 10:52:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20240831
- current block number: 20240831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240831 (main branch discovery), not current.

```diff
    contract  (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-26T22:27:23.000Z",["0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"]],["2024-07-04T23:54:35.000Z",["0xDaC2d26317C42ae3CB21357B73404120E1dA4232"]]]
    }
```

```diff
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-24T02:03:23.000Z",["0x156C3E0384459E07Dca7849b79196FbC5877dc3A"]],["2024-02-24T03:05:35.000Z",["0xcb75F0dFFf5c5046CAA9dB1DE56645a962FeFFc2"]]]
    }
```

Generated with discovered.json: 0x20e1f893c77b4349d866ba3d8ec1035341241ad5

# Diff at Fri, 30 Aug 2024 07:53:24 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20240831
- current block number: 20240831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240831 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ZkBridgeAdmin (0xe16d201cA134345601631D327a971A3741646B0d) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xcd2a689d6750a62a1302178fc2adfd5c7c3c58c4

# Diff at Fri, 23 Aug 2024 09:52:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20240831
- current block number: 20240831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240831 (main branch discovery), not current.

```diff
    contract  (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x5414a97dd5543404152fbbe7615fb3b81bc7b40a

# Diff at Wed, 21 Aug 2024 10:03:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20240831
- current block number: 20240831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240831 (main branch discovery), not current.

```diff
    contract  (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3","via":[]}]
    }
```

```diff
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xe16d201cA134345601631D327a971A3741646B0d","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x173272739Bd7Aa6e4e214714048a9fE699453059"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x173272739Bd7Aa6e4e214714048a9fE699453059","via":[]}]
    }
```

```diff
    contract ZkBridgeAdmin (0xe16d201cA134345601631D327a971A3741646B0d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x8ddF05F9A5c488b4973897E278B58895bF87Cb24","via":[]}]
    }
```

Generated with discovered.json: 0x95036ebd0dd85e7b448a1304bbd8ceaa5abe3439

# Diff at Fri, 09 Aug 2024 10:10:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20240831
- current block number: 20240831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240831 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x173272739Bd7Aa6e4e214714048a9fE699453059"]
      assignedPermissions.upgrade:
+        ["0x173272739Bd7Aa6e4e214714048a9fE699453059"]
    }
```

```diff
    contract GnosisSafe (0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xd1846C61A063edA820305A5e568A12a570420cf6","0x1e56cAa34ae155aB8AfAB2D1e2A37580a04A494C","0xF94b16157948E10597481Da0523927c8BA0bd182","0x7Af345AD8c2E7372C5aCEaAf86Bda08676e3d634","0x1082E92A0b92e15212fD5879C1dd672AB548302c"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xd1846C61A063edA820305A5e568A12a570420cf6","0x1e56cAa34ae155aB8AfAB2D1e2A37580a04A494C","0xF94b16157948E10597481Da0523927c8BA0bd182","0x7Af345AD8c2E7372C5aCEaAf86Bda08676e3d634","0x1082E92A0b92e15212fD5879C1dd672AB548302c"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
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

```diff
    contract ZkBridgeAdmin (0xe16d201cA134345601631D327a971A3741646B0d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"]
      assignedPermissions.upgrade:
+        ["0x8ddF05F9A5c488b4973897E278B58895bF87Cb24"]
    }
```

Generated with discovered.json: 0xb8797220a861e54807289ca788935a15074c037c

# Diff at Tue, 30 Jul 2024 11:12:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20240831
- current block number: 20240831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240831 (main branch discovery), not current.

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: None
      fieldMeta:
+        {"getRegisteredLibraries":{"severity":"HIGH","description":"All registered libraries in the Ethereum LZ Endpoint. Index 0 is the blockedLibrary, 1 and 2 are send and receive. Send- and ReceiveLibraries define the messaging framework (that can be further configured by the OApp owner). A new MessageLibrary should be thoroughly reviewed, especially if it is set as the default Library in new OApps."},"defaultSendLib_ENA":{"severity":"HIGH","description":"The default send lib can be different for every OApp. In practice it is the same for most OApps. Should be reviewed if changed."},"defaultReceiveLib_rsETH":{"severity":"HIGH","description":"The default receive lib can be different for every OApp. In practice it is the same for most OApps. Should be reviewed if changed."}}
    }
```

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: None
      fieldMeta:
+        {"defaultExecutor_ENA":{"severity":"HIGH","description":"The default executor can be different for every OApp. In practice it is the same for most OApps. (LayerZero Executor) Should be reviewed if changed."},"ulnConfig_ENA":{"description":"The verification config of the ENAOFTAdapter for all messages coming from Arbitrum. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])"},"ulnConfig_sfrxETH":{"description":"The verification config of the sfrxETHOFTAdapter for all messages coming from Arbitrum. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])"},"ulnConfig_CYBER":{"description":"The verification config of the CYBEROFTAdapter for all messages coming from BSC. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])"}}
    }
```

Generated with discovered.json: 0xa5327b8353d3fca800f79d5f9c169092055531e1

# Diff at Fri, 05 Jul 2024 14:14:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@111fee0655d72e75c60324b920975e421fd852f7 block: 20138516
- current block number: 20240831

## Description

The LayerZero Executor contract is upgraded to a new implementation. (stays unverified)

## Watched changes

```diff
    contract  (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      upgradeability.implementation:
-        "0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"
+        "0xDaC2d26317C42ae3CB21357B73404120E1dA4232"
      implementations.0:
-        "0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"
+        "0xDaC2d26317C42ae3CB21357B73404120E1dA4232"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20138516 (main branch discovery), not current.

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

Generated with discovered.json: 0x69b652896ca1778b4115ad19a6abab102895ceab

# Diff at Fri, 21 Jun 2024 07:11:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ba6434de248c46d9e6b140264866a3072082af4 block: 20119772
- current block number: 20138516

## Description

Ignore Verifier fees.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20119772 (main branch discovery), not current.

```diff
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24) {
    +++ description: None
      values.feeBalance:
-        "2918325000000000000"
    }
```

Generated with discovered.json: 0x7146967f0fe12eb84f3dd406cb52c5cc557a8f49

# Diff at Tue, 18 Jun 2024 16:16:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20119772

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract WTIA_OFTAdapter (0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x173272739Bd7Aa6e4e214714048a9fE699453059)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TBankOFT (0x1762c17f671FA27cE6C59256f5F28242de9274d0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TRESTLE_OFTAdapter (0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DineroOFTLockbox (0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakedFraxEtherOFTAdapter (0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakedUSDeOFTAdapter (0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FraxSharesOFTAdapter (0x23432452B720C80553458496D4D9d7C5003280d0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DVN (0x380275805876Ff19055EA900CDb2B46a94ecF20D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CyberTokenAdapter (0x3d2fe83ea885C2E43A422C82C738847669708210)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MysoOFTAdapter (0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ENAOFTAdapter (0x58538e6A46E07434d7E7375Bc268D3cb839C0133)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZeroDVN (0x589dEDbD617e0CBcB916A9223F4d1300c294236b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDeOFTAdapter (0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ParamOFTAdapter (0x6182995916d79DeDb60db1570776F9994fCdCA0a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MyOFTAdapter (0x801642B6efB861fE624dAD704b7A747779d9B433)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RSETH_OFTAdapter (0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolyhedraDVN (0x8ddF05F9A5c488b4973897E278B58895bF87Cb24)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x9bfAc7947FC1b64aA9F12b24EcD519DaEcEf3Ba5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x9E930731cb4A6bf7eCc11F695A295c60bDd212eB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xA926F089e07A9fd7A1A9438b1Bb801963807A6d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WooTokenOFTAdapter (0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xb3e790273f0A89e53d2C20dD4dFe82AA00bbf91b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CyberTokenAdapter (0xCB07992DE144bDeE56fDb66Fff2454B43243b052)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GoogleCloudDVN (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KinetixFinanceTokenOFTAdapter (0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkBridgeAdmin (0xe16d201cA134345601631D327a971A3741646B0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakedFraxOFTAdapter (0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaviaOFTAdapter (0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiOFTAdapter (0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D)
    +++ description: None
```
