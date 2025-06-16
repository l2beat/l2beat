Generated with discovered.json: 0x12da9cf7ec85729c29bd41ad99d71e77b6b88b24

# Diff at Mon, 16 Jun 2025 08:41:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 21916627
- current block number: 21916627

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916627 (main branch discovery), not current.

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0x4ccAAF69F41c5810cA875183648B577CaCf1F67E","role":"admin","via":[{"address":"ethereum:0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"}]}
      receivedPermissions.10.from:
-        "ethereum:0x4ccAAF69F41c5810cA875183648B577CaCf1F67E"
+        "ethereum:0x6161C14A37Bc428401A011E5941330cD169a0255"
      receivedPermissions.9.from:
-        "ethereum:0x6161C14A37Bc428401A011E5941330cD169a0255"
+        "ethereum:0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e"
      receivedPermissions.8.from:
-        "ethereum:0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e"
+        "ethereum:0x4E259Ee5F4136408908160dD32295A5031Fa426F"
      receivedPermissions.7.from:
-        "ethereum:0x4E259Ee5F4136408908160dD32295A5031Fa426F"
+        "ethereum:0xF333158DCCad1dF6C3F0a3aEe8BC31fA94d9eD5c"
    }
```

```diff
    contract ProxyAdmin (0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0x4ccAAF69F41c5810cA875183648B577CaCf1F67E","role":"admin"}
      directlyReceivedPermissions.7.from:
-        "ethereum:0x4ccAAF69F41c5810cA875183648B577CaCf1F67E"
+        "ethereum:0x6161C14A37Bc428401A011E5941330cD169a0255"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x6161C14A37Bc428401A011E5941330cD169a0255"
+        "ethereum:0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e"
+        "ethereum:0x4E259Ee5F4136408908160dD32295A5031Fa426F"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x4E259Ee5F4136408908160dD32295A5031Fa426F"
+        "ethereum:0xF333158DCCad1dF6C3F0a3aEe8BC31fA94d9eD5c"
    }
```

```diff
    contract L1CrossDomainMessenger (0xF333158DCCad1dF6C3F0a3aEe8BC31fA94d9eD5c) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"
    }
```

Generated with discovered.json: 0x4840c2b0d2cc9e4a11b5ff639b269f51dd5cf180

# Diff at Fri, 30 May 2025 06:58:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 21916627
- current block number: 21916627

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916627 (main branch discovery), not current.

```diff
    contract SystemConfig (0x806d48562C224a1332F2De8CCb02DDe8E8a5549E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0xe314fa12c9910a77dea8358027703123d89876a2

# Diff at Fri, 23 May 2025 09:40:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21916627
- current block number: 21916627

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21916627 (main branch discovery), not current.

```diff
    contract Caldera Multisig 3 (0x2bf43034b9559643e986A2fE3cE015a18247b904) {
    +++ description: None
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.6.from:
-        "0x806d48562C224a1332F2De8CCb02DDe8E8a5549E"
+        "0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e"
      receivedPermissions.6.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.6.via:
+        [{"address":"0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"}]
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0x15c249E46A2F924C2dB3A1560CF86729bAD1f07B"
+        "0x4E259Ee5F4136408908160dD32295A5031Fa426F"
      receivedPermissions.5.description:
-        "set and change address mappings."
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e"
+        "0x806d48562C224a1332F2De8CCb02DDe8E8a5549E"
      receivedPermissions.4.via:
-        [{"address":"0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8"}]
      receivedPermissions.4.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.4.role:
+        ".owner"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x4E259Ee5F4136408908160dD32295A5031Fa426F"
+        "0x15c249E46A2F924C2dB3A1560CF86729bAD1f07B"
      receivedPermissions.3.description:
+        "set and change address mappings."
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.role:
+        ".guardian"
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x5b99FB854eFA37aD4DCbFcCB94af09f5D4CFb32d) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    EOA  (0x76b7C4dfca62E9F44DD4F04b4a14ba9e84Aa5256) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"challenge","from":"0x4ccAAF69F41c5810cA875183648B577CaCf1F67E","role":".CHALLENGER"}
      receivedPermissions.0.role:
+        ".challenger"
    }
```

```diff
    EOA  (0x8D882B43220A190779c2dF25901f9E089dd4fa7D) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0x4ccAAF69F41c5810cA875183648B577CaCf1F67E","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    contract ProxyAdmin (0xb7e0a0507cAfD755B3527Aa1F8b7449222A79Cf8) {
    +++ description: None
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.3.from:
-        "0x15c249E46A2F924C2dB3A1560CF86729bAD1f07B"
+        "0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e"
      directlyReceivedPermissions.3.description:
-        "set and change address mappings."
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0x7280d2BFd18aa1383C2218E6Bb2964bA8287c66e"
+        "0x4E259Ee5F4136408908160dD32295A5031Fa426F"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.1.from:
-        "0x4E259Ee5F4136408908160dD32295A5031Fa426F"
+        "0x15c249E46A2F924C2dB3A1560CF86729bAD1f07B"
      directlyReceivedPermissions.1.description:
+        "set and change address mappings."
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

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
