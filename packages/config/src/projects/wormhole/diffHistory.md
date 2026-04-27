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
