Generated with discovered.json: 0xf376f0a8a322736823fec8734f5606909b6543b9

# Diff at Thu, 28 Mar 2024 10:29:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19425639
- current block number: 19532020

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19425639 (main branch discovery), not current.

```diff
    contract BridgeGovernance (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    +++ description: None
      upgradeability.threshold:
+        "8 of 16 (50%)"
    }
```

```diff
    contract GnosisSafe (0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 3 (33%)"
    }
```

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
