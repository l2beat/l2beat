Generated with discovered.json: 0xc0be2da6fe6dcbeac8e582112fab1be3f7300444

# Diff at Wed, 05 Aug 2026 08:55:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1785915246

## Description

Butter interop protocol init disco: validation checks BLS sigs of a validator set on an external L1 (MAP Protocol). Validators can update the set with the discovered quorum. Each bridge tx verifies a merkle proof agains validator-signed block headers from the external L1. The L1 is supposed to run light clients of all participating chains.

## Initial discovery

```diff
+   Status: CREATED
    contract Butter Bridge (base:0x0000317Bec33Af037b5fAb2028f52d14658F6A56) [butternetwork/Bridge]
    +++ description: Butter's Base bridge endpoint. Outbound transfers lock or burn assets and emit messages for the MAP relay chain; inbound transfers execute only after a LightNode-validated receipt proof for the configured MAP relay contract. The bridge can mint configured mintable tokens, release escrowed assets, and invoke receiver callbacks, so compromise of validation, relay configuration, or management authority can lead to loss of bridged funds.
```

```diff
+   Status: CREATED
    contract Butter MAP LightNode (base:0x0001805c0B57DBd48B5c5c26E237a135dDC678ae) [butternetwork/LightNode]
    +++ description: Upgradeable MAP relay-chain light client used by Butter bridges. It verifies relay-chain headers with the stored BLS validator set and verifies receipt Merkle proofs against accepted headers. It is the destination-chain validation boundary for bridged messages.
```

```diff
+   Status: CREATED
    EOA  (base:0x386ce1a187eC7329CFb8E467EB02FB07c698256A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (base:0x9987463102993e177b107e0cE97a0420428D1999) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (base:0xAAAaEE7549a61282F2B4Ca1766f46249D9e71aaA) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Butter AuthorityManager (base:0xACC31A6756B60304C03d6626fc98c062E4539CCA) [butternetwork/AuthorityManager]
    +++ description: OpenZeppelin AccessManager-derived authority for Butter's restricted Bridge and FeeService functions. Its role configuration controls who can change bridge validation dependencies, relay and token settings, fee parameters, pause state, and implementation upgrades.
```

```diff
+   Status: CREATED
    contract Butter VerifyTool (base:0xc3393567DC2F1d071254E880c9f501641491471f) [butternetwork/VerifyTool]
    +++ description: Cryptographic and RLP/Merkle-proof helper contract called by the Butter MAP LightNode to validate relay-chain headers and transaction receipts.
```

```diff
+   Status: CREATED
    contract Butter FeeService (base:0xfeE31a1FD7FcA0E05428ff751242e46F6D5769a6) [butternetwork/FeeService]
    +++ description: Fee configuration contract used by Butter Bridge to calculate cross-chain message fees and select the fee recipient.
```
