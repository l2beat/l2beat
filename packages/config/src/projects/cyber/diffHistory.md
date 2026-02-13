Generated with discovered.json: 0x0d3621f3cfcaf920cd8edec526200811d28017a2

# Diff at Fri, 13 Feb 2026 11:33:09 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@55ab80636f1e0c000e757a7a146f11035a19e9c0 block: 1769272322
- current timestamp: 1769272322

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1769272322 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0xaCc66304d26a01A9bd60d0584dCEdbaCeC8e10e0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.challengerFromDGF:
+        "UNRESOLVED"
      values.permissionedGameArgs:
+        "EXPECT_REVERT"
      values.proposerFromDGF:
+        "UNRESOLVED"
      values.wethFromDGF:
+        "UNRESOLVED"
      usedTypes:
+        [{"typeCaster":"SliceAddress","arg":{"offset":124}},{"typeCaster":"SliceAddress","arg":{"offset":144}},{"typeCaster":"SliceAddress","arg":{"offset":72}}]
    }
```

Generated with discovered.json: 0xe2b1e4ff2e6002b46dce9bcb6d31930376563032

# Diff at Mon, 26 Jan 2026 09:08:13 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@ac37c78dd7a10d019f852f76f0bb7435768a0edc block: 1766048095
- current timestamp: 1769272322

## Description

SaferSafes module (LivenessModule + TimelockGuard) added to OpFoundationUpgradeSafe. Timelock delays currently 0.

## Watched changes

```diff
    contract OpFoundationUpgradeSafe (eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      values.GnosisSafe_modules.0:
+        "eth:0xA8447329e52F64AED2bFc9E7a2506F7D369f483a"
    }
```

```diff
+   Status: CREATED
    contract SaferSafes (eth:0xA8447329e52F64AED2bFc9E7a2506F7D369f483a)
    +++ description: A Gnosis Safe module combining LivenessModule and TimelockGuard. Provides liveness checks where a fallback owner can challenge and take over if Safe owners are unresponsive, plus optional timelock delays for transaction scheduling.
```

## Source code changes

```diff
.../src/projects/cyber/.flat/SaferSafes.sol        | 3535 ++++++++++++++++++++
 1 file changed, 3535 insertions(+)
```

Generated with discovered.json: 0xbff0f61ea9fcd83a76fc6847e3f51bca3e3a8e97

# Diff at Thu, 18 Dec 2025 08:56:22 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6cd29a835d734750c830e20a8c0a6b2f1cef086b block: 1765550447
- current timestamp: 1766048095

## Description

upgrade to safe 1.4.1

## Watched changes

```diff
    contract OpFoundationUpgradeSafe (eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
      values.$implementation:
-        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.VERSION:
-        "1.3.0"
+        "1.4.1"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

## Source code changes

```diff
.../OpFoundationUpgradeSafe/Safe.sol}              | 685 ++++++++++++---------
 1 file changed, 410 insertions(+), 275 deletions(-)
```

Generated with discovered.json: 0x100cb465c5fbea8fa4e020430020ecd2ee5afb7d

# Diff at Fri, 12 Dec 2025 16:19:51 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@d2235ef7f5c90cb4a3a617fea7d52a655dc22fa1 block: 1764757255
- current timestamp: 1765550447

## Description

Added game 42 to template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764757255 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0xaCc66304d26a01A9bd60d0584dCEdbaCeC8e10e0) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.game2000:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.game42:
+        "eth:0x0000000000000000000000000000000000000000"
      values.initBondGame42:
+        0
      fieldMeta.game2000:
+        {"severity":"HIGH"}
      fieldMeta.game42:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x9d61aa72f957ff7b272aa292a2c5bc075937c7ba

# Diff at Fri, 28 Nov 2025 09:49:22 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@10f814ec1e4e08d34183a00c458ece2b8605dede block: 1743923519
- current timestamp: 1764323296

## Description

Jovian upgrade.

## Watched changes

```diff
    EOA  (eth:0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"propose","from":"eth:0xa669A743b065828682eE16109273F5CFeF5e676d","role":".proposer"}
      receivedPermissions.1.role:
-        ".PROPOSER"
+        ".proposer"
      receivedPermissions.1.from:
-        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0x719206d1C83D16FBcAB21f9e9DBF5A8178567E2b"
    }
```

```diff
    contract L1StandardBridge (eth:0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      values.$implementation:
-        "eth:0x01b46e02fcE5FC0731076711aFFe73bEeCD87997"
+        "eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.superchainConfig:
-        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.eth:0x01b46e02fcE5FC0731076711aFFe73bEeCD87997:
-        "L1StandardBridge"
      implementationNames.eth:0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF:
+        "L1StandardBridge"
    }
```

```diff
-   Status: DELETED
    contract SuperchainConfig (eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
    contract OptimismPortal2 (eth:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      name:
-        "OptimismPortal"
+        "OptimismPortal2"
      template:
-        "opstack/OptimismPortal"
+        "opstack/OptimismPortal2"
      sourceHashes.1:
-        "0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"
+        "0x41be46bdb67af1b7af90e1bd70a1fcd31a3352282beb83b846a5189675c37ac1"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame."
      values.$implementation:
-        "eth:0xACfD93B4887cef4F05cF3440d150D2cE97339142"
+        "eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"
      values.$pastUpgrades.1:
+        ["2025-11-27T02:29:11.000Z","0x540b3710f8fc0ff0dfd8db25f025e0a92c37a90be3af7e2f8bd07f7217d4138b",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-11-27T02:29:11.000Z","0x540b3710f8fc0ff0dfd8db25f025e0a92c37a90be3af7e2f8bd07f7217d4138b",["eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B"]]
      values.$upgradeCount:
-        1
+        3
      values.guardian:
-        "eth:0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.GUARDIAN:
-        "eth:0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
      values.L2_ORACLE:
-        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
      values.l2Oracle:
-        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
      values.superchainConfig:
-        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.SYSTEM_CONFIG:
-        "eth:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      values.version:
-        "2.5.0"
+        "3.10.0"
      values.disputeGameFactory:
+        "eth:0xaCc66304d26a01A9bd60d0584dCEdbaCeC8e10e0"
      values.disputeGameFinalityDelaySeconds:
+        302400
      values.proofMaturityDelaySeconds:
+        604800
      values.RespectedGameString:
+        "PermissionedDisputeGame"
+++ severity: HIGH
      values.respectedGameType:
+        1
      values.respectedGameTypeUpdatedAt:
+        1764210551
      implementationNames.eth:0xACfD93B4887cef4F05cF3440d150D2cE97339142:
-        "OptimismPortal"
      implementationNames.eth:0xe2F826324b2faf99E513D16D266c3F80aE87832B:
+        "OptimismPortal2"
      fieldMeta:
+        {"respectedGameType":{"severity":"HIGH"},"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame","1337":"KailuaGame"}}]
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$implementation:
-        "eth:0x849d0821B1D313b65f6FF152176F4b6a0AF7aa56"
+        "eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.$pastUpgrades.1:
+        ["2025-11-27T02:29:11.000Z","0x540b3710f8fc0ff0dfd8db25f025e0a92c37a90be3af7e2f8bd07f7217d4138b",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-11-27T02:29:11.000Z","0x540b3710f8fc0ff0dfd8db25f025e0a92c37a90be3af7e2f8bd07f7217d4138b",["eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]
      values.$upgradeCount:
-        1
+        3
      values.superchainConfig:
-        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.eth:0x849d0821B1D313b65f6FF152176F4b6a0AF7aa56:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract L1ERC721Bridge (eth:0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$implementation:
-        "eth:0x1234c7a75f40551Fce5aFf1d58efD72F2ee2AFB1"
+        "eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.$pastUpgrades.1:
+        ["2025-11-27T02:29:11.000Z","0x540b3710f8fc0ff0dfd8db25f025e0a92c37a90be3af7e2f8bd07f7217d4138b",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-11-27T02:29:11.000Z","0x540b3710f8fc0ff0dfd8db25f025e0a92c37a90be3af7e2f8bd07f7217d4138b",["eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]
      values.$upgradeCount:
-        1
+        3
      values.superchainConfig:
-        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      implementationNames.eth:0x1234c7a75f40551Fce5aFf1d58efD72F2ee2AFB1:
-        "L1ERC721Bridge"
      implementationNames.eth:0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d:
+        "L1ERC721Bridge"
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$implementation:
-        "eth:0x985F187489954435ddf9571D45500184566e4B46"
+        "eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.$pastUpgrades.1:
+        ["2025-11-27T02:29:11.000Z","0x540b3710f8fc0ff0dfd8db25f025e0a92c37a90be3af7e2f8bd07f7217d4138b",["eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.eth:0x985F187489954435ddf9571D45500184566e4B46:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract SystemConfig (eth:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"
+        "0xf2ca03f1fb80fdb3c1281ea41b46245c8e6811a03a9ad7129f60cfedaac0e231"
      values.$implementation:
-        "eth:0x726C6ac8A53061e56AfB2c890545348ba6f0DF0E"
+        "eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.1:
+        ["2025-11-27T02:29:11.000Z","0x540b3710f8fc0ff0dfd8db25f025e0a92c37a90be3af7e2f8bd07f7217d4138b",["eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.2:
+        ["2025-11-27T02:29:11.000Z","0x540b3710f8fc0ff0dfd8db25f025e0a92c37a90be3af7e2f8bd07f7217d4138b",["eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$upgradeCount:
-        1
+        3
      values.L2_OUTPUT_ORACLE_SLOT:
-        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
-        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
      values.version:
-        "1.12.0"
+        "2.3.0"
      values.basefeeScalar:
+        1
      values.blobbasefeeScalar:
+        1
      values.DISPUTE_GAME_FACTORY_SLOT:
+        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.disputeGameFactory:
+        "eth:0xaCc66304d26a01A9bd60d0584dCEdbaCeC8e10e0"
+++ description: volatility param: lower denominator -> quicker fee changes on L2
      values.eip1559Denominator:
+        0
      values.eip1559Elasticity:
+        0
      values.gasPayingToken:
+        {"addr_":"eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
+        "Ether"
      values.gasPayingTokenSymbol:
+        "ETH"
      values.isCustomGasToken:
+        false
      values.maximumGasLimit:
+        200000000
      implementationNames.eth:0x726C6ac8A53061e56AfB2c890545348ba6f0DF0E:
-        "SystemConfig"
      implementationNames.eth:0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375:
+        "SystemConfig"
    }
```

```diff
    contract ProxyAdmin (eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x0Ca6c5aef8dBC91368C61871fDC51Ef884843e07","role":"admin"}
      directlyReceivedPermissions.3:
-        {"permission":"upgrade","from":"eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D","role":"admin"}
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0x6A9AFfDcfeF73f66177a1386590607F444520571","role":"admin"}
      directlyReceivedPermissions.9.from:
-        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xaCc66304d26a01A9bd60d0584dCEdbaCeC8e10e0"
    }
```

```diff
-   Status: DELETED
    contract L2OutputOracle (eth:0xa669A743b065828682eE16109273F5CFeF5e676d)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
    contract Cyber Multisig 1 (eth:0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x6A9AFfDcfeF73f66177a1386590607F444520571","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x0Ca6c5aef8dBC91368C61871fDC51Ef884843e07","role":"admin","via":[{"address":"eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.3:
-        {"permission":"upgrade","from":"eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D","role":"admin","via":[{"address":"eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0x6A9AFfDcfeF73f66177a1386590607F444520571","role":"admin","via":[{"address":"eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.9.from:
-        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xaCc66304d26a01A9bd60d0584dCEdbaCeC8e10e0"
    }
```

```diff
    EOA  (eth:0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"challenge","from":"eth:0xa669A743b065828682eE16109273F5CFeF5e676d","role":".challenger"}
      receivedPermissions.1.role:
-        ".CHALLENGER"
+        ".challenger"
      receivedPermissions.1.from:
-        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0x719206d1C83D16FBcAB21f9e9DBF5A8178567E2b"
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 3mo 8d while making sure that the threshold remains above 75%. If the number of members falls below 8, the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x0Ca6c5aef8dBC91368C61871fDC51Ef884843e07)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract LivenessGuard (eth:0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: Modular contract to be used together with the LivenessModule. Tracks liveness / activity of Safe owners.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (eth:0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x6A9AFfDcfeF73f66177a1386590607F444520571)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0x719206d1C83D16FBcAB21f9e9DBF5A8178567E2b)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754)
    +++ description: Allows eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92 if set as its Safe module.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages individual pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3 months if left untouched.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0xaCc66304d26a01A9bd60d0584dCEdbaCeC8e10e0)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract Optimism Security Council (eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

## Source code changes

```diff
...0x19b5804B88F10262A55ac731f28A3BbC4209853a.sol} |    0
 ...:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F.sol |  152 +
 .../AnchorStateRegistry/AnchorStateRegistry.sol    |  448 +++
 .../AnchorStateRegistry}/Proxy.p.sol               |    0
 .../cyber/.flat/DelayedWETH/DelayedWETH.sol        |  651 ++++
 .../DelayedWETH}/Proxy.p.sol                       |    0
 .../src/projects/cyber/.flat/DeputyPauseModule.sol | 1305 +++++++
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1550 ++++++++
 .../cyber/.flat/DisputeGameFactory/Proxy.p.sol     |  200 +
 .../projects/cyber/.flat/GnosisSafe/GnosisSafe.sol |  953 +++++
 .../cyber/.flat/GnosisSafe/GnosisSafeProxy.p.sol   |   35 +
 .../L2OutputOracle/L2OutputOracle.sol => /dev/null |  679 ----
 .../src/projects/cyber/.flat/LivenessGuard.sol     |  582 +++
 .../src/projects/cyber/.flat/LivenessModule.sol    |  258 ++
 /dev/null => ./src/projects/cyber/.flat/MIPS.sol   | 1717 +++++++++
 .../.flat/OpFoundationUpgradeSafe/GnosisSafe.sol   |  953 +++++
 .../OpFoundationUpgradeSafe/GnosisSafeProxy.p.sol  |   35 +
 .../Optimism Guardian Multisig/GnosisSafe.sol      |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../.flat/Optimism Security Council/GnosisSafe.sol |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../OptimismPortal2/OptimismPortal2.sol}           |  512 ++-
 .../cyber/.flat/OptimismPortal2/Proxy.p.sol        |  200 +
 .../cyber/.flat/PermissionedDisputeGame.sol        | 4036 ++++++++++++++++++++
 .../src/projects/cyber/.flat/PreimageOracle.sol    | 1353 +++++++
 .../SuperchainConfig/SuperchainConfig.sol          |  467 ++-
 .../projects/cyber/.flat/SuperchainProxyAdmin.sol  |  298 ++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../SystemConfig/SystemConfig.sol                  | 1502 +++++++-
 30 files changed, 19823 insertions(+), 1027 deletions(-)
```

Generated with discovered.json: 0x7f5e706eeab3b2d23467e612c5d54f159577fbea

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x3b1fa650456841b20bc15b40c34e81b572bba2e9

# Diff at Mon, 14 Jul 2025 12:44:56 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22208300
- current block number: 22208300

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208300 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4) {
    +++ description: None
      address:
-        "0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
+        "eth:0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
    }
```

```diff
    EOA  (0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1) {
    +++ description: None
      address:
-        "0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1"
+        "eth:0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1"
    }
```

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      address:
-        "0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
+        "eth:0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
      values.$admin:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      values.$implementation:
-        "0x0d93eAA86eb6948b977857750A5512Bef6B05C51"
+        "eth:0x0d93eAA86eb6948b977857750A5512Bef6B05C51"
      values.$pastUpgrades.0.2.0:
-        "0x0d93eAA86eb6948b977857750A5512Bef6B05C51"
+        "eth:0x0d93eAA86eb6948b977857750A5512Bef6B05C51"
      values.$pastUpgrades.1.2.0:
-        "0x414066fd3dadC875531BE2992770aDab2ecB6366"
+        "eth:0x414066fd3dadC875531BE2992770aDab2ecB6366"
      values.$pastUpgrades.2.2.0:
-        "0x0d93eAA86eb6948b977857750A5512Bef6B05C51"
+        "eth:0x0d93eAA86eb6948b977857750A5512Bef6B05C51"
      values.owner:
-        "0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
+        "eth:0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
      implementationNames.0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49:
-        "Proxy"
      implementationNames.0x0d93eAA86eb6948b977857750A5512Bef6B05C51:
-        "DataAvailabilityChallenge"
      implementationNames.eth:0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49:
+        "Proxy"
      implementationNames.eth:0x0d93eAA86eb6948b977857750A5512Bef6B05C51:
+        "DataAvailabilityChallenge"
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
+        "eth:0x12a580c05466eefb2c467C6b115844cDaF55B255"
      values.$admin:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      values.$implementation:
-        "0x01b46e02fcE5FC0731076711aFFe73bEeCD87997"
+        "eth:0x01b46e02fcE5FC0731076711aFFe73bEeCD87997"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
+        "eth:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
      values.MESSENGER:
-        "0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
+        "eth:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      implementationNames.0x12a580c05466eefb2c467C6b115844cDaF55B255:
-        "L1ChugSplashProxy"
      implementationNames.0x01b46e02fcE5FC0731076711aFFe73bEeCD87997:
-        "L1StandardBridge"
      implementationNames.eth:0x12a580c05466eefb2c467C6b115844cDaF55B255:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x01b46e02fcE5FC0731076711aFFe73bEeCD87997:
+        "L1StandardBridge"
    }
```

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x19b5804B88F10262A55ac731f28A3BbC4209853a"
+        "eth:0x19b5804B88F10262A55ac731f28A3BbC4209853a"
      values.owner:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      implementationNames.0x19b5804B88F10262A55ac731f28A3BbC4209853a:
-        "AddressManager"
      implementationNames.eth:0x19b5804B88F10262A55ac731f28A3BbC4209853a:
+        "AddressManager"
    }
```

```diff
    EOA Cyber (0x1a76Ed328600489811F819959a74043f106CF0f9) {
    +++ description: None
      address:
-        "0x1a76Ed328600489811F819959a74043f106CF0f9"
+        "eth:0x1a76Ed328600489811F819959a74043f106CF0f9"
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      values.$admin:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      values.$implementation:
-        "0x579f8dFDAF8F180050C67B5D41342d686F2b28a6"
+        "eth:0x579f8dFDAF8F180050C67B5D41342d686F2b28a6"
      values.$pastUpgrades.0.2.0:
-        "0x579f8dFDAF8F180050C67B5D41342d686F2b28a6"
+        "eth:0x579f8dFDAF8F180050C67B5D41342d686F2b28a6"
      values.guardian:
-        "0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
+        "eth:0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
      implementationNames.0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D:
-        "Proxy"
      implementationNames.0x579f8dFDAF8F180050C67B5D41342d686F2b28a6:
-        "SuperchainConfig"
      implementationNames.eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D:
+        "Proxy"
      implementationNames.eth:0x579f8dFDAF8F180050C67B5D41342d686F2b28a6:
+        "SuperchainConfig"
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
+        "eth:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
      values.$admin:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      values.$implementation:
-        "0xACfD93B4887cef4F05cF3440d150D2cE97339142"
+        "eth:0xACfD93B4887cef4F05cF3440d150D2cE97339142"
      values.$pastUpgrades.0.2.0:
-        "0xACfD93B4887cef4F05cF3440d150D2cE97339142"
+        "eth:0xACfD93B4887cef4F05cF3440d150D2cE97339142"
      values.guardian:
-        "0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
+        "eth:0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
      values.GUARDIAN:
-        "0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
+        "eth:0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
      values.L2_ORACLE:
-        "0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
      values.l2Oracle:
-        "0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      values.SYSTEM_CONFIG:
-        "0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
+        "eth:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      values.systemConfig:
-        "0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
+        "eth:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      implementationNames.0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99:
-        "Proxy"
      implementationNames.0xACfD93B4887cef4F05cF3440d150D2cE97339142:
-        "OptimismPortal"
      implementationNames.eth:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99:
+        "Proxy"
      implementationNames.eth:0xACfD93B4887cef4F05cF3440d150D2cE97339142:
+        "OptimismPortal"
    }
```

```diff
    EOA  (0x1F316F0F898AAb1919F9Fb9183F8D1900F721AdB) {
    +++ description: None
      address:
-        "0x1F316F0F898AAb1919F9Fb9183F8D1900F721AdB"
+        "eth:0x1F316F0F898AAb1919F9Fb9183F8D1900F721AdB"
    }
```

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
+        "eth:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
      values.$admin:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      values.$implementation:
-        "0x849d0821B1D313b65f6FF152176F4b6a0AF7aa56"
+        "eth:0x849d0821B1D313b65f6FF152176F4b6a0AF7aa56"
      values.$pastUpgrades.0.2.0:
-        "0x849d0821B1D313b65f6FF152176F4b6a0AF7aa56"
+        "eth:0x849d0821B1D313b65f6FF152176F4b6a0AF7aa56"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
+        "eth:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
      values.PORTAL:
-        "0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
+        "eth:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
      values.ResolvedDelegateProxy_addressManager:
-        "0x19b5804B88F10262A55ac731f28A3BbC4209853a"
+        "eth:0x19b5804B88F10262A55ac731f28A3BbC4209853a"
      values.superchainConfig:
-        "0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      implementationNames.0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9:
-        "ResolvedDelegateProxy"
      implementationNames.0x849d0821B1D313b65f6FF152176F4b6a0AF7aa56:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x849d0821B1D313b65f6FF152176F4b6a0AF7aa56:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
+        "eth:0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
      values.$admin:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      values.$implementation:
-        "0x1234c7a75f40551Fce5aFf1d58efD72F2ee2AFB1"
+        "eth:0x1234c7a75f40551Fce5aFf1d58efD72F2ee2AFB1"
      values.$pastUpgrades.0.2.0:
-        "0x1234c7a75f40551Fce5aFf1d58efD72F2ee2AFB1"
+        "eth:0x1234c7a75f40551Fce5aFf1d58efD72F2ee2AFB1"
      values.messenger:
-        "0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
+        "eth:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
      values.MESSENGER:
-        "0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
+        "eth:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      implementationNames.0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd:
-        "Proxy"
      implementationNames.0x1234c7a75f40551Fce5aFf1d58efD72F2ee2AFB1:
-        "L1ERC721Bridge"
      implementationNames.eth:0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd:
+        "Proxy"
      implementationNames.eth:0x1234c7a75f40551Fce5aFf1d58efD72F2ee2AFB1:
+        "L1ERC721Bridge"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
+        "eth:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
      values.$admin:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      values.$implementation:
-        "0x985F187489954435ddf9571D45500184566e4B46"
+        "eth:0x985F187489954435ddf9571D45500184566e4B46"
      values.$pastUpgrades.0.2.0:
-        "0x985F187489954435ddf9571D45500184566e4B46"
+        "eth:0x985F187489954435ddf9571D45500184566e4B46"
      values.bridge:
-        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
+        "eth:0x12a580c05466eefb2c467C6b115844cDaF55B255"
      values.BRIDGE:
-        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
+        "eth:0x12a580c05466eefb2c467C6b115844cDaF55B255"
      implementationNames.0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4:
-        "Proxy"
      implementationNames.0x985F187489954435ddf9571D45500184566e4B46:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4:
+        "Proxy"
      implementationNames.eth:0x985F187489954435ddf9571D45500184566e4B46:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
+        "eth:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      values.$admin:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      values.$implementation:
-        "0x726C6ac8A53061e56AfB2c890545348ba6f0DF0E"
+        "eth:0x726C6ac8A53061e56AfB2c890545348ba6f0DF0E"
      values.$pastUpgrades.0.2.0:
-        "0x726C6ac8A53061e56AfB2c890545348ba6f0DF0E"
+        "eth:0x726C6ac8A53061e56AfB2c890545348ba6f0DF0E"
      values.batcherHash:
-        "0x6AdE72DA6C1d47c856f13CD01Aac22A90D722e01"
+        "eth:0x6AdE72DA6C1d47c856f13CD01Aac22A90D722e01"
      values.batchInbox:
-        "0xfF00000000000000000000000000000000001d88"
+        "eth:0xfF00000000000000000000000000000000001d88"
      values.l1CrossDomainMessenger:
-        "0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
+        "eth:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
      values.l1ERC721Bridge:
-        "0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
+        "eth:0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
      values.l1StandardBridge:
-        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
+        "eth:0x12a580c05466eefb2c467C6b115844cDaF55B255"
      values.l2OutputOracle:
-        "0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
      values.optimismMintableERC20Factory:
-        "0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
+        "eth:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
      values.optimismPortal:
-        "0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
+        "eth:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
      values.owner:
-        "0x68ca4cDCb0F47457273B554E60ff8321D5C133E4"
+        "eth:0x68ca4cDCb0F47457273B554E60ff8321D5C133E4"
      values.sequencerInbox:
-        "0xfF00000000000000000000000000000000001d88"
+        "eth:0xfF00000000000000000000000000000000001d88"
      values.unsafeBlockSigner:
-        "0x1F316F0F898AAb1919F9Fb9183F8D1900F721AdB"
+        "eth:0x1F316F0F898AAb1919F9Fb9183F8D1900F721AdB"
      implementationNames.0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055:
-        "Proxy"
      implementationNames.0x726C6ac8A53061e56AfB2c890545348ba6f0DF0E:
-        "SystemConfig"
      implementationNames.eth:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055:
+        "Proxy"
      implementationNames.eth:0x726C6ac8A53061e56AfB2c890545348ba6f0DF0E:
+        "SystemConfig"
    }
```

```diff
    contract Cyber Multisig 2 (0x68ca4cDCb0F47457273B554E60ff8321D5C133E4) {
    +++ description: None
      address:
-        "0x68ca4cDCb0F47457273B554E60ff8321D5C133E4"
+        "eth:0x68ca4cDCb0F47457273B554E60ff8321D5C133E4"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
+        "eth:0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
      values.$members.1:
-        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
+        "eth:0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
      values.$members.2:
-        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
+        "eth:0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
      values.$members.3:
-        "0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
+        "eth:0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
      implementationNames.0x68ca4cDCb0F47457273B554E60ff8321D5C133E4:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x68ca4cDCb0F47457273B554E60ff8321D5C133E4:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x6AdE72DA6C1d47c856f13CD01Aac22A90D722e01) {
    +++ description: None
      address:
-        "0x6AdE72DA6C1d47c856f13CD01Aac22A90D722e01"
+        "eth:0x6AdE72DA6C1d47c856f13CD01Aac22A90D722e01"
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      address:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      values.addressManager:
-        "0x19b5804B88F10262A55ac731f28A3BbC4209853a"
+        "eth:0x19b5804B88F10262A55ac731f28A3BbC4209853a"
      values.owner:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
+        "eth:0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      implementationNames.0x7E54107731EC43e78DA678DFa5fB6222Ad036e03:
-        "ProxyAdmin"
      implementationNames.eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03:
+        "ProxyAdmin"
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
      values.$admin:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      values.$implementation:
-        "0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"
+        "eth:0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"
      values.$pastUpgrades.0.2.0:
-        "0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"
+        "eth:0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"
      values.$pastUpgrades.1.2.0:
-        "0xA9D78F579f1B30194F3c2Ca1987A9B91A33BDF08"
+        "eth:0xA9D78F579f1B30194F3c2Ca1987A9B91A33BDF08"
      values.$pastUpgrades.2.2.0:
-        "0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"
+        "eth:0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"
+++ severity: HIGH
      values.challenger:
-        "0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275"
+        "eth:0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275"
      values.CHALLENGER:
-        "0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275"
+        "eth:0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275"
+++ severity: HIGH
      values.proposer:
-        "0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1"
+        "eth:0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1"
      values.PROPOSER:
-        "0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1"
+        "eth:0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1"
      implementationNames.0xa669A743b065828682eE16109273F5CFeF5e676d:
-        "Proxy"
      implementationNames.0x93E1c0D8ef27930130fb809CE18ca681A8C32F85:
-        "L2OutputOracle"
      implementationNames.eth:0xa669A743b065828682eE16109273F5CFeF5e676d:
+        "Proxy"
      implementationNames.eth:0x93E1c0D8ef27930130fb809CE18ca681A8C32F85:
+        "L2OutputOracle"
    }
```

```diff
    EOA AltLayer 3 (0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7) {
    +++ description: None
      address:
-        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
+        "eth:0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
    }
```

```diff
    EOA AltLayer 1 (0xaC79765A73eB9dcBd3c427181E6819902AE25b48) {
    +++ description: None
      address:
-        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
+        "eth:0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
    }
```

```diff
    EOA AltLayer 2 (0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2) {
    +++ description: None
      address:
-        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
+        "eth:0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
    }
```

```diff
    contract Cyber Multisig 1 (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      address:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
+        "eth:0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
+        "eth:0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
      values.$members.1:
-        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
+        "eth:0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
      values.$members.2:
-        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
+        "eth:0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
      values.$members.3:
-        "0x1a76Ed328600489811F819959a74043f106CF0f9"
+        "eth:0x1a76Ed328600489811F819959a74043f106CF0f9"
      implementationNames.0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xc76C563185d01284AdbC9cF5bb909162dD2F15e7) {
    +++ description: None
      address:
-        "0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
+        "eth:0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
    }
```

```diff
    EOA  (0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275) {
    +++ description: None
      address:
-        "0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275"
+        "eth:0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275"
    }
```

```diff
    EOA  (0xfF00000000000000000000000000000000001d88) {
    +++ description: None
      address:
-        "0xfF00000000000000000000000000000000001d88"
+        "eth:0xfF00000000000000000000000000000000001d88"
    }
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49)
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract Cyber Multisig 2 (0x68ca4cDCb0F47457273B554E60ff8321D5C133E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract Cyber Multisig 1 (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398)
    +++ description: None
```

Generated with discovered.json: 0x80e6f7d6f72d60a130b7eea91912bfdf4f9ed2a2

# Diff at Mon, 14 Jul 2025 08:02:44 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22208300
- current block number: 22208300

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208300 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x3b1867a18d62aff75fd7ae638ba37a7914c782a4

# Diff at Fri, 04 Jul 2025 12:18:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22208300
- current block number: 22208300

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208300 (main branch discovery), not current.

```diff
    EOA  (0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      receivedPermissions.1.from:
-        "ethereum:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
+        "eth:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
      receivedPermissions.2.from:
-        "ethereum:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
+        "eth:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
    }
```

```diff
    EOA  (0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
      receivedPermissions.1.from:
-        "ethereum:0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
    }
```

```diff
    contract Cyber Multisig 2 (0x68ca4cDCb0F47457273B554E60ff8321D5C133E4) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
+        "eth:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
    }
```

```diff
    EOA  (0x6AdE72DA6C1d47c856f13CD01Aac22A90D722e01) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
+        "eth:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x19b5804B88F10262A55ac731f28A3BbC4209853a"
+        "eth:0x19b5804B88F10262A55ac731f28A3BbC4209853a"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
+        "eth:0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x12a580c05466eefb2c467C6b115844cDaF55B255"
+        "eth:0x12a580c05466eefb2c467C6b115844cDaF55B255"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
+        "eth:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
+        "eth:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
+        "eth:0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
+        "eth:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
      directlyReceivedPermissions.8.from:
-        "ethereum:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
+        "eth:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
    }
```

```diff
    contract Cyber Multisig 1 (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      receivedPermissions.0.from:
-        "ethereum:0x19b5804B88F10262A55ac731f28A3BbC4209853a"
+        "eth:0x19b5804B88F10262A55ac731f28A3BbC4209853a"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      receivedPermissions.1.from:
-        "ethereum:0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
+        "eth:0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      receivedPermissions.2.from:
-        "ethereum:0x12a580c05466eefb2c467C6b115844cDaF55B255"
+        "eth:0x12a580c05466eefb2c467C6b115844cDaF55B255"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      receivedPermissions.3.from:
-        "ethereum:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
+        "eth:0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      receivedPermissions.4.from:
-        "ethereum:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
+        "eth:0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      receivedPermissions.5.from:
-        "ethereum:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
+        "eth:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      receivedPermissions.6.from:
-        "ethereum:0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
+        "eth:0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      receivedPermissions.7.from:
-        "ethereum:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
+        "eth:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      receivedPermissions.8.from:
-        "ethereum:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
+        "eth:0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      receivedPermissions.9.from:
-        "ethereum:0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "eth:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
    }
```

```diff
    EOA  (0xc76C563185d01284AdbC9cF5bb909162dD2F15e7) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
+        "eth:0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
    }
```

```diff
    EOA  (0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
      receivedPermissions.1.from:
-        "ethereum:0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "eth:0xa669A743b065828682eE16109273F5CFeF5e676d"
    }
```

Generated with discovered.json: 0x8194054d8a1b82449d62eb3b648df6b075043e2f

# Diff at Mon, 16 Jun 2025 08:41:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22208300
- current block number: 22208300

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208300 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4","role":"admin"}
      directlyReceivedPermissions.8.from:
-        "ethereum:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
+        "ethereum:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
    }
```

```diff
    contract Cyber Multisig 1 (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      receivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4","role":"admin","via":[{"address":"ethereum:0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.8.from:
-        "ethereum:0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
+        "ethereum:0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9"
    }
```

Generated with discovered.json: 0xa1f761a4c19c619cf79e38a0b5ed2dbe743a3163

# Diff at Fri, 30 May 2025 06:57:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22208300
- current block number: 22208300

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208300 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x46f509a191bd30efd708e9bcb04a93e2bef09f81

# Diff at Fri, 23 May 2025 09:40:55 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22208300
- current block number: 22208300

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208300 (main branch discovery), not current.

```diff
    EOA  (0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"guard","from":"0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99","role":".GUARDIAN"}
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    EOA  (0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0xa669A743b065828682eE16109273F5CFeF5e676d","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    contract Cyber Multisig 2 (0x68ca4cDCb0F47457273B554E60ff8321D5C133E4) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x6AdE72DA6C1d47c856f13CD01Aac22A90D722e01) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
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
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract Cyber Multisig 1 (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xc76C563185d01284AdbC9cF5bb909162dD2F15e7) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"challenge","from":"0xa669A743b065828682eE16109273F5CFeF5e676d","role":".CHALLENGER"}
      receivedPermissions.0.role:
+        ".challenger"
    }
```

Generated with discovered.json: 0x4f06692db512842b8ef02d6f1c94ce5f3ad8fb0f

# Diff at Tue, 29 Apr 2025 08:19:01 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22208300
- current block number: 22208300

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208300 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions:
-        [{"permission":"interact","to":"0xc76C563185d01284AdbC9cF5bb909162dD2F15e7","description":"can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure.","via":[]},{"permission":"upgrade","to":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}]
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}]
    }
```

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","description":"set and change address mappings.","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}]
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4","via":[]},{"permission":"upgrade","to":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}]
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4","via":[]},{"permission":"upgrade","to":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}]
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x68ca4cDCb0F47457273B554E60ff8321D5C133E4","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x6AdE72DA6C1d47c856f13CD01Aac22A90D722e01","via":[]},{"permission":"upgrade","to":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}]
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275","via":[]},{"permission":"propose","to":"0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1","via":[]},{"permission":"upgrade","to":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}]
    }
```

Generated with discovered.json: 0x6df2c99d85ddd0970c4057e044327fbb9c1db388

# Diff at Sun, 06 Apr 2025 08:20:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 21235446
- current block number: 22208300

## Description

Operators change, no change to implementations.

## Watched changes

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.permission:
-        "interact"
+        "sequence"
      issuedPermissions.1.to:
-        "0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
+        "0x6AdE72DA6C1d47c856f13CD01Aac22A90D722e01"
      issuedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.0.permission:
-        "sequence"
+        "interact"
      issuedPermissions.0.to:
-        "0xf0748C52EDC23135d9845CDFB91279Cf61ee14b4"
+        "0x68ca4cDCb0F47457273B554E60ff8321D5C133E4"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      values.batcherHash:
-        "0xf0748C52EDC23135d9845CDFB91279Cf61ee14b4"
+        "0x6AdE72DA6C1d47c856f13CD01Aac22A90D722e01"
      values.owner:
-        "0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
+        "0x68ca4cDCb0F47457273B554E60ff8321D5C133E4"
      values.unsafeBlockSigner:
-        "0xa7A4D6d5920b93D0FE590f9524Ef17f24EE1F5B8"
+        "0x1F316F0F898AAb1919F9Fb9183F8D1900F721AdB"
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.2.to:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
+        "0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275"
      issuedPermissions.2.via.0:
-        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}
      issuedPermissions.1.permission:
-        "propose"
+        "upgrade"
      issuedPermissions.1.to:
-        "0xF2987f0A626c8D29dFB2E0A21144ca3026d6F1E1"
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.1.via.0:
+        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}
      issuedPermissions.0.permission:
-        "challenge"
+        "propose"
      issuedPermissions.0.to:
-        "0x87bD2cFf3b59d615b1Eac7A7f809B5e5f0Ee6752"
+        "0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1"
      values.$pastUpgrades.2:
+        ["2024-04-18T08:59:47.000Z","0x3873d6dcc852f76be0f9f8c71f927a42b055ddb43c495e17464831044ac31046",["0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"]]
      values.$pastUpgrades.1:
+        ["2025-04-05T10:01:23.000Z","0x73ee182446c88efe7fcb620040891c07867047a2f87527f0c2f313d87f9657d9",["0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"]]
      values.$pastUpgrades.0.2:
-        "2024-04-18T08:59:47.000Z"
+        ["0xA9D78F579f1B30194F3c2Ca1987A9B91A33BDF08"]
      values.$pastUpgrades.0.1:
-        "0x3873d6dcc852f76be0f9f8c71f927a42b055ddb43c495e17464831044ac31046"
+        "2025-04-05T09:37:35.000Z"
      values.$pastUpgrades.0.0:
-        ["0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"]
+        "0x8a478837105675e4e373c2a15350499aaed1c3c899df845ea10eec28b275c662"
      values.$upgradeCount:
-        1
+        3
+++ severity: HIGH
      values.challenger:
-        "0x87bD2cFf3b59d615b1Eac7A7f809B5e5f0Ee6752"
+        "0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275"
      values.CHALLENGER:
-        "0x87bD2cFf3b59d615b1Eac7A7f809B5e5f0Ee6752"
+        "0xE363e5aeAbf7F6c20589a774fCD83389ebBF0275"
+++ severity: HIGH
      values.proposer:
-        "0xF2987f0A626c8D29dFB2E0A21144ca3026d6F1E1"
+        "0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1"
      values.PROPOSER:
-        "0xF2987f0A626c8D29dFB2E0A21144ca3026d6F1E1"
+        "0x0DE6711cE623d03f0888310ca3A04a69DE0E12e1"
    }
```

```diff
    contract undefined (0xc76C563185d01284AdbC9cF5bb909162dD2F15e7) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."}
    }
```

```diff
+   Status: CREATED
    contract Cyber Multisig 2 (0x68ca4cDCb0F47457273B554E60ff8321D5C133E4)
    +++ description: None
```

## Source code changes

```diff
.../cyber/ethereum/.flat/Cyber Multisig 2/Safe.sol | 1088 ++++++++++++++++++++
 .../.flat/Cyber Multisig 2/SafeProxy.p.sol         |   37 +
 2 files changed, 1125 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract Cyber (0x1a76Ed328600489811F819959a74043f106CF0f9) {
    +++ description: None
      name:
+        "Cyber"
    }
```

```diff
    contract AltLayer 3 (0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7) {
    +++ description: None
      name:
+        "AltLayer 3"
    }
```

```diff
    contract AltLayer 1 (0xaC79765A73eB9dcBd3c427181E6819902AE25b48) {
    +++ description: None
      name:
+        "AltLayer 1"
    }
```

```diff
    contract AltLayer 2 (0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2) {
    +++ description: None
      name:
+        "AltLayer 2"
    }
```

```diff
    contract Cyber Multisig 1 (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      name:
-        "CyberMultisig"
+        "Cyber Multisig 1"
    }
```

Generated with discovered.json: 0x593b052fd6514b69536e7767ab73029863bc3607

# Diff at Thu, 27 Mar 2025 11:14:10 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21235446
- current block number: 21235446

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0xddb0cc237f83bac9998dc846134be267a48b3abb

# Diff at Wed, 19 Mar 2025 13:04:31 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21235446
- current block number: 21235446

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract undefined (0x87bD2cFf3b59d615b1Eac7A7f809B5e5f0Ee6752) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xF2987f0A626c8D29dFB2E0A21144ca3026d6F1E1) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x2b04b1577567af132086b9576da356d65d2465f1

# Diff at Tue, 04 Mar 2025 11:25:33 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21235446
- current block number: 21235446

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x3cf8e9ac4226a9d6f819d93c00c6e7adb3454990

# Diff at Tue, 04 Mar 2025 10:39:03 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21235446
- current block number: 21235446

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      sinceBlock:
+        19681273
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19681278
    }
```

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19681263
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19681267
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19681276
    }
```

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19681279
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19681281
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        19681280
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19681277
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      sinceBlock:
+        19681264
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19681283
    }
```

```diff
    contract CyberMultisig (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      sinceBlock:
+        19681262
    }
```

Generated with discovered.json: 0x4c37650040f677fcb19e242d314281ec2d886b82

# Diff at Wed, 26 Feb 2025 10:32:33 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21235446
- current block number: 21235446

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x7fe3ffbc6bc611d299fda016ab23be457bba55cc

# Diff at Fri, 21 Feb 2025 14:06:04 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21235446
- current block number: 21235446

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xd321daa444458c0d658105c89d59a6cdf742cec3

# Diff at Fri, 21 Feb 2025 08:59:20 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21235446
- current block number: 21235446

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x852146f0c6d741b1035518e0854da11d0c8cd3d6

# Diff at Mon, 10 Feb 2025 19:03:48 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21235446
- current block number: 21235446

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x25d5c2e4cb45a1a57e744ed094dfd7a1f1a7a09f

# Diff at Tue, 04 Feb 2025 12:30:56 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21235446
- current block number: 21235446

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract CyberMultisig (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x0ba4c910726e4c97550d453b3ef983b211fc15b4

# Diff at Mon, 20 Jan 2025 11:09:23 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21235446
- current block number: 21235446

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.1.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.target:
-        "0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
      issuedPermissions.0.to:
+        "0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
      issuedPermissions.0.description:
+        "can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure."
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.target:
-        "0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
      issuedPermissions.0.to:
+        "0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.target:
-        "0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
      issuedPermissions.0.to:
+        "0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.1.target:
-        "0xf0748C52EDC23135d9845CDFB91279Cf61ee14b4"
      issuedPermissions.1.to:
+        "0xf0748C52EDC23135d9845CDFB91279Cf61ee14b4"
      issuedPermissions.0.target:
-        "0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
      issuedPermissions.0.to:
+        "0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xa669A743b065828682eE16109273F5CFeF5e676d"
      directlyReceivedPermissions.8.from:
+        "0xa669A743b065828682eE16109273F5CFeF5e676d"
      directlyReceivedPermissions.7.target:
-        "0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      directlyReceivedPermissions.7.from:
+        "0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      directlyReceivedPermissions.6.target:
-        "0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
      directlyReceivedPermissions.6.from:
+        "0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
      directlyReceivedPermissions.5.target:
-        "0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
      directlyReceivedPermissions.5.from:
+        "0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
      directlyReceivedPermissions.4.target:
-        "0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
      directlyReceivedPermissions.4.from:
+        "0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
      directlyReceivedPermissions.3.target:
-        "0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      directlyReceivedPermissions.3.from:
+        "0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      directlyReceivedPermissions.2.target:
-        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
      directlyReceivedPermissions.2.from:
+        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
      directlyReceivedPermissions.1.target:
-        "0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
      directlyReceivedPermissions.1.from:
+        "0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
      directlyReceivedPermissions.0.target:
-        "0x19b5804B88F10262A55ac731f28A3BbC4209853a"
      directlyReceivedPermissions.0.from:
+        "0x19b5804B88F10262A55ac731f28A3BbC4209853a"
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.1.target:
-        "0xF2987f0A626c8D29dFB2E0A21144ca3026d6F1E1"
      issuedPermissions.1.to:
+        "0xF2987f0A626c8D29dFB2E0A21144ca3026d6F1E1"
      issuedPermissions.0.target:
-        "0x87bD2cFf3b59d615b1Eac7A7f809B5e5f0Ee6752"
      issuedPermissions.0.to:
+        "0x87bD2cFf3b59d615b1Eac7A7f809B5e5f0Ee6752"
    }
```

```diff
    contract CyberMultisig (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xa669A743b065828682eE16109273F5CFeF5e676d"
      receivedPermissions.8.from:
+        "0xa669A743b065828682eE16109273F5CFeF5e676d"
      receivedPermissions.7.target:
-        "0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      receivedPermissions.7.from:
+        "0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      receivedPermissions.6.target:
-        "0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
      receivedPermissions.6.from:
+        "0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
      receivedPermissions.5.target:
-        "0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
      receivedPermissions.5.from:
+        "0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
      receivedPermissions.4.target:
-        "0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
      receivedPermissions.4.from:
+        "0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"
      receivedPermissions.3.target:
-        "0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      receivedPermissions.3.from:
+        "0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"
      receivedPermissions.2.target:
-        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
      receivedPermissions.2.from:
+        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
      receivedPermissions.1.target:
-        "0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
      receivedPermissions.1.from:
+        "0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
      receivedPermissions.0.target:
-        "0x19b5804B88F10262A55ac731f28A3BbC4209853a"
      receivedPermissions.0.from:
+        "0x19b5804B88F10262A55ac731f28A3BbC4209853a"
      directlyReceivedPermissions.0.target:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
      directlyReceivedPermissions.0.from:
+        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
    }
```

Generated with discovered.json: 0x18049b1a80fb42ae2904cab61b7363f6c522a6ba

# Diff at Wed, 08 Jan 2025 08:59:45 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21235446
- current block number: 21235446

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235446 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xf32a7c560b60d1e8005f0b2acee345f34744d5c1

# Diff at Thu, 21 Nov 2024 10:16:05 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 20032828
- current block number: 21235446

## Description

Move to discodriven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
+        "0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
      issuedPermissions.0.via.0:
-        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
      template:
+        "opstack/DataAvailabilityChallenge"
      description:
+        "The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details."
    }
```

```diff
    contract CyberMultisig (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      name:
-        "ProxyAdminOwner"
+        "CyberMultisig"
    }
```

Generated with discovered.json: 0xdac0a6c03f05ad462b95e63b31e37329a925b2f9

# Diff at Fri, 01 Nov 2024 12:23:16 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      directlyReceivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      receivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x07b7ed095833b7856c62bc0f9cc7dc5492738598

# Diff at Tue, 29 Oct 2024 13:06:29 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xd704773eaa8c5827647ebe1a0f1e3a96ca768853

# Diff at Tue, 22 Oct 2024 13:49:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfigFake"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0x2141eae3037abbd3d928621ca2d2d6983bc3bcd7

# Diff at Mon, 21 Oct 2024 12:43:36 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

Generated with discovered.json: 0xceccaf3d5b3fec6c0bbde1ca013e52e8235d57cb

# Diff at Mon, 21 Oct 2024 11:05:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x0d93eAA86eb6948b977857750A5512Bef6B05C51"]
      values.$pastUpgrades.2.1:
-        ["0x0d93eAA86eb6948b977857750A5512Bef6B05C51"]
+        "0x3cc67944142886e727f20803c61e7bbf540886871bee9b34f032ecd9973c98e7"
      values.$pastUpgrades.1.2:
+        ["0x414066fd3dadC875531BE2992770aDab2ecB6366"]
      values.$pastUpgrades.1.1:
-        ["0x414066fd3dadC875531BE2992770aDab2ecB6366"]
+        "0x4fd0c1776784e1eb46c2163c016d617ee9ae7a8f048eee48b90ac4c4a1dd9163"
      values.$pastUpgrades.0.2:
+        ["0x0d93eAA86eb6948b977857750A5512Bef6B05C51"]
      values.$pastUpgrades.0.1:
-        ["0x0d93eAA86eb6948b977857750A5512Bef6B05C51"]
+        "0xc392745fd3e67d4347ad194517bde29387a4dc7c626b827972102ca69640dda5"
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.0.2:
+        ["0x579f8dFDAF8F180050C67B5D41342d686F2b28a6"]
      values.$pastUpgrades.0.1:
-        ["0x579f8dFDAF8F180050C67B5D41342d686F2b28a6"]
+        "0xbd49f366ad1c6d1748d1672b82335d01c71837e11be1297fc5bb7fb7862181ba"
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0xACfD93B4887cef4F05cF3440d150D2cE97339142"]
      values.$pastUpgrades.0.1:
-        ["0xACfD93B4887cef4F05cF3440d150D2cE97339142"]
+        "0xd4fd4cd6ce6aad5d056750a7b68db1a42f9867bbbd504e6a1015d94f17f03eb7"
    }
```

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.0.2:
+        ["0x849d0821B1D313b65f6FF152176F4b6a0AF7aa56"]
      values.$pastUpgrades.0.1:
-        ["0x849d0821B1D313b65f6FF152176F4b6a0AF7aa56"]
+        "0xbd95ce28613d85f3168404146fdc7ac9eff1b161479cea7504d95d7bf2dfccd2"
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x1234c7a75f40551Fce5aFf1d58efD72F2ee2AFB1"]
      values.$pastUpgrades.0.1:
-        ["0x1234c7a75f40551Fce5aFf1d58efD72F2ee2AFB1"]
+        "0x45f84739a98d87d3f74dc44571cac69b624fd3e0cd2ac82ce23aabec05e51fb3"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0x985F187489954435ddf9571D45500184566e4B46"]
      values.$pastUpgrades.0.1:
-        ["0x985F187489954435ddf9571D45500184566e4B46"]
+        "0x8b50a69675b2c276948af99ad89046cbc03b5fe33b9ddaeaacf3f31572ad3184"
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x726C6ac8A53061e56AfB2c890545348ba6f0DF0E"]
      values.$pastUpgrades.0.1:
-        ["0x726C6ac8A53061e56AfB2c890545348ba6f0DF0E"]
+        "0x7baf10386f86fa4c2c95447255dcc4abd2fa9444f3972cefd55c53e9fb9e7998"
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"]
      values.$pastUpgrades.0.1:
-        ["0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"]
+        "0x3873d6dcc852f76be0f9f8c71f927a42b055ddb43c495e17464831044ac31046"
    }
```

Generated with discovered.json: 0x2aa993b0d384a78918c03ad3988d446cbd6d02a1

# Diff at Wed, 16 Oct 2024 11:35:37 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
+        "0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
      issuedPermissions.0.via.0:
-        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
+        "0x0C883f622b4ccbF1e8ce86217998f87e6d36BCE4"
      issuedPermissions.0.via.0:
-        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
+        "0xf0748C52EDC23135d9845CDFB91279Cf61ee14b4"
      issuedPermissions.1.via.0:
-        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xF2987f0A626c8D29dFB2E0A21144ca3026d6F1E1","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
+        "0x87bD2cFf3b59d615b1Eac7A7f809B5e5f0Ee6752"
      issuedPermissions.0.via.0:
-        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

Generated with discovered.json: 0xc6f6bdfbedde83896b9b1fbd5e190af4efad8f02

# Diff at Mon, 14 Oct 2024 10:50:16 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: None
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xc3e65c7b165290e34daf0095d095072dd3684f21965a97ddedde3ab52b34b04a"]
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x0703ec863413d4777006fa1131d89b673d67f4ce

# Diff at Wed, 09 Oct 2024 13:09:11 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x74cc3490a03a5c24e9added87e705464116aabf5

# Diff at Tue, 01 Oct 2024 10:50:32 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-18T08:52:59.000Z",["0x0d93eAA86eb6948b977857750A5512Bef6B05C51"]],["2024-05-14T07:21:47.000Z",["0x414066fd3dadC875531BE2992770aDab2ecB6366"]],["2024-05-14T07:51:23.000Z",["0x0d93eAA86eb6948b977857750A5512Bef6B05C51"]]]
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-04-18T08:51:47.000Z",["0x579f8dFDAF8F180050C67B5D41342d686F2b28a6"]]]
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-04-18T09:00:35.000Z",["0xACfD93B4887cef4F05cF3440d150D2cE97339142"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-04-18T08:59:23.000Z",["0x849d0821B1D313b65f6FF152176F4b6a0AF7aa56"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-04-18T08:58:35.000Z",["0x1234c7a75f40551Fce5aFf1d58efD72F2ee2AFB1"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-04-18T08:58:47.000Z",["0x985F187489954435ddf9571D45500184566e4B46"]]]
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-04-18T08:57:59.000Z",["0x726C6ac8A53061e56AfB2c890545348ba6f0DF0E"]]]
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-04-18T08:59:47.000Z",["0x93E1c0D8ef27930130fb809CE18ca681A8C32F85"]]]
    }
```

Generated with discovered.json: 0x4bb4a0cce5002d546b21d49a859ce205e742497e

# Diff at Thu, 12 Sep 2024 15:35:40 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@e6761599b8d9e0b597372bb0e9ca885e08af7101 block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
+        "0xc76C563185d01284AdbC9cF5bb909162dD2F15e7"
      issuedPermissions.0.via.0:
-        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

Generated with discovered.json: 0x89bcda63da18739f704d921638bcff24d6b81e9d

# Diff at Sun, 08 Sep 2024 17:24:23 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0:
+        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0:
+        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0:
+        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0:
+        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0:
+        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0:
+        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0:
+        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.target:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0:
+        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x19b5804B88F10262A55ac731f28A3BbC4209853a"},{"permission":"upgrade","target":"0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"},{"permission":"upgrade","target":"0x12a580c05466eefb2c467C6b115844cDaF55B255"},{"permission":"upgrade","target":"0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"},{"permission":"upgrade","target":"0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"},{"permission":"upgrade","target":"0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"},{"permission":"upgrade","target":"0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"},{"permission":"upgrade","target":"0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"},{"permission":"upgrade","target":"0xa669A743b065828682eE16109273F5CFeF5e676d"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x19b5804B88F10262A55ac731f28A3BbC4209853a"},{"permission":"upgrade","target":"0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"},{"permission":"upgrade","target":"0x12a580c05466eefb2c467C6b115844cDaF55B255","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D"},{"permission":"upgrade","target":"0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99"},{"permission":"upgrade","target":"0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"},{"permission":"upgrade","target":"0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"},{"permission":"upgrade","target":"0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"},{"permission":"upgrade","target":"0xa669A743b065828682eE16109273F5CFeF5e676d"}]
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398"
      issuedPermissions.0.via.0:
+        {"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","delay":0}
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x7E54107731EC43e78DA678DFa5fB6222Ad036e03, inheriting its permissions."]
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xa669A743b065828682eE16109273F5CFeF5e676d","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x12a580c05466eefb2c467C6b115844cDaF55B255","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49","via":[{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]}
      receivedPermissions.0.target:
-        "0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"
+        "0x19b5804B88F10262A55ac731f28A3BbC4209853a"
      receivedPermissions.0.via:
+        [{"address":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"}]
    }
```

Generated with discovered.json: 0x6b94bcd8f156c4c7a56450fb09d50d4be972cf64

# Diff at Fri, 30 Aug 2024 07:51:49 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
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
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: It can act on behalf of 0x7E54107731EC43e78DA678DFa5fB6222Ad036e03, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xb41cff9c5779c377d9e59dfeb80f239bb5fed544

# Diff at Fri, 23 Aug 2024 09:51:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x4cb868d55887fc0f08e997e8b1995b5729c81918

# Diff at Wed, 21 Aug 2024 10:02:35 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49","0x12a580c05466eefb2c467C6b115844cDaF55B255","0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D","0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99","0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd","0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4","0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055","0xa669A743b065828682eE16109273F5CFeF5e676d"],"configure":["0x19b5804B88F10262A55ac731f28A3BbC4209853a"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x19b5804B88F10262A55ac731f28A3BbC4209853a","via":[]},{"permission":"upgrade","target":"0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49","via":[]},{"permission":"upgrade","target":"0x12a580c05466eefb2c467C6b115844cDaF55B255","via":[]},{"permission":"upgrade","target":"0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D","via":[]},{"permission":"upgrade","target":"0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99","via":[]},{"permission":"upgrade","target":"0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd","via":[]},{"permission":"upgrade","target":"0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4","via":[]},{"permission":"upgrade","target":"0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055","via":[]},{"permission":"upgrade","target":"0xa669A743b065828682eE16109273F5CFeF5e676d","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: It can act on behalf of 0x7E54107731EC43e78DA678DFa5fB6222Ad036e03, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

Generated with discovered.json: 0xd0a9aa16fd55fedaae26d35743f79d92292f5ba9

# Diff at Fri, 09 Aug 2024 11:59:05 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.7:
-        "0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
+        "0xa669A743b065828682eE16109273F5CFeF5e676d"
      assignedPermissions.upgrade.6:
-        "0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
+        "0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      assignedPermissions.upgrade.5:
-        "0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
+        "0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
      assignedPermissions.upgrade.4:
-        "0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
      assignedPermissions.upgrade.1:
-        "0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
+        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
      assignedPermissions.upgrade.0:
-        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
+        "0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
    }
```

Generated with discovered.json: 0x09cff86baf3a6efb2719c8d8ad52ddfc6cb7c521

# Diff at Fri, 09 Aug 2024 10:09:12 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49","0x12a580c05466eefb2c467C6b115844cDaF55B255","0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D","0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99","0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd","0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4","0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055","0xa669A743b065828682eE16109273F5CFeF5e676d"]
      assignedPermissions.owner:
-        ["0x19b5804B88F10262A55ac731f28A3BbC4209853a"]
      assignedPermissions.upgrade:
+        ["0x12a580c05466eefb2c467C6b115844cDaF55B255","0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49","0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D","0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99","0xa669A743b065828682eE16109273F5CFeF5e676d","0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055","0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4","0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"]
      assignedPermissions.configure:
+        ["0x19b5804B88F10262A55ac731f28A3BbC4209853a"]
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: It can act on behalf of 0x7E54107731EC43e78DA678DFa5fB6222Ad036e03, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"]
      assignedPermissions.configure:
+        ["0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"]
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2","0xaC79765A73eB9dcBd3c427181E6819902AE25b48","0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7","0x1a76Ed328600489811F819959a74043f106CF0f9"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2","0xaC79765A73eB9dcBd3c427181E6819902AE25b48","0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7","0x1a76Ed328600489811F819959a74043f106CF0f9"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0xd1a127cc971270b32d9e81215625b88768a84afb

# Diff at Tue, 30 Jul 2024 11:11:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0xe7dd9477f228d06317c8bfc69e1bb5c7b7d1cc28

# Diff at Thu, 18 Jul 2024 10:30:30 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: None
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: None
      template:
+        "opstack/SuperchainConfig"
      descriptions:
+        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      categories:
+        ["Upgrades&Governance"]
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: None
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: None
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: None
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x7E54107731EC43e78DA678DFa5fB6222Ad036e03, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x51efc218ab04b3da7821488a55fc4c9bbad2a919

# Diff at Thu, 06 Jun 2024 12:37:16 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@5302ef2899ddfb7175df497ceaa47fba4e383655 block: 19888830
- current block number: 20032828

## Description

Discovery output now includes names of templates used for contract analysis.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19888830 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x97e1f05644a07a906b0c40d7e6979a3d9279b28e

# Diff at Fri, 17 May 2024 09:35:04 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cf6498d339a075296e717008e17a69561c236726 block: 19875660
- current block number: 19888830

## Description

Signers added to Owner Multisig, threshold changed to 3/4. EOA warning is removed.

The DAChallenge contract has resolverRefundPercentage set to 100%. A successful resolve now gets `( fixedResolutionCost + preImageLength * variableResolutionCost / variableResolutionCostPrecision ) * block.basefee` as a refund. Depending on the other variables, a malicious Sequencer can now challenge itself infinitely without cost.

## Watched changes

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: None
      values.resolverRefundPercentage:
-        0
+        100
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      upgradeability.threshold:
-        "1 of 1 (100%)"
+        "3 of 4 (75%)"
      values.getOwners.3:
+        "0x1a76Ed328600489811F819959a74043f106CF0f9"
      values.getOwners.2:
+        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
      values.getOwners.1:
+        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
      values.getOwners.0:
-        "0x1a76Ed328600489811F819959a74043f106CF0f9"
+        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
      values.getThreshold:
-        1
+        3
    }
```

Generated with discovered.json: 0xf826b642d402796210be75a928daf70a983bd0df

# Diff at Wed, 15 May 2024 13:24:31 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19875660

## Description

Initial discovery: Cyber is an OP stack plasma mode L2 using custom DA (currently not yet EigenDA).

## Initial discovery

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d)
    +++ description: Central actor allowed to post new L2 state roots to L1.
```

```diff
+   Status: CREATED
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398)
    +++ description: None
```

