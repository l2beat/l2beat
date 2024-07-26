Generated with discovered.json: 0x43508d274a66b5fb43102c937336f2b681c9283f

# Diff at Fri, 26 Jul 2024 08:11:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 16993704
- current block number: 17596075

## Description

Base admin / owner MS threshold is lowered to 4/7.

## Watched changes

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      values.$multisigThreshold:
-        "5 of 7 (71%)"
+        "4 of 7 (57%)"
      values.getThreshold:
-        5
+        4
    }
```

Generated with discovered.json: 0xd40a7f76a3c835dc8caeb94c859893b3483f8a4b

# Diff at Thu, 04 Jul 2024 14:09:20 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 16656405

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C)
    +++ description: None
```
