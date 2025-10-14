Generated with discovered.json: 0x77701f39a79a42731801e050830ad5e9af2641e7

# Diff at Fri, 10 Oct 2025 09:41:22 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a91384a270a047b2514885e053feff1edc24f495 block: 1758107952
- current timestamp: 1760089209

## Description

Removed member from multisig.

## Watched changes

```diff
    contract GnosisSafeL2 (scr:0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351) {
    +++ description: None
      values.$members.0:
-        "scr:0xd5A0f3DfCe7128B7119462F7aC912616bB05b593"
      values.$members.2:
-        "scr:0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B"
+        "scr:0x558581b0345D986bA5bD6f04Efd27e2a5B991320"
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "2 of 2 (100%)"
    }
```

Generated with discovered.json: 0x8c5145b3a51cff9ce4b7aabb4a4d79c959a861b5

# Diff at Wed, 17 Sep 2025 11:26:24 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@826dd36404e9c33731dc0255e96251d8d8999c20 block: 1756895025
- current timestamp: 1758107952

## Description

Decoded function names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756895025 (main branch discovery), not current.

```diff
    contract ScrollOwner (scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.0xaa5e9334:
-        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.0xc63b9e2d:
-        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.setPenaltyThreshold(uint256):
+        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.setPenaltyFactor(uint256):
+        ["ops-fast"]
    }
```

Generated with discovered.json: 0x9c61971f9b4fd3a9f43779411130e6feb88165fa

# Diff at Wed, 03 Sep 2025 10:26:23 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@5a6919b30a4f4dcccb2eda72a4f146550ce776be block: 1756804385
- current timestamp: 1756895025

## Description

msig changes.

## Watched changes

```diff
    contract Safe (eth:0x9479ABfebefEea3c846163012a472b44F305b3d7) {
    +++ description: None
      values.$members.0:
-        "eth:0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
+        "eth:0xDF1aa0495C815A1b9156796a741885a4834EC012"
    }
```

```diff
    contract SafeL2 (scr:0x9479ABfebefEea3c846163012a472b44F305b3d7) {
    +++ description: None
      values.$members.0:
-        "scr:0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
+        "scr:0xDF1aa0495C815A1b9156796a741885a4834EC012"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756804385 (main branch discovery), not current.

```diff
    contract ScrollOwner (scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.setPenaltyThreshold(uint256):
-        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.setPenaltyFactor(uint256):
-        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.0xaa5e9334:
+        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.0xc63b9e2d:
+        ["ops-fast"]
    }
```

Generated with discovered.json: 0x01674f4e5705e128f8ed162b5a0b0e349723a306

# Diff at Tue, 02 Sep 2025 15:24:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f5ac0f88bdc411ecf49ff6c20d5dd0db181a0c91 block: 1756804385
- current timestamp: 1756804385

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756804385 (main branch discovery), not current.

```diff
    contract ScrollOwner (scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.0xaa5e9334:
-        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.0xc63b9e2d:
-        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.setPenaltyThreshold(uint256):
+        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.setPenaltyFactor(uint256):
+        ["ops-fast"]
    }
```

Generated with discovered.json: 0x233f0f29b59309889d6ad0c59f627d40d50b4adf

# Diff at Tue, 02 Sep 2025 09:16:29 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@1144aeaf984988c003c97be3791eeda76896f8ca block: 1756130522
- current timestamp: 1756804385

## Description

Voting period and delay extended.

## Watched changes

```diff
    contract AgoraGovernor (scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0) {
    +++ description: Used to propose and manage onchain governance proposals.
      values.votingDelay:
-        3600
+        172800
      values.votingPeriod:
-        432000
+        403200
    }
```

Generated with discovered.json: 0x9288ea21b5f27624a804db3246dceb64e939e756

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xf4ef13b7e692b86660712651f5965ce97c5060f6

# Diff at Mon, 25 Aug 2025 14:28:37 GMT:

- chain: scroll
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@90dd8b76055bf0f493df8c45097d37e26f847015 block: 1756130522
- current timestamp: 1756130522

## Description

Assign L1 counterpart.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756130522 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract WrappedEther (0x5300000000000000000000000000000000000004)
    +++ description: None
```

```diff
    contract L2WETHGateway (0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9) {
    +++ description: None
      values.counterpart:
-        "scr:0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
+        "eth:0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      values.l1WETH:
-        "scr:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"eth"}}]
    }
```

```diff
-   Status: DELETED
    contract L2WETHGatewayCounterpart (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE)
    +++ description: None
```

```diff
    contract ProxyAdmin (0x8e34D07Eb348716a1f0a48A507A9de8a3A6DcE45) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"upgrade","from":"scr:0xf610A9dfB7C89644979b4A0f27063E9e7d7Cda32","role":"admin"}
    }
```

```diff
-   Status: DELETED
    contract L2WstETHToken (0xf610A9dfB7C89644979b4A0f27063E9e7d7Cda32)
    +++ description: None
```

Generated with discovered.json: 0x130790e1b3f4c03c904374a41af6af7b5e12096e

# Diff at Mon, 25 Aug 2025 14:04:28 GMT:

- chain: scroll
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ad220cb66b2845d84a69889aeb34f71bc5a0a6b0 block: 1755858338
- current timestamp: 1756130522

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract WrappedEther (0x5300000000000000000000000000000000000004) {
    +++ description: None
      values.totalSupply:
-        "4497294538621618165812"
+        "4170911196463469688720"
    }
```

```diff
    contract L2WstETHToken (0xf610A9dfB7C89644979b4A0f27063E9e7d7Cda32) {
    +++ description: None
      values.totalSupply:
-        "978415033324282926152"
+        "983802096521707616986"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755858338 (main branch discovery), not current.

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.0xaa5e9334:
-        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.0xc63b9e2d:
-        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.setPenaltyThreshold(uint256):
+        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.setPenaltyFactor(uint256):
+        ["ops-fast"]
    }
```

Generated with discovered.json: 0xe7bb390a4f69dacb237102648e7522694a10c3c8

# Diff at Mon, 25 Aug 2025 09:27:20 GMT:

- chain: scroll
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@db2e2037972253abead542c9802c5ac28817e5d2 block: 1755858338
- current timestamp: 1755858338

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755858338 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","from":"scr:0x33B60d5Dd260d453cAC3782b0bDC01ce84672142","role":"admin"}
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"scr:0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9","role":"admin"}
    }
```

```diff
+   Status: CREATED
    contract L2USDCGateway (0x33B60d5Dd260d453cAC3782b0bDC01ce84672142)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WrappedEther (0x5300000000000000000000000000000000000004)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2WETHGateway (0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2WETHGatewayCounterpart (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2LidoGateway (0x8aE8f22226B9d789A36AC81474e633f8bE2856c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8e34D07Eb348716a1f0a48A507A9de8a3A6DcE45)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2WstETHToken (0xf610A9dfB7C89644979b4A0f27063E9e7d7Cda32)
    +++ description: None
```

Generated with discovered.json: 0xe2532d7ad9838d0a3ffd54fc704afa7305ed3b0c

# Diff at Mon, 18 Aug 2025 13:31:33 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@335655f4527d4008046b61acfb5c017f56f8b51d block: 1755014055
- current timestamp: 1755523806

## Description

[L1MessageQueueV2](https://disco.l2beat.com/diff/eth:0xEfA158006b072793a49E622B26761cD0eC38591d/eth:0x39C36c9026ac18104839A50c61a4507ea5052ECa): Change `APPROPRIATE_INTRINSIC_GAS_PER_BYTE` from `16` to `40` to account for EIP-7623 floor gas

[SystemConfig](https://disco.l2beat.com/diff/eth:0x6A124779fDf107c3F6BcB992731dCAaD09f2276A/eth:0xf15a4b6D1fE2Ca6eE38BC3fb957f43F58b515eeE): Add three new events: `MessageQueueParametersUpdated`, `EnforcedBatchParametersUpdated`, `SignerUpdated`

[ScrollChain](https://disco.l2beat.com/diff/eth:0xb7c8833F5627a8a12558cAFa0d0EBD1ACBDce43f/eth:0x0a20703878E68E587c59204cc0EA86098B8c3bA7): Remove blob proof methods and internal functions, restrict `commitAndFinalizeBatch` to top-level EOA calls only

[L1ScrollMessenger](https://disco.l2beat.com/diff/eth:0x84791281EF5cb8Af5dCd4c122f7A42FeD38Fef5b/eth:0x79b6eAbfFAa958FDF2Aa2Bf632878bD323DCbF69): Remove message dropping and replay functionality

[L1ETHGateway](https://disco.l2beat.com/diff/eth:0x546E0bF31FB6e7babD493452e4e6999191367B42/eth:0x1fee6a6dC49095FB9C84D61aa4b8A07284b2A1d0): Stop implementing `IMessageDropCallback` and remove `onDropMessage`

[L1WETHGateway](https://disco.l2beat.com/diff/eth:0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49/eth:0xE25EfFEFd08c4a57556d47eF96471Cb567A86c24): Stop implementing `IMessageDropCallback` and remove `onDropMessage`

[L1StandardERC20Gateway](https://disco.l2beat.com/diff/eth:0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c/eth:0xfF8238be22cC583b3d69A76da9d84Da7788c0ee9): Stop implementing `IMessageDropCallback` and remove `onDropMessage`

[L1CustomERC20Gateway](https://disco.l2beat.com/diff/eth:0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c/eth:0x40c3C3dEa3B7D6d117E6713377144fD8EE6D6c97): Stop implementing `IMessageDropCallback`, remove `onDropMessage`, `updateTokenMapping` now calls L2 counterpart

[L1ERC721Gateway](https://disco.l2beat.com/diff/eth:0xd1841c5756428812233eEA78afC17cb2D3e392bb/eth:0x79F1bF1906B63b56E08c3ada4c51De11F145a27A): Stop implementing `IMessageDropCallback` and remove `onDropMessage`

[L1ERC1155Gateway](https://disco.l2beat.com/diff/eth:0x244BF7aEf29F03916569470a51fA0794B62F8cd7/eth:0xcA46358D5F01E4F865885514DAe6275087Ffe38E): Stop implementing `IMessageDropCallback` and remove `onDropMessage`

[Verifier](https://disco.l2beat.com/diff/eth:0xbb08c87a2e871fcf3d86c4f7ed03dec8b66297ba/eth:0xa8d4702aa5c09af5dd1323e1842a43789021f485): New constructor parameter: `protocolVersion = 8`. Used to calculate `publicInputHash` used in proof verification.

## Watched changes

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Contract used to update the verifier and keep track of current and old versions.
      values.latestVerifier.7:
+        {"startBatchIndex":0,"verifier":"eth:0xa8d4702Aa5c09AF5dD1323E1842a43789021F485"}
      values.legacyVerifiersLength.7:
+        0
      values.verifierVersions.7:
+        8
    }
```

```diff
    contract L1MessageQueueV2 (0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1ScrollMessenger or the EnforcedTxGateway.
      sourceHashes.1:
-        "0x99f1e9baeea6fd1f7773c90a40e71adfcfd2e28d14a59208a79323b7e36281a0"
+        "0x92b35ff3d05522053ea72bc1d79ad52bc1aa4f5fb8afeea039c1f7d26a18b59c"
      values.$implementation:
-        "eth:0xEfA158006b072793a49E622B26761cD0eC38591d"
+        "eth:0x39C36c9026ac18104839A50c61a4507ea5052ECa"
      values.$pastUpgrades.2:
+        ["2025-08-18T02:46:23.000Z","0x0b3de25cab280b3e304b63e11cde6b04ef75023d89bb08d0cb6d743e055daa7c",["eth:0x39C36c9026ac18104839A50c61a4507ea5052ECa"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0xEfA158006b072793a49E622B26761cD0eC38591d:
-        "L1MessageQueueV2"
      implementationNames.eth:0x39C36c9026ac18104839A50c61a4507ea5052ECa:
+        "L1MessageQueueV2"
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: Contract used to bridge ERC721 tokens from L1 to L2.
      sourceHashes.1:
-        "0x2a543ae77e08fc2293b99836986b16db46b713eb958556cd1c95fcabce559b4b"
+        "0x8a8d5a6804c708dac3077a6dc3205f8c0ef2f6afab6f82c622a4b7e4b1cdda5d"
      values.$implementation:
-        "eth:0xd1841c5756428812233eEA78afC17cb2D3e392bb"
+        "eth:0x79F1bF1906B63b56E08c3ada4c51De11F145a27A"
      values.$pastUpgrades.2:
+        ["2025-08-18T02:46:23.000Z","0x0b3de25cab280b3e304b63e11cde6b04ef75023d89bb08d0cb6d743e055daa7c",["eth:0x79F1bF1906B63b56E08c3ada4c51De11F145a27A"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0xd1841c5756428812233eEA78afC17cb2D3e392bb:
-        "L1ERC721Gateway"
      implementationNames.eth:0x79F1bF1906B63b56E08c3ada4c51De11F145a27A:
+        "L1ERC721Gateway"
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      sourceHashes.1:
-        "0x0a1aa34da20ecb18034b84d08a6f6c0a3b5f5b865aaf9fbd37ef7c766dfdc5a8"
+        "0x1b2015473e07e2c05d22065439354cd227773c699f24fd62a8c67b381a9e970d"
      values.$implementation:
-        "eth:0x84791281EF5cb8Af5dCd4c122f7A42FeD38Fef5b"
+        "eth:0x79b6eAbfFAa958FDF2Aa2Bf632878bD323DCbF69"
      values.$pastUpgrades.4:
+        ["2025-08-18T02:46:23.000Z","0x0b3de25cab280b3e304b63e11cde6b04ef75023d89bb08d0cb6d743e055daa7c",["eth:0x79b6eAbfFAa958FDF2Aa2Bf632878bD323DCbF69"]]
      values.$upgradeCount:
-        4
+        5
      values.maxReplayTimes:
-        3
      implementationNames.eth:0x84791281EF5cb8Af5dCd4c122f7A42FeD38Fef5b:
-        "L1ScrollMessenger"
      implementationNames.eth:0x79b6eAbfFAa958FDF2Aa2Bf632878bD323DCbF69:
+        "L1ScrollMessenger"
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: Contract used to bridge WETH from L1 to L2.
      sourceHashes.1:
-        "0xb90cab5924c6894e3047536242125cdface40857b9c70a6551210bc6de166b42"
+        "0x85541d2f37f32a3d9fe2cd14f01e794d21a323e3f67041c89a7293f790f85668"
      values.$implementation:
-        "eth:0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"
+        "eth:0xE25EfFEFd08c4a57556d47eF96471Cb567A86c24"
      values.$pastUpgrades.2:
+        ["2025-08-18T02:46:23.000Z","0x0b3de25cab280b3e304b63e11cde6b04ef75023d89bb08d0cb6d743e055daa7c",["eth:0xE25EfFEFd08c4a57556d47eF96471Cb567A86c24"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49:
-        "L1WETHGateway"
      implementationNames.eth:0xE25EfFEFd08c4a57556d47eF96471Cb567A86c24:
+        "L1WETHGateway"
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      sourceHashes.1:
-        "0xa874514fbf17dc321480a8270dcdc3a5a0d9b8e37ff5de1187df641cd4a2f6e4"
+        "0x09dcca0374ada70701a459984dc3deae5816e1b6db9dd9596007c28ce5b389e2"
      values.$implementation:
-        "eth:0x546E0bF31FB6e7babD493452e4e6999191367B42"
+        "eth:0x1fee6a6dC49095FB9C84D61aa4b8A07284b2A1d0"
      values.$pastUpgrades.2:
+        ["2025-08-18T02:46:23.000Z","0x0b3de25cab280b3e304b63e11cde6b04ef75023d89bb08d0cb6d743e055daa7c",["eth:0x1fee6a6dC49095FB9C84D61aa4b8A07284b2A1d0"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0x546E0bF31FB6e7babD493452e4e6999191367B42:
-        "L1ETHGateway"
      implementationNames.eth:0x1fee6a6dC49095FB9C84D61aa4b8A07284b2A1d0:
+        "L1ETHGateway"
    }
```

```diff
    contract SystemConfig (0x8432728A257646449245558B8b7Dbe51A16c7a4D) {
    +++ description: System configuration contract for Scroll, contains enforcedBatchParameters and messageQueueParameters determining permissionless mode.
      sourceHashes.1:
-        "0xc6b44b4f580a4675d79b547ed6eef62882f9be3e0c86e18360e9ba5ead33755a"
+        "0x94a50a4d5efa2113acdaae7b769298f0c8c17e01bc6c6efeebdb7d8a7b0bec10"
      values.$implementation:
-        "eth:0x6A124779fDf107c3F6BcB992731dCAaD09f2276A"
+        "eth:0xf15a4b6D1fE2Ca6eE38BC3fb957f43F58b515eeE"
      values.$pastUpgrades.2:
+        ["2025-08-18T02:46:23.000Z","0x0b3de25cab280b3e304b63e11cde6b04ef75023d89bb08d0cb6d743e055daa7c",["eth:0xf15a4b6D1fE2Ca6eE38BC3fb957f43F58b515eeE"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0x6A124779fDf107c3F6BcB992731dCAaD09f2276A:
-        "SystemConfig"
      implementationNames.eth:0xf15a4b6D1fE2Ca6eE38BC3fb957f43F58b515eeE:
+        "SystemConfig"
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: The main contract of the Scroll chain. Allows to post transaction data and state roots, along with proofs. Sequencing and proposing are behind a whitelist unless enforcedBatchMode is activated.
      sourceHashes.1:
-        "0x73386ff4d9fbaf9cba78ae1e91ee43f11ff39acb8bcf332085ec42d7da6c2306"
+        "0xdccc4e7f3d13677c2f3cb12f608b3aa0a8bacb59c54feb3dc21fc3f42c4d4e25"
      values.$implementation:
-        "eth:0xb7c8833F5627a8a12558cAFa0d0EBD1ACBDce43f"
+        "eth:0x0a20703878E68E587c59204cc0EA86098B8c3bA7"
      values.$pastUpgrades.7:
+        ["2025-08-18T02:46:23.000Z","0x0b3de25cab280b3e304b63e11cde6b04ef75023d89bb08d0cb6d743e055daa7c",["eth:0x0a20703878E68E587c59204cc0EA86098B8c3bA7"]]
      values.$upgradeCount:
-        7
+        8
      values.maxNumTxInChunk:
-        100
      implementationNames.eth:0xb7c8833F5627a8a12558cAFa0d0EBD1ACBDce43f:
-        "ScrollChain"
      implementationNames.eth:0x0a20703878E68E587c59204cc0EA86098B8c3bA7:
+        "ScrollChain"
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings.
      sourceHashes.1:
-        "0xe564c04903b37a6ee36ca18aeb567c15ce70fe0a8022621e7c93c833bc2fbbf3"
+        "0x5d802344cb0c2d20f6e366ef83eee38cb2d561b6ad26ed596111f84a4cf3aa80"
      values.$implementation:
-        "eth:0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"
+        "eth:0x40c3C3dEa3B7D6d117E6713377144fD8EE6D6c97"
      values.$pastUpgrades.2:
+        ["2025-08-18T02:46:23.000Z","0x0b3de25cab280b3e304b63e11cde6b04ef75023d89bb08d0cb6d743e055daa7c",["eth:0x40c3C3dEa3B7D6d117E6713377144fD8EE6D6c97"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c:
-        "L1CustomERC20Gateway"
      implementationNames.eth:0x40c3C3dEa3B7D6d117E6713377144fD8EE6D6c97:
+        "L1CustomERC20Gateway"
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: Contract used to bridge ERC1155 tokens from L1 to L2.
      sourceHashes.1:
-        "0x35e9a9e7a691f357e642a73662c88a202224b73a44fc022f833ccc8aff9a4a64"
+        "0x3e82df6b3c4997362507d8f73c6fff945dedcee0aeaf99f8369b433dc82c0bca"
      values.$implementation:
-        "eth:0x244BF7aEf29F03916569470a51fA0794B62F8cd7"
+        "eth:0xcA46358D5F01E4F865885514DAe6275087Ffe38E"
      values.$pastUpgrades.2:
+        ["2025-08-18T02:46:23.000Z","0x0b3de25cab280b3e304b63e11cde6b04ef75023d89bb08d0cb6d743e055daa7c",["eth:0xcA46358D5F01E4F865885514DAe6275087Ffe38E"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0x244BF7aEf29F03916569470a51fA0794B62F8cd7:
-        "L1ERC1155Gateway"
      implementationNames.eth:0xcA46358D5F01E4F865885514DAe6275087Ffe38E:
+        "L1ERC1155Gateway"
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      sourceHashes.1:
-        "0x93fe70d828e5646f5acb7768083ab2e5b9cfb5b6691a5dff48ff3c188ffd05a7"
+        "0x13d0dc38cdff2a957bfc9939cc28d16112c2052a699bc3bc9231879a79ff81e2"
      values.$implementation:
-        "eth:0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"
+        "eth:0xfF8238be22cC583b3d69A76da9d84Da7788c0ee9"
      values.$pastUpgrades.2:
+        ["2025-08-18T02:46:23.000Z","0x0b3de25cab280b3e304b63e11cde6b04ef75023d89bb08d0cb6d743e055daa7c",["eth:0xfF8238be22cC583b3d69A76da9d84Da7788c0ee9"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c:
-        "L1StandardERC20Gateway"
      implementationNames.eth:0xfF8238be22cC583b3d69A76da9d84Da7788c0ee9:
+        "L1StandardERC20Gateway"
    }
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierPostFeynman (0xa8d4702Aa5c09AF5dD1323E1842a43789021F485)
    +++ description: None
```

## Source code changes

```diff
.../L1CustomERC20Gateway/L1CustomERC20Gateway.sol  |  35 +-
 .../L1ERC1155Gateway/L1ERC1155Gateway.sol          |  37 +-
 .../L1ERC721Gateway/L1ERC721Gateway.sol            |  38 +-
 .../L1ETHGateway/L1ETHGateway.sol                  |  26 +-
 .../L1MessageQueueV2/L1MessageQueueV2.sol          |   3 +-
 .../L1ScrollMessenger/L1ScrollMessenger.sol        | 111 +--
 .../L1StandardERC20Gateway.sol                     |  27 +-
 .../L1WETHGateway/L1WETHGateway.sol                |  31 +-
 .../ScrollChain/ScrollChain.sol                    | 918 ++-------------------
 .../SystemConfig/SystemConfig.sol                  |  25 +
 .../ethereum/.flat/ZkEvmVerifierPostFeynman.sol    | 107 +++
 11 files changed, 247 insertions(+), 1111 deletions(-)
```

Generated with discovered.json: 0xa3c131fa490fb486061d48e296489a15d5528d01

# Diff at Tue, 12 Aug 2025 15:57:42 GMT:

- chain: scroll
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1754921961
- current timestamp: 1755014055

## Description

USDC rescuer added.

## Watched changes

```diff
    contract Scroll USDC (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4) {
    +++ description: Contract of the USDC token on Scroll.
      values.rescuer:
-        "scr:0x0000000000000000000000000000000000000000"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
    }
```

Generated with discovered.json: 0x1675a3c48ada4ccf97f25620eb2b67911bf9e5ff

# Diff at Mon, 11 Aug 2025 14:21:53 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@5240759eaee5dedb92fe72951feec7c70dca9b61 block: 1754910994
- current timestamp: 1754921961

## Description

Verifier source verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754910994 (main branch discovery), not current.

```diff
    contract PlonkVerifierPostEuclid-2 (0x39854DF30b3482Ef546F68B8981Fae5A2C426eA4) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0x4ad50f22109a8ff91daad934d6d1519aa3d186c4d8ebc1ffdc165e0986aa23ae"]
      references:
+        [{"text":"Source Code","href":"https://circuit-release.s3.us-west-2.amazonaws.com/scroll-zkvm/releases/0.5.2/bundle/verifier.bin"}]
    }
```

Generated with discovered.json: 0x363b0af47f1b8808392eef5bf2a4e23e935b9d22

# Diff at Mon, 11 Aug 2025 11:23:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1754475055
- current timestamp: 1754910994

## Description

Soundness bug and verifier emergency update. No postmortem yet.
https://etherscan.io/tx/0x3367e24b6cb138cea321f4556259660f24aba1b79ccce8f798ed135e28905f17

added incident.

## Watched changes

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Contract used to update the verifier and keep track of current and old versions.
      values.latestVerifier.6.verifier:
-        "eth:0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba"
+        "eth:0xc084a6De8b0F2742396572d6f110eC87ca9329bA"
      values.latestVerifier.6.startBatchIndex:
-        0
+        364588
      values.legacyVerifiersLength.6:
-        0
+        1
    }
```

```diff
-   Status: DELETED
    contract  (0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ZkEvmVerifierPostEuclid (0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifierPostEuclid-2 (0x39854DF30b3482Ef546F68B8981Fae5A2C426eA4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierPostEuclid-2 (0xc084a6De8b0F2742396572d6f110eC87ca9329bA)
    +++ description: None
```

## Source code changes

```diff
.../ZkEvmVerifierPostEuclid-2.sol}                                        | 0
 .../ZkEvmVerifierPostEuclid.sol}                                          | 0
 2 files changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754475055 (main branch discovery), not current.

```diff
    contract  (0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6) {
    +++ description: None
      name:
-        "PlonkVerifierPostEuclid-2"
+        ""
    }
```

```diff
    contract ZkEvmVerifierPostEuclid (0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba) {
    +++ description: None
      name:
-        "ZkEvmVerifierPostEuclid-2"
+        "ZkEvmVerifierPostEuclid"
    }
```

Generated with discovered.json: 0x702c1de2593846e5c1a811495641a1498ae1a084

# Diff at Wed, 06 Aug 2025 10:12:58 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@20ccf0027e872551f979af7bbff38272be6736e1 block: 1754403402
- current timestamp: 1754475055

## Description

Added Security Council minority permission.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754403402 (main branch discovery), not current.

```diff
    contract Scroll Security Council Minority (0x40bD67b02EBf1CFB4AdA7F60CabAc94d6aafc6eE) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"unpause core contracts via the PauseController.","role":".scMinorityNoDelay"}]
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.scMinorityNoDelay:
+        ["eth:0x40bD67b02EBf1CFB4AdA7F60CabAc94d6aafc6eE"]
    }
```

Generated with discovered.json: 0x2129e7de31b81bfd1c58f8801b75b76f35c39de5

# Diff at Tue, 05 Aug 2025 14:17:53 GMT:

- chain: scroll
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c1e07047673eba24b2ca6018329031ddf50eef7d block: 1753093859
- current timestamp: 1754403402

## Description

Access control changes.

## Watched changes

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.roles.PAUSE_CONTROLLER_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["scr:0xAf9a61Aa21aB4a2fdbc88e81363D2e3D359749dd"]}
      values.accessControl.roles.SECURITY_COUNCIL_MINORITY_NO_DELAY_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["scr:0x40bD67b02EBf1CFB4AdA7F60CabAc94d6aafc6eE"]}
      values.accessControl.targets.scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC.setPause(bool).0:
+        "SECURITY_COUNCIL_NO_DELAY_ROLE"
      values.accessControl.targets.scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC.setPause(bool).0:
-        "emergency-nodelay"
+        "PAUSE_CONTROLLER_ROLE"
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.0xaa5e9334:
+        ["ops-fast"]
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002.0xc63b9e2d:
+        ["ops-fast"]
      values.accessControl.targets.scr:0x331A873a2a85219863d80d248F9e2978fE88D0Ea:
+        {"updateBaseFeeOverhead(uint256)":["ops-fast"],"updateBaseFeeScalar(uint256)":["ops-fast"]}
      values.accessControl.targets.scr:0xAf9a61Aa21aB4a2fdbc88e81363D2e3D359749dd:
+        {"pause(address)":["emergency-nodelay"],"updatePauseCooldownPeriod(uint256)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"resetPauseCooldownPeriod(address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"unpause(address)":["emergency-nodelay","SECURITY_COUNCIL_MINORITY_NO_DELAY_ROLE"]}
    }
```

```diff
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0) {
    +++ description: Used to propose and manage onchain governance proposals.
      values.votingDelay:
-        86400
+        3600
      values.votingPeriod:
-        201600
+        432000
    }
```

```diff
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026) {
    +++ description: None
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"scr:0xAf9a61Aa21aB4a2fdbc88e81363D2e3D359749dd","role":"admin"}
    }
```

```diff
+   Status: CREATED
    contract Scroll Security Council Minority (0x40bD67b02EBf1CFB4AdA7F60CabAc94d6aafc6eE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2PauseController (0xAf9a61Aa21aB4a2fdbc88e81363D2e3D359749dd)
    +++ description: None
```

## Source code changes

```diff
.../.flat/L2PauseController/PauseController.sol    |  619 +++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  729 +++++++++++++
 .../Scroll Security Council Minority/SafeL2.sol    | 1152 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 4 files changed, 2537 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753093859 (main branch discovery), not current.

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.roles.TIMELOCK_1DAY_DELAY_TOLE:
-        {"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}
      values.accessControl.roles.TIMELOCK_1DAY_DELAY_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}
    }
```

Generated with discovered.json: 0xab6e2506f957aa6e6de33f09471f27c961bb729b

# Diff at Tue, 05 Aug 2025 14:17:50 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c1e07047673eba24b2ca6018329031ddf50eef7d block: 1753093859
- current timestamp: 1754403402

## Description

Access control changes.

## Watched changes

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.roles.PAUSE_CONTROLLER_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xb8f7eA9998530833Cbb7E0EF4f0D945957229D8b"]}
      values.accessControl.roles.SECURITY_COUNCIL_MINORITY_NO_DELAY_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x40bD67b02EBf1CFB4AdA7F60CabAc94d6aafc6eE"]}
      values.accessControl.targets.eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556.setPause(bool).0:
+        "SECURITY_COUNCIL_NO_DELAY_ROLE"
      values.accessControl.targets.eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556.setPause(bool).0:
-        "emergency-nodelay"
+        "PAUSE_CONTROLLER_ROLE"
      values.accessControl.targets.eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556.updateMaxNumTxInChunk(uint256):
-        ["ops-fast"]
      values.accessControl.targets.eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.setPause(bool).0:
+        "SECURITY_COUNCIL_NO_DELAY_ROLE"
      values.accessControl.targets.eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.setPause(bool).0:
-        "emergency-nodelay"
+        "PAUSE_CONTROLLER_ROLE"
      values.accessControl.targets.eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.updateFeeVault(address).0:
-        "ops-fast"
+        "SECURITY_COUNCIL_NO_DELAY_ROLE"
      values.accessControl.targets.eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.updateMaxReplayTimes(uint256):
-        ["ops-fast"]
      values.accessControl.targets.eth:0x8432728A257646449245558B8b7Dbe51A16c7a4D.updateMessageQueueParameters((uint32,uint112,uint112)).0:
-        "ops-fast"
+        "SECURITY_COUNCIL_NO_DELAY_ROLE"
      values.accessControl.targets.eth:0x8432728A257646449245558B8b7Dbe51A16c7a4D.updateEnforcedBatchParameters((uint24,uint24)).0:
-        "ops-fast"
+        "SECURITY_COUNCIL_NO_DELAY_ROLE"
      values.accessControl.targets.eth:0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d.setPause(bool).0:
+        "SECURITY_COUNCIL_NO_DELAY_ROLE"
      values.accessControl.targets.eth:0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d.setPause(bool).0:
-        "emergency-nodelay"
+        "PAUSE_CONTROLLER_ROLE"
      values.accessControl.targets.eth:0xb8f7eA9998530833Cbb7E0EF4f0D945957229D8b:
+        {"pause(address)":["emergency-nodelay"],"updatePauseCooldownPeriod(uint256)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"resetPauseCooldownPeriod(address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"unpause(address)":["emergency-nodelay","SECURITY_COUNCIL_MINORITY_NO_DELAY_ROLE"]}
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      directlyReceivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0xb8f7eA9998530833Cbb7E0EF4f0D945957229D8b","role":"admin"}
    }
```

```diff
+   Status: CREATED
    contract Scroll Security Council Minority (0x40bD67b02EBf1CFB4AdA7F60CabAc94d6aafc6eE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PauseController (0xb8f7eA9998530833Cbb7E0EF4f0D945957229D8b)
    +++ description: None
```

## Source code changes

```diff
.../.flat/PauseController/PauseController.sol      |  619 +++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  729 +++++++++++++
 .../Scroll Security Council Minority/Safe.sol      | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 4 files changed, 2473 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753093859 (main branch discovery), not current.

```diff
    contract TimelockSCEmergency (0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.2:
+        {"permission":"interact","from":"eth:0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update and reset the PauseController cooldown period.","role":".scNoDelay"}
      directlyReceivedPermissions.4:
+        {"permission":"interact","from":"eth:0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the L1ScrollMessenger fee vault address.","role":".scNoDelay"}
      directlyReceivedPermissions.5:
+        {"permission":"interact","from":"eth:0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the minimum delay message queue parameters and enforced mode parameters.","role":".scNoDelay"}
    }
```

```diff
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.3:
-        {"permission":"interact","from":"eth:0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the L1ScrollMessenger fee vault address.","role":".opsFast"}
      directlyReceivedPermissions.4:
-        {"permission":"interact","from":"eth:0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the minimum delay message queue parameters and enforced mode parameters.","role":".opsFast"}
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"interact","from":"eth:0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update and reset the PauseController cooldown period.","role":".scNoDelay","via":[{"address":"eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]}
      receivedPermissions.13:
+        {"permission":"interact","from":"eth:0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the L1ScrollMessenger fee vault address.","role":".scNoDelay","via":[{"address":"eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]}
      receivedPermissions.14:
+        {"permission":"interact","from":"eth:0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the minimum delay message queue parameters and enforced mode parameters.","role":".scNoDelay","via":[{"address":"eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]}
    }
```

```diff
    contract TimelockEmergency (0x826714adD4dDA2b8750794A467C892c0Cd49216b) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.description:
-        "pause the L1 -> L2 messenger and enforced transaction mode."
+        "pause the ScrollChain in permissioned mode and the L1 -> L2 message queue."
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      receivedPermissions.0.description:
-        "pause the L1 -> L2 messenger and enforced transaction mode."
+        "pause the ScrollChain in permissioned mode and the L1 -> L2 message queue."
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      receivedPermissions.6:
-        {"permission":"interact","from":"eth:0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the L1ScrollMessenger fee vault address.","role":".opsFast","via":[{"address":"eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]}
      receivedPermissions.7:
-        {"permission":"interact","from":"eth:0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the minimum delay message queue parameters and enforced mode parameters.","role":".opsFast","via":[{"address":"eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]}
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      values.gateways:
+        {"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2":"eth:0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48":"eth:0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B","eth:0x6B175474E89094C44Da98b954EedeAC495271d0F":"eth:0x67260A8B73C5B77B55c1805218A42A7A6F98F515","eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0":"eth:0x6625C6332c9F91F2D27c304E729B86db87A3f504","eth:0xD9A442856C234a39a81a089C06451EBAa4306a72":"eth:0xA033Ff09f2da45f0e9ae495f525363722Df42b2a"}
    }
```

Generated with discovered.json: 0x9b36c271cfd6a020df8e88b2d9ad59a584a8a454

# Diff at Thu, 31 Jul 2025 10:55:15 GMT:

- chain: scroll
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@07319d194d312aca8103826b7db44d44613cc7fa block: 1753093859
- current timestamp: 1753093859

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753093859 (main branch discovery), not current.

```diff
    contract TimelockSCEmergencyScroll (0x1f807E2E8ab2e61230a0A9C271F90242831278b4) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      name:
-        "TimelockSCEmergency"
+        "TimelockSCEmergencyScroll"
    }
```

Generated with discovered.json: 0x6303a10360194ad898c7dc058c2695e0c9e1ca60

# Diff at Mon, 21 Jul 2025 10:32:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c89d5207a278197d1d4bfd60ac8e37852accba7c block: 22731106
- current block number: 22966983

## Description

fee config change (decrease baseFeeOverhead and -scalar).

## Watched changes

```diff
    contract SystemConfig (0x8432728A257646449245558B8b7Dbe51A16c7a4D) {
    +++ description: System configuration contract for Scroll, contains enforcedBatchParameters and messageQueueParameters determining permissionless mode.
      values.messageQueueParameters.baseFeeOverhead:
-        4790000
+        120000
      values.messageQueueParameters.baseFeeScalar:
-        388000000000000
+        9700000000000
    }
```

Generated with discovered.json: 0x16f3ff55675a5fbde37e84d4506b3ff4ff786461

# Diff at Mon, 14 Jul 2025 12:47:11 GMT:

- chain: scroll
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 17024223
- current block number: 17024223

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17024223 (main branch discovery), not current.

```diff
    EOA  (0x0000000000000000000000000000000000000001) {
    +++ description: None
      address:
-        "0x0000000000000000000000000000000000000001"
+        "scr:0x0000000000000000000000000000000000000001"
    }
```

```diff
    contract Scroll USDC (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4) {
    +++ description: Contract of the USDC token on Scroll.
      address:
-        "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
+        "scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b"
+        "scr:0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b"
      values.admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.blacklister:
-        "0x0000000000000000000000000000000000000001"
+        "scr:0x0000000000000000000000000000000000000001"
      values.implementation:
-        "0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b"
+        "scr:0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b"
      values.masterMinter:
-        "0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE"
+        "scr:0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.pauser:
-        "0x0000000000000000000000000000000000000001"
+        "scr:0x0000000000000000000000000000000000000001"
      values.rescuer:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      implementationNames.0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4:
-        "FiatTokenProxy"
      implementationNames.0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b:
-        "FiatTokenV2_1"
      implementationNames.scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4:
+        "FiatTokenProxy"
      implementationNames.scr:0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b:
+        "FiatTokenV2_1"
    }
```

```diff
    EOA  (0x0c5cc5155b346453154059aD9d2Ff695dB92f774) {
    +++ description: None
      address:
-        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
+        "scr:0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

```diff
    EOA  (0x0f50874f227621Dea72482004639a9fFe440A4dA) {
    +++ description: None
      address:
-        "0x0f50874f227621Dea72482004639a9fFe440A4dA"
+        "scr:0x0f50874f227621Dea72482004639a9fFe440A4dA"
    }
```

```diff
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F) {
    +++ description: None
      address:
-        "0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
+        "scr:0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "scr:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
+        "scr:0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
      values.$members.1:
-        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
+        "scr:0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
      values.$members.2:
-        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
+        "scr:0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
      values.$members.3:
-        "0x6626593C237f530D15aE9980A95ef938Ac15c35c"
+        "scr:0x6626593C237f530D15aE9980A95ef938Ac15c35c"
      values.$members.4:
-        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
+        "scr:0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
      values.$members.5:
-        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
+        "scr:0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
      values.$members.6:
-        "0x9106372987a14400F283bc1AfC122A57130c18a3"
+        "scr:0x9106372987a14400F283bc1AfC122A57130c18a3"
      values.$members.7:
-        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
+        "scr:0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
      values.$members.8:
-        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
+        "scr:0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
      values.$members.9:
-        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
+        "scr:0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
      values.$members.10:
-        "0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
+        "scr:0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
      values.$members.11:
-        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
+        "scr:0x32E8B0B9783d65170fd37f79079d5707107cCc62"
      implementationNames.0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.scr:0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F:
+        "GnosisSafeProxy"
      implementationNames.scr:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      address:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.accessControl.roles.DEFAULT_ADMIN_ROLE.members.0:
-        "0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      values.accessControl.roles.SECURITY_COUNCIL_NO_DELAY_ROLE.members.0:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      values.accessControl.roles.emergency-nodelay.members.0:
-        "0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      values.accessControl.roles.ops-fast.members.0:
-        "0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      values.accessControl.targets.0xA76acF000C890b0DD7AEEf57627d9899F955d026:
-        {"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81:
-        {"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.0x5300000000000000000000000000000000000003:
-        {"updateWhitelistStatus(address[],bool)":["emergency-nodelay"]}
      values.accessControl.targets.0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC:
-        {"setPause(bool)":["emergency-nodelay"]}
      values.accessControl.targets.0x33B60d5Dd260d453cAC3782b0bDC01ce84672142:
-        {"pauseDeposit(bool)":["emergency-nodelay"],"pauseWithdraw(bool)":["emergency-nodelay"],"updateCircleCaller(address)":["ops-fast"]}
      values.accessControl.targets.0x5300000000000000000000000000000000000002:
-        {"setOverhead(uint256)":["ops-fast"],"setCommitScalar(uint256)":["ops-fast"],"setBlobScalar(uint256)":["ops-fast"]}
      values.accessControl.targets.0x5300000000000000000000000000000000000005:
-        {"updateMinWithdrawAmount(uint256)":["ops-fast"],"updateRecipient(address)":["ops-fast"]}
      values.accessControl.targets.0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79:
-        {"setERC20Gateway(address[],address[])":["ops-fast"]}
      values.accessControl.targets.0x64CCBE37c9A82D85A1F2E74649b7A42923067988:
-        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.0x7bC08E1c04fb41d75F1410363F0c5746Eae80582:
-        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc:
-        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4:
-        {"transferOwnership(address)":["ops-fast"]}
      values.accessControl.targets.0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE:
-        {"transferOwnership(address)":["ops-fast"]}
      values.accessControl.targets.0xa1a12158bE6269D7580C63eC5E609Cdc0ddD82bC:
-        {"withdrawFailedAmount(address,address)":["ops-fast"],"grantRole(bytes32,address)":["ops-fast"],"revokeRole(bytes32,address)":["ops-fast"]}
      values.accessControl.targets.scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026:
+        {"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.scr:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81:
+        {"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000003:
+        {"updateWhitelistStatus(address[],bool)":["emergency-nodelay"]}
      values.accessControl.targets.scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC:
+        {"setPause(bool)":["emergency-nodelay"]}
      values.accessControl.targets.scr:0x33B60d5Dd260d453cAC3782b0bDC01ce84672142:
+        {"pauseDeposit(bool)":["emergency-nodelay"],"pauseWithdraw(bool)":["emergency-nodelay"],"updateCircleCaller(address)":["ops-fast"]}
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002:
+        {"setOverhead(uint256)":["ops-fast"],"setCommitScalar(uint256)":["ops-fast"],"setBlobScalar(uint256)":["ops-fast"]}
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000005:
+        {"updateMinWithdrawAmount(uint256)":["ops-fast"],"updateRecipient(address)":["ops-fast"]}
      values.accessControl.targets.scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79:
+        {"setERC20Gateway(address[],address[])":["ops-fast"]}
      values.accessControl.targets.scr:0x64CCBE37c9A82D85A1F2E74649b7A42923067988:
+        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.scr:0x7bC08E1c04fb41d75F1410363F0c5746Eae80582:
+        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.scr:0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc:
+        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4:
+        {"transferOwnership(address)":["ops-fast"]}
      values.accessControl.targets.scr:0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE:
+        {"transferOwnership(address)":["ops-fast"]}
      values.accessControl.targets.scr:0xa1a12158bE6269D7580C63eC5E609Cdc0ddD82bC:
+        {"withdrawFailedAmount(address,address)":["ops-fast"],"grantRole(bytes32,address)":["ops-fast"],"revokeRole(bytes32,address)":["ops-fast"]}
      values.scNoDelay.0:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      implementationNames.0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B:
-        "ScrollOwner"
      implementationNames.scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B:
+        "ScrollOwner"
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      address:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0x0f50874f227621Dea72482004639a9fFe440A4dA"
+        "scr:0x0f50874f227621Dea72482004639a9fFe440A4dA"
      values.$members.1:
-        "0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
+        "scr:0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
      values.$members.2:
-        "0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
+        "scr:0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
      values.$members.3:
-        "0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
+        "scr:0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
      values.$members.4:
-        "0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
+        "scr:0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
      values.$members.5:
-        "0x30315233090F675520eef5CBd7A6cf7d185af443"
+        "scr:0x30315233090F675520eef5CBd7A6cf7d185af443"
      values.$members.6:
-        "0x9479ABfebefEea3c846163012a472b44F305b3d7"
+        "scr:0x9479ABfebefEea3c846163012a472b44F305b3d7"
      values.$members.7:
-        "0x383C148ba96956F985F6141B2D119add1C34e3B7"
+        "scr:0x383C148ba96956F985F6141B2D119add1C34e3B7"
      values.$members.8:
-        "0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
+        "scr:0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
      values.$members.9:
-        "0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
+        "scr:0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
      values.$members.10:
-        "0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
+        "scr:0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
      values.$members.11:
-        "0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
+        "scr:0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
      implementationNames.0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD:
+        "SafeProxy"
      implementationNames.scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    EOA  (0x1Da431d2D5ECA4Df735F69fB5ea10c8E630b8f50) {
    +++ description: None
      address:
-        "0x1Da431d2D5ECA4Df735F69fB5ea10c8E630b8f50"
+        "scr:0x1Da431d2D5ECA4Df735F69fB5ea10c8E630b8f50"
    }
```

```diff
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      address:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.Canceller.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.Proposer.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.timelockAdminAC.0:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      values.timelockAdminAC.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      implementationNames.0x1f807E2E8ab2e61230a0A9C271F90242831278b4:
-        "TimelockController"
      implementationNames.scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4:
+        "TimelockController"
    }
```

```diff
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      address:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "scr:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.$members.1:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "scr:0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.$members.2:
-        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
+        "scr:0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
      values.$members.3:
-        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
+        "scr:0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
      implementationNames.0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f:
+        "GnosisSafeProxy"
      implementationNames.scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf) {
    +++ description: None
      address:
-        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
+        "scr:0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
    }
```

```diff
    EOA  (0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B) {
    +++ description: None
      address:
-        "0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B"
+        "scr:0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B"
    }
```

```diff
    EOA  (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5) {
    +++ description: None
      address:
-        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
+        "scr:0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
    }
```

```diff
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      address:
-        "0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.Canceller.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.Proposer.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.timelockAdminAC.0:
-        "0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      values.timelockAdminAC.1:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      implementationNames.0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376:
-        "TimelockController"
      implementationNames.scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376:
+        "TimelockController"
    }
```

```diff
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351) {
    +++ description: None
      address:
-        "0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351"
+        "scr:0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "scr:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0xd5A0f3DfCe7128B7119462F7aC912616bB05b593"
+        "scr:0xd5A0f3DfCe7128B7119462F7aC912616bB05b593"
      values.$members.1:
-        "0x1Da431d2D5ECA4Df735F69fB5ea10c8E630b8f50"
+        "scr:0x1Da431d2D5ECA4Df735F69fB5ea10c8E630b8f50"
      values.$members.2:
-        "0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B"
+        "scr:0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B"
      implementationNames.0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.scr:0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351:
+        "GnosisSafeProxy"
      implementationNames.scr:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0) {
    +++ description: Used to propose and manage onchain governance proposals.
      address:
-        "0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
      values.$admin:
-        "0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
+        "scr:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
      values.$implementation:
-        "0xd74aD535faE370Ec0762ECe045EeB8970Be378F7"
+        "scr:0xd74aD535faE370Ec0762ECe045EeB8970Be378F7"
      values.$pastUpgrades.0.2.0:
-        "0x4dCEC34886014C1a2E1Ca742B5Bd7B9952B7f4A2"
+        "scr:0x4dCEC34886014C1a2E1Ca742B5Bd7B9952B7f4A2"
      values.$pastUpgrades.1.2.0:
-        "0xd74aD535faE370Ec0762ECe045EeB8970Be378F7"
+        "scr:0xd74aD535faE370Ec0762ECe045EeB8970Be378F7"
      values.admin:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.manager:
-        "0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351"
+        "scr:0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351"
      values.PROPOSAL_TYPES_CONFIGURATOR:
-        "0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E"
+        "scr:0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E"
      values.timelock:
-        "0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      values.token:
-        "0xd29687c813D741E2F938F4aC377128810E217b1b"
+        "scr:0xd29687c813D741E2F938F4aC377128810E217b1b"
      implementationNames.0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0:
-        "TransparentUpgradeableProxy"
      implementationNames.0xd74aD535faE370Ec0762ECe045EeB8970Be378F7:
-        "AgoraGovernor"
      implementationNames.scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0xd74aD535faE370Ec0762ECe045EeB8970Be378F7:
+        "AgoraGovernor"
    }
```

```diff
    EOA  (0x30315233090F675520eef5CBd7A6cf7d185af443) {
    +++ description: None
      address:
-        "0x30315233090F675520eef5CBd7A6cf7d185af443"
+        "scr:0x30315233090F675520eef5CBd7A6cf7d185af443"
    }
```

```diff
    EOA  (0x32E8B0B9783d65170fd37f79079d5707107cCc62) {
    +++ description: None
      address:
-        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
+        "scr:0x32E8B0B9783d65170fd37f79079d5707107cCc62"
    }
```

```diff
    EOA  (0x383C148ba96956F985F6141B2D119add1C34e3B7) {
    +++ description: None
      address:
-        "0x383C148ba96956F985F6141B2D119add1C34e3B7"
+        "scr:0x383C148ba96956F985F6141B2D119add1C34e3B7"
    }
```

```diff
    EOA  (0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD) {
    +++ description: None
      address:
-        "0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
+        "scr:0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
    }
```

```diff
    contract L2GatewayRouter (0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79) {
    +++ description: Counterpart to the L1GatewayRouter contract.
      address:
-        "0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
+        "scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763"
+        "scr:0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763"
      values.$pastUpgrades.0.2.0:
-        "0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763"
+        "scr:0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763"
      values.defaultERC20Gateway:
-        "0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "scr:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
      values.ethGateway:
-        "0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
+        "scr:0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79:
-        "TransparentUpgradeableProxy"
      implementationNames.0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763:
-        "L2GatewayRouter"
      implementationNames.scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763:
+        "L2GatewayRouter"
    }
```

```diff
    contract L2MessageQueue (0x5300000000000000000000000000000000000000) {
    +++ description: Used to append messages to the L2MessageQueue from the L2ScrollMessenger.
      address:
-        "0x5300000000000000000000000000000000000000"
+        "scr:0x5300000000000000000000000000000000000000"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0x5300000000000000000000000000000000000000:
-        "L2MessageQueue"
      implementationNames.scr:0x5300000000000000000000000000000000000000:
+        "L2MessageQueue"
    }
```

```diff
    EOA cts-Zellic (0x5a09A94eE8198D3c474d723337aa58023810022C) {
    +++ description: None
      address:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "scr:0x5a09A94eE8198D3c474d723337aa58023810022C"
    }
```

```diff
    contract L2ERC1155Gateway (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc) {
    +++ description: Counterpart to the L1ERC1155Gateway contract.
      address:
-        "0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
+        "scr:0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94"
+        "scr:0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94"
      values.$pastUpgrades.0.2.0:
-        "0x4a1b3D103801F0E1400046aE1948B9808e9b043b"
+        "scr:0x4a1b3D103801F0E1400046aE1948B9808e9b043b"
      values.$pastUpgrades.1.2.0:
-        "0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94"
+        "scr:0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      implementationNames.0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc:
-        "TransparentUpgradeableProxy"
      implementationNames.0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94:
-        "L2ERC1155Gateway"
      implementationNames.scr:0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94:
+        "L2ERC1155Gateway"
    }
```

```diff
    contract L2CustomERC20Gateway (0x64CCBE37c9A82D85A1F2E74649b7A42923067988) {
    +++ description: Counterpart to the L1CustomERC20Gateway contract.
      address:
-        "0x64CCBE37c9A82D85A1F2E74649b7A42923067988"
+        "scr:0x64CCBE37c9A82D85A1F2E74649b7A42923067988"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x1D40306EEfCF6EBd496d6048F6edf8892346e558"
+        "scr:0x1D40306EEfCF6EBd496d6048F6edf8892346e558"
      values.$pastUpgrades.0.2.0:
-        "0xc568B5dcCeBE52073Fa783EAdacDE0a30fA4c2c9"
+        "scr:0xc568B5dcCeBE52073Fa783EAdacDE0a30fA4c2c9"
      values.$pastUpgrades.1.2.0:
-        "0x1D40306EEfCF6EBd496d6048F6edf8892346e558"
+        "scr:0x1D40306EEfCF6EBd496d6048F6edf8892346e558"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.router:
-        "0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
+        "scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
      implementationNames.0x64CCBE37c9A82D85A1F2E74649b7A42923067988:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1D40306EEfCF6EBd496d6048F6edf8892346e558:
-        "L2CustomERC20Gateway"
      implementationNames.scr:0x64CCBE37c9A82D85A1F2E74649b7A42923067988:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x1D40306EEfCF6EBd496d6048F6edf8892346e558:
+        "L2CustomERC20Gateway"
    }
```

```diff
    EOA  (0x6626593C237f530D15aE9980A95ef938Ac15c35c) {
    +++ description: None
      address:
-        "0x6626593C237f530D15aE9980A95ef938Ac15c35c"
+        "scr:0x6626593C237f530D15aE9980A95ef938Ac15c35c"
    }
```

```diff
    contract ScrollStandardERC20Factory (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    +++ description: Contract used to deploy ScrollStandardERC20 tokens for L2StandardERC20Gateway.
      address:
-        "0x66e5312EDeEAef6e80759A0F789e7914Fb401484"
+        "scr:0x66e5312EDeEAef6e80759A0F789e7914Fb401484"
      values.implementation:
-        "0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
+        "scr:0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
      values.owner:
-        "0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "scr:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
      implementationNames.0x66e5312EDeEAef6e80759A0F789e7914Fb401484:
-        "ScrollStandardERC20Factory"
      implementationNames.scr:0x66e5312EDeEAef6e80759A0F789e7914Fb401484:
+        "ScrollStandardERC20Factory"
    }
```

```diff
    EOA  (0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3) {
    +++ description: None
      address:
-        "0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
+        "scr:0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
    }
```

```diff
    contract SafeL2 (0x69C2eD64171bF5737c2B78bdF722e68a032B2825) {
    +++ description: None
      address:
-        "0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
+        "scr:0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0xc8B6bF89877337188Ea84eA93547687225389553"
+        "scr:0xc8B6bF89877337188Ea84eA93547687225389553"
      values.$members.1:
-        "0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
+        "scr:0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
      values.$members.2:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "scr:0x5a09A94eE8198D3c474d723337aa58023810022C"
      implementationNames.0x69C2eD64171bF5737c2B78bdF722e68a032B2825:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.scr:0x69C2eD64171bF5737c2B78bdF722e68a032B2825:
+        "SafeProxy"
      implementationNames.scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    contract L2ETHGateway (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    +++ description: Contract of the L2ScrollMessenger contract.
      address:
-        "0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
+        "scr:0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x191770c52309dff2c52FfEcf059ECC3862f5D721"
+        "scr:0x191770c52309dff2c52FfEcf059ECC3862f5D721"
      values.$pastUpgrades.0.2.0:
-        "0xE0a0509a66C509f55c85A20EB8c60676135081f7"
+        "scr:0xE0a0509a66C509f55c85A20EB8c60676135081f7"
      values.$pastUpgrades.1.2.0:
-        "0x191770c52309dff2c52FfEcf059ECC3862f5D721"
+        "scr:0x191770c52309dff2c52FfEcf059ECC3862f5D721"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.router:
-        "0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
+        "scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
      implementationNames.0x6EA73e05AdC79974B931123675ea8F78FfdacDF0:
-        "TransparentUpgradeableProxy"
      implementationNames.0x191770c52309dff2c52FfEcf059ECC3862f5D721:
-        "L2ETHGateway"
      implementationNames.scr:0x6EA73e05AdC79974B931123675ea8F78FfdacDF0:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x191770c52309dff2c52FfEcf059ECC3862f5D721:
+        "L2ETHGateway"
    }
```

```diff
    EOA  (0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed) {
    +++ description: None
      address:
-        "0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
+        "scr:0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
    }
```

```diff
    EOA  (0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d) {
    +++ description: None
      address:
-        "0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
+        "scr:0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
    }
```

```diff
    EOA  (0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d) {
    +++ description: None
      address:
-        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
+        "scr:0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
    }
```

```diff
    contract L2ScrollMessenger (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    +++ description: ETH is pre-minted to this contract in the genesis block and released on Scroll whenever corresponding deposits are made on Ethereum.
      address:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772"
+        "scr:0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772"
      values.$pastUpgrades.0.2.0:
-        "0x485149079c421f9e4c465276BbaBB2fE0748d138"
+        "scr:0x485149079c421f9e4c465276BbaBB2fE0748d138"
      values.$pastUpgrades.1.2.0:
-        "0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772"
+        "scr:0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772"
      values.feeVault:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.messageQueue:
-        "0x5300000000000000000000000000000000000000"
+        "scr:0x5300000000000000000000000000000000000000"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.xDomainMessageSender:
-        "0x0000000000000000000000000000000000000001"
+        "scr:0x0000000000000000000000000000000000000001"
      implementationNames.0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772:
-        "L2ScrollMessenger"
      implementationNames.scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772:
+        "L2ScrollMessenger"
    }
```

```diff
    contract TimelockSCSlow (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14) {
    +++ description: None
      address:
-        "0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      values.timelockAdminAC.0:
-        "0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      values.timelockAdminAC.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      implementationNames.0x79D83D1518e2eAA64cdc0631df01b06e2762CC14:
-        "TimelockController"
      implementationNames.scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14:
+        "TimelockController"
    }
```

```diff
    contract L2ERC721Gateway (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582) {
    +++ description: Counterpart to the L1ERC721Gateway contract.
      address:
-        "0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"
+        "scr:0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x0894150DB82B912105F6D0907B5c69E72F1Df279"
+        "scr:0x0894150DB82B912105F6D0907B5c69E72F1Df279"
      values.$pastUpgrades.0.2.0:
-        "0x71d7F43617CEaE99A43B7727151267A9919288F6"
+        "scr:0x71d7F43617CEaE99A43B7727151267A9919288F6"
      values.$pastUpgrades.1.2.0:
-        "0x0894150DB82B912105F6D0907B5c69E72F1Df279"
+        "scr:0x0894150DB82B912105F6D0907B5c69E72F1Df279"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      implementationNames.0x7bC08E1c04fb41d75F1410363F0c5746Eae80582:
-        "TransparentUpgradeableProxy"
      implementationNames.0x0894150DB82B912105F6D0907B5c69E72F1Df279:
-        "L2ERC721Gateway"
      implementationNames.scr:0x7bC08E1c04fb41d75F1410363F0c5746Eae80582:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x0894150DB82B912105F6D0907B5c69E72F1Df279:
+        "L2ERC721Gateway"
    }
```

```diff
    contract ProxyAdmin (0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81) {
    +++ description: None
      address:
-        "0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
+        "scr:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81:
-        "ProxyAdmin"
      implementationNames.scr:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae) {
    +++ description: None
      address:
-        "0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
+        "scr:0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
    }
```

```diff
    EOA  (0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424) {
    +++ description: None
      address:
-        "0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
+        "scr:0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
    }
```

```diff
    contract SafeL2 (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC) {
    +++ description: None
      address:
-        "0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
+        "scr:0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
+        "scr:0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
      values.$members.1:
-        "0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
+        "scr:0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
      values.$members.2:
-        "0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
+        "scr:0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
      implementationNames.0x8edC4EADEE120d4C51923c515e7C3241c815C2BC:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.scr:0x8edC4EADEE120d4C51923c515e7C3241c815C2BC:
+        "SafeProxy"
      implementationNames.scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    EOA  (0x9106372987a14400F283bc1AfC122A57130c18a3) {
    +++ description: None
      address:
-        "0x9106372987a14400F283bc1AfC122A57130c18a3"
+        "scr:0x9106372987a14400F283bc1AfC122A57130c18a3"
    }
```

```diff
    EOA  (0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a) {
    +++ description: None
      address:
-        "0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
+        "scr:0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
    }
```

```diff
    contract SafeL2 (0x9479ABfebefEea3c846163012a472b44F305b3d7) {
    +++ description: None
      address:
-        "0x9479ABfebefEea3c846163012a472b44F305b3d7"
+        "scr:0x9479ABfebefEea3c846163012a472b44F305b3d7"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
+        "scr:0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
      values.$members.1:
-        "0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
+        "scr:0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
      implementationNames.0x9479ABfebefEea3c846163012a472b44F305b3d7:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.scr:0x9479ABfebefEea3c846163012a472b44F305b3d7:
+        "SafeProxy"
      implementationNames.scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    EOA  (0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4) {
    +++ description: None
      address:
-        "0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
+        "scr:0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
    }
```

```diff
    EOA  (0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1) {
    +++ description: None
      address:
-        "0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
+        "scr:0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
    }
```

```diff
    EOA  (0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD) {
    +++ description: None
      address:
-        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
+        "scr:0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
    }
```

```diff
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026) {
    +++ description: None
      address:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0xA76acF000C890b0DD7AEEf57627d9899F955d026:
-        "ProxyAdmin"
      implementationNames.scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026:
+        "ProxyAdmin"
    }
```

```diff
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      address:
-        "0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.Canceller.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.Proposer.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.timelockAdminAC.0:
-        "0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      values.timelockAdminAC.1:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      implementationNames.0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f:
-        "TimelockController"
      implementationNames.scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f:
+        "TimelockController"
    }
```

```diff
    EOA  (0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32) {
    +++ description: None
      address:
-        "0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
+        "scr:0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
    }
```

```diff
    EOA  (0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7) {
    +++ description: None
      address:
-        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
+        "scr:0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
    }
```

```diff
    EOA  (0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d) {
    +++ description: None
      address:
-        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
+        "scr:0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
    }
```

```diff
    contract MasterMinter (0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE) {
    +++ description:  Contract that uses controllers to manage minters for USDC on Scroll.
      address:
-        "0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE"
+        "scr:0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE"
      values.getMinterManager:
-        "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
+        "scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE:
-        "MasterMinter"
      implementationNames.scr:0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE:
+        "MasterMinter"
    }
```

```diff
    EOA  (0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3) {
    +++ description: None
      address:
-        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
+        "scr:0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      address:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
+        "scr:0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
      values.$members.1:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "scr:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.$members.2:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "scr:0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.$members.3:
-        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
+        "scr:0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
      implementationNames.0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc:
+        "GnosisSafeProxy"
      implementationNames.scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xc1985e3712b33a5303e097e9CeD22E91338ba64d) {
    +++ description: None
      address:
-        "0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
+        "scr:0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
    }
```

```diff
    contract SafeL2 (0xC3eA7C657884BB380B66D79C36aDCb5658b01896) {
    +++ description: None
      address:
-        "0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
+        "scr:0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
+        "scr:0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
      implementationNames.0xC3eA7C657884BB380B66D79C36aDCb5658b01896:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.scr:0xC3eA7C657884BB380B66D79C36aDCb5658b01896:
+        "SafeProxy"
      implementationNames.scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    contract ScrollStandardERC20 (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    +++ description: Contract of the ERC20 standard token used by the ERC20 factory.
      address:
-        "0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
+        "scr:0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
      values.counterpart:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.eip712Domain.verifyingContract:
-        "0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
+        "scr:0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
      values.gateway:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      implementationNames.0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69:
-        "ScrollStandardERC20"
      implementationNames.scr:0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69:
+        "ScrollStandardERC20"
    }
```

```diff
    EOA  (0xc8B6bF89877337188Ea84eA93547687225389553) {
    +++ description: None
      address:
-        "0xc8B6bF89877337188Ea84eA93547687225389553"
+        "scr:0xc8B6bF89877337188Ea84eA93547687225389553"
    }
```

```diff
    contract SCRToken (0xd29687c813D741E2F938F4aC377128810E217b1b) {
    +++ description: None
      address:
-        "0xd29687c813D741E2F938F4aC377128810E217b1b"
+        "scr:0xd29687c813D741E2F938F4aC377128810E217b1b"
      values.$admin:
-        "0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
+        "scr:0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
      values.$implementation:
-        "0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8"
+        "scr:0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8"
      values.$pastUpgrades.0.2.0:
-        "0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8"
+        "scr:0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8"
      values.eip712Domain.verifyingContract:
-        "0xd29687c813D741E2F938F4aC377128810E217b1b"
+        "scr:0xd29687c813D741E2F938F4aC377128810E217b1b"
      implementationNames.0xd29687c813D741E2F938F4aC377128810E217b1b:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8:
-        "L2GovToken"
      implementationNames.scr:0xd29687c813D741E2F938F4aC377128810E217b1b:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8:
+        "L2GovToken"
    }
```

```diff
    EOA  (0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f) {
    +++ description: None
      address:
-        "0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
+        "scr:0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
    }
```

```diff
    EOA  (0xd5A0f3DfCe7128B7119462F7aC912616bB05b593) {
    +++ description: None
      address:
-        "0xd5A0f3DfCe7128B7119462F7aC912616bB05b593"
+        "scr:0xd5A0f3DfCe7128B7119462F7aC912616bB05b593"
    }
```

```diff
    EOA  (0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC) {
    +++ description: None
      address:
-        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
+        "scr:0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
    }
```

```diff
    contract ProxyAdmin (0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e) {
    +++ description: None
      address:
-        "0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
+        "scr:0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e:
-        "ProxyAdmin"
      implementationNames.scr:0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e:
+        "ProxyAdmin"
    }
```

```diff
    contract L2GatewayRouter (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    +++ description: Contract used to withdraw ERC20 tokens on L2 and finalize deposit the tokens from L1.
      address:
-        "0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "scr:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x3ffe801a43D25d0288683237A848e14f73a226f0"
+        "scr:0x3ffe801a43D25d0288683237A848e14f73a226f0"
      values.$pastUpgrades.0.2.0:
-        "0xCaa86d504B7670f4BCe0B323c2AaF7002CF6C478"
+        "scr:0xCaa86d504B7670f4BCe0B323c2AaF7002CF6C478"
      values.$pastUpgrades.1.2.0:
-        "0x3ffe801a43D25d0288683237A848e14f73a226f0"
+        "scr:0x3ffe801a43D25d0288683237A848e14f73a226f0"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.router:
-        "0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
+        "scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
      values.tokenFactory:
-        "0x66e5312EDeEAef6e80759A0F789e7914Fb401484"
+        "scr:0x66e5312EDeEAef6e80759A0F789e7914Fb401484"
      implementationNames.0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A:
-        "TransparentUpgradeableProxy"
      implementationNames.0x3ffe801a43D25d0288683237A848e14f73a226f0:
-        "L2StandardERC20Gateway"
      implementationNames.scr:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x3ffe801a43D25d0288683237A848e14f73a226f0:
+        "L2StandardERC20Gateway"
    }
```

```diff
    EOA  (0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a) {
    +++ description: None
      address:
-        "0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
+        "scr:0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
    }
```

```diff
    EOA  (0xe515cD19E8a67BF367a1d20dA6f21035913a2897) {
    +++ description: None
      address:
-        "0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
+        "scr:0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
    }
```

```diff
    EOA  (0xEbbeeAA424AE904508465a41c927Be594C43Dc68) {
    +++ description: None
      address:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "scr:0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
    }
```

```diff
    EOA  (0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B) {
    +++ description: None
      address:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "scr:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      address:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "scr:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.$members.1:
-        "0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
+        "scr:0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
      values.$members.2:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "scr:0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
      values.$members.3:
-        "0xfc31892C5500AbE00974280b28907BaA9190E384"
+        "scr:0xfc31892C5500AbE00974280b28907BaA9190E384"
      values.$members.4:
-        "0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
+        "scr:0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
      implementationNames.0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe:
+        "GnosisSafeProxy"
      implementationNames.scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf) {
    +++ description: None
      address:
-        "0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
+        "scr:0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
    }
```

```diff
    EOA  (0xfc31892C5500AbE00974280b28907BaA9190E384) {
    +++ description: None
      address:
-        "0xfc31892C5500AbE00974280b28907BaA9190E384"
+        "scr:0xfc31892C5500AbE00974280b28907BaA9190E384"
    }
```

```diff
    EOA  (0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402) {
    +++ description: None
      address:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "scr:0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
    }
```

```diff
    contract ProposalTypesConfigurator (0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E) {
    +++ description: None
      address:
-        "0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E"
+        "scr:0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E"
      values.governor:
-        "0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
      implementationNames.0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E:
-        "ProposalTypesConfigurator"
      implementationNames.scr:0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E:
+        "ProposalTypesConfigurator"
    }
```

```diff
+   Status: CREATED
    contract Scroll USDC (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4)
    +++ description: Contract of the USDC token on Scroll.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B)
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
```

```diff
+   Status: CREATED
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4)
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376)
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0)
    +++ description: Used to propose and manage onchain governance proposals.
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79)
    +++ description: Counterpart to the L1GatewayRouter contract.
```

```diff
+   Status: CREATED
    contract L2MessageQueue (0x5300000000000000000000000000000000000000)
    +++ description: Used to append messages to the L2MessageQueue from the L2ScrollMessenger.
```

```diff
+   Status: CREATED
    contract L2ERC1155Gateway (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc)
    +++ description: Counterpart to the L1ERC1155Gateway contract.
```

```diff
+   Status: CREATED
    contract L2CustomERC20Gateway (0x64CCBE37c9A82D85A1F2E74649b7A42923067988)
    +++ description: Counterpart to the L1CustomERC20Gateway contract.
```

```diff
+   Status: CREATED
    contract ScrollStandardERC20Factory (0x66e5312EDeEAef6e80759A0F789e7914Fb401484)
    +++ description: Contract used to deploy ScrollStandardERC20 tokens for L2StandardERC20Gateway.
```

```diff
+   Status: CREATED
    contract SafeL2 (0x69C2eD64171bF5737c2B78bdF722e68a032B2825)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ETHGateway (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0)
    +++ description: Contract of the L2ScrollMessenger contract.
```

```diff
+   Status: CREATED
    contract L2ScrollMessenger (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC)
    +++ description: ETH is pre-minted to this contract in the genesis block and released on Scroll whenever corresponding deposits are made on Ethereum.
```

```diff
+   Status: CREATED
    contract TimelockSCSlow (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ERC721Gateway (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582)
    +++ description: Counterpart to the L1ERC721Gateway contract.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0x9479ABfebefEea3c846163012a472b44F305b3d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f)
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract MasterMinter (0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE)
    +++ description:  Contract that uses controllers to manage minters for USDC on Scroll.
```

```diff
+   Status: CREATED
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0xC3eA7C657884BB380B66D79C36aDCb5658b01896)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollStandardERC20 (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69)
    +++ description: Contract of the ERC20 standard token used by the ERC20 factory.
```

```diff
+   Status: CREATED
    contract SCRToken (0xd29687c813D741E2F938F4aC377128810E217b1b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A)
    +++ description: Contract used to withdraw ERC20 tokens on L2 and finalize deposit the tokens from L1.
```

```diff
+   Status: CREATED
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProposalTypesConfigurator (0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E)
    +++ description: None
```

Generated with discovered.json: 0xacdf1612ada3e9d9aac0773a9529a80bd2c48069

# Diff at Mon, 14 Jul 2025 12:47:11 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22731106
- current block number: 22731106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22731106 (main branch discovery), not current.

```diff
    contract ZkEvmVerifierPostEuclid (0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3) {
    +++ description: None
      address:
-        "0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3"
+        "eth:0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3"
      values.plonkVerifier:
-        "0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582"
+        "eth:0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582"
      implementationNames.0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3:
-        "ZkEvmVerifierPostEuclid"
      implementationNames.eth:0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3:
+        "ZkEvmVerifierPostEuclid"
    }
```

```diff
    contract PlonkVerifierV1-1 (0x03a72B00D036C479105fF98A1953b15d9c510110) {
    +++ description: None
      address:
-        "0x03a72B00D036C479105fF98A1953b15d9c510110"
+        "eth:0x03a72B00D036C479105fF98A1953b15d9c510110"
      implementationNames.0x03a72B00D036C479105fF98A1953b15d9c510110:
-        ""
      implementationNames.eth:0x03a72B00D036C479105fF98A1953b15d9c510110:
+        ""
    }
```

```diff
    EOA  (0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B) {
    +++ description: None
      address:
-        "0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B"
+        "eth:0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B"
    }
```

```diff
    EOA  (0x0c5cc5155b346453154059aD9d2Ff695dB92f774) {
    +++ description: None
      address:
-        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
+        "eth:0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

```diff
    contract TimelockSCEmergency (0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      address:
-        "0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.Canceller.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.Proposer.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.timelockAdminAC.0:
-        "0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      values.timelockAdminAC.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      implementationNames.0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44:
-        "TimelockController"
      implementationNames.eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44:
+        "TimelockController"
    }
```

```diff
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      address:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "eth:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "eth:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "eth:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.Canceller.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "eth:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.Proposer.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "eth:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.timelockAdminAC.0:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      values.timelockAdminAC.1:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "eth:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      implementationNames.0x0e58939204eEDa84F796FBc86840A50af10eC4F4:
-        "TimelockController"
      implementationNames.eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4:
+        "TimelockController"
    }
```

```diff
    EOA  (0x0f50874f227621Dea72482004639a9fFe440A4dA) {
    +++ description: None
      address:
-        "0x0f50874f227621Dea72482004639a9fFe440A4dA"
+        "eth:0x0f50874f227621Dea72482004639a9fFe440A4dA"
    }
```

```diff
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F) {
    +++ description: None
      address:
-        "0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
+        "eth:0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "eth:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
+        "eth:0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
      values.$members.1:
-        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
+        "eth:0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
      values.$members.2:
-        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
+        "eth:0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
      values.$members.3:
-        "0x6626593C237f530D15aE9980A95ef938Ac15c35c"
+        "eth:0x6626593C237f530D15aE9980A95ef938Ac15c35c"
      values.$members.4:
-        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
+        "eth:0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
      values.$members.5:
-        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
+        "eth:0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
      values.$members.6:
-        "0x9106372987a14400F283bc1AfC122A57130c18a3"
+        "eth:0x9106372987a14400F283bc1AfC122A57130c18a3"
      values.$members.7:
-        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
+        "eth:0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
      values.$members.8:
-        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
+        "eth:0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
      values.$members.9:
-        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
+        "eth:0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
      values.$members.10:
-        "0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
+        "eth:0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
      values.$members.11:
-        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
+        "eth:0x32E8B0B9783d65170fd37f79079d5707107cCc62"
      implementationNames.0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.eth:0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F:
+        "GnosisSafeProxy"
      implementationNames.eth:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      address:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x0f50874f227621Dea72482004639a9fFe440A4dA"
+        "eth:0x0f50874f227621Dea72482004639a9fFe440A4dA"
      values.$members.1:
-        "0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
+        "eth:0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
      values.$members.2:
-        "0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
+        "eth:0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
      values.$members.3:
-        "0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
+        "eth:0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
      values.$members.4:
-        "0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
+        "eth:0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
      values.$members.5:
-        "0x30315233090F675520eef5CBd7A6cf7d185af443"
+        "eth:0x30315233090F675520eef5CBd7A6cf7d185af443"
      values.$members.6:
-        "0x9479ABfebefEea3c846163012a472b44F305b3d7"
+        "eth:0x9479ABfebefEea3c846163012a472b44F305b3d7"
      values.$members.7:
-        "0x383C148ba96956F985F6141B2D119add1C34e3B7"
+        "eth:0x383C148ba96956F985F6141B2D119add1C34e3B7"
      values.$members.8:
-        "0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
+        "eth:0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
      values.$members.9:
-        "0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
+        "eth:0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
      values.$members.10:
-        "0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
+        "eth:0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
      values.$members.11:
-        "0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
+        "eth:0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
      implementationNames.0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      address:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "eth:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.$members.1:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "eth:0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.$members.2:
-        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
+        "eth:0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
      values.$members.3:
-        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
+        "eth:0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
      implementationNames.0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf) {
    +++ description: None
      address:
-        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
+        "eth:0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
    }
```

```diff
    contract PlonkVerifierV1 (0x2293cd12e8564e8219d314b075867c2f66ac6941) {
    +++ description: None
      address:
-        "0x2293cd12e8564e8219d314b075867c2f66ac6941"
+        "eth:0x2293cd12e8564e8219d314b075867c2f66ac6941"
      implementationNames.0x2293cd12e8564e8219d314b075867c2f66ac6941:
-        ""
      implementationNames.eth:0x2293cd12e8564e8219d314b075867c2f66ac6941:
+        ""
    }
```

```diff
    EOA  (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5) {
    +++ description: None
      address:
-        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
+        "eth:0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
    }
```

```diff
    contract ZkEvmVerifierV2 (0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB) {
    +++ description: None
      address:
-        "0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB"
+        "eth:0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB"
      values.plonkVerifier:
-        "0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9"
+        "eth:0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9"
      implementationNames.0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB:
-        "ZkEvmVerifierV2"
      implementationNames.eth:0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB:
+        "ZkEvmVerifierV2"
    }
```

```diff
    EOA  (0x30315233090F675520eef5CBd7A6cf7d185af443) {
    +++ description: None
      address:
-        "0x30315233090F675520eef5CBd7A6cf7d185af443"
+        "eth:0x30315233090F675520eef5CBd7A6cf7d185af443"
    }
```

```diff
    EOA  (0x32E8B0B9783d65170fd37f79079d5707107cCc62) {
    +++ description: None
      address:
-        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
+        "eth:0x32E8B0B9783d65170fd37f79079d5707107cCc62"
    }
```

```diff
    EOA  (0x383C148ba96956F985F6141B2D119add1C34e3B7) {
    +++ description: None
      address:
-        "0x383C148ba96956F985F6141B2D119add1C34e3B7"
+        "eth:0x383C148ba96956F985F6141B2D119add1C34e3B7"
    }
```

```diff
    contract TimelockSCSlow (0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      address:
-        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.Canceller.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.1:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.Proposer.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.timelockAdminAC.0:
-        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      values.timelockAdminAC.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "eth:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      implementationNames.0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd:
-        "TimelockController"
      implementationNames.eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd:
+        "TimelockController"
    }
```

```diff
    EOA  (0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD) {
    +++ description: None
      address:
-        "0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
+        "eth:0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
    }
```

```diff
    contract ZkEvmVerifierV1 (0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247) {
    +++ description: None
      address:
-        "0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247"
+        "eth:0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247"
      values.plonkVerifier:
-        "0x2293cd12e8564e8219d314b075867c2f66ac6941"
+        "eth:0x2293cd12e8564e8219d314b075867c2f66ac6941"
      implementationNames.0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247:
-        "ZkEvmVerifierV1"
      implementationNames.eth:0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247:
+        "ZkEvmVerifierV1"
    }
```

```diff
    contract PlonkVerifierV0 (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    +++ description: None
      address:
-        "0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1"
+        "eth:0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1"
      implementationNames.0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1:
-        ""
      implementationNames.eth:0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1:
+        ""
    }
```

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Contract used to update the verifier and keep track of current and old versions.
      address:
-        "0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F"
+        "eth:0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F"
      values.latestVerifier.0.verifier:
-        "0x585DfaD7bF4099E011D185E266907A8ab60DAD2D"
+        "eth:0x585DfaD7bF4099E011D185E266907A8ab60DAD2D"
      values.latestVerifier.1.verifier:
-        "0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247"
+        "eth:0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247"
      values.latestVerifier.2.verifier:
-        "0x63FB51C55d9605a75F8872C80De260a00fACfaA2"
+        "eth:0x63FB51C55d9605a75F8872C80De260a00fACfaA2"
      values.latestVerifier.3.verifier:
-        "0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB"
+        "eth:0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB"
      values.latestVerifier.4.verifier:
-        "0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3"
+        "eth:0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3"
      values.latestVerifier.5.verifier:
-        "0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3"
+        "eth:0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3"
      values.latestVerifier.6.verifier:
-        "0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba"
+        "eth:0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      implementationNames.0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F:
-        "MultipleVersionRollupVerifier"
      implementationNames.eth:0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F:
+        "MultipleVersionRollupVerifier"
    }
```

```diff
    contract L1MessageQueueV2 (0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a) {
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1ScrollMessenger or the EnforcedTxGateway.
      address:
-        "0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
+        "eth:0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0xEfA158006b072793a49E622B26761cD0eC38591d"
+        "eth:0xEfA158006b072793a49E622B26761cD0eC38591d"
      values.$pastUpgrades.0.2.0:
-        "0xFAf8f72e54d1089fa1882b6f597BfDFF59a8AFca"
+        "eth:0xFAf8f72e54d1089fa1882b6f597BfDFF59a8AFca"
      values.$pastUpgrades.1.2.0:
-        "0xEfA158006b072793a49E622B26761cD0eC38591d"
+        "eth:0xEfA158006b072793a49E622B26761cD0eC38591d"
      values.enforcedTxGateway:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
+        "eth:0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      values.messageQueueV1:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
+        "eth:0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      values.messenger:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.scrollChain:
-        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
+        "eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      values.systemConfig:
-        "0x8432728A257646449245558B8b7Dbe51A16c7a4D"
+        "eth:0x8432728A257646449245558B8b7Dbe51A16c7a4D"
      implementationNames.0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a:
-        "TransparentUpgradeableProxy"
      implementationNames.0xEfA158006b072793a49E622B26761cD0eC38591d:
-        "L1MessageQueueV2"
      implementationNames.eth:0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xEfA158006b072793a49E622B26761cD0eC38591d:
+        "L1MessageQueueV2"
    }
```

```diff
    contract ZkEvmVerifierV0 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    +++ description: None
      address:
-        "0x585DfaD7bF4099E011D185E266907A8ab60DAD2D"
+        "eth:0x585DfaD7bF4099E011D185E266907A8ab60DAD2D"
      values.plonkVerifier:
-        "0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1"
+        "eth:0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1"
      implementationNames.0x585DfaD7bF4099E011D185E266907A8ab60DAD2D:
-        "ZkEvmVerifierV1"
      implementationNames.eth:0x585DfaD7bF4099E011D185E266907A8ab60DAD2D:
+        "ZkEvmVerifierV1"
    }
```

```diff
    EOA cts-Zellic (0x5a09A94eE8198D3c474d723337aa58023810022C) {
    +++ description: None
      address:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "eth:0x5a09A94eE8198D3c474d723337aa58023810022C"
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: Contract used to bridge ERC721 tokens from L1 to L2.
      address:
-        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
+        "eth:0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0xd1841c5756428812233eEA78afC17cb2D3e392bb"
+        "eth:0xd1841c5756428812233eEA78afC17cb2D3e392bb"
      values.$pastUpgrades.0.2.0:
-        "0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"
+        "eth:0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"
      values.$pastUpgrades.1.2.0:
-        "0xd1841c5756428812233eEA78afC17cb2D3e392bb"
+        "eth:0xd1841c5756428812233eEA78afC17cb2D3e392bb"
      values.messenger:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B:
-        "TransparentUpgradeableProxy"
      implementationNames.0xd1841c5756428812233eEA78afC17cb2D3e392bb:
-        "L1ERC721Gateway"
      implementationNames.eth:0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xd1841c5756428812233eEA78afC17cb2D3e392bb:
+        "L1ERC721Gateway"
    }
```

```diff
    contract ZkEvmVerifierV1-1 (0x63FB51C55d9605a75F8872C80De260a00fACfaA2) {
    +++ description: None
      address:
-        "0x63FB51C55d9605a75F8872C80De260a00fACfaA2"
+        "eth:0x63FB51C55d9605a75F8872C80De260a00fACfaA2"
      values.plonkVerifier:
-        "0x03a72B00D036C479105fF98A1953b15d9c510110"
+        "eth:0x03a72B00D036C479105fF98A1953b15d9c510110"
      implementationNames.0x63FB51C55d9605a75F8872C80De260a00fACfaA2:
-        "ZkEvmVerifierV1"
      implementationNames.eth:0x63FB51C55d9605a75F8872C80De260a00fACfaA2:
+        "ZkEvmVerifierV1"
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      address:
-        "0x6625C6332c9F91F2D27c304E729B86db87A3f504"
+        "eth:0x6625C6332c9F91F2D27c304E729B86db87A3f504"
      values.$admin:
-        "0xCC2C53556Bc75217cf698721b29071d6f12628A9"
+        "eth:0xCC2C53556Bc75217cf698721b29071d6f12628A9"
      values.$implementation:
-        "0xF4f2066EE72D62e3caF9678459149BA7FCf2262F"
+        "eth:0xF4f2066EE72D62e3caF9678459149BA7FCf2262F"
      values.$pastUpgrades.0.2.0:
-        "0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
+        "eth:0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
      values.$pastUpgrades.1.2.0:
-        "0xF4f2066EE72D62e3caF9678459149BA7FCf2262F"
+        "eth:0xF4f2066EE72D62e3caF9678459149BA7FCf2262F"
      values.messenger:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.owner:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.router:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      implementationNames.0x6625C6332c9F91F2D27c304E729B86db87A3f504:
-        "TransparentUpgradeableProxy"
      implementationNames.0xF4f2066EE72D62e3caF9678459149BA7FCf2262F:
-        "L1LidoGateway"
      implementationNames.eth:0x6625C6332c9F91F2D27c304E729B86db87A3f504:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xF4f2066EE72D62e3caF9678459149BA7FCf2262F:
+        "L1LidoGateway"
    }
```

```diff
    EOA  (0x6626593C237f530D15aE9980A95ef938Ac15c35c) {
    +++ description: None
      address:
-        "0x6626593C237f530D15aE9980A95ef938Ac15c35c"
+        "eth:0x6626593C237f530D15aE9980A95ef938Ac15c35c"
    }
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      address:
-        "0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
+        "eth:0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
+        "eth:0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
      values.$pastUpgrades.0.2.0:
-        "0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
+        "eth:0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
      values.messenger:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.router:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      implementationNames.0x67260A8B73C5B77B55c1805218A42A7A6F98F515:
-        "TransparentUpgradeableProxy"
      implementationNames.0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb:
-        "L1CustomERC20Gateway"
      implementationNames.eth:0x67260A8B73C5B77B55c1805218A42A7A6F98F515:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb:
+        "L1CustomERC20Gateway"
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      address:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0x84791281EF5cb8Af5dCd4c122f7A42FeD38Fef5b"
+        "eth:0x84791281EF5cb8Af5dCd4c122f7A42FeD38Fef5b"
      values.$pastUpgrades.0.2.0:
-        "0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"
+        "eth:0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"
      values.$pastUpgrades.1.2.0:
-        "0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"
+        "eth:0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"
      values.$pastUpgrades.2.2.0:
-        "0xc6326109E33465d6d61e4Cb7AFCe7B1bE7cfF868"
+        "eth:0xc6326109E33465d6d61e4Cb7AFCe7B1bE7cfF868"
      values.$pastUpgrades.3.2.0:
-        "0x84791281EF5cb8Af5dCd4c122f7A42FeD38Fef5b"
+        "eth:0x84791281EF5cb8Af5dCd4c122f7A42FeD38Fef5b"
      values.enforcedTxGateway:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
+        "eth:0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      values.feeVault:
-        "0x8FA3b4570B4C96f8036C13b64971BA65867eEB48"
+        "eth:0x8FA3b4570B4C96f8036C13b64971BA65867eEB48"
      values.messageQueueV1:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
+        "eth:0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      values.messageQueueV2:
-        "0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
+        "eth:0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.rollup:
-        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
+        "eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      implementationNames.0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367:
-        "TransparentUpgradeableProxy"
      implementationNames.0x84791281EF5cb8Af5dCd4c122f7A42FeD38Fef5b:
-        "L1ScrollMessenger"
      implementationNames.eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x84791281EF5cb8Af5dCd4c122f7A42FeD38Fef5b:
+        "L1ScrollMessenger"
    }
```

```diff
    EOA  (0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3) {
    +++ description: None
      address:
-        "0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
+        "eth:0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
    }
```

```diff
    contract Safe (0x69C2eD64171bF5737c2B78bdF722e68a032B2825) {
    +++ description: None
      address:
-        "0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
+        "eth:0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xc8B6bF89877337188Ea84eA93547687225389553"
+        "eth:0xc8B6bF89877337188Ea84eA93547687225389553"
      values.$members.1:
-        "0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
+        "eth:0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
      values.$members.2:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "eth:0x5a09A94eE8198D3c474d723337aa58023810022C"
      implementationNames.0x69C2eD64171bF5737c2B78bdF722e68a032B2825:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x69C2eD64171bF5737c2B78bdF722e68a032B2825:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed) {
    +++ description: None
      address:
-        "0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
+        "eth:0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
    }
```

```diff
    EOA  (0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c) {
    +++ description: None
      address:
-        "0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c"
+        "eth:0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c"
    }
```

```diff
    EOA  (0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d) {
    +++ description: None
      address:
-        "0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
+        "eth:0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender.
      address:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
+        "eth:0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0x7e87c75BBe7991bbCEBd2C7a56f4cFC923BDDBcc"
+        "eth:0x7e87c75BBe7991bbCEBd2C7a56f4cFC923BDDBcc"
      values.$pastUpgrades.0.2.0:
-        "0x642af405bF64660665B37977449C9C536B806318"
+        "eth:0x642af405bF64660665B37977449C9C536B806318"
      values.$pastUpgrades.1.2.0:
-        "0x7e87c75BBe7991bbCEBd2C7a56f4cFC923BDDBcc"
+        "eth:0x7e87c75BBe7991bbCEBd2C7a56f4cFC923BDDBcc"
      values.eip712Domain.verifyingContract:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
+        "eth:0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      values.feeVault:
-        "0x8FA3b4570B4C96f8036C13b64971BA65867eEB48"
+        "eth:0x8FA3b4570B4C96f8036C13b64971BA65867eEB48"
      values.messageQueue:
-        "0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
+        "eth:0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      implementationNames.0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7e87c75BBe7991bbCEBd2C7a56f4cFC923BDDBcc:
-        "EnforcedTxGateway"
      implementationNames.eth:0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x7e87c75BBe7991bbCEBd2C7a56f4cFC923BDDBcc:
+        "EnforcedTxGateway"
    }
```

```diff
    EOA  (0x74b286304576625557629C47E9E8702383D9eF92) {
    +++ description: None
      address:
-        "0x74b286304576625557629C47E9E8702383D9eF92"
+        "eth:0x74b286304576625557629C47E9E8702383D9eF92"
    }
```

```diff
    EOA  (0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d) {
    +++ description: None
      address:
-        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
+        "eth:0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      address:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.accessControl.roles.DEFAULT_ADMIN_ROLE.members.0:
-        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      values.accessControl.roles.SECURITY_COUNCIL_NO_DELAY_ROLE.members.0:
-        "0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      values.accessControl.roles.emergency-nodelay.members.0:
-        "0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      values.accessControl.roles.ops-fast.members.0:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      values.accessControl.targets.0xEB803eb3F501998126bf37bB823646Ed3D59d072:
-        {"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F:
-        {"updateVerifier(uint256,uint64,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556:
-        {"removeSequencer(address)":["emergency-nodelay"],"removeProver(address)":["emergency-nodelay"],"setPause(bool)":["emergency-nodelay"],"addSequencer(address)":["ops-fast"],"addProver(address)":["ops-fast"],"updateMaxNumTxInChunk(uint256)":["ops-fast"],"revertBatch(bytes)":["emergency-nodelay"],"disableEnforcedBatchMode()":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37:
-        {"updateWhitelistStatus(address[],bool)":["emergency-nodelay"]}
      values.accessControl.targets.0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367:
-        {"setPause(bool)":["emergency-nodelay"],"updateFeeVault(address)":["ops-fast"],"updateMaxReplayTimes(uint256)":["ops-fast"]}
      values.accessControl.targets.0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B:
-        {"pauseDeposit(bool)":["emergency-nodelay"],"pauseWithdraw(bool)":["emergency-nodelay"],"updateCircleCaller(address)":["ops-fast"]}
      values.accessControl.targets.0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B:
-        {"updateMaxGasLimit(uint256)":["ops-fast"]}
      values.accessControl.targets.0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6:
-        {"setERC20Gateway(address[],address[])":["ops-fast"]}
      values.accessControl.targets.0xb2b10a289A229415a124EFDeF310C10cb004B6ff:
-        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B:
-        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6:
-        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4:
-        {"setBatchConfig(address,(uint96,uint96,uint16,uint24,uint24))":["ops-fast"],"grantRole(bytes32,address)":["ops-fast"],"revokeRole(bytes32,address)":["ops-fast"]}
      values.accessControl.targets.0x8432728A257646449245558B8b7Dbe51A16c7a4D:
-        {"updateMessageQueueParameters((uint32,uint112,uint112))":["ops-fast"],"updateEnforcedBatchParameters((uint24,uint24))":["ops-fast"],"updateSigner(address)":["emergency-nodelay"]}
      values.accessControl.targets.0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d:
-        {"setPause(bool)":["emergency-nodelay"]}
      values.accessControl.targets.eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072:
+        {"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.eth:0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F:
+        {"updateVerifier(uint256,uint64,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556:
+        {"removeSequencer(address)":["emergency-nodelay"],"removeProver(address)":["emergency-nodelay"],"setPause(bool)":["emergency-nodelay"],"addSequencer(address)":["ops-fast"],"addProver(address)":["ops-fast"],"updateMaxNumTxInChunk(uint256)":["ops-fast"],"revertBatch(bytes)":["emergency-nodelay"],"disableEnforcedBatchMode()":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.eth:0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37:
+        {"updateWhitelistStatus(address[],bool)":["emergency-nodelay"]}
      values.accessControl.targets.eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367:
+        {"setPause(bool)":["emergency-nodelay"],"updateFeeVault(address)":["ops-fast"],"updateMaxReplayTimes(uint256)":["ops-fast"]}
      values.accessControl.targets.eth:0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B:
+        {"pauseDeposit(bool)":["emergency-nodelay"],"pauseWithdraw(bool)":["emergency-nodelay"],"updateCircleCaller(address)":["ops-fast"]}
      values.accessControl.targets.eth:0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B:
+        {"updateMaxGasLimit(uint256)":["ops-fast"]}
      values.accessControl.targets.eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6:
+        {"setERC20Gateway(address[],address[])":["ops-fast"]}
      values.accessControl.targets.eth:0xb2b10a289A229415a124EFDeF310C10cb004B6ff:
+        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.eth:0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B:
+        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.eth:0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6:
+        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.eth:0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4:
+        {"setBatchConfig(address,(uint96,uint96,uint16,uint24,uint24))":["ops-fast"],"grantRole(bytes32,address)":["ops-fast"],"revokeRole(bytes32,address)":["ops-fast"]}
      values.accessControl.targets.eth:0x8432728A257646449245558B8b7Dbe51A16c7a4D:
+        {"updateMessageQueueParameters((uint32,uint112,uint112))":["ops-fast"],"updateEnforcedBatchParameters((uint24,uint24))":["ops-fast"],"updateSigner(address)":["emergency-nodelay"]}
      values.accessControl.targets.eth:0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d:
+        {"setPause(bool)":["emergency-nodelay"]}
      values.opsFast.0:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      values.opsNoDelay.0:
-        "0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      values.scNoDelay.0:
-        "0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      implementationNames.0x798576400F7D662961BA15C6b3F3d813447a26a6:
-        "ScrollOwner"
      implementationNames.eth:0x798576400F7D662961BA15C6b3F3d813447a26a6:
+        "ScrollOwner"
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: Contract used to bridge WETH from L1 to L2.
      address:
-        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
+        "eth:0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"
+        "eth:0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"
      values.$pastUpgrades.0.2.0:
-        "0xd3c42158682D55E082EaBe08a29F7515A97cA307"
+        "eth:0xd3c42158682D55E082EaBe08a29F7515A97cA307"
      values.$pastUpgrades.1.2.0:
-        "0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"
+        "eth:0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"
      values.messenger:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.router:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      implementationNames.0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE:
-        "TransparentUpgradeableProxy"
      implementationNames.0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49:
-        "L1WETHGateway"
      implementationNames.eth:0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49:
+        "L1WETHGateway"
    }
```

```diff
    contract PlonkVerifierPostEuclid-2 (0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6) {
    +++ description: None
      address:
-        "0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6"
+        "eth:0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6"
      implementationNames.0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6:
-        ""
      implementationNames.eth:0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6:
+        ""
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      address:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
+        "eth:0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0x546E0bF31FB6e7babD493452e4e6999191367B42"
+        "eth:0x546E0bF31FB6e7babD493452e4e6999191367B42"
      values.$pastUpgrades.0.2.0:
-        "0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"
+        "eth:0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"
      values.$pastUpgrades.1.2.0:
-        "0x546E0bF31FB6e7babD493452e4e6999191367B42"
+        "eth:0x546E0bF31FB6e7babD493452e4e6999191367B42"
      values.messenger:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.router:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      implementationNames.0x7F2b8C31F88B6006c382775eea88297Ec1e3E905:
-        "TransparentUpgradeableProxy"
      implementationNames.0x546E0bF31FB6e7babD493452e4e6999191367B42:
-        "L1ETHGateway"
      implementationNames.eth:0x7F2b8C31F88B6006c382775eea88297Ec1e3E905:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x546E0bF31FB6e7babD493452e4e6999191367B42:
+        "L1ETHGateway"
    }
```

```diff
    contract TimelockEmergency (0x826714adD4dDA2b8750794A467C892c0Cd49216b) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      address:
-        "0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "eth:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "eth:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "eth:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.Canceller.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "eth:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.Proposer.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "eth:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.timelockAdminAC.0:
-        "0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      values.timelockAdminAC.1:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "eth:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      implementationNames.0x826714adD4dDA2b8750794A467C892c0Cd49216b:
-        "TimelockController"
      implementationNames.eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b:
+        "TimelockController"
    }
```

```diff
    contract SystemConfig (0x8432728A257646449245558B8b7Dbe51A16c7a4D) {
    +++ description: System configuration contract for Scroll, contains enforcedBatchParameters and messageQueueParameters determining permissionless mode.
      address:
-        "0x8432728A257646449245558B8b7Dbe51A16c7a4D"
+        "eth:0x8432728A257646449245558B8b7Dbe51A16c7a4D"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0x6A124779fDf107c3F6BcB992731dCAaD09f2276A"
+        "eth:0x6A124779fDf107c3F6BcB992731dCAaD09f2276A"
      values.$pastUpgrades.0.2.0:
-        "0xFAf8f72e54d1089fa1882b6f597BfDFF59a8AFca"
+        "eth:0xFAf8f72e54d1089fa1882b6f597BfDFF59a8AFca"
      values.$pastUpgrades.1.2.0:
-        "0x6A124779fDf107c3F6BcB992731dCAaD09f2276A"
+        "eth:0x6A124779fDf107c3F6BcB992731dCAaD09f2276A"
      values.getSigner:
-        "0xD83C4892BB5aA241B63d8C4C134920111E142A20"
+        "eth:0xD83C4892BB5aA241B63d8C4C134920111E142A20"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      implementationNames.0x8432728A257646449245558B8b7Dbe51A16c7a4D:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6A124779fDf107c3F6BcB992731dCAaD09f2276A:
-        "SystemConfig"
      implementationNames.eth:0x8432728A257646449245558B8b7Dbe51A16c7a4D:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6A124779fDf107c3F6BcB992731dCAaD09f2276A:
+        "SystemConfig"
    }
```

```diff
    EOA  (0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae) {
    +++ description: None
      address:
-        "0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
+        "eth:0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
    }
```

```diff
    contract PlonkVerifierV2 (0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9) {
    +++ description: None
      address:
-        "0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9"
+        "eth:0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9"
      implementationNames.0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9:
-        ""
      implementationNames.eth:0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9:
+        ""
    }
```

```diff
    EOA  (0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424) {
    +++ description: None
      address:
-        "0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
+        "eth:0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
    }
```

```diff
    contract PlonkVerifierV2-1 (0x8c1b52757b5c571ADcB5572E992679d4D48e30f7) {
    +++ description: None
      address:
-        "0x8c1b52757b5c571ADcB5572E992679d4D48e30f7"
+        "eth:0x8c1b52757b5c571ADcB5572E992679d4D48e30f7"
      implementationNames.0x8c1b52757b5c571ADcB5572E992679d4D48e30f7:
-        ""
      implementationNames.eth:0x8c1b52757b5c571ADcB5572E992679d4D48e30f7:
+        ""
    }
```

```diff
    contract Safe (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC) {
    +++ description: None
      address:
-        "0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
+        "eth:0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
+        "eth:0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
      values.$members.1:
-        "0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
+        "eth:0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
      values.$members.2:
-        "0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
+        "eth:0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
      implementationNames.0x8edC4EADEE120d4C51923c515e7C3241c815C2BC:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x8edC4EADEE120d4C51923c515e7C3241c815C2BC:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract Scroll Multisig 4 (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      address:
-        "0x8FA3b4570B4C96f8036C13b64971BA65867eEB48"
+        "eth:0x8FA3b4570B4C96f8036C13b64971BA65867eEB48"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
+        "eth:0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
      values.$members.1:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "eth:0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.$members.2:
-        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
+        "eth:0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
      values.$members.3:
-        "0xfc31892C5500AbE00974280b28907BaA9190E384"
+        "eth:0xfc31892C5500AbE00974280b28907BaA9190E384"
      implementationNames.0x8FA3b4570B4C96f8036C13b64971BA65867eEB48:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x8FA3b4570B4C96f8036C13b64971BA65867eEB48:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x9106372987a14400F283bc1AfC122A57130c18a3) {
    +++ description: None
      address:
-        "0x9106372987a14400F283bc1AfC122A57130c18a3"
+        "eth:0x9106372987a14400F283bc1AfC122A57130c18a3"
    }
```

```diff
    EOA  (0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0) {
    +++ description: None
      address:
-        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
+        "eth:0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
    }
```

```diff
    EOA  (0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a) {
    +++ description: None
      address:
-        "0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
+        "eth:0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
    }
```

```diff
    contract Safe (0x9479ABfebefEea3c846163012a472b44F305b3d7) {
    +++ description: None
      address:
-        "0x9479ABfebefEea3c846163012a472b44F305b3d7"
+        "eth:0x9479ABfebefEea3c846163012a472b44F305b3d7"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
+        "eth:0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
      values.$members.1:
-        "0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
+        "eth:0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
      implementationNames.0x9479ABfebefEea3c846163012a472b44F305b3d7:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x9479ABfebefEea3c846163012a472b44F305b3d7:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4) {
    +++ description: None
      address:
-        "0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
+        "eth:0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
    }
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings.
      address:
-        "0xA033Ff09f2da45f0e9ae495f525363722Df42b2a"
+        "eth:0xA033Ff09f2da45f0e9ae495f525363722Df42b2a"
      values.$admin:
-        "0x9eBf2f33526CD571f8b2ad312492cb650870CFd6"
+        "eth:0x9eBf2f33526CD571f8b2ad312492cb650870CFd6"
      values.$implementation:
-        "0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"
+        "eth:0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"
      values.$pastUpgrades.0.2.0:
-        "0xc4d46E8402F476F269c379677C99F18E22Ea030e"
+        "eth:0xc4d46E8402F476F269c379677C99F18E22Ea030e"
      values.$pastUpgrades.1.2.0:
-        "0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"
+        "eth:0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"
      values.$pastUpgrades.2.2.0:
-        "0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"
+        "eth:0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"
      values.messenger:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.owner:
-        "0x9eBf2f33526CD571f8b2ad312492cb650870CFd6"
+        "eth:0x9eBf2f33526CD571f8b2ad312492cb650870CFd6"
      values.router:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      implementationNames.0xA033Ff09f2da45f0e9ae495f525363722Df42b2a:
-        "TransparentUpgradeableProxy"
      implementationNames.0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03:
-        "L1CustomERC20Gateway"
      implementationNames.eth:0xA033Ff09f2da45f0e9ae495f525363722Df42b2a:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03:
+        "L1CustomERC20Gateway"
    }
```

```diff
    EOA  (0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1) {
    +++ description: None
      address:
-        "0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
+        "eth:0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: The main contract of the Scroll chain. Allows to post transaction data and state roots, along with proofs. Sequencing and proposing are behind a whitelist unless enforcedBatchMode is activated.
      address:
-        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
+        "eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0xb7c8833F5627a8a12558cAFa0d0EBD1ACBDce43f"
+        "eth:0xb7c8833F5627a8a12558cAFa0d0EBD1ACBDce43f"
      values.$pastUpgrades.0.2.0:
-        "0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"
+        "eth:0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"
      values.$pastUpgrades.1.2.0:
-        "0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
+        "eth:0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
      values.$pastUpgrades.2.2.0:
-        "0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"
+        "eth:0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"
      values.$pastUpgrades.3.2.0:
-        "0x4F250B05262240C787a1eE222687C6eC395C628A"
+        "eth:0x4F250B05262240C787a1eE222687C6eC395C628A"
      values.$pastUpgrades.4.2.0:
-        "0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"
+        "eth:0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"
      values.$pastUpgrades.5.2.0:
-        "0x8f339292d2b3909574B2bEB051a613a987dB538f"
+        "eth:0x8f339292d2b3909574B2bEB051a613a987dB538f"
      values.$pastUpgrades.6.2.0:
-        "0xb7c8833F5627a8a12558cAFa0d0EBD1ACBDce43f"
+        "eth:0xb7c8833F5627a8a12558cAFa0d0EBD1ACBDce43f"
      values.messageQueueV1:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
+        "eth:0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      values.messageQueueV2:
-        "0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
+        "eth:0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.provers.0:
-        "0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c"
+        "eth:0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c"
      values.provers.1:
-        "0x74b286304576625557629C47E9E8702383D9eF92"
+        "eth:0x74b286304576625557629C47E9E8702383D9eF92"
      values.sequencers.0:
-        "0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B"
+        "eth:0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B"
      values.sequencers.1:
-        "0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"
+        "eth:0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"
      values.systemConfig:
-        "0x8432728A257646449245558B8b7Dbe51A16c7a4D"
+        "eth:0x8432728A257646449245558B8b7Dbe51A16c7a4D"
      values.verifier:
-        "0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F"
+        "eth:0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F"
      implementationNames.0xa13BAF47339d63B743e7Da8741db5456DAc1E556:
-        "TransparentUpgradeableProxy"
      implementationNames.0xb7c8833F5627a8a12558cAFa0d0EBD1ACBDce43f:
-        "ScrollChain"
      implementationNames.eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xb7c8833F5627a8a12558cAFa0d0EBD1ACBDce43f:
+        "ScrollChain"
    }
```

```diff
    EOA  (0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD) {
    +++ description: None
      address:
-        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
+        "eth:0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
    }
```

```diff
    EOA  (0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32) {
    +++ description: None
      address:
-        "0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
+        "eth:0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
    }
```

```diff
    EOA  (0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7) {
    +++ description: None
      address:
-        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
+        "eth:0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings.
      address:
-        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
+        "eth:0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"
+        "eth:0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"
      values.$pastUpgrades.0.2.0:
-        "0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
+        "eth:0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
      values.$pastUpgrades.1.2.0:
-        "0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"
+        "eth:0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"
      values.messenger:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.router:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      implementationNames.0xb2b10a289A229415a124EFDeF310C10cb004B6ff:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c:
-        "L1CustomERC20Gateway"
      implementationNames.eth:0xb2b10a289A229415a124EFDeF310C10cb004B6ff:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c:
+        "L1CustomERC20Gateway"
    }
```

```diff
    EOA  (0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d) {
    +++ description: None
      address:
-        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
+        "eth:0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: Contract used to bridge ERC1155 tokens from L1 to L2.
      address:
-        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
+        "eth:0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0x244BF7aEf29F03916569470a51fA0794B62F8cd7"
+        "eth:0x244BF7aEf29F03916569470a51fA0794B62F8cd7"
      values.$pastUpgrades.0.2.0:
-        "0xCb4638620E4C6DeCef26374e71b0dd4871863593"
+        "eth:0xCb4638620E4C6DeCef26374e71b0dd4871863593"
      values.$pastUpgrades.1.2.0:
-        "0x244BF7aEf29F03916569470a51fA0794B62F8cd7"
+        "eth:0x244BF7aEf29F03916569470a51fA0794B62F8cd7"
      values.messenger:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6:
-        "TransparentUpgradeableProxy"
      implementationNames.0x244BF7aEf29F03916569470a51fA0794B62F8cd7:
-        "L1ERC1155Gateway"
      implementationNames.eth:0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x244BF7aEf29F03916569470a51fA0794B62F8cd7:
+        "L1ERC1155Gateway"
    }
```

```diff
    contract ZkEvmVerifierPostEuclid-2 (0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba) {
    +++ description: None
      address:
-        "0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba"
+        "eth:0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba"
      values.plonkVerifier:
-        "0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6"
+        "eth:0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6"
      implementationNames.0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba:
-        "ZkEvmVerifierPostEuclid"
      implementationNames.eth:0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba:
+        "ZkEvmVerifierPostEuclid"
    }
```

```diff
    EOA  (0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3) {
    +++ description: None
      address:
-        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
+        "eth:0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      address:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "eth:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
+        "eth:0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
      values.$members.1:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "eth:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.$members.2:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "eth:0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.$members.3:
-        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
+        "eth:0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
      implementationNames.0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xc1985e3712b33a5303e097e9CeD22E91338ba64d) {
    +++ description: None
      address:
-        "0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
+        "eth:0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
    }
```

```diff
    contract Safe (0xC3eA7C657884BB380B66D79C36aDCb5658b01896) {
    +++ description: None
      address:
-        "0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
+        "eth:0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
+        "eth:0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
      implementationNames.0xC3eA7C657884BB380B66D79C36aDCb5658b01896:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xC3eA7C657884BB380B66D79C36aDCb5658b01896:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0xc8B6bF89877337188Ea84eA93547687225389553) {
    +++ description: None
      address:
-        "0xc8B6bF89877337188Ea84eA93547687225389553"
+        "eth:0xc8B6bF89877337188Ea84eA93547687225389553"
    }
```

```diff
    contract ZkEvmVerifierV2-1 (0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3) {
    +++ description: None
      address:
-        "0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3"
+        "eth:0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3"
      values.plonkVerifier:
-        "0x8c1b52757b5c571ADcB5572E992679d4D48e30f7"
+        "eth:0x8c1b52757b5c571ADcB5572E992679d4D48e30f7"
      implementationNames.0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3:
-        "ZkEvmVerifierV2"
      implementationNames.eth:0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3:
+        "ZkEvmVerifierV2"
    }
```

```diff
    contract PlonkVerifierPostEuclid (0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582) {
    +++ description: None
      address:
-        "0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582"
+        "eth:0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582"
      implementationNames.0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582:
-        ""
      implementationNames.eth:0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582:
+        ""
    }
```

```diff
    EOA  (0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f) {
    +++ description: None
      address:
-        "0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
+        "eth:0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
    }
```

```diff
    EOA  (0xD83C4892BB5aA241B63d8C4C134920111E142A20) {
    +++ description: None
      address:
-        "0xD83C4892BB5aA241B63d8C4C134920111E142A20"
+        "eth:0xD83C4892BB5aA241B63d8C4C134920111E142A20"
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      address:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
+        "eth:0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"
+        "eth:0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"
      values.$pastUpgrades.0.2.0:
-        "0x9218732389D80f9b8723C3f32a38865B7a63564A"
+        "eth:0x9218732389D80f9b8723C3f32a38865B7a63564A"
      values.$pastUpgrades.1.2.0:
-        "0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"
+        "eth:0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"
      values.messenger:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.router:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      implementationNames.0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9:
-        "TransparentUpgradeableProxy"
      implementationNames.0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c:
-        "L1StandardERC20Gateway"
      implementationNames.eth:0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c:
+        "L1StandardERC20Gateway"
    }
```

```diff
    EOA  (0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC) {
    +++ description: None
      address:
-        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
+        "eth:0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
    }
```

```diff
    EOA  (0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a) {
    +++ description: None
      address:
-        "0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
+        "eth:0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
    }
```

```diff
    EOA  (0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858) {
    +++ description: None
      address:
-        "0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"
+        "eth:0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"
    }
```

```diff
    EOA  (0xe515cD19E8a67BF367a1d20dA6f21035913a2897) {
    +++ description: None
      address:
-        "0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
+        "eth:0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      address:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      implementationNames.0xEB803eb3F501998126bf37bB823646Ed3D59d072:
-        "ProxyAdmin"
      implementationNames.eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xEbbeeAA424AE904508465a41c927Be594C43Dc68) {
    +++ description: None
      address:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "eth:0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
    }
```

```diff
    EOA  (0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B) {
    +++ description: None
      address:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "eth:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      address:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "eth:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "eth:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.$members.1:
-        "0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
+        "eth:0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
      values.$members.2:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "eth:0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
      values.$members.3:
-        "0xfc31892C5500AbE00974280b28907BaA9190E384"
+        "eth:0xfc31892C5500AbE00974280b28907BaA9190E384"
      values.$members.4:
-        "0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
+        "eth:0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
      implementationNames.0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: Contract used to bridge USDC tokens from L1 to L2.
      address:
-        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
+        "eth:0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"
+        "eth:0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"
      values.$pastUpgrades.0.2.0:
-        "0x6667123b5017AAB9945F73345848B82D7A953AA8"
+        "eth:0x6667123b5017AAB9945F73345848B82D7A953AA8"
      values.$pastUpgrades.1.2.0:
-        "0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"
+        "eth:0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"
      values.circleCaller:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.messenger:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.router:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      implementationNames.0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B:
-        "TransparentUpgradeableProxy"
      implementationNames.0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e:
-        "L1USDCGateway"
      implementationNames.eth:0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e:
+        "L1USDCGateway"
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      address:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      values.$admin:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      values.$implementation:
-        "0xb93Ac04010Bd61F45BF492022A5b49a902F798F3"
+        "eth:0xb93Ac04010Bd61F45BF492022A5b49a902F798F3"
      values.$pastUpgrades.0.2.0:
-        "0xb93Ac04010Bd61F45BF492022A5b49a902F798F3"
+        "eth:0xb93Ac04010Bd61F45BF492022A5b49a902F798F3"
      values.defaultERC20Gateway:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
+        "eth:0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      values.ethGateway:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
+        "eth:0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      values.gatewayInContext:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      implementationNames.0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6:
-        "TransparentUpgradeableProxy"
      implementationNames.0xb93Ac04010Bd61F45BF492022A5b49a902F798F3:
-        "L1GatewayRouter"
      implementationNames.eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xb93Ac04010Bd61F45BF492022A5b49a902F798F3:
+        "L1GatewayRouter"
    }
```

```diff
    EOA  (0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf) {
    +++ description: None
      address:
-        "0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
+        "eth:0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
    }
```

```diff
    EOA  (0xfc31892C5500AbE00974280b28907BaA9190E384) {
    +++ description: None
      address:
-        "0xfc31892C5500AbE00974280b28907BaA9190E384"
+        "eth:0xfc31892C5500AbE00974280b28907BaA9190E384"
    }
```

```diff
    EOA  (0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402) {
    +++ description: None
      address:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "eth:0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
    }
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierPostEuclid (0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifierV1-1 (0x03a72B00D036C479105fF98A1953b15d9c510110)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockSCEmergency (0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44)
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4)
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifierV1 (0x2293cd12e8564e8219d314b075867c2f66ac6941)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV2 (0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockSCSlow (0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd)
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifierV0 (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F)
    +++ description: Contract used to update the verifier and keep track of current and old versions.
```

```diff
+   Status: CREATED
    contract L1MessageQueueV2 (0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a)
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1ScrollMessenger or the EnforcedTxGateway.
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV0 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B)
    +++ description: Contract used to bridge ERC721 tokens from L1 to L2.
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1-1 (0x63FB51C55d9605a75F8872C80De260a00fACfaA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367)
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
```

```diff
+   Status: CREATED
    contract Safe (0x69C2eD64171bF5737c2B78bdF722e68a032B2825)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d)
    +++ description: Contracts to force L1 -> L2 messages with the proper sender.
```

```diff
+   Status: CREATED
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6)
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
```

```diff
+   Status: CREATED
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE)
    +++ description: Contract used to bridge WETH from L1 to L2.
```

```diff
+   Status: CREATED
    contract PlonkVerifierPostEuclid-2 (0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905)
    +++ description: Contract used to bridge ETH from L1 to L2.
```

```diff
+   Status: CREATED
    contract TimelockEmergency (0x826714adD4dDA2b8750794A467C892c0Cd49216b)
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x8432728A257646449245558B8b7Dbe51A16c7a4D)
    +++ description: System configuration contract for Scroll, contains enforcedBatchParameters and messageQueueParameters determining permissionless mode.
```

```diff
+   Status: CREATED
    contract PlonkVerifierV2 (0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifierV2-1 (0x8c1b52757b5c571ADcB5572E992679d4D48e30f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Scroll Multisig 4 (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x9479ABfebefEea3c846163012a472b44F305b3d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a)
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings.
```

```diff
+   Status: CREATED
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556)
    +++ description: The main contract of the Scroll chain. Allows to post transaction data and state roots, along with proofs. Sequencing and proposing are behind a whitelist unless enforcedBatchMode is activated.
```

```diff
+   Status: CREATED
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff)
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings.
```

```diff
+   Status: CREATED
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6)
    +++ description: Contract used to bridge ERC1155 tokens from L1 to L2.
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierPostEuclid-2 (0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0xC3eA7C657884BB380B66D79C36aDCb5658b01896)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV2-1 (0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifierPostEuclid (0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9)
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B)
    +++ description: Contract used to bridge USDC tokens from L1 to L2.
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6)
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
```

Generated with discovered.json: 0xe99e662f1a9426135c00d8b359caa3a8a6d59191

# Diff at Mon, 07 Jul 2025 08:22:57 GMT:

- chain: scroll
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1a6f89d35120c5c65bf077ab92a9ca72da48080d block: 16562505
- current block number: 17024223

## Description

single MS member change.

## Watched changes

```diff
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351) {
    +++ description: None
      values.$members.2:
-        "0x108493124adf60F401E051e6A05043d8967bff6f"
+        "0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B"
    }
```

Generated with discovered.json: 0xf4f826135f93fbbd6f3b7d64313f8d14d841edce

# Diff at Fri, 04 Jul 2025 12:19:18 GMT:

- chain: scroll
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 16562505
- current block number: 16562505

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16562505 (main branch discovery), not current.

```diff
    EOA  (0x0c5cc5155b346453154059aD9d2Ff695dB92f774) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.1.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      directlyReceivedPermissions.0.from:
-        "scroll:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
+        "scr:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
      directlyReceivedPermissions.1.from:
-        "scroll:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      directlyReceivedPermissions.2.from:
-        "scroll:0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
+        "scr:0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.0.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      receivedPermissions.1.via.0.address:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.1.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      receivedPermissions.2.via.0.address:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.2.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      receivedPermissions.3.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.4.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.5.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.6.via.0.address:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.6.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.7.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.8.via.0.address:
-        "scroll:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      receivedPermissions.8.from:
-        "scroll:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
      directlyReceivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      directlyReceivedPermissions.1.from:
-        "scroll:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
    }
```

```diff
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      directlyReceivedPermissions.1.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      directlyReceivedPermissions.2.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      directlyReceivedPermissions.3.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
    }
```

```diff
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      directlyReceivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      directlyReceivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    EOA  (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.1.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
    }
```

```diff
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351) {
    +++ description: None
      receivedPermissions.0.from:
-        "scroll:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
    }
```

```diff
    contract TimelockSCSlow (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "scroll:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      directlyReceivedPermissions.1.from:
-        "scroll:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
    }
```

```diff
    contract ProxyAdmin (0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "scroll:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
    }
```

```diff
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "scroll:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
+        "scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
      directlyReceivedPermissions.1.from:
-        "scroll:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
+        "scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
      directlyReceivedPermissions.2.from:
-        "scroll:0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
+        "scr:0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
      directlyReceivedPermissions.3.from:
-        "scroll:0x64CCBE37c9A82D85A1F2E74649b7A42923067988"
+        "scr:0x64CCBE37c9A82D85A1F2E74649b7A42923067988"
      directlyReceivedPermissions.4.from:
-        "scroll:0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
+        "scr:0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
      directlyReceivedPermissions.5.from:
-        "scroll:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      directlyReceivedPermissions.6.from:
-        "scroll:0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"
+        "scr:0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"
      directlyReceivedPermissions.7.from:
-        "scroll:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "scr:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
    }
```

```diff
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      receivedPermissions.0.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      receivedPermissions.1.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      receivedPermissions.2.via.0.address:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      receivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      receivedPermissions.3.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      directlyReceivedPermissions.0.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    contract ProxyAdmin (0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "scroll:0xd29687c813D741E2F938F4aC377128810E217b1b"
+        "scr:0xd29687c813D741E2F938F4aC377128810E217b1b"
    }
```

```diff
    EOA  (0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.1.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      receivedPermissions.0.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.via.0.address:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.3.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      directlyReceivedPermissions.0.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
    }
```

```diff
    EOA  (0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.1.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

Generated with discovered.json: 0xfc00e9a63ac6cc27febb73b249d9ff1ad04e2951

# Diff at Fri, 04 Jul 2025 12:19:18 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22731106
- current block number: 22731106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22731106 (main branch discovery), not current.

```diff
    EOA  (0x0c5cc5155b346453154059aD9d2Ff695dB92f774) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.3.from:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
    }
```

```diff
    contract TimelockSCEmergency (0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.1.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.2.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.3.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.4.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.5.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.6.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.7.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.8.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.9.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.10.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.11.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.12.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
    }
```

```diff
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
    }
```

```diff
    EOA  (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.3.from:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
    }
```

```diff
    contract TimelockSCSlow (0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      directlyReceivedPermissions.0.from:
-        "ethereum:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x8432728A257646449245558B8b7Dbe51A16c7a4D"
+        "eth:0x8432728A257646449245558B8b7Dbe51A16c7a4D"
    }
```

```diff
    contract TimelockEmergency (0x826714adD4dDA2b8750794A467C892c0Cd49216b) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      receivedPermissions.0.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      receivedPermissions.1.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      receivedPermissions.2.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.3.from:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      receivedPermissions.4.from:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      receivedPermissions.5.from:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      receivedPermissions.6.from:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
+        "eth:0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
+        "eth:0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
+        "eth:0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
+        "eth:0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
+        "eth:0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
+        "eth:0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x8432728A257646449245558B8b7Dbe51A16c7a4D"
+        "eth:0x8432728A257646449245558B8b7Dbe51A16c7a4D"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
+        "eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
+        "eth:0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      directlyReceivedPermissions.10.from:
-        "ethereum:0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
+        "eth:0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      directlyReceivedPermissions.11.from:
-        "ethereum:0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
+        "eth:0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      directlyReceivedPermissions.12.from:
-        "ethereum:0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
+        "eth:0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      directlyReceivedPermissions.13.from:
-        "ethereum:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
    }
```

```diff
    EOA  (0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.3.from:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.1.from:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.2.from:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.3.from:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.4.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.5.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.6.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.7.from:
-        "ethereum:0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
    }
```

```diff
    EOA  (0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "ethereum:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "ethereum:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "eth:0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "ethereum:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "eth:0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "eth:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.3.from:
-        "ethereum:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b"
    }
```

Generated with discovered.json: 0x0a63033544bee2b06983e6bfb49938e9e1b33a85

# Diff at Thu, 03 Jul 2025 10:57:04 GMT:

- chain: scroll
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fa3b82adfb9dedeb2acea8fde7b79e65d59fb2b6 block: 16562505
- current block number: 16562505

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16562505 (main branch discovery), not current.

```diff
    contract MasterMinter (0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE) {
    +++ description:  Contract that uses controllers to manage minters for USDC on Scroll.
      description:
-        "Manager contract for minter management [sic]."
+        " Contract that uses controllers to manage minters for USDC on Scroll."
    }
```

Generated with discovered.json: 0xc91e5a330e474f927ac954e1f8a675b413ab6a44

# Diff at Wed, 18 Jun 2025 12:03:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22574521
- current block number: 22731106

## Description

fee parameters and MS signer changed.

## Watched changes

```diff
    contract SystemConfig (0x8432728A257646449245558B8b7Dbe51A16c7a4D) {
    +++ description: System configuration contract for Scroll, contains enforcedBatchParameters and messageQueueParameters determining permissionless mode.
      values.messageQueueParameters.baseFeeOverhead:
-        15680000
+        4790000
      values.messageQueueParameters.baseFeeScalar:
-        34000000000000
+        388000000000000
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      values.$members.4:
-        "0xFCf6364F5157901f533DD3615A5d8c375F13c072"
+        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
    }
```

Generated with discovered.json: 0x9a2440616c0b425220ba85fc9629d3b03f3a6cd7

# Diff at Wed, 18 Jun 2025 12:03:41 GMT:

- chain: scroll
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 15984224
- current block number: 16562505

## Description

Signer change in team MS.

## Watched changes

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      values.$members.4:
-        "0xFCf6364F5157901f533DD3615A5d8c375F13c072"
+        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
    }
```

Generated with discovered.json: 0xcf3fd18ab57f3ffe784876c4539bc8caf5e0d896

# Diff at Mon, 16 Jun 2025 12:10:43 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@7a3a31c89fed0908e69a0c1d23d29a305ecc62fa block: 22574521
- current block number: 22574521

## Description

Updated SC link.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22574521 (main branch discovery), not current.

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      references.0.href:
-        "https://scroll.io/gov-docs/content/security-council"
+        "https://scroll-governance-documentation.vercel.app/gov-docs/content/what-is-security-council"
    }
```

Generated with discovered.json: 0xc1d7c6bfd48c14f0d51f6b5a9593de255d379df1

# Diff at Tue, 27 May 2025 13:50:07 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@23beb76ada08c9c42f8f16b886f40d94b22ac36e block: 22567785
- current block number: 22574521

## Description

Added manual source for new verifier.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567785 (main branch discovery), not current.

```diff
    contract PlonkVerifierPostEuclid-2 (0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0x26cd90e30199eed8d6c94ea4ffaf77c4b2a17f7e3ad9299ff6aaa482214bbb56"]
      references:
+        [{"text":"Source Code","href":"https://circuit-release.s3.us-west-2.amazonaws.com/scroll-zkvm/releases/0.4.2/bundle/verifier.bin"}]
    }
```

Generated with discovered.json: 0x5956aac180a00ed19bbf1475df44bb2460139ece

# Diff at Mon, 26 May 2025 15:20:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 22437905
- current block number: 22567785

## Description

emergency upgrade: fix bug in the verifier. new verifier is not public/verified yet.

## Watched changes

```diff
-   Status: DELETED
    contract ZkEvmVerifierPostEuclid (0x33996CC9EEe2dc20B10b8E57d313d0FacC7a0828)
    +++ description: Contract used to verify zk proofs given the aggregate proof and the public input hash.
```

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Contract used to update the verifier and keep track of current and old versions.
      values.latestVerifier.6.verifier:
-        "0x33996CC9EEe2dc20B10b8E57d313d0FacC7a0828"
+        "0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba"
    }
```

```diff
-   Status: DELETED
    contract  (0x9F66505cB1626D06B50EF2597f41De6686e8f79a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifierPostEuclid-2 (0x7F1A3E1299F44baefE20CB2bcD62a75cA00c20d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierPostEuclid-2 (0xBB08c87a2E871FcF3d86C4F7ED03dEc8B66297Ba)
    +++ description: None
```

## Source code changes

```diff
.../ZkEvmVerifierPostEuclid-2.sol}                                        | 0
 .../ZkEvmVerifierPostEuclid.sol}                                          | 0
 2 files changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437905 (main branch discovery), not current.

```diff
    contract  (0x9F66505cB1626D06B50EF2597f41De6686e8f79a) {
    +++ description: None
      name:
-        "PlonkVerifierPostEuclid-2"
+        ""
    }
```

Generated with discovered.json: 0x2587b57b5429717f2c763848ed3afacacbf988c4

# Diff at Fri, 23 May 2025 09:41:19 GMT:

- chain: scroll
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 15285599
- current block number: 15285599

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15285599 (main branch discovery), not current.

```diff
    EOA  (0x0c5cc5155b346453154059aD9d2Ff695dB92f774) {
    +++ description: None
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      directlyReceivedPermissions.2.role:
+        ".owner"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      receivedPermissions.8.role:
+        ".timelock"
      receivedPermissions.7.role:
+        ".scNoDelay"
      receivedPermissions.6.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "execute transactions that are ready."
      receivedPermissions.6.via:
-        [{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]
      receivedPermissions.6.role:
+        ".Executor"
      receivedPermissions.5.role:
+        ".scNoDelay"
      receivedPermissions.4.role:
+        ".scNoDelay"
      receivedPermissions.3.description:
-        "execute transactions that are ready."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.3.role:
+        ".timelockAdminAC"
      receivedPermissions.3.via:
+        [{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]
      receivedPermissions.2.role:
+        ".Proposer"
      receivedPermissions.1.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
      receivedPermissions.1.role:
+        ".Canceller"
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.1.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.3.role:
+        ".scNoDelay"
      directlyReceivedPermissions.2.from:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      directlyReceivedPermissions.2.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "disable enforced batch mode."
      directlyReceivedPermissions.2.role:
+        ".scNoDelay"
      directlyReceivedPermissions.1.description:
-        "disable enforced batch mode."
+        "upgrade all core contracts of the system."
      directlyReceivedPermissions.1.role:
+        ".scNoDelay"
      directlyReceivedPermissions.0.from:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      directlyReceivedPermissions.0.description:
-        "upgrade all core contracts of the system."
+        "update the minimum delay and manage all access control roles of the timelock."
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      directlyReceivedPermissions.2.role:
+        ".Executor"
      directlyReceivedPermissions.1.role:
+        ".Executor"
      directlyReceivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    EOA  (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5) {
    +++ description: None
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351) {
    +++ description: None
      receivedPermissions.0.role:
+        ".manager"
    }
```

```diff
    contract TimelockSCSlow (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14) {
    +++ description: None
      directlyReceivedPermissions.1.role:
+        ".timelock"
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract ProxyAdmin (0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026) {
    +++ description: None
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      receivedPermissions.3.role:
+        ".timelockAdminAC"
      receivedPermissions.2.role:
+        ".Proposer"
      receivedPermissions.1.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
      receivedPermissions.1.role:
+        ".Canceller"
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    contract ProxyAdmin (0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B) {
    +++ description: None
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      receivedPermissions.3.role:
+        ".timelockAdminAC"
      receivedPermissions.2.role:
+        ".Proposer"
      receivedPermissions.1.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
      receivedPermissions.1.role:
+        ".Canceller"
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    EOA  (0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402) {
    +++ description: None
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

Generated with discovered.json: 0x674e436234f1a4b596a376bc026371925b961ce2

# Diff at Fri, 23 May 2025 09:41:19 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437905
- current block number: 22437905

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437905 (main branch discovery), not current.

```diff
    EOA  (0x0c5cc5155b346453154059aD9d2Ff695dB92f774) {
    +++ description: None
      receivedPermissions.3.role:
+        ".Executor"
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    contract TimelockSCEmergency (0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.3.role:
+        ".scNoDelay"
      directlyReceivedPermissions.2.role:
+        ".scNoDelay"
      directlyReceivedPermissions.1.role:
+        ".scNoDelay"
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.4.role:
+        ".opsFast"
      directlyReceivedPermissions.3.role:
+        ".opsFast"
      directlyReceivedPermissions.2.role:
+        ".opsFast"
      directlyReceivedPermissions.1.from:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.1.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "update the L1ScrollMessenger fee vault address."
      directlyReceivedPermissions.1.role:
+        ".opsFast"
      directlyReceivedPermissions.0.from:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      directlyReceivedPermissions.0.description:
-        "update the L1ScrollMessenger fee vault address."
+        "update the minimum delay and manage all access control roles of the timelock."
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      receivedPermissions.12.role:
+        ".Executor"
      receivedPermissions.11.from:
-        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.11.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "execute transactions that are ready."
      receivedPermissions.11.via:
-        [{"address":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","delay":259200}]
      receivedPermissions.11.role:
+        ".Executor"
      receivedPermissions.10.role:
+        ".scNoDelay"
      receivedPermissions.9.description:
-        "propose transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.9.role:
+        ".timelockAdminAC"
      receivedPermissions.9.via:
+        [{"address":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","delay":259200}]
      receivedPermissions.8.from:
-        "0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.8.description:
-        "execute transactions that are ready."
+        "disable enforced batch mode."
      receivedPermissions.8.role:
+        ".scNoDelay"
      receivedPermissions.8.via:
+        [{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]
      receivedPermissions.7.from:
-        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.7.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "upgrade all core contracts of the system."
      receivedPermissions.7.role:
+        ".scNoDelay"
      receivedPermissions.7.via:
+        [{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]
      receivedPermissions.6.description:
-        "cancel queued transactions."
+        "propose transactions."
      receivedPermissions.6.role:
+        ".Proposer"
      receivedPermissions.5.from:
-        "0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
+        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.5.description:
-        "propose transactions."
+        "cancel queued transactions."
      receivedPermissions.5.role:
+        ".Canceller"
      receivedPermissions.4.from:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      receivedPermissions.4.description:
-        "disable enforced batch mode."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.4.via:
-        [{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]
      receivedPermissions.4.role:
+        ".timelockAdminAC"
      receivedPermissions.3.from:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      receivedPermissions.3.description:
-        "upgrade all core contracts of the system."
+        "propose transactions."
      receivedPermissions.3.via:
-        [{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]
      receivedPermissions.3.role:
+        ".Proposer"
      receivedPermissions.2.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
      receivedPermissions.2.role:
+        ".Canceller"
      receivedPermissions.1.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.1.role:
+        ".timelockAdminAC"
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.1.role:
+        ".Proposer"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      directlyReceivedPermissions.3.role:
+        ".Executor"
      directlyReceivedPermissions.2.role:
+        ".Executor"
      directlyReceivedPermissions.1.role:
+        ".Executor"
      directlyReceivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    EOA  (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5) {
    +++ description: None
      receivedPermissions.3.role:
+        ".Executor"
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    contract TimelockSCSlow (0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract TimelockEmergency (0x826714adD4dDA2b8750794A467C892c0Cd49216b) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.3.role:
+        ".opsNoDelay"
      directlyReceivedPermissions.2.role:
+        ".opsNoDelay"
      directlyReceivedPermissions.1.from:
-        "0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      directlyReceivedPermissions.1.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "revert unfinalized batches."
      directlyReceivedPermissions.1.role:
+        ".opsNoDelay"
      directlyReceivedPermissions.0.from:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      directlyReceivedPermissions.0.description:
-        "revert unfinalized batches."
+        "update the minimum delay and manage all access control roles of the timelock."
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      receivedPermissions.6.role:
+        ".opsNoDelay"
      receivedPermissions.5.role:
+        ".opsNoDelay"
      receivedPermissions.4.role:
+        ".Proposer"
      receivedPermissions.3.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
      receivedPermissions.3.role:
+        ".Canceller"
      receivedPermissions.2.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.2.role:
+        ".timelockAdminAC"
      receivedPermissions.1.from:
-        "0x826714adD4dDA2b8750794A467C892c0Cd49216b"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.1.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "revert unfinalized batches."
      receivedPermissions.1.role:
+        ".opsNoDelay"
      receivedPermissions.0.from:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "0x826714adD4dDA2b8750794A467C892c0Cd49216b"
      receivedPermissions.0.description:
-        "revert unfinalized batches."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      directlyReceivedPermissions.13.role:
+        "admin"
      directlyReceivedPermissions.12.role:
+        "admin"
      directlyReceivedPermissions.11.role:
+        "admin"
      directlyReceivedPermissions.10.role:
+        "admin"
      directlyReceivedPermissions.9.role:
+        "admin"
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B) {
    +++ description: None
      receivedPermissions.3.role:
+        ".Executor"
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      receivedPermissions.7.role:
+        ".opsFast"
      receivedPermissions.6.role:
+        ".opsFast"
      receivedPermissions.5.role:
+        ".opsFast"
      receivedPermissions.4.from:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      receivedPermissions.4.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "update the L1ScrollMessenger fee vault address."
      receivedPermissions.4.role:
+        ".opsFast"
      receivedPermissions.3.description:
-        "propose transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.3.role:
+        ".timelockAdminAC"
      receivedPermissions.3.via:
+        [{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]
      receivedPermissions.2.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "propose transactions."
      receivedPermissions.2.role:
+        ".Proposer"
      receivedPermissions.1.role:
+        ".Canceller"
      receivedPermissions.0.from:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
+        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      receivedPermissions.0.description:
-        "update the L1ScrollMessenger fee vault address."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.0.via:
-        [{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    EOA  (0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402) {
    +++ description: None
      receivedPermissions.3.role:
+        ".Executor"
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

Generated with discovered.json: 0x8e0b4a71f5e0ac4d1c50100ba97f9a142097dbcf

# Diff at Thu, 08 May 2025 09:56:45 GMT:

- chain: scroll
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 15127262
- current block number: 15285599

## Description

ms member change.

## Watched changes

```diff
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F) {
    +++ description: None
      values.$members.8:
-        "0x4970e361f6168a301D1036348d625A8930B1AaB7"
+        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
      values.$members.7:
-        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
+        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
      values.$members.6:
-        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
+        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
      values.$members.5:
-        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
+        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
      values.$members.4:
-        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
+        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
      values.$members.3:
-        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
+        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
      values.$members.2:
-        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
+        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
      values.$members.1:
-        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
+        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
      values.$members.0:
-        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
+        "0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
    }
```

Generated with discovered.json: 0x03aec8a359a6450ad9df9de95044bb545bd81d1d

# Diff at Thu, 08 May 2025 09:56:44 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22389279
- current block number: 22437905

## Description

sub MS member change.

## Watched changes

```diff
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F) {
    +++ description: None
      values.$members.8:
-        "0x4970e361f6168a301D1036348d625A8930B1AaB7"
+        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
      values.$members.7:
-        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
+        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
      values.$members.6:
-        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
+        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
      values.$members.5:
-        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
+        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
      values.$members.4:
-        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
+        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
      values.$members.3:
-        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
+        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
      values.$members.2:
-        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
+        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
      values.$members.1:
-        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
+        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
      values.$members.0:
-        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
+        "0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
    }
```

Generated with discovered.json: 0x0142a4def33340c1bbc47782e3aca5b7ef821318

# Diff at Thu, 01 May 2025 13:25:04 GMT:

- chain: scroll
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@2b416a2682a6346947ff8f432469bc39157f1420 block: 15048934
- current block number: 15127262

## Description

Ignored USDC on Scroll total supply.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15048934 (main branch discovery), not current.

```diff
    contract Scroll USDC (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4) {
    +++ description: Contract of the USDC token on Scroll.
      values.totalSupply:
-        19147318188126
    }
```

Generated with discovered.json: 0x57f3ecf012398c81fdab7be5e9e1f55625b3363b

# Diff at Tue, 29 Apr 2025 09:33:30 GMT:

- chain: scroll
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 15048934
- current block number: 15048934

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15048934 (main branch discovery), not current.

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      issuedPermissions:
-        [{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"disable enforced batch mode.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update ScrollChain zk proof verifier.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"upgrade all core contracts of the system.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]}]
    }
```

```diff
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions:
-        [{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"propose transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

```diff
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions:
-        [{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"propose transactions.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376","delay":86400}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

```diff
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0) {
    +++ description: Used to propose and manage onchain governance proposals.
      issuedPermissions:
-        [{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"can configure contract settings such as voting delay, quorum, contract manager.","via":[{"address":"0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","delay":259200}]},{"permission":"interact","to":"0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351","description":"can propose new onchain governance proposals without the required threshold of votes.","via":[]}]
    }
```

```diff
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions:
-        [{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"propose transactions.","via":[]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

Generated with discovered.json: 0x627c78caab038fcf709a0203a9d6f1900088fe9c

# Diff at Tue, 29 Apr 2025 09:33:30 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22367020
- current block number: 22367020

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22367020 (main branch discovery), not current.

```diff
    contract TimelockSCEmergency (0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions:
-        [{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"propose transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

```diff
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions:
-        [{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"propose transactions.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

```diff
    contract TimelockSCSlow (0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions:
-        [{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"propose transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","delay":259200}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      issuedPermissions:
-        [{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"disable enforced batch mode.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update ScrollChain zk proof verifier.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"upgrade all core contracts of the system.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"pause the L1 -> L2 messenger and enforced transaction mode.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"remove permissioned batchers and provers to the whitelist, and update the sequencer address.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"revert unfinalized batches.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"add permissioned batchers and provers to the whitelist.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"set ERC20 gateways in the L1GatewayRouter.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the L1ScrollMessenger fee vault address.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the minimum delay message queue parameters and enforced mode parameters.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]}]
    }
```

```diff
    contract TimelockEmergency (0x826714adD4dDA2b8750794A467C892c0Cd49216b) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions:
-        [{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"propose transactions.","via":[]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

Generated with discovered.json: 0x3b4f0a01e6d2764c7b4d9c2e95064ed9c372de23

# Diff at Mon, 28 Apr 2025 10:39:37 GMT:

- chain: scroll
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a68d2e28c8787c5d6b9533bafbaed67dd065d75c block: 14489756
- current block number: 15048934

## Description

Added new roles to the ScrollOwner contract and its timelock controllers.

## Watched changes

```diff
    contract Scroll USDC (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4) {
    +++ description: Contract of the USDC token on Scroll.
      values.totalSupply:
-        18073085046087
+        19147318188126
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      values.$members.2:
-        "0xE2e6345baAD18f779167443Dc4886495507b3249"
+        "0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
      values.$members.1:
-        "0x9FB9ff268B89Fb22aDe61fbE1B938F5C72D3CC59"
+        "0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
      values.$threshold:
-        4
+        3
      values.multisigThreshold:
-        "4 of 5 (80%)"
+        "3 of 5 (60%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14489756 (main branch discovery), not current.

```diff
    contract undefined (0x0f50874f227621Dea72482004639a9fFe440A4dA) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0","via":[{"address":"0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"}]},{"permission":"upgrade","from":"0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]},{"permission":"upgrade","from":"0x6EA73e05AdC79974B931123675ea8F78FfdacDF0","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]},{"permission":"upgrade","from":"0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]},{"permission":"upgrade","from":"0xd29687c813D741E2F938F4aC377128810E217b1b","via":[{"address":"0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"}]},{"permission":"upgrade","from":"0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
      values.accessControl:
+        {"roles":{"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"]},"SECURITY_COUNCIL_NO_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x1f807E2E8ab2e61230a0A9C271F90242831278b4"]},"SCROLL_MULTISIG_NO_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"EMERGENCY_MULTISIG_NO_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_1DAY_DELAY_TOLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_7DAY_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"emergency-nodelay":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"]},"ops-fast":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"]}},"targets":{"0xA76acF000C890b0DD7AEEf57627d9899F955d026":{"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]},"0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81":{"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]},"0x5300000000000000000000000000000000000003":{"updateWhitelistStatus(address[],bool)":["emergency-nodelay"]},"0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC":{"setPause(bool)":["emergency-nodelay"]},"0x33B60d5Dd260d453cAC3782b0bDC01ce84672142":{"pauseDeposit(bool)":["emergency-nodelay"],"pauseWithdraw(bool)":["emergency-nodelay"],"updateCircleCaller(address)":["ops-fast"]},"0x5300000000000000000000000000000000000002":{"setOverhead(uint256)":["ops-fast"],"setCommitScalar(uint256)":["ops-fast"],"setBlobScalar(uint256)":["ops-fast"]},"0x5300000000000000000000000000000000000005":{"updateMinWithdrawAmount(uint256)":["ops-fast"],"updateRecipient(address)":["ops-fast"]},"0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79":{"setERC20Gateway(address[],address[])":["ops-fast"]},"0x64CCBE37c9A82D85A1F2E74649b7A42923067988":{"updateTokenMapping(address,address)":["ops-fast"]},"0x7bC08E1c04fb41d75F1410363F0c5746Eae80582":{"updateTokenMapping(address,address)":["ops-fast"]},"0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc":{"updateTokenMapping(address,address)":["ops-fast"]},"0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4":{"transferOwnership(address)":["ops-fast"]},"0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE":{"transferOwnership(address)":["ops-fast"]},"0xa1a12158bE6269D7580C63eC5E609Cdc0ddD82bC":{"withdrawFailedAmount(address,address)":["ops-fast"],"grantRole(bytes32,address)":["ops-fast"],"revokeRole(bytes32,address)":["ops-fast"]}}}
      values.scNoDelay:
+        ["0x1f807E2E8ab2e61230a0A9C271F90242831278b4"]
      template:
+        "scroll/ScrollOwnerL2"
      description:
+        "Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role."
      issuedPermissions:
+        [{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"upgrade all core contracts of the system.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"disable enforced batch mode.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update ScrollChain zk proof verifier.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4","description":"cancel queued transactions."},{"permission":"interact","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4","description":"update the minimum delay and manage all access control roles of the timelock."},{"permission":"interact","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4","description":"propose transactions."},{"permission":"interact","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4","description":"execute transactions that are ready."},{"permission":"interact","from":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","description":"upgrade all core contracts of the system.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","from":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","description":"disable enforced batch mode.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","from":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","description":"update ScrollChain zk proof verifier.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","from":"0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0","description":"can configure contract settings such as voting delay, quorum, contract manager.","via":[{"address":"0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","delay":259200}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"},{"permission":"act","from":"0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","delay":259200}]
    }
```

```diff
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0","description":"can propose new onchain governance proposals without the required threshold of votes."}]
    }
```

```diff
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0) {
    +++ description: Used to propose and manage onchain governance proposals.
      issuedPermissions.1:
+        {"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"can configure contract settings such as voting delay, quorum, contract manager.","via":[{"address":"0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","delay":259200}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351"
      issuedPermissions.0.via.0:
-        {"address":"0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"}
      issuedPermissions.0.description:
+        "can propose new onchain governance proposals without the required threshold of votes."
      description:
+        "Used to propose and manage onchain governance proposals."
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract undefined (0x30315233090F675520eef5CBd7A6cf7d185af443) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract undefined (0x383C148ba96956F985F6141B2D119add1C34e3B7) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract L2GatewayRouter (0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79) {
    +++ description: Counterpart to the L1GatewayRouter contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
      description:
+        "Counterpart to the L1GatewayRouter contract."
    }
```

```diff
    contract L2MessageQueue (0x5300000000000000000000000000000000000000) {
    +++ description: Used to append messages to the L2MessageQueue from the L2ScrollMessenger.
      description:
+        "Used to append messages to the L2MessageQueue from the L2ScrollMessenger."
    }
```

```diff
    contract ScrollStandardERC20Factory (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    +++ description: Contract used to deploy ScrollStandardERC20 tokens for L2StandardERC20Gateway.
      description:
+        "Contract used to deploy ScrollStandardERC20 tokens for L2StandardERC20Gateway."
    }
```

```diff
-   Status: DELETED
    contract  (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367)
    +++ description: None
```

```diff
    contract SafeL2 (0x69C2eD64171bF5737c2B78bdF722e68a032B2825) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract L2ETHGateway (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    +++ description: Contract of the L2ScrollMessenger contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
      values.counterpart:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
+        "eth:0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      description:
+        "Contract of the L2ScrollMessenger contract."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"eth"}}]
    }
```

```diff
    contract undefined (0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract L2ScrollMessenger (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    +++ description: ETH is pre-minted to this contract in the genesis block and released on Scroll whenever corresponding deposits are made on Ethereum.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
      values.counterpart:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      description:
+        "ETH is pre-minted to this contract in the genesis block and released on Scroll whenever corresponding deposits are made on Ethereum."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"eth"}}]
    }
```

```diff
    contract TimelockSCSlow (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14) {
    +++ description: None
      name:
-        "TimelockController"
+        "TimelockSCSlow"
      values.timelockAdminAC:
+        ["0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","delay":259200},{"permission":"interact","from":"0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0","description":"can configure contract settings such as voting delay, quorum, contract manager."}]
    }
```

```diff
-   Status: DELETED
    contract  (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905)
    +++ description: None
```

```diff
    contract SafeL2 (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SafeL2 (0x9479ABfebefEea3c846163012a472b44F305b3d7) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract undefined (0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026) {
    +++ description: None
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"0x64CCBE37c9A82D85A1F2E74649b7A42923067988"}
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"}
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","from":"0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"}
      directlyReceivedPermissions.4:
+        {"permission":"upgrade","from":"0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"}
      directlyReceivedPermissions.3.from:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
      directlyReceivedPermissions.2.from:
-        "0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
      directlyReceivedPermissions.1.from:
-        "0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
+        "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
    }
```

```diff
    contract SafeL2 (0xC3eA7C657884BB380B66D79C36aDCb5658b01896) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ScrollStandardERC20 (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    +++ description: Contract of the ERC20 standard token used by the ERC20 factory.
      description:
+        "Contract of the ERC20 standard token used by the ERC20 factory."
    }
```

```diff
    contract SCRToken (0xd29687c813D741E2F938F4aC377128810E217b1b) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"}]}]
    }
```

```diff
-   Status: DELETED
    contract  (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9)
    +++ description: None
```

```diff
    contract L2GatewayRouter (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    +++ description: Contract used to withdraw ERC20 tokens on L2 and finalize deposit the tokens from L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
      values.counterpart:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
+        "eth:0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      description:
+        "Contract used to withdraw ERC20 tokens on L2 and finalize deposit the tokens from L1."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"eth"}}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract undefined (0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract undefined (0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ProposalTypesConfigurator (0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
+   Status: CREATED
    contract Scroll USDC (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4)
    +++ description: Contract of the USDC token on Scroll.
```

```diff
+   Status: CREATED
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4)
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376)
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract L2ERC1155Gateway (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc)
    +++ description: Counterpart to the L1ERC1155Gateway contract.
```

```diff
+   Status: CREATED
    contract L2CustomERC20Gateway (0x64CCBE37c9A82D85A1F2E74649b7A42923067988)
    +++ description: Counterpart to the L1CustomERC20Gateway contract.
```

```diff
+   Status: CREATED
    contract L2ERC721Gateway (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582)
    +++ description: Counterpart to the L1ERC721Gateway contract.
```

```diff
+   Status: CREATED
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f)
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract MasterMinter (0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE)
    +++ description: Manager contract for minter management [sic].
```

```diff
+   Status: CREATED
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe)
    +++ description: None
```

Generated with discovered.json: 0xcf769c4f6c70fd534da2f94dab4444c3d4edc589

# Diff at Mon, 28 Apr 2025 10:39:01 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a68d2e28c8787c5d6b9533bafbaed67dd065d75c block: 22297562
- current block number: 22367020

## Description

EnforcedTxGateway unpaused. Upgraded permissions for Stage 1.

## Watched changes

```diff
-   Status: DELETED
    contract L1MessageQueueWithGasPriceOracle (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37)
    +++ description: None
```

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Contract used to update the verifier and keep track of current and old versions.
      values.latestVerifier.6:
+        {"startBatchIndex":0,"verifier":"0x33996CC9EEe2dc20B10b8E57d313d0FacC7a0828"}
      values.legacyVerifiersLength.6:
+        0
      values.verifierVersions.6:
+        7
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.
      sourceHashes.1:
-        "0xe550fda323606a4b4fd2a05cf45dda231290e1d57a077828632c098fa0579161"
+        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
      sourceHashes.0:
-        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
+        "0x0a1aa34da20ecb18034b84d08a6f6c0a3b5f5b865aaf9fbd37ef7c766dfdc5a8"
      values.$implementation:
-        "0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"
+        "0x84791281EF5cb8Af5dCd4c122f7A42FeD38Fef5b"
      values.$pastUpgrades.3:
+        ["2025-04-25T07:06:59.000Z","0x783703d4e94de48edb75261149a540cbf7abb7ef077865c11080e622a508ab86",["0x84791281EF5cb8Af5dCd4c122f7A42FeD38Fef5b"]]
      values.$pastUpgrades.2:
+        ["2023-10-08T16:25:23.000Z","0xcad9f31340db6aca3a5da0d704ee33a9b6c43a5b1be4406cc0ed33edbdd7c92e",["0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"]]
      values.$pastUpgrades.1.2.0:
-        "0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"
+        "0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"
      values.$pastUpgrades.1.1:
-        "2023-10-08T16:25:23.000Z"
+        "2024-02-22T08:20:23.000Z"
      values.$pastUpgrades.1.0:
-        "0xcad9f31340db6aca3a5da0d704ee33a9b6c43a5b1be4406cc0ed33edbdd7c92e"
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
-        ["0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"]
+        "0x2c09704f5717cd65e31ea854b8c6a5229b841fcabc5bcbbbb1117f13b9f60d21"
      values.$pastUpgrades.0.1:
-        "2024-02-22T08:20:23.000Z"
+        "2025-04-22T06:01:35.000Z"
      values.$pastUpgrades.0.0:
-        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
+        ["0xc6326109E33465d6d61e4Cb7AFCe7B1bE7cfF868"]
      values.$upgradeCount:
-        2
+        4
      values.counterpart:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.messageQueue:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      values.prevReplayIndex:
-        [0,0,0,0,0]
      values.xDomainMessageSender:
-        "0x0000000000000000000000000000000000000001"
+        "scr:0x0000000000000000000000000000000000000001"
      values.enforcedTxGateway:
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      values.messageQueueV1:
+        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      values.messageQueueV2:
+        "0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
      errors:
-        {"prevReplayIndex":"Processing error occurred."}
      template:
+        "scroll/L1ScrollMessenger"
      description:
+        "Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"scr"}}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: Contracts to force L1 -> L2 messages with the proper sender.
      sourceHashes.1:
-        "0xcb83aeace6c4751da7d9340ffa2eff5c9c9fdf2e9c1f25d6bc2f31ffabfcb477"
+        "0x7e017c785ff8a5c9fce815594b0d7e7ced85dbc125ae000cd7babf1cfaefabf9"
      values.$implementation:
-        "0x642af405bF64660665B37977449C9C536B806318"
+        "0x7e87c75BBe7991bbCEBd2C7a56f4cFC923BDDBcc"
      values.$pastUpgrades.1:
+        ["2025-04-22T06:01:35.000Z","0x2c09704f5717cd65e31ea854b8c6a5229b841fcabc5bcbbbb1117f13b9f60d21",["0x7e87c75BBe7991bbCEBd2C7a56f4cFC923BDDBcc"]]
      values.$upgradeCount:
-        1
+        2
      values.messageQueue:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
+        "0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
+++ description: Whether the sendTransaction function is paused or not. Affects the sequencer failure risk.
+++ severity: HIGH
      values.paused:
-        true
+        false
      template:
+        "scroll/EnforcedTxGateway"
      description:
+        "Contracts to force L1 -> L2 messages with the proper sender."
      fieldMeta:
+        {"paused":{"severity":"HIGH","description":"Whether the sendTransaction function is paused or not. Affects the sequencer failure risk."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
-   Status: DELETED
    contract L2ScrollMessengerFallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC)
    +++ description: None
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      directlyReceivedPermissions.1:
+        {"permission":"interact","from":"0x8432728A257646449245558B8b7Dbe51A16c7a4D","description":"update the minimum delay message queue parameters and enforced mode parameters."}
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.revertBatch(bytes,bytes):
-        ["emergency-nodelay"]
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.finalizeEuclidInitialBatch(bytes32):
-        ["SECURITY_COUNCIL_NO_DELAY_ROLE"]
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.revertBatch(bytes):
+        ["emergency-nodelay"]
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.disableEnforcedBatchMode():
+        ["SECURITY_COUNCIL_NO_DELAY_ROLE"]
      values.accessControl.targets.0x8432728A257646449245558B8b7Dbe51A16c7a4D:
+        {"updateMessageQueueParameters((uint32,uint112,uint112))":["ops-fast"],"updateEnforcedBatchParameters((uint24,uint24))":["ops-fast"],"updateSigner(address)":["emergency-nodelay"]}
      values.accessControl.targets.0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d:
+        {"setPause(bool)":["emergency-nodelay"]}
    }
```

```diff
-   Status: DELETED
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852)
    +++ description: None
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: The main contract of the Scroll chain. Allows to post transaction data and state roots, along with proofs. Sequencing and proposing are behind a whitelist unless enforcedBatchMode is activated.
      sourceHashes.1:
-        "0x2d7fa796a8274772f3ee8143549252719d97cf0dafeaf769802b66b51a195041"
+        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
      sourceHashes.0:
-        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
+        "0x73386ff4d9fbaf9cba78ae1e91ee43f11ff39acb8bcf332085ec42d7da6c2306"
      values.$implementation:
-        "0x8f339292d2b3909574B2bEB051a613a987dB538f"
+        "0xb7c8833F5627a8a12558cAFa0d0EBD1ACBDce43f"
      values.$pastUpgrades.6:
+        ["2025-04-15T14:47:23.000Z","0xa1faad1ccd2c390641b46d50d93c26b7369137f021e528acfec78385494b2fb0",["0x8f339292d2b3909574B2bEB051a613a987dB538f"]]
      values.$pastUpgrades.5.2:
-        "2025-04-15T14:47:23.000Z"
+        "0x3928e0223337a112ea68c84db95441185a3e1da809638be13c0135761aa19ee7"
      values.$pastUpgrades.5.1:
-        "0xa1faad1ccd2c390641b46d50d93c26b7369137f021e528acfec78385494b2fb0"
+        ["0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"]
      values.$pastUpgrades.5.0:
-        ["0x8f339292d2b3909574B2bEB051a613a987dB538f"]
+        "2024-08-20T23:36:35.000Z"
      values.$pastUpgrades.4.2:
-        "0x3928e0223337a112ea68c84db95441185a3e1da809638be13c0135761aa19ee7"
+        "0x2c09704f5717cd65e31ea854b8c6a5229b841fcabc5bcbbbb1117f13b9f60d21"
      values.$pastUpgrades.4.1.0:
-        "0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"
+        "0xb7c8833F5627a8a12558cAFa0d0EBD1ACBDce43f"
      values.$pastUpgrades.4.0:
-        "2024-08-20T23:36:35.000Z"
+        "2025-04-22T06:01:35.000Z"
      values.$upgradeCount:
-        6
+        7
      values.committedBatches:
-        ["0x5aaeb6101a47fc16866e80d77ffe090b6a7b3cf7d988be981646ab6aedfa2c42","0xaa8181f04f8e305328a6117fa6bc13fa2093a3c4c990c5281df95a1cb85ca18f","0x30d13ec2a06074f2048d64d85b62e1b4fb8f461d43bbd26099ef86d903c97399","0xe4bf15441d44aec723eff1ba7e80f9f5c6dbc46312471d0b23e297310870012f","0xcb24a337233a0d9a335e71a33637a8e42d71422c08ca6338572eb1e25e0f989a"]
      values.finalizedStateRoots:
-        ["0x08d535cc60f40af5dd3b31e0998d7567c2d568b224bed2ba26070aeb078d1339","0x2b3219c3d89d50b5aa4e56743c4e22501d34b885e468365ba3b1cc818297db74","0x2494e7866ed0b6e8cf87024c0036e53cf3d4a7cbe22f11d80f8fff36392463a0","0x18a3423e924e332986d81b32fbec1f1d21b1f7a8a706267fdf87ed18bc6dfff6","0x2d0336979e3bcd0ef4c4cde61d5ab5b14ee57b5f533152c459dc0e63bb1a7e1f"]
      values.isBatchFinalized:
-        [true,true,true,true,true]
      values.messageQueue:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      values.withdrawRoots:
-        ["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x42b111e4bf3652280b54a2f4a5195aeab5db8f647e93d1725566be3f2f9aedc0","0x42b111e4bf3652280b54a2f4a5195aeab5db8f647e93d1725566be3f2f9aedc0"]
      values.isEnforcedModeEnabled:
+        false
      values.messageQueueV1:
+        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      values.messageQueueV2:
+        "0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
      values.provers:
+        ["0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c","0x74b286304576625557629C47E9E8702383D9eF92"]
      values.revertedBatches:
+        [275119,275120,275121,275122,275123,275124,275125,275126,275127,275128,275129,275130,275131,275132,275133,275134,275135,275136,275137,275138,275139,275140,275141,275142,275143,275144,275145,275146,275147,275148,275149,275150,275151,275152,275153,275154,275155,275156,275157,275158,275159,275160,275161,275162,275163,275164,275165,275166,275167,275168,275169,275170,275171,275172,275173,346818,346817,346816,346815]
      values.sequencers:
+        ["0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B","0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"]
      values.systemConfig:
+        "0x8432728A257646449245558B8b7Dbe51A16c7a4D"
      errors:
-        {"committedBatches":"Processing error occurred.","finalizedStateRoots":"Processing error occurred.","isBatchFinalized":"Processing error occurred.","withdrawRoots":"Processing error occurred."}
      template:
+        "scroll/ScrollChain"
      description:
+        "The main contract of the Scroll chain. Allows to post transaction data and state roots, along with proofs. Sequencing and proposing are behind a whitelist unless enforcedBatchMode is activated."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      directlyReceivedPermissions.10.from:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
+        "0x8432728A257646449245558B8b7Dbe51A16c7a4D"
      directlyReceivedPermissions.9.from:
-        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
+        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      directlyReceivedPermissions.8.from:
-        "0x987e300fDfb06093859358522a79098848C33852"
+        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      directlyReceivedPermissions.1.from:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
+        "0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      values.$members.2:
-        "0xE2e6345baAD18f779167443Dc4886495507b3249"
+        "0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
      values.$members.1:
-        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
+        "0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
      values.$threshold:
-        4
+        3
      values.multisigThreshold:
-        "4 of 5 (80%)"
+        "3 of 5 (60%)"
    }
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierPostEuclid (0x33996CC9EEe2dc20B10b8E57d313d0FacC7a0828)
    +++ description: Contract used to verify zk proofs given the aggregate proof and the public input hash.
```

```diff
+   Status: CREATED
    contract L1MessageQueueV2 (0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a)
    +++ description: Contains the array of queued L1 -> L2 messages, either appended using the L1ScrollMessenger or the EnforcedTxGateway.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x8432728A257646449245558B8b7Dbe51A16c7a4D)
    +++ description: System configuration contract for Scroll, contains enforcedBatchParameters and messageQueueParameters determining permissionless mode.
```

```diff
+   Status: CREATED
    contract PlonkVerifierPostEuclid-2 (0x9F66505cB1626D06B50EF2597f41De6686e8f79a)
    +++ description: None
```

## Source code changes

```diff
.../EnforcedTxGateway/EnforcedTxGateway.sol        |  79 +-
 .../L1MessageQueueV2/L1MessageQueueV2.sol}         | 867 +++++++--------------
 .../TransparentUpgradeableProxy.p.sol              |   2 +-
 .../L1ScrollMessenger/L1ScrollMessenger.sol        |  50 +-
 .../L2ScrollMessengerFallback.sol => /dev/null     | 469 -----------
 .../ScrollChain/ScrollChain.sol                    | 652 +++++++++++++---
 .../SystemConfig/SystemConfig.sol}                 | 212 ++---
 .../TransparentUpgradeableProxy.p.sol              |   2 +-
 .../.flat@22297562/Whitelist.sol => /dev/null      |  97 ---
 ...0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3.sol} |   0
 ...-0x33996CC9EEe2dc20B10b8E57d313d0FacC7a0828.sol | 102 +++
 11 files changed, 1095 insertions(+), 1437 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22297562 (main branch discovery), not current.

```diff
    contract ZkEvmVerifierPostEuclid (0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PlonkVerifierV1-1 (0x03a72B00D036C479105fF98A1953b15d9c510110) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract undefined (0x0c5cc5155b346453154059aD9d2Ff695dB92f774) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x826714adD4dDA2b8750794A467C892c0Cd49216b","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

```diff
    contract TimelockSCEmergency (0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      name:
-        "TimelockSC"
+        "TimelockSCEmergency"
      values.Canceller:
+        ["0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor:
+        ["0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f","0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]
      values.getMinDelayFormatted:
+        "0s"
      values.Proposer:
+        ["0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]
      values.timelockAdminAC:
+        ["0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]
      template:
+        "scroll/L1Timelock"
      description:
+        "A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone."
      issuedPermissions:
+        [{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"propose transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","description":"update the minimum delay and manage all access control roles of the timelock."},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"upgrade all core contracts of the system."},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"disable enforced batch mode."},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update ScrollChain zk proof verifier."}]
      fieldMeta:
+        {"Executor":{"severity":"HIGH","description":"Executing proposals is only open to all addresses if this resolves to the 0x0 address"}}
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1MessageQueueWithGasPriceOracle (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      name:
-        "L1MessageQueue"
+        "L1MessageQueueWithGasPriceOracle"
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.estimateCrossDomainMessageFee:
+        [0,39287348,78574696,117862044,157149392]
      values.getCrossDomainMessage:
+        ["0x8aa0f1f4e9ca81e9263a62ad3543600dbd50a8a7ca6ad3456f4d19b01b2f4320","0xa52c3a1943be02ca2ccba4ca7000af0ef89bb0114fc781f70df88d0dc2a3c894","0x244042e9244ca7cba571bb4443b5522d9cea30221fcdcb1feba0356740a675ae","0x5e7b7df9dfa789d115c10a8d902437c326190f6d1aa8a213bd10b3021b86a0e6","0x2e8ecf1f39268e939bc8275beb7a1a7d808da0701239087ea1597c91125efe28"]
      values.isMessageDropped:
+        [false,false,false,false,false]
      values.isMessageSkipped:
+        [false,false,false,false,false]
      values.messageQueue:
+        ["0x8aa0f1f4e9ca81e9263a62ad3543600dbd50a8a7ca6ad3456f4d19b01b2f4320","0xa52c3a1943be02ca2ccba4ca7000af0ef89bb0114fc781f70df88d0dc2a3c894","0x244042e9244ca7cba571bb4443b5522d9cea30221fcdcb1feba0356740a675ae","0x5e7b7df9dfa789d115c10a8d902437c326190f6d1aa8a213bd10b3021b86a0e6","0x2e8ecf1f39268e939bc8275beb7a1a7d808da0701239087ea1597c91125efe28"]
      errors:
+        {"estimateCrossDomainMessageFee":"Processing error occurred.","getCrossDomainMessage":"Processing error occurred.","isMessageDropped":"Processing error occurred.","isMessageSkipped":"Processing error occurred.","messageQueue":"Processing error occurred."}
    }
```

```diff
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      values.Canceller:
+        ["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor:
+        ["0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"]
      values.getMinDelayFormatted:
+        "1d"
      values.Proposer:
+        ["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]
      values.timelockAdminAC:
+        ["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","0x0e58939204eEDa84F796FBc86840A50af10eC4F4"]
      template:
+        "scroll/L1Timelock"
      description:
+        "A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone."
      issuedPermissions:
+        [{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"propose transactions.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the L1ScrollMessenger fee vault address."},{"permission":"interact","from":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","description":"update the minimum delay and manage all access control roles of the timelock."},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"add permissioned batchers and provers to the whitelist."},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the minimum delay message queue parameters and enforced mode parameters."},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"set ERC20 gateways in the L1GatewayRouter."}]
      fieldMeta:
+        {"Executor":{"severity":"HIGH","description":"Executing proposals is only open to all addresses if this resolves to the 0x0 address"}}
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract undefined (0x0f50874f227621Dea72482004639a9fFe440A4dA) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]},{"permission":"interact","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","description":"cancel queued transactions."},{"permission":"interact","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","description":"update the minimum delay and manage all access control roles of the timelock."},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"upgrade all core contracts of the system.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"disable enforced batch mode.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]},{"permission":"interact","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","description":"propose transactions."},{"permission":"interact","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","description":"cancel queued transactions."},{"permission":"interact","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","description":"update the minimum delay and manage all access control roles of the timelock."},{"permission":"interact","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","description":"execute transactions that are ready."},{"permission":"interact","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","description":"propose transactions."},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update ScrollChain zk proof verifier.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]},{"permission":"interact","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","delay":259200}]},{"permission":"interact","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","description":"execute transactions that are ready."}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"},{"permission":"act","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","delay":259200}]
    }
```

```diff
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","description":"execute transactions that are ready."},{"permission":"interact","from":"0x826714adD4dDA2b8750794A467C892c0Cd49216b","description":"execute transactions that are ready."},{"permission":"interact","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","description":"execute transactions that are ready."},{"permission":"interact","from":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","description":"execute transactions that are ready."}]
    }
```

```diff
    contract PlonkVerifierV1 (0x2293cd12e8564e8219d314b075867c2f66ac6941) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    +++ description: None
      values.whitelisted:
-        ["0x3a2855ea96b2eb965568eA5d738B8DE185C717f4"]
    }
```

```diff
    contract undefined (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x826714adD4dDA2b8750794A467C892c0Cd49216b","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

```diff
    contract ZkEvmVerifierV2 (0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract undefined (0x30315233090F675520eef5CBd7A6cf7d185af443) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract undefined (0x383C148ba96956F985F6141B2D119add1C34e3B7) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract TimelockSCSlow (0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd) {
    +++ description: A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone.
      name:
-        "TimelockSlow"
+        "TimelockSCSlow"
      values.Canceller:
+        ["0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor:
+        ["0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f","0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]
      values.getMinDelayFormatted:
+        "3d"
      values.Proposer:
+        ["0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]
      values.timelockAdminAC:
+        ["0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]
      template:
+        "scroll/L1Timelock"
      description:
+        "A timelock with access control. The current minimum delay is 3d. Proposals that passed their minimum delay can be executed by the anyone."
      issuedPermissions:
+        [{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"propose transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","delay":259200}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","description":"update the minimum delay and manage all access control roles of the timelock."}]
      fieldMeta:
+        {"Executor":{"severity":"HIGH","description":"Executing proposals is only open to all addresses if this resolves to the 0x0 address"}}
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ZkEvmVerifierV1 (0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PlonkVerifierV0 (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Contract used to update the verifier and keep track of current and old versions.
      description:
-        "Used to update the verifier and keep track of current and old versions."
+        "Contract used to update the verifier and keep track of current and old versions."
      template:
+        "scroll/MultipleVersionRollupVerifier"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ZkEvmVerifierV0 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L2ERC1155GatewayFallback (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc)
    +++ description: None
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: Contract used to bridge ERC721 tokens from L1 to L2.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.counterpart:
-        "0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"
+        "scr:0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"
      template:
+        "scroll/L1ERC721Gateway"
      description:
+        "Contract used to bridge ERC721 tokens from L1 to L2."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"scr"}}]
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ZkEvmVerifierV1-1 (0x63FB51C55d9605a75F8872C80De260a00fACfaA2) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract L2CustomERC20GatewayFallback (0x64CCBE37c9A82D85A1F2E74649b7A42923067988)
    +++ description: None
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      values.counterpart:
-        "0x8aE8f22226B9d789A36AC81474e633f8bE2856c9"
+        "scr:0x8aE8f22226B9d789A36AC81474e633f8bE2856c9"
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"scr"}}]
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
-   Status: DELETED
    contract L2TokenFactoryFallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484)
    +++ description: None
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.counterpart:
-        "0xaC78dff3A87b5b534e366A93E785a0ce8fA6Cc62"
+        "scr:0xaC78dff3A87b5b534e366A93E785a0ce8fA6Cc62"
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"scr"}}]
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.prevReplayIndex:
+        [0,0,0,0,0]
      errors:
+        {"prevReplayIndex":"Processing error occurred."}
    }
```

```diff
    contract Safe (0x69C2eD64171bF5737c2B78bdF722e68a032B2825) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract L2ETHGatewayFallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L2WETHGatewayFallback (0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9)
    +++ description: None
```

```diff
    contract undefined (0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      fieldMeta:
-        {"paused":{"severity":"HIGH","description":"Whether the sendTransaction function is paused or not. Affects the sequencer failure risk."}}
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0x67260A8B73C5B77B55c1805218A42A7A6F98F515","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0x7F2b8C31F88B6006c382775eea88297Ec1e3E905","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0x987e300fDfb06093859358522a79098848C33852","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0xa13BAF47339d63B743e7Da8741db5456DAc1E556","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0xb2b10a289A229415a124EFDeF310C10cb004B6ff","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","from":"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.accessControl.roles.TIMELOCK_1DAY_DELAY_TOLE:
-        {"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}
      values.accessControl.roles.TIMELOCK_1DAY_DELAY_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}
      values.opsFast:
+        ["0x0e58939204eEDa84F796FBc86840A50af10eC4F4"]
      values.opsNoDelay:
+        ["0x826714adD4dDA2b8750794A467C892c0Cd49216b"]
      values.scNoDelay:
+        ["0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"]
      template:
+        "scroll/ScrollOwner"
      issuedPermissions:
+        [{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the L1ScrollMessenger fee vault address.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"revert unfinalized batches.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"add permissioned batchers and provers to the whitelist.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the minimum delay message queue parameters and enforced mode parameters.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"set ERC20 gateways in the L1GatewayRouter.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"pause the L1 -> L2 messenger and enforced transaction mode.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"remove permissioned batchers and provers to the whitelist, and update the sequencer address.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"upgrade all core contracts of the system.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"disable enforced batch mode.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update ScrollChain zk proof verifier.","via":[{"address":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"}]}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: Contract used to bridge WETH from L1 to L2.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.counterpart:
-        "0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9"
+        "scr:0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9"
      values.l2WETH:
-        "0x5300000000000000000000000000000000000004"
+        "scr:0x5300000000000000000000000000000000000004"
      template:
+        "scroll/L1WETHGateway"
      description:
+        "Contract used to bridge WETH from L1 to L2."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"scr"}}]
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
-   Status: DELETED
    contract L2ERC721GatewayFallback (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582)
    +++ description: None
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: Contract used to bridge ETH from L1 to L2.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.counterpart:
-        "0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
+        "scr:0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
      template:
+        "scroll/L1ETHGateway"
      description:
+        "Contract used to bridge ETH from L1 to L2."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"scr"}}]
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract TimelockEmergency (0x826714adD4dDA2b8750794A467C892c0Cd49216b) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      values.Canceller:
+        ["0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"]
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor:
+        ["0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"]
      values.getMinDelayFormatted:
+        "0s"
      values.Proposer:
+        ["0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"]
      values.timelockAdminAC:
+        ["0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","0x826714adD4dDA2b8750794A467C892c0Cd49216b"]
      template:
+        "scroll/L1Timelock"
      description:
+        "A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone."
      issuedPermissions:
+        [{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"propose transactions.","via":[]},{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"revert unfinalized batches."},{"permission":"interact","from":"0x826714adD4dDA2b8750794A467C892c0Cd49216b","description":"update the minimum delay and manage all access control roles of the timelock."},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"pause the L1 -> L2 messenger and enforced transaction mode."},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"remove permissioned batchers and provers to the whitelist, and update the sequencer address."}]
      fieldMeta:
+        {"Executor":{"severity":"HIGH","description":"Executing proposals is only open to all addresses if this resolves to the 0x0 address"}}
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract PlonkVerifierV2 (0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PlonkVerifierV2-1 (0x8c1b52757b5c571ADcB5572E992679d4D48e30f7) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Safe (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Scroll Multisig 4 (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Safe (0x9479ABfebefEea3c846163012a472b44F305b3d7) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      name:
-        "OLD_L2GasPriceOracle"
+        "L2GasPriceOracle"
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.estimateCrossDomainMessageFee:
+        [0,460000000,920000000,1380000000,1840000000]
      errors:
+        {"estimateCrossDomainMessageFee":"Processing error occurred."}
    }
```

```diff
    contract undefined (0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings.
      values.counterpart:
-        "0x9eBf2f33526CD571f8b2ad312492cb650870CFd6"
+        "scr:0x9eBf2f33526CD571f8b2ad312492cb650870CFd6"
      template:
+        "scroll/L1CustomERC20Gateway"
      description:
+        "Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"scr"}}]
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.provers:
-        ["0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c","0x74b286304576625557629C47E9E8702383D9eF92"]
      values.revertedBatches:
-        [275119,275120,275121,275122,275123,275124,275125,275126,275127,275128,275129,275130,275131,275132,275133,275134,275135,275136,275137,275138,275139,275140,275141,275142,275143,275144,275145,275146,275147,275148,275149,275150,275151,275152,275153,275154,275155,275156,275157,275158,275159,275160,275161,275162,275163,275164,275165,275166,275167,275168,275169,275170,275171,275172,275173,346818,346817,346816,346815]
      values.sequencers:
-        ["0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B","0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"]
      values.committedBatches:
+        ["0x5aaeb6101a47fc16866e80d77ffe090b6a7b3cf7d988be981646ab6aedfa2c42","0xaa8181f04f8e305328a6117fa6bc13fa2093a3c4c990c5281df95a1cb85ca18f","0x30d13ec2a06074f2048d64d85b62e1b4fb8f461d43bbd26099ef86d903c97399","0xe4bf15441d44aec723eff1ba7e80f9f5c6dbc46312471d0b23e297310870012f","0xcb24a337233a0d9a335e71a33637a8e42d71422c08ca6338572eb1e25e0f989a"]
      values.finalizedStateRoots:
+        ["0x08d535cc60f40af5dd3b31e0998d7567c2d568b224bed2ba26070aeb078d1339","0x2b3219c3d89d50b5aa4e56743c4e22501d34b885e468365ba3b1cc818297db74","0x2494e7866ed0b6e8cf87024c0036e53cf3d4a7cbe22f11d80f8fff36392463a0","0x18a3423e924e332986d81b32fbec1f1d21b1f7a8a706267fdf87ed18bc6dfff6","0x2d0336979e3bcd0ef4c4cde61d5ab5b14ee57b5f533152c459dc0e63bb1a7e1f"]
      values.isBatchFinalized:
+        [true,true,true,true,true]
      values.withdrawRoots:
+        ["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000","0x42b111e4bf3652280b54a2f4a5195aeab5db8f647e93d1725566be3f2f9aedc0","0x42b111e4bf3652280b54a2f4a5195aeab5db8f647e93d1725566be3f2f9aedc0"]
      errors:
+        {"committedBatches":"Processing error occurred.","finalizedStateRoots":"Processing error occurred.","isBatchFinalized":"Processing error occurred.","withdrawRoots":"Processing error occurred."}
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.counterpart:
-        "0x64CCBE37c9A82D85A1F2E74649b7A42923067988"
+        "scr:0x64CCBE37c9A82D85A1F2E74649b7A42923067988"
      template:
+        "scroll/L1CustomERC20Gateway"
      description:
+        "Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"scr"}}]
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: Contract used to bridge ERC1155 tokens from L1 to L2.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.counterpart:
-        "0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
+        "scr:0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
      template:
+        "scroll/L1ERC1155Gateway"
      description:
+        "Contract used to bridge ERC1155 tokens from L1 to L2."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"scr"}}]
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"revert unfinalized batches.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]},{"permission":"interact","from":"0x826714adD4dDA2b8750794A467C892c0Cd49216b","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]},{"permission":"interact","from":"0x826714adD4dDA2b8750794A467C892c0Cd49216b","description":"cancel queued transactions."},{"permission":"interact","from":"0x826714adD4dDA2b8750794A467C892c0Cd49216b","description":"update the minimum delay and manage all access control roles of the timelock."},{"permission":"interact","from":"0x826714adD4dDA2b8750794A467C892c0Cd49216b","description":"propose transactions."},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"pause the L1 -> L2 messenger and enforced transaction mode.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"remove permissioned batchers and provers to the whitelist, and update the sequencer address.","via":[{"address":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x826714adD4dDA2b8750794A467C892c0Cd49216b"}]
    }
```

```diff
    contract Safe (0xC3eA7C657884BB380B66D79C36aDCb5658b01896) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract L2TokenImplementationFallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69)
    +++ description: None
```

```diff
    contract ZkEvmVerifierV2-1 (0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PlonkVerifierPostEuclid (0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582) {
    +++ description: None
      name:
-        ""
+        "PlonkVerifierPostEuclid"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.counterpart:
-        "0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "scr:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
      values.l2TokenFactory:
-        "0x66e5312EDeEAef6e80759A0F789e7914Fb401484"
+        "scr:0x66e5312EDeEAef6e80759A0F789e7914Fb401484"
      values.l2TokenImplementation:
-        "0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
+        "scr:0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
      template:
+        "scroll/L1StandardERC20Gateway"
      description:
+        "Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"scr"}}]
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
-   Status: DELETED
    contract L2StandardERC20GatewayFallback (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A)
    +++ description: None
```

```diff
    contract undefined (0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      directlyReceivedPermissions.14:
-        {"permission":"upgrade","from":"0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"}
    }
```

```diff
    contract undefined (0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x826714adD4dDA2b8750794A467C892c0Cd49216b","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the L1ScrollMessenger fee vault address.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","from":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","description":"cancel queued transactions."},{"permission":"interact","from":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","description":"update the minimum delay and manage all access control roles of the timelock."},{"permission":"interact","from":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","description":"propose transactions."},{"permission":"interact","from":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"add permissioned batchers and provers to the whitelist.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"update the minimum delay message queue parameters and enforced mode parameters.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]},{"permission":"interact","from":"0x798576400F7D662961BA15C6b3F3d813447a26a6","description":"set ERC20 gateways in the L1GatewayRouter.","via":[{"address":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","delay":86400}]
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: Contract used to bridge USDC tokens from L1 to L2.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      values.counterpart:
-        "0x33B60d5Dd260d453cAC3782b0bDC01ce84672142"
+        "scr:0x33B60d5Dd260d453cAC3782b0bDC01ce84672142"
      values.l2USDC:
-        "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
+        "scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
      template:
+        "scroll/L1USDCGateway"
      description:
+        "Contract used to bridge USDC tokens from L1 to L2."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"scr"}}]
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x798576400F7D662961BA15C6b3F3d813447a26a6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      template:
+        "scroll/L1GatewayRouter"
      description:
+        "Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway."
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract undefined (0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract undefined (0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x826714adD4dDA2b8750794A467C892c0Cd49216b","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","from":"0x0e58939204eEDa84F796FBc86840A50af10eC4F4","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

Generated with discovered.json: 0x0e01527d127d533aa4b14eb56b065292878e5616

# Diff at Fri, 18 Apr 2025 18:06:50 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1dee5bc960c23f20e33ad3548023a46f9d9c2128 block: 22281836
- current block number: 22297562

## Description

Euclid batch number added.

## Watched changes

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.initialEuclidBatchIndex:
-        0
+        357915
    }
```

Generated with discovered.json: 0x22200622219b038faab9444767ffef0c4108759b

# Diff at Wed, 16 Apr 2025 13:25:02 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@db872d8b788e204aeb64e983eeb7178891d61d76 block: 22123508
- current block number: 22281836

## Description

Phase 1 of the Euclid upgrade.
- Upgraded ScrollChain implementation: new commit batch function supporting postEuclid → commitBatchWithBlobProof has a new implementation supporting new bach encoding versions until v6 (_commitBatchFromV2ToV6). Main change is the introduction of the BatchHeaderV3Codec new encoding.
- Updated verifier to the zkVM verifier for Phase 1
- Updated access in the ScrollOwner contract on L1, allowing SECURITY_COUNCIL_NO_DELAY role to call ScrollChain.finalizeEuclidInitialBatch

Next step is proposal of the migration block, followed by its Security Council approval (finalizeEuclidInitialBatch) and then execution of the Phase 2 transactions to complete the Euclid upgrade.

## Watched changes

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      values.latestVerifier.5:
+        {"startBatchIndex":0,"verifier":"0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247"}
      values.latestVerifier.4.verifier:
-        "0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247"
+        "0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB"
      values.latestVerifier.3.verifier:
-        "0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB"
+        "0x585DfaD7bF4099E011D185E266907A8ab60DAD2D"
      values.latestVerifier.2.verifier:
-        "0x585DfaD7bF4099E011D185E266907A8ab60DAD2D"
+        "0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3"
      values.legacyVerifiersLength.5:
+        0
      values.verifierVersions.5:
+        6
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.finalizeEuclidInitialBatch(bytes32):
+        ["SECURITY_COUNCIL_NO_DELAY_ROLE"]
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      sourceHashes.1:
-        "0x2069ff6eafc8fa79ae2c7e13a2618c44102f1f1b273cc5584e0b7cd3961948e1"
+        "0x2d7fa796a8274772f3ee8143549252719d97cf0dafeaf769802b66b51a195041"
      values.$implementation:
-        "0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"
+        "0x8f339292d2b3909574B2bEB051a613a987dB538f"
      values.$pastUpgrades.5:
+        ["2025-04-15T14:47:23.000Z","0xa1faad1ccd2c390641b46d50d93c26b7369137f021e528acfec78385494b2fb0",["0x8f339292d2b3909574B2bEB051a613a987dB538f"]]
      values.$upgradeCount:
-        5
+        6
      values.initialEuclidBatchIndex:
+        0
    }
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierPostEuclid (0x0112315Fa1c81c35ac9a477e161B52Ae4D1466B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582)
    +++ description: None
```

## Source code changes

```diff
.../ScrollChain/ScrollChain.sol                    | 945 ++++++++-------------
 .../ethereum/.flat/ZkEvmVerifierPostEuclid.sol     | 102 +++
 2 files changed, 453 insertions(+), 594 deletions(-)
```

Generated with discovered.json: 0x7516b67414bc24c4dcff6339a2858a557766be03

# Diff at Sun, 06 Apr 2025 08:18:52 GMT:

- chain: scroll
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 14332194
- current block number: 14489756

## Description

shhh.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14332194 (main branch discovery), not current.

```diff
    contract SCRToken (0xd29687c813D741E2F938F4aC377128810E217b1b) {
    +++ description: None
      values.clock:
-        14332194
    }
```

Generated with discovered.json: 0xf5f216ef4926d63c56829cc82f50e434797bdda6

# Diff at Mon, 31 Mar 2025 13:32:11 GMT:

- chain: scroll
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 14332194

## Description

L2 side first discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2MessageQueue (0x5300000000000000000000000000000000000000)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollStandardERC20Factory (0x66e5312EDeEAef6e80759A0F789e7914Fb401484)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0x69C2eD64171bF5737c2B78bdF722e68a032B2825)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ETHGateway (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ScrollMessenger (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0x9479ABfebefEea3c846163012a472b44F305b3d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0xC3eA7C657884BB380B66D79C36aDCb5658b01896)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollStandardERC20 (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SCRToken (0xd29687c813D741E2F938F4aC377128810E217b1b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProposalTypesConfigurator (0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E)
    +++ description: None
```

Generated with discovered.json: 0xd5b080877ee782c7bf9b0e92b9f4247e8379505a

# Diff at Tue, 25 Mar 2025 11:06:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 22029702
- current block number: 22123508

## Description

DEFAULT_ADMIN role removed from TimelockFast.

## Watched changes

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.roles.DEFAULT_ADMIN_ROLE.members.1:
-        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      values.accessControl.roles.DEFAULT_ADMIN_ROLE.members.0:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
    }
```

Generated with discovered.json: 0xd8d24a998c3d4f092c1b9efd94df8a28caa1f647

# Diff at Tue, 18 Mar 2025 08:13:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22029702
- current block number: 22029702

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22029702 (main branch discovery), not current.

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      name:
-        "SecurityCouncil"
+        "Scroll Security Council"
    }
```

```diff
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      name:
-        "ScrollExecutorMultisig"
+        "Scroll Multisig 1"
    }
```

```diff
    contract Scroll Multisig 4 (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      name:
-        "ScrollFeeVaultMultisig"
+        "Scroll Multisig 4"
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      name:
-        "ScrollEmergencyMultisig"
+        "Scroll Multisig 2"
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      name:
-        "ScrollOpsMultisig"
+        "Scroll Multisig 3"
    }
```

Generated with discovered.json: 0xf9f62321a78d0513bf4666cd50c5a957ff1bd664

# Diff at Wed, 12 Mar 2025 08:50:49 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f5d64c565c3cc90f1414096f72fffbafe42bc364 block: 21679349
- current block number: 22029702

## Description

MS signer change.

## Watched changes

```diff
    contract ScrollExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      values.$members.3:
-        "0x568993632c34604098e35a184C52aD390c70f754"
+        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
    }
```

```diff
-   Status: DELETED
    contract undefined (0x568993632c34604098e35a184C52aD390c70f754)
    +++ description: None
```

```diff
    contract ScrollEmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      values.$members.3:
-        "0x568993632c34604098e35a184C52aD390c70f754"
+        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
    }
```

```diff
+   Status: CREATED
    contract undefined (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5)
    +++ description: None
```

Generated with discovered.json: 0xefc1fea72b9603481851d16bfa38635f6782781e

# Diff at Tue, 04 Mar 2025 10:39:45 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21679349
- current block number: 21679349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21679349 (main branch discovery), not current.

```diff
    contract PlonkVerifierV1-1 (0x03a72B00D036C479105fF98A1953b15d9c510110) {
    +++ description: None
      sinceBlock:
+        20173741
    }
```

```diff
    contract TimelockSC (0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44) {
    +++ description: None
      sinceBlock:
+        21078719
    }
```

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      sinceBlock:
+        18306933
    }
```

```diff
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    +++ description: None
      sinceBlock:
+        18306947
    }
```

```diff
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F) {
    +++ description: None
      sinceBlock:
+        21225420
    }
```

```diff
    contract SecurityCouncil (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      sinceBlock:
+        21270585
    }
```

```diff
    contract ScrollExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      sinceBlock:
+        18296951
    }
```

```diff
    contract PlonkVerifierV1 (0x2293cd12e8564e8219d314b075867c2f66ac6941) {
    +++ description: None
      sinceBlock:
+        19638084
    }
```

```diff
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    +++ description: None
      sinceBlock:
+        18306933
    }
```

```diff
    contract ZkEvmVerifierV2 (0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB) {
    +++ description: None
      sinceBlock:
+        20460054
    }
```

```diff
    contract TimelockSlow (0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd) {
    +++ description: None
      sinceBlock:
+        21036143
    }
```

```diff
    contract ZkEvmVerifierV1 (0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247) {
    +++ description: None
      sinceBlock:
+        19638087
    }
```

```diff
    contract PlonkVerifierV0 (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    +++ description: None
      sinceBlock:
+        18306805
    }
```

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      sinceBlock:
+        20460107
    }
```

```diff
    contract ZkEvmVerifierV0 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    +++ description: None
      sinceBlock:
+        18306933
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      sinceBlock:
+        19909154
    }
```

```diff
    contract L2ERC1155GatewayFallback (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract ZkEvmVerifierV1-1 (0x63FB51C55d9605a75F8872C80De260a00fACfaA2) {
    +++ description: None
      sinceBlock:
+        20173752
    }
```

```diff
    contract L2CustomERC20GatewayFallback (0x64CCBE37c9A82D85A1F2E74649b7A42923067988) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      sinceBlock:
+        18318364
    }
```

```diff
    contract L2TokenFactoryFallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      sinceBlock:
+        18318330
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract Safe (0x69C2eD64171bF5737c2B78bdF722e68a032B2825) {
    +++ description: None
      sinceBlock:
+        21232661
    }
```

```diff
    contract L2ETHGatewayFallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract L2WETHGatewayFallback (0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract L2ScrollMessengerFallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      sinceBlock:
+        18306947
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract L2ERC721GatewayFallback (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract TimelockEmergency (0x826714adD4dDA2b8750794A467C892c0Cd49216b) {
    +++ description: None
      sinceBlock:
+        21078719
    }
```

```diff
    contract PlonkVerifierV2 (0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9) {
    +++ description: None
      sinceBlock:
+        20460053
    }
```

```diff
    contract PlonkVerifierV2-1 (0x8c1b52757b5c571ADcB5572E992679d4D48e30f7) {
    +++ description: None
      sinceBlock:
+        20631259
    }
```

```diff
    contract Safe (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC) {
    +++ description: None
      sinceBlock:
+        20937315
    }
```

```diff
    contract ScrollFeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      sinceBlock:
+        18296974
    }
```

```diff
    contract Safe (0x9479ABfebefEea3c846163012a472b44F305b3d7) {
    +++ description: None
      sinceBlock:
+        21078008
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      sinceBlock:
+        18306933
    }
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      sinceBlock:
+        19660037
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract ScrollEmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      sinceBlock:
+        18296928
    }
```

```diff
    contract Safe (0xC3eA7C657884BB380B66D79C36aDCb5658b01896) {
    +++ description: None
      sinceBlock:
+        21131603
    }
```

```diff
    contract L2TokenImplementationFallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract ZkEvmVerifierV2-1 (0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3) {
    +++ description: None
      sinceBlock:
+        20631260
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract L2StandardERC20GatewayFallback (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      sinceBlock:
+        18306933
    }
```

```diff
    contract ScrollOpsMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      sinceBlock:
+        18296825
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      sinceBlock:
+        18318268
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

Generated with discovered.json: 0xb7a977e772960aa9a1cfe2ed719fc9ab82319da0

# Diff at Wed, 26 Feb 2025 09:16:47 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@19452803941a301154c7aa617f3c2cc295e20731 block: 21679349
- current block number: 21679349

## Description

Config related: Add SC reference.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21679349 (main branch discovery), not current.

```diff
    contract SecurityCouncil (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      references:
+        [{"text":"Security Council members - Scroll Docs","href":"https://scroll.io/gov-docs/content/security-council"}]
    }
```

Generated with discovered.json: 0xea359131fd8dab35747ad6a95de93324df3503b5

# Diff at Mon, 27 Jan 2025 08:45:16 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@19f9c78c593bd40f9a0b28c3dce98eac1bd1d1b8 block: 21679349
- current block number: 21679349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21679349 (main branch discovery), not current.

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.revertedBatches.58:
-        {"batchIndex":346815}
+        346815
      values.revertedBatches.57:
-        {"batchIndex":346816}
+        346816
      values.revertedBatches.56:
-        {"batchIndex":346817}
+        346817
      values.revertedBatches.55:
-        {"batchIndex":346818}
+        346818
      values.revertedBatches.54:
-        {"batchIndex":275173}
+        275173
      values.revertedBatches.53:
-        {"batchIndex":275172}
+        275172
      values.revertedBatches.52:
-        {"batchIndex":275171}
+        275171
      values.revertedBatches.51:
-        {"batchIndex":275170}
+        275170
      values.revertedBatches.50:
-        {"batchIndex":275169}
+        275169
      values.revertedBatches.49:
-        {"batchIndex":275168}
+        275168
      values.revertedBatches.48:
-        {"batchIndex":275167}
+        275167
      values.revertedBatches.47:
-        {"batchIndex":275166}
+        275166
      values.revertedBatches.46:
-        {"batchIndex":275165}
+        275165
      values.revertedBatches.45:
-        {"batchIndex":275164}
+        275164
      values.revertedBatches.44:
-        {"batchIndex":275163}
+        275163
      values.revertedBatches.43:
-        {"batchIndex":275162}
+        275162
      values.revertedBatches.42:
-        {"batchIndex":275161}
+        275161
      values.revertedBatches.41:
-        {"batchIndex":275160}
+        275160
      values.revertedBatches.40:
-        {"batchIndex":275159}
+        275159
      values.revertedBatches.39:
-        {"batchIndex":275158}
+        275158
      values.revertedBatches.38:
-        {"batchIndex":275157}
+        275157
      values.revertedBatches.37:
-        {"batchIndex":275156}
+        275156
      values.revertedBatches.36:
-        {"batchIndex":275155}
+        275155
      values.revertedBatches.35:
-        {"batchIndex":275154}
+        275154
      values.revertedBatches.34:
-        {"batchIndex":275153}
+        275153
      values.revertedBatches.33:
-        {"batchIndex":275152}
+        275152
      values.revertedBatches.32:
-        {"batchIndex":275151}
+        275151
      values.revertedBatches.31:
-        {"batchIndex":275150}
+        275150
      values.revertedBatches.30:
-        {"batchIndex":275149}
+        275149
      values.revertedBatches.29:
-        {"batchIndex":275148}
+        275148
      values.revertedBatches.28:
-        {"batchIndex":275147}
+        275147
      values.revertedBatches.27:
-        {"batchIndex":275146}
+        275146
      values.revertedBatches.26:
-        {"batchIndex":275145}
+        275145
      values.revertedBatches.25:
-        {"batchIndex":275144}
+        275144
      values.revertedBatches.24:
-        {"batchIndex":275143}
+        275143
      values.revertedBatches.23:
-        {"batchIndex":275142}
+        275142
      values.revertedBatches.22:
-        {"batchIndex":275141}
+        275141
      values.revertedBatches.21:
-        {"batchIndex":275140}
+        275140
      values.revertedBatches.20:
-        {"batchIndex":275139}
+        275139
      values.revertedBatches.19:
-        {"batchIndex":275138}
+        275138
      values.revertedBatches.18:
-        {"batchIndex":275137}
+        275137
      values.revertedBatches.17:
-        {"batchIndex":275136}
+        275136
      values.revertedBatches.16:
-        {"batchIndex":275135}
+        275135
      values.revertedBatches.15:
-        {"batchIndex":275134}
+        275134
      values.revertedBatches.14:
-        {"batchIndex":275133}
+        275133
      values.revertedBatches.13:
-        {"batchIndex":275132}
+        275132
      values.revertedBatches.12:
-        {"batchIndex":275131}
+        275131
      values.revertedBatches.11:
-        {"batchIndex":275130}
+        275130
      values.revertedBatches.10:
-        {"batchIndex":275129}
+        275129
      values.revertedBatches.9:
-        {"batchIndex":275128}
+        275128
      values.revertedBatches.8:
-        {"batchIndex":275127}
+        275127
      values.revertedBatches.7:
-        {"batchIndex":275126}
+        275126
      values.revertedBatches.6:
-        {"batchIndex":275125}
+        275125
      values.revertedBatches.5:
-        {"batchIndex":275124}
+        275124
      values.revertedBatches.4:
-        {"batchIndex":275123}
+        275123
      values.revertedBatches.3:
-        {"batchIndex":275122}
+        275122
      values.revertedBatches.2:
-        {"batchIndex":275121}
+        275121
      values.revertedBatches.1:
-        {"batchIndex":275120}
+        275120
      values.revertedBatches.0:
-        {"batchIndex":275119}
+        275119
    }
```

Generated with discovered.json: 0x31eadc495ede66dd3cd8d8a251ac8367c850b8d9

# Diff at Wed, 22 Jan 2025 11:44:38 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 21579385
- current block number: 21679349

## Description

Gov update: Security Council added.

The ScrollOwner can be accessed by 4 Timelocks (see `l2b ui` and new contracts section):
- SC path (upgrade, ProxyAdmin owner): no delay, SecurityCouncil
- Slow path (ScrollOwner Admin -> manage all roles): 3d delay, SecurityCouncil
- Fast path (ops, configs): 1d delay, ScrollOpsMultisig + ScrollExecutorMultisig (!CURRENTLY ALSO ADDITIONAL SCROLLOWNER ADMIN!)
- Emergency Path (pause, revert batches, remove sequencers): no delay, ScrollEmergencyMultisig + ScrollExecutorMultisig

In summary: Current upgrades are either instant (SC) or 1d delay (ScrollOpsMultisig + ScrollExecutorMultisig). Pausing is instant (ScrollEmergencyMultisig + ScrollExecutorMultisig), ops are 1d delay (ScrollOpsMultisig + ScrollExecutorMultisig).

## Watched changes

```diff
-   Status: DELETED
    contract TimelockController (0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C)
    +++ description: None
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.roles.DEFAULT_ADMIN_ROLE.members.1:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      values.accessControl.roles.DEFAULT_ADMIN_ROLE.members.0:
-        "0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C"
+        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      values.accessControl.roles.SECURITY_COUNCIL_NO_DELAY_ROLE.members.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      values.accessControl.roles.SCROLL_MULTISIG_NO_DELAY_ROLE.members.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.accessControl.roles.EMERGENCY_MULTISIG_NO_DELAY_ROLE.members.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.accessControl.roles.TIMELOCK_1DAY_DELAY_TOLE.members.0:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      values.accessControl.roles.TIMELOCK_7DAY_DELAY_ROLE.members.0:
-        "0xDC1d1189Da69Ae2016E4976A43De20972D349B1b"
      values.accessControl.roles.emergency-nodelay:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x826714adD4dDA2b8750794A467C892c0Cd49216b"]}
      values.accessControl.roles.ops-fast:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x0e58939204eEDa84F796FBc86840A50af10eC4F4"]}
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.0x10d44583:
-        ["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.removeSequencer(address).1:
-        "EMERGENCY_MULTISIG_NO_DELAY_ROLE"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.removeSequencer(address).0:
-        "SCROLL_MULTISIG_NO_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.removeProver(address).1:
-        "EMERGENCY_MULTISIG_NO_DELAY_ROLE"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.removeProver(address).0:
-        "SCROLL_MULTISIG_NO_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.setPause(bool).1:
-        "EMERGENCY_MULTISIG_NO_DELAY_ROLE"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.setPause(bool).0:
-        "SCROLL_MULTISIG_NO_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.addSequencer(address).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.addProver(address).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.updateMaxNumTxInChunk(uint256).0:
-        "TIMELOCK_7DAY_DELAY_ROLE"
+        "ops-fast"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.revertBatch(bytes,bytes).1:
-        "EMERGENCY_MULTISIG_NO_DELAY_ROLE"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.revertBatch(bytes,bytes).0:
-        "SCROLL_MULTISIG_NO_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B.updateGasOracle(address):
-        ["TIMELOCK_1DAY_DELAY_TOLE"]
      values.accessControl.targets.0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B.updateMaxGasLimit(uint256).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.setPause(bool).1:
-        "EMERGENCY_MULTISIG_NO_DELAY_ROLE"
      values.accessControl.targets.0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.setPause(bool).0:
-        "SCROLL_MULTISIG_NO_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.updateMaxReplayTimes(uint256).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.updateFeeVault(address):
+        ["ops-fast"]
      values.accessControl.targets.0x987e300fDfb06093859358522a79098848C33852:
-        {"setIntrinsicParams(uint64,uint64,uint64,uint64)":["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]}
      values.accessControl.targets.0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37.updateWhitelistStatus(address[],bool).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "emergency-nodelay"
      values.accessControl.targets.0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0:
-        {"updateVerifier(uint64,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE","TIMELOCK_7DAY_DELAY_ROLE"]}
      values.accessControl.targets.0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6.setERC20Gateway(address[],address[]).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0xb2b10a289A229415a124EFDeF310C10cb004B6ff.updateTokenMapping(address,address).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B.updateTokenMapping(address,address).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6.updateTokenMapping(address,address).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B.updateCircleCaller(address).0:
-        "TIMELOCK_7DAY_DELAY_ROLE"
+        "ops-fast"
      values.accessControl.targets.0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B.pauseDeposit(bool).0:
-        "TIMELOCK_7DAY_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B.pauseWithdraw(bool).0:
-        "TIMELOCK_7DAY_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d:
-        {"setPause(bool)":["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]}
      values.accessControl.targets.0x1Ea29d57dAC237152d878758bAe4BeB2668998f6:
-        {"updateVerifier(uint256,uint64,address)":["TIMELOCK_7DAY_DELAY_ROLE","SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B:
-        {"updateVerifier(uint256,uint64,address)":["TIMELOCK_7DAY_DELAY_ROLE"]}
      values.accessControl.targets.0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4.setBatchConfig(address,(uint96,uint96,uint16,uint24,uint24)).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4.grantRole(bytes32,address):
+        ["ops-fast"]
      values.accessControl.targets.0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4.revokeRole(bytes32,address):
+        ["ops-fast"]
      values.accessControl.targets.0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F.updateVerifier(uint256,uint64,address).0:
-        "TIMELOCK_7DAY_DELAY_ROLE"
+        "SECURITY_COUNCIL_NO_DELAY_ROLE"
    }
```

```diff
-   Status: DELETED
    contract TimelockController (0xDC1d1189Da69Ae2016E4976A43De20972D349B1b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockSC (0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockSlow (0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x69C2eD64171bF5737c2B78bdF722e68a032B2825)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockEmergency (0x826714adD4dDA2b8750794A467C892c0Cd49216b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x9479ABfebefEea3c846163012a472b44F305b3d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0xC3eA7C657884BB380B66D79C36aDCb5658b01896)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GnosisSafeL2/GnosisSafeL2.sol   | 1032 +++++++++++++++++
 .../.flat/GnosisSafeL2/GnosisSafeProxy.p.sol       |   35 +
 .../Safe.sol                                       | 1088 +++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 +++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 +++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 +++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../scroll/ethereum/.flat/SecurityCouncil/Safe.sol | 1088 +++++++++++++++++
 .../ethereum/.flat/SecurityCouncil/SafeProxy.p.sol |   37 +
 .../TimelockEmergency.sol}                         |    2 +-
 .../TimelockSC.sol}                                |    2 +-
 .../scroll/ethereum/.flat/TimelockSlow.sol         | 1223 ++++++++++++++++++++
 15 files changed, 7917 insertions(+), 2 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579385 (main branch discovery), not current.

```diff
    contract TimelockController (0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C) {
    +++ description: None
      name:
-        "TimelockSlow"
+        "TimelockController"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_ADMIN_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C","0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]},"PROPOSER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]},"EXECUTOR_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"]},"CANCELLER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]}}
    }
```

```diff
    contract ScrollExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      name:
-        "ExecutorMultisig"
+        "ScrollExecutorMultisig"
    }
```

```diff
    contract ScrollFeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      name:
-        "FeeVaultMultisig"
+        "ScrollFeeVaultMultisig"
    }
```

```diff
    contract ScrollEmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      name:
-        "EmergencyMultisig"
+        "ScrollEmergencyMultisig"
    }
```

```diff
    contract TimelockController (0xDC1d1189Da69Ae2016E4976A43De20972D349B1b) {
    +++ description: None
      name:
-        "TimelockMid"
+        "TimelockController"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_ADMIN_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xDC1d1189Da69Ae2016E4976A43De20972D349B1b","0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]},"PROPOSER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]},"EXECUTOR_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"]},"CANCELLER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]}}
    }
```

```diff
    contract ScrollOpsMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      name:
-        "ScrollMultisig"
+        "ScrollOpsMultisig"
    }
```

Generated with discovered.json: 0xa59dbabba9ddd32f5a344a5e98932b5d437a2dfd

# Diff at Mon, 20 Jan 2025 11:10:01 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21579385
- current block number: 21579385

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579385 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      receivedPermissions.14.target:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      receivedPermissions.14.from:
+        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      receivedPermissions.13.target:
-        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      receivedPermissions.13.from:
+        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      receivedPermissions.12.target:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      receivedPermissions.12.from:
+        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      receivedPermissions.11.target:
-        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      receivedPermissions.11.from:
+        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      receivedPermissions.10.target:
-        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      receivedPermissions.10.from:
+        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      receivedPermissions.9.target:
-        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      receivedPermissions.9.from:
+        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      receivedPermissions.8.target:
-        "0x987e300fDfb06093859358522a79098848C33852"
      receivedPermissions.8.from:
+        "0x987e300fDfb06093859358522a79098848C33852"
      receivedPermissions.7.target:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      receivedPermissions.7.from:
+        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      receivedPermissions.6.target:
-        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      receivedPermissions.6.from:
+        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      receivedPermissions.5.target:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      receivedPermissions.5.from:
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      receivedPermissions.4.target:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      receivedPermissions.4.from:
+        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      receivedPermissions.3.target:
-        "0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
      receivedPermissions.3.from:
+        "0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
      receivedPermissions.2.target:
-        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      receivedPermissions.2.from:
+        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      receivedPermissions.1.target:
-        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
      receivedPermissions.1.from:
+        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
      receivedPermissions.0.target:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      receivedPermissions.0.from:
+        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      directlyReceivedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      directlyReceivedPermissions.0.from:
+        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      directlyReceivedPermissions.14.target:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      directlyReceivedPermissions.14.from:
+        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      directlyReceivedPermissions.13.target:
-        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      directlyReceivedPermissions.13.from:
+        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      directlyReceivedPermissions.12.target:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      directlyReceivedPermissions.12.from:
+        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      directlyReceivedPermissions.11.target:
-        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      directlyReceivedPermissions.11.from:
+        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      directlyReceivedPermissions.10.target:
-        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      directlyReceivedPermissions.10.from:
+        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      directlyReceivedPermissions.9.target:
-        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      directlyReceivedPermissions.9.from:
+        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      directlyReceivedPermissions.8.target:
-        "0x987e300fDfb06093859358522a79098848C33852"
      directlyReceivedPermissions.8.from:
+        "0x987e300fDfb06093859358522a79098848C33852"
      directlyReceivedPermissions.7.target:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      directlyReceivedPermissions.7.from:
+        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      directlyReceivedPermissions.6.target:
-        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      directlyReceivedPermissions.6.from:
+        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      directlyReceivedPermissions.5.target:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      directlyReceivedPermissions.5.from:
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      directlyReceivedPermissions.4.target:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      directlyReceivedPermissions.4.from:
+        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      directlyReceivedPermissions.3.target:
-        "0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
      directlyReceivedPermissions.3.from:
+        "0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
      directlyReceivedPermissions.2.target:
-        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      directlyReceivedPermissions.2.from:
+        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      directlyReceivedPermissions.1.target:
-        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
      directlyReceivedPermissions.1.from:
+        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
      directlyReceivedPermissions.0.target:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      directlyReceivedPermissions.0.from:
+        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

Generated with discovered.json: 0xc70e05862c6abe7b50a804ac14b44107cf695db0

# Diff at Fri, 10 Jan 2025 15:23:58 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@13c134b0211f75779d58c36868cbda90565479ce block: 21579385
- current block number: 21579385

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579385 (main branch discovery), not current.

```diff
    contract PlonkVerifierV1-1 (0x03a72B00D036C479105fF98A1953b15d9c510110) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0xc98f03651ddf430db5e0fa5d49b57551e01975529019ff3fbc1897109cd6dc9e"]
      references:
+        [{"text":"Source Code","href":"https://circuit-release.s3.us-west-2.amazonaws.com/release-v0.11.4/evm_verifier.yul"}]
    }
```

```diff
    contract PlonkVerifierV1 (0x2293cd12e8564e8219d314b075867c2f66ac6941) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0xcd6a67da07fdd0ff4f75a99bf03d70659a6a00d98f1219b1aff2756b7ce971bd"]
      references:
+        [{"text":"Source Code","href":"https://circuit-release.s3.us-west-2.amazonaws.com/release-v0.10.3/evm_verifier.yul"}]
    }
```

```diff
    contract PlonkVerifierV0 (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0x29ee0fd7e29697f9960266e0f8fc2b84b927300952d489ee40ea3cff695bd819"]
      references:
+        [{"text":"Source Code","href":"https://circuit-release.s3.us-west-2.amazonaws.com/release-v0.9.5/evm_verifier.yul"}]
    }
```

```diff
    contract PlonkVerifierV2 (0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0x438a888895bdfdd405a223087c58ce76dcd866a0c5e208b94c63e83922724cb3"]
      references:
+        [{"text":"Source Code","href":"https://github.com/scroll-tech/scroll-prover/blob/main/release-v0.12.0/evm_verifier.yul"}]
    }
```

```diff
    contract PlonkVerifierV2-1 (0x8c1b52757b5c571ADcB5572E992679d4D48e30f7) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0xdd6da115b0a4c879746bcca2a71fa1daa79f7e3a074369d9246f614b327e9322"]
      references:
+        [{"text":"Source Code","href":"https://github.com/scroll-tech/scroll-prover/blob/main/release-v0.13.0/evm_verifier.yul"}]
    }
```

Generated with discovered.json: 0x16c05b9aad122da9bb70b5a2bef9a422726b1ce1

# Diff at Wed, 08 Jan 2025 11:14:25 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21543805
- current block number: 21579385

## Description

One address removed from the whitelist (for actors that can set the l2 base fee on L1).

## Watched changes

```diff
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    +++ description: None
      values.whitelisted.1:
-        "0x3a2855ea96b2eb965568eA5d738B8DE185C717f4"
      values.whitelisted.0:
-        "0x21b8a9F5a4640c3FC13E19C48e776173e1210995"
+        "0x3a2855ea96b2eb965568eA5d738B8DE185C717f4"
    }
```

Generated with discovered.json: 0x92c5aa762d09f5cd371ec95e75a5e9d0e39f8600

# Diff at Fri, 03 Jan 2025 11:58:37 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f2f208ac8a91552305da5e03332108446838b892 block: 21465455
- current block number: 21543805

## Description

Scroll operator addresses removed / changed.

## Watched changes

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.provers.3:
-        "0x74b286304576625557629C47E9E8702383D9eF92"
      values.provers.2:
-        "0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c"
      values.provers.1:
-        "0x69d79Fc4Ae89E4DA80D719e26a435621F75B7f06"
+        "0x74b286304576625557629C47E9E8702383D9eF92"
      values.provers.0:
-        "0x356483dC32B004f32Ea0Ce58F7F88879886e9074"
+        "0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c"
      values.sequencers.3:
-        "0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"
      values.sequencers.2:
-        "0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B"
      values.sequencers.1:
-        "0x2ce8B4A516ebBc8B425764a867B742F76C2244c7"
+        "0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"
      values.sequencers.0:
-        "0xcF2898225ED05Be911D3709d9417e86E0b4Cfc8f"
+        "0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B"
    }
```

Generated with discovered.json: 0x384419632caf39432c39bdffcdd60bf8377b7b8d

# Diff at Mon, 23 Dec 2024 13:24:40 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21264288
- current block number: 21465455

## Description

2 provers, 2 sequencers added and one whitelisted address added (can relay l2 basefee on l1).

## Watched changes

```diff
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    +++ description: None
      values.whitelisted.1:
+        "0x3a2855ea96b2eb965568eA5d738B8DE185C717f4"
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.provers.3:
+        "0x74b286304576625557629C47E9E8702383D9eF92"
      values.provers.2:
+        "0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c"
      values.sequencers.3:
+        "0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"
      values.sequencers.2:
+        "0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B"
    }
```

Generated with discovered.json: 0x8805237f1312263093e4828c630a57292dd03616

# Diff at Mon, 25 Nov 2024 10:51:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@62a44faa52866a55f9881cb2852ac75b1fcc60b0 block: 21184190
- current block number: 21264288

## Description

Same one signer removed from ExecutorMultisig and EmergencyMultisig.

## Watched changes

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      values.$members.4:
-        "0x568993632c34604098e35a184C52aD390c70f754"
      values.$members.3:
-        "0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632"
+        "0x568993632c34604098e35a184C52aD390c70f754"
      values.multisigThreshold:
-        "1 of 5 (20%)"
+        "1 of 4 (25%)"
    }
```

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      values.$members.4:
-        "0x568993632c34604098e35a184C52aD390c70f754"
      values.$members.3:
-        "0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632"
+        "0x568993632c34604098e35a184C52aD390c70f754"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x8523c24bfac779038af8583a650b1aca37ec8f83

# Diff at Thu, 14 Nov 2024 06:38:22 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 20891049
- current block number: 21184190

## Description

Batches reverted due to accidental 'old-version batches'. The reverted batches used the old version 2 and not the new v4 `commitBatchWithBlobProof()`. The post-mortem should appear [here](https://status.scroll.io/incidents/pw1cf3bmxy8s).

In Scroll, batches can be reverted by the EmergencyMultisig anytime before they are proven (which currently happens around 2h after they are committed).

## Watched changes

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.revertedBatches.58:
+        {"batchIndex":346815}
      values.revertedBatches.57:
+        {"batchIndex":346816}
      values.revertedBatches.56:
+        {"batchIndex":346817}
      values.revertedBatches.55:
+        {"batchIndex":346818}
    }
```

Generated with discovered.json: 0x37b9192ba10b35d754cdfbbd94be1ecc543bce1d

# Diff at Mon, 21 Oct 2024 12:48:09 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20891049
- current block number: 20891049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20891049 (main branch discovery), not current.

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      descriptions:
-        ["Used to update the verifier and keep track of current and old versions."]
      description:
+        "Used to update the verifier and keep track of current and old versions."
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      descriptions:
-        ["Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role."]
      description:
+        "Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role."
    }
```

Generated with discovered.json: 0x9a42cb161d5a63ef5379e507db48f193259f9917

# Diff at Mon, 21 Oct 2024 11:09:54 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20891049
- current block number: 20891049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20891049 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x137CC585F607EDeBBc3CA6360AffCFeab507B374"]
      values.$pastUpgrades.2.1:
-        ["0x137CC585F607EDeBBc3CA6360AffCFeab507B374"]
+        "0x3928e0223337a112ea68c84db95441185a3e1da809638be13c0135761aa19ee7"
      values.$pastUpgrades.1.2:
+        ["0xeBaed7A81c298B24EE6d59c22698A951dc448E01"]
      values.$pastUpgrades.1.1:
-        ["0xeBaed7A81c298B24EE6d59c22698A951dc448E01"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xBC9D741501A20F962756C95BF906b4abffadcf8F"]
      values.$pastUpgrades.0.1:
-        ["0xBC9D741501A20F962756C95BF906b4abffadcf8F"]
+        "0xdd4c82f4c38c76c6bb222f2b319e870ed48d8d4dc2a73e0baa5d560a286924b2"
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x7999cdD5E2893475D89211A2E3FdA67a841E3233"]
      values.$pastUpgrades.1.1:
-        ["0x7999cdD5E2893475D89211A2E3FdA67a841E3233"]
+        "0x3ee1ca7b7a92d6181b5a38859b4ae747c6fb4b42e4407c3a854f55b82564aba1"
      values.$pastUpgrades.0.2:
+        ["0xFAf8f72e54d1089fa1882b6f597BfDFF59a8AFca"]
      values.$pastUpgrades.0.1:
-        ["0xFAf8f72e54d1089fa1882b6f597BfDFF59a8AFca"]
+        "0x56e31c0072f983bfee035b6bf464b53b9d998afab20e0046cdc3fc209b4a191e"
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xd1841c5756428812233eEA78afC17cb2D3e392bb"]
      values.$pastUpgrades.1.1:
-        ["0xd1841c5756428812233eEA78afC17cb2D3e392bb"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"]
      values.$pastUpgrades.0.1:
-        ["0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"]
+        "0x5cb06c63fb2583db9eba85a73ca794a9d36eace7f91925962b8cc97fd06b9b7d"
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xF4f2066EE72D62e3caF9678459149BA7FCf2262F"]
      values.$pastUpgrades.1.1:
-        ["0xF4f2066EE72D62e3caF9678459149BA7FCf2262F"]
+        "0xd755174ba6bacec85b68b77c9ec2a8b966955746be59a6efa932f47c37dda482"
      values.$pastUpgrades.0.2:
+        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
      values.$pastUpgrades.0.1:
-        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
+        "0xec5c25ea4b3e6d1dc9fa4cb7b7dd37a7a245a171cd3d16fb312628b5ecc9e841"
    }
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
      values.$pastUpgrades.0.1:
-        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
+        "0x9776779beb429ea826a81a8c1c5f782933bfc8ce568afa1c6f2c2b866be2a3a5"
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"]
      values.$pastUpgrades.1.1:
-        ["0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"]
      values.$pastUpgrades.0.1:
-        ["0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"]
+        "0xcad9f31340db6aca3a5da0d704ee33a9b6c43a5b1be4406cc0ed33edbdd7c92e"
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x642af405bF64660665B37977449C9C536B806318"]
      values.$pastUpgrades.0.1:
-        ["0x642af405bF64660665B37977449C9C536B806318"]
+        "0xd2e3c3d2839a35492419c5a1ae863e7a23d963cb4853c59e8e20832e0ee4ed3e"
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"]
      values.$pastUpgrades.1.1:
-        ["0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xd3c42158682D55E082EaBe08a29F7515A97cA307"]
      values.$pastUpgrades.0.1:
-        ["0xd3c42158682D55E082EaBe08a29F7515A97cA307"]
+        "0x0f1df3c211e6b201b0bb0cc41c87c2fbb36683f2a24080d935ffdc587723c033"
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x546E0bF31FB6e7babD493452e4e6999191367B42"]
      values.$pastUpgrades.1.1:
-        ["0x546E0bF31FB6e7babD493452e4e6999191367B42"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"]
      values.$pastUpgrades.0.1:
-        ["0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"]
+        "0xbd63d1902c6343a9cdb81aa8944621690e4dd62a82640fded7f7c3d969e3647a"
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xfDF1eE0098168eaa61BF87Db68C39c85151a4E9E"]
      values.$pastUpgrades.0.1:
-        ["0xfDF1eE0098168eaa61BF87Db68C39c85151a4E9E"]
+        "0xf25a4fbbd1569b188ce8855ff12760904d976be976c35afeb4abd9566db5ca38"
    }
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]
      values.$pastUpgrades.2.1:
-        ["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]
+        "0xb367f770c26a72ea837a51c2c1fc84a3396914db1d58c020177b207e0f876a79"
      values.$pastUpgrades.1.2:
+        ["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]
      values.$pastUpgrades.1.1:
-        ["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]
+        "0xe03abd155a10591ed1fa4a1e2ad0d6042549bfd67769dbf6bd66d25743950905"
      values.$pastUpgrades.0.2:
+        ["0xc4d46E8402F476F269c379677C99F18E22Ea030e"]
      values.$pastUpgrades.0.1:
-        ["0xc4d46E8402F476F269c379677C99F18E22Ea030e"]
+        "0xa2ff9275d6280e3cc298653463c5d8423c44cfbc66a52a9a138becbb106dc0f8"
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"]
      values.$pastUpgrades.4.1:
-        ["0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"]
+        "0x3928e0223337a112ea68c84db95441185a3e1da809638be13c0135761aa19ee7"
      values.$pastUpgrades.3.2:
+        ["0x4F250B05262240C787a1eE222687C6eC395C628A"]
      values.$pastUpgrades.3.1:
-        ["0x4F250B05262240C787a1eE222687C6eC395C628A"]
+        "0x87f533704b3cdac75c20bbdcd202a97ee62075c188ccea27ab7ff494cdeea247"
      values.$pastUpgrades.2.2:
+        ["0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"]
      values.$pastUpgrades.2.1:
-        ["0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"]
+        "0x6eb161ed649cf22771e586a8546eec157717e2dec4c871e7ad4e4d2c5c59a905"
      values.$pastUpgrades.1.2:
+        ["0xFA148514d03420b7b1a13eC74da06D2Ca875539C"]
      values.$pastUpgrades.1.1:
-        ["0xFA148514d03420b7b1a13eC74da06D2Ca875539C"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"]
      values.$pastUpgrades.0.1:
-        ["0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"]
+        "0xecc94033ca66ea9068acde109b0c9e3c539191645916a35952bb6d9fd2be3a02"
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"]
      values.$pastUpgrades.1.1:
-        ["0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
      values.$pastUpgrades.0.1:
-        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
+        "0x12f874f5ca5a8dbdc5162db5179a4e4b753f4fcff8dab3f416bd1ce707ecb9ff"
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x244BF7aEf29F03916569470a51fA0794B62F8cd7"]
      values.$pastUpgrades.1.1:
-        ["0x244BF7aEf29F03916569470a51fA0794B62F8cd7"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xCb4638620E4C6DeCef26374e71b0dd4871863593"]
      values.$pastUpgrades.0.1:
-        ["0xCb4638620E4C6DeCef26374e71b0dd4871863593"]
+        "0xe6cabeddb49c286b33e0e6d4a43af76e1a2108ac9fc91afb508a5ea86a8fc646"
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"]
      values.$pastUpgrades.1.1:
-        ["0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0x9218732389D80f9b8723C3f32a38865B7a63564A"]
      values.$pastUpgrades.0.1:
-        ["0x9218732389D80f9b8723C3f32a38865B7a63564A"]
+        "0x85d366c40632340d9e835fdd0a1646909a56d60c680373f15f9d36878ff13029"
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"]
      values.$pastUpgrades.1.1:
-        ["0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0x6667123b5017AAB9945F73345848B82D7A953AA8"]
      values.$pastUpgrades.0.1:
-        ["0x6667123b5017AAB9945F73345848B82D7A953AA8"]
+        "0x394b36151c614a7dfd048ddc1085046d2a50e5fd54af4c335d4a08aa79dd773d"
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xb93Ac04010Bd61F45BF492022A5b49a902F798F3"]
      values.$pastUpgrades.0.1:
-        ["0xb93Ac04010Bd61F45BF492022A5b49a902F798F3"]
+        "0x8f6851c707737c446ee55f39be1442ce8cfa50ef8522b34bac247c0bb39a14ec"
    }
```

Generated with discovered.json: 0xafd1c1ddac67caddf5e22e82e7cc0db2def73728

# Diff at Mon, 14 Oct 2024 10:55:22 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20891049
- current block number: 20891049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20891049 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x3e38728c8eff2d4e99a76036010214e6ece1aebfa85496f776910c3e674d90e0"]
    }
```

```diff
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    +++ description: None
      sourceHashes:
+        ["0x9dd794c91c0c92b8b8129a7c4d61c361b75602f161dc7b58f5908edafb920049"]
    }
```

```diff
    contract TimelockSlow (0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C) {
    +++ description: None
      sourceHashes:
+        ["0x9dd794c91c0c92b8b8129a7c4d61c361b75602f161dc7b58f5908edafb920049"]
    }
```

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    +++ description: None
      sourceHashes:
+        ["0x118a84c5ed8e5625f8df5325e4bd028d66a65a2d08b9b7d3b72b6c9f7a955e95"]
    }
```

```diff
    contract ZkEvmVerifierV2 (0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB) {
    +++ description: None
      sourceHashes:
+        ["0xa3e375ce1143ce7410edcfff2fbfa0ee90c06ef0710c4f11af9533ca40cdbb61"]
    }
```

```diff
    contract ZkEvmVerifierV1 (0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247) {
    +++ description: None
      sourceHashes:
+        ["0xac7d02f7eaff4b15c79e0507b392db7e05fbf7f5f5a594a7b091a936d951bb3a"]
    }
```

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      sourceHashes:
+        ["0x6e45af76d6f6e2d8cc55ec530468293a0af33a8ab5e385883527a3330ff21ed6"]
    }
```

```diff
    contract ZkEvmVerifierV0 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    +++ description: None
      sourceHashes:
+        ["0xac7d02f7eaff4b15c79e0507b392db7e05fbf7f5f5a594a7b091a936d951bb3a"]
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xcba3cc3603700feae97964e6eff747508e82a958b820d7d48c7f7399faf4d771"]
    }
```

```diff
    contract L2ERC1155GatewayFallback (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x2a543ae77e08fc2293b99836986b16db46b713eb958556cd1c95fcabce559b4b"]
    }
```

```diff
    contract ZkEvmVerifierV1-1 (0x63FB51C55d9605a75F8872C80De260a00fACfaA2) {
    +++ description: None
      sourceHashes:
+        ["0xac7d02f7eaff4b15c79e0507b392db7e05fbf7f5f5a594a7b091a936d951bb3a"]
    }
```

```diff
    contract L2CustomERC20GatewayFallback (0x64CCBE37c9A82D85A1F2E74649b7A42923067988) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x255712204c1736d1d147513fc6d0ded282eb2cd0cff359e7710a06463935c260"]
    }
```

```diff
    contract L2TokenFactoryFallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x5d09a2c78d20d4e9f61774a32aa4da8e74be21a247188625d5eeffdac11e5eb4"]
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xe550fda323606a4b4fd2a05cf45dda231290e1d57a077828632c098fa0579161"]
    }
```

```diff
    contract L2ETHGatewayFallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract L2WETHGatewayFallback (0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xcb83aeace6c4751da7d9340ffa2eff5c9c9fdf2e9c1f25d6bc2f31ffabfcb477"]
    }
```

```diff
    contract L2ScrollMessengerFallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      sourceHashes:
+        ["0x92fd37cca83c3ecf2b4b1343a3287484d39591016bdd853e572e12c286c0d952"]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x67260A8B73C5B77B55c1805218A42A7A6F98F515","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x7F2b8C31F88B6006c382775eea88297Ec1e3E905","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x987e300fDfb06093859358522a79098848C33852","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xa13BAF47339d63B743e7Da8741db5456DAc1E556","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xb2b10a289A229415a124EFDeF310C10cb004B6ff","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xb90cab5924c6894e3047536242125cdface40857b9c70a6551210bc6de166b42"]
    }
```

```diff
    contract L2ERC721GatewayFallback (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xa874514fbf17dc321480a8270dcdc3a5a0d9b8e37ff5de1187df641cd4a2f6e4"]
    }
```

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x5987f713ef726c459b82ad7473f780457f91510e0d04802551136d8133e531d1"]
    }
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xe564c04903b37a6ee36ca18aeb567c15ce70fe0a8022621e7c93c833bc2fbbf3"]
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x2069ff6eafc8fa79ae2c7e13a2618c44102f1f1b273cc5584e0b7cd3961948e1"]
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xe564c04903b37a6ee36ca18aeb567c15ce70fe0a8022621e7c93c833bc2fbbf3"]
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x35e9a9e7a691f357e642a73662c88a202224b73a44fc022f833ccc8aff9a4a64"]
    }
```

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L2TokenImplementationFallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract ZkEvmVerifierV2-1 (0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3) {
    +++ description: None
      sourceHashes:
+        ["0xa3e375ce1143ce7410edcfff2fbfa0ee90c06ef0710c4f11af9533ca40cdbb61"]
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x93fe70d828e5646f5acb7768083ab2e5b9cfb5b6691a5dff48ff3c188ffd05a7"]
    }
```

```diff
    contract TimelockMid (0xDC1d1189Da69Ae2016E4976A43De20972D349B1b) {
    +++ description: None
      sourceHashes:
+        ["0x9dd794c91c0c92b8b8129a7c4d61c361b75602f161dc7b58f5908edafb920049"]
    }
```

```diff
    contract L2StandardERC20GatewayFallback (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"},{"permission":"upgrade","target":"0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"},{"permission":"upgrade","target":"0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"},{"permission":"upgrade","target":"0x67260A8B73C5B77B55c1805218A42A7A6F98F515"},{"permission":"upgrade","target":"0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"},{"permission":"upgrade","target":"0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"},{"permission":"upgrade","target":"0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"},{"permission":"upgrade","target":"0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"},{"permission":"upgrade","target":"0x987e300fDfb06093859358522a79098848C33852"},{"permission":"upgrade","target":"0xa13BAF47339d63B743e7Da8741db5456DAc1E556"},{"permission":"upgrade","target":"0xb2b10a289A229415a124EFDeF310C10cb004B6ff"},{"permission":"upgrade","target":"0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"},{"permission":"upgrade","target":"0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"},{"permission":"upgrade","target":"0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"},{"permission":"upgrade","target":"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"},{"permission":"upgrade","target":"0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"},{"permission":"upgrade","target":"0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"},{"permission":"upgrade","target":"0x67260A8B73C5B77B55c1805218A42A7A6F98F515"},{"permission":"upgrade","target":"0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"},{"permission":"upgrade","target":"0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"},{"permission":"upgrade","target":"0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"},{"permission":"upgrade","target":"0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"},{"permission":"upgrade","target":"0x987e300fDfb06093859358522a79098848C33852"},{"permission":"upgrade","target":"0xa13BAF47339d63B743e7Da8741db5456DAc1E556"},{"permission":"upgrade","target":"0xb2b10a289A229415a124EFDeF310C10cb004B6ff"},{"permission":"upgrade","target":"0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"},{"permission":"upgrade","target":"0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"},{"permission":"upgrade","target":"0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"},{"permission":"upgrade","target":"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"}]
    }
```

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x390ebeb0e223ceead94e94a21c34b8bc5bde0351a7c29ca6b8abb4776ce58524"]
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x3257fd4336e925899e6352562238124ef46e51d144d4a4d12526837be49a062f"]
    }
```

Generated with discovered.json: 0x733494d407e555a98739d03978d0302e5362a2a4

# Diff at Fri, 04 Oct 2024 08:46:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@000446ee962492b0a3a917c3f907d3277663f719 block: 20847193
- current block number: 20891049

## Description

Hide external escrow governance.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20847193 (main branch discovery), not current.

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCC2C53556Bc75217cf698721b29071d6f12628A9","via":[]}]
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x9eBf2f33526CD571f8b2ad312492cb650870CFd6)
    +++ description: None
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x9eBf2f33526CD571f8b2ad312492cb650870CFd6","via":[]}]
    }
```

```diff
-   Status: DELETED
    contract PufferFinanceOpsMultisig (0xC0896ab1A8cae8c2C1d27d011eb955Cca955580d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract wstETHescrowLidoProxyAdmin (0xCC2C53556Bc75217cf698721b29071d6f12628A9)
    +++ description: None
```

Generated with discovered.json: 0x5d92e37e7058817c7609154f19f728454dc8c25e

# Diff at Tue, 01 Oct 2024 10:54:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20847193
- current block number: 20847193

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20847193 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:11.000Z",["0xBC9D741501A20F962756C95BF906b4abffadcf8F"]],["2024-02-22T08:20:23.000Z",["0xeBaed7A81c298B24EE6d59c22698A951dc448E01"]],["2024-08-20T23:36:35.000Z",["0x137CC585F607EDeBBc3CA6360AffCFeab507B374"]]]
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-20T05:48:59.000Z",["0xFAf8f72e54d1089fa1882b6f597BfDFF59a8AFca"]],["2024-05-20T06:38:59.000Z",["0x7999cdD5E2893475D89211A2E3FdA67a841E3233"]]]
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"]],["2024-02-22T08:20:23.000Z",["0xd1841c5756428812233eEA78afC17cb2D3e392bb"]]]
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-10T06:48:23.000Z",["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]],["2024-03-05T07:48:59.000Z",["0xF4f2066EE72D62e3caF9678459149BA7FCf2262F"]]]
    }
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-10T06:41:35.000Z",["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]]]
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"]],["2024-02-22T08:20:23.000Z",["0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"]]]
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0x642af405bF64660665B37977449C9C536B806318"]]]
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xd3c42158682D55E082EaBe08a29F7515A97cA307"]],["2024-02-22T08:20:23.000Z",["0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"]]]
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"]],["2024-02-22T08:20:23.000Z",["0x546E0bF31FB6e7babD493452e4e6999191367B42"]]]
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:11.000Z",["0xfDF1eE0098168eaa61BF87Db68C39c85151a4E9E"]]]
    }
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-15T09:31:47.000Z",["0xc4d46E8402F476F269c379677C99F18E22Ea030e"]],["2024-04-15T09:31:47.000Z",["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]],["2024-04-15T09:31:47.000Z",["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]]]
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"]],["2024-02-22T08:20:23.000Z",["0xFA148514d03420b7b1a13eC74da06D2Ca875539C"]],["2024-04-28T22:06:35.000Z",["0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"]],["2024-07-02T10:10:47.000Z",["0x4F250B05262240C787a1eE222687C6eC395C628A"]],["2024-08-20T23:36:35.000Z",["0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"]]]
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]],["2024-02-22T08:20:23.000Z",["0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"]]]
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xCb4638620E4C6DeCef26374e71b0dd4871863593"]],["2024-02-22T08:20:23.000Z",["0x244BF7aEf29F03916569470a51fA0794B62F8cd7"]]]
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0x9218732389D80f9b8723C3f32a38865B7a63564A"]],["2024-02-22T08:20:23.000Z",["0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"]]]
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-10T06:29:11.000Z",["0x6667123b5017AAB9945F73345848B82D7A953AA8"]],["2024-02-22T08:20:23.000Z",["0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"]]]
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xb93Ac04010Bd61F45BF492022A5b49a902F798F3"]]]
    }
```

Generated with discovered.json: 0x1138ed1c264dc3d7d38d5979f5b35487ff768d7b

# Diff at Sat, 28 Sep 2024 05:59:58 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f2cc4f81d34dcc94ba050327e26d02cce77f37f4 block: 20842760
- current block number: 20847193

## Description

Rename pufETHEscrow (external), fix references, single signer change in Executor- and EmergencyMultisig.

## Watched changes

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      values.$members.4:
-        "0xdA66Df3920091eF4B54782B9463587c314DAdD41"
+        "0x568993632c34604098e35a184C52aD390c70f754"
    }
```

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      values.$members.4:
-        "0xdA66Df3920091eF4B54782B9463587c314DAdD41"
+        "0x568993632c34604098e35a184C52aD390c70f754"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842760 (main branch discovery), not current.

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      name:
-        "pufEthEscrow"
+        "pufETHEscrow"
    }
```

Generated with discovered.json: 0xe6b73b280820baf18ebcfc54742ab25d435f0f0d

# Diff at Fri, 27 Sep 2024 15:09:56 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20725971
- current block number: 20842760

## Description

Add DAI escrow, upgradeable by ScrollMultisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20725971 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      receivedPermissions.14:
+        {"permission":"upgrade","target":"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"}
      receivedPermissions.13.target:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      receivedPermissions.12.target:
-        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
+        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      receivedPermissions.11.target:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
+        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      receivedPermissions.10.target:
-        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
+        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      receivedPermissions.9.target:
-        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
+        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      receivedPermissions.8.target:
-        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
+        "0x987e300fDfb06093859358522a79098848C33852"
      receivedPermissions.7.target:
-        "0x987e300fDfb06093859358522a79098848C33852"
+        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      receivedPermissions.6.target:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
+        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      receivedPermissions.5.target:
-        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      receivedPermissions.4.target:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
+        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      receivedPermissions.3.target:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
    }
```

```diff
+   Status: CREATED
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515)
    +++ description: None
```

Generated with discovered.json: 0x6b5bd6fa0124dd6da49839e5d834a8f046e373fe

# Diff at Wed, 11 Sep 2024 07:47:40 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@407590ebfbad0b4f799badc3ad5fce90a7eaed11 block: 20670849
- current block number: 20725971

## Description

The revertBatch() target is added to the ScrollOwner accesscontrol after our message to the team. Additionally, the 1d timelock is added as an Admin to the ScrollOwner.

## Watched changes

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.roles.DEFAULT_ADMIN_ROLE.members.1:
+        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.revertBatch(bytes,bytes):
+        ["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]
    }
```

Generated with discovered.json: 0xf927951961dafb58ba0045cdf101156aeff92873

# Diff at Tue, 03 Sep 2024 15:09:19 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@8b201382220336bea7cda6fb789ab7a680e53200 block: 20590985
- current block number: 20670849

## Description

[DarwinV2 upgrade](https://github.com/scroll-tech/go-ethereum/releases/tag/scroll-v5.7.0): This security patch adds a fallback for the case where blocks cannot be compressed under the new compression scheme (Darwin Upgrade). These are now posted as uncompressed blobs.

The verifier is therefore changed to a new ZkEvmVerifierV2 (code-identical) and a new PlonkVerifier.

MultipleVersionRollupVerifier owner is changed from ScrollMultisig to ScrollOwner.

## Watched changes

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      values.latestVerifier.4:
+        {"startBatchIndex":0,"verifier":"0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3"}
      values.legacyVerifiersLength.4:
+        0
      values.owner:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.verifierVersions.4:
+        4
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifierV2-1 (0x8c1b52757b5c571ADcB5572E992679d4D48e30f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV2-1 (0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3)
    +++ description: None
```

## Source code changes

```diff
.../scroll/ethereum/.flat/ZkEvmVerifierV2-1.sol    | 108 +++++++++++++++++++++
 1 file changed, 108 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20590985 (main branch discovery), not current.

```diff
    contract PlonkVerifierV1-1 (0x03a72B00D036C479105fF98A1953b15d9c510110) {
    +++ description: None
      name:
-        "PlonkVerifierV2"
+        "PlonkVerifierV1-1"
    }
```

```diff
    contract PlonkVerifierV2 (0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9) {
    +++ description: None
      name:
-        "PlonkVerifierV3"
+        "PlonkVerifierV2"
    }
```

Generated with discovered.json: 0x146a15784cddb895f4356aab30b34d927f77049f

# Diff at Fri, 30 Aug 2024 07:57:47 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20590985
- current block number: 20590985

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20590985 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x9eBf2f33526CD571f8b2ad312492cb650870CFd6) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract wstETHescrowLidoProxyAdmin (0xCC2C53556Bc75217cf698721b29071d6f12628A9) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      receivedPermissions.13.via:
-        []
      receivedPermissions.12.via:
-        []
      receivedPermissions.11.via:
-        []
      receivedPermissions.10.via:
-        []
      receivedPermissions.9.via:
-        []
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x04b22e7cd5dcc1270057a5de114bb00e998fb6d1

# Diff at Fri, 23 Aug 2024 11:25:14 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1505b6595f98344175251e27ce434d0a44eeefa4 block: 20369470
- current block number: 20590985

## Description

Scroll can now prove bundles (i.e. multiple DA submissions) in a single proof. Full changelog: <https://scroll.io/blog/proof-recursion-scrolls-darwin-upgrade>. It also seems to have forgotten to update a permission for the new `revertBatch` function sig, they have been notified.

## Watched changes

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      values.$implementation:
-        "0xeBaed7A81c298B24EE6d59c22698A951dc448E01"
+        "0x137CC585F607EDeBBc3CA6360AffCFeab507B374"
      values.$upgradeCount:
-        2
+        3
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.revertBatch(bytes,uint256):
-        ["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.0x10d44583:
+        ["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]
      values.accessControl.targets.0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F:
+        {"updateVerifier(uint256,uint64,address)":["TIMELOCK_7DAY_DELAY_ROLE"]}
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.$implementation:
-        "0x4F250B05262240C787a1eE222687C6eC395C628A"
+        "0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"
      values.$upgradeCount:
-        4
+        5
      values.verifier:
-        "0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B"
+        "0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F"
    }
```

```diff
-   Status: DELETED
    contract MultipleVersionRollupVerifier (0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV2 (0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F)
    +++ description: Used to update the verifier and keep track of current and old versions.
```

```diff
+   Status: CREATED
    contract PlonkVerifierV3 (0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9)
    +++ description: None
```

## Source code changes

```diff
.../L1MessageQueueWithGasPriceOracle.sol           |  91 +-
 .../MultipleVersionRollupVerifier.sol              |  28 +-
 .../ScrollChain/ScrollChain.sol                    | 982 +++++++++++++--------
 .../scroll/ethereum/.flat/ZkEvmVerifierV2.sol      | 108 +++
 4 files changed, 812 insertions(+), 397 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract MultipleVersionRollupVerifier (0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B) {
    +++ description: None
      descriptions:
-        ["Used to update the verifier and keep track of current and old versions."]
      errors:
+        {"latestVerifier":"Too many values. Update configuration to explore fully","legacyVerifiersLength":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0x95207ea1348314a8bec2c992ec6b27e54c1107cc

# Diff at Fri, 23 Aug 2024 09:55:13 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20369470
- current block number: 20369470

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract pufEthEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x7abca15987bdd3cc1c67142350cc77260caaa885

# Diff at Wed, 21 Aug 2024 10:05:37 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20369470
- current block number: 20369470

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC2C53556Bc75217cf698721b29071d6f12628A9","via":[]}]
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x9eBf2f33526CD571f8b2ad312492cb650870CFd6) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xA033Ff09f2da45f0e9ae495f525363722Df42b2a"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xA033Ff09f2da45f0e9ae495f525363722Df42b2a","via":[]}]
    }
```

```diff
    contract pufEthEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9eBf2f33526CD571f8b2ad312492cb650870CFd6","via":[]}]
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract wstETHescrowLidoProxyAdmin (0xCC2C53556Bc75217cf698721b29071d6f12628A9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x6625C6332c9F91F2D27c304E729B86db87A3f504"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x6625C6332c9F91F2D27c304E729B86db87A3f504","via":[]}]
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B","0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4","0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B","0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367","0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d","0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","0x7F2b8C31F88B6006c382775eea88297Ec1e3E905","0x987e300fDfb06093859358522a79098848C33852","0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9","0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6","0xa13BAF47339d63B743e7Da8741db5456DAc1E556","0xb2b10a289A229415a124EFDeF310C10cb004B6ff","0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6","0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B","via":[]},{"permission":"upgrade","target":"0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4","via":[]},{"permission":"upgrade","target":"0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B","via":[]},{"permission":"upgrade","target":"0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367","via":[]},{"permission":"upgrade","target":"0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d","via":[]},{"permission":"upgrade","target":"0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","via":[]},{"permission":"upgrade","target":"0x7F2b8C31F88B6006c382775eea88297Ec1e3E905","via":[]},{"permission":"upgrade","target":"0x987e300fDfb06093859358522a79098848C33852","via":[]},{"permission":"upgrade","target":"0xa13BAF47339d63B743e7Da8741db5456DAc1E556","via":[]},{"permission":"upgrade","target":"0xb2b10a289A229415a124EFDeF310C10cb004B6ff","via":[]},{"permission":"upgrade","target":"0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6","via":[]},{"permission":"upgrade","target":"0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9","via":[]},{"permission":"upgrade","target":"0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B","via":[]},{"permission":"upgrade","target":"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6","via":[]}]
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

Generated with discovered.json: 0xa83743d41b34443d94cba6a4599a764422ba0ec9

# Diff at Fri, 09 Aug 2024 12:02:02 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20369470
- current block number: 20369470

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      assignedPermissions.upgrade.13:
-        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
+        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      assignedPermissions.upgrade.12:
-        "0x987e300fDfb06093859358522a79098848C33852"
+        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      assignedPermissions.upgrade.11:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      assignedPermissions.upgrade.10:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
+        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      assignedPermissions.upgrade.9:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
+        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      assignedPermissions.upgrade.8:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
+        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      assignedPermissions.upgrade.7:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
+        "0x987e300fDfb06093859358522a79098848C33852"
      assignedPermissions.upgrade.6:
-        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
+        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      assignedPermissions.upgrade.5:
-        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
+        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      assignedPermissions.upgrade.4:
-        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      assignedPermissions.upgrade.3:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      assignedPermissions.upgrade.2:
-        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
+        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      assignedPermissions.upgrade.1:
-        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
+        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
      assignedPermissions.upgrade.0:
-        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
+        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
    }
```

Generated with discovered.json: 0xea477ad26addbd659b6e6624ccb8b9a297c9b89c

# Diff at Fri, 09 Aug 2024 10:12:01 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20369470
- current block number: 20369470

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 5 (20%)"
      values.getOwners:
-        ["0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632","0xdA66Df3920091eF4B54782B9463587c314DAdD41"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632","0xdA66Df3920091eF4B54782B9463587c314DAdD41"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 5 (20%)"
    }
```

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0","0xfc31892C5500AbE00974280b28907BaA9190E384"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0","0xfc31892C5500AbE00974280b28907BaA9190E384"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract ProxyAdmin (0x9eBf2f33526CD571f8b2ad312492cb650870CFd6) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xA033Ff09f2da45f0e9ae495f525363722Df42b2a"]
      assignedPermissions.upgrade:
+        ["0xA033Ff09f2da45f0e9ae495f525363722Df42b2a"]
    }
```

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632","0xdA66Df3920091eF4B54782B9463587c314DAdD41"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632","0xdA66Df3920091eF4B54782B9463587c314DAdD41"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

```diff
    contract PufferFinanceOpsMultisig (0xC0896ab1A8cae8c2C1d27d011eb955Cca955580d) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 8 (38%)"
      values.getOwners:
-        ["0x11B0BE5e19E38F6f6E07e11f103C4F4e8A5d0f6a","0xE408AE2E70a567c83C0BD36dC4a00b0a56F0A8DA","0xf09c25681090C5F9408c6D3CD24baa8721870dc5","0xD6475ce37d964d4816715FdafFEeAAf2958948bE","0xD70aa9d7280E6FEe89B86f53c0B2A363478D5e94","0x8F97Bf67182122D2f1745216a81724143db97E43","0xf061f1FceFa32b3bbD5d18c5A623DB64bfBc107D","0x206846dE1F372A9a603e672ba97A5238cC89aeAA"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x11B0BE5e19E38F6f6E07e11f103C4F4e8A5d0f6a","0xE408AE2E70a567c83C0BD36dC4a00b0a56F0A8DA","0xf09c25681090C5F9408c6D3CD24baa8721870dc5","0xD6475ce37d964d4816715FdafFEeAAf2958948bE","0xD70aa9d7280E6FEe89B86f53c0B2A363478D5e94","0x8F97Bf67182122D2f1745216a81724143db97E43","0xf061f1FceFa32b3bbD5d18c5A623DB64bfBc107D","0x206846dE1F372A9a603e672ba97A5238cC89aeAA"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 8 (38%)"
    }
```

```diff
    contract wstETHescrowLidoProxyAdmin (0xCC2C53556Bc75217cf698721b29071d6f12628A9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x6625C6332c9F91F2D27c304E729B86db87A3f504"]
      assignedPermissions.upgrade:
+        ["0x6625C6332c9F91F2D27c304E729B86db87A3f504"]
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B","0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4","0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B","0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367","0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d","0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","0x7F2b8C31F88B6006c382775eea88297Ec1e3E905","0x987e300fDfb06093859358522a79098848C33852","0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9","0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6","0xa13BAF47339d63B743e7Da8741db5456DAc1E556","0xb2b10a289A229415a124EFDeF310C10cb004B6ff","0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6","0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"]
      assignedPermissions.upgrade:
+        ["0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B","0xb2b10a289A229415a124EFDeF310C10cb004B6ff","0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6","0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4","0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B","0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6","0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d","0x7F2b8C31F88B6006c382775eea88297Ec1e3E905","0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9","0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B","0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367","0x987e300fDfb06093859358522a79098848C33852","0xa13BAF47339d63B743e7Da8741db5456DAc1E556"]
    }
```

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 5 (80%)"
      values.getOwners:
-        ["0xFCf6364F5157901f533DD3615A5d8c375F13c072","0xE2e6345baAD18f779167443Dc4886495507b3249","0xEbbeeAA424AE904508465a41c927Be594C43Dc68","0xfc31892C5500AbE00974280b28907BaA9190E384","0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xFCf6364F5157901f533DD3615A5d8c375F13c072","0xE2e6345baAD18f779167443Dc4886495507b3249","0xEbbeeAA424AE904508465a41c927Be594C43Dc68","0xfc31892C5500AbE00974280b28907BaA9190E384","0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 5 (80%)"
    }
```

Generated with discovered.json: 0xd370682bb33d7515ec78c08804cd8c7527f97ac7

# Diff at Tue, 30 Jul 2024 11:14:23 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20369470
- current block number: 20369470

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      fieldMeta:
+        {"paused":{"severity":"HIGH","description":"Whether the sendTransaction function is paused or not. Affects the sequencer failure risk."}}
    }
```

Generated with discovered.json: 0x74483202a2abf595fbdc6afc5fe3b6ad0a90017a

# Diff at Tue, 23 Jul 2024 13:16:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f8d5c0ccc8d74a077f85a8dca4038e175812c389 block: 20311071
- current block number: 20369470

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract PufferFinanceOpsMultisig (0xC0896ab1A8cae8c2C1d27d011eb955Cca955580d) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 7 (43%)"
+        "3 of 8 (38%)"
      values.getOwners.7:
+        "0x206846dE1F372A9a603e672ba97A5238cC89aeAA"
      values.getOwners.6:
-        "0x206846dE1F372A9a603e672ba97A5238cC89aeAA"
+        "0xf061f1FceFa32b3bbD5d18c5A623DB64bfBc107D"
      values.getOwners.5:
-        "0xf061f1FceFa32b3bbD5d18c5A623DB64bfBc107D"
+        "0x8F97Bf67182122D2f1745216a81724143db97E43"
      values.getOwners.4:
-        "0x8F97Bf67182122D2f1745216a81724143db97E43"
+        "0xD70aa9d7280E6FEe89B86f53c0B2A363478D5e94"
      values.getOwners.3:
-        "0xD70aa9d7280E6FEe89B86f53c0B2A363478D5e94"
+        "0xD6475ce37d964d4816715FdafFEeAAf2958948bE"
      values.getOwners.2:
-        "0xD6475ce37d964d4816715FdafFEeAAf2958948bE"
+        "0xf09c25681090C5F9408c6D3CD24baa8721870dc5"
      values.getOwners.1:
-        "0xf09c25681090C5F9408c6D3CD24baa8721870dc5"
+        "0xE408AE2E70a567c83C0BD36dC4a00b0a56F0A8DA"
      values.getOwners.0:
-        "0xE408AE2E70a567c83C0BD36dC4a00b0a56F0A8DA"
+        "0x11B0BE5e19E38F6f6E07e11f103C4F4e8A5d0f6a"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311071 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9eBf2f33526CD571f8b2ad312492cb650870CFd6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract pufEthEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PufferFinanceOpsMultisig (0xC0896ab1A8cae8c2C1d27d011eb955Cca955580d)
    +++ description: None
```

Generated with discovered.json: 0xddd7a815a741e8c748b9f47145b520ee367f47b5

# Diff at Mon, 15 Jul 2024 09:39:11 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c6bae99047cf03487a19e4008cfffabf520bcf2b block: 20259894
- current block number: 20311071

## Description

New targets are added to the ScrollOwner accessControl: `updateVerifier` on the MultipleVersionRollupVerifier can now be called via TimelockMid(7d) and `setBatchConfig` on the L1BatchBridgeGateway via TimelockFast(1d).

## Watched changes

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.targets.0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B:
+        {"updateVerifier(uint256,uint64,address)":["TIMELOCK_7DAY_DELAY_ROLE"]}
      values.accessControl.targets.0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4:
+        {"setBatchConfig(address,(uint96,uint96,uint16,uint24,uint24))":["TIMELOCK_1DAY_DELAY_TOLE"]}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20259894 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4)
    +++ description: None
```

Generated with discovered.json: 0xc91c535b44afb48eb36ccafc1f98ec0e73dd837f

# Diff at Mon, 08 Jul 2024 06:07:38 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e192ffbc9e265fdc44012a487bab5f0859ffe881 block: 20231628
- current block number: 20259894

## Description

Batches are reverted [in this transaction](https://app.blocksec.com/explorer/tx/eth/0xf58cd0223418a4dd390be63d67c31ccd3b05a82d59461106227664e8fc417ac5). Unclear what justified this action.

Relevant incident page: https://status.scroll.io/incidents/44k6s4qg6kcs

## Watched changes

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.revertedBatches.54:
+        {"batchIndex":275173}
      values.revertedBatches.53:
+        {"batchIndex":275172}
      values.revertedBatches.52:
+        {"batchIndex":275171}
      values.revertedBatches.51:
+        {"batchIndex":275170}
      values.revertedBatches.50:
+        {"batchIndex":275169}
      values.revertedBatches.49:
+        {"batchIndex":275168}
      values.revertedBatches.48:
+        {"batchIndex":275167}
      values.revertedBatches.47:
+        {"batchIndex":275166}
      values.revertedBatches.46:
+        {"batchIndex":275165}
      values.revertedBatches.45:
+        {"batchIndex":275164}
      values.revertedBatches.44:
+        {"batchIndex":275163}
      values.revertedBatches.43:
+        {"batchIndex":275162}
      values.revertedBatches.42:
+        {"batchIndex":275161}
      values.revertedBatches.41:
+        {"batchIndex":275160}
      values.revertedBatches.40:
+        {"batchIndex":275159}
      values.revertedBatches.39:
+        {"batchIndex":275158}
      values.revertedBatches.38:
+        {"batchIndex":275157}
      values.revertedBatches.37:
+        {"batchIndex":275156}
      values.revertedBatches.36:
+        {"batchIndex":275155}
      values.revertedBatches.35:
+        {"batchIndex":275154}
      values.revertedBatches.34:
+        {"batchIndex":275153}
      values.revertedBatches.33:
+        {"batchIndex":275152}
      values.revertedBatches.32:
+        {"batchIndex":275151}
      values.revertedBatches.31:
+        {"batchIndex":275150}
      values.revertedBatches.30:
+        {"batchIndex":275149}
      values.revertedBatches.29:
+        {"batchIndex":275148}
      values.revertedBatches.28:
+        {"batchIndex":275147}
      values.revertedBatches.27:
+        {"batchIndex":275146}
      values.revertedBatches.26:
+        {"batchIndex":275145}
      values.revertedBatches.25:
+        {"batchIndex":275144}
      values.revertedBatches.24:
+        {"batchIndex":275143}
      values.revertedBatches.23:
+        {"batchIndex":275142}
      values.revertedBatches.22:
+        {"batchIndex":275141}
      values.revertedBatches.21:
+        {"batchIndex":275140}
      values.revertedBatches.20:
+        {"batchIndex":275139}
      values.revertedBatches.19:
+        {"batchIndex":275138}
      values.revertedBatches.18:
+        {"batchIndex":275137}
      values.revertedBatches.17:
+        {"batchIndex":275136}
      values.revertedBatches.16:
+        {"batchIndex":275135}
      values.revertedBatches.15:
+        {"batchIndex":275134}
      values.revertedBatches.14:
+        {"batchIndex":275133}
      values.revertedBatches.13:
+        {"batchIndex":275132}
      values.revertedBatches.12:
+        {"batchIndex":275131}
      values.revertedBatches.11:
+        {"batchIndex":275130}
      values.revertedBatches.10:
+        {"batchIndex":275129}
      values.revertedBatches.9:
+        {"batchIndex":275128}
      values.revertedBatches.8:
+        {"batchIndex":275127}
      values.revertedBatches.7:
+        {"batchIndex":275126}
      values.revertedBatches.6:
+        {"batchIndex":275125}
      values.revertedBatches.5:
+        {"batchIndex":275124}
      values.revertedBatches.4:
+        {"batchIndex":275123}
      values.revertedBatches.3:
+        {"batchIndex":275122}
      values.revertedBatches.2:
+        {"batchIndex":275121}
      values.revertedBatches.1:
+        {"batchIndex":275120}
      values.revertedBatches.0:
+        {"batchIndex":275119}
    }
```

Generated with discovered.json: 0xe79e01ccb7168b40e4ef5149d2f69fe16ddd49ca

# Diff at Thu, 04 Jul 2024 07:23:55 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a971675b742a033604993266a953472c91a5d327 block: 20138546
- current block number: 20231628

## Description

This upgrade is called [the Curie Upgrade](https://scroll.io/blog/compressing-the-gas-scrolls-curie-upgrade) by Scroll.
It brings a new batch version that has new compression and an accompanying new verifier and verifier-manager.
The L2 changes are listed in the blog post.

### ScrollChain

Batch version > 1 is now supported. This allows for the new batch version 2 to be posted.

### MultipleVersionRollupVerifier (manages verifiers)

In the `updateVerifier()` function, a check whether the new verifier's `_startBatchIndex` is already finalized (-->revert), is removed. 

### ZkEvmVerifierV1

This is the contract in the third slot of `latestVerifier`, added in this upgrade. It is code-identical with the previous one, but points to the new Plonk Verifier.

### New Plonk Verifier

The source code (yul+) can be found at https://circuit-release.s3.us-west-2.amazonaws.com/release-v0.11.4/evm_verifier.yul.

## Watched changes

```diff
-   Status: DELETED
    contract MultipleVersionRollupVerifier (0x1Ea29d57dAC237152d878758bAe4BeB2668998f6)
    +++ description: Used to update the verifier and keep track of current and old versions.
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      upgradeability.implementation:
-        "0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"
+        "0x4F250B05262240C787a1eE222687C6eC395C628A"
      implementations.0:
-        "0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"
+        "0x4F250B05262240C787a1eE222687C6eC395C628A"
      values.verifier:
-        "0x1Ea29d57dAC237152d878758bAe4BeB2668998f6"
+        "0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B"
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifierV2 (0x03a72B00D036C479105fF98A1953b15d9c510110)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1-1 (0x63FB51C55d9605a75F8872C80De260a00fACfaA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B)
    +++ description: Used to update the verifier and keep track of current and old versions.
```

## Source code changes

```diff
.../MultipleVersionRollupVerifier.sol              | 26 ++-------
 .../ScrollChain/ScrollChain.sol                    | 24 ++++----
 .../scroll/ethereum/.flat/ZkEvmVerifierV1-1.sol    | 66 ++++++++++++++++++++++
 3 files changed, 82 insertions(+), 34 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20138546 (main branch discovery), not current.

```diff
    contract MultipleVersionRollupVerifier (0x1Ea29d57dAC237152d878758bAe4BeB2668998f6) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      errors:
+        {"latestVerifier":"Too many values. Update configuration to explore fully","legacyVerifiersLength":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0x355fd622fa9cc92e25f4e7c966a40b13dc467a75

# Diff at Wed, 29 May 2024 07:42:54 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4844a9bf46315ea8d6de75161e4361325faaa106 block: 19911646
- current block number: 19974091

## Description

The owner of MultipleVersionRollupVerifier (manages verifiers for the Scroll rollup) is changed from the Scroll Multisig to the ScrollOwner contrac. (as described on the frontend)

## Watched changes

```diff
    contract MultipleVersionRollupVerifier (0x1Ea29d57dAC237152d878758bAe4BeB2668998f6) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      values.owner:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

Generated with discovered.json: 0x68a28fba5e0d68fd23b6e1a7df4f76e418d42ff5

# Diff at Mon, 20 May 2024 14:11:22 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@468df776367f9a83cbc1e0ea8de4f8ff7cb613dd block: 19760239
- current block number: 19911646

## Description

Added the Lido wstETH escrow together with its admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19760239 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETHescrowLidoProxyAdmin (0xCC2C53556Bc75217cf698721b29071d6f12628A9)
    +++ description: None
```

Generated with discovered.json: 0xba389f739fa3b1f9c960dd3e199d54a43f2cbc6e

# Diff at Mon, 29 Apr 2024 10:01:53 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@37e0de831cd2543b1a40aefc42a1ba0947644d82 block: 19532167
- current block number: 19760239

## Description

Added blob support.

### ScrollChain

Use of errors instead of requires. `commitBatch` now supports version `1`, which is blobs. Added `finalizeBatchWithProof4844` function.

### MultipleVersionRollupVerifier

It has been updated to support multiple versions. Before, it just contained a single `latestVerifier`, now it's a mapping from versions to latest verifiers.

## Watched changes

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: None
      values.accessControl.targets.0x1Ea29d57dAC237152d878758bAe4BeB2668998f6:
+        {"updateVerifier(uint256,uint64,address)":["TIMELOCK_7DAY_DELAY_ROLE","SECURITY_COUNCIL_NO_DELAY_ROLE"]}
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      upgradeability.implementation:
-        "0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
+        "0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"
      implementations.0:
-        "0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
+        "0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"
      values.verifier:
-        "0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0"
+        "0x1Ea29d57dAC237152d878758bAe4BeB2668998f6"
    }
```

```diff
-   Status: DELETED
    contract MultipleVersionRollupVerifier (0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0x1Ea29d57dAC237152d878758bAe4BeB2668998f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifierV1 (0x2293cd12e8564e8219d314b075867c2f66ac6941)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247)
    +++ description: None
```

## Source code changes

```diff
.../MultipleVersionRollupVerifier/meta.txt         |   2 +-
 .../src/L1/rollup/IScrollChain.sol                 |  51 +-
 .../L1/rollup/MultipleVersionRollupVerifier.sol    | 116 +++-
 .../src/libraries/verifier/IRollupVerifier.sol     |  16 +-
 .../src/libraries/verifier/IZkEvmVerifier.sol      |   2 +-
 .../scroll/ethereum/.code/PlonkVerifierV1/meta.txt |   2 +
 .../ScrollChain/implementation/meta.txt            |   2 +-
 .../src/L1/rollup/IL1MessageQueue.sol              |   2 +-
 .../implementation/src/L1/rollup/IScrollChain.sol  |  54 +-
 .../implementation/src/L1/rollup/ScrollChain.sol   | 716 ++++++++++++++++-----
 .../src/libraries/codec/BatchHeaderV0Codec.sol     |  54 +-
 .../src/libraries/codec/BatchHeaderV1Codec.sol     | 230 +++++++
 .../src/libraries/codec/ChunkCodecV0.sol}          |  27 +-
 .../src/libraries/codec/ChunkCodecV1.sol           |  86 +++
 .../src/libraries/verifier/IRollupVerifier.sol     |  16 +-
 .../scroll/ethereum/.code/ZkEvmVerifierV1/meta.txt |   2 +
 .../src/libraries/verifier/IZkEvmVerifier.sol      |  10 +
 .../src/libraries/verifier/ZkEvmVerifierV1.sol     |  65 ++
 18 files changed, 1202 insertions(+), 251 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532167 (main branch discovery), not current.

```diff
    contract PlonkVerifier (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    +++ description: None
      name:
-        "PlonkVerifier"
+        "PlonkVerifierV0"
    }
```

```diff
    contract ZkEvmVerifierV1 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    +++ description: None
      name:
-        "ZkEvmVerifierV1"
+        "ZkEvmVerifierV0"
    }
```

```diff
    contract MultipleVersionRollupVerifier (0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0) {
    +++ description: None
      values.getVerifier:
+        ["0x585DfaD7bF4099E011D185E266907A8ab60DAD2D","0x585DfaD7bF4099E011D185E266907A8ab60DAD2D","0x585DfaD7bF4099E011D185E266907A8ab60DAD2D","0x585DfaD7bF4099E011D185E266907A8ab60DAD2D","0x585DfaD7bF4099E011D185E266907A8ab60DAD2D"]
      errors:
+        {"getVerifier":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0xab2564ccd95153417c52dae00a8e78fb02f47de6

# Diff at Thu, 28 Mar 2024 11:00:21 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19375229
- current block number: 19532167

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19375229 (main branch discovery), not current.

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 5 (20%)"
    }
```

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 5 (80%)"
    }
```

Generated with discovered.json: 0xeedf768927c66f9e3e9594005bea7982654706a9

# Diff at Wed, 06 Mar 2024 09:27:59 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d60150e480982ada7064a8773c7df37943e92432 block: 19290165
- current block number: 19375229

## Description

The L2GasPriceOracle is now not used anymore and it has been incorporated into the L1MessageQueue contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19290165 (main branch discovery), not current.

```diff
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      name:
-        "L2GasPriceOracle"
+        "OLD_L2GasPriceOracle"
    }
```

Generated with discovered.json: 0x51e6f3f4e484657baa2d2b4469fd0867d1cd86ca

# Diff at Fri, 23 Feb 2024 12:04:50 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@13bd721852038eaabd63b0fc897e802c663577ec block: 18832875
- current block number: 19290165

## Description

### L1CustomERC20Gateway

Use of errors instead of reverts. Some variables are now immutable (counterpart, router, messenger).

### L1ERC1155Gateway

Again, use of errors instead of reverts. Some variables are now immutable (counterpart, router, messenger).

### L1ERC721Gateway

Same changes.

### L1ETHGateway

Same changes.

### L1MessageQueue

The enforced tx gateway is now immutable and set. An L2 gas price oracle is implemented and a permissioned actor can relay the L2 base fee.

### L1ScrollMessenger

Same changes as first ones.

### L1StandardERC20Gateway

Same changes.

### L1USDCGateway

Same changes.

### L1WETHGateway

Same changes.

### ScrollChain

Same changes. In addition, the verifier is now immutable.

### EnforcedTxGateway

Currently paused, so no risk has changed.

## Watched changes

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
      upgradeability.implementation:
-        "0xBC9D741501A20F962756C95BF906b4abffadcf8F"
+        "0xeBaed7A81c298B24EE6d59c22698A951dc448E01"
      implementations.0:
-        "0xBC9D741501A20F962756C95BF906b4abffadcf8F"
+        "0xeBaed7A81c298B24EE6d59c22698A951dc448E01"
      values.enforcedTxGateway:
-        "0x0000000000000000000000000000000000000000"
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      values.l2BaseFee:
+        483000000
      values.whitelistChecker:
+        "0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37"
      derivedName:
-        "L1MessageQueue"
+        "L1MessageQueueWithGasPriceOracle"
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
      upgradeability.implementation:
-        "0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"
+        "0xd1841c5756428812233eEA78afC17cb2D3e392bb"
      implementations.0:
-        "0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"
+        "0xd1841c5756428812233eEA78afC17cb2D3e392bb"
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
      upgradeability.implementation:
-        "0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"
+        "0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"
      implementations.0:
-        "0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"
+        "0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
      upgradeability.implementation:
-        "0xd3c42158682D55E082EaBe08a29F7515A97cA307"
+        "0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"
      implementations.0:
-        "0xd3c42158682D55E082EaBe08a29F7515A97cA307"
+        "0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
      upgradeability.implementation:
-        "0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"
+        "0x546E0bF31FB6e7babD493452e4e6999191367B42"
      implementations.0:
-        "0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"
+        "0x546E0bF31FB6e7babD493452e4e6999191367B42"
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
      upgradeability.implementation:
-        "0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"
+        "0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
      implementations.0:
-        "0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"
+        "0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
      upgradeability.implementation:
-        "0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
+        "0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"
      implementations.0:
-        "0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
+        "0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
      upgradeability.implementation:
-        "0xCb4638620E4C6DeCef26374e71b0dd4871863593"
+        "0x244BF7aEf29F03916569470a51fA0794B62F8cd7"
      implementations.0:
-        "0xCb4638620E4C6DeCef26374e71b0dd4871863593"
+        "0x244BF7aEf29F03916569470a51fA0794B62F8cd7"
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
      upgradeability.implementation:
-        "0x9218732389D80f9b8723C3f32a38865B7a63564A"
+        "0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"
      implementations.0:
-        "0x9218732389D80f9b8723C3f32a38865B7a63564A"
+        "0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
      upgradeability.implementation:
-        "0x6667123b5017AAB9945F73345848B82D7A953AA8"
+        "0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"
      implementations.0:
-        "0x6667123b5017AAB9945F73345848B82D7A953AA8"
+        "0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"
    }
```

## Source code changes

```diff
.../L1CustomERC20Gateway/implementation/meta.txt   |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/L1CustomERC20Gateway.sol       |  21 +++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1ERC1155Gateway/implementation/meta.txt       |   2 +-
 .../src/L1/gateways/L1ERC1155Gateway.sol           |   8 +-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1ERC721Gateway/implementation/meta.txt        |   2 +-
 .../src/L1/gateways/L1ERC721Gateway.sol            |  11 ++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1ETHGateway/implementation/meta.txt           |   2 +-
 .../src/L1/gateways/L1ETHGateway.sol               |  22 ++++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1MessageQueue/implementation/meta.txt         |   4 +-
 .../src/L1/rollup/IL1MessageQueue.sol              |  19 +++-
 .../rollup/IL1MessageQueueWithGasPriceOracle.sol   |  38 +++++++
 .../src/L1/rollup/IL2GasPriceOracle.sol            |   6 ++
 .../src/L1/rollup/L1MessageQueue.sol               |  95 ++++++++++--------
 .../L1/rollup/L1MessageQueueWithGasPriceOracle.sol | 110 +++++++++++++++++++++
 .../src/libraries/common/IWhitelist.sol            |   9 ++
 .../L1ScrollMessenger/implementation/meta.txt      |   2 +-
 .../implementation/src/L1/L1ScrollMessenger.sol    |  64 +++++++-----
 .../src/L1/rollup/IL1MessageQueue.sol              |  19 +++-
 .../implementation/src/L1/rollup/IScrollChain.sol  |   7 ++
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/ScrollMessengerBase.sol          |  22 ++++-
 .../L1StandardERC20Gateway/implementation/meta.txt |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/L1StandardERC20Gateway.sol     |  59 +++++++----
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1USDCGateway/implementation/meta.txt          |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/usdc/L1USDCGateway.sol         |  31 ++++--
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1WETHGateway/implementation/meta.txt          |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/L1WETHGateway.sol              |  27 ++++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../ScrollChain/implementation/meta.txt            |   2 +-
 .../src/L1/rollup/IL1MessageQueue.sol              |  19 +++-
 .../implementation/src/L1/rollup/IScrollChain.sol  |   7 ++
 .../implementation/src/L1/rollup/ScrollChain.sol   |  64 +++++++-----
 56 files changed, 1078 insertions(+), 317 deletions(-)
```

Generated with discovered.json: 0xc09ec1a3a28544d8f5f11512b0fbd211ceecb833

# Diff at Thu, 21 Dec 2023 07:52:36 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@10c7379d5f3774c9ebd335617097ca68ed267379

## Description

One owner is removed from ExecutorMultisig and another is added.

## Watched changes

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
      values.getOwners.4:
-        "0xd3FfEE6e6312e4303A88BD2fFaFdcA8B09310236"
+        "0xdA66Df3920091eF4B54782B9463587c314DAdD41"
    }
```

# Diff at Mon, 18 Dec 2023 11:58:46 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@636723aa928b9ac461db31dd0b5005a916961be5

## Description

One owner is removed from EmergencyMultisig and another is added.

## Watched changes

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
      values.getOwners.4:
-        "0xd3FfEE6e6312e4303A88BD2fFaFdcA8B09310236"
+        "0xdA66Df3920091eF4B54782B9463587c314DAdD41"
    }
```

# Diff at Wed, 08 Nov 2023 15:41:27 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@a406ca5120d2111446400f9fd391e501cbd31e52

## Description

One ExecutorMultisig owner has changed.

## Watched changes

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
      values.getOwners.2:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

# Diff at Tue, 07 Nov 2023 07:33:37 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@6187ae3e2b0d528e37e7073fbd31c8970daac97d

## Description

New owner added to FeeVaultMultisig.

## Watched changes

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
      values.getOwners[3]:
+        "0xfc31892C5500AbE00974280b28907BaA9190E384"
      values.getOwners.2:
-        "0xfc31892C5500AbE00974280b28907BaA9190E384"
+        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
      values.getOwners.1:
-        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
+        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.getOwners.0:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

# Diff at Fri, 03 Nov 2023 07:55:41 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@ea6f863a22bc8316d333ca3f270fcd47113758cb

## Description

Two ScrollMultisig owners are changed.

## Watched changes

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
      values.getOwners.4:
-        "0x9FB9ff268B89Fb22aDe61fbE1B938F5C72D3CC59"
+        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
      values.getOwners.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "0xFCf6364F5157901f533DD3615A5d8c375F13c072"
    }
```

# Diff at Tue, 31 Oct 2023 07:30:26 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@553c8048735381be48fc993e73c034e7ed45f44c

## Description

FeeVaultMultisig owner change.

## Watched changes

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
      values.getOwners.1:
-        "0x9FB9ff268B89Fb22aDe61fbE1B938F5C72D3CC59"
+        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
    }
```

# Diff at Mon, 30 Oct 2023 09:59:06 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@571047cc8f858ed595e25bc9512b54414c949c8e

## Description

Change of owners of Emergency MultiSig and Scroll MultiSig.

## Watched changes

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
      values.getOwners.2:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.getOwners.1:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.getOwners.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
      values.getOwners.1:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "0xE2e6345baAD18f779167443Dc4886495507b3249"
    }
```

# Diff at Thu, 19 Oct 2023 08:22:39 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@0beeab609744b4e4247dca817daaa8caed24ab12

## Description

Added Scroll. Their AccessControl extension needed a custom handler since it also specifies which function a role can call. Fallback contracts are not being displayed on the website because they're just used to recover funds in case of a mistake.

## Watched changes

```diff
+   Status: CREATED
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    }
```

```diff
+   Status: CREATED
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    }
```

```diff
+   Status: CREATED
    contract TimelockSlow (0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C) {
    }
```

```diff
+   Status: CREATED
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    }
```

```diff
+   Status: CREATED
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifier (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    }
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    }
```

```diff
+   Status: CREATED
    contract L2ERC1155GatewayFallback (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    }
```

```diff
+   Status: CREATED
    contract L2CustomERC20GatewayFallback (0x64CCBE37c9A82D85A1F2E74649b7A42923067988) {
    }
```

```diff
+   Status: CREATED
    contract L2TokenFactoryFallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    }
```

```diff
+   Status: CREATED
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    }
```

```diff
+   Status: CREATED
    contract L2ETHGatewayFallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    }
```

```diff
+   Status: CREATED
    contract L2WETHGatewayFallback (0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9) {
    }
```

```diff
+   Status: CREATED
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    }
```

```diff
+   Status: CREATED
    contract L2ScrollMessengerFallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    }
```

```diff
+   Status: CREATED
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    }
```

```diff
+   Status: CREATED
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    }
```

```diff
+   Status: CREATED
    contract L2ERC721GatewayFallback (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582) {
    }
```

```diff
+   Status: CREATED
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    }
```

```diff
+   Status: CREATED
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    }
```

```diff
+   Status: CREATED
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    }
```

```diff
+   Status: CREATED
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    }
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0) {
    }
```

```diff
+   Status: CREATED
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    }
```

```diff
+   Status: CREATED
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    }
```

```diff
+   Status: CREATED
    contract L2TokenImplementationFallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    }
```

```diff
+   Status: CREATED
    contract TimelockMid (0xDC1d1189Da69Ae2016E4976A43De20972D349B1b) {
    }
```

```diff
+   Status: CREATED
    contract L2StandardERC20GatewayFallback (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    }
```

```diff
+   Status: CREATED
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    }
```

```diff
+   Status: CREATED
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    }
```

# Diff at Thu, 12 Oct 2023 12:22:29 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
+   Status: CREATED
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    }
```

```diff
+   Status: CREATED
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    }
```

```diff
+   Status: CREATED
    contract  (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    }
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    }
```

```diff
+   Status: CREATED
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    }
```

```diff
+   Status: CREATED
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    }
```

```diff
+   Status: CREATED
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    }
```

```diff
+   Status: CREATED
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    }
```

```diff
+   Status: CREATED
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    }
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    }
```

