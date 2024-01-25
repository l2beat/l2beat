Generated with discovered.json: 0x8241e5999c5993c8094f03fe673e1a35f2b5b13f

# Diff at Thu, 11 Jan 2024 15:48:40 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: master@d79128df189c297a74fb89b3a58b7e0d6edd88f4 block: 18968776
- current block number: 18984674

## Description

The EscrowsAdmin multisig threshold is updated - now 5/10. Nonce is ignored.

## Watched changes

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
      values.getThreshold:
-        1
+        5
    }
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18968776 (main branch discovery), not current.

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
      values.nonce:
-        0
    }
```

# Diff at Fri, 10 Nov 2023 10:41:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: master@8c81bbc286f1a0d260de84887d123cd5eda48a86

## Description

PolygonZkEVM has changed it's implementation because PolygonZkEVMUpgraded - the
contract at the implementation address - needed to be redeployed. This is
because PolygonZkEVMUpgraded has FflonkVerifier hardcoded and because it was
also redeployed to change two circuit parameters (C_0x and C0y) to update to the
new address the whole contract needed to be redeployed. We can't peer into the
actual change that took place because it's around the zk circuit.

## Watched changes

```diff
-   Status: DELETED
    contract FflonkVerifier (0x21f65deadb3b85082BA99766f323bEA90eb5a3D6) {
    }
```

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      upgradeability.implementation:
-        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
+        "0xb1585916487AcEdD99952086f2950763D253b923"
      implementations.0:
-        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
+        "0xb1585916487AcEdD99952086f2950763D253b923"
      values.forkID:
-        5
+        6
      values.lastVerifiedBatchBeforeUpgrade:
-        813266
+        1228916
      values.rollupVerifier:
-        "0x21f65deadb3b85082BA99766f323bEA90eb5a3D6"
+        "0x5F411584E02964a028E3123C833c352Cd2F5cBD5"
      values.version:
-        1
+        2
      values.VERSION_BEFORE_UPGRADE:
-        0
+        1
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x5F411584E02964a028E3123C833c352Cd2F5cBD5) {
    }
```

## Source code changes

```diff
.../{.code@18263277 => .code}/FflonkVerifier/FflonkVerifier.sol       | 4 ++--
 .../ethereum/{.code@18263277 => .code}/FflonkVerifier/meta.txt        | 2 +-
 .../{.code@18263277 => .code}/PolygonZkEvm/implementation/meta.txt    | 2 +-
 3 files changed, 4 insertions(+), 4 deletions(-)
```

# Diff at Mon, 02 Oct 2023 13:55:19 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      values.trustedAggregator:
-        "0xdA87c4a76922598Ac0272F4D9503a35071D686eA"
+        "0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
    }
```

# Diff at Tue, 26 Sep 2023 13:22:27 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract FflonkVerifier (0x21f65deadb3b85082BA99766f323bEA90eb5a3D6) {
      sinceTimestamp:
+        1693469075
    }
```

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      values.nondeterminsiticPendingState:
+        []
    }
```

# Diff at Fri, 22 Sep 2023 11:25:03 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@1312187d41931ca505cc65eca063068109ff1771

## Watched changes

```diff
-   Status: DELETED
    contract FflonkVerifier (0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9) {
    }
```

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      upgradeability.implementation:
-        "0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"
+        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
      values.forkID:
-        4
+        5
      values.rollupVerifier:
-        "0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9"
+        "0x21f65deadb3b85082BA99766f323bEA90eb5a3D6"
      values.lastVerifiedBatchBeforeUpgrade:
+        813266
      values.version:
+        1
      values.VERSION_BEFORE_UPGRADE:
+        0
      derivedName:
-        "PolygonZkEVM"
+        "PolygonZkEVMUpgraded"
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x21f65deadb3b85082BA99766f323bEA90eb5a3D6) {
    }
```
