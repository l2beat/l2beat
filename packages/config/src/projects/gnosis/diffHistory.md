Generated with discovered.json: 0xf76ff9e0fee484477e065d53f1dead6761cd7f89

# Diff at Fri, 01 May 2026 07:31:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1777539411

## Description

re-add entire gnosis disco incl bridge, consensus and Hashi.

## Initial discovery

```diff
+   Status: CREATED
    contract Yaru (eth:0x30f64a297cc66a873FB603d1e89D5891962C25ba)
    +++ description: Inbound executor in Hashi. It reconstructs message IDs, asks Hashi whether enough adapters agreed on the hash, and then calls the target bridge receiver.
```

```diff
+   Status: CREATED
    contract Gnosis Bridge Multisig (Ethereum) (eth:0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XDaiForeignBridge (eth:0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016)
    +++ description: Ethereum-side ERC20-to-native bridge used to lock DAI or USDS on Ethereum and authorize xDAI minting on Gnosis. Message execution is validated by a dedicated validator set and can additionally be gated by Hashi.
```

```diff
+   Status: CREATED
    contract Hashi Multisig (Ethereum) (eth:0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ForeignAMB (eth:0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e)
    +++ description: Ethereum-side Arbitrary Message Bridge endpoint that verifies validator signatures before relaying cross-chain calls to Gnosis. Hashi can be enabled as an additional verification layer.
```

```diff
+   Status: CREATED
    contract ForeignOmnibridge TokenFactory (eth:0x71d5ba4e37de72415F685490B684538Aae8f0424)
    +++ description: Factory used by Omnibridge to deploy wrapped tokens representing assets native to the other chain.
```

```diff
+   Status: CREATED
    contract LayerZeroAdapter (eth:0x7606e9d8655e48159E7beC8541C2E71A7Aa3E418)
    +++ description: Hashi adapter that receives message-hash batches over LayerZero and stores them under the configured source chain for later Hashi aggregation.
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
    +++ description: Ethereum-side Omnibridge mediator used for arbitrary token transfers between Ethereum and Gnosis via the AMB bridge.
```

```diff
+   Status: CREATED
    contract ForeignAMB HashiManager (eth:0x93f6eE78451AaCc1Db1db49a12aBfCc4662B9Cc9)
    +++ description: Configuration contract that tells bridge contracts how to use Hashi as an additional message-validation layer.
```

```diff
+   Status: CREATED
    contract BridgeRouter (eth:0x9a873656c19Efecbfb4f9FAb5B7acdeAb466a0B0)
    +++ description: Entry router for bridging between Ethereum and Gnosis. It routes DAI and USDS through the legacy xDAI bridge, ETH through the WETH Omnibridge router, and other ERC20 tokens through Omnibridge.
```

```diff
+   Status: CREATED
    contract XDaiForeignBridge HashiManager (eth:0x9acCFAD714A1e670CD1f6dc666FE892d1d5547BD)
    +++ description: Configuration contract that tells bridge contracts how to use Hashi as an additional message-validation layer.
```

```diff
+   Status: CREATED
    contract WETHOmnibridgeRouter (eth:0xa6439Ca0FCbA1d0F80df0bE6A17220feD9c9038a)
    +++ description: Router that wraps native ETH into WETH before sending it through Omnibridge and unwraps it again on Gnosis when bridge messages are executed.
```

```diff
+   Status: CREATED
    contract Hashi (eth:0xA86bc62Ac53Dc86687AB6C15fdebC71ad51fB615)
    +++ description: Hashi is an EVM hash oracle aggregator. It checks whether a configurable threshold of adapters agree on a block or message hash before downstream contracts accept that data.
```

```diff
+   Status: CREATED
    contract Yaho (eth:0xbAE4Ebbf42815BB9Bc3720267Ea4496277d60DB8)
    +++ description: Outbound dispatcher in Hashi. It commits message hashes, emits `MessageDispatched`, and can call reporters to forward those hashes to remote adapters.
```

```diff
+   Status: CREATED
    contract BridgeRouter ProxyAdmin (eth:0xD7e65A32bEd4ce8cc57Ec188F2bBb8016dc4b1cd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XDai Bridge Validators (eth:0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E)
    +++ description: Validator set contract used by the bridge to require threshold signatures before cross-chain messages can be executed.
```

```diff
+   Status: CREATED
    contract AMB Bridge Validators (eth:0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064)
    +++ description: Validator set contract used by the bridge to require threshold signatures before cross-chain messages can be executed.
```

```diff
+   Status: CREATED
    contract Yaru (gno:0x153801d0B85D2FCAc6EA07446b6A709ce6720AC5)
    +++ description: Inbound executor in Hashi. It reconstructs message IDs, asks Hashi whether enough adapters agreed on the hash, and then calls the target bridge receiver.
```

```diff
+   Status: CREATED
    contract PermittableToken (gno:0x199084efbd7fe14d217BBF22FDC6E2eD7266dDD4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlockRewardAuRa (gno:0x481c034c6d9441db23Ea48De68BCAe812C5d39bA)
    +++ description: Part of the deprecated AuRa proof-of-authority consensus model. Gnosis switched to an Ethereum-like consensus, but this contract is still used as the legacy xDAI mint queue for Ethereum-to-Gnosis bridge messages.
```

```diff
+   Status: CREATED
    contract USDSDepositContract (gno:0x5C183C8A49aBA6e31049997a56D75600E27FF8c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HomeOmnibridge Fee Manager (gno:0x5dbC897aEf6B18394D845A922BF107FA98E3AC55)
    +++ description: Fee manager used by HomeOmnibridge to calculate and distribute bridge fees to a configured reward address list.
```

```diff
+   Status: CREATED
    contract HomeBridgeErcToNative HashiManager (gno:0x60Aa15198a3AdfC86FF15B941549A6447B2dDB49)
    +++ description: Configuration contract that tells bridge contracts how to use Hashi as an additional message-validation layer.
```

```diff
+   Status: CREATED
    contract HomeOmnibridge Gas Limit Manager (gno:0x68A3674028a785A8BCE19bA81B9ab7c9942BA3ED)
    +++ description: Module used by HomeOmnibridge to choose default, selector-specific, and token-specific gas limits for cross-chain Omnibridge message execution.
```

```diff
+   Status: CREATED
    contract HomeBridgeErcToNative (gno:0x7301CFA0e1756B71869E93d4e4Dca5c7d0eb0AA6)
    +++ description: Gnosis-side native token bridge that burns xDAI and releases DAI or USDS on Ethereum. It still depends on the legacy BlockRewardAuRa contract to mint xDAI when messages arrive from Ethereum.
```

```diff
+   Status: CREATED
    contract HomeAMB HashiManager (gno:0x74CACae9801bA4Fe0027Ed6F58d53797CCa7296E)
    +++ description: Configuration contract that tells bridge contracts how to use Hashi as an additional message-validation layer.
```

```diff
+   Status: CREATED
    contract HomeAMB (gno:0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59)
    +++ description: Gnosis-side Arbitrary Message Bridge endpoint that verifies validator signatures before relaying cross-chain calls to Ethereum. Hashi can be enabled as an additional verification layer.
```

```diff
+   Status: CREATED
    contract Omnibridge Fee Distributor Safe (gno:0x77bcb57ba7037e39063f1567ce734452bbD7a5F0)
    +++ description: Safe that currently receives Omnibridge fees distributed by the HomeOmnibridge fee manager.
```

```diff
+   Status: CREATED
    contract Gnosis Bridge Multisig (Gnosis) (gno:0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd)
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
    +++ description: Light-client-style Hashi adapter that verifies source-chain consensus data with SP1 Helios proofs and stores block or message hashes for later Hashi aggregation.
```

```diff
+   Status: CREATED
    contract HomeAMB Validators (gno:0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008)
    +++ description: Validator set contract used by the bridge to require threshold signatures before cross-chain messages can be executed.
```

```diff
+   Status: CREATED
    contract LayerZeroReporter (gno:0xA3Bc83D557E3f2dDfF4D44966A96397760159D8B)
    +++ description: Hashi reporter that forwards Yaho-dispatched block or message hashes through LayerZero to a remote adapter.
```

```diff
+   Status: CREATED
    contract SP1Verifier (gno:0xa5E60dbBAc6A65B654E5A14A5E357da3Fcf139dd)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract HomeBridge Validators (gno:0xB289f0e6fBDFf8EEE340498a56e1787B303F1B6D)
    +++ description: Validator set contract used by the bridge to require threshold signatures before cross-chain messages can be executed.
```

```diff
+   Status: CREATED
    contract Yaho (gno:0xbAE4Ebbf42815BB9Bc3720267Ea4496277d60DB8)
    +++ description: Outbound dispatcher in Hashi. It commits message hashes, emits `MessageDispatched`, and can call reporters to forward those hashes to remote adapters.
```

```diff
+   Status: CREATED
    contract HomeOmnibridge Forwarding Rules Manager (gno:0xd4D8c07097F9b87EcC4C1a838C4b71DBebcd2286)
    +++ description: Module used by HomeOmnibridge to decide whether specific tokens, senders, or receivers must use the oracle-driven lane or the manual lane for bridge requests.
```

```diff
+   Status: CREATED
    contract HomeOmnibridge TokenFactory (gno:0xEAAE83ac10f975a6456f4C4E48c45Ea2d8e1b5d2)
    +++ description: Factory used by Omnibridge to deploy wrapped tokens representing assets native to the other chain.
```

```diff
+   Status: CREATED
    contract Hashi Multisig (Gnosis) (gno:0xEF138856d0581641A57245Ee5CFfc9ceaA059623)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HomeOmnibridge (gno:0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d)
    +++ description: Gnosis-side Omnibridge mediator used for arbitrary token transfers between Gnosis and Ethereum via the AMB bridge.
```
