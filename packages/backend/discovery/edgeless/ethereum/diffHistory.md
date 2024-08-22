Generated with discovered.json: 0x7c6e21bcaa06a1abcbe3ba796420b651e7919971

# Diff at Thu, 22 Aug 2024 11:51:34 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 20525344
- current block number: 20583954

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20525344 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBL4joOU9aS9yzzZL/uE5mvNkreZ1bz331f4bv8mEqfsvCxuG47A9V5948qg/7skexRhdRYgoiIqMyuiIl0LeFyeUCmcD9BXhi7lco4q5PzJHaHHHxnJofKncKT5wMziqBkzFLoIWLXhoE6j8BOUfOX7EQqnOCSJjqq7hnj7o307gKWrNw63l9XD4Aulzw+MoxTzxDEL8CLA71jp+2d6r6lesVtk4+IAd4CLOgysC0hJhSyRajOlq/r0LKtgFs7NNwMuFf8pzp6DHy7QirCbP1KOtDE813xW3lt2tEL0tb3kWbQUasHSPdsPYFS8v21RXg7Htow2LF7asLJtYnKmzGEN2D4pJq5+hJbJxATrO7aq3XrctjBLSWhrtIwjIVcNwg=="]
    }
```

Generated with discovered.json: 0x66d33384f719296a382ae511ccfc3184ec4fe4ec

# Diff at Wed, 21 Aug 2024 10:02:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20525344
- current block number: 20525344

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20525344 (main branch discovery), not current.

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5e8749760c5051fF80b73319cCf4d05ef9959563","0x6B595398152999bBc759D5D8ed8169793F915488","0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","0x893057442A952E3254CA53d007AD6BBB502f557e","0x99790790B030CF116efed1c7577e2262072EfCc9","0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","0xc213d433802ea473e23623476b26FB12e9B4eFe6","0xf51551afD112a50Fc5EDa0454111078fE6E6096E"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5e8749760c5051fF80b73319cCf4d05ef9959563","via":[]},{"permission":"upgrade","target":"0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","via":[]},{"permission":"upgrade","target":"0x6B595398152999bBc759D5D8ed8169793F915488","via":[]},{"permission":"upgrade","target":"0x893057442A952E3254CA53d007AD6BBB502f557e","via":[]},{"permission":"upgrade","target":"0x99790790B030CF116efed1c7577e2262072EfCc9","via":[]},{"permission":"upgrade","target":"0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","via":[]},{"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","via":[]},{"permission":"upgrade","target":"0xf51551afD112a50Fc5EDa0454111078fE6E6096E","via":[]},{"permission":"upgrade","target":"0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","via":[]},{"permission":"upgrade","target":"0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","via":[]}]
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","0x7E0bc314535f430122caFEF18eAbd508d62934bf","0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","via":[]},{"permission":"upgrade","target":"0x7E0bc314535f430122caFEF18eAbd508d62934bf","via":[]},{"permission":"upgrade","target":"0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","via":[]},{"permission":"upgrade","target":"0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b","via":[]}]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x890025891508a463A636f81D2f532a97210240de"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x890025891508a463A636f81D2f532a97210240de","via":[]}]
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

Generated with discovered.json: 0xf68de6fda4db9aeaadbbad8a5d10b29255daddd8

# Diff at Wed, 14 Aug 2024 07:23:14 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e32dcc268a9af9f45ad205490c9d650c487e04f1 block: 20318530
- current block number: 20525344

## Description

The EOA that was able to execute upgrades was removed. Now there's only the 3/4 multisig left.

## Watched changes

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xa43ce4721Ac0faB33E8636e0DDB55E76e3EFF461"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
    }
```

Generated with discovered.json: 0x7458ebca3950e7d7a4d2441bdab89761c5e16de1

# Diff at Fri, 09 Aug 2024 11:59:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20318530
- current block number: 20318530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20318530 (main branch discovery), not current.

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      assignedPermissions.upgrade.9:
-        "0x893057442A952E3254CA53d007AD6BBB502f557e"
+        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
      assignedPermissions.upgrade.8:
-        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      assignedPermissions.upgrade.7:
-        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
+        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
      assignedPermissions.upgrade.5:
-        "0x6B595398152999bBc759D5D8ed8169793F915488"
+        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
      assignedPermissions.upgrade.4:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x99790790B030CF116efed1c7577e2262072EfCc9"
      assignedPermissions.upgrade.3:
-        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
+        "0x893057442A952E3254CA53d007AD6BBB502f557e"
      assignedPermissions.upgrade.2:
-        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
+        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
      assignedPermissions.upgrade.1:
-        "0x99790790B030CF116efed1c7577e2262072EfCc9"
+        "0x6B595398152999bBc759D5D8ed8169793F915488"
      assignedPermissions.upgrade.0:
-        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
+        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227"
+        "0x7E0bc314535f430122caFEF18eAbd508d62934bf"
      assignedPermissions.upgrade.0:
-        "0x7E0bc314535f430122caFEF18eAbd508d62934bf"
+        "0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227"
    }
```

Generated with discovered.json: 0x6904195e587c378f852b66fd64ec149869508185

# Diff at Fri, 09 Aug 2024 10:09:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20318530
- current block number: 20318530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20318530 (main branch discovery), not current.

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5e8749760c5051fF80b73319cCf4d05ef9959563","0x6B595398152999bBc759D5D8ed8169793F915488","0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","0x893057442A952E3254CA53d007AD6BBB502f557e","0x99790790B030CF116efed1c7577e2262072EfCc9","0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","0xc213d433802ea473e23623476b26FB12e9B4eFe6","0xf51551afD112a50Fc5EDa0454111078fE6E6096E"]
      assignedPermissions.upgrade:
+        ["0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","0x99790790B030CF116efed1c7577e2262072EfCc9","0xf51551afD112a50Fc5EDa0454111078fE6E6096E","0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","0xc213d433802ea473e23623476b26FB12e9B4eFe6","0x6B595398152999bBc759D5D8ed8169793F915488","0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","0x5e8749760c5051fF80b73319cCf4d05ef9959563","0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","0x893057442A952E3254CA53d007AD6BBB502f557e"]
    }
```

```diff
    contract ExecutorMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0xA61A62352FAF6AD883A8D36975cf39cDEB477D25","0xC616EA9D34ec12D6879A9DE7910CA9Bf5f28C9E7"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0xA61A62352FAF6AD883A8D36975cf39cDEB477D25","0xC616EA9D34ec12D6879A9DE7910CA9Bf5f28C9E7"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","0x7E0bc314535f430122caFEF18eAbd508d62934bf","0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"]
      assignedPermissions.upgrade:
+        ["0x7E0bc314535f430122caFEF18eAbd508d62934bf","0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"]
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x890025891508a463A636f81D2f532a97210240de"]
      assignedPermissions.upgrade:
+        ["0x890025891508a463A636f81D2f532a97210240de"]
    }
```

Generated with discovered.json: 0x0c9702e1fa67068c11beb0c68343eb720b10fa4f

# Diff at Tue, 30 Jul 2024 11:11:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20318530
- current block number: 20318530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20318530 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0x851dddada727016068d89b57be2a2b27fd730c3c

# Diff at Tue, 16 Jul 2024 10:40:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20318530

## Description

Orbit chain with investment strategies baked in the deposit contract.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExecutorMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WrappedToken (0xcD0aa40948c662dEDd9F157085fd6369A255F2f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086)
    +++ description: State batches / commitments get posted here.
```
