# Diff at Fri, 05 Jan 2024 13:32:55 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: master@9b1911b38ffdc811ae8c1518aae762bfe4831370 block: 18671199
- current block number: 18941390

## Description

Removed the INBOUND_PROOF_LIBRARIES for a more detailed field.

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18671199 (main branch discovery), not current.

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.INBOUND_PROOF_LIBRARIES:
-        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
    }
```

```diff
-   Status: DELETED
    contract Stargate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    }
```

```diff
-   Status: DELETED
    contract StargateToken (0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6) {
    }
```

```diff
+   Status: CREATED
    contract FPValidator (0x07245eEa05826F5984c7c3C8F478b04892e4df89) {
    }
```

```diff
+   Status: CREATED
    contract MPTValidator01 (0x462F7eC57C6492B983a8C8322B4369a7f149B859) {
    }
```

# Diff at Tue, 28 Nov 2023 16:07:09 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: master@049dc0679d8762dc52199c99e9e62ba7cb396a7b

## Description

New remote chains added: 217, 218, 230. One of the owners in the Stargate Multisig has changed.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap.217:
+        20
      values.chainAddressSizeMap.218:
+        20
      values.chainAddressSizeMap.230:
+        20
      values.defaultAdapterParams.217:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.218:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.230:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.217:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.218:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.230:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.inboundProofLibrary.217:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.218:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.230:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.supportedOutboundProof.217:
+        [1,2]
      values.supportedOutboundProof.218:
+        [1,2]
      values.supportedOutboundProof.230:
+        2
      values.ulnLookup.217:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.218:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.230:
+        "0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981"
    }
```

```diff
    contract Stargate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
      values.getOwners.2:
-        "0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1"
+        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
      values.getOwners.1:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
      values.getOwners.0:
-        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
+        "0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
    }
```

# Diff at Tue, 07 Nov 2023 10:45:37 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: master@1272f95e37268203d1aa19a319b3dff48af9c73c

## Description

### Changes to config

Added a `relayer` field in `defaultAppConfig` in `UltraLightNodeV2`. Added several new remote chains.

### Changes on contracts

New Oracle has been added. Several new remote chains have been added. Default oracle for some remote chains has been changed to the new oracle.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap.148:
+        20
      values.chainAddressSizeMap.182:
+        20
      values.chainAddressSizeMap.210:
+        20
      values.chainAddressSizeMap.211:
+        20
      values.chainAddressSizeMap.212:
+        20
      values.chainAddressSizeMap.213:
+        20
      values.chainAddressSizeMap.214:
+        20
      values.chainAddressSizeMap.215:
+        20
      values.chainAddressSizeMap.216:
+        20
      values.defaultAdapterParams.148:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.182:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.210:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.211:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.212:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.213:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.214:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.215:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.216:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.101.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.102.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.106.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.109.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.110.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.111.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.112.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.116.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.125.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.126.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.145.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.175.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.183.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.184.oracle:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.148:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.182:
+        {"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.210:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.211:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.212:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.213:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.214:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.215:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.defaultAppConfig.216:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":15,"oracle":"0x5a54fe5234E811466D5366846283323c954310B2","relayer":"0x902F09715B6303d4173037652FA7377e5b98089E"}
      values.inboundProofLibrary.148:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.182:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.210:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.211:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.212:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.213:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.214:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.215:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.inboundProofLibrary.216:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x07245eEa05826F5984c7c3C8F478b04892e4df89"]
      values.supportedOutboundProof.148:
+        2
      values.supportedOutboundProof.182:
+        2
      values.supportedOutboundProof.210:
+        [1,2]
      values.supportedOutboundProof.211:
+        [1,2]
      values.supportedOutboundProof.212:
+        [1,2]
      values.supportedOutboundProof.213:
+        [1,2]
      values.supportedOutboundProof.214:
+        [1,2]
      values.supportedOutboundProof.215:
+        [1,2]
      values.supportedOutboundProof.216:
+        [1,2]
      values.ulnLookup.148:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.182:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.210:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.211:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.212:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.213:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.214:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.215:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.216:
+        "0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098"
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
      upgradeability.implementation:
-        "0xaF34771b16960ea77484A866a34CCDAFDc913D9C"
+        "0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
      implementations.0:
-        "0xaF34771b16960ea77484A866a34CCDAFDc913D9C"
+        "0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
    }
```

```diff
+   Status: CREATED
    contract  (0x9bfAc7947FC1b64aA9F12b24EcD519DaEcEf3Ba5) {
    }
```

```diff
+   Status: CREATED
    contract  (0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113) {
    }
```

```diff
+   Status: CREATED
    contract Google Cloud Oracle (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    }
```

```diff
+   Status: CREATED
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    }
```

## Source code changes

```diff
.../contracts/MessagingStructs.sol                 |  25 +
 .../contracts/interfaces/ILayerZeroEndpointV2.sol  |  80 ++++
 .../contracts/interfaces/IMessageLib.sol           |  46 ++
 .../contracts/interfaces/IMessageLibManager.sol    |  73 +++
 .../contracts/interfaces/IMessagingChannel.sol     |  33 ++
 .../contracts/interfaces/IMessagingComposer.sol    |  19 +
 .../contracts/interfaces/IMessagingContext.sol     |   9 +
 .../lz-evm-protocol-v2/contracts/libs/Errors.sol   |  56 +++
 .../interfaces/ILayerZeroUltraLightNodeV2.sol      |  83 ++++
 .../contracts/access/AccessControl.sol             | 248 ++++++++++
 .../contracts/access/IAccessControl.sol            |  88 ++++
 .../@openzeppelin/contracts/access/Ownable.sol     |  83 ++++
 .../@openzeppelin/contracts/security/Pausable.sol  | 105 +++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../@openzeppelin/contracts/utils/Strings.sol      |  85 ++++
 .../contracts/utils/cryptography/ECDSA.sol         | 217 +++++++++
 .../contracts/utils/introspection/ERC165.sol       |  29 ++
 .../contracts/utils/introspection/IERC165.sol      |  25 +
 .../@openzeppelin/contracts/utils/math/Math.sol    | 339 ++++++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/MessageLibBase.sol                   | 170 +++++++
 .../.code/Google Cloud Oracle/contracts/Worker.sol | 142 ++++++
 .../contracts/interfaces/ILayerZeroExecutor.sol    |  29 ++
 .../contracts/interfaces/ILayerZeroTreasury.sol    |   7 +
 .../contracts/interfaces/IWorker.sol               |  20 +
 .../Google Cloud Oracle/contracts/uln/MultiSig.sol |  78 ++++
 .../contracts/uln/VerifierNetwork.sol              | 346 ++++++++++++++
 .../uln/interfaces/ILayerZeroVerifier.sol          |  34 ++
 .../contracts/uln/interfaces/IUltraLightNode.sol   |  13 +
 .../contracts/uln/interfaces/IVerifier.sol         |  25 +
 .../contracts/uln/interfaces/IVerifierFeeLib.sol   |  28 ++
 .../ethereum/.code/Google Cloud Oracle/meta.txt    |   2 +
 .../LayerZero Relayer/implementation/meta.txt      |   2 +-
 .../contracts/libs/CalldataBytesLib.sol            |  58 +++
 .../lz-evm-protocol-v2/contracts/libs/Errors.sol   |  56 +++
 .../contracts/messagelib/libs/BitMaps.sol          |  24 +
 .../contracts/utils/introspection/ERC165.sol       |  29 ++
 .../contracts/utils/introspection/IERC165.sol      |  25 +
 .../contracts/interfaces/ILayerZeroPriceFeed.sol   |  57 +++
 .../contracts/interfaces/IWorker.sol               |  20 +
 .../contracts/uln/VerifierFeeLib.sol               | 137 ++++++
 .../uln/interfaces/ILayerZeroVerifier.sol          |  34 ++
 .../contracts/uln/interfaces/IVerifier.sol         |  25 +
 .../contracts/uln/interfaces/IVerifierFeeLib.sol   |  28 ++
 .../contracts/uln/libs/VerifierOptions.sol         | 177 +++++++
 .../ethereum/.code/VerifierFeeLib/meta.txt         |   2 +
 .../solidity-bytes-utils/contracts/BytesLib.sol    | 510 +++++++++++++++++++++
 .../implementation/meta.txt                        |   2 +-
 .../lzomnichain/ethereum/.code/meta.txt            |   2 +
 .../{.code@18163835 => .code}/proxy/meta.txt       |   2 +-
 .../openzeppelin/interfaces/draft-IERC1822.sol     |  20 +
 .../openzeppelin/proxy/ERC1967/ERC1967Proxy.sol    |  33 ++
 .../openzeppelin/proxy/ERC1967/ERC1967Upgrade.sol  | 182 ++++++++
 .../proxy/openzeppelin/proxy/Proxy.sol             |  37 +-
 .../proxy/openzeppelin/proxy/beacon/IBeacon.sol    |  16 +
 .../proxy/openzeppelin/utils/Address.sol           | 127 ++++-
 .../.code/proxy/openzeppelin/utils/StorageSlot.sol |  84 ++++
 .../proxy/OptimizedTransparentUpgradeableProxy.sol |  60 ++-
 58 files changed, 4278 insertions(+), 75 deletions(-)
```
