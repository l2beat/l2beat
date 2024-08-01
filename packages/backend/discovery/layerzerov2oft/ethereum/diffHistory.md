Generated with discovered.json: 0x40f12d6a747f031219205351a51c8ca1c8ee09f0

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
