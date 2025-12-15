Generated with discovered.json: 0xd58522fd6fd5c0492232e08874f1b463dd7f5b15

# Diff at Wed, 19 Nov 2025 10:59:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c2740481ca5c9bb2be3283052c4a68b2d735c71b block: 1748939714
- current timestamp: 1763549888

## Description

validator addresses are unchanged:
https://arbiscan.io/tx/0x62a66b841b44845f9aa6a2c40b7aea017eedb791b95a5f20bd312960320246b4

but the bridge was paused for a brief period (twice):
- https://arbiscan.io/tx/0x3eb1fa1996c64de979b4426825706beb609b2c1adb6b971712139f74815c0bdd
- https://arbiscan.io/tx/0x711d635b68f8af9061137e5a751007a833fe028c5b87f69b40b6820e6d165a3e

## Watched changes

```diff
    contract HyperliquidBridge (arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7) {
    +++ description: Single contract containing the logic for the Hyperliquid bridge. It manages deposits, withdrawals, the hot and cold validator sets, as well as the lockers, finalizers, and all the permissioned functions. The current locker threshold is 2 and the minimum validator threshold is 2/3*4.
      values.coldValidatorSetHash:
-        "0x7d9ba0065e166ea281f295ab005e63f7bfdf51dea2361a4a5aa34905a4b2b20f"
+        "0x55a3e95e596d9e4918403663b9e83d046fdf17cdcbdb4fe6bf5429afde0adc2d"
      values.epoch:
-        5
+        7
      values.hotValidatorSetHash:
-        "0xf92fbcc7725c7e78596d75626eee1a05908b653aeededc4927fecca41f35e2d6"
+        "0x1503ca1a4eac24ce351d93ef962f13cb745a9d08f50cef522ca8aa216e13fb7f"
      values.pendingValidatorSetUpdate.epoch:
-        5
+        7
      values.pendingValidatorSetUpdate.updateBlockNumber:
-        261233949
+        399539914
      values.pendingValidatorSetUpdate.hotValidatorSetHash:
-        "0xf92fbcc7725c7e78596d75626eee1a05908b653aeededc4927fecca41f35e2d6"
+        "0x1503ca1a4eac24ce351d93ef962f13cb745a9d08f50cef522ca8aa216e13fb7f"
      values.pendingValidatorSetUpdate.coldValidatorSetHash:
-        "0x7d9ba0065e166ea281f295ab005e63f7bfdf51dea2361a4a5aa34905a4b2b20f"
+        "0x55a3e95e596d9e4918403663b9e83d046fdf17cdcbdb4fe6bf5429afde0adc2d"
+++ description: Validator set updates. See config.jsonc and update the hardcoded validator addresses.
+++ severity: HIGH
      values.validatorSetUpdates.5:
+        {"epoch":6,"hotValidatorSetHash":"0x9e80943d95888cde6b0903f8773bd1816e94270a726bdacdf62942103436c17d","coldValidatorSetHash":"0x0cae1c00d81931c7cb53d11eb94eb7367a568bc86bff3f47078ab9f2c8ddd49a"}
+++ description: Validator set updates. See config.jsonc and update the hardcoded validator addresses.
+++ severity: HIGH
      values.validatorSetUpdates.6:
+        {"epoch":7,"hotValidatorSetHash":"0x1503ca1a4eac24ce351d93ef962f13cb745a9d08f50cef522ca8aa216e13fb7f","coldValidatorSetHash":"0x55a3e95e596d9e4918403663b9e83d046fdf17cdcbdb4fe6bf5429afde0adc2d"}
    }
```

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

