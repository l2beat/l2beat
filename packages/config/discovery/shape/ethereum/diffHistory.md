Generated with discovered.json: 0x6fb890e0b657939468a5d1840901b10cbe415b3b

# Diff at Tue, 04 Mar 2025 11:26:17 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21895001
- current block number: 21895001

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895001 (main branch discovery), not current.

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x0149b88672e142b05d47a04f246c79b6b6bd91a0

# Diff at Tue, 04 Mar 2025 10:39:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21895001
- current block number: 21895001

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895001 (main branch discovery), not current.

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
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      sinceBlock:
+        20369923
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
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        20369936
    }
```

```diff
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sinceBlock:
+        21695466
    }
```

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        20369937
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
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sinceBlock:
+        21379266
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        20369935
    }
```

```diff
    contract AnchorStateRegistry (0x6ace93AF6E8b36803577381be9f02A552e81C10D) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sinceBlock:
+        21695467
    }
```

```diff
    contract PermissionedDisputeGame (0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sinceBlock:
+        21875214
    }
```

```diff
    contract DelayedWETH (0x846d9469BAaF481f8516f7c1d03990672B68CB09) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        21875210
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
    contract AlchemyMultisig1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      sinceBlock:
+        20178171
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
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        20369922
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
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        20369938
    }
```

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      sinceBlock:
+        20369933
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        20369934
    }
```

Generated with discovered.json: 0xe1934f179c51829ef5e4c723f9a7349aea89d21a

# Diff at Thu, 27 Feb 2025 12:01:46 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21895001
- current block number: 21895001

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895001 (main branch discovery), not current.

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

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      displayName:
-        "OptimismPortal"
    }
```

Generated with discovered.json: 0xc3e1392d9a8528a37337ce4a78e7f092953cfac8

# Diff at Wed, 26 Feb 2025 10:33:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21895001
- current block number: 21895001

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895001 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
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
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xa53323b7d4c67a47cf8b70119e74cf05b2872bdf

# Diff at Fri, 21 Feb 2025 13:26:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21829672
- current block number: 21895001

## Description

PermissionedDisputeGame upgraded to known version.

## Watched changes

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.5.from:
-        "0x753355FE25E5592345Ac426DF2F6325E658575D1"
+        "0x846d9469BAaF481f8516f7c1d03990672B68CB09"
    }
```

```diff
-   Status: DELETED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.1:
-        "0xeFcb9D8FD3e21346a26791359a015c2304582238"
+        "0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A"
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (0x753355FE25E5592345Ac426DF2F6325E658575D1)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
    contract AlchemyMultisig1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.5.from:
-        "0x753355FE25E5592345Ac426DF2F6325E658575D1"
+        "0x846d9469BAaF481f8516f7c1d03990672B68CB09"
    }
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xeFcb9D8FD3e21346a26791359a015c2304582238)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x8090Ac33F4C9A1A220492487390dbe0c3b56a37A)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x846d9469BAaF481f8516f7c1d03990672B68CB09)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

## Source code changes

```diff
.../ethereum/{.flat@21829672 => .flat}/MIPS.sol    | 444 +++++++++++++++------
 .../PermissionedDisputeGame.sol                    | 408 +++++++++----------
 2 files changed, 507 insertions(+), 345 deletions(-)
```

Generated with discovered.json: 0x71b7102e0ff332a1aa972b3b99d8693931ea21bd

# Diff at Fri, 21 Feb 2025 09:00:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21829672
- current block number: 21829672

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829672 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
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

Generated with discovered.json: 0xda0183afeacdd52205d42f7b68fd6531164f5729

# Diff at Wed, 12 Feb 2025 10:00:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21802837
- current block number: 21829672

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

Generated with discovered.json: 0x90601f582bb25fab38b63365fc407644ec211cb2

# Diff at Mon, 10 Feb 2025 19:04:34 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802837
- current block number: 21802837

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802837 (main branch discovery), not current.

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x88bd372ba5847bacf9e04869a98b13e04f97295b

# Diff at Sat, 08 Feb 2025 15:58:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786508
- current block number: 21802837

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

Generated with discovered.json: 0x4f9f8df0c3b11770236173b2eaaf61339365b642

# Diff at Thu, 06 Feb 2025 09:20:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21778483
- current block number: 21786508

## Description

OP Stack SC signer rotation. Ignored permissioned games count manually.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.9:
-        "0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4"
+        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
    }
```

Generated with discovered.json: 0x0bb7f1bd068fba5f1baee6e37857fcf15d1599b5

# Diff at Wed, 05 Feb 2025 06:24:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@24a3610845e7ae2b3cc2daf90feff25e498e4068 block: 21080599
- current block number: 21778483

## Description

Upgrade to OptiPortal2 and permissioned proofs.

## Watched changes

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"}
      directlyReceivedPermissions.7.from:
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
+        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      directlyReceivedPermissions.6.from:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
+        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      directlyReceivedPermissions.5.from:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
+        "0x753355FE25E5592345Ac426DF2F6325E658575D1"
      directlyReceivedPermissions.4.from:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
+        "0x6ace93AF6E8b36803577381be9f02A552e81C10D"
      directlyReceivedPermissions.1.from:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
    }
```

```diff
-   Status: DELETED
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$implementation:
-        "0xAEfEA5D2Dd3B9A05a67FBD5E7C06c19151A7fe50"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.2:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$pastUpgrades.1:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        1
+        3
      values.superchainConfig:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$implementation:
-        "0x70201b22244D19fc52c2D09DC3e06c6cD2819067"
+        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.1:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      values.$implementation:
-        "0x5B0dE7F3CC36E5b4AF6580Ae7149Afad3E3C94D4"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.superchainConfig:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
    contract AlchemyMultisig1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}
      receivedPermissions.7.from:
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
+        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      receivedPermissions.6.from:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
+        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      receivedPermissions.5.from:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
+        "0x753355FE25E5592345Ac426DF2F6325E658575D1"
      receivedPermissions.4.from:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
+        "0x6ace93AF6E8b36803577381be9f02A552e81C10D"
      receivedPermissions.1.from:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
    }
```

```diff
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$implementation:
-        "0x5cBe8a4463370e38AcE1406875872eF38342a1c6"
+        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.2:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$pastUpgrades.1:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        1
+        3
      values.superchainConfig:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract OptimismPortal2 (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      name:
-        "OptimismPortal"
+        "OptimismPortal2"
      template:
-        "opstack/OptimismPortal"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0x90ab8a3636fafa5cb0ab4305b2d912546ceb47ebc3abed324bfa1727a9c74acc"
+        "0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d","via":[{"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}]}
      issuedPermissions.0.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.0.to:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0:
+        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"}
      values.$implementation:
-        "0x3Db18Ba41E7F377fa2603D2B500f40CF82683b78"
+        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.2:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.1:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        1
+        3
      values.guardian:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.l2Oracle:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      values.superchainConfig:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.version:
-        "2.6.0"
+        "3.10.0"
      values.disputeGameFactory:
+        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
      values.disputeGameFinalityDelaySeconds:
+        302400
      values.proofMaturityDelaySeconds:
+        604800
      values.RespectedGameString:
+        "PermissionedDisputeGame"
      values.respectedGameType:
+        1
      values.respectedGameTypeUpdatedAt:
+        1738700903
      displayName:
+        "OptimismPortal"
      fieldMeta:
+        {"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame"}}]
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"
+        "0xbbb92920a096eced30e3ce67bbc443f134b217e8847433fbb192ecb9fdddcbc2"
      values.$implementation:
-        "0x8174764Ae82696D232D5C93FEA6A006b1286dC4a"
+        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.$pastUpgrades.2:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]]
      values.$pastUpgrades.1:
+        ["2025-02-04T20:28:23.000Z","0x2f29cb5a59d7e7d132eb7afe57d9bf12df3db311db4ef5c5079f9043660635df",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        1
+        3
      values.L2_OUTPUT_ORACLE_SLOT:
-        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      values.version:
-        "1.12.0"
+        "2.2.0"
      values.DISPUTE_GAME_FACTORY_SLOT:
+        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.disputeGameFactory:
+        "0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952"
      values.maximumGasLimit:
+        200000000
    }
```

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
    contract DisputeGameFactory (0x2c03e8BF8b16Af89079852BE87f0e9eC674a5952)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
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
    contract AnchorStateRegistry (0x6ace93AF6E8b36803577381be9f02A552e81C10D)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x753355FE25E5592345Ac426DF2F6325E658575D1)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
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
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
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
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xeFcb9D8FD3e21346a26791359a015c2304582238)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  448 +++
 .../AnchorStateRegistry}/Proxy.p.sol               |    0
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  651 ++++
 .../DelayedWETH}/Proxy.p.sol                       |    0
 .../shape/ethereum/.flat/DeputyGuardianModule.sol  |  156 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1550 ++++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../shape/ethereum/.flat/GnosisSafe/GnosisSafe.sol |  953 +++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |   35 +
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../shape/ethereum/.flat/Lib_AddressManager.sol    |  152 +
 .../shape/ethereum/.flat/LivenessGuard.sol         |  582 +++
 .../shape/ethereum/.flat/LivenessModule.sol        |  258 ++
 .../shape/ethereum/.flat/MIPS.sol                  | 1517 ++++++++
 .../OpFoundationOperationsSafe/GnosisSafe.sol      |  959 +++++
 .../.flat/OpFoundationOperationsSafe/Proxy.p.sol   |   39 +
 .../.flat/OpFoundationUpgradeSafe/GnosisSafe.sol   |  953 +++++
 .../OpFoundationUpgradeSafe/GnosisSafeProxy.p.sol  |   35 +
 .../OptimismPortal2/OptimismPortal2.sol}           |  408 +-
 .../ethereum/.flat/OptimismPortal2/Proxy.p.sol     |  200 +
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4074 ++++++++++++++++++++
 .../shape/ethereum/.flat/PreimageOracle.sol        | 1353 +++++++
 .../.flat/SecurityCouncilMultisig/GnosisSafe.sol   |  953 +++++
 .../SecurityCouncilMultisig/GnosisSafeProxy.p.sol  |   35 +
 .../SuperchainGuardianMultisig/GnosisSafe.sol      |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../shape/ethereum/.flat/SuperchainProxyAdmin.sol  |  298 ++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../SystemConfig/SystemConfig.sol                  |   48 +-
 30 files changed, 17665 insertions(+), 847 deletions(-)
```

Generated with discovered.json: 0x563c869bdef59ca1935387e06fc1c22834b0ef95

# Diff at Tue, 04 Feb 2025 12:31:58 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21080599
- current block number: 21080599

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AlchemyMultisig1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x94a5184d4b5cee757f3b929e2c0995471185a43f

# Diff at Fri, 24 Jan 2025 10:54:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fff69b1db37918a5360f1e3b59d2f37be25d166f block: 21080599
- current block number: 21080599

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract AlchemyMultisig1 (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      name:
-        "ShapeMultisig"
+        "AlchemyMultisig1"
    }
```

Generated with discovered.json: 0x30ffb1d3f623302f755781864733fa26f4bd3507

# Diff at Mon, 20 Jan 2025 11:10:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21080599
- current block number: 21080599

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      directlyReceivedPermissions.7.from:
+        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      directlyReceivedPermissions.6.target:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      directlyReceivedPermissions.6.from:
+        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      directlyReceivedPermissions.5.target:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      directlyReceivedPermissions.5.from:
+        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      directlyReceivedPermissions.4.target:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      directlyReceivedPermissions.4.from:
+        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      directlyReceivedPermissions.3.target:
-        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      directlyReceivedPermissions.3.from:
+        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      directlyReceivedPermissions.2.target:
-        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      directlyReceivedPermissions.2.from:
+        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      directlyReceivedPermissions.1.target:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      directlyReceivedPermissions.1.from:
+        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      directlyReceivedPermissions.0.target:
-        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      directlyReceivedPermissions.0.from:
+        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
    }
```

```diff
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.target:
-        "0x0D8a607F3d2de86adD04Df00f06794cB339A40de"
      issuedPermissions.1.to:
+        "0x0D8a607F3d2de86adD04Df00f06794cB339A40de"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
    }
```

```diff
    contract ShapeMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      receivedPermissions.7.from:
+        "0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355"
      receivedPermissions.6.target:
-        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      receivedPermissions.6.from:
+        "0xEB06fFa16011B5628BaB98E29776361c83741dd3"
      receivedPermissions.5.target:
-        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      receivedPermissions.5.from:
+        "0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af"
      receivedPermissions.4.target:
-        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      receivedPermissions.4.from:
+        "0x6Ef8c69CfE4635d866e3E02732068022c06e724D"
      receivedPermissions.3.target:
-        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      receivedPermissions.3.from:
+        "0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B"
      receivedPermissions.2.target:
-        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      receivedPermissions.2.from:
+        "0x319322906beAdf69dF5d4607169c63D692B1aDC1"
      receivedPermissions.1.target:
-        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      receivedPermissions.1.from:
+        "0x125664BEf08177ca43f6f301E63118b1e4cCDe09"
      receivedPermissions.0.target:
-        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      receivedPermissions.0.from:
+        "0xcee78437aE9e15cee9c78E63757E0153c0FD7479"
      directlyReceivedPermissions.0.target:
-        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      directlyReceivedPermissions.0.from:
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
    }
```

```diff
    contract OptimismPortal (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.target:
-        "0xF7ca543d652E38692fD12f989eb55b5327eC9A20"
      issuedPermissions.1.to:
+        "0xF7ca543d652E38692fD12f989eb55b5327eC9A20"
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.to:
+        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0x2cd9f040f9ea2a25b4b2d26405262f84c225623e

# Diff at Wed, 08 Jan 2025 09:06:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21080599
- current block number: 21080599

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x678f29dc48de902c4a772dd221be85fcae8baa1f

# Diff at Fri, 01 Nov 2024 12:24:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21080599
- current block number: 21080599

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21080599 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      directlyReceivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ShapeMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x39ecb14810ed4c9c8150c10b6d44fef2197d999a

# Diff at Wed, 30 Oct 2024 19:40:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@35a03ca692bdeb6d3ac713174a7a196c73e4a9de block: 21065298
- current block number: 21080599

## Description

Shape switches the ProxyAdmin owner to a 3/6 multisig. EOA warning removed.

## Watched changes

```diff
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e) {
    +++ description: None
      values.owner:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
    }
```

```diff
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.2.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xacAF178b5048CB56712dc59E95fBA72F7990A005)
    +++ description: None
```

```diff
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0,"description":"set and change address mappings."}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract OptimismPortal (0xEB06fFa16011B5628BaB98E29776361c83741dd3) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xee1Af3f99AF8C5b93512FbE2A3f0dD5568CE087f"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.1:
-        {"address":"0x11B190Ae661c6d6884dFEE48E215691E0DdB842e","delay":0}
      issuedPermissions.2.via.0.address:
-        "0xacAF178b5048CB56712dc59E95fBA72F7990A005"
+        "0x11B190Ae661c6d6884dFEE48E215691E0DdB842e"
    }
```

```diff
+   Status: CREATED
    contract ShapeMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@21065298/GnosisSafe => .flat/ShapeMultisig}/GnosisSafe.sol     | 0
 .../GnosisSafe => .flat/ShapeMultisig}/GnosisSafeProxy.p.sol              | 0
 2 files changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21065298 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xacAF178b5048CB56712dc59E95fBA72F7990A005) {
    +++ description: None
      name:
-        "ShapeMultisig"
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x2bdd7db42436b16052a7763488380979b6e85e5c

# Diff at Tue, 29 Oct 2024 13:17:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21065298
- current block number: 21065298

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21065298 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x59f5c1563ea358ac473956b2ebb44a8a48245f23

# Diff at Mon, 28 Oct 2024 16:23:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21065298

## Description

Initial discovery: Standard OP stack rollup with EOA admin. (alchemy)

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x11B190Ae661c6d6884dFEE48E215691E0DdB842e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x125664BEf08177ca43f6f301E63118b1e4cCDe09)
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2b18602877181C3cB72C687E2A771E123A3788E3)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x319322906beAdf69dF5d4607169c63D692B1aDC1)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x6Ef8c69CfE4635d866e3E02732068022c06e724D)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract ShapeMultisig (0xacAF178b5048CB56712dc59E95fBA72F7990A005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xcee78437aE9e15cee9c78E63757E0153c0FD7479)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xe9d3E49b0636016c5fE9eaA2347948D0bA9f15Af)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xEB06fFa16011B5628BaB98E29776361c83741dd3)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xfF11e41D5C4F522E423Ff6C064Ff8D55AF8f7355)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```
