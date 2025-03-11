Generated with discovered.json: 0xdce0ced3011dd542ca0f4fb1dd2f7badcf931731

# Diff at Tue, 04 Mar 2025 11:27:13 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 22580368
- current block number: 22580368

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580368 (main branch discovery), not current.

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0x55403a515c51393b56e3c38ec595854a6fc803c9

# Diff at Tue, 04 Mar 2025 10:40:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 22580368
- current block number: 22580368

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580368 (main branch discovery), not current.

```diff
    contract HamMultisig1 (0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA) {
    +++ description: None
      sinceBlock:
+        13908601
    }
```

```diff
    contract L2OutputOracle (0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        14901371
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3c69dcFF018766c72449cd460Cc7AF8863056a43) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        14901360
    }
```

```diff
    contract L1CrossDomainMessenger (0x3Ef6ce577FC438591d6C683E7a6Ea9e14A8f2d36) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        14901357
    }
```

```diff
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49) {
    +++ description: None
      sinceBlock:
+        14901322
    }
```

```diff
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        14901364
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      sinceBlock:
+        14896961
    }
```

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        14901353
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        14901349
    }
```

```diff
    contract AddressManager (0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        14901318
    }
```

```diff
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        14901346
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        14901332
    }
```

Generated with discovered.json: 0xd8eaa4079c583de936dfdfa0c256cb68dcd0ea4d

# Diff at Wed, 26 Feb 2025 10:33:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 22580368
- current block number: 22580368

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580368 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x3Ef6ce577FC438591d6C683E7a6Ea9e14A8f2d36) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0x35265e56d5c3fa25fb3036926d209b23e4bbe783

# Diff at Fri, 21 Feb 2025 14:13:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 22580368
- current block number: 22580368

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580368 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xb4f03582b712918d5e715dfe2d04e634eeefbf7e

# Diff at Fri, 21 Feb 2025 09:00:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 22580368
- current block number: 22580368

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580368 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x3Ef6ce577FC438591d6C683E7a6Ea9e14A8f2d36) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0x5fe1a863e505d37c0ddca042e42782719e78903d

# Diff at Mon, 10 Feb 2025 19:05:23 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 22580368
- current block number: 22580368

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580368 (main branch discovery), not current.

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x8a775e58fd1a71355edcd3d84b77dac34bdfcff8

# Diff at Tue, 04 Feb 2025 12:34:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 22580368
- current block number: 22580368

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580368 (main branch discovery), not current.

```diff
    contract HamMultisig1 (0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      receivedPermissions.2.permission:
-        "guard"
+        "interact"
      receivedPermissions.2.from:
-        "0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"
+        "0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"
      receivedPermissions.2.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.from:
-        "0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"
+        "0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"
      receivedPermissions.0.permission:
-        "configure"
+        "guard"
      receivedPermissions.0.from:
-        "0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"
+        "0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x25a932daf972fd5a3c6018118539ab5e556594db

# Diff at Mon, 20 Jan 2025 11:10:38 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 22580368
- current block number: 22580368

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580368 (main branch discovery), not current.

```diff
    contract HamMultisig1 (0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"
      receivedPermissions.7.from:
+        "0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"
      receivedPermissions.6.target:
-        "0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"
      receivedPermissions.6.from:
+        "0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"
      receivedPermissions.5.target:
-        "0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"
      receivedPermissions.5.from:
+        "0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"
      receivedPermissions.4.target:
-        "0x936c137699230c4732d534c7E968cC7cEAa6Cf45"
      receivedPermissions.4.from:
+        "0x936c137699230c4732d534c7E968cC7cEAa6Cf45"
      receivedPermissions.3.target:
-        "0x80292D35789462aeD1D694899f1FaAE184Fe3E5b"
      receivedPermissions.3.from:
+        "0x80292D35789462aeD1D694899f1FaAE184Fe3E5b"
      receivedPermissions.2.target:
-        "0x3c69dcFF018766c72449cd460Cc7AF8863056a43"
      receivedPermissions.2.from:
+        "0x3c69dcFF018766c72449cd460Cc7AF8863056a43"
      receivedPermissions.1.target:
-        "0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF"
      receivedPermissions.1.from:
+        "0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF"
      receivedPermissions.0.target:
-        "0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE"
      receivedPermissions.0.from:
+        "0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE"
      directlyReceivedPermissions.0.target:
-        "0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"
      directlyReceivedPermissions.0.from:
+        "0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49"
    }
```

```diff
    contract L2OutputOracle (0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.1.target:
-        "0x78c6285Cc98Ec52De9Cf2E40b763D509489C47fB"
      issuedPermissions.1.to:
+        "0x78c6285Cc98Ec52De9Cf2E40b763D509489C47fB"
      issuedPermissions.0.target:
-        "0x0458F33fEE56BE44f3e8482eE3009aAB27a19022"
      issuedPermissions.0.to:
+        "0x0458F33fEE56BE44f3e8482eE3009aAB27a19022"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3c69dcFF018766c72449cd460Cc7AF8863056a43) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
    }
```

```diff
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"
      directlyReceivedPermissions.7.from:
+        "0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"
      directlyReceivedPermissions.6.target:
-        "0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"
      directlyReceivedPermissions.6.from:
+        "0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"
      directlyReceivedPermissions.5.target:
-        "0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"
      directlyReceivedPermissions.5.from:
+        "0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"
      directlyReceivedPermissions.4.target:
-        "0x936c137699230c4732d534c7E968cC7cEAa6Cf45"
      directlyReceivedPermissions.4.from:
+        "0x936c137699230c4732d534c7E968cC7cEAa6Cf45"
      directlyReceivedPermissions.3.target:
-        "0x80292D35789462aeD1D694899f1FaAE184Fe3E5b"
      directlyReceivedPermissions.3.from:
+        "0x80292D35789462aeD1D694899f1FaAE184Fe3E5b"
      directlyReceivedPermissions.2.target:
-        "0x3c69dcFF018766c72449cd460Cc7AF8863056a43"
      directlyReceivedPermissions.2.from:
+        "0x3c69dcFF018766c72449cd460Cc7AF8863056a43"
      directlyReceivedPermissions.1.target:
-        "0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF"
      directlyReceivedPermissions.1.from:
+        "0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF"
      directlyReceivedPermissions.0.target:
-        "0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE"
      directlyReceivedPermissions.0.from:
+        "0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE"
    }
```

```diff
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      receivedPermissions.2.target:
-        "0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"
      receivedPermissions.2.from:
+        "0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"
      receivedPermissions.1.target:
-        "0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"
      receivedPermissions.1.from:
+        "0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"
      receivedPermissions.0.target:
-        "0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"
      receivedPermissions.0.from:
+        "0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd"
    }
```

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.1.target:
-        "0x0A6F4A53a014774da6698Ed6C90b8c7a4f934eDC"
      issuedPermissions.1.to:
+        "0x0A6F4A53a014774da6698Ed6C90b8c7a4f934eDC"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract AddressManager (0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
    }
```

Generated with discovered.json: 0x5f208b40b772b0ded69196c0f29a6c1fb60dca23

# Diff at Wed, 08 Jan 2025 09:09:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 22580368
- current block number: 22580368

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580368 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x8c5f2b14153a67607e46a8507f77d7de7d433119

# Diff at Mon, 18 Nov 2024 17:14:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b54f69b0d6666908da980a31e5f52da87009f1ab block: 17827903
- current block number: 22580368

## Description

Signer changes, gas limit raised.

## Watched changes

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      values.$members.3:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
      values.$threshold:
-        3
+        2
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "2 of 3 (67%)"
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        30000000
+        45000000
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17827903 (main branch discovery), not current.

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      name:
-        "HamMultisig2"
+        "Caldera Multisig 2"
    }
```

Generated with discovered.json: 0x4d55f2d920b7cd616e93c2536e16e16254aa5069

# Diff at Fri, 01 Nov 2024 12:24:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 17827903
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
      receivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49) {
    +++ description: None
      directlyReceivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0x5e58a3cf88a9aaf5130c60df4c3b1ed545bcf4ab

# Diff at Tue, 29 Oct 2024 13:23:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 17827903
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
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xd358bc491cf3406660ca41be3d97de27c76a27fa

# Diff at Tue, 22 Oct 2024 13:52:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 17827903
- current block number: 17827903

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17827903 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfigFake"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0xd691fdc8633eca0807ca64f5eb4d3681404c7f1d

# Diff at Mon, 21 Oct 2024 12:52:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 17827903
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
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3c69dcFF018766c72449cd460Cc7AF8863056a43) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract L1CrossDomainMessenger (0x3Ef6ce577FC438591d6C683E7a6Ea9e14A8f2d36) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract AddressManager (0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0x41bcee427b32aa5da75ae9c0f3d754aa7e612f7e

# Diff at Mon, 21 Oct 2024 11:14:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 17827903
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
      values.$pastUpgrades.0.2:
+        ["0x19652082F846171168Daf378C4fD3ee85a0D4A60"]
      values.$pastUpgrades.0.1:
-        ["0x19652082F846171168Daf378C4fD3ee85a0D4A60"]
+        "0x9ea11b31894d2bf3251c700994abead83796bb78614a070915888e78560c236b"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3c69dcFF018766c72449cd460Cc7AF8863056a43) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0x39Aea2Dd53f2d01c15877aCc2791af6BDD7aD567"]
      values.$pastUpgrades.0.1:
-        ["0x39Aea2Dd53f2d01c15877aCc2791af6BDD7aD567"]
+        "0x89f9c6e5586f9637baedc32cb97e79315a6af667f9e7767b3db6bf8ce361c010"
    }
```

```diff
    contract L1CrossDomainMessenger (0x3Ef6ce577FC438591d6C683E7a6Ea9e14A8f2d36) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.0.2:
+        ["0x71fA82Ea96672797954C28032b337aA40AAFC99f"]
      values.$pastUpgrades.0.1:
-        ["0x71fA82Ea96672797954C28032b337aA40AAFC99f"]
+        "0xb6d901dc78d5088d2ba10de8eedada81bb3db6500828850a9e6c4b113ca2374f"
    }
```

```diff
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x44637A4292E0CD2B17A55d5F6B2F05AFcAcD0586"]
      values.$pastUpgrades.0.1:
-        ["0x44637A4292E0CD2B17A55d5F6B2F05AFcAcD0586"]
+        "0x9441f48bb54bd085778dc94e29ad08d9e7074cff5462073c68e1498b4442f43a"
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0xffbA8944650e26653823658d76A122946F27e2f2"]
      values.$pastUpgrades.0.1:
-        ["0xffbA8944650e26653823658d76A122946F27e2f2"]
+        "0xededf667030eaa9c9643b9a63224c23f3333c9036627ab98e3ff5f4dd7f783ef"
    }
```

```diff
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0xCEa36be2e9724d88cB107C552c602a8025DB88bA"]
      values.$pastUpgrades.0.1:
-        ["0xCEa36be2e9724d88cB107C552c602a8025DB88bA"]
+        "0x7bbcb9291fc7aef835e6ee5cacd77d4eaf750607a99088fbe6b2094970957b7d"
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.0.2:
+        ["0x068E44eB31e111028c41598E4535be7468674D0A"]
      values.$pastUpgrades.0.1:
-        ["0x068E44eB31e111028c41598E4535be7468674D0A"]
+        "0x487b2546b470edefdee57bb28326107fbdf391ff159befe30caf5f2896d87f3d"
    }
```

Generated with discovered.json: 0xd9609e9776d4688d6f152062b265eb562c887b22

# Diff at Wed, 16 Oct 2024 11:45:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 17827903
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
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA","via":[{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x78c6285Cc98Ec52De9Cf2E40b763D509489C47fB","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
+        "0x0458F33fEE56BE44f3e8482eE3009aAB27a19022"
      issuedPermissions.0.via.0:
-        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}
    }
```

```diff
    contract HamMultisig2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      roles:
-        ["Guardian"]
      receivedPermissions.2:
+        {"permission":"guard","target":"0xFC57b0947C079073A1C5Fe61887Eb3495972EE72"}
      receivedPermissions.1:
+        {"permission":"guard","target":"0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01"}
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA","via":[{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
+        "0x0A6F4A53a014774da6698Ed6C90b8c7a4f934eDC"
      issuedPermissions.1.via.0:
-        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}
    }
```

```diff
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA","via":[{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.via.0:
-        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA","via":[{"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x211A8defcF685E0Ef5Ed8eEf0c43dc1B0ba56aEA"
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.via.0:
-        {"address":"0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49","delay":0}
    }
```

Generated with discovered.json: 0x0c84071f3a21f7d5399aa4de4664114ea88d8353

# Diff at Mon, 14 Oct 2024 10:59:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 17827903
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
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract L2OutputOracle (0x38893659CF2b4b3E02B2dC93fe9A55Ea155a3daF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x60ebf53dd49973efa525783a0716f706ac120b1ee0443943732fe5c97dd4959e","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3c69dcFF018766c72449cd460Cc7AF8863056a43) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x60ebf53dd49973efa525783a0716f706ac120b1ee0443943732fe5c97dd4959e","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x3Ef6ce577FC438591d6C683E7a6Ea9e14A8f2d36) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x0f1d8bf933c0c0c46123cb5280a294a6d89fdaea823e25784f8a58da99bad653"]
    }
```

```diff
    contract ProxyAdmin (0x5eC25263F8a79F8D5fF7bD5F493640b6E2627B49) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L1ERC721Bridge (0x80292D35789462aeD1D694899f1FaAE184Fe3E5b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x60ebf53dd49973efa525783a0716f706ac120b1ee0443943732fe5c97dd4959e","0x213ec4c2cba8ee3e5261dea43660185830da2ba624da6cd1bcd3c342732b576e"]
    }
```

```diff
    contract HamMultisig2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract L1StandardBridge (0x936c137699230c4732d534c7E968cC7cEAa6Cf45) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0xc2e94acadb171d22697955d74c58f48ceba2c8f3f9ea347b7f5a92f57181e178"]
    }
```

```diff
    contract SystemConfig (0xad22377De22537e4e6bd192AeBCa524a79B0d3Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x60ebf53dd49973efa525783a0716f706ac120b1ee0443943732fe5c97dd4959e","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract AddressManager (0xd2e0532f8AE8DeDA4b9Ad2CB79f008C97c9C25eE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract OptimismPortal (0xdD83c537B35d98776913D7ab60EBaA5c28F9dD01) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x60ebf53dd49973efa525783a0716f706ac120b1ee0443943732fe5c97dd4959e","0x6e489861cb95dc8cd7a9c4b516a6588bc69b5ae094a652879afc52f8ef7f1959"]
    }
```

```diff
    contract SuperchainConfig (0xFC57b0947C079073A1C5Fe61887Eb3495972EE72) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x60ebf53dd49973efa525783a0716f706ac120b1ee0443943732fe5c97dd4959e","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

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
