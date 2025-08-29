Generated with discovered.json: 0x431da8680a113669a11b07856f06ddfcfc050f84

# Diff at Tue, 19 Aug 2025 09:02:29 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@0ed103f64e02fe332cd2478ee125c9e5f1d4c1d9 block: 1755212383
- current timestamp: 1755594109

## Description

Silence discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755212383 (main branch discovery), not current.

```diff
    contract Bridge (0x1670000000000000000000000000000000000001) {
    +++ description: None
      values.nextMessageId:
-        4288
      values.proxiableUUID:
+        "EXPECT_REVERT"
    }
```

```diff
    contract TaikoAnchor (0x1670000000000000000000000000000000010001) {
    +++ description: Handles cross-layer message verification and manages EIP-1559 gas pricing for L2 operations. Anchors L1 block details to L2 for cross-layer communication.
      values.lastSyncedBlock:
-        23142409
      values.parentTimestamp:
-        1755212383
      values.publicInputHash:
-        "0xba37b9e2e1c66e4398dcdbdd8ebf6d8ee0609de9110089dfb0f1b5e2cdbe46c9"
    }
```

Generated with discovered.json: 0x8b3be1f2a9eed12773d1c1a22d8cf9dbb272d2a3

# Diff at Fri, 15 Aug 2025 08:50:57 GMT:

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
    contract Taiko L2 Multisig (0xCa5b76Cc7A38b86Db11E5aE5B1fc9740c3bA3DE8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelegateController (0xfA06E15B8b4c5BF3FC5d9cfD083d45c53Cbe8C7C)
    +++ description: None
```
