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
