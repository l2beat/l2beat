Generated with discovered.json: 0x41c6e44818140d3abfbd12081543887091fe4c75

# Diff at Wed, 10 Apr 2024 11:32:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b05e9a9401061dc09d3987350e2d33de147386b8 block: 19531440
- current block number: 19624947

## Description

### RollupProcessorV3:

- Make processRollup() public by removing the `rollupProviders[msg.sender]` check from the function
- Remove default asset caps from the initializer (caps are currently set to 0)

This allows external participants to withdraw from the rollup and keeps deposits disabled, in line with their March 30 sunset.

### Verifier28x32:

Change of six constants.

From chatgpt:

- Two of the constants represent the elliptic curve point `Q2`
- The other four describe the elliptic curve point `g2_x`

These points among others are used to compute the verification key.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier28x32 (0x9BDc85491BD589e8390A6AAb6982b82255ae2297)
    +++ description: Verifier contract used by the RollupProcessorV2.
```

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      upgradeability.implementation:
-        "0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"
+        "0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"
      implementations.0:
-        "0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"
+        "0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"
      values.getImplementationVersion:
-        2
+        3
+++ description: Address of the ZK verifier.
+++ type: PERMISSION
+++ severity: LOW
      values.verifier:
-        "0x9BDc85491BD589e8390A6AAb6982b82255ae2297"
+        "0xb7baA1420f88b7758E341c93463426A2b7651CFB"
      derivedName:
-        "RollupProcessorV2"
+        "RollupProcessorV3"
    }
```

```diff
+   Status: CREATED
    contract Verifier28x32 (0xb7baA1420f88b7758E341c93463426A2b7651CFB)
    +++ description: Verifier contract used by the RollupProcessorV2.
```

## Source code changes

```diff
.../contracts/access/AccessControl.sol             |  2 +-
 .../contracts/utils/Strings.sol                    |  2 +-
 .../contracts/utils/math/Math.sol                  |  4 +-
 .../RollupProcessorV2/implementation/meta.txt      |  4 +-
 .../src/core/processors/RollupProcessorV3.sol}     | 98 ++++++++--------------
 .../Verifier28x32/meta.txt                         |  2 +-
 .../core/verifier/keys/VerificationKey28x32.sol    | 18 ++--
 7 files changed, 49 insertions(+), 81 deletions(-)
```

Generated with discovered.json: 0x9e7064e6e198b24fb116f87b988a7ce0fed986a3

# Diff at Thu, 28 Mar 2024 08:32:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19326151
- current block number: 19531440

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19326151 (main branch discovery), not current.

```diff
    contract Emergency Multisig (0x23f8008159C0427458b948c3DD7795c6DBE8236F) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 15 (13%)"
    }
```

```diff
    contract Resume Multisig (0x62415C92528C7d86Fd3f82D3fc75c2F66Bb9389a) {
    +++ description: None
      upgradeability.threshold:
+        "10 of 15 (67%)"
    }
```

```diff
    contract Lister Multisig (0x68A36Aa8E309d5010ab4F9D6c5F1246b854D0b9e) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 2 (50%)"
    }
```

Generated with discovered.json: 0x73d400dd88af30c348a74387ae0bf451c5f428db

# Diff at Wed, 28 Feb 2024 12:54:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@65091524debd9f36ca34aa554968373d1b3115a7 block: 18340180
- current block number: 19326151

## Description

On Feb 16, 2024 the verifier has been updated. The difference between the
source code contains only changes to hardcoded values. This update is way
simpler than AztecV1. The update was done in a single step and the Sequencer of
Aztec Connect still posts and processes data without reverts.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier28x32 (0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69) {
    }
```

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
      values.verifier:
-        "0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69"
+        "0x9BDc85491BD589e8390A6AAb6982b82255ae2297"
    }
```

```diff
+   Status: CREATED
    contract Verifier28x32 (0x9BDc85491BD589e8390A6AAb6982b82255ae2297) {
    }
```

## Source code changes

```diff
.../Verifier28x32/meta.txt                         |  2 +-
 .../core/verifier/keys/VerificationKey28x32.sol    | 36 +++++++++++-----------
 2 files changed, 19 insertions(+), 19 deletions(-)
```

Generated with discovered.json: 0xd1fc1482dbb037a789f8c83db253e8e30567dad2

# Diff at Fri, 13 Oct 2023 08:09:03 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ac0c322776a31842f5549b3d357b8b4bc3bfd07f

## Description

Verification keys update.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier28x32 (0xB656f4219f565b93DF57D531B574E17FE0F25939) {
    }
```

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
      values.verifier:
-        "0xB656f4219f565b93DF57D531B574E17FE0F25939"
+        "0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69"
    }
```

```diff
+   Status: CREATED
    contract Verifier28x32 (0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69) {
    }
```

## Source code changes

```diff
.../{.code@18163333 => .code}/Verifier28x32/meta.txt   |  2 +-
 .../Verifier28x32/verifier/BaseStandardVerifier.sol    |  4 ++--
 .../Verifier28x32/verifier/instances/Verifier28x32.sol |  2 +-
 .../verifier/keys/VerificationKey28x32.sol             | 18 +++++++++---------
 4 files changed, 13 insertions(+), 13 deletions(-)
```
