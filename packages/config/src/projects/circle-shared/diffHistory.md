Generated with discovered.json: 0xb6f34da9bf7d858c5382f61af333a2b6b916050c

# Diff at Mon, 08 Jun 2026 13:26:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1780925099

## Description

initial discovery of cctp v1, v2 and gateway.

## Initial discovery

```diff
+   Status: CREATED
    contract MessageTransmitter (eth:0x0a992d191DEeC32aFe36203Ad87D7d289a738F81) [tokens/circle/MessageTransmitter]
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract GatewayMinter (eth:0x2222222d7164433c4C09B0b0D809a9b52C04C205) [tokens/circle/GatewayMinter]
    +++ description: Entrypoint or minter of USDC on this chain for the Gateway protocol.
```

```diff
+   Status: CREATED
    contract TokenMessengerV2 (eth:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d) [tokens/circle/TokenMessenger]
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract GatewayWallet (eth:0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE) [tokens/circle/GatewayWallet]
    +++ description: Exit point or burner of USDC on this chain for the Gateway protocol.
```

```diff
+   Status: CREATED
    contract MessageTransmitterV2 (eth:0x81D40F21F12A8F0E3252Bccb954D722d4c464B64) [tokens/circle/MessageTransmitter]
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract USD Coin Token (eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) [tokens/circle/USDC]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessenger (eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155) [tokens/circle/TokenMessenger]
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract TokenMinter (eth:0xc4922d64a24675E16e1586e3e3Aa56C06fABe907) [tokens/circle/TokenMinter]
    +++ description: Part of CCTP: Used for automated access control for minting.
```

```diff
+   Status: CREATED
    contract MasterMinter (eth:0xE982615d461DD5cD06575BbeA87624fda4e3de17) [circle-shared/MasterMinter]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMinterV2 (eth:0xfd78EE919681417d192449715b2594ab58f5D002) [tokens/circle/TokenMinter]
    +++ description: Part of CCTP: Used for automated access control for minting.
```
