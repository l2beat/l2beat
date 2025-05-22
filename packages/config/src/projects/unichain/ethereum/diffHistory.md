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
