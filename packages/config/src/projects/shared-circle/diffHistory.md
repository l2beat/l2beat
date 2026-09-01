Generated with discovered.json: 0x061709928cfddc7e1223ac5c7bc1b4fa6436a8c9

# Diff at Tue, 04 Aug 2026 13:19:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@36c0588f2e6fd433fcb60f558353b75cea40247d block: 1785325389
- current timestamp: 1785844480

## Description

The increased address limit lets discovery reach the two enabled CCTP V2 attesters. The transitive USDC minting permission now resolves through MessageTransmitterV2 to those attesters instead of stopping at the transmitter.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785325389 (main branch discovery), not current.

```diff
    contract MessageTransmitterV2 (eth:0x81D40F21F12A8F0E3252Bccb954D722d4c464B64) [tokens/circle/MessageTransmitter] {
    +++ description: Part of CCTP
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","description":"mint the token in the bounds of a preset minting allowance","role":".minters","via":[{"address":"eth:0xfd78EE919681417d192449715b2594ab58f5D002"},{"address":"eth:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"}]}]
    }
```

Generated with discovered.json: 0x30eaac3c7e667993bac9dbd203174b79f87eea0a

# Diff at Wed, 29 Jul 2026 12:10:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aa8a66c60dd068866cc6883eb64714f2f3e69afa block: 1780925583
- current timestamp: 1785325389

## Description

GatewayWallet was upgraded. The new implementation separates the power to remove EIP-1271 contract signers from the allowlister, adds owner-managed TEE signers that can vouch for burn intents on behalf of contract accounts, and disables ownership renunciation. A new disallowlister and TEE signer were configured; the existing burn signer remains active.

GatewayWallet diff: https://disco.l2beat.com/diff/eth:0x09E3740c97C7413693B7e07C32D42C53CD050d27/eth:0xF7a6D9D7Df917c072ac8987A820c58aA27A0e798

## Watched changes

```diff
    contract GatewayWallet (eth:0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE) [tokens/circle/GatewayWallet] {
    +++ description: Exit point or burner of USDC on this chain for the Gateway protocol.
      sourceHashes.1:
-        "0x58abac7a9c89cc1bb5e3008040a2a14acbee3ba234aab0da096e9163c2ba3962"
+        "0x9be4bc0a852d86d084188555ae4446289dbb638f0ac69478dffed14c6f9925af"
      values.$implementation:
-        "eth:0x09E3740c97C7413693B7e07C32D42C53CD050d27"
+        "eth:0xF7a6D9D7Df917c072ac8987A820c58aA27A0e798"
      values.$pastUpgrades.4:
+        ["2026-07-23T19:32:11.000Z","0x9032a846cd5f1fe703f17ab9b6015966a4f953412483a90d822992eeec99699d",["eth:0xF7a6D9D7Df917c072ac8987A820c58aA27A0e798"]]
      values.$upgradeCount:
-        4
+        5
      values.contractSignersDisallowlister:
+        "eth:0xaf8f5B407023a4b0a1861E69Bff4BCa151f15444"
      implementationNames.eth:0x09E3740c97C7413693B7e07C32D42C53CD050d27:
-        "GatewayWallet"
      implementationNames.eth:0xF7a6D9D7Df917c072ac8987A820c58aA27A0e798:
+        "GatewayWallet"
    }
```

```diff
    contract MessageTransmitterV2 (eth:0x81D40F21F12A8F0E3252Bccb954D722d4c464B64) [tokens/circle/MessageTransmitter] {
    +++ description: Part of CCTP
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","description":"mint the token in the bounds of a preset minting allowance","role":".minters","via":[{"address":"eth:0xfd78EE919681417d192449715b2594ab58f5D002"},{"address":"eth:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"}]}]
    }
```

## Source code changes

```diff
.../GatewayWallet/GatewayWallet.sol                | 279 ++++++++++++++++++---
 1 file changed, 238 insertions(+), 41 deletions(-)
```

Generated with discovered.json: 0x2dfc931693fc9e1b350509014ab4f02baaf2998c

# Diff at Fri, 12 Jun 2026 10:19:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a183e6009109d4e62087499f44eca4aceea9086 block: 1780925583
- current timestamp: 1780925583

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1780925583 (main branch discovery), not current.

```diff
    contract MessageTransmitter (eth:0x0a992d191DEeC32aFe36203Ad87D7d289a738F81) [tokens/circle/MessageTransmitter] {
    +++ description: Part of CCTP
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

```diff
    contract GatewayMinter (eth:0x2222222d7164433c4C09B0b0D809a9b52C04C205) [tokens/circle/GatewayMinter] {
    +++ description: Entrypoint or minter of USDC on this chain for the Gateway protocol.
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

```diff
    contract TokenMessengerV2 (eth:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d) [tokens/circle/TokenMessenger] {
    +++ description: Part of CCTP
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

```diff
    EOA  (eth:0x2A6A86466F181721ec8ff946967b56f1AA4758c5) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (eth:0x3c54FFa14d01EF3A555106007A4fED6E8964aAB6) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    contract GatewayWallet (eth:0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE) [tokens/circle/GatewayWallet] {
    +++ description: Exit point or burner of USDC on this chain for the Gateway protocol.
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

```diff
    EOA  (eth:0x807a96288A1A408dBC13DE2b1d087d10356395d2) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    contract MessageTransmitterV2 (eth:0x81D40F21F12A8F0E3252Bccb954D722d4c464B64) [tokens/circle/MessageTransmitter] {
    +++ description: Part of CCTP
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

```diff
    contract USD Coin Token (eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) [tokens/circle/USDC] {
    +++ description: None
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

```diff
    EOA  (eth:0xa820A620F638114F3Eb45df87382383322dDBC49) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (eth:0xB7569E9eB64eaEd5C4166E510b4F6fF54ef42258) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    contract TokenMessenger (eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155) [tokens/circle/TokenMessenger] {
    +++ description: Part of CCTP
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

Generated with discovered.json: 0x8db925cfda4eecd0daac9c67eeb525c719a4d62c

# Diff at Mon, 08 Jun 2026 14:18:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1780925583

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
    contract MasterMinter (eth:0xE982615d461DD5cD06575BbeA87624fda4e3de17) [shared-circle/MasterMinter]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMinterV2 (eth:0xfd78EE919681417d192449715b2594ab58f5D002) [tokens/circle/TokenMinter]
    +++ description: Part of CCTP: Used for automated access control for minting.
```
