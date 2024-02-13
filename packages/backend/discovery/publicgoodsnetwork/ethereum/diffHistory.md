Generated with discovered.json: 0x4910121fd83e64fa0992aec7f3e348c3682f484b

# Diff at Wed, 07 Feb 2024 14:04:28 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175197
- current block number: 19176788

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175197 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.sequencerInbox:
+        "0xC1B90E1e459aBBDcEc4DCF90dA45ba077d83BFc5"
    }
```

Generated with discovered.json: 0xd087db262c876ac1e8569f8dfae22c3d82d65a41

# Diff at Wed, 07 Feb 2024 08:42:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090323
- current block number: 19175197

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090323 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        true
    }
```

Generated with discovered.json: 0x2ea26678bb8058c9f76cb5359240833a22025e41

# Diff at Fri, 26 Jan 2024 10:56:51 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 18927684
- current block number: 19090323

## Description

Added opStackDa handler

## Watched changes

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
+        true
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18927684 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":false,"isSomeTxsLengthEqualToCelestiaDAExample":false}
    }
```

Generated with discovered.json: 0x6aa5358cf6c02ec15a51221026873cf8df87d220

# Diff at Wed, 03 Jan 2024 15:21:30 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e8eb03b39061a86a8ec01e26d970e40d080ad225

## Description

One owner is removed and another is added to PGNMultiSig.

## Watched changes

```diff
    contract PGNMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
      values.getOwners.4:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.3:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.2:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.1:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.0:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

# Diff at Tue, 26 Sep 2023 09:36:43 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
      values.deletedOutputs:
+        []
    }
```
