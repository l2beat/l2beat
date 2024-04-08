Generated with discovered.json: 0xc767a63020fb739f4a7ba1ee64ace83fd42f8a3a

# Diff at Mon, 08 Apr 2024 11:28:10 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c96c038f2bf3b6b17187b5a1f9d0ef0282942108 block: 19525405
- current block number: 19610652

## Description

Provide description of changes. This section will be preserved.

## Watched changes

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
 .../ProxyAdmin.sol                                 |    0
 .../meta.txt                                       |    0
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
 97 files changed, 12282 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19525405 (main branch discovery), not current.

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
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupsData:
+        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987","0x0775e11309d75aA6b0967917fB0213C5673eDf81"],["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"]]
      values.rollupTypes:
+        [["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]]
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8)
    +++ description: None
```

Generated with discovered.json: 0xba10c72cf7e833b13b991039623f6503c48425c3

# Diff at Wed, 27 Mar 2024 11:36:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 19525405

## Description

Provide description of changes. This section will be preserved.

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
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```
