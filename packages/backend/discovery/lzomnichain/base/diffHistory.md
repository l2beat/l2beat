# Diff at Tue, 09 Jan 2024 16:44:11 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: master@0b578574e6a64020b5157f700c09de14e6b3eed3 block: 2177243
- current block number: 9014644

## Description

Unified configurations across L2s. Few new remote chains configurations added.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
      values.chainAddressSizeMap.108:
+        32
      values.chainAddressSizeMap.126:
+        20
      values.chainAddressSizeMap.145:
+        20
      values.chainAddressSizeMap.165:
+        20
      values.chainAddressSizeMap.175:
+        20
      values.chainAddressSizeMap.182:
+        20
      values.chainAddressSizeMap.195:
+        20
      values.chainAddressSizeMap.199:
+        20
      values.chainAddressSizeMap.202:
+        20
      values.chainAddressSizeMap.210:
+        20
      values.chainAddressSizeMap.212:
+        20
      values.chainAddressSizeMap.214:
+        20
      values.chainAddressSizeMap.230:
+        20
      values.defaultAdapterParams.108:
+        {"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000000009c4"}
      values.defaultAdapterParams.126:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.145:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.165:
+        {"proofType":2,"adapterParams":"0x000100000000000000000000000000000000000000000000000000000000003d0900"}
      values.defaultAdapterParams.175:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.182:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.195:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.199:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.202:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.210:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.212:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.214:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.230:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.101.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.102.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.106.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.109.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.110.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.111.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.112.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.183.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.184.oracle:
-        "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.108:
+        {"inboundProofLib":1,"inboundBlockConfirm":260,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.126:
+        {"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.145:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.165:
+        {"inboundProofLib":1,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.175:
+        {"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.182:
+        {"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.195:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.199:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.202:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.210:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.212:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.214:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.defaultAppConfig.230:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}
      values.inboundProofLibrary.108:
+        "0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"
      values.inboundProofLibrary.126:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.145:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.165:
+        "0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"
      values.inboundProofLibrary.175:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.182:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.195:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.199:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.202:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.210:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.212:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.214:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.inboundProofLibrary.230:
+        ["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x28937ca4873f7289Ebea0708c4E42b24835eCfF0"
      values.supportedOutboundProof.108:
+        2
      values.supportedOutboundProof.126:
+        2
      values.supportedOutboundProof.145:
+        2
      values.supportedOutboundProof.165:
+        2
      values.supportedOutboundProof.175:
+        2
      values.supportedOutboundProof.182:
+        2
      values.supportedOutboundProof.195:
+        2
      values.supportedOutboundProof.199:
+        2
      values.supportedOutboundProof.202:
+        2
      values.supportedOutboundProof.210:
+        2
      values.supportedOutboundProof.212:
+        2
      values.supportedOutboundProof.214:
+        2
      values.supportedOutboundProof.230:
+        2
      values.ulnLookup.108:
+        "0x54ad3d30af77b60d939ae356e6606de9a4da67583f02b962d2d3f2e481484e90"
      values.ulnLookup.126:
+        "0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2"
      values.ulnLookup.145:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.165:
+        "0x000000000000000000000000042b8289c97896529ec2fe49ba1a8b9c956a86cc"
      values.ulnLookup.175:
+        "0x0000000000000000000000002d61dcdd36f10b22176e0433b86f74567d529aaa"
      values.ulnLookup.182:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.195:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.199:
+        "0x0000000000000000000000005b19bd330a84c049b62d5b0fc2ba120217a18c1c"
      values.ulnLookup.202:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.210:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.212:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.214:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.230:
+        "0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981"
    }
```

```diff
    contract TreasuryV2 (0x980205D352F198748B626f6f7C38A8a5663Ec981) {
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x28937ca4873f7289Ebea0708c4E42b24835eCfF0"
    }
```

```diff
    contract Endpoint (0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7) {
      values.owner:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0x28937ca4873f7289Ebea0708c4E42b24835eCfF0"
    }
```

```diff
    contract  (0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa) {
      upgradeability.implementation:
-        "0x6F475642a6e85809B1c36Fa62763669b1b48DD5B"
+        "0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
      implementations.0:
-        "0x6F475642a6e85809B1c36Fa62763669b1b48DD5B"
+        "0x6BD792911F4B3714E88FbDf32B351632e7d22c70"
    }
```

```diff
+   Status: CREATED
    contract LayerZero Multisig (0x28937ca4873f7289Ebea0708c4E42b24835eCfF0) {
    }
```

```diff
+   Status: CREATED
    contract  (0x3c2269811836af69497E5F486A85D7316753cf62) {
    }
```

```diff
+   Status: CREATED
    contract  (0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4) {
    }
```

```diff
+   Status: CREATED
    contract VerifierNetwork (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
    }
```

```diff
+   Status: CREATED
    contract VerifierFeeLib (0xdeA04ef31C4B4FDf31CB58923F37869739280d49) {
    }
```

## Source code changes

```diff
.../@openzeppelin/contracts/math/SafeMath.sol      | 214 +++++++++
 .../@openzeppelin/contracts/token/ERC20/ERC20.sol  | 306 +++++++++++++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |  77 ++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |  86 ++++
 .../contracts/accessors/SimulateTxAccessor.sol     |  52 +++
 .../implementation/contracts/base/Executor.sol     |  27 ++
 .../contracts/base/FallbackManager.sol             |  53 +++
 .../implementation/contracts/base/GuardManager.sol |  50 ++
 .../contracts/base/ModuleManager.sol               | 133 ++++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 ++
 .../examples/guards/DebugTransactionGuard.sol      |  65 +++
 .../guards/DelegateCallTransactionGuard.sol        |  39 ++
 .../examples/guards/ReentrancyTransactionGuard.sol |  51 +++
 .../examples/libraries/Migrate_1_3_0_to_1_2_0.sol  |  31 ++
 .../contracts/external/GnosisSafeMath.sol          |  54 +++
 .../handler/CompatibilityFallbackHandler.sol       | 144 ++++++
 .../contracts/handler/DefaultCallbackHandler.sol   |  61 +++
 .../contracts/handler/HandlerContext.sol           |  23 +
 .../contracts/interfaces/ERC1155TokenReceiver.sol  |  49 ++
 .../contracts/interfaces/ERC721TokenReceiver.sol   |  24 +
 .../contracts/interfaces/ERC777TokensRecipient.sol |  13 +
 .../contracts/interfaces/IERC165.sol               |  15 +
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../contracts/libraries/CreateCall.sol             |  30 ++
 .../contracts/libraries/GnosisSafeStorage.sol      |  21 +
 .../contracts/libraries/MultiSend.sol              |  66 +++
 .../contracts/libraries/MultiSendCallOnly.sol      |  61 +++
 .../contracts/libraries/SignMessageLib.sol         |  34 ++
 .../contracts/proxies/GnosisSafeProxy.sol          |  44 ++
 .../contracts/proxies/GnosisSafeProxyFactory.sol   | 107 +++++
 .../contracts/proxies/IProxyCreationCallback.sol   |  12 +
 .../implementation/contracts/test/ERC1155Token.sol | 105 +++++
 .../implementation/contracts/test/ERC20Token.sol   |  10 +
 .../implementation/contracts/test/TestHandler.sol  |  10 +
 .../LayerZero Multisig/implementation/meta.txt     |   2 +
 .../LayerZero Multisig/proxy/GnosisSafeProxy.sol   | 159 +++++++
 .../base/.code/LayerZero Multisig/proxy/meta.txt   |   2 +
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
 .../lzomnichain/base/.code/VerifierFeeLib/meta.txt |   2 +
 .../solidity-bytes-utils/contracts/BytesLib.sol    | 510 +++++++++++++++++++++
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
 .../VerifierNetwork/contracts/MessageLibBase.sol   | 170 +++++++
 .../.code/VerifierNetwork/contracts/Worker.sol     | 142 ++++++
 .../contracts/interfaces/ILayerZeroExecutor.sol    |  29 ++
 .../contracts/interfaces/ILayerZeroTreasury.sol    |   7 +
 .../contracts/interfaces/IWorker.sol               |  20 +
 .../VerifierNetwork/contracts/uln/MultiSig.sol     |  78 ++++
 .../contracts/uln/VerifierNetwork.sol              | 346 ++++++++++++++
 .../uln/interfaces/ILayerZeroVerifier.sol          |  34 ++
 .../contracts/uln/interfaces/IUltraLightNode.sol   |  13 +
 .../contracts/uln/interfaces/IVerifier.sol         |  25 +
 .../contracts/uln/interfaces/IVerifierFeeLib.sol   |  28 ++
 .../base/.code/VerifierNetwork/meta.txt            |   2 +
 .../implementation/meta.txt                        |   2 +-
 .../base/{.code@2177243 => .code}/meta.txt         |   2 +-
 .../base/{.code@2177243 => .code}/proxy/meta.txt   |   2 +-
 95 files changed, 6800 insertions(+), 3 deletions(-)
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 2177243 (main branch discovery), not current.

```diff
    contract UltraLightNodeV2 (0x38dE71124f7a447a01D67945a51eDcE9FF491251) {
      values.chainAddressSizeMap:
+        {"101":20,"102":20,"106":20,"109":20,"110":20,"111":20,"112":20,"151":20,"158":20,"167":20,"177":20,"181":20,"183":20,"184":20}
      values.defaultAdapterParams:
+        {"101":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"102":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"106":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"109":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"110":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"111":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"112":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"151":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"158":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"167":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"177":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"181":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"183":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"},"184":{"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}}
      values.defaultAppConfig:
+        {"101":{"inboundProofLib":2,"inboundBlockConfirm":15,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"102":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"106":{"inboundProofLib":2,"inboundBlockConfirm":12,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"109":{"inboundProofLib":2,"inboundBlockConfirm":512,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"110":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"111":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"112":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"151":{"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"158":{"inboundProofLib":2,"inboundBlockConfirm":20,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"167":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"177":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"181":{"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"183":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"},"184":{"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":10,"oracle":"0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4","relayer":"0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa"}}
      values.inboundProofLibrary:
+        {"101":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"102":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"106":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"109":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"110":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"111":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"112":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"151":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"158":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"167":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"177":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"181":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"183":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"],"184":["0x2D61DCDD36F10b22176E0433B86F74567d529aAa","0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36"]}
      values.supportedOutboundProof:
+        {"101":2,"102":2,"106":2,"109":2,"110":2,"111":2,"112":2,"151":2,"158":2,"167":2,"177":2,"181":2,"183":2,"184":2}
      values.ulnLookup:
+        {"101":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","102":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","106":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","109":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","110":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","111":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","112":"0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2","151":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","158":"0x000000000000000000000000fe7c30860d01e28371d40434806f4a8fcdd3a098","167":"0x000000000000000000000000e9ba4c1e76d874a43942718dafc96009ec9d9917","177":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","181":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","183":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251","184":"0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"}
      sinceTimestamp:
+        1689301083
    }
```

```diff
    contract NonceContract (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
      sinceTimestamp:
+        1689301077
    }
```

```diff
    contract TreasuryV2 (0x980205D352F198748B626f6f7C38A8a5663Ec981) {
      sinceTimestamp:
+        1689301089
    }
```

```diff
    contract Endpoint (0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7) {
      values.libraryLookup:
+        ["0x38dE71124f7a447a01D67945a51eDcE9FF491251"]
      sinceTimestamp:
+        1689300955
    }
```

```diff
+   Status: CREATED
    contract MPTValidator01 (0x2D61DCDD36F10b22176E0433B86F74567d529aAa) {
    }
```

```diff
+   Status: CREATED
    contract  (0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4) {
    }
```

```diff
+   Status: CREATED
    contract FPValidator (0xC1b15d3B262bEeC0e3565C11C9e0F6134BdaCB36) {
    }
```

```diff
+   Status: CREATED
    contract  (0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa) {
    }
```

```diff
+   Status: CREATED
    contract  (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
    }
```
