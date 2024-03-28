Generated with discovered.json: 0xacb5d4376948d7d85443329dcc1ddcbba2f3598f

# Diff at Thu, 28 Mar 2024 10:32:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19439798
- current block number: 19532035

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19439798 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract ProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 13 (31%)"
    }
```

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 11 (45%)"
    }
```

Generated with discovered.json: 0xe51a8b638c121d61ad42bd18332c0850a4046684

# Diff at Thu, 14 Mar 2024 00:15:18 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@e9ab5d808868ba1ecef1f4a9acee050bd71c3c54 block: 19411918
- current block number: 19429627

## Description

Optimism uses blobs

## Watched changes

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
-        false
+        true
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279134670530344387928"
    }
```

Generated with discovered.json: 0xd34811c5c471b7976f33f0c576b6903f21608d61

# Diff at Mon, 11 Mar 2024 12:48:08 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19379201
- current block number: 19411918

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19379201 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x73720a3eaa19fcaa23f7cfa430c9ea5d48aa25df

# Diff at Wed, 06 Mar 2024 22:46:02 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@237a9d8802d6b77ea68f596e77a028c3f0e27e68 block: 19210753
- current block number: 19379201

## Description

Introduced SuperchainConfig contract, able to pause the following functions:
OptimismPortal.proveWithdrawalTransaction()
OptimismPortal.finalizeWithdrawalTransaction()
L1CrossDomainMessenger.relayMessage()
StandardBridge.finalizeBridgeERC20()
StandardBridge.finalizeBridgeETH()
L1ERC721Bridge.finalizeBridgeERC721().

## Watched changes

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    +++ description: None
      upgradeability.implementation:
-        "0x5efa852e92800D1C982711761e45c3FE39a2b6D8"
+        "0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"
      implementations.0:
-        "0x5efa852e92800D1C982711761e45c3FE39a2b6D8"
+        "0x33A032ec93Ec0C492Ec4BF0B30D5f51986E5a314"
      values.version:
-        "1.3.0"
+        "1.11.0"
    }
```

```diff
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    +++ description: None
      upgradeability.implementation:
-        "0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"
+        "0xa95B24af19f8907390eD15f8348A1a5e6Ccbc5C6"
      implementations.0:
-        "0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43"
+        "0xa95B24af19f8907390eD15f8348A1a5e6Ccbc5C6"
      values.version:
-        "1.4.0"
+        "2.2.0"
      values.paused:
+        false
      values.portal:
+        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract ProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      values.nonce:
-        0
+        1
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      values.nonce:
-        0
+        1
    }
```

```diff
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1) {
    +++ description: None
      upgradeability.implementation:
-        "0xBFB731Cd36D26c2a7287716DE857E4380C73A64a"
+        "0x566511a1A09561e2896F8c0fD77E8544E59bFDB0"
      implementations.0:
-        "0xBFB731Cd36D26c2a7287716DE857E4380C73A64a"
+        "0x566511a1A09561e2896F8c0fD77E8544E59bFDB0"
      values.version:
-        "1.1.0"
+        "2.0.0"
      values.otherBridge:
+        "0x4200000000000000000000000000000000000010"
      values.paused:
+        false
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    +++ description: None
      upgradeability.implementation:
-        "0x28a55488fef40005309e2DA0040DbE9D300a64AB"
+        "0xaBAbe63514dDd6277356F8cc3d6518aA8BDEB4de"
      implementations.0:
-        "0x28a55488fef40005309e2DA0040DbE9D300a64AB"
+        "0xaBAbe63514dDd6277356F8cc3d6518aA8BDEB4de"
      values.version:
-        "1.6.0"
+        "2.4.0"
      values.guardian:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.l2Oracle:
+        "0xdfe97868233d1aa22e815a266982f2cf17685a27"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.systemConfig:
+        "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.nonce:
-        0
+        1
    }
```

```diff
    contract L2OutputOracle (0xdfe97868233d1aa22e815a266982f2cf17685a27) {
    +++ description: None
      upgradeability.implementation:
-        "0xd2E67B6a032F0A9B1f569E63ad6C38f7342c2e00"
+        "0xDb5d932AF15D00F879CaBEbf008caDAAAa691e06"
      implementations.0:
-        "0xd2E67B6a032F0A9B1f569E63ad6C38f7342c2e00"
+        "0xDb5d932AF15D00F879CaBEbf008caDAAAa691e06"
      values.version:
-        "1.3.0"
+        "1.7.0"
      values.challenger:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.finalizationPeriodSeconds:
+        604800
      values.l2BlockTime:
+        2
      values.proposer:
+        "0x473300df21D047806A082244b417f96b32f13A33"
      values.submissionInterval:
+        1800
    }
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

## Source code changes

```diff
.../L1/L1CrossDomainMessenger.sol => /dev/null     |  67 ---
 .../contracts/L1/L2OutputOracle.sol => /dev/null   | 350 -------------
 .../contracts/L1/SystemConfig.sol => /dev/null     | 297 -----------
 .../libraries/Arithmetic.sol => /dev/null          |  48 --
 .../contracts/libraries/Burn.sol => /dev/null      |  42 --
 .../contracts/libraries/Bytes.sol => /dev/null     | 142 ------
 .../contracts/libraries/Constants.sol => /dev/null |  49 --
 .../contracts/libraries/Encoding.sol => /dev/null  | 162 ------
 .../contracts/libraries/Hashing.sol => /dev/null   | 172 -------
 .../libraries/Predeploys.sol => /dev/null          | 112 ----
 .../contracts/libraries/SafeCall.sol => /dev/null  | 160 ------
 .../contracts/libraries/Types.sol => /dev/null     |  84 ---
 .../libraries/rlp/RLPWriter.sol => /dev/null       | 221 --------
 .../trie/SecureMerkleTrie.sol => /dev/null         |  64 ---
 .../CrossDomainMessenger.sol => /dev/null          | 519 -------------------
 .../contracts/universal/Semver.sol => /dev/null    |  58 ---
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/utils/Address.sol                    |   0
 .../contracts/utils/math/Math.sol                  |   0
 .../contracts/utils/math/SignedMath.sol            |   0
 .../contracts}/access/OwnableUpgradeable.sol       |   0
 .../contracts}/proxy/utils/Initializable.sol       |   0
 .../contracts}/utils/AddressUpgradeable.sol        |   0
 .../contracts}/utils/ContextUpgradeable.sol        |   0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |   0
 .../L1CrossDomainMessenger/implementation/meta.txt |   2 +-
 .../contracts/utils/Strings.sol => /dev/null       |  75 ---
 .../src/L1/L1CrossDomainMessenger.sol              |  66 +++
 .../implementation/src/L1/L2OutputOracle.sol       | 296 +++++++++++
 .../implementation/src}/L1/OptimismPortal.sol      | 440 +++++++---------
 .../implementation/src}/L1/ResourceMetering.sol    | 124 ++---
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/L1/SystemConfig.sol         | 255 ++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 +
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Bytes.sol         | 144 ++++++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Encoding.sol      | 176 +++++++
 .../implementation/src/libraries/Hashing.sol       | 124 +++++
 .../implementation/src/libraries/Predeploys.sol    | 113 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../src}/libraries/rlp/RLPReader.sol               | 249 +++------
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 ++++++
 .../src}/libraries/trie/MerkleTrie.sol             | 210 +++-----
 .../src/libraries/trie/SecureMerkleTrie.sol        |  49 ++
 .../src/universal/CrossDomainMessenger.sol         | 400 +++++++++++++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src}/vendor/AddressAliasHelper.sol             |   0
 .../contracts/L1/L1StandardBridge.sol => /dev/null | 364 -------------
 .../libraries/Arithmetic.sol => /dev/null          |  48 --
 .../contracts/libraries/Burn.sol => /dev/null      |  42 --
 .../contracts/libraries/Constants.sol => /dev/null |  49 --
 .../contracts/libraries/Encoding.sol => /dev/null  | 162 ------
 .../contracts/libraries/Hashing.sol => /dev/null   | 172 -------
 .../libraries/Predeploys.sol => /dev/null          | 112 ----
 .../contracts/libraries/SafeCall.sol => /dev/null  | 160 ------
 .../contracts/libraries/Types.sol => /dev/null     |  84 ---
 .../libraries/rlp/RLPWriter.sol => /dev/null       | 221 --------
 .../CrossDomainMessenger.sol => /dev/null          | 519 -------------------
 .../OptimismMintableERC20.sol => /dev/null         | 149 ------
 .../contracts/universal/Semver.sol => /dev/null    |  58 ---
 .../universal/StandardBridge.sol => /dev/null      | 561 ---------------------
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/token/ERC20/ERC20.sol                |   0
 .../contracts/token/ERC20/IERC20.sol               |   0
 .../token/ERC20/extensions/IERC20Metadata.sol      |   0
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   0
 .../contracts/token/ERC20/utils/SafeERC20.sol      |   0
 .../contracts/utils/Address.sol                    |   0
 .../contracts/utils/Context.sol                    |   0
 .../utils/introspection/ERC165Checker.sol          |   0
 .../contracts/utils/introspection/IERC165.sol      |   0
 .../contracts/utils/math/Math.sol                  |   0
 .../contracts/utils/math/SignedMath.sol            |   0
 .../contracts}/proxy/utils/Initializable.sol       |   0
 .../contracts}/utils/AddressUpgradeable.sol        |   0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |   0
 .../L1StandardBridge/implementation/meta.txt       |   2 +-
 .../contracts/utils/Strings.sol => /dev/null       |  75 ---
 .../implementation/src/L1/L1StandardBridge.sol     | 317 ++++++++++++
 .../implementation/src}/L1/ResourceMetering.sol    | 124 ++---
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 +
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Encoding.sol      | 176 +++++++
 .../implementation/src/libraries/Hashing.sol       | 124 +++++
 .../implementation/src/libraries/Predeploys.sol    | 113 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 ++++++
 .../src/universal/CrossDomainMessenger.sol         | 400 +++++++++++++++
 .../src}/universal/IOptimismMintableERC20.sol      |  21 +-
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src/universal/OptimismMintableERC20.sol        | 140 +++++
 .../src/universal/StandardBridge.sol               | 475 +++++++++++++++++
 .../contracts/L1/L2OutputOracle.sol => /dev/null   | 350 -------------
 .../contracts/libraries/Types.sol => /dev/null     |  84 ---
 .../contracts/universal/Semver.sol => /dev/null    |  58 ---
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/utils/Address.sol                    |   0
 .../contracts/utils/math/Math.sol                  |   0
 .../contracts/utils/math/SignedMath.sol            |   0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |   0
 .../L2OutputOracle/implementation/meta.txt         |   2 +-
 .../contracts/utils/Strings.sol => /dev/null       |  75 ---
 .../implementation/src/L1/L2OutputOracle.sol       | 296 +++++++++++
 .../implementation/src}/L1/ResourceMetering.sol    | 124 ++---
 .../implementation/src/libraries/Arithmetic.sol    |  28 +
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../contracts/L1/L2OutputOracle.sol => /dev/null   | 350 -------------
 .../contracts/L1/SystemConfig.sol => /dev/null     | 297 -----------
 .../libraries/Arithmetic.sol => /dev/null          |  48 --
 .../contracts/libraries/Burn.sol => /dev/null      |  42 --
 .../contracts/libraries/Bytes.sol => /dev/null     | 142 ------
 .../contracts/libraries/Constants.sol => /dev/null |  49 --
 .../contracts/libraries/Encoding.sol => /dev/null  | 162 ------
 .../contracts/libraries/Hashing.sol => /dev/null   | 172 -------
 .../contracts/libraries/SafeCall.sol => /dev/null  | 160 ------
 .../contracts/libraries/Types.sol => /dev/null     |  84 ---
 .../libraries/rlp/RLPWriter.sol => /dev/null       | 221 --------
 .../trie/SecureMerkleTrie.sol => /dev/null         |  64 ---
 .../contracts/universal/Semver.sol => /dev/null    |  58 ---
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/utils/Address.sol                    |   0
 .../contracts/utils/math/Math.sol                  |   0
 .../contracts/utils/math/SignedMath.sol            |   0
 .../contracts}/access/OwnableUpgradeable.sol       |   0
 .../contracts}/proxy/utils/Initializable.sol       |   0
 .../contracts}/utils/AddressUpgradeable.sol        |   0
 .../contracts}/utils/ContextUpgradeable.sol        |   0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |   0
 .../OptimismPortal/implementation/meta.txt         |   2 +-
 .../contracts/utils/Strings.sol => /dev/null       |  75 ---
 .../implementation/src/L1/L2OutputOracle.sol       | 296 +++++++++++
 .../implementation/src}/L1/OptimismPortal.sol      | 440 +++++++---------
 .../implementation/src/L1/ResourceMetering.sol     | 162 ++++++
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/L1/SystemConfig.sol         | 255 ++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 +
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Bytes.sol         | 144 ++++++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Encoding.sol      | 176 +++++++
 .../implementation/src/libraries/Hashing.sol       | 124 +++++
 .../implementation/src/libraries/SafeCall.sol      | 142 ++++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/libraries/Types.sol         |  70 +++
 .../src}/libraries/rlp/RLPReader.sol               | 249 +++------
 .../implementation/src/libraries/rlp/RLPWriter.sol | 163 ++++++
 .../src}/libraries/trie/MerkleTrie.sol             | 210 +++-----
 .../src/libraries/trie/SecureMerkleTrie.sol        |  49 ++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../src}/vendor/AddressAliasHelper.sol             |   0
 .../contracts/proxy/utils/Initializable.sol        |   0
 .../contracts/utils/Address.sol                    |   0
 .../.code/SuperchainConfig/implementation/meta.txt |   2 +
 .../implementation/src/L1/SuperchainConfig.sol     |  94 ++++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 .../contracts/proxy/utils/Initializable.sol        | 138 +++++
 .../contracts/utils/Address.sol                    | 222 ++++++++
 .../contracts/utils/math/Math.sol                  | 226 +++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 ++++++++++++++
 .../ethereum/.code/SuperchainConfig/proxy/meta.txt |   2 +
 .../proxy/src}/L1/ResourceMetering.sol             | 116 ++---
 .../proxy/src/libraries/Arithmetic.sol             |  28 +
 .../SuperchainConfig/proxy/src/libraries/Burn.sol  |  32 ++
 .../proxy/src/libraries/Constants.sol              |  46 ++
 .../SuperchainConfig/proxy/src/universal/Proxy.sol | 168 ++++++
 .../contracts/L1/SystemConfig.sol => /dev/null     | 297 -----------
 .../libraries/Arithmetic.sol => /dev/null          |  48 --
 .../contracts/libraries/Burn.sol => /dev/null      |  42 --
 .../contracts/universal/Semver.sol => /dev/null    |  58 ---
 .../contracts/proxy/utils/Initializable.sol        | 138 +++++
 .../contracts/utils/Address.sol                    | 222 ++++++++
 .../contracts/utils/math/Math.sol                  | 226 +++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts}/access/OwnableUpgradeable.sol       |   0
 .../contracts}/proxy/utils/Initializable.sol       |   0
 .../contracts}/utils/AddressUpgradeable.sol        |   0
 .../contracts}/utils/ContextUpgradeable.sol        |   0
 .../lib/solmate/src/utils/FixedPointMathLib.sol    | 366 ++++++++++++++
 .../SystemConfig/implementation/meta.txt           |   2 +-
 .../contracts/utils/Strings.sol => /dev/null       |  75 ---
 .../implementation/src/L1/ResourceMetering.sol     | 162 ++++++
 .../implementation/src/L1/SystemConfig.sol         | 255 ++++++++++
 .../implementation/src/libraries/Arithmetic.sol    |  28 +
 .../implementation/src/libraries/Burn.sol          |  32 ++
 .../implementation/src/libraries/Constants.sol     |  46 ++
 .../implementation/src/libraries/Storage.sol       |  88 ++++
 .../implementation/src/universal/ISemver.sol       |  13 +
 199 files changed, 11029 insertions(+), 9871 deletions(-)
```

Generated with discovered.json: 0x7e4c9076131acf85de578916eb5cfca1e750a721

# Diff at Mon, 12 Feb 2024 08:28:31 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ddc21751860f919d2bc4b19eb9fd41d3f26acdf2 block: 19176787
- current block number: 19210753

## Description

The Security Council is introduced, but with a 4/13 threshold. Now the multisig owning the ProxyAdmin is a 2/2 with the Foundation multisig and the Security Council multisig.

## Watched changes

```diff
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
      values.owner:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
+   Status: CREATED
    contract ProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    }
```

```diff
+   Status: CREATED
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    }
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    }
```

## Source code changes

```diff
.../implementation/GnosisSafe.sol                  | 422 +++++++++++++++++++++
 .../implementation/base/Executor.sol               |  27 ++
 .../implementation/base/FallbackManager.sol        |  53 +++
 .../implementation/base/GuardManager.sol           |  50 +++
 .../implementation/base/ModuleManager.sol          | 133 +++++++
 .../implementation/base/OwnerManager.sol           | 149 ++++++++
 .../implementation/common/Enum.sol                 |   8 +
 .../implementation/common/EtherPaymentFallback.sol |  13 +
 .../implementation/common/SecuredTokenTransfer.sol |  35 ++
 .../implementation/common/SelfAuthorized.sol       |  16 +
 .../implementation/common/SignatureDecoder.sol     |  36 ++
 .../implementation/common/Singleton.sol            |  11 +
 .../implementation/common/StorageAccessible.sol    |  47 +++
 .../implementation/external/GnosisSafeMath.sol     |  54 +++
 .../interfaces/ISignatureValidator.sol             |  20 +
 .../FoundationMultisig_1/implementation/meta.txt   |   2 +
 .../FoundationMultisig_1/proxy/GnosisSafeProxy.sol | 155 ++++++++
 .../.code/FoundationMultisig_1/proxy/meta.txt      |   2 +
 .../ProxyAdminOwner/implementation/GnosisSafe.sol  | 422 +++++++++++++++++++++
 .../implementation/base/Executor.sol               |  27 ++
 .../implementation/base/FallbackManager.sol        |  53 +++
 .../implementation/base/GuardManager.sol           |  50 +++
 .../implementation/base/ModuleManager.sol          | 133 +++++++
 .../implementation/base/OwnerManager.sol           | 149 ++++++++
 .../ProxyAdminOwner/implementation/common/Enum.sol |   8 +
 .../implementation/common/EtherPaymentFallback.sol |  13 +
 .../implementation/common/SecuredTokenTransfer.sol |  35 ++
 .../implementation/common/SelfAuthorized.sol       |  16 +
 .../implementation/common/SignatureDecoder.sol     |  36 ++
 .../implementation/common/Singleton.sol            |  11 +
 .../implementation/common/StorageAccessible.sol    |  47 +++
 .../implementation/external/GnosisSafeMath.sol     |  54 +++
 .../interfaces/ISignatureValidator.sol             |  20 +
 .../.code/ProxyAdminOwner/implementation/meta.txt  |   2 +
 .../ProxyAdminOwner/proxy/GnosisSafeProxy.sol      | 155 ++++++++
 .../ethereum/.code/ProxyAdminOwner/proxy/meta.txt  |   2 +
 .../implementation/GnosisSafe.sol                  | 422 +++++++++++++++++++++
 .../implementation/base/Executor.sol               |  27 ++
 .../implementation/base/FallbackManager.sol        |  53 +++
 .../implementation/base/GuardManager.sol           |  50 +++
 .../implementation/base/ModuleManager.sol          | 133 +++++++
 .../implementation/base/OwnerManager.sol           | 149 ++++++++
 .../implementation/common/Enum.sol                 |   8 +
 .../implementation/common/EtherPaymentFallback.sol |  13 +
 .../implementation/common/SecuredTokenTransfer.sol |  35 ++
 .../implementation/common/SelfAuthorized.sol       |  16 +
 .../implementation/common/SignatureDecoder.sol     |  36 ++
 .../implementation/common/Singleton.sol            |  11 +
 .../implementation/common/StorageAccessible.sol    |  47 +++
 .../implementation/external/GnosisSafeMath.sol     |  54 +++
 .../interfaces/ISignatureValidator.sol             |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 155 ++++++++
 .../.code/SecurityCouncilMultisig/proxy/meta.txt   |   2 +
 54 files changed, 3699 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176787 (main branch discovery), not current.

```diff
    contract OptimismMultisig (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
      name:
-        "OptimismMultisig"
+        "FoundationMultisig_2"
    }
```

Generated with discovered.json: 0x75bf0a1e7f3ca34a61085103177321849b59f9c2

# Diff at Wed, 07 Feb 2024 14:04:10 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175199
- current block number: 19176787

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175199 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
      values.sequencerInbox:
+        "0xFF00000000000000000000000000000000000010"
    }
```

Generated with discovered.json: 0x76f079bbf5d43c3c9139458655bfbd274ddbfa2a

# Diff at Wed, 07 Feb 2024 08:43:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19126648
- current block number: 19175199

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19126648 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
    }
```

Generated with discovered.json: 0x7bc6699d72e87e966f09a1f8d9b0661ffdb9ab81

# Diff at Wed, 31 Jan 2024 13:05:49 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 18975204
- current block number: 19126648

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18975204 (main branch discovery), not current.

```diff
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":false,"isSomeTxsLengthEqualToCelestiaDAExample":false}
    }
```

# Diff at Wed, 10 Jan 2024 07:58:12 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@e2e6b511762816f77296c91449de9dfcd2aa348b block: 18961956
- current block number: 18975204

## Description

Renamed contract to be consistent with template.

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18961956 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessengerProxy (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
      name:
-        "L1CrossDomainMessengerProxy"
+        "L1CrossDomainMessenger"
    }
```

# Diff at Mon, 08 Jan 2024 11:19:28 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: master@255faead9c908eabe1ba60518df6fac59f9743e0 block: 18927148
- current block number: 18961956

## Description

One owner is removed from SynthetixMultisig (now 5/11).

## Watched changes

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
      values.getOwners[11]:
-        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.10:
-        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
+        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.9:
-        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
+        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
      values.getOwners.8:
-        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
+        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
      values.getOwners.7:
-        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
+        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
      values.getOwners.6:
-        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
+        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
      values.getOwners.5:
-        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
+        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
      values.getOwners.4:
-        "0x6985b94Db148eDd4df6BD1Ba3F4640da79B44947"
+        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
      values.getOwners.0:
-        "0xd9b891AB93C210eafa46c61fAeb53836F99aa35B"
+        "0x26E10fF641839cA457695CE955Cb90657D6E3F53"
    }
```

# Diff at Wed, 03 Jan 2024 13:33:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@2a4dee9ce3e9f4d9aa3c1d39fafd6ff2ba608ba2

## Description

SynthetixMultisig has removed one owner. We are not showing it on the frontend. If it changes often, we can ignore it but for now I'll leave it as it is.

## Watched changes

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
      values.getOwners[12]:
-        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.11:
-        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
+        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.10:
-        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
+        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
      values.getOwners.9:
-        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
+        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
      values.getOwners.8:
-        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
+        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
      values.getOwners.7:
-        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
+        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
      values.getOwners.6:
-        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
+        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
      values.getOwners.5:
-        "0x6985b94Db148eDd4df6BD1Ba3F4640da79B44947"
+        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
      values.getOwners.4:
-        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
+        "0x6985b94Db148eDd4df6BD1Ba3F4640da79B44947"
      values.getOwners.3:
-        "0x8909F73188C4fE68B283fCB1E724b2466e0BdfD0"
+        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
      values.getOwners.2:
-        "0x0B67bab43157e53D21965Af0d83f83BeD9553E0a"
+        "0x8909F73188C4fE68B283fCB1E724b2466e0BdfD0"
      values.getOwners.1:
-        "0xd9b891AB93C210eafa46c61fAeb53836F99aa35B"
+        "0x0B67bab43157e53D21965Af0d83f83BeD9553E0a"
      values.getOwners.0:
-        "0x28Ed18Bd77A061E0A886a2a8FFb91da95FF03E56"
+        "0xd9b891AB93C210eafa46c61fAeb53836F99aa35B"
    }
```

# Diff at Tue, 26 Sep 2023 08:05:22 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0xdfe97868233d1aa22e815a266982f2cf17685a27) {
      values.deletedOutputs:
+        []
    }
```
