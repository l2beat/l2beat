Generated with discovered.json: 0xefc16d52c36703ef3d02cb440a76c6ef37559194

# Diff at Thu, 14 Mar 2024 14:56:12 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@4f6a54f5fa748334d34176673b2c233534ce2fbc block: 181262302
- current block number: 190317868

## Description

- Modified the redemption function that allows esXAI to be redeemed for XAI. If the user redeems before the maximum redemption period, a percentage of the esXAI will be burned. This modification adds that half of the would-be burned esXai amount will be minted as XAI to the esXaiBurnFoundationRecipient.

- Added a whitelisted address (the Referee address) to esXAI . Only whitelisted addresses are able to initiate esXAI token transfers.

- Changed wasmModuleRoot to orbOS version 11.

- Added Referee4 smart contract. The referree contract allows to create new challenges (state root reports) from the permissioned challenger, collects assertions from sentry nodes, and gives out rewards to participants of a challenge. This is the contract that distributes esXAI rewards for operating a sentry node.
  The role of sentry nodes is to basically verify (assert) the submitted state root after it has been submitted. There is no integrated way to flag an invalid state root, sentry nodes will have to raise the alarm by external means. This makes them just observation nodes.

## Watched changes

```diff
    contract esXai (0x4C749d097832DE2FEcc989ce18fDc5f1BD76700c) {
    +++ description: None
      upgradeability.implementation:
-        "0x8d6C063656b00E5c37CE007C0f99848D58F19d6B"
+        "0xb38E2EDda6c31D9972Cac770f3F404CD0D7B55Df"
      implementations.0:
-        "0x8d6C063656b00E5c37CE007C0f99848D58F19d6B"
+        "0xb38E2EDda6c31D9972Cac770f3F404CD0D7B55Df"
      values.getWhitelistCount:
-        0
+        1
      values.getWhitelistedAddressAtIndex[0]:
+        "0xfD41041180571C5D371BEA3D9550E55653671198"
      values.esXaiBurnFoundationBasePoints:
+        500
      values.esXaiBurnFoundationRecipient:
+        "0x1F941F7Fb552215af81e6bE87F59578C18783483"
      derivedName:
-        "esXai"
+        "esXai2"
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    +++ description: None
      values.dacKeyset.requiredSignatures:
-        4
+        5
      values.dacKeyset.membersCount:
-        5
+        6
      values.keySetUpdates:
-        3
+        4
    }
```

```diff
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    +++ description: None
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x1F941F7Fb552215af81e6bE87F59578C18783483)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GasSubsidy (0x94F4aBC83eae00b693286B6eDCa09e1D76183C97)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198)
    +++ description: None
```

## Source code changes

```diff
.../access/AccessControlUpgradeable.sol            | 261 +++++++
 .../access/IAccessControlUpgradeable.sol           |  88 +++
 .../proxy/utils/Initializable.sol                  | 166 +++++
 .../token/ERC20/IERC20Upgradeable.sol              |  78 ++
 .../utils/AddressUpgradeable.sol                   | 244 +++++++
 .../utils/ContextUpgradeable.sol                   |  37 +
 .../utils/StringsUpgradeable.sol                   |  85 +++
 .../utils/introspection/ERC165Upgradeable.sol      |  42 ++
 .../utils/introspection/IERC165Upgradeable.sol     |  25 +
 .../utils/math/MathUpgradeable.sol                 | 339 +++++++++
 .../utils/math/SignedMathUpgradeable.sol           |  43 ++
 .../implementation/contracts/GasSubsidy.sol        |  38 +
 .../.code/GasSubsidy/implementation/meta.txt       |   2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 +++
 .../contracts/interfaces/IERC1967.sol              |  26 +
 .../contracts/interfaces/draft-IERC1822.sol        |  20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |  32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 171 +++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |  86 +++
 .../contracts/proxy/beacon/BeaconProxy.sol         |  61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |  65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |  81 +++
 .../transparent/TransparentUpgradeableProxy.sol    | 193 +++++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  88 +++
 .../xai/arbitrum/.code/GasSubsidy/proxy/meta.txt   |   2 +
 .../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |  86 +++
 .../implementation/contracts/base/Executor.sol     |  27 +
 .../contracts/base/FallbackManager.sol             |  53 ++
 .../implementation/contracts/base/GuardManager.sol |  50 ++
 .../contracts/base/ModuleManager.sol               | 133 ++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 +
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 +
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 ++
 .../contracts/external/GnosisSafeMath.sol          |  54 ++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 159 ++++
 .../proxy/meta.txt                                 |   2 +
 .../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |  86 +++
 .../implementation/contracts/base/Executor.sol     |  27 +
 .../contracts/base/FallbackManager.sol             |  53 ++
 .../implementation/contracts/base/GuardManager.sol |  50 ++
 .../contracts/base/ModuleManager.sol               | 133 ++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 +
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 +
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 ++
 .../contracts/external/GnosisSafeMath.sol          |  54 ++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 159 ++++
 .../proxy/meta.txt                                 |   2 +
 .../access/AccessControlUpgradeable.sol            | 261 +++++++
 .../access/IAccessControlUpgradeable.sol           |  88 +++
 .../proxy/utils/Initializable.sol                  | 166 +++++
 .../token/ERC721/ERC721Upgradeable.sol             | 478 +++++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |  27 +
 .../token/ERC721/IERC721Upgradeable.sol            | 132 ++++
 .../extensions/ERC721EnumerableUpgradeable.sol     | 172 +++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |  29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |  27 +
 .../utils/AddressUpgradeable.sol                   | 244 +++++++
 .../utils/Base64Upgradeable.sol                    |  92 +++
 .../utils/ContextUpgradeable.sol                   |  37 +
 .../utils/CountersUpgradeable.sol                  |  43 ++
 .../utils/StringsUpgradeable.sol                   |  85 +++
 .../utils/introspection/ERC165Upgradeable.sol      |  42 ++
 .../utils/introspection/IERC165Upgradeable.sol     |  25 +
 .../utils/math/MathUpgradeable.sol                 | 339 +++++++++
 .../utils/math/SignedMathUpgradeable.sol           |  43 ++
 .../upgrades/node-license/NodeLicense5.sol         | 465 ++++++++++++
 .../NodeLicenseRegistry/implementation/meta.txt    |   2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 +++
 .../contracts/interfaces/IERC1967.sol              |  26 +
 .../contracts/interfaces/draft-IERC1822.sol        |  20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |  32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 171 +++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |  86 +++
 .../contracts/proxy/beacon/BeaconProxy.sol         |  61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |  65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |  81 +++
 .../transparent/TransparentUpgradeableProxy.sol    | 193 +++++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  88 +++
 .../.code/NodeLicenseRegistry/proxy/meta.txt       |   2 +
 .../@openzeppelin/contracts/utils/math/Math.sol    | 339 +++++++++
 .../access/AccessControlEnumerableUpgradeable.sol  |  77 ++
 .../access/AccessControlUpgradeable.sol            | 261 +++++++
 .../access/IAccessControlEnumerableUpgradeable.sol |  31 +
 .../access/IAccessControlUpgradeable.sol           |  88 +++
 .../proxy/utils/Initializable.sol                  | 166 +++++
 .../token/ERC20/ERC20Upgradeable.sol               | 377 ++++++++++
 .../token/ERC20/IERC20Upgradeable.sol              |  78 ++
 .../ERC20/extensions/ERC20BurnableUpgradeable.sol  |  52 ++
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |  28 +
 .../token/ERC721/ERC721Upgradeable.sol             | 478 +++++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |  27 +
 .../token/ERC721/IERC721Upgradeable.sol            | 132 ++++
 .../extensions/ERC721EnumerableUpgradeable.sol     | 172 +++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |  29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |  27 +
 .../utils/AddressUpgradeable.sol                   | 244 +++++++
 .../utils/Base64Upgradeable.sol                    |  92 +++
 .../utils/ContextUpgradeable.sol                   |  37 +
 .../utils/CountersUpgradeable.sol                  |  43 ++
 .../utils/StringsUpgradeable.sol                   |  85 +++
 .../utils/introspection/ERC165Upgradeable.sol      |  42 ++
 .../utils/introspection/IERC165Upgradeable.sol     |  25 +
 .../utils/math/MathUpgradeable.sol                 | 339 +++++++++
 .../utils/math/SignedMathUpgradeable.sol           |  43 ++
 .../utils/structs/EnumerableSetUpgradeable.sol     | 378 ++++++++++
 .../implementation/contracts/NodeLicense.sol       | 418 +++++++++++
 .../SentryReferee/implementation/contracts/Xai.sol |  69 ++
 .../implementation/contracts/esXai.sol             | 238 ++++++
 .../contracts/nitro-contracts/bridge/IBridge.sol   | 115 +++
 .../bridge/IDelayedMessageProvider.sol             |  15 +
 .../contracts/nitro-contracts/bridge/IInbox.sol    | 193 +++++
 .../contracts/nitro-contracts/bridge/IOutbox.sol   | 120 ++++
 .../contracts/nitro-contracts/bridge/IOwnable.sol  |  10 +
 .../nitro-contracts/bridge/ISequencerInbox.sol     | 178 +++++
 .../nitro-contracts/challenge/ChallengeLib.sol     | 133 ++++
 .../challenge/IChallengeManager.sol                |  73 ++
 .../challenge/IChallengeResultReceiver.sol         |  13 +
 .../nitro-contracts/libraries/IGasRefunder.sol     |  39 +
 .../nitro-contracts/osp/IOneStepProofEntry.sol     |  20 +
 .../nitro-contracts/osp/IOneStepProver.sol         |  27 +
 .../nitro-contracts/rollup/IRollupCore.sol         | 191 +++++
 .../nitro-contracts/rollup/IRollupEventInbox.sol   |  17 +
 .../contracts/nitro-contracts/rollup/Node.sol      | 113 +++
 .../nitro-contracts/state/GlobalState.sol          |  51 ++
 .../nitro-contracts/state/Instructions.sol         | 153 ++++
 .../contracts/nitro-contracts/state/Machine.sol    |  61 ++
 .../contracts/nitro-contracts/state/Module.sol     |  33 +
 .../nitro-contracts/state/ModuleMemoryCompact.sol  |  17 +
 .../contracts/nitro-contracts/state/StackFrame.sol |  63 ++
 .../contracts/nitro-contracts/state/Value.sol      |  64 ++
 .../contracts/nitro-contracts/state/ValueArray.sol |  47 ++
 .../contracts/nitro-contracts/state/ValueStack.sol |  39 +
 .../contracts/upgrades/referee/Referee4.sol        | 796 +++++++++++++++++++++
 .../.code/SentryReferee/implementation/meta.txt    |   2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 +++
 .../contracts/interfaces/IERC1967.sol              |  26 +
 .../contracts/interfaces/draft-IERC1822.sol        |  20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |  32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 171 +++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |  86 +++
 .../contracts/proxy/beacon/BeaconProxy.sol         |  61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |  65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |  81 +++
 .../transparent/TransparentUpgradeableProxy.sol    | 193 +++++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  88 +++
 .../arbitrum/.code/SentryReferee/proxy/meta.txt    |   2 +
 .../contracts/upgrades/esXai/esXai2.sol            | 270 +++++++
 .../esXai/implementation/meta.txt                  |   4 +-
 173 files changed, 17737 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0xcf1fb3429d4e6e0b7364715240da72013f3ab0de

# Diff at Fri, 16 Feb 2024 07:26:55 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@a6356b2783ea71be1ce7003098f574ebc90b553b block: 177621512
- current block number: 181262302

## Description

Update in nonce, now ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 177621512 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
      name:
-        "GnosisSafeL2"
+        "ExecutorMultisig"
      values.nonce:
-        2
    }
```

Generated with discovered.json: 0x1331038a7bf98dc70733792489ed180c671bcb35

# Diff at Mon, 05 Feb 2024 08:16:18 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@7095f5c6435baaba0d0084960e2593a905aaf947 block: 175991369
- current block number: 177621512

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract GnosisSafeL2 (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
      values.nonce:
-        1
+        2
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
      values.dacKeyset.keyCount:
-        3
+        5
      values.keySetUpdates:
-        2
+        3
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 175991369 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
      values.dacKeyset:
+        {"threshold":2,"keyCount":3}
      values.sequencerVersion:
+        "0x88"
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    }
```

Generated with discovered.json: 0x598a2a43b1e79400ea587313e0534a96d5a69336

# Diff at Wed, 31 Jan 2024 08:11:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@367f818d32ce6c1ab18696a1cbeb7a6f368b6d78 block: 175366965
- current block number: 175991369

## Description

Start tracking the keySetUpdates.
Ignore totalSupply and nonce in watch mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 175366965 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
      name:
-        "GnosisSafeL2"
+        "GnosisSafeAdminMember"
      values.nonce:
-        5
      derivedName:
+        "GnosisSafeL2"
    }
```

```diff
    contract esXai (0x4C749d097832DE2FEcc989ce18fDc5f1BD76700c) {
      derivedName:
+        "esXai"
    }
```

```diff
    contract Xai (0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66) {
      derivedName:
+        "Xai"
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
      values.keySetUpdates:
+        2
    }
```

Generated with discovered.json: 0xc92ae2df53624132eb65c022f197837314f8a495

# Diff at Mon, 29 Jan 2024 11:22:06 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 175366965

## Description

Add initial XAI config.

## Initial discovery

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x041F85dD87c46B941dc9b15c6628B19ee5358485) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
    }
```

```diff
+   Status: CREATED
    contract esXai (0x4C749d097832DE2FEcc989ce18fDc5f1BD76700c) {
    }
```

```diff
+   Status: CREATED
    contract Xai (0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    }
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```
