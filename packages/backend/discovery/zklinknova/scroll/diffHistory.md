Generated with discovered.json: 0x00414a878aec559ac53308f81ab82ae9455b45e9

# Diff at Fri, 30 Aug 2024 08:17:46 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 7788134
- current block number: 7788134

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7788134 (main branch discovery), not current.

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract AdminMultisig (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x63c3f20c04bdcea530fb8d4de42b603f056595eb

# Diff at Fri, 23 Aug 2024 10:02:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 7788134
- current block number: 7788134

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7788134 (main branch discovery), not current.

```diff
    contract zkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ScrollL2Gateway (0xd8428A59B60Df2d81514D429D57DF23293f1bCe7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xba17e846374d11726b45eed293ba3894a17344ac

# Diff at Wed, 21 Aug 2024 10:08:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 7788134
- current block number: 7788134

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7788134 (main branch discovery), not current.

```diff
    contract zkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC4673dAbfAf04D2A430e244B63F040D27199102f","via":[]}]
    }
```

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c","via":[]}]
    }
```

```diff
    contract ScrollL2Gateway (0xd8428A59B60Df2d81514D429D57DF23293f1bCe7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77","via":[]}]
    }
```

```diff
    contract AdminMultisig (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x119B9459D9119D07c23aD06778AeaBec804Fd1a2","0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x119B9459D9119D07c23aD06778AeaBec804Fd1a2","via":[]},{"permission":"upgrade","target":"0xd8428A59B60Df2d81514D429D57DF23293f1bCe7","via":[]}]
    }
```

Generated with discovered.json: 0x8b58f760dcebb2fbffdb7b03c378922d1f540983

# Diff at Fri, 09 Aug 2024 10:15:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 7788134
- current block number: 7788134

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7788134 (main branch discovery), not current.

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"]
      assignedPermissions.upgrade:
+        ["0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"]
    }
```

```diff
    contract AdminMultisig (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x119B9459D9119D07c23aD06778AeaBec804Fd1a2","0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"]
      assignedPermissions.upgrade:
+        ["0x119B9459D9119D07c23aD06778AeaBec804Fd1a2","0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"]
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5","0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0xF801886AE2e127A269B0F11892edb54F692d02dF","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xb2c9E9a8eDEF1488E75F9E5b65Be14751733B144","0xda9f561F0d8d7061fa47e47E352eAD6844Ae3272","0x45b62A07c525278F2ecd7915130E797B04B05C48"]
      values.getThreshold:
-        5
      values.$members:
+        ["0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5","0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0xF801886AE2e127A269B0F11892edb54F692d02dF","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xb2c9E9a8eDEF1488E75F9E5b65Be14751733B144","0xda9f561F0d8d7061fa47e47E352eAD6844Ae3272","0x45b62A07c525278F2ecd7915130E797B04B05C48"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

Generated with discovered.json: 0xedbd057508280d9873d1196125e4fa0e7282bc84

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
