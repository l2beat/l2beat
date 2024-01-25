Generated with discovered.json: 0xc98f0f6737b75737ee15b9427cbc769043d95fa8

# Diff at Mon, 22 Jan 2024 11:48:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: master@7755f153438c1f16773ba6733cfa3a8c8bc0a394 block: 18769796
- current block number: 19062081

## Description

Last checkpoint that had the old hash: 0x9b2c468c4ec0c6758e6918697490eb41ce9c90eaed3d243c93b27359d36672ae
Transaction that changed the stateRoot: 0x57e1fc189829809677179955a38eab74311309c872c995834e93fd153efa31ba

Changed the Merkle Root that allows for withdrawing the Heimdall fee.
This root is not used in any other place, it's just for claiming the Heimdall fee.
Nobody in the history of this contract nobody ever claimed any Heimdall fee.
See `function claimFee(uint256 accumFeeAmount, uint256 index, bytes memory proof)` for how the claiming works.

## Watched changes

```diff
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908) {
      values.accountStateRoot:
-        "0x85d7a8f1697e2a84910d571af5875abfdb954c6050766f6866a6bb9fc7c660ca"
+        "0x008cac7abbedf34deff1dedf34b09ccab63cc457993151a7f50e54c12174ad25"
    }
```

```diff
    contract StakingInfo (0xa59C847Bd5aC0172Ff4FE912C5d29E5A71A7512B) {
      values.getAccountStateRoot:
-        "0x85d7a8f1697e2a84910d571af5875abfdb954c6050766f6866a6bb9fc7c660ca"
+        "0x008cac7abbedf34deff1dedf34b09ccab63cc457993151a7f50e54c12174ad25"
    }
```

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
