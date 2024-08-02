Generated with discovered.json: 0x597584cf793814ce5a34508814da3c40519a17dd

# Diff at Fri, 26 Jul 2024 08:09:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 231384315
- current block number: 236183206

## Description

The admin / owner MS threshold is lowered to 5/8.

## Watched changes

```diff
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 8 (75%)"
+        "5 of 8 (63%)"
      values.getThreshold:
-        6
+        5
    }
```

Generated with discovered.json: 0x85cbc6a4cd4dcbb2283e6b810b1867b8faaeacc6

# Diff at Thu, 04 Jul 2024 14:08:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 228694559

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract ArbitrumProxyAdmin (0x48698A17D193bFc882395AC06a1DEdbb222F2917)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumL2Gateway (0x7bd79DEd935B542fb22c74305a4d2A293C18483a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumOwner (0xa29fFe244898CBec19DFEaAfB5cE671389FfF60F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A)
    +++ description: None
```
