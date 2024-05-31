Generated with discovered.json: 0x1de79ace616f10bb275665d3e223e2f7b9555b6c

# Diff at Thu, 30 May 2024 21:14:50 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@95f6b3cb82fafd7d8a66bb00c4812b8c0f2475a5 block: 19983331
- current block number: 19985265

## Description

Admin fetching bug fix, ignore discovery values. 

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19983331 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.instances.5.1:
-        1717080167
      values.instances.4.1:
-        1717080191
      values.instances.3.1:
-        1716720623
      values.instances.2.1:
-        1716625511
      values.instances.1.1:
-        1716802247
      values.instances.0.1:
-        1715680091
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

Generated with discovered.json: 0x3c58d71994fa7ba68b7629963e8d666c48d91dcd

# Diff at Thu, 30 May 2024 14:43:53 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19983331

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract PEMCertChainLib (0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a)
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
```

```diff
+   Status: CREATED
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SigVerifyLib (0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TierProvider (0x4cffe56C947E26D07C14020499776DB3e9AE3a23)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProverSet (0x500735343372Dd6c9B84dBc7a75babf4479742B9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c)
    +++ description: Verifier contract for blocks proven by Guardian minority.
```

```diff
+   Status: CREATED
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9)
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
```

```diff
+   Status: CREATED
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81)
    +++ description: Verifier contract for SGX proven blocks.
```

```diff
+   Status: CREATED
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC)
    +++ description: Verifier contract for Guardian proven blocks.
```

```diff
+   Status: CREATED
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa)
    +++ description: None
```
