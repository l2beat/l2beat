Generated with discovered.json: 0xa275120fd9db4b79ec01dbb1b439fba65017c69f

# Diff at Fri, 26 Jul 2024 07:58:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 7357351
- current block number: 7788134

## Description

The governance (owner, admin roles) of the scroll contracts are transfered from an EOA to a new Multisig.

## Watched changes

```diff
    contract zkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2) {
    +++ description: None
      values.$admin:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      values.getGovernor:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      values.owner:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
    }
```

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      values.owner:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
    }
```

```diff
    contract ScrollL2Gateway (0xd8428A59B60Df2d81514D429D57DF23293f1bCe7) {
    +++ description: None
      values.$admin:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      values.owner:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
+        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
    }
```

```diff
+   Status: CREATED
    contract AdminMultisig (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77)
    +++ description: None
```

## Source code changes

```diff
.../scroll/.flat/AdminMultisig/GnosisSafeL2.sol    | 1031 ++++++++++++++++++++
 .../.flat/AdminMultisig/GnosisSafeProxy.p.sol      |   34 +
 2 files changed, 1065 insertions(+)
```

Generated with discovered.json: 0x8fcd3cdd6b188eeda0d5b3e26aa9565887e41916

# Diff at Thu, 04 Jul 2024 14:09:46 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 7132743

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract zkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollL2Gateway (0xd8428A59B60Df2d81514D429D57DF23293f1bCe7)
    +++ description: None
```
