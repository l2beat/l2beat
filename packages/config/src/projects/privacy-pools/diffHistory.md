Generated with discovered.json: 0xb3dbef2e5af07740383ff0c275f763f10f8e7ca0

# Diff at Thu, 30 Apr 2026 17:11:19 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current timestamp: 1777567242

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract WithdrawalVerifier (eth:0x022891F938Ae7fDC8Ab9Ead0FBf50aBA8C897D6d)
    +++ description: Stateless Groth16 verifier used by Privacy Pool contracts to verify withdrawal proofs. The verification key is hardcoded in the contract and there are no privileged roles or mutable configuration.
```

```diff
+   Status: CREATED
    contract PrivacyPoolUSDS (eth:0x05e4DBD71B56861eeD2Aaa12d00A797F04B5D3c0)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract PrivacyPoolWstETH (eth:0x1A604E9DFa0EFDC7FFda378AF16Cb81243b61633)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract PrivacyPoolDAI (eth:0x1c31C03B8CB2EE674D0F11De77135536db828257)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract PrivacyPoolsEntrypoint (eth:0x6818809EefCe719E480a7526D76bD3e561526b46)
    +++ description: UUPS-upgradeable hub for Privacy Pools. It accepts deposits, relays withdrawals, tracks association-set roots published by the ASP, and maps each supported asset and scope to a pool. Trusting this contract means trusting OWNER_ROLE holders to upgrade it, manage pools and fees, and withdraw fees, and trusting ASP_POSTMAN holders to publish the latest association-set root used by withdrawals.
```

```diff
+   Status: CREATED
    contract PrivacyPoolWOETH (eth:0x7d2959bCFb936a84531518e8391DdBa844e03ebE)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract RagequitVerifier (eth:0xa45ACa8604a73D80C551fAad6355A5c3A5565eC6)
    +++ description: Stateless Groth16 verifier used by Privacy Pool contracts to verify ragequit proofs. The verification key is hardcoded in the contract and there are no privileged roles or mutable configuration.
```

```diff
+   Status: CREATED
    contract PrivacyPoolsAdminSafe (eth:0xAd7f9A19E2598b6eFE0A25C84FB1c87F81eB7159)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PrivacyPoolUSDC (eth:0xb419c2867aB3CBc78921660cB95150d95A94ce86)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract PrivacyPoolBOLD (eth:0xb4b5Fd38Fd4788071d7287e3cB52948e0d10b23E)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract PrivacyPoolSUSDS (eth:0xBBdA2173CDFEA1c3bD7F2908798F1265301d750c)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract PrivacyPoolUSD1 (eth:0xc0A8Bc0F4F982b4d4f1fFae8F4FCCb58c9B29c98)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract PrivacyPoolFrxUSD (eth:0xC6C769fac7AABEadd31a03fAe5Ca0Ec5B4C50f84)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract PrivacyPoolFxUSD (eth:0xD14F4B36E1D1D98c218db782c49149876042BC56)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    EOA  (eth:0xd76eEb2A6fcf55dc80D046FFbc96D1A2B45AB52E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PrivacyPoolUSDe (eth:0xe6D36B33b00A7C0cB0C2a8d39D07e7dB0c526Abc)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract PrivacyPoolUSDT (eth:0xe859C0bD25f260BaEE534Fb52e307D3b64D24572)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract PrivacyPoolETH (eth:0xF241d57C6DebAe225c0F2e6eA1529373C9A9C9fB)
    +++ description: Native-asset Privacy Pool that escrows ETH commitments for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```

```diff
+   Status: CREATED
    contract PrivacyPoolWBTC (eth:0xF973f4B180A568157Cd7A0E6006449139E6Bfc32)
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
```
