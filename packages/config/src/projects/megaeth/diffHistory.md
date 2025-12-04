Generated with discovered.json: 0x2b5b1b5f11f0a81947406627fc2b7a6122c03ac5

# Diff at Wed, 03 Dec 2025 11:25:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb61f5ec5bdfe1b0d99f8a8bbf88c803aa243605 block: 1764165346
- current timestamp: 1764760164

## Description

refund contract deployed, refunds completed.

## Watched changes

```diff
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6) {
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071.
      description:
-        "Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719."
+        "Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071."
      values.treasury:
-        "eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719"
+        "eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071"
    }
```

```diff
+   Status: CREATED
    contract MegaPreDepositVaultRefund (eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071)
    +++ description: Refund escrow designed to hold the funds extracted from the predeposit vault and send them back to the users listed in the vault.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xe8344867AB6387e17b7cAE2dE52C63BCf501BD98)
    +++ description: None
```

## Source code changes

```diff
.../megaeth/.flat/MegaPreDepositVaultRefund.sol    | 1029 ++++++++++++++++++
 .../src/projects/megaeth/.flat/Safe/Safe.sol       | 1088 ++++++++++++++++++++
 .../projects/megaeth/.flat/Safe/SafeProxy.p.sol    |   37 +
 3 files changed, 2154 insertions(+)
```

Generated with discovered.json: 0xf9cd8338d39ae28745c59c2f01082a705999a80a

# Diff at Wed, 26 Nov 2025 10:21:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1764152153

## Description

Add Megaeth predeposit contract and TVS.

## Initial discovery

```diff
+   Status: CREATED
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6)
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719.
```

```diff
+   Status: CREATED
    contract Megaeth Multisig (eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719)
    +++ description: None
```
