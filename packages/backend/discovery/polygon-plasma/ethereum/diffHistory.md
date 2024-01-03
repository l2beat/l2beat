# Diff at Tue, 12 Dec 2023 11:26:42 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: master@2ec8dba108b989e6a3eeb24eb8893e578f713ddf

## Description

New validator has staked and is added to the validator set (now 105).

## Watched changes

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
      values.currentValidatorSetSize:
-        104
+        105
    }
```

# Diff at Tue, 12 Dec 2023 07:22:28 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: master@fdc867519c9c4b27d1a45a5037b5ab0509a4a2f8

## Description

One validator has unstaked from StakeManager and is removed from the validator set (now 104).

## Watched changes

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
      values.currentValidatorSetSize:
-        105
+        104
    }
```

# Diff at Tue, 17 Oct 2023 07:23:03 GMT:

- author: Amin Latifi (<a.latifi.al@gmail.com>)
- comparing to: master@728cab1f84974b0904f30f151656c2139f01af97

## Description

A new validator is added to the StakeManager validators set.

## Watched changes

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
      values.currentValidatorSetSize:
-        104
+        105
      values.validatorThreshold:
-        104
+        105
    }
```

# Diff at Mon, 02 Oct 2023 13:53:03 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
      values.currentValidatorSetSize:
-        103
+        104
      values.validatorThreshold:
-        103
+        104
    }
```
