Generated with discovered.json: 0xfc0452d58abac01438b8c50c014c8b8ffcb6daec

# Diff at Tue, 01 Oct 2024 11:11:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20832964
- current block number: 20832964

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20832964 (main branch discovery), not current.

```diff
    contract XLayerValidiumDAC (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-30T08:28:47.000Z",["0xd620Ca1ad5c3888e4521c3374cE4088Cb78079b8"]]]
    }
```

```diff
    contract XLayerValidium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-30T08:02:35.000Z",["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]]]
    }
```

Generated with discovered.json: 0xeca515205bc21e41e7fb9686e79741467dbd28a4

# Diff at Thu, 26 Sep 2024 06:22:35 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@374d77799a44e3b2fcc4828675ccc0b0ff6146d0 block: 20325087
- current block number: 20832964

## Description

Ignore gas token.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325087 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

Generated with discovered.json: 0x529839bbd0d774852f45035d2084596df11b078e

# Diff at Fri, 30 Aug 2024 08:01:34 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20325087
- current block number: 20325087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325087 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x2c06eeec5c27656ca558d100c206b541febcb129

# Diff at Fri, 23 Aug 2024 09:56:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20325087
- current block number: 20325087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325087 (main branch discovery), not current.

```diff
    contract XLayerValidiumDAC (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract XLayerValidium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x1b167fa7de69394f47c613b41710d3732c805fe1

# Diff at Wed, 21 Aug 2024 10:06:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20325087
- current block number: 20325087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325087 (main branch discovery), not current.

```diff
    contract XLayerValidiumDAC (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1e37EA18e9515db29b3E94A00eD31484A3130204","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x05652Ec92366F3C2255991a265c499E01Ba58e6a"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x05652Ec92366F3C2255991a265c499E01Ba58e6a","via":[]}]
    }
```

```diff
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4A164CA582D169f7caad471250991Dd861ddA981","via":[]}]
    }
```

Generated with discovered.json: 0x463ce9801dabc8dd2fb9a292a93b5c2733627b7d

# Diff at Fri, 09 Aug 2024 10:13:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20325087
- current block number: 20325087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325087 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x05652Ec92366F3C2255991a265c499E01Ba58e6a"]
      assignedPermissions.upgrade:
+        ["0x05652Ec92366F3C2255991a265c499E01Ba58e6a"]
    }
```

Generated with discovered.json: 0x1b09cde9ac50176d9fc89600655a3b677eb15944

# Diff at Wed, 17 Jul 2024 08:35:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0df6fda263b58edb9acce032017abb5ebd61f5fd block: 19882097
- current block number: 20325087

## Description

Introduced a new LocalAdmin, not handled by the shared template, which mainContract admin (not the upgradeabilityAdmin) and who can change local system configs. This role was wrongly given to the SharedProxyAdminOwner before.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19882097 (main branch discovery), not current.

```diff
    contract XLayerValidiumEtrog (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      name:
-        "XLayerValidiumEtrog"
+        "XLayerValidium"
    }
```

Generated with discovered.json: 0xedecf8c6eda26e5959db341cbc0c301a4ee07513

# Diff at Thu, 16 May 2024 10:59:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@59d36171ee3aaf27d6db0c75fdfba523d2dad686 block: 19731428
- current block number: 19882097

## Description

Changes related to merging with shared-polygon-cdk module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19731428 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonZkEVMTimelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```

Generated with discovered.json: 0x1578b061f84010d1b39b280f0615f999aad6c3c0

# Diff at Thu, 25 Apr 2024 09:16:57 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@10dca19aa3157c731f7438b0d699d97aafdf4cd7 block: 19718023
- current block number: 19731428

## Description

The contract (`PolygonValidiumStorageMigration.sol`, here `XLayerValidiumEtrog`) was already diff'd to Astar by Luca (0 diff).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19718023 (main branch discovery), not current.

```diff
    contract XLayerValidiumEtrog (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      unverified:
-        true
    }
```

Generated with discovered.json: 0xf7a1cc6de98a35d884df3f95f5d35f645ab1b400

# Diff at Tue, 23 Apr 2024 12:14:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 19718023

## Description

New Validium. There is no diff with Astar zkEVM.

## Initial discovery

```diff
+   Status: CREATED
    contract XLayerValidiumDAC (0x05652Ec92366F3C2255991a265c499E01Ba58e6a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XLayerVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XLayerValidiumEtrog (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonZkEVMTimelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```
