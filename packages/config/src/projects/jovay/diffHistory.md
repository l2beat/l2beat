Generated with discovered.json: 0x2e33f9a2ee333f5f3e6a2563b45c866e248c8dcf

# Diff at Thu, 20 Nov 2025 10:59:06 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@affe2a8446dd872cf147b75c29b9d7804e5f0b52 block: 1762443722
- current timestamp: 1763636282

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
-   Status: DELETED
    contract DcapAttestationRouter (eth:0x238f4DaFC22013a864f85a54E276aC99975566fA)
    +++ description: The DcapAttestationRouter contract is used for routing and verifying Intel SGX/TDX DCAP attestation proofs. The contract sends each quote to the corresponding verification path (cache verifier vs. Automata DCAP contract, and SGX vs. TDX measurement checks).
```

```diff
-   Status: DELETED
    contract MeasurementDao (eth:0x359437E2763e9622DD4324D7904BbF7516332D4F)
    +++ description: The MeasurementDao contract is an onchain registry that allowlists SGX MR_ENCLAVE<->MR_SIGNER pairs and TDX RTMR3/MRTD values, and verifies DCAP quotes by matching quote fields to the stored measurements.
```

```diff
-   Status: DELETED
    contract TEEVerifierProxy (eth:0x371a8bda9a34d641B546883D6B5895d0A44AD46A)
    +++ description: The TEEVerifierProxy contract is used to verify L2 batches using TEE attestations. It delegates proof verification to the dcapAttestationRouter contract. 
```

```diff
-   Status: DELETED
    contract DaimoP256Verifier (eth:0x783377992FCA09009eaD952D4fBa6519e25726b4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TEEVerifierProxyOwner (eth:0x79241BbE3646d8405849Cbe8608e77b82c402892)
    +++ description: None
```

```diff
    contract L1ETHBridge (eth:0x922248Db4A99bB542539ae7165FB9D7A546FB9F1) {
    +++ description: None
      template:
-        "jovay/L1ETHBridge"
      sourceHashes:
-        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xc962a92e7061cd67db98262fe8c93bb63cb5243ffa419d7a0de0fbb11ca67ed2"]
      description:
-        "The L1ETHBridge contract is used to bridge ETH between the L1 and L2."
      values.$implementation:
-        "eth:0x376df788aFc6E801b24fC6C0fa6b53637A947ae7"
+        "eth:0xE62F50E68962B14335C05BAd0C9A51BdCDd69426"
      values.$pastUpgrades.2:
+        ["2025-11-12T02:57:11.000Z","0xbd36b0a53a0e90ad375cedde02a1ebac51ee6072977219054abeb3600a91e540",["eth:0xE62F50E68962B14335C05BAd0C9A51BdCDd69426"]]
      values.$upgradeCount:
-        2
+        3
      values.balance:
-        "638941800666000000"
      values.mailBox:
-        "eth:0x9869A90FDAc287519E48aff4cCE329907a995162"
      values.owner:
-        "eth:0xA1e7758a84B40Ba7AA1a80b3D3096E918A7950bB"
      values.paused:
-        false
      values.toBridge:
-        "eth:0xb220D17A11bd2d11e3f57a305FF5b481C81B1028"
      implementationNames.eth:0x376df788aFc6E801b24fC6C0fa6b53637A947ae7:
-        "L1ETHBridge"
      implementationNames.eth:0xE62F50E68962B14335C05BAd0C9A51BdCDd69426:
+        ""
      category:
-        {"name":"Canonical Bridges","priority":2}
      unverified:
+        true
    }
```

```diff
-   Status: DELETED
    contract TEECacheVerifier (eth:0x9734CcA9304A4c7a5a27bCFac9eDa23e09cBAaF2)
    +++ description: A cache-enabled P-256 ECDSA verifier for Intel SGX/TDX DCAP quotes (v3/v4/v5) that authenticates local attestation data, extracts the 32-byte commitment, and lets the owner/authorized callers initialize, manage, and reuse cached attestation keys to skip repeat verifications.
```

```diff
-   Status: DELETED
    contract L1Mailbox (eth:0x9869A90FDAc287519E48aff4cCE329907a995162)
    +++ description: The L1Mailbox contract is used to send messages to the L2.
```

```diff
-   Status: DELETED
    contract AutomataDcapAttestationFee (eth:0xb3a96165caf30F8F7cE9BCfdaaAe99BA93C1A6F9)
    +++ description: Contract used to charge a configurable basis-point fee to verify Intel DCAP quotes. Currently set to 0 basis points.
```

```diff
-   Status: DELETED
    contract Rollup (eth:0xe0a28B8918a62edB825055221a1dF12c7C81Bac1)
    +++ description: The Rollup contract is used to submit and verify L2 batches.
```

```diff
    contract  (eth:0xe2f33Bd70B301F53f61CB7b22D852bC8e3D95E2b) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"upgrade","from":"eth:0x9869A90FDAc287519E48aff4cCE329907a995162","role":"admin"}
      receivedPermissions.2:
-        {"permission":"upgrade","from":"eth:0xe0a28B8918a62edB825055221a1dF12c7C81Bac1","role":"admin"}
    }
```

```diff
-   Status: DELETED
    contract  (eth:0xf2A2Bee383C2e4d75d9aE5953b3A6cFABb661a47)
    +++ description: None
```

## Source code changes

```diff
.../AutomataDcapAttestationFee.sol => /dev/null    |  554 -----
 .../DaimoP256Verifier.sol => /dev/null             |  394 ----
 .../DcapAttestationRouter.sol => /dev/null         | 1909 ----------------
 .../L1ETHBridge/L1ETHBridge.sol => /dev/null       |  778 -------
 .../L1Mailbox/L1Mailbox.sol => /dev/null           | 2383 --------------------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  729 ------
 .../MeasurementDao.sol => /dev/null                |  786 -------
 .../Rollup/Rollup.sol => /dev/null                 | 1100 ---------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  729 ------
 .../TEECacheVerifier.sol => /dev/null              | 2046 -----------------
 .../TEEVerifierProxy.sol => /dev/null              |  328 ---
 11 files changed, 11736 deletions(-)
```

Generated with discovered.json: 0x41a76040fff30e00f181e743f243334ffaeed80c

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
