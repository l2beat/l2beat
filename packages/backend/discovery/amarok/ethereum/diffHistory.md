# Diff at Fri, 05 Jan 2024 11:09:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: master@ea50ecee4d08800c3cff3742fc1c8912fc54c16c

## Description

This update is for the Bacco upgrade (https://medium.com/connext/introducing-the-bacco-network-upgrade-73ad19cee9ed).

## Watched changes

```diff
-   Status: DELETED
    contract LineaHubConnector (0x076cD2B25cb1Ed7272d716bdeb4A8551CF606a3D) {
    }
```

```diff
-   Status: DELETED
    contract GnosisHubConnector (0x245F757d660C3ec65416168690431076d58d6413) {
    }
```

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
      values.getOwners.2:
-        "0xaBcC62f573963F0B1aD9334CaEd3f4Acab8d3FEA"
+        "0x450BCD84a040E6975a8092114A09cD37fA140873"
    }
```

```diff
-   Status: DELETED
    contract OptimismHubConnector (0x66a425f09cfd613d40A986B3ef800AA7604C8eeE) {
    }
```

```diff
-   Status: DELETED
    contract WormholeHubConnector (0x69009c6f567590d8B469dbF4C8808e8ee32b8a45) {
    }
```

```diff
-   Status: DELETED
    contract WatcherManager (0x6a595E41893a5ACBA9dBf8288B92eb71106Ba7A6) {
    }
```

```diff
    contract GnosisSafe (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
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
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
      values.RELAYERS[12]:
+        "0xB4F8D176466f5F544bAd53737bffAaeA17185c05"
      values.xAppConnectionManager:
-        "0xF7c4d7dcEc2c09A15f2Db5831d6d25eAEf0a296c"
+        "0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
    }
```

```diff
-   Status: DELETED
    contract PolygonHubConnector (0xB01BC38909413f5dbb8F18a9b5787A62ce1282aE) {
    }
```

```diff
-   Status: DELETED
    contract ArbitrumHubConnector (0xd151C9ef49cE2d30B829a98A07767E3280F70961) {
    }
```

```diff
-   Status: DELETED
    contract RootManager (0xd5d61E9dfb6680Cba8353988Ba0337802811C2e1) {
    }
```

```diff
-   Status: DELETED
    contract MainnetSpokeConnector (0xF7c4d7dcEc2c09A15f2Db5831d6d25eAEf0a296c) {
    }
```

```diff
+   Status: CREATED
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x229047fed2591dbec1eF1118d64F7aF3dB9EB290) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
    }
```

```diff
+   Status: CREATED
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) {
    }
```

```diff
+   Status: CREATED
    contract EternalStorageProxy (0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {
    }
```

```diff
+   Status: CREATED
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD) {
    }
```

```diff
+   Status: CREATED
    contract LineaHubConnector (0x56Ab287e5c33Ee70158c951f34818bd095446255) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x57Bd336d579A51938619271a7Cc137a46D0501B1) {
    }
```

```diff
+   Status: CREATED
    contract OptimismHubConnector (0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x5eF0D09d1E6204141B4d37530808eD19f60FBa35) {
    }
```

```diff
+   Status: CREATED
    contract WatcherManager (0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d) {
    }
```

```diff
+   Status: CREATED
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81) {
    }
```

```diff
+   Status: CREATED
    contract ForeignAMB (0x82B67a43b69914E611710C62e629dAbB2f7AC6AB) {
    }
```

```diff
+   Status: CREATED
    contract ArbitrumHubConnector (0x83096c7455f24E593aaC9A7c73f849d36d3EEb82) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x960953f7c69cd2BC2322Db9223A815C680ccc7ea) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9E40625F52829Cf04bC4839F186D621ee33b0E67) {
    }
```

```diff
+   Status: CREATED
    contract WormholeHubConnector (0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed) {
    }
```

```diff
+   Status: CREATED
    contract ZkEvmV2 (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    }
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xdfe97868233d1aa22e815a266982f2cf17685a27) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xe5896783a2F463446E1f624e64Aa6836BE4C6f58) {
    }
```

```diff
+   Status: CREATED
    contract GnosisHubConnector (0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF5058616517C068C7b8c7EbC69FF636Ade9066d6) {
    }
```

## Source code changes

```diff
.../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../contracts/messaging/connectors/Connector.sol   |   23 +
 .../ArbitrumHubConnector/meta.txt                  |    2 +-
 .../proxy/utils/Initializable.sol                  |   80 +
 .../utils/AddressUpgradeable.sol                   |  195 +++
 .../ethereum/.code/Bridge/implementation/meta.txt  |    2 +
 .../Bridge/implementation/src/bridge/Bridge.sol    |  283 ++++
 .../Bridge/implementation/src/bridge/IBridge.sol   |  115 ++
 .../Bridge/implementation/src/bridge/IOwnable.sol  |   10 +
 .../Bridge/implementation/src/bridge/Messages.sol  |   38 +
 .../src/libraries/DelegateCallAware.sol            |   44 +
 .../Bridge/implementation/src/libraries/Error.sol  |  154 ++
 .../implementation/src/libraries/MessageTypes.sol  |   16 +
 .../Bridge/proxy/interfaces/draft-IERC1822.sol     |   20 +
 .../amarok/ethereum/.code/Bridge/proxy/meta.txt    |    2 +
 .../Bridge/proxy/proxy/ERC1967/ERC1967Proxy.sol    |   33 +
 .../Bridge/proxy/proxy/ERC1967/ERC1967Upgrade.sol  |  185 +++
 .../ethereum/.code/Bridge/proxy/proxy/Proxy.sol    |   86 +
 .../.code/Bridge/proxy/proxy/beacon/IBeacon.sol    |   16 +
 .../transparent/TransparentUpgradeableProxy.sol    |  125 ++
 .../ethereum/.code/Bridge/proxy/utils/Address.sol  |  222 +++
 .../.code/Bridge/proxy/utils/StorageSlot.sol       |   84 +
 .../implementation/bridge/IBridge.sol              |  108 ++
 .../bridge/IDelayedMessageProvider.sol             |   15 +
 .../implementation/bridge/IOwnable.sol             |   10 +
 .../implementation/bridge/ISequencerInbox.sol      |  155 ++
 .../implementation/challenge/ChallengeLib.sol      |  133 ++
 .../implementation/challenge/ChallengeManager.sol  |  363 +++++
 .../implementation/challenge/IChallengeManager.sol |   75 +
 .../challenge/IChallengeResultReceiver.sol         |   13 +
 .../implementation/libraries/Constants.sol         |   10 +
 .../implementation/libraries/DelegateCallAware.sol |   44 +
 .../implementation/libraries/Error.sol             |  151 ++
 .../implementation/libraries/IGasRefunder.sol      |   36 +
 .../.code/ChallengeManager/implementation/meta.txt |    2 +
 .../implementation/osp/IOneStepProofEntry.sol      |   20 +
 .../implementation/osp/IOneStepProver.sol          |   26 +
 .../implementation/state/Deserialize.sol           |  302 ++++
 .../implementation/state/GlobalState.sol           |   51 +
 .../implementation/state/Instructions.sol          |  153 ++
 .../implementation/state/Machine.sol               |   61 +
 .../implementation/state/MerkleProof.sol           |   99 ++
 .../implementation/state/Module.sol                |   33 +
 .../implementation/state/ModuleMemory.sol          |   43 +
 .../implementation/state/StackFrame.sol            |   63 +
 .../implementation/state/Value.sol                 |   64 +
 .../implementation/state/ValueArray.sol            |   47 +
 .../implementation/state/ValueStack.sol            |   39 +
 .../proxy/interfaces/draft-IERC1822.sol            |   20 +
 .../ethereum/.code/ChallengeManager/proxy/meta.txt |    2 +
 .../proxy/proxy/ERC1967/ERC1967Proxy.sol           |   33 +
 .../proxy/proxy/ERC1967/ERC1967Upgrade.sol         |  185 +++
 .../.code/ChallengeManager/proxy/proxy/Proxy.sol   |   86 +
 .../proxy/proxy/beacon/IBeacon.sol                 |   16 +
 .../transparent/TransparentUpgradeableProxy.sol    |  125 ++
 .../.code/ChallengeManager/proxy/utils/Address.sol |  222 +++
 .../ChallengeManager/proxy/utils/StorageSlot.sol   |   84 +
 .../contracts/interfaces/IWormhole.sol             |  142 ++
 .../interfaces/relayer/IDeliveryProviderTyped.sol  |   88 ++
 .../contracts/interfaces/relayer/TypedUnits.sol    |  263 +++
 .../contracts/libraries/external/BytesLib.sol      |  510 ++++++
 .../relayer/deliveryProvider/DeliveryProvider.sol  |  198 +++
 .../deliveryProvider/DeliveryProviderGetters.sol   |   69 +
 .../DeliveryProviderGovernance.sol                 |  356 +++++
 .../DeliveryProviderImplementation.sol             |   28 +
 .../deliveryProvider/DeliveryProviderSetters.sol   |   81 +
 .../deliveryProvider/DeliveryProviderState.sol     |   73 +
 .../deliveryProvider/DeliveryProviderStructs.sol   |  140 ++
 .../contracts/relayer/libraries/BytesParsing.sol   | 1267 +++++++++++++++
 .../relayer/libraries/ExecutionParameters.sol      |   94 ++
 .../implementation/meta.txt                        |    2 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  193 +++
 .../contracts/proxy/beacon/IBeacon.sol             |   15 +
 .../@openzeppelin/contracts/utils/Address.sol      |  216 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   23 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   83 +
 .../deliveryProvider/DeliveryProviderProxy.sol     |   13 +
 .../DeliveryProviderImplementation/proxy/meta.txt  |    2 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  193 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   85 +
 .../contracts/proxy/beacon/IBeacon.sol             |   15 +
 .../@openzeppelin/contracts/utils/Address.sol      |  216 +++
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   83 +
 .../contracts/upgradeability/EternalStorage.sol    |   16 +
 .../upgradeability/EternalStorageProxy.sol         |   13 +
 .../upgradeability/OwnedUpgradeabilityProxy.sol    |   70 +
 .../contracts/upgradeability/Proxy.sol             |   97 ++
 .../upgradeability/UpgradeabilityOwnerStorage.sol  |   26 +
 .../upgradeability/UpgradeabilityProxy.sol         |   38 +
 .../upgradeability/UpgradeabilityStorage.sol       |   30 +
 .../.code/EternalStorageProxy/flattened.sol        |  336 ++++
 .../ethereum/.code/EternalStorageProxy/meta.txt    |    2 +
 .../contracts/AddressUtils.sol                     |   30 +
 .../ForeignAMB/contracts/interfaces/ERC677.sol     |   18 +
 .../contracts/interfaces/IBridgeValidators.sol     |    9 +
 .../interfaces/IUpgradeabilityOwnerStorage.sol     |    7 +
 .../ForeignAMB/contracts/libraries/Address.sol     |   21 +
 .../contracts/libraries/ArbitraryMessage.sol       |   99 ++
 .../.code/ForeignAMB/contracts/libraries/Bytes.sol |   37 +
 .../ForeignAMB/contracts/libraries/Message.sol     |  148 ++
 .../ForeignAMB/contracts/libraries/SafeERC20.sol   |   50 +
 .../contracts/upgradeability/EternalStorage.sol    |   17 +
 .../upgradeable_contracts/BasicBridge.sol          |   62 +
 .../contracts/upgradeable_contracts/Claimable.sol  |   56 +
 .../upgradeable_contracts/DecimalShiftBridge.sol   |   65 +
 .../upgradeable_contracts/Initializable.sol        |   16 +
 .../upgradeable_contracts/InitializableBridge.sol  |   12 +
 .../upgradeable_contracts/MessageRelay.sol         |   14 +
 .../contracts/upgradeable_contracts/Ownable.sol    |   70 +
 .../contracts/upgradeable_contracts/Sacrifice.sol  |    9 +
 .../upgradeable_contracts/Upgradeable.sol          |   13 +
 .../upgradeable_contracts/Validatable.sol          |   23 +
 .../upgradeable_contracts/ValidatorStorage.sol     |    7 +
 .../upgradeable_contracts/VersionableBridge.sol    |   12 +
 .../arbitrary_message/BasicAMB.sol                 |  195 +++
 .../arbitrary_message/BasicForeignAMB.sol          |  131 ++
 .../arbitrary_message/ForeignAMB.sol               |   16 +
 .../arbitrary_message/MessageDelivery.sol          |  127 ++
 .../arbitrary_message/MessageProcessor.sol         |  254 +++
 .../arbitrary_message/VersionableAMB.sol           |   23 +
 .../amarok/ethereum/.code/ForeignAMB/flattened.sol | 1667 ++++++++++++++++++++
 .../amarok/ethereum/.code/ForeignAMB/meta.txt      |    2 +
 .../contracts/AddressUtils.sol                     |   31 +
 .../contracts/math/SafeMath.sol                    |   54 +
 .../contracts/token/ERC20/ERC20.sol                |   24 +
 .../contracts/token/ERC20/ERC20Basic.sol           |   16 +
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../contracts}/messaging/connectors/Connector.sol  |   23 +
 .../contracts}/messaging/connectors/GasCap.sol     |    7 +-
 .../messaging/connectors/HubConnector.sol          |    0
 .../messaging/connectors/gnosis/GnosisBase.sol     |   29 +
 .../connectors/gnosis/GnosisHubConnector.sol       |    0
 .../contracts}/messaging/interfaces/IConnector.sol |    0
 .../messaging/interfaces/IRootManager.sol          |    0
 .../messaging/interfaces/ambs/GnosisAmb.sol        |    0
 .../contracts}/shared/ProposedOwnable.sol          |    0
 .../shared/interfaces/IProposedOwnable.sol         |    0
 .../GnosisHubConnector/meta.txt                    |    2 +-
 .../proxy/utils/Initializable.sol                  |   80 +
 .../security/PausableUpgradeable.sol               |  103 ++
 .../utils/AddressUpgradeable.sol                   |  195 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../ethereum/.code/Inbox/implementation/meta.txt   |    2 +
 .../Inbox/implementation/src/bridge/IBridge.sol    |  115 ++
 .../src/bridge/IDelayedMessageProvider.sol         |   15 +
 .../Inbox/implementation/src/bridge/IInbox.sol     |  193 +++
 .../Inbox/implementation/src/bridge/IOwnable.sol   |   10 +
 .../implementation/src/bridge/ISequencerInbox.sol  |  160 ++
 .../Inbox/implementation/src/bridge/Inbox.sol      |  632 ++++++++
 .../Inbox/implementation/src/bridge/Messages.sol   |   38 +
 .../src/libraries/AddressAliasHelper.sol           |   29 +
 .../implementation/src/libraries/Constants.sol     |   16 +
 .../src/libraries/DelegateCallAware.sol            |   44 +
 .../Inbox/implementation/src/libraries/Error.sol   |  163 ++
 .../implementation/src/libraries/IGasRefunder.sol  |   42 +
 .../implementation/src/libraries/MessageTypes.sol  |   16 +
 .../implementation/src/precompiles/ArbSys.sol      |  150 ++
 .../amarok/ethereum/.code/Inbox/proxy/meta.txt     |    2 +
 .../ethereum/.code/Inbox/proxy/proxy/Proxy.sol     |   83 +
 .../proxy/proxy/TransparentUpgradeableProxy.sol    |  151 ++
 .../.code/Inbox/proxy/proxy/UpgradeableProxy.sol   |   78 +
 .../ethereum/.code/Inbox/proxy/utils/Address.sol   |  189 +++
 .../contracts/L1/L1CrossDomainMessenger.sol        |   67 +
 .../implementation/contracts/L1/L2OutputOracle.sol |  350 ++++
 .../implementation/contracts/L1/OptimismPortal.sol |  507 ++++++
 .../contracts/L1/ResourceMetering.sol              |  186 +++
 .../implementation/contracts/L1/SystemConfig.sol   |  297 ++++
 .../contracts/libraries/Arithmetic.sol             |   48 +
 .../implementation/contracts/libraries/Burn.sol    |   42 +
 .../implementation/contracts/libraries/Bytes.sol   |  142 ++
 .../contracts/libraries/Constants.sol              |   49 +
 .../contracts/libraries/Encoding.sol               |  162 ++
 .../implementation/contracts/libraries/Hashing.sol |  172 ++
 .../contracts/libraries/Predeploys.sol             |  112 ++
 .../contracts/libraries/SafeCall.sol               |  160 ++
 .../implementation/contracts/libraries/Types.sol   |   84 +
 .../contracts/libraries/rlp/RLPReader.sol          |  359 +++++
 .../contracts/libraries/rlp/RLPWriter.sol          |  221 +++
 .../contracts/libraries/trie/MerkleTrie.sol        |  288 ++++
 .../contracts/libraries/trie/SecureMerkleTrie.sol  |   64 +
 .../contracts/universal/CrossDomainMessenger.sol   |  519 ++++++
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../contracts/vendor/AddressAliasHelper.sol        |   43 +
 .../L1CrossDomainMessenger/implementation/meta.txt |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  222 +++
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 +
 .../@openzeppelin/contracts/utils/math/Math.sol    |  226 +++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../access/OwnableUpgradeable.sol                  |   95 ++
 .../proxy/utils/Initializable.sol                  |  138 ++
 .../utils/AddressUpgradeable.sol                   |  195 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../solmate/src/utils/FixedPointMathLib.sol        |  366 +++++
 .../@openzeppelin/contracts/access/Ownable.sol     |   68 +
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../libraries/resolver/Lib_AddressManager.sol      |   95 ++
 .../resolver/Lib_ResolvedDelegateProxy.sol         |   74 +
 .../.code/L1CrossDomainMessenger/proxy/meta.txt    |    2 +
 .../implementation/contracts/L1/L2OutputOracle.sol |  350 ++++
 .../implementation/contracts/libraries/Types.sol   |   84 +
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../.code/L2OutputOracle/implementation/meta.txt   |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  222 +++
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 +
 .../ethereum/.code/L2OutputOracle/proxy/Proxy.sol  |  217 +++
 .../ethereum/.code/L2OutputOracle/proxy/meta.txt   |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   68 +
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../libraries/resolver/Lib_AddressManager.sol      |   95 ++
 .../ethereum/.code/Lib_AddressManager/meta.txt     |    2 +
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../contracts}/messaging/connectors/Connector.sol  |   23 +
 .../messaging/connectors/HubConnector.sol          |    0
 .../messaging/connectors/linea/LineaBase.sol       |    0
 .../connectors/linea/LineaHubConnector.sol         |    0
 .../contracts}/messaging/interfaces/IConnector.sol |    0
 .../messaging/interfaces/IRootManager.sol          |    0
 .../messaging/interfaces/ambs/LineaAmb.sol         |    0
 .../contracts}/shared/ProposedOwnable.sol          |    0
 .../shared/interfaces/IProposedOwnable.sol         |    0
 .../LineaHubConnector/meta.txt                     |    2 +-
 .../contracts/messaging/MerkleTreeManager.sol      |   66 +-
 .../contracts/messaging/WatcherClient.sol          |    4 +-
 .../contracts/messaging/WatcherManager.sol         |    4 +-
 .../contracts/messaging/connectors/Connector.sol   |   23 +
 .../messaging/connectors/SpokeConnector.sol        |  508 ++++--
 .../connectors/mainnet/MainnetSpokeConnector.sol   |   83 +-
 .../messaging/interfaces/IHubSpokeConnector.sol    |    6 +
 .../contracts/messaging/interfaces/IOutbox.sol     |    5 +
 .../contracts/messaging/libraries/SnapshotId.sol   |   25 +
 .../MainnetSpokeConnector/meta.txt                 |    2 +-
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../contracts}/messaging/connectors/Connector.sol  |   23 +
 .../contracts}/messaging/connectors/GasCap.sol     |    7 +-
 .../messaging/connectors/HubConnector.sol          |    0
 .../messaging/connectors/optimism/BaseOptimism.sol |    0
 .../connectors/optimism/OptimismHubConnector.sol   |   14 +-
 .../messaging/connectors/optimism/lib/Types.sol    |    0
 .../contracts}/messaging/interfaces/IConnector.sol |    0
 .../messaging/interfaces/IRootManager.sol          |    0
 .../interfaces/ambs/optimism/IOptimismPortal.sol   |    0
 .../interfaces/ambs/optimism/OptimismAmb.sol       |    0
 .../contracts}/shared/ProposedOwnable.sol          |    0
 .../shared/interfaces/IProposedOwnable.sol         |    0
 .../OptimismHubConnector/meta.txt                  |    2 +-
 .../shared/libraries/TypedMemView.sol => /dev/null |  687 --------
 .../implementation/contracts/L1/L2OutputOracle.sol |  350 ++++
 .../implementation/contracts/L1/OptimismPortal.sol |  507 ++++++
 .../contracts/L1/ResourceMetering.sol              |  186 +++
 .../implementation/contracts/L1/SystemConfig.sol   |  297 ++++
 .../contracts/libraries/Arithmetic.sol             |   48 +
 .../implementation/contracts/libraries/Burn.sol    |   42 +
 .../implementation/contracts/libraries/Bytes.sol   |  142 ++
 .../contracts/libraries/Constants.sol              |   49 +
 .../contracts/libraries/Encoding.sol               |  162 ++
 .../implementation/contracts/libraries/Hashing.sol |  172 ++
 .../contracts/libraries/SafeCall.sol               |  160 ++
 .../implementation/contracts/libraries/Types.sol   |   84 +
 .../contracts/libraries/rlp/RLPReader.sol          |  359 +++++
 .../contracts/libraries/rlp/RLPWriter.sol          |  221 +++
 .../contracts/libraries/trie/MerkleTrie.sol        |  288 ++++
 .../contracts/libraries/trie/SecureMerkleTrie.sol  |   64 +
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../contracts/vendor/AddressAliasHelper.sol        |   43 +
 .../.code/OptimismPortal/implementation/meta.txt   |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  222 +++
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 +
 .../@openzeppelin/contracts/utils/math/Math.sol    |  226 +++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../access/OwnableUpgradeable.sol                  |   95 ++
 .../proxy/utils/Initializable.sol                  |  138 ++
 .../utils/AddressUpgradeable.sol                   |  195 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../solmate/src/utils/FixedPointMathLib.sol        |  366 +++++
 .../ethereum/.code/OptimismPortal/proxy/Proxy.sol  |  217 +++
 .../ethereum/.code/OptimismPortal/proxy/meta.txt   |    2 +
 .../.code/Outbox/implementation/bridge/IBridge.sol |  108 ++
 .../.code/Outbox/implementation/bridge/IOutbox.sol |  120 ++
 .../Outbox/implementation/bridge/IOwnable.sol      |   10 +
 .../.code/Outbox/implementation/bridge/Outbox.sol  |  276 ++++
 .../implementation/libraries/DelegateCallAware.sol |   44 +
 .../Outbox/implementation/libraries/Error.sol      |  151 ++
 .../Outbox/implementation/libraries/MerkleLib.sol  |   57 +
 .../ethereum/.code/Outbox/implementation/meta.txt  |    2 +
 .../Outbox/proxy/interfaces/draft-IERC1822.sol     |   20 +
 .../amarok/ethereum/.code/Outbox/proxy/meta.txt    |    2 +
 .../Outbox/proxy/proxy/ERC1967/ERC1967Proxy.sol    |   33 +
 .../Outbox/proxy/proxy/ERC1967/ERC1967Upgrade.sol  |  185 +++
 .../ethereum/.code/Outbox/proxy/proxy/Proxy.sol    |   86 +
 .../.code/Outbox/proxy/proxy/beacon/IBeacon.sol    |   16 +
 .../transparent/TransparentUpgradeableProxy.sol    |  125 ++
 .../ethereum/.code/Outbox/proxy/utils/Address.sol  |  222 +++
 .../.code/Outbox/proxy/utils/StorageSlot.sol       |   84 +
 .../polygon/PolygonHubConnector.sol => /dev/null   |   65 -
 .../polygon/lib/ExitPayloadReader.sol => /dev/null |  164 --
 .../connectors/polygon/lib/Merkle.sol => /dev/null |   40 -
 .../lib/MerklePatriciaProof.sol => /dev/null       |  153 --
 .../polygon/lib/RLPReader.sol => /dev/null         |  342 ----
 .../tunnel/FxBaseRootTunnel.sol => /dev/null       |  180 ---
 .../PolygonHubConnector/meta.txt => /dev/null      |    2 -
 .../ethereum/.code/ProxyAdmin/access/Ownable.sol   |   83 +
 .../ProxyAdmin/contracts/legacy/AddressManager.sol |   64 +
 .../contracts/legacy/L1ChugSplashProxy.sol         |  289 ++++
 .../.code/ProxyAdmin/contracts/universal/Proxy.sol |  217 +++
 .../ProxyAdmin/contracts/universal/ProxyAdmin.sol  |  254 +++
 .../.code/ProxyAdmin/interfaces/IERC1967.sol       |   26 +
 .../.code/ProxyAdmin/interfaces/draft-IERC1822.sol |   20 +
 .../amarok/ethereum/.code/ProxyAdmin/meta.txt      |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../ProxyAdmin/proxy/ERC1967/ERC1967Proxy.sol      |   32 +
 .../ProxyAdmin/proxy/ERC1967/ERC1967Upgrade.sol    |  171 ++
 .../ethereum/.code/ProxyAdmin/proxy/Proxy.sol      |   86 +
 .../.code/ProxyAdmin/proxy/beacon/BeaconProxy.sol  |   61 +
 .../.code/ProxyAdmin/proxy/beacon/IBeacon.sol      |   16 +
 .../ProxyAdmin/proxy/beacon/UpgradeableBeacon.sol  |   65 +
 .../ProxyAdmin/proxy/transparent/ProxyAdmin.sol    |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 +++
 .../ethereum/.code/ProxyAdmin/utils/Address.sol    |  244 +++
 .../ethereum/.code/ProxyAdmin/utils/Context.sol    |   24 +
 .../.code/ProxyAdmin/utils/StorageSlot.sol         |   88 ++
 .../implementation/bridge/IBridge.sol              |  108 ++
 .../bridge/IDelayedMessageProvider.sol             |   15 +
 .../implementation/bridge/IOwnable.sol             |   10 +
 .../implementation/libraries/DelegateCallAware.sol |   44 +
 .../implementation/libraries/Error.sol             |  151 ++
 .../implementation/libraries/MessageTypes.sol      |   16 +
 .../.code/RollupEventInbox/implementation/meta.txt |    2 +
 .../implementation/rollup/IRollupEventInbox.sol    |   17 +
 .../implementation/rollup/RollupEventInbox.sol     |   42 +
 .../proxy/interfaces/draft-IERC1822.sol            |   20 +
 .../ethereum/.code/RollupEventInbox/proxy/meta.txt |    2 +
 .../proxy/proxy/ERC1967/ERC1967Proxy.sol           |   33 +
 .../proxy/proxy/ERC1967/ERC1967Upgrade.sol         |  185 +++
 .../.code/RollupEventInbox/proxy/proxy/Proxy.sol   |   86 +
 .../proxy/proxy/beacon/IBeacon.sol                 |   16 +
 .../transparent/TransparentUpgradeableProxy.sol    |  125 ++
 .../.code/RollupEventInbox/proxy/utils/Address.sol |  222 +++
 .../RollupEventInbox/proxy/utils/StorageSlot.sol   |   84 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   76 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   33 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  185 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  125 ++
 .../contracts/proxy/utils/UUPSUpgradeable.sol      |   95 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  222 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   84 +
 .../access/OwnableUpgradeable.sol                  |   88 ++
 .../proxy/utils/Initializable.sol                  |   80 +
 .../security/PausableUpgradeable.sol               |  103 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../utils/AddressUpgradeable.sol                   |  195 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../.code/RollupProxy/implementation-1/meta.txt    |    2 +
 .../implementation-1/src/bridge/Bridge.sol         |  283 ++++
 .../implementation-1/src/bridge/IBridge.sol        |  115 ++
 .../src/bridge/IDelayedMessageProvider.sol         |   15 +
 .../implementation-1/src/bridge/IInbox.sol         |  193 +++
 .../implementation-1/src/bridge/IOutbox.sol        |  120 ++
 .../implementation-1/src/bridge/IOwnable.sol       |   10 +
 .../src/bridge/ISequencerInbox.sol                 |  160 ++
 .../implementation-1/src/bridge/Inbox.sol          |  518 ++++++
 .../implementation-1/src/bridge/Messages.sol       |   38 +
 .../implementation-1/src/bridge/Outbox.sol         |  276 ++++
 .../implementation-1/src/bridge/SequencerInbox.sol |  463 ++++++
 .../src/challenge/ChallengeLib.sol                 |  133 ++
 .../src/challenge/ChallengeManager.sol             |  363 +++++
 .../src/challenge/IChallengeManager.sol            |   75 +
 .../src/challenge/IChallengeResultReceiver.sol     |   13 +
 .../src/libraries/AddressAliasHelper.sol           |   29 +
 .../src/libraries/AdminFallbackProxy.sol           |  153 ++
 .../implementation-1/src/libraries/Constants.sol   |   10 +
 .../src/libraries/DelegateCallAware.sol            |   44 +
 .../src/libraries/DoubleLogicUUPSUpgradeable.sol   |   59 +
 .../implementation-1/src/libraries/Error.sol       |  160 ++
 .../src/libraries/IGasRefunder.sol                 |   36 +
 .../implementation-1/src/libraries/MerkleLib.sol   |   57 +
 .../src/libraries/MessageTypes.sol                 |   16 +
 .../src/libraries/UUPSNotUpgradeable.sol           |   56 +
 .../implementation-1/src/mocks/BridgeStub.sol      |  182 +++
 .../src/mocks/ExecutionManager.sol                 |   41 +
 .../implementation-1/src/mocks/InboxStub.sol       |  182 +++
 .../src/mocks/MockResultReceiver.sol               |   59 +
 .../src/mocks/SequencerInboxStub.sol               |   44 +
 .../implementation-1/src/mocks/Simple.sol          |  107 ++
 .../implementation-1/src/mocks/SimpleProxy.sol     |   19 +
 .../src/osp/IOneStepProofEntry.sol                 |   20 +
 .../implementation-1/src/osp/IOneStepProver.sol    |   26 +
 .../implementation-1/src/osp/OneStepProofEntry.sol |  129 ++
 .../implementation-1/src/osp/OneStepProver0.sol    |  494 ++++++
 .../src/osp/OneStepProverHostIo.sol                |  356 +++++
 .../implementation-1/src/osp/OneStepProverMath.sol |  524 ++++++
 .../src/osp/OneStepProverMemory.sol                |  312 ++++
 .../src/precompiles/ArbRetryableTx.sol             |  101 ++
 .../implementation-1/src/precompiles/ArbSys.sol    |  150 ++
 .../implementation-1/src/rollup/BridgeCreator.sol  |  115 ++
 .../implementation-1/src/rollup/IRollupCore.sol    |  178 +++
 .../src/rollup/IRollupEventInbox.sol               |   17 +
 .../implementation-1/src/rollup/IRollupLogic.sol   |  228 +++
 .../implementation-1/src/rollup/Node.sol           |   99 ++
 .../src/rollup/RollupAdminLogic.sol                |  384 +++++
 .../implementation-1/src/rollup/RollupCore.sol     |  641 ++++++++
 .../implementation-1/src/rollup/RollupCreator.sol  |  133 ++
 .../src/rollup/RollupEventInbox.sol                |   42 +
 .../implementation-1/src/rollup/RollupLib.sol      |  151 ++
 .../implementation-1/src/rollup/RollupProxy.sol    |   20 +
 .../src/rollup/RollupUserLogic.sol                 |  743 +++++++++
 .../implementation-1/src/rollup/ValidatorUtils.sol |  242 +++
 .../src/rollup/ValidatorWallet.sol                 |  192 +++
 .../src/rollup/ValidatorWalletCreator.sol          |   48 +
 .../implementation-1/src/state/Deserialize.sol     |  302 ++++
 .../implementation-1/src/state/GlobalState.sol     |   51 +
 .../implementation-1/src/state/Instructions.sol    |  153 ++
 .../implementation-1/src/state/Machine.sol         |   61 +
 .../implementation-1/src/state/MerkleProof.sol     |   99 ++
 .../implementation-1/src/state/Module.sol          |   33 +
 .../implementation-1/src/state/ModuleMemory.sol    |   43 +
 .../implementation-1/src/state/StackFrame.sol      |   63 +
 .../implementation-1/src/state/Value.sol           |   64 +
 .../implementation-1/src/state/ValueArray.sol      |   47 +
 .../implementation-1/src/state/ValueStack.sol      |   39 +
 .../src/test-helpers/BridgeTester.sol              |  239 +++
 .../test-helpers/InterfaceCompatibilityTester.sol  |   11 +
 .../src/test-helpers/MessageTester.sol             |   34 +
 .../src/test-helpers/OutboxWithoutOptTester.sol    |  214 +++
 .../src/test-helpers/ValueArrayTester.sol          |   34 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   76 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   33 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  185 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  125 ++
 .../contracts/proxy/utils/UUPSUpgradeable.sol      |   95 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  222 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   84 +
 .../access/OwnableUpgradeable.sol                  |   88 ++
 .../proxy/utils/Initializable.sol                  |   80 +
 .../security/PausableUpgradeable.sol               |  103 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../utils/AddressUpgradeable.sol                   |  195 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../.code/RollupProxy/implementation-2/meta.txt    |    2 +
 .../implementation-2/src/bridge/Bridge.sol         |  283 ++++
 .../implementation-2/src/bridge/IBridge.sol        |  115 ++
 .../src/bridge/IDelayedMessageProvider.sol         |   15 +
 .../implementation-2/src/bridge/IInbox.sol         |  193 +++
 .../implementation-2/src/bridge/IOutbox.sol        |  120 ++
 .../implementation-2/src/bridge/IOwnable.sol       |   10 +
 .../src/bridge/ISequencerInbox.sol                 |  160 ++
 .../implementation-2/src/bridge/Inbox.sol          |  522 ++++++
 .../implementation-2/src/bridge/Messages.sol       |   38 +
 .../implementation-2/src/bridge/Outbox.sol         |  276 ++++
 .../implementation-2/src/bridge/SequencerInbox.sol |  463 ++++++
 .../src/challenge/ChallengeLib.sol                 |  133 ++
 .../src/challenge/ChallengeManager.sol             |  354 +++++
 .../src/challenge/IChallengeManager.sol            |   73 +
 .../src/challenge/IChallengeResultReceiver.sol     |   13 +
 .../src/libraries/AddressAliasHelper.sol           |   29 +
 .../src/libraries/AdminFallbackProxy.sol           |  153 ++
 .../implementation-2/src/libraries/Constants.sol   |   17 +
 .../src/libraries/DelegateCallAware.sol            |   44 +
 .../src/libraries/DoubleLogicUUPSUpgradeable.sol   |   59 +
 .../implementation-2/src/libraries/Error.sol       |  160 ++
 .../src/libraries/IGasRefunder.sol                 |   42 +
 .../implementation-2/src/libraries/MerkleLib.sol   |   57 +
 .../src/libraries/MessageTypes.sol                 |   16 +
 .../src/libraries/UUPSNotUpgradeable.sol           |   56 +
 .../implementation-2/src/mocks/BridgeStub.sol      |  182 +++
 .../implementation-2/src/mocks/BridgeUnproxied.sol |   17 +
 .../src/mocks/ExecutionManager.sol                 |   41 +
 .../implementation-2/src/mocks/InboxStub.sol       |  182 +++
 .../src/mocks/MockResultReceiver.sol               |   59 +
 .../src/mocks/SequencerInboxStub.sol               |   54 +
 .../implementation-2/src/mocks/Simple.sol          |  107 ++
 .../implementation-2/src/mocks/SimpleProxy.sol     |   19 +
 .../src/osp/IOneStepProofEntry.sol                 |   20 +
 .../implementation-2/src/osp/IOneStepProver.sol    |   26 +
 .../implementation-2/src/osp/OneStepProofEntry.sol |  129 ++
 .../implementation-2/src/osp/OneStepProver0.sol    |  494 ++++++
 .../src/osp/OneStepProverHostIo.sol                |  356 +++++
 .../implementation-2/src/osp/OneStepProverMath.sol |  524 ++++++
 .../src/osp/OneStepProverMemory.sol                |  312 ++++
 .../src/precompiles/ArbRetryableTx.sol             |  101 ++
 .../implementation-2/src/precompiles/ArbSys.sol    |  150 ++
 .../implementation-2/src/rollup/BridgeCreator.sol  |  115 ++
 .../implementation-2/src/rollup/IRollupCore.sol    |  178 +++
 .../src/rollup/IRollupEventInbox.sol               |   17 +
 .../implementation-2/src/rollup/IRollupLogic.sol   |  228 +++
 .../implementation-2/src/rollup/Node.sol           |   99 ++
 .../src/rollup/RollupAdminLogic.sol                |  384 +++++
 .../implementation-2/src/rollup/RollupCore.sol     |  641 ++++++++
 .../implementation-2/src/rollup/RollupCreator.sol  |  133 ++
 .../src/rollup/RollupEventInbox.sol                |   42 +
 .../implementation-2/src/rollup/RollupLib.sol      |  151 ++
 .../implementation-2/src/rollup/RollupProxy.sol    |   20 +
 .../src/rollup/RollupUserLogic.sol                 |  745 +++++++++
 .../implementation-2/src/rollup/ValidatorUtils.sol |  242 +++
 .../src/rollup/ValidatorWallet.sol                 |  192 +++
 .../src/rollup/ValidatorWalletCreator.sol          |   48 +
 .../implementation-2/src/state/Deserialize.sol     |  302 ++++
 .../implementation-2/src/state/GlobalState.sol     |   51 +
 .../implementation-2/src/state/Instructions.sol    |  153 ++
 .../implementation-2/src/state/Machine.sol         |   61 +
 .../implementation-2/src/state/MerkleProof.sol     |   99 ++
 .../implementation-2/src/state/Module.sol          |   33 +
 .../implementation-2/src/state/ModuleMemory.sol    |   43 +
 .../implementation-2/src/state/StackFrame.sol      |   63 +
 .../implementation-2/src/state/Value.sol           |   64 +
 .../implementation-2/src/state/ValueArray.sol      |   47 +
 .../implementation-2/src/state/ValueStack.sol      |   39 +
 .../src/test-helpers/BridgeTester.sol              |  239 +++
 .../test-helpers/InterfaceCompatibilityTester.sol  |   11 +
 .../src/test-helpers/MessageTester.sol             |   34 +
 .../src/test-helpers/OutboxWithoutOptTester.sol    |  214 +++
 .../src/test-helpers/ValueArrayTester.sol          |   34 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   76 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   33 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  185 +++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  125 ++
 .../contracts/proxy/utils/UUPSUpgradeable.sol      |   95 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  222 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   84 +
 .../access/OwnableUpgradeable.sol                  |   88 ++
 .../proxy/utils/Initializable.sol                  |   80 +
 .../security/PausableUpgradeable.sol               |  103 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../utils/AddressUpgradeable.sol                   |  195 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../ethereum/.code/RollupProxy/proxy/meta.txt      |    2 +
 .../.code/RollupProxy/proxy/src/bridge/Bridge.sol  |  263 +++
 .../.code/RollupProxy/proxy/src/bridge/IBridge.sol |  108 ++
 .../proxy/src/bridge/IDelayedMessageProvider.sol   |   15 +
 .../.code/RollupProxy/proxy/src/bridge/IInbox.sol  |  153 ++
 .../.code/RollupProxy/proxy/src/bridge/IOutbox.sol |  120 ++
 .../RollupProxy/proxy/src/bridge/IOwnable.sol      |   10 +
 .../proxy/src/bridge/ISequencerInbox.sol           |  155 ++
 .../.code/RollupProxy/proxy/src/bridge/Inbox.sol   |  431 +++++
 .../RollupProxy/proxy/src/bridge/Messages.sol      |   38 +
 .../.code/RollupProxy/proxy/src/bridge/Outbox.sol  |  276 ++++
 .../proxy/src/bridge/SequencerInbox.sol            |  365 +++++
 .../proxy/src/challenge/ChallengeLib.sol           |  133 ++
 .../proxy/src/challenge/ChallengeManager.sol       |  363 +++++
 .../proxy/src/challenge/IChallengeManager.sol      |   75 +
 .../src/challenge/IChallengeResultReceiver.sol     |   13 +
 .../proxy/src/libraries/AddressAliasHelper.sol     |   29 +
 .../proxy/src/libraries/AdminFallbackProxy.sol     |  153 ++
 .../RollupProxy/proxy/src/libraries/Constants.sol  |   10 +
 .../proxy/src/libraries/DelegateCallAware.sol      |   44 +
 .../src/libraries/DoubleLogicUUPSUpgradeable.sol   |   59 +
 .../RollupProxy/proxy/src/libraries/Error.sol      |  151 ++
 .../proxy/src/libraries/IGasRefunder.sol           |   36 +
 .../RollupProxy/proxy/src/libraries/MerkleLib.sol  |   57 +
 .../proxy/src/libraries/MessageTypes.sol           |   16 +
 .../proxy/src/libraries/UUPSNotUpgradeable.sol     |   56 +
 .../RollupProxy/proxy/src/mocks/BridgeStub.sol     |  167 ++
 .../proxy/src/mocks/ExecutionManager.sol           |   41 +
 .../RollupProxy/proxy/src/mocks/InboxStub.sol      |  151 ++
 .../proxy/src/mocks/MockResultReceiver.sol         |   59 +
 .../proxy/src/mocks/SequencerInboxStub.sol         |   44 +
 .../RollupProxy/proxy/src/mocks/SimpleProxy.sol    |   19 +
 .../proxy/src/osp/IOneStepProofEntry.sol           |   20 +
 .../RollupProxy/proxy/src/osp/IOneStepProver.sol   |   26 +
 .../proxy/src/osp/OneStepProofEntry.sol            |  129 ++
 .../RollupProxy/proxy/src/osp/OneStepProver0.sol   |  494 ++++++
 .../proxy/src/osp/OneStepProverHostIo.sol          |  356 +++++
 .../proxy/src/osp/OneStepProverMath.sol            |  524 ++++++
 .../proxy/src/osp/OneStepProverMemory.sol          |  312 ++++
 .../RollupProxy/proxy/src/rollup/BridgeCreator.sol |  115 ++
 .../RollupProxy/proxy/src/rollup/IRollupCore.sol   |  176 +++
 .../proxy/src/rollup/IRollupEventInbox.sol         |   17 +
 .../RollupProxy/proxy/src/rollup/IRollupLogic.sol  |  218 +++
 .../.code/RollupProxy/proxy/src/rollup/Node.sol    |   99 ++
 .../proxy/src/rollup/RollupAdminLogic.sol          |  368 +++++
 .../RollupProxy/proxy/src/rollup/RollupCore.sol    |  639 ++++++++
 .../RollupProxy/proxy/src/rollup/RollupCreator.sol |  133 ++
 .../proxy/src/rollup/RollupEventInbox.sol          |   42 +
 .../RollupProxy/proxy/src/rollup/RollupLib.sol     |  151 ++
 .../RollupProxy/proxy/src/rollup/RollupProxy.sol   |   20 +
 .../proxy/src/rollup/RollupUserLogic.sol           |  710 +++++++++
 .../proxy/src/rollup/ValidatorUtils.sol            |  242 +++
 .../proxy/src/rollup/ValidatorWallet.sol           |  192 +++
 .../proxy/src/rollup/ValidatorWalletCreator.sol    |   48 +
 .../RollupProxy/proxy/src/state/Deserialize.sol    |  302 ++++
 .../RollupProxy/proxy/src/state/GlobalState.sol    |   51 +
 .../RollupProxy/proxy/src/state/Instructions.sol   |  153 ++
 .../.code/RollupProxy/proxy/src/state/Machine.sol  |   61 +
 .../RollupProxy/proxy/src/state/MerkleProof.sol    |   99 ++
 .../.code/RollupProxy/proxy/src/state/Module.sol   |   33 +
 .../RollupProxy/proxy/src/state/ModuleMemory.sol   |   43 +
 .../RollupProxy/proxy/src/state/StackFrame.sol     |   63 +
 .../.code/RollupProxy/proxy/src/state/Value.sol    |   64 +
 .../RollupProxy/proxy/src/state/ValueArray.sol     |   47 +
 .../RollupProxy/proxy/src/state/ValueStack.sol     |   39 +
 .../proxy/src/test-helpers/BridgeTester.sol        |  233 +++
 .../test-helpers/InterfaceCompatibilityTester.sol  |   11 +
 .../proxy/src/test-helpers/MessageTester.sol       |   34 +
 .../src/test-helpers/OutboxWithoutOptTester.sol    |  214 +++
 .../proxy/src/test-helpers/ValueArrayTester.sol    |   34 +
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../contracts/messaging/MerkleTreeManager.sol      |   66 +-
 .../contracts/messaging/RootManager.sol            |  487 +++++-
 .../contracts/messaging/WatcherClient.sol          |    4 +-
 .../contracts/messaging/WatcherManager.sol         |    4 +-
 .../messaging/interfaces/IHubSpokeConnector.sol    |    6 +
 .../contracts/messaging/libraries/Queue.sol        |    8 +-
 .../contracts/messaging/libraries/SnapshotId.sol   |   25 +
 .../{.code@18620064 => .code}/RootManager/meta.txt |    2 +-
 .../implementation/bridge/IBridge.sol              |  115 ++
 .../bridge/IDelayedMessageProvider.sol             |   15 +
 .../implementation/bridge/IInbox.sol               |  193 +++
 .../implementation/bridge/IOutbox.sol              |  120 ++
 .../implementation/bridge/IOwnable.sol             |   10 +
 .../implementation/bridge/ISequencerInbox.sol      |  160 ++
 .../implementation/bridge/Messages.sol             |   38 +
 .../implementation/bridge/SequencerInbox.sol       |  463 ++++++
 .../implementation/challenge/ChallengeLib.sol      |  133 ++
 .../implementation/challenge/IChallengeManager.sol |   73 +
 .../challenge/IChallengeResultReceiver.sol         |   13 +
 .../implementation/libraries/Constants.sol         |   13 +
 .../implementation/libraries/DelegateCallAware.sol |   44 +
 .../implementation/libraries/Error.sol             |  160 ++
 .../implementation/libraries/IGasRefunder.sol      |   42 +
 .../implementation/libraries/MessageTypes.sol      |   16 +
 .../.code/SequencerInbox/implementation/meta.txt   |    2 +
 .../implementation/osp/IOneStepProofEntry.sol      |   20 +
 .../implementation/osp/IOneStepProver.sol          |   26 +
 .../implementation/rollup/IRollupCore.sol          |  178 +++
 .../implementation/rollup/IRollupEventInbox.sol    |   17 +
 .../implementation/rollup/IRollupLogic.sol         |  228 +++
 .../SequencerInbox/implementation/rollup/Node.sol  |   99 ++
 .../implementation/rollup/RollupLib.sol            |  151 ++
 .../implementation/state/Deserialize.sol           |  302 ++++
 .../implementation/state/GlobalState.sol           |   51 +
 .../implementation/state/Instructions.sol          |  153 ++
 .../implementation/state/Machine.sol               |   61 +
 .../implementation/state/MerkleProof.sol           |   99 ++
 .../SequencerInbox/implementation/state/Module.sol |   33 +
 .../implementation/state/ModuleMemory.sol          |   43 +
 .../implementation/state/StackFrame.sol            |   63 +
 .../SequencerInbox/implementation/state/Value.sol  |   64 +
 .../implementation/state/ValueArray.sol            |   47 +
 .../implementation/state/ValueStack.sol            |   39 +
 .../proxy/interfaces/draft-IERC1822.sol            |   20 +
 .../ethereum/.code/SequencerInbox/proxy/meta.txt   |    2 +
 .../proxy/proxy/ERC1967/ERC1967Proxy.sol           |   33 +
 .../proxy/proxy/ERC1967/ERC1967Upgrade.sol         |  185 +++
 .../.code/SequencerInbox/proxy/proxy/Proxy.sol     |   86 +
 .../SequencerInbox/proxy/proxy/beacon/IBeacon.sol  |   16 +
 .../transparent/TransparentUpgradeableProxy.sol    |  125 ++
 .../.code/SequencerInbox/proxy/utils/Address.sol   |  222 +++
 .../SequencerInbox/proxy/utils/StorageSlot.sol     |   84 +
 .../contracts/L1/ResourceMetering.sol              |  186 +++
 .../implementation/contracts/L1/SystemConfig.sol   |  297 ++++
 .../contracts/libraries/Arithmetic.sol             |   48 +
 .../implementation/contracts/libraries/Burn.sol    |   42 +
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../.code/SystemConfig/implementation/meta.txt     |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  222 +++
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 +
 .../@openzeppelin/contracts/utils/math/Math.sol    |  226 +++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../access/OwnableUpgradeable.sol                  |   95 ++
 .../proxy/utils/Initializable.sol                  |  138 ++
 .../utils/AddressUpgradeable.sol                   |  195 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../solmate/src/utils/FixedPointMathLib.sol        |  366 +++++
 .../ethereum/.code/SystemConfig/proxy/Proxy.sol    |  217 +++
 .../ethereum/.code/SystemConfig/proxy/meta.txt     |    2 +
 .../.code/UpgradeExecutor/implementation/meta.txt  |    2 +
 .../contracts/security/ReentrancyGuard.sol         |   63 +
 .../@openzeppelin/contracts/utils/Address.sol      |  222 +++
 .../access/AccessControlUpgradeable.sol            |  260 +++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  138 ++
 .../utils/AddressUpgradeable.sol                   |  195 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   75 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../implementation/src/UpgradeExecutor.sol         |   60 +
 .../proxy/interfaces/draft-IERC1822.sol            |   20 +
 .../ethereum/.code/UpgradeExecutor/proxy/meta.txt  |    2 +
 .../proxy/proxy/ERC1967/ERC1967Proxy.sol           |   32 +
 .../proxy/proxy/ERC1967/ERC1967Upgrade.sol         |  185 +++
 .../.code/UpgradeExecutor/proxy/proxy/Proxy.sol    |   86 +
 .../UpgradeExecutor/proxy/proxy/beacon/IBeacon.sol |   16 +
 .../transparent/TransparentUpgradeableProxy.sol    |  124 ++
 .../.code/UpgradeExecutor/proxy/utils/Address.sol  |  222 +++
 .../UpgradeExecutor/proxy/utils/StorageSlot.sol    |   88 ++
 .../@openzeppelin/contracts/access/Ownable.sol     |   76 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   33 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  185 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  125 ++
 .../contracts/proxy/utils/UUPSUpgradeable.sol      |   95 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  222 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   84 +
 .../access/OwnableUpgradeable.sol                  |   88 ++
 .../proxy/utils/Initializable.sol                  |   80 +
 .../security/PausableUpgradeable.sol               |  103 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../utils/AddressUpgradeable.sol                   |  195 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../amarok/ethereum/.code/ValidatorUtils/meta.txt  |    2 +
 .../.code/ValidatorUtils/src/bridge/Bridge.sol     |  263 +++
 .../.code/ValidatorUtils/src/bridge/IBridge.sol    |  108 ++
 .../src/bridge/IDelayedMessageProvider.sol         |   15 +
 .../.code/ValidatorUtils/src/bridge/IInbox.sol     |  153 ++
 .../.code/ValidatorUtils/src/bridge/IOutbox.sol    |  120 ++
 .../.code/ValidatorUtils/src/bridge/IOwnable.sol   |   10 +
 .../ValidatorUtils/src/bridge/ISequencerInbox.sol  |  155 ++
 .../.code/ValidatorUtils/src/bridge/Inbox.sol      |  431 +++++
 .../.code/ValidatorUtils/src/bridge/Messages.sol   |   38 +
 .../.code/ValidatorUtils/src/bridge/Outbox.sol     |  276 ++++
 .../ValidatorUtils/src/bridge/SequencerInbox.sol   |  365 +++++
 .../ValidatorUtils/src/challenge/ChallengeLib.sol  |  133 ++
 .../src/challenge/ChallengeManager.sol             |  363 +++++
 .../src/challenge/IChallengeManager.sol            |   75 +
 .../src/challenge/IChallengeResultReceiver.sol     |   13 +
 .../src/libraries/AddressAliasHelper.sol           |   29 +
 .../src/libraries/AdminFallbackProxy.sol           |  153 ++
 .../ValidatorUtils/src/libraries/Constants.sol     |   10 +
 .../src/libraries/DelegateCallAware.sol            |   44 +
 .../src/libraries/DoubleLogicUUPSUpgradeable.sol   |   59 +
 .../.code/ValidatorUtils/src/libraries/Error.sol   |  151 ++
 .../ValidatorUtils/src/libraries/IGasRefunder.sol  |   36 +
 .../ValidatorUtils/src/libraries/MerkleLib.sol     |   57 +
 .../ValidatorUtils/src/libraries/MessageTypes.sol  |   16 +
 .../src/libraries/UUPSNotUpgradeable.sol           |   56 +
 .../.code/ValidatorUtils/src/mocks/BridgeStub.sol  |  167 ++
 .../ValidatorUtils/src/mocks/ExecutionManager.sol  |   41 +
 .../.code/ValidatorUtils/src/mocks/InboxStub.sol   |  151 ++
 .../src/mocks/MockResultReceiver.sol               |   59 +
 .../src/mocks/SequencerInboxStub.sol               |   44 +
 .../.code/ValidatorUtils/src/mocks/SimpleProxy.sol |   19 +
 .../ValidatorUtils/src/osp/IOneStepProofEntry.sol  |   20 +
 .../ValidatorUtils/src/osp/IOneStepProver.sol      |   26 +
 .../ValidatorUtils/src/osp/OneStepProofEntry.sol   |  129 ++
 .../ValidatorUtils/src/osp/OneStepProver0.sol      |  494 ++++++
 .../ValidatorUtils/src/osp/OneStepProverHostIo.sol |  356 +++++
 .../ValidatorUtils/src/osp/OneStepProverMath.sol   |  524 ++++++
 .../ValidatorUtils/src/osp/OneStepProverMemory.sol |  312 ++++
 .../ValidatorUtils/src/rollup/BridgeCreator.sol    |  115 ++
 .../ValidatorUtils/src/rollup/IRollupCore.sol      |  176 +++
 .../src/rollup/IRollupEventInbox.sol               |   17 +
 .../ValidatorUtils/src/rollup/IRollupLogic.sol     |  218 +++
 .../.code/ValidatorUtils/src/rollup/Node.sol       |   99 ++
 .../ValidatorUtils/src/rollup/RollupAdminLogic.sol |  368 +++++
 .../.code/ValidatorUtils/src/rollup/RollupCore.sol |  639 ++++++++
 .../ValidatorUtils/src/rollup/RollupCreator.sol    |  133 ++
 .../ValidatorUtils/src/rollup/RollupEventInbox.sol |   42 +
 .../.code/ValidatorUtils/src/rollup/RollupLib.sol  |  151 ++
 .../ValidatorUtils/src/rollup/RollupProxy.sol      |   20 +
 .../ValidatorUtils/src/rollup/RollupUserLogic.sol  |  710 +++++++++
 .../ValidatorUtils/src/rollup/ValidatorUtils.sol   |  242 +++
 .../ValidatorUtils/src/rollup/ValidatorWallet.sol  |  192 +++
 .../src/rollup/ValidatorWalletCreator.sol          |   48 +
 .../.code/ValidatorUtils/src/state/Deserialize.sol |  302 ++++
 .../.code/ValidatorUtils/src/state/GlobalState.sol |   51 +
 .../ValidatorUtils/src/state/Instructions.sol      |  153 ++
 .../.code/ValidatorUtils/src/state/Machine.sol     |   61 +
 .../.code/ValidatorUtils/src/state/MerkleProof.sol |   99 ++
 .../.code/ValidatorUtils/src/state/Module.sol      |   33 +
 .../ValidatorUtils/src/state/ModuleMemory.sol      |   43 +
 .../.code/ValidatorUtils/src/state/StackFrame.sol  |   63 +
 .../.code/ValidatorUtils/src/state/Value.sol       |   64 +
 .../.code/ValidatorUtils/src/state/ValueArray.sol  |   47 +
 .../.code/ValidatorUtils/src/state/ValueStack.sol  |   39 +
 .../src/test-helpers/BridgeTester.sol              |  233 +++
 .../test-helpers/InterfaceCompatibilityTester.sol  |   11 +
 .../src/test-helpers/MessageTester.sol             |   34 +
 .../src/test-helpers/OutboxWithoutOptTester.sol    |  214 +++
 .../src/test-helpers/ValueArrayTester.sol          |   34 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   76 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   33 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  185 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  125 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  222 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   84 +
 .../access/OwnableUpgradeable.sol                  |   88 ++
 .../proxy/utils/Initializable.sol                  |   80 +
 .../utils/AddressUpgradeable.sol                   |  195 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../ethereum/.code/ValidatorWalletCreator/meta.txt |    2 +
 .../ValidatorWalletCreator/src/bridge/IBridge.sol  |  108 ++
 .../src/bridge/IDelayedMessageProvider.sol         |   15 +
 .../ValidatorWalletCreator/src/bridge/IOwnable.sol |   10 +
 .../src/bridge/ISequencerInbox.sol                 |  155 ++
 .../src/challenge/ChallengeLib.sol                 |  133 ++
 .../src/challenge/IChallengeManager.sol            |   75 +
 .../src/challenge/IChallengeResultReceiver.sol     |   13 +
 .../src/libraries/DelegateCallAware.sol            |   44 +
 .../ValidatorWalletCreator/src/libraries/Error.sol |  151 ++
 .../src/libraries/IGasRefunder.sol                 |   36 +
 .../src/osp/IOneStepProofEntry.sol                 |   20 +
 .../src/osp/IOneStepProver.sol                     |   26 +
 .../src/rollup/ValidatorWallet.sol                 |  192 +++
 .../src/rollup/ValidatorWalletCreator.sol          |   48 +
 .../src/state/Deserialize.sol                      |  302 ++++
 .../src/state/GlobalState.sol                      |   51 +
 .../src/state/Instructions.sol                     |  153 ++
 .../ValidatorWalletCreator/src/state/Machine.sol   |   61 +
 .../src/state/MerkleProof.sol                      |   99 ++
 .../ValidatorWalletCreator/src/state/Module.sol    |   33 +
 .../src/state/ModuleMemory.sol                     |   43 +
 .../src/state/StackFrame.sol                       |   63 +
 .../ValidatorWalletCreator/src/state/Value.sol     |   64 +
 .../src/state/ValueArray.sol                       |   47 +
 .../src/state/ValueStack.sol                       |   39 +
 .../WatcherManager/messaging/WatcherManager.sol    |    4 +-
 .../WatcherManager/meta.txt                        |    2 +-
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../contracts}/messaging/connectors/Connector.sol  |   23 +
 .../contracts}/messaging/connectors/GasCap.sol     |    7 +-
 .../messaging/connectors/HubConnector.sol          |    0
 .../messaging/connectors/wormhole/BaseWormhole.sol |    0
 .../connectors/wormhole/WormholeHubConnector.sol   |    0
 .../contracts}/messaging/interfaces/IConnector.sol |    0
 .../messaging/interfaces/IRootManager.sol          |    0
 .../interfaces/ambs/wormhole/IWormholeReceiver.sol |    0
 .../interfaces/ambs/wormhole/IWormholeRelayer.sol  |    0
 .../contracts}/shared/ProposedOwnable.sol          |    0
 .../shared/interfaces/IProposedOwnable.sol         |    0
 .../connectors/Connector.sol => /dev/null          |  193 ---
 .../connectors/HubConnector.sol => /dev/null       |   44 -
 .../interfaces/IConnector.sol => /dev/null         |   64 -
 .../interfaces/IRootManager.sol => /dev/null       |   22 -
 .../WormholeHubConnector/meta.txt                  |    2 +-
 .../shared/ProposedOwnable.sol => /dev/null        |  172 --
 .../interfaces/IProposedOwnable.sol => /dev/null   |   42 -
 .../contracts/interfaces/IWormhole.sol             |  142 ++
 .../interfaces/relayer/IDeliveryProviderTyped.sol  |   88 ++
 .../interfaces/relayer/IWormholeReceiver.sol       |   49 +
 .../interfaces/relayer/IWormholeRelayerTyped.sol   |  645 ++++++++
 .../contracts/interfaces/relayer/TypedUnits.sol    |  263 +++
 .../contracts/relayer/libraries/BytesParsing.sol   | 1267 +++++++++++++++
 .../relayer/libraries/ExecutionParameters.sol      |   94 ++
 .../relayer/libraries/RelayerInternalStructs.sol   |   66 +
 .../contracts/relayer/libraries/Utils.sol          |  116 ++
 .../relayer/wormholeRelayer/WormholeRelayer.sol    |   34 +
 .../wormholeRelayer/WormholeRelayerBase.sol        |  148 ++
 .../wormholeRelayer/WormholeRelayerDelivery.sol    |  551 +++++++
 .../wormholeRelayer/WormholeRelayerGovernance.sol  |  248 +++
 .../wormholeRelayer/WormholeRelayerSend.sol        |  567 +++++++
 .../wormholeRelayer/WormholeRelayerSerde.sol       |  283 ++++
 .../wormholeRelayer/WormholeRelayerStorage.sol     |  126 ++
 .../.code/WormholeRelayer/implementation/meta.txt  |    2 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  193 +++
 .../contracts/proxy/beacon/IBeacon.sol             |   15 +
 .../@openzeppelin/contracts/utils/Address.sol      |  216 +++
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   83 +
 .../relayer/create2Factory/Create2Factory.sol      |   79 +
 .../ethereum/.code/WormholeRelayer/proxy/meta.txt  |    2 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  193 +++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   85 +
 .../contracts/proxy/beacon/IBeacon.sol             |   15 +
 .../@openzeppelin/contracts/utils/Address.sol      |  216 +++
 .../@openzeppelin/contracts/utils/Create2.sol      |   64 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   83 +
 .../access/AccessControlUpgradeable.sol            |  261 +++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../proxy/utils/Initializable.sol                  |  166 ++
 .../security/ReentrancyGuardUpgradeable.sol        |   89 ++
 .../utils/AddressUpgradeable.sol                   |  244 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   85 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 ++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../ZkEvmV2/implementation/contracts/ZkEvmV2.sol   |  319 ++++
 .../contracts/interfaces/IGenericErrors.sol        |    9 +
 .../contracts/interfaces/IL1MessageManager.sol     |   34 +
 .../contracts/interfaces/IMessageService.sol       |   85 +
 .../contracts/interfaces/IPauseManager.sol         |   24 +
 .../contracts/interfaces/IPlonkVerifier.sol        |   15 +
 .../contracts/interfaces/IRateLimiter.sol          |   46 +
 .../contracts/interfaces/IZkEvmV2.sol              |   97 ++
 .../messageService/l1/L1MessageManager.sol         |   99 ++
 .../messageService/l1/L1MessageService.sol         |  220 +++
 .../contracts/messageService/lib/Codec.sol         |   26 +
 .../contracts/messageService/lib/PauseManager.sol  |   88 ++
 .../contracts/messageService/lib/RateLimiter.sol   |  113 ++
 .../contracts/messageService/lib/Rlp.sol           |  318 ++++
 .../messageService/lib/TransactionDecoder.sol      |   93 ++
 .../ethereum/.code/ZkEvmV2/implementation/meta.txt |    2 +
 .../.code/ZkEvmV2/proxy/access/Ownable.sol         |   83 +
 .../.code/ZkEvmV2/proxy/interfaces/IERC1967.sol    |   26 +
 .../ZkEvmV2/proxy/interfaces/draft-IERC1822.sol    |   20 +
 .../amarok/ethereum/.code/ZkEvmV2/proxy/meta.txt   |    2 +
 .../ZkEvmV2/proxy/proxy/ERC1967/ERC1967Proxy.sol   |   32 +
 .../ZkEvmV2/proxy/proxy/ERC1967/ERC1967Upgrade.sol |  171 ++
 .../ethereum/.code/ZkEvmV2/proxy/proxy/Proxy.sol   |   86 +
 .../ZkEvmV2/proxy/proxy/beacon/BeaconProxy.sol     |   61 +
 .../.code/ZkEvmV2/proxy/proxy/beacon/IBeacon.sol   |   16 +
 .../proxy/proxy/beacon/UpgradeableBeacon.sol       |   65 +
 .../ZkEvmV2/proxy/proxy/transparent/ProxyAdmin.sol |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 +++
 .../ethereum/.code/ZkEvmV2/proxy/utils/Address.sol |  244 +++
 .../ethereum/.code/ZkEvmV2/proxy/utils/Context.sol |   24 +
 .../.code/ZkEvmV2/proxy/utils/StorageSlot.sol      |   88 ++
 932 files changed, 105996 insertions(+), 2365 deletions(-)
```

# Diff at Tue, 21 Nov 2023 12:24:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@9f0318505c4ed8d37a7f843ad157191e2e5c6ee2

## Description

Added connector for Linea.

## Watched changes

```diff
    contract RootManager (0xd5d61E9dfb6680Cba8353988Ba0337802811C2e1) {
      values.connectors[6]:
+        "0x076cD2B25cb1Ed7272d716bdeb4A8551CF606a3D"
      values.connectorsHash:
-        "0x1ab775b9545e9c3175b57958dc75c2a1cf76c3d166d0527bbf7d51fe434efa00"
+        "0x9e95f76ad984f886dd7a8431e8fa5c405fce573b4b2a4671aeb68d7464ab164b"
    }
```

```diff
+   Status: CREATED
    contract LineaHubConnector (0x076cD2B25cb1Ed7272d716bdeb4A8551CF606a3D) {
    }
```

## Source code changes

```diff
.../messaging/connectors/Connector.sol             | 193 +++++++++++++++++++++
 .../messaging/connectors/HubConnector.sol          |  44 +++++
 .../messaging/connectors/linea/LineaBase.sol       |  16 ++
 .../connectors/linea/LineaHubConnector.sol         |  73 ++++++++
 .../messaging/interfaces/IConnector.sol            |  64 +++++++
 .../messaging/interfaces/IRootManager.sol          |  22 +++
 .../messaging/interfaces/ambs/LineaAmb.sol         |  88 ++++++++++
 .../ethereum/.code/LineaHubConnector/meta.txt      |   2 +
 .../LineaHubConnector/shared/ProposedOwnable.sol   | 172 ++++++++++++++++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 +++++
 10 files changed, 716 insertions(+)
```

# Diff at Tue, 07 Nov 2023 11:21:30 GMT:

- author: Amin Latifi (<a.latifi.al@gmail.com>)
- comparing to: master@bcbd5d376f2f1df169f0ac5ce430862eef6be17f

## Description

There are changes in the owners of Connext Multisig and WormholeHubConnector contracts.

## Watched changes

```diff
-   Status: DELETED
    contract Connext Multisig Member (0x278F956cde8D0816786A83Aea58dc7F76c13AD8e) {
    }
```

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
      values.getOwners[14]:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
      values.getOwners[13]:
-        "0x48fda6a16dEe5954bb0989b5B581d0623b48F06A"
      values.getOwners[12]:
-        "0xf8d8aF083aC452b05b0D2eb4499AD900324b5754"
      values.getOwners.11:
-        "0x3d7dF98257E5CEe5f032fd06a0aA510F89A19A2e"
+        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
      values.getOwners.10:
-        "0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
+        "0xf8d8aF083aC452b05b0D2eb4499AD900324b5754"
      values.getOwners.0:
-        "0x278F956cde8D0816786A83Aea58dc7F76c13AD8e"
+        "0xdFa28361aC40679cC5D8EFa74c0421961397f2Eb"
    }
```

```diff
    contract WormholeHubConnector (0x69009c6f567590d8B469dbF4C8808e8ee32b8a45) {
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
    }
```

## Source code changes

```diff
Error with git diff: warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Connext Multisig/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/Connext Multisig/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Connext Multisig 2/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/Connext Multisig 2/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Finder/Finder.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/Finder/Finder.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/GnosisSafe/proxy/Proxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/GnosisSafe/proxy/Proxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/VotingToken/VotingToken.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/VotingToken/VotingToken.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Connext Multisig Member/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it

```

# Diff at Mon, 02 Oct 2023 13:31:00 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract Connext Multisig 2 (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378) {
      values.getThreshold:
-        1
+        3
    }
```
