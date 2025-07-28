Generated with discovered.json: 0x2275ca2987e71f85cd37646a815bcfe1c8c896bf

# Diff at Mon, 14 Jul 2025 12:45:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21686363
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
      address:
-        "0x0d283D685F0A741C463846176e4c8EFF90D3F9EC"
+        "eth:0x0d283D685F0A741C463846176e4c8EFF90D3F9EC"
      values.currentLogic:
-        "0x2D627FF93d32f5FEBb04d68409A889895B4aef2D"
+        "eth:0x2D627FF93d32f5FEBb04d68409A889895B4aef2D"
      values.gluon:
-        "0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
+        "eth:0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
      implementationNames.0x0d283D685F0A741C463846176e4c8EFF90D3F9EC:
-        "SpotData"
      implementationNames.eth:0x0d283D685F0A741C463846176e4c8EFF90D3F9EC:
+        "SpotData"
    }
```

```diff
    contract RegistryData (0x0fC25C7931679B838209c484d49Df0Cb9E633C41) {
    +++ description: None
      address:
-        "0x0fC25C7931679B838209c484d49Df0Cb9E633C41"
+        "eth:0x0fC25C7931679B838209c484d49Df0Cb9E633C41"
      values.currentLogic:
-        "0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C"
+        "eth:0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C"
      values.gluon:
-        "0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
+        "eth:0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
      implementationNames.0x0fC25C7931679B838209c484d49Df0Cb9E633C41:
-        "RegistryData"
      implementationNames.eth:0x0fC25C7931679B838209c484d49Df0Cb9E633C41:
+        "RegistryData"
    }
```

```diff
    contract SpotLogic (0x2D627FF93d32f5FEBb04d68409A889895B4aef2D) {
    +++ description: None
      address:
-        "0x2D627FF93d32f5FEBb04d68409A889895B4aef2D"
+        "eth:0x2D627FF93d32f5FEBb04d68409A889895B4aef2D"
      values.currentLogic:
-        "0x2D627FF93d32f5FEBb04d68409A889895B4aef2D"
+        "eth:0x2D627FF93d32f5FEBb04d68409A889895B4aef2D"
      values.data:
-        "0x0d283D685F0A741C463846176e4c8EFF90D3F9EC"
+        "eth:0x0d283D685F0A741C463846176e4c8EFF90D3F9EC"
      values.extensions.0:
-        "0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
+        "eth:0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
      values.getExtensions.0:
-        "0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
+        "eth:0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
      values.gluon:
-        "0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
+        "eth:0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
      values.operator:
-        "0x5CcAAAE7Bea14E8e04FB0FC7ED16DF49d5678Eb8"
+        "eth:0x5CcAAAE7Bea14E8e04FB0FC7ED16DF49d5678Eb8"
      values.upgradeOperator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x2D627FF93d32f5FEBb04d68409A889895B4aef2D:
-        "SpotLogic"
      implementationNames.eth:0x2D627FF93d32f5FEBb04d68409A889895B4aef2D:
+        "SpotLogic"
    }
```

```diff
    contract RegistryLogic (0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C) {
    +++ description: None
      address:
-        "0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C"
+        "eth:0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C"
      values.currentLogic:
-        "0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C"
+        "eth:0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C"
      values.data:
-        "0x0fC25C7931679B838209c484d49Df0Cb9E633C41"
+        "eth:0x0fC25C7931679B838209c484d49Df0Cb9E633C41"
      values.gluon:
-        "0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
+        "eth:0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
      values.old:
-        "0x7B70aCD346892736f9f6c7F4f196B07400a50Da0"
+        "eth:0x7B70aCD346892736f9f6c7F4f196B07400a50Da0"
      values.upgradeOperator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C:
-        "RegistryLogic"
      implementationNames.eth:0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C:
+        "RegistryLogic"
    }
```

```diff
    EOA  (0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A) {
    +++ description: None
      address:
-        "0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
+        "eth:0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
    }
```

```diff
    contract DerivativesData (0x563052914Fd973a2305763269A106a7B0B6D50Cc) {
    +++ description: None
      address:
-        "0x563052914Fd973a2305763269A106a7B0B6D50Cc"
+        "eth:0x563052914Fd973a2305763269A106a7B0B6D50Cc"
      values.currentLogic:
-        "0xDfBFe895e07e5115773Cb9631CB2148114589caC"
+        "eth:0xDfBFe895e07e5115773Cb9631CB2148114589caC"
      values.gluon:
-        "0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
+        "eth:0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
      implementationNames.0x563052914Fd973a2305763269A106a7B0B6D50Cc:
-        "DerivativesData"
      implementationNames.eth:0x563052914Fd973a2305763269A106a7B0B6D50Cc:
+        "DerivativesData"
    }
```

```diff
    EOA  (0x5CcAAAE7Bea14E8e04FB0FC7ED16DF49d5678Eb8) {
    +++ description: None
      address:
-        "0x5CcAAAE7Bea14E8e04FB0FC7ED16DF49d5678Eb8"
+        "eth:0x5CcAAAE7Bea14E8e04FB0FC7ED16DF49d5678Eb8"
    }
```

```diff
    contract Gluon (0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB) {
    +++ description: None
      address:
-        "0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
+        "eth:0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
      values.getOwners.0:
-        "0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
+        "eth:0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
      values.getOwners.1:
-        "0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
+        "eth:0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
      values.owners.0:
-        "0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
+        "eth:0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
      values.owners.1:
-        "0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
+        "eth:0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
      implementationNames.0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB:
-        "Gluon"
      implementationNames.eth:0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB:
+        "Gluon"
    }
```

```diff
    contract ApiKeyRegistry (0x7B70aCD346892736f9f6c7F4f196B07400a50Da0) {
    +++ description: None
      address:
-        "0x7B70aCD346892736f9f6c7F4f196B07400a50Da0"
+        "eth:0x7B70aCD346892736f9f6c7F4f196B07400a50Da0"
      values.getOwners.0:
-        "0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
+        "eth:0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
      values.getOwners.1:
-        "0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
+        "eth:0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
      implementationNames.0x7B70aCD346892736f9f6c7F4f196B07400a50Da0:
-        "ApiKeyRegistry"
      implementationNames.eth:0x7B70aCD346892736f9f6c7F4f196B07400a50Da0:
+        "ApiKeyRegistry"
    }
```

```diff
    contract StakeLogic (0x84e34fD82FC368F1a072075114AdC4b552a7a1F4) {
    +++ description: None
      address:
-        "0x84e34fD82FC368F1a072075114AdC4b552a7a1F4"
+        "eth:0x84e34fD82FC368F1a072075114AdC4b552a7a1F4"
      values.currentLogic:
-        "0x84e34fD82FC368F1a072075114AdC4b552a7a1F4"
+        "eth:0x84e34fD82FC368F1a072075114AdC4b552a7a1F4"
      values.data:
-        "0xaB3AC436D66CBEeDc734ed2c1562c3a213c9bc77"
+        "eth:0xaB3AC436D66CBEeDc734ed2c1562c3a213c9bc77"
      values.extensions.0:
-        "0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
+        "eth:0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
      values.getExtensions.0:
-        "0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
+        "eth:0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
      values.getTokens.0:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getTokens.1:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.getTokens.2:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      values.gluon:
-        "0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
+        "eth:0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
      values.governanceToken:
-        "0xBbff34E47E559ef680067a6B1c980639EEb64D24"
+        "eth:0xBbff34E47E559ef680067a6B1c980639EEb64D24"
      values.tokens.0:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.tokens.1:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.tokens.2:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      values.upgradeOperator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x84e34fD82FC368F1a072075114AdC4b552a7a1F4:
-        "StakeLogic"
      implementationNames.eth:0x84e34fD82FC368F1a072075114AdC4b552a7a1F4:
+        "StakeLogic"
    }
```

```diff
    contract StakeData (0xaB3AC436D66CBEeDc734ed2c1562c3a213c9bc77) {
    +++ description: None
      address:
-        "0xaB3AC436D66CBEeDc734ed2c1562c3a213c9bc77"
+        "eth:0xaB3AC436D66CBEeDc734ed2c1562c3a213c9bc77"
      values.currentLogic:
-        "0x84e34fD82FC368F1a072075114AdC4b552a7a1F4"
+        "eth:0x84e34fD82FC368F1a072075114AdC4b552a7a1F4"
      values.gluon:
-        "0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
+        "eth:0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
      implementationNames.0xaB3AC436D66CBEeDc734ed2c1562c3a213c9bc77:
-        "StakeData"
      implementationNames.eth:0xaB3AC436D66CBEeDc734ed2c1562c3a213c9bc77:
+        "StakeData"
    }
```

```diff
    EOA  (0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa) {
    +++ description: None
      address:
-        "0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
+        "eth:0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
    }
```

```diff
    contract LegacyTokensExtension (0xDA88EfA53c85Afa30564bb651A2E76b99a232082) {
    +++ description: None
      address:
-        "0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
+        "eth:0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
      values.getOwners.0:
-        "0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
+        "eth:0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
      values.getOwners.1:
-        "0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
+        "eth:0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
      values.getTokens.0:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      values.gluon:
-        "0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
+        "eth:0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
      values.owners.0:
-        "0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
+        "eth:0x4D2130d9D20428Dc249a1e938A0bcEA4b5B9ac1A"
      values.owners.1:
-        "0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
+        "eth:0xaC01F01f51F0bdd012C1838Bd5ceF330E6c7FFCa"
      values.tokens.0:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      implementationNames.0xDA88EfA53c85Afa30564bb651A2E76b99a232082:
-        "LegacyTokensExtension"
      implementationNames.eth:0xDA88EfA53c85Afa30564bb651A2E76b99a232082:
+        "LegacyTokensExtension"
    }
```

```diff
    EOA  (0xdB2E992E3026C16b95299457a3F62636Bd67bf50) {
    +++ description: None
      address:
-        "0xdB2E992E3026C16b95299457a3F62636Bd67bf50"
+        "eth:0xdB2E992E3026C16b95299457a3F62636Bd67bf50"
    }
```

```diff
    contract DerivativesLogic (0xDfBFe895e07e5115773Cb9631CB2148114589caC) {
    +++ description: None
      address:
-        "0xDfBFe895e07e5115773Cb9631CB2148114589caC"
+        "eth:0xDfBFe895e07e5115773Cb9631CB2148114589caC"
      values.currentLogic:
-        "0xDfBFe895e07e5115773Cb9631CB2148114589caC"
+        "eth:0xDfBFe895e07e5115773Cb9631CB2148114589caC"
      values.data:
-        "0x563052914Fd973a2305763269A106a7B0B6D50Cc"
+        "eth:0x563052914Fd973a2305763269A106a7B0B6D50Cc"
      values.extensions.0:
-        "0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
+        "eth:0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
      values.getExtensions.0:
-        "0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
+        "eth:0xDA88EfA53c85Afa30564bb651A2E76b99a232082"
      values.gluon:
-        "0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
+        "eth:0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB"
      values.operator:
-        "0xdB2E992E3026C16b95299457a3F62636Bd67bf50"
+        "eth:0xdB2E992E3026C16b95299457a3F62636Bd67bf50"
      values.upgradeOperator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xDfBFe895e07e5115773Cb9631CB2148114589caC:
-        "DerivativesLogic"
      implementationNames.eth:0xDfBFe895e07e5115773Cb9631CB2148114589caC:
+        "DerivativesLogic"
    }
```

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

Generated with discovered.json: 0x84e32b9762f2ddfd3431e205c838ed86eb0e0181

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
