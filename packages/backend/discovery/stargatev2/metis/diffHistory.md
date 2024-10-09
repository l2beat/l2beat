Generated with discovered.json: 0xab06f0664fbc9152ff2391a70b8866174e406995

# Diff at Tue, 30 Jul 2024 11:18:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 17386539
- current block number: 17386539

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17386539 (main branch discovery), not current.

```diff
    contract TokenMessaging (0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a) {
    +++ description: None
      fieldMeta:
+        {"maxAssetId":{"description":"The highest currently registered assetID"}}
    }
```

Generated with discovered.json: 0x4392bca37ca922ef942ee9793c72c9ceab11b8e6

# Diff at Wed, 19 Jun 2024 09:03:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 17247259
- current block number: 17386539

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17247259 (main branch discovery), not current.

```diff
    contract StargatePool (0x36ed193dc7160D3858EC250e69D12B03Ca087D08) {
    +++ description: None
      values.getAddressConfig:
-        ["0xe8CDF27AcD73a434D661C84887215F7598e7d0d3","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x3da4f8E456AC648c489c286B99Ca37B666be7C4C","0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a","0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0xe8CDF27AcD73a434D661C84887215F7598e7d0d3","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x3da4f8E456AC648c489c286B99Ca37B666be7C4C","tokenMessaging":"0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a","creditMessaging":"0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract StargatePoolMigratable (0x4dCBFC0249e8d5032F89D6461218a9D2eFff5125) {
    +++ description: None
      values.getAddressConfig:
-        ["0x19cFCE47eD54a88614648DC3f19A5980097007dD","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x3da4f8E456AC648c489c286B99Ca37B666be7C4C","0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a","0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x19cFCE47eD54a88614648DC3f19A5980097007dD","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x3da4f8E456AC648c489c286B99Ca37B666be7C4C","tokenMessaging":"0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a","creditMessaging":"0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract TokenMessaging (0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a) {
    +++ description: None
      values.oAppVersion:
-        [1,2]
+        {"senderVersion":1,"receiverVersion":2}
    }
```

```diff
    contract StargatePool (0xD9050e7043102a0391F81462a3916326F86331F0) {
    +++ description: None
      values.getAddressConfig:
-        ["0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x3da4f8E456AC648c489c286B99Ca37B666be7C4C","0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a","0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x3da4f8E456AC648c489c286B99Ca37B666be7C4C","tokenMessaging":"0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a","creditMessaging":"0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

Generated with discovered.json: 0xda66e32e959e41aa65760c5793cf68dbe0ffbb5a

# Diff at Mon, 03 Jun 2024 13:00:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 17247259

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract StargatePool (0x36ed193dc7160D3858EC250e69D12B03Ca087D08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolMigratable (0x4dCBFC0249e8d5032F89D6461218a9D2eFff5125)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessaging (0xcbE78230CcA58b9EF4c3c5D1bC0D7E4b3206588a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePool (0xD9050e7043102a0391F81462a3916326F86331F0)
    +++ description: None
```
