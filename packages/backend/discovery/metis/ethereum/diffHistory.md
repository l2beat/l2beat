Generated with discovered.json: 0x9e075f62de4fda05f3daec06b85a96474f6d0ef5

# Diff at Wed, 20 Mar 2024 14:18:46 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@88f881ab370a6b85fd531f2bc620891afd1f41bb block: 19432288
- current block number: 19476458

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: None
      values._1088_MVM_Proposer:
-        "0x9cB01d516D930EF49591a05B09e0D33E6286689D"
+        "0xf3CEB4C2ef996CdBc95C4E18c6D0CA988CC09040"
      values.StateCommitmentChain:
-        "0xf209815E595Cdf3ed0aAF9665b1772e608AB9380"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
    }
```

```diff
-   Status: DELETED
    contract StateCommitmentChain (0xf209815E595Cdf3ed0aAF9665b1772e608AB9380)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6)
    +++ description: None
```

## Source code changes

```diff
.../ICanonicalTransactionChain.sol => /dev/null    | 441 ---------------------
 .../libraries/rlp/Lib_RLPWriter.sol => /dev/null   | 208 ----------
 .../utils/Lib_Bytes32Utils.sol => /dev/null        |  47 ---
 .../utils/Lib_BytesUtils.sol => /dev/null          | 127 ------
 .../@openzeppelin/contracts/access/Ownable.sol     |   0
 .../@openzeppelin/contracts/utils/Context.sol      |   0
 .../contracts/L1/rollup/IChainStorageContainer.sol |  62 +--
 .../contracts/L1/rollup/IStateCommitmentChain.sol  |  55 +--
 .../contracts/L1/verification/IBondManager.sol     |   1 +
 .../contracts/MVM/MVM_StateCommitmentChain.sol}    | 330 +++++----------
 .../contracts/libraries/codec/Lib_OVMCodec.sol     |   3 -
 .../libraries/resolver/Lib_AddressManager.sol      |   0
 .../libraries/resolver/Lib_AddressResolver.sol     |   0
 .../contracts/libraries/rlp/Lib_RLPReader.sol      |   0
 .../contracts/libraries/utils/Lib_MerkleTree.sol   |   0
 .../contracts/libraries/utils/Lib_Uint.sol         |  39 ++
 .../StateCommitmentChain/implementation/meta.txt   |   2 +
 .../StateCommitmentChain/meta.txt => /dev/null     |   2 -
 .../contracts/chugsplash/L1ChugSplashProxy.sol     | 278 +++++++++++++
 .../interfaces/iL1ChugSplashDeployer.sol           |   9 +
 .../.code/StateCommitmentChain/proxy/meta.txt      |   2 +
 21 files changed, 459 insertions(+), 1147 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19432288 (main branch discovery), not current.

```diff
    contract StateCommitmentChain (0xf209815E595Cdf3ed0aAF9665b1772e608AB9380) {
    +++ description: None
      values.getLastSequencerTimestampByChainId:
-        1710389927
+        [0,0,0,0,0]
      values.getTotalBatchesByChainId:
-        22918
+        [0,0,0,0,0]
      values.getTotalElementsByChainId:
-        15213630
+        [0,0,0,0,0]
      errors:
+        {"getLastSequencerTimestampByChainId":"Too many values. Update configuration to explore fully","getTotalBatchesByChainId":"Too many values. Update configuration to explore fully","getTotalElementsByChainId":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0xb4944b31e0a3f27a1a1f785c95fb0e29a6338e7a

# Diff at Thu, 14 Mar 2024 09:14:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@af87effd99a7b745cb97368cfbb16dc82443174a block: 18833503
- current block number: 19432288

## Description

Two signers are added to the multisig.

## Watched changes

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: None
      values.getOwners[7]:
+        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
      values.getOwners[6]:
+        "0xB961047013F974C5b6B6F8dA4402379525316550"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.5:
-        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.4:
-        "0xB961047013F974C5b6B6F8dA4402379525316550"
+        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.3:
-        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.2:
-        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.1:
-        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.0:
-        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
    }
```

Generated with discovered.json: 0xd3b550ff7c80b542babb88f19ab684dbc8a006b9

# Diff at Thu, 21 Dec 2023 10:01:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e3ed8c1fec052d9121fe4f20c32a54980307e76e

## Description

The total supply of the Metis Token has been increased to 10000000.

## Watched changes

```diff
    contract MToken (0x9E32b13ce7f2E80A01932B42553652E053D6ed8e) {
      values.totalSupply:
-        "5410000510000000000000000"
+        "10000000000000000000000000"
    }
```
