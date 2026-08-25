Generated with discovered.json: 0x2f8dc9e87d144f9ea133f2582d75b5e8b8e1660c

# Diff at Sat, 22 Aug 2026 12:49:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1787312501

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract OffchainResolver (eth:0x77fEF66b77d6a44AeCcCCf911f9864c7b7ca392C) [N/A]
    +++ description: Immutable ENS CCIP-Read resolver used by Cloaked. Every query redirects to a configurable API gateway and accepts the returned ENS record if it is unexpired and signed by the configurable signer. It does not verify that a returned payment address was derived for the named recipient.
```
