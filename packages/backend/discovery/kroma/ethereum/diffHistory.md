Generated with discovered.json: 0x0bfa30e237d7f814492d4d1ab8191992240d15c4

# Diff at Tue, 12 Mar 2024 10:43:25 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@aa756f53b5067168dd1bce4c3f562d0212b0da15 block: 19412001
- current block number: 19418455

## Description

Kroma mainnet fork occured at block #8171899. Team is annoucning a rollback.

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
