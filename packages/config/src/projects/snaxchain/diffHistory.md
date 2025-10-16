Generated with discovered.json: 0x3c41b23f7e38399df70df4c05d2a34363e513fcc

# Diff at Fri, 03 Oct 2025 08:44:10 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1758699468
- current timestamp: 1759480976

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

Generated with discovered.json: 0xf0f2db2a964656fe999ab689f6c38f81f0837180

# Diff at Wed, 24 Sep 2025 07:38:54 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d7323b1d7fcd47448cd95a9f8ee7b4214e04c807 block: 1757661625
- current timestamp: 1758699468

## Description

system config owner moved from conduit msig to EOA.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","role":".owner"}
    }
```

```diff
    contract SystemConfig (eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.owner:
-        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x6cd3f878852769e04A723A5f66CA7DD4d9E38A6C"
    }
```

Generated with discovered.json: 0xf24e2c3d074a5cce2692c2e440beb8413d3a85fb

# Diff at Mon, 15 Sep 2025 09:50:51 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@37882e40cb6029f3a2ae2bb177048e3e846b833d block: 1757661625
- current timestamp: 1757661625

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1757661625 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0x0fD13C7f11d95070cE5CF31BAf1aCf9355BF4578) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.gameImpls.2:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.gameImpls.3:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x07cece711c3618fd2278b0b7028908d500c8e09a

# Diff at Fri, 12 Sep 2025 07:21:30 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b19dd572d1bb478c9bacfee5598e38f6eee363a0 block: 1756214657
- current timestamp: 1757661625

## Description

gas fees increase.

## Watched changes

```diff
    contract SystemConfig (eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.basefeeScalar:
-        8892000
+        13338000
    }
```

Generated with discovered.json: 0xe121d95fd7c13058e560a2ef7ac9e47a4adbebb7

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x3eb489efb0be1b8e81a73ad6d7e68ce14b8f587b

# Diff at Tue, 26 Aug 2025 13:32:59 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e10932be0db538f3a760bbc29232375f08915af7 block: 1755009465
- current timestamp: 1756214657

## Description

Conduit msig: removed one address and increased basefeeScalar and added blobbasefeeScalar.

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
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.basefeeScalar:
-        6840000
+        8892000
      values.blobbasefeeScalar:
-        0
+        611590
    }
```

Generated with discovered.json: 0x960b8ebf0ecc4d52ba2b489f76754c5b283cb8ea

# Diff at Tue, 12 Aug 2025 14:42:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1754911726
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

Generated with discovered.json: 0xb379b0bb89c26107042dd2dc4b09ea9a23006010

# Diff at Mon, 11 Aug 2025 11:28:59 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1753462283
- current timestamp: 1754911726

## Description

basefeeScalar x10.

## Watched changes

```diff
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.basefeeScalar:
-        684000
+        6840000
    }
```

Generated with discovered.json: 0xebfd33cdcaa65efe8171ae51a0d9301cc654d10f

# Diff at Fri, 25 Jul 2025 15:49:56 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@85b717d6efe0c0a7691beb49532a0ce49bb7634a block: 22975748
- current block number: 22997060

## Description

Conduit: Optiportal2 upgrade (permissioned gametype). All contracts are using standard implementations.

absolute prestate: v1.6.0 (cannon64)

standard 3.5; 3.5; 7 finality conf

## Watched changes

```diff
-   Status: DELETED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
-   Status: DELETED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
-   Status: DELETED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
    contract L1CrossDomainMessenger (0x2A4fC0E3B365052d71B9853Efd0123985559f62E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.3:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]]
      values.$pastUpgrades.4:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"]]
      values.$upgradeCount:
-        3
+        5
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
-   Status: DELETED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
    contract L1ERC721Bridge (0x45561F85e43Ac0d2258c0F0C16540ce128EA1634) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.3:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.4:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
      values.$upgradeCount:
-        3
+        5
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
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"challenge","from":"eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25","role":".challenger"}
      receivedPermissions.1.role:
-        ".CHALLENGER"
+        ".challenger"
      receivedPermissions.1.from:
-        "eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "eth:0x1B780edfb393CB9f07Dcd7C699CBDF0fd663572b"
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0xa3596ceeC35c004E560f57937bD695dbd22FEFcc","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x0fD13C7f11d95070cE5CF31BAf1aCf9355BF4578","role":"admin","via":[{"address":"eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0x1E94368370862cEf26DDb187CA44EBD74DA87Ad1","role":"admin","via":[{"address":"eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6","role":"admin","via":[{"address":"eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"eth:0xa3596ceeC35c004E560f57937bD695dbd22FEFcc","role":"admin","via":[{"address":"eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}
      receivedPermissions.13:
-        {"permission":"upgrade","from":"eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25","role":"admin","via":[{"address":"eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}
    }
```

```diff
-   Status: DELETED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
    contract ProxyAdmin (0x672B75103c0CbFdCC4A40737a80724f87a8A25D7) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x0fD13C7f11d95070cE5CF31BAf1aCf9355BF4578","role":"admin"}
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x1E94368370862cEf26DDb187CA44EBD74DA87Ad1","role":"admin"}
      directlyReceivedPermissions.3:
-        {"permission":"upgrade","from":"eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6","role":"admin"}
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xa3596ceeC35c004E560f57937bD695dbd22FEFcc","role":"admin"}
      directlyReceivedPermissions.8:
-        {"permission":"upgrade","from":"eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25","role":"admin"}
    }
```

```diff
-   Status: DELETED
    contract SuperchainConfig (0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
-   Status: DELETED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
    EOA  (0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"propose","from":"eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25","role":".proposer"}
      receivedPermissions.1.role:
-        ".PROPOSER"
+        ".proposer"
      receivedPermissions.1.from:
-        "eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "eth:0x1B780edfb393CB9f07Dcd7C699CBDF0fd663572b"
    }
```

```diff
    contract OptimismPortal2 (0x936D881b4760D5e9b6D55b774f65c509236b4743) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      name:
-        "OptimismPortal"
+        "OptimismPortal2"
      template:
-        "opstack/OptimismPortal"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0x8c9491e689f31c280886abc8ea05ec6ac8d5394be56da8048ab9efeca67c4a3c"
+        "0xc483ef9e0a5ec2a0450732e743b3784de0cd3876b8fadfce14c0805a0846d26b"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
      values.$implementation:
-        "eth:0x79f446D024d74D0Bb6E699C131c703463c5D65E9"
+        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.1:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.3:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]]
      values.$pastUpgrades.4:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"]]
      values.$upgradeCount:
-        1
+        5
      values.guardian:
-        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.l2Oracle:
-        "eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      values.superchainConfig:
-        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      values.version:
-        "2.8.0"
+        "3.14.0"
      values.disputeGameFactory:
+        "eth:0x0fD13C7f11d95070cE5CF31BAf1aCf9355BF4578"
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
+        1753372763
      implementationNames.eth:0x79f446D024d74D0Bb6E699C131c703463c5D65E9:
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
-   Status: DELETED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
-   Status: DELETED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.2:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.3:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.4:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$pastUpgrades.5:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]]
      values.$upgradeCount:
-        2
+        6
      values.basefeeScalar:
-        0
+        684000
      values.disputeGameFactory:
-        "eth:0x8aF5b3ED56D4a822532A07a84C499d600eCD5cf5"
+        "eth:0x0fD13C7f11d95070cE5CF31BAf1aCf9355BF4578"
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
+        {"l1CrossDomainMessenger":"eth:0x2A4fC0E3B365052d71B9853Efd0123985559f62E","l1ERC721Bridge":"eth:0x45561F85e43Ac0d2258c0F0C16540ce128EA1634","l1StandardBridge":"eth:0xA5fb68C24b02852e8B514E98A1014faf12547Fa5","disputeGameFactory":"eth:0x0fD13C7f11d95070cE5CF31BAf1aCf9355BF4578","optimismPortal":"eth:0x936D881b4760D5e9b6D55b774f65c509236b4743","optimismMintableERC20Factory":"eth:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"}
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
    contract L1StandardBridge (0xA5fb68C24b02852e8B514E98A1014faf12547Fa5) {
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
-   Status: DELETED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
-   Status: DELETED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
    contract OptimismMintableERC20Factory (0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.2:
+        ["2025-07-24T15:59:23.000Z","0x11d884e749d033f810dd5b1870d6384533484320467474a470a90fd64ec0b986",["eth:0x5493f4677A186f64805fe7317D6993ba4863988F"]]
      values.$upgradeCount:
-        2
+        3
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
-   Status: DELETED
    contract L2OutputOracle (0xF8f3EbF2469C00A00EA9D1D04913B73896268B25)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x0fD13C7f11d95070cE5CF31BAf1aCf9355BF4578)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x1B780edfb393CB9f07Dcd7C699CBDF0fd663572b)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x1E94368370862cEf26DDb187CA44EBD74DA87Ad1)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xa3596ceeC35c004E560f57937bD695dbd22FEFcc)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

## Source code changes

```diff
.../dev/null                                       |  152 -
 .../AddressManager.sol}                            |    0
 .../AnchorStateRegistry/AnchorStateRegistry.sol}   |  369 +-
 .../AnchorStateRegistry}/Proxy.p.sol               |    0
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  608 +++
 .../DelayedWETH}/Proxy.p.sol                       |    0
 .../DeputyGuardianModule.sol => /dev/null          |  156 -
 .../DeputyPauseModule.sol => /dev/null             | 1338 -------
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1482 +++++++
 .../DisputeGameFactory}/Proxy.p.sol                |    0
 .../GnosisSafe/GnosisSafe.sol => /dev/null         |  953 -----
 .../GnosisSafe/GnosisSafeProxy.p.sol => /dev/null  |   35 -
 .../L1CrossDomainMessenger.sol                     |  736 +++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  418 +-
 .../L1StandardBridge/L1StandardBridge.sol          |  508 ++-
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../.flat@22975748/LivenessGuard.sol => /dev/null  |  582 ---
 .../.flat@22975748/LivenessModule.sol => /dev/null |  258 --
 .../src/projects/snaxchain/ethereum/.flat/MIPS.sol | 2515 ++++++++++++
 .../GnosisSafe.sol => /dev/null                    |  959 -----
 .../Proxy.p.sol => /dev/null                       |   39 -
 .../GnosisSafe.sol => /dev/null                    |  953 -----
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../GnosisSafe.sol => /dev/null                    |  953 -----
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../GnosisSafe.sol => /dev/null                    |  953 -----
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal2/OptimismPortal2.sol}           |  993 +++--
 .../OptimismPortal2}/Proxy.p.sol                   |    0
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4121 ++++++++++++++++++++
 .../snaxchain/ethereum/.flat/PreimageOracle.sol    | 1311 +++++++
 .../SuperchainConfig}/Proxy.p.sol                  |    0
 .../SuperchainConfig}/SuperchainConfig.sol         |    0
 .../SuperchainConfig.sol => /dev/null              |  477 ---
 .../SuperchainProxyAdmin.sol => /dev/null          |  298 --
 .../GnosisSafe.sol => /dev/null                    |  953 -----
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 .../SystemConfig/SystemConfig.sol                  | 1439 +------
 39 files changed, 11992 insertions(+), 12416 deletions(-)
```

Generated with discovered.json: 0xf00d093d04e15b76d99eb23d1c4691fc713ef8f5

# Diff at Tue, 22 Jul 2025 15:56:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 22895949
- current block number: 22975748

## Description

Conduit: Upgrade to known OP stack contracts. (no OptiPortal2 yet).

## Watched changes

```diff
    contract L1CrossDomainMessenger (0x2A4fC0E3B365052d71B9853Efd0123985559f62E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x6bee26e08bb3e482693649b598e8c0423de9025ebebdc773e9a2f9aa6f362478"
+        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
      values.$implementation:
-        "eth:0x6FA678A10e4FE9C6B7678948100D9B59CCF6B84a"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.1:
+        ["2025-07-21T15:15:47.000Z","0xc14fc7e04d919c5d83b4fff381a1a8643f9d93654866daff6e03d9136dd8ea44",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T15:15:47.000Z","0xc14fc7e04d919c5d83b4fff381a1a8643f9d93654866daff6e03d9136dd8ea44",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$upgradeCount:
-        1
+        3
      values.superchainConfig:
-        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      values.systemConfig:
-        "eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
      values.version:
-        "2.4.0"
+        "2.3.0"
      implementationNames.eth:0x6FA678A10e4FE9C6B7678948100D9B59CCF6B84a:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract L1ERC721Bridge (0x45561F85e43Ac0d2258c0F0C16540ce128EA1634) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$implementation:
-        "eth:0x1b0F7Dd06F9c9EDdE9d5e4E86aC6Ea20aC1bBe42"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.1:
+        ["2025-07-21T15:15:47.000Z","0xc14fc7e04d919c5d83b4fff381a1a8643f9d93654866daff6e03d9136dd8ea44",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-07-21T15:15:47.000Z","0xc14fc7e04d919c5d83b4fff381a1a8643f9d93654866daff6e03d9136dd8ea44",["eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$upgradeCount:
-        1
+        3
      values.superchainConfig:
-        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      implementationNames.eth:0x1b0F7Dd06F9c9EDdE9d5e4E86aC6Ea20aC1bBe42:
-        "L1ERC721Bridge"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"guard","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":".guardian"}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC","role":"admin","via":[{"address":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5"}]}
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5","role":".owner"}
    }
```

```diff
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x958268b83f73163b36af36fa55f5c0905421c07369bff2791652da02fa692a42"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "eth:0xd5FE2D6Fce4f30336E7738B99D3A2aAE23DE3827"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.1:
+        ["2025-07-21T15:15:47.000Z","0xc14fc7e04d919c5d83b4fff381a1a8643f9d93654866daff6e03d9136dd8ea44",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "2.2.0"
+        "2.3.0"
      values.basefeeScalar:
+        0
      values.blobbasefeeScalar:
+        0
+++ description: volatility param: lower denominator -> quicker fee changes on L2
      values.eip1559Denominator:
+        0
      values.eip1559Elasticity:
+        0
      implementationNames.eth:0xd5FE2D6Fce4f30336E7738B99D3A2aAE23DE3827:
-        "SystemConfig"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
    }
```

```diff
    contract L1StandardBridge (0xA5fb68C24b02852e8B514E98A1014faf12547Fa5) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x0c1c0a5eff46fa1b105a2cabe6ce2b7a7fbac2f58af57392b196f8fe5768bd2a"
+        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
      values.$implementation:
-        "eth:0x6534Bdb6b5c060d3e6aa833433333135eFE8E0aA"
+        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.superchainConfig:
-        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC"
      values.systemConfig:
-        "eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
      values.version:
-        "2.2.0"
+        "2.1.0"
      implementationNames.eth:0x6534Bdb6b5c060d3e6aa833433333135eFE8E0aA:
-        "L1StandardBridge"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$implementation:
-        "eth:0xc8cBf9124a4dF9B0776CAf1BA5604E6AAD15F42F"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.1:
+        ["2025-07-21T15:15:47.000Z","0xc14fc7e04d919c5d83b4fff381a1a8643f9d93654866daff6e03d9136dd8ea44",["eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.eth:0xc8cBf9124a4dF9B0776CAf1BA5604E6AAD15F42F:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
+        "OptimismMintableERC20Factory"
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
.../L1CrossDomainMessenger.sol                     | 269 ++++--------
 .../L1StandardBridge/L1StandardBridge.sol          | 276 ++++--------
 ...0x672B75103c0CbFdCC4A40737a80724f87a8A25D7.sol} |   0
 ...:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5.sol | 298 +++++++++++++
 .../Proxy.p.sol                                    | 200 +++++++++
 .../SuperchainConfig.sol                           | 477 +++++++++++++++++++++
 .../SystemConfig/SystemConfig.sol                  | 104 ++++-
 7 files changed, 1213 insertions(+), 411 deletions(-)
```

Generated with discovered.json: 0x80706797f152f37cfb8b9be51a4e5437f8404437

# Diff at Mon, 14 Jul 2025 12:46:17 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22895949
- current block number: 22895949

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895949 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      address:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      description:
-        "used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
+        "used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
      values.fallbackOwner:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
+        "eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      values.livenessGuard:
-        "0x24424336F04440b1c28685a38303aC33C9D14a25"
+        "eth:0x24424336F04440b1c28685a38303aC33C9D14a25"
      values.safe:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      implementationNames.0x0454092516c9A4d636d3CAfA1e82161376C8a748:
-        "LivenessModule"
      implementationNames.eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748:
+        "LivenessModule"
    }
```

```diff
    EOA  (0x060b915cA4904b56adA63565626b9c97F6CaD212) {
    +++ description: None
      address:
-        "0x060b915cA4904b56adA63565626b9c97F6CaD212"
+        "eth:0x060b915cA4904b56adA63565626b9c97F6CaD212"
    }
```

```diff
    EOA  (0x07dC0893cAfbF810e3E72505041f2865726Fd073) {
    +++ description: None
      address:
-        "0x07dC0893cAfbF810e3E72505041f2865726Fd073"
+        "eth:0x07dC0893cAfbF810e3E72505041f2865726Fd073"
    }
```

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      values.GnosisSafe_modules.0:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      implementationNames.0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x0aA384EB2fedD2741277A0f72909A0d7275575D7) {
    +++ description: None
      address:
-        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
+        "eth:0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
    }
```

```diff
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C) {
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
      address:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      description:
-        "Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module."
+        "Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module."
      values.deputy:
-        "0x352f1defB49718e7Ea411687E850aA8d6299F7aC"
+        "eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC"
      values.deputyGuardianModule:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      values.eip712Domain.verifyingContract:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.foundationSafe:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x126a736B18E0a64fBA19D421647A530E327E112C:
-        "DeputyPauseModule"
      implementationNames.eth:0x126a736B18E0a64fBA19D421647A530E327E112C:
+        "DeputyPauseModule"
    }
```

```diff
    EOA  (0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e) {
    +++ description: None
      address:
-        "0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e"
+        "eth:0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e"
    }
```

```diff
    EOA  (0x22c48998635C2D7Ea8B82aB50761f2c1EEae5D21) {
    +++ description: None
      address:
-        "0x22c48998635C2D7Ea8B82aB50761f2c1EEae5D21"
+        "eth:0x22c48998635C2D7Ea8B82aB50761f2c1EEae5D21"
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      address:
-        "0x24424336F04440b1c28685a38303aC33C9D14a25"
+        "eth:0x24424336F04440b1c28685a38303aC33C9D14a25"
      receivedPermissions.0.description:
-        "can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."
+        "can remove members of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."
      values.safe:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      implementationNames.0x24424336F04440b1c28685a38303aC33C9D14a25:
-        "LivenessGuard"
      implementationNames.eth:0x24424336F04440b1c28685a38303aC33C9D14a25:
+        "LivenessGuard"
    }
```

```diff
    contract L1CrossDomainMessenger (0x2A4fC0E3B365052d71B9853Efd0123985559f62E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
+        "eth:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
      values.$admin:
-        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      values.$implementation:
-        "0x6FA678A10e4FE9C6B7678948100D9B59CCF6B84a"
+        "eth:0x6FA678A10e4FE9C6B7678948100D9B59CCF6B84a"
      values.$pastUpgrades.0.2.0:
-        "0x6FA678A10e4FE9C6B7678948100D9B59CCF6B84a"
+        "eth:0x6FA678A10e4FE9C6B7678948100D9B59CCF6B84a"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "eth:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      values.PORTAL:
-        "0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "eth:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      values.ResolvedDelegateProxy_addressManager:
-        "0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
+        "eth:0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
      values.superchainConfig:
-        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      values.systemConfig:
-        "0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
      implementationNames.0x2A4fC0E3B365052d71B9853Efd0123985559f62E:
-        "ResolvedDelegateProxy"
      implementationNames.0x6FA678A10e4FE9C6B7678948100D9B59CCF6B84a:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x2A4fC0E3B365052d71B9853Efd0123985559f62E:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x6FA678A10e4FE9C6B7678948100D9B59CCF6B84a:
+        "L1CrossDomainMessenger"
    }
```

```diff
    EOA  (0x3041BA32f451F5850c147805F5521AC206421623) {
    +++ description: None
      address:
-        "0x3041BA32f451F5850c147805F5521AC206421623"
+        "eth:0x3041BA32f451F5850c147805F5521AC206421623"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      address:
-        "0x352f1defB49718e7Ea411687E850aA8d6299F7aC"
+        "eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC"
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
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      address:
-        "0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
+        "eth:0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5"
+        "eth:0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5"
      values.$members.1:
-        "0x4665374939642965EfD8357D4568D2A77f677429"
+        "eth:0x4665374939642965EfD8357D4568D2A77f677429"
      implementationNames.0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract L1ERC721Bridge (0x45561F85e43Ac0d2258c0F0C16540ce128EA1634) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
+        "eth:0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
      values.$admin:
-        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      values.$implementation:
-        "0x1b0F7Dd06F9c9EDdE9d5e4E86aC6Ea20aC1bBe42"
+        "eth:0x1b0F7Dd06F9c9EDdE9d5e4E86aC6Ea20aC1bBe42"
      values.$pastUpgrades.0.2.0:
-        "0x1b0F7Dd06F9c9EDdE9d5e4E86aC6Ea20aC1bBe42"
+        "eth:0x1b0F7Dd06F9c9EDdE9d5e4E86aC6Ea20aC1bBe42"
      values.messenger:
-        "0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
+        "eth:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
      values.MESSENGER:
-        "0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
+        "eth:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      implementationNames.0x45561F85e43Ac0d2258c0F0C16540ce128EA1634:
-        "Proxy"
      implementationNames.0x1b0F7Dd06F9c9EDdE9d5e4E86aC6Ea20aC1bBe42:
-        "L1ERC721Bridge"
      implementationNames.eth:0x45561F85e43Ac0d2258c0F0C16540ce128EA1634:
+        "Proxy"
      implementationNames.eth:0x1b0F7Dd06F9c9EDdE9d5e4E86aC6Ea20aC1bBe42:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0x4665374939642965EfD8357D4568D2A77f677429) {
    +++ description: None
      address:
-        "0x4665374939642965EfD8357D4568D2A77f677429"
+        "eth:0x4665374939642965EfD8357D4568D2A77f677429"
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
    EOA  (0x4A7322258c9E690e4CB8Cea6e5251443E956e61E) {
    +++ description: None
      address:
-        "0x4A7322258c9E690e4CB8Cea6e5251443E956e61E"
+        "eth:0x4A7322258c9E690e4CB8Cea6e5251443E956e61E"
    }
```

```diff
    EOA  (0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15) {
    +++ description: None
      address:
-        "0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
+        "eth:0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
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
    EOA  (0x51aCb8e1205De850D1b512584FeE9C29C3813dDa) {
    +++ description: None
      address:
-        "0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
+        "eth:0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.addressManager:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0x543bA4AADBAb8f9025686Bd03993043599c6fB04:
-        "ProxyAdmin"
      implementationNames.eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04:
+        "ProxyAdmin"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      address:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
+        "eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      values.$members.1:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      implementationNames.0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865) {
    +++ description: None
      address:
-        "0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865"
+        "eth:0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865"
    }
```

```diff
    EOA  (0x652BC529E171847E2fFddCeA13567643C84ccB5f) {
    +++ description: None
      address:
-        "0x652BC529E171847E2fFddCeA13567643C84ccB5f"
+        "eth:0x652BC529E171847E2fFddCeA13567643C84ccB5f"
    }
```

```diff
    contract ProxyAdmin (0x672B75103c0CbFdCC4A40737a80724f87a8A25D7) {
    +++ description: None
      address:
-        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      values.addressManager:
-        "0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
+        "eth:0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      implementationNames.0x672B75103c0CbFdCC4A40737a80724f87a8A25D7:
-        "ProxyAdmin"
      implementationNames.eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7:
+        "ProxyAdmin"
    }
```

```diff
    contract SuperchainConfig (0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      values.$admin:
-        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      values.$implementation:
-        "0x24A3649c1A262F2ac51029468b70A83c3f340dC3"
+        "eth:0x24A3649c1A262F2ac51029468b70A83c3f340dC3"
      values.$pastUpgrades.0.2.0:
-        "0x24A3649c1A262F2ac51029468b70A83c3f340dC3"
+        "eth:0x24A3649c1A262F2ac51029468b70A83c3f340dC3"
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      implementationNames.0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6:
-        "Proxy"
      implementationNames.0x24A3649c1A262F2ac51029468b70A83c3f340dC3:
-        "SuperchainConfig"
      implementationNames.eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6:
+        "Proxy"
      implementationNames.eth:0x24A3649c1A262F2ac51029468b70A83c3f340dC3:
+        "SuperchainConfig"
    }
```

```diff
    EOA  (0x7cB07FE039a92B3D784f284D919503A381BEC54f) {
    +++ description: None
      address:
-        "0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
    }
```

```diff
    EOA  (0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39) {
    +++ description: None
      address:
-        "0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39"
+        "eth:0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39"
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
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      address:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
+        "eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      receivedPermissions.0.via.2.condition:
-        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
      directlyReceivedPermissions.0.condition:
-        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
      directlyReceivedPermissions.0.description:
-        "takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "takes ownership of eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
+        "eth:0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
      values.$members.1:
-        "0x3041BA32f451F5850c147805F5521AC206421623"
+        "eth:0x3041BA32f451F5850c147805F5521AC206421623"
      values.$members.2:
-        "0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
+        "eth:0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
      values.$members.3:
-        "0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
+        "eth:0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
      values.$members.4:
-        "0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
+        "eth:0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
      values.$members.5:
-        "0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
      values.$members.6:
-        "0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
+        "eth:0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
      implementationNames.0x847B5c174615B1B7fDF770882256e2D3E95b9D92:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e) {
    +++ description: None
      address:
-        "0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e"
+        "eth:0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e"
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
    EOA  (0x92827223f6b397CE9F208eE352bacA710765cACb) {
    +++ description: None
      address:
-        "0x92827223f6b397CE9F208eE352bacA710765cACb"
+        "eth:0x92827223f6b397CE9F208eE352bacA710765cACb"
    }
```

```diff
    contract OptimismPortal (0x936D881b4760D5e9b6D55b774f65c509236b4743) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "eth:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      values.$admin:
-        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      values.$implementation:
-        "0x79f446D024d74D0Bb6E699C131c703463c5D65E9"
+        "eth:0x79f446D024d74D0Bb6E699C131c703463c5D65E9"
      values.$pastUpgrades.0.2.0:
-        "0x79f446D024d74D0Bb6E699C131c703463c5D65E9"
+        "eth:0x79f446D024d74D0Bb6E699C131c703463c5D65E9"
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.l2Oracle:
-        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      values.systemConfig:
-        "0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
      implementationNames.0x936D881b4760D5e9b6D55b774f65c509236b4743:
-        "Proxy"
      implementationNames.0x79f446D024d74D0Bb6E699C131c703463c5D65E9:
-        "OptimismPortal"
      implementationNames.eth:0x936D881b4760D5e9b6D55b774f65c509236b4743:
+        "Proxy"
      implementationNames.eth:0x79f446D024d74D0Bb6E699C131c703463c5D65E9:
+        "OptimismPortal"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
      values.$pastUpgrades.0.2.0:
-        "0x53c165169401764778F780a69701385eb0FF19B7"
+        "eth:0x53c165169401764778F780a69701385eb0FF19B7"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0x53c165169401764778F780a69701385eb0FF19B7"
+        "eth:0x53c165169401764778F780a69701385eb0FF19B7"
      values.$pastUpgrades.3.2.0:
-        "0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
      values.guardian:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      implementationNames.0x95703e0982140D16f8ebA6d158FccEde42f04a4C:
-        "Proxy"
      implementationNames.0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
-        "SuperchainConfig"
      implementationNames.eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C:
+        "Proxy"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
+        "SuperchainConfig"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      address:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.$implementation:
-        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
+        "eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
      values.$members.0:
-        "0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
+        "eth:0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
      values.$members.1:
-        "0x3041BA32f451F5850c147805F5521AC206421623"
+        "eth:0x3041BA32f451F5850c147805F5521AC206421623"
      values.$members.2:
-        "0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
+        "eth:0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
      values.$members.3:
-        "0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
+        "eth:0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
      values.$members.4:
-        "0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
+        "eth:0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
      values.$members.5:
-        "0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
      values.$members.6:
-        "0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
+        "eth:0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
      values.getModules.0:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      implementationNames.0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A:
-        "Proxy"
      implementationNames.0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
-        "GnosisSafe"
      implementationNames.eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A:
+        "Proxy"
      implementationNames.eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa) {
    +++ description: None
      address:
-        "0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
+        "eth:0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
    }
```

```diff
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
      values.$admin:
-        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      values.$implementation:
-        "0xd5FE2D6Fce4f30336E7738B99D3A2aAE23DE3827"
+        "eth:0xd5FE2D6Fce4f30336E7738B99D3A2aAE23DE3827"
      values.$pastUpgrades.0.2.0:
-        "0xd5FE2D6Fce4f30336E7738B99D3A2aAE23DE3827"
+        "eth:0xd5FE2D6Fce4f30336E7738B99D3A2aAE23DE3827"
      values.batcherHash:
-        "0x060b915cA4904b56adA63565626b9c97F6CaD212"
+        "eth:0x060b915cA4904b56adA63565626b9c97F6CaD212"
      values.batchInbox:
-        "0xFeC57BD3729a5F930d4Ee8ac5992Fdc8988426e4"
+        "eth:0xFeC57BD3729a5F930d4Ee8ac5992Fdc8988426e4"
      values.disputeGameFactory:
-        "0x8aF5b3ED56D4a822532A07a84C499d600eCD5cf5"
+        "eth:0x8aF5b3ED56D4a822532A07a84C499d600eCD5cf5"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
+        "eth:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
      values.l1ERC721Bridge:
-        "0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
+        "eth:0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
      values.l1StandardBridge:
-        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
+        "eth:0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
      values.optimismMintableERC20Factory:
-        "0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "eth:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
      values.optimismPortal:
-        "0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "eth:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.sequencerInbox:
-        "0xFeC57BD3729a5F930d4Ee8ac5992Fdc8988426e4"
+        "eth:0xFeC57BD3729a5F930d4Ee8ac5992Fdc8988426e4"
      values.unsafeBlockSigner:
-        "0x22c48998635C2D7Ea8B82aB50761f2c1EEae5D21"
+        "eth:0x22c48998635C2D7Ea8B82aB50761f2c1EEae5D21"
      implementationNames.0x9c9B78f798F821C2f6398f603825fd175e2427f9:
-        "Proxy"
      implementationNames.0xd5FE2D6Fce4f30336E7738B99D3A2aAE23DE3827:
-        "SystemConfig"
      implementationNames.eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9:
+        "Proxy"
      implementationNames.eth:0xd5FE2D6Fce4f30336E7738B99D3A2aAE23DE3827:
+        "SystemConfig"
    }
```

```diff
    EOA  (0x9Eb11A55132c851b9991F148b3Af791ca498fD7A) {
    +++ description: None
      address:
-        "0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
+        "eth:0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
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
    EOA  (0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4) {
    +++ description: None
      address:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "eth:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

```diff
    contract L1StandardBridge (0xA5fb68C24b02852e8B514E98A1014faf12547Fa5) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
+        "eth:0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
      values.$admin:
-        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      values.$implementation:
-        "0x6534Bdb6b5c060d3e6aa833433333135eFE8E0aA"
+        "eth:0x6534Bdb6b5c060d3e6aa833433333135eFE8E0aA"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
+        "eth:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
      values.MESSENGER:
-        "0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
+        "eth:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      values.systemConfig:
-        "0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
      implementationNames.0xA5fb68C24b02852e8B514E98A1014faf12547Fa5:
-        "L1ChugSplashProxy"
      implementationNames.0x6534Bdb6b5c060d3e6aa833433333135eFE8E0aA:
-        "L1StandardBridge"
      implementationNames.eth:0xA5fb68C24b02852e8B514E98A1014faf12547Fa5:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x6534Bdb6b5c060d3e6aa833433333135eFE8E0aA:
+        "L1StandardBridge"
    }
```

```diff
    EOA  (0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5) {
    +++ description: None
      address:
-        "0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5"
+        "eth:0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5"
    }
```

```diff
    EOA  (0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8) {
    +++ description: None
      address:
-        "0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
+        "eth:0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
    }
```

```diff
    EOA  (0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9) {
    +++ description: None
      address:
-        "0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9"
+        "eth:0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      address:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x07dC0893cAfbF810e3E72505041f2865726Fd073"
+        "eth:0x07dC0893cAfbF810e3E72505041f2865726Fd073"
      values.$members.1:
-        "0x652BC529E171847E2fFddCeA13567643C84ccB5f"
+        "eth:0x652BC529E171847E2fFddCeA13567643C84ccB5f"
      values.$members.2:
-        "0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e"
+        "eth:0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e"
      values.$members.3:
-        "0x4A7322258c9E690e4CB8Cea6e5251443E956e61E"
+        "eth:0x4A7322258c9E690e4CB8Cea6e5251443E956e61E"
      values.$members.4:
-        "0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
+        "eth:0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
      values.$members.5:
-        "0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
+        "eth:0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
      values.$members.6:
-        "0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865"
+        "eth:0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865"
      values.$members.7:
-        "0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
+        "eth:0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
      values.$members.8:
-        "0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39"
+        "eth:0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39"
      values.$members.9:
-        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
+        "eth:0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
      values.$members.10:
-        "0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
+        "eth:0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
      values.$members.11:
-        "0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9"
+        "eth:0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9"
      values.$members.12:
-        "0x92827223f6b397CE9F208eE352bacA710765cACb"
+        "eth:0x92827223f6b397CE9F208eE352bacA710765cACb"
      values.GnosisSafe_modules.0:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      implementationNames.0xc2819DC788505Aac350142A7A707BF9D03E3Bd03:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      address:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      description:
-        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
+        "allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
      values.deputyGuardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.safe:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B:
-        "DeputyGuardianModule"
      implementationNames.eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B:
+        "DeputyGuardianModule"
    }
```

```diff
    EOA  (0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90) {
    +++ description: None
      address:
-        "0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
+        "eth:0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
    }
```

```diff
    contract AddressManager (0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
+        "eth:0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
      values.owner:
-        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      implementationNames.0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411:
-        "AddressManager"
      implementationNames.eth:0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411:
+        "AddressManager"
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      values.owner:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      implementationNames.0xdE1FCfB0851916CA5101820A69b13a4E276bd81F:
-        "Lib_AddressManager"
      implementationNames.eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F:
+        "Lib_AddressManager"
    }
```

```diff
    EOA  (0xE7dEA1306D9F829bA469d1904c50903b46ebd02e) {
    +++ description: None
      address:
-        "0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
+        "eth:0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "eth:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
      values.$admin:
-        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      values.$implementation:
-        "0xc8cBf9124a4dF9B0776CAf1BA5604E6AAD15F42F"
+        "eth:0xc8cBf9124a4dF9B0776CAf1BA5604E6AAD15F42F"
      values.$pastUpgrades.0.2.0:
-        "0xc8cBf9124a4dF9B0776CAf1BA5604E6AAD15F42F"
+        "eth:0xc8cBf9124a4dF9B0776CAf1BA5604E6AAD15F42F"
      values.bridge:
-        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
+        "eth:0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
      values.BRIDGE:
-        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
+        "eth:0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
      implementationNames.0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A:
-        "Proxy"
      implementationNames.0xc8cBf9124a4dF9B0776CAf1BA5604E6AAD15F42F:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A:
+        "Proxy"
      implementationNames.eth:0xc8cBf9124a4dF9B0776CAf1BA5604E6AAD15F42F:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    EOA  (0xEF9A98511939eEe6Ec69af62082E3F2ff606877c) {
    +++ description: None
      address:
-        "0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
+        "eth:0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
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
    contract L2OutputOracle (0xF8f3EbF2469C00A00EA9D1D04913B73896268B25) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      values.$admin:
-        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      values.$implementation:
-        "0x2172e492Fc807F5d5645D0E3543f139ECF539294"
+        "eth:0x2172e492Fc807F5d5645D0E3543f139ECF539294"
      values.$pastUpgrades.0.2.0:
-        "0x2172e492Fc807F5d5645D0E3543f139ECF539294"
+        "eth:0x2172e492Fc807F5d5645D0E3543f139ECF539294"
+++ severity: HIGH
      values.challenger:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.CHALLENGER:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+++ severity: HIGH
      values.proposer:
-        "0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e"
+        "eth:0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e"
      values.PROPOSER:
-        "0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e"
+        "eth:0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e"
      implementationNames.0xF8f3EbF2469C00A00EA9D1D04913B73896268B25:
-        "Proxy"
      implementationNames.0x2172e492Fc807F5d5645D0E3543f139ECF539294:
-        "L2OutputOracle"
      implementationNames.eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25:
+        "Proxy"
      implementationNames.eth:0x2172e492Fc807F5d5645D0E3543f139ECF539294:
+        "L2OutputOracle"
    }
```

```diff
    EOA  (0xFeC57BD3729a5F930d4Ee8ac5992Fdc8988426e4) {
    +++ description: None
      address:
-        "0xFeC57BD3729a5F930d4Ee8ac5992Fdc8988426e4"
+        "eth:0xFeC57BD3729a5F930d4Ee8ac5992Fdc8988426e4"
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2A4fC0E3B365052d71B9853Efd0123985559f62E)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x45561F85e43Ac0d2258c0F0C16540ce128EA1634)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x672B75103c0CbFdCC4A40737a80724f87a8A25D7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x936D881b4760D5e9b6D55b774f65c509236b4743)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xA5fb68C24b02852e8B514E98A1014faf12547Fa5)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract AddressManager (0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xF8f3EbF2469C00A00EA9D1D04913B73896268B25)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

Generated with discovered.json: 0xcdfae8946a587849aacfe0564bdcde1898cde1fe

# Diff at Mon, 14 Jul 2025 08:02:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22895949
- current block number: 22895949

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22895949 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x22841f42723dc38a4ec526c0bc57e1ecae8c6505

# Diff at Fri, 04 Jul 2025 12:19:21 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615678
- current block number: 22615678

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615678 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      directlyReceivedPermissions.0.from:
-        "ethereum:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    EOA  (0x060b915cA4904b56adA63565626b9c97F6CaD212) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
    }
```

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C) {
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.via.1.address:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.0.via.0.address:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      receivedPermissions.0.from:
-        "ethereum:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      receivedPermissions.1.via.1.address:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      receivedPermissions.1.from:
-        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "eth:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      receivedPermissions.2.via.3.address:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.2.via.2.address:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      receivedPermissions.2.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.2.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      receivedPermissions.1.from:
-        "ethereum:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      receivedPermissions.2.from:
-        "ethereum:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      receivedPermissions.3.from:
-        "ethereum:0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
+        "eth:0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      receivedPermissions.4.from:
-        "ethereum:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
+        "eth:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      receivedPermissions.5.from:
-        "ethereum:0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
+        "eth:0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      receivedPermissions.6.from:
-        "ethereum:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      receivedPermissions.7.from:
-        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "eth:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      receivedPermissions.8.from:
-        "ethereum:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      receivedPermissions.9.from:
-        "ethereum:0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
+        "eth:0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      receivedPermissions.10.from:
-        "ethereum:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "eth:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
      receivedPermissions.11.from:
-        "ethereum:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
+        "eth:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.0.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.1.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    contract ProxyAdmin (0x672B75103c0CbFdCC4A40737a80724f87a8A25D7) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
+        "eth:0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
+        "eth:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
+        "eth:0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "eth:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "eth:0x9c9B78f798F821C2f6398f603825fd175e2427f9"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
+        "eth:0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "eth:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.0.via.2.address:
-        "ethereum:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      receivedPermissions.0.via.1.address:
-        "ethereum:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      receivedPermissions.0.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    EOA  (0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      receivedPermissions.1.from:
-        "ethereum:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "eth:0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "eth:0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      receivedPermissions.1.from:
-        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "eth:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      receivedPermissions.2.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.2.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

Generated with discovered.json: 0x0214ea50cf596b3ea4006692626e3cd46e1a635a

# Diff at Mon, 16 Jun 2025 08:43:08 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22615678
- current block number: 22615678

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615678 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x2A4fC0E3B365052d71B9853Efd0123985559f62E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A","role":"admin","via":[{"address":"ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}
      receivedPermissions.10.from:
-        "ethereum:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      receivedPermissions.9.from:
-        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "ethereum:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
    }
```

```diff
    contract ProxyAdmin (0x672B75103c0CbFdCC4A40737a80724f87a8A25D7) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A","role":"admin"}
      directlyReceivedPermissions.7.from:
-        "ethereum:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "ethereum:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
    }
```

Generated with discovered.json: 0x69d886305a2782b5e0bd2fc61ae25c80073ed7da

# Diff at Mon, 02 Jun 2025 08:02:21 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22437745
- current block number: 22615678

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

Generated with discovered.json: 0x7ea30784ab55fa8cc05c205534e5074274157887

# Diff at Fri, 30 May 2025 07:15:37 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22437745
- current block number: 22437745

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437745 (main branch discovery), not current.

```diff
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x2ce701030df3a7d2ec47f8c47e03a56761537dd4

# Diff at Thu, 29 May 2025 07:50:32 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9764537dfab122079ee09c9ec95835b322e2dd25 block: 22437745
- current block number: 22437745

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437745 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

Generated with discovered.json: 0xa20465b264c99ba5dc94ea350c956799c4d92128

# Diff at Fri, 23 May 2025 09:41:04 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437745
- current block number: 22437745

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437745 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    EOA  (0x060b915cA4904b56adA63565626b9c97F6CaD212) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C) {
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.2.role:
+        ".guardian"
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputy"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0x9c9B78f798F821C2f6398f603825fd175e2427f9","role":"admin","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}
      receivedPermissions.9.from:
-        "0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "0x936D881b4760D5e9b6D55b774f65c509236b4743"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
+        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
+        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      receivedPermissions.5.description:
-        "set and change address mappings."
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.permission:
-        "interact"
+        "challenge"
      receivedPermissions.4.from:
-        "0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      receivedPermissions.4.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.4.role:
+        ".CHALLENGER"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
      receivedPermissions.3.description:
+        "set and change address mappings."
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.2.from:
-        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
+        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      receivedPermissions.2.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.2.via:
-        [{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]
      receivedPermissions.2.role:
+        ".challenger"
      receivedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      receivedPermissions.1.from:
-        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
      receivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.1.via:
+        [{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "0x9c9B78f798F821C2f6398f603825fd175e2427f9"
      receivedPermissions.0.via:
-        [{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.1.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.1.description:
-        "set and change address mappings."
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.0.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.1.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.description:
-        "set and change address mappings."
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.description:
+        "set and change address mappings."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0x672B75103c0CbFdCC4A40737a80724f87a8A25D7) {
    +++ description: None
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.3.from:
-        "0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
+        "0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
      directlyReceivedPermissions.3.description:
-        "set and change address mappings."
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.1.from:
-        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
+        "0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
      directlyReceivedPermissions.1.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.from:
-        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
      directlyReceivedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".fallbackOwner"
    }
```

```diff
    EOA  (0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0xF8f3EbF2469C00A00EA9D1D04913B73896268B25","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.2.role:
+        ".guardian"
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputyGuardian"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

Generated with discovered.json: 0xe45d8d8df14c8cab7c9fc95c501b36b9d4ec5daa

# Diff at Fri, 09 May 2025 10:09:20 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437745
- current block number: 22437745

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437745 (main branch discovery), not current.

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.2.via.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
      receivedPermissions.1.via.3.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      receivedPermissions.1.via.1.address:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.1.via.1.condition:
-        "restricted to the global pause function"
      receivedPermissions.1.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1.via.0.condition:
+        "though restricted to the global pause function"
      receivedPermissions.0.via.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
      directlyReceivedPermissions.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.0.via.0.condition:
-        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
      directlyReceivedPermissions.0.condition:
-        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.1.via.1.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
    }
```

Generated with discovered.json: 0x664f8bef44955e5b03438bab6cede72a51dfb70b

# Diff at Thu, 08 May 2025 08:50:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22194661
- current block number: 22437745

## Description

Superchain guardian connected, not full superchain gov.

OP stack DeputyPauser upgrade (see op mainnet for more info).

## Watched changes

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.2:
+        {"permission":"guard","from":"0x936D881b4760D5e9b6D55b774f65c509236b4743"}
      receivedPermissions.1.from:
-        "0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.via:
+        [{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"}]
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

## Source code changes

```diff
...0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411.sol} |    0
 ...-0xdE1FCfB0851916CA5101820A69b13a4E276bd81F.sol |  152 +++
 .../ethereum/.flat/DeputyGuardianModule.sol        |  156 +++
 .../snaxchain/ethereum/.flat/DeputyPauseModule.sol | 1338 ++++++++++++++++++++
 .../snaxchain/ethereum/.flat/LivenessModule.sol    |  258 ++++
 .../.flat/OpFoundationUpgradeSafe/GnosisSafe.sol   |  953 ++++++++++++++
 .../OpFoundationUpgradeSafe/GnosisSafeProxy.p.sol  |   35 +
 .../Optimism Guardian Multisig/GnosisSafe.sol      |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../.flat/Optimism Security Council/GnosisSafe.sol |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../Proxy.p.sol                                    |    0
 .../SuperchainConfig.sol                           |    0
 .../Proxy.p.sol                                    |  200 +++
 .../SuperchainConfig.sol                           |  477 +++++++
 .../ethereum/.flat/SuperchainProxyAdmin.sol        |  298 +++++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 18 files changed, 6831 insertions(+)
```

Generated with discovered.json: 0xb79d743f0e910867e6fd78e24d6a0276a8d3a896

# Diff at Tue, 29 Apr 2025 08:19:12 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22194661
- current block number: 22194661

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194661 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x45561F85e43Ac0d2258c0F0C16540ce128EA1634) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract SuperchainConfig (0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract OptimismPortal (0x936D881b4760D5e9b6D55b774f65c509236b4743) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x060b915cA4904b56adA63565626b9c97F6CaD212","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract L1StandardBridge (0xA5fb68C24b02852e8B514E98A1014faf12547Fa5) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract AddressManager (0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract L2OutputOracle (0xF8f3EbF2469C00A00EA9D1D04913B73896268B25) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"propose","to":"0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

Generated with discovered.json: 0x74944c7050bcaf771fc0dda9b21bfd9a82bf82b1

# Diff at Fri, 04 Apr 2025 09:41:20 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22194661

## Description

Initial discovery of a standard OP stack rollup without proof system.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2A4fC0E3B365052d71B9853Efd0123985559f62E)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x45561F85e43Ac0d2258c0F0C16540ce128EA1634)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x672B75103c0CbFdCC4A40737a80724f87a8A25D7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x936D881b4760D5e9b6D55b774f65c509236b4743)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xA5fb68C24b02852e8B514E98A1014faf12547Fa5)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xF8f3EbF2469C00A00EA9D1D04913B73896268B25)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

