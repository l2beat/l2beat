Generated with discovered.json: 0xbb8d38a3a10de3152c316f47e840f0105cbba5ed

# Diff at Fri, 09 Aug 2024 10:12:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19719123
- current block number: 19719123

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19719123 (main branch discovery), not current.

```diff
    contract ProxyAdminOwner (0x13fD1622F0E7e50A87B79cb296cbAf18362631C0) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x86EBB3994A558C27d19E2BADF5f98b99C478F98F","0x3E8eba8D8E1BA34cB5780d541748438aA21b1245","0x60f66a4056852d0Bd6D5BF6FF5D2eBeb474cd587","0x315537a8004A7E598f807e8e0ce2F92e6a497E18","0xE74ad5437C6CFB0cCD6bADda1F6b57b6E542E75e"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x86EBB3994A558C27d19E2BADF5f98b99C478F98F","0x3E8eba8D8E1BA34cB5780d541748438aA21b1245","0x60f66a4056852d0Bd6D5BF6FF5D2eBeb474cd587","0x315537a8004A7E598f807e8e0ce2F92e6a497E18","0xE74ad5437C6CFB0cCD6bADda1F6b57b6E542E75e"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ProxyAdmin (0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a","0x49F583d263e4Ef938b9E09772D3394c71605Df94","0x588801cA36558310D91234aFC2511502282b1621","0x6ef406953bac772C2146389ED37846BA3b6086D1","0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d","0x8629703a9903515818C2FeB45a6f6fA5df8Da404","0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669","0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986"]
      assignedPermissions.upgrade:
+        ["0x49F583d263e4Ef938b9E09772D3394c71605Df94","0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d","0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669","0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a","0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986","0x6ef406953bac772C2146389ED37846BA3b6086D1","0x8629703a9903515818C2FeB45a6f6fA5df8Da404","0x588801cA36558310D91234aFC2511502282b1621"]
    }
```

Generated with discovered.json: 0xeb67a9f636e0cfcd17e2582a09a5163393c1da99

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
