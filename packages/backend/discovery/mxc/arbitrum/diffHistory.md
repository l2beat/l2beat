Generated with discovered.json: 0xe4c10add7ed56d1088ecda3abea93cc255f9272e

# Diff at Fri, 12 Jul 2024 10:38:17 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7a68cbd10d944bed044cb2fbdb36edb934444874 block: 218960264
- current block number: 231400125

## Description

Contracts are now verified --> `isUnderReview: true`.

## Watched changes

```diff
    contract MxcL1Contract? (0x54D8864e8855A7B66eE42B8F2Eaa0F2E06bd641a) {
    +++ description: None
      values.getProposeReward:
-        "872730000000000000000"
+        "279050000000000000000"
      values.getStateVariables.accBlockFees:
-        4719790000196
+        5215420000196
      values.getStateVariables.numBlocks:
-        472316
+        521879
      values.getStateVariables.accProposedAt:
-        804584809225936
+        889796439941942
      values.state.totalStakeMxcTokenBalances:
-        "5952788099998040000000000"
+        "5947831799998040000000000"
      values.state.prevBaseFee:
-        17300
+        12312
      values.state.accProposedAt:
-        804584809225936
+        889796439941942
      values.state.accBlockFees:
-        4719790000196
+        5215420000196
      values.state.numBlocks:
-        472316
+        521879
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 218960264 (main branch discovery), not current.

```diff
    contract MxcL1Contract? (0x54D8864e8855A7B66eE42B8F2Eaa0F2E06bd641a) {
    +++ description: None
      unverified:
-        true
      values.addressManager:
+        "0x931A8fFCcdA64dC441bcca81Bd65Dc0C3d42Af74"
      values.getBlock:
+        [["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000",1689165595],["0xcafb485df368b3305d54c6f1699f59dc3455a15c1e22ecbe491fd8d2630dd500","0x9173C3758e461236F3F03F08A4FAA851dB97d558",1689166261],["0x216f0664c373ef6e3a271052b2bbdac066d411a211af05e31400a5bb16c04c68","0x9173C3758e461236F3F03F08A4FAA851dB97d558",1689166431],["0xbb47ed1b22effb6bba18f08da94f68cc44c562b8f3770ccafe4d34da46250ced","0x9173C3758e461236F3F03F08A4FAA851dB97d558",1689166540],["0x3c55bab6ff144af0b53c02e5232ca0aac1c50a2d2456afa345b39ee7740c91d6","0x9173C3758e461236F3F03F08A4FAA851dB97d558",1689166602]]
      values.getBlockFee:
+        "100000000000000000"
      values.getConfig:
+        {"chainId":18686,"maxNumProposedBlocks":604800,"ringBufferSize":604810,"maxVerificationsPerTx":10,"blockMaxGasLimit":6000000,"maxTransactionsPerBlock":79,"maxBytesPerTxList":120000,"txListCacheExpiry":0,"proofCooldownPeriod":7200,"systemProofCooldownPeriod":3600,"realProofSkipSize":0,"ethDepositGas":21000,"ethDepositMaxFee":"100000000000000000","minEthDepositsPerBlock":1,"maxEthDepositsPerBlock":32,"maxEthDepositAmount":"10000000000000000000000","minEthDepositAmount":"100000000000000000","relaySignalRoot":false}
      values.getCrossChainBlockHash:
+        ["0x0a7c8947d2fb54544adfe9ee539cd90954cc52a4a4dff509fe13972ee19f2eda","0xcc4eea902d4a4a734e3e2902fb921ef72c6f73e80229f2cfd32335094e0a28bd","0x9a3e9a67efab91011cf5d952e20a9a096275d06a1a8df8111222550fbb742a57","0x0df46611e69da035bdb8699de6aad295f789c4ce1728f8532fec31f05ad59184","0x89a606e141cc2a9ae11fe344d3ef0dafc63f715d349732f2abfd1820cea95267"]
      values.getCrossChainSignalRoot:
+        ["0x31ff6509b89854d3aa0e47d8161c7d74a0ce31b18260d545d8e00ea8262d488c","0xc86a941fbb6f78405fa4dc388759642a0f723afada493ee2bff61d9bf773f6d9","0xc86a941fbb6f78405fa4dc388759642a0f723afada493ee2bff61d9bf773f6d9","0xc86a941fbb6f78405fa4dc388759642a0f723afada493ee2bff61d9bf773f6d9","0xc86a941fbb6f78405fa4dc388759642a0f723afada493ee2bff61d9bf773f6d9"]
      values.getProposeReward:
+        "872730000000000000000"
      values.getStateVariables:
+        {"blockFee":10000000,"accBlockFees":4719790000196,"genesisHeight":110450693,"genesisTimestamp":1689165595,"numBlocks":472316,"proofTimeIssued":48429053,"proofTimeTarget":101,"lastVerifiedBlockId":140,"accProposedAt":804584809225936,"nextEthDepositToProcess":0,"numEthDeposits":0}
      values.owner:
+        "0xC6D7522f7B012b22Bc365C9C43b3DBf13B9aAfF9"
      values.state:
+        {"totalStakeMxcTokenBalances":"5952788099998040000000000","genesisHeight":110450693,"genesisTimestamp":1689165595,"adjustmentQuotient":32000,"prevBaseFee":17300,"proposerElectionTimeoutOffset":0,"accProposedAt":804584809225936,"accBlockFees":4719790000196,"numBlocks":472316,"proveMetaReward":0,"blockFee":10000000,"proofTimeIssued":48429053,"lastVerifiedBlockId":140,"proofTimeTarget":101}
      errors:
+        {"getBlock":"Too many values. Update configuration to explore fully","getCrossChainBlockHash":"Too many values. Update configuration to explore fully","getCrossChainSignalRoot":"Too many values. Update configuration to explore fully"}
    }
```

```diff
    contract Bridge? (0xA9c5519a7c1d85fB6d6695853787964a0D3d49A6) {
    +++ description: None
      unverified:
-        true
      values.addressManager:
+        "0x931A8fFCcdA64dC441bcca81Bd65Dc0C3d42Af74"
      values.context:
+        {"msgHash":"0x0000000000000000000000000000000000000000000000000000000000000001","sender":"0x0000000000000000000000000000000000000001","srcChainId":"115792089237316195423570985008687907853269984665640564039457584007913129639935"}
      values.isDestChainEnabled:
+        [false,false,false,false,false]
      values.owner:
+        "0xC6D7522f7B012b22Bc365C9C43b3DBf13B9aAfF9"
      errors:
+        {"isDestChainEnabled":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0xdba659a41615fb784ca6e5024cefa6dfc6c7a31c

# Diff at Thu, 06 Jun 2024 09:21:29 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 218960264

## Description

Initial discovery: Taiko fork on arbitrum with unverified rollup contracts.

## Initial discovery

```diff
+   Status: CREATED
    contract MxcL1Contract? (0x54D8864e8855A7B66eE42B8F2Eaa0F2E06bd641a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager? (0x931A8fFCcdA64dC441bcca81Bd65Dc0C3d42Af74)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge? (0xA9c5519a7c1d85fB6d6695853787964a0D3d49A6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignalService (0xB612eb073ebc8638b8E445D7F15f02400e1d99d8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenVault? (0xC31a6C0C1087BBB6E6660F27014aD1321591c641)
    +++ description: None
```
