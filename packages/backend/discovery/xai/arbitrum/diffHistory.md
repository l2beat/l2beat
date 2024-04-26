Generated with discovered.json: 0xa54b30cd938519ebc4c54ade5bb2fe7b20831145

# Diff at Fri, 26 Apr 2024 14:19:34 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@03ab04b156e445d49b5b266d48c3382aeac8d1ab block: 198866013
- current block number: 205037041

## Description

### Staking Pools upgrade

This implementation uprade adds support for esXAI staking pools and removes the support for adding to normal staking (Withdrawals and rewards from normal staking remain enabled). Since staking V2 is still disabled and some contracts are still managed by the deployer, a new assessment of admin roles is necessary as soon as staking V2 is enabled.
edit: Staking pools are active now and the [Xai Deployer EOA](https://arbiscan.io/address/0x7C94E07bbf73518B0E25D1Be200a5b58F46F9dC7) is admin (via owner or ProxyAdmin) of all the staking-related contracts.

#### Referee5

The SentryReferee has a new implementation: Referee5.
This contract has no external `stake()` function so non-pooled (V1) staking is not possible anymore. The new staking entry contract is now `PoolFactory`, which calls the new `onlyPoolFactory`-modified functions inside Referee5. Unstaking of V1 non-pool staked esXAI is still possible with the external `unstake()` function in Referee5.

Referee5 now supports batching of assertions `submitMultipleAssertions()` and rewards `claimMultipleRewards()`.

New mappings are added to assist the assigning of (staking/kyc)-keys to pools, as the number of keys associated with a pool determines the maximum of esXAI that can be staked inside.

#### PoolFactory

The new staking pools get created here (`createPool()`). Pool creators need at least one staking key to create a pool and are able to define a delegate owner address that can post assertions (node duties) on their behalf. The PoolFactory has plenty of pool managing functions (staking/unstaking keys, updating metadata, managing shares), available to the pool creator. 'Shares' of a pool can be allocated by the pool creator within defined bounds to 3 different recipients: 1) The pool creator / owner, 2) Owners of keys staked in the pool, 3) Stakers of esXAI in the pool. This will direct the esXAI rewards to the different recipients. Claiming of rewards is delegated to the pools themselves.

#### StakingPool

Each staking pool is managed in such a contract.

#### BucketTracker

Imported by the StakingPools: Tracks the virtual balances of participants in a staking pool. (Needed for calculation and distribution of dividends)

## Watched changes

```diff
+   Status: CREATED
    contract BucketTracker (0x1582e73D95F33E39B421F9224D9e7daF4508408E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingPool (0x599C8489256Fb17b66d499d907F30b8022a29443)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolBeacon (0x5f9D168d3435747335b1B3dC7e4d42e3510087C7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolProxyDeployer (0x68D78D1E81379EfD9C61f8E9131D52CE571AF4fD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolBeacon (0x6Bc4e6B2c13Ba42e933b23AFAb8a58bbbBa5D02B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GasSubsidy (0x94F4aBC83eae00b693286B6eDCa09e1D76183C97)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BucketTracker (0xa83825Dc4D94513d1C907b319EE8224FA63A29B2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolFactory (0xF9E08660223E2dbb1c0b28c82942aB6B5E38b8E5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolBeacon (0xfB93c2e5E41BD0ffd2E99A88e6d2A8D4F542d39a)
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
.../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../contracts/staking-v2/BucketTracker.sol         |  321 +++++++
 .../meta.txt                                       |    2 +
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../contracts/staking-v2/BucketTracker.sol         |  321 +++++++
 .../meta.txt                                       |    2 +
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../token/ERC20/IERC20Upgradeable.sol              |   78 ++
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../implementation/contracts/GasSubsidy.sol        |   38 +
 .../.code/GasSubsidy/implementation/meta.txt       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../xai/arbitrum/.code/GasSubsidy/proxy/meta.txt   |    2 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |   86 ++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 ++
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 ++
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../.code/GnosisSafeL2/implementation/meta.txt     |    2 +
 .../.code/GnosisSafeL2/proxy/GnosisSafeProxy.sol   |  159 ++++
 .../xai/arbitrum/.code/GnosisSafeL2/proxy/meta.txt |    2 +
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../token/ERC721/ERC721Upgradeable.sol             |  478 ++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../token/ERC721/IERC721Upgradeable.sol            |  132 +++
 .../extensions/ERC721EnumerableUpgradeable.sol     |  172 ++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |   29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |   27 +
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/Base64Upgradeable.sol                    |   92 ++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/CountersUpgradeable.sol                  |   43 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../upgrades/node-license/NodeLicense5.sol         |  465 +++++++++
 .../NodeLicenseRegistry/implementation/meta.txt    |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../.code/NodeLicenseRegistry/proxy/meta.txt       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../meta.txt                                       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../meta.txt                                       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../meta.txt                                       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  138 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  339 +++++++
 .../access/AccessControlEnumerableUpgradeable.sol  |   77 ++
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlEnumerableUpgradeable.sol |   31 +
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../token/ERC20/ERC20Upgradeable.sol               |  377 ++++++++
 .../token/ERC20/IERC20Upgradeable.sol              |   78 ++
 .../ERC20/extensions/ERC20BurnableUpgradeable.sol  |   52 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../token/ERC721/ERC721Upgradeable.sol             |  478 ++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../token/ERC721/IERC721Upgradeable.sol            |  132 +++
 .../extensions/ERC721EnumerableUpgradeable.sol     |  172 ++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |   29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |   27 +
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/Base64Upgradeable.sol                    |   92 ++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/CountersUpgradeable.sol                  |   43 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../implementation/contracts/NodeLicense.sol       |  418 ++++++++
 .../PoolFactory/implementation/contracts/Xai.sol   |   69 ++
 .../PoolFactory/implementation/contracts/esXai.sol |  238 +++++
 .../contracts/nitro-contracts/bridge/IBridge.sol   |  115 +++
 .../bridge/IDelayedMessageProvider.sol             |   15 +
 .../contracts/nitro-contracts/bridge/IInbox.sol    |  193 ++++
 .../contracts/nitro-contracts/bridge/IOutbox.sol   |  120 +++
 .../contracts/nitro-contracts/bridge/IOwnable.sol  |   10 +
 .../nitro-contracts/bridge/ISequencerInbox.sol     |  178 ++++
 .../nitro-contracts/challenge/ChallengeLib.sol     |  133 +++
 .../challenge/IChallengeManager.sol                |   73 ++
 .../challenge/IChallengeResultReceiver.sol         |   13 +
 .../nitro-contracts/libraries/IGasRefunder.sol     |   39 +
 .../nitro-contracts/osp/IOneStepProofEntry.sol     |   20 +
 .../nitro-contracts/osp/IOneStepProver.sol         |   27 +
 .../nitro-contracts/rollup/IRollupCore.sol         |  191 ++++
 .../nitro-contracts/rollup/IRollupEventInbox.sol   |   17 +
 .../contracts/nitro-contracts/rollup/Node.sol      |  113 +++
 .../nitro-contracts/state/GlobalState.sol          |   51 +
 .../nitro-contracts/state/Instructions.sol         |  153 +++
 .../contracts/nitro-contracts/state/Machine.sol    |   61 ++
 .../contracts/nitro-contracts/state/Module.sol     |   33 +
 .../nitro-contracts/state/ModuleMemoryCompact.sol  |   17 +
 .../contracts/nitro-contracts/state/StackFrame.sol |   63 ++
 .../contracts/nitro-contracts/state/Value.sol      |   64 ++
 .../contracts/nitro-contracts/state/ValueArray.sol |   47 +
 .../contracts/nitro-contracts/state/ValueStack.sol |   39 +
 .../contracts/staking-v2/BucketTracker.sol         |  321 +++++++
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../contracts/staking-v2/PoolFactory.sol           |  593 ++++++++++++
 .../contracts/staking-v2/PoolProxyDeployer.sol     |   46 +
 .../contracts/staking-v2/StakingPool.sol           |  536 +++++++++++
 .../contracts/upgrades/referee/Referee5.sol        | 1003 ++++++++++++++++++++
 .../.code/PoolFactory/implementation/meta.txt      |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../xai/arbitrum/.code/PoolFactory/proxy/meta.txt  |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  138 +++
 .../access/AccessControlEnumerableUpgradeable.sol  |   77 ++
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlEnumerableUpgradeable.sol |   31 +
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../contracts/staking-v2/PoolProxyDeployer.sol     |   46 +
 .../PoolProxyDeployer/implementation/meta.txt      |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../.code/PoolProxyDeployer/proxy/meta.txt         |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  138 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  339 +++++++
 .../access/AccessControlEnumerableUpgradeable.sol  |   77 ++
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlEnumerableUpgradeable.sol |   31 +
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../token/ERC20/ERC20Upgradeable.sol               |  377 ++++++++
 .../token/ERC20/IERC20Upgradeable.sol              |   78 ++
 .../ERC20/extensions/ERC20BurnableUpgradeable.sol  |   52 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../token/ERC721/ERC721Upgradeable.sol             |  478 ++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../token/ERC721/IERC721Upgradeable.sol            |  132 +++
 .../extensions/ERC721EnumerableUpgradeable.sol     |  172 ++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |   29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |   27 +
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/Base64Upgradeable.sol                    |   92 ++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/CountersUpgradeable.sol                  |   43 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../implementation/contracts/NodeLicense.sol       |  418 ++++++++
 .../SentryReferee/implementation/contracts/Xai.sol |   69 ++
 .../implementation/contracts/esXai.sol             |  238 +++++
 .../contracts/nitro-contracts/bridge/IBridge.sol   |  115 +++
 .../bridge/IDelayedMessageProvider.sol             |   15 +
 .../contracts/nitro-contracts/bridge/IInbox.sol    |  193 ++++
 .../contracts/nitro-contracts/bridge/IOutbox.sol   |  120 +++
 .../contracts/nitro-contracts/bridge/IOwnable.sol  |   10 +
 .../nitro-contracts/bridge/ISequencerInbox.sol     |  178 ++++
 .../nitro-contracts/challenge/ChallengeLib.sol     |  133 +++
 .../challenge/IChallengeManager.sol                |   73 ++
 .../challenge/IChallengeResultReceiver.sol         |   13 +
 .../nitro-contracts/libraries/IGasRefunder.sol     |   39 +
 .../nitro-contracts/osp/IOneStepProofEntry.sol     |   20 +
 .../nitro-contracts/osp/IOneStepProver.sol         |   27 +
 .../nitro-contracts/rollup/IRollupCore.sol         |  191 ++++
 .../nitro-contracts/rollup/IRollupEventInbox.sol   |   17 +
 .../contracts/nitro-contracts/rollup/Node.sol      |  113 +++
 .../nitro-contracts/state/GlobalState.sol          |   51 +
 .../nitro-contracts/state/Instructions.sol         |  153 +++
 .../contracts/nitro-contracts/state/Machine.sol    |   61 ++
 .../contracts/nitro-contracts/state/Module.sol     |   33 +
 .../nitro-contracts/state/ModuleMemoryCompact.sol  |   17 +
 .../contracts/nitro-contracts/state/StackFrame.sol |   63 ++
 .../contracts/nitro-contracts/state/Value.sol      |   64 ++
 .../contracts/nitro-contracts/state/ValueArray.sol |   47 +
 .../contracts/nitro-contracts/state/ValueStack.sol |   39 +
 .../contracts/staking-v2/BucketTracker.sol         |  321 +++++++
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../contracts/staking-v2/PoolFactory.sol           |  593 ++++++++++++
 .../contracts/staking-v2/PoolProxyDeployer.sol     |   46 +
 .../contracts/staking-v2/StakingPool.sol           |  536 +++++++++++
 .../contracts/upgrades/referee/Referee5.sol        | 1003 ++++++++++++++++++++
 .../contracts/upgrades/referee/Referee6.sol        | 1003 ++++++++++++++++++++
 .../.code/SentryReferee/implementation/meta.txt    |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../arbitrum/.code/SentryReferee/proxy/meta.txt    |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  138 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  339 +++++++
 .../access/AccessControlEnumerableUpgradeable.sol  |   77 ++
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlEnumerableUpgradeable.sol |   31 +
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++++
 .../token/ERC20/ERC20Upgradeable.sol               |  377 ++++++++
 .../token/ERC20/IERC20Upgradeable.sol              |   78 ++
 .../ERC20/extensions/ERC20BurnableUpgradeable.sol  |   52 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../token/ERC721/ERC721Upgradeable.sol             |  478 ++++++++++
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../token/ERC721/IERC721Upgradeable.sol            |  132 +++
 .../extensions/ERC721EnumerableUpgradeable.sol     |  172 ++++
 .../extensions/IERC721EnumerableUpgradeable.sol    |   29 +
 .../extensions/IERC721MetadataUpgradeable.sol      |   27 +
 .../utils/AddressUpgradeable.sol                   |  244 +++++
 .../utils/Base64Upgradeable.sol                    |   92 ++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/CountersUpgradeable.sol                  |   43 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/EnumerableSetUpgradeable.sol     |  378 ++++++++
 .../.code/StakingPool/contracts/NodeLicense.sol    |  418 ++++++++
 .../arbitrum/.code/StakingPool/contracts/Xai.sol   |   69 ++
 .../arbitrum/.code/StakingPool/contracts/esXai.sol |  238 +++++
 .../contracts/nitro-contracts/bridge/IBridge.sol   |  115 +++
 .../bridge/IDelayedMessageProvider.sol             |   15 +
 .../contracts/nitro-contracts/bridge/IInbox.sol    |  193 ++++
 .../contracts/nitro-contracts/bridge/IOutbox.sol   |  120 +++
 .../contracts/nitro-contracts/bridge/IOwnable.sol  |   10 +
 .../nitro-contracts/bridge/ISequencerInbox.sol     |  178 ++++
 .../nitro-contracts/challenge/ChallengeLib.sol     |  133 +++
 .../challenge/IChallengeManager.sol                |   73 ++
 .../challenge/IChallengeResultReceiver.sol         |   13 +
 .../nitro-contracts/libraries/IGasRefunder.sol     |   39 +
 .../nitro-contracts/osp/IOneStepProofEntry.sol     |   20 +
 .../nitro-contracts/osp/IOneStepProver.sol         |   27 +
 .../nitro-contracts/rollup/IRollupCore.sol         |  191 ++++
 .../nitro-contracts/rollup/IRollupEventInbox.sol   |   17 +
 .../contracts/nitro-contracts/rollup/Node.sol      |  113 +++
 .../nitro-contracts/state/GlobalState.sol          |   51 +
 .../nitro-contracts/state/Instructions.sol         |  153 +++
 .../contracts/nitro-contracts/state/Machine.sol    |   61 ++
 .../contracts/nitro-contracts/state/Module.sol     |   33 +
 .../nitro-contracts/state/ModuleMemoryCompact.sol  |   17 +
 .../contracts/nitro-contracts/state/StackFrame.sol |   63 ++
 .../contracts/nitro-contracts/state/Value.sol      |   64 ++
 .../contracts/nitro-contracts/state/ValueArray.sol |   47 +
 .../contracts/nitro-contracts/state/ValueStack.sol |   39 +
 .../contracts/staking-v2/BucketTracker.sol         |  321 +++++++
 .../contracts/staking-v2/PoolBeacon.sol            |   22 +
 .../contracts/staking-v2/PoolFactory.sol           |  593 ++++++++++++
 .../contracts/staking-v2/PoolProxyDeployer.sol     |   46 +
 .../contracts/staking-v2/StakingPool.sol           |  536 +++++++++++
 .../contracts/upgrades/referee/Referee5.sol        | 1003 ++++++++++++++++++++
 .../xai/arbitrum/.code/StakingPool/meta.txt        |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 ++
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 ++
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../xai/arbitrum/.code/StakingProxyAdmin/meta.txt  |    2 +
 430 files changed, 50888 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 198866013 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0x1F941F7Fb552215af81e6bE87F59578C18783483)
    +++ description: None
```

```diff
-   Status: DELETED
    contract esXai (0x4C749d097832DE2FEcc989ce18fDc5f1BD76700c)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Xai (0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GasSubsidy (0x94F4aBC83eae00b693286B6eDCa09e1D76183C97)
    +++ description: None
```

```diff
-   Status: DELETED
    contract NodeLicenseRegistry (0xbc14d8563b248B79689ECbc43bBa53290e0b6b66)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SentryReferee (0xfD41041180571C5D371BEA3D9550E55653671198)
    +++ description: None
```

Generated with discovered.json: 0x1bcf28a5e142cbf6032c6876ac9ccbb3fb9baa4e

# Diff at Thu, 28 Mar 2024 11:33:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 192980353
- current block number: 195077564

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 192980353 (main branch discovery), not current.

```diff
    contract GnosisSafeAdminMember (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 3 (33%)"
    }
```

```diff
    contract GnosisSafeL2 (0x1F941F7Fb552215af81e6bE87F59578C18783483) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ExecutorMultisig (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract GnosisSafeL2 (0xFCF7248C495d6fd3641eE43F861c48Ebe402c878) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x79aaa42a48912c230dee5335fb64046b27683ad0

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

Update discovery to include the multisig threshold.

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
