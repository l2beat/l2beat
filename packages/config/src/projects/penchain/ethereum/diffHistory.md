Generated with discovered.json: 0x1107c0843ad1238dcb71704b0cdb3337c526126e

# Diff at Thu, 17 Jul 2025 11:35:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22938657

## Description

Initial discovery of a standard agglayer validium with PC gas token.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1a26Fc326860bb2fbBa0ebc4f63F9349b254C00e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D)
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
```

```diff
+   Status: CREATED
    contract Validium (0xb1714954bBc0162A36FB44934F3216aCE81C40d7)
    +++ description: The main system contract defining the Pentagon Games Layer 2 logic. Entry point for sequencing batches.
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0xC89AB4F5AEEe5cfbC34F8EEFA7B17414CC9391aE)
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
```
