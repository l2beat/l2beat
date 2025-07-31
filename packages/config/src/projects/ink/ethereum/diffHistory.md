Generated with discovered.json: 0x4c076f8217daeec39abacc51d13e4d6deb885ee6

# Diff at Fri, 25 Jul 2025 17:48:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dff0cc78015c4909229d9a2a9ca8fb6a3498b9d5 block: 22924293
- current block number: 22996536

## Description

Check optimism diffhistory for [the upgrade 16 breakdown](https://gov.optimism.io/t/upgrade-16-proposal-interop-contracts-stage-1-and-go-1-23-support-in-cannon/10037).

## Watched changes

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.GnosisSafe_modules.0:
-        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754"
    }
```

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
+        "0x93342e3d1e616bd6c727a5f73b09c0811bdab764dc9ad7346278593fb66b3689"
      values.$implementation:
-        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.$pastUpgrades.2:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"]]
      values.$upgradeCount:
-        2
+        3
+++ severity: HIGH
      values.gameImpls.0:
-        "eth:0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342"
+        "eth:0x1a20c06a80260AA45adA0F9F59b334560eE3FEf1"
+++ severity: HIGH
      values.gameImpls.1:
-        "eth:0x40641A4023f0F4C66D7f8Ade16497f4C947A7163"
+        "eth:0x46DDe051eb4561694DC1F0286eBe940d9E90fbe9"
      values.version:
-        "1.0.1"
+        "1.2.0"
      values.initVersion:
+        1
      values.proxyAdmin:
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
-        "DisputeGameFactory"
      implementationNames.eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D:
+        "DisputeGameFactory"
    }
```

```diff
-   Status: DELETED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.via.3.address:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754"
      receivedPermissions.0.via.2:
-        {"address":"eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"}
      receivedPermissions.0.via.1:
-        {"address":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}
      directlyReceivedPermissions.0.from:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754"
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x40641A4023f0F4C66D7f8Ade16497f4C947A7163)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.3:
-        {"permission":"interact","from":"eth:0xf6b1554F483C391414d3830927E3600c105AaE6E","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.5.from:
-        "eth:0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
+        "eth:0x3F7b07A5D638024a37A776FA228fE90b317aF6dE"
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0xbd4AbB321138e8Eddc399cE64E66451294325a14","role":"admin","via":[{"address":"eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}
      receivedPermissions.13.from:
-        "eth:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
+        "eth:0xD5d9Eb5B1edce381C9f3377264e05c31f3036F32"
      receivedPermissions.14.from:
-        "eth:0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "eth:0xEe018bAf058227872540AC60eFbd38b023d9dAe2"
    }
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. The state root respected for withdrawals comnes from the FaultDisputeGame.
      template:
-        "opstack/OptimismPortal2"
+        "opstack/OptimismPortal2_post13"
      sourceHashes.1:
-        "0xc483ef9e0a5ec2a0450732e743b3784de0cd3876b8fadfce14c0805a0846d26b"
+        "0x025be6415d31a7c8f475bf94e05a8288787b4adb41562108a42d0574c9af9543"
      description:
-        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. The state root respected for withdrawals comnes from the FaultDisputeGame."
      values.$implementation:
-        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
+        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
      values.$pastUpgrades.3:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"]]
      values.$upgradeCount:
-        3
+        4
      values.respectedGameTypeUpdatedAt:
-        1737576635
+        1753379243
      values.version:
-        "3.14.0"
+        "4.6.0"
      values.anchorStateRegistry:
+        "eth:0xEe018bAf058227872540AC60eFbd38b023d9dAe2"
      values.ethLockbox:
+        "eth:0xbd4AbB321138e8Eddc399cE64E66451294325a14"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.superRootsActive:
+        false
      implementationNames.eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
-        "OptimismPortal2"
      implementationNames.eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a:
+        "OptimismPortal2"
    }
```

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      template:
-        "opstack/SystemConfig"
+        "opstack/SystemConfig_pauseId"
      sourceHashes.1:
-        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
+        "0xbca9388c120780391489984ba6cb1ec20bc4b0cf9644579f960e0b3aee1282b5"
      values.$implementation:
-        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
      values.$pastUpgrades.4:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"]]
      values.$upgradeCount:
-        4
+        5
      values.DISPUTE_GAME_FACTORY_SLOT:
-        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.getAddresses.disputeGameFactory:
-        "eth:0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      values.maximumGasLimit:
-        200000000
+        500000000
      values.version:
-        "2.5.0"
+        "3.4.0"
      values.guardian:
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.initVersion:
+        2
      values.l2ChainId:
+        57073
+++ description: `superchainConfig.paused(address(lockbox)) || superchainConfig.paused(address(0))`
+++ severity: HIGH
      values.paused:
+        false
      values.proxyAdmin:
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.superchainConfig:
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      fieldMeta.paused:
+        {"severity":"HIGH","description":"`superchainConfig.paused(address(lockbox)) || superchainConfig.paused(address(0))`"}
      implementationNames.eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
-        "SystemConfig"
      implementationNames.eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa:
+        "SystemConfig"
    }
```

```diff
    contract L1ERC721Bridge (0x661235a238B11191211fa95D4Dd9E423d521E0Be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
+        "0x8ec2646e7ca57c49fef7769f200a751b7199526d590c9c43e6c7b134f43de630"
      values.$implementation:
-        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
      values.$pastUpgrades.3:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "2.4.0"
+        "2.7.0"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
-        "L1ERC721Bridge"
      implementationNames.eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F:
+        "L1ERC721Bridge"
    }
```

```diff
    contract L1CrossDomainMessenger (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
+        "0x21cd6c80343ba49cbb9f3e96c5f4ca0bc77bc617825495fbaad1026ed9a42026"
      values.$implementation:
-        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
      values.$pastUpgrades.3:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "2.6.0"
+        "2.9.0"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x4e15d99844dc5a4304c2396a66c95ec41218ea311c8e524b118fad7beed0bb53"
+        "0x7ca93e9b7ebe02b3a013eeb8b0db9c37bee9ffa1a9b47f52dc52b8d5594afcb5"
      values.$implementation:
-        "eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
+        "eth:0x44AfB7722AF276A601D524F429016A18B6923df0"
      values.version:
-        "2.3.0"
+        "2.6.0"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.systemConfig:
+        "eth:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
-        "L1StandardBridge"
      implementationNames.eth:0x44AfB7722AF276A601D524F429016A18B6923df0:
+        "L1StandardBridge"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages individual pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3 months if left untouched.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfig_expiry"
      sourceHashes.1:
-        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
+        "0x5a0e73c7d129cc83e1c387b55df0141890c02d2cb4111b8a1b6376d737d88f6b"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages individual pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3 months if left untouched."
      values.$implementation:
-        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0xCe28685EB204186b557133766eCA00334EB441E4"
      values.$pastUpgrades.4:
+        ["2025-07-24T17:47:23.000Z","0x46acdce174c8d83ebe2f208d8c76c867e75617483d64c3e407f69ae2f9868716",["eth:0xCe28685EB204186b557133766eCA00334EB441E4"]]
      values.$upgradeCount:
-        4
+        5
      values.GUARDIAN_SLOT:
-        "0xd30e835d3f35624761057ff5b27d558f97bd5be034621e62240e5c0b784abe68"
      values.PAUSED_SLOT:
-        "0x54176ff9944c4784e5857ec4e5ef560a462c483bf534eda43f91bb01a470b1b6"
      values.version:
-        "1.2.0"
+        "2.3.0"
      values.initVersion:
+        2
      values.pauseExpiry:
+        7884000
      values.pauseExpiryFmt:
+        "91d 6h"
      values.proxyAdmin:
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.proxyAdminOwner:
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
-        "SuperchainConfig"
      implementationNames.eth:0xCe28685EB204186b557133766eCA00334EB441E4:
+        "SuperchainConfig"
      fieldMeta:
+        {"paused":{"severity":"HIGH"}}
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
-        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions:
-        [{"permission":"guard","from":"eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C","role":".guardian","via":[{"address":"eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"if not revoked by the Security Council"}]}]
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","role":".deputyGuardian","condition":"if not revoked by the Security Council"}]
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (0xc4986627A41cdCf6fa33543D96f00F475bCE42f5)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      directlyReceivedPermissions.2.from:
-        "eth:0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
+        "eth:0x3F7b07A5D638024a37A776FA228fE90b317aF6dE"
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0xbd4AbB321138e8Eddc399cE64E66451294325a14","role":"admin"}
      directlyReceivedPermissions.9.from:
-        "eth:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
+        "eth:0xD5d9Eb5B1edce381C9f3377264e05c31f3036F32"
      directlyReceivedPermissions.10.from:
-        "eth:0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "eth:0xEe018bAf058227872540AC60eFbd38b023d9dAe2"
    }
```

```diff
-   Status: DELETED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
-   Status: DELETED
    contract DelayedWETH (0xf6b1554F483C391414d3830927E3600c105AaE6E)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x1a20c06a80260AA45adA0F9F59b334560eE3FEf1)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x3F7b07A5D638024a37A776FA228fE90b317aF6dE)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x46DDe051eb4561694DC1F0286eBe940d9E90fbe9)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 if set as its Safe module.
```

```diff
+   Status: CREATED
    contract MIPS (0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract ETHLockbox (0xbd4AbB321138e8Eddc399cE64E66451294325a14)
    +++ description: A simple escrow contract storing ETH for the canonical bridge.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xD5d9Eb5B1edce381C9f3377264e05c31f3036F32)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xEe018bAf058227872540AC60eFbd38b023d9dAe2)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  418 +++++++-
 .../DelayedWETH.sol                                |  406 +++++--
 .../Proxy.p.sol                                    |    0
 .../DelayedWETH.sol                                |  406 +++++--
 .../Proxy.p.sol                                    |    0
 .../DeputyGuardianModule.sol => /dev/null          |  156 ---
 .../DeputyPauseModule.sol                          |   87 +-
 .../DisputeGameFactory/DisputeGameFactory.sol      |  254 ++++-
 .../ink/ethereum/.flat/ETHLockbox/ETHLockbox.sol   |  757 +++++++++++++
 .../ink/ethereum/.flat/ETHLockbox/Proxy.p.sol      |  200 ++++
 .../{.flat@22924293 => .flat}/FaultDisputeGame.sol |  106 +-
 .../L1CrossDomainMessenger.sol                     |  348 +++++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  298 +++++-
 .../L1StandardBridge/L1StandardBridge.sol          |  298 +++++-
 .../ethereum/{.flat@22924293 => .flat}/MIPS.sol    |  583 +++++-----
 .../OptimismPortal2/OptimismPortal2.sol            | 1111 +++++++++++++-------
 .../PermissionedDisputeGame.sol                    |  110 +-
 .../SuperchainConfig/SuperchainConfig.sol          |  487 ++++++---
 .../SystemConfig/SystemConfig.sol                  |  398 +++++--
 19 files changed, 4962 insertions(+), 1461 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22924293 (main branch discovery), not current.

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
      template:
+        "gnosisSafeModules/LivenessGuard"
      description:
+        "Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners."
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.via.3.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
      directlyReceivedPermissions.0.condition:
-        "though restricted to the global pause function"
+        "though restricted to the SuperchainConfig's `pause()` function"
    }
```

Generated with discovered.json: 0xbcbf554f32dfbbe7632fbcdbba1208eac0d2d032

# Diff at Thu, 24 Jul 2025 16:48:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22924293
- current block number: 22924293

## Description

set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22924293 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x662d7c5a9b5600e0a107a8c6a24812ff2eba2309

# Diff at Tue, 22 Jul 2025 14:09:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5d65d1883c757ae790bbd0a6f785c98310d2516 block: 22924293
- current block number: 22924293

## Description

Config: Kailua added to OptimismPortal2 and DisputeGameFectory.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22924293 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

Generated with discovered.json: 0x1f095ac8c9f5d9d75eff04745d2162120acf1bec

# Diff at Tue, 15 Jul 2025 11:31:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22437737
- current block number: 22924293

## Description

Gelato MS: one signer removed, one changed.

fee config updated.

## Watched changes

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.basefeeScalar:
-        0
+        4424
      values.blobbasefeeScalar:
-        0
+        810831
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.2:
-        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0x58edE8C66A15f23c61b8EadD1191FdaD904f7a87"
      values.$members.8:
-        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x3095756e61b7ce10ec4cb0afc50d35e669f03281

# Diff at Mon, 14 Jul 2025 12:46:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22437737
- current block number: 22437737

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437737 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x005969bf0EcbF6eDB6C47E5e94693b1C3651Be97) {
    +++ description: None
      address:
-        "0x005969bf0EcbF6eDB6C47E5e94693b1C3651Be97"
+        "eth:0x005969bf0EcbF6eDB6C47E5e94693b1C3651Be97"
    }
```

```diff
    EOA  (0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e) {
    +++ description: None
      address:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "eth:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
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
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "eth:0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      values.$admin:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.$implementation:
-        "0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
+        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
      values.$pastUpgrades.0.2.0:
-        "0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "eth:0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
      values.$pastUpgrades.1.2.0:
-        "0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
+        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
      values.gameImpls.0:
-        "0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342"
+        "eth:0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342"
      values.gameImpls.1:
-        "0x40641A4023f0F4C66D7f8Ade16497f4C947A7163"
+        "eth:0x40641A4023f0F4C66D7f8Ade16497f4C947A7163"
      values.gameImpls.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.3:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.4:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0x10d7B35078d3baabB96Dd45a9143B94be65b12CD:
-        "Proxy"
      implementationNames.0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
-        "DisputeGameFactory"
      implementationNames.eth:0x10d7B35078d3baabB96Dd45a9143B94be65b12CD:
+        "Proxy"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
+        "DisputeGameFactory"
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
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      address:
-        "0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
+        "eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
      implementationNames.0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3:
-        "PreimageOracle"
      implementationNames.eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3:
+        "PreimageOracle"
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
    EOA  (0x28bB9385A588EF4747264D19B9A9F1603591680c) {
    +++ description: None
      address:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "eth:0x28bB9385A588EF4747264D19B9A9F1603591680c"
    }
```

```diff
    contract AnchorStateRegistry (0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
+        "eth:0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
      values.$admin:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.$implementation:
-        "0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
+        "eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
      values.$pastUpgrades.0.2.0:
-        "0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
+        "eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
      values.disputeGameFactory:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "eth:0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      values.portal:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "eth:0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d:
-        "Proxy"
      implementationNames.0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2:
-        "AnchorStateRegistry"
      implementationNames.eth:0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d:
+        "Proxy"
      implementationNames.eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2:
+        "AnchorStateRegistry"
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
    EOA  (0x349f3839012DB2271e1BeC68F1668471D175Adb9) {
    +++ description: None
      address:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
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
    contract FaultDisputeGame (0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      address:
-        "0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342"
+        "eth:0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342"
      values.anchorStateRegistry:
-        "0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
+        "eth:0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.vm:
-        "0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
+        "eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
      values.weth:
-        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "eth:0xf6b1554F483C391414d3830927E3600c105AaE6E"
      implementationNames.0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342:
-        "FaultDisputeGame"
      implementationNames.eth:0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342:
+        "FaultDisputeGame"
    }
```

```diff
    contract PermissionedDisputeGame (0x40641A4023f0F4C66D7f8Ade16497f4C947A7163) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0x40641A4023f0F4C66D7f8Ade16497f4C947A7163"
+        "eth:0x40641A4023f0F4C66D7f8Ade16497f4C947A7163"
      values.anchorStateRegistry:
-        "0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
+        "eth:0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
      values.challenger:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proposer:
-        "0x65436ddCbc026F34118954F229f7F132b696b3B4"
+        "eth:0x65436ddCbc026F34118954F229f7F132b696b3B4"
      values.vm:
-        "0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
+        "eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
      values.weth:
-        "0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
+        "eth:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
      implementationNames.0x40641A4023f0F4C66D7f8Ade16497f4C947A7163:
-        "PermissionedDisputeGame"
      implementationNames.eth:0x40641A4023f0F4C66D7f8Ade16497f4C947A7163:
+        "PermissionedDisputeGame"
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
    EOA  (0x4665374939642965EfD8357D4568D2A77f677429) {
    +++ description: None
      address:
-        "0x4665374939642965EfD8357D4568D2A77f677429"
+        "eth:0x4665374939642965EfD8357D4568D2A77f677429"
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
    EOA  (0x500d7Ea63CF2E501dadaA5feeC1FC19FE2Aa72Ac) {
    +++ description: None
      address:
-        "0x500d7Ea63CF2E501dadaA5feeC1FC19FE2Aa72Ac"
+        "eth:0x500d7Ea63CF2E501dadaA5feeC1FC19FE2Aa72Ac"
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
    EOA  (0x547D0F472309e4239b296D01e03bEDc101241a26) {
    +++ description: None
      address:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "eth:0x547D0F472309e4239b296D01e03bEDc101241a26"
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
    EOA  (0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d) {
    +++ description: None
      address:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "eth:0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
    }
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      address:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "eth:0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      values.$admin:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.$implementation:
-        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
+        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.0.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.1.2.0:
-        "0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
+        "eth:0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
      values.$pastUpgrades.2.2.0:
-        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
+        "eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.disputeGameFactory:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "eth:0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      values.guardian:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.systemConfig:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "eth:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      implementationNames.0x5d66C1782664115999C47c9fA5cd031f495D3e4F:
-        "Proxy"
      implementationNames.0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
-        "OptimismPortal2"
      implementationNames.eth:0x5d66C1782664115999C47c9fA5cd031f495D3e4F:
+        "Proxy"
      implementationNames.eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
+        "OptimismPortal2"
    }
```

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "eth:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      values.$admin:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.$implementation:
-        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.0.2.0:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "eth:0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.$pastUpgrades.1.2.0:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "eth:0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.$pastUpgrades.2.2.0:
-        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
+        "eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
      values.$pastUpgrades.3.2.0:
-        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.batcherHash:
-        "0x500d7Ea63CF2E501dadaA5feeC1FC19FE2Aa72Ac"
+        "eth:0x500d7Ea63CF2E501dadaA5feeC1FC19FE2Aa72Ac"
      values.batchInbox:
-        "0x005969bf0EcbF6eDB6C47E5e94693b1C3651Be97"
+        "eth:0x005969bf0EcbF6eDB6C47E5e94693b1C3651Be97"
      values.disputeGameFactory:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "eth:0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      values.getAddresses.l1CrossDomainMessenger:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "eth:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      values.getAddresses.l1ERC721Bridge:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "eth:0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      values.getAddresses.l1StandardBridge:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "eth:0x88FF1e5b602916615391F55854588EFcBB7663f0"
      values.getAddresses.disputeGameFactory:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "eth:0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      values.getAddresses.optimismPortal:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "eth:0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      values.getAddresses.optimismMintableERC20Factory:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "eth:0xA8B389A82e088b164cD03230e900980CcED34d29"
      values.l1CrossDomainMessenger:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "eth:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      values.l1ERC721Bridge:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "eth:0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      values.l1StandardBridge:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "eth:0x88FF1e5b602916615391F55854588EFcBB7663f0"
      values.optimismMintableERC20Factory:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "eth:0xA8B389A82e088b164cD03230e900980CcED34d29"
      values.optimismPortal:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "eth:0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      values.owner:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.sequencerInbox:
-        "0x005969bf0EcbF6eDB6C47E5e94693b1C3651Be97"
+        "eth:0x005969bf0EcbF6eDB6C47E5e94693b1C3651Be97"
      values.unsafeBlockSigner:
-        "0x7D056B99AA2021864c42E25B4F8cE3BdEAc9463C"
+        "eth:0x7D056B99AA2021864c42E25B4F8cE3BdEAc9463C"
      implementationNames.0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364:
-        "Proxy"
      implementationNames.0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
-        "SystemConfig"
      implementationNames.eth:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364:
+        "Proxy"
      implementationNames.eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
+        "SystemConfig"
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
    EOA  (0x65436ddCbc026F34118954F229f7F132b696b3B4) {
    +++ description: None
      address:
-        "0x65436ddCbc026F34118954F229f7F132b696b3B4"
+        "eth:0x65436ddCbc026F34118954F229f7F132b696b3B4"
    }
```

```diff
    contract L1ERC721Bridge (0x661235a238B11191211fa95D4Dd9E423d521E0Be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "eth:0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      values.$admin:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.$implementation:
-        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.0.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.1.2.0:
-        "0x276d3730f219f7ec22274f7263180b8452B46d47"
+        "eth:0x276d3730f219f7ec22274f7263180b8452B46d47"
      values.$pastUpgrades.2.2.0:
-        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.messenger:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "eth:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      values.MESSENGER:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "eth:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x661235a238B11191211fa95D4Dd9E423d521E0Be:
-        "Proxy"
      implementationNames.0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
-        "L1ERC721Bridge"
      implementationNames.eth:0x661235a238B11191211fa95D4Dd9E423d521E0Be:
+        "Proxy"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2) {
    +++ description: None
      address:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "eth:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
    }
```

```diff
    contract L1CrossDomainMessenger (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "eth:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      values.$admin:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.$implementation:
-        "0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.0.2.0:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.1.2.0:
-        "0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
+        "eth:0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
      values.$pastUpgrades.2.2.0:
-        "0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "eth:0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      values.PORTAL:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "eth:0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      values.ResolvedDelegateProxy_addressManager:
-        "0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
+        "eth:0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f:
-        "ResolvedDelegateProxy"
      implementationNames.0x5D5a095665886119693F0B41d8DFeE78da033e8B:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
+        "L1CrossDomainMessenger"
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
    EOA  (0x7D056B99AA2021864c42E25B4F8cE3BdEAc9463C) {
    +++ description: None
      address:
-        "0x7D056B99AA2021864c42E25B4F8cE3BdEAc9463C"
+        "eth:0x7D056B99AA2021864c42E25B4F8cE3BdEAc9463C"
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
    EOA  (0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52) {
    +++ description: None
      address:
-        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
+        "eth:0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
    }
```

```diff
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "eth:0x88FF1e5b602916615391F55854588EFcBB7663f0"
      values.$admin:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.$implementation:
-        "0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
+        "eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "eth:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      values.MESSENGER:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "eth:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x88FF1e5b602916615391F55854588EFcBB7663f0:
-        "L1ChugSplashProxy"
      implementationNames.0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
-        "L1StandardBridge"
      implementationNames.eth:0x88FF1e5b602916615391F55854588EFcBB7663f0:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
+        "L1StandardBridge"
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
    contract AddressManager (0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
+        "eth:0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
      values.owner:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      implementationNames.0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153:
-        "AddressManager"
      implementationNames.eth:0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153:
+        "AddressManager"
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
    EOA  (0x9Eb11A55132c851b9991F148b3Af791ca498fD7A) {
    +++ description: None
      address:
-        "0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
+        "eth:0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xA8B389A82e088b164cD03230e900980CcED34d29) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "eth:0xA8B389A82e088b164cD03230e900980CcED34d29"
      values.$admin:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.$implementation:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.0.2.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.1.2.0:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.bridge:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "eth:0x88FF1e5b602916615391F55854588EFcBB7663f0"
      values.BRIDGE:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "eth:0x88FF1e5b602916615391F55854588EFcBB7663f0"
      implementationNames.0xA8B389A82e088b164cD03230e900980CcED34d29:
-        "Proxy"
      implementationNames.0x5493f4677A186f64805fe7317D6993ba4863988F:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xA8B389A82e088b164cD03230e900980CcED34d29:
+        "Proxy"
      implementationNames.eth:0x5493f4677A186f64805fe7317D6993ba4863988F:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    EOA  (0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621) {
    +++ description: None
      address:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
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
    EOA  (0xB65540bBA534E88EB4a5062D0E6519C07063b259) {
    +++ description: None
      address:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      address:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.$members.1:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.2:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.$members.3:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "eth:0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.4:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "eth:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.5:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "eth:0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.6:
-        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
+        "eth:0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.7:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "eth:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.8:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.9:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "eth:0x547D0F472309e4239b296D01e03bEDc101241a26"
      implementationNames.0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
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
    contract DelayedWETH (0xc4986627A41cdCf6fa33543D96f00F475bCE42f5) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
+        "eth:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
      values.$admin:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.$implementation:
-        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
+        "eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.0.2.0:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.$pastUpgrades.1.2.0:
-        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
+        "eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.config:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0xc4986627A41cdCf6fa33543D96f00F475bCE42f5:
-        "Proxy"
      implementationNames.0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
-        "DelayedWETH"
      implementationNames.eth:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5:
+        "Proxy"
      implementationNames.eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
+        "DelayedWETH"
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
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      address:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.addressManager:
-        "0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
+        "eth:0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0xd56045E68956FCe2576E680c95a4750cf8241f79:
-        "ProxyAdmin"
      implementationNames.eth:0xd56045E68956FCe2576E680c95a4750cf8241f79:
+        "ProxyAdmin"
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
    EOA  (0xEF9A98511939eEe6Ec69af62082E3F2ff606877c) {
    +++ description: None
      address:
-        "0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
+        "eth:0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
    }
```

```diff
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      address:
-        "0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
+        "eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
      values.oracle:
-        "0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
+        "eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
      implementationNames.0xF027F4A985560fb13324e943edf55ad6F1d15Dc1:
-        "MIPS64"
      implementationNames.eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1:
+        "MIPS64"
    }
```

```diff
    contract DelayedWETH (0xf6b1554F483C391414d3830927E3600c105AaE6E) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "eth:0xf6b1554F483C391414d3830927E3600c105AaE6E"
      values.$admin:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      values.$implementation:
-        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
+        "eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.0.2.0:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "eth:0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
      values.$pastUpgrades.1.2.0:
-        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
+        "eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.config:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0xf6b1554F483C391414d3830927E3600c105AaE6E:
-        "Proxy"
      implementationNames.0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
-        "DelayedWETH"
      implementationNames.eth:0xf6b1554F483C391414d3830927E3600c105AaE6E:
+        "Proxy"
      implementationNames.eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
+        "DelayedWETH"
    }
```

```diff
    EOA  (0xf83bC4688979b13Da02CB94c76cEB169540760b5) {
    +++ description: None
      address:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
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
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x40641A4023f0F4C66D7f8Ade16497f4C947A7163)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
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
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x661235a238B11191211fa95D4Dd9E423d521E0Be)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract AddressManager (0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xA8B389A82e088b164cD03230e900980CcED34d29)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xc4986627A41cdCf6fa33543D96f00F475bCE42f5)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xf6b1554F483C391414d3830927E3600c105AaE6E)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

Generated with discovered.json: 0xd5fb842992e5f964d6cc9e3d70f15d261aca3bc3

# Diff at Mon, 14 Jul 2025 08:02:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22437737
- current block number: 22437737

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437737 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0xA8B389A82e088b164cD03230e900980CcED34d29) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xefde3fc1b8a61fd5d9e8c70a4cf5702a53b88a33

# Diff at Fri, 04 Jul 2025 12:19:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22437737
- current block number: 22437737

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437737 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      directlyReceivedPermissions.0.from:
-        "ethereum:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
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
      receivedPermissions.0.via.3.address:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.0.via.2.address:
-        "ethereum:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      receivedPermissions.0.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.0.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "eth:0x126a736B18E0a64fBA19D421647A530E327E112C"
    }
```

```diff
    EOA  (0x500d7Ea63CF2E501dadaA5feeC1FC19FE2Aa72Ac) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "eth:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
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
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.0.from:
-        "ethereum:0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
+        "eth:0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
      receivedPermissions.1.from:
-        "ethereum:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
+        "eth:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.2.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.3.from:
-        "ethereum:0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "eth:0xf6b1554F483C391414d3830927E3600c105AaE6E"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.4.from:
-        "ethereum:0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "eth:0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.5.from:
-        "ethereum:0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
+        "eth:0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.6.from:
-        "ethereum:0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "eth:0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.7.from:
-        "ethereum:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "eth:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.8.from:
-        "ethereum:0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "eth:0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      receivedPermissions.9.via.0.address:
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.9.from:
-        "ethereum:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "eth:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      receivedPermissions.10.via.0.address:
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.10.from:
-        "ethereum:0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "eth:0x88FF1e5b602916615391F55854588EFcBB7663f0"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.11.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.12.via.0.address:
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.12.from:
-        "ethereum:0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "eth:0xA8B389A82e088b164cD03230e900980CcED34d29"
      receivedPermissions.13.via.0.address:
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.13.from:
-        "ethereum:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
+        "eth:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
      receivedPermissions.14.via.0.address:
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.14.from:
-        "ethereum:0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "eth:0xf6b1554F483C391414d3830927E3600c105AaE6E"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.1.from:
-        "ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "eth:0xd56045E68956FCe2576E680c95a4750cf8241f79"
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
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.via.1.address:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      receivedPermissions.0.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "eth:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
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

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
+        "eth:0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "eth:0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
+        "eth:0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "eth:0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "eth:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "eth:0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "eth:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "eth:0x88FF1e5b602916615391F55854588EFcBB7663f0"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "eth:0xA8B389A82e088b164cD03230e900980CcED34d29"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
+        "eth:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
      directlyReceivedPermissions.10.from:
-        "ethereum:0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "eth:0xf6b1554F483C391414d3830927E3600c105AaE6E"
    }
```

Generated with discovered.json: 0x4dd4f67b060c2cfdbd328a9f5e51b63378673e74

# Diff at Mon, 16 Jun 2025 08:43:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22437737
- current block number: 22437737

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437737 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.14:
+        {"permission":"upgrade","from":"ethereum:0xf6b1554F483C391414d3830927E3600c105AaE6E","role":"admin","via":[{"address":"ethereum:0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}
      receivedPermissions.13.from:
-        "ethereum:0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "ethereum:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
      receivedPermissions.12.from:
-        "ethereum:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
+        "ethereum:0xA8B389A82e088b164cD03230e900980CcED34d29"
      receivedPermissions.11.from:
-        "ethereum:0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "ethereum:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      receivedPermissions.10.from:
-        "ethereum:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "ethereum:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
    }
```

```diff
    contract L1CrossDomainMessenger (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
    }
```

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      directlyReceivedPermissions.10:
+        {"permission":"upgrade","from":"ethereum:0xf6b1554F483C391414d3830927E3600c105AaE6E","role":"admin"}
      directlyReceivedPermissions.9.from:
-        "ethereum:0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "ethereum:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
+        "ethereum:0xA8B389A82e088b164cD03230e900980CcED34d29"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "ethereum:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "ethereum:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
    }
```

Generated with discovered.json: 0x6173bf8884107d03bb7f08897767e9678c922843

# Diff at Fri, 30 May 2025 07:00:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22437737
- current block number: 22437737

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437737 (main branch discovery), not current.

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x6058e753ce01ae2467ac947ffa45655bf913d15d

# Diff at Fri, 23 May 2025 09:41:17 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437737
- current block number: 22437737

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437737 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
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
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions.0.role:
+        ".livenessGuard"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputy"
    }
```

```diff
    EOA  (0x500d7Ea63CF2E501dadaA5feeC1FC19FE2Aa72Ac) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
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
      receivedPermissions.13.role:
+        "admin"
      receivedPermissions.12.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.12.from:
-        "0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
+        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      receivedPermissions.12.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.12.role:
+        "admin"
      receivedPermissions.12.via:
+        [{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]
      receivedPermissions.11.from:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.10.from:
-        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
      receivedPermissions.10.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.10.via:
+        [{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]
      receivedPermissions.9.from:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.8.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
      receivedPermissions.8.description:
-        "set and change address mappings."
      receivedPermissions.8.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.7.via.0.address:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
+        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
      receivedPermissions.4.via:
-        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      receivedPermissions.4.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.4.role:
+        ".owner"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
      receivedPermissions.3.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.3.via:
-        [{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.2.via.0.address:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.from:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      receivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
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
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputyGuardian"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
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

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
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
      directlyReceivedPermissions.3.from:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      directlyReceivedPermissions.3.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.from:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      directlyReceivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xbb6d14bf8c424164c3292a6684f09366b149f461

# Diff at Fri, 09 May 2025 10:09:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437737
- current block number: 22437737

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437737 (main branch discovery), not current.

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.0.via.3.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      receivedPermissions.0.via.1.address:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.via.1.condition:
-        "restricted to the global pause function"
      receivedPermissions.0.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.0.via.0.condition:
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
      receivedPermissions.0.via.1.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
    }
```

Generated with discovered.json: 0xdee1d3508786c8d623d818e37081e095d345204d

# Diff at Thu, 08 May 2025 08:49:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22346275
- current block number: 22437737

## Description

OP stack DeputyPauser upgrade (see op mainnet for more info).

## Watched changes

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0x436BaC2Efe273e3f13eEFeda2b3689C34591bca1"
+        "0x40641A4023f0F4C66D7f8Ade16497f4C947A7163"
      values.gameImpls.3:
-        "0x0000000000000000000000000000000000000000"
+        "0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342"
      values.gameImpls.0:
-        "0x499E30a3b1BDB03f554fFFFAe4c9c5Edf31ca554"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x436BaC2Efe273e3f13eEFeda2b3689C34591bca1)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x499E30a3b1BDB03f554fFFFAe4c9c5Edf31ca554)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
    }
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x3cCF7C31a3A8C1b8aaA9A18FC2d010dDE4262342)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x40641A4023f0F4C66D7f8Ade16497f4C947A7163)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../ink/ethereum/.flat/DeputyPauseModule.sol       | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22346275 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x436BaC2Efe273e3f13eEFeda2b3689C34591bca1) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

```diff
    contract FaultDisputeGame (0x499E30a3b1BDB03f554fFFFAe4c9c5Edf31ca554) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0x37a6148042693a5b4b6e92fa0e93925c009d4376

# Diff at Tue, 29 Apr 2025 08:19:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22346275
- current block number: 22346275

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22346275 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}]
    }
```

```diff
    contract AnchorStateRegistry (0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}]
    }
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}]
    }
```

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x500d7Ea63CF2E501dadaA5feeC1FC19FE2Aa72Ac","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x661235a238B11191211fa95D4Dd9E423d521E0Be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}]
    }
```

```diff
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x847B5c174615B1B7fDF770882256e2D3E95b9D92","via":[{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"},{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"guard","to":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract AddressManager (0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"set and change address mappings.","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xA8B389A82e088b164cD03230e900980CcED34d29) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}]
    }
```

```diff
    contract DelayedWETH (0xc4986627A41cdCf6fa33543D96f00F475bCE42f5) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}]
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"set and change address mappings.","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

```diff
    contract DelayedWETH (0xf6b1554F483C391414d3830927E3600c105AaE6E) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}]
    }
```

Generated with discovered.json: 0xb3d59afc15cd10eb9d0263329a3e18b49dc36fd4

# Diff at Fri, 25 Apr 2025 13:16:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@652ccb636c46013db1624f1ac3562cb4dcbc059b block: 22243979
- current block number: 22346275

## Description

[Isthmus upgrade](https://vote.optimism.io/proposals/8705916809146420472067303211131851783087744913535435360574720946039078686841):
- upgraded proof system VM: MIPS (MT-Cannon MIPS64)
- operator fee (fee mechanism to improve fee config for zk proven and alt-DA systems)
- pectra readiness

## Watched changes

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0x69361c9134D620B704C2a72c58523a4373eCe86f"
+        "0x436BaC2Efe273e3f13eEFeda2b3689C34591bca1"
      values.gameImpls.0:
-        "0x4699D20479dfD20e15CaB4FCB6F2a7CC6fE35443"
+        "0x499E30a3b1BDB03f554fFFFAe4c9c5Edf31ca554"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x4699D20479dfD20e15CaB4FCB6F2a7CC6fE35443)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      sourceHashes.1:
-        "0x67ee16b5b6c32cdcc862bea390e45017908e6945cfaa01d3ef75dc9de7c9d946"
+        "0xc483ef9e0a5ec2a0450732e743b3784de0cd3876b8fadfce14c0805a0846d26b"
      values.$implementation:
-        "0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
+        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.2:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]]
      values.$pastUpgrades.1.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        ["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]
      values.$pastUpgrades.1.1:
-        "2025-04-02T16:50:23.000Z"
+        "2024-12-06T15:20:11.000Z"
      values.$pastUpgrades.1.0:
-        ["0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]
+        "0x45c2b63987a8c7ab97bdcdab5e04618d4ed74971aa4ac51b15ed8522ea6c0284"
      values.$pastUpgrades.0.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.0.1:
-        "2024-12-06T15:20:11.000Z"
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.0.0:
-        "0x45c2b63987a8c7ab97bdcdab5e04618d4ed74971aa4ac51b15ed8522ea6c0284"
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$upgradeCount:
-        2
+        3
      values.version:
-        "3.13.0"
+        "3.14.0"
    }
```

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x6e293d82eb36a83fb5d8b06268cd4fbf46027b87eea77fcc68f78e4b010a3774"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
+        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.3:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$pastUpgrades.2.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
      values.$pastUpgrades.2.1:
-        "2025-04-02T16:50:23.000Z"
+        "2024-12-06T15:20:11.000Z"
      values.$pastUpgrades.2.0:
-        ["0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]
+        "0x45c2b63987a8c7ab97bdcdab5e04618d4ed74971aa4ac51b15ed8522ea6c0284"
      values.$pastUpgrades.0.2:
-        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.0.1:
-        "2024-12-06T15:20:11.000Z"
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$pastUpgrades.0.0:
-        "0x45c2b63987a8c7ab97bdcdab5e04618d4ed74971aa4ac51b15ed8522ea6c0284"
+        ["0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "2.4.0"
+        "2.5.0"
      values.operatorFeeConstant:
+        0
      values.operatorFeeScalar:
+        0
    }
```

```diff
    contract L1ERC721Bridge (0x661235a238B11191211fa95D4Dd9E423d521E0Be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x9de28f19e0d1200bf0afda5ab90c9d2dffa44a775e71cfe9232ee1808338996c"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "0x276d3730f219f7ec22274f7263180b8452B46d47"
+        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.2:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$pastUpgrades.1.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
      values.$pastUpgrades.1.1:
-        "2025-04-02T16:50:23.000Z"
+        "2024-12-06T15:20:11.000Z"
      values.$pastUpgrades.1.0:
-        ["0x276d3730f219f7ec22274f7263180b8452B46d47"]
+        "0x45c2b63987a8c7ab97bdcdab5e04618d4ed74971aa4ac51b15ed8522ea6c0284"
      values.$pastUpgrades.0.2.0:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.0.1:
-        "2024-12-06T15:20:11.000Z"
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.0.0:
-        "0x45c2b63987a8c7ab97bdcdab5e04618d4ed74971aa4ac51b15ed8522ea6c0284"
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$upgradeCount:
-        2
+        3
      values.version:
-        "2.3.1"
+        "2.4.0"
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x69361c9134D620B704C2a72c58523a4373eCe86f)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract L1CrossDomainMessenger (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xfaa50769db48b1d2c04c06a8a0a4771b87b3c0ff20a508115bfdb2b576fdb454"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
+        "0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.2:
+        ["2024-12-06T15:20:11.000Z","0x45c2b63987a8c7ab97bdcdab5e04618d4ed74971aa4ac51b15ed8522ea6c0284",["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.1.2:
-        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.1.1:
-        "2024-12-06T15:20:11.000Z"
+        ["0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]
      values.$pastUpgrades.1.0:
-        "0x45c2b63987a8c7ab97bdcdab5e04618d4ed74971aa4ac51b15ed8522ea6c0284"
+        "2025-04-02T16:50:23.000Z"
      values.$pastUpgrades.0.2:
-        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
+        ["0x5D5a095665886119693F0B41d8DFeE78da033e8B"]
      values.$pastUpgrades.0.1:
-        ["0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]
+        "2025-04-24T16:16:23.000Z"
      values.$pastUpgrades.0.0:
-        "2025-04-02T16:50:23.000Z"
+        "0xbe44244e352a9ffa67ad7f7133e9ed014b380e4b1bd789419e6d33aaad780d12"
      values.$upgradeCount:
-        2
+        3
      values.version:
-        "2.5.0"
+        "2.6.0"
      values.ENCODING_OVERHEAD:
+        260
      values.FLOOR_CALLDATA_OVERHEAD:
+        40
      values.TX_BASE_GAS:
+        21000
    }
```

```diff
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x4a2d83507f25be218f504b76815e4494138af88734cc54d34666c631aea88af5"
+        "0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31"
      sourceHashes.0:
-        "0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31"
+        "0x4e15d99844dc5a4304c2396a66c95ec41218ea311c8e524b118fad7beed0bb53"
      values.$implementation:
-        "0x78972E88Ab8BBB517a36cAea23b931BAB58AD3c6"
+        "0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
      values.version:
-        "2.2.2"
+        "2.3.0"
    }
```

```diff
-   Status: DELETED
    contract MIPS (0xaA59A0777648BC75cd10364083e878c1cCd6112a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x436BaC2Efe273e3f13eEFeda2b3689C34591bca1)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x499E30a3b1BDB03f554fFFFAe4c9c5Edf31ca554)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     |  350 +++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |   21 +-
 .../L1StandardBridge/L1StandardBridge.sol          |   21 +-
 .../ethereum/{.flat@22243979 => .flat}/MIPS.sol    | 1869 ++++++++++++++------
 .../OptimismPortal2/OptimismPortal2.sol            |   83 +-
 .../SystemConfig/SystemConfig.sol                  |   29 +-
 6 files changed, 1793 insertions(+), 580 deletions(-)
```

Generated with discovered.json: 0xabd791d75ae2154958d1aa5bbc07992f7c02f1cb

# Diff at Fri, 11 Apr 2025 13:15:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22243979
- current block number: 22243979

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243979 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x4699D20479dfD20e15CaB4FCB6F2a7CC6fE35443) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
-        "0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9"
+        "v1.5.0"
      usedTypes.0.arg.0x03ee2917da962ec266b091f4b62121dc9682bb0db534633707325339f99ee405:
+        "v1.5.1-rc.1 (cannon64)"
      usedTypes.0.arg.0x0354eee87a1775d96afee8977ef6d5d6bd3612b256170952a01bf1051610ee01:
+        "v1.5.1-rc.1"
      usedTypes.0.arg.0x039970872142f48b189d18dcbc03a3737338d098b0101713dc2d6710f9deb5ef:
+        "v1.5.0 (cannon64)"
      usedTypes.0.arg.0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9:
+        "v1.5.0"
      usedTypes.0.arg.0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37:
+        "v1.4.0-unichain"
    }
```

```diff
    contract FaultDisputeGame (0x69361c9134D620B704C2a72c58523a4373eCe86f) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
-        "0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9"
+        "v1.5.0"
      usedTypes.0.arg.0x03ee2917da962ec266b091f4b62121dc9682bb0db534633707325339f99ee405:
+        "v1.5.1-rc.1 (cannon64)"
      usedTypes.0.arg.0x0354eee87a1775d96afee8977ef6d5d6bd3612b256170952a01bf1051610ee01:
+        "v1.5.1-rc.1"
      usedTypes.0.arg.0x039970872142f48b189d18dcbc03a3737338d098b0101713dc2d6710f9deb5ef:
+        "v1.5.0 (cannon64)"
      usedTypes.0.arg.0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9:
+        "v1.5.0"
      usedTypes.0.arg.0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37:
+        "v1.4.0-unichain"
    }
```

Generated with discovered.json: 0x541c61b3a392fcb0505fc1b9c235b2c6fca51648

# Diff at Thu, 10 Apr 2025 14:42:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22194724
- current block number: 22194724

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194724 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xd99f0fe7303261dd0307b30b4ae49a97afeb2a7d

# Diff at Fri, 04 Apr 2025 09:41:29 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 22073248
- current block number: 22194724

## Description

Discovery rerun on the same block number with only config-related changes.

## Watched changes

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x7f307d6191215a72b6c24c01b3c2fc87c84f7fb346790132e58736caa2d1dd14"
+        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
      values.$implementation:
-        "0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
      values.$pastUpgrades.1:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x4bbA758F006Ef09402eF31724203F316ab74e4a0"]]
      values.$upgradeCount:
-        1
+        2
      values.gameImpls.4:
-        "0x8D9faaEb46cBCf487baf2182E438Ac3D0847F637"
+        "0x69361c9134D620B704C2a72c58523a4373eCe86f"
      values.gameImpls.0:
-        "0x7e87B471e96b96955044328242456427A0D49694"
+        "0x4699D20479dfD20e15CaB4FCB6F2a7CC6fE35443"
      values.version:
-        "1.0.0"
+        "1.0.1"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.6.from:
-        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
      receivedPermissions.5.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
      receivedPermissions.5.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.4.from:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.4.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.4.via.0.address:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.3.from:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      receivedPermissions.3.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.2.from:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      receivedPermissions.1.from:
-        "0xde744491BcF6b2DD2F32146364Ea1487D75E2509"
+        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
    }
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      sourceHashes.1:
-        "0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"
+        "0x67ee16b5b6c32cdcc862bea390e45017908e6945cfaa01d3ef75dc9de7c9d946"
      values.$implementation:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
      values.$pastUpgrades.1:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "3.10.0"
+        "3.13.0"
    }
```

```diff
-   Status: DELETED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xbbb92920a096eced30e3ce67bbc443f134b217e8847433fbb192ecb9fdddcbc2"
+        "0x6e293d82eb36a83fb5d8b06268cd4fbf46027b87eea77fcc68f78e4b010a3774"
      values.$implementation:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
      values.$pastUpgrades.2:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]]
      values.$upgradeCount:
-        2
+        3
      values.version:
-        "2.2.0"
+        "2.4.0"
      values.basefeeScalar:
+        0
      values.blobbasefeeScalar:
+        0
      values.eip1559Denominator:
+        0
      values.eip1559Elasticity:
+        0
      values.getAddresses:
+        {"l1CrossDomainMessenger":"0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f","l1ERC721Bridge":"0x661235a238B11191211fa95D4Dd9E423d521E0Be","l1StandardBridge":"0x88FF1e5b602916615391F55854588EFcBB7663f0","disputeGameFactory":"0x10d7B35078d3baabB96Dd45a9143B94be65b12CD","optimismPortal":"0x5d66C1782664115999C47c9fA5cd031f495D3e4F","optimismMintableERC20Factory":"0xA8B389A82e088b164cD03230e900980CcED34d29"}
    }
```

```diff
    contract L1ERC721Bridge (0x661235a238B11191211fa95D4Dd9E423d521E0Be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x9de28f19e0d1200bf0afda5ab90c9d2dffa44a775e71cfe9232ee1808338996c"
      values.$implementation:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "0x276d3730f219f7ec22274f7263180b8452B46d47"
      values.$pastUpgrades.1:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x276d3730f219f7ec22274f7263180b8452B46d47"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "2.1.0"
+        "2.3.1"
    }
```

```diff
    contract L1CrossDomainMessenger (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b"
+        "0xfaa50769db48b1d2c04c06a8a0a4771b87b3c0ff20a508115bfdb2b576fdb454"
      sourceHashes.0:
-        "0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"
+        "0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b"
      values.$implementation:
-        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
+        "0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
      values.$pastUpgrades.1:
+        ["2024-12-06T15:20:11.000Z","0x45c2b63987a8c7ab97bdcdab5e04618d4ed74971aa4ac51b15ed8522ea6c0284",["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.0.2:
-        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
+        "0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29"
      values.$pastUpgrades.0.1:
-        "2024-12-06T15:20:11.000Z"
+        ["0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]
      values.$pastUpgrades.0.0:
-        "0x45c2b63987a8c7ab97bdcdab5e04618d4ed74971aa4ac51b15ed8522ea6c0284"
+        "2025-04-02T16:50:23.000Z"
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "2.3.0"
+        "2.5.0"
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x7e87B471e96b96955044328242456427A0D49694)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"
+        "0x4a2d83507f25be218f504b76815e4494138af88734cc54d34666c631aea88af5"
      values.$implementation:
-        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
+        "0x78972E88Ab8BBB517a36cAea23b931BAB58AD3c6"
      values.version:
-        "2.1.0"
+        "2.2.2"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x8D9faaEb46cBCf487baf2182E438Ac3D0847F637)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes.1:
-        "0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"
+        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
      values.$implementation:
-        "0x53c165169401764778F780a69701385eb0FF19B7"
+        "0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
      values.$pastUpgrades.3:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x4da82a327773965b8d4D85Fa3dB8249b387458E7"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "1.1.0"
+        "1.2.0"
    }
```

```diff
-   Status: DELETED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
    contract OptimismMintableERC20Factory (0xA8B389A82e088b164cD03230e900980CcED34d29) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.1:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x5493f4677A186f64805fe7317D6993ba4863988F"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.9.0"
+        "1.10.1"
    }
```

```diff
    contract DelayedWETH (0xc4986627A41cdCf6fa33543D96f00F475bCE42f5) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0xfff6f4cca21febd4323222e2ca87ec8b78edfdeeca942468fbf331e537815484"
+        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
      values.$implementation:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.1:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x5e40B9231B86984b5150507046e354dbFbeD3d9e"]]
      values.$upgradeCount:
-        1
+        2
      values.delay:
-        604800
+        302400
      values.version:
-        "1.1.0"
+        "1.3.0"
    }
```

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      directlyReceivedPermissions.5.from:
-        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
+        "0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d"
      directlyReceivedPermissions.4.from:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
      directlyReceivedPermissions.4.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.3.from:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      directlyReceivedPermissions.3.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.2.from:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      directlyReceivedPermissions.1.from:
-        "0xde744491BcF6b2DD2F32146364Ea1487D75E2509"
+        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
    }
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0xde744491BcF6b2DD2F32146364Ea1487D75E2509)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
    contract DelayedWETH (0xf6b1554F483C391414d3830927E3600c105AaE6E) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0xfff6f4cca21febd4323222e2ca87ec8b78edfdeeca942468fbf331e537815484"
+        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
      values.$implementation:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.1:
+        ["2025-04-02T16:50:23.000Z","0x5f3530e593bbac37c61dc5b7755b6a40c06c20c1a3a1b13fca5b7d00cde65c29",["0x5e40B9231B86984b5150507046e354dbFbeD3d9e"]]
      values.$upgradeCount:
-        1
+        2
      values.delay:
-        604800
+        302400
      values.version:
-        "1.1.0"
+        "1.3.0"
    }
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x2fc99fd16D8D3F6F66d164aA84E244c567E58A3d)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x4699D20479dfD20e15CaB4FCB6F2a7CC6fE35443)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x69361c9134D620B704C2a72c58523a4373eCe86f)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract MIPS (0xaA59A0777648BC75cd10364083e878c1cCd6112a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    | 270 ++++++++---
 .../DelayedWETH.sol                                | 231 ++++------
 .../DelayedWETH.sol                                | 231 ++++------
 .../DisputeGameFactory/DisputeGameFactory.sol      | 240 ++++------
 .../{.flat@22073248 => .flat}/FaultDisputeGame.sol | 230 +++++++---
 .../L1CrossDomainMessenger.sol                     | 400 +++++++++++-----
 .../L1ERC721Bridge/L1ERC721Bridge.sol              | 413 ++++++++++-------
 .../L1StandardBridge/L1StandardBridge.sol          | 503 +++++++++++++--------
 .../ethereum/{.flat@22073248 => .flat}/MIPS.sol    |  75 +--
 .../OptimismMintableERC20Factory.sol               |  30 +-
 .../OptimismPortal2/OptimismPortal2.sol            | 439 +++++++++++++-----
 .../PermissionedDisputeGame.sol                    | 267 +++++++----
 .../{.flat@22073248 => .flat}/PreimageOracle.sol   | 216 ++++-----
 .../SuperchainConfig/SuperchainConfig.sol          |   8 +-
 .../SystemConfig/SystemConfig.sol                  | 150 +++---
 15 files changed, 2237 insertions(+), 1466 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22073248 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","from":"0x661235a238B11191211fa95D4Dd9E423d521E0Be","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}
      receivedPermissions.12:
+        {"permission":"interact","from":"0xc4986627A41cdCf6fa33543D96f00F475bCE42f5","description":"can pull funds from the contract in case of emergency."}
      receivedPermissions.11.from:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      receivedPermissions.10.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.10.from:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
      receivedPermissions.10.via:
-        [{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]
      receivedPermissions.10.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract DelayedWETH (0xc4986627A41cdCf6fa33543D96f00F475bCE42f5) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.via.0:
-        {"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}
      issuedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract DelayedWETH (0xf6b1554F483C391414d3830927E3600c105AaE6E) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.via.0:
-        {"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}
      issuedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

Generated with discovered.json: 0x67a5f98271fa82488f335e016df752b82031e42d

# Diff at Thu, 27 Mar 2025 11:14:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22073248
- current block number: 22073248

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22073248 (main branch discovery), not current.

```diff
    contract AddressManager (0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0xeb20e73b6fbfe13bf9aeddf2a86166cd7da165ea

# Diff at Tue, 18 Mar 2025 10:45:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8a389387016e20fe96cd5cb775e4b943b3aaa832 block: 21829669
- current block number: 22073248

## Description

Migrate to new FaultDisputeGame (v1.3.1), which is the same as the one used by op mainnet and unichain.

## Watched changes

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x0A780bE3eB21117b1bBCD74cf5D7624A3a482963)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0x6A8eFcba5642EB15D743CBB29545BdC44D5Ad8cD"
+        "0x8D9faaEb46cBCf487baf2182E438Ac3D0847F637"
      values.gameImpls.0:
-        "0x0A780bE3eB21117b1bBCD74cf5D7624A3a482963"
+        "0x7e87B471e96b96955044328242456427A0D49694"
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
-   Status: DELETED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
-   Status: DELETED
    contract DelayedWETH (0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.7.from:
-        "0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50"
+        "0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
      receivedPermissions.6.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
      receivedPermissions.6.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.5.from:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.5.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.5.via.0.address:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.4.from:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      receivedPermissions.4.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.3.from:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      receivedPermissions.2.from:
-        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
+        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x6A8eFcba5642EB15D743CBB29545BdC44D5Ad8cD)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      directlyReceivedPermissions.6.from:
-        "0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50"
+        "0xc4986627A41cdCf6fa33543D96f00F475bCE42f5"
      directlyReceivedPermissions.5.from:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0xf6b1554F483C391414d3830927E3600c105AaE6E"
      directlyReceivedPermissions.5.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.4.from:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      directlyReceivedPermissions.4.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.3.from:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
+        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      directlyReceivedPermissions.2.from:
-        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
+        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
    }
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x7e87B471e96b96955044328242456427A0D49694)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x8D9faaEb46cBCf487baf2182E438Ac3D0847F637)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xc4986627A41cdCf6fa33543D96f00F475bCE42f5)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xf6b1554F483C391414d3830927E3600c105AaE6E)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

## Source code changes

```diff
.../DelayedWETH.sol                                |   0
 .../Proxy.p.sol                                    |   0
 .../DelayedWETH.sol                                |   0
 .../Proxy.p.sol                                    |   0
 .../{.flat@21829669 => .flat}/FaultDisputeGame.sol | 386 ++++++++----------
 .../ethereum/{.flat@21829669 => .flat}/MIPS.sol    | 444 +++++++++++++++------
 .../PermissionedDisputeGame.sol                    | 408 +++++++++----------
 7 files changed, 681 insertions(+), 557 deletions(-)
```

Generated with discovered.json: 0x4574f6cec9b03eb0df294d808daf3b189b83eb09

# Diff at Tue, 18 Mar 2025 08:12:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21829669
- current block number: 21829669

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829669 (main branch discovery), not current.

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      name:
-        "SuperchainGuardianMultisig"
+        "Optimism Guardian Multisig"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "GelatoMultisig"
+        "Gelato Multisig"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      name:
-        "SecurityCouncilMultisig"
+        "Optimism Security Council"
    }
```

Generated with discovered.json: 0x6bc9ab2a766e25bc56b067e47f77aa1c2d4c2d91

# Diff at Tue, 04 Mar 2025 11:25:51 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21829669
- current block number: 21829669

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829669 (main branch discovery), not current.

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x3226444218e7edd27b715d9be7690b78da274957

# Diff at Tue, 04 Mar 2025 10:39:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21829669
- current block number: 21829669

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829669 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sinceBlock:
+        19989094
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      sinceBlock:
+        19968607
    }
```

```diff
    contract PermissionedDisputeGame (0x0A780bE3eB21117b1bBCD74cf5D7624A3a482963) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sinceBlock:
+        21387927
    }
```

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sinceBlock:
+        21344310
    }
```

```diff
    contract DelayedWETH (0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21344310
    }
```

```diff
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sinceBlock:
+        20637601
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      sinceBlock:
+        19989094
    }
```

```diff
    contract DelayedWETH (0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21387926
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      sinceBlock:
+        16780617
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      sinceBlock:
+        17365800
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      sinceBlock:
+        19185554
    }
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      sinceBlock:
+        21344310
    }
```

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21344310
    }
```

```diff
    contract L1ERC721Bridge (0x661235a238B11191211fa95D4Dd9E423d521E0Be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21344310
    }
```

```diff
    contract L1CrossDomainMessenger (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21344310
    }
```

```diff
    contract FaultDisputeGame (0x6A8eFcba5642EB15D743CBB29545BdC44D5Ad8cD) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      sinceBlock:
+        21387926
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      sinceBlock:
+        19185544
    }
```

```diff
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21344310
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19064589
    }
```

```diff
    contract AddressManager (0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21344310
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      sinceBlock:
+        11670007
    }
```

```diff
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      sinceBlock:
+        20637600
    }
```

```diff
    contract OptimismMintableERC20Factory (0xA8B389A82e088b164cD03230e900980CcED34d29) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21344310
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sinceBlock:
+        19521321
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      sinceBlock:
+        19185517
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      sinceBlock:
+        20566057
    }
```

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      sinceBlock:
+        21344310
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        12686687
    }
```

```diff
    contract AnchorStateRegistry (0xde744491BcF6b2DD2F32146364Ea1487D75E2509) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sinceBlock:
+        21344310
    }
```

Generated with discovered.json: 0xe33a13902e73328d352cbc118b00c8f47d5e92e1

# Diff at Thu, 27 Feb 2025 12:01:45 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21829669
- current block number: 21829669

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829669 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      displayName:
-        "OptimismPortal"
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      name:
-        "Lib_AddressManager"
+        "AddressManager"
      displayName:
-        "AddressManager"
    }
```

Generated with discovered.json: 0x824060b0d0b3aa2b6fbfdfb96f5c2a346b8d032f

# Diff at Wed, 26 Feb 2025 10:32:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21829669
- current block number: 21829669

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829669 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x661235a238B11191211fa95D4Dd9E423d521E0Be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1CrossDomainMessenger (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

Generated with discovered.json: 0x978422e808148c00de998f85ee7fcf917d3cb06f

# Diff at Fri, 21 Feb 2025 08:59:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21829669
- current block number: 21829669

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829669 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0x152ab089a2e05673aa4ccdd751e93343346c86c0

# Diff at Wed, 12 Feb 2025 09:59:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21802917
- current block number: 21829669

## Description

Optimism SecurityCouncil rotates signers.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.7:
-        "0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310"
+        "0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
      values.$members.5:
-        "0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e"
+        "0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
    }
```

Generated with discovered.json: 0x51b44a72e727543c7806f1998145b046cf1c10a7

# Diff at Mon, 10 Feb 2025 19:04:06 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802917
- current block number: 21802917

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802917 (main branch discovery), not current.

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x7a22454b0efeeff33b86aafa1dc9366d5228c37b

# Diff at Sat, 08 Feb 2025 16:14:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786504
- current block number: 21802917

## Description

Two SC members rotated.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.12:
-        "0xE895076cD050F1f042d1040E47b5929bE989E514"
+        "0x92827223f6b397CE9F208eE352bacA710765cACb"
      values.$members.1:
-        "0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8"
+        "0x652BC529E171847E2fFddCeA13567643C84ccB5f"
    }
```

Generated with discovered.json: 0x40905033f25aa607f56367888fedf976c8a7e073

# Diff at Thu, 06 Feb 2025 09:16:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21693174
- current block number: 21786504

## Description

OP Stack SC signer rotation.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.9:
-        "0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4"
+        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
    }
```

Generated with discovered.json: 0x96ad07ea6eb1fef68fa1ba6dc073880cb6c90f5a

# Diff at Tue, 04 Feb 2025 12:31:34 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21693174
- current block number: 21693174

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21693174 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x018cb8fe28c965964ae8770cafcbe8a3dfe2e913

# Diff at Fri, 24 Jan 2025 08:30:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fff69b1db37918a5360f1e3b59d2f37be25d166f block: 21683128
- current block number: 21693174

## Description

re-add the permissioned games tracker since the default is permissionless games now.

## Watched changes

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.permissionedGamesTotal:
-        189
+        190
    }
```

Generated with discovered.json: 0x7a36e6d5d5f232b9a210ec340cdc53833f64658d

# Diff at Wed, 22 Jan 2025 22:51:41 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@af6bc3140c90ba5793649c2811c2989f199e73e5 block: 21629240
- current block number: 21683128

## Description

Ink is now Stage 1.

## Watched changes

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      description:
-        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame."
      values.RespectedGameString:
-        "PermissionedDisputeGame"
+        "FaultDisputeGame"
      values.respectedGameType:
-        1
+        0
      values.respectedGameTypeUpdatedAt:
-        1733498411
+        1737576635
    }
```

Generated with discovered.json: 0x7fbbe7990799ca381049246d6e54e8f8710ac1b3

# Diff at Tue, 21 Jan 2025 11:19:02 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@0da84acc479f34212f2c8133869a3eef33d46ecc block: 21629240
- current block number: 21629240

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629240 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions:
-        [{"permission":"guard","from":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]}]
      issuedPermissions:
+        [{"permission":"configure","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."}]
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","from":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","description":"takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.via.0.condition:
+        "not revoked by the Security Council"
      issuedPermissions.0.to:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      issuedPermissions.0.via.2:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}
      issuedPermissions.0.via.1.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.0.condition:
+        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.via.1.condition:
+        "not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
+        "not revoked by the Security Council"
    }
```

Generated with discovered.json: 0x2b04f0a4a4f2e710fd4cd572392f71de21eb7221

# Diff at Mon, 20 Jan 2025 11:09:37 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21629240
- current block number: 21629240

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629240 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      directlyReceivedPermissions.0.from:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract DelayedWETH (0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract DelayedWETH (0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.0.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.11.target:
-        "0xde744491BcF6b2DD2F32146364Ea1487D75E2509"
      receivedPermissions.11.from:
+        "0xde744491BcF6b2DD2F32146364Ea1487D75E2509"
      receivedPermissions.10.target:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      receivedPermissions.10.from:
+        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      receivedPermissions.9.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.9.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.8.target:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      receivedPermissions.8.from:
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      receivedPermissions.7.target:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      receivedPermissions.7.from:
+        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      receivedPermissions.6.target:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      receivedPermissions.6.from:
+        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      receivedPermissions.5.target:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      receivedPermissions.5.from:
+        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      receivedPermissions.4.target:
-        "0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50"
      receivedPermissions.4.from:
+        "0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50"
      receivedPermissions.3.target:
-        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
      receivedPermissions.3.from:
+        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
      receivedPermissions.2.target:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      receivedPermissions.2.from:
+        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      receivedPermissions.1.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.1.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.target:
-        "0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
      receivedPermissions.0.from:
+        "0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
      directlyReceivedPermissions.1.target:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
      directlyReceivedPermissions.1.from:
+        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
      directlyReceivedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.0.from:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.1.target:
-        "0x500d7Ea63CF2E501dadaA5feeC1FC19FE2Aa72Ac"
      issuedPermissions.1.to:
+        "0x500d7Ea63CF2E501dadaA5feeC1FC19FE2Aa72Ac"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L1ERC721Bridge (0x661235a238B11191211fa95D4Dd9E423d521E0Be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.3.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.1.target:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.target:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    contract AddressManager (0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      directlyReceivedPermissions.0.from:
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xA8B389A82e088b164cD03230e900980CcED34d29) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      receivedPermissions.0.from:
+        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions.0.target:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      directlyReceivedPermissions.0.from:
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      directlyReceivedPermissions.9.target:
-        "0xde744491BcF6b2DD2F32146364Ea1487D75E2509"
      directlyReceivedPermissions.9.from:
+        "0xde744491BcF6b2DD2F32146364Ea1487D75E2509"
      directlyReceivedPermissions.8.target:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      directlyReceivedPermissions.8.from:
+        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      directlyReceivedPermissions.7.target:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      directlyReceivedPermissions.7.from:
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      directlyReceivedPermissions.6.target:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      directlyReceivedPermissions.6.from:
+        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      directlyReceivedPermissions.5.target:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      directlyReceivedPermissions.5.from:
+        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      directlyReceivedPermissions.4.target:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      directlyReceivedPermissions.4.from:
+        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      directlyReceivedPermissions.3.target:
-        "0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50"
      directlyReceivedPermissions.3.from:
+        "0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50"
      directlyReceivedPermissions.2.target:
-        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
      directlyReceivedPermissions.2.from:
+        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
      directlyReceivedPermissions.1.target:
-        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      directlyReceivedPermissions.1.from:
+        "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD"
      directlyReceivedPermissions.0.target:
-        "0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
      directlyReceivedPermissions.0.from:
+        "0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153"
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AnchorStateRegistry (0xde744491BcF6b2DD2F32146364Ea1487D75E2509) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

Generated with discovered.json: 0x8e79e78cc92b88a315cbb23e938a27ddfb9a49fc

# Diff at Thu, 16 Jan 2025 10:14:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 21629240
- current block number: 21629240

## Description

Add decoding of absolute prestate hashes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629240 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x0A780bE3eB21117b1bBCD74cf5D7624A3a482963) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
+        "v1.3.1-ink"
      fieldMeta:
+        {"absolutePrestateDecoded":{"description":"Prestate tag for known prestates."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x0386cde2f2b1bde1189ac9c9b7d66774e6260eca778223def326bfe680c14ab9":"v1.4.1-rc.2 (cannon64)","0x03045fd433fb5391c40751939d7cb5e9dfe83cf156f9395566a311e7fe9d3aa2":"v1.4.1-rc.2","0x03b7eaa4e3cbce90381921a4b48008f4769871d64f93d113fcadca08ecee503b":"v1.4.0 (cannon64)","0x03f89406817db1ed7fd8b31e13300444652cdb0b9c509a674de43483b2f83568":"v1.4.0 (govApproved)","0x0348ce2059f718af75729c2c56860551b46b665956a641b3cb2cd51e50b7b725":"v1.4.0-rc.2 (cannon64)","0x0364e4e72922e7d649338f558f8a14b50ca31922a1484e73ea03987fb1516095":"v1.4.0-rc.2","0x032e5d6119ee983cb87deae3eef16ea6086f2347433c99f1820d60f36a24a6e6":"v1.4.0-rc.1 (cannon64)","0x03925193e3e89f87835bbdf3a813f60b2aa818a36bbe71cd5d8fd7e79f5e8afe":"v1.4.0-rc.1","0x03c50b9fd04bdadc228205f340767bbf2d01a030aec39903120d3559d94bb8cc":"v1.3.1-ink","0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c":"v1.3.1 (govApproved)","0x03e806a2859a875267a563462a06d4d1d1b455a9efee959a46e21e54b6caf69a":"v1.3.1-rc.1","0x030de10d9da911a2b180ecfae2aeaba8758961fc28262ce989458c6f9a547922":"v1.3.0-rc.3","0x0385c3f8ee78491001d92b90b07d0cf387b7b52ab9b83b4d87c994e92cf823ba":"v1.3.0-rc.2","0x0367c4aa897bffbded0b523f277ca892298dc3c691baf37bc2099b86024f9673":"v1.3.0-rc.1","0x03617abec0b255dc7fc7a0513a2c2220140a1dcd7a1c8eca567659bd67e05cea":"v1.2.0 (govApproved)","0x03e69d3de5155f4a80da99dd534561cbddd4f9dd56c9ecc704d6886625711d2b":"v1.1.0","0x0398bdd93e2e9313befdf82beb709da6a4daf35ce1abb42d8a998ec9bc1c572e":"v1.0.1","0x037ef3c1a487960b0e633d3e513df020c43432769f41a634d18a9595cbf53c55":"v1.0.0 (govApproved)","0x034c8cc69f22c35ae386a97136715dd48aaf97fd190942a111bfa680c2f2f421":"v0.3.0","0x031e3b504740d0b1264e8cf72b6dde0d497184cfb3f98e451c6be8b33bd3f808":"v0.2.0","0x038942ec840131a63c49fa514a3f0577ae401fd5584d56ad50cdf5a8b41d4538":"v0.1.0","0x03babef4b4c6d866d56e6356d961839fd9475931d11e0ea507420a87b0cadbdd":"v0.0.1"}}]
    }
```

```diff
    contract FaultDisputeGame (0x6A8eFcba5642EB15D743CBB29545BdC44D5Ad8cD) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
+        "v1.3.1-ink"
      fieldMeta:
+        {"absolutePrestateDecoded":{"description":"Prestate tag for known prestates."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x0386cde2f2b1bde1189ac9c9b7d66774e6260eca778223def326bfe680c14ab9":"v1.4.1-rc.2 (cannon64)","0x03045fd433fb5391c40751939d7cb5e9dfe83cf156f9395566a311e7fe9d3aa2":"v1.4.1-rc.2","0x03b7eaa4e3cbce90381921a4b48008f4769871d64f93d113fcadca08ecee503b":"v1.4.0 (cannon64)","0x03f89406817db1ed7fd8b31e13300444652cdb0b9c509a674de43483b2f83568":"v1.4.0 (govApproved)","0x0348ce2059f718af75729c2c56860551b46b665956a641b3cb2cd51e50b7b725":"v1.4.0-rc.2 (cannon64)","0x0364e4e72922e7d649338f558f8a14b50ca31922a1484e73ea03987fb1516095":"v1.4.0-rc.2","0x032e5d6119ee983cb87deae3eef16ea6086f2347433c99f1820d60f36a24a6e6":"v1.4.0-rc.1 (cannon64)","0x03925193e3e89f87835bbdf3a813f60b2aa818a36bbe71cd5d8fd7e79f5e8afe":"v1.4.0-rc.1","0x03c50b9fd04bdadc228205f340767bbf2d01a030aec39903120d3559d94bb8cc":"v1.3.1-ink","0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c":"v1.3.1 (govApproved)","0x03e806a2859a875267a563462a06d4d1d1b455a9efee959a46e21e54b6caf69a":"v1.3.1-rc.1","0x030de10d9da911a2b180ecfae2aeaba8758961fc28262ce989458c6f9a547922":"v1.3.0-rc.3","0x0385c3f8ee78491001d92b90b07d0cf387b7b52ab9b83b4d87c994e92cf823ba":"v1.3.0-rc.2","0x0367c4aa897bffbded0b523f277ca892298dc3c691baf37bc2099b86024f9673":"v1.3.0-rc.1","0x03617abec0b255dc7fc7a0513a2c2220140a1dcd7a1c8eca567659bd67e05cea":"v1.2.0 (govApproved)","0x03e69d3de5155f4a80da99dd534561cbddd4f9dd56c9ecc704d6886625711d2b":"v1.1.0","0x0398bdd93e2e9313befdf82beb709da6a4daf35ce1abb42d8a998ec9bc1c572e":"v1.0.1","0x037ef3c1a487960b0e633d3e513df020c43432769f41a634d18a9595cbf53c55":"v1.0.0 (govApproved)","0x034c8cc69f22c35ae386a97136715dd48aaf97fd190942a111bfa680c2f2f421":"v0.3.0","0x031e3b504740d0b1264e8cf72b6dde0d497184cfb3f98e451c6be8b33bd3f808":"v0.2.0","0x038942ec840131a63c49fa514a3f0577ae401fd5584d56ad50cdf5a8b41d4538":"v0.1.0","0x03babef4b4c6d866d56e6356d961839fd9475931d11e0ea507420a87b0cadbdd":"v0.0.1"}}]
    }
```

Generated with discovered.json: 0x81f5e51d9b6b83432b359f8ca79b1a48315106c1

# Diff at Wed, 15 Jan 2025 10:19:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21486361
- current block number: 21629240

## Description

PermissionedDisputeGame upgraded (1.3.0), FaultDisputeGame (1.3.0) and DelayedWETH added, all known shapes. InitBonds same as optimism for now. Permissioned game is still the respected gameType.

Two signers added to Gelato MS, now 4/10.

## Watched changes

```diff
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.1:
-        "0xa8E6a9bF1Ba2dF76C6787EAEbE2273Ae98498059"
+        "0x0A780bE3eB21117b1bBCD74cf5D7624A3a482963"
      values.gameImpls.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x6A8eFcba5642EB15D743CBB29545BdC44D5Ad8cD"
      values.initBonds.1:
-        0
+        "80000000000000000"
      values.initBonds.0:
-        0
+        "80000000000000000"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xde744491BcF6b2DD2F32146364Ea1487D75E2509","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}
      receivedPermissions.10.target:
-        "0xde744491BcF6b2DD2F32146364Ea1487D75E2509"
+        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      receivedPermissions.9.target:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.9.via.0.address:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.8.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      receivedPermissions.8.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.8.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.7.target:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      receivedPermissions.7.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.6.target:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      receivedPermissions.5.target:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      receivedPermissions.4.target:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xa8E6a9bF1Ba2dF76C6787EAEbE2273Ae98498059)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.7:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.6:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.5:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.4:
-        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
+        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.3:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.2:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.$members.1:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.0:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 10 (40%)"
    }
```

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","target":"0xde744491BcF6b2DD2F32146364Ea1487D75E2509"}
      directlyReceivedPermissions.8.target:
-        "0xde744491BcF6b2DD2F32146364Ea1487D75E2509"
+        "0xA8B389A82e088b164cD03230e900980CcED34d29"
      directlyReceivedPermissions.7.target:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      directlyReceivedPermissions.7.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.6.target:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      directlyReceivedPermissions.6.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.5.target:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      directlyReceivedPermissions.4.target:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      directlyReceivedPermissions.3.target:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50"
    }
```

```diff
    contract AnchorStateRegistry (0xde744491BcF6b2DD2F32146364Ea1487D75E2509) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      values.$pastUpgrades.2:
+        ["2025-01-13T21:22:47.000Z","0x71234ec9d3df32360383a0091277b0facbeb21456f1a29accb110fa43a6b5441",["0x7A78aa7D5dec2F8B368ca13f00Df2fA4E5De3C3F"]]
      values.$pastUpgrades.1:
+        ["2025-01-13T21:22:47.000Z","0x71234ec9d3df32360383a0091277b0facbeb21456f1a29accb110fa43a6b5441",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        1
+        3
    }
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x0A780bE3eB21117b1bBCD74cf5D7624A3a482963)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x3Beaca17eaE5643FB1479AA5f4B1fF75cc4b9B50)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x6A8eFcba5642EB15D743CBB29545BdC44D5Ad8cD)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

## Source code changes

```diff
.../DelayedWETH.sol                                |    0
 .../Proxy.p.sol                                    |    0
 .../DelayedWETH.sol                                |  651 ++++
 .../Proxy.p.sol                                    |  200 +
 .../ink/ethereum/.flat/FaultDisputeGame.sol        | 3959 ++++++++++++++++++++
 .../PermissionedDisputeGame.sol                    |  398 +-
 6 files changed, 5033 insertions(+), 175 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21486361 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x3e8e87f48a4a8d11bc5e4e8510c4d2eaf91d4657

# Diff at Wed, 08 Jan 2025 09:01:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21486361
- current block number: 21486361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21486361 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xc48944feccc2d5061ce68955d5b231aeca0e7ecf

# Diff at Thu, 26 Dec 2024 11:32:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e29d1319d91d7959f43ee6476f8bc351dd60d254 block: 21465381
- current block number: 21486361

## Description

Contracts verified (PermissionedDisputeGame, AnchorStateRegistry).

Both contracts are unintented beta versions (see ink telegram chat) but contain mostly cosmetic changes and the diff is audited, according to ink. A brief review of the diff shows no logic changes and thus the standard templates are used here.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465381 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xde744491BcF6b2DD2F32146364Ea1487D75E2509","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xA8B389A82e088b164cD03230e900980CcED34d29","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}
      receivedPermissions.8.target:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.8.via.0.address:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.7.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      receivedPermissions.7.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.7.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.6.target:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      receivedPermissions.6.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.5.target:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      receivedPermissions.4.target:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      receivedPermissions.3.target:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
    }
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      name:
-        "OptimismPortal"
+        "OptimismPortal2"
      displayName:
+        "OptimismPortal"
    }
```

```diff
    contract PermissionedDisputeGame (0xa8E6a9bF1Ba2dF76C6787EAEbE2273Ae98498059) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      unverified:
-        true
      values.absolutePrestate:
+        "0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c"
      values.anchorStateRegistry:
+        "0xde744491BcF6b2DD2F32146364Ea1487D75E2509"
      values.challenger:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.claimData:
+        []
      values.claimDataLen:
+        0
      values.createdAt:
+        0
      values.extraData:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.gameCreator:
+        "0x0000000000000000000000000000000000000000"
      values.gameData:
+        {"gameType_":1,"rootClaim_":"0x0000000000000000000000000000000000000000000000000000000000000000","extraData_":"0x0000000000000000000000000000000000000000000000000000000000000000"}
      values.gameType:
+        1
      values.getChallengerDuration:
+        []
      values.l1Head:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.l2BlockNumber:
+        0
      values.l2BlockNumberChallenged:
+        false
      values.l2BlockNumberChallenger:
+        "0x0000000000000000000000000000000000000000"
      values.l2ChainId:
+        57073
      values.proposer:
+        "0x65436ddCbc026F34118954F229f7F132b696b3B4"
      values.resolvedAt:
+        0
      values.rootClaim:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.startingBlockNumber:
+        0
      values.startingOutputRoot:
+        {"root":"0x0000000000000000000000000000000000000000000000000000000000000000","l2BlockNumber":0}
      values.startingRootHash:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.status:
+        0
      values.version:
+        "1.3.1-beta.3"
      values.weth:
+        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
      sourceHashes:
+        ["0xf2f258eb38ded9ad4f2ad678585505ab05851f008aad859af6ad97de75a276b9"]
    }
```

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","target":"0xde744491BcF6b2DD2F32146364Ea1487D75E2509"}
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","target":"0xA8B389A82e088b164cD03230e900980CcED34d29"}
      directlyReceivedPermissions.6.target:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      directlyReceivedPermissions.6.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.5.target:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      directlyReceivedPermissions.5.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.4.target:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      directlyReceivedPermissions.3.target:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      directlyReceivedPermissions.2.target:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
    }
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xde744491BcF6b2DD2F32146364Ea1487D75E2509)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

Generated with discovered.json: 0x98aefd80ba2af981075e98a9847cebf4b6491d31

# Diff at Sat, 21 Dec 2024 17:04:52 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 21452260

## Description

Initial discovery. Chain controlled by Superchain upgradability but with permissioned games.

## Initial discovery

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
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
    contract OptimismPortal (0x5d66C1782664115999C47c9fA5cd031f495D3e4F)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x661235a238B11191211fa95D4Dd9E423d521E0Be)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract AddressManager (0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xA8B389A82e088b164cD03230e900980CcED34d29)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xa8E6a9bF1Ba2dF76C6787EAEbE2273Ae98498059)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```
