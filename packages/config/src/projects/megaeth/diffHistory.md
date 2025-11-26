Generated with discovered.json: 0x05acdac48586dc38d7cae99fa1d3c212bb2bb962

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
