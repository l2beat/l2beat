Generated with discovered.json: 0x65267bdf6ae893d4ea7fb5d4a7f94980130bf82c

# Diff at Wed, 22 May 2024 16:40:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eae7b47a410c2b8cc7e6a7d7a0bc841a31c6e83 block: 19825954
- current block number: 19926669

## Description

Fee change for the L2 fee calculation. The new scalar value is [encoded](https://specs.optimism.io/protocol/exec-engine.html#ecotone-l1-cost-fee-changes-eip-4844-da).

## Watched changes

```diff
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393) {
    +++ description: None
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279131273430256651056"
    }
```

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: None
      values.nonce:
-        2
+        3
    }
```

Generated with discovered.json: 0x5cc273f3a6946a11fc5da2bff31e3aedf40a9af9

# Diff at Wed, 08 May 2024 14:32:16 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19825954

## Description

Initial discovery: BOB (build on bitcoin) is a general-purpose OP stack rollup (.97 similarity with base excluding USDC bridge).
They are early in their roadmap but aim to offer BTC defi options, a Bitcoin light client and security inheritance from Bitcoin PoW.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC20TokenBridge (0x091dF5E1284E49fA682407096aD34cfD42B95B72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1UsdcBridge (0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x778870B55576Bdb2B5368A3CB225fBcED2B8D0Ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UsdcBridgeOwnerMultisig (0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xdDa53E23f8a32640b04D7256e651C1db98dB11C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xE3d981643b806FB8030CDB677D6E60892E547EdA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xF2dc77c697e892542cC53336178a78Bb313DFDC7)
    +++ description: None
```
