Generated with discovered.json: 0x19e39918fa719a660198c3b7635329d1bd0e19c5

# Diff at Fri, 25 Jul 2025 17:48:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dff0cc78015c4909229d9a2a9ca8fb6a3498b9d5 block: 22645524
- current block number: 22996546

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
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2) {
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
+        ["2025-07-24T18:12:11.000Z","0x1f1f283ad793a901a94e11241d46b87cd264b2e276a690b9554148ba56c57959",["eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"]]
      values.$upgradeCount:
-        3
+        4
      values.respectedGameTypeUpdatedAt:
-        1737658703
+        1753380731
      values.version:
-        "3.14.0"
+        "4.6.0"
      values.anchorStateRegistry:
+        "eth:0x27Cf508E4E3Aa8d30b3226aC3b5Ea0e8bcaCAFF9"
      values.ethLockbox:
+        "eth:0x08bA0023eD60C7Bd040716dD13C45fA0062df5C5"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      values.proxyAdminOwner:
+        "eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833"
      values.superRootsActive:
+        false
      implementationNames.eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
-        "OptimismPortal2"
      implementationNames.eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a:
+        "OptimismPortal2"
    }
```

```diff
-   Status: DELETED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
+        "0x93342e3d1e616bd6c727a5f73b09c0811bdab764dc9ad7346278593fb66b3689"
      values.$implementation:
-        "eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.$pastUpgrades.2:
+        ["2025-07-24T18:12:11.000Z","0x1f1f283ad793a901a94e11241d46b87cd264b2e276a690b9554148ba56c57959",["eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"]]
      values.$upgradeCount:
-        2
+        3
+++ severity: HIGH
      values.gameImpls.0:
-        "eth:0x57a3B42698DC1e4Fb905c9ab970154e178296991"
+        "eth:0x4F0f6B7877A174A4fd41DF80dB80DeF8883bc772"
+++ severity: HIGH
      values.gameImpls.1:
-        "eth:0x485272c0703020e1354328A1aBa3ca767997BEd3"
+        "eth:0xC56EF9c3F3e9fD6713055b4577AC4AF8303E63e1"
      values.version:
-        "1.0.1"
+        "1.2.0"
      values.initVersion:
+        1
      values.proxyAdmin:
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      values.proxyAdminOwner:
+        "eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
-        "DisputeGameFactory"
      implementationNames.eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D:
+        "DisputeGameFactory"
    }
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
    contract ProxyAdmin (0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x08bA0023eD60C7Bd040716dD13C45fA0062df5C5","role":"admin"}
      directlyReceivedPermissions.3:
+        {"permission":"upgrade","from":"eth:0x27Cf508E4E3Aa8d30b3226aC3b5Ea0e8bcaCAFF9","role":"admin"}
      directlyReceivedPermissions.4:
-        {"permission":"upgrade","from":"eth:0x84B268A4101A8c8e3CcB33004F81eD08202bA124","role":"admin"}
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xa0157F0730Dea8d1a5c358Dc1d340a05D8796C23","role":"admin"}
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0xBcEA39a1F75D7AC8004982efBA85F92A693386CB","role":"admin"}
      directlyReceivedPermissions.8:
-        {"permission":"upgrade","from":"eth:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86","role":"admin"}
      directlyReceivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f","role":"admin"}
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x485272c0703020e1354328A1aBa3ca767997BEd3)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x57a3B42698DC1e4Fb905c9ab970154e178296991)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract UnichainProxyAdminOwner (0x6d5B183F538ABB8572F5cD17109c617b994D5833) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x84B268A4101A8c8e3CcB33004F81eD08202bA124","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.2.via:
+        [{"address":"eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]
      receivedPermissions.2.role:
-        ".owner"
+        "admin"
      receivedPermissions.2.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.2.from:
-        "eth:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
+        "eth:0x08bA0023eD60C7Bd040716dD13C45fA0062df5C5"
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.3:
+        {"permission":"upgrade","from":"eth:0x27Cf508E4E3Aa8d30b3226aC3b5Ea0e8bcaCAFF9","role":"admin","via":[{"address":"eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x84B268A4101A8c8e3CcB33004F81eD08202bA124","role":"admin","via":[{"address":"eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xa0157F0730Dea8d1a5c358Dc1d340a05D8796C23","role":"admin","via":[{"address":"eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0xBcEA39a1F75D7AC8004982efBA85F92A693386CB","role":"admin","via":[{"address":"eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86","role":"admin","via":[{"address":"eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}
      receivedPermissions.12:
-        {"permission":"upgrade","from":"eth:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f","role":"admin","via":[{"address":"eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}
    }
```

```diff
    contract L1StandardBridge (0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA) {
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
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      values.proxyAdminOwner:
+        "eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833"
      values.systemConfig:
+        "eth:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
-        "L1StandardBridge"
      implementationNames.eth:0x44AfB7722AF276A601D524F429016A18B6923df0:
+        "L1StandardBridge"
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (0x84B268A4101A8c8e3CcB33004F81eD08202bA124)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
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
    contract L1CrossDomainMessenger (0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
+        "0x21cd6c80343ba49cbb9f3e96c5f4ca0bc77bc617825495fbaad1026ed9a42026"
      values.$implementation:
-        "eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B"
+        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
      values.$pastUpgrades.3:
+        ["2025-07-24T18:12:11.000Z","0x1f1f283ad793a901a94e11241d46b87cd264b2e276a690b9554148ba56c57959",["eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "2.6.0"
+        "2.9.0"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      values.proxyAdminOwner:
+        "eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833"
      values.systemConfig:
+        "eth:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54:
+        "L1CrossDomainMessenger"
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
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6) {
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
      values.$pastUpgrades.5:
+        ["2025-07-24T18:12:11.000Z","0x1f1f283ad793a901a94e11241d46b87cd264b2e276a690b9554148ba56c57959",["eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"]]
      values.$upgradeCount:
-        5
+        6
      values.DISPUTE_GAME_FACTORY_SLOT:
-        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.getAddresses.disputeGameFactory:
-        "eth:0x2F12d621a16e2d3285929C9996f478508951dFe4"
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
+        130
+++ description: `superchainConfig.paused(address(lockbox)) || superchainConfig.paused(address(0))`
+++ severity: HIGH
      values.paused:
+        false
      values.proxyAdmin:
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      values.proxyAdminOwner:
+        "eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833"
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
-   Status: DELETED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
-   Status: DELETED
    contract DelayedWETH (0xc9edb4E340f4E9683B4557bD9db8f9d932177C86)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    contract L1ERC721Bridge (0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
+        "0x8ec2646e7ca57c49fef7769f200a751b7199526d590c9c43e6c7b134f43de630"
      values.$implementation:
-        "eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
+        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
      values.$pastUpgrades.3:
+        ["2025-07-24T18:12:11.000Z","0x1f1f283ad793a901a94e11241d46b87cd264b2e276a690b9554148ba56c57959",["eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "2.4.0"
+        "2.7.0"
      values.initVersion:
+        2
      values.proxyAdmin:
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      values.proxyAdminOwner:
+        "eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833"
      values.systemConfig:
+        "eth:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
-        "L1ERC721Bridge"
      implementationNames.eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F:
+        "L1ERC721Bridge"
    }
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
-   Status: DELETED
    contract MIPS (0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract ETHLockbox (0x08bA0023eD60C7Bd040716dD13C45fA0062df5C5)
    +++ description: A simple escrow contract storing ETH for the canonical bridge.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x27Cf508E4E3Aa8d30b3226aC3b5Ea0e8bcaCAFF9)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x4F0f6B7877A174A4fd41DF80dB80DeF8883bc772)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 if set as its Safe module.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xa0157F0730Dea8d1a5c358Dc1d340a05D8796C23)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract MIPS (0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xBcEA39a1F75D7AC8004982efBA85F92A693386CB)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xC56EF9c3F3e9fD6713055b4577AC4AF8303E63e1)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
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
 .../ethereum/.flat/ETHLockbox/ETHLockbox.sol       |  757 +++++++++++++
 .../unichain/ethereum/.flat/ETHLockbox/Proxy.p.sol |  200 ++++
 .../{.flat@22645524 => .flat}/FaultDisputeGame.sol |  106 +-
 .../L1CrossDomainMessenger.sol                     |  348 +++++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  298 +++++-
 .../L1StandardBridge/L1StandardBridge.sol          |  298 +++++-
 .../ethereum/{.flat@22645524 => .flat}/MIPS.sol    |  583 +++++-----
 .../OptimismPortal2/OptimismPortal2.sol            | 1111 +++++++++++++-------
 .../PermissionedDisputeGame.sol                    |  110 +-
 .../SuperchainConfig/SuperchainConfig.sol          |  487 ++++++---
 .../SystemConfig/SystemConfig.sol                  |  398 +++++--
 19 files changed, 4962 insertions(+), 1461 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22645524 (main branch discovery), not current.

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

Generated with discovered.json: 0xd7ed22175b3bd424af92738a241d992d130383e8

# Diff at Thu, 24 Jul 2025 16:48:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22645524
- current block number: 22645524

## Description

set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22645524 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      fieldMeta.respectedGameType:
+        {"severity":"HIGH"}
    }
```

```diff
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0xebbf85e2e9d222437dafadf2f79569007f2d68fd

# Diff at Tue, 22 Jul 2025 14:12:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5d65d1883c757ae790bbd0a6f785c98310d2516 block: 22645524
- current block number: 22645524

## Description

Config: Kailua added to OptimismPortal2 and DisputeGameFectory.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22645524 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      usedTypes.0.arg.1337:
+        "KailuaGame"
    }
```

```diff
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x2044256af300fd22309d5800d3f5842a9db80642

# Diff at Mon, 14 Jul 2025 12:47:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22645524
- current block number: 22645524

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22645524 (main branch discovery), not current.

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
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      address:
-        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "eth:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      values.$admin:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
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
-        "0x2F12d621a16e2d3285929C9996f478508951dFe4"
+        "eth:0x2F12d621a16e2d3285929C9996f478508951dFe4"
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
-        "0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
+        "eth:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
      implementationNames.0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2:
-        "Proxy"
      implementationNames.0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
-        "OptimismPortal2"
      implementationNames.eth:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2:
+        "Proxy"
      implementationNames.eth:0xB443Da3e07052204A02d630a8933dAc05a0d6fB4:
+        "OptimismPortal2"
    }
```

```diff
    contract Escrow (0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A) {
    +++ description: Simple escrow that accepts tokens and allows to configure permissioned addresses that can access the tokens.
      address:
-        "0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A"
+        "eth:0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A"
      values.wards.0:
-        "0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB"
+        "eth:0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB"
      implementationNames.0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A:
-        "Escrow"
      implementationNames.eth:0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A:
+        "Escrow"
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
    EOA  (0x19b175a56C52e14944a3D37b33C0Bcb7A2091779) {
    +++ description: None
      address:
-        "0x19b175a56C52e14944a3D37b33C0Bcb7A2091779"
+        "eth:0x19b175a56C52e14944a3D37b33C0Bcb7A2091779"
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
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0x2F12d621a16e2d3285929C9996f478508951dFe4"
+        "eth:0x2F12d621a16e2d3285929C9996f478508951dFe4"
      values.$admin:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
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
-        "0x57a3B42698DC1e4Fb905c9ab970154e178296991"
+        "eth:0x57a3B42698DC1e4Fb905c9ab970154e178296991"
      values.gameImpls.1:
-        "0x485272c0703020e1354328A1aBa3ca767997BEd3"
+        "eth:0x485272c0703020e1354328A1aBa3ca767997BEd3"
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
-        "0x6d5B183F538ABB8572F5cD17109c617b994D5833"
+        "eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833"
      implementationNames.0x2F12d621a16e2d3285929C9996f478508951dFe4:
-        "Proxy"
      implementationNames.0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
-        "DisputeGameFactory"
      implementationNames.eth:0x2F12d621a16e2d3285929C9996f478508951dFe4:
+        "Proxy"
      implementationNames.eth:0x4bbA758F006Ef09402eF31724203F316ab74e4a0:
+        "DisputeGameFactory"
    }
```

```diff
    EOA  (0x2F60A5184c63ca94f82a27100643DbAbe4F3f7Fd) {
    +++ description: None
      address:
-        "0x2F60A5184c63ca94f82a27100643DbAbe4F3f7Fd"
+        "eth:0x2F60A5184c63ca94f82a27100643DbAbe4F3f7Fd"
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
    EOA  (0x31e5EDc2c4cC4AA25349339f96747B54d1624160) {
    +++ description: None
      address:
-        "0x31e5EDc2c4cC4AA25349339f96747B54d1624160"
+        "eth:0x31e5EDc2c4cC4AA25349339f96747B54d1624160"
    }
```

```diff
    EOA  (0x34154426ab842AAAeFda28F3f5d103Dd0b0FE37A) {
    +++ description: None
      address:
-        "0x34154426ab842AAAeFda28F3f5d103Dd0b0FE37A"
+        "eth:0x34154426ab842AAAeFda28F3f5d103Dd0b0FE37A"
    }
```

```diff
    EOA  (0x34d19AC0a7B195359354DB4D5E8aDa7A1f2Cb27C) {
    +++ description: None
      address:
-        "0x34d19AC0a7B195359354DB4D5E8aDa7A1f2Cb27C"
+        "eth:0x34d19AC0a7B195359354DB4D5E8aDa7A1f2Cb27C"
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
    contract ProxyAdmin (0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4) {
    +++ description: None
      address:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      values.addressManager:
-        "0x8098F676033A377b9Defe302e9fE6877cD63D575"
+        "eth:0x8098F676033A377b9Defe302e9fE6877cD63D575"
      values.owner:
-        "0x6d5B183F538ABB8572F5cD17109c617b994D5833"
+        "eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833"
      implementationNames.0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4:
-        "ProxyAdmin"
      implementationNames.eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4:
+        "ProxyAdmin"
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
    contract PermissionedDisputeGame (0x485272c0703020e1354328A1aBa3ca767997BEd3) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0x485272c0703020e1354328A1aBa3ca767997BEd3"
+        "eth:0x485272c0703020e1354328A1aBa3ca767997BEd3"
      values.anchorStateRegistry:
-        "0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
+        "eth:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
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
-        "0xD5F0E2912C70771C589CD8bB087EDE0Dab4AFA9A"
+        "eth:0xD5F0E2912C70771C589CD8bB087EDE0Dab4AFA9A"
      values.vm:
-        "0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
+        "eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1"
      values.weth:
-        "0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
+        "eth:0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
      implementationNames.0x485272c0703020e1354328A1aBa3ca767997BEd3:
-        "PermissionedDisputeGame"
      implementationNames.eth:0x485272c0703020e1354328A1aBa3ca767997BEd3:
+        "PermissionedDisputeGame"
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
    contract LivenessModule (0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2) {
    +++ description: used to remove members inactive for 70d while making sure that the threshold remains above 60%. If the number of members falls below 1, the eth:0x0000000000000000000000000000000000000000 takes ownership of the multisig
      address:
-        "0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2"
+        "eth:0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2"
      description:
-        "used to remove members inactive for 70d while making sure that the threshold remains above 60%. If the number of members falls below 1, the 0x0000000000000000000000000000000000000000 takes ownership of the multisig"
+        "used to remove members inactive for 70d while making sure that the threshold remains above 60%. If the number of members falls below 1, the eth:0x0000000000000000000000000000000000000000 takes ownership of the multisig"
      values.fallbackOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.livenessGuard:
-        "0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6"
+        "eth:0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6"
      values.safe:
-        "0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC"
+        "eth:0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC"
      implementationNames.0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2:
-        "LivenessModule"
      implementationNames.eth:0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2:
+        "LivenessModule"
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
    contract FaultDisputeGame (0x57a3B42698DC1e4Fb905c9ab970154e178296991) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      address:
-        "0x57a3B42698DC1e4Fb905c9ab970154e178296991"
+        "eth:0x57a3B42698DC1e4Fb905c9ab970154e178296991"
      values.anchorStateRegistry:
-        "0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
+        "eth:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
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
-        "0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
+        "eth:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
      implementationNames.0x57a3B42698DC1e4Fb905c9ab970154e178296991:
-        "FaultDisputeGame"
      implementationNames.eth:0x57a3B42698DC1e4Fb905c9ab970154e178296991:
+        "FaultDisputeGame"
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
    contract UnichainProxyAdminOwner (0x6d5B183F538ABB8572F5cD17109c617b994D5833) {
    +++ description: None
      address:
-        "0x6d5B183F538ABB8572F5cD17109c617b994D5833"
+        "eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC"
+        "eth:0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC"
      values.$members.1:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
+        "eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      values.$members.2:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      implementationNames.0x6d5B183F538ABB8572F5cD17109c617b994D5833:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract L1ERC20TokenBridge (0x755610f5Be536Ad7afBAa7c10F3E938Ea3aa1877) {
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
      address:
-        "0x755610f5Be536Ad7afBAa7c10F3E938Ea3aa1877"
+        "eth:0x755610f5Be536Ad7afBAa7c10F3E938Ea3aa1877"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x6078232C54d956c901620fa4590e0F7E37c2B82f"
+        "eth:0x6078232C54d956c901620fa4590e0F7E37c2B82f"
      values.$pastUpgrades.0.2.0:
-        "0x6078232C54d956c901620fa4590e0F7E37c2B82f"
+        "eth:0x6078232C54d956c901620fa4590e0F7E37c2B82f"
      values.accesscontrol.DEFAULT_ADMIN_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accesscontrol.0x4b43b36766bde12c5e9cbbc37d15f8d1f769f08f54720ab370faeb4ce893753a.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accesscontrol.0x63f736f21cb2943826cd50b191eb054ebbea670e4e962d0527611f830cd399d6.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accesscontrol.0x63f736f21cb2943826cd50b191eb054ebbea670e4e962d0527611f830cd399d6.members.1:
-        "0x73b047fe6337183A454c5217241D780a932777bD"
+        "eth:0x73b047fe6337183A454c5217241D780a932777bD"
      values.accesscontrol.0x9ab8816a3dc0b3849ec1ac00483f6ec815b07eee2fd766a353311c823ad59d0d.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accesscontrol.0x94a954c0bc99227eddbc0715a62a7e1056ed8784cd719c2303b685683908857c.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accesscontrol.0x94a954c0bc99227eddbc0715a62a7e1056ed8784cd719c2303b685683908857c.members.1:
-        "0x73b047fe6337183A454c5217241D780a932777bD"
+        "eth:0x73b047fe6337183A454c5217241D780a932777bD"
      values.ACCOUNTING_ORACLE:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.L1_TOKEN_NON_REBASABLE:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      values.L1_TOKEN_REBASABLE:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.L2_TOKEN_NON_REBASABLE:
-        "0xc02fE7317D4eb8753a02c35fe019786854A92001"
+        "eth:0xc02fE7317D4eb8753a02c35fe019786854A92001"
      values.L2_TOKEN_REBASABLE:
-        "0x81f2508AAC59757EF7425DDc9717AB5c2AA0A84F"
+        "eth:0x81f2508AAC59757EF7425DDc9717AB5c2AA0A84F"
      values.l2TokenBridge:
-        "0x1A513e9B6434a12C7bB5B9AF3B21963308DEE372"
+        "eth:0x1A513e9B6434a12C7bB5B9AF3B21963308DEE372"
      values.MESSENGER:
-        "0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
+        "eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x6078232C54d956c901620fa4590e0F7E37c2B82f"
+        "eth:0x6078232C54d956c901620fa4590e0F7E37c2B82f"
      values.WSTETH:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      implementationNames.0x755610f5Be536Ad7afBAa7c10F3E938Ea3aa1877:
-        "OssifiableProxy"
      implementationNames.0x6078232C54d956c901620fa4590e0F7E37c2B82f:
-        "L1LidoTokensBridge"
      implementationNames.eth:0x755610f5Be536Ad7afBAa7c10F3E938Ea3aa1877:
+        "OssifiableProxy"
      implementationNames.eth:0x6078232C54d956c901620fa4590e0F7E37c2B82f:
+        "L1LidoTokensBridge"
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
    EOA  (0x7D742aD88c6cE2D3dD1B4582b5180423b74cBc4c) {
    +++ description: None
      address:
-        "0x7D742aD88c6cE2D3dD1B4582b5180423b74cBc4c"
+        "eth:0x7D742aD88c6cE2D3dD1B4582b5180423b74cBc4c"
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
    EOA  (0x7f781194ACF0d3Ae519A5aB0D0597e3831d62237) {
    +++ description: None
      address:
-        "0x7f781194ACF0d3Ae519A5aB0D0597e3831d62237"
+        "eth:0x7f781194ACF0d3Ae519A5aB0D0597e3831d62237"
    }
```

```diff
    contract AddressManager (0x8098F676033A377b9Defe302e9fE6877cD63D575) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x8098F676033A377b9Defe302e9fE6877cD63D575"
+        "eth:0x8098F676033A377b9Defe302e9fE6877cD63D575"
      values.owner:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      implementationNames.0x8098F676033A377b9Defe302e9fE6877cD63D575:
-        "AddressManager"
      implementationNames.eth:0x8098F676033A377b9Defe302e9fE6877cD63D575:
+        "AddressManager"
    }
```

```diff
    contract L1StandardBridge (0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
+        "eth:0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
      values.$admin:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      values.$implementation:
-        "0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
+        "eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
+        "eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
      values.MESSENGER:
-        "0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
+        "eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA:
-        "L1ChugSplashProxy"
      implementationNames.0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
-        "L1StandardBridge"
      implementationNames.eth:0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x0b09ba359A106C9ea3b181CBc5F394570c7d2a7A:
+        "L1StandardBridge"
    }
```

```diff
    EOA  (0x833C6f278474A78658af91aE8edC926FE33a230e) {
    +++ description: None
      address:
-        "0x833C6f278474A78658af91aE8edC926FE33a230e"
+        "eth:0x833C6f278474A78658af91aE8edC926FE33a230e"
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
    contract DelayedWETH (0x84B268A4101A8c8e3CcB33004F81eD08202bA124) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
+        "eth:0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
      values.$admin:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
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
-        "0x6d5B183F538ABB8572F5cD17109c617b994D5833"
+        "eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833"
      implementationNames.0x84B268A4101A8c8e3CcB33004F81eD08202bA124:
-        "Proxy"
      implementationNames.0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
-        "DelayedWETH"
      implementationNames.eth:0x84B268A4101A8c8e3CcB33004F81eD08202bA124:
+        "Proxy"
      implementationNames.eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
+        "DelayedWETH"
    }
```

```diff
    contract Unichain Multisig 2 (0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1) {
    +++ description: None
      address:
-        "0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1"
+        "eth:0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x7D742aD88c6cE2D3dD1B4582b5180423b74cBc4c"
+        "eth:0x7D742aD88c6cE2D3dD1B4582b5180423b74cBc4c"
      values.$members.1:
-        "0x7f781194ACF0d3Ae519A5aB0D0597e3831d62237"
+        "eth:0x7f781194ACF0d3Ae519A5aB0D0597e3831d62237"
      values.$members.2:
-        "0xFA361ece9724d75B7EdF08B9A238706EAe270d3f"
+        "eth:0xFA361ece9724d75B7EdF08B9A238706EAe270d3f"
      values.$members.3:
-        "0x31e5EDc2c4cC4AA25349339f96747B54d1624160"
+        "eth:0x31e5EDc2c4cC4AA25349339f96747B54d1624160"
      values.$members.4:
-        "0x34d19AC0a7B195359354DB4D5E8aDa7A1f2Cb27C"
+        "eth:0x34d19AC0a7B195359354DB4D5E8aDa7A1f2Cb27C"
      implementationNames.0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
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
    contract LivenessGuard (0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6) {
    +++ description: None
      address:
-        "0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6"
+        "eth:0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6"
      receivedPermissions.0.description:
-        "can remove members of 0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC inactive for 70d."
+        "can remove members of eth:0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC inactive for 70d."
      values.safe:
-        "0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC"
+        "eth:0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC"
      implementationNames.0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6:
-        "LivenessGuard"
      implementationNames.eth:0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6:
+        "LivenessGuard"
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
    contract L1CrossDomainMessenger (0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
+        "eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
      values.$admin:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
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
-        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "eth:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      values.PORTAL:
-        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "eth:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      values.ResolvedDelegateProxy_addressManager:
-        "0x8098F676033A377b9Defe302e9fE6877cD63D575"
+        "eth:0x8098F676033A377b9Defe302e9fE6877cD63D575"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6:
-        "ResolvedDelegateProxy"
      implementationNames.0x5D5a095665886119693F0B41d8DFeE78da033e8B:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x5D5a095665886119693F0B41d8DFeE78da033e8B:
+        "L1CrossDomainMessenger"
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
    contract OptimismMintableERC20Factory (0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
+        "eth:0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
      values.$admin:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
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
-        "0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
+        "eth:0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
      values.BRIDGE:
-        "0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
+        "eth:0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
      implementationNames.0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad:
-        "Proxy"
      implementationNames.0x5493f4677A186f64805fe7317D6993ba4863988F:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad:
+        "Proxy"
      implementationNames.eth:0x5493f4677A186f64805fe7317D6993ba4863988F:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract Unichain Multisig 1 (0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC) {
    +++ description: None
      address:
-        "0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC"
+        "eth:0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x34154426ab842AAAeFda28F3f5d103Dd0b0FE37A"
+        "eth:0x34154426ab842AAAeFda28F3f5d103Dd0b0FE37A"
      values.$members.1:
-        "0x19b175a56C52e14944a3D37b33C0Bcb7A2091779"
+        "eth:0x19b175a56C52e14944a3D37b33C0Bcb7A2091779"
      values.$members.2:
-        "0xf89C1b6e5D65e97c69fbc792f1BcdcB56DcCde91"
+        "eth:0xf89C1b6e5D65e97c69fbc792f1BcdcB56DcCde91"
      values.$members.3:
-        "0xee1cCc7Abd01554d0bB26Cb4548954B57281697C"
+        "eth:0xee1cCc7Abd01554d0bB26Cb4548954B57281697C"
      values.$members.4:
-        "0xD930FbB04C315C90d0879FC8978BD9BDD57e8449"
+        "eth:0xD930FbB04C315C90d0879FC8978BD9BDD57e8449"
      values.GnosisSafe_modules.0:
-        "0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2"
+        "eth:0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2"
      implementationNames.0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
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
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
+        "eth:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
      values.$admin:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      values.$implementation:
-        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.0.2.0:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "eth:0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.3.2.0:
-        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
+        "eth:0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
      values.$pastUpgrades.4.2.0:
-        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
+        "eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.batcherHash:
-        "0x2F60A5184c63ca94f82a27100643DbAbe4F3f7Fd"
+        "eth:0x2F60A5184c63ca94f82a27100643DbAbe4F3f7Fd"
      values.batchInbox:
-        "0xFf00000000000000000000000000000000000130"
+        "eth:0xFf00000000000000000000000000000000000130"
      values.disputeGameFactory:
-        "0x2F12d621a16e2d3285929C9996f478508951dFe4"
+        "eth:0x2F12d621a16e2d3285929C9996f478508951dFe4"
      values.getAddresses.l1CrossDomainMessenger:
-        "0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
+        "eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
      values.getAddresses.l1ERC721Bridge:
-        "0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf"
+        "eth:0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf"
      values.getAddresses.l1StandardBridge:
-        "0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
+        "eth:0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
      values.getAddresses.disputeGameFactory:
-        "0x2F12d621a16e2d3285929C9996f478508951dFe4"
+        "eth:0x2F12d621a16e2d3285929C9996f478508951dFe4"
      values.getAddresses.optimismPortal:
-        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "eth:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      values.getAddresses.optimismMintableERC20Factory:
-        "0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
+        "eth:0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
      values.l1CrossDomainMessenger:
-        "0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
+        "eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
      values.l1ERC721Bridge:
-        "0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf"
+        "eth:0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf"
      values.l1StandardBridge:
-        "0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
+        "eth:0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
      values.optimismMintableERC20Factory:
-        "0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
+        "eth:0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
      values.optimismPortal:
-        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "eth:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      values.owner:
-        "0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1"
+        "eth:0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1"
      values.sequencerInbox:
-        "0xFf00000000000000000000000000000000000130"
+        "eth:0xFf00000000000000000000000000000000000130"
      values.unsafeBlockSigner:
-        "0x833C6f278474A78658af91aE8edC926FE33a230e"
+        "eth:0x833C6f278474A78658af91aE8edC926FE33a230e"
      implementationNames.0xc407398d063f942feBbcC6F80a156b47F3f1BDA6:
-        "Proxy"
      implementationNames.0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
-        "SystemConfig"
      implementationNames.eth:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6:
+        "Proxy"
      implementationNames.eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647:
+        "SystemConfig"
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
    contract DelayedWETH (0xc9edb4E340f4E9683B4557bD9db8f9d932177C86) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
+        "eth:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
      values.$admin:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
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
-        "0x6d5B183F538ABB8572F5cD17109c617b994D5833"
+        "eth:0x6d5B183F538ABB8572F5cD17109c617b994D5833"
      implementationNames.0xc9edb4E340f4E9683B4557bD9db8f9d932177C86:
-        "Proxy"
      implementationNames.0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
-        "DelayedWETH"
      implementationNames.eth:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86:
+        "Proxy"
      implementationNames.eth:0x5e40B9231B86984b5150507046e354dbFbeD3d9e:
+        "DelayedWETH"
    }
```

```diff
    contract L1ERC721Bridge (0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf"
+        "eth:0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf"
      values.$admin:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
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
-        "0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
+        "eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
      values.MESSENGER:
-        "0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
+        "eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf:
-        "Proxy"
      implementationNames.0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
-        "L1ERC721Bridge"
      implementationNames.eth:0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf:
+        "Proxy"
      implementationNames.eth:0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013:
+        "L1ERC721Bridge"
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
    contract AnchorStateRegistry (0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
+        "eth:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
      values.$admin:
-        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      values.$implementation:
-        "0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
+        "eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
      values.$pastUpgrades.0.2.0:
-        "0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
+        "eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2"
      values.disputeGameFactory:
-        "0x2F12d621a16e2d3285929C9996f478508951dFe4"
+        "eth:0x2F12d621a16e2d3285929C9996f478508951dFe4"
      values.portal:
-        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "eth:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f:
-        "Proxy"
      implementationNames.0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2:
-        "AnchorStateRegistry"
      implementationNames.eth:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f:
+        "Proxy"
      implementationNames.eth:0x7b465370BB7A333f99edd19599EB7Fb1c2D3F8D2:
+        "AnchorStateRegistry"
    }
```

```diff
    EOA  (0xD5F0E2912C70771C589CD8bB087EDE0Dab4AFA9A) {
    +++ description: None
      address:
-        "0xD5F0E2912C70771C589CD8bB087EDE0Dab4AFA9A"
+        "eth:0xD5F0E2912C70771C589CD8bB087EDE0Dab4AFA9A"
    }
```

```diff
    EOA  (0xD930FbB04C315C90d0879FC8978BD9BDD57e8449) {
    +++ description: None
      address:
-        "0xD930FbB04C315C90d0879FC8978BD9BDD57e8449"
+        "eth:0xD930FbB04C315C90d0879FC8978BD9BDD57e8449"
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
    EOA  (0xee1cCc7Abd01554d0bB26Cb4548954B57281697C) {
    +++ description: None
      address:
-        "0xee1cCc7Abd01554d0bB26Cb4548954B57281697C"
+        "eth:0xee1cCc7Abd01554d0bB26Cb4548954B57281697C"
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
    EOA  (0xf89C1b6e5D65e97c69fbc792f1BcdcB56DcCde91) {
    +++ description: None
      address:
-        "0xf89C1b6e5D65e97c69fbc792f1BcdcB56DcCde91"
+        "eth:0xf89C1b6e5D65e97c69fbc792f1BcdcB56DcCde91"
    }
```

```diff
    EOA  (0xFA361ece9724d75B7EdF08B9A238706EAe270d3f) {
    +++ description: None
      address:
-        "0xFA361ece9724d75B7EdF08B9A238706EAe270d3f"
+        "eth:0xFA361ece9724d75B7EdF08B9A238706EAe270d3f"
    }
```

```diff
    EOA  (0xFf00000000000000000000000000000000000130) {
    +++ description: None
      address:
-        "0xFf00000000000000000000000000000000000130"
+        "eth:0xFf00000000000000000000000000000000000130"
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
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
```

```diff
+   Status: CREATED
    contract Escrow (0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A)
    +++ description: Simple escrow that accepts tokens and allows to configure permissioned addresses that can access the tokens.
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
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x485272c0703020e1354328A1aBa3ca767997BEd3)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract LivenessModule (0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2)
    +++ description: used to remove members inactive for 70d while making sure that the threshold remains above 60%. If the number of members falls below 1, the eth:0x0000000000000000000000000000000000000000 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x57a3B42698DC1e4Fb905c9ab970154e178296991)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UnichainProxyAdminOwner (0x6d5B183F538ABB8572F5cD17109c617b994D5833)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20TokenBridge (0x755610f5Be536Ad7afBAa7c10F3E938Ea3aa1877)
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
```

```diff
+   Status: CREATED
    contract AddressManager (0x8098F676033A377b9Defe302e9fE6877cD63D575)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x84B268A4101A8c8e3CcB33004F81eD08202bA124)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract Unichain Multisig 2 (0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Unichain Multisig 1 (0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the eth:0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xc9edb4E340f4E9683B4557bD9db8f9d932177C86)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
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

Generated with discovered.json: 0x5ee9b7b5cc9cc4e003118b48673b591aa240fb1e

# Diff at Mon, 14 Jul 2025 08:02:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22645524
- current block number: 22645524

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22645524 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x77d167376165dc5d68bae2f25d1b8e1670e8673d

# Diff at Fri, 04 Jul 2025 12:19:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22645524
- current block number: 22645524

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22645524 (main branch discovery), not current.

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
    EOA  (0x2F60A5184c63ca94f82a27100643DbAbe4F3f7Fd) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
+        "eth:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
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
    contract ProxyAdmin (0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x8098F676033A377b9Defe302e9fE6877cD63D575"
+        "eth:0x8098F676033A377b9Defe302e9fE6877cD63D575"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "eth:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x2F12d621a16e2d3285929C9996f478508951dFe4"
+        "eth:0x2F12d621a16e2d3285929C9996f478508951dFe4"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
+        "eth:0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
+        "eth:0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
+        "eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
+        "eth:0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
+        "eth:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
+        "eth:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf"
+        "eth:0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf"
      directlyReceivedPermissions.10.from:
-        "ethereum:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
+        "eth:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
    }
```

```diff
    contract LivenessModule (0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2) {
    +++ description: used to remove members inactive for 70d while making sure that the threshold remains above 60%. If the number of members falls below 1, the 0x0000000000000000000000000000000000000000 takes ownership of the multisig
      directlyReceivedPermissions.0.from:
-        "ethereum:0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC"
+        "eth:0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC"
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
    contract UnichainProxyAdminOwner (0x6d5B183F538ABB8572F5cD17109c617b994D5833) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      receivedPermissions.0.from:
-        "ethereum:0x8098F676033A377b9Defe302e9fE6877cD63D575"
+        "eth:0x8098F676033A377b9Defe302e9fE6877cD63D575"
      receivedPermissions.1.from:
-        "ethereum:0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
+        "eth:0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
      receivedPermissions.2.from:
-        "ethereum:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
+        "eth:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      receivedPermissions.3.from:
-        "ethereum:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "eth:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      receivedPermissions.4.from:
-        "ethereum:0x2F12d621a16e2d3285929C9996f478508951dFe4"
+        "eth:0x2F12d621a16e2d3285929C9996f478508951dFe4"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      receivedPermissions.5.from:
-        "ethereum:0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
+        "eth:0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      receivedPermissions.6.from:
-        "ethereum:0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
+        "eth:0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      receivedPermissions.7.from:
-        "ethereum:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
+        "eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      receivedPermissions.8.from:
-        "ethereum:0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
+        "eth:0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      receivedPermissions.9.from:
-        "ethereum:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
+        "eth:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      receivedPermissions.10.from:
-        "ethereum:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
+        "eth:0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      receivedPermissions.11.from:
-        "ethereum:0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf"
+        "eth:0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
      receivedPermissions.12.from:
-        "ethereum:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
+        "eth:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
+        "eth:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
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
    contract Unichain Multisig 2 (0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
+        "eth:0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
    }
```

```diff
    contract LivenessGuard (0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2"
+        "eth:0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2"
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

Generated with discovered.json: 0xada571756f47e5d26ab9ce33fc54da7442603619

# Diff at Mon, 16 Jun 2025 08:44:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22645524
- current block number: 22645524

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22645524 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4) {
    +++ description: None
      directlyReceivedPermissions.10:
+        {"permission":"upgrade","from":"ethereum:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f","role":"admin"}
      directlyReceivedPermissions.9.from:
-        "ethereum:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
+        "ethereum:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      directlyReceivedPermissions.8.from:
-        "ethereum:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "ethereum:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
    }
```

```diff
    contract UnichainProxyAdminOwner (0x6d5B183F538ABB8572F5cD17109c617b994D5833) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"upgrade","from":"ethereum:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f","role":"admin","via":[{"address":"ethereum:0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}
      receivedPermissions.11.from:
-        "ethereum:0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
+        "ethereum:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      receivedPermissions.10.from:
-        "ethereum:0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "ethereum:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
    }
```

```diff
    contract L1CrossDomainMessenger (0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"
    }
```

Generated with discovered.json: 0xee56e4f0ef79627d39965042a7ff40a220ee6953

# Diff at Fri, 06 Jun 2025 12:27:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@53e2933f99050c9e14880373922d3232f9074832 block: 22437749
- current block number: 22645524

## Description

config: silent maker/sky escrow template added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437749 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract Escrow (0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A)
    +++ description: Simple escrow that accepts tokens and allows to configure permissioned addresses that can access the tokens.
```

Generated with discovered.json: 0x8da025e10ed1d6f97f88b374e593644d5c36e781

# Diff at Fri, 30 May 2025 07:18:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22437749
- current block number: 22437749

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437749 (main branch discovery), not current.

```diff
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x8ef3e8555cc3ecd217615c1219dfdf78f857963e

# Diff at Fri, 23 May 2025 09:41:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437749
- current block number: 22437749

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437749 (main branch discovery), not current.

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
    EOA  (0x2F60A5184c63ca94f82a27100643DbAbe4F3f7Fd) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
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
    contract ProxyAdmin (0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4) {
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
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.2.from:
-        "0x8098F676033A377b9Defe302e9fE6877cD63D575"
+        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      directlyReceivedPermissions.2.description:
-        "set and change address mappings."
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.1.from:
-        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "0x8098F676033A377b9Defe302e9fE6877cD63D575"
      directlyReceivedPermissions.1.description:
+        "set and change address mappings."
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    contract LivenessModule (0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2) {
    +++ description: used to remove members inactive for 70d while making sure that the threshold remains above 60%. If the number of members falls below 1, the 0x0000000000000000000000000000000000000000 takes ownership of the multisig
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
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
    contract UnichainProxyAdminOwner (0x6d5B183F538ABB8572F5cD17109c617b994D5833) {
    +++ description: None
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.9.from:
-        "0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
+        "0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
      receivedPermissions.9.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.9.via:
+        [{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]
      receivedPermissions.8.from:
-        "0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
+        "0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
+        "0x2F12d621a16e2d3285929C9996f478508951dFe4"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0x2F12d621a16e2d3285929C9996f478508951dFe4"
+        "0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
+        "0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
+        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.from:
-        "0x8098F676033A377b9Defe302e9fE6877cD63D575"
+        "0xc9edb4E340f4E9683B4557bD9db8f9d932177C86"
      receivedPermissions.3.description:
-        "set and change address mappings."
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.3.via:
-        [{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "0x8098F676033A377b9Defe302e9fE6877cD63D575"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.role:
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
    contract Unichain Multisig 2 (0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract LivenessGuard (0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6) {
    +++ description: None
      receivedPermissions.0.role:
+        ".livenessGuard"
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

Generated with discovered.json: 0x1f5f49e6f5d98ae2fdfc8ab06feaeee57d84cf65

# Diff at Fri, 09 May 2025 10:09:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437749
- current block number: 22437749

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437749 (main branch discovery), not current.

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

Generated with discovered.json: 0xa6836a6dcb85469a1d008f44ca48d2211524d5fb

# Diff at Thu, 08 May 2025 10:05:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22397542
- current block number: 22437749

## Description

OP stack DeputyPauser upgrade (see op mainnet for more info).

## Watched changes

```diff
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0x56ebb9eaE4f33ceaED3672446E3812D77F8a8A2c"
+        "0x57a3B42698DC1e4Fb905c9ab970154e178296991"
      values.gameImpls.3:
-        "0x67d59AC1166bA17612BE0Edf275187E38Cbf9B99"
+        "0x0000000000000000000000000000000000000000"
      values.gameImpls.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x485272c0703020e1354328A1aBa3ca767997BEd3"
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x56ebb9eaE4f33ceaED3672446E3812D77F8a8A2c)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x67d59AC1166bA17612BE0Edf275187E38Cbf9B99)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
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
    contract PermissionedDisputeGame (0x485272c0703020e1354328A1aBa3ca767997BEd3)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x57a3B42698DC1e4Fb905c9ab970154e178296991)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

## Source code changes

```diff
.../unichain/ethereum/.flat/DeputyPauseModule.sol  | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22397542 (main branch discovery), not current.

```diff
    contract FaultDisputeGame (0x56ebb9eaE4f33ceaED3672446E3812D77F8a8A2c) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

```diff
    contract PermissionedDisputeGame (0x67d59AC1166bA17612BE0Edf275187E38Cbf9B99) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0x4f7c8e61e7c39bb792d22395311f41690ae2060a

# Diff at Tue, 29 Apr 2025 08:19:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22346270
- current block number: 22346270

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22346270 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}]
    }
```

```diff
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}]
    }
```

```diff
    contract LivenessModule (0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2) {
    +++ description: used to remove members inactive for 70d while making sure that the threshold remains above 60%. If the number of members falls below 1, the 0x0000000000000000000000000000000000000000 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6","description":"can remove members of 0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC inactive for 70d.","via":[]}]
    }
```

```diff
    contract AddressManager (0x8098F676033A377b9Defe302e9fE6877cD63D575) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","description":"set and change address mappings.","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}]
    }
```

```diff
    contract L1StandardBridge (0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}]
    }
```

```diff
    contract DelayedWETH (0x84B268A4101A8c8e3CcB33004F81eD08202bA124) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}]
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
    contract OptimismMintableERC20Factory (0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}]
    }
```

```diff
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x2F60A5184c63ca94f82a27100643DbAbe4F3f7Fd","via":[]},{"permission":"upgrade","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}]
    }
```

```diff
    contract DelayedWETH (0xc9edb4E340f4E9683B4557bD9db8f9d932177C86) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}]
    }
```

```diff
    contract AnchorStateRegistry (0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}]
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"set and change address mappings.","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}]
    }
```

Generated with discovered.json: 0xa41186d2d080a0b01a69ad5aab9f6baa3dad7d0e

# Diff at Fri, 25 Apr 2025 13:15:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@652ccb636c46013db1624f1ac3562cb4dcbc059b block: 22265730
- current block number: 22346270

## Description

[Isthmus upgrade](https://vote.optimism.io/proposals/8705916809146420472067303211131851783087744913535435360574720946039078686841):
- upgraded proof system VM: MIPS (MT-Cannon MIPS64)
- operator fee (fee mechanism to improve fee config for zk proven and alt-DA systems)
- pectra readiness

## Watched changes

```diff
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      sourceHashes.1:
-        "0x67ee16b5b6c32cdcc862bea390e45017908e6945cfaa01d3ef75dc9de7c9d946"
+        "0xc483ef9e0a5ec2a0450732e743b3784de0cd3876b8fadfce14c0805a0846d26b"
      values.$implementation:
-        "0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
+        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.2:
+        ["2024-11-04T19:25:47.000Z","0x1623e586faeda506c832de15a948fd9c9d34da18c0ed5bbfc095dc1c0621f936",["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.1.2.0:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "0xB443Da3e07052204A02d630a8933dAc05a0d6fB4"
      values.$pastUpgrades.1.1:
-        "2024-11-04T19:25:47.000Z"
+        "0xc74c5e0dddfa9e2d0fd5d902fb7b1aa4cc28ba034ebed7bf3a0aa3a8b8d21b20"
      values.$pastUpgrades.1.0:
-        "0x1623e586faeda506c832de15a948fd9c9d34da18c0ed5bbfc095dc1c0621f936"
+        "2025-04-25T01:12:11.000Z"
      values.$upgradeCount:
-        2
+        3
      values.version:
-        "3.13.0"
+        "3.14.0"
    }
```

```diff
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0x5FE2BECc3dec340d3df04351DB8E728CbE4c7450"
+        "0x56ebb9eaE4f33ceaED3672446E3812D77F8a8A2c"
      values.gameImpls.3:
-        "0x0000000000000000000000000000000000000000"
+        "0x67d59AC1166bA17612BE0Edf275187E38Cbf9B99"
      values.gameImpls.0:
-        "0xd2C3C6f4A4c5AA777bD6c476AEa58439Db0dD844"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x5FE2BECc3dec340d3df04351DB8E728CbE4c7450)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract L1StandardBridge (0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA) {
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
    contract L1CrossDomainMessenger (0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0xfaa50769db48b1d2c04c06a8a0a4771b87b3c0ff20a508115bfdb2b576fdb454"
+        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
      values.$implementation:
-        "0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
+        "0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.2:
+        ["2024-11-04T19:27:35.000Z","0x9efd53c7ecef0094ea6cd3a05d346daaee4a6c71c0dc69758bcdbac26b9ca9ef",["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.1.2:
-        "0x9efd53c7ecef0094ea6cd3a05d346daaee4a6c71c0dc69758bcdbac26b9ca9ef"
+        ["0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]
      values.$pastUpgrades.1.1:
-        "2024-11-04T19:27:35.000Z"
+        "2025-04-12T19:18:59.000Z"
      values.$pastUpgrades.1.0:
-        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
+        "0x7e5e478cafbe30293645e6972a477f77dcfdc006c4cf1dd248a94e6386d04159"
      values.$pastUpgrades.0.2.0:
-        "0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"
+        "0x5D5a095665886119693F0B41d8DFeE78da033e8B"
      values.$pastUpgrades.0.1:
-        "2025-04-12T19:18:59.000Z"
+        "0xc74c5e0dddfa9e2d0fd5d902fb7b1aa4cc28ba034ebed7bf3a0aa3a8b8d21b20"
      values.$pastUpgrades.0.0:
-        "0x7e5e478cafbe30293645e6972a477f77dcfdc006c4cf1dd248a94e6386d04159"
+        "2025-04-25T01:12:11.000Z"
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
-   Status: DELETED
    contract MIPS (0xaA59A0777648BC75cd10364083e878c1cCd6112a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x6e293d82eb36a83fb5d8b06268cd4fbf46027b87eea77fcc68f78e4b010a3774"
+        "0x921de6fc906d159fdcef862d2b9559063f5e7b9b7588fa5f33153360ddf296e7"
      values.$implementation:
-        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
+        "0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"
      values.$pastUpgrades.4:
+        ["2025-03-19T15:24:11.000Z","0x191505a1bff29cc42fe5a1eb1888170c5241d552d7028d26ec3e54980980cf16",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.3.1:
-        ["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]
+        "2025-03-19T15:24:11.000Z"
      values.$pastUpgrades.3.0:
-        "2025-03-19T15:24:11.000Z"
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.2.2:
-        "0x191505a1bff29cc42fe5a1eb1888170c5241d552d7028d26ec3e54980980cf16"
+        "2024-11-04T19:25:59.000Z"
      values.$pastUpgrades.2.1:
-        "2025-03-19T15:24:11.000Z"
+        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
      values.$pastUpgrades.2.0:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xb9a9cca69cc08ba53aeb94e99695bbaec8c54a6431b258d2bca5d73a51663df9"
      values.$pastUpgrades.1.2:
-        "2024-11-04T19:25:59.000Z"
+        "0xc74c5e0dddfa9e2d0fd5d902fb7b1aa4cc28ba034ebed7bf3a0aa3a8b8d21b20"
      values.$pastUpgrades.1.1:
-        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
+        "2025-04-25T01:12:11.000Z"
      values.$pastUpgrades.1.0:
-        "0xb9a9cca69cc08ba53aeb94e99695bbaec8c54a6431b258d2bca5d73a51663df9"
+        ["0x340f923E5c7cbB2171146f64169EC9d5a9FfE647"]
      values.$upgradeCount:
-        4
+        5
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
    contract L1ERC721Bridge (0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x9de28f19e0d1200bf0afda5ab90c9d2dffa44a775e71cfe9232ee1808338996c"
+        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
      values.$implementation:
-        "0x276d3730f219f7ec22274f7263180b8452B46d47"
+        "0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"
      values.$pastUpgrades.2:
+        ["2025-04-25T01:12:11.000Z","0xc74c5e0dddfa9e2d0fd5d902fb7b1aa4cc28ba034ebed7bf3a0aa3a8b8d21b20",["0x7aE1d3BD877a4C5CA257404ce26BE93A02C98013"]]
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
    contract FaultDisputeGame (0xd2C3C6f4A4c5AA777bD6c476AEa58439Db0dD844)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x56ebb9eaE4f33ceaED3672446E3812D77F8a8A2c)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x67d59AC1166bA17612BE0Edf275187E38Cbf9B99)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
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
 .../ethereum/{.flat@22265730 => .flat}/MIPS.sol    | 1869 ++++++++++++++------
 .../OptimismPortal2/OptimismPortal2.sol            |   83 +-
 .../SystemConfig/SystemConfig.sol                  |   29 +-
 6 files changed, 1793 insertions(+), 580 deletions(-)
```

Generated with discovered.json: 0x7240f388bb677064cd8d3ec136c76f508ff38404

# Diff at Mon, 14 Apr 2025 07:27:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@51cb72b175a19516796629e400e8354f50e161ac block: 22194725
- current block number: 22265730

## Description

Upgrade to 1.4.0-unichain with known contracts. Add wstETH in canonical custom escrow.

## Watched changes

```diff
-   Status: DELETED
    contract FaultDisputeGame (0x08f0F8F4E792d21E16289dB7a80759323C446F61)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      sourceHashes.1:
-        "0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"
+        "0x67ee16b5b6c32cdcc862bea390e45017908e6945cfaa01d3ef75dc9de7c9d946"
      values.$implementation:
-        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
+        "0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"
      values.$pastUpgrades.1:
+        ["2024-11-04T19:25:47.000Z","0x1623e586faeda506c832de15a948fd9c9d34da18c0ed5bbfc095dc1c0621f936",["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.0.2:
-        ["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]
+        "2025-04-12T19:18:59.000Z"
      values.$pastUpgrades.0.1:
-        "2024-11-04T19:25:47.000Z"
+        ["0x2D7e764a0D9919e16983a46595CfA81fc34fa7Cd"]
      values.$pastUpgrades.0.0:
-        "0x1623e586faeda506c832de15a948fd9c9d34da18c0ed5bbfc095dc1c0621f936"
+        "0x7e5e478cafbe30293645e6972a477f77dcfdc006c4cf1dd248a94e6386d04159"
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "3.10.0"
+        "3.13.0"
    }
```

```diff
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x7f307d6191215a72b6c24c01b3c2fc87c84f7fb346790132e58736caa2d1dd14"
+        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
      values.$implementation:
-        "0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"
+        "0x4bbA758F006Ef09402eF31724203F316ab74e4a0"
      values.$pastUpgrades.1:
+        ["2024-11-04T19:27:47.000Z","0x742808a336fb214d362e781aae88a3f818ba00a363900e7ca1915f0996b2060a",["0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"]]
      values.$pastUpgrades.0.2:
-        "2024-11-04T19:27:47.000Z"
+        ["0x4bbA758F006Ef09402eF31724203F316ab74e4a0"]
      values.$pastUpgrades.0.1:
-        ["0xc641A33cab81C559F2bd4b21EA34C290E2440C2B"]
+        "2025-04-12T19:18:59.000Z"
      values.$pastUpgrades.0.0:
-        "0x742808a336fb214d362e781aae88a3f818ba00a363900e7ca1915f0996b2060a"
+        "0x7e5e478cafbe30293645e6972a477f77dcfdc006c4cf1dd248a94e6386d04159"
      values.$upgradeCount:
-        1
+        2
      values.gameImpls.4:
-        "0x08f0F8F4E792d21E16289dB7a80759323C446F61"
+        "0x5FE2BECc3dec340d3df04351DB8E728CbE4c7450"
      values.gameImpls.3:
-        "0xC457172937fFa9306099ec4F2317903254Bf7223"
+        "0x0000000000000000000000000000000000000000"
      values.gameImpls.0:
-        "0x0000000000000000000000000000000000000000"
+        "0xd2C3C6f4A4c5AA777bD6c476AEa58439Db0dD844"
      values.version:
-        "1.0.0"
+        "1.0.1"
    }
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0x318A642db9e24A85318B8BF18eFd5287BA38643B)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
    contract ProxyAdmin (0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4) {
    +++ description: None
      directlyReceivedPermissions.7.from:
-        "0x318A642db9e24A85318B8BF18eFd5287BA38643B"
+        "0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
    }
```

```diff
-   Status: DELETED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract UnichainProxyAdminOwner (0x6d5B183F538ABB8572F5cD17109c617b994D5833) {
    +++ description: None
      receivedPermissions.8.from:
-        "0x318A642db9e24A85318B8BF18eFd5287BA38643B"
+        "0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f"
    }
```

```diff
    contract L1StandardBridge (0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA) {
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
    contract DelayedWETH (0x84B268A4101A8c8e3CcB33004F81eD08202bA124) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0xfff6f4cca21febd4323222e2ca87ec8b78edfdeeca942468fbf331e537815484"
+        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
      values.$implementation:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.1:
+        ["2025-04-12T19:18:59.000Z","0x7e5e478cafbe30293645e6972a477f77dcfdc006c4cf1dd248a94e6386d04159",["0x5e40B9231B86984b5150507046e354dbFbeD3d9e"]]
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
    contract L1CrossDomainMessenger (0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6) {
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
+        ["2024-11-04T19:27:35.000Z","0x9efd53c7ecef0094ea6cd3a05d346daaee4a6c71c0dc69758bcdbac26b9ca9ef",["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.0.2:
-        "0x9efd53c7ecef0094ea6cd3a05d346daaee4a6c71c0dc69758bcdbac26b9ca9ef"
+        ["0x3eA6084748ED1b2A9B5D4426181F1ad8C93F6231"]
      values.$pastUpgrades.0.1:
-        "2024-11-04T19:27:35.000Z"
+        "2025-04-12T19:18:59.000Z"
      values.$pastUpgrades.0.0:
-        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
+        "0x7e5e478cafbe30293645e6972a477f77dcfdc006c4cf1dd248a94e6386d04159"
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
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
    contract OptimismMintableERC20Factory (0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"
+        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
      values.$implementation:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.1:
+        ["2024-11-04T19:26:59.000Z","0x14bd9cb3f3d081f9b569dfeccac4821a21e4fe65b0c1a1b1b80f0369cca63695",["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]
      values.$pastUpgrades.0.2:
-        "2024-11-04T19:26:59.000Z"
+        "2025-04-12T19:18:59.000Z"
      values.$pastUpgrades.0.1.0:
-        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
+        "0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.$pastUpgrades.0.0:
-        "0x14bd9cb3f3d081f9b569dfeccac4821a21e4fe65b0c1a1b1b80f0369cca63695"
+        "0x7e5e478cafbe30293645e6972a477f77dcfdc006c4cf1dd248a94e6386d04159"
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.9.0"
+        "1.10.1"
    }
```

```diff
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
+        "0x6e293d82eb36a83fb5d8b06268cd4fbf46027b87eea77fcc68f78e4b010a3774"
      values.$implementation:
-        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
+        "0x760C48C62A85045A6B69f07F4a9f22868659CbCc"
      values.$pastUpgrades.3:
+        ["2025-03-19T15:24:11.000Z","0x191505a1bff29cc42fe5a1eb1888170c5241d552d7028d26ec3e54980980cf16",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.2.1:
-        ["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]
+        "2025-03-19T15:24:11.000Z"
      values.$pastUpgrades.2.0:
-        "2025-03-19T15:24:11.000Z"
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.2:
-        "0x191505a1bff29cc42fe5a1eb1888170c5241d552d7028d26ec3e54980980cf16"
+        "2024-11-04T19:25:59.000Z"
      values.$pastUpgrades.1.1:
-        "2025-03-19T15:24:11.000Z"
+        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
      values.$pastUpgrades.1.0:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xb9a9cca69cc08ba53aeb94e99695bbaec8c54a6431b258d2bca5d73a51663df9"
      values.$pastUpgrades.0.2:
-        "2024-11-04T19:25:59.000Z"
+        "2025-04-12T19:18:59.000Z"
      values.$pastUpgrades.0.1:
-        ["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]
+        "0x7e5e478cafbe30293645e6972a477f77dcfdc006c4cf1dd248a94e6386d04159"
      values.$pastUpgrades.0.0:
-        "0xb9a9cca69cc08ba53aeb94e99695bbaec8c54a6431b258d2bca5d73a51663df9"
+        ["0x760C48C62A85045A6B69f07F4a9f22868659CbCc"]
      values.$upgradeCount:
-        3
+        4
      values.gasPayingToken:
-        {"addr_":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
-        "Ether"
      values.gasPayingTokenSymbol:
-        "ETH"
      values.isCustomGasToken:
-        false
      values.version:
-        "2.3.0"
+        "2.4.0"
      values.getAddresses:
+        {"l1CrossDomainMessenger":"0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6","l1ERC721Bridge":"0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf","l1StandardBridge":"0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA","disputeGameFactory":"0x2F12d621a16e2d3285929C9996f478508951dFe4","optimismPortal":"0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2","optimismMintableERC20Factory":"0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"}
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xC457172937fFa9306099ec4F2317903254Bf7223)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract DelayedWETH (0xc9edb4E340f4E9683B4557bD9db8f9d932177C86) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0xfff6f4cca21febd4323222e2ca87ec8b78edfdeeca942468fbf331e537815484"
+        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
      values.$implementation:
-        "0x71e966Ae981d1ce531a7b6d23DC0f27B38409087"
+        "0x5e40B9231B86984b5150507046e354dbFbeD3d9e"
      values.$pastUpgrades.1:
+        ["2025-04-12T19:18:59.000Z","0x7e5e478cafbe30293645e6972a477f77dcfdc006c4cf1dd248a94e6386d04159",["0x5e40B9231B86984b5150507046e354dbFbeD3d9e"]]
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
    contract L1ERC721Bridge (0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"
+        "0x9de28f19e0d1200bf0afda5ab90c9d2dffa44a775e71cfe9232ee1808338996c"
      values.$implementation:
-        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
+        "0x276d3730f219f7ec22274f7263180b8452B46d47"
      values.$pastUpgrades.1:
+        ["2024-11-04T19:26:47.000Z","0xb432a9b2f5b368a884c3a0d0708bf6949d38d8102b35bba9fa4d21c12865e601",["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$pastUpgrades.0.2:
-        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
+        "2025-04-12T19:18:59.000Z"
      values.$pastUpgrades.0.1:
-        "2024-11-04T19:26:47.000Z"
+        ["0x276d3730f219f7ec22274f7263180b8452B46d47"]
      values.$pastUpgrades.0.0:
-        "0xb432a9b2f5b368a884c3a0d0708bf6949d38d8102b35bba9fa4d21c12865e601"
+        "0x7e5e478cafbe30293645e6972a477f77dcfdc006c4cf1dd248a94e6386d04159"
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "2.1.0"
+        "2.3.1"
    }
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x5FE2BECc3dec340d3df04351DB8E728CbE4c7450)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract MIPS (0xaA59A0777648BC75cd10364083e878c1cCd6112a)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xd2C3C6f4A4c5AA777bD6c476AEa58439Db0dD844)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xD5D0e176be44E61eaB3Cf1FA8153758dF603376f)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  292 ++--
 .../DelayedWETH.sol                                |  231 ++--
 .../DelayedWETH.sol                                |  231 ++--
 .../DisputeGameFactory/DisputeGameFactory.sol      |  240 ++--
 .../{.flat@22194725 => .flat}/FaultDisputeGame.sol |  230 +++-
 .../L1CrossDomainMessenger.sol                     |  400 ++++--
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  413 +++---
 .../L1StandardBridge/L1StandardBridge.sol          |  503 ++++---
 .../ethereum/{.flat@22194725 => .flat}/MIPS.sol    |   75 +-
 .../OptimismMintableERC20Factory.sol               |   30 +-
 .../OptimismPortal2/OptimismPortal2.sol            |  439 ++++--
 .../PermissionedDisputeGame.sol                    |  267 ++--
 .../{.flat@22194725 => .flat}/PreimageOracle.sol   |  216 ++-
 .../SystemConfig/SystemConfig.sol                  | 1414 +-------------------
 14 files changed, 2161 insertions(+), 2820 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194725 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract L1ERC20TokenBridge (0x755610f5Be536Ad7afBAa7c10F3E938Ea3aa1877)
    +++ description: Lido custom escrow for wstETH tokens that uses the canonical bridge for messaging but is governed externally.
```

Generated with discovered.json: 0xbd02f046b4b26471f09f2436c6c2b03d9592ca1b

# Diff at Fri, 11 Apr 2025 13:16:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22194725
- current block number: 22194725

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194725 (main branch discovery), not current.

```diff
    contract FaultDisputeGame (0x08f0F8F4E792d21E16289dB7a80759323C446F61) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
-        "0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37"
+        "v1.4.0-unichain"
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
    contract PermissionedDisputeGame (0xC457172937fFa9306099ec4F2317903254Bf7223) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
-        "0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37"
+        "v1.4.0-unichain"
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

Generated with discovered.json: 0x53981a874d9de38e9ed9d203b9add84d3ad14d39

# Diff at Thu, 10 Apr 2025 14:43:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22194725
- current block number: 22194725

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194725 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x8e452018edfcbaf850a42fd13a7726badf628f91

# Diff at Fri, 04 Apr 2025 09:41:45 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 22094650
- current block number: 22194725

## Description

Discovery rerun on the same block number with only config-related changes.

## Watched changes

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

## Source code changes

```diff
.../SuperchainConfig/SuperchainConfig.sol                         | 8 ++++----
 1 file changed, 4 insertions(+), 4 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22094650 (main branch discovery), not current.

```diff
    contract UnichainProxyAdminOwner (0x6d5B183F538ABB8572F5cD17109c617b994D5833) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0xc9edb4E340f4E9683B4557bD9db8f9d932177C86","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}
      receivedPermissions.9.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.9.via:
-        [{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]
      receivedPermissions.9.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.8.from:
-        "0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf"
+        "0x318A642db9e24A85318B8BF18eFd5287BA38643B"
      receivedPermissions.7.from:
-        "0x318A642db9e24A85318B8BF18eFd5287BA38643B"
+        "0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
      receivedPermissions.6.from:
-        "0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
+        "0x2F12d621a16e2d3285929C9996f478508951dFe4"
      receivedPermissions.5.from:
-        "0x2F12d621a16e2d3285929C9996f478508951dFe4"
+        "0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
      receivedPermissions.4.from:
-        "0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad"
+        "0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0xc407398d063f942feBbcC6F80a156b47F3f1BDA6"
+        "0x8098F676033A377b9Defe302e9fE6877cD63D575"
      receivedPermissions.3.description:
+        "set and change address mappings."
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.from:
-        "0x8098F676033A377b9Defe302e9fE6877cD63D575"
+        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
      receivedPermissions.2.description:
-        "set and change address mappings."
      receivedPermissions.1.from:
-        "0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2"
+        "0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
      receivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
+        "0x84B268A4101A8c8e3CcB33004F81eD08202bA124"
      receivedPermissions.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.0.via:
-        [{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]
    }
```

```diff
    contract DelayedWETH (0x84B268A4101A8c8e3CcB33004F81eD08202bA124) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.via.0:
-        {"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}
      issuedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract DelayedWETH (0xc9edb4E340f4E9683B4557bD9db8f9d932177C86) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x6d5B183F538ABB8572F5cD17109c617b994D5833","via":[{"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.via.0:
-        {"address":"0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4"}
      issuedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

Generated with discovered.json: 0x2b8bf21711db8736b48374830440e67490f9cb37

# Diff at Thu, 27 Mar 2025 11:15:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22094650
- current block number: 22094650

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22094650 (main branch discovery), not current.

```diff
    contract AddressManager (0x8098F676033A377b9Defe302e9fE6877cD63D575) {
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

Generated with discovered.json: 0xe70a97c70083e06ff7f3c6f8bb383740134df3d0

# Diff at Fri, 21 Mar 2025 10:29:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4eed3e556a58bb9ab448d141c0407f67ca3ce31 block: 21914468
- current block number: 22094650

## Description

Standard SystemConfig upgrade to v2.3.0.

## Watched changes

```diff
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xbbb92920a096eced30e3ce67bbc443f134b217e8847433fbb192ecb9fdddcbc2"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.2:
+        ["2025-03-19T15:24:11.000Z","0x191505a1bff29cc42fe5a1eb1888170c5241d552d7028d26ec3e54980980cf16",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.1:
+        ["2025-03-19T15:24:11.000Z","0x191505a1bff29cc42fe5a1eb1888170c5241d552d7028d26ec3e54980980cf16",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        1
+        3
      values.version:
-        "2.2.0"
+        "2.3.0"
      values.basefeeScalar:
+        2000
      values.blobbasefeeScalar:
+        900000
      values.eip1559Denominator:
+        0
      values.eip1559Elasticity:
+        0
      values.gasPayingToken:
+        {"addr_":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
+        "Ether"
      values.gasPayingTokenSymbol:
+        "ETH"
      values.isCustomGasToken:
+        false
    }
```

## Source code changes

```diff
.../SystemConfig/SystemConfig.sol                  | 1458 +++++++++++++++++++-
 1 file changed, 1436 insertions(+), 22 deletions(-)
```

Generated with discovered.json: 0x123ab15434128d1801a40269e9b4f24048ab21ad

# Diff at Tue, 18 Mar 2025 08:14:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21914468
- current block number: 21914468

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21914468 (main branch discovery), not current.

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      name:
-        "SuperchainGuardianMultisig"
+        "Optimism Guardian Multisig"
    }
```

```diff
    contract Unichain Multisig 2 (0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1) {
    +++ description: None
      name:
-        "UnichainMultisig2"
+        "Unichain Multisig 2"
    }
```

```diff
    contract Unichain Multisig 1 (0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC) {
    +++ description: None
      name:
-        "UnichainMultisig1"
+        "Unichain Multisig 1"
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

Generated with discovered.json: 0x920a17a2cdbd601ca0349b2ece5a8593321e8559

# Diff at Tue, 04 Mar 2025 11:26:47 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21914468
- current block number: 21914468

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21914468 (main branch discovery), not current.

```diff
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xf39fd9182854aacec64f7782e25aaad9e4a3b3d8

# Diff at Tue, 04 Mar 2025 10:40:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21914468
- current block number: 21914468

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21914468 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sinceBlock:
+        19989094
    }
```

```diff
    contract FaultDisputeGame (0x08f0F8F4E792d21E16289dB7a80759323C446F61) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      sinceBlock:
+        21431687
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
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      sinceBlock:
+        21116350
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
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sinceBlock:
+        21116356
    }
```

```diff
    contract AnchorStateRegistry (0x318A642db9e24A85318B8BF18eFd5287BA38643B) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sinceBlock:
+        21116359
    }
```

```diff
    contract ProxyAdmin (0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4) {
    +++ description: None
      sinceBlock:
+        21116348
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
    contract LivenessModule (0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2) {
    +++ description: used to remove members inactive for 70d while making sure that the threshold remains above 60%. If the number of members falls below 1, the 0x0000000000000000000000000000000000000000 takes ownership of the multisig
      sinceBlock:
+        21066053
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
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sinceBlock:
+        21379266
    }
```

```diff
    contract UnichainProxyAdminOwner (0x6d5B183F538ABB8572F5cD17109c617b994D5833) {
    +++ description: None
      sinceBlock:
+        21066196
    }
```

```diff
    contract AddressManager (0x8098F676033A377b9Defe302e9fE6877cD63D575) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21116347
    }
```

```diff
    contract L1StandardBridge (0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21116352
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
    contract DelayedWETH (0x84B268A4101A8c8e3CcB33004F81eD08202bA124) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21582222
    }
```

```diff
    contract UnichainMultisig2 (0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1) {
    +++ description: None
      sinceBlock:
+        21066179
    }
```

```diff
    contract LivenessGuard (0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6) {
    +++ description: None
      sinceBlock:
+        21066049
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
    contract L1CrossDomainMessenger (0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21116353
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
    contract OptimismMintableERC20Factory (0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21116354
    }
```

```diff
    contract UnichainMultisig1 (0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC) {
    +++ description: None
      sinceBlock:
+        21031795
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
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21116351
    }
```

```diff
    contract PermissionedDisputeGame (0xC457172937fFa9306099ec4F2317903254Bf7223) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sinceBlock:
+        21582225
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
    contract DelayedWETH (0xc9edb4E340f4E9683B4557bD9db8f9d932177C86) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21431684
    }
```

```diff
    contract L1ERC721Bridge (0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21116355
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        12686687
    }
```

Generated with discovered.json: 0xbb09ace3bb73ce4409deab3c0816e853b699adfb

# Diff at Thu, 27 Feb 2025 12:01:48 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21914468
- current block number: 21914468

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21914468 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2) {
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

Generated with discovered.json: 0x9affe905223db3c288adccaa2a984c4ba5054436

# Diff at Wed, 26 Feb 2025 10:33:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21914468
- current block number: 21914468

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21914468 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA) {
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

```diff
    contract L1CrossDomainMessenger (0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x91dd23761717046ed77f900ea19295be138b88f7

# Diff at Fri, 21 Feb 2025 09:00:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21829876
- current block number: 21829876

## Description

Config related: Add categories.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829876 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA) {
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

```diff
    contract L1CrossDomainMessenger (0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x13a9c7132e3622e147f5b1b3d87f91bc09d449a1

# Diff at Wed, 12 Feb 2025 10:41:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21822773
- current block number: 21829876

## Description

Optimism SecurityCouncil rotates signers.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21822773 (main branch discovery), not current.

```diff
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x385f219f293c07c3cfae8b5971cfdb58e5cae6c3

# Diff at Tue, 11 Feb 2025 10:58:49 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 21822773

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x08f0F8F4E792d21E16289dB7a80759323C446F61)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x2F12d621a16e2d3285929C9996f478508951dFe4)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x318A642db9e24A85318B8BF18eFd5287BA38643B)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3B73Fa8d82f511A3caE17B5a26E4E1a2d5E2f2A4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LivenessModule (0x4B4F1aF8d43C8c140D2355Fea663fC9f762067C2)
    +++ description: used to remove members inactive for 70d while making sure that the threshold remains above 60%. If the number of members falls below 1, the 0x0000000000000000000000000000000000000000 takes ownership of the multisig
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
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract UnichainProxyAdminOwner (0x6d5B183F538ABB8572F5cD17109c617b994D5833)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x8098F676033A377b9Defe302e9fE6877cD63D575)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x84B268A4101A8c8e3CcB33004F81eD08202bA124)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract UnichainMultisig2 (0x9245d5D10AA8a842B31530De71EA86c0760Ca1b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x9343c452dec3251fe99D9Fd29b74c5b9CD1751a6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
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
    contract OptimismMintableERC20Factory (0xA2B597EaeAcb6F627e088cbEaD319e934ED5edad)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract UnichainMultisig1 (0xb0c4C487C5cf6d67807Bc2008c66fa7e2cE744EC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xc407398d063f942feBbcC6F80a156b47F3f1BDA6)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xC457172937fFa9306099ec4F2317903254Bf7223)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xc9edb4E340f4E9683B4557bD9db8f9d932177C86)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xD04D0D87E0bd4D2E50286760a3EF323FeA6849Cf)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```
