Generated with discovered.json: 0xb4c2e2ca4fa6219d510415bfc0f6ea329ea208dd

# Diff at Thu, 23 Jul 2026 14:09:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@efd03446560a8d585747f124c71622cbfa33fca4 block: 1783927795
- current timestamp: 1784815701

## Description

The Safe signer set changed from 2-of-3 to 3-of-5, removing two signers and adding four.

## Watched changes

```diff
-   Status: DELETED
    EOA  (eth:0x4202860Fa6afAF3e2977cD139Ac693a05e4f9450)
    +++ description: None
```

```diff
    contract Safe (eth:0x69E55790880d0ABa56E48Ee1f7fc3834b0F5c223) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0x5e4f2616AA570d60EC6D7BBF08D070fb81353553"
      values.$members.1:
+        "eth:0x1E3eafD783D47c36dC5CD529721E6cc16456Cc0F"
      values.$members.1:
-        "eth:0x7df0Fe803832BB3Ca8906a6e49968C2421C1aE9B"
+        "eth:0x0BBc1d7ceB10a0a00dD3aeBcA37e85D60d4a1103"
      values.$members.2:
-        "eth:0x4202860Fa6afAF3e2977cD139Ac693a05e4f9450"
+        "eth:0xFa4902732675Ee16a508487E4fDcb910fFb00A20"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xabfdb4e50f19d35c07b5b6d3642cd689e8a492c9

# Diff at Mon, 13 Jul 2026 09:17:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c168d01f86d16067de2977156e2af7e763a31d0d block: 1783513792
- current timestamp: 1783927795

## Description

Introduces KMS signer set rotation on Ethereum and the Gateway: each signer set is called a context and is valid and retains all permissions until specifically invalidated ('destroyed'). HCULimit adds per-transaction and per-block caps plus a bypass whitelist.

## Watched changes

```diff
    contract HCULimit (eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2) [zama/ZamaHCULimit_v0_2_0] {
    +++ description: Tracks and enforces per-transaction and per-block homomorphic computation unit limits for FHEVM operation requests.
      template:
-        "zama/ZamaHCULimit"
+        "zama/ZamaHCULimit_v0_2_0"
      sourceHashes.1:
-        "0xb4b32e3ee98a51750d9ec0af3a9c599dbb6e097cdf4f55f37e198a75f0f2e5eb"
+        "0xc52e1b93c97602e6da1f1925e14fc5454426a778875655ec17910be5e217b98e"
      description:
-        "Tracks and enforces homomorphic computation unit limits for FHEVM operation requests."
+        "Tracks and enforces per-transaction and per-block homomorphic computation unit limits for FHEVM operation requests."
      values.$implementation:
-        "eth:0x4E4329F10f7EE88a5dDB13716B8bE00c077CBeb6"
+        "eth:0x0F2B7e8F19ADc874F21e27ADAA4B22FC00a0B442"
      values.$pastUpgrades.2:
+        ["2026-07-10T08:34:11.000Z","0xec2212fb2d35b72388507e5fe9c218c97512b943b5f28cedbfba35b7ac9bd224",["eth:0x0F2B7e8F19ADc874F21e27ADAA4B22FC00a0B442"]]
      values.$upgradeCount:
-        2
+        3
      values.getVersion:
-        "HCULimit v0.1.0"
+        "HCULimit v0.2.0"
+++ description: Callers that bypass the global per-block HCU cap, reconstructed from whitelist events.
+++ severity: HIGH
      values.blockHCUWhitelist:
+        []
+++ description: Maximum HCU consumed by non-whitelisted callers in one block.
+++ severity: HIGH
      values.getGlobalHCUCapPerBlock:
+        281474976710655
+++ description: Maximum sequential HCU depth allowed in one transaction.
+++ severity: HIGH
      values.getMaxHCUDepthPerTx:
+        5000000
+++ description: Maximum total HCU allowed in one transaction.
+++ severity: HIGH
      values.getMaxHCUPerTx:
+        20000000
      fieldMeta.getGlobalHCUCapPerBlock:
+        {"severity":"HIGH","description":"Maximum HCU consumed by non-whitelisted callers in one block.","type":"RISK_PARAMETER"}
      fieldMeta.getMaxHCUDepthPerTx:
+        {"severity":"HIGH","description":"Maximum sequential HCU depth allowed in one transaction.","type":"RISK_PARAMETER"}
      fieldMeta.getMaxHCUPerTx:
+        {"severity":"HIGH","description":"Maximum total HCU allowed in one transaction.","type":"RISK_PARAMETER"}
      fieldMeta.blockHCUWhitelist:
+        {"severity":"HIGH","description":"Callers that bypass the global per-block HCU cap, reconstructed from whitelist events.","type":"PERMISSION"}
      fieldMeta.getBlockMeter:
+        {"description":"HCU consumed by non-whitelisted callers in the current block."}
      implementationNames.eth:0x4E4329F10f7EE88a5dDB13716B8bE00c077CBeb6:
-        "HCULimit"
      implementationNames.eth:0x0F2B7e8F19ADc874F21e27ADAA4B22FC00a0B442:
+        "HCULimit"
    }
```

```diff
    contract KMSVerifier (eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03) [zama/ZamaKMSVerifier_v0_2_0] {
    +++ description: Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers accept a decrypted value when it is signed by the threshold of the current or any retained non-destroyed KMS context.
      template:
-        "zama/ZamaKMSVerifier"
+        "zama/ZamaKMSVerifier_v0_2_0"
      sourceHashes.1:
-        "0xe6773e8f1549070f8e0fcae01d4bcf98332a43c1b6f2d4eca1a108295c327d8e"
+        "0xa40292fe461810a065f80e305f6b85ab3ca2cfd416dc965d4791a111554cf638"
      description:
-        "Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers use it before accepting decrypted values."
+        "Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers accept a decrypted value when it is signed by the threshold of the current or any retained non-destroyed KMS context."
      values.$implementation:
-        "eth:0x8210A6c69FAc2e9856C7a19Ee70b26cFa3A4F0E2"
+        "eth:0xd0d0C7E1bc1E2F6Cd00E3b4B1083DdD9969155FD"
      values.$pastUpgrades.2:
+        ["2026-07-10T08:34:11.000Z","0xec2212fb2d35b72388507e5fe9c218c97512b943b5f28cedbfba35b7ac9bd224",["eth:0xd0d0C7E1bc1E2F6Cd00E3b4B1083DdD9969155FD"]]
      values.$upgradeCount:
-        2
+        3
      values.getVersion:
-        "KMSVerifier v0.1.0"
+        "KMSVerifier v0.2.0"
+++ description: Non-destroyed KMS contexts created after the v0.2 migration, reconstructed from context creation and destruction events. Each context is an immutable signer and threshold snapshot that can attest results for any ciphertext handle; it is not scoped to ciphertext age or key ID.
+++ severity: HIGH
      values.createdKmsContexts:
+        []
+++ description: Identifier of the context used when proof extraData is empty or starts with version 0. Version 1 extraData can explicitly select any non-destroyed historical context, including for ciphertexts created after that context was superseded.
+++ severity: HIGH
      values.getCurrentKmsContextId:
+        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
+++ description: Identifier of the first v0.2 KMS context created from the source-defined context counter during initialization or migration.
+++ severity: HIGH
      values.initialKmsContextId:
+        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
+++ description: Signers in the first v0.2 KMS context. This code-defined context remains authorized for public decryption proofs after later rotations unless the ACL owner explicitly destroys it.
+++ severity: HIGH
      values.initialKmsContextSigners:
+        ["eth:0xe9f7ecfF21a2e0Ca58eA26ae869FEF38ab49ed6f","eth:0xdC472efa1642D5afB684aAaa546E22FB24AAB965","eth:0xbf05c17BEB0BF2F2c78Cd491A53a148e035279C3","eth:0x915055c5F05C0d88BCdf1e3DfBA18aBD2a18350f","eth:0x41b19EB4585450db79ac03ba9503106EC7895905","eth:0x6e5f02Cd4B33f0Cf4ED5326ac9eE25e5aA8c4921","eth:0x966188a1f697F6A1B5cfA51495DD8A8A7b5CdB8D","eth:0x5d0e7033774dD43eE546D49b72Bd0B561E52f7C8","eth:0xDFc9Dcb3D206AA164770874f36a4B5AD2EE5194f","eth:0x7C5Eeb4D8CED0101799B8Cc212eE874097364F58","eth:0x7C17BE232e5968BDa9516478B798b9E90D013fCC","eth:0x6016DCA5e91e62826e3FEA1Fb0a763602dc1E385","eth:0xB7978e602D2AF68258dA614AF949E014BF0DE0eb"]
      fieldMeta.aclOwner.description:
-        "Owner of the Zama ACL contract. This account is authorized by onlyACLOwner to rotate the KMS signer set and threshold."
+        "Owner of the Zama ACL contract. This account can create a new KMS signer context that immediately becomes the default verifier authority, and can destroy any non-current context."
      fieldMeta.getKmsSigners.description:
-        "KMS signers accepted by KMSVerifier. The threshold number of these signers must sign public decryption results for the Gateway Decryption EIP-712 domain before wrappers accept the decrypted values."
+        "KMS signers in the current context. Permission coverage is also indexed through initialKmsContextSigners and createdKmsContexts so superseded contexts remain visible."
      fieldMeta.getThreshold.description:
-        "Minimum number of configured KMS signer signatures required to accept a public decryption result."
+        "Minimum number of KMS signatures from the current context required to accept a public decryption result. Retained contexts keep their own immutable thresholds."
      fieldMeta.initialKmsContextId:
+        {"severity":"HIGH","description":"Identifier of the first v0.2 KMS context created from the source-defined context counter during initialization or migration.","type":"RISK_PARAMETER"}
      fieldMeta.initialKmsContextSigners:
+        {"severity":"HIGH","description":"Signers in the first v0.2 KMS context. This code-defined context remains authorized for public decryption proofs after later rotations unless the ACL owner explicitly destroys it.","type":"PERMISSION"}
      fieldMeta.createdKmsContexts:
+        {"severity":"HIGH","description":"Non-destroyed KMS contexts created after the v0.2 migration, reconstructed from context creation and destruction events. Each context is an immutable signer and threshold snapshot that can attest results for any ciphertext handle; it is not scoped to ciphertext age or key ID.","type":"PERMISSION"}
      fieldMeta.getCurrentKmsContextId:
+        {"severity":"HIGH","description":"Identifier of the context used when proof extraData is empty or starts with version 0. Version 1 extraData can explicitly select any non-destroyed historical context, including for ciphertexts created after that context was superseded.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x8210A6c69FAc2e9856C7a19Ee70b26cFa3A4F0E2:
-        "KMSVerifier"
      implementationNames.eth:0xd0d0C7E1bc1E2F6Cd00E3b4B1083DdD9969155FD:
+        "KMSVerifier"
    }
```

```diff
    contract DAO (eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3) [zama/ZamaDAO] {
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
      directlyReceivedPermissions.0:
+        {"permission":"interact","from":"eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2","description":"change the per-block and per-transaction HCU limits and manage callers that bypass the per-block limit.","role":".aclOwner"}
      directlyReceivedPermissions.4.description:
-        "set the KMS signer set and signature threshold used for public decryption verification."
+        "create KMS signer contexts with arbitrary signer sets and thresholds, and destroy non-current contexts. A malicious context can attest an inflated unwrap amount and drain pooled wrapper backing."
      directlyReceivedPermissions.14.description:
-        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and update Zama verifier signer sets and thresholds."
+        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and create or destroy KMSVerifier signer contexts."
    }
```

```diff
    contract ZamaGovMultisigB (eth:0xBc860b6a4C860C5424B84A056E53ACFb2C99a38F) [zama/Multisig] {
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2","description":"change the per-block and per-transaction HCU limits and manage callers that bypass the per-block limit.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.4.description:
-        "set the KMS signer set and signature threshold used for public decryption verification."
+        "create KMS signer contexts with arbitrary signer sets and thresholds, and destroy non-current contexts. A malicious context can attest an inflated unwrap amount and drain pooled wrapper backing."
      receivedPermissions.16.description:
-        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and update Zama verifier signer sets and thresholds."
+        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and create or destroy KMSVerifier signer contexts."
    }
```

```diff
    contract ACL (eth:0xcA2E8f1F656CD25C01F05d0b243Ab1ecd4a8ffb6) [zama/ZamaACL_v0_3_0] {
    +++ description: Ethereum host-chain access-control registry for encrypted handles, storing handle allowances and delegation state for ciphertext references. Its public-decryption and user-delegation events are mirrored into the Gateway MultichainACL by coprocessor consensus.
      template:
-        "zama/ZamaACL"
+        "zama/ZamaACL_v0_3_0"
      sourceHashes.1:
-        "0x5f835dee1c2a2676dc34ff636b1df73f1fe8b58073069d0a8df7687cd834f35f"
+        "0x47f47986a3024b31fa3caee357720f4fba4ea3fae419ff53eebe1a66e87d69ef"
      values.$implementation:
-        "eth:0x96B171e4f8eCda0FFdD128b319Fa185b14f99D76"
+        "eth:0x3F6D970d30E1FFE9657aa8072C82dA10eef1c3D6"
      values.$pastUpgrades.3:
+        ["2026-07-10T08:34:11.000Z","0xec2212fb2d35b72388507e5fe9c218c97512b943b5f28cedbfba35b7ac9bd224",["eth:0x3F6D970d30E1FFE9657aa8072C82dA10eef1c3D6"]]
      values.$upgradeCount:
-        3
+        4
      values.getVersion:
-        "ACL v0.2.0"
+        "ACL v0.3.0"
      implementationNames.eth:0x96B171e4f8eCda0FFdD128b319Fa185b14f99D76:
-        "ACL"
      implementationNames.eth:0x3F6D970d30E1FFE9657aa8072C82dA10eef1c3D6:
+        "ACL"
    }
```

```diff
    contract FHEVMExecutor (eth:0xD82385dADa1ae3E969447f20A3164F6213100e75) [zama/ZamaFHEVMExecutor_v0_3_0] {
    +++ description: FHEVM executor that accepts encrypted operation requests, accounts for computation usage, and stores ciphertext handles for operation results.
      template:
-        "zama/ZamaFHEVMExecutor"
+        "zama/ZamaFHEVMExecutor_v0_3_0"
      sourceHashes.1:
-        "0xc3b56811670be45b7f1aac864be6855e3875c8e449c2fe3cbb540143f0dacddb"
+        "0xf475718e9125acfc2f69d3c9cca8cedb9a15c644da7490f7f5fe0ae2690a77cc"
      values.$implementation:
-        "eth:0xde3624dA8d9c45B57674cA0AcAC40630682211bb"
+        "eth:0xC38aAfCBB73Fd4bd6f995275079C4Add9C1687E5"
      values.$pastUpgrades.3:
+        ["2026-07-10T08:34:11.000Z","0xec2212fb2d35b72388507e5fe9c218c97512b943b5f28cedbfba35b7ac9bd224",["eth:0xC38aAfCBB73Fd4bd6f995275079C4Add9C1687E5"]]
      values.$upgradeCount:
-        3
+        4
      values.getVersion:
-        "FHEVMExecutor v0.2.0"
+        "FHEVMExecutor v0.3.0"
      fieldMeta.getHCULimitAddress.description:
-        "HCULimit contract used to account for homomorphic computation units consumed by encrypted operations."
+        "HCULimit contract used to account for homomorphic computation units consumed by encrypted operations for the original external caller."
      fieldMeta.getHandleVersion.description:
-        "Current ciphertext handle version emitted by the executor."
+        "Current ciphertext handle version emitted by the executor. Version 1 result handles include operation-specific domain separation and block context in their derivation."
      implementationNames.eth:0xde3624dA8d9c45B57674cA0AcAC40630682211bb:
-        "FHEVMExecutor"
      implementationNames.eth:0xC38aAfCBB73Fd4bd6f995275079C4Add9C1687E5:
+        "FHEVMExecutor"
    }
```

```diff
    contract ZamaGovMultisigA (eth:0xE43c73aAb2b6aBBad6d0461997ce1cfea5ABe66f) [zama/Multisig] {
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2","description":"change the per-block and per-transaction HCU limits and manage callers that bypass the per-block limit.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.4.description:
-        "set the KMS signer set and signature threshold used for public decryption verification."
+        "create KMS signer contexts with arbitrary signer sets and thresholds, and destroy non-current contexts. A malicious context can attest an inflated unwrap amount and drain pooled wrapper backing."
      receivedPermissions.16.description:
-        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and update Zama verifier signer sets and thresholds."
+        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and create or destroy KMSVerifier signer contexts."
    }
```

```diff
    contract Decryption (zama:0x0f6024a97684f7d90ddb0fAAD79cB15F2C888D24) [zama/Decryption_v0_4_0] {
    +++ description: Gateway contract that orchestrates public and user decryption requests and checks committed ciphertext material. Each response independently selects a KMS context through extraData, or uses the context current when the response executes; requests do not store a context. KMS nodes enforce host-chain ACL state offchain, and Ethereum KMSVerifier verifies public results against this contract's EIP-712 domain.
      template:
-        "zama/Decryption"
+        "zama/Decryption_v0_4_0"
      sourceHashes.1:
-        "0xd2e9269a1dc3580af2eaa84178722c052767a5d174734ececeddeea5bacd1929"
+        "0xcd821ac822a19a355acde1dd7ce435e2a6e16e21017756b899c058ee64552e28"
      description:
-        "Gateway contract that orchestrates public and user decryption requests, checks mirrored host-chain ACL state, collects KMS responses, and emits results once the configured KMS threshold is reached. Ethereum KMSVerifier verifies public decryption results against this contract's EIP-712 domain."
+        "Gateway contract that orchestrates public and user decryption requests and checks committed ciphertext material. Each response independently selects a KMS context through extraData, or uses the context current when the response executes; requests do not store a context. KMS nodes enforce host-chain ACL state offchain, and Ethereum KMSVerifier verifies public results against this contract's EIP-712 domain."
      values.$implementation:
-        "zama:0xe691cE3d7a71E2eC9E96AF5bdD263FfEB124F8dE"
+        "zama:0x943CEfD1A00d3ae5b298bB10D4EddA09B279C8B0"
      values.$pastUpgrades.3:
+        ["2026-07-10T08:15:40.000Z","0x5d63d8d9bf4790e7169cd1d6c440262aad29368190932f823377df311f389217",["zama:0x943CEfD1A00d3ae5b298bB10D4EddA09B279C8B0"]]
      values.$upgradeCount:
-        3
+        4
      values.getVersion:
-        "Decryption v0.3.0"
+        "Decryption v0.4.0"
+++ description: Current GatewayConfig KMS context used by responses whose extraData is empty or starts with version 0. Requests do not bind this value, so a rotation can change the context used to answer an already pending request.
+++ severity: HIGH
      values.gatewayKmsContextId:
+        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
      fieldMeta.gatewayMultichainACL.description:
-        "MultichainACL contract containing the gateway-side ACL mirror checked before public or user decryptions are accepted."
+        "MultichainACL contract containing the gateway-side host-chain ACL mirror. The upgraded Decryption contract no longer checks it onchain and relies on KMS nodes to enforce ACL state."
      fieldMeta.gatewayKmsTxSenders.description:
-        "KMS transaction-sender addresses configured in GatewayConfig. These accounts may submit signed public decryption results and user decryption shares."
+        "KMS transaction-sender addresses configured in the current GatewayConfig context. Historical context senders can also submit responses when response extraData explicitly selects their retained context. Post-migration contexts are indexed on GatewayConfig; migration-created membership requires a project override because no creation event was emitted."
      fieldMeta.gatewayKmsSigners.description:
-        "KMS signer addresses configured in GatewayConfig. Their EIP-712 signatures determine whether public decryption results and user decryption shares reach threshold."
+        "KMS signer addresses configured in the current GatewayConfig context. Historical context signers can also sign responses when response extraData explicitly selects their retained context. Post-migration contexts are indexed on GatewayConfig; migration-created membership requires a project override because no creation event was emitted."
      fieldMeta.gatewayPublicDecryptionThreshold.description:
-        "Minimum number of matching KMS signatures required before a public decryption result is emitted."
+        "Minimum matching-signature count for the current context. Public responses are grouped by a digest containing raw extraData; identical empty or version 0 extraData can accumulate responses across a context rotation while the last response selects the threshold checked."
      fieldMeta.gatewayUserDecryptionThreshold.description:
-        "Minimum number of KMS shares required before a user decryption request is considered threshold-reached."
+        "Minimum response count for the current context. User response counts are stored per request rather than per context, so valid shares submitted under different contexts can be combined and the last response selects the threshold checked."
      fieldMeta.gatewayKmsContextId:
+        {"severity":"HIGH","description":"Current GatewayConfig KMS context used by responses whose extraData is empty or starts with version 0. Requests do not bind this value, so a rotation can change the context used to answer an already pending request.","type":"RISK_PARAMETER"}
      implementationNames.zama:0xe691cE3d7a71E2eC9E96AF5bdD263FfEB124F8dE:
-        "Decryption"
      implementationNames.zama:0x943CEfD1A00d3ae5b298bB10D4EddA09B279C8B0:
+        "Decryption"
    }
```

```diff
    contract SafeL2 (zama:0x5f0F86BcEad6976711C9B131bCa5D30E767fe2bE) [GnosisSafe] {
    +++ description: Gateway owner Safe. Its LayerZero governance module is outside the Zama Gateway protocol surface covered here.
      receivedPermissions.5.description:
-        "update KMS, coprocessor, custodian, host-chain, and threshold configuration, transfer GatewayConfig ownership, and unpause gateway workflow contracts."
+        "create KMS contexts that immediately become current, update current thresholds and other gateway configuration, transfer ownership, and unpause gateway workflow contracts. Historical KMS contexts cannot be removed in this version."
    }
```

```diff
    contract GatewayConfig (zama:0xDE537Be194777A56f8B19d14079E6a78249390ab) [zama/GatewayConfig_v0_5_0] {
    +++ description: Central configuration contract for the Zama Gateway. A KMS context snapshots node transaction senders, signers, and workflow thresholds; historical contexts remain stored and selectable by Decryption because this version has no context-destruction function.
      template:
-        "zama/GatewayConfig"
+        "zama/GatewayConfig_v0_5_0"
      sourceHashes.1:
-        "0x40662103941fd76e1fc3b63e38f9036b39d3394d96fe2c46db9640bcbbc76d4b"
+        "0x1089121569189032b8cee0dae0c71eedecf7757f712a6d14ef684915093c6747"
      description:
-        "Central configuration contract for the Zama Gateway. It stores the KMS, coprocessor, custodian, host-chain, pauser, and consensus-threshold configuration used by the gateway workflow contracts."
+        "Central configuration contract for the Zama Gateway. A KMS context snapshots node transaction senders, signers, and workflow thresholds; historical contexts remain stored and selectable by Decryption because this version has no context-destruction function."
      values.$implementation:
-        "zama:0xDa97dfc327349F7C1333610C80cc20971eD0eb0f"
+        "zama:0x2294E3C211238Ae31E2824576CCd7f996CC7Dc00"
      values.$pastUpgrades.3:
+        ["2026-07-10T08:15:40.000Z","0x5d63d8d9bf4790e7169cd1d6c440262aad29368190932f823377df311f389217",["zama:0x2294E3C211238Ae31E2824576CCd7f996CC7Dc00"]]
      values.$upgradeCount:
-        3
+        4
      values.getPublicDecryptionThreshold:
-        7
      values.getUserDecryptionThreshold:
-        9
      values.getVersion:
-        "GatewayConfig v0.4.0"
+        "GatewayConfig v0.5.0"
+++ description: KMS contexts created after migration, reconstructed from UpdateKmsContext events with their node set and creation thresholds. Nodes remain authorized for Decryption indefinitely; later threshold-update events do not identify a context, so final historical thresholds must be read through context-specific getters or project overrides.
+++ severity: HIGH
      values.createdKmsContexts:
+        []
+++ description: KMS signers from contexts created after migration. They remain authorized for Decryption responses that select their context because GatewayConfig has no context-destruction function.
+++ severity: HIGH
      values.createdKmsContextSigners:
+        []
+++ description: KMS transaction senders from contexts created after migration. They remain authorized for Decryption responses that select their context because GatewayConfig has no context-destruction function.
+++ severity: HIGH
      values.createdKmsContextTxSenders:
+        []
+++ description: Identifier of the context used when a Decryption response has empty or version 0 extraData. Version 1 responses can explicitly select any historical context, and requests do not store or bind a context.
+++ severity: HIGH
      values.getCurrentKmsContextId:
+        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
+++ description: Minimum number of KMS signatures required for public decryption consensus in the current context.
+++ severity: HIGH
      values.getPublicDecryptionThresholdForContext:
+        7
+++ description: Minimum number of KMS shares required for user decryption consensus in the current context.
+++ severity: HIGH
      values.getUserDecryptionThresholdForContext:
+        9
      fieldMeta.owner.description:
-        "Owner of GatewayConfig. This account manages KMS nodes, coprocessors, custodians, host chains, consensus thresholds, ownership, and gateway unpausing."
+        "Owner of GatewayConfig. This account creates KMS contexts, changes the current context's thresholds, manages coprocessors, custodians and host chains, transfers ownership, and unpauses gateway contracts. A newly created context becomes current immediately, while all older contexts remain selectable by Decryption."
      fieldMeta.getKmsTxSenders.description:
-        "KMS transaction-sender addresses registered for this gateway. These accounts submit KMS responses to gateway contracts."
+        "KMS transaction-sender addresses in the current Gateway context. Historical context senders remain authorized for Decryption responses that explicitly select their context; post-migration contexts are indexed here and the migrated context is indexed on Decryption."
      fieldMeta.getKmsSigners.description:
-        "KMS signer addresses registered for this gateway. Thresholds over these signers secure public and user decryption, key generation, and CRS generation."
+        "KMS signer addresses in the current Gateway context. Historical context signers remain authorized for explicitly selected Decryption responses; post-migration contexts are indexed here and the migrated context is indexed on Decryption."
      fieldMeta.getMpcThreshold.description:
-        "MPC threshold for KMS key material generation."
+        "MPC threshold for KMS key material generation in the current context."
      fieldMeta.getPublicDecryptionThreshold:
-        {"severity":"HIGH","description":"Minimum number of KMS signatures required for public decryption consensus.","type":"RISK_PARAMETER"}
      fieldMeta.getUserDecryptionThreshold:
-        {"severity":"HIGH","description":"Minimum number of KMS shares required for user decryption consensus.","type":"RISK_PARAMETER"}
      fieldMeta.getKmsGenThreshold.description:
-        "Minimum number of KMS signatures required for key and CRS generation consensus."
+        "Minimum number of KMS signatures required for key and CRS generation consensus in the current context."
      fieldMeta.createdKmsContexts:
+        {"severity":"HIGH","description":"KMS contexts created after migration, reconstructed from UpdateKmsContext events with their node set and creation thresholds. Nodes remain authorized for Decryption indefinitely; later threshold-update events do not identify a context, so final historical thresholds must be read through context-specific getters or project overrides.","type":"RISK_PARAMETER"}
      fieldMeta.createdKmsContextTxSenders:
+        {"severity":"HIGH","description":"KMS transaction senders from contexts created after migration. They remain authorized for Decryption responses that select their context because GatewayConfig has no context-destruction function.","type":"PERMISSION"}
      fieldMeta.createdKmsContextSigners:
+        {"severity":"HIGH","description":"KMS signers from contexts created after migration. They remain authorized for Decryption responses that select their context because GatewayConfig has no context-destruction function.","type":"PERMISSION"}
      fieldMeta.getCurrentKmsContextId:
+        {"severity":"HIGH","description":"Identifier of the context used when a Decryption response has empty or version 0 extraData. Version 1 responses can explicitly select any historical context, and requests do not store or bind a context.","type":"RISK_PARAMETER"}
      fieldMeta.getPublicDecryptionThresholdForContext:
+        {"severity":"HIGH","description":"Minimum number of KMS signatures required for public decryption consensus in the current context.","type":"RISK_PARAMETER"}
      fieldMeta.getUserDecryptionThresholdForContext:
+        {"severity":"HIGH","description":"Minimum number of KMS shares required for user decryption consensus in the current context.","type":"RISK_PARAMETER"}
      implementationNames.zama:0xDa97dfc327349F7C1333610C80cc20971eD0eb0f:
-        "GatewayConfig"
      implementationNames.zama:0x2294E3C211238Ae31E2824576CCd7f996CC7Dc00:
+        "GatewayConfig"
    }
```

## Source code changes

```diff
.../{.flat@1783513792 => .flat}/ACL/ACL.sol        |   28 +-
 .../Decryption/Decryption.sol                      | 1115 +++++++--------
 .../FHEVMExecutor/FHEVMExecutor.sol                |  617 ++++++---
 .../GatewayConfig/GatewayConfig.sol                | 1434 ++++++++++----------
 .../HCULimit/HCULimit.sol                          |  507 +++++--
 .../KMSVerifier/KMSVerifier.sol                    |  287 +++-
 6 files changed, 2239 insertions(+), 1749 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1783513792 (main branch discovery), not current.

```diff
    contract KMSVerifier (eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03) [zama/ZamaKMSVerifier] {
    +++ description: Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers use it before accepting decrypted values.
+++ description: Immutable public-decryption threshold assigned to initialKmsContextId during the v0.2 migration. It remains security-critical after rotation while initialKmsContextSigners is non-empty; an empty signer list means the context was destroyed.
+++ severity: HIGH
      values.initialKmsContextThreshold:
+        7
      fieldMeta.initialKmsContextThreshold:
+        {"severity":"HIGH","description":"Immutable public-decryption threshold assigned to initialKmsContextId during the v0.2 migration. It remains security-critical after rotation while initialKmsContextSigners is non-empty; an empty signer list means the context was destroyed.","type":"RISK_PARAMETER"}
    }
```

```diff
    contract Decryption (zama:0x0f6024a97684f7d90ddb0fAAD79cB15F2C888D24) [zama/Decryption] {
    +++ description: Gateway contract that orchestrates public and user decryption requests, checks mirrored host-chain ACL state, collects KMS responses, and emits results once the configured KMS threshold is reached. Ethereum KMSVerifier verifies public decryption results against this contract's EIP-712 domain.
+++ description: Identifier assigned to the Gateway KMS context created by the v0.5 migration. Version 1 Decryption response metadata can continue to select it after later rotations.
+++ severity: HIGH
      values.initialMigratedKmsContextId:
+        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
+++ description: KMS signers in the Gateway context created by the v0.5 migration. Node membership is immutable and GatewayConfig cannot destroy contexts, so this signer set remains authorized for Decryption responses after future rotations.
+++ severity: HIGH
      values.initialMigratedKmsSigners:
+        ["zama:0xe9f7ecfF21a2e0Ca58eA26ae869FEF38ab49ed6f","zama:0xdC472efa1642D5afB684aAaa546E22FB24AAB965","zama:0xbf05c17BEB0BF2F2c78Cd491A53a148e035279C3","zama:0x915055c5F05C0d88BCdf1e3DfBA18aBD2a18350f","zama:0x41b19EB4585450db79ac03ba9503106EC7895905","zama:0x6e5f02Cd4B33f0Cf4ED5326ac9eE25e5aA8c4921","zama:0x966188a1f697F6A1B5cfA51495DD8A8A7b5CdB8D","zama:0x5d0e7033774dD43eE546D49b72Bd0B561E52f7C8","zama:0xDFc9Dcb3D206AA164770874f36a4B5AD2EE5194f","zama:0x7C5Eeb4D8CED0101799B8Cc212eE874097364F58","zama:0x7C17BE232e5968BDa9516478B798b9E90D013fCC","zama:0x6016DCA5e91e62826e3FEA1Fb0a763602dc1E385","zama:0xB7978e602D2AF68258dA614AF949E014BF0DE0eb"]
+++ description: KMS transaction senders in the Gateway context created by the v0.5 migration. Node membership is immutable and GatewayConfig cannot destroy contexts, so these accounts remain authorized to submit responses to Decryption after future rotations.
+++ severity: HIGH
      values.initialMigratedKmsTxSenders:
+        ["zama:0x711EBE8aA590f9C9904ff279239E89dB2eFbC890","zama:0xB4CE988D382425F64c99A352375F72A5f1cf6FFB","zama:0x4eC7200E392B97913cbD6d8160B011406EB019F1","zama:0xEd1D622bd59d657580aBAc65312b40B4B2dA6236","zama:0x74a1E2e87a4026b7B8b5252c747E514159515e9a","zama:0x0e25B8DB74c754C8275C0B219ba2A6CD7c59E31D","zama:0x577Fd21e4BC7D644A4177C4B89146e1Ab394De04","zama:0xbaac6F9DD84bFB303F05B4DE45A88Eec86855BD0","zama:0x43e4c21cf9d24Dc5b4e00031349EC213A2ba8340","zama:0xC105B5933446658D226582f7A112F49a70b54364","zama:0xbcF4943A856497FB2345409D35f4d1eae9A0363E","zama:0xD227C4B573800EdA3bAdA6DAC872E9134E012e6D","zama:0x487e41623b7FeB464ff79F7326DCa791c9a1c5EC"]
+++ description: Snapshot of the public-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance changes the initial context while it is current. This value remains security-critical after future context rotations.
+++ severity: HIGH
      values.initialMigratedPublicDecryptionThreshold:
+        7
+++ description: Snapshot of the user-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance changes the initial context while it is current. This value remains security-critical after future context rotations.
+++ severity: HIGH
      values.initialMigratedUserDecryptionThreshold:
+        9
      fieldMeta.initialMigratedKmsContextId:
+        {"severity":"HIGH","description":"Identifier assigned to the Gateway KMS context created by the v0.5 migration. Version 1 Decryption response metadata can continue to select it after later rotations.","type":"RISK_PARAMETER"}
      fieldMeta.initialMigratedKmsTxSenders:
+        {"severity":"HIGH","description":"KMS transaction senders in the Gateway context created by the v0.5 migration. Node membership is immutable and GatewayConfig cannot destroy contexts, so these accounts remain authorized to submit responses to Decryption after future rotations.","type":"PERMISSION"}
      fieldMeta.initialMigratedKmsSigners:
+        {"severity":"HIGH","description":"KMS signers in the Gateway context created by the v0.5 migration. Node membership is immutable and GatewayConfig cannot destroy contexts, so this signer set remains authorized for Decryption responses after future rotations.","type":"PERMISSION"}
      fieldMeta.initialMigratedPublicDecryptionThreshold:
+        {"severity":"HIGH","description":"Snapshot of the public-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance changes the initial context while it is current. This value remains security-critical after future context rotations.","type":"RISK_PARAMETER"}
      fieldMeta.initialMigratedUserDecryptionThreshold:
+        {"severity":"HIGH","description":"Snapshot of the user-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance changes the initial context while it is current. This value remains security-critical after future context rotations.","type":"RISK_PARAMETER"}
    }
```

Generated with discovered.json: 0x755dc68568a28f6800ab2d7043af99d88031b4f7

# Diff at Mon, 29 Jun 2026 15:21:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1782746392

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract ZamaGovMemberDAO (eth:0x31bBD7a242A38372DE92CA304fE29C12C90A382C) [zama/ZamaDAO]
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
```

```diff
+   Status: CREATED
    contract HCULimit (eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2) [zama/ZamaHCULimit]
    +++ description: Tracks and enforces homomorphic computation unit limits for FHEVM operation requests.
```

```diff
+   Status: CREATED
    EOA  (eth:0x4202860Fa6afAF3e2977cD139Ac693a05e4f9450)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConfidentialSteakcUSDCWrapper (eth:0x66Bf74E96900D1a19c7070D939D124f2F565C458) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x69E55790880d0ABa56E48Ee1f7fc3834b0F5c223) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Staking (Coprocessor) (eth:0x7147485b892158f2B875f7aC5Ea48A9937C66AE8) [zama/ProtocolStaking]
    +++ description: Staking contract that escrows ZAMA, issues non-transferable staked voting tokens, and mints protocol rewards to eligible stakers at a configurable reward rate.
```

```diff
+   Status: CREATED
    contract ConfidentialXAUTWrapper (eth:0x73cc9aF9d6BEFdb3c3fAf8a5E8c05Cb95FdaEEf1) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract KMSVerifier (eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03) [zama/ZamaKMSVerifier]
    +++ description: Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers use it before accepting decrypted values.
```

```diff
+   Status: CREATED
    contract ConfidentialZAMAWrapper (eth:0x80CB147Fd86dC6dEe3Eee7e4Cee33d1397d98071) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract ConfidentialBRONWrapper (eth:0x85dE671c3bec1aDeD752c3Cea943521181C826bc) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x8c0E2c46F96756C49DBd6723F4C57a03a254B4B0) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x97E18544e156724E4076945F10c288ecBBC94e54) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConfidentialTGBPWrapper (eth:0xa873750ccBafD5ec7Dd13bfD5237d7129832eDD9) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract ConfidentialUSDTWrapper (eth:0xAe0207C757Aa2B4019Ad96edD0092ddc63EF0c50) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract DAO (eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3) [zama/ZamaDAO]
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
```

```diff
+   Status: CREATED
    contract ConfidentialBbqTGBPWrapper (eth:0xBA4cFF6ED6F7Cb2A58776dECa4E984b498446762) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract PauserSet (eth:0xbBfE1680b4a63ED05f7F80CE330BED7C992A586C) [zama/ZamaPauserSet]
    +++ description: Maintains the pauser account set used in pause-control checks.
```

```diff
+   Status: CREATED
    contract ZamaGovMultisigB (eth:0xBc860b6a4C860C5424B84A056E53ACFb2C99a38F) [zama/Multisig]
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
```

```diff
+   Status: CREATED
    contract ACL (eth:0xcA2E8f1F656CD25C01F05d0b243Ab1ecd4a8ffb6) [zama/ZamaACL]
    +++ description: Ethereum host-chain access-control registry for encrypted handles, storing handle allowances and delegation state for ciphertext references. Its public-decryption and user-delegation events are mirrored into the Gateway MultichainACL by coprocessor consensus.
```

```diff
+   Status: CREATED
    contract InputVerifier (eth:0xCe0FC2e05CFff1B719EFF7169f7D80Af770c8EA2) [zama/ZamaInputVerifier]
    +++ description: Ethereum host-chain verifier for encrypted input attestations produced by the Zama Gateway InputVerification contract. The FHEVMExecutor calls it before accepting user-provided ciphertext handles.
```

```diff
+   Status: CREATED
    contract FHEVMExecutor (eth:0xD82385dADa1ae3E969447f20A3164F6213100e75) [zama/ZamaFHEVMExecutor]
    +++ description: FHEVM executor that accepts encrypted operation requests, accounts for computation usage, and stores ciphertext handles for operation results.
```

```diff
+   Status: CREATED
    contract ConfidentialWETHWrapper (eth:0xda9396b82634Ea99243cE51258B6A5Ae512D4893) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract ZamaGovMultisigA (eth:0xE43c73aAb2b6aBBad6d0461997ce1cfea5ABe66f) [zama/Multisig]
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xE53e32a669357Ab0360103d8f294812B914AF9e4) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConfidentialUSDCWrapper (eth:0xe978F22157048E5DB8E5d07971376e86671672B2) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract Staking (KMS) (eth:0xe9b176CCaA8840DC3b3567bb83e2cD2a6c36F4Ab) [zama/ProtocolStaking]
    +++ description: Staking contract that escrows ZAMA, issues non-transferable staked voting tokens, and mints protocol rewards to eligible stakers at a configurable reward rate.
```

```diff
+   Status: CREATED
    contract ConfidentialTokenWrappersRegistry (eth:0xeb5015fF021DB115aCe010f23F55C2591059bBA0) [zama/ConfidentialTokenWrappersRegistry]
    +++ description: Registry for Zama confidential token wrappers.
```

```diff
+   Status: CREATED
    contract MultichainACL (zama:0x055d9FD50a612A9027716ec8db663E7D68562468) [zama/MultichainACL]
    +++ description: Gateway-side ACL mirror that records coprocessor consensus for host-chain public decryption permissions, account handle allowances, and delegated user-decryption access. For Ethereum, it mirrors ACL events emitted by the L1 ACL contract registered in GatewayConfig.
```

```diff
+   Status: CREATED
    contract Decryption (zama:0x0f6024a97684f7d90ddb0fAAD79cB15F2C888D24) [zama/Decryption]
    +++ description: Gateway contract that orchestrates public and user decryption requests, checks mirrored host-chain ACL state, collects KMS responses, and emits results once the configured KMS threshold is reached. Ethereum KMSVerifier verifies public decryption results against this contract's EIP-712 domain.
```

```diff
+   Status: CREATED
    contract KMSGeneration (zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3) [zama/KMSGeneration]
    +++ description: Gateway contract that orchestrates FHE key generation, CRS generation, PRSS initialization, and key resharing through threshold KMS responses.
```

```diff
+   Status: CREATED
    contract GatewayPauserSet (zama:0x571ecb596fCc5c840DA35CbeCA175580db50ac1b) [zama/GatewayPauserSet]
    +++ description: Maintains the set of accounts allowed to pause gateway contracts. The set is managed by the GatewayConfig owner.
```

```diff
+   Status: CREATED
    contract SafeL2 (zama:0x5f0F86BcEad6976711C9B131bCa5D30E767fe2bE) [GnosisSafe]
    +++ description: Gateway owner Safe. Its LayerZero governance module is outside the Zama Gateway protocol surface covered here.
```

```diff
+   Status: CREATED
    contract ProtocolPayment (zama:0x7E179E45E5fe0a21015Be25185363B4F2F2F7e89) [zama/ProtocolPayment]
    +++ description: Gateway fee contract that charges ZAMA fees for encrypted input verification, public decryption, and user decryption requests, then forwards the collected fees to the configured fee burner sender.
```

```diff
+   Status: CREATED
    contract InputVerification (zama:0xcB1bB072f38bdAF0F328CdEf1Fc6eDa1DF029287) [zama/InputVerification]
    +++ description: Gateway contract that receives encrypted input verification requests from registered host chains, collects coprocessor responses, and emits a threshold-signed attestation once coprocessor consensus is reached. Ethereum InputVerifier verifies attestations against this contract's EIP-712 domain.
```

```diff
+   Status: CREATED
    contract CiphertextCommits (zama:0xd82cF70FC102028cd01acB87D0E107780ae4F41F) [zama/CiphertextCommits]
    +++ description: Gateway contract that stores ciphertext and SNS ciphertext digests after coprocessor consensus, allowing decryption requests to reference committed ciphertext material.
```

```diff
+   Status: CREATED
    contract GatewayConfig (zama:0xDE537Be194777A56f8B19d14079E6a78249390ab) [zama/GatewayConfig]
    +++ description: Central configuration contract for the Zama Gateway. It stores the KMS, coprocessor, custodian, host-chain, pauser, and consensus-threshold configuration used by the gateway workflow contracts.
```
