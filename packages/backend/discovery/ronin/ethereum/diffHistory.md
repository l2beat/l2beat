Generated with discovered.json: 0xd1fb9bcd1f93aff45a40b44cdbea2098e4bb52d8

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
