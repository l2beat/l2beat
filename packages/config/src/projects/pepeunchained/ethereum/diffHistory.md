Generated with discovered.json: 0xcba398ba072c0c68a565eacd78b667153fd85ddb

# Diff at Tue, 04 Mar 2025 11:26:08 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21894981
- current block number: 21894981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21894981 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0x6870cc88fdec3d9f181a85247370469ffff9f0c8

# Diff at Tue, 04 Mar 2025 10:39:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21894981
- current block number: 21894981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21894981 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        21314015
    }
```

```diff
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49) {
    +++ description: None
      sinceBlock:
+        21314014
    }
```

```diff
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21314015
    }
```

```diff
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        21314015
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21314015
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
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21314015
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
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21314017
    }
```

```diff
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        21314017
    }
```

```diff
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21314014
    }
```

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21314015
    }
```

Generated with discovered.json: 0x2b73f94e639cf264857a0b01aa5b427a2c5aea2c

# Diff at Wed, 26 Feb 2025 10:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21894981
- current block number: 21894981

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21894981 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x43a781fae05bc530d11a404544d31bc8d3d6825e

# Diff at Fri, 21 Feb 2025 19:02:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21894981

## Description

First discovery. OpStack using Celestia for DA. DisputeGameFactory and related contracts are deployed but not used.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```
