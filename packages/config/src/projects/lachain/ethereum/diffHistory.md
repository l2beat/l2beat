Generated with discovered.json: 0x06f36fdf89a9d8e0781441f0e67688c35e55dcfb

# Diff at Tue, 27 May 2025 15:29:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22574469

## Description

Initial discovery of a standard zk stack chain (v26).

## Initial discovery

```diff
+   Status: CREATED
    contract zkVmDiamond (0x742A28e22277945BBAAa34810393bf6e8512576C)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
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
