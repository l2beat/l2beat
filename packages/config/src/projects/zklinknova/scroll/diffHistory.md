Generated with discovered.json: 0x258536464ea3ed90d2538ec904d55c2e03c28629

# Diff at Thu, 31 Jul 2025 10:58:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@07319d194d312aca8103826b7db44d44613cc7fa block: 1753687799
- current timestamp: 1753687799

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753687799 (main branch discovery), not current.

```diff
    contract ScrollzkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2) {
    +++ description: None
      name:
-        "zkLink"
+        "ScrollzkLink"
    }
```

```diff
    contract ScrollL1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c) {
    +++ description: None
      name:
-        "L1ERC20Bridge"
+        "ScrollL1ERC20Bridge"
    }
```

Generated with discovered.json: 0x6ac178f2ddeffb6e5086681e2777b9463662a653

# Diff at Mon, 14 Jul 2025 12:47:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 13963893
- current block number: 13963893

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 13963893 (main branch discovery), not current.

```diff
    contract zkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2) {
    +++ description: None
      address:
-        "0x119B9459D9119D07c23aD06778AeaBec804Fd1a2"
+        "scr:0x119B9459D9119D07c23aD06778AeaBec804Fd1a2"
      values.$admin:
-        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
+        "scr:0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      values.$implementation:
-        "0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"
+        "scr:0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"
      values.$pastUpgrades.0.2.0:
-        "0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"
+        "scr:0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"
      values.forwardFeeAllocator:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.gateway:
-        "0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"
+        "scr:0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"
      values.getGateway:
-        "0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"
+        "scr:0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"
      values.getGovernor:
-        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
+        "scr:0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      values.owner:
-        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
+        "scr:0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      implementationNames.0x119B9459D9119D07c23aD06778AeaBec804Fd1a2:
-        "ERC1967Proxy"
      implementationNames.0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D:
-        "ZkLink"
      implementationNames.scr:0x119B9459D9119D07c23aD06778AeaBec804Fd1a2:
+        "ERC1967Proxy"
      implementationNames.scr:0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D:
+        "ZkLink"
    }
```

```diff
    EOA  (0x3bb708D3Bdd0C997f56E9dDb11f98dc2b37423A4) {
    +++ description: None
      address:
-        "0x3bb708D3Bdd0C997f56E9dDb11f98dc2b37423A4"
+        "scr:0x3bb708D3Bdd0C997f56E9dDb11f98dc2b37423A4"
    }
```

```diff
    contract L1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c) {
    +++ description: None
      address:
-        "0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"
+        "scr:0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"
      values.$admin:
-        "0xC4673dAbfAf04D2A430e244B63F040D27199102f"
+        "scr:0xC4673dAbfAf04D2A430e244B63F040D27199102f"
      values.$implementation:
-        "0x067c7126a83560Ed2Fc345d25799F696B7Ea47Ca"
+        "scr:0x067c7126a83560Ed2Fc345d25799F696B7Ea47Ca"
      values.$pastUpgrades.0.2.0:
-        "0x067c7126a83560Ed2Fc345d25799F696B7Ea47Ca"
+        "scr:0x067c7126a83560Ed2Fc345d25799F696B7Ea47Ca"
      values.l2Bridge:
-        "0xC97c5E43c14D4F524347795410C299db1FA331b3"
+        "scr:0xC97c5E43c14D4F524347795410C299db1FA331b3"
      values.l2TokenBeacon:
-        "0x3bb708D3Bdd0C997f56E9dDb11f98dc2b37423A4"
+        "scr:0x3bb708D3Bdd0C997f56E9dDb11f98dc2b37423A4"
      implementationNames.0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c:
-        "TransparentUpgradeableProxy"
      implementationNames.0x067c7126a83560Ed2Fc345d25799F696B7Ea47Ca:
-        "L1ERC20Bridge"
      implementationNames.scr:0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x067c7126a83560Ed2Fc345d25799F696B7Ea47Ca:
+        "L1ERC20Bridge"
    }
```

```diff
    EOA  (0x45b62A07c525278F2ecd7915130E797B04B05C48) {
    +++ description: None
      address:
-        "0x45b62A07c525278F2ecd7915130E797B04B05C48"
+        "scr:0x45b62A07c525278F2ecd7915130E797B04B05C48"
    }
```

```diff
    EOA  (0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5) {
    +++ description: None
      address:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "scr:0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
    }
```

```diff
    EOA  (0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10) {
    +++ description: None
      address:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "scr:0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
    }
```

```diff
    EOA  (0xb2c9E9a8eDEF1488E75F9E5b65Be14751733B144) {
    +++ description: None
      address:
-        "0xb2c9E9a8eDEF1488E75F9E5b65Be14751733B144"
+        "scr:0xb2c9E9a8eDEF1488E75F9E5b65Be14751733B144"
    }
```

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      address:
-        "0xC4673dAbfAf04D2A430e244B63F040D27199102f"
+        "scr:0xC4673dAbfAf04D2A430e244B63F040D27199102f"
      values.owner:
-        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
+        "scr:0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      implementationNames.0xC4673dAbfAf04D2A430e244B63F040D27199102f:
-        "ProxyAdmin"
      implementationNames.scr:0xC4673dAbfAf04D2A430e244B63F040D27199102f:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xC97c5E43c14D4F524347795410C299db1FA331b3) {
    +++ description: None
      address:
-        "0xC97c5E43c14D4F524347795410C299db1FA331b3"
+        "scr:0xC97c5E43c14D4F524347795410C299db1FA331b3"
    }
```

```diff
    EOA  (0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5) {
    +++ description: None
      address:
-        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
+        "scr:0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
    }
```

```diff
    contract ScrollL2Gateway (0xd8428A59B60Df2d81514D429D57DF23293f1bCe7) {
    +++ description: None
      address:
-        "0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"
+        "scr:0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"
      values.$admin:
-        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
+        "scr:0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      values.$implementation:
-        "0xe469c1330cEEcC375fE17E7D649eA270186D344F"
+        "scr:0xe469c1330cEEcC375fE17E7D649eA270186D344F"
      values.$pastUpgrades.0.2.0:
-        "0xe469c1330cEEcC375fE17E7D649eA270186D344F"
+        "scr:0xe469c1330cEEcC375fE17E7D649eA270186D344F"
      values.ethToken:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.getRemoteGateway:
-        "0x986c905087a663db3C81ad319b94c1E9dd388e92"
+        "scr:0x986c905087a663db3C81ad319b94c1E9dd388e92"
      values.MESSAGE_SERVICE:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
+        "scr:0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      values.ZKLINK:
-        "0x119B9459D9119D07c23aD06778AeaBec804Fd1a2"
+        "scr:0x119B9459D9119D07c23aD06778AeaBec804Fd1a2"
      implementationNames.0xd8428A59B60Df2d81514D429D57DF23293f1bCe7:
-        "ERC1967Proxy"
      implementationNames.0xe469c1330cEEcC375fE17E7D649eA270186D344F:
-        "ScrollL2Gateway"
      implementationNames.scr:0xd8428A59B60Df2d81514D429D57DF23293f1bCe7:
+        "ERC1967Proxy"
      implementationNames.scr:0xe469c1330cEEcC375fE17E7D649eA270186D344F:
+        "ScrollL2Gateway"
    }
```

```diff
    EOA  (0xda9f561F0d8d7061fa47e47E352eAD6844Ae3272) {
    +++ description: None
      address:
-        "0xda9f561F0d8d7061fa47e47E352eAD6844Ae3272"
+        "scr:0xda9f561F0d8d7061fa47e47E352eAD6844Ae3272"
    }
```

```diff
    contract ScrollOwner (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77) {
    +++ description: None
      address:
-        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
+        "scr:0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "scr:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
+        "scr:0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
      values.$members.1:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "scr:0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
      values.$members.2:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "scr:0xF801886AE2e127A269B0F11892edb54F692d02dF"
      values.$members.3:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "scr:0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
      values.$members.4:
-        "0xb2c9E9a8eDEF1488E75F9E5b65Be14751733B144"
+        "scr:0xb2c9E9a8eDEF1488E75F9E5b65Be14751733B144"
      values.$members.5:
-        "0xda9f561F0d8d7061fa47e47E352eAD6844Ae3272"
+        "scr:0xda9f561F0d8d7061fa47e47E352eAD6844Ae3272"
      values.$members.6:
-        "0x45b62A07c525278F2ecd7915130E797B04B05C48"
+        "scr:0x45b62A07c525278F2ecd7915130E797B04B05C48"
      implementationNames.0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.scr:0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77:
+        "GnosisSafeProxy"
      implementationNames.scr:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0xF801886AE2e127A269B0F11892edb54F692d02dF) {
    +++ description: None
      address:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "scr:0xF801886AE2e127A269B0F11892edb54F692d02dF"
    }
```

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

```diff
+   Status: CREATED
    contract ScrollOwner (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77)
    +++ description: None
```

Generated with discovered.json: 0xe18aedddc442ddab1864e0ed4a7c6058441016a9

# Diff at Fri, 04 Jul 2025 12:19:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 13963893
- current block number: 13963893

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 13963893 (main branch discovery), not current.

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "scroll:0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"
+        "scr:0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"
    }
```

```diff
    contract ScrollOwner (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77) {
    +++ description: None
      receivedPermissions.0.from:
-        "scroll:0x119B9459D9119D07c23aD06778AeaBec804Fd1a2"
+        "scr:0x119B9459D9119D07c23aD06778AeaBec804Fd1a2"
      receivedPermissions.1.via.0.address:
-        "scroll:0xC4673dAbfAf04D2A430e244B63F040D27199102f"
+        "scr:0xC4673dAbfAf04D2A430e244B63F040D27199102f"
      receivedPermissions.1.from:
-        "scroll:0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"
+        "scr:0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"
      receivedPermissions.2.from:
-        "scroll:0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"
+        "scr:0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"
      directlyReceivedPermissions.0.from:
-        "scroll:0xC4673dAbfAf04D2A430e244B63F040D27199102f"
+        "scr:0xC4673dAbfAf04D2A430e244B63F040D27199102f"
    }
```

Generated with discovered.json: 0xfec80eab3b98d0bce09d30018673d404744ee094

# Diff at Fri, 23 May 2025 09:41:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 13963893
- current block number: 13963893

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 13963893 (main branch discovery), not current.

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract ScrollOwner (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77) {
    +++ description: None
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x97bd1acb7e57852c4ce94378ee426b37362d8d89

# Diff at Tue, 29 Apr 2025 08:19:31 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 13963893
- current block number: 13963893

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 13963893 (main branch discovery), not current.

```diff
    contract zkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77","via":[{"address":"0xC4673dAbfAf04D2A430e244B63F040D27199102f"}]}]
    }
```

```diff
    contract ScrollL2Gateway (0xd8428A59B60Df2d81514D429D57DF23293f1bCe7) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77","via":[]}]
    }
```

Generated with discovered.json: 0x815a01d3f949d8d66c61b3c8414862e9922b37b0

# Diff at Thu, 10 Apr 2025 14:44:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 13963893
- current block number: 13963893

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 13963893 (main branch discovery), not current.

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xa4fe61b8f8c934c882062cf6c8eb85ef35c3dec5

# Diff at Tue, 11 Mar 2025 08:13:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 13948997
- current block number: 13963893

## Description

proxyadmin template match.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 13948997 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xC4673dAbfAf04D2A430e244B63F040D27199102f"
+        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      issuedPermissions.0.via.0:
+        {"address":"0xC4673dAbfAf04D2A430e244B63F040D27199102f"}
    }
```

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"}]
      template:
+        "global/ProxyAdmin"
      displayName:
+        "ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"}]
    }
```

```diff
    contract ScrollOwner (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"}
      receivedPermissions.1.from:
-        "0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"
+        "0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"
      receivedPermissions.1.via:
+        [{"address":"0xC4673dAbfAf04D2A430e244B63F040D27199102f"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xC4673dAbfAf04D2A430e244B63F040D27199102f"}]
    }
```

Generated with discovered.json: 0x900f6c43f908621af4f496b47b0a619c3bfd44b3

# Diff at Tue, 04 Mar 2025 10:42:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 8983528
- current block number: 8983528

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8983528 (main branch discovery), not current.

```diff
    contract zkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2) {
    +++ description: None
      sinceBlock:
+        6433793
    }
```

```diff
    contract L1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c) {
    +++ description: None
      sinceBlock:
+        6441298
    }
```

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      sinceBlock:
+        6441298
    }
```

```diff
    contract ScrollL2Gateway (0xd8428A59B60Df2d81514D429D57DF23293f1bCe7) {
    +++ description: None
      sinceBlock:
+        6433884
    }
```

```diff
    contract ScrollOwner (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77) {
    +++ description: None
      sinceBlock:
+        6435761
    }
```

Generated with discovered.json: 0xa75f692e134ec83e02bf52d34443e0f7fe6b5b8d

# Diff at Wed, 12 Feb 2025 08:42:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 8983528
- current block number: 8983528

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8983528 (main branch discovery), not current.

```diff
    contract ScrollOwner (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77) {
    +++ description: None
      name:
-        "AdminMultisig"
+        "ScrollOwner"
    }
```

Generated with discovered.json: 0x6de6a625642aebed492fb5de84c61fb2b1aec169

# Diff at Mon, 20 Jan 2025 11:10:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 8983528
- current block number: 8983528

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8983528 (main branch discovery), not current.

```diff
    contract zkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      issuedPermissions.0.to:
+        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
    }
```

```diff
    contract L1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC4673dAbfAf04D2A430e244B63F040D27199102f"
      issuedPermissions.0.to:
+        "0xC4673dAbfAf04D2A430e244B63F040D27199102f"
    }
```

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"
      receivedPermissions.0.from:
+        "0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c"
    }
```

```diff
    contract ScrollL2Gateway (0xd8428A59B60Df2d81514D429D57DF23293f1bCe7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
      issuedPermissions.0.to:
+        "0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77"
    }
```

```diff
    contract AdminMultisig (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"
      receivedPermissions.1.from:
+        "0xd8428A59B60Df2d81514D429D57DF23293f1bCe7"
      receivedPermissions.0.target:
-        "0x119B9459D9119D07c23aD06778AeaBec804Fd1a2"
      receivedPermissions.0.from:
+        "0x119B9459D9119D07c23aD06778AeaBec804Fd1a2"
    }
```

Generated with discovered.json: 0x4b28c74510fca3011602477d790253a41e2e1eee

# Diff at Mon, 21 Oct 2024 11:15:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 8983528
- current block number: 8983528

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8983528 (main branch discovery), not current.

```diff
    contract zkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"]
      values.$pastUpgrades.0.1:
-        ["0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"]
+        "0x9d2ffc640100c25deacf7308dafb540b000bfc8a3d6fa8dab19ec9150ce38434"
    }
```

```diff
    contract L1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x067c7126a83560Ed2Fc345d25799F696B7Ea47Ca"]
      values.$pastUpgrades.0.1:
-        ["0x067c7126a83560Ed2Fc345d25799F696B7Ea47Ca"]
+        "0xd2775129688587d97fff37813acd0581f68fdfe7f1a52b36a779e4ef9021c3fe"
    }
```

```diff
    contract ScrollL2Gateway (0xd8428A59B60Df2d81514D429D57DF23293f1bCe7) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xe469c1330cEEcC375fE17E7D649eA270186D344F"]
      values.$pastUpgrades.0.1:
-        ["0xe469c1330cEEcC375fE17E7D649eA270186D344F"]
+        "0xa45f6d61d7c5c041f10950e9448a39a9fbf490d2fcb3155ff9add77b43cfc0c6"
    }
```

Generated with discovered.json: 0x76d5dfc642bb70b37911e7a89e73b36f5d6b639e

# Diff at Mon, 14 Oct 2024 11:01:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 8983528
- current block number: 8983528

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8983528 (main branch discovery), not current.

```diff
    contract zkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0xcbd3207b9109e4f409b0253248655dee17cc83299a5e19d4d7c8bdc792b30008"]
    }
```

```diff
    contract L1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c) {
    +++ description: None
      sourceHashes:
+        ["0x8c407edc4ac1fa1cea2c45903e2cf0158906a2ff39fc2eb92aca3ca9f0d43ed8","0xd57c5157a667afc64df8bc542f1eb01744f7d6b961e031361d442aac61b7d5a0"]
    }
```

```diff
    contract ScrollProxyAdmin (0xC4673dAbfAf04D2A430e244B63F040D27199102f) {
    +++ description: None
      sourceHashes:
+        ["0x8fd8f837bb320bd2a7463c103bea2ff207b0969b5795f320a6c868858aa92074"]
    }
```

```diff
    contract ScrollL2Gateway (0xd8428A59B60Df2d81514D429D57DF23293f1bCe7) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x3712da36508b3467318e72889e31c55c8421214be5ff058dba1d8a7cd33b4f9b"]
    }
```

```diff
    contract AdminMultisig (0xeCa8EB8B909A29C2F912d5b0cBB153a43c860c77) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

Generated with discovered.json: 0x0207862695d7aed5e6c12dd54a711aa774318bb9

# Diff at Tue, 01 Oct 2024 11:14:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 8983528
- current block number: 8983528

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8983528 (main branch discovery), not current.

```diff
    contract zkLink (0x119B9459D9119D07c23aD06778AeaBec804Fd1a2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-10T07:26:01.000Z",["0xCdcDF691aF3e3717A35A2352aB7e34fd2980613D"]]]
    }
```

```diff
    contract L1ERC20Bridge (0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-10T13:41:17.000Z",["0x067c7126a83560Ed2Fc345d25799F696B7Ea47Ca"]]]
    }
```

```diff
    contract ScrollL2Gateway (0xd8428A59B60Df2d81514D429D57DF23293f1bCe7) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-10T07:30:34.000Z",["0xe469c1330cEEcC375fE17E7D649eA270186D344F"]]]
    }
```

Generated with discovered.json: 0xfe97838bf763d4af9b4e8e21414cad76a5607ef2

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

The governance (owner, admin roles) of the scroll contracts are transferred from an EOA to a new Multisig.

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
