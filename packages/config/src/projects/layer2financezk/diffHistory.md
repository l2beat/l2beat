Generated with discovered.json: 0x0e764d3eaa16bca27d3840a40798726ba091d929

# Diff at Wed, 03 Sep 2025 15:51:40 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1715171711
- current timestamp: 1715171711

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1715171711 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60)
    +++ description: None
```

Generated with discovered.json: 0xa6263f952e74efafee2b257de13c8d5cf863e376

# Diff at Tue, 02 Sep 2025 14:53:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ac83bbe73046e5a2b78d713bc6fc2c43f9d130e9 block: 1715171711
- current timestamp: 1715171711

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1715171711 (main branch discovery), not current.

```diff
    contract GpsFactRegistryAdapter (eth:0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      usedTypes.0.arg.760308386675154762009993173725077399730170358078020153308029499928875469870:
+        "Starknet Aggregator (since v0.14.0)"
      usedTypes.0.arg.793595346346724189681221050719974054861327641387231526786912662354259445535:
+        "StarkNet OS (since v0.14.0)"
    }
```

Generated with discovered.json: 0x5dd905a6a434bf657d0a93295b9eca5daeaf5e93

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xa0baac664ebe6cc78cf24b113618fb72948334d6

# Diff at Mon, 14 Jul 2025 12:45:17 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    EOA  (0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e) {
    +++ description: None
      address:
-        "0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
+        "eth:0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
    }
```

```diff
    EOA  (0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6) {
    +++ description: None
      address:
-        "0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6"
+        "eth:0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6"
    }
```

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: Helper contract for registering limit orders from L1.
      address:
-        "0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8"
+        "eth:0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8"
      implementationNames.0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8:
-        "OrderRegistry"
      implementationNames.eth:0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8:
+        "OrderRegistry"
    }
```

```diff
    contract StrategyCompound (0x5b000954F70B0410685193B0afd3074B744B5C97) {
    +++ description: None
      address:
-        "0x5b000954F70B0410685193B0afd3074B744B5C97"
+        "eth:0x5b000954F70B0410685193B0afd3074B744B5C97"
      values.broker:
-        "0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5"
+        "eth:0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5"
      values.comp:
-        "0xc00e94Cb662C3520282E6f5717214004A7f26888"
+        "eth:0xc00e94Cb662C3520282E6f5717214004A7f26888"
      values.owner:
-        "0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988"
+        "eth:0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988"
      values.uniswap:
-        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
+        "eth:0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
      values.weth:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      implementationNames.0x5b000954F70B0410685193B0afd3074B744B5C97:
-        "StrategyCompound"
      implementationNames.eth:0x5b000954F70B0410685193B0afd3074B744B5C97:
+        "StrategyCompound"
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      address:
-        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
+        "eth:0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
      description:
-        "Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`)."
+        "Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`)."
      values.gpsContract:
-        "0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
+        "eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
      implementationNames.0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE:
-        "GpsFactRegistryAdapter"
      implementationNames.eth:0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE:
+        "GpsFactRegistryAdapter"
    }
```

```diff
    contract StarkExchange (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      address:
-        "0x82123571C8a5e0910280C066bc634c4945FFcbC8"
+        "eth:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
+++ description: Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts.
+++ severity: HIGH
      values.$admin:
-        "0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
+        "eth:0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
      values.$implementation.0:
-        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
+        "eth:0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      values.$implementation.1:
-        "0x62BCA4DB742A99c834e2c24b609656A70EA25379"
+        "eth:0x62BCA4DB742A99c834e2c24b609656A70EA25379"
      values.$implementation.2:
-        "0x8536850750956c2FEebeCAB786d82271a5467687"
+        "eth:0x8536850750956c2FEebeCAB786d82271a5467687"
      values.$implementation.3:
-        "0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
+        "eth:0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
      values.$implementation.4:
-        "0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
+        "eth:0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
      values.$implementation.5:
-        "0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
+        "eth:0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
      values.$implementation.6:
-        "0xB3788a88F063B217227E27ae16Ba550db3132bE6"
+        "eth:0xB3788a88F063B217227E27ae16Ba550db3132bE6"
      values.$pastUpgrades.0.2.0:
-        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
+        "eth:0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      values.$pastUpgrades.0.2.1:
-        "0x62BCA4DB742A99c834e2c24b609656A70EA25379"
+        "eth:0x62BCA4DB742A99c834e2c24b609656A70EA25379"
      values.$pastUpgrades.0.2.2:
-        "0x8536850750956c2FEebeCAB786d82271a5467687"
+        "eth:0x8536850750956c2FEebeCAB786d82271a5467687"
      values.$pastUpgrades.0.2.3:
-        "0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
+        "eth:0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
      values.$pastUpgrades.0.2.4:
-        "0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
+        "eth:0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
      values.$pastUpgrades.0.2.5:
-        "0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
+        "eth:0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
      values.$pastUpgrades.0.2.6:
-        "0xB3788a88F063B217227E27ae16Ba550db3132bE6"
+        "eth:0xB3788a88F063B217227E27ae16Ba550db3132bE6"
      values.$pastUpgrades.1.2.0:
-        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
+        "eth:0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      values.$pastUpgrades.1.2.1:
-        "0x62BCA4DB742A99c834e2c24b609656A70EA25379"
+        "eth:0x62BCA4DB742A99c834e2c24b609656A70EA25379"
      values.$pastUpgrades.1.2.2:
-        "0x8536850750956c2FEebeCAB786d82271a5467687"
+        "eth:0x8536850750956c2FEebeCAB786d82271a5467687"
      values.$pastUpgrades.1.2.3:
-        "0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
+        "eth:0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
      values.$pastUpgrades.1.2.4:
-        "0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
+        "eth:0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
      values.$pastUpgrades.1.2.5:
-        "0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
+        "eth:0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
      values.$pastUpgrades.1.2.6:
-        "0xB3788a88F063B217227E27ae16Ba550db3132bE6"
+        "eth:0xB3788a88F063B217227E27ae16Ba550db3132bE6"
      values.getRegisteredAvailabilityVerifiers.0:
-        "0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"
+        "eth:0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"
      values.getRegisteredVerifiers.0:
-        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
+        "eth:0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
      values.implementation:
-        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
+        "eth:0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      values.operators.0:
-        "0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
+        "eth:0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
      values.operators.1:
-        "0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5"
+        "eth:0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5"
      values.OPERATORS.0:
-        "0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
+        "eth:0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
      values.OPERATORS.1:
-        "0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5"
+        "eth:0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5"
      values.orderRegistryAddress:
-        "0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8"
+        "eth:0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8"
      values.tokenAdmins.0:
-        "0xd649b1E03aE10199c3Ac38f0fd8b5F3ecbDDb978"
+        "eth:0xd649b1E03aE10199c3Ac38f0fd8b5F3ecbDDb978"
      values.tokenAdmins.1:
-        "0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988"
+        "eth:0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988"
      implementationNames.0x82123571C8a5e0910280C066bc634c4945FFcbC8:
-        "Proxy"
      implementationNames.0x4EDD62189732e9fF476ABa880b48c29432A7AC9B:
-        "StarkExchange"
      implementationNames.0x62BCA4DB742A99c834e2c24b609656A70EA25379:
-        "AllVerifiers"
      implementationNames.0x8536850750956c2FEebeCAB786d82271a5467687:
-        "TokensAndRamping"
      implementationNames.0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2:
-        "StarkExState"
      implementationNames.0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1:
-        "ForcedActions"
      implementationNames.0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339:
-        "OnchainVaults"
      implementationNames.0xB3788a88F063B217227E27ae16Ba550db3132bE6:
-        "ProxyUtils"
      implementationNames.eth:0x82123571C8a5e0910280C066bc634c4945FFcbC8:
+        "Proxy"
      implementationNames.eth:0x4EDD62189732e9fF476ABa880b48c29432A7AC9B:
+        "StarkExchange"
      implementationNames.eth:0x62BCA4DB742A99c834e2c24b609656A70EA25379:
+        "AllVerifiers"
      implementationNames.eth:0x8536850750956c2FEebeCAB786d82271a5467687:
+        "TokensAndRamping"
      implementationNames.eth:0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2:
+        "StarkExState"
      implementationNames.eth:0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1:
+        "ForcedActions"
      implementationNames.eth:0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339:
+        "OnchainVaults"
      implementationNames.eth:0xB3788a88F063B217227E27ae16Ba550db3132bE6:
+        "ProxyUtils"
    }
```

```diff
    EOA  (0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5) {
    +++ description: None
      address:
-        "0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5"
+        "eth:0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5"
    }
```

```diff
    contract Compound Token (0xc00e94Cb662C3520282E6f5717214004A7f26888) {
    +++ description: None
      address:
-        "0xc00e94Cb662C3520282E6f5717214004A7f26888"
+        "eth:0xc00e94Cb662C3520282E6f5717214004A7f26888"
      implementationNames.0xc00e94Cb662C3520282E6f5717214004A7f26888:
-        "Comp"
      implementationNames.eth:0xc00e94Cb662C3520282E6f5717214004A7f26888:
+        "Comp"
    }
```

```diff
    EOA  (0xd649b1E03aE10199c3Ac38f0fd8b5F3ecbDDb978) {
    +++ description: None
      address:
-        "0xd649b1E03aE10199c3Ac38f0fd8b5F3ecbDDb978"
+        "eth:0xd649b1E03aE10199c3Ac38f0fd8b5F3ecbDDb978"
    }
```

```diff
    EOA  (0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988) {
    +++ description: None
      address:
-        "0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988"
+        "eth:0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988"
    }
```

```diff
    contract Broker (0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5) {
    +++ description: None
      address:
-        "0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5"
+        "eth:0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5"
      values.onchainVaults:
-        "0x82123571C8a5e0910280C066bc634c4945FFcbC8"
+        "eth:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
      values.owner:
-        "0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988"
+        "eth:0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988"
      implementationNames.0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5:
-        "Broker"
      implementationNames.eth:0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5:
+        "Broker"
    }
```

```diff
    contract Committee (0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9) {
    +++ description: None
      address:
-        "0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"
+        "eth:0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"
      implementationNames.0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9:
-        ""
      implementationNames.eth:0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9:
+        ""
    }
```

```diff
+   Status: CREATED
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8)
    +++ description: Helper contract for registering limit orders from L1.
```

```diff
+   Status: CREATED
    contract StrategyCompound (0x5b000954F70B0410685193B0afd3074B744B5C97)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE)
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
```

```diff
+   Status: CREATED
    contract StarkExchange (0x82123571C8a5e0910280C066bc634c4945FFcbC8)
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
```

```diff
+   Status: CREATED
    contract Compound Token (0xc00e94Cb662C3520282E6f5717214004A7f26888)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Broker (0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Committee (0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9)
    +++ description: None
```

Generated with discovered.json: 0x50da563d53010ba8f3580ac7ce854b2f056afa0a

# Diff at Fri, 04 Jul 2025 12:19:06 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    EOA  (0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
+        "eth:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
      receivedPermissions.1.from:
-        "ethereum:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
+        "eth:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
      receivedPermissions.2.from:
-        "ethereum:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
+        "eth:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
      receivedPermissions.3.from:
-        "ethereum:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
+        "eth:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
    }
```

```diff
    EOA  (0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
+        "eth:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
    }
```

```diff
    EOA  (0xd649b1E03aE10199c3Ac38f0fd8b5F3ecbDDb978) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
+        "eth:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
    }
```

```diff
    EOA  (0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
+        "eth:0x82123571C8a5e0910280C066bc634c4945FFcbC8"
    }
```

Generated with discovered.json: 0xe8a493d35153dbb64b2ee650a4840c6435920e8a

# Diff at Wed, 28 May 2025 13:56:06 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@498e4fbc23b0148c96248f03ca33a8415e632b71 block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract Compound Token (0xc00e94Cb662C3520282E6f5717214004A7f26888) {
    +++ description: None
      name:
-        "Comp"
+        "Compound Token"
    }
```

Generated with discovered.json: 0x7d403d031f00656764aeb0bbbc8639cd0c7d5d6e

# Diff at Tue, 27 May 2025 08:27:21 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract StarkExchange (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      sourceHashes.7:
-        "0x93b21bfbef09c4e60d6a17309877245220508c54478159a8f2b9dbfb60576c4b"
      sourceHashes.6:
-        "0x452c4b92e2f090f2979fe1dec4ee28bf8b9c431b96b67966a3c2279f9e332684"
      sourceHashes.5:
-        "0xf615d0291aa23f36d8cb749e3950b549d57d38bfef0c342331d0cedd7d769026"
      sourceHashes.4:
-        "0x7e358cdedbf8af25ae12a5fe965db091c7751aafa68c2460ab43e81a8eb364b9"
      sourceHashes.3:
-        "0x54407214d4211e41ecb742c3df7564e352844c1f5da38ef2e206b0465bd5345b"
      sourceHashes.2:
-        "0x105353ea24f9e10459c2487f227bc285c4ca2317fac8e12a8b936bc92329aea5"
      sourceHashes.1:
-        "0x497eebe95d8d7611823ffcb6cc098a9c3c71e91941026f2b4c4989d6f9fa944d"
+        "0xfaa0bf87cf9230ba5a3f5530b447f76606e0cd9fb9d1acd2f3b87d30884e63d1"
    }
```

Generated with discovered.json: 0x4ad551c04d4228aa4cf962a52530b54af7246d25

# Diff at Fri, 23 May 2025 09:40:58 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 19825376
- current block number: 19825376

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    EOA  (0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e) {
    +++ description: None
      receivedPermissions.3.role:
+        ".$admin"
      receivedPermissions.2.role:
+        ".operators"
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    EOA  (0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5) {
    +++ description: None
      receivedPermissions.0.role:
+        ".operators"
    }
```

```diff
    EOA  (0xd649b1E03aE10199c3Ac38f0fd8b5F3ecbDDb978) {
    +++ description: None
      receivedPermissions.0.role:
+        ".tokenAdmins"
    }
```

```diff
    EOA  (0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988) {
    +++ description: None
      receivedPermissions.0.role:
+        ".tokenAdmins"
    }
```

Generated with discovered.json: 0x44d06e1dd1dbf07c9a4dbec4a9f75a158b780888

# Diff at Tue, 06 May 2025 10:56:51 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 19825376
- current block number: 19825376

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    EOA  (0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x288ab98ed2044d8885325839570443b1159ba874

# Diff at Tue, 29 Apr 2025 08:19:05 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 19825376
- current block number: 19825376

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract StarkExchange (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions:
-        [{"permission":"governStarknet","to":"0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e","via":[]},{"permission":"interact","to":"0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e","description":"manage the token admin role.","via":[]},{"permission":"interact","to":"0xd649b1E03aE10199c3Ac38f0fd8b5F3ecbDDb978","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]},{"permission":"interact","to":"0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]},{"permission":"operateStarkEx","to":"0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e","via":[]},{"permission":"operateStarkEx","to":"0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5","via":[]},{"permission":"upgrade","to":"0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e","via":[]}]
    }
```

Generated with discovered.json: 0x05140dc5a95ae77aa91bf56b25a6b282d3061b8c

# Diff at Thu, 27 Mar 2025 11:14:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 19825376
- current block number: 19825376

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      usedTypes.0.arg.2397984267054479079853548842566103781972463965746662494980785692480538410509:
-        "StarkNet OS (Starknet)"
+        "StarkNet OS (since v0.13.3)"
      usedTypes.0.arg.273279642033703284306509103355536170486431195329675679055627933497997642494:
+        "Starknet Aggregator (since v0.13.4)"
      usedTypes.0.arg.2231644845387633655859130162745748394456578773184260372693322394988769337368:
+        "StarkNet OS (since v0.13.4)"
    }
```

Generated with discovered.json: 0xa7793f76cd49819b94c987d3ecf9f0ea82542431

# Diff at Wed, 19 Mar 2025 13:04:55 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract undefined (0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x7ea773d6ab41d0adfd13be89fc6a91075e6c6985

# Diff at Tue, 11 Mar 2025 16:09:20 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b567159bfa1d1fb03ba2dbc6915b5acc47e00c0 block: 19825376
- current block number: 19825376

## Description

config: starknet/ex operator role description updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract undefined (0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e) {
    +++ description: None
      receivedPermissions.2.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

```diff
    contract StarkExchange (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.5.permission:
-        "operateStarknet"
+        "operateStarkEx"
      issuedPermissions.4.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

```diff
    contract undefined (0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5) {
    +++ description: None
      receivedPermissions.0.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

Generated with discovered.json: 0x1ade4ae7cb8ebffd26331b805f18ddb39e4e3ddc

# Diff at Thu, 06 Mar 2025 15:18:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 19825376
- current block number: 19825376

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      values.programHashMapped:
-        "3485280386001712778192330279103973322645241679001461923469191557000342180556"
+        "StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"15787695375210609250491147414005894154890873413229882671403677761527504080":"Starknet Aggregator (since v0.13.3)","2397984267054479079853548842566103781972463965746662494980785692480538410509":"StarkNet OS (Starknet)","853638403225561750106379562222782223909906501242604214771127703946595519856":"StarkNet OS (Paradex)","3383082961563516565935611087683915026448707331436034043529592588079494402084":"StarkNet OS (old Paradex, old StarkNet)","3485280386001712778192330279103973322645241679001461923469191557000342180556":"StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)","770346231394331402493200980986217737662224545740427952627288191358999988146":"ApeX-USDT","3174901404014912024702042974619036870715605532092680335571201877913899936957":"StarkEx Spot v4.0 (RhinoFi, Sorare)","16830627573509542901909952446321116535677491650708854009406762893086223513":"StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)","2530337539466159944237001094809327283009177793361359619481044346150483328860":"ApeX-USDC 20250130","3114724292040200590153042023978438629733352741898912919152162079752811928849":"StarkEx Perp v2.0 ApeX-USDC","217719352201300445998518619904782191262194843262573339166404641663770051805":"StarkNet (old)","3003515909324298587247571665454372831319437787162989623104387385306791861180":"StarkNet (old)","1161178844461337253856226043908368523817098764221830529880464854589141231910":"StarkNet Aggregator (old)","1921772108187713503530008849184725638117898887391063185252422808224349294626":"StarkNet (old)","3258367057337572248818716706664617507069572185152472699066582725377748079373":"StarkNet (old)","407700941260678649793204927710478760533239334662847444187959202896452163393":"StarkNet (old)","1865367024509426979036104162713508294334262484507712987283009063059134893433":"StarkNet (old)","54878256403880350656938046611252303365750679698042371543935159963667935317":"StarkNet (old)","2479841346739966073527450029179698923866252973805981504232089731754042431018":"StarkNet (old)","109586309220455887239200613090920758778188956576212125550190099009305121410":"StarkNet (old)"}}]
    }
```

Generated with discovered.json: 0x5590a0f520ea64a3e450b0a4bb94259cd6dac575

# Diff at Wed, 05 Mar 2025 14:55:59 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e85261cbf7cfc5afeac755b44f9df82c8a3c4ba block: 19825376
- current block number: 19825376

## Description

discodrive sn stack and starkex chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: Helper contract for registering limit orders from L1.
      template:
+        "starkex/OrderRegistry"
      description:
+        "Helper contract for registering limit orders from L1."
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      values.programHashMapped:
+        "3485280386001712778192330279103973322645241679001461923469191557000342180556"
      template:
+        "starkex/GpsFactRegistryAdapter"
      description:
+        "Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`)."
    }
```

```diff
    contract StarkExchange (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      name:
-        "Proxy"
+        "StarkExchange"
      issuedPermissions.6:
+        {"permission":"upgrade","to":"0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e","via":[]}
      issuedPermissions.5:
+        {"permission":"operateStarknet","to":"0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5","via":[]}
      issuedPermissions.4:
+        {"permission":"operateStarknet","to":"0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e","via":[]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0xd649b1E03aE10199c3Ac38f0fd8b5F3ecbDDb978","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e","description":"manage the token admin role.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      values.getActionCount:
-        0
      values.getActionHashByIndex:
-        []
      values.operators:
+        ["0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e","0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5"]
      values.tokenAdmins:
+        ["0xd649b1E03aE10199c3Ac38f0fd8b5F3ecbDDb978","0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988"]
      template:
+        "starkex/StarkExchange"
      description:
+        "Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles."
      fieldMeta:
+        {"$admin":{"severity":"HIGH","description":"Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts."},"isFinalized":{"severity":"HIGH","description":"Finalizes most of the configuration of the contract, which cannot be changed afterwards (only thorugh an upgrade)."},"DEPOSIT_CANCEL_DELAY":{"description":"The time delay required before canceled deposits to the L2 can be reclaimed."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xdfa44aad687c6cc52b3c72cca4f8ff8391e0bb45

# Diff at Tue, 04 Mar 2025 10:39:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: None
      sinceBlock:
+        12831566
    }
```

```diff
    contract StrategyCompound (0x5b000954F70B0410685193B0afd3074B744B5C97) {
    +++ description: None
      sinceBlock:
+        14473373
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: None
      sinceBlock:
+        13849860
    }
```

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      sinceBlock:
+        14225869
    }
```

```diff
    contract Comp (0xc00e94Cb662C3520282E6f5717214004A7f26888) {
    +++ description: None
      sinceBlock:
+        9601359
    }
```

```diff
    contract Broker (0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5) {
    +++ description: None
      sinceBlock:
+        14473363
    }
```

```diff
    contract Committee (0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9) {
    +++ description: None
      sinceBlock:
+        14652355
    }
```

Generated with discovered.json: 0x6ccddb5bf9b82f23ae279bdfef12e1df6a8c41f8

# Diff at Mon, 20 Jan 2025 11:09:40 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19825376
- current block number: 19825376

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
      issuedPermissions.0.to:
+        "0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e"
    }
```

Generated with discovered.json: 0xb56ed70b923c0a2ed22dc5d1b0f34083c193a01a

# Diff at Wed, 04 Dec 2024 14:14:24 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5ce1f4558272638b4ce9e4501463a3fa3ee115cb block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract Committee (0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9) {
    +++ description: None
      name:
-        ""
+        "Committee"
    }
```

```diff
+   Status: CREATED
    contract StrategyCompound (0x5b000954F70B0410685193B0afd3074B744B5C97)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Comp (0xc00e94Cb662C3520282E6f5717214004A7f26888)
    +++ description: None
```

Generated with discovered.json: 0x97311829fba2addaf36879b5132f3914016d29a4

# Diff at Mon, 21 Oct 2024 11:07:00 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.1.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x880c2620a1b1c1bc539b81f1533ca188c76cc94cfc5288bd1f19af042ea51805"
      values.$pastUpgrades.0.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.0.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0xc1986fcfa9adba1076e31573ea760b1b64e5dca5954623c3306f7f90f76fd3f9"
    }
```

Generated with discovered.json: 0xaa006de0251bb868d6a21e7c4b9968c755083eee

# Diff at Mon, 14 Oct 2024 10:52:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: None
      sourceHashes:
+        ["0x1e28fda3c245bc1fc13d0ddc7b108be510d1e0220fc67552921c87724bb45a4c"]
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: None
      sourceHashes:
+        ["0x3c0fff412189244728e9be021e2c7a1084326cc80e71f930221094909caafec0"]
    }
```

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      sourceHashes:
+        ["0x87045c081a3bd84c271153c36a9a503f84bc3035077d34144332c329d3fcb92d","0x54407214d4211e41ecb742c3df7564e352844c1f5da38ef2e206b0465bd5345b","0x497eebe95d8d7611823ffcb6cc098a9c3c71e91941026f2b4c4989d6f9fa944d","0x452c4b92e2f090f2979fe1dec4ee28bf8b9c431b96b67966a3c2279f9e332684","0xf615d0291aa23f36d8cb749e3950b549d57d38bfef0c342331d0cedd7d769026","0x7e358cdedbf8af25ae12a5fe965db091c7751aafa68c2460ab43e81a8eb364b9","0x105353ea24f9e10459c2487f227bc285c4ca2317fac8e12a8b936bc92329aea5","0x93b21bfbef09c4e60d6a17309877245220508c54478159a8f2b9dbfb60576c4b"]
    }
```

```diff
    contract Broker (0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5) {
    +++ description: None
      sourceHashes:
+        ["0xd9040d82f39aa8ff258f35b318bdf0fc513f4d8844c61c34f6c8ce81eee40b55"]
    }
```

Generated with discovered.json: 0x883c47f0499e60a075ba35d86b371a3c01066741

# Diff at Tue, 01 Oct 2024 10:51:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-02-17T20:46:14.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]],["2022-04-25T08:12:19.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x5b46b0bac040963e6884bb01007ce3b4986aabbc

# Diff at Wed, 21 Aug 2024 10:03:35 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825376
- current block number: 19825376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825376 (main branch discovery), not current.

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e","via":[]}]
    }
```

Generated with discovered.json: 0xbb775aaa070df2e5dc9f52e355e6512e11324786

# Diff at Wed, 08 May 2024 12:35:38 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624862
- current block number: 19825376

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624862 (main branch discovery), not current.

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"
+        ["0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"]
      values.getRegisteredVerifiers:
-        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
+        ["0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"]
    }
```

Generated with discovered.json: 0x8870dd93175a25008b5b4d8cdbdd6c0f52c7daf0

# Diff at Wed, 10 Apr 2024 11:14:53 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19377139
- current block number: 19624862

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19377139 (main branch discovery), not current.

```diff
    contract Proxy (0x82123571C8a5e0910280C066bc634c4945FFcbC8) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"]
+        "0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9"
      values.getRegisteredVerifiers:
-        ["0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"]
+        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
    }
```

Generated with discovered.json: 0xd7108783da2a0cec47eff8ee73ebc035214c4b83

# Diff at Wed, 06 Mar 2024 15:51:04 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cea88c5f3ff85fed5d72dadc72ae50315d0808d6 block: 19063883
- current block number: 19377139

## Description

Added the SHARP shared module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19063883 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafe (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CallProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GpsStatementVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6)
    +++ description: None
```

