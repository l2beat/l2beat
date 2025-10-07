Generated with discovered.json: 0xed0949ee21117496718995ebf632a8cb6a06eef9

# Diff at Wed, 03 Sep 2025 15:52:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1752752123
- current timestamp: 1752752123

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752752123 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference PolygonSharedBridge (eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    reference PolygonRollupManager (eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    reference PolygonGlobalExitRootV2 (eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

Generated with discovered.json: 0x6ab241ef14cd50829acf3b46238d64cb78abc569

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x53522998f99008a06d4b5d15a7cbc2ce912f7a82

# Diff at Thu, 17 Jul 2025 11:35:43 GMT:

- chain: ethereum
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

