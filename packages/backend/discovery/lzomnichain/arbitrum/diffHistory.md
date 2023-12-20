# Diff at Wed, 20 Dec 2023 13:14:52 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: master@fea77c90d7ee6217f84ee87d58e123b42f0b5273

## Description

Implementation of some contract changed. Default Oracles on many chains changed. Few new remote chains configuration appeared.

## Watched changes

```diff
    contract  (0x177d36dBE2271A4DdB2Ad8304d82628eb921d790) {
      upgradeability.implementation:
-        "0x11bA0F5c3832044A416B2E177EA773eceBCCEE1f"
+        "0xf77a80851c7f40492eB7a5f1e7d92411ae8962a4"
      implementations.0:
-        "0x11bA0F5c3832044A416B2E177EA773eceBCCEE1f"
+        "0xf77a80851c7f40492eB7a5f1e7d92411ae8962a4"
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.chainAddressSizeMap.150:
+        20
      values.chainAddressSizeMap.153:
+        20
      values.chainAddressSizeMap.182:
+        20
      values.chainAddressSizeMap.195:
+        20
      values.chainAddressSizeMap.196:
+        20
      values.chainAddressSizeMap.197:
+        20
      values.chainAddressSizeMap.198:
+        20
      values.chainAddressSizeMap.199:
+        20
      values.chainAddressSizeMap.202:
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
      values.chainAddressSizeMap.217:
+        20
      values.chainAddressSizeMap.218:
+        20
      values.chainAddressSizeMap.230:
+        20
      values.defaultAdapterParams.167.proofType:
-        2
+        1
      values.defaultAdapterParams.150:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.153:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.182:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.195:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.196:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.197:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.198:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.199:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.202:
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
      values.defaultAdapterParams.217:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.218:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.230:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.101.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.102.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.102.outboundProofType:
-        1
+        2
      values.defaultAppConfig.102.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.106.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.108.inboundBlockConfirm:
-        500000
+        260
      values.defaultAppConfig.109.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.110.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.110.outboundProofType:
-        1
+        2
      values.defaultAppConfig.110.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.111.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.112.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.116.inboundProofLib:
-        1
+        2
      values.defaultAppConfig.116.outboundProofType:
-        1
+        2
      values.defaultAppConfig.116.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.125.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.126.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.145.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.175.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.183.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.184.oracle:
-        "0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f"
+        "0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"
      values.defaultAppConfig.150:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.153:
+        {"inboundProofLib":2,"inboundBlockConfirm":21,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.182:
+        {"inboundProofLib":2,"inboundBlockConfirm":2,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.195:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.196:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.197:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.198:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.199:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.202:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.210:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.211:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.212:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.213:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.214:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.215:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.216:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.217:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.218:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.defaultAppConfig.230:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f","relayer":"0x177d36dBE2271A4DdB2Ad8304d82628eb921d790"}
      values.inboundProofLibrary.150:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.153:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.182:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.195:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.196:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.197:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.198:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.199:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.202:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.210:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.211:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.212:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.213:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.214:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.215:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.216:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.217:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.218:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.inboundProofLibrary.230:
+        ["0x462F7eC57C6492B983a8C8322B4369a7f149B859","0x87794d2f64e076694a153aFdb12cA62eb9C2ea5B"]
      values.supportedOutboundProof.167:
-        2
+        [2,1]
      values.supportedOutboundProof.150:
+        2
      values.supportedOutboundProof.153:
+        2
      values.supportedOutboundProof.182:
+        2
      values.supportedOutboundProof.195:
+        [1,2]
      values.supportedOutboundProof.196:
+        [1,2]
      values.supportedOutboundProof.197:
+        [1,2]
      values.supportedOutboundProof.198:
+        [1,2]
      values.supportedOutboundProof.199:
+        [1,2]
      values.supportedOutboundProof.202:
+        [1,2]
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
      values.supportedOutboundProof.217:
+        [1,2]
      values.supportedOutboundProof.218:
+        [1,2]
      values.supportedOutboundProof.230:
+        2
      values.ulnLookup.150:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.153:
+        "0x00000000000000000000000066a71dcef29a0ffbdbe3c6a460a3b5bc225cd675"
      values.ulnLookup.182:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.195:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.196:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.197:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.198:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.199:
+        "0x0000000000000000000000005b19bd330a84c049b62d5b0fc2ba120217a18c1c"
      values.ulnLookup.202:
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
      values.ulnLookup.217:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.218:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.230:
+        "0x000000000000000000000000980205d352f198748b626f6f7c38a8a5663ec981"
    }
```

```diff
+   Status: CREATED
    contract  (0x9c8D8A224545c15024cB50C7c02cf3EA9AA1bF36) {
    }
```

```diff
+   Status: CREATED
    contract  (0xa5D625ea24F5aDecB7234Dc62767e18486ed684c) {
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
.../{.code@117399533 => .code}/ProxyAdmin/meta.txt |   2 +-
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
 .../arbitrum/.code/VerifierFeeLib/meta.txt         |   2 +
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
 .../arbitrum/.code/VerifierNetwork/meta.txt        |   2 +
 .../implementation/meta.txt                        |   2 +-
 .../lzomnichain/arbitrum/.code/meta.txt            |   2 +
 .../{.code@117399533 => .code}/proxy/meta.txt      |   2 +-
 .../.code/proxy/openzeppelin/access/Ownable.sol    |  76 +++
 .../openzeppelin/interfaces/draft-IERC1822.sol     |  20 +
 .../openzeppelin/proxy/ERC1967/ERC1967Proxy.sol    |  33 ++
 .../openzeppelin/proxy/ERC1967/ERC1967Upgrade.sol  | 182 ++++++++
 .../proxy/openzeppelin/proxy/Proxy.sol             |  37 +-
 .../openzeppelin/proxy/beacon/BeaconProxy.sol      |  62 +++
 .../proxy/openzeppelin/proxy/beacon/IBeacon.sol    |  16 +
 .../proxy/beacon/UpgradeableBeacon.sol             |  66 +++
 .../openzeppelin/proxy/transparent/ProxyAdmin.sol  |  84 ++++
 .../transparent/TransparentUpgradeableProxy.sol    | 125 +++++
 .../openzeppelin/proxy/utils/Initializable.sol     |  80 ++++
 .../openzeppelin/proxy/utils/UUPSUpgradeable.sol   |  95 ++++
 .../proxy/openzeppelin/utils/Address.sol           | 127 ++++-
 .../.code/proxy/openzeppelin/utils/Context.sol     |  24 +
 .../.code/proxy/openzeppelin/utils/StorageSlot.sol |  84 ++++
 .../proxy/OptimizedTransparentUpgradeableProxy.sol |  60 ++-
 66 files changed, 4890 insertions(+), 75 deletions(-)
```
