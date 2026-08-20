Generated with discovered.json: 0xac627cb03f255cda06cb7d4781f563c545609493

# Diff at Thu, 20 Aug 2026 16:18:33 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current timestamp: 1786976781

## Description

Initial discovery of privacy boost.

## Initial discovery

```diff
+   Status: CREATED
    contract TokenRegistryProxyAdmin (oeth:0x11B75DE42f6107AE4D5C50e4e34af6E34F63C0dd) [global/ProxyAdmin]
    +++ description: Admin contract of the TokenRegistry proxy.
```

```diff
+   Status: CREATED
    contract AuthRegistry (oeth:0x54e87D7D0E420B24B9FdFE9cFcAe88162093A48f) [privacy-boost/AuthRegistry]
    +++ description: Registry of account authorization keys for the PrivacyBoost pool. Accounts register BabyJubJub approval public keys into Merkle trees with EIP-712 owner signatures (submitted directly or through allowed relays), and can rotate or revoke them. PrivacyBoost snapshots the tree roots and epoch proofs validate spend authorization against them.
```

```diff
+   Status: CREATED
    contract AdminMultisig (oeth:0x6476cBeBbce2673aeDAa464a4b9f31FD284aA0dC) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Groth16EpochVerifier (oeth:0x67b1bD839203223870fBF51e4CDf2104E3Ca966b) [privacy-boost/Groth16EpochVerifier]
    +++ description: Groth16 verifier for PrivacyBoost private transfer / withdrawal epoch proofs. Verification keys are stored in SSTORE2 data contracts, keyed by circuit configuration (max transfers, inputs and outputs per transfer). Registered epoch keys are not enumerable on-chain.
```

```diff
+   Status: CREATED
    contract OperatorMultisig (oeth:0x78a927114A20Fb34b9d8d9c6a9A75E65f918D52B) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenRegistry (oeth:0x867872f80b1e22D30C4b06FcB474aC10B9DAA2f6) [privacy-boost/TokenRegistry]
    +++ description: Registry mapping compact token IDs to the ERC-20 tokens accepted by the PrivacyBoost pool.
```

```diff
+   Status: CREATED
    contract PrivacyBoostProxyAdmin (oeth:0x9d3F3CcD3c7a084eE73C4584CE33e77CEdaEc7E2) [global/ProxyAdmin]
    +++ description: Admin contract of the PrivacyBoost proxy.
```

```diff
+   Status: CREATED
    contract TreasuryMultisig (oeth:0xc82018cbC82A50064e3DdEF79EAdC319710Ffc5e) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Groth16DepositVerifier (oeth:0xC829061276e95D11aF92E678DE2B767AcFB4e924) [privacy-boost/Groth16DepositVerifier]
    +++ description: Groth16 verifier for PrivacyBoost deposit epoch proofs. Verification keys are stored in SSTORE2 data contracts, registered per supported batch size.
```

```diff
+   Status: CREATED
    contract PrivacyBoost (oeth:0xca689828854a422CF1f778be03CA80549408F620) [privacy-boost/PrivacyBoost]
    +++ description: Main contract of the PrivacyBoost private transfer pool. It escrows registered ERC-20 tokens deposited against note commitments, and lets allowed relays batch private transfers and withdrawals into epochs that are verified with Groth16 proofs against a note Merkle tree. Users can exit without relay cooperation via a delayed forced withdrawal with their own proof.
```

```diff
+   Status: CREATED
    contract Groth16ForcedVerifier (oeth:0xF023c61C5c745Be40fd30B0d48C0929839Ec3C67) [privacy-boost/Groth16ForcedVerifier]
    +++ description: Groth16 verifier for PrivacyBoost forced withdrawal proofs, used by the permissionless exit path. Verification keys are stored in SSTORE2 data contracts, registered per supported input count.
```

```diff
+   Status: CREATED
    contract AuthRegistryProxyAdmin (oeth:0xfB66dfD80B9a96c2BF2bcfDC5E6715C48916eD6C) [global/ProxyAdmin]
    +++ description: Admin contract of the AuthRegistry proxy.
```
