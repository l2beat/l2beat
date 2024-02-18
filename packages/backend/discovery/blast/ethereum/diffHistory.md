Generated with discovered.json: 0xd3ba79cfc2cc395aa3d3a8c51165c0d647ae5c94

# Diff at Sun, 18 Feb 2024 10:46:13 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@195e600e3ab1fecf5a0abc790deb9649361140a3 block: 18771421
- current block number: 19254184

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
      values.proposedUpgrade.1:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x195ff6fae1f3fcceb00116c9f65f6cdd9a1ef6665f8d468acc446b32f20114c4"
      values.proposedUpgrade.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x0bD88b59D580549285f0A207Db5F06bf24a8e561"
      values.proposedUpgradeReadyAt:
-        0
+        1708303151
    }
```

```diff
+   Status: CREATED
    contract LaunchBridge (0x0bD88b59D580549285f0A207Db5F06bf24a8e561) {
    }
```

## Source code changes

```diff
.../contracts/interfaces/IERC20.sol                |   6 +
 .../contracts/token/ERC20/IERC20.sol               |  82 +++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 ++
 .../contracts/access/Ownable2StepUpgradeable.sol   |  71 ++
 .../contracts/access/OwnableUpgradeable.sol        |  95 +++
 .../contracts/interfaces/IERC1967Upgradeable.sol   |  26 +
 .../interfaces/draft-IERC1822Upgradeable.sol       |  20 +
 .../proxy/ERC1967/ERC1967UpgradeUpgradeable.sol    | 170 +++++
 .../contracts/proxy/beacon/IBeaconUpgradeable.sol  |  16 +
 .../contracts/proxy/utils/Initializable.sol        | 166 +++++
 .../contracts/proxy/utils/UUPSUpgradeable.sol      | 112 +++
 .../contracts/security/PausableUpgradeable.sol     | 117 +++
 .../contracts/utils/AddressUpgradeable.sol         | 244 +++++++
 .../contracts/utils/ContextUpgradeable.sol         |  37 +
 .../contracts/utils/StorageSlotUpgradeable.sol     | 138 ++++
 .../blast/ethereum/.code/LaunchBridge/meta.txt     |   2 +
 .../.code/LaunchBridge/src/LaunchBridge_v3.sol     | 795 +++++++++++++++++++++
 .../LaunchBridge/src/libraries/Predeploys.sol      |  95 +++
 18 files changed, 2252 insertions(+)
```

Generated with discovered.json: 0xe9cebe22717eca176ca67be9ef1b813fd5ffaa20

# Diff at Tue, 12 Dec 2023 16:53:48 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@695bd005662e55af5dd20ff984779cea92a8a968

## Description

Change in the Bridge implementation. A 24h timelock is introduced on Admin Proxy updates and Bridge Transition updates. The update proposals can be created by the owner and canceled by the owner if not executed yet. Updates that do not go through the timelock will now revert.

Users can now withdraw in two cases:

- While there is an active proposal for upgrade/transition. In that case users will lose their points.
- After the contract has expired (currently set to 1 June 2024)

Other changes: The \_moveETH and \_moveUSD functions are refactored to return the assets value (previously executing the transfer), the actual transfer to the new bridge is now done within the transition function.

## Watched changes

```diff
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
      upgradeability.implementation:
-        "0xa01Def05A37850b2e13C8c839AA268845Df14276"
+        "0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"
      implementations.0:
-        "0xa01Def05A37850b2e13C8c839AA268845Df14276"
+        "0x829e8Bf84569A0B2da7B27f975F026fDb6e0a774"
      values.proposedBridgeReadyAt:
+        0
      values.proposedMainnetBridge:
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
      values.proposedUpgrade:
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]
      values.proposedUpgradeReadyAt:
+        0
    }
```

## Source code changes

```diff
.../Bridge/implementation/meta.txt                 |   2 +-
 .../src/launch-bridge}/LaunchBridge.sol            | 178 ++++++++++++++++++---
 2 files changed, 161 insertions(+), 19 deletions(-)
```

# Diff at Mon, 04 Dec 2023 15:05:33 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@982648829699454aa19300c012f060616045a3f0

## Description

Change in BridgeOwner (multisig) owners.

## Watched changes

```diff
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
      values.getOwners.0:
-        "0x59cDa1e234505D460c972e58452c0A6d8e14a5Ce"
+        "0x49d495DE356259458120bfd7bCB463CFb6D6c6BA"
    }
```

# Diff at Tue, 21 Nov 2023 08:08:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
+   Status: CREATED
    contract Bridge (0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d) {
    }
```

```diff
+   Status: CREATED
    contract BridgeOwner (0x67CA7Ca75b69711cfd48B44eC3F64E469BaF608C) {
    }
```
