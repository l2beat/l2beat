Generated with discovered.json: 0xe48e50416dbcbbeeb76b289511e7463e54b35e8e

# Diff at Mon, 31 Mar 2025 13:04:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22167075

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract  (0x085CE3931CDfa5B3327dE4cd36222115dA6230DB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainAdmin (0x1908d615Bf6BdbEF181eC1B11b2b2D49331E985B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1SharedBridge (0x34899F8B01cF52160C88ddb9e29eC3c269019165)
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
```

```diff
+   Status: CREATED
    contract StateTransitionManager (0x590E6587B37DC4152B6b036ff88A835BD2Ab8924)
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5C03468829A26981c410a7930bD4853622F0B2E5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract LensZkEvmAdmin (0x6bd8d33551077Ed281Cb047835a2aE4033eEc433)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract Bridgehub (0x9dA9f5dad070649811D77c40CcDcab479cE3Fa07)
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
```

```diff
+   Status: CREATED
    contract LensZkEvm (0xc29d04A93F893700015138E3E334eB828dAC3cef)
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```
