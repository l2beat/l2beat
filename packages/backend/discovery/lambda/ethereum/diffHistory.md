Generated with discovered.json: 0xdae9c1fd4a7fefa9fb8302dd2d3adfcd9f1c5207

# Diff at Wed, 09 Oct 2024 13:09:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract GnosisSafe (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x67aeb5b0b1211db969dd7f2026f0e3000f712321

# Diff at Mon, 07 Oct 2024 15:59:23 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7c3e632caf56b943789c1bfa1021d4f65d503045 block: 20111587
- current block number: 20914730

## Description

Use discovery driven data, 1/1 Safe is not recognized as transparent. (willfix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      name:
-        "LambdaOwnerMultisig"
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0xf58915ced5c6b5a18bc7068ed36e1b393fa6ac82

# Diff at Tue, 01 Oct 2024 10:51:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-04-17T09:44:23.000Z",["0x527021A71d6E76Bb4243A0BabAd4e160245b8aAE"]]]
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-04-17T09:53:23.000Z",["0x850DFdB4035db757e49eCF997ef051290959167A"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-04-17T09:51:59.000Z",["0x4CA20D48C87129Df90A3cAd73000568331548316"]]]
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-04-17T09:54:23.000Z",["0x5865A0BCf08dd24A0691Dc746F181EDc6821bea9"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-04-17T09:52:47.000Z",["0x26B5810033fd2380c87F9E22CC20101778b5F584"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-04-17T09:51:23.000Z",["0x5121000767198Ad7D60fe8e47458F556B7B51aa0"]]]
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-04-17T09:50:47.000Z",["0x781dAB53cC9d9870a96A84f4AE3130c084a2fAfD"]]]
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x5cbdda2345c98b2145d68505782ed0c98d0149c5

# Diff at Sun, 08 Sep 2024 17:24:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x624808dc4A34B79B90C3c085942D2100F09A0376"},{"permission":"upgrade","target":"0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c"},{"permission":"upgrade","target":"0x2297eB8DC91f532C91c57b3fb33C06b782e9594A"},{"permission":"upgrade","target":"0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"},{"permission":"upgrade","target":"0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054"},{"permission":"upgrade","target":"0x8334f9A70294556101527bfB9bdEdeF7EB382D94"},{"permission":"upgrade","target":"0xae809d42f861A6381b0DFCf7216556e95362a7a8"},{"permission":"upgrade","target":"0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x624808dc4A34B79B90C3c085942D2100F09A0376"},{"permission":"upgrade","target":"0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c"},{"permission":"upgrade","target":"0x2297eB8DC91f532C91c57b3fb33C06b782e9594A"},{"permission":"upgrade","target":"0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"},{"permission":"upgrade","target":"0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054"},{"permission":"upgrade","target":"0x8334f9A70294556101527bfB9bdEdeF7EB382D94"},{"permission":"upgrade","target":"0xae809d42f861A6381b0DFCf7216556e95362a7a8"},{"permission":"upgrade","target":"0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","description":"upgrading bridge implementation allows to access all funds and change every system component."}]
    }
```

```diff
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f, inheriting its permissions."]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xae809d42f861A6381b0DFCf7216556e95362a7a8","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x8334f9A70294556101527bfB9bdEdeF7EB382D94","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x2297eB8DC91f532C91c57b3fb33C06b782e9594A","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x624808dc4A34B79B90C3c085942D2100F09A0376"
      receivedPermissions.0.via:
+        [{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.1.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

Generated with discovered.json: 0x6ee629293bc6f12e48a5b5709f5116e2254d664c

# Diff at Fri, 30 Aug 2024 07:53:18 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
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
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: It can act on behalf of 0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xf72ac42e630ec58f61824950475ff9eab4c7848c

# Diff at Fri, 23 Aug 2024 09:52:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x5a61b96bdd037a661260a482c2127738b15d5efc

# Diff at Wed, 21 Aug 2024 10:03:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c","0x2297eB8DC91f532C91c57b3fb33C06b782e9594A","0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4","0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054","0x8334f9A70294556101527bfB9bdEdeF7EB382D94","0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","0xae809d42f861A6381b0DFCf7216556e95362a7a8"],"configure":["0x624808dc4A34B79B90C3c085942D2100F09A0376"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x624808dc4A34B79B90C3c085942D2100F09A0376","via":[]},{"permission":"upgrade","target":"0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c","via":[]},{"permission":"upgrade","target":"0x2297eB8DC91f532C91c57b3fb33C06b782e9594A","via":[]},{"permission":"upgrade","target":"0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4","via":[]},{"permission":"upgrade","target":"0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054","via":[]},{"permission":"upgrade","target":"0x8334f9A70294556101527bfB9bdEdeF7EB382D94","via":[]},{"permission":"upgrade","target":"0xae809d42f861A6381b0DFCf7216556e95362a7a8","via":[]},{"permission":"upgrade","target":"0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","via":[]}]
    }
```

```diff
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: It can act on behalf of 0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40","via":[]},{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

Generated with discovered.json: 0x841bbb48ff20bea605aa98e2f2ff03c1b630db65

# Diff at Fri, 09 Aug 2024 11:59:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.6:
-        "0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"
+        "0xae809d42f861A6381b0DFCf7216556e95362a7a8"
      assignedPermissions.upgrade.3:
-        "0xae809d42f861A6381b0DFCf7216556e95362a7a8"
+        "0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054"
      assignedPermissions.upgrade.2:
-        "0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c"
+        "0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"
      assignedPermissions.upgrade.0:
-        "0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054"
+        "0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c"
    }
```

Generated with discovered.json: 0xa80328fdf85cd3455fa14f6c53b9727a8ab8ed89

# Diff at Fri, 09 Aug 2024 10:10:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c","0x2297eB8DC91f532C91c57b3fb33C06b782e9594A","0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4","0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054","0x8334f9A70294556101527bfB9bdEdeF7EB382D94","0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","0xae809d42f861A6381b0DFCf7216556e95362a7a8"]
      assignedPermissions.owner:
-        ["0x624808dc4A34B79B90C3c085942D2100F09A0376"]
      assignedPermissions.upgrade:
+        ["0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054","0x2297eB8DC91f532C91c57b3fb33C06b782e9594A","0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c","0xae809d42f861A6381b0DFCf7216556e95362a7a8","0x8334f9A70294556101527bfB9bdEdeF7EB382D94","0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"]
      assignedPermissions.configure:
+        ["0x624808dc4A34B79B90C3c085942D2100F09A0376"]
    }
```

```diff
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: It can act on behalf of 0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"]
      assignedPermissions.configure:
+        ["0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"]
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

Generated with discovered.json: 0x77aae1d165f3c654cdd307d99acf8d79097c3638

# Diff at Tue, 30 Jul 2024 11:12:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x11ad2fe16fdc0505518d5560b77a3be12667cecd

# Diff at Thu, 18 Jul 2024 10:31:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
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
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f, inheriting its permissions."]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions.0:
-        "The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions.0:
-        "Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function."
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
      categories:
+        ["Core"]
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions.0:
-        "Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: None
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      categories:
+        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x0ab7f1a958bfb52aa19a321df6c754c25ec26cd0

# Diff at Mon, 17 Jun 2024 12:45:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20111587

## Description

Initial discovery:
Lambda Chain is an OP stack L2, publishing blobs to Ethereum. The TVL (USD ~3M) is almost exclusively in the associated token LAMB.
Lambda is developing decentralized modular storage services. EOA-upgradable.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054)
    +++ description: The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7)
    +++ description: Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8)
    +++ description: Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F)
    +++ description: None
```
