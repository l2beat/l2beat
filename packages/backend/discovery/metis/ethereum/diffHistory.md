Generated with discovered.json: 0xde38746b2a8eb46a81cbd9adb7f4c3d8428bd5ca

# Diff at Wed, 24 Apr 2024 13:07:54 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@1202a7b400783429e5c223539f7469e1fc2e4c66 block: 19531985
- current block number: 19725427

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      values.rewardPayer:
-        "0x0000000000000000000000000000000000000000"
+        "0x62478E4eeb4070fE399866aB05e821AB97200947"
      values.totalLocked:
-        0
+        "118634578080235465000000"
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: None
      values.BondManager:
-        "0xf51B9C9a1c12e7E48BEC15DC358D0C1f0d7Eb3be"
+        "0x595801b85628ec6979C420988b8843A40F850528"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.BLOCK_REWARD:
-        761000000000000
+        1504744000000000
      values.curBatchState.3:
-        0
+        193
      values.curBatchState.2:
-        0
+        1
      values.curBatchState.1:
-        19424665
+        19711893
      values.curBatchState.0:
-        1
+        2
      values.currentBatch:
-        1
+        2
      values.mpcAddress:
-        "0x0000000000000000000000000000000000000000"
+        "0xD294A6f4287edbFeBF9d57B79ce657BD33bB8b3b"
      values.rewardPerBlock:
-        761000000000000
+        1504744000000000
      values.sequencers.3:
+        ["58634578080235465000000",0,2,2,0,0,0,1,"0x735Aad08c5eF7620b6422E85613f8335Ec07b573","0x31e623DCb8B43aD4d05aAA6209574cf336980590","0xa3f2635f4d555f68f7be80fcf7b13ec9ecdf09365e6a57f6c5f513aa1d1af4565e53a0612e4e4a97124aa95cc17a3e56b5da1afb21c41d9cdb7e5264380a0790","0x0Cf6ab3c169B0169E35aD58D350CbACdaF80E139",2]
      values.sequencers.2:
+        ["20000000000000000000000","341195111000000000000",1,1,0,0,0,1,"0x24194DFB135B33507a8F05C3F9Ada922F40CE3Ff","0xAfF606251d8540f97Ca2Db12774C0147A170aB9e","0x713de5a736a196d0d65fc7e5d8cd716086d099fbaee929774752f2e8e370105e2d90e846d64167ea59a95160277abddf004660c6dac47f5c92a0f00234fe7000","0x0000000000000000000000000000000000000000",2]
      values.sequencers.1:
+        ["20000000000000000000000","386890878000000000000",1,1,0,0,0,1,"0xe8D97563Cfd919F1B9F7cE0049346e8796148CD5","0xa233Cc81fC6C12e3318eA71EC5D7bBA78C706b04","0x1674b9842e300ab236bf6cedfea92e80a04cc7f12bbff2ff35b01295380d9211a9861a40867a4a04c6a89ee0a022f7afccbb5dddb87d622e1ddff9bd2069c7e8","0x0000000000000000000000000000000000000000",2]
      values.sequencers.0:
+        ["20000000000000000000000","431750306000000000000",1,1,0,0,0,1,"0x05B755a8B2fEc50391B5C38B2afB206Ba0e8e50E","0xEcA7Ae7dE0d1978DF299a547Ee66c4503fBa474D","0x4d5e02936a222d68b5d423e566828d8c67ca2290cf428254c44c7be458b33decec1fe85d900756811366e2d19baeb2fe81b46ce10c1863e00d811e68a4e76c9f","0x0000000000000000000000000000000000000000",2]
      values.totalSequencers:
-        0
+        4
    }
```

```diff
-   Status: DELETED
    contract BondManager (0xf51B9C9a1c12e7E48BEC15DC358D0C1f0d7Eb3be)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingPoolManager (0x014e8248D3B681d4ed703dE60885052Ff4321F5d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EqbToken (0x0Cf6ab3c169B0169E35aD58D350CbACdaF80E139)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BondManager (0x595801b85628ec6979C420988b8843A40F850528)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x62478E4eeb4070fE399866aB05e821AB97200947)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingPool (0x735Aad08c5eF7620b6422E85613f8335Ec07b573)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xc126455f93A03e7591324A1D0e217140C06e2Fa5)
    +++ description: None
```

## Source code changes

```diff
.../contracts/L1/verification/BondManager.sol      |  26 +-
 .../contracts/L1/verification/IBondManager.sol     |   1 +
 .../contracts/libraries/utils/Lib_Uint.sol         |  39 ++
 .../{.code@19531985 => .code}/BondManager/meta.txt |   2 +-
 .../access/OwnableUpgradeable.sol                  |  95 +++++
 .../proxy/utils/Initializable.sol                  | 138 +++++++
 .../token/ERC20/ERC20Upgradeable.sol               | 395 +++++++++++++++++++
 .../token/ERC20/IERC20Upgradeable.sol              |  82 ++++
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |  28 ++
 .../utils/AddressUpgradeable.sol                   | 195 ++++++++++
 .../utils/ContextUpgradeable.sol                   |  37 ++
 .../ethereum/.code/EqbToken/contracts/EqbToken.sol |  24 ++
 .../metis/ethereum/.code/EqbToken/meta.txt         |   2 +
 .../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++++++++
 .../implementation/contracts/base/Executor.sol     |  27 ++
 .../contracts/base/FallbackManager.sol             |  53 +++
 .../implementation/contracts/base/GuardManager.sol |  50 +++
 .../contracts/base/ModuleManager.sol               | 133 +++++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 +++
 .../contracts/external/GnosisSafeMath.sol          |  54 +++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../.code/GnosisSafe/implementation/meta.txt       |   2 +
 .../.code/GnosisSafe/proxy/GnosisSafeProxy.sol     | 155 ++++++++
 .../metis/ethereum/.code/GnosisSafe/proxy/meta.txt |   2 +
 .../meta.txt                                       |   0
 .../solc_0.8/openzeppelin/access/Ownable.sol       |   0
 .../openzeppelin/interfaces/draft-IERC1822.sol     |   0
 .../openzeppelin/proxy/ERC1967/ERC1967Proxy.sol    |   0
 .../openzeppelin/proxy/ERC1967/ERC1967Upgrade.sol  |   0
 .../solc_0.8/openzeppelin/proxy/Proxy.sol          |   0
 .../solc_0.8/openzeppelin/proxy/beacon/IBeacon.sol |   0
 .../openzeppelin/proxy/transparent/ProxyAdmin.sol  |   0
 .../transparent/TransparentUpgradeableProxy.sol    |   0
 .../solc_0.8/openzeppelin/utils/Address.sol        |   0
 .../solc_0.8/openzeppelin/utils/Context.sol        |   0
 .../solc_0.8/openzeppelin/utils/StorageSlot.sol    |   0
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 ++++
 .../contracts/interfaces/IERC1967.sol              |  26 ++
 .../contracts/interfaces/draft-IERC1822.sol        |  20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |  32 ++
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 171 +++++++++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |  86 +++++
 .../contracts/proxy/beacon/BeaconProxy.sol         |  61 +++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |  65 ++++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |  81 ++++
 .../transparent/TransparentUpgradeableProxy.sol    | 193 ++++++++++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 ++
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  88 +++++
 .../meta.txt                                       |   2 +
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |  82 ++++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 ++++++
 .../@openzeppelin/contracts/utils/Address.sol      | 222 +++++++++++
 .../access/AccessControlUpgradeable.sol            | 260 +++++++++++++
 .../access/IAccessControlUpgradeable.sol           |  88 +++++
 .../proxy/utils/Initializable.sol                  | 138 +++++++
 .../utils/AddressUpgradeable.sol                   | 195 ++++++++++
 .../utils/ContextUpgradeable.sol                   |  37 ++
 .../utils/StringsUpgradeable.sol                   |  75 ++++
 .../utils/introspection/ERC165Upgradeable.sol      |  42 ++
 .../utils/introspection/IERC165Upgradeable.sol     |  25 ++
 .../contracts/L1/Interfaces/IStakingPool.sol       |  23 ++
 .../contracts/L1/Interfaces/Metis/ILockingInfo.sol | 196 ++++++++++
 .../contracts/L1/Interfaces/Metis/ILockingPool.sol |  77 ++++
 .../L1/Interfaces/Metis/ISequencerInfo.sol         |  63 +++
 .../implementation/contracts/L1/StakingPool.sol    | 136 +++++++
 .../contracts/Utils/AMTConstants.sol               |  16 +
 .../.code/StakingPool/implementation/meta.txt      |   2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 ++++
 .../contracts/interfaces/IERC1967.sol              |  26 ++
 .../contracts/interfaces/draft-IERC1822.sol        |  20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |  32 ++
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 171 +++++++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |  86 +++++
 .../contracts/proxy/beacon/BeaconProxy.sol         |  61 +++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |  65 ++++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |  81 ++++
 .../transparent/TransparentUpgradeableProxy.sol    | 193 ++++++++++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 ++
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  88 +++++
 .../ethereum/.code/StakingPool/proxy/meta.txt      |   2 +
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |  82 ++++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 ++++++
 .../@openzeppelin/contracts/utils/Address.sol      | 222 +++++++++++
 .../contracts/utils/structs/EnumerableSet.sol      | 367 ++++++++++++++++++
 .../access/AccessControlUpgradeable.sol            | 260 +++++++++++++
 .../access/IAccessControlUpgradeable.sol           |  88 +++++
 .../proxy/utils/Initializable.sol                  | 138 +++++++
 .../utils/AddressUpgradeable.sol                   | 195 ++++++++++
 .../utils/ContextUpgradeable.sol                   |  37 ++
 .../utils/StringsUpgradeable.sol                   |  75 ++++
 .../utils/introspection/ERC165Upgradeable.sol      |  42 ++
 .../utils/introspection/IERC165Upgradeable.sol     |  25 ++
 .../contracts/L1/Interfaces/IStakingPool.sol       |  23 ++
 .../L1/Interfaces/IStakingPoolManager.sol          |  19 +
 .../contracts/L1/StakingPoolManager.sol            |  94 +++++
 .../contracts/Utils/AMTConstants.sol               |  16 +
 .../StakingPoolManager/implementation/meta.txt     |   2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 ++++
 .../contracts/interfaces/IERC1967.sol              |  26 ++
 .../contracts/interfaces/draft-IERC1822.sol        |  20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |  32 ++
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 171 +++++++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |  86 +++++
 .../contracts/proxy/beacon/BeaconProxy.sol         |  61 +++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |  65 ++++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |  81 ++++
 .../transparent/TransparentUpgradeableProxy.sol    | 193 ++++++++++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 ++
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  88 +++++
 .../.code/StakingPoolManager/proxy/meta.txt        |   2 +
 125 files changed, 9576 insertions(+), 11 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531985 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd)
    +++ description: None
```

Generated with discovered.json: 0x61dd6c8c90be3d312520dbd91d547e88fa6b5daf

# Diff at Thu, 28 Mar 2024 10:22:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19489325
- current block number: 19531985

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19489325 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      upgradeability.threshold:
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x32ada392a2476f61c6a679a370ed6032290b3273

# Diff at Fri, 22 Mar 2024 09:39:12 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0bfaf274e094a51da737f99f9979af9d44884387 block: 19432288
- current block number: 19489325

## Description

The State Commitment Chain (SCC) is upgraded to a new implementation behind a proxy and the default proposer is changed.

### Decentralized proposer changes in the SCC

The SCC now disregards the Canonical Transaction Chain (CTC).
The logic for accepting state batches from permissionless proposers in the SCC is now present in appendStateBatch(), but the BondManager still disqualifies any non-default proposer and thus in practice the sequencer is still centralized until the BondManager code gets updated to actually verify collateralization when called.

The old SCC rejected any third party state batches during a 'SEQUENCER_PUBLISH_WINDOW' of half a year, which effectively made the default sequencer the only one. This has now been deprecated in the new SCC implementation.

## Watched changes

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: None
      values._1088_MVM_Proposer:
-        "0x9cB01d516D930EF49591a05B09e0D33E6286689D"
+        "0xf3CEB4C2ef996CdBc95C4E18c6D0CA988CC09040"
+++ description: Manages the L2 state on Ethereum. L2 state batches can be appended here by proposers.
+++ type: CODE_CHANGE
+++ severity: HIGH
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
