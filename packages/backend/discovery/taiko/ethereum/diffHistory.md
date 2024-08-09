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
