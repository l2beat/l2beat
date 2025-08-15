Generated with discovered.json: 0xed0e574ef7eaf8445a31e17a60fae92585b5150e

# Diff at Thu, 14 Aug 2025 23:00:23 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current timestamp: 1755212383

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Bridge (0x1670000000000000000000000000000000000001)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignalService (0x1670000000000000000000000000000000000005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2AddressManager (0x1670000000000000000000000000000000000006)
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
```

```diff
+   Status: CREATED
    contract TaikoAnchor (0x1670000000000000000000000000000000010001)
    +++ description: Handles cross-layer message verification and manages EIP-1559 gas pricing for L2 operations. Anchors L1 block details to L2 for cross-layer communication.
```

```diff
+   Status: CREATED
    contract DefaultResolver (0xc32277f541bBADAA260337E71Cea53871D310DC8)
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xCa5b76Cc7A38b86Db11E5aE5B1fc9740c3bA3DE8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelegateController (0xfA06E15B8b4c5BF3FC5d9cfD083d45c53Cbe8C7C)
    +++ description: None
```
