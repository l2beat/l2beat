Generated with discovered.json: 0xe4f3be0ed27bb1b2addac2ea0664dda150d6b388

# Diff at Mon, 14 Jul 2025 12:45:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21322825
- current block number: 21322825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21322825 (main branch discovery), not current.

```diff
    EOA  (0x2A038e100F8B85DF21e4d44121bdBfE0c288A869) {
    +++ description: None
      address:
-        "0x2A038e100F8B85DF21e4d44121bdBfE0c288A869"
+        "eth:0x2A038e100F8B85DF21e4d44121bdBfE0c288A869"
    }
```

```diff
    EOA  (0x5E583B6a1686f7Bc09A6bBa66E852A7C80d36F00) {
    +++ description: None
      address:
-        "0x5E583B6a1686f7Bc09A6bBa66E852A7C80d36F00"
+        "eth:0x5E583B6a1686f7Bc09A6bBa66E852A7C80d36F00"
    }
```

```diff
    contract AnyswapV4Router (0x6b7a87899490EcE95443e979cA9485CBE7E71522) {
    +++ description: None
      address:
-        "0x6b7a87899490EcE95443e979cA9485CBE7E71522"
+        "eth:0x6b7a87899490EcE95443e979cA9485CBE7E71522"
      values.factory:
-        "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"
+        "eth:0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"
      values.mpc:
-        "0x2A038e100F8B85DF21e4d44121bdBfE0c288A869"
+        "eth:0x2A038e100F8B85DF21e4d44121bdBfE0c288A869"
      values.wNATIVE:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      implementationNames.0x6b7a87899490EcE95443e979cA9485CBE7E71522:
-        "AnyswapV4Router"
      implementationNames.eth:0x6b7a87899490EcE95443e979cA9485CBE7E71522:
+        "AnyswapV4Router"
    }
```

```diff
    contract AnyswapV6Router (0xBa8Da9dcF11B50B03fd5284f164Ef5cdEF910705) {
    +++ description: None
      address:
-        "0xBa8Da9dcF11B50B03fd5284f164Ef5cdEF910705"
+        "eth:0xBa8Da9dcF11B50B03fd5284f164Ef5cdEF910705"
      values.factory:
-        "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"
+        "eth:0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"
      values.mpc:
-        "0x2A038e100F8B85DF21e4d44121bdBfE0c288A869"
+        "eth:0x2A038e100F8B85DF21e4d44121bdBfE0c288A869"
      values.wNATIVE:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      implementationNames.0xBa8Da9dcF11B50B03fd5284f164Ef5cdEF910705:
-        "AnyswapV6Router"
      implementationNames.eth:0xBa8Da9dcF11B50B03fd5284f164Ef5cdEF910705:
+        "AnyswapV6Router"
    }
```

```diff
+   Status: CREATED
    contract AnyswapV4Router (0x6b7a87899490EcE95443e979cA9485CBE7E71522)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnyswapV6Router (0xBa8Da9dcF11B50B03fd5284f164Ef5cdEF910705)
    +++ description: None
```

Generated with discovered.json: 0x392dac6861702cdcea1f0673f295bf0baf8d7095

# Diff at Tue, 04 Mar 2025 10:39:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21322825
- current block number: 21322825

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21322825 (main branch discovery), not current.

```diff
    contract AnyswapV4Router (0x6b7a87899490EcE95443e979cA9485CBE7E71522) {
    +++ description: None
      sinceBlock:
+        12657964
    }
```

```diff
    contract AnyswapV6Router (0xBa8Da9dcF11B50B03fd5284f164Ef5cdEF910705) {
    +++ description: None
      sinceBlock:
+        14215845
    }
```

Generated with discovered.json: 0xffa7bba55c054da75c45655556f591963a5c8a83

# Diff at Tue, 03 Dec 2024 15:18:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 21322825

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract AnyswapV4Router (0x6b7a87899490EcE95443e979cA9485CBE7E71522)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnyswapV6Router (0xBa8Da9dcF11B50B03fd5284f164Ef5cdEF910705)
    +++ description: None
```
