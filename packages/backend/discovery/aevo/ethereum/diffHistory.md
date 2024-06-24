Generated with discovered.json: 0x290766f776962ea600fd435916930ff1f16c98d2

# Diff at Wed, 22 May 2024 20:04:57 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918875
- current block number: 19927688

## Description

ConduitMultisig update.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.5:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.getOwners.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0xc32a7c7a041fd05ebe665655ae4552e25de6a5e1

# Diff at Tue, 21 May 2024 14:28:13 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19531398
- current block number: 19918875

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531398 (main branch discovery), not current.

```diff
    contract AevoMultiSig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "AevoMultiSig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x7ea75822b1ed65b8b2d69da70a1727f6abbd48b5

# Diff at Thu, 28 Mar 2024 08:24:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19411980
- current block number: 19531398

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19411980 (main branch discovery), not current.

```diff
    contract AevoMultiSig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x5ac8e286dec030bdfa6c4454607ac3469df1550a

# Diff at Mon, 11 Mar 2024 12:55:52 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176638
- current block number: 19411980

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176638 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

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
