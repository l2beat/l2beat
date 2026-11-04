Generated with discovered.json: 0x5eca13bdc7be918527718ed40b80568e73556faa

# Diff at Fri, 16 Oct 2026 10:13:24 GMT:

- id: 7172ce00
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e45e14a922cef8b526f3f802ae97d6b7542cacb7 block: 1790850942
- current timestamp: 1792144328

## Description

The Butter Bridge on Base is paused. The Safe at the same address paused the bridge on Ethereum, Arbitrum, Optimism, Polygon PoS and BSC within the same 2h. Linea and Avalanche have stayed paused since the May 2026 exploit. Outbound transfers and inbound message execution are halted. https://x.com/ButterNetworkio/status/2110682522564825340 .

## Watched changes

```diff
    contract Butter Bridge (base:0x0000317Bec33Af037b5fAb2028f52d14658F6A56) [butternetwork/Bridge] {
    +++ description: Butter's Base bridge endpoint. Outbound transfers lock or burn assets and emit messages for the MAP relay chain; inbound transfers execute only after a LightNode-validated receipt proof for the configured MAP relay contract. The bridge can mint configured mintable tokens, release escrowed assets, and invoke receiver callbacks, so compromise of validation, relay configuration, or management authority can lead to loss of bridged funds.
+++ description: Whether bridge transfers and message execution are paused. The authority can toggle this circuit breaker.
+++ severity: HIGH
      values.paused:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1790850942 (main branch discovery), not current.

```diff
    EOA (base:0x386ce1a187eC7329CFb8E467EB02FB07c698256A) {
    +++ description: None
      unverified:
-        true
      values.CUSTOM_STORAGE_ROOT:
+        "0x653ff6dcbda533c3c7d8ffb646da3e510d0de40f237170c4da3f874472aecb00"
      values.eip712Domain:
+        {"fields":"0x0f","name":"SmartWallet","version":"1.1.0","chainId":8453,"verifyingContract":"base:0x386ce1a187eC7329CFb8E467EB02FB07c698256A","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]}
      values.entryPoint:
+        "base:0x0000000071727De22E5E9d8BAf0edAc6f37da032"
      values.getOwnerKeys:
+        []
      values.IMPLEMENTATION:
+        "base:0xe40ccB2D94975c51bff0C004eFDfd9B3a5796fA4"
      values.namespace:
+        "SmartWallet.ERC7201.CustomStorage"
      values.ownerAt:
+        []
      values.ownerCount:
+        0
      sourceHashes:
+        ["0x75edcc789e2feb6dd3863127fde1296f7df029e9ba2e9a8aa0ea96c257bc9432"]
    }
```

Generated with discovered.json: 0xb42e981bfa9ea03ee9955be0b048d01c75d6a971

# Diff at Thu, 01 Oct 2026 11:10:27 GMT:

- id: c540e3bd
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ed7cdd77b1978c118fb9b1f824ae6cb10dfb566e block: 1786352166
- current timestamp: 1790850942

## Description

7702 re-delegation of a multisig signer.

## Watched changes

```diff
    EOA (base:0x386ce1a187eC7329CFb8E467EB02FB07c698256A) {
    +++ description: None
      values.$implementation:
-        "base:0xa845C74344Fc9405b1Fcf712f04668979573c1bf"
+        "base:0xe40ccB2D94975c51bff0C004eFDfd9B3a5796fA4"
    }
```

Generated with discovered.json: 0xa53cbdad94c30a38aaf8d3d36d0df2d928451789

# Diff at Mon, 10 Aug 2026 09:00:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@be83079eed365197a392b6bfd65fa6506007093c block: 1785915246
- current timestamp: 1786352166

## Description

Config: ignore in watchmode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785915246 (main branch discovery), not current.

```diff
    contract Butter MAP LightNode (base:0x0001805c0B57DBd48B5c5c26E237a135dDC678ae) [butternetwork/LightNode] {
    +++ description: Upgradeable MAP relay-chain light client used by Butter bridges. It verifies relay-chain headers with the stored BLS validator set and verifies receipt Merkle proofs against accepted headers. It is the destination-chain validation boundary for bridged messages.
      fieldMeta.headerHeight.severity:
-        "HIGH"
      fieldMeta.epochSummary.severity:
-        "HIGH"
      fieldMeta.verifiableHeaderRange.severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xb36c1f52ebe9cbebf0c59f41c05a60bd99ee3123

# Diff at Wed, 05 Aug 2026 09:02:43 GMT:

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
