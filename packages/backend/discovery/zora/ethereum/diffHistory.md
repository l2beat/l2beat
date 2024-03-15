Generated with discovered.json: 0xc6c52a6ec0fdc21b6e16ceb7943e3f14964de146

# Diff at Thu, 14 Mar 2024 07:34:32 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@c79c75cb88d41e2f05e9cca5d501133eae405bbe block: 19412025
- current block number: 19431793

## Description

Blobs are switched on

## Watched changes

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
-        false
+        true
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279133793016986207220"
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      values.getOwners[7]:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners[6]:
+        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
      values.getOwners.5:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81"
      values.getOwners.4:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7"
      values.getOwners.3:
-        "0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81"
+        "0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB"
      values.getOwners.2:
-        "0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7"
+        "0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4"
      values.getOwners.1:
-        "0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.0:
-        "0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getThreshold:
-        4
+        2
    }
```

Generated with discovered.json: 0x44525c357a439c8e58fd7a9bc37a7dc22f0893d1

# Diff at Mon, 11 Mar 2024 13:04:18 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176790
- current block number: 19412025

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176790 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

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
