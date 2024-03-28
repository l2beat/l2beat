Generated with discovered.json: 0xe8150e042bf9dae4cfc4db303c574ed4f8089f15

# Diff at Thu, 28 Mar 2024 11:28:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 18621109
- current block number: 19532310

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18621109 (main branch discovery), not current.

```diff
    contract Multisig 1 (0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract Multisig 2 (0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

```diff
    contract Multisig 3 (0x225d3822De44E58eE935440E0c0B829C4232086e) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x458592c7ff46f3e95422b638c0a5a7e9033c8c53

# Diff at Tue, 21 Nov 2023 15:45:04 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@c91f8874e3c01dd4c477491e11cff7b3c664ef34

## Description

Change in the zkSync Era Multisig owners - one address is removed, which makes it a 4/7 Multisig.

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
      values.getOwners[7]:
-        "0xa265146cA40F52cfC439888D0b4291b5440e6769"
    }
```

# Diff at Fri, 13 Oct 2023 12:28:20 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@94e530cf4d7e9cfd400a51f99572fc352ba85712

## Description

Updated verification keys. There are also some other changes in Config.sol, but they are an artefact of Etherscan verification and they are not used in practice.

## Watched changes

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
      values.versionId:
-        10
+        11
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
      upgradeability.implementation:
-        "0xf7Bd436a05678B647D74a88ffcf4445Efc43BDfC"
+        "0x6e95812C432F293b8045811F4B1758285EBDB206"
    }
```

## Source code changes

```diff
.../Verifier/implementation/Config.sol                   | 16 +++++++++++++---
 .../Verifier/implementation/KeysWithPlonkVerifier.sol    |  2 +-
 .../Verifier/implementation/Verifier.sol                 |  2 +-
 .../Verifier/implementation/meta.txt                     |  2 +-
 4 files changed, 16 insertions(+), 6 deletions(-)
```

# Diff at Mon, 02 Oct 2023 13:57:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
      values.getOwners.2:
-        "0xd7aF418d98C0F8EDbaa407fc30ad10382286F36F"
+        "0x733F602bB867c643542cc807a3D32AD1A86cacc1"
    }
```

# Diff at Tue, 26 Sep 2023 13:05:32 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF) {
      values.revertedBlocks:
+        [{"totalBlocksCommitted":141,"totalBlocksVerified":141},{"totalBlocksCommitted":859,"totalBlocksVerified":859},{"totalBlocksCommitted":1341,"totalBlocksVerified":1341},{"totalBlocksCommitted":2387,"totalBlocksVerified":2387},{"totalBlocksCommitted":13054,"totalBlocksVerified":13042},{"totalBlocksCommitted":13047,"totalBlocksVerified":13042},{"totalBlocksCommitted":19646,"totalBlocksVerified":19646},{"totalBlocksCommitted":34518,"totalBlocksVerified":34504}]
    }
```
