Generated with discovered.json: 0x44da7634f14bea273c61664860f655dcc9c3d71b

# Diff at Tue, 04 Mar 2025 10:38:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21387141
- current block number: 21387141

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387141 (main branch discovery), not current.

```diff
    contract AztecFeeDistributor (0x41A57F5581aDf11b25F3eDb7C1DB19f18bb76734) {
    +++ description: Contract responsible for collecting transaction fees and reimbursing gas to whitelisted Rollup Providers.
      sinceBlock:
+        12330310
    }
```

```diff
    contract TurboVerifier (0x48Cb7BA00D087541dC8E2B3738f80fDd1FEe8Ce8) {
    +++ description: Turbo Plonk ZK verifier.
      sinceBlock:
+        19232962
    }
```

```diff
    contract RollupProcessor (0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba) {
    +++ description: None
      sinceBlock:
+        11967192
    }
```

```diff
    contract AztecMultisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    +++ description: None
      sinceBlock:
+        11647532
    }
```

Generated with discovered.json: 0xa596b8b1f9778665ead749d49385250d8bb12730

# Diff at Mon, 20 Jan 2025 09:24:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21387141
- current block number: 21387141

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387141 (main branch discovery), not current.

```diff
    contract RollupProcessor (0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba) {
    +++ description: None
      fieldMeta.rollupProviders.type:
+        "PERMISSION"
      fieldMeta.verifier.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0x2f4ce62254dbbb7ee54f687f9e15eecb6bf7e23d

# Diff at Tue, 10 Dec 2024 09:52:07 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@08d3ccfe28a784d003a319e971007097ac1aec27 block: 20361394
- current block number: 21371328

## Description

Partial discodrive.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20361394 (main branch discovery), not current.

```diff
    contract AztecFeeDistributor (0x41A57F5581aDf11b25F3eDb7C1DB19f18bb76734) {
    +++ description: Contract responsible for collecting transaction fees and reimbursing gas to whitelisted Rollup Providers.
      template:
+        "aztecv1/AztecFeeDistributor"
      description:
+        "Contract responsible for collecting transaction fees and reimbursing gas to whitelisted Rollup Providers."
    }
```

```diff
    contract TurboVerifier (0x48Cb7BA00D087541dC8E2B3738f80fDd1FEe8Ce8) {
    +++ description: Turbo Plonk ZK verifier.
      template:
+        "aztecv1/TurboVerifier"
      description:
+        "Turbo Plonk ZK verifier."
    }
```

```diff
    contract RollupProcessor (0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba) {
    +++ description: None
      template:
+        "aztecv1/RollupProcessor"
    }
```

```diff
-   Status: DELETED
    contract HistoricalTurboVerifier (0xd3a6D9De4cbC2CC7529361941e85b1c3269CcBb1)
    +++ description: None
```

```diff
    contract AztecMultisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    +++ description: None
      name:
-        "Aztec Multisig"
+        "AztecMultisig"
    }
```

Generated with discovered.json: 0xa09907ba10fd4a69aa6f0c4a8b9a18a9d3e86ce3

# Diff at Mon, 14 Oct 2024 10:49:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20361394
- current block number: 20361394

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20361394 (main branch discovery), not current.

```diff
    contract AztecFeeDistributor (0x41A57F5581aDf11b25F3eDb7C1DB19f18bb76734) {
    +++ description: None
      sourceHashes:
+        ["0x13139c06d2946718f6b4470f6346e54f4e2b26075fe5daa3b3a631092f7dd76e"]
    }
```

```diff
    contract TurboVerifier (0x48Cb7BA00D087541dC8E2B3738f80fDd1FEe8Ce8) {
    +++ description: None
      sourceHashes:
+        ["0x72846aa5544e4499c54463014cbacb03ad291385be297b56c638ccfb15717b8b"]
    }
```

```diff
    contract RollupProcessor (0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba) {
    +++ description: None
      sourceHashes:
+        ["0xc055a6555317d1508d60d0c1bf5b2332973126ca1ba545b095e733d95e490844"]
    }
```

```diff
    contract HistoricalTurboVerifier (0xd3a6D9De4cbC2CC7529361941e85b1c3269CcBb1) {
    +++ description: None
      sourceHashes:
+        ["0x3026ade4746f8009a4bb4fbd6de2afc3c1af13c8d71ff5a54d3cf3c006de26d8"]
    }
```

```diff
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x15aabbbd4c3efb19deb557855dd1cac208f3e577

# Diff at Fri, 09 Aug 2024 10:08:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20361394
- current block number: 20361394

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20361394 (main branch discovery), not current.

```diff
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 2 (50%)"
      values.getOwners:
-        ["0x1D93fE338A035f297819EA867275661a4f5B4fdD","0x7fb9f93Cc6614dDd76c893EC8b5310674aC3Fc5f"]
      values.getThreshold:
-        1
      values.$members:
+        ["0x1D93fE338A035f297819EA867275661a4f5B4fdD","0x7fb9f93Cc6614dDd76c893EC8b5310674aC3Fc5f"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 2 (50%)"
    }
```

Generated with discovered.json: 0xa284c75555316d712b5034cee198158e871e0ef6

# Diff at Tue, 30 Jul 2024 11:10:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20361394
- current block number: 20361394

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20361394 (main branch discovery), not current.

```diff
    contract AztecFeeDistributor (0x41A57F5581aDf11b25F3eDb7C1DB19f18bb76734) {
    +++ description: None
      fieldMeta:
+        {"reimburseConstant":{"severity":"LOW","description":"Tip that gets added to a gas reimbursement for processing the rollup."}}
    }
```

```diff
    contract RollupProcessor (0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba) {
    +++ description: None
      fieldMeta:
+        {"rollupProviders":{"severity":"LOW","description":"Can call the ProcessRollup function"},"verifier":{"severity":"LOW","description":"Address of the ZK verifier."}}
    }
```

Generated with discovered.json: 0x543d288e15332f4aea3249d780750ca7d63d4735

# Diff at Mon, 06 May 2024 14:22:13 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@20cad040a80da0f4072f1c6f9778026143a458db block: 19531429
- current block number: 19811607

## Description

Ownership of the rollup contract is renounced.

## Watched changes

```diff
    contract RollupProcessor (0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba) {
    +++ description: None
      values.owner:
-        "0xE298a76986336686CC3566469e3520d23D1a8aaD"
+        "0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x6d7fb9afb3a03a83c9f41e0d5e4b3789b8843695

# Diff at Thu, 28 Mar 2024 08:30:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19511017
- current block number: 19531429

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19511017 (main branch discovery), not current.

```diff
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 2 (50%)"
    }
```

Generated with discovered.json: 0xfe5a836e62b3c749f591b5f32c82f9a28f1674d6

# Diff at Mon, 25 Mar 2024 10:52:06 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@9bc44b13c53d42ef5e81d478df7a78975e8d4088 block: 19439442
- current block number: 19511017

## Description

Rollup processors receive gas reimbursements from the AztecFeeDistributor for having called the processRollup() function. The reimburseConstant, which is a constant added to each dynamically calculated gas reimbursement is now set to 0.
Context: Zk.money V1 (this project) is sunset for a long time now. Users can only exit by runing a local docker container that runs the rollup. They have to pay the processRollup() transaction fee but get refunded by the AztecFeeDistributor.

## Watched changes

```diff
    contract AztecFeeDistributor (0x41A57F5581aDf11b25F3eDb7C1DB19f18bb76734) {
    +++ description: None
+++ description: Tip that gets added to a gas reimbursement for processing the rollup.
+++ severity: LOW
      values.reimburseConstant:
-        678600
+        0
    }
```

Generated with discovered.json: 0x1392fd8121eb5a92ca60b50756022ed85425bc96

# Diff at Fri, 15 Mar 2024 09:26:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6a294996c13c1a3ad00c7c4d72e651e8fbd4fa1c block: 19325744
- current block number: 19439442

## Description

One rollupProvider is added.

## Watched changes

```diff
    contract RollupProcessor (0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba) {
    +++ description: None
+++ description: Can call the ProcessRollup function
+++ type: PERMISSION
+++ severity: LOW
      values.rollupProviders.0:
+        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    }
```

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

Update discovery to include the multisig threshold.

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
