Generated with discovered.json: 0xfc8250af9a24aa5a5687d4fe7d469ab1de76c869

# Diff at Wed, 16 Jul 2025 13:21:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22932018

## Description

Initial discovery of a standard agglayer validium with PC gas token. 

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0b361Df2DA934CA55bde14114298Ed4290FBd4bc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D)
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
```

```diff
+   Status: CREATED
    contract Validium (0xB4cEb70E8778a9928feD6ECBa1b03706a57b0ce8)
    +++ description: The main system contract defining the Pentagon Games Layer 2 logic. Entry point for sequencing batches.
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0xc6B9Df87f2Fa8736dAC284308db8e99B45502647)
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
```
