Generated with discovered.json: 0x56b0e43255c1d3dcb56e7806c86c2f7f99b9a2dd

# Diff at Wed, 09 Oct 2024 13:11:11 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 17827903
- current block number: 17827903

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17827903 (main branch discovery), not current.

```diff
    contract HamMultisig1 (0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0xc7cd63b087f9437f4dab5766339458c94af67206

# Diff at Tue, 01 Oct 2024 11:13:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 17827903
- current block number: 17827903

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17827903 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-05-24T23:09:53.000Z",["0x19652082F846171168Daf378C4fD3ee85a0D4A60"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3c69dcFF018766c72449cd460Cc7AF8863056a43) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-05-24T23:09:19.000Z",["0x39Aea2Dd53f2d01c15877aCc2791af6BDD7aD567"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x3Ef6ce577FC438591d6C683E7a6Ea9e14A8f2d36) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-05-24T23:09:39.000Z",["0x71fA82Ea96672797954C28032b337aA40AAFC99f"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-05-24T23:09:11.000Z",["0x44637A4292E0CD2B17A55d5F6B2F05AFcAcD0586"]]]
    }
```

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-05-24T23:08:51.000Z",["0xffbA8944650e26653823658d76A122946F27e2f2"]]]
    }
```

```diff
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-05-24T23:10:29.000Z",["0xCEa36be2e9724d88cB107C552c602a8025DB88bA"]]]
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-05-24T23:06:57.000Z",["0x068E44eB31e111028c41598E4535be7468674D0A"]]]
    }
```

Generated with discovered.json: 0x9542d91244c0d438b6fe539d611684c2b94d5158

# Diff at Sun, 08 Sep 2024 17:24:57 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 17827903
- current block number: 17827903

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17827903 (main branch discovery), not current.

```diff
    contract HamMultisig1 (0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49, inheriting its permissions."]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xFC57b0947C079073A1C5Fe61887Eb3495972EE72","via":[{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01","via":[{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd","via":[{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x936c137699230c4732d534c7E968cC7cEAa6Cf45","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x80292D35789462aeD1D694899f1FaAE184Fe3E5b","via":[{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x3c69dcFF018766c72449cd460Cc7AF8863056a43","via":[{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF","via":[{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"}]}
      receivedPermissions.0.target:
-        "0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"
+        "0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE"
      receivedPermissions.0.via:
+        [{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"}]
    }
```

```diff
    contract L2OutputOracle (0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.via.0:
+        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3c69dcFF018766c72449cd460Cc7AF8863056a43) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.via.0:
+        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE"},{"permission":"upgrade","target":"0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF"},{"permission":"upgrade","target":"0x3c69dcFF018766c72449cd460Cc7AF8863056a43"},{"permission":"upgrade","target":"0x80292D35789462aeD1D694899f1FaAE184Fe3E5b"},{"permission":"upgrade","target":"0x936c137699230c4732d534c7E968cC7cEAa6Cf45"},{"permission":"upgrade","target":"0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"},{"permission":"upgrade","target":"0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"},{"permission":"upgrade","target":"0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE"},{"permission":"upgrade","target":"0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF"},{"permission":"upgrade","target":"0x3c69dcFF018766c72449cd460Cc7AF8863056a43"},{"permission":"upgrade","target":"0x80292D35789462aeD1D694899f1FaAE184Fe3E5b"},{"permission":"upgrade","target":"0x936c137699230c4732d534c7E968cC7cEAa6Cf45","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"},{"permission":"upgrade","target":"0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"},{"permission":"upgrade","target":"0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"}]
    }
```

```diff
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.via.0:
+        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}
    }
```

```diff
    contract HamMultisig2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      descriptions:
-        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.via.0:
+        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.1.via.0:
+        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}
    }
```

```diff
    contract AddressManager (0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.via.0:
+        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}
    }
```

```diff
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.via.0:
+        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.via.0:
+        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}
    }
```

Generated with discovered.json: 0x04044034b4355837ccdbcab570cee14e21940e53

# Diff at Fri, 30 Aug 2024 08:17:19 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 17827903
- current block number: 17827903

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17827903 (main branch discovery), not current.

```diff
    contract HamMultisig1 (0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA) {
    +++ description: It can act on behalf of 0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49) {
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
    contract HamMultisig2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x96f6b8f688bf4acf5eec5b2c2a2768562f1f06f2

# Diff at Fri, 23 Aug 2024 09:57:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 17827903
- current block number: 17827903

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17827903 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3c69dcFF018766c72449cd460Cc7AF8863056a43) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x205037240f048f0e413e130c935341e18ac25a27

# Diff at Wed, 21 Aug 2024 10:07:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 17827903
- current block number: 17827903

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17827903 (main branch discovery), not current.

```diff
    contract HamMultisig1 (0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA) {
    +++ description: It can act on behalf of 0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3c69dcFF018766c72449cd460Cc7AF8863056a43) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF","0x3c69dcFF018766c72449cd460Cc7AF8863056a43","0x80292D35789462aeD1D694899f1FaAE184Fe3E5b","0x936c137699230c4732d534c7E968cC7cEAa6Cf45","0xFC57b0947C079073A1C5Fe61887Eb3495972EE72","0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd","0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"],"configure":["0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE","via":[]},{"permission":"upgrade","target":"0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF","via":[]},{"permission":"upgrade","target":"0x3c69dcFF018766c72449cd460Cc7AF8863056a43","via":[]},{"permission":"upgrade","target":"0x80292D35789462aeD1D694899f1FaAE184Fe3E5b","via":[]},{"permission":"upgrade","target":"0x936c137699230c4732d534c7E968cC7cEAa6Cf45","via":[]},{"permission":"upgrade","target":"0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd","via":[]},{"permission":"upgrade","target":"0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01","via":[]},{"permission":"upgrade","target":"0xFC57b0947C079073A1C5Fe61887Eb3495972EE72","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","via":[]}]
    }
```

```diff
    contract HamMultisig2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","via":[]}]
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d","via":[]},{"permission":"upgrade","target":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","via":[]}]
    }
```

```diff
    contract AddressManager (0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","via":[]}]
    }
```

Generated with discovered.json: 0x2d10eef9fe58935ec177f4fbe823f1e11cb1a7d0

# Diff at Fri, 09 Aug 2024 12:04:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 17827903
- current block number: 17827903

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17827903 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.6:
-        "0x80292D35789462aeD1D694899f1FaAE184Fe3E5b"
+        "0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"
      assignedPermissions.upgrade.5:
-        "0x3c69dcFF018766c72449cd460Cc7AF8863056a43"
+        "0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"
      assignedPermissions.upgrade.4:
-        "0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"
+        "0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"
      assignedPermissions.upgrade.3:
-        "0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF"
+        "0x936c137699230c4732d534c7E968cC7cEAa6Cf45"
      assignedPermissions.upgrade.2:
-        "0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"
+        "0x80292D35789462aeD1D694899f1FaAE184Fe3E5b"
      assignedPermissions.upgrade.1:
-        "0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"
+        "0x3c69dcFF018766c72449cd460Cc7AF8863056a43"
      assignedPermissions.upgrade.0:
-        "0x936c137699230c4732d534c7E968cC7cEAa6Cf45"
+        "0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF"
    }
```

Generated with discovered.json: 0xab4168bacbfba6fbd1fd917ef4c80a79fa4c1c9c

# Diff at Fri, 09 Aug 2024 10:14:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 17827903
- current block number: 17827903

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17827903 (main branch discovery), not current.

```diff
    contract HamMultisig1 (0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA) {
    +++ description: It can act on behalf of 0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"]
      assignedPermissions.configure:
+        ["0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"]
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9","0x356000Cec4fC967f8FC372381D983426760A0391","0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9","0x356000Cec4fC967f8FC372381D983426760A0391","0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF","0x3c69dcFF018766c72449cd460Cc7AF8863056a43","0x80292D35789462aeD1D694899f1FaAE184Fe3E5b","0x936c137699230c4732d534c7E968cC7cEAa6Cf45","0xFC57b0947C079073A1C5Fe61887Eb3495972EE72","0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd","0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"]
      assignedPermissions.owner:
-        ["0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE"]
      assignedPermissions.upgrade:
+        ["0x936c137699230c4732d534c7E968cC7cEAa6Cf45","0xFC57b0947C079073A1C5Fe61887Eb3495972EE72","0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01","0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF","0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd","0x3c69dcFF018766c72449cd460Cc7AF8863056a43","0x80292D35789462aeD1D694899f1FaAE184Fe3E5b"]
      assignedPermissions.configure:
+        ["0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE"]
    }
```

```diff
    contract HamMultisig2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"]
      assignedPermissions.configure:
+        ["0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"]
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9","0x356000Cec4fC967f8FC372381D983426760A0391","0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9","0x356000Cec4fC967f8FC372381D983426760A0391","0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x05d0893d8cadd2b6f0bf619fe90c1fee304254d8

# Diff at Wed, 31 Jul 2024 16:59:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 17827903

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract HamMultisig1 (0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA)
    +++ description: It can act on behalf of 0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49, inheriting its permissions.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x3c69dcFF018766c72449cd460Cc7AF8863056a43)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x3Ef6ce577FC438591d6C683E7a6Ea9e14A8f2d36)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49)
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract HamMultisig2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d)
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract AddressManager (0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```
