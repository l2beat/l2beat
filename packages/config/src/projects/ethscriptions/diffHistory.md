Generated with discovered.json: 0xcacfe4637a160a34abbf755e4c297fef0acc2b85

# Diff at Thu, 08 Jan 2026 21:21:26 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1767907143

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract FacetSafeModule (eth:0x3235AdE33cF7013f5b5A51089390396e931e6BCF)
    +++ description: Module that allows the Safe to send Facet transactions.
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
    +++ description: Rollup contract for Facet. This is the core contract that manages the state of the rollup and its proof system.
```

```diff
+   Status: CREATED
    contract FacetSafeProxy (eth:0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25)
    +++ description: Helper of the Safe Module that allows to send Facet transactions.
```

```diff
+   Status: CREATED
    contract EthscriptionsSafeModule (eth:0xDB866fD9241cd32851Df760c1Ec536f3199B22cE)
    +++ description: Module that allows the Safe to interact with Ethscriptions.
```

```diff
+   Status: CREATED
    contract EthscriptionsSafeProxy (eth:0xeEd444Fc821b866b002f30f502C53e88E15d5095)
    +++ description: Helper of the Safe Module that allows to send Ethscriptions transactions.
```

```diff
+   Status: CREATED
    contract L2StandardBridge (ethscriptions:0x4200000000000000000000000000000000000010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (ethscriptions:0x4200000000000000000000000000000000000016)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (ethscriptions:0x4200000000000000000000000000000000000018)
    +++ description: None
```
