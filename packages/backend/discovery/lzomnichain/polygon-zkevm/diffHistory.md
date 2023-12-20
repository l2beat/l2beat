# Diff at Wed, 20 Dec 2023 13:55:53 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: master@fea77c90d7ee6217f84ee87d58e123b42f0b5273

## Description

Unified configurations across L2s. Few new remote chains configurations added.

## Watched changes

```diff
    contract UltraLightNodeV2 (0xFe7C30860D01e28371D40434806F4A8fcDD3A098) {
      values.chainAddressSizeMap.126:
+        20
      values.chainAddressSizeMap.202:
+        20
      values.chainAddressSizeMap.210:
+        20
      values.chainAddressSizeMap.214:
+        20
      values.defaultAdapterParams.126:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.202:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.210:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAdapterParams.214:
+        {"proofType":2,"adapterParams":"0x00010000000000000000000000000000000000000000000000000000000000030d40"}
      values.defaultAppConfig.108.inboundBlockConfirm:
-        500000
+        260
      values.defaultAppConfig.126:
+        {"inboundProofLib":2,"inboundBlockConfirm":10,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.202:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.210:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.defaultAppConfig.214:
+        {"inboundProofLib":2,"inboundBlockConfirm":5,"outboundProofType":2,"outboundBlockConfirm":20,"oracle":"0xA6Bf2bE6c60175601BF88217c75dD4b14ABB5FBb","relayer":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"}
      values.inboundProofLibrary.126:
+        ["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"]
      values.inboundProofLibrary.202:
+        ["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"]
      values.inboundProofLibrary.210:
+        ["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"]
      values.inboundProofLibrary.214:
+        ["0x38dE71124f7a447a01D67945a51eDcE9FF491251","0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"]
      values.supportedOutboundProof.126:
+        2
      values.supportedOutboundProof.202:
+        2
      values.supportedOutboundProof.210:
+        2
      values.supportedOutboundProof.214:
+        2
      values.ulnLookup.126:
+        "0x0000000000000000000000004d73adb72bc3dd368966edd0f0b2148401a178e2"
      values.ulnLookup.202:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.210:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
      values.ulnLookup.214:
+        "0x00000000000000000000000038de71124f7a447a01d67945a51edce9ff491251"
    }
```

## Source code changes

```diff
.../polygon-zkevm/{.code@3763915 => .code}/ProxyAdmin/meta.txt          | 2 +-
 .../polygon-zkevm/{.code@3763915 => .code}/implementation/meta.txt      | 2 +-
 discovery/lzomnichain/polygon-zkevm/{.code@3763915 => .code}/meta.txt   | 2 +-
 .../lzomnichain/polygon-zkevm/{.code@3763915 => .code}/proxy/meta.txt   | 2 +-
 4 files changed, 4 insertions(+), 4 deletions(-)
```
