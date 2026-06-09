Generated with discovered.json: 0x5c5f9c5037908f241174f63738ec8ad4e84484f0

# Diff at Tue, 09 Jun 2026 12:43:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1777036752
- current timestamp: 1777036752

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777036752 (main branch discovery), not current.

```diff
    EOA  (arb1:0x263294039413B96D25E4173a5F7599F8b3801504) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can request withdrawals, start a validator set change, add lockers and finalizers (Can also change cold validators by adding a finalizer and proposing/finalizing a new validator set)."
      receivedPermissions.0.permission:
-        "hotValidatorHyperliquid"
+        "interact"
    }
```

```diff
    EOA  (arb1:0x58E1b0E63C905D5982324FCd9108582623b8132e) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can request withdrawals, start a validator set change, add lockers and finalizers (Can also change cold validators by adding a finalizer and proposing/finalizing a new validator set)."
      receivedPermissions.0.permission:
-        "hotValidatorHyperliquid"
+        "interact"
    }
```

```diff
    EOA  (arb1:0x5a92b4A6a525445c9B4FFf61C0db71dCfE305ede) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can change the dispute period, block duration and locker threshold. Can also invalidate withdrawals, emergencyUnlock (unpause and change the validator set), remove lockers and finalizers."
      receivedPermissions.0.permission:
-        "coldValidatorHyperliquid"
+        "interact"
    }
```

```diff
    EOA  (arb1:0x8003FD297a7Aa477B746825E7A506675bF590E91) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can change the dispute period, block duration and locker threshold. Can also invalidate withdrawals, emergencyUnlock (unpause and change the validator set), remove lockers and finalizers."
      receivedPermissions.0.permission:
-        "coldValidatorHyperliquid"
+        "interact"
    }
```

```diff
    EOA  (arb1:0x86d6AE3032732F27239075D77a1317989B52F628) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can change the dispute period, block duration and locker threshold. Can also invalidate withdrawals, emergencyUnlock (unpause and change the validator set), remove lockers and finalizers."
      receivedPermissions.0.permission:
-        "coldValidatorHyperliquid"
+        "interact"
    }
```

```diff
    EOA  (arb1:0xda6816df552c3f9e0FB64979fb357800d690d79B) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can request withdrawals, start a validator set change, add lockers and finalizers (Can also change cold validators by adding a finalizer and proposing/finalizing a new validator set)."
      receivedPermissions.0.permission:
-        "hotValidatorHyperliquid"
+        "interact"
    }
```

```diff
    EOA  (arb1:0xE346B41B47296153A21E64D6bFc857C27874C6e7) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can change the dispute period, block duration and locker threshold. Can also invalidate withdrawals, emergencyUnlock (unpause and change the validator set), remove lockers and finalizers."
      receivedPermissions.0.permission:
-        "coldValidatorHyperliquid"
+        "interact"
    }
```

```diff
    EOA  (arb1:0xEF2364dB5db6F5539Aa0bC111771a94Ee47637Fc) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can request withdrawals, start a validator set change, add lockers and finalizers (Can also change cold validators by adding a finalizer and proposing/finalizing a new validator set)."
      receivedPermissions.0.permission:
-        "hotValidatorHyperliquid"
+        "interact"
    }
```

Generated with discovered.json: 0x76c0e774629ec3af0652b80e91c92ee39f6e4815

# Diff at Fri, 08 May 2026 07:51:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777036752
- current timestamp: 1777036752

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777036752 (main branch discovery), not current.

```diff
    contract HyperliquidBridge (arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7) [hyperliquid/HyperliquidBridge] {
    +++ description: Single contract containing the logic for the Hyperliquid bridge. It manages deposits, withdrawals, the hot and cold validator sets, as well as the lockers, finalizers, and all the permissioned functions. The current locker threshold is 2 and the minimum validator threshold is 2/3*4.
      sourceHashes.0:
-        "0x8c22d9d0e8dc4b87b77a97aca8a01a2050b5c416ff894e2b0c18daf22c76b122"
+        "0xffdc2cba00d9b1b339bee72dcf34ee34d38d62d6fecc073ff82c7d79bf1ff8af"
    }
```

Generated with discovered.json: 0x9e9751a4fde24d4dace0960ef4c61fec74b6cfec

# Diff at Tue, 05 May 2026 10:22:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777036752
- current timestamp: 1777036752

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777036752 (main branch discovery), not current.

```diff
    contract HyperliquidBridge (arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7) {
    +++ description: Single contract containing the logic for the Hyperliquid bridge. It manages deposits, withdrawals, the hot and cold validator sets, as well as the lockers, finalizers, and all the permissioned functions. The current locker threshold is 2 and the minimum validator threshold is 2/3*4.
      deployerAddress:
+        "arb1:0x1D4c01E15A637cB3cbaF86fFbb02E5A260D01fbc"
    }
```

Generated with discovered.json: 0xb999724128b60d9e02d9c6682f749499ea6d0fcc

# Diff at Fri, 24 Apr 2026 13:20:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1777036752

## Description

revive hl.

## Initial discovery

```diff
+   Status: CREATED
    contract HyperliquidBridge (arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7)
    +++ description: Single contract containing the logic for the Hyperliquid bridge. It manages deposits, withdrawals, the hot and cold validator sets, as well as the lockers, finalizers, and all the permissioned functions. The current locker threshold is 2 and the minimum validator threshold is 2/3*4.
```
