Generated with discovered.json: 0x87ffc56196062cb9887933803e60cdd0db6cdbf4

# Diff at Tue, 09 Jun 2026 12:43:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1762443722
- current timestamp: 1762443722

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1762443722 (main branch discovery), not current.

```diff
    EOA  (eth:0xA217ee134CB95B1ab56eF83a33956E5A979bf6e7) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to commit transactions from the current layer to the host chain."
      receivedPermissions.0.permission:
-        "propose"
+        "interact"
      receivedPermissions.1.description:
+        "Allowed to post new state roots of the current layer to the host chain."
      receivedPermissions.1.permission:
-        "sequence"
+        "interact"
    }
```

```diff
    EOA  (eth:0xAe13Ce4Cd416cb4598865aa5aC8d13532bd3Cd99) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to commit transactions from the current layer to the host chain."
      receivedPermissions.0.permission:
-        "propose"
+        "interact"
      receivedPermissions.1.description:
+        "Allowed to post new state roots of the current layer to the host chain."
      receivedPermissions.1.permission:
-        "sequence"
+        "interact"
    }
```

Generated with discovered.json: 0xe6e553e99a21c7cb259651f637f486b00e9e6f5d

# Diff at Fri, 08 May 2026 07:51:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1762443722
- current timestamp: 1762443722

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1762443722 (main branch discovery), not current.

```diff
    contract DcapAttestationRouter (eth:0x238f4DaFC22013a864f85a54E276aC99975566fA) [jovay/DcapAttestationRouter] {
    +++ description: The DcapAttestationRouter contract is used for routing and verifying Intel SGX/TDX DCAP attestation proofs. The contract sends each quote to the corresponding verification path (cache verifier vs. Automata DCAP contract, and SGX vs. TDX measurement checks).
      sourceHashes.0:
-        "0x72685fb6903e0fdf30c628dc03d9edfcb4e4b3d794608041b6067813534ece90"
+        "0xdb0d0c431d1fee41dc61fd21d552f96dd689cfdeffa7bbf899a97fbb3f9aee15"
    }
```

```diff
    contract MeasurementDao (eth:0x359437E2763e9622DD4324D7904BbF7516332D4F) [jovay/MeasurementDao] {
    +++ description: The MeasurementDao contract is an onchain registry that allowlists SGX MR_ENCLAVE<->MR_SIGNER pairs and TDX RTMR3/MRTD values, and verifies DCAP quotes by matching quote fields to the stored measurements.
      sourceHashes.0:
-        "0x07b7f6602924af994b2f11cc4afd891109497ecc6a4778d3566d7fa5f661c91f"
+        "0x5f691d56c69dd42a2593f69fdd57348662acb00882bd090a084a960f92ff4167"
    }
```

```diff
    contract TEEVerifierProxy (eth:0x371a8bda9a34d641B546883D6B5895d0A44AD46A) [jovay/TEEVerifierProxy] {
    +++ description: The TEEVerifierProxy contract is used to verify L2 batches using TEE attestations. It delegates proof verification to the dcapAttestationRouter contract. 
      sourceHashes.0:
-        "0x80454675a5da4224889198f682aa88832ceb0090238ea70781541ca71781e547"
+        "0x016dead35ada83cde9a7f93c29121ce47681e47cb2cd799efc25022a92677655"
    }
```

```diff
    contract L1ETHBridge (eth:0x922248Db4A99bB542539ae7165FB9D7A546FB9F1) [jovay/L1ETHBridge] {
    +++ description: The L1ETHBridge contract is used to bridge ETH between the L1 and L2.
      sourceHashes.1:
-        "0xc962a92e7061cd67db98262fe8c93bb63cb5243ffa419d7a0de0fbb11ca67ed2"
+        "0x999eea41e760c1104d77283157a23af3dd92ddbf79143aa0e9cac6b62bf3728c"
    }
```

```diff
    contract TEECacheVerifier (eth:0x9734CcA9304A4c7a5a27bCFac9eDa23e09cBAaF2) [jovay/TEECacheVerifier] {
    +++ description: A cache-enabled P-256 ECDSA verifier for Intel SGX/TDX DCAP quotes (v3/v4/v5) that authenticates local attestation data, extracts the 32-byte commitment, and lets the owner/authorized callers initialize, manage, and reuse cached attestation keys to skip repeat verifications.
      sourceHashes.0:
-        "0x83e211bc7cab27dfd4f9b534866214075fc19cc7ab8fa549535f3373c27dcd4f"
+        "0xc959736cef221601b95fbf522fae099d638a06d02801db82987c2f2780edf1de"
    }
```

```diff
    contract L1Mailbox (eth:0x9869A90FDAc287519E48aff4cCE329907a995162) [jovay/L1Mailbox] {
    +++ description: The L1Mailbox contract is used to send messages to the L2.
      sourceHashes.1:
-        "0x1afeeca3afb0add55ce45f9bed97c7faa33f9e7a59e5b8a43ce5da15d1cfc0f0"
+        "0xc2370021389922ce05e38cd7574c68e85717da9998d7bbca98ea3fafef50ec84"
    }
```

```diff
    contract AutomataDcapAttestationFee (eth:0xb3a96165caf30F8F7cE9BCfdaaAe99BA93C1A6F9) [jovay/AutomataDcapAttestationFee] {
    +++ description: Contract used to charge a configurable basis-point fee to verify Intel DCAP quotes. Currently set to 0 basis points.
      sourceHashes.0:
-        "0x78e36d40e4a3b55ce9e4abfe59503bdd40cf6648a024f8228d80c8acae540f95"
+        "0xf3f27ad5242107c0a8d3f091ee68d095444a9039e63f7ad5918d65ceaa32596b"
    }
```

```diff
    contract Rollup (eth:0xe0a28B8918a62edB825055221a1dF12c7C81Bac1) [jovay/Rollup] {
    +++ description: The Rollup contract is used to submit and verify L2 batches.
      sourceHashes.1:
-        "0x847ae7ac442ea5bc5906a79d4ecf73fd4c3b9a115b93d29d5053f76459dace60"
+        "0x5c808860b3d5e90c1028449c6c9e67bf022636cfc5728a92c4b23557b8a4f0e0"
    }
```

Generated with discovered.json: 0x5cab503cbf1eaf27f67eb9c2bb1def21f08d0cfd

# Diff at Tue, 05 May 2026 10:22:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1762443722
- current timestamp: 1762443722

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1762443722 (main branch discovery), not current.

```diff
    contract DcapAttestationRouter (eth:0x238f4DaFC22013a864f85a54E276aC99975566fA) {
    +++ description: The DcapAttestationRouter contract is used for routing and verifying Intel SGX/TDX DCAP attestation proofs. The contract sends each quote to the corresponding verification path (cache verifier vs. Automata DCAP contract, and SGX vs. TDX measurement checks).
      deployerAddress:
+        "eth:0xA1e7758a84B40Ba7AA1a80b3D3096E918A7950bB"
    }
```

```diff
    contract MeasurementDao (eth:0x359437E2763e9622DD4324D7904BbF7516332D4F) {
    +++ description: The MeasurementDao contract is an onchain registry that allowlists SGX MR_ENCLAVE<->MR_SIGNER pairs and TDX RTMR3/MRTD values, and verifies DCAP quotes by matching quote fields to the stored measurements.
      deployerAddress:
+        "eth:0xA1e7758a84B40Ba7AA1a80b3D3096E918A7950bB"
    }
```

```diff
    contract TEEVerifierProxy (eth:0x371a8bda9a34d641B546883D6B5895d0A44AD46A) {
    +++ description: The TEEVerifierProxy contract is used to verify L2 batches using TEE attestations. It delegates proof verification to the dcapAttestationRouter contract. 
      deployerAddress:
+        "eth:0xA1e7758a84B40Ba7AA1a80b3D3096E918A7950bB"
    }
```

```diff
    contract DaimoP256Verifier (eth:0x783377992FCA09009eaD952D4fBa6519e25726b4) {
    +++ description: None
      deployerAddress:
+        "eth:0xA1e7758a84B40Ba7AA1a80b3D3096E918A7950bB"
    }
```

```diff
    contract TEEVerifierProxyOwner (eth:0x79241BbE3646d8405849Cbe8608e77b82c402892) {
    +++ description: None
      deployerAddress:
+        "eth:0xa3627912a8C36100670d57fCb4324Cd81242b2a3"
    }
```

```diff
    contract L1ETHBridge (eth:0x922248Db4A99bB542539ae7165FB9D7A546FB9F1) {
    +++ description: The L1ETHBridge contract is used to bridge ETH between the L1 and L2.
      deployerAddress:
+        "eth:0xA1e7758a84B40Ba7AA1a80b3D3096E918A7950bB"
    }
```

```diff
    contract TEECacheVerifier (eth:0x9734CcA9304A4c7a5a27bCFac9eDa23e09cBAaF2) {
    +++ description: A cache-enabled P-256 ECDSA verifier for Intel SGX/TDX DCAP quotes (v3/v4/v5) that authenticates local attestation data, extracts the 32-byte commitment, and lets the owner/authorized callers initialize, manage, and reuse cached attestation keys to skip repeat verifications.
      deployerAddress:
+        "eth:0xA1e7758a84B40Ba7AA1a80b3D3096E918A7950bB"
    }
```

```diff
    contract L1Mailbox (eth:0x9869A90FDAc287519E48aff4cCE329907a995162) {
    +++ description: The L1Mailbox contract is used to send messages to the L2.
      deployerAddress:
+        "eth:0xA1e7758a84B40Ba7AA1a80b3D3096E918A7950bB"
    }
```

```diff
    contract AutomataDcapAttestationFee (eth:0xb3a96165caf30F8F7cE9BCfdaaAe99BA93C1A6F9) {
    +++ description: Contract used to charge a configurable basis-point fee to verify Intel DCAP quotes. Currently set to 0 basis points.
      deployerAddress:
+        "eth:0xA1e7758a84B40Ba7AA1a80b3D3096E918A7950bB"
    }
```

```diff
    contract Rollup (eth:0xe0a28B8918a62edB825055221a1dF12c7C81Bac1) {
    +++ description: The Rollup contract is used to submit and verify L2 batches.
      deployerAddress:
+        "eth:0xA1e7758a84B40Ba7AA1a80b3D3096E918A7950bB"
    }
```

```diff
    contract ProxyAdmin (eth:0xe2f33Bd70B301F53f61CB7b22D852bC8e3D95E2b) {
    +++ description: None
      name:
-        ""
+        "ProxyAdmin"
      unverified:
-        true
      receivedPermissions:
-        [{"permission":"upgrade","from":"eth:0x922248Db4A99bB542539ae7165FB9D7A546FB9F1","role":"admin"},{"permission":"upgrade","from":"eth:0x9869A90FDAc287519E48aff4cCE329907a995162","role":"admin"},{"permission":"upgrade","from":"eth:0xe0a28B8918a62edB825055221a1dF12c7C81Bac1","role":"admin"}]
      values.owner:
+        "eth:0x4815b8773E6686d0b6Ee16191Aef1ae6c50d6B77"
      implementationNames.eth:0xe2f33Bd70B301F53f61CB7b22D852bC8e3D95E2b:
-        ""
+        "ProxyAdmin"
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x922248Db4A99bB542539ae7165FB9D7A546FB9F1","role":"admin"},{"permission":"upgrade","from":"eth:0x9869A90FDAc287519E48aff4cCE329907a995162","role":"admin"},{"permission":"upgrade","from":"eth:0xe0a28B8918a62edB825055221a1dF12c7C81Bac1","role":"admin"}]
      deployerAddress:
+        "eth:0xA1e7758a84B40Ba7AA1a80b3D3096E918A7950bB"
    }
```

```diff
    contract  (eth:0xf2A2Bee383C2e4d75d9aE5953b3A6cFABb661a47) {
    +++ description: None
      deployerAddress:
+        "eth:0xa3627912a8C36100670d57fCb4324Cd81242b2a3"
    }
```

```diff
+   Status: CREATED
    contract  (eth:0x4815b8773E6686d0b6Ee16191Aef1ae6c50d6B77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x83088c8Dd196a83f43140ddBD7B4727bD1d43AD4)
    +++ description: None
```

Generated with discovered.json: 0x4bc01823401e1c0f1a7d3a8f56a1afd00e5d115a

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
