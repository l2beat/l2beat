Generated with discovered.json: 0x8e5a63378b19d07ed8ed7fd9094244cca53e6be2

# Diff at Fri, 09 Aug 2024 12:02:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19532236
- current block number: 19532236

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532236 (main branch discovery), not current.

```diff
    contract ProxyAdminBridgeV2 (0x1Da522B35363c1eda4833bc121c8F3c67B2caa75) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x5523985926Aa12BA58DC5Ad00DDca99678D7227E"
+        "0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8"
      assignedPermissions.upgrade.0:
-        "0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8"
+        "0x5523985926Aa12BA58DC5Ad00DDca99678D7227E"
    }
```

Generated with discovered.json: 0xf28a7b9bd9aafb30bc0ddd9723108b233ad573c9

# Diff at Fri, 09 Aug 2024 10:12:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19532236
- current block number: 19532236

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532236 (main branch discovery), not current.

```diff
    contract ProxyAdminBridgeV2 (0x1Da522B35363c1eda4833bc121c8F3c67B2caa75) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5523985926Aa12BA58DC5Ad00DDca99678D7227E","0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8"]
      assignedPermissions.upgrade:
+        ["0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8","0x5523985926Aa12BA58DC5Ad00DDca99678D7227E"]
    }
```

```diff
    contract ProxyAdminBridge (0x3901611dfDA3Aed75C37Ba59f2c76E8309dc98FA) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0"]
      assignedPermissions.upgrade:
+        ["0xd5F0f8dB993D26F5df89E70a83d32b369DcCdaa0"]
    }
```

```diff
    contract Multisig (0x5112EbA9bc2468Bb5134CBfbEAb9334EdaE7106a) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x28e41c41f61cab69aA0b50668eB3c38ee76d0BA9","0xDD335D90dE6e4ECE62C966FF07a000cF26e19C0e","0x74Bcc68B52E3De4C105CEE3eb1814fe496a60ab9","0x32e42EEE9586D685a40A26f8BAc4197cEA967b5F","0x8dFCBe7ABd7426B7441a89B6Db97B28376E46971"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x28e41c41f61cab69aA0b50668eB3c38ee76d0BA9","0xDD335D90dE6e4ECE62C966FF07a000cF26e19C0e","0x74Bcc68B52E3De4C105CEE3eb1814fe496a60ab9","0x32e42EEE9586D685a40A26f8BAc4197cEA967b5F","0x8dFCBe7ABd7426B7441a89B6Db97B28376E46971"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x7964f710ebb1ba92de909b6efe7db6689b36bf81

# Diff at Thu, 28 Mar 2024 11:13:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19063980
- current block number: 19532236

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19063980 (main branch discovery), not current.

```diff
    contract Multisig (0x5112EbA9bc2468Bb5134CBfbEAb9334EdaE7106a) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x6a2fe1d29022ae5e514fab9ee5db06e737226699

# Diff at Mon, 22 Jan 2024 18:16:15 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@f58cc44bf923844f52038487bcd5a563329f4b43 block: 18827571
- current block number: 19063980

## Description

MetaRouter has been verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18827571 (main branch discovery), not current.

```diff
    contract MetaRouter (0xf621Fb08BBE51aF70e7E0F4EA63496894166Ff7F) {
      unverified:
-        true
      derivedName:
-        ""
+        "MetaRouter"
      values:
+        {"metaRouterGateway":"0xfCEF2Fe72413b65d3F393d278A714caD87512bcd"}
    }
```

```diff
+   Status: CREATED
    contract MetaRouterGateway (0xfCEF2Fe72413b65d3F393d278A714caD87512bcd) {
    }
```

# Diff at Wed, 20 Dec 2023 13:59:50 GMT

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@fea77c90d7ee6217f84ee87d58e123b42f0b5273

## Description

Added a `_crossChainID` param. Basically not used anywhere except in events.

## Watched changes

```diff
-   Status: DELETED
    contract MetaRouterGateway (0x0A0B7D1eea99e6189995432fec8172bB2dFFF847) {
    }
```

```diff
-   Status: DELETED
    contract MetaRouter (0x1DCfbC3fA01b2a86bC3a3f43479cCe9E8D438Adc) {
    }
```

```diff
    contract Portal (0xb8f275fBf7A959F4BCE59999A2EF122A099e81A8) {
      upgradeability.implementation:
-        "0x086488E659253FF26D0C743325C059FB57Ca7934"
+        "0x326adbE46D7E6C1B3927e9309B96DF478bda6D16"
      implementations.0:
-        "0x086488E659253FF26D0C743325C059FB57Ca7934"
+        "0x326adbE46D7E6C1B3927e9309B96DF478bda6D16"
      values.metaRouter:
-        "0x1DCfbC3fA01b2a86bC3a3f43479cCe9E8D438Adc"
+        "0xf621Fb08BBE51aF70e7E0F4EA63496894166Ff7F"
    }
```

```diff
+   Status: CREATED
    contract MetaRouter (0xf621Fb08BBE51aF70e7E0F4EA63496894166Ff7F) {
    }
```

## Source code changes

```diff
.../contracts/token/ERC20/IERC20.sol => /dev/null  |  82 -----
 .../contracts/utils/Context.sol => /dev/null       |  24 --
 .../libraries/TransferHelper.sol => /dev/null      |  51 ----
 .../metarouter/MetaRouteStructs.sol => /dev/null   |  83 -----
 .../metarouter/MetaRouter.sol => /dev/null         | 337 ---------------------
 .../metarouter/MetaRouterGateway.sol => /dev/null  |  31 --
 .../utils/RevertMessageParser.sol => /dev/null     |  16 -
 .../{.code@18184280 => .code}/MetaRouter/meta.txt  |   4 +-
 .../libraries/TransferHelper.sol => /dev/null      |  51 ----
 .../metarouter/MetaRouterGateway.sol => /dev/null  |  31 --
 .../MetaRouterGateway/meta.txt => /dev/null        |   2 -
 .../implementation/contracts/synth-core/Portal.sol |  43 +--
 .../synth-core/metarouter/MetaRouteStructs.sol     |   4 +-
 .../Portal/implementation/meta.txt                 |   2 +-
 14 files changed, 30 insertions(+), 731 deletions(-)
```

# Diff at Thu, 21 Sep 2023 12:32:23 GMT

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@36d4050a6ee5a543b2163fe6e44153b540b87c16

## Watched changes

```diff
    contract BridgeV2 (0x5523985926Aa12BA58DC5Ad00DDca99678D7227E) {
      values.mpc:
-        "0x18605bd33eD33Ec5A8cD899bf56a710D6693A3Bc"
+        "0xf56c3D7F385143f4E478ef5993b8266323B72657"
      values.newMPC:
-        "0x18605bd33eD33Ec5A8cD899bf56a710D6693A3Bc"
+        "0xf56c3D7F385143f4E478ef5993b8266323B72657"
      values.oldMPC:
-        "0x0dAb7E5BEb5b6DfC7bc4901e038b53D8b225Ab87"
+        "0xa60344175Ed28BB38e729f58595632EffF02fB33"
    }
```
