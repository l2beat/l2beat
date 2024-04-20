Generated with discovered.json: 0x9a3a63d115a94c4282aea8a94bf88911eac00254

# Diff at Sat, 20 Apr 2024 08:12:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@262f9e3e98ac8a85b09235e0b440b48e826f1f9f block: 19616998
- current block number: 19695350

## Description

A transaction is executed to send ~2.5 ETH from the ValidatorPool contract to the trusted validator and member of SC `0x3aa00bb915a8e78b0523e4c365e3e70a19d329e6`.
This was enabled by the `withdrawTo()` function that was added in the previous upgrade. (see below) The source of funds is from the balance of the SecurityCouncil inside the ValidatorPool contract, leaving the SC with 0.12 ETH of balance in the ValidatorPool. The SC's balance inside the ValidatorPool comes from taxes in the `increaseBond()` function.
Context: The previous reimbursement in this [tweet by Kroma](https://twitter.com/kroma_network/status/1775801214552375417).




## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
+++ description: Increases with each Security Council action.
+++ type: L2
+++ severity: HIGH
      values.transactionCount:
-        2
+        3
    }
```

Generated with discovered.json: 0x68b9b451a1ae0f51c4cc2055cdd6530505b7c803

# Diff at Tue, 09 Apr 2024 08:50:09 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bdb0620154d0bd06d04a6877172f01b9a2a0b8c9 block: 19567016
- current block number: 19616998

## Description

This upgrade brings small changes with huge diffs in the non-flat sources because new (but unused!) .sol files were pushed to etherscan among the actually upgraded implementations. This happens because for example the SecurityCouncil.sol that is shown on the Collosseum implementation's address on etherscan is now a newer version than the actual SecurityCouncil.sol that sits at the SECURITY_COUNCIL address (currently `0x3de211088dF516da72efe68D386b561BEE256Ec4`) The newer version is used only as an interface while the old version at the defined address is imported and used.
Our flat source files mostly ignore this.

### Main changes

1. Change from Semver to ISemver in the two upgraded implementations (ValidatorPool and Colosseum) with no functional changes
2. Support of Post-Shanghai (on the L2) block headers on the L1 Colosseum
3. Ability to withdraw to a specified address from the ValidatorPool

original description from the onchain upgrade proposal in tx# `0x80b280058f4eab3d9b250be874a5e7e816beaf68553f3ba61ec5c76340cfec5d`:
[Smart Contract upgrades for v1.3.4]

### 1. Addition of withdrawTo in ValidatorPool

Previously, validators could only withdraw funds to themselves. Now, with the withdrawTo function, they can withdraw directly to a specified address. Implementation contract address: `0x8EDc4cCa2aF96f5D5141d55333043a65c3f59Ec4`

### 2. Change in block header hash function for Colosseum

With the Shanghai upgrade on the Kroma mainnet, a withdrawalsRoot field has been added to the block header. Accordingly, the hash function for obtaining the block header in Colosseum has been modified. Implemenatation contract address: `0x311b4A33b6dC4e080eE0d98caAaf8dF86C833066`

### Current Context

Kroma also had two fork incidents on their mainnet L2:

- March 12: https://twitter.com/kroma_network/status/1775801201197531144
- Apr 1: https://twitter.com/kroma_network/status/1774683208753590506

Right after the upgrade that is described above, an L2 output root was deleted after having been fault proven:

- output root # 5017 from Apr 1 at L2 block number 9028800 in eth mainnet tx# 0x74e2739982fde96145d822151d93e093ab915e357cdd7167dd925ce4026e0841

Earlier Challenges for the same output were not successfully proven and i assume that the difference in block header construction after the upgrade was a fix for that.

## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
+++ description: Increases with each Security Council action.
+++ type: L2
+++ severity: HIGH
      values.transactionCount:
-        1
+        2
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      upgradeability.implementation:
-        "0x7526F997ea040B3949415c3a44e708273863AA2b"
+        "0x311b4A33b6dC4e080eE0d98caAaf8dF86C833066"
      implementations.0:
-        "0x7526F997ea040B3949415c3a44e708273863AA2b"
+        "0x311b4A33b6dC4e080eE0d98caAaf8dF86C833066"
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: None
      upgradeability.implementation:
-        "0x3eb033BAc5c449bDcb6D082c4f728eDAfC8D75fa"
+        "0x8EDc4cCa2aF96f5D5141d55333043a65c3f59Ec4"
      implementations.0:
-        "0x3eb033BAc5c449bDcb6D082c4f728eDAfC8D75fa"
+        "0x8EDc4cCa2aF96f5D5141d55333043a65c3f59Ec4"
    }
```

## Source code changes

```diff
.../implementation/contracts/L1/Colosseum.sol      |   16 +-
 .../implementation/contracts/L1/KromaPortal.sol    |   12 +-
 .../implementation/contracts/L1/L2OutputOracle.sol |   12 +-
 .../contracts/L1/SecurityCouncil.sol               |   40 +-
 .../implementation/contracts/L1/SystemConfig.sol   |   12 +-
 .../implementation/contracts/L1/ValidatorPool.sol  |   45 +-
 .../implementation/contracts/L1/ZKVerifier.sol     |  138 +--
 .../contracts/L2/L2StandardBridge.sol              |   17 +-
 .../contracts/L2/ValidatorRewardVault.sol          |   56 +-
 .../contracts/governance/UpgradeGovernor.sol       |  179 +++
 .../implementation/contracts/libraries/Hashing.sol |   53 +-
 .../contracts/libraries/Predeploys.sol             |    4 +-
 .../implementation/contracts/libraries/Types.sol   |   21 +-
 .../contracts/universal/FeeVault.sol               |   39 +-
 .../universal/IMultiSigWallet.sol => /dev/null     |  193 ----
 .../implementation/contracts/universal/ISemver.sol |   13 +
 .../contracts/universal/ITokenMultiSigWallet.sol   |  120 +++
 .../contracts/universal/KromaMintableERC20.sol     |   14 +-
 .../universal/MultiSigWallet.sol => /dev/null      |  533 ---------
 .../contracts/universal/Semver.sol => /dev/null    |   58 -
 .../contracts/universal/TokenMultiSigWallet.sol    |  258 +++++
 .../Colosseum/implementation/meta.txt              |    2 +-
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../governance/GovernorUpgradeable.sol             |  736 +++++++++++++
 .../governance/IGovernorUpgradeable.sol            |  326 ++++++
 .../governance/TimelockControllerUpgradeable.sol   |  434 ++++++++
 .../GovernorCountingSimpleUpgradeable.sol          |  113 ++
 .../extensions/GovernorSettingsUpgradeable.sol     |  122 +++
 .../GovernorTimelockControlUpgradeable.sol         |  178 +++
 .../GovernorVotesQuorumFractionUpgradeable.sol     |  133 +++
 .../extensions/GovernorVotesUpgradeable.sol        |   69 ++
 .../extensions/IGovernorTimelockUpgradeable.sol    |   39 +
 .../governance/utils/IVotesUpgradeable.sol         |   56 +
 .../interfaces/IERC165Upgradeable.sol              |    6 +
 .../interfaces/IERC5267Upgradeable.sol             |   28 +
 .../interfaces/IERC5805Upgradeable.sol             |    9 +
 .../interfaces/IERC6372Upgradeable.sol             |   17 +
 .../token/ERC1155/IERC1155ReceiverUpgradeable.sol  |   58 +
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../utils/CheckpointsUpgradeable.sol               |  560 ++++++++++
 .../utils/StringsUpgradeable.sol}                  |   12 +-
 .../utils/cryptography/ECDSAUpgradeable.sol        |  217 ++++
 .../utils/cryptography/EIP712Upgradeable.sol       |  205 ++++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 ++++++
 .../utils/math/SafeCastUpgradeable.sol             | 1136 ++++++++++++++++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/DoubleEndedQueueUpgradeable.sol  |  170 +++
 .../implementation/contracts/L1/KromaPortal.sol    |   12 +-
 .../implementation/contracts/L1/L2OutputOracle.sol |   12 +-
 .../implementation/contracts/L1/SystemConfig.sol   |   12 +-
 .../implementation/contracts/L1/ValidatorPool.sol  |   28 +-
 .../contracts/L2/L2StandardBridge.sol              |   17 +-
 .../contracts/L2/ValidatorRewardVault.sol          |   56 +-
 .../implementation/contracts/libraries/Hashing.sol |   53 +-
 .../contracts/libraries/Predeploys.sol             |    4 +-
 .../contracts/universal/FeeVault.sol               |   39 +-
 .../implementation/contracts/universal/ISemver.sol |   13 +
 .../contracts/universal/KromaMintableERC20.sol     |   14 +-
 .../contracts/universal/Semver.sol => /dev/null    |   58 -
 .../ValidatorPool/implementation/meta.txt          |    2 +-
 63 files changed, 6485 insertions(+), 1119 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19567016 (main branch discovery), not current.

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
    }
```

Generated with discovered.json: 0x310dac62fc3a977695365cb5f63945bc621c6113

# Diff at Tue, 02 Apr 2024 08:48:56 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f62e2b01d51472dd8c710b0599031b7ba1a58f0d block: 19474421
- current block number: 19567016

## Description

A root is challenged.
Context: Kroma had issues on Apr 1. Sequencer was stopped and is now operational again. Around this incident there were multiple challenges created, so far no challenge was succesful.

## Watched changes

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
+++ description: State roots that have been challenged by the validators. Challenges are created when, according to the validators, the roots commit to an incorrect L2 state.
+++ severity: MEDIUM
      values.challengedRoots.2:
+        5017
    }
```

Generated with discovered.json: 0x192fbb137203cbda301e605a6cd68bc4473be030

# Diff at Wed, 20 Mar 2024 07:28:01 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@445fe8affe786a2fd91907e202a17fb37f748047 block: 19467530
- current block number: 19474421

## Description

Added escrow for USDC.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19467530 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract USDCBridge (0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e)
    +++ description: None
```

Generated with discovered.json: 0x1a008a7fbef09baf0ce1d2c7b0c2569920692411

# Diff at Tue, 19 Mar 2024 08:14:51 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@87a9df6317bf41ef2d063033dfc77d54521b9991 block: 19439816
- current block number: 19467530

## Description

A new proposal for an L2 output root deletion was submitted and is executed. The deleted root metadata is:
"submitter":"0xfa3a4f7e5e1238d188e6d2dc6d1a9c5fa94c3c17",
"outputRoot":"0x9b5606d9c8fdc6517211cd2e7255c1dee0475d25515889b1d78789c346170191",
"timestamp":"1710224711","l2BlockNumber":"8172000"

## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
+++ description: Increases with each Security Council action.
+++ type: L2
+++ severity: HIGH
      values.transactionCount:
-        0
+        1
    }
```

Generated with discovered.json: 0xffe98182ff3880cc6479d9f173c18bfb383280d6

# Diff at Tue, 12 Mar 2024 10:43:25 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@aa756f53b5067168dd1bce4c3f562d0212b0da15 block: 19412001
- current block number: 19418455

## Description

A root is challenged.

## Watched changes

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      values.challengedRoots[1]:
+        4540
    }
```

Generated with discovered.json: 0xb82f88c28e19c911b04f370e8b70b9047afd71ae

# Diff at Mon, 11 Mar 2024 13:02:21 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19383415
- current block number: 19412001

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19383415 (main branch discovery), not current.

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x66e7d57ef59143fb02afe041c6d98f4b33e448d9

# Diff at Thu, 07 Mar 2024 12:54:19 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ef5ca32c526f9f368a9df9c40dfdb81fe1a9382c block: 19317972
- current block number: 19383415

## Description

One SC member is added and the threshold has been updated accordingly to be above 75%. The delay has been removed so the risk has been updated.

## Watched changes

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: None
      values.getMinDelay:
-        604800
+        0
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      values.quorum:
-        7
+        8
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      values.tokenOwners[9]:
+        "0x77Fe100758c5320cdfBb4f4a0Bed57885c97158A"
      values.tokens[9]:
+        11
      values.totalSupply:
-        9
+        10
    }
```

Generated with discovered.json: 0xf9a2868df47939ae03b5391125f035a38ff09445

# Diff at Tue, 27 Feb 2024 09:26:18 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@4f9617ef0b726c0af67b0e31e0d1ed434f10f1ef block: 19182633
- current block number: 19317972

## Description

A Kroma validator has created a challenge (challenging a state root) for the first time.

## Watched changes

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
      values.challengedRoots[0]:
+        4062
    }
```

Generated with discovered.json: 0xf2efb953c5d3442db9a5c3a901d3af836fbd3787

# Diff at Thu, 08 Feb 2024 09:45:31 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@0a61ea8397e7cdcf34b79a079bc53c0c2e703fe2 block: 18940443
- current block number: 19182633

## Description

Add opStackDA and opStackSequencerInbox handlers

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18940443 (main branch discovery), not current.

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
      values.opStackDA:
+        {"isSomeTxsLengthEqualToCelestiaDAExample":false}
      values.sequencerInbox:
+        "0xfF00000000000000000000000000000000000255"
    }
```

Generated with discovered.json: 0x5c2d3985c37d7e2b7bfa690fefaec55556e068d8

# Diff at Fri, 05 Jan 2024 10:21:46 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ea50ecee4d08800c3cff3742fc1c8912fc54c16c

## Description

The Security Council is now a 7/9 multisig, satisfying the requirements to be considered a Security Council.

## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
      values.quorum:
-        4
+        7
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
      values.quorumNumerator:
-        51
+        82
    }
```

# Diff at Thu, 23 Nov 2023 10:41:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@4c7175133fcba5685ddf8bf8d42acc70413b9b0c

## Description

Not sure what's going on here. Look at the description below this one.

## Watched changes

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
      values.tokenOwners.8:
-        "0x8ECF028Cd647379E580DaA6701A11154750fcd3c"
+        "0xbDeE962137373A755a71C716E01B9946B1a27686"
      values.tokenOwners.7:
-        "0xe1b712e16Be1Eb098D0b2B846e2f547F9E292851"
+        "0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1"
      values.tokenOwners.6:
-        "0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1"
+        "0x3a4F65D1ACFb2A3F5AD93ef7b240bfa1079052e0"
      values.tokenOwners.5:
-        "0xECe4AAf6A41aa81A164363Ec6C420510617Fc998"
+        "0x7B3225ADc5D908668FaA050246680CBE4e75A93f"
      values.tokenOwners.4:
-        "0x3a4F65D1ACFb2A3F5AD93ef7b240bfa1079052e0"
+        "0x5ddcf494A8b6EeE4904934E829109cCF584EAF80"
      values.tokenOwners.3:
-        "0x7B3225ADc5D908668FaA050246680CBE4e75A93f"
+        "0xECe4AAf6A41aa81A164363Ec6C420510617Fc998"
      values.tokenOwners.2:
-        "0x5ddcf494A8b6EeE4904934E829109cCF584EAF80"
+        "0xe1b712e16Be1Eb098D0b2B846e2f547F9E292851"
      values.tokenOwners.1:
-        "0xbDeE962137373A755a71C716E01B9946B1a27686"
+        "0x8ECF028Cd647379E580DaA6701A11154750fcd3c"
    }
```

# Diff at Wed, 22 Nov 2023 09:43:04 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@265d269ec8f97fee9cd01487403d12ff66e8509f

## Description

### Timelock

![image](https://github.com/l2beat/l2beat/assets/30298476/ead78084-4fb9-4567-b8b1-3e8ba8928205)
Removed the possibility to bypass the timelock delay. Also, the delay has been reduced from 30 days to 7 days.

### SystemConfig

Updated the reward scalar, doesn't affect security.

### SecurityCouncil

The Security Council now inherits from `TokenMultisigWallet` instead of `MultiSigWallet`. There is no particular change, the contract is much cleaner now and when a deletion is requested it gets also auto-confirmed by the sender. The role of this contrc

### UpgradeGovernor

Removed the function that allowed to bypass the timelock delay since it's not possible anymore. The UpgradeGovernor logic is based on the SecurityCouncilToken ownership.

### SecurityCouncilToken

Added self-delegation by default.

### ValidatorPool

Slightly tweaked the logic to select the next proposer, related to some small changes in the unbound mechanism.

## Watched changes

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
      upgradeability.implementation:
-        "0x595E1b330892Fcbf18b2BF099DE501Ad4d6A07C4"
+        "0xe44da6e9fA92E3FD897Da84d38fa6B9322Dd22c3"
      implementations.0:
-        "0x595E1b330892Fcbf18b2BF099DE501Ad4d6A07C4"
+        "0xe44da6e9fA92E3FD897Da84d38fa6B9322Dd22c3"
      values.getMinDelay:
-        2592000
+        604800
    }
```

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
      values.validatorRewardScalar:
-        10000
+        5000
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
      upgradeability.implementation:
-        "0x2BB1c629c46a4018fBe2538a98da7162F8355583"
+        "0x61c7C854Dcdf8393230B1242a4c1107f4d023c28"
      implementations.0:
-        "0x2BB1c629c46a4018fBe2538a98da7162F8355583"
+        "0x61c7C854Dcdf8393230B1242a4c1107f4d023c28"
      values.GOVERNOR:
-        "0xA03c13C6597a0716D1525b7fDaD2fD95ECb49081"
+        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
      values.numConfirmationsRequired:
-        1
      values.owners:
-        ["0x3aa00bb915A8e78b0523E4c365e3E70A19d329e6","0xe1b712e16Be1Eb098D0b2B846e2f547F9E292851","0x8ECF028Cd647379E580DaA6701A11154750fcd3c","0xbDeE962137373A755a71C716E01B9946B1a27686","0x7B3225ADc5D908668FaA050246680CBE4e75A93f","0x5ddcf494A8b6EeE4904934E829109cCF584EAF80","0xECe4AAf6A41aa81A164363Ec6C420510617Fc998","0x3a4F65D1ACFb2A3F5AD93ef7b240bfa1079052e0","0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1"]
      values.version:
-        "1.0.0"
+        "1.1.0"
      values.clock:
+        18626452
      values.confirmations:
+        [0,0,0,0,0]
      values.quorum:
+        4
      errors:
+        {"confirmations":"Too many values. Update configuration to explore fully","owners":"Cannot find a matching method for owners"}
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
      upgradeability.implementation:
-        "0x2a51e099CC7AF922CcDe7F3db909DC7b71B8D030"
+        "0x64F8F4EB207D51F74caf6db644Bf710Ad86989b3"
      implementations.0:
-        "0x2a51e099CC7AF922CcDe7F3db909DC7b71B8D030"
+        "0x64F8F4EB207D51F74caf6db644Bf710Ad86989b3"
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
      upgradeability.implementation:
-        "0x54140F4Cd6e6665BE0151eD5a8aC949EC2942439"
+        "0x108eDc4Df0b9B04dcE9f6FFBD65Dd9895562c14C"
      implementations.0:
-        "0x54140F4Cd6e6665BE0151eD5a8aC949EC2942439"
+        "0x108eDc4Df0b9B04dcE9f6FFBD65Dd9895562c14C"
      values.version:
-        "1.0.0"
+        "1.0.1"
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
      upgradeability.implementation:
-        "0x6e1781678ffE6CDc109fd3bC0833c47BD0F23de1"
+        "0x3eb033BAc5c449bDcb6D082c4f728eDAfC8D75fa"
      implementations.0:
-        "0x6e1781678ffE6CDc109fd3bC0833c47BD0F23de1"
+        "0x3eb033BAc5c449bDcb6D082c4f728eDAfC8D75fa"
      values.version:
-        "1.0.0"
+        "1.0.1"
    }
```

## Source code changes

```diff
.../contracts/L1/SecurityCouncil.sol               |   37 +-
 .../implementation/contracts/L1/ValidatorPool.sol  |   21 +-
 .../implementation/contracts/L1/ZKVerifier.sol     |  138 +--
 .../contracts/L2/ValidatorRewardVault.sol          |    2 +-
 .../contracts/governance/UpgradeGovernor.sol       |  173 +++
 .../implementation/contracts/libraries/Types.sol   |   21 +-
 .../universal/IMultiSigWallet.sol => /dev/null     |  193 ----
 .../contracts/universal/ITokenMultiSigWallet.sol   |  120 +++
 .../universal/MultiSigWallet.sol => /dev/null      |  533 ---------
 .../contracts/universal/TokenMultiSigWallet.sol    |  258 +++++
 .../SecurityCouncil/implementation/meta.txt        |    2 +-
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../governance/GovernorUpgradeable.sol             |  736 +++++++++++++
 .../governance/IGovernorUpgradeable.sol            |  326 ++++++
 .../governance}/TimelockControllerUpgradeable.sol  |   74 +-
 .../GovernorCountingSimpleUpgradeable.sol          |  113 ++
 .../extensions/GovernorSettingsUpgradeable.sol     |  122 +++
 .../GovernorTimelockControlUpgradeable.sol         |   70 +-
 .../GovernorVotesQuorumFractionUpgradeable.sol     |  133 +++
 .../extensions/GovernorVotesUpgradeable.sol        |   69 ++
 .../extensions/IGovernorTimelockUpgradeable.sol    |   39 +
 .../governance/utils/IVotesUpgradeable.sol         |   56 +
 .../interfaces/IERC165Upgradeable.sol              |    6 +
 .../interfaces/IERC5267Upgradeable.sol             |   28 +
 .../interfaces/IERC5805Upgradeable.sol             |    9 +
 .../interfaces/IERC6372Upgradeable.sol             |   17 +
 .../token/ERC1155/IERC1155ReceiverUpgradeable.sol  |   58 +
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../utils/CheckpointsUpgradeable.sol               |  560 ++++++++++
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/cryptography/ECDSAUpgradeable.sol        |  217 ++++
 .../utils/cryptography/EIP712Upgradeable.sol       |  205 ++++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 ++++++
 .../utils/math/SafeCastUpgradeable.sol             | 1136 ++++++++++++++++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/DoubleEndedQueueUpgradeable.sol  |  170 +++
 .../contracts/governance/SecurityCouncilToken.sol  |    4 +-
 .../contracts/universal/KromaSoulBoundERC721.sol   |    1 +
 .../SecurityCouncilToken/implementation/meta.txt   |    2 +-
 .../contracts/governance/TimeLock.sol              |    2 +-
 .../Timelock/implementation/meta.txt               |    2 +-
 .../governance}/TimelockControllerUpgradeable.sol  |   74 +-
 .../contracts/governance/UpgradeGovernor.sol       |   47 +-
 .../UpgradeGovernor/implementation/meta.txt        |    2 +-
 .../governance/TimelockControllerUpgradeable.sol   |  434 ++++++++
 .../GovernorTimelockControlUpgradeable.sol         |  178 +++
 .../implementation/contracts/L1/ValidatorPool.sol  |   21 +-
 .../contracts/L2/ValidatorRewardVault.sol          |    2 +-
 .../implementation/contracts/libraries/Types.sol   |   21 +-
 .../ValidatorPool/implementation/meta.txt          |    2 +-
 53 files changed, 6269 insertions(+), 1075 deletions(-)
```

# Diff at Fri, 03 Nov 2023 09:59:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9fa31f2a6274083dfe7f01b69d1220921459db02

## Description

- Additional 8 EOAs added to the SecurityCouncil (making it a 1/9 multisig).
- Owner of the SecurityCouncilToken changed from EOA to a Timelock contract
  (0x2260...FDc1).

## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
      values.owners[8]:
+        "0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1"
      values.owners[7]:
+        "0x3a4F65D1ACFb2A3F5AD93ef7b240bfa1079052e0"
      values.owners[6]:
+        "0xECe4AAf6A41aa81A164363Ec6C420510617Fc998"
      values.owners[5]:
+        "0x5ddcf494A8b6EeE4904934E829109cCF584EAF80"
      values.owners[4]:
+        "0x7B3225ADc5D908668FaA050246680CBE4e75A93f"
      values.owners[3]:
+        "0xbDeE962137373A755a71C716E01B9946B1a27686"
      values.owners[2]:
+        "0x8ECF028Cd647379E580DaA6701A11154750fcd3c"
      values.owners[1]:
+        "0xe1b712e16Be1Eb098D0b2B846e2f547F9E292851"
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
      values.owner:
-        "0xA03c13C6597a0716D1525b7fDaD2fD95ECb49081"
+        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
      values.totalSupply:
-        1
+        9
    }
```

# Diff at Fri, 29 Sep 2023 07:58:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@af96105393755c6fead3fa1b6c9845f238580952

## Watched changes

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
      values.validators:
+        ["0x3aa00bb915A8e78b0523E4c365e3E70A19d329e6","0x81BF552f9Fc83e88012d6C3ab84cF1946Bc55FD0","0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1","0xfC3867F19161b8981d8B9c9fa3D7360c9Cee9733","0x0125adEE89dE396b586959190e931b83120359AB","0x7d06b6eA10cCb824d12FEd7c934B89866ab26C33","0x1F4f1450Cb0e8BF8cB792e37a2Cc41d990dB081D","0x91b6178188ccDD1e735F54ba135cd5EcabECdB15","0x328fbE99cC9A05f9e6f956847EDF8075661eb5fF","0x8ECF028Cd647379E580DaA6701A11154750fcd3c","0x4576481b914FE9FCA4Bbe6A85aB1A409124Ef9A7"]
    }
```
