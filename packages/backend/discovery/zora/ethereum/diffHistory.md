Generated with discovered.json: 0x3fa7567e1997dc0a9d4c893f92a793efbed0dd70

# Diff at Fri, 26 Jan 2024 10:57:02 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 18218892
- current block number: 19090324

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18218892 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":false,"isSomeTxsLengthEqualToCelestiaDAExample":false}
    }
```

Generated with discovered.json: 0xc4da1c7eb9cf28e329c3fe57238e3bb84a640431

# Diff at Tue, 26 Sep 2023 08:54:55 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
      values.deletedOutputs:
+        []
    }
```
