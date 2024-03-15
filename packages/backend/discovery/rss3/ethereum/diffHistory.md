Generated with discovered.json: 0xbef6a0dcd7a675f046f41b0a608bd1bd6018e9ed

# Diff at Wed, 13 Mar 2024 09:06:47 GMT:

- author: KallyDev (<kallydev@rss3.io>)
- comparing to: main@069aea2670e9ba34329a7264518f89c07b7d1578 block: 19388970
- current block number: 19425147

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract SystemConfig (0x80e73D6BfC73c567032304C3891a06c2d9954d09) {
    +++ description: None
      values.overhead:
-        2100
+        188
      values.scalar:
-        15000000000
+        8000000000
      values.opStackDA:
+        {"isSomeTxsLengthEqualToCelestiaDAExample":false,"isSequencerSendingBlobTx":false}
      values.sequencerInbox:
+        "0xfFFF000000000000000000000000000000012553"
      errors:
-        {"opStackDA":"[\n  {\n    \"code\": \"too_small\",\n    \"minimum\": 20,\n    \"type\": \"array\",\n    \"inclusive\": true,\n    \"exact\": true,\n    \"message\": \"Array must contain exactly 20 element(s)\",\n    \"path\": []\n  }\n]","sequencerInbox":"[\n  {\n    \"code\": \"too_small\",\n    \"minimum\": 20,\n    \"type\": \"array\",\n    \"inclusive\": true,\n    \"exact\": true,\n    \"message\": \"Array must contain exactly 20 element(s)\",\n    \"path\": []\n  }\n]"}
    }
```

```diff
    contract AdminMultisig (0x8AC80fa0993D95C9d6B8Cb494E561E6731038941) {
    +++ description: None
      values.getOwners[4]:
+        "0xF209b7Bbadf8d9518a822aEaa7119B38b17377A7"
      values.getOwners[3]:
+        "0xf877475092Dc23AD9d367B27D48645d56564D310"
      values.getOwners[2]:
+        "0x70f8b7f14eA00209A70a926134B86E5eb9f4317f"
      values.getOwners[1]:
+        "0xEE52b76e6A9F6eA669F8A99bb63b113819cDCbEF"
      values.getOwners.0:
-        "0xF209b7Bbadf8d9518a822aEaa7119B38b17377A7"
+        "0xc06d32F7C20f100C7b8657dE2b24f201A46BC3DD"
      values.getThreshold:
-        1
+        3
    }
```
