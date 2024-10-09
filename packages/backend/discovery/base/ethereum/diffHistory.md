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
