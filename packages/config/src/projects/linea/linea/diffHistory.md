Generated with discovered.json: 0x7fc93d44a1e126ad44dd0cbc65e35322cd697ad2

# Diff at Tue, 19 Aug 2025 14:19:35 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1755613016

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1E1f6F22f97b4a7522D8B62e983953639239774E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenBridge (0x353012dc4a9A6cF55c941bADC267f82004A8ceB9)
    +++ description: Contract used to bridge and escrow ERC-20 tokens.
```

```diff
+   Status: CREATED
    contract L2Roles (0x3886a948eA7b4053312c3aE31a13776144aA6239)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2MessageService (0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiSend (0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0xB8F5524D73f549Cf14A0587a3C7810723f9c0051)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2Timelock (0xc808BfCBeD34D90fa9579CAa664e67B9A03C56ca)
    +++ description: A standard timelock with access control. The current minimum delay is 0s.
```

```diff
+   Status: CREATED
    contract BridgedToken (0xda8AEFCf0F9B0b81915a2C124f913e58212D49dF)
    +++ description: Standard implementation used for assets that are native to the Linea L2 and bridged back to ethereum.
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0xE798695d2e78f7caeb5BbF3385433959324c02c0)
    +++ description: A beacon with an upgradeable implementation currently set as linea:0xda8AEFCf0F9B0b81915a2C124f913e58212D49dF. Beacon proxy contracts pointing to this beacon will all use its implementation.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xf5cc7604a5ef3565b4D2050D65729A06B68AA0bD)
    +++ description: None
```
