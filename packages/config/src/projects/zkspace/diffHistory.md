Generated with discovered.json: 0x2b7b99bc40d034f690daf0a7006ff01588b7a8d6

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x74a3f61408f5aad29fa1b183a3e5b4fa42c12d3b

# Diff at Mon, 14 Jul 2025 12:46:48 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      address:
-        "0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
+        "eth:0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
      values.$admin:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.$implementation:
-        "0x41455808B3109AD0f79672C44D75933D3529FEaE"
+        "eth:0x41455808B3109AD0f79672C44D75933D3529FEaE"
      values.getMaster:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.getTarget:
-        "0x41455808B3109AD0f79672C44D75933D3529FEaE"
+        "eth:0x41455808B3109AD0f79672C44D75933D3529FEaE"
      implementationNames.0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81:
-        "Proxy"
      implementationNames.0x41455808B3109AD0f79672C44D75933D3529FEaE:
-        "VerifierExit"
      implementationNames.eth:0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81:
+        "Proxy"
      implementationNames.eth:0x41455808B3109AD0f79672C44D75933D3529FEaE:
+        "VerifierExit"
    }
```

```diff
    EOA  (0x5bd9404260D2B0D55081E599e4e085BE080141E2) {
    +++ description: None
      address:
-        "0x5bd9404260D2B0D55081E599e4e085BE080141E2"
+        "eth:0x5bd9404260D2B0D55081E599e4e085BE080141E2"
    }
```

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
    +++ description: None
      address:
-        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
+        "eth:0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      values.$admin:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.$implementation.0:
-        "0x467a2B91f231D930F5eeB6B982C7666E81DA8626"
+        "eth:0x467a2B91f231D930F5eeB6B982C7666E81DA8626"
      values.$implementation.1:
-        "0x899A605a3B7A11eA5D928958b77014e763c53426"
+        "eth:0x899A605a3B7A11eA5D928958b77014e763c53426"
      values.$implementation.2:
-        "0x49dCe53faeAD4538F77c3b8Bae8347f1644101Db"
+        "eth:0x49dCe53faeAD4538F77c3b8Bae8347f1644101Db"
      values.$implementation.3:
-        "0x6A4E7dd4c546Ca2DD84b48803040732fC30206D7"
+        "eth:0x6A4E7dd4c546Ca2DD84b48803040732fC30206D7"
      values.getMaster:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.getTarget:
-        "0x467a2B91f231D930F5eeB6B982C7666E81DA8626"
+        "eth:0x467a2B91f231D930F5eeB6B982C7666E81DA8626"
      values.governance:
-        "0x83Cb1531Ec8447366501aE440478da245EcffB89"
+        "eth:0x83Cb1531Ec8447366501aE440478da245EcffB89"
      values.pairManager:
-        "0xc07f850b60E0EEd49a09E455b01a869C25963735"
+        "eth:0xc07f850b60E0EEd49a09E455b01a869C25963735"
      values.verifier:
-        "0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
+        "eth:0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
      values.verifierExit:
-        "0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
+        "eth:0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
      values.zkSeaAddress:
-        "0x899A605a3B7A11eA5D928958b77014e763c53426"
+        "eth:0x899A605a3B7A11eA5D928958b77014e763c53426"
      values.zkSeaNFT:
-        "0xc632347cc96A4400653E3514eA148630455295b5"
+        "eth:0xc632347cc96A4400653E3514eA148630455295b5"
      values.zkSyncCommitBlockAddress:
-        "0x49dCe53faeAD4538F77c3b8Bae8347f1644101Db"
+        "eth:0x49dCe53faeAD4538F77c3b8Bae8347f1644101Db"
      values.zkSyncExitAddress:
-        "0x6A4E7dd4c546Ca2DD84b48803040732fC30206D7"
+        "eth:0x6A4E7dd4c546Ca2DD84b48803040732fC30206D7"
      implementationNames.0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8:
-        "Proxy"
      implementationNames.0x467a2B91f231D930F5eeB6B982C7666E81DA8626:
-        "ZkSync"
      implementationNames.0x899A605a3B7A11eA5D928958b77014e763c53426:
-        "ZKSea"
      implementationNames.0x49dCe53faeAD4538F77c3b8Bae8347f1644101Db:
-        "ZkSyncCommitBlock"
      implementationNames.0x6A4E7dd4c546Ca2DD84b48803040732fC30206D7:
-        "ZkSyncExit"
      implementationNames.eth:0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8:
+        "Proxy"
      implementationNames.eth:0x467a2B91f231D930F5eeB6B982C7666E81DA8626:
+        "ZkSync"
      implementationNames.eth:0x899A605a3B7A11eA5D928958b77014e763c53426:
+        "ZKSea"
      implementationNames.eth:0x49dCe53faeAD4538F77c3b8Bae8347f1644101Db:
+        "ZkSyncCommitBlock"
      implementationNames.eth:0x6A4E7dd4c546Ca2DD84b48803040732fC30206D7:
+        "ZkSyncExit"
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      address:
-        "0x83Cb1531Ec8447366501aE440478da245EcffB89"
+        "eth:0x83Cb1531Ec8447366501aE440478da245EcffB89"
      values.$admin:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.$implementation:
-        "0x6659174CdB0c445B897aEd25181f293E468941a5"
+        "eth:0x6659174CdB0c445B897aEd25181f293E468941a5"
      values.getMaster:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.getTarget:
-        "0x6659174CdB0c445B897aEd25181f293E468941a5"
+        "eth:0x6659174CdB0c445B897aEd25181f293E468941a5"
      values.networkGovernor:
-        "0xfCAE399eA757DDf0a4020198C59BF2270c2B05Be"
+        "eth:0xfCAE399eA757DDf0a4020198C59BF2270c2B05Be"
      values.tokenLister:
-        "0x8aA2C56dca9d59F4317c2fad632c192b18127709"
+        "eth:0x8aA2C56dca9d59F4317c2fad632c192b18127709"
      values.validators.0:
-        "0x5bd9404260D2B0D55081E599e4e085BE080141E2"
+        "eth:0x5bd9404260D2B0D55081E599e4e085BE080141E2"
      implementationNames.0x83Cb1531Ec8447366501aE440478da245EcffB89:
-        "Proxy"
      implementationNames.0x6659174CdB0c445B897aEd25181f293E468941a5:
-        "Governance"
      implementationNames.eth:0x83Cb1531Ec8447366501aE440478da245EcffB89:
+        "Proxy"
      implementationNames.eth:0x6659174CdB0c445B897aEd25181f293E468941a5:
+        "Governance"
    }
```

```diff
    contract ZkSwapListing (0x8aA2C56dca9d59F4317c2fad632c192b18127709) {
    +++ description: None
      address:
-        "0x8aA2C56dca9d59F4317c2fad632c192b18127709"
+        "eth:0x8aA2C56dca9d59F4317c2fad632c192b18127709"
      values.listingFeeReceiver:
-        "0x961B513dfD3e363c238E0f98219eE02552A847BD"
+        "eth:0x961B513dfD3e363c238E0f98219eE02552A847BD"
      values.listingFeeToken:
-        "0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6"
+        "eth:0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6"
      values.owner:
-        "0x961B513dfD3e363c238E0f98219eE02552A847BD"
+        "eth:0x961B513dfD3e363c238E0f98219eE02552A847BD"
      implementationNames.0x8aA2C56dca9d59F4317c2fad632c192b18127709:
-        "ZkSwapListing"
      implementationNames.eth:0x8aA2C56dca9d59F4317c2fad632c192b18127709:
+        "ZkSwapListing"
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
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      address:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.getMaster:
-        "0xfCAE399eA757DDf0a4020198C59BF2270c2B05Be"
+        "eth:0xfCAE399eA757DDf0a4020198C59BF2270c2B05Be"
      values.mainContract:
-        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
+        "eth:0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      values.managedContracts.0:
-        "0x83Cb1531Ec8447366501aE440478da245EcffB89"
+        "eth:0x83Cb1531Ec8447366501aE440478da245EcffB89"
      values.managedContracts.1:
-        "0xc632347cc96A4400653E3514eA148630455295b5"
+        "eth:0xc632347cc96A4400653E3514eA148630455295b5"
      values.managedContracts.2:
-        "0xc07f850b60E0EEd49a09E455b01a869C25963735"
+        "eth:0xc07f850b60E0EEd49a09E455b01a869C25963735"
      values.managedContracts.3:
-        "0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
+        "eth:0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
      values.managedContracts.4:
-        "0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
+        "eth:0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
      values.managedContracts.5:
-        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
+        "eth:0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      implementationNames.0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390:
-        "UpgradeGatekeeper"
      implementationNames.eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390:
+        "UpgradeGatekeeper"
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      address:
-        "0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
+        "eth:0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
      values.$admin:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.$implementation:
-        "0x44DedA2C824458A5DfE1e363c679dea33f1ffA39"
+        "eth:0x44DedA2C824458A5DfE1e363c679dea33f1ffA39"
      values.getMaster:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.getTarget:
-        "0x44DedA2C824458A5DfE1e363c679dea33f1ffA39"
+        "eth:0x44DedA2C824458A5DfE1e363c679dea33f1ffA39"
      implementationNames.0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af:
-        "Proxy"
      implementationNames.0x44DedA2C824458A5DfE1e363c679dea33f1ffA39:
-        "Verifier"
      implementationNames.eth:0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af:
+        "Proxy"
      implementationNames.eth:0x44DedA2C824458A5DfE1e363c679dea33f1ffA39:
+        "Verifier"
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      address:
-        "0xc07f850b60E0EEd49a09E455b01a869C25963735"
+        "eth:0xc07f850b60E0EEd49a09E455b01a869C25963735"
      values.$admin:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.$implementation:
-        "0x5f3bE7846efC473552C5619b929F7d4aa640fb54"
+        "eth:0x5f3bE7846efC473552C5619b929F7d4aa640fb54"
      values.getMaster:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.getTarget:
-        "0x5f3bE7846efC473552C5619b929F7d4aa640fb54"
+        "eth:0x5f3bE7846efC473552C5619b929F7d4aa640fb54"
      values.zkSyncAddress:
-        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
+        "eth:0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      implementationNames.0xc07f850b60E0EEd49a09E455b01a869C25963735:
-        "Proxy"
      implementationNames.0x5f3bE7846efC473552C5619b929F7d4aa640fb54:
-        "UniswapV2Factory"
      implementationNames.eth:0xc07f850b60E0EEd49a09E455b01a869C25963735:
+        "Proxy"
      implementationNames.eth:0x5f3bE7846efC473552C5619b929F7d4aa640fb54:
+        "UniswapV2Factory"
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      address:
-        "0xc632347cc96A4400653E3514eA148630455295b5"
+        "eth:0xc632347cc96A4400653E3514eA148630455295b5"
      values.$admin:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.$implementation:
-        "0xD06986022EFE62A5BC8258299e4495Bb27567BE0"
+        "eth:0xD06986022EFE62A5BC8258299e4495Bb27567BE0"
      values.getMaster:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
+        "eth:0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      values.getTarget:
-        "0xD06986022EFE62A5BC8258299e4495Bb27567BE0"
+        "eth:0xD06986022EFE62A5BC8258299e4495Bb27567BE0"
      values.owner:
-        "0xfCAE399eA757DDf0a4020198C59BF2270c2B05Be"
+        "eth:0xfCAE399eA757DDf0a4020198C59BF2270c2B05Be"
      values.zksCore:
-        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
+        "eth:0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      implementationNames.0xc632347cc96A4400653E3514eA148630455295b5:
-        "Proxy"
      implementationNames.0xD06986022EFE62A5BC8258299e4495Bb27567BE0:
-        "ZKSeaNFT"
      implementationNames.eth:0xc632347cc96A4400653E3514eA148630455295b5:
+        "Proxy"
      implementationNames.eth:0xD06986022EFE62A5BC8258299e4495Bb27567BE0:
+        "ZKSeaNFT"
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
    EOA  (0xfCAE399eA757DDf0a4020198C59BF2270c2B05Be) {
    +++ description: None
      address:
-        "0xfCAE399eA757DDf0a4020198C59BF2270c2B05Be"
+        "eth:0xfCAE399eA757DDf0a4020198C59BF2270c2B05Be"
    }
```

```diff
+   Status: CREATED
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSwapListing (0x8aA2C56dca9d59F4317c2fad632c192b18127709)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Zks Token (0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6)
    +++ description: None
```

Generated with discovered.json: 0xd5f2f63b0d24d101fbf7b6f00e038f8ff06f40ba

# Diff at Fri, 04 Jul 2025 12:19:31 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
+        "eth:0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
      receivedPermissions.1.from:
-        "ethereum:0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
+        "eth:0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      receivedPermissions.2.from:
-        "ethereum:0x83Cb1531Ec8447366501aE440478da245EcffB89"
+        "eth:0x83Cb1531Ec8447366501aE440478da245EcffB89"
      receivedPermissions.3.from:
-        "ethereum:0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
+        "eth:0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
      receivedPermissions.4.from:
-        "ethereum:0xc07f850b60E0EEd49a09E455b01a869C25963735"
+        "eth:0xc07f850b60E0EEd49a09E455b01a869C25963735"
      receivedPermissions.5.from:
-        "ethereum:0xc632347cc96A4400653E3514eA148630455295b5"
+        "eth:0xc632347cc96A4400653E3514eA148630455295b5"
    }
```

Generated with discovered.json: 0xc196a168dead68d4c926088d12d4febe2cf480c3

# Diff at Wed, 28 May 2025 13:56:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@498e4fbc23b0148c96248f03ca33a8415e632b71 block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract Zks Token (0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6) {
    +++ description: None
      name:
-        "ZksToken"
+        "Zks Token"
    }
```

Generated with discovered.json: 0x65d2a979638862c2210b7ff98aedccb5aca4e57c

# Diff at Tue, 27 May 2025 08:30:28 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
    +++ description: None
      sourceHashes.4:
-        "0x6578bc6e4cf4cc0ec7d845733d5337fcc6896e629499a4af73d602cac922868d"
      sourceHashes.3:
-        "0x04c2a817fae899931571f8d2f3655b50f10a544cc9281094bf0e5fd5b2c7a173"
      sourceHashes.2:
-        "0xd8f53791fc9bb0df1c3d903f577e3d06a232910af94919846aa5ede33e425de5"
      sourceHashes.1:
-        "0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6"
+        "0xca05aa8ddfbc78f393e7029ac1744aa71bcbb8bf2f3b9621c59cdd75e43ce729"
      sourceHashes.0:
-        "0x96364e118ebcb69d8bbaa8ce71f6639d303a031f47258821d77892edd89bb476"
+        "0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6"
    }
```

Generated with discovered.json: 0xf3084461902f667cf324b6b8e1740eb50db8238d

# Diff at Fri, 23 May 2025 09:41:09 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 20432700
- current block number: 20432700

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      receivedPermissions.5.role:
+        "admin"
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

Generated with discovered.json: 0x1a900e3c69575ad6aa30d01a5d0482744609b09c

# Diff at Tue, 29 Apr 2025 08:19:16 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 20432700
- current block number: 20432700

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

Generated with discovered.json: 0x15eba6227964c7e2a3339168cae26ae302a59ea7

# Diff at Tue, 04 Mar 2025 10:40:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract ZkSwapListing (0x8aA2C56dca9d59F4317c2fad632c192b18127709) {
    +++ description: None
      sinceBlock:
+        13809902
    }
```

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      sinceBlock:
+        13809566
    }
```

```diff
    contract ZksToken (0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6) {
    +++ description: None
      sinceBlock:
+        11305469
    }
```

Generated with discovered.json: 0xb14b2d7a9335725345f15ad28d11509be6a3dabc

# Diff at Mon, 20 Jan 2025 11:10:25 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20432700
- current block number: 20432700

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      receivedPermissions.5.target:
-        "0xc632347cc96A4400653E3514eA148630455295b5"
      receivedPermissions.5.from:
+        "0xc632347cc96A4400653E3514eA148630455295b5"
      receivedPermissions.4.target:
-        "0xc07f850b60E0EEd49a09E455b01a869C25963735"
      receivedPermissions.4.from:
+        "0xc07f850b60E0EEd49a09E455b01a869C25963735"
      receivedPermissions.3.target:
-        "0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
      receivedPermissions.3.from:
+        "0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
      receivedPermissions.2.target:
-        "0x83Cb1531Ec8447366501aE440478da245EcffB89"
      receivedPermissions.2.from:
+        "0x83Cb1531Ec8447366501aE440478da245EcffB89"
      receivedPermissions.1.target:
-        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      receivedPermissions.1.from:
+        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      receivedPermissions.0.target:
-        "0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
      receivedPermissions.0.from:
+        "0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
      issuedPermissions.0.to:
+        "0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390"
    }
```

Generated with discovered.json: 0x50fc71a5e2f32dfe52e2b340d4db6080686d0e8d

# Diff at Mon, 14 Oct 2024 10:58:09 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xfdcc7775fea6ed53c90da50c4e8dfc0660ab84c65f6075ede59ccf78ae8dd45d"]
    }
```

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0x04c2a817fae899931571f8d2f3655b50f10a544cc9281094bf0e5fd5b2c7a173","0xd8f53791fc9bb0df1c3d903f577e3d06a232910af94919846aa5ede33e425de5","0x96364e118ebcb69d8bbaa8ce71f6639d303a031f47258821d77892edd89bb476","0x6578bc6e4cf4cc0ec7d845733d5337fcc6896e629499a4af73d602cac922868d"]
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0x0ed1646d0bc938555ef2ea51e53f8a3440effc46825b7a79ee787ee9decb8cd3"]
    }
```

```diff
    contract ZkSwapListing (0x8aA2C56dca9d59F4317c2fad632c192b18127709) {
    +++ description: None
      sourceHashes:
+        ["0xce4af2ec88a2ba33052ea9fe2da9580a88710e57fb6946fb00d5740600e11ee2"]
    }
```

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      sourceHashes:
+        ["0x1359a771e28c9c71730920ab6bee9509009c60908022ff865419a483f74f702b"]
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xcd9df57c71f79c48ecc98c2cbcbd634ca80c87f8e1fcde7d3a5082750f2ab1db"]
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0x86e6238a6b2cd0e01b10a66c120be7cfb092bbeb23c0b83e457b160062477b45"]
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xb46d8e739a276f260a8ac84136cd5b77d6b72025b08d7f524318665af69fa116"]
    }
```

```diff
    contract ZksToken (0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6) {
    +++ description: None
      sourceHashes:
+        ["0xa7344a41ac050b7f10b2dd12807615cd0dbfd63e480cacec2c8a30dd7845522e"]
    }
```

Generated with discovered.json: 0x041d7a092df07a886f8438bf8cc2dc987d9b949a

# Diff at Tue, 01 Oct 2024 11:12:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x44efff2cc9524f5be116c90c0fc0466325c6aa38

# Diff at Fri, 30 Aug 2024 08:01:46 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      receivedPermissions.5.via:
-        []
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

Generated with discovered.json: 0x62764b82256f5462e2863fc1c49d4a5e0c82ff44

# Diff at Fri, 23 Aug 2024 09:56:37 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0xc28f08d411615cb59d491c644eaf66871e4a34da

# Diff at Wed, 21 Aug 2024 10:06:46 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract VerifierExit (0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81","0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8","0x83Cb1531Ec8447366501aE440478da245EcffB89","0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af","0xc07f850b60E0EEd49a09E455b01a869C25963735","0xc632347cc96A4400653E3514eA148630455295b5"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81","via":[]},{"permission":"upgrade","target":"0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8","via":[]},{"permission":"upgrade","target":"0x83Cb1531Ec8447366501aE440478da245EcffB89","via":[]},{"permission":"upgrade","target":"0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af","via":[]},{"permission":"upgrade","target":"0xc07f850b60E0EEd49a09E455b01a869C25963735","via":[]},{"permission":"upgrade","target":"0xc632347cc96A4400653E3514eA148630455295b5","via":[]}]
    }
```

```diff
    contract Verifier (0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

```diff
    contract ZkSeaNFT (0xc632347cc96A4400653E3514eA148630455295b5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390","via":[]}]
    }
```

Generated with discovered.json: 0x7a89a61b5eae1b93ecc0a9701bbc4dd4f4e743c1

# Diff at Fri, 09 Aug 2024 12:03:11 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      assignedPermissions.upgrade.5:
-        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
+        "0xc632347cc96A4400653E3514eA148630455295b5"
      assignedPermissions.upgrade.4:
-        "0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
+        "0xc07f850b60E0EEd49a09E455b01a869C25963735"
      assignedPermissions.upgrade.3:
-        "0x83Cb1531Ec8447366501aE440478da245EcffB89"
+        "0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
      assignedPermissions.upgrade.2:
-        "0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af"
+        "0x83Cb1531Ec8447366501aE440478da245EcffB89"
      assignedPermissions.upgrade.1:
-        "0xc07f850b60E0EEd49a09E455b01a869C25963735"
+        "0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"
      assignedPermissions.upgrade.0:
-        "0xc632347cc96A4400653E3514eA148630455295b5"
+        "0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81"
    }
```

Generated with discovered.json: 0xde560b5d43ada0240d72357de990e733602d85fb

# Diff at Fri, 09 Aug 2024 10:13:09 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20432700
- current block number: 20432700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432700 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81","0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8","0x83Cb1531Ec8447366501aE440478da245EcffB89","0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af","0xc07f850b60E0EEd49a09E455b01a869C25963735","0xc632347cc96A4400653E3514eA148630455295b5"]
      assignedPermissions.upgrade:
+        ["0xc632347cc96A4400653E3514eA148630455295b5","0xc07f850b60E0EEd49a09E455b01a869C25963735","0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af","0x83Cb1531Ec8447366501aE440478da245EcffB89","0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81","0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8"]
    }
```

Generated with discovered.json: 0x5d346081462a1243e5452d82503028ed73d57709

# Diff at Tue, 16 Jan 2024 12:44:46 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@c032360868b807a04d2314b95327fc167e7f7c31 block: 18220342
- current block number: 19019529

## Description

Ignore token-related values.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18220342 (main branch discovery), not current.

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
      values.totalPairTokens:
-        64
    }
```

```diff
    contract Governance (0x83Cb1531Ec8447366501aE440478da245EcffB89) {
      values.totalUserTokens:
-        41
    }
```

```diff
    contract ZkSwapListing (0x8aA2C56dca9d59F4317c2fad632c192b18127709) {
      values.listingCount:
-        64
      derivedName:
+        "ZkSwapListing"
    }
```

```diff
    contract UniswapV2Factory (0xc07f850b60E0EEd49a09E455b01a869C25963735) {
      values.allPairsLength:
-        64
    }
```

# Diff at Tue, 26 Sep 2023 13:47:45 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract ZkSync (0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8) {
      values.revertedBlocks:
+        [{"totalBlocksCommitted":13463,"totalBlocksVerified":13461}]
    }
```

