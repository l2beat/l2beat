Generated with discovered.json: 0x62696348b2db46516d37506a92f9f7c43734aaf1

# Diff at Wed, 07 Feb 2024 14:04:48 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175194
- current block number: 19176790

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175194 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
      values.sequencerInbox:
+        "0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf"
    }
```

Generated with discovered.json: 0x258544e0ba1c6ca2c1c39595f9249531601ae6bf

# Diff at Wed, 07 Feb 2024 08:42:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090324
- current block number: 19175194

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090324 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
    }
```

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
