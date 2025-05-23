Generated with discovered.json: 0x7a2448f1214526f0fa3a5bc7b95c0733ede067f5

# Diff at Fri, 23 May 2025 14:53:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22546241

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract zkVmDiamond (0x742A28e22277945BBAAa34810393bf6e8512576C)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract Safe (0x916cdc02EE1b48df87049EC764f0BDEa594B3AbE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainAdminOwnable (0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```
