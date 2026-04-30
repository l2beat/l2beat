Generated with discovered.json: 0x867c58a3b0f796e972b3e1b5f639f27fe1b6b8fd

# Diff at Wed, 29 Apr 2026 11:50:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7777fce305237f88b6d6286e39503c0f5d636d05 block: 1777294117
- current timestamp: 1777463355

## Description

config: clean discovery and move global config to templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777294117 (main branch discovery), not current.

```diff
    EOA  (eth:0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    contract TokenImplementation (eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6) {
    +++ description: Wormhole wrapped ERC20 token implementation. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs.
      description:
-        "ERC20 implementation used by Wormhole wrapped tokens on Ethereum."
+        "Wormhole wrapped ERC20 token implementation. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs."
      category:
-        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    EOA  (eth:0x107A0086b32d7A0977926A205131d8731D39cbEB) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x114De8460193bdf3A2fCf81f86a09765F4762fD1) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x11b39756C042441BE6D8650b69b54EbE715E2343) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x15e7cAF07C4e3DC8e7C469f92C8Cd88FB8005a20) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    contract TokenBridge (eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: Wormhole Token Bridge on Ethereum. It escrows Ethereum-native tokens and mints or burns wrapped assets such as WSOL after Wormhole Core verifies Guardian-signed VAAs. WSOL has no Ethereum-side escrow because it is a wrapped asset on Ethereum.
      fieldMeta.finality.description:
-        "Consistency level used when this Token Bridge publishes Wormhole messages from Ethereum."
+        "Consistency level used when this Token Bridge publishes Wormhole messages from the local chain."
      fieldMeta.implementation.description:
-        "Beacon implementation returned by the Token Bridge for wrapped token proxies. Changing it changes the code used by wrapped assets such as WSOL."
+        "Beacon implementation returned by the Token Bridge for wrapped token proxies. Changing it changes the code used by wrapped assets minted by this bridge."
      fieldMeta.wormhole.description:
-        "The Wormhole Core Bridge used to verify Guardian-signed VAAs consumed by the Token Bridge."
+        "The Wormhole Core Bridge used to verify Guardian-signed VAAs consumed by this Token Bridge."
      references:
-        [{"text":"Wormhole Token Bridge address","href":"https://wormhole.com/docs/products/reference/contract-addresses/#wrapped-token-transfers-wtt"}]
    }
```

```diff
    EOA  (eth:0x43ac8f567A31e7850Da532B361988Bfe0d3ae11b) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x5E1487F35515d02A92753504a8D75471b9f49EdB) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x6FbEBc898F403E4773E95feB15E80C9A99c8348d) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x74a3bf913953D695260D88BC1aA25A4eeE363ef0) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x938f104AEb5581293216ce97d771e0CB721221B1) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: Wormhole Core Bridge on Ethereum. It verifies VAAs signed by the active Wormhole Guardian set and is the security root for Wormhole application contracts on Ethereum, including the Token Bridge.
      values.currentQuorumHardcoded:
+        13
      fieldMeta.guardianSet.description:
-        "The active Wormhole Guardian set. A quorum of these addresses signs VAAs accepted by this Core Bridge."
+        "The active Wormhole Guardian set. A 2/3+1 quorum of these addresses signs VAAs accepted by this Core Bridge. The old signer set stays valid for 24h by default if the set is changed."
      fieldMeta.messageFee.description:
-        "Fee required to publish a Wormhole message on Ethereum."
+        "Fee required to publish a Wormhole message on the local chain."
    }
```

```diff
    EOA  (eth:0xAF45Ced136b9D9e24903464AE889F5C8a723FC14) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0xD1F64e26238811de5553C40f64af41eE1B6057Cc) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0xD2CC37A4dc036a8D232b48f62cDD4731412f4890) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0xf93124b7c738843CBB89E864c862c38cddCccF95) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0xfF6CB952589BDE862c25Ef4392132fb9D4A42157) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

Generated with discovered.json: 0x3037c0e05be4787d591e16763d7a0963f9e73d6e

# Diff at Mon, 27 Apr 2026 12:57:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1777294117

## Description

initial ai-disco using skill after revive.

## Initial discovery

```diff
+   Status: CREATED
    contract TokenImplementation (eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6)
    +++ description: ERC20 implementation used by Wormhole wrapped tokens on Ethereum.
```

```diff
+   Status: CREATED
    contract TokenBridge (eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585)
    +++ description: Wormhole Token Bridge on Ethereum. It escrows Ethereum-native tokens and mints or burns wrapped assets such as WSOL after Wormhole Core verifies Guardian-signed VAAs. WSOL has no Ethereum-side escrow because it is a wrapped asset on Ethereum.
```

```diff
+   Status: CREATED
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B)
    +++ description: Wormhole Core Bridge on Ethereum. It verifies VAAs signed by the active Wormhole Guardian set and is the security root for Wormhole application contracts on Ethereum, including the Token Bridge.
```

```diff
+   Status: CREATED
    contract WSOL (eth:0xD31a59c85aE9D8edEFeC411D448f90841571b89c)
    +++ description: WSOL is the Wormhole-wrapped ERC20 representation of native SOL on Ethereum. The Token Bridge owns this token and mints or burns it after accepting valid Token Bridge VAAs for the Solana route. The native SOL backing is escrowed on Solana, not Ethereum.
```
