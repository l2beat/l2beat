Generated with discovered.json: 0x284f1ba9e910d9863bb018d5f12de92c9b02c3f9

# Diff at Wed, 09 Oct 2024 13:10:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0xFe27f187A9E46104a932189dDF229871E06B22F8","description":"set and change address mappings.","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x4b5b41c240173191425F5928bc6bdd0d439331BB","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x5f962474834Cf1981Df6232e4b6431d3d10cb71D","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0x97A2dA87d3439b172e6DD027220e01c9Cb565B80","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0xa130523fD22e2a9D78F8aB232b01ff552845B4A9","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0xa426A052f657AEEefc298b3B5c35a470e4739d69","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]},{"permission":"upgrade","target":"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","via":[{"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2"}]
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.1.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0xFe27f187A9E46104a932189dDF229871E06B22F8"},{"permission":"upgrade","target":"0x4b5b41c240173191425F5928bc6bdd0d439331BB"},{"permission":"upgrade","target":"0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"},{"permission":"upgrade","target":"0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"},{"permission":"upgrade","target":"0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"},{"permission":"upgrade","target":"0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98"},{"permission":"upgrade","target":"0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"},{"permission":"upgrade","target":"0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"},{"permission":"upgrade","target":"0xa426A052f657AEEefc298b3B5c35a470e4739d69"},{"permission":"upgrade","target":"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"}]
      template:
+        "opstack/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xFe27f187A9E46104a932189dDF229871E06B22F8","description":"set and change address mappings."},{"permission":"upgrade","target":"0x4b5b41c240173191425F5928bc6bdd0d439331BB"},{"permission":"upgrade","target":"0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"},{"permission":"upgrade","target":"0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"},{"permission":"upgrade","target":"0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"},{"permission":"upgrade","target":"0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98"},{"permission":"upgrade","target":"0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"},{"permission":"upgrade","target":"0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"},{"permission":"upgrade","target":"0xa426A052f657AEEefc298b3B5c35a470e4739d69"},{"permission":"upgrade","target":"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"}]
    }
```

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89"
      issuedPermissions.0.via.0:
+        {"address":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","delay":0,"description":"set and change address mappings."}
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x4707c84e1b48a87393f2811fe8c352c489ec3f9e

# Diff at Tue, 01 Oct 2024 10:54:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-04-03T22:47:47.000Z",["0x45920c2242a7F2121716431Dd7c2d68740726934"]]]
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-04-03T22:54:47.000Z",["0x91Cb4eb84F7117196B1c117C7705F2eAF55AfA16"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-04-03T22:55:35.000Z",["0x17AaA27ecEc9a0c530e6Dbd086b6049DCF6D9382"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-04-03T22:54:59.000Z",["0x9a3292E64C7b7bf6E04c1ebC7D6671bD82dAbf8B"]]]
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-04-03T22:54:11.000Z",["0xd20eF07Ca38301735782e3B89c0E192fD8Ec002d"]]]
    }
```

```diff
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-03T22:56:23.000Z",["0x4ed3b4332B2d14CD01a68F4e9d1A24E2e4BDa427"]]]
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-03T22:48:59.000Z",["0xba2507dbC415e0D0fa3AA10C2D4559049A93d946"]]]
    }
```

```diff
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-03T22:56:35.000Z",["0x7415C3928718d14FB9A4160c78e53f6DA282Ebbc"]]]
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-04-03T22:55:59.000Z",["0xB78071f03F4D7601129773070F2Dde6184e1BD87"]]]
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-04-03T22:56:59.000Z",["0xD0e1065F2A941Dd723F800C34D2D4282C3158A00"]]]
    }
```

Generated with discovered.json: 0xa526e146c92b2e9e53f7089d48c773ab4b5f7512

# Diff at Thu, 12 Sep 2024 15:38:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@e6761599b8d9e0b597372bb0e9ca885e08af7101 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0xCC53b447aFe07926423aB96D5496b1af30485ED2"
+        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
    }
```

Generated with discovered.json: 0xa3f4b7a7607ed5f77ed8a412d3d532b6dcc1685d

# Diff at Sun, 08 Sep 2024 17:24:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      receivedPermissions.9.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

Generated with discovered.json: 0x2d4fd87e5fb9446fe7e9ccb8e79572459ccf3999

# Diff at Fri, 30 Aug 2024 07:56:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions.10.via:
-        []
      receivedPermissions.9.via:
-        []
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

Generated with discovered.json: 0xb2dc5858819a071d0f96a8aaea006ddab7f899fc

# Diff at Fri, 23 Aug 2024 09:54:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x7a956280c2a98972735887b98527cbd54c123f04

# Diff at Wed, 21 Aug 2024 10:05:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4","0x4b5b41c240173191425F5928bc6bdd0d439331BB","0x5f962474834Cf1981Df6232e4b6431d3d10cb71D","0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D","0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98","0x97A2dA87d3439b172e6DD027220e01c9Cb565B80","0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","0xa130523fD22e2a9D78F8aB232b01ff552845B4A9","0xa426A052f657AEEefc298b3B5c35a470e4739d69","0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"],"configure":["0xFe27f187A9E46104a932189dDF229871E06B22F8"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xFe27f187A9E46104a932189dDF229871E06B22F8","via":[]},{"permission":"upgrade","target":"0x4b5b41c240173191425F5928bc6bdd0d439331BB","via":[]},{"permission":"upgrade","target":"0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4","via":[]},{"permission":"upgrade","target":"0x5f962474834Cf1981Df6232e4b6431d3d10cb71D","via":[]},{"permission":"upgrade","target":"0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D","via":[]},{"permission":"upgrade","target":"0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98","via":[]},{"permission":"upgrade","target":"0x97A2dA87d3439b172e6DD027220e01c9Cb565B80","via":[]},{"permission":"upgrade","target":"0xa130523fD22e2a9D78F8aB232b01ff552845B4A9","via":[]},{"permission":"upgrade","target":"0xa426A052f657AEEefc298b3B5c35a470e4739d69","via":[]},{"permission":"upgrade","target":"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","via":[]},{"permission":"upgrade","target":"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","via":[]}]
    }
```

```diff
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xCC53b447aFe07926423aB96D5496b1af30485ED2","via":[]}]
    }
```

Generated with discovered.json: 0x33dc285c032ae58e69afa1c98a32724786bb2663

# Diff at Fri, 09 Aug 2024 12:01:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.9:
-        "0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"
+        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      assignedPermissions.upgrade.8:
-        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
+        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
      assignedPermissions.upgrade.7:
-        "0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
+        "0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"
      assignedPermissions.upgrade.5:
-        "0xa426A052f657AEEefc298b3B5c35a470e4739d69"
+        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
      assignedPermissions.upgrade.4:
-        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
+        "0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98"
      assignedPermissions.upgrade.3:
-        "0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
+        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
      assignedPermissions.upgrade.2:
-        "0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98"
+        "0x5f962474834Cf1981Df6232e4b6431d3d10cb71D"
      assignedPermissions.upgrade.1:
-        "0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D"
+        "0x4b5b41c240173191425F5928bc6bdd0d439331BB"
      assignedPermissions.upgrade.0:
-        "0x97A2dA87d3439b172e6DD027220e01c9Cb565B80"
+        "0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4"
    }
```

Generated with discovered.json: 0x54a2ddb99f629fcf58a5adbc7d6e271f8e71e9a1

# Diff at Fri, 09 Aug 2024 10:11:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8","0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450","0x7211399b320a0417286897fCeD1ee4ba1C1771d4"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8","0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450","0x7211399b320a0417286897fCeD1ee4ba1C1771d4"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4","0x4b5b41c240173191425F5928bc6bdd0d439331BB","0x5f962474834Cf1981Df6232e4b6431d3d10cb71D","0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D","0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98","0x97A2dA87d3439b172e6DD027220e01c9Cb565B80","0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","0xa130523fD22e2a9D78F8aB232b01ff552845B4A9","0xa426A052f657AEEefc298b3B5c35a470e4739d69","0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"]
      assignedPermissions.owner:
-        ["0xFe27f187A9E46104a932189dDF229871E06B22F8"]
      assignedPermissions.upgrade:
+        ["0x97A2dA87d3439b172e6DD027220e01c9Cb565B80","0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D","0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98","0x5f962474834Cf1981Df6232e4b6431d3d10cb71D","0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69","0xa426A052f657AEEefc298b3B5c35a470e4739d69","0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae","0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4","0x4b5b41c240173191425F5928bc6bdd0d439331BB","0xa130523fD22e2a9D78F8aB232b01ff552845B4A9"]
      assignedPermissions.configure:
+        ["0xFe27f187A9E46104a932189dDF229871E06B22F8"]
    }
```

Generated with discovered.json: 0x8080f6b341ed853b1b78a52d7f943b56c347e976

# Diff at Tue, 30 Jul 2024 11:13:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x42b0896c07a6f4663a5afad0472fd7d120ecea0e

# Diff at Thu, 18 Jul 2024 10:32:57 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19831040
- current block number: 19831040

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19831040 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB) {
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
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a) {
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
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D) {
    +++ description: None
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
    }
```

```diff
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69) {
    +++ description: None
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69) {
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
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae) {
    +++ description: None
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

Generated with discovered.json: 0xb990382e14702eae00a5fe05d18bee4ea8b31e66

# Diff at Thu, 09 May 2024 07:38:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3bba0812727b9105a3f44fe55a68572c804b992 block: 19810497
- current block number: 19831040

## Description

The ProxyAdminOwner Multisig has two new signers and is now 2/3. Challenger, Guardian, SystemConfig, DataAvailabilityChallenge stay EOA-owned.

## Watched changes

```diff
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      upgradeability.threshold:
-        "1 of 1 (100%)"
+        "2 of 3 (67%)"
      values.getOwners.2:
+        "0x7211399b320a0417286897fCeD1ee4ba1C1771d4"
      values.getOwners.1:
+        "0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450"
      values.getOwners.0:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+        "0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8"
      values.getThreshold:
-        1
+        2
    }
```

Generated with discovered.json: 0x8c5f2b36bcdbbb428884c05c17a594382bc8a420

# Diff at Mon, 06 May 2024 10:38:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 19810497

## Description

OP stack chain in Plasma mode (DA challenges, not really Plasma imo). Reading the project page is enough to understand the system, in particular the Technology section. In the discovery there are additional contracts related to the proof system (the one live on Sepolia for OP Mainnet) but they are currently not utilized and disconnected. The way to notice that is that this system is still using the L2OutputOracle for state roots while in the version with the fraud proof system it is deprecated.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x5A50b05676705cd0189970d806a7c9d2a0201Da7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x66D6be83984e3F026B4a9e2D8Fb082ecDBd43648)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xC5E3333f1Dd5e5bBca0Cf49B8799E0Eb567000ba)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xE7d0fE72637B3C949cd81c63A4Ff1fb23feeF3b2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8)
    +++ description: None
```
