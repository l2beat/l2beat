# Diff at Thu, 05 Oct 2023 07:17:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@bd8583bb786deb2218b31cd53ffe833ba3b0b72a

## Description

Proposal: <https://dydx.community/dashboard/proposal/15>

TLDR: added wethDYDX in the calculation of governance power. wethDYDX is a token minted by locking Ethereum DYDX tokens (called ethDYDX) permanently which will be later bridged to the dYdX Chain. wethDYDX is a transferrable ERC20. Does this mean that tokens will get duplicated?

We don't have a specific section on the website to specify this information, but we will soon with the Governance section, so I'll wait before adding anything to the project page.

## Watched changes

```diff
    contract DydxGovernor (0x7E9B1672616FF6D6629Ef2879419aaE79A9018D2) {
      values.getGovernanceStrategy:
-        "0x90Dfd35F4a0BB2d30CDf66508085e33C353475D9"
+        "0xc2f5F3505910Da80F0592a3Cc023881C50b16505"
    }
```

```diff
-   Status: DELETED
    contract GovernanceStrategy (0x90Dfd35F4a0BB2d30CDf66508085e33C353475D9) {
    }
```

```diff
+   Status: CREATED
    contract WrappedEthereumDydxToken (0x46b2DeAe6eFf3011008EA27EA36b7c27255ddFA9) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceStrategyV2 (0xc2f5F3505910Da80F0592a3Cc023881C50b16505) {
    }
```

# Diff at Tue, 26 Sep 2023 11:49:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract SafetyModule (0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC) {
      values.slashings:
+        []
    }
```
