Generated with discovered.json: 0xec98cd69992257a9ad296440e0d88daeb132bbe1

# Diff at Thu, 10 Apr 2025 14:44:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 1077934
- current block number: 1077934

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1077934 (main branch discovery), not current.

```diff
    contract EverclearHub (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      name:
-        "ERC1967Proxy"
+        "EverclearHub"
      displayName:
-        "EverclearHub"
    }
```

Generated with discovered.json: 0xf763ad9b042251968d1cbc9c2c5f4a5bbb7eb51b

# Diff at Thu, 03 Apr 2025 09:39:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ad19dfb413ff34348157f743c194a146b6447e05 block: 938182
- current block number: 1041412

## Description

Supported domain added (100 - GnosisChain). ms member changes.

## Watched changes

```diff
    contract ERC1967Proxy (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      values.supportedDomains.17:
+        324
      values.supportedDomains.16:
-        324
+        137
      values.supportedDomains.15:
-        137
+        130
      values.supportedDomains.14:
-        130
+        100
    }
```

```diff
    contract  (0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"upgrade","from":"0xa05A3380889115bf313f1Db9d5f335157Be4D816"}
      receivedPermissions.0.from:
-        "0xa05A3380889115bf313f1Db9d5f335157Be4D816"
+        "0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa"
      values.$members.1:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
+        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
      values.$members.0:
-        "0xeb19B3Bdad53A775EB2d94d57D5a46c5260B0044"
+        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
    }
```

```diff
    contract undefined (0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa"}]
    }
```

```diff
    contract  (0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
+        "0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
      values.$admin:
-        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
+        "0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8"
    }
```

Generated with discovered.json: 0xbc54a4c597cb0568386b7a7a3025b4aac4d1f727

# Diff at Mon, 17 Mar 2025 08:23:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 938182

## Description

Initial discovery using the custom Everclear proxy handler.

## Initial discovery

```diff
+   Status: CREATED
    contract ERC1967Proxy (0xa05A3380889115bf313f1Db9d5f335157Be4D816)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xac7599880cB5b5eCaF416BEE57C606f15DA5beB8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xEFfAB7cCEBF63FbEFB4884964b12259d4374FaAa)
    +++ description: None
```
