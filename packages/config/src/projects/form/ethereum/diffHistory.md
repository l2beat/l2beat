Generated with discovered.json: 0xfe14f912f335cfcf7336e2f1b26a4460c29fb030

# Diff at Tue, 29 Apr 2025 08:19:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21916627
- current block number: 21916627

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916627 (main branch discovery), not current.

```diff
    contract AddressManager (0x15c249E46A2F924C2dB3A1560CF86729bAD1f07B) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","description":"set and change address mappings.","via":[{"address":"0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"}]}]
    }
```

```diff
    contract L2OutputOracle (0x4ccAAF69F41c5810cA875183648B577CaCf1F67E) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x76b7C4dfca62E9F44DD4F04b4a14ba9e84Aa5256","via":[]},{"permission":"propose","to":"0x8D882B43220A190779c2dF25901f9E089dd4fa7D","via":[]},{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"}]}]
    }
```

```diff
    contract OptimismPortal (0x4E259Ee5F4136408908160dD32295A5031Fa426F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[]},{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x6161C14A37Bc428401A011E5941330cD169a0255) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x65f0819c647E06C3191a8b2dd59031259746FB4F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"}]}]
    }
```

```diff
    contract SuperchainConfig (0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[]},{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"}]}]
    }
```

```diff
    contract SystemConfig (0x806d48562C224a1332F2De8CCb02DDe8E8a5549E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x5b99FB854eFA37aD4DCbFcCB94af09f5D4CFb32d","via":[]},{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","via":[{"address":"0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"}]}]
    }
```

```diff
    contract L1StandardBridge (0xdc20aA63D3DE59574E065957190D8f24e0F7B8Ba) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2bf43034b9559643e986A2fE3cE015a18247b904","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"}]}]
    }
```

Generated with discovered.json: 0x6ce5d076498ed418260cbd7b523ccb0e3db20d42

# Diff at Thu, 27 Mar 2025 11:14:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21916627
- current block number: 21916627

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916627 (main branch discovery), not current.

```diff
    contract AddressManager (0x15c249E46A2F924C2dB3A1560CF86729bAD1f07B) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x25a37db94fdf9485003f3a0408221395fbbd4faf

# Diff at Wed, 19 Mar 2025 13:04:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21916627
- current block number: 21916627

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916627 (main branch discovery), not current.

```diff
    contract undefined (0x76b7C4dfca62E9F44DD4F04b4a14ba9e84Aa5256) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0x8D882B43220A190779c2dF25901f9E089dd4fa7D) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x736be0fee3f3362bbc9fbb26bbd61c6b63bf8d09

# Diff at Tue, 04 Mar 2025 11:25:42 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21916627
- current block number: 21916627

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916627 (main branch discovery), not current.

```diff
    contract SystemConfig (0x806d48562C224a1332F2De8CCb02DDe8E8a5549E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0x563d5e9f449fc7e18928e40336a3cd1afeccae43

# Diff at Tue, 04 Mar 2025 10:39:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21916627
- current block number: 21916627

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916627 (main branch discovery), not current.

```diff
    contract AddressManager (0x15c249E46A2F924C2dB3A1560CF86729bAD1f07B) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21337905
    }
```

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      sinceBlock:
+        20367195
    }
```

```diff
    contract L2OutputOracle (0x4ccAAF69F41c5810cA875183648B577CaCf1F67E) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        21337906
    }
```

```diff
    contract OptimismPortal (0x4E259Ee5F4136408908160dD32295A5031Fa426F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        21337905
    }
```

```diff
    contract L1ERC721Bridge (0x6161C14A37Bc428401A011E5941330cD169a0255) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21337905
    }
```

```diff
    contract OptimismMintableERC20Factory (0x65f0819c647E06C3191a8b2dd59031259746FB4F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21337905
    }
```

```diff
    contract SuperchainConfig (0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        21337905
    }
```

```diff
    contract SystemConfig (0x806d48562C224a1332F2De8CCb02DDe8E8a5549E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21337905
    }
```

```diff
    contract ProxyAdmin (0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8) {
    +++ description: None
      sinceBlock:
+        21337905
    }
```

```diff
    contract L1StandardBridge (0xdc20aA63D3DE59574E065957190D8f24e0F7B8Ba) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21337905
    }
```

```diff
    contract L1CrossDomainMessenger (0xF333158DCCad1dF6C3F0a3aEe8BC31fA94d9eD5c) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21337905
    }
```

Generated with discovered.json: 0xbc454f94f0b56194761c5e2293d712c321b3657e

# Diff at Wed, 26 Feb 2025 10:32:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21916627
- current block number: 21916627

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916627 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x4ccAAF69F41c5810cA875183648B577CaCf1F67E) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal (0x4E259Ee5F4136408908160dD32295A5031Fa426F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x6161C14A37Bc428401A011E5941330cD169a0255) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SuperchainConfig (0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SystemConfig (0x806d48562C224a1332F2De8CCb02DDe8E8a5549E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0xdc20aA63D3DE59574E065957190D8f24e0F7B8Ba) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1CrossDomainMessenger (0xF333158DCCad1dF6C3F0a3aEe8BC31fA94d9eD5c) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xb3a795411023998accc5fb931a30edd019a7aef2

# Diff at Mon, 24 Feb 2025 14:17:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21916627

## Description

Initial discovery of an op stack optimium with unused DisputeGameFactory (uses L2OutputOracle).

## Initial discovery

```diff
+   Status: CREATED
    contract AddressManager (0x15c249E46A2F924C2dB3A1560CF86729bAD1f07B)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x4ccAAF69F41c5810cA875183648B577CaCf1F67E)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x4E259Ee5F4136408908160dD32295A5031Fa426F)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x6161C14A37Bc428401A011E5941330cD169a0255)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x65f0819c647E06C3191a8b2dd59031259746FB4F)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x806d48562C224a1332F2De8CCb02DDe8E8a5549E)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xdc20aA63D3DE59574E065957190D8f24e0F7B8Ba)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xF333158DCCad1dF6C3F0a3aEe8BC31fA94d9eD5c)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
