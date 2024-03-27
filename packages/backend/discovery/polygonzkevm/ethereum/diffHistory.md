Generated with discovered.json: 0x137ac944000215a83e537284dbab5b0a94490bd8

# Diff at Wed, 27 Mar 2024 11:35:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e07213c85017436a1a224233fb8e2886f76f6cf9 block: 19510549
- current block number: 19525399

## Description

Added fetch of scheduled transactions.

## Watched changes

```diff
    contract PolygonZkEVMGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      values.depositCount:
-        5435
+        5750
      values.getLastGlobalExitRoot:
-        "0x4fdddcd1ff4e9c3c3e48db943e2ee7b6df0807312031605e4a26fbe4a6a9fbb9"
+        "0xb0405243863a60c26134bf7846c6bf8eca3de4bdecede092ababbad4c4ffa9ba"
      values.getRoot:
-        "0x9346ada04de5ed71863edc01cf4eb2d19f6119be2fcca877084719d9b00cc0a6"
+        "0x39921c54e99b178ddff2703a2bb6ac7a8141bc2bd7f9baed48125aca5d1db938"
      values.lastMainnetExitRoot:
-        "0xf4ca3309519f26af91ac5c56560a60b7d558e96404768bb1617dce3c06936cbb"
+        "0xe54366f5c01244de9a81ad5f6969113e7dff18a2754a7ba45a779d65f27b73dd"
      values.lastRollupExitRoot:
-        "0x1f4d64a326d436a2b58c5d7a783b824e1ec4f17f5b049b127736c38e20a076c5"
+        "0x89f166097c101bd9ae2df30bdeda9cd7fec6562cee06e3f8c20620be459e622c"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19510549 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract AstarValidiumAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AstarValidiumEtrog (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6)
    +++ description: None
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values._HALT_AGGREGATION_TIMEOUT:
-        604800
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"TRUSTED_AGGREGATOR":{"adminRole":"TRUSTED_AGGREGATOR_ADMIN","members":["0x6329Fe417621925C81c16F9F9a18c203C21Af7ab","0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"]},"ADD_ROLLUP_TYPE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"ADD_EXISTING_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"UPDATE_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"OBSOLETE_ROLLUP_TYPE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"CREATE_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"STOP_EMERGENCY":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"TWEAK_PARAMETERS":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"TRUSTED_AGGREGATOR_ADMIN":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"SET_FEE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"EMERGENCY_COUNCIL":{"adminRole":"EMERGENCY_COUNCIL_ADMIN","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]},"EMERGENCY_COUNCIL_ADMIN":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]}}
      values.emergencyStateCount:
-        1
      values.getRollupExitRoot:
-        "0x1f4d64a326d436a2b58c5d7a783b824e1ec4f17f5b049b127736c38e20a076c5"
      values.lastAggregationTimestamp:
-        1711357979
      values.nondeterministicPendingState:
-        []
      values.totalSequencedBatches:
-        24576
      values.totalVerifiedBatches:
-        24354
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      name:
-        "GlobalExitRootV2"
+        "PolygonZkEVMGlobalExitRootV2"
      values.getLastGlobalExitRoot:
+        "0x4fdddcd1ff4e9c3c3e48db943e2ee7b6df0807312031605e4a26fbe4a6a9fbb9"
      values.lastMainnetExitRoot:
+        "0xf4ca3309519f26af91ac5c56560a60b7d558e96404768bb1617dce3c06936cbb"
      values.lastRollupExitRoot:
+        "0x1f4d64a326d436a2b58c5d7a783b824e1ec4f17f5b049b127736c38e20a076c5"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0)
    +++ description: None
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      name:
-        "Timelock"
+        "PolygonZkEVMTimelock"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_ADMIN_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"PROPOSER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"EXECUTOR_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"CANCELLER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}}
      values.CANCELLER_ROLE:
+        "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783"
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.EXECUTOR_ROLE:
+        "0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63"
      values.PROPOSER_ROLE:
+        "0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1"
      values.TIMELOCK_ADMIN_ROLE:
+        "0x5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5"
    }
```

```diff
-   Status: DELETED
    contract AstarValidiumMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E)
    +++ description: None
```

Generated with discovered.json: 0x65c228f8ed1ab55cbd9a6e85bc1f2f348606c976

# Diff at Mon, 25 Mar 2024 09:16:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9bc44b13c53d42ef5e81d478df7a78975e8d4088 block: 19440911
- current block number: 19510549

## Description

A bug stalled the chain for 13 hours and the emergency state was activated in response. A new rollup type was added to update the Polygon zkEVM verifier. The emergency state was then deactivated. We are waiting for the post-mortem.

## Watched changes

```diff
-   Status: DELETED
    contract FflonkVerifier (0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be)
    +++ description: None
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.accessControl.UPDATE_ROLLUP.members.1:
+        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
+++ description: The emergency state has been activated, meaning that the upgrade delay is now zero.
+++ type: RISK_PARAMETER
+++ severity: HIGH
      values.emergencyStateCount:
-        0
+        1
      values.lastDeactivatedEmergencyStateTimestamp:
-        0
+        1711323791
+++ description: Mapping of a rollup type to rollup verifier. Different types may use the same verifier. First entry is a type, second a verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.1:
-        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: The number of unique rollup types that the manager can use.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupTypeCount:
-        2
+        3
      values.rollupTypes.2:
+        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
    }
```

```diff
+   Status: CREATED
    contract PolygonzkEVMVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.code@19440911/FflonkVerifier/meta.txt => /dev/null      | 2 --
 .../PolygonzkEVMVerifier}/contracts/verifiers/FflonkVerifier.sol      | 4 ++--
 .../polygonzkevm/ethereum/.code/PolygonzkEVMVerifier/meta.txt         | 2 ++
 3 files changed, 4 insertions(+), 4 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19440911 (main branch discovery), not current.

```diff
    contract PolygonzkEVMVerifier (0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be) {
    +++ description: None
      name:
-        "PolygonzkEVMVerifier"
+        "FflonkVerifier"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.nondeterminsiticPendingState:
-        []
+++ description: The emergency state has been activated, meaning that the upgrade delay is now zero.
+++ type: RISK_PARAMETER
+++ severity: HIGH
      values.emergencyStateCount:
+        0
      values.nondeterministicPendingState:
+        []
      values.rollupTypes:
+        [["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"]]
    }
```

Generated with discovered.json: 0x9b4d7769cda4996d3d0134957a58e639e4b6f2dc

# Diff at Fri, 15 Mar 2024 14:22:39 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@955bf46d3045f69b7cc7dac86edbb5dae6945bc4 block: 19433041
- current block number: 19440911

## Description

- Relatively small changes to `PolygonZkEVMExistentEtrog` which now is called `PolygonZkEVMEtrog`
- New FFlonkVerifier (`0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be`) for PolygonzkEVM. The previous FFlonkVerifier is still used by Astar Validium. Because of the change there are now two RollupTypes.

### PolygonZkEVMExistentEtrog

Contract name has changed to `PolygonZkEVMEtrog`. The method `seqenceBatches` now takes to additional parameters: `maxSequenceTimestamp` and `initSequencedBatch`. It is an additional safety measure, the `maxSequenceTimestamp` must be inside a safety range (actual + 36 seconds). This timestamp should be equal or higher of the last block inside the sequence, otherwise this batch will be invalidated by circuit.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Mapping of a rollup type to rollup verifier. Different types may use the same verifier. First entry is a type, second a verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.1:
-        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+        "0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"
+++ description: The number of unique rollup types that the manager can use.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupTypeCount:
-        1
+        2
    }
```

```diff
    contract PolygonZkEVMEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: None
      upgradeability.implementation:
-        "0x79BCB82B35A335cD8A8Ec433b304a0c91f67CDE0"
+        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      implementations.0:
-        "0x79BCB82B35A335cD8A8Ec433b304a0c91f67CDE0"
+        "0x2650a9a4fC64f63F573EF0F405064EF54BC46f71"
      values.SET_UP_ETROG_TX:
-        "0xdf2a8080944d5cf5032b2a844602278b01199ed191a86c93ff8080821092808000000000000000000000000000000000000000000000000000000005ca1ab1e000000000000000000000000000000000000000000000000000000005ca1ab1e01bff"
      values.TIMESTAMP_RANGE:
+        36
      derivedName:
-        "PolygonZkEVMExistentEtrog"
+        "PolygonZkEVMEtrog"
    }
```

```diff
+   Status: CREATED
    contract PolygonzkEVMVerifier (0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be)
    +++ description: None
```

## Source code changes

```diff
.../v2/consensus/zkEVM/PolygonZkEVMEtrog.sol       |   34 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   10 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |   36 +-
 .../PolygonZkEVMEtrog/implementation/meta.txt      |    4 +-
 .../contracts/verifiers/FflonkVerifier.sol         | 1244 ++++++++++++++++++++
 .../ethereum/.code/PolygonzkEVMVerifier/meta.txt   |    2 +
 6 files changed, 1324 insertions(+), 6 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19433041 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8) {
    +++ description: None
      name:
-        "FflonkVerifier"
+        "AstarVerifier"
    }
```

```diff
    contract PolygonZkEVMExistentEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    +++ description: None
      name:
-        "PolygonZkEVMExistentEtrog"
+        "PolygonZkEVMEtrog"
    }
```

Generated with discovered.json: 0xf5c29c1b6e921c17297af2fa6650362ebbbffcb5

# Diff at Thu, 14 Mar 2024 11:46:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@24c5721630392f8b6f59093376472db03d18b2c2 block: 19282832
- current block number: 19433041

## Description

Added a Validium - AstarZKEVM.
The validium is owned by AstarValidiumAdmin that itself is owned by AstarValidiumMultisig.

A trusted aggregator has been added that is an [EOA](https://etherscan.io/address/0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE).
On 2024-02-29 [willbutton.eth](https://etherscan.io/tx/0x760fd86f9453477e23df16def04777fb6282dda9f8546e93b2f7b866467b2e49) sent some eth to that address.
A day later it was given 5ETH by a [multisig](https://etherscan.io/address/0xc984295ad7a950fb5031154bcfc0b6267b948706) and 20ETH a week later by the same multisig.
The account has been calling `verifyBatchesTrustedAggregator()` starting from 2024-03-04 and does so around once an hour.
We don't have that multisig in any discovery.
The trusted aggregator can call `verifyBatchesTrustedAggregator()`, `overridePendingState()` as well as `consolidatePendingState()` skipping all timeout restrictions.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.accessControl.TRUSTED_AGGREGATOR.members.1:
+        "0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"
+++ description: The number of rollups that the manager can use.
+++ type: CODE_CHANGE
+++ severity: LOW
      values.rollupCount:
-        1
+        2
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.1:
+        ["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"]
+++ description: The number of unique rollup types that the manager can use.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupTypeCount:
-        0
+        1
    }
```

```diff
+   Status: CREATED
    contract AstarValidiumAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumEtrog (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E)
    +++ description: None
```

## Source code changes

```diff
.../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../ethereum/.code/AstarValidiumAdmin/meta.txt     |    2 +
 .../@openzeppelin/contracts/utils/Strings.sol      |   70 +
 .../contracts/utils/cryptography/ECDSA.sol         |  213 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  345 ++++
 .../access/OwnableUpgradeable.sol                  |   95 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../v2/consensus/validium/PolygonDataCommittee.sol |  197 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../v2/interfaces/IPolygonDataCommitteeErrors.sol  |   40 +
 .../.code/AstarValidiumDAC/implementation/meta.txt |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../ethereum/.code/AstarValidiumDAC/proxy/meta.txt |    2 +
 .../access/IAccessControlUpgradeable.sol           |   88 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../extensions/draft-IERC20PermitUpgradeable.sol   |   60 +
 .../token/ERC20/utils/SafeERC20Upgradeable.sol     |  116 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   70 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  345 ++++
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../@openzeppelin/contracts5/proxy/Proxy.sol       |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |   16 +
 .../contracts/interfaces/IPolygonZkEVMBridge.sol   |  118 ++
 .../contracts/interfaces/IPolygonZkEVMErrors.sol   |  211 +++
 .../contracts/interfaces/IVerifierRollup.sol       |   13 +
 .../contracts/lib/EmergencyManager.sol             |   73 +
 .../contracts/v2/PolygonRollupManager.sol          | 1911 ++++++++++++++++++++
 .../v2/consensus/validium/PolygonValidiumEtrog.sol |  279 +++
 .../consensus/zkEVM/PolygonZkEVMExistentEtrog.sol  |  134 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../contracts/v2/interfaces/IPolygonRollupBase.sol |   20 +
 .../v2/interfaces/IPolygonRollupManager.sol        |  170 ++
 .../contracts/v2/interfaces/IPolygonValidium.sol   |   15 +
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   46 +
 .../contracts/v2/lib/LegacyZKEVMStateVariables.sol |  153 ++
 .../v2/lib/PolygonAccessControlUpgradeable.sol     |  245 +++
 .../contracts/v2/lib/PolygonConstantsBase.sol      |   14 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  923 ++++++++++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../AstarValidiumEtrog/implementation/meta.txt     |    2 +
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../proxy/@openzeppelin/contracts5/proxy/Proxy.sol |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../.code/AstarValidiumEtrog/proxy/meta.txt        |    2 +
 .../implementation/contracts/GnosisSafe.sol        |  422 +++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 ++
 .../implementation/contracts/base/OwnerManager.sol |  149 ++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../AstarValidiumMultisig/implementation/meta.txt  |    2 +
 .../proxy/GnosisSafeProxy.sol                      |  155 ++
 .../.code/AstarValidiumMultisig/proxy/meta.txt     |    2 +
 .../implementation/contracts/GnosisSafe.sol        |  422 +++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 ++
 .../implementation/contracts/base/OwnerManager.sol |  149 ++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../.code/GnosisSafe/implementation/meta.txt       |    2 +
 .../.code/GnosisSafe/proxy/GnosisSafeProxy.sol     |  155 ++
 .../ethereum/.code/GnosisSafe/proxy/meta.txt       |    2 +
 134 files changed, 14055 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19282832 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.11:
-        0
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.10:
-        0
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.9:
-        1984749
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.8:
-        0
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.7:
-        0
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.6:
-        1991783
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.5:
-        1991800
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.4:
-        "0x8ad85f1e7b882d12cf6c64cf256cab8d255d6085e8109400741d82850a1d944b"
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.3:
-        7
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.2:
-        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+++ description: Addresses of the rollup backend as well as the rollup verifier.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.rollupsData.0.1:
-        1101
+        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
    }
```

Generated with discovered.json: 0xa044c3c3b7dd5811d191b9d7da48b7a243b45f1c

# Diff at Thu, 22 Feb 2024 11:24:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74fbd7f65d394338041f8804041b27ceceea98b1 block: 19263381
- current block number: 19282832

## Description

Added way to discover rollups added to the RollupManager. Currently we do not support ignoring nested values.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      values.rollupsData.0.6:
-        1990615
+        1991783
      values.rollupsData.0.5:
-        1990630
+        1991800
      values.rollupsData.0.4:
-        "0x6116cb825d6526a68480b15d3958bc28af06dc073278d491f6c1c14b435e6694"
+        "0x8ad85f1e7b882d12cf6c64cf256cab8d255d6085e8109400741d82850a1d944b"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19263381 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      values.rollupsData:
+        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987",1101,"0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8",7,"0x6116cb825d6526a68480b15d3958bc28af06dc073278d491f6c1c14b435e6694",1990630,1990615,0,0,1984749,0,0]]
    }
```

Generated with discovered.json: 0xea555dc810751b7357d2f5afb96482369ae5b864

# Diff at Wed, 14 Feb 2024 14:38:23 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@8aff82cf19c6cc452dee84fd82eb20a50a8a57e5 block: 19018668
- current block number: 19226841

## Description

It is now possible to attach many rollups to the same system. Polygon zkEVM is the first one of those. The rollup manager manages roots proposal and the single rollups manage tx data sequencing and forced transactions. Most of the params and roles are now shared. The rest is mostly similar.

## Watched changes

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
      upgradeability.implementation:
-        "0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"
+        "0x0FeB850B183C57534b56b7d56520133C8f9BDB65"
      implementations.0:
-        "0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"
+        "0x0FeB850B183C57534b56b7d56520133C8f9BDB65"
      values.polygonZkEVMaddress:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.BASE_INIT_BYTECODE_WRAPPED_TOKEN:
+        "0x6101006040523480156200001257600080fd5b5060405162001b6638038062001b6683398101604081905262000035916200028d565b82826003620000458382620003a1565b506004620000548282620003a1565b50503360c0525060ff811660e052466080819052620000739062000080565b60a052506200046d915050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f620000ad6200012e565b805160209182012060408051808201825260018152603160f81b90840152805192830193909352918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc66060820152608081018390523060a082015260c001604051602081830303815290604052805190602001209050919050565b6060600380546200013f9062000312565b80601f01602080910402602001604051908101604052809291908181526020018280546200016d9062000312565b8015620001be5780601f106200019257610100808354040283529160200191620001be565b820191906000526020600020905b815481529060010190602001808311620001a057829003601f168201915b5050505050905090565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620001f057600080fd5b81516001600160401b03808211156200020d576200020d620001c8565b604051601f8301601f19908116603f01168101908282118183101715620002385762000238620001c8565b816040528381526020925086838588010111156200025557600080fd5b600091505b838210156200027957858201830151818301840152908201906200025a565b600093810190920192909252949350505050565b600080600060608486031215620002a357600080fd5b83516001600160401b0380821115620002bb57600080fd5b620002c987838801620001de565b94506020860151915080821115620002e057600080fd5b50620002ef86828701620001de565b925050604084015160ff811681146200030757600080fd5b809150509250925092565b600181811c908216806200032757607f821691505b6020821081036200034857634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200039c57600081815260208120601f850160051c81016020861015620003775750805b601f850160051c820191505b81811015620003985782815560010162000383565b5050505b505050565b81516001600160401b03811115620003bd57620003bd620001c8565b620003d581620003ce845462000312565b846200034e565b602080601f8311600181146200040d5760008415620003f45750858301515b600019600386901b1c1916600185901b17855562000398565b600085815260208120601f198616915b828110156200043e578886015182559484019460019091019084016200041d565b50858210156200045d5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60805160a05160c05160e0516116aa620004bc6000396000610237015260008181610307015281816105c001526106a70152600061053a015260008181610379015261050401526116aa6000f3fe608060405234801561001057600080fd5b50600436106101775760003560e01c806370a08231116100d8578063a457c2d71161008c578063d505accf11610066578063d505accf1461039b578063dd62ed3e146103ae578063ffa1ad74146103f457600080fd5b8063a457c2d71461034e578063a9059cbb14610361578063cd0d00961461037457600080fd5b806395d89b41116100bd57806395d89b41146102e75780639dc29fac146102ef578063a3c573eb1461030257600080fd5b806370a08231146102915780637ecebe00146102c757600080fd5b806330adf81f1161012f5780633644e515116101145780633644e51514610261578063395093511461026957806340c10f191461027c57600080fd5b806330adf81f14610209578063313ce5671461023057600080fd5b806318160ddd1161016057806318160ddd146101bd57806320606b70146101cf57806323b872dd146101f657600080fd5b806306fdde031461017c578063095ea7b31461019a575b600080fd5b610184610430565b60405161019191906113e4565b60405180910390f35b6101ad6101a8366004611479565b6104c2565b6040519015158152602001610191565b6002545b604051908152602001610191565b6101c17f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b6101ad6102043660046114a3565b6104dc565b6101c17f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b60405160ff7f0000000000000000000000000000000000000000000000000000000000000000168152602001610191565b6101c1610500565b6101ad610277366004611479565b61055c565b61028f61028a366004611479565b6105a8565b005b6101c161029f3660046114df565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b6101c16102d53660046114df565b60056020526000908152604090205481565b610184610680565b61028f6102fd366004611479565b61068f565b6103297f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610191565b6101ad61035c366004611479565b61075e565b6101ad61036f366004611479565b61082f565b6101c17f000000000000000000000000000000000000000000000000000000000000000081565b61028f6103a9366004611501565b61083d565b6101c16103bc366004611574565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b6101846040518060400160405280600181526020017f310000000000000000000000000000000000000000000000000000000000000081525081565b60606003805461043f906115a7565b80601f016020809104026020016040519081016040528092919081815260200182805461046b906115a7565b80156104b85780601f1061048d576101008083540402835291602001916104b8565b820191906000526020600020905b81548152906001019060200180831161049b57829003601f168201915b5050505050905090565b6000336104d0818585610b73565b60019150505b92915050565b6000336104ea858285610d27565b6104f5858585610dfe565b506001949350505050565b60007f00000000000000000000000000000000000000000000000000000000000000004614610537576105324661106d565b905090565b507f000000000000000000000000000000000000000000000000000000000000000090565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff871684529091528120549091906104d090829086906105a3908790611629565b610b73565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614610672576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603060248201527f546f6b656e577261707065643a3a6f6e6c794272696467653a204e6f7420506f60448201527f6c79676f6e5a6b45564d4272696467650000000000000000000000000000000060648201526084015b60405180910390fd5b61067c8282611135565b5050565b60606004805461043f906115a7565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614610754576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603060248201527f546f6b656e577261707065643a3a6f6e6c794272696467653a204e6f7420506f60448201527f6c79676f6e5a6b45564d427269646765000000000000000000000000000000006064820152608401610669565b61067c8282611228565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490919083811015610822576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f0000000000000000000000000000000000000000000000000000006064820152608401610669565b6104f58286868403610b73565b6000336104d0818585610dfe565b834211156108cc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f546f6b656e577261707065643a3a7065726d69743a204578706972656420706560448201527f726d6974000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff8716600090815260056020526040812080547f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9918a918a918a9190866109268361163c565b9091555060408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810186905260e0016040516020818303038152906040528051906020012090506000610991610500565b6040517f19010000000000000000000000000000000000000000000000000000000000006020820152602281019190915260428101839052606201604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181528282528051602091820120600080855291840180845281905260ff89169284019290925260608301879052608083018690529092509060019060a0016020604051602081039080840390855afa158015610a55573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff811615801590610ad057508973ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b610b5c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f546f6b656e577261707065643a3a7065726d69743a20496e76616c696420736960448201527f676e6174757265000000000000000000000000000000000000000000000000006064820152608401610669565b610b678a8a8a610b73565b50505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff8316610c15576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff8216610cb8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f73730000000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8381166000908152600160209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610df85781811015610deb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610669565b610df88484848403610b73565b50505050565b73ffffffffffffffffffffffffffffffffffffffff8316610ea1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff8216610f44576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff831660009081526020819052604090205481811015610ffa576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610df8565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f611098610430565b8051602091820120604080518082018252600181527f310000000000000000000000000000000000000000000000000000000000000090840152805192830193909352918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc66060820152608081018390523060a082015260c001604051602081830303815290604052805190602001209050919050565b73ffffffffffffffffffffffffffffffffffffffff82166111b2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610669565b80600260008282546111c49190611629565b909155505073ffffffffffffffffffffffffffffffffffffffff8216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b73ffffffffffffffffffffffffffffffffffffffff82166112cb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f73000000000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604090205481811015611381576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f63650000000000000000000000000000000000000000000000000000000000006064820152608401610669565b73ffffffffffffffffffffffffffffffffffffffff83166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9101610d1a565b600060208083528351808285015260005b81811015611411578581018301518582016040015282016113f5565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8301168501019250505092915050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461147457600080fd5b919050565b6000806040838503121561148c57600080fd5b61149583611450565b946020939093013593505050565b6000806000606084860312156114b857600080fd5b6114c184611450565b92506114cf60208501611450565b9150604084013590509250925092565b6000602082840312156114f157600080fd5b6114fa82611450565b9392505050565b600080600080600080600060e0888a03121561151c57600080fd5b61152588611450565b965061153360208901611450565b95506040880135945060608801359350608088013560ff8116811461155757600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561158757600080fd5b61159083611450565b915061159e60208401611450565b90509250929050565b600181811c908216806115bb57607f821691505b6020821081036115f4577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b808201808211156104d6576104d66115fa565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361166d5761166d6115fa565b506001019056fea26469706673582212208d88fee561cff7120d381c345cfc534cef8229a272dc5809d4bbb685ad67141164736f6c63430008110033"
      values.gasTokenAddress:
+        "0x0000000000000000000000000000000000000000"
      values.gasTokenMetadata:
+        "0x"
      values.gasTokenNetwork:
+        0
      values.getRoot:
+        "0x281e6a3f11f523b6416b8e7e44c9fa4311a1984fa16f16e6789d2a96a9b8a89a"
      values.polygonRollupManager:
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.WETHToken:
+        "0x0000000000000000000000000000000000000000"
      derivedName:
-        "PolygonZkEVMBridge"
+        "PolygonZkEVMBridgeV2"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      upgradeability.implementation:
-        "0xb1585916487AcEdD99952086f2950763D253b923"
+        "0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
      implementations.0:
-        "0xb1585916487AcEdD99952086f2950763D253b923"
+        "0x3b82Da772c825283d85d5d6717A77C6Ff582053b"
      values.accessControl.DEFAULT_ADMIN_ROLE.members[0]:
+        "0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"
      values.accessControl.TRUSTED_AGGREGATOR:
+        {"adminRole":"TRUSTED_AGGREGATOR_ADMIN","members":["0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"]}
      values.accessControl.ADD_ROLLUP_TYPE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]}
      values.accessControl.ADD_EXISTING_ROLLUP:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]}
      values.accessControl.UPDATE_ROLLUP:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]}
      values.accessControl.OBSOLETE_ROLLUP_TYPE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.CREATE_ROLLUP:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.STOP_EMERGENCY:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.TWEAK_PARAMETERS:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.TRUSTED_AGGREGATOR_ADMIN:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.SET_FEE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}
      values.accessControl.EMERGENCY_COUNCIL:
+        {"adminRole":"EMERGENCY_COUNCIL_ADMIN","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]}
      values.accessControl.EMERGENCY_COUNCIL_ADMIN:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]}
      values.admin:
-        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.chainID:
-        1101
      values.forceBatchTimeout:
-        432000
      values.forkID:
-        6
      values.isForcedBatchDisallowed:
-        true
      values.lastVerifiedBatchBeforeUpgrade:
-        1228916
      values.matic:
-        "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
      values.networkName:
-        "polygon zkEVM"
      values.owner:
-        "0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
      values.rollupVerifier:
-        "0x5F411584E02964a028E3123C833c352Cd2F5cBD5"
      values.trustedAggregator:
-        "0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
      values.trustedSequencer:
-        "0x148Ee7dAF16574cD020aFa34CC658f8F3fbd2800"
      values.trustedSequencerURL:
-        "https://zkevm-rpc.com/"
      values.version:
-        2
      values.VERSION_BEFORE_UPGRADE:
-        1
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.getBatchFee:
+        "100000000000000000"
      values.getRollupExitRoot:
+        "0xdbf6a41b961855c5c76e0fa2264fb104706925d2b73f6f5261ded3ff6cb1798f"
      values.lastAggregationTimestamp:
+        1707920735
      values.lastDeactivatedEmergencyStateTimestamp:
+        0
      values.pol:
+        "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"
      values.rollupCount:
+        1
      values.rollupTypeCount:
+        0
      values.totalSequencedBatches:
+        634
      values.totalVerifiedBatches:
+        626
      derivedName:
-        "PolygonZkEVMUpgraded"
+        "PolygonRollupManager"
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
      upgradeability.implementation:
-        "0xbc1ea504fC54D078514eFCCA1F6860B5219B6BC3"
+        "0x2E38cD55163137483E30580Cb468C2dFf1d85077"
      implementations.0:
-        "0xbc1ea504fC54D078514eFCCA1F6860B5219B6BC3"
+        "0x2E38cD55163137483E30580Cb468C2dFf1d85077"
      values.rollupAddress:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      values.depositCount:
+        110
      values.getRoot:
+        "0x7fea3b9f69d928287af3d1cf3a0055d04de717fa31f977467bf2718c8798a40c"
      values.rollupManager:
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      derivedName:
-        "PolygonZkEVMGlobalExitRoot"
+        "PolygonZkEVMGlobalExitRootV2"
    }
```

```diff
-   Status: DELETED
    contract FflonkVerifier (0x5F411584E02964a028E3123C833c352Cd2F5cBD5) {
    }
```

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3) {
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8) {
    }
```

```diff
+   Status: CREATED
    contract PolygonEcosystemToken (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6) {
    }
```

```diff
+   Status: CREATED
    contract PolygonZkEVMExistentEtrog (0x519E42c24163192Dca44CD3fBDCEBF6be9130987) {
    }
```

## Source code changes

```diff
.../contracts/PolygonZkEVMBridge.sol => /dev/null  |  857 ---------
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |    2 +-
 .../interfaces/IBridgeMessageReceiver.sol          |    2 +-
 .../contracts/lib/EmergencyManager.sol             |    2 +-
 .../contracts/lib/GlobalExitRootLib.sol            |    2 +-
 .../implementation/contracts/lib/TokenWrapped.sol  |    2 +-
 .../contracts/v2/PolygonZkEVMBridgeV2.sol          | 1160 ++++++++++++
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../contracts/v2/lib/DepositContractBase.sol}      |   65 +-
 .../contracts/v2/lib/DepositContractV2.sol         |   44 +
 .../Bridge/implementation/meta.txt                 |    4 +-
 .../FflonkVerifier/FflonkVerifier.sol              |    4 +-
 .../FflonkVerifier/meta.txt                        |    2 +-
 .../PolygonZkEVMGlobalExitRoot.sol => /dev/null    |   88 -
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |    2 +-
 .../IPolygonZkEVMGlobalExitRoot.sol => /dev/null   |    8 -
 .../implementation/lib/GlobalExitRootLib.sol       |    2 +-
 .../GlobalExitRootV2/implementation/meta.txt       |    4 +-
 .../v2/PolygonZkEVMGlobalExitRootV2.sol            |  126 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../implementation/v2/lib/DepositContractBase.sol  |  131 ++
 .../lib/PolygonZkEVMGlobalExitRootBaseStorage.sol  |   22 +
 .../.code/Permit2/lib/solmate/src/tokens/ERC20.sol |  206 +++
 .../lib/solmate/src/utils/SafeTransferLib.sol      |  128 ++
 .../polygonzkevm/ethereum/.code/Permit2/meta.txt   |    2 +
 .../.code/Permit2/src/AllowanceTransfer.sol        |  143 ++
 .../ethereum/.code/Permit2/src/EIP712.sol          |   39 +
 .../ethereum/.code/Permit2/src/Permit2.sol         |   11 +
 .../ethereum/.code/Permit2/src/PermitErrors.sol    |   11 +
 .../.code/Permit2/src/SignatureTransfer.sol        |  159 ++
 .../Permit2/src/interfaces/IAllowanceTransfer.sol  |  160 ++
 .../.code/Permit2/src/interfaces/IERC1271.sol      |   10 +
 .../Permit2/src/interfaces/ISignatureTransfer.sol  |  132 ++
 .../.code/Permit2/src/libraries/Allowance.sol      |   48 +
 .../.code/Permit2/src/libraries/PermitHash.sol     |  134 ++
 .../src/libraries/SignatureVerification.sol        |   47 +
 .../contracts/access/AccessControl.sol             |  248 +++
 .../contracts/access/AccessControlEnumerable.sol   |   64 +
 .../contracts/access/IAccessControl.sol            |   88 +
 .../contracts/access/IAccessControlEnumerable.sol  |   31 +
 .../contracts/interfaces/IERC5267.sol              |   28 +
 .../contracts/token/ERC20/ERC20.sol                |  365 ++++
 .../contracts/token/ERC20/IERC20.sol               |   78 +
 .../token/ERC20/extensions/ERC20Permit.sol         |   95 +
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/IERC20Permit.sol        |   60 +
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/Counters.sol                   |   43 +
 .../contracts/utils/ShortStrings.sol               |  122 ++
 .../contracts/utils/StorageSlot.sol                |  138 ++
 .../contracts/utils/Strings.sol                    |   85 +
 .../contracts/utils/cryptography/ECDSA.sol         |  217 +++
 .../contracts/utils/cryptography/EIP712.sol        |  142 ++
 .../contracts/utils/introspection/ERC165.sol       |   29 +
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../contracts/utils/math/Math.sol                  |  339 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/utils/structs/EnumerableSet.sol      |  378 ++++
 .../ethereum/.code/PolygonEcosystemToken/meta.txt  |    2 +
 .../src/PolygonEcosystemToken.sol                  |   81 +
 .../src/interfaces/IPolygonEcosystemToken.sol      |   71 +
 .../access/IAccessControlUpgradeable.sol           |   88 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../utils/StringsUpgradeable.sol                   |   70 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  345 ++++
 .../@openzeppelin/contracts5/access/Ownable.sol}   |   55 +-
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../@openzeppelin/contracts5/proxy/Proxy.sol       |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../contracts/PolygonZkEVM.sol => /dev/null        | 1692 -----------------
 .../IPolygonZkEVMGlobalExitRoot.sol => /dev/null   |    8 -
 .../contracts/interfaces/IVerifierRollup.sol       |    2 +-
 .../PolygonZkEVMUpgraded.sol => /dev/null          |  136 --
 .../contracts/v2/PolygonRollupManager.sol          | 1911 ++++++++++++++++++++
 .../consensus/zkEVM/PolygonZkEVMExistentEtrog.sol  |  134 ++
 .../contracts/v2/interfaces/IPolygonRollupBase.sol |   20 +
 .../v2/interfaces/IPolygonRollupManager.sol        |  170 ++
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   46 +
 .../contracts/v2/lib/LegacyZKEVMStateVariables.sol |  153 ++
 .../v2/lib/PolygonAccessControlUpgradeable.sol     |  245 +++
 .../contracts/v2/lib/PolygonConstantsBase.sol      |   14 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  923 ++++++++++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../PolygonRollupManager/implementation/meta.txt   |    4 +-
 .../access/IAccessControlUpgradeable.sol           |   88 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../extensions/draft-IERC20PermitUpgradeable.sol   |   60 +
 .../token/ERC20/utils/SafeERC20Upgradeable.sol     |  116 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   70 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  345 ++++
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../@openzeppelin/contracts5/proxy/Proxy.sol       |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |   16 +
 .../contracts/interfaces/IPolygonZkEVMBridge.sol   |    2 +-
 .../contracts/interfaces/IPolygonZkEVMErrors.sol   |  211 +++
 .../contracts/interfaces/IVerifierRollup.sol       |   13 +
 .../contracts/lib/EmergencyManager.sol             |   73 +
 .../contracts/v2/PolygonRollupManager.sol          | 1911 ++++++++++++++++++++
 .../consensus/zkEVM/PolygonZkEVMExistentEtrog.sol  |  134 ++
 .../contracts/v2/interfaces/IPolygonRollupBase.sol |   20 +
 .../v2/interfaces/IPolygonRollupManager.sol        |  170 ++
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   46 +
 .../contracts/v2/lib/LegacyZKEVMStateVariables.sol |  153 ++
 .../v2/lib/PolygonAccessControlUpgradeable.sol     |  245 +++
 .../contracts/v2/lib/PolygonConstantsBase.sol      |   14 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  923 ++++++++++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../implementation/meta.txt                        |    2 +
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../proxy/@openzeppelin/contracts5/proxy/Proxy.sol |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../.code/PolygonZkEVMExistentEtrog/proxy/meta.txt |    2 +
 149 files changed, 18459 insertions(+), 2875 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19018668 (main branch discovery), not current.

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      name:
-        "PolygonZkEvm"
+        "PolygonRollupManager"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
    }
```

```diff
    contract GlobalExitRoot (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
      name:
-        "GlobalExitRoot"
+        "GlobalExitRootV2"
    }
```

Generated with discovered.json: 0x8241e5999c5993c8094f03fe673e1a35f2b5b13f

# Diff at Thu, 11 Jan 2024 15:48:40 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@d79128df189c297a74fb89b3a58b7e0d6edd88f4 block: 18968776
- current block number: 18984674

## Description

The EscrowsAdmin multisig threshold is updated - now 5/10. Nonce is ignored.

## Watched changes

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
      values.getThreshold:
-        1
+        5
    }
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18968776 (main branch discovery), not current.

```diff
    contract EscrowsAdmin (0xf694C9e3a34f5Fa48b6f3a0Ff186C1c6c4FcE904) {
      values.nonce:
-        0
    }
```

# Diff at Fri, 10 Nov 2023 10:41:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8c81bbc286f1a0d260de84887d123cd5eda48a86

## Description

PolygonZkEVM has changed it's implementation because PolygonZkEVMUpgraded - the
contract at the implementation address - needed to be redeployed. This is
because PolygonZkEVMUpgraded has FflonkVerifier hardcoded and because it was
also redeployed to change two circuit parameters (C_0x and C0y) to update to the
new address the whole contract needed to be redeployed. We can't peer into the
actual change that took place because it's around the zk circuit.

## Watched changes

```diff
-   Status: DELETED
    contract FflonkVerifier (0x21f65deadb3b85082BA99766f323bEA90eb5a3D6) {
    }
```

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      upgradeability.implementation:
-        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
+        "0xb1585916487AcEdD99952086f2950763D253b923"
      implementations.0:
-        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
+        "0xb1585916487AcEdD99952086f2950763D253b923"
      values.forkID:
-        5
+        6
      values.lastVerifiedBatchBeforeUpgrade:
-        813266
+        1228916
      values.rollupVerifier:
-        "0x21f65deadb3b85082BA99766f323bEA90eb5a3D6"
+        "0x5F411584E02964a028E3123C833c352Cd2F5cBD5"
      values.version:
-        1
+        2
      values.VERSION_BEFORE_UPGRADE:
-        0
+        1
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x5F411584E02964a028E3123C833c352Cd2F5cBD5) {
    }
```

## Source code changes

```diff
.../{.code@18263277 => .code}/FflonkVerifier/FflonkVerifier.sol       | 4 ++--
 .../ethereum/{.code@18263277 => .code}/FflonkVerifier/meta.txt        | 2 +-
 .../{.code@18263277 => .code}/PolygonZkEvm/implementation/meta.txt    | 2 +-
 3 files changed, 4 insertions(+), 4 deletions(-)
```

# Diff at Mon, 02 Oct 2023 13:55:19 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      values.trustedAggregator:
-        "0xdA87c4a76922598Ac0272F4D9503a35071D686eA"
+        "0x6329Fe417621925C81c16F9F9a18c203C21Af7ab"
    }
```

# Diff at Tue, 26 Sep 2023 13:22:27 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract FflonkVerifier (0x21f65deadb3b85082BA99766f323bEA90eb5a3D6) {
      sinceTimestamp:
+        1693469075
    }
```

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      values.nondeterminsiticPendingState:
+        []
    }
```

# Diff at Fri, 22 Sep 2023 11:25:03 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@1312187d41931ca505cc65eca063068109ff1771

## Watched changes

```diff
-   Status: DELETED
    contract FflonkVerifier (0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9) {
    }
```

```diff
    contract PolygonZkEvm (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
      upgradeability.implementation:
-        "0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"
+        "0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"
      values.forkID:
-        4
+        5
      values.rollupVerifier:
-        "0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9"
+        "0x21f65deadb3b85082BA99766f323bEA90eb5a3D6"
      values.lastVerifiedBatchBeforeUpgrade:
+        813266
      values.version:
+        1
      values.VERSION_BEFORE_UPGRADE:
+        0
      derivedName:
-        "PolygonZkEVM"
+        "PolygonZkEVMUpgraded"
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x21f65deadb3b85082BA99766f323bEA90eb5a3D6) {
    }
```
