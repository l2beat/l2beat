Generated with discovered.json: 0xd85496fdcfa0bcf16ce3b442613d6c777e3cfb01

# Diff at Thu, 28 Mar 2024 13:19:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@d6dd20a306b268b851f83df5487b048c1253bb51 block: 19531207
- current block number: 19532859

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531207 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 8 (38%)"
    }
```

```diff
    contract AdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract BaseMultisig (0x9855054731540A48b28990B63DcF4f33d8AE46A1) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract OptimismMultisig (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 7 (71%)"
    }
```

Generated with discovered.json: 0x7a4a21435359044819e1c7ad6454f2e0f5311bf1

# Diff at Thu, 28 Mar 2024 07:45:55 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@5dfb8d5d243e41677914078b08f80de1889c6556 block: 19439852
- current block number: 19531207

## Description

The gas limit for the Base L2 is changed (50% raise). Current block time is 2s, elasticity is 10x.
Context: Congestion on base, plans to raise the gas limit gradually.

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        30000000
+        45000000
    }
```

Generated with discovered.json: 0xc4322ab5b04954fb99593b31607ae478be311b36

# Diff at Thu, 14 Mar 2024 00:20:47 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@e9ab5d808868ba1ecef1f4a9acee050bd71c3c54 block: 19411971
- current block number: 19429655

## Description

Base uses blobs now.

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
-        false
+        true
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279134021569375896653"
    }
```

Generated with discovered.json: 0x344f98dfb9a45ff46b90d16771333c22eec6f0c0

# Diff at Mon, 11 Mar 2024 12:52:00 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176777
- current block number: 19411971

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176777 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x38be013948f7ef1753cbf9d4a57c31e079275867

# Diff at Wed, 07 Feb 2024 14:02:18 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175203
- current block number: 19176777

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175203 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
      values.sequencerInbox:
+        "0xFf00000000000000000000000000000000008453"
    }
```

Generated with discovered.json: 0x33c94c5e5a24fee2f8e0a33fd5aedf98a4c4e082

# Diff at Wed, 07 Feb 2024 08:43:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090314
- current block number: 19175203

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090314 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
    }
```

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
