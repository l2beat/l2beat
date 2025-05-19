Generated with discovered.json: 0x3d8a2fa622047003658561b9b797a57dbac1c621

# Diff at Fri, 09 May 2025 10:09:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437744
- current block number: 22437744

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437744 (main branch discovery), not current.

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

Generated with discovered.json: 0x0dec4aa61d65e2ab15401f129e1cf45c4af7efbc

# Diff at Thu, 08 May 2025 08:50:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22244007
- current block number: 22437744

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
.../settlus/ethereum/.flat/DeputyPauseModule.sol   | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22244007 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0x753e6b21c9a2e1adc98dadcd97ca4d50aa704d9f

# Diff at Tue, 29 Apr 2025 08:19:11 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22244007
- current block number: 22244007

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22244007 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract SystemConfig (0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x57669299e2a7D5BE46Ba817d8039C1350af830e8","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xD0b4c3aC8A50B6F1B3949ADaf55Cc9805620EB57","via":[]},{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x44e9388e88Bb8edE446d62590d8A4C6d34813e98) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
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
    contract AnchorStateRegistry (0xb5150595F1E2240b76F414dc96509f5125ba5DD0) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract DelayedWETH (0xC206D300b07cB905Cb1831d8a9172d4c66394638) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract AddressManager (0xC24C700BC65a3b15De13e489e155c81F621B1856) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","description":"set and change address mappings.","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
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
    contract DisputeGameFactory (0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      issuedPermissions:
-        [{"permission":"challenge","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[]},{"permission":"propose","to":"0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310","via":[]}]
    }
```

```diff
    contract OptimismPortal2 (0xFc1D560eB01443e31B0EB56620703E80e42A7E4e) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

```diff
    contract L1StandardBridge (0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}]
    }
```

Generated with discovered.json: 0x151d144c18e05969a21fd67947e6ffd76e72857c

# Diff at Fri, 11 Apr 2025 13:16:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22244007
- current block number: 22244007

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22244007 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294) {
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

Generated with discovered.json: 0x8f258791e26a28a4fbcd34ad54d47a61bb860ccb

# Diff at Thu, 10 Apr 2025 14:43:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22208464
- current block number: 22208464

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208464 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x5e344c5a32a7e413fc28a6e647c1c291d26a8d64

# Diff at Sun, 06 Apr 2025 07:50:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 22195794
- current block number: 22208464

## Description

add proposer, challenger permission.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195794 (main branch discovery), not current.

```diff
    contract undefined (0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"propose","from":"0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"}]
    }
```

```diff
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E","via":[{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]}
      receivedPermissions.9.from:
-        "0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E"
+        "0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
      receivedPermissions.8.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.8.from:
-        "0x44e9388e88Bb8edE446d62590d8A4C6d34813e98"
+        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
      receivedPermissions.8.via:
-        [{"address":"0xd35FeF329Bb6569baa373BDa702F3dfF59D57321"}]
      receivedPermissions.8.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.7.permission:
-        "interact"
+        "challenge"
      receivedPermissions.7.from:
-        "0xC206D300b07cB905Cb1831d8a9172d4c66394638"
+        "0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294"
      receivedPermissions.7.description:
-        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      issuedPermissions:
+        [{"permission":"challenge","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[]},{"permission":"propose","to":"0x1bC6Df949b8eDC8EE61adB99d578A7a6E6Ff7310","via":[]}]
    }
```

Generated with discovered.json: 0x33ebf6e1d182b7763fb455e9a19dea092ab18dd9

# Diff at Fri, 04 Apr 2025 13:17:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 22195794

## Description

Standard OP chain.

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
    contract SystemConfig (0x15C1dAED5443A77b4DcF6FE35cAFcCEBb0c6da0E)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
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
    contract OptimismMintableERC20Factory (0x44e9388e88Bb8edE446d62590d8A4C6d34813e98)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
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
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x9BdA922e6f1bD53c24F9bCFb88B9638199A82CEb)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract Alchemy Multisig 1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xb5150595F1E2240b76F414dc96509f5125ba5DD0)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xC206D300b07cB905Cb1831d8a9172d4c66394638)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AddressManager (0xC24C700BC65a3b15De13e489e155c81F621B1856)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
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
    contract L1ERC721Bridge (0xCcfa1f8A93640488E3E1AE90A0edAf44680E9f82)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd35FeF329Bb6569baa373BDa702F3dfF59D57321)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xde9FDA9C499bA1C0168AC083acF5BEc5cC67fA76)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xf9534EBc84082dF9d35Fb1Ed8786bF8cE8a90294)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xFc1D560eB01443e31B0EB56620703E80e42A7E4e)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xFD4918e51d1e5aa2195C42654CF769b152C9d9C0)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```
