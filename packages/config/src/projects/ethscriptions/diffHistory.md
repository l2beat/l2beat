Generated with discovered.json: 0x98cd5c5394c315ca5006ad70a81aa81b3e313819

# Diff at Mon, 12 Jan 2026 09:47:31 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1768211188

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
    contract SP1VerifierGateway (eth:0xa236E6E31d94b613923d18313f534CE5b6b98eE1)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract Rollup (eth:0xA9Bbcad27E1571AAFAD89F953c81c8A1440A0b8b)
    +++ description: Core rollup contract that manages the state of the rollup and its ZK fault proof system.
```

```diff
+   Status: CREATED
    contract Facet Multisig (eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525)
    +++ description: None
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
