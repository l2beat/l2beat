Generated with discovered.json: 0x3565e23a5dec98af94ed575ad644ea4dcba2ce92

# Diff at Mon, 10 Mar 2025 12:40:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f6da90223c6b91864899f5bf128309f4edb196f1 block: 21680579
- current block number: 21680579

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680579 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract undefined (0x000000000000000000000000000000000000dEaD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0x0004cb44C80b6Fbf8ceb1d80AF688C9f7C0b2aB5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0x01D94b8F6b0da7f14D36d660EC0E746ed877151c)
    +++ description: None
```

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
    contract undefined (0x1524C875105840c7DCdd269463b0f968BB0B2358)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract undefined (0x2381D617547521a633022F12fbFd35F4128F0d06)
    +++ description: None
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
    contract undefined (0x51a3d95b25d932026c435527ff2Bee2E12b796Cf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x5B9bEf4d8C36FB013c70d0A6F455807c6BD5270b)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract undefined (0x66b8F8425ecB610239e79E3517feFddCf85Af41a)
    +++ description: None
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
    contract undefined (0x7623aA9B6D2c1a31E96ba47C9Bc07c6051E5189e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x7986eD289935A0F47FC434C00cDE309fE2c51f1C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0x892Aa95AD0b733A72e2f3F5EB20d5314CBBbD180)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x899F07862D3A03F70E07b7f01183934b485d2e97)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract undefined (0x936916b961bCB3899a0A5c900d4e4856462C3052)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0x936A3612A17FFAF824F80F4386e21d3a3F80EafD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0x9391791f7CB74F8BFDA65edc0749efd964311b55)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0xa31d8CDDf0D931Dfda2C9D03E35bd8b5d3A6aEC9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0xaF462439A057f32A0f2Ce0353cBC6E0515c40dE3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xBb70D595147A141e268532BFEF61A8c25054d26D)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract undefined (0xBc80De532cf87543aaD3267Cc8A4cAA2813130E7)
    +++ description: None
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
    contract undefined (0xd1E15028fe575AD2D8F6d7bd1CB22589dFA68fbe)
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
    contract undefined (0xfC8013c385d625f03B32d7b140593603CE9A870E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0xFCF35CeE40325db21c3dc5b45849251E78Be47eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xfd1255b6c09D939E7F3896A16C32CDBCD6F8B40A)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract undefined (0xfF57AA0CC7A727FF219673Cf329C05945685c0f2)
    +++ description: None
```

Generated with discovered.json: 0xa868a0e985bc8f9a3e7c7b57e44c5a88ad0997fe

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
