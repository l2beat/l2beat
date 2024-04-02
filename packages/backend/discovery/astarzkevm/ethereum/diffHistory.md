Generated with discovered.json: 0x7256084bd40282d48d13d1d9f843a405770a177a

# Diff at Tue, 02 Apr 2024 11:19:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a9206f2bf2edf120bcda65c615e62ea076a00070 block: 19531427
- current block number: 19567776

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract POL (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6) {
    +++ description: None
      values.lastMint:
-        1710310247
+        1711986143
      values.totalSupply:
-        "10113921492245423640000000000"
+        "10129821158641559310000000000"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        2
+        3
      values.rollupsData.2:
+        ["0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
      values.rollupTypeCount:
-        3
+        4
      values.rollupTypes.3:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
    }
```

```diff
    contract PolygonZkEVMGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      values.depositCount:
-        5902
+        6983
      values.getLastGlobalExitRoot:
-        "0x9ca5a604c186e1ea5b4b1c98cef0172948cfdd3922e6d696432af039f2029ee4"
+        "0xc095e5994a0b9fd52ea40b40a773ef3501d71b6714aaa9f317da893d00a4a232"
      values.getRoot:
-        "0x8cc1015a052135594ecf5f93b9714a5fa9693df8723d30d54681edc0452ada70"
+        "0xfa45b3fc78774ebaab9c348497cd3179c1b985b3d5acd9f7943ef5249df28026"
      values.lastMainnetExitRoot:
-        "0xf497f247b8a83a6ef28ab1344cb4ceda601beadc8b8e750b9e94c60c692c90a6"
+        "0xb660abe75b32c4549f002831954229d9bca2088cbba3e11ed323d658d3405195"
      values.lastRollupExitRoot:
-        "0x3f422c6785e945568024d0ebffa974e7332ecb1abb878478ff7bb8d453408bf2"
+        "0xbe9fd8ca76197d4a5e1a89029ce2a23b17702c9c061ac9e1d5653d6de3cdd87e"
    }
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonValidiumStorageMigration (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

## Source code changes

```diff
.../.code/OKBImplementation/implementation/OKb.sol |  408 +++++
 .../OKBImplementation/implementation/SafeMath.sol  |   28 +
 .../OKBImplementation/implementation/meta.txt      |    2 +
 .../.code/OKBImplementation/proxy/Address.sol      |   23 +
 .../proxy/OwnedUpgradeabilityProxy.sol             |   86 +
 .../.code/OKBImplementation/proxy/Proxy.sol        |   34 +
 .../proxy/UpgradeabilityProxy.sol                  |   59 +
 .../.code/OKBImplementation/proxy/meta.txt         |    2 +
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
 .../PolygonDataCommittee/implementation/meta.txt   |    2 +
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
 .../.code/PolygonDataCommittee/proxy/meta.txt      |    2 +
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
 .../migration/PolygonRollupBaseEtrogNoGap.sol      |  945 ++++++++++
 .../migration/PolygonValidiumStorageMigration.sol  |  347 ++++
 .../consensus/zkEVM/PolygonZkEVMExistentEtrog.sol  |  134 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../contracts/v2/interfaces/IPolygonRollupBase.sol |   20 +
 .../v2/interfaces/IPolygonRollupManager.sol        |  170 ++
 .../contracts/v2/interfaces/IPolygonValidium.sol   |   15 +
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   56 +
 .../contracts/v2/lib/LegacyZKEVMStateVariables.sol |  153 ++
 .../v2/lib/PolygonAccessControlUpgradeable.sol     |  245 +++
 .../contracts/v2/lib/PolygonConstantsBase.sol      |   14 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  951 ++++++++++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../implementation/meta.txt                        |    2 +
 .../PolygonValidiumStorageMigration/proxy/meta.txt |    2 +
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
 .../meta.txt                                       |    2 +
 95 files changed, 12282 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531427 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21)
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
      values.calculateRewardPerBatch:
-        "100000000000000000"
      values.getForcedBatchFee:
-        "10000000000000000000"
      values.getRollupExitRoot:
-        "0x3f422c6785e945568024d0ebffa974e7332ecb1abb878478ff7bb8d453408bf2"
      values.lastAggregationTimestamp:
-        1711612079
      values.multiplierBatchFee:
-        1002
      values.totalSequencedBatches:
-        27755
      values.totalVerifiedBatches:
-        27727
      values.rollupsData:
+        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987","0x0775e11309d75aA6b0967917fB0213C5673eDf81"],["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"]]
      values.rollupTypes:
+        [["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      name:
-        "GlobalExitRootV2"
+        "PolygonZkEVMGlobalExitRootV2"
    }
```

```diff
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: None
      values.members:
+        [["http://cdk-validium-dac-5-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0x08EbBdFf8cB6d1336515A89641e899bc8ce91F2C"],["http://cdk-validium-dac-4-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0x37f0B74e0Fc72aDAAb1Fd39Ec6d779F596866aB8"],["http://cdk-validium-dac-3-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0x8FB3cb4777EE1c2C35C48aC69a650026d18aFF08"],["http://cdk-validium-dac-2-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0xCFb77B6abb27e04cE0DB347cCCd5544f51A98CBc"],["http://cdk-validium-dac-1-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0xF54b295a221B5d3510D03d9B16E23BA151da012A"]]
    }
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

Generated with discovered.json: 0x537893caa59f373cff2679fee537357a320870aa

# Diff at Thu, 28 Mar 2024 08:30:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19510528
- current block number: 19531427

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19510528 (main branch discovery), not current.

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      upgradeability.threshold:
+        "6 of 8 (75%)"
    }
```

```diff
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 3 (33%)"
    }
```

```diff
    contract AdminMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x80e34d2e9f076e502c2a5f413f27f449b1570d7a

# Diff at Mon, 25 Mar 2024 09:12:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9bc44b13c53d42ef5e81d478df7a78975e8d4088 block: 19482808
- current block number: 19510528

## Description

A bug on Polygon zkEVM was fixed, unrelated to Astar zkEVM.

## Watched changes

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      values.nonce:
-        19
+        27
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.accessControl.UPDATE_ROLLUP.members.1:
+        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.lastDeactivatedEmergencyStateTimestamp:
-        0
+        1711323791
      values.rollupTypeCount:
-        2
+        3
    }
```

Generated with discovered.json: 0x9d882fb2ce884a4add9de979baad67a6d2a8b618

# Diff at Thu, 21 Mar 2024 11:41:18 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19482808

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumEtrog (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract POL (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
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
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E)
    +++ description: None
```
