Generated with discovered.json: 0x820d7e08eb017cd89160f0b1a39947beb06053fa

# Diff at Fri, 29 Mar 2024 08:02:08 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fb81931df1e69bb68ad02bc55a22b788201dd072 block: 19176658
- current block number: 19538342

## Description

- added bridged token contract: the bridge can mint and burn these tokens (onlyBridge)
- SpokePool upgrade: various functions to register orders, updated to V3 specs. // does it use merkle proofs to withdraw funds? 
Plus some counters of filled orders and deposits. These counters are designed to implement a fee mechanism that is based on a canonical history of deposit and fill events and how they update a virtual running balance of liabilities and assets, which then determines the LP fee charged to relays. Plus some error handling, handling of non-expiring deposits.

Workflow - from the contract:
Request to bridge input token cross chain to a destination chain and receive a specified amount of output tokens. The fee paid to relayers and the system should be captured in the spread between output amount and input amount when adjusted to be denominated in the input token. A relayer on the destination chain will send outputAmount of outputTokens to the recipient and receive inputTokens on a repayment chain of their choice. Therefore, the fee should account for destination fee transaction costs, the relayer's opportunity cost of capital while they wait to be refunded following an optimistic challenge window in the HubPool, and the system fee that they'll be charged. On the destination chain, the hash of the deposit data will be used to uniquely identify this deposit, so modifying any params in it will result in a different hash and a different deposit. The hash will comprise all parameters to this function along with this chain's chainId(). Relayers are only refunded for filling deposits with deposit hashes that map exactly to the one emitted by this contract.



## Watched changes

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      upgradeability.implementation:
-        "0x5ab0A812327aD959dE664AEC8408Ef8c6ABe7184"
+        "0xa4D3535f33549749Fb97fA42903AC80F6fb54af6"
      implementations.0:
-        "0x5ab0A812327aD959dE664AEC8408Ef8c6ABe7184"
+        "0xa4D3535f33549749Fb97fA42903AC80F6fb54af6"
      values.SLOW_FILL_MAX_TOKENS_TO_SEND:
-        "10000000000000000000000000000000000000000"
      values.UPDATE_DEPOSIT_DETAILS_HASH:
-        "0x0e058f05b73c62ee68329d2c67c067aaae9a06503cc306378d144d0f0177882b"
      values.EMPTY_RELAYER:
+        "0x0000000000000000000000000000000000000000"
      values.EMPTY_REPAYMENT_CHAIN_ID:
+        0
      values.fillDeadlineBuffer:
+        28800
      values.INFINITE_FILL_DEADLINE:
+        4294967295
      values.UPDATE_V3_DEPOSIT_DETAILS_HASH:
+        "0x152eb71524aef34d838ab76573c14b1ebfa5e385d9ab29d7cf5398daa2438bd9"
    }
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.CrossChainContracts.59144:
+        {"l2ChainId":59144,"adapter":"0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE","spokePool":"0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75"}
    }
```

```diff
+   Status: CREATED
    contract TokenBridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgedToken (0x36f274C1C197F277EA3C57859729398FCc8a3763)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x41fAD3Df1B07B647D120D055259E474fE8046eb5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1USDCBridge (0x504A330327A089d8364C4ab3811Ee26976d388ce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x5B0bb17755FBa06028530682E2FD5bc373931768)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Linea_Adapter (0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x892bb7EeD71efB060ab90140e7825d8127991DD3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0x971f46a2852d11D59dbF0909e837cfd06f357DeB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiSend (0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LineaRollup (0xd19d4B5d358258f05D7B411E21A1460D11B0876F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimeLock (0xd6B95c960779c72B8C6752119849318E5d550574)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF5058616517C068C7b8c7EbC69FF636Ade9066d6)
    +++ description: None
```

## Source code changes

```diff
.../interfaces/IERC5267Upgradeable.sol             |   28 +
 .../proxy/utils/Initializable.sol                  |  166 +++
 .../token/ERC20/ERC20Upgradeable.sol               |  377 +++++
 .../token/ERC20/IERC20Upgradeable.sol              |   78 +
 .../ERC20/extensions/ERC20PermitUpgradeable.sol    |  109 ++
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../ERC20/extensions/IERC20PermitUpgradeable.sol   |   60 +
 .../utils/AddressUpgradeable.sol                   |  244 ++++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/CountersUpgradeable.sol                  |   43 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/cryptography/ECDSAUpgradeable.sol        |  217 +++
 .../utils/cryptography/EIP712Upgradeable.sol       |  205 +++
 .../utils/math/MathUpgradeable.sol                 |  339 +++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../contracts/tokenBridge/BridgedToken.sol         |   69 +
 .../across-v2/ethereum/.code/BridgedToken/meta.txt |    2 +
 .../contracts/Ethereum_SpokePool.sol               |   20 +-
 .../implementation/contracts/MerkleLib.sol         |   12 +-
 .../implementation/contracts/SpokePool.sol         | 1496 ++++++++++----------
 .../contracts/interfaces/SpokePoolInterface.sol    |  108 +-
 .../contracts/interfaces/V3SpokePoolInterface.sol  |  238 ++++
 .../upgradeable/AddressLibUpgradeable.sol          |    2 +-
 .../upgradeable/MultiCallerUpgradeable.sol         |    6 +
 .../Ethereum_SpokePool/implementation/meta.txt     |    2 +-
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++
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
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |   82 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 +
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 ++++
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../access/Ownable2StepUpgradeable.sol             |   71 +
 .../access/OwnableUpgradeable.sol                  |   95 ++
 .../proxy/utils/Initializable.sol                  |  165 +++
 .../security/PausableUpgradeable.sol               |  117 ++
 .../security/ReentrancyGuardUpgradeable.sol        |   81 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../implementation/contracts/L1USDCBridge.sol      |   83 ++
 .../contracts/abstracts/USDCBridge.sol             |  171 +++
 .../contracts/interfaces/IMessageService.sol       |   65 +
 .../implementation/contracts/interfaces/IUSDC.sol  |   28 +
 .../contracts/interfaces/IUSDCBridge.sol           |   32 +
 .../.code/L1USDCBridge/implementation/meta.txt     |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   68 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  189 +++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   83 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   15 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   64 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   77 +
 .../transparent/TransparentUpgradeableProxy.sol    |  120 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  189 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   83 ++
 .../.code/L1USDCBridge/proxy/contracts/import.sol  |   13 +
 .../ethereum/.code/L1USDCBridge/proxy/meta.txt     |    2 +
 .../contracts/utils/structs/BitMaps.sol            |   51 +
 .../access/AccessControlUpgradeable.sol            |  261 ++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 +++
 .../security/ReentrancyGuardUpgradeable.sol        |   89 ++
 .../utils/AddressUpgradeable.sol                   |  244 ++++
 .../utils/ContextUpgradeable.sol                   |   41 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 +++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../implementation/contracts/LineaRollup.sol       |  554 ++++++++
 .../implementation/contracts/ZkEvmV2.sol           |   65 +
 .../contracts/interfaces/IGenericErrors.sol        |   14 +
 .../contracts/interfaces/IMessageService.sol       |   95 ++
 .../contracts/interfaces/IPauseManager.sol         |   33 +
 .../contracts/interfaces/IRateLimiter.sol          |   65 +
 .../contracts/interfaces/l1/IL1MessageManager.sol  |   53 +
 .../interfaces/l1/IL1MessageManagerV1.sol          |   38 +
 .../contracts/interfaces/l1/IL1MessageService.sol  |   54 +
 .../contracts/interfaces/l1/ILineaRollup.sol       |  302 ++++
 .../contracts/interfaces/l1/IPlonkVerifier.sol     |   16 +
 .../contracts/interfaces/l1/IZkEvmV2.sol           |   46 +
 .../implementation/contracts/lib/Utils.sol         |   18 +
 .../messageService/l1/L1MessageManager.sol         |   99 ++
 .../messageService/l1/L1MessageService.sol         |  163 +++
 .../messageService/l1/v1/L1MessageManagerV1.sol    |   49 +
 .../messageService/l1/v1/L1MessageServiceV1.sol    |  139 ++
 .../contracts/messageService/lib/PauseManager.sol  |  119 ++
 .../contracts/messageService/lib/RateLimiter.sol   |  118 ++
 .../lib/SparseMerkleTreeVerifier.sol               |   47 +
 .../.code/LineaRollup/implementation/meta.txt      |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 +++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 +++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 ++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../ethereum/.code/LineaRollup/proxy/meta.txt      |    2 +
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |   78 +
 .../token/ERC20/extensions/IERC20Permit.sol        |   90 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  143 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 ++++
 .../contracts/chain-adapters/Linea_Adapter.sol     |   85 ++
 .../chain-adapters/interfaces/AdapterInterface.sol |   40 +
 .../external/interfaces/LineaInterfaces.sol        |   75 +
 .../external/interfaces/WETH9Interface.sol         |   34 +
 .../ethereum/.code/Linea_Adapter/meta.txt          |    2 +
 .../MultiSend/contracts/libraries/MultiSend.sol    |   66 +
 .../across-v2/ethereum/.code/MultiSend/meta.txt    |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   68 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  189 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   83 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   15 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   64 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   77 +
 .../transparent/TransparentUpgradeableProxy.sol    |  120 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  189 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   83 ++
 .../contracts/import.sol                           |   13 +
 .../meta.txt                                       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 +++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 ++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../meta.txt                                       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 +++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 ++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../meta.txt                                       |    2 +
 .../safe-contracts/contracts/common/Enum.sol       |    8 +
 .../contracts/interfaces/IERC165.sol               |   15 +
 .../@gnosis.pm/zodiac/contracts/core/Modifier.sol  |  134 ++
 .../@gnosis.pm/zodiac/contracts/core/Module.sol    |  116 ++
 .../zodiac/contracts/factory/FactoryFriendly.sol   |   10 +
 .../zodiac/contracts/guard/BaseGuard.sol           |   38 +
 .../zodiac/contracts/guard/Guardable.sol           |   31 +
 .../zodiac/contracts/interfaces/IAvatar.sol        |   66 +
 .../zodiac/contracts/interfaces/IGuard.sol         |   22 +
 .../access/OwnableUpgradeable.sol                  |   78 +
 .../proxy/utils/Initializable.sol                  |   46 +
 .../utils/ContextUpgradeable.sol                   |   31 +
 .../ethereum/.code/Roles/contracts/Permissions.sol |  984 +++++++++++++
 .../ethereum/.code/Roles/contracts/Roles.sol       |  406 ++++++
 .../across-v2/ethereum/.code/Roles/meta.txt        |    2 +
 .../contracts/access/AccessControl.sol             |  248 ++++
 .../contracts/access/IAccessControl.sol            |   88 ++
 .../contracts/governance/TimelockController.sol    |  422 ++++++
 .../contracts/token/ERC1155/IERC1155Receiver.sol   |   58 +
 .../contracts/token/ERC721/IERC721Receiver.sol     |   27 +
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/Strings.sol      |   85 ++
 .../contracts/utils/introspection/ERC165.sol       |   29 +
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../@openzeppelin/contracts/utils/math/Math.sol    |  339 +++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts/messageService/lib/TimeLock.sol      |   18 +
 .../across-v2/ethereum/.code/TimeLock/meta.txt     |    2 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  157 ++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../@openzeppelin/contracts/utils/Address.sol      |  244 ++++
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  138 ++
 .../access/Ownable2StepUpgradeable.sol             |   71 +
 .../access/OwnableUpgradeable.sol                  |   95 ++
 .../interfaces/IERC5267Upgradeable.sol             |   28 +
 .../proxy/utils/Initializable.sol                  |  166 +++
 .../security/PausableUpgradeable.sol               |  117 ++
 .../security/ReentrancyGuardUpgradeable.sol        |   89 ++
 .../token/ERC20/ERC20Upgradeable.sol               |  377 +++++
 .../token/ERC20/IERC20Upgradeable.sol              |   78 +
 .../ERC20/extensions/ERC20PermitUpgradeable.sol    |  109 ++
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../ERC20/extensions/IERC20PermitUpgradeable.sol   |   60 +
 .../token/ERC20/utils/SafeERC20Upgradeable.sol     |  143 ++
 .../utils/AddressUpgradeable.sol                   |  244 ++++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/CountersUpgradeable.sol                  |   43 +
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/cryptography/ECDSAUpgradeable.sol        |  217 +++
 .../utils/cryptography/EIP712Upgradeable.sol       |  205 +++
 .../utils/math/MathUpgradeable.sol                 |  339 +++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../contracts/interfaces/IMessageService.sol       |   85 ++
 .../messageService/MessageServiceBase.sol          |   84 ++
 .../contracts/tokenBridge/BridgedToken.sol         |   69 +
 .../contracts/tokenBridge/TokenBridge.sol          |  498 +++++++
 .../tokenBridge/interfaces/ITokenBridge.sol        |  116 ++
 .../.code/TokenBridge/implementation/meta.txt      |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 +++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 +++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 ++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../ethereum/.code/TokenBridge/proxy/meta.txt      |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 ++
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 ++
 .../transparent/TransparentUpgradeableProxy.sol    |  193 +++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 ++++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 ++
 .../ethereum/.code/UpgradeableBeacon/meta.txt      |    2 +
 270 files changed, 26103 insertions(+), 893 deletions(-)
```

Generated with discovered.json: 0x80d696e326cc38fa37de94d90eec00c9fd19f4c0

# Diff at Wed, 07 Feb 2024 13:38:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@70a2c5f9336d4d624160533a78c31ce52c7bbe58 block: 19033859
- current block number: 19176658

## Description

Ignore "getL1CallValue" in watch mode, since its value will fluctuate depending
on the gas price.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19033859 (main branch discovery), not current.

```diff
    contract ZkSync_Adapter (0xE233009838CB898b50e0012a6E783FC9FeE447FB) {
      derivedName:
+        "ZkSync_Adapter"
    }
```

Generated with discovered.json: 0x23ba1cd898c48745cfbf6f95e764d3dd8904bfed

# Diff at Thu, 18 Jan 2024 12:51:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ea763a3a6145f892624da4ecacd25a080a0d5b0 block: 18519360
- current block number: 19033859

## Description

OptimisticGovernor got discovered as a GnosisSafe module.
Smaller values for bonds in the OptimisticGovernor.
New owner added to the EmergencyProposalExecutor.

## Watched changes

```diff
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
      values.getOwners[3]:
+        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
      values.getOwners.2:
-        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
+        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
      values.getOwners.1:
-        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
+        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
      values.getOwners.0:
-        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
+        "0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
    }
```

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
      values.bondAmount:
-        "10000000000000000000"
+        "2000000000000000000"
      values.getProposalBond:
-        "10000000000000000000"
+        "2000000000000000000"
      values.liveness:
-        432000
+        172800
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18519360 (main branch discovery), not current.

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
      upgradeability.type:
-        "immutable"
+        "gnosis safe zodiac module"
      upgradeability.avatar:
+        "0xB524735356985D2f267FA010D681f061DfF03715"
      upgradeability.target:
+        "0xB524735356985D2f267FA010D681f061DfF03715"
      upgradeability.guard:
+        "0x0000000000000000000000000000000000000000"
    }
```

# Diff at Fri, 13 Oct 2023 08:47:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@2aa7c4f2a9e71b0f29f6bdefa9d749d4fbbd7f5f

## Description

Updated the logic used to take into account the timestamp drift between L1 and L2 blocks.

## Watched changes

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
      upgradeability.implementation:
-        "0x326510c1bf9d85Fb73d0AB8d20Aa5BbE9c7561e9"
+        "0x5ab0A812327aD959dE664AEC8408Ef8c6ABe7184"
    }
```

## Source code changes

```diff
.../token/ERC20/utils/SafeERC20Upgradeable.sol     |  6 +--
 .../implementation/contracts/SpokePool.sol         | 54 +++++++++++++++++-----
 .../contracts/interfaces/SpokePoolInterface.sol    | 10 ++++
 .../Ethereum_SpokePool/implementation/meta.txt     |  2 +-
 4 files changed, 57 insertions(+), 15 deletions(-)
```

# Diff at Thu, 21 Sep 2023 12:05:50 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@36d4050a6ee5a543b2163fe6e44153b540b87c16

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
      values.liveness:
-        7200
+        5400
    }
```
