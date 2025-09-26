Generated with discovered.json: 0xe2e8901ef8451de0fa4ff3ac0f61f4a709774aaa

# Diff at Tue, 23 Sep 2025 12:40:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1758631157

## Description

rename shared-sp1 to shared-sp1-gateway.

## Initial discovery

```diff
+   Status: CREATED
    reference SP1Verifier (arb1:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (arb1:0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract SP1VerifierGatewayMultisig (arb1:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

```diff
+   Status: CREATED
    reference SP1Verifier (base:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (base:0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract SP1VerifierGatewayMultisig (base:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

```diff
+   Status: CREATED
    reference SP1Verifier (eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract SP1VerifierGatewayMultisig (eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```
