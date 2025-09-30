Generated with discovered.json: 0xed08651b5071e06a9b5f9730555f5b1bdfd17f39

# Diff at Wed, 03 Sep 2025 15:52:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1741355279
- current timestamp: 1741355279

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1741355279 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60)
    +++ description: None
```

Generated with discovered.json: 0xcaa9ddd3f740ae51d0c04f5944a879a8793637ab

# Diff at Tue, 02 Sep 2025 14:42:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ac83bbe73046e5a2b78d713bc6fc2c43f9d130e9 block: 1741355279
- current timestamp: 1741355279

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1741355279 (main branch discovery), not current.

```diff
    contract GpsFactRegistryAdapter (eth:0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      usedTypes.0.arg.760308386675154762009993173725077399730170358078020153308029499928875469870:
+        "Starknet Aggregator (since v0.14.0)"
      usedTypes.0.arg.793595346346724189681221050719974054861327641387231526786912662354259445535:
+        "StarkNet OS (since v0.14.0)"
    }
```

Generated with discovered.json: 0x0885dc6ad764a22dea600cab61a36e2c7f10a211

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x93e5a3bc038d5892472fc58244cec7cfc9f2e8ef

# Diff at Mon, 14 Jul 2025 12:45:12 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21995398
- current block number: 21995398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995398 (main branch discovery), not current.

```diff
    contract DACommittee (0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295) {
    +++ description: Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 5.
      address:
-        "0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"
+        "eth:0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"
+++ description: Includes DAC members and threshold.
      values.constructorArgs.0.6:
-        "0xfF506616E8C53EE5e513b906AC00B5D76664C537"
+        "eth:0xfF506616E8C53EE5e513b906AC00B5D76664C537"
+++ description: Includes DAC members and threshold.
      values.constructorArgs.0.5:
-        "0xB71FC111D7BA82D5955BaDdD7717f3467184FF61"
+        "eth:0xB71FC111D7BA82D5955BaDdD7717f3467184FF61"
+++ description: Includes DAC members and threshold.
      values.constructorArgs.0.4:
-        "0xAfC4589aF46C72CBF550F2eEAE38c97AeDE15d17"
+        "eth:0xAfC4589aF46C72CBF550F2eEAE38c97AeDE15d17"
+++ description: Includes DAC members and threshold.
      values.constructorArgs.0.3:
-        "0x51AbdE72a4542500a7b1Cb32B18b13fbe1F9ff2E"
+        "eth:0x51AbdE72a4542500a7b1Cb32B18b13fbe1F9ff2E"
+++ description: Includes DAC members and threshold.
      values.constructorArgs.0.2:
-        "0x48AF849535DDFa560A0EB0FbDEf436688169B949"
+        "eth:0x48AF849535DDFa560A0EB0FbDEf436688169B949"
+++ description: Includes DAC members and threshold.
      values.constructorArgs.0.1:
-        "0x24EeFFC269bB8E540F5B2C8f45750489abf8D54b"
+        "eth:0x24EeFFC269bB8E540F5B2C8f45750489abf8D54b"
+++ description: Includes DAC members and threshold.
      values.constructorArgs.0.0:
-        "0x1FfBDb8061B586A6D29fb608d025e5D8744f58d1"
+        "eth:0x1FfBDb8061B586A6D29fb608d025e5D8744f58d1"
      implementationNames.0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295:
-        "Committee"
      implementationNames.eth:0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295:
+        "Committee"
    }
```

```diff
    EOA  (0x1FfBDb8061B586A6D29fb608d025e5D8744f58d1) {
    +++ description: None
      address:
-        "0x1FfBDb8061B586A6D29fb608d025e5D8744f58d1"
+        "eth:0x1FfBDb8061B586A6D29fb608d025e5D8744f58d1"
    }
```

```diff
    EOA  (0x24EeFFC269bB8E540F5B2C8f45750489abf8D54b) {
    +++ description: None
      address:
-        "0x24EeFFC269bB8E540F5B2C8f45750489abf8D54b"
+        "eth:0x24EeFFC269bB8E540F5B2C8f45750489abf8D54b"
    }
```

```diff
    EOA  (0x296A19A4e87F5824DBE8DEd53415A4704538bB30) {
    +++ description: None
      address:
-        "0x296A19A4e87F5824DBE8DEd53415A4704538bB30"
+        "eth:0x296A19A4e87F5824DBE8DEd53415A4704538bB30"
    }
```

```diff
    EOA  (0x37AC4a9Bf184aa1130016525631f3Daec11f7b26) {
    +++ description: None
      address:
-        "0x37AC4a9Bf184aa1130016525631f3Daec11f7b26"
+        "eth:0x37AC4a9Bf184aa1130016525631f3Daec11f7b26"
    }
```

```diff
    EOA  (0x3d395f623D8954d71132F5caC10778CA275806e0) {
    +++ description: None
      address:
-        "0x3d395f623D8954d71132F5caC10778CA275806e0"
+        "eth:0x3d395f623D8954d71132F5caC10778CA275806e0"
    }
```

```diff
    EOA  (0x48AF849535DDFa560A0EB0FbDEf436688169B949) {
    +++ description: None
      address:
-        "0x48AF849535DDFa560A0EB0FbDEf436688169B949"
+        "eth:0x48AF849535DDFa560A0EB0FbDEf436688169B949"
    }
```

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: Helper contract for registering limit orders from L1.
      address:
-        "0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8"
+        "eth:0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8"
      implementationNames.0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8:
-        "OrderRegistry"
      implementationNames.eth:0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8:
+        "OrderRegistry"
    }
```

```diff
    EOA  (0x51AbdE72a4542500a7b1Cb32B18b13fbe1F9ff2E) {
    +++ description: None
      address:
-        "0x51AbdE72a4542500a7b1Cb32B18b13fbe1F9ff2E"
+        "eth:0x51AbdE72a4542500a7b1Cb32B18b13fbe1F9ff2E"
    }
```

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      address:
-        "0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
+        "eth:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
+++ description: Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts.
+++ severity: HIGH
      values.$admin:
-        "0xD2C37fC6fD89563187f3679304975655e448D192"
+        "eth:0xD2C37fC6fD89563187f3679304975655e448D192"
      values.$implementation.0:
-        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
+        "eth:0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      values.$implementation.1:
-        "0x62BCA4DB742A99c834e2c24b609656A70EA25379"
+        "eth:0x62BCA4DB742A99c834e2c24b609656A70EA25379"
      values.$implementation.2:
-        "0x8536850750956c2FEebeCAB786d82271a5467687"
+        "eth:0x8536850750956c2FEebeCAB786d82271a5467687"
      values.$implementation.3:
-        "0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
+        "eth:0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
      values.$implementation.4:
-        "0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
+        "eth:0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
      values.$implementation.5:
-        "0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
+        "eth:0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
      values.$implementation.6:
-        "0xB3788a88F063B217227E27ae16Ba550db3132bE6"
+        "eth:0xB3788a88F063B217227E27ae16Ba550db3132bE6"
      values.$pastUpgrades.0.2.0:
-        "0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378"
+        "eth:0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378"
      values.$pastUpgrades.0.2.1:
-        "0x61d3389Aa2d001c860859cC021153e40D557BF4b"
+        "eth:0x61d3389Aa2d001c860859cC021153e40D557BF4b"
      values.$pastUpgrades.0.2.2:
-        "0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E"
+        "eth:0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E"
      values.$pastUpgrades.0.2.3:
-        "0xedB67D40161D9fa660DCFFE60f859B7381E4793a"
+        "eth:0xedB67D40161D9fa660DCFFE60f859B7381E4793a"
      values.$pastUpgrades.1.2.0:
-        "0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378"
+        "eth:0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378"
      values.$pastUpgrades.1.2.1:
-        "0x61d3389Aa2d001c860859cC021153e40D557BF4b"
+        "eth:0x61d3389Aa2d001c860859cC021153e40D557BF4b"
      values.$pastUpgrades.1.2.2:
-        "0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E"
+        "eth:0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E"
      values.$pastUpgrades.1.2.3:
-        "0xedB67D40161D9fa660DCFFE60f859B7381E4793a"
+        "eth:0xedB67D40161D9fa660DCFFE60f859B7381E4793a"
      values.$pastUpgrades.2.2.0:
-        "0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378"
+        "eth:0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378"
      values.$pastUpgrades.2.2.1:
-        "0x61d3389Aa2d001c860859cC021153e40D557BF4b"
+        "eth:0x61d3389Aa2d001c860859cC021153e40D557BF4b"
      values.$pastUpgrades.2.2.2:
-        "0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E"
+        "eth:0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E"
      values.$pastUpgrades.2.2.3:
-        "0xedB67D40161D9fa660DCFFE60f859B7381E4793a"
+        "eth:0xedB67D40161D9fa660DCFFE60f859B7381E4793a"
      values.$pastUpgrades.3.2.0:
-        "0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378"
+        "eth:0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378"
      values.$pastUpgrades.3.2.1:
-        "0x61d3389Aa2d001c860859cC021153e40D557BF4b"
+        "eth:0x61d3389Aa2d001c860859cC021153e40D557BF4b"
      values.$pastUpgrades.3.2.2:
-        "0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E"
+        "eth:0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E"
      values.$pastUpgrades.3.2.3:
-        "0xedB67D40161D9fa660DCFFE60f859B7381E4793a"
+        "eth:0xedB67D40161D9fa660DCFFE60f859B7381E4793a"
      values.$pastUpgrades.4.2.0:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "eth:0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
      values.$pastUpgrades.4.2.1:
-        "0xF65C115efd24102315Af53f84aD65aD240bc9D57"
+        "eth:0xF65C115efd24102315Af53f84aD65aD240bc9D57"
      values.$pastUpgrades.4.2.2:
-        "0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
+        "eth:0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
      values.$pastUpgrades.4.2.3:
-        "0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
+        "eth:0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
      values.$pastUpgrades.4.2.4:
-        "0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
+        "eth:0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
      values.$pastUpgrades.4.2.5:
-        "0x2D542881E93491e765E5110c1e373FC2968E720A"
+        "eth:0x2D542881E93491e765E5110c1e373FC2968E720A"
      values.$pastUpgrades.4.2.6:
-        "0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
+        "eth:0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
      values.$pastUpgrades.5.2.0:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "eth:0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
      values.$pastUpgrades.5.2.1:
-        "0xF65C115efd24102315Af53f84aD65aD240bc9D57"
+        "eth:0xF65C115efd24102315Af53f84aD65aD240bc9D57"
      values.$pastUpgrades.5.2.2:
-        "0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
+        "eth:0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
      values.$pastUpgrades.5.2.3:
-        "0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
+        "eth:0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
      values.$pastUpgrades.5.2.4:
-        "0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
+        "eth:0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
      values.$pastUpgrades.5.2.5:
-        "0x2D542881E93491e765E5110c1e373FC2968E720A"
+        "eth:0x2D542881E93491e765E5110c1e373FC2968E720A"
      values.$pastUpgrades.5.2.6:
-        "0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
+        "eth:0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
      values.$pastUpgrades.6.2.0:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "eth:0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
      values.$pastUpgrades.6.2.1:
-        "0xF65C115efd24102315Af53f84aD65aD240bc9D57"
+        "eth:0xF65C115efd24102315Af53f84aD65aD240bc9D57"
      values.$pastUpgrades.6.2.2:
-        "0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
+        "eth:0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
      values.$pastUpgrades.6.2.3:
-        "0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
+        "eth:0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
      values.$pastUpgrades.6.2.4:
-        "0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
+        "eth:0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
      values.$pastUpgrades.6.2.5:
-        "0x2D542881E93491e765E5110c1e373FC2968E720A"
+        "eth:0x2D542881E93491e765E5110c1e373FC2968E720A"
      values.$pastUpgrades.6.2.6:
-        "0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
+        "eth:0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
      values.$pastUpgrades.7.2.0:
-        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
+        "eth:0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      values.$pastUpgrades.7.2.1:
-        "0x62BCA4DB742A99c834e2c24b609656A70EA25379"
+        "eth:0x62BCA4DB742A99c834e2c24b609656A70EA25379"
      values.$pastUpgrades.7.2.2:
-        "0x8536850750956c2FEebeCAB786d82271a5467687"
+        "eth:0x8536850750956c2FEebeCAB786d82271a5467687"
      values.$pastUpgrades.7.2.3:
-        "0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
+        "eth:0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
      values.$pastUpgrades.7.2.4:
-        "0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
+        "eth:0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
      values.$pastUpgrades.7.2.5:
-        "0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
+        "eth:0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
      values.$pastUpgrades.7.2.6:
-        "0xB3788a88F063B217227E27ae16Ba550db3132bE6"
+        "eth:0xB3788a88F063B217227E27ae16Ba550db3132bE6"
      values.getRegisteredAvailabilityVerifiers.0:
-        "0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"
+        "eth:0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"
      values.getRegisteredVerifiers.0:
-        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
+        "eth:0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
      values.implementation:
-        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
+        "eth:0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      values.operators.0:
-        "0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e"
+        "eth:0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e"
      values.orderRegistryAddress:
-        "0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8"
+        "eth:0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8"
      values.tokenAdmins.0:
-        "0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A"
+        "eth:0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A"
      values.tokenAdmins.1:
-        "0xeDb0219557ba13816f1dEb7fA54688362B05A5aE"
+        "eth:0xeDb0219557ba13816f1dEb7fA54688362B05A5aE"
      implementationNames.0x5FDCCA53617f4d2b9134B29090C87D01058e27e9:
-        "Proxy"
      implementationNames.0x4EDD62189732e9fF476ABa880b48c29432A7AC9B:
-        "StarkExchange"
      implementationNames.0x62BCA4DB742A99c834e2c24b609656A70EA25379:
-        "AllVerifiers"
      implementationNames.0x8536850750956c2FEebeCAB786d82271a5467687:
-        "TokensAndRamping"
      implementationNames.0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2:
-        "StarkExState"
      implementationNames.0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1:
-        "ForcedActions"
      implementationNames.0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339:
-        "OnchainVaults"
      implementationNames.0xB3788a88F063B217227E27ae16Ba550db3132bE6:
-        "ProxyUtils"
      implementationNames.eth:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9:
+        "Proxy"
      implementationNames.eth:0x4EDD62189732e9fF476ABa880b48c29432A7AC9B:
+        "StarkExchange"
      implementationNames.eth:0x62BCA4DB742A99c834e2c24b609656A70EA25379:
+        "AllVerifiers"
      implementationNames.eth:0x8536850750956c2FEebeCAB786d82271a5467687:
+        "TokensAndRamping"
      implementationNames.eth:0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2:
+        "StarkExState"
      implementationNames.eth:0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1:
+        "ForcedActions"
      implementationNames.eth:0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339:
+        "OnchainVaults"
      implementationNames.eth:0xB3788a88F063B217227E27ae16Ba550db3132bE6:
+        "ProxyUtils"
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      address:
-        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
+        "eth:0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
      description:
-        "Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`)."
+        "Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`)."
      values.gpsContract:
-        "0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
+        "eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
      implementationNames.0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE:
-        "GpsFactRegistryAdapter"
      implementationNames.eth:0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE:
+        "GpsFactRegistryAdapter"
    }
```

```diff
    EOA  (0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e) {
    +++ description: None
      address:
-        "0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e"
+        "eth:0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e"
    }
```

```diff
    EOA  (0xA28A84676E3Cec39e6F1D06CD0EEF6cAAa2F7f7b) {
    +++ description: None
      address:
-        "0xA28A84676E3Cec39e6F1D06CD0EEF6cAAa2F7f7b"
+        "eth:0xA28A84676E3Cec39e6F1D06CD0EEF6cAAa2F7f7b"
    }
```

```diff
    EOA  (0xAfC4589aF46C72CBF550F2eEAE38c97AeDE15d17) {
    +++ description: None
      address:
-        "0xAfC4589aF46C72CBF550F2eEAE38c97AeDE15d17"
+        "eth:0xAfC4589aF46C72CBF550F2eEAE38c97AeDE15d17"
    }
```

```diff
    EOA  (0xb3538EDB1cD74AE43e0aD25eac6F03553657E3fB) {
    +++ description: None
      address:
-        "0xb3538EDB1cD74AE43e0aD25eac6F03553657E3fB"
+        "eth:0xb3538EDB1cD74AE43e0aD25eac6F03553657E3fB"
    }
```

```diff
    EOA  (0xB71FC111D7BA82D5955BaDdD7717f3467184FF61) {
    +++ description: None
      address:
-        "0xB71FC111D7BA82D5955BaDdD7717f3467184FF61"
+        "eth:0xB71FC111D7BA82D5955BaDdD7717f3467184FF61"
    }
```

```diff
    contract IMXAdminMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      address:
-        "0xD2C37fC6fD89563187f3679304975655e448D192"
+        "eth:0xD2C37fC6fD89563187f3679304975655e448D192"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x37AC4a9Bf184aa1130016525631f3Daec11f7b26"
+        "eth:0x37AC4a9Bf184aa1130016525631f3Daec11f7b26"
      values.$members.1:
-        "0x3d395f623D8954d71132F5caC10778CA275806e0"
+        "eth:0x3d395f623D8954d71132F5caC10778CA275806e0"
      values.$members.2:
-        "0xdb6c271060571A96A62E3947E373395C89f765Ba"
+        "eth:0xdb6c271060571A96A62E3947E373395C89f765Ba"
      values.$members.3:
-        "0xA28A84676E3Cec39e6F1D06CD0EEF6cAAa2F7f7b"
+        "eth:0xA28A84676E3Cec39e6F1D06CD0EEF6cAAa2F7f7b"
      values.$members.4:
-        "0x296A19A4e87F5824DBE8DEd53415A4704538bB30"
+        "eth:0x296A19A4e87F5824DBE8DEd53415A4704538bB30"
      values.$members.5:
-        "0xb3538EDB1cD74AE43e0aD25eac6F03553657E3fB"
+        "eth:0xb3538EDB1cD74AE43e0aD25eac6F03553657E3fB"
      implementationNames.0xD2C37fC6fD89563187f3679304975655e448D192:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xD2C37fC6fD89563187f3679304975655e448D192:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xdb6c271060571A96A62E3947E373395C89f765Ba) {
    +++ description: None
      address:
-        "0xdb6c271060571A96A62E3947E373395C89f765Ba"
+        "eth:0xdb6c271060571A96A62E3947E373395C89f765Ba"
    }
```

```diff
    EOA  (0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A) {
    +++ description: None
      address:
-        "0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A"
+        "eth:0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A"
    }
```

```diff
    EOA  (0xeDb0219557ba13816f1dEb7fA54688362B05A5aE) {
    +++ description: None
      address:
-        "0xeDb0219557ba13816f1dEb7fA54688362B05A5aE"
+        "eth:0xeDb0219557ba13816f1dEb7fA54688362B05A5aE"
    }
```

```diff
    EOA  (0xfF506616E8C53EE5e513b906AC00B5D76664C537) {
    +++ description: None
      address:
-        "0xfF506616E8C53EE5e513b906AC00B5D76664C537"
+        "eth:0xfF506616E8C53EE5e513b906AC00B5D76664C537"
    }
```

```diff
+   Status: CREATED
    contract DACommittee (0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295)
    +++ description: Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 5.
```

```diff
+   Status: CREATED
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8)
    +++ description: Helper contract for registering limit orders from L1.
```

```diff
+   Status: CREATED
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9)
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
```

```diff
+   Status: CREATED
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE)
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
```

```diff
+   Status: CREATED
    contract IMXAdminMultisig (0xD2C37fC6fD89563187f3679304975655e448D192)
    +++ description: None
```

Generated with discovered.json: 0x33eb6a36c4dbf10bc805e17b9e732643f2b3ec89

# Diff at Fri, 04 Jul 2025 12:19:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 21995398
- current block number: 21995398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995398 (main branch discovery), not current.

```diff
    EOA  (0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
+        "eth:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
    }
```

```diff
    contract IMXAdminMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
+        "eth:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
      receivedPermissions.1.from:
-        "ethereum:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
+        "eth:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
      receivedPermissions.2.from:
-        "ethereum:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
+        "eth:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
    }
```

```diff
    EOA  (0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
+        "eth:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
    }
```

```diff
    EOA  (0xeDb0219557ba13816f1dEb7fA54688362B05A5aE) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
+        "eth:0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
    }
```

Generated with discovered.json: 0xafbcfeab955fa4e126213d96d6053c805326916c

# Diff at Tue, 27 May 2025 08:27:16 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 21995398
- current block number: 21995398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995398 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      sourceHashes.7:
-        "0x93b21bfbef09c4e60d6a17309877245220508c54478159a8f2b9dbfb60576c4b"
      sourceHashes.6:
-        "0x452c4b92e2f090f2979fe1dec4ee28bf8b9c431b96b67966a3c2279f9e332684"
      sourceHashes.5:
-        "0xf615d0291aa23f36d8cb749e3950b549d57d38bfef0c342331d0cedd7d769026"
      sourceHashes.4:
-        "0x7e358cdedbf8af25ae12a5fe965db091c7751aafa68c2460ab43e81a8eb364b9"
      sourceHashes.3:
-        "0x54407214d4211e41ecb742c3df7564e352844c1f5da38ef2e206b0465bd5345b"
      sourceHashes.2:
-        "0x105353ea24f9e10459c2487f227bc285c4ca2317fac8e12a8b936bc92329aea5"
      sourceHashes.0:
-        "0x497eebe95d8d7611823ffcb6cc098a9c3c71e91941026f2b4c4989d6f9fa944d"
+        "0xfaa0bf87cf9230ba5a3f5530b447f76606e0cd9fb9d1acd2f3b87d30884e63d1"
    }
```

Generated with discovered.json: 0xdce0cc333f75d3dcc877376b582abd4424f38708

# Diff at Fri, 23 May 2025 09:40:57 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21995398
- current block number: 21995398

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995398 (main branch discovery), not current.

```diff
    EOA  (0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e) {
    +++ description: None
      receivedPermissions.0.role:
+        ".operators"
    }
```

```diff
    contract IMXAdminMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      receivedPermissions.2.role:
+        ".$admin"
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    EOA  (0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A) {
    +++ description: None
      receivedPermissions.0.role:
+        ".tokenAdmins"
    }
```

```diff
    EOA  (0xeDb0219557ba13816f1dEb7fA54688362B05A5aE) {
    +++ description: None
      receivedPermissions.0.role:
+        ".tokenAdmins"
    }
```

Generated with discovered.json: 0x8f78f7a9ca5679e9f97d3c3d48d4a41b78af0792

# Diff at Tue, 29 Apr 2025 08:19:04 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21995398
- current block number: 21995398

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995398 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions:
-        [{"permission":"governStarknet","to":"0xD2C37fC6fD89563187f3679304975655e448D192","via":[]},{"permission":"interact","to":"0xD2C37fC6fD89563187f3679304975655e448D192","description":"manage the token admin role.","via":[]},{"permission":"interact","to":"0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]},{"permission":"interact","to":"0xeDb0219557ba13816f1dEb7fA54688362B05A5aE","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]},{"permission":"operateStarkEx","to":"0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e","via":[]},{"permission":"upgrade","to":"0xD2C37fC6fD89563187f3679304975655e448D192","delay":1209600,"via":[]}]
    }
```

Generated with discovered.json: 0xf449cc7bce673a4bac217ec142a2266d6bf4dffd

# Diff at Thu, 27 Mar 2025 11:14:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21995398
- current block number: 21995398

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995398 (main branch discovery), not current.

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      usedTypes.0.arg.2397984267054479079853548842566103781972463965746662494980785692480538410509:
-        "StarkNet OS (Starknet)"
+        "StarkNet OS (since v0.13.3)"
      usedTypes.0.arg.273279642033703284306509103355536170486431195329675679055627933497997642494:
+        "Starknet Aggregator (since v0.13.4)"
      usedTypes.0.arg.2231644845387633655859130162745748394456578773184260372693322394988769337368:
+        "StarkNet OS (since v0.13.4)"
    }
```

Generated with discovered.json: 0x2f701ef300985fdd72c5f21411a298c69d67ca45

# Diff at Wed, 19 Mar 2025 13:04:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21995398
- current block number: 21995398

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995398 (main branch discovery), not current.

```diff
    contract IMXAdminMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xf5d6bc4000049be43e561287fe6e95a7879c9907

# Diff at Tue, 11 Mar 2025 16:09:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b567159bfa1d1fb03ba2dbc6915b5acc47e00c0 block: 21995398
- current block number: 21995398

## Description

config: starknet/ex operator role description updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21995398 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.4.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

```diff
    contract undefined (0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e) {
    +++ description: None
      receivedPermissions.0.permission:
-        "operateStarknet"
+        "operateStarkEx"
    }
```

Generated with discovered.json: 0xe88a958e4eedd69310bf4ad0e6cff1c13071b0f6

# Diff at Fri, 07 Mar 2025 13:48:16 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 21981175
- current block number: 21995398

## Description

MS: single member change.

## Watched changes

```diff
    contract IMXAdminMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      values.$members.5:
-        "0xbD8Dc294478ec4dAd9f1b4596bf275f4d0309817"
+        "0xb3538EDB1cD74AE43e0aD25eac6F03553657E3fB"
    }
```

Generated with discovered.json: 0xe701381bf94f5120bc4d92ab3b175a717573316d

# Diff at Thu, 06 Mar 2025 15:18:38 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21981175
- current block number: 21981175

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21981175 (main branch discovery), not current.

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      values.programHashMapped:
-        "3485280386001712778192330279103973322645241679001461923469191557000342180556"
+        "StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"15787695375210609250491147414005894154890873413229882671403677761527504080":"Starknet Aggregator (since v0.13.3)","2397984267054479079853548842566103781972463965746662494980785692480538410509":"StarkNet OS (Starknet)","853638403225561750106379562222782223909906501242604214771127703946595519856":"StarkNet OS (Paradex)","3383082961563516565935611087683915026448707331436034043529592588079494402084":"StarkNet OS (old Paradex, old StarkNet)","3485280386001712778192330279103973322645241679001461923469191557000342180556":"StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)","770346231394331402493200980986217737662224545740427952627288191358999988146":"ApeX-USDT","3174901404014912024702042974619036870715605532092680335571201877913899936957":"StarkEx Spot v4.0 (RhinoFi, Sorare)","16830627573509542901909952446321116535677491650708854009406762893086223513":"StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)","2530337539466159944237001094809327283009177793361359619481044346150483328860":"ApeX-USDC 20250130","3114724292040200590153042023978438629733352741898912919152162079752811928849":"StarkEx Perp v2.0 ApeX-USDC","217719352201300445998518619904782191262194843262573339166404641663770051805":"StarkNet (old)","3003515909324298587247571665454372831319437787162989623104387385306791861180":"StarkNet (old)","1161178844461337253856226043908368523817098764221830529880464854589141231910":"StarkNet Aggregator (old)","1921772108187713503530008849184725638117898887391063185252422808224349294626":"StarkNet (old)","3258367057337572248818716706664617507069572185152472699066582725377748079373":"StarkNet (old)","407700941260678649793204927710478760533239334662847444187959202896452163393":"StarkNet (old)","1865367024509426979036104162713508294334262484507712987283009063059134893433":"StarkNet (old)","54878256403880350656938046611252303365750679698042371543935159963667935317":"StarkNet (old)","2479841346739966073527450029179698923866252973805981504232089731754042431018":"StarkNet (old)","109586309220455887239200613090920758778188956576212125550190099009305121410":"StarkNet (old)"}}]
    }
```

Generated with discovered.json: 0x504ae4df134fe60e0f152d6708a4e38d557d6af0

# Diff at Wed, 05 Mar 2025 14:07:29 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e85261cbf7cfc5afeac755b44f9df82c8a3c4ba block: 21387345
- current block number: 21981175

## Description

discodrive starkExes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387345 (main branch discovery), not current.

```diff
    contract DACommittee (0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295) {
    +++ description: Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 5.
      name:
-        "Committee"
+        "DACommittee"
      template:
+        "starkex/Committee"
      description:
+        "Data Availability Committee (DAC) contract verifying and storing data availability claims from DAC Members (via a multisignature check). The threshold of valid signatures is 5."
      fieldMeta:
+        {"constructorArgs":{"description":"Includes DAC members and threshold."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: Helper contract for registering limit orders from L1.
      template:
+        "starkex/OrderRegistry"
      description:
+        "Helper contract for registering limit orders from L1."
    }
```

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0xD2C37fC6fD89563187f3679304975655e448D192","delay":1209600,"via":[]}
      issuedPermissions.4:
+        {"permission":"operateStarknet","to":"0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e","via":[]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0xeDb0219557ba13816f1dEb7fA54688362B05A5aE","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A","description":"Can regsiter new tokens for deposits and withdrawals.","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0xD2C37fC6fD89563187f3679304975655e448D192","description":"manage the token admin role.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      values.OPERATORS:
-        ["0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e"]
      values.operators:
+        ["0x9B7f7d0d23d4CAce5A3157752D0D4e4bf25E927e"]
      values.tokenAdmins:
+        ["0xdc1bFbC2B8f01439eEea8e4659bbb452D0f9eE2A","0xeDb0219557ba13816f1dEb7fA54688362B05A5aE"]
      values.UPGRADE_DELAY_SLOT:
+        "0xc21dbb3089fcb2c4f4c6a67854ab4db2b0f233ea4b21b21f912d52d18fc5db1f"
      fieldMeta.$admin:
+        {"severity":"HIGH","description":"Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts."}
      fieldMeta.isFinalized:
+        {"severity":"HIGH","description":"Finalizes most of the configuration of the contract, which cannot be changed afterwards (only thorugh an upgrade)."}
      template:
+        "starkex/StarkExchange"
      description:
+        "Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`).
      values.programHashMapped:
+        "3485280386001712778192330279103973322645241679001461923469191557000342180556"
      template:
+        "starkex/GpsFactRegistryAdapter"
      description:
+        "Adapter between the core contract and the 0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`3485280386001712778192330279103973322645241679001461923469191557000342180556`)."
    }
```

```diff
    contract IMXAdminMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      name:
-        "IMXProxyGovernanceMultisig2"
+        "IMXAdminMultisig"
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0x5FDCCA53617f4d2b9134B29090C87D01058e27e9","delay":1209600}
      receivedPermissions.1:
+        {"permission":"interact","from":"0x5FDCCA53617f4d2b9134B29090C87D01058e27e9","description":"manage the token admin role."}
      receivedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      severity:
+        "HIGH"
    }
```

Generated with discovered.json: 0x297af54cd97a1a67d5d6d63d86f444685b6a6f23

# Diff at Tue, 04 Mar 2025 10:39:16 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21387345
- current block number: 21387345

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387345 (main branch discovery), not current.

```diff
    contract Committee (0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295) {
    +++ description: None
      sinceBlock:
+        12107592
    }
```

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: None
      sinceBlock:
+        12831566
    }
```

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      sinceBlock:
+        12011518
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: None
      sinceBlock:
+        13849860
    }
```

```diff
    contract IMXProxyGovernanceMultisig2 (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      sinceBlock:
+        18816399
    }
```

Generated with discovered.json: 0x0dc28e635561479f5220d2326f983a93cc261f35

# Diff at Mon, 20 Jan 2025 11:09:36 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21387345
- current block number: 21387345

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387345 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD2C37fC6fD89563187f3679304975655e448D192"
      issuedPermissions.0.to:
+        "0xD2C37fC6fD89563187f3679304975655e448D192"
    }
```

```diff
    contract IMXProxyGovernanceMultisig2 (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
      receivedPermissions.0.from:
+        "0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"
    }
```

Generated with discovered.json: 0xbd9548fa6861c96f6b104fd0b3ea89441ae80b15

# Diff at Thu, 12 Dec 2024 15:33:43 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21334467
- current block number: 21387345

## Description

Removed Multisig1 as admin of StarkExchange, now admin is only Multisig2.

## Watched changes

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xD2C37fC6fD89563187f3679304975655e448D192","via":[]}
      issuedPermissions.0.target:
-        "0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91"
+        "0xD2C37fC6fD89563187f3679304975655e448D192"
      values.$admin:
-        ["0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91","0xD2C37fC6fD89563187f3679304975655e448D192"]
+        "0xD2C37fC6fD89563187f3679304975655e448D192"
    }
```

```diff
-   Status: DELETED
    contract IMXProxyGovernanceMultisig1 (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafe.sol => /dev/null                    | 953 ---------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |  35 -
 2 files changed, 988 deletions(-)
```

Generated with discovered.json: 0x05d320eff815b3c241c92574418be87d8d86f1d6

# Diff at Thu, 05 Dec 2024 06:21:13 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 19910271
- current block number: 21334467

## Description

Second Governor MS added.

## Watched changes

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xD2C37fC6fD89563187f3679304975655e448D192","via":[]}
      values.$admin:
-        "0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91"
+        ["0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91","0xD2C37fC6fD89563187f3679304975655e448D192"]
    }
```

```diff
+   Status: CREATED
    contract IMXProxyGovernanceMultisig2 (0xD2C37fC6fD89563187f3679304975655e448D192)
    +++ description: None
```

## Source code changes

```diff
.../IMXProxyGovernanceMultisig2/GnosisSafe.sol     | 953 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |  35 +
 2 files changed, 988 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract IMXProxyGovernanceMultisig1 (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      name:
-        "ProxyGovernanceMultisig"
+        "IMXProxyGovernanceMultisig1"
    }
```

Generated with discovered.json: 0xd4d8b2065a48ffd2e041bd13b7f423fd023fda45

# Diff at Mon, 21 Oct 2024 11:06:37 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
      values.$pastUpgrades.7.1:
-        ["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]
+        "0x3425fd24435e4aefdb08f3970e61e446eb5d21a1e0c916d1ba9331b060b72192"
      values.$pastUpgrades.6.2:
+        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
      values.$pastUpgrades.6.1:
-        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
+        "0x658a93571ca9733ba346bd746790a6d07821d86c89fd90809e85bf7f2f8d9797"
      values.$pastUpgrades.5.2:
+        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
      values.$pastUpgrades.5.1:
-        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
+        "0xeaa0efb3937eee43c1083cc776d5033b131e6ef12ba0d0646db1b34e600847cd"
      values.$pastUpgrades.4.2:
+        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
      values.$pastUpgrades.4.1:
-        ["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]
+        "0x26fb60bb6b5ff3ef22cd959d007588f7410586499870411cfddc2759b97d44d6"
      values.$pastUpgrades.3.2:
+        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
      values.$pastUpgrades.3.1:
-        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
+        "0x9e8cc538b40a70723a287ece3ecb4e6aafbbde0e04f621124df6e4c2d7995dc7"
      values.$pastUpgrades.2.2:
+        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
      values.$pastUpgrades.2.1:
-        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
+        "0x79f72bef0984e3ae76ab638c078f92f1a0d4ad2a289b8a91e072d81f77d505ce"
      values.$pastUpgrades.1.2:
+        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
      values.$pastUpgrades.1.1:
-        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
+        "0xf42d8fc579401fc76769bf63ba72f7277aac976aeb2a4cd3eca899ca08de7c20"
      values.$pastUpgrades.0.2:
+        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
      values.$pastUpgrades.0.1:
-        ["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]
+        "0x9b57c19aa91cc17c9487085b68532cd65d1e4c263b5928f14c03a9d36c9097df"
    }
```

Generated with discovered.json: 0x0b4eae0728c45a50319f9711c9d0ad57226b99eb

# Diff at Mon, 14 Oct 2024 10:51:41 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract Committee (0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295) {
    +++ description: None
      sourceHashes:
+        ["0x83a4f7af4e5a371aadb57903aed1b1f96556a0b3eb4665044a65ad8f70a89edc"]
    }
```

```diff
    contract OrderRegistry (0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8) {
    +++ description: None
      sourceHashes:
+        ["0x1e28fda3c245bc1fc13d0ddc7b108be510d1e0220fc67552921c87724bb45a4c"]
    }
```

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      sourceHashes:
+        ["0xc527211f14e6fa12809b6b7ec28c6757daa907478cefeb1b8835ee7d47139bf7","0x54407214d4211e41ecb742c3df7564e352844c1f5da38ef2e206b0465bd5345b","0x497eebe95d8d7611823ffcb6cc098a9c3c71e91941026f2b4c4989d6f9fa944d","0x452c4b92e2f090f2979fe1dec4ee28bf8b9c431b96b67966a3c2279f9e332684","0xf615d0291aa23f36d8cb749e3950b549d57d38bfef0c342331d0cedd7d769026","0x7e358cdedbf8af25ae12a5fe965db091c7751aafa68c2460ab43e81a8eb364b9","0x105353ea24f9e10459c2487f227bc285c4ca2317fac8e12a8b936bc92329aea5","0x93b21bfbef09c4e60d6a17309877245220508c54478159a8f2b9dbfb60576c4b"]
    }
```

```diff
    contract GpsFactRegistryAdapter (0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE) {
    +++ description: None
      sourceHashes:
+        ["0x3c0fff412189244728e9be021e2c7a1084326cc80e71f930221094909caafec0"]
    }
```

```diff
    contract ProxyGovernanceMultisig (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0xca735c63b7c72599c497b10a305c0858711760e9

# Diff at Tue, 01 Oct 2024 10:51:34 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-03-10T15:13:08.000Z",["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]],["2021-03-16T18:04:39.000Z",["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]],["2021-03-25T11:24:15.000Z",["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]],["2021-03-26T08:01:31.000Z",["0x49401Ddc4E0A858B5B4cf3D6De38393B7fAC7378","0x61d3389Aa2d001c860859cC021153e40D557BF4b","0xA4E9524EfbA0CB6BD7474a48C14582dEb300469E","0xedB67D40161D9fa660DCFFE60f859B7381E4793a"]],["2021-08-31T08:15:29.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2021-09-09T16:30:02.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2022-01-13T08:08:51.000Z",["0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC","0xF65C115efd24102315Af53f84aD65aD240bc9D57","0x97AA9658cfE27D6382b71FF9E72d773615Bd529E","0x86d8f977C9cEC503ad4E6805802cEf62Cde13773","0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A","0x2D542881E93491e765E5110c1e373FC2968E720A","0x970d1Fa79c64b256ef68bBFEab34137786811C7F"]],["2024-05-20T06:39:35.000Z",["0x4EDD62189732e9fF476ABa880b48c29432A7AC9B","0x62BCA4DB742A99c834e2c24b609656A70EA25379","0x8536850750956c2FEebeCAB786d82271a5467687","0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2","0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1","0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339","0xB3788a88F063B217227E27ae16Ba550db3132bE6"]]]
      values.$upgradeCount:
+        8
    }
```

Generated with discovered.json: 0x3803430281e1224e46d9b971d95cb2ce6d05b9b8

# Diff at Fri, 30 Aug 2024 07:53:08 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract ProxyGovernanceMultisig (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x26682f220e653dc661816cc24fdd06627bcf798a

# Diff at Wed, 21 Aug 2024 10:03:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91","via":[]}]
    }
```

```diff
    contract ProxyGovernanceMultisig (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5FDCCA53617f4d2b9134B29090C87D01058e27e9","via":[]}]
    }
```

Generated with discovered.json: 0xc6b0a2b8d66394ef77e047fdc18f73f07d67997b

# Diff at Fri, 09 Aug 2024 10:09:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract ProxyGovernanceMultisig (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"]
      assignedPermissions.upgrade:
+        ["0x5FDCCA53617f4d2b9134B29090C87D01058e27e9"]
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x59232aC80E6d403b6381393e52f4665ECA328558","0x0405107a60391Eb51821be373ff978115Ee58488","0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x59232aC80E6d403b6381393e52f4665ECA328558","0x0405107a60391Eb51821be373ff978115Ee58488","0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xbf9e7b973e90203b4d7681284b5a42431294f2e7

# Diff at Tue, 30 Jul 2024 11:12:03 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 19910271
- current block number: 19910271

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910271 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      fieldMeta:
+        {"DEPOSIT_CANCEL_DELAY":{"description":"The time delay required before canceled deposits to the L2 can be reclaimed."}}
    }
```

Generated with discovered.json: 0x31ba0c8d41aae8b994281974a65468f6448d1593

# Diff at Mon, 20 May 2024 09:34:20 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7e20051208df39f6d4f6d35a22cb1356bd1b211c block: 19825366
- current block number: 19910271

## Description

Starkex diamond contracts are upgraded to [version 4.0.1](https://github.com/starkware-libs/starkex-contracts/releases).

- Removed the need to register users (Registration is now only required for deposit cancellation and escape flows.)
- Slight change to the way the hash message for on-chain registration is calculated.

### AllVerifiers.2.sol

- formatting
- uncheckedTokenContractCall() removed

### TokensAndRamping.3.sol

Change to the way the hash message for on-chain registration is calculated. (ownerKey vs ethKey)

- formatting
- withdrawTo(), withdrawNftTo(), is now withdraw(), withdrawNft()
- EllipticCurve lib added
- registerUser() is now registerAdddress() and using `ECDSA.verify`
- starkKey is now ownerKey

### Other diamond facets

- formatting and minor changes

### DepositCancelDelay

- Reduced from 3 days to 2 days.

## Watched changes

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      upgradeability.implementation:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      upgradeability.facets.StarkWare_AllVerifiers_2020_1:
-        "0xF65C115efd24102315Af53f84aD65aD240bc9D57"
+        "0x62BCA4DB742A99c834e2c24b609656A70EA25379"
      upgradeability.facets.StarkWare_TokensAndRamping_2020_1:
-        "0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
+        "0x8536850750956c2FEebeCAB786d82271a5467687"
      upgradeability.facets.StarkWare_StarkExState_2021_1:
-        "0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
+        "0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
      upgradeability.facets.StarkWare_ForcedActions_2020_1:
-        "0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
+        "0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
      upgradeability.facets.StarkWare_OnchainVaults_2021_1:
-        "0x2D542881E93491e765E5110c1e373FC2968E720A"
+        "0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
      upgradeability.facets.StarkWare_ProxyUtils_2021_1:
-        "0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
+        "0xB3788a88F063B217227E27ae16Ba550db3132bE6"
      implementations.6:
-        "0x970d1Fa79c64b256ef68bBFEab34137786811C7F"
+        "0xB3788a88F063B217227E27ae16Ba550db3132bE6"
      implementations.5:
-        "0x2D542881E93491e765E5110c1e373FC2968E720A"
+        "0x1688abB0B5c72F34B7f78e857Aa317deD5B5D339"
      implementations.4:
-        "0x0D7c8d7A16c7832869d8FeEf02730238CdFe083A"
+        "0x3799ad2a4Eb4E882219B02C036656d4ECbD437A1"
      implementations.3:
-        "0x86d8f977C9cEC503ad4E6805802cEf62Cde13773"
+        "0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2"
      implementations.2:
-        "0x97AA9658cfE27D6382b71FF9E72d773615Bd529E"
+        "0x8536850750956c2FEebeCAB786d82271a5467687"
      implementations.1:
-        "0xF65C115efd24102315Af53f84aD65aD240bc9D57"
+        "0x62BCA4DB742A99c834e2c24b609656A70EA25379"
      implementations.0:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
+++ description: The time delay required before canceled deposits to the L2 can be reclaimed.
      values.DEPOSIT_CANCEL_DELAY:
-        259200
+        172800
      values.implementation:
-        "0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC"
+        "0x4EDD62189732e9fF476ABa880b48c29432A7AC9B"
      values.VERSION:
-        "3.0.3"
+        "4.0.1"
    }
```

## Source code changes

```diff
.../StarkExchange/AllVerifiers.2.sol               |  301 ++---
 .../StarkExchange/ForcedActions.5.sol              |  291 ++---
 .../StarkExchange/OnchainVaults.6.sol              |  349 +++---
 .../StarkExchange/ProxyUtils.7.sol                 |  124 +-
 .../StarkExchange/StarkExState.4.sol               |  631 ++++------
 .../StarkExchange/StarkExchange.1.sol              |  272 ++---
 .../StarkExchange/TokensAndRamping.3.sol           | 1245 ++++++++++++--------
 7 files changed, 1565 insertions(+), 1648 deletions(-)
```

Generated with discovered.json: 0x8a763974559283af9b7c5b24360ce3bc57897fa7

# Diff at Wed, 08 May 2024 12:33:48 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624857
- current block number: 19825366

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624857 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"
+        ["0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"]
      values.getRegisteredVerifiers:
-        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
+        ["0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"]
    }
```

Generated with discovered.json: 0x7e2b16f28a98ef801db7980deb7a3a2b67443f77

# Diff at Wed, 10 Apr 2024 11:13:38 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19531600
- current block number: 19624857

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531600 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"]
+        "0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295"
      values.getRegisteredVerifiers:
-        ["0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"]
+        "0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE"
    }
```

Generated with discovered.json: 0x53e73e587add20d50b8d83a526d3972896bd2f2e

# Diff at Thu, 28 Mar 2024 09:04:54 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 18263193
- current block number: 19531600

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18263193 (main branch discovery), not current.

```diff
    contract ProxyGovernanceMultisig (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xc73beedc2abdbc04f79f75ef808ea7a26804e89f

# Diff at Mon, 02 Oct 2023 13:37:55 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract GnosisSafe (0x9C41deab42Bae7c0ec4DB3cECc0faD86F4D6EC91) {
      name:
-        "GnosisSafe"
+        "ProxyGovernanceMultisig"
      derivedName:
+        "GnosisSafe"
    }
```

