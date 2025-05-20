Generated with discovered.json: 0x437d55dad42be3abef90bce989c04757766721e1

# Diff at Fri, 09 May 2025 10:09:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437734
- current block number: 22437734

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437734 (main branch discovery), not current.

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
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      receivedPermissions.0.condition:
-        "the (global) 0x95703e0982140D16f8ebA6d158FccEde42f04a4C is paused."
+        "if the (global) 0x95703e0982140D16f8ebA6d158FccEde42f04a4C is paused."
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

Generated with discovered.json: 0x4666937aa7dcf66bd825aedfe7523cf6dc1c2b36

# Diff at Thu, 08 May 2025 08:48:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22208467
- current block number: 22437734

## Description

OP stack DeputyPauser upgrade (see op mainnet for more info).

## Watched changes

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

## Source code changes

```diff
.../celo/ethereum/.flat/DeputyPauseModule.sol      | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208467 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

```diff
    contract FaultDisputeGame (0x876e8eeE292F23F163C9bCA406eDD65bEAEFBEBC) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0xb3f378b1a0837f1bbfe0384a72ffe5c57850e31e

# Diff at Tue, 29 Apr 2025 08:19:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22208467
- current block number: 22208467

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208467 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract PermissionedDisputeGame (0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x6b145Ebf66602Ec524b196426B46631259689583","via":[]},{"permission":"propose","to":"0x1204884E697efD929729B9A717Ea14496298A689","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x3C519816C5BdC0a0199147594F83feD4F5847f13) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract AddressManager (0x55093104b76FAA602F9d6c35A5FFF576bE78d753) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","description":"set and change address mappings.","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract SystemConfig (0x89E31965D844a309231B1f17759Ccaf1b7c09861) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x0cd08c7f7A96AA9635f761b49216B9eA74C5cA60","via":[]},{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
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
    contract DelayedWETH (0x9c314E8057025F2982aa4B3923Abd741A8e8DE91) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0xbcA67eE5188efc419c42C91156EcC888b20664f3","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract L1StandardBridge (0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract AnchorStateRegistry (0xa24Bf5Bc02997f63da4e2C7F802067e05a102504) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract DelayedWETH (0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract SuperchainConfigLocal (0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33) {
    +++ description: A local contract acting as source of truth for the paused status and the guardian role for the local chain.
      issuedPermissions:
-        [{"permission":"guard","to":"0x6E226fa22e5F19363d231D3FA048aaBa73CC1f47","via":[]},{"permission":"interact","to":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","description":"act as an override that pauses the SuperchainConfigLocal.","condition":"the (global) 0x95703e0982140D16f8ebA6d158FccEde42f04a4C is paused.","via":[]},{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

```diff
    contract OptimismPortal2 (0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
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
    contract DisputeGameFactory (0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}]
    }
```

Generated with discovered.json: 0xe220ed9292d8e707b6ef35912a92edaa6cfdf969

# Diff at Fri, 11 Apr 2025 13:15:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22208467
- current block number: 22208467

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208467 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
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
    contract FaultDisputeGame (0x876e8eeE292F23F163C9bCA406eDD65bEAEFBEBC) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
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

Generated with discovered.json: 0xc6bfbf9782002f1d1668cd99a53a81f4b7fc89d1

# Diff at Thu, 10 Apr 2025 14:42:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22208467
- current block number: 22208467

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208467 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xe4f4e4148ea7d08d17ba43eaf24f1693d6cc9a25

# Diff at Fri, 04 Apr 2025 09:43:57 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 22166253
- current block number: 22194735

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

```diff
    contract DisputeGameFactory (0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.permissionedGamesTotal:
-        42
+        74
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
discovery. Values are for block 22166253 (main branch discovery), not current.

```diff
    contract CeloProxyAdminOwner (0x4092A77bAF58fef0309452cEaCb09221e556E112) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"upgrade","from":"0x9c314E8057025F2982aa4B3923Abd741A8e8DE91","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}
      receivedPermissions.11.from:
-        "0x9c314E8057025F2982aa4B3923Abd741A8e8DE91"
+        "0x3C519816C5BdC0a0199147594F83feD4F5847f13"
      receivedPermissions.10.from:
-        "0x3C519816C5BdC0a0199147594F83feD4F5847f13"
+        "0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
      receivedPermissions.9.from:
-        "0xa24Bf5Bc02997f63da4e2C7F802067e05a102504"
+        "0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
      receivedPermissions.8.from:
-        "0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906"
+        "0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
      receivedPermissions.7.from:
-        "0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683"
+        "0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
      receivedPermissions.6.from:
-        "0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC"
+        "0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
      receivedPermissions.5.from:
-        "0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33"
+        "0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a"
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.via:
-        [{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]
      receivedPermissions.4.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract DelayedWETH (0x9c314E8057025F2982aa4B3923Abd741A8e8DE91) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"interact","to":"0xbcA67eE5188efc419c42C91156EcC888b20664f3","description":"can pull funds from the contract in case of emergency.","via":[]}
    }
```

```diff
    contract DelayedWETH (0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x4092A77bAF58fef0309452cEaCb09221e556E112","via":[{"address":"0x783A434532Ee94667979213af1711505E8bFE374"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.via.0:
-        {"address":"0x783A434532Ee94667979213af1711505E8bFE374"}
      issuedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract undefined (0xbcA67eE5188efc419c42C91156EcC888b20664f3) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x9c314E8057025F2982aa4B3923Abd741A8e8DE91","description":"can pull funds from the contract in case of emergency."}]
    }
```

Generated with discovered.json: 0xb772550f6323acde094961a91b201b34afcfc19d

# Diff at Mon, 31 Mar 2025 10:19:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 22131469
- current block number: 22166253

## Description

sub safe signer change.

## Watched changes

```diff
    contract Safe (0xD1C635987B6Aa287361d08C6461491Fa9df087f2) {
    +++ description: None
      values.$members.2:
+        "0xD8091Ded796FE12A4D202Ca7Ab4DA6212BadC564"
      values.$members.1:
-        "0xD8091Ded796FE12A4D202Ca7Ab4DA6212BadC564"
+        "0xc963AE163C7d1DD4d452EA8d9684c4C24655E1E8"
      values.$members.0:
-        "0xc963AE163C7d1DD4d452EA8d9684c4C24655E1E8"
+        "0x4092A77bAF58fef0309452cEaCb09221e556E112"
      values.multisigThreshold:
-        "2 of 2 (100%)"
+        "2 of 3 (67%)"
    }
```

```diff
    contract DisputeGameFactory (0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.permissionedGamesTotal:
-        4
+        42
    }
```

Generated with discovered.json: 0x6a48b27ed7f493a8bcfa78e134c2a69f80ad426b

# Diff at Thu, 27 Mar 2025 11:14:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22131469
- current block number: 22131469

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22131469 (main branch discovery), not current.

```diff
    contract AddressManager (0x55093104b76FAA602F9d6c35A5FFF576bE78d753) {
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

Generated with discovered.json: 0xae68a60ee89a55da5e8077e39e70b0cc59ac096c

# Diff at Wed, 26 Mar 2025 13:47:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22131469

## Description

Initial discovery: Standard OptiPortal2 opstack chain with new SuperchainConfig setup (local with global override).

## Initial discovery

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
    contract L1CrossDomainMessenger (0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3C519816C5BdC0a0199147594F83feD4F5847f13)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract CeloProxyAdminOwner (0x4092A77bAF58fef0309452cEaCb09221e556E112)
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
    contract AddressManager (0x55093104b76FAA602F9d6c35A5FFF576bE78d753)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x783A434532Ee94667979213af1711505E8bFE374)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x876e8eeE292F23F163C9bCA406eDD65bEAEFBEBC)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x89E31965D844a309231B1f17759Ccaf1b7c09861)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract MIPS (0x8A12E1754f729C0856E2E32D4821577f0B245bfA)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
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
    contract DelayedWETH (0x9c314E8057025F2982aa4B3923Abd741A8e8DE91)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Celo Multisig 2 (0x9Eb44Da23433b5cAA1c87e35594D15FcEb08D34d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xa24Bf5Bc02997f63da4e2C7F802067e05a102504)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract SuperchainConfigLocal (0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33)
    +++ description: A local contract acting as source of truth for the paused status and the guardian role for the local chain.
```

```diff
+   Status: CREATED
    contract Celo Multisig 1 (0xC03172263409584f7860C25B6eB4985f0f6F4636)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract Safe (0xD1C635987B6Aa287361d08C6461491Fa9df087f2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xfaB0F466955D87e596Ca87E20c505bB6470D0DC4)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```
