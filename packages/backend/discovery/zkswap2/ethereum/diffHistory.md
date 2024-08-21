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

