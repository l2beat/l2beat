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
