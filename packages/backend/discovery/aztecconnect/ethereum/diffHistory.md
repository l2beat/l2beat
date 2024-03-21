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
