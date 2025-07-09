Generated with discovered.json: 0x063eada8a1a2942c1b8f32acad1eae5b965ee52e

# Diff at Wed, 09 Jul 2025 09:29:28 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current block number: 17069619

## Description

Created sp1 discovery as a shared module.

## Initial discovery

```diff
+   Status: CREATED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract SP1VerifierGatewayMultisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```
