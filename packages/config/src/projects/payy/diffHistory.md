Generated with discovered.json: 0xff32667fc411b4e46575da64ebdcada937183193

# Diff at Tue, 25 Aug 2026 13:41:12 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.de>)
- current timestamp: 1787654846

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract HonkVerifier (eth:0x14DACD534ddc676601B27f41Eb541a7951524a2F) [payy/HonkVerifier]
    +++ description: UltraHonk proof verifier generated with Aztec's Barretenberg from Payy's final aggregation Noir circuit. It verifies the aggregated validity proof of each state update submitted to the Rollup contract.
```

```diff
+   Status: CREATED
    contract PayyMultisig (eth:0x230Dfb03F078B0d5E705F4624fCC915f3126B40f) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupV1 (eth:0x367C1eAF14AA06b78ce76bd0243297de79d85270) [payy/Rollup]
    +++ description: Main contract of the Payy ZK rollup. It stores the state root, escrows USDC backing the notes on the rollup, processes deposits (mints) and withdrawals (burns), and accepts state updates that must include an aggregated ZK proof and signatures from more than 2/3 of the current validator set.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xfE455baCAF1968F1Ae6a322b8Ffbe56840e2f590) [global/ProxyAdmin]
    +++ description: None
```
