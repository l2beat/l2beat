Generated with discovered.json: 0x54b34fb81522d1df873e6421a323d6b5422228f6

# Diff at Tue, 10 Nov 2026 13:17:15 GMT:

- id: 6b5ced56
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1794316571

## Description

Initial discovery of Splits V2: the Warehouse, and the pull and push split factories and implementations of v2.0, v2.1 and v2.2.

## Initial discovery

```diff
+   Status: CREATED
    contract PushSplit_v2_0 (eth:0x0285B37453F73f8dE94De0cAEf8108bC8431BE34) [splits/PushSplit]
    +++ description: Implementation that every push split of its version delegates to. A push split collects ETH and ERC-20 tokens. Anyone can distribute them, which sends each recipient's share straight to its address. ETH that a recipient does not accept is deposited for it in the SplitsWarehouse. A split created with an owner lets that owner change the recipients, pause distributions and execute any call from the split.
```

```diff
+   Status: CREATED
    contract PushSplit_v2_2 (eth:0x1e2086A7e84a32482ac03000D56925F607CCB708) [splits/PushSplit]
    +++ description: Implementation that every push split of its version delegates to. A push split collects ETH and ERC-20 tokens. Anyone can distribute them, which sends each recipient's share straight to its address. ETH that a recipient does not accept is deposited for it in the SplitsWarehouse. A split created with an owner lets that owner change the recipients, pause distributions and execute any call from the split.
```

```diff
+   Status: CREATED
    contract PushSplit_v2_1 (eth:0x3f81D81e0884abD8Cc4583a704a9397972623214) [splits/PushSplit]
    +++ description: Implementation that every push split of its version delegates to. A push split collects ETH and ERC-20 tokens. Anyone can distribute them, which sends each recipient's share straight to its address. ETH that a recipient does not accept is deposited for it in the SplitsWarehouse. A split created with an owner lets that owner change the recipients, pause distributions and execute any call from the split.
```

```diff
+   Status: CREATED
    contract PullSplitFactory_v2_1 (eth:0x5cbA88D55Cec83caD5A105Ad40C8c9aF20bE21d1) [splits/SplitFactoryV2]
    +++ description: Deploys splits of one type and version as minimal proxies of its split implementation. Anyone can create a split, with or without an owner, at an address fixed by its recipients, owner and salt. Immutable, with no owner.
```

```diff
+   Status: CREATED
    contract PullSplit_v2_0 (eth:0x6291497D1206618fC810900d2e7e9AF6Aa1F1b99) [splits/PullSplit]
    +++ description: Implementation that every pull split of its version delegates to. A pull split collects ETH and ERC-20 tokens. Anyone can distribute them, which credits each recipient's share as a balance in the SplitsWarehouse for the recipient to withdraw. A split created with an owner lets that owner change the recipients, pause distributions and execute any call from the split.
```

```diff
+   Status: CREATED
    contract PullSplitFactory_v2_2 (eth:0x6B9118074aB15142d7524E8c4ea8f62A3Bdb98f1) [splits/SplitFactoryV2]
    +++ description: Deploys splits of one type and version as minimal proxies of its split implementation. Anyone can create a split, with or without an owner, at an address fixed by its recipients, owner and salt. Immutable, with no owner.
```

```diff
+   Status: CREATED
    contract PullSplitFactory_v2_0 (eth:0x80f1B766817D04870f115fEBbcCADF8DBF75E017) [splits/SplitFactoryV2]
    +++ description: Deploys splits of one type and version as minimal proxies of its split implementation. Anyone can create a split, with or without an owner, at an address fixed by its recipients, owner and salt. Immutable, with no owner.
```

```diff
+   Status: CREATED
    contract PushSplitFactory_v2_2 (eth:0x8E8eB0cC6AE34A38B67D5Cf91ACa38f60bc3Ecf4) [splits/SplitFactoryV2]
    +++ description: Deploys splits of one type and version as minimal proxies of its split implementation. Anyone can create a split, with or without an owner, at an address fixed by its recipients, owner and salt. Immutable, with no owner.
```

```diff
+   Status: CREATED
    contract SplitsWarehouse (eth:0x8fb66F38cF86A3d5e8768f8F1754A24A6c661Fb8) [splits/SplitsWarehouse]
    +++ description: Holds ETH and ERC-20 tokens for their owners as ERC-6909 balances, one token id per asset. Pull splits distribute by moving balances inside it, and push splits deposit a recipient's ETH here when the direct send fails. Anyone can deposit for any address, and anyone can trigger a withdrawal, which always pays the balance owner. Immutable, with no owner.
```

```diff
+   Status: CREATED
    contract PullSplit_v2_2 (eth:0x98254AeDb6B2c30b70483064367f0BA24ca86244) [splits/PullSplit]
    +++ description: Implementation that every pull split of its version delegates to. A pull split collects ETH and ERC-20 tokens. Anyone can distribute them, which credits each recipient's share as a balance in the SplitsWarehouse for the recipient to withdraw. A split created with an owner lets that owner change the recipients, pause distributions and execute any call from the split.
```

```diff
+   Status: CREATED
    contract PushSplitFactory_v2_0 (eth:0xaDC87646f736d6A82e9a6539cddC488b2aA07f38) [splits/SplitFactoryV2]
    +++ description: Deploys splits of one type and version as minimal proxies of its split implementation. Anyone can create a split, with or without an owner, at an address fixed by its recipients, owner and salt. Immutable, with no owner.
```

```diff
+   Status: CREATED
    contract PushSplitFactory_v2_1 (eth:0xDc6259E13ec0621e6F19026b2e49D846525548Ed) [splits/SplitFactoryV2]
    +++ description: Deploys splits of one type and version as minimal proxies of its split implementation. Anyone can create a split, with or without an owner, at an address fixed by its recipients, owner and salt. Immutable, with no owner.
```

```diff
+   Status: CREATED
    contract PullSplit_v2_1 (eth:0xF9C25250523Df26343222fC46de932355B850c97) [splits/PullSplit]
    +++ description: Implementation that every pull split of its version delegates to. A pull split collects ETH and ERC-20 tokens. Anyone can distribute them, which credits each recipient's share as a balance in the SplitsWarehouse for the recipient to withdraw. A split created with an owner lets that owner change the recipients, pause distributions and execute any call from the split.
```
