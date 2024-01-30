Generated with discovered.json: 0x9b43f3f8ad93357d8d4fc17bfc3e4610e8f1d755

# Diff at Fri, 26 Jan 2024 10:55:04 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 18833387
- current block number: 19090314

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18833387 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":false,"isSomeTxsLengthEqualToCelestiaDAExample":false}
    }
```

Generated with discovered.json: 0x54cf34180e6362e6e293f64a076bc1ff11895384

# Diff at Thu, 21 Dec 2023 09:37:29 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@c849b812aca217350f93ffb1795822cdf02a8dcb

## Description

Two new owners (EOAs) are added to GuardianMultisig (now 3/8).

## Watched changes

```diff
    contract GuardianMultisig (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
      values.getOwners[7]:
+        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
      values.getOwners[6]:
+        "0xBECAbd620cb6675f73C92bc444F7faCddf204DE2"
      values.getOwners.5:
-        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
+        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
      values.getOwners.4:
-        "0xBECAbd620cb6675f73C92bc444F7faCddf204DE2"
+        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
      values.getOwners.3:
-        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
+        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
      values.getOwners.2:
-        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
+        "0xa3D3c103442F162856163d564b983ae538c6202D"
      values.getOwners.1:
-        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
+        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
      values.getOwners.0:
-        "0xa3D3c103442F162856163d564b983ae538c6202D"
+        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
    }
```

# Diff at Fri, 01 Dec 2023 12:33:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@1f8562341e47f5b1eafc343e15aa93bc264ed786

## Description

Added wstETHEscrow contract.

## Watched changes

```diff
+   Status: CREATED
    contract wstETHEscrow (0x9de443AdC5A411E83F1878Ef24C3F52C61571e72) {
    }
```

## Source code changes

```diff
.../contracts/access/AccessControl.sol             | 235 +++++++++++++++++++++
 .../contracts/access/IAccessControl.sol            |  88 ++++++++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |  82 +++++++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  99 +++++++++
 .../@openzeppelin/contracts/utils/Address.sol      | 222 +++++++++++++++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +++
 .../@openzeppelin/contracts/utils/Strings.sol      |  67 ++++++
 .../contracts/utils/introspection/ERC165.sol       |  29 +++
 .../contracts/utils/introspection/IERC165.sol      |  25 +++
 .../implementation/contracts/BridgeableTokens.sol  |  49 +++++
 .../implementation/contracts/BridgingManager.sol   | 135 ++++++++++++
 .../contracts/optimism/CrossDomainEnabled.sol      |  46 ++++
 .../contracts/optimism/L1ERC20TokenBridge.sol      | 150 +++++++++++++
 .../optimism/interfaces/ICrossDomainMessenger.sol  |  18 ++
 .../optimism/interfaces/IL1ERC20Bridge.sol         |  84 ++++++++
 .../optimism/interfaces/IL2ERC20Bridge.sol         |  90 ++++++++
 .../.code/wstETHEscrow/implementation/meta.txt     |   2 +
 .../contracts/interfaces/draft-IERC1822.sol        |  20 ++
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |  33 +++
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 185 ++++++++++++++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |  86 ++++++++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 ++
 .../@openzeppelin/contracts/utils/Address.sol      | 222 +++++++++++++++++++
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  84 ++++++++
 .../proxy/contracts/proxy/OssifiableProxy.sol      |  93 ++++++++
 .../ethereum/.code/wstETHEscrow/proxy/meta.txt     |   2 +
 26 files changed, 2186 insertions(+)
```

# Diff at Tue, 26 Sep 2023 08:12:33 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
      values.deletedOutputs:
+        [{"prevNextOutputIndex":1030,"newNextOutputIndex":1027},{"prevNextOutputIndex":1364,"newNextOutputIndex":1359}]
    }
```
