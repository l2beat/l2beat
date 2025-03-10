Generated with discovered.json: 0x13dd4fecce245de18bde2cd96afe1d5584868d34

# Diff at Tue, 04 Mar 2025 13:38:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@40abad0e9dad8439d751a811eb767233c5a70a2f block: 21938094
- current block number: 21973872

## Description

Taiko admin multisig signer change.

## Watched changes

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.$members.0:
-        "0xb47fE76aC588101BFBdA9E68F66433bA51E8029a"
+        "0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
    }
```

```diff
-   Status: DELETED
    contract Safe (0xb47fE76aC588101BFBdA9E68F66433bA51E8029a)
    +++ description: None
```

## Source code changes

```diff
.../.flat@21938094/Safe/Safe.sol => /dev/null      | 1088 --------------------
 .../Safe/SafeProxy.p.sol => /dev/null              |   37 -
 2 files changed, 1125 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21938094 (main branch discovery), not current.

```diff
    contract PEMCertChainLib (0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169) {
    +++ description: None
      sinceBlock:
+        19773966
    }
```

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sinceBlock:
+        19773965
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      sinceBlock:
+        19731197
    }
```

```diff
    contract MainnetProverSet (0x280eAbfd252f017B78e15b69580F249F45FB55Fa) {
    +++ description: None
      sinceBlock:
+        21835609
    }
```

```diff
    contract MainnetTierRouter (0x44d307a9ec47aA55a7a30849d065686753C86Db6) {
    +++ description: None
      sinceBlock:
+        21913221
    }
```

```diff
    contract SigVerifyLib (0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9) {
    +++ description: None
      sinceBlock:
+        19773966
    }
```

```diff
    contract Risc0Verifier (0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc) {
    +++ description: None
      sinceBlock:
+        21127238
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      sinceBlock:
+        19773965
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      sinceBlock:
+        19773964
    }
```

```diff
    contract SP1Verifier (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452) {
    +++ description: None
      sinceBlock:
+        21141069
    }
```

```diff
    contract SP1RemoteVerifier (0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371) {
    +++ description: None
      sinceBlock:
+        21613149
    }
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities.
      sinceBlock:
+        19911920
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      sinceBlock:
+        19773966
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      sinceBlock:
+        19773963
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      sinceBlock:
+        19744335
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      sinceBlock:
+        19773963
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      sinceBlock:
+        19773965
    }
```

```diff
    contract Safe (0xb47fE76aC588101BFBdA9E68F66433bA51E8029a) {
    +++ description: None
      sinceBlock:
+        21278465
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      sinceBlock:
+        19773963
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      sinceBlock:
+        19773965
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      sinceBlock:
+        19773963
    }
```

```diff
    contract RiscZeroGroth16Verifier (0xf31DE43cc0cF75245adE63d3Dabf58d4332855e9) {
    +++ description: None
      sinceBlock:
+        21613126
    }
```

Generated with discovered.json: 0x0053ad113edc05a21195e9b85a7648cb175ce75f

# Diff at Thu, 27 Feb 2025 13:52:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7afe405a4930423077d17ed79971752d0831e02a block: 21844977
- current block number: 21938094

## Description

The forced zk tiers for the DAO fallback proposer have been removed. Any proposer/challenger/prover can choose among the 5 tiers:
- tiers_[0] = LibTiers.TIER_SGX;
- tiers_[1] = LibTiers.TIER_ZKVM_RISC0;
- tiers_[2] = LibTiers.TIER_ZKVM_SP1;
- tiers_[3] = LibTiers.TIER_GUARDIAN_MINORITY;
- tiers_[4] = LibTiers.TIER_GUARDIAN;

Update MainnetTierRouter with new cooldown and proving periods, new validity bond values (see above which tiers are active):

| Tier | Parameter | Before | After |
|------|-----------|--------|-------|
| **TIER_OPTIMISTIC** | validityBond | 75 TKO | 50 TKO |
|  | contestBond | 492.19 TKO | 328.13 TKO |
|  | cooldownPeriod | 24 hours | 24 hours |
|  | provingPeriod | 4.25 hours | 1 hour |
| **TEE Tiers** (SGX, TDX, TEE_ANY) | validityBond | 150 TKO | 100 TKO |
|  | contestBond | 984.38 TKO | 656.25 TKO |
|  | cooldownPeriod | 4 hours | 4 hours |
|  | provingPeriod | 5 hours | 5 hours |
| **ZKVM Tiers** (RISC0, SP1, ANY, AND_TEE) | validityBond | 225 TKO | 150 TKO |
|  | contestBond | 1476.56 TKO | 984.38 TKO |
|  | cooldownPeriod | 4 hours | 4 hours |
|  | provingPeriod | 7 hours | 7 hours |
| **TIER_GUARDIAN_MINORITY** | validityBond | 225 TKO | 200 TKO |
|  | contestBond | 1476.56 TKO | 1312.5 TKO |
|  | cooldownPeriod | 4 hours | 4 hours |
|  | provingPeriod | 0 hours | 2 hours |
| **TIER_GUARDIAN** | validityBond | 0 TKO | 0 TKO |
|  | contestBond | 0 TKO | 0 TKO |
|  | cooldownPeriod | 4 hours | 8 hours |
|  | provingPeriod | 0 hours | 0 hours |

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xb0f9a7fd86a26f933460b09bf9ddb6f3fcb1926850109b97c24801d6230186e3"
+        "0x8c8d91a3b010953954bbd3ba9f4c55f76112bf6d7f298dcd584c2de94a4ad1a4"
      values.$implementation:
-        "0x2784423f7c61Bc7B75dB6CdA26959946f437588D"
+        "0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"
      values.$pastUpgrades.23:
+        ["2025-02-27T03:27:23.000Z","0x6368890b9aa2f87c6a6b727efdd8af0ea357a11460b546d8a7f3e19e38a34e41",["0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"]]
      values.$upgradeCount:
-        23
+        24
      values.impl:
-        "0x2784423f7c61Bc7B75dB6CdA26959946f437588D"
+        "0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"
      values.tier_router:
-        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
+        "0x44d307a9ec47aA55a7a30849d065686753C86Db6"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x44d307a9ec47aA55a7a30849d065686753C86Db6)
    +++ description: None
```

## Source code changes

```diff
.../MainnetTierRouter.sol                          | 92 ++++++++++------------
 .../TaikoL1Contract/MainnetTaikoL1.sol             |  2 +-
 2 files changed, 41 insertions(+), 53 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21844977 (main branch discovery), not current.

```diff
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f7a6b766d5f72697363300000000000000000000000000000000000"],["0x746965725f7a6b766d5f73703100000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
      values.TIER_RISC0:
-        {"verifierName":"0x746965725f7a6b766d5f72697363300000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SP1:
-        {"verifierName":"0x746965725f7a6b766d5f73703100000000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_RISC0":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SP1":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0xda5cba7130c3b689c9358371f2d5d13f14e6e2e3

# Diff at Fri, 14 Feb 2025 13:24:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 21630233
- current block number: 21844977

## Description

TaikoL1 upgrade:
- old proposeBlock() removed
- formatting, comments, small fixes

TierRouter:
- RISC0 from 1/200 to 1/1000
- SP1 from 1/40 to 1/10
...of daofallback proposer batches

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0x5ced94c638514ff09ace408fda7efb4bd52077a7e9ce2f20e154419454ac3869"
+        "0xb0f9a7fd86a26f933460b09bf9ddb6f3fcb1926850109b97c24801d6230186e3"
      values.$implementation:
-        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
+        "0x2784423f7c61Bc7B75dB6CdA26959946f437588D"
      values.$pastUpgrades.22:
+        ["2025-02-13T06:57:47.000Z","0xc0e8ec30d1479ca2414d4d28a09a543c2845247d80387f78c179d663ffe55c3c",["0x2784423f7c61Bc7B75dB6CdA26959946f437588D"]]
      values.$upgradeCount:
-        22
+        23
      values.impl:
-        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
+        "0x2784423f7c61Bc7B75dB6CdA26959946f437588D"
      values.prover_set:
-        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
+        "0x280eAbfd252f017B78e15b69580F249F45FB55Fa"
      values.tier_router:
-        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
+        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0)
    +++ description: None
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities.
      sourceHashes.1:
-        "0x62ec48ec56b8eb6e604ca35e87dca2922adb6e914b1922139a0ae932750abd61"
+        "0x397ca5d98f464f3096b2ba95f9057ebbc27c56e4d878ebbae83c911594dd7c5b"
      values.$implementation:
-        "0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"
+        "0x280eAbfd252f017B78e15b69580F249F45FB55Fa"
      values.$pastUpgrades.10:
+        ["2025-02-13T06:57:47.000Z","0xc0e8ec30d1479ca2414d4d28a09a543c2845247d80387f78c179d663ffe55c3c",["0x280eAbfd252f017B78e15b69580F249F45FB55Fa"]]
      values.$upgradeCount:
-        10
+        11
      values.impl:
-        "0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"
+        "0x280eAbfd252f017B78e15b69580F249F45FB55Fa"
    }
```

```diff
-   Status: DELETED
    contract MainnetProverSet (0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetProverSet (0x280eAbfd252f017B78e15b69580F249F45FB55Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66)
    +++ description: None
```

## Source code changes

```diff
.../DAOFallbackProposer/MainnetProverSet.sol       |    2 +-
 .../{.flat@21630233 => .flat}/MainnetProverSet.sol | 1060 ++++---
 .../MainnetTierRouter.sol                          |    4 +-
 .../TaikoL1Contract/MainnetTaikoL1.sol             | 3306 +++++++++++++-------
 4 files changed, 2733 insertions(+), 1639 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630233 (main branch discovery), not current.

```diff
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f7a6b766d5f72697363300000000000000000000000000000000000"],["0x746965725f7a6b766d5f73703100000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
      values.TIER_RISC0:
-        {"verifierName":"0x746965725f7a6b766d5f72697363300000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SP1:
-        {"verifierName":"0x746965725f7a6b766d5f73703100000000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_RISC0":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SP1":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0x8a1c79501de149df651427ca05a7b5a7261674a2

# Diff at Mon, 20 Jan 2025 11:10:16 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21630233
- current block number: 21630233

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630233 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract Risc0Verifier (0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SP1Verifier (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities.
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.13.target:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.13.from:
+        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.12.target:
-        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
      receivedPermissions.12.from:
+        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
      receivedPermissions.11.target:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      receivedPermissions.11.from:
+        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      receivedPermissions.10.target:
-        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
      receivedPermissions.10.from:
+        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
      receivedPermissions.9.target:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      receivedPermissions.9.from:
+        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      receivedPermissions.8.target:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      receivedPermissions.8.from:
+        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      receivedPermissions.7.target:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.7.from:
+        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.6.target:
-        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      receivedPermissions.6.from:
+        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      receivedPermissions.5.target:
-        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
      receivedPermissions.5.from:
+        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
      receivedPermissions.4.target:
-        "0x579f40D0BE111b823962043702cabe6Aaa290780"
      receivedPermissions.4.from:
+        "0x579f40D0BE111b823962043702cabe6Aaa290780"
      receivedPermissions.3.target:
-        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
      receivedPermissions.3.from:
+        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
      receivedPermissions.2.target:
-        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
      receivedPermissions.2.from:
+        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
      receivedPermissions.1.target:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      receivedPermissions.1.from:
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      receivedPermissions.0.target:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      receivedPermissions.0.from:
+        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

Generated with discovered.json: 0x708458d8bd375f8f63e7efac661f610f1b8e307a

# Diff at Wed, 15 Jan 2025 13:39:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21543865
- current block number: 21630233

## Description

Upgrade of both RISC0 and SP1 verifier contracts.

### SP1Verifier

v3.0.0 -> v4.0.0-rc.3

All-new verifier with new verifier hash: https://github.com/succinctlabs/sp1/releases/tag/v4.0.0-rc.1 ('not production ready').

### RiscZeroGroth16Verifier

v1.1.2 -> v1.2.0

Adds a new Interface `IRiscZeroSelectable` for easily querying the selector. No changes to the zk verification itself 

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.sp1_remote_verifier:
-        "0x2D33d748644dAb8B3FB0E07642d9dE96b816d067"
+        "0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371"
      values.verifier_RISCZERO_GROTH16_VERIFIER:
-        "0xcF706D99C265fC2349AE43c5f6BFD7931FE5308D"
+        "0xf31DE43cc0cF75245adE63d3Dabf58d4332855e9"
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0x2D33d748644dAb8B3FB0E07642d9dE96b816d067)
    +++ description: None
```

```diff
    contract SP1Verifier (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452) {
    +++ description: None
      values.sp1RemoteVerifier:
-        "0x2D33d748644dAb8B3FB0E07642d9dE96b816d067"
+        "0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371"
    }
```

```diff
-   Status: DELETED
    contract RiscZeroGroth16Verifier (0xcF706D99C265fC2349AE43c5f6BFD7931FE5308D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1RemoteVerifier (0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (0xf31DE43cc0cF75245adE63d3Dabf58d4332855e9)
    +++ description: None
```

## Source code changes

```diff
.../RiscZeroGroth16Verifier.sol                    | 19 ++++++++--
 .../SP1RemoteVerifier.sol}                         | 42 +++++++++++-----------
 .../SP1Verifier}/ERC1967Proxy.p.sol                |  0
 .../SP1Verifier}/SP1Verifier.sol                   |  0
 4 files changed, 38 insertions(+), 23 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21543865 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x2D33d748644dAb8B3FB0E07642d9dE96b816d067) {
    +++ description: None
      name:
-        "SP1RemoteVerifier"
+        "SP1Verifier"
    }
```

Generated with discovered.json: 0x3af5b8c874ed7b4ffc3fba396a08c1387641f74f

# Diff at Fri, 03 Jan 2025 12:10:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f2f208ac8a91552305da5e03332108446838b892 block: 21486439
- current block number: 21543865

## Description

MS signer change.

## Watched changes

```diff
    contract Safe (0xb47fE76aC588101BFBdA9E68F66433bA51E8029a) {
    +++ description: None
      values.$members.0:
-        "0x55d79345Afc87806B690C9f96c4D7BfE2Bca8268"
+        "0x30bc4C0Baf55A37Ccf2d626Bc592bd7715b75De2"
    }
```

Generated with discovered.json: 0xa77a20fd111c2d69a312bfc27d0b3bb57907dba5

# Diff at Thu, 26 Dec 2024 11:48:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e29d1319d91d7959f43ee6476f8bc351dd60d254 block: 21471383
- current block number: 21486439

## Description

Tiny change in the MainnetTierRouter, resetting the probabilities for forced validity proofs via the DAO proposer to the old ~1/200, ~1/40 for RISC0 and SP1 respectively. No other changes.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xad202d72005832c623578708f77802197e8a681c1621f57c1106161858ba2dca"
+        "0x5ced94c638514ff09ace408fda7efb4bd52077a7e9ce2f20e154419454ac3869"
      values.$implementation:
-        "0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"
+        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
      values.$pastUpgrades.21:
+        ["2024-12-24T14:19:11.000Z","0x77871837d1749b22a7991da475e657baa4371937f5a8cb094d4e170db000cb25",["0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"]]
      values.$upgradeCount:
-        21
+        22
      values.impl:
-        "0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"
+        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
      values.tier_router:
-        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
+        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0)
    +++ description: None
```

## Source code changes

```diff
.../taiko/ethereum/{.flat@21471383 => .flat}/MainnetTierRouter.sol    | 4 ++--
 .../{.flat@21471383 => .flat}/TaikoL1Contract/MainnetTaikoL1.sol      | 2 +-
 2 files changed, 3 insertions(+), 3 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21471383 (main branch discovery), not current.

```diff
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f7a6b766d5f72697363300000000000000000000000000000000000"],["0x746965725f7a6b766d5f73703100000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
      values.TIER_RISC0:
-        {"verifierName":"0x746965725f7a6b766d5f72697363300000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SP1:
-        {"verifierName":"0x746965725f7a6b766d5f73703100000000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_RISC0":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SP1":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0xfd29c8ce35d6e4ecf0081c09c3e9e4dbe718e3a8

# Diff at Tue, 24 Dec 2024 09:17:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@799e77243e46787b5be6a47a301a3e1069bfa010 block: 21465570
- current block number: 21471383

## Description

Validity proofs reinstated as before (same SP1 and RISC0 contracts), but with new probabilities for the DAO proposer: RISC0 ~1/1000 and SP1 ~1/100.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xeeb07b10bec4783237afadc9ac7b0e746138695fef1f85996e97012e2e83b6df"
+        "0xad202d72005832c623578708f77802197e8a681c1621f57c1106161858ba2dca"
      values.$implementation:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"
      values.$pastUpgrades.20:
+        ["2024-12-23T14:55:47.000Z","0x9c2f36af40c0004110041fc45d980b73b0c8dde8064713a55aeb6f69fca77a99",["0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"]]
      values.$upgradeCount:
-        20
+        21
      values.impl:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"
      values.tier_router:
-        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
+        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@21465570 => .flat}/MainnetTierRouter.sol    | 18 +++++++++++++-----
 .../TaikoL1Contract/MainnetTaikoL1.sol                 |  2 +-
 2 files changed, 14 insertions(+), 6 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465570 (main branch discovery), not current.

```diff
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
      values.TIER_RISC0:
-        {"verifierName":"0x746965725f7a6b766d5f72697363300000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SP1:
-        {"verifierName":"0x746965725f7a6b766d5f73703100000000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_RISC0":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SP1":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0xfb12a68660b6a4aa06afff957e7c62a02790766d

# Diff at Mon, 23 Dec 2024 13:46:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21334445
- current block number: 21465570

## Description

New TierRouter, removing all validity proofs, leaving only SGX (minTier) and Guardians.

New DAOFallbackProposer refactors some minor things and deprecates the v1 proposals (only v2 possible).

Other changes are only related to the new TierRouter address.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0x5ced94c638514ff09ace408fda7efb4bd52077a7e9ce2f20e154419454ac3869"
+        "0xeeb07b10bec4783237afadc9ac7b0e746138695fef1f85996e97012e2e83b6df"
      values.$implementation:
-        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
+        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.$pastUpgrades.19:
+        ["2024-12-23T03:12:35.000Z","0xe66aba9f8bfcd86dc0ae32416862ca61a51c47f8ec747799e65f155ef27eeb20",["0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"]]
      values.$pastUpgrades.18:
+        ["2024-12-23T02:45:11.000Z","0xfa949022e61921e108974e73130e94fc5120463f2c537d26626e5cee2120c944",["0xb74A66b6CF50AD63E29669F0BDE4354E11758162"]]
      values.$upgradeCount:
-        18
+        20
      values.impl:
-        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
+        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.tier_router:
-        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
+        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0)
    +++ description: None
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      sourceHashes.1:
-        "0xe3ef3bce11823157fe0b3d8d8705554e47a8789445c2a255990ca15564e7e945"
+        "0x9dede6e55b7b0db6226ea3cead125c4750d147ad96cef774a61e51e8e9ce6d36"
      values.$implementation:
-        "0x52CA3c5566d779b3c6bb5c4f760Ea39E294Fc788"
+        "0x0079a79E5d8DDA67029051d505E5A11DE279B36D"
      values.$pastUpgrades.10:
+        ["2024-12-23T02:45:11.000Z","0xfa949022e61921e108974e73130e94fc5120463f2c537d26626e5cee2120c944",["0x0079a79E5d8DDA67029051d505E5A11DE279B36D"]]
      values.$upgradeCount:
-        10
+        11
      values.impl:
-        "0x52CA3c5566d779b3c6bb5c4f760Ea39E294Fc788"
+        "0x0079a79E5d8DDA67029051d505E5A11DE279B36D"
    }
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities.
      sourceHashes.1:
-        "0x6c2e43f356e499e332ee9b82cb8ae970dbe6209146e72d925e9d9f22f5b791e1"
+        "0x62ec48ec56b8eb6e604ca35e87dca2922adb6e914b1922139a0ae932750abd61"
      values.$implementation:
-        "0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"
+        "0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"
      values.$pastUpgrades.9:
+        ["2024-12-23T02:45:11.000Z","0xfa949022e61921e108974e73130e94fc5120463f2c537d26626e5cee2120c944",["0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"]]
      values.$upgradeCount:
-        9
+        10
      values.impl:
-        "0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"
+        "0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"
    }
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542)
    +++ description: None
```

## Source code changes

```diff
.../DAOFallbackProposer/MainnetProverSet.sol       | 138 ++++++++++++---------
 .../MainnetRollupAddressManager.sol                |   2 +-
 .../MainnetTierRouter.sol                          |  18 +--
 .../TaikoL1Contract/MainnetTaikoL1.sol             |   2 +-
 4 files changed, 85 insertions(+), 75 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21334445 (main branch discovery), not current.

```diff
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f7a6b766d5f72697363300000000000000000000000000000000000"],["0x746965725f7a6b766d5f73703100000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
      values.TIER_RISC0:
-        {"verifierName":"0x746965725f7a6b766d5f72697363300000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SP1:
-        {"verifierName":"0x746965725f7a6b766d5f73703100000000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_RISC0":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SP1":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0xb743e863628c6723e5473668100ddb074e410ed7

# Diff at Thu, 05 Dec 2024 06:17:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 21215436
- current block number: 21334445

## Description

One TaikoAdmin MS member changed to a sub-safe.

## Watched changes

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.$members.0:
-        "0x55d79345Afc87806B690C9f96c4D7BfE2Bca8268"
+        "0xb47fE76aC588101BFBdA9E68F66433bA51E8029a"
    }
```

```diff
+   Status: CREATED
    contract Safe (0xb47fE76aC588101BFBdA9E68F66433bA51E8029a)
    +++ description: None
```

## Source code changes

```diff
.../taiko/ethereum/.flat/Safe/Safe.sol             | 1088 ++++++++++++++++++++
 .../taiko/ethereum/.flat/Safe/SafeProxy.p.sol      |   37 +
 2 files changed, 1125 insertions(+)
```

Generated with discovered.json: 0xea65667fba3c7f9645243f698b73ace7a9ceb06a

# Diff at Mon, 18 Nov 2024 15:16:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b96351d6b064647cdbc4d127955822597fb5d9e0 block: 21122769
- current block number: 21215436

## Description
 
These upgrades contain the parameter changes and new deployments that activate Multiproofs, in particular the new ZK-VM tierIds 250 (ZKVM_RISC0) and 251 (ZKVM_SP1).

Current active tiers:
-  200: SGX
-  250: RISC0
-  251: SP1
-  900: guardian minority
- 1000: guardian

A higher tier can be used to challenge a lower tier before the tier-specific cooldown period has passed. A challenge resets the cooldown window for the proof.

The ZK tiers are generally not enforced and can always be contested by the higher Guardian tiers.

In the case of a block being proposed by the `DAO_FALLBACK_PROPOSER` (the ProverSetProxy contract that is used by Taiko and proposes almost all batches), the **minimum proof tier** is determined pseudorandomly at the time of a batch proposal based on a hash depending on the number of blocks in the batch (`keccak256(abi.encode("TAIKO_DIFFICULTY", local.b.numBlocks))`). It can be either of RISC0, SP1 or SGX with certain hardcoded probabilities.

Current probabilities assuming a uniformly random input (keccak256) to the function and the dao fallback proposer:
- RISC0: 0.5% or 1/200
- SP1: 2.5% or 1/40
- SGX: 97%

If any other (not dao_fallback) proposer proposes a batch by posting the required validity bond, the minimum-tier is always SGX.

Both zk-vm verifiers are currently used multiple times per day.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xeeb07b10bec4783237afadc9ac7b0e746138695fef1f85996e97012e2e83b6df"
+        "0x5ced94c638514ff09ace408fda7efb4bd52077a7e9ce2f20e154419454ac3869"
      values.$implementation:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
      values.$pastUpgrades.17:
+        ["2024-11-10T16:10:23.000Z","0x5eb57ab352b3e3c1ddbc3fe468d582901b88c6a137ce49b0d70857d5218d626d",["0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"]]
      values.$pastUpgrades.16:
+        ["2024-11-10T15:46:23.000Z","0x5efedb806fca83936c58f9e4d30644257ce3a529239131b0b19f630320bcfb04",["0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"]]
      values.$pastUpgrades.15:
+        ["2024-11-10T15:32:47.000Z","0xa9e285d0f2cc84161ac3fc28962003779e9a618271bd6a54b16fb4001ede5b38",["0x0205ea1e1162bc50E1030F36412E5Dd69daA4040"]]
      values.$upgradeCount:
-        15
+        18
      values.bond_token:
-        "0x0000000000000000000000000000000000000000"
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.impl:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
      values.sp1_remote_verifier:
-        "0x0000000000000000000000000000000000000000"
+        "0x2D33d748644dAb8B3FB0E07642d9dE96b816d067"
      values.tier_router:
-        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
+        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
      values.verifier_RISCZERO_GROTH16_VERIFIER:
-        "0x0000000000000000000000000000000000000000"
+        "0xcF706D99C265fC2349AE43c5f6BFD7931FE5308D"
      values.verifier_TIER_ZKVM_RISC0:
-        "0x0000000000000000000000000000000000000000"
+        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
      values.verifier_TIER_ZKVM_SP1:
-        "0x0000000000000000000000000000000000000000"
+        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      sourceHashes.1:
-        "0x5782d554c7b5637e1f166c61be43d34b6d44dabccd12fea3ed904f2988502d79"
+        "0xe3ef3bce11823157fe0b3d8d8705554e47a8789445c2a255990ca15564e7e945"
      values.$implementation:
-        "0x190D5d50D98D2202a618f75B2fD9986e60E096be"
+        "0x52CA3c5566d779b3c6bb5c4f760Ea39E294Fc788"
      values.$pastUpgrades.9:
+        ["2024-11-10T05:21:47.000Z","0x43353a74df973d8f6a379b5c8815ac80935a5099f8ab93a4aa204eb5ef2c663e",["0x52CA3c5566d779b3c6bb5c4f760Ea39E294Fc788"]]
      values.$pastUpgrades.8:
+        ["2024-11-08T08:35:47.000Z","0x5d46840df79d8df508880675e7ea549e9b46137f597ca520c3e0c979439441d1",["0x6D8e6e1a061791AD17A55De5e15a111c58f6Fb3D"]]
      values.$upgradeCount:
-        8
+        10
      values.impl:
-        "0x190D5d50D98D2202a618f75B2fD9986e60E096be"
+        "0x52CA3c5566d779b3c6bb5c4f760Ea39E294Fc788"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542)
    +++ description: None
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","target":"0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"}
      receivedPermissions.12:
+        {"permission":"upgrade","target":"0xE3D777143Ea25A6E031d1e921F396750885f43aC"}
      receivedPermissions.11.target:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      receivedPermissions.10.target:
-        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
+        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
      receivedPermissions.9.target:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      receivedPermissions.8.target:
-        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
+        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      receivedPermissions.7.target:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.6.target:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      receivedPermissions.5.target:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
      receivedPermissions.4.target:
-        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
+        "0x579f40D0BE111b823962043702cabe6Aaa290780"
      receivedPermissions.3.target:
-        "0x579f40D0BE111b823962043702cabe6Aaa290780"
+        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
      receivedPermissions.2.target:
-        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
+        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
    }
```

```diff
+   Status: CREATED
    contract SP1RemoteVerifier (0x2D33d748644dAb8B3FB0E07642d9dE96b816d067)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Risc0Verifier (0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (0xcF706D99C265fC2349AE43c5f6BFD7931FE5308D)
    +++ description: None
```

## Source code changes

```diff
.../MainnetRollupAddressManager.sol                |   68 +-
 .../MainnetTierRouter.sol                          |   18 +-
 .../.flat/Risc0Verifier/ERC1967Proxy.p.sol         |  594 +++++++
 .../ethereum/.flat/Risc0Verifier/Risc0Verifier.sol | 1823 +++++++++++++++++++
 .../ethereum/.flat/RiscZeroGroth16Verifier.sol     | 1656 ++++++++++++++++++
 .../taiko/ethereum/.flat/SP1RemoteVerifier.sol     | 1432 +++++++++++++++
 .../ethereum/.flat/SP1Verifier/ERC1967Proxy.p.sol  |  594 +++++++
 .../ethereum/.flat/SP1Verifier/SP1Verifier.sol     | 1825 ++++++++++++++++++++
 .../TaikoL1Contract/MainnetTaikoL1.sol             |    2 +-
 9 files changed, 7978 insertions(+), 34 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21122769 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.preconf_registry:
-        "0x0000000000000000000000000000000000000000"
      values.bond_token:
+        "0x0000000000000000000000000000000000000000"
      values.preconf_task_manager:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_OPTIMISTIC:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities.
      name:
-        "ProverSetProxy"
+        "DAOFallbackProposer"
      description:
-        "A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO."
+        "A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities."
    }
```

```diff
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0x24f4cff1e2dad6e4e71802e79ed4a5c720ca24aa

# Diff at Tue, 05 Nov 2024 16:54:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21027555
- current block number: 21122769

## Description

Taiko ['Ontake' upgrade](https://taiko.mirror.xyz/OJA4SwCqHjF32Zz0GkNJvnHWlsRYzdJ6hcO9FXVOpLs).
- batching (for proposing and proving)
- new verifier slots (SP1, Risc0) (0x00 atm)
- new Block struct in preconf preparations (preconfRegistry set to 0x00)
- integration of the TierProvider into the MainnetTierRouter
- new TIER_SGX challengePeriod of 4h (down from 1d)

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xa2bfa567075799db54daaa89afafea79e42c73c36c23112c79926407116d0765"
+        "0xeeb07b10bec4783237afadc9ac7b0e746138695fef1f85996e97012e2e83b6df"
      values.$implementation:
-        "0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"
+        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.$pastUpgrades.14:
+        ["2024-11-03T05:15:23.000Z","0x78ca7c7d9c7e5aa9c5e6ab80e0229289a8d3bc8df2c2b9ba6baa74a0f60a0703",["0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"]]
      values.$pastUpgrades.13:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x4229d14F520848aa83760Cf748abEB8A69cdaB2d"]]
      values.$upgradeCount:
-        13
+        15
      values.getConfig.checkEOAForCalldataDA:
-        true
      values.getConfig.maxAnchorHeightOffset:
+        64
      values.getConfig.baseFeeConfig:
+        {"adjustmentQuotient":8,"sharingPctg":75,"gasIssuancePerSecond":5000000,"minGasExcess":1340000000,"maxGasIssuancePerBlock":600000000}
      values.getConfig.ontakeForkHeight:
+        538304
      values.impl:
-        "0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"
+        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.tier_router:
-        "0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a"
+        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
    }
```

```diff
-   Status: DELETED
    contract TierProviderV2 (0x3a1A900680BaADb889202faf12915F7E47B71ddd)
    +++ description: None
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      sourceHashes.1:
-        "0xb6ed017b0bf49c547dbaa4b24efcbcd5218c26aafd94f8cf06850d009e538347"
+        "0x489b7169b5c7aa13cbb8928934057ad78b37ce9b52651656bf8bda7759533f68"
      values.$implementation:
-        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
+        "0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"
      values.$pastUpgrades.6:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"]]
      values.$upgradeCount:
-        6
+        7
      values.impl:
-        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
+        "0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      sourceHashes.1:
-        "0x06f614affc4908aeeac9faa505010855388740ee8e5ba632fbc0e5f56ee8927d"
+        "0x5782d554c7b5637e1f166c61be43d34b6d44dabccd12fea3ed904f2988502d79"
      values.$implementation:
-        "0x4f6D5D3109C07E77035B410602996e445b18E8E9"
+        "0x190D5d50D98D2202a618f75B2fD9986e60E096be"
      values.$pastUpgrades.7:
+        ["2024-11-02T12:04:59.000Z","0xf26d0526aa4b8225c603720ce0dc016803188b959c50677d5446087d1f2c4e60",["0x190D5d50D98D2202a618f75B2fD9986e60E096be"]]
      values.$pastUpgrades.6:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x3202Fc255aE09F91DbbD5b000b87dA4A2E04eE37"]]
      values.$upgradeCount:
-        6
+        8
      values.impl:
-        "0x4f6D5D3109C07E77035B410602996e445b18E8E9"
+        "0x190D5d50D98D2202a618f75B2fD9986e60E096be"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      sourceHashes.1:
-        "0x020f0e8ece4630d3f7e6458ef5f1d86c5408ed344c580633e3f32e53393ceab5"
+        "0x6c2e43f356e499e332ee9b82cb8ae970dbe6209146e72d925e9d9f22f5b791e1"
      values.$implementation:
-        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
+        "0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"
      values.$pastUpgrades.8:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"]]
      values.$upgradeCount:
-        8
+        9
      values.impl:
-        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
+        "0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"
    }
```

```diff
-   Status: DELETED
    contract TierRouter (0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a)
    +++ description: None
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      sourceHashes.1:
-        "0x3c7adf8e3200906bd67dec9e0b73fb813681e84ba1499dcede6987370ce146c9"
+        "0x0112b81e89b367f8ffeb6b571bd245b1be7a1279474ffa11591f8374a2c8b14f"
      values.$implementation:
-        "0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"
+        "0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"
      values.$pastUpgrades.7:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"]]
      values.$upgradeCount:
-        7
+        8
      values.impl:
-        "0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"
+        "0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      sourceHashes.1:
-        "0xa5cf6831e233f05c8a2f677c311dd359c75850355d61417bc5201d493db30039"
+        "0xf99b7d5f650d3734e945c5040d8e4776dfdc97ff745666e084c1d471b7973f38"
      values.$implementation:
-        "0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"
+        "0x45fed11Ba70D4217545F18E27DDAF7D76Ff499f3"
      values.$pastUpgrades.5:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x45fed11Ba70D4217545F18E27DDAF7D76Ff499f3"]]
      values.$upgradeCount:
-        5
+        6
      values.impl:
-        "0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"
+        "0x45fed11Ba70D4217545F18E27DDAF7D76Ff499f3"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      sourceHashes.1:
-        "0xdb8e8268242e52348760b0b2d154955236307b3ef1bc9cb0234fc6c0d01aa70f"
+        "0x076c7d823685a1a394ad6ec677d2d7707207efa9e8e482f479c2cdfd92008904"
      values.$implementation:
-        "0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"
+        "0x81DFEA931500cdcf0460e9EC45FA283A6B7f0838"
      values.$pastUpgrades.5:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x81DFEA931500cdcf0460e9EC45FA283A6B7f0838"]]
      values.$upgradeCount:
-        5
+        6
      values.impl:
-        "0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"
+        "0x81DFEA931500cdcf0460e9EC45FA283A6B7f0838"
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      sourceHashes.1:
-        "0x14240ef6b1d8181a009840162a21975c2777f78f27c22e8e550bc66b36357f78"
+        "0x118c20a34164db28141d7fa6496d1fcf9e139354ed77c4e1c3f33e5eaac65977"
      values.$implementation:
-        "0xAc96FF285158bceBB8573D20d853e86BB2915aF3"
+        "0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"
      values.$pastUpgrades.11:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"]]
      values.$upgradeCount:
-        11
+        12
      values.impl:
-        "0xAc96FF285158bceBB8573D20d853e86BB2915aF3"
+        "0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      sourceHashes.1:
-        "0xb6ed017b0bf49c547dbaa4b24efcbcd5218c26aafd94f8cf06850d009e538347"
+        "0x489b7169b5c7aa13cbb8928934057ad78b37ce9b52651656bf8bda7759533f68"
      values.$implementation:
-        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
+        "0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"
      values.$pastUpgrades.6:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"]]
      values.$upgradeCount:
-        6
+        7
      values.impl:
-        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
+        "0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      sourceHashes.1:
-        "0xa0dc6b4537f21ed3a4a43a7fb74645ff827cff8c2b26f2e3e4350ddec470c990"
+        "0x61eadd250e6fee2eea7d778ca5fdb6e04b0fa09044c65eba836b397f585e5535"
      values.$implementation:
-        "0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"
+        "0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"
      values.$pastUpgrades.4:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"]]
      values.$upgradeCount:
-        4
+        5
      values.impl:
-        "0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"
+        "0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"
    }
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542)
    +++ description: None
```

## Source code changes

```diff
.../MainnetGuardianProver.sol                      |  537 +++-
 .../GuardianProver/MainnetGuardianProver.sol       |  537 +++-
 .../MainnetRollupAddressManager.sol                |  305 +-
 .../MainnetSharedAddressManager.sol                |  247 +-
 .../taiko/ethereum/.flat/MainnetTierRouter.sol     |  223 ++
 .../ProverSetProxy/MainnetProverSet.sol            |  986 ++++---
 .../SgxVerifier/MainnetSgxVerifier.sol             |  467 ++-
 .../SharedERC20Vault/MainnetERC20Vault.sol         |  255 +-
 .../SignalService/MainnetSignalService.sol         |  526 ++--
 .../TaikoBridge/MainnetBridge.sol                  |  371 ++-
 .../TaikoL1Contract/MainnetTaikoL1.sol             | 3040 +++++++++++---------
 .../.flat@21027555/TierProviderV2.sol => /dev/null |  160 --
 .../.flat@21027555/TierRouter.sol => /dev/null     |   16 -
 13 files changed, 4490 insertions(+), 3180 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21027555 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.verifier_TIER_SGX_ZKVM:
-        "0x0000000000000000000000000000000000000000"
      values.preconf_registry:
+        "0x0000000000000000000000000000000000000000"
      values.sp1_remote_verifier:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_RISCZERO_GROTH16_VERIFIER:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_TDX:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_TEE_ANY:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_ZKVM_AND_TEE:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_ZKVM_ANY:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_ZKVM_RISC0:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_ZKVM_SP1:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract TierProviderV2 (0x3a1A900680BaADb889202faf12915F7E47B71ddd) {
    +++ description: None
      name:
-        "TierProvider"
+        "TierProviderV2"
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":1440,"provingWindow":2880,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"250000000000000000000","contestBond":"1640000000000000000000","cooldownWindow":240,"provingWindow":2880,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"125000000000000000000","contestBond":"250000000000000000000","cooldownWindow":1440,"provingWindow":15,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"125000000000000000000","contestBond":"820000000000000000000","cooldownWindow":1440,"provingWindow":60,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7367785f7a6b766d00000000000000000000000000000000000000","validityBond":"250000000000000000000","contestBond":"1640000000000000000000","cooldownWindow":1440,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.getMinTier:
+        [200,200,200,200,200]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getMinTier":"Too many values. Update configuration to explore fully"}
    }
```

```diff
    contract TierRouter (0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a) {
    +++ description: None
      values.tier_provider:
-        "0x3a1A900680BaADb889202faf12915F7E47B71ddd"
      values.getProvider:
+        ["0x3a1A900680BaADb889202faf12915F7E47B71ddd","0x3a1A900680BaADb889202faf12915F7E47B71ddd","0x3a1A900680BaADb889202faf12915F7E47B71ddd","0x3a1A900680BaADb889202faf12915F7E47B71ddd","0x3a1A900680BaADb889202faf12915F7E47B71ddd"]
      errors:
+        {"getProvider":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0x993c841b015e9f5d5325d2fe8b629c9fcc27632a

# Diff at Wed, 23 Oct 2024 10:01:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 20977175
- current block number: 21027555

## Description

Config: Remove instances monitoring from SgxVerifier contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977175 (main branch discovery), not current.

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.instances:
-        [["0x085Bf649bef6b9e97C73822724eD33553C20a1CA"],["0x584240b6296210BdF93E2221aBD69BDb312Dc8af"],["0x412A2aDFe3a7e6D737539E0FF526523a47D86ab3"],["0x3777c454aF69C87df961E92dA99fCF96EdB30683"],["0xf02099f42d499028Ca52a5205d4E21001f5E3525"],["0xC57230B9A1BD4f882c40C9f549a27034474e5962"],["0x4A9d339c94D1D3b685e3923907A98c73b8168AFF"],["0x6F6C0837b2c45B1bfE970bd5a0BB171605cb44F3"],["0x98f0050D3c7ba3B938A98dFBe2024CA5c1E517A9"],["0x9e7ae74CB0CCf4f49f2093097dCeE32C96Bef1a7"],["0x2bcD4D02Fb1c703C6C3f2976e82ea7457D26CB34"],["0xF445C0b580454E21a8b836318D83782d35986666"],["0xe79d80cC4CF385e30473cA41279BC4845c82bb9e"],["0x7D5798Ce898E7E79f60A126eE82a84fE564067B2"],["0x1E0b96e4665E622dcc2F2c11ba7a7dD8Bc1fDD8A"],["0x7eAb069309335b615cC99545542d9d3FDeb46534"],["0x1dE96F45CB6f78aBC35F0DfD68Cf356691B429da"],["0xBfDa132503F664d6B4c2cA4B1f41413956bB6ab1"],["0x25C1069AdA9D2E3c6e9706cAA6b5494062E27679"],["0x87f1bf0A503b025684136cdE16dd606De4f46b67"],["0xb0E92092bAAab77ba628CC5cD91397Ca4b675ec0"],["0x76BEc9620cbc4b15422CC8726a07765736A52Dd0"],["0x6037E46fDdB6278e2fc5BbC87bBf5AD040A7C38D"],["0xB22148BC3819b1519e0b21e667D0F4F183CDC20c"],["0xbf690e318D5C183D9ad1A626a0bd1DafD605b126"],["0x374DC646a6EDaDcCA4D653677444b5bb803CdfD4"],["0x70f067776426EBeB33aee88DEb03CD6C57DAE703"],["0x84f272246697d5C872890AfB6A5FbD5524ebcFef"],["0x40A2D3c20d766280C71EcE4E4aD4edF135C35634"],["0x0b0dEf1167893541cF8F951A8d627e206Ef2c47E"],["0x2C4DBAD36A5b7d59eAc38def94D9bBEa3b6D351B"],["0x0568b34255fc451F651d3021b0ee66DE80210A14"],["0x8033455650e71FF8376974AC8A7D6f4aEecad17c"],["0x6Ac9022c4bFBE548aA2621f9E10fA485EC013e6a"],["0x4Fe0dBb789b2204201e82f6Eae8491510bF74B2D"],["0xbc1671F4cFdDaA3CC28aa64Cf1C1874cADef7AC1"],["0xeBb85864BA610EFE2CA0B949A4189f1675c7FcAf"],["0xe8471669e79ff941Fe766a50fca219DD68ad81AC"],["0xF0495642611461Ae25F4867B043717D9F53a9237"],["0xda4d5372188B0b8502AeD3770212Ed5784f71550"],["0xCbC0c2D518cD3C832b210a9FC9Cb265119BedAf1"],["0x77Eb511caCCEdD71924B361dc24dE3A762A55927"],["0x1DD5E0E5b03608a30b55806358ddbABC6Dc83b3f"],["0x62a966A7492Be75182C89E6E2a519a87884A0382"],["0x4Ef2201f196196be4B9e50F93F67Ad462A0d25A8"],["0x27dE58B8b5B3B643eA8e68Ec829caA20f51e1089"],["0xf2231009908E695C010c02F57Ac541D3470d95d5"],["0xe23A97f0c0a1Bc748709c2a348705773197A9c11"],["0xE6e686341B58F5378e8913369d176dc47bc1DE7a"],["0x3410feA2fEC5c6830Ac4FC8664089a6FE32A81B0"],["0x6f66C3e73D6B0F9e3547954F1650b76428708Ad6"],["0xD1B462C00Cd0c852E00eeF0aD09a924fc3e1f3D5"],["0x0666C986800f3037793a46B96EBE75F5b4e68940"],["0x206A2e6bAF0304642FFed63B0aBA1AAEF3373515"],["0x2dD5B12E5847F196Dc9DaE90d620b81dcaB50e7D"],["0xDeEbeeC3B2951B72c232F6Aa30EAB9ae12e77E98"],["0x91eB9C57C46EA0bD928A911A56C3894f21e6D7Db"],["0x184c547493f14aCe4fb2a44Ef190c45C7eafB898"],["0x3C28D0Fd3f3A39685f6dc4cbE8B3Be8405C206A1"],["0x37b84a57EF5025Ab0aa2460b7176757D42B786Cd"],["0x4654C7470c4af4e7baF2bD2e78c75691fEd7d124"],["0xC560Bd2919d58A2A6619E42E0a71b8AD7aba614a"],["0xd5f97dcadd67cf36Af047EbE07d47c83fd2B1197"],["0xE62Cd6781dfA5eD96C902F18Ea28F73196Da7CF6"],["0x4607BD32d5C20630000BAC6a78B0e718130946a0"],["0x856c28C8Dd58634278581B0553CaAB68D7f6b6f4"],["0x1FAbf3d52398275aF43F7bC984bcb7B1478c9278"],["0x73E93170406d18e4eF934c76AB40d3348322f6bC"],["0xCAF98012B2a016451680153175194C8173bCeA26"],["0x3e9CdBD9de6729072D0c660E824849444070949d"],["0x8f0C981FD73Cd998196C9277e600026f1c2eE0Ab"],["0x848a16f4e0D546E4d78e8eA34F6D2AB3C3c7d558"],["0x8c52A064CA95C41066731603f65253034426A15d"],["0x1F07f753C0d8ACA03adb5bF6e05cED30611E6c19"],["0x4D9d4d4F6003A4849e021EE122323C67BAb4071D"],["0x797d57b15D0d983BCF8fdD174926cf763b0b8665"],["0x0ba352Eaf527B5640160bAe09bF2c59eC8D2b98d"],["0x9Aa926a5911C9C893d4Fa16B13B098503b2B00f9"],["0xC2366373Fd179716486b31201E1506301AeE9310"],["0x903B0a1A25b892AbaDd1eFD36dc13625e6538C6E"],["0x55B978203166cA740bdC18645129A2ECd907617E"],["0x4977FbF31F629199a6b02646999217F3a3E39Ca7"],["0x59044F7BCa6bC665d56ff669Cd28adD68e075361"],["0x146cAD870c688517Fc887d6e63A918EA79E56eeA"],["0x49307626002D5ADbeF00691D41D150C3f1508e3b"],["0x2291649f2a6230c20F775663BbC94629a1948CD2"],["0xf558FFb575834C9F8c58992C245fBA428C4c13Fe"],["0x435D33772a133e1F53c544026F4481082f5040C6"],["0x819B9Ffd2772bA385B5f9f3Edb6a8DdB2485A7e7"],["0x09b8e134EE80cD7b54d1fA741205146a74b47161"],["0xfa799d4f8A01422333F3b0b7e7F44ae1D85EbD5e"],["0xabe79443eBaf0465a48BE89C1F7810476C29B326"],["0x5A4F19E5CBc77C318a319fAcF2eA9CbCCbD63622"],["0xc5E30ACf5738BC354b88fC67037D6dCAD933D24a"],["0x648afFc05326959c6F5B64Eb4881dFf22990F26F"],["0xd128eC8fDb68D3375962fd88cdCb1Bc2704f9367"],["0x8b346295531E54cAacbA1117039865a9690d1026"],["0x40714C29C62BBe8D882b9449DaC60aB271B2E72C"],["0x4b867b8f9123F7E1f59371CeF7aD25C5F40B2FD8"]]
    }
```

Generated with discovered.json: 0x05326545ba0ebc85d3645002b6070b86e4600617

# Diff at Mon, 21 Oct 2024 12:49:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20977175
- current block number: 20977175

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977175 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      descriptions:
-        ["This contract provides functionalities for proposing, proving, and verifying blocks."]
      description:
+        "This contract provides functionalities for proposing, proving, and verifying blocks."
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      descriptions:
-        ["Verifier contract for blocks proven by Guardian minority."]
      description:
+        "Verifier contract for blocks proven by Guardian minority."
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      descriptions:
-        ["A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO."]
      description:
+        "A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO."
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      descriptions:
-        ["Verifier contract for SGX proven blocks."]
      description:
+        "Verifier contract for SGX proven blocks."
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      descriptions:
-        ["Verifier contract for Guardian proven blocks."]
      description:
+        "Verifier contract for Guardian proven blocks."
    }
```

Generated with discovered.json: 0x90c9d21da8c146e239bf6a9321d203849e53c916

# Diff at Mon, 21 Oct 2024 11:11:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20977175
- current block number: 20977175

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977175 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.$pastUpgrades.12.2:
+        ["0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"]
      values.$pastUpgrades.12.1:
-        ["0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"]
+        "0x8778064404816273804d74c97b051f3865bc03062cfa4b0e9567f4556ad31981"
      values.$pastUpgrades.11.2:
+        ["0xBA1d90BCfA74163bFE09e8eF609b346507D83231"]
      values.$pastUpgrades.11.1:
-        ["0xBA1d90BCfA74163bFE09e8eF609b346507D83231"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.10.2:
+        ["0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"]
      values.$pastUpgrades.10.1:
-        ["0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"]
+        "0xdf3f0cb2eaca00484c30a5c63fafe8036a9e0f71bd4bab216504bee0f5bfb83f"
      values.$pastUpgrades.9.2:
+        ["0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"]
      values.$pastUpgrades.9.1:
-        ["0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"]
+        "0x13f54109cb7f7507ad03562b06ea8d8b472043186e44252302583bc64acfb20b"
      values.$pastUpgrades.8.2:
+        ["0xB9E1E58bcF33B79CcfF99c298963546a6c334388"]
      values.$pastUpgrades.8.1:
-        ["0xB9E1E58bcF33B79CcfF99c298963546a6c334388"]
+        "0xdb5e926c96d112ce1389da77a927fba6c7d04a711839b9e14777530ebcf83914"
      values.$pastUpgrades.7.2:
+        ["0x0468745A07de44A9a3138adAc35875ecaf7a20D5"]
      values.$pastUpgrades.7.1:
-        ["0x0468745A07de44A9a3138adAc35875ecaf7a20D5"]
+        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
      values.$pastUpgrades.6.2:
+        ["0x4b2743B869b85d5F7D8020566f92664995E4f3c5"]
      values.$pastUpgrades.6.1:
-        ["0x4b2743B869b85d5F7D8020566f92664995E4f3c5"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.5.2:
+        ["0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"]
      values.$pastUpgrades.5.1:
-        ["0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"]
+        "0x2c455ae888a23c232bb5c7603657eda010ffadc602a74e626332bc06eaaa3b78"
      values.$pastUpgrades.4.2:
+        ["0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"]
      values.$pastUpgrades.4.1:
-        ["0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"]
+        "0xa603b6d55457e64e18ddae684bfd14948452cdd7b927dd22bf0b83045e8fd028"
      values.$pastUpgrades.3.2:
+        ["0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"]
      values.$pastUpgrades.3.1:
-        ["0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"]
+        "0x187cc99e9bcf2a94f723cf52d85b74b79bdb3872681e2a3808cadbbc3ba301e2"
      values.$pastUpgrades.2.2:
+        ["0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"]
      values.$pastUpgrades.2.1:
-        ["0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"]
+        "0xaed098ad0c93113e401f61358f963501f40a046c5b5b659a1610f10120a9a86b"
      values.$pastUpgrades.1.2:
+        ["0x9fBBedBBcBb753E7214BE08381efE10d89D712fE"]
      values.$pastUpgrades.1.1:
-        ["0x9fBBedBBcBb753E7214BE08381efE10d89D712fE"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x99Ba70E62cab0cB983e66F72330fBDDC11d85501"]
      values.$pastUpgrades.0.1:
-        ["0x99Ba70E62cab0cB983e66F72330fBDDC11d85501"]
+        "0x675a0b8283bd222e1df42a0a4df4b781a1a7c5575729e2e91f89dda879933702"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0xcfe803378D79d1180EbF030455040EA6513869dF"]
      values.$pastUpgrades.4.1:
-        ["0xcfe803378D79d1180EbF030455040EA6513869dF"]
+        "0xc9f468d33d8d55911e4e5b5c301ed244a5f81ab0f389d2b4f398eb5b89d417ef"
      values.$pastUpgrades.3.2:
+        ["0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"]
      values.$pastUpgrades.3.1:
-        ["0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"]
+        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
      values.$pastUpgrades.2.2:
+        ["0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"]
      values.$pastUpgrades.2.1:
-        ["0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"]
+        "0x56402f9fd928be890fbd29829b817faffc0780b85e83300a29962c969808cae2"
      values.$pastUpgrades.1.2:
+        ["0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"]
      values.$pastUpgrades.1.1:
-        ["0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"]
+        "0x7d82794932540ed9edd259e58f6ef8ae21a49beada7f0224638f888f7149c01c"
      values.$pastUpgrades.0.2:
+        ["0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"]
      values.$pastUpgrades.0.1:
-        ["0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"]
+        "0x4f7a1c6ad21fbfeaecab40ea36a3845bf67e22d7770d8a259d62b995cb93cb34"
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      values.$pastUpgrades.5.2:
+        ["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]
      values.$pastUpgrades.5.1:
-        ["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]
+        "0x170617251f2345eda4bcbd29e316caa0b014602a44244c60b963382ac7da7748"
      values.$pastUpgrades.4.2:
+        ["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]
      values.$pastUpgrades.4.1:
-        ["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.3.2:
+        ["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]
      values.$pastUpgrades.3.1:
-        ["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]
+        "0x5a60c5815947a199cc84e1bc75539e01a202597b20c1f87bd9d02f8be6453abd"
      values.$pastUpgrades.2.2:
+        ["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]
      values.$pastUpgrades.2.1:
-        ["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]
+        "0x8030569e293baddbc4e8b26688a1ecf14a231d86c90e9d02dad1e919ea2f3964"
      values.$pastUpgrades.1.2:
+        ["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]
      values.$pastUpgrades.1.1:
-        ["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]
      values.$pastUpgrades.0.1:
-        ["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]
+        "0x77bb98950cca2b6e6640b4b35cecfb40fb302dfd17a0fdd9c1d5f95e91d2b031"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0x4f6D5D3109C07E77035B410602996e445b18E8E9"]
      values.$pastUpgrades.5.1:
-        ["0x4f6D5D3109C07E77035B410602996e445b18E8E9"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.4.2:
+        ["0x29a88d60246C76E4F28806b9C8a42d2183154900"]
      values.$pastUpgrades.4.1:
-        ["0x29a88d60246C76E4F28806b9C8a42d2183154900"]
+        "0x9f787086b4c5e6887eb1d27c286069bcbbcabb1d7ed9f69ab3121c4681cf4b2c"
      values.$pastUpgrades.3.2:
+        ["0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"]
      values.$pastUpgrades.3.1:
-        ["0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.2.2:
+        ["0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"]
      values.$pastUpgrades.2.1:
-        ["0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"]
+        "0xe1ef58455de0b0331228e487d54720290ed8a73f709d2146bd43330d4a360bd3"
      values.$pastUpgrades.1.2:
+        ["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]
      values.$pastUpgrades.1.1:
-        ["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0xd912aB787624c9eb96a37e658e9596e114360440"]
      values.$pastUpgrades.0.1:
-        ["0xd912aB787624c9eb96a37e658e9596e114360440"]
+        "0xbc9dfeb1062e7fdf8f918368964a41cc07b3edf3f8497a0abd9f426d1c9444bc"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      values.$pastUpgrades.7.2:
+        ["0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"]
      values.$pastUpgrades.7.1:
-        ["0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"]
+        "0x170617251f2345eda4bcbd29e316caa0b014602a44244c60b963382ac7da7748"
      values.$pastUpgrades.6.2:
+        ["0x74828E5fe803072AF9Df512B3911B4223572D652"]
      values.$pastUpgrades.6.1:
-        ["0x74828E5fe803072AF9Df512B3911B4223572D652"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.5.2:
+        ["0x518845daA8870bE2C59E49620Fc262AD48953C9a"]
      values.$pastUpgrades.5.1:
-        ["0x518845daA8870bE2C59E49620Fc262AD48953C9a"]
+        "0xdf3f0cb2eaca00484c30a5c63fafe8036a9e0f71bd4bab216504bee0f5bfb83f"
      values.$pastUpgrades.4.2:
+        ["0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"]
      values.$pastUpgrades.4.1:
-        ["0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"]
+        "0xb4c23d57a1f0916180d0752c57726b634e7707bb7377c93d9e95d19e3695887a"
      values.$pastUpgrades.3.2:
+        ["0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"]
      values.$pastUpgrades.3.1:
-        ["0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"]
+        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
      values.$pastUpgrades.2.2:
+        ["0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"]
      values.$pastUpgrades.2.1:
-        ["0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.1.2:
+        ["0x500735343372Dd6c9B84dBc7a75babf4479742B9"]
      values.$pastUpgrades.1.1:
-        ["0x500735343372Dd6c9B84dBc7a75babf4479742B9"]
+        "0x02ed558762eae5f0a930ba4a1047a02d4a793ea48890268c32df04e882f138ff"
      values.$pastUpgrades.0.2:
+        ["0x34f2B21107AfE3584949c184A1E6236FFDAC4f6F"]
      values.$pastUpgrades.0.1:
-        ["0x34f2B21107AfE3584949c184A1E6236FFDAC4f6F"]
+        "0xf3b6af477112d0a8209506c8f310f4eb0713beebb1911ef5d11162d36d93c0ff"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"]
      values.$pastUpgrades.2.1:
-        ["0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"]
+        "0x46a6d47c15505a1259c64d1e09353680e525b2706dd9e095e15019dda7c1b295"
      values.$pastUpgrades.1.2:
+        ["0xde1b1FBe7D721af4A56651272ef91A59B7303323"]
      values.$pastUpgrades.1.1:
-        ["0xde1b1FBe7D721af4A56651272ef91A59B7303323"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0xEE8FC1dbb8D345f5bF35dFb939C6f9EdC5fCDAFc"]
      values.$pastUpgrades.0.1:
-        ["0xEE8FC1dbb8D345f5bF35dFb939C6f9EdC5fCDAFc"]
+        "0x207dec76298211a2d988b0de3e9a3f8da0edb4524a011e72f28200be08edd4c6"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      values.$pastUpgrades.6.2:
+        ["0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"]
      values.$pastUpgrades.6.1:
-        ["0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"]
+        "0xee632b50626beb2f7db84c9c7f303f29366f86dfaccd24ddd831ceac714c20e5"
      values.$pastUpgrades.5.2:
+        ["0xa303784B0557BF1F1FB8b8abEF2B18a005722689"]
      values.$pastUpgrades.5.1:
-        ["0xa303784B0557BF1F1FB8b8abEF2B18a005722689"]
+        "0x13f54109cb7f7507ad03562b06ea8d8b472043186e44252302583bc64acfb20b"
      values.$pastUpgrades.4.2:
+        ["0x75b5E276c5C1e9378E899cb3A87977421980Eb22"]
      values.$pastUpgrades.4.1:
-        ["0x75b5E276c5C1e9378E899cb3A87977421980Eb22"]
+        "0x42a1dacf03a4032209ca4a6b922ffe2ebb34925c16a6632d8590cf3374ae59d8"
      values.$pastUpgrades.3.2:
+        ["0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"]
      values.$pastUpgrades.3.1:
-        ["0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"]
+        "0xdb5e926c96d112ce1389da77a927fba6c7d04a711839b9e14777530ebcf83914"
      values.$pastUpgrades.2.2:
+        ["0x4F750D13005444407D44dAA30922128db0374ca1"]
      values.$pastUpgrades.2.1:
-        ["0x4F750D13005444407D44dAA30922128db0374ca1"]
+        "0x02ed558762eae5f0a930ba4a1047a02d4a793ea48890268c32df04e882f138ff"
      values.$pastUpgrades.1.2:
+        ["0xC722d9f3f8D60288589F7f67a9CFAd34d3B9bf8E"]
      values.$pastUpgrades.1.1:
-        ["0xC722d9f3f8D60288589F7f67a9CFAd34d3B9bf8E"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x15D9F7e12aEa18DAEF5c651fBf97567CAd4a4BEc"]
      values.$pastUpgrades.0.1:
-        ["0x15D9F7e12aEa18DAEF5c651fBf97567CAd4a4BEc"]
+        "0x109f0a0ff2b3b57f3a94bc1dd39159a7e3af9ec0141be56d49d7bb1db94279c2"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"]
      values.$pastUpgrades.4.1:
-        ["0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.3.2:
+        ["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]
      values.$pastUpgrades.3.1:
-        ["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]
+        "0xdb5e926c96d112ce1389da77a927fba6c7d04a711839b9e14777530ebcf83914"
      values.$pastUpgrades.2.2:
+        ["0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"]
      values.$pastUpgrades.2.1:
-        ["0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.1.2:
+        ["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]
      values.$pastUpgrades.1.1:
-        ["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0xE1d91bAE44B70bD66e8b688B8421fD62dcC33c72"]
      values.$pastUpgrades.0.1:
-        ["0xE1d91bAE44B70bD66e8b688B8421fD62dcC33c72"]
+        "0x0898d14da2f38d677085073d2decfb7ca32902406df2e7a84f6615d9c92d4516"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$pastUpgrades.4.2:
+        ["0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"]
      values.$pastUpgrades.4.1:
-        ["0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"]
+        "0x2e246e4b4637c4bf13dccea873a30e35e704bafa7f02e30c877ecec7d786e662"
      values.$pastUpgrades.3.2:
+        ["0xEE5F6648307319263FFBaE91f68ac700b188fF24"]
      values.$pastUpgrades.3.1:
-        ["0xEE5F6648307319263FFBaE91f68ac700b188fF24"]
+        "0x170617251f2345eda4bcbd29e316caa0b014602a44244c60b963382ac7da7748"
      values.$pastUpgrades.2.2:
+        ["0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"]
      values.$pastUpgrades.2.1:
-        ["0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.1.2:
+        ["0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"]
      values.$pastUpgrades.1.1:
-        ["0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x3f54067EF5d8B414Bdb1945cdF482BD158Aad175"]
      values.$pastUpgrades.0.1:
-        ["0x3f54067EF5d8B414Bdb1945cdF482BD158Aad175"]
+        "0xb395374994ed9013749c8967babaa7cb5ad73699c1ae14794615bf4ffdd462e1"
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      values.$pastUpgrades.10.2:
+        ["0xAc96FF285158bceBB8573D20d853e86BB2915aF3"]
      values.$pastUpgrades.10.1:
-        ["0xAc96FF285158bceBB8573D20d853e86BB2915aF3"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.9.2:
+        ["0x01E7D369a619eF1B0E92563d8737F42C09789986"]
      values.$pastUpgrades.9.1:
-        ["0x01E7D369a619eF1B0E92563d8737F42C09789986"]
+        "0x13f54109cb7f7507ad03562b06ea8d8b472043186e44252302583bc64acfb20b"
      values.$pastUpgrades.8.2:
+        ["0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"]
      values.$pastUpgrades.8.1:
-        ["0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"]
+        "0x2f14829c3da1a755a74948d5716a625256ae7e2481e538b0660a8da11c84dc2e"
      values.$pastUpgrades.7.2:
+        ["0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"]
      values.$pastUpgrades.7.1:
-        ["0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"]
+        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
      values.$pastUpgrades.6.2:
+        ["0x3c326483EBFabCf3252205f26dF632FE83d11108"]
      values.$pastUpgrades.6.1:
-        ["0x3c326483EBFabCf3252205f26dF632FE83d11108"]
+        "0xc0ba6558642b93ee892bee0705dbcfb5130c53637e6266bfa5e3a6501167d6f2"
      values.$pastUpgrades.5.2:
+        ["0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"]
      values.$pastUpgrades.5.1:
-        ["0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"]
+        "0xf21f6bf720767db3bc9b63ef69cacb20340bdedfb6589e6a4d11fe082dfa7bd6"
      values.$pastUpgrades.4.2:
+        ["0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"]
      values.$pastUpgrades.4.1:
-        ["0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"]
+        "0x8a380a25d03a740d9535dfc3e2fc4f6960e22d49ad88b8d85f59af4013aedf87"
      values.$pastUpgrades.3.2:
+        ["0x02F21B4C3d4dbfF70cE851741175a727c8D782Be"]
      values.$pastUpgrades.3.1:
-        ["0x02F21B4C3d4dbfF70cE851741175a727c8D782Be"]
+        "0x02ed558762eae5f0a930ba4a1047a02d4a793ea48890268c32df04e882f138ff"
      values.$pastUpgrades.2.2:
+        ["0xc71CC3B0a47149878fad337fb2ca54E546A645ba"]
      values.$pastUpgrades.2.1:
-        ["0xc71CC3B0a47149878fad337fb2ca54E546A645ba"]
+        "0x5a60c5815947a199cc84e1bc75539e01a202597b20c1f87bd9d02f8be6453abd"
      values.$pastUpgrades.1.2:
+        ["0x4A1091c2fb37D9C4a661c2384Ff539d94CCF853D"]
      values.$pastUpgrades.1.1:
-        ["0x4A1091c2fb37D9C4a661c2384Ff539d94CCF853D"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x91d593d34f2E1904cDCe3D5290a74563F87bCF6f"]
      values.$pastUpgrades.0.1:
-        ["0x91d593d34f2E1904cDCe3D5290a74563F87bCF6f"]
+        "0x99673a767d36f5f3bc4af415072f97f344b6a5ec39e0d85eb799691787b1b98b"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      values.$pastUpgrades.5.2:
+        ["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]
      values.$pastUpgrades.5.1:
-        ["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]
+        "0x170617251f2345eda4bcbd29e316caa0b014602a44244c60b963382ac7da7748"
      values.$pastUpgrades.4.2:
+        ["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]
      values.$pastUpgrades.4.1:
-        ["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.3.2:
+        ["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]
      values.$pastUpgrades.3.1:
-        ["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]
+        "0x5a60c5815947a199cc84e1bc75539e01a202597b20c1f87bd9d02f8be6453abd"
      values.$pastUpgrades.2.2:
+        ["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]
      values.$pastUpgrades.2.1:
-        ["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]
+        "0x8030569e293baddbc4e8b26688a1ecf14a231d86c90e9d02dad1e919ea2f3964"
      values.$pastUpgrades.1.2:
+        ["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]
      values.$pastUpgrades.1.1:
-        ["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]
      values.$pastUpgrades.0.1:
-        ["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]
+        "0x76bb4346eb067a443f2069793a10f547893102d91dfebd011909c0fdeefb1e94"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"]
      values.$pastUpgrades.3.1:
-        ["0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.2.2:
+        ["0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"]
      values.$pastUpgrades.2.1:
-        ["0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"]
+        "0xe1ef58455de0b0331228e487d54720290ed8a73f709d2146bd43330d4a360bd3"
      values.$pastUpgrades.1.2:
+        ["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]
      values.$pastUpgrades.1.1:
-        ["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x9cA1Ab10c9fAc5153F8b78E67f03aAa69C9c6A15"]
      values.$pastUpgrades.0.1:
-        ["0x9cA1Ab10c9fAc5153F8b78E67f03aAa69C9c6A15"]
+        "0xf83131446154db1fb4013c20e9468c36f71085dbdf4304f8e2ef5ac13f2e3670"
    }
```

Generated with discovered.json: 0x4b43cc2a7f3a15e72a8d81383920862dccbbfc29

# Diff at Wed, 16 Oct 2024 09:19:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7921b2195836f60cdebc96df7164e01c8921b991 block: 20367491
- current block number: 20977175

## Description

Upgrade of the TaikoL1Contract implementation with a [bug fix](https://github.com/taikoxyz/taiko-mono/pull/18254) in a check ('sametransition') of the proving library.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xf13ac7cd2ef8d7b72cab625effe80906f11db83cf2a688e85a19d515da43f06f"
+        "0xa2bfa567075799db54daaa89afafea79e42c73c36c23112c79926407116d0765"
      values.$implementation:
-        "0xBA1d90BCfA74163bFE09e8eF609b346507D83231"
+        "0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"
      values.$pastUpgrades.12:
+        ["2024-10-16T07:55:23.000Z",["0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"]]
      values.$upgradeCount:
-        12
+        13
      values.impl:
-        "0xBA1d90BCfA74163bFE09e8eF609b346507D83231"
+        "0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"
    }
```

## Source code changes

```diff
.../TaikoL1Contract/MainnetTaikoL1.sol             | 37 ++++++++++++----------
 1 file changed, 21 insertions(+), 16 deletions(-)
```

Generated with discovered.json: 0x62bbf8ea8ccf69d33116a4be61f87ed5c169c163

# Diff at Mon, 14 Oct 2024 10:56:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract PEMCertChainLib (0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169) {
    +++ description: None
      sourceHashes:
+        ["0x97476fc6413c58015ddf51b5d2e37c3fdfc6b85ced25779773a1652ecc154c77"]
    }
```

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xf13ac7cd2ef8d7b72cab625effe80906f11db83cf2a688e85a19d515da43f06f"]
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x5da570fbffd5ab663ce8983496a9ded290ed853a950b4052ac93b35217babac8"]
    }
```

```diff
    contract TierProvider (0x3a1A900680BaADb889202faf12915F7E47B71ddd) {
    +++ description: None
      sourceHashes:
+        ["0xb4bbf462798387aaf063a17fe37e8c1b7680ea832f5d7578bb385b9ea4d96e7b"]
    }
```

```diff
    contract SigVerifyLib (0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9) {
    +++ description: None
      sourceHashes:
+        ["0x5bf803a773ed2c117313ea970df3b38542eab3522714f18be2b65a75062e0ebf"]
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xb6ed017b0bf49c547dbaa4b24efcbcd5218c26aafd94f8cf06850d009e538347"]
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x06f614affc4908aeeac9faa505010855388740ee8e5ba632fbc0e5f56ee8927d"]
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x020f0e8ece4630d3f7e6458ef5f1d86c5408ed344c580633e3f32e53393ceab5"]
    }
```

```diff
    contract TierRouter (0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a) {
    +++ description: None
      sourceHashes:
+        ["0x0586e314d29674146a289903abeb027df33bc789e1aa325ebe458284967fe8d6"]
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xac51975c574b128e9dc1e8542c616ed655d4a2abc91d3233648ac688e530c68c"]
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x3c7adf8e3200906bd67dec9e0b73fb813681e84ba1499dcede6987370ce146c9"]
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xa5cf6831e233f05c8a2f677c311dd359c75850355d61417bc5201d493db30039"]
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xdb8e8268242e52348760b0b2d154955236307b3ef1bc9cb0234fc6c0d01aa70f"]
    }
```

```diff
    contract MainnetProverSet (0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A) {
    +++ description: None
      sourceHashes:
+        ["0x020f0e8ece4630d3f7e6458ef5f1d86c5408ed344c580633e3f32e53393ceab5"]
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x14240ef6b1d8181a009840162a21975c2777f78f27c22e8e550bc66b36357f78"]
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xb6ed017b0bf49c547dbaa4b24efcbcd5218c26aafd94f8cf06850d009e538347"]
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xa0dc6b4537f21ed3a4a43a7fb74645ff827cff8c2b26f2e3e4350ddec470c990"]
    }
```

Generated with discovered.json: 0x23099ec7223b235b37cb37864d7faf0af142f3da

# Diff at Tue, 01 Oct 2024 11:11:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.$pastUpgrades:
+        [["2024-05-01T08:03:47.000Z",["0x99Ba70E62cab0cB983e66F72330fBDDC11d85501"]],["2024-05-11T06:26:35.000Z",["0x9fBBedBBcBb753E7214BE08381efE10d89D712fE"]],["2024-05-21T14:15:11.000Z",["0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"]],["2024-05-27T16:37:11.000Z",["0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"]],["2024-05-28T05:18:11.000Z",["0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"]],["2024-06-04T06:10:11.000Z",["0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"]],["2024-06-06T08:51:11.000Z",["0x4b2743B869b85d5F7D8020566f92664995E4f3c5"]],["2024-06-07T04:02:11.000Z",["0x0468745A07de44A9a3138adAc35875ecaf7a20D5"]],["2024-06-07T08:40:35.000Z",["0xB9E1E58bcF33B79CcfF99c298963546a6c334388"]],["2024-07-02T07:03:35.000Z",["0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"]],["2024-07-13T12:34:35.000Z",["0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"]],["2024-07-16T14:30:23.000Z",["0xBA1d90BCfA74163bFE09e8eF609b346507D83231"]]]
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-25T08:29:59.000Z",["0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"]],["2024-05-11T05:46:11.000Z",["0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"]],["2024-05-29T08:03:23.000Z",["0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"]],["2024-06-07T04:02:11.000Z",["0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"]],["2024-07-02T07:15:47.000Z",["0xcfe803378D79d1180EbF030455040EA6513869dF"]]]
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      values.$pastUpgrades:
+        [["2024-05-01T08:03:47.000Z",["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]],["2024-05-11T06:26:35.000Z",["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]],["2024-05-15T04:09:35.000Z",["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]],["2024-05-22T06:23:11.000Z",["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]],["2024-06-06T08:51:11.000Z",["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]],["2024-07-17T06:19:35.000Z",["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]]]
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:35.000Z",["0xd912aB787624c9eb96a37e658e9596e114360440"]],["2024-05-11T06:26:35.000Z",["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]],["2024-05-26T11:17:11.000Z",["0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"]],["2024-06-06T08:51:11.000Z",["0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"]],["2024-07-02T14:30:59.000Z",["0x29a88d60246C76E4F28806b9C8a42d2183154900"]],["2024-07-16T14:30:23.000Z",["0x4f6D5D3109C07E77035B410602996e445b18E8E9"]]]
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      values.$pastUpgrades:
+        [["2024-05-20T15:05:59.000Z",["0x34f2B21107AfE3584949c184A1E6236FFDAC4f6F"]],["2024-05-25T11:00:59.000Z",["0x500735343372Dd6c9B84dBc7a75babf4479742B9"]],["2024-06-06T08:51:11.000Z",["0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"]],["2024-06-07T04:02:11.000Z",["0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"]],["2024-06-08T10:54:11.000Z",["0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"]],["2024-07-13T12:34:35.000Z",["0x518845daA8870bE2C59E49620Fc262AD48953C9a"]],["2024-07-16T14:30:23.000Z",["0x74828E5fe803072AF9Df512B3911B4223572D652"]],["2024-07-17T06:19:35.000Z",["0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"]]]
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:59.000Z",["0xEE8FC1dbb8D345f5bF35dFb939C6f9EdC5fCDAFc"]],["2024-05-11T06:26:35.000Z",["0xde1b1FBe7D721af4A56651272ef91A59B7303323"]],["2024-05-15T15:34:23.000Z",["0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"]]]
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:23.000Z",["0x15D9F7e12aEa18DAEF5c651fBf97567CAd4a4BEc"]],["2024-05-11T06:26:35.000Z",["0xC722d9f3f8D60288589F7f67a9CFAd34d3B9bf8E"]],["2024-05-25T11:00:59.000Z",["0x4F750D13005444407D44dAA30922128db0374ca1"]],["2024-06-07T08:40:35.000Z",["0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"]],["2024-06-10T12:45:47.000Z",["0x75b5E276c5C1e9378E899cb3A87977421980Eb22"]],["2024-07-02T07:03:35.000Z",["0xa303784B0557BF1F1FB8b8abEF2B18a005722689"]],["2024-07-16T12:45:59.000Z",["0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"]]]
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:23.000Z",["0xE1d91bAE44B70bD66e8b688B8421fD62dcC33c72"]],["2024-05-11T06:26:35.000Z",["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]],["2024-06-06T08:51:11.000Z",["0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"]],["2024-06-07T08:40:35.000Z",["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]],["2024-07-16T14:30:23.000Z",["0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"]]]
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$pastUpgrades:
+        [["2024-05-01T08:03:47.000Z",["0x3f54067EF5d8B414Bdb1945cdF482BD158Aad175"]],["2024-05-11T06:26:35.000Z",["0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"]],["2024-06-06T08:51:11.000Z",["0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"]],["2024-07-17T06:19:35.000Z",["0xEE5F6648307319263FFBaE91f68ac700b188fF24"]],["2024-07-19T02:42:59.000Z",["0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"]]]
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:23.000Z",["0x91d593d34f2E1904cDCe3D5290a74563F87bCF6f"]],["2024-05-11T06:26:35.000Z",["0x4A1091c2fb37D9C4a661c2384Ff539d94CCF853D"]],["2024-05-22T06:23:11.000Z",["0xc71CC3B0a47149878fad337fb2ca54E546A645ba"]],["2024-05-25T11:00:59.000Z",["0x02F21B4C3d4dbfF70cE851741175a727c8D782Be"]],["2024-05-29T05:00:35.000Z",["0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"]],["2024-05-31T09:34:47.000Z",["0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"]],["2024-06-04T06:09:11.000Z",["0x3c326483EBFabCf3252205f26dF632FE83d11108"]],["2024-06-07T04:02:11.000Z",["0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"]],["2024-06-27T15:36:23.000Z",["0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"]],["2024-07-02T07:03:35.000Z",["0x01E7D369a619eF1B0E92563d8737F42C09789986"]],["2024-07-16T14:30:23.000Z",["0xAc96FF285158bceBB8573D20d853e86BB2915aF3"]]]
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      values.$pastUpgrades:
+        [["2024-05-01T08:03:47.000Z",["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]],["2024-05-11T06:26:35.000Z",["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]],["2024-05-15T04:09:35.000Z",["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]],["2024-05-22T06:23:11.000Z",["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]],["2024-06-06T08:51:11.000Z",["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]],["2024-07-17T06:19:35.000Z",["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]]]
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:23.000Z",["0x9cA1Ab10c9fAc5153F8b78E67f03aAa69C9c6A15"]],["2024-05-11T06:26:35.000Z",["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]],["2024-05-26T11:17:11.000Z",["0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"]],["2024-07-16T14:30:23.000Z",["0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"]]]
    }
```

Generated with discovered.json: 0x853af766eb885dd729d9ef0b6a2f6337a5837305

# Diff at Fri, 30 Aug 2024 08:01:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.11.via:
-        []
      receivedPermissions.10.via:
-        []
      receivedPermissions.9.via:
-        []
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
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

Generated with discovered.json: 0x85330084ea47a398f6a995cd4eef2c75c96c8644

# Diff at Fri, 23 Aug 2024 09:56:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.$upgradeCount:
+        12
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      values.$upgradeCount:
+        5
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      values.$upgradeCount:
+        6
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      values.$upgradeCount:
+        8
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      values.$upgradeCount:
+        7
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      values.$upgradeCount:
+        5
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$upgradeCount:
+        5
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      values.$upgradeCount:
+        11
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      values.$upgradeCount:
+        6
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

Generated with discovered.json: 0x501fc3cc7a3f8189eebc64405060e1ce4a97c04a

# Diff at Wed, 21 Aug 2024 10:06:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800","0x579A8d63a2Db646284CBFE31FE5082c9989E985c","0x579f40D0BE111b823962043702cabe6Aaa290780","0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9","0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","0xE3D777143Ea25A6E031d1e921F396750885f43aC","0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81","0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","via":[]},{"permission":"upgrade","target":"0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800","via":[]},{"permission":"upgrade","target":"0x579A8d63a2Db646284CBFE31FE5082c9989E985c","via":[]},{"permission":"upgrade","target":"0x579f40D0BE111b823962043702cabe6Aaa290780","via":[]},{"permission":"upgrade","target":"0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9","via":[]},{"permission":"upgrade","target":"0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","via":[]},{"permission":"upgrade","target":"0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","via":[]},{"permission":"upgrade","target":"0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","via":[]},{"permission":"upgrade","target":"0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81","via":[]},{"permission":"upgrade","target":"0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC","via":[]},{"permission":"upgrade","target":"0xE3D777143Ea25A6E031d1e921F396750885f43aC","via":[]},{"permission":"upgrade","target":"0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","via":[]}]
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

Generated with discovered.json: 0xada8e10c7620e6341a1aa18d79161004c8a45df7

# Diff at Fri, 09 Aug 2024 12:02:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      assignedPermissions.upgrade.11:
-        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
+        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      assignedPermissions.upgrade.10:
-        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
+        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
      assignedPermissions.upgrade.9:
-        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
+        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      assignedPermissions.upgrade.8:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
      assignedPermissions.upgrade.7:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      assignedPermissions.upgrade.6:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      assignedPermissions.upgrade.4:
-        "0x579f40D0BE111b823962043702cabe6Aaa290780"
+        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      assignedPermissions.upgrade.3:
-        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
+        "0x579f40D0BE111b823962043702cabe6Aaa290780"
      assignedPermissions.upgrade.2:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
      assignedPermissions.upgrade.1:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      assignedPermissions.upgrade.0:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
    }
```

Generated with discovered.json: 0x2d4a9452bbde47699d163c0ec1c075e63916fef1

# Diff at Fri, 09 Aug 2024 10:12:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800","0x579A8d63a2Db646284CBFE31FE5082c9989E985c","0x579f40D0BE111b823962043702cabe6Aaa290780","0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9","0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","0xE3D777143Ea25A6E031d1e921F396750885f43aC","0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81","0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"]
      assignedPermissions.upgrade:
+        ["0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC","0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9","0x579f40D0BE111b823962043702cabe6Aaa290780","0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800","0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","0x579A8d63a2Db646284CBFE31FE5082c9989E985c","0xE3D777143Ea25A6E031d1e921F396750885f43aC","0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"]
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x55d79345Afc87806B690C9f96c4D7BfE2Bca8268","0x7Cdd1c128Cd72dd252f569eeD942735330937F91","0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1","0x6B6072CE402F22fDcFbA1705383D8e280717Cb87"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x55d79345Afc87806B690C9f96c4D7BfE2Bca8268","0x7Cdd1c128Cd72dd252f569eeD942735330937F91","0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1","0x6B6072CE402F22fDcFbA1705383D8e280717Cb87"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x5be646dcbd4e259784675edfccb4f73b54a477d6

# Diff at Tue, 30 Jul 2024 11:16:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TierProvider (0x3a1A900680BaADb889202faf12915F7E47B71ddd) {
    +++ description: None
      fieldMeta:
+        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
    }
```

Generated with discovered.json: 0xb2a593359c71ae5bfd7af8acf5a2c646669ae3c5

# Diff at Tue, 23 Jul 2024 06:40:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@898b873eac66b785af49fe56edca0c3dc1a5d0d7 block: 20325786
- current block number: 20367491

## Description

Small upgrade, no functional changes.

## Watched changes

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$implementation:
-        "0xEE5F6648307319263FFBaE91f68ac700b188fF24"
+        "0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"
      values.impl:
-        "0xEE5F6648307319263FFBaE91f68ac700b188fF24"
+        "0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"
    }
```

## Source code changes

```diff
.../SgxVerifier/MainnetSgxVerifier.sol              | 21 +++++++++++++++------
 1 file changed, 15 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0x4d8acd4949ddb9e86b59f0e29b2718147f570d2d

# Diff at Wed, 17 Jul 2024 10:56:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bff2b984ff65f6f4ce53cd6d7831c30ff25fdfa1 block: 20310388
- current block number: 20325786

## Description

Taiko [upgrade 1.9.0](https://github.com/taikoxyz/taiko-mono/pull/17783). The diff is extensive but logic changes are not since much of the diff is about naming and refactoring. The MainnetXXX contracts are deployed to save gas, logic is supposed to stay the same. Contract diffs were reviewed superficially since the code is changing too often and there seem to be no new features / permissions. Below is a changelog copied from the Taiko monorepo:

### Features

* **protocol:** add withdraw eth function to proverset ([#17800](https://github.com/taikoxyz/taiko-mono/issues/17800)) ([bb2abc5](https://github.com/taikoxyz/taiko-mono/commit/bb2abc510c98e62c89e0bfd9382c11720fb9edc7))
* **protocol:** update Hekla deployment ([#17795](https://github.com/taikoxyz/taiko-mono/issues/17795)) ([cadaef8](https://github.com/taikoxyz/taiko-mono/commit/cadaef882c0751496809c88ee03ff818e49c4b4a))
* **protocol:** update risc0 verifier contract to release-1.0 ([#17776](https://github.com/taikoxyz/taiko-mono/issues/17776)) ([2dd30ab](https://github.com/taikoxyz/taiko-mono/commit/2dd30ab2dc92b25105f19a4bcc1ddf7b40886039))


### Bug Fixes

* **protocol:** reduce MainnetTaikoL1 code size ([#17792](https://github.com/taikoxyz/taiko-mono/issues/17792)) ([45281b8](https://github.com/taikoxyz/taiko-mono/commit/45281b848f3ef3c45487bfcd1bfd38b382eff4d0))


### Documentation

* **protocol:** update L1 deployment ([#17789](https://github.com/taikoxyz/taiko-mono/issues/17789)) ([a889f1a](https://github.com/taikoxyz/taiko-mono/commit/a889f1a3e6c27b6758e873572c371ac9399a3d9a))


### Code Refactoring

* **protocol:** add MainnetGuardianProver ([#17805](https://github.com/taikoxyz/taiko-mono/issues/17805)) ([6f68316](https://github.com/taikoxyz/taiko-mono/commit/6f68316e89373670cf2c58bde5e64de196b9c139))
* **protocol:** add MainnetSgxVerifier ([#17803](https://github.com/taikoxyz/taiko-mono/issues/17803)) ([a4be247](https://github.com/taikoxyz/taiko-mono/commit/a4be247e181861300d79af6454b3fd3776100b48))
* **protocol:** added cached version of the bridge and vaults ([#17801](https://github.com/taikoxyz/taiko-mono/issues/17801)) ([b70cc57](https://github.com/taikoxyz/taiko-mono/commit/b70cc57704d750081a62a7e8e44f68f32efdc4c1))
* **protocol:** improve mainnet gas efficiency with addresses cached ([#17791](https://github.com/taikoxyz/taiko-mono/issues/17791)) ([b12227d](https://github.com/taikoxyz/taiko-mono/commit/b12227d4d2b2636fb80e04ee7ebc2dec3c17faa8))
* **protocol:** name address manager param clearer ([#17806](https://github.com/taikoxyz/taiko-mono/issues/17806)) ([1d5a6ff](https://github.com/taikoxyz/taiko-mono/commit/1d5a6ff191e8457ee12c96cb73c074560c556a2a))


## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.$implementation:
-        "0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"
+        "0xBA1d90BCfA74163bFE09e8eF609b346507D83231"
      values.impl:
-        "0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"
+        "0xBA1d90BCfA74163bFE09e8eF609b346507D83231"
      values.prover_set:
-        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
+        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
      derivedName:
-        "TaikoL1"
+        "MainnetTaikoL1"
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0x518845daA8870bE2C59E49620Fc262AD48953C9a)
    +++ description: None
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      values.$implementation:
-        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
+        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
      values.impl:
-        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
+        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
      derivedName:
-        "GuardianProver"
+        "MainnetGuardianProver"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      values.$implementation:
-        "0x29a88d60246C76E4F28806b9C8a42d2183154900"
+        "0x4f6D5D3109C07E77035B410602996e445b18E8E9"
      values.impl:
-        "0x29a88d60246C76E4F28806b9C8a42d2183154900"
+        "0x4f6D5D3109C07E77035B410602996e445b18E8E9"
      derivedName:
-        "L1RollupAddressManager"
+        "MainnetRollupAddressManager"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      values.$implementation:
-        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
+        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
      values.impl:
-        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
+        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
      derivedName:
-        "ProverSet"
+        "MainnetProverSet"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      values.$implementation:
-        "0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
+        "0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"
      values.impl:
-        "0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
+        "0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"
      derivedName:
-        "ERC20Vault"
+        "MainnetERC20Vault"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      values.$implementation:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"
      values.impl:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"
      derivedName:
-        "SignalService"
+        "MainnetSignalService"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$implementation:
-        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
+        "0xEE5F6648307319263FFBaE91f68ac700b188fF24"
      values.impl:
-        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
+        "0xEE5F6648307319263FFBaE91f68ac700b188fF24"
      derivedName:
-        "SgxVerifier"
+        "MainnetSgxVerifier"
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      values.$implementation:
-        "0x01E7D369a619eF1B0E92563d8737F42C09789986"
+        "0xAc96FF285158bceBB8573D20d853e86BB2915aF3"
      values.impl:
-        "0x01E7D369a619eF1B0E92563d8737F42C09789986"
+        "0xAc96FF285158bceBB8573D20d853e86BB2915aF3"
      derivedName:
-        "Bridge"
+        "MainnetBridge"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      values.$implementation:
-        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
+        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
      values.impl:
-        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
+        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
      derivedName:
-        "GuardianProver"
+        "MainnetGuardianProver"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      values.$implementation:
-        "0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"
+        "0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"
      values.impl:
-        "0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"
+        "0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"
      derivedName:
-        "L1SharedAddressManager"
+        "MainnetSharedAddressManager"
    }
```

```diff
+   Status: CREATED
    contract MainnetProverSet (0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A)
    +++ description: None
```

## Source code changes

```diff
.../MainnetGuardianProver.sol}                     |  251 +-
 .../GuardianProver/MainnetGuardianProver.sol}      |  251 +-
 .../MainnetRollupAddressManager.sol}               |  141 +-
 .../MainnetSharedAddressManager.sol}               |  177 +-
 .../ProverSet.sol => .flat/MainnetProverSet.sol}   | 2657 +++++-----
 .../ProverSetProxy/MainnetProverSet.sol}           | 2657 +++++-----
 .../SgxVerifier/MainnetSgxVerifier.sol}            | 3481 ++++++-------
 .../SharedERC20Vault/MainnetERC20Vault.sol}        | 1270 ++---
 .../SignalService/MainnetSignalService.sol}        | 4297 ++++++++--------
 .../TaikoBridge/MainnetBridge.sol}                 | 1998 ++++----
 .../TaikoL1Contract/MainnetTaikoL1.sol}            | 5158 ++++++++++----------
 11 files changed, 11487 insertions(+), 10851 deletions(-)
```

Generated with discovered.json: 0xe016135302e207e21201065ab78e19edbf886272

# Diff at Mon, 15 Jul 2024 07:22:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c6bae99047cf03487a19e4008cfffabf520bcf2b block: 20262044
- current block number: 20310388

## Description

This is the [Taiko protocol v1.8.0 upgrade](https://github.com/taikoxyz/taiko-mono/releases/tag/protocol-v1.8.0).

tldr:
- TAIKO bonds are escrowed in the TaikoL1 contract and only manually withdrawn using `withdrawBond()` by proposers / provers. For efficiency, bonds can be deposited once in the contract and be left there.
- ring buffer size increased by 36 000 blocks (5 days worth of blocks @ 12 seconds). `getVerifiedBlockProver` can be called on these blocks to get their prover's address.
- `CalldataTxList` emitted when calldata is used as DA (to be used for derivation)

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.$implementation:
-        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
+        "0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"
      values.getConfig.blockRingBufferSize:
-        324512
+        360000
      values.impl:
-        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
+        "0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      values.$implementation:
-        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
+        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
      values.impl:
-        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
+        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
    }
```

## Source code changes

```diff
.../ProverSetProxy/ProverSet.sol                   |   41 +-
 .../TaikoL1Contract/TaikoL1.sol                    | 3683 ++++++++++----------
 2 files changed, 1924 insertions(+), 1800 deletions(-)
```

Generated with discovered.json: 0xd7d312e4f6b226cdfb6b99d711a06dfdbe019f7c

# Diff at Mon, 08 Jul 2024 13:19:34 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@d3100be6db9452d1d69138aa6310415ece67a66f block: 20232590
- current block number: 20262044

## Description

New ProverSet implementation: added possibility for authorized admin to call depositBond and withdrawBond on TaikoL1contract. These functions don't exist yet on TaikoL1contract, so this change is probably the beginning of a bigger update.

ProverSet address changed in L1RollupAddressManager, old implementation still in use under ProverSetProxy.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.prover_set:
-        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
+        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProverSet (0x518845daA8870bE2C59E49620Fc262AD48953C9a)
    +++ description: None
```

## Source code changes

```diff
.../taiko/ethereum/{.flat@20232590 => .flat}/ProverSet.sol     | 10 ++++++++++
 1 file changed, 10 insertions(+)
```

Generated with discovered.json: 0x6ea276c960b8bccf9d9d8ae744307cada936d2e3

# Diff at Wed, 03 Jul 2024 10:37:45 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@417b81634137b0450205477c050237b6c177f5d9 block: 20189741
- current block number: 20225431

## Description

- L1RollupAddressManager.sol: changed harcoded B_TIER_ROUTER address.
- Bridge.sol: small change in retryMessage logic.
- TaikoL1.sol: changes in block verification. assignedProver and hookCalls now DEPRECATED. assignedProver is now msg.sender of proposeBlock tx. New getters (getLastVerifiedBlock, getLastSyncedBlock), and decreased liveness bond to 125 TAIKO. Block proposers can now bribe the Ethereum block builder. Move some functions into libraries.
- TaikoToken.sol: can now call batchTransfer for multiple recipients and amounts.
- TierProviderV2.sol: validityBond and contestBond decreased (halved), cooldownWindow decreased (24h to 4h) for tiers TIER_SGX,TIER_GUARDIAN_MINORITY, for TIER_GUARDIAN increased from 1 to 24 hours. maxBlocksToVerifyPerProof now deprecated.
- TierRouter.sol: change hardcoded tier provider address.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.implementation:
-        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
+        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
      implementations.0:
-        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
+        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
      values.getConfig.maxBlocksToVerifyPerProposal:
-        10
      values.getConfig.livenessBond:
-        "250000000000000000000"
+        "125000000000000000000"
      values.getConfig.blockSyncThreshold:
-        32
      values.getConfig.maxBlocksToVerify:
+        16
      values.getConfig.stateRootSyncInternal:
+        16
      values.impl:
-        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
+        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
      values.slotA:
-        {"genesisHeight":19923613,"genesisTimestamp":1716358991,"lastSyncedBlockId":105566,"lastSynecdAt":1719571751}
      values.slotB:
-        {"numBlocks":108928,"lastVerifiedBlockId":105588,"provingPaused":false,"__reservedB1":0,"__reservedB2":0,"__reservedB3":0,"lastUnpausedAt":1716571955}
      values.tier_router:
-        "0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F"
+        "0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      upgradeability.implementation:
-        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
+        "0xcfe803378D79d1180EbF030455040EA6513869dF"
      implementations.0:
-        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
+        "0xcfe803378D79d1180EbF030455040EA6513869dF"
      values.impl:
-        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
+        "0xcfe803378D79d1180EbF030455040EA6513869dF"
    }
```

```diff
-   Status: DELETED
    contract TierProviderV2 (0x4cffe56C947E26D07C14020499776DB3e9AE3a23)
    +++ description: None
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      upgradeability.implementation:
-        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
+        "0x29a88d60246C76E4F28806b9C8a42d2183154900"
      implementations.0:
-        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
+        "0x29a88d60246C76E4F28806b9C8a42d2183154900"
      values.impl:
-        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
+        "0x29a88d60246C76E4F28806b9C8a42d2183154900"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      upgradeability.implementation:
-        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
+        "0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
      implementations.0:
-        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
+        "0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
      values.impl:
-        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
+        "0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
    }
```

```diff
-   Status: DELETED
    contract TierRouter (0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F)
    +++ description: None
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
+        "0x01E7D369a619eF1B0E92563d8737F42C09789986"
      implementations.0:
-        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
+        "0x01E7D369a619eF1B0E92563d8737F42C09789986"
      values.impl:
-        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
+        "0x01E7D369a619eF1B0E92563d8737F42C09789986"
    }
```

```diff
+   Status: CREATED
    contract TierProvider (0x3a1A900680BaADb889202faf12915F7E47B71ddd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TierRouter (0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a)
    +++ description: None
```

## Source code changes

```diff
.../L1RollupAddressManager.sol                     |   2 +-
 .../TaikoBridge/Bridge.sol                         |  11 +-
 .../TaikoL1Contract/TaikoL1.sol                    | 874 +++++++++++----------
 .../TaikoToken/TaikoToken.sol                      |  21 +-
 .../TierProviderV2.sol => .flat/TierProvider.sol}  |  41 +-
 .../{.flat@20189741 => .flat}/TierRouter.sol       |   2 +-
 6 files changed, 504 insertions(+), 447 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20189741 (main branch discovery), not current.

```diff
    contract TierProvider (0x4cffe56C947E26D07C14020499776DB3e9AE3a23) {
    +++ description: None
      name:
-        "TierProvider"
+        "TierProviderV2"
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
+++ description: tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof
      values.TIER_GUARDIAN:
-        ["0x746965725f677561726469616e00000000000000000000000000000000000000",0,0,60,2880,16]
+++ description: tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof
      values.TIER_GUARDIAN_MINORITY:
-        ["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","500000000000000000000","3280000000000000000000",1440,2880,16]
+++ description: tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof
      values.TIER_OPTIMISTIC:
-        ["0x0000000000000000000000000000000000000000000000000000000000000000","250000000000000000000","500000000000000000000",1440,30,16]
+++ description: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof
      values.TIER_SGX:
-        ["0x746965725f736778000000000000000000000000000000000000000000000000","250000000000000000000","1640000000000000000000",1440,60,8]
+++ description: tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof
      values.TIER_SGX_ZKVM:
-        ["0x746965725f7367785f7a6b766d00000000000000000000000000000000000000","500000000000000000000","3280000000000000000000",1440,240,4]
      values.getMinTier:
+        [200,200,200,200,200]
      errors:
+        {"getMinTier":"Too many values. Update configuration to explore fully"}
    }
```

```diff
    contract TierRouter (0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F) {
    +++ description: None
      values.tier_provider:
-        "0x4cffe56C947E26D07C14020499776DB3e9AE3a23"
      values.getProvider:
+        ["0x4cffe56C947E26D07C14020499776DB3e9AE3a23","0x4cffe56C947E26D07C14020499776DB3e9AE3a23","0x4cffe56C947E26D07C14020499776DB3e9AE3a23","0x4cffe56C947E26D07C14020499776DB3e9AE3a23","0x4cffe56C947E26D07C14020499776DB3e9AE3a23"]
      errors:
+        {"getProvider":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0x1a9d9e0714596a68f80cbf3b326f615b15bcfa66

# Diff at Fri, 28 Jun 2024 10:59:39 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@0e63a13c0f6c2f62229e33cb4ab4b36a93715b3d block: 20063194
- current block number: 20189741

## Description

Update to bridge implementation, main changes include a new calculation of messageCalldataCost, used to calculate minimal gas limit required for sending bridge messages. Also removed SafeCastUpgradeable library.

## Watched changes

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
+        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
      implementations.0:
-        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
+        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
      values.CALLDATA_MESSAGE_SIZE_BYTES:
-        352
      values.impl:
-        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
+        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
    }
```

## Source code changes

```diff
.../TaikoBridge/Bridge.sol                         | 1249 ++------------------
 1 file changed, 88 insertions(+), 1161 deletions(-)
```

Generated with discovered.json: 0x9ec7174f8eea99746043ca4c4f61cd3f85b9c3f0

# Diff at Mon, 10 Jun 2024 18:24:02 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@d3c8c03ba1310e94fe51ccffffb90b46e5ec9ea9 block: 20054153
- current block number: 20063194

## Description

Moved consumeTokenQuota from beginning to very end of _transferTokens function. Quota manager contract is currently not set.

## Watched changes

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      upgradeability.implementation:
-        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
+        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
      implementations.0:
-        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
+        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
      values.impl:
-        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
+        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
    }
```

## Source code changes

```diff
.../ethereum/{.flat@20054153 => .flat}/SharedERC20Vault/ERC20Vault.sol | 3 +--
 1 file changed, 1 insertion(+), 2 deletions(-)
```

Generated with discovered.json: 0x11db6f6b7eec90e64b2483ebac75da462cc2cc5a

# Diff at Sun, 09 Jun 2024 12:06:08 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@023db9216bab49e9b3ffde0e43664e3e63c60fcf block: 20039414
- current block number: 20054153

## Description

Added "payable" to proposeBlock function in ProverSet. Calling proposeBlocks from ProverSet allows the ProverSetProxy to be the proposer of the block. On proveBlock(), also called from ProverSetProxy, there will be no validityBond posted as net transfers will be zero, since the TaikoL1 needs to return the livenessBond (250 TAIKO) to ProverSetProxy, and the validityBond (250 TAIKO) is of the same amount.
There are no special privileges for ProverSetProxy or its set provers in TaikoL1 contract.

Also new SGX instances registered.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.prover_set:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd)
    +++ description: None
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.implementation:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
      implementations.0:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
      values.impl:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
    }
```

```diff
+   Status: CREATED
    contract ProverSet (0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1)
    +++ description: None
```

## Source code changes

```diff
.../ProverSet-0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1.sol}            | 1 +
 .../ethereum/{.flat@20039414 => .flat}/ProverSetProxy/ProverSet.sol      | 1 +
 2 files changed, 2 insertions(+)
```

Generated with discovered.json: 0x038e91afa3edebd8b8da34afbe138b21b7d82f25

# Diff at Fri, 07 Jun 2024 10:40:21 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@41d748a25dcae1e5bca51dff605a48b4ddac2c56 block: 20032840
- current block number: 20039414

## Description

- ProverSet.sol: can now propose blocks by calling proposeBlock from proverSet contract, which will in turn call TaikoL1 proposeBlock().
- ERC20Vault.sol - LibStrings update, typo fixes and gas optimisations.
- SignalService.sol - Reverted to old implementation of SignalService (0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d). It is now back to old LibStrings, expecting an update soon.
- Bridge.sol - LibStrings update, added a max size for a calldata message to be processable by a relayer during proof verification.
- TaikoL1.sol - Added L1_NO_HOOKS error but not used. Fixed a bug where if they passed no hooks in the input params the livenessBond wouldn't be transferred.
- TaikoToken.sol - Added delegates function, not allowed to delegate to TaikoL1 or ERC20Vault.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.implementation:
-        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
+        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
      implementations.0:
-        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
+        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
      values.getConfig.6:
-        16
+        32
      values.getConfig.2:
-        432512
+        324512
      values.getConfig.1:
-        432000
+        324000
      values.impl:
-        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
+        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
      values.prover_set:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      upgradeability.implementation:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
      implementations.0:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
      values.impl:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.implementation:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
      implementations.0:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
      values.impl:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      upgradeability.implementation:
-        "0x4F750D13005444407D44dAA30922128db0374ca1"
+        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
      implementations.0:
-        "0x4F750D13005444407D44dAA30922128db0374ca1"
+        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
      values.impl:
-        "0x4F750D13005444407D44dAA30922128db0374ca1"
+        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      upgradeability.implementation:
-        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
+        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
      implementations.0:
-        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
+        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
      values.impl:
-        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
+        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.instances.7:
+        ["0x6F6C0837b2c45B1bfE970bd5a0BB171605cb44F3"]
      values.instances.6:
+        ["0x4A9d339c94D1D3b685e3923907A98c73b8168AFF"]
      values.nextInstanceId:
-        6
+        8
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F)
    +++ description: None
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
+        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
      implementations.0:
-        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
+        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
      values.impl:
-        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
+        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
      values.CALLDATA_MESSAGE_SIZE_BYTES:
+        352
    }
```

```diff
+   Status: CREATED
    contract ProverSet (0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd)
    +++ description: None
```

## Source code changes

```diff
...0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd.sol} | 14 ++++-
 .../ProverSetProxy/ProverSet.sol                   | 14 ++++-
 .../SharedERC20Vault/ERC20Vault.sol                | 45 +++++++-------
 .../SignalService/SignalService.sol                | 70 ++++++++--------------
 .../TaikoBridge/Bridge.sol                         | 31 +++++++---
 .../TaikoL1Contract/TaikoL1.sol                    | 66 +++++++++-----------
 .../TaikoToken/TaikoToken.sol                      | 10 ++++
 7 files changed, 134 insertions(+), 116 deletions(-)
```

Generated with discovered.json: 0x5d7159ace678f291bde2f744c708641bebd2b669

# Diff at Thu, 06 Jun 2024 12:40:03 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@68b8e831d7a9790dc56ed4caf0e841fbec8adb53 block: 20018468
- current block number: 20032840

## Description

TaikoL1Contract implementation update:
- Retrieve the tier configurations based on router rather than tier_provider
- Removed L1_UNAUTHORIZED error and _isProposerPermitted function, making block proposing permissionless.
- checkEOAForCalldataDA is not in getConfig(), used when blob usages is not detected, it will check the calldata for tx data.
- LibStrings changes: removed assignment_hook, proposer and proposer_one. Proposer and proposer_one still resolve but unused since _isProposerPermitted is removed. 

SignalService update: getSyncedChainData to getSyncedChainHeight, some error changes.

Prover_set update: reflect changes to LibStrings, made natively aware of taiko token.

SGXVerifier update: reflect changes to LibStrings, some error changes. _replaceInstance only if new instance != old instance.

GuardianProver(s) update: safeApprove and safeTransfer function to approve and transfer. Reflect changes to LibStrings.

L1RollupAddressManager update: removed B_ASSIGNMENT_HOOK, B_PROPOSER, B_PROPOSER_ONE, B_TIER_PROVIDER. Added B_TIER_ROUTER.


## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.implementation:
-        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
+        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
      implementations.0:
-        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
+        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
      values.assignment_hook:
-        "0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6"
+        "0x0000000000000000000000000000000000000000"
      values.getConfig.7:
+        true
      values.impl:
-        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
+        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
      values.prover_set:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0x500735343372Dd6c9B84dBc7a75babf4479742B9)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6)
    +++ description: None
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      upgradeability.implementation:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      implementations.0:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      values.impl:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      upgradeability.implementation:
-        "0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"
+        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
      implementations.0:
-        "0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"
+        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
      values.impl:
-        "0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"
+        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.implementation:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
      implementations.0:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
      values.impl:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.nonce:
-        26
+        28
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      upgradeability.implementation:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
      implementations.0:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
      values.impl:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      upgradeability.implementation:
-        "0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"
+        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
      implementations.0:
-        "0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"
+        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
      values.impl:
-        "0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"
+        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      upgradeability.implementation:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      implementations.0:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      values.impl:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
    }
```

```diff
+   Status: CREATED
    contract ProverSet (0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F)
    +++ description: None
```

## Source code changes

```diff
.../AssignmentHook/AssignmentHook.sol => /dev/null | 2714 --------------------
 .../AssignmentHook/ERC1967Proxy.p.sol => /dev/null |  593 -----
 .../GuardianMinorityProver/GuardianProver.sol      |  136 +-
 .../GuardianProver.sol                             |  136 +-
 .../L1RollupAddressManager.sol                     |    8 +-
 ...0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F.sol} |   85 +-
 .../ProverSetProxy/ProverSet.sol                   |   85 +-
 .../SgxVerifier/SgxVerifier.sol                    |   40 +-
 .../SignalService/SignalService.sol                |   70 +-
 .../TaikoL1Contract/TaikoL1.sol                    |  333 +--
 10 files changed, 263 insertions(+), 3937 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20018468 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.tier_sgx_zkvm:
-        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_SGX_ZKVM:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6) {
    +++ description: None
      values.proxiableUUID:
-        "EXPECT_REVERT"
      errors:
+        {"proxiableUUID":"Multicall failed"}
    }
```

Generated with discovered.json: 0xc7cd32149b27868b3a50016ee3970759f8e9aa0d

# Diff at Tue, 04 Jun 2024 09:25:32 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@8229f24e26195fa97d8d36bab0dd2d52dec7efa6 block: 20009991
- current block number: 20017546

## Description

Two contracts implementation changed, TaikoL1.sol, and Bridge.sol.
- TaikoL1.sol: introduced B_TIER_ROUTER = bytes32("tier_router") to replace B_TIER_PROVIDER
- Bridge.sol: Added a max proof size for a message to be processable by a relayer, an insufficent gas check, and added the B_TIER_ROUTER variable support.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.implementation:
-        "0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"
+        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
      implementations.0:
-        "0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"
+        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
      values.impl:
-        "0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"
+        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
      values.tier_router:
-        "0x0000000000000000000000000000000000000000"
+        "0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F"
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.nonce:
-        24
+        26
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
+        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
      implementations.0:
-        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
+        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
      values.impl:
-        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
+        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
      values.RELAYER_MAX_PROOF_BYTES:
+        200000
    }
```

```diff
+   Status: CREATED
    contract TierRouter (0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F)
    +++ description: None
```

## Source code changes

```diff
.../TaikoBridge/Bridge.sol                         | 131 +++++++++++++--------
 .../TaikoL1Contract/TaikoL1.sol                    |  68 ++++++-----
 .../taiko/ethereum/.flat/TierRouter.sol            |  15 +++
 3 files changed, 133 insertions(+), 81 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20009991 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.tier_provider:
-        "0x4cffe56C947E26D07C14020499776DB3e9AE3a23"
      values.tier_router:
+        "0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x46b03e9120fb191d6dc7e9e29ada0f5de7841449

# Diff at Mon, 03 Jun 2024 08:06:00 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3f44aa4fafff6ecd52bf4dcc77df7a9b1884b765 block: 19985265
- current block number: 20009991

## Description

Change in bridge implementation processMessage function: message Status and B_OUT_OF_ETH_QUOTA revert logic.

## Watched changes

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.nonce:
-        23
+        24
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"
+        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
      implementations.0:
-        "0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"
+        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
      values.impl:
-        "0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"
+        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
    }
```

## Source code changes

```diff
.../TaikoBridge/Bridge.sol                         | 79 ++++++++++------------
 1 file changed, 37 insertions(+), 42 deletions(-)
```

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
