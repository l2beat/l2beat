Generated with discovered.json: 0x47b2c0cd4fa39920b052f421440f6d68ed564c81

# Diff at Mon, 13 Jul 2026 15:03:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1783954937

## Description

Initial discovery of the USDG-quoted Lighter instance on Robinhood Chain.

## Initial discovery

```diff
+   Status: CREATED
    contract UpgradeGatekeeper (robinhood:0x43CfF77CD060A155dCe5deb12B93b875f69F2716) [lighter/UpgradeGatekeeper]
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by robinhood:0x4972E0CaCb2AC45644BA054838e96fF4f6f7eFDb.
```

```diff
+   Status: CREATED
    contract DesertVerifier (robinhood:0x443Cc0c7f773D0955E3Bd8DA393b708152cFA5Bc) [lighter/DesertVerifierAlwaysTrue]
    +++ description: The verifier used for desert-mode withdrawals. It does not validate proofs or public inputs.
```

```diff
+   Status: CREATED
    contract Lighter (robinhood:0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d) [lighter/ZkLighterWithSpotQuoteAsset]
    +++ description: The main rollup contract. It processes L2 batches, manages token deposits and withdrawals, allows users to submit priority requests and controls desert mode (escape hatch). This variant uses a configurable quote asset and commits state differences through host-chain calldata instead of EIP-4844 blob hashes. Logic is split between two contracts because of code-size limits, with many operations delegated to AdditionalZkLighter.
```

```diff
+   Status: CREATED
    contract ZkLighterVerifier (robinhood:0xe1aFBE2D670eFF0e7C8A41F080792C011916ac31) [lighter/ZkLighterVerifier]
    +++ description: The main ZK verifier of Lighter, settles the proofs of correct L2 state transition in the case of normal rollup operation.
```

```diff
+   Status: CREATED
    contract Governance (robinhood:0xf6F6Bd6eEA2b9A2041328732CcAe4c5e1DD278B7) [lighter/Governance]
    +++ description: Manages the list of validators and the network governor.
```
