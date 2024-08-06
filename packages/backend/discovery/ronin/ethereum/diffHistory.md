Generated with discovered.json: 0x2b82096ceb4e79dafeb012c0b921e9cc2b8b911d

# Diff at Tue, 06 Aug 2024 12:18:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@636940e9998601360990d4bbb59e5d257345bee1 block: 20138533
- current block number: 20469481

## Description

The bridge is paused see https://x.com/Psycheout86/status/1820771028420739140. 2h before the pause, it was upgraded to a new implementation.
The new implementation contains mainly formatting / naming changes, ERC 1155 support, and new callbacks like onBridgeOperatorsAdded() etc.

## Watched changes

```diff
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    +++ description: None
      values.$admin:
-        "0xa71456fA88a5f6a4696D0446E690Db4a5913fab0"
+        "0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB"
      values.$implementation:
-        "0x72E28A9009Ad12dE019BFF418CD210D4bbc3D403"
+        "0xfc274EC92bBb1A1472884558d1B5CaaC6F8220Ee"
      values.minimumVoteWeight:
-        1540
+        0
      values.paused:
-        false
+        true
      values.wethUnwrapper:
+        "0x8048b12511d9BE6e4e094089b12f54923C4E2F83"
    }
```

```diff
-   Status: DELETED
    contract MainchainBridgeManager (0xa71456fA88a5f6a4696D0446E690Db4a5913fab0)
    +++ description: None
```

```diff
    contract PauseEnforcer (0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4) {
    +++ description: None
      values.emergency:
-        false
+        true
    }
```

```diff
+   Status: CREATED
    contract MainchainBridgeManager (0x2Cf3CFb17774Ce0CFa34bB3f3761904e7fc3FaDB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x51F6696Ae42C6C40CA9F5955EcA2aaaB1Cefb26e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WethUnwrapper (0x8048b12511d9BE6e4e094089b12f54923C4E2F83)
    +++ description: None
```

## Source code changes

```diff
.../ronin/ethereum/.flat/GnosisSafe/GnosisSafe.sol |  952 ++++++++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |   34 +
 .../MainchainBridgeManager.sol                     | 2000 +++++++++++---------
 .../TransparentProxyV2.p.sol                       |  761 ++++++++
 .../MainchainGateway/MainchainGatewayV3.sol        | 1083 ++++++-----
 .../ronin/ethereum/.flat/WethUnwrapper.sol         |   93 +
 6 files changed, 3556 insertions(+), 1367 deletions(-)
```

Generated with discovered.json: 0xd53746fca5138cb45c2e8f56ba1400255041541f

# Diff at Fri, 21 Jun 2024 07:14:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ba6434de248c46d9e6b140264866a3072082af4 block: 19283248
- current block number: 20138533

## Description

This transaction transfers USD ~2M worth of AXS from the Ronin MS to an EOA.

## Watched changes

```diff
    contract RoninBridgeAdminMultiSig (0x2DA02aC5f19Ae362a4121718d990e655eB628D96) {
    +++ description: None
      values.transactionCount:
-        24
+        25
    }
```

Generated with discovered.json: 0x4aad5c754873131bd01ad3d130f767d777fb275a

# Diff at Thu, 22 Feb 2024 12:48:31 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19283248

## Description

Added access control to the discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract RoninBridgeAdminMultiSig (0x2DA02aC5f19Ae362a4121718d990e655eB628D96) {
    }
```

```diff
+   Status: CREATED
    contract MainchainGateway (0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08) {
    }
```

```diff
+   Status: CREATED
    contract MainchainBridgeManager (0xa71456fA88a5f6a4696D0446E690Db4a5913fab0) {
    }
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    }
```

```diff
+   Status: CREATED
    contract PauseEnforcer (0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4) {
    }
```
