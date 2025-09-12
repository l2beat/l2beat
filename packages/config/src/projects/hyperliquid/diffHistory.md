Generated with discovered.json: 0x606fd559cccaac3e30d9062afbf1abc336cb1cd7

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x7e2dd680c5a4113f60714550f059545c3bd37f2f

# Diff at Mon, 14 Jul 2025 12:44:17 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 343418956
- current block number: 343418956

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 343418956 (main branch discovery), not current.

```diff
    EOA  (0x263294039413B96D25E4173a5F7599F8b3801504) {
    +++ description: None
      address:
-        "0x263294039413B96D25E4173a5F7599F8b3801504"
+        "arb1:0x263294039413B96D25E4173a5F7599F8b3801504"
    }
```

```diff
    contract HyperliquidBridge (0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7) {
    +++ description: Single contract containing the logic for the Hyperliquid bridge. It manages deposits, withdrawals, the hot and cold validator sets, as well as the lockers, finalizers, and all the permissioned functions. The current locker threshold is 2 and the minimum validator threshold is 2/3*4.
      address:
-        "0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
      values.coldAddresses.0:
-        "0x8003fd297a7aa477b746825e7a506675bf590e91"
+        "arb1:0x8003FD297a7Aa477B746825E7A506675bF590E91"
      values.coldAddresses.1:
-        "0x86d6ae3032732f27239075d77a1317989b52f628"
+        "arb1:0x86d6AE3032732F27239075D77a1317989B52F628"
      values.coldAddresses.2:
-        "0xe346b41b47296153a21e64d6bfc857c27874c6e7"
+        "arb1:0xE346B41B47296153A21E64D6bFc857C27874C6e7"
      values.coldAddresses.3:
-        "0x5a92b4a6a525445c9b4fff61c0db71dcfe305ede"
+        "arb1:0x5a92b4A6a525445c9B4FFf61C0db71dCfE305ede"
      values.finalizers.0:
-        "0x58E1b0E63C905D5982324FCd9108582623b8132e"
+        "arb1:0x58E1b0E63C905D5982324FCd9108582623b8132e"
      values.finalizers.1:
-        "0x263294039413B96D25E4173a5F7599F8b3801504"
+        "arb1:0x263294039413B96D25E4173a5F7599F8b3801504"
      values.finalizers.2:
-        "0xda6816df552c3f9e0FB64979fb357800d690d79B"
+        "arb1:0xda6816df552c3f9e0FB64979fb357800d690d79B"
      values.finalizers.3:
-        "0xEF2364dB5db6F5539Aa0bC111771a94Ee47637Fc"
+        "arb1:0xEF2364dB5db6F5539Aa0bC111771a94Ee47637Fc"
      values.finalizers.4:
-        "0xf9d2282A4A4C216f624717C0747D23146FC048c5"
+        "arb1:0xf9d2282A4A4C216f624717C0747D23146FC048c5"
+++ description: The hot valis can also change the cold valis by adding a finalizer they control and then proposing, finalizing a validator set update.
      values.hotAddresses.0:
-        "0xef2364db5db6f5539aa0bc111771a94ee47637fc"
+        "arb1:0xEF2364dB5db6F5539Aa0bC111771a94Ee47637Fc"
+++ description: The hot valis can also change the cold valis by adding a finalizer they control and then proposing, finalizing a validator set update.
      values.hotAddresses.1:
-        "0xda6816df552c3f9e0fb64979fb357800d690d79b"
+        "arb1:0xda6816df552c3f9e0FB64979fb357800d690d79B"
+++ description: The hot valis can also change the cold valis by adding a finalizer they control and then proposing, finalizing a validator set update.
      values.hotAddresses.2:
-        "0x58e1b0e63c905d5982324fcd9108582623b8132e"
+        "arb1:0x58E1b0E63C905D5982324FCd9108582623b8132e"
+++ description: The hot valis can also change the cold valis by adding a finalizer they control and then proposing, finalizing a validator set update.
      values.hotAddresses.3:
-        "0x263294039413b96d25e4173a5f7599f8b3801504"
+        "arb1:0x263294039413B96D25E4173a5F7599F8b3801504"
      values.lockers.0:
-        "0x58E1b0E63C905D5982324FCd9108582623b8132e"
+        "arb1:0x58E1b0E63C905D5982324FCd9108582623b8132e"
      values.lockers.1:
-        "0x263294039413B96D25E4173a5F7599F8b3801504"
+        "arb1:0x263294039413B96D25E4173a5F7599F8b3801504"
      values.lockers.2:
-        "0xda6816df552c3f9e0FB64979fb357800d690d79B"
+        "arb1:0xda6816df552c3f9e0FB64979fb357800d690d79B"
      values.lockers.3:
-        "0xEF2364dB5db6F5539Aa0bC111771a94Ee47637Fc"
+        "arb1:0xEF2364dB5db6F5539Aa0bC111771a94Ee47637Fc"
      values.lockers.4:
-        "0xf9d2282A4A4C216f624717C0747D23146FC048c5"
+        "arb1:0xf9d2282A4A4C216f624717C0747D23146FC048c5"
      values.usdcToken:
-        "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
+        "arb1:0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
      implementationNames.0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7:
-        "Bridge2"
      implementationNames.arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7:
+        "Bridge2"
    }
```

```diff
    EOA  (0x58E1b0E63C905D5982324FCd9108582623b8132e) {
    +++ description: None
      address:
-        "0x58E1b0E63C905D5982324FCd9108582623b8132e"
+        "arb1:0x58E1b0E63C905D5982324FCd9108582623b8132e"
    }
```

```diff
    EOA  (0x5a92b4A6a525445c9B4FFf61C0db71dCfE305ede) {
    +++ description: None
      address:
-        "0x5a92b4A6a525445c9B4FFf61C0db71dCfE305ede"
+        "arb1:0x5a92b4A6a525445c9B4FFf61C0db71dCfE305ede"
    }
```

```diff
    EOA  (0x8003FD297a7Aa477B746825E7A506675bF590E91) {
    +++ description: None
      address:
-        "0x8003FD297a7Aa477B746825E7A506675bF590E91"
+        "arb1:0x8003FD297a7Aa477B746825E7A506675bF590E91"
    }
```

```diff
    EOA  (0x86d6AE3032732F27239075D77a1317989B52F628) {
    +++ description: None
      address:
-        "0x86d6AE3032732F27239075D77a1317989B52F628"
+        "arb1:0x86d6AE3032732F27239075D77a1317989B52F628"
    }
```

```diff
    EOA  (0xda6816df552c3f9e0FB64979fb357800d690d79B) {
    +++ description: None
      address:
-        "0xda6816df552c3f9e0FB64979fb357800d690d79B"
+        "arb1:0xda6816df552c3f9e0FB64979fb357800d690d79B"
    }
```

```diff
    EOA  (0xE346B41B47296153A21E64D6bFc857C27874C6e7) {
    +++ description: None
      address:
-        "0xE346B41B47296153A21E64D6bFc857C27874C6e7"
+        "arb1:0xE346B41B47296153A21E64D6bFc857C27874C6e7"
    }
```

```diff
    EOA  (0xEF2364dB5db6F5539Aa0bC111771a94Ee47637Fc) {
    +++ description: None
      address:
-        "0xEF2364dB5db6F5539Aa0bC111771a94Ee47637Fc"
+        "arb1:0xEF2364dB5db6F5539Aa0bC111771a94Ee47637Fc"
    }
```

```diff
    EOA  (0xf9d2282A4A4C216f624717C0747D23146FC048c5) {
    +++ description: None
      address:
-        "0xf9d2282A4A4C216f624717C0747D23146FC048c5"
+        "arb1:0xf9d2282A4A4C216f624717C0747D23146FC048c5"
    }
```

```diff
+   Status: CREATED
    contract HyperliquidBridge (0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7)
    +++ description: Single contract containing the logic for the Hyperliquid bridge. It manages deposits, withdrawals, the hot and cold validator sets, as well as the lockers, finalizers, and all the permissioned functions. The current locker threshold is 2 and the minimum validator threshold is 2/3*4.
```

Generated with discovered.json: 0x3cea14ddd5e6eb812985617f12574b667bb6eba3

# Diff at Fri, 04 Jul 2025 12:19:03 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 343418956
- current block number: 343418956

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 343418956 (main branch discovery), not current.

```diff
    EOA  (0x263294039413B96D25E4173a5F7599F8b3801504) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
      receivedPermissions.1.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
      receivedPermissions.2.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
    }
```

```diff
    EOA  (0x58E1b0E63C905D5982324FCd9108582623b8132e) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
      receivedPermissions.1.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
      receivedPermissions.2.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
    }
```

```diff
    EOA  (0x5a92b4A6a525445c9B4FFf61C0db71dCfE305ede) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
    }
```

```diff
    EOA  (0x8003FD297a7Aa477B746825E7A506675bF590E91) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
    }
```

```diff
    EOA  (0x86d6AE3032732F27239075D77a1317989B52F628) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
    }
```

```diff
    EOA  (0xda6816df552c3f9e0FB64979fb357800d690d79B) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
      receivedPermissions.1.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
      receivedPermissions.2.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
    }
```

```diff
    EOA  (0xE346B41B47296153A21E64D6bFc857C27874C6e7) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
    }
```

```diff
    EOA  (0xEF2364dB5db6F5539Aa0bC111771a94Ee47637Fc) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
      receivedPermissions.1.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
      receivedPermissions.2.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
    }
```

```diff
    EOA  (0xf9d2282A4A4C216f624717C0747D23146FC048c5) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
      receivedPermissions.1.from:
-        "arbitrum:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
+        "arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7"
    }
```

Generated with discovered.json: 0x4e6e10c6c840d7597cf9d49908128928d6b4d506

# Diff at Tue, 03 Jun 2025 09:46:46 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 343418956

## Description

re-add hyperliquid as a bridge.

## Initial discovery

```diff
+   Status: CREATED
    contract HyperliquidBridge (0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7)
    +++ description: Single contract containing the logic for the Hyperliquid bridge. It manages deposits, withdrawals, the hot and cold validator sets, as well as the lockers, finalizers, and all the permissioned functions. The current locker threshold is 2 and the minimum validator threshold is 2/3*4.
```

