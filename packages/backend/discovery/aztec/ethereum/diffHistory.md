Generated with discovered.json: 0xb96045455cbe881ca2725b8fa4df0c2bb7103f3b

# Diff at Wed, 28 Feb 2024 11:31:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@c361a9f2ca8a06503827869e85326970d8110acb block: 19034126
- current block number: 19325744

## Description

On Jan 14, 2024 TurboVerifier contract has been replaced with AlwaysReverting
contract effectively halting verification process. On Feb 15, 2024 the verifier
has been updated to an unverified contract. After 3 minutes it was again
updated to a new TurboVerifier. The unverified contract is not similar in any
way to the new TurboVerifier. While the new TurobVerifier has basically the
same source code as the historical one expect some hardcoded values.

- the "3 minute" verifier (0xf3761b450571a49fa8e2af6e37e1eb3516209d56)
- the new verifier (0x48cb7ba00d087541dc8e2b3738f80fdd1fee8ce8)

Everything operation was executed by the same EOA that deployed the entire
Aztec Project (0xFcF75295f242C4E87203Abb5d7C9BbEda90a8895). Starting with the
transaction to update the verifier to an unverified contract there was 5
additional transactions (six in total). All happened in the span of one hour,
all reverting with **proof verification failed**.

## Watched changes

```diff
    contract RollupProcessor (0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba) {
      values.verifier:
-        "0xc0CFF28c45dA7d36B8cD1e3dCd6451e812CA30d1"
+        "0x48Cb7BA00D087541dC8E2B3738f80fDd1FEe8Ce8"
    }
```

```diff
-   Status: DELETED
    contract AlwaysReverting (0xc0CFF28c45dA7d36B8cD1e3dCd6451e812CA30d1) {
    }
```

```diff
+   Status: CREATED
    contract TurboVerifier (0x48Cb7BA00D087541dC8E2B3738f80fDd1FEe8Ce8) {
    }
```

## Source code changes

```diff
.../AlwaysReverting/meta.txt => /dev/null          |    2 -
 .../src/AlwaysReverting.sol => /dev/null           |   10 -
 .../contracts/interfaces/IVerifier.sol             |    7 +
 .../contracts/verifier/TurboVerifier.sol           |  451 ++++++
 .../verifier/cryptography/Bn254Crypto.sol          |  163 ++
 .../verifier/cryptography/PolynomialEval.sol       | 1610 ++++++++++++++++++++
 .../contracts/verifier/cryptography/Transcript.sol |  262 ++++
 .../contracts/verifier/cryptography/Types.sol      |  125 ++
 .../contracts/verifier/keys/EscapeHatchVk.sol      |   62 +
 .../contracts/verifier/keys/Rollup1x1Vk.sol        |   62 +
 .../contracts/verifier/keys/Rollup1x2Vk.sol        |   62 +
 .../contracts/verifier/keys/Rollup1x4Vk.sol        |   62 +
 .../contracts/verifier/keys/Rollup28x1Vk.sol       |   62 +
 .../contracts/verifier/keys/Rollup28x2Vk.sol       |   62 +
 .../contracts/verifier/keys/Rollup28x4Vk.sol       |   62 +
 .../contracts/verifier/keys/VerificationKeys.sol   |   60 +
 .../aztec/ethereum/.code/TurboVerifier/meta.txt    |    2 +
 17 files changed, 3114 insertions(+), 12 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19034126 (main branch discovery), not current.

```diff
    contract TurboVerifier (0xd3a6D9De4cbC2CC7529361941e85b1c3269CcBb1) {
      name:
-        "TurboVerifier"
+        "HistoricalTurboVerifier"
    }
```

Generated with discovered.json: 0xef59be93f708553067b080ebf7e480c036d4a6ed

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
