Generated with discovered.json: 0x458e73d51eaf36d5354ea8597514dff1b63344f9

# Diff at Thu, 31 Jul 2025 10:51:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@07319d194d312aca8103826b7db44d44613cc7fa block: 1752074075
- current timestamp: 1752074075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752074075 (main branch discovery), not current.

```diff
    contract TokenMessagingArbitrum (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      name:
-        "TokenMessaging"
+        "TokenMessagingArbitrum"
    }
```

Generated with discovered.json: 0xb3b5b246f3a156a8d0ccbdd292e217195aa7fa39

# Diff at Mon, 14 Jul 2025 12:47:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 345508178
- current block number: 345508178

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 345508178 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      address:
-        "0x19cFCE47eD54a88614648DC3f19A5980097007dD"
+        "arb1:0x19cFCE47eD54a88614648DC3f19A5980097007dD"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "arb1:0x1a44076050125825900e736c501f859c50fE728c"
      values.oApp:
-        "0x19cFCE47eD54a88614648DC3f19A5980097007dD"
+        "arb1:0x19cFCE47eD54a88614648DC3f19A5980097007dD"
      values.owner:
-        "0x9CD50907aeb5D16F29Bddf7e1aBb10018Ee8717d"
+        "arb1:0x9CD50907aeb5D16F29Bddf7e1aBb10018Ee8717d"
      values.planner:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "arb1:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
      values.pools.0:
-        "0xe8CDF27AcD73a434D661C84887215F7598e7d0d3"
+        "arb1:0xe8CDF27AcD73a434D661C84887215F7598e7d0d3"
      values.pools.1:
-        "0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0"
+        "arb1:0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0"
      values.pools.2:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.pools.3:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.pools.4:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.pools.5:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.pools.6:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.pools.7:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.pools.8:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.pools.9:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.pools.10:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.pools.11:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.pools.12:
-        "0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F"
+        "arb1:0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F"
      values.preCrime:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0x19cFCE47eD54a88614648DC3f19A5980097007dD:
-        "TokenMessaging"
      implementationNames.arb1:0x19cFCE47eD54a88614648DC3f19A5980097007dD:
+        "TokenMessaging"
    }
```

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      address:
-        "0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F"
+        "arb1:0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "arb1:0x1a44076050125825900e736c501f859c50fE728c"
      values.getAddressConfig.feeLib:
-        "0xda82A31dF339BfDF0123661134b4DB63Cb1706f5"
+        "arb1:0xda82A31dF339BfDF0123661134b4DB63Cb1706f5"
      values.getAddressConfig.planner:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "arb1:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
      values.getAddressConfig.treasurer:
-        "0x146c8e409C113ED87C6183f4d25c50251DFfbb3a"
+        "arb1:0x146c8e409C113ED87C6183f4d25c50251DFfbb3a"
      values.getAddressConfig.tokenMessaging:
-        "0x19cFCE47eD54a88614648DC3f19A5980097007dD"
+        "arb1:0x19cFCE47eD54a88614648DC3f19A5980097007dD"
      values.getAddressConfig.creditMessaging:
-        "0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6"
+        "arb1:0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6"
      values.getAddressConfig.lzToken:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.lpToken:
-        "0x993614e1c8c9C5AbE49462Ce5702431978Fd767F"
+        "arb1:0x993614e1c8c9C5AbE49462Ce5702431978Fd767F"
      values.owner:
-        "0x9CD50907aeb5D16F29Bddf7e1aBb10018Ee8717d"
+        "arb1:0x9CD50907aeb5D16F29Bddf7e1aBb10018Ee8717d"
      values.token:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F:
-        "StargatePoolNative"
      implementationNames.arb1:0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F:
+        "StargatePoolNative"
    }
```

```diff
    contract StargatePoolMigratable (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      address:
-        "0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0"
+        "arb1:0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0"
      values.burnAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "arb1:0x1a44076050125825900e736c501f859c50fE728c"
      values.getAddressConfig.feeLib:
-        "0x1F605162282570dFa6255D27895587f4117F52FA"
+        "arb1:0x1F605162282570dFa6255D27895587f4117F52FA"
      values.getAddressConfig.planner:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "arb1:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
      values.getAddressConfig.treasurer:
-        "0x146c8e409C113ED87C6183f4d25c50251DFfbb3a"
+        "arb1:0x146c8e409C113ED87C6183f4d25c50251DFfbb3a"
      values.getAddressConfig.tokenMessaging:
-        "0x19cFCE47eD54a88614648DC3f19A5980097007dD"
+        "arb1:0x19cFCE47eD54a88614648DC3f19A5980097007dD"
      values.getAddressConfig.creditMessaging:
-        "0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6"
+        "arb1:0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6"
      values.getAddressConfig.lzToken:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.lpToken:
-        "0x8D66Ff1845b1baCC6E87D867CA4680d05A349cA8"
+        "arb1:0x8D66Ff1845b1baCC6E87D867CA4680d05A349cA8"
      values.owner:
-        "0x9CD50907aeb5D16F29Bddf7e1aBb10018Ee8717d"
+        "arb1:0x9CD50907aeb5D16F29Bddf7e1aBb10018Ee8717d"
      values.token:
-        "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
+        "arb1:0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
      implementationNames.0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0:
-        "StargatePoolMigratable"
      implementationNames.arb1:0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0:
+        "StargatePoolMigratable"
    }
```

```diff
    EOA  (0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5) {
    +++ description: None
      address:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "arb1:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      address:
-        "0xe8CDF27AcD73a434D661C84887215F7598e7d0d3"
+        "arb1:0xe8CDF27AcD73a434D661C84887215F7598e7d0d3"
      values.burnAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.endpoint:
-        "0x1a44076050125825900e736c501f859c50fE728c"
+        "arb1:0x1a44076050125825900e736c501f859c50fE728c"
      values.getAddressConfig.feeLib:
-        "0x80F755e3091b2Ad99c08Da8D13E9C7635C1b8161"
+        "arb1:0x80F755e3091b2Ad99c08Da8D13E9C7635C1b8161"
      values.getAddressConfig.planner:
-        "0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
+        "arb1:0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5"
      values.getAddressConfig.treasurer:
-        "0x146c8e409C113ED87C6183f4d25c50251DFfbb3a"
+        "arb1:0x146c8e409C113ED87C6183f4d25c50251DFfbb3a"
      values.getAddressConfig.tokenMessaging:
-        "0x19cFCE47eD54a88614648DC3f19A5980097007dD"
+        "arb1:0x19cFCE47eD54a88614648DC3f19A5980097007dD"
      values.getAddressConfig.creditMessaging:
-        "0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6"
+        "arb1:0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6"
      values.getAddressConfig.lzToken:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.lpToken:
-        "0x6Ea313859A5D9F6fF2a68f529e6361174bFD2225"
+        "arb1:0x6Ea313859A5D9F6fF2a68f529e6361174bFD2225"
      values.owner:
-        "0x9CD50907aeb5D16F29Bddf7e1aBb10018Ee8717d"
+        "arb1:0x9CD50907aeb5D16F29Bddf7e1aBb10018Ee8717d"
      values.token:
-        "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
+        "arb1:0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
      implementationNames.0xe8CDF27AcD73a434D661C84887215F7598e7d0d3:
-        "StargatePoolUSDC"
      implementationNames.arb1:0xe8CDF27AcD73a434D661C84887215F7598e7d0d3:
+        "StargatePoolUSDC"
    }
```

```diff
+   Status: CREATED
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolMigratable (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3)
    +++ description: None
```

Generated with discovered.json: 0x05aeb7f7383b9693135b988309959a781f5ce242

# Diff at Mon, 09 Jun 2025 10:36:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7cc006dadcc55e6cce3be3eb03d491835943fb43 block: 342017377
- current block number: 345508178

## Description

config: add stargate pool shapes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 342017377 (main branch discovery), not current.

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      template:
+        "stargate/StargatePoolNative"
    }
```

```diff
    contract StargatePoolMigratable (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      template:
+        "stargate/StargatePoolMigratable"
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      template:
+        "stargate/StargatePoolUSDC"
    }
```

Generated with discovered.json: 0xbdf9d28d63c75b13541783ea74d499b42c87a458

# Diff at Mon, 26 May 2025 15:50:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 333890998
- current block number: 340770045

## Description

deficit offset removed (fee related).

## Watched changes

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      values.deficitOffset:
-        "600000000000000000000"
+        0
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      values.deficitOffset:
-        2000000000000
+        0
    }
```

Generated with discovered.json: 0xf7d6c88917d6d657d05fb30e1d4adf8cc9fc8392

# Diff at Tue, 06 May 2025 15:41:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f365211458ce8b1ced035f6b5e4a56c9f10d2546 block: 305943129
- current block number: 333890998

## Description

Modified liquidity parameter deficitOffset for native and USDC pools.

## Watched changes

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      values.deficitOffset:
-        "15000000000000000000000"
+        "600000000000000000000"
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      values.deficitOffset:
-        50000000000000
+        2000000000000
    }
```

Generated with discovered.json: 0x220ccf93653405aecba8ce28d2c2972ba57c2822

# Diff at Tue, 04 Mar 2025 10:40:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 305943129
- current block number: 305943129

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305943129 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      sinceBlock:
+        215658770
    }
```

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      sinceBlock:
+        215658702
    }
```

```diff
    contract StargatePoolMigratable (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      sinceBlock:
+        215658745
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      sinceBlock:
+        215658734
    }
```

Generated with discovered.json: 0x982358c1af2dfb055951961248fb16a5aa699dd2

# Diff at Fri, 14 Feb 2025 10:23:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 223440408
- current block number: 305943129

## Description

Deficit config adjustments affecting fee calculation.

## Watched changes

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      values.deficitOffset:
-        0
+        "15000000000000000000000"
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      values.deficitOffset:
-        0
+        50000000000000
    }
```

Generated with discovered.json: 0xca45510cadc304383d6833f32cb256416280101d

# Diff at Mon, 14 Oct 2024 10:59:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 223440408
- current block number: 223440408

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 223440408 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      sourceHashes:
+        ["0xd0e407d7588e82d593435d256d12b9da5c2c70686a62e24948a96fcbc1a463b4"]
    }
```

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      sourceHashes:
+        ["0x63ac97930921267a1251904351ae2409e0d62d3d3c3fcb2ed7bc1fc4775321f7"]
    }
```

```diff
    contract StargatePoolMigratable (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      sourceHashes:
+        ["0xad746913c310c0ee643e98f0a0f4bc6095877e7c82e0779cb5d5e852e0e12c8d"]
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      sourceHashes:
+        ["0x0ef9b0bca6f74cd24daa9d50e734dfec2ecbc71cef5b209fa0c0f93561ad2640"]
    }
```

Generated with discovered.json: 0x7559bc174f0a386821108794c4238dd4aa0e7dd4

# Diff at Tue, 30 Jul 2024 11:17:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 223440408
- current block number: 223440408

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 223440408 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      fieldMeta:
+        {"maxAssetId":{"description":"The highest currently registered assetID"}}
    }
```

Generated with discovered.json: 0xe9d32b44d18541b13a2f27fbd00584de6c3aec89

# Diff at Wed, 19 Jun 2024 08:56:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 217346877
- current block number: 223440408

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 217346877 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD) {
    +++ description: None
      values.oAppVersion:
-        [1,2]
+        {"senderVersion":1,"receiverVersion":2}
    }
```

```diff
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F) {
    +++ description: None
      values.getAddressConfig:
-        ["0xda82A31dF339BfDF0123661134b4DB63Cb1706f5","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","0x19cFCE47eD54a88614648DC3f19A5980097007dD","0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0xda82A31dF339BfDF0123661134b4DB63Cb1706f5","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","tokenMessaging":"0x19cFCE47eD54a88614648DC3f19A5980097007dD","creditMessaging":"0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract StargatePoolMigratable (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0) {
    +++ description: None
      values.getAddressConfig:
-        ["0x1F605162282570dFa6255D27895587f4117F52FA","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","0x19cFCE47eD54a88614648DC3f19A5980097007dD","0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x1F605162282570dFa6255D27895587f4117F52FA","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","tokenMessaging":"0x19cFCE47eD54a88614648DC3f19A5980097007dD","creditMessaging":"0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3) {
    +++ description: None
      values.getAddressConfig:
-        ["0x80F755e3091b2Ad99c08Da8D13E9C7635C1b8161","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","0x19cFCE47eD54a88614648DC3f19A5980097007dD","0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x80F755e3091b2Ad99c08Da8D13E9C7635C1b8161","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x146c8e409C113ED87C6183f4d25c50251DFfbb3a","tokenMessaging":"0x19cFCE47eD54a88614648DC3f19A5980097007dD","creditMessaging":"0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

Generated with discovered.json: 0xeff7c3c3afb58423406f923c724b4a1a75004850

# Diff at Sat, 01 Jun 2024 16:57:06 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 217346877

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract TokenMessaging (0x19cFCE47eD54a88614648DC3f19A5980097007dD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolNative (0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolMigratable (0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolUSDC (0xe8CDF27AcD73a434D661C84887215F7598e7d0d3)
    +++ description: None
```
