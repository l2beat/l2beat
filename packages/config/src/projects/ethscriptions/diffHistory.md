Generated with discovered.json: 0x931aff9eb87b6add23b1ef8f8700087122bf4e22

# Diff at Fri, 09 Jan 2026 16:13:54 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1767975171

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (eth:0x70C7FdB9e543bD15cd392df04e6d4BD05AfD8A66)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract Facet Multisig (eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Rollup (eth:0xC437f0AbaF358Ac1baEFD7f9402Bb8839C1e795A)
    +++ description: Core rollup contract that manages the state of the rollup and its ZK fault proof system.
```

```diff
+   Status: CREATED
    contract Ethscriptions (ethscr:0x3300000000000000000000000000000000000001)
    +++ description: Core Ethscriptions NFT contract that manages ethscription ownership and metadata on L2.
```

```diff
+   Status: CREATED
    contract EthscriptionsProver (ethscr:0x3300000000000000000000000000000000000003)
    +++ description: L2 predeploy that automatically sends ethscription state snapshots to L1 via the L2ToL1MessagePasser whenever an ethscription is created or transferred.
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (ethscr:0x4200000000000000000000000000000000000016)
    +++ description: L2 predeploy for passing messages from L2 to L1. Messages are automatically sent by the EthscriptionsProver when ethscriptions are created or transferred.
```
