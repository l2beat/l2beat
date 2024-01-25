Generated with discovered.json: 0x4e7d2fc04dd00f06386ecfbea39ff65a8618b801

# Diff at Sun, 12 Nov 2023 07:41:47 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@eae2f7f70e414ebfe1217a66fea18a1d5483fb5e

## Description

DeGate (v1) is going through a redeployment, and for this reason the main ExchangeV3 contract is switched to shutdown mode.

## Watched changes

```diff
    contract ExchangeV3 (0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7) {
      values.isShutdown:
-        false
+        true
      values.shutdownTriggered[0]:
+        {"timestamp":1699762379}
    }
```

# Diff at Tue, 26 Sep 2023 12:46:23 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract ExchangeV3 (0x9C8f884B15a1fcd5B4bcEb8647DC2D15165906c7) {
      values.shutdownTriggered:
+        []
    }
```
