Generated with discovered.json: 0x24a490b7f40808598fd15adfa0e2c2fd850bce46

# Diff at Mon, 14 Jul 2025 12:46:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 16767881
- current block number: 16767881

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7) {
    +++ description: None
      address:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
+        "eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      values.getMaster:
-        "0x9D7397204F32e0Ee919Ea3475630cdf131086255"
+        "eth:0x9D7397204F32e0Ee919Ea3475630cdf131086255"
      values.mainContract:
-        "0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
+        "eth:0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
      values.managedContracts.0:
-        "0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
+        "eth:0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
      values.managedContracts.1:
-        "0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D"
+        "eth:0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D"
      values.managedContracts.2:
-        "0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
+        "eth:0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
      values.managedContracts.3:
-        "0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"
+        "eth:0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"
      values.managedContracts.4:
-        "0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
+        "eth:0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
      implementationNames.0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7:
-        ""
      implementationNames.eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7:
+        ""
    }
```

```diff
    EOA  (0x38101ae98196C8BCf7dF1835Bf3983B384272ae4) {
    +++ description: None
      address:
-        "0x38101ae98196C8BCf7dF1835Bf3983B384272ae4"
+        "eth:0x38101ae98196C8BCf7dF1835Bf3983B384272ae4"
    }
```

```diff
    contract Verifier (0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef) {
    +++ description: None
      address:
-        "0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
+        "eth:0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
      values.$admin:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
+        "eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      values.$implementation:
-        "0x94b9401945a9bc06CE5B69e6dB3c6B671aABc829"
+        "eth:0x94b9401945a9bc06CE5B69e6dB3c6B671aABc829"
      values.getMaster:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
+        "eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      values.getTarget:
-        "0x94b9401945a9bc06CE5B69e6dB3c6B671aABc829"
+        "eth:0x94b9401945a9bc06CE5B69e6dB3c6B671aABc829"
      implementationNames.0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef:
-        "Proxy"
      implementationNames.0x94b9401945a9bc06CE5B69e6dB3c6B671aABc829:
-        "Verifier"
      implementationNames.eth:0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef:
+        "Proxy"
      implementationNames.eth:0x94b9401945a9bc06CE5B69e6dB3c6B671aABc829:
+        "Verifier"
    }
```

```diff
    contract ZkSync (0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3) {
    +++ description: None
      address:
-        "0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
+        "eth:0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
      values.$admin:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
+        "eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      values.$implementation:
-        "0xf2c351f22b148A9fF583a0F81701471a74E7338e"
+        "eth:0xf2c351f22b148A9fF583a0F81701471a74E7338e"
      values.getMaster:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
+        "eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      values.getTarget:
-        "0xf2c351f22b148A9fF583a0F81701471a74E7338e"
+        "eth:0xf2c351f22b148A9fF583a0F81701471a74E7338e"
      values.governance:
-        "0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
+        "eth:0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
      values.pairManager:
-        "0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D"
+        "eth:0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D"
      values.verifier:
-        "0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
+        "eth:0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
      values.verifierExit:
-        "0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"
+        "eth:0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"
      values.zkSyncCommitBlockAddress:
-        "0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4"
+        "eth:0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4"
      values.zkSyncExitAddress:
-        "0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0"
+        "eth:0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0"
      implementationNames.0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3:
-        "Proxy"
      implementationNames.0xf2c351f22b148A9fF583a0F81701471a74E7338e:
-        "ZkSync"
      implementationNames.eth:0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3:
+        "Proxy"
      implementationNames.eth:0xf2c351f22b148A9fF583a0F81701471a74E7338e:
+        "ZkSync"
    }
```

```diff
    contract Governance (0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B) {
    +++ description: None
      address:
-        "0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
+        "eth:0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
      values.$admin:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
+        "eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      values.$implementation:
-        "0x95269f9E76540459c797089034dc74b48dF780a2"
+        "eth:0x95269f9E76540459c797089034dc74b48dF780a2"
      values.getMaster:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
+        "eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      values.getTarget:
-        "0x95269f9E76540459c797089034dc74b48dF780a2"
+        "eth:0x95269f9E76540459c797089034dc74b48dF780a2"
      values.networkGovernor:
-        "0x9D7397204F32e0Ee919Ea3475630cdf131086255"
+        "eth:0x9D7397204F32e0Ee919Ea3475630cdf131086255"
      values.tokenLister:
-        "0xb3BFC153d60f51Fb10E69B04f5f7D2735fA0619E"
+        "eth:0xb3BFC153d60f51Fb10E69B04f5f7D2735fA0619E"
      values.validators.0:
-        "0x38101ae98196C8BCf7dF1835Bf3983B384272ae4"
+        "eth:0x38101ae98196C8BCf7dF1835Bf3983B384272ae4"
      implementationNames.0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B:
-        "Proxy"
      implementationNames.0x95269f9E76540459c797089034dc74b48dF780a2:
-        "Governance"
      implementationNames.eth:0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B:
+        "Proxy"
      implementationNames.eth:0x95269f9E76540459c797089034dc74b48dF780a2:
+        "Governance"
    }
```

```diff
    EOA  (0x961B513dfD3e363c238E0f98219eE02552A847BD) {
    +++ description: None
      address:
-        "0x961B513dfD3e363c238E0f98219eE02552A847BD"
+        "eth:0x961B513dfD3e363c238E0f98219eE02552A847BD"
    }
```

```diff
    EOA  (0x9D7397204F32e0Ee919Ea3475630cdf131086255) {
    +++ description: None
      address:
-        "0x9D7397204F32e0Ee919Ea3475630cdf131086255"
+        "eth:0x9D7397204F32e0Ee919Ea3475630cdf131086255"
    }
```

```diff
    contract ZkSwapListing (0xb3BFC153d60f51Fb10E69B04f5f7D2735fA0619E) {
    +++ description: None
      address:
-        "0xb3BFC153d60f51Fb10E69B04f5f7D2735fA0619E"
+        "eth:0xb3BFC153d60f51Fb10E69B04f5f7D2735fA0619E"
      values.listingFeeReceiver:
-        "0x961B513dfD3e363c238E0f98219eE02552A847BD"
+        "eth:0x961B513dfD3e363c238E0f98219eE02552A847BD"
      values.listingFeeToken:
-        "0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6"
+        "eth:0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6"
      values.owner:
-        "0x961B513dfD3e363c238E0f98219eE02552A847BD"
+        "eth:0x961B513dfD3e363c238E0f98219eE02552A847BD"
      implementationNames.0xb3BFC153d60f51Fb10E69B04f5f7D2735fA0619E:
-        "ZkSwapListing"
      implementationNames.eth:0xb3BFC153d60f51Fb10E69B04f5f7D2735fA0619E:
+        "ZkSwapListing"
    }
```

```diff
    contract VerifierExit (0xb56878d21F6b101f48bb55f1AA9D3F624f04E513) {
    +++ description: None
      address:
-        "0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"
+        "eth:0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"
      values.$admin:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
+        "eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      values.$implementation:
-        "0x17e51B3659884d70a306906B5BDD73D1c64a3892"
+        "eth:0x17e51B3659884d70a306906B5BDD73D1c64a3892"
      values.getMaster:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
+        "eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      values.getTarget:
-        "0x17e51B3659884d70a306906B5BDD73D1c64a3892"
+        "eth:0x17e51B3659884d70a306906B5BDD73D1c64a3892"
      implementationNames.0xb56878d21F6b101f48bb55f1AA9D3F624f04E513:
-        "Proxy"
      implementationNames.0x17e51B3659884d70a306906B5BDD73D1c64a3892:
-        ""
      implementationNames.eth:0xb56878d21F6b101f48bb55f1AA9D3F624f04E513:
+        "Proxy"
      implementationNames.eth:0x17e51B3659884d70a306906B5BDD73D1c64a3892:
+        ""
    }
```

```diff
    contract ZkSyncExit (0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0) {
    +++ description: None
      address:
-        "0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0"
+        "eth:0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0"
      implementationNames.0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0:
-        ""
      implementationNames.eth:0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0:
+        ""
    }
```

```diff
    contract UniswapV2Factory (0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D) {
    +++ description: None
      address:
-        "0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D"
+        "eth:0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D"
      values.$admin:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
+        "eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      values.$implementation:
-        "0xB2639bA16c7A5b0C55cA22D77CdA3D7ED88A5c89"
+        "eth:0xB2639bA16c7A5b0C55cA22D77CdA3D7ED88A5c89"
      values.getMaster:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
+        "eth:0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      values.getTarget:
-        "0xB2639bA16c7A5b0C55cA22D77CdA3D7ED88A5c89"
+        "eth:0xB2639bA16c7A5b0C55cA22D77CdA3D7ED88A5c89"
      values.zkSyncAddress:
-        "0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
+        "eth:0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
      implementationNames.0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D:
-        "Proxy"
      implementationNames.0xB2639bA16c7A5b0C55cA22D77CdA3D7ED88A5c89:
-        "UniswapV2Factory"
      implementationNames.eth:0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D:
+        "Proxy"
      implementationNames.eth:0xB2639bA16c7A5b0C55cA22D77CdA3D7ED88A5c89:
+        "UniswapV2Factory"
    }
```

```diff
    contract ZkSyncCommitBlock (0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4) {
    +++ description: None
      address:
-        "0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4"
+        "eth:0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4"
      values.zkSyncCommitBlockAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.zkSyncExitAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4:
-        "ZkSyncCommitBlock"
      implementationNames.eth:0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4:
+        "ZkSyncCommitBlock"
    }
```

```diff
    contract Zks Token (0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6) {
    +++ description: None
      address:
-        "0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6"
+        "eth:0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6"
      implementationNames.0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6:
-        "ZksToken"
      implementationNames.eth:0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6:
+        "ZksToken"
    }
```

```diff
+   Status: CREATED
    contract UpgradeGatekeeper (0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSync (0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSwapListing (0xb3BFC153d60f51Fb10E69B04f5f7D2735fA0619E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifierExit (0xb56878d21F6b101f48bb55f1AA9D3F624f04E513)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSyncExit (0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniswapV2Factory (0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSyncCommitBlock (0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Zks Token (0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6)
    +++ description: None
```

Generated with discovered.json: 0xea81adf3cc32cf30dae8dde40fe6ec638e860378

# Diff at Fri, 04 Jul 2025 12:19:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 16767881
- current block number: 16767881

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
+        "eth:0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
      receivedPermissions.1.from:
-        "ethereum:0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
+        "eth:0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
      receivedPermissions.2.from:
-        "ethereum:0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
+        "eth:0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
      receivedPermissions.3.from:
-        "ethereum:0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"
+        "eth:0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"
      receivedPermissions.4.from:
-        "ethereum:0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D"
+        "eth:0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D"
    }
```

Generated with discovered.json: 0x4fec88ef80bc5a6a930c70c3bb6cc9945cbe97e8

# Diff at Wed, 28 May 2025 13:56:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@498e4fbc23b0148c96248f03ca33a8415e632b71 block: 16767881
- current block number: 16767881

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract Zks Token (0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6) {
    +++ description: None
      name:
-        "ZksToken"
+        "Zks Token"
    }
```

Generated with discovered.json: 0x36fb574fc61a4c9245c8a4a47545efb78a88c7ea

# Diff at Fri, 23 May 2025 09:41:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 16767881
- current block number: 16767881

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7) {
    +++ description: None
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0xd815ee5b34af8dadea42c3118e9282fa0a0c6a91

# Diff at Tue, 29 Apr 2025 08:19:17 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 16767881
- current block number: 16767881

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract Verifier (0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7","via":[]}]
    }
```

```diff
    contract ZkSync (0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7","via":[]}]
    }
```

```diff
    contract Governance (0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7","via":[]}]
    }
```

```diff
    contract VerifierExit (0xb56878d21F6b101f48bb55f1AA9D3F624f04E513) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7","via":[]}]
    }
```

```diff
    contract UniswapV2Factory (0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7","via":[]}]
    }
```

Generated with discovered.json: 0x318f79c310adf3faf3d245daa2dfa521a07d9085

# Diff at Tue, 04 Mar 2025 10:40:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 16767881
- current block number: 16767881

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7) {
    +++ description: None
      sinceBlock:
+        12810001
    }
```

```diff
    contract Verifier (0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef) {
    +++ description: None
      sinceBlock:
+        12810001
    }
```

```diff
    contract ZkSync (0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3) {
    +++ description: None
      sinceBlock:
+        12810001
    }
```

```diff
    contract Governance (0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B) {
    +++ description: None
      sinceBlock:
+        12810001
    }
```

```diff
    contract ZkSwapListing (0xb3BFC153d60f51Fb10E69B04f5f7D2735fA0619E) {
    +++ description: None
      sinceBlock:
+        12817348
    }
```

```diff
    contract VerifierExit (0xb56878d21F6b101f48bb55f1AA9D3F624f04E513) {
    +++ description: None
      sinceBlock:
+        12810001
    }
```

```diff
    contract ZkSyncExit (0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0) {
    +++ description: None
      sinceBlock:
+        12810000
    }
```

```diff
    contract UniswapV2Factory (0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D) {
    +++ description: None
      sinceBlock:
+        12810001
    }
```

```diff
    contract ZkSyncCommitBlock (0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4) {
    +++ description: None
      sinceBlock:
+        12809999
    }
```

```diff
    contract ZksToken (0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6) {
    +++ description: None
      sinceBlock:
+        11305469
    }
```

Generated with discovered.json: 0xb1f7039b42ec99612889afc51564103705ed7f6d

# Diff at Mon, 20 Jan 2025 11:10:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 16767881
- current block number: 16767881

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7) {
    +++ description: None
      receivedPermissions.4.target:
-        "0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D"
      receivedPermissions.4.from:
+        "0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D"
      receivedPermissions.3.target:
-        "0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"
      receivedPermissions.3.from:
+        "0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"
      receivedPermissions.2.target:
-        "0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
      receivedPermissions.2.from:
+        "0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
      receivedPermissions.1.target:
-        "0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
      receivedPermissions.1.from:
+        "0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3"
      receivedPermissions.0.target:
-        "0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
      receivedPermissions.0.from:
+        "0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
    }
```

```diff
    contract Verifier (0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      issuedPermissions.0.to:
+        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
    }
```

```diff
    contract ZkSync (0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      issuedPermissions.0.to:
+        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
    }
```

```diff
    contract Governance (0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      issuedPermissions.0.to:
+        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
    }
```

```diff
    contract VerifierExit (0xb56878d21F6b101f48bb55f1AA9D3F624f04E513) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      issuedPermissions.0.to:
+        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
    }
```

```diff
    contract UniswapV2Factory (0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
      issuedPermissions.0.to:
+        "0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7"
    }
```

Generated with discovered.json: 0x929a7da555e18bedc085d166ab9831094caa621f

# Diff at Mon, 14 Oct 2024 10:58:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 16767881
- current block number: 16767881

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract Verifier (0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xe57a7d24585183351134b42cf28e1fe88dc44f62c93f606e49489c95fb235b3a"]
    }
```

```diff
    contract ZkSync (0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xe89f1035c59a163546a58952321af25209cc7c946f7fe23f50b535818c980d29"]
    }
```

```diff
    contract Governance (0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xfe2c75fea0224e9fcb9594039d0179faaeb8db2a5bd3a9219433c90b069d049d"]
    }
```

```diff
    contract ZkSwapListing (0xb3BFC153d60f51Fb10E69B04f5f7D2735fA0619E) {
    +++ description: None
      sourceHashes:
+        ["0xce4af2ec88a2ba33052ea9fe2da9580a88710e57fb6946fb00d5740600e11ee2"]
    }
```

```diff
    contract UniswapV2Factory (0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0x86e6238a6b2cd0e01b10a66c120be7cfb092bbeb23c0b83e457b160062477b45"]
    }
```

```diff
    contract ZkSyncCommitBlock (0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4) {
    +++ description: None
      sourceHashes:
+        ["0xaa78464b8e708b31da067db30b69023cdd0af596ac10c087dc5dbb0ba516ce00"]
    }
```

```diff
    contract ZksToken (0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6) {
    +++ description: None
      sourceHashes:
+        ["0xa7344a41ac050b7f10b2dd12807615cd0dbfd63e480cacec2c8a30dd7845522e"]
    }
```

Generated with discovered.json: 0xea2052cc462e142b7083a2ff0331154482bb0113

# Diff at Tue, 01 Oct 2024 11:12:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 16767881
- current block number: 16767881

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract Verifier (0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract ZkSync (0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract Governance (0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract VerifierExit (0xb56878d21F6b101f48bb55f1AA9D3F624f04E513) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract UniswapV2Factory (0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x0daa16be547eb74ea4018727e077d168001915d6

# Diff at Fri, 30 Aug 2024 08:01:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 16767881
- current block number: 16767881

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7) {
    +++ description: None
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xda019687e73bc4475d462455d4a7a41d05e147d4

# Diff at Fri, 23 Aug 2024 09:56:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 16767881
- current block number: 16767881

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract Verifier (0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract ZkSync (0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract Governance (0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract VerifierExit (0xb56878d21F6b101f48bb55f1AA9D3F624f04E513) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract UniswapV2Factory (0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0xd7aec79d514b27d98f6e997263c8b46ee37a00c4

# Diff at Wed, 21 Aug 2024 10:07:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 16767881
- current block number: 16767881

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef","0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3","0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B","0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D","0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef","via":[]},{"permission":"upgrade","target":"0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3","via":[]},{"permission":"upgrade","target":"0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B","via":[]},{"permission":"upgrade","target":"0xb56878d21F6b101f48bb55f1AA9D3F624f04E513","via":[]},{"permission":"upgrade","target":"0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D","via":[]}]
    }
```

```diff
    contract Verifier (0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7","via":[]}]
    }
```

```diff
    contract ZkSync (0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7","via":[]}]
    }
```

```diff
    contract Governance (0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7","via":[]}]
    }
```

```diff
    contract VerifierExit (0xb56878d21F6b101f48bb55f1AA9D3F624f04E513) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7","via":[]}]
    }
```

```diff
    contract UniswapV2Factory (0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7","via":[]}]
    }
```

Generated with discovered.json: 0x3fd9009ff156a58c926e08853a41199c70155b85

# Diff at Fri, 09 Aug 2024 12:03:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 16767881
- current block number: 16767881

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
+        "0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
      assignedPermissions.upgrade.0:
-        "0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B"
+        "0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef"
    }
```

Generated with discovered.json: 0x8065e3040b95dca31c0ce53c46d4bfd8264310fe

# Diff at Fri, 09 Aug 2024 10:13:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 16767881
- current block number: 16767881

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16767881 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef","0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3","0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B","0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D","0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"]
      assignedPermissions.upgrade:
+        ["0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B","0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3","0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef","0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D","0xb56878d21F6b101f48bb55f1AA9D3F624f04E513"]
    }
```

Generated with discovered.json: 0x8bc5e302d66b9f96a9cd7668ee581da29866b3a3

