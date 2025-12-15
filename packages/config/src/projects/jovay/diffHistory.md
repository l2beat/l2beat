Generated with discovered.json: 0xc44d935dad53b75e4a4689729f5efd69adc963da

# Diff at Fri, 31 Oct 2025 10:59:58 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current timestamp: 1761907870

## Description

First discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract DcapAttestationRouter (eth:0x238f4DaFC22013a864f85a54E276aC99975566fA)
    +++ description: The DcapAttestationRouter contract is used for routing and verifying Intel SGX/TDX DCAP attestation proofs. The contract sends each quote to the corresponding verification path (cache verifier vs. Automata DCAP contract, and SGX vs. TDX measurement checks).
```

```diff
+   Status: CREATED
    contract MeasurementDao (eth:0x359437E2763e9622DD4324D7904BbF7516332D4F)
    +++ description: The MeasurementDao contract is an onchain registry that allowlists SGX MR_ENCLAVE<->MR_SIGNER pairs and TDX RTMR3/MRTD values, and verifies DCAP quotes by matching quote fields to the stored measurements.
```

```diff
+   Status: CREATED
    contract TEEVerifierProxy (eth:0x371a8bda9a34d641B546883D6B5895d0A44AD46A)
    +++ description: The TEEVerifierProxy contract is used to verify L2 batches using TEE attestations. It delegates proof verification to the dcapAttestationRouter contract. 
```

```diff
+   Status: CREATED
    contract DaimoP256Verifier (eth:0x783377992FCA09009eaD952D4fBa6519e25726b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TEEVerifierProxyOwner (eth:0x79241BbE3646d8405849Cbe8608e77b82c402892)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ETHBridge (eth:0x922248Db4A99bB542539ae7165FB9D7A546FB9F1)
    +++ description: The L1ETHBridge contract is used to bridge ETH between the L1 and L2.
```

```diff
+   Status: CREATED
    contract TEECacheVerifier (eth:0x9734CcA9304A4c7a5a27bCFac9eDa23e09cBAaF2)
    +++ description: A cache-enabled P-256 ECDSA verifier for Intel SGX/TDX DCAP quotes (v3/v4/v5) that authenticates local attestation data, extracts the 32-byte commitment, and lets the owner/authorized callers initialize, manage, and reuse cached attestation keys to skip repeat verifications.
```

```diff
+   Status: CREATED
    contract L1Mailbox (eth:0x9869A90FDAc287519E48aff4cCE329907a995162)
    +++ description: The L1Mailbox contract is used to send messages to the L2.
```

```diff
+   Status: CREATED
    contract AutomataDcapAttestationFee (eth:0xb3a96165caf30F8F7cE9BCfdaaAe99BA93C1A6F9)
    +++ description: Contract used to charge a configurable basis-point fee to verify Intel DCAP quotes. Currently set to 0 basis points.
```

```diff
+   Status: CREATED
    contract Rollup (eth:0xe0a28B8918a62edB825055221a1dF12c7C81Bac1)
    +++ description: The Rollup contract is used to submit and verify L2 batches.
```

```diff
+   Status: CREATED
    contract  (eth:0xe2f33Bd70B301F53f61CB7b22D852bC8e3D95E2b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0xf2A2Bee383C2e4d75d9aE5953b3A6cFABb661a47)
    +++ description: None
```
