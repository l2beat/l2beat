Generated with discovered.json: 0xf27ee85934c0dc2fbfecd1d1d8da4503777c5497

# Diff at Thu, 15 Aug 2024 07:31:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9a07aead4b3726cc622f66fe9a15e06e63af7acd block: 20518997
- current block number: 20532552

## Description

New adapter and L2 crosschain target for Zora were added.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.7777777:
+        "0x024F2fC31CBDD8de17194b1892c834f98Ef5169b"
      values.CrossChainContracts.7777777:
+        "0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
    }
```

```diff
+   Status: CREATED
    contract Zora_Adapter (0x024F2fC31CBDD8de17194b1892c834f98Ef5169b)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Zora_Adapter.sol      | 590 +++++++++++++++++++++
 1 file changed, 590 insertions(+)
```

Generated with discovered.json: 0xe9a9d7fdf87c58268c0949602f8942688583b6ab

# Diff at Tue, 13 Aug 2024 10:06:57 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@8b923f6edf399d43a5cd7f331708956dce3e83d1 block: 20482283
- current block number: 20518997

## Description

The Spoke pool (used for liquidity on the destination chains) was changed for the Redstone Adapter.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.CrossChainContracts.690:
-        "0x28077B47Cd03326De7838926A63699849DD4fa87"
+        "0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
    }
```

Generated with discovered.json: 0x268645e90c13973d8d0e1a6b1dd839737c270f02

# Diff at Fri, 09 Aug 2024 10:08:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20482283
- current block number: 20482283

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20482283 (main branch discovery), not current.

```diff
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5","0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d","0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05","0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5","0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d","0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05","0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract HubPool Multisig (0xB524735356985D2f267FA010D681f061DfF03715) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05","0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe","0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9","0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d","0x868CF19464e17F76D6419ACC802B122c22D2FD34"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05","0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe","0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9","0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d","0x868CF19464e17F76D6419ACC802B122c22D2FD34"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"]
      assignedPermissions.upgrade:
+        ["0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"]
    }
```

Generated with discovered.json: 0x694b66df3231b8a4fe6cb923963e8254b05ba3e1

# Diff at Thu, 08 Aug 2024 07:11:14 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@5a17db968badca34a66703637dabf76a313bb43e block: 20389580
- current block number: 20482283

## Description

A new Adapter and L2 crosschain target for Redstone are added.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.690:
+        "0x188F8C95B7cfB7993B53a4F643efa687916f73fA"
      values.CrossChainContracts.690:
+        "0x28077B47Cd03326De7838926A63699849DD4fa87"
    }
```

```diff
+   Status: CREATED
    contract Redstone_Adapter (0x188F8C95B7cfB7993B53a4F643efa687916f73fA)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Redstone_Adapter.sol  | 590 +++++++++++++++++++++
 1 file changed, 590 insertions(+)
```

Generated with discovered.json: 0xdbd5447e307a5f0e39981d7b5ea954532dc92555

# Diff at Fri, 26 Jul 2024 08:38:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20289714
- current block number: 20389580

## Description

A new Adapter and L2 crosschain target for Scroll is registered.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.534352:
+        "0xb6129Ab69aEA75e6884c2D6ecf25293C343C519F"
      values.CrossChainContracts.534352:
+        "0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
    }
```

```diff
+   Status: CREATED
    contract Scroll_Adapter (0xb6129Ab69aEA75e6884c2D6ecf25293C343C519F)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Scroll_Adapter.sol    | 531 +++++++++++++++++++++
 1 file changed, 531 insertions(+)
```

Generated with discovered.json: 0x5bed7c1b5746cf1f6518eef6a73859844d4d86c8

# Diff at Fri, 12 Jul 2024 10:06:36 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@48ec906f1df3ec8351c0e2324170592091f7c1db block: 20232297
- current block number: 20289714

## Description

An adapter for Blast L2 is added.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.81457:
+        "0xF2bEf5E905AAE0295003ab14872F811E914EdD81"
      values.CrossChainContracts.81457:
+        "0x2D509190Ed0172ba588407D4c2df918F955Cc6E1"
    }
```

```diff
+   Status: CREATED
    contract Blast_Adapter (0xF2bEf5E905AAE0295003ab14872F811E914EdD81)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Blast_Adapter.sol     | 601 +++++++++++++++++++++
 1 file changed, 601 insertions(+)
```

Generated with discovered.json: 0xe1c37ec100450be1198b8b4a281461e96e22f4fe

# Diff at Thu, 04 Jul 2024 09:37:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bfc05c606d82c4a38bb3b8c60569f0c976d7ba3a block: 20204613
- current block number: 20232297

## Description

A new adapter for Lisk is registered. Other changes are config related.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.1135:
+        "0x8229E812f20537caA1e8Fb41749b4887B8a75C3B"
      values.CrossChainContracts.1135:
+        "0x9552a0a6624A23B848060AE5901659CDDa1f83f8"
    }
```

```diff
+   Status: CREATED
    contract Lisk_Adapter (0x8229E812f20537caA1e8Fb41749b4887B8a75C3B)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Lisk_Adapter.sol      | 590 +++++++++++++++++++++
 1 file changed, 590 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20204613 (main branch discovery), not current.

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.CrossChainContracts.1:
-        {"l2ChainId":1,"adapter":"0x527E872a5c3f0C7c24Fe33F2593cFB890a285084","spokePool":"0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"}
+        "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
      values.CrossChainContracts.10:
-        {"l2ChainId":10,"adapter":"0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b","spokePool":"0x6f26Bf09B1C792e3228e5467807a900A503c0281"}
+        "0x6f26Bf09B1C792e3228e5467807a900A503c0281"
      values.CrossChainContracts.137:
-        {"l2ChainId":137,"adapter":"0xb4AeF0178f5725392A26eE18684C2aB62adc912e","spokePool":"0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096"}
+        "0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096"
      values.CrossChainContracts.288:
-        {"l2ChainId":288,"adapter":"0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3","spokePool":"0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58"}
+        "0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58"
      values.CrossChainContracts.324:
-        {"l2ChainId":324,"adapter":"0xE233009838CB898b50e0012a6E783FC9FeE447FB","spokePool":"0xE0B015E54d54fc84a6cB9B666099c46adE9335FF"}
+        "0xE0B015E54d54fc84a6cB9B666099c46adE9335FF"
      values.CrossChainContracts.8453:
-        {"l2ChainId":8453,"adapter":"0xE1421233BF7158A19f89F17c9735F9cbd3D9529c","spokePool":"0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"}
+        "0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
      values.CrossChainContracts.34443:
-        {"l2ChainId":34443,"adapter":"0xf1B59868697f3925b72889ede818B9E7ba0316d0","spokePool":"0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"}
+        "0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
      values.CrossChainContracts.42161:
-        {"l2ChainId":42161,"adapter":"0x5473CBD30bEd1Bf97C0c9d7c59d268CD620dA426","spokePool":"0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A"}
+        "0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A"
      values.CrossChainContracts.59144:
-        {"l2ChainId":59144,"adapter":"0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE","spokePool":"0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75"}
+        "0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75"
      values.Adapters:
+        {"1":"0x527E872a5c3f0C7c24Fe33F2593cFB890a285084","10":"0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b","137":"0xb4AeF0178f5725392A26eE18684C2aB62adc912e","288":"0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3","324":"0xE233009838CB898b50e0012a6E783FC9FeE447FB","8453":"0xE1421233BF7158A19f89F17c9735F9cbd3D9529c","34443":"0xf1B59868697f3925b72889ede818B9E7ba0316d0","42161":"0x5473CBD30bEd1Bf97C0c9d7c59d268CD620dA426","59144":"0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE"}
    }
```

Generated with discovered.json: 0x44dcb247700d419ff4f0fe12d00a6c356c1963ba

# Diff at Sun, 30 Jun 2024 12:51:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@60708cb34918009c7ee36a463625bddd2353d3c5 block: 19976242
- current block number: 20204613

## Description

Added ZkSync_Adapter.getL1CallValue to "ignoreMethods" because it is dependent
on tx.gasprice and returns different results event for the same block number
(e.g. when call is batched).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19976242 (main branch discovery), not current.

```diff
    contract ZkSync_Adapter (0xE233009838CB898b50e0012a6E783FC9FeE447FB) {
    +++ description: None
      values.getL1CallValue:
-        500000000000000
    }
```

Generated with discovered.json: 0x4d7efdd31fe5b56bea03552b2c01f60249641603

# Diff at Wed, 29 May 2024 14:54:44 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19926192
- current block number: 19976242

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19926192 (main branch discovery), not current.

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
    }
```

Generated with discovered.json: 0x00e7d86c9c32ebac36ad2111ea5369e41a1d7770

# Diff at Wed, 22 May 2024 15:04:33 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@50042c8a4f2960931acbddbdf0949924bc003bcb block: 19891034
- current block number: 19926192

## Description

Added Mode adapter.
Changes to Polygon, Arbitrum, Optimism, Base adapters. 
    -  Added check for maximum burn amount for token per message on CCTP adapter. If the token amount to send exceeds the burn limit per message, then it will split the message into smaller parts.
New adapters implementation addresses broke config ignoreRelatives mapping, fixed now.


## Watched changes

```diff
-   Status: DELETED
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MessageTransmitter (0x0a992d191DEeC32aFe36203Ad87D7d289a738F81)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StateSender (0x28e4F3a7f651294B9564800b2D01f35189A5bFbE)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WithdrawManager (0x2A88696e0fFA76bAA1338F2C74497cC013495922)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Registry (0x33a02E6cC863D393d6Bf231B697b82F6e499cA71)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SynthetixBridgeToOptimism (0x39Ea01a0298C315d149a490E34B59Dbf2EC7e48F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DepositManager (0x401F6c983eA34274ec46f84D70b31C151321188b)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1Escrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ReadProxy (0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Dai (0x6B175474E89094C44Da98b954EedeAC495271d0F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Governance (0x6e7a5820baD6cebA8Ef5ea69c0C92EbbDAc9CE48)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MaticToken (0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AddressResolver (0x823bE81bbF96BEc0e25CA13170F5AaCb5B79ba83)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Arbitrum_Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract RootChain (0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FiatTokenV2_2 (0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
    +++ description: None
```

```diff
-   Status: DELETED
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MaticWETH (0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MerklePatriciaProof (0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Polygon_Adapter (0xB130E3056D5C692300d66c12C10ffA2073d9424D)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Optimism_Adapter (0xb3a4e39F0CD9aBAc5d866f023C18e73224667Fee)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TokenMessenger (0xBd3fa81B58Ba92a82136038B25aDec7066af3155)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyERC20 (0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.CrossChainContracts.10.adapter:
-        "0xb3a4e39F0CD9aBAc5d866f023C18e73224667Fee"
+        "0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b"
      values.CrossChainContracts.137.adapter:
-        "0xB130E3056D5C692300d66c12C10ffA2073d9424D"
+        "0xb4AeF0178f5725392A26eE18684C2aB62adc912e"
      values.CrossChainContracts.8453.adapter:
-        "0xD9948AE3405FE03A52A18F119EF72221DCdCc4df"
+        "0xE1421233BF7158A19f89F17c9735F9cbd3D9529c"
      values.CrossChainContracts.42161.adapter:
-        "0xd881A21F17B83AefFd11cc2e7363740449eb8069"
+        "0x5473CBD30bEd1Bf97C0c9d7c59d268CD620dA426"
      values.CrossChainContracts.34443:
+        {"l2ChainId":34443,"adapter":"0xf1B59868697f3925b72889ede818B9E7ba0316d0","spokePool":"0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"}
    }
```

```diff
-   Status: DELETED
    contract TokenMinter (0xc4922d64a24675E16e1586e3e3Aa56C06fABe907)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Synthetix (0xd711709eFc452152B7ad11DbD01ed4B69c9421B3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Arbitrum_Adapter (0xd881A21F17B83AefFd11cc2e7363740449eb8069)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Base_Adapter (0xD9948AE3405FE03A52A18F119EF72221DCdCc4df)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xD9c7C4ED4B66858301D0cb28Cc88bf655Fe34861)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MasterMinter (0xE982615d461DD5cD06575BbeA87624fda4e3de17)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xEb3107117FEAd7de89Cd14D463D340A2E6917769)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ValidatorShare (0xf98864DA30a5bd657B13e70A57f5718aBf7BAB31)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FxRoot (0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Adapter (0x5473CBD30bEd1Bf97C0c9d7c59d268CD620dA426)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Polygon_Adapter (0xb4AeF0178f5725392A26eE18684C2aB62adc912e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Base_Adapter (0xE1421233BF7158A19f89F17c9735F9cbd3D9529c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism_Adapter (0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Mode_Adapter (0xf1B59868697f3925b72889ede818B9E7ba0316d0)
    +++ description: None
```

## Source code changes

```diff
.../.flat@19891034/AddressManager.sol => /dev/null |  128 -
 .../AddressResolver.sol => /dev/null               |  102 -
 .../{.flat@19891034 => .flat}/Arbitrum_Adapter.sol |   13 +-
 .../Arbitrum_Bridge/Bridge.sol => /dev/null        |  664 ----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  628 ----
 .../{.flat@19891034 => .flat}/Base_Adapter.sol     |   13 +-
 .../ethereum/.flat@19891034/Dai.sol => /dev/null   |  153 -
 .../DepositManager/DepositManager.sol => /dev/null |  473 ---
 .../DepositManagerProxy.p.sol => /dev/null         |  220 --
 .../ERC20Predicate/ERC20Predicate.sol => /dev/null | 1137 -------
 .../ERC20PredicateProxy.p.sol => /dev/null         |  151 -
 .../EmergencyProposalExecutor}/GnosisSafe.sol      |    0
 .../EmergencyProposalExecutor}/Proxy.p.sol         |    0
 .../FiatTokenProxy.p.sol => /dev/null              |  267 --
 .../FiatTokenV2_2/FiatTokenV2_2.sol => /dev/null   | 2356 --------------
 .../.flat@19891034/FxRoot.sol => /dev/null         |   24 -
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 .../GnosisSafe.sol => /dev/null                    |  952 ------
 .../Governance/Governance.sol => /dev/null         |   83 -
 .../Governance/GovernanceProxy.p.sol => /dev/null  |  156 -
 .../.flat@19891034/Inbox/Inbox.sol => /dev/null    | 1181 -------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../L1CrossDomainMessenger.sol => /dev/null        | 1513 ---------
 .../Lib_ResolvedDelegateProxy.p.sol => /dev/null   |   67 -
 .../L1CrossDomainMessenger.sol => /dev/null        | 1727 ----------
 .../ResolvedDelegateProxy.p.sol => /dev/null       |   54 -
 .../L1DAITokenBridge.sol => /dev/null              |  482 ---
 .../L1ERC20Gateway/L1ERC20Gateway.sol => /dev/null | 1381 --------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../.flat@19891034/L1Escrow.sol => /dev/null       |   39 -
 .../L1GatewayRouter.sol => /dev/null               |  991 ------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../L1ChugSplashProxy.p.sol => /dev/null           |  268 --
 .../L1StandardBridge.sol => /dev/null              | 1586 ---------
 .../L1ChugSplashProxy.p.sol => /dev/null           |  343 --
 .../L1StandardBridge.sol => /dev/null              | 1537 ---------
 .../Lib_AddressManager.sol => /dev/null            |  151 -
 .../.flat@19891034/MasterMinter.sol => /dev/null   |  371 ---
 .../.flat@19891034/MaticToken.sol => /dev/null     |  438 ---
 .../.flat@19891034/MaticWETH.sol => /dev/null      |  289 --
 .../MerklePatriciaProof.sol => /dev/null           |  413 ---
 .../MessageTransmitter.sol => /dev/null            | 3080 ------------------
 .../across-v3/ethereum/.flat/Mode_Adapter.sol      |  578 ++++
 .../OptimismPortal.sol => /dev/null                | 3425 --------------------
 .../Proxy.p.sol => /dev/null                       |  210 --
 .../OptimismPortal.sol => /dev/null                | 2881 ----------------
 .../Proxy.p.sol => /dev/null                       |  210 --
 .../{.flat@19891034 => .flat}/Optimism_Adapter.sol |   13 +-
 .../{.flat@19891034 => .flat}/Polygon_Adapter.sol  |   13 +-
 .../dev/null                                       |  297 --
 .../dev/null                                       |  297 --
 .../dev/null                                       |  139 -
 .../dev/null                                       |  131 -
 .../.flat@19891034/ProxyERC20.sol => /dev/null     |  305 --
 .../.flat@19891034/ReadProxy.sol => /dev/null      |   62 -
 .../.flat@19891034/Registry.sol => /dev/null       |  150 -
 .../RootChain/RootChain.sol => /dev/null           |  608 ----
 .../RootChain/RootChainProxy.p.sol => /dev/null    |  193 --
 .../RootChainManager.sol => /dev/null              | 2087 ------------
 .../RootChainManagerProxy.p.sol => /dev/null       |  151 -
 .../SequencerInbox/SequencerInbox.sol => /dev/null | 1086 -------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  628 ----
 .../.flat@19891034/StateSender.sol => /dev/null    |  178 -
 .../SuperchainConfig/Proxy.p.sol => /dev/null      |  199 --
 .../SuperchainConfig.sol => /dev/null              |  476 ---
 .../.flat@19891034/Synthetix.sol => /dev/null      | 1662 ----------
 .../SynthetixBridgeToOptimism.sol => /dev/null     | 1284 --------
 .../.flat@19891034/Timelock.sol => /dev/null       |  675 ----
 .../.flat@19891034/TokenMessenger.sol => /dev/null | 2591 ---------------
 .../.flat@19891034/TokenMinter.sol => /dev/null    | 1270 --------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  630 ----
 .../UpgradeExecutor.sol => /dev/null               |  995 ------
 .../.flat@19891034/ValidatorShare.sol => /dev/null |  802 -----
 .../ethereum/.flat@19891034/WETH9.sol => /dev/null |   62 -
 .../WithdrawManager.sol => /dev/null               | 1267 --------
 .../WithdrawManagerProxy.p.sol => /dev/null        |  222 --
 76 files changed, 622 insertions(+), 49946 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19891034 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitter (0x0a992d191DEeC32aFe36203Ad87D7d289a738F81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateSender (0x28e4F3a7f651294B9564800b2D01f35189A5bFbE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawManager (0x2A88696e0fFA76bAA1338F2C74497cC013495922)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Registry (0x33a02E6cC863D393d6Bf231B697b82F6e499cA71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SynthetixBridgeToOptimism (0x39Ea01a0298C315d149a490E34B59Dbf2EC7e48F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositManager (0x401F6c983eA34274ec46f84D70b31C151321188b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Escrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReadProxy (0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Dai (0x6B175474E89094C44Da98b954EedeAC495271d0F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0x6e7a5820baD6cebA8Ef5ea69c0C92EbbDAc9CE48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaticToken (0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressResolver (0x823bE81bbF96BEc0e25CA13170F5AaCb5B79ba83)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RootChain (0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FiatTokenV2_2 (0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaticWETH (0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerklePatriciaProof (0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessenger (0xBd3fa81B58Ba92a82136038B25aDec7066af3155)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyERC20 (0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMinter (0xc4922d64a24675E16e1586e3e3Aa56C06fABe907)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Synthetix (0xd711709eFc452152B7ad11DbD01ed4B69c9421B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xD9c7C4ED4B66858301D0cb28Cc88bf655Fe34861)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MasterMinter (0xE982615d461DD5cD06575BbeA87624fda4e3de17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xEb3107117FEAd7de89Cd14D463D340A2E6917769)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorShare (0xf98864DA30a5bd657B13e70A57f5718aBf7BAB31)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FxRoot (0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2)
    +++ description: None
```

Generated with discovered.json: 0x55d0510f7032eff3f615bdae368015f76f42ff06

# Diff at Fri, 17 May 2024 16:59:08 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@7634eb7892129fd76fa0bce18d68181ba69b99db block: 19718050
- current block number: 19891034

## Description

Ethereum_SpokePool.sol
- Added events FundsDeposited, RequestedSpeedUpDeposit, FilledRelay

HubPool changes: added CircleCCTPAdapter. 
- The Cross-Chain Transfer Protocol (CCTP) is now used to bridge USDC on Arbitrum, Base, Optimism, and Polygon. 
- Change of adapters interface format (e.g., messenger -> MESSENGER, l1Weth -> L1_WETH) that impacted ignoreRelatives discovery. Now restored to ignore relatives of updated methods. 
Impacted adapters contracts: Arbitrum_Adapter.sol, Base_Adapter.sol, Optimism_Adapter.sol, Polygon_Adapter.sol.

## Watched changes

```diff
-   Status: DELETED
    contract  (0x01F645DcD6C796F6BC6C982159B32fAaaebdC96A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiCollateralSynth (0x10A5F7D9D65bCc2734763444D4940a31b109275f)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ERC20PredicateBurnOnly (0x158d5fa3Ef8e4dDA8a5367deCF76b94E7efFCe95)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StateSender (0x28e4F3a7f651294B9564800b2D01f35189A5bFbE)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Arbitrum_Adapter (0x29528780E29abb8Af95a5e5a125b94766987543F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WithdrawManager (0x2A88696e0fFA76bAA1338F2C74497cC013495922)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Base_Adapter (0x2d8B1e2B0Dff62DF132d23BEa68a6D2c4D20046E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Registry (0x33a02E6cC863D393d6Bf231B697b82F6e499cA71)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SynthetixBridgeToOptimism (0x39Ea01a0298C315d149a490E34B59Dbf2EC7e48F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Polygon_Adapter (0x3E94e8d4316a1eBfb2245E45E6F0B8724094CE1A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DepositManager (0x401F6c983eA34274ec46f84D70b31C151321188b)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1Escrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ReadProxy (0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ERC721PredicateBurnOnly (0x54150f44c785D412Ec262fe895Cc3B689c72F49B)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      upgradeability.implementation:
-        "0xa4D3535f33549749Fb97fA42903AC80F6fb54af6"
+        "0x08C21b200eD06D2e32cEC91a770C3FcA8aD5F877"
      implementations.0:
-        "0xa4D3535f33549749Fb97fA42903AC80F6fb54af6"
+        "0x08C21b200eD06D2e32cEC91a770C3FcA8aD5F877"
      values.fillDeadlineBuffer:
-        28800
+        21600
    }
```

```diff
-   Status: DELETED
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Dai (0x6B175474E89094C44Da98b954EedeAC495271d0F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Governance (0x6e7a5820baD6cebA8Ef5ea69c0C92EbbDAc9CE48)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MaticToken (0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Arbitrum_Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract RootChain (0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MaticWETH (0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MerklePatriciaProof (0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiCollateralSynth (0xa8E31E3C38aDD6052A9407298FAEB8fD393A6cF9)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Optimism_Adapter (0xAd1b0a86c98703fd5F4E56fff04F6b2D9b9f246F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyERC20 (0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.CrossChainContracts.10.adapter:
-        "0xAd1b0a86c98703fd5F4E56fff04F6b2D9b9f246F"
+        "0xb3a4e39F0CD9aBAc5d866f023C18e73224667Fee"
      values.CrossChainContracts.137.adapter:
-        "0x3E94e8d4316a1eBfb2245E45E6F0B8724094CE1A"
+        "0xB130E3056D5C692300d66c12C10ffA2073d9424D"
      values.CrossChainContracts.8453.adapter:
-        "0x2d8B1e2B0Dff62DF132d23BEa68a6D2c4D20046E"
+        "0xD9948AE3405FE03A52A18F119EF72221DCdCc4df"
      values.CrossChainContracts.42161.adapter:
-        "0x29528780E29abb8Af95a5e5a125b94766987543F"
+        "0xd881A21F17B83AefFd11cc2e7363740449eb8069"
    }
```

```diff
-   Status: DELETED
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Whitelist (0xD485e5c28AA4985b23f6DF13dA03caa766dcd459)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Synthetix (0xd711709eFc452152B7ad11DbD01ed4B69c9421B3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xD9c7C4ED4B66858301D0cb28Cc88bf655Fe34861)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiCollateralSynth (0xdc883b9d9Ee16f74bE08826E68dF4C9D9d26e8bD)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiCollateralSynth (0xE1cc2332852B2Ac0dA59A1f9D3051829f4eF3c1C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xEb3107117FEAd7de89Cd14D463D340A2E6917769)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ValidatorShare (0xf98864DA30a5bd657B13e70A57f5718aBf7BAB31)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiCollateralSynth (0xfb020CA7f4e8C4a5bBBe060f59a249c6275d2b69)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FxRoot (0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Polygon_Adapter (0xB130E3056D5C692300d66c12C10ffA2073d9424D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism_Adapter (0xb3a4e39F0CD9aBAc5d866f023C18e73224667Fee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Adapter (0xd881A21F17B83AefFd11cc2e7363740449eb8069)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Base_Adapter (0xD9948AE3405FE03A52A18F119EF72221DCdCc4df)
    +++ description: None
```

## Source code changes

```diff
.../.flat@19718050/AddressManager.sol => /dev/null |  128 -
 .../{.flat@19718050 => .flat}/Arbitrum_Adapter.sol |  405 ++-
 .../Arbitrum_Bridge/Bridge.sol => /dev/null        |  664 ----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  628 ----
 .../{.flat@19718050 => .flat}/Base_Adapter.sol     |  139 +-
 .../ethereum/.flat@19718050/Dai.sol => /dev/null   |  153 -
 .../DepositManager/DepositManager.sol => /dev/null |  473 ---
 .../DepositManagerProxy.p.sol => /dev/null         |  220 --
 .../ERC20Predicate/ERC20Predicate.sol => /dev/null | 1137 -------
 .../ERC20PredicateProxy.p.sol => /dev/null         |  151 -
 .../ERC20PredicateBurnOnly.sol => /dev/null        | 1115 -------
 .../ERC721PredicateBurnOnly.sol => /dev/null       | 1120 -------
 .../Ethereum_SpokePool/Ethereum_SpokePool.sol      |   86 +-
 .../.flat@19718050/FxRoot.sol => /dev/null         |   24 -
 .../GnosisSafe.sol => /dev/null                    |  952 ------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 .../GnosisSafe.sol => /dev/null                    |  952 ------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 .../GnosisSafe.sol => /dev/null                    |  952 ------
 .../Proxy.p.sol => /dev/null                       |   38 -
 .../GnosisSafe.sol => /dev/null                    |  958 ------
 .../Proxy.p.sol => /dev/null                       |   38 -
 .../Governance/Governance.sol => /dev/null         |   83 -
 .../Governance/GovernanceProxy.p.sol => /dev/null  |  156 -
 .../.flat@19718050/Inbox/Inbox.sol => /dev/null    | 1181 -------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../L1CrossDomainMessenger.sol => /dev/null        | 1513 ---------
 .../Lib_ResolvedDelegateProxy.p.sol => /dev/null   |   67 -
 .../L1CrossDomainMessenger.sol => /dev/null        | 1727 ----------
 .../ResolvedDelegateProxy.p.sol => /dev/null       |   54 -
 .../L1DAITokenBridge.sol => /dev/null              |  482 ---
 .../L1ERC20Gateway/L1ERC20Gateway.sol => /dev/null | 1381 --------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../.flat@19718050/L1Escrow.sol => /dev/null       |   39 -
 .../L1GatewayRouter.sol => /dev/null               |  991 ------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../L1ChugSplashProxy.p.sol => /dev/null           |  268 --
 .../L1StandardBridge.sol => /dev/null              | 1586 ---------
 .../L1ChugSplashProxy.p.sol => /dev/null           |  343 --
 .../L1StandardBridge.sol => /dev/null              | 1537 ---------
 .../Lib_AddressManager.sol => /dev/null            |  151 -
 .../.flat@19718050/MaticToken.sol => /dev/null     |  438 ---
 .../.flat@19718050/MaticWETH.sol => /dev/null      |  289 --
 .../MerklePatriciaProof.sol => /dev/null           |  413 ---
 .../dev/null                                       | 1057 ------
 .../dev/null                                       | 1057 ------
 .../dev/null                                       | 1057 ------
 .../dev/null                                       | 1057 ------
 .../dev/null                                       | 1057 ------
 .../OptimismPortal.sol => /dev/null                | 3425 --------------------
 .../Proxy.p.sol => /dev/null                       |  210 --
 .../OptimismPortal.sol => /dev/null                | 2881 ----------------
 .../Proxy.p.sol => /dev/null                       |  210 --
 .../{.flat@19718050 => .flat}/Optimism_Adapter.sol |  156 +-
 .../{.flat@19718050 => .flat}/Polygon_Adapter.sol  |  342 +-
 .../dev/null                                       |  297 --
 .../dev/null                                       |  297 --
 .../dev/null                                       |  139 -
 .../dev/null                                       |  146 -
 .../dev/null                                       |  131 -
 .../.flat@19718050/ProxyERC20.sol => /dev/null     |  305 --
 .../.flat@19718050/ReadProxy.sol => /dev/null      |   62 -
 .../.flat@19718050/Registry.sol => /dev/null       |  150 -
 .../RootChain/RootChain.sol => /dev/null           |  608 ----
 .../RootChain/RootChainProxy.p.sol => /dev/null    |  193 --
 .../RootChainManager.sol => /dev/null              | 2087 ------------
 .../RootChainManagerProxy.p.sol => /dev/null       |  151 -
 .../SequencerInbox/SequencerInbox.sol => /dev/null | 1086 -------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  628 ----
 .../StakeManager/StakeManager.sol => /dev/null     | 2112 ------------
 .../StakeManagerProxy.p.sol => /dev/null           |  145 -
 .../.flat@19718050/StateSender.sol => /dev/null    |  178 -
 .../SuperchainConfig/Proxy.p.sol => /dev/null      |  199 --
 .../SuperchainConfig.sol => /dev/null              |  476 ---
 .../.flat@19718050/Synthetix.sol => /dev/null      | 1662 ----------
 .../SynthetixBridgeToOptimism.sol => /dev/null     | 1284 --------
 .../.flat@19718050/Timelock.sol => /dev/null       |  675 ----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  630 ----
 .../UpgradeExecutor.sol => /dev/null               |  995 ------
 .../.flat@19718050/ValidatorShare.sol => /dev/null |  802 -----
 .../ethereum/.flat@19718050/WETH9.sol => /dev/null |   62 -
 .../.flat@19718050/Whitelist.sol => /dev/null      |   39 -
 .../WithdrawManager.sol => /dev/null               | 1267 --------
 .../WithdrawManagerProxy.p.sol => /dev/null        |  222 --
 84 files changed, 828 insertions(+), 53135 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19718050 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract  (0x01F645DcD6C796F6BC6C982159B32fAaaebdC96A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiCollateralSynth (0x10A5F7D9D65bCc2734763444D4940a31b109275f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20PredicateBurnOnly (0x158d5fa3Ef8e4dDA8a5367deCF76b94E7efFCe95)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateSender (0x28e4F3a7f651294B9564800b2D01f35189A5bFbE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawManager (0x2A88696e0fFA76bAA1338F2C74497cC013495922)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Registry (0x33a02E6cC863D393d6Bf231B697b82F6e499cA71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SynthetixBridgeToOptimism (0x39Ea01a0298C315d149a490E34B59Dbf2EC7e48F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositManager (0x401F6c983eA34274ec46f84D70b31C151321188b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Escrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReadProxy (0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC721PredicateBurnOnly (0x54150f44c785D412Ec262fe895Cc3B689c72F49B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Dai (0x6B175474E89094C44Da98b954EedeAC495271d0F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0x6e7a5820baD6cebA8Ef5ea69c0C92EbbDAc9CE48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaticToken (0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RootChain (0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaticWETH (0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerklePatriciaProof (0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiCollateralSynth (0xa8E31E3C38aDD6052A9407298FAEB8fD393A6cF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyERC20 (0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Whitelist (0xD485e5c28AA4985b23f6DF13dA03caa766dcd459)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Synthetix (0xd711709eFc452152B7ad11DbD01ed4B69c9421B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xD9c7C4ED4B66858301D0cb28Cc88bf655Fe34861)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiCollateralSynth (0xdc883b9d9Ee16f74bE08826E68dF4C9D9d26e8bD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiCollateralSynth (0xE1cc2332852B2Ac0dA59A1f9D3051829f4eF3c1C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xEb3107117FEAd7de89Cd14D463D340A2E6917769)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorShare (0xf98864DA30a5bd657B13e70A57f5718aBf7BAB31)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiCollateralSynth (0xfb020CA7f4e8C4a5bBBe060f59a249c6275d2b69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FxRoot (0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2)
    +++ description: None
```

Generated with discovered.json: 0xb4bd133d76516e18e5f01eab8e4bd307d27863c2

# Diff at Tue, 23 Apr 2024 12:22:02 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@0c5cebacabe91d4bb808f51a732583d8107ec7bc block: 19645947
- current block number: 19718050

## Description

Liveness value in the HubPool (token escrow) is decreased from 1,5 to 1h. This is the time before a subitted root bundle is finalized and cannot be disputed anymore (And when relayers are reimbursed with tokens).

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.liveness:
-        5400
+        3600
    }
```

Generated with discovered.json: 0x5c90684b94ec67ec0205143a888b5085c83eecf9

# Diff at Sat, 13 Apr 2024 10:06:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ce9ed778ed3251d8c0182e8225fd576d18383215 block: 19631863
- current block number: 19645947

## Description

Tidy up config.jsonc:

- no onchain changes
- scope of discovery config stays the same (+Linea adapter added)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19631863 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract TokenBridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319)
    +++ description: None
```

```diff
-   Status: DELETED
    contract BridgedToken (0x36f274C1C197F277EA3C57859729398FCc8a3763)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x5B0bb17755FBa06028530682E2FD5bc373931768)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x892bb7EeD71efB060ab90140e7825d8127991DD3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UpgradeableBeacon (0x971f46a2852d11D59dbF0909e837cfd06f357DeB)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiSend (0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083)
    +++ description: None
```

Generated with discovered.json: 0x89400dca91a7d0ef56df44dae3bda28049f2ef91

# Diff at Thu, 11 Apr 2024 10:44:49 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4b6ab939705ef1b9fdc0ffd8813b4869519e6547 block: 19574841
- current block number: 19631863

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19574841 (main branch discovery), not current.

```diff
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract GnosisSafe (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 8 (50%)"
    }
```

```diff
    contract HubPool Multisig (0xB524735356985D2f267FA010D681f061DfF03715) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x71164dd68d40c603ad2f2be8190d8e65dd9a7765

# Diff at Wed, 03 Apr 2024 11:07:55 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19574841

## Description

- added Linea support
- SpokePool upgrade: various functions to register orders, updated to V3 specs. // does it use merkle proofs to withdraw funds?
  Plus some counters of filled orders and deposits. These counters are designed to implement a fee mechanism that is based on a canonical history of deposit and fill events and how they update a virtual running balance of liabilities and assets, which then determines the LP fee charged to relays. Plus some error handling, handling of non-expiring deposits.

Workflow - from the contract:
Request to bridge input token cross chain to a destination chain and receive a specified amount of output tokens. The fee paid to relayers and the system should be captured in the spread between output amount and input amount when adjusted to be denominated in the input token. A relayer on the destination chain will send outputAmount of outputTokens to the recipient and receive inputTokens on a repayment chain of their choice. Therefore, the fee should account for destination fee transaction costs, the relayer's opportunity cost of capital while they wait to be refunded following an optimistic challenge window in the HubPool, and the system fee that they'll be charged. On the destination chain, the hash of the deposit data will be used to uniquely identify this deposit, so modifying any params in it will result in a different hash and a different deposit. The hash will comprise all parameters to this function along with this chain's chainId(). Relayers are only refunded for filling deposits with deposit hashes that map exactly to the one emitted by this contract.

## Initial discovery

```diff
+   Status: CREATED
    contract VotingToken (0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenBridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Adapter (0x29528780E29abb8Af95a5e5a125b94766987543F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Base_Adapter (0x2d8B1e2B0Dff62DF132d23BEa68a6D2c4D20046E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Boba_Adapter (0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgedToken (0x36f274C1C197F277EA3C57859729398FCc8a3763)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Polygon_Adapter (0x3E94e8d4316a1eBfb2245E45E6F0B8724094CE1A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_Adapter (0x527E872a5c3f0C7c24Fe33F2593cFB890a285084)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x5B0bb17755FBa06028530682E2FD5bc373931768)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LpTokenFactory (0x7dB69eb9F52eD773E9b03f5068A1ea0275b2fD9d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Linea_Adapter (0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x892bb7EeD71efB060ab90140e7825d8127991DD3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748)
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
    contract Optimism_Adapter (0xAd1b0a86c98703fd5F4E56fff04F6b2D9b9f246F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HubPool Multisig (0xB524735356985D2f267FA010D681f061DfF03715)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CoveredCallFinancialProductLibrary (0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSync_Adapter (0xE233009838CB898b50e0012a6E783FC9FeE447FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BondToken (0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE)
    +++ description: None
```
