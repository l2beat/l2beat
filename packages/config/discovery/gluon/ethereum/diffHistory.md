Generated with discovered.json: 0xb203db49d814888cebf3dcdae855724696888315

# Diff at Tue, 04 Mar 2025 10:39:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21686363
- current block number: 21686363

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21686363 (main branch discovery), not current.

```diff
    contract SpotData (0x0d283D685F0A741C463846176e4c8EFF90D3F9EC) {
    +++ description: None
      sinceBlock:
+        8929713
    }
```

```diff
    contract RegistryData (0x0fC25C7931679B838209c484d49Df0Cb9E633C41) {
    +++ description: None
      sinceBlock:
+        8929683
    }
```

```diff
    contract SpotLogic (0x2D627FF93d32f5FEBb04d68409A889895B4aef2D) {
    +++ description: None
      sinceBlock:
+        11589589
    }
```

```diff
    contract RegistryLogic (0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C) {
    +++ description: None
      sinceBlock:
+        8929689
    }
```

```diff
    contract DerivativesData (0x563052914Fd973a2305763269A106a7B0B6D50Cc) {
    +++ description: None
      sinceBlock:
+        10744938
    }
```

```diff
    contract Gluon (0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB) {
    +++ description: None
      sinceBlock:
+        8929632
    }
```

```diff
    contract ApiKeyRegistry (0x7B70aCD346892736f9f6c7F4f196B07400a50Da0) {
    +++ description: None
      sinceBlock:
+        7217381
    }
```

```diff
    contract StakeLogic (0x84e34fD82FC368F1a072075114AdC4b552a7a1F4) {
    +++ description: None
      sinceBlock:
+        11783715
    }
```

```diff
    contract StakeData (0xaB3AC436D66CBEeDc734ed2c1562c3a213c9bc77) {
    +++ description: None
      sinceBlock:
+        8929704
    }
```

```diff
    contract LegacyTokensExtension (0xDA88EfA53c85Afa30564bb651A2E76b99a232082) {
    +++ description: None
      sinceBlock:
+        11225379
    }
```

```diff
    contract DerivativesLogic (0xDfBFe895e07e5115773Cb9631CB2148114589caC) {
    +++ description: None
      sinceBlock:
+        11225380
    }
```

Generated with discovered.json: 0x6bf7488347f7de844b915d87441b66cda4c1a9fe

# Diff at Thu, 12 Dec 2024 15:26:58 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21322246
- current block number: 21387313

## Description

Ignored not needed values in config.

## Watched changes

```diff
    contract StakeLogic (0x84e34fD82FC368F1a072075114AdC4b552a7a1F4) {
    +++ description: None
      values.currentIntervalIndex:
-        23
+        24
      values.getToBeDistributed.2:
-        2730626699
+        2730244557
      values.getToBeDistributed.1:
-        "1346902354215947912554"
+        "1346505840564614195006"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21322246 (main branch discovery), not current.

```diff
    contract StakeLogic (0x84e34fD82FC368F1a072075114AdC4b552a7a1F4) {
    +++ description: None
      values.toBeDistributed:
-        [0,"1346902354215947912554",2730626699]
    }
```

Generated with discovered.json: 0x87e9ba61b5443320a05ce2afe1174210be0f1560

# Diff at Tue, 10 Dec 2024 11:07:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 21322246

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract SpotData (0x0d283D685F0A741C463846176e4c8EFF90D3F9EC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegistryData (0x0fC25C7931679B838209c484d49Df0Cb9E633C41)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SpotLogic (0x2D627FF93d32f5FEBb04d68409A889895B4aef2D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegistryLogic (0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DerivativesData (0x563052914Fd973a2305763269A106a7B0B6D50Cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gluon (0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ApiKeyRegistry (0x7B70aCD346892736f9f6c7F4f196B07400a50Da0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeLogic (0x84e34fD82FC368F1a072075114AdC4b552a7a1F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeData (0xaB3AC436D66CBEeDc734ed2c1562c3a213c9bc77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LegacyTokensExtension (0xDA88EfA53c85Afa30564bb651A2E76b99a232082)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DerivativesLogic (0xDfBFe895e07e5115773Cb9631CB2148114589caC)
    +++ description: None
```
