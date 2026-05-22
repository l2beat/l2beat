Generated with discovered.json: 0x6f1771d051b135165b4e7c1653ebd3d4b535ddc5

# Diff at Fri, 15 May 2026 12:36:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1777567242
- current timestamp: 1777567242

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777567242 (main branch discovery), not current.

```diff
    EOA  (eth:0xd76eEb2A6fcf55dc80D046FFbc96D1A2B45AB52E) {
    +++ description: None
      sourceHashes.0:
-        "0x6fcf212849ffbf34d907a048df4d05a6c97f876a620c7386a770735262604c54"
+        "0x1f44812af62d28f019e30e8eb2af596fb36c7db9d34576972c0405e110a6ef45"
    }
```

Generated with discovered.json: 0x7ec6f3085e1de8c3f9dcb62235fcb04067d66a6c

# Diff at Fri, 08 May 2026 08:29:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777567242
- current timestamp: 1777567242

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777567242 (main branch discovery), not current.

```diff
    contract WithdrawalVerifier (eth:0x022891F938Ae7fDC8Ab9Ead0FBf50aBA8C897D6d) [privacy-pools/WithdrawalVerifier] {
    +++ description: Stateless Groth16 verifier used by Privacy Pool contracts to verify withdrawal proofs. The verification key is hardcoded in the contract and there are no privileged roles or mutable configuration.
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolUSDS (eth:0x05e4DBD71B56861eeD2Aaa12d00A797F04B5D3c0) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolWstETH (eth:0x1A604E9DFa0EFDC7FFda378AF16Cb81243b61633) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolDAI (eth:0x1c31C03B8CB2EE674D0F11De77135536db828257) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolsEntrypoint (eth:0x6818809EefCe719E480a7526D76bD3e561526b46) [privacy-pools/Entrypoint] {
    +++ description: UUPS-upgradeable hub for Privacy Pools. It accepts deposits, relays withdrawals, tracks association-set roots published by the ASP, and maps each supported asset and scope to a pool. Trusting this contract means trusting OWNER_ROLE holders to upgrade it, manage pools and fees, and withdraw fees, and trusting ASP_POSTMAN holders to publish the latest association-set root used by withdrawals.
      sourceHashes.0:
-        "0x29faf4889af43049c742ca34aeff493c079c023986c7f794a3dbfe3b1c642d09"
+        "0xf66f390c3291bc5b8725bf8fa36d64494b91e8cfb2b717b52e85adcc68dcdd50"
      sourceHashes.1:
-        "0x2a185e630005e18ddf039fbf7c694eaa05c51c5497249d11744f1146a8ac64df"
+        "0xc0803a56928ed2a65accbfc22d51bd281c0eb4a0e377078e13b26d12153628ec"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolWOETH (eth:0x7d2959bCFb936a84531518e8391DdBa844e03ebE) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract RagequitVerifier (eth:0xa45ACa8604a73D80C551fAad6355A5c3A5565eC6) [privacy-pools/CommitmentVerifier] {
    +++ description: Stateless Groth16 verifier used by Privacy Pool contracts to verify ragequit proofs. The verification key is hardcoded in the contract and there are no privileged roles or mutable configuration.
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolsAdminSafe (eth:0xAd7f9A19E2598b6eFE0A25C84FB1c87F81eB7159) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
      deployerAddress:
+        "eth:0x42FEdcd80C8C9694DBc3b2ff0fD48BB8651dfC62"
    }
```

```diff
    contract PrivacyPoolUSDC (eth:0xb419c2867aB3CBc78921660cB95150d95A94ce86) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolBOLD (eth:0xb4b5Fd38Fd4788071d7287e3cB52948e0d10b23E) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolSUSDS (eth:0xBBdA2173CDFEA1c3bD7F2908798F1265301d750c) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolUSD1 (eth:0xc0A8Bc0F4F982b4d4f1fFae8F4FCCb58c9B29c98) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolFrxUSD (eth:0xC6C769fac7AABEadd31a03fAe5Ca0Ec5B4C50f84) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolFxUSD (eth:0xD14F4B36E1D1D98c218db782c49149876042BC56) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    EOA  (eth:0xd76eEb2A6fcf55dc80D046FFbc96D1A2B45AB52E) {
    +++ description: None
      sourceHashes.0:
-        "0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"
+        "0x6fcf212849ffbf34d907a048df4d05a6c97f876a620c7386a770735262604c54"
    }
```

```diff
    contract PrivacyPoolUSDe (eth:0xe6D36B33b00A7C0cB0C2a8d39D07e7dB0c526Abc) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolUSDT (eth:0xe859C0bD25f260BaEE534Fb52e307D3b64D24572) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolETH (eth:0xF241d57C6DebAe225c0F2e6eA1529373C9A9C9fB) [privacy-pools/PrivacyPoolSimple] {
    +++ description: Native-asset Privacy Pool that escrows ETH commitments for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x6cd03829f963a4753b1197064a6fc568184d89cdc380b934148ff6c8941f7ae9"
+        "0x3252809f9d07f7ff3537481cd733b81f8455c6ecfde29a27f9ed7e3094998f44"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

```diff
    contract PrivacyPoolWBTC (eth:0xF973f4B180A568157Cd7A0E6006449139E6Bfc32) [privacy-pools/PrivacyPoolComplex] {
    +++ description: ERC20 Privacy Pool that escrows one asset for one scope. Only the Entrypoint can create deposits or wind the pool down. Withdrawals and ragequits depend on the linked Groth16 verifiers and on the latest association-set root in the Entrypoint.
      sourceHashes.0:
-        "0x4e93d0394e34565e473aa7d2e6e2a287cd82e14e394f2a49aed18efa47660b69"
+        "0x0982e14be7366721a39385a079861484c3a543b272dc298a8d1ba4f3fb30e8cc"
      deployerAddress:
+        "eth:0x1f4Fe25Cf802a0605229e0Dc497aAf653E86E187"
    }
```

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
