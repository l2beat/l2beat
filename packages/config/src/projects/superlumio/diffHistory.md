Generated with discovered.json: 0x5c77af62a2501597dcdb31663189ba0e67804bd4

# Diff at Tue, 07 Oct 2025 09:46:42 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@5e88ba37ad7744f9d7831779a58849b5d00ec673 block: 1759480990
- current timestamp: 1759830334

## Description

Changed proxy owner to EOA, now has EOA controls majority of permissions flag.

## Watched changes

```diff
    EOA  (eth:0x4380709Fc7fd626ad17a63A1819F39A82978E3BF) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x0225304877a2C700f8f03BC50344467FCf8271BF","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","from":"eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"eth:0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0xEe136B6087070d35D98b1bb1B33C3a00D907F0c1","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0xf8f9625a95b8fCbED76d1De537B71035997E44c8","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      controlsMajorityOfUpgradePermissions:
+        true
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","role":".owner"}]
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.4:
-        {"permission":"upgrade","from":"eth:0x0225304877a2C700f8f03BC50344467FCf8271BF","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"eth:0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.9:
-        {"permission":"upgrade","from":"eth:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.11:
-        {"permission":"upgrade","from":"eth:0xEe136B6087070d35D98b1bb1B33C3a00D907F0c1","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.12:
-        {"permission":"upgrade","from":"eth:0xf8f9625a95b8fCbED76d1De537B71035997E44c8","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.13:
-        {"permission":"upgrade","from":"eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      directlyReceivedPermissions.0:
-        {"permission":"act","from":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","role":".owner"}
    }
```

```diff
    contract ProxyAdmin (eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      values.owner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4380709Fc7fd626ad17a63A1819F39A82978E3BF"
    }
```

Generated with discovered.json: 0x1b18974457e72fa8963b4fd405af511688e9cbd0

# Diff at Fri, 03 Oct 2025 08:44:28 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1758699366
- current timestamp: 1759480990

## Description

Member removed from multisig.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x51dbc16e2a5d7496a4fe29de4c2e9fc83d719aea

# Diff at Wed, 24 Sep 2025 07:37:15 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d7323b1d7fcd47448cd95a9f8ee7b4214e04c807 block: 1757661588
- current timestamp: 1758699366

## Description

system config owner moved from conduit msig to EOA.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.4:
-        {"permission":"interact","from":"eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","role":".owner"}
    }
```

```diff
    contract SystemConfig (eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.owner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4380709Fc7fd626ad17a63A1819F39A82978E3BF"
    }
```

Generated with discovered.json: 0x707383f9a9a9af29e548d71ced465652a4747be0

# Diff at Mon, 15 Sep 2025 09:50:55 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@37882e40cb6029f3a2ae2bb177048e3e846b833d block: 1757661588
- current timestamp: 1757661588

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1757661588 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0xEe136B6087070d35D98b1bb1B33C3a00D907F0c1) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.gameImpls.2:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.gameImpls.3:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xb4f3e55a7975b8e5eead1914bc76217112f4f406

# Diff at Fri, 12 Sep 2025 07:20:54 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b19dd572d1bb478c9bacfee5598e38f6eee363a0 block: 1756214657
- current timestamp: 1757661588

## Description

gas fees increase.

## Watched changes

```diff
    contract SystemConfig (eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.basefeeScalar:
-        684000
+        3420000
    }
```

Generated with discovered.json: 0x11fe1d2bc5deb9838e6abc3637c74bed010540d6

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xd3d894c37ee573222bbdb16fe5558887959194f8

# Diff at Tue, 26 Aug 2025 13:33:28 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e10932be0db538f3a760bbc29232375f08915af7 block: 1755009465
- current timestamp: 1756214657

## Description

Conduit msig: removed one address and added blobbasefeeScalar to SystemConfig.
## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 11 (36%)"
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.blobbasefeeScalar:
-        0
+        611590
    }
```

Generated with discovered.json: 0x444aab23f6915add93bbb44854d835e513307e8c

# Diff at Tue, 12 Aug 2025 14:43:07 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1753682279
- current timestamp: 1755009465

## Description

Conduit Multisig 1 signer added.

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0x17b103557cd87c5dd5a730aa16a156817d638428

# Diff at Mon, 28 Jul 2025 07:20:44 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 22975751
- current block number: 23015705

## Description

Conduit: Optiportal2 upgrade (permissioned gametype). All contracts are using standard implementations.

absolute prestate: v1.6.0 (cannon64)

standard 3.5; 3.5; 7 finality conf

Op stack gov upgrade: standard SuperchainConfig is not used and OpFoundationOperationsSafe is now the direct guardian.

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"challenge","from":"eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59","role":".challenger"}
      receivedPermissions.1.role:
-        ".CHALLENGER"
+        ".challenger"
      receivedPermissions.1.from:
-        "eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
+        "eth:0x542102Bb35C32ADa5D72cB791295d97574A71C84"
      receivedPermissions.3:
-        {"permission":"guard","from":"eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0","role":".guardian"}
      receivedPermissions.4:
-        {"permission":"guard","from":"eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0","role":".GUARDIAN"}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0xf8f9625a95b8fCbED76d1De537B71035997E44c8","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0x0225304877a2C700f8f03BC50344467FCf8271BF","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"eth:0xEe136B6087070d35D98b1bb1B33C3a00D907F0c1","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.13:
+        {"permission":"upgrade","from":"eth:0xf8f9625a95b8fCbED76d1De537B71035997E44c8","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.14:
-        {"permission":"upgrade","from":"eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59","role":"admin","via":[{"address":"eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
    }
```

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.6:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"]]
      values.$upgradeCount:
-        6
+        8
      values.version:
-        "2.3.0"
+        "2.6.0"
      values.ENCODING_OVERHEAD:
+        260
      values.FLOOR_CALLDATA_OVERHEAD:
+        40
      values.TX_BASE_GAS:
+        21000
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.5:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
      values.$upgradeCount:
-        5
+        7
      values.version:
-        "2.1.0"
+        "2.4.0"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
-        "L1ERC721Bridge"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
+        "L1ERC721Bridge"
    }
```

```diff
    contract OptimismPortal2 (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      name:
-        "OptimismPortal"
+        "OptimismPortal2"
      template:
-        "opstack/OptimismPortal"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
+        "0xc483ef9e0a5ec2a0450732e743b3784de0cd3876b8fadfce14c0805a0846d26b"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
      values.$implementation:
-        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
+        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.3:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.4:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.5:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"]]
      values.$upgradeCount:
-        3
+        7
      values.GUARDIAN:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.L2_ORACLE:
-        "eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      values.l2Oracle:
-        "eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      values.SYSTEM_CONFIG:
-        "eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      values.version:
-        "2.5.0"
+        "3.14.0"
      values.disputeGameFactory:
+        "eth:0xEe136B6087070d35D98b1bb1B33C3a00D907F0c1"
      values.disputeGameFinalityDelaySeconds:
+        302400
      values.proofMaturityDelaySeconds:
+        604800
      values.RespectedGameString:
+        "PermissionedDisputeGame"
+++ severity: HIGH
      values.respectedGameType:
+        1
      values.respectedGameTypeUpdatedAt:
+        1753375919
      implementationNames.eth:0x2D778797049FE9259d947D1ED8e5442226dFB589:
-        "OptimismPortal"
      implementationNames.eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
+        "OptimismPortal2"
      fieldMeta:
+        {"respectedGameType":{"severity":"HIGH"},"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame","1337":"KailuaGame"}}]
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x0225304877a2C700f8f03BC50344467FCf8271BF","role":"admin"}
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xEe136B6087070d35D98b1bb1B33C3a00D907F0c1","role":"admin"}
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0xf8f9625a95b8fCbED76d1De537B71035997E44c8","role":"admin"}
      directlyReceivedPermissions.7:
-        {"permission":"upgrade","from":"eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59","role":"admin"}
    }
```

```diff
    EOA  (0xb6E2Eee22b684f6AAb2083097F7E874994bA930e) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"propose","from":"eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59","role":".proposer"}
      receivedPermissions.1.role:
-        ".PROPOSER"
+        ".proposer"
      receivedPermissions.1.from:
-        "eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
+        "eth:0x542102Bb35C32ADa5D72cB791295d97574A71C84"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.4:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0x5493f4677A186f64805fe7317D6993ba4863988F"]]
      values.$upgradeCount:
-        4
+        5
      values.version:
-        "1.9.0"
+        "1.10.1"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x5493f4677A186f64805fe7317D6993ba4863988F:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
+        "0x4e15d99844dc5a4304c2396a66c95ec41218ea311c8e524b118fad7beed0bb53"
      values.$implementation:
-        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
      values.version:
-        "2.1.0"
+        "2.3.0"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
-        "L1StandardBridge"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
+        "L1StandardBridge"
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.4:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.5:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.6:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$pastUpgrades.7:
+        ["2025-07-24T16:51:59.000Z","0x227eb698170a630e7a33457b9166890b0d905f6b83947d6f78a08cc294a56fa0",["eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]]
      values.$upgradeCount:
-        4
+        8
      values.basefeeScalar:
-        0
+        684000
      values.disputeGameFactory:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0xEe136B6087070d35D98b1bb1B33C3a00D907F0c1"
      values.gasPayingToken:
-        {"addr_":"eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
-        "Ether"
      values.gasPayingTokenSymbol:
-        "ETH"
      values.isCustomGasToken:
-        false
      values.version:
-        "2.3.0"
+        "2.5.0"
      values.getAddresses:
+        {"l1CrossDomainMessenger":"eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D","l1ERC721Bridge":"eth:0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b","l1StandardBridge":"eth:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc","disputeGameFactory":"eth:0xEe136B6087070d35D98b1bb1B33C3a00D907F0c1","optimismPortal":"eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0","optimismMintableERC20Factory":"eth:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"}
      values.operatorFeeConstant:
+        0
      values.operatorFeeScalar:
+        0
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
-        "SystemConfig"
      implementationNames.eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
+        "SystemConfig"
    }
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x0225304877a2C700f8f03BC50344467FCf8271BF)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x542102Bb35C32ADa5D72cB791295d97574A71C84)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xEe136B6087070d35D98b1bb1B33C3a00D907F0c1)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xf8f9625a95b8fCbED76d1De537B71035997E44c8)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  568 +++
 .../ethereum/.flat/AnchorStateRegistry/Proxy.p.sol |  200 +
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  608 +++
 .../ethereum/.flat/DelayedWETH/Proxy.p.sol         |  200 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1482 +++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../L1CrossDomainMessenger.sol                     |  736 +++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  418 +-
 .../L1StandardBridge/L1StandardBridge.sol          |  508 ++-
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../projects/superlumio/ethereum/.flat/MIPS.sol    | 2515 ++++++++++++
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal/Proxy.p.sol => /dev/null        |  211 -
 .../OptimismPortal2/OptimismPortal2.sol}           |  926 +++--
 .../OptimismPortal2}/Proxy.p.sol                   |    0
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4121 ++++++++++++++++++++
 .../superlumio/ethereum/.flat/PreimageOracle.sol   | 1311 +++++++
 .../SystemConfig/SystemConfig.sol                  | 1439 +------
 18 files changed, 13121 insertions(+), 3031 deletions(-)
```

Generated with discovered.json: 0x25da525aac137dbe9dcc6159916b55826ff7619a

# Diff at Tue, 22 Jul 2025 15:56:55 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 22895950
- current block number: 22975751

## Description

Conduit: Upgrade to known OP stack contracts. (no OptiPortal2 yet).

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"challenge","from":"eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59","role":".challenger"}
      receivedPermissions.2:
+        {"permission":"guard","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":".guardian"}
      receivedPermissions.3:
+        {"permission":"guard","from":"eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0","role":".guardian"}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":"admin","via":[{"address":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5"}]}
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5","role":".owner"}
    }
```

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"
+        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
      values.$implementation:
-        "eth:0xfe0651694489eb60Bb93031C9C32318b0E1Fe200"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.2:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.4:
+        ["2025-07-21T14:53:35.000Z","0x9f977184a28dd8bce9a8f00f77bce38279f7b8c9d6897fb3a634c1c2cf8a2a34",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.5:
+        ["2025-07-21T14:53:35.000Z","0x9f977184a28dd8bce9a8f00f77bce38279f7b8c9d6897fb3a634c1c2cf8a2a34",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$upgradeCount:
-        2
+        6
      values.version:
-        "1.4.1"
+        "2.3.0"
      values.otherMessenger:
+        "eth:0x4200000000000000000000000000000000000007"
      values.paused:
+        false
      values.portal:
+        "eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0xfe0651694489eb60Bb93031C9C32318b0E1Fe200:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x95c690f70db8f82a05347087d704333c180048757ff015d74a5b186c1b6b24ab"
+        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
      values.$implementation:
-        "eth:0xf7110272725E2036fc21294E9468EBD635800381"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:53:35.000Z","0x9f977184a28dd8bce9a8f00f77bce38279f7b8c9d6897fb3a634c1c2cf8a2a34",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.4:
+        ["2025-07-21T14:53:35.000Z","0x9f977184a28dd8bce9a8f00f77bce38279f7b8c9d6897fb3a634c1c2cf8a2a34",["eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$upgradeCount:
-        1
+        5
      values.version:
-        "1.1.2"
+        "2.1.0"
      values.paused:
+        false
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0xf7110272725E2036fc21294E9468EBD635800381:
-        "L1ERC721Bridge"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes.1:
-        "0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"
+        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
      values.$implementation:
-        "eth:0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D"
+        "eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0x2D778797049FE9259d947D1ED8e5442226dFB589"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "1.7.2"
+        "2.5.0"
      values.guardian:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.l2Oracle:
+        "eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      values.systemConfig:
+        "eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      implementationNames.eth:0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D:
-        "OptimismPortal"
      implementationNames.eth:0x2D778797049FE9259d947D1ED8e5442226dFB589:
+        "OptimismPortal"
    }
```

```diff
    EOA  (0xb6E2Eee22b684f6AAb2083097F7E874994bA930e) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"propose","from":"eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59","role":".proposer"}
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0xc8aea1ad75944084aeb3dc8b5c63135af405055da6baaffde3ed51e92c91e2eb"
+        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
      values.$implementation:
-        "eth:0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:53:35.000Z","0x9f977184a28dd8bce9a8f00f77bce38279f7b8c9d6897fb3a634c1c2cf8a2a34",["eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]
      values.$upgradeCount:
-        1
+        4
      values.version:
-        "1.1.1"
+        "1.9.0"
      values.bridge:
+        "eth:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      implementationNames.eth:0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"
+        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
      values.$implementation:
-        "eth:0xAaa6cF2EFB6cfB5f6887366cC9ce242899f495A1"
+        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.version:
-        "1.1.1"
+        "2.1.0"
      values.otherBridge:
+        "eth:0x4200000000000000000000000000000000000010"
      values.paused:
+        false
      values.superchainConfig:
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0xAaa6cF2EFB6cfB5f6887366cC9ce242899f495A1:
-        "L1StandardBridge"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "eth:0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]]
      values.$pastUpgrades.3:
+        ["2025-07-21T14:53:35.000Z","0x9f977184a28dd8bce9a8f00f77bce38279f7b8c9d6897fb3a634c1c2cf8a2a34",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$upgradeCount:
-        1
+        4
      values.version:
-        "1.3.1"
+        "2.3.0"
      values.basefeeScalar:
+        0
      values.BATCH_INBOX_SLOT:
+        "0x71ac12829d66ee73d8d95bff50b3589745ce57edae70a3fb111a2342464dc597"
      values.batchInbox:
+        "eth:0xA12Cf34001e553dc254D131105364351f5174d75"
      values.blobbasefeeScalar:
+        0
      values.DISPUTE_GAME_FACTORY_SLOT:
+        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.disputeGameFactory:
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: volatility param: lower denominator -> quicker fee changes on L2
      values.eip1559Denominator:
+        0
      values.eip1559Elasticity:
+        0
      values.gasPayingToken:
+        {"addr_":"eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
+        "Ether"
      values.gasPayingTokenSymbol:
+        "ETH"
      values.isCustomGasToken:
+        false
      values.L1_CROSS_DOMAIN_MESSENGER_SLOT:
+        "0x383f291819e6d54073bc9a648251d97421076bdd101933c0c022219ce9580636"
      values.L1_ERC_721_BRIDGE_SLOT:
+        "0x46adcbebc6be8ce551740c29c47c8798210f23f7f4086c41752944352568d5a7"
      values.L1_STANDARD_BRIDGE_SLOT:
+        "0x9904ba90dde5696cda05c9e0dab5cbaa0fea005ace4d11218a02ac668dad6376"
      values.l1CrossDomainMessenger:
+        "eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
      values.l1ERC721Bridge:
+        "eth:0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      values.l1StandardBridge:
+        "eth:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      values.maximumGasLimit:
+        200000000
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "eth:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      values.optimismPortal:
+        "eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        19314570
      implementationNames.eth:0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC:
-        "SystemConfig"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes.1:
-        "0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"
+        "0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"
      values.$implementation:
-        "eth:0x68c36689D9820D78F53CF384D06199b061cc948b"
+        "eth:0xF243BEd163251380e78068d317ae10f26042B292"
      values.$pastUpgrades.1:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0x6322C2f2D6a4305Fc033754d486A5A067Ee5F9b1"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T14:07:11.000Z","0x18166234384c5dc08eb96b10eb819277826bf8620f5681659457761a655c4797",["eth:0xF243BEd163251380e78068d317ae10f26042B292"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "1.3.1"
+        "1.8.0"
+++ severity: HIGH
      values.challenger:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.finalizationPeriodSeconds:
+        604800
      values.l2BlockTime:
+        2
+++ severity: HIGH
      values.proposer:
+        "eth:0xb6E2Eee22b684f6AAb2083097F7E874994bA930e"
      values.submissionInterval:
+        21600
      implementationNames.eth:0x68c36689D9820D78F53CF384D06199b061cc948b:
-        "L2OutputOracle"
      implementationNames.eth:0xF243BEd163251380e78068d317ae10f26042B292:
+        "L2OutputOracle"
    }
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5)
    +++ description: None
```

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     | 1654 +++++++---------
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  611 +++---
 .../L1StandardBridge/L1StandardBridge.sol          | 1431 +++++++-------
 .../L2OutputOracle/L2OutputOracle.sol              |  548 ++----
 .../OptimismMintableERC20Factory.sol               |  441 ++++-
 .../OptimismPortal/OptimismPortal.sol              | 1336 +++++--------
 ...0xA6b2b6B6E621482aF877F304D46B94123a942Ae9.sol} |    0
 ...:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5.sol |  298 +++
 .../ethereum/.flat/SuperchainConfig/Proxy.p.sol    |  200 ++
 .../.flat/SuperchainConfig/SuperchainConfig.sol    |  477 +++++
 .../SystemConfig/SystemConfig.sol                  | 2034 +++++++++++++++++---
 11 files changed, 5544 insertions(+), 3486 deletions(-)
```

Generated with discovered.json: 0xf33449f45a4001f0be28927b0aba16feb5c2146b

# Diff at Mon, 14 Jul 2025 12:46:32 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895950
- current block number: 22895950

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895950 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x2919934b66E68B1b6E0d32258B6DE9954463e183) {
    +++ description: None
      address:
-        "0x2919934b66E68B1b6E0d32258B6DE9954463e183"
+        "eth:0x2919934b66E68B1b6E0d32258B6DE9954463e183"
    }
```

```diff
    EOA  (0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f) {
    +++ description: None
      address:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      address:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.$members.1:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.$members.2:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.3:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "eth:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.4:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "eth:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.5:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.6:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.7:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "eth:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.8:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.9:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.10:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "eth:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      implementationNames.0x4a4962275DF8C60a80d3a25faEc5AA7De116A746:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe) {
    +++ description: None
      address:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "eth:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
    }
```

```diff
    EOA  (0x50930d652266EF4127FA3A1906B7Cb9951076628) {
    +++ description: None
      address:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
    }
```

```diff
    EOA  (0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00) {
    +++ description: None
      address:
-        "0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00"
+        "eth:0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00"
    }
```

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
+        "eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
      values.$admin:
-        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      values.$implementation:
-        "0xfe0651694489eb60Bb93031C9C32318b0E1Fe200"
+        "eth:0xfe0651694489eb60Bb93031C9C32318b0E1Fe200"
      values.$pastUpgrades.0.2.0:
-        "0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
+        "eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
      values.$pastUpgrades.1.2.0:
-        "0xfe0651694489eb60Bb93031C9C32318b0E1Fe200"
+        "eth:0xfe0651694489eb60Bb93031C9C32318b0E1Fe200"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.PORTAL:
-        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
+        "eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      values.ResolvedDelegateProxy_addressManager:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
+        "eth:0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      implementationNames.0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D:
-        "ResolvedDelegateProxy"
      implementationNames.0xfe0651694489eb60Bb93031C9C32318b0E1Fe200:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xfe0651694489eb60Bb93031C9C32318b0E1Fe200:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x81175155D85377C337d92f1FA52Da166C3A4E7Ac) {
    +++ description: None
      address:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "eth:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    EOA  (0x860e06Fe384D1A3340111e7D142E02642178c053) {
    +++ description: None
      address:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
+        "eth:0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      values.$admin:
-        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      values.$implementation:
-        "0xf7110272725E2036fc21294E9468EBD635800381"
+        "eth:0xf7110272725E2036fc21294E9468EBD635800381"
      values.$pastUpgrades.0.2.0:
-        "0xf7110272725E2036fc21294E9468EBD635800381"
+        "eth:0xf7110272725E2036fc21294E9468EBD635800381"
      values.messenger:
-        "0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
+        "eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
      values.MESSENGER:
-        "0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
+        "eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      implementationNames.0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b:
-        "Proxy"
      implementationNames.0xf7110272725E2036fc21294E9468EBD635800381:
-        "L1ERC721Bridge"
      implementationNames.eth:0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b:
+        "Proxy"
      implementationNames.eth:0xf7110272725E2036fc21294E9468EBD635800381:
+        "L1ERC721Bridge"
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
+        "eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      values.$admin:
-        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      values.$implementation:
-        "0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D"
+        "eth:0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D"
      values.$pastUpgrades.0.2.0:
-        "0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D"
+        "eth:0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D"
      values.GUARDIAN:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.L2_ORACLE:
-        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
+        "eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.SYSTEM_CONFIG:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      implementationNames.0x9C93982cb4861311179aE216d1B7fD61232DE1f0:
-        "Proxy"
      implementationNames.0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D:
-        "OptimismPortal"
      implementationNames.eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0:
+        "Proxy"
      implementationNames.eth:0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D:
+        "OptimismPortal"
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
+        "eth:0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      values.owner:
-        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      implementationNames.0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc:
-        "AddressManager"
      implementationNames.eth:0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc:
+        "AddressManager"
    }
```

```diff
    EOA  (0xA0737fea60F0601A192E3d2c98865A883ab0bda2) {
    +++ description: None
      address:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "eth:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
    }
```

```diff
    EOA  (0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038) {
    +++ description: None
      address:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "eth:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
    }
```

```diff
    EOA  (0xA12Cf34001e553dc254D131105364351f5174d75) {
    +++ description: None
      address:
-        "0xA12Cf34001e553dc254D131105364351f5174d75"
+        "eth:0xA12Cf34001e553dc254D131105364351f5174d75"
    }
```

```diff
    EOA  (0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4) {
    +++ description: None
      address:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      address:
-        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      values.addressManager:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
+        "eth:0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.0xA6b2b6B6E621482aF877F304D46B94123a942Ae9:
-        "ProxyAdmin"
      implementationNames.eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xb6E2Eee22b684f6AAb2083097F7E874994bA930e) {
    +++ description: None
      address:
-        "0xb6E2Eee22b684f6AAb2083097F7E874994bA930e"
+        "eth:0xb6E2Eee22b684f6AAb2083097F7E874994bA930e"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
+        "eth:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      values.$admin:
-        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      values.$implementation:
-        "0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C"
+        "eth:0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C"
      values.$pastUpgrades.0.2.0:
-        "0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C"
+        "eth:0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C"
      values.BRIDGE:
-        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
+        "eth:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      implementationNames.0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B:
-        "Proxy"
      implementationNames.0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B:
+        "Proxy"
      implementationNames.eth:0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
+        "eth:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      values.$admin:
-        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      values.$implementation:
-        "0xAaa6cF2EFB6cfB5f6887366cC9ce242899f495A1"
+        "eth:0xAaa6cF2EFB6cfB5f6887366cC9ce242899f495A1"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
+        "eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
      values.MESSENGER:
-        "0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
+        "eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      implementationNames.0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc:
-        "L1ChugSplashProxy"
      implementationNames.0xAaa6cF2EFB6cfB5f6887366cC9ce242899f495A1:
-        "L1StandardBridge"
      implementationNames.eth:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc:
+        "L1ChugSplashProxy"
      implementationNames.eth:0xAaa6cF2EFB6cfB5f6887366cC9ce242899f495A1:
+        "L1StandardBridge"
    }
```

```diff
    EOA  (0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C) {
    +++ description: None
      address:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "eth:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
    }
```

```diff
    EOA  (0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0) {
    +++ description: None
      address:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

```diff
    EOA  (0xF3313C48BD8E17b823d5498D62F37019dFEA647D) {
    +++ description: None
      address:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "eth:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      values.$admin:
-        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      values.$implementation:
-        "0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC"
+        "eth:0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC"
      values.$pastUpgrades.0.2.0:
-        "0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC"
+        "eth:0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC"
      values.batcherHash:
-        "0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00"
+        "eth:0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.sequencerInbox:
-        "0xA12Cf34001e553dc254D131105364351f5174d75"
+        "eth:0xA12Cf34001e553dc254D131105364351f5174d75"
      values.unsafeBlockSigner:
-        "0x2919934b66E68B1b6E0d32258B6DE9954463e183"
+        "eth:0x2919934b66E68B1b6E0d32258B6DE9954463e183"
      implementationNames.0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c:
-        "Proxy"
      implementationNames.0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC:
-        "SystemConfig"
      implementationNames.eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c:
+        "Proxy"
      implementationNames.eth:0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC:
+        "SystemConfig"
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
+        "eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      values.$admin:
-        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      values.$implementation:
-        "0x68c36689D9820D78F53CF384D06199b061cc948b"
+        "eth:0x68c36689D9820D78F53CF384D06199b061cc948b"
      values.$pastUpgrades.0.2.0:
-        "0x68c36689D9820D78F53CF384D06199b061cc948b"
+        "eth:0x68c36689D9820D78F53CF384D06199b061cc948b"
      values.CHALLENGER:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.PROPOSER:
-        "0xb6E2Eee22b684f6AAb2083097F7E874994bA930e"
+        "eth:0xb6E2Eee22b684f6AAb2083097F7E874994bA930e"
      implementationNames.0xffB004874CbBF8692B5f397B602f4B8a630aeD59:
-        "Proxy"
      implementationNames.0x68c36689D9820D78F53CF384D06199b061cc948b:
-        "L2OutputOracle"
      implementationNames.eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59:
+        "Proxy"
      implementationNames.eth:0x68c36689D9820D78F53CF384D06199b061cc948b:
+        "L2OutputOracle"
    }
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

Generated with discovered.json: 0xf76c6f16175ee1d7203e52ec7ebfb00bf8bc03b3

# Diff at Mon, 14 Jul 2025 08:02:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22895950
- current block number: 22895950

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895950 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xba7f41dc0c21f666642873e8d2c9c0352549cf13

# Diff at Fri, 04 Jul 2025 12:19:23 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615679
- current block number: 22615679

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615679 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
+        "eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      receivedPermissions.1.from:
-        "ethereum:0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
+        "eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      receivedPermissions.2.from:
-        "ethereum:0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
+        "eth:0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      receivedPermissions.3.from:
-        "ethereum:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      receivedPermissions.4.from:
-        "ethereum:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
+        "eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      receivedPermissions.5.from:
-        "ethereum:0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
+        "eth:0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      receivedPermissions.6.from:
-        "ethereum:0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
+        "eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      receivedPermissions.7.from:
-        "ethereum:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
+        "eth:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      receivedPermissions.8.from:
-        "ethereum:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
+        "eth:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      receivedPermissions.9.via.0.address:
-        "ethereum:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      receivedPermissions.9.from:
-        "ethereum:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.10.via.0.address:
-        "ethereum:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      receivedPermissions.10.from:
-        "ethereum:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
+        "eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
+        "eth:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
    }
```

```diff
    EOA  (0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
+        "eth:0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
+        "eth:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
+        "eth:0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
+        "eth:0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
+        "eth:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
+        "eth:0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "eth:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
+        "eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
    }
```

```diff
    EOA  (0xb6E2Eee22b684f6AAb2083097F7E874994bA930e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
+        "eth:0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
    }
```

Generated with discovered.json: 0x779358211b6f98fd960670e640af4d7b3834b2ad

# Diff at Mon, 16 Jun 2025 08:43:20 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22615679
- current block number: 22615679

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615679 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"ethereum:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B","role":"admin","via":[{"address":"ethereum:0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.9.from:
-        "ethereum:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
+        "ethereum:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.8.from:
-        "ethereum:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "ethereum:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
    }
```

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"ethereum:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B","role":"admin"}
      directlyReceivedPermissions.6.from:
-        "ethereum:0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
+        "ethereum:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "ethereum:0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"
    }
```

Generated with discovered.json: 0x121e9c6ecdbfb23103e435d01dfdfce3adc7ce62

# Diff at Mon, 02 Jun 2025 08:02:26 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22046075
- current block number: 22615679

## Description

conduit ms signer change.

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.10:
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.9:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.8:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.7:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x70f44f52857ae9b02bd718c3423914aacf4ff549

# Diff at Fri, 30 May 2025 07:16:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22046075
- current block number: 22046075

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046075 (main branch discovery), not current.

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0xae6b4dfd75e8cdb4b88c219690352b6870820204

# Diff at Fri, 23 May 2025 09:41:05 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22046075
- current block number: 22046075

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046075 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.9.role:
+        ".GUARDIAN"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.permission:
-        "challenge"
+        "upgrade"
      receivedPermissions.7.from:
-        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.7.via:
+        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.6.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.6.from:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      receivedPermissions.6.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.6.via:
+        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.5.from:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.4.via:
-        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.4.role:
+        ".CHALLENGER"
      receivedPermissions.3.from:
-        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
+        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.from:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.2.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.via:
-        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
+        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      receivedPermissions.1.description:
+        "set and change address mappings."
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.2.from:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
+        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      directlyReceivedPermissions.2.description:
-        "set and change address mappings."
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.1.from:
-        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
+        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      directlyReceivedPermissions.1.description:
+        "set and change address mappings."
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    EOA  (0xb6E2Eee22b684f6AAb2083097F7E874994bA930e) {
    +++ description: None
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

Generated with discovered.json: 0xd7f580b2657adcba0715acc7361f475141c9718f

# Diff at Tue, 29 Apr 2025 08:19:13 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22046075
- current block number: 22046075

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046075 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}]
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}]
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}]
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}]
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}]
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"propose","to":"0xb6E2Eee22b684f6AAb2083097F7E874994bA930e","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}]
    }
```

Generated with discovered.json: 0xe517bca173dbb1da6284180e36cab1c1d31389c4

# Diff at Thu, 27 Mar 2025 11:15:29 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22046075
- current block number: 22046075

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046075 (main branch discovery), not current.

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x34afaf0a54d8b40ae090316523b3ba3dc49ea22e

# Diff at Tue, 18 Mar 2025 08:14:16 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22046075
- current block number: 22046075

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046075 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ConduitMultisig"
+        "Conduit Multisig 1"
    }
```

Generated with discovered.json: 0xa8c30c871e80ba49130f4bf2f8371d6c5079bd5c

# Diff at Fri, 14 Mar 2025 15:41:47 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21637088
- current block number: 22046075

## Description

Conduit MS changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.9:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.8:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.7:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.6:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.5:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.4:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.3:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.2:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.1:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.0:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 9 (44%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x953d5421446a0747def18136828fa8f1d385b3df

# Diff at Tue, 04 Mar 2025 11:26:38 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21637088
- current block number: 21637088

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x984808d7273fbd04ed32a7015b36c164d4e5618c

# Diff at Tue, 04 Mar 2025 10:40:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21637088
- current block number: 21637088

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19314572
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19314575
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19314568
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19314565
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      sinceBlock:
+        19314566
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        19314574
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19314571
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19314570
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19314569
    }
```

Generated with discovered.json: 0xe2ce1d5875131eb32e7e6ee19de23e22a0aeafa0

# Diff at Wed, 26 Feb 2025 10:33:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21637088
- current block number: 21637088

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x7b9e1443bfca21d7068f4a3b06a1cdb20d169859

# Diff at Fri, 21 Feb 2025 14:11:11 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21637088
- current block number: 21637088

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xe964a47d63720176060d373b4ae58a9600e38f36

# Diff at Fri, 21 Feb 2025 09:00:20 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21637088
- current block number: 21637088

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x1e5e1146485d75fe9df95976bbb559c4957e3b71

# Diff at Mon, 10 Feb 2025 19:04:52 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637088
- current block number: 21637088

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x36359369efaf7d4a1ce8f48166546d5f41a80f07

# Diff at Tue, 04 Feb 2025 12:33:09 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637088
- current block number: 21637088

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.from:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      receivedPermissions.2.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "set and change address mappings."
      receivedPermissions.2.via:
+        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
+        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.1.description:
-        "set and change address mappings."
      receivedPermissions.1.via:
-        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xe2c545d8d815f88e832a5000cad0dd2e63192b65

# Diff at Mon, 20 Jan 2025 11:10:12 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637088
- current block number: 21637088

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.9.target:
-        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      receivedPermissions.9.from:
+        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      receivedPermissions.8.target:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.8.from:
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.7.target:
-        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      receivedPermissions.7.from:
+        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      receivedPermissions.6.target:
-        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      receivedPermissions.6.from:
+        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      receivedPermissions.5.target:
-        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.5.from:
+        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.4.target:
-        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      receivedPermissions.4.from:
+        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      receivedPermissions.3.target:
-        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.3.from:
+        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.2.target:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.2.from:
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.1.target:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      receivedPermissions.1.from:
+        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      receivedPermissions.0.target:
-        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      receivedPermissions.0.from:
+        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      directlyReceivedPermissions.0.target:
-        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      directlyReceivedPermissions.0.from:
+        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      directlyReceivedPermissions.6.from:
+        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      directlyReceivedPermissions.5.target:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      directlyReceivedPermissions.5.from:
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      directlyReceivedPermissions.4.target:
-        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      directlyReceivedPermissions.4.from:
+        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      directlyReceivedPermissions.3.target:
-        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      directlyReceivedPermissions.3.from:
+        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      directlyReceivedPermissions.2.target:
-        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      directlyReceivedPermissions.2.from:
+        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      directlyReceivedPermissions.1.target:
-        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      directlyReceivedPermissions.1.from:
+        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      directlyReceivedPermissions.0.target:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      directlyReceivedPermissions.0.from:
+        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00"
      issuedPermissions.1.to:
+        "0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0xb6E2Eee22b684f6AAb2083097F7E874994bA930e"
      issuedPermissions.1.to:
+        "0xb6E2Eee22b684f6AAb2083097F7E874994bA930e"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

Generated with discovered.json: 0x26cf8a2a75f8a66f95dc0d234775c76fce8d648d

# Diff at Thu, 16 Jan 2025 12:37:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21078678
- current block number: 21637088

## Description

ConduitMultisig signer changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.8:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.7:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.3:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.2:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.1:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x69a8e73040a7c32c79e2f3e3d31c45e629d36b46

# Diff at Wed, 08 Jan 2025 09:07:11 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21078678
- current block number: 21078678

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078678 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xcaae15ffe19cc41fb5e0e3ba268e2b013d9c34a5

# Diff at Fri, 01 Nov 2024 12:10:42 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078678
- current block number: 21078678

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078678 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x5217e962e38fd405e40eaa767548cd21f0fd0e0b

# Diff at Wed, 30 Oct 2024 13:13:03 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20770354
- current block number: 21078678

## Description

Conduit MS: Signer added.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.7:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.6:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.5:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.4:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.3:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.2:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.1:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.0:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x4eec49f9e023317087b6f0acb3d01c530b2d2353

# Diff at Tue, 29 Oct 2024 13:18:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x30c3f96e75edbbcc57c1efee09eb49e64193a5f9

# Diff at Mon, 21 Oct 2024 12:49:10 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

Generated with discovered.json: 0x30be0d5e16d682f8d891eaed75716425c295c254

# Diff at Mon, 21 Oct 2024 11:10:55 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0xfe0651694489eb60Bb93031C9C32318b0E1Fe200"]
      values.$pastUpgrades.1.1:
-        ["0xfe0651694489eb60Bb93031C9C32318b0E1Fe200"]
+        "0x3b403a7edc0424fc8660fc853602e5229bee91b99835874234266f9e384648ca"
      values.$pastUpgrades.0.2:
+        ["0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"]
      values.$pastUpgrades.0.1:
-        ["0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"]
+        "0x53bf303148a69eda22c6f29f31372131bb2bfe421327ce311c8288fecee8b453"
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0xf7110272725E2036fc21294E9468EBD635800381"]
      values.$pastUpgrades.0.1:
-        ["0xf7110272725E2036fc21294E9468EBD635800381"]
+        "0xdef02483fe5ae6b828fbdf7a5507571ff8b84c7366a7a1ff2fdfb58b32ee62d1"
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D"]
      values.$pastUpgrades.0.1:
-        ["0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D"]
+        "0xc16982082473ed47dd39f1a749df2b88e5de7e839f73078a6522f0568eaee7c3"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C"]
      values.$pastUpgrades.0.1:
-        ["0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C"]
+        "0xbc6397329262295625fd9b6a92aee4238b4b10218c4b5a1c7fd3a215f1b83af2"
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC"]
      values.$pastUpgrades.0.1:
-        ["0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC"]
+        "0x071cf08d571356b15dd25a2e1d04c9d546a99a0225a9c1432c488c79b51d1e72"
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x68c36689D9820D78F53CF384D06199b061cc948b"]
      values.$pastUpgrades.0.1:
-        ["0x68c36689D9820D78F53CF384D06199b061cc948b"]
+        "0x8d66763445eafc294b65f30198fc784a5dd37419bc41b103db48d980c56113d2"
    }
```

Generated with discovered.json: 0x286366d93e8ae893c24380dcbaacd76c18ac00e6

# Diff at Wed, 16 Oct 2024 11:40:53 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xffB004874CbBF8692B5f397B602f4B8a630aeD59","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.7.target:
-        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
+        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      receivedPermissions.7.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.6.target:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      receivedPermissions.5.target:
-        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
+        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.5.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.4.target:
-        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
+        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      receivedPermissions.3.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.3.via:
-        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.2.via:
-        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.2.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.target:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "set and change address mappings."
      receivedPermissions.1.via:
+        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
+        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      receivedPermissions.0.description:
-        "set and change address mappings."
      receivedPermissions.0.via:
-        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.0:
-        {"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00"
      issuedPermissions.1.via.0:
-        {"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xb6E2Eee22b684f6AAb2083097F7E874994bA930e","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.via.0:
-        {"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}
    }
```

Generated with discovered.json: 0x66f7214bcfe1fb14aa4634bce5f1ed13f7d2a03b

# Diff at Mon, 14 Oct 2024 10:56:25 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"]
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x95c690f70db8f82a05347087d704333c180048757ff015d74a5b186c1b6b24ab"]
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xc8aea1ad75944084aeb3dc8b5c63135af405055da6baaffde3ed51e92c91e2eb"]
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"]
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"]
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"]
    }
```

Generated with discovered.json: 0xe097700b121aecacac262152e2fc8a7c66b21b9b

# Diff at Wed, 09 Oct 2024 13:10:47 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x2d80c02ca9c3658d1e72b530108fb9ddf9d96690

# Diff at Tue, 01 Oct 2024 11:10:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-02-26T22:00:11.000Z",["0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"]],["2024-02-26T22:04:23.000Z",["0xfe0651694489eb60Bb93031C9C32318b0E1Fe200"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-02-26T22:03:35.000Z",["0xf7110272725E2036fc21294E9468EBD635800381"]]]
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-02-26T22:05:11.000Z",["0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-02-26T22:03:47.000Z",["0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C"]]]
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-02-26T22:02:47.000Z",["0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC"]]]
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-02-26T22:04:47.000Z",["0x68c36689D9820D78F53CF384D06199b061cc948b"]]]
    }
```

Generated with discovered.json: 0xda4b7623d6ddc3ef7d2036f75b8d77252ae778f1

# Diff at Wed, 18 Sep 2024 11:34:50 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20770354

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

