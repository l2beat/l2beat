Generated with discovered.json: 0x9488573bfe9b2c4fb7cce4020a4e875f65d8c509

# Diff at Tue, 23 Apr 2024 15:56:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@f6f4ef80f0b2193da88313a911968b74fcfed02f block: 19532187
- current block number: 19719123

## Description

A `version` variable of MessageProxyForMainnet has been bumped up
from 1.5.0 to 2.1.0 with no changes to implementation.

This `version` variable can be arbitrarily changed by the owner
(emitting `VersionUpdated` event), but it doesn't seem to
have any impact on contracts in the project.

## Watched changes

```diff
    contract MessageProxyForMainnet (0x8629703a9903515818C2FeB45a6f6fA5df8Da404) {
    +++ description: None
      values.version:
-        "1.5.0"
+        "2.1.0"
    }
```

Generated with discovered.json: 0x3c215b105b69e1d5c6f495d65e708a2faf8bbc3d

# Diff at Thu, 28 Mar 2024 11:03:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 18768542
- current block number: 19532187

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18768542 (main branch discovery), not current.

```diff
    contract ProxyAdminOwner (0x13fD1622F0E7e50A87B79cb296cbAf18362631C0) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xf4edd5511278705580d44b0d0e629dd58c0c352a

# Diff at Tue, 12 Dec 2023 07:14:10 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@fdc867519c9c4b27d1a45a5037b5ab0509a4a2f8

## Description

One owner of ProxyAdminOwner is changed.

## Watched changes

```diff
    contract ProxyAdminOwner (0x13fD1622F0E7e50A87B79cb296cbAf18362631C0) {
      values.getOwners.2:
-        "0x1c3c10544EDd69c9a09EDEcf05A4646293DCAedB"
+        "0x60f66a4056852d0Bd6D5BF6FF5D2eBeb474cd587"
    }
```
