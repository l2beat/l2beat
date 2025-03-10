Generated with discovered.json: 0xd4ab59be7f1d1901c8bb1ea849ef4b0df054f08a

# Diff at Tue, 04 Mar 2025 11:25:28 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21880945
- current block number: 21880945

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880945 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xb9f198b4212ba27309691a05de72bb7b245b0114

# Diff at Tue, 04 Mar 2025 10:38:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21880945
- current block number: 21880945

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880945 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sinceBlock:
+        19989094
    }
```

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: None
      sinceBlock:
+        17482143
    }
```

```diff
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        17482143
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
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      sinceBlock:
+        17415345
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
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        17482143
    }
```

```diff
    contract DelayedWETH_PermissionedGames (0x3E8a0B63f57e975c268d610ece93da5f78c01321) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        20914005
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
    contract DisputeGameFactory (0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sinceBlock:
+        20914005
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      sinceBlock:
+        17482143
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
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        17482143
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        17482143
    }
```

```diff
    contract BaseAdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: None
      sinceBlock:
+        17730085
    }
```

```diff
    contract Escrow (0x7F311a4D48377030bD810395f4CCfC03bdbe9Ef3) {
    +++ description: None
      sinceBlock:
+        20935859
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
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        17482143
    }
```

```diff
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        17482143
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
    contract BaseMultisig1 (0x9855054731540A48b28990B63DcF4f33d8AE46A1) {
    +++ description: None
      sinceBlock:
+        17324450
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
    contract wstETHEscrow (0x9de443AdC5A411E83F1878Ef24C3F52C61571e72) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      sinceBlock:
+        18236815
    }
```

```diff
    contract DelayedWETH_PermissionlessGames (0xa2f2aC6F5aF72e494A227d79Db20473Cf7A1FFE8) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sinceBlock:
+        20914005
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
    contract FaultDisputeGame (0xc5f3677c3C56DB4031ab005a3C9c98e1B79D438e) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      sinceBlock:
+        21439974
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
    contract AnchorStateRegistry (0xdB9091e48B1C42992A1213e6916184f9eBDbfEDf) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sinceBlock:
+        20914005
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
    contract PermissionedDisputeGame (0xF62c15e2F99d4869A925B8F57076cD85335832A2) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sinceBlock:
+        21439975
    }
```

Generated with discovered.json: 0x5b78416ae30a424a0c2bbb65d4ddaee8193c469b

# Diff at Thu, 27 Feb 2025 12:01:44 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21880945
- current block number: 21880945

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880945 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      displayName:
+        "OptimismPortal2"
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

Generated with discovered.json: 0xf75f28f79654bd2676b62f0378f8fdc1cf0593be

# Diff at Wed, 26 Feb 2025 10:32:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21880945
- current block number: 21880945

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880945 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract DisputeGameFactory (0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
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

Generated with discovered.json: 0xead69dc0a273dcebe36741336cf6ee653b33ee51

# Diff at Fri, 21 Feb 2025 08:59:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21880945
- current block number: 21880945

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880945 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0x54d9309ea58e6ec90411c849fbe182b737495f41

# Diff at Wed, 19 Feb 2025 14:15:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@90e939c93581cd5b2e00d23bb3ba08dde38932e8 block: 21844112
- current block number: 21880945

## Description

BaseMultisig2 signer changes.

## Watched changes

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      values.$members.13:
+        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
      values.$members.12:
-        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
+        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
      values.$members.11:
-        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
+        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
      values.$members.10:
-        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
+        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
      values.$members.9:
-        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
+        "0xa3D3c103442F162856163d564b983ae538c6202D"
      values.$members.8:
-        "0xa3D3c103442F162856163d564b983ae538c6202D"
+        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
      values.$members.7:
-        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
+        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
      values.$members.6:
-        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
+        "0x73565876170a336Fa02fDe34EeD03E3121f70bA6"
      values.$members.5:
-        "0x73565876170a336Fa02fDe34EeD03E3121f70bA6"
+        "0x26c72586FB396325F58718152FEFA94E93Cf177b"
      values.$members.4:
-        "0x26c72586FB396325F58718152FEFA94E93Cf177b"
+        "0x5468985B560D966dEDEa2DAF493f5756101137DC"
      values.$members.3:
-        "0x5468985B560D966dEDEa2DAF493f5756101137DC"
+        "0xe32868ec7762650DdE723e945D638A05900974F4"
      values.$members.2:
-        "0xe32868ec7762650DdE723e945D638A05900974F4"
+        "0x7Ad8E6B7B1f6D66F49559f20053Cef8a7b6c488E"
      values.$members.1:
-        "0x7Ad8E6B7B1f6D66F49559f20053Cef8a7b6c488E"
+        "0x644e3DedB0e4F83Bfcf8F9992964d240224B74dc"
      values.$members.0:
-        "0x644e3DedB0e4F83Bfcf8F9992964d240224B74dc"
+        "0x24c3AE1AeDB8142D32BB6d3B988f5910F272D53b"
      values.multisigThreshold:
-        "3 of 13 (23%)"
+        "3 of 14 (21%)"
    }
```

Generated with discovered.json: 0xbda530e21d16477ac36c4d9f00ff83fde0d09985

# Diff at Fri, 14 Feb 2025 10:30:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 21829668
- current block number: 21844112

## Description

Multisig changes.

## Watched changes

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      values.$members.12:
+        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
      values.$members.11:
-        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
+        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
      values.$members.10:
-        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
+        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
      values.$members.9:
-        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
+        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
      values.$members.8:
-        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
+        "0xa3D3c103442F162856163d564b983ae538c6202D"
      values.$members.7:
-        "0xa3D3c103442F162856163d564b983ae538c6202D"
+        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
      values.$members.6:
-        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
+        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
      values.$members.5:
-        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
+        "0x73565876170a336Fa02fDe34EeD03E3121f70bA6"
      values.$members.4:
-        "0x73565876170a336Fa02fDe34EeD03E3121f70bA6"
+        "0x26c72586FB396325F58718152FEFA94E93Cf177b"
      values.$members.3:
-        "0x26c72586FB396325F58718152FEFA94E93Cf177b"
+        "0x5468985B560D966dEDEa2DAF493f5756101137DC"
      values.$members.2:
-        "0x5468985B560D966dEDEa2DAF493f5756101137DC"
+        "0xe32868ec7762650DdE723e945D638A05900974F4"
      values.$members.1:
-        "0xe32868ec7762650DdE723e945D638A05900974F4"
+        "0x7Ad8E6B7B1f6D66F49559f20053Cef8a7b6c488E"
      values.$members.0:
-        "0x7Ad8E6B7B1f6D66F49559f20053Cef8a7b6c488E"
+        "0x644e3DedB0e4F83Bfcf8F9992964d240224B74dc"
      values.multisigThreshold:
-        "3 of 12 (25%)"
+        "3 of 13 (23%)"
    }
```

Generated with discovered.json: 0xb82e51c151ddc4e6cabd5e5330f905e20ce9fb0d

# Diff at Wed, 12 Feb 2025 09:59:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21802832
- current block number: 21829668

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

Generated with discovered.json: 0xc337235f39b6d93ea7832ae6bace3b7a131b2689

# Diff at Mon, 10 Feb 2025 19:03:43 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802832
- current block number: 21802832

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802832 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x18d39ee23475ffbb9e5cd3bab38c8f1be94251e5

# Diff at Sat, 08 Feb 2025 15:57:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786503
- current block number: 21802832

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

Generated with discovered.json: 0x6ce975569341330b68a3e0671f5923f8e14d4a1c

# Diff at Thu, 06 Feb 2025 09:16:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21778446
- current block number: 21786503

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

Generated with discovered.json: 0xaf1bb18c41bc80f3b933bc6bdfe541efca344777

# Diff at Wed, 05 Feb 2025 06:17:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@24a3610845e7ae2b3cc2daf90feff25e498e4068 block: 21736764
- current block number: 21778446

## Description

Upgrade to new SystemConfig (known implementation). maximumGasLimit halved but due to the new logic effectively minor change in the L2 gas limit.

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x1fdf490a723dc133305fa86c7ce08d98470bf7c9de74ece4ef8bc280d2355d50"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "0x45C4e267aE21E90f72C8AbF43ddB5941c953482F"
+        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.7:
+        ["2025-02-04T20:28:47.000Z","0x765a2eb3c7eecea5722b120037123eaec9e6ef4b6a53ba2bcfb88ef08fae074b",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.6:
+        ["2025-02-04T20:28:47.000Z","0x765a2eb3c7eecea5722b120037123eaec9e6ef4b6a53ba2bcfb88ef08fae074b",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        6
+        8
      values.maximumGasLimit:
-        400000000
+        200000000
      values.version:
-        "2.2.0+max-gas-limit-400M"
+        "2.3.0"
      values.basefeeScalar:
+        2269
      values.blobbasefeeScalar:
+        1055762
      values.eip1559Denominator:
+        250
      values.eip1559Elasticity:
+        2
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
.../SystemConfig/SystemConfig.sol                  | 1460 +++++++++++++++++++-
 1 file changed, 1437 insertions(+), 23 deletions(-)
```

Generated with discovered.json: 0x28176b14555d05177f0006f71459e066e264c831

# Diff at Tue, 04 Feb 2025 12:30:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21736764
- current block number: 21736764

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736764 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
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
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BaseAdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
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

Generated with discovered.json: 0xd5cd31f8fa6f7d925004bce737c77931f3e87c9b

# Diff at Thu, 30 Jan 2025 10:30:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2da0612158e4fa23c41926c49e88a7b955a8c5dc block: 21628432
- current block number: 21736764

## Description

One signer added to BaseMultisig2.

## Watched changes

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      values.$members.11:
+        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
      values.$members.10:
-        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
+        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
      values.$members.9:
-        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
+        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
      values.$members.8:
-        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
+        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
      values.$members.7:
-        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
+        "0xa3D3c103442F162856163d564b983ae538c6202D"
      values.$members.6:
-        "0xa3D3c103442F162856163d564b983ae538c6202D"
+        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
      values.$members.5:
-        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
+        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
      values.$members.4:
-        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
+        "0x73565876170a336Fa02fDe34EeD03E3121f70bA6"
      values.$members.3:
-        "0x73565876170a336Fa02fDe34EeD03E3121f70bA6"
+        "0x26c72586FB396325F58718152FEFA94E93Cf177b"
      values.$members.2:
-        "0x26c72586FB396325F58718152FEFA94E93Cf177b"
+        "0x5468985B560D966dEDEa2DAF493f5756101137DC"
      values.$members.1:
-        "0x5468985B560D966dEDEa2DAF493f5756101137DC"
+        "0xe32868ec7762650DdE723e945D638A05900974F4"
      values.$members.0:
-        "0xe32868ec7762650DdE723e945D638A05900974F4"
+        "0x7Ad8E6B7B1f6D66F49559f20053Cef8a7b6c488E"
      values.multisigThreshold:
-        "3 of 11 (27%)"
+        "3 of 12 (25%)"
    }
```

Generated with discovered.json: 0x09c4c15f9f3d239b189fbd7735a8ace022d54351

# Diff at Tue, 21 Jan 2025 11:19:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@0da84acc479f34212f2c8133869a3eef33d46ecc block: 21628432
- current block number: 21628432

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628432 (main branch discovery), not current.

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

Generated with discovered.json: 0xda56e7b36650a041ad97a88c012ce5597dd6309b

# Diff at Mon, 20 Jan 2025 11:09:18 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628432
- current block number: 21628432

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628432 (main branch discovery), not current.

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
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: None
      directlyReceivedPermissions.9.target:
-        "0xdB9091e48B1C42992A1213e6916184f9eBDbfEDf"
      directlyReceivedPermissions.9.from:
+        "0xdB9091e48B1C42992A1213e6916184f9eBDbfEDf"
      directlyReceivedPermissions.8.target:
-        "0xa2f2aC6F5aF72e494A227d79Db20473Cf7A1FFE8"
      directlyReceivedPermissions.8.from:
+        "0xa2f2aC6F5aF72e494A227d79Db20473Cf7A1FFE8"
      directlyReceivedPermissions.7.target:
-        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
      directlyReceivedPermissions.7.from:
+        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
      directlyReceivedPermissions.6.target:
-        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
      directlyReceivedPermissions.6.from:
+        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
      directlyReceivedPermissions.5.target:
-        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
      directlyReceivedPermissions.5.from:
+        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
      directlyReceivedPermissions.4.target:
-        "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e"
      directlyReceivedPermissions.4.from:
+        "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e"
      directlyReceivedPermissions.3.target:
-        "0x3E8a0B63f57e975c268d610ece93da5f78c01321"
      directlyReceivedPermissions.3.from:
+        "0x3E8a0B63f57e975c268d610ece93da5f78c01321"
      directlyReceivedPermissions.2.target:
-        "0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
      directlyReceivedPermissions.2.from:
+        "0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
      directlyReceivedPermissions.1.target:
-        "0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84"
      directlyReceivedPermissions.1.from:
+        "0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84"
      directlyReceivedPermissions.0.target:
-        "0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2"
      directlyReceivedPermissions.0.from:
+        "0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
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
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
      receivedPermissions.0.from:
+        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
    }
```

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract DelayedWETH_PermissionedGames (0x3E8a0B63f57e975c268d610ece93da5f78c01321) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.0.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
    }
```

```diff
    contract DisputeGameFactory (0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions.0.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      issuedPermissions.0.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
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
      receivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.0.from:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.1.target:
-        "0x5050F69a9786F081509234F1a7F4684b5E5b76C9"
      issuedPermissions.1.to:
+        "0x5050F69a9786F081509234F1a7F4684b5E5b76C9"
      issuedPermissions.0.target:
-        "0x14536667Cd30e52C0b458BaACcB9faDA7046E056"
      issuedPermissions.0.to:
+        "0x14536667Cd30e52C0b458BaACcB9faDA7046E056"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract BaseAdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: None
      receivedPermissions.9.target:
-        "0xdB9091e48B1C42992A1213e6916184f9eBDbfEDf"
      receivedPermissions.9.from:
+        "0xdB9091e48B1C42992A1213e6916184f9eBDbfEDf"
      receivedPermissions.8.target:
-        "0xa2f2aC6F5aF72e494A227d79Db20473Cf7A1FFE8"
      receivedPermissions.8.from:
+        "0xa2f2aC6F5aF72e494A227d79Db20473Cf7A1FFE8"
      receivedPermissions.7.target:
-        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
      receivedPermissions.7.from:
+        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
      receivedPermissions.6.target:
-        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
      receivedPermissions.6.from:
+        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
      receivedPermissions.5.target:
-        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
      receivedPermissions.5.from:
+        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
      receivedPermissions.4.target:
-        "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e"
      receivedPermissions.4.from:
+        "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e"
      receivedPermissions.3.target:
-        "0x3E8a0B63f57e975c268d610ece93da5f78c01321"
      receivedPermissions.3.from:
+        "0x3E8a0B63f57e975c268d610ece93da5f78c01321"
      receivedPermissions.2.target:
-        "0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
      receivedPermissions.2.from:
+        "0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
      receivedPermissions.1.target:
-        "0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84"
      receivedPermissions.1.from:
+        "0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84"
      receivedPermissions.0.target:
-        "0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2"
      receivedPermissions.0.from:
+        "0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2"
      directlyReceivedPermissions.0.target:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
      directlyReceivedPermissions.0.from:
+        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
    }
```

```diff
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.description:
+        "set and change address mappings."
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
    contract DelayedWETH_PermissionlessGames (0xa2f2aC6F5aF72e494A227d79Db20473Cf7A1FFE8) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions.0.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
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
    contract AnchorStateRegistry (0xdB9091e48B1C42992A1213e6916184f9eBDbfEDf) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions.0.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
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

Generated with discovered.json: 0x67609517ee5f224c525b239abae07f43a31e5a0a

# Diff at Thu, 16 Jan 2025 10:14:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 21628432
- current block number: 21628432

## Description

Add decoding of absolute prestate hashes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628432 (main branch discovery), not current.

```diff
    contract FaultDisputeGame (0xc5f3677c3C56DB4031ab005a3C9c98e1B79D438e) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
+        "v1.4.0 (govApproved)"
      fieldMeta:
+        {"absolutePrestateDecoded":{"description":"Prestate tag for known prestates."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x0386cde2f2b1bde1189ac9c9b7d66774e6260eca778223def326bfe680c14ab9":"v1.4.1-rc.2 (cannon64)","0x03045fd433fb5391c40751939d7cb5e9dfe83cf156f9395566a311e7fe9d3aa2":"v1.4.1-rc.2","0x03b7eaa4e3cbce90381921a4b48008f4769871d64f93d113fcadca08ecee503b":"v1.4.0 (cannon64)","0x03f89406817db1ed7fd8b31e13300444652cdb0b9c509a674de43483b2f83568":"v1.4.0 (govApproved)","0x0348ce2059f718af75729c2c56860551b46b665956a641b3cb2cd51e50b7b725":"v1.4.0-rc.2 (cannon64)","0x0364e4e72922e7d649338f558f8a14b50ca31922a1484e73ea03987fb1516095":"v1.4.0-rc.2","0x032e5d6119ee983cb87deae3eef16ea6086f2347433c99f1820d60f36a24a6e6":"v1.4.0-rc.1 (cannon64)","0x03925193e3e89f87835bbdf3a813f60b2aa818a36bbe71cd5d8fd7e79f5e8afe":"v1.4.0-rc.1","0x03c50b9fd04bdadc228205f340767bbf2d01a030aec39903120d3559d94bb8cc":"v1.3.1-ink","0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c":"v1.3.1 (govApproved)","0x03e806a2859a875267a563462a06d4d1d1b455a9efee959a46e21e54b6caf69a":"v1.3.1-rc.1","0x030de10d9da911a2b180ecfae2aeaba8758961fc28262ce989458c6f9a547922":"v1.3.0-rc.3","0x0385c3f8ee78491001d92b90b07d0cf387b7b52ab9b83b4d87c994e92cf823ba":"v1.3.0-rc.2","0x0367c4aa897bffbded0b523f277ca892298dc3c691baf37bc2099b86024f9673":"v1.3.0-rc.1","0x03617abec0b255dc7fc7a0513a2c2220140a1dcd7a1c8eca567659bd67e05cea":"v1.2.0 (govApproved)","0x03e69d3de5155f4a80da99dd534561cbddd4f9dd56c9ecc704d6886625711d2b":"v1.1.0","0x0398bdd93e2e9313befdf82beb709da6a4daf35ce1abb42d8a998ec9bc1c572e":"v1.0.1","0x037ef3c1a487960b0e633d3e513df020c43432769f41a634d18a9595cbf53c55":"v1.0.0 (govApproved)","0x034c8cc69f22c35ae386a97136715dd48aaf97fd190942a111bfa680c2f2f421":"v0.3.0","0x031e3b504740d0b1264e8cf72b6dde0d497184cfb3f98e451c6be8b33bd3f808":"v0.2.0","0x038942ec840131a63c49fa514a3f0577ae401fd5584d56ad50cdf5a8b41d4538":"v0.1.0","0x03babef4b4c6d866d56e6356d961839fd9475931d11e0ea507420a87b0cadbdd":"v0.0.1"}}]
    }
```

```diff
    contract PermissionedDisputeGame (0xF62c15e2F99d4869A925B8F57076cD85335832A2) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
+++ description: Prestate tag for known prestates.
      values.absolutePrestateDecoded:
+        "v1.4.0 (govApproved)"
      fieldMeta:
+        {"absolutePrestateDecoded":{"description":"Prestate tag for known prestates."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x0386cde2f2b1bde1189ac9c9b7d66774e6260eca778223def326bfe680c14ab9":"v1.4.1-rc.2 (cannon64)","0x03045fd433fb5391c40751939d7cb5e9dfe83cf156f9395566a311e7fe9d3aa2":"v1.4.1-rc.2","0x03b7eaa4e3cbce90381921a4b48008f4769871d64f93d113fcadca08ecee503b":"v1.4.0 (cannon64)","0x03f89406817db1ed7fd8b31e13300444652cdb0b9c509a674de43483b2f83568":"v1.4.0 (govApproved)","0x0348ce2059f718af75729c2c56860551b46b665956a641b3cb2cd51e50b7b725":"v1.4.0-rc.2 (cannon64)","0x0364e4e72922e7d649338f558f8a14b50ca31922a1484e73ea03987fb1516095":"v1.4.0-rc.2","0x032e5d6119ee983cb87deae3eef16ea6086f2347433c99f1820d60f36a24a6e6":"v1.4.0-rc.1 (cannon64)","0x03925193e3e89f87835bbdf3a813f60b2aa818a36bbe71cd5d8fd7e79f5e8afe":"v1.4.0-rc.1","0x03c50b9fd04bdadc228205f340767bbf2d01a030aec39903120d3559d94bb8cc":"v1.3.1-ink","0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c":"v1.3.1 (govApproved)","0x03e806a2859a875267a563462a06d4d1d1b455a9efee959a46e21e54b6caf69a":"v1.3.1-rc.1","0x030de10d9da911a2b180ecfae2aeaba8758961fc28262ce989458c6f9a547922":"v1.3.0-rc.3","0x0385c3f8ee78491001d92b90b07d0cf387b7b52ab9b83b4d87c994e92cf823ba":"v1.3.0-rc.2","0x0367c4aa897bffbded0b523f277ca892298dc3c691baf37bc2099b86024f9673":"v1.3.0-rc.1","0x03617abec0b255dc7fc7a0513a2c2220140a1dcd7a1c8eca567659bd67e05cea":"v1.2.0 (govApproved)","0x03e69d3de5155f4a80da99dd534561cbddd4f9dd56c9ecc704d6886625711d2b":"v1.1.0","0x0398bdd93e2e9313befdf82beb709da6a4daf35ce1abb42d8a998ec9bc1c572e":"v1.0.1","0x037ef3c1a487960b0e633d3e513df020c43432769f41a634d18a9595cbf53c55":"v1.0.0 (govApproved)","0x034c8cc69f22c35ae386a97136715dd48aaf97fd190942a111bfa680c2f2f421":"v0.3.0","0x031e3b504740d0b1264e8cf72b6dde0d497184cfb3f98e451c6be8b33bd3f808":"v0.2.0","0x038942ec840131a63c49fa514a3f0577ae401fd5584d56ad50cdf5a8b41d4538":"v0.1.0","0x03babef4b4c6d866d56e6356d961839fd9475931d11e0ea507420a87b0cadbdd":"v0.0.1"}}]
    }
```

Generated with discovered.json: 0x866814316f0b8d05b0e46326753663375d715b3e

# Diff at Wed, 15 Jan 2025 07:37:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21585153
- current block number: 21628432

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21585153 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x8162b70f249c2ffb273240611d6848b12ba7114e

# Diff at Thu, 09 Jan 2025 06:32:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edc6acaed84d40aabd5185e0a0b5ebaf1c90143b block: 21573134
- current block number: 21585153

## Description

Note: The PermissionedDisputeGame and FaultDisputeGame contracts are not identical to the ones used by OP mainnet (minor changes).

New MIPS, PermissionedDisputeGame, FaultDisputeGame contracts.

- interop: add `hashL2toL2CrossDomainMessage()` and `_dependencySet` (in 'encoding' and 'hashing' libraries)
- formatting and doc changes
- removal of interfaces (IDisputeGame, IFaultDisputeGame)
- no changes in DelayedWETH

### MIPS

Refactor: [64bit architecture and multithreading support](https://github.com/ethereum-optimism/docs/issues/1066).

## Watched changes

```diff
-   Status: DELETED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0x19009dEBF8954B610f207D5925EEDe827805986e)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
    contract DisputeGameFactory (0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.gameImpls.1:
-        "0x19009dEBF8954B610f207D5925EEDe827805986e"
+        "0xF62c15e2F99d4869A925B8F57076cD85335832A2"
      values.gameImpls.0:
-        "0xCd3c0194db74C23807D4B90A5181e1B28cF7007C"
+        "0xc5f3677c3C56DB4031ab005a3C9c98e1B79D438e"
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0xCd3c0194db74C23807D4B90A5181e1B28cF7007C)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xc5f3677c3C56DB4031ab005a3C9c98e1B79D438e)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xF62c15e2F99d4869A925B8F57076cD85335832A2)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

## Source code changes

```diff
.../{.flat@21573134 => .flat}/FaultDisputeGame.sol | 601 +++++++++++---------
 .../ethereum/{.flat@21573134 => .flat}/MIPS.sol    | 444 +++++++++++----
 .../PermissionedDisputeGame.sol                    | 623 ++++++++++++---------
 3 files changed, 1009 insertions(+), 659 deletions(-)
```

Generated with discovered.json: 0x374c33b6877ee2614be249fc8b8cbe8105b4f807

# Diff at Wed, 08 Jan 2025 08:58:35 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21573134
- current block number: 21573134

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21573134 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x9bb8d6009e9f1a4109085ffc2c21b7eab10d0e29

# Diff at Tue, 07 Jan 2025 14:18:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9139908c611ea9cf6755f22c4be71ff58d7dc547 block: 21388295
- current block number: 21573134

## Description

Add sky / maker USDS escrow (canonical external).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21388295 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract Escrow (0x7F311a4D48377030bD810395f4CCfC03bdbe9Ef3)
    +++ description: None
```

Generated with discovered.json: 0x53bf656cb3e16e506d5d5788ac81e19d0e034b8f

# Diff at Thu, 12 Dec 2024 18:44:40 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@7ee1eeff66f101a0fdb632c7f8a847f7231b20b7 block: 21235652
- current block number: 21388295

## Description

Upgraded to new config version with 400m gas limit.
Gas limit goes against current OP Stack gas limit specification, which states the gas limit may not be set to a value larger than 200m (https://specs.optimism.io/protocol/system-config.html#gaslimit-uint64).

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xbbb92920a096eced30e3ce67bbc443f134b217e8847433fbb192ecb9fdddcbc2"
+        "0x1fdf490a723dc133305fa86c7ce08d98470bf7c9de74ece4ef8bc280d2355d50"
      values.$implementation:
-        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
+        "0x45C4e267aE21E90f72C8AbF43ddB5941c953482F"
      values.$pastUpgrades.5:
+        ["2024-12-11T23:00:59.000Z","0x1fdbb2443b479fedc7a6e43400a5f09c883aa00d3e7b40bc7238a08e43625294",["0x45C4e267aE21E90f72C8AbF43ddB5941c953482F"]]
      values.$upgradeCount:
-        5
+        6
      values.maximumGasLimit:
-        200000000
+        400000000
      values.version:
-        "2.2.0"
+        "2.2.0+max-gas-limit-400M"
    }
```

## Source code changes

```diff
.../{.flat@21235652 => .flat}/SystemConfig/SystemConfig.sol         | 6 +++---
 1 file changed, 3 insertions(+), 3 deletions(-)
```

Generated with discovered.json: 0xc322ae7a01d53cc98b9f8e28ad3ac6c78adc9bfd

# Diff at Tue, 19 Nov 2024 12:58:27 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@4c4fda2e697ffddc3e55c5773edb75671d0818a1 block: 21098564
- current block number: 21221926

## Description

Multisig renaming.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21098564 (main branch discovery), not current.

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      name:
-        "OptimismFoundationMultisig_1"
+        "OpFoundationUpgradeSafe"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      name:
-        "OptimismFoundationMultisig_2"
+        "OpFoundationOperationsSafe"
    }
```

Generated with discovered.json: 0xfd48d3e8dc6707d3fa398c9807223d7d1b636fbf

# Diff at Sat, 02 Nov 2024 07:48:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@93f317513d51e26ce3003e34f6a9147b7f41eb7a block: 21092647
- current block number: 21098564

## Description

CommonAddresses rename.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21092647 (main branch discovery), not current.

```diff
    contract OptimismFoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      name:
-        "FoundationMultisig_1"
+        "OptimismFoundationMultisig_1"
    }
```

```diff
    contract OptimismFoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      name:
-        "FoundationMultisig_2"
+        "OptimismFoundationMultisig_2"
    }
```

Generated with discovered.json: 0x7feb00a0bbf6b6c82ba533b4e5f2a5465a20754e

# Diff at Fri, 01 Nov 2024 11:59:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21086252
- current block number: 21092647

## Description

Config related (shape template changes).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21086252 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: None
      directlyReceivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame.
      description:
-        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the FaultDisputeGame."
      values.RespectedGameString:
+        "FaultDisputeGame"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame"}}]
    }
```

```diff
    contract BaseAdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: None
      receivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x45b950ab298a302d19a6e1345fe3a1b9c671988b

# Diff at Thu, 31 Oct 2024 14:35:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f409157dbd8c6fad51290f20e7bd5692f0556969 block: 20941326
- current block number: 21086252

## Description

Fault proofs upgrade: The dispute game contracts use the OP Mainnet implementations and identical parameters. Base risks are now like OP Mainnet except for upgradeability (Exit Window) because there is no SecurityCouncil. A proper Security Council and according upgrade delay are also the only requirements for Base to reach stage 1.

## Watched changes

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions.1:
-        {"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]}
      receivedPermissions.0.target:
-        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","target":"0xdB9091e48B1C42992A1213e6916184f9eBDbfEDf"}
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","target":"0xa2f2aC6F5aF72e494A227d79Db20473Cf7A1FFE8"}
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","target":"0x73a79Fab69143498Ed3712e519A88a918e1f4072"}
      directlyReceivedPermissions.6.target:
-        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
+        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
      directlyReceivedPermissions.5.target:
-        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
+        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
      directlyReceivedPermissions.4.target:
-        "0x56315b90c40730925ec5485cf004d835058518A0"
+        "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e"
      directlyReceivedPermissions.3.target:
-        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
+        "0x3E8a0B63f57e975c268d610ece93da5f78c01321"
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.1:
-        {"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}
      directlyReceivedPermissions.0.target:
-        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"configure","target":"0x73a79Fab69143498Ed3712e519A88a918e1f4072","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."}
      receivedPermissions.0.permission:
-        "challenge"
+        "configure"
      receivedPermissions.0.target:
-        "0x56315b90c40730925ec5485cf004d835058518A0"
+        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
      receivedPermissions.0.via:
-        [{"address":"0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824"}]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      directlyReceivedPermissions:
-        [{"permission":"act","target":"0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824"}]
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals.
      template:
-        "opstack/OptimismPortal"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
+        "0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals."
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}]}
      issuedPermissions.2:
-        {"permission":"guard","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}]}
      issuedPermissions.1:
-        {"permission":"guard","target":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","delay":0},{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}]}
      issuedPermissions.0.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.0.target:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.1:
-        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
      values.$implementation:
-        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
+        "0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.4:
+        ["2024-10-30T15:41:23.000Z","0x2476bda1e2cc0f2a501876532cacf1d267fc9be8f07271b75e512e3b6c927639",["0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$pastUpgrades.3:
+        ["2024-10-30T15:41:23.000Z","0x2476bda1e2cc0f2a501876532cacf1d267fc9be8f07271b75e512e3b6c927639",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        3
+        5
      values.GUARDIAN:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.L2_ORACLE:
-        "0x56315b90c40730925ec5485cf004d835058518A0"
      values.l2Oracle:
-        "0x56315b90c40730925ec5485cf004d835058518A0"
      values.SYSTEM_CONFIG:
-        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
      values.version:
-        "2.5.0"
+        "3.10.0"
      values.disputeGameFactory:
+        "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e"
      values.disputeGameFinalityDelaySeconds:
+        302400
      values.proofMaturityDelaySeconds:
+        604800
      values.respectedGameType:
+        0
      values.respectedGameTypeUpdatedAt:
+        1730302883
      derivedName:
-        "OptimismPortal"
+        "OptimismPortal2"
      fieldMeta:
+        {"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
    }
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
-   Status: DELETED
    contract Challenger1of2 (0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824)
    +++ description: None
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"
+        "0xbbb92920a096eced30e3ce67bbc443f134b217e8847433fbb192ecb9fdddcbc2"
      values.$implementation:
-        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
+        "0xF56D96B2535B932656d3c04Ebf51baBff241D886"
      values.$pastUpgrades.4:
+        ["2024-10-30T15:41:23.000Z","0x2476bda1e2cc0f2a501876532cacf1d267fc9be8f07271b75e512e3b6c927639",["0xF56D96B2535B932656d3c04Ebf51baBff241D886"]]
      values.$pastUpgrades.3:
+        ["2024-10-30T15:41:23.000Z","0x2476bda1e2cc0f2a501876532cacf1d267fc9be8f07271b75e512e3b6c927639",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        3
+        5
      values.L2_OUTPUT_ORACLE_SLOT:
-        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
-        "0x56315b90c40730925ec5485cf004d835058518A0"
      values.version:
-        "1.12.0"
+        "2.2.0"
      values.DISPUTE_GAME_FACTORY_SLOT:
+        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.disputeGameFactory:
+        "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e"
      values.maximumGasLimit:
+        200000000
    }
```

```diff
    contract BaseAdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: None
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xdB9091e48B1C42992A1213e6916184f9eBDbfEDf","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xa2f2aC6F5aF72e494A227d79Db20473Cf7A1FFE8","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x73a79Fab69143498Ed3712e519A88a918e1f4072","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"}]}
      receivedPermissions.6.target:
-        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
+        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
      receivedPermissions.5.target:
-        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
+        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
      receivedPermissions.4.target:
-        "0x56315b90c40730925ec5485cf004d835058518A0"
+        "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e"
      receivedPermissions.3.target:
-        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
+        "0x3E8a0B63f57e975c268d610ece93da5f78c01321"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]}
      receivedPermissions.1:
-        {"permission":"guard","target":"0x49048044D57e1C92A77f79988d21Fa8fAF74E97e","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]}
      receivedPermissions.0.permission:
-        "challenge"
+        "guard"
      receivedPermissions.0.target:
-        "0x56315b90c40730925ec5485cf004d835058518A0"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.via.1:
+        {"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}
      receivedPermissions.0.via.0.address:
-        "0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      directlyReceivedPermissions.1:
-        {"permission":"act","target":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}
      directlyReceivedPermissions.0.target:
-        "0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]}
      receivedPermissions.0.target:
-        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
+   Status: CREATED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x19009dEBF8954B610f207D5925EEDe827805986e)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DelayedWETH_PermissionedGames (0x3E8a0B63f57e975c268d610ece93da5f78c01321)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH_PermissionlessGames (0xa2f2aC6F5aF72e494A227d79Db20473Cf7A1FFE8)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xCd3c0194db74C23807D4B90A5181e1B28cF7007C)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xdB9091e48B1C42992A1213e6916184f9eBDbfEDf)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

## Source code changes

```diff
.../AnchorStateRegistry/AnchorStateRegistry.sol    |  448 +++
 .../ethereum/.flat/AnchorStateRegistry/Proxy.p.sol |  200 +
 .../.flat@20941326/Challenger1of2.sol => /dev/null |  299 --
 .../DelayedWETH_PermissionedGames/DelayedWETH.sol  |  651 ++++
 .../DelayedWETH_PermissionedGames/Proxy.p.sol      |  200 +
 .../DelayedWETH.sol                                |  651 ++++
 .../DelayedWETH_PermissionlessGames/Proxy.p.sol    |  200 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1550 ++++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../base/ethereum/.flat/FaultDisputeGame.sol       | 3959 +++++++++++++++++++
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../L2OutputOracle/Proxy.p.sol => /dev/null        |  211 -
 .../null => discovery/base/ethereum/.flat/MIPS.sol | 1517 ++++++++
 .../OptimismPortal/OptimismPortal2.sol}            |  512 ++-
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4074 ++++++++++++++++++++
 .../base/ethereum/.flat/PreimageOracle.sol         | 1353 +++++++
 .../SystemConfig/SystemConfig.sol                  |   48 +-
 17 files changed, 15355 insertions(+), 1397 deletions(-)
```

Generated with discovered.json: 0x933ced072deabf4fc55361a61d965c3db9dd62ef

# Diff at Tue, 29 Oct 2024 13:04:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20941326
- current block number: 20941326

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941326 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x7c8c059bca25f29b19dcdbe53f5f29767adb942a

# Diff at Mon, 21 Oct 2024 12:42:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20941326
- current block number: 20941326

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941326 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      descriptions:
-        ["used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"]
      description:
+        "used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract wstETHEscrow (0x9de443AdC5A411E83F1878Ef24C3F52C61571e72) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      descriptions:
-        ["Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally."]
      description:
+        "Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally."
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      descriptions:
-        ["allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."]
      description:
+        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

Generated with discovered.json: 0x84f12a9f7a867c616474f374a4cbb165993054f5

# Diff at Mon, 21 Oct 2024 11:04:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20941326
- current block number: 20941326

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941326 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.2.2:
+        ["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]
      values.$pastUpgrades.2.1:
-        ["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.0.2:
+        ["0x3d2c2f8f95CAba644eA25319c4c08594b8DC0359"]
      values.$pastUpgrades.0.1:
-        ["0x3d2c2f8f95CAba644eA25319c4c08594b8DC0359"]
+        "0xad5179152fdbe7ca60a41fd5a490add905e567c59e6630a7856a379759939a8e"
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.2.2:
+        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
      values.$pastUpgrades.2.1:
-        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.0.2:
+        ["0x5FB30336A8d0841cf15d452afA297cB6D10877D7"]
      values.$pastUpgrades.0.1:
-        ["0x5FB30336A8d0841cf15d452afA297cB6D10877D7"]
+        "0xad5179152fdbe7ca60a41fd5a490add905e567c59e6630a7856a379759939a8e"
    }
```

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.3.2:
+        ["0xF243BEd163251380e78068d317ae10f26042B292"]
      values.$pastUpgrades.3.1:
-        ["0xF243BEd163251380e78068d317ae10f26042B292"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.2.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.2.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.1.2:
+        ["0xf2460D3433475C8008ceFfe8283F07EB1447E39a"]
      values.$pastUpgrades.1.1:
-        ["0xf2460D3433475C8008ceFfe8283F07EB1447E39a"]
+        "0xb9c57e888d31644af161cd5766236250977ef94ecff01d26e47ec10255777059"
      values.$pastUpgrades.0.2:
+        ["0x7237343c2A746Aa2940E5E4Fbd53eaFBF3049DcA"]
      values.$pastUpgrades.0.1:
-        ["0x7237343c2A746Aa2940E5E4Fbd53eaFBF3049DcA"]
+        "0xad5179152fdbe7ca60a41fd5a490add905e567c59e6630a7856a379759939a8e"
    }
```

```diff
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.2.2:
+        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
      values.$pastUpgrades.2.1:
-        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.0.2:
+        ["0x3311aC7F72bb4108d9f4D5d50E7623B1498A9eC0"]
      values.$pastUpgrades.0.1:
-        ["0x3311aC7F72bb4108d9f4D5d50E7623B1498A9eC0"]
+        "0xad5179152fdbe7ca60a41fd5a490add905e567c59e6630a7856a379759939a8e"
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.2.2:
+        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
      values.$pastUpgrades.2.1:
-        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.0.2:
+        ["0x6481ff79597Fe4F77E1063f615ec5BDaDDEFfd4B"]
      values.$pastUpgrades.0.1:
-        ["0x6481ff79597Fe4F77E1063f615ec5BDaDDEFfd4B"]
+        "0x0a7442e325dac626d8c16a7a052e9a2ee8cd08a5b8c9796228b4d297e20ea3cc"
    }
```

```diff
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.3.2:
+        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
      values.$pastUpgrades.3.1:
-        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.2.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.2.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xb690dad4829ca8b07b6944d7e937d7d36048ea29a9278cbae012ab4a66aac817"
      values.$pastUpgrades.1.2:
+        ["0x81C4Bd600793EBd1C0323604E1F455fE50A951F8"]
      values.$pastUpgrades.1.1:
-        ["0x81C4Bd600793EBd1C0323604E1F455fE50A951F8"]
+        "0xad5179152fdbe7ca60a41fd5a490add905e567c59e6630a7856a379759939a8e"
      values.$pastUpgrades.0.2:
+        ["0x0000000000000000000000000000000000000000"]
      values.$pastUpgrades.0.1:
-        ["0x0000000000000000000000000000000000000000"]
+        "0x8869b94ddd0ba84b41d937708db7b8aa64948e85b3a11e970f22887a56b0b1d7"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.2.2:
+        ["0x53c165169401764778F780a69701385eb0FF19B7"]
      values.$pastUpgrades.2.1:
-        ["0x53c165169401764778F780a69701385eb0FF19B7"]
+        "0xe361c0d4ae3aebc94b3f281ee372fbb1cbdb0c33ca8b1b35e7f3b009b2fcbdb0"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xe361c0d4ae3aebc94b3f281ee372fbb1cbdb0c33ca8b1b35e7f3b009b2fcbdb0"
      values.$pastUpgrades.0.2:
+        ["0x53c165169401764778F780a69701385eb0FF19B7"]
      values.$pastUpgrades.0.1:
-        ["0x53c165169401764778F780a69701385eb0FF19B7"]
+        "0x8ba0e42b89cde22310b644ed30fd44e4a348619a165a54c908e7dc341e9bbd0c"
    }
```

```diff
    contract wstETHEscrow (0x9de443AdC5A411E83F1878Ef24C3F52C61571e72) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      values.$pastUpgrades.0.2:
+        ["0x313819736457910aC1Dd21a712a37f3d7595645A"]
      values.$pastUpgrades.0.1:
-        ["0x313819736457910aC1Dd21a712a37f3d7595645A"]
+        "0xac8580fdfdbb35af667cf9c5c5fa9d10c793486d10fcbea538efd9386b04c106"
    }
```

Generated with discovered.json: 0xd68a92d3de07c60fe6f21315d4cbbea84cafb5f4

# Diff at Fri, 18 Oct 2024 11:34:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8bd58d38d84243da335cc86dc9fccafce6e4a0a9 block: 20941326
- current block number: 20941326

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941326 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions:
+        [{"permission":"guard","target":"0x49048044D57e1C92A77f79988d21Fa8fAF74E97e","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]},{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}]}
      issuedPermissions.2:
+        {"permission":"guard","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.1.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      issuedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}]}
      issuedPermissions.2:
+        {"permission":"guard","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.1.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      issuedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]}
      receivedPermissions.1:
+        {"permission":"guard","target":"0x49048044D57e1C92A77f79988d21Fa8fAF74E97e","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]}
      directlyReceivedPermissions.1:
+        {"permission":"act","target":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]
    }
```

Generated with discovered.json: 0xf1689ceeea80ce01f45838b3c6b3c1e9b1738ae6

# Diff at Wed, 16 Oct 2024 11:35:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20941326
- current block number: 20941326

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941326 (main branch discovery), not current.

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      roles:
-        ["Guardian"]
      directlyReceivedPermissions:
+        [{"permission":"guard","target":"0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"},{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
    }
```

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"configure","target":"0x73a79Fab69143498Ed3712e519A88a918e1f4072","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."}
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
+        "0x56315b90c40730925ec5485cf004d835058518A0"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.0.via:
+        [{"address":"0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824"}]
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}]}
      issuedPermissions.2:
+        {"permission":"propose","target":"0x642229f238fb9dE03374Be34B0eD8D9De80752c5","via":[]}
      issuedPermissions.1:
+        {"permission":"challenge","target":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[{"address":"0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
+        "0x14536667Cd30e52C0b458BaACcB9faDA7046E056"
      issuedPermissions.0.via.0.address:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
+        "0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824"
    }
```

```diff
    contract Challenger1of2 (0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824) {
    +++ description: None
      roles:
-        ["Challenger"]
      directlyReceivedPermissions:
+        [{"permission":"challenge","target":"0x56315b90c40730925ec5485cf004d835058518A0"}]
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
+        "0x5050F69a9786F081509234F1a7F4684b5E5b76C9"
      issuedPermissions.1.via.0:
-        {"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"challenge","target":"0x56315b90c40730925ec5485cf004d835058518A0","via":[{"address":"0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824"}]}]
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","target":"0x49048044D57e1C92A77f79988d21Fa8fAF74E97e","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]}]
    }
```

Generated with discovered.json: 0x0838e0c759799ca9929e486370bb0bee37e2864a

# Diff at Mon, 14 Oct 2024 10:49:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20941326
- current block number: 20941326

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941326 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sourceHashes:
+        ["0x998654cb64c7fc216505bdb3322b20e7d7c95704005228ad1f878bc631c4af8d"]
    }
```

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      sourceHashes:
+        ["0xe771f3d1c51456e08e2c93a904b12010870dc4fa79ee82e4bc90433557931f05"]
    }
```

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract Challenger1of2 (0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824) {
    +++ description: None
      sourceHashes:
+        ["0xb454745206bc5cace3c49dc78acf2be6af8602f7cf48f15a340a0ce854317389"]
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract BaseAdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract BaseMultisig1 (0x9855054731540A48b28990B63DcF4f33d8AE46A1) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0x263aadde480629cd3ca5704cc7d4e7df809d437e68f8d9864039801ddf820367"]
    }
```

```diff
    contract wstETHEscrow (0x9de443AdC5A411E83F1878Ef24C3F52C61571e72) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      sourceHashes:
+        ["0x698ae88793265d087e07a445b69bf16b450cdcf636b9073b86221936e912a135","0xc4b0423b7d0fcada3862027e805c2fc79676feb6f4bc3978e5a86b390bfd7be3"]
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      sourceHashes:
+        ["0x9624d67fb3738cf1ce1e1f48e2cf433e9373345386943d12f1d751d6b8475cd6"]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xe5211497d15a7ea75577cf992ab6093dd0f6083f45c955f0136737810e44c205"]
    }
```

Generated with discovered.json: 0x6757674a13dfee574f8810059dcd95149c32bb2f

# Diff at Wed, 09 Oct 2024 13:07:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20891458
- current block number: 20928224

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20891458 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      name:
-        "GuardianMultisig"
+        "SuperchainGuardianMultisig"
    }
```

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824"}]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract Challenger1of2 (0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824) {
    +++ description: None
      template:
+        "base/Challenger1of2"
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
+        144000000
    }
```

```diff
    contract BaseAdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: None
      name:
-        "AdminMultisig"
+        "BaseAdminMultisig"
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract BaseMultisig1 (0x9855054731540A48b28990B63DcF4f33d8AE46A1) {
    +++ description: None
      name:
-        "BaseMultisig"
+        "BaseMultisig1"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824"}]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      displayName:
+        "AddressManager"
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x0ccc6b74d8d609f5e08581f2fd25e7b41ebbbec5

# Diff at Tue, 08 Oct 2024 16:22:53 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 20891458
- current block number: 20891458

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20891458 (main branch discovery), not current.

```diff
    contract wstETHEscrow (0x9de443AdC5A411E83F1878Ef24C3F52C61571e72) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      template:
+        "lido/L1ERC20TokenBridge"
      displayName:
+        "L1ERC20TokenBridge"
      descriptions:
+        ["Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally."]
    }
```

Generated with discovered.json: 0x81c5b77a9469a833f970d22d1bc8999b9814ca41

# Diff at Fri, 04 Oct 2024 10:08:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@000446ee962492b0a3a917c3f907d3277663f719 block: 20878339
- current block number: 20891458

## Description

Weekly gaslimit raise.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878339 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        132000000
    }
```

Generated with discovered.json: 0x2ae125c5616d635ebb58c74568bb9a25ff7e27b8

# Diff at Wed, 02 Oct 2024 14:14:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871599
- current block number: 20878339

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871599 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2023-06-15T01:51:59.000Z",["0x3d2c2f8f95CAba644eA25319c4c08594b8DC0359"]],["2024-06-28T16:32:47.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-28T16:32:47.000Z",["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]]
    }
```

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2023-06-15T01:51:59.000Z",["0x5FB30336A8d0841cf15d452afA297cB6D10877D7"]],["2024-06-28T16:32:47.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-28T16:32:47.000Z",["0x2D778797049FE9259d947D1ED8e5442226dFB589"]]]
    }
```

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2023-06-15T01:51:59.000Z",["0x7237343c2A746Aa2940E5E4Fbd53eaFBF3049DcA"]],["2023-07-25T19:44:11.000Z",["0xf2460D3433475C8008ceFfe8283F07EB1447E39a"]],["2024-06-28T16:32:47.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-28T16:32:47.000Z",["0xF243BEd163251380e78068d317ae10f26042B292"]]]
    }
```

```diff
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2023-06-15T01:51:59.000Z",["0x3311aC7F72bb4108d9f4D5d50E7623B1498A9eC0"]],["2024-06-28T16:32:47.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-28T16:32:47.000Z",["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]]
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2023-06-15T01:51:47.000Z",["0x6481ff79597Fe4F77E1063f615ec5BDaDDEFfd4B"]],["2024-06-28T16:32:47.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-28T16:32:47.000Z",["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2023-06-15T01:51:47.000Z",["0x0000000000000000000000000000000000000000"]],["2023-06-15T01:51:59.000Z",["0x81C4Bd600793EBd1C0323604E1F455fE50A951F8"]],["2024-06-28T16:32:47.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-28T16:32:47.000Z",["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]]
      values.$upgradeCount:
+        4
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-01-22T20:19:59.000Z",["0x53c165169401764778F780a69701385eb0FF19B7"]],["2024-06-10T18:29:23.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-10T18:29:23.000Z",["0x53c165169401764778F780a69701385eb0FF19B7"]]]
    }
```

```diff
    contract wstETHEscrow (0x9de443AdC5A411E83F1878Ef24C3F52C61571e72) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-28T21:08:35.000Z",["0x313819736457910aC1Dd21a712a37f3d7595645A"]]]
    }
```

Generated with discovered.json: 0x6d175955ef4edc050319a0ba16d6d9c17491eff8

# Diff at Thu, 26 Sep 2024 06:19:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@374d77799a44e3b2fcc4828675ccc0b0ff6146d0 block: 20769544
- current block number: 20832945

## Description

Scheduled gas limit raise.

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        120000000
+        132000000
    }
```

Generated with discovered.json: 0x79d67cff869a648204c6809f70c66208c90ece52

# Diff at Tue, 17 Sep 2024 09:51:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a17234c1dfeb209a9842df2b454c07e2b8da435d block: 20532565
- current block number: 20769544

## Description

DeputyGuardianModule upgrade: `setAnchorState()` is now callable by the deputy guardian.

## Watched changes

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.GnosisSafe_modules.0:
-        "0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

## Source code changes

```diff
.../DeputyGuardianModule.sol                         | 20 ++++++++++++++++++--
 1 file changed, 18 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x367dae5559aa723af3f65b0cf25925b26e3d5c91

# Diff at Sun, 08 Sep 2024 17:24:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20532565
- current block number: 20532565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532565 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2"},{"permission":"upgrade","target":"0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84"},{"permission":"upgrade","target":"0x3154Cf16ccdb4C6d922629664174b904d80F2C35"},{"permission":"upgrade","target":"0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"},{"permission":"upgrade","target":"0x56315b90c40730925ec5485cf004d835058518A0"},{"permission":"upgrade","target":"0x608d94945A64503E642E6370Ec598e519a2C1E53"},{"permission":"upgrade","target":"0x73a79Fab69143498Ed3712e519A88a918e1f4072"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2"},{"permission":"upgrade","target":"0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84"},{"permission":"upgrade","target":"0x3154Cf16ccdb4C6d922629664174b904d80F2C35","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"},{"permission":"upgrade","target":"0x56315b90c40730925ec5485cf004d835058518A0"},{"permission":"upgrade","target":"0x608d94945A64503E642E6370Ec598e519a2C1E53"},{"permission":"upgrade","target":"0x73a79Fab69143498Ed3712e519A88a918e1f4072"}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0:
+        {"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}
    }
```

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      descriptions:
-        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      descriptions:
-        ["Liveness Guard of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - used to remove members inactive for 98d."]
    }
```

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0:
+        {"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0:
+        {"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
    }
```

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0:
+        {"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."]
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.via:
+        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
    }
```

```diff
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      descriptions.0:
-        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A (the deputy guardian) to act on behalf of the Gnosis Safe."
+        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
    }
```

```diff
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0:
+        {"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.1.via.0:
+        {"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}
    }
```

```diff
    contract AdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E, inheriting its permissions."]
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x73a79Fab69143498Ed3712e519A88a918e1f4072","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x608d94945A64503E642E6370Ec598e519a2C1E53","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x56315b90c40730925ec5485cf004d835058518A0","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x49048044D57e1C92A77f79988d21Fa8fAF74E97e","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x3154Cf16ccdb4C6d922629664174b904d80F2C35","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84","via":[{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"}]}
      receivedPermissions.0.target:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
+        "0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2"
      receivedPermissions.0.via:
+        [{"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"}]
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      descriptions:
-        ["Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8."]
    }
```

```diff
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"
+        "0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c"
      issuedPermissions.0.via.0:
+        {"address":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      descriptions:
-        ["Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2."]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

Generated with discovered.json: 0x35332a90618dc477bb35a6380f1733479a064446

# Diff at Fri, 30 Aug 2024 07:51:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20532565
- current block number: 20532565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532565 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract AdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: It can act on behalf of 0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x6360b4045dd7e619caf36b08a4f38148c6156eee

# Diff at Fri, 23 Aug 2024 09:51:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20532565
- current block number: 20532565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532565 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        4
    }
```

```diff
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract wstETHEscrow (0x9de443AdC5A411E83F1878Ef24C3F52C61571e72) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xdbd10e9e5ac120384ca9b7a9f85a9821d8d67418

# Diff at Wed, 21 Aug 2024 10:02:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20532565
- current block number: 20532565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532565 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84","0x3154Cf16ccdb4C6d922629664174b904d80F2C35","0x49048044D57e1C92A77f79988d21Fa8fAF74E97e","0x56315b90c40730925ec5485cf004d835058518A0","0x608d94945A64503E642E6370Ec598e519a2C1E53","0x73a79Fab69143498Ed3712e519A88a918e1f4072"],"configure":["0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2","via":[]},{"permission":"upgrade","target":"0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84","via":[]},{"permission":"upgrade","target":"0x3154Cf16ccdb4C6d922629664174b904d80F2C35","via":[]},{"permission":"upgrade","target":"0x49048044D57e1C92A77f79988d21Fa8fAF74E97e","via":[]},{"permission":"upgrade","target":"0x56315b90c40730925ec5485cf004d835058518A0","via":[]},{"permission":"upgrade","target":"0x608d94945A64503E642E6370Ec598e519a2C1E53","via":[]},{"permission":"upgrade","target":"0x73a79Fab69143498Ed3712e519A88a918e1f4072","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","via":[]}]
    }
```

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0x73a79Fab69143498Ed3712e519A88a918e1f4072"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x73a79Fab69143498Ed3712e519A88a918e1f4072","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"],"configure":["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F","via":[]},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","via":[]}]
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0x14536667Cd30e52C0b458BaACcB9faDA7046E056","via":[]},{"permission":"upgrade","target":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","via":[]}]
    }
```

```diff
    contract AdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: It can act on behalf of 0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","via":[]}]
    }
```

```diff
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

Generated with discovered.json: 0x03acf1b829bc4f7b7baff42e9a54638b791fc854

# Diff at Thu, 15 Aug 2024 07:34:38 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9a07aead4b3726cc622f66fe9a15e06e63af7acd block: 20432677
- current block number: 20532565

## Description

The Base Multisig (that can challenge state roots and is owner of SystemConfig) has two new members.

## Watched changes

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      values.$members.10:
+        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
      values.$members.9:
+        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
      values.$members.8:
-        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
+        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
      values.$members.7:
-        "0xBECAbd620cb6675f73C92bc444F7faCddf204DE2"
+        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
      values.$members.6:
-        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
+        "0xa3D3c103442F162856163d564b983ae538c6202D"
      values.$members.5:
-        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
+        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
      values.$members.4:
-        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
+        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
      values.$members.3:
-        "0xa3D3c103442F162856163d564b983ae538c6202D"
+        "0x73565876170a336Fa02fDe34EeD03E3121f70bA6"
      values.$members.2:
-        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
+        "0x26c72586FB396325F58718152FEFA94E93Cf177b"
      values.$members.1:
-        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
+        "0x5468985B560D966dEDEa2DAF493f5756101137DC"
      values.$members.0:
-        "0x73565876170a336Fa02fDe34EeD03E3121f70bA6"
+        "0xe32868ec7762650DdE723e945D638A05900974F4"
      values.multisigThreshold:
-        "3 of 9 (33%)"
+        "3 of 11 (27%)"
    }
```

Generated with discovered.json: 0xa8fa1a17573e2bd744b5118a0a99ffdbfb6d5a0c

# Diff at Fri, 09 Aug 2024 11:58:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20432677
- current block number: 20432677

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432677 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.5:
-        "0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84"
+        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
      assignedPermissions.upgrade.4:
-        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
+        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
      assignedPermissions.upgrade.0:
-        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
+        "0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84"
    }
```

Generated with discovered.json: 0xffe5fa5a7aba5fd0d7198c983e203e2cd7e72d7f

# Diff at Fri, 09 Aug 2024 10:08:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20432677
- current block number: 20432677

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432677 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84","0x3154Cf16ccdb4C6d922629664174b904d80F2C35","0x49048044D57e1C92A77f79988d21Fa8fAF74E97e","0x56315b90c40730925ec5485cf004d835058518A0","0x608d94945A64503E642E6370Ec598e519a2C1E53","0x73a79Fab69143498Ed3712e519A88a918e1f4072"]
      assignedPermissions.owner:
-        ["0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2"]
      assignedPermissions.upgrade:
+        ["0x608d94945A64503E642E6370Ec598e519a2C1E53","0x3154Cf16ccdb4C6d922629664174b904d80F2C35","0x49048044D57e1C92A77f79988d21Fa8fAF74E97e","0x56315b90c40730925ec5485cf004d835058518A0","0x73a79Fab69143498Ed3712e519A88a918e1f4072","0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84"]
      assignedPermissions.configure:
+        ["0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2"]
    }
```

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0x73a79Fab69143498Ed3712e519A88a918e1f4072"]
      assignedPermissions.configure:
+        ["0x73a79Fab69143498Ed3712e519A88a918e1f4072"]
      values.$multisigThreshold:
-        "3 of 9 (33%)"
      values.getOwners:
-        ["0x73565876170a336Fa02fDe34EeD03E3121f70bA6","0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447","0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04","0xa3D3c103442F162856163d564b983ae538c6202D","0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F","0x969ffD102fbF304d4e401999333FE9397DaC653D","0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18","0xBECAbd620cb6675f73C92bc444F7faCddf204DE2","0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x73565876170a336Fa02fDe34EeD03E3121f70bA6","0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447","0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04","0xa3D3c103442F162856163d564b983ae538c6202D","0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F","0x969ffD102fbF304d4e401999333FE9397DaC653D","0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18","0xBECAbd620cb6675f73C92bc444F7faCddf204DE2","0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 9 (33%)"
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"]
      assignedPermissions.owner:
-        ["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]
      assignedPermissions.upgrade:
+        ["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"]
      assignedPermissions.configure:
+        ["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]
      assignedPermissions.configure:
+        ["0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract AdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: It can act on behalf of 0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"]
      assignedPermissions.configure:
+        ["0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E"]
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0x9855054731540A48b28990B63DcF4f33d8AE46A1","0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x9855054731540A48b28990B63DcF4f33d8AE46A1","0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8.
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract BaseMultisig (0x9855054731540A48b28990B63DcF4f33d8AE46A1) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0x6CD3850756b7894774Ab715D136F9dD02837De50","0x3cd692eCE8b6573A2220ae00d0dEb98f0DfFA9a1","0x5FbEFA105bbd53b43bf537Cbc5cD30804Dd0c993","0x3Dad2200849925Bb46d9bF05aFa5f7F213F4c18E","0xB011a32ED8b4F70D9943A2199F539bbeCd7b62F7","0xf9e320f3dA12E68af219d9E2A490Dd649f6B177c"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x6CD3850756b7894774Ab715D136F9dD02837De50","0x3cd692eCE8b6573A2220ae00d0dEb98f0DfFA9a1","0x5FbEFA105bbd53b43bf537Cbc5cD30804Dd0c993","0x3Dad2200849925Bb46d9bF05aFa5f7F213F4c18E","0xB011a32ED8b4F70D9943A2199F539bbeCd7b62F7","0xf9e320f3dA12E68af219d9E2A490Dd649f6B177c"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2.
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$multisigThreshold:
-        "10 of 13 (77%)"
      values.getOwners:
-        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.getThreshold:
-        10
      values.$members:
+        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.$threshold:
+        10
      values.multisigThreshold:
+        "10 of 13 (77%)"
    }
```

Generated with discovered.json: 0xebdc444c5d7de73b961bedf1c76433c6f5b4fb9c

# Diff at Thu, 01 Aug 2024 09:03:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@295430f331b68784c13ccda9222bc78df1e833c5 block: 20389614
- current block number: 20432677

## Description

Gas limit raised.

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        112500000
+        120000000
    }
```

Generated with discovered.json: 0x4490b2aef6ef07052b52e81d0edadcea693677cd

# Diff at Tue, 30 Jul 2024 11:11:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20389614
- current block number: 20389614

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389614 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0xb20be9340830e0b18dd8a54c754f5707e636bb19

# Diff at Fri, 26 Jul 2024 08:45:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20331930
- current block number: 20389614

## Description

(Tentative) gas limit raise (+ ~10%).

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
      values.gasLimit:
-        105000000
+        112500000
    }
```

Generated with discovered.json: 0xfab30ad5b7946a5d5787743d2e3ae493a491cfa6

# Diff at Thu, 18 Jul 2024 10:30:00 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20331930
- current block number: 20331930

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331930 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: None
      values.livenessInterval:
-        8467200
+        "98d"
      template:
+        "gnosisSafeModules/LivenessModule"
      descriptions:
+        ["used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"]
    }
```

```diff
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract BaseMultisig2 (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      descriptions:
+        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      descriptions:
+        ["Liveness Guard of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - used to remove members inactive for 98d."]
    }
```

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions.0:
-        "The main entry point to deposit ERC20 tokens from L1 to L2. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: None
      descriptions.0:
-        "The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."]
    }
```

```diff
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8) {
    +++ description: None
      template:
+        "gnosisSafeModules/DeputyGuardianModule"
      descriptions:
+        ["allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A (the deputy guardian) to act on behalf of the Gnosis Safe."]
    }
```

```diff
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions.0:
-        "Used to bridge ERC-721 tokens from L1 to L2"
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
      descriptions.0:
-        "Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract AdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E, inheriting its permissions."]
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      descriptions:
+        ["Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8."]
    }
```

```diff
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa) {
    +++ description: None
      descriptions.0:
-        "Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function."
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      descriptions:
+        ["Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2."]
    }
```

Generated with discovered.json: 0x03afd294b80a7fe1069f878499e9ea6e466c3245

# Diff at Thu, 18 Jul 2024 07:32:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14a8b2e13da16d68d776511f98207e5360accba3 block: 20224230
- current block number: 20331930

## Description

Gas limit bumped by 8% to 105M.

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
      values.gasLimit:
-        97500000
+        105000000
    }
```

Generated with discovered.json: 0x34e310f51105c3150b66509fde7d89efe751d8b2

# Diff at Wed, 03 Jul 2024 06:36:00 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@cf42b351c892788d89ff6698567a5c95122d93a1 block: 20124790
- current block number: 20224230

## Description

* L1StandardBridge stops functioning when Rollup is paused by SuperChain Guardian
* L1ERC721Bridge stops functioning when Rollup is paused by SuperChain Guardian
* L1CrossDomainMessenger stops functioning when Rollup is paused by SuperChain Guardian
* OptmismPortal - Guardian could pause/unpause withdrawals. Now guardian that can pause is SuperChain Guardian
* L2OutputOracle, SystemConfig - no significant changes 


## Watched changes

```diff
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: The main entry point to deposit ERC20 tokens from L1 to L2. This contract can store any token.
      upgradeability.implementation:
-        "0x3F3C0F6bC115E698E35038E1759E9c31032E590c"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      implementations.0:
-        "0x3F3C0F6bC115E698E35038E1759E9c31032E590c"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.version:
-        "1.1.0"
+        "2.1.0"
      values.otherBridge:
+        "0x4200000000000000000000000000000000000010"
      values.paused:
+        false
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: None
      upgradeability.implementation:
-        "0x5FB30336A8d0841cf15d452afA297cB6D10877D7"
+        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
      implementations.0:
-        "0x5FB30336A8d0841cf15d452afA297cB6D10877D7"
+        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.GUARDIAN:
-        "0x14536667Cd30e52C0b458BaACcB9faDA7046E056"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.isOutputFinalized:
-        [true,true,true,true,true]
      values.version:
-        "1.7.0"
+        "2.5.0"
      values.guardian:
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.l2Oracle:
+        "0x56315b90c40730925ec5485cf004d835058518A0"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.systemConfig:
+        "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
      errors:
-        {"isOutputFinalized":"Too many values. Update configuration to explore fully"}
    }
```

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
    +++ description: None
      upgradeability.implementation:
-        "0xf2460D3433475C8008ceFfe8283F07EB1447E39a"
+        "0xF243BEd163251380e78068d317ae10f26042B292"
      implementations.0:
-        "0xf2460D3433475C8008ceFfe8283F07EB1447E39a"
+        "0xF243BEd163251380e78068d317ae10f26042B292"
      values.computeL2Timestamp:
-        [1686789348,1686789350,1686789352,1686789354,1686789356]
      values.getL2Output:
-        [["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800],["0x04ef6eb5d5d7654d8d4a35a8a514dc5a3a5ed8bdefb5b354293eeb41b397d3a3",1686798023,3600],["0xadba58d47f714a60453283369665d7e4d59a8fed2a104da459dcaaccef836fb3",1686801431,5400],["0xba2976155bd45bd7b1742831fc73a2183103c73f93cc33f5441b228cba69886a",1686804875,7200],["0x24ed985d22ccdf05d8d41fddefe433d34975d41c3cfb0d6329940b9243fc1d0d",1686808343,9000]]
      values.getL2OutputAfter:
-        [["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800],["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800],["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800],["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800],["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800]]
      values.getL2OutputIndexAfter:
-        [0,0,0,0,0]
      values.version:
-        "1.3.0"
+        "1.8.0"
      values.challenger:
+        "0x6F8C5bA3F59ea3E76300E3BEcDC231D656017824"
      values.deletedOutputs:
+        [{"prevNextOutputIndex":1030,"newNextOutputIndex":1027},{"prevNextOutputIndex":1364,"newNextOutputIndex":1359}]
      values.finalizationPeriodSeconds:
+        604800
      values.l2BlockTime:
+        2
      values.proposer:
+        "0x642229f238fb9dE03374Be34B0eD8D9De80752c5"
      values.submissionInterval:
+        1800
      errors:
-        {"computeL2Timestamp":"Too many values. Update configuration to explore fully","getL2Output":"Too many values. Update configuration to explore fully","getL2OutputAfter":"Too many values. Update configuration to explore fully","getL2OutputIndexAfter":"Too many values. Update configuration to explore fully"}
    }
```

```diff
    contract L1ERC721Bridge (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: Used to bridge ERC-721 tokens from L1 to L2
      upgradeability.implementation:
-        "0x3311aC7F72bb4108d9f4D5d50E7623B1498A9eC0"
+        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      implementations.0:
-        "0x3311aC7F72bb4108d9f4D5d50E7623B1498A9eC0"
+        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.version:
-        "1.1.1"
+        "2.1.0"
      values.paused:
+        false
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
      upgradeability.implementation:
-        "0x6481ff79597Fe4F77E1063f615ec5BDaDDEFfd4B"
+        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      implementations.0:
-        "0x6481ff79597Fe4F77E1063f615ec5BDaDDEFfd4B"
+        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      values.batcherHash:
-        "0x0000000000000000000000005050f69a9786f081509234f1a7f4684b5e5b76c9"
+        "0x5050F69a9786F081509234F1a7F4684b5E5b76C9"
      values.version:
-        "1.3.0"
+        "1.12.0"
      values.BATCH_INBOX_SLOT:
+        "0x71ac12829d66ee73d8d95bff50b3589745ce57edae70a3fb111a2342464dc597"
      values.batchInbox:
+        "0xFf00000000000000000000000000000000008453"
      values.L1_CROSS_DOMAIN_MESSENGER_SLOT:
+        "0x383f291819e6d54073bc9a648251d97421076bdd101933c0c022219ce9580636"
      values.L1_ERC_721_BRIDGE_SLOT:
+        "0x46adcbebc6be8ce551740c29c47c8798210f23f7f4086c41752944352568d5a7"
      values.L1_STANDARD_BRIDGE_SLOT:
+        "0x9904ba90dde5696cda05c9e0dab5cbaa0fea005ace4d11218a02ac668dad6376"
      values.l1CrossDomainMessenger:
+        "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
      values.l1ERC721Bridge:
+        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
      values.l1StandardBridge:
+        "0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
      values.L2_OUTPUT_ORACLE_SLOT:
+        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
+        "0x56315b90c40730925ec5485cf004d835058518A0"
      values.opStackDA:
+        {"isSomeTxsLengthEqualToCelestiaDAExample":false,"isSequencerSendingBlobTx":true}
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84"
      values.optimismPortal:
+        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
      values.sequencerInbox:
+        "0xFf00000000000000000000000000000000008453"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        17482144
    }
```

```diff
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa) {
    +++ description: None
      upgradeability.implementation:
-        "0x81C4Bd600793EBd1C0323604E1F455fE50A951F8"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      implementations.0:
-        "0x81C4Bd600793EBd1C0323604E1F455fE50A951F8"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.version:
-        "1.4.0"
+        "2.3.0"
      values.otherMessenger:
+        "0x4200000000000000000000000000000000000007"
      values.paused:
+        false
      values.portal:
+        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
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
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

## Source code changes

```diff
.../base/ethereum/.flat/DeputyGuardianModule.sol   |  139 ++
 .../.flat/FoundationMultisig_1/GnosisSafe.sol      |  952 +++++++++
 .../FoundationMultisig_1/GnosisSafeProxy.p.sol     |   34 +
 .../ethereum/.flat/GuardianMultisig/GnosisSafe.sol |  952 +++++++++
 .../.flat/GuardianMultisig/GnosisSafeProxy.p.sol   |   34 +
 .../L1CrossDomainMessenger.sol                     | 1654 +++++++--------
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  611 +++---
 .../L1StandardBridge/L1StandardBridge.sol          | 1459 +++++++------
 .../L2OutputOracle/L2OutputOracle.sol              |  548 ++---
 .../base/ethereum/.flat/Lib_AddressManager.sol     |  151 ++
 .../base/ethereum/.flat/LivenessGuard.sol          |  581 ++++++
 .../base/ethereum/.flat/LivenessModule.sol         |  257 +++
 .../OptimismMintableERC20Factory.sol               |  426 ++++
 .../.flat/OptimismMintableERC20Factory/Proxy.p.sol |  210 ++
 .../OptimismPortal/OptimismPortal.sol              | 2144 ++++++++------------
 .../.flat/SecurityCouncilMultisig/GnosisSafe.sol   |  952 +++++++++
 .../SecurityCouncilMultisig/GnosisSafeProxy.p.sol  |   34 +
 .../ethereum/.flat/SuperchainConfig/Proxy.p.sol    |  199 ++
 .../.flat/SuperchainConfig/SuperchainConfig.sol    |  476 +++++
 .../base/ethereum/.flat/SuperchainProxyAdmin.sol   |  297 +++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  952 +++++++++
 .../GnosisSafeProxy.p.sol                          |   34 +
 .../SystemConfig/SystemConfig.sol                  |  602 +++---
 23 files changed, 9768 insertions(+), 3930 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20124790 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract OptimismMintableERC20Factory (0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84)
    +++ description: None
```

```diff
    contract GuardianMultisig (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      name:
-        "GuardianMultisig"
+        "BaseMultisig2"
    }
```

```diff
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e) {
    +++ description: None
      values.isOutputFinalized:
+        [true,true,true,true,true]
      errors:
+        {"isOutputFinalized":"Too many values. Update configuration to explore fully"}
    }
```

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
    +++ description: None
      values.deletedOutputs:
-        [{"prevNextOutputIndex":1030,"newNextOutputIndex":1027},{"prevNextOutputIndex":1364,"newNextOutputIndex":1359}]
      values.computeL2Timestamp:
+        [1686789348,1686789350,1686789352,1686789354,1686789356]
      values.getL2Output:
+        [["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800],["0x04ef6eb5d5d7654d8d4a35a8a514dc5a3a5ed8bdefb5b354293eeb41b397d3a3",1686798023,3600],["0xadba58d47f714a60453283369665d7e4d59a8fed2a104da459dcaaccef836fb3",1686801431,5400],["0xba2976155bd45bd7b1742831fc73a2183103c73f93cc33f5441b228cba69886a",1686804875,7200],["0x24ed985d22ccdf05d8d41fddefe433d34975d41c3cfb0d6329940b9243fc1d0d",1686808343,9000]]
      values.getL2OutputAfter:
+        [["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800],["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800],["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800],["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800],["0x61f4942f1af46203331e11dc496d2205d9585abec165134d8b22c108373ac44e",1686797963,1800]]
      values.getL2OutputIndexAfter:
+        [0,0,0,0,0]
      errors:
+        {"computeL2Timestamp":"Too many values. Update configuration to explore fully","getL2Output":"Too many values. Update configuration to explore fully","getL2OutputAfter":"Too many values. Update configuration to explore fully","getL2OutputIndexAfter":"Too many values. Update configuration to explore fully"}
    }
```

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
      values.batcherHash:
-        "0x5050F69a9786F081509234F1a7F4684b5E5b76C9"
+        "0x0000000000000000000000005050f69a9786f081509234f1a7f4684b5e5b76c9"
      values.opStackDA:
-        {"isSomeTxsLengthEqualToCelestiaDAExample":false,"isSequencerSendingBlobTx":true}
      values.sequencerInbox:
-        "0xFf00000000000000000000000000000000008453"
    }
```

```diff
    contract OptimismMultisig (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      name:
-        "OptimismMultisig"
+        "FoundationMultisig_2"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

Generated with discovered.json: 0x30d8e15050c1b9b217c2211de9ec9b56f4d22523

# Diff at Wed, 19 Jun 2024 09:08:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 20060546
- current block number: 20124790

## Description

Gas limit raised by the amount of a baby step.

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        90000000
+        97500000
    }
```

Generated with discovered.json: 0x61b72355cab6f0ef3d15d150fddf01ba8bd4a1b7

# Diff at Mon, 10 Jun 2024 09:30:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a695176fbb0fada448fda5610aee2cfe2ad4bb92 block: 19982126
- current block number: 20060546

## Description

Change one MS signer and raise L2 gas limit.

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        75000000
+        90000000
    }
```

```diff
    contract BaseMultisig (0x9855054731540A48b28990B63DcF4f33d8AE46A1) {
    +++ description: None
      values.getOwners.2:
-        "0x1d0D1f61137E457d4CF13146bBFA9F07B33f8Ec5"
+        "0x5FbEFA105bbd53b43bf537Cbc5cD30804Dd0c993"
    }
```

Generated with discovered.json: 0xc786e1756e9e6064e46a72832b95c71d354efde0

# Diff at Thu, 30 May 2024 10:40:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@765e34e8ea83c27680317d1368831e27e3399064 block: 19974223
- current block number: 19982126

## Description

One new signer is added to the Guardian Multisig: `0x73565876170a336Fa02fDe34EeD03E3121f70bA6`.

## Watched changes

```diff
    contract GuardianMultisig (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 8 (38%)"
+        "3 of 9 (33%)"
      values.getOwners.8:
+        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
      values.getOwners.7:
-        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
+        "0xBECAbd620cb6675f73C92bc444F7faCddf204DE2"
      values.getOwners.6:
-        "0xBECAbd620cb6675f73C92bc444F7faCddf204DE2"
+        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
      values.getOwners.5:
-        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
+        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
      values.getOwners.4:
-        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
+        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
      values.getOwners.3:
-        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
+        "0xa3D3c103442F162856163d564b983ae538c6202D"
      values.getOwners.2:
-        "0xa3D3c103442F162856163d564b983ae538c6202D"
+        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
      values.getOwners.1:
-        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
+        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
      values.getOwners.0:
-        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
+        "0x73565876170a336Fa02fDe34EeD03E3121f70bA6"
    }
```

Generated with discovered.json: 0xc1355c527c2a1eb878b3551991fd884894a63382

# Diff at Wed, 29 May 2024 08:09:22 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4844a9bf46315ea8d6de75161e4361325faaa106 block: 19566961
- current block number: 19974223

## Description

Gas limit on L2 is raised further. With a block time of 2s and elasticity of 10x, this currently puts Base at 3,75 GGas/s on average. This is 3x Ethereum Mainnet's 1,25 GGas/s and has a much higher surge scaling buffer. (elasticity)

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        60000000
+        75000000
    }
```

Generated with discovered.json: 0xaa51ff292601beab89225f2adc6e62ead95a27de

# Diff at Tue, 02 Apr 2024 08:35:50 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f62e2b01d51472dd8c710b0599031b7ba1a58f0d block: 19532859
- current block number: 19566961

## Description

The gas limit for the Base L2 is changed (33% raise). Current block time is 2s, elasticity is 10x.
Context: Plans to raise the gas limit gradually.

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        45000000
+        60000000
    }
```

Generated with discovered.json: 0xd85496fdcfa0bcf16ce3b442613d6c777e3cfb01

# Diff at Thu, 28 Mar 2024 13:19:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@d6dd20a306b268b851f83df5487b048c1253bb51 block: 19531207
- current block number: 19532859

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531207 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 8 (38%)"
    }
```

```diff
    contract AdminMultisig (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract BaseMultisig (0x9855054731540A48b28990B63DcF4f33d8AE46A1) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract OptimismMultisig (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 7 (71%)"
    }
```

Generated with discovered.json: 0x7a4a21435359044819e1c7ad6454f2e0f5311bf1

# Diff at Thu, 28 Mar 2024 07:45:55 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@5dfb8d5d243e41677914078b08f80de1889c6556 block: 19439852
- current block number: 19531207

## Description

The gas limit for the Base L2 is changed (50% raise). Current block time is 2s, elasticity is 10x.
Context: Congestion on base, plans to raise the gas limit gradually.

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        30000000
+        45000000
    }
```

Generated with discovered.json: 0xc4322ab5b04954fb99593b31607ae478be311b36

# Diff at Thu, 14 Mar 2024 00:20:47 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@e9ab5d808868ba1ecef1f4a9acee050bd71c3c54 block: 19411971
- current block number: 19429655

## Description

Base uses blobs now.

## Watched changes

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
-        false
+        true
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279134021569375896653"
    }
```

Generated with discovered.json: 0x344f98dfb9a45ff46b90d16771333c22eec6f0c0

# Diff at Mon, 11 Mar 2024 12:52:00 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176777
- current block number: 19411971

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176777 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x38be013948f7ef1753cbf9d4a57c31e079275867

# Diff at Wed, 07 Feb 2024 14:02:18 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175203
- current block number: 19176777

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175203 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
      values.sequencerInbox:
+        "0xFf00000000000000000000000000000000008453"
    }
```

Generated with discovered.json: 0x33c94c5e5a24fee2f8e0a33fd5aedf98a4c4e082

# Diff at Wed, 07 Feb 2024 08:43:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090314
- current block number: 19175203

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090314 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
    }
```

Generated with discovered.json: 0x9b43f3f8ad93357d8d4fc17bfc3e4610e8f1d755

# Diff at Fri, 26 Jan 2024 10:55:04 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 18833387
- current block number: 19090314

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18833387 (main branch discovery), not current.

```diff
    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":false,"isSomeTxsLengthEqualToCelestiaDAExample":false}
    }
```

Generated with discovered.json: 0x54cf34180e6362e6e293f64a076bc1ff11895384

# Diff at Thu, 21 Dec 2023 09:37:29 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@c849b812aca217350f93ffb1795822cdf02a8dcb

## Description

Two new owners (EOAs) are added to GuardianMultisig (now 3/8).

## Watched changes

```diff
    contract GuardianMultisig (0x14536667Cd30e52C0b458BaACcB9faDA7046E056) {
      values.getOwners[7]:
+        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
      values.getOwners[6]:
+        "0xBECAbd620cb6675f73C92bc444F7faCddf204DE2"
      values.getOwners.5:
-        "0x49243DcE94e0f5A1B08b9556bBEc5a84363c3839"
+        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
      values.getOwners.4:
-        "0xBECAbd620cb6675f73C92bc444F7faCddf204DE2"
+        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
      values.getOwners.3:
-        "0xa7a5e47D3959bf134e3EcdEb1f62e054f0D58a18"
+        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
      values.getOwners.2:
-        "0x969ffD102fbF304d4e401999333FE9397DaC653D"
+        "0xa3D3c103442F162856163d564b983ae538c6202D"
      values.getOwners.1:
-        "0x8e5de5cA219e3FFC9cdEb2Dc7D71B8a199cd2C4F"
+        "0xC29A4a69886d5ee1E08BDBbdd4e35558A668ee04"
      values.getOwners.0:
-        "0xa3D3c103442F162856163d564b983ae538c6202D"
+        "0x92B79E6C995Ee8B267EC1Ac2743D1c1fBFFFc447"
    }
```

# Diff at Fri, 01 Dec 2023 12:33:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@1f8562341e47f5b1eafc343e15aa93bc264ed786

## Description

Added wstETHEscrow contract.

## Watched changes

```diff
+   Status: CREATED
    contract wstETHEscrow (0x9de443AdC5A411E83F1878Ef24C3F52C61571e72) {
    }
```

## Source code changes

```diff
.../contracts/access/AccessControl.sol             | 235 +++++++++++++++++++++
 .../contracts/access/IAccessControl.sol            |  88 ++++++++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |  82 +++++++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  99 +++++++++
 .../@openzeppelin/contracts/utils/Address.sol      | 222 +++++++++++++++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +++
 .../@openzeppelin/contracts/utils/Strings.sol      |  67 ++++++
 .../contracts/utils/introspection/ERC165.sol       |  29 +++
 .../contracts/utils/introspection/IERC165.sol      |  25 +++
 .../implementation/contracts/BridgeableTokens.sol  |  49 +++++
 .../implementation/contracts/BridgingManager.sol   | 135 ++++++++++++
 .../contracts/optimism/CrossDomainEnabled.sol      |  46 ++++
 .../contracts/optimism/L1ERC20TokenBridge.sol      | 150 +++++++++++++
 .../optimism/interfaces/ICrossDomainMessenger.sol  |  18 ++
 .../optimism/interfaces/IL1ERC20Bridge.sol         |  84 ++++++++
 .../optimism/interfaces/IL2ERC20Bridge.sol         |  90 ++++++++
 .../.code/wstETHEscrow/implementation/meta.txt     |   2 +
 .../contracts/interfaces/draft-IERC1822.sol        |  20 ++
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |  33 +++
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 185 ++++++++++++++++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |  86 ++++++++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 ++
 .../@openzeppelin/contracts/utils/Address.sol      | 222 +++++++++++++++++++
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |  84 ++++++++
 .../proxy/contracts/proxy/OssifiableProxy.sol      |  93 ++++++++
 .../ethereum/.code/wstETHEscrow/proxy/meta.txt     |   2 +
 26 files changed, 2186 insertions(+)
```

# Diff at Tue, 26 Sep 2023 08:12:33 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0x56315b90c40730925ec5485cf004d835058518A0) {
      values.deletedOutputs:
+        [{"prevNextOutputIndex":1030,"newNextOutputIndex":1027},{"prevNextOutputIndex":1364,"newNextOutputIndex":1359}]
    }
```
