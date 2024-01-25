# Diff at Thu, 18 Jan 2024 13:44:34 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@db39a1e5c1e1c4621fac4c0779111f1281b974ff block: 18612421
- current block number: 19034126

## Description

Verifier has been changed to AlwaysReverting contract.
Old verifier persisted for historical reference.

## Watched changes

```diff
    contract RollupProcessor (0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba) {
      values.verifier:
-        "0xd3a6D9De4cbC2CC7529361941e85b1c3269CcBb1"
+        "0xc0CFF28c45dA7d36B8cD1e3dCd6451e812CA30d1"
    }
```

```diff
+   Status: CREATED
    contract AlwaysReverting (0xc0CFF28c45dA7d36B8cD1e3dCd6451e812CA30d1) {
    }
```

## Source code changes

```diff
.../aztec/ethereum/.code/AlwaysReverting/AlwaysReverting.sol   | 10 ++++++++++
 .../aztec/ethereum/.code/AlwaysReverting/meta.txt              |  2 ++
 2 files changed, 12 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18612421 (main branch discovery), not current.

```diff
    contract TurboVerifier (0xd3a6D9De4cbC2CC7529361941e85b1c3269CcBb1) {
      derivedName:
+        "TurboVerifier"
    }
```

# Diff at Mon, 20 Nov 2023 10:32:26 GMT

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
+   Status: CREATED
    contract AztecFeeDistributor (0x41A57F5581aDf11b25F3eDb7C1DB19f18bb76734) {
    }
```

```diff
+   Status: CREATED
    contract RollupProcessor (0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba) {
    }
```

```diff
+   Status: CREATED
    contract TurboVerifier (0xd3a6D9De4cbC2CC7529361941e85b1c3269CcBb1) {
    }
```

```diff
+   Status: CREATED
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    }
```
