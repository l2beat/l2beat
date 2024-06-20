Generated with discovered.json: 0xee30511d8efa842854c2b98a47a8ac4ac96de34a

# Diff at Tue, 04 Jun 2024 09:54:59 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@35cc9bbe2a9c9163e503882bcb76877c4909bbc9 block: 19118480
- current block number: 20017695

## Description

Added the AxelarGasService, which allows users to pay for native gas at the destination with tokens or ETH and manages refunds.

## Watched changes

```diff
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712) {
    +++ description: None
      upgradeability.implementation:
-        "0x4Fe2d119873790cc9e15F6cC53cae1C2eb2039dC"
+        "0xcb5C784DCf8FF342625DbC53B356ed0Cbb0EBB9b"
      implementations.0:
-        "0x4Fe2d119873790cc9e15F6cC53cae1C2eb2039dC"
+        "0xcb5C784DCf8FF342625DbC53B356ed0Cbb0EBB9b"
      values.implementation:
-        "0x4Fe2d119873790cc9e15F6cC53cae1C2eb2039dC"
+        "0xcb5C784DCf8FF342625DbC53B356ed0Cbb0EBB9b"
    }
```

## Source code changes

```diff
.../AxelarGasService/AxelarGasService.sol          | 437 ++++++++++++++++++++-
 1 file changed, 426 insertions(+), 11 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19118480 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AxelarGasServiceOperators (0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC)
    +++ description: None
```

Generated with discovered.json: 0x39326bef78b592a1264c16dbe875593764d55da2

# Diff at Fri, 26 Jan 2024 10:41:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 19090246

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Gateway (0x4F4495243837681061C4743b74B3eEdf548D56A5) {
    }
```

```diff
+   Status: CREATED
    contract TokenDeployer (0xb28478319B64f8D47e19A120209A211D902F8b8f) {
    }
```

```diff
+   Status: CREATED
    contract Multisig (0xCC940AE49C78F20E3F13F3cF37e996b98Ac3EC68) {
    }
```

```diff
+   Status: CREATED
    contract AxelarAuthWeighted (0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0) {
    }
```

```diff
+   Status: CREATED
    contract InterchainGovernance (0xfDF36A30070ea0241d69052ea85ff44Ad0476a66) {
    }
```
