# Diff at Mon, 15 Jan 2024 13:59:44 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: master@51b4576752b780b70ed977cf2d54041a7eb81039 block: 18220342
- current block number: 19012730

## Description

New token has been added.

## Watched changes

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
      values.totalPairTokens:
-        64
+        65
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
      values.totalUserTokens:
-        41
+        42
    }
```

```diff
    contract ZkSwapListing (0x8aA2C56dca9d59F4317c2fad632c192b18127709) {
      values.listingCount:
-        64
+        65
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
      values.allPairsLength:
-        64
+        65
    }
```

# Diff at Tue, 26 Sep 2023 13:47:45 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
      values.revertedBlocks:
+        [{"totalBlocksCommitted":13463,"totalBlocksVerified":13461}]
    }
```
