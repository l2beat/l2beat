Generated with discovered.json: 0x4b6fe18ad8f293504a0a33f9c42978bb3a90f0b0

# Diff at Thu, 28 Mar 2024 08:50:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19512697
- current block number: 19531530

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19512697 (main branch discovery), not current.

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0xa8a01225c5752db0370ec77705d39bcb620fa9a0

# Diff at Mon, 25 Mar 2024 16:34:55 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e6ff14fa637ed6c3a674ff43e070f1cf65f4aa1e block: 19485578
- current block number: 19512697

## Description

The upgrade delay of the StarkExchange escrow is reduced from 14 to 3 days. This is the delay after which the Governors can upgrade the implementation.

## Watched changes

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      upgradeability.upgradeDelay:
-        1209600
+        259200
    }
```

Generated with discovered.json: 0xa561735c000067bf6baa50f29262ba681f1a87f8

# Diff at Thu, 21 Mar 2024 21:03:02 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@173befb1ef4ba15605c92f5f89227f2ffd2af3eb block: 19481771
- current block number: 19485578

## Description

Remove three signers and raise threshold. The gov multisig is now 4/6.

## Watched changes

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.8:
-        "0x0405107a60391Eb51821be373ff978115Ee58488"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.7:
-        "0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.6:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+++ description: Threshold of the Multisig
+++ type: PERMISSION
+++ severity: HIGH
      values.getThreshold:
-        2
+        4
    }
```

Generated with discovered.json: 0x18bf4f662d02fa88c9f4ffe7a437d3a8cb716f2a

# Diff at Thu, 21 Mar 2024 08:12:23 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@fae0f54992a5b56e7393c77915df2eef2a6dd0bf block: 17968886
- current block number: 19481771

## Description

Add 6 signers to the Governance Multisig, which is now 2/9.

## Watched changes

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.8:
+        "0x0405107a60391Eb51821be373ff978115Ee58488"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.7:
+        "0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.6:
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.5:
+        "0xe0fE5b38C52A83308bEC9242d768441025DBB4D8"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.4:
+        "0x445EEDE2681116Dd94C8D5Bfab73283B3ef1f6f3"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.3:
+        "0x611F96c83fE0A30B504Ee2C6a2Cae890e620bA35"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.2:
-        "0x0405107a60391Eb51821be373ff978115Ee58488"
+        "0x0fa6bf3377Cfa276d9d7122c09C187e5e8ef1C59"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.1:
-        "0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"
+        "0x478615F37FcCB0DF69C191a8674233f6899D092e"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.0:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x94aa58E38ac22518Cf0E267cd062Ed7E78eA958E"
    }
```

Generated with discovered.json: 0x2b4f4061348e353e029e23053815e06089f74a92
