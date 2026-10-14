Generated with discovered.json: 0x2cb14b311355e6460f55e2d0613a10812e594cd9

# Diff at Fri, 09 Oct 2026 12:34:57 GMT:

- id: ab9ff06a
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@65792d28d8c1d8a02e821a306d292b86ae4acd91 block: 1787312501
- current timestamp: 1791536658

## Description

Moved OffchainResolver from config overrides into a template, with no value changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787312501 (main branch discovery), not current.

```diff
    contract OffchainResolver (eth:0x77fEF66b77d6a44AeCcCCf911f9864c7b7ca392C) [cloaked/OffchainResolver] {
    +++ description: Immutable ENS CCIP-Read resolver used by Cloaked. Every query redirects to a configurable API gateway and accepts the returned ENS record if it is unexpired and signed by the configurable signer. It does not verify that a returned payment address was derived for the named recipient.
      template:
+        "cloaked/OffchainResolver"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x07d8f5879b6f0808ad02b8c2a87efd0521309758

# Diff at Sat, 22 Aug 2026 12:49:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1787312501

## Description

Initial discovery of Cloaked's ENS CCIP-Read OffchainResolver and the EOA that controls its gateway and signer.

## Initial discovery

```diff
+   Status: CREATED
    contract OffchainResolver (eth:0x77fEF66b77d6a44AeCcCCf911f9864c7b7ca392C) [N/A]
    +++ description: Immutable ENS CCIP-Read resolver used by Cloaked. Every query redirects to a configurable API gateway and accepts the returned ENS record if it is unexpired and signed by the configurable signer. It does not verify that a returned payment address was derived for the named recipient.
```
