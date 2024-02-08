Generated with discovered.json: 0x7c248e7cf936813d85d694d339b4b74a03d9aa12

# Diff at Wed, 07 Feb 2024 13:34:15 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175204
- current block number: 19176638

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175204 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.sequencerInbox:
+        "0x253887577420Cb7e7418cD4d50147743c8041b28"
    }
```

Generated with discovered.json: 0x368096bbdf292ae6710cc705bf1eb0584f168ba1

# Diff at Wed, 07 Feb 2024 08:44:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090313
- current block number: 19175204

## Description

Increased the gas limit.
Updated with the new OpDAHandler to remove the field.

## Watched changes

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.gasLimit:
-        30000000
+        150000000
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090313 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        true
    }
```

Generated with discovered.json: 0xdbe6ce9040494aceffa3835445396479993d2e68

# Diff at Fri, 26 Jan 2024 10:54:51 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 19032812
- current block number: 19090313

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19032812 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":true,"isSomeTxsLengthEqualToCelestiaDAExample":true}
    }
```

Generated with discovered.json: 0x7c9f89d35918320ff94fc04fa034065255687352

# Diff at Thu, 18 Jan 2024 09:19:36 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0cb1eb82b45ad89a272a3c1b8f8f24ae020627cc block: 18933723
- current block number: 19032812

## Description

Changed dynamic and static L2 fee overhead.
Ignoring multisig nonce.

## Watched changes

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.overhead:
-        2100
+        188
      values.scalar:
-        1000000
+        68400
    }
```

# Diff at Thu, 04 Jan 2024 11:38:42 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@45fa22227d0d99394ce6d0a25e40e8ceeca18cb3

## Description

One owner is removed and another is added to AevoMultiSig.

## Watched changes

```diff
    contract AevoMultiSig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
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
      values.nonce:
-        8
+        9
    }
```

# Diff at Tue, 26 Sep 2023 09:30:32 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
      values.deletedOutputs:
+        []
    }
```
