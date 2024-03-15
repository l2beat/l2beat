Generated with discovered.json: 0x4a5fcb93fb7311213ea7220e147822bc75feeef4

# Diff at Wed, 13 Mar 2024 10:45:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@569d0a5fb269e21eeb1e6c7fdb1a2848a0c6fda7 block: 18825546
- current block number: 19425639

## Description

One validator of the 8 in the multisig is changed.

## Watched changes

```diff
    contract BridgeValidators (0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) {
    +++ description: None
+++ description: Array of the signers in the validator multisig
+++ type: PERMISSION
+++ severity: MEDIUM
      values.validatorList.0:
-        "0xfDBf5711f77B97EA7F1f812832884c7328a682eC"
+        "0x456c255A8BC1F33778603A2a48Eb6B0C69F4d48E"
    }
```

Generated with discovered.json: 0x7e766748f218a7a95313663407b4d0b507548a58

# Diff at Wed, 20 Dec 2023 07:11:37 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@66449a15ea740d012130a024e5e0daa7f431f04b

## Description

Change in the required block confirmations of Arbitrary Message Bridge - the number of block confirmations oracle will wait before processing passed messages has been increased.

## Watched changes

```diff
    contract ForeignAMB (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
      values.requiredBlockConfirmations:
-        100
+        130
    }
```
