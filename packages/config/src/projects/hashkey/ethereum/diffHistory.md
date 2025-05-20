Generated with discovered.json: 0xff9e596b595c5ad1bf3593d048167abb96b1c7c3

# Diff at Thu, 08 May 2025 10:03:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22243976
- current block number: 22243976

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x78075eA46A562c3201E61664645c0f0537a8DDd5) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

```diff
    contract FaultDisputeGame (0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0x78d825d4a7e7c3fe48acfddc610aa027c65dd766

# Diff at Tue, 29 Apr 2025 08:19:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22243976
- current block number: 22243976

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x0407af506d86bFA5e401099b2fC2355590638f19) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f","via":[]},{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract AnchorStateRegistry (0x4deC2aA521108d78d983c0c12656c6CF8631F2ED) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"set and change address mappings.","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract DelayedWETH (0xBb70D595147A141e268532BFEF61A8c25054d26D) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"can pull funds from the contract in case of emergency.","via":[]},{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

```diff
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0xC7fCbE26c1Db751d63869F72F782a56710f6be5A","via":[]},{"permission":"upgrade","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}]
    }
```

Generated with discovered.json: 0x34425974767d48b5d9d0ca5c8101dae12a89badf

# Diff at Fri, 11 Apr 2025 13:15:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22243976
- current block number: 22243976

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22243976 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0x78075eA46A562c3201E61664645c0f0537a8DDd5) {
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
    contract FaultDisputeGame (0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA) {
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

Generated with discovered.json: 0xf2343d384ae34d4a9cbc8b06f91a393e234e552b

# Diff at Fri, 11 Apr 2025 06:42:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 22081892
- current block number: 22243976

## Description

batcherHash changed, added nonTemplateTrackedTransactions.
Config: anchorGame ignored.

## Watched changes

```diff
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.4:
-        "0x3fEF4F3e99936E89A8bBdD9E08D83c471D5E152D"
+        "0x78075eA46A562c3201E61664645c0f0537a8DDd5"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x3fEF4F3e99936E89A8bBdD9E08D83c471D5E152D)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.permission:
-        "sequence"
+        "upgrade"
      issuedPermissions.1.to:
-        "0x9391791f7CB74F8BFDA65edc0749efd964311b55"
+        "0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
      issuedPermissions.1.via.0:
+        {"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.to:
-        "0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
+        "0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f"
      issuedPermissions.0.via.0:
-        {"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}
      values.batcherHash:
-        "0x9391791f7CB74F8BFDA65edc0749efd964311b55"
+        "0xf09ebb62b5ba0cf402b77aBA61691cBCf005206f"
      values.unsafeBlockSigner:
-        "0xBc80De532cf87543aaD3267Cc8A4cAA2813130E7"
+        "0xCc467FdB41B5b5A4E23021CAd69ED27550a41694"
    }
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x78075eA46A562c3201E61664645c0f0537a8DDd5)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

Generated with discovered.json: 0x651dc10812ef91726304aa73dbe185bef077f2b4

# Diff at Fri, 04 Apr 2025 09:24:34 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@b3154c4385e52c9ffc0dab984c207390e5ccc13d block: 22081892
- current block number: 22081892

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22081892 (main branch discovery), not current.

```diff
    contract Hashkey Multisig 1 (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      receivedPermissions.12:
+        {"permission":"interact","from":"0xBb70D595147A141e268532BFEF61A8c25054d26D","description":"can pull funds from the contract in case of emergency."}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04","via":[{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]}
      receivedPermissions.10.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.10.from:
-        "0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04"
+        "0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe"
      receivedPermissions.10.via:
-        [{"address":"0x7986eD289935A0F47FC434C00cDE309fE2c51f1C"}]
      receivedPermissions.10.description:
+        "can pull funds from the contract in case of emergency."
    }
```

```diff
    contract DelayedWETH (0xBb70D595147A141e268532BFEF61A8c25054d26D) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"interact","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"can pull funds from the contract in case of emergency.","via":[]}
    }
```

```diff
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.1:
+        {"permission":"interact","to":"0x441F31C4cdf772558D4EA31f3114de59aE145E7c","description":"can pull funds from the contract in case of emergency.","via":[]}
    }
```

Generated with discovered.json: 0x2fe2a9a67c32b28da60823e8ff511363f2150789

# Diff at Thu, 27 Mar 2025 11:14:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22081892
- current block number: 22081892

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22081892 (main branch discovery), not current.

```diff
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x0e3c8f012c252da8bdcfd0b243c6ad87c7919070

# Diff at Wed, 19 Mar 2025 15:45:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4609d8355d7594946b66bef47876090fce6b0842 block: 21680579
- current block number: 22081892

## Description

Ignore.

## Watched changes

```diff
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.owner:
-        "0xa31d8CDDf0D931Dfda2C9D03E35bd8b5d3A6aEC9"
+        "0x441F31C4cdf772558D4EA31f3114de59aE145E7c"
    }
```

Generated with discovered.json: 0xd6c97df3b74fc191d918c81da667c8887e79245a

# Diff at Tue, 18 Mar 2025 08:12:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21680579
- current block number: 21680579

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract Hashkey Multisig 3 (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3) {
    +++ description: None
      name:
-        "HashkeyOpsMultisig"
+        "Hashkey Multisig 3"
    }
```

```diff
    contract Hashkey Multisig 1 (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      name:
-        "HashkeyUpgradeMultisig"
+        "Hashkey Multisig 1"
    }
```

```diff
    contract Hashkey Multisig 2 (0xC7fCbE26c1Db751d63869F72F782a56710f6be5A) {
    +++ description: None
      name:
-        "HashkeyGuardianMultisig"
+        "Hashkey Multisig 2"
    }
```

Generated with discovered.json: 0x7ac57517f8403e7b8c906f7b419ec3e32048218f

# Diff at Tue, 04 Mar 2025 11:25:46 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21680579
- current block number: 21680579

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xa30878174564cbe6a36fa928de6d7a82a230dd4e

# Diff at Tue, 04 Mar 2025 10:39:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21680579
- current block number: 21680579

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x0407af506d86bFA5e401099b2fC2355590638f19) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21414643
    }
```

```diff
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sinceBlock:
+        21414645
    }
```

```diff
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21414641
    }
```

```diff
    contract HashkeyOpsMultisig (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3) {
    +++ description: None
      sinceBlock:
+        21377718
    }
```

```diff
    contract PermissionedDisputeGame (0x3fEF4F3e99936E89A8bBdD9E08D83c471D5E152D) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sinceBlock:
+        21414684
    }
```

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21414640
    }
```

```diff
    contract HashkeyUpgradeMultisig (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      sinceBlock:
+        21414630
    }
```

```diff
    contract AnchorStateRegistry (0x4deC2aA521108d78d983c0c12656c6CF8631F2ED) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sinceBlock:
+        21414649
    }
```

```diff
    contract PreimageOracle (0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      sinceBlock:
+        21414662
    }
```

```diff
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21414630
    }
```

```diff
    contract MIPS (0x7447b25b91336127042CC6899B2C15668a1Ab8BA) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sinceBlock:
+        21414663
    }
```

```diff
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C) {
    +++ description: None
      sinceBlock:
+        21414630
    }
```

```diff
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21414642
    }
```

```diff
    contract DelayedWETH (0xBb70D595147A141e268532BFEF61A8c25054d26D) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21414647
    }
```

```diff
    contract FaultDisputeGame (0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      sinceBlock:
+        21414682
    }
```

```diff
    contract HashkeyGuardianMultisig (0xC7fCbE26c1Db751d63869F72F782a56710f6be5A) {
    +++ description: None
      sinceBlock:
+        21377739
    }
```

```diff
    contract L1ERC721Bridge (0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21414644
    }
```

```diff
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21414648
    }
```

```diff
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sinceBlock:
+        21414639
    }
```

```diff
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        21414631
    }
```

Generated with discovered.json: 0x5e044da9333a3ba156ee3ca0563ffa62a6b64bf4

# Diff at Thu, 27 Feb 2025 12:01:44 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21680579
- current block number: 21680579

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      displayName:
-        "OptimismPortal"
    }
```

Generated with discovered.json: 0x0448fe6d0fb2b41934c5c7e4228520cf11166d23

# Diff at Wed, 26 Feb 2025 10:32:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21680579
- current block number: 21680579

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0xa8c9d4f6ed2ffd3264f3870473c5ceffd77edb6b

# Diff at Fri, 21 Feb 2025 08:59:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21680579
- current block number: 21680579

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0x06541c5713224e8b06ea82aab98c41ea7965f092

# Diff at Mon, 10 Feb 2025 19:04:01 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21680579
- current block number: 21680579

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x4d1332455915e582e5fae4777f33f92bd21a2f4c

# Diff at Tue, 04 Feb 2025 12:31:32 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21680579
- current block number: 21680579

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
    contract HashkeyOpsMultisig (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract HashkeyUpgradeMultisig (0x441F31C4cdf772558D4EA31f3114de59aE145E7c) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x5eef6ac4cba7feb138f1fd5f8fb8510bd37a0087

# Diff at Wed, 22 Jan 2025 14:18:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21680579

## Description

Initial discovery. Uses OptiPortal2 (post OPFP) and system contract beta versions to allow for custom gasTokens. No other significant changes to the current Optimism contracts.

Respected Game type is permissioned, no SecurityCouncil, no Superchain gov.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x0407af506d86bFA5e401099b2fC2355590638f19)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x04Ec030f362CE5A0b5Fe2d4B4219f287C2EBDE50)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract HashkeyOpsMultisig (0x29Fbda675Fa5a07B621C2C1a6E3F874C14F612F3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x3fEF4F3e99936E89A8bBdD9E08D83c471D5E152D)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x43F8DeFe3E9286D152E91BB16a248808E7247198)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract HashkeyUpgradeMultisig (0x441F31C4cdf772558D4EA31f3114de59aE145E7c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x4deC2aA521108d78d983c0c12656c6CF8631F2ED)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract AddressManager (0x679A65aD62972Ea3561F40A12e93CcA6f79F35E6)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract MIPS (0x7447b25b91336127042CC6899B2C15668a1Ab8BA)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xBb70D595147A141e268532BFEF61A8c25054d26D)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xC3E7f3606aeAC543bD268a637c6847E92d69B8aA)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract HashkeyGuardianMultisig (0xC7fCbE26c1Db751d63869F72F782a56710f6be5A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xd4C83D93c6fAE3E0804B785F9Cf465BE95449D04)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xd9c31D15f2c649e525C2574bC025b3CAafAaf6fe)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```
