Generated with discovered.json: 0x6ce3950f6612155dbf4d458f1a2482e41b97e939

# Diff at Thu, 09 Jul 2026 12:38:38 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1781962796

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x0613A20e394593c2aEB627760e6d6Fb816D77fbB) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x0C46Dc0BA85eAb5A515f819F1a705eD324dA687B) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x1B586bcad859a265592e7A10856AEd85B344eEb2) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x1d36A4c2ab15CcD29B312991176D85622299cc11) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x1d5804aE896c64ECc88E15379061CE6230F11895) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkOracleMultisig (eth:0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA) [GnosisSafe]
    +++ description: The Gnosis Safe that Chainlink uses to administer these three price feeds. It owns both the feed proxies and their aggregators, so it can swap the aggregator behind any feed and replace the set of oracle signers and how many of them must sign a price. In effect it can set the ETH, stETH, and rETH prices these feeds report, or push a feed into a stale, zero, or reverting state, which makes it their single point of control, held by Chainlink.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x243205E5c413534d0702ea981A35256E6853857F) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract Chainlink_stETH_USD_Aggregator (eth:0x26f196806f43E88FD27798C9e3fb8fdF4618240f) [ChainlinkOCR2Aggregator]
    +++ description: A Chainlink OCR2 aggregator producing a price feed. Each update is the median of a report signed by a quorum (f+1) of its signers and relayed onchain by one of its transmitters, accepted only within a fixed min/max band. A colluding signer quorum can move the reported price anywhere within that band, while a transmitter only relays an already-signed report. Its owner sets the signer and transmitter sets and the quorum size, so it controls who can report the price.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x2DBbD12Bf0f6A23Cf4455cC6BE874b7a246288Ce) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ConfirmedTransactionModule (eth:0x2e1B5a40Edc922bCE489668b11749B8eAbd67f6b) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x30B18F1c425123314C82b0236D7a349433755386) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x30d872350Fe74f47C85847D6784B42f9b0816f04) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x35a06994a99B335b700bB3c875408489a9F8BbeF) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x42Afc2F6aE88678296EcB2eBA34cCfbd1Adc5F93) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x4CB67cfee180B6B73B70c7B3fC162E5FCF6532f1) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x522bB49bE4fB6E3ceC18df911C2A66457E6Fc3e2) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract Chainlink_rETH_ETH (eth:0x536218f9E9Eb48863970252233c8F271f554C2d0) [ChainlinkAggregatorProxy]
    +++ description: A Chainlink RETH / ETH price-feed proxy. It forwards price reads to a current aggregator and lets its owner propose then confirm a replacement aggregator, so whoever owns it can swap the price source behind the feed. It holds no funds and does no aggregation of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x585B3e95EEdd03AF221F724557D03384864Da3ca) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x5C026B7107f1F92a9768CF64f8B2a22252B0788d) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x5Dc428646BF9a29A4d623E0CDB57384E811f6F77) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x5eA7eAe0EBC1f4256806C8bf234F672d410Fc988) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract Chainlink_ETH_USD (eth:0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) [ChainlinkAggregatorProxy]
    +++ description: A Chainlink ETH / USD price-feed proxy. It forwards price reads to a current aggregator and lets its owner propose then confirm a replacement aggregator, so whoever owns it can swap the price source behind the feed. It holds no funds and does no aggregation of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x5fdf4ABaF24d8229deFBD28890cb01E0d8108e96) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x605b23dDB04B02D3413d365aC01e87aC2e1A0367) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x65a43936d7e1295CcA6f30F6a0B25fe49cAb32c8) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x6D53d5E35F5226a1613877e071b81217387aC6B5) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x7A13cD97D442856FF5387d55a7b3F09bf680102B) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x7B740d24396B09F992B655A590139D7Fbb5C73c8) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract Chainlink_ETH_USD_Aggregator (eth:0x7d4E742018fb52E48b08BE73d041C18B21de6Fb5) [ChainlinkOCR2Aggregator]
    +++ description: A Chainlink OCR2 aggregator producing a price feed. Each update is the median of a report signed by a quorum (f+1) of its signers and relayed onchain by one of its transmitters, accepted only within a fixed min/max band. A colluding signer quorum can move the reported price anywhere within that band, while a transmitter only relays an already-signed report. Its owner sets the signer and transmitter sets and the quorum size, so it controls who can report the price.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x87B331d3bb9Cf70Dd85c3dc606B684a0bd61c772) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x8AaDF849561DcCeC75DA44d1147E736E0cc0134E) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x97360A89B5adb7D82Dbde6C66A49de8a48D550E6) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x990cfBBDc5aeB794B657b4309017F84479e8Eb7D) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0x9A5B545aA8B6289288E529c4099B0CcA62bcB708) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0xAE80A59ba821544cB508808942C20C11442d8A9b) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0xBa4555a80E47477BBf23B721563D38B10eb65dFa) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0xC0C7eB4A39BAa77fD52715BD1dcE2246Df85E489) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract Chainlink_rETH_ETH_Aggregator (eth:0xc77904CD2CA0806CC3DB0819E9630FF3e2f6093d) [ChainlinkOCR2Aggregator]
    +++ description: A Chainlink OCR2 aggregator producing a price feed. Each update is the median of a report signed by a quorum (f+1) of its signers and relayed onchain by one of its transmitters, accepted only within a fixed min/max band. A colluding signer quorum can move the reported price anywhere within that band, while a transmitter only relays an already-signed report. Its owner sets the signer and transmitter sets and the quorum size, so it controls who can report the price.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0xC917E3BF6c211b326ffD4ed13E7D9a67682095CA) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract Chainlink_stETH_USD (eth:0xCfE54B5cD566aB89272946F602D76Ea879CAb4a8) [ChainlinkAggregatorProxy]
    +++ description: A Chainlink STETH / USD price-feed proxy. It forwards price reads to a current aggregator and lets its owner propose then confirm a replacement aggregator, so whoever owns it can swap the price source behind the feed. It holds no funds and does no aggregation of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0xd8D2297bDf4a84569bCec83C92A81549bE9c51E6) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0xDb0f470c2e87A645b1d7f8900b9a8F5aDe9aF259) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0xE62Efa5462961055757C63931a15601545E4d273) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0xe7b837A55df42eCc95bf893C3c31750264932596) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0xE9DcbaCc91dB0e37562a8455c80d0734D7CF3bd1) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0xF38326579519377178725A741C35999E8051e907) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```

```diff
+   Status: CREATED
    contract ChainlinkAuthorizedForwarder (eth:0xFe31f3EcfDE29Fc4915d80Eb8A9d67bFF14180B3) [ChainlinkAuthorizedForwarder]
    +++ description: A Chainlink authorized forwarder that an oracle node uses to submit its signed reports onchain. It relays calls from its own authorized sender keys to a fixed target and holds no funds or price logic of its own.
```
