Generated with discovered.json: 0x69214b47b214dcf088ec96967e607890be0401f3

# Diff at Thu, 30 Apr 2026 13:15:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1777539411

## Description

re-add entire gnosis disco incl bridge, consensus and Hashi.

## Initial discovery

```diff
+   Status: CREATED
    contract Yaru (eth:0x30f64a297cc66a873FB603d1e89D5891962C25ba)
    +++ description: Contract handling inbound messages for the Hashi protocol.
```

```diff
+   Status: CREATED
    contract Gnosis Bridge Multisig (eth:0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XDaiForeignBridge (eth:0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Hashi Multisig (eth:0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ForeignAMB (eth:0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenFactory (eth:0x71d5ba4e37de72415F685490B684538Aae8f0424)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermittableToken (eth:0x7c24d0061b484B267F286aa2DCe891220Db254b3)
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (eth:0x839395e20bbB182fa440d08F850E6c7A8f6F0780)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ForeignOmnibridge (eth:0x88ad09518695c6c3712AC10a214bE5109a655671)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashiManager (eth:0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9)
    +++ description: A hub contract for the Hashi protocol, an EVM Hash Oracle Aggregator.
```

```diff
+   Status: CREATED
    contract BridgeRouter (eth:0x9a873656c19Efecbfb4f9FAb5B7acdeAb466a0B0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashiManager (eth:0x9acCFAD714A1e670CD1f6dc666FE892d1d5547BD)
    +++ description: A hub contract for the Hashi protocol, an EVM Hash Oracle Aggregator.
```

```diff
+   Status: CREATED
    contract WETHOmnibridgeRouter (eth:0xa6439Ca0FCbA1d0F80df0bE6A17220feD9c9038a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Hashi (eth:0xA86bc62Ac53Dc86687AB6C15fdebC71ad51fB615)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Yaho (eth:0xbAE4Ebbf42815BB9Bc3720267Ea4496277d60DB8)
    +++ description: Contract handling outbound messages for the Hashi protocol.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xD7e65A32bEd4ce8cc57Ec188F2bBb8016dc4b1cd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeValidators (eth:0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E)
    +++ description: Custom multisignature contract for Validator addresses.
```

```diff
+   Status: CREATED
    contract BridgeValidators (eth:0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064)
    +++ description: Custom multisignature contract for Validator addresses.
```

```diff
+   Status: CREATED
    contract Yaru (gno:0x153801d0B85D2FCAc6EA07446b6A709ce6720AC5)
    +++ description: Contract handling inbound messages for the Hashi protocol.
```

```diff
+   Status: CREATED
    contract BlockRewardAuRa (gno:0x481c034c6d9441db23Ea48De68BCAe812C5d39bA)
    +++ description: Part of the deprecated AuRa (Authority Round)  proof-of-authority consensus model. Gnosis switched to an Ethereum-like consensus but some contracts like this one are still used. Mints of the gas token xDAI are queued in this contract (`addExtraReceiver(amount, recipient)`) and then executed by the gnosis execution client. There are more AuRa contracts this depends on which are not tracked here.
```

```diff
+   Status: CREATED
    contract USDSDepositContract (gno:0x5C183C8A49aBA6e31049997a56D75600E27FF8c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashiManager (gno:0x60Aa15198a3AdfC86FF15B941549A6447B2dDB49)
    +++ description: A hub contract for the Hashi protocol, an EVM Hash Oracle Aggregator.
```

```diff
+   Status: CREATED
    contract HomeBridgeErcToNative (gno:0x7301CFA0e1756B71869E93d4e4Dca5c7d0eb0AA6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashiManager (gno:0x74CACae9801bA4Fe0027Ed6F58d53797CCa7296E)
    +++ description: A hub contract for the Hashi protocol, an EVM Hash Oracle Aggregator.
```

```diff
+   Status: CREATED
    contract HomeAMB (gno:0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (gno:0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Helios (gno:0x7CE84Eea8Fbe3cD9Afb40475E7257837E18745C8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1HeliosAdapter (gno:0x9C63010F056E4692A44A510F2F5E8A44B94960Bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeValidators (gno:0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008)
    +++ description: Custom multisignature contract for Validator addresses.
```

```diff
+   Status: CREATED
    contract LayerZeroReporter (gno:0xA3Bc83D557E3f2dDfF4D44966A96397760159D8B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (gno:0xa5E60dbBAc6A65B654E5A14A5E357da3Fcf139dd)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract Hashi (gno:0xA86bc62Ac53Dc86687AB6C15fdebC71ad51fB615)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeValidators (gno:0xB289f0e6fBDFf8EEE340498a56e1787B303F1B6D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Yaho (gno:0xbAE4Ebbf42815BB9Bc3720267Ea4496277d60DB8)
    +++ description: Contract handling outbound messages for the Hashi protocol.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (gno:0xEF138856d0581641A57245Ee5CFfc9ceaA059623)
    +++ description: None
```
