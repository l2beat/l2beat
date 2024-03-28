Generated with discovered.json: 0x537893caa59f373cff2679fee537357a320870aa

# Diff at Thu, 28 Mar 2024 08:30:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19510528
- current block number: 19531427

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19510528 (main branch discovery), not current.

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      upgradeability.threshold:
+        "6 of 8 (75%)"
    }
```

```diff
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 3 (33%)"
    }
```

```diff
    contract AdminMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x80e34d2e9f076e502c2a5f413f27f449b1570d7a

# Diff at Mon, 25 Mar 2024 09:12:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9bc44b13c53d42ef5e81d478df7a78975e8d4088 block: 19482808
- current block number: 19510528

## Description

A bug on Polygon zkEVM was fixed, unrelated to Astar zkEVM.

## Watched changes

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      values.nonce:
-        19
+        27
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.accessControl.UPDATE_ROLLUP.members.1:
+        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.lastDeactivatedEmergencyStateTimestamp:
-        0
+        1711323791
      values.rollupTypeCount:
-        2
+        3
    }
```

Generated with discovered.json: 0x9d882fb2ce884a4add9de979baad67a6d2a8b618

# Diff at Thu, 21 Mar 2024 11:41:18 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19482808

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumEtrog (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract POL (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E)
    +++ description: None
```
