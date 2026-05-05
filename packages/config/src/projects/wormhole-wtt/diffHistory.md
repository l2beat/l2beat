Generated with discovered.json: 0xa1828fbfc4448e97cea0f70412123f03ac33283d

# Diff at Wed, 29 Apr 2026 11:52:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7777fce305237f88b6d6286e39503c0f5d636d05 block: 1777295406
- current timestamp: 1777463509

## Description

config: add descriptions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777295406 (main branch discovery), not current.

```diff
    EOA  (eth:0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    contract TokenImplementation (eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6) {
    +++ description: Wormhole wrapped ERC20 token implementation. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs.
      description:
-        "Wormhole wrapped ERC20 token implementation used directly or behind Beacon proxies. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs."
+        "Wormhole wrapped ERC20 token implementation. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs."
    }
```

```diff
    EOA  (eth:0x107A0086b32d7A0977926A205131d8731D39cbEB) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0x114De8460193bdf3A2fCf81f86a09765F4762fD1) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0x11b39756C042441BE6D8650b69b54EbE715E2343) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0x15e7cAF07C4e3DC8e7C469f92C8Cd88FB8005a20) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    contract TokenBridge (eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: Wormhole Token Bridge escrow and wrapped-token beacon on EVM chains. It accepts VAAs verified by Wormhole Core to mint, burn, release, register remote bridge emitters, and upgrade bridge logic.
      fieldMeta:
+        {"finality":{"severity":"HIGH","description":"Consistency level used when this Token Bridge publishes Wormhole messages from the local chain.","type":"RISK_PARAMETER"},"governanceChainId":{"severity":"HIGH","description":"Wormhole chain id from which Token Bridge governance messages are accepted.","type":"RISK_PARAMETER"},"governanceContract":{"severity":"HIGH","description":"Emitter address authorized to send Token Bridge governance messages.","type":"PERMISSION"},"implementation":{"severity":"HIGH","description":"Beacon implementation returned by the Token Bridge for wrapped token proxies. Changing it changes the code used by wrapped assets minted by this bridge.","type":"CODE_CHANGE"},"tokenImplementation":{"severity":"HIGH","description":"Implementation used by wrapped ERC20 assets created by this Token Bridge.","type":"CODE_CHANGE"},"wormhole":{"severity":"HIGH","description":"The Wormhole Core Bridge used to verify Guardian-signed VAAs consumed by this Token Bridge.","type":"PERMISSION"}}
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    EOA  (eth:0x43ac8f567A31e7850Da532B361988Bfe0d3ae11b) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0x5E1487F35515d02A92753504a8D75471b9f49EdB) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0x6FbEBc898F403E4773E95feB15E80C9A99c8348d) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0x74a3bf913953D695260D88BC1aA25A4eeE363ef0) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0x938f104AEb5581293216ce97d771e0CB721221B1) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: Wormhole Core Bridge verifies VAAs signed by the active Guardian set and executes Guardian governance messages for the local Wormhole deployment.
      values.currentQuorumHardcoded:
+        13
      fieldMeta:
+        {"guardianSet":{"severity":"HIGH","description":"The active Wormhole Guardian set. A 2/3+1 quorum of these addresses signs VAAs accepted by this Core Bridge. The old signer set stays valid for 24h by default if the set is changed.","type":"PERMISSION"},"quorum":{"severity":"HIGH","description":"Number of Guardian signatures required for each Guardian set size up to 30.","type":"RISK_PARAMETER"},"getCurrentGuardianSetIndex":{"severity":"HIGH","description":"Index of the Guardian set currently used to validate VAAs.","type":"RISK_PARAMETER"},"getGuardianSetExpiry":{"severity":"HIGH","description":"Expiry delay applied to old Guardian sets after a rotation.","type":"RISK_PARAMETER"},"governanceChainId":{"severity":"HIGH","description":"Wormhole chain id from which Core governance messages are accepted.","type":"RISK_PARAMETER"},"governanceContract":{"severity":"HIGH","description":"Emitter address authorized to send Core governance messages.","type":"PERMISSION"},"messageFee":{"severity":"HIGH","description":"Fee required to publish a Wormhole message on the local chain.","type":"RISK_PARAMETER"}}
      references:
+        [{"text":"Wormhole contract addresses","href":"https://wormhole.com/docs/products/reference/contract-addresses/"}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    EOA  (eth:0xAF45Ced136b9D9e24903464AE889F5C8a723FC14) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0xD1F64e26238811de5553C40f64af41eE1B6057Cc) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0xD2CC37A4dc036a8D232b48f62cDD4731412f4890) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0xf93124b7c738843CBB89E864c862c38cddCccF95) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

```diff
    EOA  (eth:0xfF6CB952589BDE862c25Ef4392132fb9D4A42157) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs.","role":".guardianSet"},{"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"sign VAAs that Wormhole Core accepts as cross-chain messages.","role":".guardianSet"}]
    }
```

Generated with discovered.json: 0xc70895ee91eb87b5f43011f900b087c157eee9c6

# Diff at Mon, 27 Apr 2026 13:11:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@23516f1986cca2ffc7aee54a5c9a070db7813fa2 block: 1775637905
- current timestamp: 1777295406

## Description

config: import templates from wormhole disco.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1775637905 (main branch discovery), not current.

```diff
    contract TokenImplementation (eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6) {
    +++ description: Wormhole wrapped ERC20 token implementation used directly or behind Beacon proxies. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs.
      template:
+        "wormhole/BridgeToken"
      description:
+        "Wormhole wrapped ERC20 token implementation used directly or behind Beacon proxies. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs."
    }
```

```diff
    contract TokenBridge (eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: Wormhole Token Bridge escrow and wrapped-token beacon on EVM chains. It accepts VAAs verified by Wormhole Core to mint, burn, release, register remote bridge emitters, and upgrade bridge logic.
      template:
+        "wormhole/TokenBridge"
      description:
+        "Wormhole Token Bridge escrow and wrapped-token beacon on EVM chains. It accepts VAAs verified by Wormhole Core to mint, burn, release, register remote bridge emitters, and upgrade bridge logic."
    }
```

```diff
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: Wormhole Core Bridge verifies VAAs signed by the active Guardian set and executes Guardian governance messages for the local Wormhole deployment.
      template:
+        "wormhole/WormholeCore"
      description:
+        "Wormhole Core Bridge verifies VAAs signed by the active Guardian set and executes Guardian governance messages for the local Wormhole deployment."
    }
```

Generated with discovered.json: 0xf82487c058caf69d01a259ff19dfa9e5609f02fe

# Diff at Wed, 08 Apr 2026 08:46:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@26766919b8396e7d9a1ed837e31d9b0fa1ad9549 block: 1772790508
- current timestamp: 1775637905

## Description

Contract upgraded to unverified implementation. Doesn't affect wormhole wtt plugin.

## Watched changes

```diff
    contract  (eth:0x7A0a53847776f7e94Cc35742971aCb2217b0Db81) {
    +++ description: None
      name:
-        "DeliveryProviderImplementation"
+        ""
      sourceHashes:
-        ["0xa69df53f9d2492a90cb9aeda1ddfd617ce00c5c63dfc2d2baa0413a87ffaf34c","0x8c018dd994ea0c4acd43c9628405cfd46ff5a65f234b1ea8c7e765983f49c6b3"]
      values.$implementation:
-        "eth:0x0b89ccD6b803CCEC4f0E0fBeFAeE1f7d16e734e2"
+        "eth:0x9dB2f72B8E5AAfA88F62852a0658f0b9249f6454"
      values.$pastUpgrades.3:
+        ["2026-04-02T01:34:23.000Z","0x7231c796b404394aad777272879a82c3ac6f30b0370cb302458148fe72b3087b",["eth:0x9dB2f72B8E5AAfA88F62852a0658f0b9249f6454"]]
      values.$upgradeCount:
-        3
+        4
      values.chainId:
-        2
      values.coreRelayer:
-        "eth:0x27428DD2d3DD32A4D7f7C497eAaa23130d894911"
      values.getRewardAddress:
-        "eth:0x53207E216540125e322CdA8A693b0b89576DEb46"
      values.owner:
-        "eth:0x59278F587D4cFcDCbbc08019060be7231c37ddc2"
      values.pendingOwner:
-        "eth:0x0000000000000000000000000000000000000000"
      values.pricingWallet:
-        "eth:0xE8af07A8Eff87B99B7C8C2c18ea95a1FE86D0ACD"
      values.rewardAddress:
-        "eth:0x53207E216540125e322CdA8A693b0b89576DEb46"
      implementationNames.eth:0x0b89ccD6b803CCEC4f0E0fBeFAeE1f7d16e734e2:
-        "DeliveryProviderImplementation"
      implementationNames.eth:0x9dB2f72B8E5AAfA88F62852a0658f0b9249f6454:
+        ""
      unverified:
+        true
    }
```

## Source code changes

```diff
.../dev/null                                       | 1437 --------------------
 .../DeliveryProviderProxy.p.sol                    |    0
 2 files changed, 1437 deletions(-)
```

Generated with discovered.json: 0x90a3deea76a94725de3ce5d0299140d1011e9162

# Diff at Fri, 06 Mar 2026 09:49:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@464f5fa94dac665b855f973e6cbee143f2fbb4bd block: 1772444496
- current timestamp: 1772790508

## Description

guardian key change.

## Watched changes

```diff
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      values.getCurrentGuardianSetIndex:
-        4
+        5
      values.guardianSet.keys.6:
-        "eth:0x54Ce5B4D348fb74B958e8966e2ec3dBd4958a7cd"
+        "eth:0x938f104AEb5581293216ce97d771e0CB721221B1"
      values.guardianSet.keys.14:
-        "eth:0x71AA1BE1D36CaFE3867910F99C09e347899C19C3"
+        "eth:0xD1F64e26238811de5553C40f64af41eE1B6057Cc"
      values.guardianSet.keys.15:
-        "eth:0x8192b6E7387CCd768277c17DAb1b7a5027c0b3Cf"
+        "eth:0x43ac8f567A31e7850Da532B361988Bfe0d3ae11b"
    }
```

Generated with discovered.json: 0xbbfb71a0d4a7008289dcd309c4617fb35242636c

# Diff at Mon, 02 Mar 2026 09:42:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1772444496

## Description

move to baseproj.

## Initial discovery

```diff
+   Status: CREATED
    contract TokenImplementation (eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WormholeRelayer (eth:0x27428DD2d3DD32A4D7f7C497eAaa23130d894911)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenBridge (eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NFTBridge (eth:0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeliveryProviderImplementation (eth:0x7A0a53847776f7e94Cc35742971aCb2217b0Db81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CircleIntegration (eth:0xAaDA05BD399372f0b0463744C09113c137636f6a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NFTImplementation (eth:0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc)
    +++ description: None
```
