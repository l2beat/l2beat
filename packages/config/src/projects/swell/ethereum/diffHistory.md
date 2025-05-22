Generated with discovered.json: 0x7afbf0720e1bda2660495a8445c1046371384cbd

# Diff at Fri, 16 May 2025 12:41:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9912083f7b773804513e08ee765f8ba71a92980b block: 22437748
- current block number: 22495698

## Description

Upgrade to latest OPFP (known contracts).

## Watched changes

```diff
-   Status: DELETED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract ProxyAdmin (0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603"}
      directlyReceivedPermissions.8.from:
-        "0x89c98736A806176Fe85283c1cB727ffBdeaf37A9"
+        "0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e"
      directlyReceivedPermissions.7.from:
-        "0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603"
+        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
      directlyReceivedPermissions.6.from:
-        "0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e"
+        "0x87690676786cDc8cCA75A472e483AF7C8F2f0F57"
      directlyReceivedPermissions.5.from:
-        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
+        "0x758E0EE66102816F5C3Ec9ECc1188860fbb87812"
      directlyReceivedPermissions.4.from:
-        "0x87690676786cDc8cCA75A472e483AF7C8F2f0F57"
+        "0x8834ec1f82db740E74277b9fa1b3781E0FAb80d4"
      directlyReceivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.3.from:
-        "0x758E0EE66102816F5C3Ec9ECc1188860fbb87812"
+        "0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A"
      directlyReceivedPermissions.3.description:
+        "set and change address mappings."
      directlyReceivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.2.from:
-        "0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A"
+        "0x14387438EE964e826A4EAeB95B2BCe7754174dD1"
      directlyReceivedPermissions.2.description:
-        "set and change address mappings."
      directlyReceivedPermissions.1.from:
-        "0x14387438EE964e826A4EAeB95B2BCe7754174dD1"
+        "0xB8e81B42E0d4b9e9C2078cEd184892D5bC92F19D"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","from":"0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}
      receivedPermissions.11.from:
-        "0x89c98736A806176Fe85283c1cB727ffBdeaf37A9"
+        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
      receivedPermissions.10.from:
-        "0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603"
+        "0x87690676786cDc8cCA75A472e483AF7C8F2f0F57"
      receivedPermissions.9.from:
-        "0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e"
+        "0x758E0EE66102816F5C3Ec9ECc1188860fbb87812"
      receivedPermissions.8.from:
-        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
+        "0x8834ec1f82db740E74277b9fa1b3781E0FAb80d4"
      receivedPermissions.7.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.7.from:
-        "0x87690676786cDc8cCA75A472e483AF7C8F2f0F57"
+        "0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A"
      receivedPermissions.7.description:
+        "set and change address mappings."
      receivedPermissions.6.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.6.from:
-        "0x89c98736A806176Fe85283c1cB727ffBdeaf37A9"
+        "0x14387438EE964e826A4EAeB95B2BCe7754174dD1"
      receivedPermissions.6.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.6.via:
+        [{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x758E0EE66102816F5C3Ec9ECc1188860fbb87812"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.5.via.0.address:
-        "0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.5.description:
+        "set and change address mappings."
      receivedPermissions.4.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.4.from:
-        "0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A"
+        "0xB8e81B42E0d4b9e9C2078cEd184892D5bC92F19D"
      receivedPermissions.4.description:
-        "set and change address mappings."
      receivedPermissions.3.from:
-        "0x14387438EE964e826A4EAeB95B2BCe7754174dD1"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.3.via.0.address:
-        "0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.2.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x8834ec1f82db740E74277b9fa1b3781E0FAb80d4"
      receivedPermissions.2.description:
-        "set and change address mappings."
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.2.via:
-        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      receivedPermissions.1.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x7aA4960908B13D104bf056B23E2C76B43c5AACc8"
      receivedPermissions.1.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"
      receivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x7aA4960908B13D104bf056B23E2C76B43c5AACc8"
+        "0xB8e81B42E0d4b9e9C2078cEd184892D5bC92F19D"
      receivedPermissions.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.0.via:
-        [{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]
    }
```

```diff
    contract DisputeGameFactory (0x87690676786cDc8cCA75A472e483AF7C8F2f0F57) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0x0000000000000000000000000000000000000000"
+        "0x2DabFf87A9a634f6c769b983aFBbF4D856aDD0bF"
      values.gameImpls.3:
-        "0x0000000000000000000000000000000000000000"
+        "0x1380Cc0E11Bfe6b5b399D97995a6B3D158Ed61a6"
      values.gameImpls.0:
-        "0xa0cFbe3402d6E0a74e96D3C360F74D5ea4Fa6893"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (0x89c98736A806176Fe85283c1cB727ffBdeaf37A9)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xa0cFbe3402d6E0a74e96D3C360F74D5ea4Fa6893)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x1380Cc0E11Bfe6b5b399D97995a6B3D158Ed61a6)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x2DabFf87A9a634f6c769b983aFBbF4D856aDD0bF)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x8834ec1f82db740E74277b9fa1b3781E0FAb80d4)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xB8e81B42E0d4b9e9C2078cEd184892D5bC92F19D)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

## Source code changes

```diff
.../DelayedWETH.sol                                |    0
 .../Proxy.p.sol                                    |    0
 .../DelayedWETH.sol                                |  651 ++++
 .../Proxy.p.sol                                    |  200 +
 .../swell/ethereum/.flat/FaultDisputeGame.sol      | 3921 ++++++++++++++++++++
 .../ethereum/{.flat@22437748 => .flat}/MIPS.sol    |  444 ++-
 .../PermissionedDisputeGame.sol                    |   14 +-
 7 files changed, 5106 insertions(+), 124 deletions(-)
```

Generated with discovered.json: 0x785b99930ef9d2f8d8fb7f0fdc51207b715967f4

# Diff at Fri, 09 May 2025 10:09:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437748
- current block number: 22437748

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437748 (main branch discovery), not current.

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

Generated with discovered.json: 0x2b0bcd57d258446eedc5c3bc097312dae802efe5

# Diff at Thu, 08 May 2025 08:51:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22208481
- current block number: 22437748

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
.../swell/ethereum/.flat/DeputyPauseModule.sol     | 1338 ++++++++++++++++++++
 1 file changed, 1338 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208481 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0xa0cFbe3402d6E0a74e96D3C360F74D5ea4Fa6893) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0x877118d0982cf79f067b13a19a98b621394f5fea

# Diff at Tue, 29 Apr 2025 08:19:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22208481
- current block number: 22208481

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208481 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions:
-        [{"permission":"interact","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract AnchorStateRegistry (0x14387438EE964e826A4EAeB95B2BCe7754174dD1) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}]
    }
```

```diff
    contract OptimismPortal2 (0x758E0EE66102816F5C3Ec9ECc1188860fbb87812) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}]
    }
```

```diff
    contract L1StandardBridge (0x7aA4960908B13D104bf056B23E2C76B43c5AACc8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}]
    }
```

```diff
    contract DisputeGameFactory (0x87690676786cDc8cCA75A472e483AF7C8F2f0F57) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}]
    }
```

```diff
    contract DelayedWETH (0x89c98736A806176Fe85283c1cB727ffBdeaf37A9) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}]
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
    contract AddressManager (0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","description":"set and change address mappings.","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}]
    }
```

```diff
    contract SystemConfig (0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x06F7fB1C74147e34Fce04a6828c7BF809B038d0E","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xeb18EA5dEDeE42e7af378991DFEb719D21c17b4C","via":[]},{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}]
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
    contract L1ERC721Bridge (0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}]
    }
```

Generated with discovered.json: 0xc3e5d89eebd1a1cbf2be0219cf896aabe53b9508

# Diff at Fri, 11 Apr 2025 13:16:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22208481
- current block number: 22208481

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208481 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0xa0cFbe3402d6E0a74e96D3C360F74D5ea4Fa6893) {
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

Generated with discovered.json: 0x7c9043ccfee53091ac8419e0d0ecf00d4e2e1b86

# Diff at Thu, 10 Apr 2025 14:43:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22208481
- current block number: 22208481

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208481 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xd0ee1a0ac8905a59f0eeeb61ec138a08361769d1

# Diff at Sun, 06 Apr 2025 07:49:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 22194722
- current block number: 22208481

## Description

Operators change, no change to implementations.

## Watched changes

```diff
    contract SystemConfig (0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.to:
-        "0xf854cd5B26bfd73d51236c0122798907Ed65B1f2"
+        "0xeb18EA5dEDeE42e7af378991DFEb719D21c17b4C"
      values.batcherHash:
-        "0xf854cd5B26bfd73d51236c0122798907Ed65B1f2"
+        "0xeb18EA5dEDeE42e7af378991DFEb719D21c17b4C"
      values.unsafeBlockSigner:
-        "0x6967D304E9b7E26b5eb3f5A1FD1239DaAD3215E6"
+        "0xc28bAd2A2D3E915d132795D2963D0e0459664D68"
    }
```

Generated with discovered.json: 0x29198a2522b9aa887bd1eff7d9df1324cd5236ad

# Diff at Fri, 04 Apr 2025 09:41:04 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 21829674
- current block number: 22194722

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
discovery. Values are for block 21829674 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0x89c98736A806176Fe85283c1cB727ffBdeaf37A9","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}
      receivedPermissions.10.from:
-        "0x89c98736A806176Fe85283c1cB727ffBdeaf37A9"
+        "0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603"
      receivedPermissions.9.from:
-        "0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603"
+        "0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e"
      receivedPermissions.8.from:
-        "0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e"
+        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
      receivedPermissions.7.from:
-        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
+        "0x87690676786cDc8cCA75A472e483AF7C8F2f0F57"
      receivedPermissions.6.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.6.from:
-        "0x87690676786cDc8cCA75A472e483AF7C8F2f0F57"
+        "0x89c98736A806176Fe85283c1cB727ffBdeaf37A9"
      receivedPermissions.6.via:
-        [{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]
      receivedPermissions.6.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract DelayedWETH (0x89c98736A806176Fe85283c1cB727ffBdeaf37A9) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.via.0:
-        {"address":"0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"}
      issuedPermissions.0.description:
+        "can pull funds from the contract in case of emergency."
    }
```

Generated with discovered.json: 0xe1ad481fffa8bc8946418ea3935a4046a980dc69

# Diff at Thu, 27 Mar 2025 11:15:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21829674
- current block number: 21829674

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829674 (main branch discovery), not current.

```diff
    contract AddressManager (0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A) {
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

Generated with discovered.json: 0x898b533a3763f3015e7568e7aa5df8560f71a7f8

# Diff at Tue, 18 Mar 2025 08:14:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21829674
- current block number: 21829674

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829674 (main branch discovery), not current.

```diff
    contract Swell Multisig (0x06F7fB1C74147e34Fce04a6828c7BF809B038d0E) {
    +++ description: None
      name:
-        "SwellChainMultisig"
+        "Swell Multisig"
    }
```

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      name:
-        "SuperchainGuardianMultisig"
+        "Optimism Guardian Multisig"
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

Generated with discovered.json: 0x2521a57fa6552ce484c550bc9fad22aa9c4a79ee

# Diff at Tue, 04 Mar 2025 11:26:39 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21829674
- current block number: 21829674

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829674 (main branch discovery), not current.

```diff
    contract SystemConfig (0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x7ce27ee25ba73fed6480fe93c34967bc27c373d6

# Diff at Tue, 04 Mar 2025 10:40:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21829674
- current block number: 21829674

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829674 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sinceBlock:
+        19989094
    }
```

```diff
    contract SwellChainMultisig (0x06F7fB1C74147e34Fce04a6828c7BF809B038d0E) {
    +++ description: None
      sinceBlock:
+        21261870
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
    contract AnchorStateRegistry (0x14387438EE964e826A4EAeB95B2BCe7754174dD1) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sinceBlock:
+        21277945
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
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      sinceBlock:
+        16780617
    }
```

```diff
    contract ProxyAdmin (0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6) {
    +++ description: None
      sinceBlock:
+        21277945
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
    contract OptimismPortal2 (0x758E0EE66102816F5C3Ec9ECc1188860fbb87812) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sinceBlock:
+        21277945
    }
```

```diff
    contract L1StandardBridge (0x7aA4960908B13D104bf056B23E2C76B43c5AACc8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21277945
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
    contract DisputeGameFactory (0x87690676786cDc8cCA75A472e483AF7C8F2f0F57) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sinceBlock:
+        21277945
    }
```

```diff
    contract DelayedWETH (0x89c98736A806176Fe85283c1cB727ffBdeaf37A9) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21277945
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
    contract PermissionedDisputeGame (0xa0cFbe3402d6E0a74e96D3C360F74D5ea4Fa6893) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sinceBlock:
+        21277945
    }
```

```diff
    contract AddressManager (0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21277945
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
    contract OptimismMintableERC20Factory (0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21277945
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
    contract SystemConfig (0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21277945
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
    contract L1CrossDomainMessenger (0xe6a99Ef12995DeFC5ff47EC0e13252f0E6903759) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21277945
    }
```

```diff
    contract L1ERC20TokenBridge (0xecf3376512EDAcA4FBB63d2c67d12a0397d24121) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      sinceBlock:
+        21394394
    }
```

```diff
    contract L1ERC721Bridge (0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21277945
    }
```

Generated with discovered.json: 0x0cac712bb132fe7f9612dae65fca2a70bd2c217d

# Diff at Thu, 27 Feb 2025 12:01:48 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21829674
- current block number: 21829674

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829674 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0x758E0EE66102816F5C3Ec9ECc1188860fbb87812) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
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

Generated with discovered.json: 0x3cf82da06833cd249f21537732837ca6291bc907

# Diff at Wed, 26 Feb 2025 10:33:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21829674
- current block number: 21829674

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829674 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0x758E0EE66102816F5C3Ec9ECc1188860fbb87812) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x7aA4960908B13D104bf056B23E2C76B43c5AACc8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract DisputeGameFactory (0x87690676786cDc8cCA75A472e483AF7C8F2f0F57) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category:
+        {"name":"Local Infrastructure","priority":5}
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
    contract SystemConfig (0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0xe6a99Ef12995DeFC5ff47EC0e13252f0E6903759) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xd5b0244e22af63a93c960fdf3b7bb41c673504ad

# Diff at Fri, 21 Feb 2025 09:00:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21829674
- current block number: 21829674

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829674 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x7aA4960908B13D104bf056B23E2C76B43c5AACc8) {
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
    contract L1CrossDomainMessenger (0xe6a99Ef12995DeFC5ff47EC0e13252f0E6903759) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0xe46586d34beb44f906dfdae5e5de2853e28d916d

# Diff at Wed, 12 Feb 2025 10:00:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21802839
- current block number: 21829674

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

Generated with discovered.json: 0x5bc13de6542560ec8db77b11f54fae0faae73f77

# Diff at Mon, 10 Feb 2025 19:04:53 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802839
- current block number: 21802839

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802839 (main branch discovery), not current.

```diff
    contract SystemConfig (0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x1e61af2f81a0745baee106afa47e73ad6fdd4c13

# Diff at Sat, 08 Feb 2025 15:58:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786510
- current block number: 21802839

## Description

Single SC member rotated.

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

Generated with discovered.json: 0x985b63d559f5254c000cb52bf908b5b5cb050ba6

# Diff at Thu, 06 Feb 2025 09:17:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21628490
- current block number: 21786510

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

Generated with discovered.json: 0xf8e92b076c26b7c5f22941685d99cfe5d0470cc5

# Diff at Tue, 04 Feb 2025 12:33:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21628490
- current block number: 21628490

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628490 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SwellChainMultisig (0x06F7fB1C74147e34Fce04a6828c7BF809B038d0E) {
    +++ description: None
      receivedPermissions.0.permission:
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
    contract ProxyAdmin (0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
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
    contract AddressManager (0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
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

Generated with discovered.json: 0x7d7287215eb8ab13466c6fcb578c049cec18fcea

# Diff at Tue, 21 Jan 2025 11:19:16 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@0da84acc479f34212f2c8133869a3eef33d46ecc block: 21628490
- current block number: 21628490

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628490 (main branch discovery), not current.

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

Generated with discovered.json: 0x8e931a0b37647d3d9593eb873408f969d87fcb05

# Diff at Mon, 20 Jan 2025 11:10:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628490
- current block number: 21628490

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628490 (main branch discovery), not current.

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
    contract SwellChainMultisig (0x06F7fB1C74147e34Fce04a6828c7BF809B038d0E) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
      receivedPermissions.0.from:
+        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
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
    contract AnchorStateRegistry (0x14387438EE964e826A4EAeB95B2BCe7754174dD1) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract ProxyAdmin (0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e"
      directlyReceivedPermissions.8.from:
+        "0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e"
      directlyReceivedPermissions.7.target:
-        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
      directlyReceivedPermissions.7.from:
+        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
      directlyReceivedPermissions.6.target:
-        "0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603"
      directlyReceivedPermissions.6.from:
+        "0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603"
      directlyReceivedPermissions.5.target:
-        "0x89c98736A806176Fe85283c1cB727ffBdeaf37A9"
      directlyReceivedPermissions.5.from:
+        "0x89c98736A806176Fe85283c1cB727ffBdeaf37A9"
      directlyReceivedPermissions.4.target:
-        "0x87690676786cDc8cCA75A472e483AF7C8F2f0F57"
      directlyReceivedPermissions.4.from:
+        "0x87690676786cDc8cCA75A472e483AF7C8F2f0F57"
      directlyReceivedPermissions.3.target:
-        "0x7aA4960908B13D104bf056B23E2C76B43c5AACc8"
      directlyReceivedPermissions.3.from:
+        "0x7aA4960908B13D104bf056B23E2C76B43c5AACc8"
      directlyReceivedPermissions.2.target:
-        "0x758E0EE66102816F5C3Ec9ECc1188860fbb87812"
      directlyReceivedPermissions.2.from:
+        "0x758E0EE66102816F5C3Ec9ECc1188860fbb87812"
      directlyReceivedPermissions.1.target:
-        "0x14387438EE964e826A4EAeB95B2BCe7754174dD1"
      directlyReceivedPermissions.1.from:
+        "0x14387438EE964e826A4EAeB95B2BCe7754174dD1"
      directlyReceivedPermissions.0.target:
-        "0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A"
      directlyReceivedPermissions.0.from:
+        "0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A"
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
      receivedPermissions.10.target:
-        "0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e"
      receivedPermissions.10.from:
+        "0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e"
      receivedPermissions.9.target:
-        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
      receivedPermissions.9.from:
+        "0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4"
      receivedPermissions.8.target:
-        "0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603"
      receivedPermissions.8.from:
+        "0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603"
      receivedPermissions.7.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.7.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.6.target:
-        "0x89c98736A806176Fe85283c1cB727ffBdeaf37A9"
      receivedPermissions.6.from:
+        "0x89c98736A806176Fe85283c1cB727ffBdeaf37A9"
      receivedPermissions.5.target:
-        "0x87690676786cDc8cCA75A472e483AF7C8F2f0F57"
      receivedPermissions.5.from:
+        "0x87690676786cDc8cCA75A472e483AF7C8F2f0F57"
      receivedPermissions.4.target:
-        "0x7aA4960908B13D104bf056B23E2C76B43c5AACc8"
      receivedPermissions.4.from:
+        "0x7aA4960908B13D104bf056B23E2C76B43c5AACc8"
      receivedPermissions.3.target:
-        "0x758E0EE66102816F5C3Ec9ECc1188860fbb87812"
      receivedPermissions.3.from:
+        "0x758E0EE66102816F5C3Ec9ECc1188860fbb87812"
      receivedPermissions.2.target:
-        "0x14387438EE964e826A4EAeB95B2BCe7754174dD1"
      receivedPermissions.2.from:
+        "0x14387438EE964e826A4EAeB95B2BCe7754174dD1"
      receivedPermissions.1.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.1.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.target:
-        "0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A"
      receivedPermissions.0.from:
+        "0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A"
      directlyReceivedPermissions.1.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.1.from:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.0.target:
-        "0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"
      directlyReceivedPermissions.0.from:
+        "0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6"
    }
```

```diff
    contract OptimismPortal2 (0x758E0EE66102816F5C3Ec9ECc1188860fbb87812) {
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
    contract L1StandardBridge (0x7aA4960908B13D104bf056B23E2C76B43c5AACc8) {
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
    contract DisputeGameFactory (0x87690676786cDc8cCA75A472e483AF7C8F2f0F57) {
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
    contract DelayedWETH (0x89c98736A806176Fe85283c1cB727ffBdeaf37A9) {
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
    contract AddressManager (0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A) {
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
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603) {
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
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions.0.target:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      directlyReceivedPermissions.0.from:
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SystemConfig (0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.1.target:
-        "0xf854cd5B26bfd73d51236c0122798907Ed65B1f2"
      issuedPermissions.1.to:
+        "0xf854cd5B26bfd73d51236c0122798907Ed65B1f2"
      issuedPermissions.0.target:
-        "0x06F7fB1C74147e34Fce04a6828c7BF809B038d0E"
      issuedPermissions.0.to:
+        "0x06F7fB1C74147e34Fce04a6828c7BF809B038d0E"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
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
    contract L1ERC721Bridge (0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

Generated with discovered.json: 0x21efbb5f10febcd00c4c0329f50f3ee235b2156d

# Diff at Thu, 16 Jan 2025 10:14:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 21628490
- current block number: 21628490

## Description

Add decoding of absolute prestate hashes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628490 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0xa0cFbe3402d6E0a74e96D3C360F74D5ea4Fa6893) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
+        "v1.3.1 (govApproved)"
      fieldMeta:
+        {"absolutePrestateDecoded":{"description":"Prestate tag for known prestates."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x0386cde2f2b1bde1189ac9c9b7d66774e6260eca778223def326bfe680c14ab9":"v1.4.1-rc.2 (cannon64)","0x03045fd433fb5391c40751939d7cb5e9dfe83cf156f9395566a311e7fe9d3aa2":"v1.4.1-rc.2","0x03b7eaa4e3cbce90381921a4b48008f4769871d64f93d113fcadca08ecee503b":"v1.4.0 (cannon64)","0x03f89406817db1ed7fd8b31e13300444652cdb0b9c509a674de43483b2f83568":"v1.4.0 (govApproved)","0x0348ce2059f718af75729c2c56860551b46b665956a641b3cb2cd51e50b7b725":"v1.4.0-rc.2 (cannon64)","0x0364e4e72922e7d649338f558f8a14b50ca31922a1484e73ea03987fb1516095":"v1.4.0-rc.2","0x032e5d6119ee983cb87deae3eef16ea6086f2347433c99f1820d60f36a24a6e6":"v1.4.0-rc.1 (cannon64)","0x03925193e3e89f87835bbdf3a813f60b2aa818a36bbe71cd5d8fd7e79f5e8afe":"v1.4.0-rc.1","0x03c50b9fd04bdadc228205f340767bbf2d01a030aec39903120d3559d94bb8cc":"v1.3.1-ink","0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c":"v1.3.1 (govApproved)","0x03e806a2859a875267a563462a06d4d1d1b455a9efee959a46e21e54b6caf69a":"v1.3.1-rc.1","0x030de10d9da911a2b180ecfae2aeaba8758961fc28262ce989458c6f9a547922":"v1.3.0-rc.3","0x0385c3f8ee78491001d92b90b07d0cf387b7b52ab9b83b4d87c994e92cf823ba":"v1.3.0-rc.2","0x0367c4aa897bffbded0b523f277ca892298dc3c691baf37bc2099b86024f9673":"v1.3.0-rc.1","0x03617abec0b255dc7fc7a0513a2c2220140a1dcd7a1c8eca567659bd67e05cea":"v1.2.0 (govApproved)","0x03e69d3de5155f4a80da99dd534561cbddd4f9dd56c9ecc704d6886625711d2b":"v1.1.0","0x0398bdd93e2e9313befdf82beb709da6a4daf35ce1abb42d8a998ec9bc1c572e":"v1.0.1","0x037ef3c1a487960b0e633d3e513df020c43432769f41a634d18a9595cbf53c55":"v1.0.0 (govApproved)","0x034c8cc69f22c35ae386a97136715dd48aaf97fd190942a111bfa680c2f2f421":"v0.3.0","0x031e3b504740d0b1264e8cf72b6dde0d497184cfb3f98e451c6be8b33bd3f808":"v0.2.0","0x038942ec840131a63c49fa514a3f0577ae401fd5584d56ad50cdf5a8b41d4538":"v0.1.0","0x03babef4b4c6d866d56e6356d961839fd9475931d11e0ea507420a87b0cadbdd":"v0.0.1"}}]
    }
```

Generated with discovered.json: 0x40c9ffc5d95b774877bf5821fdafb72d6da3ab9e

# Diff at Wed, 15 Jan 2025 07:48:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21565774
- current block number: 21628490

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21565774 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x8cc7f7c6fb874791526324461d1cd8cd3f42f453

# Diff at Wed, 08 Jan 2025 09:07:51 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21565774
- current block number: 21565774

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21565774 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x7aA4960908B13D104bf056B23E2C76B43c5AACc8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xb0e909c4ca225287b65a88ec74f64cf83376606c

# Diff at Mon, 06 Jan 2025 13:39:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@969dad8a7ea2e6cba9a02db28683ddad0178857a block: 20985756
- current block number: 21565774

## Description

Initial discovery of an OP stack chain with known contracts and superchain gov, using a permissioned-dispute-game-ONLY construction similar to ink l2 on launch.

## Watched changes

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract SwellChainMultisig (0x06F7fB1C74147e34Fce04a6828c7BF809B038d0E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x14387438EE964e826A4EAeB95B2BCe7754174dD1)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
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
    contract ProxyAdmin (0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6)
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
    contract OptimismPortal2 (0x758E0EE66102816F5C3Ec9ECc1188860fbb87812)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x7aA4960908B13D104bf056B23E2C76B43c5AACc8)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x87690676786cDc8cCA75A472e483AF7C8F2f0F57)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x89c98736A806176Fe85283c1cB727ffBdeaf37A9)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
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
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xa0cFbe3402d6E0a74e96D3C360F74D5ea4Fa6893)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AddressManager (0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xe6a99Ef12995DeFC5ff47EC0e13252f0E6903759)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC20TokenBridge (0xecf3376512EDAcA4FBB63d2c67d12a0397d24121)
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

## Source code changes

```diff
.../swell/ethereum/.flat/AddressManager.sol        |  129 +
 .../AnchorStateRegistry/AnchorStateRegistry.sol    |  432 +++
 .../ethereum/.flat/AnchorStateRegistry/Proxy.p.sol |  200 +
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  651 ++++
 .../swell/ethereum/.flat/DelayedWETH/Proxy.p.sol   |  200 +
 .../swell/ethereum/.flat/DeputyGuardianModule.sol  |  156 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1550 ++++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../swell/ethereum/.flat/GnosisSafe/GnosisSafe.sol |  953 +++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |   35 +
 .../L1CrossDomainMessenger.sol                     | 1514 ++++++++
 .../ResolvedDelegateProxy.p.sol                    |   55 +
 .../L1ERC20TokenBridge/L1ERC20TokenBridge.sol      | 1078 ++++++
 .../.flat/L1ERC20TokenBridge/OssifiableProxy.p.sol |  614 +++
 .../.flat/L1ERC721Bridge/L1ERC721Bridge.sol        |  707 ++++
 .../ethereum/.flat/L1ERC721Bridge/Proxy.p.sol      |  200 +
 .../.flat/L1StandardBridge/L1ChugSplashProxy.p.sol |  269 ++
 .../.flat/L1StandardBridge/L1StandardBridge.sol    | 1538 ++++++++
 .../swell/ethereum/.flat/Lib_AddressManager.sol    |  152 +
 .../swell/ethereum/.flat/LivenessGuard.sol         |  582 +++
 .../swell/ethereum/.flat/LivenessModule.sol        |  258 ++
 .../swell/ethereum/.flat/MIPS.sol                  | 1517 ++++++++
 .../OpFoundationOperationsSafe/GnosisSafe.sol      |  959 +++++
 .../.flat/OpFoundationOperationsSafe/Proxy.p.sol   |   39 +
 .../.flat/OpFoundationUpgradeSafe/GnosisSafe.sol   |  953 +++++
 .../OpFoundationUpgradeSafe/GnosisSafeProxy.p.sol  |   35 +
 .../OptimismMintableERC20Factory.sol               |  427 +++
 .../.flat/OptimismMintableERC20Factory/Proxy.p.sol |  200 +
 .../.flat/OptimismPortal2/OptimismPortal2.sol      | 3018 +++++++++++++++
 .../ethereum/.flat/OptimismPortal2/Proxy.p.sol     |  200 +
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4026 ++++++++++++++++++++
 .../swell/ethereum/.flat/PreimageOracle.sol        | 1353 +++++++
 .../swell/ethereum/.flat/ProxyAdmin.sol            |  298 ++
 .../.flat/SecurityCouncilMultisig/GnosisSafe.sol   |  953 +++++
 .../SecurityCouncilMultisig/GnosisSafeProxy.p.sol  |   35 +
 .../ethereum/.flat/SuperchainConfig/Proxy.p.sol    |  200 +
 .../.flat/SuperchainConfig/SuperchainConfig.sol    |  477 +++
 .../SuperchainGuardianMultisig/GnosisSafe.sol      |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../swell/ethereum/.flat/SuperchainProxyAdmin.sol  |  298 ++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../ethereum/.flat/SwellChainMultisig/Safe.sol     | 1088 ++++++
 .../.flat/SwellChainMultisig/SafeProxy.p.sol       |   37 +
 .../swell/ethereum/.flat/SystemConfig/Proxy.p.sol  |  200 +
 .../ethereum/.flat/SystemConfig/SystemConfig.sol   |  826 ++++
 46 files changed, 30588 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20985756 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90)
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
```

```diff
-   Status: DELETED
    contract SwellL2PrelaunchVault (0x38D43a6Cb8DA0E855A42fB6b0733A0498531d774)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Zap (0xBD9fc4FdB07e46a69349101E862e82aa002aDe0d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Timelock (0xCa2DF225ba3c4743E02611EC423FaAC311dEEEd4)
    +++ description: None
```

Generated with discovered.json: 0x3bbfe0fb4fecc0858ec4b3d36797099ba3b01a60

# Diff at Mon, 21 Oct 2024 12:49:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20985756
- current block number: 20985756

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20985756 (main branch discovery), not current.

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      descriptions:
-        ["Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem"]
      description:
+        "Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem"
    }
```

Generated with discovered.json: 0x3548a172928f0df4e9b68a8a9ed5bc2ac911e55e

# Diff at Thu, 17 Oct 2024 14:02:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b22da46ad96e1d0cb3e7d83e3293eb7b76990953 block: 20964349
- current block number: 20985756

## Description

1 signer removed from SwellMultisig.

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      values.$members.6:
-        "0x5b27b9279251904AaF2127463eeFf91E0037F725"
      values.$members.5:
-        "0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59"
+        "0x5b27b9279251904AaF2127463eeFf91E0037F725"
      values.$members.4:
-        "0x042d200e5375204F022570361f3913b245488091"
+        "0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x9fd2289066719a81108d257277c08f5a7d8d0f18

# Diff at Mon, 14 Oct 2024 14:18:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f799449f5bf9f715885662e0303a221ca27f97a5 block: 20016207
- current block number: 20964349

## Description

One new signer added to SwellMultisig.

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      values.$members.6:
+        "0x5b27b9279251904AaF2127463eeFf91E0037F725"
      values.$members.5:
-        "0x5b27b9279251904AaF2127463eeFf91E0037F725"
+        "0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59"
      values.$members.4:
-        "0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59"
+        "0x042d200e5375204F022570361f3913b245488091"
      values.$members.3:
-        "0x042d200e5375204F022570361f3913b245488091"
+        "0x284C633962F2386590E934c4fBD2D3EafA0944A3"
      values.$members.2:
-        "0x284C633962F2386590E934c4fBD2D3EafA0944A3"
+        "0xD8DbDb15e91596c50A72E77d95dbC866ebdA8238"
      values.$members.1:
-        "0xD8DbDb15e91596c50A72E77d95dbC866ebdA8238"
+        "0xd08b294dBD8Bc760c57AbdEC26515Da626511B40"
      values.$members.0:
-        "0xd08b294dBD8Bc760c57AbdEC26515Da626511B40"
+        "0xF14E35C4F1E51BF7Ed930813eCD2e2dA1fc86072"
      values.multisigThreshold:
-        "4 of 6 (67%)"
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x77106dd9943e0d347db6198e66f087f3424ed9ba

# Diff at Mon, 14 Oct 2024 10:56:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20016207
- current block number: 20016207

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016207 (main branch discovery), not current.

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SwellL2PrelaunchVault (0x38D43a6Cb8DA0E855A42fB6b0733A0498531d774) {
    +++ description: None
      sourceHashes:
+        ["0x3905f28c9b0500b746756a8cf7d0bed4cb79c6bee28f80b384514d7fdd969bac"]
    }
```

```diff
    contract Zap (0xBD9fc4FdB07e46a69349101E862e82aa002aDe0d) {
    +++ description: None
      sourceHashes:
+        ["0x7f2346203319dad1511cb447159e190292bb6ea303b20a40341503c6d2c8b839"]
    }
```

```diff
    contract Timelock (0xCa2DF225ba3c4743E02611EC423FaAC311dEEEd4) {
    +++ description: None
      sourceHashes:
+        ["0x43aeca3d5513c5b43391523911d8ee8061fb1a83b088fdc0d3abb16e4a9659b9"]
    }
```

Generated with discovered.json: 0x9e6c7c4b43e6357d45c7118b468f6d727a21335d

# Diff at Fri, 09 Aug 2024 10:12:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20016207
- current block number: 20016207

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016207 (main branch discovery), not current.

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xd08b294dBD8Bc760c57AbdEC26515Da626511B40","0xD8DbDb15e91596c50A72E77d95dbC866ebdA8238","0x284C633962F2386590E934c4fBD2D3EafA0944A3","0x042d200e5375204F022570361f3913b245488091","0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59","0x5b27b9279251904AaF2127463eeFf91E0037F725"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xd08b294dBD8Bc760c57AbdEC26515Da626511B40","0xD8DbDb15e91596c50A72E77d95dbC866ebdA8238","0x284C633962F2386590E934c4fBD2D3EafA0944A3","0x042d200e5375204F022570361f3913b245488091","0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59","0x5b27b9279251904AaF2127463eeFf91E0037F725"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x8ee9736a55585664c0c57b21401881a26aacf907

# Diff at Tue, 30 Jul 2024 11:16:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20016207
- current block number: 20016207

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016207 (main branch discovery), not current.

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      fieldMeta:
+        {"nonce":{"severity":"MEDIUM","description":"Watch out for txs concerning the prelaunch vault and swell L2 launch"}}
    }
```

Generated with discovered.json: 0xd27154564d17a85a983339e3252fc37fe7df0563

# Diff at Tue, 04 Jun 2024 04:55:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@706706295a49487100a144276621ec14caf86806 block: 19873897
- current block number: 20016207

## Description

A timelock transaction is queued by the SwellMultisig to support the Lyra-associated token weETHC for staking in the swell prelaunch escrow.

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
+++ description: Watch out for txs concerning the prelaunch vault and swell L2 launch
+++ severity: MEDIUM
      values.nonce:
-        109
+        110
    }
```

Generated with discovered.json: 0x55b7dacb1f6b507abd00e02b14fa8d1fcf0d6aa8

# Diff at Wed, 15 May 2024 07:31:04 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6f5171cf9179f1cc9ea0379d73057884dd330078 block: 19859664
- current block number: 19873897

## Description

The timelock tx explained in the update below is executed.

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin functions in the swell ecosystem
+++ description: Watch out for txs concerning the prelaunch vault and swell L2 launch
+++ severity: MEDIUM
      values.nonce:
-        108
+        109
    }
```

Generated with discovered.json: 0xe81a0b6dc8ed608bd7b05dfef62949a59623169a

# Diff at Mon, 13 May 2024 07:41:01 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@142cacbaef1c026127ab0d88f45c576741b3a345 block: 19794895
- current block number: 19859664

## Description

A timelock transaction is queued to whitelist (`supportToken(address,(bool,bool))`) the following tokens on Wednesday, 15 May 2024 04:00:00 GMT:

- sDAI (savings dai)
- wstUSDT (stusdt.io)
- liquidUSD (Ether.fi)
- apxETH (Dinero)
- pxETH (Dinero)

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
+++ description: Watch out for txs concerning the prelaunch vault and swell L2 launch
+++ severity: MEDIUM
      values.nonce:
-        107
+        108
    }
```

Generated with discovered.json: 0xaa1dd18f19c72836f6b4087c23b82a0cab0f6b45

# Diff at Sat, 04 May 2024 06:16:59 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19794895

## Description

Initial config for the Pre-launch phase of swell. There are two main contracts:
- Zap: Non-escrowing entry contract that wraps ETH, eETH or stETH and deposits them into the Vault. It is immutable and has no owner functions.
- SwellL2PrelaunchVault: Escrow that can hold predefined ERC-20s and nothing more. It is immutable and owner functions (`rescueERC20()`) are currently proxied with a 2d timelock in front of the SwellMultisig.


## Initial discovery

```diff
+   Status: CREATED
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SwellL2PrelaunchVault (0x38D43a6Cb8DA0E855A42fB6b0733A0498531d774)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Zap (0xBD9fc4FdB07e46a69349101E862e82aa002aDe0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xCa2DF225ba3c4743E02611EC423FaAC311dEEEd4)
    +++ description: None
```
