Generated with discovered.json: 0x1702f6af26153cd2f1a70dad0a28c46f02f49de4

# Diff at Thu, 14 Mar 2024 07:57:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@2dc3a9d819f43d1d2a2f717406d64b063739d73b block: 18833503
- current block number: 19431906

## Description

One signer of the Metis Multisig contract has been replaced.

## Watched changes

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: None
      values.getOwners[7]:
+        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
      values.getOwners[6]:
+        "0xB961047013F974C5b6B6F8dA4402379525316550"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.5:
-        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.4:
-        "0xB961047013F974C5b6B6F8dA4402379525316550"
+        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.3:
-        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.2:
-        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.1:
-        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.0:
-        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
    }
```

Generated with discovered.json: 0xd3b550ff7c80b542babb88f19ab684dbc8a006b9

# Diff at Thu, 21 Dec 2023 10:01:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e3ed8c1fec052d9121fe4f20c32a54980307e76e

## Description

The total supply of the Metis Token has been increased to 10000000.

## Watched changes

```diff
    contract MToken (0x9E32b13ce7f2E80A01932B42553652E053D6ed8e) {
      values.totalSupply:
-        "5410000510000000000000000"
+        "10000000000000000000000000"
    }
```
